"use strict";

var splat =  splat || {};

splat.Reviewer = Backbone.View.extend({

    events: {
        "change .authattr": "change",
        "click #reviewmovie": "reviewMovie",
        //"click #moviedel": "deleteMovie",
    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    /* change-event handler does a modelset(),
     put form name:value pair into Review
     model, but extra work of validation */
    change: function(){

    },

    /* click-event handler persists Review model to server with
     model.save() or collection.create()*/
    reviewMovie: function () {

    }
})