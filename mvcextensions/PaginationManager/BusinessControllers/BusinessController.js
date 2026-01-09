/**
*@module PaginationManager
 */
define([], function () {
/**
   * Pagination Manager consists of all possible methods to implement pagination logic
   *@alias module:PaginationManager
   *@class
   */
  function PaginationManager() {
    kony.mvc.Business.Controller.call(this);
    this.offset = 0;
    this.paginationRowLimit = applicationManager.getConfigurationManager().OLBConstants.PAGING_ROWS_LIMIT;
    this.limit = this.paginationRowLimit;
    this.sortConfig = {};
    this.navigation = "";
  }
  inheritsFrom(PaginationManager, kony.mvc.Business.Delegator);
  PaginationManager.prototype.initializeBusinessController = function() {
  };
/**
   * Function to get next set of records for pagination
   * @param {function} bindSuccess will be called when service call is successful
   * @param {function} bindError will be called when service call is failed
   * @param {function} serviceCallBack will be called to get the next set of records
   * @param {array} segmentData data which is already fetched
   * @param {integer} it is used to represent the headerIndex of the segmentData
   * @param {Object} set of all fields used to make the service call
   */
  PaginationManager.prototype.paging = function(bindSuccess, bindError, serviceCallback, segmentData, headerIndex, queryParams) {
    var startIndex = segmentData[headerIndex][1].length-1;
    var endIndex = startIndex + 25;
    if (queryParams) {
      queryParams.firstRecordNumber = startIndex;
      queryParams.lastRecordNumber = endIndex;
    }
    function pagingSuccess(response) {
      bindSuccess(response);
    }
    function pagingError(response) {
      bindError(response);
    }
    serviceCallback(queryParams, pagingSuccess, pagingError);
  };
  /**
     * Function to reset the pagination values.
     */
    PaginationManager.prototype.resetValues = function() {
        this.offset = 0;
        this.navigation = "";
        this.limit = this.paginationRowLimit;
    };
    /**
     * Function to get default page values.
     */
    PaginationManager.prototype.getDefaultPageValues = function() {
        this.offset = 0;
        this.navigation = "";
        return {
            "offset": 0,
            "limit": this.limit
        };
    };
    /**
     * Function to set the navigation forward to fetch the next page records.
     */
    PaginationManager.prototype.getNextPage = function() {
        this.navigation = "NAVIGATION_FORWARD";
    };
    /**
     * Function to set the navigation forward to fetch the previous page records.
     */
    PaginationManager.prototype.getPreviousPage = function() {
        this.navigation = "NAVIGATION_BACKWARD";
        this.limit = this.paginationRowLimit;
    };
    /**
     * Function to set the navigation to current page.
     */
    PaginationManager.prototype.getCurrentPage = function() {
        this.navigation = "";
    };
    /**
     * Function to get values for pagination.
     * @param {Object} - object containing the sort config values like sortby , orderby, defaultSortBy, defaultOrderBy, offset , limit.
     * @parma {object} -  object containing the sorting inputs like sortyby and oerderby.
     * @returns {Object} - object containing values - limit, offset, sortby, orderby, defaultsortby, defaultorderby.
     */
    PaginationManager.prototype.getValues = function(sortConfig,sortingInputs) {
        var paginationJSON = {};
        if (sortConfig) {
            this.sortConfig = sortConfig;
        }
        if (this.navigation === "") {
            paginationJSON = {
                "offset": this.offset,
                "limit": this.limit
            };
        } else if (this.navigation === "NAVIGATION_FORWARD") {
            paginationJSON = {
                "offset": this.offset + this.paginationRowLimit,
                "limit": this.limit
            };
        } else if (this.navigation === "NAVIGATION_BACKWARD") {
            if (this.offset > 0) {
                paginationJSON = {
                    "offset": this.offset - this.paginationRowLimit,
                    "limit": this.limit
                };
            } else {
                paginationJSON = {
                    "offset": 0,
                    "limit": this.limit
                };
            }
        }
        if(sortingInputs) paginationJSON.sortBy = sortingInputs.sortBy;
        paginationJSON = this.getSortConfigObject(paginationJSON,sortConfig);
        paginationJSON.paginationRowLimit = this.paginationRowLimit;
        return paginationJSON;
    };
    /**
     * Function to update the pagination values after a successful service call with valid data.
     */
    PaginationManager.prototype.updatePaginationValues = function() {
        if (this.navigation === "NAVIGATION_FORWARD") {
            this.offset = this.offset + this.paginationRowLimit;
        } else if (this.navigation === "NAVIGATION_BACKWARD") {
            if (this.offset > 0) {
                this.offset = this.offset - this.paginationRowLimit;
            } else {
                this.offset = 0;
            }
        }
        this.navigation = "";
    };
    /**
     * Sorting Configuration object.
     * @param {object} dataInputs - sorting inputs (offset, limit, sortBy, order)
     * @param {object} sortingConfigInputs - default page configuration (offset, limit, sortBy, order, defaultSortBy, defaultOrder)
     * @returns {object} - sorting configuration object (offset, limit, sortBy, order)
     */
   PaginationManager.prototype.getSortConfigObject = function(dataInputs, sortingConfigInputs) {
        dataInputs = dataInputs || {};
        configurationManager = applicationManager.getConfigurationManager();
        if (sortingConfigInputs === null || typeof sortingConfigInputs !== "object") {
            return dataInputs;
        }
        var sortObj = {};
        if (dataInputs.resetSorting) {
            sortObj.offset = configurationManager.OLBConstants.DEFAULT_OFFSET;
            sortObj.limit = configurationManager.OLBConstants.PAGING_ROWS_LIMIT;
            sortObj.sortBy = sortingConfigInputs.defaultSortBy;
            sortObj.order = sortingConfigInputs.defaultOrder;
        } else {
            if (typeof dataInputs.offset === "number") {
                sortObj.offset = dataInputs.offset;
            } else {
                if (typeof sortingConfigInputs.offset === "number") {
                    sortObj.offset = sortingConfigInputs.offset;
                } else {
                    sortObj.offset = configurationManager.OLBConstants.DEFAULT_OFFSET;
                }
            }
            if (typeof dataInputs.limit === "number") {
                sortObj.limit = dataInputs.limit;
            } else {
                if (typeof sortingConfigInputs.limit === "number") {
                    sortObj.limit = sortingConfigInputs.limit;
                } else {
                    sortObj.limit = configurationManager.OLBConstants.PAGING_ROWS_LIMIT;
                }
            }
            sortObj.sortBy = dataInputs.sortBy || sortingConfigInputs.sortBy || sortingConfigInputs.defaultSortBy;
            sortObj.order = dataInputs.order || sortingConfigInputs.order || sortingConfigInputs.defaultOrder;
            if (dataInputs.sortBy && !dataInputs.order) {
                if (dataInputs.sortBy === sortingConfigInputs.sortBy) {
                    sortObj.order = sortingConfigInputs.order === configurationManager.OLBConstants.ASCENDING_KEY ? configurationManager.OLBConstants.DESCENDING_KEY : configurationManager.OLBConstants.ASCENDING_KEY;
                } else {
                    sortObj.order = configurationManager.OLBConstants.ASCENDING_KEY;
                }
            }
        }
        // re-assign to sortConfig Object to persist.
        sortingConfigInputs.sortBy = sortObj.sortBy;
        sortingConfigInputs.order = sortObj.order;
        sortingConfigInputs.limit = sortObj.limit;
        sortingConfigInputs.offset = sortObj.offset;
        return sortObj;
    };
    /**
     * Function to reset the T24 pagination values.
     */
    PaginationManager.prototype.resetT24PaginationValues = function () {
        this.offset = 1;
        this.navigation = "";
        this.limit = this.paginationRowLimit;
    };
    /**
     * Function to get values for T24 pagination.
     * @param {Object} - object containing the sort config values like sortby , orderby, defaultSortBy, defaultOrderBy, offset , limit.
     * @parma {object} -  object containing the sorting inputs like sortyby and oerderby.
     * @returns {Object} - object containing values - limit, offset, sortby, orderby, defaultsortby, defaultorderby.
     */
    PaginationManager.prototype.getT24PaginationValues = function (sortConfig, sortingInputs) {
        var paginationJSON = {};
        if (sortConfig) {
            this.sortConfig = sortConfig;
        }
        if (this.navigation === "") {
            paginationJSON = {
                "offset": this.offset,
                "limit": this.limit
            };
        } else if (this.navigation === "NAVIGATION_FORWARD") {
            paginationJSON = {
                "offset": this.offset + 1,
                "limit": this.limit
            };
        } else if (this.navigation === "NAVIGATION_BACKWARD") {
            if (this.offset > 1) {
                paginationJSON = {
                    "offset": this.offset - 1,
                    "limit": this.limit
                };
            } else {
                paginationJSON = {
                    "offset": 1,
                    "limit": this.limit
                };
            }
        }
        if (sortingInputs) paginationJSON.sortBy = sortingInputs.sortBy;
        paginationJSON = this.getT24SortConfigObject(paginationJSON, sortConfig);
        paginationJSON.paginationRowLimit = this.paginationRowLimit;
        return paginationJSON;
    };
    /**
     * Function to update the T24 pagination values after a successful service call with valid data.
     */
    PaginationManager.prototype.updateT24PaginationValues = function () {
        if (this.navigation === "NAVIGATION_FORWARD") {
            this.offset = this.offset + 1;
        } else if (this.navigation === "NAVIGATION_BACKWARD") {
            if (this.offset > 1) {
                this.offset = this.offset - 1;
            } else {
                this.offset = 1;
            }
        }
        this.navigation = "";
    };
    /**
     * Sorting Configuration object.
     * @param {object} dataInputs - sorting inputs (offset, limit, sortBy, order)
     * @param {object} sortingConfigInputs - default page configuration (offset, limit, sortBy, order, defaultSortBy, defaultOrder)
     * @returns {object} - sorting configuration object (offset, limit, sortBy, order)
     */
    PaginationManager.prototype.getT24SortConfigObject = function (dataInputs, sortingConfigInputs) {
        dataInputs = dataInputs || {};
        configurationManager = applicationManager.getConfigurationManager();
        if (sortingConfigInputs === null || typeof sortingConfigInputs !== "object") {
            return dataInputs;
        }
        var sortObj = {};
        if (dataInputs.resetSorting) {
            sortObj.offset = configurationManager.OLBConstants.DEFAULT_T24_OFFSET;
            sortObj.limit = configurationManager.OLBConstants.PAGING_ROWS_LIMIT;
            sortObj.sortBy = sortingConfigInputs.defaultSortBy;
            sortObj.order = sortingConfigInputs.defaultOrder;
        } else {
            if (typeof dataInputs.offset === "number") {
                sortObj.offset = dataInputs.offset;
            } else {
                if (typeof sortingConfigInputs.offset === "number") {
                    sortObj.offset = sortingConfigInputs.offset;
                } else {
                    sortObj.offset = configurationManager.OLBConstants.DEFAULT_T24_OFFSET;
                }
            }
            if (typeof dataInputs.limit === "number") {
                sortObj.limit = dataInputs.limit;
            } else {
                if (typeof sortingConfigInputs.limit === "number") {
                    sortObj.limit = sortingConfigInputs.limit;
                } else {
                    sortObj.limit = configurationManager.OLBConstants.PAGING_ROWS_LIMIT;
                }
            }
            sortObj.sortBy = dataInputs.sortBy || sortingConfigInputs.sortBy || sortingConfigInputs.defaultSortBy;
            sortObj.order = dataInputs.order || sortingConfigInputs.order || sortingConfigInputs.defaultOrder;
            if (dataInputs.sortBy && !dataInputs.order) {
                if (dataInputs.sortBy === sortingConfigInputs.sortBy) {
                    sortObj.order = sortingConfigInputs.order === configurationManager.OLBConstants.ASCENDING_KEY ? configurationManager.OLBConstants.DESCENDING_KEY : configurationManager.OLBConstants.ASCENDING_KEY;
                } else {
                    sortObj.order = configurationManager.OLBConstants.ASCENDING_KEY;
                }
            }
        }
        // re-assign to sortConfig Object to persist.
        sortingConfigInputs.sortBy = sortObj.sortBy;
        sortingConfigInputs.order = sortObj.order;
        sortingConfigInputs.limit = sortObj.limit;
        sortingConfigInputs.offset = sortObj.offset;
        return sortObj;
    };
  return PaginationManager;
});