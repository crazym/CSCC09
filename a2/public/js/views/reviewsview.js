"use strict";

var splat =  splat || {};

splat.ReviewsView = Backbone.View.extend({

    initialize: function () {
        // other stuff ? ...
        // triggers update to View to show new score and render new ReviewThumb
        // invoke showScore and renderReviews methods when collection is sync'd
        this.listenTo(this.reviews, "sync", this.showScore);
        this.listenTo(this.reviews, "sync", this.renderReviews);

    },

    render: function () {
        // render self (from ReviewsView template), then Reviewer subview,
        // then ReviewThumbs subview, then showFreshness (current aggregate rating)
        // can all be chained, as in this.renderX().renderY().renderZ() ...

        var self = this;
        this.$el.html(this.template(this.model.toJSON()));

        // render MovieForm subview
        this.formView = new splat.Reviewer({model: this.model});
        this.$('#reviewer').append(this.formView.render().el);

        this.renderReviews();

        return this;
    },

    /*
    * checks to see if collection associated with this ReviewsView is empty
     – if so displays a static message (“… no reviews yet”)
     – if not, displays a freshness-score computed as freshVotes/freshTotal
     */
    showScore: function (){
        var scoreText;
        if (this.collection.isEmpty()) {
            scoreText = "... no reviews yet";
        } else {
            var score = 0;
            this.collection.each(function (review) {
                score += review.freshness;
            });
            score = score/this.collection.size() * 100;
            scoreText = "currently rated:" + score + "% (" + this.collection.size() + ")";
        }
        return scoreText;
    },


    reviewsTemplate: _.template([
        "<% reviews.each(function(review) { %>",
        "<%= reviewTemplate(review.toJSON()) %>",
        "<% }); %>",
    ].join('')),

    renderReviews: function () {

        if (this.thumbsView) {
            this.thumbsView.remove();
        }
        this.thumbsView = new splat.Reviewer({model: this.model});
        this.$('#review_thumbs').append(this.thumbsView.render().el);

        //// clear current thumbs to avoid duplicates
        //$('#review_thumbs').html("");
        //
        //// render Reviews subview
        //var movieThumbView = new splat.ReviewThumb();
        //var html = this.reviewsTemplate({
        //    reviews: this.collection,
        //    reviewTemplate: movieThumbView.template
        //});
        //
        //this.$('#review_thumbs').append(html);
    },

    // remove subviews on close of ReviewsView view
    onClose: function() {
        if (this.formView) { this.formView.remove(); }
        if (this.thumbsView) { this.thumbsView.remove(); }
    }


});