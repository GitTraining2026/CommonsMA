/**
*@module AuthManager
 */
define([], function() {
  /**
   * This is class named AuthManager which handles all functions related to Authentication module in the application
   * @alias module:AuthManager
   * @class
  */
   function AuthManager(){
      this.authManagerInstance = null;
      var modelDefinition=kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Users");
      /**@member {object} - object which resembles the MF object "User"*/
      this.forgotObject=new modelDefinition();
      this.securityKey ="";
      this.MFAResponse = "";
      this.servicekey = "";
      this.communicationType = "";
      this.userName = "";
      this.encodedImage = "";
  }
  inheritsFrom(AuthManager, kony.mvc.Business.Delegator);
  AuthManager.prototype.initializeBusinessController = function(){};
  /**
    * Function to login into the application with username and password.
    * @param {object} UsernamePasswordJSON - json object used to send the entered userName and Password.
    * @param {function} presentationSuccessCallback - invoke the call back with success response.
    * @param {function} presentationErrorCallback - invoke the call back with error response.
    */
  AuthManager.prototype.login = function(UsernamePasswordJSON,presentationSuccess,presentationError){
      var authParams = {
                        "UserName": UsernamePasswordJSON.username,
                        "Password": UsernamePasswordJSON.password,
                        "loginOptions": {
                            "isOfflineEnabled": false
                        }
                    };
     var configManager = applicationManager.getConfigurationManager();
     authClient = KNYMobileFabric.getIdentityService(configManager.constants.IDENTITYSERVICENAME);
     authClient.login(authParams,successCallback,errorCallback);
    function successCallback(resSuccess){
            presentationSuccess(resSuccess);
     }
    function errorCallback(resError){
           var srh = applicationManager.getServiceResponseHandler();
           var res  = srh.manageLoginResponse(resError);
           presentationError(res);
    }
  };
    AuthManager.prototype.loginMFA = function(params,presentationSuccess,presentationError){
      var authParams = {
                        "mfa_key": params
                    };
     var configManager = applicationManager.getConfigurationManager();
     authClient = KNYMobileFabric.getIdentityService(configManager.constants.IDENTITYSERVICENAME);
     authClient.validateMfa(authParams,successCallback,errorCallback);
    function successCallback(resSuccess){
            presentationSuccess(resSuccess);
     }
    function errorCallback(resError){
           var srh = applicationManager.getServiceResponseHandler();
           var res  = srh.manageLoginResponse(resError);
           presentationError(res);
    }
  };
   /**
    * Function getMfaDetails to get MFA Attributes for login
     */
  AuthManager.prototype.getMfaDetails=function()
  {
     var configManager = applicationManager.getConfigurationManager();
     authClient = KNYMobileFabric.getIdentityService(configManager.constants.IDENTITYSERVICENAME);
     return authClient.getMfaDetails();
  }
   /**
    * Function getUserAttributes to get user Attributes
     */
  AuthManager.prototype.getUserAttributes = function(presentationSuccessCallback, presentationErrorCallback) {
      var accountsRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ExternalUsers");
      accountsRepo.customVerb('getUserAttributes', {}, getUserCompletionCallback);

      function getUserCompletionCallback(status, data, error) {
        var srh = applicationManager.getServiceResponseHandler();
        var obj = srh.manageResponse(status, data, error);
        if (obj["status"] === true) {
          if(obj["data"].user_attributes)
            obj["data"]=obj["data"].user_attributes;
          kony.sdk.getCurrentInstance().tokens[applicationManager.getConfigurationManager().constants.IDENTITYSERVICENAME].provider_token.params.user_attributes=obj["data"];
          presentationSuccessCallback(obj["data"]);
        } else {
          presentationErrorCallback(obj["errmsg"]);
        }
      }
    };
  /**
    * Function to logout from the application.
    * @param {function} presentationSuccessCallback - invoke the call back with success response.
    * @param {function} presentationErrorCallback - invoke the call back with error response.
    */
  AuthManager.prototype.logout = function(presentationSuccess,presentationError){
     var self = this;
          var authParams = {
              "loginOptions": {
                  "isOfflineEnabled": false
              }
          };
          try {
            if (typeof authClient === 'undefined') {
              let configManager = applicationManager.getConfigurationManager();
              authClient = KNYMobileFabric.getIdentityService(configManager.constants.IDENTITYSERVICENAME);
            }
            authClient.logout(logoutSuccessCallback,logoutErrorCallback, authParams);
          } catch (err) {
              kony.print(err);
          }
    function logoutSuccessCallback(resSuccess){
            presentationSuccess(resSuccess);
     }
    function logoutErrorCallback(resError){
           presentationError(resError);
    }
  };
  /**
    * Function to login into the application with registered pin for the perticular user.
    * @param {object} authParams - json used to send the entered userName, pin and deviceId.
    * @param {function} presentationSuccessCallback - invoke the call back with success response.
    * @param {function} presentationErrorCallback - invoke the call back with error response.
  */
  AuthManager.prototype.pinLogin = function(authParams,presentationSuccess,presentationError){
     var configManager = applicationManager.getConfigurationManager();
     authClient = KNYMobileFabric.getIdentityService(configManager.constants.IDENTITYSERVICENAME);
     authClient.login(authParams,successCallback,errorCallback);
    function successCallback(resSuccess){
            presentationSuccess(resSuccess);
     }
    function errorCallback(resError){
           var srh = applicationManager.getServiceResponseHandler();
           var res  = srh.manageLoginResponse(resError);
           presentationError(res);
    }
  };
  /**
    * fetches the username based on user details
    * @param {object} - UserSSNDobLastNameJSON -  a json consisting of 3 keys
    *                 ssn - ssn of the user
    *                 userlastname - last name of the user
    *                 dateOfBirth - date of birth of the user
    * @param {function} presentationSuccessCallback will be called when call is successfull
    * @param {function} presentationErrorCallback will be called when call is not successfull
    */
  AuthManager.prototype.fetchUserName=function(UserSSNDobLastNameJSON,presentationSuccessCallback,presentationErrorCallback){
    var accountsRepo  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("User");
    var params = UserSSNDobLastNameJSON;
    accountsRepo.customVerb('getUsername',params,getUserCompletionCallback);
    function  getUserCompletionCallback(status,  data,  error) {
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
    AuthManager.prototype.verifyUserName=function(EmailPhoneDOBJSON,presentationSuccessCallback,presentationErrorCallback){
    var accountsRepo  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Users_2");
    var params = EmailPhoneDOBJSON;
    accountsRepo.customVerb('verifyUser',params,getUserCompletionCallback);
    function  getUserCompletionCallback(status,  data,  error) {
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


  AuthManager.prototype.verifyCaptcha=function(verifyData,presentationSuccessCallback,presentationErrorCallback){
  var accountsRepo  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Security");
  accountsRepo.customVerb('verifyCaptcha',verifyData,getUserCompletionCallback);
  function  getUserCompletionCallback(status,  data,  error) {
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
    * fetch/request OTP for the user based on user details by making a service call
    * @param {object} - requestOTPJSON -  a json consisting of 4 keys
    *               ssn - ssn of the user
    *               userlastname - last name of the user
    *               dateOfBirth - date of birth of the user
    *               username -  username of the user
    * @param {function} presentationSuccessCallback will be called when call is successfull
    * @param {function} presentationErrorCallback will be called when call is not successfull
   */
  AuthManager.prototype.fetchOTP = function(requestOTPJSON,presentationSuccessCallback,presentationErrorCallback){
    var self = this;
   var userRepo  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("DbxUser");
    var params = requestOTPJSON;
    userRepo.customVerb('dbxRequestOTP',params,getAllCompletionCallback);
    function  getAllCompletionCallback(status,  data,  error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error,presentationSuccessCallback,presentationErrorCallback);
      if(obj["status"] === true){
      self.setSecurityKey(obj["data"].securityKey);
          presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
      }
  };
  /**
    * Verifies the given CVV for the user based on user details and the card number for which the cvv is to be validated
    * @param {object} - requestOTPJSON -  a json consisting of 6 keys
    *               cvv - cvv to be validated
    *               cardNumber - cardNumber for which cvv is to be
    *               ssn - ssn of the user
    *               userlastname - last name of the user
    *               dateOfBirth - date of birth of the user
    *               username -  username of the user
    * @param {function} presentationSuccessCallback will be called when call is successfull
    * @param {function} presentationErrorCallback will be called when call is not successfull
   */
  AuthManager.prototype.verifyCVV = function(verifyCVVJSon,presentationSuccessCallback,presentationErrorCallback){
    var userRepo  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("User");
    var params = verifyCVVJSon;
    userRepo.customVerb('verifyCVV',params,getAllCompletionCallback);
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
  /**
    * Verifies the given OTP for the user based on user details
    * @param {object} -  requestOTPJSON -  a json consisting of 5 keys
    *               otp - otp to be validated
    *               ssn - ssn of the user
    *               userlastname - last name of the user
    *               dateOfBirth - date of birth of the user
    *               username -  username of the user
    * @param {function} presentationSuccessCallback will be called when call is successfull
    * @param {function} presentationErrorCallback will be called when call is not successfull
   */
  AuthManager.prototype.verifyOTP = function(verifyOTPJSON,presentationSuccessCallback,presentationErrorCallback){
    var self = this;
    var userRepo  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("DbxUser");
    var params = verifyOTPJSON;
    //params['securityKey'] = this.getSecurityKey();
    userRepo.customVerb('dbxVerifyOTP',params,getAllCompletionCallback);
    function  getAllCompletionCallback(status,  data,  error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error,presentationSuccessCallback,presentationErrorCallback);
      if(obj["status"] === true){
          self.clearSecurityKey();
          if(data.errorCode && data.errorCode === "3402"){
            presentationErrorCallback(obj["data"]);
        }else{
            presentationSuccessCallback(obj["data"]);
        }
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
      }
  };
    
    /**
    * Gets company types
    * @param {function} presentationSuccessCallback will be called when call is successfull
    * @param {function} presentationErrorCallback will be called when call is not successfull
    */
  AuthManager.prototype.getCompanyType = function (params, presentationSuccessCallback, presentationErrorCallback) {
    var organization = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Organization");
    organization.customVerb("typesOfCompaniesSupportedAtCore",params, getAllCompletionCallback);
  
    function getAllCompletionCallback(status, data, error) {
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
   
    /**
    * Checks if company exists
    * @param {function} presentationSuccessCallback will be called when call is successfull
    * @param {function} presentationErrorCallback will be called when call is not successfull
    */ 
  AuthManager.prototype.checkCompanyExists = function(params,presentationSuccessCallback,presentationErrorCallback){
      var AuthObject = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Contract");
      AuthObject.customVerb("checkIfCompanyExists",params, getAllCompletionCallback);
      function getAllCompletionCallback(status, data, error) {
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
    
  /**
    * Get all business accounts
    * @param {function} presentationSuccessCallback will be called when call is successfull
    * @param {function} presentationErrorCallback will be called when call is not successfull
    */ 
  AuthManager.prototype.getBusinessAccounts = function(params,presentationSuccessCallback,presentationErrorCallback){
      var AuthObject = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Contract");  
      AuthObject.customVerb("getCompanyAccounts",params, getAllCompletionCallback);
      function getAllCompletionCallback(status, data, error) {
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
    
  /**
    * Updates the password for a user
    * @param {object} - resetPasswordJSON - a json consisting of 2 keys
    *               username - The username of the user
    *               password - The password to be updated
    * @param {function} presentationSuccessCallback will be called when call is successfull
    * @param {function} presentationErrorCallback will be called when call is not successfull
    */
  AuthManager.prototype.resetPassword = function(resetPasswordJSON,presentationSuccessCallback,presentationErrorCallback){
   var userRepo  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Users_2");
   var params = resetPasswordJSON;
    userRepo.customVerb('resetUserPassword',params,getAllCompletionCallback);
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
    /**
      * checks if user is already enrolled or not
      * @member of AuthManager
      * @param {object} verifyUserJSON
      */
     AuthManager.prototype.VerifyUserisalreadyEnrolled = function(verifyUserJSON,presentationSuccessCallback,presentationErrorCallback){
      var userRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ExternalUsers");
      var params = verifyUserJSON;
       userRepo.customVerb('checkUserEnrolled',params,getAllCompletionCallback);
       function getAllCompletionCallback(status, data, error) {
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
     /**
      * Fetches security questions for user
      */
     AuthManager.prototype.fetchSecurityQuestionsForEnroll = function(presentationSuccessCallback,presentationErrorCallback){
      var securityRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("SecurityQuestions");
      securityRepo.customVerb('getSecurityQuestions',{},getAllCompletionCallback);
       function getAllCompletionCallback(status, data, error) {
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
     /**
      * Saves answers for security questions for user
      * @param {object} params
      */
     AuthManager.prototype.saveSecurityQuestionsForEnroll = function(params, presentationSuccessCallback,presentationErrorCallback){
      var securityRepo  = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("SecurityQuestions");
      securityRepo.customVerb('createCustomerSecurityQuestions',params,getAllCompletionCallback);
       function getAllCompletionCallback(status, data,  error) {
         var srh = applicationManager.getServiceResponseHandler();
         var obj =  srh.manageResponse(status,  data,  error,presentationSuccessCallback,presentationErrorCallback);
         if(obj["status"] === true){
         presentationSuccessCallback(obj["data"]);
         }
         else {
          presentationErrorCallback(obj["errmsg"]);
         }
       }
     };
      /**
      * Method to fetch user name policies for user
      */
     AuthManager.prototype.getUserNamePoliciesForEnroll = function(presentationSuccessCallback,presentationErrorCallback){
      var userRepo  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("User");
      userRepo.customVerb('getPasswordPolicies',{},getAllCompletionCallback);
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
     /**
      * Method to fetch username and password rules and policies for user
      */
      AuthManager.prototype.getUsernameAndPasswordRulesAndPolicies  = function(params,presentationSuccessCallback,presentationErrorCallback){
        var dbxUserRepo  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ExternalUsers_2");
         kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository('ExternalUsers_2').setHeaderParams({"Accept-Language":kony.i18n.getCurrentLocale()});
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
  AuthManager.prototype.loginExternalBank = function(UserInfoJSON, successCallback, errorCallback){
      var authParams = {
                        "username": UserInfoJSON.username,
                        "password": UserInfoJSON.password,
                        "loginOptions": {
                            "isOfflineEnabled": false
                        }
                    };
      authClient = KNYMobileFabric.getIdentityService(UserInfoJSON.identityProvider);
      authClient.login(authParams,loginExternalBankSuccessCallback, errorCallback);
      function loginExternalBankSuccessCallback(){
          authClient.getBackendToken(true, {
                  "IdentityServiceName": UserInfoJSON.identityProvider,
                  "AuthParams": {
                      "loginOptions": {
                          "isOfflineEnabled": false
                      }
                  }
          }, successCallback, errorCallback);
      }
  };
  AuthManager.prototype.addExternalBankCredentials = function(username, password, sessionToken, mainUser, bankId, sucessCallback, errorCallback) {
      var loggerManager = applicationManager.getLoggerManager();
      loggerManager.log("----Start AuthManager.prototype.addExternalBankCredentials----");
      function callback(status, response, error) {
          if(status === kony.mvc.constants.STATUS_SUCCESS){
              sucessCallback(response);
          } else{
              errorCallback(error);
          }
      }
      try {
          var model = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("ExternalBankIdentity");
            var obj = new model({
              "username": username,
              "password": password,
              "SessionToken": sessionToken,
              "main_user": mainUser,
              "bank_id": bankId
          });
          obj.save(callback.bind(this));
      } catch(err) {
          loggerManager.log("Error caught in AuthManager.prototype.addExternalBankCredentials----");
      }
      loggerManager.log("----End AuthManager.prototype.addExternalBankCredentials----");
  };
  /**
    * Set a particular key of forgot object("User") field stored in the object in the class.
    * @param {String} key - key of the forgot object which has to be set
    * @param {String} value - value which has to be set
    */
  AuthManager.prototype.setForgotAttribute = function(key,value)
  {
    this.forgotObject[key]=value;
  };
  /**
    * Method to get Security Key for OTP.
    * @param {String} key - key of the forgot object which has to be get
    * @returns {String}  - value of the key
    */
  AuthManager.prototype.getForgotAttribute = function(key)
  {
    return this.forgotObject[key];
  };
  /**
    * Method to get Security Key for OTP.
    * @returns {String}   Security Key for OTP flow
    */
   AuthManager.prototype.getSecurityKey = function()
   {
       return this.securityKey;
   };
   /**
     * Method to set security key for OTP flow
     * @param {String} securityKey - Security Key for OTP flow
     */
   AuthManager.prototype.setSecurityKey = function(securityKey)
   {
     this.securityKey= securityKey;
   };
     AuthManager.prototype.setServicekey = function(servicekey){
      this.servicekey = servicekey;
    };
    AuthManager.prototype.getServicekey = function(){
      return this.servicekey;
    };
     AuthManager.prototype.setUserName = function(userName){
      this.userName = userName;
    };
    AuthManager.prototype.getUserName = function(){
      return this.userName;
    };
     AuthManager.prototype.setCommunicationType = function(communicationType){
      this.communicationType = communicationType;
    };
    AuthManager.prototype.getCommunicationType = function(){
      return this.communicationType;
    };
  
    AuthManager.prototype.setMFAResponse = function(MFAResponse){
      if(MFAResponse.MFAAttributes && MFAResponse.MFAAttributes.customerCommunication){
        for(var i in MFAResponse.MFAAttributes.customerCommunication.phone)
          MFAResponse.MFAAttributes.customerCommunication.phone[i].unmasked = MFAResponse.MFAAttributes.customerCommunication.phone[i].referenceId;
        for(var j in MFAResponse.MFAAttributes.customerCommunication.email)
          MFAResponse.MFAAttributes.customerCommunication.email[j].unmasked = MFAResponse.MFAAttributes.customerCommunication.email[j].referenceId;
        }
      this.MFAResponse = MFAResponse;
    };
    AuthManager.prototype.getMFAResponse = function(){
      return this.MFAResponse;
    };
   /**
     * Method to clear securityKey
     */
   AuthManager.prototype.clearSecurityKey = function(securityKey)
   {
     this.securityKey= "";
   };
  
     /**
     * 
     * @param {string} encodedImage 
     * To display the encoded captch image in Can't sign in flow
     */
    AuthManager.prototype.setEncodedimage = function(encodedImage){
      this.encodedImage = encodedImage;
    };
    AuthManager.prototype.getEncodedimage = function(){
      return this.encodedImage;
    };
  /**
    * Set primary key Attribute for the object("User")
    * Since it is a primary key, a new model has to be created with primary key value as parameter
    * and all the data obtained uptil now has to be set again to this new definition
    * @param {object} - data - a json consisting of 2 keys
    *                 userName - primary key for "User" object
    */
  AuthManager.prototype.setPrimarykeyAttribute = function(data)
  {
    var modelDefinition=kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Users_2");
    this.forgotprimarykeyObj = new modelDefinition(data);
    this.forgotprimarykeyObj.userlastname = this.forgotObject.userlastname;
    this.forgotprimarykeyObj.dateOfBirth = this.forgotObject.dateOfBirth;
    this.forgotprimarykeyObj.ssn = this.forgotObject.ssn;
    this.forgotObject = this.forgotprimarykeyObj;
  };
    /**
    * Get the forgot object field stored in the object in the class.
    * @returns {object} - forgot object of the user who forgot username/password
    */
   AuthManager.prototype.getForgotObject = function()
  {
    return this.forgotObject;
  };
  /**
    * Reset's all the forgotObject variables to their default values
    */
   AuthManager.prototype.clearForgotObject = function(){
     var modelDefinition=kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("User");
     this.forgotObject=new modelDefinition();
   };
   /**
    * Method to fetch Password policies
    * @param {function} presentationSuccessCallback - will be called when call is successful
    * @param {function} presentationErrorCallback  - will be called when call is not successful
    */
    AuthManager.prototype.fetchPasswordPolicies = function (presentationSuccessCallback,presentationErrorCallback) {
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
      try {
        var userModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("User");
        userModel.customVerb("getPasswordPolicies", {}, getAllCompletionCallback);
      } catch (error) {
        kony.print("Something went wrong");
      }
    };
    /**
    * Function to login into the application with CSR (Session for user).
    * @param {object} authParams - json used to login in CSR Mode.
    * @param {object} authParams.session_token - session token
    * @param {function} presentationSuccessCallback - invoke the call back with success response.
    * @param {function} presentationErrorCallback - invoke the call back with error response.
    */
    AuthManager.prototype.CSRLogin = function(authParams,presentationSuccess,presentationError){
      var configManager = applicationManager.getConfigurationManager();
      authClient = KNYMobileFabric.getIdentityService(configManager.constants.IDENTITYSERVICENAME);
      authClient.login(authParams,successCallback,errorCallback);
      function successCallback(resSuccess){
           presentationSuccess(resSuccess);
      }
      function errorCallback(resError){
           var srh = applicationManager.getServiceResponseHandler();
           var res  = srh.manageLoginResponse(resError);
           presentationError(res);
      }
    };
    /**
      * checks if user & member is already enrolled or not for a business banking
      * @member of AuthManager
      * @param {object} verifyUserJSON
      */
     AuthManager.prototype.vefifyUserOrMemberIsAlreadyEnrolled = function (verifyUserJSON, presentationSuccessCallback, presentationErrorCallback) {
      var userRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("DbxUser");
      var params = verifyUserJSON;
      userRepo.customVerb('checkIfOrgMemberExists', params, getAllCompletionCallback);
      function getAllCompletionCallback(status, data, error) {
        var srh = applicationManager.getServiceResponseHandler();
        var obj = srh.manageResponse(status, data, error, presentationSuccessCallback, presentationErrorCallback);
        if (obj["status"] === true) {
          presentationSuccessCallback(obj["data"]);
        }
        else {
          presentationErrorCallback(obj["errmsg"]);
        }
      }
    };
    /**
      * Checks if the provided reset password link is active
      * @member of AuthManager
      * @param {object} verifyUserJSON
      */
    AuthManager.prototype.isResetPasswordLinkActive = function (params, presentationSuccessCallback, presentationErrorCallback) {
      var userRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("DbxUser");
      userRepo.customVerb('IsEmailLinkActive', params, getAllCompletionCallback);
      function getAllCompletionCallback(status, data, error) {
        var srh = applicationManager.getServiceResponseHandler();
        var obj = srh.manageResponse(status, data, error, presentationSuccessCallback, presentationErrorCallback);
        if (obj["status"] === true) {
          presentationSuccessCallback(obj["data"]);
        }
        else {
          presentationErrorCallback(obj["errmsg"]);
        }
      }
    };
    AuthManager.prototype.requestResetPasswordOTP = function (params, presentationSuccessCallback, presentationErrorCallback) {
      var userRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Users_2");
      userRepo.customVerb('requestResetPasswordOTP', params, getAllCompletionCallback);
      function getAllCompletionCallback(status, data, error) {
        var srh = applicationManager.getServiceResponseHandler();
        var obj = srh.manageResponse(status, data, error, presentationSuccessCallback, presentationErrorCallback);
        if (obj["status"] === true) {
          presentationSuccessCallback(obj["data"]);
        }
        else {
          presentationErrorCallback(obj["errmsg"]);
        }
      }
    };
     AuthManager.prototype.verifyOTPPreLogin = function (params, presentationSuccessCallback, presentationErrorCallback) {
      var userRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Users_2");
      userRepo.customVerb('verifyOTPPreLogin', params, getAllCompletionCallback);
      function getAllCompletionCallback(status, data, error) {
        var srh = applicationManager.getServiceResponseHandler();
        var obj = srh.manageResponse(status, data, error, presentationSuccessCallback, presentationErrorCallback);
        if (obj["status"] === true) {
          presentationSuccessCallback(obj["data"]);
        }
        else {
          presentationErrorCallback(obj["errmsg"]);
        }
      }
    };
    AuthManager.prototype.requestEnrollOTP = function (params, presentationSuccessCallback, presentationErrorCallback) {
      var userRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ExternalUsers_2");
      userRepo.customVerb('requestEnrollOTP', params, getAllCompletionCallback);
      function getAllCompletionCallback(status, data, error) {
        var srh = applicationManager.getServiceResponseHandler();
        var obj = srh.manageResponse(status, data, error, presentationSuccessCallback, presentationErrorCallback);
        if (obj["status"] === true) {
          presentationSuccessCallback(obj["data"]);
        }
        else {
          presentationErrorCallback(obj["errmsg"]);
        }
      }
    };
    /**
    * Sets the password for a organization employee
    * @member of AuthManager
    * @param {object} verifyUserJSON
    */
    AuthManager.prototype.setOrgPasswordForEmployee = function (params, presentationSuccessCallback, presentationErrorCallback) {
      var userRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("DbxUser");
      userRepo.customVerb('SetOrgEmployeePassword', params, getAllCompletionCallback);
      function getAllCompletionCallback(status, data, error) {
        var srh = applicationManager.getServiceResponseHandler();
        var obj = srh.manageResponse(status, data, error, presentationSuccessCallback, presentationErrorCallback);
        if (obj["status"] === true) {
          presentationSuccessCallback(obj["data"]);
        } else {
          presentationErrorCallback(obj["errmsg"]);
        }
      }
    };
    /**
    * Sets the password for a organization employee
    * @member of AuthManager
    * @param {object} verifyUserJSON
    */
    AuthManager.prototype.resetPasswordFromEmail = function (params, presentationSuccessCallback, presentationErrorCallback) {
      var userRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("DbxUser");
      userRepo.customVerb('resetUserPasswordFromEmail', params, getAllCompletionCallback);
      function getAllCompletionCallback(status, data, error) {
        var srh = applicationManager.getServiceResponseHandler();
        var obj = srh.manageResponse(status, data, error, presentationSuccessCallback, presentationErrorCallback);
        if (obj["status"] === true) {
          presentationSuccessCallback(obj["data"]);
        } else {
          presentationErrorCallback(obj["errmsg"]);
        }
      }
    };
    
    AuthManager.prototype.fetchAllFeatures = function (params, presentationSuccessCallback, presentationErrorCallback) {
      var featureModel = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("serviceDefinition");
      featureModel.customVerb("getServicedefinitionAndRoleFeatures", params, getAllCompletionCallback);
      function getAllCompletionCallback(status, data, error) {
        var srh = applicationManager.getServiceResponseHandler();
        var obj = srh.manageResponse(status, data, error, presentationSuccessCallback, presentationErrorCallback);
        if (obj["status"] === true) {
          presentationSuccessCallback(obj["data"]);
        } else {
          presentationErrorCallback(obj["errmsg"]);
        }
      }
    };
   
    /**
    * fetches types of organizations
    */ 
    AuthManager.prototype.fetchOrganizationTypes = function (params,presentationSuccessCallback,presentationErrorCallback) {
      var userRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("serviceDefinition");
      userRepo.customVerb('getServiceDefinitionsForContracts', params, getAllCompletionCallback);
      function getAllCompletionCallback(status, data, error) {
        var srh = applicationManager.getServiceResponseHandler();
        var obj = srh.manageResponse(status, data, error, presentationSuccessCallback, presentationErrorCallback);
        if (obj["status"] === true && !kony.sdk.isNullOrUndefined(obj["data"]) && !kony.sdk.isNullOrUndefined(obj["data"]["ServiceDefinitionRecords"])){
          presentationSuccessCallback(obj["data"]);
        } else {
          presentationErrorCallback(obj["errmsg"]);
        }
      }
    };
    
    /*Fetches Accounts*/
    AuthManager.prototype.addBusinessAccounts = function (params, presentationSuccessCallback, presentationErrorCallback) {
      var userRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Accounts");
      userRepo.customVerb('getAccountCentricDetails', params, getAllCompletionCallback);
      function getAllCompletionCallback(status, data, error) {
        var srh = applicationManager.getServiceResponseHandler();
        var obj = srh.manageResponse(status, data, error, presentationSuccessCallback, presentationErrorCallback);
        if (obj["status"] === true) {
          presentationSuccessCallback(obj["data"]);
        } else {
          presentationErrorCallback(obj["errmsg"]);
        }
      }
    };  
       
    AuthManager.prototype.fetchRoleinCompany = function (params, presentationSuccessCallback, presentationErrorCallback) {
      var userRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("serviceDefinition");
      userRepo.customVerb('getServiceDefinitionRoles', params, getAllCompletionCallback);
      function getAllCompletionCallback(status, data, error) {
        var srh = applicationManager.getServiceResponseHandler();
        var obj = srh.manageResponse(status, data, error, presentationSuccessCallback, presentationErrorCallback);
        if (obj["status"] === true) {
          presentationSuccessCallback(obj["data"]);
        } else {
          presentationErrorCallback(obj["errmsg"]);
        }
      }
    };
    
    AuthManager.prototype.fetchCountry = function (params, presentationSuccessCallback, presentationErrorCallback) {
      var userRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Country");
      userRepo.customVerb('getAllCountries', params, getAllCompletionCallback);
      function getAllCompletionCallback(status, data, error) {
        var srh = applicationManager.getServiceResponseHandler();
        var obj = srh.manageResponse(status, data, error, presentationSuccessCallback, presentationErrorCallback);
        if (obj["status"] === true) {
          presentationSuccessCallback(obj["data"]);
        } else {
          presentationErrorCallback(obj["errmsg"]);
        }
      }
    };
    
    AuthManager.prototype.fetchState = function (params, presentationSuccessCallback, presentationErrorCallback) {
      var userRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("States");
      userRepo.customVerb('getAllRegions', params, getAllCompletionCallback);
      function getAllCompletionCallback(status, data, error) {
        var srh = applicationManager.getServiceResponseHandler();
        var obj = srh.manageResponse(status, data, error, presentationSuccessCallback, presentationErrorCallback);
        if (obj["status"] === true) {
          presentationSuccessCallback(obj["data"]);
        } else {
          presentationErrorCallback(obj["errmsg"]);
        }
      }
    };
    
    AuthManager.prototype.fetchCity = function (params, presentationSuccessCallback, presentationErrorCallback) {
      var userRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("States");
      userRepo.customVerb('getAllCities', params, getAllCompletionCallback);
      function getAllCompletionCallback(status, data, error) {
        var srh = applicationManager.getServiceResponseHandler();
        var obj = srh.manageResponse(status, data, error, presentationSuccessCallback, presentationErrorCallback);
        if (obj["status"] === true) {
          presentationSuccessCallback(obj["data"]);
        } else {
          presentationErrorCallback(obj["errmsg"]);
        }
      }
    };
  
      /**
    * function to request business enroll otp
    */ 
    AuthManager.prototype.requestBusinessEnrollOtp = function (params,presentationSuccessCallback,presentationErrorCallback) {
      var userRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ExternalUsers_2");
      userRepo.customVerb('requestEnrollOTP', params, getAllCompletionCallback);
      function getAllCompletionCallback(status, data, error) {
        var srh = applicationManager.getServiceResponseHandler();
        var obj = srh.manageResponse(status, data, error, presentationSuccessCallback, presentationErrorCallback);
        if (obj["status"] === true) {
          presentationSuccessCallback(obj["data"]);
        } else {
          presentationErrorCallback(obj["errmsg"]);
        }
      }
    };
    
      /**
    * Function to Enroll Organization
    */ 
    AuthManager.prototype.enrollOrganization = function (params,presentationSuccessCallback,presentationErrorCallback) {
      var userRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Contract");
      userRepo.customVerb('enrollContract', params, getAllCompletionCallback);
      function getAllCompletionCallback(status, data, error) {
        var srh = applicationManager.getServiceResponseHandler();
        var obj = srh.manageResponse(status, data, error, presentationSuccessCallback, presentationErrorCallback);
        if (obj["status"] === true) {
          presentationSuccessCallback(obj["data"]);
        } else {
          presentationErrorCallback(obj["errmsg"]);
        }
      }
    };
    
    /**
    * Function for fetching Terms and Conditions
    */ 
    AuthManager.prototype.fetchTermsAndConditions = function (params,presentationSuccessCallback,presentationErrorCallback) {
      var userRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("TermsAndConditions");
      userRepo.customVerb('getPreLogin', params, getAllCompletionCallback);
      function getAllCompletionCallback(status, data, error) {
        var srh = applicationManager.getServiceResponseHandler();
        var obj = srh.manageResponse(status, data, error, presentationSuccessCallback, presentationErrorCallback);
        if (obj["status"] === true) {
          presentationSuccessCallback(obj["data"]);
        } else {
          presentationErrorCallback(obj["errmsg"]);
        }
      }
    };
  
    /**
     * @function to verify if domain name already exists
     */
    AuthManager.prototype.verifyIfCompanyExists = function (params, presentationSuccessCallback, presentationErrorCallback){
      var requestObject = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Organization");
      requestObject.customVerb('getDbxOrganizationDetails', params, completionCallback);
      function completionCallback(status, data, error){
          var serviceResponseHandler = applicationManager.getServiceResponseHandler();
            var responseObject = serviceResponseHandler.manageResponse(status, data, error, presentationSuccessCallback, presentationErrorCallback);
            if(responseObject["status"] === true){
            presentationSuccessCallback(responseObject["data"]);
          }
            else {
            presentationErrorCallback(responseObject["errormsg"]);
          }
      }
    };

//adding reSendActivation Code
    AuthManager.prototype.resendActivationCodeforSCA = function(params, presentationSuccessCallback, presentationErrorCallback) {
       const CIBAObjSrv = {
                   getDataModel: function(objectName, objectServiceName) {
                       var objSvc = kony.sdk.getCurrentInstance().getObjectService(objectServiceName, {
                           "access": "online"
                       });
                       return {
                           customVerb: function(customVerb, params, callback) {
                               var dataObject = new kony.sdk.dto.DataObject(objectName);
                               for (let key in params) {
                                   dataObject.addField(key, params[key]);
                               }
                               var options = {
                                   "dataObject": dataObject
                               };
                               objSvc.customVerb(customVerb, options, success => callback(true, success), error => callback(false, error));
                           }
                       };
                   }
               };
var objService = CIBAObjSrv.getDataModel("SCADevice", "SCAUniken");
        let request = {
            "userName": params.id
        };
        const callback = (status, response) => {
         if (status) {
         presentationSuccessCallback(response);
         } else {
        presentationErrorCallback(response);
         }
         };
        objService.customVerb('resendActivationCode', request, callback);
    };
    AuthManager.prototype.regenerateActivationCode = function (params, presentationSuccessCallback, presentationErrorCallback) {
      var requestObject = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Users_2");
      requestObject.customVerb('regenerateActivationCode', params, completionCallback);
      function completionCallback(status, data, error) {
        var serviceResponseHandler = applicationManager.getServiceResponseHandler();
        var responseObject = serviceResponseHandler.manageResponse(status, data, error, presentationSuccessCallback, presentationErrorCallback);
        if (responseObject["status"] === true) {
          presentationSuccessCallback(responseObject["data"]);
        }
        else {
          presentationErrorCallback(responseObject["errmsg"]);
        }
      }
    };
  
    AuthManager.prototype.generateCaptcha = function (params, presentationSuccessCallback, presentationErrorCallback) {
      var requestObject = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Security");
      requestObject.customVerb('generateCaptcha', params, completionCallback);
      function completionCallback(status, data, error) {
        var serviceResponseHandler = applicationManager.getServiceResponseHandler();
        var responseObject = serviceResponseHandler.manageResponse(status, data, error, presentationSuccessCallback, presentationErrorCallback);
        if (responseObject["status"] === true) {
          presentationSuccessCallback(responseObject["data"]);
        }
        else {
          presentationErrorCallback(responseObject["errmsg"]);
        }
      }
    };

    AuthManager.prototype.getLegalEntities = function (params, presentationSuccessCallback, presentationErrorCallback) {
      var requestObject = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("LegalEntity");
      requestObject.customVerb('getLegalEntities', params, completionCallback);
      function completionCallback(status, data, error) {
        var serviceResponseHandler = applicationManager.getServiceResponseHandler();
        var responseObject = serviceResponseHandler.manageResponse(status, data, error, presentationSuccessCallback, presentationErrorCallback);
        if (responseObject["status"] === true) {
          presentationSuccessCallback(responseObject["data"]);
        }
        else {
          presentationErrorCallback(responseObject["errmsg"]);
        }
      }
    };


  return AuthManager;
  });
