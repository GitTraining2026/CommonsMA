define(function () {

  return {
    /**
     * The following Error Codes should match from the codes in the Android/iOS sdk
     */
    SDKConstants: {
      "PIN_REQUEST" : 100,
      "TX_ACCEPTED" : 101,
      "TX_DENIED" : 102,
      "INCORRET_PIN" : 103,
      "PIN_LOCKED" : 104,
      "PIN_REMAINING_TRIES" :105,
      "OTP_GENERATED" : 106,
      "ASYNC_OTP_GENERATED" : 107,
      "OKRA_OTP_GENERATED" : 107,
      "PIN_UPDATE_SUCCESS" : 108,
      "PIN_UPDATE_FAILED" : 109,
      "INVALID_PIN": 110,
      "PIN_NOT_YET_UPDATEABLE": 111,
      "BIOMETRICS_ENABLED" : 115,
      "BIOMETRICS_NOTENABLED":116,
      "BIOMETRICS_SUCCESS":112,
      "BIOMETRICS_FAILED": 113,
      "BIOMETRICS_NOTVALID": 114,
      "SIGN_TRANSACTION_PIN_SCB": 5000,
      "SIGN_TRANSACTION_PIN_FCB": 5001

    },
    SDKStringConstants:{
      "SUCCESS" : "Success",
      "UPDATE_PIN_SUCCESS" : "updateSuccess",
      "UPDATE_PIN_Failure" : "updateFailed",
      "TOUCH_ID": "touchid",
      "PIN": "pin",
      "PROGRESS": "Progress",
      "PWD_ERROR": "Error",
      "PIN_NOT_YET_UPDATEABLE": "Password change is too soon (minimum age 1, current 0 days)",
      "INCORRECT_PIN": "Password is incorrect",
      "INVALID_PIN": "no sequential characters allowed"
    },

    "CREATE_CHEQUE_BOOK_REQUEST": {"objectService":"SCATransactionObjects", "dataModel" : "TransactionSigning", "operation":"verifyTransactionSignature"},
    "APPROVE_CHEQUE_BOOK_REQUEST": {"objectService":"SCATransactionObjects", "dataModel" : "TransactionSigning", "operation":"verifyTransactionSignature"},
    "CANCEL_CHEQUE_BOOK_REQUEST": {"objectService":"SCATransactionObjects", "dataModel" : "TransactionSigning", "operation":"verifyTransactionSignature"},
    "REJECT_CHEQUE_BOOK_REQUEST": {"objectService":"SCATransactionObjects", "dataModel" : "TransactionSigning", "operation":"verifyTransactionSignature"},
    "SUSPEND_USER": {"objectService":"SCAObjects", "dataModel" : "SCAUser", "operation":"updateMyStatus"},

    callBackendService: function({objServiceName, objName, operationName, payload, successCallback, errorCallback}){
      try {
        const objSvc = kony.sdk.getCurrentInstance().getObjectService(objServiceName, {"access":"online"});
        const dataObject = new kony.sdk.dto.DataObject(objName);
        for(let key in payload){
          dataObject.addField(key,payload[key]);
        }
        const options = {
          "dataObject": dataObject
        };
        if(operationName==="getPasswordRulesAndPolicy"){
          kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository(objName).setHeaderParams({"Accept-Language":kony.i18n.getCurrentLocale()});
        }
        const serviceCallback = function(res){
          if(res && res.errmsg){
            kony.print(`Call FAILED ObjectService: ${objServiceName}, ObjectName: ${objName}, OperationName: ${operationName} ` + JSON.stringify(res));
            errorCallback(res.errmsg);
          } else {
            kony.print(`Call SUCCESSFUL ObjectService: ${objServiceName}, ObjectName: ${objName}, OperationName: ${operationName} ` + JSON.stringify(res));
            successCallback(res);
          }
        };
        const serviceErrorCallback = function(err){
          kony.print(`Call FAILED ObjectService: ${objServiceName}, ObjectName: ${objName}, OperationName: ${operationName} ` + JSON.stringify(err));
          errorCallback(err.errorMessage);
        };
        objSvc.customVerb(operationName, options, serviceCallback, serviceErrorCallback);
      } catch (err){
        errorCallback(err);
      }
    },


    addSCANotification: function(request, successCallback, failureCallback){
      let self = this;
      let currForm = kony.application.getCurrentForm();
      if(currForm.scanotification) {
        currForm.remove(currForm.scanotification);
      }
      var scanotification = new com.temenos.infinity.mb.sca.scanotification({
        "height": "100%",
        "id": "scanotification",
        "isVisible": true,
        "left": "0dp",
        "masterType": constants.MASTER_TYPE_USERWIDGET,
        "isModalContainer": false,
        "skin": "slFbox",
        "top": "0dp",
        "width": "100%",
        "appName": "ResourcesHIDMA",
        "zIndex": 1,
        "overrides": {
          "scanotification": {
            "right": "viz.val_cleared",
            "bottom": "viz.val_cleared",
            "minWidth": "viz.val_cleared",
            "minHeight": "viz.val_cleared",
            "maxWidth": "viz.val_cleared",
            "maxHeight": "viz.val_cleared",
            "centerX": "viz.val_cleared",
            "centerY": "viz.val_cleared"
          }
        }
      }, {
        "overrides": {}
      }, {
        "overrides": {}
      });
      scanotification.serviceName = request.serviceName;
      scanotification.serviceKey = request.serviceKey;
      scanotification.context = request.context;
      scanotification.objectService = self[request.serviceName].objectService ;
      scanotification.dataModel = self[request.serviceName].dataModel ;
      scanotification.operation = self[request.serviceName].operation ;
      scanotification.onSuccessCallback = successCallback;
      scanotification.onFailureCallback = failureCallback;
      currForm.add(scanotification);
      scanotification.showOKRAAuthentication();
    },

    showSCANotification: function({response, serviceName, moduleName, serviceCallbackName, failureCallbackName}){
      const request = {
        "serviceName" : serviceName,
        "serviceKey": response.MFAAttributes.serviceKey, 
        "context": response.MFAAttributes.serviceKey + "|" + serviceName
      };
      const presentationController = applicationManager.getModulesPresentationController(moduleName);
      const presentationServiceCallback = presentationController[serviceCallbackName];
      const presentationFailureCallback = presentationController[failureCallbackName];
      this.addSCANotification(request, presentationServiceCallback, presentationFailureCallback);
    },

  };

});
