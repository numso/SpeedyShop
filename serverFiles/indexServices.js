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
            // var myCats = [];

            // for (var i = 0; i < items.length; ++i) {
            //     var testCat = items[i].cat;

            //     var isThere = false;
            //     for (var j = 0; j < myCats.length; ++j) {
            //         if (myCats[j] === testCat) {
            //             isThere = true;
            //         }
            //     }

            //     if (!isThere) {
            //         myCats.push(testCat);
            //     }
            // }

            // myCats.unshift("All");

            response.writeHead(200, { "Content-Type": "application/json" });
            response.end(JSON.stringify(items));
        }
    };
};
