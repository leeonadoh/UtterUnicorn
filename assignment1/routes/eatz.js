"use strict";

// Implement the eatz API:

var fs = require('fs'),
    // GraphicsMagick (gm) for Node is used to resize user-supplied images
    gm = require('gm').subClass({imageMagick: true}),
    config = require(__dirname + '/../config'),  // port#, other params
    express = require("express");

// "exports" is used to make the associated name visible
// to modules that "require" this file (in particular app.js)

// heartbeat response for server API
exports.api = function(req, res){
  res.send(200, '<h3>Eatz API is running!</h3>');
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

exports.uploadImage = function (req, res) {
    // req.files is an object, attribute "file" is the HTML-input name attr
    var filePath = req.files.file/*,   // ADD CODE
        tmpFile = ...  // ADD CODE to extract root file name 
    	imageURL = 'img/uploads/' + tmpFile,
        writeStream = __dirname + ...   // ADD CODE
    // process EditView image
    gm(filePath).resize(...).write(... , function(err) {  // ADD CODE
	if (!err) {
    	    // ADD CODE process DishesView image and return image filename to client
	} else
	    // ADD CODE to return error result to client
    });

    // ADD CODE to remove any temp files*/
    console.log(filePath);
};

//MONGO
/*
var mongoose = require('mongoose'); // MongoDB integration

// Connect to database, using credentials specified in your config module
mongoose.connect(... config.db ...);

// Schemas
var Dish = new mongoose.Schema({
    name: { type: String, required: true },
    venue: { type: String, required: true },
    // ADD CODE for other Dish attributes
});
// each name:venue pair must be unique; duplicates are dropped
Dish.index(...);  // ADD CODE

// Models
var DishModel = mongoose.model('Dish', Dish);*/