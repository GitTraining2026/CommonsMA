define(['./RuleViolationJson','./RuleSetJson'],function (RuleViolationJson,RuleSetJson) {

  DataValidationHandler = function(){
    /**@member {object} DataValidationHandler Contains Validation response*/
    this.DataValidationHandler = null;

  };
  
  DataValidationHandler.prototype.validateMinFill = function(dataJson,object,config){    
     var minFillDvfConfig = {
        "Recipients":"",
        "PayPerson": ""
      };
     var tempJson = {};
      for (var key in config) {
        for(var innerkey in config[key]){
          var valueArray = [];
          var valueJSON = {
            "BusinessRuleType": "VALUE_MIN_LENGTH",
            "BusinessRule": config[key][innerkey]
          }
          valueArray.push(valueJSON);
          tempJson[innerkey] = valueArray;    
        }
        minFillDvfConfig[key] = tempJson;
        tempJson = {};
      }   
      var dataValidator = this.validateData(dataJson,object,minFillDvfConfig);    
      return dataValidator;
  };
  
	DataValidationHandler.prototype.validateMaxFill = function(dataJson,object,config){    
     var maxFillDvfConfig = {
        "Recipients":"",
        "PayPerson": ""
      };
     var tempJson = {};
      for (var key in config) {
        for(var innerkey in config[key]){
          var valueArray = [];
          var valueJSON = {
            "BusinessRuleType": "VALUE_MAX_LENGTH",
            "BusinessRule": config[key][innerkey]
          }
          valueArray.push(valueJSON);
          tempJson[innerkey] = valueArray;    
        }
        maxFillDvfConfig[key] = tempJson;
        tempJson = {};
      }   
      var dataValidator = this.validateData(dataJson,object,maxFillDvfConfig);    
      return dataValidator;
  };																					 
  
  DataValidationHandler.prototype.validateData = function(dataJson,obj,fieldMapping){ 
    if(typeof fieldMapping === "string"){
      fieldMapping = JSON.parse(fieldMapping);
    }  
    var ruleSetJSON = new RuleSetJson();
    var ruleSet = ruleSetJSON.fetchRuleSet().ruleSet;  
    var ruleViolationJSON = new RuleViolationJson();
    var ruleViolation = ruleViolationJSON.fetchRuleViolation().ruleViolation;
    return this.validateDataMain(dataJson,fieldMapping[obj],ruleSet,ruleViolation);
  };
  DataValidationHandler.prototype.validateDataMain = function(dataJson,fieldMapping,ruleSet,ruleViolation){
    var errmsg="";
    var callBack = {};
    dataJson = dataJson;
    for(var key in dataJson){
      if(key in fieldMapping){
        ruleValue =  fieldMapping[key];
        if(ruleSet[ruleValue]){
          response = this.validateField(dataJson,dataJson[key], ruleSet[ruleValue], ruleViolation);
        }
        else{
          response = this.validateField(dataJson,dataJson[key], fieldMapping[key], ruleViolation); 
        }           
        if(response){
          var msg=key+":"+ response;
          errmsg = errmsg + " " + msg + ",";
          var code = response.replace("%field%", key);
          callBack[key] = code;
        }  
      }
    }
    return callBack;

  };
  DataValidationHandler.prototype.validateField = function(dataJson,value, ruleList, ruleViolation){
    errcode = "";
    for(var key in ruleList){
      BusinessRuleType = ruleList[key].BusinessRuleType;
      BusinessRule = ruleList[key].BusinessRule;
      isValid = this.validateRule(value,BusinessRuleType,BusinessRule);
      if(!isValid){
        var errorMsgi18nkey = ruleViolation[BusinessRuleType].errmsg;
        var errMsg = kony.i18n.getLocalizedString(errorMsgi18nkey);
        
        var hasMin = errMsg.indexOf("%min%") > -1;
        var hasMax = errMsg.indexOf("%max%") > -1;
        if(hasMin && hasMax){
          limitValues = BusinessRule.split(",");
          if(value < limitValues[0].substring(limitValues[0].indexOf("=") + 1) || value > limitValues[1].substring(limitValues[1].indexOf("=") + 1) ) 
            errMsg = errMsg.replace("%min%", limitValues[0].substring(limitValues[0].indexOf("=") + 1));
            errMsg = errMsg.replace("%max%", limitValues[1].substring(limitValues[1].indexOf("=") + 1));
        }
        else if(hasMin){
          errMsg = errMsg.replace("%min%", BusinessRule);
        }
        else if(hasMax){
          errMsg = errMsg.replace("%max%", BusinessRule);  
        }  
        errcode = errMsg;
        break;
      }else{
        //validatiion success
      }
    }
    return errcode;
  };
  DataValidationHandler.prototype.validateRule = function(value, ruleType, rule){
    if(ruleType === "MANDATORY"){
      if(value === null || value === undefined || value === "") {
        return false;
      }
      return true;
    }
    else if(ruleType === "VALUE_LENGTH"){
      return this.isValidLength(value, rule);
    }
    else if(ruleType === "VALUE_MIN_LENGTH"){
      return this.isValidMinLength(value, rule);
    }
    else if(ruleType === "VALUE_MAX_LENGTH"){
      return this.isValidMaxLength(value, rule); 
    }
    else if(ruleType === "VALUE_MIN_LIMIT"){
      return this.isValidMinLimit(value, rule);
    }
    else if(ruleType === "VALUE_MAX_LIMIT"){
      return this.isValidMaxLimit(value, rule); 
    }
    else if(ruleType === "VALUE_LIMIT"){
      return this.isValidLimit(value, rule);
    }
    else if(ruleType === "VALUE_REGEX"){
      return this.isValidRegx(value, rule);
    }
    else if(ruleType === "VALUE_FORMAT"){
      if(rule === "FORMAT_EMAIL") {
        return this.isValidEmail(value);    
      }
      else if(rule === "FORMAT_NAME"){
        return this.isValidNameFormat(value);
      } 
      else if(rule === "FORMAT_NUMBER"){
        return this.isValidNumberFormat(value);
      }
      else if(rule === "FORMAT_ID"){
        return this.isValidIDFormat(value);
      }
      else if(rule === "FORMAT_ALPHANUMERIC"){
        return this.isValidAlphanumericFormat(value);
      }
      else if(rule === "FORMAT_ALPHANUMERICWITHSPACE"){
        return this.isValidAlphanumericwithspaceFormat(value);
      }
      else if(rule === "FORMAT_DATE"){
        return this.isValidDate(value);
      }
      else if(rule === "FORMAT_BOOLEAN"){
        return this.isValidBoolean(value);
      }
      else if(rule === "FORMAT_AMOUNT") {
        return this.isValidAmount(value);
      }
    }  
  };
  DataValidationHandler.prototype.isValidLength = function(value,rule){
    lenArray = rule.split(",");
    if(value.length < lenArray[0].substring(lenArray[0].indexOf("=") + 1) || value.length > lenArray[1].substring(lenArray[1].indexOf("=") + 1) ){
      return false;
    }
    return true;
  };
  DataValidationHandler.prototype.isValidMinLength = function(value,rule){
    if(value.length < rule){
      return false;
    }
    return true;
  };
  DataValidationHandler.prototype.isValidMaxLength = function(value,rule){
    if(value.length > rule){
      return false;
    }
    return true;
  };
  DataValidationHandler.prototype.isValidMinLimit = function(value,rule){
    if(value < rule){
      return false;
    }
    return true;
  };
  DataValidationHandler.prototype.isValidMaxLimit = function(value,rule){
    if(value > rule){
      return false;
    }
    return true;
  };
  DataValidationHandler.prototype.isValidLimit = function(value,rule){
    limitValues = rule.split(",");
    if(value < limitValues[0].substring(limitValues[0].indexOf("=") + 1) || value > limitValues[1].substring(limitValues[1].indexOf("=") + 1) ){

      return false;
    }
    return true;
  };
  DataValidationHandler.prototype.isValidEmail = function(value){
    var emailRegx = "^[a-zA-Z0-9_+&*-]+(?:\\."+ 
        "[a-zA-Z0-9_+&*-]+)*@" + 
        "(?:[a-zA-Z0-9-]+\\.)+[a-z" + 
        "A-Z]{2,7}$";
    return this.isValidRegx(value,emailRegx);

  };

  DataValidationHandler.prototype.isValidNameFormat = function(value){
    var nameRegx = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.&'-]+$/;
    return this.isValidRegx(value,nameRegx);
  };

  DataValidationHandler.prototype.isValidRegx = function(value, Regx){
    if (value === null || value === undefined || value ==="") {
      return true;
    }
    if(!value.match(Regx)){
      return false;
    }
    return true;
  };
  
  DataValidationHandler.prototype.isValidNumberFormat = function(value){
    var nameRegx = /^[0-9]+$/;
    return this.isValidRegx(value,nameRegx);
  };
  
  DataValidationHandler.prototype.isValidIDFormat = function(value){
    var nameRegx = /^[a-zA-Z0-9-]+$/;
    return this.isValidRegx(value,nameRegx);
  };

  DataValidationHandler.prototype.isValidAlphanumericFormat = function(value){
    var nameRegx = /^[a-z0-9]+$/i;
    return this.isValidRegx(value,nameRegx);
  };
  
  DataValidationHandler.prototype.isValidAlphanumericwithspaceFormat = function(value){
    var nameRegx = /^[a-z\d\-_\s]+$/i;
    return this.isValidRegx(value,nameRegx);
  };

  DataValidationHandler.prototype.isValidAmount = function(value){
    var nameRegx = /^[0-9.,]+$/;
    return this.isValidRegx(value,nameRegx);
  };
  
  DataValidationHandler.prototype.isValidBoolean = function(value){
    if(typeof value === "boolean"){
       return true; 
    }
    return false;
  };
  
  DataValidationHandler.prototype.isValidDate = function(value){
    var nameRegx = /^[0-9./-]{6,10}$/i;
    return this.isValidRegx(value,nameRegx);
  };

  return DataValidationHandler;     

});