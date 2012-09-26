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
    'backbone',
    'tmpl!templates/itemList',
    'views/header'
], function (
    $,
    Backbone,
    itemListTmpl,
    HeaderView
) {

    var headerView = new HeaderView({
        className: "header",
        model: {}
    });
    $(".header").replaceWith(headerView.render().el);

    $.get("/getItems", function (data) {
        $(".content").html(itemListTmpl(data));
    });

    $("body").click(function (e) {
        $(".flyout").hide();
    });
});
