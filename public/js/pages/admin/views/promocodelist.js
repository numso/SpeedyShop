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
            "click .row" : "openPromo",
            'click .delete-promo': 'deletePromo'
        },

        render: function () {
            var that = this;
            $.get('/promocodes', function (items) {
                that.codeList = JSON.parse(items);
                that.$el.html(promocodelistTmpl(that.codeList));
            });
            return this;
        },

        addPromo: function (data) {
            this.codeList.push(data);
            this.$el.html(promocodelistTmpl(this.codeList));
        },

        openPromo: function (e) {
            var el = parseInt($(e.target).closest('.row').find('.code-field').html(), 10);

            for(var n = 0; n < this.codeList.length; ++n)
                if(this.codeList[n].code == el)
                    var pickedPromo = this.codeList[n];

            this.model.showPromo(pickedPromo);

        },

        deletePromo: function(e){
            var el = parseInt($(e.target).closest('.row').find('.code-field').html(), 10);
            
            for(var n = 0; n < this.codeList.length; ++n)
                if(this.codeList[n].code == el)
                    var killPromo = this.codeList[n];


            var newList = [];
            for(var n = 0; n < this.codeList.length; ++n)
                {
                    if(this.codeList[n] == killPromo)
                    {
                        console.log(this.codeList[n]);
                        console.log(killPromo);
                    }
                    else
                    {
                        newList.push(this.codeList[n]);
                    }
                }

            console.log(newList);

            this.codeList = newList;
            this.$el.html(promocodelistTmpl(newList));
        }


    });
});
