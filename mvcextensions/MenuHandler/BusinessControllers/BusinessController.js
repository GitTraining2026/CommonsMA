/**
*@module MenuHandler
 */
define(['CommonUtilities'], function(CommonUtilities) {
  /**
   * MenuHandler consists of all possible methods related Hamburger Menu
   *@alias module:MenuHandler
   *@class
   */
  function MenuHandler(){
    /**@member {string} forceTouchFlow stores the value of type of module selected in forch touch*/
    this.forceTouchFlow ="";
  };
  /**
  * Function used as call back for force touch options.
  * @params {object} params , indicating the selected force touch option.
  * @returns view controller which have to be displayed
  */
  MenuHandler.prototype.appForceTouchCallBack = function(params) {
    // If launch mode = 3 and quickactionitem key present in launchparams
    // denotes quick action item launch.
    var userPreferencesManager = applicationManager.getUserPreferencesManager();
    if (params["launchmode"] == 3) {
      var deviceUtilManager = applicationManager.getDeviceUtilManager();
      var quickActionItem
      quickActionItem = params["launchparams"]["quickactionitem"];
      if (quickActionItem) {
        if (quickActionItem["id"] == "ATM finder"){
          //if(false){
          var formName;
          if(kony.application.getCurrentForm() !== null){
            formName = kony.application.getCurrentForm().id;
          }
          if(!formName){ formName = "frmLocationMap";
                        var loginFlag  = false;
                        var navMan=applicationManager.getNavigationManager();
                        navMan.setCustomInfo("frmLocationMap",{"isUserLoggedIn":"false"});
                       }
          else{
            loginFlag = true;
          }
          var configManager = applicationManager.getConfigurationManager();
          if(configManager.appLaunchedMode.length === 0) {
            configManager.appLaunchedMode = "shortcut"
          }
          var controller = applicationManager.getPresentationUtility().getController(formName, true);
          var locateUsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("LocateUsModule");
          locateUsModule.presentationController.presentLocateUsView(loginFlag,controller);
          return controller.view;
        } else if (quickActionItem["id"] == "Pay a Bill") {
          if(userPreferencesManager.isLoggedIn === true)
          {
            var navMan=applicationManager.getNavigationManager();
            navMan.setEntryPoint("payBill","frmDashBoard");
            var billPayMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "BillPaymentUIModule", "appName" : "BillPayMA"});
            billPayMod.presentationController.fetchToPayees();
            var controller = applicationManager.getPresentationUtility().getController('frmBillPaySelectPayee', true);
            return controller.view;
          }
          else
          {
            var navMan=applicationManager.getNavigationManager();
            navMan.setEntryPoint("payBill","frmDashBoard");
            this.forceTouchFlow = "Pay a Bill";
            var controller = applicationManager.getPresentationUtility().getController('frmLogin', true);
            return controller.view;
          }
        } else if (quickActionItem["id"] == "Transfer Money") {
          if(userPreferencesManager.isLoggedIn === true)
          {
            var navMan=applicationManager.getNavigationManager();
            navMan.setEntryPoint("makeatransfer","frmDashBoard");
            var controller = applicationManager.getPresentationUtility().getController('frmTransactionMode', true);
            return controller.view;
          }
          else
          {
            var navMan=applicationManager.getNavigationManager();
            navMan.setEntryPoint("makeatransfer","frmDashBoard");
            this.forceTouchFlow = "Transfer Money";
            var controller = applicationManager.getPresentationUtility().getController('frmLogin', true);
            return controller.view;
          }
        } else if (quickActionItem["id"] == "New Check Deposit") {
          if(userPreferencesManager.isLoggedIn === true)
          {
            var navMan=applicationManager.getNavigationManager();
            navMan.setEntryPoint("Deposit","frmDashBoard");
            var checkDepositModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("CheckDepositModule");
            checkDepositModule.presentationController.commonFunctionForNavigation("frmDepositToCD");
            var controller = applicationManager.getPresentationUtility().getController('frmDepositToCD', true);
            return controller.view;
          }
          else
          {
            var navMan=applicationManager.getNavigationManager();
            navMan.setEntryPoint("Deposit","frmDashBoard");
            this.forceTouchFlow = "New Check Deposit";
            var controller = applicationManager.getPresentationUtility().getController('frmLogin', true);
            return controller.view;
          }
        } else if (quickActionItem["id"] === "Money Movement") {
          if(userPreferencesManager.isLoggedIn)
          {
            applicationManager.getPresentationUtility().showLoadingScreen();
            var navMan=applicationManager.getNavigationManager();
            navMan.setEntryPoint("centralmoneymovement","frmDashboardAggregated");
            var index=navMan.getFormIndex("frmDashboardAggregated");
            if (!(index && navMan.stack.includes("frmDashboardAggregated"))) {
              navMan.stack.push("frmDashboardAggregated");
              navMan.setFormIndex("frmDashboardAggregated", navMan.stack.length - 1);
            }
            var moneyMovementModule = applicationManager.getModulesPresentationController({"moduleName" : "MoneyMovementUIModule", "appName" : "TransfersMA"});
            moneyMovementModule.clearMMFlowAtributes();
            kony.runOnMainThread(moneyMovementModule.getFromAndToAccounts,[]);
          }
          else
          {
            var navMan=applicationManager.getNavigationManager();
            navMan.setEntryPoint("centralmoneymovement","frmDashboardAggregated");
            this.forceTouchFlow = "Money Movement";
            var controller = applicationManager.getPresentationUtility().getController('frmLogin', true);
            return controller.view;
          }
        }
      }
    }
  };
  /**
   * Function to Perform Action on Menu Icon and More Option
   * @param {object} scope , which consists of scope of particular module where we initiates this method
   * @param {string} selectedForm, which consists of selected formid
   */
  MenuHandler.prototype.setUpHamburgerForForm = function (scope,selectedForm){
    let self = this;
    var unifiedCont = applicationManager.getPresentationUtility().getController('frmUnifiedDashboard', true);
    self.setMenuData(unifiedCont, selectedForm);
    // if (scope.view.customHeader) {
    //   scope.view.btnHamburgerMenu.onClick = function(scope) {
    //     self.setProfilePic(scope);
    //     self.setLastLoginTime(scope);
    //     self.setUserName(scope);
    //     self.setMenuData(scope, selectedForm);
    //     self.showOrHideHamburgerUI(false, scope);
    //     var navMan = applicationManager.getNavigationManager();
    //     navMan.goBack();
    //   };
    //} 
    // else if (scope.view.customSearch) {
      scope.view.btnHamburgerMenu.onClick = function(scope) {
        var unifiedDash = applicationManager.getPresentationUtility().getController('frmUnifiedDashboard', true);
        self.setProfilePic(unifiedDash);
        self.setLastLoginTime(unifiedDash);
        self.setUserName(unifiedDash);
        // self.setEntityName(scope);
        self.setMenuData(unifiedDash, selectedForm);
        self.showOrHideHamburgerUI(false, unifiedDash);
      };
    // }
    if (applicationManager.getPresentationFormUtility().getDeviceName() === "android") {
      scope.view.flxHamburgerWrapper.setGestureRecognizer(constants.GESTURE_TYPE_SWIPE, {
        fingers: 1
      },function(widgetRef, gestureInfo) {
        if (gestureInfo.swipeDirection === 1) {
          self.showOrHideHamburgerUI(false, scope);
        }
      }.bind(this));
    }
    scope.view.flxHamburgerWrapper.onClick = function(scope){
      self.showOrHideHamburgerUI(false, scope);
    };
    // scope.view.flxHamburgerDummy.onClick = function(scope){
    //   self.showOrHideHamburgerUI(false, scope);
    // };
    scope.view.flxHamburger.onClick = function(scope){
      self.showOrHideHamburgerUI(false, scope);
    };
    // if(applicationManager.getDeviceUtilManager().isIpad() && applicationManager.applicationMode==="tablet"){
    //   scope.view.customFooter.flxMenu.onClick = function(scope){
    //     self.setProfilePic(scope);
    //     self.setLastLoginTime(scope);
    //     self.setUserName(scope);
    //     self.setEntityName(scope);
    //     self.setMenuData(scope, selectedForm);
    //     self.showOrHideHamburgerUI(false, scope);
    //     scope.view.customFooter.flxMenuSelect.setVisibility(true);
    //     scope.view.customFooter.flxAccSelect.setVisibility(false);
    //     scope.view.customFooter.flxTransferSelect.setVisibility(false);
    //     scope.view.customFooter.flxBillPaySelect.setVisibility(false);
    //     scope.view.customFooter.flxDepositsSelect.setVisibility(false);
    //     scope.view.customFooter.lblAccounts.skin = "sknLblA0A0A0SSP20px";
    //     scope.view.customFooter.lblTransfer.skin = "sknLblA0A0A0SSP20px";
    //     scope.view.customFooter.lblBillPay.skin = "sknLblA0A0A0SSP20px";
    //     scope.view.customFooter.lblDeposits.skin = "sknLblA0A0A0SSP20px";
    //     scope.view.customFooter.lblMessage.skin = "sknLblA0A0A0SSP20px";
    //     scope.view.customFooter.lblMenu.skin = "sknLbl424242SSP20px";
    //   };
    // } else if (applicationManager.getDeviceUtilManager().isIPhone()) {
    //   if(scope.view.WealthFooter) {
    //     scope.view.WealthFooter.changeTheme = function() {
    //       self.setProfilePic(scope);
    //       self.setLastLoginTime(scope);
    //       self.setUserName(scope);
    //       self.setEntityName(scope);
    //       self.setMenuData(scope, selectedForm);
    //       self.showOrHideHamburgerUI(false, scope);
    //       scope.setFooterContext();
    //     }
    //   }
    //   else {
    //   scope.view.customFooter.flxMore.onClick = function() {
    //     self.setProfilePic(scope);
    //     self.setLastLoginTime(scope);
    //     self.setUserName(scope);
    //     self.setEntityName(scope);
    //     self.setMenuData(scope, selectedForm);
    //     self.showOrHideHamburgerUI(false, scope);
    //     scope.view.customFooter.flxMoreSelect.setVisibility(true);
    //     scope.view.customFooter.flxAccSelect.setVisibility(false);
    //     scope.view.customFooter.flxTransferSel.setVisibility(false);
    //     scope.view.customFooter.flxBillSelected.setVisibility(false);
    //     scope.view.customFooter.lblAccounts.skin = "sknLbl004B95SSPRegular20px";
    //     scope.view.customFooter.lblTransfer.skin = "sknLbl004B95SSPRegular20px";
    //     scope.view.customFooter.lblBillPay.skin = "sknLbl004B95SSPRegular20px";
    //     scope.view.customFooter.lblMore.skin = "sknLbl424242SSP20px";
    //     scope.view.customFooter.imgMore.src = "moreactive.png";
    //   };
    // }
    // }
    // if(applicationManager.getPresentationFormUtility().getDeviceName() == "android" && scope.view.WealthFooter) {
    //   scope.view.WealthFooter.changeTheme = function() {
    //     self.setProfilePic(scope);
    //     self.setLastLoginTime(scope);
    //     self.setUserName(scope);
    //     self.setEntityName(scope);
    //     self.setMenuData(scope, selectedForm);
    //     self.showOrHideHamburgerUI(false, scope);
    //     scope.setFooterContext();
    //   }}
    scope.view.flxLogout.onTouchEnd = function(){
      var authMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "AuthenticationMA", "moduleName" : "AuthUIModule"});
      self.showOrHideHamburgerUI(false, scope);
      authMod.presentationController.onLogout();
    };
    scope.view.flxUserProfile.onClick = function ()
    {
      var scope = applicationManager.getPresentationUtility().getController('frmUnifiedDashboard', true);
      scope.view.flxHamburger.isVisible = false;
	  var configManager = applicationManager.getConfigurationManager();
	  let isManageProfileMAPresent = configManager.isMicroAppPresent(configManager.microappConstants.MANAGEPROFILE);
      if(isManageProfileMAPresent){
      var settingsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsUIModule", "appName" : "ManageProfileMA"});
      settingsModule.presentationController.showSettings();
	  }
    };
    
    // scope.view.Hamburger.flxEntitySelectionContainer.onTouchEnd = function () {
    //   let accountsUIModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({ "moduleName": "AccountsUIModule", "appName": "HomepageMA" });
    //   self.showOrHideHamburgerUI(false, scope);
    //   accountsUIModule.presentationController.showUserLegalEntities();
    // };
  }
   /**
   * Function to to Show/Hide the Hamburger Menu
   * @param {boolean} hide , whether need to hide or Show
   */
    MenuHandler.prototype.showOrHideHamburgerUI = function(hide, scope) {
      var devManager = applicationManager.getDeviceUtilManager();
      var scope = applicationManager.getPresentationUtility().getController('frmUnifiedDashboard', true);
      if(scope.view.flxHamburger){
        if(hide){ 
            scope.view.flxHamburgerWrapper.left="-100%";
            scope.view.flxHamburger.isVisible = false;
        }
        else{
          var leftVal = "";
          if (scope.view.flxHamburger.isVisible === true) {
            this.showTitleBar();
            if (devManager.isIpad() || applicationManager.getPresentationFormUtility().getDeviceName() == "iPhone") {
              leftVal = "-100%";
            } else {
              leftVal = "-100%";
            }
            scope.view.flxHamburger.isVisible = false;
          }
          else {
            leftVal = "0%";
            if(devManager.isIpad() || applicationManager.getPresentationFormUtility().getDeviceName() == "iPhone"){
            //   scope.view.flxHamburger.flxHamburgerWrapper.flxHamburgerContainer.flxMenu.setContentOffset({
            //     x: "0dp",
            //     y: "0dp"
            //   });
              scope.view.flxHamburgerWrapper.left = "-100%";
            //   scope.view.flxHamburger.skin = "slFboxmb";
            }else{
              scope.view.flxHamburgerWrapper.left = "-100%";
            //   scope.view.flxHamburger.skin = "sknFlx000000Op50mb";
            }
            scope.view.flxHamburger.isVisible = true;
            // if(devManager.isIpad() && applicationManager.applicationMode==="tablet"){
            //   scope.view.flxHamburger.skin = "sknFlx000000Op50mb";
            // }
            this.hideTitleBar();
          }
          scope.view.flxHamburgerWrapper.animate(
            kony.ui.createAnimation({
              "100": {
                "left": leftVal,
                "stepConfig": {
                  "timingFunction": kony.anim.EASE
                }
              }
            }), {
              "delay": 0,
              "iterationCount": 1,
              "fillMode": kony.anim.FILL_MODE_FORWARDS,
              "duration": 0.5
            }, {
              "animationEnd": function() {
                if (leftVal == "-100%" || leftVal=="100%") {
                  scope.view.flxHamburger.isVisible = false;
                }
              }
            });
        }
      }
    }
    MenuHandler.prototype.setProfilePic=function(scope) {
      // Client property(IS_PROFILE_IMAGE_ENABLED) added to enable or disable the User Profile Image. 
    //   var scope = scope;
      var scope = applicationManager.getPresentationUtility().getController('frmUnifiedDashboard', true);
      let isProfileImageEnabled = CommonUtilities.CLIENT_PROPERTIES.IS_PROFILE_IMAGE_ENABLED;
      if (isProfileImageEnabled == "true") {
        var profilepicture = applicationManager.getUserPreferencesManager().getUserImage();
        var configManager = applicationManager.getConfigurationManager();
        // scope.view.flxUserProfile.setVisibility(true);
        // scope.view.Hamburger.flxUser.left = "65dp";
        if (profilepicture && configManager.getProfileImageAvailabilityFlag()) {
          scope.view.imgAvatar.base64 = profilepicture;
        } else
          scope.view.imgAvatar.src = "apolloavatar.png";
      } else {
        // scope.view.Hamburger.flxUserImg.setVisibility(false);
        // scope.view.Hamburger.flxUser.left = "20dp";
        scope.view.imgAvatar.src = "apolloavatar.png";
      }
    };
    /**
   * Function to set last login time
   */
    MenuHandler.prototype.setLastLoginTime=function(scope){
    var scope = applicationManager.getPresentationUtility().getController('frmUnifiedDashboard', true);
      var userPreferencesManager = applicationManager.getUserPreferencesManager();
      var lastlogin = kony.i18n.getLocalizedString("cs.apollo.LastSignIn");
      var isiPhone = applicationManager.getPresentationFormUtility().getDeviceName() === "iPhone";
      if(isiPhone)
        scope.view.lblLastLogin.text = lastlogin+" "+userPreferencesManager.getLastLoginTimeForiPhone();
      else
        scope.view.lblLastLogin.text = lastlogin+" "+userPreferencesManager.getLastLoginTime();
    };
    /**
   * Function to set username
   */
    MenuHandler.prototype.setUserName=function(scope){
      var scope = applicationManager.getPresentationUtility().getController('frmUnifiedDashboard', true);
      var userPreferencesManager = applicationManager.getUserPreferencesManager();
      var firstname = userPreferencesManager.getUserFirstName();
      var lastname = userPreferencesManager.getUserLastName();
      scope.view.lblUsername.text =  firstname+" "+lastname;
    };
    /**
   * Function to Setting data in the Menu.
   */
    MenuHandler.prototype.setMenuData = function (scope, selectedForm) {
        var scope = applicationManager.getPresentationUtility().getController('frmUnifiedDashboard', true);
      var self = this;
    //   var scope = scope;
      var configManager = applicationManager.getConfigurationManager();
      var devManager = applicationManager.getDeviceUtilManager();
    //   if(devManager.isIpad() && applicationManager.applicationMode==="tablet"){
    //     var menuDataIPad = configManager.getIPadAppMenuItems();
    //     var footerData = this.setHamburgerMenuItemsForMicroApp(menuDataIPad);
    //     var moreMenuDataIPad= configManager.getMoreMenuItemsIpad();
    //     var data = this.setHamburgerMenuItemsForMicroApp(moreMenuDataIPad);
    //     scope.view.customFooter.imgAccounts.src=footerData[0].img;
    //     scope.view.customFooter.lblAccounts.text=footerData[0].text;
    //     scope.view.customFooter.flxAccounts.onClick=function(scope){
    //       this.switchOnClick(footerData[0].text, scope);
    //       this.showOrHideHamburgerUI(true, scope);
    //     }
    //     scope.view.customFooter.imgTransfer.src=footerData[1].img;
    //     scope.view.customFooter.lblTransfer.text=footerData[1].text;
    //     scope.view.customFooter.flxTransfer.onClick=function(scope){
    //       this.showOrHideHamburgerUI(true, scope);
    //       this.switchOnClick(footerData[1].text, scope);
    //     }
    //     scope.view.customFooter.imgBillPay.src=footerData[2].img;
    //     scope.view.customFooter.lblBillPay.text=footerData[2].text;
    //     scope.view.customFooter.flxBillPay.onClick=function(scope){
    //       this.switchOnClick(footerData[2].text, scope);
    //       this.showOrHideHamburgerUI(true, scope);
    //     }
    //     scope.view.customFooter.imgDeposits.src=footerData[3].img;
    //     scope.view.customFooter.lblDeposits.text=footerData[3].text;
    //     scope.view.customFooter.flxDeposits.onClick=function(scope){
    //       this.switchOnClick(footerData[3].text, scope);
    //       this.showOrHideHamburgerUI(true, scope);
    //     }
    //     scope.view.customFooter.imgMessage.src=footerData[4].img;
    //     scope.view.customFooter.lblMessage.text=footerData[4].text;
    //     scope.view.customFooter.flxMessage.onClick=function(scope){
    //       this.switchOnClick(footerData[4].text, scope);
    //       this.showOrHideHamburgerUI(true, scope);
    //     }
    //     //highlightWhichMenu
    //     scope.view.customFooter.flxAccSelect.setVisibility(false);
    //     scope.view.customFooter.flxTransferSelect.setVisibility(false);
    //     scope.view.customFooter.flxBillPaySelect.setVisibility(false);
    //     scope.view.customFooter.flxDepositsSelect.setVisibility(false);
    //     scope.view.customFooter.flxMessageSelect.setVisibility(false);
    //     scope.view.customFooter.flxMenuSelect.setVisibility(false);
    //     if(selectedForm==footerData[0].text){
    //       scope.view.customFooter.flxAccSelect.setVisibility(true);
    //       scope.view.customFooter.lblAccounts.skin = "sknLbl424242SSP20px";
    //       scope.view.customFooter.lblTransfer.skin = "sknLblA0A0A0SSP20px";
    //       scope.view.customFooter.lblBillPay.skin = "sknLblA0A0A0SSP20px";
    //       scope.view.customFooter.lblDeposits.skin = "sknLblA0A0A0SSP20px";
    //       scope.view.customFooter.lblMessage.skin = "sknLblA0A0A0SSP20px";
    //       scope.view.customFooter.lblMenu.skin = "sknLblA0A0A0SSP20px";
    //     }
    //     else if(selectedForm==footerData[1].text){
    //       scope.view.customFooter.flxTransferSelect.setVisibility(true);
    //       scope.view.customFooter.lblAccounts.skin = "sknLblA0A0A0SSP20px";
    //       scope.view.customFooter.lblTransfer.skin = "sknLbl424242SSP20px";
    //       scope.view.customFooter.lblBillPay.skin = "sknLblA0A0A0SSP20px";
    //       scope.view.customFooter.lblDeposits.skin = "sknLblA0A0A0SSP20px";
    //       scope.view.customFooter.lblMessage.skin = "sknLblA0A0A0SSP20px";
    //       scope.view.customFooter.lblMenu.skin = "sknLblA0A0A0SSP20px";
    //     }
    //     else if(selectedForm==footerData[2].text){
    //       scope.view.customFooter.flxBillPaySelect.setVisibility(true);
    //       scope.view.customFooter.lblAccounts.skin = "sknLblA0A0A0SSP20px";
    //       scope.view.customFooter.lblTransfer.skin = "sknLblA0A0A0SSP20px";
    //       scope.view.customFooter.lblBillPay.skin = "sknLbl424242SSP20px";
    //       scope.view.customFooter.lblDeposits.skin = "sknLblA0A0A0SSP20px";
    //       scope.view.customFooter.lblMessage.skin = "sknLblA0A0A0SSP20px";
    //       scope.view.customFooter.lblMenu.skin = "sknLblA0A0A0SSP20px";
    //     }
    //     else if(selectedForm==footerData[3].text){
    //       scope.view.customFooter.flxDepositsSelect.setVisibility(true);
    //       scope.view.customFooter.lblAccounts.skin = "sknLblA0A0A0SSP20px";
    //       scope.view.customFooter.lblTransfer.skin = "sknLblA0A0A0SSP20px";
    //       scope.view.customFooter.lblBillPay.skin = "sknLblA0A0A0SSP20px";
    //       scope.view.customFooter.lblDeposits.skin = "sknLbl424242SSP20px";
    //       scope.view.customFooter.lblMessage.skin = "sknLblA0A0A0SSP20px";
    //       scope.view.customFooter.lblMenu.skin = "sknLblA0A0A0SSP20px";
    //     }
    //     else if(selectedForm==footerData[4].text){
    //       scope.view.customFooter.flxMessageSelect.setVisibility(true);
    //       scope.view.customFooter.lblAccounts.skin = "sknLblA0A0A0SSP20px";
    //       scope.view.customFooter.lblTransfer.skin = "sknLblA0A0A0SSP20px";
    //       scope.view.customFooter.lblBillPay.skin = "sknLbl424242SSP20px";
    //       scope.view.customFooter.lblDeposits.skin = "sknLblA0A0A0SSP20px";
    //       scope.view.customFooter.lblMessage.skin = "sknLbl424242SSP20px";
    //       scope.view.customFooter.lblMenu.skin = "sknLblA0A0A0SSP20px";
    //     }
    //     else{
    //       scope.view.customFooter.flxMenuSelect.setVisibility(true);
    //       scope.view.customFooter.lblAccounts.skin = "sknLblA0A0A0SSP20px";
    //       scope.view.customFooter.lblTransfer.skin = "sknLblA0A0A0SSP20px";
    //       scope.view.customFooter.lblBillPay.skin = "sknLblA0A0A0SSP20px";
    //       scope.view.customFooter.lblDeposits.skin = "sknLblA0A0A0SSP20px";
    //       scope.view.customFooter.lblMessage.skin = "sknLblA0A0A0SSP20px";
    //       scope.view.customFooter.lblMenu.skin = "sknLbl424242SSP20px";
    //     }
    //   }
    //   else if(devManager.isIPhone()){
    //     var cm = applicationManager.getConfigurationManager();
    //     var menuDataIOS = configManager.getIOSAppMenuItems();
    //     var footerData = this.setHamburgerMenuItemsForMicroApp(menuDataIOS);
    //     var moreMenuDataIOS= configManager.getIOSAppMoreMenuItems();
    //     var data = this.setHamburgerMenuItemsForMicroApp(moreMenuDataIOS);
    //     if (scope.view.customFooter){
    //       if (footerData.length < 3) {
    //       var count = 3 - footerData.length;
    //       footerData.forEach(function (footerMenuItem) {
    //         let index = data.findIndex(moreMenuItem => moreMenuItem.text === footerMenuItem.text);
    //         if (index !== -1) {
    //           data.splice(index, 1);
    //         }
    //       });
    //       for(let index = 0; index < count; index++) {
    //         footerData[footerData.length] = data[0];
    //         data.splice(0,1);
    //       }
    //     }
    //   }
    //     const isRegionalTransferMAPresent = configManager.isMicroAppPresent(configManager.microappConstants.REGIONALTRANSFER);
    //     const isTradeFinanceMAPresent = configManager.isMicroAppPresent(configManager.microappConstants.TRADEFINANCE);
    //     var tradeFinanceEntitilement = applicationManager.getConfigurationManager().checkUserPermission("IMPORT_LC_VIEW");
    //     var QRPaymentsEntitilement =applicationManager.getConfigurationManager().checkUserPermission("QR_PAYMENTS_CREATE");
    // var exportTradeFinanceEntitilement = applicationManager.getConfigurationManager().checkUserPermission("EXPORT_LC_VIEW");
    //     const isAccountSweepsMAPresent = configManager.isMicroAppPresent(configManager.microappConstants.ACCOUNTSWEEP);
    //     var acountSweepsEntitilement = applicationManager.getConfigurationManager().checkUserPermission("ACCOUNT_SWEEP_VIEW");
	// 	const isBillPayMAPresent = configManager.isMicroAppPresent(configManager.microappConstants.BILLPAY);
	// 	var billPayEntitilement = (applicationManager.getConfigurationManager().checkUserFeature("BILL_PAY") && (applicationManager.getConfigurationManager().checkUserPermission("BILL_PAY_CREATE") || applicationManager.getConfigurationManager().checkUserPermission("BILL_PAY_VIEW_PAYMENTS") || applicationManager.getConfigurationManager().checkUserPermission("BILL_PAY_CREATE_PAYEES") || applicationManager.getConfigurationManager().checkUserPermission("BILL_PAY_VIEW_PAYEES") || applicationManager.getConfigurationManager().checkUserPermission("BILL_PAY_BULK")));
    //     var openNewAccountEntitled = applicationManager.getConfigurationManager().checkUserPermission("OPEN_NEW_ACCOUNT");
    //     if(isTradeFinanceMAPresent){
    //       if(!((tradeFinanceEntitilement === true) || (exportTradeFinanceEntitilement === true))){
    //         for(i=0;i<data.length;i++)
    //           if(data[i].text === cm.constants.MENUTRADEFINANCE)
    //             break;
    //         data.splice(i,1);
    //       }
    //     }
    //       if (!(QRPaymentsEntitilement === true)) {
    //         for (i = 0; i < footerData.length; i++)
    //           if (footerData[i].text === cm.constants.MENUQRPAYMENT)
    //             break;
    //           footerData.splice(i, 1);
    //       }
    //     if(isRegionalTransferMAPresent) {
    //     var moneyMovementModule = applicationManager.getModulesPresentationController({
    //         'appName': "TransfersMA",
    //         'moduleName': "MoneyMovementUIModule"
    // });
    //     var entitlements=moneyMovementModule.checkForTransfersModuleEntitlements();
          
    //     if(!(entitlements.isTransfersAvailable==1 || moneyMovementModule.getEntitlementValue("ispayAPersonEnabled")=="true" )){
    //       for(i=0;i<footerData.length;i++)
    //         if(footerData[i].text==cm.constants.MENUMONEYMOVEMENTTRANSFERS)
    //           break;
    //       footerData.splice(i,1);
    //     } 
    //     if(!(entitlements.isTransfersAvailable==1 ||  moneyMovementModule.getEntitlementValue("ispayAPersonEnabled")=="true" )){
    //       for(i=0;i<footerData.length;i++)
    //         if(footerData[i].text==cm.constants.MENUTRANSFERSACTIVITY || footerData[i].text==cm.constants.MENUMANAGETRANSACTIONS)
    //           break;
    //       footerData.splice(i,1);
    //       for(i=0;i<footerData.length;i++)
    //         if(footerData[i].text==cm.constants.MENUMANAGERECIPIENTS || footerData[i].text==cm.constants.MENUMANAGEBENEFICIARIES)
    //           break;
    //       footerData.splice(i,1);
    //     } 
    //     }
    //     if(isAccountSweepsMAPresent){
    //       if(!(acountSweepsEntitilement === true)){
    //         for(i=0;i<data.length;i++)
    //           if(data[i].text === cm.constants.MENUACCOUNTSWEEP)
    //             break;
    //         data.splice(i,1);
    //       }
    //     }
    //     if(openNewAccountEntitled == false){
    //         for (i = 0; i < data.length; i++) if (data[i].text === cm.constants.MENUEXPLOREPRODUCTSORRESUME) break;
	// 			data.splice(i, 1);
    //     }
	// 	if (isBillPayMAPresent) {
	// 		if (billPayEntitilement === false) {
	// 			for (i = 0; i < data.length; i++) if (data[i].text === cm.constants.MENUBILLPAY) break;
	// 			data.splice(i, 1);
	// 		}
	// 	}
    //     if (scope.view.customFooter) {
    //       if (!kony.sdk.isNullOrUndefined(footerData[0].text)) {
    //         scope.view.customFooter.imgAccounts.src = footerData[0].img;
    //         scope.view.customFooter.lblAccounts.text = footerData[0].text;
    //         scope.view.customFooter.flxAccounts.onClick = function () {
    //           self.switchOnClick(footerData[0].text, scope);
    //           self.showOrHideHamburgerUI(true, scope);
    //         }
    //       }
    //       if (!kony.sdk.isNullOrUndefined(footerData[1].text)) {
    //         scope.view.customFooter.imgTransfer.src = footerData[1].img;
    //         scope.view.customFooter.lblTransfer.text = footerData[1].text;
    //         scope.view.customFooter.flxTransfer.onClick = function () {
    //           self.showOrHideHamburgerUI(true, scope);
    //           self.switchOnClick(footerData[1].text, scope);
    //         }
    //       }
    //       if (!kony.sdk.isNullOrUndefined(footerData[2].text)) {
    //         scope.view.customFooter.imgBillPay.src = footerData[2].img;
    //         scope.view.customFooter.lblBillPay.text = footerData[2].text;
    //         scope.view.customFooter.flxBillPay.onClick = function () {
    //           self.switchOnClick(footerData[2].text, scope);
    //           self.showOrHideHamburgerUI(true, scope);
    //         }
    //       }
    //       //highlightWhichMenu
    //       scope.view.customFooter.flxAccSelect.setVisibility(false);
    //       scope.view.customFooter.flxTransferSel.setVisibility(false);
    //       scope.view.customFooter.flxBillSelected.setVisibility(false);
    //       scope.view.customFooter.flxMoreSelect.setVisibility(false);

    //       for (let i = 0; i < footerData.length; i++) {
    //         if (selectedForm == footerData[0].text) {
    //           scope.view.customFooter.flxAccSelect.setVisibility(true);
    //           scope.view.customFooter.lblAccounts.skin = "sknLbl424242SSP20px";
    //           scope.view.customFooter.lblTransfer.skin = "sknLbl004B95SSPRegular20px";
    //           scope.view.customFooter.lblBillPay.skin = "sknLbl004B95SSPRegular20px";
    //           scope.view.customFooter.lblMore.skin = "sknLbl004B95SSPRegular20px";
    //           scope.view.customFooter.imgAccounts.src = "accountsactive.png";
    //           // Code to be used in future for assigning active and inactive images
    //           //           scope.view.customFooter.imgTransfer.src = "transfer.png";
    //           //           scope.view.customFooter.imgBillPay.src = "billpay.png";
    //           scope.view.customFooter.imgMore.src = "more.png";
    //         }
    //         else if (selectedForm == footerData[1].text) {
    //           scope.view.customFooter.flxTransferSel.setVisibility(true);
    //           scope.view.customFooter.lblAccounts.skin = "sknLbl004B95SSPRegular20px";
    //           scope.view.customFooter.lblTransfer.skin = "sknLbl424242SSP20px";
    //           scope.view.customFooter.lblBillPay.skin = "sknLbl004B95SSPRegular20px";
    //           scope.view.customFooter.lblMore.skin = "sknLbl004B95SSPRegular20px";
    //           if (footerData[0].text == configManager.constants.MENUWEALTHWATCHLIST) {
    //             scope.view.customFooter.imgAccounts.src = footerData[0].img;
    //           } else {
    //             scope.view.customFooter.imgAccounts.src = "accounts.png";
    //           }
    //           // Code to be used in future for assigning active and inactive images
    //           //           scope.view.customFooter.imgTransfer.src = "transferactive.png";
    //           //           scope.view.customFooter.imgBillPay.src = "billpay.png";
    //           scope.view.customFooter.imgMore.src = "more.png";
    //         }
    //         else if (selectedForm == footerData[2].text) {
    //           scope.view.customFooter.flxBillSelected.setVisibility(true);
    //           scope.view.customFooter.lblAccounts.skin = "sknLbl004B95SSPRegular20px";
    //           scope.view.customFooter.lblTransfer.skin = "sknLbl004B95SSPRegular20px";
    //           scope.view.customFooter.lblBillPay.skin = "sknLbl424242SSP20px";
    //           scope.view.customFooter.lblMore.skin = "sknLbl004B95SSPRegular20px";
    //           scope.view.customFooter.imgAccounts.src = "accounts.png";
    //           // Code to be used in future for assigning active and inactive images
    //           //           scope.view.customFooter.imgTransfer.src = "transfer.png";
    //           if (QRPaymentsEntitilement === true) {
    //             scope.view.customFooter.imgBillPay.src = "qr_active.png";
    //           }
    //           scope.view.customFooter.imgMore.src = "more.png";
    //         }
    //         else {

    //           let custominfoCD = applicationManager.getNavigationManager().getCustomInfo("frmCustomerDashboard");
    //           if (!kony.sdk.isNullOrUndefined(custominfoCD) && custominfoCD.isWealthUser === "true") {
    //             if (!kony.sdk.isNullOrUndefined(custominfoCD.isMultiCustomer) && custominfoCD.isMultiCustomer === "true") {
    //               scope.view.customFooter.flxMoreSelect.setVisibility(false);
    //               scope.view.customFooter.flxAccSelect.setVisibility(false);
    //               scope.view.customFooter.flxTransferSel.setVisibility(false);
    //               scope.view.customFooter.flxBillSelected.setVisibility(false);
    //               scope.view.customFooter.lblAccounts.skin = "sknLbl004B95SSPRegular20px";
    //               scope.view.customFooter.lblTransfer.skin = "sknLbl004B95SSPRegular20px";
    //               scope.view.customFooter.lblBillPay.skin = "sknLbl004B95SSPRegular20px";
    //               scope.view.customFooter.lblMore.skin = "sknLbl004B95SSPRegular20px";
    //             } else {
    //               scope.view.customFooter.flxMoreSelect.setVisibility(false);
    //               scope.view.customFooter.flxAccSelect.setVisibility(true);
    //               scope.view.customFooter.flxTransferSel.setVisibility(false);
    //               scope.view.customFooter.flxBillSelected.setVisibility(false);
    //               scope.view.customFooter.lblAccounts.skin = "sknLbl424242SSP20px";
    //               scope.view.customFooter.lblTransfer.skin = "sknLbl004B95SSPRegular20px";
    //               scope.view.customFooter.lblBillPay.skin = "sknLbl004B95SSPRegular20px";
    //               scope.view.customFooter.lblMore.skin = "sknLbl004B95SSPRegular20px";
    //             }

    //           } else {
    //             scope.view.customFooter.flxMoreSelect.setVisibility(true);
    //             scope.view.customFooter.lblAccounts.skin = "sknLbl004B95SSPRegular20px";
    //             scope.view.customFooter.lblTransfer.skin = "sknLbl004B95SSPRegular20px";
    //             scope.view.customFooter.lblBillPay.skin = "sknLbl004B95SSPRegular20px";
    //             scope.view.customFooter.lblMore.skin = "sknLbl424242SSP20px";
    //           }
    //           scope.view.customFooter.imgAccounts.src = "accounts.png";
    //           // Code to be used in future for assigning active and inactive images
    //           //           scope.view.customFooter.imgTransfer.src = "transfer.png";
    //           //           scope.view.customFooter.imgBillPay.src = "billpay.png";
    //           scope.view.customFooter.imgMore.src = "moreactive.png";
    //         }
    //       }
    //     }
    //     //tapimages
    //     // Code to be used in future for assigning active and inactive images
    //     /* scope.view.customFooter.flxAccounts.onTouchStart = function(){
    //       if(scope.view.customFooter.imgAccounts.src === "accountsactive.png"){}
    //       else{
    //         scope.view.customFooter.imgAccounts.src = "accountsontap.png";
    //       }
    //     };
    //     scope.view.customFooter.flxAccounts.onTouchEnd = function(){
    //       if(scope.view.customFooter.imgAccounts.src === "accountsactive.png"){}
    //       else{
    //         scope.view.customFooter.imgAccounts.src = "accounts.png";
    //       }
    //     };
    //     scope.view.customFooter.flxTransfer.onTouchStart = function(){
    //       if(scope.view.customFooter.imgTransfer.src === "transferactive.png"){}
    //       else{
    //         scope.view.customFooter.imgTransfer.src = "transferontap.png";
    //       }
    //     };
    //     scope.view.customFooter.flxTransfer.onTouchEnd = function(){
    //       if(scope.view.customFooter.imgTransfer.src === "transferactive.png"){}
    //       else{
    //         scope.view.customFooter.imgTransfer.src = "transfer.png";
    //       }
    //     };
    //     scope.view.customFooter.flxBillPay.onTouchStart = function(){
    //       if(scope.view.customFooter.imgBillPay.src === "billpayactive.png"){}
    //       else{
    //         scope.view.customFooter.imgBillPay.src = "billpayontap.png";
    //       }
    //     };
    //     scope.view.customFooter.flxBillPay.onTouchEnd = function(){
    //       if(scope.view.customFooter.imgBillPay.src === "billpayactive.png"){}
    //       else{
    //         scope.view.customFooter.imgBillPay.src = "billpay.png";
    //       }
    //     };
    //     scope.view.customFooter.imgMore.onTouchStart = function(){
    //       if(scope.view.customFooter.imgMore.src === "moreactive.png"){}
    //       else{
    //         scope.view.customFooter.imgMore.src = "moreontap.png";
    //       }
    //     };
    //     scope.view.customFooter.imgMore.onTouchEnd = function(){
    //       if(scope.view.customFooter.imgMore.src === "moreactive.png"){}
    //       else{
    //         scope.view.customFooter.imgMore.src = "more.png";
    //       }
    //     }; */
    //   }
    //   else{
        var menuDataHamburger = configManager.getHamburgerMenuItems();
        var data = this.setHamburgerMenuItemsForMicroApp(menuDataHamburger);
        var cm = applicationManager.getConfigurationManager();
        const isRegionalTransferMAPresent = configManager.isMicroAppPresent(configManager.microappConstants.REGIONALTRANSFER);
        const isTradeFinanceMAPresent = configManager.isMicroAppPresent(configManager.microappConstants.TRADEFINANCE);
        var tradeFinanceEntitilement = applicationManager.getConfigurationManager().checkUserPermission("IMPORT_LC_VIEW");
    var exportTradeFinanceEntitilement = applicationManager.getConfigurationManager().checkUserPermission("EXPORT_LC_VIEW");
        const isAccountSweepsMAPresent = configManager.isMicroAppPresent(configManager.microappConstants.ACCOUNTSWEEP);
        var openNewAccountEntitled = applicationManager.getConfigurationManager().checkUserPermission("OPEN_NEW_ACCOUNT");
        var acountSweepsEntitilement = applicationManager.getConfigurationManager().checkUserPermission("ACCOUNT_SWEEP_VIEW");
        if(isTradeFinanceMAPresent){
          if(!((tradeFinanceEntitilement === true) || (exportTradeFinanceEntitilement === true))){
            for(i=0;i<data.length;i++)
              if(data[i].text === cm.constants.MENUTRADEFINANCE)
                break;
            data.splice(i,1);
          }
        }
        if(isRegionalTransferMAPresent) {
          var moneyMovementModule = applicationManager.getModulesPresentationController({
            "appName": "TransfersMA",
            "moduleName": "MoneyMovementUIModule"
    });
        var entitlements=moneyMovementModule.checkForTransfersModuleEntitlements();
        if(!(entitlements.isTransfersAvailable==1 || moneyMovementModule.getEntitlementValue("ispayAPersonEnabled")=="true" )){
          for(i=0;i<data.length;i++)
            if(data[i].text==cm.constants.MENUMONEYMOVEMENTTRANSFERS)
              break;
          data.splice(i,1);
          for(i=0;i<data.length;i++)
            if(data[i].text==cm.constants.MENUTRANSFERSACTIVITY || data[i].text==cm.constants.MENUMANAGETRANSACTIONS)
              break;
          data.splice(i,1);
          for(i=0;i<data.length;i++)
            if(data[i].text==cm.constants.MENUMANAGERECIPIENTS || data[i].text==cm.constants.MENUMANAGEBENEFICIARIES)
              break;
          data.splice(i,1);
        } 
        }
        if(isAccountSweepsMAPresent){
          if(!(acountSweepsEntitilement === true)){
            for(i=0;i<data.length;i++)
              if(data[i].text === cm.constants.MENUACCOUNTSWEEP)
                break;
            data.splice(i,1);
          }
        }
        if(openNewAccountEntitled == false){
            for (i = 0; i < data.length; i++) if (data[i].text === cm.constants.MENUEXPLOREPRODUCTSORRESUME) break;
				data.splice(i, 1);
        }
    //   }
      // map and present data into hamburger (both hamburger on click or more on click)
      scope.view.segHamburger.widgetDataMap={imgHamburger:"img",lblHamburger:"text",lblMessagesNumber:"info",flxMessagesNumber:"backGround"};
        
      let alertsbadgeShown = false;
      let alertsNotifiModule ;
      let isSecureMessageMAPresent = configManager.isMicroAppPresent(configManager.microappConstants.SECUREMESSAGE);
      if(isSecureMessageMAPresent){
        var msgManager = applicationManager.getMessagesManager();
      var count = msgManager.getTotalNumberOfUnreadMessages();
      var alertManager = applicationManager.getAlertsManager();
      var notificationCount = alertManager.getUnreadNotifications();
      var previousUnreadCount = alertManager.getPreviousUnreadCount();
      let isSecureMessageMAPresent = configManager.isMicroAppPresent(configManager.microappConstants.SECUREMESSAGE);
        alertsNotifiModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName": "SecureMessageMA","moduleName": "AlertsUIModule"});
        alertsbadgeShown = alertsNotifiModule.presentationController.getAlertsBadgeStatus();
      }
      for(var i=0;i<data.length;i++){
        //if(!configManager.AggregatedExternalAccountEnabled)
        //continue;
        
        // show notifications count if secure message app is available 
        if (isSecureMessageMAPresent && data[i].text === configManager.constants.MENUNOTIFICATIONS && !kony.sdk.isNullOrUndefined(notificationCount) && notificationCount !== "0" ) {
          if(!alertsbadgeShown && (!kony.sdk.isNullOrUndefined(previousUnreadCount) && Number(previousUnreadCount) >= Number(notificationCount))){
            // if(!applicationManager.getDeviceUtilManager().isIPhone()){
            //     if(scope.view.customHeader !== undefined && scope.view.customHeader !== null)
            //       scope.view.customHeader.imgBack.src = "hamburger.png";
            // }
            data[i].img = {"src" : "notification.png"};
          }
          else{
            alertsNotifiModule.presentationController.setAlertsBadgeStatus(true);
            // if(applicationManager.getDeviceUtilManager().isIPhone()){
            //   scope.view.customFooter.imgMore.src = "moreunread.png";
            // }         
            data[i].img = {"src" : "notificationunread.png"};
          }
          data[i].info = {"text": notificationCount,"isVisible":true};
          data[i].backGround = {"isVisible":true};
        }
        else if (data[i].text === configManager.constants.MENUMESSAGES && !kony.sdk.isNullOrUndefined(count) && count !== "0" ) {
          data[i].info = {"text": count,"isVisible":true,"skin":"sknLbl424242SSP22px"};
          data[i].backGround = {"isVisible":false}; 
        }else if (data[i].text === configManager.constants.MENUACCOUNTS) {
        	let custominfoCD = applicationManager.getNavigationManager().getCustomInfo("frmCustomerDashboard");
			if(!kony.sdk.isNullOrUndefined(custominfoCD) && (custominfoCD.reDesignFlow === "true" || custominfoCD.reDesignFlowWealth === "true")){
              data[i].text = kony.i18n.getLocalizedString('i18n.common.overview');
            }else{
            
              data[i].text = kony.i18n.getLocalizedString('kony.mb.Hamburger.Accounts');
                
            }
        }else{
          data[i].info = {"isVisible":false};
          data[i].backGround = {"isVisible":false}; 
        }
      }
      if (configManager.isEngageEnabled()) {
        var engageModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("EngageModule");
        engageModule.presentationController.menuSetup(scope.view, data);
      }
      scope.view.segHamburger.setData(data);
      scope.view.segHamburger.onRowClick= function(){
       this.hamburgerOnRowClick(scope)}.bind(this);
    }
    //For Gettting the Selected Value from Menu
    MenuHandler.prototype.hamburgerOnRowClick = function (scope) {
        var scope = applicationManager.getPresentationUtility().getController('frmUnifiedDashboard', true);
      this.showOrHideHamburgerUI(false, scope);
      var selectedvalue = scope.view.segHamburger.selectedItems[0].text;
      this.switchOnClick(selectedvalue, scope);
    }
    MenuHandler.prototype.switchOnClick=function(selValue, scope){
      var scope = applicationManager.getPresentationUtility().getController('frmUnifiedDashboard', true);
      var configManager = applicationManager.getConfigurationManager();
      var navManager = applicationManager.getNavigationManager();
      var custominfoCD = applicationManager.getNavigationManager().getCustomInfo("frmCustomerDashboard");
      navManager.setCustomInfo("frmCardManageHome",{"isMainScreen": false});
      const isSecureMessageMAPresent = configManager.isMicroAppPresent(configManager.microappConstants.SECUREMESSAGE);
      var alertsbadgeShown = false;
      if(isSecureMessageMAPresent){
        var alertsUIModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName":"SecureMessageMA", "moduleName":"AlertsUIModule"});
        
        alertsbadgeShown = alertsUIModule.presentationController.getAlertsBadgeStatus();
        if(!alertsbadgeShown)
          alertsUIModule.presentationController.getUnreadNotificationsCount();
      }
      const isCardsMAPresent = configManager.isMicroAppPresent(configManager.microappConstants.CARDS);
        if(isCardsMAPresent) {
          var cardManageModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName":"CardsMA","moduleName":"ManageCardsUIModule"});
        cardManageModule.presentationController.setCardIndexStatus(true);
        }
      switch(selValue){

        // [Trixon] Configured menuOnClick event of Sidemenu items and commented out existing unused items configuration
        case configManager.constants.MENUACCOUNT:
          // [Zypher] alter the exiting form navigation and make api call to fetch account recent transaction for apollo
          scope.view.flxHamburger.isVisible = false;
          applicationManager.getPresentationUtility().showLoadingScreen();
          //   var accountMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName":"ArrangementsMA","moduleName":"AccountUIModule"});
          //   accountMod.presentationController.getTransactionList();
          try{
            var navManager = applicationManager.getNavigationManager();
            var account = navManager.getCustomInfo("frmDashboard");
            navManager.setCustomInfo("fromHamburgerMenu",true);
            var accountID = {
                "accountID": account.accountData[0].accountID
            };
            
            var accountMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName":"ArrangementsMA","moduleName":"AccountUIModule"});
            accountMod.presentationController.fetchTransactionsByAccountId(accountID);
          }catch{
            try{
                var navManager = applicationManager.getNavigationManager();
                var account = navManager.getCustomInfo("frmDashboard");
                navManager.setCustomInfo("fromHamburgerMenu",true);
                var accountID = {
                    "accountID": account.accountData[0].accountID
                };
                var accountMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName":"ArrangementsMA","moduleName":"AccountUIModule"});
                accountMod.presentationController.fetchTransactionsByAccountId(accountID);
            }catch{
                scope.bindGenericError("Unable to fetch account, Please try again!");
            }
          }
          //navManager.navigateTo({"appName" : "ArrangementsMA", "friendlyName" :"AccountUIModule/frmAccountDashboard"});
          // [Zypher end]
          break;
        case configManager.constants.MENUSCHEDULEPAYMENTS:
            scope.view.flxHamburger.isVisible = false;
            applicationManager.getPresentationUtility().showLoadingScreen();
            var billPayMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "BillPaymentUIModule", "appName" : "BillPayMA"});
            billPayMod.presentationController.fetchScheduledPayments();
            break;
        case configManager.constants.MENURECEIVEPAYMENTS :
            scope.view.flxHamburger.isVisible = false;
            navManager.navigateTo({"appName" : "HomepageMA", "friendlyName" :"ManageCustomgroupUIModule/frmReceivePayment"});
            break;
        case configManager.constants.MENUCARDS :
            scope.view.flxHamburger.isVisible = false;
            applicationManager.getPresentationUtility().showLoadingScreen();
            var NfcAdapter = navManager.getCustomInfo("DeviceAdapter");
            var manageCardsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName": "ManageCardsUIModule", "appName": "CardsMA"});
            manageCardsModule.presentationController.isFirstTime = true;
            if(NfcAdapter && (applicationManager.getPresentationFormUtility().getDeviceName() !== "iPhone")){
                manageCardsModule.presentationController.loadCard();
            }else{
                manageCardsModule.presentationController.showCardsHome();
            }
            break;
        case configManager.constants.MENUDEALSANDDISCOUNTS:
            scope.view.flxHamburger.isVisible = false;
            navManager.navigateTo({"appName" : "HomepageMA", "friendlyName" :"ManageCustomgroupUIModule/frmDealsAndDiscount"});
            break;
        case configManager.constants.MENUUSSD:
          // [Zypher] start implement USSD menu 
          // var customMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "ManageCustomgroupUIModule", "appName" : "HomepageMA"});
          // navManager.navigateTo({"appName" : "HomepageMA", "friendlyName" :"ManageCustomgroupUIModule/frmUSSDSubscription"});
          // scope.view.flxHamburger.isVisible = false;
          var enrollMod = accountMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName":"SelfServiceEnrolmentMA","moduleName":"EnrollUIModule"});
          enrollMod.presentationController.checkUSSDSubscriptionStatus();
          // [Zypher] end
          break;
        case configManager.constants.MENUREFERANDEARN :
            scope.view.flxHamburger.isVisible = false;
            navManager.navigateTo({"appName" : "HomepageMA", "friendlyName" :"ManageCustomgroupUIModule/frmReferAndEarn"});
            break;
        case configManager.constants.MENUMESSAGES:
            //[Zypher] start for menu message 
            scope.view.flxHamburger.isVisible = false;
            var messagesModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "MessagesUIModule", "appName" : "SecureMessageMA"});
            messagesModule.presentationController.getInboxRequests();
        //   scope.view.flxHamburger.isVisible = false;
            // [Zypher] end
          break;
        case configManager.constants.MENUNOTIFICATIONS:
          var alertsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "AlertsUIModule", "appName" : "SecureMessageMA"});
          alertsModule.presentationController.setAlertsBadgeStatus(false);
          if(alertsbadgeShown)
           alertsModule.presentationController.getUnreadNotificationsCount();
          alertsModule.presentationController.getNotifications();
          break;
        case configManager.constants.MENULOCATE :
          scope.view.flxHamburger.isVisible = false;
          var locateMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName":"AboutUsMA","moduleName":"LocateUsUIModule"});
          locateMod.presentationController.presentLocateUsView(true,scope);
          break;
        case configManager.constants.MENUSETTINGS:
            scope.view.flxHamburger.isVisible = false;
            var settingsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsUIModule", "appName" : "ManageProfileMA"} );
            settingsModule.presentationController.showSettings();
            break;
        case configManager.constants.MENUTERMSANDCONDITIONS:
            scope.view.flxHamburger.isVisible = false;
            applicationManager.getPresentationUtility().showLoadingScreen();
            var infModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName":"AboutUsMA","moduleName": "InformationUIModule"});
            infModule.presentationController.onClickTermsAndConditions(configManager.constants.TERMS);
            break;
        // [Trixon] Ended

        // case configManager.constants.MENUTRADEFINANCE:
        //   scope.view.flxHamburger.isVisible = false;
        //   navManager.navigateTo({"appName" : "TradeFinanceMA", "friendlyName" :"ImportLCUIModule/frmImportLC"});
        //   break; 
        // case configManager.constants.MENUCONVERSATIONALBANKING:
        //   scope.view.flxHamburger.isVisible = false;
        //   var cbpMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName":"CBPMA","moduleName":"KonyDXChatbotModule"});
        //   cbpMod.presentationController.clearFlowValues();
        //   cbpMod.presentationController.navigateToChatbotLandingScreen();
        //   break;
        // case configManager.constants.MENUCHEQUEMANAGEMENT:
        //   scope.view.flxHamburger.isVisible = false;
        //   var chequeMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName":"ArrangementsMA","moduleName":"ChequeManagementUIModule"});
        //   chequeMod.presentationController.clearFlowValues();
        //   chequeMod.presentationController.navigateToChequeLandingScreen();
        //   break;
        // case configManager.constants.MENUACCOUNTS:
        //   scope.view.flxHamburger.isVisible = false;
        //   var accountsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "AccountsUIModule", "appName" : "HomepageMA"});
        //   accountsModule.presentationController.showDashboard();
        //   break;
        // case configManager.constants.MENUDASHBOARDOVERVIEW:
        //   scope.view.flxHamburger.isVisible = false;
        // //  let custominfoCD = applicationManager.getNavigationManager().getCustomInfo("frmCustomerDashboard");
        //   if(!kony.sdk.isNullOrUndefined(custominfoCD)  && custominfoCD.isWealthUser === "true"){
        //     custominfoCD.reDesignFlowWealth = "false";
        //     custominfoCD.isBackClicked = "false";
        //     applicationManager.getNavigationManager().setCustomInfo("frmCustomerDashboard", custominfoCD);
        //   }
        //   var authMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "AuthenticationMA", "moduleName" : "AuthUIModule"});
        //   authMod.presentationController.navigationAfterLogin();
        //   break;
        // case configManager.constants.MENUACCOUNTSWEEP:
        //   scope.view.flxHamburger.isVisible = false;
        //   navManager.setEntryPoint("AccountSweepsFlow", "Create");
        //   let sweepsModule = applicationManager.getModulesPresentationController({
        //     "moduleName": "AccountSweepsUIModule",
        //     "appName": "AccountSweepsMA"
        //   });
        //   sweepsModule.getBankDate();
        //   sweepsModule.getSweeps();
		//   break;
        // case configManager.constants.MENUQRPAYMENT:
        //   var userContext = applicationManager.getUserPreferencesManager().getUserObj();
        //   this.userContext = userContext;
        //   if (this.userContext.hasOwnProperty("isQRPaymentActivated") && this.userContext.isQRPaymentActivated === "true") {
        //   navManager.navigateTo({ "appName": "TransfersMA", "friendlyName": "frmQRPaymentsLanding" });
        //   } else {
        //   navManager.navigateTo({ "appName": "TransfersMA", "friendlyName": "frmQRActivation" });
        //   }
        //   break;
		// case configManager.constants.MENUWEALTHWATCHLIST :
		//   scope.view.flxHamburger.isVisible = false;
        //   var customerId = applicationManager.getUserPreferencesManager().primaryCustomerId.id;
        //   var params = {"customerId": customerId};
        //   var wealthModule = applicationManager.getModulesPresentationController({"moduleName" : "WealthPortfolioUIModule", "appName" : "PortfolioManagementMA"});
        //  // wealthModule.newAccount = {};
        //  // wealthModule.newAccountsArr = [];
        //  // wealthModule.balanceArr = [];
        //  // wealthModule.amount = "";
        //  // wealthModule.currency = "";
        //   wealthModule.getWatchlist();
        //   break;
        // case configManager.constants.MENUCONTACT :
        //   scope.view.flxHamburger.isVisible = false;
        //   var infModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName":"AboutUsMA","moduleName":"InformationUIModule"});
        //  infModule.presentationController.commonFunctionForNavigation({"appName":"AboutUsMA","friendlyName":"InformationUIModule/frmSupport"});
        //   break;
