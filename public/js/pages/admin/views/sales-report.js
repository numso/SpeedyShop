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

        initialize: function () {
        },

        events: {
            'click .show-chart': 'showChart',
            'click .show-graph': 'showGraph',
            'click .graph-month-view': 'showMonthView',
            'click .graph-year-view': 'showYearView',
            'click .graph-prev': 'prevSection',
            'click .graph-next': 'nextSection'
        },

        showChart: function (e) {
            $("#" + this.chartID).show();
            $("." + this.graphID + '-box').hide();
        },

        showGraph: function (e) {
            $("#" + this.chartID).hide();
            $("." + this.graphID + '-box').show();
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
            var curDate = new Date();
            this.status = {
                type: 'month',
                year: curDate.getFullYear(),
                month: curDate.getMonth()
            };
            this.drawMonthGraph();
        },

        showYearView: function (e) {
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
            return this;
        },

        drawChart: function () {
            this.$("#" + this.chartID).html(chartTmpl({
                months: 
                ["January", "Febuary", "March", "April", "May", "June","July"],
                data:
                [
                    {
                        profitP: 1,
                        profitA: 2,
                        dollarsP: 3,
                        dollarsA: 4,
                        itemsP: 5,
                        itemsA: 6
                    },
                    {
                        profitP: 7,
                        profitA: 8,
                        dollarsP: 9,
                        dollarsA: 10,
                        itemsP: 11,
                        itemsA: 12
                    },
                    {
                        profitP: 13,
                        profitA: 14,
                        dollarsP: 15,
                        dollarsA: 16,
                        itemsP: 17,
                        itemsA: 18
                    },
                    {
                        profitP: 19,
                        profitA: 20,
                        dollarsP: 21,
                        dollarsA: 22,
                        itemsP: 23,
                        itemsA: 24
                    },
                    {
                        profitP: 25,
                        profitA: 26,
                        dollarsP: 27,
                        dollarsA: 28,
                        itemsP: 29,
                        itemsA: 30
                    },
                    {
                        profitP: 31,
                        profitA: 32,
                        dollarsP: 33,
                        dollarsA: 34,
                        itemsP: 35,
                        itemsA: 36
                    }
                ]
            }));

        },

        gotFocus: function () {
            this.showMonthView();
            this.drawChart();
        },

        drawYearGraph: function () {
            $("#" + this.graphID).html('');
            var year = this.status.year;
            this.$('.graph-title').html('Sales Report for ' + year);
            var that = this;

            $('.sr-loader').show();
            $.get('/sales/year/' + year, function (d) {
                $('.sr-loader').hide();
                if (d.length === 0) {
                    $('#' + that.graphID).html('No Data Available for this time frame.');
                    return;
                }
                var r = Raphael(that.graphID);
                var labels = [],
                    labelsLong = [[], []],
                    data = [[], []];

                for (var i = 0; i < d.length; ++i) {
                    if (d[i] !== null) {
                        labels.push(that.getMonthName(i).abbr);
                        labelsLong[0].push("Projected: " + d[i].projected + " for " + that.getMonthName(i).full + year);
                        data[0].push(d[i].projected);
                        labelsLong[1].push("Actual: " + d[i].actual + " for " + that.getMonthName(i).full + " " + year);
                        data[1].push(d[i].actual);
                    }
                }

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
            });
        },

        drawMonthGraph: function () {
            $("#" + this.graphID).html('');
            var year = this.status.year,
                month = this.status.month;
            this.$('.graph-title').html('Sales Report for ' + this.getMonthName(month).full + ' ' + year);

            var that = this;

            $('.sr-loader').show();
            $.get('/sales/year/' + year + '/month/' + month, function (d) {
                $('.sr-loader').hide();
                if (d.length === 0) {
                    $('#' + that.graphID).html('No Data Available for this time frame.');
                    return;
                }
                var r = Raphael(that.graphID);
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
