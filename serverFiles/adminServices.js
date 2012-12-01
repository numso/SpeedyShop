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
                    var quantityA = 0,
                        quantityP = 0,
                        grossA = 0,
                        grossP = 0,
                        netA = 0,
                        netP = 0;

                    for (var j = 0; j < sales[i].items.length; ++j) {
                        quantityA += sales[i].items[j].quantityA;
                        quantityP += sales[i].items[j].quantityP;
                        grossA += sales[i].items[j].grossA;
                        grossP += sales[i].items[j].grossP;
                        netA += sales[i].items[j].netA;
                        netP += sales[i].items[j].netP;
                    }

                    if (newArr[newDate.getMonth()]) {
                        newArr[newDate.getMonth()].quantityA += quantityA;
                        newArr[newDate.getMonth()].quantityP += quantityP;
                        newArr[newDate.getMonth()].grossA += grossA;
                        newArr[newDate.getMonth()].grossP += grossP;
                        newArr[newDate.getMonth()].netA += netA;
                        newArr[newDate.getMonth()].netP += netP;
                    } else {
                        newArr[newDate.getMonth()] = {
                            quantityA: quantityA,
                            quantityP: quantityP,
                            grossP: grossP,
                            grossA: grossA,
                            netA: netA,
                            netP: netP
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
                    var quantityA = 0,
                        quantityP = 0,
                        grossA = 0,
                        grossP = 0,
                        netA = 0,
                        netP = 0;

                    for (var j = 0; j < sales[i].items.length; ++j) {
                        quantityA += sales[i].items[j].quantityA;
                        quantityP += sales[i].items[j].quantityP;
                        grossA += sales[i].items[j].grossA;
                        grossP += sales[i].items[j].grossP;
                        netA += sales[i].items[j].netA;
                        netP += sales[i].items[j].netP;
                    }

                    newArr[newDate.getDate()] = {
                        quantityA: quantityA,
                        quantityP: quantityP,
                        grossP: grossP,
                        grossA: grossA,
                        netA: netA,
                        netP: netP
                    };
                }
            }

            response.send(newArr);
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
        },

        getStateTaxes: function (request, response, next) {
            var taxes = app.shopData.stateTaxes;
            response.send(taxes);
        }
    };
};
