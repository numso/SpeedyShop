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
        curInventory: undefined,

        initialize: function () {
        },

        events: {

            'click .completed-btn': 'updateOrders'
        },

        render: function () {
            this.$el.html(shippingTmpl({
                msg: "Click on an order to load it."
            }));

            var that = this;
            $.get('/giveMeTheItems', function (data) {
                that.curInventory = data;
            });
            return this;
        },
        gotOrder: function (data) {
            this.pickedOrder = data;
            this.$el.html(shippingTmpl(data));
        },

        updateOrders: function(){
            console.log(this.curInventory);
            if(this.isValid())
                {       
                    this.pickedOrder.orderStatus = "Completed";

                    console.log(this.pickedOrder);

                    for(var x = 0; x < this.pickedOrder.items.length; ++x)
                        for(var n = 0; n < this.curInventory.length; ++n)
                            if(this.pickedOrder.items[x].itemID == this.curInventory[n].id)
                            { 
                                console.log(this.curInventory[n].available);
                                this.curInventory[n].available -= this.pickedOrder.items[x].quantity
                                console.log(this.curInventory[n].available);
                            }
                    $.post('/updateItemsAfterOrder', JSON.stringify(this.curInventory), function (resp) {
                        console.log("Response: " + JSON.stringify(resp));
                    });

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