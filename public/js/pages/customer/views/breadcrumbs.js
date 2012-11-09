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
            var arr = [
                "Confirm Cart",
                "Billing",
                "Shipping",
                "Payment",
                "Confirm Order"
            ];

            for (var i = 0; i < arr.length; ++i) {
                arr[i] = {
                    text: arr[i],
                    isOdd: (i % 2 === 0)
                }
            }

            this.$el.html(breadcrumbsTmpl(arr));
            return this;
        },

        animateBreadcrumbs: function (id) {
            console.log('You are now on step ' + id + '. Animate appropriately.');
            console.log('id will be between 0 and the length');
            console.log('Remember, it could go backwards or forwards.');
        }
    });
});
