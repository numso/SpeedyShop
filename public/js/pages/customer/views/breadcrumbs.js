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
                "Billing Info",
                "Shipping Info",
                "Payment Info",
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
        }
    });
});
