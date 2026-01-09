/**
  *@module RecipientsManager
  */
define([], function() {
  /**
   * RecipientsManager class is used to fetch and create the information regarding external beneficiaries and payees.
   *@alias module:RecipientsManager
   *@class
   */
  function RecipientsManager(){
    /**@member {object} scope_RecipientsManager holds the scope of parent class i.e RecipientsManager*/
    scope_RecipientsManager = this;
    /**@member {Array} payeesList holds the list of P2P payees information retrieved from the backend*/
    this.payeesList=[];
    /**@member {Array} recentPayeesList holds the list of recent payees information retrieved from the backend*/
    this.recentPayeesList=[];
    /**@member {Array} konyBankRecipients holds the list of kony bank recipients information retrieved from the backend*/
    this.konyBankRecipients=[];
    /**@member {Array} recentPayeesList holds the list of other bank recipients information retrieved from the backend*/
    this.otherBankRecipients=[];
    /**@member {Array} listOfPayees holds the list of BillPay payees retrieved information from the backend*/
    this.listOfPayees = [];
    /**@member {Array} listOfBillerCompanies holds the list of biller companies information retrieved from the backend*/
    this.listOfBillerCompanies=[];
    /**@member {Array} internationalRecipients holds the list of international beneficiaries information retrieved from the backend*/
    this.internationalRecipients=[];
    /**@member {Array} countriesList holds the list of countries information retrieved from the backend*/
    this.countriesList=[];
    /**@member {string} flowType used for navigation purpose where common forms are used across multiple flows*/
    this.flowType="";
    /**@member {object} benificiaryData used to hold the model definition of ExternalAccounts Model*/
    this.benificiaryData={};
    /**@member {object} contractDetails used to hold the list of contract details for which user has access*/
    this.contractDetails={};
    /**@member {object} billPayPayeeData used to hold the model definition of Payee Model*/
    this.billPayPayeeData= {};
    /**@member {object} p2PPayeeDetails used to hold the model definition of PayPerson Model*/
    this.p2PPayeeDetails= {};
  }
  inheritsFrom(RecipientsManager, kony.mvc.Business.Delegator);
  RecipientsManager.prototype.initializeBusinessController = function(){};
  /**
   * Sets the value for each column in Payee Model
   * @param {String} key , column name of the Payee Model
   * @param {String} value , the data corresponding to key for each Payee
   */
  RecipientsManager.prototype.setAttributePayee=function(key,value)
  {
    this.billPayPayeeData[key]=value;
  };

    /* -------------------------   [Trixon] Start   -------------------------- */

    // [Trixon] Utilized this Object Service call for Within BOA Transfer Account Validation
    RecipientsManager.prototype.getPayeeName = function (param, successCallback, errorCallback) {
        var payeeModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Payee_Name");
        payeeModel.customVerb("getPayeeName", param, getAllCompletionCallback);
        function getAllCompletionCallback(status, data, error) {
            var serviceResponseHandler = applicationManager.getServiceResponseHandler();
            var responseObject = serviceResponseHandler.manageResponse(status, data, error, successCallback, successCallback);
            if (responseObject["status"] === true) {
            successCallback(responseObject["data"]);
            } else {
            errorCallback(responseObject["errmsg"]);
            }
        }
    };

    // [Trixon] Custom Enquiry service integration for Apollo Transfers {EthSwitch, RTGS, Telebirr, ATM, MPesa, MPesa Trust, Awach}
    RecipientsManager.prototype.customApolloEnquiry = function(serviceName, operationName, payload, successCallBack, errorCallBack){
        var integrationObj = KNYMobileFabric.getIntegrationService(serviceName);
        integrationObj.invokeOperation(operationName, {}, payload, successCallBack, errorCallBack);
    };

    /* -------------------------   [Trixon] End   -------------------------- */



  /**
  * This is a common method which is used to make service calls to any Custom Verb
  * @param {string} customVerbName - Name of the customverb to which service call to be made
  * @param {object} params - JSON payload which will be sent as body while making the service call.
  * @param {function} successCall -  invoke the call back with success response.
  * @param {function} failureCallback -  invoke the call back with error response.
  */
  RecipientsManager.prototype.makeServiceCall = function(customVerbName,params,successCall,failureCall){
    try{
      var recepientsRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository('Biller');
      recepientsRepo.customVerb(customVerbName,params,onCompletionCallback);
      function onCompletionCallback(status,data,error){
        var serviceResponseHandler = applicationManager.getServiceResponseHandler();
        var obj = serviceResponseHandler.manageResponse(status,  data,  error);
        if(obj["status"] === true){
          successCall(obj["data"]);
        }
        else{
          failureCall(error);
        }
      }
    }catch(err){
    }
  };
  /**
  * Get Payees Suggestions based on given string
  * @param {string} query - Contains the search key word for which payee suggestions are made
  * @param {function} successCallback -  invoke the call back with success response.
  * @param {function} failureCallback-  invoke the call back with error response.
  */
  RecipientsManager.prototype.fetchPayeeSuggestions = function(query,successCallback,failureCallback){
    var loggerManager = applicationManager.getLoggerManager();
    try{
      loggerManager.log("#### start RecipientManager : fetchPayeeSuggestions ####");
      if(query && query !== null && query !== undefined){
        loggerManager.log("#### query is "+query+"####");
        var customVerbName = "searchBillerByName";
        var params = {};
        params.searchString = query;
        params.limit = 5;
        this.makeServiceCall(customVerbName, params, successCall, failureCall);
        function successCall(data){
          loggerManager.log("#### in success "+JSON.stringify(data)+" ####");
          successCallback(data);
        }
        function failureCall(error){
          loggerManager.log("#### in error "+JSON.stringify(error)+" ####");
          failureCallback(error);
        }
      }
    }catch(err){
      loggerManager.log("#### in catch "+JSON.stringify(err)+" ####");
    }
  };
  /**
   * Fetches the list of internal bank beneficiaries
   * @param {function} presentationManageBenificiarySuccess will be called when call is successful
   * @param {function} presentationManageBenificiaryError will be called when call is not successful
   */
  RecipientsManager.prototype.fetchAllInternalBenificiaries = function(presentationManageBenificiarySuccess,presentationManageBenificiaryError)
  {
    function fetchAllInternalBenificiariesCompletionCallback(status,  data,  error){
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj.status === true){
        scope_RecipientsManager.konyBankRecipients=obj.data;
        presentationManageBenificiarySuccess(obj.data);
      }
      else {
        presentationManageBenificiaryError(obj.errmsg);
      }
    }
    var recepientsRepo  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Recipients");
    recepientsRepo.customVerb('getIntraBankPayees',{},fetchAllInternalBenificiariesCompletionCallback);
  };
  /**
   * Get the Internal Benificiaries stored in the class RecipientsManager.
   * @returns {Array} list of all internal bank recipients
   */
  RecipientsManager.prototype.getAllInternalBenificiaries=function(){
    if(scope_RecipientsManager.konyBankRecipients.length === 0){
      return "";
    }
    else{
      return scope_RecipientsManager.konyBankRecipients;
    }
  };
  /**
    *Get the External Benificiaries stored in the class RecipientsManager.
   * @returns {Array} list of all external bank recipients
   */
  RecipientsManager.prototype.getAllExternalBenificiaries=function(){
    if(scope_RecipientsManager.otherBankRecipients.length === 0){
      return "";
    }
    else{
      return scope_RecipientsManager.otherBankRecipients;
    }
  };
  /**
  * search the input string in the contacts.
  * @param {String} inputString- has value which user wants to search on contacts
  * @param {Array} contactsArray -contains list of all contact details of user phone
  * @returns {Array} - Array of records with matched string.
  */
  RecipientsManager.prototype.searchInputStringForContactsList=function(inputString,contactsArray){
    var matchedData=[];
    if(contactsArray!==null && contactsArray!==undefined){
      for(var i=0;i<contactsArray.length;i++){
        if(contactsArray[i].firstname!=="" && contactsArray[i].firstname!==null && contactsArray[i].firstname!==undefined ||
           contactsArray[i].lastname !== "" && contactsArray[i].lastname !== null && contactsArray[i].lastname !== undefined){
          if(contactsArray[i].firstname && contactsArray[i].firstname.toLowerCase().indexOf(inputString)>=0){
            matchedData.push(contactsArray[i]);
          }
          else if(contactsArray[i].lastname && contactsArray[i].lastname.toLowerCase().indexOf(inputString)>=0 ){
            matchedData.push(contactsArray[i]);
          }
        }
      }
    }
    return matchedData;
  };
  /**
   * Fetches the list of external bank beneficiaries
   * @param {function} presentationManageBenificiarySuccess will be called when call is successful
   * @param {function} presentationManageBenificiaryError will be called when call is not successful
   */
  RecipientsManager.prototype.fetchAllExternalBenificiaries = function(presentationManageBenificiarySuccess,presentationManageBenificiaryError)
  {
    var recepientsRepo  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Recipients");
    recepientsRepo.customVerb('getInterBankPayees',{},fetchAllExternalBenificiariesCompletionCallback);
    function fetchAllExternalBenificiariesCompletionCallback(status,  data,  error){
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj.status === true){
        scope_RecipientsManager.otherBankRecipients=obj.data;
        presentationManageBenificiarySuccess(obj.data);
      }
      else {
        presentationManageBenificiaryError(obj.errmsg);
      }
    }
  };
  /**
   * Fetches the list of external bank beneficiaries
   * @param {function} presentationManageBenificiarySuccess will be called when call is successful
   * @param {function} presentationManageBenificiaryError will be called when call is not successful
   */
  RecipientsManager.prototype.fetchAllIntraAndInterBankBenificiaries = function(presentationManageBenificiarySuccess,presentationManageBenificiaryError)
  {
    var recepientsRepo  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Payees");
    recepientsRepo.customVerb('getIntraInterBankPayee',{},fetchAllExternalBenificiariesCompletionCallback);
    function fetchAllExternalBenificiariesCompletionCallback(status,  data,  error){
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj.status === true){
        scope_RecipientsManager.otherBankRecipients=obj.data;
        presentationManageBenificiarySuccess(obj.data);
      }
      else {
        presentationManageBenificiaryError(obj.errmsg);
      }
    }
  };
  /**
   * Fetches the list of external bank beneficiaries
   * @param {function} presentationManageBenificiarySuccess will be called when call is successful
   * @param {function} presentationManageBenificiaryError will be called when call is not successful
   */
  RecipientsManager.prototype.fetchAllExternalBenificiariesOld = function(presentationManageBenificiarySuccess,presentationManageBenificiaryError)
  {
    var recepientsRepo  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ExternalAccounts");
    recepientsRepo.customVerb('getDomesticAccount',{},fetchAllExternalBenificiariesCompletionCallback);
    function fetchAllExternalBenificiariesCompletionCallback(status,  data,  error){
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj.status === true){
        scope_RecipientsManager.otherBankRecipients=obj.data;
        presentationManageBenificiarySuccess(obj.data);
      }
      else {
        presentationManageBenificiaryError(obj.errmsg);
      }
    }
  };
  /**
   * used to edit benificiary details.
   * @param {object} record - contains the benificairy information which has to be edited.
   * @param {function} presentationManageBenificiarySuccess will be called when call is successful
   * @param {function} presentationManageBenificiaryError will be called when call is not successful
   */
  RecipientsManager.prototype.editABenificiary = function(record,presentationManageBenificiarySuccess,presentationManageBenificiaryError)
  {
    if(applicationManager.getConfigurationManager().getDeploymentGeography() === "EUROPE")
	{
		var recepientsRepo  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Payees");
		recepientsRepo.customVerb('editPayee',record,editBenificiaryCompletionCallback);
	}
	else{
		var recepientsRepo  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Recipients");
		recepientsRepo.customVerb('editExternalPayee',record,editBenificiaryCompletionCallback);
	}
    function editBenificiaryCompletionCallback(status,  data,  error){
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj.status === true){
        presentationManageBenificiarySuccess(obj.data);
      }
      else {
        presentationManageBenificiaryError(obj.errmsg);
      }
    }
  };
  /**
   * used to edit benificiary details.
   * @param {object} record - contains the benificairy information which has to be edited.
   * @param {function} presentationManageBenificiarySuccess will be called when call is successful
   * @param {function} presentationManageBenificiaryError will be called when call is not successful
   */
  RecipientsManager.prototype.editABenificiaryOld = function(record,presentationManageBenificiarySuccess,presentationManageBenificiaryError)
  {
    var recepientsRepo  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ExternalAccounts");
    recepientsRepo.customVerb('editExternalAccount',record,editBenificiaryCompletionCallback);
    function editBenificiaryCompletionCallback(status,  data,  error){
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj.status === true){
        presentationManageBenificiarySuccess(obj.data);
      }
      else {
        presentationManageBenificiaryError(obj.errmsg);
      }
    }
  };
  /**
   * used to delete benificiary details.
   * @param {object} record contains the benificairy information which has to be deleted.
   * @param {function} presentationManageBenificiarySuccess will be called when call is successful
   * @param {function} presentationManageBenificiaryError will be called when call is not successful
   */
  RecipientsManager.prototype.deleteABenificiary = function(record,presentationManageBenificiarySuccess,presentationManageBenificiaryError)
  {
    if(applicationManager.getConfigurationManager().getDeploymentGeography() === "EUROPE"){
		var recepientsRepo  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Payees");
		recepientsRepo.customVerb('deletePayee',record,deleteBenificiaryCompletionCallback);
	}
	else{
		var recepientsRepo  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Recipients");
    recepientsRepo.customVerb('deleteExternalPayee',record,deleteBenificiaryCompletionCallback);
	}
    function deleteBenificiaryCompletionCallback(status,  data,  error){
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj.status === true){
        presentationManageBenificiarySuccess(obj.data);
      }
      else {
        presentationManageBenificiaryError(obj.errmsg);
      }
    }
  };
  /**
   * used to delete benificiary details.
   * @param {object} record contains the benificairy information which has to be deleted.
   * @param {function} presentationManageBenificiarySuccess will be called when call is successful
   * @param {function} presentationManageBenificiaryError will be called when call is not successful
   */
  RecipientsManager.prototype.deleteABenificiaryOld = function(record,presentationManageBenificiarySuccess,presentationManageBenificiaryError)
  {
    var recepientsRepo  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ExternalAccounts");
    recepientsRepo.customVerb('deleteExternalAccount',record,deleteBenificiaryCompletionCallback);
    function deleteBenificiaryCompletionCallback(status,  data,  error){
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj.status === true){
        presentationManageBenificiarySuccess(obj.data);
      }
      else {
        presentationManageBenificiaryError(obj.errmsg);
      }
    }
  };
  /**
   * used to create benificiary details.
   * @param {object} record contains the benificairy information which has to be created.
   * @param {function} presentationManageBenificiarySuccess will be called when call is successful
   * @param {function} presentationManageBenificiaryError will be called when call is not successful
   */
  RecipientsManager.prototype.createABenificiary = function(record,presentationManageBenificiarySuccess,presentationManageBenificiaryError)
  {
    if(applicationManager.getConfigurationManager().getDeploymentGeography() === "EUROPE"){
		var recepientsRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Payees");
		recepientsRepo.customVerb('createPayee', record, saveCompletionCallback);
	}
	else{
		var recepientsRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Recipients");
		recepientsRepo.customVerb('createExternalPayee', record, saveCompletionCallback);
	}
    function saveCompletionCallback(status,  data,  error){
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj.status === true){
        obj.data.selectedAccountData = record;
        presentationManageBenificiarySuccess(obj.data);
      }
      else {
        presentationManageBenificiaryError(obj.errmsg);
      }
    }
  };
  /**
   * used to create benificiary details.
   * @param {object} record contains the benificairy information which has to be created.
   * @param {function} presentationManageBenificiarySuccess will be called when call is successful
   * @param {function} presentationManageBenificiaryError will be called when call is not successful
   */
  RecipientsManager.prototype.createExternalAccount = function(record,presentationManageBenificiarySuccess,presentationManageBenificiaryError)
  {
    var recepientsRepo  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ExternalAccounts");
    recepientsRepo.save (record,saveCompletionCallback,"online");
      function saveCompletionCallback(status,  data,  error){
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj.status === true){
        obj.data.selectedAccountData = record;
        presentationManageBenificiarySuccess(obj.data);
      }
      else {
        presentationManageBenificiaryError(obj.errmsg);
      }
    }
  };

  /**
  * used to create P2PRecipient with all the provided details.
  * @param {object} record -  data which has to be created as suggested by user.
  * @param {function} presentationManageBenificiarySuccess - invoke the call back with success response.
  * @param {function} presentationManageBenificiaryError - invoke the call back with error response.
  */
  RecipientsManager.prototype.createP2PRecipient = function(record,presentationManageBenificiarySuccess,presentationManageBenificiaryError)
  {
    var recepientsP2P  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Payee_P2P");
    recepientsP2P.customVerb("createP2PPayee", record, saveCompletionCallback,"online");
    function saveCompletionCallback(status,  data,  error){
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj.status === true){
        presentationManageBenificiarySuccess(obj.data);
      }
      else {
        presentationManageBenificiaryError(obj.errmsg);
      }
    }
  };
  /**
  * used to get all P2PRecipients details.
  * @param {object} criteria - search params on which we need to getPayeeLIST .
  * @param {function} presentationManageBenificiarySuccess - invoke the call back with success response.
  * @param {function} presentationManageBenificiaryError - invoke the call back with error response.
  */
  RecipientsManager.prototype.getP2PRecipientList = function(criteria,presentationManageBenificiarySuccess,presentationManageBenificiaryError)
  {
    var self =this;
    var recepientsP2P  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Payee_P2P");
    recepientsP2P.customVerb("getP2PPayees", criteria, getCompletionCallback);
    function getCompletionCallback(status,  data,  error){
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj.status === true){
        self.setAllPayees(obj.data);
        presentationManageBenificiarySuccess(obj.data);
      }
      else {
        presentationManageBenificiaryError(obj.errmsg);
      }
    }
  };
  /**
  * used to edit details of a P2PRecipient .
  * @param {object} params - params which has to be edited .
  * @param {function} presentationManageBenificiarySuccess - invoke the call back with success response.
  * @param {function} presentationManageBenificiaryError - invoke the call back with error response.
  */
  RecipientsManager.prototype.editP2PRecipient = function(params,presentationManageBenificiarySuccess,presentationManageBenificiaryError)
  {
    var recepientsP2P  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Payee_P2P");
    recepientsP2P.customVerb('updateP2PPayee',params,editP2PRecipientCompletionCallback);
    function editP2PRecipientCompletionCallback(status,  data,  error){
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj.status === true){
        presentationManageBenificiarySuccess(obj.data);
      }
      else {
        presentationManageBenificiaryError(obj.errmsg);
      }
    }
  };
  /**
  * used to delete P2PRecipient details from list.
  * @param {object} params - PayPersonId which has to be deleted .
  * @param {function} presentationManageBenificiarySuccess - invoke the call back with success response.
  * @param {function} presentationManageBenificiaryError - invoke the call back with error response.
  */
  RecipientsManager.prototype.deleteP2PRecipient = function(params,presentationManageBenificiarySuccess,presentationManageBenificiaryError)
  {
    var recepientsP2P  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Payee_P2P");
    recepientsP2P.customVerb('deleteP2PPayee',params,deleteP2PRecipientCompletionCallback);
    function deleteP2PRecipientCompletionCallback(status,  data,  error){
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj.status === true){
        presentationManageBenificiarySuccess(obj.data);
      }
      else {
        presentationManageBenificiaryError(obj.errmsg);
      }
    }
  };
  /**
  * used to fetch recent P2PRecipient details.
  * @param {function} presentationManageBenificiarySuccess - invoke the call back with success response.
  * @param {function} presentationManageBenificiaryError - invoke the call back with error response.
  */
  RecipientsManager.prototype.fetchRecentPayees = function(presentationManageBenificiarySuccess, presentationManageBenificiaryError){
    var getRecentPayees = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("PayPerson");
    getRecentPayees.customVerb("getRecentPayPerson",{},getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if(obj.status === true){
        presentationManageBenificiarySuccess(obj.data);
      }
      else {
        presentationManageBenificiaryError(obj.errmsg);
      }
    }
  };
  /**
  * Update global payeesList variable with response .
  * @param {object} payeesList - Response which we get for list of p2pRecipients
  */
  RecipientsManager.prototype.setAllPayees = function(payeesList){
    this.payeesList=payeesList;
  };
  /**
  * used toget global payeesList variable which is updated from fetch success
  * @returns {object} - returns all P2PRecipient list which is saved by user are returned
  */
  RecipientsManager.prototype.getAllPayees = function(){
    return this.payeesList;
  };
  /**
  * used to update global recentPayeesList variable with recentPayeeList.
  * @param {object} params - List of recent P2pRecipients
   */
  RecipientsManager.prototype.setRecentPayees = function(recentPayeesList){
    this.recentPayeesList=recentPayeesList;
  };
  /**
  * used to get global recentPayeesList variable
  * @returns {object} -returns all recent P2PRecipient list
  */
  RecipientsManager.prototype.getRecentBillPayees = function(){
    return this.recentPayeesList;
  };
  /**
   * used to fetch all frequent internal benificiary details.
   * @param {function} presentationAllFrequentInternalBenificiariesSuccess will be called when call is successful
   * @param {function} presentationAllFrequentInternalBenificiariesError will be called when call is not successful
   */
  RecipientsManager.prototype.fetchAllFrequentInternalBenificiaries=function(presentationAllFrequentInternalBenificiariesSuccess,presentationAllFrequentInternalBenificiariesError)
  {
    var getFreqSBA = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ExternalAccounts");
    getFreqSBA.customVerb("getFrequentSameBankAccount",{},getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if(obj.status === true){
        presentationAllFrequentInternalBenificiariesSuccess(obj.data);
      }
      else {
        presentationAllFrequentInternalBenificiariesError(obj.errmsg);
      }
    }
  };
  /**
   * used to fetch all frequent external benificiary details.
   * @param {function} presentationAllFrequentExternalBenificiariesSuccess will be called when call is successful
   * @param {function} presentationAllFrequentExternalBenificiariesError will be called when call is not successful
   */
  RecipientsManager.prototype.fetchAllFrequentExternalBenificiaries=function(presentationAllFrequentExternalBenificiariesSuccess,presentationAllFrequentExternalBenificiariesError)
  {
    var getFreqSBA = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ExternalAccounts");
    getFreqSBA.customVerb("getFrequentOtherBankAccounts",{},getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if(obj.status === true){
        presentationAllFrequentExternalBenificiariesSuccess(obj.data);
      }
      else {
        presentationAllFrequentExternalBenificiariesError(obj.errmsg);
      }
    }
  };
  /**
   * used to fetch all frequent international benificiary details.
   * @param {function} presentationAllFrequentInternationalBenificiariesSuccess will be called when call is successful
   * @param {function} presentationAllFrequentInternationalBenificiariesError will be called when call is not successful
   */
  RecipientsManager.prototype.fetchAllFrequentInternationalBenificiaries = function(presentationAllFrequentInternationalBenificiariesSuccess,presentationAllFrequentInternationalBenificiariesError)
  {
    var recepientsRepo  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ExternalAccounts");
    recepientsRepo.customVerb('getFrequentInternationalExternalAccounts',{},getAllCompletionCallback);
    function getAllCompletionCallback(status,  data,  error){
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj.status === true){
        presentationAllFrequentInternationalBenificiariesSuccess(obj.data);
      }
      else {
        presentationAllFrequentInternationalBenificiariesError(obj.errmsg);
      }
    }
  };
  /**
  * fetch the list of Billpay payees which are saved by user
  * @param {object} criteria-Fetches details based upon criteria provided by user
  * @param {function} presentationSuccessCallback - invoke the call back with success response.
  * @param {function} presentationErrorCallback - invoke the call back with error response.
  */
  RecipientsManager.prototype.fetchPayeesList = function(criteria,presentationSuccessCallback,presentationErrorCallback)
  {
    var self =this;
    var payeesRepo  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Payee_BillPay");
	payeesRepo.customVerb('getBillPayPayees',criteria,getAllCompletionCallback);
    //payeesRepo.getByCriteria(criteria,getAllCompletionCallback);
    function  getAllCompletionCallback(status,  data,  error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj.status === true){
		 if(!kony.sdk.isNullOrUndefined(obj.data.Payee)){
		self.listOfPayees = obj.data.Payee;
		}else{
		self.listOfPayees = obj.data;
		}
        //self.listOfPayees = obj.data;
        presentationSuccessCallback(self.listOfPayees);
      }
      else {
        presentationErrorCallback(obj.errmsg);
      }
    }
  };
  /**
  * get the list of payees.
  * * @returns {object} listOfPayees - It returns all Billpay Payees list
   */
  RecipientsManager.prototype.getAllBillPayPayees = function()
  {
    return this.listOfPayees;
  };
  /**
  * Creates a BillPay payee with data provided by user
  * @param {object} record -  data with which payee has to be created.
  * @param {function} presentationSuccessCallback - invoke the call back with success response.
  * @param {function} presentationErrorCallback - invoke the call back with error response.
  */
  RecipientsManager.prototype.createPayee = function(record,presentationSuccessCallback,presentationErrorCallback)
  {
    var payeeRepo  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Payee_BillPay");
	payeeRepo.customVerb('createBillPayPayee',record,saveCompletionCallback);
    //payeeRepo.save (record,saveCompletionCallback,"online");
    function  saveCompletionCallback(status,  data,  error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj.status === true){
        presentationSuccessCallback(obj.data);
      }
      else {
        presentationErrorCallback(obj.errmsg);
      }
    }
  };
  
    /**
  * Links a one time payee with transaction.
  * @param {object} record -  payee Id and transaction id to be linked together.
  * @param {function} presentationSuccessCallback - invoke the call back with success response.
  * @param {function} presentationErrorCallback - invoke the call back with error response.
  */
  RecipientsManager.prototype.linkPayeetoTransaction = function(record,presentationSuccessCallback,presentationErrorCallback)
  {
    var payeeRepo  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Payee");
    payeeRepo.customVerb('LinkPayeetoTransaction', record, saveCompletionCallback);
    function  saveCompletionCallback(status,  data,  error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj.status === true){
        presentationSuccessCallback(obj.data);
      }
      else {
        presentationErrorCallback(obj.errmsg);
      }
    }
  };

  /**
  * Fetches recent Billpay payees
  * @param {function} presentationSuccessCallback - invoke the call back with success response.
  * @param {function} presentationErrorCallback - invoke the call back with error response.
  */
  RecipientsManager.prototype.fetchRecentBillPayees = function(presentationSuccessCallback,presentationErrorCallback)
  {
    var self =this;
    var payeeRepo  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Payee_BillPayRecent");
    payeeRepo.customVerb('getRecentPayee',{},getAllCompletionCallback);
    function  getAllCompletionCallback(status,  data,  error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error,presentationSuccessCallback,presentationErrorCallback);
      if(obj.status === true){
        self.recentPayeesList = obj.data;
        presentationSuccessCallback(obj.data);
      }
      else {
        presentationErrorCallback(obj.errmsg);
      }
    }
  };
  /**
  * Updates the Billpay payee details.
  * @param {object} record -  data which is to be updated.
  * @param {function} presentationSuccessCallback - invoke the call back with success response.
  * @param {function} presentationErrorCallback - invoke the call back with error response.
  */
  RecipientsManager.prototype.updatePayeeDetails = function(record,presentationSuccessCallback,presentationErrorCallback)
  {
    var payeesRepo  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Payee_BillPay");
	payeesRepo.customVerb('updateBillPayPayee',record,partialUpdateCompletionCallback);
    //payeesRepo.partialUpdate(record,partialUpdateCompletionCallback,"online");
    function  partialUpdateCompletionCallback(status,  data,  error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj.status === true){
        presentationSuccessCallback(obj.data);
      }
      else {
        presentationErrorCallback(obj.errmsg);
      }
    }
  };
  /**
  * used to delete Billpay payee.
  * @param {object} record - It has data which is to be deleted
  * @param {function} presentationSuccessCallback - invoke the call back with success response.
  * @param {function} presentationErrorCallback - invoke the call back with error response.
  */
  RecipientsManager.prototype.deletePayeeById = function(payeeId,presentationSuccessCallback,presentationErrorCallback)
  {
    var payeesRepo  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Payee_BillPay");
	var payee = {"payeeId":payeeId};
	payeesRepo.customVerb('deleteBillPayPayee',payee,partialUpdateCompletionCallback);
    //payeesRepo.removeById(payeesRepo,payeeId,partialUpdateCompletionCallback,"online");
    function  partialUpdateCompletionCallback(status,  data,  error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj.status === true){
        presentationSuccessCallback(obj.data);
      }
      else {
        presentationErrorCallback(obj.errmsg);
      }
    }
  };
  
  
  /**
  * used to delete wire transfer payee.
  * @param {object} record - It has data which is to be deleted
  * @param {function} presentationSuccessCallback - invoke the call back with success response.
  * @param {function} presentationErrorCallback - invoke the call back with error response.
  */
   RecipientsManager.prototype.deleteWireTransferPayeeById = function(payeeId,presentationSuccessCallback,presentationErrorCallback)
  {
    var payeesRepo  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Recipients");
   // payeesRepo.removeById(payeesRepo,payeeId,partialUpdateCompletionCallback,"online");
     var payee = {"payeeId":payeeId};
	payeesRepo.customVerb('deleteWireTransfersPayee',payee,partialUpdateCompletionCallback);
    function  partialUpdateCompletionCallback(status,  data,  error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj.status === true){
        presentationSuccessCallback(obj.data);
      }
      else {
        presentationErrorCallback(obj.errmsg);
      }
    }
  };
  
  
  /**
  * fetch the list of biller companies.
  * @param {function} presentationSuccessCallback - invoke the call back with success response.
  * @param {function} presentationErrorCallback - invoke the call back with error response.
  */
  RecipientsManager.prototype.fetchBillerCompaniesList = function(presentationSuccessCallback,presentationErrorCallback)
  {
    var self =this;
    var payeesRepo  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("BillerCompany");
    payeesRepo.getAll(getAllCompletionCallback,"online");
    function  getAllCompletionCallback(status,  data,  error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj.status === true){
        self.listOfBillerCompanies = obj.data;
        presentationSuccessCallback(obj.data);
      }
      else {
        presentationErrorCallback(obj.errmsg);
      }
    }
  };
  /**
  * fetch the payee details by id
  * @param {String} payeeId - Payee ID of a particular payee.
  * @returns {object} - returns json of a particular payee from list of all payees.
  */
  RecipientsManager.prototype.getPayeeDetailsById = function(payeeId)
  {
    for(var i=0;i<this.listOfPayees.length;i++){
      if(this.listOfPayees[i].payeeId == payeeId){
        return this.listOfPayees[i];
      }
    }
    return "";
  };
  /**
  * set billPayPayeeData variable with payee details
  * @param {object} payeeId - BillPay Payee Details which are to be stored.
  */
  RecipientsManager.prototype.setBillPayPayeeData = function(payeeData)
  {
    this.billPayPayeeData=payeeData;
  };
  /**
  * get the payee details
  * @returns {object} It returns Payee details which is stores by setBillPayPayeeData
  */
  RecipientsManager.prototype.getBillPayPayeeData = function()
  {
    return this.billPayPayeeData;
  };
  /**
   * Clears the stored values for billPayPayeeData member of RecipientsManager class
   */
  RecipientsManager.prototype.clearBillPayPayeeData = function()
  {
    var modelDefinition=kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Recipients");
    this.billPayPayeeData=new modelDefinition();
  };
  /**
   * used to set the value for flowType member
   * @param {string} type value which is to be set for flowType member
   */
  RecipientsManager.prototype.setFlowType = function(type)
  {
    this.flowType=type;
  };
  /**
   * used to get the value of flowType member
   * @returns {string} flowType value which is set based on the flow where common forms are included.
   */
  RecipientsManager.prototype.getFlowType = function()
  {
    return this.flowType;
  };
  /**
  * set payee address to billPayPayeeData variable
  * @param {object} payeeAddress - BillPay Payee Address.
  */
  RecipientsManager.prototype.setBillPayPayeeAddressDetails = function(payeeData)
  {
    this.billPayPayeeData.addressLine1 = (payeeData.addressLine1 && payeeData.addressLine1 !== "" && payeeData.addressLine1 !== null)?payeeData.addressLine1:
    (payeeData.street && payeeData.street !== "" && payeeData.street !== null)?payeeData.street:"";
    this.billPayPayeeData.addressLine2 = (payeeData.addressLine2 && payeeData.addressLine2 !== "" && payeeData.addressLine2!== null)?payeeData.addressLine2:"";
    this.billPayPayeeData.cityName = (payeeData.cityName && payeeData.cityName !== "" && payeeData.cityName!== null)?payeeData.cityName:"";
    this.billPayPayeeData.state = (payeeData.state && payeeData.state!== "" &&payeeData.state!== null)?payeeData.state:"";
    this.billPayPayeeData.zipCode = (payeeData.zipCode && payeeData.zipCode !== "" && payeeData.zipCode!== null)?payeeData.zipCode:"";
  };
  /**
  * get payee address from stored payee details
  * @return {object} payeeAddress - returns BillPay Payee Address.
  */
  RecipientsManager.prototype.getBillPayPayeeAddressDetails = function()
  {
    var address={};
    address.addressLine1 = (this.billPayPayeeData.addressLine1 && this.billPayPayeeData.addressLine1 !== "" && this.billPayPayeeData.addressLine1 !== null)?this.billPayPayeeData.addressLine1:
    (this.billPayPayeeData.street && this.billPayPayeeData.street !== "" && this.billPayPayeeData.street !== null)?this.billPayPayeeData.street:"";
    address.addressLine2 = (this.billPayPayeeData.addressLine2 && this.billPayPayeeData.addressLine2 !== "" && this.billPayPayeeData.addressLine2!== null)?this.billPayPayeeData.addressLine2:"";
    address.cityName = (this.billPayPayeeData.cityName && this.billPayPayeeData.cityName !== "" && this.billPayPayeeData.cityName!== null)?this.billPayPayeeData.cityName:"";
    address.state = (this.billPayPayeeData.state && this.billPayPayeeData.state!== "" &&this.billPayPayeeData.state!== null)?this.billPayPayeeData.state:"";
    address.zipCode = (this.billPayPayeeData.zipCode && this.billPayPayeeData.zipCode !== "" && this.billPayPayeeData.zipCode!== null)?this.billPayPayeeData.zipCode:"";
    return address;
  };
  /**
   * Clears the stored value for flowType member of RecipientsManager class
   */
  RecipientsManager.prototype.clearFlowType = function()
  {
    this.flowType="";
  };
  /**
  * get P2P payee Details.
  * @return {}  returns P2P Payee Details which are stored in p2PPayeeDetails variable.
*/
  RecipientsManager.prototype.getP2PPayeeDetails = function()
  {
    return this.p2PPayeeDetails;
  };
  /**
  * set the P2P payee details to p2PPayeeDetails variable
  * @param {object} payeeData - P2P Payee Details which are to be stored.
  */
  RecipientsManager.prototype.setP2PPayeeData = function(payeeData)
  {
    this.p2PPayeeDetails=payeeData;
  };
  /**
   * Clears the stored value for p2PPayeeDetails member of RecipientsManager class
   */
  RecipientsManager.prototype.clearP2PPayeeData = function()
  {
    var modelDefinition=kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Recipients");
    this.p2PPayeeDetails=new modelDefinition();
  };
  /**
  * set the P2P payee details
  * @param {String} key , column name of the Payee Model
  * @param {String} value , the data corresponding to key for each Payee
  */
  RecipientsManager.prototype.setP2PPayeeAttribute = function(key,value)
  {
    this.p2PPayeeDetails[key]=value;
  };
  /**
   * used to fetch all  international benificiary details.
   * @param {function} presentationManageBenificiarySuccess will be called when call is successful
   * @param {function} presentationManageBenificiaryError will be called when call is not successful
   */
  RecipientsManager.prototype.fetchInternationalRecepients = function(presentationManageBenificiarySuccess,presentationManageBenificiaryError)
  {
    var record={};
    var recepientsRepo  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Recipients");
    recepientsRepo.customVerb('getInternationalPayees',record,fetchAllInternationalBenificiariesCompletionCallback);
    function fetchAllInternationalBenificiariesCompletionCallback(status,  data,  error){
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj.status === true){
        scope_RecipientsManager.internationalRecipients=obj.data;
        presentationManageBenificiarySuccess(obj.data);
      }
      else {
        presentationManageBenificiaryError(obj.errmsg);
      }
    }
  };
  /**
   * used to fetch list of countries
   * @param {function} presentationManageBenificiarySuccess will be called when call is successful
   * @param {function} presentationManageBenificiaryError will be called when call is not successful
   */
  RecipientsManager.prototype.fetchCountriesList = function(presentationManageBenificiarySuccess,presentationManageBenificiaryError)
  {
    var recepientsRepo  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Country");
    //recepientsRepo.getAll(fetchCountriesListCompletionCallback,"online");
    recepientsRepo.customVerb('getAllCountries',{},fetchCountriesListCompletionCallback);
    function fetchCountriesListCompletionCallback(status,  data,  error){
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj.status === true){
        scope_RecipientsManager.countriesList=obj.data;
        presentationManageBenificiarySuccess(obj.data);
      }
      else {
        presentationManageBenificiaryError(obj.errmsg);
      }
    }
  };
  /**
   * update a wire transfer recipient
   * @param {Object} recipientData Recipient Data in key value pairs
   * @param {function} presentationSuccessCallback will be called when call is successful
   * @param {function} presentationErrorCallback will be called when call is not successful
   */
  RecipientsManager.prototype.updateWireTransferRecipient = function(recipientData, presentationSuccessCallback, presentationErrorCallback)
  {
    function completionCallBack(status,  data,  error){
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj.status === true){
        presentationSuccessCallback(obj.data);
      }
      else {
        presentationErrorCallback(obj.errmsg);
      }
    }
    var payeeModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Recipients");
    payeeModel.customVerb("editWireTransfersPayee", recipientData, completionCallBack);
  };
  /**
  * Gets the International Benificiaries stored in the internationalRecipients member of RecipientsManager class.
  * @returns {Array} - list of international benificiaries.
  */
  RecipientsManager.prototype.getAllInternationalBenificiaries=function(){
    if(scope_RecipientsManager.internationalRecipients.length === 0){
      return "";
    }
    else{
      return scope_RecipientsManager.internationalRecipients;
    }
  };
  /**
  * set the P2P payee details
   * @param {String} key , column name of the Payee Model
   * @param {String} value , the data corresponding to key for each Payee
  */
  RecipientsManager.prototype.setP2PPayeeAttribute = function(key,value)
  {
    this.p2PPayeeDetails[key]=value;
  };
  /**
   * used to update the benificiaryData member of RecipientsManager class
   * @param {object} data the primary key object collected while creating a benificiary
   */
  RecipientsManager.prototype.initializeBeneficiaryDataWithAccountNum = function(data)
  {
    var modelDefinition=kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Recipients");
    this.benificiaryData=new modelDefinition(data);
  };
  /**
   * Sets the value for each column in ExternalAccounts Model
   * @param {String} key , column name of the ExternalAccounts Model
   * @param {String} value , the data corresponding to key for each Benificiary
   */
  RecipientsManager.prototype.setBeneficiaryAttribute = function(key,value)
  {
    this.benificiaryData[key]=value;
  };
  /**
   * used to update the benificiaryData member of RecipientsManager class
   * @param {object} selectedAccountDetails the data collected on behalf of new beneficiary or existing beneficiary
   */
  RecipientsManager.prototype.setBeneficiaryObject = function(selectedAccountDetails)
  {
    this.benificiaryData=selectedAccountDetails;
  };
  /**
   * used to get the benificiary data
   * @returns {object} benificiaryData the data collected on behalf of new beneficiary or existing beneficiary
   */
  RecipientsManager.prototype.getBenificiaryData = function()
  {
    return this.benificiaryData;
  };
  /**
   * Clears the stored value for benificiaryData member of RecipientsManager class
   */
  RecipientsManager.prototype.clearBeneficiaryObject = function()
  {
    var modelDefinition=kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Recipients");
    this.benificiaryData=new modelDefinition();
  };
   /**
   * modifies the ebill enabled/disabled status of a particular payee.
   * @param {object} record record with the payeeId and ebill status of a payee.
   * @param {function} presentationSuccessCallback - invoke the call back with success response.
   * @param {function} presentationErrorCallback - invoke the call back with error response.
     */
  RecipientsManager.prototype.modifyEBillStatus = function(record,presentationSuccessCallback, presentationErrorCallback) {
    var tran = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Payee");
    record={"EBillEnable":record.EBillEnable,"payeeId":record.payeeId};
    tran.partialUpdate(record,updateCompletionCallback,"online");
    function updateCompletionCallback(status, data, error) {
      var billPayMod = applicationManager.getModule("BillPayModule");
      billPayMod.presentationController.fetchAllPayeesAfterUpdatingPayeeStatus();
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status, data, error);
      if(obj["status"] === true){
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
    /**
   * Fetches  wire tranfser recipients
   * @param {object} params parameters for sorting|pagination|search
   * @param {string} [params.offset]  offset for pagination
   * @param {string} [params.searchString]  searchString for pagination
   * @param {string} [params.limit]  limit for pagination
   * @param {string} [params.sortBy]  sortBy parameter for sorting
   * @param {string} [params.order]  order for sorting asc or desc
   * @param {function} presentationSuccessCallback invoke the call back with success response.
   * @param {function} presentationErrorCallback  invoke the call back with error response.
     */
  RecipientsManager.prototype.fetchWireTransferRecipients  = function(params, presentationSuccessCallback, presentationErrorCallback) {
    function onCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status, data, error);
      if(obj["status"] === true){
        if(!kony.sdk.isNullOrUndefined(obj["data"].Payee)){
          obj["data"] = obj["data"].Payee;
        }
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
    var  PayeeModel  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Recipients");
    PayeeModel.customVerb('getWireTransfersPayee', params, onCompletionCallback)
  };
  /**
   * Fetches unselected wire tranfser recipients
   * @param {object} params parameters for sorting|pagination|search
   * @param {string} [params.offset]  offset for pagination
   * @param {string} [params.searchString]  searchString for pagination
   * @param {string} [params.limit]  limit for pagination
   * @param {string} [params.sortBy]  sortBy parameter for sorting
   * @param {string} [params.order]  order for sorting asc or desc
   * @param {function} presentationSuccessCallback invoke the call back with success response.
   * @param {function} presentationErrorCallback  invoke the call back with error response.
     */
  RecipientsManager.prototype.fetchUnselectedWireTransferRecipients  = function(params, presentationSuccessCallback, presentationErrorCallback) {
    function onCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status, data, error);
      if(obj["status"] === true){
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
    var  PayeeModel  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("BulkWire");
    PayeeModel.customVerb('GetUnselectedPayeesForBWTemplate', params, onCompletionCallback)
  };
  /**
  * get all external accounts related to a User using a service call.
  * @param {object} command ,  key value pairs required to get external Accounts.
  * @param {function} presentationSuccessCallback , invoke the call back with success response.
  * @param {function} presentationErrorCallback , invoke the call back with error response.
  */
  RecipientsManager.prototype.fetchAllExternalAccountsWithPagination = function(command,presentationSuccessCallback, presentationErrorCallback){
    var externalAccountsModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Payees");
    externalAccountsModel.customVerb("getPayeesList", command, getAllCompletionCallback);
    function  getAllCompletionCallback(status,  data,  error) {
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
  * get all external accounts related to a User using a service call.
  * @param {object} command ,  key value pairs required to get external Accounts.
  * @param {function} presentationSuccessCallback , invoke the call back with success response.
  * @param {function} presentationErrorCallback , invoke the call back with error response.
  */
 RecipientsManager.prototype.fetchAllExternalAccountsWithPaginationOld = function(command,presentationSuccessCallback, presentationErrorCallback){
  var externalAccountsModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("ExternalAccounts");
  externalAccountsModel.customVerb("getAllExternalAccountsWithPagination", command, getAllCompletionCallback);
  function  getAllCompletionCallback(status,  data,  error) {
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
  * get all external accounts related to a User using a service call.
  * @param {function} presentationSuccessCallback , invoke the call back with success response.
  * @param {function} presentationErrorCallback , invoke the call back with error response.
  */
 RecipientsManager.prototype.fetchAllExternalAccounts = function(presentationSuccessCallback, presentationErrorCallback){
  var recipientsModel = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Payees");
  recipientsModel.customVerb("getPayeesList", {}, getAllCompletionCallback, "online");
  function  getAllCompletionCallback(status,  data,  error) {
    var srh = applicationManager.getServiceResponseHandler();
    var obj =  srh.manageResponse(status,  data,  error);
    if(obj["status"] === true){
      presentationSuccessCallback(obj["data"]["ExternalAccounts"]);
    }
    else {
      presentationErrorCallback(obj["errmsg"]);
    }
  }
};

  /**
  * Verify External Bank Accounts
  * @param {function} presentationSuccessCallback , invoke the call back with success response.
  * @param {function} presentationErrorCallback , invoke the call back with error response.
  */
  RecipientsManager.prototype.verifyExternalBankAccount = function(data,presentationSuccessCallback, presentationErrorCallback){
    var userModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("User");
    userModel.customVerb("verifyExternalBankAccount", data, getAllCompletionCallback);
    function  getAllCompletionCallback(status,  data,  error) {
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
   * used to fetch list of states
   * @param {string} countryId Country Id
   * @param {function} presentationSuccessCallback will be called when call is successful
   * @param {function} presentationErrorCallback will be called when call is not successful
   */
  RecipientsManager.prototype.fetchStateList = function(countryId, presentationSuccessCallback, presentationErrorCallback)
  {
    function completionCallBack(status,  data,  error){
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj.status === true){
        presentationSuccessCallback(obj.data);
      }
      else {
        presentationErrorCallback(obj.errmsg);
      }
    }
    var stateRepo= kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("States");
    var criteria = kony.mvc.Expression.eq("countryId", countryId);
    stateRepo.getByCriteria(criteria,completionCallBack);
  };
  /**
   * used to fetch list of regions
   * @param {string} countryId Country Id
   * @param {function} presentationSuccessCallback will be called when call is successful
   * @param {function} presentationErrorCallback will be called when call is not successful
   */
  RecipientsManager.prototype.fetchAllRegions = function(countryId, presentationSuccessCallback, presentationErrorCallback)
  {
    function completionCallBack(status,  data,  error){
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj.status === true){
        presentationSuccessCallback(obj.data.records.filter(function (record) {
          return record.Country_id === countryId
        }));
      }
      else {
        presentationErrorCallback(obj.errmsg);
      }
    }
    var stateRepo= kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("States");
    var criteria = kony.mvc.Expression.eq("countryId", countryId);
    stateRepo.customVerb("getAllRegions", criteria,completionCallBack);
  };
  /**
   * used to fetch list of regions
   * @param {string} countryCode Country code
   * @param {function} presentationSuccessCallback will be called when call is successful
   * @param {function} presentationErrorCallback will be called when call is not successful
   */
  RecipientsManager.prototype.fetchRegionsByCountryCode = function(countryCode, presentationSuccessCallback, presentationErrorCallback)
  {
    function completionCallBack(status,  data,  error){
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj.status === true){
        presentationSuccessCallback(obj.data);
      }
      else {
        presentationErrorCallback(obj.errmsg);
      }
    }
    var stateRepo= kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("States");
    var criteria = {
      filter: "country_Name eq '" + countryCode + "'"
    }
    stateRepo.customVerb("getRegionDetails", criteria,completionCallBack);
  };
  /**
   *  Method for creating a new payee for wire transfer
   * @param {Object} recipientData Recipient Data in key value pairs
   * @param {function} presentationSuccessCallback will be called when call is successful
   * @param {function} presentationErrorCallback will be called when call is not successful
   */
  RecipientsManager.prototype.saveWireTransferRecipient = function(recipientData, presentationSuccessCallback, presentationErrorCallback)
  {
    function completionCallBack(status,  data,  error){
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj.status === true){
        presentationSuccessCallback(obj.data);
      }
      else {
        presentationErrorCallback(obj.errmsg);
      }
    }
    var payeeModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Recipients");
    payeeModel.customVerb("createWireTransfersPayee", recipientData, completionCallBack);
  };
  /**
   * Method for creating a new payee for wire transfer
   * @param {Object} transactionId TRansaction Id of one time transfer
   * @param {function} presentationSuccessCallback will be called when call is successful
   * @param {function} presentationErrorCallback will be called when call is not successful
   */
  RecipientsManager.prototype.savePayeeAfterWireTransfer = function(transactionId, presentationSuccessCallback, presentationErrorCallback)
  {
    function completionCallBack(status,  data,  error){
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj.status === true){
        presentationSuccessCallback(obj.data);
      }
      else {
        presentationErrorCallback(obj.errmsg);
      }
    }
    var params = {
      "transactionId": transactionId
    }
    var payeeModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Payee");
    payeeModel.customVerb("saveRecipientAfterWireTransfer", params, completionCallBack);
  };

  /**
   * Method for fetching recent benificiaries
   * @param {Object} params request parameters
   * @param {function} presentationSuccessCallback will be called when call is successful
   * @param {function} presentationErrorCallback will be called when call is not successful
   */
  RecipientsManager.prototype.fetchRecentBenificiaries = function(params, presentationSuccessCallback, presentationErrorCallback) {
    function completionCallBack(status,  data,  error){
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);

      if(obj.status === true){
        presentationSuccessCallback(obj.data);
      }
      else {
        presentationErrorCallback(obj.errmsg);
      }
    }

    var accountRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Accounts");
    accountRepo.customVerb("GetRecentList", params, completionCallBack);
  };
    /**
   * Method for fetching recent benificiaries
   * @param {Object} params request parameters
   * @param {function} presentationSuccessCallback will be called when call is successful
   * @param {function} presentationErrorCallback will be called when call is not successful
   */
  RecipientsManager.prototype.searchSwiftorBICCode = function(criteria,presentationSuccessCallback,presentationErrorCallback) {
    var self =this;
    var swiftCodeData  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("BankDetails");
    //swiftCodeData.getByCriteria(criteria,getCompletionCallback);
    swiftCodeData.customVerb('getSwiftCode',criteria,getCompletionCallback);    
    function getCompletionCallback(status,  data,  error){
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,data,error);
      if(obj.status === true){
        presentationSuccessCallback(obj.data);
      }
      else {
        presentationErrorCallback(obj.errmsg);
      }
    }
  };
  
      /**
   * Method for fetching swift/bic based on country/city/bank
   * @param {Object} params request parameters
   * @param {function} presentationSuccessCallback will be called when call is successful
   * @param {function} presentationErrorCallback will be called when call is not successful
   */
  RecipientsManager.prototype.searchAllSwiftBICCode = function(criteria,presentationSuccessCallback,presentationErrorCallback) {
    var self =this;
    var swiftCodeData  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("BankDetails");
    //swiftCodeData.getByCriteria(criteria,getCompletionCallback);
    swiftCodeData.customVerb('getBICFromBankDetails',criteria,getCompletionCallback);    
    function getCompletionCallback(status,  data,  error){
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,data,error);
      if(obj.status === true){
        presentationSuccessCallback(obj.data);
      }
      else {
        presentationErrorCallback(obj.errmsg);
      }
    }
  };
  /**
   * Method to check Valid IBAN
   * @param {Object} params request parameters containing IBAN value
   * @param {function} presentationSuccessCallback - invoke the call back with success response
   * @param {function} presentationErrorCallback - invoke the call back with error response
   */
  RecipientsManager.prototype.checkValidIBAN = function (params, presentationSuccessCallback, presentationErrorCallback) {
    var transactionObj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("BankDetails");
    transactionObj.customVerb('isValidIBAN', params, getCompletionCallback);
    function getCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj.status === true) {
        presentationSuccessCallback(obj.data);
      } else {
        presentationErrorCallback(obj.errmsg);
      }
    }
  };
  /**
   * Method to fetch bank date
   * @param {Object} params not required
   * @param {function} presentationSuccessCallback - invoke the call back with success response
   * @param {function} presentationErrorCallback - invoke the call back with error response
   */
  RecipientsManager.prototype.fetchBankDate = function (params, presentationSuccessCallback, presentationErrorCallback) {
    var transactionObj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("BankDate");
    transactionObj.customVerb('getBankDate', params, getCompletionCallback);
    function getCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj.status === true) {
        applicationManager.setBankDateForBankDateOperation(obj.data);
        presentationSuccessCallback(obj.data);
      } else {
        presentationErrorCallback(obj.errmsg);
      }
    }
  };
  /**
   * Method to fetch bank details from IBAN
   * @param {Object} params request parameters containing IBAN value
   * @param {function} presentationSuccessCallback - invoke the call back with success response
   * @param {function} presentationErrorCallback - invoke the call back with error response
   */
  RecipientsManager.prototype.fetchBankDetails = function (params, presentationSuccessCallback, presentationErrorCallback) {
    var transactionObj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Transactions");
    transactionObj.customVerb('getDetailsFromIBAN', params, getCompletionCallback);
    function getCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj.status === true) {
        presentationSuccessCallback(obj.data);
      } else {
        presentationErrorCallback(obj.errmsg);
      }
    }
  };
  
  RecipientsManager.prototype.getBeneficiaryName = function(command,presentationSuccessCallback, presentationErrorCallback){
    var externalAccountsModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Recipients");
    externalAccountsModel.customVerb("getBeneficiaryNameFromAccountId", command, getAllCompletionCallback);
    function  getAllCompletionCallback(status,  data,  error) {
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
  
  RecipientsManager.prototype.getBankDetailsFromBIC = function(command,presentationSuccessCallback, presentationErrorCallback){
    var externalAccountsModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("BankDetails");
    externalAccountsModel.customVerb("getBankDetailsFromBicCode", command, getAllCompletionCallback);
    function  getAllCompletionCallback(status,  data,  error) {
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
  RecipientsManager.prototype.getPurposeCodes = function(payload,presentationSuccessCallback, presentationErrorCallback){
    var externalCodes = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("ExternalCodes");
    externalCodes.customVerb("getPurposeCodes", payload, getAllCompletionCallback);
    function  getAllCompletionCallback(status,  data,  error) {
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
  RecipientsManager.prototype.createPayeeForBulk = function(payload,presentationSuccessCallback, presentationErrorCallback){
    var payeeModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Payees");
    payeeModel.customVerb("createPayee", payload, getAllCompletionCallback);
    function  getAllCompletionCallback(status,  data,  error) {
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

  RecipientsManager.prototype.getLookUpData = function(payload,presentationSuccessCallback, presentationErrorCallback){
    //definition is same as purpose codes as lookup is dummy
    payload = {
      "id":"PurpCd"
    }
    var externalCodes = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("ExternalCodes");
    externalCodes.customVerb("getPurposeCodes", payload, getAllCompletionCallback);
    function  getAllCompletionCallback(status,  data,  error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj["status"] === true){
        let dummyData = [
          {
            bic:"BARCGB22",
            bankName:"Bank of Moscow",
            addressLine1:"Lake Gardens",
            city:"Moscow",
            country:"Russia",
          },
          {
            bic:"BARCGB22",
            bankName:"Bank of India",
            addressLine1:"Route 1",
            city:"Hyderabad",
            country:"India",
          },
          {
            bic:"BARCGB22",
            bankName:"Bank of America",
            addressLine1:"High Hills",
            city:"New York",
            country:"USA",
          }
        ]
        presentationSuccessCallback(dummyData);
        // presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
  RecipientsManager.prototype.getClearingCodeLookupData = function(payload,presentationSuccessCallback, presentationErrorCallback){
    //definition is same as purpose codes as lookup is dummy
    payload = {
      "id":"PurpCd"
    }
    var externalCodes = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("ExternalCodes");
    externalCodes.customVerb("getPurposeCodes", payload, getAllCompletionCallback);
    function  getAllCompletionCallback(status,  data,  error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj["status"] === true){
        let dummyData = [
          {
            clearingCode:"123456",
            bankName:"Bank of Moscow",
            addressLine1:"Lake Gardens",
            city:"Moscow",
            country:"Russia",
          },
          {
            clearingCode:"678912",
            bankName:"Bank of India",
            addressLine1:"Route 1",
            city:"Hyderabad",
            country:"India",
          },
          {
            clearingCode:"345678",
            bankName:"Bank of America",
            addressLine1:"High Hills",
            city:"New York",
            country:"USA",
          }
        ]
        presentationSuccessCallback(dummyData);
        // presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
  
  RecipientsManager.prototype.validateIBANandGetBankDetails = function(command,presentationSuccessCallback, presentationErrorCallback){
    var externalAccountsModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Recipients");
    externalAccountsModel.customVerb("validateIBANandGetBankDetails", command, getAllCompletionCallback);
    function  getAllCompletionCallback(status,  data,  error) {
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
  
  RecipientsManager.prototype.getAllBICsAndBankDetails = function(command,presentationSuccessCallback, presentationErrorCallback){
    var externalAccountsModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Recipients");
    externalAccountsModel.customVerb("getAllBICsAndBankDetails", command, getAllCompletionCallback);
    function  getAllCompletionCallback(status,  data,  error) {
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
  * fetch the list of contracts.
  * @param featureAction - to filter contracts based on featureAction
  * @param {function} presentationSuccessCallback - invoke the call back with success response.
  * @param {function} presentationErrorCallback - invoke the call back with error response.
  */
  RecipientsManager.prototype.getInfinityUserContractCustomers = function(featureAction, presentationSuccessCallback, presentationErrorCallback)
  {
    var infinityUserModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("ExternalUsers_1");
    infinityUserModel.customVerb("getInfinityUserContractCustomers", {}, getAllCompletionCallback);
    function  getAllCompletionCallback(status,  data,  error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj["status"] === true){
        scope_RecipientsManager.setContractDetails(obj["data"]);
        obj["data"] = scope_RecipientsManager.filterContractsByFeatureAction(featureAction, obj["data"]);
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
  
  RecipientsManager.prototype.fetchContractDetails = function(featureAction, presentationSuccessCallback, presentationErrorCallback)
  {
    if(Object.keys(this.contractDetails).length === 0 && this.contractDetails.constructor === Object){
      scope_RecipientsManager.getInfinityUserContractCustomers(featureAction, presentationSuccessCallback, presentationErrorCallback);
    }
    else{
      var filteredData = scope_RecipientsManager.filterContractsByFeatureAction(featureAction, this.contractDetails);
      presentationSuccessCallback(filteredData);
    }
  };
  
  RecipientsManager.prototype.setContractDetails = function(data)
  {
    this.contractDetails = data;
  };
  
  /**
   * Filter contracts based on featureAction
   * @returns contract details which are authorized for given featureAction
   */
  RecipientsManager.prototype.filterContractsByFeatureAction=function(featureAction, data){
    var contractsArr =  data.contracts;
	
    if(contractsArr.length === 0){
      return data;
    }
	
	var filteredContractsData = [];
    for(var i = 0; i < contractsArr.length; i++){
      var customersArr = contractsArr[i].contractCustomers;
	  var filteredCustomersData = [];
      for(var j = 0; j < customersArr.length; j++){
        var customerActions = customersArr[j].actions;
        if(customerActions.includes(featureAction)){
			filteredCustomersData.push(customersArr[j]);
        }
      }
	  if(filteredCustomersData.length > 0){
		  contractsArr[i].contractCustomers = filteredCustomersData;
		  filteredContractsData.push(contractsArr[i]);
	  }
    }
	
	data.contracts = filteredContractsData;
	return data;
  };

  /**
   * Filters list of Accounts by membershipId
   * @param {*} membershipId 
   * @param {*} toAccounts 
   */
  RecipientsManager.prototype.filterToAccountsByMembershipId = function (membershipId, toAccounts) {
    let toAccsArray = [];
    toAccounts.forEach(x => {
      if (x.Membership_id) {
        x.Membership_id === membershipId ? toAccsArray.push(x) : "";
      } else if (x.cif) {
        let toMemId = [];
        JSON.parse(x.cif).forEach(x => toMemId.push(...x.coreCustomerId.split(',')));
        if (toMemId.includes(membershipId)) {
          toAccsArray.push(x);
        }
      }
    });
    return toAccsArray;
  };
    /**
   * Filters list of Accounts by accountType
   * @param {*} accountType 
   * @param {*} toAccounts 
   */
  RecipientsManager.prototype.filterCreditCardAccount = function(accountType, toAccounts) {
    let toAccsArray = [];
    toAccounts.forEach(x => {
      if (x.accountType) {
        x.accountType === accountType ? toAccsArray.push(x) : "";
      }
    });
    return toAccsArray;
  };
  /**
   * Method to get the payee name.
   * @param {Function} successCallback - invoke the call back with success response.
   * @param {Function} errorCallback - invoke the call back with error response.
   */

  // [Trixon] Utilized this Object Service call for Within BOA Transfer Account Validation
  RecipientsManager.prototype.getPayeeName = function (param, successCallback, errorCallback) {
    var payeeModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Payee_Name");
    payeeModel.customVerb("getPayeeName", param, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var serviceResponseHandler = applicationManager.getServiceResponseHandler();
      var responseObject = serviceResponseHandler.manageResponse(status, data, error, successCallback, successCallback);
      if (responseObject["status"] === true) {
        successCallback(responseObject["data"]);
      } else {
        errorCallback(responseObject["errmsg"]);
      }
    }
  };
  // [Trixon] Ended
    /**
   * Method to verify the payee details.
   * @param {Function} successCallback - invoke the call back with success response.
   * @param {Function} errorCallback - invoke the call back with error response.
   */
  RecipientsManager.prototype.verifyPayee = function(param,successCallback, errorCallback){
    var recipientsModel = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Payees");
    recipientsModel.customVerb("verifyPayeeDetails", param, getAllCompletionCallback);
    function  getAllCompletionCallback(status,  data,  error) {
      var serviceResponseHandler = applicationManager.getServiceResponseHandler();
      var responseObject = serviceResponseHandler.manageResponse(status, data, error, successCallback, successCallback);
      if (responseObject["status"] === true) {
        successCallback(responseObject["data"]);
      } else {
        errorCallback(responseObject["errmsg"]);
      }
    }
  };
  
  return RecipientsManager;
});