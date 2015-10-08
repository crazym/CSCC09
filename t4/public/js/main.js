'use strict';

var app = app || {};  // our app's namespace

app.Router = Backbone.Router.extend({

    routes: {
	// URL "hash" patterns handled by client-side app router
        '' : 'showHello',
	'hey' : 'showHello',    // allow #hey as valid URL for example
	'*default' : 'noSuchView'   // add a default view
    },

    // "initialize" function is invoked when the router is instantiated.
    initialize: function(){
	// initialize this.collection of Names models
	this.collection = new app.Names();
	this.namesFetch = this.collection.fetch();
	var self = this;
	this.namesFetch.done(function(names,response) {
	    // 1st time app is run, manually initialize collection
	    if (names.length === 0) {
		var names = ["Alpha", "Beta", "Charlie", "Delta", "Epsilon"];
		names.map(function(name) {
	    	    var nameModel = new app.Name({name: name});
	    	    self.collection.create(nameModel);
		});
	    }
	});
    },

    // handle unsupported (erroneous) view requests (hash strings)
    noSuchView: function() {
	// pull the unsupported hash value out of the Backbone history list
	var hash = Backbone.history.location.href.split('#')[1];
	// set the view content to error message showing unsupported view name
	$('#content').html('<h2>Sorry, no view "' + hash + '" in HelloWorld</h2>');
    },

    showHello: function() {
	var self = this;  // keep a reference to this object for nested func
	// When we know that the names collection fetch() is complete,
	// we can pass it to the constructor for a HelloWorldView.
	// Note, we can have multiple .done() calls for a single Promise.
	this.namesFetch.done(function(names,response) {
	    // now instantiate a HelloWorld view using fetched collection
            this.helloWorldView = new app.HelloWorldView({collection: self.collection});

	    // render the helloWorld View, and insert its root element "el"
	    // as the value of the view's #content element.
	    $('#content').html(this.helloWorldView.render().el);
	});
    }
});

// load markup template for HelloWorld Thumbnail view
app.loadThumbTemplate = $.get('tpl/HelloThumb.html');
app.loadThumbTemplate.done(function(markup) {
    // keep an app-level reference to the template markup for views to ref
    app.thumbMarkup = markup;
    // instantiate the app router
    app.router = new app.Router();
    Backbone.history.start();
});
