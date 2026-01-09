/**
  *@module DeviceUtilManager
  */
define([], function() {
  /**
   * DeviceUtilManager is a utility class which provides device specific APIs
   *@alias module:DeviceUtilManager
   *@class
   */
  function DeviceUtilManager(){
    /**@member {object} deviceInfo - holds the specific information of the device such as name,version,model,ID etc provided by API*/
    this.deviceInfo = kony.os.deviceInfo();
  };
  inheritsFrom(DeviceUtilManager, kony.mvc.Business.Delegator);
  DeviceUtilManager.prototype.initializeBusinessController = function(){};
  /**
  * Return info about the device
  * @returns {object} - An object with device name, version, model, ID, width and height.
  */
  DeviceUtilManager.prototype.getDeviceInfo = function(){
    var deviceID = "";
    var version = this.deviceInfo.version;
    if(this.isIPhone()){
      if(version < 6)
        deviceID = this.deviceInfo.customdeviceid;
      else
        deviceID = this.deviceInfo.identifierForVendor;
    }
    else{
      deviceID = this.deviceInfo.deviceid;
    }
    var obj = {
      "name": this.deviceInfo.name,
      "version":version,
      "model":this.deviceInfo.model,
      "deviceID":deviceID,
      "deviceWidth":this.deviceInfo.deviceWidth,
      "deviceHeight":this.deviceInfo.deviceHeight,
      "screenWidth":this.deviceInfo.screenWidth,
      "screenHeight":this.deviceInfo.screenHeight
    };
    return obj;
  };
  DeviceUtilManager.prototype.detectDynamicInstrumentation = function(){
      //#ifdef android
      var worker = new kony.worker.WorkerThread('FridaIntrusiondetect.js');
      worker.addEventListener("message", function (event) {
        var alertMsg = "This device does not meet the minimum security requirements for this application. Please contact the app publisher for more details. The application will close when you select OK";
        var alertCallback = function(response){
              kony.application.exit();
        };
        kony.ui.Alert({
          "alertType": constants.ALERT_TYPE_CONFIRMATION,
          "alertTitle": "",
          "message": alertMsg,
          "alertHandler": alertCallback,
          "yesLabel": "OK"
        }, {});
        worker.terminate();
      });
      worker.addEventListener("error", function(err){
        kony.print("########## ERROR: " + err.filename + " Line " + err.lineno +  ":" +err.message);
      });
      var data = { msg: "Start scan" };
      worker.postMessage(data);
      //#endif
  };
  /**
  * check whether device is Ipad
  * @returns {boolean} - true if it is an Ipad, false if not
  */
  DeviceUtilManager.prototype.isIpad = function(){
    var isIPad = false;
    try {
      var deviceName = this.deviceInfo.name;
      if (deviceName === "iPad" || deviceName === "iPad Simulator")
        isIPad = true;
    } catch (e) {
      isIPad = false;
    }
    return isIPad;
  };
  /**
  * check whether device is Iphone
  * @returns {boolean} - true if it is an Iphone, false if not
  */
  DeviceUtilManager.prototype.isIPhone = function(){
    var isIPhone = false;
    try {
      var deviceName = this.deviceInfo.name;
      if (deviceName === "iPhone" || deviceName === "iPhone Simulator" || deviceName === "iPad" || deviceName === "iPad Simulator")
        isIPhone = true;
    } catch (e) {
      isIPhone = false;
    }
    return isIPhone;
  };
  /**
  * check whether device supports touchID
  * @returns {boolean} - true if touchID supported, false if not
  */
  DeviceUtilManager.prototype.isTouchIDSupported = function() {  //returns true if device supports touchId else  false
    if (this.isIPhone()) {
      var biometricType = kony.localAuthentication.getBiometryType();
      return (biometricType == constants.BIOMETRY_TYPE_TOUCHID) ? true : false;
    }
    else {
     var status = kony.localAuthentication.getStatusForAuthenticationMode(constants.LOCAL_AUTHENTICATION_MODE_TOUCH_ID);
     return (status == 5000) ? true : false;
    }
  };
  /**
  * check whether device is iphone X or not
  * @returns {boolean} - true if device is iphoneX, false if not
  */
  DeviceUtilManager.prototype.isIphoneX = function() {
    if (this.deviceInfo.model == "iPhone X")
      return true;
    else
      return false;
  };
  /**
  * check whether device supports faceID
  * @returns {boolean} - true if faceID supported, false if not
  */
  DeviceUtilManager.prototype.isFaceIdSupported = function() {
    var status = kony.localAuthentication.getStatusForAuthenticationMode(constants.LOCAL_AUTHENTICATION_MODE_TOUCH_ID);
    if(this.isIPhone())
    {
      var biometricType = kony.localAuthentication.getBiometryType();
      if ((status == 5007 || status == 5000) && biometricType == constants.BIOMETRY_TYPE_FACEID){
        return true;
      }
      else
        return false;
    }
    else
	{
	   var result = kony.localAuthentication.checkFeatureAvailability(["face", "fingerprint", "iris"]);
       if ((status == 5007 || status == 5000) && result.face == kony.localAuthentication.FEATURE_AVAILABLE){
		 return true;
	   }
       else 
         return false;			
	}
  };
  /**
  * check whether device supports faceID and it is enabled
  * @returns {boolean} - true if faceID supported, false if not
  */
  DeviceUtilManager.prototype.isFaceIdAvilable = function() {
    var status = kony.localAuthentication.getStatusForAuthenticationMode(constants.LOCAL_AUTHENTICATION_MODE_TOUCH_ID);
    if(this.isIPhone()){
      var biometricType = kony.localAuthentication.getBiometryType();
      if (status == 5000 && biometricType == constants.BIOMETRY_TYPE_FACEID)
      {
        return true;
      }
      else
        return false;
	}
    else
	{
	   var result = kony.localAuthentication.checkFeatureAvailability(["face", "fingerprint", "iris"]);
       if ((status == 5007 || status == 5000) && result.face == kony.localAuthentication.FEATURE_AVAILABLE){
		 return true;
	   }
       else 
         return false;			
	}
  };
  /**
  * Returns the image scale property like 1x,2x,3x for respective devices
 	* @returns {string} - Scale of the required image.
  */
  DeviceUtilManager.prototype.getDeviceScale = function() {
    var deviceData =  this.deviceInfo;
    var deviceWidth = this.deviceInfo.deviceWidth;
    var screenWidth = this.deviceInfo.screenWidth;
    var density = deviceWidth/screenWidth;
    if (density >= 3) {
      return "3x";
    }
    else if (density >= 2) {
      return "2x";
    }
    else if (density >= 1) {
      return "1x";
    }
    return "3x";
  };
  /**
  * Takes the base url of an image and appends extensions like @3x,@2x so on based on device type
  * @param {string} baseurl - input url for image appended url
 	* @returns {string} - baseurl with proper extension appended.
  */
  DeviceUtilManager.prototype.getImageURLBasedOnDeviceType = function(baseurl) {
    var deviceData =  this.deviceInfo;
    var bannerUrl = baseurl;
    if(deviceData.name === "iPhone")
    {
      if(deviceData.model.indexOf("iPhone 4") > -1)
        bannerUrl = bannerUrl+".png";
      else if(deviceData.model.indexOf("iPhone 5") > -1)
        bannerUrl = bannerUrl+"@2x.png";
      else if(deviceData.model.indexOf("iPhone 6") > -1)
        bannerUrl = bannerUrl+"@3x.png";
      else
        bannerUrl = bannerUrl+"@3x.png";
    }
    else
    {
      bannerUrl = bannerUrl+".9.png";
    }
    return bannerUrl;
  };
  
   /**
  * check wheather Googleservices Supported on particular device or not
  * @returns {boolean} - true if googleServices supported, false if not
  */
  
  DeviceUtilManager.prototype.checkGoogleservicesSupported = function() {
  	if(this.isIPhone()) 		
      return true;
    
    var self = this;
    this.status = null;
    this.KonyMain = java.import("com.konylabs.android.KonyMain");
    this.konyContext = this.KonyMain.getActivityContext();
    try{     
      this.googleAPI = java.import("com.google.android.gms.common.GoogleApiAvailability");
      this.googleAPIObj = this.googleAPI.getInstance();
      this.status = this.googleAPIObj.isGooglePlayServicesAvailable(this.konyContext);
    } catch(err) {
      kony.print("GoogleApiAvailability Class Not Available. Checking for GoogleApiAvailability. \n" + err)
    }  

    if(this.status != null){
      this.connectionResult = java.import("com.google.android.gms.common.ConnectionResult");
      if(this.status == this.connectionResult.SUCCESS)
        return true;
    } 	
    return false;
  };

  /**
   * [Zypher] added to check device developer option check
   * This method will return YES if developer oprtion is turned on and NO if it it turned off
   */

  DeviceUtilManager.prototype.checkDeveloperOption = function (){
    try{
        function callback(response){
            var controller = applicationManager.getPresentationUtility().getController('frmLogin', true);
            kony.store.setItem("checkForDeveloperMode",true);
            var navMan = applicationManager.getNavigationManager();
            var currentForm = kony.application.getCurrentForm();
            var name = currentForm.id;
            if(response==="YES"){
                if (name==="frmLogin"){
                    controller.ShowSecuritypopup();
                }else{
                    kony.application.exit();
                }
            }
        }
        if(kony.os.deviceInfo().name !== "iPhone"){
            let WrapperClass=java.import('com.boa.securitycheck.Wrapper');
            WrapperClass.startSecurityCheck(callback);
        }
    } catch(err) {
      kony.print("DeveloperOptionCheck Class Not Available. Checking for DeveloperOptionCheck. \n" + err)
    } 
  }

  /**
   * check whether Huawei services are supported on a particular device or not
   * @returns {boolean} - true if Huawei services are supported, false if not
   */

  DeviceUtilManager.prototype.checkHuaweiservicesSupported = function() {
    //adding check for iPhone, because if kony.os.isHuaweiMobileServicesAvailable() is not handled in iOS plugin
    // then the app might crash
    if(this.isIPhone())
      return false

    if(kony.os.isHuaweiMobileServicesAvailable()){
      return true;
    }

    return false;
  }

  return DeviceUtilManager;
});