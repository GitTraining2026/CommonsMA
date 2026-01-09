define([], function () {
  function MFAManager() {
    kony.mvc.Business.Controller.call(this);
    scope_MFAManager = this;
    this.MFAResponse = "";
    this.flowType = "";
    this.servicekey = "";
    this.MFAType = "";
    this.communicationType = "";
    this.serviceId = "";
    this.operationType = "";
    this.userName = "";
  }
  inheritsFrom(MFAManager, kony.mvc.Business.Delegator);
  MFAManager.prototype.initializeBusinessController = function () { };
  MFAManager.prototype.initMFAFlow = function (mfaJSON) {
    scope_MFAManager.setMFAResponse(mfaJSON.response);
    scope_MFAManager.setMFAFlowType(mfaJSON.flowType);
    scope_MFAManager.setServicekey(mfaJSON.response.MFAAttributes.serviceKey);
    scope_MFAManager.setMFAType(mfaJSON.response.MFAAttributes.MFAType);
    scope_MFAManager.setUserName(mfaJSON.userName);
    scope_MFAManager.setCommunicationType(mfaJSON.response.MFAAttributes.communicationType);
	if(mfaJSON.objectServiceDetails){
      applicationManager.getPresentationUtility().MFA.navigateToMFAComponent(mfaJSON);
    } else {
      applicationManager.getPresentationUtility().MFA.navigateBasedOnMFAType();
    }
  };
  MFAManager.prototype.setMFAResponse = function (MFAResponse) {
    if (MFAResponse.MFAAttributes && MFAResponse.MFAAttributes.customerCommunication) {
      for (var i in MFAResponse.MFAAttributes.customerCommunication.phone)
        MFAResponse.MFAAttributes.customerCommunication.phone[i].unmasked = MFAResponse.MFAAttributes.customerCommunication.phone[i].referenceId;
      for (var j in MFAResponse.MFAAttributes.customerCommunication.email)
        MFAResponse.MFAAttributes.customerCommunication.email[j].unmasked = MFAResponse.MFAAttributes.customerCommunication.email[j].referenceId;
    }
    this.MFAResponse = MFAResponse;
  };
  MFAManager.prototype.getMFAResponse = function () {
    return this.MFAResponse;
  };
  MFAManager.prototype.setUserName = function (userName) {
    this.userName = userName;
  };
  MFAManager.prototype.getUserName = function () {
    return this.userName;
  };
  MFAManager.prototype.setMFAFlowType = function (flowType) {
    this.flowType = flowType;
  };
  MFAManager.prototype.getMFAFlowType = function () {
    return this.flowType;
  };
  MFAManager.prototype.setMFAOperationType = function (operationType) {
    this.operationType = operationType;
  };
  MFAManager.prototype.getMFAOperationType = function () {
    return this.flowType;
  };
  MFAManager.prototype.setServicekey = function (servicekey) {
    this.servicekey = servicekey;
  };
  MFAManager.prototype.getServicekey = function () {
    return this.servicekey;
  };
  MFAManager.prototype.setMFAType = function (MFAType) {
    this.MFAType = MFAType;
  };
  MFAManager.prototype.getMFAType = function () {
    return this.MFAType;
  };
  MFAManager.prototype.setCommunicationType = function (communicationType) {
    this.communicationType = communicationType;
  };
  MFAManager.prototype.getCommunicationType = function () {
    return this.communicationType;
  };
  MFAManager.prototype.setServiceId = function (serviceId) {
    this.serviceId = serviceId;
  };
  MFAManager.prototype.getServiceId = function (serviceId) {
    return this.serviceId;
  };
  MFAManager.prototype.requestOTP = function (params) {
    var transactionManager = applicationManager.getTransactionManager();
    //var ACHManager = applicationManager.getACHManager();
    const userPreferencesManager = applicationManager.getUserPreferencesManager();
    if (this.flowType == "LoginMFA") {
      this.requestLoginMFAOtp(params, this.requestOTPSuccess.bind(this), this.requestOTPFailure.bind(this));
    }
    else if (this.flowType == "UPDATE_USERNAME") {
      var userObj = applicationManager.getUserPreferencesManager();
      userObj.updateUserName(params, this.requestOTPSuccess.bind(this), this.requestOTPFailure.bind(this));
    }
    else if (this.flowType == "UPDATE_PASSWORD") {
      var userObj = applicationManager.getUserPreferencesManager();
      userObj.updateUserPassword(params, this.requestOTPSuccess.bind(this), this.requestOTPFailure.bind(this));
    }
	else if (this.flowType === "PSD2_TPP_CONSENT_REVOKED") {
	  applicationManager.getSettingsManager().updatePSD2ConsentData(params,this.requestOTPSuccess.bind(this), this.requestOTPFailure.bind(this));
	}
    else if (this.flowType === "BULK_BILL_PAY") {
      applicationManager.getTransactionManager().createBulkBillPayPayement(params, this.requestOTPSuccess.bind(this), this.requestOTPFailure.bind(this));
    } else if (this.flowType === "SECURITYQUESTION_RESET") {
      this.requestUpdateSecurityQuestionsOTP(params, this.requestOTPSuccess.bind(this), this.requestOTPFailure.bind(this));
    } else if (this.flowType === "LOCK_CARD") {
      applicationManager.getCardsManager().lockCard(params, this.requestOTPSuccess.bind(this), this.requestOTPFailure.bind(this));
    } else if (this.flowType === "UNLOCK_CARD") {
      applicationManager.getCardsManager().unLockCard(params, this.requestOTPSuccess.bind(this), this.requestOTPFailure.bind(this));
    } else if (this.flowType === "CHANGE_PIN_DEBIT") {
      applicationManager.getCardsManager().changePin(params, this.requestOTPSuccess.bind(this), this.requestOTPFailure.bind(this));
    } else if (this.flowType === "REPORT_LOST") {
      applicationManager.getCardsManager().reportLost(params, this.requestOTPSuccess.bind(this), this.requestOTPFailure.bind(this));
    } else if (this.flowType === "CANCEL_CARD") {
      applicationManager.getCardsManager().updateCardStatus(params, this.requestOTPSuccess.bind(this), this.requestOTPFailure.bind(this));
    } else if (this.flowType === "REPLACE_CARD") {
      applicationManager.getCardsManager().replaceCard(params, this.requestOTPSuccess.bind(this), this.requestOTPFailure.bind(this));
    } else if (this.flowType === "CHANGE_PIN_CREDIT") {
      applicationManager.getCardsManager().createCardRequest(params, this.requestOTPSuccess.bind(this), this.requestOTPFailure.bind(this));
    } else if (this.flowType === "ACTIVATE_CARD") {
      applicationManager.getCardsManager().activateCards(params, this.requestOTPSuccess.bind(this), this.requestOTPFailure.bind(this));
    } else if (this.flowType === "BULK_BILL_PAYMENT") {
      transactionManager.createBulkBillPayTransaction(params, this.requestOTPSuccess.bind(this), this.requestOTPFailure.bind(this));
    } else if (this.flowType === "SINGLE_BILL_PAYMENT") {
      transactionManager.createBillPayTransaction(params, this.requestOTPSuccess.bind(this), this.requestOTPFailure.bind(this));
    } else if (this.flowType === "UPDATE_BILL_PAYMENT") {
      transactionManager.updateBillPayTransaction(params, this.requestOTPSuccess.bind(this), this.requestOTPFailure.bind(this));
    } else if (this.flowType === "P2P_CREATE") {
      transactionManager.createP2PTransaction(params, this.requestOTPSuccess.bind(this), this.requestOTPFailure.bind(this));
    } else if (this.flowType === "P2P_EDIT") {
      transactionManager.updateP2PTransaction(params, this.requestOTPSuccess.bind(this), this.requestOTPFailure.bind(this));
    } else if (this.flowType === "DOMESTIC_WIRE_TRANSFER") {
      transactionManager.createDomesticWireTransfer(params, this.requestOTPSuccess.bind(this), this.requestOTPFailure.bind(this));
    } else if (this.flowType === "INTERNATIONAL_WIRE_TRANSFER") {
      transactionManager.createInternationalWireTransfer(params, this.requestOTPSuccess.bind(this), this.requestOTPFailure.bind(this));
    } else if (this.flowType === "TRANSFER_BETWEEN_OWN_ACCOUNT_UPDATE") {
      transactionManager.editTransferToOwnAccounts(params, this.requestOTPSuccess.bind(this), this.requestOTPFailure.bind(this));
    } else if (this.flowType === "INTRA_BANK_FUND_TRANSFER_UPDATE") {
      transactionManager.editIntraBankAccFundTransfer(params, this.requestOTPSuccess.bind(this), this.requestOTPFailure.bind(this));
    } else if (this.flowType === "INTER_BANK_ACCOUNT_FUND_TRANSFER_UPDATE") {
      transactionManager.editInterBankAccFundTransfer(params, this.requestOTPSuccess.bind(this), this.requestOTPFailure.bind(this));
    } else if (this.flowType === "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_UPDATE") {
      transactionManager.editInternationalAccFundTransfer(params, this.requestOTPSuccess.bind(this), this.requestOTPFailure.bind(this));
    } else if (this.flowType === "TRANSFER_BETWEEN_OWN_ACCOUNT_CREATE") {
      transactionManager.createTransferToOwnAccounts(params, this.requestOTPSuccess.bind(this), this.requestOTPFailure.bind(this));
    } else if (this.flowType === "INTRA_BANK_FUND_TRANSFER_CREATE") {
      transactionManager.createIntraBankAccFundTransfer(params, this.requestOTPSuccess.bind(this), this.requestOTPFailure.bind(this));
    } else if (this.flowType === "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE") {
      transactionManager.createInterBankAccFundTransfer(params, this.requestOTPSuccess.bind(this), this.requestOTPFailure.bind(this));
    } else if (this.flowType === "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE") {
      transactionManager.createInternationalAccFundTransfer(params, this.requestOTPSuccess.bind(this), this.requestOTPFailure.bind(this));
    }else if (this.flowType === "CREATE_BULKWIRE_TRANSFER") {
      transactionManager.createBulkWireTransaction(params, this.requestOTPSuccess.bind(this), this.requestOTPFailure.bind(this));
    }else if (this.flowType === "CREATE_BULKWIRE_TRANSFER_TEMPLATE") {
      transactionManager.createBulkWireTransferOperation(params, this.requestOTPSuccess.bind(this), this.requestOTPFailure.bind(this));
    }else if (this.flowType === "APPLY_FOR_DEBIT_CARD") {
      applicationManager.getCardsManager().applyNewCard(params, this.requestOTPSuccess.bind(this), this.requestOTPFailure.bind(this));
    }else if(this.flowType === BBConstants.CREATE_TRANSACTION_SUCCESS){
      ACHManager.createACHTranscation(params, this.requestOTPSuccess.bind(this), this.requestOTPFailure.bind(this));
    }else if(this.flowType === BBConstants.EXECUTE_TEMPLATE_SUCCESS){
      ACHManager.executeTemplate(params, this.requestOTPSuccess.bind(this), this.requestOTPFailure.bind(this));
    }else if(this.flowType === BBConstants.FETCH_UPLOADED_ACH_FILE){
      ACHManager.uploadNewACHFile(params, this.requestOTPSuccess.bind(this), this.requestOTPFailure.bind(this));
    } else if (this.flowType === "PAY_MULTIPLE_BENEFICIARIES") {
      applicationManager.getTransactionManager().createBulkTransfer(params, this.requestOTPSuccess.bind(this), this.requestOTPFailure.bind(this));
    } else if(this.flowType === "ADD_PHONE_NUMBER") {
      userPreferencesManager.updateUserProfileDetails(params, this.requestOTPSuccess.bind(this), this.requestOTPFailure.bind(this));
    } else if(this.flowType === "UPDATE_PHONE_NUMBER") {
      userPreferencesManager.updateUserProfileDetails(params, this.requestOTPSuccess.bind(this), this.requestOTPFailure.bind(this));
    } else if(this.flowType === "REMOVE_PHONE_NUMBER") {
      userPreferencesManager.updateUserProfileDetails(params, this.requestOTPSuccess.bind(this), this.requestOTPFailure.bind(this));
    } else if(this.flowType === "ADD_EMAIL") {
      userPreferencesManager.updateUserProfileDetails(params, this.requestOTPSuccess.bind(this), this.requestOTPFailure.bind(this));
    } else if(this.flowType === "UPDATE_EMAIL") {
      userPreferencesManager.updateUserProfileDetails(params, this.requestOTPSuccess.bind(this), this.requestOTPFailure.bind(this));
    } else if(this.flowType === "REMOVE_EMAIL") {
      userPreferencesManager.updateUserProfileDetails(params, this.requestOTPSuccess.bind(this), this.requestOTPFailure.bind(this));
    } else if(this.flowType === "SUSPEND_USER") {
      userPreferencesManager.updateUserStatus(params, this.requestOTPSuccess.bind(this), this.requestOTPFailure.bind(this));
    }
  };
  MFAManager.prototype.requestLoginMFAOtp = function (params, presentationSuccessCallback, presentationErrorCallback) {
    var userobj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Users_2");
    userobj.customVerb('requestLoginMFAOTP', params, getUserCompletionCallback);
    function getUserCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
  MFAManager.prototype.requestUpdateSecurityQuestionsOTP = function (params, presentationSuccessCallback, presentationErrorCallback) {
    var userobj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ExternalUsers_2");
    userobj.customVerb('requestUpdateSecurityQuestionsOTP', params, getUserCompletionCallback);
    function getUserCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
  MFAManager.prototype.requestOTPSuccess = function (response) {
    this.setMFAResponse(response);
    this.MFAResponse.MFAAttributes.remainingResendAttempts = response.MFAAttributes.remainingResendAttempts;
    this.MFAResponse.MFAAttributes.securityKey = response.MFAAttributes.securityKey;
    applicationManager.getPresentationUtility().MFA.showMFAOTPScreen();
  };
  MFAManager.prototype.requestOTPFailure = function (error) {
    applicationManager.getPresentationUtility().MFA.mfaOTPError(error);
  };
  MFAManager.prototype.verifyOTP = function (params) {
    var transactionManager = applicationManager.getTransactionManager();
    //var ACHManager = applicationManager.getACHManager();
    const userPreferencesManager = applicationManager.getUserPreferencesManager();
    if (this.flowType == "LoginMFA") {
      this.verifyLoginMFAOtp(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    }
    else if (this.flowType == "UPDATE_USERNAME") {
      var userObj = applicationManager.getUserPreferencesManager();
      userObj.updateUserName(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    }
    else if (this.flowType == "UPDATE_PASSWORD") {
      var userObj = applicationManager.getUserPreferencesManager();
      userObj.updateUserPassword(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    }
	else if (this.flowType === "PSD2_TPP_CONSENT_REVOKED") {
	  applicationManager.getSettingsManager().updatePSD2ConsentData(params,this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
	}
    else if (this.flowType === "BULK_BILL_PAY") {
      transactionManager.createBulkBillPayPayement(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    }
    else if (this.flowType === "SECURITYQUESTION_RESET") {
      this.verifyUpdateSecurityQuestionsOTP(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "LOCK_CARD") {
      applicationManager.getCardsManager().lockCard(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "UNLOCK_CARD") {
      applicationManager.getCardsManager().unLockCard(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "CHANGE_PIN_DEBIT") {
      applicationManager.getCardsManager().changePin(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "REPORT_LOST") {
      applicationManager.getCardsManager().reportLost(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "CANCEL_CARD") {
      applicationManager.getCardsManager().updateCardStatus(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "REPLACE_CARD") {
      applicationManager.getCardsManager().replaceCard(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "CHANGE_PIN_CREDIT") {
      applicationManager.getCardsManager().createCardRequest(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "ACTIVATE_CARD") {
      applicationManager.getCardsManager().activateCards(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "BULK_BILL_PAYMENT") {
      transactionManager.createBulkBillPayTransaction(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "SINGLE_BILL_PAYMENT") {
      transactionManager.createBillPayTransaction(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "UPDATE_BILL_PAYMENT") {
      transactionManager.updateBillPayTransaction(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "P2P_CREATE") {
      transactionManager.createP2PTransaction(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "P2P_EDIT") {
      transactionManager.updateP2PTransaction(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "DOMESTIC_WIRE_TRANSFER") {
      transactionManager.createDomesticWireTransfer(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "INTERNATIONAL_WIRE_TRANSFER") {
      transactionManager.createInternationalWireTransfer(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "TRANSFER_BETWEEN_OWN_ACCOUNT_UPDATE") {
      transactionManager.editTransferToOwnAccounts(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "INTRA_BANK_FUND_TRANSFER_UPDATE") {
      transactionManager.editIntraBankAccFundTransfer(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "INTER_BANK_ACCOUNT_FUND_TRANSFER_UPDATE") {
      transactionManager.editInterBankAccFundTransfer(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_UPDATE") {
      transactionManager.editInternationalAccFundTransfer(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "TRANSFER_BETWEEN_OWN_ACCOUNT_CREATE") {
      transactionManager.createTransferToOwnAccounts(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "INTRA_BANK_FUND_TRANSFER_CREATE") {
      transactionManager.createIntraBankAccFundTransfer(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE") {
      transactionManager.createInterBankAccFundTransfer(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE") {
      transactionManager.createInternationalAccFundTransfer(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    }else if (this.flowType === "CREATE_BULKWIRE_TRANSFER") {
      transactionManager.createBulkWireTransaction(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    }else if (this.flowType === "CREATE_BULKWIRE_TRANSFER_TEMPLATE") {
      transactionManager.createBulkWireTransferOperation(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    }else if (this.flowType === "APPLY_FOR_DEBIT_CARD") {
      applicationManager.getCardsManager().applyNewCard(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    }else if(this.flowType === BBConstants.CREATE_TRANSACTION_SUCCESS){
      ACHManager.createACHTranscation(params, this.verifyOTPSuccess.bind(this), this.verifyACHOTPFailure.bind(this));
    }else if(this.flowType === BBConstants.EXECUTE_TEMPLATE_SUCCESS){
      ACHManager.executeTemplate(params, this.verifyOTPSuccess.bind(this), this.verifyACHOTPFailure.bind(this));
    }else if(this.flowType === BBConstants.FETCH_UPLOADED_ACH_FILE){
      ACHManager.uploadNewACHFile(params, this.verifyOTPSuccess.bind(this), this.verifyACHOTPFailure.bind(this));
    } else if (this.flowType === "PAY_MULTIPLE_BENEFICIARIES") {
      applicationManager.getTransactionManager().createBulkTransfer(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if(this.flowType === "ADD_PHONE_NUMBER") {
      userPreferencesManager.updateUserProfileDetails(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if(this.flowType === "UPDATE_PHONE_NUMBER") {
      userPreferencesManager.updateUserProfileDetails(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if(this.flowType === "REMOVE_PHONE_NUMBER") {
      userPreferencesManager.updateUserProfileDetails(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if(this.flowType === "ADD_EMAIL") {
      userPreferencesManager.updateUserProfileDetails(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if(this.flowType === "UPDATE_EMAIL") {
      userPreferencesManager.updateUserProfileDetails(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if(this.flowType === "REMOVE_EMAIL") {
      userPreferencesManager.updateUserProfileDetails(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if(this.flowType === "SUSPEND_USER") {
      userPreferencesManager.updateUserStatus(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    }
  };
  MFAManager.prototype.resendOTP = function (params) {
    var transactionManager = applicationManager.getTransactionManager();
    //var ACHManager = applicationManager.getACHManager();
    const userPreferencesManager = applicationManager.getUserPreferencesManager();
    if (this.flowType == "LoginMFA") {
      this.requestLoginMFAOtp(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    }
    else if (this.flowType == "UPDATE_USERNAME") {
      var userObj = applicationManager.getUserPreferencesManager();
      userObj.updateUserName(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    }
    else if (this.flowType == "UPDATE_PASSWORD") {
      var userObj = applicationManager.getUserPreferencesManager();
      userObj.updateUserPassword(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    }
	else if (this.flowType === "PSD2_TPP_CONSENT_REVOKED") {
	  applicationManager.getSettingsManager().updatePSD2ConsentData(params,this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
	}
    else if (this.flowType === "BULK_BILL_PAY") {
      transactionManager.createBulkBillPayPayement(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    }
    else if (this.flowType === "SECURITYQUESTION_RESET") {
      this.requestUpdateSecurityQuestionsOTP(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "LOCK_CARD") {
      applicationManager.getCardsManager().lockCard(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "UNLOCK_CARD") {
      applicationManager.getCardsManager().unLockCard(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "CHANGE_PIN_DEBIT") {
      applicationManager.getCardsManager().changePin(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "REPORT_LOST") {
      applicationManager.getCardsManager().reportLost(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "CANCEL_CARD") {
      applicationManager.getCardsManager().updateCardStatus(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "REPLACE_CARD") {
      applicationManager.getCardsManager().replaceCard(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "CHANGE_PIN_CREDIT") {
      applicationManager.getCardsManager().createCardRequest(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "ACTIVATE_CARD") {
      applicationManager.getCardsManager().activateCards(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    }else if (this.flowType === "BULK_BILL_PAYMENT") {
      transactionManager.createBulkBillPayTransaction(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "SINGLE_BILL_PAYMENT") {
      transactionManager.createBillPayTransaction(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "UPDATE_BILL_PAYMENT") {
      transactionManager.updateBillPayTransaction(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "P2P_CREATE") {
      transactionManager.createP2PTransaction(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "P2P_EDIT") {
      transactionManager.updateP2PTransaction(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "DOMESTIC_WIRE_TRANSFER") {
      transactionManager.createDomesticWireTransfer(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "INTERNATIONAL_WIRE_TRANSFER") {
      transactionManager.createInternationalWireTransfer(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "TRANSFER_BETWEEN_OWN_ACCOUNT_UPDATE") {
      transactionManager.editTransferToOwnAccounts(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "INTRA_BANK_FUND_TRANSFER_UPDATE") {
      transactionManager.editIntraBankAccFundTransfer(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "INTER_BANK_ACCOUNT_FUND_TRANSFER_UPDATE") {
      transactionManager.editInterBankAccFundTransfer(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_UPDATE") {
      transactionManager.editInternationalAccFundTransfer(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "TRANSFER_BETWEEN_OWN_ACCOUNT_CREATE") {
      transactionManager.createTransferToOwnAccounts(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "INTRA_BANK_FUND_TRANSFER_CREATE") {
      transactionManager.createIntraBankAccFundTransfer(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE") {
      transactionManager.createInterBankAccFundTransfer(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE") {
      transactionManager.createInternationalAccFundTransfer(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    }else if (this.flowType === "CREATE_BULKWIRE_TRANSFER") {
      transactionManager.createBulkWireTransaction(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    }else if (this.flowType === "CREATE_BULKWIRE_TRANSFER_TEMPLATE") {
      transactionManager.createBulkWireTransferOperation(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if (this.flowType === "APPLY_FOR_DEBIT_CARD") {
      applicationManager.getCardsManager().applyNewCard(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    }else if(this.flowType === BBConstants.CREATE_TRANSACTION_SUCCESS){
      ACHManager.createACHTranscation(params, this.verifyOTPSuccess.bind(this), this.verifyACHOTPFailure.bind(this));
    }else if(this.flowType === BBConstants.EXECUTE_TEMPLATE_SUCCESS){
      ACHManager.executeTemplate(params, this.verifyOTPSuccess.bind(this), this.verifyACHOTPFailure.bind(this));
    }else if(this.flowType === BBConstants.FETCH_UPLOADED_ACH_FILE){
      ACHManager.uploadNewACHFile(params, this.verifyOTPSuccess.bind(this), this.verifyACHOTPFailure.bind(this));
    } else if (this.flowType === "PAY_MULTIPLE_BENEFICIARIES") {
      applicationManager.getTransactionManager().createBulkTransfer(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if(this.flowType === "ADD_PHONE_NUMBER") {
      userPreferencesManager.updateUserProfileDetails(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if(this.flowType === "UPDATE_PHONE_NUMBER") {
      userPreferencesManager.updateUserProfileDetails(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if(this.flowType === "REMOVE_PHONE_NUMBER") {
      userPreferencesManager.updateUserProfileDetails(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if(this.flowType === "ADD_EMAIL") {
      userPreferencesManager.updateUserProfileDetails(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if(this.flowType === "UPDATE_EMAIL") {
      userPreferencesManager.updateUserProfileDetails(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if(this.flowType === "REMOVE_EMAIL") {
      userPreferencesManager.updateUserProfileDetails(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    } else if(this.flowType === "SUSPEND_USER") {
      userPreferencesManager.updateUserStatus(params, this.verifyOTPSuccess.bind(this), this.verifyOTPFailure.bind(this));
    }
  };
  MFAManager.prototype.verifyUpdateSecurityQuestionsOTP = function (params, presentationSuccessCallback, presentationErrorCallback) {
    var userobj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ExternalUsers_2");
    userobj.customVerb('verifyUpdateSecurityQuestionsOTP', params, getUserCompletionCallback);
    function getUserCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
  MFAManager.prototype.verifyLoginMFAOtp = function (params, presentationSuccessCallback, presentationErrorCallback) {
    var userobj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Users_2");
    userobj.customVerb('verifyLoginMFAOTP', params, getUserCompletionCallback);
    function getUserCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
  MFAManager.prototype.verifyOTPSuccess = function (response) {
    if (response.MFAAttributes) {
      if (response.MFAAttributes.securityKey) {
        this.MFAResponse.MFAAttributes.remainingResendAttempts = response.MFAAttributes.remainingResendAttempts;
        this.MFAResponse.MFAAttributes.securityKey = response.MFAAttributes.securityKey;
        this.MFAResponse.MFAAttributes.communicationType = this.getCommunicationType();
        this.MFAResponse.MFAAttributes.isOTPExpired = false;
      } else if (response.MFAAttributes.isOTPExpired) {
        this.MFAResponse.MFAAttributes.remainingResendAttempts = response.MFAAttributes.remainingResendAttempts;
        this.MFAResponse.MFAAttributes.isOTPExpired = response.MFAAttributes.isOTPExpired;
        this.MFAResponse.MFAAttributes.communicationType = this.getCommunicationType();
      }
      applicationManager.getPresentationUtility().MFA.setSecureCodeScreen(response);
    } else {
      applicationManager.getPresentationUtility().MFA.navigateToAckScreen(response);
    }
  };
  MFAManager.prototype.isTransactionalError = function (error) {
    if (error.serverErrorRes.dbpErrCode) {
      if (error.serverErrorRes.dbpErrCode >= 10500 && error.serverErrorRes.dbpErrCode <= 10700) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  };
  MFAManager.prototype.verifyOTPFailure = function (error) {
    if (this.isTransactionalError(error)) {
      applicationManager.getPresentationUtility().MFA.navigateToTransactionScreen(error);
    } else {
      applicationManager.getPresentationUtility().MFA.enteredIncorrectOTP(error.serverErrorRes);
    }
  };
  
  MFAManager.prototype.verifyACHOTPFailure = function(error) {
    applicationManager.getPresentationUtility().MFA.enteredIncorrectOTP(error);
  }
  
  MFAManager.prototype.verifySecurityQuestions = function (params) {
    var transactionManager = applicationManager.getTransactionManager();
    //var ACHManager = applicationManager.getACHManager();
    const userPreferencesManager = applicationManager.getUserPreferencesManager();
    if (this.flowType == "LoginMFA") {
      this.verifyLoginMFASecurityQuestions(params, this.verifyAnswersSuccess.bind(this), this.verifyAnswersFailure.bind(this));
    }
    else if (this.flowType == "UPDATE_USERNAME") {
      var userObj = applicationManager.getUserPreferencesManager();
      userObj.updateUserName(params, this.verifyAnswersSuccess.bind(this), this.verifyAnswersFailure.bind(this));
    }
    else if (this.flowType == "UPDATE_PASSWORD") {
      var userObj = applicationManager.getUserPreferencesManager();
      userObj.updateUserPassword(params, this.verifyAnswersSuccess.bind(this), this.verifyAnswersFailure.bind(this));
    }
	else if (this.flowType === "PSD2_TPP_CONSENT_REVOKED") {
	  applicationManager.getSettingsManager().updatePSD2ConsentData(params,this.verifyAnswersSuccess.bind(this), this.verifyAnswersFailure.bind(this));
	}
    else if (this.flowType === "BULK_BILL_PAY") {
      applicationManager.getTransactionManager().createBulkBillPayPayement(params, this.verifyAnswersSuccess.bind(this), this.verifyAnswersFailure.bind(this));
    } else if (this.flowType === "LOCK_CARD") {
      applicationManager.getCardsManager().lockCard(params, this.verifyAnswersSuccess.bind(this), this.verifyAnswersFailure.bind(this));
    } else if (this.flowType === "UNLOCK_CARD") {
      applicationManager.getCardsManager().unLockCard(params, this.verifyAnswersSuccess.bind(this), this.verifyAnswersFailure.bind(this));
    } else if (this.flowType === "CHANGE_PIN_DEBIT") {
      applicationManager.getCardsManager().changePin(params, this.verifyAnswersSuccess.bind(this), this.verifyAnswersFailure.bind(this));
    } else if (this.flowType === "REPORT_LOST") {
      applicationManager.getCardsManager().reportLost(params, this.verifyAnswersSuccess.bind(this), this.verifyAnswersFailure.bind(this));
    } else if (this.flowType === "CANCEL_CARD") {
      applicationManager.getCardsManager().updateCardStatus(params, this.verifyAnswersSuccess.bind(this), this.verifyAnswersFailure.bind(this));
    } else if (this.flowType === "REPLACE_CARD") {
      applicationManager.getCardsManager().replaceCard(params, this.verifyAnswersSuccess.bind(this), this.verifyAnswersFailure.bind(this));
    } else if (this.flowType === "CHANGE_PIN_CREDIT") {
      applicationManager.getCardsManager().createCardRequest(params, this.verifyAnswersSuccess.bind(this), this.verifyAnswersFailure.bind(this));
    } else if (this.flowType === "ACTIVATE_CARD") {
      applicationManager.getCardsManager().activateCards(params, this.verifyAnswersSuccess.bind(this), this.verifyAnswersFailure.bind(this));
    }else if (this.flowType === "BULK_BILL_PAYMENT") {
      transactionManager.createBulkBillPayTransaction(params, this.verifyAnswersSuccess.bind(this), this.verifyAnswersFailure.bind(this));
    } else if (this.flowType === "SINGLE_BILL_PAYMENT") {
      transactionManager.createBillPayTransaction(params, this.verifyAnswersSuccess.bind(this), this.verifyAnswersFailure.bind(this));
    } else if (this.flowType === "UPDATE_BILL_PAYMENT") {
      transactionManager.updateBillPayTransaction(params, this.verifyAnswersSuccess.bind(this), this.verifyAnswersFailure.bind(this));
    } else if (this.flowType === "P2P_CREATE") {
      transactionManager.createP2PTransaction(params, this.verifyAnswersSuccess.bind(this), this.verifyAnswersFailure.bind(this));
    } else if (this.flowType === "P2P_EDIT") {
      transactionManager.updateP2PTransaction(params, this.verifyAnswersSuccess.bind(this), this.verifyAnswersFailure.bind(this));
    } else if (this.flowType === "DOMESTIC_WIRE_TRANSFER") {
      transactionManager.createDomesticWireTransfer(params, this.verifyAnswersSuccess.bind(this), this.verifyAnswersFailure.bind(this));
    } else if (this.flowType === "INTERNATIONAL_WIRE_TRANSFER") {
      transactionManager.createInternationalWireTransfer(params, this.verifyAnswersSuccess.bind(this), this.verifyAnswersFailure.bind(this));
    } else if (this.flowType === "TRANSFER_BETWEEN_OWN_ACCOUNT_UPDATE") {
      transactionManager.editTransferToOwnAccounts(params, this.verifyAnswersSuccess.bind(this), this.verifyAnswersFailure.bind(this));
    } else if (this.flowType === "INTRA_BANK_FUND_TRANSFER_UPDATE") {
      transactionManager.editIntraBankAccFundTransfer(params, this.verifyAnswersSuccess.bind(this), this.verifyAnswersFailure.bind(this));
    } else if (this.flowType === "INTER_BANK_ACCOUNT_FUND_TRANSFER_UPDATE") {
      transactionManager.editInterBankAccFundTransfer(params, this.verifyAnswersSuccess.bind(this), this.verifyAnswersFailure.bind(this));
    } else if (this.flowType === "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_UPDATE") {
      transactionManager.editInternationalAccFundTransfer(params, this.verifyAnswersSuccess.bind(this), this.verifyAnswersFailure.bind(this));
    } else if (this.flowType === "TRANSFER_BETWEEN_OWN_ACCOUNT_CREATE") {
      transactionManager.createTransferToOwnAccounts(params, this.verifyAnswersSuccess.bind(this), this.verifyAnswersFailure.bind(this));
    } else if (this.flowType === "INTRA_BANK_FUND_TRANSFER_CREATE") {
      transactionManager.createIntraBankAccFundTransfer(params, this.verifyAnswersSuccess.bind(this), this.verifyAnswersFailure.bind(this));
    } else if (this.flowType === "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE") {
      transactionManager.createInterBankAccFundTransfer(params, this.verifyAnswersSuccess.bind(this), this.verifyAnswersFailure.bind(this));
    } else if (this.flowType === "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE") {
      transactionManager.createInternationalAccFundTransfer(params, this.verifyAnswersSuccess.bind(this), this.verifyAnswersFailure.bind(this));
    }else if (this.flowType === "CREATE_BULKWIRE_TRANSFER") {
      transactionManager.createBulkWireTransaction(params, this.verifyAnswersSuccess.bind(this), this.verifyAnswersFailure.bind(this));
    }else if (this.flowType === "CREATE_BULKWIRE_TRANSFER_TEMPLATE") {
      transactionManager.createBulkWireTransferOperation(params, this.verifyAnswersSuccess.bind(this), this.verifyAnswersFailure.bind(this));
    }else if(this.flowType === BBConstants.CREATE_TRANSACTION_SUCCESS){
      ACHManager.createACHTranscation(params, this.verifyAnswersSuccess.bind(this), this.verifyAnswersFailure.bind(this));
    }else if(this.flowType === BBConstants.EXECUTE_TEMPLATE_SUCCESS){
      ACHManager.executeTemplate(params, this.verifyAnswersSuccess.bind(this), this.verifyAnswersFailure.bind(this));
    }else if(this.flowType === BBConstants.FETCH_UPLOADED_ACH_FILE){
      ACHManager.uploadNewACHFile(params, this.verifyAnswersSuccess.bind(this), this.verifyAnswersFailure.bind(this));
    } else if (this.flowType === "PAY_MULTIPLE_BENEFICIARIES") {
      applicationManager.getTransactionManager().createBulkTransfer(params, this.verifyAnswersSuccess.bind(this), this.verifyAnswersFailure.bind(this));
    }else if (this.flowType === "APPLY_FOR_DEBIT_CARD") {
      applicationManager.getCardsManager().applyNewCard(params, this.verifyAnswersSuccess.bind(this), this.verifyAnswersFailure.bind(this));
    } else if(this.flowType === "ADD_PHONE_NUMBER") {
      userPreferencesManager.updateUserProfileDetails(params, this.verifyAnswersSuccess.bind(this), this.verifyAnswersFailure.bind(this));
    } else if(this.flowType === "UPDATE_PHONE_NUMBER") {
      userPreferencesManager.updateUserProfileDetails(params, this.verifyAnswersSuccess.bind(this), this.verifyAnswersFailure.bind(this));
    } else if(this.flowType === "REMOVE_PHONE_NUMBER") {
      userPreferencesManager.updateUserProfileDetails(params, this.verifyAnswersSuccess.bind(this), this.verifyAnswersFailure.bind(this));
    } else if(this.flowType === "ADD_EMAIL") {
      userPreferencesManager.updateUserProfileDetails(params, this.verifyAnswersSuccess.bind(this), this.verifyAnswersFailure.bind(this));
    } else if(this.flowType === "UPDATE_EMAIL") {
      userPreferencesManager.updateUserProfileDetails(params, this.verifyAnswersSuccess.bind(this), this.verifyAnswersFailure.bind(this));
    } else if(this.flowType === "REMOVE_EMAIL") {
      userPreferencesManager.updateUserProfileDetails(params, this.verifyAnswersSuccess.bind(this), this.verifyAnswersFailure.bind(this));
    } else if(this.flowType === "SUSPEND_USER") {
      userPreferencesManager.updateUserStatus(params, this.verifyAnswersSuccess.bind(this), this.verifyAnswersFailure.bind(this));
    }
  };
  MFAManager.prototype.verifyLoginMFASecurityQuestions = function (params, presentationSuccessCallback, presentationErrorCallback) {
    var userobj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Users_2");
    userobj.customVerb('verifyLoginMFASecurityQuestions', params, getUserCompletionCallback);
    function getUserCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
  MFAManager.prototype.verifyAnswersSuccess = function (response) {
    if (response.MFAAttributes) {
      this.setMFAResponse(response);
      applicationManager.getPresentationUtility().MFA.navigateToSecurityQuestion();
    }
    else {
      applicationManager.getPresentationUtility().MFA.navigateToAckScreen(response);
    }
  };
  MFAManager.prototype.verifyAnswersFailure = function (error) {
    if (this.isTransactionalError(error)) {
      applicationManager.getPresentationUtility().MFA.navigateToTransactionScreen(error);
    } else {
      applicationManager.getPresentationUtility().MFA.enteredIncorrectAnswer(error.serverErrorRes);
    }
  };
  return MFAManager;
});