/**
*@module AsyncManager
 */
define([], function() {
/**
 * This is class named AsyncManager which handles service calls made asynchronously.
 * @alias module:AsyncManager
 * @class
*/
 function AsyncManager(){
  /**@member {array} responseInfo is used to store service response and status*/
  this.responseInfo = [];
}
inheritsFrom(AsyncManager, kony.mvc.Business.Delegator);
AsyncManager.prototype.initializeBusinessController = function(){};
/**
  * Function used to initiate responceInfo array to store all status and response of service calls.
  * @param {number} count - indicates number of service calls to be monitored.
  */
AsyncManager.prototype.initiateAsyncProcess= function(count)
{
  for(var i=0;i<count;i++)
  {
    this.responseInfo[i] = {};
    this.responseInfo[i].completionStatus = false;
    this.responseInfo[i].Status = "";
    this.responseInfo[i].data = "";
   }
};
/**
  * Function used to set a status of particular service to success.
  * @param {number} whichCall - indicates which service call status to be made success.
  * @param {Object} res - response of the service call.
  */
AsyncManager.prototype.setSuccessStatus= function(whichCall,res)
{
     this.responseInfo[whichCall].completionStatus = true;
     this.responseInfo[whichCall].Status = "success";
     this.responseInfo[whichCall].data = res;
};
/**
  * Function used to set a status of particular service to Error.
  * @param {number} whichCall - indicates which service call status to be made Error.
  * @param {Object} err - Error response of the service call.
  */
AsyncManager.prototype.setErrorStatus= function(whichCall,err)
{
     this.responseInfo[whichCall].completionStatus = true;
     this.responseInfo[whichCall].Status = "error";
     this.responseInfo[whichCall].data = err;
};
/**
  * Function used to return particular service response and status.
  * @param {number} whichCall - indicates which service call response and status to be returned.
  * @returns {Object} - responceInfo record of the particular service call.
  */
AsyncManager.prototype.getStatusandData= function(whichCall)
{
   return this.responseInfo[whichCall];
};
/**
  * Function used to return particular service data.
  * @param {number} whichCall - indicates which service call data to be returned.
  * @returns {Object} - data of the particular service call.
  */
AsyncManager.prototype.getData= function(whichCall)
{
   return this.responseInfo[whichCall].data;
};
/**
  * Function used to check whether all services are done and successful or not.
  * @param {number} count - indicates number of services calls are made.
  * @returns {Boolean} - whether all services are done and successful or not.
  */
AsyncManager.prototype.areAllservicesDone= function(count)
{
   for(var i=0;i<count;i++)
   {
    if (this.responseInfo[i].Status !== "success" || this.responseInfo[i].Status === "")
      return false;
   }
    return true;
};
/**
  * Function used to check whether all services are completed or not.
  * @param {number} count - indicates number of services calls are made.
  * @returns {Boolean} - whether all services are completed or not.
  */
AsyncManager.prototype.areAllservicesCompleted= function(count)
{
   for(var i=0;i<count;i++)
   {
    if (this.responseInfo[i].completionStatus == false)
      return false;
   }
    return true;
};
/**
  * Function used to check whether all mandatory services are completed or not.
  * @param {number} count - indicates number of services calls are made.
  * @param {array} Exclude - indicates all not mandatory services
  * @returns {Boolean} - whether all mandatory services are completed or not.
  */
AsyncManager.prototype.areAllMandatoryservicesDone= function(count,Exclude)
{
  var exclude = new Set(Exclude);
  for(var i=0;i<count;i++)
    {
      if(!exclude.has(i)){
        if (this.responseInfo[i].Status !== "success" || this.responseInfo[i].Status === "")
        return false;
        }
    }
  return true;
};
/**
  * Function used to clear all status of a particular service call.
  * @param {number} id - indicates which service status to be cleared.
  */
AsyncManager.prototype.clearCallStatus = function(id)
{
   this.responseInfo[id]={};
}
/**
  * Function used to clear all status of a particular service call.
  * @param {number} id - indicates which service status to be cleared.
  */
AsyncManager.prototype.isServiceCompleted = function(id)
{
  return this.responseInfo[id].completionStatus === true? true:false;
}
/**
  * Function used to check whether particular service call is success or not.
  * @param {number} id - indicates which service status has to be checked.
  * @returns {Boolean} - whether the particular services is successful or not.
  */
AsyncManager.prototype.isServiceSuccess = function(id)
{
  return this.responseInfo[id].Status == "success"? true:false;
}
/**
  * Function used to check whether particular service call is failed or not.
  * @param {number} id - indicates which service status has to be checked.
  * @returns {Boolean} - whether the particular services is failed or not.
  */
AsyncManager.prototype.isServiceFailed = function(id)
{
  return this.responseInfo[id].Status == "error"? true:false;
}
/**
 * This class contains the repsonse of single manager call.
 * @class
 * @param {function} isSuccess Denotes the status of asynchronous manager call.
 * @param {function} data Data from Service Response Handler
 */
function AsyncResponse (isSuccess, data) {
  this.isSuccess = isSuccess;
  this.data = data;
}
/**
 * This class contains the repsonse of all manager calls.
 * @class
 * @param {array} asyncResponses Array of async responses
 */
function AsyncCompletionResponse (asyncResponses) {
  this.responses = asyncResponses;
}
/**
 * This Class denotes a manager call
 * @class
 * @param {object} manager The manager whose call is to be made
 * @param {string} managerFunction The manager function
 * @param {object} params Array of parameters need to be passed
 */
function AsyncCall (manager,managerFunction, params) {
    this.manager = manager;
    this.managerFunction = managerFunction;
    this.params = params || [];
}
/**
 * Helper method to check if all responses were successful or not.
 * @function isAllSuccess
 * @param {AsyncResponse[]} asyncResponses Array of async responses
 * @returns {boolean} If all calls were successful then true otherwise false
 */
AsyncCompletionResponse.prototype.isAllSuccess = function () {
  return this.responses.reduce(function (accumulator, asyncResponse) {
      return accumulator + (asyncResponse.isSuccess ? 1 : 0)
  }, 0) === this.responses.length;
}
/**
 * Helper method to get a new async call
 * @function asyncItem
 * @param {*} manager whose call to made
 */
AsyncManager.prototype.asyncItem = function (manager,managerFunction, params) {
  return new AsyncCall(manager, managerFunction, params);
}
/**
 * This method helps calling asynchronous methods of manager parallely.
 * @param {function} completionCallback A callback function which will be called when all calls will be complete.
 * @param {AsyncCall[]} managerCalls Methods of a manager, assuming second-last and last param to be success and error callback
 * @returns {boolean} If all calls were successful then true otherwise false
 */
AsyncManager.prototype.callAsync =  function (managerCalls, completionCallback) {
      var totalNumberOfAsyncCalls = managerCalls.length;
      var responseTable = {};
      function sendResult () {
          var responses = [];
          Object.keys(responseTable).forEach(function (index) {
              responses[index] = responseTable[index];
          })
          completionCallback(new AsyncCompletionResponse(responses))
      }
      function checkForCompletion () {
          if(Object.keys(responseTable).length === totalNumberOfAsyncCalls) {
              sendResult();
          }
      }
      function getSuccessCallback (index) {
          return function (data) {
              responseTable[index] = new AsyncResponse(true, data);
              checkForCompletion();
          }
      }
      function getErrorCallback (index) {
          return function (data) {
              responseTable[index] = new AsyncResponse(false, data);
              checkForCompletion();
          }
      }
      managerCalls.forEach(function (managerCall, index) {
          // Some checks needed
          managerCall.params.push(getSuccessCallback(index), getErrorCallback(index));
          managerCall.manager[managerCall.managerFunction].apply(managerCall.manager, managerCall.params);
      });
  }
return AsyncManager;
});