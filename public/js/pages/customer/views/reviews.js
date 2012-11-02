/*global define */

define(['backbone', 'tmpl!pages/customer/templates/reviews'], function(
Backbone, reviewsTmpl) {
    return Backbone.View.extend({

        initialize: function() {},

        events: {
            "click .stars":"clickReview",
            "click .show-btn":"showBtn"

        },

        render: function() {
           this.$el.html(reviewsTmpl({
                msg:"This item hasn't yet been reviewed"
            }));


            return this;
        },


        clickedItem: function(id) {
            var that = this;
            // someone clicked on item with id: id
            $.get('/reviews/' + id, function (data) {
                //data is that array
                if (data.length !== 0) {
                    // set myObj
                    var ratingCount = [];
                    for (var i=0;i<5;++i){
                        ratingCount[i]={
                            number: data[i].reviews.length,
                            ratings: i+1
                        };
                    }
                    var ratingsText = [];
                    for (var i=0; i<data.length; ++i){
                        for (var j=0; j< data[i].reviews.length;++j)
                            ratingsText.push({
                                ratings: i+1,
                                name: data[i].reviews[j].name,
                                text: data[i].reviews[j].text
                            });
                    }
                    that.$el.html(reviewsTmpl({
                        starReviews: ratingCount,
                        reviews: ratingsText
                    }));
                    return;
                }
            });

            this.$el.html(reviewsTmpl({
                msg: "This item hasn't yet been reviewed."
            }));
        },
        clickReview: function(e){
            this.$(".show-btn").show();
            this.$(".selected-rating").removeClass("selected-rating");
            var el = $(e.target).closest('.stars');
            el.addClass("selected-rating");
            var ratingNum = parseInt(el.attr("id"), 10);
            this.$(".individual-review").hide();
            this.$("."+ratingNum+"-rating").show();
            console.log(ratingsArr);
        },
        showBtn:function(e){
            this.$(".show-btn").hide();
            this.$(".selected-rating").removeClass("selected-rating");
            this.$(".individual-review").show();
        }
    });
});
