/*global define */

define([
    'backbone',
    'tmpl!pages/common/templates/headerTemplates/login-modal',
    'tmpl!pages/common/templates/headerTemplates/signed-in'
], function (
    Backbone,
    loginModalTmpl,
    signedInTmpl
) {
    return Backbone.View.extend({
        curErrorAnim: undefined,

        loginItems: [
            'ERROR',
            [{ title: 'Log Out', id: 'log-out' }],
            [{ title: 'Employee View', id: 'show-emp-view', cur: true },
            { title: 'Customer View', id: 'show-cust-view' },
            { title: 'Log Out', id: 'log-out' }],
            [{ title: 'Admin View', id: 'show-adm-view', cur: true },
            { title: 'Employee View', id: 'show-emp-view' },
            { title: 'Customer View', id: 'show-cust-view' },
            { title: 'Log Out', id: 'log-out' }]
        ],

        render: function () {
            var that = this;

            $.get('/getUserName', function (data) {
                if (data === '') {
                    that.$el.html(loginModalTmpl());
                } else {
                    data = JSON.parse(data);
                    that.$el.html(signedInTmpl({
                        user: data.user,
                        loginItems: that.loginItems[data.userID]
                    }));

                    that.$el.addClass('logged-in');
                }
            });

            return this;
        },

        initialize: function () {
        },

        events: {
            'click #show-log-in': 'showLogInScreen',
            'click #show-sign-up': 'showSignUpScreen',
            'click #log-in': 'logIn',
            'click #sign-up': 'signUp',
            'click #log-out': 'logOut',
            'click #show-adm-view': 'showAdminView',
            'click #show-emp-view': 'showEmployeeView',
            'click #show-cust-view': 'showCustomerView',
            'click .sign-in-modal': 'stopPropagation',

            'focus input': 'showInfo',
            'blur input': 'hideInfo',
            'keyup input': 'checkValidity',
            'keydown input': 'checkForEnter'
        },

        // Change-View Methods /////////////////////////////////////////////////////////////////

        showAdminView: function (e) {
            console.log('TODO:: Show the Admin View');
        },

        showEmployeeView: function (e) {
            console.log('TODO:: Show the Employee View');
        },

        showCustomerView: function (e) {
            console.log('TODO:: Show the Customer View');
        },

        // Show-Modal Methods //////////////////////////////////////////////////////////////////

        showInfo: function (e) {
            if (this.$('.log-in-specific').hasClass('toggle-hidden')) {
                var name = $(e.target).closest('input').attr('class').split(' ')[0];
                this.$('.' + name + '-info').addClass('show');
            }
        },

        hideInfo: function (e) {
            this.$('.info').removeClass('show');
        },

        showError: function (msg) {
            clearTimeout(this.curErrorAnim);
            var errBox = this.$el.find('.error-msg');
            errBox.html(msg);
            errBox.removeClass('hiding');
            errBox.removeClass('hidden');
            this.curErrorAnim = setTimeout(function () {
                errBox.addClass('hiding');
                this.curErrorAnim = setTimeout(function () {
                    errBox.addClass('hidden');
                }, 500);
            }, 1500);
        },

        checkValidity: function (e) {
            if (this.$('.log-in-specific').hasClass('toggle-hidden')) {
                this.validateItem($(e.target).closest('input'));
            }
        },

        checkForEnter: function (e) {
            var keyCode = e.keyCode;
            var inpEl = $(e.target).closest('input')[0];

            if (keyCode === 13) {
                if (inpEl === this.$('.pass')[0] && !this.$('.log-in-specific').hasClass('toggle-hidden')) {
                    this.$('#log-in').click();
                } else if (inpEl === this.$('.lname')[0]) {
                    this.$('#sign-up').click();
                }
            }
        },

        // Log-In Methods //////////////////////////////////////////////////////////////////////

        showLogInScreen: function (e) {
            this.$('.sign-in-modal').css('height', '170px');
            this.$('.log-in-specific').removeClass('toggle-hidden');
            this.$('input').removeClass('error');
            this.$('.user').attr('tabindex', '').focus();
            this.$('.pass').attr('tabindex', '');
            this.closeAllButMenu();
            this.stopPropagation(e);
        },

        showSignUpScreen: function (e) {
            this.$('.sign-in-modal').css('height', '360px');
            this.$('.log-in-specific').addClass('toggle-hidden');
            this.$('input').attr('tabindex', '');
            this.closeAllButMenu();
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
                    that.$el.html(signedInTmpl({
                        user: data.user,
                        loginItems: that.loginItems[data.userID]
                    }));

                    that.$el.addClass('logged-in');
                } else {
                    that.showError('Incorrect Username / Password');
                }
            });
        },

        signUp: function (e) {
            var that = this;

            this.validateAllItems(function() {
                var userObj = {
                    user: that.$('.user').val(),
                    pass: that.$('.pass').val(),
                    email: that.$('.email').val(),
                    fname: that.$('.fname').val(),
                    lname: that.$('.lname').val()
                };

                $.post('/signup', JSON.stringify(userObj), function (data) {
                    data = JSON.parse(data);
                    if (data.success) {
                        that.$el.html(signedInTmpl({
                            user: data.user,
                            loginItems: that.loginItems[data.userID]
                        }));

                        that.$el.addClass('logged-in');
                    } else {
                        that.showError('Internal Server Error: try again');
                    }
                });
            }, function (err) {
                that.showError(err);
            });
        },

        validateAllItems: function (fn, errfn) {
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
                if (!this.validateItem(myObjs[i])) {
                    isValid = false;
                }
            }

            if (!isValid) {
                errfn('Something\'s Wrong. Fix the red boxes.');
                return;
            }

            $.post('/checkUserExistence', this.$('.user').val(), function (data) {
                if (!data) {
                    fn();
                } else {
                    errfn('Sorry, That User Name has been taken.');
                }
            });
        },

        validateItem: function (item) {
            var that = this;

            item.removeClass('error');
            this.$('.' + item.attr('class') + '-info').find('.info-error').text('');

            if (item[0] === this.$('.user')[0]) {
                this.$('.user-info').find('.info-success').text('');
            }

            if (item.val() === '') {
                this.$('.' + item.attr('class') + '-info').find('.info-error').text('You can\'t leave this blank!');
                item.addClass('error');
                return false;
            }

            if (item[0] === this.$('.pass')[0]) {
                if (this.$('.pass').val() === this.$('.cpass').val()) {
                    this.$('.cpass').removeClass('error');
                    this.$('.cpass-info').find('.info-error').text('');
                }
            }

            if (item[0] === this.$('.cpass')[0]) {
                if (this.$('.pass').val() !== this.$('.cpass').val()) {
                    this.$('.cpass-info').find('.info-error').text('You\'re passwords don\'t match.');
                    item.addClass('error');
                    return false;
                }
            }

            if (item[0] === this.$('.email')[0]) {
                if (!this.$('.email').val().match(/[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Za-z]{2}|com|org|net|edu|gov|mil|biz|info|mobi|name|aero|asia|jobs|museum)\b/)) {
                    this.$('.email-info').find('.info-error').text('That\'s not a valid email address.');
                    item.addClass('error');
                    return false;
                }
            }

            if (item[0] === this.$('.user')[0]) {
                $.post('/checkUserExistence', this.$('.user').val(), function (data) {
                    if (data) {
                        that.$('.user-info').find('.info-error').text('Sorry, but ' + that.$('.user').val() + ' is taken.');
                        item.addClass('error');
                    } else {
                        that.$('.user-info').find('.info-success').text(that.$('.user').val() + ' is available!');
                    }
                });
            }

            return true;
        },

        logOut: function (e) {
            var that = this;

            $.post('/logout', function (data) {
                data = JSON.parse(data);
                if (data.success) {
                    that.$el.html(loginModalTmpl());
                    that.$el.removeClass('logged-in');
                }
            });
        },

        // Helper Methods //////////////////////////////////////////////////////////////////////

        closeAllButMenu: function () {
            $('.flyout').hide();
        },

        closeModal: function () {
            this.$('.sign-in-modal').css('height', 0);
            this.$('input').attr('tabindex', '-1');
        },

        stopPropagation: function (e) {
            if (!e) { e = window.event; }
            if (e.cancelBubble) { e.cancelBubble = true; }
            else { e.stopPropagation(); }
        }
    });
});
