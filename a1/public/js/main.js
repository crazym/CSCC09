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
        "movies": "movies_browse",
        "movies/add": "add_movie",
        "movies/:id": "edit_movie"
    },

    // When an instance of an AppRouter is declared, create a Header view
    initialize: function() {
        // instantiate a Header view
        if (!this.headerView) {
            this.headerView = new splat.Header();
        };

	// insert the rendered Header view element into the document DOM
        $('.header').html(this.headerView.render().el);
    },

    home: function() {
        this.headerView.render(); //re-render header

	    // If the Home view doesn't exist, instantiate one
        if (!this.homeView) {
            this.homeView = new splat.Home();
        };
	// insert the rendered Home view element into the document DOM
        $('#content').html(this.homeView.render().el);
    },

    about: function() {
        if (!this.aboutView) {
            this.aboutView = new splat.About();
        };
    // insert the rendered About view element into the document DOM
        $('#content').html(this.aboutView.render().el);
    },

    movies_browse: function(){
        if (!this.moviesView) {
            this.moviesView = new splat.MoviesView();
        }
        $('#content').html(this.moviesView.render().el);
    },

    /* add a new movie */
    add_movie: function(){
        splat.movies.fetch({
                success: function(){

                    var movie;
                    movie = new splat.Movie();
                    splat.edit = new splat.Details({
                        model: movie,
                        collection: splat.movies, tempModel: movie.toJSON()
                    });
                    $('#content').html(splat.edit.render().el);
                }
            }
        );
    },

    /* edit an existing movie */
    edit_movie: function(id){
        splat.movies.fetch({
            success: function(){
                var movie = splat.movies.get(id);
                splat.edit = new splat.Details({model: movie,
                    collection: splat.movies, tempModel: movie.toJSON()});
                $('#content').html(splat.edit.render().el);
            }
        });
    }
});

// Load HTML templates for Home, Header, About views, and when
// template loading is complete, instantiate a Backbone router
// with history.
splat.utils.loadTemplates(['Home', 'Header', 'About', 'MovieThumb', 'Details'], function() {
    splat.app = new splat.AppRouter();
    Backbone.history.start();
});
