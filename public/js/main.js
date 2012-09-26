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
    'tmpl!templates/itemList',
    'tmpl!templates/header'
], function (
    $,
    itemListTmpl,
    headerTmpl
) {
    $.get("/getCategories/", function (data) {
        $(".header").html(headerTmpl(data));

        $(".show-sub-cats").click(function (e) {
            stopPropagation(e);
            var myEl = $(e.target).closest(".show-sub-cats").find(".sub-cat-container");
            myEl.slideToggle(100);
            closeAllBut(myEl);
        });

        $(".show-items").click(function (e) {
            // load an item page
        });
    });

    $.get("/getItems", function (data) {
        $(".content").html(itemListTmpl(data));
    });

    $("body").click(function (e) {
        $(".flyout").hide();
    });

    var closeAllBut = function (myMenu) {
        var menus = $(".flyout");

        for (var i = 0; i < menus.length; ++i) {
            if (menus[i] !== myMenu[0]) {
                $(menus[i]).hide();
            }
        }
    };

    var stopPropagation = function (e) {
        if (!e) { e = window.event; }
        if (e.cancelBubble) { e.cancelBubble = true; }
        else { e.stopPropagation(); }
    };
});
