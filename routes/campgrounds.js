var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

// ================================================================
// ==============       CAMPGROUND ROUTES       ===================
// ================================================================
router.get("/campgrounds", function(req, res) {
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

// CREATE route - create new campground and add to database
router.post("/campgrounds", function(req, res) {
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

// GET requests to /campgrounds/new
router.get("/campgrounds/new", function(req, res) {
    res.render("campgrounds/new");
});

// SHOW route - shows more info about one campground
router.get("/campgrounds/:id", function(req, res) {
    // find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            // Render show template
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

module.exports = router;