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
        rawItems: [],
        dispItems: [],
        filteredItems: [],
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
            for (var i = 0; i < this.filteredItems.length; ++i) {
                if (this.filteredItems[i].id === id) {
                    this.$el.html(itemDetailTmpl(this.filteredItems[i]));
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

        updateFilteredItems: function (data) {
            this.applyFilters(data);

           if (this.filteredItems.length === 0) {
                this.$el.html(itemsTmpl({
                    msg: 'Sorry, we don\'t have any items in that category that match your filters.'
                }));
            } else {
                this.$el.html(itemsTmpl({
                    cat: this.catName,
                    subcat: this.subcatName
                }));

                this.curIndex = 0;
                this.showItems();
            }
        },

        applyFilters: function (data) {
            this.filteredItems = this.rawItems;

            // filter based on rating
            var tempArray = [];
            if (data.ratings !== undefined) {
                for (var i = 0; i < this.filteredItems.length; ++i) {
                    var added = false;
                    for (var j = 0; j < data.ratings.length && !added; ++j) {
                        if (this.filteredItems[i].rating === data.ratings[j]) {
                            tempArray.push(this.filteredItems[i]);
                            added = true;
                        }
                    }
                }
                this.filteredItems = tempArray;
            }

            // filter based on lower price
            tempArray = [];
            if (data.lwrPrice !== undefined) {
                for (i = 0; i < this.filteredItems.length; ++i) {
                    if (this.filteredItems[i].price >= data.lwrPrice) {
                        tempArray.push(this.filteredItems[i]);
                    }
                }
                this.filteredItems = tempArray;
            }

            // filter based on upper price
            tempArray = [];
            if (data.uprPrice !== undefined) {
                for (i = 0; i < this.filteredItems.length; ++i) {
                    if (this.filteredItems[i].price <= data.uprPrice) {
                        tempArray.push(this.filteredItems[i]);
                    }
                }
                this.filteredItems = tempArray;
            }

            // filter based on category
            tempArray = [];
            if (data.cat && data.cat !== "Everything") {
                for (i = 0; i < this.filteredItems.length; ++i) {
                    if (this.filteredItems[i].cat) {
                        added = false;
                        for (j = 0; j < this.filteredItems[i].cat.length; ++j) {
                            if (this.filteredItems[i].cat[j] === data.cat) {
                                tempArray.push(this.filteredItems[i])
                                added = true;
                            }
                        }
                    }
                }
                this.filteredItems = tempArray;
            }
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

                that.rawItems = items;
                that.filteredItems = items;
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
                    that.showItems();
                }
            });
        },

        showItems: function () {
            this.updateFrame();

            if (this.isList) {
                this.displayItemList();
            } else {
                this.displayItemBlock();
            }
        },

        pageItems: function (e) {
            var el = $(e.target).closest('.items-bottom-nav');

            if (el.hasClass('selected')) {
                return;
            }

            var type = el.text()[0];

            if (type === "N") {
                if (this.curIndex + this.MAX_ITEMS >= this.filteredItems.length) {
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

            this.$('.item-body').scrollTop(0);
            this.showItems();
        },

        updateFrame: function () {
            // draw the header (Showing 1 to 20 of 2000) ///////////////////////////
            var len = this.filteredItems.length,
                start = this.curIndex + 1,
                end = (start + this.MAX_ITEMS - 1) > len ? len : (start + this.MAX_ITEMS - 1);

            this.$('.item-info').find('span').text(start + ' - ' + end + ' out of ' + len);

            // draw the footer (<Prev 1 2 3 Next>) /////////////////////////////////
            var tempArr = [],
                prevExists = 0;

            // if it's not the first page, put Prev on there
            if (this.curIndex > 0) {
                prevExists = 1;
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

                var selectedIndex = this.curIndex / 15 + prevExists;
                $(this.$('.items-bottom-nav')[selectedIndex]).addClass('selected');
            }

            this.dispItems.length = 0;
            for (var i = start - 1; i < end; ++i) {
                this.dispItems.push(this.filteredItems[i]);
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

            this.showItems();
            this.model.showFilters();
        },

        stopPropagation: function (e) {
            if (!e) { e = window.event; }
            if (e.cancelBubble) { e.cancelBubble = true; }
            else { e.stopPropagation(); }
        }
    });
});
