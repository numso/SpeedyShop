/*global define */

define([
    'backbone',
    'tmpl!pages/admin/templates/stateTaxes'
], function (
    Backbone,
    inventoryTmpl
) {
    return Backbone.View.extend({
        curInventory : undefined,

        initialize: function () {
        },

        events: {
            'click .update-items': 'updateQuantity',
            'blur .update-stock': 'checkForChange'
        },

        checkForChange: function (e) {
            var el = $(e.target).closest('.update-stock'),
                val = parseInt(el.val(), 10),
                orig = parseInt(el.closest('.item-box').find('.item-stock').text(), 10);

            if (!isNaN(val) && val !== orig) {
                el.closest('.item-box').css('background-color', 'orange');
            } else {
                el.closest('.item-box').css('background-color', '');
            }
        },

        updateQuantity: function (e) {
            var items = this.$('.update-stock');

            var toUpdate = [];
            for (var i = 0; i < items.length; ++i) {
                var item = $(items[i]),
                    val = parseInt(item.val(), 10);
                if (!isNaN(val)) {
                    var myBox = item.closest('.item-box');
                    var orig = parseInt(myBox.find('.item-stock').text(), 10);
                    if (orig !== val) {
                        toUpdate.push({
                            id: parseInt(myBox.find('.item-id').text(), 10),
                            val: val
                        });

                        myBox.find('.item-stock').text(val);
                    }
                }
            }

            if (toUpdate.length > 0) {
                $.post('/updateInventory', JSON.stringify(toUpdate), function () {
                    $('.submitted-change').show();
                });
            }

            this.checkLowInventory();
            items.val('');
        },

        checkLowInventory: function () {
            this.$('.item-box').css({
                color: '',
                'background-color': ''
            });

            this.$('.item-stock').each(function (index) {
                var thisValue = parseInt($(this).html());
                if (thisValue < 5) {
                    $(this).parent().css('color', 'red');
                }
            });
        },

        render: function () {
            var that = this;
            $.get('/getItems', function (data) {
                that.curInventory = data;
                that.$el.html(inventoryTmpl(that.curInventory));
                that.checkLowInventory();
            });

            return this;
        }
    });
});