/*global define */

define([
    'backbone',
    'tmpl!pages/admin/templates/menu'
], function (
    Backbone,
    menuTmpl
) {
    return Backbone.View.extend({

        initialize: function () {
        },

        events: {
        },

        render: function () {
            this.$el.html(menuTmpl());
            return this;
        }
    });
});
