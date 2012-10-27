/*global define */

define([
    'backbone',
    'tmpl!pages/customer/templates/items',
    'tmpl!pages/customer/templates/itemsTemplates/itemsList',
    'tmpl!pages/customer/templates/itemsTemplates/itemDetail'
], function (
    Backbone,
    itemsTmpl,
    itemsListTmpl,
    itemDetailTmpl
) {
    return Backbone.View.extend({
        curItems: undefined,

        initialize: function () {
        },

        events: {
            "click .clickable-item": "showDetailView"
        },

        showDetailView: function (e) {
            var el = $(e.target).closest('.clickable-item');
            this.$el.html(itemDetailTmpl(this.curItems[0]));
        },

        render: function () {
            this.$el.html(itemsTmpl());
            return this;
        },

        displayItemList: function (catName) {
            console.log('get category ' + catName);
            var that = this;

            // get the items from the server
            $.get('/getItems/' + catName, function (items) {
                // display the items in a list
                that.curItems = items;
                that.$el.html(itemsListTmpl(items));
            });
        }
    });
});
