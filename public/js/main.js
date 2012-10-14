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
    'pages/customer/views/reviews',
    'pages/customer/views/breadcrumbs',
    'pages/admin/views/menu',
    'pages/employee/views/menu',

    'pages/customer/views/items',
    'pages/customer/views/checkout',
    'pages/admin/views/sales-report',
    'pages/admin/views/marketing',
    'pages/admin/views/inventory',
    'pages/admin/views/items',
    'pages/employee/views/shipping',

    'pages/customer/views/cart'
], function (
    $,
    Backbone,

    HeaderView,
    FooterView,

    FiltersView,
    ReviewsView,
    BreadcrumbsView,
    AdminMenuView,
    EmployeeMenuView,

    ItemsView,
    CheckoutView,
    SalesReportView,
    MarketingView,
    InventoryView,
    AdminItemsView,
    ShippingView,

    CartView
) {
    // Define View Transitions
    var animTime = 600;

    var showAdminView = function () {
        if ($('.admin-menu-view')[0] !== curLeft[0]) {
            rotateView($('.admin-menu-view'), curLeft, $('.left-panel'));
            curLeft = $('.admin-menu-view');
        }

        setTimeout(function () {
            if ($('.sales-report-view')[0] !== curMid[0]) {
                rotateView($('.sales-report-view'), curMid, $('.mid-panel'));
                curMid = $('.sales-report-view');
            }
        }, animTime);
    };

    var showCustomerView = function () {
        if ($('.filters')[0] !== curLeft[0]) {
            rotateView($('.filters'), curLeft, $('.left-panel'));
            curLeft = $('.filters');
        }

        setTimeout(function () {
            if ($('.items-list-view')[0] !== curMid[0]) {
                rotateView($('.items-list-view'), curMid, $('.mid-panel'));
                curMid = $('.items-list-view');
            }
        }, animTime);
    };

    var showEmployeeView = function () {
        if ($('.employee-menu-view')[0] !== curLeft[0]) {
            rotateView($('.employee-menu-view'), curLeft, $('.left-panel'));
            curLeft = $('.employee-menu-view');
        }

        setTimeout(function () {
            if ($('.shipping-view')[0] !== curMid[0]) {
                rotateView($('.shipping-view'), curMid, $('.mid-panel'));
                curMid = $('.shipping-view');
            }
        }, 500);
    };

    var emp_showShipping = function () {
        if ($('.shipping-view')[0] !== curMid[0]) {
            rotateView($('.shipping-view'), curMid, $('.mid-panel'));
            curMid = $('.shipping-view');
        }
    };

    var adm_showSalesReports = function () {
        if ($('.sales-report-view')[0] !== curMid[0]) {
            rotateView($('.sales-report-view'), curMid, $('.mid-panel'));
            curMid = $('.sales-report-view');
        }
    };

    var adm_showMarketing = function () {
        if ($('.marketing-view')[0] !== curMid[0]) {
            rotateView($('.marketing-view'), curMid, $('.mid-panel'));
            curMid = $('.marketing-view');
        }
    };

    var adm_showItems = function () {
        if ($('.admin-items-view')[0] !== curMid[0]) {
            rotateView($('.admin-items-view'), curMid, $('.mid-panel'));
            curMid = $('.admin-items-view');
        }
    };

    var adm_showInventory = function () {
        if ($('.inventory-view')[0] !== curMid[0]) {
            rotateView($('.inventory-view'), curMid, $('.mid-panel'));
            curMid = $('.inventory-view');
        }
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
    };


    // Create the Header and Footer Views

    var headerView = new HeaderView({
        className: "panel header",
        model: {
            showAdminView: showAdminView,
            showCustomerView: showCustomerView,
            showEmployeeView: showEmployeeView
        }
    });
    $(".header").replaceWith(headerView.render().el);

    var footerView = new FooterView({
        className: "panel footer",
        model: {}
    });
    $(".footer").replaceWith(footerView.render().el);


    // Create all the Left Side Views

    var filtersView = new FiltersView({
        className: "panel filters",
        model: {}
    });
    $(".left-panel").html(filtersView.render().el);

    var reviewsView = new ReviewsView({
        className: "panel reviews-view hidden",
        model: {}
    });
    $(".left-panel").append(reviewsView.render().el);

    var breadcrumbsView = new BreadcrumbsView({
        className: "panel breadcrumbs-view hidden",
        model: {}
    });
    $(".left-panel").append(breadcrumbsView.render().el);

    var adminMenuView = new AdminMenuView({
        className: "panel admin-menu-view hidden",
        model: {
            showSalesReports: adm_showSalesReports,
            showInventory: adm_showInventory,
            showItems: adm_showItems,
            showMarketing: adm_showMarketing
        }
    });
    $(".left-panel").append(adminMenuView.render().el);

    var employeeMenuView = new EmployeeMenuView({
        className: "panel employee-menu-view hidden",
        model: {}
    });
    $(".left-panel").append(employeeMenuView.render().el);


    // Create all the Middle Pane Views

    var itemsView = new ItemsView({
        className: "panel items-list-view",
        model: {}
    });
    $(".mid-panel").html(itemsView.render().el);

    var checkoutView = new CheckoutView({
        className: "panel checkout-view hidden",
        model: {}
    });
    $(".mid-panel").append(checkoutView.render().el);

    var salesReportView = new SalesReportView({
        className: "panel sales-report-view hidden",
        model: {}
    });
    $(".mid-panel").append(salesReportView.render().el);

    var marketingView = new MarketingView({
        className: "panel marketing-view hidden",
        model: {}
    });
    $(".mid-panel").append(marketingView.render().el);

    var inventoryView = new InventoryView({
        className: "panel inventory-view hidden",
        model: {}
    });
    $(".mid-panel").append(inventoryView.render().el);

    var adminItemsView = new AdminItemsView({
        className: "panel admin-items-view hidden",
        model: {}
    });
    $(".mid-panel").append(adminItemsView.render().el);

    var shippingView = new ShippingView({
        className: "panel shipping-view hidden",
        model: {}
    });
    $(".mid-panel").append(shippingView.render().el);


    // Create all the Right Side Views

    var cartView = new CartView({
        className: "panel cart",
        model: {}
    });
    $(".right-panel").html(cartView.render().el);


    // Set the Default Side Views

    var curLeft = $('.filters');
    var curMid = $('.items-list-view');
    var curRight = $('.cart');


    // default click handler for flyout menus

    $("body").click(function (e) {
        $(".flyout").hide();
        headerView.resetLogInModal();
    });
});
