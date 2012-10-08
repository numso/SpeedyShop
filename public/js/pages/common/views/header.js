/*global define */

define([
    'backbone',
    'tmpl!pages/common/templates/header',
    'pages/common/views/headerViews/login-modal'
], function (
    Backbone,
    headerTmpl,
    LoginModalView
) {
    return Backbone.View.extend({
        loginModalView: undefined,

        render: function () {
            var that = this;

            $.get('/getCategories/', function (data) {
                that.$el.html(headerTmpl(data));

                var loginModalView = new LoginModalView({
                    className: 'account-box',
                    model: {}
                });
                $('.account-box').replaceWith(loginModalView.render().el);
                that.loginModalView = loginModalView;
            });

            return this;
        },

        initialize: function () {
        },

        events: {
            'click .show-sub-cats': 'showSubCats',
            'click .show-items': 'showItems'
        },

        // Menu Methods ////////////////////////////////////////////////////////////////////////

        showSubCats: function (e) {
            this.stopPropagation(e);
            var myEl = $(e.target).closest('.show-sub-cats').find('.sub-cat-container');
            myEl.slideToggle(100);
            this.closeAllBut(myEl);
        },

        showItems: function (e) {
            var itemName = $(e.target).closest('.show-items').text();
            console.log('TODO:: show items tagged with ' + itemName);
        },

        // Helper Methods //////////////////////////////////////////////////////////////////////

        closeAllBut: function (myMenu) {
            var menus = $('.flyout');
            for (var i = 0; i < menus.length; ++i) {
                if (menus[i] !== myMenu[0]) {
                    $(menus[i]).hide();
                }
            }

            this.resetLogInModal();
        },

        resetLogInModal: function () {
            this.loginModalView.closeModal();
        },

        stopPropagation: function (e) {
            if (!e) { e = window.event; }
            if (e.cancelBubble) { e.cancelBubble = true; }
            else { e.stopPropagation(); }
        }
    });
});
