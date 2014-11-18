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
    website: { type: String, required: false },
    uid: { type: String, required: true},
});

var UserScheme = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true}
});

// each name:venue pair must be unique; duplicates are dropped
DishScheme.index({"name": 1, "venue": 1}, { unique: true});  // ADD CODE

// Models
var DishModel = mongoose.model('Dish', DishScheme);
var UserModel = mongoose.model("User", UserScheme);

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
                        res.send(403, "Username <b>"+user.username+"</b> is already taken - try another one.");
                    } else {  // any other DB error
                        res.send(500, "We couldn't create your account - try again later." + err.message);
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
                        if (req.body.extendSession){ // Remember me is ticked.
                            req.session.cookie.maxAge = 1000*60*10;
                        }
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
            res.send(500, "Sorry, unable to retrieve dish at this time (" +err.message+ ")" );
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
    console.log(req.body);
    if (!req.session.userid){
        res.send(403, "You don't seem to be logged in - sign in, or register!");
    } else {
        UserModel.findById(req.session.userid, function(err, result){
            if (err){ // Error.
                console.log(err);
                res.send(500, "We cannot authenticate you at this time- try again later.");
            } else if (res){ // User is found. Client is valid and authorized.
                var dish = new DishModel();
                dish.image = req.body.image;
                dish.name = req.body.name;
                dish.venue = req.body.venue;
                dish.info = req.body.info;
                dish.numbr = req.body.numbr;
                dish.street = req.body.street;
                dish.city = req.body.city;
                dish.province = req.body.province;
                dish.website = req.body.website;
                dish.uid = req.session.userid;
                dish.save(function (err, result) {
                    if (!err){
                        console.log(result.id);
                        res.send(200, result);
                    } else {
                        if (err.err.indexOf("E11000") != -1) {  // duplicate dish error
                            res.send(500, "The dish and venue you've specified already exists!")
                        } else {
                            console.log(err);
                            res.send(500, "We couldn't save your dish - try again later.");
                        }
                    }
                });
            } else { // Client must have tampered with cookie. Not authorized.
                res.send(403, "We don't recognize you " + req.session.username + ". Did you register?");
            }
        });
    }
};

exports.editDish = function(req, res){
    if (!req.session.userid){
        res.send(403, "You don't seem to be logged in - sign in, or register!");
    } else { // User is logged in. Have to check if user can edit this dish.
        DishModel.findById(req.params.id, function(err, dish){
            if (err){ // Error occured.
                res.send(500, "We couldn't edit your dish at this time - try again later.");
            } else if (!dish){ // Dish couldn't be found.
                res.send(404, "Your dish cannot be found - try refreshing your browser.");
            } else {
                if (dish.uid === req.session.userid){ // User is creator of this dish.
                    dish.image = req.body.image;
                    dish.name = req.body.name;
                    dish.venue = req.body.venue;
                    dish.info = req.body.info;
                    dish.numbr = req.body.numbr;
                    dish.street = req.body.street;
                    dish.city = req.body.city;
                    dish.province = req.body.province;
                    dish.website = req.body.website;
                    dish.save(function (saveError, saveResult){
                        if (!saveError){
                            console.log(saveResult.id);
                            res.send(200, saveResult);
                        } else {
                            console.log(saveError);
                            res.send(500, "We couldn't save your dish at this time - try again later.");
                        }
                    });
                } else { // User not authorized to edit dish.
                    res.send(403, "You didn't submit this dish - try editing dishes you've posted!");
                }
            }
        });
    }
};

exports.deleteDish = function(req, res){
    if (!req.session.userid){
        res.send(403, "You don't seem to be logged in - sign in, or register!");
    } else { // User is logged in. Have to check if user can delete this dish.
        DishModel.findById(req.params.id, function(err, dish) {
            if (err){
                res.send(500, "We couldn't remove your dish at this time - try again later.");
            } else if (!dish) { // Dish to remove isn't found.
                res.send(404, "Your dish cannot be found - try refreshing your browser.");
            } else { // Dish to remove found.
                if (dish.uid === req.session.userid){ // User authorized to delete dish.
                    if (dish.image != "img/placeholder"){
                        fs.unlinkSync("public/img/uploads/" + dish.image + "360x270.png");
                        fs.unlinkSync("public/img/uploads/" + dish.image + "240x180.png");
                    }
                    dish.remove(function(removeErr, removeRes) {
                        if (!removeError){
                            res.send(200);
                        } else {
                            console.log(removeErr);
                            res.send(500, "We couldn't remove your dish at this time - try again later.");
                        }
                    });
                } else { // User is not authorized.
                    res.send(403, "You didn't submit this dish - try deleting dishes you've posted!");
                }
            }
        });
    }
}
