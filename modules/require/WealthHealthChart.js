WealthHealthChart = {

   initializeWidget: function (parentNode, widgetModel) {
        var ele = document.createElement("div");
        var area = '<div id="wealthHealthChart" style = "height:100%;  width:100%;"></div>';
        parentNode.innerHTML = area;
        var data = widgetModel.chartData;
        WealthHealthChart.modelChange(widgetModel, "Refresh", data);
        WealthHealthChart.setDataForWealthHealthChart(widgetModel);
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
        WealthHealthChart.setDataForWealthHealthChart(widgetModel);
    },

   /**
    * setDataForWealthHealthChart : used to create a chart widget.
    * @member of {DonutChart}
    * @param {widgetModel} /get All monthly data
    * @returns {} update the current chart
    * @throws {} 
    * value -- Used to display the bar width.
    * label --  Used to display the label.
    */

    setDataForWealthHealthChart: function (widgetModel) {
      var data = widgetModel.chartData;
      if(Object.keys(data).length !== 0){
        // AddWealthChart(data.label, data.value, data.firstColor, data.secondColor);
		
        $(document).ready(
		document.getElementById('wealthHealthChart') ?
          AddWealthChart.bind(null, data.label, data.value, data.firstColor, data.secondColor) : null
        );
      }
    }
};