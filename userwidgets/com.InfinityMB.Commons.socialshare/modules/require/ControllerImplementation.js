define(function() {
  var konyLoggerModule = require('com/InfinityMB/Commons/socialshare/konyLogger');
  var konymp = konymp || {};
  konymp.logger = (new konyLoggerModule("social share Component")) || function() {};
  konymp.logger.setLogLevel("DEBUG");
  konymp.logger.enableServerLogging = true;

    var ControllerImplementation = function(componentInstance, componentName) {
        konymp.logger.trace("----------Entering ControllerImplementation Function---------", konymp.logger.FUNCTION_ENTRY);
        this.componentInstance = componentInstance;
        this.getNativeController = function() {
            try {
                konymp.logger.trace("----------Entering getNativeController Function---------", konymp.logger.FUNCTION_ENTRY);
                if (this.nativeControllerInstance === undefined) {
                    var deviceName = kony.os.deviceInfo().name;
                    var platformName = null;
                    if (deviceName.toLowerCase() === 'iphone' || deviceName.toLowerCase() === 'ipad') {
                        platformName = 'IOS';
                    } else if (deviceName.toLowerCase() === 'android') {
                        platformName = 'Android';
                    }
                    var nativeControllerPath = 'com/InfinityMB/Commons/' + 'socialshare' + '/NativeController' + platformName + '.js';
                    var nativeController = require(nativeControllerPath);
                    this.nativeControllerInstance = new nativeController(this.componentInstance);
                }
                konymp.logger.trace("----------Exiting getNativeController Function---------", konymp.logger.FUNCTION_EXIT);
                return this.nativeControllerInstance;
            } catch (exception) {
                konymp.logger.error(JSON.stringify(exception), konymp.logger.EXCEPTION);
                if (exception.type === "CUSTOM") {
                    throw exception;
                }
            }
        };
        /**
         * @function shareWithFilepath
         * @private
         * @description: Calls initializeSDK method in NativeController
         */
        this.shareWithFilepath = function(filepaths) {
            try {
                konymp.logger.trace("----------Entering shareWithFilepath Function---------", konymp.logger.FUNCTION_ENTRY);
              	this.getNativeController().shareWithFilepath(filepaths);
                konymp.logger.trace("----------Exiting shareWithFilepath Function---------", konymp.logger.FUNCTION_EXIT);
            } catch (exception) {
                konymp.logger.error(JSON.stringify(exception), konymp.logger.EXCEPTION);
                if (exception.type === "CUSTOM") {
                    throw exception;
                }
            }
        };
      /**
         * @function shareWithBase64
         * @private
         * @description: Calls startVerification method in NativeController
         */
        this.shareWithBase64 = function(base64,filename) {
            try {
                konymp.logger.trace("----------Entering shareWithBase64 Function---------", konymp.logger.FUNCTION_ENTRY);
              	this.getNativeController().shareWithBase64(base64,filename);
                konymp.logger.trace("----------Exiting shareWithBase64 Function---------", konymp.logger.FUNCTION_EXIT);
            } catch (exception) {
                konymp.logger.error(JSON.stringify(exception), konymp.logger.EXCEPTION);
                if (exception.type === "CUSTOM") {
                    throw exception;
                }
            }
        };  
        konymp.logger.trace("----------Exiting ControllerImplementation Function---------", konymp.logger.FUNCTION_EXIT);
    	};
  		

    return ControllerImplementation;
});
