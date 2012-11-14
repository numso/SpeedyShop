/*jshint node:true*/

module.exports = function (app) {

    var fs = require('fs');

    return {
        getOrders: function (request, response, next) {
            var orders = app.shopData.orders;
            response.send(orders);
        },

        updateThisOrder: function(request, response, next) {
            var orders = app.shopData.orders;

            var input = '';
            request.on('data', function (chunk) {
                input += chunk;
            });

            request.on('end', function () {
                input = JSON.parse(input);

                for (var n = 0; n < orders.length; ++n)
                    if (orders[n].orderNum == input.orderNum)
                        orders[n].orderStatus = input.orderStatus;

                fs.writeFileSync('serverData/orders.json', JSON.stringify(orders));
            });
        },

        updateQuantity: function(request, response, next) {
            var input = '';
            request.on('data', function (chunk) {
                input += chunk;
            });

            request.on('end', function () {
                fs.writeFileSync('serverData/items.json', input);
            });
        },

        submitOrder: function(request, response, next) {
            var orders = app.shopData.orders;

            var orderData = '';
            request.on('data', function (chunk) {
                orderData += chunk;
            });

            request.on('end', function () {
                orderData = JSON.parse(orderData);

                var orderObj = {
                    orderStatus: "Completed",
                    orderNum: orders[orders.length - 1].orderNum + 1,
                    estimatedWeight: Math.floor(Math.random() * 100 + 1) / 10,
                    items: orderData.items,
                    address: orderData.address,
                    notes: orderData.notes
                }

                orders.push(orderObj);
                fs.writeFileSync('serverData/orders.json', JSON.stringify(orders));

                response.send({
                    status: "OK"
                });
            });
        }
    };
};
