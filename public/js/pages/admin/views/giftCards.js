/*global define */

define([
    'backbone',
    'tmpl!pages/admin/templates/giftCards'
], function (
    Backbone,
    giftCardTmpl
) {
    return Backbone.View.extend({

        initialize: function () {
            var that = this;
            $.get('/getGiftCards', function (data) {
                var cards = data;
                that.$el.html(giftCardTmpl(cards));
            });

            return this;  
        },

        events: {
            
        },

        render: function () {
            this.$el.html(giftCardTmpl());
            return this;
        }
    });
});