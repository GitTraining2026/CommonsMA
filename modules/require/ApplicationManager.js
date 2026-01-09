/**
  *@module ApplicationManager
  */
 define(['ServiceResponseHandler', 'HashTable', 'PermissionHandler', 'FormAuthorizationConfig', 'OLBConstants'], function(ServiceResponseHandler, HashTable, PermissionHandler, FormAuthorizationConfig, OLBConstants) {
  /**
  * ApplicationManager is an implementation of managers in the project
  *@alias module:ApplicationManager
  *@class
  */
function ApplicationManager(){
  /**@member {object} applicationManagerInstance Contains instance of application manager*/
  /**@member {object} HashTable Contains instance of Hashtable*/
  /**@member {object} serviceResponseHandler Contains instance of serviceResponseHandler*/
    this.applicationManagerInstance= null;
    this.applicationMode = null;
    this.HashTable= null;
	this.actionSheetObject = null;
    this.serviceResponseHandler = null;
    this.gblDeepLink = "false";
    this.deeplinkAppName = "";
    this.consentTypeName = "";
    this.deeplinkSchemaName = "";
    this.consentType = "";
  /**   numberOfAsyncForPreAppInit
          *  1.getApplicationProperties
          *  2.getProducts
            */
    if(kony.os.deviceInfo().name === "thinclient") {
    this.numberOfAsyncForPreAppInit=2;
	} else {
	this.numberOfAsyncForPreAppInit=3;	
	}
};

//Adding this to set the IdentityService when its SCA specific
 ApplicationManager.prototype.defineSCAConfig = function()
{
     switch(SCAType){
      case "HID" : OLBConstants.IDENTITYSERVICENAME = "CIBACustomIdentity";
        break;
      case "UNIKEN" : OLBConstants.IDENTITYSERVICENAME = "DbxUserLogin";
        break;
      case "BASE" : OLBConstants.IDENTITYSERVICENAME = "DbxUserLogin";
        break;
    }
   };

 /** setting rmsSession id if RISK_ASSESSMENT is enbaled */
   ApplicationManager.prototype.getRmsSessionID = function(){
  if(this.rmsSessionId){
    return this.rmsSessionId;
  }
  return "";
};
ApplicationManager.prototype.setRmsSessionID = function(session_id){
  this.rmsSessionId = session_id;
};
/** return userid for rms pre login scenarios */
ApplicationManager.prototype.setRmsUserID = function(rms_userid){
  this.rmsUserid = rms_userid;
};
ApplicationManager.prototype.getRmsUserID = function(){
  if(this.rmsUserid){
    return this.rmsUserid;
  }
  return "";
};
 /**
  * returns FeedbackManager object
  * @returns {object} value gives FeedbackManager object
  */
ApplicationManager.prototype.getFeedbackManager = function(){
   return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "FeedbackManager", "appName" : "CommonsMA"}).businessController;
};
/**
* returns ApprovalsReqManager object 
* @returns {object} value gives ApprovalsReqManager object 
*/
ApplicationManager.prototype.getApprovalsReqManager = function(){
 return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "ApprovalsReqManager", "appName" : "ApprovalRequestMA"}).businessController;
};
/**
  * returns SavingsPotManager object
  * @returns {object} value gives FeedbackManager object
  */
ApplicationManager.prototype.getSavingsPotManager = function(){
   return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SavingsPotManager", "appName" : "SavingsPotMA"}).businessController;
};
/**
* returns ACHManager object 
* @returns {object} value gives ACHManager object 
*/
ApplicationManager.prototype.getACHManager = function(){
 return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "ACHManager", "appName": "ACHMA"}).businessController;
};
  /**
  * returns wealthmanager object
  * @returns {object} value gives wealthmanager object
  */
ApplicationManager.prototype.getWealthManager = function(){
   return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule('WealthManager').businessController;
};
    /**
* returns wealthOrdermanager object 
* @returns {object} value gives wealthOrdermanager object 
*/
  ApplicationManager.prototype.getWealthOrderManager = function(){
    return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "WealthOrderManager", "appName" : "WealthOrderMA"}).businessController;
  };
/**
  * returns MenuHandler object
  * @returns {object} value gives MenuHandler object
  */
