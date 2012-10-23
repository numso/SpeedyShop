/*global define */

define([
    'backbone',
    'tmpl!pages/employee/templates/shipping'
], function (
    Backbone,
    shippingTmpl
) {
    return Backbone.View.extend({

        initialize: function () {
        },

        events: {
        },

        render: function () {
            this.$el.html(shippingTmpl());
            return this;
        }
    });
});
