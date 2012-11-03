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

            'click .completed-btn': 'updateOrder'
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

        updateOrder: function(e){
            this.pickedOrder.orderStatus = "Completed";
            console.log(this.pickedOrder.orderStatus);
            
        }
    });
});