ApplicationManager.prototype.getMenuHandler = function(){
   return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "MenuHandler", "appName" : "CommonsMA"}).businessController;
};
/**
* returns BulkPayments object 
* @returns {object} value gives BulkManager object 
*/
ApplicationManager.prototype.getBulkManager = function(){
 return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "BulkPaymentsManager", "appName" : "BulkPaymentsMA"}).businessController;
};
/**
* returns PresentationUtility object 
* @returns {object} value gives PresentationUtility object 
*/
ApplicationManager.prototype.getPresentationUtility = function(){
 if(kony.os.deviceInfo().name === "thinclient") {
 return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "PresentationUtility", "appName" : "CommonsMA"}).businessController;
 } else {
 return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "PresentationUtilityMB", "appName" : "CommonsMA"}).businessController;	 
 }
};

/**
* returns PresentationInterruptHandler object 
* @returns {object} value gives PresentationInterruptHandler object 
*/
ApplicationManager.prototype.getPresentationInterruptHandler = function(){
 return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "PresentationInterruptHandler", "appName" : "CommonsMA"}).businessController;
};

/**
* returns DataProcessorUtility object 
* @returns {object} value gives DataProcessorUtility object 
*/
ApplicationManager.prototype.getDataProcessorUtility = function(){
  return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "DataProcessorUtility", "appName" : "CommonsMA"}).businessController;
};
/**
* returns CampaignManagementManager object 
* @returns {object} value gives AuthManager object 
*/
ApplicationManager.prototype.getCampaignManagementManager = function() {		
return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "CampaignManagementManager", "appName" : "CommonsMA"}).businessController;
};
/**
  * returns LoansManager object
  * @returns {object} value gives LoansManager object
  */
ApplicationManager.prototype.getLoansManager = function() {
  return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({ appName: 'BillPayMA', moduleName: 'LoansManager' }).businessController;
};
/**
  * returns PresentationValidationUtility object
  * @returns {object} value gives PresentationValidationUtility object
  */
ApplicationManager.prototype.getPresentationValidationUtility = function(){
   return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "PresentationValidationUtility", "appName" : "CommonsMA"}).businessController;
};
/**
  * returns PresentationFormUtility object
  * @returns {object} value gives PresentationFormUtility object
  */
ApplicationManager.prototype.getPresentationFormUtility = function(){
  return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "PresentationFormUtility", "appName" : "CommonsMA"}).businessController;
};
/**
* returns the presentationController corresponding to the specified Module and attribute.
* @param {String}  moduleName - represents the Module name.
* @param {String} attribute - represents the attribute.
*/
ApplicationManager.prototype.getModulesPresentationController = function(moduleName){
 return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule(moduleName, applicationManager.getConfigurationManager().getDeploymentGeography()).presentationController;
};
/**
* Returns ApplicationManager object, creates new if doesn't exist.
* @returns {object} value gives PresentationFormUtility object 
*/  
ApplicationManager.getApplicationManager = function(){
if (!this.applicationManagerInstance) 
  this.applicationManagerInstance = new ApplicationManager();
  return this.applicationManagerInstance;
};

/** 
* Method to set Bank Date for Dashboard Operation
*/
ApplicationManager.prototype.setBankDateForDashboardOperation = function (bankDate) {
  this.updatedBankDateForDashboardOperation = bankDate;
};

/** 
* Method to get Bank Date for Dashboard Operation
* @returns {object} updatedBankDate 
*/
ApplicationManager.prototype.getBankDateForDashboardOperation = function () {
  if (this.updatedBankDateForDashboardOperation) {
    return this.updatedBankDateForDashboardOperation;
  }
  return {};
};

/** 
* Method to set Bank Date for BankDate Operation
*/
ApplicationManager.prototype.setBankDateForBankDateOperation = function (bankDate) {
  this.updatedBankDateForBankDateOperation = bankDate;
};

/** 
* Method to set Bank Date for BankDate Operation
* @returns {object} updatedBankDate 
*/
ApplicationManager.prototype.getBankDateForBankDateOperation = function () {
  if (this.updatedBankDateForBankDateOperation) {
    return this.updatedBankDateForBankDateOperation;
  }
  return {};
};

