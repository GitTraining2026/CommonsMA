/**
  *@module DirectMarketingManager
 */
  define([], function() {
   /**
   *This is class named DirectMarketingManager which handles all functions related to Advertisements in the application
   *@alias module:DirectMarketingManager
   *@class
   */
function DirectMarketingManager(){
   /**@member {Boolean} renderPreLoginAds Contains data whether prelogin ads can be rendered to view(frmLogin) at view's preshow level or not */
    this.renderPreLoginAds = false;
   /**@member {Boolean} preLoginAdsFetched Contains data whether prelogin ads data is available or not*/
    this.preLoginAdsFetched = false;
   /**@member {Boolean} postLoginAdsFetched Contains data whether postlogin ads data is available or not*/
    this.postLoginAdsFetched = false;
   /**@member {Boolean} accountDashboardCampaignsFetched Contains data whether Account Dashboard Campaigns data is available or not*/
    this.accountDashboardCampaignsFetched = false;
   /**@member {Array} Json array - preLoginAds Contains fetched prelogin ad data*/
   	this.preLoginAds = [];
   /**@member {Array} Json array - postLoginAds Contains fetched postlogin ad data*/
    this.postLoginAds = [];
   /**@member {Array} Json array - accountDashboardCampaigns Contains infeed ad data - obtained from postlogin ad data*/
    this.accountDashboardCampaigns = [];
   /**@member {Integer} maxNumOfPreloginAds Contains the value - maximum number of prelogin ads that can be shown in Application*/
    this.maxNumOfPreloginAds = 5;
   /**@member {Integer} maxNumOfPostLoginAds Contains the value - maximum number of postlogin ads that can be shown in Application*/
    this.maxNumOfPostLoginAds = 5;
   /**@member {Integer} maxNumOfAccountDashboardCampaigns Contains the value - maximum number of Account Dashboard Campaigns that can be shown in Application*/
    this.maxNumOfAccountDashboardCampaigns = 5;
   /**@member {String} preloginAdSessionId Contains the sessionId for prelogin ads as obtained when prelogin ads are fetched*/
    this.preloginAdSessionId = "";
   /**@member {String} postLoginAdSessionId Contains the sessionId for postlogin ads as obtained when postlogin ads are fetched*/
    this.postLoginAdSessionId = "";
}
inheritsFrom(DirectMarketingManager, kony.mvc.Business.Delegator);
DirectMarketingManager.prototype.initializeBusinessController = function(){};
/**
  * Set renderPreLoginAds stored in the class.
  * @param {Boolean} - The value with which renderPreLoginAds has to be updated.Called in succes callback of getPreloginAds
  */
DirectMarketingManager.prototype.setRenderPreloginAds =function(value)
{
      this.renderPreLoginAds = value;
};
/**
  * Get renderPreLoginAds stored in the class.
  * @returns {Boolean} - returns whether Prelogin Ad data can be rendered to view(frmLogin) or not.Called in preshow of the form.
  */
DirectMarketingManager.prototype.getRenderPreloginAds =function()
{
       return this.renderPreLoginAds;
};
/**
  * Get the preLoginAdsFetched stored in the class.
  * @returns {Boolean} - returns whether prelogin ads were fetched in this session or not.
  */
DirectMarketingManager.prototype.arePreLoginAdsFetched =function()
{
       return this.preLoginAdsFetched;
};
/**
  * Get the postLoginAdsFetched stored in the class.
  * @returns {Boolean} - returns whether postlogin ads were fetched in this session or not.
  */
DirectMarketingManager.prototype.arePostLoginAdsFetched =function()
{
       return this.postLoginAdsFetched;
};
/**
  * Get the accountDashboardCampaignsFetched stored in the class.
  * @returns {Boolean} - returns whether Account Dashboard Campaigns were fetched in this session or not.
  */
DirectMarketingManager.prototype.areAccountDashboardCampaignsFetched =function()
{
       return this.accountDashboardCampaignsFetched;
};
/**
  * Get the maxNumOfPreloginAds stored in the class.
  * @returns {Integer} - maxNumOfPreloginAds that the Application can show.
  */
DirectMarketingManager.prototype.getMaxNumOfPreloginAds=function()
{
       return this.maxNumOfPreloginAds;
};
/**
  * Get the maxNumOfPostLoginAds stored in the class.
  * @returns {Integer} - maxNumOfPostLoginAds that the Application can show.
  */
DirectMarketingManager.prototype.getMaxNumOfPostLoginAds=function()
{
       return this.maxNumOfPostLoginAds;
};
/**
  * Get the maxNumOfAccountDashboardCampaigns stored in the class.
  * @returns {Integer} - maxNumOfAccountDashboardCampaigns that the Application can show.
  */
DirectMarketingManager.prototype.getMaxNumOfAccountDashboardCampaigns=function()
{
       return this.maxNumOfAccountDashboardCampaigns;
};
/**
  * Get the preLoginAdsSessionId stored in the class.
  * @returns {String} - sessionId of preLoginAds.
  */
DirectMarketingManager.prototype.getPreLoginAdsSessionId=function()
{
       return this.preloginAdSessionId;
};
/**
  * Get the postLoginAdsSessionId stored in the class.
  * @returns {String} - sessionId of postLoginAds.
  */
DirectMarketingManager.prototype.getPostLoginAdsSessionId=function()
{
       return this.postLoginAdSessionId;
};
/**
  * Get the preLoginAds  stored in the class.
  * @param {function} presentationSuccessCallback will be called when call is successfull
  * @param {function} presentationErrorCallback will be called when call is not successfull
  * @returns {Array} - json Array of preLoginAds if they were already fetched
  */
DirectMarketingManager.prototype.getPreLoginAds=function(presentationSuccessCallback,presentationErrorCallback)
{
      this.getAds("preLoginAds",presentationSuccessCallback,presentationErrorCallback);
};
/**
  * Get the postLoginAds  stored in the class
  * @param {function} presentationSuccessCallback will be called when call is successfull
  * @param {function} presentationErrorCallback will be called when call is not successfull
  * @returns {Array} - json Array of postLoginAds if they were already fetched
  */
DirectMarketingManager.prototype.getPostLoginAds=function(presentationSuccessCallback,presentationErrorCallback)
{
      this.getAds("postLoginAds",presentationSuccessCallback,presentationErrorCallback);
};
/**
  * Get the accountDashboardCampaigns  stored in the class.
  * @returns {Array} - json Array of accountDashboardCampaigns.
  */
DirectMarketingManager.prototype.getAccountDashboardCampaigns=function(presentationSuccessCallback, presentationErrorCallback)
{
    this.getAds("accountDashboardCampaigns",presentationSuccessCallback,presentationErrorCallback);
};
/**
  * wrapper class to getLocationAndFetchAds
  * makes sure that the location api called is run on Main Thread.
  * @param  - params to be passed to getLocationAndFetchAds
  */
DirectMarketingManager.prototype.getLocationAndFetchAdsHelper = function(adType,presentationSuccessCallback,presentationErrorCallback){
	kony.runOnMainThread(this.getLocationAndFetchAds.bind(this),[adType,presentationSuccessCallback,presentationErrorCallback]);
};
/**
  * wrapper class to getAds - As location has to be fetched before fetching ads
  * Get the current location attributes(latitude & longitude) and call getAds along with latitude & longitude information
  * latitude and longitude are null if user denies location permissions
  * @param {String} - adType (preloginAds or postLoginAds) of the ads to be fetched
  * @param {function} presentationSuccessCallback  - as passed to getPostLoginAds/getPreLoginAds
  * @param {function} presentationErrorCallback - as passed to getPostLoginAds/getPreLoginAds
  */
DirectMarketingManager.prototype.getLocationAndFetchAds = function(adType,presentationSuccessCallback,presentationErrorCallback)
{
  var scope =this;
  var positionoptions = {timeout:32000,fastestInterval:0,minimumTime : 0};
  kony.location.getCurrentPosition(geoLocationSuccessCallBack, geoLocationErrorCallBack, positionoptions);
  //kony.runOnMainThread(kony.location.getCurrentPosition,[geoLocationSuccessCallBack, geoLocationErrorCallBack, positionoptions]);
  function geoLocationSuccessCallBack(response){
    if(response && response.coords && response.coords.latitude && response.coords.longitude){
      var latitude =response.coords.latitude;
      var longitude =response.coords.longitude;
      scope.getAds(adType,presentationSuccessCallback,presentationErrorCallback);
    }
  }
  
  function geoLocationErrorCallBack(err)
  {
    var logger = applicationManager.getLoggerManager();
    var errorMsg = "Couldn't fetch location attributes - Error code: " + err.code;
    errorMsg = errorMsg  + " message: " + err.message;
    logger.log("####"+errorMsg);
    scope.getAds(adType,presentationSuccessCallback,presentationErrorCallback);
  }
};
/**
  * Get the ads based on adType using a service call
  * @param {String} adType - (preloginAds or postLoginAds) of the ads to be fetched
  * @param {function} presentationSuccessCallback  - as passed to getPostLoginAds/getPreLoginAds
  * @param {function} presentationErrorCallback - as passed to getPostLoginAds/getPreLoginAds
  * @param {Float} lat - latitude of current location
  * @param {Float} long - longitude of current location
  */
// DirectMarketingManager.prototype.getAds = function(adType,presentationSuccessCallback,presentationErrorCallback){
//   var scope = this;
//   var paramObj = {};
//   var verbName;
//   var deviceUtilManager = applicationManager.getDeviceUtilManager();
//   paramObj["scale"] = deviceUtilManager.getDeviceScale();
//   if(adType === "postLoginAds")
//     {
//       verbName = 'getCampaignSpecifications';
//       paramObj["screenName"] = "POST_LOGIN";
//     }
//   else if(adType === "accountDashboardCampaigns")
//    {
//      verbName = 'getCampaignSpecifications';
//      paramObj["screenName"] = "ACCOUNT_DASHBOARD";
//    }
//   else if(adType === "accountDashboardCampaignsWeb")
//    {
//      var breakpoint = kony.application.getCurrentBreakpoint();
// 	 var scale = (breakpoint >= 1366) ? 1366 : breakpoint;
//      verbName = 'getCampaignSpecifications';
//      paramObj["screenName"] = "ACCOUNT_DASHBOARD";
//      paramObj["scale"] = scale;
//    }
//   else if(adType === "NAOCampaignsWeb")
//    {
//      var breakpoint = kony.application.getCurrentBreakpoint();
// 	 var scale = (breakpoint >= 1366) ? 1366 : breakpoint;
//      verbName = 'getCampaignSpecifications';
//      paramObj["screenName"] = "APPLY_FOR_NEW_ACCOUNT";
//      paramObj["scale"] = scale;
//    }
//   else if(adType === "preLoginAds"){
//      verbName = 'getCampaignSpecificationsPreLogin';
//    }
//   else{
//     //AdType Not Supported
//   }
//   var advertisementModel  =  kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Campaign");
//   advertisementModel.customVerb(verbName,paramObj,getAllCompletionCallback);
//   function  getAllCompletionCallback(status,  data,  error) {
//       var srh = applicationManager.getServiceResponseHandler();
//       var obj =  srh.manageResponse(status,  data,  error);
//       var logger = applicationManager.getLoggerManager();
//       if(obj["status"] === true){
//         logger.log("####Successfully fetched ads of type :"+adType);
//         if(presentationSuccessCallback)
//           presentationSuccessCallback(obj["data"].campaignSpecifications);
//       }
//       else {
//         logger.log("####Couldn't fetch ads of type :"+adType);
//         if(presentationErrorCallback)
//           presentationErrorCallback(obj["errmsg"]);
//       }
// 	}
// };
/**
  * Get the ads based on adType using a service call
  * @param {String} adType - (preloginAds or postLoginAds) of the ads to be fetched
  * @param {function} presentationSuccessCallback  - as passed to getPostLoginAds/getPreLoginAds
  * @param {function} presentationErrorCallback - as passed to getPostLoginAds/getPreLoginAds
  * @param {Float} lat - latitude of current location
  * @param {Float} long - longitude of current location
  */
DirectMarketingManager.prototype.getAds = function(adType,presentationSuccessCallback,presentationErrorCallback){
  var scope = this;
  var paramObj = {};
  var verbName;
  var deviceUtilManager = applicationManager.getDeviceUtilManager();
  paramObj["scale"] = deviceUtilManager.getDeviceScale();
  //postLoginAds - full screen Ads
  //infeed - Ads on account dashboard
  //preLoginAds - Ads on Login page

     if(adType === "postLoginAds")
    {
      verbName = 'getCampaign';
      paramObj["placeholderCode"] = "POSTLOGIN";
      paramObj["eventCode"] = "POSTLOGIN";
    }
  else if(adType === "accountDashboardCampaigns")
   {
     verbName = 'getCampaign';
     paramObj["placeholderCode"] = "ACCOUNT_DASHBOARD";
     paramObj["eventCode"] = "ACCOUNTDASHBOARD";
   }
  else if(adType === "accountDashboardCampaignsWeb")
   {
     var breakpoint = kony.application.getCurrentBreakpoint();
	 var scale = (breakpoint >= 1366) ? 1366 : breakpoint;
     verbName = 'getCampaign';
     paramObj["placeholderCode"] = "ACCOUNT_DASHBOARD";
     paramObj["eventCode"] = "ACCOUNTDASHBOARD";
     paramObj["scale"] = scale;
   }
  else if(adType === "NAOCampaignsWeb")
   {
     var breakpoint = kony.application.getCurrentBreakpoint();
 	 var scale = (breakpoint >= 1366) ? 1366 : breakpoint;
     verbName = 'getCampaign';
     paramObj["eventCode"] = "APPLY_NEW_ACCOUNT";
     paramObj["placeholderCode"] = "APPLY_FOR_NEW_ACCOUNT";
     paramObj["scale"] = scale;
   }
  else if(adType === "preLoginAds"){
     verbName = 'getPreLoginCampaigns';
     paramObj["placeholderCode"] = "PRELOGIN";
   }
   else if (adType === "preLoginDesktopAds")
    {
      var breakpoint = kony.application.getCurrentBreakpoint();
      var scale ;
      if(breakpoint>=1366)
        {
          scale = 1366;
        }else if(breakpoint===768){
          scale = 1024;
        }else{
          scale = breakpoint;
        }
    
     verbName = 'getPreLoginCampaigns';
     paramObj["placeholderCode"] = "PRELOGIN";
     paramObj["eventCode"] = "PRELOGIN";
     paramObj["scale"] = scale;
    }
  else{
    //AdType Not Supported
  }
  var advertisementModel  =  kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Campaigns"); // calling new onject to fetch campaigns
  advertisementModel.customVerb(verbName,paramObj,getAllCompletionCallback);
  function  getAllCompletionCallback(status,  data,  error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error);
      var logger = applicationManager.getLoggerManager();
      if(obj["status"] === true){
        logger.log("####Successfully fetched ads of type :"+adType);
        if(presentationSuccessCallback)
		  if(obj && obj["data"] && obj["data"].CampaignSpecifications){
			presentationSuccessCallback(obj["data"].CampaignSpecifications); // CampaignSpecifications is the new key from backend instead of campaignSpecifications 
		  }
		  else{
			  presentationSuccessCallback([]);
		  }
      }
      else {
        logger.log("####Couldn't fetch ads of type :"+adType);
		if(presentationSuccessCallback && obj && obj["errmsg"] && obj["errmsg"]["isServerUnreachable"] == false){
			presentationSuccessCallback([]);
		}	
        if(presentationErrorCallback)
          presentationErrorCallback(obj["errmsg"]);
      }
	}
   
};
/**
  * Assign the adsData fetched to appropriate adtype(prelogin, postlogin & infeed respectively)
  * @param {String} - adType (preloginAds or postLoginAds) of the ads fetched
  * @param {Array} - adsData - actual adData obtained from service call
  */
DirectMarketingManager.prototype.splitAds = function(adType,adsData) {
  var adsArray = adsData;
  var logger = applicationManager.getLoggerManager();
  if(adType === "preLoginAds")
  {
    this.preLoginAds = adsArray;
    if(!adsArray)
      logger.log("#### No prelogin Ads found");
  }
  else if(adType === "postLoginAds")
  {
    this.postLoginAds = adsArray;
    if(!adsArray)
      logger.log("#### No:of postLogin Ads found: 0");
  }
  else if(adType === "accountDashboardCampaigns")
  {
    this.accountDashboardCampaigns = adsArray;
    if(!adsArray)
      logger.log("#### No:of Account Dashboard Campaigns found: 0");
  }
  else{
    //adType not supported
  }
};
/**
  * Called by splitAds to split the ads in postloginads Data to infeed and postlogin(2 different arrays)
  * @param {Array} - JSON array adsData as passed to splitAds
  * @returns {Array} - An array consisting of 2 arrays(postlogin ad array and infeed ad array)
  */
DirectMarketingManager.prototype.getAdsByType = function(adsData){
  var final = [];
    	var infeed = [];
    	var nonInfeed = [];
    	final.push(nonInfeed);
    	final.push(infeed);
    	for (var ad in adsData) {
       		if  (adsData[ad].adType === "infeed") {
            	infeed.push(adsData[ad]);
        	} else {
            	nonInfeed.push(adsData[ad]);
        	}
    	}
    	return final;
};
/**
  * send data regarding the interaction done by the user w.r.t Ads, for metrics using a service call
  * @param {object} paramObj - a json consisting of 2 keys : sessionId and navigationId of the interaction
  * @param {function} -  presentationSuccessCallback will be called when call is successfull
  * @param {function} - presentationErrorCallback will be called when call is not successfull
  */
DirectMarketingManager.prototype.sendDmResponse = function(paramObj,presentationSuccessCallback, presentationErrorCallback)
{
  var advertisementRepo  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("DirectMarketing");
	advertisementRepo.customVerb('sendDmResponse',paramObj,getAllCompletionCallback);
  function  getAllCompletionCallback(status,  data,  error) {
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
/**
  * Reset's all the Ads class variables to their default values
  */
DirectMarketingManager.prototype.clearAdObjects = function()
{
    this.renderPreLoginAds = false;
    this.preLoginAdsFetched = false;
    this.postLoginAdsFetched = false;
  	this.accountDashboardCampaignsFetched = false;
	this.preLoginAds = [];
	this.postLoginAds = [];
	this.accountDashboardCampaigns = [];
    this.maxNumOfPreloginAds = 5;
    this.maxNumOfPostLoginAds = 5;
    this.maxNumOfAccountDashboardCampaigns = 5;
    this.preloginAdSessionId = "";
    this.postLoginAdSessionId = "";
};

    DirectMarketingManager.prototype.getPopupAds = function(paramObj, verbName,presentationSuccessCallback,presentationErrorCallback){

      function  getAllCompletionCallback(status,  data,  error) {
        let srh = applicationManager.getServiceResponseHandler();
        let obj =  srh.manageResponse(status,  data,  error);
        if(obj["status"]){
          let campaigns = obj.data && obj.data.CampaignSpecifications ? obj.data.CampaignSpecifications : [];
          presentationSuccessCallback(campaigns);
        } else {
          presentationErrorCallback(obj["errmsg"]);
        }
      }

      var advertisementModel  =  kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Campaigns");
      advertisementModel.customVerb(verbName,paramObj,getAllCompletionCallback);
    };
	
	DirectMarketingManager.prototype.ignorePopupAds = function(campaignId, callback){
      var campaignManagementManager = applicationManager.getCampaignManagementManager();
      campaignManagementManager.ignorePopupAds({"campaignId": campaignId}, callback);
    };
	
return DirectMarketingManager;
});