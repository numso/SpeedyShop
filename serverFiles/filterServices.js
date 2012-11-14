/*jshint node: true*/

module.exports = function (app) {

    var fs = require('fs');

    return {
        getFilters: function (request, response, next) {
            var filters = app.shopData.filter;

            var data = '';
            request.on('data', function (chunk) {
                data += chunk;
            });

            request.on('end', function () {
                data = JSON.parse(data);

                var cat = data.cat,
                    subcat = data.subcat,
                    selectedFilters = [];

                if (filters[cat]) {
                    for (var j = 0; j < filters[cat].filters.length; ++j) {
                        selectedFilters.push(filters[cat].filters[j]);
                    }
                }

                if (filters[subcat]) {
                    for (var j = 0; j < filters[subcat].filters.length; ++j) {
                        selectedFilters.push(filters[subcat].filters[j]);
                    }
                }

                response.send(selectedFilters);
            });
        }
    };
};
