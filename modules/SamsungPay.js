//#ifdef android
//#define samsungPay
//#endif

//#ifdef samsungPay
function SamsungPayService(){
  this.cardType = "";
  this.tokenProvider = "";
  this.payload = "";
}

/*
 @function: setSamsungPayServiceId
 @param: serviceId  SamsungPay partner serviceId
 @description: Sets the partner id given by Samsung Pay Portal
 */
SamsungPayService.prototype.setSamsungPayServiceId = function(serviceId){
  try{
    var spay = java.import("com.temenos.spay.SpayAdapter");
    spay.setServiceId(serviceId);
  }
  catch(error){
    kony.print("Unable to set SamsungPay ServiceId "+ error);
  }
};

/*
 @function: setCardType
 @param: type  cardType
 @description: Sets cardType before addCard API gets invoked
 */
SamsungPayService.prototype.setCardType = function(type){
    type = type.toUpperCase();
    try{
      var Card = java.import("com.samsung.android.sdk.samsungpay.v2.card.Card");
      if(type === "CREDIT"){
          this.cardType = Card.CARD_TYPE_CREDIT;
      }
      else if(type === "DEBIT"){
          this.cardType = Card.CARD_TYPE_DEBIT;
      }
      else{
          this.cardType = "";
      }
    }
    catch(error){
      kony.print("Unable to load Card class "+ error);
      this.cardType = "";
    }
};

/*
 @function: setCardDetails
 @param: {cardDetails}  cardDetails like cardType, tokenProvider, payload
 @description: Sets card details before addCard API gets invoked
 */
SamsungPayService.prototype.setCardDetails = function(cardDetails){
    this.setCardType(cardDetails.cardType);
    this.setTokenizationProvider(cardDetails.tokenizationProvider);
    this.payload = cardDetails.payload;
};

/*
 @function: getCardDetails
 @description: get card details specific to spay like cardType, tokenProvider and payload 
 */
SamsungPayService.prototype.getCardDetails = function(){
    var cardsData = {
       "cardType" : this.cardType,
       "tokenizationProvider": this.tokenProvider,
       "payload" : this.payload
    };
    return cardsData;
};

/*
 @function: setTokenizationProvider
 @param: tokenProvider  tokenIssuer or tokenprovider
 @description: Sets tokenProvider before addCard API gets invoked
 */
SamsungPayService.prototype.setTokenizationProvider = function(tokenProvider){
  tokenProvider = tokenProvider.toUpperCase();
  try{
    var AddCardInfo = java.import("com.samsung.android.sdk.samsungpay.v2.card.AddCardInfo");
    if(tokenProvider === "VISA"){
        this.tokenProvider = AddCardInfo.PROVIDER_VISA;
    }
    else if(tokenProvider === "MASTERCARD"){
        this.tokenProvider = AddCardInfo.PROVIDER_MASTERCARD;
    }
    else if(tokenProvider === "AMEX"){
        this.tokenProvider = AddCardInfo.PROVIDER_AMEX;
    }
    else if(tokenProvider === "DISCOVER"){
        this.tokenProvider = AddCardInfo.PROVIDER_DISCOVER;
    }
    else{
        this.tokenProvider = "";
    }
  }
  catch(error){
    kony.print("Unable to load AddCardInfo class "+ error);
    this.tokenProvider = "";
  }
};

/*
 @function: getSamsungPayStatus
 @param:  callback  callback to send whether Samsung pay is supported and Ready or not
 @description: Check whether SamsungPaySupported or not
 */
SamsungPayService.prototype.getSamsungPayStatus = function(callback){
  try{
      var spay = java.import("com.temenos.spay.SpayAdapter");
      spay.getStatus(checkToShowAddCardSpay);
    }
    catch(error){
      callback(false);
      kony.print("Unable to get SamsungPay Status "+ error);
    }
    function checkToShowAddCardSpay(response){
      response = JSON.parse(response);
     if(response.message === "SPAY_READY"){
      callback(true);
     }
     else{
      callback(false);
     }
    }
};

/*
 @function: checkCardAlreadyAdded
 @param:  FPAN  last 4 digits of cardNumber
 @param:  cards  callback to send whether card already added or not
 @description: check if we have last4digits matches to any cards FPAN
 */
SamsungPayService.prototype.checkCardAlreadyAdded = function(FPAN,cards){
  try{
    var CardManager = java.import("com.samsung.android.sdk.samsungpay.v2.card.CardManager");
    for(var i = 0; i < cards.length; i++){
      if(cards[i].getCardInfo().getString(CardManager.EXTRA_LAST4_FPAN) === FPAN)
        return true;
    }
    return false;
  }
  catch(error){
    return false;
  }
};

/*
 @function: isCardAlreadyAdded
 @param:  FPAN  last 4 digits of cardNumber
 @param:  callback  callback to send whether card already added or not
 @description: Get All the cards from SamsungPay Wallet and check if we have cardId matches to any card
 */
SamsungPayService.prototype.isCardAlreadyAdded = function(FPAN,callback){
  	try{
      var spay = java.import("com.temenos.spay.SpayAdapter");
      spay.getAllCards(getAllCardsCallback);
    }
    catch(error){
      kony.print("Unable to get All cards from Spay Wallet"+ error);
      callback(false);
    }
  
   function getAllCardsCallback(response){
       response = JSON.parse(response);
       if(response.message === "success"){
          var cards = JSON.parse(response.data);
          var isFound = this.checkCardAlreadyAdded(FPAN,cards);
          callback(isFound);
       }
       else{
         callback(false);
       }
   }
};

/*
 @function: addCardToWallet
 @param:  successCB  success callback
 @param:  errorCB  error callback
 @description: adds card to SamsungPay Wallet
 */
SamsungPayService.prototype.addCardToWallet = function(successCB,errorCB){
  	try{
      var spay = java.import("com.temenos.spay.SpayAdapter");
      var cardDetails = this.getCardDetails();
      var hmap = java.import("java.util.HashMap");
      var details=new hmap();
      details.put("cardType",cardDetails.cardType);
      details.put("tokenizationProvider",cardDetails.tokenizationProvider);
      details.put("payload",cardDetails.payload);
      spay.addCard(details,addCardToSpayCallback);
    }
    catch(error){
      kony.print("Unable to add Card to SamsungPay Wallet " + error);
    }
  
    function addCardToSpayCallback(response){
        response = JSON.parse(response);
        if(response.message === "success"){
          successCB();
        }
        else{
          errorCB(response.message);
        }
     }
};
//#endif
