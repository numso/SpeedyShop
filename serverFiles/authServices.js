
module.exports = function () {

    var fs = require('fs'),
        userDB = JSON.parse(fs.readFileSync("serverData/users.json"));

    return {
        login: function (req, res, next) {
            var input = '';
            req.on('data', function (d) {
                input += d;
            })

            req.on('end', function () {
                input = JSON.parse(input);

                var user = userDB[input.user];

                if (user && user.pass === input.pass) {
                    res.cookie('loggedIn', true);
                    res.cookie('loggedInName', input.user);
                    res.send(JSON.stringify({ success: true, user: input.user }));
                } else {
                    res.send(JSON.stringify({ success: false, error: 'incorrect username / password' }));
                }
            });
        },

        logout: function (req, res, next) {
            res.cookie('loggedIn', false);
            res.cookie('loggedInName', '');
            res.send(JSON.stringify({ success: true }));
        },

        getUserName: function (req, res, next) {
            if (req.cookies.loggedIn) {
                res.send(req.cookies.loggedInName);
            } else {
                res.send('');
            }
        },

        signup: function (req, res, next) {
            var input = '';
            req.on('data', function (d) {
                input += d;
            });

            req.on('end', function () {
                input = JSON.parse(input);
                if (userDB[input.user]) {
                    res.send(JSON.stringify({ success: false, error: 'already exists'}));
                } else {

                    userDB[input.user] = {
                        pass: input.pass,
                        email: input.email,
                        fname: input.fname,
                        lname: input.lname
                    };

                    fs.writeFile('serverData/users.json', JSON.stringify(userDB), function () {
                        res.send(JSON.stringify({ success: true, user: input.user }));
                    });
                }
            });
        }
    };
};
