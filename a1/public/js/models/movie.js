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
        trailer: null,
        // ??
        poster: "img/placeholder.png",
        dated:new Date()
    },

    validators:{
        "title": function(value){
            var regex = /([a-zA-Z0-9\,\.\!\?\-\'\*]+\s?)+/;
            return (value && regex.test(value)) ? {isOK: true} : {isOK: false,
                errMsg: "Only 1 or more letters and/or digits with spaces and special characters are allowed"};
        },
        "released": function(value){
            var regex = /^([0-9]{4})$/;
            return (value && regex.test(value) && (value >= 1910 && value<= 2016)) ? {isOK: true} : {isOK: false,
                errMsg: "Only 4 digits allowed, the released year should between 1910 - 2016"};
        },
        "director": function(value){
            var regex = /([a-zA-Z0-9\,\.\!\?\-\'\*]+\s?)+/;
            return (value && regex.test(value)) ? {isOK: true} : {isOK: false,
                errMsg: "Director must consist of one or more letter characters optionally with digit and space characters and special characters: ',', '.', '!', '?', '-', ''', '*'."};
        },
        "starring": function(value){
            var regex = /((([a-zA-Z0-9\-\']+\s?)+,?)+\s?)+/;
            return (value && regex.test(value)) ? {isOK: true} : {isOK: false,
                errMsg: "Starring must consist of one-or-more comma-separated sequences of whitespace-separated words, each such word which may optionally include special characters: '-', '''"};
        },
        "genre": function(value){
            var regex = /((([a-zA-Z0-9\-\']+\s?)+,?)+\s?)+/;
            return (value && regex.test(value)) ? {isOK: true} : {isOK: false,
                errMsg: "Genre must consist of one-or-more comma-separated sequences of whitespace-separated words, each such word which may optionally include special characters: '-', '''"};
        },
        "rating": function(value){
            var rate = ['G', 'PG', 'PG-13', 'R', 'NC-17', 'NR'];
            return (value && ($.inArray(value, rate) > -1)) ? {isOK: true} : {isOK: false,
                errMsg: "Only 1 of G, PG, PG-13, R, NC-17, NR"};
        },
        "duration": function(value){
            var regex = /^([0-9]{1,3})$/;
            return (value && regex.test(value) && (value >= 0 && value<= 999)) ? {isOK: true} : {isOK: false,
                errMsg: "Duration must consist of an integer in the range 0-999"};
        },
        "synopsis": function(value){
            var regex = /^(\w+\s?)+/;
            return (value && regex.test(value)) ? {isOK: true} : {isOK: false,
                errMsg: "Synopsis must consist of a non-empty word list"};
        },
        "trailer": function(value){
            var httpRegex = /^(http)(s?)\:\/\//
            var domain = /([a-zA-Z0-9\-\._]+(\.[a-zA-Z0-9\-\._]+)+)/
            var content = /(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%\$#_]*$)/
            var regex = new RegExp(httpRegex.source+domain.source+content.source);
            return (value && regex.test(value)) ? {isOK: true} : {isOK: false,
                errMsg: "Only empty string or a properly-formatted url are allowed"};
        }
    }

});
