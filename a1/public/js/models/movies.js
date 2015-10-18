var splat =  splat || {};

splat.Movies = Backbone.Collection.extend({
    model:splat.Movie,
    localStorage: new Backbone.LocalStorage('splat')
});

splat.movies = new splat.Movies();