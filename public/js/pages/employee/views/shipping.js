/*global define */

define([
    'backbone',
    'tmpl!pages/employee/templates/shipping'
], function (
    Backbone,
    shippingTmpl
) {
    return Backbone.View.extend({
        pickedOrder: undefined,
        initialize: function () {
        },

        events: {

            'click .completed-btn': 'updateOrders'
        },

        render: function () {
            this.$el.html(shippingTmpl({
                msg: "Click on an order to load it."
            }));
            return this;
        },
        gotOrder: function (data) {
            this.pickedOrder = data;
            this.$el.html(shippingTmpl(data));
        },

        updateOrders: function(){
            if(this.isValid())
                {       
                    this.pickedOrder.orderStatus = "Completed";
                    console.log(JSON.stringify(this.pickedOrder));
                    $.post('/updateThisOrder', JSON.stringify(this.pickedOrder), function (resp) {
                        console.log("Response: " + JSON.stringify(resp));
                    });
                    $('.error-msg').css('display', 'none');
                    $('.submitted-msg').css('display', 'inline');
                }
            else
            {
                console.log("im in here!");
                $('.error-msg').css('display', 'inline');
                $('.submitted-msg').css('display', 'none');
            }


        },
        
        isValid: function(){
            flag = true;
            $('.item-check').each(function (index){
                var thisValue = $(this).is(':checked');
                if(!thisValue)
                    flag = false;
           }); 
            return flag;
        }
    });
});