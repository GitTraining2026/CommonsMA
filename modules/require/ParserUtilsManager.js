define(function () {

  /**
   * Parser Utility Manager Constructor
   */
  function ParserUtilsManager() {  
	this.unicode = {};
    this.context = {};
    this.breakPointConfig = {};
    this.flowTypeConfig={};
  };
  /**
   * Set context object to ParserUtilityManager
   * @param {Object} context
   */
  ParserUtilsManager.prototype.setContext = function (context) {
    //this.context = context;
	for(var key in context){
      this.context[key]=context[key];  
    }
  };
   ParserUtilsManager.prototype.setCIFIntoContext = function(input, inputKey){
     this.context[inputKey] = input;
  };
  /**
   * Clears context object to ParserUtilityManager.
   */
  ParserUtilsManager.prototype.clearContext = function(object){
    if(!object){
      this.context = {};      
    }
    else{
      for(var key in object){
        delete this.context[key];
      }
    }
  };
   ParserUtilsManager.prototype.clearAllContext = function(){
     delete this.context;
   }
  /**
   * Set context object to setBeneficiaryTypeConfig.
   *
   * @param {Object} context
   */
  ParserUtilsManager.prototype.setBeneficiaryTypeConfig = function(beneficiaryTypesConfig){
    this.beneficiaryTypesConfig = beneficiaryTypesConfig;
  };
  /**
   * Set context object to setFlowTypeConfig.
   *
   * @param {Object} context
   */
  ParserUtilsManager.prototype.setFlowTypeConfig = function(flowTypeConfig){
    this.flowTypeConfig = flowTypeConfig;
  };
  /**
   * Set context object to setBreakPointConfig.
   *
   * @unicode{Object} 
   * @responseData {Object} 
   */
  ParserUtilsManager.prototype.setResponseData = function(unicode,responseData){
    this.unicode[unicode] = responseData;
  };
  /**
   * Set the breakpoint config to ParserUtilityManager
   * @param {Object} breakPointConfig 
   */
  ParserUtilsManager.prototype.setBreakPointConfig = function (breakPointConfig) {
    this.breakPointConfig = breakPointConfig;
  };
  ParserUtilsManager.prototype.getcomponentConfigValue = function(value, selectedtype) {
    var count = 0;
    for (var key in value) {
      count++;
      if (key.includes("$.BREAKPTS.")) {
        var key2 = this.getBreakPointValue(key.split("$.BREAKPTS.")[1])
        if (key2 == selectedtype) {
          return value[key];
        }
      }
      if (count == Object.keys(value).length) {
        return value["default"];
      }
    }
    return value;
  };
  ParserUtilsManager.prototype.getBreakPointValue = function (text) {
    var breakPointConfigValue = "";
    try {
      breakPointConfigValue = this.breakPointConfig[text];
    } catch (e) {
      kony.print(e);
    }
    if (breakPointConfigValue != "" && breakPointConfigValue != undefined && breakPointConfigValue != null) return breakPointConfigValue;
    return text;
  };
  /**
   * Identify the value is a JSON string or plain string.
   * @param {String} value
   * @return {String} - value for string
   */
  ParserUtilsManager.prototype.getParsedValue = function (value) {
    var JSONValue = {}
    try {
      JSONValue = JSON.parse(value);
      if (JSONValue && Object.keys(JSONValue).length > 0)
        return JSON.stringify(this.processJSON(JSONValue));
    }
    catch (e) {}
    return this.getParsedText(value);
  };
  /**
   * Parse JSON and replace the values in decorator pattern with actual values.
   * @param {JSON} JSONValue
   * @return {JSON} - JSON with actual values
   */
  ParserUtilsManager.prototype.processJSON = function (JSONValue) {
    for (var key in JSONValue) {
      JSONValue[key] = this.getParsedValue(JSONValue[key]);
    }
    return JSONValue;
  };
  /**
   * Parse text and return appropriate string
   * @param {JSON} text 
   * @return {String} - parsed String
   */
  ParserUtilsManager.prototype.getParsedText = function (text) {
    var parseStr = text;
    var delimiters = "i$"
    
	if(kony.os.deviceInfo().name === "thinclient") {
		var regex = new RegExp("{[[" + delimiters + "\].+?(}{1,})", "g");
	} else {
		var regex = new RegExp("{[["+delimiters+"\].+?}","g");	
	}
    var decoratorArray = parseStr.match(regex);
    if (decoratorArray) {
      for (var i = 0; i < decoratorArray.length; i++) {
        parseStr = parseStr.replace(decoratorArray[i], this.getDecoratorText(decoratorArray[i]));
      }
    }
    return parseStr;
  };
  /**
   * Parse decorator text and return appropriate string
   * @param {JSON} JSONValue
   * @return {String} - value either from contet or from service response
   */
  ParserUtilsManager.prototype.getDecoratorText = function (decoratorText) {
    if (decoratorText.indexOf("{i.") != -1)
      return this.geti18nText(decoratorText.substring(decoratorText.indexOf("{i.") + 3, decoratorText.length - 1));
    else if (decoratorText.indexOf("{$.") != -1) {
      var unicode = decoratorText.substring(3, decoratorText.indexOf(".", 3))
      var valueStartIndex = decoratorText.indexOf(".", 3) + 1;
      if (unicode == "c") {
        return this.getContextValue(decoratorText.substring(valueStartIndex, decoratorText.length - 1));
      } else {
        return this.getResponseValue(decoratorText.substring(valueStartIndex, decoratorText.length - 1), unicode);
      }
    }
  };
   /**
   * Parse value  and selectedType config and return value
   *
   * @value {JSON} 
    @selectedtype {JSON} 
   * 
   * @return {String} - parsed String
   */
  ParserUtilsManager.prototype.getComponentConfigParsedValue = function(value,selectedtype){
    var count=0;
    for(var key in value){
      count++;
     
      
      if(key.includes("$.FLOWTYPES.")){
        var key2 = this.getFlowTypeValue(key.split("$.FLOWTYPES.")[1]) 
        if(key2 == selectedtype){
          return value[key];
        }
      }
      if(count == Object.keys(value).length){
        if(value.hasOwnProperty("default"))
          return value["default"];
        else
          return "";
      }
    }
  };
  /**
   * get flowType value for the Input.
   *
   * @param {String} text
   * 
   * @return {String} - flowType value for Input
   */
  ParserUtilsManager.prototype.getFlowTypeValue = function(text){
    var flowTypeConfigValue = "";
    try{
      flowTypeConfigValue = this.flowTypeConfig[text];
    }catch(e){
      kony.print(e);
    }
    if(flowTypeConfigValue != "" && flowTypeConfigValue != undefined && flowTypeConfigValue != null)
      return flowTypeConfigValue;
    return text;
  };
  /**
   * get i18n value for the String.
   * @param {String} text
   * @return {String} - i18n value for string
   */
  ParserUtilsManager.prototype.geti18nText = function (text) {
    var i18ntext = "";
    try {
      i18ntext = kony.i18n.getLocalizedString(text);
    } catch (e) {}
    if (i18ntext != "" && i18ntext != undefined && i18ntext != null)
      return i18ntext;
    return text;
  };
  /**
   * get context value for the String.
   * @param {String} text
   * @return {String} - context value for string
   */
  ParserUtilsManager.prototype.getContextValue = function (text) {
    var context = "";
    try {
      let parsedText = this.getParsedValue(text);
      context = this.context[parsedText];
      if (!context) {
        context = eval("this.context." + parsedText);
      }
    } catch (e) {}
    if (context != "" && context != undefined && context != null)
      return context;
    return "";
  };
  /**
   * get value from response data for the String.
   * @param {String} text
   * @return {String} - value for string
   */
  ParserUtilsManager.prototype.getResponseValue = function (text, unicode) {
    var responseValue = ""
    try {
      responseValue = this.unicode[unicode][this.getParsedValue(text)];
    } catch (e) {}
    if (responseValue != "" && responseValue != undefined && responseValue != null)
      return responseValue;
    return "";
  };
  return ParserUtilsManager;
});