
/*          ----------------        [Trixon] Custom Component Configuration to handle: 
                                                Transaction Review display
                                                Transaction Authentication via Biometric or PIN
                                                Transaction API calls 
                                                                                                        ----------------         */

define(function() {
return {
    
    // [TRIXON] GLOBALLY USED OBJECTS DECLARATION
    constructor : function(baseConfig, layoutConfig, pspConfig) {
        this._buttonText = "";
        this._headerText = "";
        this._pinPrompt = "";
        this._authenticationInitiator = "";
        this.invalidAttempts = 0;
        this.serviceChargeRate = {};
        this.transferCollectionAccount = {};
        this.billCollectionAccount = {};
        navManager = applicationManager.getNavigationManager();
        configManager = applicationManager.getConfigurationManager();
        formatUtil = applicationManager.getFormatUtilManager();
        userManager = applicationManager.getUserPreferencesManager();
        deviceManager = applicationManager.getDeviceUtilManager();
        authMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "AuthUIModule", "appName" : "AuthenticationMA"});
        moneyMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({ "moduleName": "MoneyMovementUIModule", "appName": "TransfersMA" });
        billMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({ "moduleName": "BillPaymentUIModule", "appName": "BillPayMA" });
        cardMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({ "moduleName": "ManageCardsUIModule", "appName": "CardsMA" }); // [Zypher]
        loanMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({ "moduleName": "LoanPayUIModule", "appName": "BillPayMA" });  // [Zypher]
    },

    // [TRIXON] GETTER AND SETTER FOR COMPONENT'S PASSED PARAMETERS FROM PARENT FORMS
    initGettersSetters  : function() {
        defineGetter(this, 'buttonText', () => { return this._buttonText; });
        defineSetter(this, 'buttonText', value => { this._buttonText = value; });
        defineGetter(this, 'headerText', () => {  return this._headerText; });
        defineSetter(this, 'headerText', value => { this._headerText = value; });
        defineGetter(this, 'pinPrompt', () => { return this._pinPrompt; });
        defineSetter(this, 'pinPrompt', value => { this._pinPrompt = value; });
        defineGetter(this, 'authenticationInitiator', () => { return this._authenticationInitiator; });
        defineSetter(this, 'authenticationInitiator', value => { this._authenticationInitiator = value; });
    },

    // [Trixon] INITIAL COMPONENT LOOK SETUP
    componentPreshow : function(){
        scope = this;
        scope.view.flxTransactionReview.setVisibility(false);
        scope.view.flxPINAuthentication.setVisibility(false);
        scope.view.segTransactionDetail.removeAll();
        scope.setActions();
    },

    // [Trixon] EVENT HANDLER FOR EVERY COMPONENT WIDGET
    setActions : function(){
        scope.view.btnPIN.onClick = scope.pinAuthentication;
        scope.view.txtPIN.onTextChange = scope.onPinEntry;
        scope.view.txtNote.onTextChange = scope.validateNote;
        scope.view.customHeaderNew.flxBack.onClick = scope.closePINAuthentication;
        scope.view.flxTransactionReview.onClick = scope.view.flxClose.onClick = scope.hideReviewScreen;
        scope.view.btnSend.onClick = scope.view.flxBiometric.onClick = scope.initiateAuthenticationFlow;
        scope.view.customHeaderNew.btnCancel.onClick = function(){ navManager.navigateTo({ "appName" : "HomepageMA", "friendlyName" :"AccountsUIModule/frmUnifiedDashboard"}); }
    },

    // [Trixon] NAME FORMATING FOR SUCCESS SCREEN DISPLAY
    formatName : function(fullName){
        var trimmedName = fullName.trim().split(/\s+/);
        return trimmedName.slice(0, 2).join(" ");
    },

    // [Trixon] FETCH TRANSFER CONSTANT VALUES FROM SERVER PARAMETERS CONFIGURATION
    retrieveServerParameters : function(){
        if(!kony.sdk.isNullOrUndefined(configManager.BOA_TRANSFER_CHARGES) && !kony.sdk.isNullOrUndefined(configManager.BOA_TRANSFER_COLLECTION_ACCOUNTS) && !kony.sdk.isNullOrUndefined(configManager.BOA_BILL_COLLECTION_ACCOUNTS)){ 
            scope.serviceChargeRate = configManager.BOA_TRANSFER_CHARGES;
            scope.transferCollectionAccount = configManager.BOA_TRANSFER_COLLECTION_ACCOUNTS;
            scope.billCollectionAccount = configManager.BOA_BILL_COLLECTION_ACCOUNTS;
        }else{ 
            navManager.navigateTo({"appName" : "HomepageMA", "friendlyName" :"AccountsUIModule/frmUnifiedDashboard"});
            var controller = applicationManager.getPresentationUtility().getController("frmUnifiedDashboard", true);
            controller.bindGenericError("Unable to fetch service charge details");
            controller.bindGenericError("Unable to fetch service charge details");
        }
    },

    // [Trixon] REVIEW SCREEN DATA SET
    setReviewScreenData : function(transactionDetail){
        applicationManager.getDeviceUtilManager().detectDynamicInstrumentation();
        parentController = applicationManager.getPresentationUtility().getController(kony.application.getCurrentForm().id, true);
        transactionAuthMode = (kony.store.getItem("apolloDefaultTransactionMode")) ? kony.store.getItem("apolloDefaultTransactionMode") : "PIN";
        loginData = applicationManager.getNavigationManager().getCustomInfo("frmLogin");
        reviewData = transactionDetail;
        scope.retrieveServerParameters();
        scope.view.segTransactionDetail.removeAll();
        scope.view.btnSend.text = this._buttonText;
        scope.view.lblReview.text = this._headerText;
        scope.view.txtNote.text = "";
        scope.view.btnSend.setVisibility(true);
        scope.view.flxNote.setVisibility(true);
        scope.view.btnPIN.isVisible = (transactionAuthMode === "PIN") ? false : true;
        scope.view.flxClose.bottom = (transactionAuthMode === "PIN") ? "10dp" : "0dp"; 
        scope.view.flxTransactionDetail.bottom = "35dp";

        // [Trixon] REVIEW SCREEN DATA SET FOR TRANSFERS {Within BOA, Other Bank <EthSwitch, Rtgs>, Telebirr, ATM Withdrawal, Awach, MPesa, MPesa Trust}
        if(this._authenticationInitiator === "Transfer"){ 
            var sender = scope.formatName(transactionDetail.senderName) +" "+ transactionDetail.senderAccount;
            var receiver = (transactionDetail.transactionType === "Telebirr" || transactionDetail.transactionType === "ATM Withdrawal" || transactionDetail.transactionType === "MPesa") ? "+251" + transactionDetail.recipientAccount : scope.formatName(transactionDetail.recipientName) +" "+ transactionDetail.recipientAccount;
            var amount = kony.i18n.getLocalizedString("cs.apollo.LocalCurrency") + " " + formatUtil.formatAmount(transactionDetail.transactionAmount);
            var segData = [{"Attribute": kony.i18n.getLocalizedString("cs.apollo.From"), "Value": sender}, 
                           {"Attribute": kony.i18n.getLocalizedString("cs.apollo.To"), "Value": receiver}, 
                           {"Attribute": kony.i18n.getLocalizedString("cs.apollo.Amount"), "Value": amount}];
            if(transactionDetail.transactionType === "Awach"){ segData.push({"Attribute": kony.i18n.getLocalizedString("cs.apollo.M/FinanceName"), "Value": transactionDetail.transactionType}); }
            else if( transactionDetail.transactionType === "ATM Withdrawal" && transactionDetail.transactionSubtype === "ATM Resend"){ 
                if(transactionDetail.resendTask === "View Detail"){ 
                    scope.view.btnSend.isVisible = scope.view.btnPIN.isVisible = false; 
                    scope.view.flxTransactionDetail.bottom = "0dp";
                    scope.view.flxClose.bottom = "10dp";
                }
                scope.view.flxNote.setVisibility(false); 
            }
            else if(transactionDetail.transactionType === "QR Payment"){ 
                if(transactionDetail.transactionSubtype === "with Tip"){ segData.push( {"Attribute": kony.i18n.getLocalizedString("cs.apollo.Tip"), "Value": kony.i18n.getLocalizedString("cs.apollo.LocalCurrency") + " " + (transactionDetail.tipAmount).toFixed(2)}); }
                segData.push({"Attribute": kony.i18n.getLocalizedString("cs.apollo.BankName"), "Value": kony.i18n.getLocalizedString("cs.apollo.BankOfAbyssinia")});
            }
            else if(transactionDetail.transactionType === "Telebirr" || transactionDetail.transactionType === "MPesa" || transactionDetail.transactionType === "MPesa Trust"){ 
                var sCharge =  kony.i18n.getLocalizedString("cs.apollo.LocalCurrency") + " " + formatUtil.formatAmount((transactionDetail.serviceCharge/1.15).toFixed(2));
                var sVAT =  kony.i18n.getLocalizedString("cs.apollo.LocalCurrency") + " " + formatUtil.formatAmount(((transactionDetail.serviceCharge*0.15)/1.15).toFixed(2))
                segData.push(
                    {"Attribute": kony.i18n.getLocalizedString("cs.apollo.ServiceCharge"), "Value": sCharge},
                    {"Attribute": kony.i18n.getLocalizedString("cs.apollo.VAT"), "Value": sVAT});
            }
            else if(transactionDetail.transactionType === "Other Bank"){
                var sCharge = (transactionDetail.transactionSubtype === "RTGS" || transactionDetail.transactionAmount > scope.serviceChargeRate.ETHSWITCH.ONETIMELIMIT) ? (scope.serviceChargeRate.RTGS.CHARGE + scope.serviceChargeRate.RTGS.NBECHARGE).toFixed(2) : (transactionDetail.serviceCharge/1.15).toFixed(2);
                var sVAT = (transactionDetail.transactionSubtype === "RTGS" || transactionDetail.transactionAmount > scope.serviceChargeRate.ETHSWITCH.ONETIMELIMIT) ? ((((scope.serviceChargeRate.RTGS.CHARGE * scope.serviceChargeRate.BOA.VAT).toFixed(2))*0.15)/1.15).toFixed(2) : ((transactionDetail.serviceCharge*0.15)/1.15).toFixed(2);
                segData.push(
                    {"Attribute": kony.i18n.getLocalizedString("cs.apollo.ServiceCharge"), "Value": kony.i18n.getLocalizedString("cs.apollo.LocalCurrency") + " " + formatUtil.formatAmount(sCharge)},
                    {"Attribute": kony.i18n.getLocalizedString("cs.apollo.VAT"), "Value": kony.i18n.getLocalizedString("cs.apollo.LocalCurrency") + " " + formatUtil.formatAmount(sVAT)}, 
                    {"Attribute": kony.i18n.getLocalizedString("cs.apollo.BankName"), "Value": transactionDetail.recipientBankDetail.institutionName});
            }
        }

        // [Trixon] REVIEW SCREEN DATA SET FOR PAYMENTS {Topup <EthioTel, Safaricom>, ETHIOTEL PACKAGES, Postpaid, Airlines, Guzogo, Websprix, FHC, US Visa, DSTV, School Fee, Traffic Penalty, Parking Fee, Seregela, QUANTUM, WATER BILL}
        else if(this._authenticationInitiator === "Payment"){
            var sender = scope.formatName(transactionDetail.senderName) + " " + transactionDetail.senderAccount;
            var billName = transactionDetail.paymentMode;
            var billReference = (transactionDetail.paymentType === "EthioTelTopup" || transactionDetail.paymentType === "SafaricomTopup" || transactionDetail.paymentType === "EthioTelPackage") ? 
                                "+" + transactionDetail.billNumber : ((transactionDetail.paymentType === "Websprix" || transactionDetail.paymentType === "School Fee") && transactionDetail.paymentMode === kony.i18n.getLocalizedString("cs.apollo.PhoneNumber")) ? 
                                "+251" + transactionDetail.billNumber : transactionDetail.billNumber;
            var amount = kony.i18n.getLocalizedString("cs.apollo.LocalCurrency") + " " + formatUtil.formatAmount(transactionDetail.transactionAmount);
            var segData = [ {"Attribute": kony.i18n.getLocalizedString("cs.apollo.From"), "Value": sender} ];
            if(transactionDetail.paymentType !== "Dstv" && transactionDetail.paymentType !== "School Fee" && transactionDetail.paymentType !== "Water Bill"){ segData.push( {"Attribute": billName, "Value":billReference} ); }
            if(transactionDetail.paymentType === "Postpaid" || transactionDetail.paymentType === "Websprix" || transactionDetail.paymentType === "FHC" || transactionDetail.paymentType === "Airlines" || transactionDetail.paymentType === "Guzogo" || transactionDetail.paymentType === "Traffic Payment"){
                var billHolderName = (transactionDetail.paymentType === "Postpaid" || transactionDetail.paymentType === "Websprix" || transactionDetail.paymentType === "FHC") ? kony.i18n.getLocalizedString("cs.apollo.CustomerName") : 
                                     ( transactionDetail.paymentType === "Airlines" || transactionDetail.paymentType === "Guzogo") ? kony.i18n.getLocalizedString("cs.apollo.PassengerName") : kony.i18n.getLocalizedString("cs.apollo.DriverName");
                segData.push( {"Attribute": billHolderName, "Value": transactionDetail.recipientName} );
            }
            if(transactionDetail.paymentType === "US Visa"){ 
                var visitorsName = transactionDetail.visitorsName.split(",");
                for (var i = 0; i < visitorsName.length; i++) {
                    segData.push({
                        "Attribute": i === 0 ? kony.i18n.getLocalizedString("cs.apollo.Name") : "",
                        "Value": visitorsName[i].trim()
                    });
                }
            }
            if(transactionDetail.paymentType === "Water Bill"){ segData.push({"Attribute": kony.i18n.getLocalizedString("cs.apollo.CustomerID"), "Value": transactionDetail.payeeDetails.customer_id}); }
            if(transactionDetail.paymentType === "School Fee"){ 
                segData.push(
                    {"Attribute": kony.i18n.getLocalizedString("cs.apollo.StudentID"), "Value": scope.formatName(transactionDetail.payeeDetails.text[transactionDetail.selectedStudent].AdmissionNumber)},
                    {"Attribute": kony.i18n.getLocalizedString("cs.apollo.StudentName"), "Value": scope.formatName(transactionDetail.payeeDetails.text[transactionDetail.selectedStudent].StudentName)} ); 
            }
            if(transactionDetail.paymentType === "Parking Payment"){ 
                segData.push(
                    {"Attribute": kony.i18n.getLocalizedString("cs.apollo.PlateNumber"), "Value": transactionDetail.payeeDetails.data.results[0].vehicle_plate},
                    {"Attribute": kony.i18n.getLocalizedString("cs.apollo.ParkingArea"), "Value": transactionDetail.payeeDetails.data.results[0].parking_lot} ); 
            }
            if(transactionDetail.paymentType !== "Dstv"){ segData.push({"Attribute": kony.i18n.getLocalizedString("cs.apollo.Amount"), "Value": amount}); }
            if(transactionDetail.paymentType === "EthioTelTopup" || transactionDetail.paymentType === "SafaricomTopup"){ segData.push({"Attribute": kony.i18n.getLocalizedString("cs.apollo.ServiceProvider"), "Value": (transactionDetail.paymentType === "EthioTelTopup") ? kony.i18n.getLocalizedString("cs.apollo.Ethiotelecom") : kony.i18n.getLocalizedString("cs.apollo.Safaricom")}); }
            if(transactionDetail.paymentType === "EthioTelPackage"){ 
                segData.push(
                    {"Attribute": kony.i18n.getLocalizedString("cs.apollo.PackageType"), "Value": transactionDetail.packageDetail.packageName /* + " " + transactionDetail.packageDetail.id */}, 
                    {"Attribute": kony.i18n.getLocalizedString("cs.apollo.ServiceProvider"), "Value": kony.i18n.getLocalizedString("cs.apollo.Ethiotelecom")} ); 
            }
            if(transactionDetail.paymentType === "School Fee"){ 
                if(transactionDetail.selectedBillType === "Special"){ segData.push({"Attribute": kony.i18n.getLocalizedString("cs.apollo.Description"), "Value": transactionDetail.specialFeeDescription}); }
                else{
                    if(transactionDetail.penaltyAmount !== "0.00"){ segData.push({"Attribute": kony.i18n.getLocalizedString("cs.apollo.Penalty"), "Value": kony.i18n.getLocalizedString("cs.apollo.LocalCurrency") + " " +formatUtil.formatAmount(transactionDetail.penaltyAmount)}); }
                    else{ segData.push({"Attribute": kony.i18n.getLocalizedString("cs.apollo.PaymentPeriod"), "Value": transactionDetail.paymentPeriod}); }
                }
            }
            if(transactionDetail.paymentType === "Water Bill"){ 
                segData.push(
                    {"Attribute": kony.i18n.getLocalizedString("cs.apollo.CustomerName"), "Value": transactionDetail.payeeDetails.name}, 
                    {"Attribute": kony.i18n.getLocalizedString("cs.apollo.City"), "Value": transactionDetail.waterBillCity.lblNationality} ); 
            }
            if(transactionDetail.paymentType === "Traffic Payment"){
                var issueDate = formatUtil.formatDateForDisplay(transactionDetail.payeeDetails.data.results[0].created_at);
                segData.push(
                    {"Attribute": kony.i18n.getLocalizedString("cs.apollo.PlateNumber"), "Value": transactionDetail.payeeDetails.data.results[0].vehicle_plate}, 
                    {"Attribute": kony.i18n.getLocalizedString("cs.apollo.IssueDate"), "Value": issueDate} ); 
            }
            if(transactionDetail.paymentType === "Parking Payment"){ 
                var issueDate = formatUtil.formatDateForDisplay(transactionDetail.payeeDetails.data.results[0].created_at);
                segData.push( {"Attribute": kony.i18n.getLocalizedString("cs.apollo.IssueDate"), "Value": issueDate} ); 
            }
            if(transactionDetail.paymentType === "Dstv"){ 
                var packageName = (transactionDetail.paymentSubtype !== "Change Package") ? "Package" : transactionDetail.paymentSubtype;
                    var packageValue = (transactionDetail.paymentSubtype === "Box Office") ? transactionDetail.paymentSubtype : (transactionDetail.paymentSubtype === "Change Package") ? transactionDetail.selectedPackageDetail.displayName : "Existing Package";
                    let today = new Date();
                    let futureDate = new Date();
                    futureDate.setDate(today.getDate() + 30);
                    var dueDate = formatUtil.formatDateForDisplay(futureDate);
                    segData.push(
                        {"Attribute": packageName, "Value": packageValue}, 
                        {"Attribute": kony.i18n.getLocalizedString("cs.apollo.Amount"), "Value": amount},
                        {"Attribute": kony.i18n.getLocalizedString("cs.apollo.CustomerName"), "Value": transactionDetail.payeeDetails.customerName}, 
                        {"Attribute": kony.i18n.getLocalizedString("cs.apollo.SmartCardNumber"), "Value": billReference}, 
                        {"Attribute": kony.i18n.getLocalizedString("cs.apollo.DueDate"), "Value": dueDate} );
            }
        }

        // [Trixon] REVIEW SCREEN DATA SET FOR SCHEDULE TRANSFERS {Within BOA, Other Bank <EthSwitch, RTGS>, Postpaid, Websprix, Dstv, FHC and Water Bill}
        else if(this._authenticationInitiator === "ScheduleTransfer"){
            var sender = scope.formatName(transactionDetail.senderName) +" "+ transactionDetail.senderAccount;
            var amount = kony.i18n.getLocalizedString("cs.apollo.LocalCurrency") + " " + formatUtil.formatAmount(transactionDetail.transactionAmount);
            var scheduleReceiver = (transactionDetail.paymentType === "Within BOA" || transactionDetail.paymentType === "Other Bank") ? kony.i18n.getLocalizedString("cs.apollo.To") : kony.i18n.getLocalizedString("cs.apollo.SchedulePaymentType");
            var schedulePaymentType = (transactionDetail.paymentType === "Postpaid") ? "Ethio-tel Bill" : (transactionDetail.paymentType === "Websprix") ? "Websprix Bill" : (transactionDetail.paymentType === "Dstv") ? "DSTV" : (transactionDetail.paymentType === "FHC") ? "FHC" : (transactionDetail.paymentType === "Water Bill") ? "Water Bill" : scope.formatName(transactionDetail.recipientName) +" "+ transactionDetail.billNumber;
            var segData = [
                {"Attribute": kony.i18n.getLocalizedString("cs.apollo.From"), "Value": sender}, 
                {"Attribute": scheduleReceiver, "Value": schedulePaymentType}, 
                {"Attribute": kony.i18n.getLocalizedString("cs.apollo.Amount"), "Value": amount},
                {"Attribute": kony.i18n.getLocalizedString("cs.apollo.PaymentName"), "Value": transactionDetail.schedulePaymentName},
                {"Attribute": kony.i18n.getLocalizedString("cs.apollo.StartDate"), "Value": transactionDetail.scheduleStartDate}, 
                {"Attribute": kony.i18n.getLocalizedString("cs.apollo.EndDate"), "Value": transactionDetail.scheduleEndDate}, 
                {"Attribute": kony.i18n.getLocalizedString("cs.apollo.Frequency"), "Value": transactionDetail.frequency.lblNationality},
                {"Attribute": kony.i18n.getLocalizedString("cs.apollo.Reminder"), "Value": transactionDetail.scheduleReminder.lblNationality}];
            if (transactionDetail.paymentType === "Other Bank") { segData.push({"Attribute": kony.i18n.getLocalizedString("cs.apollo.BankName"), "Value": transactionDetail.recipientBankDetail.institutionName});}
        }

        // [Zypher] REVIEW SCREEN DATA SET FOR CARD REQUEST
        else if (this._authenticationInitiator === "card"){
            scope.view.flxNote.setVisibility(false);
            var fromAccount = scope.formatName(transactionDetail.accountName) +" "+ transactionDetail.accountNumber;
            var segData = [
                {"Attribute": kony.i18n.getLocalizedString("cs.apollo.CardType"), "Value": transactionDetail.cardTitle},
                {"Attribute": kony.i18n.getLocalizedString("cs.apollo.FromAccount"), "Value": fromAccount},
                {"Attribute": kony.i18n.getLocalizedString("cs.apollo.CardFee"), "Value": transactionDetail.cardFee},
                {"Attribute": kony.i18n.getLocalizedString("cs.apollo.DeliveryBranch"), "Value": transactionDetail.deliveryBranch},
            ];
            if (transactionDetail.deliveryFee) {
                 segData.push({"Attribute": kony.i18n.getLocalizedString("cs.apollo.DeliveryFee"), "Value": transactionDetail.deliveryFee});
            }
        }

        // [ZYPHER] REVIEW SCREEN DATA FOR LOAN MODULE {Loan Repayment}
        else if(this._authenticationInitiator === "loan"){
            scope.view.flxNote.setVisibility(false);
             var segData = [
                {"Attribute": kony.i18n.getLocalizedString("cs.apollo.FromAccount"), "Value": transactionDetail.fromAccount},
                {"Attribute": kony.i18n.getLocalizedString("cs.apollo.OutstandingAmount"), "Value": `ETB ${formatUtil.formatAmount(transactionDetail.outstandingAmount)}`},
                {"Attribute": kony.i18n.getLocalizedString("cs.apollo.Penalty"), "Value": `ETB ${formatUtil.formatAmount(transactionDetail.penality)}`},
                {"Attribute": kony.i18n.getLocalizedString("cs.apollo.TotalAmount"), "Value": `ETB ${formatUtil.formatAmount(transactionDetail.totalAmount)}`},
            ];
        }

        scope.view.segTransactionDetail.widgetDataMap = {lblAttribute : "Attribute", lblValue : "Value"};
        scope.view.segTransactionDetail.setData(segData);
        scope.displayReviewScreen();
    },

    // [Trixon] ANIMATE REVIEW SCREEN DISPLAY
    displayReviewScreen : function(){
        scope.view.flxPINAuthentication.setVisibility(false);
        scope.view.flxTransactionReview.setVisibility(true);
        scope.view.flxReviewPopup.bottom = "-600dp";
        var animDefinition = {"0": {"bottom": "-600dp", "stepConfig": {"timingFunction": kony.anim.EASE}}, "100": {"bottom":"0dp"}};
        animDef = kony.ui.createAnimation(animDefinition);
        var config = {"duration": 0.4, "iterationCount": 1, "delay": 0, "fillMode": kony.anim.FILL_MODE_FORWARDS};
        scope.view.flxReviewPopup.animate(animDef, config, null);
        scope.view.flxTransactionReview.setEnabled(true);
    },

    // [Trixon] ANIMATE REVIEW SCREEN CLOSE
    hideReviewScreen : function(){
        var animDefinition = {"0": {"bottom": "0dp", "stepConfig": {"timingFunction": kony.anim.EASE}}, "100": {"bottom":"-500dp"}};
        animDef = kony.ui.createAnimation(animDefinition);
        var config = {"duration": 0.4, "iterationCount": 1, "delay": 0, "fillMode": kony.anim.FILL_MODE_FORWARDS};
        scope.view.flxReviewPopup.animate(animDef, config, {"animationEnd": function () { parentController.hideTransactionAuthentication(); }});
    },

    // [Trixon] DEFAULT AUTHENTICATON CHECK
    initiateAuthenticationFlow: function(){
        applicationManager.getDeviceUtilManager().detectDynamicInstrumentation();
        parentController = applicationManager.getPresentationUtility().getController(kony.application.getCurrentForm().id, true);
        transactionAuthMode = (kony.store.getItem("apolloDefaultTransactionMode")) ? kony.store.getItem("apolloDefaultTransactionMode") : "PIN";
        loginData = (scope._authenticationInitiator === "card" ) ? applicationManager.getNavigationManager().getCustomInfo("frmLogin") : loginData ; // [Zypher] add loginData
        identifierTouch = {"identifier": loginData.userName};
        scope.view.flxTransactionReview.setEnabled(false);
        if(transactionAuthMode === "faceid"){ scope.faceIdAuthentication(); } 
        else if(transactionAuthMode === "touchid"){ scope.touchIdAuthentication(); } 
        else{ scope.pinAuthentication(); }
    },

    // [Trixon] FACE-ID AUTHENTICATION
    faceIdAuthentication: function(){
        authData = kony.keychain.retrieve(identifierTouch);
        scope.view.flxPINAuthentication.setVisibility(false);
        if (!kony.sdk.isNullOrUndefined(authData) && !kony.sdk.isNullOrUndefined(authData.secureaccount) && !kony.sdk.isEmptyObject(authData.secureaccount) && !kony.sdk.isNullOrUndefined(authData.securedata)) {
            kony.print(" showFaceIdScreen Secure data not empty"+JSON.stringify(authData));
            scope.onAuthenticationSuccess();
        }else{
            userManager.updateFaceIdFlag(false);
            scope.pinAuthentication();
        }
    },

    // [Trixon] TOUCH-ID SETUP
    touchIdAuthentication: function() { 
        authData = kony.keychain.retrieve(identifierTouch);
        scope.view.flxPINAuthentication.setVisibility(false);          
        if(loginData.isIphone){
            if (!kony.sdk.isNullOrUndefined(authData) && !kony.sdk.isNullOrUndefined(authData.secureaccount) && !kony.sdk.isEmptyObject(authData.secureaccount) && !kony.sdk.isNullOrUndefined(authData.securedata)) {
                kony.print(" showFaceIdScreen Secure data not empty" + JSON.stringify(authData));
                scope.onAuthenticationSuccess();
            }else{
                userManager.updateFaceIdFlag(false);
                scope.pinAuthentication();
            }
        }else{
            scope.showTouchIdAndroid();
            kony.application.setApplicationCallbacks({onbackground: ()=> { scope.cancelTouchIdAuth(); }});
        }
    },
    
    // [Trixon] ANDROID TOUCH-ID AUTHENTICATION
    showTouchIdAndroid : function(){
        if(transactionAuthMode === "touchid" &&  deviceManager.isTouchIDSupported()){
            var config = { "promptMessage": kony.i18n.getLocalizedString("cs.apollo.UnlockApollo"), "fallbackTitle": "", "description": kony.i18n.getLocalizedString("cs.apollo.Scanyourfingerprint"), "subTitle" : "", "deviceCredentialAllowed" : false, "confirmationRequired" : false, "negativeButtonText" : kony.i18n.getLocalizedString("cs.apollo.Cancel") };
            kony.localAuthentication.authenticate(constants.LOCAL_AUTHENTICATION_MODE_TOUCH_ID, scope.authCallBack, config);
        }
    },

    // [Trixon] CALLBACK HANDLE FOR ANDROID TOUCH-ID AUTHENTICATION
    authCallBack: function(status,msg){
        if(status == 5000){ scope.onAuthenticationSuccess(); }
        else if(status == 5001){ kony.print(kony.i18n.getLocalizedString("cs.apollo.PleaseTryAgain")); }
        else if (status == 5002 || status == 5003 || status == 5004){ scope.view.flxTransactionReview.setEnabled(true); }
        else if(status == 5009){ kony.print(kony.i18n.getLocalizedString("cs.apollo.TouchIDLockedError")); }
        else if(status == 5011){ kony.print(kony.i18n.getLocalizedString("cs.apollo.AuthenticationLockedError")) }
        else{ kony.print(kony.i18n.getLocalizedString("cs.apollo.AuthenticationError")); }
    },

    // [Trixon] ANDROID TOUCH-ID AUTHENTICATION CANCEL EVENT HANDLE
    cancelTouchIdAuth : function(){
        if(transactionAuthMode === "touchid" &&  deviceManager.isTouchIDSupported()){
            kony.localAuthentication.cancelAuthentication();
            scope.view.flxTransactionReview.setEnabled(true);
        }
    }, 

    // [Trixon] PIN-SCREEN SETUP
    pinAuthentication : function(){
        scope.view.flxPINAuthentication.setVisibility(true);
        scope.view.lblPINPrompt.text = scope._pinPrompt;
        scope.view.lblIncorrectPIN.setVisibility(false);
        scope.view.lblIncorrectPIN.text = "";
        scope.view.flxTransactionReview.setEnabled(false);
        scope.view.txtPIN.text = "";
        scope.view.lblDigit0.text = scope.view.lblDigit1.text = scope.view.lblDigit2.text = scope.view.lblDigit3.text = scope.view.lblDigit4.text = scope.view.lblDigit5.text = "";
        if(transactionAuthMode === "touchid" || transactionAuthMode === "faceid"){
            scope.view.imgBiometric.src = "apollofingerprint.png";
            if(loginData.isIphone){ scope.view.imgBiometric.src = "apollofaceid.png"; }
            scope.view.flxBiometric.setVisibility(true);
            scope.view.lblBiometric.setVisibility(true);
        }else{
            scope.view.flxBiometric.setVisibility(false);
            scope.view.lblBiometric.setVisibility(false);
        }
        scope.view.txtPIN.setFocus(true);
    },

    // [Trixon] PIN ENTRY EVENT HANDLER
    onPinEntry : function(){
        scope.view.lblDigit0.text = scope.view.lblDigit1.text = scope.view.lblDigit2.text = scope.view.lblDigit3.text = scope.view.lblDigit4.text = scope.view.lblDigit5.text = "";
        var pinLabels = scope.view.flxPINDigits.widgets();
        var pinEntered = scope.view.txtPIN.text;
        for(var i = 0; i < pinEntered.length; i++){ pinLabels[i].text = "*"; /* pinEntered.charAt(i); */}
        if(scope.view.txtPIN.text !== "" && scope.view.txtPIN.text.length === 6){ 
            scope.view.txtPIN.setFocus(false);
            scope.verifyPIN(scope.view.txtPIN.text); 
        }
    },

    // [Trixon] VERIFY ENTERED PIN - WITH "verifyExistingPassword" OBJECT SERVICE CALL
    verifyPIN: function(enteredPIN){
        applicationManager.getPresentationUtility().showLoadingScreen();
        let payload = { "password": enteredPIN };
        function completionCallBack(status, data, error) {
            var response = scope.validateObjectResponse(status, data, error);
            if (response.status && !response.isServerUnreachable) {
                if (data.result === "The user is verified") { scope.onAuthenticationSuccess(); }
                else if(data.result === "Invalid Credentials"){
                    scope.invalidAttempts++;
                    if(scope.invalidAttempts === 3){ authMod.presentationController.pinLockedLogout(); }
                    else{
                        scope.view.lblIncorrectPIN.text = kony.i18n.getLocalizedString("cs.apollo.InvalidPINAttemptError").replace("2", (3-(scope.invalidAttempts)));
                        scope.view.lblIncorrectPIN.setVisibility(true);
                        scope.view.lblDigit0.text = scope.view.lblDigit1.text = scope.view.lblDigit2.text = scope.view.lblDigit3.text = scope.view.lblDigit4.text = scope.view.lblDigit5.text = "";
                        scope.view.txtPIN.text = "";
                        applicationManager.getPresentationUtility().dismissLoadingScreen();
                    }
                }else{ parentController.bindGenericError(kony.i18n.getLocalizedString("cs.apollo.UnableToVerifyPINError")); }
            }else { parentController.bindGenericError(kony.i18n.getLocalizedString("cs.apollo.UnableToVerifyPINError")); }
        }
        var userRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ExternalUsers");
        userRepo.customVerb("verifyExistingPassword", payload, completionCallBack); 
    },

    // [Trixon] PROCESS "verifyExistingPassword" SERVICE RESPONSE
    validateObjectResponse: function (status, response, error) {
        let res, isServiceFailure, data;
        if (status === kony.mvc.constants.STATUS_SUCCESS) {
            if (response.hasOwnProperty("dbpErrCode") || response.hasOwnProperty("dbpErrMsg")) {
                data = { "errorCode": response.errcode ? response.errcode : response.dbpErrCode, "errorMessage": response.errmsg ? response.errmsg : response.dbpErrMsg };
                res = { "status": true, "data": data, "serverErrorRes":response, "isServerUnreachable": false };
            }else { res = { "status": true, "data": response, "isServerUnreachable": false }; }
        }else {
            isServiceFailure = (error.opstatus === 1011)? true : false;
            data = { "errorCode": error.errcode ? error.errcode : error.dbpErrCode, "errorMessage": error.errmsg ? error.errmsg : error.dbpErrMsg };
            res = { "status": false, "data": data, "isServerUnreachable": isServiceFailure };
        }
        return res;
    },

    // [Trixon] RESTRICT NOTE ENTRY TO ONLY ENGLISH LETTERS AND SPACE
    validateNote : function(){
        var raw = scope.view.txtNote.text || "";
        var filtered = raw.replace(/[^a-zA-Z0-9 ]/g, "");
        if (raw !== filtered) { scope.view.txtNote.text = filtered; }
    },

    // [Trixon] CLOSE PIN ENTRY SCREEN
    closePINAuthentication : function(){
        scope.view.flxPINAuthentication.setVisibility(false);
        scope.view.flxTransactionReview.setEnabled(true);
        // [Zypher] updated clode pin for no review screen authentication
        var viewAuth = applicationManager.getNavigationManager().getCustomInfo("viewAuth");
        var parentController = applicationManager.getPresentationUtility().getController(kony.application.getCurrentForm().id, true);
        if (!kony.sdk.isNullOrUndefined(viewAuth) && viewAuth){
            parentController.hideTransactionAuthentication();
            applicationManager.getNavigationManager().setCustomInfo("viewAuth",false);
        }
        // [Zypher] end
    },

    // [Trixon] POST AUTHENTICATION HANDLE
    onAuthenticationSuccess : function(){
        if(scope._authenticationInitiator === "Transfer"){ scope.commitTransaction(); }
        else if(scope._authenticationInitiator === "ScheduleTransfer"){ scope.createScheduleTransfer(); }
        else if(scope._authenticationInitiator === "Payment"){ scope.makePayment(); }
        else if(scope._authenticationInitiator === "card"){ scope.backToCard(); }
        else if(scope._authenticationInitiator === "loan"){ scope.backToLoan(); }
    },

    // [Trixon] TRANSACTION API CALL FOR TRANSFERS {WITHIN BOA, OTHER BANK <RTGS, ETHSWITCH>, TELEBIRR, ATM WITHDRAWAL, AWACH, MPESA, MPESA TRUST}
    commitTransaction : function(){
        applicationManager.getPresentationUtility().showLoadingScreen();
        var transactionPayload = {
            "category": reviewData.category, 
            "transactionType": reviewData.transactionType,
            "senderAccount": reviewData.senderAccount,
            "senderName":  reviewData.senderName,
            "receiverAccount": reviewData.recipientAccount,
            "receiverName": reviewData.recipientName,
            "amount" : reviewData.transactionAmount,
            "frequency": reviewData.frequency,
            "remark": scope.view.txtNote.text
        };
        if(reviewData.transactionType === "Other Bank" || reviewData.transactionType === "Telebirr" || reviewData.transactionType === "MPesa" || reviewData.transactionType === "MPesa Trust"){
            transactionPayload.serviceCharge = scope.view.segTransactionDetail.data[3].Value;
            transactionPayload.vat = scope.view.segTransactionDetail.data[4].Value;
        }
        if(reviewData.transactionType === "Within BOA" || reviewData.transactionType === "QR Payment"){
            transactionPayload.transactionSubtype = reviewData.transactionSubtype;
            if(reviewData.transactionType === "QR Payment" && reviewData.transactionSubtype === "with Tip"){
                transactionPayload.tipAccount = reviewData.tipAccount;
                transactionPayload.tipAmount = reviewData.tipAmount;
                transactionPayload.tipReceiverName = reviewData.tipReceiverName;
            }
            moneyMod.presentationController.createWithinBoaTransfer(transactionPayload); 
        }
        else if(reviewData.transactionType === "Other Bank"){
            transactionPayload.receiverBank = reviewData.recipientBankDetail.institutionName;
            transactionPayload.receiverBankBicCode = reviewData.recipientBankDetail.bicCode;
            transactionPayload.recipientBankDetail = reviewData.recipientBankDetail;
            if(reviewData.transactionSubtype === "RTGS" || (reviewData.transactionAmount > scope.serviceChargeRate.ETHSWITCH.ONETIMELIMIT)){
                transactionPayload.transactionSubtype = reviewData.transactionSubtype = "RTGS";
                if(reviewData.transactionAmount > scope.serviceChargeRate.RTGS.AUTHORIZATIONLIMIT){ moneyMod.presentationController.createRTGSTransfer(transactionPayload, "rtgsTransferWithOutAuthorization"/* "rtgsTransferWithOutAuthorizationWithApprover" */); }
                else{ moneyMod.presentationController.createRTGSTransfer(transactionPayload, "rtgsTransferWithOutAuthorization"); }
            }else{
                transactionPayload.transactionSubtype = reviewData.transactionSubtype = "EthSwitch";
                transactionPayload.receiverBankCode = reviewData.recipientBankDetail.bankId;
                moneyMod.presentationController.createEthSwitchTransfer(transactionPayload);
            }
        }
        else if(reviewData.transactionType === "ATM Withdrawal" && reviewData.transactionSubtype === "ATM Resend"){
            transactionPayload.transactionSubtype = reviewData.transactionSubtype;
            transactionPayload.amount = reviewData.atmResendDetails.amount;
            transactionPayload.receiverPhone = reviewData.atmResendDetails.benPhone;
            transactionPayload.secretCode = reviewData.atmResendDetails.secNumber;
            transactionPayload.transactionDate = reviewData.atmResendDetails.issuedDate;
            transactionPayload.atmReferenceId = reviewData.atmResendDetails.id;
            moneyMod.presentationController.resendATMWithdrawalCode(transactionPayload);
        }
        else if(reviewData.transactionType === "Telebirr" || (reviewData.transactionType === "ATM Withdrawal" && reviewData.transactionSubtype === "ATM New Withdrawal") || reviewData.transactionType === "MPesa" || reviewData.transactionType === "MPesa Trust" || reviewData.transactionType === "Awach"){
            if(reviewData.transactionType === "ATM Withdrawal"){ 
                transactionPayload.transactionSubtype = reviewData.transactionSubtype;
                transactionPayload.internalAccount = scope.transferCollectionAccount.ATM_WITHDRAWAL;
            }
            else if(reviewData.transactionType === "Telebirr"){ transactionPayload.internalAccount = scope.transferCollectionAccount.TELEBIRR; }
            else if(reviewData.transactionType === "Awach"){ transactionPayload.internalAccount = scope.transferCollectionAccount.AWACH; }
            else if(reviewData.transactionType === "MPesa"){ transactionPayload.internalAccount = scope.transferCollectionAccount.MPESA; }
            else if(reviewData.transactionType === "MPesa Trust"){ transactionPayload.internalAccount = scope.transferCollectionAccount.MPESA_TRUST; }
            moneyMod.presentationController.createWalletTransfer(transactionPayload);
        }
    },

    // [Trixon] PAYMENT API CALL FOR PAYMENTS{TOPUP <ETHIOTEL, SAFARICOM, ETHIOTEL PACKAGE, POSTPAID, WEBSPRIX, US VISA, SCHOOL FEE, AIRLINES, GUZOGO, DSTV, FHC, TRAFFIC, PARKING, SEREGELA, QUANTUM, WATER BILL}
    makePayment : function(){
        applicationManager.getPresentationUtility().showLoadingScreen();
        var paymentPayload = {
            "category": reviewData.category, 
            "paymentType": reviewData.paymentType,
            "senderAccount": reviewData.senderAccount,
            "senderName":  reviewData.senderName,
            "amount" : reviewData.transactionAmount,
            "frequency": reviewData.frequency,
            "remark": scope.view.txtNote.text
        };
        if(reviewData.paymentType === "EthioTelTopup" || reviewData.paymentType === "SafaricomTopup"){ 
            paymentPayload.phoneNumber = reviewData.billNumber;
            paymentPayload.internalAccount = (reviewData.paymentType === "EthioTelTopup") ? scope.billCollectionAccount.ETHIOTELTOPUP : scope.billCollectionAccount.SAFARICOMTOPUP;
        }
        else if(reviewData.paymentType === "EthioTelPackage"){
            paymentPayload.phoneNumber = reviewData.billNumber;
            paymentPayload.offerId = reviewData.packageDetail.offerId;
            paymentPayload.internalAccount = scope.billCollectionAccount.ETHIOTELTOPUP;
            paymentPayload.packageNameDisplay = reviewData.packageDetail.packageName;
            paymentPayload.packageIdDisplay = ((reviewData.packageDetail.id).indexOf("Unlimited") !== -1 || (reviewData.packageDetail.id).indexOf("Morning") !== -1) ? "" : ((reviewData.packageDetail.id).indexOf("Birthday") !== -1) ? "Birthday" : ((reviewData.packageDetail.id).indexOf("Flexy") !== -1) ? (reviewData.packageDetail.id).replace("Flexy", ""): reviewData.packageDetail.id;
        }
        else if(reviewData.paymentType === "Postpaid"){
            paymentPayload.paymentMode = reviewData.paymentMode;
            paymentPayload.customerName = reviewData.recipientName;
            paymentPayload.accountNumber = (reviewData.paymentMode === kony.i18n.getLocalizedString("cs.apollo.AccountNumber")) ? reviewData.billNumber : ""; 
            paymentPayload.serviceNumber = (reviewData.paymentMode === kony.i18n.getLocalizedString("cs.apollo.ServiceNumber")) ? reviewData.billNumber : ""; 
            paymentPayload.internalAccount = scope.billCollectionAccount.ETHIOTELPOSTPAID;
        }
        else if(reviewData.paymentType === "Websprix"){
            paymentPayload.paymentMode = reviewData.paymentMode;
            paymentPayload.customerName = reviewData.recipientName; 
            paymentPayload.customerID = (reviewData.paymentMode === kony.i18n.getLocalizedString("cs.apollo.CustomerID")) ? reviewData.billNumber : "";
            paymentPayload.phoneNumber = (reviewData.paymentMode === kony.i18n.getLocalizedString("cs.apollo.PhoneNumber")) ? reviewData.billNumber : "";
            paymentPayload.internalAccount = scope.billCollectionAccount.WEBSPRIX;
        }
        else if(reviewData.paymentType === "Airlines" || reviewData.paymentType === "Guzogo"){
            if(reviewData.paymentType === "Airlines") { paymentPayload.phoneNumber = "+251"+(userManager.userObj[0].ContactNumbers[0].phoneNumber).slice(-9); }
            paymentPayload.customerName = reviewData.recipientName; 
            paymentPayload.pnr = reviewData.billNumber;
            paymentPayload.internalAccount = (reviewData.paymentType === "Airlines") ? scope.billCollectionAccount.ETHIOPIANAIRLINES : scope.billCollectionAccount.GUZOGO;
        }
        else if(reviewData.paymentType === "Dstv"){
            paymentPayload.paymentSubtype = reviewData.paymentSubtype;
            paymentPayload.smartcardNumber = reviewData.billNumber;
            paymentPayload.selectedPackageDetail = reviewData.selectedPackageDetail;
            paymentPayload.payeeDetails = reviewData.payeeDetails;
            paymentPayload.packageMonths = reviewData.packageMonths;
            paymentPayload.internalAccount = scope.billCollectionAccount.DSTV;
        }
        else if(reviewData.paymentType === "FHC"){
            paymentPayload.customerName = reviewData.recipientName; 
            paymentPayload.billNumber = reviewData.billNumber;
            paymentPayload.internalAccount = scope.billCollectionAccount.FHC;
        }
        else if(reviewData.paymentType === "Water Bill"){ 
            paymentPayload.customerID = reviewData.payeeDetails.customer_id;
            paymentPayload.customerName = reviewData.payeeDetails.name;
            paymentPayload.cityID = reviewData.waterBillCity.lblSuccess.split(" ")[0];
            paymentPayload.cityName = reviewData.waterBillCity.lblNationality;
            paymentPayload.internalAccount = scope.billCollectionAccount.WATERBILL;
        }
        else if(reviewData.paymentType === "Parking Payment"){
            paymentPayload.plateNumber = reviewData.payeeDetails.data.results[0].vehicle_plate;
            paymentPayload.parkingArea = reviewData.payeeDetails.data.results[0].parking_lot;
            paymentPayload.ticketNumber = reviewData.billNumber;
            paymentPayload.issueDate = formatUtil.formatDateForDisplay(reviewData.payeeDetails.data.results[0].created_at);
            paymentPayload.customerName = reviewData.customerName;
            paymentPayload.internalAccount = scope.billCollectionAccount.TRAFFIC;
        }
        else if(reviewData.paymentType === "School Fee"){
            paymentPayload.paymentMode = reviewData.paymentMode;
            paymentPayload.phoneNumber = reviewData.billNumber;
            paymentPayload.studentName = reviewData.payeeDetails.text[reviewData.selectedStudent].StudentName;
            paymentPayload.studentID = reviewData.payeeDetails.text[reviewData.selectedStudent].AdmissionNumber;
            paymentPayload.billType = reviewData.selectedBillType;
            paymentPayload.schoolName = reviewData.payeeDetails.text[reviewData.selectedStudent].SchoolName;
            paymentPayload.penaltyAmount = reviewData.penaltyAmount;
            paymentPayload.paymentPeriod = reviewData.paymentPeriod;
            paymentPayload.specialFeeDescription = reviewData.specialFeeDescription;
            paymentPayload.internalAccount = scope.billCollectionAccount.SCHOOLFEE;
        }
        else if(reviewData.paymentType === "Traffic Payment"){  // [Trixon] TODO:
            paymentPayload.driverName = reviewData.recipientName;
            paymentPayload.plateNumber = reviewData.payeeDetails.data.results[0].vehicle_plate;
            paymentPayload.orderNumber = reviewData.billNumber;
            paymentPayload.issueDate = formatUtil.formatDateForDisplay(reviewData.payeeDetails.data.results[0].created_at);
            paymentPayload.customerName = reviewData.customerName;
            paymentPayload.internalAccount = scope.billCollectionAccount.TRAFFIC;
        }
        else if(reviewData.paymentType === "US Visa"){
            paymentPayload.pin = reviewData.billNumber;
            paymentPayload.expiryDate = reviewData.expiryDate;
            paymentPayload.orderedBy = reviewData.visitorsName;
            paymentPayload.customerName = reviewData.visitorsName.split(",")[0].trim();
            paymentPayload.internalAccount = scope.billCollectionAccount.USVISA;
            billMod.presentationController.makeUSVisaPayment(paymentPayload);
        }
        else if(reviewData.paymentType === "Seregela"){   
            paymentPayload.orderId = reviewData.billNumber;
            billMod.presentationController.makeSeregelaPayment(paymentPayload);
        }
        if(reviewData.paymentType !== "US Visa" && reviewData.paymentType !== "Seregela") { billMod.presentationController.makeBillPayment(paymentPayload); }
    },

    createScheduleTransfer : function(){
        applicationManager.getPresentationUtility().showLoadingScreen();
        var schedulePayload = {
            "category": reviewData.category, 
            "paymentType": reviewData.paymentType,
            "senderAccount": reviewData.senderAccount,
            "senderName":  reviewData.senderName,
            "amount" : reviewData.transactionAmount,
            "schedulePaymentName" : reviewData.schedulePaymentName,
            "scheduleStartDate" : reviewData.scheduleStartDate,
            "scheduleEndDate" : reviewData.scheduleEndDate,
            "scheduleReminder" : reviewData.scheduleReminder,
            "frequency": reviewData.frequency.lblSuccess,
            "remark": scope.view.txtNote.text
        };
        if(reviewData.scheduleAction === "Create"){
            schedulePayload.scheduleAction = reviewData.scheduleAction;
            if(reviewData.paymentType === "Within BOA" || reviewData.paymentType === "Other Bank"){ 
                schedulePayload.receiverAccount = reviewData.billNumber;
                schedulePayload.receiverName = reviewData.recipientName;
                if(reviewData.paymentType === "Within BOA"){ moneyMod.presentationController.createWithinBoaTransfer(schedulePayload); }
                else{ // [Trixon] TODO: To be configured when API Provided
                    parentController.bindGenericError("In Progress");
                    // var sCharge = (reviewData.transactionSubtype === "RTGS" || reviewData.transactionAmount > scope.serviceChargeRate.ETHSWITCH.ONETIMELIMIT) ? (scope.serviceChargeRate.RTGS.CHARGE + scope.serviceChargeRate.RTGS.NBECHARGE).toFixed(2) : (reviewData.serviceCharge/1.15).toFixed(2);
                    // var sVAT = (reviewData.transactionSubtype === "RTGS" || reviewData.transactionAmount > scope.serviceChargeRate.ETHSWITCH.ONETIMELIMIT) ? ((((scope.serviceChargeRate.RTGS.CHARGE * scope.serviceChargeRate.BOA.VAT).toFixed(2))*0.15)/1.15).toFixed(2) : ((reviewData.serviceCharge*0.15)/1.15).toFixed(2);
                    // schedulePayload.serviceCharge = sCharge;
                    // schedulePayload.vat = sVAT;
                    // schedulePayload.receiverBank = reviewData.recipientBankDetail.institutionName;
                    // schedulePayload.receiverBankBicCode = reviewData.recipientBankDetail.bicCode;
                    // if(reviewData.transactionSubtype === "RTGS" || (reviewData.transactionAmount > scope.serviceChargeRate.ETHSWITCH.ONETIMELIMIT)){
                    //     schedulePayload.transactionSubtype = reviewData.transactionSubtype = "RTGS";
                    //     if(reviewData.transactionAmount > scope.serviceChargeRate.RTGS.AUTHORIZATIONLIMIT){ moneyMod.presentationController.createRTGSTransfer(schedulePayload, "rtgsTransferWithOutAuthorization"); }
                    //     else{ moneyMod.presentationController.createRTGSTransfer(schedulePayload, "rtgsTransferWithOutAuthorizationWithApprover"); }
                    // }else{
                    //     schedulePayload.transactionSubtype = reviewData.transactionSubtype = "EthSwitch";
                    //     schedulePayload.receiverBankCode = reviewData.recipientBankDetail.bankId;
                    //     moneyMod.presentationController.createEthSwitchTransfer(schedulePayload);
                    // }
                }
            }
            else{
                if(reviewData.paymentType === "Postpaid"){
                    schedulePayload.billNumber = reviewData.billNumber;
                    schedulePayload.paymentMode = reviewData.paymentMode;
                    schedulePayload.customerName = reviewData.recipientName;
                    schedulePayload.accountNumber = (reviewData.paymentMode === kony.i18n.getLocalizedString("cs.apollo.AccountNumber")) ? reviewData.billNumber : ""; 
                    schedulePayload.serviceNumber = (reviewData.paymentMode === kony.i18n.getLocalizedString("cs.apollo.ServiceNumber")) ? reviewData.billNumber : ""; 
                    schedulePayload.internalAccount = scope.billCollectionAccount.ETHIOTELPOSTPAID;
                }
                else if(reviewData.paymentType === "Websprix"){
                    schedulePayload.billNumber = reviewData.billNumber;
                    schedulePayload.paymentMode = reviewData.paymentMode;
                    schedulePayload.customerName = reviewData.recipientName; 
                    schedulePayload.customerID = (reviewData.paymentMode === kony.i18n.getLocalizedString("cs.apollo.CustomerID")) ? reviewData.billNumber : "";
                    schedulePayload.phoneNumber = (reviewData.paymentMode === kony.i18n.getLocalizedString("cs.apollo.PhoneNumber")) ? reviewData.billNumber : "";
                    schedulePayload.internalAccount = scope.billCollectionAccount.WEBSPRIX;
                }
                else if(reviewData.paymentType === "FHC"){
                    schedulePayload.customerName = reviewData.recipientName; 
                    schedulePayload.billNumber = reviewData.billNumber;
                    schedulePayload.internalAccount = scope.billCollectionAccount.FHC;
                }
                else if(reviewData.paymentType === "Water Bill"){
                    schedulePayload.customerID = reviewData.payeeDetails.customer_id;
                    schedulePayload.customerName = reviewData.payeeDetails.name;
                    schedulePayload.cityID =  reviewData.waterBillCity.lblSuccess.split(" ")[0];
                    schedulePayload.cityName = reviewData.waterBillCity.lblNationality;
                    schedulePayload.internalAccount = scope.billCollectionAccount.WATERBILL;
                }
                else if(reviewData.paymentType === "Dstv"){
                    schedulePayload.paymentSubtype = "Existing Package";
                    schedulePayload.smartcardNumber = reviewData.billNumber;
                    schedulePayload.selectedPackageDetail = reviewData.selectedPackageDetail;
                    schedulePayload.payeeDetails = reviewData.payeeDetails;
                    schedulePayload.packageMonths = "1";
                    schedulePayload.packageID = reviewData.packageID;
                    schedulePayload.internalAccount = scope.billCollectionAccount.DSTV;
                }
                billMod.presentationController.makeBillPayment(schedulePayload);
            }
        }else{
            schedulePayload.editScheduledPayment = reviewData.editScheduledPayment;
            schedulePayload.scheduleAction = reviewData.scheduleAction;
            if(reviewData.editScheduledPayment.transactionType === "ExternalTransfer"){ moneyMod.presentationController.createWithinBoaTransfer(schedulePayload); }
            else if(reviewData.editScheduledPayment.transactionType === "InternalTransfer"){ billMod.presentationController.makeBillPayment(schedulePayload); }
        }
    },

    // [Zypher] MANAGE AUTHORIZATION FLOW FOR CARD MODULE {SHOW CARD SECRET INFO, SHOW DETAIL, NEWCARD REQUEST, CARD PIN CHANGE}
    backToCard : function(){
        parentController = applicationManager.getPresentationUtility().getController(kony.application.getCurrentForm().id, true);
        var cardFlow = navManager.getCustomInfo("cardFlow");
        switch(cardFlow){
            case "SHOW":
                cardMod.presentationController.fetchCardSecretInfo();
                break;
            case "SHOWDETAIL":
                cardMod.presentationController.fetchCardSecretInfo();
                break;
            case "NEWCARD":
                var cardRequestPayload = {
                    "coreCustomerId": reviewData.customerId,
                    "NameOnCard": reviewData.accountName,
                    "accountType": reviewData.cardType,
                    "accountNumber": reviewData.accountNumber,
                    "flag": "",
                    "deliveryAddress":reviewData.deliveryBranch,
                    "cardFee": reviewData.cardFee
                };
                cardMod.presentationController.requestNewCard(cardRequestPayload);
                break;
            case "PINCHANGE":
                pinchangePayload = navManager.getCustomInfo("currentCardDetails");
                var pinChangeRequest = {
                    "cardAccount":pinchangePayload.carAccount,
                    "pan":pinchangePayload.pan,
                    "oldPin":pinchangePayload.oldPin,
                    "newPin":pinchangePayload.newPin,
                };
                cardMod.presentationController.updateCardPin(pinChangeRequest);
                break;
        }
        navManager.setCustomInfo("cardFlow","");
    },


    // [Zypher] MANAGE LOAN AUTHORIZATION FLOW FOR {REPAY LOAN}
    backToLoan : function(){
        var loanFlow = navManager.getCustomInfo("loanFlow");
        switch(loanFlow){
            case "repay":
                loanMod.presentationController.repayLoan();
                break;
        }  
         navManager.setCustomInfo("cardFlow","");      
    },
    
};
});

/*                      ---------------------------------     [Trixon] End     ---------------------------------                         */