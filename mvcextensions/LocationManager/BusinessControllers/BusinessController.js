/**
* @module LocationManager
*/
define([], function() {
/**
* @alias module:LocationManager
* @class
*/
function LocationManager(){
 /** @member {Array} nearByLocations stores the nearby locations */
  this.nearByLocations = [];
  /** @member {Array} locationsBySearch stores the locations data from search */
  this.locationsBySearch = [];
   /** @member {Array} locationsByRange stores the locations data with range */
  this.locationsByRange = [];
}
inheritsFrom(LocationManager, kony.mvc.Business.Delegator);
LocationManager.prototype.initializeBusinessController = function(){};
/**
* it returns the cached near by locations
* @returns {Array} nearByLocations
*/
LocationManager.prototype.getNearByLocations = function(){
  return this.nearByLocations;
};
/**
* it store the near by locations
* @param {Array} data
*/
LocationManager.prototype.setNearByLocations = function(data){
  this.nearByLocations = data;
};
/**
* it returns the cached locations array which is result of search
* @returns {Array} nearByLocations
*/
LocationManager.prototype.getLocationsBySearch = function(){
  return this.locationsBySearch;
};
/**
* it store the locations data which is result of serach
* @param {Array} data
*/
LocationManager.prototype.setLocationsBySearch = function(data){
  this.locationsBySearch = data;
};
/**
* it returns the cached near by locations with range
* @returns {Array} nearByLocations
*/
LocationManager.prototype.getLocationsByRange = function(){
  return this.locationsByRange;
};
/**
* it store the near by locations with range
* @param {Array} data
*/
LocationManager.prototype.setLocationsByRange = function(data){
  this.locationsByRange = data;
};
/**
  * Get the Locations near current location
  * @member of LocationManager
  * @param {Object} latLongObj - which contain latitude and longitude. Ex: {"latitude":15.333,"longitude":76.444}
  * @param {function} - successcallback
  * @param {function} - failurecallback
  */
LocationManager.prototype.fetchNearByLocations = function(latLongObj,successCallback,failureCallback){
  var loggerManager = applicationManager.getLoggerManager();
  try{
    loggerManager.log("#### start LocationManager : fetchNearByLocations ####");
    var scope = this;
    if(latLongObj && latLongObj.latitude && latLongObj.longitude){
      loggerManager.log("#### latitude : "+latLongObj.latitude+" longitude : "+latLongObj.longitude+" ####");
      var lat = latLongObj.latitude;
      var long = latLongObj.longitude;
      var params = {};
      params.currLatitude = lat;
      params.currLongitude = long;
      params.radius = 10000;
      var customVerbName = 'getList';
      this.makeServiceCall(customVerbName,params,successCall, failureCall);
      function successCall(data){
        loggerManager.log("#### in success "+JSON.stringify(data)+" ####");
        if(data && data.length)
          scope.setNearByLocations(data);
        successCallback(data);
      }
      function failureCall(error){
        loggerManager.log("#### in error "+JSON.stringify(error)+" ####");
        failureCallback(error);
      }
    }
  }catch(err){
    loggerManager.log("#### in catch "+JSON.stringify(err)+" ####");
  }
};
/**
  * Get the Locations based on search query
  * @member of LocationManager
  * @param {string} searchString - it can be city or pincode or place EX:Hyderabad,500081
  * @param {function} - successcallback
  * @param {function} - failurecallback
  */
LocationManager.prototype.fetchLocationsBySearch = function(searchString,successCallback,failureCallback){
  var loggerManager = applicationManager.getLoggerManager();
  try{
    loggerManager.log("#### start LocationManager : fetchLocationsBySearch ####");
    var scope = this;
    if(searchString !== null && searchString !== undefined){
      loggerManager.log("#### search String is "+searchString+" ####");
      var customVerbName = 'getQuery';
      var params = {};
      params.query = "atms or banks in "+searchString.trim();
      this.makeServiceCall(customVerbName, params, successCall, failureCall);
      function successCall(data){
        if(data["Locations"]) data = data["Locations"];
        else if(data.rawResponse && data.rawResponse["Locations"]) data = data.rawResponse["Locations"];
        loggerManager.log("#### in success "+JSON.stringify(data)+" ####");
        if(data && data.length)
          scope.setLocationsBySearch(data);
        successCallback(data);
      }
      function failureCall(error){
        loggerManager.log("#### in error "+JSON.stringify(error)+" ####");
        failureCallback(error);
      }
    }
  }catch(err){
    loggerManager.log("#### in catch "+JSON.stringify(err)+" ####");
  }
};
/**
  * Get the Locations based on given range
  * @member of LocationManager
  * @param {Object} latLongObj - which contain latitude and longitude. Ex: {"latitude":15.333,"longitude":76.444}
  * @param {Number} range - the radius from given lat, long
  * @param {function} - successcallback
  * @param {function} - failurecallback
  */
LocationManager.prototype.fetchLocationsByRange = function(latLongObj,range,successCallback,failureCallback){
  var loggerManager = applicationManager.getLoggerManager();
  try{
    loggerManager.log("#### start LocationManager : fetchLocationsByRange  ####");
    var scope = this;
    if(range !== null && range !== undefined){
      loggerManager.log("#### range is "+range+" ####");
      var customVerbName = 'getRange';
      var params = {};
      params.currLatitude = latLongObj.latitude;
      params.currLongitude = latLongObj.longitude;
      params.radius = range;
      this.makeServiceCall(customVerbName,params,successCall,failureCall);
      function successCall(data){
        if(data["Locations"]) data = data["Locations"];
        else if(data.rawResponse && data.rawResponse["Locations"]) data = data.rawResponse["Locations"];
        loggerManager.log("#### in success "+JSON.stringify(data)+" ####");
        scope.setLocationsByRange(data);
        successCallback(data);
      }
      function failureCall(error){
        loggerManager.log("#### in error "+JSON.stringify(error)+" ####");
        failureCallback(error);
      }
    }
  }catch(err){
    loggerManager.log("#### in catch "+JSON.stringify(err)+" ####");
  }
};
/**
  * Get the details of given Location based on location id
  * @member of LocationManager
  * @param {string} locationId - id of the location
  * @param {function} - successcallback
  * @param {function} - failurecallback
  */
LocationManager.prototype.fetchLocationDetails = function(locationId,successCallback,failureCallback){
  var loggerManager = applicationManager.getLoggerManager();
  try{
    loggerManager.log("#### start LocationManager : fetchLocationDetails ####");
    if(locationId !== null && locationId !== undefined){
      loggerManager.log("#### locationId is "+locationId+" ####");
      var customVerbName = 'getDetails';
      var params = {};
      params.placeID = locationId;
      this.makeServiceCall(customVerbName, params, successCall, failureCall);
      function successCall(data){
        if(data["PlaceDetails"]) data = data["PlaceDetails"];
        else if(data.rawResponse && data.rawResponse["PlaceDetails"]) data = data.rawResponse["PlaceDetails"];
        loggerManager.log("#### in success "+JSON.stringify(data)+" ####");
        if(data)
          successCallback(data);
        else
          failureCallback(null);
      }
      function failureCall(error){
        loggerManager.log("#### in error "+JSON.stringify(error)+" ####");
        failureCallback(error);
      }
    }
  }catch(err){
    loggerManager.log("#### in catch "+JSON.stringify(err)+" ####");
  }
};
/**
  * Get address of given lat and long
  * @member of LocationManager
  * @param {Object} latLongObj - which contain latitude and longitude. Ex: {"latitude":15.333,"longitude":76.444}
  * @param {function} - successcallback
  * @param {function} - failurecallback
  */
LocationManager.prototype.fetchAddressWithLatLong = function(latLongObj,successCallback,failureCallback){
  var loggerManager = applicationManager.getLoggerManager();
  try{
    loggerManager.log("#### start LocationManager : fetchAddressWithLatLong ####");
    var self = this;
    if(latLongObj && latLongObj.latitude && latLongObj.longitude){
      loggerManager.log("#### latitude : "+latLongObj.latitude+" longitude "+latLongObj.longitude);
      var customVerbName = 'getAddress';
      var params = {};
      params.latitude = latLongObj.latitude;
      params.longitude = latLongObj.longitude;
      this.makeServiceCall(customVerbName,params,successCall,failureCall);
      function successCall(data){
        loggerManager.log("#### in success "+JSON.stringify(data)+" ####");
        self.processAddress(data,successCallback);
      }
      function failureCall(error){
        loggerManager.log("#### in error "+JSON.stringify(error)+" ####");
        failureCallback(error);
      }
    }
  }catch(err){
    loggerManager.log("#### in catch "+JSON.stringify(err)+" ####");
  }
};
/**
  * this function formats the address
  * @member of LocationManager
  * @param {Array} response - response came from the getLocationAddress custom verb service call
  * @param {function} - callback
  */
LocationManager.prototype.processAddress = function(response,callback){
  var loggerManager = applicationManager.getLoggerManager();
  try{
    var address = {};
    var addressLane1 = "";
    var addressLane2 = "";
    var state = "";
    var data = response.formattedAddress;
    var arr = data.split(',');
    if(arr.length >= 3){
      var statePostal = arr[arr.length-2].trim().split(" ");
      var address = {
        "country" : arr[arr.length-1].trim(),
        "zipcode" : statePostal[statePostal.length-1],
        "city" : arr[arr.length-3].trim()
      };
      var mid = Math.round((arr.length-3)/2);
      for(var i=0;i<statePostal.length-1;i++){
        state = state + statePostal[i] + " ";
      }
      address["state"] = state.trim();
      for(var i=0;i<mid;i++){
        addressLane1 = addressLane1 + arr[i] +",";
      }
      address["addressLine1"] = addressLane1.substring(0,addressLane1.length-1).trim();
      for(var j=mid;j<=arr.length-3;j++){
        addressLane2 = addressLane2 + arr[j] + ",";
      }
      address["addressLine2"] = addressLane2.substring(0,addressLane2.length-1).trim();
      address["formattedAddress"] = data;
      callback(address);
    }
    else if(arr.length == 2){
      address["country"] = arr[1];
      address["state"] = arr[0];
      address["formattedAddress"] = data;
      callback(address);
    }
    else if(arr.length == 1 && arr[0] !== ''){
      address["country"] = arr[0];
      address["formattedAddress"] = data;
      callback(address);
    }
    else{
      callback(response);
    }
  }catch(err){
    loggerManager.log("#### in catch "+JSON.stringify(err)+" ####");
  }
};
/**
  * Get address Suggestions based on given string
  * @member of LocationManager
  * @param {string} query - prefix of address
  * @param {function} - successcallback
  * @param {function} - failurecallback
  */
LocationManager.prototype.fetchAddressSuggestions = function(query,successCallback,failureCallback){
  var loggerManager = applicationManager.getLoggerManager();
  try{
    loggerManager.log("#### start LocationManager : fetchAddressSuggestions ####");
    if(query && query !== null && query !== undefined){
      loggerManager.log("#### query is "+query+"####");
      var customVerbName = "getAddressSuggestions";
      var params = {};
      params.query = query.text;
      params.currLatitude = query.currLatitude;
      params.currLongitude = query.currLongitude;
      this.makeServiceCall(customVerbName, params, successCall, failureCall);
      function successCall(data){
        loggerManager.log("#### in success "+JSON.stringify(data)+" ####");
        successCallback(data);
      }
      function failureCall(error){
        loggerManager.log("#### in error "+JSON.stringify(error)+" ####");
        failureCallback(error);
      }
    }
  }catch(err){
    loggerManager.log("#### in catch "+JSON.stringify(err)+" ####");
  }
};
/**
  * this is helper function to make service calls
  * @member of LocationManager
  * @param {string} customVerbName - name of the customverb
  * @param {Object} params - input parameters to the service call
  * @param {function} - successcallback
  * @param {function} - failurecallback
  */
LocationManager.prototype.makeServiceCall = function(customVerbName,params,successCall,failureCall){
  try{
    var LocationsRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository('Locations');
    LocationsRepo.customVerb(customVerbName,params,onCompletionCallback);
    function onCompletionCallback(status,data,error){
      var serviceResponseHandler = applicationManager.getServiceResponseHandler();
      var obj = serviceResponseHandler.manageResponse(status,  data,  error);
      if(obj["status"] === true){
        successCall(obj["data"]);
      }
      else{
        failureCall(obj["errmsg"]);
      }
    }
  }catch(err){
  }
};
/**
  * get the directions from souce location to destination location
  * @member of LocationManager
  * @param {Object} souce - contains source lat and long
  * @param {Object} destination - contains destination lat and long
  * @param {function} - successcallback
  * @param {function} - failurecallback
  */
LocationManager.prototype.fetchDirections = function(source,destination,successCallback,failureCallback){
  var deviceUtilManager = applicationManager.getDeviceUtilManager();
  var loggerManager = applicationManager.getLoggerManager();

  //kony.map.searchRoutes api is not supported in Huawei devices
  //Hence returning an error callback incase of Huawei devices
  if(deviceUtilManager.checkHuaweiservicesSupported()){
    failureCallback({'code':422,'message':"kony.map.searchRoutes API is not supported for Huawei devices"});
    return;
  }
  try{
    loggerManager.log("#### start LocationManager : fetchDirections ####");
    if(source && source.latitude && source.longitude && destination && destination.latitude && destination.longitude){
      loggerManager.log("#### source is "+JSON.stringify(source)+"  destination is "+JSON.stringify(destination)+" ####");
      
      var userAgent = "android";
      if(deviceUtilManager.isIPhone()){
        userAgent = "iphone";
      }
      var searchCriteria = {};
      if(userAgent === "iphone"){
        searchCriteria = {
          origin : {
            lat:source.latitude,
            lon:source.longitude
          },
          destination : {
            lat : destination.latitude,
            lon : destination.longitude
          },
          alternatives : false
        };
      }
      else{
        searchCriteria = {
          origin : {
            lat:source.latitude,
            lon:source.longitude
          },
          destination : {
            lat : destination.latitude,
            lon : destination.longitude
          },
          directionServiceUrl : "https://maps.googleapis.com/maps/api/directions/json",
          alternatives : false,
          apiKey : "AIzaSyAJOkl-7hJ08jbE5sBZs9Da9qrHP_XhXro"
        };
      }
      kony.map.searchRoutes(searchCriteria,successCall,failureCall);
      function successCall(response){
        loggerManager.log("#### in success "+JSON.stringify(response)+" ####");
        successCallback(response);
      }
      function failureCall(error){
        loggerManager.log("#### in error "+JSON.stringify(error)+" ####");
        failureCallback(error);
      }
    }
  }catch(err){
    loggerManager.log("#### in catch "+JSON.stringify(err)+" ####");
  }
};
/**
  * converts meters ot kilometers to Miles
  * @member of LocationManager
  * @param {Number} meterValue - value in meters
  * @returns {Number} Miles - Value in Miles
  */
LocationManager.prototype.convertToMiles = function(meterValue){
  try{
    var mileValue = "";
    mileValue = meterValue * 0.000621371;
    mileValue = mileValue.toFixed(1);
    if(mileValue === 0.0){
      mileValue = meterValue * 3.28084;
      mileValue = mileValue.toFixed(0)+" "+"Feet";
    }else{
      mileValue = mileValue+" "+"Miles";
    }
    return mileValue;
  }catch(err){
  }
};
LocationManager.prototype.convertToMins = function(secValue){
  try{
    var minValue = "";
    minValue = secValue / 60;
    minValue = minValue.toFixed(0);
    if (minValue === 0) {
      minValue = secValue + " " + "Seconds";
    } else {
      minValue = minValue + " " + "Minutes";
    }
    return minValue;
  }catch(err){
  }
};
return LocationManager;
});