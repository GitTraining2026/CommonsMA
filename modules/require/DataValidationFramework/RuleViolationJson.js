define(function () {  
  
  RuleViolation =function(){},
    RuleViolation.prototype.fetchRuleViolation = function(){
    var ruleViolationJson = {
      "ruleViolation" : 
      {
        "MANDATORY": {
          "errcode": "MANDATORY",
          "errmsg": "infinity.dvf.common.mandatory"
        },
        "VALUE_LENGTH": {
          "errcode": "LENGTH",
          "errmsg": "infinity.dvf.common.length"
        },
        "VALUE_LIMIT": {
          "errcode": "LIMIT",
          "errmsg": "infinity.dvf.common.limit"
        },
        "VALUE_FORMAT": {
          "errcode": "FORMAT",
          "errmsg": "infinity.dvf.common.format"
        },
        "VALUE_REGEX": {
          "errcode": "FORMAT",
          "errmsg": "infinity.dvf.common.format"
        },
        "VALUE_MIN_LENGTH": {
          "errcode": "VALUE_MIN_LENGTH",
          "errmsg": "infinity.dvf.common.minlength"
        },
        "VALUE_MAX_LENGTH": {
          "errcode": "VALUE_MAX_LENGTH",
          "errmsg": "infinity.dvf.common.maxlength"
        },
        "VALUE_MIN_LIMIT": {
          "errcode": "VALUE_MIN_LIMIT",
          "errmsg": "infinity.dvf.common.minlimit"
        },
        "VALUE_MAX_LIMIT": {
          "errcode": "VALUE_MAX_LIMIT",
          "errmsg": "infinity.dvf.common.maxlimit"
        },
      }
    };  
    return ruleViolationJson;

  }
  return RuleViolation;



});