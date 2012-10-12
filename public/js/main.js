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
    'pages/admin/views/menu',
    'pages/admin/views/sales-report',
    'pages/customer/views/items',
    'pages/customer/views/cart'
], function (
    $,
    Backbone,
    HeaderView,
    FooterView,
    FiltersView,
    AdminMenuView,
    SalesReportView,
    ItemsView,
    CartView
) {

    var showAdminView = function () {
        if ($('.admin-menu-view')[0] !== curLeft[0]) {
            rotateView($('.admin-menu-view'), curLeft, $('.left-panel'));
            curLeft = $('.admin-menu-view');
        }

        setTimeout(function () {
            if ($('.sales-report')[0] !== curMid[0]) {
                rotateView($('.sales-report'), curMid, $('.mid-panel'));
                curMid = $('.sales-report');
            }
        }, 300);
    };

    var showCustomerView = function () {
        if ($('.filters')[0] !== curLeft[0]) {
            rotateView($('.filters'), curLeft, $('.left-panel'));
            curLeft = $('.filters');
        }

        setTimeout(function () {
            if ($('.items-list')[0] !== curMid[0]) {
                rotateView($('.items-list'), curMid, $('.mid-panel'));
                curMid = $('.items-list');
            }
        }, 300);
    };

    var rotateView = function (toRotate, toHide, theParent) {
        toRotate.addClass('rotated');
        toRotate.removeClass('hidden');
        theParent.addClass('flipit');

        theParent.on('webkitTransitionEnd', function () {
            toHide.addClass('hidden');
            toRotate.removeClass('rotated');
            theParent.removeClass('flipit');
            theParent.unbind('webkitTransitionEnd');
        });

    }

    var headerView = new HeaderView({
        className: "panel header",
        model: {
            showAdminView: showAdminView,
            showCustomerView: showCustomerView
        }
    });
    $(".header").replaceWith(headerView.render().el);

    var footerView = new FooterView({
        className: "panel footer",
        model: {}
    });
    $(".footer").replaceWith(footerView.render().el);




    var filtersView = new FiltersView({
        className: "panel filters",
        model: {}
    });
    $(".left-panel").html(filtersView.render().el);

    var adminMenuView = new AdminMenuView({
        className: "panel admin-menu-view hidden",
        model: {}
    });
    $(".left-panel").append(adminMenuView.render().el);




    var itemsView = new ItemsView({
        className: "panel items-list",
        model: {}
    });
    $(".mid-panel").html(itemsView.render().el);

    var salesReportView = new SalesReportView({
        className: "panel sales-report hidden",
        model: {}
    });
    $(".mid-panel").append(salesReportView.render().el);




    var cartView = new CartView({
        className: "panel cart",
        model: {}
    });
    $(".right-panel").html(cartView.render().el);


    var curLeft = $('.filters');
    var curMid = $('.items-list');
    var curRight = $('.cart');




    $("body").click(function (e) {
        $(".flyout").hide();
        headerView.resetLogInModal();
    });
});
