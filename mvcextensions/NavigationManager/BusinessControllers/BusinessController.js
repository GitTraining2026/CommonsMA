/**
*@module NavigationManager
 */
define(['HashTable'], function(HashTable) {
  /**
   * @class
   */
  function FormCache () {
    this.formStore = {};
  }
  FormCache.prototype.cacheViewModel = function (formName, viewModel) {
    if (this.formStore[formName]) {
      this.formStore[formName].push(viewModel);
    }
    else {
      this.formStore[formName] = [];
      this.formStore[formName].push(viewModel);
    }
  }
  FormCache.prototype.clearFormCache = function (formName) {
    this.formStore[formName] = [];
  }
  FormCache.prototype.applyExistingCacheIfAvailable = function (formName, updateFormUI) {
    if(this.formStore[formName]) {
      while(this.formStore[formName].length !== 0) {
        var viewModel = this.formStore[formName].shift();
        updateFormUI(viewModel);
      }
    }
  }
  FormCache.prototype.getFormCallBack = function (formName) {
    var scope = this;
    return function (controller) {
      scope.applyExistingCacheIfAvailable(formName, controller.updateFormUI);
      scope.clearFormCache();
    }
  }
  /**
   * Navigation Manager consists of all possible methods of forward and backward flow of navigations
   *@alias module:NavigationManager
   *@class
   */
  function NavigationManager() {
    /**@member {Array} stack Contains list of forms*/
    this.stack = [];
    /**@member {object} hashTable it contains all the methods and properties of HashTable class*/
    this.hashTable = new HashTable();
    /**@member {object} entryPointTable it contains all the methods and properties of HashTable class*/
    this.entryPointTable = new HashTable();
    /**@member {object} stackTable it contains all the methods and properties of HashTable class*/
    this.stackTable = new HashTable();
    /**@member {Array} formStack Contains list of forms*/
    this.formStack = [];
    this.formViewModelCache = new FormCache();
    this.currentForm = null;
  }
  inheritsFrom(NavigationManager, kony.mvc.Business.Delegator);
  NavigationManager.prototype.initializeBusinessController = function(){};
  /**
   * Pushes the form in formStack array which contains the Formid
   * @param {string} formName , nothing but FormId
   */
  NavigationManager.prototype.pushForm = function(formName){
    this.formStack.push(formName);
  };
  /**
   * Sets the Entry points with Key and FormId
   * @param {string} flowName , which is key
   * @param {string} formName , which is value
   */
  NavigationManager.prototype.setEntryPoint = function(flowName,formName){
    this.entryPointTable.setItem(flowName,formName);
  };
  /**
   * Get the Entry point based on the Key
   * @param {string} flowName , which is key
   * @return {string} formname
   */
  NavigationManager.prototype.getEntryPoint = function(flowName) {
    return this.entryPointTable.getItem(flowName);
  };
  /**
   * Removes the Entry point based on the Key
   * @param {string} flowName , which is key
   * @return {string} removed formname
   */
  NavigationManager.prototype.removeFlowEntry = function(flowName){
    return this.entryPointTable.removeItem(flowName);
  };
  /**
   * Resets the Entire Entry point Table
   */
  NavigationManager.prototype.clearEntryPointTable = function(){
    this.entryPointTable.items = {};
  };
  /**
   * Sets the Form index in a stack Table with the formId
   * @param {string} formName , which is key
   * @param {string} index , which is value nothing but formIndex
   */
  NavigationManager.prototype.setFormIndex = function(formName,index){
    this.stackTable.setItem(formName,index);
  };
  /**
   * Get the Form index using the key formName
   * @param {string} formName , which is key
   * @return {string} formIndex
   */
  NavigationManager.prototype.getFormIndex = function(formName) {
    return this.stackTable.getItem(formName);
  };
  /**
   * Remove the Form index using the key formName
   * @param {string} formName , which is key
   * @return {string} removed formname
   */
  NavigationManager.prototype.removeFormIndex = function(formName){
    return this.stackTable.removeItem(formName);
  };
  /**
   * Using navigateTo we navigate one form to another form in that we store formName in a stack
   * @param {string} formName , navigates to that form
   * @param {boolean} ignoreExistence , navigate to specified form without inserting entry into stack.
   */
 NavigationManager.prototype.navigateTo = function(formname,ignoreExistence,params) {
    if(!ignoreExistence){
       /*if(this.stack.indexOf(formname)<0){
         this.stack.push(formname);
       }*/
      var stackLength = this.stack.length;
      if(typeof(formname)==="string"||typeof(formname)==="object"){
        if(typeof(formname)==="string"){
          var friendlyName=formname;
        }
        else if(typeof(formname)==="object"){
          var friendlyName=(formname&&formname.appName)?((formname.friendlyName)?formname.appName+"/"+formname.friendlyName:JSON.stringify(formname)):JSON.stringify(formname)
          }
        var index = this.getFormIndex(friendlyName);
        if(index == null){
          this.stack.push(formname);
          this.setFormIndex(friendlyName,stackLength);
        }
        else{
          for(var i=stackLength-1; i>index; i--){
           if(typeof(this.stack[i])=="string")
            this.removeFormIndex(this.stack[i]);
            else if(typeof(this.stack[i])=="object"){
             var formID=(this.stack[i]&&this.stack[i].appName)?((this.stack[i].friendlyName)?this.stack[i].appName+"/"+this.stack[i].friendlyName:JSON.stringify(this.stack[i])):JSON.stringify(this.stack[i])
            this.removeFormIndex(formID)
            }
            this.stack.pop();
          }
        }
      }
    }
    this.formViewModelCache.clearFormCache(formname);
    this.currentForm = formname;
    var ntf = new kony.mvc.Navigation(formname);
     ntf.navigate(params);
  };
  /**
   * Using goBack we navigates to previous form from the current form
   * @param {string} navDetails , which contains all the details about current form
   */
  NavigationManager.prototype.goBack = function(navDetails) {
    var userObj = applicationManager.getUserPreferencesManager();
    var isLoggedin = userObj.isUserLoggedin();
    if(this.getPreviousForm() == "frmLogin"  && isLoggedin){
      var basicProperties =
          {
            "message": applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.common.LogoutConfirmation"),
            "alertType": constants.ALERT_TYPE_CONFIRMATION,
            "alertTitle": "",
            "yesLabel": applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.common.Logout"),
            "noLabel": applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.common.AlertNo"),
            "alertIcon": "",
            "alertHandler": function(response) {
              if(response){
                var authMode = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                  "appName": "AuthenticationMA",
                  "moduleName": "AuthUIModule"
              });
                authMode.presentationController.onLogout();
              }
            }
          };
    applicationManager.getPresentationUtility().showAlertMessage(basicProperties, {});
    }
    else{
      var existingNavDetails, presentNavDetails;
      var stackLength = this.stack.length;
      var currentform = this.stack[stackLength - 1];
      if(typeof(currentform)=="string")
        this.removeFormIndex(currentform);
      else if(typeof(currentform)=="object"){
        var formID=(currentform&&currentform.appName)?((currentform.friendlyName)?currentform.appName+"/"+currentform.friendlyName:JSON.stringify(currentform)):JSON.stringify(currentform)
        this.removeFormIndex(formID)
      }
	//this.removeFormIndex(currentform);
      this.stack.pop();
      stackLength = this.stack.length;
      if (stackLength !== 0) {
        var formId = this.stack[stackLength - 1];
        if (navDetails)
          existingNavDetails = this.getCustomInfo(formId);
        if (existingNavDetails !== undefined) {
          existingNavDetails.backNavDetails = navDetails;
          this.setCustomInfo(formId, existingNavDetails);
        }
        var ntf = new kony.mvc.Navigation(formId);
        ntf.navigate();
      }
    }
  };
  /**
   * Using getCurrentForm get the current existing form
   * @return {string} current formname
   */
  NavigationManager.prototype.getCurrentForm = function(){
    var stackLength = this.stack.length;
    var currentform = this.stack[stackLength - 1];
    return currentform;
  };
  /**
   * Using getPreviousForm we get the previous form
   * @return {string} previous formname
   */
  NavigationManager.prototype.getPreviousForm = function(){
    var stackLength = this.stack.length;
    var previousForm = this.stack[stackLength - 2];
    return previousForm;
  };
  /**
   * Sets data of that form
   * @param {string} key , name of the form
   * @param {string} value , content of the form
   */
  NavigationManager.prototype.setCustomInfo = function(key, value) {
    kony.print("context:"+JSON.stringify(value));
    this.hashTable.setItem(key, value);
  };
  /**
   * Get the data of that form
   * @param {string} key , name of the form
   * @return {string} custom info of form
   */
  NavigationManager.prototype.getCustomInfo = function(key) {
    return this.hashTable.getItem(key);
  };
  /**
   * Resets the entire stack
   */
  NavigationManager.prototype.clearStack = function() {
    this.stack = [];
  };
  /**
   * destroyForms is used to destroy all the existing form in that current application
   */
  NavigationManager.prototype.destroyForms = function() {
    for(var i=0;i<this.formStack.length;i++)
    {
      if(this.formStack[i] !== "frmLogin")
        kony.application.destroyForm(this.formStack[i]);
    }
    this.formStack = [];
    this.formStack.push("frmLogin");
  };

    // [Trixon] Changed destroy Implimentation
    NavigationManager.prototype.destroyFormsAll = function(sender = "") {
        var singleForm = "";
        for (var i = 0; i < this.formStack.length; i++) {
            singleForm = (typeof this.formStack[i] == 'object') ? this.formStack[i].friendlyName : this.formStack[i];
            if(singleForm !== "frmSettings" && singleForm !== "frmLogin") // [Trixon] Removed frmSettings from destroy list to avoid app crash or exception throw, the form will be deleted after navigation
                kony.application.destroyForm(singleForm);
        }
        this.formStack = [];
        if(sender === "languageFromLogin" || sender === "languageFromSettings"){ // [Trixon] Navigation to frmLogout screen to display success message
            scope_AuthPresenter.isLanguageChange = true;
            scope_AuthPresenter.isLogoutScreen = false;
            // if(sender === "languageFromLogin"){
            //     applicationManager.getNavigationManager().clearEntryPointTable();
            //     try{
            //         applicationManager.postAppInitiate();
            //         kony.application.setApplicationProperties({ });
            //         applicationManager.getRegistrationManager().setEventTracking();
            //     }catch(err){ throw GlobalExceptionHandler.addMessageAndActionForException(err, "kony.error.App_Initialisation_Failed", GlobalExceptionHandler.ActionConstants.BLOCK, arguments.callee.name); }
            // }
            applicationManager.getNavigationManager().navigateTo({"appName": "AuthenticationMA","friendlyName": "AuthUIModule/frmLogout"});
        }   
    };
    // [Trixon] End

  NavigationManager.prototype.applyUpdates = function (formController) {
      this.formViewModelCache.applyExistingCacheIfAvailable(formController.view.id, formController.updateFormUI);
      this.formViewModelCache.clearFormCache(formController.view.id);
  }
     /**
     * OLB Specific Method to call updateFormUI in given form -  used to pass data to view controller.
     * @param {object} uiDataMap  key data pair to route binding logic.
     * @param {string} [formName]  form name to navigate - by default it will take current form id.
     */
    NavigationManager.prototype.updateForm = function (uiDataMap, formName, appName) {
      if( typeof formName == 'object'){
        var formToUpdate = formName.friendlyName;
        var appName = formName.appName
        }
      else {
        if(kony.sdk.isNullOrUndefined(formName)) {
			if (typeof this.currentForm == 'object') {
				formToUpdate = this.currentForm.friendlyName;
				appName = this.currentForm.appName;
			}
			else
				formToUpdate = this.currentForm;
			}		
		else {
			formToUpdate = formName;
		}
      }
      if (this.isControllerAvailable(formToUpdate, appName)) {
		if(!kony.sdk.isNullOrUndefined(appName) && appName !== ""){
		var appNameJSON = {
			"appName":appName
		}}
        var currentFormController = _kony.mvc.GetController(formToUpdate, true, appNameJSON);
        if (currentFormController && uiDataMap !== undefined && uiDataMap !== null) {
          currentFormController.updateFormUI(uiDataMap);
        } else {
          applicationManager.getLoggerManager().log("Error while updating form " + (formToUpdate + " with data " + uiDataMap));
        }
      }
      else {
        this.formViewModelCache.cacheViewModel(formToUpdate, uiDataMap);
        // _kony.mvc.GetControllerAsync(formToUpdate, this.formViewModelCache.getFormCallBack(formToUpdate));
      }
    };
	
	NavigationManager.prototype.isControllerAvailable = function (formFriendlyName,appName) {
    var ctrlName = null,
    tmpFormName = null,
    formID = formFriendlyName,
    returnFlag = false;
	var viewName2viewIdMap = _kony.mvc.getViewName2viewIdMap(appName);
	var ctrlName2ControllerMap = _kony.mvc.getControllerName2ControllerMap(appName);
	var viewId2ControllerNameMap = _kony.mvc.getViewId2ControllerNameMap(appName);	
    tmpFormName = kony.mvc.registry.get(formID,appName);
    if (null != tmpFormName)
        formID = tmpFormName;
    if (formID in viewName2viewIdMap) {
        formID = viewName2viewIdMap[formID]
    }
    if (null != formID) {
        if (formID in viewId2ControllerNameMap) {
            ctrlName = viewId2ControllerNameMap[formID];
            if (ctrlName in ctrlName2ControllerMap) {
                returnFlag = true
            }
        }
    }
    return returnFlag
};
  return NavigationManager;
});