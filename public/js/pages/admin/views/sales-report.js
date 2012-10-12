/*global define */

define([
    'backbone',
    'tmpl!pages/admin/templates/sales-report'
], function (
    Backbone,
    salesReportTmpl
) {
    return Backbone.View.extend({

        initialize: function () {
        },

        events: {
        },

        render: function () {
            this.$el.html(salesReportTmpl());
            return this;
        }
    });
});
