/*global define */

define([
    'backbone',
    'tmpl!pages/common/templates/header'
], function (
    Backbone,
    headerTmpl
) {
    return Backbone.View.extend({

        initialize: function () {
        },

        events: {
            "click .show-sub-cats": "showSubCats",
            "click .show-items": "showItems",
            "click .btn": "showSignInScreen",
            "click .sign-in-modal": "stopPropagation",
            "click .log-in": "toggleSignUpScreen"
        },

        showSignInScreen: function (e) {
            $(".sign-in-modal").css("height", "300px");
            this.closeAllBut("sign-in");
            this.stopPropagation(e);
        },

        toggleSignUpScreen: function (e) {
            $(".sign-in-modal").css("height", "600px");
            this.closeAllBut("sign-in");
            this.stopPropagation(e);
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

            // if (myMenu !== $(".sign-in-modal")) {
            //     $(".sign-in-modal").css("height", 0);
            // }
        },

        stopPropagation: function (e) {
            if (!e) { e = window.event; }
            if (e.cancelBubble) { e.cancelBubble = true; }
            else { e.stopPropagation(); }
        }

    });
});
