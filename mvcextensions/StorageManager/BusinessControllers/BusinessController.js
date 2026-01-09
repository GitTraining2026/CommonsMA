/**
  *@module StorageManager
  */
define([], function() {
  /**
   * StorageManager which handles all functions related to storing data into devices and retrieving data from devices.
   *@alias module:StorageManager
   *@class
   */
  function StorageManager(){
    /**@member {object} properties - holds the padding,mode,initializationvector properties which are to be provided as an input for algorithm used while encryption and decryption*/
    this.properties = {
      padding: "pkcs5",
      mode: "cbc",
      initializationvector: "1234567890123456"
    };
    /**@member {string} algorithm - name of the algorithm used for encryption and description*/
    this.algorithm = "aes";
  };
  inheritsFrom(StorageManager, kony.mvc.Business.Delegator);
  StorageManager.prototype.initializeBusinessController = function(){};
  /**
  * Get the stored values associated with key
  * @param {string} key - Description of Parameter
  * @returns {string} - value associated with given key
  */
  StorageManager.prototype.getStoredItem = function(key){
    if(key == undefined || key == null)
      return "";
    value = kony.store.getItem(key);
    return value;
  };
  /**
  * remove the stored values associated with key
  * @param {string} key - Description of Parameter
  * @returns {string} - value removed and return associated with given key
  */
  StorageManager.prototype.removeStoredItem = function (key) {
    if (key == undefined || key == null){
      return "";
    }
    var value = kony.store.getItem(key);
    kony.store.removeItem(key);
    return value;
  };
  /**
  * Store a value with the given key into device
  * @param {string} key - Key for reference
  * @param {string} value - value to be stored
  */
  StorageManager.prototype.setStoredItem = function(key, value){
    if(key == undefined || key == null)
      kony.print("Key is undefined");
    else if(value == undefined || value == null)
      kony.print("value is undefined");
    else
      kony.store.setItem(key, value);
  };
  /**
  * Get the stored values associated with key and decrypt it
  * @param {string} key - Description of Parameter
  * @returns {string} - value associated with given key
  */
  StorageManager.prototype.getStoredEncryptedItem = function(key){
    if(key == undefined || key == null)
      return "";
    value = kony.store.getItem(key);
    try{
    	return this.DecryptValue(value);
    }
    catch(e){}
  };
  /**
  * Store a value by encrypting it with the given key into device
  * @param {string} key - Key for reference
  * @param {string} value - value to be encrypted and stored
  */
  StorageManager.prototype.setStoredEncryptedItem = function(key,value){
    if(key == undefined || key == null)
      kony.print("Key is undefined");
    else if(value == undefined || value == null)
      kony.print("value is undefined");
    else
      kony.store.setItem(key, this.EncryptValue(value));
  };
  /**
  * Returns encrypted value of the give input with the help of algorithms which are set in properties (Helper Function)
  * @param {string} inputValue - A string to encrypt
  * @returns {string} - Encrypted Value for the given input
  */
  StorageManager.prototype.EncryptValue=function(inputValue){
    if(inputValue === undefined || inputValue == null)
      return "";
    if (kony.store.getItem("key") === null) {
      this.getSyncKey();
    }
    var syncKey = kony.store.getItem("key");
    var myUniqueKey = kony.crypto.readKey(syncKey,constants.KONY_KEYCHAIN_ITEM_ACCESSIBLE_ALWAYS_THIS_DEVICE_ONLY);
    var encryptedData = kony.crypto.encrypt(this.algorithm, myUniqueKey, inputValue, this.properties);
    return (kony.convertToBase64(encryptedData));
  };
  /**
  * Helper function for Encryption and Decryption of values
  */
  StorageManager.prototype.getSyncKey = function () {
    if (kony.store.getItem("key") === null) {
      var encryptDecryptKey = kony.crypto.newKey("securerandom",256, {
        subalgo: "aes"
      });
      var myUniqueIDKey = kony.crypto.saveKey("encryptionKey", encryptDecryptKey,constants.KONY_KEYCHAIN_ITEM_ACCESSIBLE_ALWAYS_THIS_DEVICE_ONLY);
      kony.store.setItem("key",myUniqueIDKey);
    }
  };
  /**
  * Returns decrypted value of the give input with the help of algorithms which are set in properties (Helper Function)
  * @param {string} inputValue - An encrypted value
  * @returns {string} - Decrypted Value for the given input
  */
  StorageManager.prototype.DecryptValue = function (inputValue){
    if(inputValue === undefined || inputValue == null)
      return "";
    if (kony.store.getItem("key") === null) {
      this.getSyncKey();
    }
    var syncKey = kony.store.getItem("key");
    var myUniqueKey = kony.crypto.readKey(syncKey,constants.KONY_KEYCHAIN_ITEM_ACCESSIBLE_ALWAYS_THIS_DEVICE_ONLY);
    var decryptedData = kony.crypto.decrypt(this.algorithm, myUniqueKey, kony.convertToRawBytes(inputValue), this.properties);
    return decryptedData;
  };
  return StorageManager;
});
