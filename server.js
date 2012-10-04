/*jshint node:true */

var PORT = process.env.PORT || process.argv[2] || 80,
    HOST = process.env.IP;

var http = require('http'),
    express = require('express'),
    fs = require('fs');

var app = express(),
    server = http.createServer(app);

var indexServices = require('./serverFiles/indexServices')();

app.configure(function () {
    app.use(express.logger({format: ":method :status :url"}));
    app.use(express.cookieParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + "/public"));
    app.use(express.errorHandler({dumpExceptions:true, showStack:true}));
});

server.listen(PORT, HOST);
console.log("Server running on " + HOST + ":" + PORT);

// REST Call Routing Registry
app.get('/getItems', indexServices.getItems);
app.get('/getItems/:catID', indexServices.getItems);

app.get('/getCategories/', indexServices.getCategories);


var userDB = {
    'Dallin': 'cheese',
    'Fred': 'boat',
    'Justin': 'candy'
};

app.post('/login', function (req, res, next) {
    var input = '';
    req.on('data', function (d) {
        input += d;
    })

    req.on('end', function () {
        input = JSON.parse(input);

        var success = false;
        var pass = userDB[input.user];

        if (pass && pass === input.pass) {
            success = true;
            res.cookie('loggedIn', true);
            res.cookie('loggedInName', input.user);
        }
        res.send(JSON.stringify({ success:success }));
    });
});

app.get('/logout', function (req, res, next) {
    res.cookie('loggedIn', false);
    res.cookie('loggedInName', '');
    res.send(JSON.stringify({ success: true }));
});

app.get('/getUserName', function (req, res, next) {
    if (req.cookies.loggedIn) {
        res.send(req.cookies.loggedInName);
    } else {
        res.send('');
    }
});
