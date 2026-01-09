/**
 * Description of Module representing a MFA form.
 * @module  frmMFATransactionsController
 */
define(['CommonUtilities', 'OLBConstants', 'FormControllerUtility', 'ViewConstants'], function (CommonUtilities, OLBConstants, FormControllerUtility, ViewConstants) {
  this.customerPhone = "";
  this.customerEmail = "";
  return /** @alias module: frmMFATransactionsController */ {
    /**
    * AdjustScreen - Method that sets the height of footer properly.
    */
    AdjustScreen: function () {
      this.view.forceLayout();
      var mainheight;
      var screenheight = kony.os.deviceInfo().screenHeight;
      mainheight = this.view.customheader.info.frame.height + this.view.flxMain.info.frame.height;
      var diff = screenheight - mainheight;
      if (mainheight < screenheight) {
        diff = diff - this.view.flxFooter.info.frame.height;
        if (diff > 0) {
          this.view.flxFooter.top = mainheight + diff + 40 + "dp";
        } else {
          this.view.flxFooter.top = mainheight + 40 + "dp";
        }
      } else {
        this.view.flxFooter.top = mainheight + 40 + "dp";
      }
      this.view.flxFooter.top = "0dp";
      this.view.flxContent.height = kony.os.deviceInfo().screenHeight - this.view.flxHeader.height.replace('dp','') +'dp';
      this.view.forceLayout();
    },
    /**
     *  frmMFATransactionsPreShow - Pre show for this form.
    */
    frmMFATransactionsPreShow: function () {
      var scopeObj = this;
      FormControllerUtility.updateWidgetsHeightInInfo(this.view, ['customheader', 'flxMain', 'flxFooter', 'flxHeader']);
      this.view.customheader.forceCloseHamburger();
      this.view.customheader.topmenu.flxContextualMenu.setVisibility(false);
      this.view.customheader.topmenu.btnHamburger.skin = "btnHamburgerskn";
      this.view.customheader.topmenu.flxTransfersAndPay.skin = ViewConstants.SKINS.BLANK_SKIN_TOPMENU;
      this.view.customheader.topmenu.flxaccounts.skin = ViewConstants.SKINS.BLANK_SKIN_FLEX;
      this.view.OTPPostLogin.btnCancel.onClick = this.onCancelClick.bind(this);
      this.view.securityQuestions.btnCancel.onClick = this.onCancelClick.bind(this);
      this.view.OTPPostLogin.imgViewOTPCode.onTouchStart = this.showOTP.bind(this);
      this.view.OTPPostLogin.tbxEnterOTPCode.secureTextEntry = false;
      this.view.OTPPostLogin.imgViewOTPCode.setVisibility(false);
      this.view.securityQuestions.flxExtendedNotes.setVisibility(false);
      this.view.OTPPostLogin.flxExtendedNotes.setVisibility(false);
      this.view.OTPPostLogin.rtxHeaderOTP.setVisibility(true);
      this.view.OTPPostLogin.lblHeaderOTP.setVisibility(false);
      this.viewComponentScreen(false, false, false);
      this.setHamburgerMenu();
      this.assignToolTips();
      this.view.flxWarning.setVisibility(false);
      this.view.onBreakpointChange = function () {
        scopeObj.onBreakpointChange(kony.application.getCurrentBreakpoint());
      };
      applicationManager.getNavigationManager().applyUpdates(this);
      this.setFlowActions();
	  if (applicationManager.gblDeepLink === "true"){
           this.view.flxHeader.isVisible = false;
           this.view.flxHeaderConsent.isVisible = true;
		}
    },

    setFlowActions: function () {
      let scopeObj = this;

      scopeObj.view.OTPComponent.closeOTP = function () {
        scopeObj.onCancelClick();
      };

      scopeObj.view.OTPComponent.onFailureCallback = function (response, isTransactionalError) {
        scopeObj.mfaError(response, isTransactionalError);
      };

      scopeObj.view.OTPComponent.onSuccessCallback = function (response) {
        if (OLBConstants.CLIENT_PROPERTIES && OLBConstants.CLIENT_PROPERTIES.SPOTLIGHT_DISABLE_SCA && OLBConstants.CLIENT_PROPERTIES.SPOTLIGHT_DISABLE_SCA.toUpperCase() === "FALSE") {
          kony.application.dismissLoadingScreen();
          applicationManager.getPresentationUtility().MFA.navigateToAckScreen(response);
        }
      };

      scopeObj.view.OTPComponent.forceLayout = function (response) {
        if (response && response.hideError) {
          scopeObj.view.flxWarning.setVisibility(false);
        }
        scopeObj.view.forceLayout();
      };

      scopeObj.view.securityQuestionsComponent.closeSecurityQuestions = function () {
        scopeObj.onCancelClick();
      };

      scopeObj.view.securityQuestionsComponent.onSuccessCallback = function (response) {
        if (OLBConstants.CLIENT_PROPERTIES && OLBConstants.CLIENT_PROPERTIES.SPOTLIGHT_DISABLE_SCA && OLBConstants.CLIENT_PROPERTIES.SPOTLIGHT_DISABLE_SCA.toUpperCase() === "FALSE") {
          // TO DO : SCA has been enabled 
          // call verify securityQuestions service - below is sample code
          // FormControllerUtility.showProgressBar(this.view);
          // var data = this.onSaveAnswerSecurityQuestions(securityQuestions);
          // applicationManager.getPresentationUtility().MFA.verifySecurityQuestions(data);
        } else {
          kony.application.dismissLoadingScreen();
          applicationManager.getPresentationUtility().MFA.navigateToAckScreen(response);
        }
      };

      scopeObj.view.securityQuestionsComponent.onFailureCallback = function (response, isTransactionalError) {
        scopeObj.mfaError(response, isTransactionalError);
      };

      scopeObj.view.securityQuestionsComponent.forceLayout = function (response) {
        if (response && response.hideError) {
          scopeObj.view.flxWarning.setVisibility(false);
        }
        scopeObj.view.forceLayout();
      };

      scopeObj.view.SCAComponent.onCancel = function () {
        scopeObj.onCancelClick();
      };

      scopeObj.view.SCAComponent.onFailureCallback = function (response) {
        scopeObj.mfaError(response, null);
      };

      scopeObj.view.SCAComponent.onSuccessCallback = function (response) {
        //applicationManager.getPresentationUtility().MFA.navigateToAckScreen(response);
        scopeObj.scaServiceCall(response);
      };

      scopeObj.view.SCAUnikenComponent.onCancel = function () {
        scopeObj.onCancelClick();
      };

      scopeObj.view.SCAUnikenComponent.onFailureCallback = function (response) {
        scopeObj.mfaError(response, null);
      };

      scopeObj.view.SCAUnikenComponent.onSuccessCallback = function (response) {
        //applicationManager.getPresentationUtility().MFA.navigateToAckScreen(response);
        scopeObj.scaServiceCall(response);
      };
    },
    scaJSON: {},
    scaServiceCall: function () {
      let scopeObj = this;
      let params = {
        "serviceKey": scopeObj.scaJSON.serviceKey,
        "MFAAttributes": {
          "serviceName": scopeObj.scaJSON.serviceId,
          "serviceKey": scopeObj.scaJSON.serviceKey
        }
      };
      if (scopeObj.scaJSON.action)
        params.Action = scopeObj.scaJSON.action;



      function completionCallback(status, data, error) {
       //  let hasError = data === undefined || data.hasOwnProperty("dbpErrCode") || data.hasOwnProperty("dbpErrMsg") || data.opstatus.toString() !== "0";
        let hasError = data === undefined || data.hasOwnProperty("dbpErrCode") || data.hasOwnProperty("dbpErrMsg");
       if (status == kony.mvc.constants.STATUS_SUCCESS && !hasError) {
          data.serviceKey = scopeObj.scaJSON.serviceKey;
          applicationManager.getPresentationUtility().MFA.navigateToAckScreen(data);
        } else {
		  if (applicationManager.gblDeepLink === "true"){
						data = error;
					}
          if (hasError) scopeObj.scaFailureCallback(data);
          else scopeObj.scaFailureCallback(error);
        }
      }
      var userobj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository(scopeObj.scaJSON.dataModel);
      userobj.customVerb(scopeObj.scaJSON.operationName, params, completionCallback);
    },
    scaFailureCallback: function (response) {

      let scopeObj = this;
      var currform = kony.application.getCurrentForm();
      if (currform.Popup)
        currform.Popup.setVisibility(false);
	  var flowType = applicationManager.getMFAManager().getMFAFlowType();
			if (applicationManager.gblDeepLink === "true") {
                var openBankingMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                    "moduleName": "OpenBankingUIModule",
                    "appName": "OpenBankingMA"
                });
                    openBankingMod.presentationController.approvePaymentConsentErr(response);
                return;
            }
      if (!(response.dbpErrCode >= 10500 && response.dbpErrCode <= 10700)) {
        if (response.hasOwnProperty("dbpErrMsg")) response.errorMessage = response.dbpErrMsg;

        scopeObj.mfaError(response, true);
      };
      let errorMessage = (response.details && response.details.errmsg) ? response.details.errmsg : ((response.errmsg && response.errmsg.errorMessage) ? response.errmsg.errorMessage : "User does not exist.");
      scopeObj.mfaError(errorMessage, false);
    },
    setHamburgerMenu: function () {
      var flowType = applicationManager.getPresentationUtility().MFA.getMFAFlowType();
      if (flowType == "WIRE_TRANSFERS" || flowType == "ONE_TIME_WIRE_TRANSFERS") {
        this.view.customheader.customhamburger.activateMenu("WIRE TRANSFER", "Make Transfer");
      } else if (flowType == "SINGLE_BILL_PAY" || flowType == "BULK_BILL_PAY") {
        this.view.customheader.customhamburger.activateMenu("Bill Pay", "Pay A Bill");
      } else if (flowType == "PAY_A_PERSON") {
        this.view.customheader.customhamburger.activateMenu("Pay A Person", "Send Money");
      } else if (flowType == "TRANSFERS_EURO" || flowType == "TRANSFERS_UPDATE" || flowType == "TRANSFERS") {
        this.view.customheader.customhamburger.activateMenu("Transfers", "Transfer Money");
      } else if (flowType == "LOCK_CARD" || flowType == "UNLOCK_CARD" || flowType == "CHANGE_PIN" || flowType == "REPORT_LOST" || flowType == "CANCEL_CARD" || flowType == "REPLACE_CARD") {
        this.view.customheader.customhamburger.activateMenu("ACCOUNTS", "Card Management");
      } else if (flowType == "UPDATE_USERNAME" || flowType == "UPDATE_PASSWORD" || flowType == "SECURITYQUESTION_RESET" || flowType == "PSD2_TPP_CONSENT_REVOKED") {
        this.view.customheader.customhamburger.activateMenu("Settings", "Profile Settings");
      } else if (flowType == "CREATE_BULKWIRE_TRANSFER_TEMPLATE" || flowType == "CREATE_BULKWIRE_TRANSFER") {
        this.view.customheader.customhamburger.activateMenu("Wire Transfer", "Make Bulk Transfer");
      }
    },
    assignToolTips: function () {
      this.view.OTPPostLogin.btnResendCode.toolTip = kony.i18n.getLocalizedString("i18n.login.ResendOtp");
      this.view.OTPPostLogin.btnProceed.toolTip = kony.i18n.getLocalizedString("i18n.common.proceed");
      this.view.securityQuestions.btnProceed.toolTip = kony.i18n.getLocalizedString("i18n.common.proceed");
    },
    updateFormUI: function (viewModel) {
      if (viewModel.phoneEmailScreen) {
        this.showPhoneEmailScreen(viewModel.phoneEmailScreen);
      } else if (viewModel.defaultPhoneEmailScreen) {
        this.showDefaultPhoneEmailScreen(viewModel.defaultPhoneEmailScreen);
      } else if (viewModel.primaryPhoneEmailScreen) {
        this.showPrimaryPhoneEmailScreen(viewModel.primaryPhoneEmailScreen);
      } else if (viewModel.securityQuestions) {
        this.setSecurityQuestionsUI(viewModel.securityQuestions);
      } else if (viewModel.otpRequestFailed) {
        this.showRequestOTPError(viewModel.otpRequestFailed);
      } else if (viewModel.otpReceived) {
        this.showScreentoEnterOTP(viewModel.otpReceived);
      } else if (viewModel.otpIncorrect) {
        this.showIncorrectOTPError(viewModel.otpIncorrect);
      } else if (viewModel.securityAnswerIncorrect) {
        this.showIncorrectSecurityAnswerError(viewModel.securityAnswerIncorrect);
      }
      //       if (OLBConstants.CLIENT_PROPERTIES && OLBConstants.CLIENT_PROPERTIES.SPOTLIGHT_DISABLE_SCA && OLBConstants.CLIENT_PROPERTIES.SPOTLIGHT_DISABLE_SCA.toUpperCase() === "FALSE") {
      //         // if SCA has been enabled, show SCA component
      //         this.view.SCAComponent.serviceKey = viewModel.mfa.response.MFAAttributes.serviceKey;
      //         this.view.SCAComponent.flowType = viewModel.mfa.flowType;
      //         this.viewComponentScreen(true, false, true);
      //         if(this.view.SCAComponent.setContext){
      //           this.view.SCAComponent.setContext(applicationManager.getPresentationUtility().SCA.getRequestParams());
      //         }
      //      } 
      if (OLBConstants.CLIENT_PROPERTIES && OLBConstants.CLIENT_PROPERTIES.SPOTLIGHT_DISABLE_SCA
        && OLBConstants.CLIENT_PROPERTIES.SPOTLIGHT_DISABLE_SCA.toUpperCase() === "FALSE"
        && viewModel.mfa
        && kony.sdk.isNullOrUndefined(viewModel.mfa.response.MFAAttributes.MFAType)) {
        // if SCA has been enabled, show SCA component
        if (CommonUtilities.getSCAType() === 1) {
          this.view.SCAComponent.serviceKey = viewModel.mfa.response.MFAAttributes.serviceKey;
          this.view.SCAComponent.flowType = viewModel.mfa.flowType;
        } else if (CommonUtilities.getSCAType() === 2) {
          this.view.SCAUnikenComponent.serviceKey = viewModel.mfa.response.MFAAttributes.serviceKey;
          this.view.SCAUnikenComponent.flowType = viewModel.mfa.flowType !== ""  ? viewModel.mfa.flowType : viewModel.mfa.serviceName;
        }
        this.viewComponentScreen(true, false, true);
        if (CommonUtilities.getSCAType() === 1) {
          if (this.view.SCAComponent.setContext) {
            this.scaJSON.action = viewModel.mfa.objectServiceDetails.action;
            this.scaJSON.serviceId = viewModel.mfa.serviceName;
            this.scaJSON.objectService = viewModel.mfa.objectServiceDetails.serviceName;
            this.scaJSON.dataModel = viewModel.mfa.objectServiceDetails.dataModel;
            this.scaJSON.operationName = viewModel.mfa.objectServiceDetails.verifyOTPOperationName;
            this.scaJSON.serviceKey = viewModel.mfa.response.MFAAttributes.serviceKey;
            this.view.SCAComponent.setContext(applicationManager.getPresentationUtility().SCA.getRequestParams());
          }
        }
        else if (CommonUtilities.getSCAType() === 2) {
          if (this.view.SCAUnikenComponent.setContext) {
            this.scaJSON.action = viewModel.mfa.objectServiceDetails.action;
            this.scaJSON.serviceId = viewModel.mfa.serviceName;
            this.scaJSON.objectService = viewModel.mfa.objectServiceDetails.serviceName;
            this.scaJSON.dataModel = viewModel.mfa.objectServiceDetails.dataModel;
            this.scaJSON.operationName = viewModel.mfa.objectServiceDetails.verifyOTPOperationName;
            this.scaJSON.serviceKey = viewModel.mfa.response.MFAAttributes.serviceKey;
            this.view.SCAUnikenComponent.setContext(applicationManager.getPresentationUtility().SCA.getRequestParams());
          }
        }
      } else if (viewModel.mfa) {
        let mfaType = viewModel.mfa.response.MFAAttributes.MFAType;
        if (mfaType === OLBConstants.MFA_FLOW_TYPES.SECURE_ACCESS_CODE) {
          this.view.OTPComponent.serviceName = viewModel.mfa.serviceName;
          this.view.OTPComponent.showMFA(viewModel.mfa.response);
          this.view.OTPComponent.action = viewModel.mfa.objectServiceDetails.action;
          this.view.OTPComponent.objectService = viewModel.mfa.objectServiceDetails.serviceName;
          this.view.OTPComponent.dataModel = viewModel.mfa.objectServiceDetails.dataModel;
          this.view.OTPComponent.verifyOTPOperationName = viewModel.mfa.objectServiceDetails.verifyOTPOperationName;
          this.view.OTPComponent.requestOTPOperationName = viewModel.mfa.objectServiceDetails.requestOTPOperationName;
          this.view.OTPComponent.resendOTPOperationName = viewModel.mfa.objectServiceDetails.resendOTPOperationName;
          this.viewComponentScreen(true, true, false);
        } else if (mfaType === OLBConstants.MFA_FLOW_TYPES.SECURITY_QUESTIONS) {
          this.view.securityQuestionsComponent.action = viewModel.mfa.objectServiceDetails.action;
          this.view.securityQuestionsComponent.serviceId = viewModel.mfa.serviceName;
          this.view.securityQuestionsComponent.showSecurityQuestions(viewModel.mfa.response);
          this.view.securityQuestionsComponent.objectService = viewModel.mfa.objectServiceDetails.serviceName;
          this.view.securityQuestionsComponent.dataModel = viewModel.mfa.objectServiceDetails.dataModel;
          this.view.securityQuestionsComponent.operationName = viewModel.mfa.objectServiceDetails.verifyOTPOperationName;
          this.viewComponentScreen(true, false, false);
        }
      }
      this.AdjustScreen();
    },
    showPhoneEmailScreen: function (customerCommunicationInfo) {
      var scopeObj = this;
      FormControllerUtility.showProgressBar(this.view);
      this.bindUIForOTPMFAScreen(customerCommunicationInfo);
      this.view.OTPPostLogin.btnProceed.onClick = function () {
        FormControllerUtility.showProgressBar(scopeObj.view);
        var selectedData = {
          "phone": scopeObj.view.OTPPostLogin.lbxPhone.selectedKeyValue[0],
          "email": scopeObj.view.OTPPostLogin.lbxEmail.selectedKeyValue[0],
        };
        scopeObj.customerPhone = selectedData.phone;
        scopeObj.customerEmail = selectedData.email;
        this.requestOTP(selectedData);
      }.bind(this);
    },
    showDefaultPhoneEmailScreen: function (customerCommunicationInfo) {
      this.bindUIForDefaultScreen(customerCommunicationInfo);
    },
    showPrimaryPhoneEmailScreen: function (customerCommunicationInfo) {
      this.bindUIForPrimaryScreen(customerCommunicationInfo);
    },
    setSecurityQuestionsUI: function (response) {
      FormControllerUtility.hideProgressBar(this.view);
      var securityQuestions = response.MFAAttributes.securityQuestions;
      if (response.MFAAttributes.remainingFailedAttempts && response.MFAAttributes.remainingFailedAttempts > 0) {
        this.view.flxWarning.setVisibility(true);
        this.view.rtxWarning.text = kony.i18n.getLocalizedString("i18n.mfa.incorrectanswer") + response.MFAAttributes.remainingFailedAttempts + " " + kony.i18n.getLocalizedString("i18n.mfa.remainingAttempts");
        FormControllerUtility.hideProgressBar(this.view);
        this.AdjustScreen();
        this.view.forceLayout();
      } else if (response.MFAAttributes.remainingFailedAttempts === "0" && response.MFAAttributes.lockUser === "true") {
        FormControllerUtility.showProgressBar(this.view);
        var authModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("AuthModule");
        authModule.presentationController.doLogout({
          "action": "LockOutMFA",
          "lockOutTime": response.MFAAttributes.lockoutTime
        });
      } else if (response.MFAAttributes.remainingFailedAttempts === "0" && response.MFAAttributes.logoutUser === "true") {
        FormControllerUtility.showProgressBar(this.view);
        var authModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("AuthModule");
        authModule.presentationController.doLogout({
          "action": "LogOutMFA"
        });
      }
      this.view.securityQuestions.tbxAnswers1.text = "";
      this.view.securityQuestions.tbxAnswers2.text = "";
      this.view.lblHeaderText.text = kony.i18n.getLocalizedString("i18n.ProfileManagement.SecurityQuestions");
      this.view.securityQuestions.lblNote.text = kony.i18n.getLocalizedString("i18n.MFA.NoteYourSecurityAnswersAndQuestionsAreConfidential");
      this.view.flxTwoStepVerification.setVisibility(false);
      this.view.flxAnswerSecurityQuestions.setVisibility(true);
      this.view.securityQuestions.flxAnswerSecurityQuestions.setVisibility(true);
      this.view.OTPPostLogin.flxEnterOTP.setVisibility(false);
      this.view.OTPPostLogin.flxActions.setVisibility(false);
      this.view.OTPPostLogin.flxEnterSecureAccessCode.setVisibility(false);
      this.view.securityQuestions.flxActions.setVisibility(true);
      this.bindUIForSecurityQuestionsMFAScreen(securityQuestions);
      FormControllerUtility.disableButton(this.view.securityQuestions.btnProceed);
      this.AdjustScreen();
      this.view.forceLayout();
    },
    requestOTP: function (selectedData) {
      applicationManager.getPresentationUtility().MFA.requestOTP(selectedData);
    },
    resendOTP: function (selectedData) {
      applicationManager.getPresentationUtility().MFA.resendOTP(selectedData);
    },
    bindUIForSecurityQuestionsMFAScreen: function (securityQuestions) {
      var scopeObj = this;
      if (securityQuestions.length === 2) {
        this.view.securityQuestions.flxAnswerSecurityQuestionsQASet2.setVisibility(true);
        this.view.securityQuestions.lblSecurityQuestion1Desc.text = securityQuestions[0].Question;
        this.view.securityQuestions.lblSecurityQuestion2Desc.text = securityQuestions[1].Question;
        this.view.securityQuestions.tbxAnswers1.onKeyUp = this.isValidAnswer.bind(this);
        this.view.securityQuestions.tbxAnswers2.onKeyUp = this.isValidAnswer.bind(this);
      } else {
        this.view.securityQuestions.lblSecurityQuestion1Desc.text = securityQuestions[0].Question;
        this.view.securityQuestions.flxAnswerSecurityQuestionsQASet2.setVisibility(false);
        this.view.securityQuestions.tbxAnswers1.onKeyUp = function () {
          var answer1 = scopeObj.view.securityQuestions.tbxAnswers1.text;
          if (answer1 === "") {
            FormControllerUtility.disableButton(scopeObj.view.securityQuestions.btnProceed);
          } else {
            FormControllerUtility.enableButton(scopeObj.view.securityQuestions.btnProceed);
          }
        }
      }
      this.view.securityQuestions.btnProceed.onClick = function () {
        FormControllerUtility.showProgressBar(this.view);
        var data = this.onSaveAnswerSecurityQuestions(securityQuestions);
        applicationManager.getPresentationUtility().MFA.verifySecurityQuestions(data);
      }.bind(this);
    },
    onSaveAnswerSecurityQuestions: function (securityQuestions) {
      var data = [{
        customerAnswer: "",
        questionId: ""
      }, {
        customerAnswer: "",
        questionId: ""
      }];
      var quesData = "";
      quesData = this.view.securityQuestions.lblSecurityQuestion1Desc.text;
      data[0].customerAnswer = this.view.securityQuestions.tbxAnswers1.text;
      data[0].questionId = this.getQuestionIDForAnswer(quesData, securityQuestions);
      quesData = this.view.securityQuestions.lblSecurityQuestion2Desc.text;
      data[1].customerAnswer = this.view.securityQuestions.tbxAnswers2.text;
      data[1].questionId = this.getQuestionIDForAnswer(quesData, securityQuestions);
      return data;
    },
    showIncorrectOTPError: function (response) {
      if (response.MFAAttributes && response.MFAAttributes.remainingFailedAttempts && response.MFAAttributes.remainingFailedAttempts > 0) {
        this.view.flxWarning.setVisibility(true);
        this.view.rtxWarning.text = kony.i18n.getLocalizedString("i18n.mfa.invalidAccessCode") + " " + response.MFAAttributes.remainingFailedAttempts + " " + kony.i18n.getLocalizedString("i18n.mfa.remainingAttempts");
        this.view.flxAnswerSecurityQuestions.setVisibility(false);
        this.view.flxTwoStepVerification.setVisibility(true);
        this.view.OTPPostLogin.flxEnterOTP.setVisibility(false);
        this.view.OTPPostLogin.tbxEnterOTPCode.text = "";
        this.view.OTPPostLogin.flxEnterSecureAccessCode.setVisibility(true);
        this.view.OTPPostLogin.tbxEnterOTPCode.text = "";
        FormControllerUtility.disableButton(this.view.OTPPostLogin.btnProceed);
        FormControllerUtility.hideProgressBar(this.view);
        this.AdjustScreen();
        this.view.forceLayout();
      } else if (response.MFAAttributes && response.MFAAttributes.remainingFailedAttempts === "0" && response.MFAAttributes.lockUser === "true") {
        FormControllerUtility.showProgressBar(this.view);
        var authModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("AuthModule");
        authModule.presentationController.doLogout({
          "action": "LockOutMFA",
          "lockOutTime": response.MFAAttributes.lockoutTime
        });
      } else if (response.MFAAttributes && response.MFAAttributes.remainingFailedAttempts === "0" && response.MFAAttributes.logoutUser === "true") {
        FormControllerUtility.showProgressBar(this.view);
        var authModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("AuthModule");
        authModule.presentationController.doLogout({
          "action": "LogOutMFA"
        });
      } else {
        this.view.flxWarning.setVisibility(true);
        this.view.rtxWarning.text = response.dbpErrMsg;
        this.view.OTPPostLogin.tbxEnterOTPCode.text = "";
        FormControllerUtility.disableButton(this.view.OTPPostLogin.btnProceed);
        FormControllerUtility.hideProgressBar(this.view);
      }
      this.AdjustScreen();
      this.view.forceLayout();
    },
    showIncorrectSecurityAnswerError: function (error) {
      this.view.flxWarning.setVisibility(true);
      this.view.rtxWarning.text = error.dbpErrMsg;
      this.view.securityQuestions.tbxAnswers1.text = "";
      this.view.securityQuestions.tbxAnswers2.text = "";
      FormControllerUtility.disableButton(this.view.securityQuestions.btnProceed);
      FormControllerUtility.hideProgressBar(this.view);
      this.AdjustScreen();
      this.view.forceLayout();
    },
    showRequestOTPError: function (error) {
      this.view.flxWarning.setVisibility(true);
      this.view.rtxWarning.text = error.errorMessage;
      FormControllerUtility.disableButton(this.view.securityQuestions.btnProceed);
      FormControllerUtility.hideProgressBar(this.view);
      this.AdjustScreen();
      this.view.forceLayout();
    },
    getQuestionIDForAnswer: function (quesData, responseBackend) {
      var qData;
      for (var i = 0; i < responseBackend.length; i++) {
        if (quesData === responseBackend[i].Question) {
          qData = responseBackend[i].SecurityQuestion_id;
        }
      }
      return qData;
    },
    isValidAnswer: function () {
      var answer1 = this.view.securityQuestions.tbxAnswers1.text;
      var answer2 = this.view.securityQuestions.tbxAnswers2.text;
      if (answer1 === "" || answer2 === "") {
        FormControllerUtility.disableButton(this.view.securityQuestions.btnProceed);
      } else {
        FormControllerUtility.enableButton(this.view.securityQuestions.btnProceed);
      }
    },
    bindUIForOTPMFAScreen: function (customerCommunicationInfo) {
      this.view.flxAnswerSecurityQuestions.setVisibility(false);
      this.view.flxTwoStepVerification.setVisibility(true);
      this.view.lblHeaderText.text = kony.i18n.getLocalizedString("i18n.ProfileManagement.SecureAccessCode");
      this.view.securityQuestions.flxAnswerSecurityQuestions.setVisibility(false);
      this.view.OTPPostLogin.flxEnterSecureAccessCode.setVisibility(false);
      this.view.OTPPostLogin.flxEnterOTP.setVisibility(true);
      this.view.flxOTP.setVisibility(true);
      this.view.OTPPostLogin.flxActions.setVisibility(true);
      FormControllerUtility.enableButton(this.view.OTPPostLogin.btnProceed);
      this.view.OTPPostLogin.btnProceed.text = kony.i18n.getLocalizedString("i18n.common.proceed");
      this.view.OTPPostLogin.btnProceed.toolTip = kony.i18n.getLocalizedString("i18n.common.proceed");
      this.view.OTPPostLogin.lblNote.text = kony.i18n.getLocalizedString("i18n.MFA.NoteYourSecureAccessCodeIsConfidential");
      if (customerCommunicationInfo.phone.length > 0 && customerCommunicationInfo.email.length > 0) {
        this.view.OTPPostLogin.lblHeader.text = kony.i18n.getLocalizedString("i18n.MFA.headerMessageForOTP");
        var phoneno = this.setDataForPhoneListBox(customerCommunicationInfo.phone);
        var emailIds = this.setDataForEmailListBox(customerCommunicationInfo.email);
        this.view.OTPPostLogin.lbxPhone.masterData = phoneno;
        if (phoneno)
          this.view.OTPPostLogin.lbxPhone.selectedKey = phoneno[0][0];
        this.view.OTPPostLogin.lbxEmail.masterData = emailIds;
        if (emailIds)
          this.view.OTPPostLogin.lbxEmail.selectedKey = emailIds[0][0];
        this.view.OTPPostLogin.lblRegisteredPhone.setVisibility(true);
        this.view.OTPPostLogin.lbxPhone.setVisibility(true);
        this.view.OTPPostLogin.lblRegisteredEmail.setVisibility(true);
        this.view.OTPPostLogin.lbxEmail.setVisibility(true);
        this.view.forceLayout();
      } else {
        if (customerCommunicationInfo.phone.length > 0 || customerCommunicationInfo.email.length > 0) {
          if (customerCommunicationInfo.length > 0) {
            this.view.OTPPostLogin.lblHeader.text = kony.i18n.getLocalizedString("i18n.ProfileManagement.headerMessageForOTPPhone");
            var phoneno = this.setDataForPhoneListBox(customerCommunicationInfo.phone);
            this.view.OTPPostLogin.lbxPhone.masterData = phoneno;
            if (phoneno)
              this.view.OTPPostLogin.lbxPhone.selectedKey = phoneno[0][0];
            this.view.OTPPostLogin.lblRegisteredPhone.setVisibility(true);
            this.view.OTPPostLogin.lbxPhone.setVisibility(true);
            this.view.OTPPostLogin.lblRegisteredEmail.setVisibility(false);
            this.view.OTPPostLogin.lbxEmail.setVisibility(false);
            this.view.forceLayout();
          } else if (customerCommunicationInfo.email.length > 0) {
            this.view.OTPPostLogin.lblHeader.text = kony.i18n.getLocalizedString("i18n.ProfileManagement.headerMessageForOTPEmail");
            var emailIds = this.setDataForEmailListBox(customerCommunicationInfo.email);
            this.view.OTPPostLogin.lbxEmail.masterData = emailIds;
            if (emailIds)
              this.view.OTPPostLogin.lbxEmail.selectedKey = emailIds[0][0];
            this.view.OTPPostLogin.lblRegisteredPhone.setVisibility(false);
            this.view.OTPPostLogin.lbxPhone.setVisibility(false);
            this.view.OTPPostLogin.lblRegisteredEmail.setVisibility(true);
            this.view.OTPPostLogin.lbxEmail.setVisibility(true);
            this.view.forceLayout();
          }
        }
      }
      FormControllerUtility.hideProgressBar(this.view);
      this.AdjustScreen();
      this.view.forceLayout();
    },
    bindUIForDefaultScreen: function (response) {
      if (response.remainingResendAttempts <= 0) {
        this.view.OTPPostLogin.lblResendMessage.setVisibility(false);
        this.view.OTPPostLogin.btnResendCode.setVisibility(false);
      } else {
        this.bindUIForResendButton(response);
        this.view.OTPPostLogin.lblResendMessage.setVisibility(true);
        this.view.OTPPostLogin.btnResendCode.setVisibility(true);
      }
      if (response.isOTPExpired === "true") {
        this.view.flxWarning.setVisibility(true);
        this.view.rtxWarning.text = kony.i18n.getLocalizedString("i18n.mfa.otpExpired");
        this.view.OTPPostLogin.tbxEnterOTPCode.text = "";
        FormControllerUtility.disableButton(this.view.OTPPostLogin.btnProceed);
        FormControllerUtility.hideProgressBar(this.view);
      } else {
        this.view.flxWarning.setVisibility(false);
      }
      this.view.flxAnswerSecurityQuestions.setVisibility(false);
      this.view.flxTwoStepVerification.setVisibility(true);
      this.view.OTPPostLogin.flxEnterOTP.setVisibility(false);
      this.view.OTPPostLogin.flxEnterSecureAccessCode.setVisibility(true);
      this.view.OTPPostLogin.flxActions.setVisibility(true);
      this.view.OTPPostLogin.rtxHeaderOTP.text = kony.i18n.getLocalizedString("i18n.mfa.SACHeader");
      this.view.OTPPostLogin.btnProceed.text = kony.i18n.getLocalizedString("i18n.ProfileManagement.Verify");
      this.view.OTPPostLogin.btnProceed.toolTip = kony.i18n.getLocalizedString("i18n.ProfileManagement.Verify");
      this.view.OTPPostLogin.btnResendCode.text = kony.i18n.getLocalizedString("i18n.login.ResendOtp");
      this.view.OTPPostLogin.btnResendCode.toolTip = kony.i18n.getLocalizedString("i18n.login.ResendOtp");
      this.view.lblHeaderText.text = kony.i18n.getLocalizedString("i18n.ProfileManagement.SecureAccessCode");
      this.view.OTPPostLogin.lblNote.text = kony.i18n.getLocalizedString("i18n.mfa.securityAccessNotes");
      this.view.OTPPostLogin.tbxEnterOTPCode.text = "";
      FormControllerUtility.disableButton(this.view.OTPPostLogin.btnProceed);
      this.view.OTPPostLogin.tbxEnterOTPCode.onKeyUp = function () {
        this.validatetoEnableContinueButton();
      }.bind(this);
      this.view.OTPPostLogin.btnProceed.onClick = function () {
        FormControllerUtility.showProgressBar(this.view);
        this.view.OTPPostLogin.rtxHeaderOTP.text = kony.i18n.getLocalizedString("i18n.mfa.SACHeader");
        var params = {
          "securityKey": response.securityKey,
          "otp": this.view.OTPPostLogin.tbxEnterOTPCode.text
        };
        this.verifyOTP(params);
      }.bind(this);
      FormControllerUtility.hideProgressBar(this.view);
      this.AdjustScreen();
      this.view.forceLayout();
    },
    bindUIForResendButton: function (response) {
      var scopeObj = this;
      this.view.OTPPostLogin.tbxEnterOTPCode.text = "";
      this.view.flxWarning.setVisibility(false);
      FormControllerUtility.disableButton(this.view.OTPPostLogin.btnProceed);
      this.view.OTPPostLogin.btnResendCode.onClick = function () {
        FormControllerUtility.showProgressBar(scopeObj.view);
        if (response.customerCommunication) {
          if (response.customerCommunication.phone.length > 0 && response.customerCommunication.email.length > 0) {
            var phone = response.customerCommunication.phone[0].unmasked;
            var email = response.customerCommunication.email[0].unmasked;
          } else {
            if (response.customerCommunication.phone.length > 0) {
              var phone = response.customerCommunication.phone[0].unmasked;
            } else {
              var email = response.customerCommunication.email[0].unmasked;
            }
          }
          var params = {
            "phone": phone,
            "email": email,
            "securityKey": response.securityKey,
          };
        } else {
          var params = {
            "phone": scopeObj.customerPhone,
            "email": scopeObj.customerEmail,
            "securityKey": response.securityKey,
          };
        }
        scopeObj.resendOTP(params);
      };
      this.AdjustScreen();
    },
    bindUIForPrimaryScreen: function (response) {
      if (response.remainingResendAttempts <= 0) {
        this.view.OTPPostLogin.lblResendMessage.setVisibility(false);
        this.view.OTPPostLogin.btnResendCode.setVisibility(false);
      } else {
        this.bindUIForResendButton(response);
        this.view.OTPPostLogin.lblResendMessage.setVisibility(true);
        this.view.OTPPostLogin.btnResendCode.setVisibility(true);
      }
      if (response.isOTPExpired === "true") {
        this.view.flxWarning.setVisibility(true);
        this.view.rtxWarning.text = kony.i18n.getLocalizedString("i18n.mfa.otpExpired");
        this.view.OTPPostLogin.tbxEnterOTPCode.text = "";
        FormControllerUtility.disableButton(this.view.OTPPostLogin.btnProceed);
        FormControllerUtility.hideProgressBar(this.view);
      } else {
        this.view.flxWarning.setVisibility(false);
      }
      this.view.flxAnswerSecurityQuestions.setVisibility(false);
      this.view.lblHeaderText.text = kony.i18n.getLocalizedString("i18n.ProfileManagement.SecureAccessCode");
      this.view.OTPPostLogin.lblNote.text = kony.i18n.getLocalizedString("i18n.mfa.securityAccessNotes");
      this.view.flxTwoStepVerification.setVisibility(true);
      this.view.OTPPostLogin.flxEnterOTP.setVisibility(false);
      FormControllerUtility.disableButton(this.view.OTPPostLogin.btnProceed);
      this.view.OTPPostLogin.tbxEnterOTPCode.text = "";
      this.view.OTPPostLogin.flxActions.setVisibility(true);
      this.view.OTPPostLogin.btnResendCode.text = kony.i18n.getLocalizedString("i18n.login.ResendOtp");
      this.view.OTPPostLogin.btnResendCode.toolTip = kony.i18n.getLocalizedString("i18n.login.ResendOtp");
      this.view.OTPPostLogin.btnProceed.text = kony.i18n.getLocalizedString("i18n.ProfileManagement.Verify");
      this.view.OTPPostLogin.btnProceed.toolTip = kony.i18n.getLocalizedString("i18n.ProfileManagement.Verify");
      this.view.OTPPostLogin.flxEnterSecureAccessCode.setVisibility(true);
      if (response.customerCommunication.phone.length > 0 && response.customerCommunication.email.length > 0) {
        var phone = response.customerCommunication.phone[0].masked;
        var email = response.customerCommunication.email[0].masked;
        this.view.OTPPostLogin.rtxHeaderOTP.text = kony.i18n.getLocalizedString("i18n.mfa.EnterSACMobile") + phone + " & " + email;
      } else {
        if (response.customerCommunication.phone.length > 0) {
          var phone = response.customerCommunication.phone[0].masked;
          this.view.OTPPostLogin.rtxHeaderOTP.text = kony.i18n.getLocalizedString("i18n.mfa.EnterSACMobile") + phone;
        } else {
          var email = response.customerCommunication.email[0].masked;
          this.view.OTPPostLogin.rtxHeaderOTP.text = kony.i18n.getLocalizedString("i18n.mfa.EnterSACMobile") + email;
        }
      }
      this.view.OTPPostLogin.tbxEnterOTPCode.onKeyUp = function () {
        this.validatetoEnableContinueButton();
      }.bind(this);
      this.view.OTPPostLogin.btnProceed.onClick = function () {
        FormControllerUtility.showProgressBar(this.view);
        var params = {
          "securityKey": response.securityKey,
          "otp": this.view.OTPPostLogin.tbxEnterOTPCode.text.trim()
        };
        this.verifyOTP(params);
      }.bind(this);
      FormControllerUtility.hideProgressBar(this.view);
      this.AdjustScreen();
      this.view.forceLayout();
    },
    setDataForPhoneListBox: function (phoneObj) {
      var phoneNumbers = phoneObj.map(function (dataItem) {
        var phoneNumber = [];
        phoneNumber.push(dataItem.unmasked);
        phoneNumber.push(dataItem.masked);
        return phoneNumber;
      });
      return phoneNumbers;
    },
    setDataForEmailListBox: function (emailObj) {
      var emailsIds = emailObj.map(function (dataItem) {
        var email = [];
        email.push(dataItem.unmasked);
        email.push(dataItem.masked);
        return email;
      });
      return emailsIds;
    },
    showScreentoEnterOTP: function (response) {
      var scopeObj = this;
      if (response.remainingResendAttempts <= 0) {
        this.view.OTPPostLogin.lblResendMessage.setVisibility(false);
        this.view.OTPPostLogin.btnResendCode.setVisibility(false);
      } else {
        this.bindUIForResendButton(response);
        this.view.OTPPostLogin.lblResendMessage.setVisibility(true);
        this.view.OTPPostLogin.btnResendCode.setVisibility(true);
      }
      if (response.isOTPExpired === "true") {
        this.view.flxWarning.setVisibility(true);
        this.view.rtxWarning.text = kony.i18n.getLocalizedString("i18n.mfa.otpExpired");
        this.view.OTPPostLogin.tbxEnterOTPCode.text = "";
        FormControllerUtility.disableButton(this.view.OTPPostLogin.btnProceed);
        FormControllerUtility.hideProgressBar(this.view);
      } else {
        this.view.flxWarning.setVisibility(false);
      }
      this.view.flxAnswerSecurityQuestions.setVisibility(false);
      this.view.flxTwoStepVerification.setVisibility(true);
      this.view.OTPPostLogin.flxEnterOTP.setVisibility(false);
      this.view.OTPPostLogin.tbxEnterOTPCode.text = "";
      this.view.OTPPostLogin.flxEnterSecureAccessCode.setVisibility(true);
      this.view.lblHeaderText.text = kony.i18n.getLocalizedString("i18n.ProfileManagement.SecureAccessCode");
      this.view.OTPPostLogin.lblNote.text = kony.i18n.getLocalizedString("i18n.MFA.NoteYourSecureAccessCodeIsConfidential");
      this.view.OTPPostLogin.rtxHeaderOTP.text = kony.i18n.getLocalizedString("i18n.MFA.EnterSACOnPhone");
      FormControllerUtility.disableButton(this.view.OTPPostLogin.btnProceed);
      this.view.OTPPostLogin.flxActions.setVisibility(true);
      this.view.OTPPostLogin.btnProceed.text = kony.i18n.getLocalizedString("i18n.ProfileManagement.Verify");
      this.view.OTPPostLogin.btnProceed.toolTip = kony.i18n.getLocalizedString("i18n.ProfileManagement.Verify");
      this.view.OTPPostLogin.btnResendCode.text = kony.i18n.getLocalizedString("i18n.login.ResendOtp");
      this.view.OTPPostLogin.btnResendCode.toolTip = kony.i18n.getLocalizedString("i18n.login.ResendOtp");
      this.view.OTPPostLogin.tbxEnterOTPCode.onKeyUp = function () {
        this.validatetoEnableContinueButton();
      }.bind(this);
      this.view.OTPPostLogin.btnProceed.onClick = function () {
        FormControllerUtility.showProgressBar(scopeObj.view);
        var selectedData = {
          "securityKey": response.securityKey,
          "otp": this.view.OTPPostLogin.tbxEnterOTPCode.text.trim()
        };
        this.verifyOTP(selectedData);
      }.bind(this);
      this.view.OTPPostLogin.imgViewOTPCode.onTouchStart = function () {
        this.showOTP();
      }.bind(this);
      FormControllerUtility.hideProgressBar(this.view);
      this.AdjustScreen();
      this.view.forceLayout();
    },
    verifyOTP: function (params) {
      applicationManager.getPresentationUtility().MFA.verifyOTP(params);
    },
    showOTP: function () {
      if (this.view.OTPPostLogin.tbxEnterOTPCode.secureTextEntry === true) {
        this.view.OTPPostLogin.tbxEnterOTPCode.secureTextEntry = false;
      } else {
        this.view.OTPPostLogin.tbxEnterOTPCode.secureTextEntry = true;
      }
    },
    validatetoEnableContinueButton: function () {
      var otp = this.view.OTPPostLogin.tbxEnterOTPCode.text.trim();
      if (otp === "") {
        FormControllerUtility.disableButton(this.view.OTPPostLogin.btnProceed);
      } else {
        FormControllerUtility.enableButton(this.view.OTPPostLogin.btnProceed);
      }
    },
    onCancelClick: function () {
      if (this.view.OTPComponent.objectService === "CardManagementServices") { // method which helps to navigate back to card managements page
        kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
          "moduleName": "ManageCardsUIModule",
          "appName": "CardsMA"
        }).presentationController.navigateToManageCards();
      } else {
        applicationManager.getNavigationManager().navigateTo({
          "appName": "ManageProfileMA",
          "friendlyName": "frmProfile"
        });
      }
      //FormControllerUtility.showProgressBar(this.view);
      //applicationManager.getPresentationUtility().MFA.cancelMFAFlow();
    },
    //UI Code
    /**
    * onBreakpointChange : Handles ui changes on .
    * @member of {frmMFATransactionsController}
    * @param {integer} width - current browser width
    * @return {}
    * @throws {}
    */
    orientationHandler: null,
    onBreakpointChange: function (width) {
      var scope = this;
      kony.print('on breakpoint change');
      this.view.customheader.onBreakpointChangeComponent(width);
      this.view.CustomPopup.onBreakpointChangeComponent(scope.view.CustomPopup, width);
      if (this.orientationHandler === null) {
        this.orientationHandler = new OrientationHandler();
      }
      this.orientationHandler.onOrientationChange(this.onBreakpointChange);
      this.AdjustScreen();
      if (width === 640) {
        this.view.customheader.lblHeaderMobile.isVisible = true;
        this.view.customheader.lblHeaderMobile.text = "MFA Transactions";
      } else {
        this.view.customheader.lblHeaderMobile.isVisible = false;
        this.view.customheader.lblHeaderMobile.text = "";
      }
    },
    postShow: function () {
        this.view.SCAUnikenComponent.toggleFlex(false);
      if (kony.application.getCurrentBreakpoint() === 640) {
        this.view.flxLetsAuthenticateModule.top = "60px";
        this.view.OTPPostLogin.lblResendMessage.width = "87%";
        this.view.OTPPostLogin.lblResendMessage.skin = "sknlbl424242SSP13px";
        this.view.OTPPostLogin.lblNote.skin = "sknlbl424242SSP13px";
        this.view.OTPPostLogin.rtxHeaderOTP.skin = "bbSknRtx424242SSP15px";
      }
      this.view.flxFooter.top = "0dp";
      this.view.flxContent.height = kony.os.deviceInfo().screenHeight - this.view.flxHeader.height.replace('dp','') +'dp';
      this.AdjustScreen();
    },

    mfaError: function (response, isTransactionalError) {
      let scopeObj = this;
      if (isTransactionalError) {
        applicationManager.getPresentationUtility().MFA.navigateToTransactionScreen(response);
      } else {
        scopeObj.view.flxWarning.setVisibility(true);
        scopeObj.view.rtxWarning.text = response;
        scopeObj.AdjustScreen();
        scopeObj.view.forceLayout();
      }
    },

    //     viewComponentScreen: function (isComponent, isOtp, isSCA) {
    //       let scopeObj = this;
    //       scopeObj.view.OTPPostLogin.setVisibility(!isComponent);
    //       scopeObj.view.OTPComponent.setVisibility(isComponent);
    //       scopeObj.view.securityQuestions.setVisibility(!isComponent);
    //       scopeObj.view.securityQuestionsComponent.setVisibility(isComponent);
    //       scopeObj.view.SCAComponent.setVisibility(isComponent);
    //       scopeObj.view.flxAnswerSecurityQuestions.setVisibility(!isOtp && !isSCA);
    //       scopeObj.view.flxTwoStepVerification.setVisibility(isOtp && !isSCA);
    //       scopeObj.view.flxSCAComponent.setVisibility(isSCA);
    //       scopeObj.view.flxMain.forceLayout();
    //       FormControllerUtility.hideProgressBar(this.view);
    //     },
    viewComponentScreen: function (isComponent, isOtp, isSCA) {
      let scopeObj = this;
      scopeObj.view.OTPPostLogin.setVisibility(!isComponent);
      scopeObj.view.OTPComponent.setVisibility(isComponent);
      scopeObj.view.securityQuestions.setVisibility(!isComponent);
      scopeObj.view.securityQuestionsComponent.setVisibility(isComponent);
      if (CommonUtilities.getSCAType() === 1)
        scopeObj.view.SCAComponent.setVisibility(isComponent);
      else if (CommonUtilities.getSCAType() === 2)
        scopeObj.view.SCAUnikenComponent.setVisibility(isComponent);
      if (isSCA) {
        scopeObj.view.lblLetsAuthenticate.text = "Please approve the notification.";
        this.view.lblHeaderText.setVisibility(false);
      }
      scopeObj.view.flxAnswerSecurityQuestions.setVisibility(!isOtp && !isSCA);
      scopeObj.view.flxTwoStepVerification.setVisibility(isOtp && !isSCA);
      if (CommonUtilities.getSCAType() === 1) {
        scopeObj.view.flxSCAComponent.setVisibility(isSCA);
      }
      else if (CommonUtilities.getSCAType() === 2) {
        scopeObj.view.flxSCAComponentUniken.setVisibility(isSCA);
      }
      scopeObj.view.flxMain.forceLayout();
      FormControllerUtility.hideProgressBar(this.view);
    },
  };
});