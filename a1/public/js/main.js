// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat =  splat || {};

// Define Backbone router
splat.AppRouter = Backbone.Router.extend({

    // Map "URL paths" to "router functions"
    routes: {
        "": "home",
        "home": "home",
        "about": "about",
        "movies": "browse",
        "movies/add": "details",
        "movies/:id": "details"

    },

    // When an instance of an AppRouter is declared, create a Header view
    initialize: function() {
	// instantiate a Header view
        this.headerView = new splat.Header();  
	// insert the rendered Header view element into the document DOM
        $('.header').html(this.headerView.render().el);

        // initialize this.collection of Names models
        this.collection = new splat.Movies();
        this.moviesFetch = this.collection.fetch();
        var self = this;
        this.moviesFetch.done(function(movies,response) {
            //window.localStorage.clear();
            if (movies.length === 0) {
                var movies= ["Alpha", "Beta", "Charlie", "Delta", "Epsilon"];
                movies.map(function(movie) {
                    var movieModel = new splat.Movie({title: movie});
                    self.collection.create(movieModel);
                });
            }
        });
    },

    home: function() {
	// If the Home view doesn't exist, instantiate one
        if (!this.homeView) {
            this.homeView = new splat.Home();
        };
	// insert the rendered Home view element into the document DOM
        $('#content').html(this.homeView.render().el);
    },

    about: function() {
	// If the About view doesn't exist, instantiate one
        if (!this.aboutView) {
            this.aboutView = new splat.About();
        };
    // insert the rendered About view element into the document DOM
        $('#content').html(this.aboutView.render().el);
    },

    details: function() {
        // instantiate a HelloWorld model, with a name-field value
        if (!this.movieModel) {
            this.movieModel = new splat.Movie();
        }
        if (!this.detailsView) {
            this.detailsView = new splat.Details({model: this.movieModel});
        }
        // render the helloWorld View, and insert its root element "el"
        // as the value of the view's #content element.
        $('#content').html(this.detailsView.render().el);
    },

    browse: function() {
        var self = this;  // keep a reference to this object for nested func
        // When we know that the names collection fetch() is complete,
        // we can pass it to the constructor for a HelloWorldView.
        // Note, we can have multiple .done() calls for a single Promise.
        this.moviesFetch.done(function(movie,response) {
            // now instantiate a HelloWorld view using fetched collection
            console.log(self.collection);
            self.movieView = new splat.MovieView({collection: self.collection});

            // render the helloWorld View, and insert its root element "el"
            // as the value of the view's #content element.
            $('#content').html(self.movieView.render().el);
        });
    }

});

// Load HTML templates for Home, Header, About views, and when
// template loading is complete, instantiate a Backbone router
// with history.
splat.utils.loadTemplates(['Home', 'Header', 'About', 'Details'], function() {
    // load markup template for HelloWorld Thumbnail view
    splat.loadThumbTemplate = $.get('tpl/MovieThumb.html');
    splat.loadThumbTemplate.done(function(markup) {
        // keep an app-level reference to the template markup for views to ref
        splat.thumbMarkup = markup;
    });
    splat.app = new splat.AppRouter();
    Backbone.history.start();
});
