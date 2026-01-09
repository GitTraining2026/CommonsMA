DonutChart = {

	   /**
  * initializeWidget : Method for used to Initilize the chart widget.
  * @member of {DonutChart}
  * @param {parentNode,widgetModel} /get All monthly data
  * @returns {} draw the chart
  * @throws {} 
  */

    initializeWidget: function (parentNode, widgetModel) {
        var ele = document.createElement("div");
        var area = '<div id="chart_div_'+widgetModel.id+'" align=top></div>';
        parentNode.innerHTML = area;
        google.charts.load('45', { packages: ["corechart"] });
        var data = widgetModel.chartData;
        DonutChart.modelChange(widgetModel, "Refresh", data);
        DonutChart.setDataForDonutChart(widgetModel);
    },

     /**
    * modelChange : Method for used to update the chart widget.
    *  Event faired widgetModel propertyChanged
    * @member of {BarChart}
    * @param {widgetModel, propertyChanged, propertyValue} /get All monthly data
    * @returns {} update the current chart
    * @throws {} 
    */

    modelChange: function (widgetModel, propertyChanged, propertyValue) {
        DonutChart.setDataForDonutChart(widgetModel);
    },

   /**
    * setDataForDonutChart : used to create a chart widget.
    * @member of {BarChart}
    * @param {widgetModel} /get All monthly data
    * @returns {} update the current chart
    * @throws {} 
    * value -- Used to display the bar width.
    * label --  Used to display the label.
    */

    setDataForDonutChart: function (widgetModel) {
        google.charts.load('45', { packages: ["corechart"] });
        var data = widgetModel.chartData;
        var dataToShow = [];
        dataToShow.push(['Task', 'Hours']);
        for (i in data) {
            dataToShow.push(
                [data[i].label, data[i].Value]
            );
        }
        google.charts.setOnLoadCallback(drawChart);
        function drawChart() {
            var data = google.visualization.arrayToDataTable(dataToShow);
            var options = widgetModel.chartProperties;
            var chart = new google.visualization.PieChart(document.getElementById('chart_div_'+widgetModel.id));
            var listner = function () {
                var selectedItem = chart.getSelection()[0];
                if (selectedItem) {
                    var value = data.getValue(selectedItem.row, 0);
                    widgetModel.OnClickOfPie(value);
                }
            }
			var getMousePointer = function () {
				 document.getElementById('chart_div_'+widgetModel.id).style.cursor = "pointer";
            }
			var getMouseDefaultPointer = function () {
				document.getElementById('chart_div_'+widgetModel.id).style.cursor = "default";
            }
            google.visualization.events.addListener(chart, 'select', listner);
			google.visualization.events.addListener(chart, 'onmouseover', getMousePointer);
            google.visualization.events.addListener(chart, 'onmouseout', getMouseDefaultPointer);
            chart.draw(data, options);
        }
    }
}