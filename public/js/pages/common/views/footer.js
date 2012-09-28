/*global define */

define([
    'backbone',
    'tmpl!pages/common/templates/footer'
], function (
    Backbone,
    footerTmpl
) {
    return Backbone.View.extend({

        initialize: function () {
        },

        events: {
        },

        render: function () {
            this.$el.html(footerTmpl());
            return this;
        }
    });
});
