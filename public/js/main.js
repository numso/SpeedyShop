/*global console, require, window */

require.config({
    paths: {
        'jquery': 'lib/jquery',
        'underscore': 'lib/underscore',
        'backbone': 'lib/backbone',
        'tmpl': 'lib/tmpl',
        'jquery-ui': 'lib/jquery-ui'
    },

    shim: {
        'jquery': {
            deps: [],
            exports: '$'
        },

        'jquery-ui': {
            deps: ['jquery']
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
    //'pages/admin/views/marketing',
    'pages/admin/views/promocodelist',
    'pages/admin/views/promocode',
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
    //MarketingView,
    promoCodeListView,
    promoCodeView,
    InventoryView,
    AdminItemsView,
    ShippingView,

    CartView
) {
    // Define View Transitions

    var animTime = 300,
        isAnimating = false,
        animCount, curLeft, curMid, curRight;

    var decrementAnimCount = function (cb) {
        --animCount;
        if (animCount === 0) {
            isAnimating = false;
            if (typeof cb === "function") {
                cb();
            }
        }
    };

    var rotateView = function (toRotate, toHide, theParent, cb) {
        toRotate.addClass('rotated');
        toRotate.removeClass('hidden');
        theParent.addClass('flipit');

        theParent.on('webkitTransitionEnd', function () {
            toHide.addClass('hidden');
            toRotate.removeClass('rotated');
            theParent.removeClass('flipit');
            theParent.unbind('webkitTransitionEnd');
            if (typeof cb === 'function') {
                cb();
            }
        });
    };

    var showAdminView = function () {
        if (!isAnimating) {
            isAnimating = true;
            animCount = 3;

            if ($('.admin-menu-view')[0] !== curLeft[0]) {
                rotateView($('.admin-menu-view'), curLeft, $('.left-panel'), function () {
                    curLeft = $('.admin-menu-view');
                    decrementAnimCount();
                });
            } else {
                decrementAnimCount();
            }

            if ($('.sales-report-view')[0] !== curMid[0]) {
                window.setTimeout(function () {
                    rotateView($('.sales-report-view'), curMid, $('.mid-panel'), function () {
                        curMid = $('.sales-report-view');
                        salesReportView.gotFocus();
                        decrementAnimCount();
                    });
                }, animTime);
            } else {
                decrementAnimCount();
            }

            if ($('.cart')[0] !== curRight[0]) {
                window.setTimeout(function () {
                    rotateView($('.cart'), curRight, $('.right-panel'), function () {
                        curRight = $('.cart');
                        decrementAnimCount();
                    });
                }, animTime);
            } else {
                decrementAnimCount();
            }
        }
    };

    var showCustomerView = function () {
        if (!isAnimating) {
            isAnimating = true;
            animCount = 3;

            if ($('.filters')[0] !== curLeft[0]) {
                rotateView($('.filters'), curLeft, $('.left-panel'), function () {
                    curLeft = $('.filters');
                    decrementAnimCount();
                });
            } else {
                decrementAnimCount();
            }

            if ($('.items-list-view')[0] !== curMid[0]) {
                window.setTimeout(function () {
                    rotateView($('.items-list-view'), curMid, $('.mid-panel'), function () {
                        curMid = $('.items-list-view');
                        decrementAnimCount();
                    });
                }, animTime);
            } else {
                decrementAnimCount()
            }

            if ($('.cart')[0] !== curRight[0]) {
                window.setTimeout(function () {
                    rotateView($('.cart'), curRight, $('.right-panel'), function () {
                        curRight = $('.cart');
                        decrementAnimCount();
                    });
                }, animTime);
            } else {
                decrementAnimCount();
            }

            $('.qty-cnt, .X-button').attr('disabled', false);
        }
    };

    var showEmployeeView = function () {
        if (!isAnimating) {
            isAnimating = true;
            animCount = 3;

            if ($('.employee-menu-view')[0] !== curLeft[0]) {
                rotateView($('.employee-menu-view'), curLeft, $('.left-panel'), function () {
                    curLeft = $('.employee-menu-view');
                    decrementAnimCount();
                });
            } else {
                decrementAnimCount();
            }

            if ($('.shipping-view')[0] !== curMid[0]) {
                window.setTimeout(function () {
                    rotateView($('.shipping-view'), curMid, $('.mid-panel'), function () {
                        curMid = $('.shipping-view');
                        decrementAnimCount();
                    });
                }, animTime);
            } else {
                decrementAnimCount();
            }

            if ($('.cart')[0] !== curRight[0]) {
                window.setTimeout(function () {
                    rotateView($('.cart'), curRight, $('.right-panel'), function () {
                        curRight = $('.cart');
                        decrementAnimCount();
                    });
                }, animTime);
            } else {
                decrementAnimCount();
            }

        }
    };

    var emp_showShipping = function () {
        if (!isAnimating) {
            isAnimating = true;
            animCount = 1;

            if ($('.shipping-view')[0] !== curMid[0]) {
                rotateView($('.shipping-view'), curMid, $('.mid-panel'), function () {
                    curMid = $('.shipping-view');
                    decrementAnimCount();
                });
            } else {
                decrementAnimCount();
            }
        }
    };

    var adm_showSalesReports = function (cb) {
        if (!isAnimating) {
            isAnimating = true;
            animCount = 2;

            if ($('.sales-report-view')[0] !== curMid[0]) {
                rotateView($('.sales-report-view'), curMid, $('.mid-panel'), function () {
                    curMid = $('.sales-report-view');
                    salesReportView.gotFocus();
                    decrementAnimCount(cb);
                });
            } else {
                decrementAnimCount(cb);
            }

            if ($('.cart')[0] !== curRight[0]) {
                window.setTimeout(function () {
                    rotateView($('.cart'), curRight, $('.right-panel'), function () {
                        curRight = $('.cart');
                        decrementAnimCount(cb);
                    });
                }, animTime);
            } else {
                decrementAnimCount(cb);
            }
        }
    };

    //var adm_showMarketing = function (cb) {
        // if (!isAnimating) {
        //     isAnimating = true;
        //     animCount = 2;

        //     if ($('.marketing-view')[0] !== curMid[0]) {
        //         rotateView($('.marketing-view'), curMid, $('.mid-panel'), function () {
        //             curMid = $('.marketing-view');
        //             decrementAnimCount(cb);
        //         });
        //     } else {
        //         decrementAnimCount(cb);
        //     }

        //     if ($('.cart')[0] !== curRight[0]) {
        //         window.setTimeout(function () {
        //             rotateView($('.cart'), curRight, $('.right-panel'), function () {
        //                 curRight = $('.cart');
        //                 decrementAnimCount(cb);
        //             });
        //         }, animTime);
        //     } else {
        //         decrementAnimCount(cb);
        //     }
        // }
    //};

    var adm_showPromoCode = function (cb) {
        if (!isAnimating) {
            isAnimating = true;
            animCount = 2;

            if ($('.promo-code-view')[0] !== curMid[0]) {
                rotateView($('.promo-code-view'), curMid, $('.mid-panel'), function () {
                    curMid = $('.promo-code-view');
                    decrementAnimCount(cb);
                });
            } else {
                decrementAnimCount(cb);
            }

            if ($('.promo-code-list-view')[0] !== curRight[0]) {
                window.setTimeout(function () {
                    rotateView($('.promo-code-list-view'), curRight, $('.right-panel'), function () {
                        curRight = $('.promo-code-list-view');
                        decrementAnimCount(cb);
                    });
                }, animTime);
            } else {
                decrementAnimCount(cb);
            }
        }
    };

    var adm_showItems = function (cb) {
        if (!isAnimating) {
            isAnimating = true;
            animCount = 2;

            if ($('.admin-items-view')[0] !== curMid[0]) {
                rotateView($('.admin-items-view'), curMid, $('.mid-panel'), function () {
                    curMid = $('.admin-items-view');
                    decrementAnimCount(cb);
                });
            } else {
                decrementAnimCount(cb);
            }

            if ($('.cart')[0] !== curRight[0]) {
                window.setTimeout(function () {
                    rotateView($('.cart'), curRight, $('.right-panel'), function () {
                        curRight = $('.cart');
                        decrementAnimCount(cb);
                    });
                }, animTime);
            } else {
                decrementAnimCount(cb);
            }
        }
    };

    var adm_showInventory = function (cb) {
        if (!isAnimating) {
            isAnimating = true;
            animCount = 2;

            if ($('.inventory-view')[0] !== curMid[0]) {
                rotateView($('.inventory-view'), curMid, $('.mid-panel'), function () {
                    curMid = $('.inventory-view');
                    decrementAnimCount(cb);
                });
            } else {
                decrementAnimCount(cb);
            }

            if ($('.cart')[0] !== curRight[0]) {
                window.setTimeout(function () {
                    rotateView($('.cart'), curRight, $('.right-panel'), function () {
                        curRight = $('.cart');
                        decrementAnimCount(cb);
                    });
                }, animTime);
            } else {
                decrementAnimCount(cb);
            }
        }
    };

    var cust_showFilters = function () {
        if (!isAnimating) {
            isAnimating = true;
            animCount = 1;

            if ($('.filters')[0] !== curLeft[0]) {
                rotateView($('.filters'), curLeft, $('.left-panel'), function () {
                    curLeft = $('.filters');
                    decrementAnimCount();
                });
            } else {
                decrementAnimCount();
            }
        }
    };

    var cust_showReviews = function (id) {
        if (!isAnimating) {
            isAnimating = true;
            animCount = 1;

            if ($('.reviews-view')[0] !== curLeft[0]) {
                rotateView($('.reviews-view'), curLeft, $('.left-panel'), function () {
                    curLeft = $('.reviews-view');
                    decrementAnimCount();
                });
            } else {
                decrementAnimCount();
            }

            reviewsView.clickedItem(id);
        }
    };

    var cust_showCheckout = function (id) {
        if (!isAnimating) {
            isAnimating = true;
            animCount = 2;

            if ($('.breadcrumbs-view')[0] !== curLeft[0]) {
                rotateView($('.breadcrumbs-view'), curLeft, $('.left-panel'), function () {
                    curLeft = $('.breadcrumbs-view');
                    decrementAnimCount();
                });
            } else {
                decrementAnimCount();
            }

            if ($('.checkout-view')[0] !== curMid[0]) {
                window.setTimeout(function () {
                    rotateView($('.checkout-view'), curMid, $('.mid-panel'), function () {
                        curMid = $('.checkout-view');
                        decrementAnimCount();
                    });
                }, animTime);
            } else {
                decrementAnimCount();
            }

            headerView.showKeepShoppingButton();
            checkoutView.showCartConfirm(cartView.cart);
            breadcrumbsView.animateBreadcrumbs(0);
        }
    };

    // other intra-module communication functions

    var showItemsInList = function (catName, subcatName) {
        itemsView.loadItems(catName, subcatName);
        filtersView.selectedItem(catName, subcatName);
        cust_showFilters();
    };

    var addItemToCart = function (id) {
        cartView.addItem(id);
    };

    var showOrderToEmployee = function (data) {
        shippingView.gotOrder(data);
    };

    var updateBreadcrumbs = function (curStep) {
        breadcrumbsView.animateBreadcrumbs(curStep);
    };

    var sendFiltersToItemView = function (filters) {
        itemsView.updateFilteredItems(filters);
    };

    // Create the Header and Footer Views

    var headerView = new HeaderView({
        className: "panel header",
        model: {
            showAdminView: showAdminView,
            showCustomerView: showCustomerView,
            showEmployeeView: showEmployeeView,
            showItemsInList: showItemsInList
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
        model: {
            applyFilters: sendFiltersToItemView
        }
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
            //showMarketing: adm_showMarketing,
            showPromoCode: adm_showPromoCode
        }
    });
    $(".left-panel").append(adminMenuView.render().el);

    var employeeMenuView = new EmployeeMenuView({
        className: "panel employee-menu-view hidden",
        model: {
            showOrder: showOrderToEmployee
        }
    });
    $(".left-panel").append(employeeMenuView.render().el);


    // Create all the Middle Pane Views

    var itemsView = new ItemsView({
        className: "panel items-list-view",
        model: {
            showReviews: cust_showReviews,
            showFilters: cust_showFilters,
            addItemToCart: addItemToCart
        }
    });
    $(".mid-panel").html(itemsView.render().el);

    var checkoutView = new CheckoutView({
        className: "panel checkout-view hidden",
        model: {
            updateBreadcrumbs: updateBreadcrumbs
        }
    });
    $(".mid-panel").append(checkoutView.render().el);

    var salesReportView = new SalesReportView({
        className: "panel sales-report-view hidden",
        model: {}
    });
    $(".mid-panel").append(salesReportView.render().el);

    // var marketingView = new MarketingView({
    //     className: "panel marketing-view hidden",
    //     model: {}
    // });
    //$(".mid-panel").append(marketingView.render().el);

    var promoCodeView = new promoCodeView({
        className: "panel promo-code-view hidden",
        model: {}
    });
    $(".mid-panel").append(promoCodeView.render().el);

    var promoCodeListView = new promoCodeListView({
        className: "panel promo-code-list-view hidden",
        model: {}
    });
    $(".right-panel").append(promoCodeListView.render().el);

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
        model: {
            showCheckout: cust_showCheckout
        }
    });
    $(".right-panel").append(cartView.render().el);


    // Set the Default Views

    curLeft = $('.filters');
    curMid = $('.items-list-view');
    curRight = $('.cart');


    // default click handler for flyout menus

    $("body").click(function (e) {
        $(".flyout").hide();
        headerView.resetLogInModal();
    });
});
