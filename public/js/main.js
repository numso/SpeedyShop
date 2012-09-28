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
    'pages/common/views/header',
    'pages/common/views/footer',
    'pages/customer/views/filters',
    'pages/customer/views/items',
    'pages/customer/views/cart'
], function (
    $,
    Backbone,
    HeaderView,
    FooterView,
    FiltersView,
    ItemsView,
    CartView
) {

    var headerView = new HeaderView({
        className: "panel header",
        model: {}
    });
    $(".header").replaceWith(headerView.render().el);

    var footerView = new FooterView({
        className: "panel footer",
        model: {}
    });
    $(".footer").replaceWith(footerView.render().el);

    var filtersView = new FiltersView({
        className: "filters",
        model: {}
    });
    $(".left-panel").html(filtersView.render().el);

    var itemsView = new ItemsView({
        className: "items-list",
        model: {}
    });
    $(".mid-panel").html(itemsView.render().el);

    var cartView = new CartView({
        className: "cart",
        model: {}
    });
    $(".right-panel").html(cartView.render().el);

    $("body").click(function (e) {
        $(".flyout").hide();
        $(".sign-in-modal").css("height", 0);
    });
});
