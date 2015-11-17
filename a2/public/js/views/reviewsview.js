"use strict";

var splat =  splat || {};

splat.ReviewsView = Backbone.View.extend({

    initialize: function () {
        // other stuff ? ...

        this.newReview = new splat.Review();
        this.newReview.set("movieId", this.model.id);

        this.reviews = new splat.Reviews();
        this.reviews.url = '/movies/' + this.model.id + '/reviews';

        this.reviewsLoaded = this.reviews.fetch();
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
        this.$el.html(this.template());

        this.reviewsLoaded.done(function(){
            self.newReview.collection = self.reviews;
            self.reviewerView = new splat.Reviewer({model: self.newReview});
            self.$('#reviewer').append(self.reviewerView.render().el);

            self.renderReviews();

            self.showScore();


        });

        return this;
    },

    /*
    * checks to see if collection associated with this ReviewsView is empty
     – if so displays a static message (“… no reviews yet”)
     – if not, displays a freshness-score computed as freshVotes/freshTotal
     */
    showScore: function (){
        var scoreText;
        if (this.reviews.isEmpty()) {
            scoreText = "... no reviews yet";
        } else {
            var score = 0;
            this.reviews.each(function (review) {
                score += review.get("freshness");
            });
            score = (score/this.reviews.size()) * 100;
            scoreText = "currently rated:" + score + "% (" + this.reviews.size() + ")";
        }
        self.$('#reviewer #freshRating').append(scoreText);
        return this;
    },

    renderReviews: function () {

        if (this.thumbsView) {
            this.thumbsView.remove();
        }
        this.thumbsView = new splat.ReviewThumbs({collection: this.reviews});
        this.$('#review_thumbs').append(this.thumbsView.render().el);

        return this;
    },

    // remove subviews on close of ReviewsView view
    onClose: function() {
        if (this.reviewerView) { this.reviewerView.remove(); }
        if (this.thumbsView) { this.thumbsView.remove(); }
    }


});