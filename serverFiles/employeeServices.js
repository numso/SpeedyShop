/*jshint node:true*/

module.exports = function (app, smtpTransport, orderEmailFn) {

    var fs = require('fs');

    return {
        getOrders: function (request, response, next) {
            var orders = app.shopData.orders;
            response.send(orders);
        },

        processOrder: function(request, response, next) {
            var orders = app.shopData.orders;
            var orderNum = request.params.orderNum;

            for (var n = 0; n < orders.length; ++n) {
                if (orders[n].orderNum == orderNum) {
                    orders[n].orderStatus = 'Completed';
                    fs.writeFileSync('serverData/orders.json', JSON.stringify(orders));
                    response.send('OK');
                    break;
                }
            }

            response.send('error');
        },

        updateAvailability: function (request, response, next) {
            var items = app.shopData.items;

            var input = '';
            request.on('data', function (chunk) {
                input += chunk;
            });

            request.on('end', function () {
                input = JSON.parse(input);
                for (var i = 0; i < input.length; ++i) {
                    var item = input[i],
                        isFound = false;
                    for (var j = 0; j < items.length && !isFound; ++j) {
                        if (items[j].id == item.id) {
                            items[j].available -= item.qty;
                            isFound = true;
                        }
                    }
                }

                fs.writeFileSync('serverData/items.json', JSON.stringify(items));
                response.send('ok');
            });
        },

        submitOrder: function (request, response, next) {
            var orders = app.shopData.orders;

            var orderData = '';
            request.on('data', function (chunk) {
                orderData += chunk;
            });

            request.on('end', function () {
                orderData = JSON.parse(orderData);

                var orderObj = {
                    orderStatus: "Processed",
                    orderNum: Math.floor(Math.random() * 10000000000),
                    estimatedWeight: Math.floor(Math.random() * 100 + 1) / 10,
                    items: orderData.items,
                    address: orderData.address,
                    notes: orderData.notes
                };

                orders.push(orderObj);
                fs.writeFileSync('serverData/orders.json', JSON.stringify(orders));

                var mailOptions = {
                    from: "Speedy Shop <speedyshopsales@gmail.com>", // sender address
                    to: orderData.email, // list of receivers
                    subject: "Thank you for your purchase!", // Subject line
                    text: orderData.name + ", Thank you for your Purchase! We will do our best to ensure a reliable and fast delivery. Your order number is " + orderObj.orderNum + ". Sincerely, The Speedy Shop Team", // plaintext body
                    html: orderEmailFn({ name: orderData.name, orderNum: orderObj.orderNum }) // html body
                };

                // send mail with defined transport object
                smtpTransport.sendMail(mailOptions, function (err, response) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Message sent: " + response.message);
                    }
                });

                response.send({
                    status: "OK"
                });
            });
        }
    };
};
