define(function() {

  return {

    constructor: function(baseConfig, layoutConfig, pspConfig) {
        this._renderMode = '';
        this._codeText = '';
        this._codeWidth = '';
        this._codeHeight = '';
        this._colorDark = '';
        this._colorLight = '';
        this._correctLevel = '';
    },

    initGettersSetters: function() {
        defineGetter(this, 'renderMode', () => { return this._renderMode; });
        defineSetter(this, 'renderMode', value => { this._renderMode = value; });
        defineGetter(this, 'codeText', () => { return this._codeText; });
        defineSetter(this, 'codeText', value => { this._codeText = value; });
        defineGetter(this, 'codeHeight', () => { return this._codeHeight; });
        defineSetter(this, 'codeHeight', value => { this._codeHeight = value; });
        defineGetter(this, 'colorDark', () => { return this._colorDark; });
        defineSetter(this, 'colorDark', value => { this._colorDark = value; });
        defineGetter(this, 'colorLight', () => { return this._colorLight; });
        defineSetter(this, 'colorLight', value => { this._colorLight = value; });
        defineGetter(this, 'correctLevel', () => { return this._correctLevel; });
        defineSetter(this, 'correctLevel', value => { this._correctLevel = value; });
        defineGetter(this, 'codeWidth', () => { return this._codeWidth; });
        defineSetter(this, 'codeWidth', value => { this._codeWidth = value; });

    },

    _generateQRCode: function(cText = "Apollo QR Code", cWidth = "125", cHeight = "125", cCorrectionLavel = 0, cColorDark = "#000000", cColorLight = "#FFFFFF") {
        cText = JSON.stringify(cText);
        // cText = base64EncodeUnicode(cText);
        // this.SCA_DPLINK = this.getSCADPLINK();
        // this.SCA_DPLINK_NAME = this.getSCADPLINKNAME();
        // if(this.SCA_DPLINK){
            // configManager = applicationManager.getConfigurationManager();
            // this.view.flxHyperLink.isVisible=true;
            // approveLink = "https://approve.app.link/activate?name="+configManager.BOA_QR_GENERATOR+"&qrcode="+cText;
            // this.view.RichTextHyperLink.text = "<a href=\"" +approveLink+ "\">Can’t Scan QR Code?</a>";
        // }
        var urlConf = {
            URL: "QRCodeGenerator/setQRCodeProperties.html?t=" + cText + "&w=" + cWidth + "&h=" + cHeight + "&dc=" + cColorDark + "&lc=" + cColorLight + "&cl=" + cCorrectionLavel, 
            requestMethod:constants.BROWSER_REQUEST_METHOD_GET
        };
        this.view.brwsrQRCode.requestURLConfig = urlConf;
    },

    generateQRCode: function(cText) {
        var scopObj = this;
        // var cText = this._codeText;
        var cText = cText;
        var cWidth = this._codeWidth;
        var cHeight = this._codeHeight;
        var cCorrectionLavel = this._correctLevel;
        var cColorDark = this._colorDark;
        var cColorLight = this._colorLight;
        scopObj._generateQRCode(cText, cWidth, cHeight, cCorrectionLavel, cColorDark, cColorLight);
    },

    setContext: function(cText, cWidth, cHeight, cCorrectionLavel, cColorDark, cColorLight) {
        this._codeText = cText;
        this._codeWidth = cWidth;
        this._codeHeight = cHeight;
        this._correctLevel = cCorrectionLavel;
        this._colorDark= cColorDark;
        this._colorLight = cColorLight;
        this.generateQRCode();
    },

    compInit: function() {
        if(this._renderMode == 'Properties') {
            this.generateQRCode();
        }
    },
    
    // getSCADPLINK : function(){
    //     let self = this;
    //     if(self.clientProperties){
    //         if(self.clientProperties && self.clientProperties.SCA_DPLINK && self.clientProperties.SCA_DPLINK.toUpperCase()==="FALSE") { return false; }
    //         else { return true; }
    //     } else {
    //         let configurationSvc = kony.sdk.getCurrentInstance().getConfigurationService();
    //         configurationSvc.getAllClientAppProperties(function(response) {
    //             self.clientProperties = response;
    //             if(response && response.SCA_DPLINK && response.SCA_DPLINK.toUpperCase()==="FALSE")
    //                 return false;
    //             else 
    //                 return true;
    //             },function(){ kony.print("error", "unable to fetch client properties"); }
    //         );
    //     }
    // },
    
    // getSCADPLINKNAME : function(){
    //     let self = this;
    //     if(self.clientProperties){
    //     if(self.clientProperties && self.clientProperties.SCA_DPLINK_NAME)
    //         return self.clientProperties.SCA_DPLINK_NAME;
    //     } else {
    //         let configurationSvc = kony.sdk.getCurrentInstance().getConfigurationService();
    //         configurationSvc.getAllClientAppProperties(function(response) {
    //             self.clientProperties = response;
    //             if(response && response.SCA_DPLINK_NAME)
    //             return response.SCA_DPLINK_NAME;
    //         },function(){
    //             kony.print("error", "unable to fetch client properties");
    //         });
    //     }
    // },
  };
});