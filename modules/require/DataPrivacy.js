define(function () {
    function DataPrivacy() {
    }
    var decrypt = function (key, iv, encryptedData) {
        if(encryptedData == "" || !encryptedData ) {
            return encryptedData;
        }
        var keyBytes = CryptoJS.enc.Utf8.parse(key);
        var ivBytes = CryptoJS.enc.Utf8.parse(iv);
        var decryptedBytes = CryptoJS.AES.decrypt(
            { ciphertext: CryptoJS.enc.Base64.parse(encryptedData) },
            keyBytes,
            { iv: ivBytes, mode: CryptoJS.mode.CTR, padding: CryptoJS.pad.NoPadding}
        );
        return decryptedBytes.toString(CryptoJS.enc.Utf8);
    }
    var encrypt = function (key, iv, data) {
        if(data == "" || !data) {
            return data;
        }
        var keyBytes = CryptoJS.enc.Utf8.parse(key);
        var ivBytes = CryptoJS.enc.Utf8.parse(iv);
        var encryptedBytes = CryptoJS.AES.encrypt(
            data,
            keyBytes,
            { iv: ivBytes, mode: CryptoJS.mode.CTR, padding: CryptoJS.pad.NoPadding}
        );
        return encryptedBytes.toString();
    }
    
    return {
        "encrypt": encrypt,
        "decrypt": decrypt
    };
});