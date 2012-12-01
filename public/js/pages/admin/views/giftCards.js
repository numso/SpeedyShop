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
            
        },

        events: {
            
        },

        render: function () {
            this.$el.html(giftCardTmpl());
            return this;
        }
    });
});