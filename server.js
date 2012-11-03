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
    reviewServices = require('./serverFiles/reviewServices')();

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

// Cart Stuff
app.get('/getItem/:id', itemServices.getItem);

// Filters Stuff
app.post('/filters', filterServices.getFilters);

// Review Stuff
app.get('/reviews/:id', reviewServices.getReviews);
app.post("/createReview/:objID", reviewServices.createReview);

// Authentication Stuff
app.post('/login', authServices.login);
app.post('/logout', authServices.logout);
app.get('/getUserName', authServices.getUserName);
app.post('/checkUserExistence', authServices.checkUserExistence);
app.post('/signup', authServices.signup);
