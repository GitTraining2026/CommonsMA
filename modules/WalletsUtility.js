//Methods for Wallets support 
isApplePayInitialized = false;

function WalletsIntegration(){
}

WalletsIntegration.prototype.isSamsungPaySupported = function(callback){
  try{
  var tempSamsungPayService = new SamsungPayService();
  if (tempSamsungPayService === null || tempSamsungPayService === undefined){
      callback(false);
  }
  else{
   tempSamsungPayService.getSamsungPayStatus(callback);
   }
  }
  catch(error){
     kony.print("Unable to initiate Spay SDK"+ error);
     callback(false);
  }
};

WalletsIntegration.prototype.isGooglePaySupported = function(){
   try{
  var tempGPayService = new GooglePayService();
  if (tempGPayService === null || tempGPayService === undefined)
      return false;
   var gpayStatus = tempGPayService.getGooglePayStatus();
   return gpayStatus;
  }
  catch(error){
     kony.print("Unable to initiate Gpay SDK"+ error);
     return false;
  }
};

WalletsIntegration.prototype.isApplePaySupported = function(){
  try{
      var tempAPayService = new ApplePay();
      if (tempAPayService === null || tempAPayService === undefined)
      return false;
      if(!isApplePayInitialized){
      tempAPayService.initialize();
      isApplePayInitialized = true;
      }
      return tempAPayService.isApplePaySupported();
    }
    catch(error){
    kony.print("Unable to initiate Apple pay SDK"+ error);
    return false;
  }
};

WalletsIntegration.prototype.isCardAlreadyAdded_Spay = function(cardIdentifier,callback){
  try{
    var tempSamsungPayService = new SamsungPayService();
    var FPAN = cardIdentifier.substr(cardIdentifier.length - 4);
    tempSamsungPayService.isCardAlreadyAdded(FPAN,callback);
  }
  catch(error){
    kony.print("Error in isCardAlreadyAdded_Spay "+ error);
    callback(false);
  }
};
WalletsIntegration.prototype.isCardAlreadyAdded_Gpay = function(cardIdentifier,callback){
  try{
    var tempGPayService = new GooglePayService();
    var FPAN = cardIdentifier.substr(cardIdentifier.length - 4);
    tempGPayService.isCardAlreadyAdded(FPAN,callback);
  }
  catch(error){
    kony.print("Error in isCardAlreadyAdded_Gpay "+ error);
    callback(false);
  }
};
WalletsIntegration.prototype.isCardAlreadyAdded_Apay = function(cardIdentifier){
  try{
      var tempAPayService = new ApplePay();
      if (tempAPayService === null || tempAPayService === undefined)
      return false;
      if(!isApplePayInitialized){
      tempAPayService.initialize();
      isApplePayInitialized = true;
      }
      return tempAPayService.IsCardAlreadyAdded(cardIdentifier);
    }
    catch(error){
    kony.print("Error in isCardAlreadyAdded_Apay "+ error);
      return false;
  }
};
WalletsIntegration.prototype.isCardSupported_Apay = function(){
  try{
      var tempAPayService = new ApplePay();
      if (tempAPayService === null || tempAPayService === undefined)
      return false;
      return tempAPayService.isCardSupported();
  }
  catch(error){
    kony.print("Error in isCardSupported_Apay");
    return false;
  }
};
WalletsIntegration.prototype.addCardtoSPayWallet = function(cardsData,succCallback,errCallback){
  try{
    var tempSamsungPayService = new SamsungPayService();
    tempSamsungPayService.setCardDetails(cardsData);
    tempSamsungPayService.addCardToWallet(succCallback,errCallback);
  }
  catch(error){
    kony.print("Error in addCardtoSPayWallet "+ error);
    errCallback();
  }
};

WalletsIntegration.prototype.addCardtoGPayWallet = function(cardsData,succCallback,errCallback){
  try{
    var tempGPayService = new GooglePayService();
    tempGPayService.setCardDetails(cardsData);
    tempGPayService.addCardToWallet(succCallback,errCallback);
  }
  catch(error){
    kony.print("Error in addCardtoGPayWallet "+ error);
    errCallback();
  }
};
WalletsIntegration.prototype.addCardtoAPayWallet = function(cardsData, succCallback, errCallback) {
    try {
        var tempAPayService = new ApplePay();
        if (!isApplePayInitialized) {
            tempAPayService.initialize();
            isApplePayInitialized = true;
        }
        tempAPayService.addCardToApplePay(cardsData, succCallback, errCallback);
    } catch (error) {
        kony.print("Error in addCardtoAPayWallet " + error);
        errCallback();
    }
};
WalletsIntegration.prototype.getEncryptedCardData = function(cardsData) {
    try {

        var manageCardModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsModule");
        manageCardModule.presentationController.createCardDataForApplePay(cardsData);
    } catch (error) {
        kony.print("Error in addCardtoAPayWallet " + error);
        
    }
};
WalletsIntegration.prototype.sendEncryptedDataToAppleWallet  = function( cardsData) {
    try {
        var tempAPayService = new ApplePay();
        if (!isApplePayInitialized) {
            tempAPayService.initialize();
            isApplePayInitialized = true;
        }
        tempAPayService.sendEncryptedData(cardsData);
       
    } catch (error) {
        kony.print("Error in addCardtoAPayWallet " + error);
        errCallback();
    }
};


