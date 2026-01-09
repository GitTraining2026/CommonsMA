BarChart = {

    /**
  * initializeWidget : Method for used to Initilize the chart widget.
  * @member of {BarChart}
  * @param {parentNode,widgetModel} /get All monthly data
  * @returns {} draw the chart
  * @throws {} 
  */

    initializeWidget: function (parentNode, widgetModel) {
        var area = '<div id="barChart_div"></div>';
        parentNode.innerHTML = area;
        google.charts.load('45', { packages: ["corechart"] });
        var data = widgetModel.chartData;
        BarChart.modelChange(widgetModel, "Refresh", data);
        BarChart.setDataForBarChart(widgetModel);
    },

    /**
    * modelChange : Method for used to update the chart widget.
    * @member of {BarChart}
    * @param {widgetModel, propertyChanged, propertyValue} /get All monthly data
    * @returns {} update the current chart
    * @throws {} 
    */

    modelChange: function (widgetModel, propertyChanged, propertyValue) {
        BarChart.setDataForBarChart(widgetModel);
    },

    /**
    * setDataForBarChart : used to create a chart widget.
    * @member of {BarChart}
    * @param {widgetModel} /get All monthly data
    * @returns {} update the current chart
    * @throws {} 
    * value -- Used to display the bar width.
    * label --  Used to display the label.
    */

    setDataForBarChart: function (widgetModel) {
        google.charts.load('45', { packages: ["corechart"] });
        var data = widgetModel.chartData;
		var selectedBarData = data;
        var dataToShow = [];
        dataToShow.push(['', '',{role:'annotation'},{role: 'tooltip'}]);
        for (i in data) {
            dataToShow.push(
                [data[i].label, data[i].Value,data[i].annotationText,data[i].tooltipText]
            );
        }
        google.charts.setOnLoadCallback(drawChart);
        function drawChart() {
            var data = google.visualization.arrayToDataTable(dataToShow);
            var options = widgetModel.chartProperties;
            var chart = new google.visualization.BarChart(document.getElementById('barChart_div'));
            var listner = function () {
                var selectedItem = chart.getSelection()[0];
                if (selectedItem) {
					widgetModel.OnClickOfBar(selectedBarData[selectedItem.row].monthId);
                }
            }
            var getMousePointer = function () {
				 document.getElementById('barChart_div').style.cursor = "pointer";
            }
			var getMouseDefaultPointer = function () {
				document.getElementById('barChart_div').style.cursor = "default";
            }
            google.visualization.events.addListener(chart, 'select', listner);
			google.visualization.events.addListener(chart, 'onmouseover', getMousePointer);
            google.visualization.events.addListener(chart, 'onmouseout', getMouseDefaultPointer);
            if(data.Tf)
			{
			  if(data.Tf.length !==0)
		      chart.draw(data, options);
			}
        }
    }
}