app.Names = Backbone.Collection.extend({
    // identify collection’s model
    model: app.Name,

    // save movie models in localStorage under "helloworld" namespace
    localStorage: new Backbone.LocalStorage('helloworld')
});
