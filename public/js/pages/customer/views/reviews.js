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
        unsubmittedReview: {
            stars: 5,
            name: "",
            text: ""
        },
        itemID: 0,

        initialize: function() {},

        events: {
            "click .stars":"clickReview",
            "click .show-btn":"showBtn",
            "click .add-review": "addReview",
            "click .submit-review":"submitReview",
            "click .cancel-review":"cancelReview"
        },

        //I don't think this function is ever called. -Jesse V.
        /*
        render: function() {
           this.$el.html(showReviewsTmpl({
                msg:"This item hasn't yet been reviewed"
            }));
            return this;
        },*/

        clickedItem: function(id) {
            var that = this;
            this.itemID = id;
            // someone clicked on item with id: id
            $.get('/reviews/' + id, function (data) {
                //now curReviews has gotten data
                that.curReviews = data;
                that.renderHtml(data);
            });

            this.$el.html(showReviewsTmpl({
                msg: "This item hasn't yet been reviewed."
            }));
        },

        clickReview: function(e) {
            this.$(".show-btn").show();
            this.$(".selected-rating").removeClass("selected-rating");
            var el = $(e.target).closest('.stars');
            el.addClass("selected-rating");
            var ratingNum = parseInt(el.attr("id"), 10);
            this.$(".individual-review").hide();
            this.$("."+ratingNum+"-rating").show();
        },

        showBtn: function(e) {
            this.$(".show-btn").hide();
            this.$(".selected-rating").removeClass("selected-rating");
            this.$(".individual-review").show();
        },

        addReview: function(e) {
            var starObj = {
                starReviews: [1, 2, 3, 4, 5],
                nameGiven: this.unsubmittedReview.name,
                textGiven: this.unsubmittedReview.text,
            }

            this.$el.html(addReviewsTmpl(starObj));
            this.$("#" + this.unsubmittedReview.stars + "-select").addClass("selected-rating")
        },

        updateReview: function() {
            var t = this.$('.textAreaText').attr("value");
            var n = this.$(".input-name").attr("value");
            var s = parseInt(this.$(".selected-rating").attr("id"),10);

            this.unsubmittedReview.stars = s;
            this.unsubmittedReview.name = n;
            this.unsubmittedReview.text = t;
        },

        submitReview: function(e) {
            var that=this;
            this.updateReview();
            $.post("/createReview/" + this.itemID, JSON.stringify(this.unsubmittedReview), function (data){
                that.curReviews=data;
                that.unsubmittedReview = {
                    stars: 5,
                    name: "",
                    text: ""
                }
                that.renderHtml(that.curReviews);
            });
            that.renderHtml(that.curReviews);
        },

        cancelReview: function(e) {
            //this.updateReview();
            this.renderHtml(this.curReviews);
        },

        renderHtml: function(data) {
            if (data.length === 0) {
                this.$el.html(showReviewsTmpl({
                    msg: "This item hasn't yet been reviewed."
                }));
            }
            else {
                    // set myObj
                var ratingCount = [];
                for (var i = 0; i < 5; ++i) {
                    ratingCount[i] = {
                        number: data[i].reviews.length,
                        ratings: i + 1
                    };
                }

                var ratingsText = [];
                for (var i = 0; i < data.length; ++i) {
                    for (var j = 0; j < data[i].reviews.length; ++j)
                        ratingsText.push({
                            ratings: i + 1,
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
