/*global define */

define([
    'backbone',
    'tmpl!pages/admin/templates/items',
    'tmpl!pages/admin/templates/itemList/addItem',
    'tmpl!pages/admin/templates/itemList/deleteItems',
    'tmpl!pages/admin/templates/itemList/editItems'
], function (
    Backbone,
    itemsTmpl,
    addItemTmpl,
    deleteItemsTmpl,
    editItemsTmpl
) {
    return Backbone.View.extend({

        myTmpls: undefined,
        currentTab: undefined,

        initialize: function () {
            currentTab = this.$('#tab-0');
            this.myTmpls = [
                addItemTmpl,
                editItemsTmpl,
                deleteItemsTmpl
            ];
        },

        events: {
            'click .tab': 'changeTab'
        },

        render: function () {
            this.$el.html(itemsTmpl());
            this.$('.items-body').html(addItemTmpl);
            return this;
        },

        changeTab: function (e) {
            var tab = this.$(e.target).closest('.tab');
            currentTab.removeClass('active');
            tab.addClass('active');
            console.log(tab);
            this.$('.items-body').html(this.myTmpls[tab.attr('id').charAt(4)]);
            currentTab = tab;
        }
    });
});
