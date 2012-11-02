/*global define */

define([
    'backbone',
    'tmpl!pages/customer/templates/filters'
], function (
    Backbone,
    filtersTmpl
) {
    return Backbone.View.extend({

        initialize: function () {
        },

        events: {
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

            $.post('/filters', JSON.stringify(myObj), function (data) {
                that.$el.html(filtersTmpl({
                    data: data,
                    subcat: subcat
                }));
            })
        }
    });
});
