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
        },

        render: function () {
            this.$el.html(cartTmpl());
            return this;
        },

        addItem: function (id) {
            var that = this;

            $.get('/getItem/' + id, function (data) {
                if (data.status === "success") {
                    that.$('.sc-area').append(scItemTmpl(data.item));
                } else {
                    console.log('uh oh, something\'s up. Could\'t get the item');
                }
            });
        }
    });
});
