/*jshint node:true */

var PORT = process.env.PORT || process.argv[2] || 80,
    HOST = process.env.HOST,
    ENV = process.argv[3] || 'dev';

var express = require('express'),
    app = express();

app.listen(PORT, HOST);
console.log('Server running on port:' + PORT);

var itemServices = require('./serverFiles/itemServices')(),
    filterServices = require('./serverFiles/filterServices')(),
    reviewServices = require('./serverFiles/reviewServices')(),
    employeeServices = require('./serverFiles/employeeServices')();

if (ENV === 'prod') {
    var authServices = require('./serverFiles/authServices')();
} else {
    var authServices = require('./serverFiles/authServicesDEV')();
}

app.configure(function () {
    app.use(express.logger({format: ':method :status :url'}));
    app.use(express.cookieParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
    app.use(express.errorHandler({ dumpExceptions:true, showStack:true }));
});

// REST Call Routing Registry

// Menu Stuff
app.get('/getCategories/', itemServices.getCategories);

// Items Stuff
app.get('/getItems', itemServices.getItems);
app.get('/getItems/:catID', itemServices.getItems);
app.get('/incrementPopularity/:itemNumber', itemServices.incrementPopularity);
app.post('/search', itemServices.search);

// Cart Stuff
app.get('/getItem/:id', itemServices.getItem);

// Filters Stuff
app.post('/filters', filterServices.getFilters);

// Review Stuff
app.get('/reviews/:id', reviewServices.getReviews);
app.post("/createReview/:objID", reviewServices.createReview);

// Shipping Stuff
app.get('/orders', employeeServices.getOrders);

// Authentication Stuff
app.post('/login', authServices.login);
app.post('/logout', authServices.logout);
app.get('/getUserName', authServices.getUserName);
app.post('/checkUserExistence', authServices.checkUserExistence);
app.post('/signup', authServices.signup);


var sales = JSON.parse(require('fs').readFileSync('serverData/test.json'));
app.get('/sales', function (request, response, next) {
    var newArr = [];

    for (var i = 0; i < sales.length; ++i) {
        var newDate = new Date(sales[i].timestamp);
        if (newDate.getMonth() === 0) {
            var actual = 0,
                projected = 0;
            for (var j = 0; j < sales[i].items.length; ++j) {
                actual += sales[i].items[j].actual;
                projected += sales[i].items[j].projected;
            }

            newArr[newDate.getDate()] = {
                actual: actual,
                projected: projected
            };
        }
    }

    response.send(newArr);
});
