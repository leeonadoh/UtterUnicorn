"use strict";

// Implement the eatz API:
var mongoose = require('mongoose'); // MongoDB integration

var fs = require('fs'),
    // GraphicsMagick (gm) for Node is used to resize user-supplied images
    gm = require('gm').subClass({imageMagick: true}),
    config = require(__dirname + '/../config'),  // port#, other params
    express = require("express"),
    bcrypt = require("bcrypt");

// Connect to database, using credentials specified in your config module
mongoose.connect("mongodb://" + config.dbuser + ":" + config.dbpass +
            "@" + config.dbhost + "/" + config.dbname);

// Schemas
var DishScheme = new mongoose.Schema({
    image: { type: String, required: true },
    name: { type: String, required: true },
    venue: { type: String, required: true },
    info: { type: String, required: false },
    numbr: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    url: { type: String, required: false }
    // ADD CODE for other Dish attributes
});

var User = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true}
});

// each name:venue pair must be unique; duplicates are dropped
//Dish.index(...);  // ADD CODE

// Models
var DishModel = mongoose.model('Dish', DishScheme);
var UserModel = mongoose.model("User", User);

// "exports" is used to make the associated name visible
// to modules that "require" this file (in particular app.js)

// heartbeat response for server API
exports.api = function(req, res){
  res.send(200, '<h3>Eatz API is running!</h3>');
};

// Sign up a new user.
exports.signup = function(req, res) {
    var user = new UserModel(req.body);  // instantiate model with request attributes
    // generate random salt value for new username
    bcrypt.genSalt(10, function(err, salt) {
        // secure hash of user password with salt value
        bcrypt.hash(user.password, salt, function(err, hash) {
            user.password = hash;  // hash encodes both hash-result and salt
            // create DB record for new username
            user.save(function (err, result) {
                if (!err) {  // save successful, result contains saved user model
                    req.session.auth = true;
                    req.session.username = result.username;
                    req.session.userid = result.id;
                    res.send({"username": result.username, "userid": result.id});
                } else {  // save failed
                    // could alternatively detect duplicate username using find()
                    if (err.err.indexOf("E11000") != -1) {  // duplicate username error
                        res.send(403, "Sorry, username <b>"+user.username+"</b> is already taken");
                    } else {  // any other DB error
                        res.send(500, "Unable to create account at this time. Try again later. " + err.message);
                    }
                }
            });
        });
    });
};

// Check if the user is authenticated.
exports.isAuthenticated = function(req, res) {
    console.log("Recieved authentication check.");
    console.log(req.session);
    // Ensure all fields non-empty or true.
    if ((req.session.auth && req.session.username && req.session.userid)){
        // Double check by executing search on MongoDB for user id. 
        UserModel.findById(req.session.userid, function(err, result){
            if (err){ // Error.
                res.send(500, "We cannot authenticate you at this time. Try again later. " + err.message);
            } else if (res){ // User is found. Client is valid and authorized.
                res.send({"username": result.username, "userid": result.id, "status": "authorized"});
            } else { // Client must have tampered with cookie. Not authorized.
                res.send({"username": "", "userid": "", "status": "userid not in database"});
            }
        });
    } else { // Client most likely timed out. Not authorized.
        res.send({"username": "", "userid": "", "status": "unauthorized"});
    }
};

exports.logInOrOff = function(req, res) {
    if (req.body.login){ // Is login request.
        UserModel.findOne({username: req.body.username}, function(qErr, qRes){
            if (qErr){ // error
                res.send(500, "Unable to log you in at this time. Try again later.");
                console.log(qErr.message);
            } else if (qRes) { // User found. Validate session if password match.
                // Use bcrypt to 
                bcrypt.compare(req.body.password, qRes.password, function(bErr, bRes){
                    if (bRes){ // Successful login.
                        req.session.auth = true;
                        req.session.username = qRes.username;
                        req.session.userid = qRes.id;
                        res.send({"username": qRes.username, "userid": qRes.id});
                    } else { // Password did not match.
                        res.send("403", "You've entered the wrong password - try again!");
                    }
                });
            } else { // No such user.
                res.send("403", "Your user name doesn't exist - sign up!");
            }
        });
    } else { // Is logout request. 
        req.session.auth = false;
        delete req.session.username;
        delete req.session.userid;
        res.send({"username": "", "userid": ""});
    }
};

