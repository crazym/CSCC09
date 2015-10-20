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
        //add each movie model from the collection into list of html
        splat.movies.each(function(movie) {
            var movieView = new splat.MovieThumb({model: movie});
            browseView = browseView + movieView.el.innerHTML;
        });
        browseView = browseView + '</ul>';
        this.$el.html(browseView);// create DOM content for MoviesView
        return this;    // support chaining
    }

});
