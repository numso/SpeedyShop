var fs = require('fs'),
    STARTDATE = new Date(1325401200000),
    newArr = [],
    curDate = STARTDATE,
    endDate = new Date(),
    items = JSON.parse(fs.readFileSync('../serverData/items.json')),
    itemsArr = [];

for (var j = 0; j < items.length; ++j) {
    itemsArr.push(items[j].id);
}

endDate.setHours(0, 0, 0, 0);

for (; curDate <= endDate; curDate.setDate(curDate.getDate() + 1)) {
    var newObj = {
        timestamp: curDate.getTime(),
        items: []
    };

    for (var i = 0; i < itemsArr.length; ++i) {
        var proj = Math.floor(Math.random() * 4) - 2;
        if (proj < 0) proj = 0;
        var act = Math.floor(Math.random() * 4) - 2;
        if (act < 0) act = 0;
        var proj2 = Math.floor(Math.random() * 4) - 2;
        if (proj2 < 0) proj2 = 0;
        var act2 = Math.floor(Math.random() * 4) - 2;
        if (act2 < 0) act2 = 0;
        var proj3 = Math.floor(Math.random() * 4) - 2;
        if (proj3 < 0) proj3 = 0;
        var act3 = Math.floor(Math.random() * 4) - 2;
        if (act3 < 0) act3 = 0;

        newObj.items.push({
            id: itemsArr[i],
            quantityP: proj,
            quantityA: act,
            grossP: proj2,
            grossA: act2,
            netP: proj3,
            netA: act3
        });
    }

    newArr.push(newObj);
}

fs.writeFileSync('../serverData/test.json', JSON.stringify(newArr));
