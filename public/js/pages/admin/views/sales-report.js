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
            'click .graph-next': 'nextSection',
            'click .projected-sale': 'changeProjected'
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

        changeProjected: function (e) {
            var el = this.$('est-projection').closest();
            consel.log(el);
        },

        render: function () {
            this.$el.html(salesReportTmpl({
                graphID: this.graphID,
                chartID: this.chartID
            }));
            return this;
        },

        drawChart: function () {
            $("#" + this.graphID).html('');
            var year = this.status.year;
            this.$('.graph-title').html('Sales Report for ' + year);
            var that = this;

            $.get('/sales/year/' + year, function (d) {
                $('.sr-loader').hide();
                if (d.length === 0) {
                    $('#' + that.graphID).html('No Data Available for this time frame.');
                    return;
                }
                var labels = [],
                    data = [[], []];


                for (var i = 0; i < d.length; ++i) {
                    if (d[i] !== null) {
                        labels.push(that.getMonthName(i).abbr);
                        data[0].push(d[i].projected);
                        data[1].push(d[i].actual);
                    }
                };
            });

            this.$("#" + this.chartID).html(chartTmpl({
                months: 
                ["January", "Febuary", "March", "April", "May", "June","July", "Febuary", "March", "April", "May", "June"],
                item:
                [[
                    {
                        profitP: 100,
                        profitA: 200,
                        dollarsP: 3000,
                        dollarsA: 4000,
                        itemsP: 5,
                        itemsA: 6
                    },
                    {
                        profitP: 700,
                        profitA: 800,
                        dollarsP: 9000,
                        dollarsA: 10000,
                        itemsP: 11,
                        itemsA: 12
                    },
                    {
                        profitP: 1300,
                        profitA: 1400,
                        dollarsP: 15000,
                        dollarsA: 16000,
                        itemsP: 17,
                        itemsA: 18
                    },
                    {
                        profitP: 1900,
                        profitA: 2000,
                        dollarsP: 21000,
                        dollarsA: 22000,
                        itemsP: 23,
                        itemsA: 24
                    },
                    {
                        profitP: 2500,
                        profitA: 2600,
                        dollarsP: 27000,
                        dollarsA: 28000,
                        itemsP: 29,
                        itemsA: 30
                    },
                    {
                        profitP: 3100,
                        profitA: 3200,
                        dollarsP: 33000,
                        dollarsA: 34000,
                        itemsP: 35,
                        itemsA: 36
                    }
                ],
                [
                    {
                        profitP: 100,
                        profitA: 200,
                        dollarsP: 3000,
                        dollarsA: 4000,
                        itemsP: 5,
                        itemsA: 6
                    },
                    {
                        profitP: 700,
                        profitA: 800,
                        dollarsP: 9000,
                        dollarsA: 10000,
                        itemsP: 11,
                        itemsA: 12
                    },
                    {
                        profitP: 1300,
                        profitA: 1400,
                        dollarsP: 15000,
                        dollarsA: 16000,
                        itemsP: 17,
                        itemsA: 18
                    },
                    {
                        profitP: 1900,
                        profitA: 2000,
                        dollarsP: 21000,
                        dollarsA: 22000,
                        itemsP: 23,
                        itemsA: 24
                    },
                    {
                        profitP: 2500,
                        profitA: 2600,
                        dollarsP: 27000,
                        dollarsA: 28000,
                        itemsP: 29,
                        itemsA: 30
                    },
                    {
                        profitP: 3100,
                        profitA: 3200,
                        dollarsP: 33000,
                        dollarsA: 34000,
                        itemsP: 35,
                        itemsA: 36
                    }
                ],
                [
                    {
                        profitP: 100,
                        profitA: 200,
                        dollarsP: 3000,
                        dollarsA: 4000,
                        itemsP: 5,
                        itemsA: 6
                    },
                    {
                        profitP: 700,
                        profitA: 800,
                        dollarsP: 9000,
                        dollarsA: 10000,
                        itemsP: 11,
                        itemsA: 12
                    },
                    {
                        profitP: 1300,
                        profitA: 1400,
                        dollarsP: 15000,
                        dollarsA: 16000,
                        itemsP: 17,
                        itemsA: 18
                    },
                    {
                        profitP: 1900,
                        profitA: 2000,
                        dollarsP: 21000,
                        dollarsA: 22000,
                        itemsP: 23,
                        itemsA: 24
                    },
                    {
                        profitP: 2500,
                        profitA: 2600,
                        dollarsP: 27000,
                        dollarsA: 28000,
                        itemsP: 29,
                        itemsA: 30
                    },
                    {
                        profitP: 3100,
                        profitA: 3200,
                        dollarsP: 33000,
                        dollarsA: 34000,
                        itemsP: 35,
                        itemsA: 36
                    },
                    {
                        profitP: 100,
                        profitA: 200,
                        dollarsP: 3000,
                        dollarsA: 4000,
                        itemsP: 5,
                        itemsA: 6
                    },
                    {
                        profitP: 700,
                        profitA: 800,
                        dollarsP: 9000,
                        dollarsA: 10000,
                        itemsP: 11,
                        itemsA: 12
                    },
                    {
                        profitP: 1300,
                        profitA: 1400,
                        dollarsP: 15000,
                        dollarsA: 16000,
                        itemsP: 17,
                        itemsA: 18
                    },
                    {
                        profitP: 1900,
                        profitA: 2000,
                        dollarsP: 21000,
                        dollarsA: 22000,
                        itemsP: 23,
                        itemsA: 24
                    },
                    {
                        profitP: 2500,
                        profitA: 2600,
                        dollarsP: 27000,
                        dollarsA: 28000,
                        itemsP: 29,
                        itemsA: 30
                    },
                    {
                        profitP: 3100,
                        profitA: 3200,
                        dollarsP: 33000,
                        dollarsA: 34000,
                        itemsP: 35,
                        itemsA: 36
                    }
                ],
                [
                    {
                        profitP: 100,
                        profitA: 200,
                        dollarsP: 3000,
                        dollarsA: 4000,
                        itemsP: 5,
                        itemsA: 6
                    },
                    {
                        profitP: 700,
                        profitA: 800,
                        dollarsP: 9000,
                        dollarsA: 10000,
                        itemsP: 11,
                        itemsA: 12
                    },
                    {
                        profitP: 1300,
                        profitA: 1400,
                        dollarsP: 15000,
                        dollarsA: 16000,
                        itemsP: 17,
                        itemsA: 18
                    },
                    {
                        profitP: 1900,
                        profitA: 2000,
                        dollarsP: 21000,
                        dollarsA: 22000,
                        itemsP: 23,
                        itemsA: 24
                    },
                    {
                        profitP: 2500,
                        profitA: 2600,
                        dollarsP: 27000,
                        dollarsA: 28000,
                        itemsP: 29,
                        itemsA: 30
                    },
                    {
                        profitP: 3100,
                        profitA: 3200,
                        dollarsP: 33000,
                        dollarsA: 34000,
                        itemsP: 35,
                        itemsA: 36
                    }
                ],
                [
                    {
                        profitP: 100,
                        profitA: 200,
                        dollarsP: 3000,
                        dollarsA: 4000,
                        itemsP: 5,
                        itemsA: 6
                    },
                    {
                        profitP: 700,
                        profitA: 800,
                        dollarsP: 9000,
                        dollarsA: 10000,
                        itemsP: 11,
                        itemsA: 12
                    },
                    {
                        profitP: 1300,
                        profitA: 1400,
                        dollarsP: 15000,
                        dollarsA: 16000,
                        itemsP: 17,
                        itemsA: 18
                    },
                    {
                        profitP: 1900,
                        profitA: 2000,
                        dollarsP: 21000,
                        dollarsA: 22000,
                        itemsP: 23,
                        itemsA: 24
                    },
                    {
                        profitP: 2500,
                        profitA: 2600,
                        dollarsP: 27000,
                        dollarsA: 28000,
                        itemsP: 29,
                        itemsA: 30
                    },
                    {
                        profitP: 3100,
                        profitA: 3200,
                        dollarsP: 33000,
                        dollarsA: 34000,
                        itemsP: 35,
                        itemsA: 36
                    },
                    {
                        profitP: 100,
                        profitA: 200,
                        dollarsP: 3000,
                        dollarsA: 4000,
                        itemsP: 5,
                        itemsA: 6
                    },
                    {
                        profitP: 700,
                        profitA: 800,
                        dollarsP: 9000,
                        dollarsA: 10000,
                        itemsP: 11,
                        itemsA: 12
                    },
                    {
                        profitP: 1300,
                        profitA: 1400,
                        dollarsP: 15000,
                        dollarsA: 16000,
                        itemsP: 17,
                        itemsA: 18
                    },
                    {
                        profitP: 1900,
                        profitA: 2000,
                        dollarsP: 21000,
                        dollarsA: 22000,
                        itemsP: 23,
                        itemsA: 24
                    },
                    {
                        profitP: 2500,
                        profitA: 2600,
                        dollarsP: 27000,
                        dollarsA: 28000,
                        itemsP: 29,
                        itemsA: 30
                    },
                    {
                        profitP: 3100,
                        profitA: 3200,
                        dollarsP: 33000,
                        dollarsA: 34000,
                        itemsP: 35,
                        itemsA: 36
                    }
                ],
                [
                    {
                        profitP: 100,
                        profitA: 200,
                        dollarsP: 3000,
                        dollarsA: 4000,
                        itemsP: 5,
                        itemsA: 6
                    },
                    {
                        profitP: 700,
                        profitA: 800,
                        dollarsP: 9000,
                        dollarsA: 10000,
                        itemsP: 11,
                        itemsA: 12
                    },
                    {
                        profitP: 1300,
                        profitA: 1400,
                        dollarsP: 15000,
                        dollarsA: 16000,
                        itemsP: 17,
                        itemsA: 18
                    },
                    {
                        profitP: 1900,
                        profitA: 2000,
                        dollarsP: 21000,
                        dollarsA: 22000,
                        itemsP: 23,
                        itemsA: 24
                    },
                    {
                        profitP: 2500,
                        profitA: 2600,
                        dollarsP: 27000,
                        dollarsA: 28000,
                        itemsP: 29,
                        itemsA: 30
                    },
                    {
                        profitP: 3100,
                        profitA: 3200,
                        dollarsP: 33000,
                        dollarsA: 34000,
                        itemsP: 35,
                        itemsA: 36
                    }
                ],
                [
                    {
                        profitP: 100,
                        profitA: 200,
                        dollarsP: 3000,
                        dollarsA: 4000,
                        itemsP: 5,
                        itemsA: 6
                    },
                    {
                        profitP: 700,
                        profitA: 800,
                        dollarsP: 9000,
                        dollarsA: 10000,
                        itemsP: 11,
                        itemsA: 12
                    },
                    {
                        profitP: 1300,
                        profitA: 1400,
                        dollarsP: 15000,
                        dollarsA: 16000,
                        itemsP: 17,
                        itemsA: 18
                    },
                    {
                        profitP: 1900,
                        profitA: 2000,
                        dollarsP: 21000,
                        dollarsA: 22000,
                        itemsP: 23,
                        itemsA: 24
                    },
                    {
                        profitP: 2500,
                        profitA: 2600,
                        dollarsP: 27000,
                        dollarsA: 28000,
                        itemsP: 29,
                        itemsA: 30
                    },
                    {
                        profitP: 3100,
                        profitA: 3200,
                        dollarsP: 33000,
                        dollarsA: 34000,
                        itemsP: 35,
                        itemsA: 36
                    },
                    {
                        profitP: 100,
                        profitA: 200,
                        dollarsP: 3000,
                        dollarsA: 4000,
                        itemsP: 5,
                        itemsA: 6
                    },
                    {
                        profitP: 700,
                        profitA: 800,
                        dollarsP: 9000,
                        dollarsA: 10000,
                        itemsP: 11,
                        itemsA: 12
                    },
                    {
                        profitP: 1300,
                        profitA: 1400,
                        dollarsP: 15000,
                        dollarsA: 16000,
                        itemsP: 17,
                        itemsA: 18
                    },
                    {
                        profitP: 1900,
                        profitA: 2000,
                        dollarsP: 21000,
                        dollarsA: 22000,
                        itemsP: 23,
                        itemsA: 24
                    },
                    {
                        profitP: 2500,
                        profitA: 2600,
                        dollarsP: 27000,
                        dollarsA: 28000,
                        itemsP: 29,
                        itemsA: 30
                    },
                    {
                        profitP: 3100,
                        profitA: 3200,
                        dollarsP: 33000,
                        dollarsA: 34000,
                        itemsP: 35,
                        itemsA: 36
                    }
                ],
                [
                    {
                        profitP: 100,
                        profitA: 200,
                        dollarsP: 3000,
                        dollarsA: 4000,
                        itemsP: 5,
                        itemsA: 6
                    },
                    {
                        profitP: 700,
                        profitA: 800,
                        dollarsP: 9000,
                        dollarsA: 10000,
                        itemsP: 11,
                        itemsA: 12
                    },
                    {
                        profitP: 1300,
                        profitA: 1400,
                        dollarsP: 15000,
                        dollarsA: 16000,
                        itemsP: 17,
                        itemsA: 18
                    },
                    {
                        profitP: 1900,
                        profitA: 2000,
                        dollarsP: 21000,
                        dollarsA: 22000,
                        itemsP: 23,
                        itemsA: 24
                    },
                    {
                        profitP: 2500,
                        profitA: 2600,
                        dollarsP: 27000,
                        dollarsA: 28000,
                        itemsP: 29,
                        itemsA: 30
                    },
                    {
                        profitP: 3100,
                        profitA: 3200,
                        dollarsP: 33000,
                        dollarsA: 34000,
                        itemsP: 35,
                        itemsA: 36
                    }
                ],
                [
                    {
                        profitP: 100,
                        profitA: 200,
                        dollarsP: 3000,
                        dollarsA: 4000,
                        itemsP: 5,
                        itemsA: 6
                    },
                    {
                        profitP: 700,
                        profitA: 800,
                        dollarsP: 9000,
                        dollarsA: 10000,
                        itemsP: 11,
                        itemsA: 12
                    },
                    {
                        profitP: 1300,
                        profitA: 1400,
                        dollarsP: 15000,
                        dollarsA: 16000,
                        itemsP: 17,
                        itemsA: 18
                    },
                    {
                        profitP: 1900,
                        profitA: 2000,
                        dollarsP: 21000,
                        dollarsA: 22000,
                        itemsP: 23,
                        itemsA: 24
                    },
                    {
                        profitP: 2500,
                        profitA: 2600,
                        dollarsP: 27000,
                        dollarsA: 28000,
                        itemsP: 29,
                        itemsA: 30
                    },
                    {
                        profitP: 3100,
                        profitA: 3200,
                        dollarsP: 33000,
                        dollarsA: 34000,
                        itemsP: 35,
                        itemsA: 36
                    }
                ]]
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
                        labelsLong[0].push("Projected: " + d[i].projected + " for " + that.getMonthName(i).full + " " + year);
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
