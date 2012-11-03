/*jshint node:true*/

module.exports = function () {

    var fs = require('fs'),
        reviews = JSON.parse(fs.readFileSync('serverData/reviews.json'));

    return {
        getReviews: function (request, response, next) {
            var id = request.params.id;

            var arr = [];

            for (var i = 0; i < reviews.length; ++i) {
                if (reviews[i].id == id) {
                    arr = reviews[i].stars;
                }
            }

            response.send(arr);
        },
        createReview: function(request, response, next){
            var id = request.params.objID;

            var data = '';
            request.on('data', function (chunk) {
                data += chunk;
            });

            request.on('end', function () {
                data = JSON.parse(data);

                for (var i = 0; i<reviews.length;++i){
                    if (id == reviews[i].id){
                        var newRev ={
                            name: data.name,
                            text: data.text
                        };
                        reviews[i].stars[data.stars-1].reviews.push(newRev);
                        response.send("OK");
                    }
                }
            });
        }
    };
};
