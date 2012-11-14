/*global define */

define([
    'backbone',
    'tmpl!pages/admin/templates/sales-report',
    'tmpl!pages/admin/templates/salesReport/charts'
    // 'raphael',
    // 'popup',
    // 'raphalytics'
], function (
    Backbone,
    salesReportTmpl,
    chartTmpl
    // Raphael
) {
    return Backbone.View.extend({
        graphID: 'sales-graph',
        chartID: 'sales-chart',
        status: {},
        rawItemsData: undefined,
        rawSalesData: undefined,
        itemData:{
                profitP: 0,
                profitA: 0,
                dollarsP: 0,
                dollarsA: 0,
                itemsP: 0,
                itemsA: 0
            },
        chartObject:{
            months: ["January", "Febuary", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"],
            item: [
                {
                    chartCat: [],
                    chartData:[] // one object for each month
                }
            ]
        },

        events: {
            'click .show-chart': 'showChart',
            'click .show-graph': 'showGraph',
            'click .graph-month-view': 'showMonthView',
            'click .graph-year-view': 'showYearView',
            'click .graph-prev': 'prevSection',
            'click .graph-next': 'nextSection',
            'click .projected-sale': 'changeProjected',
        },

        showChart: function (e) {
            this.$('.show-graph').removeClass('selected');
            this.$('.show-chart').addClass('selected');
            this.$("#" + this.chartID).show();
            this.$("." + this.graphID + '-box').hide();
        },

        showGraph: function (e) {
            this.$('.show-chart').removeClass('selected');
            this.$('.show-graph').addClass('selected');
            this.$("#" + this.chartID).hide();
            this.$("." + this.graphID + '-box').show();
        },

        prevSection: function (e) {
            if (this.status.type === 'month') {
                --this.status.month;
                if (this.status.month < 0) {
                    this.status.month = 11;
                    --this.status.year;
                }
                this.drawMonthGraph();
            } else {
                --this.status.year;
                this.drawYearGraph();
            }
        },

        nextSection: function (e) {
            if (this.status.type === 'month') {
                ++this.status.month;
                if (this.status.month > 11) {
                    this.status.month = 0;
                    ++this.status.year;
                }
                this.drawMonthGraph();
            } else {
                ++this.status.year;
                this.drawYearGraph();
            }
        },

        showMonthView: function (e) {
            this.$('.graph-year-view').removeClass('selected');
            this.$('.graph-month-view').addClass('selected');

            var curDate = new Date();
            this.status = {
                type: 'month',
                year: curDate.getFullYear(),
                month: curDate.getMonth()
            };
            this.drawMonthGraph();
        },

        showYearView: function (e) {
            this.$('.graph-month-view').removeClass('selected');
            this.$('.graph-year-view').addClass('selected');

            var curDate = new Date();
            this.status = {
                type: 'year',
                year: curDate.getFullYear(),
                month: curDate.getMonth()
            };
            this.drawYearGraph();
        },

        render: function () {
            this.$el.html(salesReportTmpl({
                graphID: this.graphID,
                chartID: this.chartID
            }));

            var that = this;
            $.get('/itemList', function(data){
                 that.rawItemsData = JSON.parse(data);
            });

            $.get('/test', function(data){
                that.rawSalesData = JSON.parse(data);
            });

            return this;
        },




        drawChart: function () {
            //this.rawItemsData
            //this.initialize();
            this.updateChartItem();
            console.log(this.chartObject);
            this.$("#" + this.chartID).html(chartTmpl(this.chartObject));
        },

        /*
        Dallin we need a function for this from the server
        I will try and do it myself but may need your help

        Object {
            item1: [ array of time variable (Year, Month)]
            item2: [array of objects (One object for each time interval)
                {Object with 2 items () 
                    chartCat:
                    ChartData:[][ 
                                { (Jan)
                                    profitA:
                                    profitP:
                                    salesA:
                                    salesP:
                                    itemsA:
                                    itemsP:
                                },
                                { (Feb)
                                    profitA:
                                    profitP:
                                    salesA:
                                    salesP:
                                    itemsA:
                                    itemsP:
                                },{...},{...},{...},{...},{...},{...},{...},{...},{...}
                    ]
                }
            ]
        }
        */

        updateChartItem: function () {
            var itemsById = [];
            var obj = this.rawItemsData;
            console.log(obj.length);
            for (var i = 0; i < obj.length; ++i){
                var index = obj[i].id;
                itemsById[index] = {
                    id: obj[i].id,
                    price: obj[i].price,
                    //THIS NEEDS TO BE REVISITED WHEN WE GET THE COST ENTERED INTO THE ITEMS.JSON
                    profit: obj[i].price/2,
                    name:obj[i].name,
                    chartCat:obj[i].cat[0],
                    chartData: []
                };
            }

            var that = this;
            var createObjects = function () {
                var arr = [];
                for (var h = 0; h < 8; ++h){
                    arr[h] = [];
                    for (var i = 0; i < 12; ++i){
                        arr[h][i] = that.itemData;
                    }
                }
                return arr;
            };

            var catType = ["Home", "Electronics", "Clothing", "Jewelry", "Books", "Automobiles","Toys", "Sports"];

            this.chartObject = {
                months: ["January", "Febuary", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"],
                item: [
                    {
                        chartCat: catType,
                        chartData: createObjects()
                    }
                ]
            };

            for (i = 0; i < this.rawSalesData.length; ++i){
                var obj = this.rawSalesData[i];
                for (var j = 0; j < this.rawSalesData[i].items.length; ++j){
                    var index = obj.items[j].id;
                    var itemProfit = itemsById[index].price/2;//////////Update Here TOOO
                    var itemPrice = itemsById[index].price;
                    var proj = obj.items[j].projected;
                    var act = obj.items[j].actual;
                    var cat = itemsById[index].chartCat;
                    var d = new Date (obj.timestamp);
                    var myMonth = d.getMonth();

                    //THIS SHOULD WORK TO UPDATE THE CHARTOBJECT ITEM THAT IS USED IN HANDLEBARS
                    var tName = this.chartObject.item[0].chartData[myMonth][cat];
                    tName.profitP += (itempProfet * proj);
                    tName.profitA += (itempProfet * act);
                    tName.dollarsP += (itempPrice * proj);
                    tName.dollarsA += (itempPrice * act);
                    tName.itemsP += (proj);
                    tName.itemsA += (act);

                    
                }

                    // console.log(this.chartObject.item[0].chartData[myMonth][cat]);
            }
                    // console.log (obj.timestamp);


            //NOT WORKING STUPID THING
        //     for (i = 0; i < this.rawSalesData.length; ++i){
        //         var obj = this.rawSalesData;
        //         var index = obj[i].items[0].id;
        //         var proj = obj[i].items[0].projected;
        //         var act = obj[i].items[0].actual;
        //         var itemCost = 5;//////////////NEED TO UPDATE HERE TOO
        //         var itemPrice = byID[index].price;
        //         var tempObj = {
        //             timestamp: obj[i].timestamp,
        //             project: proj,
        //             actual: act,
        //             profitP: (itemPrice-itemCost)*proj,
        //             profitA: (itemPrice-itemCost)*act,
        //             dollarsP: (itemPrice)*proj,
        //             dollarsA: (itemPrice)*act,
        //             itemsP: proj,
        //             itemsA: act
        //         };
        //         byID[index].chartData.push(tempObj);
        //     }
        //     this.chartObject.months = ["January", "Febuary", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
        //     var tempFunc = function () {
        //         var tempObj = []
        //         for (var j = 0; j < byID[i].chartData.length; ++j){
        //             tempObj[j] = (byID[i].chartData[j]);
        //         }
        //         return tempObj;
        //     };

        //     for (i = 0; i < byID.length; ++i){
        //         //if (!this.chartObject){
        //             this.chartObject[i] = {
        //             item: [
        //                 {
        //                     chartCat:byID[i].chartCat,
        //                     chartData: [tempFunc()]
        //                 }
        //             ]
        //         }
        //     }
        //         // console.log(this.chartObject);
        },

        changeProjected: function (e) {
            var el = this.$('est-projection').closest();
            consel.log(el);
        },

        gotFocus: function () {
            this.showMonthView();
            this.drawChart();
        },

        drawYearGraph: function () {
            var that = this,
                year = this.status.year;

            this.$("#" + this.graphID).html('');
            this.$("#" + this.graphID).hide();
            this.$('.sr-loader').show();
            this.$('.graph-title').html('Sales Report for ' + year);

            $.get('/sales/year/' + year, function (d) {
                that.$('.sr-loader').hide();
                that.$("#" + that.graphID).show();
                if (d.length === 0) {
                    that.$('#' + that.graphID).html('No Data Available for this time frame.');
                    return;
                }

                var labels = [],
                    labelsLong = [[], []],
                    data = [[], []];

                for (var i = 0; i < d.length; ++i) {
                    if (d[i] !== null) {
                        labels.push(that.getMonthName(i).abbr);
                        labelsLong[0].push("Projected: " + d[i].projected + " for " + that.getMonthName(i).full + " " + year);
                        data[0].push(d[i].projected);
                        labelsLong[1].push("Actual: " + d[i].actual + " for " + that.getMonthName(i).full + " " + year);
                        data[1].push(d[i].actual);
                    }
                }

                that.makeGraph(data, labels, labelsLong);
            });
        },

        drawMonthGraph: function () {
            var that = this,
                year = this.status.year,
                month = this.status.month;

            this.$("#" + this.graphID).html('');
            this.$("#" + this.graphID).hide();
            this.$('.sr-loader').show();
            this.$('.graph-title').html('Sales Report for ' + this.getMonthName(month).full + ' ' + year);

            $.get('/sales/year/' + year + '/month/' + month, function (d) {
                that.$('.sr-loader').hide();
                that.$("#" + that.graphID).show();
                if (d.length === 0) {
                    $('#' + that.graphID).html('No Data Available for this time frame.');
                    return;
                }

                var labels = [],
                    labelsLong = [[], []],
                    data = [[], []];

                for (var i = 0; i < d.length; ++i) {
                    if (d[i] !== null) {
                        labels.push(i);
                        labelsLong[0].push("Projected: " + d[i].projected + " for " + that.getMonthName(month).full + " " + i + " " + year);
                        data[0].push(d[i].projected);
                        labelsLong[1].push("Actual: " + d[i].actual + " for " + that.getMonthName(month).full + " " + i + " " + year);
                        data[1].push(d[i].actual);
                    }
                }
                that.makeGraph(data, labels, labelsLong);
            });
        },

        makeGraph: function (data, labels, labelsLong) {
            var r = Raphael(this.graphID);
            r.raphalytics(data, labels, labelsLong, {
                'width': 800,
                'height': 200,
                'color': ['#f00', '#0f0'],
                'y_labels_number': 10,
                'y_labels_position': 'outside',
                'y_label_0': true,
                'fill': true,
                'gridtype': 'full_grid'
            });
        },

        getMonthName: function (id) {
            var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            var monthAbbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return {
                full: monthNames[id],
                abbr: monthAbbr[id]
            };
        }
    });
});
