/*jshint node:true*/

module.exports = function (io) {

    return {
        stopServer: function (request, response, next) {
            process.exit();
        },
        getEvents: function (request, response, next) {
            response.writeHead(200, { "Content-Type": "application/json" });
            var events = [
                {
                    name: "test1",
                    time: "4:00"
                },
                {
                    name: "test2",
                    time: "6:00"
                },
                {
                    name: "testaoeu",
                    time: "4:00"
                },
                {
                    name: "testhey",
                    time: "6:00"
                },
                {
                    name: "test5",
                    time: "4:00"
                },
                {
                    name: "test55",
                    time: "6:00"
                }
            ];

            for (var i = 0; i < events.length; i++) {
                if (i % 2 === 0) {
                    events[i].color = "#748294";
                }
            }

            response.end(JSON.stringify(events));
        }
    };
};
