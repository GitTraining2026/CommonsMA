function ResponsiveUtils(){
	if(kony.os.deviceInfo().name === "thinclient") {
    var currentBreakpoint = kony.application.getCurrentBreakpoint();
	}
    var currentOrientation = kony.os.deviceInfo().screenHeight>kony.os.deviceInfo().screenWidth?1:2;
    var userAgent = kony.os.deviceInfo().userAgent;
    var isDesktop = false;
    var isMobile = false;
    var isTablet = false;
	if(userAgent!== null && userAgent!== undefined) {
    if (userAgent.indexOf("iPad") != -1) {
        isTablet = true;
    } else if (userAgent.indexOf("Android") != -1 && userAgent.indexOf("Mobile") == -1) {
        isTablet = true;
    }
    if (userAgent.indexOf("iPhone") != -1) {
        isMobile = true;
    } else if (userAgent.indexOf("Android") != -1 && userAgent.indexOf("Mobile") != -1) {
        isMobile = true;
    }
	}
    if (!isMobile && !isTablet) {
        isDesktop = true;
    }
    ResponsiveUtils.prototype.isDesktop = isDesktop;
    ResponsiveUtils.prototype.isMobile = isMobile;
    ResponsiveUtils.prototype.isTablet = isTablet;
}
ResponsiveUtils.prototype.isMobile = false;
ResponsiveUtils.prototype.isTablet = false;
ResponsiveUtils.prototype.isDesktop = false;
ResponsiveUtils.prototype.breakpointChangeCalled = false;
ResponsiveUtils.prototype.currentOrientation = -1;

ResponsiveUtils.prototype.onOrientationChange = function(currentBreakpointChange, newBreakpointChange, onResizeCallback) {
    //return;
    ResponsiveUtils();
    if(this.breakpointChangeCalled) return;
    var currentBreakpoint = kony.application.getCurrentBreakpoint();
    var currForm = kony.application.getCurrentForm();
    //var currentOrientation = kony.os.getDeviceCurrentOrientation(); sometimes faults hence custom implementation below:
    var currentOrientation = kony.os.deviceInfo().screenHeight>kony.os.deviceInfo().screenWidth?1:2;
    this.currentOrientation = currentOrientation;
    var isMobile = ResponsiveUtils.prototype.isMobile;
    var isTablet = ResponsiveUtils.prototype.isTablet;

    if(!isMobile && !isTablet)return;
    if (currentBreakpointChange == null && currentBreakpointChange == undefined) {
    	return;
    }
    if (currentOrientation == 2) {
        this.breakpointChangeCalled = true;

        if (isMobile && currentBreakpoint > 640) {
            this.showMobileView();
            currentBreakpointChange(640);    
        } else if (isTablet && currentBreakpoint > 1024) {
            this.showTabletView();
            currentBreakpointChange(1024);
        }
    }else{
        //Do nothing(except nullifying) if the device is already in portrait mode.
    }
    
    currForm.onbreakpointhandler = null;
    currForm.onBreakpointChange = newBreakpointChange;
    this.setOnResize(onResizeCallback);
}

ResponsiveUtils.prototype.setOnResize = function(onResizeCallback) {
    var currForm = kony.application.getCurrentForm();
    currForm.onResize = function(){
        if(onResizeCallback!=null || onResizeCallback!=undefined){
            onResizeCallback();
        }
        var currentOrientation = kony.os.deviceInfo().screenHeight > kony.os.deviceInfo().screenWidth ? 1 : 2;
        if(this.currentOrientation == currentOrientation){
            return;
        }else{
            this.currentOrientation = currentOrientation;
            if(currForm.customheader!==undefined){
                currForm.customheader.onBreakpointChangeComponent(kony.application.getCurrentBreakpoint());
            }
        }
    }.bind(this);
}

ResponsiveUtils.prototype.showMobileView = function() {
    this.showView(640);
}
ResponsiveUtils.prototype.showTabletView = function() {
    this.showView(1024);
}

