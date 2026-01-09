//Type your code here
kony = kony || {};
kony.onlineBanking = kony.onlineBanking || {};
kony.onlineBanking.configurations = kony.onlineBanking.configurations || {};
kony.onlineBanking.configurations = (function () {

    /**
     *Boolean opeartors true and false are considerd as
     *string because mf returns all values are string
     */
    var configurationObject = {
        'billPayOneTimePayment': "true",
        'canViewPastEBills': "true",
        'addExternalAccount': "true",
        'verifyByCredentials': "true",
        'fundTransferHistory': "true",
        'enrolSecurityQuestionsAvailable': "true",
        'editUsername': "false",
        'editPassword': "true",
        'idleTimeOut': 5,
        'loanPaymentEnabled': "true",
        'showLoanUpdateDisclaimer': "true",
        'loanPaymentAfterDueDateEnabled': "true",
        'modifyLoanPaymentAmount': "true",
        'editNickNameAccountSettings': "true",
        'limitLoanTransfersEnabled': "true",
        'payOffLoanPaymentEnabled': "true",
        'billPaySearch': "true",
        'canSearchTransfers': "true",
        'isInteractiveNotificationEnabled': "true",
        'editDisputeATransaction': "true",
        'printingTransactionDetails': "true",
        'enableDefaultAccounts': "true",
        'reOrderAccountPreferences': "true",
        'enableProfileSettings': "true",
        'enablePhoneSettings': "true",
        'enableEmailSettings': "true",
        'enableAddressSettings': "true",
        'enableUsernameAndPasswordSettings': "true",
        "enableSecurityQuestionsSettings": "true",
        "enableSecureAccessCodeSettings": "true",
        "enableAccountPreferences": "true",
        "enableAlertSettings": "true",
        'enableAlertsIcon': "true",
        'serviceFeeFlag': "true",
        'p2pServiceFee': 0.1,
        'frontendDateFormat': "mm/dd/yyyy",
        'canSearchP2PPersons': "true",
        'payApersonOneTimePayment': "true",
        'backendDateFormat': "yyyy-mm-dd",
        "additionalAddressAllowed": "true",
        "additionalPhoneAllowed": "true",
        "getDashboardMessageCount": 3,
        "isPFMWidgetEnabled": "true",
        "enableEstatements": "true",
        "eStatementsFormat": "pdf,csv",
        "pfmMaxYears": 5,
        "wireTranferFees": "10",
        "enableStopPayments": "true",
        "enalbeStopPaymentServiceFeesAndValidity": "true",
        "checkServiceFee": "30", //dollors
        "checkServiceVality": "6", //6 Months
        "isAggregatedAccountsEnabled": true,
      	"isMFAEnabledForP2P": "true",
      	"minimumAmountForMFAP2P": "100",
        "isMFAEnabledForWireTransfer": "true",
      	"minimumAmountForMFAWireTransfer": "100",
        "isMFAEnabledForBillPay": "true",
        "minimumAmountForMFABillPay": "50",
        "payeeBillsLimit":12,
        "defaultBillPayAccountSelection":"false",
        "numberOfLocations":5,
    };

    var userEntitlementsObject = {
        'isBillPayEnabled': "true",
        "minBillPayLimit": "1",
        "maxBillPayLimit": "100000",
        'ispayAPersonEnabled': "false",
        "minP2PLimit": "1",
        "maxP2PLimit": "100000",
        "isTransfersEnabled": "false",
        "minTransferLimit": "1",
        "maxTransferLimit": "100000",
        "isInternationalWireTransferEnabled": "false",
        "isDomesticWireTransferEnabled": "false",
        "minInternationalWireTransferLimit": "1",
        "maxInternationalWireTransferLimit": "100000",
        "minDomesticWireTransferLimit": "1",
        "maxDomesticWireTransferLimit": "100000",
        "isKonyBankAccountsTransfer": "false",
        "minKonyBankAccountsTransferLimit": "1",
        "maxKonyBankAccountsTransferLimit": "100000",
        "isOtherKonyAccountsTransfer": "false",
        "minOtherKonyAccountsTransferLimit": "1",
        "maxOtherKonyAccountsTransferLimit": "100000",
        "isOtherBankAccountsTransfer": "false",
        "minOtherBankAccountsTransferLimit": "1",
        "maxOtherBankAccountsTransferLimit": "100000",
        "isInternationalAccountsTransfer": "false",
        "minInternationalAccountsTransferLimit": "1",
        "maxInternationalAccountsTransferLimit": "100000",
        "isSecurityQuestionConfigured": "false",
        "isBusinessOwner" : "false",
    };

    /**
     * Method to get the configuration of a particular key
     * @param {key} - configuration key
     * @returns {configurationValue} value of a particular configuration key
     * @throws {}
     */
    _getConfiguration = function (key) {
        var value = null;
        if (key) {
            if (userEntitlementsObject[key] !== undefined) {
                value = userEntitlementsObject[key];
            } else {
                value = configurationObject[key];
            }
        }
        return value;
    };

    /**
     * Update the key in userEntitlementsObject / configurationObject
     * @param {key} - Configuration key to be updated
     * @param {value} - value of the key 
     * @returns {}
     * @throws {}
     */
    _updateAppLevelConfigurationKey = function (key, value) {
        if (key) {
            if(configurationObject[key] !== undefined) {
                configurationObject[key] = value;
            } else {
                kony.print("Default App Configuration does not exist. So not possible to update");
            }
        } else {
            kony.print("Invalid Key");
        }
    };

    /**
     * Update the key in userEntitlementsObject
     * @param {key} - Configuration key to be updated
     * @param {value} - value of the key 
     * @returns {}
     * @throws {} 
     */
    _updateUserLevelConfigurationKey = function (key, value) {
        if (key) {
            if(userEntitlementsObject[key] !== undefined) {
                userEntitlementsObject[key] = value;
            } else {
                kony.print("Default User Configuration does not exist. So not possible to update");
            }
        } else {
            kony.print("Invalid Key");
        }
    };

    return {
        getConfiguration : _getConfiguration,
        updateAppLevelConfigurationKey : _updateAppLevelConfigurationKey,
        updateUserLevelConfigurationKey : _updateUserLevelConfigurationKey
    };
})();