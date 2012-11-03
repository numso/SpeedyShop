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
        dispItems: [],
        isList: true,
        catName: '',
        subcatName: '',
        MAX_ITEMS: 15,
        curIndex: 0,

        initialize: function () {
        },

        events: {
            "click .clickable-item": "showDetailView",
            "click .show-block-layout": "displayItemBlock",
            "click .show-list-layout": "displayItemList",
            "click .item-small-img": "loadImage",
            "click #back-btn": "back",
            "click .add-to-cart": "addItemToCart",
            "click .items-bottom-nav": "pageItems"
        },

        addItemToCart: function (e) {
            var id = parseInt($(e.target).closest('.id-cont').attr('id'), 10);
            this.model.addItemToCart(id);
            this.stopPropagation(e);
        },

        showDetailView: function (e) {
            var id = parseInt($(e.target).closest('.clickable-item').attr('id'), 10);
            for (var i = 0; i < this.curItems.length; ++i) {
                if (this.curItems[i].id === id) {
                    this.$el.html(itemDetailTmpl(this.curItems[i]));
                    $(this.$('.item-small-img')[0]).addClass('selected-img');
                    this.model.showReviews(id);
                    $.get("/incrementPopularity/" + id);
                    return;
                }
            }
        },

        render: function () {
            this.$el.html(itemsTmpl({
                msg: 'Welcome to SpeedyShop! To start, use the categories above to choose from our wide variety of products.'
            }));
            return this;
        },

        loadItems: function (catName, subcatName) {
            var that = this;

            //special case for Hot Items
            if (catName === "Hot Items")
                subcatName = catName;

            // get the items from the server
            $.get('/getItems/' + subcatName, function (items) {
                // display the items in a list
                for (var i = 0; i < items.length; ++i) {
                    items[i].img = items[i].images[0];
                    items[i].isOdd = (i % 2 === 0);
                }

                that.curItems = items;
                that.catName = catName;
                that.subcatName = subcatName;

                if (items.length === 0) {
                    that.$el.html(itemsTmpl({
                        msg: 'Sorry, we don\'t have any items in that category.'
                    }));
                } else {
                    that.$el.html(itemsTmpl({
                        cat: catName,
                        subcat: subcatName
                    }));

                    that.curIndex = 0;
                    that.updateFrame();

                    if (that.isList) {
                        that.displayItemList();
                    } else {
                        that.displayItemBlock();
                    }
                }
            });
        },

        pageItems: function (e) {
            var el = $(e.target).closest('.items-bottom-nav');

            if (el.hasClass('selected')) {
                return;
            }

            var type = el.text()[0];

            if (type === "N") {
                if (this.curIndex + this.MAX_ITEMS >= this.curItems.length) {
                    return;
                }
                this.curIndex += this.MAX_ITEMS;
            } else if (type === "<") {
                if (this.curIndex === 0) {
                    return;
                }
                this.curIndex -= this.MAX_ITEMS;
            } else {
                var clickedNum = parseInt(type, 10);
                this.curIndex = (clickedNum - 1) * this.MAX_ITEMS;
            }

            this.updateFrame();

            if (this.isList) {
                this.displayItemList();
            } else {
                this.displayItemBlock();
            }
        },

        updateFrame: function () {
            // draw the header (Showing 1 to 20 of 2000) ///////////////////////////
            var len = this.curItems.length,
                start = this.curIndex + 1,
                end = (start + this.MAX_ITEMS - 1) > len ? len : (start + this.MAX_ITEMS - 1);

            this.$('.item-info').find('span').text(start + ' to ' + end + ' of ' + len);

            // draw the footer (<Prev 1 2 3 Next>) /////////////////////////////////
            var tempArr = [];

            // if it's not the first page, put Prev on there
            if (this.curIndex > 0) {
                tempArr.push('&lt;Prev');
            }

            // put a number for every page
            for (var i = 0; i < len / this.MAX_ITEMS; ++i) {
                tempArr.push(i+1);
            }

            // if it's not the last item, put Next on there
            if (this.curIndex < len - this.MAX_ITEMS) {
                tempArr.push('Next&gt;');
            }

            if (tempArr.length <= 1) {
                this.$('.item-footer').html('');
            } else {
                // put the correct html tags around the array items
                var newFooter = '<span class="items-bottom-nav">' + tempArr.join('</span> <span class="items-bottom-nav">') + '</span>';
                this.$('.item-footer').html(newFooter);
                // $(this.$('.items-bottom-nav')[1]).addClass('selected');
            }

            this.dispItems.length = 0;
            for (var i = start - 1; i < end; ++i) {
                this.dispItems.push(this.curItems[i]);
            }
        },

        displayItemList: function () {
            this.isList = true;
            this.$('.selected-btn').removeClass('selected-btn');
            this.$('.show-list-layout').addClass('selected-btn');
            this.$('.item-body-container').html(itemsListTmpl(this.dispItems));
        },

        displayItemBlock: function () {
            this.isList = false;
            this.$('.selected-btn').removeClass('selected-btn');
            this.$('.show-block-layout').addClass('selected-btn');
            this.$('.item-body-container').html(itemsBlockTmpl(this.dispItems));
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

            this.model.showFilters();
        },

        stopPropagation: function (e) {
            if (!e) { e = window.event; }
            if (e.cancelBubble) { e.cancelBubble = true; }
            else { e.stopPropagation(); }
        }
    });
});
