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
        this.home;
        this.about;
        this.movies_browse;
        this.add_movie;
        // ?? this.edit_movie;
    },

    home: function() {
        this.headerView.render(); //re-render header
        console.log("this is");
        console.log(this);
        console.log("splat is");
        console.log(splat);
        // If the About view doesn't exist, instantiate one
        console.log("this.homeView");
	// If the Home view doesn't exist, instantiate one
        if (!this.homeView) {
            this.homeView = new splat.Home();
            console.log("create homeView");
            console.log(this.homeView);
        };
	// insert the rendered Home view element into the document DOM
        $('#content').html(this.homeView.render().el);
    },

    about: function() {;
        //set about button active if selected
        //this.headerView.selectMenuItem("about-btn");
        console.log("this is");
        console.log(this);
        console.log("splat is");
        console.log(splat);
	// If the About view doesn't exist, instantiate one
        console.log("this.aboutView");
        console.log(this.aboutView);
        if (!this.aboutView) {
            this.aboutView = new splat.About();
            console.log("create aboutView");
            console.log(this.aboutView);
        };
    // insert the rendered About view element into the document DOM
        $('#content').html(this.aboutView.render().el);
    },

    movies_browse: function(){
        //this.headerView.selectMenuItem("browse-btn");
        if (!this.moviesView) {
            this.moviesView = new splat.MoviesView();
        }
        $('#content').html(this.moviesView.render().el);
    },

    add_movie: function(){
        //this.headerView.selectMenuItem("add-btn");
        console.log("this is");
        console.log(this);
        console.log("splat is");
        console.log(splat);
        splat.movies.fetch({
                success: function(){
                    //console.log("this.edit");
                    //console.log(this.edit);
                    if (!splat.edit) {
                        var movie;
                        movie = new splat.Movie();
                        splat.edit = new splat.Edit({
                            model: movie,
                            collection: splat.movies, tempModel: movie.toJSON()
                        });
                        console.log("create edit");
                        console.log(splat.edit);
                    }
                    $('#content').html(splat.edit.render().el);
                }
            }
        );
    },

    edit_movie: function(id){
        //this.headerView.render(); //re-render header
        splat.movies.fetch({
            success: function(){
                console.log(id);
                var movie = splat.movies.get(id);
                splat.edit = new splat.Edit({model: movie,
                    collection: splat.movies, tempModel: movie.toJSON()});
                $('#content').html(splat.edit.render().el);
            }
        });
    }
});

// Load HTML templates for Home, Header, About views, and when
// template loading is complete, instantiate a Backbone router
// with history.
splat.utils.loadTemplates(['Home', 'Header', 'About', 'MovieThumb', 'Edit'], function() {
    splat.app = new splat.AppRouter();
    Backbone.history.start();
});
