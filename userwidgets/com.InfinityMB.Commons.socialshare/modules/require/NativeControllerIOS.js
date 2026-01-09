define(['./Inherits', './NativeController'], function(Inherits, NativeController) {
  var konyLoggerModule = require('com/InfinityMB/Commons/socialshare/konyLogger');
  var konymp = konymp || {};
  var konympJumio = konympJumio || {};
  konymp.logger = (new konyLoggerModule("social share  Component")) || function() {};
  konymp.logger.setLogLevel("DEBUG");
  konymp.logger.enableServerLogging = true;

  var NativeControllerIOS = function(componentInstance) {
    konympJumio.controllerContext = this;
    this.componentInstance = componentInstance;
    NativeController.call(this,this.componentInstance);
    this.importClasses();
  };
  Inherits(NativeControllerIOS, NativeController);

  /**
     * @function importClasses
     * @private
     * @description: this function will import all the classes from the frameworks and store in the nativeClasses variable
     */
  NativeControllerIOS.prototype.importClasses = function() {
    try {
      konymp.logger.trace("----------Entering importClasses Function---------", konymp.logger.FUNCTION_ENTRY);
      this.konympSocialShare = objc.import("KonySocialShare");
      konymp.logger.trace("----------Exiting importClasses Function---------", konymp.logger.FUNCTION_EXIT);
    } catch (exception) {
      konymp.logger.error(JSON.stringify(exception), konymp.logger.EXCEPTION);
      if (exception.type === "CUSTOM") {
        throw exception;
      }
    }
  };
  NativeControllerIOS.prototype.shareWithFilepath = function(filepaths){
    try{
      	if(typeof filepaths === "string"){
          throw {
            "error" : "exception",
            "message" : "please send array of filepaths",
            "code" : 2100
          };
        }
      kony.runOnMainThread(function(){
		this.konympSocialShare.shareFilepathWithTitleAndOptions(filepaths,"",{});}.bind(this),[filepaths])
    }
    catch(exception){
      konymp.logger.error(JSON.stringify(exception), konymp.logger.EXCEPTION);
      if (exception.type === "CUSTOM") {
        throw exception;
      }
    }
  };

  return NativeControllerIOS;

});
