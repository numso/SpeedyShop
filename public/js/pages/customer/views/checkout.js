/*global define */

define([
    'backbone',
    'tmpl!pages/customer/templates/checkout'
], function (
    Backbone,
    checkoutTmpl
) {
    return Backbone.View.extend({

        initialize: function () {
        },

        events: {
        },

        render: function () {
            this.$el.html(checkoutTmpl());
            return this;
        }
    });
});
