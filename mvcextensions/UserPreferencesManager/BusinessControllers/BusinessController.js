/**
 * userPreferencesManager class contain all the function related to user APIs
 *@module userPreferencesManager
 */
define(['OLBConstants','SCAConfiguration','CommonUtilities','DataPrivacy'], function(OLBConstants,SCAConfiguration,CommonUtilities,DataPrivacy) {
    /**
     *userPreferencesManager class contain all the function related to user APIs
     * @alias module:userPreferencesManager
     * @class
     */
    function userPreferencesManager() {
        /**@member {object} settings used to hold the authentication settings and user related settings*/
        this.settings = {
            "rememberMeFlag": true,
            "touchIDEnabledFlag": false,
            "accountPreviewEnabledFlag": false,
            "isPinEnabledFlag": false,
            "isFacialAuthEnabledFlag": false,
            "defaultLoginMode": "password",
            "deviceRegisterFlag": false,
            "defaultScreenEnum": "frmAccountsLandingKA",
            "DefaultTransferAcctNo": "",
            "DefaultDepositAcctNo": "",
            "DefaultPaymentAcctNo": "",
            "DefaultCardlessAcctNo": "",
            "alerts": false
        };
        /**@member {object} response used to hold the response data*/
        this.response = {};
        /**@member {object} userObj used to hold the user related information*/
        this.userObj = null;
        /**@member {object} userImage used to hold the user image information in base64*/
        this.userImage = null;
        /**@member {boolean} isLoggedIn used to hold whether the user is logged in or not*/
        this.isLoggedIn = false;
        /**@member {Array} cards used to hold the cards related information of the user*/
        this.cards = [];
        /**@member {Array} userPhoneNumbers used to hold the user phone numbers*/
        this.userPhoneNumbers = [];
        /**@member {Array} userAddresses used to hold the user addresses*/
        this.userAddresses = [];
        var modelDefinition = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Users");
        /**@member {object} userAddressObject used to hold the user object related information*/
        this.userEntitlementsAddresses = [];
        this.userEntitlementsContactNumbers = [];
        this.userEntitlementsEmailIds = [];
        this.userAddressObject = new modelDefinition();
         this.tempUserName = "";
         this.passwordWarning = "";
         this.backendIdentifier="";
      	this.locationDetails={};
		this.isSingleCustomerProfile = true;
        this.accessibleCustomerIds = [];
        this.primaryCustomerId = "";
		this.profileAccess = "";
    }
    inheritsFrom(userPreferencesManager, kony.mvc.Business.Delegator);
    userPreferencesManager.prototype.initializeBusinessController = function() {};
    /**
     * set enroll Attribute
     */
    userPreferencesManager.prototype.setuserAddressAttribute = function(key, value) {
        this.userAddressObject[key] = value;
    };
    /**
     * get enroll obj.
     */
    userPreferencesManager.prototype.getuserAddressObject = function() {
        return this.userAddressObject;
    };
  /**
     * set  BackendIdentifier.
     */
    userPreferencesManager.prototype.setBackendIdentifier = function(value) {
        this.backendIdentifier = value;
    };
   /**
     * get BackendIdentifier.
     */
    userPreferencesManager.prototype.getBackendIdentifier = function() {
        return this.backendIdentifier;
    };
    /**
     * reset enroll obj.
     */
    userPreferencesManager.prototype.clearUserAddressData = function() {
        var modelDefinition = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Users");
        this.userAddressObject = new modelDefinition();
    };
    /**
     * Gives info about user Login
     * @returns {boolean} - whether user is Logged in or not
     */
    userPreferencesManager.prototype.isUserLoggedin = function() {
        return this.isLoggedIn === true ? true : false;
    };
    /**
 * Deciphers user data which is ciphered
 * @param {string} key 
 * @param {string} data 
 */
    userPreferencesManager.prototype.dataPrivacyFetchUser = function (key, iv, data) {
        let scopeObj = this;
        try{
            data['ssn'] = data['ssn'] && data['ssn'].length > 0 ? DataPrivacy.decrypt(key, iv, data['ssn']) : data['ssn'];
            data['dateOfBirth'] = data['dateOfBirth'] && data['dateOfBirth'].length > 0 ? DataPrivacy.decrypt(key, iv, data['dateOfBirth']) : data['dateOfBirth'];
            data['phone'] = data['phone'] && data['phone'].length > 0 ? DataPrivacy.decrypt(key, iv, data['phone']) : data['phone'];
            data['email'] = data['email'] && data['email'].length > 0 ? DataPrivacy.decrypt(key, iv, data['email']) : data['email'];


            if(data['EmailIds'] && data['EmailIds'].length > 0)
                scopeObj.decryptArray(key, iv, data['EmailIds']);
            if(data['ContactNumbers'] && data['ContactNumbers'].length > 0)
                scopeObj.decryptArray(key, iv, data['ContactNumbers']);
            if(data['Addresses'] && data['Addresses'].length > 0)
                scopeObj.decryptArray(key, iv, data['Addresses']);
        }catch(err){}
    };
    /**
     * Helper method to decipher array data
        * @param {string} key 
        * @param {Array} array
     */
    userPreferencesManager.prototype.decryptArray = function (key, iv, array) {
        for (object of array) {
            for (jsonKey in object) {
                object[jsonKey] = DataPrivacy.decrypt(key, iv, object[jsonKey]);
            }
        }
    };
    /**
     * fetches the User Details using a service call.
     * @param {function} presentationSuccessCallback - invoke the call back with success response.
     * @param {function} presentationErrorCallback - invoke the call back with error response.
     */
   userPreferencesManager.prototype.fetchUser = function(presentationSuccess, presentationError) {
        var  userProfile  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Users");
        var scope = this;
        var clientProperties = Object.keys(CommonUtilities.CLIENT_PROPERTIES).length > 0 ? CommonUtilities.CLIENT_PROPERTIES :  OLBConstants.CLIENT_PROPERTIES
        let isPrivate = clientProperties['E2E_ENCRYPTION_ENABLED'];
        if(!kony.sdk.isNullOrUndefined(isPrivate))
            isPrivate = isPrivate.toLowerCase() === 'true' ? true : false;
        else isPrivate = false;
        if (isPrivate) {
            var key = clientProperties['E2E_ENCRYPTION_KEY'];
            var iv = clientProperties['E2E_ENCRYPTION_VECTOR'];
        }
        userProfile.getAll(getAllCompletionCallback);
        function  getAllCompletionCallback(status,  data,  error) {
			var profiles = [];
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status,  data,  error, presentationSuccess, presentationError);
			scope.userEntitlementsAddresses=[];
            if (obj["status"] === true) {
                if(key) {
                    scope.dataPrivacyFetchUser(key, iv, obj["data"][0]);
                }
                if (kony.sdk.isNullOrUndefined(obj["data"][0]["CoreCustomers"]))
                    obj["data"][0]["CoreCustomers"] = applicationManager.getConfigurationManager().coreCustomers;
                let loginUserObj = scope.getUserObj();

                // [Trixon] set the whole data object of the response to "userObj" instead of the 1st index to avoid data miss
                    // let userObj = obj["data"][0];
                    // loginUserObj.Addresses = userObj.Addresses;
                    // loginUserObj.ContactNumbers = userObj.ContactNumbers;
                    // loginUserObj.EmailIds = userObj.EmailIds;
                let userObj = obj["data"];
                loginUserObj.Addresses = (!kony.sdk.isNullOrUndefined(userObj[0].Addresses) && (userObj[0].Addresses).length !== 0) ? userObj[0].Addresses : (!kony.sdk.isNullOrUndefined(userObj[1].Addresses) && (userObj[1].Addresses).length !== 0) ? userObj[1].Addresses : userObj[2].Addresses;
                loginUserObj.ContactNumbers = (!kony.sdk.isNullOrUndefined(userObj[0].ContactNumbers) && (userObj[0].ContactNumbers).length !== 0) ? userObj[0].ContactNumbers : (!kony.sdk.isNullOrUndefined(userObj[1].ContactNumbers) && (userObj[1].ContactNumbers).length !== 0) ? userObj[1].ContactNumbers : userObj[2].ContactNumbers;
                loginUserObj.EmailIds = (!kony.sdk.isNullOrUndefined(userObj[0].EmailIds) && (userObj[0].EmailIds).length !== 0) ? userObj[0].EmailIds : (!kony.sdk.isNullOrUndefined(userObj[1].EmailIds) && (userObj[1].EmailIds).length !== 0) ? userObj[1].EmailIds : userObj[2].EmailIds;
                scope.setUserObj([loginUserObj]);

                 if (obj["data"][0]["EmailIds"]&&obj["data"][0]["EmailIds"].length > 0)
                    scope.userEntitlementsEmailIds = obj["data"][0]["EmailIds"];
                if (obj["data"][0]["ContactNumbers"]&&obj["data"][0]["ContactNumbers"].length > 0)
                    scope.userEntitlementsContactNumbers = obj["data"][0]["ContactNumbers"];
                if (obj["data"][0]["isSecurityQuestionConfigured"])
                    scope.isSecurityQuestionConfigured = true;
                if (obj["data"][0]["Addresses"])
                    scope.userEntitlementsAddresses = obj["data"][0]["Addresses"];
				if (obj["data"][0]["CoreCustomers"]){
                  scope.accessibleCustomerIds = [];
                  var filteredCoreCustomers = filterDuplicateCoreCustomers(obj["data"][0]["CoreCustomers"]);
                  if(filteredCoreCustomers && filteredCoreCustomers!= undefined && filteredCoreCustomers.length>0){
                    scope.isSingleCustomerProfile = filteredCoreCustomers.length > 1 ? false : true;
                    filteredCoreCustomers.forEach(function(item){
                        scope.accessibleCustomerIds.push({
                            id : item.coreCustomerID,
                            type : item.isBusiness === "true" ? 'business' : 'personal',
                            name : item.coreCustomerName || "",
                            contractId : item.contractId || "",
                            contractName : item.contractName || ""
                        });
                        if(item.isPrimary === "true")
                        scope.primaryCustomerId = {
                            id : item.coreCustomerID,
                            type : item.isBusiness === "true" ? 'business' : 'personal',
                            name : item.coreCustomerName || "",
                            contractId : item.contractId || "",
                            contractName : item.contractName || ""
                        }
                    });
                    scope.accessibleCustomerIds.forEach(function(item){
                        if(!profiles.includes(item.type))
                        profiles.push(item.type);
                    });
                  }else{
                    scope.accessibleCustomerIds.push({
                        "id" : scope.getUserId()
                    })
                  }                  
                  if(profiles.length>1)
                    scope.profileAccess = "both";
                  else
                    scope.profileAccess = profiles[0];
                }
                presentationSuccess(obj["data"]);
            } else {
                presentationError(obj["errmsg"]);
            }
        }

     function filterDuplicateCoreCustomers (data) {
       try {
         const arr = data;
         var result = arr.reduce((unique, o) => {
           if(!unique.some(obj => obj.coreCustomerID === o.coreCustomerID && obj.coreCustomerName === o.coreCustomerName &&
                           obj.isBusiness === o.isBusiness && obj.isPrimary === o.isPrimary &&
                           obj.contractId === o.contractId  && obj.contractName === o.contractName 
                          )) {
             unique.push(o);
           }
           return unique;
         },[]);
         return result;
       } catch (e) {
         return data;
       }
     }
    };

    /**
     * fetches the User Details using a service call.
     * @param {function} presentationSuccessCallback - invoke the call back with success response.
     * @param {function} presentationErrorCallback - invoke the call back with error response.
     */
    userPreferencesManager.prototype.fetchLoginUser = function(presentationSuccess, presentationError) {
        var  userProfile  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Users");
        var scope = this;
        var clientProperties = Object.keys(CommonUtilities.CLIENT_PROPERTIES).length > 0 ? CommonUtilities.CLIENT_PROPERTIES :  OLBConstants.CLIENT_PROPERTIES
        let isPrivate = clientProperties['E2E_ENCRYPTION_ENABLED'];
        if(!kony.sdk.isNullOrUndefined(isPrivate))
            isPrivate = isPrivate.toLowerCase() === 'true' ? true : false;
        else isPrivate = false;
        if (isPrivate) {
            var key = clientProperties['E2E_ENCRYPTION_KEY'];
            var iv = clientProperties['E2E_ENCRYPTION_VECTOR'];
        }
        userProfile.customVerb('getLoginuser',{},getAllCompletionCallback);
        function  getAllCompletionCallback(status,  data,  error) {
			var profiles = [];
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status,  data,  error, presentationSuccess, presentationError);
            if (obj["status"] === true) {
                if(key) {
                    scope.dataPrivacyFetchUser(key, iv, obj["data"]["user"][0]);
                }
                scope.setUserObj(obj["data"]["user"]);
                 if (obj["data"]["user"][0]["EmailIds"]&&obj["data"]["user"][0]["EmailIds"].length > 0)
                    scope.userEntitlementsEmailIds = obj["data"]["user"][0]["EmailIds"];
                if (obj["data"]["user"][0]["ContactNumbers"]&&obj["data"]["user"][0]["ContactNumbers"].length > 0)
                    scope.userEntitlementsContactNumbers = obj["data"]["user"][0]["ContactNumbers"];
                if (obj["data"]["user"][0]["isSecurityQuestionConfigured"])
                    scope.isSecurityQuestionConfigured = true;
                if (obj["data"]["user"][0]["Addresses"])
                    scope.userEntitlementsAddresses = obj["data"]["user"][0]["Addresses"];
				if (obj["data"]["user"][0]["CoreCustomers"]){
                    scope.accessibleCustomerIds = [];
                    var filteredCoreCustomers = filterDuplicateCoreCustomers(obj["data"]["user"][0]["CoreCustomers"]);
                    applicationManager.getConfigurationManager().coreCustomers = filteredCoreCustomers;
                    if(filteredCoreCustomers && filteredCoreCustomers!= undefined && filteredCoreCustomers.length>0){
                      scope.isSingleCustomerProfile = filteredCoreCustomers.length > 1 ? false : true;
                      filteredCoreCustomers.forEach(function(item){
                          scope.accessibleCustomerIds.push({
                              id : item.coreCustomerID,
                              type : item.isBusiness === "true" ? 'business' : 'personal',
                              name : item.coreCustomerName || "",
                              contractId : item.contractId || "",
                              contractName : item.contractName || ""
                          });
                          if(item.isPrimary === "true")
                          scope.primaryCustomerId = {
                              id : item.coreCustomerID,
                              type : item.isBusiness === "true" ? 'business' : 'personal',
                              name : item.coreCustomerName || "",
                              contractId : item.contractId || "",
                              contractName : item.contractName || ""
                          }
                      });
                      scope.accessibleCustomerIds.forEach(function(item){
                          if(!profiles.includes(item.type))
                          profiles.push(item.type);
                      });
                    }else{
                      scope.accessibleCustomerIds.push({
                          "id" : scope.getUserId()
                      })
                    }                  
                    if(profiles.length>1)
                      scope.profileAccess = "both";
                    else
                      scope.profileAccess = profiles[0];
                  }
                presentationSuccess(obj["data"]["user"]);
            } else {
                presentationError(obj["errmsg"]);
            }
        }

        function filterDuplicateCoreCustomers (data) {
            try {
              const arr = data;
              var result = arr.reduce((unique, o) => {
                if(!unique.some(obj => obj.coreCustomerID === o.coreCustomerID && obj.coreCustomerName === o.coreCustomerName &&
                                obj.isBusiness === o.isBusiness && obj.isPrimary === o.isPrimary &&
                                obj.contractId === o.contractId  && obj.contractName === o.contractName 
                               )) {
                  unique.push(o);
                }
                return unique;
              },[]);
              return result;
            } catch (e) {
              return data;
            }
          }
    };

     /**
     * fetches the User image using a service call.
     * @param {function} presentationSuccessCallback - invoke the call back with success response.
     * @param {function} presentationErrorCallback - invoke the call back with error response.
     */
    userPreferencesManager.prototype.fetchUserImage = function (presentationSuccess, presentationError) {
        var scope = this;
        var userProfile = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Users");
        var clientProperties = Object.keys(CommonUtilities.CLIENT_PROPERTIES).length > 0 ? CommonUtilities.CLIENT_PROPERTIES : OLBConstants.CLIENT_PROPERTIES;
        let isProfileImageEnabled = clientProperties['IS_PROFILE_IMAGE_ENABLED'];
        if (!kony.sdk.isNullOrUndefined(isProfileImageEnabled))
            isProfileImageEnabled = isProfileImageEnabled.toLowerCase() === 'true' ? true : false;
        else
            isProfileImageEnabled = false;
        if (isProfileImageEnabled) {
            userProfile.customVerb('getUserProfileImage', {}, getAllCompletionCallback);
        }
        else {
            presentationError("Profile image service is skipped.");
        }
        function getAllCompletionCallback(status, data, error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status, data, error, presentationSuccess, presentationError);
            if (obj["status"] === true) {
                scope.setUserImage(obj["data"]["userImage"]);
                presentationSuccess(obj["data"]);
            } else {
                presentationError(obj["errmsg"]);
            }
        }
    };

    /**
     * Gets user image to data store
     * @returns {String} -  returns string
     */
    userPreferencesManager.prototype.getUserImage = function() {
        if (this.userImage)
            return this.userImage;
        else
            return "";
    };
    /**
     * Updates the details
     */
     userPreferencesManager.prototype.getUpdatedAddressDetails = function (param, presentationSuccessCallback, presentationErrorCallback) {
        var userObj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ExternalUsers");
        userObj.customVerb('UpdateAddressWithProof', param, getCompletionCallback);
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
      * 
      * @param {status} imageURL - contains the message from the service request 
    */
     userPreferencesManager.prototype.getRequestStatus = function (params, presentationSuccessCallback, presentationErrorCallback) {
        var userObj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ExternalUsers");
        userObj.customVerb('geRequestStatus', params , getCompletionCallback);
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
     * sets the  profile image for user.
     * @param {boolean} imageURL - contains the state of isP2PActivated flag.
     */
    userPreferencesManager.prototype.setUserImage = function(imageURL) {
        this.userImage = imageURL;
    };
    userPreferencesManager.prototype.showPasswordResetWarning = function (params, presentationSuccess, presentationError) {
        var scope = this;
        var userObj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Users_2");
        userObj.customVerb('getPasswordLockoutSettings', params, getAllCompletionCallback);
        function getAllCompletionCallback(status, data, error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status, data, error, presentationSuccess, presentationError);
            if (CommonUtilities.getSCAType() == 1) {
                obj["status"] = true;
            }
            if (obj["status"] === true) {
                scope.setPasswordWarning(data);
                presentationSuccess(obj["data"]);
            } else {
                presentationError(obj["errmsg"]);
            }
        }
    };
   userPreferencesManager.prototype.setPasswordWarning = function(data) {
      this.passwordWarning =data.passwordlockoutsettings;
    };
   userPreferencesManager.prototype.getPasswordWarning = function(data) {
      return this.passwordWarning ;
    };
  userPreferencesManager.prototype.setSettingsObject = function() {
        var sm = applicationManager.getStorageManager();
        sm.setStoredItem("settingsObject", this.settings);
    };
    /**
     * helps to setUsersetting Object
     */
    userPreferencesManager.prototype.setSettingsObject = function() {
        var sm = applicationManager.getStorageManager();
        sm.setStoredItem("settingsObject", this.settings);
    };
    /**
     * Gives info about rememberMe flag
     * @returns {boolean} - whether RememberMe is  on/off.
     */
    userPreferencesManager.prototype.isRememberMeOn = function() {
        var sm = applicationManager.getStorageManager();
        var value = sm.getStoredItem("settingsObject");
        return value.rememberMeFlag === true ? true : false;
    };
    /**
     * Gives info about user enrollment
     * @returns {boolean} - whether user is enrolled or not
     */
    userPreferencesManager.prototype.isUserEnrolled = function() {
        return this.getUserObj().isEnrolled ? this.getUserObj().isEnrolled : "";
    };
    /**
     * Gets infor about pin set
     * @returns {Boolean} -  returns wheter pin is set or not
     */
    userPreferencesManager.prototype.isPinSet = function() {
        return this.getUserObj().isPinSet == "true" ? true : false;
    };
    /**
     * Gets info of whether to show set default billpay from account popup
     * @returns {Boolean} -  returns wheter to show set default billpay from account popup
     */
    userPreferencesManager.prototype.isSetAccountPopupEnabled = function() {
        return this.getUserObj().showBillPayFromAccPopup == true ? true : false;
    };
    /**
     * Gets infor about device registration
     * @returns {Boolean} -  returns wheter device is registered or not
     */
   userPreferencesManager.prototype.isDeviceRegistered = function(){
  var sm=applicationManager.getStorageManager();
  var value=sm.getStoredItem("settingsObject");
  if (value)
    return value.deviceRegisterFlag==true ? true:false;
  else
    return false;
};
    /**
     * Gives info Whether it is first time log in or not
     * @returns {boolean} - whether it FirstTimeLogin is  on/off.
     */
    userPreferencesManager.prototype.isFirstTimeLogin = function() {
        var sm = applicationManager.getStorageManager();
        if (sm.getStoredItem("firstTimeLogin") === null || sm.getStoredItem("firstTimeLogin") === "")
            return true;
        else
            return false;
    };
     /**
     * Gives info Whether it is first time log in or not for username displayed on login form
     * @returns {boolean} - whether it FirstTimeLogin is  on/off.
     */
    userPreferencesManager.prototype.isFirstTimeLoginUname = function() {
        var sm = applicationManager.getStorageManager();
        if (sm.getStoredItem("firstTimeLoginUname") === null || sm.getStoredItem("firstTimeLoginUname") === "")
            return true;
        else
            return false;
    };
    /**
     * Gives info Whether TouchID is enabled in it or not
     * @returns {boolean} - whether it FirstTimeLogin is  on/off.
     */
    userPreferencesManager.prototype.isTouchIdEnabled = function() {
        var sm = applicationManager.getStorageManager();
        var value = sm.getStoredItem("settingsObject");
        return value.touchIDEnabledFlag === true ? true : false;
    };
    /**
     * Gives info Whether FaceAuthentication is enabled in device or not
     * @returns {boolean} - whether FacialAuth is Enabled or not.
     */
    userPreferencesManager.prototype.isFacialAuthEnabled = function() {
        var sm = applicationManager.getStorageManager();
        var value = sm.getStoredItem("settingsObject");
        return value.isFacialAuthEnabledFlag === true ? true : false;
    };
    /**
     * Gives info Whether Pin Mode is enabled  it or not
     * @returns {boolean} - whether PinMode is Enabled or not.
     */
    userPreferencesManager.prototype.isPinModeEnabled = function() {
        var sm = applicationManager.getStorageManager();
        var value = sm.getStoredItem("settingsObject");
        return value.isPinEnabledFlag === true ? true : false;
    };
    /**
     * Gives info Whether AccountPreview is enabled  it or not
     * @returns {boolean} - whether AccountPreview is Enabled or not.
     */
    userPreferencesManager.prototype.isAccountPreviewEnabled = function() {
        var sm = applicationManager.getStorageManager();
        var value = sm.getStoredItem("settingsObject");
        return value.accountPreviewEnabledFlag === true ? true : false;
    };
    /**
     * Updates Flags with boolean values
     * @param {String} Value - What is to be updated for DeviceRegisteredFlag
     */
    userPreferencesManager.prototype.updateDeviceRegisterFlag = function(value) {
        this.updateUserFlag("deviceRegisterFlag", value);
    };
    /**
     * Updates Flags with boolean values
     * @param {String} feature - What value is to be updated
     * @param {String} Value - What is to be updated
     */
    userPreferencesManager.prototype.updateUserFlag = function(feature, Value) {
        var sm = applicationManager.getStorageManager();
        var deviceFlagData = sm.getStoredItem("settingsObject");
        deviceFlagData[feature] = Value;
        //sm.getStoredItem("settingsObject").feature=value;
        sm.setStoredItem("settingsObject", deviceFlagData);
    };
    /**
     * Updates Flags with boolean values
     * @param {String} Value - What is to be updated for rememberFlag
     */
    userPreferencesManager.prototype.updateRememberMeFlag = function(value) {
        this.updateUserFlag("rememberMeFlag", value);
    };
    /**
     * Updates Flags with boolean values
     * @param {String} Value - What is to be updated for touchIDEnabledFlag
     */
    userPreferencesManager.prototype.upadateTouchIdFlag = function(value) {
        this.updateUserFlag("touchIDEnabledFlag", value);
    };
    /**
     * Updates Flags with boolean values
     * @param {String} Value - What is to be updated for isFacialAuthEnabledFlag
     */
    userPreferencesManager.prototype.updateFaceIdFlag = function(value) {
        this.updateUserFlag("isFacialAuthEnabledFlag", value);
    };
    /**
     * Updates Flags with boolean values
     * @param {String} Value - What is to be updated for isPinEnabled
     */
    userPreferencesManager.prototype.updatePinFlag = function(value) {
        this.updateUserFlag("isPinEnabledFlag", value);
    };
    /**
     * Updates Flags with boolean values
     * @param {String} Value - What is to be updated for accountPreviewEnabledFlag
     */
    userPreferencesManager.prototype.updateAccountPreviewFlag = function(value) {
        this.updateUserFlag("accountPreviewEnabledFlag", value);
    };
    /**
     * Checks whether user is same as previous user or not
     * @param {String} userName - username entered in Login screen
     * @returns {boolean} - returns whether user is new or not
     */
    userPreferencesManager.prototype.isNewUser = function(userName) {
        var sm = applicationManager.getStorageManager();
        var username = sm.getStoredEncryptedItem("userName");
        if (this.isFirstTimeLogin() != true) {
            if (userName && (userName === username))
                return false;
            else
                return true;
        } else {
            return false;
        }
    };
    /**
     * Clears all saved user specific data
     */
    userPreferencesManager.prototype.clearUserData = function(formContext) {
        var sm = applicationManager.getStorageManager();
        sm.setStoredItem("userName", "");
        sm.setStoredItem("credPassword", "");
        sm.setStoredItem("firstTimeLogin", "");
        sm.setStoredItem("firstTimeLoginUname", "");
        var current = new Date();
        var date = new Date(current.getFullYear(), current.getMonth(), current.getDate());
        sm.setStoredItem("firstTimeLoggedDateAndTime", date.getTime());
        sm.setStoredItem("noOfTimesFeedbackSubmitted", 0);
        sm.setStoredItem("lastLoginVersion", appConfig.appVersion);
        sm.setStoredItem("settingsObject", this.settings);
    sm.setStoredItem("appLoginPin", "");
        //kony.store.setItem("settingsflagsObject",kony.retailBanking.globalData.globals.settings);
    };
    /**
     * Checks whether App Login Pin has already been set and stord in Local Storage or not
     * @returns {boolean} - returns whether App Login Pin has been set and stored in local storage or not
     */
    userPreferencesManager.prototype.isAppLoginPinSet = function(){
        let appLoginPinFlag = (this.getAppLoginPin()!=="" && this.getAppLoginPin()!==null && this.getAppLoginPin()!==undefined);
        return appLoginPinFlag;
    };
    /**
     * Verifies stored AppLoginPin
     * @param {String} pin - pin Entered by the user
     * @returns {boolean} - Returns whether pin entered by the user is same as that stored in Local Storage or not
     */
    userPreferencesManager.prototype.verifyAppLoginPin = function(pin){
        let verifyAppLoginPinFlag = this.getAppLoginPin() === pin;
        return verifyAppLoginPinFlag;
    };
    /**
     * Decrypts stored AppLoginPin
     * @returns {String} - Returns saved AppLoginPin
     */
    userPreferencesManager.prototype.getAppLoginPin = function() {
        var sm = applicationManager.getStorageManager();
        var appLoginPin = sm.getStoredEncryptedItem("appLoginPin");
        return appLoginPin;
    };
    /**
     * Encrypts and saves AppLoginPin
     * @param {String} AppLoginPin - AppLoginPin entered in Login screen
     */
    userPreferencesManager.prototype.setAppLoginPin = function(appLoginPin) {
        var sm = applicationManager.getStorageManager();
        sm.setStoredEncryptedItem("appLoginPin", appLoginPin);
    };
    /**
     * Decrypts stored Username
     * @returns {boolean} - Returns saved username
     */
    userPreferencesManager.prototype.getUserName = function() {
        var sm = applicationManager.getStorageManager();
        var userName = sm.getStoredEncryptedItem("userName");
        return userName;
    };
     /**
     * Decrypts stored Userid
     * @returns {boolean} - Returns saved Userid
     */
     userPreferencesManager.prototype.getUserId = function() {
         if(this.userObj&&this.userObj[0])
         {
          return this.userObj[0]["userId"];
         }
         return "";
    };
    /**
     * Decrypts saved password
     * @returns {String} - Returns saved username
     */
    userPreferencesManager.prototype.getPassword = function() {
        var sm = applicationManager.getStorageManager();
        var password = sm.getStoredEncryptedItem("password");
        return password;
    };
    /**
     * Gives username from userObject
     * @returns {String} - Returns  username from userObject
     */
    userPreferencesManager.prototype.getCurrentUserName = function() {
        return this.getUserObj().userName ? this.getUserObj().userName : "";
    };
     userPreferencesManager.prototype.setCurrentUserName = function(userName) {
       this.getUserObj().userName  = userName;
    };
    /**
     * Encrypts and stores UserName
     * @param {String} userName - userName entered in Login screen
     */
    userPreferencesManager.prototype.saveUserName = function(userName) {
        var sm = applicationManager.getStorageManager();
        sm.setStoredEncryptedItem("userName", userName);
    };
    /**
     * Encrypts and saves passowrd
     * @param {String} password - password entered in Login screen
     */
    userPreferencesManager.prototype.savePassword = function(password) {
        var sm = applicationManager.getStorageManager();
        sm.setStoredEncryptedItem("password", password);
    };
    /**
     * Clears stored username,password
     * @param {}  - empty
     */
    userPreferencesManager.prototype.clearUserCredentials = function() {
        var sm = applicationManager.getStorageManager();
        sm.setStoredItem("userName", "");
        sm.setStoredItem("credPassword", "");
        sm.setStoredItem("appLoginPin", "");
    };
    /**
     * Sets user Object to data store
     * @param {object} userObj -userdetails which comes from backend
     */
    userPreferencesManager.prototype.setUserObj = function(userObj) {
        this.userObj = userObj;
    };
    /**
     * Gets user Object to data store
     * @returns {object} -  returns userObj
     */
    userPreferencesManager.prototype.getUserObj = function() {
        if (this.userObj)
            return this.userObj[0];
        else
            return "";
    };
    /**
     * Encrypts and stores FirstName
     * @param {String} userFirstName -Firstname of the user
     */
    userPreferencesManager.prototype.saveUserFirstName = function(userFirstName) {
        var sm = applicationManager.getStorageManager();
        sm.setStoredEncryptedItem("userFirstName", userFirstName);
    };
    /**
     * Encrypts and stores LastName
     * @param {String} userLastName -Lastname of the user
     */
    userPreferencesManager.prototype.saveUserLastName = function(userLastName) {
        var sm = applicationManager.getStorageManager();
        sm.setStoredEncryptedItem("userLastName", userLastName);
    };
    /**
     * Gets userFirstName
     * @returns {string} -  returns userFirstName
     */
    userPreferencesManager.prototype.getUserFirstName = function() {
        //return this.getUserObj().userfirstname ? this.getUserObj().userfirstname:"";
        var sm = applicationManager.getStorageManager();
        var userFirstName = sm.getStoredEncryptedItem("userFirstName");
        return userFirstName;
    };
    /**
     * Gets userLastName
     * @returns {string} -  returns userLastName
     */
    userPreferencesManager.prototype.getUserLastName = function() {
        // return this.getUserObj().userlastname ? this.getUserObj().userlastname:"";
        var sm = applicationManager.getStorageManager();
        var userLastName = sm.getStoredEncryptedItem("userLastName");
        return userLastName;
    };
    /**
     * Gets userEmail
     * @returns {string} -  returns userEmail
     */
    userPreferencesManager.prototype.getUserEmail = function() {
        return this.getUserObj().email ? this.getUserObj().email : "";
    };
    /**
     * Gets userPhone
     * @returns {string} -  returns userPhone
     */
    userPreferencesManager.prototype.getUserPhone = function() {
        return this.getUserObj().phone ? this.getUserObj().phone : "";
    };
    /**
     * Gets dateOfBirth
     * @returns {string} -  returns userDOB
     */
    userPreferencesManager.prototype.getUserDOB = function() {
        return this.getUserObj().dateOfBirth ? this.getUserObj().dateOfBirth : "";
    };
    /**
     * Gets UserAddressLine1
     * @returns {string} -  returns UserAddressLine1
     */
    userPreferencesManager.prototype.getUserAddressLine1 = function() {
        return this.getUserObj().addressLine1 ? this.getUserObj().addressLine1 : "";
    };
    /**
     * Gets UserAddressLine2
     * @returns {string} -  returns UserAddressLine2
     */
    userPreferencesManager.prototype.getUserAddressLine2 = function() {
        return this.getUserObj().addressLine2 ? this.getUserObj().addressLine2 : "";
    };
    /**
     * Gets UserState
     * @returns {string} -  returns UserState
     */
    userPreferencesManager.prototype.getUserState = function() {
        return this.getUserObj().state ? this.getUserObj().state : "";
    };
    /**
     * Gets UserCity
     * @returns {string} -  returns UserCity
     */
    userPreferencesManager.prototype.getUserCity = function() {
        return this.getUserObj().city ? this.getUserObj().city : "";
    };
    /**
     * Gets UserZipcode
     * @returns {string} -  returns UserZipcode
     */
    userPreferencesManager.prototype.getUserZipcode = function() {
        return this.getUserObj().zipcode ? this.getUserObj().zipcode : "";
    };
    /**
     * Gets Usercountry
     * @returns {string} -  returns Usercountry
     */
    userPreferencesManager.prototype.getUserCountry = function() {
        return this.getUserObj().country ? this.getUserObj().country : "";
    };
    /**
     * Gets noOfDependants
     * @returns {string} -  returns noOfDependents
     */
    userPreferencesManager.prototype.getnoOfDependants = function() {
        return this.getUserObj().noOfDependents ? this.getUserObj().noOfDependents : "";
    };
    /**
     * Gets maritalStatus
     * @returns {string} -  returns maritalStatus
     */
    userPreferencesManager.prototype.getmaritalStatus = function() {
        return this.getUserObj().maritalStatus ? this.getUserObj().maritalStatus : "";
    };
    /**
     * Gets spouseFirstName
     * @returns {string} -  returns spouseFirstName
     */
    userPreferencesManager.prototype.getspouseFirstName = function() {
        return this.getUserObj().spouseFirstName ? this.getUserObj().spouseFirstName : "";
    };
    /**
     * Gets spouseLastName
     * @returns {string} -  returns spouseLastName
     */
    userPreferencesManager.prototype.getspouseLastName = function() {
        return this.getUserObj().spouseLastName ? this.getUserObj().spouseLastName : "";
    };
    /**
     * Gets spouseName
     * @returns {string} -  returns spouseName
     */
    userPreferencesManager.prototype.getspouseName = function() {
        return this.getUserObj().spouseFirstName + " " + this.getUserObj().spouseLastName;
    };
    /**
     * Gets UserAddress
     * @returns {object} -  returns UserAddress
     */
    userPreferencesManager.prototype.getUserAddress = function() {
        var address = {
            "addressLine1": this.getUserAddressLine1(),
            "addressLine2": this.getUserAddressLine2(),
            "city": this.getUserCity(),
            "state": this.getUserState(),
            "country": this.getUserCountry(),
            "zipcode": this.getUserZipcode()
        };
        return address;
    };
    /**
     * Gets bankName
     * @returns {string} -  returns bankName
     */
    userPreferencesManager.prototype.getBankName = function() {
        return this.getUserObj().bankName ? this.getUserObj().bankName : "";
    };
     /**
     * Gets FeedbackuserID
     * @returns {string} -  returns bankName
     */
    userPreferencesManager.prototype.getFeedbackID = function() {
        return this.getUserObj().feedbackUserId ? this.getUserObj().feedbackUserId : "";
    };
    /**
     * Gets SSN
     * @returns {string} -  returns SSN
     */
    userPreferencesManager.prototype.getSSN = function() {
        return this.getUserObj().ssn ? this.getUserObj().ssn : "";
    };
    /**
     * Gets gender of the user
     * @returns {string} -  returns gender
     */
    userPreferencesManager.prototype.getUserGender = function() {
        return this.getUserObj().gender ? this.getUserObj().gender : "";
    };
    /**
     * Gets DefaultAccountforTransfers
     * @returns {string} -  returns DefaultAccountforTransfers
     */
    userPreferencesManager.prototype.getDefaultAccountforTransfers = function() {
        return this.getUserObj().default_account_transfers ? this.getUserObj().default_account_transfers : "";
    };
    /**
     * Gets DefaultAccountforDeposit
     * @returns {string} -  returns DefaultAccountforDeposit
     */
    userPreferencesManager.prototype.getDefaultAccountforDeposit = function() {
        return this.getUserObj().default_account_deposit ? this.getUserObj().default_account_deposit : "";
    };
    /**
     * Gets DefaultAccountforPayments
     * @returns {string} -  returns DefaultAccountforPayments
     */
    userPreferencesManager.prototype.getDefaultAccountforPayments = function() {
        return this.getUserObj().default_account_payments ? this.getUserObj().default_account_payments : "";
    };
    /**
     * Gets DefaultAccountforQRPayments
     * @returns {string} -  returns DefaultAccountforQRPayments
     */
    userPreferencesManager.prototype.getDefaultAccountforQRPayments = function() {
        return this.getUserObj().default_from_account_qr ? this.getUserObj().default_from_account_qr : "";
    };
    /**
     * Gets DefaultAccountforCardlessPayments
     * @returns {string} -  returns DefaultAccountforCardlessPayments
     */
    userPreferencesManager.prototype.getDefaultAccountforCardlessPayments = function() {
        return this.getUserObj().default_account_cardless ? this.getUserObj().default_account_cardless : "";
    };
    /**
     * Gets DefaultAccountforBillPay
     * @returns {string} -  returns DefaultAccountforBillPay
     */
    userPreferencesManager.prototype.getDefaultAccountforBillPay = function() {
        return this.getUserObj().default_account_billPay ? this.getUserObj().default_account_billPay : "";
    };
    /**
     * Gets bankName
     * @returns {string} -  returns bankName
     */
    userPreferencesManager.prototype.getBankName = function() {
        return this.getUserObj().bankName ? this.getUserObj().bankName : "";
    };
    /**
     * Gets DefaultFromAccountforP2P
     * @returns {string} -  returns DefaultFromAccountforP2P
     */
    userPreferencesManager.prototype.getDefaultFromAccountforP2P = function() {
        return this.getUserObj().default_from_account_p2p ? this.getUserObj().default_from_account_p2p : "";
    };
    /**
     * Gets DefaultToAccountforP2P
     * @returns {string} -  returns DefaultToAccountforP2P
     */
    userPreferencesManager.prototype.getDefaultToAccountforP2P = function() {
        return this.getUserObj().default_to_account_p2p ? this.getUserObj().default_to_account_p2p : "";
    };
    /**
     * Gets AlertsInfo
     * @returns {boolean} -  returns wheather alerts are turned on or off
     */
    userPreferencesManager.prototype.getAlertsInfo = function() {
        return this.getUserObj().alertsTurnedOn ? this.getUserObj().alertsTurnedOn : false;
    };
    /**
     * Gives lastlogin time of the user
     * @returns {String} - last login time
     */
    userPreferencesManager.prototype.getLastLoginTime = function() {
        if (this.getUserObj() && this.getUserObj().lastlogintime) {
            var formatUtil = applicationManager.getFormatUtilManager();
            return CommonUtilities.getDateAndTime(this.getUserObj().lastlogintime);
        } else
            return "";
    };
    /**
       * Gives lastlogin time of the user
       * @returns {String} - last login time
       */
    userPreferencesManager.prototype.getLastLoginTimeForiPhone = function() {
      if (this.getUserObj() && this.getUserObj().lastlogintime) {
        var formatUtil = applicationManager.getFormatUtilManager();
        var isiPhone = applicationManager.getPresentationFormUtility().getDeviceName() === "iPhone";
        var lastLoginTime = this.getUserObj().lastlogintime;
        if(isiPhone && lastLoginTime.includes(" ")) {
          lastLoginTime = lastLoginTime.replace(" ", "T") + "Z";
        }
        var tempLogintime = CommonUtilities.getDateAndTime(lastLoginTime);
        return tempLogintime;
      } else
        return "";
    };
    /**
     * Gets DepositTermsInfo
     * @returns {String} -  returns whether DepositTerms are accepted or not
     */
    userPreferencesManager.prototype.getsDepositTermsInfo = function() {
        return this.getUserObj().areDepositTermsAccepted ? this.getUserObj().areDepositTermsAccepted : "";
    };
    /**
     * firstTimeappLogin used to set firsttimecheck flag
     */
    userPreferencesManager.prototype.firstTimeappLogin = function() {
        var sm = applicationManager.getStorageManager();
        if (sm.getStoredItem("firsttimecheck") === null) {
            sm.setStoredItem("settingsObject", this.settings);
            sm.setStoredItem("firsttimecheck", "finished");
        }
    };
    /**
     * getDefaultAuthMode used to get default auth mode flag
     * @returns {String} -  returns defaultauthmode
     */
    userPreferencesManager.prototype.getDefaultAuthMode = function() {
        var sm = applicationManager.getStorageManager();
        var value = sm.getStoredItem("settingsObject");
        return value.defaultLoginMode;
    };
    /**
     * setDefaultAuthMode used to set default auth mode flag
     */
    userPreferencesManager.prototype.setDefaultAuthMode = function(authMode) {
        var sm = applicationManager.getStorageManager();
        var deviceFlagData = sm.getStoredItem("settingsObject");
        deviceFlagData["defaultLoginMode"] = authMode;
        sm.setStoredItem("settingsObject", deviceFlagData);
    };
    /**
     * returns the cached user phone numbers
     * @returns {Array} userPhoneNumbers
     */
    userPreferencesManager.prototype.getUserAllPhoneNumbers = function() {
        return this.userPhoneNumbers;
    };
    /**
     * returns the cached user addresses
     * @returns {Array} userAddresses
     */
    userPreferencesManager.prototype.getUserAllAddresses = function() {
        return this.userAddresses;
    };
    /**
     * fetch the all cards with username
     * @param {string} username
     * @param {function} presentationSuccessCallback - success callback
     * @param {function} presentationErrorCallback - error callback
     */
    userPreferencesManager.prototype.getAllCardsWithUsername = function(username, presentationSuccessCallback, presentationErrorCallback) {
        var self = this;
        var cardsRepo  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Cards");
        var params = {
            "userName": username
        };
        cardsRepo.customVerb('getCardsByUsername', params, getAllCompletionCallback);
        function  getAllCompletionCallback(status,  data,  error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status,  data,  error, presentationSuccessCallback, presentationErrorCallback);
            if (obj["status"] === true) {
                this.cards = data;
                presentationSuccessCallback(obj["data"]);
            } else {
                presentationErrorCallback(obj["errmsg"]);
            }
        }
    };
    /**
     * returns the cards related information
     * @returns {Array} cards
     */
    userPreferencesManager.prototype.getCards = function() {
        return this.cards;
    };
    /**
     * Update the pin
     * @param {string} pin
     * @param {function} presentationSuccess - success callback
     * @param {function} presentationError - error callback
     */
    userPreferencesManager.prototype.createPin = function(pin, presentationSuccess, presentationError) {
        var  userPin  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("User");
        var scope = this;
        var pinJSON = {
            "pin": pin
        };
        userPin.partialUpdate(pinJSON, partialUpdateCompletionCallback, "online");
        function  partialUpdateCompletionCallback(status,  data,  error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status,  data,  error);
            if (obj["status"] === true) {
                presentationSuccess(obj["data"]);
            } else {
                presentationError(obj["errmsg"]);
            }
        }
    };
   userPreferencesManager.prototype.resetSecurityQuestions = function(record, presentationSuccess, presentationError) {
        var scope = this;
        var userObj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("SecurityQuestions");
        userObj.customVerb('updateSecurityQuestions', record, completionCallback);
        function  completionCallback(status,  data,  error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status,  data,  error);
            if (obj["status"] === true) {
                scope.setCurrentUserName(record.newUserName);
                scope.saveUserName(record.newUserName);
                presentationSuccess(obj["data"]);
            } else {
                presentationError(obj["errmsg"]);
            }
        }
    };
    /**
     *Updates user name using a service call.
     * @param {function} presentationSuccess - invoke the call back with success response.
     * @param {function} presentationError - invoke the call back with error response.
     *@param {string} userName- username to be updated
     */
    userPreferencesManager.prototype.updateUserName = function(record, presentationSuccess, presentationError) {
        var scope = this;
        var userObj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("DbxUser");
        userObj.customVerb('updateDBXUserName', record, completionCallback);
        function  completionCallback(status,  data,  error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status,  data,  error);
            if (obj["status"] === true) {
              //  scope.setCurrentUserName(record.newUserName);
                //scope.saveUserName(record.newUserName);
                presentationSuccess(obj["data"]);
            } else {
                presentationError(obj["errmsg"]);
            }
        }
    };
    /**
     * Updates user password using a service call.
     * @param {function} presentationSuccess - invoke the call back with success response.
     * @param {function} presentationError - invoke the call back with error response.
     *@param {string}  password- new passowrd to be updated
     */
    userPreferencesManager.prototype.updateUserPassword = function(record, presentationSuccess, presentationError) {
      var scope = this;
      var userAccount = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ExternalUsers_2");
      userAccount.customVerb('updateUserPassword', record, completionCallback);
        function  completionCallback(status,  data,  error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status,  data,  error);
            if (obj["status"] === true) {
                presentationSuccess(obj["data"]);
            } else {
                presentationError(obj["errmsg"]);
            }
        }
    };
     /**
     * Add/Update user Profile Picture.
     * @param {function} presentationSuccess - invoke the call back with success response.
     * @param {function} presentationError - invoke the call back with error response.
     *@param {object} userJSON - JSON of details to be updated
     */
    userPreferencesManager.prototype.updateUserProfileImage = function(record, presentationSuccess, presentationError) {
      var  userAccount  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ExternalUsers_2");
      userAccount.customVerb('updateUserProfileImage', record, completionCallback);
        function  completionCallback(status,  data,  error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status,  data,  error);
            if (obj["status"] === true) {
                presentationSuccess(obj["data"]);
            } else {
                presentationError(obj["errmsg"]);
            }
        }
    };
     /**
     * Delete user Profile Picture.
     * @param {function} presentationSuccess - invoke the call back with success response.
     * @param {function} presentationError - invoke the call back with error response.
     *@param {object} userJSON - JSON of details to be updated
     */
     userPreferencesManager.prototype.deleteUserProfileImage = function(params, presentationSuccess, presentationError) {
        var  userAccount  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ExternalUsers_2");
        var params = {};
        userAccount.customVerb('deleteUserProfileImage', params, deleteCompletionCallback);
        function  deleteCompletionCallback(status,  data,  error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status,  data,  error);
            if (obj["status"] === true) {
                presentationSuccess(obj["data"]);
            } else {
                presentationError(obj["errmsg"]);
            }
        }
    };
    /**
     * Updates user generic detaisl using a service call.
     * @param {function} presentationSuccess - invoke the call back with success response.
     * @param {function} presentationError - invoke the call back with error response.
     *@param {object} userJSON - JSON of details to be updated
     */
    userPreferencesManager.prototype.updateUserDetails = function(userJSON, presentationSuccess, presentationError) {
        var  userAccount  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ExternalUsers");
        var scope = this;
        userAccount.partialUpdate(userJSON, partialUpdateCompletionCallback, "online");
        function  partialUpdateCompletionCallback(status,  data,  error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status,  data,  error);
            if (obj["status"] === true) {
                presentationSuccess(obj["data"]);
            } else {
                presentationError(obj["errmsg"]);
            }
        }
    };
    /**
     * Updates user profile picture using a service call.
     * @param {function} presentationSuccess - invoke the call back with success response.
     * @param {function} presentationError - invoke the call back with error response.
     *@param {String} profileImage - user profile picture
     */
    userPreferencesManager.prototype.updateUserProfilePic = function(profileImage, presentationSuccess, presentationError) {
        var  userAccount  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ExternalUsers");
        var scope = this;
        var record = {};
        record["userImage"] = profileImage;
        userAccount.partialUpdate(record, partialUpdateCompletionCallback, "online");
        function  partialUpdateCompletionCallback(status,  data,  error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status,  data,  error);
            if (obj["status"] === true) {
                presentationSuccess(obj["data"]);
            } else {
                presentationError(obj["errmsg"]);
            }
        }
    };
    /**
     * Update the default account for user
     * @param {function} presentationSuccess - invoke the call back with success response.
     * @param {function} presentationError - invoke the call back with error response.
     *@param {object} dataJSON - account details
     */
    userPreferencesManager.prototype.updateAccount = function(dataJSON, presentationSuccess, presentationError) {
        var  userAccount  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ExternalUsers");
        var scope = this;
        userAccount.partialUpdate(dataJSON, partialUpdateCompletionCallback, "online");
        function  partialUpdateCompletionCallback(status,  data,  error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status,  data,  error);
            if (obj["status"] === true) {
                presentationSuccess(obj["data"]);
            } else {
                presentationError(obj["errmsg"]);
            }
        }
    };
    /**
     * fetch all user phone numbers
     * @param {function} presentationSuccess - success callback
     * @param {function} presentationError - error callback
     */
    userPreferencesManager.prototype.fetchAllPhoneNumbers = function(presentationSuccess, presentationFailure) {
        var phoneRepo  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Phone");
        var params = {};
        phoneRepo.customVerb('getAllPhones', params, getAllCompletionCallback);
        var scope = this;
        function getAllCompletionCallback(status, data, error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status, data, error);
            if (obj["status"] === true) {
                scope.userPhoneNumbers = obj["data"];
                presentationSuccess(obj["data"]);
            } else {
                presentationFailure(obj["errmsg"]);
            }
        }
    };
    /**
     * create the user phone number
     * @param {object} paramJSON
     * @param {function} presentationSuccess- success callback
     * @param {function} presentationError - error callback
     */
    userPreferencesManager.prototype.createPhoneNumber = function(paramJSON, presentationSuccess, presentationFailure) {
        var phoneRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Phone");
        phoneRepo.customVerb('createPhone', paramJSON, completionCallback);
        var scope = this;
        function completionCallback(status, data, error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status, data, error);
            if (obj["status"] === true) {
                presentationSuccess(obj["data"]);
            } else {
                presentationFailure(obj["errmsg"]);
            }
        }
    };
    /**
     * fetch the all user addresses
     * @param {function} presentationSuccess - success callback
     * @param {function} presentationError - error callback
     */
    userPreferencesManager.prototype.fetchUserAllAddresses = function(presentationSuccess, presentationFailure) {
        var userRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("User");
        userRepo.customVerb('getAllAddress', {}, completionCallback);
        var scope = this;
        function completionCallback(status, data, error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status, data, error);
            if (obj["status"] === true) {
                scope.userAddresses = obj['data'];
                presentationSuccess(obj["data"]);
            } else {
                presentationFailure(obj["errmsg"]);
            }
        }
    };
    /**
     * create the user phone number
     * @param {object} data - user phone number information
     * @param {function} presentationSuccess - success callback
     * @param {function} presentationError - error callback
     */
    userPreferencesManager.prototype.updateUserPhoneNumber = function(data, presentationSuccess, presentationFailure) {
        var phoneRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Phone");
        phoneRepo.customVerb('updatePhone', data, completionCallback);
        function completionCallback(status, data, error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status, data, error);
            if (obj["status"] === true) {
                presentationSuccess(obj["data"]);
            } else {
                presentationFailure(obj["errmsg"]);
            }
        }
    };
    /**
     * update the user address
     * @param {object} params - address details
     * @param {function} presentationSuccessCallback - success callback
     * @param {function} presentationErrorCallback - error callback
     */
    userPreferencesManager.prototype.updateAddress = function(params, presentationSuccessCallback, presentationErrorCallback) {
        var self = this;
        var userRepo  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("User");
        userRepo.customVerb('updateAddress', params, getAllCompletionCallback);
        function  getAllCompletionCallback(status,  data,  error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status,  data,  error, presentationSuccessCallback, presentationErrorCallback);
            if (obj["status"] === true) {
                this.cards = data;
                presentationSuccessCallback(obj["data"]);
            } else {
                presentationErrorCallback(obj["errmsg"]);
            }
        }
    };
    /**
     * update the user email
     * @param {string} email
     * @param {function} presentationSuccess - success callback
     * @param {function} presentationError - error callback
     */
    userPreferencesManager.prototype.updatePrimaryEmail = function(email, presentationSuccess, presentationError) {
        var  userAccount  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("User");
        var scope = this;
        var record = {};
        record["email"] = email;
        userAccount.partialUpdate(record, partialUpdateCompletionCallback, "online");
        function  partialUpdateCompletionCallback(status,  data,  error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status,  data,  error);
            if (obj["status"] === true) {
                presentationSuccess(obj["data"]);
            } else {
                presentationError(obj["errmsg"]);
            }
        }
    };
    /**
     * create the user address
     * @param {object} params - address details
     * @param {function} presentationSuccessCallback - success callback
     * @param {function} presentationErrorCallback - error callback
     */
    userPreferencesManager.prototype.createAddress = function(params, presentationSuccessCallback, presentationErrorCallback) {
        var self = this;
        var userRepo  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("User");
        userRepo.customVerb('createAddress', params, getAllCompletionCallback);
        function  getAllCompletionCallback(status,  data,  error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status,  data,  error, presentationSuccessCallback, presentationErrorCallback);
            if (obj["status"] === true) {
                this.cards = data;
                presentationSuccessCallback(obj["data"]);
            } else {
                presentationErrorCallback(obj["errmsg"]);
            }
        }
    };
    /**
     * update the secondary email
     * @param {string} secondaryemail
     * @param {function} presentationSuccess - success callback
     * @param {function} presentationError - error callback
     */
    userPreferencesManager.prototype.updateSecondaryEmail = function(secondaryemail, presentationSuccess, presentationError) {
        var  userAccount  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ExternalUsers");
        var scope = this;
        var record = {};
        record["secondaryemail"] = secondaryemail;
        userAccount.partialUpdate(record, partialUpdateCompletionCallback, "online");
        function  partialUpdateCompletionCallback(status,  data,  error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status,  data,  error);
            if (obj["status"] === true) {
                presentationSuccess(obj["data"]);
            } else {
                presentationError(obj["errmsg"]);
            }
        }
    };
    /**
     * delete the user Address
     * @param {object} params -address details
     * @param {function} presentationSuccessCallback - success callback
     * @param {function} presentationErrorCallback - error callback
     */
    userPreferencesManager.prototype.deleteAddress = function(params, presentationSuccessCallback, presentationErrorCallback) {
        var self = this;
        var userRepo  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("User");
        userRepo.customVerb('deleteAddress', params, getAllCompletionCallback);
        function  getAllCompletionCallback(status,  data,  error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status,  data,  error, presentationSuccessCallback, presentationErrorCallback);
            if (obj["status"] === true) {
                this.cards = data;
                presentationSuccessCallback(obj["data"]);
            } else {
                presentationErrorCallback(obj["errmsg"]);
            }
        }
    };
    /**
     * update the secondary email2
     * @param {string} secondaryemail2
     * @param {function} presentationSuccess - success callback
     * @param {function} presentationError - error callback
     */
    userPreferencesManager.prototype.updateSecondaryEmail2 = function(secondaryemail2, presentationSuccess, presentationError) {
        var  userAccount  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ExternalUsers");
        var scope = this;
        var record = {};
        record["secondaryemail2"] = secondaryemail2;
        userAccount.partialUpdate(record, partialUpdateCompletionCallback, "online");
        function  partialUpdateCompletionCallback(status,  data,  error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status,  data,  error);
            if (obj["status"] === true) {
                this.saveUserName(userName);
                presentationSuccess(obj["data"]);
            } else {
                presentationError(obj["errmsg"]);
            }
        }
    };
    /**
     * patch operation on user object
     * @param {object} paramJson  contains key value pairs of user obj
     * @param {function} presentationSuccess - success callback
     * @param {function} presentationError - error callback
     */
    userPreferencesManager.prototype.partialUpdateOnUserObj = function(paramJson, presentationSuccess, presentationError) {
        var  userAccount  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ExternalUsers");
        var scope = this;
        userAccount.partialUpdate(paramJson, partialUpdateCompletionCallback, "online");
        function  partialUpdateCompletionCallback(status,  data,  error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status,  data,  error);
            if (obj["status"] === true) {
                scope.fetchUser(presentationSuccess, presentationError);
            } else {
                presentationError(obj["errmsg"]);
            }
        }
    };
    /**
     * delete the user phone number
     * @param {string} id
     * @param {function} presentationSuccess - success callback
     * @param {function} presentationError - error callback
     */
    userPreferencesManager.prototype.deleteUserPhoneNumber = function(id, presentationSuccess, presentationError) {
        var  phoneRepo  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Phone");
        var scope = this;
        var params = {};
        params.id = id;
        phoneRepo.customVerb('deletePhone', params, deleteCompletionCallback);
        function  deleteCompletionCallback(status,  data,  error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status,  data,  error);
            if (obj["status"] === true) {
                presentationSuccess(obj["data"]);
            } else {
                presentationError(obj["errmsg"]);
            }
        }
    };
    /**
     * Verifies the existing user Pin.
     * @param {function} presentationSuccessCallback - invoke the call back with success response.
     * @param {function} presentationErrorCallback - invoke the call back with error response.
     *@param {String} - user profile picture
     */
    userPreferencesManager.prototype.verifyExistingPin = function(pin, presentationSuccess, presentationError) {
        var  userObj  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Users");
        var params = {};
        params.pin = pin;
        userObj.customVerb('verifyPin', params, getAllCompletionCallback);
        function  getAllCompletionCallback(status,  data,  error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status,  data,  error);
            if (obj["status"] === true) {
                presentationSuccess(obj["data"]);
            } else {
                presentationError(obj["errmsg"]);
            }
        }
    };
    /**
     * Updates user alerts profile using a service call.
     * @param {function} presentationSuccessCallback - invoke the call back with success response.
     * @param {function} presentationErrorCallback - invoke the call back with error response.
     *@param {object} -  record
     */
    userPreferencesManager.prototype.updateAccountAlertsFlag = function(record, presentationSuccess, presentationError) {
        var  userAccount  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ExternalUsers");
        var scope = this;
        userAccount.partialUpdate(record, partialUpdateCompletionCallback, "online");
        function  partialUpdateCompletionCallback(status,  data,  error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status,  data,  error);
            if (obj["status"] === true) {
                presentationSuccess(obj["data"]);
            } else {
                presentationError(obj["errmsg"]);
            }
        }
    };
    /**
     * Checks if the user is eligible for pay a person service.
     *@returns {string} - eligibility status and activation status if eligible.
     */
    userPreferencesManager.prototype.checkP2PEligibilityForUser = function() {
        var isSupported = this.getUserObj()["isP2PSupported"];
        var isActivated = this.getUserObj()["isP2PActivated"];
        if (isSupported === "false") {
            return "NotEligible";
        } else {
            if (isActivated === "true") {
                return "Activated";
            } else {
                return "NotActivated";
            }
        }
    };
    /**
     * Checks if the user is eligible for billpay service.
     *@returns {string} - eligibility status and activation status if eligible.
     */
    userPreferencesManager.prototype.checkBillPayEligibilityForUser = function() {
        var isSupported = this.getUserObj()["isBillPaySupported"];
        var isActivated = this.getUserObj()["isBillPayActivated"];
        if (isSupported === "false") {
            return "NotEligible";
        } else {
            if (isActivated === "true") {
                return "Activated";
            } else {
                return "NotActivated";
            }
        }
    };
    /**
     * Activates Wire Transfer for a user
     * @param {string} defaultAccountForWireTransfer - Default Account for wire transfer
     * @param {function} presentationSuccessCallback - invoke the call back with success response.
     * @param {function} presentationErrorCallback - invoke the call back with error response.
     */
    userPreferencesManager.prototype.activateWireTransferForUser = function(defaultAccountForWireTransfer, presentationSuccess, presentationError) {
        var scope = this;
        var params = {
            "default_account_wire": defaultAccountForWireTransfer
        };
        var userRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ExternalUsers");
        userRepo.partialUpdate(params, partialUpdateCompletionCallback, "online");
        function partialUpdateCompletionCallback(status, data, error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status, data, error);
            if (obj["status"] === true) {
                presentationSuccess(obj["data"]);
            } else {
                presentationError(obj["errmsg"]);
            }
        }
    };
    /**
     * Method will fetch user entitlement configuration  and update entitlement values
     * @param {Object}  params  - entitlment service parameters which contains userName
     * @param {string} params.userName - User name
     * @param {function} successCallback - service success callback method
     * @param {function} failureCallback - service failure callback method
     */
    userPreferencesManager.prototype.fetchEntitlementsForUser = function(params, presentationSuccess, presentationError) {
        var scopeObj = this;
        var loggerManager = applicationManager.getLoggerManager();
        loggerManager.log("----Start userPreferencesManager.prototype.fetchEntitlementsForUser ----");
        function completionCallback(status, data, error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status, data, error);
            if (obj["status"] === true) {
                if (obj["data"]["EmailIds"].length > 0)
                    scopeObj.userEntitlementsEmailIds = obj["data"]["EmailIds"];
                if (obj["data"]["ContactNumbers"].length > 0)
                    scopeObj.userEntitlementsContactNumbers = obj["data"]["ContactNumbers"];
                if (obj["data"]["isSecurityQuestionConfigured"])
                    scopeObj.isSecurityQuestionConfigured = true;
                if (obj["data"]["Addresses"])
                    scopeObj.userEntitlementsAddresses = obj["data"]["Addresses"];
                applicationManager.getConfigurationManager().setEntitlements(obj["data"]);
               applicationManager.getConfigurationManager().rearrangeHamburgerAccordingToEntitements();
                presentationSuccess(obj["data"]);
            } else {
                presentationError(obj["errmsg"]);
            }
        }
        try {
            var userModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("User");
            userModel.getAllEntitlements(params, completionCallback);
        } catch (e) {
            loggerManager.log("----Exception userPreferencesManager.prototype.fetchEntitlementsForUser ----");
        }
    };
    /**
     * De-Activates pay a person service for a user
     * @param {function} presentationSuccess - service success callback method
     * @param {function} presentationFailure - service failure callback method
     */
    userPreferencesManager.prototype.deactivateP2P = function(presentationSuccess, presentationFailure) {
        var self = this;
        var userModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("ArrangementPreferences_1");
        userModel.deactivateP2P({}, completionCallback);
        function  completionCallback(status,  data,  error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status,  data,  error);
            if (obj["status"] === true) {
                self.updateP2PActivationFlag(false);
                presentationSuccess(obj["data"]);
            } else {
                presentationFailure(obj["errmsg"]);
            }
        }
    };
    /**
     * sets the isP2PActivated flag for user.
     * @param {boolean} status - contains the state of isP2PActivated flag.
     */
    userPreferencesManager.prototype.updateP2PActivationFlag = function(status) {
        this.userObj[0]["isP2PActivated"] = status;
    };
    /**
     * updates the p2p preferences for user.
     * @param {object} param - contains the set of account preferences to be updated for pay a person.
     * @param {function} presentationSuccess - service success callback method
     * @param {function} presentationFailure - service failure callback method
     */
    userPreferencesManager.prototype.updateP2PPreferencesForUser = function(param, presentationSuccess, presentationFailure) {
        var self = this;
        var userModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("ArrangementPreferences_1");
        userModel.updateP2PPreferredAccount(param, completionCallback);
        function  completionCallback(status,  data,  error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status,  data,  error);
            if (obj["status"] === true) {
                self.fetchUser(presentationSuccess, presentationFailure);
            } else {
                presentationFailure(obj["errmsg"]);
            }
        }
    };
    /**
     * Activates pay a person for user.
     * @param {function} presentationSuccess - service success callback method
     * @param {function} presentationFailure - service failure callback method
     */
    userPreferencesManager.prototype.activateP2P = function(presentationSuccess, presentationFailure) {
        var self = this;
        var userModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("ArrangementPreferences_1");
        userModel.activateP2P({}, completionCallback);
        function  completionCallback(status,  data,  error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status,  data,  error);
            if (obj["status"] === true) {
                self.updateP2PActivationFlag(true);
                presentationSuccess(obj["data"]);
            } else {
                presentationFailure(obj["errmsg"]);
            }
        }
    };
    /**
     * Method used to request OTP.
     * @param {function} presentationSuccess - service success callback method
     * @param {function} presentationError - service failure callback method
     */
    userPreferencesManager.prototype.SendSecureAccessCode = function(presentationSuccess, presentationError) {
        var self = this;
        var userModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("DbxUser");
        userModel.customVerb("dbxRequestOTP", {}, completionCallBack);
        function completionCallBack(status, data, error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status, data, error);
            if (obj["status"] === true) {
                applicationManager.getAuthManager().setSecurityKey(obj["data"].securityKey);
                presentationSuccess(obj["data"]);
            } else {
                presentationError(obj["errmsg"]);
            }
        }
    };
    /**
     * Method used to verify OTP.
     * @param {Object} params - contains the otp(secure access code).
     * @param {function} presentationSuccess - service success callback method
     * @param {function} presentationError - service failure callback method
     */
    userPreferencesManager.prototype.VerifySecureAccessCode = function(params, presentationSuccess, presentationError) {
        var userModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("DbxUser");
        params.securityKey = applicationManager.getAuthManager().getSecurityKey();
        userModel.customVerb("dbxVerifyOTP", params, completionCallBack);
        function completionCallBack(status, data, error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status, data, error);
            if (obj["status"] === true) {
                applicationManager.getAuthManager().clearSecurityKey();
                if(data.errorCode && data.errorCode === "3402"){
                    presentationError(obj["data"]);
                }else{
                    presentationSuccess(obj["data"]);
                }
            } else {
                presentationError(obj["errmsg"]);
            }
        }
    };
    /**
     * sets the isBillPayActivated flag for user.
     * @param {boolean} status - contains the state of isBillPayActivated flag.
     */
    userPreferencesManager.prototype.updateBillPayActivationFlag = function(status) {
        this.userObj[0]["isBillPayActivated"] = status;
    };
    /**
     * Activates BillPay  for user.
     * @param {function} presentationSuccess - service success callback method
     * @param {function} presentationFailure - service failure callback method
     */
    userPreferencesManager.prototype.activateBillPay = function(param, presentationSuccess, presentationFailure) {
        var self = this;
        var userModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("ArrangementPreferences_1");
        userModel.activateBillPay(param, completionCallback);
        function completionCallback(status, data, error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status, data, error);
            if (obj["status"] === true) {
                self.updateBillPayActivationFlag("true");
                presentationSuccess(obj["data"]);
            } else {
                presentationFailure(obj["errmsg"]);
            }
        }
    };
    /**
     * updates the billPay prefered Account Number for user.
     * @param {object} param - contains the set of account preferences to be updated for billPay.
     * @param {function} presentationSuccess - service success callback method
     * @param {function} presentationFailure - service failure callback method
     */
    userPreferencesManager.prototype.updateBillPayPreferedAccountNumber = function(param, presentationSuccess, presentationFailure) {
        var self = this;
        var userModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("ArrangementPreferences_1");
        userModel.updateBillPayPreferredAccount(param, completionCallback);
        function completionCallback(status, data, error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status, data, error);
            if (obj["status"] === true) {
                self.fetchUser(presentationSuccess, presentationFailure);
            } else {
                presentationFailure(obj["errmsg"]);
            }
        }
    };
    /**
     * used to show the secure access code options
     * @param {function} presentationSuccess - service success callback method
     * @param {function} presentationFailure - service failure callback method
     */
    userPreferencesManager.prototype.getSecureAccessCodeOptions = function(presentationSuccess, presentationFailure) {
        var userModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("User");
        userModel.customVerb("checkSecureAccessCode", {}, completionCallBack);
        function completionCallBack(status, data, error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status, data, error);
            if (obj["status"] === true) {
                presentationSuccess(obj["data"]);
            } else {
                presentationFailure(obj["errmsg"]);
            }
        }
    }
    /**
     * Method used to verify CVV.
     * @param {Object} params - contains the cvv(cvv number).
     * @param {function} presentationSuccess - service success callback method
     * @param {function} presentationError - service failure callback method
     */
    userPreferencesManager.prototype.verifyCVV = function(params, presentationSuccess, presentationError) {
        var userModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("User");
        userModel.customVerb("verifyCVV", params, completionCallBack);
        function completionCallBack(status, data, error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status, data, error);
            if (obj["status"] === true) {
                presentationSuccess(obj["data"]);
            } else {
                presentationError(obj["errmsg"]);
            }
        }
    };
    /**
     * Method used to verify security questions.
     * @param {Object} params - contains the security questions and answers.
     * @param {function} presentationSuccess - service success callback method
     * @param {function} presentationError - service failure callback method
     */
    userPreferencesManager.prototype.verifySecurityQuestions = function(params, presentationSuccess, presentationError) {
        var securityQuestionsModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition('SecurityQuestions');
        securityQuestionsModel.customVerb('verifyCustomerSecurityQuestions', params, completionCallBack);
        function completionCallBack(status, data, error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status, data, error);
            if (obj["status"] === true) {
                presentationSuccess(obj["data"]);
            } else {
                presentationError(obj["errmsg"]);
            }
        }
    };
    /**
     * this method fetches the security questions.
     * @param {Object} params - contains the userName
     * @param {function} presentationSuccess - service success callback method
     * @param {function} presentationError - service failure callback method
     */
    userPreferencesManager.prototype.fetchSecurityQuestions = function(params, presentationSuccess, presentationError) {
        var questionsRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository('SecurityQuestions');
        questionsRepo.customVerb('getRandomCustomerSecurityQuestions', params, completionCallBack);
        function completionCallBack(status, data, error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status, data, error);
            if (obj["status"] === true) {
                presentationSuccess(obj["data"]);
            } else {
                presentationError(obj["errmsg"]);
            }
        }
    };
    /**
     * Method used to fetch the country list.
     * @param {function} success - service success callback method
     * @param {function} failure - service failure callback method
     */
    userPreferencesManager.prototype.getCountryList = function(success, failure) {
        var self = this;
        var CountryModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Country");
        CountryModel.getAllCountries({}, completionCallBack);
        function completionCallBack(status, data, error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status, data, error);
            if (obj["status"] === true) {
                success(obj["data"]);
            } else {
                failure(obj["errmsg"]);
            }
        }
    };
    /**
     * Method used to fetch the country codes list.
     * @param {function} success - service success callback method
     * @param {function} failure - service failure callback method
     */
    userPreferencesManager.prototype.getCountryCodes = function(success, failure) {
        var self = this;
        var CountryModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Country");
        CountryModel.getCountryCodes({}, completionCallBack);
        function completionCallBack(status, data, error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status, data, error);
            if (obj["status"] === true) {
                success(obj["data"]);
            } else {
                failure(obj["errmsg"]);
            }
        }
    };
    /**
     * Method used to fetch the states list.
     * @param {function} success - service success callback method
     * @param {function} failure - service failure callback method
     */
    userPreferencesManager.prototype.getStatesList = function(success, failure) {
        var self = this;
        var StatesModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("States");
        StatesModel.getAllRegions({}, completionCallBack);
        function completionCallBack(status, data, error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status, data, error);
            if (obj["status"] === true) {
                success(obj["data"]);
            } else {
                failure(obj["errmsg"]);
            }
        }
    };
    /**
     * Method used to fetch the city last.
     * @param {function} success - service success callback method
     * @param {function} failure - service failure callback method
     */
    userPreferencesManager.prototype.getCityList = function(success, failure) {
        var self = this;
        var StatesModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("States");
        StatesModel.getAllCities({}, completionCallBack);
        function completionCallBack(status, data, error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status, data, error);
            if (obj["status"] === true) {
                success(obj["data"]);
            } else {
                failure(obj["errmsg"]);
            }
        }
    };
    /**
     * Method used to get entitlement Email Ids.
     * @returns {Object} - returns the list of user entitlement email-ids.
     */
    userPreferencesManager.prototype.getEntitlementEmailIds = function() {
        return this.userEntitlementsEmailIds;
    };
    /**
     * Method used to get entitlement phone numbers.
     * @returns {Object} - returns the list of user entitlement phone numbers.
     */
    userPreferencesManager.prototype.getEntitlementPhoneNumbers = function() {
        return this.userEntitlementsContactNumbers;
    };
    /**
     * Method used to get the user entitlement user addresses.
     * @returns {Object} - returns the list of user entitlement user addresses.
     */
    userPreferencesManager.prototype.getEntitlementAddresses = function() {
        return this.userEntitlementsAddresses;
    };
    /**
     * Checks if the user is eligible for wireTransfer service.
     *@returns {string} - eligibility status and activation status if eligible.
     */
    userPreferencesManager.prototype.getWireTransferEligibleForUser = function() {
        var isSupported = this.getUserObj()["isWireTransferEligible"];
        return isSupported;
    };
    /**
     * Method used to update the user details like phone numbers, email ids, addresses.
     * @param {Object} params - contains the parameters ( phone numbers, emailds).
     * @param {function} successCallBack - service success callback method
     * @param {function} failureCallBack - service failure callback method
     */
    userPreferencesManager.prototype.updateUserProfileDetails = function(params, successCallBack, failureCallBack) {
        var userModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("ExternalUsers");
          userModel.customVerb("UpdateDetails", params, completionCallBack);
        function completionCallBack(status, data, error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status, data, error);
            if (obj["status"] === true) {
                successCallBack(obj["data"]);
            } else if(obj.errmsg && obj.errmsg.serverErrorRes && obj.errmsg.serverErrorRes.status=="success")
            {
                successCallBack(obj.errmsg.serverErrorRes);
            }
            else {
                failureCallBack(obj["errmsg"]);
            }
        }
    };
    /**
     * Method used to fetch the user password rules.
     * @param {function} successCallBack - service success callback method
     * @param {function} failureCallBack - service failure callback method
     */
    userPreferencesManager.prototype.getPasswordPolicies = function(successCallBack, failureCallBack) {
        var  userModel  =  kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("User");
        userModel.customVerb("getPasswordPolicies", {}, completionCallback);
        function completionCallback(status, data, error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status, data, error);
            if (obj["status"] === true) {
                successCallBack(obj["data"]);
            } else {
                failureCallBack(obj["errmsg"]);
            }
        }
    };
    /**
     * Method used to fetch the user password rules.
     * @param {Object} params - contains the existing user password.
     * @param {function} successCallBack - service success callback method
     * @param {function} failureCallBack - service failure callback method
     */
    userPreferencesManager.prototype.checkExistingPassword = function(params, successCallBack, failureCallBack) {
        var password = {
            "password": params
        };
        var userModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("ExternalUsers");
        userModel.customVerb("verifyExistingPassword", password, completionCallBack);
        function completionCallBack(status, data, error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status, data, error);
            if (obj["status"] === true) {
                successCallBack(obj["data"]);
            } else {
                failureCallBack(obj["errmsg"]);
            }
        }
    };
    /**
     * Method used check user status for security questions.
     * @param {function} successCallBack - service success callback method
     * @param {function} failureCallBack - service failure callback method
     */
    userPreferencesManager.prototype.checkSecurityQuestionsStatus = function(successCallBack, failureCallBack) {
        var userModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("User");
        userModel.customVerb("checkSecurityQuestionStatus", {}, completionCallBack);
        function completionCallBack(status, data, error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status, data, error);
            if (obj["status"] === true) {
                successCallBack(obj["data"]);
            } else {
                failureCallBack(obj["errmsg"]);
            }
        }
    };
    /**
     * Method used to save security questions for user.
     * @param {Object} params - contains the list of questions and answers.
     * @param {function} successCallBack - service success callback method
     * @param {function} failureCallBack - service failure callback method
     */
    userPreferencesManager.prototype.saveSecurityQuestions = function(params, successCallBack, failureCallBack) {
        var record = {};
        record.securityQuestions = params;
        record.userName = this.getCurrentUserName();
        var securityQuestionsModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("SecurityQuestions");
        securityQuestionsModel.customVerb("createCustomerSecurityQuestions", record, completionCallback);
        function completionCallback(status, data, error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status, data, error);
            if (obj["status"] === true) {
                successCallBack(obj["data"]);
            } else {
                failureCallBack(obj["errmsg"]);
            }
        }
    };
        /**
     * Method used to fetch all security questions.
     * @param {function} successCallBack - service success callback method
     * @param {function} failureCallBack - service failure callback method
     */
    userPreferencesManager.prototype.fetchAllSecurityQuestions = function( successCallBack, failureCallBack) {
        var securityQuestionsModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("SecurityQuestions");
        securityQuestionsModel.customVerb("getSecurityQuestions", {}, completionCallback);
        function completionCallback(status, data, error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status, data, error);
            if (obj["status"] === true) {
                successCallBack(obj["data"]);
            } else {
                failureCallBack(obj["errmsg"]);
            }
        }
    };
    /**
     * Method used to fetch all security questions.
     * @param {Object} params - contains the secure access code settings to be updated.
     * @param {function} successCallBack - service success callback method
     * @param {function} failureCallBack - service failure callback method
     */
    userPreferencesManager.prototype.updateSecureAccessSettings = function( params, successCallBack, failureCallBack) {
        var userModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("User");
            userModel.customVerb("updateSecureAccessCode", params, completionCallBack);
        function completionCallBack(status, data, error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status, data, error);
            if (obj["status"] === true) {
                successCallBack(obj["data"]);
            } else {
                failureCallBack(obj["errmsg"]);
            }
        }
    };
        /**
     * Method used to reset the user password.
     * @param {Object} params - the password.
     * @param {function} successCallBack - service success callback method
     * @param {function} failureCallBack - service failure callback method
     */
    userPreferencesManager.prototype.resetPassword = function( params, successCallBack, failureCallBack) {
        var userModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("DbxUser");
        userModel.customVerb("updateDbxCustomer", {"password":params}, completionCallBack);
        function completionCallBack(status, data, error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status, data, error);
            if (obj["status"] === true) {
                successCallBack(obj["data"]);
            } else {
                failureCallBack(obj["errmsg"]);
            }
        }
    };
    /**
     * Method used to fetch user profile.
     * @param {function} successCallBack - service success callback method
     * @param {function} failureCallBack - service failure callback method
     */
    userPreferencesManager.prototype.fetchUserProfile = function(  successCallBack, failureCallBack) {
        var scope = this;
        var  userProfile  =  kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("ExternalUsers");
          userProfile.getAll(getAllCompletionCallback);
        var clientProperties = Object.keys(CommonUtilities.CLIENT_PROPERTIES).length > 0 ? CommonUtilities.CLIENT_PROPERTIES : OLBConstants.CLIENT_PROPERTIES
        let isPrivate = clientProperties['E2E_ENCRYPTION_ENABLED'];
        if (!kony.sdk.isNullOrUndefined(isPrivate))
            isPrivate = isPrivate.toLowerCase() === 'true' ? true : false;
        else isPrivate = false;
        if (isPrivate) {
            var key = clientProperties['E2E_ENCRYPTION_KEY'];
            var iv = clientProperties['E2E_ENCRYPTION_VECTOR'];
        }
        function getAllCompletionCallback(status, data, error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status, data, error);
            if (obj["status"] === true) {
                if(key) {
                    scope.dataPrivacyFetchUser(key, iv, obj["data"][0]);
                }
                successCallBack(obj["data"]);
            } else {
                failureCallBack(obj["errmsg"]);
            }
        }
    };
   /**
     * Method to save user name
     * @param {String} userName - username entered in Login screen
     */
    userPreferencesManager.prototype.savetempUserName = function(userName){
    this.tempUserName = userName;
    };
    /**
     * Method to get user name
     * @param {String} userName - username entered in Login screen
     * @returns {boolean} - returns user Name
     */
    userPreferencesManager.prototype.gettempUserName = function(){
     return this.tempUserName?this.tempUserName:"";
    };
    /**
    * Method used to check if security questions are configured for user.
    * @returns {boolean} - returns true if security questions configured.
    */
    userPreferencesManager.prototype.isSecurityQuestionsConfigured = function() {
        return this.isSecurityQuestionConfigured;
    };
   userPreferencesManager.prototype.fetchUsernameRulesAndPolicy = function(presentationSuccessCallback, presentationErrorCallback) {
    var userRepo  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("DbxUser");
    kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository('DbxUser').setHeaderParams({"Accept-Language":kony.i18n.getCurrentLocale()});
    var params = {  "ruleForCustomer": true,  "policyForCustomer": true,  "policyForAllLocales": true };
    userRepo.customVerb('getUserNameRulesAndPolicy',params,getAllCompletionCallback);
    function  getAllCompletionCallback(status,  data,  error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error,presentationSuccessCallback,presentationErrorCallback);
      if(obj["status"] === true){
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
  userPreferencesManager.prototype.fetchPasswordRulesAndPolicy = function(presentationSuccessCallback, presentationErrorCallback) {
    var userRepo  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Users_2");
    kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository('Users_2').setHeaderParams({"Accept-Language":kony.i18n.getCurrentLocale()});
    var params = {  "ruleForCustomer": true,  "policyForCustomer": true };
    userRepo.customVerb('getPasswordRulesAndPolicy',params,getAllCompletionCallback);
    function  getAllCompletionCallback(status,  data,  error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error,presentationSuccessCallback,presentationErrorCallback);
      if(obj["status"] === true){
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
   userPreferencesManager.prototype.getUsernameAndPasswordRulesAndPolicies  = function(presentationSuccessCallback,presentationErrorCallback){
      var dbxUserRepo  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ExternalUsers_2");
       kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository('ExternalUsers_2').setHeaderParams({"Accept-Language":kony.i18n.getCurrentLocale()});
       var params = {  "ruleForCustomer": true,  "policyForCustomer": true,  "policyForAllLocales": true };
      dbxUserRepo.customVerb('getUserNameAndPasswordRulesAndPolicies',params,getAllCompletionCallback);
       function  getAllCompletionCallback(status, data, error) {
         var srh = applicationManager.getServiceResponseHandler();
         var obj =  srh.manageResponse(status, data, error,presentationSuccessCallback,presentationErrorCallback);
         if(obj["status"] === true){
         presentationSuccessCallback(obj["data"]);
         }
         else {
          presentationErrorCallback(obj["errmsg"]);
         }
       }
     };
    userPreferencesManager.prototype.setLocationDetails=function(locationDetails){
        this.locationDetails=locationDetails;
    };
    userPreferencesManager.prototype.filterStatesBasedOnCountryId=function(countryId){
      var statesList=this.locationDetails.States;
      var filteredStatesList=[];
      filteredStatesList.push(["lbl1", "Select a State"]);
        for(var i=0;i<statesList.length;i++){
          if(statesList[i].hasOwnProperty("Country_id") && statesList[i]["Country_id"]==countryId){
            filteredStatesList.push([statesList[i]["id"],statesList[i]["Name"]]);
          }
        }
      return filteredStatesList;
    };
      userPreferencesManager.prototype.filterCitiesBasedOnCountryIdAndStateId=function(countryId,stateId){
      var citiesList=this.locationDetails.Cities;
      var filteredCitiesList=[];
        filteredCitiesList.push(["lbl1", "Select a City"]);
        for(var i=0;i<citiesList.length;i++){
          if(citiesList[i].hasOwnProperty("Country_id") && citiesList[i]["Country_id"]==countryId && citiesList[i].hasOwnProperty("Region_id") && citiesList[i]["Region_id"]==stateId){
            filteredCitiesList.push([citiesList[i]["id"],citiesList[i]["Name"]]);
          }
        }
      return filteredCitiesList;
    };
    userPreferencesManager.prototype.getCountryData=function(){
  var countriesList=this.locationDetails.Countries;
      var filteredCountriesList=[];
        filteredCountriesList.push(["lbl1", kony.i18n.getLocalizedString("i18n.ProfileManagement.selectCountry")]);
        for(var i=0;i<countriesList.length;i++){
            filteredCountriesList.push([countriesList[i]["id"],countriesList[i]["Name"]]);
        }
      return filteredCountriesList;
    };
  userPreferencesManager.prototype.getStatesData=function(){
  var statesList=this.locationDetails.States;
      var filteredStatesList=[];
        filteredStatesList.push(["lbl1", kony.i18n.getLocalizedString("i18n.ProfileManagement.selectState")]);
        for(var i=0;i<statesList.length;i++){
            filteredStatesList.push([statesList[i]["id"],statesList[i]["Name"]]);
        }
      return filteredStatesList;
    };
  userPreferencesManager.prototype.getCitiesData=function(){
  var citiesList=this.locationDetails.Cities;
      var filteredCitiesList=[];
        filteredCitiesList.push(["lbl1", "Select a City"]);
        for(var i=0;i<citiesList.length;i++){
            filteredCitiesList.push([citiesList[i]["id"],citiesList[i]["Name"]]);
        }
      return filteredCitiesList;
    };
     /**
  * Method used to update userStatus.
  * @param {Object} inputParams - username and status.
  * @param {function} presentationSuccessCallback - service success callback method
  * @param {function} presentationErrorCallback - service failure callback method
  */
  userPreferencesManager.prototype.updateUserStatus = function(inputParams,presentationSuccessCallback,presentationErrorCallback)
  {
      var userObj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ExternalUsers_2");
      userObj.customVerb('updateUserStatus', inputParams, completionCallBack);
      function completionCallBack(status, data, error) {
          var srh = applicationManager.getServiceResponseHandler();
          var obj = srh.manageResponse(status, data, error);
          if (obj.status === true) {
              presentationSuccessCallback(obj.data);
          }
          else {
              presentationErrorCallback(obj.errmsg);
          }
      }
  };
  /**
  * Method used to get the company Id
  */
    userPreferencesManager.prototype.getCompanyId = function () {
        var singleEntityValue = "true";
        if (applicationManager.getConfigurationManager().configurations.getItem("isSingleEntity") !== undefined) {
            singleEntityValue = applicationManager.getConfigurationManager().configurations.getItem("isSingleEntity");
        }
        var companyId = (singleEntityValue === "true") ? this.getDefaultLegalEntity() :this.getCurrentLegalEntity();
        return companyId;
    };

    /**
    * Method used to get the default legal entity
    */
    userPreferencesManager.prototype.getDefaultLegalEntity = function () {
        let defaultLegalEntityfromLoginRes = kony.sdk.getCurrentInstance().tokens[applicationManager.getConfigurationManager().constants.IDENTITYSERVICENAME].provider_token.params.user_attributes.defaultLegalEntity;
        let sm = applicationManager.getStorageManager();
        let defaultLegalEntity = sm.getStoredItem("defaultLegalEntity");
        if (!defaultLegalEntity || defaultLegalEntity === "") {
            defaultLegalEntity = defaultLegalEntityfromLoginRes ? defaultLegalEntityfromLoginRes : "";
            this.saveDefaultLegalEntity(defaultLegalEntity);
        }
        return defaultLegalEntity;
    };
	/**
    * Added the below two method to unblock the blocker ARB-36184 will correct these in next PR's
    */
	userPreferencesManager.prototype.getHomeEntityData = function(){
        let sm = applicationManager.getStorageManager();
        let homeEntityData = sm.getStoredItem("homeEntityData");
        if(!homeEntityData || homeEntityData === "") {
            homeEntityData = {
                "companyName": "HSBC Bank India",
                "id": "GB0010006",
                "TAndCAccepted": "true"
            };
            this.saveHomeEntityData(homeEntityData);
        }
        return homeEntityData;
    };
	/**
    * Method used to set the home entity data
    */
	userPreferencesManager.prototype.saveHomeEntityData = function(homeEntityData){
        let sm = applicationManager.getStorageManager();
        sm.setStoredItem("homeEntityData", homeEntityData);
    };

    /**
    * Method used to save the default legal entity
    */
    userPreferencesManager.prototype.saveDefaultLegalEntity = function (defaultLegalEntity) {
        let sm = applicationManager.getStorageManager();
        sm.setStoredItem("defaultLegalEntity", defaultLegalEntity);
    };

    /**
    * Method used to get the home legal entity
    */
    userPreferencesManager.prototype.getHomeLegalEntity = function(){
        return kony.sdk.getCurrentInstance().tokens[applicationManager.getConfigurationManager().constants.IDENTITYSERVICENAME].provider_token.params.user_attributes.homeLegalEntity;
    };

    /**
    * Method used to get the current legal entity
    */
    userPreferencesManager.prototype.getCurrentLegalEntity = function(){
        let sm = applicationManager.getStorageManager();
        let currentLegalEntity = sm.getStoredItem("currentLegalEntity");
        return currentLegalEntity;
    };


    /**
    * Method used to set the current legal entity
    */
    userPreferencesManager.prototype.saveCurrentLegalEntity = function(currentLegalEntity){
        let sm = applicationManager.getStorageManager();
        sm.setStoredItem("currentLegalEntity", currentLegalEntity);
    };

  
  /**
     * sets the updateQRPayActivation flag for user.
     * @param {boolean} status - contains the state of isBillPayActivated flag.
     */
    userPreferencesManager.prototype.updateQRPayActivationFlag = function(status) {
        this.userObj[0]["isQRPaymentActivated"] = status;
    };
  
  /**
     * Activates QR Payments for user.
     * @param {function} presentationSuccess - service success callback method
     * @param {function} presentationFailure - service failure callback method
     */
    userPreferencesManager.prototype.activateQRPayment = function(param, presentationSuccess, presentationFailure) {
        var self = this;
        var userModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("ArrangementPreferences_1");
        userModel.customVerb("activateQRPayment", param, completionCallback);
        function completionCallback(status, data, error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status, data, error);
            if (obj["status"] === true) {
                self.updateQRPayActivationFlag("true");
                presentationSuccess(obj["data"]);
            } else {
                presentationFailure(obj["errmsg"]);
            }
        }
    };

 /**
    * sets the default account for qr in user object.
    * @param {string} accId - contains the account Id.
    */
    userPreferencesManager.prototype.updateQRPreferredAcc = function(accId) {
        this.userObj[0]["default_from_account_qr"] = accId;
    };
  
  /**
     * updates the QRPayment Default Account preferences for user.
     * @param {object} param - contains the set of account preferences to be updated for pay a person.
     * @param {function} presentationSuccess - service success callback method
     * @param {function} presentationFailure - service failure callback method
     */
    userPreferencesManager.prototype.updateQRPaymentPreferredAccount = function(param, presentationSuccess, presentationFailure) {
        var self = this;
        var defaultAcc = param.default_from_account_qr;
        var userModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("ArrangementPreferences_1");
        userModel.customVerb("updateQRPaymentPreferredAccount",param, completionCallback);
        function  completionCallback(status,  data,  error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status,  data,  error);
            if (obj["status"] === true) {
                self.updateQRPreferredAcc(defaultAcc);
                presentationSuccess(obj["data"]);
            } else {
                presentationFailure(obj["errmsg"]);
            }
        }
    };
  
    /**
   * fetch the user features and permissions.
   * @param {object} param - contains the set of account preferences to be updated for pay a person.
   * @param {function} presentationSuccess - service success callback method
   * @param {function} presentationFailure - service failure callback method
   */
    userPreferencesManager.prototype.getUserFeaturesAndPermissions = function (presentationSuccessCallback, presentationErrorCallback) {
        var userObj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Users");
        userObj.customVerb('getFeaturesAndPermissions', {}, completionCallBack);
        function completionCallBack(status, data, error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status, data, error);
            if (obj.status === true) {
                applicationManager.getConfigurationManager().features = JSON.parse(obj.data["features"]);
                applicationManager.getConfigurationManager().userPermissions = JSON.parse(obj.data["permissions"]);
                applicationManager.getConfigurationManager().setUserPermissions(JSON.parse(obj.data["permissions"]));
                applicationManager.getConfigurationManager().setFeatures(JSON.parse(obj.data["features"]));
                kony.sdk.getCurrentInstance().tokens[OLBConstants.IDENTITYSERVICENAME].provider_token.params['security_attributes'] ={};
                kony.sdk.getCurrentInstance().tokens[OLBConstants.IDENTITYSERVICENAME].provider_token.params['security_attributes'].features = obj.data["features"];
                kony.sdk.getCurrentInstance().tokens[OLBConstants.IDENTITYSERVICENAME].provider_token.params['security_attributes'].permissions = obj.data["permissions"];
                presentationSuccessCallback(obj.data);
            }
            else {
                presentationErrorCallback(obj.errmsg);
            }
        }
    };

        /**
     * update the user language
     * @param {object} data - user language information
     * @param {function} presentationSuccess - success callback
     * @param {function} presentationError - error callback
     */
        userPreferencesManager.prototype.updateDefaultLanguage = function(data, presentationSuccess, presentationFailure) {
            var userRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ExternalUsers_1");
            userRepo.customVerb('UpdateDefaultLanguage', data, completionCallback);
            function completionCallback(status, data, error) {
                var srh = applicationManager.getServiceResponseHandler();
                var obj = srh.manageResponse(status, data, error);
                if (obj["status"] === true) {
                    presentationSuccess(obj["data"]);
                } else {
                    presentationFailure(obj["errmsg"]);
                }
            }
        };

    /**
     * validate auth token
     * @param {object} data - auth token
     * @param {function} presentationSuccess - success callback
     * @param {function} presentationError - error callback
     */
    userPreferencesManager.prototype.validateAuthToken = function(inputParams, presentationSuccessCallback, presentationErrorCallback) {
        var userObj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("TPPConsent");
        userObj.customVerb('validateAuthToken', inputParams, completionCallBack);

        function completionCallBack(status, data, error) {
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
     * deny consent
     * @param {object} data - consentId
     * @param {function} presentationSuccess - success callback
     * @param {function} presentationError - error callback
     */
    userPreferencesManager.prototype.deleteConsent = function(inputParams, presentationSuccessCallback, presentationErrorCallback) {
        var userObj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("TPPConsent");
        userObj.customVerb('deletePSD2Consent', inputParams, completionCallBack);

        function completionCallBack(status, data, error) {
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
     * validate auth token payment consent
     * @param {object} data - auth token
     * @param {function} presentationSuccess - success callback
     * @param {function} presentationError - error callback
     */
    userPreferencesManager.prototype.validatePSD2PaymentAuthToken = function(inputParams, presentationSuccessCallback, presentationErrorCallback) {
        var userObj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("OpenBankingConsent");
        userObj.customVerb('validatePSD2PaymentAuthToken', inputParams, completionCallBack);

        function completionCallBack(status, data, error) {
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
     * deny consent
     * @param {object} data - paymentId
     * @param {function} presentationSuccess - success callback
     * @param {function} presentationError - error callback
     */
    userPreferencesManager.prototype.denyPaymentConsentPrelogin = function(inputParams, presentationSuccessCallback, presentationErrorCallback) {
        var userObj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("TPPConsent");
        userObj.customVerb('deletePSD2PaymentConsent', inputParams, completionCallBack);

        function completionCallBack(status, data, error) {
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
     * validate auth token card based payment consent
     * @param {object} data - auth token
     * @param {function} presentationSuccess - success callback
     * @param {function} presentationError - error callback
     */
    userPreferencesManager.prototype.validateCBPaymentAuthToken = function(inputParams, presentationSuccessCallback, presentationErrorCallback) {
        var userObj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("OpenBankingConsent");
        userObj.customVerb('validateCBPAuthToken', inputParams, completionCallBack);

        function completionCallBack(status, data, error) {
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
     * deny consent
     * @param {object} data - consentId
     * @param {function} presentationSuccess - success callback
     * @param {function} presentationError - error callback
     */
    userPreferencesManager.prototype.denyCBPConsentPrelogin = function(inputParams, presentationSuccessCallback, presentationErrorCallback) {
        var userObj = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("OpenBankingConsent");
        userObj.customVerb('cancelCBPConsent', inputParams, completionCallBack);

        function completionCallBack(status, data, error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status, data, error);
            if (obj.status === true) {
                presentationSuccessCallback(obj.data);
            } else {
                presentationErrorCallback(obj.errmsg);
            }
        }
    };

    return userPreferencesManager;
});
