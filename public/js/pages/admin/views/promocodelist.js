/*global define */

define([
    'backbone',
    'tmpl!pages/admin/templates/promocodelist'
], function (
    Backbone,
    promocodelistTmpl
) {
    return Backbone.View.extend({

        initialize: function () {
        },

        events: {
        },

        render: function () {
            this.$el.html(promocodelistTmpl());
            return this;
        }
    });
});