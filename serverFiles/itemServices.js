/*jshint node:true*/

module.exports = function () {

    var fs = require('fs');

    return {
        getItems: function (request, response, next) {
            var category = request.params.catID || "All";

            var items = JSON.parse(fs.readFileSync("serverData/newItems.json"));
            var myObj = [];

            if (category !== "All") {
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

            var items = JSON.parse(fs.readFileSync("serverData/newItems.json"));
            for (var i = 0; i < items.length; ++i) {
                if (items[i].id === id) {
                    response.send({
                        status: "success",
                        item: {
                            imgURL: item[i].img,
                            name: item[i].name,
                            price: item[i].price
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
