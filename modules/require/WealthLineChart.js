WealthLineChart = {

   initializeWidget: function (parentNode, widgetModel) {
        var ele = document.createElement("div");
        var area = '<div id="linechart"></div>';
        parentNode.innerHTML = area;
        var data = widgetModel.chartData;
        WealthLineChart.modelChange(widgetModel, "Refresh", data);
        WealthLineChart.setDataForWealthLineChart(widgetModel);
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
        WealthLineChart.setDataForWealthLineChart(widgetModel);
    },

   /**
    * setDataForLineChart : used to create a chart widget.
    * @member of {BarChart}
    * @param {widgetModel} /get All monthly data
    * @returns {} update the current chart
    * @throws {} 
    * value -- Used to display the bar width.
    * label --  Used to display the label.
    */

    setDataForWealthLineChart: function (widgetModel) {
      var data = widgetModel.chartData;
      if(Object.keys(data).length !== 0){
         drawFinalDataChart(data.filter, data.xLabels, data.data, data.percentages, data.chartStyle, data.currencySymbol);
//        $(document).ready(
//          drawFinalDataChart.bind(null, data.filter, data.xLabels, data.data, data.percentages, data.chartStyle, data.currencySymbol)
//        );
      }
    }
};