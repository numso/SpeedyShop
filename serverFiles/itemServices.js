/*jshint node:true*/

module.exports = function () {

    var fs = require('fs'),
        items = JSON.parse(fs.readFileSync("serverData/items.json")),
        categories = JSON.parse(fs.readFileSync("serverData/cat.json"));

    return {
        search: function (request, response, next) {
            var data = '';

            request.on('data', function (chunk) {
                data += chunk;
            });

            request.on('end', function () {
                data = JSON.parse(data);

                var itemsArr = [];
                for (var i = 0; i < items.length; ++i) {
                    if (items[i].name.toLowerCase().indexOf(data.searchString.toLowerCase()) !== -1 || items[i].desc.toLowerCase().indexOf(data.searchString.toLowerCase()) !== -1) {
                        itemsArr.push(items[i]);
                    }
                }

            response.writeHead(200, { "Content-Type": "application/json" });
            response.end(JSON.stringify(itemsArr));
            });
        },

        incrementPopularity: function (request, response, next) {
            var id = parseInt(request.params.itemNumber, 10);

            for (var i = 0; i < items.length; ++i) {
                if (items[i].id == id) {
                    ++items[i].popularity;
                    break;
                }
            }

            response.send("OK");
        },

        getItems: function (request, response, next) {
            var category = request.params.catID || "All",
                myObj = [];

            if (category === "Hot Items") { //get top 15 most viewed items
                items.sort(function (a, b) {
                    if (a.popularity === b.popularity) {
                        return 0;
                    } else if (a.popularity > b.popularity) {
                        return -1;
                    } else {
                        return 1;
                    }
                });

                for (var i = 0; i < 15; ++i) {
                    if (items[i].popularity !== 0) {
                        myObj.push(items[i]);
                    }
                }
            } else if (category !== "All") {
                for (var i = 0; i < items.length; ++i) {
                    for (var j = 0; j < items[i].cat.length; ++j) {
                        if (items[i].cat[j] === category) {
                            myObj.push(items[i]);
                        }
                    }
                }
            } else {
                myObj = items;
            }

            response.writeHead(200, { "Content-Type": "application/json" });
            response.end(JSON.stringify(myObj));
        },

        getCategories: function (request, response, next) {
            response.writeHead(200, { "Content-Type": "application/json" });
            response.end(JSON.stringify(categories));
        },

        getItem: function (request, response, next) {
            var id = request.params.id;

            for (var i = 0; i < items.length; ++i) {
                if (items[i].id == id) {
                    response.send({
                        status: "success",
                        item: {
                            imgURL: items[i].images[0],
                            name: items[i].name,
                            price: items[i].price
                        }
                    });
                    return;
                }
            }

            response.send({
                status: "error",
                code: "not found"
            });
        }
    };
};
