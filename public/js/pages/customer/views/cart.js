/*global define */

define([
    'backbone',
    'tmpl!pages/customer/templates/cart'
], function (
    Backbone,
    cartTmpl
) {
    return Backbone.View.extend({

        initialize: function () {
        },

        events: {
        },

        render: function () {
            this.$el.html(cartTmpl());
            return this;
        }
    });
});
