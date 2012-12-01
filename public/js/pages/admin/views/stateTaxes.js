/*global define */

define([
    'backbone',
    'tmpl!pages/admin/templates/stateTaxes'
], function (
    Backbone,
    stateTaxesTmpl
) {
    return Backbone.View.extend({

        initialize: function () {
        },

        events: {
            
        },

        render: function () {
            var that = this;
            $.get('/getStateTaxes', function (data) {
                var taxes = data;
                that.$el.html(stateTaxesTmpl(taxes));
            });

            return this;
        }
    });
});