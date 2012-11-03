/*global define */

define([
    'backbone',
    'tmpl!pages/employee/templates/menu'
], function (
    Backbone,
    menuTmpl
) {
    return Backbone.View.extend({

        initialize: function () {
        },

        events: {
            'click .clickable': 'openModule',
            'click .processed-btn': 'showProcessed',
            'click .completed-btn': 'showCompleted'
        },

        showProcessed: function (e) {
            this.$('.order-box').hide();
            this.$('.Processed-item').show();


        },


        showCompleted: function (e) {
            this.$('.order-box').hide();
            this.$('.Completed-item').show();

            
        },

        openModule: function (e) {
            var el = $(e.target).closest('.clickable');
            this.model[el.attr('id')]();
        },

        render: function () {

            var that = this;
            $.get('/orders', function (data) {
                that.$el.html(menuTmpl(data));
            });

            return this;
        }
    });
});
