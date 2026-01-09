/**
*@module PresentationValidationUtility
*/
define([], function () {
 /**
   * PresentationValidationUtility consists of all validation methods related to presentation
   *@alias module:PresentationValidationUtility
   *@class
   */
    function PresentationValidationUtility() {
    }
    inheritsFrom(PresentationValidationUtility, kony.mvc.Business.Delegator);
    PresentationValidationUtility.prototype.initializeBusinessController = function() {
    };
  /**
    * Check's for validity of a text box
    * @param {JSON} text - same as basicConfig in kony.ui.Alert
    * @Returns {bool} - true if valid else false
  */
  PresentationValidationUtility.prototype.isValidTextBox = function (text){
    if(text == null || text == undefined || text == "")
      return false;
    return true;
  }
    return PresentationValidationUtility;
});