define([],function () {


  var SDKConstants = {
    "PIN_REQUEST" : 100,
    "TX_ACCEPTED" : 101,
    "TX_DENIED"   : 102
  };


  function HIDApproveSDKManager(){
    this.hidApplicationManagerInstance= null;
    this.deviceInfo = kony.os.deviceInfo();
  }

  HIDApproveSDKManager.getHIDApproveSDKManager = function(){
    if (!this.hidApplicationManagerInstance)
      this.hidApplicationManagerInstance = new HIDApproveSDKManager();
    return this.hidApplicationManagerInstance;
  };

  HIDApproveSDKManager.prototype.registerWithHIDPushService = function(){

    var deviceName = this.deviceInfo.name;
    var config = {};
    //Subscribe to APNS
    if (deviceName === "iPhone" || deviceName === "iPhone Simulator"
        || deviceName === "iPad" || deviceName === "iPad Simulator"){
      config = [0,1,2];
    }else{
      config = {senderid : "796499215173"};
    }
    kony.push.register(config);  

  };

  HIDApproveSDKManager.prototype.saveHIDPushRegId = function(regId){
    var pushRegData = {
      "securedata":regId,
      "secureaccount":"hid_push_"+regId,
      "identifier":"pushRegId"
    };
    kony.keychain.save(pushRegData);
    
    var sdk = new com.temenos.hid.approvesdk({
      "autogrowMode": kony.flex.AUTOGROW_NONE,
      "clipBounds": true,
      "height": "100%",
      "id": "sdk",
      "isVisible": true,
      "layoutType": kony.flex.FREE_FORM,
      "left": "0dp",
      "masterType": constants.MASTER_TYPE_USERWIDGET,
      "isModalContainer": true,
      "appName": "ResourcesHIDMA",
      "skin": "slFbox",
      "top": "0dp",
      "width": "100%",
      "overrides": {
        "sdk": {
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
    sdk.updatePushRegistrationToken(regId);
    
  };

  HIDApproveSDKManager.prototype.retrieveHIDPushRegId = function(){
    var key = {"identifier":"pushRegId"};
    var pushRegData = kony.keychain.retrieve(key);
    var pushRegJSON = JSON.parse(JSON.stringify(pushRegData));
    if(pushRegJSON){
      return pushRegJSON.securedata;
    }else{
      return null;
    }
  };

  HIDApproveSDKManager.prototype.receivedPushNotification = function(message, onlineOrOffline) {
    // If notification is not originated from HID cloud, ignore elsae process
    if(!message.tds){
      return;
    }

    HIDApproveSDKManager.prototype.showApprovalScreen.call(this,message);

  };
  HIDApproveSDKManager.prototype.showApprovalScreen = function(tds) {

    var currentForm = kony.application.getCurrentForm();
    var sdk = new com.temenos.hid.approvesdk({
      "autogrowMode": kony.flex.AUTOGROW_NONE,
      "clipBounds": true,
      "height": "100%",
      "id": "sdk",
      "isVisible": true,
      "layoutType": kony.flex.FREE_FORM,
      "left": "0dp",
      "masterType": constants.MASTER_TYPE_USERWIDGET,
      "isModalContainer": true,
      "appName": "ResourcesHIDMA",
      "skin": "slFbox",
      "top": "0dp",
      "width": "100%",
      "overrides": {
        "sdk": {
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

    if(currentForm.sdk){
      currentForm.sdk.resetPinDialog();
      currentForm.remove(currentForm.sdk);
    }
    currentForm.add(sdk);
    currentForm.sdk.setVisibility(true);
    currentForm.sdk.preshow();
    currentForm.sdk.showApprovalScreen(tds, function(status,policyJSON) {
      kony.application.dismissLoadingScreen();
      if(SDKConstants.PIN_REQUEST === status) {
         var pinLength = JSON.parse(policyJSON).MAX_LENGTH;
         currentForm.sdk.showPinDialog(pinLength);
      }else if(SDKConstants.TX_ACCEPTED === status || SDKConstants.TX_DENIED === status){
         var msg = JSON.parse(policyJSON);
         const dataToDisplay = {
           msgTitle: msg.msgTitle,
           msgDesc: msg.msgDesc
         };
         currentForm.sdk.showOrHideTxStatus(status,dataToDisplay);
      }
    });
  };
	
  HIDApproveSDKManager.prototype.registerSDKCallBack = function(status){

    kony.application.dismissLoadingScreen();
    var currentForm = kony.application.getCurrentForm(); 

    if(SDKConstants.PIN_REQUEST === status) {
      currentForm.sdk.showPinDialog();
    }

  };
  
  HIDApproveSDKManager.prototype.getSdkInstance = function(){

   var sdk = new com.temenos.hid.approvesdk({
      "autogrowMode": kony.flex.AUTOGROW_NONE,
      "clipBounds": true,
      "height": "100%",
      "id": "sdk",
      "isVisible": true,
      "layoutType": kony.flex.FREE_FORM,
      "left": "0dp",
      "masterType": constants.MASTER_TYPE_USERWIDGET,
      "isModalContainer": true,
     "appName": "ResourcesHIDMA",
      "skin": "slFbox",
      "top": "0dp",
      "width": "100%",
      "overrides": {
        "sdk": {
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
    
    return sdk;

  };

  return HIDApproveSDKManager;
});
