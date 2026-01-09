WealthDonut = {

   initializeWidget: function (parentNode, widgetModel) {
        var ele = document.createElement("div");
        var area = '<div id="donutchart"></div>';
        parentNode.innerHTML = area;
        var data = widgetModel.chartData;
        WealthDonut.modelChange(widgetModel, "Refresh", data);
        WealthDonut.setDataForWealthDonut(widgetModel);
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
        WealthDonut.setDataForWealthDonut(widgetModel);
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

    setDataForWealthDonut: function (widgetModel) {
		  var data = widgetModel.chartData;
		  if(data != ''){
            $(document).ready(AddDonutChart.bind(null,data.data1,data.data2,data.data3,data.data4,data.colors,data.tooltip));
		  }
    }
};