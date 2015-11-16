"use strict";

var fs = require('fs'),
// path is "../" since splat.js is in routes/ sub-dir
    config = require(__dirname + '/../config'),  // port#, other params
    express = require("express"),
    url = require("url");

/* Set up MongoDB */
var mongoose = require('mongoose'); // MongoDB integration

// Connect to database, using credentials specified in your config module
mongoose.connect('mongodb://' +config.dbuser+ ':' +config.dbpass+
    '@10.15.2.164/' + config.dbname);

// Schemas
var MovieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    // ADD CODE for other Movie attributes
    released: { type: Number, required: true},
    director: { type: String, required: true },
    starring: { type: [String], required: true},
    rating: {type: String, required: true},
    duration: {type: Number, required: true},
    genre: {type: [String], required: true},
    synopsis: {type: String, required: true},
    freshTotal: {type: Number, required: true},
    freshVotes: {type: Number, required: true},
    trailer: {type: String},
    poster: {type: String, required: true},
    dated: {type: Date, required: true}
});

// Constraints
// each title:director pair must be unique; duplicates are dropped
MovieSchema.index({title:1,director:1}, { "unique": true });  // ???? ADD CODE

// Models
// MovieModel is a Model-constructor function that can
// be used to create instances of Movie model
var MovieModel = mongoose.model('Movie', MovieSchema);


// Implemention of splat API handlers:

// "exports" is used to make the associated name visible
// to modules that "require" this file (in particular app.js)

// heartbeat response for server API
exports.api = function(req, res){
    res.status(200).send('<h3>Splat API is running!</h3>');
};

// retrieve all Movie models on collection
exports.getMovies = function(req, res){
    MovieModel.find(function(err, movies) {
        if (!err) {
            res.status(200).send(movies);
        } else {
            res.status(404).send("Sorry, no movies found " + error.message);
        }
    });
};

//ADD CODE to support other routes listed on assignment handout

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

// add a new movie model to the movies collection
exports.addMovie = function(req, res){
    // TODO not sure how to insert (is req.body a json object?
    var movie = new MovieModel(req.body);
    // movie.save();
    // res.send(200, movie);
    // console.log(movie.id);
    // var fileName = "/img/uploads/"+movie.id
    // fs.writeFile(fileName, movie.poster, "base64", function(err, movie){
    //     movie.poster = fileName;
    //     movie.save(function(err, movie) {
    //         if (err) {
    //             res.status(500).send("Sorry, unable to retrieve movie at this time ("
    //                 +err.message+ ")" );
    //         } else if (!movie) {
    //             res.status(404).send("Sorry, that movie doesn't exist; try reselecting from Browse view");
    //         } else {
    //             res.status(200).send(movie);
    //         }
    //     });
    // })
    movie.save(function(err, movie) {
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

// update an individual movie model, using it's id as a DB key
exports.editMovie = function(req, res){

    MovieModel.findById(req.params.id, function(findErr, movie){
        if(!findErr && movie){
            // update movie attributes from req.body
            movie.update({ _id: req.params.id }, req.body, {upsert: true}, function(saveErr, movieResp) {
                if (!saveErr) {
                    // return model
                    res.status(200).send(movieResp);
                } else {
                    //TODO handle error
                }
            });
        } else {
            //TODO handle error
        }
    });
};


// delete an individual movie model from the collection, using it's id as a DB key
exports.deleteMovie = function(req, res){
    MovieModel.findById(req.params.id, function(findErr, movie){
        if(!findErr && movie){
            // update movie attributes from req.body
            movie.remove(function(removeErr) {
                if (!removeErr) {
                    // TODO return what?
                    res.status(200);
                } else {
                    //TODO handle error
                }
            });
        } else {
            //TODO handle error
        }
    });
};