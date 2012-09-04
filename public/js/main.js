/*global console, require */

require.config({
    paths: {
        'jquery': 'lib/jquery',
        'underscore': 'lib/underscore',
        'backbone': 'lib/backbone',
        'tmpl': 'lib/tmpl',
        'socketio': '/socketio/socket.io.js'
    },

    shim: {
        'jquery': {
            deps: [],
            exports: '$'
        },

        'socketio': {
            deps: [],
            exports: "io"
        },

        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    }
});

require([
    'jquery'
], function (
    $
) {
    // start coding here
});
