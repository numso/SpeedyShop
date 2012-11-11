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

        lowInventory: function() {
            console.log(this.available);
            return this.available < 2;
        },

        render: function () {

        var that = this;
        $.get('/inventory', function (data) {
            that.inventoryData = JSON.parse(data);
            that.$el.html(inventoryTmpl(that.inventoryData));
        });

        return this;
        }

    });
});