//         case configManager.constants.MENUUNIFIEDTRANSFERSFLOW:
//           scope.view.flxHamburger.isVisible = false;
//           var navMan = applicationManager.getNavigationManager();
//           var configManager = applicationManager.getConfigurationManager();
//                 navMan.navigateTo({"appName" : "TransfersMA", "friendlyName" :"UnifiedTransferFlowUIModule/frmSelectTransferTypeNew"});
// //             navMan.navigateTo("UnifiedTransferFlow/frmSelectTransferType");
// //           }
// //           else
// //             {
// //               navMan.navigateTo("UnifiedTransferFlow/frmP2PTransferType");
// //             }
//           break;
        // case configManager.constants.MENUTRANSFERS:
        //   //#ifdef tabrcandroid
        //   //#define kony_tablet_transferflow
        //   //#endif
        //   //#ifdef ipad
        //   //#define kony_tablet_transferflow
        //   //#endif
        //   //#ifdef kony_tablet_transferflow
        //   var navMan = applicationManager.getNavigationManager();
		//   navMan.setCustomInfo("removeAttachments",true);
        //   scope.view.flxHamburger.isVisible = false;
        //   //var transMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("TransactionModule");
        //   //transMod.presentationController.getTransactions();
        //   //#else
        //   var configManager = applicationManager.getConfigurationManager();
        //   //var transMod = applicationManager.getModulesPresentationController("TransactionModule");
        //   if (configManager.getDeploymentGeography() === 'EUROPE') {
        //     applicationManager.getPresentationUtility().showLoadingScreen();
        //     var navMan = applicationManager.getNavigationManager();
        //     navMan.setEntryPoint("europeTransferFlow","frmDashboardAggregated");
        //     var transferModPresentationController = applicationManager.getModulesPresentationController({"moduleName" : "TransferEuropeUIModule", "appName" : "TransfersMA"});
        //     transferModPresentationController.setEuropeFlowType("INTERNAL");
        //     transferModPresentationController.getFromAccounts();
        //     transferModPresentationController.clearEuropeFlowAtributes();
        //   }  
        //   //else {  
        //     //transMod.getTransactions();
        //   //}  
        //   //#endif
        //   break;
        // case configManager.constants.MENUSENDMONEY:
        //   applicationManager.getPresentationUtility().showLoadingScreen();
        //   var navMan = applicationManager.getNavigationManager();
		//   navMan.setCustomInfo("removeAttachments",true);
        //   navMan.setEntryPoint("europeTransferFlow","frmDashboardAggregated");
        //   var transferModPresentationController = applicationManager.getModulesPresentationController({"moduleName" : "TransferEuropeUIModule", "appName" : "TransfersMA"});
        //   transferModPresentationController.setEuropeFlowType("EXTERNAL");
        //   transferModPresentationController.getFromAndToAccounts();
        //   transferModPresentationController.clearEuropeFlowAtributes();
        //   break;
        // case configManager.constants.MENUMONEYMOVEMENTTRANSFERS:
        //   applicationManager.getPresentationUtility().showLoadingScreen();
        //   var navMan = applicationManager.getNavigationManager();
        //   navMan.setCustomInfo("removeAttachments",true);
        //   //navMan.setEntryPoint("ManageMMFlow","frmMMTransferFromAccount");
        //   navMan.setEntryPoint("centralmoneymovement","frmDashboardAggregated");
        //   scope.view.flxHamburger.isVisible = false;
        //   var moneyMovementModule = applicationManager.getModulesPresentationController({"moduleName" : "MoneyMovementUIModule", "appName" : "TransfersMA"});
        //   moneyMovementModule.getFromAndToAccounts();
        //   moneyMovementModule.clearMMFlowAtributes();
        //   //moneyMovementModule.clearFromAccountObject();
        //   break;
        // case configManager.constants.MENUTRANSFERSACTIVITY:
        //   scope.view.flxHamburger.isVisible = false;
        //   var navMan = applicationManager.getNavigationManager();
        //   navMan.setCustomInfo("removeAttachments",true);
        //   //var transMod = applicationManager.getModulesPresentationController("TransactionModule");
        //   var moneyMovementModule = applicationManager.getModulesPresentationController({"moduleName" : "MoneyMovementUIModule", "appName" : "TransfersMA"});
        //   moneyMovementModule.clearMMFlowAtributes();
        //   navMan.setEntryPoint("centralmoneymovement", "frmTransferActivitiesTransfers");
        //   navMan.navigateTo({"appName" : "TransfersMA", "friendlyName" : "MoneyMovementUIModule/frmTransferActivitiesTransfers"});
        //   break;
        // case configManager.constants.MENUMANAGETRANSACTIONS:
        //   scope.view.flxHamburger.isVisible = false;
        //   var navMan = applicationManager.getNavigationManager();
        //   navMan.setCustomInfo("removeAttachments",true);
        //   applicationManager.getPresentationUtility().showLoadingScreen();
        //   var transferModPresentationController = applicationManager.getModulesPresentationController({"moduleName" : "ManageActivitiesUIModule", "appName" : "TransfersMA"});
        //   transferModPresentationController.clearEuropeFlowAtributes();
        //   navMan.setEntryPoint("europeTransferFlow", "frmTransferActivitiesTransfersEurope");
        //   navMan.navigateTo({"appName" : "TransfersMA", "friendlyName" : "ManageActivitiesUIModule/frmTransferActivitiesTransfersEurope"});
        //   break;
        // case configManager.constants.MENUMANAGERECIPIENTS:
        //   var navMan = applicationManager.getNavigationManager();
        //   navMan.setCustomInfo("removeAttachments",true);
        //   var moneyMovementModule = applicationManager.getModulesPresentationController({"moduleName" : "MoneyMovementUIModule", "appName" : "TransfersMA"});
        //   navMan.setEntryPoint("centralmoneymovement","frmManageRecipientType");
        //   moneyMovementModule.clearMMFlowAtributes();
        //   moneyMovementModule.enterManageRecipientsFlow();
        //   break;
        // case configManager.constants.MENUMANAGEBENEFICIARIES:
        //   var navMan = applicationManager.getNavigationManager();
        //   navMan.setCustomInfo("removeAttachments",true);
        //   var transferModPresentationController = applicationManager.getModulesPresentationController({"moduleName" : "ManageActivitiesUIModule", "appName" : "TransfersMA"});
        //   navMan.setEntryPoint("europeTransferFlow","frmEuropeManageBeneficiaries");
        //   transferModPresentationController.clearEuropeFlowAtributes();
        //   transferModPresentationController.enterManageRecipientsFlow();
        //   break;
        // case configManager.constants.MENUDISPUTE:
        //   applicationManager.getPresentationUtility().showLoadingScreen();
        //   var navManager =applicationManager.getNavigationManager();
        //   navManager.setEntryPoint("ViewRequest","");
        //   var disputeModule = applicationManager.getModulesPresentationController({"moduleName" : "DisputeTransactionUIModule", "appName" : "ArrangementsMA"});
        //   disputeModule.getDisputeTransactionDetails(); 
        //   break;
        
        // case configManager.constants.MENUACCOUNTSTATEMENTS :
        //   scope.view.flxHamburger.isVisible = false;
        //   var accountModule = applicationManager.getModulesPresentationController({
        //                     "moduleName": "AccountUIModule",
        //                     "appName": "ArrangementsMA"
        //                 });
        //   var custominfoInt = navManager.getCustomInfo("frmDashboard");
        //   var chequeAccounts = [];
        //   if((custominfoCD && custominfoCD.reDesignFlow === "true" && custominfoInt && custominfoInt.isGetListCalled===true && custominfoCD.isAccActionsCalled === true) || 
        //      (custominfoCD && (custominfoCD.reDesignFlow !== "true"))){
        //     var accountManager = applicationManager.getAccountManager();
        //     if(accountManager.internalAccounts.length > 0){
        //       var accountNumber =  accountManager.internalAccounts[0].Account_id;
        //       var accountdata    = accountManager.internalAccounts[0];
        //       accountModule.getAccountStataments(accountNumber, accountdata);
        //     }
        //   }else{
        //     var presenter = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({ "moduleName": "AuthUIModule", "appName": "AuthenticationMA" });
        //     presenter.presentationController.showDataLoaderPopup();
        //     applicationManager.getPresentationUtility().dismissLoadingScreen();
        //     return;
        //   }
        //   break;
        
