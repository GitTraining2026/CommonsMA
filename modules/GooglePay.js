//#ifdef android
//#define GPay
//#endif

//#ifdef GPay
function GooglePayService(){
  OPC="";
  displayName="";
  lastDigits="";
  address="";
  cardNetworkType="";
  tokenProvider="";
}


/*
 @function: isGPaySupported
 @description: Check whether GPaySupported or not
 */
GooglePayService.prototype.getGooglePayStatus = function(){
  try{
      var gpay = java.import("com.temenos.gpay.GpayAdapter");
      var googlePay = new gpay();
      return googlePay.getGooglePayStatus();
    }
    catch(error){
      kony.print("Unable to get GPay Status "+ error);
      return false;
    }
    
};

/*
 @function: getAllCards
 @param: { successCB } success callback
 @param: { errorCB } error callback
 @description: Get All the cards from GPay Wallet
 */
 GooglePayService.prototype.isCardAlreadyAdded = function(lastFourDigits,callBack){
   try{
       var androidBundle = java.import("com.temenos.gpay.GpayAdapter");
       var bundle = new androidBundle();
       bundle.getAllCards(getCardStatusCallback);
    }
    catch(error){
      callBack(false);
      kony.print("Unable to get All cards from Gpay Wallet"+ error);
    }
  
   function getCardStatusCallback(response){
       response = JSON.parse(response);
       if(response.message === "Success"){
         var tokenData=this.getMatchingCardDetails(lastFourDigits,response);
         callback(tokenData);
       }
       else{
         callback(false);
       }
   }
 };

/*
 @function: addCardToWallet
 @param: { cardDetails } Card details 
 @param:  successCB  success callback
 @param:  errorCB  error callback
 @description: adds card to GPay Wallet
 */
GooglePayService.prototype.addCardToWallet = function(successCB,errorCB){
  cardDetails=this.getCardDetails();
   try{
      KonyMain = java.import("com.konylabs.android.KonyMain");
      var cls = java.newClass("MyKonyActivityLifeCycleListener", "com.konylabs.ffi.KonyActivityLifeCycleListener", [], {
        onActivityResult: function(requestCode,resultCode,data){
          if(resultCode == KonyMain.RESULT_OK)
            successCB();
          else
            errorCB();
        }
      });
      //Registering listener
      listener = new cls();
      KonyMain.addActivityLifeCycleListener(listener);
      var context = KonyMain.getActivityContext();
      var androidBundle = java.import("com.temenos.gpay.GpayAdapter");
      var bundle = new androidBundle();
      bundle.addCard(context,cardDetails);
    }
    catch(error){
      kony.print("Unable to add Card to GPay Wallet " + error);
    }
};
GooglePayService.prototype.getMatchingCardDetails = function(lastFourDigits,tokensData){
  tokenInfo = java.import("com.google.android.gms.tapandpay.issuer.TokenInfo");
  for (var i=0;i<tokensData.length;i++){
    if(tokensData[i].getFpanLastFour()==lastFourDigits){
     return true;
    }
  }
  return false;
};
GooglePayService.prototype.getCardDetails= function(){
  var hashMap = java.import("java.util.HashMap");
  var cardDetails=new hashMap();
  cardDetails.put("address", address);
  cardDetails.put("displayName", displayName);
  cardDetails.put("lastDigits", lastDigits);
  cardDetails.put("cardNetwork", cardType);
  cardDetails.put("tsp", tokenServiceProvider);
  cardDetails.put("OPC",OPC)
//   var cardDetails={
//     "OPC":OPC?OPC:"",
//     "tsp":tokenProvider?tokenProvider:"Visa",
//     "cardNetwork":cardNetworkType?cardNetworkType:"Visa",
//     "displayName":displayName?displayName:"Sreekar",
//     "lastDigits":lastDigits?lastDigits:"",
//     "address":address?address:"",
//   };
  return cardDetails;
};
GooglePayService.prototype.setCardDetails = function(cardDetails){
  this.setTokenizationProvider(cardDetails.tokenizationProvider);
  this.setCardNetworkType(cardDetails.networkType);
  this.setOPC(cardDetails.opaquePaymentCard);
  this.setDisplayName(cardDetails.displayName);
  this.setCardLastDigits(cardDetails.last4);
  this.setAddress(cardDetails.address);
};
GooglePayService.prototype.setOPC= function(opaquePaymentCard){
  OPC=opaquePaymentCard
};
GooglePayService.prototype.setDisplayName= function(cardDisplayName){
  displayName=cardDisplayName
};
GooglePayService.prototype.setCardLastDigits= function(last4Digits){
  lastDigits=last4Digits
};
GooglePayService.prototype.setAddress= function(userAddress){
  address=userAddress
};
GooglePayService.prototype.setCardNetworkType= function(cardNetworkType){
  cardNetworkType=cardNetworkType.toUpperCase();
  try{
    var tapAndPay = java.import("com.google.android.gms.tapandpay.TapAndPay");
    if(cardNetworkType === "VISA"){
        cardType = tapAndPay.CARD_NETWORK_VISA;
    }
    else if(cardNetworkType === "MASTERCARD"){
        cardType = tapAndPay.CARD_NETWORK_MASTERCARD;
    }
    else if(cardNetworkType === "AMEX"){
        cardType = tapAndPay.CARD_NETWORK_AMEX;
    }
    else if(cardNetworkType === "DISCOVER"){
        cardType = tapAndPay.CARD_NETWORK_DISCOVER;
    }
    else if(cardNetworkType=="QUICPAY"){
      cardType = tapAndPay.CARD_NETWORK_QUICPAY;
    }
    else if(cardNetworkType=="PRIVATELABEL"){
      cardType = tapAndPay.CARD_NETWORK_PRIVATE_LABEL;
    }
    else{
        cardType = "";
    }
  }
  catch(error){
    kony.print("Unable to load AddCardInfo class "+ error);
    cardNetworkType = "";
  }
};
/*
 @function: setTokenizationProvider
 @param: tokenProvider  tokenIssuer or tokenprovider
 @description: Sets tokenProvider before addCard API gets invoked
 */
