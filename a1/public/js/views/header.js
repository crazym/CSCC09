// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat =  splat || {};

// note View-name (Home) matches name of template file Home.html
splat.Header = Backbone.View.extend({

    events: {
        // trigger the selectMenuItem funtion with current event target on click of any menu item
        "click .menu-item": function(e) {
            this.selectMenuItem(e.currentTarget)}
    },

    // render the View
    render: function () {
        // set the view element ($el) HTML content using its template
        this.$el.html(this.template());
        return this;    // support method chaining
    },

    // set menu item to active on click
    selectMenuItem: function(menuItem) {
        // remove the active class on any current menu item
        $('.menu-item').removeClass('active')
        $(menuItem).addClass('active')
    }
});
