/*global define */

define([
    'backbone',
    'tmpl!pages/admin/templates/giftCards'
], function (
    Backbone,
    giftCardTmpl
) {
    return Backbone.View.extend({

        cards: undefined,

        initialize: function () {
            var that = this;
            $.get('/getGiftCards', function (data) {
                that.cards = data;
                that.$el.html(giftCardTmpl(that.cards));
            });

            return this;  
        },

        events: {
            'click .add-gift-card': 'getCard',
            
        },

        verifyEmail: function (theEmail) {
            if (theEmail !== "" && theEmail.match(/[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Za-z]{2}|com|org|net|edu|gov|mil|biz|info|mobi|name|aero|asia|jobs|museum)\b/))
               return true;
            return false;
        },

        getCard: function(){
            // var code = parseInt(this.$('.new-code').val(), 10);
            var amount = parseInt(this.$('.new-amount').val(), 10);
            var email = this.$('.recv-email').val();
            var flag = true;

            if(this.verifyEmail(email))
                {
                    this.$('.validate-email').html("");
                }
            else
                {
                    flag = false;
                    this.$('.validate-email').html('Invalid Email Address').css('color', 'red');
                }

            // if(isNaN(code))
            //     {
            //         this.$('.validate-code').html("Code has to be a number").css('color', 'red');
            //         flag = false;
            //     }
            // else
            //     this.$('.validate-code').html("");                

            if(isNaN(amount))
                {
                    this.$('.validate-amount').html("Amount has to be a number").css('color', 'red');
                    flag = false;
                }
            else
                this.$('.validate-amount').html("");

            if(flag == true)
                {
                    var cardObj = {
                        cardNum: 0,
                        code: "~Pending~",
                        amount: amount,
                        email: email,
                    };

                    this.cards.push(cardObj);
                    $.post('/createGiftCard', JSON.stringify(cardObj), function(){

                    });
                    this.$el.html(giftCardTmpl(this.cards));


                }

        },

        render: function () {
            this.$el.html(giftCardTmpl());
            return this;
        }
    });
});