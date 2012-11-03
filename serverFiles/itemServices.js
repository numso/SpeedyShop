/*jshint node:true*/

module.exports = function () {

    var fs = require('fs');

    return {
        incrementPopularity: function (request, response, next) {

            var id = parseInt(request.params.itemNumber, 10);
            var items = JSON.parse(fs.readFileSync("serverData/items.json"));

            for (var i = 0; i < items.length; ++i) {
                if (items[i].id == id) {
                    items[i].popularity++;
                    break;
                }
            }

            fs.writeFileSync("serverData/items.json", JSON.stringify(items));
            response.send("OK");
        },

        getItems: function (request, response, next) {
            var category = request.params.catID || "All";

            var items = JSON.parse(fs.readFileSync("serverData/items.json"));
            var myObj = [];

            if (category === "Hot Items")
            { //get top 30 most viewed items

                items.sort(function(a, b){
                    if (a.popularity === b.popularity)
                        return 0;
                    else if (a.popularity > b.popularity)
                        return -1;
                    else
                        return 1;
                });

                for (var i = 0; i < 15; ++i)
                    if (items[i].popularity !== 0)
                        myObj.push(items[i]);
            }
            else if (category !== "All") {
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
            var items = JSON.parse(fs.readFileSync("serverData/cat.json"));

            response.writeHead(200, { "Content-Type": "application/json" });
            response.end(JSON.stringify(items));
        },

        getItem: function (request, response, next) {
            var id = request.params.id;

            var items = JSON.parse(fs.readFileSync("serverData/items.json"));
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
