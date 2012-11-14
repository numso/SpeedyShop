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

            return this;
        },

        drawChart: function () {
            this.updateChartItem();
            // console.log(this.chartObject);

            var that = this;
            $.get('/tempSalesChartCall', function(data){
                var months = [];
                for (var i = 0; i < 12; ++i){
                    months[i] = that.getMonthName(i).full;
                }
                var obj = {
                    months: months,
                    data: data
                };

                console.log(obj.data.length);
// SOMETHING WRONG WITH THESE FOR STATEMENTS
                // for (var i = 0; i < obj.data.length; ++i){
                //     console.log('THIS IS HERE' + obj.data[i].data.length);
                //     for (var j = 0; j < obj.data[i].data.length; ++i){
                //         console.log('THIS IS HERE' + obj.data[i].data[j]);
                //         if (obj.data[i].data[j].projectedQuantity < obj.data[i].data[j].actualQuantity){
                //             obj.data[i].data[j].goalMet = true;
                //         } else {
                //             obj.data[i].data[j].goalMet = undefined;
                //         }
                //     }
                // }

                that.$("#" + that.chartID).html(chartTmpl(obj));
            });
        },

        updateChartItem: function () {

            console.log(this.$('#' + this.chartID));

        },

        changeProjected: function (e) {
            var el = this.$('est-projection').closest();
            console.log(el);
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
