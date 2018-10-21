var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose")
    
mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//     {
//         name: "Granite Hill", 
//         image:"https://pixabay.com/get/e833b3092cf5033ed1584d05fb1d4e97e07ee3d21cac104491f0c178a4ecb6be_340.jpg"
        
//     }, function(err, campground) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log("NEWLY CREATED CAMPGROUND: ");
//             console.log(campground);
//         }
//     });

app.get("/", function(req, res) {
    res.render("landing");
});

var campgrounds = [
            {name: "Salmon Creek", image:"https://pixabay.com/get/eb3db30a29fd063ed1584d05fb1d4e97e07ee3d21cac104491f0c178a4ecb6be_340.jpg"},
            {name: "Granite Hill", image:"https://pixabay.com/get/e833b3092cf5033ed1584d05fb1d4e97e07ee3d21cac104491f0c178a4ecb6be_340.jpg"},
            {name: "Moiuntain Goat's Rest", image:"https://pixabay.com/get/e834b70c2cf5083ed1584d05fb1d4e97e07ee3d21cac104491f0c178a4ecb6be_340.jpg"}
    ];

app.get("/campgrounds", function(req, res) {
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds", {campgrounds: allCampgrounds});
        }
    });
});

app.post("/campgrounds", function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
    
    Campground.create(newCampground, function(err, newlyCreated){
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

app.get("/campgrounds/new", function(req, res) {
    res.render("new.ejs");
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Started Yelp Camp");
});