/**
  *@module QRCodeManager
  */

define([], function() {
  /**
 	 *QRCodeManager class is used to handle all functions related to scanning of QR Code for cashless transfers.
 	 *@alias module:QRCodeManager
 	  *@class
  */
  function CampaignManagementManager(){

  };

  inheritsFrom(CampaignManagementManager, kony.mvc.Business.Delegator);

  CampaignManagementManager.prototype.initializeBusinessController = function(){};

  /**
  * creates cardless TransactionsQRCode using a service call.
  * @param {object} record -  record which is sent to create transaction.
  * @param {function} presentationSuccessCallback will be called when call is successful
   * @param {function} presentationErrorCallback will be called when call is not successful
  */
  CampaignManagementManager.prototype.updateCampaigning = function(params,presentationSuccessCallback, presentationErrorCallback){
    var campaigning  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Campaign");
    campaigning.customVerb('ignoreCampaignForCustomer',params,saveCompletionCallback,"online");
    function  saveCompletionCallback(status,  data,  error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj["status"] === true){
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
  
  
  CampaignManagementManager.prototype.createDeposit = function(params,presentationSuccessCallback, presentationErrorCallback){
    var campaigning  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Accounts");
    campaigning.customVerb('newAccountShortTermDeposit',params,saveCompletionCallback,"online");
    function  saveCompletionCallback(status,  data,  error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj["status"] === true){
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
  
  CampaignManagementManager.prototype.createAccountAndAddBalance = function(params,presentationSuccessCallback, presentationErrorCallback){
    var campaigning  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Accounts");
    campaigning.customVerb('newCashIncentiveAccount',params,saveCompletionCallback,"online");
    function  saveCompletionCallback(status,  data,  error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj["status"] === true){
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
  
  CampaignManagementManager.prototype.createLoanAccount = function(params,presentationSuccessCallback, presentationErrorCallback){
    var campaigning  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Accounts");
    campaigning.customVerb('newLoanAccount',params,saveCompletionCallback,"online");
    function  saveCompletionCallback(status,  data,  error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      if(obj["status"] === true){
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
  
  CampaignManagementManager.prototype.ignorePopupAds = function(params,callback){
    function  saveCompletionCallback(status,  data,  error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      obj.isSuccess = obj["status"] === true;
      callback(obj);
    }
    var completedCampaign  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("CompletedCampaign");
    completedCampaign.save(params,saveCompletionCallback,"online");
  };
  
  
  return CampaignManagementManager;
});