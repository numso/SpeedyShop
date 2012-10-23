/*global define */

define([
    'backbone',
    'tmpl!pages/admin/templates/inventory'
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
