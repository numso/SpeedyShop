/*global define */

define([
    'backbone',
    'tmpl!pages/admin/templates/promocodelist'
], function (
    Backbone,
    promocodelistTmpl
) {
    return Backbone.View.extend({
        promocodeItems: [],
        initialize: function () {
        },

        events: {
        },

        render: function () {
            this.$el.html(promocodelistTmpl());

            return this;
        },

        loadPromoCodes: function () {
            var that = this;

            // get the promocode items from the server
            $.get('/promocodes/', function (items) {
                // display the promocode items in a list
                that.gotPromoCodes(items);
            });
        },

        gotPromoCodes: function(items){
            this.$('.promocode-list-module').append(promocodelistTmpl(this.items));
        }

    });
});