/**
* resets the internal accounts data members of accounts manager, transfer object of transaction manager, bill pay payeedata, P2P Payee data and beneficiary object of recepient manager
*/
ApplicationManager.prototype.clearBusinessDataMemebers = function(){   
  // NOTE: The code can be uncommented as per requirement of different MicroApps.
  // this.getAccountManager().clearInternalAccounts();
  // this.getTransactionManager().clearTransferObject();
  // this.getRecipientsManager().clearBillPayPayeeData();
  // this.getRecipientsManager().clearP2PPayeeData();
  // this.getRecipientsManager().clearBeneficiaryObject(); 
  // this.getConfigurationManager().resetConfigurationObject();
 
};
/**
  * returns ProductManager object
  * @returns {object} value gives ProductManager object
  */
ApplicationManager.prototype.getProductManager = function(){
	return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule('ProductManager').businessController;
};
/**
* returns ProductManager object 
* @returns {object} value gives ProductManager object 
*/
ApplicationManager.prototype.getProductManager = function(){
return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule('CampaignManagement').businessController;
}; 
/**
* Returns ServiceResponseHandler object, creates new if doesn't exist.
* @returns {object} value gives ServiceResponseHandler object 
*/
ApplicationManager.prototype.getServiceResponseHandler = function() {
if (!this.serviceResponseHandler) {
  this.serviceResponseHandler = new ServiceResponseHandler();
}
return this.serviceResponseHandler;
};
/**
  * returns RegistrationManager object
  * @returns {object} value gives RegistrationManager object
  */
ApplicationManager.prototype.getRegistrationManager = function() {
	return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "RegistrationManager", "appName" : "AuthenticationMA"}).businessController;
};
/**
  * returns NavigationManager object
  * @returns {object} value gives NavigationManager object
  */
ApplicationManager.prototype.getNavigationManager = function() {
  return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "NavigationManager", "appName" : "CommonsMA"}).businessController;
};
/**
  * returns UserPreferencesManager object
  * @returns {object} value gives UserPreferencesManager object
  */
ApplicationManager.prototype.getUserPreferencesManager = function() {
	return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "UserPreferencesManager", "appName" : "CommonsMA"}).businessController;
};
/**
  * returns AuthManager object
  * @returns {object} value gives AuthManager object
  */
ApplicationManager.prototype.getAuthManager = function() {
	return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "AuthManager", "appName" : "CommonsMA"}).businessController;
};
/**
  * returns ConfigurationManager object
  * @returns {object} value gives ConfigurationManager object
  */
ApplicationManager.prototype.getConfigurationManager = function() {
  return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "ConfigurationManager", "appName" : "CommonsMA"}).businessController;
};
/**
  * returns DeviceUtilManager object
  * @returns {object} value gives DeviceUtilManager object
  */
ApplicationManager.prototype.getDeviceUtilManager = function() {
  return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "DeviceUtilManager", "appName" : "CommonsMA"}).businessController;
};
/**
  * returns EngageManager object
  * @returns {object} value gives EngageManager object
  */
ApplicationManager.prototype.getEngageManager = function() {
	return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule('EngageManager').businessController;
};
/**
  * returns FormatUtilManager object
  * @returns {object} value gives FormatUtilManager object
  */
ApplicationManager.prototype.getFormatUtilManager = function() {
  return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "FormatUtilManager", "appName" : "CommonsMA"}).businessController;
};
/**
  * returns ExternalAccountsManager object
  * @returns {object} value gives ExternalAccountsManager object
  */
ApplicationManager.prototype.getExternalAccountsManager = function() {
	return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "AccAggregationMA", "moduleName" : "ExternalAccountsManager"}).businessController;
};
/**
* Returns HashTable object, creates new if doesn't exist.
* @returns {object} value gives HashTable object 
*/
ApplicationManager.prototype.getHashTable = function() {
if (!this.HashTable) {
  this.HashTable = new HashTable();
}
return this.HashTable;
};
/**
  * returns ValidationUtilManager object
  * @returns {object} value gives ValidationUtilManager object
  */
ApplicationManager.prototype.getValidationUtilManager = function() {
	return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "ValidationUtilManager", "appName" : "CommonsMA"}).businessController;
};
/**
  * returns StorageManager object
  * @returns {object} value gives StorageManager object
  */
ApplicationManager.prototype.getStorageManager = function() {
  return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "StorageManager", "appName" : "CommonsMA"}).businessController;
};
  
ApplicationManager.prototype.getAccountServicesModule = function() {
	return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule('AccountServicesManager').businessController;
};
/**
  * returns LocationManager object
  * @returns {object} value gives LocationManager object
  */
