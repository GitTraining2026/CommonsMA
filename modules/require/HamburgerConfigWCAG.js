/* eslint require-jsdoc: 0,
          olblint/enforce-i18n: 0,
          olblint/image-names: 0
*/
define(['FormControllerUtility', 'OLBConstants'], function(FormControllerUtility, OLBConstants) {
    var checkUserFeature = function(feature) {
        return applicationManager.getConfigurationManager().checkUserFeature(feature);
    }
    var checkAtLeastOneFeaturePresent = function(features) {
        return features.some(checkUserFeature);
    }
    var checkUserPermission = function(permission) {
        return applicationManager.getConfigurationManager().checkUserPermission(permission);
    }
    var checkAtLeastOnePermission = function(permissions) {
        return permissions.some(checkUserPermission);
    }
    var checkAllPermissions = function(permissions) {
        return permissions.every(checkUserPermission);
    }
    var configurationManager = applicationManager.getConfigurationManager();
    var alertsText = "${i18n{i18n.AlertsAndMessages.AlertsAndMessages}}";
    var billPayText = configurationManager.isFastTransferEnabled === "true" ? "${i18n{i18n.Pay.MyBills}}" : "${i18n{i18n.billPay.BillPay}}";
    var addRecipientFunction = "";
    var addRecipientParams = "";
    if ((checkUserPermission("DOMESTIC_WIRE_TRANSFER_CREATE_RECEPIENT") === true) || ((checkUserPermission("DOMESTIC_WIRE_TRANSFER_CREATE_RECEPIENT") === true) && (checkUserPermission("INTERNATIONAL_WIRE_TRANSFER_CREATE_RECEPIENT") === true))) {
        addRecipientFunction = "showWireTransferAddRecipientStep1";
        addRecipientParams = {
            landingPageView: "addRecipient"
        };
    } else if (checkUserPermission("INTERNATIONAL_WIRE_TRANSFER_CREATE_RECEPIENT") === true) {
        addRecipientFunction = "showWireTransferInternationalStep1";
        addRecipientParams = {
            landingPageView: "addRecipientInternational"
        };
    }
    var presenter = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
        "moduleName": "AccountsUIModule",
        "appName": "HomepageMA"
    });
    var accounts = presenter.presentationController.accounts;
    var accountStatementsParams = "";
    if (accounts !== null && accounts !== undefined && accounts.length > 0) {
        accountStatementsParams = accounts;
    } else {
        accountStatementsParams = "";
    }
    var widgetsMap = [
        // {
        //     "id": "Overview",
        //     "title": "${i18n{i18n.common.overview}}",
        //     "toolTip": "${i18n{i18n.common.overview}}",
      	// 	"fontIcon": "a",
		// 	"accessibilityConfig": {
        //     "a11yHidden": true,
        //     "a11yARIA": {
        //         "tabindex": -1
        //     }
		// 	},
		// 	"visibleInMAs": ["HOMEPAGE", "ACCAGGREGATION", "ARRANGEMENTS", "CARDS", "FINANCEMANAGEMENT"],
        //     "onClick": function() {
        //       	var accountsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "AccountsUIModule", "appName" : "HomepageMA"});
        //       	accountsModule.presentationController.showAccountsDashboard();
        //     },
        //     "subMenu": {
        //         children: []
        //     }
        // },
        {
        "id": "ACCOUNTS",
        "fontIcon": "a",
        "title": "${i18n{i18n.topmenu.accounts}}",
        "toolTip": "${i18n{i18n.topmenu.accounts}}",
        "accessibilityConfig": {
            "a11yHidden": true,
            "a11yARIA": {
                "tabindex": -1
            }
        },
        "visibleInMAs": ["HOMEPAGE", "ACCAGGREGATION", "ARRANGEMENTS", "CARDS", "FINANCEMANAGEMENT"],
        "subMenu": [{
            "id": "MY ACCOUNTS",
            "title": "${i18n{i18n.hamburger.myaccounts}}",
            "tooltip": "${i18n{i18n.hamburger.myaccounts}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["HOMEPAGE"],
            "callToAction": {
                "microApp": "HomepageMA",
                "moduleName": "AccountsUIModule",
                "presentationControllerMethod": "showAccountsDashboard"
            }
        }, {
            "id": "Stop Payment Requests",
            "title": "${i18n{i18n.olb.chequeManagement.chequeManagement}}",
            "tooltip": "${i18n{i18n.olb.chequeManagement.chequeManagement}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["ARRANGEMENTS"],
            "featureAndPermissions": [{
                "atLeastOneFeature": ["CHEQUE_BOOK_REQUEST", "STOP_PAYMENT_REQUEST", "VIEW_CHEQUES"]
            }],
            "callToAction": {
                "microApp": "ArrangementsMA",
                "moduleName": "StopPaymentsUIModule",
                "presentationControllerMethod": "showStopPayments"
            }
        }, {
            "id": "Open New Account",
            "title": "${i18n{i18n.WireTransfer.CreateNewAccount}}",
            "tooltip": "${i18n{i18n.WireTransfer.CreateNewAccount}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "userType": ["isSMEUser", "isMBUser"],
            "featureAndPermissions": [{
                "atLeastOneFeature": ["NAO"]
            }, ],
            "onClick": function () {
                let isFabricIntegratedOrigination = OLBConstants.CLIENT_PROPERTIES.IS_FABRIC_INTEGRATED_ORIGINATION;
                var configurationManager = applicationManager.getConfigurationManager();
                if (isFabricIntegratedOrigination && isFabricIntegratedOrigination.toLowerCase() == 'false') {
                    applicationManager.getAccountManager().openNewAccountActive = true;
                    var jmRedirectURL = configurationManager.getOnBoardingAppDirectionURL();
                    var ssoToken = JSON.parse(kony.sdk.util.getSSOToken());
                    kony.print("@@@ ssoToken ----->>> " + ssoToken);
                    var ssoVal = Object.values(ssoToken);
                    kony.print("@@@ ssoVal ---->>> " + ssoVal);
                    var tmpParams = "&ssoToken=" + ssoVal;
                    jmRedirectURL = jmRedirectURL + "" + tmpParams;
                    kony.print("jmRedirectURL" + jmRedirectURL);
                    if (jmRedirectURL) {
                        kony.application.openURLAsync({
                            url: jmRedirectURL,
                            isSameWindow: false
                        });
                    }
                } else {
                    var ssoConfig = configurationManager.getSSOConfig();
                    if (ssoConfig !== undefined && ssoConfig.toLowerCase() === "true") {
                        var reDirectionURL = configurationManager.getOnBoardingAppDirectionURL();
                        if (reDirectionURL) {
                            //    location.assign(reDirectionURL);
                            kony.application.openURLAsync({
                                url: reDirectionURL,
                                isSameWindow: false
                            });
                        } else {
                            // Parsing the service url present in appConfig
                            var protocol = appConfig.isturlbase.split("//")[0];
                            var origin = appConfig.isturlbase.split("//")[1].split("/")[0];
                            // Getting the current app name from appDetails
                            var appName = appDetails.appID;
                            // Redirecting to
                            // location.assign(protocol + "//" + origin + "/apps/" + configurationManager.getOnboardingAppID() + "#_frmLanding");
                            kony.application.openURLAsync({
                                url: protocol + "//" + origin + "/apps/" + configurationManager.getOnboardingAppID() + "#_frmLanding",
                                isSameWindow: false
                            });
                        }
                    } else if (ssoConfig.toLowerCase() === "false") {
                        //commenting this snippet as there is no NAO feature yet	
                        /* applicationManager.getNavigationManager().navigateTo("frmNAO");
                         this.presentNAO({
                           resetForm: {}
                         });
                         this.getProducts();
                         context = context || {
                           NUOLanding: "true"
                         }*/
                    }
                }
            },
        }, {
            "id": "Add External Bank Accounts",
            "title": "${i18n{i18n.Hamburger.AddExternalBankAccounts}}",
            "tooltip": "${i18n{i18n.Hamburger.AddExternalBankAccounts}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "userType": ["isRBUser", "isCombinedUser"],
            "configurationType": ["AggregatedExternalAccountEnabled"],
            "visibleInMAs": ["ACCAGGREGATION"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["MANAGE_EXTERNAL_ACCOUNT"]
            }],
            "callToAction": {
                "microApp": "AccAggregationMA",
                "moduleName": "ExternalAccountsUIModule",
                "presentationControllerMethod": "getBankListForCountry"
            }
        }, {
            "id": "Card Management",
            "title": "${i18n{i18n.hamburger.cardmanagement}}",
            "tooltip": "${i18n{i18n.hamburger.cardmanagement}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["CARDS"],
            "featureAndPermissions": [{
                "atLeastOneFeature": ["CARD_MANAGEMENT"]
            }],
            "callToAction": {
                "microApp": "CardsMA",
                "moduleName": "ManageCardsUIModule",
                "presentationControllerMethod": "navigateToManageCards"
            }
        }, {
            "id": "Disputed Transaction",
            "title": "${i18n{i18n.StopCheckPayments.DisputedTransactions}}",
            "tooltip": "${i18n{i18n.StopCheckPayments.DisputedTransactions}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["ARRANGEMENTS"],
            "featureAndPermissions": [{
                "atLeastOneFeature": ["DISPUTE_TRANSACTIONS"]
            }],
            "callToAction": {
                "microApp": "ArrangementsMA",
                "moduleName": "DisputeTransactionUIModule",
                "presentationControllerMethod": "showDisputeTransactionModule",
                "params": {
                    show: OLBConstants.ACTION.SHOW_DISPUTE_LIST
                }
            }
        }, 
        {
            "id": "Account Sweep",
            "title": "${i18n{i18n.accountsweeps.accountSweep}}",
            "tooltip": "${i18n{i18n.accountsweeps.accountSweep}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["ACCOUNTSWEEP"],
            "featureAndPermissions": [{
                "allReqPermissions": ["ACCOUNT_SWEEP_VIEW"]
            }],
            "callToAction": {
                "microApp": "AccountSweepsMA",
                "moduleName": "AccountSweepsUIModule",
                "presentationControllerMethod": "showSweepScreen",
                "params": {
                    context: "AcccountSweep"
                }
            }
        },        
        {
            "id": "PFM",
            "title": "${i18n{i18n.accounts.PersonalFinanceManagement}}",
            "tooltip": "${i18n{i18n.accounts.PersonalFinanceManagement}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["FINANCEMANAGEMENT"],
            "userType" : ["isRBUser","isCombinedUser"],
            "featureAndPermissions": [{
                "atLeastOneFeature": ["PERSONAL_FINANCE_MANAGEMENT"]
            }],
            "callToAction": {
                "microApp": "FinanceManagementMA",
                "moduleName": "PersonalFinanceManagementUIModule",
                "presentationControllerMethod": "initPFMForm"
            }
        }, {
            "id": "Account Statements",
            "title": "${i18n{i18n.hamburger.accountstatements}}",
            "tooltip": "${i18n{i18n.hamburger.accountstatements}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["ARRANGEMENTS"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["VIEW_COMBINED_STATEMENTS", "VIEW_ESTATEMENTS"]
            }],
            "callToAction": {
                "microApp": "ArrangementsMA",
                "moduleName": "AccountsUIModule",
                "presentationControllerMethod": "showFormatEstatements",
                "params": accountStatementsParams
            }
        }, {
            "id": "Service Requests",
            "title": "${i18n{i18n.accounts.ServiceRequest}}",
            "tooltip": "${i18n{i18n.accounts.ServiceRequest}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["ARRANGEMENTS"],
            "callToAction": {
                "microApp": "ArrangementsMA",
                "moduleName": "ServiceRequestsUIModule",
                "presentationControllerMethod": "initServiceRequests"
            }
        }]
    }, {
        "id": "TRANSFERS",
        "fontIcon": "t",
        "title": "${i18n{i18n.hamburger.transfers}}",
        "toolTip": "${i18n{i18n.hamburger.transfers}}",
        "accessibilityConfig": {
            "a11yLabel": "${i18n{i18n.hamburger.transfers}}"
        },
        "visibleInMAs": ["REGIONALTRANSFER"],
        "featureAndPermissions": [{
            "atLeastOneFeature": ["INTERNATIONAL_ACCOUNT_FUND_TRANSFER", "INTER_BANK_ACCOUNT_FUND_TRANSFER", "INTRA_BANK_FUND_TRANSFER", "TRANSFER_BETWEEN_OWN_ACCOUNT"]
        }],
        "subMenu": [{
            "id": "Transfer Money",
            "title": "${i18n{i18n.billPay.BillPayMakeTransfer}}",
            "tooltip": "${i18n{i18n.billPay.BillPayMakeTransfer}}",
            "accessibilityConfig": {
                "a11yLabel": "${i18n{i18n.billPay.BillPayMakeTransfer}}"
            },
            "visibleInMAs": ["REGIONALTRANSFER"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["TRANSFER_BETWEEN_OWN_ACCOUNT_CREATE", "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE", "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE", "INTRA_BANK_FUND_TRANSFER_CREATE"]
            }],
            "callToAction": {
                "microApp": "TransfersMA",
                "moduleName": "TransferModule",
                "presentationControllerMethod": "showTransferScreen"
            }
        }, {
            "id": "Transfer history",
            "title": "${i18n{i18n.hamburger.transferHistory}}",
            "tooltip": "${i18n{i18n.hamburger.transferHistory}}",
            "accessibilityConfig": {
                "a11yLabel": "${i18n{i18n.hamburger.transferHistory}}"
            },
            "visibleInMAs": ["REGIONALTRANSFER"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["INTERNATIONAL_ACCOUNT_FUND_TRANSFER_VIEW", "INTER_BANK_ACCOUNT_FUND_TRANSFER_VIEW", "INTRA_BANK_FUND_TRANSFER_VIEW", "TRANSFER_BETWEEN_OWN_ACCOUNT_VIEW"]
            }],
            "callToAction": {
                "microApp": "TransfersMA",
                "moduleName": "TransferModule",
                "presentationControllerMethod": "showTransferScreen",
                "params": {
                    initialView: "recent"
                }
            }
        }, {
            "id": "External Accounts",
            "title": "${i18n{i18n.hamburger.externalAccounts}}",
            "tooltip": "${i18n{i18n.hamburger.externalAccounts}}",
            "accessibilityConfig": {
                "a11yLabel": "${i18n{i18n.hamburger.externalAccounts}}"
            },
            "visibleInMAs": ["REGIONALTRANSFER"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["TRANSFER_BETWEEN_OWN_ACCOUNT_VIEW_RECEPIENT", "INTRA_BANK_FUND_TRANSFER_VIEW_RECEPIENT", "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_VIEW_RECEPIENT"]
            }],
            "callToAction": {
                "microApp": "TransfersMA",
                "moduleName": "TransferModule",
                "presentationControllerMethod": "showTransferScreen",
                "params": {
                    initialView: "externalAccounts"
                }
            }
        }, {
            "id": "Add Infinity Accounts",
            "title": "${i18n{i18n.hamburger.addKonyAccount}}",
            "tooltip": "${i18n{i18n.hamburger.addKonyAccount}}",
            "accessibilityConfig": {
                "a11yLabel": "${i18n{i18n.hamburger.addKonyAccount}}"
            },
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["INTRA_BANK_FUND_TRANSFER_CREATE_RECEPIENT"]
            }],
            "callToAction": {
                "microApp": "TransfersMA",
                "moduleName": "TransferModule",
                "presentationControllerMethod": "showTransferScreen",
                "params": {
                    initialView: "addInternalAccounts"
                }
            }
        }, {
            "id": "Add Non Kony Accounts",
            "title": "${i18n{i18n.hamburger.addNonKonyAccount}}",
            "tooltip": "${i18n{i18n.hamburger.addNonKonyAccount}}",
            "accessibilityConfig": {
                "a11yLabel": "${i18n{i18n.hamburger.addNonKonyAccount}}"
            },
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT", "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT"]
            }],
            "callToAction": {
                "microApp": "TransfersMA",
                "moduleName": "TransferModule",
                "presentationControllerMethod": "showTransferScreen",
                "params": {
                    initialView: 'addExternalAccounts'
                }
            }
        }]
    }, {
        "id": "FASTTRANSFERS",
        "fontIcon": "t",
        "title": "${i18n{i18n.hamburger.transfers}}",
        "toolTip": "${i18n{i18n.hamburger.transfers}}",
        "accessibilityConfig": {
            "a11yLabel": "${i18n{i18n.hamburger.transfers}}"
        },
        "visibleInMAs": ["REGIONALTRANSFER"],
        "featureAndPermissions": [{
            "atLeastOneFeature": ["INTERNATIONAL_ACCOUNT_FUND_TRANSFER", "INTER_BANK_ACCOUNT_FUND_TRANSFER", "INTRA_BANK_FUND_TRANSFER", "P2P", "TRANSFER_BETWEEN_OWN_ACCOUNT"]
        }],
        "subMenu": [{
            "id": "Transfer Money",
            "title": "${i18n{i18n.hamburger.transfer}}",
            "tooltip": "${i18n{i18n.hamburger.transfer}}",
            "accessibilityConfig": {
                "a11yLabel": "${i18n{i18n.hamburger.transfer}}"
            },
            "visibleInMAs": ["REGIONALTRANSFER"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["TRANSFER_BETWEEN_OWN_ACCOUNT_CREATE", "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE", "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE", "INTRA_BANK_FUND_TRANSFER_CREATE", "P2P_CREATE"]
            }],
            "callToAction": {
                "microApp": "TransfersMA",
                "moduleName": "TransferFastUIModule",
                "presentationControllerMethod": "showTransferScreen"
            }
        }, {
            "id": "Transfer history",
            "title": "${i18n{i18n.Transfers.TRANSFERACTIVITIES}}",
            "tooltip": "${i18n{i18n.Transfers.TRANSFERACTIVITIES}}",
            "accessibilityConfig": {
                "a11yLabel": "${i18n{i18n.Transfers.TRANSFERACTIVITIES}}"
            },
            "visibleInMAs": ["REGIONALTRANSFER"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["TRANSFER_BETWEEN_OWN_ACCOUNT_VIEW", "INTRA_BANK_FUND_TRANSFER_VIEW", "INTER_BANK_ACCOUNT_FUND_TRANSFER_VIEW", "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_VIEW", "P2P_VIEW"]
            }],
            "callToAction": {
                "microApp": "TransfersMA",
                "moduleName": "TransferFastUIModule",
                "presentationControllerMethod": "getPastPayments"
            }
        }, {
            "id": "External Accounts",
            "title": "${i18n{i18n.PayAPerson.ManageRecipient}}",
            "tooltip": "${i18n{i18n.PayAPerson.ManageRecipient}}",
            "accessibilityConfig": {
                "a11yLabel": "${i18n{i18n.PayAPerson.ManageRecipient}}"
            },
            "visibleInMAs": ["REGIONALTRANSFER"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["INTER_BANK_ACCOUNT_FUND_TRANSFER_VIEW_RECEPIENT", "INTRA_BANK_ACCOUNT_FUND_TRANSFER_VIEW_RECEPIENT", "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_VIEW_RECEPIENT", "P2P_VIEW_RECEPIENT"]
            }],
            "callToAction": {
                "microApp": "TransfersMA",
                "moduleName": "TransferFastUIModule",
                "presentationControllerMethod": "showTransferScreen",
                "params": {
                    showManageRecipients: true
                }
            }
        }, {
            "id": "Add Infinity Accounts",
            "title": "${i18n{i18n.PayAPerson.AddRecipient}}",
            "tooltip": "${i18n{i18n.PayAPerson.AddRecipient}}",
            "accessibilityConfig": {
                "a11yLabel": "${i18n{i18n.PayAPerson.AddRecipient}}"
            },
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT", "INTRA_BANK_FUND_TRANSFER_CREATE_RECEPIENT", "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT", "P2P_CREATE_RECEPIENT"]
            }],
            "callToAction": {
                "microApp": "TransfersMA",
                "moduleName": "TransferFastUIModule",
                "presentationControllerMethod": "showTransferScreen",
                "params": {
                    showRecipientGateway: true
                }
            }
        }]
    }, {
        "id": "EUROTRANSFERS",
        "fontIcon": "t",
        "title": "${i18n{i18n.TransfersEur.PaymentsAndTransfers}}",
        "toolTip": "${i18n{i18n.TransfersEur.PaymentsAndTransfers}}",
        "accessibilityConfig": {
            "a11yHidden": true,
            "a11yARIA": {
                "tabindex": -1
            }
        },
        "visibleInMAs": ["REGIONALTRANSFER", "UNIFIEDTRANSFER"],
        "featureAndPermissions": [{
            "atLeastOneFeature": ["INTERNATIONAL_ACCOUNT_FUND_TRANSFER", "INTER_BANK_ACCOUNT_FUND_TRANSFER", "INTRA_BANK_FUND_TRANSFER", "TRANSFER_BETWEEN_OWN_ACCOUNT"]
        }],
        "subMenu": [{
            "id": "Make a Payment",
            "title": "${i18n{i18n.TransfersEur.MakePayment}}",
            "tooltip": "${i18n{i18n.TransfersEur.MakePayment}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["REGIONALTRANSFER"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE", "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE", "INTRA_BANK_FUND_TRANSFER_CREATE"]
            }],
            "callToAction": {
                "microApp": "TransfersMA",
                "moduleName": "TransferEurUIModule",
                "presentationControllerMethod": "showTransferScreen",
                "params": {
                    context: "MakePayment"
                }
            }
        }, {
            "id": "Transfer Between Accounts",
            "title": "${i18n{i18n.TransfersEur.TransferBetweenAccounts}}",
            "tooltip": "${i18n{i18n.TransfersEur.TransferBetweenAccounts}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["REGIONALTRANSFER"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["TRANSFER_BETWEEN_OWN_ACCOUNT_CREATE"]
            }],
            "callToAction": {
                "microApp": "TransfersMA",
                "moduleName": "TransferEurUIModule",
                "presentationControllerMethod": "showTransferScreen",
                "params": {
                    context: "MakePaymentOwnAccounts"
                }
            }
        }, {
            "id": "Manage Beneficiaries",
            "title": "${i18n{i18n.TransfersEur.ManageBeneficiaries}}",
            "tooltip": "${i18n{i18n.TransfersEur.ManageBeneficiaries}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["UNIFIEDTRANSFER"],
            "callToAction": {
                "microApp": "TransfersMA",
                "moduleName": "ManageActivitiesUIModule",
                "presentationControllerMethod": "showTransferScreen",
                "params": {
                    context: "ManageBeneficiaries"
                }
            }
        }, {
            "id": "Manage Payments",
            "title": "${i18n{i18n.TransfersEur.ManageTransactions}}",
            "tooltip": "${i18n{i18n.TransfersEur.ManageTransactions}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["UNIFIEDTRANSFER"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["INTERNATIONAL_ACCOUNT_FUND_TRANSFER_VIEW", "INTER_BANK_ACCOUNT_FUND_TRANSFER_VIEW", "INTRA_BANK_FUND_TRANSFER_VIEW", "TRANSFER_BETWEEN_OWN_ACCOUNT_VIEW"]
            }],
            "callToAction": {
                "microApp": "TransfersMA",
                "moduleName": "ManageActivitiesUIModule",
                "presentationControllerMethod": "showTransferScreen",
                "params": {
                    context: "PastPayments"
                }
            }
        }]
    }, {
        "id": "UNIFIEDTRANSFER",
        "fontIcon": "&",
        "title": "${i18n{i18n.UnifiedTransfer.HamburgerMenuTitle}}",
        "toolTip": "${i18n{i18n.UnifiedTransfer.HamburgerMenuTitle}}",
        "accessibilityConfig": {
            "a11yHidden": true,
            "a11yARIA": {
                "tabindex": -1
            }
        },
        "visibleInMAs": ["UNIFIEDTRANSFER"],
        "featureAndPermissions": [{
            "allReqPermissions": ["UNIFIED_TRANSFER_CREATE"],
            "atLeastOneReqPermissions": ["INTRA_BANK_FUND_TRANSFER_CREATE", "TRANSFER_BETWEEN_OWN_ACCOUNT_CREATE", "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE", "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE", "P2P_CREATE", "INTRA_BANK_FUND_TRANSFER_CREATE_RECEPIENT", "TRANSFER_BETWEEN_OWN_ACCOUNT_CREATE_RECEPIENT", "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT", "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT", "P2P_CREATE_RECEPIENT"],
            "atLeastOneFeature": ["UNIFIED_TRANSFER"]
        }],
        "onClick": function() {
            var navMan = applicationManager.getNavigationManager();
            var configManager = applicationManager.getConfigurationManager();
            var data = applicationManager.getUserPreferencesManager().getUserObj();
            navMan.navigateTo({
                "appName": "TransfersMA",
                "friendlyName": "frmUTFLanding"
            }, false, data);
        },
    }, {
        "id": "Bill Pay",
        "fontIcon": "B",
        "title": billPayText,
        "toolTip": billPayText,
        "accessibilityConfig": {
            "a11yHidden": true,
            "a11yARIA": {
                "tabindex": -1
            }
        },
        "visibleInMAs": ["BILLPAY"],
        "featureAndPermissions": [{
            "atLeastOneFeature": ["BILL_PAY"]
        }],
        "subMenu": [{
            "id": "Pay a Bill",
            "title": "${i18n{i18n.hamburger.payABill}}",
            "tooltip": "${i18n{i18n.hamburger.payABill}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["BILLPAY"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["BILL_PAY_CREATE"]
            }],
            "onClick": function() {
                var billPayModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                    "appName": "BillPayMA",
                    "moduleName": "BillPaymentUIModule"
                });
                if (checkUserPermission("BILL_PAY_BULK")) billPayModule.presentationController.showBillPaymentScreen({
                    context: "BulkPayees",
                    loadBills: true
                });
                else billPayModule.presentationController.showBillPaymentScreen({
                    context: "MakeOneTimePayment"
                });
            },
        }, {
            "id": "Bill Pay History",
            "title": "${i18n{i18n.hamburger.billPayHistory}}",
            "tooltip": "${i18n{i18n.hamburger.billPayHistory}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["BILLPAY"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["BILL_PAY_CREATE", "BILL_PAY_VIEW_PAYEES"]
            }],
            "callToAction": {
                "microApp": "BillPayMA",
                "moduleName": "BillPaymentUIModule",
                "presentationControllerMethod": "showBillPaymentScreen",
                "params": {
                    context: "History",
                    loadBills: true
                }
            }
        }, {
            "id": "My Payee List",
            "title": "${i18n{i18n.hamburger.myPayeeList}}",
            "tooltip": "${i18n{i18n.hamburger.myPayeeList}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["BILLPAY"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["BILL_PAY_VIEW_PAYEES"]
            }],
            "callToAction": {
                "microApp": "BillPayMA",
                "moduleName": "BillPaymentUIModule",
                "presentationControllerMethod": "showBillPaymentScreen",
                "params": {
                    context: "ManagePayees",
                    loadBills: true
                }
            }
        }, {
            "id": "Add Payee",
            "title": "${i18n{i18n.billPay.addPayee}}",
            "tooltip": "${i18n{i18n.billPay.addPayee}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["BILLPAY"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["BILL_PAY_CREATE_PAYEES"]
            }],
            "callToAction": {
                "microApp": "BillPayMA",
                "moduleName": "BillPaymentUIModule",
                "presentationControllerMethod": "showBillPaymentScreen",
                "params": {
                    context: "AddPayee"
                }
            }
        }, {
            "id": "Make One Time Payment",
            "title": "${i18n{i18n.BillPay.MAKEONETIMEPAYMENT}}",
            "tooltip": "${i18n{i18n.BillPay.MAKEONETIMEPAYMENT}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["BILLPAY"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["BILL_PAY_CREATE"]
            }],
            "callToAction": {
                "microApp": "BillPayMA",
                "moduleName": "BillPaymentUIModule",
                "presentationControllerMethod": "showBillPaymentScreen",
                "params": {
                    context: "MakeOneTimePayment"
                }
            }
        }]
    }, {
        "id": "ACH",
        "fontIcon": "$",
        "title": "${i18n{i18n.konybb.ACH.ACH}}",
        "toolTip": "${i18n{i18n.konybb.ACH.ACH}}",
        "accessibilityConfig": {
            "a11yHidden": true,
            "a11yARIA": {
                "tabindex": -1
            }
        },
        "visibleInMAs": ["ACH"],
        "featureAndPermissions": [{
            "atLeastOneFeature": ["ACH_COLLECTION", "ACH_PAYMENT", "ACH_FILES"]
        }],
        "subMenu": [{
            "id": "Create a Template",
            "title": "${i18n{i18n.konybb.common.createATemplate}}",
            "tooltip": "${i18n{i18n.konybb.common.createATemplate}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "breakpoints": [
                1024,
            ],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["ACH_COLLECTION_CREATE_TEMPLATE"],
                "atLeastOneFeature": ["ACH_COLLECTION"]
            }, {
                "atLeastOneReqPermissions": ["ACH_PAYMENT_CREATE_TEMPLATE"],
                "atLeastOneFeature": ["ACH_PAYMENT"]
            }],
            "callToAction": {
                "microApp": "ACHMA",
                "moduleName": "ACHUIModule",
                "presentationControllerMethod": "noServiceNavigate",
                "params": {
                    "requestData": null,
                    "onSuccess": {
                        "form": "frmACHDashboard",
                        "module": "ACHUIModule",
                        "appName": "ACHMA",
                        "context": {
                            "key": BBConstants.CREATE_ACH_TEMPLATES,
                            "responseData": null
                        }
                    },
                    "onFailure": {
                        "form": "AuthUIModule/frmLogin",
                        "module": "AuthUIModule",
                        "appName": "AuthenticationMA",
                        "context": {
                            "key": BBConstants.LOG_OUT,
                            "responseData": null
                        }
                    }
                }
            }
        }, {
            "id": "Make Payment With Template",
            "title": "${i18n{i18n.konybb.ACH.MakePaymentWithTemplate}}",
            "tooltip": "${i18n{i18n.konybb.ACH.MakePaymentWithTemplate}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "breakpoints": [
                1024,
                1366,
                1380
            ],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": applicationManager.getConfigurationManager().getViewACHTemplatePermissionsList()
            }, {
                "atLeastOneReqPermissions": applicationManager.getConfigurationManager().getCreateACHTransactionPermissionsList()
            }],
            "callToAction": {
                "microApp": "ACHMA",
                "moduleName": "ACHUIModule",
                "presentationControllerMethod": "noServiceNavigate",
                "params": {
                    "requestData": null,
                    "onSuccess": {
                        "form": "frmACHDashboard",
                        "module": "ACHUIModule",
                        "appName": "ACHMA",
                        "context": {
                            "key": BBConstants.CREATE_ACH_TEMPLATES_TAB,
                            "responseData": null
                        }
                    },
                    "onFailure": {
                        "form": "AuthUIModule/frmLogin",
                        "module": "AuthUIModule",
                        "appName": "AuthenticationMA",
                        "context": {
                            "key": BBConstants.LOG_OUT,
                            "responseData": null
                        }
                    }
                }
            }
        }, {
            "id": "Make One Time Payment",
            "title": "${i18n{i18n.konybb.ACH.MakeOneTimePayment}}",
            "tooltip": "${i18n{i18n.konybb.ACH.MakeOneTimePayment}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "breakpoints": [
                1024,
                1366,
                1380
            ],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": applicationManager.getConfigurationManager().getCreateACHTransactionPermissionsList()
            }],
            "callToAction": {
                "microApp": "ACHMA",
                "moduleName": "ACHUIModule",
                "presentationControllerMethod": "noServiceNavigate",
                "params": {
                    "requestData": null,
                    "onSuccess": {
                        "form": "frmACHDashboard",
                        "module": "ACHUIModule",
                        "appName": "ACHMA",
                        "context": {
                            "key": BBConstants.TRANSACTION_WITHOUT_TEMPLATE,
                            "responseData": null
                        }
                    },
                    "onFailure": {
                        "form": "AuthUIModule/frmLogin",
                        "module": "AuthUIModule",
                        "appName": "AuthenticationMA",
                        "context": {
                            "key": BBConstants.LOG_OUT,
                            "responseData": null
                        }
                    }
                }
            }
        }, {
            "id": "ACH History",
            "title": "${i18n{i18n.konybb.ACH.ACHHistory}}",
            "tooltip": "${i18n{i18n.konybb.ACH.ACHHistory}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "breakpoints": [
                1024,
                1366,
                1380
            ],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": applicationManager.getConfigurationManager().getViewACHTransactionPermissionsList()
            }],
            "callToAction": {
                "microApp": "ACHMA",
                "moduleName": "ACHUIModule",
                "presentationControllerMethod": "noServiceNavigate",
                "params": {
                    "requestData": null,
                    "onSuccess": {
                        "form": "frmACHDashboard",
                        "module": "ACHUIModule",
                        "appName": "ACHMA",
                        "context": {
                            "key": BBConstants.SHOW_ACH_TRANSACTIONS_TAB,
                            "responseData": null
                        }
                    },
                    "onFailure": {
                        "form": "AuthUIModule/frmLogin",
                        "module": "AuthUIModule",
                        "appName": "AuthenticationMA",
                        "context": {
                            "key": BBConstants.LOG_OUT,
                            "responseData": null
                        }
                    }
                }
            }
        }, {
            "id": "Files",
            "title": "${i18n{i18n.konybb.hamburger.ACHFiles}}",
            "tooltip": "${i18n{i18n.konybb.hamburger.ACHFiles}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "breakpoints": [
                1024,
                1366,
                1380
            ],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": applicationManager.getConfigurationManager().getViewACHFilePermissionsList()
            }],
            "callToAction": {
                "microApp": "ACHMA",
                "moduleName": "ACHUIModule",
                "presentationControllerMethod": "noServiceNavigate",
                "params": {
                    "requestData": null,
                    "onSuccess": {
                        "form": "frmACHDashboard",
                        "module": "ACHUIModule",
                        "appName": "ACHMA",
                        "context": {
                            "key": BBConstants.SHOW_ACH_FILES_TAB,
                            "responseData": null
                        }
                    },
                    "onFailure": {
                        "form": "AuthUIModule/frmLogin",
                        "module": "AuthUIModule",
                        "appName": "AuthenticationMA",
                        "context": {
                            "key": BBConstants.LOG_OUT,
                            "responseData": null
                        }
                    }
                }
            }
        }]
    }, {
        "id": "SmartBankingAdvisory",
        "fontIcon": "|",
        "title": "${i18n{i18n.SBAdvisory.smartBankingAdvisor}}",
        "toolTip": "${i18n{i18n.SBAdvisory.smartBankingAdvisor}}",
        "accessibilityConfig": {
            "a11yHidden": true,
            "a11yARIA": {
                "tabindex": -1
            }
        },
        "visibleInMAs": ["SMARTBANKINGADVISORY"],
        "featureAndPermissions": [{
            "atLeastOneFeature": ["SBA_XAI_DASHBOARD", "SBA_AID"]
        }],
        "subMenu": [{
            "id": "Enrol",
            "title": "${i18n{i18n.SBAdvisory.enrol}}",
            "tooltip": "${i18n{i18n.SBAdvisory.enrol}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["SMARTBANKINGADVISORY"],
            "featureAndPermissions": [{
                "atLeastOneFeature": ["SBA_XAI_DASHBOARD"]
            }],
            "onClick": function () {
                applicationManager.getModulesPresentationController({ appName: 'SBAdvisoryMA', moduleName: 'EnrolmentModule' }).navigateToScreens('SBAInfo');
            }
        },
        {
            "id": "CashFlow",
            "title": "${i18n{i18n.SBAdvisory.cashFlowAndPrediction}}",
            "tooltip": "${i18n{i18n.SBAdvisory.cashFlowAndPrediction}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["SMARTBANKINGADVISORY"],
            "featureAndPermissions": [{
                "atLeastOneFeature": ["SBA_XAI_DASHBOARD"],
                "atLeastOneReqPermissions": ["CASHFLOW_PREDICTION_CHART_VIEW"]
            }],
            "onClick": function () {
                applicationManager.getModulesPresentationController({ appName: 'SBAdvisoryMA', moduleName: 'EnrolmentModule' }).navigateToScreens('SBAStimulation');
            }
            },
            {
                "id": "AccountsReceivable",
                "title": "${i18n{i18n.SBAdvisory.accountsReceivable}}",
                "tooltip": "${i18n{i18n.SBAdvisory.accountsReceivable}}",
                "accessibilityConfig": {
                    "a11yARIA": {
                        "tabindex": -1
                    }
                },
                "visibleInMAs": ["SMARTBANKINGADVISORY"],
                "featureAndPermissions": [{
                    "atLeastOneFeature": ["SBA_AID"],
                    "atLeastOneReqPermissions": ["SBA_RECEVIABLES_VIEW"]
                }],
                "onClick": function () {
                    applicationManager.getModulesPresentationController({
                        appName: 'SBAdvisoryMA',
                        moduleName: 'AcIntelligenceDashboardUIModule'
                    }).navigateToScreens('SBAReceivablePayableSummary', { id: "Receivable" });

                }
            }, {
                "id": "AccountsPayable",
                "title": "${i18n{i18n.SBAdvisory.accountsPayable}}",
                "tooltip": "${i18n{i18n.SBAdvisory.accountsPayable}}",
                "accessibilityConfig": {
                    "a11yARIA": {
                        "tabindex": -1
                    }
                },
                "visibleInMAs": ["SMARTBANKINGADVISORY"],
                "featureAndPermissions": [{
                    "atLeastOneFeature": ["SBA_AID"],
                    "atLeastOneReqPermissions": ["SBA_PAYABLES_VIEW"]
                }],
                "onClick": function() {
                    applicationManager.getModulesPresentationController({
                        appName: 'SBAdvisoryMA',
                        moduleName: 'AcIntelligenceDashboardUIModule'
                    }).navigateToScreens('SBAReceivablePayableSummary', {
                        id: "Payable"
                    });
                }
            }
        ]
    }, {
        "id": "TradeFinance",
        "fontIcon": "B",
        "title": "${i18n{i18n.TradeFinance.TradeFinanceHamburger}}",
        "toolTip": "${i18n{i18n.TradeFinance.TradeFinanceHamburger}}",
        "accessibilityConfig": {
            "a11yHidden": true,
            "a11yARIA": {
                "tabindex": -1
            }
        },
        "visibleInMAs": ["TRADEFINANCE"],
        "featureAndPermissions": [{
            "atLeastOneReqPermissions": ["IMPORT_LC_VIEW", "EXPORT_LC_VIEW", "LC_GUARANTEES_VIEW", "RECEIVED_GUARANTEES_VIEW"]
        }],
        "subMenu": [{
            "id": "Overview",
    		"title": "${i18n{i18n.common.overview}}",
    		"tooltip": "${i18n{i18n.common.overview}}",
    		"accessibilityConfig": {
        		"a11yARIA": {
            		"tabindex": -1
       		 	}
    		},
    		"visibleInMAs": ["TRADEFINANCE"],
    		"featureAndPermissions": [{}],
   			 "onClick": function() {
        		applicationManager.getModulesPresentationController({ appName: 'TradeFinanceMA', moduleName: 'DashboardUIModule' }).showDashboardScreen({ context: 'showDashboard' });
   			}
        }, {
            "id": "Imports",
            "title": "${i18n{i18n.TradeFinance.Imports}}",
            "tooltip": "${i18n{i18n.TradeFinance.Imports}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["TRADEFINANCE"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["IMPORT_LC_VIEW"]
            }],
            "onClick": function() {
                var navMan = applicationManager.getNavigationManager();
                var configManager = applicationManager.getConfigurationManager();
                var data = applicationManager.getUserPreferencesManager().getUserObj();
                navMan.navigateTo({
                    "appName": "TradeFinanceMA",
                    "friendlyName": "ImportLCUIModule/frmImportLCDashboard"
                }, false, data);
            }
        }, {
            "id": "Exports",
            "title": "${i18n{i18n.TradeFinance.Exports}}",
            "tooltip": "${i18n{i18n.TradeFinance.Exports}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["TRADEFINANCE"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["EXPORT_LC_VIEW"]
            }],
            "onClick": function() {
                var navMan = applicationManager.getNavigationManager();
                var configManager = applicationManager.getConfigurationManager();
                navMan.navigateTo({
                    "appName": "TradeFinanceMA",
                    "friendlyName": "ExportLCUIModule/frmExportLCDashboard"
                }, false, {
                    flowType: 'GetAllExportLettersOfCredit'
                });
            }
        }, {
            "id": "Guarantees",
            "title": "${i18n{i18n.TradeFinance.issuedGuaranteeAndStandbyLC}}",
            "tooltip": "${i18n{i18n.TradeFinance.issuedGuaranteeAndStandbyLC}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["TRADEFINANCE"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["LC_GUARANTEES_VIEW"]
            }],
            "onClick": function() {
                var navMan = applicationManager.getNavigationManager();
                var configManager = applicationManager.getConfigurationManager();
                var data = applicationManager.getUserPreferencesManager().getUserObj();
                navMan.navigateTo({
                    "appName": "TradeFinanceMA",
                    "friendlyName": "GuaranteesUIModule/frmGuaranteesLCDashboard"
                }, false, data);
            }
        }, {
            "id": "GuaranteesReceived",
            "title": "${i18n{i18n.TradeFinance.ReceivedGuaranteesStandbyLC}}",
            "tooltip": "${i18n{i18n.TradeFinance.ReceivedGuaranteesStandbyLC}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["TRADEFINANCE"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["RECEIVED_GUARANTEES_VIEW"]
            }],
            "onClick": function() {
                var navMan = applicationManager.getNavigationManager();
                var configManager = applicationManager.getConfigurationManager();
                var data = applicationManager.getUserPreferencesManager().getUserObj();
                navMan.navigateTo({
                    "appName": "TradeFinanceMA",
                    "friendlyName": "GuaranteesReceivedUIModule/frmGuaranteesReceivedDashboard"
                }, false, data);
            }
        }, {
            "id": "InwardCollections",
            "title": "${i18n{i18n.TradeFinance.inwardCollections}}",
            "tooltip": "${i18n{i18n.TradeFinance.inwardCollections}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["TRADEFINANCE"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["INWARD_COLLECTIONS_VIEW"]
            }],
            "onClick": function() {
                var navMan = applicationManager.getNavigationManager();
                var configManager = applicationManager.getConfigurationManager();
                var data = applicationManager.getUserPreferencesManager().getUserObj();
                navMan.navigateTo({
                    "appName": "TradeFinanceMA",
                    "friendlyName": "InwardCollectionsUIModule/frmInwardCollectionsDashboardNew"
                }, false, data);
            }
        }, {
            "id": "OutwardCollections",
            "title": "${i18n{i18n.TradeFinance.outwardCollections}}",
            "tooltip": "${i18n{i18n.TradeFinance.outwardCollections}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["TRADEFINANCE"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["OUTWARD_COLLECTIONS_VIEW"]
            }],
            "onClick": function() {
                var navMan = applicationManager.getNavigationManager();
                var configManager = applicationManager.getConfigurationManager();
                var data = applicationManager.getUserPreferencesManager().getUserObj();
                navMan.navigateTo({
                    "appName": "TradeFinanceMA",
                    "friendlyName": "OutwardCollectionsUIModule/frmOutwardCollectionDashboard"
                }, false, data);
            }
        }]
    }, {
        "id": "SupplyChainFinance",
        "fontIcon": "}",
        "title": "${i18n{i18n.TradeSupplyFinance.supplyChainFinance}}",
        "toolTip": "${i18n{i18n.TradeSupplyFinance.supplyChainFinance}}",
        "accessibilityConfig": {
            "a11yHidden": true,
            "a11yARIA": {
                "tabindex": -1
            }
        },
        "visibleInMAs": ["TRADESUPPLYFINANCE"],
        "featureAndPermissions": [{
            "atLeastOneFeature": ["SCF_Anchor_Dashboard","SCF_Counterparty_Dashboard"]
        }],
        "subMenu": [{
            "id": "Anchor",
            "title": "${i18n{i18n.TradeSupplyFinance.anchorDashboard}}",
            "tooltip": "${i18n{i18n.TradeSupplyFinance.anchorDashboard}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["TRADESUPPLYFINANCE"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["SCF_Anchor_Dashboard_View"]
            }],
            "onClick": function () {
                applicationManager.getModulesPresentationController({ appName: 'TradeSupplyFinMA', moduleName: 'AnchorUIModule' }).loadScreenWithContext({ context: 'anchorDashboard' });
            }
        }, {
            "id": "CounterParty",
            "title": "${i18n{i18n.TradeSupplyFinance.counterpartyDashboard}}",
            "tooltip": "${i18n{i18n.TradeSupplyFinance.counterpartyDashboard}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["TRADESUPPLYFINANCE"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["SCF_Counterparty_Dashboard_View"]
            }],
            "onClick": function () {
                applicationManager.getModulesPresentationController({ appName: 'TradeSupplyFinMA', moduleName: 'CounterPartyUIModule' }).loadScreenWithContext({ context: 'counterPartyDashboard' });
            }
        }]
    }, {
        "id": "TradeLendingDashboard",
        "fontIcon": "U",
        "fontIconSkin": "sknLblFontTypeTradeFinance",
        "title": "${i18n{i18n.TradeLending.lendingDashboard}}",
        "toolTip": "${i18n{i18n.TradeLending.lendingDashboard}}",
        "accessibilityConfig": {
            "a11yHidden": true,
            "a11yARIA": {
                "tabindex": -1
            }
        },
        "visibleInMAs": ["TRADELENDING"],
        "featureAndPermissions": [{
            "atLeastOneFeature": ["Lending_Dashboard"]
        }],
        "onClick": function() {
            applicationManager.getModulesPresentationController({ 'appName': 'TradeLendingMA', 'moduleName': 'LendingDashboardUIModule' }).loadScreenWithContext({ 'context': 'lendingDashboard' });
        },
    }, {
        "id": "CashManagement",
        "fontIcon": "U",
        "fontIconSkin": "sknLblFontTypeTradeFinance",
        "title": "${i18n{i18n.CashManagement.cashManagementHamburger}}",
        "toolTip": "${i18n{i18n.CashManagement.cashManagementHamburger}}",
        "accessibilityConfig": {
            "a11yHidden": true,
            "a11yARIA": {
                "tabindex": -1
            }
        },
        "visibleInMAs": ["CASHMANAGEMENT"],
        "featureAndPermissions": [{
            "atLeastOneFeature": ["Cash_Management_Cash_Pooling_Dashboard"]
        }],
        "subMenu": [{
            "id": "CashPoolingDashboard",
            "title": "${i18n{i18n.CashManagement.cashPoolingDashboard}}",
            "tooltip": "${i18n{i18n.CashManagement.cashPoolingDashboard}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["CASHMANAGEMENT"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["Cash_Pooling_Dashboard_View"]
            }],
            "onClick": function () {
                applicationManager.getModulesPresentationController({ appName: 'CashManagementMA', moduleName: 'CashManagementUIModule' }).loadScreenWithContext({ context: 'cashManagement' });
            }
        }]
    }, {
        "id": "Bulk Payments",
        "fontIcon": "#",
        "title": "${i18n{i18n.kony.BulkPayments.bulkPaymentHeader}}",
        "toolTip": "${i18n{i18n.kony.BulkPayments.bulkPaymentHeader}}",
        "accessibilityConfig": {
            "a11yHidden": true,
            "a11yARIA": {
                "tabindex": -1
            }
        },
        "breakpoints": [
            1024,
            1366,
            1380
        ],
        "visibleInMAs": ["BULKPAYMENTS"],
        "featureAndPermissions": [{
            "atLeastOneReqPermissions": configurationManager.getBulkPaymentFeaturePermissionsList(),
        }],
        "subMenu": [{
            "id": "Upload Status",
            "title": "${i18n{i18n.kony.BulkPayments.viewUploadedfiles}}",
            "tooltip": "${i18n{i18n.kony.BulkPayments.viewUploadedfiles}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["BULKPAYMENTS"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": configurationManager.getBulkPaymentFilesViewPermissionsList(),
            }],
            "callToAction": {
                "microApp": "BulkPaymentsMA",
                "moduleName": "BulkPaymentsUIModule",
                "presentationControllerMethod": "noServiceNavigateTemp",
                "params": {
                    "requestData": null,
                    "onSuccess": {
                        "form": "frmBulkPaymentsDashboard",
                        "module": "BulkPaymentsUIModule",
                        "appName": "BulkPaymentsMA",
                        "context": {
                            "key": kony.i18n.getLocalizedString("i18n.kony.BulkPayments.viewUploadedfiles"),
                            "responseData": null
                        }
                    },
                    "onFailure": {
                        "form": "AuthUIModule/frmLogin",
                        "module": "AuthUIModule",
                        "appName": "AuthenticationMA",
                        "context": {
                            "key": BBConstants.LOG_OUT,
                            "responseData": null
                        }
                    }
                }
            }
        }, {
            "id": "Review & Submit",
            "title": "${i18n{i18n.kony.BulkPayments.PaymentsStatus}}",
            "tooltip": "${i18n{i18n.kony.BulkPayments.PaymentsStatus}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["BULKPAYMENTS"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": configurationManager.getBulkPaymentRequestViewPermissionsList(),
            }],
            "callToAction": {
                "microApp": "BulkPaymentsMA",
                "moduleName": "BulkPaymentsUIModule",
                "presentationControllerMethod": "noServiceNavigateTemp",
                "params": {
                    "requestData": null,
                    "onSuccess": {
                        "form": "frmBulkPaymentsDashboard",
                        "module": "BulkPaymentsUIModule",
                        "appName": "BulkPaymentsMA",
                        "context": {
                            "key": kony.i18n.getLocalizedString("i18n.kony.BulkPayments.ViewRequests"),
                            "responseData": null
                        }
                    },
                    "onFailure": {
                        "form": "AuthUIModule/frmLogin",
                        "module": "AuthUIModule",
                        "appName": "AuthenticationMA",
                        "context": {
                            "key": BBConstants.LOG_OUT,
                            "responseData": null
                        }
                    }
                }
            }
        }, {
            "id": "Processed Requests",
            "title": "${i18n{i18n.kony.BulkPayments.paymentHistory}}",
            "tooltip": "${i18n{i18n.kony.BulkPayments.paymentHistory}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["BULKPAYMENTS"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": configurationManager.getBulkPaymentRequestViewPermissionsList(),
            }],
            "callToAction": {
                "microApp": "BulkPaymentsMA",
                "moduleName": "BulkPaymentsUIModule",
                "presentationControllerMethod": "noServiceNavigateTemp",
                "params": {
                    "requestData": null,
                    "onSuccess": {
                        "form": "frmBulkPaymentsDashboard",
                        "module": "BulkPaymentsUIModule",
                        "appName": "BulkPaymentsMA",
                        "context": {
                            "key": kony.i18n.getLocalizedString("i18n.kony.BulkPayments.viewHistory"),
                            "responseData": null
                        }
                    },
                    "onFailure": {
                        "form": "AuthUIModule/frmLogin",
                        "module": "AuthUIModule",
                        "appName": "AuthenticationMA",
                        "context": {
                            "key": BBConstants.LOG_OUT,
                            "responseData": null
                        }
                    }
                }
            }
        }, {
            "id": "Templates",
            "title": "${i18n{i18n.kony.BulkPayments.viewTemplates}}",
            "tooltip": "${i18n{i18n.kony.BulkPayments.viewTemplates}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["BULKPAYMENTS"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": configurationManager.getBulkPaymentTemplateViewPermissionsList(),
            }],
            "callToAction": {
                "microApp": "BulkPaymentsMA",
                "moduleName": "BulkPaymentsUIModule",
                "presentationControllerMethod": "noServiceNavigateTemp",
                "params": {
                    "requestData": null,
                    "onSuccess": {
                        "form": "frmBulkPaymentsDashboard",
                        "module": "BulkPaymentsUIModule",
                        "appName": "BulkPaymentsMA",
                        "context": {
                            "key": BBConstants.BULKPAYMENT_VIEW_TEMPLATES,
                            "responseData": null
                        }
                    },
                    "onFailure": {
                        "form": "AuthUIModule/frmLogin",
                        "module": "AuthUIModule",
                        "appName": "AuthenticationMA",
                        "context": {
                            "key": BBConstants.LOG_OUT,
                            "responseData": null
                        }
                    }
                }
            }
        }, {
            "id": "Upload File",
            "title": "${i18n{i18n.kony.BulkPayments.uploadFileAndMakeBulkPayments}}",
            "tooltip": "${i18n{i18n.kony.BulkPayments.uploadFileAndMakeBulkPayments}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["BULKPAYMENTS"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": configurationManager.getBulkPaymentFileUploadPermissionsList(),
            }],
            "callToAction": {
                "microApp": "BulkPaymentsMA",
                "moduleName": "BulkPaymentsUIModule",
                "presentationControllerMethod": "noServiceNavigateTemp",
                "params": {
                    "requestData": null,
                    "onSuccess": {
                        "form": "frmBulkPaymentsUploadFile",
                        "module": "BulkPaymentsUIModule",
                        "appName": "BulkPaymentsMA",
                        "context": {
                            "key": BBConstants.BULKPAYMENTS_UPLOAD_FILE,
                            "responseData": null
                        }
                    },
                    "onFailure": {
                        "form": "AuthUIModule/frmLogin",
                        "module": "AuthUIModule",
                        "appName": "AuthenticationMA",
                        "context": {
                            "key": BBConstants.LOG_OUT,
                            "responseData": null
                        }
                    }
                }
            }
        }, {
            "id": "Create New Template",
            "title": "${i18n{i18n.kony.BulkPayments.createTemplates}}",
            "tooltip": "${i18n{i18n.kony.BulkPayments.createTemplates}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["BULKPAYMENTS"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": configurationManager.getBulkPaymentTemplateCreatePermissionsList(),
            }],
            "callToAction": {
                "microApp": "BulkPaymentsMA",
                "moduleName": "BulkPaymentsUIModule",
                "presentationControllerMethod": "noServiceNavigateTemp",
                "params": {
                    "requestData": null,
                    "onSuccess": {
                        "form": "frmBulkPaymentsTemplate",
                        "module": "BulkPaymentsUIModule",
                        "appName": "BulkPaymentsMA",
                        "context": {
                            "key": BBConstants.BULKPAYMENTS_CREATE_TEMPLATE,
                            "responseData": null
                        }
                    },
                    "onFailure": {
                        "form": "AuthUIModule/frmLogin",
                        "module": "AuthUIModule",
                        "appName": "AuthenticationMA",
                        "context": {
                            "key": BBConstants.LOG_OUT,
                            "responseData": null
                        }
                    }
                }
            }
        }]
    }, {
        "id": "Exchange Rates",
        "fontIcon": "&",
        "title": "${i18n{i18n.kony.exchangeRates.ExchangeRatesHeader}}",
        "toolTip": "${i18n{i18n.kony.exchangeRates.ExchangeRatesHeader}}",
        "accessibilityConfig": {
            "a11yHidden": true,
            "a11yARIA": {
                "tabindex": -1
            }
        },
        "visibleInMAs": ["FOREIGNEXCHANGE"],
        "featureAndPermissions": [{
            "atLeastOneFeature": ["FX_RATES"]
        }],
        "onClick": function() {
            var ForeignExchangeModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                "moduleName": "ForeignExchangeUIModule",
                "appName": "ForeignExchangeMA"
            });
            ForeignExchangeModule.presentationController.noServiceNavigate("ForeignExchangeUIModule/frmForexDashboard", "Exchange Rates");
        },
    }, {
        "id": "Approvals Requests",
        "fontIcon": "%",
        "title": "${i18n{i18n.konybb.Common.ApprovalsRequests}}",
        "tooltip": "${i18n{i18n.konybb.Common.ApprovalsRequests}}",
        "accessibilityConfig": {
            "a11yARIA": {
                "tabindex": -1
            }
        },
        "visibleInMAs": ["APPROVALREQUEST"],
        "featureAndPermissions": [{
            "atLeastOneReqPermissions": configurationManager.getApprovalReqModulePermissionsList()
        }],
        "subMenu": [{
            "id": "My Approvals",
            "title": "${i18n{i18n.konybb.Common.MyApprovals}}",
            "tooltip": "${i18n{i18n.konybb.Common.MyApprovals}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["APPROVALREQUEST"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": configurationManager.getApprovalsFeaturePermissionsList()
            }],
            "callToAction": {
                "microApp": "ApprovalRequestMA",
                "moduleName": "ApprovalsReqUIModule",
                "presentationControllerMethod": "noServiceNavigation",
                "params": {
                    "requestData": null,
                    "onSuccess": {
                        "form": "frmBBApprovalsDashboard",
                        "module": "ApprovalsReqUIModule",
                        "appName": "ApprovalRequestMA",
                        "context": {
                            "key": BBConstants.DASHBOARD_DEFAULT_TAB,
                            "responseData": null
                        }
                    },
                    "onFailure": {
                        "form": "AuthUIModule/frmLogin",
                        "module": "AuthUIModule",
                        "appName": "AuthenticationMA",
                        "context": {
                            "key": BBConstants.LOG_OUT,
                            "responseData": null
                        }
                    }
                }
            }
        }, {
            "id": "My Requests",
            "title": "${i18n{i18n.konybb.Common.MyRequests}}",
            "tooltip": "${i18n{i18n.konybb.Common.MyRequests}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["APPROVALREQUEST"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": configurationManager.getRequestsFeaturePermissionsList()
            }],
            "callToAction": {
                "microApp": "ApprovalRequestMA",
                "moduleName": "ApprovalsReqUIModule",
                "presentationControllerMethod": "noServiceNavigation",
                "params": {
                    "requestData": null,
                    "onSuccess": {
                        "form": "frmBBRequestsDashboard",
                        "module": "ApprovalsReqUIModule",
                        "appName": "ApprovalRequestMA",
                        "context": {
                            "key": BBConstants.DASHBOARD_DEFAULT_TAB,
                            "responseData": null
                        }
                    },
                    "onFailure": {
                        "form": "AuthUIModule/frmLogin",
                        "module": "AuthUIModule",
                        "appName": "AuthenticationMA",
                        "context": {
                            "key": BBConstants.LOG_OUT,
                            "responseData": null
                        }
                    }
                }
            }
        }, {
            "id": "Approval History",
            "title": "${i18n{i18n.konybb.Common.approvalHistory}}",
            "tooltip": "${i18n{i18n.konybb.Common.approvalHistory}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["APPROVALREQUEST"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": configurationManager.getBulkPaymentsApprovalsFeaturePermissionsList()
            }],
            "callToAction": {
                "microApp": "ApprovalRequestMA",
                "moduleName": "ApprovalsReqUIModule",
                "presentationControllerMethod": "noServiceNavigation",
                "params": {
                    "requestData": null,
                    "onSuccess": {
                        "form": "frmBBApprovalHistory",
                        "module": "ApprovalsReqUIModule",
                        "appName": "ApprovalRequestMA",
                        "context": {
                            "key": BBConstants.DASHBOARD_DEFAULT_TAB,
                            "responseData": null
                        }
                    },
                    "onFailure": {
                        "form": "AuthUIModule/frmLogin",
                        "module": "AuthUIModule",
                        "appName": "AuthenticationMA",
                        "context": {
                            "key": BBConstants.LOG_OUT,
                            "responseData": null
                        }
                    }
                }
            }
        }, {
            "id": "Request History",
            "title": "${i18n{i18n.konybb.Common.requestHistory}}",
            "tooltip": "${i18n{i18n.konybb.Common.requestHistory}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["APPROVALREQUEST"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": configurationManager.getBulkPaymentRequestPermissionsList()
            }],
            "callToAction": {
                "microApp": "ApprovalRequestMA",
                "moduleName": "ApprovalsReqUIModule",
                "presentationControllerMethod": "noServiceNavigation",
                "params": {
                    "requestData": null,
                    "onSuccess": {
                        "form": "frmBBRequestHistory",
                        "module": "ApprovalsReqUIModule",
                        "appName": "ApprovalRequestMA",
                        "context": {
                            "key": BBConstants.DASHBOARD_DEFAULT_TAB,
                            "responseData": null
                        }
                    },
                    "onFailure": {
                        "form": "AuthUIModule/frmLogin",
                        "module": "AuthUIModule",
                        "appName": "AuthenticationMA",
                        "context": {
                            "key": BBConstants.LOG_OUT,
                            "responseData": null
                        }
                    }
                }
            }
        }]
    }, {
        "id": "Wire Transfer",
        "fontIcon": "6",
        "title": "${i18n{i18n.transfers.wireTransfer}}",
        "toolTip": "${i18n{i18n.transfers.wireTransfer}}",
        "accessibilityConfig": {
            "a11yHidden": true,
            "a11yARIA": {
                "tabindex": -1
            }
        },
        "visibleInMAs": ["WIRETRANSFER"],
        "featureAndPermissions": [{
            "atLeastOneFeature": [OLBConstants.BULK_WIRE_PERMISSIONS.DOMESTIC_WIRE_TRANSFER, OLBConstants.BULK_WIRE_PERMISSIONS.INTERNATIONAL_WIRE_TRANSFER]
        }],
        "subMenu": [{
            "id": "Make Transfer",
            "title": "${i18n{i18n.AccountDetails.MAKETRANSFER}}",
            "tooltip": "${i18n{i18n.AccountDetails.MAKETRANSFER}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["WIRETRANSFER"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": [OLBConstants.BULK_WIRE_PERMISSIONS.INTERNATIONAL_WIRE_TRANSFER_CREATE, OLBConstants.BULK_WIRE_PERMISSIONS.DOMESTIC_WIRE_TRANSFER_CREATE]
            }],
            "callToAction": {
                "microApp": "WireTransferMA",
                "moduleName": "WireTransferNewUIModule",
                "presentationControllerMethod": "showWireTransfer",
                "params": {
                    landingPageView: "makeTransfer"
                }
            }
        }, {
            "id": "History",
            "title": "${i18n{i18n.billPay.History}}",
            "tooltip": "${i18n{i18n.billPay.History}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["WIRETRANSFER"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": [OLBConstants.BULK_WIRE_PERMISSIONS.INTERNATIONAL_WIRE_TRANSFER_CREATE, OLBConstants.BULK_WIRE_PERMISSIONS.DOMESTIC_WIRE_TRANSFER_CREATE, OLBConstants.BULK_WIRE_PERMISSIONS.INTERNATIONAL_WIRE_TRANSFER_VIEW, OLBConstants.BULK_WIRE_PERMISSIONS.DOMESTIC_WIRE_TRANSFER_VIEW]
            }],
            "callToAction": {
                "microApp": "WireTransferMA",
                "moduleName": "WireTransferNewUIModule",
                "presentationControllerMethod": "showWireTransfer",
                "params": {
                    landingPageView: "wireTransferHistory"
                }
            }
        }, {
            "id": "My Recipients",
            "title": "${i18n{i18n.WireTransfer.MyRecepient}}",
            "tooltip": "${i18n{i18n.WireTransfer.MyRecepient}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["WIRETRANSFER"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["DOMESTIC_WIRE_TRANSFER_VIEW_RECEPIENT", "DOMESTIC_WIRE_TRANSFER_DELETE_RECEPIENT", "DOMESTIC_WIRE_TRANSFER_CREATE_RECEPIENT", "INTERNATIONAL_WIRE_TRANSFER_CREATE_RECEPIENT", "INTERNATIONAL_WIRE_TRANSFER_DELETE_RECEPIENT", "INTERNATIONAL_WIRE_TRANSFER_VIEW_RECEPIENT"]
            }],
            "callToAction": {
                "microApp": "WireTransferMA",
                "moduleName": "WireTransferNewUIModule",
                "presentationControllerMethod": "showWireTransfer",
                "params": {
                    landingPageView: "myRecipients"
                }
            }
        }, {
            "id": "Add Recipient",
            "title": "${i18n{i18n.PayAPerson.AddRecipient}}",
            "tooltip": "${i18n{i18n.PayAPerson.AddRecipient}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["WIRETRANSFER"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": [OLBConstants.BULK_WIRE_PERMISSIONS.INTERNATIONAL_WIRE_TRANSFER_CREATE_RECEPIENT,
                    OLBConstants.BULK_WIRE_PERMISSIONS.DOMESTIC_WIRE_TRANSFER_CREATE_RECEPIENT
                ]
            }],
            "onClick": function() {
                var wireTransferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                    "moduleName": "WireTransferNewUIModule",
                    "appName": "WireTransferMA"
                });
                if ((checkUserPermission("DOMESTIC_WIRE_TRANSFER_CREATE_RECEPIENT") === true) || ((checkUserPermission("DOMESTIC_WIRE_TRANSFER_CREATE_RECEPIENT") === true) && (checkUserPermission("INTERNATIONAL_WIRE_TRANSFER_CREATE_RECEPIENT") === true))) {
                    wireTransferModule.presentationController.showWireTransferAddRecipientStep1({
                        landingPageView: "addRecipient"
                    })
                } else if (checkUserPermission("INTERNATIONAL_WIRE_TRANSFER_CREATE_RECEPIENT") === true) {
                    wireTransferModule.presentationController.showWireTransferInternationalStep1({
                        landingPageView: "addRecipientInternational"
                    })
                }
            },
        }, {
            "id": "Make One Time Payment",
            "title": "${i18n{i18n.BillPay.MAKEONETIMEPAYMENT}}",
            "tooltip": "${i18n{i18n.BillPay.MAKEONETIMEPAYMENT}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["WIRETRANSFER"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": [OLBConstants.BULK_WIRE_PERMISSIONS.INTERNATIONAL_WIRE_TRANSFER_CREATE, OLBConstants.BULK_WIRE_PERMISSIONS.DOMESTIC_WIRE_TRANSFER_CREATE]
            }],
            "callToAction": {
                "microApp": "WireTransferMA",
                "moduleName": "WireTransferNewUIModule",
                "presentationControllerMethod": "showOneTimeWireTransfer",
                "params": {
                    landingPageView: "oneTimeTransfer"
                }
            }
        }, {
            "id": "Create New Template",
            "title": "${i18n{i18n.wireTransfers.CreateNewTemplate}}",
            "tooltip": "${i18n{i18n.wireTransfers.CreateNewTemplate}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "breakpoints": [
                1024,
                1366,
                1380
            ],
            "visibleInMAs": ["WIRETRANSFER"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": [OLBConstants.BULK_WIRE_PERMISSIONS.DOMESTIC_WIRE_TRANSFER_UPDATE_BULK_TEMPLATES, OLBConstants.BULK_WIRE_PERMISSIONS.INTERNATIONAL_WIRE_TRANSFER_UPDATE_BULK_TEMPLATES]
            }],
            "onClick": function() {
                var wireTransferModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                    "moduleName": "WireTransferNewUIModule",
                    "appName": "WireTransferMA"
                });
                wireTransferModule.presentationController.resetPrimaryDetails();
                wireTransferModule.presentationController.resetRecipientData();
                wireTransferModule.presentationController.navigateToCreateTemplateForm();
            },
        }, {
            "id": "Files & Templates",
            "title": "${i18n{i18n.wireTransfers.Files&Templates}}",
            "tooltip": "${i18n{i18n.wireTransfers.Files&Templates}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["WIRETRANSFER"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": [OLBConstants.BULK_WIRE_PERMISSIONS.DOMESTIC_WIRE_TRANSFER_VIEW_BULK_FILES, OLBConstants.BULK_WIRE_PERMISSIONS.INTERNATIONAL_WIRE_TRANSFER_VIEW_BULK_FILES, OLBConstants.BULK_WIRE_PERMISSIONS.DOMESTIC_WIRE_TRANSFER_VIEW_BULK_TEMPLATES, OLBConstants.BULK_WIRE_PERMISSIONS.INTERNATIONAL_WIRE_TRANSFER_VIEW_BULK_TEMPLATES]
            }],
            "callToAction": {
                "microApp": "WireTransferMA",
                "moduleName": "WireTransferNewUIModule",
                "presentationControllerMethod": "showBulkwirefiles",
                "params": {
                    "formName": "frmBulkTransferFiles",
                    "bulkWireCategoryFilter": "All"
                }
            }
        }, {
            "id": "Make Bulk Transfer",
            "title": "${i18n{i18n.bulkWire.makeBulkTransfer}}",
            "tooltip": "${i18n{i18n.bulkWire.makeBulkTransfer}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "breakpoints": [
                1024,
                1366,
                1380
            ],
            "visibleInMAs": ["WIRETRANSFER"],
            "featureAndPermissions": [{
                "allReqPermissions": [OLBConstants.BULK_WIRE_PERMISSIONS.DOMESTIC_WIRE_TRANSFER_CREATE],
                "atLeastOneReqPermissions": [OLBConstants.BULK_WIRE_PERMISSIONS.DOMESTIC_WIRE_TRANSFER_VIEW_BULK_FILES, OLBConstants.BULK_WIRE_PERMISSIONS.DOMESTIC_WIRE_TRANSFER_VIEW_BULK_TEMPLATE]
            }, {
                "allReqPermissions": [OLBConstants.BULK_WIRE_PERMISSIONS.INTERNATIONAL_WIRE_TRANSFER_CREATE],
                "atLeastOneReqPermissions": [OLBConstants.BULK_WIRE_PERMISSIONS.INTERNATIONAL_WIRE_TRANSFER_VIEW_BULK_FILES, OLBConstants.BULK_WIRE_PERMISSIONS.INTERNATIONAL_WIRE_TRANSFER_VIEW_BULK_TEMPLATES]
            }],
            "callToAction": {
                "microApp": "WireTransferMA",
                "moduleName": "WireTransferNewUIModule",
                "presentationControllerMethod": "showBulkwirefiles",
                "params": {
                    "formName": "frmMakeBulkTransferTemplate",
                    "bulkWireCategoryFilter": OLBConstants.BULKWIRE_CATEGORY_FILTER.TEMPLATES
                }
            }
        }, {
            "id": "Add Bulk Transfer File",
            "title": "${i18n{i18n.BulkWire.AddBulkWireFile}}",
            "tooltip": "${i18n{i18n.BulkWire.AddBulkWireFile}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "breakpoints": [
                1024,
                1366,
                1380
            ],
            "visibleInMAs": ["WIRETRANSFER"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": [OLBConstants.BULK_WIRE_PERMISSIONS.DOMESTIC_WIRE_TRANSFER_UPLOAD_BULK_FILES, OLBConstants.BULK_WIRE_PERMISSIONS.INTERNATIONAL_WIRE_TRANSFER_UPLOAD_BULK_FILES]
            }],
            "callToAction": {
                "microApp": "WireTransferMA",
                "moduleName": "WireTransferNewUIModule",
                "form": "frmAddBulkTransferFile"
            }
        }]
    }, {
        "id": "ALERTS AND MESSAGES",
        "fontIcon": "m",
        "title": alertsText,
        "toolTip": alertsText,
        "accessibilityConfig": {
            "a11yHidden": true,
            "a11yARIA": {
                "tabindex": -1
            }
        },
        "visibleInMAs": ["SECUREMESSAGE"],
        "featureAndPermissions": [{
            "atLeastOneFeature": ["MESSAGES"]
        }],
        "subMenu": [{
            "id": "Alerts",
            "title": "${i18n{i18n.AlertsAndMessages.Alerts}}",
            "tooltip": "${i18n{i18n.AlertsAndMessages.Alerts}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["SECUREMESSAGE"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["NOTIFICATION_VIEW"]
            }],
            "callToAction": {
                "microApp": "SecureMessageMA",
                "moduleName": "AlertsMsgsUIModule",
                "presentationControllerMethod": "showAlertsPage"
            }
        }, {
            "id": "My Messages",
            "title": "${i18n{i18n.AlertsAndMessages.Messages}}",
            "tooltip": "${i18n{i18n.AlertsAndMessages.Messages}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["MESSAGES_VIEW"]
            }],
            "callToAction": {
                "microApp": "SecureMessageMA",
                "moduleName": "AlertsMsgsUIModule",
                "presentationControllerMethod": "showAlertsPage",
                "params": ["hamburgerMenu", {
                    show: "Messages"
                }]
            }
        }, {
            "id": "New Message",
            "title": "${i18n{i18n.AlertsAndMessages.NewMessagesMod}}",
            "tooltip": "${i18n{i18n.AlertsAndMessages.NewMessagesMod}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["MESSAGES_CREATE_OR_REPLY"]
            }],
            "callToAction": {
                "microApp": "SecureMessageMA",
                "moduleName": "AlertsMsgsUIModule",
                "presentationControllerMethod": "showAlertsPage",
                "params": ["hamburgerMenu", {
                    show: "CreateNewMessage"
                }]
            }
        }]
    }, {
        "id": "User Management",
        "fontIcon": "u",
        "title": "${i18n{i18n.common.UserManagement}}",
        "toolTip": "${i18n{i18n.common.UserManagement}}",
        "accessibilityConfig": {
            "a11yHidden": true,
            "a11yARIA": {
                "tabindex": -1
            }
        },
        "visibleInMAs": ["USERMANAGEMENT"],
        "featureAndPermissions": [{
            "atLeastOneFeature": ["USER_MANAGEMENT"]
        }],
        "subMenu": [{
            "id": "All Users",
            "title": "${i18n{i18n.userManagement.allUsers}}",
            "tooltip": "${i18n{i18n.userManagement.allUsers}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["USERMANAGEMENT"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["USER_MANAGEMENT_ACTIVATE", "USER_MANAGEMENT_DELETE", "USER_MANAGEMENT_SUSPEND", "USER_MANAGEMENT_VIEW"]
            }],
            "callToAction": {
                "microApp": "UserManagementMA",
                "moduleName": "BusinessBankingUIModule",
                "presentationControllerMethod": "showUserManagent",
                "params": {
                    show: 'showAllUsers'
                }
            }
        }, {
            "id": "User Roles",
            "title": "${i18n{i18n.customRoles.userRoles}}",
            "tooltip": "${i18n{i18n.customRoles.userRoles}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["USERMANAGEMENT"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["CUSTOM_ROLES_VIEW"]
            }],
            "callToAction": {
                "microApp": "UserManagementMA",
                "moduleName": "BusinessBankingUIModule",
                "presentationControllerMethod": "showUserManagent",
                "params": {
                    show: 'showUserRoles'
                }
            }
        }, {
            "id": "Create UM User",
            "title": "${i18n{i18n.userManagement.createAuser}}",
            "tooltip": "${i18n{i18n.userManagement.createAuser}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["USERMANAGEMENT"],
            "breakpoints": [
                1024,
                1366,
                1380
            ],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["USER_MANAGEMENT_CREATE"]
            }],
            "callToAction": {
                "microApp": "UserManagementMA",
                "moduleName": "BusinessBankingUIModule",
                "presentationControllerMethod": "showUserManagent",
                "params": {
                    show: 'creatUMUser'
                }
            }
        }, {
            "id": "Create Custom Role",
            "title": "${i18n{i18n.customRole.createCustomRole}}",
            "tooltip": "${i18n{i18n.customRole.createCustomRole}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["USERMANAGEMENT"],
            "breakpoints": [
                1024,
                1366,
                1380
            ],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["CUSTOM_ROLES_CREATE"]
            }],
            "callToAction": {
                "microApp": "UserManagementMA",
                "moduleName": "BusinessBankingUIModule",
                "presentationControllerMethod": "showUserManagent",
                "params": {
                    show: 'createNewCustomRole'
                }
            }
        }]
    }, {
        "id": "Pay a Person",
        "fontIcon": "P",
        "title": "${i18n{i18n.p2p.PayAPerson}}",
        "toolTip": "${i18n{i18n.p2p.PayAPerson}}",
        "accessibilityConfig": {
            "a11yHidden": true,
            "a11yARIA": {
                "tabindex": -1
            }
        },
        "featureAndPermissions": [{
            "atLeastOneFeature": ["P2P"]
        }],
        "subMenu": [{
            "id": "Send Money",
            "title": "${i18n{i18n.Pay.SendMoney}}",
            "tooltip": "${i18n{i18n.Pay.SendMoney}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["P2P_CREATE"]
            }],
            "onClick": function() {
                var p2pModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("PayAPersonModule");
                p2pModule.presentationController.showPayAPerson("sendMoneyTab");
            },
        }, {
            "id": "History",
            "title": "${i18n{i18n.billPay.History}}",
            "tooltip": "${i18n{i18n.billPay.History}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["P2P_VIEW"]
            }],
            "onClick": function() {
                var p2pModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("PayAPersonModule");
                p2pModule.presentationController.showPayAPerson("SentTransactionsTab");
            },
        }, {
            "id": "My Recipients",
            "title": "${i18n{i18n.WireTransfer.MyRecepient}}",
            "tooltip": "${i18n{i18n.WireTransfer.MyRecepient}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["P2P_MANAGE_PAYEES", "P2P_CREATE"]
            }],
            "onClick": function() {
                var p2pModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("PayAPersonModule");
                p2pModule.presentationController.showPayAPerson("ManageRecipients");
            },
        }, {
            "id": "Add Recipient",
            "title": "${i18n{i18n.PayAPerson.AddRecipient}}",
            "tooltip": "${i18n{i18n.PayAPerson.AddRecipient}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["P2P_MANAGE_PAYEES"]
            }],
            "onClick": function() {
                var p2pModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("PayAPersonModule");
                p2pModule.presentationController.showPayAPerson("AddRecipient");
            },
        }, {
            "id": "Send Money to New Recipient",
            "title": "${i18n{i18n.PayAPerson.SendMoneyToNewRecipient}}",
            "tooltip": "${i18n{i18n.PayAPerson.SendMoneyToNewRecipient}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["P2P_CREATE"]
            }],
            "onClick": function() {
                var p2pModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("PayAPersonModule");
                p2pModule.presentationController.showPayAPerson("sendMoneyToNewRecipient");
            },
        }]
    }, {
        "id": "Settings",
        "fontIcon": "s",
        "title": "${i18n{i18n.ProfileManagement.Settingscapson}}",
        "toolTip": "${i18n{i18n.ProfileManagement.Settingscapson}}",
        "accessibilityConfig": {
            "a11yHidden": true,
            "a11yARIA": {
                "tabindex": -1
            }
        },
        "visibleInMAs": ["MANAGEARRANGEMENTS", "ALERTSETTINGS", "MANAGEPROFILE", "APPROVALMATRIX", "CONSENTMANAGEMENT"],
        "breakpoints": [
            1024,
            1366,
            1380
        ],
        "subMenu": [{
            "id": "Profile Settings",
            "title": "${i18n{i18n.ProfileManagement.profilesettings}}",
            "tooltip": "${i18n{i18n.ProfileManagement.profilesettings}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["MANAGEPROFILE"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["PROFILE_SETTINGS_VIEW"]
            }],
            "callToAction": {
                "microApp": "ManageProfileMA",
                "moduleName": "SettingsNewUIModule",
                "presentationControllerMethod": "enterProfileSettings",
                "params": "profileSettings"
            }
        }, {
            "id": "Security Settings",
            "title": "${i18n{i18n.ProfileManagement.SecuritySettings}}",
            "tooltip": "${i18n{i18n.ProfileManagement.SecuritySettings}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["MANAGEPROFILE"],
            "callToAction": {
                "microApp": "ManageProfileMA",
                "moduleName": "SettingsNewUIModule",
                "presentationControllerMethod": "enterProfileSettings",
                "params": "securityQuestions"
            }
        }, {
            "id": "Account Settings",
            "title": "${i18n{i18n.Accounts.ContextualActions.updateSettingAndPreferences}}",
            "tooltip": "${i18n{i18n.Accounts.ContextualActions.updateSettingAndPreferences}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["ACCOUNT_SETTINGS_VIEW"]
            }],
            "callToAction": {
                "microApp": "ManageArrangementsMA",
                "moduleName": "ManageArrangementsUIModule",
                "presentationControllerMethod": "enterProfileSettings",
                "params": "accountSettings"
            }
        }, {
            "id": "Approval Matrix",
            "title": "${i18n{i18n.Settings.ApprovalMatrix.approvalMatrix}}",
            "tooltip": "${i18n{i18n.Settings.ApprovalMatrix.approvalMatrix}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "breakpoints": [
                1024,
                1366,
                1380
            ],
            "visibleInMAs": ["APPROVALMATRIX"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["APPROVAL_MATRIX_VIEW"]
            }],
            "callToAction": {
                "microApp": "ApprovalMatrixMA",
                "moduleName": "SettingsNewApprovalUIModule",
                "presentationControllerMethod": "enterProfileSettings",
                "params": "approvalMatrix"
            }
        }, {
            "id": "Alert Settings",
            "title": "${i18n{i18n.ProfileManagement.Alerts}}",
            "tooltip": "${i18n{i18n.ProfileManagement.Alerts}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "breakpoints": [
                1024,
                1366,
                1380
            ],
            "visibleInMAs": ["ALERTSETTINGS"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["ALERT_MANAGEMENT"]
            }],
            "callToAction": {
                "microApp": "AlertSettingsMA",
                "moduleName": "SettingsNewAlertsUIModule",
                "presentationControllerMethod": "enterProfileSettings",
                "params": "alertSettings"
            }
        }, {
            "id": "Consent Management",
            "title": "${i18n{i18n.ProfileManagement.Consent}}",
            "tooltip": "${i18n{i18n.ProfileManagement.Consent}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "breakpoints": [
                1024,
                1366,
                1380
            ],
            "visibleInMAs": ["CONSENTMANAGEMENT"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["CDP_CONSENT_VIEW"]
            }],
            "callToAction": {
                "microApp": "ConsentMgmtMA",
                "moduleName": "CDPConsentUIModule",
                "presentationControllerMethod": "showConsentManagement"
            }
        }, {
            "id": "Manage Account Access",
            "title": "${i18n{i18n.ProfileManagement.ManageAccountAccess}}",
            "tooltip": "${i18n{i18n.ProfileManagement.ManageAccountAccess}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "breakpoints": [
                1024,
                1366,
                1380
            ],
            "visibleInMAs": ["CONSENTMANAGEMENT"],
            "featureAndPermissions": [{
                "atLeastOneReqPermissions": ["PSD2_TPP_CONSENT_VIEW"]
            }],
            "callToAction": {
                "microApp": "ConsentMgmtMA",
                "moduleName": "PSD2ConsentUIModule",
                "presentationControllerMethod": "showManageAccountAccess"
            }
        }]
    }, {
        "id": "About Us",
        "fontIcon": "A",
        "title": "${i18n{i18n.hamburger.aboutus}}",
        "toolTip": "${i18n{i18n.hamburger.aboutus}}",
        "accessibilityConfig": {
            "a11yHidden": true,
            "a11yARIA": {
                "tabindex": -1
            }
        },
        "visibleInMAs": ["ABOUTUS"],
        "subMenu": [{
            "id": "Terms & Conditions",
            "title": "${i18n{i18n.common.TnC}}",
            "tooltip": "${i18n{i18n.common.TnC}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "callToAction": {
                "microApp": "AboutUsMA",
                "moduleName": "InformationContentUIModule",
                "presentationControllerMethod": "showTermsAndConditions",
                "params": OLBConstants.TNC_FLOW_TYPES.Hamburger_TnC
            }
        }, {
            "id": "Privacy Policy",
            "title": "${i18n{i18n.footer.privacy}}",
            "tooltip": "${i18n{i18n.footer.privacy}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["ABOUTUS"],
            "callToAction": {
                "microApp": "AboutUsMA",
                "moduleName": "InformationContentUIModule",
                "presentationControllerMethod": "showPrivacyPolicyPage"
            }
        }, {
            "id": "Contact Us",
            "title": "${i18n{i18n.footer.contactUs}}",
            "tooltip": "${i18n{i18n.footer.contactUs}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["ABOUTUS"],
            "callToAction": {
                "microApp": "AboutUsMA",
                "moduleName": "InformationContentUIModule",
                "presentationControllerMethod": "showContactUsPage"
            }
        }, {
            "id": "Locate Us",
            "title": "${i18n{i18n.footer.locateUs}}",
            "tooltip": "${i18n{i18n.footer.locateUs}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["ABOUTUS"],
            "callToAction": {
                "microApp": "AboutUsMA",
                "moduleName": "LocateUsUIModule",
                "presentationControllerMethod": "showLocateUsPage"
            }
        }, {
            "id": "FAQs",
            "title": "${i18n{i18n.topmenu.help}}",
            "tooltip": "${i18n{i18n.topmenu.help}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["ABOUTUS"],
            "callToAction": {
                "microApp": "AboutUsMA",
                "moduleName": "InformationContentUIModule",
                "presentationControllerMethod": "showFAQs"
            }
        }, {
            "id": "Feedback",
            "title": "${i18n{i18n.CustomerFeedback.Feedback}}",
            "tooltip": "${i18n{i18n.CustomerFeedback.Feedback}}",
            "accessibilityConfig": {
                "a11yARIA": {
                    "tabindex": -1
                }
            },
            "visibleInMAs": ["ABOUTUS"],
            "featureAndPermissions": [{
                "atLeastOneFeature": ["FEEDBACK"]
            }],
            "callToAction": {
                "microApp": "AboutUsMA",
                "form": "frmCustomerFeedback",
                "moduleName": "FeedbackUIModule",
                "presentationControllerMethod": "showFeedback"
            }
        }]
    }]
    return {
        config: widgetsMap
    };
});