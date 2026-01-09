/**
*@module PresentationFormUtility
*/
define([], function () {
  /**
   * PresentationFormUtility consists of all presentation methods related to "Form"
   *@alias module:PresentationFormUtility
   *@class
   */
  function PresentationFormUtility() {
  }
  inheritsFrom(PresentationFormUtility, kony.mvc.Business.Delegator);
  PresentationFormUtility.prototype.initializeBusinessController = function() {};
  /**
  * Method to log form name with time stamo.
  * @param {String} FormName , Name of the current form
  */
  PresentationFormUtility.prototype.logFormName=function(FormName)
  {
    var timestamp = applicationManager.getFormatUtilManager().getTimeStamp();
    kony.print(timestamp+" : Current Form is "+FormName);
  };
  /**
  * Method to initialize common actions accross every form.
  * @param {Object} scope , scope of current form.
  * @param {String} isBackEnabled , "YES" if device backenabled "NO" if not.
  * @param {String} currentFormName , crrent form name
  * @param {function} callBack , callback function to invoke at some cases
  */
  PresentationFormUtility.prototype.initCommonActions=function(scope,isBackEnabled,currentFormName,callBack){
    this.setUpDeviceBack(scope,isBackEnabled,currentFormName,callBack);
    this.pushCurrentFormIntoStack(currentFormName);
  };
  /**
  * Method to set up device back functionality accross every form.
  * @param {Object} scope , scope of current form.
  * @param {String} isBackEnabled , "YES" if device backenabled "NO" if not.
  * @param {String} currentFormName , crrent form name
  * @param {function} callBack , callback function to invoke at some cases
  */
  PresentationFormUtility.prototype.setUpDeviceBack=function(scope,isBackEnabled,currentFormName,callBack){
    var scope_PresentationFormUtility=this;
    if(isBackEnabled.toUpperCase()=="YES"){
      scope.view.onDeviceBack =function(){
        var navManager = applicationManager.getNavigationManager();
        var userObj = applicationManager.getUserPreferencesManager();
        var isLoggedin = userObj.isUserLoggedin();
        var currentForm = kony.application.getCurrentForm().id;
        if(currentForm === "frmLogout" ){
          isLoggedin = false;
        }
		if((navManager.getPreviousForm()=="frmLogin" || navManager.getPreviousForm()=="frmMFASecurityCode" || navManager.getPreviousForm()=="frmDevRegLoginType" || navManager.getPreviousForm()=="frmSecurityQuestions"||navManager.getPreviousForm()=="frmTermsAndCondition")&&isLoggedin){
          var basicConfig={  
          "alertType": constants.ALERT_TYPE_CONFIRMATION,
            "alertTitle": "",
            "yesLabel": applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.common.AlertYes"),
            "noLabel": applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.common.AlertNo"),
            "message": applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.common.LogoutConfirmation","Are you sure you want to sign out?"),
            "alertHandler": scope_PresentationFormUtility.logoutUser
          };
          applicationManager.getPresentationUtility().showAlertMessage(basicConfig,{});
        }
        else if(navManager.getCurrentForm()=="frmLogin" || navManager.getCurrentForm()=="frmLogout" || currentForm === "frmLogout" ){
          var basicConfig={
            "alertType": constants.ALERT_TYPE_CONFIRMATION,
            "alertTitle": "",
            "yesLabel": applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.common.AlertYes"),
            "noLabel": applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.common.AlertNo"),
            "message": applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.common.AppExit","Are you sure you want to exit the application?"),
            "alertHandler": scope_PresentationFormUtility.exitApplication
          };
          applicationManager.getPresentationUtility().showAlertMessage(basicConfig,{});
        }
        else if (navManager.getPreviousForm()=="frmOBLogin" || navManager.getPreviousForm()=="frmOBsetUserNamePwd"){
          var basicConfig={
            "alertType": constants.ALERT_TYPE_CONFIRMATION,
            "alertTitle": "",
            "yesLabel": applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.common.AlertYes"),
            "noLabel": applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.common.AlertNo"),
            "message": applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.common.LogoutConfirmation","Are you sure you want to sign out?"),
            "alertHandler": scope_PresentationFormUtility.logoutNUOUser
          };
          applicationManager.getPresentationUtility().showAlertMessage(basicConfig,{});
        }
        else{
          navManager.goBack();
        }
      };
    }
    if(isBackEnabled.toUpperCase()=="YES_CALLBACK"){
      scope.view.onDeviceBack =function(){
        var navManager = applicationManager.getNavigationManager();
        navManager.goBack();
        callBack();
      };
    }
    else if(isBackEnabled.toUpperCase()=="CALLBACK"){
      scope.view.onDeviceBack =function(){
        callBack();
      };
    }
    else if(isBackEnabled.toUpperCase()=="YES_NUOLANDING"){
      var navManager = applicationManager.getNavigationManager();
      var NUOMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("NewUserModule");
      scope.view.onDeviceBack =function(){
        if(NUOMod.presentationController.isNewUserSignatureDone()){
          NUOMod.presentationController.newUserDone();
        }
        else{
          NUOMod.presentationController.onClose();
        }
      };
    }
    else if(isBackEnabled.toUpperCase()=="NO"){
      scope.view.onDeviceBack =function(){
        kony.print("On Device Back");
      };
    }
  };
  /**
  * Method to logout user from current session
  * @param {Boolean} response , true to logout .
  */
  PresentationFormUtility.prototype.logoutUser = function(response){
    if(response===true){
      var authMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
        "appName": "AuthenticationMA",
        "moduleName": "AuthUIModule"
    });
      authMod.presentationController.onLogout();
    }
    else{
      kony.print("on click No in logout confirmation");
    }
  };
    /**
  * Method to logout New user onboarding user from current session
  * @param {Boolean} response , true to logout .
  */
  PresentationFormUtility.prototype.logoutNUOUser = function(response){
    if(response===true){
     var nuoMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("NewUserModule");
    nuoMod.presentationController.onLogout();
    }
    else{
      kony.print("on click No in logout confirmation");
    }
  };
  /**
  * Method to exit form the current application
  * @param {Boolean} response , true to logout .
  */
  PresentationFormUtility.prototype.exitApplication = function(response){
    if(response===true){
      kony.application.exit();
    }
    else{
      kony.print("on click No in EXIT confirmation");
    }
  };
  /**
  * Method to logout user from current session
  * @param {String} currentFormName , current Form name  .
  */
  PresentationFormUtility.prototype.pushCurrentFormIntoStack=function(currentFormName){
    var navManager = applicationManager.getNavigationManager();
    navManager.pushForm(currentFormName);
  };
  /**
  * Method to logout user from current session
  * @param {String} currentFormName , current Form name  .
  */
  PresentationFormUtility.prototype.getDeviceName=function(){
   var device = kony.os.deviceInfo().name;
    if(device==="iPhone"||device ==="iPad")
      return "iPhone";
    else
      return device;
  };
  return PresentationFormUtility;
});