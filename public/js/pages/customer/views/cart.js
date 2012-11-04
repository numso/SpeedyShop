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

        getCurrentQuantity: function(item) {
            var quantity = parseInt(item.find('.qty-cnt').attr('value').replace(/[^0-9]/g, ''), 10);
            if (isNaN(quantity))
                return 0;
            return quantity;
        },

        addItem: function (id) {
            var that = this;

            var el = that.$('#' + id + '-in-cart');
            if (el.length > 0) {
                el.find('.qty-cnt').attr('value', this.getCurrentQuantity(el) + 1);
                this.recalculateTotal();
            } else {
                $.get('/getItem/' + id, function (data) {
                    if (data.status === "success") {
                        data.item.id = id;
                        that.$('.sc-area').append(scItemTmpl(data.item));
                        that.recalculateTotal();
                    } else {
                        console.log('uh oh, something\'s up. Could\'t get the item');
                    }
                });

                //add event to item div so that user can type in a new quantity then press Enter
                $('.sc-area').keypress(function(event) {
                    var keycode = (event.keyCode ? event.keyCode : event.which);
                    if(keycode == '13') { //user pressed Enter key
                        that.$('.qty-cnt').attr('value', that.getCurrentQuantity($('.sc-area'))); //sanitize input textbox
                        that.recalculateTotal();
                    }
                });
            }
        },

        clickedCheckout: function (e) {
            this.model.showCheckout();
        },

        recalculateTotal: function () {
            var total = 0;
            var items = this.$('.sc-item');
            for (var i = 0; i < items.length; ++i) {
                var qty = this.getCurrentQuantity($(items[i]));
                var price = parseFloat($(items[i]).find('.sc-price').find('span').html(), 10);
                total += qty * price;
            }

            $('.sc-total').find('span').html(total);
        }
    });
});
