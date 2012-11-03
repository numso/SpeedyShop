/*global define */

define([
    'backbone',
    'tmpl!pages/customer/templates/filters',
    'tmpl!pages/customer/templates/items'
], function (
    Backbone,
    filtersTmpl,
    itemsTmpl
) {
    return Backbone.View.extend({

        initialize: function () {
        },

        events: {
            "click .ratingFilterList li": "applyFilter",
            "click .priceFilter button": "applyFilter",
            "click .filter-value-box": "applyFilter"
        },

        applyFilter: function (e) {
            //toggle checkbox if ratings image is clicked on
            if ($(e.target).hasClass('ratingsImg')) {
                var el = $(e.target).closest('li').find('input');
                el.attr('checked', !el.attr('checked'));
            }

            if ($(e.target).hasClass('subcat-radio-value')) {
                var el = $(e.target).find('input');
                el.attr('checked', true);
            }

            var lowerPrice = this.$('.lowerPriceText').attr('value');
            var upperPrice = this.$('.upperPriceText').attr('value');

            var chosenRatings = [];
            for (var i = 0; i < 5; ++i)
                if ($(this.$('.ratingFilterList input')[i]).is(':checked'))
                    chosenRatings.push(i + 1);

            var chosenSubcat = $('input[name=subCatFilter]:radio:checked').attr('value');

            var chosenFilters = [lowerPrice, upperPrice, chosenRatings, chosenSubcat];
            console.log("applyFilter called, " + JSON.stringify(chosenFilters));
        },

        render: function () {
            this.$el.html(filtersTmpl());
            return this;
        },

        selectedItem: function (cat, subcat) {
            var myObj = {
                cat: cat,
                subcat: subcat
            };
            var that = this;

            if (cat == "Hot Items")
                subcat = undefined;

            $.post('/filters', JSON.stringify(myObj), function (data) {
                that.$el.html(filtersTmpl({
                    data: data,
                    subcat: subcat
                }));
            });
        }
    });
});
