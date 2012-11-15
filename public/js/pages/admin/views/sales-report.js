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
        status: undefined,
        analyticsData: undefined,

        events: {
            'click .show-chart': 'showChart',
            'click .show-graph': 'showGraph',

            'click .graph-month-view': 'showMonthView',
            'click .graph-year-view': 'showYearView',
            'click .graph-prev': 'prevSection',
            'click .graph-next': 'nextSection',

            'click .graph-quantity': 'drawQuantityGraph',
            'click .graph-gross': 'drawGrossGraph',
            'click .graph-net': 'drawNetGraph'

//            'click .projected-sale': 'changeProjected'
        },

        render: function () {
            this.$el.html(salesReportTmpl());
            return this;
        },

        loadScreen: function () {
            var that = this,
                curDate = new Date();

            this.$('.graph-year-view').removeClass('selected');
            this.$('.graph-month-view').addClass('selected');
            this.$('.graph-quantity').addClass('selected');
            this.$('.graph-gross').removeClass('selected');
            this.$('.graph-net').removeClass('selected');

            this.status = {
                type: 'month',
                salesType: 'quantity',
                year: curDate.getFullYear(),
                month: curDate.getMonth()
            };

            this.loadData(function () {
                that.drawGraph();
            });

            this.drawChart();
        },

        showChart: function (e) {
            this.$('.show-graph').removeClass('selected');
            this.$('.show-chart').addClass('selected');
            this.$("#sales-chart").show();
            this.$("." + this.graphID + '-box').hide();
        },

        showGraph: function (e) {
            this.$('.show-chart').removeClass('selected');
            this.$('.show-graph').addClass('selected');
            this.$("#sales-chart").hide();
            this.$("." + this.graphID + '-box').show();
        },

        drawQuantityGraph: function (e) {
            this.$('.graph-quantity').addClass('selected');
            this.$('.graph-gross').removeClass('selected');
            this.$('.graph-net').removeClass('selected');

            this.status.salesType = 'quantity';
            this.drawGraph();
        },

        drawGrossGraph: function (e) {
            this.$('.graph-quantity').removeClass('selected');
            this.$('.graph-gross').addClass('selected');
            this.$('.graph-net').removeClass('selected');

            this.status.salesType = 'gross';
            this.drawGraph();
        },

        drawNetGraph: function (e) {
            this.$('.graph-quantity').removeClass('selected');
            this.$('.graph-gross').removeClass('selected');
            this.$('.graph-net').addClass('selected');

            this.status.salesType = 'net';
            this.drawGraph();
        },

        prevSection: function (e) {
            var that = this;

            if (this.status.type === 'month') {
                --this.status.month;
                if (this.status.month < 0) {
                    this.status.month = 11;
                    --this.status.year;
                }
            } else {
                --this.status.year;
            }

            this.loadData(function () {
                that.drawGraph();
            });
        },

        nextSection: function (e) {
            var that = this;

            if (this.status.type === 'month') {
                ++this.status.month;
                if (this.status.month > 11) {
                    this.status.month = 0;
                    ++this.status.year;
                }
            } else {
                ++this.status.year;
            }

            this.loadData(function () {
                that.drawGraph();
            });
        },

        showMonthView: function (e) {
            var that = this;

            this.$('.graph-year-view').removeClass('selected');
            this.$('.graph-month-view').addClass('selected');

            var curDate = new Date();
            this.status.type = 'month';
            this.status.year = curDate.getFullYear();
            this.status.month = curDate.getMonth();

            this.loadData(function () {
                that.drawGraph();
            });
        },

        showYearView: function (e) {
            var that = this;

            this.$('.graph-month-view').removeClass('selected');
            this.$('.graph-year-view').addClass('selected');

            var curDate = new Date();
            this.status.type = 'year';
            this.status.year = curDate.getFullYear();
            this.status.month = curDate.getMonth();

            this.loadData(function () {
                that.drawGraph();
            });
        },

        loadData: function (cb) {
            var that = this;

            var year = this.status.year,
                month = this.status.month;

            this.$('.sr-loader').show();
            this.$("#" + this.graphID).hide();

            if (this.status.type === "month") {
                $.get('/sales/year/' + year + '/month/' + month, function (d) {
                    that.analyticsData = d;
                    that.$('.sr-loader').hide();
                    that.$("#" + that.graphID).show();
                    cb();
                });
            } else {
                $.get('/sales/year/' + year, function (d) {
                    that.analyticsData = d;
                    that.$('.sr-loader').hide();
                    that.$("#" + that.graphID).show();
                    cb();
                });
            }
        },

        drawGraph: function () {
            var type = this.status.type,
                year = this.status.year,
                month = this.status.month;

            var labels = [],
                labelsLong = [[], []],
                data = [[], []];

            var d = this.analyticsData;

            this.$("#" + this.graphID).html('');

            if (type === "month") {
                this.$('.graph-title').html('Sales Report for ' + this.getMonthName(month).full + ' ' + year);
            } else {
                this.$('.graph-title').html('Sales Report for ' + year);
            }

            if (d.length === 0) {
                this.$('#' + this.graphID).html('No Data Available for this time frame.');
                return;
            }

            if (type === "month") {
                for (var i = 0; i < d.length; ++i) {
                    if (d[i] !== null) {
                        var p = d[i][this.status.salesType + "P"];
                        var a = d[i][this.status.salesType + "A"]
                        labels.push(i);
                        labelsLong[0].push("Projected: " + p + " for " + this.getMonthName(month).full + " " + i + " " + year);
                        labelsLong[1].push("Actual: " + a + " for " + this.getMonthName(month).full + " " + i + " " + year);
                        data[0].push(p);
                        data[1].push(a);
                    }
                }
            } else {
                for (var i = 0; i < d.length; ++i) {
                    if (d[i] !== null) {
                        var p = d[i][this.status.salesType + "P"];
                        var a = d[i][this.status.salesType + "A"]
                        labels.push(this.getMonthName(i).abbr);
                        labelsLong[0].push("Projected: " + p + " for " + this.getMonthName(i).full + " " + year);
                        labelsLong[1].push("Actual: " + a + " for " + this.getMonthName(i).full + " " + year);
                        data[0].push(p);
                        data[1].push(a);
                    }
                }
            }

            this.makeGraph(data, labels, labelsLong);
        },

        drawChart: function () {
            var that = this;
            $.get('/getCategories', function (cats) {
                $.get('/sales/year/2012', function (data){

                    var months = [];
                    for (var i = 0; i < 12; ++i){
                        months[i] = that.getMonthName(i).full;
                    }

                    var items = [];
                    for (var j = 0; j < cats.length; ++j) {
                        if (cats[j].title !== "Hot Items") {
                            items.push({
                                cat: cats[j].title,
                                items: data,
                                odd: (j % 2 === 1)
                            });
                        }
                    }

                    var obj = {
                        months: months,
                        items: items
                    };

                    that.$("#sales-chart").html(chartTmpl(obj));

                    var allCells = that.$('.littl-cell');
                    for (var k = 0; k < allCells.length; ++k) {
                        var cell = $(allCells[k]),
                            p = parseInt(cell.find('input').val(), 10),
                            a = parseInt(cell.find('span').text(), 10);

                        if (a < p) {
                            cell.css('background-color', '#f5a4a4');
                        } else {
                            cell.css('background-color', '#7c7ce9');
                        }
                    }
                });
            });
        },

        // changeProjected: function (e) {
        //     var el = this.$('est-projection').closest();
        //     console.log(el);
        // },

        makeGraph: function (data, labels, labelsLong) {
            var r = Raphael(this.graphID);
            r.raphalytics(data, labels, labelsLong, {
                'width': 800,
                'height': 200,
                'color': ['#f00', '#00f'],
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
