module.exports = function (app) {

    var CUSTOMER_TYPE = 1,
        EMPLOYEE_TYPE = 2,
        ADMIN_TYPE = 3;

    var fs = require('fs'),
        bcrypt = require('bcrypt'),
        userDB = JSON.parse(fs.readFileSync("serverData/users.json"));

    return {
        login: function (req, res, next) {
            var input = '';
            req.on('data', function (chunk) {
                input += chunk;
            });

            req.on('end', function () {
                input = JSON.parse(input);

                var user = userDB[input.user];

                if (user && bcrypt.compareSync(input.pass, user.pass)) {
                    res.cookie('loggedIn', true);
                    res.cookie('loggedInName', input.user);
                    res.send(JSON.stringify({ success: true, user: input.user, userID: user.type }));
                } else {
                    res.send(JSON.stringify({ success: false, error: 'incorrect username / password' }));
                }
            });
        },

        logout: function (req, res, next) {
            res.cookie('loggedIn', '');
            res.cookie('loggedInName', '');
            res.send(JSON.stringify({ success: true }));
        },

        getUserName: function (req, res, next) {
            if (req.cookies.loggedIn) {
                res.send(JSON.stringify({ user: req.cookies.loggedInName, userID: userDB[req.cookies.loggedInName].type }));
            } else {
                res.send('');
            }
        },

        checkUserExistence: function (req, res, next) {
            var input = '';
            req.on('data', function (chunk) {
                input += chunk;
            });

            req.on('end', function () {
                if (userDB[input]) {
                    res.send(true);
                } else {
                    res.send(false);
                }
            });
        },

        signup: function (req, res, next) {
            var input = '';
            req.on('data', function (chunk) {
                input += chunk;
            });

            req.on('end', function () {
                input = JSON.parse(input);
                if (userDB[input.user]) {
                    res.send(JSON.stringify({ success: false, error: 'already exists' }));
                } else {

                    var salt = bcrypt.genSaltSync(10);
                    var hash = bcrypt.hashSync(input.pass, salt);

                    var newUser = {
                        pass: hash,
                        email: input.email,
                        fname: input.fname,
                        lname: input.lname,
                        type: CUSTOMER_TYPE
                    };
                    userDB[input.user] = newUser;

                    fs.writeFile('serverData/users.json', JSON.stringify(userDB), function () {
                        res.cookie('loggedIn', true);
                        res.cookie('loggedInName', input.user);
                        res.send(JSON.stringify({
                            success: true,
                            user: input.user,
                            userID: newUser.type
                        }));
                    });
                }
            });
        }
    };
};
