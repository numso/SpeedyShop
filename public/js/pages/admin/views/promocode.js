/*global define */

define([
    'backbone',
    'tmpl!pages/admin/templates/promocode'
], function (
    Backbone,
    promocodeTmpl
) {
    return Backbone.View.extend({

        initialize: function () {
            
        },
        
        events: {
            "click #now-btn": "setNow",
            "clicl #never-btn": "setNever",
        },

        render: function () {
            this.$el.html(promocodeTmpl({
                msg: "Click on an order to load it."
            }));
            return this;
        },

        setNow: function(){
            // if now is checked
            this.$('#start-date-txt').attr("disabled"); //disable start date textbox
        },

        setNever: function(){
            // if never is checked
            this.$('#end-date-txt').attr("disabled"); //disable end date textbox
        },

        showThisPromo: function(data){
            console.log(data);
            this.$el.html(promocodeTmpl(data));

        }

    });
});