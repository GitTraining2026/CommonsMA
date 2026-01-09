define([],function (){
  var konyLoggerModule = require('com/InfinityMB/Commons/socialshare/konyLogger');
  var konymp = konymp || {};
  konymp.logger = (new konyLoggerModule("social share Component")) || function() {};
  konymp.logger.setLogLevel("DEBUG");
  konymp.logger.enableServerLogging = true;

  var NativeController=function(componentInstance){
    this.componentInstance = componentInstance;
  };
 	/**
     * @function shareWithBase64
     * @private
     * @description: checks for camera permission calls initialize method
     */
    NativeController.prototype.shareWithBase64 = function(base64,filename) {
        try {
            konymp.logger.trace("----------Entering shareWithBase64 Function---------", konymp.logger.FUNCTION_ENTRY);
          	if(base64 !== undefined && base64 !== null && filename !== undefined && filename !== null && filename.trim() !== ""){
              	var splits = filename.split(".");
              	var extension = (splits.length>1) ? splits[splits.length-1] : null;
              	if(extension === null){
                  	throw {
                      "error" : "ComponentConfigurationError ",
                      "message" : "please specify proper extension",
                      "code" : 2100
                    };
                }
            }
          	var directory = "";
            directory = kony.io.FileSystem.getDataDirectoryPath()+"/share";
          	var destinationDirectory = new kony.io.File(directory);
          	if(destinationDirectory.exists()){
              destinationDirectory.remove(true);
            }
          	destinationDirectory.createDirectory();
          	var filePath = destinationDirectory.fullPath+"/"+filename;
          	var destinationFilePath = new kony.io.File(filePath);
          	if(destinationFilePath.exists()){
              destinationFilePath.remove();
            }
          	var createdFile = destinationFilePath.createFile();
            if(!createdFile){
                 throw {
                   "error" : "ComponentConfigurationError ",
                   "message" : "Unable to create file",
                   "code" : 2100
                 };
            }
          	var write = destinationFilePath.write(kony.convertToRawBytes(base64));
          	if(!write){
              throw {
                   "error" : "ComponentConfigurationError ",
                   "message" : "Unable to write file",
                   "code" : 2100
                 };
            }
          	this.shareWithFilepath([destinationFilePath.fullPath]);
            konymp.logger.trace("----------Exiting shareWithBase64 Function---------", konymp.logger.FUNCTION_EXIT);
        } catch (exception) {
            konymp.logger.error(JSON.stringify(exception), konymp.logger.EXCEPTION);
            if(exception.type === "CUSTOM"){
              throw exception;
            }
        }
    };
  	NativeController.prototype.shareWithFilepath = function(filepaths){
      throw {
        "error" : "ComponentConfigurationError ",
        "message" : "implement shareWithBase64",
        "code" : 2100
      };
    };

  return NativeController;
});
