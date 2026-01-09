/**
 * Author: Kalyani Gurrapu (KH1755)
 * Purpose: To handle all the unhandled and thrown exceptions
**/

var GlobalExceptionHandler = GlobalExceptionHandler || {};

GlobalExceptionHandler = {
  
    /** Global Variables **/

    ActionConstants :{
      LOG: 5,
      ALERT: 4,
      CHOICE: 3,
      LOGOUT: 2,
      BLOCK: 1
    },
  
    StandardErrorMessage : "kony.error.StandardErrorMessage",


    /**
          Global Exception handler
          exceptionObject - Can be null,
                          - Can be an i18n Key, if i18n key entry is not present then standard error will be considered.
                          - Can be an exception Object
    **/
    exceptionHandler : function (exceptionObject) {
      try {
		
        // If the exceptionObject is null
          if(kony.sdk.isNullOrUndefined(exceptionObject)){
            //#ifdef release
            	kony.ui.Alert(kony.i18n.getLocalizedString(GlobalExceptionHandler.StandardErrorMessage));
            //#endif

            //#ifdef debug
            	kony.ui.Alert(kony.i18n.getLocalizedString("kony.error.NullThrown"));
            //#endif
            GlobalExceptionHandler.sendMetrics("Empty exception", "No Exception Object Found");
            return;
          }


        // If the exceptionObject is a String 
          if(typeof exceptionObject === 'string' || exceptionObject instanceof String) {
            var msg = kony.i18n.getLocalizedString(exceptionObject);
            if(msg === "" || kony.sdk.isNullOrUndefined(msg)) {
              //#ifdef release
              		msg = kony.i18n.getLocalizedString(GlobalExceptionHandler.StandardErrorMessage);
              //#endif
              
              //#ifdef debug
              		msg = kony.i18n.getLocalizedString("kony.error.i18nNotFound") +"\""+exceptionObject+"\"";
              //#endif
            } 
            kony.ui.Alert(msg);
            GlobalExceptionHandler.forcePrint(msg);
            GlobalExceptionHandler.sendMetrics(msg, msg);
            return;
          }


        //If Unhandled Exception / Exception object is thrown as it is without adding extra params to it
          var exceptionString = GlobalExceptionHandler.extractTheExceptionMessage(exceptionObject);
          if(kony.sdk.isNullOrUndefined(exceptionObject.Action)) {
            //#ifdef release
            	kony.ui.Alert(kony.i18n.getLocalizedString(GlobalExceptionHandler.StandardErrorMessage));
            //#endif
            
            //#ifdef debug
            	kony.ui.Alert(kony.i18n.getLocalizedString("kony.error.Observing") + exceptionString);
            //#endif

            GlobalExceptionHandler.sendMetrics(exceptionString, JSON.stringify(exceptionObject));
            return;
          }

        
        //If Handled Exception / Exception object is thrown by adding extra params to it
          var action = GlobalExceptionHandler.getCumulativeAction(exceptionObject);
          //#ifdef debug
              action.msg = kony.i18n.getLocalizedString("kony.error.Observing") + exceptionString + "\n\n\n" + JSON.stringify(exceptionObject.stackTrace);
          //#endif

          GlobalExceptionHandler.forcePrint(exceptionString);
          GlobalExceptionHandler.forcePrint(exceptionObject.stackTrace);
          GlobalExceptionHandler.sendMetrics(exceptionString, JSON.stringify(exceptionObject.stackTrace));
          GlobalExceptionHandler.takeActionOnException(action); 
      
      
      }
      catch(err) {
		  GlobalExceptionHandler.forcePrint("Error occurred while parsing exception. \nError:"+ JSON.stringify(err));
      }

    },

  
    /**
            Extracts the actual exception message from the Object
      **/
    extractTheExceptionMessage : function(exceptionObject) {
        try{
            //Extract the Original Exception Message
            var exceptionString ="";
            if("errorMessage" in exceptionObject){
              exceptionString += exceptionObject.errorMessage;
            }
            else if("message" in exceptionObject){
              exceptionString += exceptionObject.message;
            }
          	else {
              exceptionString += " " + kony.i18n.getLocalizedString("kony.error.ErrorAt");
            }
            if("sourceURL" in exceptionObject){
              exceptionString += " " + kony.i18n.getLocalizedString("kony.error.At") + " : " + exceptionObject.sourceURL;
            }
            if("line" in exceptionObject){
              exceptionString += " line # " + exceptionObject.line;
            }

            return exceptionString;
        }
        catch(err) {
          	GlobalExceptionHandler.forcePrint("Error occurred while extracting the exception message. \nError:"+ JSON.stringify(err));
        }
    },
  
  
    /**
          performs the action based on action passed
      **/
    takeActionOnException : function(action){
        try{
          var pspConfig = {"iconPosition" : constants.ALERT_CONTENT_ALIGN_CENTER,
                               "contentAlignment":constants.ALERT_ICON_POSITION_LEFT } ;
          var basicProperties = {};
          
          var currentForm = kony.application.getCurrentForm();
          var navManager = applicationManager.getNavigationManager();
          
          if(action.Action == GlobalExceptionHandler.ActionConstants.ALERT) {
              basicProperties = 
                  {
                    "message": action.msg,
                    "alertType": constants.ALERT_TYPE_INFO,
                    "alertTitle": "INFO",
                    "yesLabel": "Continue",
                    "alertIcon": "",
                    "alertHandler": function(response) {}
                  };
              	if(currentForm !== null)
                  kony.ui.Alert(basicProperties, pspConfig);
              	else
                  navManager.setCustomInfo("appLaunchError", {basic: basicProperties, psp:pspConfig});
            }
            else if(action.Action == GlobalExceptionHandler.ActionConstants.CHOICE) {
              basicProperties = 
                  {
                    "message": action.msg,
                    "alertType": constants.ALERT_TYPE_CONFIRMATION,
                    "alertTitle": "Please Confirm",
                    "yesLabel": "Exit the app",
                    "noLabel": "Continue",
                    "alertIcon": "",
                    "alertHandler": function(response) { if(response === true){ kony.application.exit();}}
                  };
              if(currentForm !== null)
                kony.ui.Alert(basicProperties, pspConfig);
              else
                navManager.setCustomInfo("appLaunchError", {basic: basicProperties, psp:pspConfig});
            }
            else if(action.Action == GlobalExceptionHandler.ActionConstants.LOGOUT) {
				var result =  kony.os.deviceInfo().name === "thinclient" ? "Logout" : "Sign Out"; 
                basicProperties = 
                  {
                  "message": action.msg,
                  "alertType": constants.ALERT_TYPE_ERROR,
                  "alertTitle": "ERROR",
                  "yesLabel": result,
                  "alertIcon": "",
                  "alertHandler": function(response) {
                    					var authMode = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("AuthModule");
              							authMode.presentationController.onLogout();
                  					}
                };

              
              if(currentForm !== null)	
              	kony.ui.Alert(basicProperties, pspConfig);
              else
                navManager.setCustomInfo("appLaunchError", {basic: basicProperties, psp:pspConfig});
            }
            else if(action.Action == GlobalExceptionHandler.ActionConstants.BLOCK) {
              	basicProperties = 
                  {
                    "message": action.msg,
                    "alertType": constants.ALERT_TYPE_ERROR,
                    "alertTitle": "ERROR",
                    "yesLabel": "Exit the app",
                    "alertIcon": "",
                    "alertHandler": function(response) { if(response === true){ kony.application.exit();}}
                  };
				if(currentForm !== null)	
                  kony.ui.Alert(basicProperties, pspConfig);
              	else
                  navManager.setCustomInfo("appLaunchError", {basic: basicProperties, psp:pspConfig});
            }
            else {
              GlobalExceptionHandler.forcePrint(action.msg);
            }
          
        }
        catch(err) {
          	GlobalExceptionHandler.forcePrint("Error occurred while taking the action. \nError:"+ JSON.stringify(err));
        }
    },


    /**
          function to send metrics to MF
          exceptionType - Type of exception
          stackTrace - Exception Stacktrace
      **/
    sendMetrics : function (exceptionType, stackTrace) {
        try{
            //Send Exception metrics to MF
            var customMetrics = [
              {
                "ExpType": exceptionType,
                "AppVersion": appConfig.appVersion,
                "EXPStackTrace" : stackTrace,
              }
            ];
            KNYMetricsService.sendCustomMetrics("CustomGlobalExceptionHandler", customMetrics);
        }
        catch(err) {
          	GlobalExceptionHandler.forcePrint("Error occurred while sending the metrics. \nError:"+ JSON.stringify(err));
        }
    },


    /**
          If the exception is cascaded, then this function will help us get the priority action by traversing the entire stacktrace
    **/
    getCumulativeAction : function(exceptionObject)
  	{
        try {
            var action = {
                Action: exceptionObject.Action,
                msg: exceptionObject.msg
            };

            for(var i=exceptionObject.stackTrace.length - 1; i >= 0 ; i--)
            {
                var tempAction = exceptionObject.stackTrace[i].Action;
                if(tempAction == GlobalExceptionHandler.ActionConstants.BLOCK) {
                  	action = exceptionObject.stackTrace[i];
                  	break;
                }
                else if(tempAction <= action.Action) {
                  	action = exceptionObject.stackTrace[i];
                }
            }
            return action;
        }
        catch(err) {
          	GlobalExceptionHandler.forcePrint("Error occurred while extracting the cumulative action. \nError:"+ JSON.stringify(err));
        }
    },

    
    /**
          This function will log the messages in release and debug mode.

    **/
    logInReleaseMode : function(logMessage){
        try{
            //#ifdef iphone
            ExceptionLogger.log("An unexpected error occurred:"+logMessage);
            //#endif 
            
          	//#ifdef ipad
            ExceptionLogger.log("An unexpected error occurred:"+logMessage);
            //#endif 
          
            //#ifdef android
            var log = java.import("android.util.Log");
            log.d("An unexpected error occurred:", logMessage);
            //#endif
          
            //#ifdef tabrcandroid
            var log = java.import("android.util.Log");
            log.d("An unexpected error occurred:", logMessage);
            //#endif
          
            //#ifdef desktopweb
            console.log("An unexpected error occurred:", logMessage);
            //#endif
          	
        }
        catch(err) {
          	kony.print("Error occurred while logging in release mode. \nError:"+ JSON.stringify(err));
          	kony.print("An unexpected error occurred:"+logMessage);
        }
    },

    /**
          This function will print the logMessage, irrespective of debug/release mode.
    **/
    forcePrint : function(logMessage) {
      var configManager = applicationManager.getConfigurationManager();
      if(configManager.isDebugMode()) {
        	GlobalExceptionHandler.logInReleaseMode(logMessage);
      }
      else {
        	kony.print("DebugMode is not enabled in the configuration");
      }
    },
  

    /**
          This function will add few extra parameters to the exception object and return it.
          exceptionObject - exception Object to be updated
          message - user defined message to be added to the exception. (We should be passing an i18n key here instead of actual message)
          action - user defined action to be added to the exception. It should GlobalExceptionHandler.ActionConstants 
    **/
    addMessageAndActionForException : function(exceptionObject, message, action, functionName)
    {
        try {
          
			if(!kony.sdk.isNullOrUndefined(exceptionObject.message))
            {
				exceptionObject.errorMessage = exceptionObject.message;
            }
            var currentTrace = {};
            if(kony.sdk.isNullOrUndefined(exceptionObject.stackTrace))
            {	
              exceptionObject.stackTrace = [];
            }
            
          	currentTrace.functionName = functionName;
            exceptionObject.functionName = functionName;
          
            var i18nMessage = kony.i18n.getLocalizedString(message);
            if(exceptionObject.msg === "" || kony.sdk.isNullOrUndefined(i18nMessage)) {
              exceptionObject.msg = kony.i18n.getLocalizedString(GlobalExceptionHandler.StandardErrorMessage);
              currentTrace.msg = kony.i18n.getLocalizedString(GlobalExceptionHandler.StandardErrorMessage);
            }
            else {
              currentTrace.msg = i18nMessage;
              exceptionObject.msg = i18nMessage;
            }

            currentTrace.Action = action;
            exceptionObject.Action = action;

            exceptionObject.stackTrace.push(currentTrace);

            return exceptionObject;
        }
        catch(err) {
          	GlobalExceptionHandler.forcePrint("Error occurred while adding message and action to the exception. \nError:"+ JSON.stringify(err));
        }
    }
  
};