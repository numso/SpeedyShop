
var addIDs = function () {
    var fs = require('fs'),
        items = JSON.parse(fs.readFileSync('../serverData/items.json'));

    for (var i = 0; i < items.length; ++i) {
        items[i].id = i;
    }

    fs.writeFileSync('../serverData/newItems.json', JSON.stringify(items));
};

var updateImages = function () {
    var fs = require('fs'),
        items = JSON.parse(fs.readFileSync('../serverData/newItems.json'));

    for (var i = 0; i < items.length; ++i) {
        items[i].extraimages[0] = items[i].images;
        items[i].images = items[i].extraimages;
        items[i].extraimages = undefined;
        items[i].available = 5;
    }

    fs.writeFileSync('../serverData/items.json', JSON.stringify(items));
};


// just call the desired function right here :)
//addIDs();
updateImages();