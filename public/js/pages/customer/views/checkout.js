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
        checkoutData: [],
        itemPromo: [],
        genPromo: undefined,
        promoTotal: 0,


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
            'click .same-question': 'addressesSame',
            'keypress input': 'verifyFields',
            'click .item-promo-btn': 'applyItemPromo',
            'click .gen-promo-btn': 'applyGenPromo'
        },

        render: function () {
            this.$el.html(checkoutTmpl());
            this.getPromos();
            return this;
        },

        showCartConfirm: function (cart) {
            var total = 0;
            for (var i = 0; i < cart.length; ++i) {
                total += cart[i].quantity * cart[i].price;
            }
            this.cartData = {
                cart: cart,
                total: total,
                discount: this.promoTotal,
                newTotal: total - this.promoTotal
            };

            this.index = 0;
            this.updateScreen();
        },

        showNext: function (e) {
            this.saveOffPageData();
            if (this.index == this.myTmpls.length - 1)
                this.completeTransaction(); //they clicked Done on the last page
            else
            {
                this.index = Math.min(this.myTmpls.length - 1, this.index + 1);
                this.updateScreen();
            }
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

            // update previous nav buttons
            this.$('#checkout-prev-step').hide();
            if (this.index > 0)
                this.$('#checkout-prev-step').show();

            // update next nav button
            this.$('#checkout-next-step').text('Next>');
            if (this.index >= this.myTmpls.length - 1)
                this.$('#checkout-next-step').text('Done');

            // update body
            if (this.index == 0) {
                this.$('.checkout-body').html(this.myTmpls[this.index].tmpl({
                    cart: this.cartData.cart,
                    total: this.cartData.total,
                }));
            }
            else if (this.index == 3)
                this.$('.checkout-body').html(this.myTmpls[this.index].tmpl(this.assembleOrder()));
            else
                 this.$('.checkout-body').html(this.myTmpls[this.index].tmpl);

            this.verifyFields(null);
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

            this.verifyFields(null);
        },

        collectCartInformation: function () {
            var finalCart = [];
            for (var j = 0; j < this.cartData.cart.length; ++j) {
                finalCart.push({
                    itemQuantity: this.cartData.cart[j].quantity,
                    itemName: this.cartData.cart[j].name,
                    itemID: this.cartData.cart[j].id,
                    promoDiscount: this.promoTotal, //Mauriel, apply discount here
                    finalPrice: this.cartData.cart[j].price - 0 //Mauriel, apply discount here
                });
            }
            return finalCart;
        },

        getPromos: function(){
            var that = this;
            $.get('/promocodes', function (items) {
                that.promoList = JSON.parse(items);
            });
        },

        applyItemPromo: function(){
            var enteredItemPromo = this.$('.promo-code-text').val();
            this.itemPromo.push(enteredItemPromo);
            console.log(this.itemPromo);
            this.calcItemPromo();
        },

        applyGenPromo: function(){
            this.genPromo = this.$('.general-promo-text').val();
            console.log(this.genPromo);
            this.calcGenPromo();
        },

        calcGenPromo: function(){
            console.log("I'm in here!");
            for(var n = 0; n < this.promoList.length; ++n)
                if(this.promoList[n].code == this.genPromo)
                    console.log(this.promoList[n]);

        },

        calcItemPromo: function(){
            console.log("I'm in here!");
            for(var n = 0; n < this.promoList.length; ++n)
                for(var x = 0; x < this.itemPromo.length; ++x)
                        if(this.promoList[n].code == this.itemPromo[x])
                            console.log(this.promoList[n]);
        },


        assembleOrder: function () {
            return {
                order: this.collectCartInformation(),
                totalDiscounts: this.promoTotal,
                newTotal: this.cardData.total - this.promoTotal, //Mauriel, apply discount here
                total: this.cartData.total, //Mauriel, apply discount here

                addresses: [
                    {
                        shippingAddress: true,
                        firstName: this.checkoutData[1].data[0],
                        lastName: this.checkoutData[1].data[1],
                        street1: this.checkoutData[1].data[2],
                        street2: this.checkoutData[1].data[3],
                        city: this.checkoutData[1].data[4],
                        state: this.checkoutData[1].data[5],
                        zip: this.checkoutData[1].data[6]
                    },
                    {
                        shippingAddress: false,
                        firstName: this.checkoutData[1].data[8],
                        lastName: this.checkoutData[1].data[9],
                        street1: this.checkoutData[1].data[10],
                        street2: this.checkoutData[1].data[11],
                        city: this.checkoutData[1].data[12],
                        state: this.checkoutData[1].data[13],
                        zip: this.checkoutData[1].data[14]
                    }
                ],

                card: {
                    name: this.checkoutData[2].data[0],
                    number: this.checkoutData[2].data[1],
                    MM: this.checkoutData[2].data[2],
                    YYYY: this.checkoutData[2].data[3],
                    CVC: this.checkoutData[2].data[4]
                },

                notes: this.checkoutData[1].notes
            };
        },

        completeTransaction: function () {
            var assembledOrder = this.assembleOrder();
            var orderToServer = {
                address: assembledOrder.addresses[0],
                items: [], //will populate in loop below
                notes: assembledOrder.notes
            };

            for (var j = 0; j < assembledOrder.order.length; ++j) {
                orderToServer.items.push({ //matches the format in the orders.json
                    itemID: assembledOrder.order[j].itemID,
                    quantity: assembledOrder.order[j].itemQuantity
                });
            }

            orderToServer.address.shippingAddress = undefined; //removes variable

            //send order to server
            var that = this;
            var response = $.post("/submitOrder", JSON.stringify(orderToServer), function (response) {
                if (response.status === "OK") {
                    window.alert("Order successfully submitted!\nThank your for shopping with SpeedyShop. :)");
                    this.$('#checkout-next-step').attr('disabled', true); //prevents
                }
                else {
                    window.alert("Error submitting order!\nServer responded: " + response.status);
                }
            });
        },

        saveOffPageData: function () {
            var pageData = {
                    pageIndex: this.index,
                    data: [],
                    notes: this.$('textarea').val()
                };
            var inputs = this.$('input');
            for (var j = 0; j < inputs.length; ++j)
                pageData.data.push($(inputs[j]).val());

            var savedLoc = undefined;
            for (var j = 0; j < this.checkoutData.length; ++j)
                if (this.checkoutData[j].pageIndex == this.index)
                    savedLoc = j;

            if (savedLoc)
                this.checkoutData[savedLoc] = pageData;
            else
                this.checkoutData.push(pageData);
        },

        restorePageData: function () {
            var savedLoc = undefined;
            for (var j = 0; j < this.checkoutData.length; ++j)
                if (this.checkoutData[j].pageIndex == this.index)
                    savedLoc = j;

            if (savedLoc)
            { //restore data to page
                var savedInputs = this.checkoutData[savedLoc].data;
                var templateInputs = this.$('input');
                for (var j = 0; j < savedInputs.length; ++j)
                    $(templateInputs[j]).val(savedInputs[j]);
            }
        },

        verifyFields: function (e) {
            if (this.index == 0 || this.index == this.myTmpls.length - 1) {
                this.$('#checkout-next-step').attr('disabled', false);
                return; //skip analysis of first and last pages
            }

            var inputs = this.$('input');
            var allFilled = true;
            for (var j = 0; j < inputs.length; ++j)
                if (!$(inputs[j]).val() && !$(inputs[j]).hasClass('PO-box'))
                    allFilled = false;

            if (allFilled)
                this.$('#checkout-next-step').attr('disabled', false); //we're good
            else
                this.$('#checkout-next-step').attr('disabled', true); //need to fill out more fields
        }
    });
});
