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
            "blur .priceFilter input": "applyFilter",
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

            var lowerPrice = parseFloat(this.$('.lowerPriceText').val(), 10);
            if (isNaN(lowerPrice)) {
                this.$('.lowerPriceText').val('');
                lowerPrice = undefined;
            } else {
                this.$('.lowerPriceText').val(lowerPrice);
            }

            var upperPrice = parseFloat(this.$('.upperPriceText').val(), 10);
            if (isNaN(upperPrice)) {
                this.$('.upperPriceText').val('');
                upperPrice = undefined;
            } else {
                this.$('.upperPriceText').val(upperPrice);
            }

            var chosenRatings = [];
            for (var i = 0; i < 5; ++i)
                if ($(this.$('.ratingFilterList input')[i]).is(':checked'))
                    chosenRatings.push(i + 1);

            var chosenSubcat = $('input[name=subCatFilter]:radio:checked').val();

            var chosenFilters = {
                lwrPrice: lowerPrice,
                uprPrice: upperPrice,
                ratings: chosenRatings,
                cat: chosenSubcat
            };
            this.model.applyFilters(chosenFilters);
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
                    subcat: subcat,
                    ratings: [1, 2, 3, 4, 5]
                }));
            });
        }
    });
});
