/*global define */
/*global define */

define([
    'backbone',
    'tmpl!pages/customer/templates/checkoutTemplates/confirmCart',
    'tmpl!pages/customer/templates/checkoutTemplates/billing-shipping',
    'tmpl!pages/customer/templates/checkoutTemplates/payment',
    'tmpl!pages/customer/templates/checkoutTemplates/confirmOrder',
    'tmpl!pages/customer/templates/checkout'
], function (
    Backbone,
    confirmCartTmpl,
    billingShippingTmpl,
    paymentTmpl,
    confirmOrderTmpl,
    checkoutTmpl
) {
    return Backbone.View.extend({
        myTmpls: undefined,
        index: 0,
        cartData: undefined,
        explanatoryText: undefined,

        orderData: [],

        initialize: function () {
            this.myTmpls = [
                {
                    name: 'Confirm Cart',
                    tmpl: confirmCartTmpl
                },
                {
                    name: 'Billing/Shipping Information',
                    tmpl: billingShippingTmpl
                },
                {
                    name: 'Payment Information',
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
            'click #checkout-prev-step': 'showPrev',
            'click .same-question': 'addressesSame'
        },

        render: function () {
            this.$el.html(checkoutTmpl());
            return this;
        },

        showCartConfirm: function (cart) {

            var total = 0;
            for (var i = 0; i < cart.length; ++i) {
                total += cart[i].quantity * cart[i].price;
            }
            this.cartData = {
                cart: cart,
                total: total
            };

            this.index = 0;
            this.updateScreen();
        },

        showNext: function (e) {
            this.saveOffPageData();
            this.index = Math.min(this.myTmpls.length - 1, this.index + 1);
            if (this.index == this.myTmpls.length - 1)
                this.completeTransaction();
            this.updateScreen();
        },

        showPrev: function (e) {
            this.index = Math.max(0, this.index - 1);
            this.updateScreen();
            this.restorePageData();
        },

        updateScreen: function () {
            // update title
            this.model.updateBreadcrumbs(this.index);
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
            this.$('.checkout-body').html(this.myTmpls[this.index].tmpl({
                cart: this.cartData.cart,
                total: this.cartData.total
            }));
        },

        addressesSame: function (e) {
            var billing = $('.billing-section');
            var shipping = $('.shipping-section');

            var inputs = ['.firstName', '.firstName', '.street', '.PO-box', '.city', '.state', '.zip'];

            for (var j = 0; j < inputs.length; ++j)
                shipping.find(inputs[j]).attr('value', billing.find(inputs[j]).attr('value'));

            var source = $(e.target);
            if (!source.hasClass('sameCheckbox')) {
                var checkbox = $('#sameCheckbox');
                checkbox.attr('checked', !checkbox.attr('checked'));
            }
        },

        collectCartInformation: function () {
            var finalCart = [];
            for (var j = 0; j < this.cartData.cart.length; ++j) {
                finalCart.push({
                    "itemQuantity": this.cartData.cart[j].quantity,
                    "itemName": this.cartData.cart[j].name,
                    "promoDiscount": "0.00", //Mauriel, apply discount here
                    "finalPrice": this.cartData.cart[j].price - 0 //Mauriel, apply discount here
                });
            }
            return finalCart;
        },

        completeTransaction: function () {
            //hardcoded for now for development purposes
            this.$('.checkout-body').html(confirmOrderTmpl({
                order: this.collectCartInformation(),
                "totalDiscounts": "0.00", //Mauriel, apply discount here
                "total": this.cartData.total, //Mauriel, apply discount here

                "addresses": [
                    {
                        "shipping-address": true,
                        "firstName": this.orderData[1][0],
                        "lastName": this.orderData[1][1],
                        "street1": this.orderData[1][2],
                        "street2": this.orderData[1][3],
                        "city": this.orderData[1][4],
                        "state": this.orderData[1][5],
                        "zip": this.orderData[1][6]
                    },
                    {
                        "shipping-address": false,
                        "firstName": this.orderData[1][8],
                        "lastName": this.orderData[1][9],
                        "street1": this.orderData[1][10],
                        "street2": this.orderData[1][11],
                        "city": this.orderData[1][12],
                        "state": this.orderData[1][13],
                        "zip": this.orderData[1][14]
                    }
                ],

                "card": {
                    "name": this.orderData[2][0],//"Jesse Victors",
                    "number": this.orderData[2][1], //"*********1234",
                    'MM': this.orderData[2][2], //"08",
                    "YYYY": this.orderData[2][3], //"2013",
                    "CVC": this.orderData[2][4] //"233"
                }
            }));
        },

        saveOffPageData: function () {
            var pageData = {
                    pageIndex: this.index,
                    data: this.$('input')
                };

            var savedLoc = undefined;
            for (var j = 0; j < this.orderData.length; j++)
                if (this.orderData[j].pageIndex == this.index)
                    savedLoc = j;

            if (savedLoc)
                this.orderData[savedLoc] = pageData;
            else
                this.orderData.push(pageData);
        },

        restorePageData: function () {
            var savedLoc = undefined;
            for (var j = 0; j < this.orderData.length; j++)
                if (this.orderData[j].pageIndex == this.index)
                    savedLoc = j;

            if (savedLoc)
            { //restore data to page
                var savedInputs = this.orderData[savedLoc].data;
                var templateInputs = this.$('input');
                for (var j = 0; j < savedInputs.length; ++j)
                    $(templateInputs[j]).val($(savedInputs[j]).val());
            }
        }
    });
});
