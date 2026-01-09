define(function () {
  function FooterMenuUtility() {
    this.entitlements = { features: "[]", permissions: "[]" };
    this.scope;
    /**@member {Object}  Contains all footer menu constants*/
    this.footerMenuConstants = {
      OVERVIEW: kony.i18n.getLocalizedString("i18n.common.overview"), //"Overview", //kony.i18n.getLocalizedString('i18n.common.overView'),
      BILLPAY: kony.i18n.getLocalizedString("i18n.Transactions.backendBillPay"),
      CARDS: kony.i18n.getLocalizedString("i18n.OnlineHelp.CardsHeader"),
      MENU: kony.i18n.getLocalizedString("kony.mb.common.menu"),
      ACCOUNTS: kony.i18n.getLocalizedString("i18n.topmenu.accounts"),
      APPROVALS: kony.i18n.getLocalizedString(
        "kony.mb.ApprovalRequests.Approvals"
      ),
      QRPAYMENTS: kony.i18n.getLocalizedString("i18n.qrpayments.QRPayments"),
      WATCHLIST: kony.i18n.getLocalizedString(
        "i18n.wealth.watchlistcard.header"
      ),
      TRANSFER: kony.i18n.getLocalizedString("i18n.hamburger.transfers"),
      CONTACTUS: kony.i18n.getLocalizedString("i18n.footer.contactUs"),
      LOCATEUS: kony.i18n.getLocalizedString("i18n.footer.locateUs"),
      CARDLESSCASH: kony.i18n.getLocalizedString(
        "kony.mb.Hamburger.CardLessCash"
      ),
      CHECKDEPOSIT: kony.i18n.getLocalizedString(
        "kony.mb.Hamburger.CheckDeposit"
      ),
    };
    var custominfoCD = applicationManager.getNavigationManager().getCustomInfo("frmCustomerDashboard");
    var friendlyName = "";
    var label = "";
	if(!kony.sdk.isNullOrUndefined(custominfoCD) && (custominfoCD.reDesignFlow === "true" || custominfoCD.reDesignFlowWealth === "true")){
       label = this.footerMenuConstants.OVERVIEW;
       friendlyName = "frmUnifiedCustomerDashboard";
    }else{
    
       label = this.footerMenuConstants.ACCOUNTS;
       friendlyName = "frmUnifiedDashboard";
      
    }
    /**@member {Array} holds the list of Footer MenuItems*/
    this.menuData = {
      defaultMenus: [
        {
          label: label,
          icon: "accounts_n.png",
          selectedIcon: "accounts_a.png",
          isActive: true,
          navigation: {
            appName: "HomepageMA",
            friendlyName: friendlyName,
          }, // Component Consumer should provide valid navigation config as per flow.
        },
        {
          label: this.footerMenuConstants.MENU,
          icon: "menu_n.png",
          selectedIcon: "menu_a.png",
          isActive: false,
          navigation: {
            appName: "TestMA",
            friendlyName: "frmFooterMenuDestination",
          }, // Component Consumer should provide valid navigation config as per flow.
        },
      ],
      customMenus: [
        {
          "label": this.footerMenuConstants.WATCHLIST,
          "icon": "watchlist_n.png",
          "selectedIcon": "watchlist_a.png",
          "isActive": false,
          "entitlements": "['WEALTH_WATCHLIST_INSTRUMENT_VIEW','WEALTH_WATCHLIST_INSTRUMENT_CREATE']",
          "navigation": { "appName": "WealthOrderMA", "friendlyName": "frmWatchlist" }  // Component Consumer should provide valid navigation config as per flow.
        },
        {
          "label": this.footerMenuConstants.TRANSFER,
          "icon": "transfer_n.png",
          "selectedIcon": "transfer_a.png",
          "isActive": false,
          "entitlements": "['INTRA_BANK_FUND_TRANSFER_CREATE','TRANSFER_BETWEEN_OWN_ACCOUNT_CREATE','INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE','INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE','P2P_CREATE','INTRA_BANK_FUND_TRANSFER_CREATE_RECEPIENT','TRANSFER_BETWEEN_OWN_ACCOUNT_CREATE_RECEPIENT','INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT','INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT','P2P_CREATE_RECEPIENT']",
          "navigation": {}  // Component Consumer should provide valid naviagtion config as per flow.
        },
        {
          "label": this.footerMenuConstants.QRPAYMENTS,
          "icon": "qr_inactive.png",
          "selectedIcon": "qr_active.png",
          "isActive": false,
          "entitlements":"['QR_PAYMENTS_CREATE']",
          "navigation": {}  // Component Consumer should provide valid naviagtion config as per flow.
        }/*,
        {
          label: this.footerMenuConstants.CARDLESSCASH,
          icon: "card_man_n.png",
          selectedIcon: "card_man_a.png",
          isActive: false,
          entitlements:
            "['WITHDRAW_CASH_CARDLESS_CASH','WITHDRAW_CASH_VIEW_SUMMARY']",
          navigation: {
            appName: "ArrangementsMA",
            friendlyName: "frmCardLessHome",
          }, // Component Consumer should provide valid navigation config as per flow.
        },
        {
          label: this.footerMenuConstants.CHECKDEPOSIT,
          icon: "checkdepositimg.png",
          selectedIcon: "checkdepositimg.png",
          isActive: false,
          entitlements: "['RDC']",
          navigation: {
            appName: "ArrangementsMA",
            friendlyName: "frmCheckDeposit",
          }, // Component Consumer should provide valid naviagtion config as per flow.
        },*/
      ],
      customMenusDefault: [
        {
          label: this.footerMenuConstants.CONTACTUS,
          icon: "support_n.png",
          selectedIcon: "support_a.png",
          isActive: false,
          entitlements: "[]",
          navigation: {
            appName: "TestMA",
            friendlyName: "frmFooterMenuDestination",
          }, // Component Consumer should provide valid naviagtion config as per flow.
        },
        {
          label: this.footerMenuConstants.LOCATEUS,
          icon: "locate_us_n.png",
          selectedIcon: "locate_us_a.png",
          isActive: false,
          entitlements: "[]",
          navigation: {
            appName: "TestMA",
            friendlyName: "frmFooterMenuDestination",
          }, // Component Consumer should provide valid naviagtion config as per flow.
        },
      ],
      notification: {
        icon: "menu_notification_2.png",
        selectedIcon: "menu_notification.png",
        isNotificationAvailable: false,
      },
    };
  }

  /**
   * Method to create instance for FooterMenu utility file
   * To retrive the Footer Menu Utility instance
   * @return: {Object} File Instance
   */
  FooterMenuUtility.getFooterMenuUtilityInstance = function () {
    try {
      if (!this.footerMenuInstance) {
        this.footerMenuInstance = new FooterMenuUtility();
      }
      return this.footerMenuInstance;
    } catch (err) {
      kony.print("Exception while creating Footer menu Utility instance" + err);
    }
  };
  FooterMenuUtility.footerInstanceWhenlanguageChange = function () {
    this.footerMenuInstance = new FooterMenuUtility();
    return this.footerMenuInstance;
  };

  /**
   * Method used to Update default Footer Menu items
   * @param {object} menuItems - Customized Menu based on user preference
   * @return: NA
   */
  FooterMenuUtility.prototype.updateMenuData = function (menuItems) {
    for (let key in menuItems) {
      if (key === "defaultMenus" || key === "customMenus") {
        this.menuData[key] = menuItems[key];
      }
    }
  };

  /**
   * sets the notification status for user
   * @param {boolean} status - contains the status of alerts and notifications
   * @return: NA
   */
  FooterMenuUtility.prototype.setNotificationDot = function (status) {
    for (let key in this.menuData) {
      if (key === "notification") {
        this.menuData[key]["isNotificationAvailable"] = status;
      }
    }
  };

  /**
   * Method used to set dynamic app level footer menu data using api.
   * @param {Object} formscope , scope of current form
   * @Param {String} flexBackgroundSkin, Skin which need to be applied to outer flex container widget (Flex skin should match with form background skin)
   * @return: NA
   */
  FooterMenuUtility.prototype.setFooterMenuItems = function (
    formscope,
    flexBackgroundSkin = "flxGrey100"
  ) {
    let context = {};
    context.skin = flexBackgroundSkin;
    context.footerMenuData = this.menuData;
    context.footerMenuData.entitlements = this.entitlements;
    formscope.view.appLevelWidgetConfig = {
      footer: {
        enabled: true,
        adjustFormHeight: true,
      },
    };
    kony.application.setAppLevelWidget({
      type: kony.application.APP_LEVEL_FOOTER,
      container: "flxTempFooterMenu",
      appName: "ResourcesMA",
    });
    var param = {
      container: "flxTempFooterMenu",
      eventName: "setAppLevelProperty",
      params: context,
    };
    formscope.executeOnAppLevelWidget(param);
  };

  /**
   * Method used to communicate error handling from component to parent layer
   * @params {Object} errorObject, error response from component
   * @return: NA
   */
  FooterMenuUtility.prototype.handleFooterMenuError = function (errorObject) {
    alert(JSON.stringify(errorObject));
  };

  /**
   * Method to bind callback action for each Menu item
   * @param {Object} selectedMenuItem , Contains information related to selected footer Menu item
   * @return: NA
   */
  FooterMenuUtility.prototype.handleFooterMenuNavigation = function (
    selectedMenuItem
  ) {
    let currentMenu = selectedMenuItem.label;
    let navMan = applicationManager.getNavigationManager();
    let ntf = "";
    switch (currentMenu) {
      case this.footerMenuConstants.OVERVIEW:
//         ntf = new kony.mvc.Navigation(selectedMenuItem.navigation);
//         ntf.navigate(currentMenu);
        var custominfoCD = applicationManager.getNavigationManager().getCustomInfo("frmCustomerDashboard");
        var presenter = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                    "moduleName": "AuthUIModule",
                    "appName": "AuthenticationMA"
                });
        if(!kony.sdk.isNullOrUndefined(custominfoCD)  && custominfoCD.isWealthUser === "true"){
                custominfoCD.reDesignFlowWealth = "false";
                custominfoCD.isBackClicked = "false";
                applicationManager.getNavigationManager().setCustomInfo("frmCustomerDashboard", custominfoCD);
                presenter.presentationController.navigationAfterLogin();
        }else{
                presenter.presentationController.navigateToOverviewSuccess();
        }
        break;
      case this.footerMenuConstants.BILLPAY:
        ntf = new kony.mvc.Navigation(selectedMenuItem.navigation);
        ntf.navigate(currentMenu);
        break;
      case this.footerMenuConstants.CARDS:
        ntf = new kony.mvc.Navigation(selectedMenuItem.navigation);
        ntf.navigate(currentMenu);
        break;
      case this.footerMenuConstants.MENU:
        let MenuHandler = applicationManager.getMenuHandler();
        MenuHandler.setProfilePic(this.scope);
        MenuHandler.setLastLoginTime(this.scope);
        MenuHandler.setUserName(this.scope);
        MenuHandler.setEntityName(this.scope);
        let selectedForm = kony.application.getCurrentForm().id;
        MenuHandler.setMenuData(this.scope, selectedForm);
        MenuHandler.showOrHideHamburgerUI(false, this.scope);
        break;
      case this.footerMenuConstants.WATCHLIST:
        ntf = new kony.mvc.Navigation(selectedMenuItem.navigation);
        ntf.navigate(currentMenu);
        break;
      case this.footerMenuConstants.TRANSFER:
        var configManager = applicationManager.getConfigurationManager();
        if (configManager.getDeploymentGeography() === 'EUROPE') {
          applicationManager.getPresentationUtility().showLoadingScreen();
          navMan.setEntryPoint("europeTransferFlow", "frmDashboardAggregated");
          var transferModPresentationController = applicationManager.getModulesPresentationController({
            "moduleName": "TransferEuropeUIModule",
            "appName": "TransfersMA"
          });
          transferModPresentationController.setEuropeFlowType("INTERNAL");
          transferModPresentationController.getFromAccounts();
          transferModPresentationController.clearEuropeFlowAtributes();
        } else {
          applicationManager.getPresentationUtility().showLoadingScreen();
          navMan.setCustomInfo("removeAttachments", true);
          navMan.setEntryPoint("centralmoneymovement", "frmDashboardAggregated");
          var moneyMovementModule = applicationManager.getModulesPresentationController({
            "moduleName": "MoneyMovementUIModule",
            "appName": "TransfersMA"
          });
          moneyMovementModule.getFromAndToAccounts();
          moneyMovementModule.clearMMFlowAtributes();
        }
        break;
      case this.footerMenuConstants.QRPAYMENTS:
        var userContext = applicationManager.getUserPreferencesManager().getUserObj();
        this.userContext = userContext;
       if (this.userContext.hasOwnProperty("isQRPaymentActivated") && this.userContext.isQRPaymentActivated === "true") {
          navMan.navigateTo({ "appName": "TransfersMA", "friendlyName": "frmQRPaymentsLanding" });
       } else {
          navMan.navigateTo({ "appName": "TransfersMA", "friendlyName": "frmQRActivation" });
        }
        break;
      case this.footerMenuConstants.CONTACTUS:
        ntf = new kony.mvc.Navigation(selectedMenuItem.navigation);
        ntf.navigate(currentMenu);
        break;
      case this.footerMenuConstants.LOCATEUS:
        var locateMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager()
          .getModule({ appName: "AboutUsMA", moduleName: "LocateUsUIModule" });
        locateMod.presentationController.presentLocateUsView(true, this.scope);
        break;
      case this.footerMenuConstants.ACCOUNTS:
        var accountsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                    "moduleName": "AccountsUIModule",
                    "appName": "HomepageMA"
                });
                accountsModule.presentationController.showDashboard();
        break;
      case this.footerMenuConstants.APPROVALS:
        ntf = new kony.mvc.Navigation(selectedMenuItem.navigation);
        ntf.navigate(currentMenu);
        break;
      //         case this.footerMenuConstants.CARDLESSCASH:
      //         ntf = new kony.mvc.Navigation(selectedMenuItem.navigation);
      //         ntf.navigate(currentMenu);
      //         break;
      //       case this.footerMenuConstants.CHECKDEPOSIT:
      //         ntf = new kony.mvc.Navigation(selectedMenuItem.navigation);
      //         ntf.navigate(currentMenu);
      //         break;

      case this.footerMenuConstants.CARDLESSCASH:
        let cardLessModule = kony.mvc.MDAApplication.getSharedInstance()
          .getModuleManager()
          .getModule({
            moduleName: "CardLessUIModule",
            appName: "ArrangementsMA",
          });
        navMan.setEntryPoint("cardlessEntry", "frmCardLessHome");
        cardLessModule.presentationController.getCardlessPendingAndPostedTransactions();
        break;
      case this.footerMenuConstants.CHECKDEPOSIT:
        let checkDepositModule = kony.mvc.MDAApplication.getSharedInstance()
          .getModuleManager()
          .getModule({
            moduleName: "CheckDepositUIModule",
            appName: "ArrangementsMA",
          });
        checkDepositModule.presentationController.fetchDeposits();
        break;
      default:
        ntf = new kony.mvc.Navigation(selectedMenuItem.navigation);
        ntf.navigate(currentMenu);
        break;
    }
  };
  return FooterMenuUtility;
});
