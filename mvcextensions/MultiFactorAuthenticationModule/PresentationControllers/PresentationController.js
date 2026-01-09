/**
 * @module MultiFactorAuthenticationPresentationController
 */
define(['CommonUtilities', 'OLBConstants'], function(CommonUtilities, OLBConstants) {
    /**
     *  Multi Factor Authentication PresentationController.
     * @class
     * @alias module:MultiFactorAuthenticationPresentationController
     */
    function MultiFactorAuthenticationPresentationController() {
        kony.mvc.Presentation.BasePresenter.call(this);
    }
    inheritsFrom(MultiFactorAuthenticationPresentationController, kony.mvc.Presentation.BasePresenter);
    MultiFactorAuthenticationPresentationController.prototype.initializePresentationController = function() {};
    /**
     * used to show the billPay Page and executes the particular Page.
     * @param {string} frm  used to load the form
     * @param {object}  data  used to load the particular form and having key value pair.
     */
    MultiFactorAuthenticationPresentationController.prototype.showView = function(frm, data) {
        applicationManager.getNavigationManager().navigateTo(frm);
        applicationManager.getNavigationManager().updateForm(data, frm);
    };
    /**
     * cancelCallback - Dummy function. Whenever an MFA flow is started, cancelCallback will contain the actual cancel on click for that operation.
     */
    MultiFactorAuthenticationPresentationController.prototype.cancelCallback = function() {};
    /**
     * successCallback - Dummy function. Whenever an MFA flow is started, successCallback will contain the actual success callback for that operation.
     */
    MultiFactorAuthenticationPresentationController.prototype.successCallback = function() {};
    /**
     * startSecureAccessCodeFlow - Entry point for Secure Access Code flow. This method also initiates the cancel and success callbacks.
     * @param {Object} context context which contains callbacks and breadcrumb, menu context etc.,
     */
    MultiFactorAuthenticationPresentationController.prototype.startSecureAccessCodeFlow = function(context) {
        //Presenting UI to show Loading indicator first.
        var self = this;
        this.showView('frmMultiFactorAuthentication', {
            progressBar: true
        });
        var mfaModel = {};
        mfaModel.breadCrumbData = context.breadcrumb;
        mfaModel.hamburgerSelection = context.hamburgerSelection;
        mfaModel.termsAndConditions = context.termsAndConditions;
        this.cancelCallback = context.cancelCallback;
        this.successCallback = context.successCallback;
        applicationManager.getUserPreferencesManager().getSecureAccessCodeOptions(self.getSecureAccessCodeOptionsSuccessCallBack.bind(self, mfaModel), self.getSecureAccessCodeOptionsFailureCallBack.bind(self));
    };
    /**
     * used to show the mfa secure access page.
     * @param {object} mfaModel mfa model
     * @param {object} response secure code response
     */
    MultiFactorAuthenticationPresentationController.prototype.getSecureAccessCodeOptionsSuccessCallBack = function(mfaModel, response) {
        var self = this;
        if (response[0] !== null && response[0] !== undefined) {
            mfaModel.secureAccessCodeOptions = {
                'isPhoneEnabled': response[0].isPhoneEnabled,
                'isEmailEnabled': response[0].isEmailEnabled
            };
            self.showView('frmMultiFactorAuthentication', mfaModel);
        } else {
            CommonUtilities.showServerDownScreen();
        }
    };
    /**
     * used to show the server down form
     * @param {object} response secure code response
     */
    MultiFactorAuthenticationPresentationController.prototype.getSecureAccessCodeOptionsFailureCallBack = function(response) {
        CommonUtilities.showServerDownScreen();
    };
    /**
     * sendSecureAccessCode -  to send the user a secure access code and then presents the UI.
     * @param {Object} options  options where the secure access code should be sent. Phone/Email or both.
     */
    MultiFactorAuthenticationPresentationController.prototype.sendSecureAccessCode = function(options) {
        var self = this;
        var mfaModel = {};
        applicationManager.getUserPreferencesManager().SendSecureAccessCode(self.sendSecureAccessCodeSuccessCallBack.bind(self, mfaModel), self.sendSecureAccessCodeFailureCallBack.bind(self, mfaModel));
    };
    /**
     * used to show the mfa secure access page.
     * @param {object} mfaModel mfa model
     * @param {object} response secure code response
     */
    MultiFactorAuthenticationPresentationController.prototype.sendSecureAccessCodeSuccessCallBack = function(mfaModel, response) {
        var self = this;
        mfaModel.secureAccessCodeSent = true;
        self.showView('frmMultiFactorAuthentication', mfaModel);
    };
    /**
     * used to show the error message
     * @param {object} mfaModel mfa model
     * @param {object} response secure code response
     */
    MultiFactorAuthenticationPresentationController.prototype.sendSecureAccessCodeFailureCallBack = function(mfaModel, response) {
        var self = this;
        mfaModel.serverError = response.errmsg;
        self.showView('frmMultiFactorAuthentication', mfaModel);
    };
    /**
     * verifySecureAccessCode -  to verify the secure access code entered by the user and then presents the UI.
     * @param {Object} params The secure access code entered by the user.
     */
    MultiFactorAuthenticationPresentationController.prototype.verifySecureAccessCode = function(params) {
        var self = this;
        var mfaModel = {};
        applicationManager.getUserPreferencesManager().VerifySecureAccessCode({
            Otp: params.enteredAccessCode
        }, self.verifySecureAccessCodeSuccessCallBack.bind(self, mfaModel), self.verifySecureAccessCodeFailureCallBack.bind(self, mfaModel));
    };
    /**
     * used to show the verify secure access flow.
     * @param {object} mfaModel mfa model
     * @param {object} response secure code response
     */
    MultiFactorAuthenticationPresentationController.prototype.verifySecureAccessCodeSuccessCallBack = function(mfaModel, response) {
        this.successCallback();
    };
    /**
     * used to show the error message
     * @param {object} mfaModel mfa model
     * @param {object} response secure code response
     */
    MultiFactorAuthenticationPresentationController.prototype.verifySecureAccessCodeFailureCallBack = function(mfaModel, response) {
        if (response.isServerUnreachable) {
            mfaModel.serverError = response.errmsg;
            this.showView('frmMultiFactorAuthentication', mfaModel);
        } else {
            mfaModel.incorrectSecureAccessCode = true;
            this.showView('frmMultiFactorAuthentication', mfaModel);
        }
    };
    /**
     * startCVVFlow - Entry point for CVV flow. This method initiates the cancel and success callbacks.
     * @param {Object} context context which contains callbacks and breadcrumb, menu context etc.,
     */
    MultiFactorAuthenticationPresentationController.prototype.startCVVFlow = function(context) {
        //Presenting UI to show Loading indicator first.
        this.showView('frmMultiFactorAuthentication', {
            progressBar: true
        });
        this.cancelCallback = context.cancelCallback;
        this.successCallback = context.successCallback;
        var mfaModel = {};
        mfaModel.breadCrumbData = context.breadcrumb;
        mfaModel.hamburgerSelection = context.hamburgerSelection;
        mfaModel.cvvCardSelection = true;
        mfaModel.termsAndConditions = context.termsAndConditions;
        mfaModel.progressBar = true;
        this.fetchCardsAndShowCVVScreen(mfaModel);
    };
    /**
     * fetchCardsAndShowCVVScreen - This method fetches the cards to allow the user to select from.
     * @param {Object} mfaModel context which contains callbacks and breadcrumb, menu context etc.,
     */
    MultiFactorAuthenticationPresentationController.prototype.fetchCardsAndShowCVVScreen = function(mfaModel) {
        var self = this;
        applicationManager.getCardsManager().fetchCardsList(self.fetchCardsSuccessCallBack.bind(self, mfaModel), self.fetchCardsFailureCallBack.bind(self));
    };
    /**
     * This method fetches the cards to allow the user to select from success schenario.
     * @param {Object} mfaModel model
     * @param {object} response response
     */
    MultiFactorAuthenticationPresentationController.prototype.fetchCardsSuccessCallBack = function(mfaModel, response) {
        var self = this;
        mfaModel.cards = response;
        self.showView('frmMultiFactorAuthentication', mfaModel);
    };
    /**
     * used to show the server down form
     * @param {object} response secure code response
     */
    MultiFactorAuthenticationPresentationController.prototype.fetchCardsFailureCallBack = function(response) {
        CommonUtilities.showServerDownScreen();
    };
    /**
     *  to verify the CVV entered by the user and then presents the UI.
     * @param {Object} params CVV and cardId.
     */
    MultiFactorAuthenticationPresentationController.prototype.verifyCVV = function(params) {
        var self = this;
        var mfaModel = {};
        applicationManager.getUserPreferencesManager().verifyCVV(params, self.verifyCVVSuccessCallback.bind(self, mfaModel), self.verifyCVVFailureCallBack.bind(self, mfaModel));
    };
    /**
     * used to show the verify secure access flow.
     * @param {object} mfaModel mfa model
     * @param {object} response secure code response
     */
    MultiFactorAuthenticationPresentationController.prototype.verifyCVVSuccessCallback = function(mfaModel, response) {
        var self = this;
        if (response.result === "Successful") {
            self.successCallback();
        } else if (response.result === "Failure" || response.result === "Failed") {
            mfaModel.incorrectCVV = true;
            self.showView('frmMultiFactorAuthentication', mfaModel);
        }
    };
    /**
     * used to show the error message
     * @param {object} mfaModel mfa model
     * @param {object} response secure code response
     */
    MultiFactorAuthenticationPresentationController.prototype.verifyCVVFailureCallBack = function(mfaModel, response) {
        var self = this;
        mfaModel.serverError = response.errmsg;
        self.showView('frmMultiFactorAuthentication', mfaModel);
    };
    /**
     * startSecurityQuestionsFlow - Entry point for Security Questions flow. This method also initiates the cancel and success callbacks.
     * @param {Object} context context which contains callbacks and breadcrumb, menu context etc.,
     */
    MultiFactorAuthenticationPresentationController.prototype.startSecurityQuestionsFlow = function(context) {
        var self = this;
        //Presenting UI to show Loading indicator first.
        this.showView('frmMultiFactorAuthentication', {
            progressBar: true
        });
        if (applicationManager.getConfigurationManager().isSecurityQuestionConfigured === "true") {
            var mfaModel = {};
            mfaModel.breadCrumbData = context.breadcrumb;
            mfaModel.hamburgerSelection = context.hamburgerSelection;
            mfaModel.termsAndConditions = context.termsAndConditions;
            self.cancelCallback = context.cancelCallback;
            self.successCallback = context.successCallback;
            self.fetchSecurityQuestionsAndPresentUI(mfaModel);
        } else {
            self.startSecureAccessCodeFlow(context);
        }
    };
    /**
     * fetchSecurityQuestionsAndPresentUI - This method fetches the security questions and presents the UI.
     * @param {object} mfaModel mfa model
     */
    MultiFactorAuthenticationPresentationController.prototype.fetchSecurityQuestionsAndPresentUI = function(mfaModel) {
        var self = this;
        var param = {
            userName: applicationManager.getUserPreferencesManager().getUserObj().userName
        };
        applicationManager.getUserPreferencesManager().fetchSecurityQuestions(param, self.fetchSecuritySuccessCallBack.bind(self, mfaModel), self.fetchSecurityFailureCallBack.bind(self, mfaModel));
    };
    /**
     * This method fetches the security questions and presents the UI.
     * @param {object} mfaModel mfa model
     * @param {object} response secure code response
     */
    MultiFactorAuthenticationPresentationController.prototype.fetchSecuritySuccessCallBack = function(mfaModel, response) {
        var self = this;
        mfaModel.securityQuestions = response.records;
        self.showView('frmMultiFactorAuthentication', mfaModel);
    };
    /**
     * used to show the error message
     * @param {object} mfaModel mfa model
     * @param {object} response secure code response
     */
    MultiFactorAuthenticationPresentationController.prototype.fetchSecurityFailureCallBack = function(mfaModel, response) {
        var self = this;
        mfaModel.serverError = response.errmsg;
        self.showView('frmMultiFactorAuthentication', mfaModel);
    };
    /**
     * verifySecurityQuestionAnswers -  to verify the security answers entered by the user and then presents the UI.
     * @param {Object} questionAnswers The security answers entered by the user.
     */
    MultiFactorAuthenticationPresentationController.prototype.verifySecurityQuestionAnswers = function(questionAnswers) {
        var self = this;
        var questionAnswerParams = {};
        questionAnswerParams.userName = applicationManager.getUserPreferencesManager().getUserObj().userName;
        questionAnswerParams.securityQuestions = JSON.stringify(questionAnswers);
        var mfaModel = {};
        applicationManager.getUserPreferencesManager().verifySecurityQuestions(questionAnswerParams, self.verifySecurityQuestionAnswersSuccessCallBack.bind(self, mfaModel), self.verifySecurityQuestionAnswersFailureCallBack.bind(self, mfaModel));
    };
    /**
     * used to verifySecurityQuestionAnswers flow.
     * @param {object} mfaModel mfa model
     * @param {object} response secure code response
     */
    MultiFactorAuthenticationPresentationController.prototype.verifySecurityQuestionAnswersSuccessCallBack = function(mfaModel, response) {
        var self = this;
        if (response.verifyStatus === "true") {
            self.successCallback();
        } else if (response.verifyStatus === "false") {
            mfaModel.incorrectSecurityAnswers = true;
            self.showView('frmMultiFactorAuthentication', mfaModel);
        }
    };
    /**
     * used to show the error message
     * @param {object} mfaModel mfa model
     * @param {object} response secure code response
     */
    MultiFactorAuthenticationPresentationController.prototype.verifySecurityQuestionAnswersFailureCallBack = function(mfaModel, response) {
        var self = this;
        mfaModel.serverError = response.errmsg;
        self.showView('frmMultiFactorAuthentication', mfaModel);
    };
    /**
     * used to get the user priamry contact number
     * @returns {string} contact number
     */
    MultiFactorAuthenticationPresentationController.prototype.getPrimaryContactNumber = function() {
        return applicationManager.getUserPreferencesManager().getUserObj().phone
    }
    /**
     * used to get the email id
     * @returns {string} contact number
     */
    MultiFactorAuthenticationPresentationController.prototype.getPrimaryEmail = function() {
        return applicationManager.getUserPreferencesManager().getUserObj().email
    }
    /**
     * used to show the secure access settings page
     */
    MultiFactorAuthenticationPresentationController.prototype.showSecureAccessSettings = function() {
        var profileModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ProfileModule");
        profileModule.presentationController.showSecureAccessSettings();
    }
    return MultiFactorAuthenticationPresentationController;
});