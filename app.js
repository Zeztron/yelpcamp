var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    cookieParser    = require("cookie-parser"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds");

require('dotenv').load()

// Requiring routes
var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index");

//mongoose.connect((process.env.DATABASEURL), { useNewUrlParser: true });
mongoose.connect("mongodb://harsh:zeztron1994@ds237735.mlab.com:37735/yelcamp", { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine", "ejs");

// PASSPORT CONGIFURATION
app.use(require("express-session")({
    secret: "YelpCamp is the number one website for camping",
    resave: false,
    saveUninitialized: false
}));
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(indexRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);

//================== Fire up the app! ===================
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Yelp Camp has Started");
});
