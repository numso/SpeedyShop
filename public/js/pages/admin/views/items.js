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
            this.myTmpls = [
                addItemTmpl,
                editItemsTmpl,
                deleteItemsTmpl
            ];
        },

        events: {
            'click .tab': 'changeTab',
            'click select, input, textarea': 'verify',
            'keypress select, input, textarea': 'verify',
            'click .submit-button': 'submitItem'
        },

        render: function () {
            this.$el.html(itemsTmpl());
            this.$('#tab-0').trigger('click'); //fires a click event to open first tab
            return this;
        },

        changeTab: function (e) {
            var tab = this.$(e.target).closest('.tab');
            if (this.currentTab)
                this.currentTab.removeClass('active');
            tab.addClass('active');
            this.$('.items-body').html(this.myTmpls[tab.attr('id').charAt(4)]);
            this.currentTab = tab;
            this.verify(undefined);
        },

        getFormData: function () {
            var page = this.$(".tab-page");
            return [
                page.find('.item-name').val(),
                page.find('textarea').val(),
                page.find('.main-cat').val(),
                page.find('.secondary-cat').val(),
                page.find('.type-cat').val(),
                page.find('.item-cost').val(),
                page.find('.item-price').val(),
                page.find('.img-url-1').val(),
                page.find('.img-url-2').val(),
                page.find('.img-url-3').val(),
                page.find('.img-url-4').val()
            ];
        },

        verify: function (e) {

            if (this.currentTab.attr('id').charAt(4) == 0) {
                var formData = this.getFormData();

                var allFilled = true;
                for (var j = 0; j < formData.length; ++j)
                    if (!formData[j])
                        allFilled = false;

                if (allFilled) {
                    this.$('.submit-button').attr("disabled", false); //we're good
                    //this.updateImages(formData); //has issues, so commenting out for now
                } else {
                    this.$('.submit-button').attr("disabled", true); //we can't submit an item with any empty fields
                }
            }
        },

        updateImages: function (formData) { //trying to have the images update automatically
            this.$('.items-body').html(addItemTmpl({
                "img-url-1": formData[7],
                "img-url-2":formData[8],
                "img-url-3": formData[9],
                "img-url-4": formData[10]
            }));
        },

        submitItem: function (e) { //assemble item and submit to server
            var formData = this.getFormData();
            var itemData = {
                "name": formData[0],
                "desc": formData[1],
                "cat": [formData[2], formData[3], formData[4]],
                "price": parseInt(formData[6], 10), //what about price? hmm..
                "images": [formData[7], formData[8], formData[9], formData[10]]
            };

            console.log('sending: ' + JSON.stringify(itemData));
            var resp = $.post("/addItem", JSON.stringify(itemData), function (resp) {
                console.log("Response: " + JSON.stringify(resp)); //is this how I check the response? I'm confused...
            });

            this.$('.items-body').html(addItemTmpl()); //reset
            this.verify(null); //will disable submit button due to reset
        }
    });
});
