const { db } = require('./models/user');
const user = require('./models/user');

const express = require('express'),
    app = express(),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User = require("./models/user");



app.use(require("express-session")({
    secret: "final attempt", //decode or encode session
    resave: false,
    saveUninitialized: false
}));


app.use(bodyParser.urlencoded({
    extends: true
}));


// open the port for nodemon and heroku
app.listen(process.env.PORT || 5000, function (err) {
    if (err)
        console.log(err);
})


app.set("view engine", "ejs");


// Connect to mongodb
const dbAddress = "mongodb+srv://kkjin0330:5VO1M61v9prYQEpp@cluster0.msyad.mongodb.net/hello"
mongoose
    .connect(dbAddress, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));


// Passport related items for login/auth
passport.serializeUser(User.serializeUser()); //session encoding
passport.deserializeUser(User.deserializeUser()); //session decoding
passport.use(new LocalStrategy(User.authenticate()));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(passport.initialize());
app.use(passport.session());


// Building routes
app.get("/", (req, res) => {
    res.render("home");
})

app.get("/userProfile", isLoggedIn, (req, res) => {
    res.render("userProfile", {
        username: req.user.username,
        userrole: req.user.admin
    });
})

app.get("/game", isLoggedIn, (req, res) => {
    res.redirect("index.html");
})


//Auth Routes
app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/userProfile",
    failureRedirect: "/login"
}), function (req, res) {});

app.get("/register", (req, res) => {
    res.render("register");
});


app.post("/register", (req, res) => {

    User.register(new User({
        username: req.body.username,
        admin: req.body.admin,
    }), req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            res.render("register");
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/login");
        })
    })
})


app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}



// Admin Event Routes
// READ timeline data from the server with GET Request
app.get('/admin/getAllUsers', function (req, res) {
    console.log("Received a GET request for user database");
    User.find({}, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        res.send(data);
    });
})

// CREATE a timeline event to the data with PUT Request
app.put('/admin/insert', function (req, res) {
    console.log("Received a PUT request to insert a timeline event to database");
    User.create({
        username: req.body.username,
        password: req.body.password,
        admin: req.body.admin,
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        res.send("A user is added");
    });
})

// Update a timeline event by incrementing hits
app.get('/admin/update/:id', function (req, res) {
    console.log(req.params.id + "Update request received")
    User.updateOne({
        _id: req.params.id
    }, {
        $inc: {
            age: 1
        }
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        res.send("Event is updated.");
    });
})

// Delete a timeline event from the database with GET Request
app.get('/admin/remove/:id', function (req, res) {
    console.log(`Remove request received for ${req.params.id}`)
    User.remove({
        _id: req.params.id
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        res.send("Event is deleted");
    });
})


// Route for displaying static pages in public folder
app.use(express.static('./public'));