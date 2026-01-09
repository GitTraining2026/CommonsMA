function OrientationHandler() {
    var currentBreakpoint = kony.application.getCurrentBreakpoint();
    var currentOrientation = kony.os.deviceInfo().screenHeight>kony.os.deviceInfo().screenWidth?1:2;
    var userAgent = kony.os.deviceInfo().userAgent;
    var isDesktop = false;
    var isMobile = false;
    var isTablet = false;
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
    if (!isMobile && !isTablet) {
        isDesktop = true;
    }
    OrientationHandler.prototype.isDesktop = isDesktop;
    OrientationHandler.prototype.isMobile = isMobile;
    OrientationHandler.prototype.isTablet = isTablet;
}
OrientationHandler.prototype.isMobile = false;
OrientationHandler.prototype.isTablet = false;
OrientationHandler.prototype.isDesktop = false;
OrientationHandler.prototype.breakpointChangeCalled = false;
OrientationHandler.prototype.currentOrientation = -1;
OrientationHandler.prototype.onResizeCallback = null;

OrientationHandler.prototype.onOrientationChange = function(callback, newBreakpointChange, onResizeCallback) {
    //return;
    OrientationHandler();
    if(this.breakpointChangeCalled) return;
    var currentBreakpoint = kony.application.getCurrentBreakpoint();
    var currForm = kony.application.getCurrentForm();
    //var currentOrientation = kony.os.getDeviceCurrentOrientation();
    var currentOrientation = kony.os.deviceInfo().screenHeight>kony.os.deviceInfo().screenWidth?1:2;
    this.currentOrientation = currentOrientation;
    
    var isMobile = OrientationHandler.prototype.isMobile;
    var isTablet = OrientationHandler.prototype.isTablet;
    OrientationHandler.prototype.onResizeCallback = onResizeCallback;
    this.setOnResize(onResizeCallback);
    if(!isMobile && !isTablet)return;
    if (callback == null && callback == undefined) {
    	return;
    }
    if (currentOrientation == 2) {
        if (isMobile && currentBreakpoint > 640) {
            this.showMobileView();
            if(callback!=null && callback!=undefined){
                this.breakpointChangeCalled = true;                
                callback(640);
            }
            currForm.onbreakpointhandler = null;
            currForm.onBreakpointChange = newBreakpointChange;
            this.setOnResize();

        } else if (isTablet && currentBreakpoint > 1024) {
            this.showTabletView();
            if(callback!=null && callback!=undefined){
                this.breakpointChangeCalled = true;                
                callback(1024);
            }
            currForm.onbreakpointhandler = null;
            currForm.onBreakpointChange = newBreakpointChange;
            this.setOnResize();
        }else if(isTablet && currentBreakpoint <=1024){
            currForm.onbreakpointhandler = null;
            currForm.onBreakpointChange = newBreakpointChange;
            this.setOnResize();
        }
    }else{
        currForm.onbreakpointhandler = null;
        currForm.onBreakpointChange = newBreakpointChange;
        this.setOnResize();
    }
}

OrientationHandler.prototype.setOnResize = function(onResizeCallback) {
    var currForm = kony.application.getCurrentForm();
    currForm.onResize = function(){
        if(this.onResizeCallback!=null || this.onResizeCallback!=undefined){
            this.onResizeCallback();
        }
        if(currForm.CustomFooterMain !== undefined){
            currForm.CustomFooterMain.onBreakpointChangeComponent(kony.application.getCurrentBreakpoint());
        }
        if(currForm.customfooter!==undefined){
            currForm.customfooter.onBreakpointChangeComponent(kony.application.getCurrentBreakpoint());
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

OrientationHandler.prototype.showMobileView = function() {
    this.showView(640);
}
OrientationHandler.prototype.showTabletView = function() {
    this.showView(1024);
}

OrientationHandler.prototype.showView = function(width) {
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


