var fs = require('fs'),
    items = JSON.parse(fs.readFileSync('../serverData/items.json'));

for (var i = 0; i < items.length; ++i) {
    items[i].id = i;
}

fs.writeFileSync('../serverData/newItems.json', JSON.stringify(items));
