/*
 @function: registerWatchCallback
 @description: Set callback for watch request
 */
function registerWatchCallback(){
  kony.application.setApplicationCallbacks({
    onwatchrequest: getRequestFromWatch
  });
}
/*
 @function: isNetAvailable
 @description: check for the network connectivity
 */
function isNetAvailable(){
  return kony.net.isNetworkAvailable(constants.NETWORK_TYPE_ANY);
}

var watchHandler = {};
/*
 @function: getRequestFromWatch
 @param: { Object } dict
 @param: { Callback } replyHandler
 @description: Check for the request string coming from watch and initiate corresponding service calls
 */
function getRequestFromWatch(dict, replyHandler) {
  try {
    watchHandler = replyHandler;
    //Check for the network connectivity
    var userObj = applicationManager.getUserPreferencesManager();
    var checkDeviceReg = userObj.isDeviceRegistered();
    if(isNetAvailable()) {
    	if(checkDeviceReg) {
        	if (dict.request == WatchConstants.FETCH_ACCOUNTS_REQUEST_KEY) {
          		//Check for the device registration before fetching accounts
          		getAccounts();
            }
            else if (dict.request == WatchConstants.FETCH_TRANSACTIONS_REQUEST_KEY) {
              	getPendingTransactions(dict);
            }
      }
      else {
        //Pass error message to watch's reply handler
        let errorResponse = {};
        errorResponse.error = kony.i18n.getLocalizedString("kony.appleWatch.registrationError");
        replyHandler.executeWithReply(errorResponse);
      }
    }
    else {
      //Pass error message to watch's reply handler
      let errorResponse = {};
      errorResponse.error = kony.i18n.getLocalizedString("kony.appleWatch.networkError");
      replyHandler.executeWithReply(errorResponse);
    }


  } catch(exception) {
    let errorResponse = {};
    errorResponse.error = exception.message;
    replyHandler.executeWithReply(errorResponse);
  }
}

var deviceID = null;
var userName = null;
/*
 @function: getAccounts
 @description: Get all accounts from fabric 
 */
