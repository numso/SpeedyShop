/*jshint node:true*/

module.exports = function () {

    var fs = require('fs'),
        orders = JSON.parse(fs.readFileSync('serverData/orders.json'));

    return {
        getOrders: function (request, response, next) {
            response.send(orders);
        }
    };
};