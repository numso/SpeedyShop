/*global define */

define([
    'backbone',
    'tmpl!pages/customer/templates/items',
    'tmpl!pages/customer/templates/itemsTemplates/itemsList',
    'tmpl!pages/customer/templates/itemsTemplates/itemsBlock',
    'tmpl!pages/customer/templates/itemsTemplates/itemDetail',
    'tmpl!pages/customer/templates/itemsTemplates/giftDetail',
    'jquery-ui'
], function (
    Backbone,
    itemsTmpl,
    itemsListTmpl,
    itemsBlockTmpl,
    itemDetailTmpl,
    giftDetailTmpl
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
        isGiftCard: false,

        initialize: function () {
        },

        events: {
            "click .clickable-item": "showDetailView",
            "click .show-block-layout": "displayItemBlock",
            "click .show-list-layout": "displayItemList",
            "click .item-small-img": "loadImage",
            "click #back-btn": "back",
            "click .add-to-cart": "addItemToCart",
            "click .items-bottom-nav": "pageItems",
            "keyup .gift-email": "verifyEmailInput"
        },

        verifyEmailInput: function (e) {
            var theEmail = this.$('.gift-email').val();
            if (theEmail === "") {
                this.$('.gift-email').css('background-color', 'transparent');
            } else if (this.verifyEmail()) {
                this.$('.gift-email').css('background-color', 'rgba(60, 255, 60, 0.27)');
            } else {
                this.$('.gift-email').css('background-color', 'rgba(255, 60, 60, 0.27)');
            }
        },

        verifyEmail: function () {
            var theEmail = this.$('.gift-email').val();
            if (theEmail !== "" && theEmail.match(/[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Za-z]{2}|com|org|net|edu|gov|mil|biz|info|mobi|name|aero|asia|jobs|museum)\b/))
               return true;
            return false;
        },

        addItemToCart: function (e) {
            var id = parseInt($(e.target).closest('.id-cont').attr('id'), 10);
            if (this.isGiftCard) {
                var amt = parseInt(this.$('price').val(), 10);
                if (isNaN(amt) || amt === 0 || !this.verifyEmail())
                    return;
            }
            this.model.addItemToCart(id);
            this.stopPropagation(e);
        },

        showDetailView: function (e) {
            var id = parseInt($(e.target).closest('.clickable-item').attr('id'), 10);
            for (var i = 0; i < this.filteredItems.length; ++i) {
                if (this.filteredItems[i].id === id) {
                    if(this.filteredItems[i].name == "Gift Card")
                        {
                            this.$el.html(giftDetailTmpl(this.filteredItems[i]));
                            $(this.$('.item-small-img')[0]).addClass('selected-img');
                            this.model.showReviews(id);
                            $.get("/incrementPopularity/" + id);
                            return;
                        }
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
            this.isGiftCard = false;

            //special case for Hot Items
            if (catName === "Hot Items") {
                subcatName = catName;
            }
            if (catName === "Gift Cards"){
                this.isGiftCard = true;
            }

            if (catName === "search") {
                if (subcatName === '') {
                    this.gotItemsFromServer([], catName, subcatName);
                } else {
                    $.post('/search', JSON.stringify({searchString: subcatName}), function (items) {
                        that.gotItemsFromServer(items, catName, subcatName);
                    });
                }
                return;
            }

            // get the items from the server
            $.get('/getItems/' + subcatName, function (items) {
                // display the items in a list
                that.gotItemsFromServer(items, catName, subcatName);
            });
        },

        gotItemsFromServer: function (items, catName, subcatName) {
            for (var i = 0; i < items.length; ++i) {
                items[i].img = items[i].images[0];
                items[i].isOdd = (i % 2 === 0);
            }

            this.rawItems = items;
            this.filteredItems = items;
            this.catName = catName;
            this.subcatName = subcatName;

            if (items.length === 0) {
                this.$el.html(itemsTmpl({
                    msg: 'Sorry, we don\'t have any items in that category.'
                }));
            } else {
                this.$el.html(itemsTmpl({
                    cat: catName,
                    subcat: subcatName
                }));

                this.curIndex = 0;
                this.showItems();
            }
        },

        showItems: function () {
            this.updateFrame();
            if(this.isGiftCard)
            {
                this.$el.html(giftDetailTmpl(this.dispItems[0]));
            }

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

            var type = el.attr('id').replace('-navbuttons', '');

            if (type === "Next>") {
                if (this.curIndex + this.MAX_ITEMS >= this.filteredItems.length) {
                    return;
                }
                this.curIndex += this.MAX_ITEMS;
            } else if (type === "<Prev") {
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
            var tempArr = [];

            // if it's not the first page, put Prev on there
            if (this.curIndex > 0) {
                tempArr.push('<Prev');
            }

            // put a number for every page
            for (var i = 0; i < len / this.MAX_ITEMS; ++i) {
                tempArr.push(i+1);
            }

            // if it's not the last item, put Next on there
            if (this.curIndex < len - this.MAX_ITEMS) {
                tempArr.push('Next>');
            }

            if (tempArr.length <= 1) {
                this.$('.item-footer').html('');
            } else {
                // put the correct html tags around the array items
                var newFooter = $('<div>').addClass('item-footer');
                for (var i = 0; i < tempArr.length; ++i) {
                    newFooter.append($("<span>").addClass('items-bottom-nav').text(tempArr[i]).attr('id', tempArr[i]+'-navbuttons'));
                }
                this.$('.item-footer').replaceWith(newFooter);

                var selectedIndex = this.curIndex / 15 + 1;
                this.$('#' + selectedIndex + '-navbuttons').addClass('selected');
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
            this.setDragStuff();
        },

        displayItemBlock: function () {
            this.isList = false;
            this.$('.selected-btn').removeClass('selected-btn');
            this.$('.show-block-layout').addClass('selected-btn');
            this.$('.item-body-container').html(itemsBlockTmpl(this.dispItems));
            this.setDragStuff();
        },

        setDragStuff: function () {
            var that = this;

            this.$(".clickable-item" ).draggable({
                helper: 'clone',
                appendTo: 'body',
                start: function (e, ui) {
                    var newWidth = that.$('.clickable-item').width();
                    ui.helper.width(newWidth);
                    ui.helper.attr('id', this.id);
                }
            });
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
