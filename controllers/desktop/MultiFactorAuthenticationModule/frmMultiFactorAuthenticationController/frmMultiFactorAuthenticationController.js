/**
 * Description of Module representing a MFA form.
 * @module frmMultiFactorAuthenticationController
 */
define(['CommonUtilities', 'OLBConstants', 'FormControllerUtility', 'ViewConstants'], function(CommonUtilities, OLBConstants, FormControllerUtility, ViewConstants) {
    return /** @alias module:frmMultiFactorAuthenticationController */ {
        /** updates the present Form based on required function.
         * @param {uiDataMap[]} uiDataMap
         */
        updateFormUI: function(uiDataMap) {
            if (uiDataMap.progressBar === true) {
                FormControllerUtility.showProgressBar(this.view);
            } else if (uiDataMap.progressBar === false) {
                FormControllerUtility.hideProgressBar(this.view);
            }
            if (uiDataMap.serverError) {
                FormControllerUtility.hideProgressBar(this.view);
                this.showServerError(uiDataMap.serverError);
            } else {
                this.hideServerError();
            }
            if (uiDataMap.hamburgerSelection) {
                this.highlightHamburgerSelections(uiDataMap.hamburgerSelection);
            }
            if (uiDataMap.breadCrumbData) {
                this.showBreadcrumbForMFA(uiDataMap.breadCrumbData);
            }
            if (uiDataMap.termsAndConditions) {
                this.setTermsAndConditionsData(uiDataMap.termsAndConditions);
            }
            if (uiDataMap.secureAccessCodeOptions) {
                this.showSecureAccessCodeOptions(uiDataMap.secureAccessCodeOptions);
            }
            if (uiDataMap.secureAccessCodeSent) {
                this.showEnterSecureAccessCodeScreen();
            }
            if (uiDataMap.incorrectSecureAccessCode) {
                this.showIncorrectSecureAccessCodeWarning();
            }
            if (uiDataMap.cvvCardSelection) {
                this.showCVVScreen(uiDataMap.cards);
            }
            if (uiDataMap.incorrectCVV) {
                this.showIncorrectCVVWarning();
            }
            if (uiDataMap.securityQuestions) {
                this.showSecurityQuestionsScreen(uiDataMap.securityQuestions);
            }
            if (uiDataMap.incorrectSecurityAnswers) {
                this.showIncorrectSecurityAnswersWarning();
            }
            this.AdjustScreen();
        },
        /**
         * AdjustScreen - Method that sets the height of footer properly.
         */
        AdjustScreen: function() {
            var mainheight;
            var screenheight = kony.os.deviceInfo().screenHeight;
            mainheight = this.view.customheader.info.frame.height + this.view.flxMain.info.frame.height;
            var diff = screenheight - mainheight;
            if (mainheight < screenheight) {
                diff = diff - this.view.flxFooter.info.frame.height;
                if (diff > 0) {
                    this.view.flxFooter.top = mainheight + diff + 40 + "dp";
                } else {
                    this.view.flxFooter.top = mainheight + 40 + "dp";
                }
            } else {
                this.view.flxFooter.top = mainheight + 40 + "dp";
            }
            this.view.forceLayout();
        },
        /**
         * frmMultiFactorAuthenticationPreShow - Pre show for this form.
         */
        frmMultiFactorAuthenticationPreShow: function() {
            FormControllerUtility.updateWidgetsHeightInInfo(this, ['customheader', 'flxMain', 'flxFooter', 'flxHeader']);
            var scope = this;
            this.view.breadcrumb.setVisibility(false);
            this.view.customheader.forceCloseHamburger();
            this.view.customheader.topmenu.flxContextualMenu.setVisibility(false);
            this.view.customheader.topmenu.btnHamburger.skin = "btnHamburgerskn";
            this.view.customheader.topmenu.flxTransfersAndPay.skin = ViewConstants.SKINS.BLANK_SKIN_TOPMENU;
            this.view.customheader.topmenu.flxaccounts.skin = ViewConstants.SKINS.BLANK_SKIN_FLEX;
            this.view.onBreakpointChange = function() {
                scope.onBreakpointChange(kony.application.getCurrentBreakpoint());
            };
            this.onBreakpointChange(kony.application.getCurrentBreakpoint());
            applicationManager.getNavigationManager().applyUpdates(this);
            this.AdjustScreen();
        },
        /**
         * showBreadcrumbForMFA - Enables breadcrumb and sets the text based on context.
         * @param {String} breadCrumb1 Breadcrumb text. breadCrumb text
         */
        showBreadcrumbForMFA: function(breadCrumb1) {
            var self = this;
            self.presenter = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("MultiFactorAuthenticationModule").presentationController;
            var breadCrumbData = [{
                'text': breadCrumb1,
                'callback': function() {
                    FormControllerUtility.showProgressBar(self.view);
                    self.presenter.cancelCallback();
                }
            }, {
                'text': kony.i18n.getLocalizedString("i18n.MFA.authentication"),
                'callback': null
            }];
            // this.view.breadcrumb.setVisibility(true);
            this.view.breadcrumb.setBreadcrumbData(breadCrumbData);
            this.frmMultiFactorAuthenticationPreShow();
        },
        /**
         * showServerError - Method to show error flex.
         * @param {String} errorMsg Error message to be displayed.
         */
        showServerError: function(errorMsg) {
            this.view.rtxDowntimeWarning.text = errorMsg;
            this.view.flxDowntimeWarning.setVisibility(true);
            this.view.rtxDowntimeWarning.setFocus(true);
            this.view.forceLayout();
        },
        /**
         * hideServerError - Method to hide error flex.
         */
        hideServerError: function() {
            this.view.flxDowntimeWarning.setVisibility(false);
            this.view.forceLayout();
        },
        /**
         * showSecureAccessCodeOptions - Entry point for secure access code flow. Shows the options for receiving a code.
         * @param {object} secureAccessCodeOptions - secureAccessCodeOptions.
         */
        showSecureAccessCodeOptions: function(secureAccessCodeOptions) {
            var self = this;
            self.presenter = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("MultiFactorAuthenticationModule").presentationController
            this.hideAllMFAViews();
            this.view.flxOptionToRecieveAccessCode.setVisibility(true);
            if (secureAccessCodeOptions.isEmailEnabled === "true") {
                this.view.LetsAuthenticateSecureAccessCode.imgCheckboxEmailId.src = OLBConstants.IMAGES.CHECKED_IMAGE;
            } else {
                this.view.LetsAuthenticateSecureAccessCode.imgCheckboxEmailId.src = OLBConstants.IMAGES.UNCHECKED_IMAGE;
            }
            this.view.LetsAuthenticateSecureAccessCode.flxCheckboxEmailId.onTouchEnd = function() {
                FormControllerUtility.toggleCheckbox(self.view.LetsAuthenticateSecureAccessCode.imgCheckboxEmailId);
                if (FormControllerUtility.isCheckboxChecked(self.view.LetsAuthenticateSecureAccessCode.imgCheckboxEmailId) || FormControllerUtility.isCheckboxChecked(self.view.LetsAuthenticateSecureAccessCode.imgCheckBoxPhoneNo)) {
                    FormControllerUtility.enableButton(self.view.LetsAuthenticateSecureAccessCode.btnProceed);
                } else {
                    FormControllerUtility.disableButton(self.view.LetsAuthenticateSecureAccessCode.btnProceed);
                }
            };
            if (secureAccessCodeOptions.isPhoneEnabled === "true") {
                this.view.LetsAuthenticateSecureAccessCode.imgCheckBoxPhoneNo.src = OLBConstants.IMAGES.CHECKED_IMAGE;
            } else {
                this.view.LetsAuthenticateSecureAccessCode.imgCheckBoxPhoneNo.src = OLBConstants.IMAGES.UNCHECKED_IMAGE;
            }
            this.view.LetsAuthenticateSecureAccessCode.flxCheckBoxPhoneNo.onTouchEnd = function() {
                FormControllerUtility.toggleCheckbox(self.view.LetsAuthenticateSecureAccessCode.imgCheckBoxPhoneNo);
                if (FormControllerUtility.isCheckboxChecked(self.view.LetsAuthenticateSecureAccessCode.imgCheckboxEmailId) || FormControllerUtility.isCheckboxChecked(self.view.LetsAuthenticateSecureAccessCode.imgCheckBoxPhoneNo)) {
                    FormControllerUtility.enableButton(self.view.LetsAuthenticateSecureAccessCode.btnProceed);
                } else {
                    FormControllerUtility.disableButton(self.view.LetsAuthenticateSecureAccessCode.btnProceed);
                }
            };
            this.view.LetsAuthenticateSecureAccessCode.lblRegisteredEmailId.text = self.maskEmail(self.presenter.getPrimaryEmail());
            this.view.LetsAuthenticateSecureAccessCode.lblPhoneNo.text = self.maskPhoneNumber(self.presenter.getPrimaryContactNumber());
            this.view.LetsAuthenticateSecureAccessCode.btnProfileSetting.text = kony.i18n.getLocalizedString("i18n.ProfileManagement.profilesettings");
            this.view.LetsAuthenticateSecureAccessCode.btnProfileSetting.toolTip = kony.i18n.getLocalizedString("i18n.ProfileManagement.profilesettings");
            this.view.LetsAuthenticateSecureAccessCode.btnProfileSetting.onClick = function() {
                self.presenter.showSecureAccessSettings();
            };
            this.view.LetsAuthenticateSecureAccessCode.btnCancel.onClick = function() {
                FormControllerUtility.showProgressBar(self.view);
                self.presenter.cancelCallback();
            };
            this.view.LetsAuthenticateSecureAccessCode.btnProceed.onClick = function() {
                var options = {};
                options.email = FormControllerUtility.isCheckboxChecked(self.view.LetsAuthenticateSecureAccessCode.imgCheckboxEmailId);
                options.phone = FormControllerUtility.isCheckboxChecked(self.view.LetsAuthenticateSecureAccessCode.imgCheckBoxPhoneNo);
                FormControllerUtility.showProgressBar(self.view);
                self.presenter.sendSecureAccessCode(options);
            };
            this.view.forceLayout();
            this.AdjustScreen();
            FormControllerUtility.hideProgressBar(this.view);
        },
        /**
         * showEnterSecureAccessCodeScreen - Shows the screen where user enters the code.
         */
        showEnterSecureAccessCodeScreen: function() {
            var self = this;
            self.presenter = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("MultiFactorAuthenticationModule").presentationController;
            this.hideAllMFAViews();
            this.view.flxSecureAccessCode.setVisibility(true);
            this.view.SecureAccessCode.flxWarning.setVisibility(false);
            this.view.SecureAccessCode.tbxEnterCVVCode.text = "";
            this.view.SecureAccessCode.tbxEnterCVVCode.secureTextEntry = true;
            FormControllerUtility.disableButton(self.view.SecureAccessCode.btnProceed);
            this.view.SecureAccessCode.tbxEnterCVVCode.onKeyUp = function() {
                if (!self.isValidSecureAccessCode(self.view.SecureAccessCode.tbxEnterCVVCode.text)) {
                    FormControllerUtility.disableButton(self.view.SecureAccessCode.btnProceed);
                } else {
                    FormControllerUtility.enableButton(self.view.SecureAccessCode.btnProceed);
                }
            };
            this.view.SecureAccessCode.imgViewCVVCode.onTouchEnd = function() {
                self.toggleMaskingForTextBox(self.view.SecureAccessCode.tbxEnterCVVCode);
            };
            var resendOtpTimer;
            this.view.SecureAccessCode.btnCancel.onClick = function() {
                FormControllerUtility.showProgressBar(self.view);
                clearTimeout(resendOtpTimer);
                self.presenter.cancelCallback();
            };
            self.view.SecureAccessCode.lblResendOption2.setEnabled(false);
            self.view.SecureAccessCode.lblResendOption2.skin = OLBConstants.SKINS.LOGIN_RESEND_OTP_DISABLED;
            resendOtpTimer = setTimeout(
                function() {
                    self.view.SecureAccessCode.lblResendOption2.setEnabled(true);
                    self.view.SecureAccessCode.lblResendOption2.skin = OLBConstants.SKINS.LOGIN_RESEND_OTP_ENABLED;
                }, 5000);
            this.view.SecureAccessCode.lblResendOption2.onTouchEnd = function() {
                self.view.SecureAccessCode.tbxEnterCVVCode.text = "";
                FormControllerUtility.disableButton(self.view.SecureAccessCode.btnProceed);
                self.view.SecureAccessCode.flxWarning.setVisibility(true);
                self.view.SecureAccessCode.lblWarning.text = kony.i18n.getLocalizedString("i18n.MFA.ResentOTPMessage");
                self.view.SecureAccessCode.lblResendOption2.setEnabled(false);
                self.view.SecureAccessCode.lblResendOption2.skin = OLBConstants.SKINS.LOGIN_RESEND_OTP_DISABLED;
                resendOtpTimer = setTimeout(
                    function() {
                        self.view.SecureAccessCode.lblResendOption2.setEnabled(true);
                        self.view.SecureAccessCode.lblResendOption2.skin = OLBConstants.SKINS.LOGIN_RESEND_OTP_ENABLED;
                    }, 5000);
            };
            this.view.SecureAccessCode.btnProceed.onClick = function() {
                clearTimeout(resendOtpTimer);
                self.view.SecureAccessCode.lblResendOption2.setEnabled(false);
                self.view.SecureAccessCode.lblResendOption2.skin = OLBConstants.SKINS.LOGIN_RESEND_OTP_DISABLED;
                var params = {};
                params.enteredAccessCode = self.view.SecureAccessCode.tbxEnterCVVCode.text;
                FormControllerUtility.showProgressBar(self.view);
                self.view.SecureAccessCode.flxWarning.setVisibility(false);
                self.presenter.verifySecureAccessCode(params);
            };
            this.view.forceLayout();
            this.AdjustScreen();
            FormControllerUtility.hideProgressBar(this.view);
        },
        /**
         * isValidSecureAccessCode - Validates given secure access code.
         * @param {object} secureaccesscode .secure access code
         * @returns {object} secure accessCode
         */
        isValidSecureAccessCode: function(secureaccesscode) {
            if (secureaccesscode.length !== OLBConstants.OTPLength) return false;
            var regex = new RegExp('^[0-9]+$');
            return regex.test(secureaccesscode);
        },
        /**
         * showIncorrectSecureAccessCodeWarning - Shows the "incorrect code entered" warning.
         */
        showIncorrectSecureAccessCodeWarning: function() {
            this.view.SecureAccessCode.flxWarning.setVisibility(true);
            this.view.SecureAccessCode.lblWarning.text = kony.i18n.getLocalizedString("i18n.MFA.EnteredSecureAccessCodeDoesNotMatch");
            FormControllerUtility.hideProgressBar(this.view);
            this.view.forceLayout();
            this.AdjustScreen();
        },
        /**
         * maskEmail - Masks a given email. Eg: 'abcdef.a@kony.com" will be masked to 'a******a@kony.com'
         * @param {String} email email
         * @returns {String} email  masked email.
         */
        maskEmail: function(email) {
            var eArr = email.split('@');
            var maskedEmail = "";
            maskedEmail += eArr[0].charAt(0);
            for (var i = 0; i < (eArr[0].length - 2); i++)
                maskedEmail += "*";
            maskedEmail += eArr[0].charAt(eArr[0].length - 1) + '@' + eArr[1];
            return maskedEmail;
        },
        /**
         * maskPhoneNumber - Masks a given phone number. Eg: '1234567890" will be masked to '******7890'
         * @param {String} phone  phone number.
         * @returns {String} maskedPhoneNumber masked phone number.
         */
        maskPhoneNumber: function(phone) {
            var maskedPhoneNumber = "";
            for (var i = 0; i < phone.length - 4; i++)
                maskedPhoneNumber += "*";
            maskedPhoneNumber += phone.slice(-4);
            return maskedPhoneNumber;
        },
        /**
         * toggleMaskingForTextBox - Toggles the secure text property for a given textbox
         * @param {String}  widgetId . widget
         */
        toggleMaskingForTextBox: function(widgetId) {
            widgetId.secureTextEntry = !widgetId.secureTextEntry;
        },
        /**
         * showCVVScreen - Sets the UI for CVV flow.
         * @param {object} cards  cards.
         */
        showCVVScreen: function(cards) {
            var self = this;
            this.hideAllMFAViews();
            self.presenter = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("MultiFactorAuthenticationModule").presentationController;
            this.view.flxEnterCVVCode.setVisibility(true);
            var cardsMasterData = FormControllerUtility.getListBoxDataFromObjects(cards, "cardId", self.getDisplayNameForCard);
            this.view.EnterCVVModule.lbxDefaultAccountForSending.masterData = cardsMasterData;
            this.view.EnterCVVModule.lbxDefaultAccountForSending.onSelection = function() {
                self.view.EnterCVVModule.tbxEnterCVVCode.text = "";
            };
            this.view.EnterCVVModule.tbxEnterCVVCode.text = "";
            this.view.EnterCVVModule.flxDefaultAccountForSendingInfo.onClick = function() {
                self.view.InfoPopUpIcon.isVisible = true;
                self.view.InfoPopUpIcon.left = "183dp";
                self.view.InfoPopUpIcon.top = "240dp";
            };
            this.view.EnterCVVModule.flxEnterCVVCodeInfo.onClick = function() {
                self.view.InfoPopUpIcon.isVisible = true;
                self.view.InfoPopUpIcon.left = "100dp";
                self.view.InfoPopUpIcon.top = "300dp";
            };
            this.view.InfoPopUpIcon.flxCross.onClick = function() {
                self.view.InfoPopUpIcon.isVisible = false;
            };
            FormControllerUtility.disableButton(this.view.EnterCVVModule.btnProceed);
            this.view.EnterCVVModule.tbxEnterCVVCode.onKeyUp = function() {
                if (!self.isValidCVV(self.view.EnterCVVModule.tbxEnterCVVCode.text)) {
                    FormControllerUtility.disableButton(self.view.EnterCVVModule.btnProceed);
                } else {
                    FormControllerUtility.enableButton(self.view.EnterCVVModule.btnProceed);
                }
            };
            this.view.EnterCVVModule.tbxEnterCVVCode.secureTextEntry = true;
            this.view.EnterCVVModule.imgViewCVVCode.onTouchEnd = function() {
                self.toggleMaskingForTextBox(self.view.EnterCVVModule.tbxEnterCVVCode);
            };
            this.view.EnterCVVModule.flxWarningEnterCVV.setVisibility(false);
            this.view.EnterCVVModule.btnCancel.onClick = function() {
                FormControllerUtility.showProgressBar(self.view);
                self.presenter.cancelCallback();
            };
            this.view.EnterCVVModule.btnProceed.onClick = function() {
                FormControllerUtility.showProgressBar(self.view);
                self.view.EnterCVVModule.flxWarningEnterCVV.setVisibility(false);
                var options = {};
                options.cardId = self.view.EnterCVVModule.lbxDefaultAccountForSending.selectedKey;
                options.cvv = self.view.EnterCVVModule.tbxEnterCVVCode.text;
                self.presenter.verifyCVV(options);
            };
            FormControllerUtility.hideProgressBar(this.view);
        },
        /**
         * getCardsDataForListbox - Returns the master data for cards list box.
         * @param {Array} cards cards array.
         * @returns {Array} masterData Master Data for cards.
         */
        getCardsDataForListbox: function(cards) {
            var masterData = [];
            for (var i in cards) {
                masterData.push([cards[i].cardId, this.getDisplayNameForCard(cards[i])]);
            }
            return masterData;
        },
        /**
         * getDisplayNameForCard - Returns the display value for card. (Combination of card name and number)
         * @param {String} card card object.
         * @returns {String} card display name.
         */
        getDisplayNameForCard: function(card) {
            return card.cardProductName + "... " + card.maskedCardNumber.slice(-8);
        },
        /**
         * isValidCVV - Validates given cvv.
         * @param {object} cvv cvv number.
         * @returns {boolean} status
         */
        isValidCVV: function(cvv) {
            if (cvv.length !== 3) return false;
            var regex = new RegExp('^[0-9]+$');
            return regex.test(cvv);
        },
        /**
         * showIncorrectCVVWarning - Shows the "incorrect cvv entered" warning.
         * @throws {}
         */
        showIncorrectCVVWarning: function() {
            this.view.EnterCVVModule.flxWarningEnterCVV.setVisibility(true);
            this.view.EnterCVVModule.lblWarningEnterCVV.text = kony.i18n.getLocalizedString("i18n.MFA.IncorrectCVV");
            FormControllerUtility.hideProgressBar(this.view);
            this.view.forceLayout();
            this.AdjustScreen();
        },
        /**
         * showSecurityQuestionsScreen - Sets the UI for Security Questions flow.
         * @param {object} securityQuestions security Questions.
         */
        showSecurityQuestionsScreen: function(securityQuestions) {
            var self = this;
            self.presenter = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("MultiFactorAuthenticationModule").presentationController;
            this.hideAllMFAViews();
            this.view.flxAnswerSecurityQuestions.setVisibility(true);
            FormControllerUtility.hideErrorForTextboxFields([this.view.AnswerSecurityQuestionsModule.tbxAnswers2, this.view.AnswerSecurityQuestionsModule.tbxAnswers1], this.view.AnswerSecurityQuestionsModule.flxWarningSecurityQuestions);
            this.view.AnswerSecurityQuestionsModule.flxWarningSecurityQuestions.setVisibility(false);
            this.view.AnswerSecurityQuestionsModule.lblAnswerSecurityQuestion1.text = securityQuestions[0].Question;
            this.view.AnswerSecurityQuestionsModule.lblAnswerSecurityQuestion2.text = securityQuestions[1].Question;
            this.view.AnswerSecurityQuestionsModule.tbxAnswers1.text = "";
            this.view.AnswerSecurityQuestionsModule.tbxAnswers1.onKeyUp = function() {
                FormControllerUtility.hideErrorForTextboxFields([self.view.AnswerSecurityQuestionsModule.tbxAnswers2, self.view.AnswerSecurityQuestionsModule.tbxAnswers1], self.view.AnswerSecurityQuestionsModule.flxWarningSecurityQuestions);
                if (self.view.AnswerSecurityQuestionsModule.tbxAnswers1.text === "" || self.view.AnswerSecurityQuestionsModule.tbxAnswers2.text === "") {
                    FormControllerUtility.disableButton(self.view.AnswerSecurityQuestionsModule.btnProceed);
                } else {
                    FormControllerUtility.enableButton(self.view.AnswerSecurityQuestionsModule.btnProceed);
                }
            };
            this.view.AnswerSecurityQuestionsModule.tbxAnswers2.text = "";
            this.view.AnswerSecurityQuestionsModule.tbxAnswers2.onKeyUp = function() {
                FormControllerUtility.hideErrorForTextboxFields([self.view.AnswerSecurityQuestionsModule.tbxAnswers2, self.view.AnswerSecurityQuestionsModule.tbxAnswers1], self.view.AnswerSecurityQuestionsModule.flxWarningSecurityQuestions);
                if (self.view.AnswerSecurityQuestionsModule.tbxAnswers1.text === "" || self.view.AnswerSecurityQuestionsModule.tbxAnswers2.text === "") {
                    FormControllerUtility.disableButton(self.view.AnswerSecurityQuestionsModule.btnProceed);
                } else {
                    FormControllerUtility.enableButton(self.view.AnswerSecurityQuestionsModule.btnProceed);
                }
            };
            FormControllerUtility.disableButton(this.view.AnswerSecurityQuestionsModule.btnProceed);
            this.view.AnswerSecurityQuestionsModule.btnCancel.onClick = function() {
                FormControllerUtility.showProgressBar(self.view);
                self.presenter.cancelCallback();
            };
            this.view.AnswerSecurityQuestionsModule.btnProceed.onClick = function() {
                self.view.AnswerSecurityQuestionsModule.flxWarningSecurityQuestions.setVisibility(false);
                var questionAnswers = [];
                questionAnswers.push({
                    'questionId': securityQuestions[0].SecurityQuestion_id,
                    'customerAnswer': self.view.AnswerSecurityQuestionsModule.tbxAnswers1.text
                }, {
                    'questionId': securityQuestions[1].SecurityQuestion_id,
                    'customerAnswer': self.view.AnswerSecurityQuestionsModule.tbxAnswers2.text
                });
                FormControllerUtility.showProgressBar(self.view);
                self.presenter.verifySecurityQuestionAnswers(questionAnswers);
            };
            FormControllerUtility.hideProgressBar(self.view);
            this.view.forceLayout();
            this.AdjustScreen();
        },
        /**
         * showIncorrectSecurityAnswersWarning - Shows the "incorrect security answers" warning.
         */
        showIncorrectSecurityAnswersWarning: function() {
            this.view.AnswerSecurityQuestionsModule.flxWarningSecurityQuestions.setVisibility(true);
            this.view.AnswerSecurityQuestionsModule.lblWarningSecurityQuestions.text = kony.i18n.getLocalizedString("i18n.MFA.EnteredSecurityQuestionsDoesNotMatch");
            FormControllerUtility.showErrorForTextboxFields([this.view.AnswerSecurityQuestionsModule.tbxAnswers2, this.view.AnswerSecurityQuestionsModule.tbxAnswers1], this.view.AnswerSecurityQuestionsModule.flxWarningSecurityQuestions);
            this.view.forceLayout();
            this.AdjustScreen();
            FormControllerUtility.hideProgressBar(this.view);
        },
        /**
         * hideAllMFAViews - Hides all the flexes in MFA Screen
         */
        hideAllMFAViews: function() {
            this.view.flxOptionToRecieveAccessCode.setVisibility(false);
            this.view.flxSecureAccessCode.setVisibility(false);
            this.view.flxEnterCVVCode.setVisibility(false);
            this.view.flxAnswerSecurityQuestions.setVisibility(false);
        },
        /**
         * highlightHamburgerSelections - Method that updates Top Menu.
         * @param {object} hamburgerSelection hamburger Selection
         */
        highlightHamburgerSelections: function(hamburgerSelection) {
            this.view.customheader.customhamburger.activateMenu(hamburgerSelection.selection1, hamburgerSelection.selection2);
        },
        /**
         * used to check terms and conditions
         * @param {object} termsAndConditions terms And Conditions
         */
        setTermsAndConditionsData: function(termsAndConditions) {
            this.view.TermsAndConditions.lblTermsAndConditions.text = termsAndConditions;
        },
        orientationHandler: null,
        onBreakpointChange: function(width) {
            kony.print('on breakpoint change');
            var scope = this;
            if (this.orientationHandler === null) {
                this.orientationHandler = new OrientationHandler();
            }
            this.orientationHandler.onOrientationChange(this.onBreakpointChange);
            this.view.CustomPopup.onBreakpointChangeComponent(scope.view.CustomPopup, width);
            if (width === 640) {
                this.view.AnswerSecurityQuestionsModule.btnProceed.centerY = "";
                this.view.AnswerSecurityQuestionsModule.btnCancel.centerY = ""
            } else {
                this.view.AnswerSecurityQuestionsModule.btnProceed.centerY = "50%";
                this.view.AnswerSecurityQuestionsModule.btnCancel.centerY = "50%"
            }
        },
        postShow: function() {
            this.AdjustScreen();
        }
    };
});