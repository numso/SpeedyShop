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
        },

        render: function () {
            this.$el.html(menuTmpl());
            return this;
        }
    });
});
