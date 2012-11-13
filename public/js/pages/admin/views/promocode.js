/*global define */

define([
    'backbone',
    'tmpl!pages/admin/templates/promocode'
], function (
    Backbone,
    promocodeTmpl
) {
    return Backbone.View.extend({

        initialize: function () {
            
        },

        events: {
        },

        render: function () {
            this.$el.html(promocodeTmpl());
            return this;
        }
    });
});