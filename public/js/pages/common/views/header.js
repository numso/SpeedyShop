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
        render: function () {
            var that = this;

            $.get('/getCategories/', function (data) {
                that.$el.html(headerTmpl(data));

                $.get('/getUserName', function (user) {
                    if (user === '') {
                        that.$('.account-box').html(loginModalTmpl());
                    } else {
                        that.$('.account-box').html(signedInTmpl({ user: user }));
                    }
                });
            });

            return this;
        },

        initialize: function () {
        },

        events: {
            'click .show-sub-cats': 'showSubCats',
            'click .show-items': 'showItems',
            'click #show-log-in': 'showLogInScreen',
            'click #show-sign-up': 'showSignUpScreen',
            'click #log-in': 'logIn',
            'click #sign-up': 'signUp',
            'click #logOut': 'logOut',
            'click .sign-in-modal': 'stopPropagation',

            'focus input': 'showInfo',
            'blur input': 'hideInfo',
        },

        showInfo: function (e) {
            if (this.$('.log-in-specific').hasClass('toggle-hidden')) {
                var name = $(e.target).closest('input').attr('class');
                this.$('.' + name + '-info').addClass('show');
            }
        },

        hideInfo: function (e) {
            this.$('.info').removeClass('show');
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
            console.log('show items tagged with ' + itemName);
        },

        // Log-In Methods //////////////////////////////////////////////////////////////////////

        showLogInScreen: function (e) {
            this.$('.sign-in-modal').css('height', '170px');
            this.$('.log-in-specific').removeClass('toggle-hidden');
            this.closeAllBut('sign-in');
            this.stopPropagation(e);
        },

        showSignUpScreen: function (e) {
            this.$('.sign-in-modal').css('height', '360px');
            this.$('.log-in-specific').addClass('toggle-hidden');
            this.closeAllBut('sign-in');
            this.stopPropagation(e);
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
                    that.$('.account-box').html(signedInTmpl({ user: data.user }));
                }
            });
        },

        signUp: function (e) {
            var that = this;

            if (this.validateForm()) {
                var userObj = {
                    user: this.$('.user').val(),
                    pass: this.$('.pass').val(),
                    email: this.$('.email').val(),
                    fname: this.$('.fname').val(),
                    lname: this.$('.lname').val()
                };

                $.post('/signup', JSON.stringify(userObj), function (data) {
                    data = JSON.parse(data);
                    if (data.success) {
                        that.$('.account-box').html(signedInTmpl({ user: data.user }));
                    }
                });
            }
        },

        validateForm: function () {
            var myObjs = [
                this.$('.user'),
                this.$('.pass'),
                this.$('.cpass'),
                this.$('.email'),
                this.$('.fname'),
                this.$('.lname')
            ];

            var isValid = true;

            for (var i = 0; i < myObjs.length; ++i) {
                myObjs[i].removeClass('error');
                if (myObjs[i].val() === '') {
                    isValid = false;
                    myObjs[i].addClass('error');
                }
            }

            if (this.$('.pass').val() !== this.$('.cpass').val()) {
                isValid = false;
                this.$('.pass').addClass('error');
                this.$('.cpass').addClass('error');
            }

            if (false) { // check email
                isValid = false;
            }

            return isValid;
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

        // Helper Methods //////////////////////////////////////////////////////////////////////

        closeAllBut: function (myMenu) {
            var menus = $('.flyout');
            for (var i = 0; i < menus.length; ++i) {
                if (menus[i] !== myMenu[0]) {
                    $(menus[i]).hide();
                }
            }

            if (myMenu !== 'sign-in') {
                this.$('.sign-in-modal').css('height', 0);
            }
        },

        stopPropagation: function (e) {
            if (!e) { e = window.event; }
            if (e.cancelBubble) { e.cancelBubble = true; }
            else { e.stopPropagation(); }
        }
    });
});
