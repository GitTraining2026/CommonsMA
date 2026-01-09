function TitleBarUtils() {

}

TitleBarUtils.prototype.hideTitleBar = function() {
    var currForm = kony.application.getCurrentForm();
    if (applicationManager.getPresentationFormUtility().getDeviceName() === "iPhone") {
        var titleBarAttributes = currForm.titleBarAttributes;
        titleBarAttributes["navigationBarHidden"] = true;
        currForm.titleBarAttributes = titleBarAttributes;
    }
}

TitleBarUtils.prototype.showTitleBar = function() {
    var currForm = kony.application.getCurrentForm();
    if (applicationManager.getPresentationFormUtility().getDeviceName() === "iPhone") {
        var titleBarAttributes = currForm.titleBarAttributes;
        titleBarAttributes["navigationBarHidden"] = false;
        currForm.titleBarAttributes = titleBarAttributes;
    }
}

TitleBarUtils.prototype.showToast = function(skin, image, message) {
    var currForm = kony.application.getCurrentForm();
    if (applicationManager.getPresentationFormUtility().getDeviceName() === "iPhone") {
        if (currForm.flxMainContainer != null || currForm.flxMainContainer != undefined) {
            // currForm.flxToastDummy.isVisible = true;
            currForm.flxMainContainer.top = "65dp";
        }
        if (currForm.titleBarAttributes != null || currForm.titleBarAttributes != undefined) {
            var titleBarAttributes = currForm.titleBarAttributes;
            titleBarAttributes["navigationBarHidden"] = true;
            currForm.titleBarAttributes = titleBarAttributes;
            titleBarAttributes["navigationBarHidden"] = false;
        }
    }
    currForm.flxPopup.isVisible = true;

    var timerCounter = 3;
    var timerId = "toast";
    currForm.flxPopup.skin = "" + skin;
    // this.view.flxPopup.skin = "sknFlx43ce6e";
    currForm.customPopup.imgPopup.src = "" + image;
    // this.view.customPopup.imgPopup.src = "confirmation.png";
    currForm.customPopup.lblPopup.text = message;

    kony.timer.schedule(timerId, function() {
        currForm.flxPopup.isVisible = false;
        if (applicationManager.getPresentationFormUtility().getDeviceName() === "iPhone") {
            // currForm.flxToastDummy.isVisible = false;
            if (currForm.flxMainContainer != null || currForm.flxMainContainer != undefined) {
                currForm.flxMainContainer.top = "0dp";
            }
            if (currForm.titleBarAttributes != null || currForm.titleBarAttributes != undefined) {
                currForm.titleBarAttributes = titleBarAttributes
            }
        }
    }, 3, false);
}

TitleBarUtils.prototype.showSearchBox = function() {
    var currForm = kony.application.getCurrentForm();
    currForm.flxSearch.isVisible = false;
    currForm.flxHeaderSearchbox.isVisible = true;
    currForm.customSearchbox.tbxSearch.setFocus(true);

    if (applicationManager.getPresentationFormUtility().getDeviceName() === "iPhone") {
        var titleBarAttributes = currForm.titleBarAttributes;
        titleBarAttributes["navigationBarHidden"] = true;
        currForm.titleBarAttributes = titleBarAttributes;
        currForm.flxMainContainer.top = "40dp";
    } else {
        currForm.flxHeader.isVisible = false;
        currForm.flxMainContainer.top = "40dp";
    }
}

TitleBarUtils.prototype.hideSearchBox = function() {
    var currForm = kony.application.getCurrentForm();
    currForm.flxSearch.isVisible = true;
    currForm.flxHeaderSearchbox.isVisible = false;

    if (applicationManager.getPresentationFormUtility().getDeviceName() === "iPhone") {
        var titleBarAttributes = currForm.titleBarAttributes;
        titleBarAttributes["navigationBarHidden"] = false;
        currForm.titleBarAttributes = titleBarAttributes;
        currForm.flxMainContainer.top = "0dp";
    } else {
        currForm.flxHeader.isVisible = true;
        currForm.flxMainContainer.top = "56dp";
    }
}