ApplicationManager.prototype.getLocationManager = function() {
	return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "LocationManager", "appName" : "CommonsMA"}).businessController;
};
/**
  * returns AccountManager object
  * @returns {object} value gives AccountManager object
  */
ApplicationManager.prototype.getAccountManager = function() {
  return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "AccountManager", "appName" : "HomepageMA"}).businessController;
};
/**
  * returns PersonalFinanceManagementManager object
  * @returns {object} value gives PersonalFinanceManagementManager object
  */
ApplicationManager.prototype.getPersonalFinanceManager = function() {
  return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "PersonalFinanceManagementManager", "appName" : "FinanceManagementMA"}).businessController;
};
/**
* returns AccountTypeManager object 
* @returns {object} value gives LocationManager object 
*/
ApplicationManager.prototype.getTypeManager = function() {
return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "TypeManager", "appName" : "CommonsMA"}).businessController;
};
/**
  * returns PayeeManager object
  * @returns {object} value gives PayeeManager object
  */
ApplicationManager.prototype.getPayeeManager = function() {
	return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule('PayeeManager').businessController;
};
/**
  * returns NewUserBusinessManager object
  * @returns {object} value gives NewUserBusinessManager object
  */
ApplicationManager.prototype.getNewUserBusinessManager = function() {
	return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule('NewUserBusinessManager').businessController;
};
/**
  * returns InformationManager object
  * @returns {object} value gives InformationManager object
  */
ApplicationManager.prototype.getInformationManager = function() {
	return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "InformationManager","appName" : "AboutUsMA"}).businessController;
};
/**
  * returns LoggerManager object
  * @returns {object} value gives LoggerManager object
  */
ApplicationManager.prototype.getLoggerManager = function() {
	return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "LoggerManager", "appName" : "CommonsMA"}).businessController;
};
   /**
  * returns ImportLCManager object
  * @returns {object} value gives ImportLCManager object
  */
ApplicationManager.prototype.getImportLCManager = function() {
	return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "ImportLCManager", "appName" : "TradeFinanceMA"}).businessController;
};
 /**
  * returns ExportLCManager object
  * @returns {object} value gives ExportLCManager object
  */
  ApplicationManager.prototype.getExportLCManager = function() {
    return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "ExportLCManager", "appName" : "TradeFinanceMA"}).businessController;
  };
/**
  * returns CardsManager object
  * @returns {object} value gives CardsManager object
  */
ApplicationManager.prototype.getCardsManager = function() {
    return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "CardsManager", "appName" : "CardsMA"}).businessController;
};
/**
  * returns MessagesManager object
  * @returns {object} value gives MessagesManager object
  */
ApplicationManager.prototype.getMessagesManager = function() {
  return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "MessagesManager", "appName" : "SecureMessageMA"}).businessController;
};
/**
  * returns TransactionManager object
  * @returns {object} value gives TransactionManager object
  */
ApplicationManager.prototype.getTransactionManager = function() {
	return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "TransactionManager", "appName" : "CommonsMA"}).businessController;
};
/**
  * returns SweepsManager object
  * @returns {object} value gives SweepsManager object
  */
 ApplicationManager.prototype.getAccountSweepsManager = function() {
	return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "AccountSweepsManager", "appName" : "AccountSweepsMA"}).businessController;
};
/**
  * returns TransactionsListManager object
  * @returns {object} value gives TransactionsListManager object
  */
ApplicationManager.prototype.getTransactionsListManager = function() {
	return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "TransactionsListManager", "appName" : "ArrangementsMA"}).businessController;
};
/**
  * returns RecipientsManager object
  * @returns {object} value gives RecipientsManager object
  */
ApplicationManager.prototype.getRecipientsManager = function() {
	return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "RecipientsManager", "appName" : "CommonsMA"}).businessController;
};
/**
  * returns TransferManager object
  * @returns {object} value gives TransferManager object
  */
ApplicationManager.prototype.getTransferManager = function() {
	return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule('TransferManager').businessController;
};
/**
  * returns QRCodeManager object
  * @returns {object} value gives QRCodeManager object
  */
ApplicationManager.prototype.getQRCodeManager = function() {
	return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule('QRCodeManager').businessController;
};
/**
  * returns AsyncManager object
  * @returns {object} value gives AsyncManager object
  */
