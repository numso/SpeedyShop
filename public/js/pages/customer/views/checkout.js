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
           // 'click input': 'verifyFields'
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
            //if (this.index == this.myTmpls.length - 1)
            //    this.completeTransaction();
            this.updateScreen();
        },

        showPrev: function (e) {
            this.index = Math.max(0, this.index - 1);
            this.updateScreen();
            this.restorePageData();
            this.$('#checkout-next-step').attr('disabled', false);
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

            //TODO: NAVIGATION HAS BUGS, CONFIRM ORDER IS NOT DISPLAYED. WILL FIX SOON. -Jesse V.

            // update body
            this.$('.checkout-body').html(this.myTmpls[this.index].tmpl({
                cart: this.cartData.cart,
                total: this.cartData.total
            }));
        },

        addressesSame: function (e) {
            var billing = this.$('.billing-section');
            var shipping = this.$('.shipping-section');

            var inputs = ['.firstName', '.lastName', '.street', '.PO-box', '.city', '.state', '.zip'];

            for (var j = 0; j < inputs.length; ++j)
                shipping.find(inputs[j]).attr('value', billing.find(inputs[j]).attr('value'));

            var source = this.$(e.target);
            if (!source.hasClass('sameCheckbox')) {
                var checkbox = this.$('#sameCheckbox');
                checkbox.attr('checked', !checkbox.attr('checked'));
            }
        },

        collectCartInformation: function () {
            var finalCart = [];
            for (var j = 0; j < this.cartData.cart.length; ++j) {
                finalCart.push({
                    itemQuantity: this.cartData.cart[j].quantity,
                    itemName: this.cartData.cart[j].name,
                    itemID: this.cartData.cart[j].id,
                    promoDiscount: "0.00", //Mauriel, apply discount here
                    finalPrice: this.cartData.cart[j].price - 0 //Mauriel, apply discount here
                });
            }
            return finalCart;
        },

        assembleOrder: function () {
            return {
                order: this.collectCartInformation(),
                totalDiscounts: "0.00", //Mauriel, apply discount here
                total: this.cartData.total, //Mauriel, apply discount here

                addresses: [
                    {
                        "shipping-address": true,
                        firstName: this.orderData[1].data[0],
                        lastName: this.orderData[1].data[1],
                        street1: this.orderData[1].data[2],
                        street2: this.orderData[1].data[3],
                        city: this.orderData[1].data[4],
                        state: this.orderData[1].data[5],
                        zip: this.orderData[1].data[6]
                    },
                    {
                        "shipping-address": false,
                        firstName: this.orderData[1].data[8],
                        lastName: this.orderData[1].data[9],
                        street1: this.orderData[1].data[10],
                        street2: this.orderData[1].data[11],
                        city: this.orderData[1].data[12],
                        state: this.orderData[1].data[13],
                        zip: this.orderData[1].data[14]
                    }
                ],

                card: {
                    name: this.orderData[2].data[0],
                    number: this.orderData[2].data[1],
                    MM: this.orderData[2].data[2],
                    YYYY: this.orderData[2].data[3],
                    CVC: this.orderData[2].data[4]
                }
            };
        },

        completeTransaction: function () {
            var assembledOrder = this.assembleOrder();
            var orderToServer = {
                address: assembledOrder.addresses[0],
                items: [], //will populate in loop below
                notes: "herp derp"
            };

            for (var j = 0; j < assembledOrder.order.length; ++j) {
                orderToServer.items.push({ //matches the format in the orders.json
                    itemID: assembledOrder.order[j].itemID,
                    quantity: assembledOrder.order[j].itemQuantity
                });
            }

            orderToServer.address.splice(0, 1); //removes "shipping-address"

            //send order to server
            var that = this;
            var response = $.post("/submitOrder", JSON.stringify(orderToServer), function (response) {
                if (response.status === "OK") {
                    window.alert("Order successfully submitted!\nThank your for shopping with SpeedyShop. :)");
                }
                else {
                    window.alert("Error submitting order!\nServer responded: " + response.status);
                }
            });
        },

        saveOffPageData: function () {
            var pageData = {
                    pageIndex: this.index,
                    data: []
                };
            var inputs = this.$('input');
            for (var j = 0; j < inputs.length; ++j)
                pageData.data.push($(inputs[j]).val());

            var savedLoc = undefined;
            for (var j = 0; j < this.orderData.length; ++j)
                if (this.orderData[j].pageIndex == this.index)
                    savedLoc = j;

            if (savedLoc)
                this.orderData[savedLoc] = pageData;
            else
                this.orderData.push(pageData);
        },

        restorePageData: function () {
            var savedLoc = undefined;
            for (var j = 0; j < this.orderData.length; ++j)
                if (this.orderData[j].pageIndex == this.index)
                    savedLoc = j;

            if (savedLoc)
            { //restore data to page
                var savedInputs = this.orderData[savedLoc].data;
                var templateInputs = this.$('input');
                for (var j = 0; j < savedInputs.length; ++j)
                    $(templateInputs[j]).val(savedInputs[j]);
            }
        },

        verifyFields: function (e) {
            var inputs = this.$('input textarea');

            var allFilled = true;
            for (var j = 0; j < inputs.length; ++j) {
                console.log(inputs[j].val());
                if (!inputs[j].val())
                    allFilled = false;
            }


            if (allFilled) {
                this.$('#checkout-next-step').attr('disabled', false); //we're good
            } else {
                this.$('#checkout-next-step').attr('disabled', true); //need to fill out more fields
            }
        }
    });
});
