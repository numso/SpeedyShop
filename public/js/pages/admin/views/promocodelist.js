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
            "click #add-new-btn": "addNew",
        },
        codeList: undefined, 

        render: function () {
            var that = this;
            $.get('/promocodes', function (items) {
                that.codeList = JSON.parse(items);
                // console.log(that.codeList);
                that.$el.html(promocodelistTmpl(that.codeList));
            });
            return this;
        },

        addNew: function () {
            
        },

        gotPromoCodes: function(items){
            this.$('.promocode-list-module').append(promocodelistTmpl(this.items));
        }

    });
});
