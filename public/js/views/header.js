/*global define */

define([
    'backbone',
    'tmpl!templates/header'
], function (
    Backbone,
    headerTmpl
) {
    return Backbone.View.extend({

        initialize: function () {
        },

        events: {
            "click .show-sub-cats": "showSubCats",
            "click .show-items": "showItems"
        },

        render: function () {
            var that = this;
            $.get("/getCategories/", function (data) {
                that.$el.html(headerTmpl(data));
            });
            return this;
        },


        showSubCats: function (e) {
            this.stopPropagation(e);
            var myEl = $(e.target).closest(".show-sub-cats").find(".sub-cat-container");
            myEl.slideToggle(100);
            this.closeAllBut(myEl);
        },

        showItems: function (e) {
            // load items on page
        },

        closeAllBut: function (myMenu) {
            var menus = $(".flyout");
            for (var i = 0; i < menus.length; ++i) {
                if (menus[i] !== myMenu[0]) {
                    $(menus[i]).hide();
                }
            }
        },

        stopPropagation: function (e) {
            if (!e) { e = window.event; }
            if (e.cancelBubble) { e.cancelBubble = true; }
            else { e.stopPropagation(); }
        }

    });
});
