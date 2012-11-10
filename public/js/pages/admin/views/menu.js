/*global define */

define([
    'backbone',
    'tmpl!pages/admin/templates/menu'
], function (
    Backbone,
    menuTmpl
) {
    return Backbone.View.extend({
        currentView: undefined,

        initialize: function () {
        },

        events: {
            'click .expandable': 'toggleMenu',
            'click .clickable': 'openModule'
        },

        toggleMenu: function (e) {
            var el = $(e.target).closest('.expandable');
            var arrow = el.find('.arrow');
            var subMenu = el.next();

            if (arrow.hasClass('rotate')) {
                arrow.removeClass('rotate');
            } else {
                arrow.addClass('rotate');
            }

            subMenu.slideToggle(100);
        },

        openModule: function (e) {
            var el = $(e.target).closest('.clickable');
            this.model[el.attr('id')]();

            if (this.currentView)
                this.currentView.removeClass('active');
            else
                $('#showSalesReports').removeClass('active'); //sales report is active by default

            el.addClass('active');
            this.currentView = el;
        },

        render: function () {
            this.$el.html(menuTmpl());
            return this;
        }
    });
});
