/*global define */

define([
    'backbone',
    'tmpl!pages/customer/templates/filters'
], function (
    Backbone,
    filtersTmpl
) {
    return Backbone.View.extend({

        initialize: function () {
        },

        events: {
        },

        render: function () {
            this.$el.html(filtersTmpl());
            return this;
        }
    });
});
