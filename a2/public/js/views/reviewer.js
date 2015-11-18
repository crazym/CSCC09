"use strict";

var splat =  splat || {};

splat.Reviewer = Backbone.View.extend({

    events: {
        "change .authattr": "change",
        "click #reviewmovie": "reviewMovie"
    },

    initialize: function(options){

        this.model = new splat.Review();
        //console.log(options.movieId);
        this.model.set("movieId", options.movieId);
        //console.log(this.model);
        this.movieId = options.movieId;

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
        var valid = this.checkValidation();
        var self = this;

        if (valid) {
            this.collection.create(this.model, {
                wait: true,
                success: function(model, response) {
                    splat.utils.showAlert('Success!', 'Review Added', 'alert-success');
                    // set a new Review model for next input
                    self.model = new splat.Review();
                    self.model.set("movieId", self.movieId);
                    // clear current form data
                    $("input[type=text] , textarea").each(function(){
                        $(this).val('');
                    });
                    $(".freshnessSelect input[type='radio']").each(function() {
                        this.checked = false;
                    });
                },
                error: function (model, err) {
                    splat.utils.requestFailed(err);
                }
            });
        }
    },

    checkValidation: function (){
        var valid = true;
        var change = {};
        $(".authattr input[type='text']").each(function() {
            change[this.name] = this.value;
        });
        $(".authattr textarea").each(function() {
            change[this.name] = this.value;
        });
        change["freshness"] = $(".freshnessSelect input[type='radio']:checked").val();
        for (var name in change) {
            console.log(name + "->" + change[name]);
            if (typeof change[name] === 'undefined') {
                valid = false;
                splat.utils.showAlert('Warning: ', "Review Fields (" + name + ") cannot be empty", 'alert-warning');
            }
        }
        return valid;
    }
})