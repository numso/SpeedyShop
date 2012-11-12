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
        currentTab: null,

        initialize: function () {
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
            this.$('#tab-0').trigger('click');
            return this;
        },

        changeTab: function (e) {
            var tab = this.$(e.target).closest('.tab');
            if (this.currentTab)
                this.currentTab.removeClass('active');
            tab.addClass('active');
            this.$('.items-body').html(this.myTmpls[tab.attr('id').charAt(4)]);
            this.currentTab = tab;
        }
    });
});
