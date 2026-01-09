/**
*@module TermsAndConditionsManager
 */
define([], function() {
    /**
      * Terms and Condition Manager used to get the details of the Support form
      * @alias module:TermsAndConditionsManager
      * @class
      */
    function TermsAndConditionsManager(){
    };
    inheritsFrom(TermsAndConditionsManager, kony.mvc.Business.Delegator);
    /**
     * Overridden Method of kony.mvc.Business.Controller
     * This method gets called when business controller gets initialized
     * @method
     */
    TermsAndConditionsManager.prototype.initializeBusinessController = function() {
    };
    /**
     * Overridden Method of kony.mvc.Business.Controller
     * This method gets called when business controller is told to execute a command
     * @method
     * @param {Object} kony.mvc.Business.Command Object
     */
	TermsAndConditionsManager.prototype.execute = function(command) {
		kony.mvc.Business.Controller.prototype.execute.call(this, command);
  };
   /**
  * fetch the Terms and Conditions using a service call.
  * @param {function} presentationSuccessCallback  will be called when call is successfull
  * @param {function} presentationErrorCallback will be called when call is not successfull
  */
 TermsAndConditionsManager.prototype.fetchTermsAndConditionsPostLogin = function(param,presentationSuccessCallback,presentationErrorCallback)
 {
   var self =this;
   var infoTerms  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("TermsAndConditions");
   infoTerms.customVerb('getPostLogin', param, getCompletionCallback);
   function  getCompletionCallback(status,  data,  error) {
     var srh = applicationManager.getServiceResponseHandler();
     var obj =  srh.manageResponse(status,  data,  error,presentationSuccessCallback,presentationErrorCallback);
     if(obj["status"] === true){
     presentationSuccessCallback(obj["data"]);
     }
     else {
       presentationErrorCallback(obj["errmsg"]);
     }
   }
 };
  /**
  * fetch the Terms and Conditions pre login using a service call.
  * @param {function} presentationSuccessCallback  will be called when call is successfull
  * @param {function} presentationErrorCallback will be called when call is not successfull
  */
 TermsAndConditionsManager.prototype.fetchTermsAndConditionsPreLogin = function(param,presentationSuccessCallback,presentationErrorCallback)
 {
   var self =this;
   var infoTerms  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("TermsAndConditions");
   infoTerms.customVerb('getPreLogin', param, getCompletionCallback);
   function  getCompletionCallback(status,  data,  error) {
     var srh = applicationManager.getServiceResponseHandler();
     var obj =  srh.manageResponse(status,  data,  error,presentationSuccessCallback,presentationErrorCallback);
     if(obj["status"] === true){
     presentationSuccessCallback(obj["data"]);
     }
     else {
       presentationErrorCallback(obj["errmsg"]);
     }
   }
 };
  TermsAndConditionsManager.prototype.createTermsAndConditionsLogin = function(param, presentationSuccessCallback,presentationErrorCallback)
  {
    var self =this;
    var infoTerms  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("TermsAndConditions");
    infoTerms.customVerb('createCustomerTNCForLogin',param,getCompletionCallback);
    function  getCompletionCallback(status,  data,  error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error,presentationSuccessCallback,presentationErrorCallback);
      if(obj["status"] === true){
      presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
    return TermsAndConditionsManager;
});