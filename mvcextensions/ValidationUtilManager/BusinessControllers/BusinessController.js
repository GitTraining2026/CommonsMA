/**
  * ValidationUtilManager is a utility class which provides the function for validations
  */
define([], function() {
  /**
   * ValidationUtilManager consists of utility methods related to validation
   *@alias module:ValidationUtilManager
   *@class
   */
  function ValidationUtilManager(){
	this.taxIdregex =  /^[0-9a-zA-Z]+$/;
    this.phoneNumberRegex = /^([0-9]){7,15}$/;	
	this.countryCodeRegex = /^\+{1}[0-9]+$/g;
	this.phoneNumberCountryCodeRegex = /^(\+?\d{1,3}|\d{1,4})$/gm;
    this.ssnRegex = /[^a-zA-Z0-9 ]/;
    this.passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/;
    this.invalidChar = "&%<>\/\+'=|\\" ;
    this.zipRegex = /^[^-_][a-zA-Z0-9\s-]*[a-zA-Z0-9\s]+$/;
    this.usernameRegex = "";
    this.benificiaryNameRegex=/^[A-Za-z0-9 ]+$/;
    this.passwordRegex = "";
    this.urlRegex=/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/|www\.)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    this.drivingLicenseRegex = /^[0-9a-zA-Z]*$/;
    this.alphaNumeric=/^[a-z\d\-_\s]+$/i;
  }
  inheritsFrom(ValidationUtilManager, kony.mvc.Business.Delegator);
  ValidationUtilManager.prototype.initializeBusinessController = function(){};
  /**
  * check whether given user name is valid
  * @param {String} username - A username to validate
  * @returns {Boolean} - true if valid, false if invalid
  */
  ValidationUtilManager.prototype.isValidUserName =function(username){
    if(username == null || username == undefined || username == "")
      return false;
    else if(username.indexOf(" ") != -1){
      return false;
    }else if(username.length < 3 || username.length > 20){
      return false;
    }else if(!this.isInvalidCharacterPresent(username)){
      return false;
    }
    return true;
  };
  /**
  * check whether given DrivingLicenseNumber code is valid 
  * @member of ValidationUtilManager
  * @param {String} text - A DrivingLicenseNumber code to validate
  * @returns {Boolean} - true if valid, false if invalid
  */
  ValidationUtilManager.prototype.isValidDrivingLicenseNumber = function(text, alertMessage){
    var regex = this.drivingLicenseRegex;
    if(kony.sdk.isNullOrUndefined(text) || text.length >= 16){
      return false;
    }
    text = text.trim();
    if(!text.match(regex)){
      return false;
    }
    return true;
  };
    /**
  * check whether given BenificiaryName  is valid 
  * @member of ValidationUtilManager
  * @param {String} text - A DrivingLicenseNumber code to validate
  * @returns {Boolean} - true if valid, false if invalid
  */
  ValidationUtilManager.prototype.isValidbenificiaryName = function(text){
    var regex = this.benificiaryNameRegex;
    if(kony.sdk.isNullOrUndefined(text)){
      return false;
    }
    text = text.trim();
    if(!text.match(regex)){
      return false;
    }
    return true;
  };
  
  ValidationUtilManager.prototype.isValidAccountName = function(text) {
        var regex = this.alphaNumeric;
        if (kony.sdk.isNullOrUndefined(text)) {
            return false;
        }
        text = text.trim();
        if (!text.match(regex)) {
            return false;
        }
        return true;
    };
  
  /**
  * check whether given password is valid
  * @param {String} password - A password to validate
  * @returns {Boolean} - true if valid, false if invalid
  */
  ValidationUtilManager.prototype.isValidPassword = function(password){
    if(password === null || password === undefined || password === "")
      return false;
    else if(password.indexOf(" ") !=-1){
      return false;
    }else if(password.length<8 || password.length>24){
      return false;
    }else if(!this.isInvalidCharacterPresent(password)){
      return false;
    }else if(!this.passwordExpressionMatch(password)){
      return false;
    }
    return true;
  };
  /**
  * Helper function to check whether given password has any special characters present
  * @param {String} value - A string to check
  * @returns {Boolean} - true if valid, false if any invalid character present
*/
  ValidationUtilManager.prototype.passwordExpressionMatch=function(val)
  {
    if(!val.match(this.passwordRegex))
    {
      return false;
    }
    return true;
  };
  /**
  * Helper function to check whether given string has any invalid characters present
  * @param {String} value - A string to check
  * @returns {Boolean} - true if valid, false if any invalid character present
  */
  ValidationUtilManager.prototype.isInvalidCharacterPresent=function(value){
    var regexp = this.invalidChar;
    for(var i=0;i<regexp.length;i++){
      if(value.indexOf(regexp[i]) != -1){
        return false;
      }
    }
    return true;
  };
  /**
  * check whether given ZIP code is valid
  * @param {String} text - A ZIP code to validate
  * @param {String} alertMessage - An alert message to be logged
  * @returns {Boolean} - true if valid, false if invalid
  */
  ValidationUtilManager.prototype.isValidZip = function(zipCode){
    if(zipCode === null || zipCode === undefined || zipCode === "" )return false;// no code case
    if(zipCode.match(this.zipRegex)){
      return true;
    }else{
      return false;
    }
  };
  /**
  * check whether given email is valid
  * @param {String} username - An email to validate
  * @returns {Boolean} - true if valid, false if invalid
  */
  ValidationUtilManager.prototype.isValidEmail = function(email){
    return kony.string.isValidEmail(email);
  };
  /**
  * check whether given phone number is valid
  * @param {String} username - Any phone number to validate
  * @returns {Boolean} - true if valid, false if invalid
  */
  ValidationUtilManager.prototype.isValidPhoneNumber = function(phoneNumber){
    var phoneno =  this.phoneNumberRegex;
    if(phoneNumber === null || phoneNumber === undefined || phoneNumber === "" )return false;// no number case
    if(phoneNumber.match(phoneno)){
      return true;
    }else{
      return false;
    }
  };
  /**
  * check whether given country codeis valid 
  * @member of ValidationUtilManager
  * @param {String} username - Any country code to validate
  * @returns {Boolean} - true if valid, false if invalid
  */

ValidationUtilManager.prototype.isValidCountryCode = function(CountryCode){        
      var countryCodeRegex =  this.countryCodeRegex;
      if(CountryCode === null || CountryCode === undefined || CountryCode === "" || CountryCode.length > 4)
        return false;
      if(CountryCode.match(countryCodeRegex)){  
      	return true;  
      }
      else{    
      	return false;  
      }   
};
/**
  * check whether given country code of phone number is valid 
  * @member of ValidationUtilManager
  * @param {String} username - Any country code to validate
  * @returns {Boolean} - true if valid, false if invalid
  */
ValidationUtilManager.prototype.isValidPhoneNumberCountryCode = function(phoneNumberCountryCode){
	var phoneCountryCodeRegex =  this.phoneNumberCountryCodeRegex;
  if(phoneNumberCountryCode === null || phoneNumberCountryCode === undefined || phoneNumberCountryCode === "" )return false;// no number case
  
  if(phoneNumberCountryCode.match(phoneCountryCodeRegex)){  
        return true;  
     }else{    
        return false;  
        }   
};
  /**
  * check whether given URL is valid
  * @param {String} url - Any URL to validate
  * @returns {Boolean} - true if valid, false if invalid
  */
  ValidationUtilManager.prototype.isValidURL = function(url){
    if(!(this.urlRegex.test(url)) && url.trim().length > 0){
      return false;
    }
    return true;
  };
  /**
  * check whether given SSN Number is valid
  * @param {int} ssnNumber - Any SSN Number to validate
  * @returns {Boolean} - true if valid, false if invalid
  */
  ValidationUtilManager.prototype.isValidSSNNumber = function(ssnNumber){
    if(ssnNumber === null || ssnNumber == undefined || ssnNumber === ""){
      return false;
    }
    ssnNumber = ssnNumber.trim();
    if(!ssnNumber.match(this.ssnRegex)){
      return true;
    }
    else {
      return false;
    }
  };
  /**
  * check whether given OTP is valid
  * @param {int} otp - otp to validate
  * @returns {Boolean} - true if valid, false if invalid
  */
  ValidationUtilManager.prototype.isValidOTP = function(otp){
    if(isNaN(otp) || otp === null || otp.length!=6 || otp == undefined ){
      return false;
    }
    else {
      return true;
    }
  };
  /**
  * check whether given Date Of Birth in the format (mm/dd/yyyy) is valid date
  * @param {String} dob - dob to validate
  * @returns {Boolean} - true if valid, false if invalid
  */
  ValidationUtilManager.prototype.isDOBValid = function(dob){
    var locale = kony.i18n.getCurrentLocale();
    var mm, yyyy, dd;
    var dobArray = dob.split('/');
    if (locale == "en_US" || locale == "en") {
      mm = dobArray[0]
      dd = dobArray[1];
      yyyy = dobArray[2];
    }
    else if (locale == "en_GB" || locale === "fr_FR" || locale === "es_ES"  || locale === "ar_AE"){
      mm = dobArray[1]
      dd = dobArray[0];
      yyyy = dobArray[2];
    }
    else if (locale == "de_DE") {
      mm = dobArray[1]
      dd = dobArray[0];
      yyyy = dobArray[2];
    }
    else if (locale == "sv_SE") {
      mm = dobArray[2]
      dd = dobArray[1];
      yyyy = dobArray[0];
    }else if (locale == "ar_AE") {
      mm = dobArray[0]
      dd = dobArray[1];
      yyyy = dobArray[2];
      }
    var userDOB = new Date(yyyy, mm - 1, dd);
    return (userDOB.getFullYear() == yyyy && (userDOB.getMonth() + 1) == mm && userDOB.getDate() == Number(dd) && this.isDateNotGreaterThanCurrentDate(userDOB));
  };
  /**
  * check whether given date object is not greater than current date.
  * @param {Object} date - date to be validated.
  * @returns {Boolean} - true if valid, false if invalid
  */
  ValidationUtilManager.prototype.isDateNotGreaterThanCurrentDate=function(date){
    var currDateValue = new Date();
    var curryear = currDateValue.getFullYear();
    var currMonth = currDateValue.getMonth();
    var currDate = currDateValue.getDate();
    if(date && date.getFullYear() < curryear)
    {
      return true;
    }
    else if(date && date.getFullYear() == curryear)
    {
      if(date && date.getMonth() < currMonth)
      {
        return true;
      }
      else if (date && date.getMonth() == currMonth)
      {
        if(date && date.getDate() <= currDate)
          return true;
      }
    }
    return false;
  };
  /**
  * check whether given age is valid, provided date of birth in the format (mm/dd/yyyy).
  * @param {String} dob - dob to validate
  * @returns {Boolean} - true if valid, false if invalid
  */
  ValidationUtilManager.prototype.isAgeValid = function(dob){
    var locale  = kony.i18n.getCurrentLocale();
    var mm, yyyy, dd;
    var currDateValue = new Date();
    var dobArray = dob.split('/');
    if (locale == "en_US" || locale == "en") {
      mm = dobArray[0]
      dd = dobArray[1];
      yyyy = dobArray[2];
    }
    else if (locale == "en_GB" || locale === "fr_FR" || locale === "es_ES" || locale === "ar_AE"){
      mm = dobArray[1]
      dd = dobArray[0];
      yyyy = dobArray[2];
    }
    else if (locale == "de_DE") {
      mm = dobArray[1]
      dd = dobArray[0];
      yyyy = dobArray[2];
    }
    else if (locale == "sv_SE") {
      mm = dobArray[2]
      dd = dobArray[1];
      yyyy = dobArray[0];
    }
	else if (locale == "ar_AE") {
		mm = dobArray[1]
		dd = dobArray[0];
		yyyy = dobArray[2];
	}
    var userDOB = new Date(yyyy, mm - 1, dd);
    var age = currDateValue.getFullYear() - userDOB.getFullYear();
    var m = currDateValue.getMonth() - userDOB.getMonth();
    if (m < 0 || (m === 0 && currDateValue.getDate() < userDOB.getDate())) {
      age--;
    }
    if(age >= 18 && yyyy >= 1900){
      return true;
    }
    return false;
  };
  /**
  * check whether given CVV is valid
  * @param {int} cvv - cvv to validate
  * @returns {Boolean} - true if valid, false if invalid
  */
  ValidationUtilManager.prototype.isValidCVV = function(cvv){
    if(isNaN(cvv) || cvv === null || cvv.length!=3 || cvv == undefined ){
      return false;
    }
    else {
      return true;
    }
  };
  /**
  * check whether given Security code is valid
  * @param {Number} code - security code to validate
  * @returns {Boolean} - true if valid, false if invalid
  */
  ValidationUtilManager.prototype.isValidSecurityCode = function(code){
    if(isNaN(code) || code === null || code.length!=6 || code == undefined ){
      return false;
    }
    else {
      return true;
    }
  };
  /**
  * check whether given Account Number is valid
  * @param {Number} accNumber - Account Number to validate
  * @returns {Boolean} - true if valid, false if invalid
  */
  ValidationUtilManager.prototype.isValidAccountNumber = function(accNumber){
    if(isNaN(accNumber) || accNumber === null || accNumber.length<=0 || accNumber == undefined || accNumber.length>24 ){
      return false;
    }
    else {
      return true;
    }
  };
  /**
  * check whether given Swift Code is valid
  * @param {Number} accNumber - Swift Code to validate
  * @returns {Boolean} - true if valid, false if invalid
  */
  ValidationUtilManager.prototype.isValidSwiftCode = function(swiftCode){
    if(kony.sdk.isNullOrUndefined(swiftCode)){
      return false;
    }
    else if(swiftCode.length===8 || swiftCode.length===11){
      return true;
    }
    else{
      return false;
    }
  };
  /**
  * check whether given IBAN is valid
  * @param {String} iban- IBAN to validate
  * @returns {Boolean} - true if valid, false if invalid
  */
  ValidationUtilManager.prototype.isValidIBAN = function(iban) {
    iban = iban.replace(/\s/g, '');
    if (!iban.match(/^[\dA-Z]+$/))
      return false;
    var ibanLen = {
      NO:15, BE:16, DK:18, FI:18, FO:18, GL:18, NL:18, MK:19,
      SI:19, AT:20, BA:20, EE:20, KZ:20, LT:20, LU:20, CR:21,
      CH:21, HR:21, LI:21, LV:21, BG:22, BH:22, DE:22, GB:22,
      GE:22, IE:22, ME:22, RS:22, AE:23, GI:23, IL:23, AD:24,
      CZ:24, ES:24, MD:24, PK:24, RO:24, SA:24, SE:24, SK:24,
      VG:24, TN:24, PT:25, IS:26, TR:26, FR:27, GR:27, IT:27,
      MC:27, MR:27, SM:27, AL:28, AZ:28, CY:28, DO:28, GT:28,
      HU:28, LB:28, PL:28, BR:29, PS:29, KW:30, MU:30, MT:31
    };
    var len = iban.length;
    if (len != ibanLen[iban.substr(0,2)])
      return false;
    var ibanNum,ibanMod;
    iban = iban.substr(4) + iban.substr(0,4);
    for (ibanNum='', i=0; i<len; i+=1)
      ibanNum+=parseInt(iban.charAt(i),36);
    for (ibanMod=ibanNum.substr(0,15)%97, ibanNum=ibanNum.substr(15); ibanNum; ibanNum=ibanNum.substr(13))
    ibanMod=(ibanMod+ibanNum.substr(0,13))%97;
    return ibanMod == 1;
  };
  ValidationUtilManager.prototype.createRegexForUsernameValidation = function(data){
    if(data.symbolsAllowed == true){
      this.usernameRegex = new RegExp("^(?=(.*\["+data.supportedSymbols+"\]))\[A-Za-z0-9"+data.supportedSymbols+"]{"+data.minLength+","+data.maxLength+"}$");
    }
    else{
      this.usernameRegex =new RegExp("^\[A-Za-z0-9]{"+data.minLength+","+data.maxLength+"}$");
    }
  };
  /**
  * Helper function to check whether given password has any special characters present
  * @param {String} value - A string to check
  * @returns {Boolean} - true if valid, false if any invalid character present
*/
  ValidationUtilManager.prototype.isUsernameValidForPolicy=function(val)
  {
    if(!val.match(this.usernameRegex))
    {
      return false;
    }
    return true;
  };
  /**
  * Helper function to check whether given password has any special characters present
  * @param {String} value - A string to check
  * @returns {Boolean} - true if valid, false if any invalid character present
*/
  ValidationUtilManager.prototype.isPasswordValidForPolicy=function(val)
  {
    if(val.match(this.passwordRegex) && !this.repeatedCharRegex.test(val))
    {
      return true;
    }
    return false;
  };
  ValidationUtilManager.prototype.createRegexForPasswordValidation = function(data){
    var repeatedCharRules="(.)\\1{"+data.charRepeatCount+"}";
    if(data.supportedSymbols.indexOf("-") > -1){
      data.supportedSymbols = data.supportedSymbols.replace("-","\\-");
    }
    if(data.atleastOneSymbol){
      var passwordRules="";
      if(data.atleastOneLowerCase){
        passwordRules=passwordRules+"(?=.*\[a-z\])";
      }
      if(data.atleastOneUpperCase){
        passwordRules=passwordRules+"(?=.*\[A-Z\])";
      }
      if(data.atleastOneNumber){
        passwordRules=passwordRules+"(?=.*\\d)";
      }
      if(data.atleastOneSymbol){
        passwordRules=passwordRules+"(?=(.*\["+data.supportedSymbols+"\]))";
      }
      if (data.supportedSymbols && data.supportedSymbols.includes(",")) {
        data.supportedSymbols = data.supportedSymbols.replaceAll(",", "");
      }
      this.passwordRegex = new RegExp(passwordRules+"[A-Za-z0-9"+data.supportedSymbols+"]{"+data.minLength+","+data.maxLength+"}$");
      this.repeatedCharRegex = new RegExp(repeatedCharRules);
    }
    else{
      var passwordRules="^";
      if(data.atleastOneLowerCase){
        passwordRules=passwordRules+"(?=.*\[a-z\])";
      }
      if(data.atleastOneUpperCase){
        passwordRules=passwordRules+"(?=.*\[A-Z\])";
      }
      if(data.atleastOneNumber){
        passwordRules=passwordRules+"(?=.*\\d)";
      }
      this.passwordRegex = new RegExp(passwordRules+"\[^\\W\]{"+data.minLength+","+data.maxLength+"}$");
      this.repeatedCharRegex = new RegExp(repeatedCharRules);
    }
  };
  /**
  * Helper function to check whether curent version is major or not
  * @returns - version Number
  */
   ValidationUtilManager.prototype.isMajorVersion = function() {
        var majorVersions = applicationManager.getConfigurationManager().getMajorVersionforRating();
        return majorVersions.includes(appConfig.appVersion);
    };
 /**
  * Helper function to check whether app is upgraded or not
  * @returns - is upgarded or not
*/
    ValidationUtilManager.prototype.hasUpgraded = function() {
        var currentVersion = appConfig.appVersion;
        var lastLoginVersion = applicationManager.getStorageManager().getStoredItem("lastLoginVersion");
        return lastLoginVersion !== currentVersion;
    };
/**
  * Helper function to reset the Feedback Info if app is upgarded
*/
     ValidationUtilManager.prototype.resetFeedbackInfoIfUpgraded = function() {
        if(this.hasUpgraded()) {
          	var current = new Date();
      		var date = new Date(current.getFullYear(), current.getMonth(), current.getDate());
            applicationManager.getStorageManager().setStoredItem("firstTimeLoggedDateAndTime", date.getTime());
            applicationManager.getStorageManager().setStoredItem("noOfTimesFeedbackSubmitted", 0);
            applicationManager.getStorageManager().setStoredItem("lastLoginVersion", appConfig.appVersion);
        }
    };
/**
  * Helper function to get the count of number days user has logged in
*/
     ValidationUtilManager.prototype.numberOfDaysAfterFirstLogin = function() {
       	var current = new Date();
      	var date = new Date(current.getFullYear(), current.getMonth(), current.getDate());
        var firstTimeLoginDate = new Date(applicationManager.getStorageManager().getStoredItem("firstTimeLoggedDateAndTime"));
       	return (date.getTime() - firstTimeLoginDate.getTime()) / 1000/24/60/60;
    };
  /**
  * Helper function to show the Rating Popup
  * context - returns form Context
  */
     ValidationUtilManager.prototype.isFeedBackScreenRequired = function(context) {
        var isRequired = false;
        var configManager = applicationManager.getConfigurationManager();
        var isFeedbackEnabled = configManager.getisFeedbackEnabled();
        var minNoOfDaysForRatingFromProfile = configManager.getRatingFromProfile();
        var minNoOfDaysForRatingFromTransactions = configManager.getRatingFromTransactions();
        var maxNumberOfAttempsForRating = configManager.getMaxtimeRating();
        var minNoOfDaysForAnotherAttemptForRating = configManager.getRatingForSecondtime();
        var noOfTimesFeedbackSubmitted = applicationManager.getStorageManager().getStoredItem("noOfTimesFeedbackSubmitted");
        var noOfDays = this.numberOfDaysAfterFirstLogin();
        if(isFeedbackEnabled === "true" && this.isMajorVersion()) {
            if(context!==null && noOfTimesFeedbackSubmitted === 0 && context.from === "transaction" && noOfDays >= minNoOfDaysForRatingFromTransactions) {
                isRequired = true;
            } else if(context!==null && noOfTimesFeedbackSubmitted === 0 && context.from === "profilesettingorlogout" && noOfDays >= minNoOfDaysForRatingFromProfile) {
                isRequired = true;
            } else if(noOfTimesFeedbackSubmitted>0  && noOfTimesFeedbackSubmitted < maxNumberOfAttempsForRating && noOfDays >= minNoOfDaysForAnotherAttemptForRating) {
                isRequired = true;
            }
        }
       if(isRequired) {
         var current = new Date();
      		var date = new Date(current.getFullYear(), current.getMonth(), current.getDate());
            applicationManager.getStorageManager().setStoredItem("firstTimeLoggedDateAndTime", date.getTime());
            applicationManager.getStorageManager().setStoredItem("noOfTimesFeedbackSubmitted", ++noOfTimesFeedbackSubmitted);
       }
        return isRequired;
   };
   
   ValidationUtilManager.prototype.isValidTaxId = function(taxId){

    var taxidregex =  this.taxIdregex;
    if(taxId === null || taxId === undefined || taxId === "" )return false;// no number case

    if(taxId.match(taxidregex)){  
    return true;  
    }else{    
    return false;  
    }   
  };
  return ValidationUtilManager;
});
