/*jshint node:true*/

module.exports = function () {

    var fs = require('fs'),
        filters = JSON.parse(fs.readFileSync('serverData/filter.json'));

    return {
        getFilters: function (request, response, next) {

            var data = '';
            request.on('data', function (chunk) {
                data += chunk;
            });

            request.on('end', function () {
                data = JSON.parse(data);

                var cat = data.cat,
                    subcat = data.subcat,
                    selectedFilters = [];

                for (var i = 0; i < filters.length; ++i) {
                    if (filters[i].name === cat || filters[i].name === subcat) {
                        for (var j = 0; j < filters[i].filters.length; ++j) {
                            selectedFilters.push(filters[i].filters[j]);
                        }
                    }
                }

                response.send(selectedFilters);
            });
        }
    };
};
