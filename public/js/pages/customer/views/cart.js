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
        cart: [],

        initialize: function () {
        },

        events: {
            'click #check-out-btn': 'clickedCheckout',
            'click .qty-cnt': 'sanitizeQuantityInput'
        },

        render: function () {
            this.$el.html(cartTmpl());
            return this;
        },

        getCurrentQuantity: function (item) {
            var text = item.find('.qty-cnt').attr('value');
            var quantity = parseInt(text.replace(/[^0-9]/g, ''), 10);
            if (isNaN(quantity) || text.charAt(0) == '-')
                return 0;
            return quantity;
        },

        addItem: function (id) {
            var that = this;

            var el = that.$('#' + id + '-in-cart');
            if (el.length > 0) {

                for (var i = 0; i < this.cart.length; ++i) {
                    if (this.cart[i].id === id) {
                        ++this.cart[i].quantity;
                    }
                }

                el.find('.qty-cnt').attr('value', this.getCurrentQuantity(el) + 1);
                this.recalculateTotal();
            } else {
                $.get('/getItem/' + id, function (data) {
                    if (data.status === "success") {
                        that.cart.push({
                            id: id,
                            img: data.item.imgURL,
                            name: data.item.name,
                            price: data.item.price,
                            quantity: 1
                        })
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
                    if(keycode == '13')
                        that.sanitizeQuantityInput();
                });
            }
        },

        sanitizeQuantityInput: function () {
            $('.qty-cnt').attr('value', this.getCurrentQuantity($('.sc-area'))); //sanitize input textbox
            this.recalculateTotal();
        },

        clickedCheckout: function (e) {
            var items = this.$('.sc-item');
            if (items.length > 0)
            {
                this.model.showCheckout();
            }
            
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
