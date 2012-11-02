/*jshint node:true*/

module.exports = function () {

    var fs = require('fs'),
        reviews = JSON.parse(fs.readFileSync('serverData/reviews.json'));

    return {
        getReviews: function (request, response, next) {
            var id = request.params.id;

            var arr = [];

            if (id < reviews.length) {
                arr = reviews[id];
            }

            response.send(arr);
        }
    };
};
