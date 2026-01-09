/**
*@module PresentationInterruptHandler
 */
define([], function () {
  /**
   * PresentationInterruptHandler consists of all methods to handle and present interuptions from backend
   *@alias module:PresentationInterruptHandler
   *@class
   */
  function PresentationInterruptHandler() {
    scope_interrupt=this;
  	/**@member {string} alertStatus sets alert status for implementation of showErrorMessage method*/
    scope_interrupt.alertStatus = false;
  }
  inheritsFrom(PresentationInterruptHandler, kony.mvc.Business.Delegator);
  PresentationInterruptHandler.prototype.initializeBusinessController = function() {     };
  /**
  * Function used to communicate error handling from server to presentation layer.
  * @params {String} handleMode , mode from which response is comming.
  * @params {Object} err, error response form server
  */
  PresentationInterruptHandler.prototype.showErrorMessage=function(handleMode,err){
    var alertCallback;
    if (handleMode == "postLogin")
      alertCallback = appLogout;
    else if (handleMode == "appLaunch")
      alertCallback = appExit;
    else if (handleMode == "preLogin"){
      alertCallback = appHoldOn;
    //  scope_interrupt.alertStatus = false;
    }
    if (scope_interrupt.alertStatus == false)
    {
	  if(kony.os.deviceInfo().name !== "thinclient") {
        var errorMsg = applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.An.error.occurred.while.making.the.request.");
	  } else {
		errorMsg = err.errorMessage;  
	  }
      kony.ui.Alert({
        "alertType": constants.ALERT_TYPE_INFO_ERROR,
        "alertTitle": "Error",
        "message": errorMsg,
        "alertHandler": alertCallback
      }, {});
      scope_interrupt.alertStatus = true;
    }
    function appExit(response){
      scope_interrupt.alertStatus = false;
      kony.application.exit();
    }
    function appLogout(response){
      var cm=applicationManager.getConfigurationManager();
      var val=cm.getshowFeedBackPostLogout();
      if(val=="true"){
        cm.setshowFeedBackPostLogout("false");
      }
     scope_interrupt.alertStatus = false;
      var authMode = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("AuthModule");
      authMode.presentationController.onLogout();
    }
    function appHoldOn(response){
      scope_interrupt.alertStatus = false;
      kony.print("Error");
    }
  };
  return PresentationInterruptHandler;
});