ApplicationManager.prototype.getAsyncManager = function() {
    return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "AsyncManager", "appName" : "CommonsMA"}).businessController;
};
/**
  * returns DirectMarketingManager object
  * @returns {object} value gives DirectMarketingManager object
  */
ApplicationManager.prototype.getDirectMarketingManager = function() {
	return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "DirectMarketingManager", "appName" : "CommonsMA"}).businessController;
};
/**
  * returns SettingsManager object
  * @returns {object} value gives SettingsManager object
  */
ApplicationManager.prototype.getSettingsManager = function(){
	return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule('SettingsManager').businessController;
};

ApplicationManager.prototype.getSettingsApprovalManager = function(){
	return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsApprovalManager", "appName" : "ApprovalMatrixMA"}).businessController;
    
};

   /**
  * returns CDPConsentManager object
  * @returns {object} value gives CDPConsentManager object
  */
   ApplicationManager.prototype.getCDPConsentManager = function(){
     return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "CDPConsentManager", "appName" : "ConsentMgmtMA"}).businessController;
   };
   
      /**
  * returns PSD2ConsentManager object
  * @returns {object} value gives PSD2ConsentManager object
  */
   ApplicationManager.prototype.getPSD2ConsentManager = function(){
     return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "PSD2ConsentManager", "appName" : "ConsentMgmtMA"}).businessController;
   };
   
/**
  * returns ChatBotManager object
  * @returns {object} value gives ChatBotManager object
  */
ApplicationManager.prototype.getChatBotManager = function(){
   return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule('ChatBotManager').businessController;
};
/**
  * returns PaginationManager object
  * @returns {object} value gives PaginationManager object
  */
ApplicationManager.prototype.getPaginationManager = function(){
   return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "PaginationManager", "appName" : "CommonsMA"}).businessController;
};
/**
  * returns BillManager object
  * @returns {object} value gives BillManager object
  */
ApplicationManager.prototype.getBillManager = function(){
   return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({ "moduleName": "BillManager", "appName": "BillPayMA" }).businessController;
};
/**
  * returns TermsAndConditionsManager object for MB
  * @returns {object} value gives TermsAndConditionsManager object
  */
 ApplicationManager.prototype.getTermsAndConditionsManager = function(){
  return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "TermsAndConditionsManager", "appName" : "CommonsMA"}).businessController;
};
/**
  * returns TermsAndConditionsManager object for OLB
  * @returns {object} value gives TermsAndConditionsManager object
  */
 ApplicationManager.prototype.getTermsAndConditionManager = function(){
  return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "TermsAndConditionsManager", "appName" : "CommonsMA"}).businessController;
};
/**
  * returns AlertsManager object
  * @returns {object} value gives AlertsManager object
  */
 ApplicationManager.prototype.getAlertsManager = function(){
  return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "AlertsManager", "appName" : "CommonsMA"}).businessController;
};
/**
  * returns the presentationController corresponding to the specified Module and attribute.
  * @param {String}  moduleName - represents the Module name.
  */
ApplicationManager.prototype.getModulesPresentationController = function(moduleName){
   return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule(moduleName, applicationManager.getConfigurationManager().getDeploymentGeography()).presentationController;
};
/**
* returns MFAManager object 
* @returns {object} value gives MFAManager object 
*/ 
ApplicationManager.prototype.getMFAManager = function() {
   return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "MFAManager", "appName" : "CommonsMA"}).businessController;
}; 
/**
* returns PortfolioManager object 
* @returns {object} value gives MFAManager object 
*/ 
ApplicationManager.prototype.getWealthPortfolioManager = function(){
    return kony.mvc.MDAApplication.getSharedInstance().moduleManager.getModule({"moduleName" : "WealthPortfolioManager", "appName" : "PortfolioManagementMA"}).businessController;
};
   

/**
* returns Business User Manager object 
* @returns {object} value gives BusinessUserManager object 
*/
ApplicationManager.prototype.getBusinessUserManager = function() {		
return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName": "BusinessUserManager","appName": "UserManagementMA"}).businessController;
};

/**
* returns Business User Manager object 
* @returns {object} value gives BusinessUserManager object 
*/
ApplicationManager.prototype.getBBMFAManager = function(){
	return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule('MFAModule').businessController;
};

/**
  * returns OpenBankingManager object
  * @returns {object} value gives OpenBankingManager object
  */
ApplicationManager.prototype.getOpenBankingManager = function() {
  return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "OpenBankingManager", "appName" : "OpenBankingMA"}).businessController;
};
/**
  * Makes all the pre app initiation calls
  */
