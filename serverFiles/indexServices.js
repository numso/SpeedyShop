/*jshint node:true*/

module.exports = function () {

    var fs = require('fs');

    return {
        getItems: function (request, response, next) {
            var category = request.params.catID || "All";

            var items = JSON.parse(fs.readFileSync("serverData/items.json"));
            var myObj = [];

            if (category !== "All") {
                for (var i = 0; i < items.length; ++i) {
                    if (items[i].cat === category) {
                        myObj.push(items[i]);
                    }
                }
            } else {
                myObj = items;
            }

            response.writeHead(200, { "Content-Type": "application/json" });
            response.end(JSON.stringify(myObj));
        }
    };
};
