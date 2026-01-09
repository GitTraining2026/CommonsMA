define(['./ControllerImplementation.js'],function(ControllerImplementation) {
	var konyLoggerModule = require('com/InfinityMB/Commons/socialshare/konyLogger');
  	var konymp = konymp || {};
	konymp.logger = (new konyLoggerModule("social share Component")) || function() {};
	konymp.logger.setLogLevel("DEBUG");
  	konymp.logger.enableServerLogging = true;
  
	return {
		constructor: function(baseConfig, layoutConfig, pspConfig) {
			var analytics=require("com/InfinityMB/Commons/"+"socialshare"+"/analytics");
            analytics.notifyAnalytics();
			this.handler=new ControllerImplementation(this,baseConfig.id);
		},
		initGettersSetters: function() {
          	/**
       		* @property : title
       		* @description : this property set the title for sharing
       		* @return : string
      		*/

			defineSetter(this,"title",function(value){
            this._title = value;
          });
          defineGetter(this,"title",function(){
            return this._title;
          });
		},
      	/**
     	* @api : shareWithFilepath
     	* @description : This API will take filepaths as params and share
     	* @return : null
     	*/
      	shareWithFilepath : function(filepaths){
          try {
                konymp.logger.trace("----------Entering shareWithFilepath Function---------", konymp.logger.FUNCTION_ENTRY);
            	this.handler.shareWithFilepath(filepaths);
                konymp.logger.trace("----------Exiting shareWithFilepath Function---------", konymp.logger.FUNCTION_EXIT);
            } catch (exception) {
                konymp.logger.error(JSON.stringify(exception), konymp.logger.EXCEPTION);
              	this.onErrorCallback(exception);
                if (exception.type === "CUSTOM") {
                    throw exception;
                }
            }
        },
      	/**
     	* @api : shareWithFilepath
     	* @description : This API will take base64 and filename with extenstion as params and share
     	* @return : null
     	*/
      	shareWithBase64 : function(base64,filename){
          try {
                konymp.logger.trace("----------Entering shareWithBase64 Function---------", konymp.logger.FUNCTION_ENTRY);
            	this.handler.shareWithBase64(base64,filename);
                konymp.logger.trace("----------Exiting shareWithBase64 Function---------", konymp.logger.FUNCTION_EXIT);
            } catch (exception) {
                konymp.logger.error(JSON.stringify(exception), konymp.logger.EXCEPTION);
              	this.onErrorCallback(exception);
                if (exception.type === "CUSTOM") {
                    throw exception;
                }
            }
        },
      	/**
     	* @event : onErrorCallback
     	* @description : called when an error is occured while sharing
     	* @param : error {object} contains message .
     	*/
      	onErrorCallback : function(error){
          // error callback event
        }
	};
});