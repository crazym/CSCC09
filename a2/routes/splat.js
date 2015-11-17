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
    //'@10.15.2.164/' + config.dbname);
    '@localhost/' + config.dbname);

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
    var movie = new MovieModel(req.body);

    if (movie.poster.indexOf("data:")==0) {
        // pathURL needs to be absolute while posterURL are relevant
        var pathURL = __dirname + "/../public/img/uploads/" + movie.id + ".png";
        var posterPath = "/img/uploads/" + movie.id + ".png";
        var fileData = movie.poster.split(',')[1];

        fs.writeFile(pathURL, fileData, "base64", function(err) {
            if (!err) {
                movie.poster = posterPath;
                movie.save(function (err, movie) {
                    if (err) {
                        res.status(500).send("Sorry, unable to retrieve movie at this time ("
                            + err.message + ")");
                    } else if (!movie) {
                        res.status(404).send("Sorry, that movie doesn't exist; try reselecting from Browse view");
                    } else {
                        res.status(200).send(movie);
                    }
                });
            } else {
                res.status(500).send("Sorry, (" + err.message + " )");
            }
        });
    } else {
        movie.save(function (err, movie) {
            if (err) {
                res.status(500).send("Sorry, unable to retrieve movie at this time ("
                    + err.message + ")");
            } else if (!movie) {
                res.status(404).send("Sorry, that movie doesn't exist; try reselecting from Browse view");
            } else {
                res.status(200).send(movie);
            }
        });
    }
};

// update an individual movie model, using it's id as a DB key
exports.editMovie = function(req, res){
    var obj = req.body;
    delete obj._id;

    if (obj.poster.indexOf("data:")==0) {
        var pathURL = __dirname + "/../public/img/uploads/" + req.params.id + ".png";
        var posterPath = "/img/uploads/" + req.params.id + ".png";
        var fileData = obj.poster.split(',')[1];

        fs.writeFile(pathURL, fileData, "base64", function(err){
            if (!err) {
                obj.poster = posterPath;
                MovieModel.update({_id: req.params.id}, obj, {upsert: true}, function (saveErr, movieResp) {
                    if (!saveErr) {
                        // return model
                        res.status(200).send(movieResp);
                    } else {
                        //TODO handle error
                    }
                });
            } else {
                res.status(500).send(err)
            }
        });
    } else{
        MovieModel.update({_id: req.params.id}, obj, {upsert: true}, function (saveErr, movieResp) {
            if (!saveErr) {
                // return model
                res.status(200).send(movieResp);
            } else {
                //TODO handle error
            }
        });
    };
};


// delete an individual movie model from the collection, using it's id as a DB key
exports.deleteMovie = function(req, res){

    MovieModel.findByIdAndRemove(req.params.id, function(findErr, movie) {
        if (!findErr) {
            //need to send json object on 200, o.w. trigger "error" handler
            res.status(200).send({"responseText": "movie successfully deleted"});
        } else {
            res.send(500, "Sorry, unable to remove the movie ("
                +findErr.message+ ")" );
        }
    });

};