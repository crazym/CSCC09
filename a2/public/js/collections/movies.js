var splat =  splat || {};

/*  collections that contains all saved movies */
splat.Movies = Backbone.Collection.extend({
    // identify collection’s model
    model:splat.Movie,
    // map the read request issued by fetch() to a HTTP GET method request
    url: '/movies'
    // save movie models in localStorage under "splat" namespace
    //localStorage: new Backbone.LocalStorage('splat')
});

splat.movies = new splat.Movies();