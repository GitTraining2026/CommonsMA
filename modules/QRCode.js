//Type your code here/***** GLOBAL CALLBACK (Browser Widget can access this) *****/
    function qrBase64CB(b64String){
        b64String = b64String.replace(/_q_/g, "'");
        alert("success");
        // get the current form
        var frm = kony.application.getCurrentForm();

        // set the base64 image
        frm.imgQR.base64 = b64String;
    };