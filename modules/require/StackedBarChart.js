
StackedBarChart = {


       /**
     * initializeWidget : Method for used to Initilize the chart widget.
     * @member of {StackedBarChart}
     * @param {parentNode,widgetModel} /get All monthly data
     * @returns {} draw the chart
     * @throws {} 
     */

    initializeWidget: function (parentNode, widgetModel) {
        var area = '<div id="stacked_barChart_div"></div>';
        parentNode.innerHTML = area;
        google.charts.load('45', { packages: ["corechart"] });
        StackedBarChart.setDataForStackedBarChart(widgetModel);
		var data = widgetModel.chartData;
		StackedBarChart.modelChange(widgetModel, "Refresh", data);
    },

 /**
     * initializeWidget : Method for used to update the chart widget.
     * @member of {StackedBarChart}
     * @param {widgetModel, propertyChanged, propertyValue} /get All monthly data
     * @returns {} update the current chart
     * @throws {} 
     */
    modelChange: function (widgetModel, propertyChanged, propertyValue) {
        StackedBarChart.setDataForStackedBarChart(widgetModel);
    },

     /**
     * setDataForStackedBarChart : used to create a chart widget.
     * @member of {StackedBarChart}
     * @param {widgetModel} /get All monthly data
     * @returns {} update the current chart
     * @throws {} 
     * budget -- Used to display the budget.
     * categoryName --  Used to display the CategoryName.
     * budgetColorCode --  used to display the color of budget.
     * remaningBuget -- Used to display the  remaining budget.
     * remaningBugetColorCode -- used to display the remaning budget.
     */
    setDataForStackedBarChart: function (widgetModel) {
        var data = widgetModel.chartData;
        var dataToShow = [];
                dataToShow.push(['', '', { role: 'style' }, {role: 'tooltip'},'', { role: 'style' },{role: 'tooltip'}]);
        for (i in data) {
            dataToShow.push(
                [data[i].categoryName, data[i].budget, data[i].budgetColorCode,
                 data[i].tooltipText,data[i].remaningBuget, data[i].remaningBugetColorCode,
                 data[i].remainingBudgeTooltipText
                ]
            );
        google.charts.load('45', { packages: ["corechart"] });
        google.charts.setOnLoadCallback(drawChart);
        function drawChart() {
            
            var data = google.visualization.arrayToDataTable(dataToShow);
            var options = widgetModel.chartProperties;
            var chart = new google.visualization.BarChart(document.getElementById('stacked_barChart_div'));
            var listner = function () {
                var selectedItem = chart.getSelection()[0];
                if (selectedItem) {
                    var value = data.getValue(selectedItem.row, 0);
                    widgetModel.OnClickOfBar(value);
                }
            }
            		var getMousePointer = function () {
				 document.getElementById('stacked_barChart_div').style.cursor = "pointer";
            }
			var getMouseDefaultPointer = function () {
				document.getElementById('stacked_barChart_div').style.cursor = "default";
            }
			google.visualization.events.addListener(chart, 'onmouseover', getMousePointer);
            google.visualization.events.addListener(chart, 'onmouseout', getMouseDefaultPointer);
            google.visualization.events.addListener(chart, 'select', listner);
            chart.draw(data, options);
        }
    }
}
}