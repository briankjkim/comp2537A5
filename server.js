const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

var session = require('express-session')


// Use the session middleware
app.use(session({
    secret: 'ssshhhhh',
    saveUninitialized: true,
    resave: true
}));

function auth1(req, res, next) {
    if (req.session.authenticated)
        next()
    else {
        res.redirect('/login')
    }
}


users = [{
    username: "user1",
    password: "pass1",
    admin: true,
}, {
    username: "user2",
    password: "pass2",
    admin: false,
}]


const bodyparser = require('body-parser');

app.use(bodyparser.urlencoded({
    extends: true
}));


// const mongoose = require('mongoose')  // mongoDB 
// mongoose.connect(config.mongoURI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false}).then(() => console.log('MongoDB Connected...'))
// .catch(err => console.log(err))



// open the port for nodemon and heroku
app.listen(process.env.PORT || 5000, function (err) {
    if (err)
        console.log(err);
})


app.get('/', auth1, function (req, res) {
    res.sendFile(__dirname + '/public/index.html')
})


app.get('/login/', function (req, res, next) {
    res.send("Please provide the credentials through the URL")
})


app.get('/login/:user/:pass', function (req, res, next) {
    if (users.filter((user) => {
            return user.username == req.params.user
        })[0].password == req.params.pass)
    // if (users[req.params.user] == req.params.pass) 
    {
        req.session.authenticated = true
        req.session.user = req.params.user
        // res.send("Successful Login!")
        res.redirect('/public/index.html');
    } else {
        req.session.authenticated = false
        res.send("Failed Login!")
    }

})


app.use(express.static('./public'));