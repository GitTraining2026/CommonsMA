define([], function() {
  function TypeManager() {
     this.initialiseAccountTypeManager();
//     this.initialiseTransactionTypeManager();
//     this.initialisePfmTypeManager();
  }
  TypeManager.prototype.initialiseAccountTypeManager = function() {
    /* Holds the list of accountType keys used by the application based on the priority */
    this.accountTypes = [];
    /* Holds accountType meta data indexed by the key being used by the application
       Value is the meta data, a json with key 'backendValue' and 'displayValue' */
    this.accountTypesMap = {};
    /* Holds accountType meta data indexed by the key being used in the backend
       Value is the meta data, a json with key 'applicationValue' and 'displayValue' */
    this.accountTypesBackendMap = {};
    this.accountTypeMetaData = applicationManager.getConfigurationManager().getAccountTypesMetaData();
    this.initializeAccountMetaData(this.accountTypeMetaData);
  }
  /**
 * Initializes the necessary data structure maps to support accountType queries.
 * First it initializes the accountTypes array that signifies the priority of these types. It is assumed that the input array indicates this priority
 * Secondly it initializes the accountTypesMap to retrieve accountTypes based on the keys used by the application
 * Thirdly it initializes the accountTypesBackendMap to retrieve accountTypes based on the backend key values
 * @member of AccountTypeManager
 * @param {accountTypeMetaData} array of jsons wiht keys 'applicationValue', 'backendValue' and 'displayValue'.
 */
  TypeManager.prototype.initializeAccountMetaData = function(accountTypeMetaData){
    if(accountTypeMetaData && accountTypeMetaData.length > 0){
      for (var i=0; i<accountTypeMetaData.length; i++){
        this.accountTypes.push(accountTypeMetaData[i].applicationValue);
        this.accountTypesMap[accountTypeMetaData[i].applicationValue] = {};
        this.accountTypesMap[accountTypeMetaData[i].applicationValue].backendValue = accountTypeMetaData[i].backendValue;
        this.accountTypesMap[accountTypeMetaData[i].applicationValue].displayValue = accountTypeMetaData[i].displayValue;
        this.accountTypesBackendMap[accountTypeMetaData[i].backendValue]={};
        this.accountTypesBackendMap[accountTypeMetaData[i].backendValue].applicationValue = accountTypeMetaData[i].applicationValue;
        this.accountTypesBackendMap[accountTypeMetaData[i].backendValue].displayValue = accountTypeMetaData[i].displayValue;
      }
    }
  }
  /**
 * Provides a list of account type keys being used by the application based on its priority.
 * @member of AccountTypeManager
 * @returns {accountTypes} array containing the accountType keys being used by the application based on priority.
 */
  TypeManager.prototype.getAccountTypesByPriority = function(){
    return this.accountTypes;
  }
  /**
 * Provides the backend value for the associated account type.
 * @member of AccountTypeManager
 * @returns {String} backend value for the corressponding account type.
 */
  TypeManager.prototype.getAccountTypeBackendValue = function(applicationValue){
    if(this.accountTypesMap.hasOwnProperty(applicationValue))
      return this.accountTypesMap[applicationValue].backendValue;
    return null;
  }
  /**
 * Provides the display value for the associated account type.
 * @member of AccountTypeManager
 * @returns {String} display value for the corressponding account type.
 */
  TypeManager.prototype.getAccountTypeDisplayValue = function(applicationValue){
    if(this.accountTypesMap.hasOwnProperty(applicationValue)){
      var displayValue = kony.i18n.getLocalizedString(this.accountTypesMap[applicationValue].displayValue);
      return displayValue;
    }
    return null;
  }
  /**
 * Provides the application account type value for the associated backend account type.
 * @member of AccountTypeManager
 * @returns {String} account type value for the corressponding backend account type.
 */
  TypeManager.prototype.getAccountType = function(backendValue){
    if(this.accountTypesBackendMap.hasOwnProperty(backendValue))
      return this.accountTypesBackendMap[backendValue].applicationValue;
    return 'Other';
  }
  TypeManager.prototype.initialiseTransactionTypeManager = function() {
    /* Holds the list of transactionType keys used by the application based on the priority */
    this.transactionTypes = [];
    /* Holds transactionType meta data indexed by the key being used by the application
       Value is the meta data, a json with key 'backendValue' and 'displayValue' */
    this.transactionTypesMap = {};
    /* Holds transactionType meta data indexed by the key being used in the backend
       Value is the meta data, a json with key 'applicationValue' and 'displayValue' */
    this.transactionTypesBackendMap = {};
    this.transactionTypeMetaData = applicationManager.getConfigurationManager().getTransactionTypesMetaData();
    this.initializeTransactionMetaData(this.transactionTypeMetaData);
  }
  /**
 * Initializes the necessary data structure maps to support transactionType queries.
 * First it initializes the transactionTypes array that signifies the priority of these types. It is assumed that the input array indicates this priority
 * Secondly it initializes the transactionTypesMap to retrieve transactionTypes based on the keys used by the application
 * Thirdly it initializes the transactionTypesBackendMap to retrieve transactionTypes based on the backend key values
 * @member of TransactionTypeManager
 * @param {transactionTypeMetaData} array of jsons wiht keys 'applicationValue', 'backendValue' and 'displayValue'.
 */
  TypeManager.prototype.initializeTransactionMetaData = function(transactionTypeMetaData){
    if(transactionTypeMetaData && transactionTypeMetaData.length > 0){
      for (var i=0; i<transactionTypeMetaData.length; i++){
        this.transactionTypes.push(transactionTypeMetaData[i].applicationValue);
        this.transactionTypesMap[transactionTypeMetaData[i].applicationValue] = {};
        this.transactionTypesMap[transactionTypeMetaData[i].applicationValue].backendValue = transactionTypeMetaData[i].backendValue;
        this.transactionTypesMap[transactionTypeMetaData[i].applicationValue].displayValue = transactionTypeMetaData[i].displayValue;
        this.transactionTypesBackendMap[transactionTypeMetaData[i].backendValue]={};
        this.transactionTypesBackendMap[transactionTypeMetaData[i].backendValue].applicationValue = transactionTypeMetaData[i].applicationValue;
        this.transactionTypesBackendMap[transactionTypeMetaData[i].backendValue].displayValue = transactionTypeMetaData[i].displayValue;
      }
    }
  }
  /**
 * Provides a list of transaction type keys being used by the application based on its priority.
 * @member of TransactionTypeManager
 * @returns {transactionTypes} array containing the transactionType keys being used by the application based on priority.
 */
  TypeManager.prototype.getTransactionTypesByPriority = function(){
    return this.transactionTypes;
  }
  /**
 * Provides the backend value for the associated transaction type.
 * @member of TransactionTypeManager
 * @returns {String} backend value for the corressponding transaction type.
 */
  TypeManager.prototype.getTransactionTypeBackendValue = function(applicationValue){
    if(this.transactionTypesMap.hasOwnProperty(applicationValue))
      return this.transactionTypesMap[applicationValue].backendValue;
    return null;
  }
  /**
 * Provides the display value for the associated transaction type.
 * @member of TransactionTypeManager
 * @returns {String} display value for the corressponding transaction type.
 */
  TypeManager.prototype.getTransactionTypeDisplayValue = function(applicationValue){
    if(this.transactionTypesMap.hasOwnProperty(applicationValue))
      return this.transactionTypesMap[applicationValue].displayValue;
    return null;
  }
  /**
 * Provides the application transaction type value for the associated backend transaction type.
 * @member of TransactionTypeManager
 * @returns {String} transaction type value for the corressponding backend transaction type.
 */
  TypeManager.prototype.getTransactionType = function(backendValue){
    if(this.transactionTypesBackendMap.hasOwnProperty(backendValue))
      return this.transactionTypesBackendMap[backendValue].applicationValue;
    return null;
  }
  TypeManager.prototype.initialisePfmTypeManager = function() {
    /* Holds the list of pfmType keys used by the application based on the priority */
    this.pfmTypes = [];
    /* Holds pfmType meta data indexed by the key being used by the application
       Value is the meta data, a json with key 'backendValue' and 'displayValue' */
    this.pfmTypesMap = {};
    /* Holds pfmType meta data indexed by the key being used in the backend
       Value is the meta data, a json with key 'applicationValue' and 'displayValue' */
    this.pfmTypesBackendMap = {};
    this.pfmTypeMetaData = applicationManager.getConfigurationManager().getPfmTypesMetaData();
    this.initializePfmMetaData(this.pfmTypeMetaData);
  }
  /**
 * Initializes the necessary data structure maps to support pfmType queries.
 * First it initializes the pfmTypes array that signifies the priority of these types. It is assumed that the input array indicates this priority
 * Secondly it initializes the pfmTypesMap to retrieve pfmTypes based on the keys used by the application
 * Thirdly it initializes the pfmTypesBackendMap to retrieve pfmTypes based on the backend key values
 * @member of PfmTypeManager
 * @param {pfmTypeMetaData} array of jsons wiht keys 'applicationValue', 'backendValue' and 'displayValue'.
 */
  TypeManager.prototype.initializePfmMetaData = function(pfmTypeMetaData){
    if(pfmTypeMetaData && pfmTypeMetaData.length > 0){
      for (var i=0; i<pfmTypeMetaData.length; i++){
        this.pfmTypes.push(pfmTypeMetaData[i].applicationValue);
        this.pfmTypesMap[pfmTypeMetaData[i].applicationValue] = {};
        this.pfmTypesMap[pfmTypeMetaData[i].applicationValue].backendValue = pfmTypeMetaData[i].backendValue;
        this.pfmTypesMap[pfmTypeMetaData[i].applicationValue].displayValue = pfmTypeMetaData[i].displayValue;
        this.pfmTypesBackendMap[pfmTypeMetaData[i].backendValue]={};
        this.pfmTypesBackendMap[pfmTypeMetaData[i].backendValue].applicationValue = pfmTypeMetaData[i].applicationValue;
        this.pfmTypesBackendMap[pfmTypeMetaData[i].backendValue].displayValue = pfmTypeMetaData[i].displayValue;
      }
    }
  }
  /**
 * Provides a list of pfm type keys being used by the application based on its priority.
 * @member of PfmTypeManager
 * @returns {pfmTypes} array containing the pfmType keys being used by the application based on priority.
 */
  TypeManager.prototype.getPfmTypesByPriority = function(){
    return this.pfmTypes;
  }
  /**
 * Provides the backend value for the associated pfm type.
 * @member of PfmTypeManager
 * @returns {String} backend value for the corressponding pfm type.
 */
  TypeManager.prototype.getPfmTypeBackendValue = function(applicationValue){
    if(this.pfmTypesMap.hasOwnProperty(applicationValue))
      return this.pfmTypesMap[applicationValue].backendValue;
    return null;
  }
  /**
 * Provides the display value for the associated pfm type.
 * @member of PfmTypeManager
 * @returns {String} display value for the corressponding pfm type.
 */
  TypeManager.prototype.getPfmTypeDisplayValue = function(applicationValue){
    if(this.pfmTypesMap.hasOwnProperty(applicationValue))
      return this.pfmTypesMap[applicationValue].displayValue;
    return null;
  }
  /**
 * Provides the application pfm type value for the associated backend pfm type.
 * @member of PfmTypeManager
 * @returns {String} pfm type value for the corressponding backend pfm type.
 */
  TypeManager.prototype.getPfmType = function(backendValue){
    if(this.pfmTypesBackendMap.hasOwnProperty(backendValue))
      return this.pfmTypesBackendMap[backendValue].applicationValue;
    return null;
  }
  return TypeManager;
});