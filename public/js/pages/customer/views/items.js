/*global define */

define([
    'backbone',
    'tmpl!pages/customer/templates/items',
    'tmpl!pages/customer/templates/itemsTemplates/itemsList',
    'tmpl!pages/customer/templates/itemsTemplates/itemsBlock',
    'tmpl!pages/customer/templates/itemsTemplates/itemDetail'
], function (
    Backbone,
    itemsTmpl,
    itemsListTmpl,
    itemsBlockTmpl,
    itemDetailTmpl
) {
    return Backbone.View.extend({
        curItems: undefined,
        isList: true,
        catName:"",
        subcatName:"",

        initialize: function () {
        },

        events: {
            "click .clickable-item": "showDetailView",
            "click .show-block-layout": "displayItemBlock",
            "click .show-list-layout": "displayItemList",
            "click .item-small-img": "loadImage",
            "click #back-btn": "back"

        },

        showDetailView: function (e) {
            var el = $(e.target).closest('.clickable-item');
            this.$el.html(itemDetailTmpl(this.curItems[0]));
           $(this.$('.item-small-img')[0]).addClass('selected-img');
        },

        render: function () {
            this.$el.html(itemsTmpl({
                msg: 'Welcome to SpeedyShop! To start, use the categories above to choose from our wide variety of products.'
            }));
            return this;
        },

        loadItems: function (catName, subcatName) {
            var that = this;

            // get the items from the server
            $.get('/getItems/' + subcatName, function (items) {
                // display the items in a list
                that.curItems = items;
                that.catName = catName;
                that.subcatName = subcatName;
                
                if (items.length === 0) {
                    that.$el.html(itemsTmpl({
                        msg: 'Sorry, We don\'t have any items in that category.'
                    }));
                } else {
                    that.$el.html(itemsTmpl({
                        cat: catName,
                        subcat: subcatName
                    }));
                    if (that.isList) {
                        that.displayItemList();
                    } else {
                        that.displayItemBlock();
                    }
                }
            });
        },

        displayItemList: function () {
            this.isList = true;
            this.$('.selected-btn').removeClass('selected-btn');
            this.$('.show-list-layout').addClass('selected-btn');

            for (var i = 0; i < this.curItems.length; ++i) {
                this.curItems[i].isOdd = (i % 2 === 0);
            }

            this.$('.item-body').html(itemsListTmpl(this.curItems));
        },

        displayItemBlock: function () {
            this.isList = false;
            this.$('.selected-btn').removeClass('selected-btn');
            this.$('.show-block-layout').addClass('selected-btn');

            for (var i = 0; i < this.curItems.length; ++i) {
                this.curItems[i].isOdd = (i % 2 === 0);
            }

            this.$('.item-body').html(itemsBlockTmpl(this.curItems));
        },

        loadImage: function (e) {
            var el = $(e.target).closest('.item-small-img');
            var imgSrc = el.attr('src');
            this.$('.item-big-img').attr('src', imgSrc);

            this.$('.selected-img').removeClass('selected-img');
            el.addClass('selected-img');
        },
        back: function (e) {
            this.$el.html(itemsTmpl({
                cat: this.catName,
                subcat: this.subcatName
            }));
            if (this.isList) {
                this.displayItemList();
            } else {
                this.displayItemBlock();
            }
        }
    });
});