ResponsiveUtils.prototype.showView = function(width) {
    if(width==null || width == undefined) return;
    var formModel = kony.application.getCurrentForm();
    var bdata = kony.application.getCurrentForm().breakpointData[width];
    var flexProps = ['left', 'top', 'right', 'bottom', 'width', 'height', 'minWidth', 'maxWidth', 'minHeight', 'maxHeight', 'zIndex', 'centerX', 'centerY'];
    for (widgetId in bdata) {
        var setterBasePath = formModel;
        if (bdata[widgetId].parent) {
            setterBasePath = bdata[widgetId].parent;
        }
        var instanceId = bdata[widgetId].instanceId;
        if (instanceId && instanceId !== widgetId) {
            setterBasePath = setterBasePath[instanceId];
        }
        var setterFinalPath = setterBasePath;
        if (formModel.id !== widgetId) {
            var splitArr = widgetId.split("."); //For components without contract instance, widget id will have '.'
            for (var i = 0; i < splitArr.length; i++) {
                setterFinalPath = setterFinalPath[splitArr[i]];
            }
        }
        var wdata = bdata[widgetId];
        for (var prop in wdata) {
            if (prop === 'parent' || prop === 'instanceId') {
                continue
            };
            if (formModel.breakpointResetData && (typeof formModel.breakpointResetData[widgetId] === 'undefined' || typeof formModel.breakpointResetData[widgetId][prop] === 'undefined')) {
                if (!formModel.breakpointResetData[widgetId]) {
                    formModel.breakpointResetData[widgetId] = {};
                }
                if (flexProps.indexOf(prop) > -1) {
                    formModel.breakpointResetData[widgetId][prop] = {};
                    formModel.breakpointResetData[widgetId][prop].value = setterFinalPath[prop];
                } else {
                    formModel.breakpointResetData[widgetId][prop] = setterFinalPath[prop] || "";
                }
                if (wdata.parent) {
                    formModel.breakpointResetData[widgetId].parent = wdata.parent;
                }
                if (wdata.instanceId) {
                    formModel.breakpointResetData[widgetId].instanceId = wdata.instanceId;
                }
            }
            //Unlike other flex properties, value of zIndex is a number and not an object
            if (flexProps.indexOf(prop) > -1 && prop !== 'zIndex') {
                setterFinalPath[prop] = wdata[prop].value;
            } else {
                setterFinalPath[prop] = wdata[prop];
            }
        }
    }
}

ResponsiveUtils.prototype.setMobileFonts = function() {
    var parent = kony.application.getCurrentForm().widgets();
    this.setMobileFontsHelper(parent);
}

ResponsiveUtils.prototype.setMobileFontsHelper = function(widgets) {
    for (var i = 0; i < widgets.length; i++) {
        if (widgets[i].wType === "Label") {
            widgets[i].skin = this.getMobileSkin(widgets[i].skin);
        } else if (widgets[i].wType === "RichText") {
            widgets[i].skin = this.getMobileSkin(widgets[i].skin);
        } else if (widgets[i].wType === "Button") {
            widgets[i].skin = this.getMobileSkin(widgets[i].skin);
        } else if (widgets[i].wType === "TextField") {
            widgets[i].skin = this.getMobileSkin(widgets[i].skin);
        } else if (widgets[i].wType === "FlexContainer" || widgets[i].wType === "FlexScrollContainer") {
            this.setMobileFontsHelper(widgets[i].widgets());
        }
    }
}

ResponsiveUtils.prototype.setDesktopFonts = function() {
    var parent = kony.application.getCurrentForm().widgets();
    this.setDesktopFontsHelper(parent);
}

ResponsiveUtils.prototype.setDesktopFontsHelper = function(widgets) {
    for (var i = 0; i < widgets.length; i++) {
        if (widgets[i].wType === "Label") {
            widgets[i].skin = this.getDesktopSkin(widgets[i].skin);
        } else if (widgets[i].wType === "RichText") {
            widgets[i].skin = this.getDesktopSkin(widgets[i].skin);
        } else if (widgets[i].wType === "Button") {
            widgets[i].skin = this.getDesktopSkin(widgets[i].skin);
        } else if (widgets[i].wType === "TextField") {
            widgets[i].skin = this.getDesktopSkin(widgets[i].skin);
        } else if (widgets[i].wType === "FlexContainer") {
            this.setDesktopFontsHelper(widgets[i].widgets());
        }
    }
}

