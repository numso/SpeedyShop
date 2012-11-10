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

        initialize: function () {
        },

        events: {
            'click .show-chart': 'showChart',
            'click .show-graph': 'showGraph'
        },

        showChart: function (e) {
            $("#" + this.chartID).show();
            $("#" + this.graphID).hide();
        },

        showGraph: function (e) {
            $("#" + this.chartID).hide();
            $("#" + this.graphID).show();
        },

        render: function () {
            this.$el.html(salesReportTmpl({
                graphID: this.graphID,
                chartID: this.chartID
            }));
            this.drawGraph();
            this.drawChart();
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

        drawGraph: function () {
            var that = this;

            $.get('/sales', function (d) {
                $('.sr-loader').hide();
                var r = Raphael(that.graphID);
                var labels = [],
                    labelsLong = [[], []],
                    data = [[], []];

                for (var i = 0; i < d.length; ++i) {
                    if (d[i] !== null) {
                        labels.push(i);
                        labelsLong[0].push("Projected: " + d[i].projected + " for January " + i + " 2012");
                        data[0].push(d[i].projected)
                        labelsLong[1].push("Actual: " + d[i].actual + " for January " + i + " 2012");
                        data[1].push(d[i].actual)
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
        }
    });
});