getAccounts = function() {
  try {
    deviceID = applicationManager.getDeviceUtilManager().getDeviceInfo().deviceID;
    userName = applicationManager.getUserPreferencesManager().getUserName();
     var authMode = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("AuthModule");
        if (authMode.presentationController.checkAppinit) 
          {
          var criteria = kony.mvc.Expression.and(kony.mvc.Expression.eq("userName", userName), kony.mvc.Expression.eq("deviceID", deviceID));
          applicationManager.getAccountManager().fetchInternalAccountsPreLogin(criteria, onSuccess, onFailure);
          } 
    else 
      {
            kony.timer.schedule("watchtimerid",getAccounts , 0.1, false);
       
      }
           
  } catch(exception) {
    let errorResponse = {};
    errorResponse.error = exception.message;
    watchHandler.executeWithReply(errorResponse);
  }

  function onSuccess(res) {
    //Pass the response to watch's reply handler
    try {
      let accounts = res;
      var configManager = applicationManager.getConfigurationManager();
      var formatManager = applicationManager.getFormatUtilManager();
      var currency = "";

      for(let i = 0;i < accounts.length;i++) {
        let info = accounts[i];
        if(!info.hasOwnProperty("nickName")|| (!info["nickName"]|| info["nickName"] === "")) {
          let productName = info["accountName"];
          let accountID = info["accountID"].substr(-4);
          let nickName = productName + " ..." + accountID;
          info["nickName"] = productName
        }
        if(info.hasOwnProperty("dueDate") && info["dueDate"] && info["dueDate"] !== "") {
          let dateWithRemovedTime =info["dueDate"].split("T");
          let dateFormatted = dateWithRemovedTime[0].split("-");
          let updatedDate = dateFormatted[1]+"/"+dateFormatted[2]+"/"+dateFormatted[0];
          info["dueDate"] = updatedDate.toString();
        }
        if(info.hasOwnProperty("maturityDate") && info["maturityDate"] && info["maturityDate"] !== "") {
          let dateWithRemovedTime = info["maturityDate"].split("T");
          let dateFormatted = dateWithRemovedTime[0].split("-");
          let updatedDate = dateFormatted[1]+"/"+dateFormatted[2]+"/"+dateFormatted[0];
          info["maturityDate"] = updatedDate.toString();
        }
        if(info.hasOwnProperty("availableBalance") && info["availableBalance"]) {
          let updatedBalance = formatManager.formatAmountandAppendCurrencySymbol(info["availableBalance"]);
          amountObjectWithCurrencySeparated = getCurrencyAndSplitAmount(updatedBalance);
          info["availableBalance"] = amountObjectWithCurrencySeparated.amount.toString();
          currency = amountObjectWithCurrencySeparated.currency;
        }
        if(info.hasOwnProperty("outstandingBalance") && info["outstandingBalance"]) {
          let updatedBalance = formatManager.formatAmountandAppendCurrencySymbol(info["outstandingBalance"]);
          amountObjectWithCurrencySeparated = getCurrencyAndSplitAmount(updatedBalance);
          info["outstandingBalance"] = amountObjectWithCurrencySeparated.amount.toString();
          currency = amountObjectWithCurrencySeparated.currency;
        }
        if(info.hasOwnProperty("currentBalance") && info["currentBalance"]) {
          let updatedBalance = formatManager.formatAmountandAppendCurrencySymbol(info["currentBalance"]);
          amountObjectWithCurrencySeparated = getCurrencyAndSplitAmount(updatedBalance);
          info["currentBalance"] = amountObjectWithCurrencySeparated.amount.toString();
          currency = amountObjectWithCurrencySeparated.currency;
        }
        if(info.hasOwnProperty("payoffAmount") && info["payoffAmount"]) {
          let updatedBalance = formatManager.formatAmountandAppendCurrencySymbol(info["payoffAmount"]);
          amountObjectWithCurrencySeparated = getCurrencyAndSplitAmount(updatedBalance);
          info["payoffAmount"] = amountObjectWithCurrencySeparated.amount.toString();
          currency = amountObjectWithCurrencySeparated.currency;
        }
        if(info.hasOwnProperty("lastStatementBalance") && info["lastStatementBalance"]) {
          let updatedBalance = formatManager.formatAmountandAppendCurrencySymbol(info["lastStatementBalance"]);
          amountObjectWithCurrencySeparated = getCurrencyAndSplitAmount(updatedBalance);
          info["lastStatementBalance"] = amountObjectWithCurrencySeparated.amount.toString();
          currency = amountObjectWithCurrencySeparated.currency;
        }
        if(info.hasOwnProperty("currentAmountDue") && info["currentAmountDue"]) {
          let updatedBalance = formatManager.formatAmountandAppendCurrencySymbol(info["currentAmountDue"]);
          amountObjectWithCurrencySeparated = getCurrencyAndSplitAmount(updatedBalance);
          info["currentAmountDue"] = amountObjectWithCurrencySeparated.amount.toString();
          currency = amountObjectWithCurrencySeparated.currency;
        }
        if(info.hasOwnProperty("principalBalance") && info["principalBalance"]) {
          let updatedBalance = formatManager.formatAmountandAppendCurrencySymbol(info["principalBalance"]);
          amountObjectWithCurrencySeparated = getCurrencyAndSplitAmount(updatedBalance);
          info["principalBalance"] = amountObjectWithCurrencySeparated.amount.toString();
          currency = amountObjectWithCurrencySeparated.currency;
        }
        if(info.hasOwnProperty("minimumDue") && info["minimumDue"]) {
          let updatedBalance = formatManager.formatAmountandAppendCurrencySymbol(info["minimumDue"]);
          amountObjectWithCurrencySeparated = getCurrencyAndSplitAmount(updatedBalance);
          info["minimumDue"] = amountObjectWithCurrencySeparated.amount.toString();
          currency = amountObjectWithCurrencySeparated.currency;
        }
      }
      let replyDictionary = {};
      replyDictionary.Accounts = JSON.stringify(accounts);
      replyDictionary.Currency = currency;
      if(configManager.getLocale()=="en_US")
        replyDictionary.Locale = "en";
      else
      replyDictionary.Locale = configManager.getLocale();
      watchHandler.executeWithReply(replyDictionary);
    } catch(exception) {
      let errorResponse = {};
      errorResponse.error = exception.message;
      watchHandler.executeWithReply(errorResponse);
    }

  }
  function onFailure(err) {
    //Pass the error to watch's reply handler
    let dictResponse = {};
    dictResponse.error = kony.i18n.getLocalizedString("kony.appleWatch.serverError");
    watchHandler.executeWithReply(dictResponse);

  }

};
/*
 @function: getTransactions
 @param: { Object } obj
 @description: Get transactions details of an account 
 */
