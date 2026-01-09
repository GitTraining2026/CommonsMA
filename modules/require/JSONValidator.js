define(function () {

  function JSONValidator(){}

	/**
 	*To check whether the string passed is valid or not
	* @param {String} jsonString- String to check its a valid json 
	* @returns {JSON} - returns true or false & returns the statement(syntax error) if string is invalid json
    */  	
  JSONValidator.prototype.isValidJson=function(jsonString)
  {
    if (typeof jsonString ==='string')
    { 
      try{
        var regexOpenBraces = new RegExp("^{","g");
        var jsonOpenBraces = jsonString.match(regexOpenBraces);
        var regexCloseBraces = new RegExp("\}","g");
        var jsonCloseBraces = jsonString.match(regexCloseBraces);

        if(jsonOpenBraces || jsonCloseBraces){

          type=JSON.parse(jsonString);

          if(typeof type==='object' )
          {
            jsonError={returnType:"true",syntaxError:""}
            return jsonError;
          }
        }
        else
        {
          jsonError={returnType:"true",syntaxError:""};
          return jsonError;
        }
      }
      catch(e)
      {
        if(jsonString.includes("i.")||jsonString.includes("$."))
        {
          if(kony.string.startsWith(jsonString,"{i.",true)||kony.string.startsWith(jsonString,"{$.",true)||
             kony.string.startsWith(jsonString,"i.",true)||kony.string.startsWith(jsonString,"$.",true))
          {
            var errorBraces= this.checkBraces(jsonString);
            return errorBraces;
          }
          else{
            jsonError={returnType:"false",syntaxError:e.message};
            return jsonError;
          }
        }
        else{
          jsonError={returnType:"false",syntaxError:e.message};
          return jsonError;
        }
      }
    }
    return JSONValidator;
  };
	/**
 	*To check whether the string passed having the open and close braces
    * @param {String} jsonString- String to check its a valid json 
    * @returns {JSON} - returns true or false & returns the statement(syntax error) if string is invalid json
    */  	
  JSONValidator.prototype.checkBraces=function(jsonString)
  {
    var regexOpenBraces = new RegExp("^{","g");
    var jsonOpenBraces = jsonString.match(regexOpenBraces);
    var regexCloseBraces = new RegExp("\}","g");
    var jsonCloseBraces = jsonString.match(regexCloseBraces);
    if(jsonOpenBraces && jsonCloseBraces){
      jsonError={returnType:"true",syntaxError:""};
      return jsonError;
    }
    else if(jsonOpenBraces)
    {
      jsonError={returnType:"false",syntaxError:"Missing } Braces at the end "};
      return jsonError;
    }
    else if(jsonCloseBraces)
    {
      jsonError={returnType:"false",syntaxError:"Missing { Braces at start"};
      return jsonError;
    }

  };
  return JSONValidator;
});