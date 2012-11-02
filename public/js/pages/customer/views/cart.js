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
            $.get('/getItem/' + id, function (data) {
                if (data.status === "success") {
                    this.$('.sc-area').append(scItemTmpl(data));
                } else {
                    console.log('uh oh, something\'s up. Could\'t get the item');
                }
            });
        }
    });
});
