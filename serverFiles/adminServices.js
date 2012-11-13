module.exports = function () {


    var fs = require('fs'),
        sales = JSON.parse(fs.readFileSync('serverData/test.json'));

    return {
        getSalesByYear: function (request, response, next) {
            var year = request.params.yearID,
                newArr = [];

            for (var i = 0; i < sales.length; ++i) {
                var newDate = new Date(sales[i].timestamp);
                if (newDate.getFullYear() == year) {
                    var actual = 0,
                        projected = 0;
                    for (var j = 0; j < sales[i].items.length; ++j) {
                        actual += sales[i].items[j].actual;
                        projected += sales[i].items[j].projected;
                    }

                    if (newArr[newDate.getMonth()]) {
                        newArr[newDate.getMonth()].actual += actual;
                        newArr[newDate.getMonth()].projected += projected;
                    } else {
                        newArr[newDate.getMonth()] = {
                            actual: actual,
                            projected: projected
                        };
                    }
                }
            }

            response.send(newArr);
        },

        getSalesByYearMonth: function (request, response, next) {
            var year = request.params.yearID,
                month = request.params.monthID,
                newArr = [];

            for (var i = 0; i < sales.length; ++i) {
                var newDate = new Date(sales[i].timestamp);
                if (newDate.getMonth() == month && newDate.getFullYear() == year) {
                    var actual = 0,
                        projected = 0;
                    for (var j = 0; j < sales[i].items.length; ++j) {
                        actual += sales[i].items[j].actual;
                        projected += sales[i].items[j].projected;
                    }

                    newArr[newDate.getDate()] = {
                        actual: actual,
                        projected: projected
                    };
                }
            }

            response.send(newArr);
        },

        getPromoCodes: function (request, response, next) {

            var codes = fs.readFileSync('serverData/promoCodes.json');
            response.send(codes);
        },

        getInventory: function(request, response, next) {
            var inventory = fs.readFileSync('serverData/items.json');
            response.send(inventory);
        },

        editInventory: function(request, response, next) {
             var input = '';
            request.on('data', function (chunk) {
                input += chunk;
            });

            request.on('end', function () {
            input = JSON.parse(input);

            fs.writeFileSync('serverData/items.json', JSON.stringify(input));
            });


        }

    };
};
