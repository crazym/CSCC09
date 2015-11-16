"use strict";

var fs = require('fs'),
// path is "../" since splat.js is in routes/ sub-dir
    config = require(__dirname + '/../config'),  // port#, other params
    express = require("express"),
    url = require("url");


var mongoose = require('mongoose'); // MongoDB integration

// Connect to database, using credentials specified in your config module
mongoose.connect('mongodb://' +config.dbuser+ ':' +config.dbpass+
    '@10.15.2.164/' + config.dbname);

// Schemas
var MovieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    director: { type: String, required: true },
    // TODO  ADD CODE for other Movie attributes
});

// Constraints
// each title:director pair must be unique; duplicates are dropped
MovieSchema.index({title:1,director:1}, { "unique": true });  // ???? ADD CODE

// Models
var MovieModel = mongoose.model('Movie', MovieSchema);


// Implemention of splat API handlers:

// "exports" is used to make the associated name visible
// to modules that "require" this file (in particular app.js)

// heartbeat response for server API
exports.api = function(req, res){
    res.status(200).send('<h3>Splat API is running!</h3>');
};

// retrieve an individual movie model, using it's id as a DB key
exports.getMovie = function(req, res){
    MovieModel.findById(req.params.id, function(err, movie) {
        if (err) {
            res.status(500).send("Sorry, unable to retrieve movie at this time ("
                +err.message+ ")" );
        } else if (!movie) {
            res.status(404).send("Sorry, that movie doesn't exist; try reselecting from Browse view");
        } else {
            res.status(200).send(movie);
        }
    });
};

