"use strict";

var splat =  splat || {};

splat.Details = Backbone.View.extend({

    render: function () {
	var self = this;
        this.$el.html(this.template(this.model.toJSON()));

	// render MovieForm subview
	this.formView = new splat.MovieForm({model: this.model});
	this.$('#movieform').append(this.formView.render().el);

	// render MovieImg subview
	this.imgView = new splat.MovieImg({model: this.model});
	this.$('#movieimg').append(this.imgView.render().el);

	return this;
    },

    // remove subviews on close of Details view
    onClose: function() {
        if (this.formView) { this.formView.remove(); }
        if (this.imgView) { this.imgView.remove(); }
    },

});
