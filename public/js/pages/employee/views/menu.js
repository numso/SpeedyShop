/*global define */

define([
    'backbone',
    'tmpl!pages/employee/templates/menu'
], function (
    Backbone,
    menuTmpl
) {
    return Backbone.View.extend({
        orderData: undefined,
        initialize: function () {
        },

        events: {
            'click .clickable': 'openModule',
            'click .processed-btn': 'showProcessed',
            'click .completed-btn': 'showCompleted',
            'click .order-box' : 'openOrder'
        },

        showProcessed: function (e) {
            this.$('.order-box').hide();
            this.$('.Processed-item').show();
            this.$('.processed-btn').addClass('selected-btn');
            this.$('.completed-btn').removeClass('selected-btn');
        },


        showCompleted: function (e) {
            this.$('.order-box').hide();
            this.$('.Completed-item').show();
            this.$('.completed-btn').addClass('selected-btn');
            this.$('.processed-btn').removeClass('selected-btn'); 
        },

        openModule: function (e) {
            var el = $(e.target).closest('.clickable');
            this.model[el.attr('id')]();
        },

        openOrder: function (e) {
            var el = $(e.target).closest('.order-box');
            var pickedOrder = parseInt(el.attr('id'), 10);


            for(var n = 0; n < this.orderData.length; ++n)
            {
                if(pickedOrder === this.orderData[n].orderNum )
                {
                    this.model.showOrder(this.orderData[n]);
                }
            }

        },

        render: function () {

            var that = this;
            $.get('/orders', function (data) {
                that.orderData = data;
                that.$el.html(menuTmpl(data));
            });

            return this;
        }
    });
});
