/*global define, $, console, window */

define([
    'backbone',
    'tmpl!pages/common/templates/header',
    'tmpl!pages/common/templates/headerTemplates/main-menu',
    'pages/common/views/headerViews/login-modal'
], function (
    Backbone,
    headerTmpl,
    mainMenuTmpl,
    LoginModalView
) {
    return Backbone.View.extend({
        loginModalView: undefined,
        categories: undefined,

        render: function () {
            var that = this;

            $.get('/getCategories/', function (data) {
                that.$el.html(headerTmpl());
                that.$('.main-menu').html(mainMenuTmpl(data));
                that.categories = data;

                var loginModalView = new LoginModalView({
                    className: 'account-box',
                    model: {
                        headerView: that
                    }
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
            'click .show-items': 'showItems',
            'click #keep-shopping-button': 'showCustomerView'
        },

        // View Switch Methods /////////////////////////////////////////////////////////////////

        showKeepShoppingButton: function () {
            this.$('.search-box').html('<div><button id="keep-shopping-button">Keep Shopping</button></div>');
            this.$('.main-menu').html('<div style="height:30px;"></div>');
        },

        showAdminView: function (e) {
            this.$('.search-box').html("<div>Administrator Portal</div>");
            this.$('.main-menu').html('<div style="height:30px;"></div>');
            this.model.showAdminView();
        },

        showEmployeeView: function (e) {
            this.$('.search-box').html("<div>Employee Portal</div>");
            this.$('.main-menu').html('<div style="height:30px;"></div>');
            this.model.showEmployeeView();
        },

        showCustomerView: function (e) {
            this.$('.search-box').html("<input type='text'>");
            this.$('.main-menu').html(mainMenuTmpl(this.categories));
            this.model.showCustomerView();
        },

        // Menu Methods ////////////////////////////////////////////////////////////////////////

        showSubCats: function (e) {
            this.stopPropagation(e);
            var myEl = $(e.target).closest('.show-sub-cats').find('.sub-cat-container');
            myEl.slideToggle(100);
            this.closeAllBut(myEl);
        },

        showItems: function (e) {
            var catName = $(e.target).closest('.category').find('span').text();
            var subcatName = $(e.target).closest('.show-items').text();
            this.model.showItemsInList(catName, subcatName);
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
