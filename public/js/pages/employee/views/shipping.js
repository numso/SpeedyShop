/*global define */

define([
    'backbone',
    'tmpl!pages/employee/templates/shipping'
], function (
    Backbone,
    shippingTmpl
) {
    return Backbone.View.extend({
        pickedOrder: undefined,

        initialize: function () {
        },

        events: {
            'click .completed-btn': 'processOrder',
            'click .print-shipping-label': 'printLabel'
        },

        render: function () {
            this.$el.html(shippingTmpl({
                msg: "Click on an order to load it."
            }));

            var that = this;
            return this;
        },

        printLabel: function (e) {
            window.print();
        },

        showLabel: function () {
            var o = this.pickedOrder;
            var oa = o.address;

            var data = {
                name: oa.firstName + " " + oa.lastName,
                address: oa.street1 + oa.street2 + ", " + oa.city + ", " + oa.state  + ", " + oa.zip,
                'order#': o.orderNum,
                weight: o.estimatedWeight
            };

            this.$('.ship-lbl-name').find('span').html(data.name);
            this.$('.ship-lbl-addr').find('span').html(data.address);
            this.$('.ship-lbl-order-num').find('span').html(data['order#']);
            this.$('.ship-lbl-weight').find('span').html(data.weight);

            var newData = '';
            for (var i in data) {
                newData += i + ":" + data[i] + '\n'
            }
            this.drawQRCode('shipping-qr', newData);
        },

        gotOrder: function (data) {
            this.pickedOrder = data;
            this.$el.html(shippingTmpl(data));
            this.showLabel();

            if (this.pickedOrder.orderStatus === "Completed") {
                this.$('.completed-btn').hide();
            }
        },

        processOrder: function () {
            if(this.isValid()) {
                this.pickedOrder.orderStatus = "Completed";

                var decrements = [];
                for (var i = 0; i < this.pickedOrder.items.length; ++i) {
                    decrements.push({
                        id: this.pickedOrder.items[i].itemID,
                        qty: this.pickedOrder.items[i].quantity
                    });
                }

                $.post('/updateAvailability', JSON.stringify(decrements));
                $.post('/processOrder/' + this.pickedOrder.orderNum, '');

                this.$('.shipping-order-status').html('Order Status: Completed');
                this.$('.completed-btn').hide();

                var menuEl = $('#' + this.pickedOrder.orderNum + '-order');
                menuEl.removeClass('Processed-item');
                menuEl.addClass('Completed-item');
                menuEl.hide();

                this.$('.error-msg').css('display', 'none');
                this.$('.submitted-msg').css('display', 'inline');
            } else {
                this.$('.error-msg').css('display', 'inline');
                this.$('.submitted-msg').css('display', 'none');
            }
        },

        isValid: function () {
            var flag = true;
            this.$('.item-check').each(function (index){
                var thisValue = $(this).is(':checked');
                if(!thisValue)
                    flag = false;
           });
            return flag;
        },

        drawQRCode: function (id, data) {
            var qrcodedraw = new QRCodeLib.QRCodeDraw();
            qrcodedraw.draw(document.getElementById(id), data, function (error, canvas) {
                if (error) {
                    return console.log('ERROR: ' + error);
                }
            });
        }
    });
});
