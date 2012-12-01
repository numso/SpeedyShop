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
            'click .submitChange': 'submitChange'
        },

        render: function () {
            var that = this;
            $.get('/getStateTaxes', function (data) {
                var taxes = data;
                that.$el.html(stateTaxesTmpl(taxes));
                that.$('.change-confirmed').removeClass('change-confirmed'); //doesn't work!
            });

            return this;
        },

        submitChange: function (e) {
            var change = {
                state: $(e.target).closest('td').attr("class"),
                newRate: $(e.target).closest('tr').find('input').val()
            };

            var that = this;
            var response = $.post("/changeTax", JSON.stringify(change), function (response) {
                if (response === "OK") {
                    that.$(e.target).attr("class", "change-confirmed");
                }
                else {
                    window.alert("Error submitting item. Invalid or missing data?.\nServer responded: " + response);
                }
            });
        }
    });
});