GooglePayService.prototype.setTokenizationProvider = function(tokenProvider){
  tokenProvider = tokenProvider.toUpperCase();
  try{
    var tapAndPay = java.import("com.google.android.gms.tapandpay.TapAndPay");
    if(tokenProvider === "VISA"){
        tokenServiceProvider = tapAndPay.TOKEN_PROVIDER_VISA;
    }
    else if(tokenProvider === "MASTERCARD"){
        tokenServiceProvider = tapAndPay.TOKEN_PROVIDER_MASTERCARD;
    }
    else if(tokenProvider === "AMEX"){
        tokenServiceProvider = tapAndPay.TOKEN_PROVIDER_AMEX;
    }
    else if(tokenProvider === "DISCOVER"){
        tokenServiceProvider = tapAndPay.TOKEN_PROVIDER_DISCOVER;
    }
    else if(tokenProvider=="JCB"){
      tokenServiceProvider = tapAndPay.TOKEN_PROVIDER_JCB;
    }
    else{
        tokenServiceProvider = "";
    }
  }
  catch(error){
    kony.print("Unable to load AddCardInfo class "+ error);
    tokenProvider = "";
  }
};

GooglePayService.prototype.getTokenState = function(tokenState){
  TapAndPay = java.import("com.google.android.gms.tapandpay.TapAndPay");
  if(tokenState==TapAndPay.TOKEN_STATE_NEEDS_IDENTITY_VERIFICATION){

  }
  if(tokenState==TapAndPay.TOKEN_STATE_PENDING){
    return true;
  }
  if(tokenState==TapAndPay.TOKEN_STATE_SUSPENDED){
    return true;
  }
  if(tokenState==TapAndPay.TOKEN_STATE_ACTIVE){

  }
  if(tokenState==TapAndPay.TOKEN_STATE_FELICA_PENDING_PROVISIONING){

  }
  if(tokenState==TapAndPay.TOKEN_STATE_UNTOKENIZED){

  }
}
//#endif
