/*global define */

define([
    'backbone',
    'tmpl!pages/admin/templates/promocodelist',

], function (
    Backbone,
    promocodelistTmpl
) {
    return Backbone.View.extend({
        codeList: undefined, 
        initialize: function () {
        },

        events: {
            "click .add-new-btn": "addNew",
            "click .row" : "openPromo"
        },

        render: function () {
            var that = this;
            $.get('/promocodes', function (items) {
                that.codeList = JSON.parse(items);
                that.$el.html(promocodelistTmpl(that.codeList));
            });
            return this;
        },

        addNew: function () {
            console.log("im in here!");
        },

        openPromo: function (e) {
            var el = parseInt($(e.target).closest('.code-field').html(), 10);

            for(var n = 0; n < this.codeList.length; ++n)
                if(this.codeList[n].code == el)
                    var pickedPromo = this.codeList[n];

            this.model.showPromo(pickedPromo);

        }


    });
});
