/**
  *@module CacheUtils
  */
define([], function() {

  //on default load params to be passed for initial setting
  /*
  defaultParams - sortBy       - sortBy param
                  order        - order asc,desc
                  pageSize     - limit of the page
                  filterParam  - filterparam like transactionType,status
                  filterValue  - value of the filter
                  onUpdate     - callback that gets invoked after processing the result set with set of events
  */
  function CacheUtils(defaultParams)
  {
    this.sortBy = defaultParams.sortBy;
    this.pageSize = defaultParams.pageSize;
    this.onUpdate = defaultParams.onUpdate;
    this.filterParam = defaultParams.filterParam;
    this.filterValue = defaultParams.filterValue;
    this.sortOrder = defaultParams.order;
    this.defaultSortOrder = this.sortOrder;

    this.offset = 0;
    this.constants = {
      "SORTORDER_ASC":"asc",
      "SORTORDER_DESC":"desc"
    };
    this.isSearchToggled = false;
    this.data = [];
    this._sortedData = [];
    this._searchedData = [];
    this._filteredData = [];
    this.searchField = "";
    this.searchText = "";
  }

  // helper method.
  CacheUtils.prototype._updateListData = function (state) {

    if (this.onUpdate && this.data) {
      var data = [];
      if(state === "search"){
        this.isSearchToggled = true;
        data = this._getSearchedData();
      }
      else if(state === "pagination"){
        data = this._getPaginatedData();
      }
      else if(state === "sort"){
        data = this._getSortedData();
      }
      else{
        this.isSearchToggled = false;
        data = this._getFilteredData();
      }
      this.onUpdate(data, {
        pagination: {
          pageStart: this.offset,
          pageSize: this.pageSize,
          totalSize: this._filteredData.length
        },
        sorting: {
          sortBy: this.sortBy,
          order: this.sortOrder
        },
        state: state,
        searchState: this.isSearchToggled
      });
    }
  };

  // helper method.
  CacheUtils.prototype._getSearchedData = function(){
    var scope = this;
    var data = this.data.filter(scope.filterPredicate).filter(scope.searchPredicate);
    data = this._sortWrapper(data);
    this._sortedData = [];
    this._searchedData = data;
    return data;
  };

  // helper method.
  CacheUtils.prototype._getPaginatedData = function(){
    var data = [];
    var scope = this;
    if(this._sortedData.length === 0)
      data = this.data.filter(this.filterPredicate).slice(parseInt(scope.offset), parseInt(scope.offset)  + scope.pageSize).concat();
    else
      data = this._sortedData.filter(this.filterPredicate).slice(parseInt(scope.offset) , parseInt(scope.offset) + scope.pageSize).concat();
    return data;
  };

  // helper method.
  CacheUtils.prototype._AscSort = function(data) {
    var scope = this;
    var i = 0, j; 
    while (i < data.length) { 
      j = i + 1; 
      while (j < data.length) { 
        if (data[j][scope.sortBy] && data[i][scope.sortBy] && data[j][scope.sortBy].toLowerCase() < data[i][scope.sortBy].toLowerCase()) {
          var temp = data[i]; 
          data[i] = data[j]; 
          data[j] = temp; 
        } 
        j++; 
      } 
      i++; 
    } 
    return data;	
  };

  // helper method.
  CacheUtils.prototype._DescSort = function(data) { 
    var scope = this;
    var i = 0, j; 
    while (i < data.length) { 
      j = i + 1; 
      while (j < data.length) { 
        if (data[j][scope.sortBy] && data[i][scope.sortBy] && data[j][scope.sortBy].toLowerCase() > data[i][scope.sortBy].toLowerCase()) {
          var temp = data[i]; 
          data[i] = data[j]; 
          data[j] = temp; 
        } 
        j++; 
      } 
      i++; 
    }
    return data;	
  };

  // helper method.
  CacheUtils.prototype._getSortedData = function(){
    var data = [];
    var scope = this;
    if(this._searchedData.length === 0){
      data = this.data.filter(this.filterPredicate).concat();
      data = this._sortWrapper(data);
      this._sortedData = data;
      data = data.slice(parseInt(scope.offset), parseInt(scope.offset) + scope.pageSize);
    }
    else{
      data = this._searchedData.filter(this.filterPredicate).concat();
      data = this._sortWrapper(data);
      this._sortedData = data; 
    }

    return data;
  };

  // helper method.
  CacheUtils.prototype._getFilteredData = function(){
    var scope = this;
    var data = this.data.filter(this.filterPredicate);
    this._filteredData = data;
    data = this._sortWrapper(data);
    this._sortedData = data;
    data = data.slice((parseInt(scope.offset)), parseInt(scope.offset)  + scope.pageSize).concat();
    return data;
  };

  // helper method.
  CacheUtils.prototype._sortWrapper = function(data){
    var scope = this;
    if(data.length>0){
      if(isNaN(parseInt(data[0][scope.sortBy]))){
        if(scope.sortOrder === scope.constants["SORTORDER_ASC"]){
          data = this._AscSort(data);
        }
        else{
          data = this._DescSort(data);
        }
      }
      else if(Number.isInteger(Date.parse(data[0][scope.sortBy])) && isNaN(data[0][scope.sortBy])){
        data = data.sort(function(obj1,obj2){
          if(scope.sortOrder === scope.constants["SORTORDER_ASC"]){
            return new Date(obj1[scope.sortBy]) - new Date(obj2[scope.sortBy]);
          }
          else{
            return new Date(obj2[scope.sortBy]) - new Date(obj1[scope.sortBy]);
          }
        });
      }
      else{
        data = data.sort(function(obj1,obj2){
          if(scope.sortOrder === scope.constants["SORTORDER_ASC"]){
            return obj1[scope.sortBy]-obj2[scope.sortBy];
          }
          else{
            return obj2[scope.sortBy]-obj1[scope.sortBy];
          }
        });
      }
    }
    return data;
  };

  //api to store data which has to be cached. Need to be invoked post service call response.
  /*
   data - Array of records
  */
  CacheUtils.prototype.setData = function (data) {
    var scope = this;
    this.data = (this.sortBy && this.sortOrder && data) ? this._sortWrapper(data) : data;
    if(scope.filterValue === "All"){
      this.filterPredicate = function(){
        return true;
      };
    }
    else{
      this.filterPredicate = function(record){
        return record[scope.filterParam] === scope.filterValue;
      };
    }
    this._updateListData();
  };

  //api to be invoked on any of the pagination element selection  
  /*
   offset -  starting index of the page
   pageSize - size of the page
  */
  CacheUtils.prototype.applyPagination = function (offset, pageSize) {
    this.offset = parseInt(offset);
    this.pageSize = pageSize;
    this._updateListData("pagination");
  };

  //api to search on multiple criteria
  /*
   data -  Array of objects
   criteria - Array of criteria objects where each criteria object specifies on which field to search on data, what keyword to search and what is search type.
  */
  CacheUtils.prototype.advancedSearch = function(data,criteria){
    var searchData = [];
    for (var i = 0; i < data.length; i++){
      var noOfFieldsMatched = 0;
      for(var j = 0; j < criteria.length; j++){
        //criteria[j].fields contains array of fields where if any of the field matches with ith data object then this criteria is considered as match
        for(var index = 0;index < criteria[j].fields.length; index++){
           if(criteria[j].type === "substringMatch" && this._substringMatch(data[i],criteria[j],criteria[j].fields[index])){
             noOfFieldsMatched++;
             break;
           }
           else if(criteria[j].type === "completeMatch" && this._completeMatch(data[i],criteria[j],criteria[j].fields[index])){
             noOfFieldsMatched++;
             break;
           }
           else if(criteria[j].type === "dateBetween" && this._dateBetween(data[i],criteria[j],criteria[j].fields[index])){
             noOfFieldsMatched++;
             break;
           }
           else if(criteria[j].type === "rangeBetween" && this._rangeBetweenIgnoreSign(data[i],criteria[j],criteria[j].fields[index])){
             noOfFieldsMatched++;
             break;
           }
        }
      }
      if(noOfFieldsMatched === criteria.length)
        searchData.push(data[i]);
    }
    return searchData;
  };

  //helper method 
  CacheUtils.prototype._substringMatch =  function(data,criteria,fieldName){
    var targetValue = criteria.value;
    if(data[fieldName] && data[fieldName].toLowerCase().indexOf(targetValue.toLowerCase()) > -1)
        return true;
    return false;
  };

  //helper method 
  CacheUtils.prototype._completeMatch =  function(data,criteria,fieldName){
    var targetValue = criteria.value;
    if(data[fieldName] && data[fieldName].toLowerCase() === targetValue.toLowerCase())
        return true;
    return false;
  };

  //helper method 
  CacheUtils.prototype._dateBetween = function(data,criteria,fieldName){
    if(data[fieldName]){
        var date = new Date(data[fieldName]);
        var minDate = new Date(criteria.minimum);
        var maxDate = new Date(criteria.maximum);
        if ((date.getTime() === minDate.getTime()) || (date.getTime() === maxDate.getTime())||date > minDate && date < maxDate) return true;
    }
    return false;
  };

  //helper method 
  CacheUtils.prototype._rangeBetweenIgnoreSign = function(data,criteria,fieldName){
    if(isNaN(data[fieldName]) || !data[fieldName])
        return false;
    var minimum = Number(criteria.minimum);
    var maximum = Number(criteria.maximum);
    var dataValue = Math.abs(Number(data[fieldName]));
    if(dataValue>=minimum && dataValue<=maximum)
      return true;
    return false;
  };

  //api to search for entered text
  /*
   searchFields -  Array of fileds in case of multiple search parameters
   searchText - String user entered searchtext
  */

  CacheUtils.prototype.applySearch = function (searchFields, searchText) {

    var scope = this;
    this.searchField = "";
    if(Array.isArray(searchFields)){
      this.searchText = searchText;
      this.searchPredicate = function(record){
        var result = false;
        searchFields.forEach(function(field) {
          result = result || record[field] && record[field].toLowerCase().indexOf(scope.searchText.toLowerCase()) > -1;
          if(record[field] && !isNaN(Number(record[field]))){
            result = result || (Number(record[field]) === Number(scope.searchText));
            if (!isNaN(Number(searchText)) && searchText.indexOf('.') > -1 && searchText.endsWith('0')){
              searchNumber = searchText.replace(/0+$/,'');
              result = result ||  record[field].endsWith(searchNumber);
          	}
          }
        });
        return result;
      };
    }
    if(searchText === ""){
      this.offset = 0;
      this.sortOrder = this.defaultSortOrder;
      this._searchedData = [];
      this._updateListData();
    }
    else{
      this._updateListData("search");  
    }

  };

  //api to change filter and get the resultant data. Resets the pagination value always. Also has to reset in pagination component
  /*
   filterParam -  String filterParam on which data has to be compared
   filterValue - String user selected filterValue
  */

  CacheUtils.prototype.applyFilter = function(filterParam, filterValue){
    this.filterParam = filterParam;
    this.filterValue = filterValue;
    this._sortedData = [];
    this._searchedData = [];
    this.offset = 0;
    this.sortOrder = this.sortOrder || this.defaultSortOrder;
    var scope = this;
    if(filterValue === "All"){
      this.filterPredicate = function(){
        return true;
      };
    }
    else{
      this.filterPredicate = function(record){
        return record[scope.filterParam] === scope.filterValue;
      };
    }
    this._updateListData();
  };

  //api to sort based on params. Resets the pagination value always. Also has to reset in pagination component
  /*
   sortParam -  String sortParam on which data has to be sorted
   order - String specifies the order of sorting.
  */
  CacheUtils.prototype.applySorting = function (sortParam, order) {
    this.offset = 0;
    this.sortOrder = order;
    this.sortBy = sortParam;
    this._updateListData("sort");
  };

  return CacheUtils;
});