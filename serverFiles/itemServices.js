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

                response.send(itemsArr);
            });
        },

        incrementPopularity: function (request, response, next) {
            var id = parseInt(request.params.itemNumber, 10);

            for (var i = 0; i < items.length; ++i) {
                if (items[i].id == id) {
                    ++items[i].popularity;
                    fs.writeFile('serverData/items.json', JSON.stringify(items));
                    break;
                }
            }

            response.send("OK");
        },

        addItem: function (request, response, next) {
            var data = '';
            request.on('data', function (d) {
                data += d;
            });

            request.on('end', function () {
                data = JSON.parse(data);

                if (!data.name || !data.desc || !data.price) {
                    response.send({
                        status: "err",
                        msg: "Missing data"
                    });
                    return;
                }

                if (!data.cat || !data.cat.length) {
                    response.send({
                        status: "err",
                        msg: "Missing data"
                    });
                    return;
                }

                if (!data.images || !data.images.length) {
                    response.send({
                        status: "err",
                        msg: "Missing data"
                    });
                    return;
                }

                var newId = 0;
                for (var i = 0; i < items.length; ++i) {
                    if (items[i].id >= newId) {
                        newId = items[i].id + 1;
                    }
                }

                var myNewItem = {
                    name: data.name,
                    cat: data.cat,
                    price: data.price,
                    rating: Math.floor(Math.random() * 4) + 1,
                    desc: data.desc,
                    images: data.images,
                    id: newId,
                    availability: 0,
                    popularity: 0
                };

                items.push(myNewItem);
                fs.writeFileSync('serverData/items.json', JSON.stringify(items));
                response.send({
                    status: "OK",
                    id: newId
                });
            });
        },

        deleteItem: function (request, response, next) {
            for (var j = 0; j < items.length; ++j) {
                if (items[j].id == request.params.itemID) {
                    items.splice(j, 1);
                    fs.writeFileSync('serverData/items.json', JSON.stringify(items));
                    response.send({
                        status: "OK"
                    });
                    return;
                }
            }

            response.send({
                status: "Not found"
            });
        },

        changeItem: function (request, response, next) {
            var itemData = '';
            request.on('data', function (d) {
                itemData += d;
            });

            request.on('end', function () {
                itemData = JSON.parse(itemData);

                for (var j = 0; j < items.length; ++j) {
                    if (items[j].id == itemData.id) {
                        items[j].name = itemData.name;
                        items[j].desc = itemData.desc;
                        items[j].cat = itemData.cat;
                        items[j].price = itemData.price;
                        items[j].images = itemData.images;

                        fs.writeFileSync('serverData/items.json', JSON.stringify(items));
                        response.send({
                            status: "OK"
                        });
                        return;
                    }
                }

                response.send({
                    status: "Item not found"
                });
            });
        },

        getItems: function (request, response, next) {
            var category = request.params.catID || "All",
                myObj = [];

            if (category === "Hot Items") { //get top 15 most viewed items
                items.sort(function (a, b) {
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

            } else if (category !== "All") {
                for (var i = 0; i < items.length; ++i)
                    for (var j = 0; j < items[i].cat.length; ++j)
                        if (items[i].cat[j] === category)
                            myObj.push(items[i]);
            }
            else
                myObj = items;

            response.send(myObj);
        },

        getCategories: function (request, response, next) {
            response.send(categories);
        },

        getItem: function (request, response, next) {
            var id = request.params.id;

            for (var i = 0; i < items.length; ++i) {
                if (items[i].id == id) {
                    response.send({
                        status: "success",
                        item: {
                            name: items[i].name,
                            price: items[i].price,
                            desc: items[i].desc,
                            imgURL: items[i].images[0],
                            images: items[i].images
                        }
                    });
                    return;
                }
            }

            response.send({
                status: "error",
                code: "not found"
            });
        },

        chartItems: function (request, response, next) {
            var itemList = fs.readFileSync('serverData/items.json');
            response.send(itemList);
        },

        chartSales: function (request, response, next) {
            var salesList = fs.readFileSync('serverData/analytics.json');
            response.send(salesList);
        }

    };
};
