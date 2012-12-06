/*jshint node:true */

var PORT = process.env.PORT || process.argv[2] || 80,
    HOST = process.env.HOST,
    ENV = process.argv[3] || 'dev';

var express = require('express'),
    fs = require('fs'),
    app = express(),
    nodemailer = require("nodemailer"),
    jade = require('jade');

app.listen(PORT, HOST);
console.log('Server running on port:' + PORT);

var smtpTransport = nodemailer.createTransport("SMTP",{
  service: "Gmail",
  auth: {
    user: "speedyshopsales@gmail.com",
    pass: "speedyshop1"
  }
});

var orderEmailFn = jade.compile(fs.readFileSync('serverFiles/orderEmail.jade'));

(function () {
    app.shopData = {};
    app.shopData.analytics = JSON.parse(fs.readFileSync('serverData/analytics.json'));
    app.shopData.cat = JSON.parse(fs.readFileSync('serverData/cat.json'));
    app.shopData.filter = JSON.parse(fs.readFileSync('serverData/filter.json'));
    app.shopData.items = JSON.parse(fs.readFileSync('serverData/items.json'));
    app.shopData.orders = JSON.parse(fs.readFileSync('serverData/orders.json'));
    app.shopData.promoCodes = JSON.parse(fs.readFileSync('serverData/promoCodes.json'));
    app.shopData.reviews = JSON.parse(fs.readFileSync('serverData/reviews.json'));
    app.shopData.stateTaxes = JSON.parse(fs.readFileSync('serverData/stateTaxes.json'));
    app.shopData.giftCards = JSON.parse(fs.readFileSync('serverData/giftCards.json'));

    app.shopData.users = JSON.parse(fs.readFileSync('serverData/users.json'));
    app.shopData.usersWin = JSON.parse(fs.readFileSync('serverData/usersWin.json'));
}());

var itemServices = require('./serverFiles/itemServices')(app),
    filterServices = require('./serverFiles/filterServices')(app),
    reviewServices = require('./serverFiles/reviewServices')(app),
    employeeServices = require('./serverFiles/employeeServices')(app, smtpTransport, orderEmailFn),
    adminServices = require('./serverFiles/adminServices')(app);

if (ENV === 'prod') {
    var authServices = require('./serverFiles/authServices')(app);
} else {
    var authServices = require('./serverFiles/authServicesDEV')(app);
}

app.configure(function () {
    app.set('views', __dirname + '/serverFiles');
    app.set('view engine', 'jade');
    app.use(express.logger({format: ':method :status :url'}));
    app.use(express.cookieParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
    app.use(express.errorHandler({ dumpExceptions:true, showStack:true }));
});

// REST Call Routing Registry

// Menu Stuff
app.get('/getCategories', itemServices.getCategories);

// Items Stuff
app.get('/getItems', itemServices.getItems);
app.get('/getItems/:catID', itemServices.getItems);
app.get('/incrementPopularity/:itemNumber', itemServices.incrementPopularity);
app.post('/search', itemServices.search);
app.get('/getGiftCardValue/:code', itemServices.getGiftCardValue);
app.post('/invalidateGiftCard/:code', itemServices.invalidateGiftCard);

// Cart Stuff
app.get('/getItem/:id', itemServices.getItem);

// Filters Stuff
app.post('/filters', filterServices.getFilters);

// Review Stuff
app.get('/reviews/:id', reviewServices.getReviews);
app.post("/createReview/:objID", reviewServices.createReview);

// Employee Stuff
app.get('/orders', employeeServices.getOrders);
app.post('/processOrder/:orderNum', employeeServices.processOrder);
app.post('/updateAvailability', employeeServices.updateAvailability);
app.post('/submitOrder', authServices.getUserNameEmail, employeeServices.submitOrder);

// Authentication Stuff
app.post('/login', authServices.login);
app.post('/logout', authServices.logout);
app.get('/getUserName', authServices.getUserName);
app.post('/checkUserExistence', authServices.checkUserExistence);
app.post('/signup', authServices.signup);

// Admin Stuff
app.get('/sales/year/:yearID', adminServices.getSalesByYear);
app.get('/sales/year/:yearID/month/:monthID', adminServices.getSalesByYearMonth);

app.get('/promocodes', adminServices.getPromoCodes);
app.post('/addItem', itemServices.addItem);
app.post('/changeItem', itemServices.changeItem);
app.post('/deleteItem/:itemID', itemServices.deleteItem);
app.post('/updateInventory', adminServices.updateInventory);
app.post('/changeRating', adminServices.changeRating);
app.get('/getStateTaxes', adminServices.getStateTaxes);
app.get('/getStateTax/:stateCode', adminServices.getStateTax);
app.post('/changeTax', adminServices.changeTax);


app.get('/showEmailTemplate/order', function (req, res, next) {
    var fn = jade.compile(fs.readFileSync('serverFiles/orderEmail.jade'));
    var data = {
        name: "Dallin",
        orderNum: 12341234,
    };
    var html = fn(data);
    res.send(html);
});
