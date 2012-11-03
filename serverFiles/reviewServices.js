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
                    arr = reviews[i].reviews;
                }
            }

            response.send(arr);
        }
    };
};
