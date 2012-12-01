/*global define */

define([
    'backbone',
    'tmpl!pages/admin/templates/promocode'
], function (
    Backbone,
    promocodeTmpl
) {
    return Backbone.View.extend({

        thisPromo: undefined,

        initialize: function () {
            
        },
        
        events: {
            "click #now-btn": "setNow",
            "click #never-btn": "setNever",
            "click #save-btn": "savePromo"
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
            this.thisPromo = data;
            this.$el.html(promocodeTmpl(data));

        },

        savePromo: function(){
            var thisNow = false;
            var thisNever = false;
            var thisStack = false;

            if(this.$('.now-btn').is(':checked'))
                thisNow = true;
            if(this.$('.never-btn').is(':checked'))
                thisNever = true;
            if(this.$('.stack-check').is(':checked'))
                thisStack = true;

            var newPromo = {
            product: this.$('.cat-sel').val(),
            detail : this.$('.name-input').val(),
            code : this.$('.code-input').val(),
            amount : this.$('.amount').val(),
            percent : this.$('.percent').val(),
            start : this.$('.start-date-txt').val(),
            now : thisNow,
            end : this.$('.end-date-txt').val(),
            neverend : thisNever,
            stackable : thisStack
            }

            this.model.addPromo(newPromo);

        }

    });
});