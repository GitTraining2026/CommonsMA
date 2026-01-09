kony = kony || {};
kony.olb = kony.olb || {};
kony.olb.utils = kony.olb.utils || {};

kony.olb.utils.showProgressBar = function (view) {
      kony.application.showLoadingScreen("loadingskin","Data is still Loading");
}

kony.olb.utils.hideProgressBar = function (view) {
    kony.application.dismissLoadingScreen();
}