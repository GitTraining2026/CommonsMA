define(function () {
  function LoginPopupsUtility(){}
  
  LoginPopupsUtility.prototype.showLoadingScreen = function(){
    kony.application.showLoadingScreen(null,"", constants.LOADING_SCREEN_POSITION_ONLY_CENTER, true, true, null);
  };

  LoginPopupsUtility.prototype.dismissLoadingScreen = function(){
    kony.application.dismissLoadingScreen();
  };

  LoginPopupsUtility.prototype.getDeviceName=function(){
    var device = kony.os.deviceInfo().name;
    if(device==="iPhone"||device ==="iPad")
      return "iPhone";
    else
      return device;
  };
  
  return LoginPopupsUtility;
});