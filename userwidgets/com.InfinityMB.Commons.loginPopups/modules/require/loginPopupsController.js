define(['./LoginPopupsUtility'/*, './LoginPopupsDAO'*/],function(LoginPopupsUtility/*, LoginPopupsDAO*/) {
//   var LoginDAO = require("com/InfinityMB/Commons/login/LoginDAO");
  return {

    constructor: function(baseConfig, layoutConfig, pspConfig) {
      this._identityServiceName = "";
      
      this._btnTouchPinFaceIdSkin="";
      this._pinPopupTitleSkin="";
      this._pinPopupNumbersSkin="";
      this._pinPopupClearButtonSkin="";
      this._popupCancelButtonSkin="";
      this._faceIDPopupTitleSkin="";
      this._faceIDPopupDescSkin="";
      
      this._faceIDPopupImage="";
      
      this._touchIDBtnText="";
      this._pinIDBtnText="";
      this._faceIDBtnText="";
      this._pinPopupTitleText="";
      this._popupCancelBtnText="";
      this._faceIDPopupTitleText="";
      this._faceIDPopupDescText="";

      this.LoginPopupsUtility = new LoginPopupsUtility();
    //   this.LoginPopupsDAO = new LoginPopupsDAO();
    //   this.LoginDAO = new LoginDAO();
      this.dialPadNo="";
      this.lengthOfDialNo=0;
      this.currentAuthMode="";
    },

    //Logic for getters/setters of custom properties
    initGettersSetters: function() {
      defineSetter(this, "identityServiceName", function(val){
        if((typeof val=='string') && (val != "")){
          this._identityServiceName=val;
        }
      });
      defineGetter(this, "identityServiceName", function(){
        return this._identityServiceName;
      });
      defineSetter(this, "btnTouchPinFaceIdSkin", function(val){
        if((typeof val=="string") && (val != "")){
          this._btnTouchPinFaceIdSkin=val;
        }
      });
      defineGetter(this, "btnTouchPinFaceIdSkin", function(){
        return this._btnTouchPinFaceIdSkin;
      });
      defineSetter(this, "pinPopupTitleSkin", function(val){
        if((typeof val=="string") && (val != "")){
          this._pinPopupTitleSkin=val;
        }
      });
      defineGetter(this, "pinPopupTitleSkin", function(){
        return this._pinPopupTitleSkin;
      });
      defineSetter(this, "pinPopupNumbersSkin", function(val){
        if((typeof val=="string") && (val != "")){
          this._pinPopupNumbersSkin=val;
        }
      });
      defineGetter(this, "pinPopupNumbersSkin", function(){
        return this._pinPopupNumbersSkin;
      });
      defineSetter(this, "pinPopupClearButtonSkin", function(val){
        if((typeof val=="string") && (val != "")){
          this._pinPopupClearButtonSkin=val;
        }
      });
      defineGetter(this, "pinPopupClearButtonSkin", function(){
        return this._pinPopupClearButtonSkin;
      });
      defineSetter(this, "popupCancelButtonSkin", function(val){
        if((typeof val=="string") && (val != "")){
          this._popupCancelButtonSkin=val;
        }
      });
      defineGetter(this, "popupCancelButtonSkin", function(){
        return this._popupCancelButtonSkin;
      });
      defineSetter(this, "faceIDPopupTitleSkin", function(val){
        if((typeof val=="string") && (val != "")){
          this._faceIDPopupTitleSkin=val;
        }
      });
      defineGetter(this, "faceIDPopupTitleSkin", function(){
        return this._faceIDPopupTitleSkin;
      });
      defineSetter(this, "faceIDPopupDescSkin", function(val){
        if((typeof val=="string") && (val != "")){
          this._faceIDPopupDescSkin=val;
        }
      });
      defineGetter(this, "faceIDPopupDescSkin", function(){
        return this._faceIDPopupDescSkin;
      });
      defineSetter(this, "faceIDPopupImage", function(val){
        if((typeof val=="string") && (val != "")){
          this._faceIDPopupImage=val;
        }
      });
      defineGetter(this, "faceIDPopupImage", function(){
        return this._faceIDPopupImage;
      });
      defineSetter(this, "touchIDBtnText", function(val){
        if((typeof val=="string") && (val != "")){
          this._touchIDBtnText=val;
        }
      });
      defineGetter(this, "touchIDBtnText", function(){
        return this._touchIDBtnText;
      });
      defineSetter(this, "pinIDBtnText", function(val){
        if((typeof val=="string") && (val != "")){
          this._pinIDBtnText=val;
        }
      });
      defineGetter(this, "pinIDBtnText", function(){
        return this._pinIDBtnText;
      });
      defineSetter(this, "faceIDBtnText", function(val){
        if((typeof val=="string") && (val != "")){
          this._faceIDBtnText=val;
        }
      });
      defineGetter(this, "faceIDBtnText", function(){
        return this._faceIDBtnText;
      });
      defineSetter(this, "pinPopupTitleText", function(val){
        if((typeof val=="string") && (val != "")){
          this._pinPopupTitleText=val;
        }
      });
      defineGetter(this, "pinPopupTitleText", function(){
        return this._pinPopupTitleText;
      });
      defineSetter(this, "popupCancelBtnText", function(val){
        if((typeof val=="string") && (val != "")){
          this._popupCancelBtnText=val;
        }
      });
      defineGetter(this, "popupCancelBtnText", function(){
        return this._popupCancelBtnText;
      });
      defineSetter(this, "faceIDPopupTitleText", function(val){
        if((typeof val=="string") && (val != "")){
          this._faceIDPopupTitleText=val;
        }
      });
      defineGetter(this, "faceIDPopupTitleText", function(){
        return this._faceIDPopupTitleText;
      });
      defineSetter(this, "faceIDPopupDescText", function(val){
        if((typeof val=="string") && (val != "")){
          this._faceIDPopupDescText=val;
        }
      });
      defineGetter(this, "faceIDPopupDescText", function(){
        return this._faceIDPopupDescText;
      });
    },

    raiseComponentEvent: function(methodName, argument=null){
      // This method invokes the appropriate event exposed  by the component
      const scopeObj = this;
      switch(methodName){
        // case 'onLoginSuccess':
        //   if(scopeObj.onLoginSuccess) scopeObj.onLoginSuccess(argument);
        //   break;
        // case 'onLoginFailure':
        //   if(scopeObj.onLoginFailure) scopeObj.onLoginFailure(argument);
        //   break;
        case 'onPopupVisible':          
          if(scopeObj.onPopupVisible) scopeObj.onPopupVisible(argument);
          break;
      }
    },

    preShow: function(){     
      this.setTextFromi18n();
      this.setFlowActions();      
      this.setDialPadActions();
      this.resetUI();
    },
    
    resetUI: function(){
      this.assignDefaultSkins();
      this.assignDefaultText();
      this.view.forceLayout();
    },
    
    getStringFromi18n: function(stringValue){
      return  kony.i18n.getLocalizedString(stringValue) ? kony.i18n.getLocalizedString(stringValue) : stringValue;
    },

    setTextFromi18n: function(){
      // Assigns Text to respective variables from Text-based COMPONENT PROPERTIES
      this._touchIDBtnText=this.getStringFromi18n(this._touchIDBtnText);
      this._pinIDBtnText=this.getStringFromi18n(this._pinIDBtnText);
      this._faceIDBtnText=this.getStringFromi18n(this._faceIDBtnText);
      this._pinPopupTitleText=this.getStringFromi18n(this._pinPopupTitleText);
      this._popupCancelBtnText=this.getStringFromi18n(this._popupCancelBtnText);
      this._faceIDPopupTitleText=this.getStringFromi18n(this._faceIDPopupTitleText);
      this._faceIDPopupDescText=this.getStringFromi18n(this._faceIDPopupDescText);
    },
    
    assignDefaultSkins: function(){
      // Assigns skins to widgets from COMPONENT PROPERTY Variables
      this.view.btnTouchId.skin = this._btnTouchPinFaceIdSkin;
      this.view.btnFaceId.skin = this._btnTouchPinFaceIdSkin;
      this.view.btnPinId.skin = this._btnTouchPinFaceIdSkin;
      this.view.PinEntryLabel.skin = this._pinPopupTitleSkin;
      this.view.btnOne.skin = this._pinPopupNumbersSkin;
      this.view.btnTwo.skin = this._pinPopupNumbersSkin;
      this.view.btnThree.skin = this._pinPopupNumbersSkin;
      this.view.btnFour.skin = this._pinPopupNumbersSkin;
      this.view.btnFive.skin = this._pinPopupNumbersSkin;
      this.view.btnSix.skin = this._pinPopupNumbersSkin;
      this.view.btnSeven.skin = this._pinPopupNumbersSkin;
      this.view.btnEight.skin = this._pinPopupNumbersSkin;
      this.view.btnNine.skin = this._pinPopupNumbersSkin;
      this.view.btnZero.skin = this._pinPopupNumbersSkin;
      this.view.flxCross.skin = this._pinPopupClearButtonSkin;
      this.view.lblCancel.skin = this._popupCancelButtonSkin;
      this.view.lblFaceIdTitle.skin = this._faceIDPopupTitleSkin;
      this.view.lblAuthenticateMsgFI.skin = this._faceIDPopupDescSkin;
      this.view.lblCancelFI.skin = this._popupCancelButtonSkin;
      this.view.imgFaceId.src = this._faceIDPopupImage;
    },
    
    assignDefaultText: function(){
      // Assigns text to widgets from COMPONENT PROPERTY Variables
      if(this.LoginPopupsUtility.getDeviceName() === "iPhone"){
        this.view.btnTouchId.text = this._touchIDBtnText;
      } else{
        this.view.btnTouchId.text = kony.i18n.getLocalizedString("kony.mb.devReg.Biometric");
      }
      this.view.btnFaceId.text = this._faceIDBtnText;
      this.view.btnPinId.text = this._pinIDBtnText;
      this.view.PinEntryLabel.text = this._pinPopupTitleText;
      this.view.lblCancel.text = this._popupCancelBtnText;
      this.view.lblFaceIdTitle.text = this._faceIDPopupTitleText;
      this.view.lblAuthenticateMsgFI.text = this._faceIDPopupDescText;
      this.view.lblCancelFI.text = this._popupCancelBtnText;
    },
    
    setFlowActions: function() {
      const scopeObj = this;
      this.view.flxCross.onClick = function(){
        scopeObj.flxCancelDialPadOnClick();
      };
      this.view.btnTouchId.onTouchEnd = function(){
        scopeObj.showTouchIdAndroid();
        kony.application.setApplicationCallbacks({onbackground: ()=>{
          scopeObj.cancelTouchIdAuth();            
        }});
        scopeObj.setVisibilityForSpecificLoginType('touchid');        
        scopeObj.raiseComponentEvent('onPopupVisible', true);
      };
      this.view.btnPinId.onTouchEnd = function(){
        scopeObj.setVisibilityForSpecificLoginType('pin');
        scopeObj.raiseComponentEvent('onPopupVisible', true);
      };
      this.view.flxbottomContainer.onTouchEnd = function(){
        scopeObj.closePopup('pin');
        scopeObj.raiseComponentEvent('onPopupVisible', false);
      };
      this.view.btnFaceId.onTouchEnd = function(){
        scopeObj.setVisibilityForSpecificLoginType('faceid');
        scopeObj.raiseComponentEvent('onPopupVisible', true);
        scopeObj.initiateLoginFlow("faceid");
      };
      this.view.flxCancelFI.onTouchEnd = function(){
        scopeObj.closePopup('faceid');
        scopeObj.raiseComponentEvent('onPopupVisible', false);
        scopeObj.initiateLoginFlow("touchid");
      };
    },

    /*LOGIN POPUPS COMMON FUNCTIONALITY BEGIN ===============================================================================*/   
    setDefaultMode: function(authMode) {
      let userManager = applicationManager.getUserPreferencesManager();
      userManager.setDefaultAuthMode(authMode);
    },
    
    setFaceIdflag: function(value) {
      let userManager = applicationManager.getUserPreferencesManager();
      userManager.updateFaceIdFlag(value);
    },
    
    setTouchIdflag: function(value) {
      let userManager = applicationManager.getUserPreferencesManager();
      userManager.upadateTouchIdFlag(value);
    },
    
    setRememberMeFlag: function(value) {
      let userManager = applicationManager.getUserPreferencesManager();
      userManager.updateRememberMeFlag(value);
    },
    
    setVisibilityForSpecificLoginType: function(loginType="password"){
      // Method EXPOSED
      /*
      	loginType is expected to be one of the following:        
        'pin': Login using 6-Digit Pin 
        'touchid': Login using TouchID
        'faceid': Login using FaceID (Available only in iPhone)
        'password' : Normal Login Flow using Password
      */
      switch(loginType){
        case 'pin':
          this.view.flxLoginPopups.setVisibility(true);
          this.view.flxButtons.setVisibility(true);
          this.view.flxEnterPin.setVisibility(true);
          this.view.flxFaceIdPopUp.setVisibility(false);          
          this.clearProgressFlexLogin();
          break;
        case 'touchid':
          this.view.flxLoginPopups.setVisibility(false);
          this.view.flxButtons.setVisibility(true);
          break;
        case 'faceid':
          this.view.flxButtons.setVisibility(true);
          this.view.flxEnterPin.setVisibility(false);
          this.view.flxLoginPopups.setVisibility(false);
          // AAC-7468          
          //this.view.flxFaceIdPopUp.setVisibility(true);
          break;
        case 'password':
          this.view.flxLoginPopups.setVisibility(false);
          this.view.flxButtons.setVisibility(false);
          break;
      }
      this.setButtonVisibility(loginType);
    },

    setButtonVisibility: function(loginType){
      switch(loginType){
        case 'pin':
          this.view.btnTouchId.setVisibility(false);
          this.view.btnFaceId.setVisibility(false);
          this.view.btnPinId.setVisibility(true);
          break;
        case 'touchid':
          this.view.btnTouchId.setVisibility(true);
          this.view.btnFaceId.setVisibility(false);
          this.view.btnPinId.setVisibility(false);
          break;
        case 'faceid':
          this.view.btnTouchId.setVisibility(false);
          this.view.btnFaceId.setVisibility(true);
          this.view.btnPinId.setVisibility(false);
          break;
        case 'password':
          this.view.btnTouchId.setVisibility(false);
          this.view.btnFaceId.setVisibility(false);
          this.view.btnPinId.setVisibility(false);
          break;
      }
    },

    closePopup:function(loginType){
      switch(loginType){
        case 'pin':
          this.dialPadNo = "";
          this.lengthOfDialNo = 0;
          this.view.flxLoginPopups.setVisibility(false);
          this.view.flxEnterPin.setVisibility(false);
          break;
        case 'faceid':
          this.view.flxLoginPopups.setVisibility(false);
          this.view.flxFaceIdPopUp.setVisibility(false);
          break;
      }
    },
    
    initiateLoginFlow: function(loginType){
      // METHOD EXPOSED
      if(loginType==="faceid"){
        this.faceIdLogin();
      } else if(loginType==="touchid"){
        this.touchIdLogin();
      }
    },
    
    // onLoginSuccessCallback: function(resSuccess){
    //   const scopeObj = this;
    //   let userMan = applicationManager.getUserPreferencesManager();
    //   let userName = userMan.getUserName();
    //   let password = userMan.getPassword();
    //   let JSONUsernamePassword = {"username":userName,"password":password};
    //   let loginSuccessObj = {
    //     "resSuccess": resSuccess,
    //     "currentAuthMode": scopeObj.currentAuthMode,
    //     "rememberdeviceregflag": false,
    //     "UsernamePasswordJSON": JSONUsernamePassword
    //   };
    //   this.raiseComponentEvent('onLoginSuccess', loginSuccessObj);
    // },
    
    // onLoginFailureCallback: function(resError) {
    //   this.LoginPopupsUtility.dismissLoadingScreen();
    //   let errMsg = resError.errmsg.errorMessage;
    //   this.raiseComponentEvent('onLoginFailure', errMsg);
    // },
    /* LOGIN POPUPS COMMON FUNCTIONALITY END =============================================================================== */
    
    /* FACE-ID BEGIN=============================================================================== */
    faceIdLogin: function(){
      let deviceManager = applicationManager.getDeviceUtilManager();
      let navData = applicationManager.getNavigationManager().getCustomInfo("frmLogin");
      let identifierTouch = {"identifier": navData.userName};
      var authMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("AuthUIModule");
      let authData = kony.keychain.retrieve(identifierTouch);
      if (!kony.sdk.isNullOrUndefined(authData) && !kony.sdk.isNullOrUndefined(authData.secureaccount) && !kony.sdk.isEmptyObject(authData.secureaccount) && !kony.sdk.isNullOrUndefined(authData.securedata)) {
      kony.print(" showFaceIdScreen Secure data not empty"+JSON.stringify(authData));
      authMod.presentationController.isFaceLoginInProgress = true;
      applicationManager.getPresentationUtility().showLoadingScreen();
      this.statusCB(authData);
    }
    else
    {
        var controller=  applicationManager.getPresentationUtility().getController('frmLogin', true);
        controller.setFaceIdflag(false);
        controller.setLoginPasswordUI();
        authMod.presentationController.isFaceLoginInProgress = false;
    }
    },
    
    statusCB : function(status){
      this.doLoginonTouchId();      
    },
    /* FACE-ID END=============================================================================== */

    /* TOUCH-ID BEGIN=============================================================================== */
    touchIdLogin: function(){
      const scopeObj = this;
      let deviceManager = applicationManager.getDeviceUtilManager();
      let navData = applicationManager.getNavigationManager().getCustomInfo("frmLogin");
      let identifierTouch = {"identifier": navData.userName};
      let authData = kony.keychain.retrieve(identifierTouch);
       var authMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("AuthUIModule");
            
      if(navData.isIphone){
          if (!kony.sdk.isNullOrUndefined(authData) && !kony.sdk.isNullOrUndefined(authData.secureaccount) && !kony.sdk.isEmptyObject(authData.secureaccount) && !kony.sdk.isNullOrUndefined(authData.securedata)) {
                kony.print(" showFaceIdScreen Secure data not empty" + JSON.stringify(authData));
                authMod.presentationController.isFaceLoginInProgress = true;
                applicationManager.getPresentationUtility().showLoadingScreen();
                this.statusCB(authData);
                }
                    else
                    {
                        var controller=  applicationManager.getPresentationUtility().getController('frmLogin', true);
                          controller.setTouchIdflag(false);
                          controller.setLoginPasswordUI();
                                 authMod.presentationController.isFaceLoginInProgress = false;
                    }
      } else {
        scopeObj.showTouchIdAndroid();
        kony.application.setApplicationCallbacks({onbackground: ()=>{
          scopeObj.cancelTouchIdAuth();            
        }});
        scopeObj.raiseComponentEvent('onPopupVisible', true);
        //           this.login.showTouchIdAndroid();
        //           kony.application.setApplicationCallbacks({onbackground: ()=>{
        //             this.view.loginPopups.cancelTouchIdAuth();
        //             this.view.loginPopups.closeTouchIdScreenPopup();
        //           }});
      }
    },
    
    showTouchIdAndroid : function(){
      let loginData = applicationManager.getNavigationManager().getCustomInfo("frmLogin");
      let deviceManager = applicationManager.getDeviceUtilManager();
      if(loginData && loginData.defaultAuthMode == "touchid" &&  deviceManager.isTouchIDSupported()){
        var config = {
          "promptMessage": "Unlock Apollo",                   
          "fallbackTitle": "",
          "description": "Scan your fingerprint",  
          "subTitle" : "",  
          "deviceCredentialAllowed" : false,   
          "confirmationRequired" : false,  
          "negativeButtonText" : "Cancel" 
        };
        kony.localAuthentication.authenticate(constants.LOCAL_AUTHENTICATION_MODE_TOUCH_ID,this.authCallBack,config);
      }
    },

    authCallBack: function(status,msg){
      const scopeObj = this;
      scopeObj.raiseComponentEvent('onPopupVisible', false);
      if (status == 5000){
        this.doLoginonTouchId();      
      } else if (status == 5001){
        kony.print("Please Try Again");
      } else if (status == 5002 || status == 5003 || status == 5004){
        kony.print("Authentication cancelled");
      } else if(status == 5009){
        kony.print("Touch id temporarily locked due to invalid attempts");
      } else if(status == 5011){
        kony.print("Authentication locked due to multiple invalid attempts")
      } else{
        kony.print("Auth error");
      }
    },

    doLoginonTouchId : function (){
      this.LoginPopupsUtility.showLoadingScreen();
      let navData = applicationManager.getNavigationManager().getCustomInfo("frmLogin");
      let uName = navData.userName;
      let password = navData.password;
      this.currentAuthMode = "";
      let UsernamePasswordJSON = {"username":uName,"password":password};
      this.loginTouch(UsernamePasswordJSON);
    },

    loginTouch: function(UsernamePasswordJSON) {
      const scopeObj = this;     
      let authParams = {
        "userid": UsernamePasswordJSON.username,
        "Password": UsernamePasswordJSON.password,
        "loginOptions": {
          "isOfflineEnabled": false
        }
      };
      let identityServiceName = this._identityServiceName;
      //this.LoginPopupsDAO.login(authParams, scopeObj.onLoginSuccessCallback, scopeObj.onLoginFailureCallback, identityServiceName);
    //   this.LoginDAO.login(authParams, scopeObj.onLoginSuccessCallback.bind(scopeObj), scopeObj.onLoginFailureCallback.bind(scopeObj), identityServiceName);
    },

    cancelTouchIdAuth : function(){
      let deviceManager = applicationManager.getDeviceUtilManager();
      let loginData = applicationManager.getNavigationManager().getCustomInfo("frmLogin");
      if(loginData && loginData.defaultAuthMode === "touchid" &&  deviceManager.isTouchIDSupported()){
        kony.localAuthentication.cancelAuthentication();
      }
    }, 
    /* TOUCH-ID END=============================================================================== */

    /* PIN-SCREEN BEGIN=============================================================================== */
    getNumber: function(num) {      
      this.lengthOfDialNo = this.dialPadNo.length;
      this.changeSkinOfProgressBartoActive();
      if (this.lengthOfDialNo < 6) {
        this.dialPadNo = "" + this.dialPadNo + num;
      }
      if (this.dialPadNo.length === 6){
        let pinNo = this.dialPadNo;        
        this.currentAuthMode = "";
        this.onPinLogin(pinNo);
        this.dialPadNo = "";
        this.lengthOfDialNo = 0;
      }
    },

    onPinLogin: function(pin) {
      const scopeObj = this;
      this.LoginPopupsUtility.showLoadingScreen();
      let userMan = applicationManager.getUserPreferencesManager();
      let userName = userMan.getUserName();
      let password = userMan.getPassword();
      let deviceUtilManager = applicationManager.getDeviceUtilManager();
      let deviceID = deviceUtilManager.getDeviceInfo().deviceID;
      let UsernamePasswordJSON = {"username":userName,"password":password};
      // AAC-7691: Pin validation will happen on Client Side
      let authParams = {
        "userid": UsernamePasswordJSON.username,
        "Password": UsernamePasswordJSON.password,
        "loginOptions": {
          "isOfflineEnabled": false
        }
      };
      //       let authParams = {
      //         "UserName": userName,
      //         "pin": pin,
      //         "deviceId": deviceID
      //       };
      let identityServiceName = this._identityServiceName;
      if(userMan.verifyAppLoginPin(pin)){
        //scopeObj.LoginPopupsDAO.login(authParams, scopeObj.onLoginSuccessCallback, scopeObj.onLoginFailureCallback, identityServiceName);
        // scopeObj.LoginDAO.login(authParams, scopeObj.onLoginSuccessCallback.bind(scopeObj), scopeObj.onLoginFailureCallback.bind(scopeObj), identityServiceName);
      } else {        
        this.onPinFailure({"errmsg":"InvalidPin"});
      }
    },

    onPinFailure: function(err) {
      this.LoginPopupsUtility.dismissLoadingScreen();
      if (err.errmsg["isServerUnreachable"]){
        let errMsgObj = {"errmsg":{"errorMessage":err.errmsg}};
        // this.onLoginFailureCallback(errMsgObj);
        applicationManager.getPresentationInterruptHandler().showErrorMessage("postLogin", err.errmsg);
      } else {        
        let errMsgObj = {"errmsg":{"errorMessage":kony.i18n.getLocalizedString("kony.mb.Please.enter.a.valild.pin")}};
        this.clearProgressFlexLogin();
        // this.onLoginFailureCallback(errMsgObj);
        this.bindPinError(kony.i18n.getLocalizedString("kony.mb.Please.enter.a.valild.pin"));
      }
    },

    bindPinError(err){
      const scopeObj = this;      
      applicationManager.getDataProcessorUtility().showToastMessageError(this,err,scopeObj.clearProgressFlexLogin);
    },

    setDialPadActions: function() {
      var scopeObj = this;
      this.view.btnOne.onTouchStart = function() {
        scopeObj.getNumber("1");
      };
      this.view.btnTwo.onTouchStart = function() {
        scopeObj.getNumber("2");
      };
      this.view.btnThree.onTouchStart = function() {
        scopeObj.getNumber("3");
      };
      this.view.btnFour.onTouchStart = function() {
        scopeObj.getNumber("4");
      };
      this.view.btnFive.onTouchStart = function() {
        scopeObj.getNumber("5");
      };
      this.view.btnSix.onTouchStart = function() {
        scopeObj.getNumber("6");
      };
      this.view.btnSeven.onTouchStart = function() {
        scopeObj.getNumber("7");
      };
      this.view.btnEight.onTouchStart = function() {
        scopeObj.getNumber("8");
      };
      this.view.btnNine.onTouchStart = function() {
        scopeObj.getNumber("9");
      };
      this.view.btnZero.onTouchStart = function() {
        scopeObj.getNumber("0");
      };
      this.view.flxCross.onTouchStart = function() {
        scopeObj.flxCancelDialPadOnClick();
      };
      this.view.flxCross.onClick = function() {
        // overwritting the actions onclick
      };
    },

    flxCancelDialPadOnClick: function() {
      this.dialPadNo = this.dialPadNo.slice(0, -1);
      this.lengthOfDialNo = this.dialPadNo.length;
      this.changeSkinOfProgressBartoInactive();
      this.view.flxDialPad.forceLayout();
    },

    clearProgressFlexLogin:function(){
      for(let i=6; i>=1;i--){
        this.view["flxProgressButton"+i].skin="sknFlxa0a0a0B";
      }
    },

    changeSkinOfProgressBartoActive: function(){
      this.view["flxProgressButton"+(this.lengthOfDialNo + 1)].skin = "sknflxa0a0a0Bfilled";
      this.view.flxProgressButtons.forceLayout();
    },

    changeSkinOfProgressBartoInactive: function(){
      this.view["flxProgressButton"+(this.lengthOfDialNo + 1)].skin = "sknFlxa0a0a0B";
      this.view.flxProgressButtons.forceLayout();
    },
    /* PIN-SCREEN END=============================================================================== */

  };
});