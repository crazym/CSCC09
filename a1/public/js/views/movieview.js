var splat =  splat || {};

splat.MovieThumb = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        // create DOM content for DishView
        this.$el.html(this.template(this.model.toJSON()));
        return this;    // support chaining
    }
});
