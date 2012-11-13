var NUMITEMS = 240,
    STARTDATE = new Date(1325401200000);

var newArr = [],
    curDate = STARTDATE,
    endDate = new Date();

endDate.setHours(0, 0, 0, 0);

for (; curDate <= endDate; curDate.setDate(curDate.getDate() + 1)) {
    var newObj = {
        timestamp: curDate.getTime(),
        items: []
    };

    for (var i = 0; i < NUMITEMS; ++i) {
        var proj = Math.floor(Math.random() * 4) - 2;
        if (proj < 0) proj = 0;
        var act = Math.floor(Math.random() * 4) - 2;
        if (act < 0) act = 0;

        newObj.items.push({
            id: i,
            projected: proj,
            actual: act
        });
    }

    newArr.push(newObj);
}

require('fs').writeFileSync('../serverData/test.json', JSON.stringify(newArr));
