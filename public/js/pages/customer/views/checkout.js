/*global define */

define([
    'backbone',
    'tmpl!pages/customer/templates/checkoutTemplates/confirmCart',
    'tmpl!pages/customer/templates/checkoutTemplates/billing',
    'tmpl!pages/customer/templates/checkoutTemplates/shipping',
    'tmpl!pages/customer/templates/checkoutTemplates/payment',
    'tmpl!pages/customer/templates/checkoutTemplates/confirmOrder',
    'tmpl!pages/customer/templates/checkout'
], function (
    Backbone,
    confirmCartTmpl,
    billingTmpl,
    shippingTmpl,
    paymentTmpl,
    confirmOrderTmpl,
    checkoutTmpl
) {
    return Backbone.View.extend({
        myTmpls: undefined,
        index: 0,

        initialize: function () {
            this.myTmpls = [
                {
                    name: 'Confirm Cart',
                    tmpl: confirmCartTmpl
                },
                {
                    name: 'Billing Info',
                    tmpl: billingTmpl
                },
                {
                    name: 'Shipping Info',
                    tmpl: shippingTmpl
                },
                {
                    name: 'Payment Info',
                    tmpl: paymentTmpl
                },
                {
                    name: 'Confirm Order',
                    tmpl: confirmOrderTmpl
                }
            ];
        },

        events: {
            'click #checkout-next-step': 'showNext',
            'click #checkout-prev-step': 'showPrev'
        },

        render: function () {
            this.$el.html(checkoutTmpl());
            return this;
        },

        showCartConfirm: function () {
            this.index = 0;
            this.updateScreen();
        },

        showNext: function (e) {
            ++this.index;
            if (this.index > this.myTmpls.length - 1) {
                this.index = this.myTmpls.length - 1;
                this.completeTransaction();
            } else {
                this.updateScreen();
            }
        },

        showPrev: function (e) {
            --this.index;
            if (this.index < 0) {
                this.index = 0;
            }
            this.updateScreen();
        },

        updateScreen: function () {
            // update title
            this.$('.checkout-title').html(this.myTmpls[this.index].name);

            // update buttons
            this.$('#checkout-prev-step').hide();
            if (this.index > 0) {
                this.$('#checkout-prev-step').show();
            }

            this.$('#checkout-next-step').text('Next>');
            if (this.index >= this.myTmpls.length - 1) {
                this.$('#checkout-next-step').text('Done');
            }

            // update body
            this.$('.checkout-body').html(this.myTmpls[this.index].tmpl());
        },

        completeTransaction: function () {
            console.log('finish the transaction');
        }
    });
});
