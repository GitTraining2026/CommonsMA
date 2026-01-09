define(function () {

  function ComponentUtility() {
    this.fileTypeConstants = {
      "\ue95f": "PDF"
    };
    this.fontIconConstants = {
      "checked": "\ue926",
      "unchecked": "\ue924",
      "chevronUpIcon": "\ue933",
      "chevronDownIcon": "\ue930",
      "infoIcon": "\ue947",
      "hideIcon": "\ue945",
      "unhideIcon": "\ue975"
    };
    this.microAppConstants = {
      "COMMONS": "CommonsMA",
      "RESOURCES": "ResourcesMA",
	  "ABOUTUS": 'AboutUsMA',
      "ALERTSETTINGS": 'AlertSettingsMA',
      "CONSENTMANAGEMENT": 'ConsentMgmtMA',
      "BILLPAY": 'BillPayMA',
      "DIGITALTRANSFER": 'DigitalTransferMA',
      "HOMEPAGE": 'HomepageMA',
      "NOTIFICATIONS": 'NotificationsMA',
      "SECUREMESSAGE": 'SecureMessageMA',
      "PERSONALFINANCEMANAGEMENT": 'PfmMA',
      "PORTFOLIO": 'PortfolioManagementMA' ,
      "REGIONALTRANSFER": 'RegionalTransferMA',
      "UNIFIEDTRANSFER": 'UnifiedTransferMA',
      "WEALTHORDER": 'WealthOrderMA',
      "WIRETRANSFER": 'WireTransferMA',
      "ACCAGGREGATION": 'AccAggregationMA',
      "ARRANGEMENTS": 'ArrangementsMA',
      "APPROVALMATRIX": 'ApprovalMatrixMA',
      "USERMANAGEMENT": 'UserManagementMA',
      "APPROVALREQUEST": 'ApprovalRequestMA',
      "FOREIGNEXCHANGE": 'ForeignExchangeMA',
      "BULKPAYMENTS": 'BulkPaymentsMA',
      "FINANCEMANAGEMENT": 'FinanceManagementMA',
      "CARDS": 'CardsMA',
      "CAMPAIGN": 'CampaignMA',
      "MANAGEARRANGEMENTS": 'ManageArrangementsMA',
      "CBP": 'CBPMA',
      "SELFSERVICEENROLMENT": 'SelfServiceEnrolmentMA',
      "MANAGEPROFILE": 'ManageProfileMA',
      "TRADEFINANCE": 'TradeFinanceMA',
      "AUTHENTICATION": 'AuthenticationMA',
      "SAVINGSPOT": 'SavingsPotMA',
      "ACH":'ACHMA'
    };
    scope_componentUtility = this;
  }

  /**
   * Checks if the value is empty, null or undefined
   * @param {String} data - Value to be checked
   * @returns {Boolean} Validity of the value to be checked
   */
  ComponentUtility.prototype.isEmptyNullUndefined = function (data) {
    if (data === null || data === undefined || data === "") {
      return true;
    } else {
      return false;
    }
  };

  /**
   * Verifies whether widgetID is valid one
   * @param {Object} scope - Controller scope to check the widgetID
   * @param {String} widgetID - Widget name
   * @returns {Boolean} Validity of the widgetID passed
   */
  ComponentUtility.prototype.isValidWidget = function (scope, widgetID) {
    if (scope.view[widgetID] !== undefined && scope.view[widgetID] !== null) {
      return true;
    } else {
      return false;
    }
  };

  /**
   * Returns the file type based on the unicode configured
   * @param {String} widgetID - Unicode of the font icon
   * @returns {String} Corresponding File Type
   */
  ComponentUtility.prototype.getFileType = function (unicode) {
    if (!kony.sdk.isNullOrUndefined(this.fileTypeConstants[unicode]) && this.fileTypeConstants[unicode] !== "") {
      return this.fileTypeConstants[unicode];
    } else {
      return "";
    }
  };

  /**
   * Retrieves the scope of ComponentUtility file
   * @returns {Object} Scope of ComponentUtility file
   */
  ComponentUtility.getUtilityController = function () {
    try {
      if (!this.componentUtilityScope) {
        this.componentUtilityScope = new ComponentUtility();
      }
      return this.componentUtilityScope;
    } catch (err) {
      kony.print("Exception in getUtilityController" + err);
    }
  };

  /**
   * Specifies if the application must timeout after a defined period of inactivity to required forms
   */
  ComponentUtility.prototype.setIdleTimeout = function () {
    try {
      kony.application.registerForIdleTimeout(1, scope_componentUtility.doBeforeLogout.bind(this));
    } catch (err) {
      kony.print("Exception in setIdleTimeout" + err);
    }
  };

  /**
   * Gets executed once the session times out
   */
  ComponentUtility.prototype.doBeforeLogout = function () {
    try {
      var currentForm = kony.application.getCurrentForm();
      if (!currentForm.sessionTimeout) {
        var sessionTimeoutPopup = new com.InfinityMB.Resources.sessionTimeout({
          "height": "100%",
          "id": "sessionTimeout",
          "isVisible": true,
          "left": "0dp",
          "masterType": constants.MASTER_TYPE_USERWIDGET,
          "isModalContainer": false,
          "skin": "slFbox",
          "top": "0dp",
          "width": "100%",
          "zIndex": 1,
          "appName": "ResourcesMA"
        }, {}, {});
        sessionTimeoutPopup.serviceParameters = {};
        sessionTimeoutPopup.dataMapping = {
          "footerButtons": {
            "btnContinue": {
              "text": "${i18n{i18n.common.continue}}",
              "CTAIdentifier": "continueButton"
            },
            "btnSignout": {
              "text": "${i18n{i18n.common.signout}}",
              "CTAIdentifier": "signOutButton"
            }
          },
          "lableSection": {
            "lblHeader": "${i18n{i18n.common.sessionTimeout}}",
            "lblDesc": "${i18n{i18n.common.timeoutMsg}}",
            "lblTimer": "${CNTX.timeout_minutes}"
          }
        };
        sessionTimeoutPopup.dataFormatting = {};
        sessionTimeoutPopup.conditionalMappingKey = "";
        sessionTimeoutPopup.conditionalMapping = {};
        sessionTimeoutPopup.sessionTimeoutProperty = "context";
        sessionTimeoutPopup.timeoutValue = 4;
        kony.application.getCurrentForm().add(sessionTimeoutPopup);
      }
      //Events and methods exposed in sessionTimeout component
      currentForm.sessionTimeout.setContext({ timeout_minutes: 4 });
      currentForm.sessionTimeout.onError = function (errorObject) {
        kony.print("onError:::" + JSON.stringify(errorObject));
      };
      currentForm.sessionTimeout.handleTimeoutEventCall = function (btnID) {
        switch (btnID) {
          case 'signOutButton':
            var formToNavigate = new kony.mvc.Navigation("frmSessionTimeoutLogout");
            formToNavigate.navigate();
            break;
          case 'continueButton':
            scope_componentUtility.setIdleTimeout();
            break;
        }
      };
      currentForm.sessionTimeout.postShow();
      currentForm.sessionTimeout.showSessionTimeout(true);
    } catch (err) {
      kony.print("Exception in doBeforeLogout" + err);
    }
  };

  /**
   * Responsible to return dynamic segment template provided through contract based on config type
   * @param {String/Object} templateConfig - Row Template Config provided through contract
   * @returns {String/Object} Returns string if the templateConfig is null or empty or undefined and object if templateConfig possess either string or object
   */
  ComponentUtility.prototype.getDynamicTemplateName = function (templateConfig) {
    var scope = this;
    if (!scope.isEmptyNullUndefined(templateConfig)) {
      if (templateConfig.indexOf("{") !== -1) {
        templateConfig = JSON.parse(templateConfig);
        if (!scope.isEmptyNullUndefined(templateConfig.microAppName) && !scope.isEmptyNullUndefined(templateConfig.templateID)) {
          return kony.mvc.resolveNameFromContext({
            "appName": templateConfig.microAppName,
            "friendlyName": templateConfig.templateID
          });
        }
      } else {
        return templateConfig;
      }
    } else {
      return "";
    }
  };
  return ComponentUtility;
});