/**
  * @module AlertsManager
 */
define([], function () {
    /**
       *This is class named MessagesManager which handles all functions related to Messages in the application
       *@alias module:MessagesManager
       *@class
       */
    function AlertsManager() {
        this.alertsData = null;
        this.unreadNotifications = null;
        this.previousUnReadCount = null;
		this.categoryId = null;
        this.accountId = null;
        this.accountTypeId = null;
    }
    inheritsFrom(AlertsManager, kony.mvc.Business.Delegator);
    AlertsManager.prototype.initializeBusinessController = function () {
    };
    /**
 * used to get the deleted requests
 * @returns{object}  alertData
*/
    AlertsManager.prototype.getAlerts = function () {
        return this.alertsData;
    }
    /**
     * * used to set the alerts
     * @param {array} data
     */
    AlertsManager.prototype.setAlerts = function (data) {
        this.alertsData = data;
    }
    /**
     * * used to set the unread notifications count
     * @param {Integer} count
     */
    AlertsManager.prototype.setUnreadNotifications = function (count) {
        this.unreadNotifications = count;
    }
    /**
     * used to get the unread notifications count
     * @returns {string} count
     */
    AlertsManager.prototype.getUnreadNotifications = function () {
        return this.unreadNotifications;
    }
    /**
     * used to get the previous unread notifications count
     * @returns {string} count
     */
    AlertsManager.prototype.getPreviousUnreadCount = function () {
        return this.previousUnReadCount;
    }
    /**
 * used to get the All Notifications
* @param {function} presentationMsgSuccess will be called when call is successfull
* @param {function} presentationMsgError will be called when call is not successfull
*/
    AlertsManager.prototype.getUserNotifications = function (presentationMsgSuccess, presentationMsgError) {
        var scopeObj = this;
        var notificationsRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("NotificationList");
        notificationsRepo.getAll(updateRequestAsReadCompletionCallback);
        function updateRequestAsReadCompletionCallback(status, data, error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status, data, error);
            if (obj.status === true) {
                scopeObj.alertsData = obj.data;
                presentationMsgSuccess(obj.data);
            }
            else {
                presentationMsgError(obj.errmsg);
            }
        }
    };
    /**
* used to get the unread notifications.
* @param {function} presentationMsgSuccess will be called when call is successfull
* @param {function} presentationMsgError will be called when call is not successfull
*/
    AlertsManager.prototype.getUnreadNotificationCount = function (presentationMsgSuccess, presentationMsgError) {
        var scopeObj = this;
        var notificationsRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("UnreadNotifications");
        notificationsRepo.customVerb('getCount', {}, updateRequestAsReadCompletionCallback);
        function updateRequestAsReadCompletionCallback(status, data, error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status, data, error);
            if (obj.status === true) {
                scopeObj.previousUnReadCount = scopeObj.unreadNotifications;
                scopeObj.unreadNotifications =  obj.data[0].unreadNotificationCount;
                presentationMsgSuccess(obj.data);
            }
            else {
                presentationMsgError(obj.errmsg);
            }
        }
    };
    /**
* used to update the unread notifications.
* @param {object} param param
* @param {function} presentationMsgSuccess will be called when call is successfull
* @param {function} presentationMsgError will be called when call is not successfull
*/
    AlertsManager.prototype.updateNotificationAsRead = function (param, presentationMsgSuccess, presentationMsgError) {
        var notificationsRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("UnreadNotifications");
        notificationsRepo.partialUpdate(param, updateRequestAsReadCompletionCallback);
        function updateRequestAsReadCompletionCallback(status, data, error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status, data, error);
            if (obj.status === true) {
                presentationMsgSuccess(obj.data);
            }
            else {
                presentationMsgError(obj.errmsg);
            }
        }
    };
    /**
* used to delete the notification.
* @param {object} param param
* @param {function} presentationMsgSuccess will be called when call is successfull
* @param {function} presentationMsgError will be called when call is not successfull
*/
    AlertsManager.prototype.deleteNotification = function (param, presentationMsgSuccess, presentationMsgError) {
        var notificationsRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("NotificationList");
        notificationsRepo.customVerb("deleteNotification", param, updateRequestAsReadCompletionCallback);
        function updateRequestAsReadCompletionCallback(status, data, error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status, data, error);
            if (obj.status === true) {
                presentationMsgSuccess(obj.data);
            }
            else {
                presentationMsgError(obj.errmsg);
            }
        }
    }
    /**
* used to get the notification by serach param
* @param {object} criteria criteria
* @param {function} presentationMsgSuccess will be called when call is successfull
* @param {function} presentationMsgError will be called when call is not successfull
*/
    AlertsManager.prototype.getNotificationsBySearch = function (criteria, presentationMsgSuccess, presentationMsgError) {
        var scopeObj = this;
        var notificationsRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("NotificationList");
        notificationsRepo.getByCriteria(criteria, updateRequestAsReadCompletionCallback);
        function updateRequestAsReadCompletionCallback(status, data, error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status, data, error);
            if (obj.status === true) {
                scopeObj.alertsData = obj.data;
                presentationMsgSuccess(obj.data);
            }
            else {
                presentationMsgError(obj.errmsg);
            }
        }
    };
    /**
* used to fetch the profile alerts.
* @param {object} params - contains the type of alerts to be fetched.
* @param {function} presentationMsgSuccess will be called when call is successfull
* @param {function} presentationMsgError will be called when call is not successfull
*/
    AlertsManager.prototype.fetchProfileAlerts = function (params, presentationMsgSuccess, presentationMsgError) {
        var scopeObj = this;
        var profileAlerts = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("UserAlerts");
      profileAlerts.customVerb("getAllAlerts",params, completionCallBack);
        function completionCallBack(status, data, error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status, data, error);
            if (obj.status === true) {
                presentationMsgSuccess(obj.data);
            }
            else {
                presentationMsgError(obj.errmsg);
            }
        }
    };
  /**
* used to update profile alerts.
* @param {object} params - contains the type of alerts to be fetched.
* @param {function} presentationMsgSuccess will be called when call is successfull
* @param {function} presentationMsgError will be called when call is not successfull
*/
    AlertsManager.prototype.updateProfileAlerts = function (params, presentationMsgSuccess, presentationMsgError) {
        var scopeObj = this;
        var alertsDataModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("UserAlerts");
        alertsDataModel.customVerb("updateAlerts", params, completionCallBack);
        function completionCallBack(status, data, error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status, data, error);
            if (obj.status === true) {
                presentationMsgSuccess(obj.data);
            }
            else {
               presentationMsgError(obj.errmsg);
            }
        }
    };
  /**
* used to fetch the type of customer alert category to be shown.
* @param {function} presentationMsgSuccess will be called when call is successfull
* @param {function} presentationMsgError will be called when call is not successfull
*/
    AlertsManager.prototype.fetchAlertsCategory = function (presentationMsgSuccess, presentationMsgError) {
        var scopeObj = this;
        var profileAlerts = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Alerts");
        kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository('Alerts').setHeaderParams({"Accept-Language":kony.i18n.getCurrentLocale()});// required to set language parameter as header parameter for admin service for multilingual support
        profileAlerts.customVerb("getCategories",{}, completionCallBack);
        function completionCallBack(status, data, error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status, data, error);
            if (obj.status === true) {
                presentationMsgSuccess(obj.data);
            }
            else {
                presentationMsgError(obj.errmsg);
            }
        }
    };
  /**
* used to fetch the alert channels.
* @param {object} params - {}.
* @param {function} presentationMsgSuccess will be called when call is successfull
* @param {function} presentationMsgError will be called when call is not successfull
*/
    AlertsManager.prototype.fetchAlertChannels = function (params, presentationMsgSuccess, presentationMsgError) {
        var scopeObj = this;
        var profileAlerts = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("DbxUserAlerts");
        kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository('DbxUserAlerts').setHeaderParams({"Accept-Language":kony.i18n.getCurrentLocale()});// required to set language parameter as header parameter for admin service for multilingual support
        profileAlerts.customVerb("getAlertChannels",params, completionCallBack);
        function completionCallBack(status, data, error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status, data, error);
            if (obj.status === true) {
                presentationMsgSuccess(obj.data);
            }
            else {
                presentationMsgError(obj.errmsg);
            }
        }
    };
  /**
* used to fetch the alerts present in a particular category.
* @param {object} params - contains the type of alerts to be fetched.
* @param {function} presentationMsgSuccess will be called when call is successfull
* @param {function} presentationMsgError will be called when call is not successfull
*/
    AlertsManager.prototype.fetchAlertsInCategory = function ( params, presentationMsgSuccess, presentationMsgError) {
        var scopeObj = this;
        var profileAlerts = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Alerts");
        kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository('Alerts').setHeaderParams({"Accept-Language":kony.i18n.getCurrentLocale()}); // required to set language parameter as header parameter for admin service for multilingual support
        profileAlerts.customVerb("getPreferences",params, completionCallBack);
        function completionCallBack(status, data, error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status, data, error);
            if (obj.status === true) {
                presentationMsgSuccess(obj.data);
            }
            else {
                presentationMsgError(obj.errmsg);
            }
        }
    };
  /**
* used to save the user alerts preferences.
* @param {object} params - contains the user alerts data
* @param {function} presentationMsgSuccess will be called when call is successfull
* @param {function} presentationMsgError will be called when call is not successfull
*/
    AlertsManager.prototype.setAlertPreferences = function ( params, presentationMsgSuccess, presentationMsgError) {
        var scopeObj = this;
        var DBXUserAlerts  =  kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Alerts");
        DBXUserAlerts.customVerb("setPreferences",params, completionCallBack );
        function completionCallBack(status, data, error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status, data, error);
            if (obj.status === true) {
                presentationMsgSuccess(obj.data);
            }
            else {
                presentationMsgError(obj.errmsg);
            }
        }
    };
    AlertsManager.prototype.getCustomerAccountAlertPreference = function (presentationMsgSuccess, presentationMsgError) {
        var scopeObj = this;
        var profileAlerts = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Alerts");
        kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository('Alerts').setHeaderParams({"Accept-Language":kony.i18n.getCurrentLocale()});// required to set language parameter as header parameter for admin service for multilingual support
        profileAlerts.customVerb("getArrangementsStatus", {}, completionCallBack);
        function completionCallBack(status, data, error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status, data, error);
            if (obj.status === true) {
                presentationMsgSuccess(obj.data);
            }
            else {
                presentationMsgError(obj.errmsg);
            }
        }
    };
	/**
* used to get the categoryID of selected alert.
*/
    AlertsManager.prototype.getCategoryId = function() {
       return this.categoryId;
    };
	/**
* used to save the categoryId.
* @param {String} categoryId - to set the categoryId
*/
	AlertsManager.prototype.setCategoryId = function (categoryId) {
       this.categoryId = categoryId;
    };
  	/**
* used to get the accountID of selected alert.
*/
    AlertsManager.prototype.getaccountId = function() {
       return this.accountId;
    };
	/**
* used to save the accountId.
* @param {String} accountId - to set the accountId
*/
	AlertsManager.prototype.setaccountId = function (accountId) {
       this.accountId = accountId;
    };
  	/**
* used to get the accountID of selected alert.
*/
    AlertsManager.prototype.getaccountTypeId = function() {
       return this.accountTypeId;
    };
	/**
* used to save the accountId.
* @param {String} accountId - to set the accountId
*/
	AlertsManager.prototype.setaccountTypeId = function (accountTypeId) {
       this.accountTypeId = accountTypeId;
    };
  /**
  * used to save alert level configuration
  * @param {String} alertLevelConfig - to set the alert level
  */
	AlertsManager.prototype.setAlertLevelConfiguration = function (alertLevelConfig) {
       this.alertLevelConfig = alertLevelConfig;
    };
  /**
  * used to fetch the alert level configuration
  * @return {String} alertLevelConfig
  */
	AlertsManager.prototype.getAlertLevelConfiguration = function () {
       return this.alertLevelConfig
    };
  /**
  * used to set the selected alertgroup Id
  * @param {String} alertGroupId
  */
  AlertsManager.prototype.setAlertsGroupID = function(alertGroupId) {
    this.alertGroupId = alertGroupId;
  };
  /**
  * used to fetch the selected alertgroup Id
  * @return {String} alertGroupId
  */
  AlertsManager.prototype.getAlertsGroupID = function() {
    return this.alertGroupId;
  };
  /**
  * used to set the selected alert Id
  * @param {String} alertId
  */
  AlertsManager.prototype.setAlertID = function(alertId) {
    this.alertId = alertId;
  };
  /**
  * used to fetch the selected alertgroup Id
  * @returns {String} alertId
  */
  AlertsManager.prototype.getAlertID = function() {
    return this.alertId;
  };
    return AlertsManager;
});