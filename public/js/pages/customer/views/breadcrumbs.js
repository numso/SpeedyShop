/*global define */

define([
    'backbone',
    'tmpl!pages/customer/templates/breadcrumbs'
], function (
    Backbone,
    breadcrumbsTmpl
) {
    return Backbone.View.extend({
        ids: ['bc-confirmc', 'bc-billing', 'bc-payment', 'bc-confirmo'],

        initialize: function () {
        },

        events: {
        },

        render: function () {
            var arr = [
                "Confirm Cart",
                "Billing/Shipping",
                "Payment",
                "Confirm Order"
            ];

            for (var i = 0; i < arr.length; ++i) {
                arr[i] = {
                    text: arr[i],
                    id: this.ids[i],
                    isOdd: (i % 2 === 0)
                }
            }

            this.$el.html(breadcrumbsTmpl(arr));
            return this;
        },

        animateBreadcrumbs: function (id) {
            for (var i = 0; i < this.ids.length; ++i) {
                if (i < id) {
                    this.$('#' + this.ids[i]).addClass('rotate');
                } else {
                    this.$('#' + this.ids[i]).removeClass('rotate');
                }
            }
        }
    });
});
