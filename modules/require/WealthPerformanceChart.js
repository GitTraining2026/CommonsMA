WealthPerformanceChart = {

   initializeWidget: function (parentNode, widgetModel) {
        var ele = document.createElement("div");
        var area = '<div id="wealthPerformanceChart"></div>';
        parentNode.innerHTML = area;
        var data = widgetModel.chartData;
        WealthPerformanceChart.modelChange(widgetModel, "Refresh", data);
        WealthPerformanceChart.setDataForWealthPerformanceChart(widgetModel);
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
        WealthPerformanceChart.setDataForWealthPerformanceChart(widgetModel);
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

    setDataForWealthPerformanceChart: function (widgetModel) {
      var data = widgetModel.chartData;
      if(Object.keys(data).length !== 0){
      //   AddPerformanceLineChart(data.xData, data.portfolioReturn, data.benchmarkReturn, data.filter, data.portfolioColor, data.benchmarkColor);
      $(document).ready(
document.getElementById('wealthPerformanceChart') ?
AddPerformanceLineChart.bind(null, data.xData, data.portfolioReturn, data.benchmarkReturn, data.filter, data.portfolioColor, data.benchmarkColor) : null
);
    }
    }
};