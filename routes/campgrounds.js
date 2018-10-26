var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
var geocoder = require('geocoder');
var { isLoggedIn, checkCampgroundOwnership, checkCommentOwnership, isAdmin, isSafe } = middleware;

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

router.get("/campgrounds", function(req, res) {
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
});

// CREATE route - create new campground and add to database
router.post("/campgrounds", middleware.isLoggedIn, function(req, res) {
    // Get data from form and add to campgrounds array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var cost = req.body.cost;
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || data.status === 'ZERO_RESULTS') {
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newCampground = {name: name, price: price, image: image, description: desc, author: author, location: location, lat: lat, lng: lng};
    // Create a new campground and save to DB
        Campground.create(newCampground, function(err, newlyCreated){
            if (err) {
                console.log(err);
            } else {
            // Redirect back to campgrounds page
                res.redirect("/campgrounds", {campgrounds: newlyCreated, currentUser: req.user});
            }
        });
    });
});

// GET requests to /campgrounds/new
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new", {currentUser: req.user});
});

// SHOW route - shows more info about one campground
router.get("/campgrounds/:id", function(req, res) {
    // find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            // Render show template
            res.render("campgrounds/show", {campground: foundCampground, currentUser: req.user});
        }
    });
});

// Edit
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        res.render("campgrounds/edit", {campground: foundCampground, currentUser: req.user});
    });
});
// Update
router.put("/campgrounds/:id", isSafe, function(req, res){
    geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = {name: req.body.name, image: req.body.image, description: req.body.description, cost: req.body.price, location: location, lat: lat, lng: lng};
    Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
  });
});
// Destroy
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;