splat.Review = Backbone.Model.extend({

    idAttribute: "_id",

    initialize: function() {
    },

    defaults: {
        freshness: 0.0,   // fresh review value 1.0, rotten value 0.0
        reviewText: "",   // review comments
        reviewName: "",  // name of reviewer
        reviewAffil: "",  // affiliation of reviewer
        movieId: ""  // idref: id of reviewed movie
    }

});