ResponsiveUtils.prototype.getMobileSkin = function(skin) {
    var skins = {
        "sknSSP72727215Px": "sknSSP72727213Px",
        "sknSSP42424215Opacity0": "sknSSP42424213Opacity0",
        "sknRtxSSP42424215PxNormal": "sknRtxSSP42424213PxNormal",
        "sknBtnffffffBorder0273e31pxRadius2px": "sknBtnffffff13pxBorder0273e31pxRadius2px",
        "sknRtx42424213px": "sknRtx42424211px",
        "sknBtnSSP0273e315px": "sknBtnSSP0273e313Px",
        "sknLblSSP42424215px": "sknSSP42424213Px",
        "sknLabelSSPFF000015Px": "sknSSPLightFF000013Pxreg",
        "sknLato72727213Px": "sknSSP72727211Px",
        "sknRtx424242SSP13px": "sknRtx42424211px",
        "sknRtxSSP72727215px": "sknRtxSSP72727213px",
        "sknSSP42424215Px": "sknLato42424213Px",
        "sknLblffffff15pxSSP": "sknLabelSSPffffff13",
        "sknLabelSSP42424215px": "sknLato42424213Px",
        "sknlLblSSPMedium42424215px": "sknLblSSPMed42424213px",
        "sknlbl727272SSPReg15px": "sknLato72727213Px",
        "sknlbl424242SSP15pxWeight500": "sknLato42424213Px",
        "sknLblSSP42424213px": "sknlblSSP42424211px",
        "sknLblSSP72727215px": "sknLato72727213Px",
        "sknSSP42424217Px": "sknLato42424215Px",
        "sknLabelSSP49494917px":"sknLabelSSP49494915px",
        "sknBtnBlockedSSP0273e315px": "sknBtnBlockedSSP0273e313px",
        "sknRtxSSPFF000015Px": "sknRtxSSPFF000011Px",
        "sknLabel003e7540px" : "sknLabel003e7524px",
        "sknLabel42424220px" : "sknLabel42424215px"
    };
    if (skins[skin] == undefined) {
        return skin;
    } else {
        return skins[skin];
    }
}

ResponsiveUtils.prototype.getDesktopSkin = function(skin) {
    var skins = {
        "sknLato72727213Px": "sknLato72727215Px",
        "sknLato42424213Opacity0": "sknLato42424215Opacity0",
        "sknRtxLato42424213PxNormal": "sknRtxLato42424215PxNormal",
        "sknBtnffffff13pxBorder0273e31pxRadius2px": "sknBtnffffffBorder0273e31pxRadius2px",
        "sknRtx42424211px": "sknRtx42424213px",
        "sknBtnLato0273e313Px": "sknBtnLato0273e315px",
        "sknLato42424213Px": "sknLblLato42424215px",
        "sknLatoLightFF000013Pxreg": "sknLabelLatoFF000015Px",
        "sknLato72727211Px": "sknLato72727213Px",
        "sknRtx42424211px": "sknRtx424242Lato13px",
        "sknRtxLato72727213px": "sknRtxLato72727215px",
        "sknLato42424213Px": "sknLato42424215Px",
        "sknLabelLatoffffff13": "sknLblffffff15pxLato",
        "sknLato42424213Px": "sknLabelLato42424215px",
        "sknLblLatoMed42424213px": "sknlLblLatoMedium42424215px",
        "sknLato72727213Px": "sknlbl727272LatoReg15px",
        "sknLato42424213Px": "sknlbl424242Lato15pxWeight500",
        "sknlbllato42424211px": "sknLblLato42424213px",
        "sknLato72727213Px": "sknLblLato72727215px",
        "sknLato42424215Px": "sknLato42424217Px",
        "sknLabelLato49494915px":"sknLabelLato49494917px",
        "sknBtnBlockedLato0273e313px": "sknBtnBlockedLato0273e315px",
        "sknLabel003e7524px" : "sknLabel003e7540px",
        "sknLabel42424215px" : "sknLabel42424220px"
    };
    if (skins[skin] == undefined) {
        return skin;
    } else {
        return skins[skin];
    }
}


//Initialized a global variable to be used in controllers
var responsiveUtils = new ResponsiveUtils();