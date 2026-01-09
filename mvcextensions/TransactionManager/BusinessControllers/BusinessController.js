/**
*@module TransactionManager
 */
define([], function () {
  /**
  * Transaction Manager consists of all possible methods of Transactions and service calls regarding transactions.
  *@alias module:TransactionManager
  *@class
  */
  function TransactionManager() {
    var modelDefinition = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("TransactionsList");
    this.transferObject = new modelDefinition();
    /**@member {OBJECT}  Contains all frequency types*/
    this.frequencyTypes = {
      ONCE: "Once",
      WEEKLY: "Weekly",
      DAILY: "Daily",
      MONTHLY: "Monthly",
      BIWEEKLY: "BiWeekly",
      YEARLY: "Yearly",
      HALFYEARLY: "Half Yearly",
      QUARTERLY: "Quarterly",
      EVERYTWOWEEKS: "BiWeekly"
    };
  }
  inheritsFrom(TransactionManager, kony.mvc.Business.Delegator);
  TransactionManager.prototype.initializeBusinessController = function () { };
  /**
    * set an attribute in the transaction object.
    * @param {string} key , key in the transaction object.
    * @param {string} value , value to be assigned for the key in the transaction object.
    */
  TransactionManager.prototype.setTransactionAttribute = function (key, value) {
    this.transferObject[key] = value;
  };
  /**
    * set a primary attribute in the transaction object.
    * @param {object} data , data consists of transactiond Id key value pair.
    */
  TransactionManager.prototype.setTransactionprimaryAttribute = function (data) {
    var modelDefinition = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Transaction");
    this.transferObject1 = new modelDefinition(data);
    for (var key in this.transferObject) {
      if (key !== "transactionId")
        this.transferObject1[key] = this.transferObject[key];
    }
    this.transferObject = this.transferObject1;
  };
  /**
    * used to get a transaction object.
    * @return {object} transferObject, entire Transaction Object.
    */
  TransactionManager.prototype.getTransactionObject = function () {
    return this.transferObject;
  };
  /**
    * used to set a transaction object.
    * @param {object} object, entire Transaction Object.
    */
  TransactionManager.prototype.setTransactionObject = function (object) {
    this.transferObject = object;
  };
  /**
    * used to get available frequency types.
    * @return {object} frequencyTypes, Frequency Type object.
    */
  TransactionManager.prototype.getAvailableFrequencyType = function () {
    return this.frequencyTypes;
  };
  /**
    * used to clear Transaction Object.
    */
  TransactionManager.prototype.clearTransferObject = function () {
    var modelDefinition = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Transaction");
    this.transferObject = new modelDefinition();
  };

    // [Trixon] Custom Enquiry service integration for Apollo Transfers {EthSwitch, RTGS, Telebirr, ATM, MPesa, MPesa Trust, Awach}
    TransactionManager.prototype.customApolloTransfer = function(serviceName, operationName, payload, successCallBack, errorCallBack){
        var integrationObj = KNYMobileFabric.getIntegrationService(serviceName);
        integrationObj.invokeOperation(operationName, {}, payload, successCallBack, errorCallBack);
    };
    // [Trixon] End

  /**
    * get Posted Transactions for a particular account using a service call.
    * @param {object} criteria , key value pair of Accound Id.
    * @param {function} presentationSuccessCallback , invoke the call back with success response.
    * @param {function} presentationErrorCallback , invoke the call back with error response.
    */
  TransactionManager.prototype.fetchAccountPostedTransactions = function (criteria, presentationSuccessCallback, presentationErrorCallback) {
    var postTran = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Transactions");
    postTran.customVerb("getAccountPostedTransactions", criteria, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
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
  /**
    * get Pending Transactions for a particular account using a service call.
    * @param {object} criteria , key value pair of Accound Id.
    * @param {function} presentationSuccessCallback , invoke the call back with success response.
    * @param {function} presentationErrorCallback , invoke the call back with error response.
    */
  TransactionManager.prototype.fetchAccountPendingTransactions = function (criteria, presentationSuccessCallback, presentationErrorCallback) {
    var pendTran = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Transactions");
    pendTran.customVerb("getAccountPendingTransactions", criteria, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
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

  TransactionManager.prototype.fetchAccountBlockedFunds = function (criteria, presentationSuccessCallback, presentationErrorCallback) {
    var blockedTran = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("BlockFunds");
    blockedTran.customVerb("getList", criteria, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true && obj["data"] && obj["data"]["Transactions"]) {
        presentationSuccessCallback(obj["data"]["Transactions"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };

  TransactionManager.prototype.getDownloadAttachmentUrl = function( reqParams ) {
    var mfURL = KNYMobileFabric.mainRef.config.services_meta.DocumentManagement.url;
    var authToken = KNYMobileFabric.currentClaimToken;
    var serviceURL = mfURL + "/objects/CustomerAdvice?";
    var paramURL = "";
    if( reqParams.fileName){
      paramURL += "fileName=" + reqParams.fileName;
    }
    if(paramURL === "" && reqParams.fileID){
      paramURL += "fileID=" + reqParams.fileID;
    } else if(reqParams.fileID){
      paramURL += "&fileID=" + reqParams.fileID;
    }
    if(paramURL === "" && reqParams.customerId){
      paramURL += "customerId=" + reqParams.customerId;
    } else if(reqParams.customerId) {
      paramURL += "&customerId=" + reqParams.customerId;
    }
    return serviceURL + paramURL;
  };
  
  TransactionManager.prototype.DownloadTransactionPDF = function( reqParams,presentationSuccessCallback,presentationErrorCallback ) {
    var attachments = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("DownloadTransactionPDF");
    attachments.save(reqParams, saveCompletionCallback, "online");
    function saveCompletionCallback(status, data, error) {
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

  TransactionManager.prototype.retrieveAttachments = function(reqParams, presentationSuccessCallback, presentationErrorCallback) {
    var attachments = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("CustomerAdvice");
    attachments.customVerb("generate", reqParams, getAllCompletionCallback);

    function getAllCompletionCallback(status, data, error) {
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

  /**
    * get Posted Transactions using a service call base on the search options.
    * @param {object} searchOptions , object consisting various key value pairs as filters.
    * @param {function} presentationSuccessCallback , invoke the call back with success response.
    * @param {function} presentationErrorCallback , invoke the call back with error response.
    */
  TransactionManager.prototype.fetchPostedTransactions = function (searchOptions, presentationSuccessCallback, presentationErrorCallback) {
    var getPostedUserTransactions = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("TransactionsList");
    getPostedUserTransactions.customVerb("getPostedUserTransactions", searchOptions, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
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
  /**
    * get Pending Transactions using a service call base on the search options.
    * @param {object} searchOptions , object consisting various key value pairs as filters.
    * @param {function} presentationSuccessCallback , invoke the call back with success response.
    * @param {function} presentationErrorCallback , invoke the call back with error response.
    */
  TransactionManager.prototype.fetchPendingTransactions = function (searchOptions, presentationSuccessCallback, presentationErrorCallback) {
    var getPendingUserTransactions = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("TransactionsList");
    getPendingUserTransactions.customVerb("getPendingUserTransactions", searchOptions, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
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
  /**
    * get Posted transfer and p2p transactions for a user using a service call.
    * @param {function} presentationSuccessCallback , invoke the call back with success response.
    * @param {function} presentationErrorCallback , invoke the call back with error response.
    */
  TransactionManager.prototype.fetchUserpostedTransactions = function (presentationSuccessCallback, presentationErrorCallback, params) {
    var getPostedUserTransactions = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("OneTimeTransfer");
    if(kony.sdk.isNullOrUndefined(params)){
      params = {};
    }
    getPostedUserTransactions.customVerb("getTransfers", params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
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
  /**
    * get Posted transfer and p2p transactions for a user using a service call.
    * @param {function} presentationSuccessCallback , invoke the call back with success response.
    * @param {function} presentationErrorCallback , invoke the call back with error response.
    */
  TransactionManager.prototype.fetchUserScheduledTransactions = function (presentationSuccessCallback, presentationErrorCallback, params) {
    var getPendingUserTransactions = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("StandingInstruction");
    if(kony.sdk.isNullOrUndefined(params)){
      params = {};
    }
    getPendingUserTransactions.customVerb("getInstructions", params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
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
  /**
    * create a new Wire Transfer using service call.
    * @param {function} presentationSuccessCallback , invoke the call back with success response.
    * @param {function} presentationErrorCallback , invoke the call back with error response.
    */
  TransactionManager.prototype.createDomesticWireTransfer = function (transferData, presentationSuccessCallback, presentationErrorCallback) {
    var createTransactionRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Transaction");
    createTransactionRepo.customVerb("DomesticWireTransfer", transferData, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
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
  /**
    * create a new Wire Transfer using service call.
    * @param {function} presentationSuccessCallback , invoke the call back with success response.
    * @param {function} presentationErrorCallback , invoke the call back with error response.
    */
  TransactionManager.prototype.createInternationalWireTransfer = function (transferData, presentationSuccessCallback, presentationErrorCallback) {
    var createTransactionRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Transaction");
    createTransactionRepo.customVerb("InternationalWireTransfer", transferData, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
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
  /**
    * create a Transaction.
    * @param {object} tranObj , object to create a transaction.
    * @param {function} presentationSuccessCallback , invoke the call back with success response.
    * @param {function} presentationErrorCallback , invoke the call back with error response.
    */
  TransactionManager.prototype.createTransaction = function (tranObj, presentationSuccessCallback, presentationErrorCallback) {
    var transacObj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Transactions");
    var transObj = this.convertDateFormat(tranObj);
    transacObj.save(transObj, saveCompletionCallback, "online");
    function saveCompletionCallback(status, data, error) {
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
  /**
    * create a Transaction.
    * @param {object} tranObj , object to create a p2p transaction.
    * @param {function} presentationSuccessCallback , invoke the call back with success response.
    * @param {function} presentationErrorCallback , invoke the call back with error response.
    */
  TransactionManager.prototype.createP2PTransaction = function (tranObj, presentationSuccessCallback, presentationErrorCallback) {
    var transacObj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Payment_P2P");
    var transObj = this.convertDateFormat(tranObj);
    transacObj.customVerb("createTransfer", transObj, saveCompletionCallback);
    function saveCompletionCallback(status, data, error) {
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
  /**
    * used to convert dates in transaction object to backend format.
    * @param {object} transactionObj , entire transaction object.
    * @return {object} transactionObj , transaction object after formating the dates.
    */
  TransactionManager.prototype.convertDateFormat = function (transactionObj) {
    var formatUtil = applicationManager.getFormatUtilManager();
    if (transactionObj.scheduledDate)
      transactionObj.scheduledDate = formatUtil.convertToUTC(transactionObj.scheduledDate);
    if (transactionObj.frequencyStartDate)
      transactionObj.frequencyStartDate = formatUtil.convertToUTC(transactionObj.frequencyStartDate);
    if (transactionObj.frequencyEndDate)
      transactionObj.frequencyEndDate = formatUtil.convertToUTC(transactionObj.frequencyEndDate);
    if (transactionObj.creditValueDate) // [Trixon] Add this if condition to format creditValueDate
      transactionObj.creditValueDate = formatUtil.convertToUTC(transactionObj.creditValueDate);
    return transactionObj;
  };
  /**
    * used to construct JSON  from the transaction object.
    * @param {object} transactionObj , entire transaction object.
    * @return {object} JsonObj , JSON  from the transaction object.
    */
  TransactionManager.prototype.getTransactionObjJSON = function (transObj) {
    var JsonObj = {
      "amount": transObj.amount,
      "ExternalAccountNumber": transObj.ExternalAccountNumber,
      "toAccountNumber": transObj.toAccountNumber,
      "frequencyEndDate": transObj.frequencyEndDate,
      "frequencyStartDate": transObj.frequencyStartDate,
      "frequencyType": transObj.frequencyType,
      "fromAccountNumber": transObj.fromAccountNumber,
      "isScheduled": transObj.isScheduled,
      "numberOfRecurrences": transObj.numberOfRecurrences,
      "scheduledDate": transObj.scheduledDate,
      "transactionId": transObj.transactionId,
      "transactionsNotes": transObj.transactionsNotes,
      "transactionType": transObj.transactionType,
      "MFAAttributes": transObj.MFAAttributes,
      "fromAccountType": transObj.fromAccountType,
      "fromAccountName": transObj.fromAccountName,
      "toAccountName": transObj.toAccountName,
      "accountID": transObj.accountID,
      "accountNumber": transObj.accountNumber,
      //"amount":transObj.amount,
      "amountTransferedTillNow": transObj.amountTransferedTillNow,
      "authenticationRequired": transObj.authenticationRequired,
      "billCategory": transObj.billCategory,
      "billCategoryId": transObj.billCategoryId,
      "billDueAmount": transObj.billDueAmount,
      "billDueDate": transObj.billDueDate,
      "billerCategoryName": transObj.billerCategoryName,
      "billGeneratedDate": transObj.billGeneratedDate,
      "billid": transObj.billid,
      "billPaidAmount": transObj.billPaidAmount,
      "billPaidDate": transObj.billPaidDate,
      "bulkPayString": transObj.bulkPayString,
      "cashlessEmail": transObj.cashlessEmail,
      "cashlessMode": transObj.cashlessMode,
      "cashlessOTP": transObj.cashlessOTP,
      "cashlessOTPValidDate": transObj.cashlessOTPValidDate,
      "cashlessPersonName": transObj.cashlessPersonName,
      "cashlessPhone": transObj.cashlessPhone,
      "cashlessPin": transObj.cashlessPin,
      "cashlessSecurityCode": transObj.cashlessSecurityCode,
      "cashWithdrawalTransactionStatus": transObj.cashWithdrawalTransactionStatus,
      "category": transObj.category,
      "checkImage": transObj.checkImage,
      "checkImageBack": transObj.checkImageBack,
      "checkNumber": transObj.checkNumber,
      "deliverBy": transObj.deliverBy,
      "description": transObj.description,
      "eBillEnable": transObj.eBillEnable,
      "eBillSupport": transObj.eBillSupport,
      "ebillURL": transObj.ebillURL,
      "errmsg": transObj.errmsg,
      //"ExternalAccountNumber":transObj.ExternalAccountNumber,
      "firstDeposit": transObj.firstDeposit,
      "firstRecordNumber": transObj.firstRecordNumber,
      //"frequencyEndDate":frequencyEndDate,
      //"frequencyStartDate":frequencyStartDate,,
      //"frequencyType":frequencyType,
      "fromAccountBalance": transObj.fromAccountBalance,
      //"fromAccountName":fromAccountName,
      //"fromAccountNumber":fromAccountNumber,
      //"fromAccountType":fromAccountType,
      "fromCheckNumber": transObj.fromCheckNumber,
      "fromNickName": transObj.fromNickName,
      "hasDepositImage": transObj.hasDepositImage,
      //"isScheduled":isScheduled,
      "lastRecordNumber": transObj.lastRecordNumber,
      "limit": transObj.limit,
      //"numberOfRecurrences":numberOfRecurrences,
      "offset": transObj.offset,
      "order": transObj.order,
      "otp": transObj.otp,
      "p2pContact": transObj.p2pContact,
      "p2pRequiredDate": transObj.p2pRequiredDate,
      "payeeAccountNumber": transObj.payeeAccountNumber,
      "payeeAddressLine1": transObj.payeeAddressLine1,
      "payeeId": transObj.payeeId,
      "payeeName": transObj.payeeName,
      "payeeNickName": transObj.payeeNickName,
      "payoffFlag": transObj.payoffFlag,
      "payPersonEmail": transObj.payPersonEmail,
      "payPersonName": transObj.payPersonName,
      "payPersonPhone": transObj.payPersonPhone,
      "penaltyFlag": transObj.penaltyFlag,
      "personId": transObj.personId,
      "recurrenceDesc": transObj.recurrenceDesc,
      "referenceId": transObj.referenceId,
      //"scheduledDate":scheduledDate,
      "searchAmount": transObj.searchAmount,
      "searchDateRange": transObj.searchDateRange,
      "searchDescription": transObj.searchDescription,
      "searchEndDate": transObj.searchEndDate,
      "searchMaxAmount": transObj.searchMaxAmount,
      "searchMinAmount": transObj.searchMinAmount,
      "searchStartDate": transObj.searchStartDate,
      "searchTransactionType": transObj.searchTransactionType,
      "searchType": transObj.searchType,
      "secondaryEmail": transObj.secondaryEmail,
      "secondaryEmail2": transObj.secondaryEmail2,
      "secondaryPhoneNumber2": transObj.secondaryPhoneNumber2,
      "secondDeposit": transObj.secondDeposit,
      "secondoryPhoneNumber": transObj.secondoryPhoneNumber,
      "sortBy": transObj.sortBy,
      "statusDescription": transObj.statusDescription,
      "success": transObj.success,
      // "toAccountName":toAccountName,
      //"toAccountNumber":toAccountNumber,
      "toAccountType": transObj.toAccountType,
      "toCheckNumber": transObj.toCheckNumber,
      "totalAmount": transObj.totalAmount,
      "transactionComments": transObj.transactionComments,
      "transactionDate": transObj.transactionDate,
      //"transactionId":transactionId,
      //"transactionsNotes":transactionsNotes,
      //"transactionType":transactionType,
      "validDate": transObj.validDate,
      "viewReportLink": transObj.viewReportLink,
      "overdraft": transObj.overdraft,
      "isPaypersonDeleted": transObj.isPaypersonDeleted,
      "fee": transObj.fee,
      "frontImage1": transObj.frontImage1,
      "frontImage2": transObj.frontImage2,
      "backImage1": transObj.backImage1,
      "backImage2": transObj.backImage2,
      "checkDesc": transObj.checkDesc,
      "checkNumber1": transObj.checkNumber1,
      "checkNumber2": transObj.checkNumber2,
      "bankName1": transObj.bankName1,
      "bankName2": transObj.bankName2,
      "withdrawlAmount1": transObj.withdrawlAmount1,
      "withdrawlAmount2": transObj.withdrawlAmount2,
      "totalCheckAmount": transObj.totalCheckAmount,
      "cashAmount": transObj.cashAmount,
      "payeeCurrency": transObj.payeeCurrency,
      "swiftCode": transObj.swiftCode,
      "wireAccountType": transObj.wireAccountType,
      "country": transObj.country,
      "IBAN": transObj.IBAN,
      "bankName": transObj.bankName,
      "routingNumber": transObj.routingNumber,
      "internationalRoutingCode": transObj.internationalRoutingCode,
      "zipCode": transObj.zipCode,
      "cityName": transObj.cityName,
      "state": transObj.state,
      "bankAddressLine1": transObj.bankAddressLine1,
      "bankAddressLine2": transObj.bankAddressLine2,
      "bankCity": transObj.bankCity,
      "bankState": transObj.bankState,
      "bankZip": transObj.bankZip,
      "payeeType": transObj.payeeType,
      "disputeReason": transObj.disputeReason,
      "disputeDescription": transObj.disputeDescription,
      "checkDateOfIssue": transObj.checkDateOfIssue,
      "checkReason": transObj.checkReason,
      "isPayeeDeleted": transObj.isPayeeDeleted,
      "payeeAddressLine2": transObj.payeeAddressLine2,
      "amountRecieved": transObj.amountRecieved,
      "requestValidityInMonths": transObj.requestValidityInMonths,
      "requestValidity": transObj.requestValidity,
      "requestType": transObj.requestType,
      "disputeDate": transObj.disputeDate,
      "disputeStatus": transObj.disputeStatus,
      "isDisputed": transObj.isDisputed,
      "cardId": transObj.cardId,
      "isOverdraft": transObj.isOverdraft,
      "title": transObj.title,
      "generatedBy": transObj.generatedBy,
      "filters": transObj.filters,
      "statementReference": transObj.statementReference,
      "transCreditDebitIndicator": transObj.transCreditDebitIndicator,
      "bookingDateTime": transObj.bookingDateTime,
      "valueDateTime": transObj.valueDateTime,
      "transactionInformation": transObj.transactionInformation,
      "addressLine": transObj.addressLine,
      "transactionAmount": transObj.transactionAmount,
      "transactionCurrency": transObj.transactionCurrency,
      "chargeAmount": transObj.chargeAmount,
      "chargeCurrency": transObj.chargeCurrency,
      "sourceCurrency": transObj.sourceCurrency,
      "targetCurrency": transObj.targetCurrency,
      "unitCurrency": transObj.unitCurrency,
      "exchangeRate": transObj.exchangeRate,
      "contractIdentification": transObj.contractIdentification,
      "quotationDate": transObj.quotationDate,
      "instructedAmount": transObj.instructedAmount,
      "transactionCode": transObj.transactionCode,
      "transactionSubCode": transObj.transactionSubCode,
      "proprietaryTransactionCode": transObj.proprietaryTransactionCode,
      "proprietaryTransactionIssuer": transObj.proprietaryTransactionIssuer,
      "balanceCreditDebitIndicator": transObj.balanceCreditDebitIndicator,
      "balanceType": transObj.balanceType,
      "balanceAmount": transObj.balanceAmount,
      "balanceCurrency": transObj.balanceCurrency,
      "merchantName": transObj.merchantName,
      "merchantCategoryCode": transObj.merchantCategoryCode,
      "creditorAgentSchemeName": transObj.creditorAgentSchemeName,
      "creditorAgentIdentification": transObj.creditorAgentIdentification,
      "creditorAgentName": transObj.creditorAgentName,
      "beneficiaryName": transObj.beneficiaryName,
      "isInternationalAccount": transObj.isInternationalAccount,
      "createdDate": transObj.createdDate,
      "DomesticPaymentId": transObj.DomesticPaymentId,
      "Auth_Token": transObj.Auth_Token
    };
    return JsonObj
  };
  /**
    * used to convert date  to backend format.
    * @param {string} tempDate , date in string format.
    * @return {string} formattedDate , backend formated date in string format.
    */
  TransactionManager.prototype.convertDateToBackendFormat = function (tempDate) {
    var formatUtil = applicationManager.getFormatUtilManager();
    var dateobj = formatUtil.getDateObjectFromCalendarString(tempDate, 'MM/DD/YYYY');
    var formattedDate = formatUtil.getFormatedDateString(dateobj, formatUtil.BACKEND_DATE_FORMAT);
    return formattedDate;
  };
  /**
    * get account posted transactions  for a external account using a service call.
    * @param {object} params , key value pairs required to fetch transactions
    * @param {function} presentationSuccessCallback , invoke the call back with success response.
    * @param {function} presentationErrorCallback , invoke the call back with error response.
    */
  TransactionManager.prototype.fetchAccountPostedExternalTransactions = function (params, presentationSuccessCallback, presentationErrorCallback) {
    var postedExternalTran = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ExternalTransactionsAggregation");
    postedExternalTran.getByCriteria(params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      if (status === kony.mvc.constants.STATUS_FAILURE) {
        presentationErrorCallback(data);
      }
      else {
        presentationSuccessCallback(data);
      }
    }
  };
  /**
    * get user bill pay scheduled Transactions using a service call.
    * @param {object} criteria , key value pairs to get user scheduled bills.
    * @param {function} presentationSuccessCallback , invoke the call back with success response.
    * @param {function} presentationErrorCallback , invoke the call back with error response.
    */
  TransactionManager.prototype.fetchUserBillPayScheduledTransactions = function (criteria, presentationSuccessCallback, presentationErrorCallback) {
    var getPendingUserTransactions = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Payment_BillPayList");
    getPendingUserTransactions.customVerb("getScheduledPayments", criteria, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
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
  /**
    * get user Bill Pay Posted Transactions using a service call.
    * @param {object} criteria , key value pairs to get user scheduled bills.
    * @param {function} presentationSuccessCallback , invoke the call back with success response.
    * @param {function} presentationErrorCallback , invoke the call back with error response.
    */
  TransactionManager.prototype.fetchUserBillPayPostedTransactions = function (criteria, presentationSuccessCallback, presentationErrorCallback) {
    var getPostedUserTransactions = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Payment_BillPayList");
    getPostedUserTransactions.customVerb("getCompletedPayments", criteria, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
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
  /**
    * get Pending Cardless Transactions for a account using a service call.
    * @param {function} presentationSuccessCallback , invoke the call back with success response.
    * @param {function} presentationErrorCallback , invoke the call back with error response.
    */
  TransactionManager.prototype.fetchCardlessPendingTransactions = function (presentationSuccessCallback, presentationErrorCallback) {
    var pendTran = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Transactions");
    pendTran.customVerb("getPendingCardlessTransactions", {}, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
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
  /**
    * get Posted Cardless Transactions for a account using a service call.
    * @param {function} presentationSuccessCallback , invoke the call back with success response.
    * @param {function} presentationErrorCallback , invoke the call back with error response.
    */
  TransactionManager.prototype.fetchCardlessPostedTransactions = function (presentationSuccessCallback, presentationErrorCallback) {
    var pendTran = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Transactions");
    pendTran.customVerb("getPostedCardlessTransactions", {}, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
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
  /**
    * search the input string in the contacts.
    * @param {string} inputString , used to search the array.
    * @param {Array} contactsArray , array in which the search for inputString is done.
    * @returns {Array} - Array of records with matched string.
    */
  TransactionManager.prototype.searchInputStringForContactsList = function (inputString, contactsArray) {
    var matchedData = [];
    if (contactsArray !== null && contactsArray !== undefined) {
      for (var i = 0; i < contactsArray.length; i++) {
        if (contactsArray[i].firstname !== "" && contactsArray[i].firstname !== null && contactsArray[i].firstname !== undefined ||
            contactsArray[i].lastname !== "" && contactsArray[i].lastname !== null && contactsArray[i].lastname !== undefined) {
          if (contactsArray[i].firstname && contactsArray[i].firstname.toLowerCase().indexOf(inputString) >= 0) {
            matchedData.push(contactsArray[i]);
          }
          else if (contactsArray[i].lastname && contactsArray[i].lastname.toLowerCase().indexOf(inputString) >= 0) {
            matchedData.push(contactsArray[i]);
          }
        }
      }
    }
    return matchedData;
  };
  /**
    * create cardless Transactions using a service call.
    * @param {object} criteria , record which is sent to create transaction.
    * @param {function} presentationSuccessCallback , invoke the call back with success response.
    * @param {function} presentationErrorCallback , invoke the call back with error response.
    */
  TransactionManager.prototype.createCardlessTransaction = function (record, presentationSuccessCallback, presentationErrorCallback) {
    var transactionsRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Transactions");
    record.scheduledDate = this.convertDateToBackendFormat(record.scheduledDate);
    transactionsRepo.customVerb("createCardlessTransaction", record, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
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
  /**
    * delete current Recurrence transaction using a service call.
    * @param {object} criteria , key value pair of transaction Id which is to be deleted.
    * @param {function} presentationSuccessCallback , invoke the call back with success response.
    * @param {function} presentationErrorCallback , invoke the call back with error response.
    */
  TransactionManager.prototype.deleteRecurrenceTransaction = function (record, presentationSuccessCallback, presentationErrorCallback) {
    var transactionsRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Transactions");
    transactionsRepo.customVerb("cancelScheduledTransactionOccurrence", record, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
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
  /**
    * delete current Recurrence transaction using a service call.
    * @param {object} criteria , key value pair of transaction Id which is to be deleted.
    * @param {function} presentationSuccessCallback , invoke the call back with success response.
    * @param {function} presentationErrorCallback , invoke the call back with error response.
    */
  TransactionManager.prototype.deleteP2PRecurrenceTransaction = function (record, presentationSuccessCallback, presentationErrorCallback) {
    var transactionsRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Transaction");
    transactionsRepo.customVerb("P2PTransferCancelOccurrence", record, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
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

  /**
    * update a transaction using a service call.
    * @param {object} tranObj , key value pair which have to be updated for the transaction.
    * @param {function} presentationSuccessCallback , invoke the call back with success response.
    * @param {function} presentationErrorCallback , invoke the call back with error response.
    */
  TransactionManager.prototype.updateTransaction = function (tranObj, presentationSuccessCallback, presentationErrorCallback) {
    var transacObj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Transactions");
    var transObj = this.convertDateFormat(tranObj);
    var jsondata = this.getTransactionObjJSON(tranObj);
    transacObj.partialUpdate(jsondata, updateCompletionCallback, "online");
    function updateCompletionCallback(status, data, error) {
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
  /**
    * update a transaction using a service call.
    * @param {object} tranObj , key value pair which have to be updated for the transaction.
    * @param {function} presentationSuccessCallback , invoke the call back with success response.
    * @param {function} presentationErrorCallback , invoke the call back with error response.
    */
  TransactionManager.prototype.updateP2PTransaction = function (tranObj, presentationSuccessCallback, presentationErrorCallback) {
    var transacObj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Transaction");
    var tranObj = this.convertDateFormat(tranObj);
    var jsondata = this.getTransactionObjJSON(tranObj);
    transacObj.customVerb("P2PTransferEdit", jsondata, updateCompletionCallback);
    function updateCompletionCallback(status, data, error) {
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

  /**
  * to remove a bulk wire template Line item.
  * @param {object} requestParams , object to create a bulk wire template.
  * @param {function} presentationSuccessCallback , invoke the call back with success response.
  * @param {function} presentationErrorCallback , invoke the call back with error response.
  */
  TransactionManager.prototype.updateBulkWireTemplate = function(requestParams,presentationSuccessCallback,presentationErrorCallback){
    var  transacObj  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("BulkWire");
    transacObj.customVerb("UpdateBulkWireTemplate", requestParams, saveCompletionCallback);
    function  saveCompletionCallback(status,  data,  error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj["status"] === true){
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };

  /**
    * get Posted deposits  for an account using a service call.
    * @param {function} presentationSuccessCallback , invoke the call back with success response.
    * @param {function} presentationErrorCallback , invoke the call back with error response.
    */
  TransactionManager.prototype.getPostedDeposits = function (presentationSuccessCallback, presentationErrorCallback) {
    var transactionsRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Transactions");
    transactionsRepo.customVerb("getPostedDeposits", {}, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
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
  /**
    * get Pending deposits  for an account using a service call.
    * @param {function} presentationSuccessCallback , invoke the call back with success response.
    * @param {function} presentationErrorCallback , invoke the call back with error response.
    */
  TransactionManager.prototype.getPendingDeposits = function (presentationSuccessCallback, presentationErrorCallback) {
    var transactionsRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Transactions");
    transactionsRepo.customVerb("getPendingDeposits", {}, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
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
  /**
    * delete transaction using a service call.
    * @param {object} record ,  key value pair of transaction Id which is to be deleted.
    * @param {function} presentationSuccessCallback , invoke the call back with success response.
    * @param {function} presentationErrorCallback , invoke the call back with error response.
    */
  TransactionManager.prototype.deleteTransaction = function (record, presentationSuccessCallback, presentationErrorCallback) {
    var transactionsRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Payment_P2PList");
    transactionsRepo.customVerb("updateTransfer", record, deleteCompletionCallback);
    function deleteCompletionCallback(status, data, error) {
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
  /**
    * delete P2P transaction using a service call.
    * @param {object} record ,  key value pair of transaction Id which is to be deleted.
    * @param {function} presentationSuccessCallback , invoke the call back with success response.
    * @param {function} presentationErrorCallback , invoke the call back with error response.
    */
  TransactionManager.prototype.deleteP2PTransaction = function (record, presentationSuccessCallback, presentationErrorCallback) {
    var transactionsRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Transaction");
    transactionsRepo.customVerb("P2PTransferDelete", record, deleteCompletionCallback);
    function deleteCompletionCallback(status, data, error) {
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
  /**
    * get Posted Transactions for an external account using a service call.
    * @param {object} criteria ,  key value pairs required to get posted transactions.
    * @param {function} presentationSuccessCallback , invoke the call back with success response.
    * @param {function} presentationErrorCallback , invoke the call back with error response.
    */
  TransactionManager.prototype.fetchToExternalAccountTransactions = function (criteria, presentationSuccessCallback, presentationErrorCallback) {
    var postTran = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Activity");
    postTran.customVerb("getToExternalAccountTransactions", criteria, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
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
  /**
    * Fetch Wire Transcation of the user using a service call
    * @param {object} params - parameters for sorting|pagination|search
    * @param {string} [params.offset]  offset for pagination
    * @param {string} [params.searchString]  searchString for pagination
    * @param {string} [params.limit]  limit for pagination
    * @param {string} [params.sortBy]  sortBy parameter for sorting
    * @param {string} [params.order]  order for sorting asc or desc
    * @param {callBack} presentationSuccessCallback , invoke the call back with success response.
    * @param {callBack} presentationErrorCallback , invoke the call back with error response.
    */
  TransactionManager.prototype.fetchWireTransactions = function (params, presentationSuccessCallback, presentationErrorCallback) {
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
    var transactionModel = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Activity");
    transactionModel.customVerb("getUserWiredTransactions", params, getAllCompletionCallback);
  };
  /**
    * Fetch Wire Transcation of the user using a service call
    * @param {object} params - parameters for sorting|pagination|search
    * @param {string} [params.limit]  limit for pagination
    * @param {callBack} presentationSuccessCallback , invoke the call back with success response.
    * @param {callBack} presentationErrorCallback , invoke the call back with error response.
    */
  TransactionManager.prototype.fetchRecipientWireTransactions = function (params, presentationSuccessCallback, presentationErrorCallback) {
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
    var TransactionsModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Activity");
    TransactionsModel.customVerb('getRecipientWireTransaction', params, getAllCompletionCallback)
  };
  /**
    * get payed bills for a pyee.
    * @param {object}  -  payeeid of the payeee.
    * @param {function} presentationSuccessCallback - invoke the call back with success response.
    * @param {function} presentationErrorCallback - invoke the call back with error response.
    */
  TransactionManager.prototype.fetchPayeeBill = function (record, presentationSuccessCallback, presentationErrorCallback) {
    var getPayeeBills = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Payment_BillPayList");
    getPayeeBills.customVerb("getPayeePayments", record, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
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
  /**
    * get pay a person sent transactions.
    * @param {object}  params-  an object with offset, limit, sortby, orderby values.
    * @param {function} presentationSuccessCallback - invoke the call back with success response.
    * @param {function} presentationErrorCallback - invoke the call back with error response.
    */
  TransactionManager.prototype.fetchPayAPersonSentTransactions = function (params, presentationSuccessCallback, presentationErrorCallback) {
    var transferRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Transactions");
    transferRepo.customVerb("getSentP2PTransactions", params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
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
  /**
    * get recent Transactions for a User using a service call.
    * @param {object} command ,  key value pairs required to get recent transactions.
    * @param {function} presentationSuccessCallback , invoke the call back with success response.
    * @param {function} presentationErrorCallback , invoke the call back with error response.
    */
  TransactionManager.prototype.fetchUserRecentTransactions = function (command, presentationSuccessCallback, presentationErrorCallback) {
    var self = this;
    var TransactionsModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("OneTimeTransfer");
    TransactionsModel.customVerb("getTransfers", command, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
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
  /**
  * get scheduled Transactions for a User using a service call.
  * @param {object} command ,  key value pairs required to get scheduled transactions.
  * @param {function} presentationSuccessCallback , invoke the call back with success response.
  * @param {function} presentationErrorCallback , invoke the call back with error response.
  */
  TransactionManager.prototype.fetchScheduledUserTransactions = function (command, presentationSuccessCallback, presentationErrorCallback) {
    var self = this;
    var TransactionsModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("StandingInstruction");
    TransactionsModel.customVerb("getInstructions", command, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
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
  /**
   * used to create a bulk billPayement
   * @param {array} transList list of transactions
   * @param {function} presentationSuccessCallback , invoke the call back with success response.
   * @param {function} presentationErrorCallback , invoke the call back with error response.
  */
  TransactionManager.prototype.createBulkBillPayPayement = function (params, presentationSuccessCallback, presentationErrorCallback) {
    var self = this;
    var transactionModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition('Transactions');
    transactionModel.customVerb('createBulkBillPay', params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
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
  /**
    * used to fetch the recipient activity.
    * @param {object} param - contains the information of payPersonID.
    * @param {function} presentationSuccessCallback , invoke the call back with success response.
    * @param {function} presentationErrorCallback , invoke the call back with error response.
   */
  TransactionManager.prototype.getRecipientActivity = function (param, presentationSuccessCallback, presentationErrorCallback) {
    var TransactionModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Payment_P2PList");
    TransactionModel.customVerb('getTransfers', param, onCompletionCallback);
    function onCompletionCallback(status, data, error) {
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
  /**
   * Makes Trail Deposit
   * @param {object} param - Account number
   * @param {function} presentationSuccessCallback , invoke the call back with success response.
   * @param {function} presentationErrorCallback , invoke the call back with error response.
  */
  TransactionManager.prototype.makeTrailDeposit = function (param, presentationSuccessCallback, presentationErrorCallback) {
    var TransactionsModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Transactions");
    TransactionsModel.customVerb("makeTrialDeposit", param, completionCallback);
    function completionCallback(status, data, error) {
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
  /**
   * Verifies Trail Deposit
   * @param {object} param - Account Number
   * @param {function} presentationSuccessCallback , invoke the call back with success response.
   * @param {function} presentationErrorCallback , invoke the call back with error response.
  */
  TransactionManager.prototype.verifyTrailDeposit = function (param, presentationSuccessCallback, presentationErrorCallback) {
    var TransactionsModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Transactions");
    TransactionsModel.customVerb("makeTrialDeposit", param, completionCallback);
    function completionCallback(status, data, error) {
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
  /**
   * Method to fetch scheduled transactions for the logged in user
   * @param {function} presentationSuccessCallback Method that gets called in case of service success
   * @param {function} presentationErrorCallback Method that gets called in case of service failure
   */
  TransactionManager.prototype.fetchScheduledTransaction = function (presentationSuccessCallback, presentationErrorCallback) {
    function completionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
    var TransactionModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("TransactionsList");
    TransactionModel.customVerb("getUserScheduledTransactions", {}, completionCallback);
  }
  /**
   * Method to fetch transactions by type
   * @param {JSON} inputParams input params like accountId, transactionType, offset, limit, sortBy and order
   * @param {function} presentationSuccessCallback Method that gets called in case of service success
   * @param {function} presentationErrorCallback Method that gets called in case of service failure
   */
  TransactionManager.prototype.fetchAccountTransactionByType = function (inputParams, presentationSuccessCallback, presentationErrorCallback) {
    function completionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true && obj["data"] && obj["data"]["Transactions"]) {
        presentationSuccessCallback(obj["data"]["Transactions"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
    var TransactionModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("TransactionsList");
    TransactionModel.customVerb("getRecent", inputParams, completionCallback);
  }
  /**
     * Method to fetch transactions based on seach criteria
     * @param {Object} params MDA expression containing searchDescription, searchMinAmount, searchMaxAmount, accountNumber, searchType etc
     * @param {function} presentationSuccessCallback Method that gets invoked in case of service success
     * @param {function} presentationErrorCallback Method that gets invoked in case of service failure
     */
  TransactionManager.prototype.fetchTransactionsByCriteria = function (params, presentationSuccessCallback, presentationErrorCallback) {
    var postedExternalTran = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Transactions");
    postedExternalTran.getByCriteria(params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      if (status === kony.mvc.constants.STATUS_FAILURE) {
        presentationErrorCallback(error);
      }
      else {
        presentationSuccessCallback(data);
      }
    }
  };
  /**
      * Method to fetch disputed transactions based on seach criteria
      * @param {Object} params MDA expression containing searchDescription, searchMinAmount, searchMaxAmount, accountNumber, searchType etc
      * @param {function} presentationSuccessCallback Method that gets invoked in case of service success
      * @param {function} presentationErrorCallback Method that gets invoked in case of service failure
      */
  TransactionManager.prototype.getDisputedTransactions = function (params, presentationSuccessCallback, presentationErrorCallback) {
    var getDisputedTran = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("TransactionsList");
    getDisputedTran.customVerb("getDisputeRequest", params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
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
  /**
  * Method to create disputed transactions based on seach criteria
  * @param {Object} params MDA expression containing searchDescription, searchMinAmount, searchMaxAmount, accountNumber, searchType etc
  * @param {function} presentationSuccessCallback Method that gets invoked in case of service success
  * @param {function} presentationErrorCallback Method that gets invoked in case of service failure
  */
  TransactionManager.prototype.createDisputedTransaction = function (params, presentationSuccessCallback, presentationErrorCallback) {
    var createDisputedTran = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("TransactionsList");
    createDisputedTran.customVerb("createDisputeRequest", params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
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
  /**
*  Method to fetch stop check request
* @param {Object} params MDA expression containing searchDescription, searchMinAmount, searchMaxAmount, accountNumber, searchType etc
* @param {function} presentationSuccessCallback Method that gets invoked in case of service success
* @param {function} presentationErrorCallback Method that gets invoked in case of service failure
*/
  TransactionManager.prototype.getStopCheckPaymentRequests = function (params, presentationSuccessCallback, presentationErrorCallback) {
    var createDisputedTran = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Transactions");
    createDisputedTran.customVerb("getStopCheckPaymentRequestTransactions", params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      if (status === kony.mvc.constants.STATUS_FAILURE) {
        presentationErrorCallback(error);
      }
      else {
        presentationSuccessCallback(data);
      }
    }
  };
  /**
  * get Posted Transactions using a service call base on the search options.
  * @param {object} searchOptions , object consisting various key value pairs as filters.
  * @param {function} presentationSuccessCallback , invoke the call back with success response.
  * @param {function} presentationErrorCallback , invoke the call back with error response.
  */
  TransactionManager.prototype.fetchUserRecentTransactionsFastTransfer = function (command, presentationSuccessCallback, presentationErrorCallback) {
    var self = this;
    var TransactionsModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("OneTimeTransfer");
    TransactionsModel.customVerb("getTransfers", command, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
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
  /**
    * get scheduled Transactions for a User using a service call.
    * @param {object} command ,  key value pairs required to get scheduled transactions.
    * @param {function} presentationSuccessCallback , invoke the call back with success response.
    * @param {function} presentationErrorCallback , invoke the call back with error response.
    */
  TransactionManager.prototype.fetchScheduledUserTransactionsFastTransfer = function (command, presentationSuccessCallback, presentationErrorCallback) {
    var self = this;
    var TransactionsModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("StandingInstruction");
    TransactionsModel.customVerb("getInstructions", command, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
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
  /**
    * returns URL to get  Transactions report for the transaction
    * @param {object} criteria ,  key value pairs required to get  transactions report, here transactionId
    */
  TransactionManager.prototype.fetchTransactionReport = function (transObj) {
    var mfURL = KNYMobileFabric.mainRef.config.services_meta.DocumentManagement.url;
    var serviceURL = mfURL + "/objects/DownloadTransactionReport";
    var paramURL = "?fileId=" + transObj.fileId;
    return serviceURL + paramURL;
  };
  
  /**
   * used to generateTransactionReport
   * @param {params} transaction object
   * @param {function} presentationSuccessCallback , invoke the call back with success response.
   * @param {function} presentationErrorCallback , invoke the call back with error response.
  */
  TransactionManager.prototype.generateTransactionReport = function (params, presentationSuccessCallback, presentationErrorCallback) {
    var self = this;
    var downloadTransactionModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("CustomerAdvice_BillPay");
    downloadTransactionModel.customVerb('generate', params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
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
  
  

  /**
   * used to create a bulk billPayement
   * @param {array} transList list of transactions
   * @param {function} presentationSuccessCallback , invoke the call back with success response.
   * @param {function} presentationErrorCallback , invoke the call back with error response.
  */
  TransactionManager.prototype.createBulkBillPayTransaction = function (params, presentationSuccessCallback, presentationErrorCallback) {
    var self = this;
    var transactionModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Payment");
    transactionModel.customVerb('createPayment_bulk', params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
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

  /**
   * used to create a bulk beneficiary Payement
   * @param {array} transList list of transactions
   * @param {function} presentationSuccessCallback , invoke the call back with success response.
   * @param {function} presentationErrorCallback , invoke the call back with error response.
  */
  TransactionManager.prototype.createBulkTransfer = function (params, presentationSuccessCallback, presentationErrorCallback) {
    var self = this;
    var transactionModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition('Payment_Multi');
    transactionModel.customVerb('createMultiTransfers', params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
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
  /**
   * used to create a billPayement
   * @param {array} transList list of transactions
   * @param {function} presentationSuccessCallback , invoke the call back with success response.
   * @param {function} presentationErrorCallback , invoke the call back with error response.
   */
  TransactionManager.prototype.createBillPayTransaction = function (params, presentationSuccessCallback, presentationErrorCallback) {
    var self = this;
    var transactionModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Payment");
    var transObj = this.convertDateFormat(params);
    transactionModel.customVerb('createPayment', transObj, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
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

  /**
   * create a Transaction.
   * @param {object} tranObj , object to create a transaction.
   * @param {function} presentationSuccessCallback , invoke the call back with success response.
   * @param {function} presentationErrorCallback , invoke the call back with error response.
   */
  TransactionManager.prototype.createTransferToOwnAccounts = function (tranObj, presentationSuccessCallback, presentationErrorCallback) {
    var transacObj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Transaction");
    var transObj = this.convertDateFormat(tranObj);
    transacObj.customVerb("TransferToOwnAccounts", transObj, saveCompletionCallback);
    function saveCompletionCallback(status, data, error) {
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
  /**
   * create a Transaction.
   * @param {object} tranObj , object to create a transaction.
   * @param {function} presentationSuccessCallback , invoke the call back with success response.
   * @param {function} presentationErrorCallback , invoke the call back with error response.
   */
  TransactionManager.prototype.createIntraBankAccFundTransfer = function (tranObj, presentationSuccessCallback, presentationErrorCallback) {
    var transacObj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Transaction");
    var transObj = this.convertDateFormat(tranObj);
    transacObj.customVerb("IntraBankAccFundTransfer", transObj, saveCompletionCallback);
    function saveCompletionCallback(status, data, error) {
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

  /*
   * create a Transaction.
   * @param {object} tranObj , object to create a transaction.
   * @param {function} presentationSuccessCallback , invoke the call back with success response.
   * @param {function} presentationErrorCallback , invoke the call back with error response.
   */
  TransactionManager.prototype.createOneTimeTransfer = function (tranObj, presentationSuccessCallback, presentationErrorCallback) {
    var transacObj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("OneTimeTransfer");
    var transObj = this.convertDateFormat(tranObj);
    if(transObj.validate && transObj.validate === "true"){
      transObj.validate = true;
    } else {
      transObj.validate = false;
    }
    transacObj.customVerb("Create", transObj, saveCompletionCallback);
    function saveCompletionCallback(status, data, error) {
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
  /**
   * create a Transaction.
   * @param {object} tranObj , object to create a transaction.
   * @param {function} presentationSuccessCallback , invoke the call back with success response.
   * @param {function} presentationErrorCallback , invoke the call back with error response.
   */
  TransactionManager.prototype.createInterBankAccFundTransfer = function (tranObj, presentationSuccessCallback, presentationErrorCallback) {
    var transacObj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Transaction");
    var transObj = this.convertDateFormat(tranObj);
    transacObj.customVerb("InterBankAccFundTransfer", transObj, saveCompletionCallback);
    function saveCompletionCallback(status, data, error) {
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
  /**
   * create a Transaction.
   * @param {object} tranObj , object to create a transaction.
   * @param {function} presentationSuccessCallback , invoke the call back with success response.
   * @param {function} presentationErrorCallback , invoke the call back with error response.
   */
  TransactionManager.prototype.createInternationalAccFundTransfer = function (tranObj, presentationSuccessCallback, presentationErrorCallback) {
    var transacObj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Transaction");
    var transObj = this.convertDateFormat(tranObj);
    transacObj.customVerb("InternationalAccFundTransfer", transObj, saveCompletionCallback);
    function saveCompletionCallback(status, data, error) {
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

  /**
   * Update a BillPay Transaction.
   * @param {object} tranObj , object to create a transaction.
   * @param {function} presentationSuccessCallback , invoke the call back with success response.
   * @param {function} presentationErrorCallback , invoke the call back with error response.
   */
  TransactionManager.prototype.updateBillPayTransaction = function (tranObj, presentationSuccessCallback, presentationErrorCallback) {
    var transacObj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Payment");
    var transObj = this.convertDateFormat(tranObj);
    transacObj.customVerb("updatePayment", transObj, saveCompletionCallback);
    function saveCompletionCallback(status, data, error) {
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
  /**
 * Edit a Transaction to own account.
 * @param {object} tranObj , object to create a transaction.
 * @param {function} presentationSuccessCallback , invoke the call back with success response.
 * @param {function} presentationErrorCallback , invoke the call back with error response.
 */
  TransactionManager.prototype.editTransferToOwnAccounts = function (tranObj, presentationSuccessCallback, presentationErrorCallback) {
    var transacObj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Transaction");
    var transObj = this.convertDateFormat(tranObj);
    transacObj.customVerb("TransferToOwnAccountsEdit", transObj, saveCompletionCallback);
    function saveCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        //RIRB-12963 Changes to show acknowledgement screen in US flow for edit transfer.
        kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
          "moduleName": "TransferFastUIModule",
          "appName": "TransfersMA"
      }).presentationController.setReferenceID(obj["data"].referenceId);
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
  /**
   * Edit an intra bank Transaction.
   * @param {object} tranObj , object to create a transaction.
   * @param {function} presentationSuccessCallback , invoke the call back with success response.
   * @param {function} presentationErrorCallback , invoke the call back with error response.
   */
  TransactionManager.prototype.editIntraBankAccFundTransfer = function (tranObj, presentationSuccessCallback, presentationErrorCallback) {
    var transacObj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Transaction");
    var transObj = this.convertDateFormat(tranObj);
    transacObj.customVerb("IntraBankAccFundTransferEdit", transObj, saveCompletionCallback);
    function saveCompletionCallback(status, data, error) {
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
  /**
   * edit an inter bank Transaction.
   * @param {object} tranObj , object to create a transaction.
   * @param {function} presentationSuccessCallback , invoke the call back with success response.
   * @param {function} presentationErrorCallback , invoke the call back with error response.
   */
  TransactionManager.prototype.editInterBankAccFundTransfer = function (tranObj, presentationSuccessCallback, presentationErrorCallback) {
    var transacObj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Transaction");
    var transObj = this.convertDateFormat(tranObj);
    transacObj.customVerb("InterBankFundTransferEdit", transObj, saveCompletionCallback);
    function saveCompletionCallback(status, data, error) {
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
  /**
   * edit an international Transaction.
   * @param {object} tranObj , object to create a transaction.
   * @param {function} presentationSuccessCallback , invoke the call back with success response.
   * @param {function} presentationErrorCallback , invoke the call back with error response.
   */
  TransactionManager.prototype.editInternationalAccFundTransfer = function (tranObj, presentationSuccessCallback, presentationErrorCallback) {
    var transacObj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Transaction");
    var transObj = this.convertDateFormat(tranObj);
    transacObj.customVerb("InternationalFundTransferEdit", transObj, saveCompletionCallback);
    function saveCompletionCallback(status, data, error) {
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

  /**
 * Cancel an Occurrence of Transaction to own account.
 * @param {object} tranObj , object to create a transaction.
 * @param {function} presentationSuccessCallback , invoke the call back with success response.
 * @param {function} presentationErrorCallback , invoke the call back with error response.
 */
  TransactionManager.prototype.cancelOccurrenceTransferToOwnAccounts = function (tranObj, presentationSuccessCallback, presentationErrorCallback) {
    var transacObj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Transaction");
    var transObj = this.convertDateFormat(tranObj);
    transacObj.customVerb("TransferToOwnAccountsCancelOccurrence", transObj, saveCompletionCallback);
    function saveCompletionCallback(status, data, error) {
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
  /**
   * Cancel an Occurrence of inter bank Transaction.
   * @param {object} tranObj , object to create a transaction.
   * @param {function} presentationSuccessCallback , invoke the call back with success response.
   * @param {function} presentationErrorCallback , invoke the call back with error response.
   */
  TransactionManager.prototype.cancelOccurrenceInterBankAccFundTransfer = function (tranObj, presentationSuccessCallback, presentationErrorCallback) {
    var transacObj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Transaction");
    var transObj = this.convertDateFormat(tranObj);
    transacObj.customVerb("InterBankFundTransferCancelOccurrence", transObj, saveCompletionCallback);
    function saveCompletionCallback(status, data, error) {
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
  /**
   * Cancel an Occurrence of intra bank Transaction.
   * @param {object} tranObj , object to create a transaction.
   * @param {function} presentationSuccessCallback , invoke the call back with success response.
   * @param {function} presentationErrorCallback , invoke the call back with error response.
   */
  TransactionManager.prototype.cancelOccurrenceIntraBankAccFundTransfer = function (tranObj, presentationSuccessCallback, presentationErrorCallback) {
    var transacObj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Transaction");
    var transObj = this.convertDateFormat(tranObj);
    transacObj.customVerb("IntraBankAccFundTransferCancelOccurrence", transObj, saveCompletionCallback);
    function saveCompletionCallback(status, data, error) {
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
  /**
   * Cancel an Occurrence of international Transaction.
   * @param {object} tranObj , object to create a transaction.
   * @param {function} presentationSuccessCallback , invoke the call back with success response.
   * @param {function} presentationErrorCallback , invoke the call back with error response.
   */
  TransactionManager.prototype.cancelOccurrenceInternationalAccFundTransfer = function (tranObj, presentationSuccessCallback, presentationErrorCallback) {
    var transacObj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Transaction");
    var transObj = this.convertDateFormat(tranObj);
    transacObj.customVerb("InternationalFundTransferCancelOccurrence", transObj, saveCompletionCallback);
    function saveCompletionCallback(status, data, error) {
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
  /**
   * Delete a BillPay Transaction.
   * @param {object} tranObj , object to delete a transaction.
   * @param {function} presentationSuccessCallback , invoke the call back with success response.
   * @param {function} presentationErrorCallback , invoke the call back with error response.
   */
  TransactionManager.prototype.deleteBillPayTransaction = function (tranObj, presentationSuccessCallback, presentationErrorCallback) {
    var transacObj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Payment");
    transacObj.customVerb("updatePayment_delete", tranObj, saveCompletionCallback);
    function saveCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      } else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
  /**
   * Delete current BillPay Ocurrence transaction.
   * @param {object} tranObj , key value pair of transaction Id which is to be deleted.
   * @param {function} presentationSuccessCallback , invoke the call back with success response.
   * @param {function} presentationErrorCallback , invoke the call back with error response.
   */
  TransactionManager.prototype.deleteBillPayOcurrenceTransaction = function (tranObj, presentationSuccessCallback, presentationErrorCallback) {
    var transacObj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Transaction");
    transacObj.customVerb("BillPayTransferCancelOccurrence", tranObj, saveCompletionCallback);
    function saveCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      } else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };

  /**
 * Cancel a Transaction to own account.
 * @param {object} tranObj , object to create a transaction.
 * @param {function} presentationSuccessCallback , invoke the call back with success response.
 * @param {function} presentationErrorCallback , invoke the call back with error response.
 */
  TransactionManager.prototype.cancelTransferToOwnAccounts = function (tranObj, presentationSuccessCallback, presentationErrorCallback) {
    var transacObj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Transaction");
    var transObj = this.convertDateFormat(tranObj);
    transacObj.customVerb("TransferToOwnAccountsDelete", transObj, saveCompletionCallback);
    function saveCompletionCallback(status, data, error) {
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
  /**
 * Create a Transaction RDC.
 * @param {object} tranObj , object to create a transaction.
 * @param {function} presentationSuccessCallback , invoke the call back with success response.
 * @param {function} presentationErrorCallback , invoke the call back with error response.
 */
  TransactionManager.prototype.createRDC = function (tranObj, presentationSuccessCallback, presentationErrorCallback) {
    var transacObj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Transaction");
    var transObj = this.convertDateFormat(tranObj);
    transacObj.customVerb("createRDC", transObj, saveCompletionCallback);
    function saveCompletionCallback(status, data, error) {
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
  /**
   * Cancel an intra bank Transaction.
   * @param {object} tranObj , object to create a transaction.
   * @param {function} presentationSuccessCallback , invoke the call back with success response.
   * @param {function} presentationErrorCallback , invoke the call back with error response.
   */
  TransactionManager.prototype.cancelInterBankAccFundTransfer = function (tranObj, presentationSuccessCallback, presentationErrorCallback) {
    var transacObj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Transaction");
    var transObj = this.convertDateFormat(tranObj);
    transacObj.customVerb("InterBankFundTransferDelete", transObj, saveCompletionCallback);
    function saveCompletionCallback(status, data, error) {
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
  /**
   * Cancel an inter bank Transaction.
   * @param {object} tranObj , object to create a transaction.
   * @param {function} presentationSuccessCallback , invoke the call back with success response.
   * @param {function} presentationErrorCallback , invoke the call back with error response.
   */
  TransactionManager.prototype.cancelIntraBankAccFundTransfer = function (tranObj, presentationSuccessCallback, presentationErrorCallback) {
    var transacObj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Transaction");
    var transObj = this.convertDateFormat(tranObj);
    transacObj.customVerb("IntraBankAccFundTransferDelete", transObj, saveCompletionCallback);
    function saveCompletionCallback(status, data, error) {
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
  /**
   * Cancel an international Transaction.
   * @param {object} tranObj , object to create a transaction.
   * @param {function} presentationSuccessCallback , invoke the call back with success response.
   * @param {function} presentationErrorCallback , invoke the call back with error response.
   */
  TransactionManager.prototype.cancelInternationalAccFundTransfer = function (tranObj, presentationSuccessCallback, presentationErrorCallback) {
    var transacObj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Transaction");
    var transObj = this.convertDateFormat(tranObj);
    transacObj.customVerb("InternationalFundTransferDelete", transObj, saveCompletionCallback);
    function saveCompletionCallback(status, data, error) {
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
  /**
  * get bulk wire files for the user.
  * @param {object} transObj - .
  * @param {function} presentationSuccessCallback , invoke the call back with success response.
  * @param {function} presentationErrorCallback , invoke the call back with error response.
  */
  TransactionManager.prototype.fetchBulkWireFilesForUser = function(transObj,presentationSuccessCallback, presentationErrorCallback) {
    var  postTran  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("BulkWire");
    postTran.customVerb("getBulkWiresForUser", transObj,getAllCompletionCallback);
    function  getAllCompletionCallback(status,  data,  error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj["status"] === true){
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };

  /**
  * get bulk wire file line items.
  * @param {object} transObj - .
  * @param {function} presentationSuccessCallback , invoke the call back with success response.
  * @param {function} presentationErrorCallback , invoke the call back with error response.
  */
  TransactionManager.prototype.fetchBulkWireFileLineItems = function(transObj,presentationSuccessCallback, presentationErrorCallback) {
    var  postTran  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("BulkWireFile");
    postTran.customVerb("getBulkwireFileLineItems", transObj,getAllCompletionCallback);
    function  getAllCompletionCallback(status,  data,  error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj["status"] === true){
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    } 
  };

  /**
  * create a bulk wire transaction.
  * @param {object} tranObj , object to create a bulk wire transaction.
  * @param {function} presentationSuccessCallback , invoke the call back with success response.
  * @param {function} presentationErrorCallback , invoke the call back with error response.
  */
  TransactionManager.prototype.createBulkWireTransaction = function(tranObj,presentationSuccessCallback,presentationErrorCallback){
    var  transacObj  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Transaction");
    transacObj.customVerb("CreateBulkWireTransfer",tranObj,saveCompletionCallback);
    function  saveCompletionCallback(status,  data,  error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj["status"] === true){
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };

  /**
  * get bulk wire file transactions detail.
  * @param {object} transObj , contains file id for which file transactions has to be fetched.
  * @param {function} presentationSuccessCallback , invoke the call back with success response.
  * @param {function} presentationErrorCallback , invoke the call back with error response.
  */
  TransactionManager.prototype.fetchBulkWireFilesTransactions = function(transObj,presentationSuccessCallback, presentationErrorCallback) {
    var  postTran  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("BulkWireTransaction");
    postTran.customVerb("GetBulkWireFileTransactionDetail", transObj,getAllCompletionCallback);
    function  getAllCompletionCallback(status,  data,  error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj["status"] === true){
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };

  /**
  * get bulk wire file transactions detail.
  * @param {object} transObj , contains file id for which file transactions has to be fetched.
  * @param {function} presentationSuccessCallback , invoke the call back with success response.
  * @param {function} presentationErrorCallback , invoke the call back with error response.
  */
  TransactionManager.prototype.fetchBWTemplateTransactionsByExecutionId = function(transObj,presentationSuccessCallback, presentationErrorCallback) {
    var  postTran  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("BulkWireTransaction");
    postTran.customVerb("getTransactionsByBulkWireTemplateExecutionId", transObj,getAllCompletionCallback);
    function  getAllCompletionCallback(status,  data,  error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj["status"] === true){
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };

  /**
  * get transactions by bulk wire execution id
  * @param {object} transObj , contains file id for which file transactions has to be fetched.
  * @param {function} presentationSuccessCallback , invoke the call back with success response.
  * @param {function} presentationErrorCallback , invoke the call back with error response.
  */
  TransactionManager.prototype.getFileTransactionActivityByExecutionID = function(transObj,presentationSuccessCallback, presentationErrorCallback) {
    var  postTran  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("BulkWireTransaction");
    postTran.customVerb("getTransactionsByBulkWireFileExecutionId", transObj,getAllCompletionCallback);
    function  getAllCompletionCallback(status,  data,  error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj["status"] === true){
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };

  /**
  * downloads the file associated with bulk wire file id
  * @param {object} criteria ,  key value pairs required to get  transactions report, here transactionId
  */
  TransactionManager.prototype.downloadBulkWireFile = function(fileId){
    var mfURL = KNYMobileFabric.mainRef.config.services_meta.BulkWireObjects.url;
    var serviceURL = mfURL + "/operations/BulkWireFile/downloadFile?bulkWireFileID=" + fileId;
    return serviceURL;
  };

  /**
  * downloads sample bulk wire file
  * @param {object} criteria ,  key value pairs required to get  transactions report, here transactionId
  */
  TransactionManager.prototype.downloadSampleBulkWireFile = function(fileId) {
    var mfURL = KNYMobileFabric.mainRef.config.services_meta.BulkWireObjects.url;
    var serviceURL = mfURL + "/operations/BulkWireFile/downloadSampleFile?bulkWireFileID=" + fileId;
    return serviceURL;
  };


  /**
  * upload bulk wire file
  * @param {object} record , 
  * @param {function} presentationSuccessCallback , invoke the call back with success response.
  * @param {function} presentationErrorCallback , invoke the call back with error response.
  */

  TransactionManager.prototype.UploadBWFile = function (params,presentationSuccessCallback,presentationErrorCallback) {
    var userRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("BulkWireFile");
    userRepo.customVerb('uploadBWFile', params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error, presentationSuccessCallback, presentationErrorCallback);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj.data);
      }
      else{
        presentationErrorCallback(obj.errmsg);
      }
    }
  };

  /**
  * UploadBWTemplateFile - Method to upload bulk wire file for a template
  * @param {object} record , 
  * @param {function} presentationSuccessCallback , invoke the call back with success response.
  * @param {function} presentationErrorCallback , invoke the call back with error response.
  */
  TransactionManager.prototype.UploadBWTemplateFile = function (params,presentationSuccessCallback,presentationErrorCallback) {
    var userRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("BulkWireFile");
    userRepo.customVerb('uploadBWTemplateFile', params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error, presentationSuccessCallback, presentationErrorCallback);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj.data);
      }
      else{
        presentationErrorCallback(obj.errmsg);
      }
    }
  };

  /**
  * downloadUploadedSampleFile - Method to download sample file
  * @param {object} record , 
  * @param {function} presentationSuccessCallback , invoke the call back with success response.
  * @param {function} presentationErrorCallback , invoke the call back with error response.
  */
  TransactionManager.prototype.downloadUploadedSampleBulkWireFile = function (params,presentationSuccessCallback,presentationErrorCallback) {
    var userRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("BulkWireFile");
    userRepo.customVerb('initiateDownloadBulkWireSampleFile', params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error, presentationSuccessCallback, presentationErrorCallback);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj.data);
      }
      else{
        presentationErrorCallback(obj.errmsg);
      }
    }
  };

  /**
  * create a bulk wire template.
  * @param {object} requestParams , object to create a bulk wire template.
  * @param {function} presentationSuccessCallback , invoke the call back with success response.
  * @param {function} presentationErrorCallback , invoke the call back with error response.
  */
  TransactionManager.prototype.createBWTemplate = function(requestParams,presentationSuccessCallback,presentationErrorCallback){
    var  transacObj  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("BulkWire");
    transacObj.customVerb("CreateBulkWireTemplate", requestParams, saveCompletionCallback);

    function  saveCompletionCallback(status,  data,  error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj["status"] === true){
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };   

  /**
  * to delete a bulk wire template.
  * @param {object} requestParams , object to create a bulk wire template.
  * @param {function} presentationSuccessCallback , invoke the call back with success response.
  * @param {function} presentationErrorCallback , invoke the call back with error response.
  */
  TransactionManager.prototype.deleteBWTemplate = function(requestParams,presentationSuccessCallback,presentationErrorCallback){
    var  transacObj  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("BulkWire");
    transacObj.customVerb("DeleteBulkWireTemplate", requestParams, saveCompletionCallback);

    function  saveCompletionCallback(status,  data,  error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj["status"] === true){
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };   

  /**
  * to remove a bulk wire template Line item.
  * @param {object} requestParams , object to create a bulk wire template.
  * @param {function} presentationSuccessCallback , invoke the call back with success response.
  * @param {function} presentationErrorCallback , invoke the call back with error response.
  */
  TransactionManager.prototype.removeTemplateRecipient = function(requestParams,presentationSuccessCallback,presentationErrorCallback){
    var  transacObj  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("BulkWire");
    transacObj.customVerb("DeleteBulkWireTemplateRecipient", requestParams, saveCompletionCallback);

    function  saveCompletionCallback(status,  data,  error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj["status"] === true){
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };   

  /**
  * to fetch recipients of a bulk wire template.
  * @param {object} requestParams , object to create a bulk wire template.
  * @param {function} presentationSuccessCallback , invoke the call back with success response.
  * @param {function} presentationErrorCallback , invoke the call back with error response.
  */
  TransactionManager.prototype.fetchBWRecipientsByTemplateID = function(requestParams,presentationSuccessCallback,presentationErrorCallback){
    var  transacObj  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("BulkWire");
    transacObj.customVerb("getBulkWireTemplateLineItems", requestParams, saveCompletionCallback);

    function  saveCompletionCallback(status,  data,  error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj["status"] === true){
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };   

  /**
  * get bulk wire template line items.
  * @param {object} transObj - .
  * @param {function} presentationSuccessCallback , invoke the call back with success response.
  * @param {function} presentationErrorCallback , invoke the call back with error response.
  */
  TransactionManager.prototype.fetchBulkWireTemplateLineItems = function(transObj,presentationSuccessCallback, presentationErrorCallback) {
    var  postTran  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("BulkWire");
    postTran.customVerb("getBulkWireTemplateLineItems", transObj,getAllCompletionCallback);
    function  getAllCompletionCallback(status,  data,  error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj["status"] === true){
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    } 
  };

  /**
  * createBulkWireTransferOperation - create a bulk wire template transaction.
  * @param {object} tranObj , object to create a bulk wire transaction.
  * @param {function} presentationSuccessCallback , invoke the call back with success response.
  * @param {function} presentationErrorCallback , invoke the call back with error response.
  */
  TransactionManager.prototype.createBulkWireTransferOperation = function(tranObj,presentationSuccessCallback,presentationErrorCallback){
    var  transacObj  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Transaction");
    transacObj.customVerb("CreateBulkWireTransfer",tranObj,saveCompletionCallback);
    function  saveCompletionCallback(status,  data,  error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj["status"] === true){
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };


  /**
  * get bulk wire template transactions detail.
  * @param {object} transObj , contains file id for which file transactions has to be fetched.
  * @param {function} presentationSuccessCallback , invoke the call back with success response.
  * @param {function} presentationErrorCallback , invoke the call back with error response.
  */
  TransactionManager.prototype.fetchBulkWireTemplateTransactions = function(transObj,presentationSuccessCallback, presentationErrorCallback) {
    var  postTran  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("BulkWireTransaction");
    postTran.customVerb("getBulkWireTemplateTransactionDetail", transObj,getAllCompletionCallback);
    function getAllCompletionCallback(status,  data,  error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj["status"] === true){
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };

  TransactionManager.prototype.generateTransactionPDF = function(record, presentationSuccessCallback, presentationErrorCallback) {
    var downloadTransactionObject = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("DownloadTransactions");
    downloadTransactionObject.customVerb("GenerateTransactionReport", record, completionCallback);
    function completionCallback(status,  data,  error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj["status"] === true){
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };

  TransactionManager.prototype.getEncodedPDFString = function (params, presentationSuccessCallback, presentationErrorCallback) {
    var instance = kony.sdk.getDefaultInstance();
    var dataObject = new kony.sdk.dto.DataObject(params.transactionType);
    dataObject.addField("transactionId", params.transactionId);
    instance.getObjectService("TransactionUploadBinary").getBinaryContent({
      "dataObject": dataObject,
      "binaryAttrName": "pdf"
    },
                                                                          function (response) {
      kony.print("binary content is : " + JSON.stringify(response));
      presentationSuccessCallback(response);
    },
                                                                          function (error) {
      kony.print("failed to get binary data : " + JSON.stringify(error));
      presentationErrorCallback(error);
    });
  };
  TransactionManager.prototype.fetchChequeIDAndLeavesCount = function (criteria, presentationSuccessCallback, presentationErrorCallback) {
    var postTran = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ChequeBook");
    postTran.customVerb("getChequeType", criteria, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
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
  TransactionManager.prototype.createChequeBookRequests = function (criteria, presentationSuccessCallback, presentationErrorCallback) {
    var postTran = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ChequeBook");
    postTran.customVerb("createRequest", criteria, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
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
  TransactionManager.prototype.createStopChequePayment = function (criteria, presentationSuccessCallback, presentationErrorCallback) {
    var postTran = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("StopPayment");
    postTran.customVerb("createRequest", criteria, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
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
  TransactionManager.prototype.getAccountTransactions = function (criteria, presentationSuccessCallback, presentationErrorCallback) {
    var postTran = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ChequeBook");
    postTran.customVerb("getRequest", criteria, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
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
  TransactionManager.prototype.getStopCheckPaymentRequestTransactions = function (criteria, presentationSuccessCallback, presentationErrorCallback) {
    var postTran = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("StopPayment");
    postTran.customVerb("getRequest", criteria, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
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
  TransactionManager.prototype.getChequeSupplements = function (criteria, presentationSuccessCallback, presentationErrorCallback) {
    var postTran = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ChequeDetails");
    postTran.customVerb("getDetails", criteria, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
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
  TransactionManager.prototype.getBankNameByRoutingNumber = function (RoutingNo, presentationSuccessCallback, presentationErrorCallback) {
    var getPendingUserTransactions = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Transactions");
    getPendingUserTransactions.customVerb("GetBankNameByRoutingNumber", RoutingNo, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
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

  /**
    * delete disputed transaction using a service call.
    * @param {object} record ,  key value pair of transaction Id and transactionType which is to be deleted.
    * @param {function} presentationSuccessCallback , invoke the call back with success response.
    * @param {function} presentationErrorCallback , invoke the call back with error response.
    */
  TransactionManager.prototype.deleteDisputeTransaction = function (record, presentationSuccessCallback, presentationErrorCallback) {
    var transactionsRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Transactions");
    transactionsRepo.customVerb("cancelDisputeTransaction", record, deleteCompletionCallback);
    function deleteCompletionCallback(status, data, error) {
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
  /**
   * Method to create transaction to a Credit Card Account.
   * @param {object} transactionData - object containing transaction data
   * @param {function} presentationSuccessCallback - invoke the call back with success response
   * @param {function} presentationErrorCallback - invoke the call back with error response
   */
  TransactionManager.prototype.createCreditCardTransaction = function (transactionData, presentationSuccessCallback, presentationErrorCallback) {
    var transactionModel = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("CreditCard");
    var transactionObj = this.convertDateFormat(transactionData);
    transactionModel.customVerb("createCreditCardTransfer", transactionObj, getCompletionCallback);
    function getCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      } else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };

  TransactionManager.prototype.downloadUplodedBulkWireFile = function(transObj, presentationSuccessCallback, presentationErrorCallback) {
    var  postTran  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("BulkWireFile");
    postTran.customVerb("downloadFileBulkWire", transObj, getAllCompletionCallback);
    function  getAllCompletionCallback(status,  data,  error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      } else {
        presentationErrorCallback(obj["errmsg"]);
      }
    } 
  };
  /**
   * Method to revoke Stop Cheque Payement request.
   * @param {object} transactionData - object containing transaction data
   * @param {function} presentationSuccessCallback - invoke the call back with success response
   * @param {function} presentationErrorCallback - invoke the call back with error response
   */
  TransactionManager.prototype.revokeStopChequePayment = function (params, presentationSuccess, presentationError) {
    var transactionsRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("RevokeStopPayment");
    transactionsRepo.customVerb("createRequest", params, revokeCompletion);
    function revokeCompletion(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccess(obj["data"]);
      }
      else {
        presentationError(obj["errmsg"]);
      }
    }
  };

TransactionManager.prototype.getBeneficiaryName = function (criteria, presentationSuccessCallback, presentationErrorCallback) {
var getBeneficiaryNameRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ExternalAccounts");
getBeneficiaryNameRepo.customVerb("getBeneficiaryName", criteria, getAllCompletionCallback);
function getAllCompletionCallback(status, data, error) {
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

  /**
   * Method to create a QR Payment
   * @param {object} transactionData - object containing transaction data
   * @param {function} presentationSuccessCallback - invoke the call back with success response
   * @param {function} presentationErrorCallback - invoke the call back with error response
   */
  TransactionManager.prototype.createQRPayment = function (params, presentationSuccess, presentationError) {
    var qrRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("QRPay");
    qrRepo.customVerb("CreateQRPayment", params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccess(obj["data"]);
      }
      else {
        presentationError(obj["errmsg"]);
      }
    }
  };
  
  TransactionManager.prototype.fetchLoanTransaction = function (inputParams, presentationSuccessCallback, presentationErrorCallback) {
    function completionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true && obj["data"] && obj["data"]["Transactions"]) {
        presentationSuccessCallback(obj["data"]["Transactions"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
    var TransactionModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("TransactionsList");
    TransactionModel.customVerb("getRecent", inputParams, completionCallback);
  }
  return TransactionManager;
});