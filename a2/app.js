// app.js Node.js server

"use strict;"   // flag JS errors

/* Module dependencies:
 *
 * require() loads a nodejs "module" - basically a file.  Anything
 * exported from that file (with "exports") can now be dotted off
 * the value returned by require(), in this case e.g. splat.api
 * The convention is use the same name for variable and module.
 */
var http = require("http"),
// NOTE, use the version of "express" linked to the assignment handout
    express = require("express"),
    fs = require("fs"),
    path = require("path"),
    url = require("url"),
    multer = require("multer"),
    logger = require("morgan"),
    compression = require("compression"),
    session = require("express-session"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    directory = require("serve-index"),
    errorHandler = require("errorhandler"),
    //basicAuth = require("basic-auth-connect"),  // optional, for HTTP auth

    // config is an object module, that defines app-config attribues,
    // such as "port", DB parameters
    config = require("./config"),
    splat = require('./routes/splat.js');  // route handlers

var app = express();  // Create Express app server

// Configure app server

// use PORT environment variable, or local config file value
app.set('port', process.env.PORT || config.port);

// activate basic HTTP authentication (to protect your solution files)
// REPLACE username/password, but DO NOT use your utorid credentials!!
//app.use(basicAuth('username', 'password'));

// change param value to control level of logging  ... ADD CODE
app.use(logger(config.env));  // 'default', 'short', 'tiny', 'dev'

// use compression (gzip) to reduce size of HTTP responses
app.use(compression());

// parse HTTP request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// set file-upload directory for poster images
app.use(multer({dest: __dirname + '/public/img/uploads/'}));

// checks req.body for HTTP method overrides
app.use(methodOverride());

// App routes (RESTful API) - handler implementation resides in routes/splat.js

// Perform route lookup based on HTTP method and URL.
// Explicit routes go before express.static so that proper
// handler is invoked rather than static-content processor

// Heartbeat test of server API
app.get('/', splat.api);

// Retrieve all movies
app.get('/movies', splat.getMovies);

// vedio playback
app.get('/movies/:id/video', splat.playMovie);

// Retrieve a single movie by its id attribute
app.get('/movies/:id', splat.getMovie);
// add a new movie
app.post('/movies', splat.addMovie);
// update an existing movie
app.put('/movies/:id', splat.editMovie);
// delete an movie
app.delete('/movies/:id', splat.deleteMovie);
//// retrieve all reviews for a movie
//app.get('/movies/:id/reviews', splat.getReviews);
//// add a review for a specific movie
//app.post('/movies/:id/reviews', splat.addReview);
//// play video
//app.get('/movies/:id/video', splat.playMovie);


// location of app's static content ... may need to ADD CODE
app.use(express.static(__dirname + "/alan-public"));

// return error details to client - use only during development
app.use(errorHandler({ dumpExceptions:true, showStack:true }));

// Default-route middleware, in case none of above match
app.use(function (req, res) {
    res.status(404).send('<h3>Sorry, specified route not found! :(</h3>');
});


// Start HTTP server
http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port %d in %s mode",
        app.get('port'), config.env );
});
