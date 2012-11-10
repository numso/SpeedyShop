module.exports = function () {

    var sales = JSON.parse(require('fs').readFileSync('serverData/test.json'));

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
            var codes = fs.readFileSync('../serverData/promocodes.json');
            response.send(codes);
        }
    };
};