//         case configManager.constants.MENUBILLPAY:
//           scope.view.flxHamburger.isVisible = false;
//           var BillPayMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "BillPaymentUIModule", "appName" : "BillPayMA"});
//           BillPayMod.presentationController.fetchBills();
//           //BillPayMod.presentationController.getHolidays();
//           break;
//         case configManager.constants.MENUCARDLESS:
//           scope.view.flxHamburger.isVisible = false;
//           var cardLessModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName": "CardLessUIModule",
// "appName": "ArrangementsMA"});        
// 		 var navMan=applicationManager.getNavigationManager();
//           navMan.setEntryPoint("cardlessEntry","frmCardLessHome");
//           //navMan.setEntryPoint("cardlessEntry","frmCardLessHomeQR");
//           cardLessModule.presentationController.getCardlessPendingAndPostedTransactions();
//           //cardLessModule.presentationController.getCardlessPendingAndPostedTransactionsQRScanner();
//           break;
        // case configManager.constants.MENUCHECKDEPOSIT:
        //   scope.view.flxHamburger.isVisible = false;
        //   var checkDepositModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName": "CheckDepositUIModule" , "appName": "ArrangementsMA"});
        //   checkDepositModule.presentationController.fetchDeposits();
        //   break;
        // case configManager.constants.Deposits:
        //   scope.view.flxHamburger.isVisible = false;
        //   var checkDepositModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("CheckDepositModule");
        //   checkDepositModule.presentationController.fetchDeposits();
        //   break;
        // case configManager.constants.MENUSERVICEREQUESTS:
        //   scope.view.flxHamburger.isVisible = false;
        //   new kony.mvc.Navigation({"appName" : "ArrangementsMA", "friendlyName" : "ServiceRequestsUIModule/frmViewRequests"}).navigate();
        //   break;
        
        // case configManager.constants.MENUFEEDBACK:
        //   var currentForm = kony.application.getCurrentForm().id;
        //   scope.view.flxHamburger.isVisible = false;
        //   var navManager = applicationManager.getNavigationManager();
        //   navManager.setEntryPoint("Feedback", currentForm);
        //   var feedbackModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName":"AboutUsMA","moduleName":"FeedbackUIModule"});
        //   feedbackModule.presentationController.showFeedBack();
        //   break;
        // case configManager.constants.MENUCHATBOT:
        //   scope.view.flxHamburger.isVisible = false;
        //   var chatBotMode = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ChatBotModule");
        //   chatBotMode.presentationController.handleFirstTimeOpen();
        //   break;
        // case configManager.constants.MENUMANAGEOTHERBANKACCOUNTS:
        //   scope.view.flxHamburger.isVisible = false;
        //   var navManager = applicationManager.getNavigationManager();
        //   navManager.navigateTo({"appName" : "AccAggregationMA", "friendlyName" : "ExternalAccountsUIModule/frmExternalAccountsList"});
        //   break;
        // case configManager.constants.MENUCARDMANAGEMENT:
        //   scope.view.flxHamburger.isVisible = false;
        //   var manageCardsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
        //                     "moduleName": "ManageCardsUIModule",
        //                     "appName": "CardsMA"
        //                 });
        //   manageCardsModule.presentationController.isFirstTime = true;
        //   manageCardsModule.presentationController.showCardsHome();
        //   break;
        // case configManager.constants.MENUOPENACOUNT:
        //   var NAOModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("NewAccountOpeningModule");
        //   NAOModule.presentationController.fetchAllProductsAndTnc();
        //   break;
        // case configManager.constants.MENUEXPLOREPRODUCTSORRESUME: {
        //   applicationManager.getAccountManager().openNewAccountAudit(function () { }, function () { });
        //   navManager.navigateTo({ "appName": "AuthenticationMA", "friendlyName": "EmbeddedOriginationUIModule/frmOriginationLanding" });
        // }
        // break;
        // case configManager.constants.MENUPFMMYMONEY:
        //     var pfmModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
        //                       "moduleName": "PersonalFinanceManagementUIModule",
        //                       "appName": "FinanceManagementMA"
        //                     });
        //     pfmModule.presentationController.fetchPFMDetails(true);
                        
       
        //   break;
        //   //@TODO create constants
        // case configManager.constants.MENUACH :
        //   //scope.view.flxHamburger.isVisible = false;
        //   var achModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "ACHUIModule", "appName" : "ACHMA"});
        //   achModule.presentationController.commonFunctionForNavigation("ACHUIModule/frmACHList");
        //   break;
        // case configManager.constants.MENUAPPROVALREQUEST :
        //   //scope.view.flxHamburger.isVisible = false;
        //   var approvalRequestModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "ApprovalsReqUIModule", "appName" : "ApprovalRequestMA"});
        //   approvalRequestModule.presentationController.commonFunctionForNavigation("ApprovalsReqUIModule/frmApprovalsAndRequestsTitle");
        //   break;
        // case configManager.constants.MENUUSERMANAGEMENT:
        //   scope.view.flxHamburger.isVisible = false;
        //   var userManagementModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "BusinessBankingUIModule", "appName" : "UserManagementMA"});
        //   userManagementModule.presentationController.navigatetoallusers();

        //   break;
        // case configManager.constants.MENUFOREIGNEXCHANGE:
        //   scope.view.flxHamburger.isVisible = false;
        //   var foreignExhangeModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ForeignExchange");
        //   foreignExhangeModule.presentationController.navigateToforexDashboard();
        //   break;
        // case configManager.constants.MENUSECURITYNOTIFICATIONS:
        //   scope.view.flxHamburger.isVisible = false;
        //   var navManager = applicationManager.getNavigationManager();
        //   let friendlyName;
        //   if(CommonUtilities.getSCAType() === 1) {
        //     friendlyName = "ApprovalsReqUIModule/frmSecurityNotification"
        //   } else if (CommonUtilities.getSCAType() === 2) {
        //     friendlyName = "frmSecurityNotificationUniken"
        //   } else {
        //     friendlyName = ""
        //   }
        //   navManager.navigateTo({"appName" :"ApprovalRequestMA" , "friendlyName" : friendlyName});
        //   break;
        // case configManager.constants.MENUPASSCODE:
        //   scope.view.flxHamburger.isVisible = false;
        //   var navManager = applicationManager.getNavigationManager();
        //   navManager.navigateTo({"appName": "SelfServiceEnrolmentMA","friendlyName": "EnrollUnikenUIModule/frmPasscodeUniken"});
        //   break;
        // case configManager.constants.MENUBIOMETRICAPPROVAL:
        //     scope.view.flxHamburger.isVisible = false;
        //     var navManager = applicationManager.getNavigationManager();
        //     navManager.navigateTo({"appName" :"SelfServiceEnrolmentMA" , "friendlyName" : "EnrollUnikenUIModule/frmBioToggleUniken"});
        //     break;
        default:
          if (configManager.isEngageEnabled()) {
            var engageModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("EngageModule");
            var engageItemSelected = engageModule.presentationController.menuSelection(scope.view, selValue);
            if (engageItemSelected) {
              break;
            }
          }
          scope.view.flxHamburger.isVisible = false;
          var accountMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("AccountModule");
          accountMod.presentationController.showDashboard();
      }
    }
    MenuHandler.prototype.showTitleBar = function() {
      var currForm = kony.application.getCurrentForm();
      if (applicationManager.getPresentationFormUtility().getDeviceName() === "iPhone") {
        var titleBarAttributes = currForm.titleBarAttributes;
		if(titleBarAttributes !== undefined && titleBarAttributes !== null){
			titleBarAttributes["navigationBarHidden"] = false;
			currForm.titleBarAttributes = titleBarAttributes;
		}    
      }
    };
    MenuHandler.prototype.hideTitleBar = function() {
      var currForm = kony.application.getCurrentForm();
      if (applicationManager.getPresentationFormUtility().getDeviceName() === "iPhone") {
        var titleBarAttributes = currForm.titleBarAttributes;
		if(titleBarAttributes !== undefined && titleBarAttributes !== null){
          titleBarAttributes["navigationBarHidden"] = true;
          currForm.titleBarAttributes = titleBarAttributes;
		}
      }
    };
    MenuHandler.prototype.setHamburgerMenuItemsForMicroApp = function(menuData) {
    var data = [];
      var configManager = applicationManager.getConfigurationManager();
    let custominfoCD = applicationManager.getNavigationManager().getCustomInfo("frmCustomerDashboard");
    for (i = 0; i < menuData.length; i++) {
      switch (menuData[i].text) {

            // [Trixon] Configured Sidemenu Items visibility based on the MicroApp availablity AND commented out unused items visibility configuration
            case configManager.constants.MENUACCOUNT:
                if (configManager.isMicroAppPresent(configManager.microappConstants.ARRANGEMENTS))
                    menuData[i].visibility = true;
                else
                    menuData[i].visibility = false;
                break;

            case configManager.constants.MENUSCHEDULEPAYMENTS:
                if (configManager.isMicroAppPresent(configManager.microappConstants.BILLPAY))
                    menuData[i].visibility = true;
                else
                    menuData[i].visibility = false;
                break;

            case configManager.constants.MENUCARDS:
                if (configManager.isMicroAppPresent(configManager.microappConstants.CARDS))
                    menuData[i].visibility = true;
                else
                    menuData[i].visibility = false;
                break;

            case configManager.constants.MENURECEIVEPAYMENTS:
            case configManager.constants.MENUDEALSANDDISCOUNTS:
            case configManager.constants.MENUUSSD:
            case configManager.constants.MENUREFERANDEARN:
                if (configManager.isMicroAppPresent(configManager.microappConstants.HOMEPAGE))
                    menuData[i].visibility = true;
                else
                    menuData[i].visibility = false;
                break;

            case configManager.constants.MENUMESSAGES:
            case configManager.constants.MENUNOTIFICATIONS:
                if (configManager.isMicroAppPresent(configManager.microappConstants.SECUREMESSAGE))
                    menuData[i].visibility = true;
                else
                    menuData[i].visibility = false;
                break;

            case configManager.constants.MENUSETTINGS:
                if (configManager.isMicroAppPresent(configManager.microappConstants.MANAGEPROFILE))
                    menuData[i].visibility = true;
                else
                    menuData[i].visibility = false;
                break;

            case configManager.constants.MENULOCATE:
            case configManager.constants.MENUTERMSANDCONDITIONS:
                if (configManager.isMicroAppPresent(configManager.microappConstants.ABOUTUS))
                    menuData[i].visibility = true;
                else
                    menuData[i].visibility = false;
                break;
            // [Trixon] Ended  


        // case configManager.constants.MENUTRADEFINANCE:
        //   if (configManager.isMicroAppPresent(configManager.microappConstants.TRADEFINANCE))
        //     menuData[i].visibility = false;
        //   else
        //     menuData[i].visibility = false;
        //   break;
        // case configManager.constants.MENUCONVERSATIONALBANKING:
        //   if (configManager.isMicroAppPresent(configManager.microappConstants.CBP))
        //     menuData[i].visibility = false;
        //   else
        //     menuData[i].visibility = false;
        //   break;
        // case configManager.constants.MENUCHEQUEMANAGEMENT:
        //   if (configManager.isMicroAppPresent(configManager.microappConstants.ARRANGEMENTS))
        //     menuData[i].visibility = false;
        //   else
        //     menuData[i].visibility = false;
        //   break;
		// case configManager.constants.MENUDASHBOARDOVERVIEW:
        //    if(configManager.isMicroAppPresent(configManager.microappConstants.HOMEPAGE) && 
        //       (!kony.sdk.isNullOrUndefined(custominfoCD) && (custominfoCD.reDesignFlow === "true"  || custominfoCD.reDesignFlowWealth === "true"))){
        //       menuData[i].visibility = true;
        //    }else{
                
        //       menuData[i].visibility = false;
                
        //    }
        //    break;
        // case configManager.constants.MENUACCOUNTS:
        //    if(configManager.isMicroAppPresent(configManager.microappConstants.HOMEPAGE) && 
        //       (!kony.sdk.isNullOrUndefined(custominfoCD) && (custominfoCD.reDesignFlow !== "true" || custominfoCD.reDesignFlowWealth !== "true"))){
                
        //             menuData[i].visibility = true;
                
        //    }else{
        //       menuData[i].visibility = false;
        //    }
        //   break;
        // case configManager.constants.MENUACCOUNTSWEEP:
        //         if (configManager.isMicroAppPresent(configManager.microappConstants.ACCOUNTSWEEP))
        //             menuData[i].visibility = false;
        //         else
        //             menuData[i].visibility = false;
        //           break;    
            
            // case configManager.constants.MENUWEALTHWATCHLIST:
            //     if (configManager.isMicroAppPresent(configManager.microappConstants.HOMEPAGE))
            //         menuData[i].visibility = false;
            //     else
            //         menuData[i].visibility = false;
            //     break;

            // case configManager.constants.MENUCONTACT:
            //     if (configManager.isMicroAppPresent(configManager.microappConstants.ABOUTUS))
            //         menuData[i].visibility = true;
            //     else
            //         menuData[i].visibility = false;
            //     break;

            // case configManager.constants.MENUUNIFIEDTRANSFERSFLOW:
            //     if (configManager.isMicroAppPresent(configManager.microappConstants.UNIFIEDTRANSFER))
            //         menuData[i].visibility = true;
            //     else
            //         menuData[i].visibility = false;
            //     break;

            // case configManager.constants.MENUTRANSFERS:
            //     if (configManager.isMicroAppPresent(configManager.microappConstants.REGIONALTRANSFER))
            //         menuData[i].visibility = true;
            //     else
            //         menuData[i].visibility = false;
            //     break;
            // case configManager.constants.MENUQRPAYMENT:
            //      if (configManager.isMicroAppPresent(configManager.microappConstants.REGIONALTRANSFER))
            //          menuData[i].visibility = true;
            //     else
            //         menuData[i].visibility = false;
            //     break;
            // case configManager.constants.MENUSENDMONEY:
            //     if (configManager.isMicroAppPresent(configManager.microappConstants.REGIONALTRANSFER))
            //         menuData[i].visibility = true;
            //     else
            //         menuData[i].visibility = false;
            //     break;

            // case configManager.constants.MENUMONEYMOVEMENTTRANSFERS:
            //     if (configManager.isMicroAppPresent(configManager.microappConstants.REGIONALTRANSFER))
            //         menuData[i].visibility = true;
            //     else
            //         menuData[i].visibility = false;
            //     break;

            // case configManager.constants.MENUTRANSFERSACTIVITY:
            //     if (configManager.isMicroAppPresent(configManager.microappConstants.REGIONALTRANSFER))
            //         menuData[i].visibility = true;
            //     else
            //         menuData[i].visibility = false;
            //     break;

            // case configManager.constants.MENUMANAGETRANSACTIONS:
            //     if (configManager.isMicroAppPresent(configManager.microappConstants.UNIFIEDTRANSFER))
            //         menuData[i].visibility = true;
            //     else
            //         menuData[i].visibility = false;
            //     break;

            // case configManager.constants.MENUMANAGERECIPIENTS:
            //     if (configManager.isMicroAppPresent(configManager.microappConstants.REGIONALTRANSFER))
            //         menuData[i].visibility = true;
            //     else
            //         menuData[i].visibility = false;
            //     break;

            // case configManager.constants.MENUMANAGEBENEFICIARIES:
            //     if (configManager.isMicroAppPresent(configManager.microappConstants.UNIFIEDTRANSFER))
            //         menuData[i].visibility = true;
            //     else
            //         menuData[i].visibility = false;
            //     break;

            // case configManager.constants.MENUDISPUTE:
            //     if (configManager.isMicroAppPresent(configManager.microappConstants.ARRANGEMENTS))
            //         menuData[i].visibility = true;
            //     else
            //         menuData[i].visibility = false;
            //     break;

            

            // case configManager.constants.MENUACCOUNTSTATEMENTS:
            //     if (configManager.isMicroAppPresent(configManager.microappConstants.ARRANGEMENTS))
            //         menuData[i].visibility = true;
            //     else
            //         menuData[i].visibility = false;
            //     break;

            // case configManager.constants.MENUBILLPAY:
            //     if (configManager.isMicroAppPresent(configManager.microappConstants.BILLPAY))
            //         menuData[i].visibility = true;
            //     else
            //         menuData[i].visibility = false;
            //     break;

            // case configManager.constants.MENUCARDLESS:
			// 	if (configManager.isMicroAppPresent(configManager.microappConstants.ARRANGEMENTS))
            //         menuData[i].visibility = true;
            //     else
            //         menuData[i].visibility = false;
            //     break;
            // case configManager.constants.MENUCHECKDEPOSIT:
            //     if (configManager.isMicroAppPresent(configManager.microappConstants.ARRANGEMENTS))
            //         menuData[i].visibility = false;
            //     else
            //         menuData[i].visibility = false;
            //     break;
            // case configManager.constants.Deposits:
            //         menuData[i].visibility = false;
            //     break;

            // case configManager.constants.MENUSERVICEREQUESTS:
            //     var is_CARDMANAGEMENT_BACKEND_SRMS = CommonUtilities.CLIENT_PROPERTIES.CARDS_BACKEND === "MOCK" ? false : true        
            //     if (configManager.isMicroAppPresent(configManager.microappConstants.ARRANGEMENTS)  && is_CARDMANAGEMENT_BACKEND_SRMS )
            //         menuData[i].visibility = true;
            //     else
            //         menuData[i].visibility = false;
            //     break;

            // case configManager.constants.MENUFEEDBACK:
            //     if (configManager.isMicroAppPresent(configManager.microappConstants.ABOUTUS))
            //         menuData[i].visibility = true;
            //     else
            //         menuData[i].visibility = false;
            //     break;

            // case configManager.constants.MENUCHATBOT:
            //         menuData[i].visibility = false;
            //     break;

            // case configManager.constants.MENUMANAGEOTHERBANKACCOUNTS:
            //     if (configManager.isMicroAppPresent(configManager.microappConstants.ACCAGGREGATION))
            //         menuData[i].visibility = false;
            //     else
            //         menuData[i].visibility = false;
            //     break;

            // case configManager.constants.MENUCARDMANAGEMENT:
            //     if (configManager.isMicroAppPresent(configManager.microappConstants.CARDS))
            //         menuData[i].visibility = true;
            //     else
            //         menuData[i].visibility = false;
            //     break;

            // case configManager.constants.MENUOPENACOUNT:
            //         menuData[i].visibility = false;
            //     break;

            // case configManager.constants.MENUPFMMYMONEY:          
            //     if (configManager.isMicroAppPresent(configManager.microappConstants.FINANCEMANAGEMENT))
            //       menuData[i].visibility = false;
            //     else
            //       menuData[i].visibility = false;
            //     break;

            // case configManager.constants.MENUACH:
            //     if (configManager.isMicroAppPresent(configManager.microappConstants.ACH))
            //       menuData[i].visibility = false;
            //     else
            //       menuData[i].visibility = false;
            //       break;

            // case configManager.constants.MENUAPPROVALREQUEST:
            //     menuData[i].visibility = false;
            //     try {
            //         menuData[i].visibility =  (applicationManager.getConfigurationManager().showApprovalWidget == "true" || applicationManager.getConfigurationManager().showRequestWidget == "true")
            //     }
            //     catch(err){
            //         if (configManager.isMicroAppPresent(configManager.microappConstants.APPROVALREQUEST)) menuData[i].visibility = true;
            //     }
            //     break;

            // case configManager.constants.MENUUSERMANAGEMENT:
            //     if (configManager.isMicroAppPresent(configManager.microappConstants.USERMANAGEMENT))
            //         menuData[i].visibility = true;
            //     else
            //         menuData[i].visibility = false;
            //     break;


            // case configManager.constants.MENUFOREIGNEXCHANGE:
            //     if (configManager.isMicroAppPresent(configManager.microappConstants.FOREIGNEXCHANGE))
            //         menuData[i].visibility = true;
            //     else
            //         menuData[i].visibility = false;
            //     break;
        //    case configManager.constants.MENUSECURITYNOTIFICATIONS:
        //         if (configManager.isMicroAppPresent(configManager.microappConstants.APPROVALREQUEST))
        //             menuData[i].visibility = true;
        //         else
        //             menuData[i].visibility = false;
        //         break;
        //    case configManager.constants.MENUPASSCODE:
        //         if (configManager.isMicroAppPresent(configManager.microappConstants.APPROVALREQUEST))
        //             menuData[i].visibility = true;
        //         else
        //             menuData[i].visibility = false;
        //         break;
        //     case configManager.constants.MENUBIOMETRICAPPROVAL:
        //         if (configManager.isMicroAppPresent(configManager.microappConstants.SELFSERVICEENROLMENT))
        //             menuData[i].visibility = true;
        //         else
        //             menuData[i].visibility = false;
        //         break;
          
        //     case configManager.constants.MENUEXPLOREPRODUCTSORRESUME:
        //           menuData[i].visibility = true;



            default:
        }

        if (menuData[i].visibility) {
            data.push(menuData[i]);
        }
    }
      return data;
    };

    MenuHandler.prototype.setEntityName = function (scope) {
      let singleEntityValue = "true";
      if (applicationManager.getConfigurationManager().configurations.getItem("isSingleEntity") !== undefined) {
        singleEntityValue = applicationManager.getConfigurationManager().configurations.getItem("isSingleEntity");
      }
      let userLegalEntitesSize = applicationManager.getMultiEntityManager().getUserLegalEntitiesSize();
      if (singleEntityValue === "false" && userLegalEntitesSize > 0) {
        scope.view.Hamburger.flxHeader.height = "160dp";
        scope.view.Hamburger.flxMenu.top = "160dp";
        let userLegalEntitiesObj = applicationManager.getMultiEntityManager().getUserLegalEntitiesListObj();
        let currentLegalEntity = applicationManager.getUserPreferencesManager().getCurrentLegalEntity();
        scope.view.Hamburger.lblSelectedLegalEntity.text = "";
        scope.view.Hamburger.flxEntitySelectionContainer.setEnabled(true);
        if (userLegalEntitiesObj && currentLegalEntity && userLegalEntitiesObj[currentLegalEntity]) {
          let entityName = userLegalEntitiesObj[currentLegalEntity].companyName ? userLegalEntitiesObj[currentLegalEntity].companyName : "";
          scope.view.Hamburger.lblSelectedLegalEntity.text = entityName;
        }
        if (userLegalEntitesSize === 1) {
          scope.view.Hamburger.flxEntitySelectionContainer.setEnabled(false);
        }
        scope.view.Hamburger.flxLegalEntityContainer.setVisibility(true);
      } else {
        scope.view.Hamburger.flxHeader.height = "80dp";
        scope.view.Hamburger.flxMenu.top = "80dp";
        scope.view.Hamburger.lblSelectedLegalEntity.text = "";
        scope.view.Hamburger.flxLegalEntityContainer.setVisibility(false);
      }
    };
    
    return MenuHandler;
});