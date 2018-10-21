var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose")
    
mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// SCHEMA Setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});
var Campground = mongoose.model("Campground", campgroundSchema);

// INDEX route - show all campgrounds
app.get("/", function(req, res) {
    res.render("landing");
});

// var campgrounds = [
//             {name: "Salmon Creek", image:"https://pixabay.com/get/eb3db30a29fd063ed1584d05fb1d4e97e07ee3d21cac104491f0c178a4ecb6be_340.jpg"},
//             {name: "Granite Hill", image:"https://pixabay.com/get/e833b3092cf5033ed1584d05fb1d4e97e07ee3d21cac104491f0c178a4ecb6be_340.jpg"},
//             {name: "Moiuntain Goat's Rest", image:"https://pixabay.com/get/e834b70c2cf5083ed1584d05fb1d4e97e07ee3d21cac104491f0c178a4ecb6be_340.jpg"}
//     ];


// CREATE route - add new campground to the database
app.get("/campgrounds", function(req, res) {
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("index", {campgrounds: allCampgrounds});
        }
    });
});

// NEW route - show form to create new campground
app.post("/campgrounds", function(req, res) {
    // Get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if (err) {
            console.log(err);
        } else {
            // Redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

// Get Request to /campgrounds/new
app.get("/campgrounds/new", function(req, res) {
    res.render("new");
});

// SHOW route - shows more info about one campground
app.get("/campgrounds/:id", function(req, res) {
    // find the campground with provided ID
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            // Render show template
            res.render("show", {campground: foundCampground});
        }
    });
});


// Fires up the app
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Yelp Camp has Started");
});