ApplicationManager.prototype.preappInitCalls = function()
{
 applicationManager.getPresentationFormUtility();
 applicationManager.getPresentationUtility();
 applicationManager.getPresentationInterruptHandler();
  var config = applicationManager.getConfigurationManager();
  this.getAsyncManager().initiateAsyncProcess(2);
  this.fetchAppProperties();
  if(kony.os.deviceInfo().name === "thinclient") {
  this.fetchAllProducts();
  }
  config.setStartupLocaleAndDateFormat();
  config.fetchClientSideConfigurations();
  if (config.getLocale()) {
    kony.i18n.setCurrentLocaleAsync(config.getLocale(),this.LocaleUpdateSucCallback, this.LocaleUpdateFailCallback);
    //config.reloadConstants();
  }
  try {
    const authMode = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
      "moduleName": "AuthUIModule", 
      "appName": "AuthenticationMA"
    });
    authMode.presentationController.checkAppinit = false;
    var regManager = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
      "moduleName": "RegistrationManager",
      "appName": "AuthenticationMA"
    }).businessController;
    regManager.registerCallBacksForPushNotifications();
  } catch(e) {
    kony.print(e);
  }
};
/**
  * Locale update success
  */
ApplicationManager.prototype.LocaleUpdateSucCallback = function(res){
  var config = applicationManager.getConfigurationManager();
  //config.reloadConstants();
  var asyncManager = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "AsyncManager", "appName" : "CommonsMA"}).businessController;
  asyncManager.setSuccessStatus(1,res);
};
/**
  * Locale update failure
  */
ApplicationManager.prototype.LocaleUpdateFailCallback = function(res){
  var asyncManager = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "AsyncManager", "appName" : "CommonsMA"}).businessController;
  asyncManager.setErrorStatus(1,res);
};
/**
  * Makes all the post app initiation calls
  */
   ApplicationManager.prototype.postAppInitiate = function () {
     try {
       const registrationManager = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
         "moduleName": "RegistrationManager",
         "appName": "AuthenticationMA"
       }).businessController;
       switch (SCAType) {
         case "HID":
           OLBConstants.IDENTITYSERVICENAME = "CIBACustomIdentity";
           break;
         case "UNIKEN":
           OLBConstants.IDENTITYSERVICENAME = "DbxUserLogin";
           break;
         case "BASE":
           OLBConstants.IDENTITYSERVICENAME = "DbxUserLogin";
           break;
       }
       registrationManager.hideLoadingIndicator();
       registrationManager.setActionsForceTouch();
     } catch (e) {
      kony.print(e);
  }
  generateAlert = function(){
      var didobject = {
          detectedCallback: () => {
              kony.application.exit(0); //exiting form the app
          },
          "type": "fridaquickscan"
      };
      kony.os.detectDynamicInstrumentation(didobject);
    }
  kony.timer.schedule("timer4",generateAlert, 30, true);
  var navManager = applicationManager.getNavigationManager();
  navManager.stack.push("frmLogin");
  this.getDataforLogin();
  //authMode.presentationController.fetchUserNameAndPasswordInstructions();
};
/**
  * Callback function on fridaquickscan detection
  */
ApplicationManager.prototype.detectedCallbackFunction = function () {
  kony.ui.Alert("fridaquickscan detected ..exiting from the app");
  kony.application.exit();//exiting form the app
};
/**
  * Fetches the list of products and their description
  */
ApplicationManager.prototype.fetchAllProducts=function()
{
   var proMan=applicationManager.getProductManager();
  proMan.fetchProductsList(this.productsSuccessCallback,this.productsErrorCallback);
};
/**
  * Fetch the application properties
  */
ApplicationManager.prototype.fetchAppProperties = function()
{
  var configMan=applicationManager.getConfigurationManager();
  configMan.fetchApplicationProperties(this.appPropSuccessCallBack,this.appPropErrorCallBack);
};
/**
  * Success callback of fetch application properties
  *@param {object} res response from the backend
  */
