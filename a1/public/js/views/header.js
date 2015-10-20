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

    initialize: function () {
        this.render();
    },

    // render the View
    render: function () {
        // set the view element ($el) HTML content using its template
        this.$el.html(this.template());
        splat.utils.hideNotice();
        return this;    // support method chaining
    },

    /* function triggered on click of menu item to set that menu item to active */
    selectMenuItem: function(menuItem) {
        //this.render();
        // remove the active class on any current menu item
        $('.menu-item').removeClass('active');
        //var btn = document.getElementById(menuItem);
        $(menuItem).addClass('active')
    }
});
