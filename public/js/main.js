/*global console, require */

require.config({
    paths: {
        'jquery': 'lib/jquery',
        'underscore': 'lib/underscore',
        'backbone': 'lib/backbone',
        'tmpl': 'lib/tmpl'
    },

    shim: {
        'jquery': {
            deps: [],
            exports: '$'
        },

        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    }
});

require([
    'jquery',
    'tmpl!templates/itemList'
], function (
    $,
    itemListTmpl
) {
    // start coding here
//    $.get("/getItems/Electronics", function (data) {
    $.get("/getItems", function (data) {
        $(".content").html(itemListTmpl(data));
    });

    $(".catChooser").click(function (e) {
        $.get("/getItems/" + $(e.target).text(), function (data) {
            $(".content").html(itemListTmpl(data));
        });
    });
});
