/*global define */

define([
    'backbone',
    'tmpl!pages/common/templates/header',
    'tmpl!pages/common/templates/headerTemplates/login-modal',
    'tmpl!pages/common/templates/headerTemplates/signed-in'
], function (
    Backbone,
    headerTmpl,
    loginModalTmpl,
    signedInTmpl
) {
    return Backbone.View.extend({

        initialize: function () {
        },

        events: {
            "click .show-sub-cats": "showSubCats",
            "click .show-items": "showItems",
            "click #logIn": "showSignInScreen",
            "click #logOut": "logOut",
            "click .sign-in-modal": "stopPropagation",
            "click .log-in": "logIn"
        },

        logOut: function (e) {
            var that = this;

            $.post('/logout', function (data) {
                data = JSON.parse(data);
                if (data.success) {
                    that.$('.account-box').html(loginModalTmpl());
                }
            });
        },

        logIn: function (e) {
            var that = this;

            var userObj = {
                user: this.$('.user').val(),
                pass: this.$('.pass').val()
            };

            $.post('/login', JSON.stringify(userObj), function (data) {
                data = JSON.parse(data);
                if (data.success) {
                    that.$('.account-box').html(signedInTmpl({user: userObj.user}));
                }
            });
        },

        showSignInScreen: function (e) {
            this.$(".sign-in-modal").css("height", "300px");
            this.closeAllBut("sign-in");
            this.stopPropagation(e);
        },

        toggleSignUpScreen: function (e) {
            this.$(".sign-in-modal").css("height", "600px");
            this.closeAllBut("sign-in");
            this.stopPropagation(e);
        },

        render: function () {
            var that = this;
            $.get("/getCategories/", function (data) {
                that.$el.html(headerTmpl(data));

                that.$('.account-box').html(loginModalTmpl());

                $.get("/getUserName", function (data) {
                    if (data !== '') {
                        that.$('.account-box').html(signedInTmpl({user: data}));
                    }
                });
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
