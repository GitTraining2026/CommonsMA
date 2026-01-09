//Type your code here
global_vc = null,
    sc = null,
    ec = null,
    handlerApay = null;

function ApplePay() {
    scope_ApplePay = this;
}
/*
 @function: initialize
 @description: Initializes necessary obj-C classes for Apple Wallet
 */
ApplePay.prototype.initialize = function() {
    pkpasskit = objc.import('PKPassLibrary');
    PKAddPaymentPassViewController = objc.import('PKAddPaymentPassViewController');
    UIApplication = objc.import("UIApplication");
    NSData = objc.import('NSData');
    paymentPassRequestClass = objc.import('PKAddPaymentPassRequest');
    config = objc.import('PKAddPaymentPassRequestConfiguration');
    mydata = NSData.jsnew();
    paymentPassRequest = paymentPassRequestClass.jsnew();
    passKitInstance = pkpasskit.alloc().jsinit();
}
/*
 @function: isApplePaySupported
 @description: Checks if the current device supports Apple Pay Wallet functionality
 */
ApplePay.prototype.isApplePaySupported = function() {
    return pkpasskit.isPassLibraryAvailable() && PKAddPaymentPassViewController.canAddPaymentPass();
}
/*
 @function: isApplePaySupported
 @param:  carddetails - to pass to PKAddPaymentPassViewController
 @param:  successcallback  - to be saved for execution after adding card
 @param:  errorcallback -   to be saved for execution if card addition fails
 @description: initiates adding card to wallet
 */
ApplePay.prototype.addCardToApplePay = function(carddetails, successcallback, errorcallback) {
    sc = successcallback;
    ec = errorcallback;
    var cardID = carddetails.vCardID
    ViewController = objc.newClass('ViewController' + Math.random(), 'UIViewController', ['PKAddPaymentPassViewControllerDelegate'], {
        
        /*
         @function: addPaymentPassViewControllerGenerateRequestWithCertificateChainNonceNonceSignatureCompletionHandler
         @param:  certificates
         @param:  nonce
         @param:  nonceSignature
         @param:  handler
         @description: delegate method invoked by PKAddPaymentPassViewControllerDelegate .
         
         */
        addPaymentPassViewControllerGenerateRequestWithCertificateChainNonceNonceSignatureCompletionHandler: function(controller, certificates, nonce, nonceSignature, handler) {
            kony.print(" GenerateRequestWithCertificateChainNonceNonceSignatureCompletionHandler  callback")
            var certificateleaf = certificates[0].base64EncodedStringWithOptions(0);
            var certificateroot = certificates[1].base64EncodedStringWithOptions(0);
            var adevicecert = certificateleaf + certificateroot;
            nonce = nonce.base64EncodedStringWithOptions(0);
            nonceSignature = nonceSignature.base64EncodedStringWithOptions(0);
            handlerhandlerApay = handler;
            var payload = {
                    "cardID": cardID,
                    "deviceCert": adevicecert,
                    "nonceSignature": nonceSignature,
                    "nonce": nonce,
                    "paymentService": "applePay"
                }
            var wallet = new WalletsIntegration();
            wallet.getEncryptedCardData(payload);
        },
        /*
         @function: addPaymentPassViewControllerDidFinishAddingPaymentPassError
         @param:  pass
         @param:  error
         @description: delegate method invoked by PKAddPaymentPassViewControllerDelegate .
         
         */
        addPaymentPassViewControllerDidFinishAddingPaymentPassError: function(controller, pass, error) {
            kony.print("DidFinishAddingPayment callback")
            if (!kony.sdk.isNullOrUndefined(pass)) sc({});
            if (!kony.sdk.isNullOrUndefined(error)) ec({});
            UIApplication.sharedApplication().keyWindow.rootViewController.dismissViewControllerAnimatedCompletion(true, {})
        }
    });
    if (global_vc == null) global_vc = ViewController.alloc().jsinit();
    var jsconfig = config.alloc().jsinit();
    jsconfig.cardholderName = carddetails.cardHolderName;
    jsconfig.primaryAccountSuffix = carddetails.last4;
    jsconfig.localizedDescription = "";
    jsconfig.primaryAccountIdentifier = carddetails.vCardID;
    jsconfig.paymentNetwork = "Visa";
    pv = PKAddPaymentPassViewController.alloc().initWithRequestConfigurationDelegate(jsconfig, global_vc)
    UIApplication.sharedApplication().keyWindow.rootViewController.presentViewControllerAnimatedCompletion(pv, true, {});
    kony.print("end");
}

/*
 @function: IsCardAlreadyAdded
 @param:  cardIdentifier
 @description: Checks if the current card is already added
 */
ApplePay.prototype.IsCardAlreadyAdded = function(cardIdentifier) {
    var paymentPasses = passKitInstance.passesOfType(PKPassTypePayment);
    for (pass in paymentPasses) {
        if (pass.primaryAccountIdentifier == cardIdentifier) return true;
    }
    return false;
}
/*
 @function: isCardSupported
 @param:  cardIdentifier
 @description: checks if current card can be added to apple wallet
 */
ApplePay.prototype.isCardSupported = function(cardIdentifier) {
    return passKitInstance.canAddSecureElementPassWithPrimaryAccountIdentifier(cardIdentifier);
}


/*
 @function: sendEncryptedData
 @param:  payload{encryptedPassData,activationData,ephemeralPublicKey}
 @description: sends encrypted data from issuer to Apple wallet Server 
 */
ApplePay.prototype.sendEncryptedData = function(payload) {
  
    paymentPassRequest.encryptedPassData = mydata.initWithBase64EncodedStringOptions(payload.encryptedPassData, NSDataBase64DecodingIgnoreUnknownCharacters)
    paymentPassRequest.activationData = mydata.initWithBase64EncodedStringOptions(payload.activationData, NSDataBase64DecodingIgnoreUnknownCharacters)
    paymentPassRequest.ephemeralPublicKey = mydata.initWithBase64EncodedStringOptions(payload.ephemeralPublicKey, NSDataBase64DecodingIgnoreUnknownCharacters)
    handlerhandlerApay(paymentPassRequest)
}
