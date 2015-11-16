var splat =  splat || {};

/*  collections that contains all saved movies */
splat.Movies = Backbone.Collection.extend({
    // identify collection’s model
    model:splat.Movie,

    // save movie models in localStorage under "splat" namespace
    localStorage: new Backbone.LocalStorage('splat')
});

splat.movies = new splat.Movies();