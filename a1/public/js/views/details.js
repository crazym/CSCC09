'use strict';

var splat = splat || {};  // our app's namespace

splat.Details= Backbone.View.extend({


    // "initialize" function is invoked when the view is instantiated.
    initialize: function(){
        //$.get('tpl/MovieForm.html', function(markup) {
        //    // callback to convert markup to template,
        //    // apply to model, inject to Details view
        //});
    },


    render: function(){
        // set the view element ($el) HTML content using its template
        this.$el.html(this.template(this.model.toJSON()));
        return this;    // support method chaining
    }
});
