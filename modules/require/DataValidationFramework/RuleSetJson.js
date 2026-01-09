define(function () {  
   RuleSet =function(){},
  RuleSet.prototype.fetchRuleSet = function(){
      var ruleSetJson= {
      "ruleSet" : 
    {
      "MANDATORY": [
        {
          "BusinessRuleType": "MANDATORY",
          "BusinessRule": ""
        }
      ],
      "NAME": [
        {
          "BusinessRuleType": "VALUE_FORMAT",
          "BusinessRule": "FORMAT_NAME"
        }
      ],
      "ID": [
        {
          "BusinessRuleType": "VALUE_FORMAT",
          "BusinessRule": "FORMAT_ID"
        }
      ],
      "ID_ALPHANUMERIC": [
        {
          "BusinessRuleType": "VALUE_FORMAT",
          "BusinessRule": "FORMAT_ALPHANUMERIC"
        }
      ],
      "DATE":[
        {
          "BusinessRuleType": "VALUE_FORMAT",
          "BusinessRule": "FORMAT_DATE"
        }
      ],
      "BOOLEAN":[
        {
          "BusinessRuleType": "VALUE_FORMAT",
          "BusinessRule": "FORMAT_BOOLEAN"
        }
      ],
	  "ADDRESS": [
        {
          "BusinessRuleType": "VALUE_FORMAT",
          "BusinessRule": "FORMAT_ALPHANUMERICWITHSPACE"
        }
      ],
      "ZIPCODE": [
        {
          "BusinessRuleType": "VALUE_FORMAT",
          "BusinessRule": "FORMAT_ALPHANUMERIC"
        },
        {
          "BusinessRuleType": "VALUE_LENGTH",
          "BusinessRule": "MIN=3,MAX=16"
        }
      ],
      "FIRSTNAME": [
        {
          "BusinessRuleType": "MANDATORY",
          "BusinessRule": ""
        },
        {
          "BusinessRuleType": "VALUE_FORMAT",
          "BusinessRule": "FORMAT_NAME"
        },
        {
          "BusinessRuleType": "VALUE_MIN_LENGTH",
          "BusinessRule": "3"
        },
        {
          "BusinessRuleType": "VALUE_MAX_LENGTH",
          "BusinessRule": "50"
        }
      ],
      "LASTNAME": [
        {
          "BusinessRuleType": "VALUE_FORMAT",
          "BusinessRule": "FORMAT_NAME"
        },
        {
          "BusinessRuleType": "VALUE_MIN_LENGTH",
          "BusinessRule": "3"
        },
        {
          "BusinessRuleType": "VALUE_MAX_LENGTH",
          "BusinessRule": "30"
        }
      ],
      "WORKING_AGE": [
        {
          "BusinessRuleType": "VALUE_MIN_LIMIT",
          "BusinessRule": "18"
        },
        {
          "BusinessRuleType": "VALUE_MAX_LIMIT",
          "BusinessRule": "58"
        }
      ],
      "MINOR_AGE": [
        {
          "BusinessRuleType": "VALUE_MIN_LIMIT",
          "BusinessRule": "18"
        }
      ],
      "AGE": [
        {
          "BusinessRuleType": "VALUE_LIMIT",
          "BusinessRule": "MIN=1,MAX=130"
        }
      ],
      "NUMBER": [
        {
          "BusinessRuleType": "VALUE_FORMAT",
          "BusinessRule": "FORMAT_NUMBER"
        }
      ],
      "EMAIL": [
        {
          "BusinessRuleType": "MANDATORY",
          "BusinessRule": ""
        },
        {
          "BusinessRuleType": "VALUE_FORMAT",
          "BusinessRule": "FORMAT_EMAIL"
        }
      ],
      "MOBILE_NUMBER": [
        {
          "BusinessRuleType": "VALUE_FORMAT",
          "BusinessRule": "FORMAT_NUMBER"
        },
        {
          "BusinessRuleType": "VALUE_MIN_LENGTH",
          "BusinessRule": "6"
        },
        {
          "BusinessRuleType": "VALUE_MAX_LENGTH",
          "BusinessRule": "10"
        }
      ],
      "ACCOUNT_NUMBER":[
        {
          "BusinessRuleType": "MANDATORY",
          "BusinessRule": ""
        },
        {
          "BusinessRuleType": "VALUE_FORMAT",	
          "BusinessRule": "FORMAT_ALPHANUMERIC"
        },
        {
          "BusinessRuleType": "VALUE_LENGTH",
          "BusinessRule": "MIN=5,MAX=40"
        }
      ],
		"SWIFT_CODE": [{
			"BusinessRuleType": "MANDATORY",
			"BusinessRule": ""
		},
		{
			"BusinessRuleType": "VALUE_FORMAT",
			"BusinessRule": "FORMAT_ALPHANUMERIC"
		},
		{
			"BusinessRuleType": "VALUE_LENGTH",
			"BusinessRule": "MIN=8,MAX=11"
		}],

      "ROUTING_NUMBER":[
        {
          "BusinessRuleType": "VALUE_FORMAT",
          "BusinessRule": "FORMAT_NUMBER"
        },
        {
          "BusinessRuleType": "VALUE_LENGTH",
          "BusinessRule": "MIN=6,MAX=11"
        }
      ],
      "AMOUNT_FORMAT": [
        {
          "BusinessRuleType": "VALUE_FORMAT",
          "BusinessRule": "FORMAT_AMOUNT"
        }
      ]
    }
    };  
    return ruleSetJson;
  };

     
  return RuleSet;
          
});