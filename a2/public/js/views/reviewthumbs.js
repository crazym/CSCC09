"use strict";

var splat =  splat || {};

/*
 template-driven
 rendering using the ReviewThumb template and
 reviews collection as inputs
*/
splat.ReviewThumbs = Backbone.View.extend({

    reviewsTemplate: _.template([
        "<% reviews.each(function(review) { %>",
        "<%= reviewTemplate(review.toJSON()) %>",
        "<% }); %>",
    ].join('')),

    render: function () {

        // clear current thumbs to avoid duplicates
        $('#review_thumbs').html("");

        // render Reviews subview
        var movieThumbView = new splat.ReviewThumb();
        var html = this.reviewsTemplate({
            reviews: this.collection,
            reviewTemplate: movieThumbView.template
        });

        $(this.el).append(html);
        return this;
    },

    onClose: function() {
        this.remove();
    }


})