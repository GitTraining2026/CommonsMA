/**
 * @module LoggerManager
 */
  define([], function() {
/**
  * Logger Manager used to print the Application Logs & Sends CustomMetric data to generate Reports
  * @alias module:LoggerManager
  * @class
  */
function LoggerManager(){
};
inheritsFrom(LoggerManager, kony.mvc.Business.Delegator);
LoggerManager.prototype.initializeBusinessController = function(){};
/**
  * Prints the application Logs in console
  * @param {string} message consists of error logs
  */
LoggerManager.prototype.log = function(message) {
	if(message === null || message === undefined || message === "") {
		return;
	}
		 var timestamp = applicationManager.getFormatUtilManager().getTimeStamp();
		kony.print(timestamp+" : "+message);
};
/**
  * Function to set user ID  for Reports
  * @param {string} username consists of username
  */
LoggerManager.prototype.setUserID = function(username) {
	kony.setUserID(username);
};
/**
  * Function to send the CustomMetric Data for Reports
  * @param {string} Modulename consists of Application modulename to generate Reports
  */
LoggerManager.prototype.sendCustomMetrics = function(Modulename) {
  // Custom Metrices Names List Need to Add in MF- TransferStatus,TransferAverageAmount,P2PStatus,P2PAverageAmount,paymentType,PayBillStatus,P2PAverageAmount
    switch(Modulename){
    case "TRANSFERS":
          var Transferamount = applicationManager.getTransactionManager();
          var amount = Transferamount.getAmount();
          KNYMetricsService.sendCustomMetrics("frmConfirmTransferCD",[{"TransferStatus":"Domestic Transfer","paymentType":"Transfers","TransferAverageAmount": parseInt(amount)}]);
      break;
    case "PAYAPERSON":
          var P2Pamount = applicationManager.getTransactionManager();
          var amount = P2Pamount.getAmount();
          KNYMetricsService.sendCustomMetrics("frmConfirmTransferCD",[{"P2PStatus":"P2P Transfers","paymentType":"P2P Payment","P2PAverageAmount": parseInt(amount)}]);
       break;
    case "BILLPAY":
          var BillPayamount = applicationManager.getTransactionManager();
          var amount = BillPayamount.getAmount();
          KNYMetricsService.sendCustomMetrics("frmConfirmTransferCD",[{"PayBillStatus":"Bill Payments","paymentType":"Bill Pay","payBillAverageAmount": parseInt(amount)}]);
       break;
    case "CHECKDEPOSIT":
           KNYMetricsService.sendCustomMetrics("frmConfirmTransferCD", [{"ChequeDepositStatus":"Success"}]);
       break;
    default:
        break;
  }
};
/**
  * Function to call Custom Metric API for Reports
   * @param {object} view - object of form
   * @param {boolean} isDirectMarketingMetric - contains data whether the metric being sent is of Direct Marekting or not
   * @param {string} metricName - if isDirectMarketingMetric is true, this holds the metric name
  */
 LoggerManager.prototype.setCustomMetrics = function(view, isDirectMarketingMetric, metricName){
   var configManager = applicationManager.getConfigurationManager();
   if(configManager.isCustomMetricsEnabled()){
   var self = this;
   var data = {};
   if(isDirectMarketingMetric){
     data = self.getParamsForDMAnalytics(view,metricName);
     KNYMetricsService.sendCustomMetrics(data.formId, data.metricName);
   }else{
         data = self.getParamsForAnalytics(view, metricName);
         KNYMetricsService.sendCustomMetrics(data.formId, data.moduleName);
     }
    }
    };
/**
  * Function to get FormID & Module Name of the Form
  * @param {object} view object of form
  * param {string} metricName consists of Name used for App Usage Reports
  * @returns {JSON} - consisting of 2 keys formId and moduleName of the module whose metrics are being sent
  */
 LoggerManager.prototype.getParamsForAnalytics = function(view, metricName){
        var data = view.viewId.split("/");
        return {
            formId:data[1],
            moduleName:{"Accessed Modules":metricName, "Ages":this.getAgeGroup()}
        }
    };
 /**
  * Function to set Metric Name & to get FormID for Direct Marketing Reprots
  * @param {object} view object of form
  * @param {string} metricName consists of Name used for Directmarketing Reports
  * @returns {JSON} - consisting of 2 keys formId and metricName of the module whose metrics are being sent
  */
 LoggerManager.prototype.getParamsForDMAnalytics = function(view,metricName){
        var data = view.viewId.split("/");
        return {
            formId:data[1],
            metricName:{"DirectMarketingCM":metricName}
        }
    };
 /**
    * Method to fetch age group for Custom Metric analytics
    * @return {String} age Group the user belongs to
    */
  LoggerManager.prototype.getAgeGroup = function(){
   var userObj = applicationManager.getUserPreferencesManager();
   var dob = userObj.getUserDOB();
   dob = dob.substring(0, 10);
   var currDateValue = new Date();
   var dobArray = dob.split('-');
   var userDOB = new Date(dobArray[0], dobArray[1] - 1, dobArray[2]);
   var age = currDateValue.getFullYear() - userDOB.getFullYear();
   var m = currDateValue.getMonth() - userDOB.getMonth();
    if (m < 0 || (m === 0 && currDateValue.getDate() < userDOB.getDate())) {
        age--;
    }
    if (age > 0 && age <= 20) {
            return "0-20";
        } else if (age > 20 && age <= 35) {
            return "20-35";
        } else if (age > 35 && age <= 45) {
            return "35-45";
        } else if (age > 45 && age <= 55) {
            return "45-55";
        } else if (age > 55 && age <= 70) {
            return "55-70";
        } else if (age > 70) {
            return ">70";
        }
 }
return LoggerManager;
});