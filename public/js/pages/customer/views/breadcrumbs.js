/*global define */

define([
    'backbone',
    'tmpl!pages/customer/templates/breadcrumbs'
], function (
    Backbone,
    breadcrumbsTmpl
) {
    return Backbone.View.extend({

        initialize: function () {
        },

        events: {
        },

        render: function () {
            this.$el.html(breadcrumbsTmpl());
            return this;
        }
    });
});
