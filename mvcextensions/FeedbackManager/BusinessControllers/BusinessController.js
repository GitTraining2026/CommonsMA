/**
*@module FeedbackManager
 */
define([], function() {
  /**
   * This is class named FeedbackManager which handles all functions related to Feedback and survey module in the application
   * @alias module:FeedbackManager
   * @class
  */
   function FeedbackManager(){
  }
  inheritsFrom(FeedbackManager, kony.mvc.Business.Delegator);
  FeedbackManager.prototype.initializeBusinessController = function(){};
    /**
      * Function to create User Feedback
      * @member of FeedbackManager
      * @param {JSON} feedbackParams - used to send the feedback Params
      * @param {callBack} presentationSuccessCallback - invoke the call back with success response.
      * @param {callBack} presentationErrorCallback - invoke the call back with error response.
      */
    FeedbackManager.prototype.createUserFeedback = function (params, presentationSuccessCallback, presentationErrorCallback) {
        var userModel = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("CustomerFeedback");
        userModel.customVerb('createFeedback', params, completionCallback);
        function completionCallback(status, data, error) {
            var srh = applicationManager.getServiceResponseHandler();
            var obj = srh.manageResponse(status, data, error);
            if (obj.status === true) {
                presentationSuccessCallback(obj.data);
            }
            else {
                presentationErrorCallback(obj.errmsg);
            }
        }
    };
    FeedbackManager.prototype.updateFeedbackId = function (feedbackID) {
        this.feedbackID = feedbackID;
    }
  /**
    * Function to get SurveyQuestions
    * @member of FeedbackManager
    * @param {JSON} feedbackParams - used to send the feedback Params
    * @param {callBack} presentationSuccessCallback - invoke the call back with success response.
    * @param {callBack} presentationErrorCallback - invoke the call back with error response.
    */
  FeedbackManager.prototype.getSurveyQuestions = function(presentationSuccessCallback,presentationErrorCallback){
    var self=this;
    function completionCallback(status,data,error){
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      } else
        presentationErrorCallback(obj["errmsg"]);
    }
    var response = {
      "questions": [{
          questionid : 101,
          "inputType": "yesNo",
          "question": "Have you faced any problem today while using Infinity Internet Banking Site?",
          "questionInput": ["Yes","No"]
      },
      {
          questionid : 102,
          "inputType": "mcq",
          "question": "Where do you think we can improve our online experience?",
          "questionInput": ["Transfers", "Bill Pay","Security Questions Setting", "Messages"]
      },
      {
          questionid : 103,
          "inputType": "rating",
          "question": "Please specify how likely are you to recommend Infinity to friends/relatives/colleagues, on a scale of 1-5",
          "questionInput": ["Very Unlikely","Very Likely"]
      },
      {
          questionid : 104,
          "inputType": "rating",
          "question": "Please rate your experience of using Infinity Internet banking today - Ease of Logging-in ",
          "questionInput": ["Very Hard","Very Easy"]
      },
      {
          questionid : 105,
          "inputType": "rating",
          "question": "Please rate your experience of using Infinity Internet banking today - Level of security offered",
          "questionInput": ["Very Bad","Very Good"]
      },
      {
          questionid : 106,
          "inputType": "rating",
          "question": "Please rate your experience of using Infinity Internet banking today- Ease of navigation/transacting",
          "questionInput": ["Very Hard","Very Easy"]
      },
      {
          questionid : 107,
          "inputType": "rating",
          "question": "Please rate your experience of using Infinity Internet banking today - Attractiveness",
          "questionInput": ["Very Bad","Very Good"]
      },
      {
          questionid : 108,
          "inputType": "text",
          "question": "Please suggest any improvement area(s) to make your experience better with Infinity Internet Banking? ",
          "questionInput": ""
      }
      ]
  };
      presentationSuccessCallback(response);
  };
  return FeedbackManager;
});