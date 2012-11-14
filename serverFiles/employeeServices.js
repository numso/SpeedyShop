/*jshint node:true*/

module.exports = function () {

    var fs = require('fs'),
        orders = JSON.parse(fs.readFileSync('serverData/orders.json')),
        giveMeTheItems = JSON.parse(fs.readFileSync('serverData/items.json'));

    return {
        getOrders: function (request, response, next) {
            response.send(orders);
        },

        getItems: function(request, response, next) {
            response.send(giveMeTheItems);
        },

        updateThisOrder: function(request, response, next) {
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
            var orderData = '';
            request.on('data', function (chunk) {
                orderData += chunk;
            });

            request.on('end', function () {
                console.log("server got new order!");
                var orderObj = {
                    orderStatus: "Completed",
                    orderNum: orders[orders.length - 1].orderNum + 1,
                    estimatedWeight: Math.floor(Math.random() * 100 + 1) / 10,
                    addresses: orderData.addresses, //new
                    items: orderData.items
                }
                console.log("Server adding in order!");
                orders.push(orderObj);
                fs.writeFileSync('serverData/order.json', JSON.stringify(orders));
                response.send(orders);
            });
        }
    };
};