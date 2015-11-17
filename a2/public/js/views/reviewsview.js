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
        this.$el.html(this.template());

        var reviews = this.model.reviews;
        var newReview = new splat.Review();
        newReview.set("movieId", this.model.id);
        // render Reviewer subview
        //console.log("new review is :")
        //console.log(newReview);
        if (!reviews){
            reviews = new splat.Reviews();
        }
        newReview.collection = reviews;
        console.log("review passed into Reviewer is ");
        console.log(newReview);
        this.reviewerView = new splat.Reviewer({collection: this.collection, model: newReview});
        this.$('#reviewer').append(this.reviewerView.render().el);


        //console.log("reviews passed in reviewsView is ");
        //console.log(this.collection);
        //this.renderReviews(this.model);

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

    renderReviews: function (movieModel) {

        if (this.thumbsView) {
            this.thumbsView.remove();
        }


        console.log("reviews for movieModel before loading is ");
        console.log(movieModel.reviews);
        this.reviewsLoaded = movieModel.reviews.fetch();
        this.reviewsLoaded.done(function() {
            console.log("after loading reviews are ");
            console.log(movieModel.reviews);
            var reviewsView = new splat.ReviewsView({collection: movieModel.reviews});
            splat.app.showView('#content', reviewsView);
        });
        //console.log("reviews passed in renderReviews is ");
        //console.log(reviews);
        this.thumbsView = new splat.ReviewThumbs({collection: reviews});
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
        if (this.reviewerView) { this.reviewerView.remove(); }
        if (this.thumbsView) { this.thumbsView.remove(); }
    }


});