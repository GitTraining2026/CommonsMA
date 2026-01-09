/**
*@module PresentationUtility
*/
define(['OLBConstants','SCAConfiguration'], function (OLBConstants,SCAConfiguration) {
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
    this.rowIndexforSwipe = -1;
  }
  inheritsFrom(PresentationUtility, kony.mvc.Business.Delegator);
  PresentationUtility.prototype.initializeBusinessController = function () {
  };
  /**
  * A wrapper on kony alert message for further use
  * @param {JSON} basicConfig - same as basicConfig in kony.ui.Alert
  * @param {JSON} pspConfig - same as pspConfig in kony.ui.Alert
*/
  PresentationUtility.prototype.showAlertMessage = function (basicConfig, pspConfig) {
    if (kony.os.deviceInfo().name === "android") {
      basicConfig.alertIcon = "transparentbox.png";
    }
    kony.ui.Alert(basicConfig, pspConfig);
  }
  /**
  * Returns value of given i18n key in device's locale
  * @param {String} i18n Key - an i18n key to look out for
  * @param {String} noKeyValue(optonal) - returns this when lookout failed
  * @returns {String} - value associated to that key if its not there noKeyValue is returned
  */
  PresentationUtility.prototype.getStringFromi18n = function (stringValue, noKeyValue) {
    return kony.i18n.getLocalizedString(stringValue) ? kony.i18n.getLocalizedString(stringValue) : noKeyValue;
  }
  /**
  * A UI function to show loading indicator
*/
  PresentationUtility.prototype.showLoadingScreen = function () {
    // kony.application.showLoadingScreen(null, "", constants.LOADING_SCREEN_POSITION_ONLY_CENTER, true, true, null);
    var flxLoadingIndicator = new kony.ui.FlexContainer({
      "autogrowMode": kony.flex.AUTOGROW_NONE,
      "clipBounds":true,
      "id": "flxLoadingIndicator",
      "width": "100%",
      "height": "100%",
      "zIndex": 9999,
      "isVisible": true,
      "skin":"slFbox",
      "opacity":"30%",
      "modalContainer":true,
      "layoutType": kony.flex.FREE_FORM
    }, {}, {});
    flxLoadingIndicator.setDefaultUnit(kony.flex.DP);
    flxLoadingIndicator.setEnabled(true);
    var imgApolloLoading = new kony.ui.Image2({
      "id": "imgApolloLoading",
      "centerX": "50%",
      "centerY": "50%",
      "height":"70dp",
      "width": "70dp",
      "zIndex": 1,
      "src":"apollooading.gif",
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
  PresentationUtility.prototype.dismissLoadingScreen = function () {
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
  * @returns {object} - returns the requested controller(kony.mvc.MDAFormController)
  */
  PresentationUtility.prototype.getController = function (formname, isForm) {
    var controller = _kony.mvc.GetController(formname, isForm);
    return controller;
  };
  PresentationUtility.prototype.MFA = {
    navigateBasedOnMFAType: function () {
      var mfaManager = applicationManager.getMFAManager();
      var MFAType = mfaManager.getMFAType();
      switch (MFAType) {
        case OLBConstants.MFA_FLOW_TYPES.SECURE_ACCESS_CODE:
          this.navigateToOtpScreen();
          break;
        case OLBConstants.MFA_FLOW_TYPES.SECURITY_QUESTIONS:
          this.navigateToSecurityQuestion();
          break;
      }
    },
    getMFAFlowType: function () {
      return applicationManager.getMFAManager().getMFAFlowType();
    },
    navigateToOtpScreen: function () {
      var mfaManager = applicationManager.getMFAManager();
      var communicationType = mfaManager.getCommunicationType();
      switch (communicationType) {
        case OLBConstants.MFA_FLOW_TYPES.DISPLAY_ALL:
          this.navigateToPhoneEmailScreen();
          break;
        case OLBConstants.MFA_FLOW_TYPES.DISPLAY_NO_VALUE:
          this.navigateToDefaultMFAScreen();
          break;
        case OLBConstants.MFA_FLOW_TYPES.DISPLAY_PRIMARY:
          this.navigateToPrimaryMFAScreen();
          break;
      }
    },
    navigateToSecurityQuestion: function () {
      var mfaManager = applicationManager.getMFAManager();
      var MFAResponse = mfaManager.getMFAResponse();
      var flowType = mfaManager.getMFAFlowType();
      switch (flowType) {
        case OLBConstants.MFA_FLOW_TYPES.LoginMFA:
          // applicationManager.getNavigationManager().navigateTo("frmMFAPreLogin");
          // applicationManager.getNavigationManager().updateForm({
          //   securityQuestions: MFAResponse
          // }, "frmMFAPreLogin");
          applicationManager.getNavigationManager().updateForm({
            "action" : "securityQuestions",
            securityQuestions: MFAResponse
          }, "frmLogin");
          break;
        default:
          new kony.mvc.Navigation({"appName" : "CommonsMA", "friendlyName" : "frmMFATransactions"}).navigate();
          applicationManager.getNavigationManager().updateForm({
            securityQuestions: MFAResponse
          }, "frmMFATransactions");
          break;
      }
    },
    navigateToPhoneEmailScreen: function () {
      var mfaManager = applicationManager.getMFAManager();
      var MFAResponse = mfaManager.getMFAResponse();
      var flowType = mfaManager.getMFAFlowType();
      switch (flowType) {
        case OLBConstants.MFA_FLOW_TYPES.LoginMFA:
          // applicationManager.getNavigationManager().navigateTo("frmMFAPreLogin");
          // applicationManager.getNavigationManager().updateForm({
            // phoneEmailScreen: MFAResponse.MFAAttributes.customerCommunication
          // }, "frmMFAPreLogin");
          applicationManager.getNavigationManager().updateForm({
            "action" : "OTP",
            phoneEmailScreen: MFAResponse.MFAAttributes.customerCommunication
          }, "frmLogin");
          break;
        default:
          new kony.mvc.Navigation({"appName" : "CommonsMA", "friendlyName" : "frmMFATransactions"}).navigate();
          applicationManager.getNavigationManager().updateForm({
            phoneEmailScreen: MFAResponse.MFAAttributes.customerCommunication
          }, "frmMFATransactions");
          break;
      }
    },
    navigateToDefaultMFAScreen: function () {
      var mfaManager = applicationManager.getMFAManager();
      var MFAResponse = mfaManager.getMFAResponse();
      var flowType = mfaManager.getMFAFlowType();
      switch (flowType) {
        // case OLBConstants.MFA_FLOW_TYPES.LoginMFA:
        //   applicationManager.getNavigationManager().navigateTo("frmMFAPreLogin");
        //   applicationManager.getNavigationManager().updateForm({
        //     defaultPhoneEmailScreen: MFAResponse.MFAAttributes
        //   }, "frmMFAPreLogin");
        //   break;
        case OLBConstants.MFA_FLOW_TYPES.LoginMFA:
          applicationManager.getNavigationManager().updateForm({
            "action" : "OTP",
            defaultPhoneEmailScreen: MFAResponse.MFAAttributes
          }, "frmLogin");
          break;
        default:
          new kony.mvc.Navigation({"appName" : "CommonsMA", "friendlyName" : "frmMFATransactions"}).navigate();
          applicationManager.getNavigationManager().updateForm({
            defaultPhoneEmailScreen: MFAResponse.MFAAttributes
          }, "frmMFATransactions");
          break;
      }
    },
    navigateToPrimaryMFAScreen: function () {
      var mfaManager = applicationManager.getMFAManager();
      var MFAResponse = mfaManager.getMFAResponse();
      var flowType = mfaManager.getMFAFlowType();
      switch (flowType) {
        case OLBConstants.MFA_FLOW_TYPES.LoginMFA:
          // applicationManager.getNavigationManager().navigateTo("frmMFAPreLogin");
          // applicationManager.getNavigationManager().updateForm({
            // primaryPhoneEmailScreen: MFAResponse.MFAAttributes
          // }, "frmMFAPreLogin");
          applicationManager.getNavigationManager().updateForm({
            "action" : "OTP",
            primaryPhoneEmailScreen: MFAResponse.MFAAttributes
          }, "frmLogin");
          break;
        default:
          new kony.mvc.Navigation({"appName" : "CommonsMA", "friendlyName" : "frmMFATransactions"}).navigate();
          applicationManager.getNavigationManager().updateForm({
            primaryPhoneEmailScreen: MFAResponse.MFAAttributes
          }, "frmMFATransactions");
          break;
      }
    },
    showMFAOTPScreen: function () {
      var mfaManager = applicationManager.getMFAManager();
      var MFAResponse = mfaManager.getMFAResponse();
      var flowType = mfaManager.getMFAFlowType();
      switch (flowType) {
        case OLBConstants.MFA_FLOW_TYPES.LoginMFA:
          // applicationManager.getNavigationManager().navigateTo("frmMFAPreLogin");
          // applicationManager.getNavigationManager().updateForm({
          //   otpReceived: MFAResponse.MFAAttributes
          // }, "frmMFAPreLogin");
          applicationManager.getNavigationManager().updateForm({
            "action" : "OTP",
            otpReceived: MFAResponse.MFAAttributes
          }, "frmLogin");

          break;
        default:
          new kony.mvc.Navigation({"appName" : "CommonsMA", "friendlyName" : "frmMFATransactions"}).navigate();
          applicationManager.getNavigationManager().updateForm({
            otpReceived: MFAResponse.MFAAttributes
          }, "frmMFATransactions");
          break;
      }
    },
    cancelMFAFlow: function () {
      var mfaManager = applicationManager.getMFAManager();
      var flowType = mfaManager.getMFAFlowType();
      var currentTransferModule = isFastTransferEnabled ? "TransferFastUIModule" : "TransferModule";
      var geography = applicationManager.getConfigurationManager().configurations.items.DEPLOYMENTGEOGRAPHY;
      if(geography === "EUROPE"){
         currentTransferModule = "TransferEurUIModule";
      }
      var isFastTransferEnabled = applicationManager.getConfigurationManager().isFastTransferEnabled;
      switch (flowType) {
        case OLBConstants.MFA_FLOW_TYPES.FAST_TRANSFERS:
          var accountsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("AccountsModule");
          accountsModule.presentationController.showAccountsDashboard();
          break;
        case OLBConstants.MFA_FLOW_TYPES.TRANSFERS:
          var transferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "TransfersMA", "moduleName" : currentTransferModule});
          transferModule.presentationController.showTransferScreen();
          break;
        case OLBConstants.MFA_FLOW_TYPES.DOMESTIC_WIRE_TRANSFER:
          var wireTransferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName": "WireTransferNewUIModule","appName": "WireTransferMA"});
          wireTransferModule.presentationController.showMakeTransferRecipientList();
          break;
        case OLBConstants.MFA_FLOW_TYPES.INTERNATIONAL_WIRE_TRANSFER:
          var wireTransferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName": "WireTransferNewUIModule","appName": "WireTransferMA"});
          wireTransferModule.presentationController.showMakeTransferRecipientList();
          break;
        case OLBConstants.MFA_FLOW_TYPES.SINGLE_BILL_PAY:
          var billPayModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "BillPayMA", "moduleName" : "BillPaymentUIModule"});
          billPayModule.presentationController.showBillPayData();
          break;
        case OLBConstants.MFA_FLOW_TYPES.PAY_A_PERSON:
          var p2pModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("PayAPersonModule");
          p2pModule.presentationController.showPayAPerson("sendMoneyTab");
          break;
        case OLBConstants.MFA_FLOW_TYPES.TRANSFERS_EURO:
          var transferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "TransfersMA", "moduleName" : currentTransferModule});
          transferModule.presentationController.showTransferScreen();
          break;
        case OLBConstants.MFA_FLOW_TYPES.BULK_BILL_PAY:
          var billPayModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "BillPayMA", "moduleName" : "BillPaymentUIModule"});
          billPayModule.presentationController.showBillPayData();
          break;
        case OLBConstants.MFA_FLOW_TYPES.ONE_TIME_WIRE_TRANSFERS:
          var wireTransferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName": "WireTransferNewUIModule","appName": "WireTransferMA"});
          wireTransferModule.presentationController.showWireTransfer({
            landingPageView: "makeTransfer"
          });
          break;
        case OLBConstants.MFA_FLOW_TYPES.TRANSFERS_UPDATE:
          var transferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "TransfersMA", "moduleName" : currentTransferModule});
          transferModule.presentationController.editTransactionSuccess();
          break;
        case "UPDATE_USERNAME":
          var profileModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ProfileModule");
          profileModule.presentationController.showUserNameAndPassword();
          break;
        case "UPDATE_PASSWORD":
            var profileModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"});
            profileModule.presentationController.showUserNameAndPassword();    
          break;
        case "SECURITYQUESTION_RESET":
            var profileModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"});
            profileModule.presentationController.checkSecurityQuestions();
          break;
        case "LOCK_CARD":
          var cardManagementModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "ManageCardsUIModule", "appName" : "CardsMA"});
          cardManagementModule.presentationController.navigateToManageCards();
          break;
        case "UNLOCK_CARD":
          var cardManagementModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "ManageCardsUIModule", "appName" : "CardsMA"});
          cardManagementModule.presentationController.navigateToManageCards();
          break;
        case "CHANGE_PIN_DEBIT":
          var cardManagementModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "ManageCardsUIModule", "appName" : "CardsMA"});
          cardManagementModule.presentationController.navigateToManageCards();
          break;
        case "REPORT_LOST":
          var cardManagementModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "ManageCardsUIModule", "appName" : "CardsMA"});
          cardManagementModule.presentationController.navigateToManageCards();
          break;
        case "CANCEL_CARD":
          var cardManagementModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "ManageCardsUIModule", "appName" : "CardsMA"});
          cardManagementModule.presentationController.navigateToManageCards();
          break;
        case "REPLACE_CARD":
          var cardManagementModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "ManageCardsUIModule", "appName" : "CardsMA"});
          cardManagementModule.presentationController.navigateToManageCards();
          break;
        case "ACTIVATE_CARD":
          var cardManagementModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "ManageCardsUIModule", "appName" : "CardsMA"});
          cardManagementModule.presentationController.navigateToManageCards();
          break;
        case "APPLY_FOR_DEBIT_CARD":
          var cardManagementModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "ManageCardsUIModule", "appName" : "CardsMA"});
          cardManagementModule.presentationController.navigateToManageCards();
          break;
        case "CHANGE_PIN_CREDIT":
          var cardManagementModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "ManageCardsUIModule", "appName" : "CardsMA"});
          cardManagementModule.presentationController.navigateToManageCards();
          break;
        case "PAY_MULTIPLE_BENEFICIARIES":
          var payMultipleBeneficiariesModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "TransfersMA", "moduleName" : "PayMultipleBeneficiariesUIModule"});
          payMultipleBeneficiariesModule.presentationController.showPayMultipleBeneficiaries({"showManageBeneficiaries": true});
          break;
        case OLBConstants.MFA_FLOW_TYPES.BULK_BILL_PAYMENT:
          var billPayModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "BillPayMA", "moduleName" : "BillPaymentUIModule"});
          billPayModule.presentationController.showBillPaymentScreen({ context: "BulkPayees", loadBills: true });
          break;
        case OLBConstants.MFA_FLOW_TYPES.SINGLE_BILL_PAYMENT:
          var billPayModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "BillPayMA", "moduleName" : "BillPaymentUIModule"});
          billPayModule.presentationController.showBillPaymentScreen({ context: "BulkPayees", loadBills: true });
          break;
        case OLBConstants.MFA_FLOW_TYPES.UPDATE_BILL_PAYMENT:
          var billPayModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "BillPayMA", "moduleName" : "BillPaymentUIModule"});
          billPayModule.presentationController.showBillPaymentScreen({ context: "BulkPayees", loadBills: true });
          break;
        case OLBConstants.MFA_FLOW_TYPES.P2P_CREATE:
          if(isFastTransferEnabled) {
            var accountsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "HomepageMA", "moduleName" : "AccountsUIModule"});
            accountsModule.presentationController.showAccountsDashboard();
          } else {
            var p2pModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("PayAPersonModule");
            p2pModule.presentationController.showPayAPerson("sendMoneyTab");
          }
          break;
        case OLBConstants.MFA_FLOW_TYPES.P2P_EDIT:
          if (isFastTransferEnabled) {
            var accountsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "HomepageMA", "moduleName" : "AccountsUIModule"});
            accountsModule.presentationController.showAccountsDashboard();
          } else {
            var p2pModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("PayAPersonModule");
            p2pModule.presentationController.showPayAPerson("sendMoneyTab");
          }
          break;
        case OLBConstants.MFA_FLOW_TYPES.TRANSFER_BETWEEN_OWN_ACCOUNT_CREATE:
          if(isFastTransferEnabled) {
            var accountsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "HomepageMA", "moduleName" : "AccountsUIModule"});
            accountsModule.presentationController.showAccountsDashboard();
          } else {
            var transferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "TransfersMA", "moduleName" : currentTransferModule});
            transferModule.presentationController.showTransferScreen();
          }
          break;
        case OLBConstants.MFA_FLOW_TYPES.INTRA_BANK_FUND_TRANSFER_CREATE:
          if(isFastTransferEnabled) {
            var accountsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "HomepageMA", "moduleName" : "AccountsUIModule"});
            accountsModule.presentationController.showAccountsDashboard();
          } else {
            var transferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "TransfersMA", "moduleName" : currentTransferModule});
            transferModule.presentationController.showTransferScreen();
          }
          break;
        case OLBConstants.MFA_FLOW_TYPES.INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE:
          if(isFastTransferEnabled) {
            var accountsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "HomepageMA", "moduleName" : "AccountsUIModule"});
            accountsModule.presentationController.showAccountsDashboard();
          } else {
            var transferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "TransfersMA", "moduleName" : currentTransferModule});
            transferModule.presentationController.showTransferScreen();
          }
          break;
        case OLBConstants.MFA_FLOW_TYPES.INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE:
          if(isFastTransferEnabled) {
            var accountsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "HomepageMA", "moduleName" : "AccountsUIModule"});
            accountsModule.presentationController.showAccountsDashboard();
          } else {
            var transferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "TransfersMA", "moduleName" : currentTransferModule});
            transferModule.presentationController.showTransferScreen();
          }
          break;
        case OLBConstants.MFA_FLOW_TYPES.TRANSFER_BETWEEN_OWN_ACCOUNT_UPDATE:
          if(isFastTransferEnabled) {
            var accountsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "HomepageMA", "moduleName" : "AccountsUIModule"});
            accountsModule.presentationController.showAccountsDashboard();
          } else {
            var transferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "TransfersMA", "moduleName" : currentTransferModule});
            transferModule.presentationController.editTransactionSuccess();
          }
          break;
        case OLBConstants.MFA_FLOW_TYPES.INTRA_BANK_FUND_TRANSFER_UPDATE:
          if(isFastTransferEnabled) {
            var accountsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "HomepageMA", "moduleName" : "AccountsUIModule"});
            accountsModule.presentationController.showAccountsDashboard();
          } else {
            var transferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "TransfersMA", "moduleName" : currentTransferModule});
            transferModule.presentationController.editTransactionSuccess();
          }
          break;
        case OLBConstants.MFA_FLOW_TYPES.INTER_BANK_ACCOUNT_FUND_TRANSFER_UPDATE:
          if(isFastTransferEnabled) {
            var accountsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "HomepageMA", "moduleName" : "AccountsUIModule"});
            accountsModule.presentationController.showAccountsDashboard();
          } else {
            var transferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "TransfersMA", "moduleName" : currentTransferModule});
            transferModule.presentationController.editTransactionSuccess();
          }
          break;
        case OLBConstants.MFA_FLOW_TYPES.INTERNATIONAL_ACCOUNT_FUND_TRANSFER_UPDATE:
          if(isFastTransferEnabled) {
            var accountsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "HomepageMA", "moduleName" : "AccountsUIModule"});
            accountsModule.presentationController.showAccountsDashboard();
          } else {
            var transferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "TransfersMA", "moduleName" : currentTransferModule});
            transferModule.presentationController.editTransactionSuccess();
          }
          break;
          case OLBConstants.MFA_FLOW_TYPES.CREATE_BULKWIRE_TRANSFER:
            var wireTransferNewModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName": "WireTransferNewUIModule","appName": "WireTransferMA"});
            var params = {
              "formName" : "frmBulkTransferFiles"
            };
            wireTransferNewModule.presentationController.showBulkwirefiles(params);
          break;
          case OLBConstants.MFA_FLOW_TYPES.CREATE_BULKWIRE_TRANSFER_TEMPLATE:
            var wireTransferNewModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName": "WireTransferNewUIModule","appName": "WireTransferMA"});
            var params = {
              "formName" : "frmMakeBulkTransferTemplate",
              "bulkWireCategoryFilter": OLBConstants.BULKWIRE_CATEGORY_FILTER.TEMPLATES            };
            wireTransferNewModule.presentationController.showBulkwirefiles(params);
          break;
        case BBConstants.CREATE_TRANSACTION_SUCCESS:
        case BBConstants.EXECUTE_TEMPLATE_SUCCESS:
        case BBConstants.FETCH_UPLOADED_ACH_FILE:
          applicationManager.getNavigationManager().navigateTo("frmACHDashboard");
          applicationManager.getNavigationManager().updateForm({
            "key"          : BBConstants.SHOW_ACH_TEMPLATES_TAB,
            "responseData" : null
          },"frmACHDashboard"); 
          break;
          case "PSD2_TPP_CONSENT_REVOKED":
            var profileModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "PSD2ConsentUIModule", "appName" : "ConsentMgmtMA"});
            profileModule.presentationController.showManageAccountAccess();
            break;
        case "ADD_PHONE_NUMBER":
          applicationManager.getNavigationManager().navigateTo("frmSettingsAddPhoneNumber");
          kony.application.dismissLoadingScreen();
          break;
        case "UPDATE_PHONE_NUMBER":
          applicationManager.getNavigationManager().navigateTo("frmSettingsEditPhoneNumber");
          kony.application.dismissLoadingScreen();
          break;
        case "REMOVE_PHONE_NUMBER":
          applicationManager.getNavigationManager().navigateTo("frmSettingsPhoneNumbers");
          kony.application.dismissLoadingScreen();
          break;
        case "ADD_EMAIL":
          applicationManager.getNavigationManager().navigateTo("frmProfileAddEmail");
          kony.application.dismissLoadingScreen();
          break;
        case "UPDATE_EMAIL":
          applicationManager.getNavigationManager().navigateTo("frmProfileEditEmail");
          kony.application.dismissLoadingScreen();
          break;
        case "REMOVE_EMAIL":
          applicationManager.getNavigationManager().navigateTo("frmProfileEmail");
          kony.application.dismissLoadingScreen();
          break;
        case "SUSPEND_USER":
          applicationManager.getNavigationManager().navigateTo("frmeBankingAccess");
          kony.application.dismissLoadingScreen();
          break;
      }
    },
    navigateToTransactionScreen: function (response) {
      var mfaManager = applicationManager.getMFAManager();
      var flowType = mfaManager.getMFAFlowType();
      var isFastTransferEnabled = applicationManager.getConfigurationManager().isFastTransferEnabled;
      var geography = applicationManager.getConfigurationManager().configurations.items.DEPLOYMENTGEOGRAPHY;
      var currentTransferModule = isFastTransferEnabled ? "TransferFastUIModule" : "TransferModule";
      if(geography === "EUROPE"){
         currentTransferModule = "TransferEurUIModule";
      }
      if (applicationManager.gblDeepLink === "true") {
                const navManager = applicationManager.getNavigationManager();
				navManager.setCustomInfo("frmMFATransactions", response);
				navManager.navigateTo({
                "appName": "OpenBankingMA",
                "friendlyName": "OpenBankingUIModule/frmConsentVerifyDetails"
            });
				return;
	    }
      switch (flowType) {
        case OLBConstants.MFA_FLOW_TYPES.TRANSFERS:
          var transferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "TransfersMA", "moduleName" : currentTransferModule});
          transferModule.presentationController.createTransferMFAErrorCallback(response);
          break;
        case OLBConstants.MFA_FLOW_TYPES.DOMESTIC_WIRE_TRANSFER:
          var wireTransferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName": "WireTransferNewUIModule","appName": "WireTransferMA"});
          wireTransferModule.presentationController.showMakeTransferError(response);
          break;
        case OLBConstants.MFA_FLOW_TYPES.INTERNATIONAL_WIRE_TRANSFER:
          var wireTransferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName": "WireTransferNewUIModule","appName": "WireTransferMA"});
          wireTransferModule.presentationController.showMakeTransferError(response);
          break;
        case OLBConstants.MFA_FLOW_TYPES.SINGLE_BILL_PAY:
          var billPayModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "BillPayMA", "moduleName" : "BillPaymentUIModule"});
          billPayModule.presentationController.singleBillPayFailureCallBack(response);
          break;
        case OLBConstants.MFA_FLOW_TYPES.PAY_A_PERSON:
          var p2pModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("PayAPersonModule");
          p2pModule.presentationController.createP2PSendMoneyFailure(response);
          break;
        case OLBConstants.MFA_FLOW_TYPES.TRANSFERS_EURO:
          var transferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "TransfersMA", "moduleName" : currentTransferModule});
          transferModule.presentationController.createTransferMFAErrorCallback(response);
          break;
        case OLBConstants.MFA_FLOW_TYPES.BULK_BILL_PAY:
          var billPayModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "BillPayMA", "moduleName" : "BillPaymentUIModule"});
          billPayModule.presentationController.createBulkPaymentsErrorCallBack(response);
          break;
        case OLBConstants.MFA_FLOW_TYPES.ONE_TIME_WIRE_TRANSFERS:
          var wireTransferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName": "WireTransferNewUIModule","appName": "WireTransferMA"});
          wireTransferModule.presentationController.showOneTimeTransferError(response);
          break;
        case OLBConstants.MFA_FLOW_TYPES.TRANSFERS_UPDATE:
          var transferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "TransfersMA", "moduleName" : currentTransferModule});
          transferModule.presentationController.editTransactionError(response);
          break;
        case OLBConstants.MFA_FLOW_TYPES.LoginMFA:
          var authModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("AuthModule");
          authModule.presentationController.onLoginFailure(response);
          break;
        case "UPDATE_USERNAME":
          var profileModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ProfileModule");
          profileModule.presentationController.updateUsernameFailure(response);
          break;
        case "UPDATE_PASSWORD":
          var profileModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"});
          profileModule.presentationController.updatePasswordFailure(response);
          break;
        case "SECURITYQUESTION_RESET":
            var profileModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"});
            profileModule.presentationController.updateSecurityQuestionsFailure(response);
          break;
        case "LOCK_CARD":
          var cardManagementModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "ManageCardsUIModule", "appName" : "CardsMA"});
          cardManagementModule.presentationController.lockCardFailure(response);
          break;
        case "UNLOCK_CARD":
          var cardManagementModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "ManageCardsUIModule", "appName" : "CardsMA"});
          cardManagementModule.presentationController.unlockCardFailure(response);
          break;
        case "CHANGE_PIN_DEBIT":
          var cardManagementModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "ManageCardsUIModule", "appName" : "CardsMA"});
          cardManagementModule.presentationController.changePinFailure(response);
          break;
        case "REPORT_LOST":
          var cardManagementModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "ManageCardsUIModule", "appName" : "CardsMA"});
          cardManagementModule.presentationController.reportLostFailure(response);
          break;
        case "CANCEL_CARD":
          var cardManagementModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "ManageCardsUIModule", "appName" : "CardsMA"});
          cardManagementModule.presentationController.cancelCardFailure(response);
          break;
        case "REPLACE_CARD":
          var cardManagementModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "ManageCardsUIModule", "appName" : "CardsMA"});
          cardManagementModule.presentationController.replaceCardFailure(response);
          break;
        case "ACTIVATE_CARD":
            var cardManagementModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "ManageCardsUIModule", "appName" : "CardsMA"});
            cardManagementModule.presentationController.activateCardFailure(response);
            break;
        case "APPLY_FOR_DEBIT_CARD":
            var cardManagementModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "ManageCardsUIModule", "appName" : "CardsMA"});
            cardManagementModule.presentationController.applyNewCardError(response);
            break;
        case "CHANGE_PIN_CREDIT":
          var cardManagementModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "ManageCardsUIModule", "appName" : "CardsMA"});
          cardManagementModule.presentationController.createCardRequestFailure(response);
          break;
          case "UPDATE_PURCHASE":
            var cardManagementModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
              "moduleName": "ManageCardsUIModule",
              "appName": "CardsMA"
            });
            cardManagementModule.presentationController.updatePurchaseLimitFailure(response);
            break;
          case "UPDATE_WITHDRAWAL":
            var cardManagementModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
              "moduleName": "ManageCardsUIModule",
              "appName": "CardsMA"
            });
            cardManagementModule.presentationController.updateWithdrawalLimitFailure(response);
            break;
        case "PAY_MULTIPLE_BENEFICIARIES":
          var payMultipleBeneficiariesModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("PayMultipleBeneficiariesModule");
          payMultipleBeneficiariesModule.presentationController.createBulkTransferErrorCallBack(response);
          break;
        case OLBConstants.MFA_FLOW_TYPES.BULK_BILL_PAYMENT:
          var billPayModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "BillPayMA", "moduleName" : "BillPaymentUIModule"});
          billPayModule.presentationController.createBulkPaymentsErrorCallBack(response);
          break;
        case OLBConstants.MFA_FLOW_TYPES.SINGLE_BILL_PAYMENT:
          var billPayModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "BillPayMA", "moduleName" : "BillPaymentUIModule"});
          billPayModule.presentationController.singleBillPayFailureCallBack(response);
          break;
        case OLBConstants.MFA_FLOW_TYPES.UPDATE_BILL_PAYMENT:
          var billPayModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "BillPayMA", "moduleName" : "BillPaymentUIModule"});
          billPayModule.presentationController.singleBillPayFailureCallBack(response);
          break;
        case OLBConstants.MFA_FLOW_TYPES.P2P_CREATE:
          if(isFastTransferEnabled) {
            var transferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "TransfersMA", "moduleName" : currentTransferModule});
            transferModule.presentationController.createTransferMFAErrorCallback(response);
          } else {
            var p2pModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("PayAPersonModule");
            p2pModule.presentationController.createP2PSendMoneyFailure(response);
          }
          break;
        case OLBConstants.MFA_FLOW_TYPES.P2P_EDIT:
          if (isFastTransferEnabled) {
            var transferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "TransfersMA", "moduleName" : currentTransferModule});
            transferModule.presentationController.editTransactionError(response);
          } else {
            var p2pModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("PayAPersonModule");
            p2pModule.presentationController.createP2PSendMoneyFailure(response);
          }
          break;
        case OLBConstants.MFA_FLOW_TYPES.TRANSFER_BETWEEN_OWN_ACCOUNT_CREATE:
          var transferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "TransfersMA", "moduleName" : currentTransferModule});
          transferModule.presentationController.createTransferMFAErrorCallback(response);
          break;
        case OLBConstants.MFA_FLOW_TYPES.INTRA_BANK_FUND_TRANSFER_CREATE:
          var transferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "TransfersMA", "moduleName" : currentTransferModule});
          transferModule.presentationController.createTransferMFAErrorCallback(response);
          break;
        case OLBConstants.MFA_FLOW_TYPES.INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE:
          var transferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "TransfersMA", "moduleName" : currentTransferModule});
          transferModule.presentationController.createTransferMFAErrorCallback(response);
          break;
        case OLBConstants.MFA_FLOW_TYPES.INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE:
          var transferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "TransfersMA", "moduleName" : currentTransferModule});
          transferModule.presentationController.createTransferMFAErrorCallback(response);
          break;
        case OLBConstants.MFA_FLOW_TYPES.TRANSFER_BETWEEN_OWN_ACCOUNT_UPDATE:
          var transferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "TransfersMA", "moduleName" : currentTransferModule});
          transferModule.presentationController.editTransactionError(response);
          break;
        case OLBConstants.MFA_FLOW_TYPES.INTRA_BANK_FUND_TRANSFER_UPDATE:
          var transferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "TransfersMA", "moduleName" : currentTransferModule});
          transferModule.presentationController.editTransactionError(response);
          break;
        case OLBConstants.MFA_FLOW_TYPES.INTER_BANK_ACCOUNT_FUND_TRANSFER_UPDATE:
          var transferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "TransfersMA", "moduleName" : currentTransferModule});
          transferModule.presentationController.editTransactionError(response);
          break;
        case OLBConstants.MFA_FLOW_TYPES.INTERNATIONAL_ACCOUNT_FUND_TRANSFER_UPDATE:
          var transferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "TransfersMA", "moduleName" : currentTransferModule});
          transferModule.presentationController.editTransactionError(response);
          break;
          case OLBConstants.MFA_FLOW_TYPES.CREATE_BULKWIRE_TRANSFER:
            var wireTransferNewModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName": "WireTransferNewUIModule","appName": "WireTransferMA"});
            wireTransferNewModule.presentationController.onCreateBulkWireTransactionFailure(response);
          break;
          case OLBConstants.MFA_FLOW_TYPES.CREATE_BULKWIRE_TRANSFER_TEMPLATE:
            var wireTransferNewModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName": "WireTransferNewUIModule","appName": "WireTransferMA"});
            wireTransferNewModule.presentationController.onCreateBulkWireTemplateTransactionFailure(response);
          break;
          case "PSD2_TPP_CONSENT_REVOKED":
            var profileModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "PSD2ConsentUIModule", "appName" : "ConsentMgmtMA"});
            profileModule.presentationController.showManageAccountAccess();
            break;
        case "ADD_PHONE_NUMBER":
          var settingsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"});
          settingsModule.presentationController.savePhoneNumberFailureCallBack(response);
          break;
        case "UPDATE_PHONE_NUMBER":
          var settingsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"});
          settingsModule.presentationController.editPhoneNumberFailure(response);
          break;
        case "REMOVE_PHONE_NUMBER":
          var settingsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"});
          settingsModule.presentationController.deletePhoneFailure(response);
          break;
        case "ADD_EMAIL":
          var settingsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"});
          settingsModule.presentationController.saveEmailFailureCallBack(response);
          break;
        case "UPDATE_EMAIL":
          var settingsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"});
          settingsModule.presentationController.editEmailFailure(response);
          break;
        case "REMOVE_EMAIL":
          var settingsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"});
          settingsModule.presentationController.deleteEmailFailure(response);
          break;
        case "SUSPEND_USER":
          var settingsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"});
          settingsModule.presentationController.disableEBankingAccessError(response);
          break;
          case "CREATE_CHEQUE_BOOK_REQUEST":
            var transferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "StopPaymentsUIModule", "appName" : "ArrangementsMA"});
            transferModule.presentationController.createChequeBookError(response);
            break;
      }
    },
    verifySecurityQuestions: function (data) {
      var mfaManager = applicationManager.getMFAManager();
      var inputparams = {
        "MFAAttributes": {
          "serviceName": mfaManager.getServiceId(),
          "serviceKey": mfaManager.getServicekey(),
          "securityQuestions": data
        }
      };
      mfaManager.verifySecurityQuestions(inputparams);
    },
    resendOTP: function (data) {
      var mfaManager = applicationManager.getMFAManager();
      var inputparams = {
        "MFAAttributes": {
          "serviceName": mfaManager.getServiceId(),
          "serviceKey": mfaManager.getServicekey(),
          "OTP": data
        }
      };
      mfaManager.resendOTP(inputparams);
    },
    requestOTP: function (data) {
      var mfaManager = applicationManager.getMFAManager();
      var inputparams = {
        "MFAAttributes": {
          "serviceName": mfaManager.getServiceId(),
          "serviceKey": mfaManager.getServicekey(),
          "OTP": data
        }
      };
      mfaManager.requestOTP(inputparams);
    },
    verifyOTP: function (data) {
      var mfaManager = applicationManager.getMFAManager();
      var inputparams = {
        "MFAAttributes": {
          "serviceName": mfaManager.getServiceId(),
          "serviceKey": mfaManager.getServicekey(),
          "OTP": data
        }
      };
      mfaManager.verifyOTP(inputparams);
    },
    enteredIncorrectOTP: function (error) {
      var mfaManager = applicationManager.getMFAManager();
      var flowType = mfaManager.getMFAFlowType();
      switch (flowType) {
        case OLBConstants.MFA_FLOW_TYPES.LoginMFA:
          // applicationManager.getNavigationManager().navigateTo("frmMFAPreLogin");
          // applicationManager.getNavigationManager().updateForm({
          //   otpIncorrect: error
          // }, "frmMFAPreLogin");
          applicationManager.getNavigationManager().updateForm({
            "action" : "OTP",
            otpIncorrect: error
          }, "frmLogin");
          break;
        default:
          new kony.mvc.Navigation({"appName" : "CommonsMA", "friendlyName" : "frmMFATransactions"}).navigate();
          applicationManager.getNavigationManager().updateForm({
            otpIncorrect: error
          }, "frmMFATransactions");
          break;
      }
    },
    enteredIncorrectAnswer: function (error) {
      var mfaManager = applicationManager.getMFAManager();
      var flowType = mfaManager.getMFAFlowType();
      switch (flowType) {
        case OLBConstants.MFA_FLOW_TYPES.LoginMFA:
          // applicationManager.getNavigationManager().navigateTo("frmMFAPreLogin");
          // applicationManager.getNavigationManager().updateForm({
          //   securityAnswerIncorrect: error
          // }, "frmMFAPreLogin");
          applicationManager.getNavigationManager().updateForm({
            "action" : "securityQuestions",
            securityAnswerIncorrect: error
          }, "frmLogin");
          break;
        default:
          new kony.mvc.Navigation({"appName" : "CommonsMA", "friendlyName" : "frmMFATransactions"}).navigate();
          applicationManager.getNavigationManager().updateForm({
            securityAnswerIncorrect: error
          }, "frmMFATransactions");
          break;
      }
    },
    navigateToAckScreen: function (response) {
      var mfaManager = applicationManager.getMFAManager();
      var userpreferencesManager = applicationManager.getUserPreferencesManager();
      var flowType = mfaManager.getMFAFlowType();
      var serviceKey = mfaManager.getServicekey();
      var isFastTransferEnabled = applicationManager.getConfigurationManager().isFastTransferEnabled;
      var geography = applicationManager.getConfigurationManager().configurations.items.DEPLOYMENTGEOGRAPHY;
      var currentTransferModule = isFastTransferEnabled ? "TransferFastUIModule" : "TransferModule";
      if(geography === "EUROPE"){
         currentTransferModule = "TransferEurUIModule";
      }
      if (applicationManager.gblDeepLink === "true") {
				var openBankingMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                "moduleName": "OpenBankingUIModule",
                "appName": "OpenBankingMA"
			    });
			    openBankingMod.presentationController.approvePaymentConsentSucc(response);
				return;
	  }
      switch (flowType) {
        case OLBConstants.MFA_FLOW_TYPES.FAST_TRANSFERS:
          var transferFastModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "TransfersMA", "moduleName" : "TransferFastUIModule"});
          transferFastModule.presentationController.createTransferSuccessCallback(response);
          break;
        case OLBConstants.MFA_FLOW_TYPES.TRANSFERS:
          var transferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "TransfersMA", "moduleName" : currentTransferModule});
          transferModule.presentationController.createTransferSuccessCallback(response);
          break;
        case OLBConstants.MFA_FLOW_TYPES.DOMESTIC_WIRE_TRANSFER:
          var wireTransferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName": "WireTransferNewUIModule","appName": "WireTransferMA"});
          wireTransferModule.presentationController.showMakeTransferAcknowledgement(response);
          break;
        case OLBConstants.MFA_FLOW_TYPES.INTERNATIONAL_WIRE_TRANSFER:
          var wireTransferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName": "WireTransferNewUIModule","appName": "WireTransferMA"});
          wireTransferModule.presentationController.showMakeTransferAcknowledgement(response);
          break;
        case OLBConstants.MFA_FLOW_TYPES.SINGLE_BILL_PAY:
          var billPayModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "BillPayMA", "moduleName" : "BillPaymentUIModule"});
          billPayModule.presentationController.singleBillPaySuccessCallBack(response);
          break;
        case OLBConstants.MFA_FLOW_TYPES.PAY_A_PERSON:
          var p2pModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("PayAPersonModule");
          p2pModule.presentationController.createP2PSendMoneySuccess(response);
          break;
        case OLBConstants.MFA_FLOW_TYPES.TRANSFERS_EURO:
          var transferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "TransfersMA", "moduleName" : currentTransferModule});
          transferModule.presentationController.createTransferSuccessCallback(response);
          break;
        case OLBConstants.MFA_FLOW_TYPES.BULK_BILL_PAY:
          var billPayModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "BillPayMA", "moduleName" : "BillPaymentUIModule"});
          billPayModule.presentationController.createBulkPaymentsSuccessCallBack(response);
          break;
        case OLBConstants.MFA_FLOW_TYPES.ONE_TIME_WIRE_TRANSFERS:
          var wireTransferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName": "WireTransferNewUIModule","appName": "WireTransferMA"});
          wireTransferModule.presentationController.showOneTimeTransferAcknowledgement(response);
          break;
        case OLBConstants.MFA_FLOW_TYPES.TRANSFERS_UPDATE:
          var transferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "TransfersMA", "moduleName" : currentTransferModule});
          transferModule.presentationController.editTransactionSuccess(response);
          break;
        case OLBConstants.MFA_FLOW_TYPES.LoginMFA:
          var authModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("AuthModule");
          authModule.presentationController.onLoginMFA(serviceKey);
          break;
        case "UPDATE_USERNAME":
          var userName = mfaManager.getUserName();
          userpreferencesManager.setCurrentUserName(userName);
          var authModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("AuthModule");
          authModule.presentationController.doLogout({
            "text": "username",
            "action": "userNamePasswordSuccessfullyChanged"
          });
          break;
        case "UPDATE_PASSWORD":
          var authModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("AuthModule");
          authModule.presentationController.doLogout({
            "text": "password",
            "action": "userNamePasswordSuccessfullyChanged"
          });
          break;
        case "SECURITYQUESTION_RESET":
            var profileModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"});
            profileModule.presentationController.updateSecurityQuestions();
          break;
        case "LOCK_CARD":
          var cardManagementModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "ManageCardsUIModule", "appName" : "CardsMA"});
          cardManagementModule.presentationController.lockCardSuccess(response);
          break;
        case "UNLOCK_CARD":
          var cardManagementModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "ManageCardsUIModule", "appName" : "CardsMA"});
          cardManagementModule.presentationController.unlockCardSuccess(response);
          break;
        case "CHANGE_PIN_DEBIT":
          var cardManagementModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "ManageCardsUIModule", "appName" : "CardsMA"});
          cardManagementModule.presentationController.changePinSuccess(response);
          break;
        case "REPORT_LOST":
          var cardManagementModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "ManageCardsUIModule", "appName" : "CardsMA"});
          cardManagementModule.presentationController.reportLostSuccess(response);
          break;
        case "CANCEL_CARD":
          var cardManagementModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "ManageCardsUIModule", "appName" : "CardsMA"});
          cardManagementModule.presentationController.cancelCardSuccess(response);
          break;
        case "REPLACE_CARD":
          var cardManagementModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "ManageCardsUIModule", "appName" : "CardsMA"});
          cardManagementModule.presentationController.replaceCardSuccess(response);
          break;
        case "ACTIVATE_CARD":
          var cardManagementModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "ManageCardsUIModule", "appName" : "CardsMA"});
          cardManagementModule.presentationController.activateCardSuccess(response);
          break;
        case "APPLY_FOR_DEBIT_CARD":
          var cardManagementModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "ManageCardsUIModule", "appName" : "CardsMA"});
          cardManagementModule.presentationController.applyNewCardSuccess(response);
          break;
        case "CHANGE_PIN_CREDIT":
          var cardManagementModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "ManageCardsUIModule", "appName" : "CardsMA"});
          cardManagementModule.presentationController.createCardRequestSuccess(response);
          break;
        case "UPDATE_PURCHASE":
            var cardManagementModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "ManageCardsUIModule", "appName" : "CardsMA"});
            cardManagementModule.presentationController.updatePurchaseLimitSuccess(response);
            break;
        case "UPDATE_WITHDRAWAL":
            var cardManagementModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "ManageCardsUIModule", "appName" : "CardsMA"});
            cardManagementModule.presentationController.updateWithdrawalLimitSuccess(response);
            break;
        case "PAY_MULTIPLE_BENEFICIARIES":
          var payMultipleBeneficiariesModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "TransfersMA", "moduleName" : "PayMultipleBeneficiariesUIModule"});
          payMultipleBeneficiariesModule.presentationController.createBulkTransferSuccessCallBack(response);
          break;
        case OLBConstants.MFA_FLOW_TYPES.BULK_BILL_PAYMENT:
          var billPayModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "BillPayMA", "moduleName" : "BillPaymentUIModule"});
          billPayModule.presentationController.createBulkPaymentsSuccessCallBack(response);
          break;
        case OLBConstants.MFA_FLOW_TYPES.SINGLE_BILL_PAYMENT:
          var billPayModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "BillPayMA", "moduleName" : "BillPaymentUIModule"});
          billPayModule.presentationController.singleBillPaySuccessCallBack(response);
          break;
        case OLBConstants.MFA_FLOW_TYPES.UPDATE_BILL_PAYMENT:
          var billPayModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "BillPayMA", "moduleName" : "BillPaymentUIModule"});
          billPayModule.presentationController.singleBillPaySuccessCallBack(response);
          break;
        case OLBConstants.MFA_FLOW_TYPES.P2P_CREATE:
          if(isFastTransferEnabled) {
            var transferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "TransfersMA", "moduleName" : currentTransferModule});
            transferModule.presentationController.createTransferSuccessCallback(response);
          } else {
            var p2pModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("PayAPersonModule");
            p2pModule.presentationController.createP2PSendMoneySuccess(response);
          }
          break;
        case OLBConstants.MFA_FLOW_TYPES.P2P_EDIT:
          if (isFastTransferEnabled) {
            var transferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "TransfersMA", "moduleName" : currentTransferModule});
            transferModule.presentationController.editTransactionSuccess(response);
          } else {
            var p2pModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("PayAPersonModule");
            p2pModule.presentationController.createP2PSendMoneySuccess(response);
          }
          break;
        case OLBConstants.MFA_FLOW_TYPES.TRANSFER_BETWEEN_OWN_ACCOUNT_CREATE:
          var transferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "TransfersMA", "moduleName" : currentTransferModule});
          transferModule.presentationController.createTransferSuccessCallback(response);
          break;
        case OLBConstants.MFA_FLOW_TYPES.INTRA_BANK_FUND_TRANSFER_CREATE:
          var transferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "TransfersMA", "moduleName" : currentTransferModule});
          transferModule.presentationController.createTransferSuccessCallback(response);
          break;
        case OLBConstants.MFA_FLOW_TYPES.INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE:
          var transferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "TransfersMA", "moduleName" : currentTransferModule});
          transferModule.presentationController.createTransferSuccessCallback(response);
          break;
        case OLBConstants.MFA_FLOW_TYPES.INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE:
          var transferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "TransfersMA", "moduleName" : currentTransferModule});
          transferModule.presentationController.createTransferSuccessCallback(response);
          break;
        case OLBConstants.MFA_FLOW_TYPES.TRANSFER_BETWEEN_OWN_ACCOUNT_UPDATE:
          var transferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "TransfersMA", "moduleName" : currentTransferModule});
          transferModule.presentationController.editTransactionSuccess(response);
          break;
        case OLBConstants.MFA_FLOW_TYPES.INTRA_BANK_FUND_TRANSFER_UPDATE:
          var transferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "TransfersMA", "moduleName" : currentTransferModule});
          transferModule.presentationController.editTransactionSuccess(response);
          break;
        case OLBConstants.MFA_FLOW_TYPES.INTER_BANK_ACCOUNT_FUND_TRANSFER_UPDATE:
          var transferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "TransfersMA", "moduleName" : currentTransferModule});
          transferModule.presentationController.editTransactionSuccess(response);
          break;
        case OLBConstants.MFA_FLOW_TYPES.INTERNATIONAL_ACCOUNT_FUND_TRANSFER_UPDATE:
          var transferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "TransfersMA", "moduleName" : currentTransferModule});
          transferModule.presentationController.editTransactionSuccess(response);
          break;
        case OLBConstants.MFA_FLOW_TYPES.CREATE_BULKWIRE_TRANSFER:
          var wireTransferNewModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName": "WireTransferNewUIModule","appName": "WireTransferMA"});
          wireTransferNewModule.presentationController.showBulkWireAcknowlegmentScreen(response);
          break;  
        case OLBConstants.MFA_FLOW_TYPES.CREATE_BULKWIRE_TRANSFER_TEMPLATE:
          var wireTransferNewModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName": "WireTransferNewUIModule","appName": "WireTransferMA"});
          wireTransferNewModule.presentationController.showBulkWireAcknowlegmentScreen(response);
          break;  
        case BBConstants.CREATE_TRANSACTION_SUCCESS:
        case BBConstants.EXECUTE_TEMPLATE_SUCCESS:
         var ACHModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ACHModule");
         ACHModule.presentationController.createACHTransactionSuccess(response);
         break;
        case BBConstants.FETCH_UPLOADED_ACH_FILE:
          var ACHModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ACHModule");
         ACHModule.presentationController.onUploadSuccess(response);
         break;
         case "PSD2_TPP_CONSENT_REVOKED":
            var profileModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "PSD2ConsentUIModule", "appName" : "ConsentMgmtMA"});
            profileModule.presentationController.showManageAccountAccess();
            break;
        case "ADD_PHONE_NUMBER":
          var settingsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"});
          settingsModule.presentationController.savePhoneNumberSuccessCallBack(response);
          break;
        case "UPDATE_PHONE_NUMBER":
          var settingsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"});
          settingsModule.presentationController.editPhoneNumberSuccess(response);
          break;
        case "REMOVE_PHONE_NUMBER":
          var settingsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"});
          settingsModule.presentationController.deletePhoneSuccess(response);
          break;
        case "ADD_EMAIL":
          var settingsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"});
          settingsModule.presentationController.saveEmailSuccessCallBack(response);
          break;
        case "UPDATE_EMAIL":
          var settingsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"});
          settingsModule.presentationController.editEmailSuccess(response);
          break;
        case "REMOVE_EMAIL":
          var settingsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"});
          settingsModule.presentationController.deleteEmailSuccess(response);
          break;
        case "SUSPEND_USER":
          var settingsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"});
          settingsModule.presentationController.disableEBankingAccessSuccess(response);
          break;
          case "CREATE_CHEQUE_BOOK_REQUEST":
            var transferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "StopPaymentsUIModule", "appName" : "ArrangementsMA"});
            transferModule.presentationController.createChequeBookSuccess(response);
            break;
      }

    },
    setSecureCodeScreen: function (response) {
      var mfaManager = applicationManager.getMFAManager();
      var MFAResponse = mfaManager.getMFAResponse();
      if (MFAResponse.MFAAttributes.communicationType === "DISPLAY_NO_VALUE") {
        applicationManager.getPresentationUtility().MFA.navigateToDefaultMFAScreen(response);
      } else if (MFAResponse.MFAAttributes.communicationType === "DISPLAY_ALL") {
        applicationManager.getPresentationUtility().MFA.showMFAOTPScreen(response);
      } else {
        applicationManager.getPresentationUtility().MFA.navigateToPrimaryMFAScreen(response);
      }
    },
    getServiceIdBasedOnDisplayName: function (displayName) {
      var configManager = applicationManager.getConfigurationManager();
      var mfaManager = applicationManager.getMFAManager();
      var services = configManager.getServicesListForUser();
      for (var i = 0; i < services.length; i++) {
        if (services[i].displayName === displayName) {
          mfaManager.setServiceId(services[i].serviceId);
        }
      }
    },
    mfaOTPError: function (error) {
      var mfaManager = applicationManager.getMFAManager();
      var flowType = mfaManager.getMFAFlowType();
      switch (flowType) {
        case OLBConstants.MFA_FLOW_TYPES.LoginMFA:
          // applicationManager.getNavigationManager().navigateTo("frmMFAPreLogin");
          // applicationManager.getNavigationManager().updateForm({
          //   otpRequestFailed: error
          // }, "frmMFAPreLogin");
          applicationManager.getNavigationManager().updateForm({
            "action" : "OTP",
            otpRequestFailed: error
          }, "frmLogin");
          break;
        default:
          new kony.mvc.Navigation({"appName" : "CommonsMA", "friendlyName" : "frmMFATransactions"}).navigate();
          applicationManager.getNavigationManager().updateForm({
            otpRequestFailed: error
          }, "frmMFATransactions");
          break;
      }
    },
    getDisplayNameForTransfer: function (key) {
      var displayName = "";
      if (key === "OWN_INTERNAL_ACCOUNTS") {
        displayName = "KonyBankAccountsTransfer";
      }
      else if (key === "OTHER_INTERNAL_MEMBER") {
        displayName = "OtherKonyAccountsTransfer";
      }
      else if (key === "OTHER_EXTERNAL_ACCOUNT") {
        displayName = "OtherBankAccountsTransfer";
      }
      else if (key === "INTERNATIONAL_ACCOUNT") {
        displayName = "InternationalAccountsTransfer";
      } else if (key === "Domestic") {
        displayName = "DomesticWireTransfer";
      } else if (key === "P2P_ACCOUNT") {
        displayName = "PayAPerson";
      } else {
        displayName = "InternationalWireTransfer";
      }
      return displayName;
    },

    navigateToMFAComponent: function (response) {
      new kony.mvc.Navigation({"appName" : "CommonsMA", "friendlyName" : "frmMFATransactions"}).navigate();
      applicationManager.getNavigationManager().updateForm({
        "mfa": response
      }, "frmMFATransactions");
    },
    
    isSCAEnabled: function() {
            if (OLBConstants.CLIENT_PROPERTIES.SPOTLIGHT_DISABLE_SCA && OLBConstants.CLIENT_PROPERTIES.SPOTLIGHT_DISABLE_SCA.toUpperCase() === "FALSE")
                return true;
            else
                return false;
        },

    };

    PresentationUtility.prototype.SCA = {
        /* 
         *  This method is used to set the transaction details for SCA flow.
            It has to be invoked whenever SCA validation is required from reqpective business/presentation controllers
        */
        setSCATransactionDetails: function (flowType, params) {
            SCAConfiguration.setEventDetails(flowType, params);
        },

        getRequestParams: function () {
            return SCAConfiguration.getRequestParams();
        },

  };

   /**
    * @function : formatText
    * @description : This function is used to format the text
    * @param {String} accountName The account name
    * @param {Number} noOfChars number of characters
    * @param {String} accountNumber The account number
    * @param {Number} beginIndex The starting index
    * @returns {String} formattedAccName returns the formatted account name
    */
   PresentationUtility.prototype.formatText = function(accountName,noOfChars,accountNumber,beginIndex) {
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