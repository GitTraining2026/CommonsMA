define(['FormControllerUtility','OLBConstants','CommonUtilities'], function(FormControllerUtility, OLBConstants,CommonUtilities) {
    var orientationHandler = new OrientationHandler();
    var checkUserFeature = function (feature) {
        return applicationManager.getConfigurationManager().checkUserFeature(feature);
    }
    var checkAtLeastOneFeaturePresent = function (features) {
        return features.some(checkUserFeature);
    }

    var checkUserPermission = function (permission) {
        return applicationManager.getConfigurationManager().checkUserPermission(permission);
    }

    var checkAtLeastOnePermission = function (permissions) {
        return permissions.some(checkUserPermission);
    }
	
	var checkAllPermissions = function (permissions) {
        return permissions.every(checkUserPermission);
    }
    var scopeObj = this;

    var widgetsMap = [{
        isVisible: function() {
            return (applicationManager.getConfigurationManager().checkUserFeature("PROFILE_SETTINGS"));
        },
        id: "PROFILESETTINGS",
        menu: "flxProfileSettings",
        text: "i18n.ProfileManagement.profilesettings",
        toolTip: "i18n.ProfileManagement.profilesettings",
        image: "lblProfileSettingsCollapse",
        icon: "1",
        subMenu: {
            children: [{
                id: "Profile",
                configuration: "enableProfileSettings",
                text: "i18n.ProfileManagement.Profile",
                toolTip: "i18n.ProfileManagement.Profile",
                onClick: function() {
                    kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName": "SettingsNewUIModule","appName": "ManageProfileMA"}).presentationController.showUserProfile();
                }
            }, {
                id: "Phone",
                configuration: "enablePhoneSettings",
                text: "i18n.Profilemanagement.lblPhone",
                toolTip: "i18n.Profilemanagement.lblPhone",
                onClick: function() {
                    kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName": "SettingsNewUIModule","appName": "ManageProfileMA"}).presentationController.showUserPhones();
                },
                isVisible: function() {
                    return true;
                }
            }, {
                id: "Email",
                configuration: "enableEmailSettings",
                text: "i18n.ProfileManagement.EmailId",
                toolTip: "i18n.ProfileManagement.EmailId",
                onClick: function() {
                    kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName": "SettingsNewUIModule","appName": "ManageProfileMA"}).presentationController.showUserEmail();
                },
                isVisible: function() {
                    return true;
                }
            }, {
                id: "Address",
                configuration: "enableAddressSettings",
                text: "i18n.ProfileManagement.Address",
                toolTip: "i18n.ProfileManagement.Address",
                onClick: function() {
                    kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName": "SettingsNewUIModule","appName": "ManageProfileMA"}).presentationController.fetchUser("Addresses");

                },
                isVisible: function() {
                    return true;
                }
            }, {
                id: "UsernamePassword",
                configuration: "enableUsernameAndPasswordSettings",
                text: "i18n.ProfileManagement.Username&Password",
                toolTip: "i18n.ProfileManagement.Username&Password",
                onClick: function() {
                    kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName": "SettingsNewUIModule","appName": "ManageProfileMA"}).presentationController.showUserNameAndPassword();

                    //  scopeObj.view.customheader.customhamburger.activateMenu("Settings", "Profile Settings");
                    //scopeObj.showUsernameAndPassword();
                    //scopeObj.setSelectedSkin("flxUsernameAndPassword");
                    /*  var userPreferencesManager = applicationManager.getUserPreferencesManager();
                            if(kony.mvc.MDAApplication.getSharedInstance().appContext.userName){
                         CommonUtilities.setText(this.view.settings.lblUsernameValue, kony.mvc.MDAApplication.getSharedInstance().appContext.userName , CommonUtilities.getaccessibilityConfig());
                            }else{
                         CommonUtilities.setText(this.view.settings.lblUsernameValue, userPreferencesManager.getCurrentUserName() , CommonUtilities.getaccessibilityConfig());
                            }
                        */
                },
                isVisible: function() {
                    return true;
                }
            },{
                id: "eBankingAccess",
                text: "i18n.profile.eBankingAccess",
                toolTip: "i18n.profile.eBankingAccess",
                onClick: function() {
                    kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName": "SettingsNewUIModule","appName": "ManageProfileMA"}).presentationController.showBankingAccess();
                },
                isVisible: function() {
                    return applicationManager.getConfigurationManager().checkUserFeature("ONLINE_BANKING_ACCESS");
                }
            }, {
                id: "Language",
                configuration: "",
                text: "i18n.Profile.Language",
                toolTip: "i18n.Profile.Language",
                onClick: function() {
                     kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName": "SettingsNewUIModule","appName": "ManageProfileMA"}).presentationController.showProfileLanguage();
                },
                isVisible: function() {
                    return true;
                }
                }, {
                    id: "EntityPreferences",
                    configuration: "",
                    text: "i18n.Profile.EntityPreferences",
                    toolTip: "i18n.Profile.EntityPreferences",
                    onClick: function () {
                        kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({ "moduleName": "SettingsNewUIModule", "appName": "ManageProfileMA" }).presentationController.showEntityPreferences();
                    },
                    isVisible: function () {
                        if (applicationManager.getConfigurationManager().checkUserFeature("MULTI_ENTITY_PREFERENCE") && checkUserPermission("SET_DEFAULT_ENTITY_PREFERENCE")) {
                            let singleEntityValue = "true";
                            let userLegalEntitesSize = applicationManager.getMultiEntityManager().getUserLegalEntitiesSize();
                            if (applicationManager.getConfigurationManager().configurations.getItem("isSingleEntity") !== undefined) {
                                singleEntityValue = applicationManager.getConfigurationManager().configurations.getItem("isSingleEntity");
                            }
                            if (singleEntityValue === "false" && userLegalEntitesSize > 0)
                                return true;
                            else
                                return false;
                        }
                        return false;
                    }
                },]
        },
    }, {
        isVisible: function() {
            return true;
        },
        id: "SECURITYSETTINGS",
        menu: "flxSecuritySettings",
        text: "i18n.ProfileManagement.SecuritySettings",
        toolTip: "i18n.ProfileManagement.SecuritySettings",
        image: "lblSecuritySettingsCollapse",
        icon: "2",
        subMenu: {
            // parent: "flxTransfersSubMenu",
            children: [{
                id: "Security Setting",
                configuration: "enableSecurityQuestionsSettings",
                text: "i18n.ProfileManagement.SecuritySettings",
                toolTip: "i18n.ProfileManagement.SecuritySettings",
                isVisible: function() {
                    return true;
                },
              onClick: function() {
                kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName": "SettingsNewUIModule","appName": "ManageProfileMA"}).presentationController.checkSecurityQuestions();
              },
            }]
        },
    },
                      {
                        isVisible: function() {
                            if(CommonUtilities.getSCAType() == 0)
                            return false;
                            else
                            return true;
                        },
                        id: "DEVICEMANAGEMENT",
                        menu: "flxSecuritySettings",
                        text: "i18n.ProfileManagement.DeviceManagement",
                        toolTip: "i18n.ProfileManagement.DeviceManagement",
                        image: "lblSecuritySettingsCollapse",
                        icon: "9",
                        subMenu: {
                          // parent: "flxTransfersSubMenu",
                          children: [{
                            id: "Device",
                            configuration: "enableSecurityQuestionsSettings",
                            text: "i18n.ProfileManagement.RegisteredDevice",
                            toolTip: "i18n.ProfileManagement.RegisteredDevice",
                            isVisible: function() {
                              return true;
                            },
                            onClick: function() {
                              var profileModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"})
                              profileModule.presentationController.enterProfileSettings("deviceManagement");
                            },
                          }]
                        },
                      },
                      {
        isVisible: function() {
            return checkUserPermission("ACCOUNT_SETTINGS_VIEW");
        },
        id: "ACCOUNTSETTINGS",
        menu: "flxAccountSettings",
        text: "i18n.Accounts.ContextualActions.updateSettingAndPreferences",
        toolTip: "i18n.Accounts.ContextualActions.updateSettingAndPreferences",
        image: "lblAccountSettingsCollapse",
        icon: "4",
        subMenu: {
            //  parent: "flxTransfersSubMenu",		
            children: [{
                id: "Account Preferences",
                configuration: "enablePreferredAccountSettings",
                text: "i18n.ProfileManagement.AccountPreferences",
                toolTip: "i18n.ProfileManagement.AccountPreferences",
                onClick: function() {
                    var settingsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName": "ManageArrangementsMA",
                    "moduleName": "ManageArrangementsUIModule"});
                    settingsModule.presentationController.enterProfileSettings("accountSettings");                  
         
                },
                isVisible: function() {
                    return true;
                }
            }, {
                id: "Set Default Account",
                configuration: "enableDefaultAccounts",
                text: "i18n.ProfileManagement.SetDefaultAccount",
                toolTip: "i18n.ProfileManagement.SetDefaultAccount",
                onClick: function() {
                    var profileModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName": "ManageArrangementsMA",
                    "moduleName": "ManageArrangementsUIModule"});
                        profileModule.presentationController.getDefaultUserProfile();
                },
                isVisible: function() {
                   if(applicationManager.getConfigurationManager().enableDefaultAccounts === "true")
                   return true;
                   else
                   return false;
                }
            },{
                id: "Statements Preferences",
                configuration: "enableDefaultAccounts",
                text: "i18n.Accounts.statementPreferences",
                toolTip: "i18n.Accounts.statementPreferences",
                onClick: function() {
                    var profileModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                        "appName": "ManageArrangementsMA",
                        "moduleName": "ManageArrangementsUIModule"
                    });
                    profileModule.presentationController.getStatementPreferencesProfile();
                },
                isVisible: function() {
                     return false;
                }
            }]
        },
    }, {
        isVisible: function() {
            return (applicationManager.getConfigurationManager().checkUserFeature("ALERT_MANAGEMENT"));
        },
        id: "ALERTSETTINGS",
        //   menu: "flxTransfers",		
        menu: "flxAlerts",
        text: "i18n.ProfileManagement.Alerts",
        toolTip: "i18n.ProfileManagement.Alerts",
        //icon: "lblAlertsCollapse",
        icon: "3",
        subMenu: {
            // parent: "flxTransfersSubMenu",		
            children: [{
                id: "Alert Communication",
                configuration: "",
                text: "i18n.alertSettings.alertComm",
                toolTip: "i18n.alertSettings.alertComm",
                onClick: function() {
                    var alertsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName": "SettingsNewAlertsUIModule", "appName": "AlertSettingsMA" });
                    alertsModule.presentationController.enterProfileSettings("alertSettings");
                },
                isVisible: function() {
                  var configurationManager = applicationManager.getConfigurationManager();
                    if(configurationManager.isMicroAppPresent(configurationManager.microappConstants.ALERTSETTINGS)===true )
                     return (kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName": "SettingsNewAlertsUIModule", "appName": "AlertSettingsMA" }).presentationController.getenableSeparateContact());
                   else
                     return false;
                }
            }]
        },
    }, {
        isVisible: function() {
           return kony.application.getCurrentBreakpoint()!==640 && !orientationHandler.isMobile && checkUserPermission('APPROVAL_MATRIX_VIEW');
        },
        id: "APPROVALMATRIX",
        text: "i18n.Settings.ApprovalMatrix.approvalMatrix",
        toolTip: "i18n.Settings.ApprovalMatrix.approvalMatrix",
        //icon: "lblApprovalMatrixCollapse",
        icon: "4",
        //menu: "flxApprovalMatrix",
        subMenu: {
             children: [{
				id: "Manage Approvals",
                configuration: "",
				text : "konybb.settings.ManageApprovals" ,
				toolTip : "konybb.settings.ManageApprovals",
				 isVisible: function() {
                    return true;
                },
                onClick: function() {
                        /*var settingsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("SettingsNewApprovalUIModule");
                        settingsModule.presentationController.setContractDetailsForApprovalMatrices();   */ 
                        kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                            "moduleName": "SettingsNewApprovalUIModule",
                            "appName": "ApprovalMatrixMA"
                        }).presentationController.setContractDetailsForApprovalMatrices();                 
                        
                    },
              
            }, {
               id: "Signatory Groups",
                configuration: "",
				text : "konybb.settings.signatoryGroups" ,
				toolTip : "konybb.settings.signatoryGroups",
				 isVisible: function() {
                    return kony.application.getCurrentBreakpoint() !== 640 && !orientationHandler.isMobile && checkUserPermission('SIGNATORY_GROUP_VIEW');
                },
              onClick: function() {
                        /*var settingsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("SettingsNewApprovalUIModule");
                        settingsModule.presentationController.getAllSignatoryGroupsbyCoreCustomerIds();        */
                        kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                            "moduleName": "SettingsNewApprovalUIModule",
                            "appName": "ApprovalMatrixMA"
                        }).presentationController.getAllSignatoryGroupsbyCoreCustomerIds();
                        
                    },
              
                
            }]
        }
    }, {
        isVisible: function() {
            return (applicationManager.getConfigurationManager().checkUserPermission("CDP_CONSENT_VIEW"));
        },
        id: "CONSENT MANAGEMENT",
        menu: "flxConsentManagement",
        toolTip: "i18n.ProfileManagement.Consent",
        text: "i18n.ProfileManagement.Consent",
        skin: "sknLblFontType0a57b91c10db243",
        //icon: "lblConsentManagementCollapse",
        icon: "4",
        subMenu: {
            children: [{
                isVisible: function() {
                    return true;
                },
                id: "Your Consent",
                configuration: "",
                text: "i18n.ProfileManagement.yourConsent",
                toolTip: "i18n.ProfileManagement.yourConsent",
                onClick: function() {
                    var consentModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "ConsentMgmtMA", "moduleName" : "CDPConsentUIModule"});
                    consentModule.presentationController.showConsentManagement();
                }
            }]
        }
    }, {
        isVisible: function() {
            return (applicationManager.getConfigurationManager().checkUserPermission("PSD2_TPP_CONSENT_VIEW"));
          //&& (applicationManager.getConfigurationManager().newSettings==="true");
        },
        id: "MANAGE ACCOUNT ACCESS",
        menu: "flxManageAccountAccess",
        toolTip: "i18n.ProfileManagement.ManageAccountAccess",
        text: "i18n.ProfileManagement.ManageAccountAccess",
        //skin: "sknLblFontType0a57b91c10db243",
        //icon: "lblConsentManagementCollapse",
        icon: "4",
        subMenu: {
            children: [{
                isVisible: function() {
                    return true;
                },
                id: "From Third Parties",
                configuration: "",
                text: "i18n.ProfileManagement.FromThirdParties",
                toolTip: "i18n.ProfileManagement.FromThirdParties",
                onClick: function() {
                    var manageAccountAccessModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" : "ConsentMgmtMA", "moduleName" : "PSD2ConsentUIModule"});
                   manageAccountAccessModule.presentationController.showManageAccountAccess();   
                }
            }]
        }    
    
    }];
    return {
        config: widgetsMap
    };
});
