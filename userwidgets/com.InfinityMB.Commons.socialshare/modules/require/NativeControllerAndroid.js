define(['./Inherits', './NativeController'], function(Inherits, NativeController) {
  var konyLoggerModule = require('com/InfinityMB/Commons/socialshare/konyLogger');
  var konymp = konymp || {};
  var konympJumio = konympJumio || {};
  konymp.logger = (new konyLoggerModule("social share Component")) || function() {};
  konymp.logger.setLogLevel("DEBUG");
  konymp.logger.enableServerLogging = true;

  var NativeControllerAndroid = function(componentInstance) {
    konympJumio.controllerContext = this;
    this.componentInstance = componentInstance;
    NativeController.call(this,this.componentInstance);
    this.importClasses();
  };

  Inherits(NativeControllerAndroid, NativeController);

  /**
     * @function importClasses
     * @private
     * @description: this function will import all the classes from the franeworks and store in the nativeClasses variable
     */
  NativeControllerAndroid.prototype.importClasses = function() {
    try {
      konymp.logger.trace("----------Entering importClasses Function---------", konymp.logger.FUNCTION_ENTRY);
	  this.konyContext = java.import("com.konylabs.android.KonyMain").getActContext();
      this.socialShare = java.import("com.konymp.konympsocialshare.SocialShare");
      konymp.logger.trace("----------Exiting importClasses Function---------", konymp.logger.FUNCTION_EXIT);
    } catch (exception) {
      konymp.logger.error(JSON.stringify(exception), konymp.logger.EXCEPTION);
      if(exception.type === "CUSTOM"){
        throw exception;
      }
    }
  };
  NativeControllerAndroid.prototype.shareWithFilepath = function(filepaths){
  	try{
      	if(typeof filepaths === "string"){
          throw {
            "error" : "ComponentConfigurationError",
            "message" : "please send array of filepaths",
            "code" : 2100
          };
        }
        var jsonObj = {};
        for(var i=1;i<=filepaths.length;i++){
          jsonObj[""+i] = filepaths[i-1];
        }
        this.socialShare.share(this.konyContext,JSON.stringify(jsonObj),this.componentInstance.title);
    }
    catch(exception){
      	throw exception;
    }
  };

  return NativeControllerAndroid;

});
