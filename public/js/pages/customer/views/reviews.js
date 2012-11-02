/*global define */

define([
    'backbone',
    'tmpl!pages/customer/templates/reviews'
], function (
    Backbone,
    reviewsTmpl
) {
    return Backbone.View.extend({

        initialize: function () {
        },

        events: {
        },

        render: function () {
            this.$el.html(reviewsTmpl());
            return this;
        },

        clickedReview: function (id) {
            // someone clicked on item with id: id
        }
    });
});




// var arr = $.get('/reviews/0', function (data) {
        // data is that array
// });

// arr[0].count; // number of 1 stars

// for (var i = 0, len = arr[0].reviews.length; i < len; ++i) { // loops through all 1 stars
//     arr[0].reviews[i].name;
//     arr[0].reviews[i].text;
// }
