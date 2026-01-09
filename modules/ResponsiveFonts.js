function ResponsiveFonts() {

}

ResponsiveFonts.prototype.mobileFontsSet = false;
ResponsiveFonts.prototype.desktopFontsSet = false;

ResponsiveFonts.prototype.setMobileFonts = function() {
    if(this.mobileFontsSet) return;
    this.mobileFontsSet = true;
    var parent = kony.application.getCurrentForm().widgets();
    this.setMobileFontsHelper(parent);
}

ResponsiveFonts.prototype.setMobileFontsHelper = function(widgets) {
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

ResponsiveFonts.prototype.setDesktopFonts = function() {
    if(this.desktopFontsSet) return;
    this.desktopFontsSet = true;
    var parent = kony.application.getCurrentForm().widgets();
    this.setDesktopFontsHelper(parent);
}

ResponsiveFonts.prototype.setDesktopFontsHelper = function(widgets) {
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

ResponsiveFonts.prototype.getMobileSkin = function(skin) {
    var skins = {
        "sknSSP72727215Px": "sknLblSSP72727213px",
        "sknSSP42424215Opacity0": "sknSSP42424213Opacity0",
        "sknRtxSSP42424215PxNormal": "sknRtxSSP42424213PxNormal",
        "sknBtnffffffBorder0273e31pxRadius2px": "sknBtnffffff13pxBorder0273e31pxRadius2px",
        "sknRtx42424213px": "sknRtx42424211px",
        "sknBtnSSP0273e315px": "sknBtnSSP0273e313Px",
        "sknbtn0161C115pxFocus": "sknBtnSSP0273e313Px",
        "sknLblSSP42424215px": "sknSSP42424213Px",
        "sknLabelSSPFF000015Px": "sknSSPLightFF000013Pxreg",
        "sknSSP72727213Px": "sknSSP72727211Px",
        "sknRtx424242SSP13px": "sknRtx42424211px",
        "sknRtxSSP72727215px": "sknRtxSSP72727213px",
        "sknSSP42424215Px": "sknSSP42424213Px",
        "sknLblffffff15pxSSP": "sknLabelSSPffffff13",
        "sknLabelSSP42424215px": "sknSSP42424213Px",
        "sknlLblSSPMedium42424215px": "sknLblSSPMed42424213px",
        "sknlbl727272SSPReg15px": "sknSSP72727213Px",
        "sknlbl424242SSP15pxWeight500": "sknSSP42424213Px",
        "sknLblSSP42424213px": "sknlblSSP42424211px",
        "sknLblSSP72727215px": "sknSSP72727213Px",
        "sknSSP42424217Px": "sknSSP42424215Px",
        "sknLabelSSP49494917px":"sknLabelSSP49494915px",
		"sknBtnBlockedSSP0273e315px": "sknBtnBlockedSSP0273e313px",
        "sknRtxSSPFF000015Px": "sknRtxSSPFF000013Px",
        "bbSknRtx424242SSP17Px":"sknRtxSSPLight42424215Px",
        "tbxPlaceholderskna0a0a013px":"tbxPlaceholderskna0a0a015px",
        "sknLblSearchItemRight":"sknLblSearchItemRightMobile",
        "sknLblSearchItemCenter":"sknLblSearchItemCenterMobile",
        "skn04aa16fonticon20px":"skn04aa16fonticon14px",
        "sknffa500fonticon20px":"sknffa500fonticon14px",
        "skn424242fonticon20px":"skn424242fonticon14px",
        "sknff0000fonticon20px":"sknff0000fonticon14px",
        "bbSknLbl424242SSP15Px":"sknLblSSP42424213px",
        "bbSknLbl424242SSP17Px":"sknLblSSP42424215px",
        "bbSknLbl727272SSP15Px":"sknlbl727272SSP13px",     
    };
    if (skins[skin] == undefined) {
        // console.log("MOBILE SKIN---->>>>" + skin);
        return skin;
    } else {
        return skins[skin];
    }
}

ResponsiveFonts.prototype.getDesktopSkin = function(skin) {
    var skins = {
        "sknLblSSP72727213px": "sknSSP72727215Px",
        "sknSSP42424213Opacity0": "sknSSP42424215Opacity0",
        "sknRtxSSP42424213PxNormal": "sknRtxSSP42424215PxNormal",
        "sknBtnffffff13pxBorder0273e31pxRadius2px": "sknBtnffffffBorder0273e31pxRadius2px",
        "sknRtx42424211px": "sknRtx42424213px",
        "sknBtnSSP0273e313Px": "sknBtnSSP0273e315px",
        "sknBtnSSP0273e313Px": "sknbtn0161C115pxFocus",
        "sknSSP42424213Px": "sknLblSSP42424215px",
        "sknSSPLightFF000013Pxreg": "sknLabelSSPFF000015Px",
        "sknSSP72727211Px": "sknSSP72727213Px",
        "sknRtx42424211px": "sknRtx424242SSP13px",
        "sknRtxSSP72727213px": "sknRtxSSP72727215px",
        "sknSSP42424213Px": "sknSSP42424215Px",
        "sknLabelSSPffffff13": "sknLblffffff15pxSSP",
        "sknSSP42424213Px": "sknLabelSSP42424215px",
        "sknLblSSPMed42424213px": "sknlLblSSPMedium42424215px",
        "sknSSP72727213Px": "sknlbl727272SSPReg15px",
        "sknSSP42424213Px": "sknlbl424242SSP15pxWeight500",
        "sknlblSSP42424211px": "sknLblSSP42424213px",
        "sknSSP72727213Px": "sknLblSSP72727215px",
        "sknSSP42424215Px": "sknSSP42424217Px",
        "sknLabelSSP49494915px":"sknLabelSSP49494917px",
        "sknBtnBlockedSSP0273e313px": "sknBtnBlockedSSP0273e315px",
        "sknRtxSSPLight42424215Px":"bbSknRtx424242SSP17Px",
        "tbxPlaceholderskna0a0a015px":"tbxPlaceholderskna0a0a013px",
        "sknRtxSSPFF000013Px": "sknRtxSSPFF000015Px",
        "skn04aa16fonticon14px":"skn04aa16fonticon20px",
        "sknffa500fonticon14px":"sknffa500fonticon20px",
        "skn424242fonticon14px":"skn424242fonticon20px",
        "sknff0000fonticon14px":"sknff0000fonticon20px",
        "sknLblSSP42424213px":"bbSknLbl424242SSP15Px",
        "sknLblSSP42424215px":"bbSknLbl424242SSP17Px",
        "sknlbl727272SSP13px":"bbSknLbl727272SSP15Px",
      
    };
    if (skins[skin] == undefined) {
        // console.log("DESKTOP SKIN---->>>>" + skin);
        return skin;
    } else {
        return skins[skin];
    }
}