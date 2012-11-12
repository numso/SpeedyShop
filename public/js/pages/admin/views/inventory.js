/*global define */

define([
    'backbone',
    'tmpl!pages/admin/templates/inventory'
], function (
    Backbone,
    inventoryTmpl
) {
    return Backbone.View.extend({

        curInventory : undefined,

        initialize: function () {
        },

        events: {
            'click .update-items' :  'editQuantity'
        },

        editQuantity: function() {
            
            
        },

        lowInventory: function() {
            console.log(this.available);
            return this.available < 2;
        },

        render: function () {

        var that = this;
        $.get('/inventory', function (data) {
            that.curInventory = JSON.parse(data);
            that.$el.html(inventoryTmpl(that.curInventory));
        });

        return this;
        }

    });
});
