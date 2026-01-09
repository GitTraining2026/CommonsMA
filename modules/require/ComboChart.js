ComboChart = {

    /**
  * initializeWidget : Method for used to Initilize the chart widget.
  * @member of {ComboChart}
  * @param {parentNode,widgetModel} /get All monthly data
  * @returns {} draw the chart
  * @throws {} 
  */

    initializeWidget: function (parentNode, widgetModel) {
        var area = '<div id="comboChart_div"></div>';
        parentNode.innerHTML = area;
        google.charts.load('45', { packages: ["corechart"] });
        var data = widgetModel.chartData;
        ComboChart.modelChange(widgetModel, "Refresh", data);
        ComboChart.setDataForComboChart(widgetModel);
    },

    /**
    * modelChange : Method for used to update the chart widget.
    * @member of {ComboChart}
    * @param {widgetModel, propertyChanged, propertyValue} /get All monthly data
    * @returns {} update the current chart
    * @throws {} 
    */

    modelChange: function (widgetModel, propertyChanged, propertyValue) {
        ComboChart.setDataForComboChart(widgetModel);
    },

    /**
    * setDataForComboChart : used to create a chart widget.
    * @member of {ComboChart}
    * @param {widgetModel} /get All monthly data
    * @returns {} update the current chart
    * @throws {} 
    * value -- Used to display the bar width.
    * label --  Used to display the label.
    */

    setDataForComboChart: function (widgetModel) {
        google.charts.load('45', { packages: ["corechart"] });
        var data = widgetModel.chartData;
		var selectedBarData = data;
        var dataToShow = [];
        dataToShow.push(['', '','','']);
        for (var i in data) {
            dataToShow.push(
                [data[i].month,data[i].label1,data[i].label2,data[i].label3]
            );
        }
        google.charts.setOnLoadCallback(drawChart);
        function drawChart() {
            var data = google.visualization.arrayToDataTable(dataToShow);
            var options = widgetModel.chartProperties;
            var chart = new google.visualization.ComboChart(document.getElementById('comboChart_div'));
            var listner = function () {
                var selectedItem = chart.getSelection()[0];
                if (selectedItem) {
					widgetModel.OnClickOfBar(selectedBarData[selectedItem.row].Value);
                }
            }
            var getMousePointer = function () {
				 document.getElementById('comboChart_div').style.cursor = "pointer";
            }
			var getMouseDefaultPointer = function () {
				document.getElementById('comboChart_div').style.cursor = "default";
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