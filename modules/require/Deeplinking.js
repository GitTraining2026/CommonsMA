define(function() {
    /**
     * Method to receive deeplinking URL saved in AppContext
     * @memberof {Deeplinking}
     * @param {void}  -  None
     * @returns {String} - DeeplinkingUrl
     * @throws {}
     */
    var _deeplinkUrl = function() {
        return kony.mvc.MDAApplication.getSharedInstance().appContext.deeplinkUrl.deeplinkpath;
    };

    /**
     * Method to get StartupForm if provided by AppUrl
     * @memberof {Deeplinking}
     * @param {void}  -  None
     * @returns {String} - Startup form name
     * @throws {}
     */
    var _formId = function() {
        return kony.mvc.MDAApplication.getSharedInstance().appContext.deeplinkUrl.formID;
    };
    /**
     * Method to check if url contains Query Parameters
     * @memberof {Deeplinking}
     * @param {string}  -  stringURL,value
     * @returns {boolean} - true, if url has Query Parameters
     * @throws {}
     */
    var _hasQueryParameters = function(stringURL) {
        var returnValue = false;
        if(stringURL) {
            returnValue = stringURL.indexOf("?") >= 0;
        }
        return returnValue;
    };
    /**
     * Method to get Session Token if provided by AppUrl
     *@memberof {Deeplinking}
     * @param {void} - None
     * @returns {String} - session token
     * throws{}
     */
    var _sessionToken = function() {
        return _getQueryParameter("session_token");
    };
    /**
     * Method to get StartupForm
     * @memberof {Deeplinking}
     * @param {void}  -  None
     * @returns {String} startUpPage- Startup form name
     * @throws {}
     */
    var _startUpPage = function() {
        var startUpPage = _formId();
        var formName;
        if (startUpPage) {
            formName = startUpPage.split('?')[0];
        } else {
            var deeplinkUrl = _deeplinkUrl();
            formName = deeplinkUrl.slice(deeplinkUrl.indexOf("kdw") + 5);
        }
        return formName;
    };

    var _getQueryParameter = function(key) {
        var value = null;
        var formId = kony.mvc.MDAApplication.getSharedInstance().appContext.deeplinkUrl.formID;
        if (formId) {
            if (_hasQueryParameters(formId)) {
                var queryParameter = formId.split("?")[1];
                if(queryParameter) {
                    var urlKeyValue = queryParameter.split("=");
                    value = urlKeyValue[0] === key ? urlKeyValue[1] : null; 
                }
            }
        }
        return value;
    };
	
    /**
   * Retrieves a parameter value from the deeplink URL context.
   * @param {string} key - The key for the parameter to retrieve.
   * @returns {string|null} - The parameter value or null if not found.
   */
    var _getKeyParameter = function (key) {
        var appContext = kony.mvc.MDAApplication.getSharedInstance().appContext;
        if (appContext && appContext.deeplinkUrl) {
            return appContext.deeplinkUrl.hasOwnProperty(key) ? appContext.deeplinkUrl[key] : null;
        }
    // Return null if appContext or deeplinkUrl is not defined
    return null;
};


    /**
     * Method to get set navigation for deeplinked page
     * @memberof {Deeplinking}
     * @param {void}  -  None
     * @returns {void} - None
     * @throws {}
     */
    var _deeplinking = function() {
        var sessiontoken = _sessionToken();
        var ssotoken = kony.sdk.util.getSSOToken();
        var ssolength;
        if(ssotoken !== null){
          var ssoToken = JSON.parse(kony.sdk.util.getSSOToken());
          ssolength = Object.keys(ssoToken).length;
        }

        //if redirected url has session token , then set value of isCSR_Assist_Mode to true
        if (sessiontoken) {
            kony.mvc.MDAApplication.getSharedInstance().appContext.isCSR_Assist_Mode = true;
        } else {
            kony.mvc.MDAApplication.getSharedInstance().appContext.isCSR_Assist_Mode = false;
        }
   
      var formName = _startUpPage();
      if(ssolength >0 && ssotoken !== null && ssotoken !== undefined){
        kony.mvc.MDAApplication.getSharedInstance().appContext._isSSOEnabled = true;
        kony.mvc.MDAApplication.getSharedInstance().appContext.isCSR_Assist_Mode = true;
        formName = "frmDashboard";
      } else {
        kony.mvc.MDAApplication.getSharedInstance().appContext._isSSOEnabled = false;
      }
        if (kony.mvc.MDAApplication.getSharedInstance().appContext.deeplinkUrl.consentType) {
            let callerURL = _getKeyParameter("callerURL");
            let decodedCallerURL = atob(callerURL);
            return {
                'authToken': _getKeyParameter("authToken"),
                'tppName': _getKeyParameter("tppName"),
                'accountConsentType': _getKeyParameter("accountConsentType"),
                'consentType': _getKeyParameter("consentType"),
                'deeplinkSchemaName': decodedCallerURL
            };
        }
        var newSession = kony.mvc.MDAApplication.getSharedInstance().appContext.deeplinkUrl.isNewSession;
        if (newSession) {
            kony.mvc.MDAApplication.getSharedInstance().appContext.deeplinkUrl.isNewSession = false;
        }
        if (formName === "" || formName === "frmLogin" && !newSession) {
            return;
        }
        switch (formName) {
            case "frmEnrollNow":
                {
                    var config = applicationManager.getConfigurationManager(); 
                    if(config.isAppRefreshed==="true"){
                        return;
                    }
                    var enrollModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("EnrollModule");
                    var context = {
                        "identifier" : _getQueryParameter("qp")
                    };
                    kony.mvc.MDAApplication.getSharedInstance().appContext.deeplinkUrl = {
                        formID : "frmLogin"
                    };
                    enrollModule.presentationController.showEnrollPage(context);           
                    return;
                }
                // other cases
            case "frmResetPassword" : 
                {
                    var config = applicationManager.getConfigurationManager(); 
                    if(config.isAppRefreshed==="true"){
                        return;
                    }
                    var authModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("AuthModule");
                    var context = {
                        "identifier" : _getQueryParameter("qp")
                    };
                    kony.mvc.MDAApplication.getSharedInstance().appContext.deeplinkUrl = {
                        formID : "frmLogin"
                    };
                    authModule.presentationController.showResetPasswordPageThroughLink(context);           
                    return;
                }
          default:
            {
              if(ssolength >0 && ssotoken !== undefined && ssotoken !== null){
                return ssotoken;
              }
              else{
                return sessiontoken; 
              }
            }
        }
    };

    return {
        deeplinking: _deeplinking
    };
    

});