getPendingTransactions = function(obj) {
  try {
    var configManager = applicationManager.getConfigurationManager();
    var formatManager = applicationManager.getFormatUtilManager();
    var serviceName = "RBObjects";
    var serviceType = "online";
    var objSvc = kony.sdk.getCurrentInstance().getObjectService(serviceName, {"access": serviceType});
    var objectName = "Transactions";
    var dataObject = new kony.sdk.dto.DataObject(objectName);
    var accountID = obj.accountID;
    dataObject.addField("accountID", accountID);
    dataObject.addField("deviceID", deviceID);
    dataObject.addField("UserName", userName);
    var options = {"dataObject":dataObject};
    var verbName = "getAccountPendingTransactionsPreview";

    objSvc.customVerb(verbName, options, onSuccess, onFailure);
  } catch(exception) {
    let errorResponse = {};
    errorResponse.error = exception.message;
    watchHandler.executeWithReply(errorResponse);
  }
  function onSuccess(res) {
    //Pass the response to watch's reply handler
    let pendingTransactions = res.Transactions || [];
    for(let i = 0;i < pendingTransactions.length;i++) {
      if(pendingTransactions[i].hasOwnProperty("amount")) {
        let amount = formatManager.formatAmountandAppendCurrencySymbol(pendingTransactions[i]["amount"]).toString();
        amountObjectWithCurrencySeparated = getCurrencyAndSplitAmount(amount);
        pendingTransactions[i]["amount"] = amountObjectWithCurrencySeparated.amount;
      }
      if(pendingTransactions[i].hasOwnProperty("transactionDate") && pendingTransactions[i]["transactionDate"] !== "") {
        var dateWithRemovedTime = pendingTransactions[i].transactionDate.split("T");
        var dateFormatted = dateWithRemovedTime[0].split("-");
        var updatedDate = dateFormatted[1]+"/"+dateFormatted[2];
        pendingTransactions[i]["transactionDate"] = updatedDate.toString();
      }
    }
    getPostedTransactions(accountID,pendingTransactions);
  }
  function onFailure(err) {
    //Pass the error to watch's reply handler
    let dictResponse = {};
    dictResponse.error = kony.i18n.getLocalizedString("kony.appleWatch.serverError");
    watchHandler.executeWithReply(dictResponse);
  }
};

/*
 @function: getPostedTransactions
 @param: { Object } obj
 @description: Get transactions details of an account 
 */
getPostedTransactions = function(accountID,pendingTransactions) {
  try {
    var configManager = applicationManager.getConfigurationManager();
    var formatManager = applicationManager.getFormatUtilManager();
    var serviceName = "RBObjects";
    var serviceType = "online";
    var objSvc = kony.sdk.getCurrentInstance().getObjectService(serviceName, {"access": serviceType});
    var objectName = "Transactions";
    var dataObject = new kony.sdk.dto.DataObject(objectName);
    dataObject.addField("accountID", accountID);
    dataObject.addField("deviceID", deviceID);
    dataObject.addField("UserName", userName);
    var options = {"dataObject":dataObject};
    var verbName = "getAccountPostedTransactionsPreview";

    objSvc.customVerb(verbName, options, onSuccess, onFailure);
  } catch(exception) {
    let errorResponse = {};
    errorResponse.error = exception.message;
    watchHandler.executeWithReply(errorResponse);
  }
  function onSuccess(res) {
    //Pass the response to watch's reply handler
    let postedTransactions = res.Transactions || [];
    for(let i = 0;i < postedTransactions.length;i++) {
      if(postedTransactions[i].hasOwnProperty("amount")) {
        let amount = formatManager.formatAmountandAppendCurrencySymbol(postedTransactions[i]["amount"]).toString();
        amountObjectWithCurrencySeparated = getCurrencyAndSplitAmount(amount);
        postedTransactions[i]["amount"] = amountObjectWithCurrencySeparated.amount;      }
      if(postedTransactions[i].hasOwnProperty("transactionDate") && postedTransactions[i]["transactionDate"] !== "") {
        let dateWithRemovedTime = postedTransactions[i].transactionDate.split("T");
        let dateFormatted = dateWithRemovedTime[0].split("-");
        let updatedDate = dateFormatted[1]+"/"+dateFormatted[2];
        postedTransactions[i]["transactionDate"] = updatedDate.toString();
      }

    }
    if(Object.keys(pendingTransactions).length === 0) {
      pendingTransactions = [];
    }
    if(Object.keys(postedTransactions).length === 0) {
      postedTransactions = [];
    }
    let replyDictionary = {
      pendingTransactions: pendingTransactions,
      postedTransactions: postedTransactions
    };
    watchHandler.executeWithReply(replyDictionary);

  }
  function onFailure(err) {
    //Pass the error to watch's reply handler
    let dictResponse = {};
    dictResponse.error = kony.i18n.getLocalizedString("kony.appleWatch.serverError");
    watchHandler.executeWithReply(dictResponse);
  }
};

getCurrencyAndSplitAmount = function(amount) {
  let currency = "";
  if(!isNaN(amount.charAt(0))) {
    currency = ""
  } else if(amount.charAt(0) == '-') {
    currency = amount.charAt(1);
    amount = amount.charAt(0) + amount.substring(2,amount.length)
  } else {
    currency = amount.charAt(0)
    amount = amount.substring(1,amount.length)
  }
  return {
    currency: currency,
    amount: amount
  }
}