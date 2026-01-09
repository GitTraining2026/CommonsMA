define([], function () {

  /**
   * User defined business controller
   * @constructor
   * @extends kony.mvc.Business.Delegator
   */
  function MultiEntityManager() {
    kony.mvc.Business.Delegator.call(this);
    this.userLegalEntitiesListArr = [];
    this.userLegalEntitiesListObj = {};
  }

  inheritsFrom(MultiEntityManager, kony.mvc.Business.Delegator);

  MultiEntityManager.prototype.getUserLegalEntities = function (presentationSuccessCallback, presentationErrorCallback) {
    let scope = this;
    var requestObject = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Users");
    requestObject.customVerb('getLegalEntities', {}, completionCallback);
    function completionCallback(status, data, error) {
      var serviceResponseHandler = applicationManager.getServiceResponseHandler();
      var responseObject = serviceResponseHandler.manageResponse(status, data, error, presentationSuccessCallback, presentationErrorCallback);
      if (responseObject["status"] === true) {
        scope.setUserLegalEntitiesList(responseObject["data"]["customerlegalentity"]);
        presentationSuccessCallback(responseObject["data"]);
      }
      else {
        presentationErrorCallback(responseObject["errmsg"]);
      }
    }
  };

  MultiEntityManager.prototype.updateDefaultEntity = function (params, presentationSuccessCallback, presentationErrorCallback) {
    var model = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("LegalEntity");
    model.customVerb('UpdateDefaultEntity', params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var responseObject = srh.manageResponse(status, data, error);
      if (responseObject["status"] === true) {
        presentationSuccessCallback(responseObject["data"]);
      } else {
        presentationErrorCallback(responseObject["errmsg"]);
      }
    }
  };

  MultiEntityManager.prototype.updateCurrentEntityInCache = function (params, presentationSuccessCallback, presentationErrorCallback) {
    var model = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("LegalEntity");
    model.customVerb('UpdateCurrentEntityInCache', params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var responseObject = srh.manageResponse(status, data, error);
      if (responseObject["status"] === true) {
        presentationSuccessCallback(responseObject["data"]);
      } else {
        presentationErrorCallback(responseObject["errmsg"]);
      }
    }
  };

  MultiEntityManager.prototype.setUserLegalEntitiesList = function (userLegalEntitesList) {
    var userLegalEntitiesObj = {};
    if (userLegalEntitesList && userLegalEntitesList.length > 0) {
      for (let i = 0; i < userLegalEntitesList.length; i++) {
        userLegalEntitiesObj[userLegalEntitesList[i].id] = userLegalEntitesList[i];
      }
      this.userLegalEntitiesListArr = userLegalEntitesList;
      this.userLegalEntitiesListObj = userLegalEntitiesObj;
    }
  };

  /** get user legal entities list as an array **/
  MultiEntityManager.prototype.getUserLegalEntitiesListArr = function () {
    return this.userLegalEntitiesListArr;
  };

  /** get user legal entities list as an object **/
  MultiEntityManager.prototype.getUserLegalEntitiesListObj = function () {
    return this.userLegalEntitiesListObj;
  };

  /** get user legal entities list size **/
  MultiEntityManager.prototype.getUserLegalEntitiesSize = function () {
    return this.userLegalEntitiesListArr.length;
  };

  return MultiEntityManager;

});