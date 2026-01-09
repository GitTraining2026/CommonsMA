/**
*@module PresentationUtility
*/
define([], function () {
  /**
   * PresentationUtility consists of all utilities anf wrapper functions related to Presentation
   *@alias module:PresentationUtility
   *@class
*/
  function PresentationUtility() {
    /*
  A variable maintained to store row index globally on swipe
  Note:It is maintained to delete on swipe till platform fix issue related to segment
*/
    /**@member {integer}  number to maintain index for swipe*/
    this.rowIndexforSwipe=-1;
    /**@member {integer}  number to maintain tap gesture enabled or not*/
    this.tapgestureEnabled= true;
  }
  inheritsFrom(PresentationUtility, kony.mvc.Business.Delegator);
  PresentationUtility.prototype.initializeBusinessController = function() {
  };
  /**
  * A wrapper on kony alert message for further use
  * @param {JSON} basicConfig - same as basicConfig in kony.ui.Alert
  * @param {JSON} pspConfig - same as pspConfig in kony.ui.Alert
*/
  PresentationUtility.prototype.showAlertMessage =  function(basicConfig, pspConfig ){
    if(applicationManager.getPresentationFormUtility().getDeviceName() === "android"){
      basicConfig.alertIcon="transparentbox.png";
    }
    kony.ui.Alert(basicConfig, pspConfig);
  }
  /**
  * Returns value of given i18n key in device's locale
  * @param {String} i18n Key - an i18n key to look out for
  * @param {String} noKeyValue(optonal) - returns this when lookout failed
  * @returns {String} - value associated to that key if its not there noKeyValue is returned
  */
  PresentationUtility.prototype.getStringFromi18n = function (stringValue,noKeyValue)
  {
    return  kony.i18n.getLocalizedString(stringValue) ? kony.i18n.getLocalizedString(stringValue):noKeyValue;
  }
  /**
  * A UI function to show loading indicator
*/
  PresentationUtility.prototype.showLoadingScreen = function(){
    // kony.application.showLoadingScreen(null,"", constants.LOADING_SCREEN_POSITION_ONLY_CENTER, true, true, null);
    var flxLoadingIndicator = new kony.ui.FlexContainer({
        "autogrowMode": kony.flex.AUTOGROW_NONE,
        "clipBounds":true,
        "id": "flxLoadingIndicator",
        "width": "100%",
        "height": "100%",
        "zIndex": 9999,
        "isVisible": true,
        "skin":"sknLoading",
        "opacity":"40%",
        "modalContainer":true,
        "layoutType": kony.flex.FREE_FORM
    }, {}, {});
    flxLoadingIndicator.setDefaultUnit(kony.flex.DP);
    flxLoadingIndicator.setEnabled(true);
    flxLoadingIndicator.onClick = function(){}
    var imgApolloLoading = new kony.ui.Image2({
        "id": "imgApolloLoading",
        "centerX": "50%",
        "centerY": "50%",
        "height":"60dp",
        "width": "60dp",
        "zIndex": 1,
        "src":"apolloloading.gif",
        "isVisible": true,
        "skin":"slImage",
    }, {
        "imageScaleMode": constants.IMAGE_SCALE_MODE_FIT_TO_DIMENSIONS,
        "padding": [0, 0, 0, 0],
        "paddingInPixel":false
    }, {});
    flxLoadingIndicator.add(imgApolloLoading);
    var visibleForm = kony.application.getCurrentForm();
    if(visibleForm.flxLoadingIndicator === null || visibleForm.flxLoadingIndicator === undefined){
        visibleForm.add(flxLoadingIndicator);
    }
    /**[Zypher] start to check developer option */
    authMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
            "moduleName": "AuthUIModule",
            "appName": "AuthenticationMA"
        });
    authMod.presentationController.checkDeveloperOption();
    /** [Zypher] end */
  }
  /**
  * A UI function to dismiss loading indicator
*/
  PresentationUtility.prototype.dismissLoadingScreen = function(){
    kony.application.dismissLoadingScreen();
    var visibleForm = kony.application.getCurrentForm();
    if(visibleForm !== null){
        visibleForm.remove(visibleForm["flxLoadingIndicator"]);
    }
  }
  /**
  * Returns the controller of the requested form
  * @param {String} formname - Name of the form for which the controller is required
  * @param {Boolean} isForm - expects true if the requested controller is of a form
  * @param {Object} metaObj - expects JSON object for get getting appName
  * @returns {object} - returns the requested controller(kony.mvc.MDAFormController)
  */
  PresentationUtility.prototype.getController = function(formname,isForm,metaObj){
    var controller = _kony.mvc.GetController(formname, isForm,metaObj);
    return controller;
  };
  PresentationUtility.prototype.MFA = {
    phoneAndEmail : {
      "phone": "",
      "email": ""},
    setPhoneAndEmail : function(phoneAndEmail){
      this.phoneAndEmail = phoneAndEmail;
    },
    getPhoneAndEmail : function(){
      return this.phoneAndEmail;
    },
    navigateBasedOnMFAType : function() {
      var mfaManager = applicationManager.getMFAManager();
      switch(mfaManager.getMFAType()){
        case "SECURE_ACCESS_CODE" :
          this.navigateToOtpScreen();
          break;
        case "SECURITY_QUESTIONS" :
          this.navigateAndSetSecurityQuestions();
          break;
      }
    },
    navigateToOtpScreen : function() {
      var mfaManager = applicationManager.getMFAManager();
      switch(mfaManager.getCommunicationType()){
        case "DISPLAY_ALL" :
          this.navigateToPhoneEmailScreen();
          break;
        case "DISPLAY_NO_VALUE" :
          this.navigateToSecureCodeScreen();
          break;
        case "DISPLAY_PRIMARY" :
          this.navigateToSecureCodeScreen();
          break;
      }
    },
    navigateToPhoneEmailScreen : function(){
      applicationManager.getPresentationUtility().showLoadingScreen();
      var navigationManager = applicationManager.getNavigationManager();
      var mfaManager = applicationManager.getMFAManager();
      var flowType = mfaManager.getMFAFlowType();
      var operationType = mfaManager.operationType;
      if(operationType === "MONEYMOVEMENT" || operationType === "EUROPETRANSFER"){
        navigationManager.navigateTo("frmMFAOption3",true);
      }
      else{
        navigationManager.navigateTo("frmMFAOption3");
      }
      var mfaResponse = mfaManager.getMFAResponse();
      var controller = applicationManager.getPresentationUtility().getController('frmMFAOption3', true);
      controller.setFormUI(mfaResponse,flowType);
    },
    navigateToSecureCodeScreen : function(){
      applicationManager.getPresentationUtility().showLoadingScreen();
      var navigationManager = applicationManager.getNavigationManager();
      var mfaManager = applicationManager.getMFAManager();
      var operationType = mfaManager.operationType;
      if(operationType === "MONEYMOVEMENT" || operationType === "EUROPETRANSFER"){
        navigationManager.navigateTo("frmMFASecurityCode",true);
      }
      else{
        navigationManager.navigateTo("frmMFASecurityCode");
      }
      var mfaResponse = mfaManager.getMFAResponse();
      var controller = applicationManager.getPresentationUtility().getController('frmMFASecurityCode', true);
      controller.setFormUI(mfaResponse);
    },
    setSecureCodeScreen : function(){
      applicationManager.getPresentationUtility().showLoadingScreen();
      var mfaManager = applicationManager.getMFAManager();
      var mfaResponse = mfaManager.getMFAResponse();
      var controller = applicationManager.getPresentationUtility().getController('frmMFASecurityCode', true);
      controller.setFormUI(mfaResponse);
    },
    showMFAOTPScreen : function(){
      applicationManager.getPresentationUtility().showLoadingScreen();
      var navigationManager = applicationManager.getNavigationManager();
      var mfaManager = applicationManager.getMFAManager();
      var operationType = mfaManager.operationType;
      if(operationType === "MONEYMOVEMENT" || operationType === "EUROPETRANSFER"){
        navigationManager.navigateTo("frmMFASecurityCode",true);
      }
      else{
        navigationManager.navigateTo("frmMFASecurityCode");
      }
      var mfaResponse = mfaManager.getMFAResponse();
      var controller = applicationManager.getPresentationUtility().getController('frmMFASecurityCode', true);
      controller.setFormUI(mfaResponse);
    },
    navigateAndSetSecurityQuestions : function(){
      applicationManager.getPresentationUtility().showLoadingScreen();
      var navManager = applicationManager.getNavigationManager();
      var mfaManager = applicationManager.getMFAManager();
      var operationType = mfaManager. operationType;
      if(operationType === "MONEYMOVEMENT" || operationType === "EUROPETRANSFER"){
        navManager.navigateTo("frmSecurityQuestions",true);
      }
      else{
        navManager.navigateTo("frmSecurityQuestions");
      }
      var controller = applicationManager.getPresentationUtility().getController('frmSecurityQuestions', true);
      var mfaAttributes = mfaManager.getMFAResponse().MFAAttributes;
      controller.setFormUI(mfaAttributes);
    },
    navigateToSecurityQuestion : function(){
      var controller = applicationManager.getPresentationUtility().getController('frmSecurityQuestions', true);
      var mfaManager = applicationManager.getMFAManager();
      var mfaAttributes = mfaManager.getMFAResponse().MFAAttributes;
      controller.setFormUI(mfaAttributes);
    },
    setSecurityQuestions : function(){
      applicationManager.getPresentationUtility().showLoadingScreen();
      var controller = applicationManager.getPresentationUtility().getController('frmSecurityQuestions', true);
      var mfaManager = applicationManager.getMFAManager();
      var mfaAttributes = mfaManager.getMFAResponse().MFAAttributes;
      controller.setFormUI(mfaAttributes);
    },
    cancelMFAFlow : function(){
      var mfaManager = applicationManager.getMFAManager();
       var flowType = mfaManager.getMFAFlowType();
      var operationType=mfaManager.operationType;
      if(operationType==="Transfers")
      {
         mfaManager.setMFAOperationType("");
        var transferModule = applicationManager.getModulesPresentationController("TransferModule");
        transferModule.cancelCommon();
     
      }
      else if(operationType==="MONEYMOVEMENT")
      {
         mfaManager.setMFAOperationType("");
        var moneyMovementPresentationController = applicationManager.getModulesPresentationController("MoneyMovementModule");
        moneyMovementPresentationController.cancelCommon();
      }
      else if(operationType==="EUROPETRANSFER")
      {
         mfaManager.setMFAOperationType("");
        var transMod = applicationManager.getModulesPresentationController("TransferModule");
        transMod.cancelCommon();
      }
      else if(operationType==="BILLPAY")
        {
           mfaManager.setMFAOperationType("");
          var billPayMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("BillPayModule");
            billPayMod.presentationController.cancelCommon(); 
          
        }
      else if(operationType==="PAYAPERSON")
      {
        mfaManager.setMFAOperationType("");
        var p2pMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("PayAPersonModule");
        p2pMod.presentationController.cancelCommon();

      }
      else if(operationType === "LOANPAYOFF") {
        mfaManager.setMFAOperationType("");
        var loansMod = applicationManager.getModulesPresentationController("LoansPayoffModule");
        loansMod.cancelCommon();
      }
      else
      {
        switch(flowType){

         
          case "LoginMFA":
            var authMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("AuthModule");
            authMod.presentationController.onLogout();
            break;
          case "UPDATE_USERNAME":
            var navigationManager=applicationManager.getNavigationManager();
            navigationManager.navigateTo('frmSettings');
            break;
          case "UPDATE_PASSWORD":
            var navigationManager=applicationManager.getNavigationManager();
            navigationManager.navigateTo('frmSettings');
            break;
          case "LOCK_CARD":
            var cardsMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName":"ManageCardsUIModule", "appName":"CardsMA"});
            cardsMod.presentationController.cancelCommon();
            break;
          case "UNLOCK_CARD":
            var cardsMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName":"ManageCardsUIModule", "appName":"CardsMA"});
            cardsMod.presentationController.cancelCommon();
            break;
          case "CHANGE_PIN_DEBIT":
            var cardsMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName":"ManageCardsUIModule", "appName":"CardsMA"});
            cardsMod.presentationController.cancelCommon();
            break;
          case "REPORT_LOST":
            var cardsMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName":"ManageCardsUIModule", "appName":"CardsMA"});
            cardsMod.presentationController.cancelCommon();
            break;
          case   "CANCEL_CARD":
            var cardsMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName":"ManageCardsUIModule", "appName":"CardsMA"});
            cardsMod.presentationController.cancelCommon();
            break;
          case  "REPLACE_CARD":
            var cardsMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName":"ManageCardsUIModule", "appName":"CardsMA"});
            cardsMod.presentationController.cancelCommon();
            break;
          case "CHANGE_PIN_CREDIT":
            var cardsMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName":"ManageCardsUIModule", "appName":"CardsMA"});
            cardsMod.presentationController.cancelCommon();
            break;
           case "ACTIVATE_CARD":
            var cardsMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName":"ManageCardsUIModule", "appName":"CardsMA"});
            cardsMod.presentationController.cancelCommon();
            break;
           case "APPLY_FOR_DEBIT_CARD":
            var cardsMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName":"ManageCardsUIModule", "appName":"CardsMA"});
            cardsMod.presentationController.cancelCommon();
            break;
             case "PSD2_TPP_CONSENT_REVOKED":
           var navigationManager=applicationManager.getNavigationManager();
            navigationManager.navigateTo('frmSettings');
            break;
          case "ADD_PHONE_NUMBER":
            var navigationManager = applicationManager.getNavigationManager();
            navigationManager.navigateTo('frmSettings');
            break;
          case "UPDATE_PHONE_NUMBER":
            var navigationManager = applicationManager.getNavigationManager();
            navigationManager.navigateTo('frmSettings');
            break;
          case "REMOVE_PHONE_NUMBER":
            var navigationManager = applicationManager.getNavigationManager();
            navigationManager.navigateTo('frmSettings');
            break;
          case "ADD_EMAIL":
            var navigationManager = applicationManager.getNavigationManager();
            navigationManager.navigateTo('frmSettings');
            break;
          case "UPDATE_EMAIL":
            var navigationManager = applicationManager.getNavigationManager();
            navigationManager.navigateTo('frmSettings');
            break;
          case "REMOVE_EMAIL":
            var navigationManager = applicationManager.getNavigationManager();
            navigationManager.navigateTo('frmSettings');
            break;
          case "SUSPEND_USER":
            var navigationManager = applicationManager.getNavigationManager();
            navigationManager.navigateTo('frmSettings');
            break;
        }
      }
    },
    resendOTP:function(data)
    {
        var mfaManager = applicationManager.getMFAManager();
      var data = {
        "MFAAttributes" : {
          "serviceName" : mfaManager.getServiceId(),
          "serviceKey" : mfaManager.getServicekey(),
          "OTP" : data
        }
      };
       mfaManager.resendOTP(data);
    },
    verifyOTP : function(data){
      var mfaManager = applicationManager.getMFAManager();
      var data = {
        "MFAAttributes" : {
          "serviceName" : mfaManager.getServiceId(),
          "serviceKey" : mfaManager.getServicekey(),
          "OTP" : data
        }
      };
      mfaManager.verifyOTP(data);
    },
    enteredIncorrectOTP : function(error){
      var controller = applicationManager.getPresentationUtility().getController('frmMFASecurityCode', true);
      controller.showIncorrectOTPError(error);
    },
    navigateToAckScreen : function(response){
      var mfaManager = applicationManager.getMFAManager();
       var flowType = mfaManager.getMFAFlowType();
      var operationType=mfaManager.operationType;
       if(operationType==="Transfers")
          {
             mfaManager.setMFAOperationType("");
            var transferModule = applicationManager.getModulesPresentationController({"moduleName" : "TransferEuropeUIModule", "appName" : "TransfersMA"});
            transferModule.presentationMakeATransferSuccess(response);
           
          }
          else if(operationType==="MONEYMOVEMENT")
          {
             mfaManager.setMFAOperationType("");
            var moneyMovementPresentationController = applicationManager.getModulesPresentationController({"moduleName":"MoneyMovementModule","appName":"TransfersMA"});
            moneyMovementPresentationController.presentationMakeATransferSuccess(response); 
          }
      else if(operationType==="EUROPETRANSFER")
      {
        mfaManager.setMFAOperationType("");
        var transMod = applicationManager.getModulesPresentationController({"moduleName" : "TransferEuropeUIModule", "appName" : "TransfersMA"});
        transMod.presentationMakeATransferSuccess(response);
      }
      else if(operationType==="BILLPAY")
        {
           mfaManager.setMFAOperationType("");
         var billPayMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("BillPayModule");
          billPayMod.presentationController.presentationMakeATransferSuccess(response);
         
        }
      else if(operationType==="PAYAPERSON")
        {
           mfaManager.setMFAOperationType("");
          var p2pMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("PayAPersonModule");
          p2pMod.presentationController.createP2pSuccCallback(response);
         
        }
      else if(operationType === "LOANPAYOFF") {
        mfaManager.setMFAOperationType("");
        var loansMod = applicationManager.getModulesPresentationController("LoansPayoffModule");
        loansMod.presentationMakeATransferSuccess(response);
      }
      else
        {
      switch(flowType){
     
		case "LoginMFA":
          var authMod= kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("AuthModule");
          authMod.presentationController.mfaLoginFlow(response);
          break;
        case "UPDATE_USERNAME":
          var settingModule = applicationManager.getModulesPresentationController("SettingsModule");
          settingModule.updateUserNameSuccess(response);
          break;
        case "UPDATE_PASSWORD":
          var settingModule = applicationManager.getModulesPresentationController("SettingsModule");
          settingModule.updatePasswordSuccess(response);
          break;
           case "LOCK_CARD":
         var manageCardsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName":"ManageCardsUIModule", "appName":"CardsMA"});
          manageCardsModule.presentationController.updateCardDataSuccessCallback(response);
          break;
        case "UNLOCK_CARD":
          var manageCardsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName":"ManageCardsUIModule", "appName":"CardsMA"});
          manageCardsModule.presentationController.updateCardDataSuccessCallback(response);
          break;
        case "CHANGE_PIN_DEBIT":
          var manageCardsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName":"ManageCardsUIModule", "appName":"CardsMA"});
          manageCardsModule.presentationController.updateCardDataSuccessCallback(response);
          break;
        case "REPORT_LOST":
          var manageCardsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName":"ManageCardsUIModule", "appName":"CardsMA"});
          manageCardsModule.presentationController.updateCardDataSuccessCallback(response);
          break;
        case   "CANCEL_CARD":
           var manageCardsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName":"ManageCardsUIModule", "appName":"CardsMA"});
          manageCardsModule.presentationController.updateCardDataSuccessCallback(response);
          break;
        case  "REPLACE_CARD":
          var manageCardsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName":"ManageCardsUIModule", "appName":"CardsMA"});
          manageCardsModule.presentationController.updateCardDataSuccessCallback(response);
          break;
        case "CHANGE_PIN_CREDIT":
          var manageCardsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName":"ManageCardsUIModule", "appName":"CardsMA"});
          manageCardsModule.presentationController.updateCardDataSuccessCallback(response);
          break;
         case "ACTIVATE_CARD":
          var manageCardsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName":"ManageCardsUIModule", "appName":"CardsMA"});
          manageCardsModule.presentationController.activateCardsSuccess(response);
          break;
         case "APPLY_FOR_DEBIT_CARD":
          var manageCardsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName":"ManageCardsUIModule", "appName":"CardsMA"});
          manageCardsModule.presentationController.applyNewCardSuccess(response);
          break;
           case "PSD2_TPP_CONSENT_REVOKED":
          var settingModule = applicationManager.getModulesPresentationController("SettingsModule");
          settingModule.updatePSDConsentSuccess(response);
          break;
        case "ADD_PHONE_NUMBER":
          var settingModule = applicationManager.getModulesPresentationController("SettingsModule");
          settingModule.addUserPhoneNumberSuccess(response);
          break;
        case "UPDATE_PHONE_NUMBER":
          var settingModule = applicationManager.getModulesPresentationController("SettingsModule");
          settingModule.updateUserPhoneNumberSuccess(response);
          break;
        case "REMOVE_PHONE_NUMBER":
          var settingModule = applicationManager.getModulesPresentationController("SettingsModule");
          settingModule.deleteUserPhoneNumberSuccess(response);
          break;
        case "ADD_EMAIL":
          var settingModule = applicationManager.getModulesPresentationController({"moduleName" : "SettingsUIModule", "appName" : "ManageProfileMA"});
          settingModule.addEmailSuccessCallBack(response);
          break;
        case "UPDATE_EMAIL":
          var settingModule = applicationManager.getModulesPresentationController({"moduleName" : "SettingsUIModule", "appName" : "ManageProfileMA"});
          settingModule.updateEmailPresentationSuccessCallback(response);
          break;
        case "REMOVE_EMAIL":
          var settingModule = applicationManager.getModulesPresentationController({"moduleName" : "SettingsUIModule", "appName" : "ManageProfileMA"});
          settingModule.deleteEmailPresentationSuccessCallback(response);
          break;
        case "SUSPEND_USER":
          var settingModule = applicationManager.getModulesPresentationController("SettingsModule");
          settingModule.disableEBankingAccessSuccess(response);
          break;
      }
       
      }
        
    },
	navigateToTransactionScreen: function(response) {
		this.onMFAError(response);
	},
    onMFAError : function(error){
      var mfaManager = applicationManager.getMFAManager();
       var flowType = mfaManager.getMFAFlowType();
      var operationType=mfaManager.operationType;
       if(operationType==="Transfers")
          {
             mfaManager.setMFAOperationType("");
              var transferModule = applicationManager.getModulesPresentationController({"moduleName" : "TransferEuropeUIModule", "appName" : "TransfersMA"});
          transferModule.presentationMakeATransferError(error);
          }
          else if(operationType==="MONEYMOVEMENT")
          {
             mfaManager.setMFAOperationType("");
            var moneyMovementPresentationController = applicationManager.getModulesPresentationController({"moduleName":"MoneyMovementModule","appName":"TransfersMA"});
            moneyMovementPresentationController.presentationMakeATransferError(error);
          }
      else if(operationType==="EUROPETRANSFER")
      {
        mfaManager.setMFAOperationType("");
        var transMod = applicationManager.getModulesPresentationController({"moduleName" : "TransferEuropeUIModule", "appName" : "TransfersMA"});
        transMod.presentationMakeATransferError(error);
      }
          else if(operationType==="BILLPAY")
        {
           mfaManager.setMFAOperationType("");
        var billPayMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("BillPayModule");
          billPayMod.presentationController.presentationMakeATransferError(error);
        }
      else if(operationType==="PAYAPERSON")
        {
           mfaManager.setMFAOperationType("");
          var p2pMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("PayAPersonModule");
          p2pMod.presentationController.createP2pErrCallback(error);
        }
      else if(operationType === "LOANPAYOFF") {
        mfaManager.setMFAOperationType("");
        var loansMod = applicationManager.getModulesPresentationController("LoansPayoffModule");
        loansMod.presentationMakeATransferError(response);
      }
      else
        {
      switch(flowType){
    
        case "LoginMFA":
            var controller = applicationManager.getPresentationUtility().getController('frmMFASecurityCode', true);
            controller.setErrorMessageAndLogout(error);
          break;
           case "UPDATE_USERNAME":
          var settingModule = applicationManager.getModulesPresentationController("SettingsModule");
          settingModule.updateUserNameFailure(error);
          break;
        case "UPDATE_PASSWORD":
          var settingModule = applicationManager.getModulesPresentationController("SettingsModule");
          settingModule.updatePasswordFailure(error);
          break;
        case "LOCK_CARD":
          var manageCardsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName":"ManageCardsUIModule", "appName":"CardsMA"});
          manageCardsModule.presentationController.updateCardDataFailureCallback(error);
          break;
        case "UNLOCK_CARD":
          var manageCardsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName":"ManageCardsUIModule", "appName":"CardsMA"});
          manageCardsModule.presentationController.updateCardDataFailureCallback(error);
          break;
        case "CHANGE_PIN_DEBIT":
          var manageCardsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName":"ManageCardsUIModule", "appName":"CardsMA"});
          manageCardsModule.presentationController.updateCardDataFailureCallback(error);
          break;
        case "REPORT_LOST":
          var manageCardsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName":"ManageCardsUIModule", "appName":"CardsMA"});
          manageCardsModule.presentationController.updateCardDataFailureCallback(error);
          break;
        case   "CANCEL_CARD":
          var manageCardsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName":"ManageCardsUIModule", "appName":"CardsMA"});
          manageCardsModule.presentationController.updateCardDataFailureCallback(error);
          break;
        case  "REPLACE_CARD":
          var manageCardsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName":"ManageCardsUIModule", "appName":"CardsMA"});
          manageCardsModule.presentationController.updateCardDataFailureCallback(error);
          break;
           case "CHANGE_PIN_CREDIT":
          var manageCardsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName":"ManageCardsUIModule", "appName":"CardsMA"});
          manageCardsModule.presentationController.updateCardDataFailureCallback(error);
          break;
           case "ACTIVATE_CARD":
          var manageCardsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName":"ManageCardsUIModule", "appName":"CardsMA"});
          manageCardsModule.presentationController.activateCardsFailure(error);
          break;
         case "APPLY_FOR_DEBIT_CARD":
          var manageCardsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName":"ManageCardsUIModule", "appName":"CardsMA"});
          manageCardsModule.presentationController.applyNewCardError(error);
          break;
           case "PSD2_TPP_CONSENT_REVOKED":
          var settingModule = applicationManager.getModulesPresentationController("SettingsModule");
          settingModule.updatePSDConsentFailure(error);
          break;
        case "ADD_PHONE_NUMBER":
          var settingModule = applicationManager.getModulesPresentationController("SettingsModule");
          settingModule.addUserPhoneNumberFailure(error);
          break;
        case "UPDATE_PHONE_NUMBER":
          var settingModule = applicationManager.getModulesPresentationController("SettingsModule");
          settingModule.updateUserPhoneNumberFailure(error);
          break;
        case "REMOVE_PHONE_NUMBER":
          var settingModule = applicationManager.getModulesPresentationController("SettingsModule");
          settingModule.deleteUserPhoneNumberFailure(error);
          break;
        case "ADD_EMAIL":
          var settingModule = applicationManager.getModulesPresentationController("SettingsModule");
          settingModule.addEmailFailureCallBack(error);
          break;
        case "UPDATE_EMAIL":
          var settingModule = applicationManager.getModulesPresentationController("SettingsModule");
          settingModule.updateEmailPresentationErrorCallback(error);
          break;
        case "REMOVE_EMAIL":
          var settingModule = applicationManager.getModulesPresentationController("SettingsModule");
          settingModule.deleteEmailPresentationErrorCallback(error);
          break;
        case "SUSPEND_USER":
          var settingModule = applicationManager.getModulesPresentationController("SettingsModule");
          settingModule.disableEBankingAccessError(error);
          break;
      }
        }
    },
    requestOTP : function(params){
      var mfaManager = applicationManager.getMFAManager();
      var data = {
        "MFAAttributes" : {
          "serviceName" : mfaManager.getServiceId(),
          "serviceKey" : mfaManager.getServicekey(),
          "OTP" : params
        }
      };
      mfaManager.requestOTP(data);
    },
    mfaOTPError : function(err){
      applicationManager.getPresentationUtility().dismissLoadingScreen();
      if (err["isServerUnreachable"]) {
        applicationManager.getPresentationInterruptHandler().showErrorMessage("postLogin", err);
      }
      else{
        var currentForm = kony.application.getCurrentForm().id;
        var controller = applicationManager.getPresentationUtility().getController(currentForm, true);
        controller.bindError(err.errorMessage);
      }
    },
    verifySecurityQuestions:function(data){
      var mfaManager = applicationManager.getMFAManager();
      var inputparams = {
        "MFAAttributes" : {
          "serviceName" : mfaManager.getServiceId(),
          "serviceKey" : mfaManager.getServicekey(),
          "securityQuestions" : data
        }
      };
      mfaManager.verifySecurityQuestions(inputparams);
    },
    getMFAResponse : function(){
      var mfaManager = applicationManager.getMFAManager();
      return mfaManager.getMFAResponse();
    },
    enteredIncorrectAnswer : function(err){
      var controller = applicationManager.getPresentationUtility().getController('frmSecurityQuestions', true);
      controller.showIncorrectSecurityAnswerError(err);
    },
    getMFAFlowType : function(){
      var mfaManager = applicationManager.getMFAManager();
      return mfaManager.getMFAFlowType();
    },
    getServiceIdBasedOnDisplayName : function(displayName){
      var configManager = applicationManager.getConfigurationManager();
      var mfaManager = applicationManager.getMFAManager();
      var services = configManager.getServicesListForUser();
      for (var i = 0; i < services.length; i++) {
        if(services[i].displayName === displayName){
          mfaManager.setServiceId(services[i].serviceId);
        }
      }
    },
    getDisplayNameBasedOnTransactionMode : function(moduleName){
      var transferModulePresentationController
      if(moduleName)
        transferModulePresentationController = applicationManager.getModulesPresentationController(moduleName);
      else
        transferModulePresentationController = applicationManager.getModulesPresentationController("TransferEuropeUIModule");
      var mfaManager = applicationManager.getMFAManager();
      var displayName = "";
      switch(transferModulePresentationController.transactionMode){
        case applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.transfer.MyKonyAccounts") :
          displayName = "KonyBankAccountsTransfer";
          break;
        case applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.transfer.OtherKonyBankMembers") :
          displayName = "OtherKonyAccountsTransfer";
          break;
        case applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.transfer.OtherBankAccounts") :
          displayName = "OtherBankAccountsTransfer";
          break;
        case applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.transfer.InternationalTransfer") :
          displayName = "InternationalAccountsTransfer";
          break;
        default :
          displayName = transferModulePresentationController.transactionMode;
          break;
      }
      return displayName;
    },
    navigateToMFAComponent : function(response){
      applicationManager.getPresentationUtility().showLoadingScreen();
      var navigationManager = applicationManager.getNavigationManager();
      var mfaManager = applicationManager.getMFAManager();
      var operationType = mfaManager.operationType;
      navigationManager.setCustomInfo("frmMFAValidation",response);
      if(operationType === "MONEYMOVEMENT" || operationType === "EUROPETRANSFER"){
        //navigationManager.navigateTo("frmMFAValidation",true);
        new kony.mvc.Navigation({"appName" : "CommonsMA", "friendlyName" : "frmMFAValidation"}).navigate();
      }
      else if (response.flowType === "LOCK_CARD") {
        //navigationManager.navigateTo({"appName" : "CardsMA", "friendlyName" : "frmCardMngConfirmDetails"});
        var viewController = applicationManager.getPresentationUtility().getController('frmCardMngConfirmDetails', true);
        viewController.SCAComponentLockCall(response);
      } else if (response.flowType === "UNLOCK_CARD") {
        navigationManager.navigateTo({"appName" : "CardsMA", "friendlyName" : "frmCardManageHome"});
        var viewController = applicationManager.getPresentationUtility().getController('frmCardManageHome', true);
        viewController.SCAComponentUnLockCall(response);
      }
      else if (response.flowType === "CHANGE_PIN_CREDIT") {
        //var viewController = applicationManager.getPresentationUtility().getController('frmCardMngPinChgOptions', true);
        var viewController = applicationManager.getPresentationUtility().getController('frmCardMngPinChgOptions', true);
        viewController.SCAComponentChangePinCall(response);
      } else if (response.flowType === "CHANGE_PIN_DEBIT") {
        var viewController = applicationManager.getPresentationUtility().getController('frmCardMngNewPin', true);
        viewController.SCAComponentChangePinCall(response);
      } else if (response.flowType === "ACTIVATE_CARD") {
        //var viewController = applicationManager.getPresentationUtility().getController('frmCardManageNewCVV', true);
        var viewController = applicationManager.getPresentationUtility().getController('frmCardManageHome', true);
        viewController.SCAComponentActivationCall(response);
      }
      else{
        new kony.mvc.Navigation({"appName" : "CommonsMA", "friendlyName" : "frmMFAValidation"}).navigate(); 
      }
    },
  };
  PresentationUtility.prototype.formatText=function(accountName,noOfChars,accountNumber,beginIndex){
    var truncatedAccName = "";
    var truncatedAccNum="";
    var formattedAccName ="";
    if (accountName && accountNumber && accountName.length > noOfChars) {
      truncatedAccName = accountName.substring(0, noOfChars - 1);
    } else {
      truncatedAccName = accountName;
    }
    if (accountNumber && accountNumber.length > beginIndex) {
      truncatedAccNum = accountNumber.substr(accountNumber.length - beginIndex);
    } else {
      if(accountNumber){
        truncatedAccNum = accountNumber;
      }
    }
    if(truncatedAccNum){
      formattedAccName = truncatedAccName + "..." + truncatedAccNum;
    }
    else{
      formattedAccName = truncatedAccName ;
    }
    return formattedAccName;
  };
  return PresentationUtility;
});