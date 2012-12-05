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
        giftCardList: [],
        genPromo: undefined,
        genGiftCard:undefined,
        promoTotal: 0,
        promoGenTotal: 0,
        giftCardDiscount:undefined,


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
            'click .gen-promo-btn': 'applyGenPromo',
            'click .gen-gift-card-btn': 'applyGiftCard',
        },

        render: function () {
            this.$el.html(checkoutTmpl());
            this.getPromos();
            return this;
        },

        applyGiftCard: function(){
            this.genGiftCard = this.$('.gift-card-text').val();
            this.calcGiftCard();
        },

        calcGiftCard: function(){
            var that=this;
            $.get('getGiftCardValue/' + this.genGiftCard, function(card){
                console.log("the card status is: " + card.status);
                if (card.status == "success"){
                    that.$('.invalide-gift-card').html("Gift Card Successfully Applied").css('color', 'green');
                    console.log(card);
                    // that.cartData.total -= card.item.amount;
                    that.giftCardDiscount = card.item.amount;
                }else{
                    that.$('.invalide-gift-card').html('Invalid').css('color', 'red');
                }
            });
        },

        showCartConfirm: function (cart) {
            var total = 0;
            for (var i = 0; i < cart.length; ++i) {
                total += cart[i].quantity * cart[i].price;
            }
            total -= this.promoTotal;
            this.cartData = {
                cart: cart,
                total: total,
                discount: parseFloat(this.promoTotal),
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
            var that = this;
            var findPromo = function(name, price){
                for(var n = 0; n < that.itemPromo.length; ++n)
                {
                    if(that.itemPromo[n].item == name)
                    {
                        var temp = that.calcItemPromo(that.itemPromo[n].promo, price);
                        return temp;
                    }

                }
                return 0;

            };
            for (var j = 0; j < this.cartData.cart.length; ++j) {
                finalCart.push({
                    itemQuantity: this.cartData.cart[j].quantity,
                    itemName: this.cartData.cart[j].name,
                    itemID: this.cartData.cart[j].id,
                    promoDiscount: findPromo(this.cartData.cart[j].name, this.cartData.cart[j].price), //Mauriel, apply discount here
                    finalPrice: this.cartData.cart[j].price, //Mauriel, apply discount here
                });
            }
            return finalCart;
        },


        findPromo: function(name){
            for(var n = 0; n < this.itemPromo.length; ++n)
                if(this.itemPromo[n].name == name)
                    console.log(this.itemPromo[n].promo);
        },

        getPromos: function(){
            var that = this;
            $.get('/promocodes', function (items) {
                that.promoList = JSON.parse(items);
            });
        },

        applyItemPromo: function(e){
            var enteredItemPromo = $(e.target).closest('.checkout-item').find('.promo-code-text').val();
            var thisItemName = $(e.target).closest('.checkout-item').find('.item-name').html();
            var flag = true;
            for(var n = 0; n < this.itemPromo.length; ++n)
            {
                console.log(this.itemPromo[n].code);
                if(this.itemPromo[n].promo == enteredItemPromo)
                    {
                        console.log("Promo already entered!");
                        $(e.target).closest('.checkout-item').find('.promo-feedback').html("Promo Code already used!").css('color', 'red');
                        flag = false;
                    }
            }
            if(flag == true)
                {
                    var itemObj = {
                        promo : enteredItemPromo,
                        item : thisItemName
                    }
                    this.itemPromo.push(itemObj);
                    $(e.target).closest('.checkout-item').find('.promo-feedback').html("Promo Code successfully applied").css('color', 'green');
                }
        },

        applyGenPromo: function(){
            var possiblePromo = this.$('.general-promo-text').val();
            if(this.genPromo == possiblePromo)
                this.$('.gen-promo-feedback').html('Promo Code already used!').css('color', 'red');
            else
            {
                this.genPromo = possiblePromo;
                this.calcGenPromo();
            }
        },

        calcGenPromo: function(){
            var flag = false;
            for(var n = 0; n < this.promoList.length; ++n)
                    if(this.promoList[n].code == this.genPromo)
                        {
                            flag = true;
                            this.$('.gen-promo-feedback').html('Promo code successfully applied').css('color', 'green');
                            if(this.promoList[n].amount == 0)
                                this.percentGenPromo(this.promoList[n]);
                            if(this.promoList[n].percent == 0)
                                {
                                    this.promoTotal += this.promoList[n].amount;
                                    this.cartData.total -+ this.promoTotal;
                                }
                        }

                if(flag == false)
                    this.$('.gen-promo-feedback').html('Invalid Promo Code').css('color', 'red');
      

        },

        calcItemPromo: function(name, price){
            for(var n = 0; n < this.promoList.length; ++n)
                if(this.promoList[n].code == name)
                    {
                        if(this.promoList[n].amount == 0)
                            {
                                var discount = this.percentItemPromo(this.promoList[n], price);
                                this.promoTotal = this.promoTotal + parseFloat(discount);
                                return discount;
                            }
                        if(this.promoList[n].percent == 0)
                            {
                                this.promoTotal = this.promoTotal + parseFloat(this.promoList[n].amount);
                                return this.promoList[n].amount;
                            }
                    }
        },

        percentItemPromo: function(promo, amount){
            var percentOff = promo.percent / 100;
            var discount = amount * percentOff;
            return discount.toFixed(2);
        },

        percentGenPromo: function(promo){
            var newTotal = this.cartData.total;
            var percentOff = (100 - promo.percent) / 100;
            newTotal = newTotal * percentOff;
            var diff = this.cartData.total - newTotal;
            if(this.promoTotal == 0)
                this.promoGenTotal = diff.toFixed(2);
            else
                this.promoGenTotal += diff.toFixed(2);

            this.cartData.total = newTotal;
        },


        assembleOrder: function () {
            return {
                order: this.collectCartInformation(),
                totalDiscounts: this.promoTotal + parseFloat(this.promoGenTotal),
                newTotal: this.cartData.total - parseFloat(this.promoTotal), //Mauriel, apply discount here
                total: this.cartData.total - parseFloat(this.promoTotal) - this.giftCardDiscount, //Mauriel, apply discount here
                giftCard:this.giftCardDiscount,


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
                email: 'dosmun@gmail.com',
                name: 'dallin',
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
                    allFilled = true;
            if (allFilled)
                this.$('#checkout-next-step').attr('disabled', false); //we're good
            else
                this.$('#checkout-next-step').attr('disabled', true); //need to fill out more fields
        }
    });
});
