/*global define */

define([
    'backbone',
    'tmpl!pages/customer/templates/reviews'
], function (
    Backbone,
    reviewsTmpl
) {
    return Backbone.View.extend({

        initialize: function () {
        },

        events: {
        },

        render: function () {
            this.$el.html(reviewsTmpl());
            return this;
        }
    });
});
