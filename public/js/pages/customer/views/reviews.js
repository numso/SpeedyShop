/*global define */

define([
    'backbone',
    'tmpl!pages/customer/templates/reviewsTemplates/addReviews',
    'tmpl!pages/customer/templates/reviewsTemplates/showReviews'
], function (
    Backbone,
    addReviewsTmpl,
    showReviewsTmpl

) {
    return Backbone.View.extend({

        curReviews: undefined,

        initialize: function() {},

        events: {
            "click .stars":"clickReview",
            "click .show-btn":"showBtn",
            "click .add-review": "addReview",
            "click .submit-review":"submitReview",
            "click .cancel-review":"cancelReview"

        },

        render: function() {
           this.$el.html(showReviewsTmpl({
                msg:"This item hasn't yet been reviewed"
            }));
            return this;
        },


        clickedItem: function(id) {
            var that = this;
            // someone clicked on item with id: id
            $.get('/reviews/' + id, function (data) {
                //now curReviews has gotten data
                that.curReviews=data;
                that.renderHtml(data);
            });

            this.$el.html(showReviewsTmpl({
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
        },

        showBtn:function(e){
            this.$(".show-btn").hide();
            this.$(".selected-rating").removeClass("selected-rating");
            this.$(".individual-review").show();
        },

        addReview:function(e){
            var starObj = {
                starReviews:[1,2,3,4,5]
            }
            this.$el.html(addReviewsTmpl(starObj));
        },

        submitReview: function(e){
            //This needs the Post Function to post the review to the server
            this.$el.html(showReviewsTmpl(this.curReviews));
            this.renderHtml(this.curReviews);
        },

        cancelReview:function(e){
            this.$el.html(showReviewsTmpl(this.curReviews));
            this.renderHtml(this.curReviews);
        },

        renderHtml:function(data){
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
                this.$el.html(showReviewsTmpl({
                    starReviews: ratingCount,
                    reviews: ratingsText
                }));
                return;
            }
        }


    });
});