ApplicationManager.prototype.appPropSuccessCallBack=function(res)
{
  var asyncManager = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "AsyncManager", "appName" : "CommonsMA"}).businessController;
  asyncManager.setSuccessStatus(0,res);
  var configManager = applicationManager.getConfigurationManager();
  configManager.reloadConstants();
  if(asyncManager.areAllservicesDone(this.numberOfAsyncForPreAppInit))
  {
    try {
      const authMode = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
        "moduleName": "AuthUIModule", 
        "appName": "AuthenticationMA"
      });
      authMode.presentationController.checkAppinit = true;
      if(authMode.presentationController.isFaceLoginInProgress === false){
        applicationManager.getPresentationUtility().dismissLoadingScreen();
      }            
    } catch(e) {
      kony.print(e);
    }
  }
};
/**
  * Error callback of fetch application properties
  *@param {object} err response from the backend
  */
ApplicationManager.prototype.appPropErrorCallBack=function(err)
{
  var asyncManager = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "AsyncManager", "appName" : "CommonsMA"}).businessController;
  asyncManager.setErrorStatus(0,err);
  applicationManager.getPresentationUtility().dismissLoadingScreen();
  applicationManager.getPresentationInterruptHandler().showErrorMessage("appLaunch",err);
};
/**
  * Success callback of fetch all products
  *@param {object} res response from the backend
  */
ApplicationManager.prototype.productsSuccessCallback=function(res)
{
  var asyncManager = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "AsyncManager", "appName" : "CommonsMA"}).businessController;
  asyncManager.setSuccessStatus(1,res);
  var proMan=applicationManager.getProductManager();
  proMan.setProductsList(res);
  if(asyncManager.areAllservicesDone(this.numberOfAsyncForPreAppInit))
  {
    try {
      const authMode = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
        "moduleName": "AuthUIModule", 
        "appName": "AuthenticationMA"
      });
      authMode.presentationController.checkAppinit = true;
    } catch(e) {
      kony.print(e);
    }    
    applicationManager.getPresentationUtility().dismissLoadingScreen();
  }
};
/**
  * Error callback of fetch all products
  *@param {object} err response from the backend
  */
ApplicationManager.prototype.productsErrorCallback=function(error)
{
	var asyncManager = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "AsyncManager", "appName" : "CommonsMA"}).businessController;
    asyncManager.setErrorStatus(1,error);
  applicationManager.getPresentationUtility().dismissLoadingScreen();
  kony.print("error in productsErrorCallback");
	if (error["isServerUnreachable"])
               applicationManager.getPresentationInterruptHandler().showErrorMessage("appLaunch",error);
	else
		kony.ui.Alert(error.errorMessage);
};
/**
  * Get the required data for login
  */
ApplicationManager.prototype.getDataforLogin = function()
{
  var loginData = {};
  var userManager = applicationManager.getUserPreferencesManager();
  var devManager = applicationManager.getDeviceUtilManager();
  userManager.firstTimeappLogin();
  // var checkGoogleSupport=devManager.checkGoogleservicesSupported();
  // applicationManager.getConfigurationManager().GoogleservicesSupported=checkGoogleSupport;
  loginData.userName = userManager.getUserName();
  loginData.password = userManager.getPassword();
  loginData.isFirstTimeLogin=userManager.isFirstTimeLogin();
  loginData.isRememberMeOn = userManager.isRememberMeOn();
  loginData.isAccountPreviewEnabled = userManager.isAccountPreviewEnabled();
  loginData.defaultAuthMode = userManager.getDefaultAuthMode();
  loginData.isIphone = devManager.isIPhone();
  loginData.istouchIdEnabled = userManager.isTouchIdEnabled();
  loginData.isPinModeEnabled  = userManager.isPinModeEnabled();
  loginData.isFacialAuthEnabled = userManager.isFacialAuthEnabled();
  loginData.isFirstTimeLoginUname=userManager.isFirstTimeLoginUname();
  var navManager = applicationManager.getNavigationManager();
  var nuoData=navManager.getCustomInfo("frmLogin");
  if(nuoData && nuoData.NUOUsername){
    loginData.NUOUsername=nuoData.NUOUsername;
  }
  navManager.setCustomInfo("frmLogin", loginData);
};
ApplicationManager.prototype.getModule = function(moduleName)
{
  if(typeof moduleName === 'string' || moduleName instanceof String){
    var channel = kony.sdk.getChannelType();
    if(channel === "tablet"){
      return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule(moduleName,"Tablet");
    }
    else{
      return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule(moduleName);
    }
  }
};
ApplicationManager.prototype.executeAuthorizationFramework = function (form, key) {
  	PermissionHandler.executeAuthorizationFramework(form, key, FormAuthorizationConfig);
}

