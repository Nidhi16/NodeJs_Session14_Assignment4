var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
var session = require('express-session');

var users = require('./routes/router');
var User = require('./models/model');

var app = express();

app.use(session({
    secret: 'test rest',
    resave: false,
    saveUninitialized: true
}));


app.use(express.static(path.join(__dirname, 'static')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//connect to our database
//Ideally you will obtain DB details from a config file

var dbName='userDB';

var connectionString='mongodb://localhost:27017/'+dbName;

mongoose.connect(connectionString);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use('/api', users);

app.get("/", function(request, response) {
    var sessionData = request.session;
    var id = sessionData.user_id;

    if (!id) {
        response.redirect("/login");
    } else {
        User.findOne({"_id": id}, function (err, user) {
            if(err) {
                response.redirect("/login");
            } else {
                response.redirect("/api/profile");
            }
        });
    }
});

app.get("/login", function (request, response) {
    response.render('login');
});

app.post("/login", function (request, response) {
    var data = request.body;
    var data_username = request.body.username;
    var data_password = request.body.password;
    User.findOne({"username": data_username, "password": data_password}, function (err, result) {
        if (err) {
            response.send("Either username or password is wrong or may be both is wrong");
        } else {
            var sessionData = request.session;
            sessionData.user_id = result._id;
            response.redirect("/");
        }
    })
});

app.get("/signup", function(request, response) {
    response.render('signup');
});

app.post("/signup", function(request, response) {
    var data = request.body;
    var sessionData = request.session;
    var newUser = new User();

    newUser.first_name = data.first_name;
    newUser.last_name = data.last_name;
    newUser.username = data.username;
    newUser.password = data.password;

    newUser.save(function (err, user) {
        if (err) {
            response.send(err);
        } else {
            sessionData.user_id = user._id;
            response.redirect("/");
        }
    })
});

module.exports = app;