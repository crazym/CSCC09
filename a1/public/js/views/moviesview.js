var splat =  splat || {};

splat.MoviesView = Backbone.View.extend({

    events: {
        "click li": "editMovie"
    },

    initialize: function () {
        splat.movies.fetch();
        this.render();
    },

    render: function () {
        var browseView = '<ul class="thumbnails">';
        //add each dish model from the collection into list of html
        splat.movies.each(function(movie) {
            var movieView = new splat.MovieThumb({model: movie});
            browseView = browseView + movieView.el.innerHTML;
        })
        browseView = browseView + '</ul>';
        this.$el.html(browseView);// create DOM content for DishesView
        return this;    // support chaining
    },
    editMovie: function(event){
        //get the current event target and navigate to defined id (name+venue)
        var movieName = $(event.currentTarget).find(".single-movie-title").text();
        var directorName = $(event.currentTarget).find(".single-movie-director").text();
        splat.app.navigate("movies/" + movieName + directorName, {trigger:true});
    }

});