// retrieve an individual dish model, using it's id as a DB key
exports.getDish = function(req, res){
    DishModel.findById(req.params.id, function(err, dish) {
        if (err) {
            res.send(500, "Sorry, unable to retrieve dish at this time (" +err.message+ ")" );
        } else if (!dish) {
            res.send(404, "Sorry, that dish doesn't exist; try reselecting from browse view");
        } else {
            res.send(200, dish);
        }
    });
};

exports.uploadImage = function (req, res) {
    // req.files is an object, attribute "file" is the HTML-input name attr
    var filePath = req.files.file.path,   // ADD CODE
        tmpFile = filePath.split("/"),  // ADD CODE to extract root file name 
        tmpFile = tmpFile[tmpFile.length-1],
        tmpFile = tmpFile.split(".")[0],
        imageURL = 'public/img/uploads/' + tmpFile,
        writeStream = __dirname.substring(0, __dirname.indexOf("routes")) + imageURL;   // ADD CODE
        console.log(writeStream);
    // process EditView image
    gm(filePath)
    .resize('360', '270', '^')
    .gravity('Center')
    .crop('360', '270')
    .write(writeStream + "360x270.png", function(err) {  // ADD CODE
        if (!err) {
            gm(filePath)
            .resize('240', '180', '^')
            .gravity('Center')
            .crop('240', '180')
            .write(writeStream + "240x180.png", function(err) {  // ADD CODE
                if (!err) {
                    console.log("resize success");
                    fs.unlinkSync(filePath);
                    res.send(200, tmpFile);
                } else {
                }
            });
        } else {
        }
    });
};

// retrieve an individual dish model, using it's id as a DB key
exports.getDish = function(req, res){
    DishModel.findById(req.params.id, function(err, dish) {
        if (err) {
            res.send(500, "Sorry, unable to retrieve dish at this time ("
                +err.message+ ")" );
        } else if (!dish) {
            res.send(404, "Sorry, that dish doesn't exist; try reselecting from browse view");
        } else {
            res.send(200, dish);
        }
    });
};

exports.getDishes = function(req, res){
    DishModel.find(function(err, dishes) {
        if (err) {
            res.send(500, "Sorry, unable to retrieve dish at this time ("
                +err.message+ ")" );
        } else if (!dishes) {
            res.send(404, "No dishes were found");
        } else {
            res.send(200, dishes);
        }
    });
};

exports.addDish = function(req, res){
    var dish = new DishModel();
    dish.image = req.body.image;
    dish.name = req.body.name;
    dish.venue = req.body.venue;
    dish.info = req.body.info;
    dish.numbr = req.body.numbr;
    dish.street = req.body.street;
    dish.city = req.body.city;
    dish.province = req.body.province;
    dish.url = req.body.url;
    console.log(req.body)
    dish.save(function (err, result) {
        if (!err){
            console.log(result.id);
            res.send(200, result);
        } else {
            console.log(err);
        }
    });
};

exports.editDish = function(req, res){
    DishModel.findById(req.params.id, function(err, dish) {
        dish.image = req.body.image;
        dish.name = req.body.name;
        dish.venue = req.body.venue;
        dish.info = req.body.info;
        dish.numbr = req.body.numbr;
        dish.street = req.body.street;
        dish.city = req.body.city;
        dish.province = req.body.province;
        dish.url = req.body.url;
        dish.save(function (err, result) {
        if (!err){
            console.log(result.id);
            res.send(200, result);
        } else {
            console.log(err);
        }
        });
    });
};

exports.deleteDish = function(req, res){
    DishModel.findById(req.params.id, function(err, dish) {
        if (!err) {
            if (dish.image != "img/placeholder"){
                fs.unlinkSync("public/img/uploads/" + dish.image + "360x270.png");
                fs.unlinkSync("public/img/uploads/" + dish.image + "240x180.png");
            }
            dish.remove(function () {
                res.send(200);
            });
        }
    });
}
