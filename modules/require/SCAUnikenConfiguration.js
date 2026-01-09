define([], function () {
    const SCAUnikenObjServices = {
        getDataModel: function (objServiceName, objectName) {
            var objSvc = kony.sdk.getCurrentInstance().getObjectService(objServiceName, {
                "access": "online"
            });
            return {
                customVerb: function (customVerb, params, callback) {
                    var dataObject = new kony.sdk.dto.DataObject(objectName);
                    for (let key in params) {
                        dataObject.addField(key, params[key]);
                    }
                    var options = {
                        "dataObject": dataObject
                    };
                    objSvc.customVerb(customVerb, options, success => callback(100, success), error => callback(200, error));
                }
            };
        }
    };
    return {


        startTime: "",
        ADD_NEW_PHONE_NUMBER: { "serviceName": "ADD_NEW_PHONE_NUMBER", "dataModelName": "SCAUser", "operationName": "updateMyProfileDetails", "objectName": "SCAUniken" },
        UPDATE_PHONE_NUMBER: { "serviceName": "UPDATE_PHONE_NUMBER", "dataModelName": "SCAUser", "operationName": "updateMyProfileDetails", "objectName": "SCAUniken" },
        ADD_NEW_EMAIL: { "serviceName": "ADD_NEW_EMAIL", "dataModelName": "SCAUser", "operationName": "updateMyProfileDetails", "objectName": "SCAUniken" },
        UPDATE_EMAIL_ADDRESS: { "serviceName": "UPDATE_EMAIL_ADDRESS", "dataModelName": "SCAUser", "operationName": "updateMyProfileDetails", "objectName": "SCAUniken" },
        RESET_PASSWORD: { "serviceName": "RESET_PASSWORD", "dataModelName": "CIBAPushOperation", "operationName": "initiateCIBAPush" },

        requestBody: {
            "Meta": {
                "EventType": "urn:com:temenos:security:event:payment:v1",
                "RiskScore": {
                    "Required": "10",
                    "Current": "1"
                },
                "TransactionId": "346436436246"
            },
            // "urn:com:temenos:security:event:payment:v1": {
            //     "Name": "Pay Acme",
            //     "ConsentId": "346436436246",
            //     "Initiation": {
            //         "InstructionIdentification": "ACME412",
            //         "EndToEndIdentification": "FRESCO.21302.GFX.20",
            //         "InstructedAmount": {
            //             "Amount": "10065.88",
            //             "Currency": "GBP"
            //         },
            //         "CreditorAccount": {
            //             "SchemeName": "UK.OBIE.SortCodeAccountNumber",
            //             "Identification": "08080021325698",
            //             "Name": "ACME Inc",
            //             "SecondaryIdentification": "0002"
            //         },
            //         "RemittanceInformation": {
            //             "Reference": "FRESCO-101",
            //             "Unstructured": "Internal ops code 5120101"
            //         }
            //     }
            // }
        },

        getRequestParams: function () {
            let self = this;
            return self.requestBody;
        },

        setEventDetails: function (flowType, data) {
            let self = this;
            let eventType = "";
            switch (flowType) {
                case ("WIRE_TRANSFERS"):
                    break;
                case ("ONE_TIME_WIRE_TRANSFERS"):
                    break;
                case ("SINGLE_BILL_PAY"):
                    break;
                case ("BULK_BILL_PAY"):
                    eventType = "urn:com:temenos:security:event:bulkpayment:v1";
                    self.requestBody[eventType] = self.setPaymentDetails(data);
                    break;
                case ("PAY_A_PERSON"):
                    eventType = "urn:com:temenos:security:event:payment:v1";
                    self.requestBody[eventType] = self.setPaymentDetails(data);
                    break;
                case ("TRANSFERS_EURO"):
                    break;
                case ("TRANSFERS_UPDATE"):
                    break;
                case ("TRANSFERS"):
                    break;
                case ("CREATE_BULKWIRE_TRANSFER_TEMPLATE"):
                    break;
                case ("CREATE_BULKWIRE_TRANSFER"):
                    break;
                case ("LOCK_CARD"):
                    eventType = "urn:com:temenos:security:event:cards:v1";
                    self.requestBody[eventType] = self.setCardDetails(data);
                    break;
                case ("UNLOCK_CARD"):
                    break;
                case ("CHANGE_PIN"):
                    break;
                case ("REPORT_LOST"):
                    break;
                case ("CANCEL_CARD"):
                    break;
                case ("REPLACE_CARD"):
                    break;
                case ("UPDATE_USERNAME"):
                    break;
                case ("UPDATE_PASSWORD"):
                    break;
                case ("SECURITYQUESTION_RESET"):
                    break;
                case ("PSD2_TPP_CONSENT_REVOKED"):
                    break;
                default:
                    break;
            };
            self.requestBody.Meta.EventType = eventType;
            self.requestBody.Meta.RiskScore.Required = "";
            self.requestBody.Meta.RiskScore.Current = "";
            // self.requestBody.Meta.TransactionId = data.MFAAttributes.serviceKey;
        },

        setPaymentDetails: function (data) {
            return {
                "Name": "Pay Acme",
                "ConsentId": "346436436246",
                "Initiation": {
                    "InstructionIdentification": "ACME412",
                    "EndToEndIdentification": "FRESCO.21302.GFX.20",
                    "InstructedAmount": {
                        "Amount": "10065.88",
                        "Currency": "GBP"
                    },
                    "CreditorAccount": {
                        "SchemeName": "UK.OBIE.SortCodeAccountNumber",
                        "Identification": "08080021325698",
                        "Name": "ACME Inc",
                        "SecondaryIdentification": "0002"
                    },
                    "RemittanceInformation": {
                        "Reference": "FRESCO-101",
                        "Unstructured": "Internal ops code 5120101"
                    }
                }
            };
        },

        setCardDetails: function (data) {
            return {

            };
        },
        /**
             * This method returns the locale value of the argument passed if available 
             * or it will return the argument value itself
             */
        getStringFromi18n: function (stringValue) {
            return kony.i18n.getLocalizedString(stringValue) ? kony.i18n.getLocalizedString(stringValue) : stringValue;
        },

        /**
         * This method fetches the auth_req_id which is required to get the user approval from SCA Notification
         */
        sendSCANotificationRequest: function (params, action, successCallback, failureCallback) {
            let self = this;
            params.serviceName = action.serviceName;
            if (!params.auth_req_id) {
                kony.application.showLoadingScreen();
            }
            let dataModel = SCAUnikenObjServices.getDataModel(action.objectName, action.dataModelName);
            dataModel.customVerb(action.operationName, params, completionCallback);

            function completionCallback(status, data, error) {
                if (status == kony.mvc.constants.STATUS_SUCCESS && data && !data.errmsg) {
                    self.addCIBAStatusLoadingScreen();
                    data.auth_req_id = data.auth_req_id ? data.auth_req_id : data.authReqId;
                    self.fetchStatusOfSCANotification(params, action, data.auth_req_id, successCallback, failureCallback);
                } else {
                    failureCallback(error ? error.errmsg ? error.errmsg : "failed" : data ? data.errmsg ? data.errmsg : "failed" : "failed");
                }
            }
        },

        /**
         * This method shows a pop up msg requesting SCA notifiation approval
         */
        addCIBAStatusLoadingScreen: function () {
            let self = this;
            let currform = kony.application.getCurrentForm();
            let Popup = new com.temenos.infinity.sca.UnikenPopup({
                "appName": "ResourcesUnikenMA",
                "height": "100%",
                "id": "Popup",
                "isVisible": true,
                "left": "0dp",
                "masterType": constants.MASTER_TYPE_USERWIDGET,
                "isModalContainer": true,
                "skin": "sknflx000000op50",
                "top": "0dp",
                "width": "100%",
                "zIndex": 1001,
                "overrides": {
                    "Popup": {
                        "right": "viz.val_cleared",
                        "bottom": "viz.val_cleared",
                        "minWidth": "viz.val_cleared",
                        "minHeight": "viz.val_cleared",
                        "maxWidth": "viz.val_cleared",
                        "maxHeight": "viz.val_cleared",
                        "centerX": "viz.val_cleared",
                        "centerY": "viz.val_cleared"
                    },
                    "flxPopup": {
                        "skin": "sknflxffffffRadius5px"
                    },
                    "imgLoading": {
                        "src": "rb_4_0_ad_loading_indicator.gif"
                    },
                    "ldlPopupText": {
                        "text": self.getStringFromi18n("i18n.DeviceRegistration.MsgApproveRequestNotificationSent"),
                        "skin": "sknlbl424242SSPReg17px"
                    }
                }
            }, {
                "overrides": {}
            }, {
                "overrides": {}
            });
            Popup.headingtext = self.getStringFromi18n("i18n.DeviceRegistration.MsgApproveRequestNotificationSent");
            currform.add(Popup);
            if (currform.flxHeader && currform.flxHeader.info.frame && currform.flxFooter && currform.flxFooter.info.frame && currform.flxContainer.info.frame)
                currform.Popup.height = currform.flxHeader.info.frame.height + currform.flxFooter.info.frame.height + currform.flxContainer.info.frame.height + "dp";
            kony.application.dismissLoadingScreen();
            currform.forceLayout();
        },

        removeCIBAStatusLoadingScreen: function () {
            var currform = kony.application.getCurrentForm();
            if (currform.Popup) {
                currform.Popup.setVisibility(false);
                currform.remove(currform.Popup);
            }
            currform.forceLayout();
        },

        /**
         * This method keep checking for user approval of SCA Notification
         */
        fetchStatusOfSCANotification: function (params, action, auth_req_id, successCallback, failureCallback) {
            let self = this;
            self.startTime = new Date().getTime();
            let request = { "auth_req_id": auth_req_id };
            let objectName = "SCAUniken";
            let dataModel = SCAUnikenObjServices.getDataModel(objectName, "AuthStatus");
            kony.timer.schedule("cibatimer", function () {
                dataModel.customVerb('fetch', request, completionCallback);
            }, 10, true);

            function notificationSuccessCallback() {
                if (action.serviceName === "RESET_PASSWORD") {
                    successCallback({ "auth_req_id": auth_req_id });
                } else {
                    kony.application.showLoadingScreen();
                    request = { "auth_req_id": auth_req_id };
                    dataModel = SCAUnikenObjServices.getDataModel(action.objectName, action.dataModelName);
                    dataModel.customVerb(action.operationName, request, performAction);
                    function performAction(status, data, error) {
                        if (status === kony.mvc.constants.STATUS_SUCCESS) {
                            successCallback(data);
                        } else {
                            failureCallback(self.constructErrorResponse(action.serviceName, error.errmsg, params));
                        }
                    }
                }
            }

            function completionCallback(status, data, error) {
                let currentTime = new Date().getTime();
                if (data && data.action_response && data.action_response === "Accept") {
                    kony.timer.cancel("cibatimer");
                    self.removeCIBAStatusLoadingScreen();
                    notificationSuccessCallback();
                } else if (currentTime - self.startTime > 30000 || data.action_response === "Deny") {
                    kony.timer.cancel("cibatimer");
                    let errmsg = self.getStringFromi18n(data.action_response === "Deny" ? "i18n.DeviceRegistration.ErrMsgApprovalDenied" : "i18n.DeviceRegistration.ErrMsgApprovalTimedOut");
                    failureCallback(self.constructErrorResponse(action.serviceName, errmsg));
                    self.removeCIBAStatusLoadingScreen();
                }
            }
        },

        constructErrorResponse: function (serviceName, errmsg, params) {
            let response;
            switch (serviceName) {
                case "ADD_NEW_PHONE_NUMBER": case "UPDATE_PHONE_NUMBER":
                    {
                        response = { "errorMessage": params ? params.phoneNumbers[0].phoneCountryCode + "-" + params.phoneNumbers[0].phoneNumber + " not updated in Infinity System" : errmsg };
                        break;
                    }
                case "ADD_NEW_EMAIL": case "UPDATE_EMAIL_ADDRESS":
                    {
                        response = { "errorMessage": params ? params.EmailIds[0].value + " not updated in Infinity System" : errmsg };
                        break;
                    }
                default: {
                    response = { "errorMessage": errmsg, "errmsg": errmsg };
                    break;
                }
            }
            return response;
        },

    };
});