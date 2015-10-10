'use strict';

var splat = splat || {};  // our app's namespace

splat.MovieView = Backbone.View.extend({


    moviesTemplate: _.template([
        "<% movies.each(function(movie) { %>",
        "<%= movieThumbTemplate(movie.toJSON()) %>",
        "<% }); %>"
    ].join('')),

    initialize: function() {
        // load markup template for HelloWorld Thumbnail view
        //this.loadThumbTemplate = $.get('tpl/MovieThumb.html');
        //this.loadThumbTemplate.done(function(markup) {
        //    // keep an app-level reference to the template markup for views to ref
        //    console.log("loading thumb done");
        //    splat.thumbMarkup = markup;
        //})
    },

    // "$el" is a jQuery-object wrapper around "el", which enables you
    // to use jQuery methods like "html()" to set the content of elements.
    render: function(){

        //this.loadThumbTemplate.done(function(markup) {
        //    // keep an app-level reference to the template markup for views to ref
        //    console.log("loading thumb done");
        //    splat.thumbMarkup = markup;
        //    //this.template = _.template(markup);
        //});
        //
        ////console.log("rendering browing view");
        this.template = _.template(splat.thumbMarkup);
        //console.log(this.template(this.collection));

        // set the view element ($el) HTML content using its template
        var moviesMarkup = this.moviesTemplate({
            movies: this.collection,
            movieThumbTemplate: this.template
        });
        this.$el.append(moviesMarkup);
        return this;    // support method chaining
    }
});
