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
            'click .update-items' :  'editQuantity',
            'click .commit-changes' : 'commitChanges'
        },

        editQuantity: function() {

            var itemsToChange = [];
            this.$('.inventory-wrapper > .item-box > .update-stock').each(function (index) {

                var thisValue = $(this).val();
                if (thisValue > 0 && !isNaN(thisValue)) {
                    var thisItem = {
                        index : index,
                        newValue : thisValue
                    }

                    itemsToChange.push(thisItem);
                }
           });

           for (var x = 0; x < itemsToChange.length; ++x)
                for (var n = 0; n < this.curInventory.length; ++n)
                        if (itemsToChange[x].index == this.curInventory[n].id)
                            this.curInventory[n].available = itemsToChange[x].newValue;

            this.$el.html(inventoryTmpl(this.curInventory));
            console.log(this.curInventory);

        },

        lowInventory: function() {
            console.log(this.available);
            return this.available < 2;
        },

        commitChanges: function() {
            console.log('sending:');

            $.post('/editInventory', JSON.stringify(this.curInventory), function (resp) {
                console.log("Response: " + JSON.stringify(resp));
            });
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
