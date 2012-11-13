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
        codeList: undefined, 

        render: function () {
            var that = this;
            $.get('/promocodes', function (items) {
                that.codeList = JSON.parse(items);
                console.log(that.codeList);
                that.$el.html(promocodelistTmpl(that.codeList));
            });
            return this;
        },

        // loadPromoCodes: function () {
        //     // get the promocode items from the server
        //     var that = this;
        //     $.get('/promocodes', function (items) {
        //         that.codeList = JSON.parse(items);
        //     });
        //     return this;
        // },

        gotPromoCodes: function(items){
            this.$('.promocode-list-module').append(promocodelistTmpl(this.items));
        }

    });
});
