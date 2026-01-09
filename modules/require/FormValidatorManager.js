/**
  * @module FormValidator
 */
define([], function() {
  /**
   *This is class named FormValidator which validates if each field in the form has value(if yes,the view element is enabled else disabled with respective skins)
   *@alias module:FormValidator
   *@class
   */
  function FormValidator(numValidations){
    this.status = 0;
    /* @member {Integer} numValidationsRequired specifies number of fields to be validated for some value in the form*/
    this.numValidationsRequired = numValidations;
    this.overallStatusChange = 0;
  }
  inheritsFrom(FormValidator, kony.mvc.Business.Delegator);
  FormValidator.prototype.initializeBusinessController = function(){};
  /**
  * checks and update status for each and every field value in array.
  * @member of FormValidator
  * @param {Array} formValues - values of the fields to be validated in respective view
  */
  FormValidator.prototype.preshowCheck = function(formValues){
    for(var i=0;i<this.numValidationsRequired;i++)
    {
      this.checkAndUpdateStatusForNull(i, formValues[i]);
    }
  };
  /**
  * Sets the view element to the class variable with default properties(i.e. view element is disabled with respective skin).
  * @member of FormValidator
  * @param {String} submissionView - the view element which has to be enabled or disabled with respective skins
  */
  FormValidator.prototype.submissionView = function(submissionView){
    this.viewElement = submissionView;
    submissionView.skin = "sknBtnOnBoardingInactive";
    submissionView.setEnabled(false);
  };
  /**
  * checks the value of the field and updates the status for null.
  * @member of FormValidator
  * @param {Integer} index - index of the field passed in the array
  * @param {String} validationValue - value of the field of respective index
  */
  FormValidator.prototype.checkAndUpdateStatusForNull = function(index, validationValue){
    if(validationValue === null || validationValue === undefined || validationValue === ""){
      this.status = this.status & ~(0x01<<index);
    }
    else{
      this.status = this.status | (0x01<<index);
    }
    this.checkStatusAndTriggerCallback();
  };
  /**
  * checks if validation is successful and the status to trigger callbacks(i.e. the view element is enabled or disabled with respective skins).
  * @member of FormValidator
  */
  FormValidator.prototype.checkStatusAndTriggerCallback = function(){
    var statusCheckBitVal = (0x01<<this.numValidationsRequired)-1;
    //Validations successful
    if((this.status & statusCheckBitVal) === statusCheckBitVal){
      this.viewElement.skin = "apolloSknBtnSSPSemiBold120WhiteApolloColorGradient";
      this.viewElement.setEnabled(true);
    }
    else{
      this.viewElement.skin = "sknBtnOnBoardingInactive";
      this.viewElement.setEnabled(false);
    }
  };
  /**
  * checks if the validations are successful and overall status is changed or not.
  * @member of FormValidator
  * @returns {String} - if the status is changed or not
  */
  FormValidator.prototype.checkStatusChanged = function(){
    var statusCheckBitVal = (0x01<<this.numValidationsRequired)-1;
    //Validations successful
    if((this.status & statusCheckBitVal) === statusCheckBitVal){
      // Validations are successful and overall status changed
      if((this.overallStatusChange ^ 0x01) === 0x01){
        this.overallStatusChange = 0x01;
        return "CHANGEVALSUCC";
      }
      // All validations are successful and overall status is unchanged
      else {
        return "NOCHANGEVALSUCC";
      }
    }
    // Validations unsuccessful
    else{
      // Validations are unsuccessful but overall status changed
      if((this.overallStatusChange ^ 0x00) === 0x01){
        this.overallStatusChange = 0x00;
        return "CHANGEVALFAIL";
      }
      // Validations are unsuccessful and overall status is unchanged
      else {
        return "NOCHANGEVALFAIL";
      }
    }
  };
  /**
  * Checks if the date of birth is entered completely in visual clues(if yes,the view element is enabled else disabled with respective skins)
  * @member of FormValidator
  * @param {String} data - data entered in visual cues
  */
  FormValidator.prototype.checkDOBLength = function(data){
    if(data.length===10){
      this.viewElement.skin = "apolloSknBtnSSPSemiBold120WhiteApolloColorGradient";
      this.viewElement.setEnabled(true);
    }else{
      this.viewElement.skin = "sknBtnOnBoardingInactive";
      this.viewElement.setEnabled(false);
    }
  };
  /**
  * Checks if the ssn is entered completely in visual clues(if yes,the view element is enabled else disabled with respective skins)
  * @member of FormValidator
  * @param {String} data - data entered in visual cues
  */
  FormValidator.prototype.checkSSNLength = function(data){
    if(data.length !== 0 && data !== null && data !== undefined){
      this.viewElement.skin = "apolloSknBtnSSPSemiBold120WhiteApolloColorGradient";
      this.viewElement.setEnabled(true);
    }else{
      this.viewElement.skin = "sknBtnOnBoardingInactive";
      this.viewElement.setEnabled(false);
    }
  };
  /**
  * Checks if the phone number is entered completely in visual clues(if yes,the view element is enabled else disabled with respective skins)
  * @member of FormValidator
  * @param {String} data - data entered in visual cues
  */
  FormValidator.prototype.checkPhoneNumberLengthNormal = function(data){
    if(data.length===13){
      this.viewElement.skin = "apolloSknBtnSSPSemiBold120WhiteApolloColorGradient";
      this.viewElement.setEnabled(true);
    }else{
      this.viewElement.skin = "sknBtnOnBoardingInactive";
      this.viewElement.setEnabled(false);
    }
  };
  /**
  * Checks if the secure code is entered completely in visual clues(if yes,the view element is enabled else disabled with respective skins)
  * @member of FormValidator
  * @param {String} data - data entered in visual cues
  */
  FormValidator.prototype.checkSecureCodeLength = function(data){
    if(data.length===6){
      this.viewElement.skin = "apolloSknBtnSSPSemiBold120WhiteApolloColorGradient";
      this.viewElement.setEnabled(true);
    }else{
      this.viewElement.skin = "sknBtnOnBoardingInactive";
      this.viewElement.setEnabled(false);
    }
  };
  /**
  * Checks if amount has some value(if yes,the view element is enabled else disabled with respective skins)
  * @member of FormValidator
  * @param {String} data - data entered in visual cues
  */
  FormValidator.prototype.checkAmountLength = function(data){
    if(data.length>0){
      this.viewElement.skin = "apolloSknBtnSSPSemiBold120WhiteApolloColorGradient";
      this.viewElement.setEnabled(true);
    }else{
      this.viewElement.skin = "sknBtnOnBoardingInactive";
      this.viewElement.setEnabled(false);
    }
  };
  return FormValidator;
});