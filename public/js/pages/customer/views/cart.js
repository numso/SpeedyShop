/*global define */

define([
    'backbone',
    'tmpl!pages/customer/templates/cart',
    'tmpl!pages/customer/templates/cartTemplates/sc-item'
], function (
    Backbone,
    cartTmpl,
    scItemTmpl
) {
    return Backbone.View.extend({

        initialize: function () {
        },

        events: {
            'click #check-out-btn': 'clickedCheckout'
        },

        render: function () {
            this.$el.html(cartTmpl());
            return this;
        },

        addItem: function (id) {
            var that = this;

            $.get('/getItem/' + id, function (data) {
                if (data.status === "success") {

                    var el = that.$('#' + id + '-in-cart');
                    if (el.length > 0) {
                        el.find('.qty-cnt').attr('value', (parseInt(el.find('.qty-cnt').attr('value'), 10) + 1));
                    } else {
                        data.item.id = id;
                        that.$('.sc-area').append(scItemTmpl(data.item));
                    }
                } else {
                    console.log('uh oh, something\'s up. Could\'t get the item');
                }
            });
        },

        clickedCheckout: function (e) {
            this.model.showCheckout();
        }
    });
});
