//Type your code here
function addWidgetsformOverlay() {
  formOverlay.setDefaultUnit(kony.flex.DP);  
  var f11 = new kony.ui.FlexContainer({
    "autogrowMode": kony.flex.AUTOGROW_NONE,
    "clipBounds": true,
    "height": "3dp",
    "id": "f11",
    "isVisible": true,
    "layoutType": kony.flex.FREE_FORM,
    "left": "3%",
    "skin": "sknFlxBgFFFFFF",
    "top": "7%",
    "width": "20dp",
    "zIndex": 1
  }, {}, {});
  f11.setDefaultUnit(kony.flex.DP);
  f11.add();
  
  var f12 = new kony.ui.FlexContainer({
    "autogrowMode": kony.flex.AUTOGROW_NONE,
    "clipBounds": true,
    "height": "20dp",
    "id": "f12",
    "isVisible": true,
    "layoutType": kony.flex.FREE_FORM,
    "left": "3%",
    "skin": "sknFlxBgFFFFFF",
    "top": "7%",
    "width": "3dp",
    "zIndex": 1
  }, {}, {});
  f12.setDefaultUnit(kony.flex.DP);
  f12.add();
  
  var f21 = new kony.ui.FlexContainer({
    "autogrowMode": kony.flex.AUTOGROW_NONE,
    "bottom": "7%",
    "clipBounds": true,
    "height": "3dp",
    "id": "f21",
    "isVisible": true,
    "layoutType": kony.flex.FREE_FORM,
    "left": "3%",
    "skin": "sknFlxBgFFFFFF",
    "width": "20dp",
    "zIndex": 1
  }, {}, {});
  f21.setDefaultUnit(kony.flex.DP);
  f21.add();
  
  var f22 = new kony.ui.FlexContainer({
    "autogrowMode": kony.flex.AUTOGROW_NONE,
    "bottom": "7%",
    "clipBounds": true,
    "height": "20dp",
    "id": "f22",
    "isVisible": true,
    "layoutType": kony.flex.FREE_FORM,
    "left": "3%",
    "skin": "sknFlxBgFFFFFF",
    "width": "3dp",
    "zIndex": 1
  }, {}, {});
  f22.setDefaultUnit(kony.flex.DP);
  f22.add();
  
  var f31 = new kony.ui.FlexContainer({
    "autogrowMode": kony.flex.AUTOGROW_NONE,
    "bottom": "7%",
    "clipBounds": true,
    "height": "3dp",
    "id": "f31",
    "isVisible": true,
    "layoutType": kony.flex.FREE_FORM,
    "right": "3%",
    "skin": "sknFlxBgFFFFFF",
    "width": "20dp",
    "zIndex": 1
  }, {}, {});
  f31.setDefaultUnit(kony.flex.DP);
  f31.add();
  
  var f32 = new kony.ui.FlexContainer({
    "autogrowMode": kony.flex.AUTOGROW_NONE,
    "bottom": "7%",
    "clipBounds": true,
    "height": "20dp",
    "id": "f32",
    "isVisible": true,
    "layoutType": kony.flex.FREE_FORM,
    "right": "3%",
    "skin": "sknFlxBgFFFFFF",
    "width": "3dp",
    "zIndex": 1
  }, {}, {});
  f32.setDefaultUnit(kony.flex.DP);
  f32.add();
  
  var f41 = new kony.ui.FlexContainer({
    "autogrowMode": kony.flex.AUTOGROW_NONE,
    "clipBounds": true,
    "height": "3dp",
    "id": "f41",
    "isVisible": true,
    "layoutType": kony.flex.FREE_FORM,
    "right": "3%",
    "skin": "sknFlxBgFFFFFF",
    "top": "7%",
    "width": "20dp",
    "zIndex": 1
  }, {}, {});
  f41.setDefaultUnit(kony.flex.DP);
  f41.add(); 
  
  var f42 = new kony.ui.FlexContainer({
    "autogrowMode": kony.flex.AUTOGROW_NONE,
    "clipBounds": true,
    "height": "20dp",
    "id": "f42",
    "isVisible": true,
    "layoutType": kony.flex.FREE_FORM,
    "right": "3%",
    "skin": "sknFlxBgFFFFFF",
    "top": "7%",
    "width": "3dp",
    "zIndex": 1
  }, {}, {});
  f42.setDefaultUnit(kony.flex.DP);
  f42.add();
  
  var lblFrontText1 = new kony.ui.Label({
    "height": "15%",
    "id": "lblFrontText1",
    "isVisible": true,
    "centerX": "50%",
    "skin": "sknLblffffff22px",
    "text": "Front of Check",
    "textStyle": {},
    "top": "2%",
    "zIndex": 1
  }, {
    "contentAlignment": constants.CONTENT_ALIGN_CENTER,
    "padding": [0, 0, 0, 0],
    "paddingInPixel": false
  }, {
    "textCopyable": false,
    "wrapping": constants.WIDGET_TEXT_WORD_WRAP
  });

  var lblFrontText2 = new kony.ui.Label({
    "bottom": "2%",
    "height": "15%",
    "id": "lblFrontText2",
    "isVisible": true,
    "centerX": "50%",
    "skin": "sknLblffffff22px",
    "text": applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.cameraOverlay.captureInstruction"),
    "textStyle": {},
    "zIndex": 1
  }, {
    "contentAlignment": constants.CONTENT_ALIGN_CENTER,
    "padding": [0, 0, 0, 0],
    "paddingInPixel": false
  }, {
    "textCopyable": false,
    "wrapping": constants.WIDGET_TEXT_WORD_WRAP
  });   

  var imgCropRef = new kony.ui.Image2({
    "bottom": "5%",
    "top": "5%",
    "id": "imgCropRef",
    "isVisible": true,
    "left": "5%",
    "skin": "slImagemb",
    "src": "transparent.png",
    "right": "5%",
    "zIndex": 1,
  }, {
    "imageScaleMode": constants.IMAGE_SCALE_MODE_FIT_TO_DIMENSIONS,
    "padding": [0, 0, 0, 0],
    "paddingInPixel": false
  }, {}); 

  var flxFocusArea = new kony.ui.FlexContainer({
    "clipBounds": true,
    "height": "100%",
    "id": "flxFocusArea",
    "isVisible": true,
    "layoutType": kony.flex.FREE_FORM,
    "left": "0dp",
    "top": "0dp",
    "right": "70dp",
    "skin": "sknFlexTransparent",
  }, {}, {});
  flxFocusArea.add(f11,f12,f21,f22,f31,f32,f41,f42,lblFrontText1,lblFrontText2,imgCropRef);

  var flxOverlayButtons = new kony.ui.FlexContainer({
    "autogrowMode": kony.flex.AUTOGROW_NONE,
    "clipBounds": true,
    "height": "100%",
    "id": "flxOverlayButtons",
    "isVisible": true,
    "layoutType": kony.flex.FREE_FORM,
    "right": "0dp",
    "top": "0dp",
    "width": "70dp",
    "zIndex": 1,
    "skin" : "sknFlx0a78d1"
  }, {}, {});  

  var flxCameraButton = new kony.ui.FlexContainer({
    "autogrowMode": kony.flex.AUTOGROW_NONE,
    "centerX": "50%",
    "centerY": "50%",
    "clipBounds": true,
    "height": "45dp",
    "id": "flxCameraButton",
    "isVisible": true,
    "layoutType": kony.flex.FREE_FORM,
    "width": "45dp",
    "onClick" : takePic
  }, {}, {});
  
  flxCameraButton.setDefaultUnit(kony.flex.DP);
  var imgCameraButton = new kony.ui.Image2({
    "height": "100%",
    "id": "imgCameraButton",
    "isVisible": true,
    "left": "0dp",
    "src": "camerawhite.png",
    "top": "0dp",
    "width": "100%",
    "zIndex": 1
  }, {
    "imageScaleMode": constants.IMAGE_SCALE_MODE_MAINTAIN_ASPECT_RATIO,
    "padding": [0, 0, 0, 0],
    "paddingInPixel": false
  }, {});
  flxCameraButton.add(imgCameraButton);

  var flxCloseButton = new kony.ui.FlexContainer({
    "autogrowMode": kony.flex.AUTOGROW_NONE,
    "centerX": "50%",
    "clipBounds": true,
    "height": "35dp",
    "id": "flxCloseButton",
    "isVisible": true,
    "layoutType": kony.flex.FREE_FORM,
    "top": "10%",
    "width": "35dp",
    "onClick" : closeCam
  }, {}, {});
  
  flxCloseButton.setDefaultUnit(kony.flex.DP);
  var imgCloseButton = new kony.ui.Image2({
    "height": "100%",
    "id": "imgCloseButton",
    "isVisible": true,
    "left": "0dp",
    "src": "closewhite.png",
    "top": "0dp",
    "width": "100%",
    "zIndex": 1
  }, {
    "imageScaleMode": constants.IMAGE_SCALE_MODE_MAINTAIN_ASPECT_RATIO,
    "padding": [0, 0, 0, 0],
    "paddingInPixel": false
  }, {});
  flxCloseButton.add(imgCloseButton);

  flxOverlayButtons.add(flxCameraButton, flxCloseButton);  

  var flxOuter = new kony.ui.FlexContainer({
    "clipBounds": true,
    "height": "100%",
    "id": "flxOuter",
    "isVisible": true,
    "layoutType": kony.flex.FREE_FORM,
    "left": "0dp",
    "top": "0dp",
    "width": "100%",
    "skin": "sknFlexTransparent",
  }, {}, {});
  flxOuter.add( flxFocusArea, flxOverlayButtons );

  formOverlay.add(flxOuter);
}

formOverlay = new kony.ui.Form2({
  "id": "formOverlay",
  "enabledForIdleTimeout": false,
  "layoutType": kony.flex.FREE_FORM,
  "needAppMenu": false,
  "skin": "sknFrmTransparent",
  "addWidgets": addWidgetsformOverlay
}, {
  "displayOrientation": constants.FORM_DISPLAY_ORIENTATION_LANDSCAPE,
  "layoutType": kony.flex.FREE_FORM,
  "padding": [0, 0, 0, 0],
  "paddingInPixel": false
}, {
  "footerOverlap": false,
  "headerOverlap": false,
  "retainScrollPosition": false,
  "titleBar": false,
  "titleBarSkin": "slTitleBarmb",
  "windowSoftInputMode": constants.FORM_ADJUST_PAN
});

function takePic( event ){
  var checkDepositModule = applicationManager.getPresentationUtility().getController('frmUploadCheckImages',true);
  checkDepositModule.takePic( event.info );
}

function closeCam( event ){
  var checkDepositModule = applicationManager.getPresentationUtility().getController('frmUploadCheckImages',true);
  checkDepositModule.closeCam( event.info );
}
