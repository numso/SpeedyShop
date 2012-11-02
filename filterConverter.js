var fs = require('fs'),
    filters = JSON.parse(fs.readFileSync('serverData/filter.json'));

var newObj = {};
for (var i = 0; i < filters.length; ++i) {

    var newFilters = [];
    for (var j = 0; j < filters[i].filters.length; ++j) {
        var filterObj = {}
        filterObj.name = filters[i].filters[j].name;
        filterObj[filters[i].filters[j].type] = filters[i].filters[j].values;
        newFilters.push(filterObj);
    }

    newObj[filters[i].name] = {
        id: filters[i].id,
        filters: newFilters
    };
}

fs.writeFileSync('serverData/newFilter.json', JSON.stringify(newObj));
