'use strict';

var app =  app || {};   // our app's namespace

app.Name = Backbone.Model.extend({
    idAttribute: "_id", 

    defaults: {
        name: 'World'
    }
});
