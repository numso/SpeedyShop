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
            //'focus input': 'clearExplanatoryText',
            //'blur input': 'restoreExplanatoryText',
            'click .same-question': 'addressesSame'
        },

        assembleOrder: function () {
            //this.$('.checkout-title').html(this.myTmpls[this.index].name);

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

        /*
        clearExplanatoryText: function (e) {
            var target = $(e.target);
            explanatoryText = target.attr("value");
            if (explanatoryText.charAt(0) == '(')
                target.attr("value", "");
        },

        restoreExplanatoryText: function (e) {
            var target = $(e.target);
            if (explanatoryText && !target.attr("value"))
                target.attr("value", explanatoryText);
        },*/

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

        completeTransaction: function () {
            for (var j = 0; j < this.orderData.length; j++) {
                var data = this.orderData[j].data;
                for (var k = 0; k < data.length; k++)
                    console.log(j+", "+k+", "+$(data[k]).val()+",   "+$(data[k]).attr("class"));

/*
0, 0, 1,        item-quantity
0, 1, Promo1,   promo-code-text
0, 2, 2,        item-quantity
0, 3, Promo2,   promo-code-text
0, 4, GenPromo, general-promo-text
1, 0, First,    firstName
1, 1, Last,     lastName
1, 2, Address1, street
1, 3, Add2,     PO-box
1, 4, C,        city
1, 5, S,        state
1, 6, Z,        zip
1, 7, on,       sameCheckbox
1, 8, First2,   firstName
1, 9, L2,       lastName
1, 10, Address2, street
1, 11, Add22,   PO-box
1, 12, C2,      city
1, 13, S2,      state
1, 14, Z2,      zip
2, 0, NameOnCard,
2, 1, CardNum,
2, 2, MM,
2, 3, YYYY,
2, 4, CVC,       */

            }
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
            console.log("index = " + this.index + " " + savedLoc);

            if (savedLoc) {
                console.log("updated orderData with new page data");
                this.orderData[savedLoc] = pageData;
            }
            else {
                console.log("pushed page data");
                this.orderData.push(pageData);
            }
        },

        restorePageData: function () {
            var savedLoc = undefined;
            for (var j = 0; j < this.orderData.length; j++)
                if (this.orderData[j].pageIndex == this.index)
                    savedLoc = j;

            if (savedLoc)
            {
                console.log("trying to restore saved data to page");
                var savedInputs = this.orderData[savedLoc].data;
                var templateInputs = this.$('input');
                for (var j = 0; j < savedInputs.length; ++j)
                    $(templateInputs[j]).val($(savedInputs[j]).val());
            }
        }
    });
});
