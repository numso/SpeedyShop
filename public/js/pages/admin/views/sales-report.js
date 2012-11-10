/*global define */

define([
    'backbone',
    'tmpl!pages/admin/templates/sales-report'
    // 'raphael',
    // 'popup',
    // 'raphalytics'
], function (
    Backbone,
    salesReportTmpl
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
            return this;
        },

        drawGraph: function () {
            var that = this;

            $.get('/sales/year/2012/month/0', function (d) {
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
