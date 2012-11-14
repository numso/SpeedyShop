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
            'click .qty-cnt': 'sanitizeQuantityInput',
            'mousewheel .qty-cnt': 'sanitizeQuantityInput',
            'click .X-button': 'removeItem'
        },

        render: function () {
            this.$el.html(cartTmpl());
            this.addDroppable();
            return this;
        },

        addDroppable: function () {
            var that = this;
            this.$('.sc-area').droppable({
                accept: '.clickable-item',
                activeClass: 'active-cart',
                hoverClass: 'hover-cart',
                tolerance: 'touch',
                drop: function (e, ui) {
                    var id = parseInt(ui.helper.attr('id'), 10);
                    that.addItem(id);
                }
            });
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

            this.$('.qty-cnt, .X-button').attr('disabled', false);

            var el = that.$('#' + id);
            if (el.length > 0) {
                //item is already in cart, so just increment its quantity
                for (var i = 0; i < this.cart.length; ++i) {
                    if (this.cart[i].id === id) {
                        this.cart[i].quantity++;
                    }
                }

                el.find('.qty-cnt').attr('value', this.getCurrentQuantity(el) + 1);
                this.recalculateTotal();

            } else { //item is not already in cart, so find it and add it
                $.get('/getItem/' + id, function (data) {
                    if (data.status === "success") {
                        var itemObj = {
                            id: id,
                            imgURL: data.item.imgURL,
                            name: data.item.name,
                            price: data.item.price,
                            quantity: 1
                        };

                        that.cart.push(itemObj);
                        that.$('.sc-area').append(scItemTmpl(itemObj)); //show item
                        that.$('#check-out-btn').removeAttr("disabled"); //enable checkout button
                        that.recalculateTotal();

                    } else {
                        console.log('uh oh, something\'s up. Could\'t get the item');
                    }
                });

                //add event to item div so that user can type in a new quantity then press Enter
                this.$('.sc-area').keypress(function(event) {
                    var keycode = (event.keyCode ? event.keyCode : event.which);
                    if (keycode == '13') {
                        that.sanitizeQuantityInput();
                    }
                });
            }
        },

        removeItem: function (e) {
            var itemID = this.$(e.target).closest('.sc-item').attr('id');
            for (var i = 0; i < this.cart.length; ++i) {
                if (this.cart[i].id == itemID) {
                    this.cart.splice(i, 1); //remove object at index i
                    break;
                }
            }

            this.$el.html(cartTmpl()); //reset cart
            for (var i = 0; i < this.cart.length; ++i) {
                this.$('.sc-area').append(scItemTmpl(this.cart[i])); //show item
                this.addDroppable();
            }
            this.recalculateTotal();
        },

        sanitizeQuantityInput: function () {
            for (var i = 0; i < this.cart.length; ++i) {
                var item = this.$('#' + this.cart[i].id);
                var quantity = this.getCurrentQuantity(item);

                item.find('.qty-cnt').attr('value', quantity);
                this.cart[i].quantity = quantity;
            }

            this.recalculateTotal();
        },

        clickedCheckout: function (e) {

            var items = this.$('.sc-item');
            if (items.length > 0)
            {
                this.model.showCheckout();
            }
            this.$('.qty-cnt, .X-button, #check-out-btn').attr('disabled', true);

            this.model.showCheckout();
        },

        continueShopping: function () {
            this.$('.qty-cnt, .X-button').attr('disabled', false);
        },

        recalculateTotal: function () {
            var total = 0;
            var items = this.$('.sc-item');
            for (var i = 0; i < items.length; ++i) {
                var qty = this.getCurrentQuantity(this.$(items[i]));
                var price = parseFloat(this.$(items[i]).find('.sc-price').find('span').html(), 10);
                total += qty * price;
            }

            //disable the checkout button if the cart is empty
            if (total === 0)
                this.$('#check-out-btn').attr("disabled", true);
            else
                this.$('#check-out-btn').attr("disabled", false);

            this.$('.sc-total').find('span').html(total);
        }
    });
});
