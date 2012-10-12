/*global define */

define([
    'backbone',
    'tmpl!pages/templates/inventory'
], function (
    Backbone,
    inventoryTmpl
) {
    return Backbone.View.extend({

        initialize: function () {
        },

        events: {
        },

        render: function () {
            this.$el.html(inventoryTmpl());
            return this;
        }
    });
});
