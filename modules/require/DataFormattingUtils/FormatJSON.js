define(function () {  
  function FormatJSON(){
  }
  /**
	* @api : fetchFormatJSON
	* initializes the default format
	* @return : default JSON
	*/
  FormatJSON.prototype.fetchFormatJSON = function() {
    var formatJSON = {
      "DATE": {
        "BusinessRuleType": "FORMAT_DATE",
        "BusinessRule": {
          "inputFormat": "YYYY-MM-DD",
          "displayFormat": "MM/DD/YYYY"
        }
      },
      "CURRENCY": {
        "BusinessRuleType": "FORMAT_CURRENCY",
        "BusinessRule": {
          "currencyDisplay": "symbol"
        }
      },
      "AMOUNT": {
        "BusinessRuleType": "FORMAT_AMOUNT",
        "BusinessRule": {
          "signDisplay": "auto",
          "minimumFractionDigits": 2,
          "maximumFractionDigits": 2,
          "currency" : "USD"
        }
      },
      "ACCOUNT_NUMBER": {
        "BusinessRuleType": "FORMAT_ACCOUNT",
        "BusinessRule": {
          "maskingCharacter" : "X",
          "numberOfCharacters" : 10,
          "maskingFromFront" : "yes"
        }
      },
      "ACCOUNT_NAME" : {
        "BusinessRuleType": "FORMAT_ACCOUNT_NAME",
        "BusinessRule": {
          "maxLength" : 22,
          "separator" : "....",
          "data2SliceLength" : -4
        }
      },
      "DATE_OBJECT": {
        "BusinessRuleType": "FORMAT_DATE_OBJECT",
        "BusinessRule": {
          "displayFormat": "MM/DD/YYYY"
        }
      },
      "PERCENT" : {
        "BusinessRuleType": "FORMAT_PERCENT",
        "BusinessRule": {
          "signDisplay" : "auto",
          "minimumFractionDigits": 2,
          "maximumFractionDigits": 2
        }
      },
      "LONG_TEXT" : {
        "BusinessRuleType": "FORMAT_LONG_TEXT",
        "BusinessRule": {
          "maxLength" : 15,
          "separator" : "....",
          "stringSliceLength" : -4
        }
      },
      "LOWERCASE_TEXT" : {
        "BusinessRuleType": "FORMAT_LOWERCASE_TEXT",
        "BusinessRule": {}
      },
      "UPPERCASE_TEXT" : {
        "BusinessRuleType": "FORMAT_UPPERCASE_TEXT",
        "BusinessRule": {}
      },
      "AMOUNT_WITHOUT_CURRENCY" : {
        "BusinessRuleType": "FORMAT_AMOUNT_WITHOUT_CURRENCY",
        "BusinessRule": {
          "signDisplay": "auto",
          "minimumFractionDigits": 2,
          "maximumFractionDigits": 2,
        }
      },
       "TIMESTAMP": {
        "BusinessRuleType": "FORMAT_TIMESTAMP",
        "BusinessRule": {
          "inputFormat": "YYYY-MM-DDTHH:mm:ssZ[Z]",
          "displayFormat": "MM/DD/YYYY"
        }
       }
    };
    return formatJSON;
  };
  return FormatJSON;
});