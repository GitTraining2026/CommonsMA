define(["CommonUtilities",'OLBConstants'], function (CommonUtilities,OLBConstants) {

  return {
    /** 
     *	To show Campaign Popup call the method in the preshow of a Form Controller.
     */
      CAMPAIGN_CONSTANTS : {
      PLACEHOLDERCODE : "POPUP",
      PREFIX : "OLB_",
      VERB : "getCampaign",
    },
    fetchPopupCampaigns : function(frmControllerSuccessCallback, frmControllerErrorCallback){
		let scopeObj = this;
    let popupData = {};
    function campaignsSuccess(response) {
      response = response[0];
      if (response === undefined || response===null) {
        popupData.campaign = undefined;
        kony.print("error", response);
        frmControllerErrorCallback(popupData);
      } else {
        let campaignData = {
          "campaignId": response.campaignId,
          "showCloseIcon": response.showCloseIcon === "true" ? true : false,
          "bannerTitle": response.bannerTitle ? response.bannerTitle : "Banner Title",
          "bannerDescription": response.bannerDescription ? response.bannerDescription : "Banner Description",
          "imageURL": response.imageURL ? response.imageURL : "",
          "destinationURL": response.destinationURL ? response.destinationURL : "https://www.temenos.com",
          "callToActionButtonLabel": response.callToActionButtonLabel ? response.callToActionButtonLabel : "Learn More",
          "callToActionTargetURL": response.callToActionTargetURL ? response.callToActionTargetURL : "https://www.temenos.com",
          "showReadLaterButton": response.showReadLaterButton === "true" ? true : false
        };
        popupData.campaign = campaignData;
        frmControllerSuccessCallback(popupData);
      }
    }
    function campaignsFailure(response){
      popupData.campaign = undefined;
      kony.print("error", response);
      frmControllerErrorCallback(popupData);
    }
		if(kony.os.deviceInfo().name !== "thinclient"){
      if(CommonUtilities.CLIENT_PROPERTIES && CommonUtilities.CLIENT_PROPERTIES.MB_ENABLE_POPUP_CAMPAIGNS && CommonUtilities.CLIENT_PROPERTIES.MB_ENABLE_POPUP_CAMPAIGNS.toUpperCase() === "TRUE"){
        let directMktManager = applicationManager.getDirectMarketingManager();
        //let formname = applicationManager.getNavigationManager().currentForm;
        let formname = kony.application.getCurrentForm().id;
        let context = scopeObj.fetchContext(formname);
        let verbName = 'getCampaign';
        directMktManager.getPopupAds(context, verbName, campaignsSuccess, campaignsFailure);
      }
		}else{
    if(OLBConstants.CLIENT_PROPERTIES && OLBConstants.CLIENT_PROPERTIES.OLB_ENABLE_POPUP_CAMPAIGNS && OLBConstants.CLIENT_PROPERTIES.OLB_ENABLE_POPUP_CAMPAIGNS.toUpperCase() === "TRUE"){
      let directMktManager = applicationManager.getDirectMarketingManager();
      let formname = kony.application.getCurrentForm().id;
      let context = scopeObj.fetchContext(formname);
      directMktManager.getPopupAds(context,scopeObj.CAMPAIGN_CONSTANTS.VERB, scopeObj.campaignsSuccess, scopeObj.campaignsFailure);
    }
		}
    },

    fetchContext : function(formname){
      let self = this;
      let context = {};
      //context["scale"] = applicationManager.getDeviceUtilManager().getDeviceScale();
      context["scale"] = kony.os.deviceInfo().name !== "thinclient" ? "3x" : 1366;
      context["placeholderCode"] = kony.os.deviceInfo().name !== "thinclient" ? "POPUP" : self.CAMPAIGN_CONSTANTS.PLACEHOLDERCODE;
      context["eventCode"] = kony.os.deviceInfo().name !== "thinclient" ? ("MB_" + formname) : (self.CAMPAIGN_CONSTANTS.PREFIX + formname) ;
      return context;
    },
	campaignsSuccess : function(res) {
      applicationManager.getNavigationManager().updateForm({
        "campaign" : res,
      });
    },

    campaignsFailure : function(res) {
      applicationManager.getNavigationManager().updateForm({
        "campaign" : undefined,
      });
      kony.print("error", res);
    },


    removeExistingCampaignpopup : function(view){
      if(kony.os.deviceInfo().name === "thinclient"){
      if(view.flxDialogs && view.flxDialogs.campaignpopup){
        view.flxDialogs.campaignpopup.removeFromParent();
      } else if(view.campaignpopup){
        view.campaignpopup.removeFromParent();
      }
      }else{
      if(view.campaignPopup){
        view.remove(view.campaignPopup);
      }
      }
    },

    showCampaign : function(data, view, mainFlexId){
      let scopeObj = this;
      this.removeExistingCampaignpopup(view);
      let hasCampaign = kony.os.deviceInfo().name !== "thinclient" ? ((data.campaign !==undefined) ? true : false) : (data && data.length > 0);
      if(hasCampaign){
		  if(kony.os.deviceInfo().name !== "thinclient"){
        let campaignData = data.campaign;
        let currForm = kony.application.getCurrentForm();
        var campaignPopup = new com.InfinityMB.Resources.campaignPopup({
          "autogrowMode": kony.flex.AUTOGROW_NONE,
          "clipBounds": true,
          "height": "100%",
          "id": "campaignPopup",
          "appName": "ResourcesMA",
          "isVisible": true,
          "layoutType": kony.flex.FREE_FORM,
          "left": "0dp",
          "masterType": constants.MASTER_TYPE_DEFAULT,
          "isModalContainer": false,
          "skin": "sknFlx000000Op50mb",
          "top": "0dp",
          "width": "100%",
          "zIndex": 2000,
          "overrides": {
            "campaignPopup": {
              "isVisible": true,
              "zIndex": 2000
            },
            "flxClose": {           
              "isVisible": campaignData.showCloseIcon,
              "onClick": () => {
                scopeObj.ignoreCamapign(campaignData.campaignId);
                currForm.campaignPopup.closePopup();
              }
            },
            "imgClose": {
              "src": "closeicon.png"
            },
            "lblHeading": {
              "text": campaignData.bannerTitle
            },
            "lblDescription": {
              "text": campaignData.bannerDescription
            },
            "flxCampaignImage": {
              "onClick": () => {
                let destinationURL = campaignData.destinationURL.trim();
                scopeObj.ignoreCamapign(campaignData.campaignId);
                currForm.campaignPopup.onClickofCampaign(destinationURL);
                currForm.campaignPopup.closePopup();
              }
            },
            "imgPopup": {
              "src": campaignData.imageURL
            },
            "btnNo": {
              "text": kony.i18n.getLocalizedString("i18n.Campaign.ReadLater"),
              "isVisible": campaignData.showReadLaterButton,
              "onClick": () => currForm.campaignPopup.closePopup()
            },
            "btnYes": {
              "text": campaignData.callToActionButtonLabel,
              "onClick": () => {
                let actionURL = campaignData.callToActionTargetURL.trim();
                scopeObj.ignoreCamapign(campaignData.campaignId);
                currForm.campaignPopup.onClickofCampaign(actionURL);
                currForm.campaignPopup.closePopup();
              }
            },
          }
        }, {
          "overrides": {}
        }, {
          "overrides": {}
        });
        view.add(campaignPopup);
        view.forceLayout();
		  }else{
			  let campaignpopup = new com.InfinityOLB.Resources.campaignpopup({
          "autogrowMode": kony.flex.AUTOGROW_NONE,
          "clipBounds": true,
          "height": "100%",
          "id": "campaignpopup",
          "isVisible": hasCampaign,
          "layoutType": kony.flex.FREE_FORM,
          "left": "0dp",
          "masterType": constants.MASTER_TYPE_DEFAULT,
          "isModalContainer": false,
          "skin": "sknBackground000000Op35",
          "top": "0dp",
          "width": "100%",
          "zIndex": 2000,
          "appName": "ResourcesMA",
          "overrides": {
            "lblCampaignId" : {
              "text" : data[0].campaignId
            },
            "lblHeading" : {
              "text" : data[0].bannerTitle
            },
            "lblmessage" : {
              "text" : data[0].bannerDescription
            },
            "imgCampaign" : {
              "src" : data[0].imageURL,
              "onTouchEnd" : function(eventObject){
                let parent = eventObject.parent.parent;
                scopeObj.ignoreCamapign(parent.lblCampaignId.text);
                parent.onClickofCampaign(parent.lblTargetUrl.text.trim());
              }
            },
            "lblTargetUrl": {
              "text": data[0].destinationURL
            },
            "lblCTATargetUrl": {
              "text": data[0].callToActionTargetURL
            },
            "lblcross" : {
              "isVisible" : data[0].showCloseIcon && data[0].showCloseIcon.toUpperCase() === "TRUE",
              "onTouchEnd" : function(eventObject){
                let parent = eventObject.parent.parent.parent;
                scopeObj.ignoreCamapign(parent.lblCampaignId.text);
                parent.closepopup();
              }
            },
            "btnYes" : {
              "text" : data[0].callToActionButtonLabel ? data[0].callToActionButtonLabel : kony.i18n.getLocalizedString("i18n.Campaign.Primary"),
              "onClick" : function(eventObject){
                let parent = eventObject.parent.parent.parent;
                scopeObj.ignoreCamapign(parent.lblCampaignId.text);
                parent.onClickofCampaign(parent.lblCTATargetUrl.text.trim());
              }
            },
            "btnNo" : {
              "isVisible" : data[0].showReadLaterButton && data[0].showReadLaterButton.toUpperCase() === "TRUE",
              "onClick" : function(eventObject){
                let parent = eventObject.parent.parent.parent;
                parent.closepopup();
              }
            },
          }
        }, {
          "overrides": {}
        }, {
          "overrides": {}
        });
        campaignpopup.btnYes.toolTip = data[0].callToActionButtonLabel ? data[0].callToActionButtonLabel : kony.i18n.getLocalizedString("i18n.Campaign.Primary");
        campaignpopup.btnNo.toolTip = kony.i18n.getLocalizedString("i18n.Campaign.ReadLater");
        view.forceLayout();
        this.getBreakpointChanges(campaignpopup);
        view.add(campaignpopup); 
        if(mainFlexId)
          campaignpopup.adjustHeight(mainFlexId);
        campaignpopup.forceLayout();
        view.forceLayout();
		  }
      }
    },

    getBreakpointChanges : function(campaignpopup){
      if(campaignpopup) {
        let breakpoint = kony.application.getCurrentBreakpoint();
        let isMobile = (breakpoint === 640);
        campaignpopup.lblHeading.skin = isMobile ? "sknLabel003e7524px" : "sknLabel003e7540px";
        campaignpopup.lblHeading.left = isMobile ? "20px" : "30px";
        campaignpopup.lblHeading.right = isMobile ? "40px" : "60px";
        campaignpopup.lblmessage.skin = isMobile ? "sknLabel42424215px" : "sknLabel42424220px";
        campaignpopup.lblmessage.left = isMobile ? "20px" : "30px";
        campaignpopup.lblmessage.right = isMobile ? "40px" : "60px";
        campaignpopup.lblcross.right = isMobile ? "10px" : "20px";
        campaignpopup.flxButtons.layoutType = isMobile ? kony.flex.FLOW_VERTICAL : kony.flex.FLOW_HORIZONTAL;
        campaignpopup.flxButtons.reverseLayoutDirection = !isMobile;
        campaignpopup.btnYes.width = isMobile ? "80%" : "30%";
        campaignpopup.btnYes.centerX = isMobile ? "50%" : "";
        campaignpopup.btnNo.width = isMobile ? "80%" : "30%";
        campaignpopup.btnNo.centerX = isMobile ? "50%" : "";
        campaignpopup.btnNo.top = isMobile ? "10px" : "0px";
        campaignpopup.flxpopup.width = isMobile ? "300px" : "560px";
        campaignpopup.imgCampaign.height = isMobile ? "175px" : "323px";
      }
    },

    onBreakpointChange : function(campaignpopup, mainFlexId){
      if(campaignpopup){
        this.getBreakpointChanges(campaignpopup);
        campaignpopup.adjustHeight(mainFlexId);
      }
    },

    ignoreCamapign : function(campaignId) {
      let directMktManager = applicationManager.getDirectMarketingManager();
      var loggerManager = applicationManager.getLoggerManager();
      function callback(res) {
        if(!res.isSuccess)
          loggerManager.log("#### Failed to Ignore Popup Campaign ####");
      }
      directMktManager.ignorePopupAds(campaignId, callback);
    },
    
    onClickofInAppCampaign : function(url){
      // this is a common function to handle all IN-APP Ads
      var scopeObj = this;
      let actionType = scopeObj.getQueryString("actionType",url);
      let moduleName = scopeObj.getQueryString("moduleName",url);
      if(actionType === "internal" && moduleName ==="Enable_Paperless_Statements"){
        var profileModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ProfileModule");
        profileModule.presentationController.showPreferredAccounts();
      }     
      else if(actionType === "internal" && moduleName){
        applicationManager.getNavigationManager().navigateTo(moduleName);
      } else {
        kony.application.openURL(url);
      }
    },

    getQueryString: function(field, url) {
      var href = url;
      var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
      var string = reg.exec(href);
      return string ? string[1] : null;
    },

  };
});