/*jshint node:true*/

module.exports = function (app) {

    var fs = require('fs');

    return {
        getReviews: function (request, response, next) {
            var reviews = app.shopData.reviews;

            var id = request.params.id,
                found = false,
                arr = [];

            for (var i = 0; i < reviews.length && !found; ++i) {
                if (reviews[i].id == id) {
                    arr = reviews[i].stars;
                    found = true;
                }
            }

            response.send(arr);
        },

        createReview: function (request, response, next){
            var reviews = app.shopData.reviews,
                id = request.params.objID;

            var data = '';
            request.on('data', function (chunk) {
                data += chunk;
            });

            request.on('end', function () {
                data = JSON.parse(data);
                var revObj = {
                    name: data.name,
                    text: data.text
                },
                    added = false;

                for (var i = 0; i < reviews.length && !added; ++i) {
                    if (id == reviews[i].id) {
                        reviews[i].stars[data.stars - 1].reviews.push(revObj);
                        added = true;
                        fs.writeFile('serverData/reviews.json', JSON.stringify(reviews));
                        response.send(reviews[i].stars);
                        break;
                    }
                }

                if (!added) {
                    var starsArr = [];
                    for (var j = 0; j < 5; ++j) {
                        starsArr.push({ reviews: [] });
                    }

                    starsArr[data.stars - 1].reviews.push(revObj);

                    reviews.push({
                        id: id,
                        stars: starsArr
                    });

                    fs.writeFile('serverData/reviews.json', JSON.stringify(reviews));
                    response.send(starsArr);
                }
            });
        }
    };
};
