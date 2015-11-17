"use strict";

var splat =  splat || {};

splat.Reviewer = Backbone.View.extend({

    events: {
        "change .authattr": "change",
        "click #reviewmovie": "reviewMovie",
        //"click #moviedel": "deleteMovie",
    },

    render: function () {
        //console.log("model in Reviewer");
        //console.log(this.model);
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    /* change-event handler does a modelset(),
     put form name:value pair into Review
     model, but extra work of validation */
    change: function(event){
        var change = {};
        change[event.target.name] = event.target.value;

        this.model.set(change);
    },

    /* click-event handler persists Review model to server with
     model.save() or collection.create()*/
    reviewMovie: function () {
        this.model.collection.create(this.model, {
            wait: true,
            success: function(model, response) {
                splat.utils.showAlert('Success!', 'Review Added', 'alert-success');
            },
            error: function (model, err) {
                console.log(err);
                splat.utils.requestFailed(err);
            }
        });
        $(".authattr").trigger("reset");
    }
})