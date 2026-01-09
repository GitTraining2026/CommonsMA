/**
  *@module HashTable
  */
define([], function() {
/**
  * HashTable is an implementation of hash table Data Structure
  *@alias module:HashTable
  *@class
  */
function HashTable(){
  	/**@member {object} items Contains key value pairs*/
    this.items ={};
};


/**
  * set given pair in the table if already exists it return that value
  * @param {String} key  A key in the hashtable
  * @param {String} value is the value for the key
  * @returns {String} previous is the Previous value for the give key if exists, else undefined
  */
HashTable.prototype.setItem = function(key, value){
    var previous = undefined;
    if (this.hasContextItem(key)) {
        previous = this.items[key];
    }
    this.items[key] = value;
    return previous;
};

/**
  * returns value for the given key
  * @param {String} key A key A key in the hashtable 
  * @returns {String} value gives Value for the given key if exists, else undefined
  */
HashTable.prototype.getItem = function(key){
    return this.hasContextItem(key) ? this.items[key] : undefined;
};

/**
  * check whether give key exists or not
  * @param {String} key A key A key in the hashtable 
  * @returns {Boolean} value true if given key exists, else false
  */
HashTable.prototype.hasContextItem = function(key){
    return this.items.hasOwnProperty(key);
};
   
/**
  * removes the key if it exists
  * @param {String} key A key in the hashtable
  * @returns {String} previous Previous value for the give key if exists, else undefined
  */
HashTable.prototype.removeItem = function(key){
    if (this.hasContextItem(key)){
        previous = this.items[key];
        delete this.items[key];
        return previous;
    }
    else {
        return undefined;
    }
};

/**
  * Resets the hash table
  */    
HashTable.prototype.clearTable = function(){
    this.items = {};
};
return HashTable;
});