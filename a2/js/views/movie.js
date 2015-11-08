var splat =  splat || {};

/* template for single movie model thumbnail */
splat.MovieThumb = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        // create DOM content for MovieView
        this.$el.html(this.template(this.model.toJSON()));
        return this;    // support chaining
    }
});
