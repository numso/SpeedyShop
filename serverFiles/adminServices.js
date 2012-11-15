module.exports = function (app) {

    var fs = require('fs');

    return {
        getSalesByYear: function (request, response, next) {
            var year = request.params.yearID,
                sales = app.shopData.analytics,
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
                sales = app.shopData.analytics,
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

        tempChartCall: function (request, response, next) {
            var year = 2012,
                sales = app.shopData.analytics,
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
                            actualGross: actual,
                            projectedGross: projected,
                            actualNet: actual,
                            projectedNet: projected,
                            actualQuantity: actual,
                            projectedQuantity: projected
                        };
                    }
                }
            }

            var returnVal = [];

            var cats = app.shopData.cat;
            for (var j = 0; j < cats.length; ++j) {
                if (cats[j].title !== "Hot Items") {
                    returnVal.push({
                        cat: cats[j].title,
                        data: newArr
                    });
                }
            }
            response.send(returnVal);
        },

        getPromoCodes: function (request, response, next) {

            var codes = JSON.stringify(app.shopData.promoCodes);
            response.send(codes);
        },

        updateInventory: function (request, response, next) {
            var items = app.shopData.items;

            var input = '';
            request.on('data', function (chunk) {
                input += chunk;
            });

            request.on('end', function () {
                input = JSON.parse(input);

                for (var i = 0; i < input.length; ++i) {
                    var found = false;
                    for (var j = 0; j < items.length && !found; ++j) {
                        if (items[j].id == input[i].id) {
                            items[j].available = input[i].val;
                            found = true;
                        }
                    }
                }
                fs.writeFileSync('serverData/items.json', JSON.stringify(items));
                response.send('ok');
            });
        },

        changeRating: function (request, response, next) {
            var items = app.shopData.items;

            var input = '';
            request.on('data', function (chunk) {
                input += chunk;
            });

            request.on('end', function () {
                input = JSON.parse(input);

                for (var i = 0; i < items.length; ++i) {
                    if (items[i].id == input.id) {
                        items[i].rating = input.rating;
                        fs.writeFileSync('serverData/items.json', JSON.stringify(items));
                        response.send('ok');
                        return;
                    }
                }
                response.send('error');
            });
        }
    };
};
