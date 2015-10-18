var splat =  splat || {};

splat.Movie = Backbone.Model.extend({
    // match localStorage (later server DB) use of _id, rather than id
    idAttribute: "_id",

    defaults: {
        title: "",
        released: "",
        director: "",
        starring: [],
        rating: "",
        duration: null,
        genre: [],
        synopsis: "",
        freshTotal: 0.0,
        freshVotes: 0.0,
        trail: null,
        // ??
        poster: "img/placeholder.png",
        dated:new Date()
    },
    validators:{
        "title": function(value){
            var regex = /([a-zA-Z0-9\,\.\!\?\-\'\*]+\s?)+/;
            return (value && regex.test(value)) ? {isOK: true} : {isOK: false,
                errMsg: "Only 1 or more letters and/or digits allowed"};
        },
        "released": function(value){
            var regex = /^([0-9]{4})$/;
            return (value && regex.test(value) && (value >= 1910 && windowsize <= 2016)) ? {isOK: true} : {isOK: false,
                errMsg: "Only 4 digits allowed, the released year should between 1910 - 2016"};
        },
        "director": function(value){
            var regex = /([a-zA-Z0-9\,\.\!\?\-\'\*]+\s?)+/;
            return (value && regex.test(value)) ? {isOK: true} : {isOK: false,
                errMsg: "Only 1 or more letters and/or digits allowed"};
        }

    }
});
