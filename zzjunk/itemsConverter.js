
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
        items = JSON.parse(fs.readFileSync('../serverData/items.json'));

    for (var i = 0; i < items.length; ++i) {
        items[i].extraimages[0] = items[i].images;
        items[i].images = items[i].extraimages;
        items[i].extraimages = undefined;
        items[i].available = 5;
    }

    fs.writeFileSync('../serverData/newItems.json', JSON.stringify(items));
};

var addMore = function () { //I wrote this! Ha! :)  -Jesse
    var fs = require('fs');
    var allItems = "";
    for (var i = 24; i < 24 + 70; ++i)
    {
        var item = [
            '   {',
            '       "name": "Item '+i+'",',
            '       "cat": [',
            '           "Sports",',
            '           "Posters"',
            '       ],',
            '       "price": 1234,',
            '       "rating": 5,',
            '       "desc": "Awesome item '+i+'",',
            '       "images": [',
            '           "//www.bmotorsports.com/shop/images/product-unavailable.jpg",',
            '           "//www.bmotorsports.com/shop/images/product-unavailable.jpg",',
            '           "//www.bmotorsports.com/shop/images/product-unavailable.jpg",',
            '           "//www.bmotorsports.com/shop/images/product-unavailable.jpg"',
            '       ],',
            '       "id": '+i+',',
            '       "available": 5',
            '   },',
            ''].join('\n');

        allItems = allItems + item;
    }

    fs.writeFileSync('../serverData/newItems.json', allItems);
};


// just call the desired function right here :)
//addIDs();
addMore();