ApplicationManager.prototype.getPermissionHandler = function () {
  return PermissionHandler.PermissionHandler;
}

ApplicationManager.prototype.logBrowser = function(params){
      var BrowserRepo  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Browser");
      var onCompletion = function(){
          console.log("########");
      }
      BrowserRepo.customVerb("logBrowser", params, onCompletion);
};

/**
@method - doLogOut
Logs out the application and redirect to login form
@Channel - Web Apps
**/
ApplicationManager.prototype.doLogOut = function() {
   if(kony.os.deviceInfo().name == "thinclient"){
	const moduleName = 'TopbarConfig'; 
   require([moduleName], function(TopbarConfig) {
	   TopbarConfig.config.LOGOUT.onClick();
	});
   }
};

  /**
   * Method to get GuaranteesManager object
   * @returns {object} GuaranteesManager object
   */
  ApplicationManager.prototype.getGuaranteesManager = function () {
    return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({ moduleName: "GuaranteesManager", appName: "TradeFinanceMA" }).businessController;
  };
  /**
   * Method to get GuaranteesReceivedManager object
   * @returns {object} GuaranteesReceivedManager object
   */
  ApplicationManager.prototype.getGuaranteesReceivedManager = function () {
    return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({ moduleName: "GuaranteesReceivedManager", appName: "TradeFinanceMA" }).businessController;
  };
  
  /**
   * Method to get InwardCollectionsManager object
   * @returns {object} InwardCollectionsManager object
   */
  ApplicationManager.prototype.getInwardCollectionsManager = function () {
    return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({ moduleName: "InwardCollectionsManager", appName: "TradeFinanceMA" }).businessController;
  };

  /**
   * Method to get MultiEntityManager object
   * @returns {object} MultiEntityManager object
   */
  ApplicationManager.prototype.getMultiEntityManager = function () {
    return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({ moduleName: "MultiEntityManager", appName: "CommonsMA" }).businessController;
  };

   /**
  * Method to set SBA journey obj
  */
   ApplicationManager.prototype.setSbaJourney = function (sbaJourney) {
     this.sbaJourney = sbaJourney;
   };

   /**
    * Method to get SBA journey obj
    * @returns {array} updatedPartyForSBA
    */
   ApplicationManager.prototype.getSbaJourney = function () {
     if (this.sbaJourney) {
       return this.sbaJourney;
     }
     return "";
   };

   /**
    * Method to set slected SBA business
    */
   ApplicationManager.prototype.setSelectedSbaBusiness = function (selectedSbaBusiness) {
     this.selectedSbaBusiness = selectedSbaBusiness;
   };

   /**
    * Method to get slected SBA business
    * @returns {Object} updatedPartyForSBA
    */
   ApplicationManager.prototype.getSelectedSbaBusiness = function () {
     if (this.selectedSbaBusiness) {
       return this.selectedSbaBusiness;
     }
     return "";
   };

  /**
   * Method to set SBA Enrolled businesses
   */
   ApplicationManager.prototype.setSbaEnrolledBusinesses = function (sbaEnrolledBusinesses) {
     this.sbaEnrolledBusinesses = sbaEnrolledBusinesses;
   };

  /**
    * Method to get Enrolled businesses
    * @returns {Array} sbaEnrolledBusinesses
    */
   ApplicationManager.prototype.getSbaEnrolledBusinesses = function () {
     if (this.sbaEnrolledBusinesses) {
       return this.sbaEnrolledBusinesses;
     }
     return [];
   };

   ApplicationManager.prototype.handleAppService = function(params) {
        const authMode = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
            "moduleName": "AuthUIModule",
            "appName": "AuthenticationMA"
        });
        if (params.launchmode === 3) {
            this.gblDeepLink = "true";
        }
        var authTokenConsent = params.launchparams.token ? params.launchparams.token : params.launchparams.authToken;
        this.deeplinkAppName = params.launchparams.tppName;
        this.consentTypeName = params.launchparams.accountConsentType;//detailed or global
        this.consentType = params.launchparams.consentType;
        this.deeplinkSchemaName = params.launchparams.callbackDeeplinkSchema;
        if (authTokenConsent) {
             authMode.presentationController.validateOpenBankingAuthToken(authTokenConsent);
        }
    };

return ApplicationManager;
});