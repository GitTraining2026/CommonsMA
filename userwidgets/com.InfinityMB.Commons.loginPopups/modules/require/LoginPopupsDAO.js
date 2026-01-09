define(function () {
  function LoginPopupsDAO(){}

  LoginPopupsDAO.prototype.login = function(authParams, presentationSuccess, presentationError, identityServiceName){    
    let authClient = KNYMobileFabric.getIdentityService(identityServiceName);
    function successCallback(resSuccess){
      presentationSuccess(resSuccess);
      // applicationManager.getPresentationUtility().dismissLoadingScreen();
    }
    function errorCallback(resError){
      var srh = applicationManager.getServiceResponseHandler();
      var res  = srh.manageLoginResponse(resError);
      presentationError(res);
      // applicationManager.getPresentationUtility().dismissLoadingScreen();
    }
    authClient.login(authParams,successCallback,errorCallback);
  };

  return LoginPopupsDAO;
});