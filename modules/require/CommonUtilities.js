define(['ErrHandler', 'OLBConstants'], function(ErrHandler, OLBConstants) {
        var touchEndList = [];

        var isThinClient = function() {
            return kony.os.deviceInfo().name === "thinclient";
        };
        /**
         * getAccountDisplayName - Returns a combination of account name and account number for displaying.
         * @member of {CommonUtilities}
         * @param {object} account - Account object.
         * @returns {String} Account name concatenated with account number
         * @throws {}
         */
        var _getAccountDisplayName = function(account) {
            if (isThinClient() && account.Id !== undefined)
                return _getAccountName(account) + " ...." + _getLastFourDigit(account.accountNumber);
            if (account.accountID === undefined || account.Account_id === undefined)
                return _getAccountName(account) + " ...." + _getLastFourDigit(account.PayPersonId);
            return _getAccountName(account) + " ...." + _getLastFourDigit(account.accountID || account.Account_id);
        };

        var _getAccountDisplayNameNew = function(account) {
            return isThinClient() ? _getAccountName(account) + " - X" + _getLastFourDigit(account.accountID || account.Account_id) : _getAccountName(account) + "-X" + _getLastFourDigit(account.accountID || account.Account_id);
        };
        var _getAccountDisplayNameWithBalance = function(account) {
            return _getAccountDisplayName(account) + " " + _getDisplayBalance(account);
        };

        /**
         * getFullName - Returns the Fullname
         * @member of {CommonUtilities}
         * @param {String} Firstname - Firstname
         * @param {String} Middlename - Middlename
         * @param {String} Lastname - Lastname
         * @returns {String} Fullname
         * @throws {}
         */
        var _getFullName = function(Firstname, Middlename, Lastname) {
            if (Middlename !== undefined && Middlename !== "" && Middlename !== null)
                return Firstname + " " + Middlename + " " + Lastname;
            return Firstname + " " + Lastname;
        };

        /**
         * getAccountName - Returns the account nick name for an account. If nickname doesn't exist, returns account name.
         * @member of {CommonUtilities}
         * @param {object} account - Account object.
         * @returns {String} Account nickname/name 
         * @throws {}
         */
        var _getAccountName = function(account) {
            if (account.nickName && account.nickName.length > 0) {
                return account.nickName;
            } else if (account.name && account.name.length > 0) {
                return account.name;
            } else {
                return account.accountName;
            }
        };
        /**
         * __mergeAccountNameNumber - when we do not have access to account object but we want to concatenate account name with account number
         * @member of {CommonUtilities}
         * @param {string, integer} account name and account number
         * @returns {String} - concatenated string
         * @throws {}
         */
        var _mergeAccountNameNumber = function(accountName, accountNumber) {
            if (typeof(accountNumber) == "number") {
                accountNumber = accountNumber.toString();
            }
            accountNumber = accountNumber.substr(-4);
            return accountName + " ...." + accountNumber;
        };

        /**
         * getDisplayBalance - Returns account balance string.
         * @member of {CommonUtilities}  
         * @param {object} account - account object.
         * @returns {String} Available balance string.
         * @throws {}
         */
        var _getDisplayBalance = function(account) {
            return "(" + _formatCurrencyWithCommas(account.availableBalance, false, account.currencyCode) + ")";
        };

        /**
         * getLastFourDigit - Returns last four characters of a given string.
         * @member of {CommonUtilities}
         * @param {String} numberStr - String whose last four digits should be returned.
         * @returns {String} last four characters of the given string
         * @throws {}
         */
        var _getLastFourDigit = function(numberStr) {
            if (numberStr) {
                if (numberStr.length < 4) return numberStr;
                return numberStr.slice(-4);
            }
        };

        /**
         * getLastSixDigit - Returns last four characters of a given string.
         * @member of {CommonUtilities}
         * @param {String} numberStr - String whose last four digits should be returned.
         * @returns {String} last four characters of the given string
         * @throws {}
         */
        var _getLastSixDigit = function(numberStr) {
            if (numberStr) {
                if (numberStr.length < 6) return numberStr;
                return numberStr.slice(-6);
            }
        };

        /**
         * Method to get Account Number in format XXXXXXXXXX1234
         * @param {Number} accountNumber Account Number
         * @returns masked account Number in form XXXXXXXXXXX1234
         */
        var _getMaskedAccountNumber = function(accountNumber) {
            var stringAccNum = '' + accountNumber;
            var isLast4Digits = function(index) {
                return index > (stringAccNum.length - 5);
            };
            return stringAccNum.split('').map(function(c, i) {
                return isLast4Digits(i) ? c : 'X';
            }).join('');
        };

        /*** 
          @description: function to get accounts masked in the form "Account Name - X1234"
          @parameter: accountName name of the account
          @parammeter: accountNumber account number
         ***/
        var _getMaskedAccount = function(accountName, accountNumber) {
            var maskedAccountNumber = "";
            if (kony.sdk.isNullOrUndefined(accountName)) {
                accountName = "";
            } else {
                accountName = accountName.trim();
            }
            if (kony.sdk.isNullOrUndefined(accountNumber)) {
                accountNumber = "";
            } else {
                accountNumber = accountNumber.trim();
                accountNumber = (accountNumber.length < 4) ? accountNumber : accountNumber.slice(-4);
                accountNumber = (accountNumber.length > 0) ? ("X" + accountNumber) : "";
            }

            if (accountName.length > 0 && accountNumber.length > 0) {
                return accountName + " - " + accountNumber;
            } else if (accountName.length > 0 && accountNumber.length === 0) {
                return accountName;
            } else if (accountName.length === 0 && accountNumber.length > 0) {
                return accountNumber;
            } else {
                return "";
            }
        };

        /**
         * Downloads file from a given url.
         * @member of {CommonUtilities}
         * @param {object} data - object containing url and filename.
         * @returns {}
         * @throws {String} - Error message
         */
        var _downloadFile = function(data) {
            if (data) {
                if (data.url) {
                    var element = document.createElement('a');
                    element.setAttribute('href', data.url);
                    element.setAttribute('download', data.filename || 'download');
                    element.setAttribute('target', '_blank');
                    element.style.display = 'none';
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                } else {
                    return "Url is Invalid : " + data.url;
                }
            }
        };

        /**
         * _validateCurrency - Returns true if amount is a valid,else returns false
         * @member of {CommonUtilities}
         * @param {String} amount - Amount.
         * @returns {boolean} 
         * @throws {}
         */
        var _validateCurrency = function(amount) {
            if (amount) {
                amount = amount + "";
                var regularexp = /^\$?[0-9][0-9\,]*(\.\d*)?$|^\$?[\.]([\d][\d]?)$/;
                if (amount.match(regularexp))
                    return true;
            }
            return false;
        };

        /**
         * _addZeroesToAmount- Adds decimals to given amount string. (Do not access this method outside CommonUtilities)
         * @member of {CommonUtilities}
         * @param {String} amount - Amount.
         * @returns {String} Amount string with decimals
         * @throws {}
         */
        var _addZeroesToAmount = function(amount) {
            amount = amount + "";
            if (amount.indexOf(".") >= 0 && (amount.length - amount.indexOf(".") > 2)) {
                amount = amount.slice(0, (amount.indexOf(".")) + 3);
                amount = Number(amount);
                amount = amount.toFixed(2);
                amount = amount + "";
            } else {
                var value = Number(amount);
                value = value.toFixed(2);
                amount = value.toString();
            }
            return amount;
        };

        /**
         * _addCommasToAmountString - Adds commas after every 3 digits to given amount string. This method should be modified based on the region. A comma after 3 digits is the standard for USA. (Do not access this method outside CommonUtilities)
         * @member of {CommonUtilities}
         * @param {String} amount - Amount.
         * @returns {String} Amount string with commas. 
         * @throws {}
         */
        var _addCommasToAmountString = function(str) {
            var parts = str.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return parts.join(".");
        };

        /**
         * _formatCurrencyWithCommas - Returns formatted amount string. Adds commas and currency symbol to a given amount string.
         * @member of {CommonUtilities}
         * @param {String} amount - Amount.
         * @param {boolean} currenySymbolNotRequired - Flag to determine whether currency symbol should be appended.
         * @returns {String} Formatted amount string
         * @throws {}
         */
        var _formatCurrencyWithCommas = function(amount, currencySymbolNotRequired, currencySymbolCode) {
            var formatManager = applicationManager.getFormatUtilManager();
            if (isThinClient() && (typeof amount == "string") && (amount.indexOf("E") != -1)) {
                amount = Number(amount).toPrecision().toString()
            }
            amount = formatManager.deFormatAmount(amount);
            if (currencySymbolNotRequired) {
                return formatManager.formatAmount(amount);
            } else if (currencySymbolCode) {
                return formatManager.formatAmountandAppendCurrencySymbol(amount, currencySymbolCode);
            } else {
                return formatManager.formatAmountandAppendCurrencySymbol(amount);
            }
        };

        var _getDisplayCurrencyFormat = function(amount) {
            amount = this.formatCurrencyWithCommas(amount);
            if (amount) {
                if (amount.match(/-/)) {
                    amount = "-" + amount.replace(/-/, "");
                }
            }
            return amount;
        };

        /**
         * Sorting Configuration object.
         * @member of {CommonUtilities}
         * @param {object} dataInputs - sorting inputs (offset, limit, sortBy, order)
         * @param {object} sortingConfigInputs - default page configuration (offset, limit, sortBy, order, defaultSortBy, defaultOrder) 
         * @returns {object} - sorting configuration object (offset, limit, sortBy, order)
         * @throws {}
         */
        var _getSortConfigObject = function(dataInputs, sortingConfigInputs) {

            try {

                dataInputs = dataInputs || {};

                if (sortingConfigInputs === null || typeof sortingConfigInputs !== "object") {
                    ErrHandler.onError('Invalid Inputs');
                    return;
                }

                var sortObj = {};

                if (dataInputs.resetSorting) {
                    sortObj.offset = OLBConstants.DEFAULT_OFFSET;
                    sortObj.limit = OLBConstants.PAGING_ROWS_LIMIT;
                    sortObj.sortBy = sortingConfigInputs.defaultSortBy;
                    sortObj.order = sortingConfigInputs.defaultOrder;
                } else {
                    if (typeof dataInputs.offset === "number") {
                        sortObj.offset = dataInputs.offset;
                    } else {
                        if (typeof sortingConfigInputs.offset === "number") {
                            sortObj.offset = sortingConfigInputs.offset;
                        } else {
                            sortObj.offset = OLBConstants.DEFAULT_OFFSET;
                        }
                    }
                    if (typeof dataInputs.limit === "number") {
                        sortObj.limit = dataInputs.limit;
                    } else {
                        if (typeof sortingConfigInputs.limit === "number") {
                            sortObj.limit = sortingConfigInputs.limit;
                        } else {
                            sortObj.limit = OLBConstants.PAGING_ROWS_LIMIT;
                        }
                    }
                    sortObj.sortBy = dataInputs.sortBy || sortingConfigInputs.sortBy || sortingConfigInputs.defaultSortBy;
                    sortObj.order = dataInputs.order || sortingConfigInputs.order || sortingConfigInputs.defaultOrder;

                    if (dataInputs.sortBy && !dataInputs.order) {
                        if (dataInputs.sortBy === sortingConfigInputs.sortBy) {
                            sortObj.order = sortingConfigInputs.order === OLBConstants.ASCENDING_KEY ? OLBConstants.DESCENDING_KEY : OLBConstants.ASCENDING_KEY;
                        } else {
                            sortObj.order = OLBConstants.ASCENDING_KEY;
                        }
                    }
                }
                // re-assign to sortConfig Object to persist.
                sortingConfigInputs.sortBy = sortObj.sortBy;
                sortingConfigInputs.order = sortObj.order;
                sortingConfigInputs.limit = sortObj.limit;
                sortingConfigInputs.offset = sortObj.offset;

                return sortObj;

            } catch (exception) {
                ErrHandler.onError(exception);
            }

        };

        /**
          This method will validate the search string and returns the pattern that is matching with regex
          **/
        var _validateSearchString = function(searchString) {
            if (kony.sdk.isNullOrUndefined(searchString))
                return "";
            return searchString.replace(/[&\/\\#,+()$~%.'":*?<>{}@`^\-]/g, '');
        };

        /**
         * Update Sort Flex - Method to update sorting icons in headers with given sortMap.
         * @member of {CommonUtilities}
         * @param {object} sortMap - sorting map (name, imageFlx, clickContainer)  
         * @param {object} viewModel - target column and order(asc/desc).
         * @returns {}
         * @throws {}
         */
        var _updateSortFlex = function(sortMap, viewModel) {
            var sortFlex = "";
            viewModel = viewModel || {};
            if (sortMap && sortMap.length && viewModel) {
                sortMap.forEach(function(item) {
                    if (viewModel.sortBy === item.name) {
                        sortFlex = item.clickContainer;
                        item.imageFlx.src = viewModel.order === OLBConstants.DESCENDING_KEY ? OLBConstants.IMAGES.SORTING_NEXT : OLBConstants.IMAGES.SORTING_PREVIOUS;
                    } else {
                        item.imageFlx.src = OLBConstants.IMAGES.SORTING;
                    }
                });
            }

            if(sortFlex !== "" && sortFlex !== undefined){
                setTimeout(function () {sortFlex.setActive(true);}, 200);
            }            
        };

        /**
         * _setSortingHandlers - Method to attach sort Handlers
         * @member of {CommonUtilities}
         * @param {object} sortMap - sorting map (name, imageFlx, clickContainer)
         * @param {function} clickHandler - on sort click handler
         * @param {object} scope - click handler scope.
         * @returns {}
         * @throws {}
         */
        var _setSortingHandlers = function(sortMap, clickHandler, scope) {
            var scopeObj = this;
            sortMap.map(function(_item) {
                _item.clickContainer.onClick = clickHandler.bind(scope || scopeObj, _item.clickContainer, {
                    'sortBy': _item.name,
                    'offset': OLBConstants.DEFAULT_OFFSET
                });
            });
        };

        /**
         * Get Configuration key value.
         * @member of {CommonUtilities}
         * @param {String} key - configuration key available in Configuration object.
         * @returns {String} Whatever value is associated with the given key.
         * @throws {}
         */
        var _getConfiguration = function(key) {
            if (!key) {
                ErrHandler.onError('Invalid Configuraion Key.');
                return null;
            }
            return kony.onlineBanking.configurations.getConfiguration(key);
        };

        /**
         * Display loading indicator.
         * @member of {CommonUtilities}
         * @param {object} view : view object of the form .
         * @returns {}
         * @throws {}
         */
        var _showProgressBar = function(view) {
            kony.olb.utils.showProgressBar(view);
        };

        /**
         * Hide loading indicator.
         * @member of {CommonUtilities}
         * @param {object} view : view object of the form. 
         * @returns {}
         * @throws {}
         */
        var _hideProgressBar = function(view) {
            kony.olb.utils.hideProgressBar(view);
        };

        /**
         * _getFrontendDateString - Formats a given date string into a given date format.
         * @member of {CommonUtilities}
         * @param {String} dateString - The date string to be formatted.
         * @param {String} dateFormat - Format into which the given date string should be converted.
         * @returns {String} Formatted date string.
         * @throws {}
         */
        var _getFrontendDateString = function(dateString, dateFormat) {
            var formatUtilManager = applicationManager.getFormatUtilManager();
            var dateObj = formatUtilManager.getDateObjectfromString(dateString, "YYYY-MM-DD");
            return formatUtilManager.getFormatedDateString(dateObj, formatUtilManager.getApplicationDateFormat());
        };

        var _getFrontendDateStringInUTC = function(dateString, dateFormat) {
            if (kony.sdk.isNullOrUndefined(dateString) || dateString == "")
                return "";

            var formatUtilManager = applicationManager.getFormatUtilManager();
            var dateObj = formatUtilManager.getDateObjectfromString(dateString, "YYYY-MM-DD");
            dateObj.setYear(dateObj.getUTCFullYear());
            dateObj.setMonth(dateObj.getUTCMonth());
            dateObj.setDate(dateObj.getUTCDate());
            dateObj.setHours(dateObj.getUTCHours());
            dateObj.setMinutes(dateObj.getUTCMinutes());
            dateObj.setSeconds(dateObj.getUTCSeconds());
            return formatUtilManager.getFormatedDateString(dateObj, formatUtilManager.getApplicationDateFormat());
        };

        /**
         * _getBackendDateFormat - Formats a given date string into a given date format.
         * @member of {CommonUtilities}
         * @param {String} dateString - The date string to be formatted.
         * @param {String} dateFormat - Format into which the given date string should be converted.
         * @returns {String} - Formatted date string
         * @throws {}
         */
        var _getBackendDateFormat = function(dateString, dateFormat) {
            if (!dateFormat || !dateString)
                return;
            var date = dateString.split('/');
            if (dateFormat === 'dd/mm/yyyy')
                return date[2] + '-' + date[1] + '-' + date[0];
            else if (dateFormat === 'mm/dd/yyyy')
                return date[2] + '-' + date[0] + '-' + date[1];
            else if (dateFormat === 'yyyy/mm/dd')
                return date[0] + '-' + date[1] + '-' + date[2];
            else if (dateFormat === 'yyyy/dd/mm')
                return date[0] + '-' + date[2] + '-' + date[1];
        };

        var _getServerDate = function(date) {
            var config = applicationManager.getConfigurationManager();
            var offset = config.getOffset();
            var hours = offset ? offset[0] : 0;
            var minutes = offset ? offset[1] : 0;
            var dateUTC;
            if (date) dateUTC = new Date(date);
            else dateUTC = new Date(serverDate());

            var dateIST = new Date(dateUTC);
            dateIST.setUTCHours(dateIST.getUTCHours() + hours);
            dateIST.setUTCMinutes(dateIST.getUTCMinutes() + minutes);
            return dateIST.toUTCString();
        };

        var _getServerDateComponent = function(date) {
            var dateObj = _getServerDate(date);
            dateObj = new Date(dateObj);
            return [dateObj.getUTCDate(), dateObj.getUTCMonth() + 1, dateObj.getUTCFullYear(), dateObj.getUTCHours(), dateObj.getUTCMinutes(), dateObj.getUTCSeconds()];
        };

        var _getServerDateObject = function() {
            var dateObj = new Date(_getServerDate());
            var srvDateObj = dateObj;
            srvDateObj.setYear(dateObj.getUTCFullYear());
            srvDateObj.setMonth(dateObj.getUTCMonth());
            srvDateObj.setDate(dateObj.getUTCDate());
            srvDateObj.setHours(dateObj.getUTCHours());
            srvDateObj.setMinutes(dateObj.getUTCMinutes());
            srvDateObj.setSeconds(dateObj.getUTCSeconds());

            return srvDateObj;
        };

        var serverDate = function() {

            var srh = applicationManager.getServiceResponseHandler();
            var serverdate = srh.getServerDate();
            if (kony.sdk.isNullOrUndefined(serverdate) || serverdate == "") {
                serverdate = Date.now();
            }

            return serverdate;

        };

        /**
         * _disableOldDaySelection - Disables the selection of past dates and sets the date range for a given calendar widget.
         * @member of {CommonUtilities}
         * @param {String} widgetId - ID of the calendar widget.
         * @param {String} backendDate - If a date is passed, the calendar widget's selection will be enabled from this date.
         * @returns {}
         * @throws {}  
         */
        var _disableOldDaySelection = function(widgetId, numberOfdays) {
            var dateFormat = applicationManager.getFormatUtilManager().getDateFormat();
            var numberOfYearsAllowed = OLBConstants.CALENDAR_ALLOWED_FUTURE_YEARS;
            var futureDate = new Date(Date.now() + (1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 24 /*day*/ * 365 /*days*/ * numberOfYearsAllowed));
            if (numberOfdays) {
                var today = new Date(Date.now() + (1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 24 /*day*/ * numberOfdays));
                widgetId.enableRangeOfDates([today.getDate(), today.getMonth() + 1, today.getFullYear()], [futureDate.getDate(), futureDate.getMonth() + 1, futureDate.getFullYear()], "skn", true);
                widgetId.dateComponents = [today.getDate(), today.getMonth() + 1, today.getFullYear()];
            } else {
                var today = isThinClient() ? _getServerDateObject() : new Date();
                widgetId.enableRangeOfDates([today.getDate(), today.getMonth() + 1, today.getFullYear()], [futureDate.getDate(), futureDate.getMonth() + 1, futureDate.getFullYear()], "skn", true);
                widgetId.dateComponents = [today.getDate(), today.getMonth() + 1, today.getFullYear()];
            }
        };

        /**
         * _sendDateToBackend - Converts a given date string from frontend format to backend format.
         * @member of {CommonUtilities}
         * @param {String} dateString - The date string which should be formatted.
         * @param {String} frontendDateFormat - Front end date format.
         * @param {String} backendDateFormat - Backend date format.
         * @returns {String} Formatted date string
         * @throws {}
         */
        var _sendDateToBackend = function(dateString, frontendDateFormat, backendDateFormat) {
            if (dateString) {
                var dateObj = applicationManager.getFormatUtilManager().getDateObjectFromCalendarString(dateString, applicationManager.getFormatUtilManager().getDateFormat().toUpperCase());
                var dateString = applicationManager.getFormatUtilManager().getFormatedDateString(dateObj, applicationManager.getFormatUtilManager().getBackendDateFormat());
                return dateString;
            }
            return "";
        };

        /**
         * _changedataCase - Changes the case of the first letter of each word in the string to uppercase and returns it.
         * @member of {CommonUtilities}
         * @param {String} str - String whose case should be changed.
         * @returns {String} - The given string with each word's first character changed to uppercase
         * @throws {}
         */
        var _changedataCase = function(str) {
            if (str) {
                return str.replace(/\w\S*/g, function(word) {
                    return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
                });
            }
        };


        /**
         * _getDateAndTime - Formats a given date string into a given date format (including hour and minute fields.)
         * @member of {CommonUtilities}
         * @param {(String|object)} dateString - a date object or as a string in at least "YYYY-MM-DDTHH:mm:ssZ" format.
         * @returns {String} - Formatted date string including hours and minutes.
         * @throws {}
         */
        var _getDateAndTime = function(dateString) {
            if (dateString === "" || dateString === undefined || dateString === null) {
                kony.print("Error: please send a valid dateString to getDateAndTime API of CommonUtilities");
                return "";
            }
            if (typeof(dateString) === "object") {
                dateString = dateString.toISOString();
            }
            var formatUtilManager = applicationManager.getFormatUtilManager();
            dateString = dateString.replace("T"," ").split("Z")[0];
            var dateObj = formatUtilManager.getLocalizedDateFromDatabaseTS(dateString);
            var formatedDateString = dateObj.format(formatUtilManager.getApplicationDateTimeFormat());
            return formatedDateString;
        };
        var _getDateAndTimeDST = function(dateString, type){
            var formatUtilManager = applicationManager.getFormatUtilManager();
            var dateObj;
            if(type === undefined || type === 1){// if datetime is server timezone value
              dateString = dateString.replace("T"," ").split("Z")[0];
              dateObj = formatUtilManager.getLocalizedDateFromDatabaseTS(dateString);
            } else if(type ===2){ // if datetime is a UTC value
               dateObj = formatUtilManager.getLocalizedDateFromDatabaseUTCTS(dateString);
            }
          var formatedDateString = dateObj.format(formatUtilManager.getApplicationDateTimeFormat());
          return formatedDateString;
        };

        /**
         * This methods is used to formats a ISO date string or a date object to local time with daylight savings
         * @member of {CommonUtilities}
         * @param {(string|object)} dateString - a date object or as a string in at least "YYYY-MM-DDTHH:mm:ssZ" format
         * @returns {string} - date formatted in local timezone with Daylight savings or an empty string if no datestring is sent as a param
         */
        var _getDateAndTimeInUTC = function(dateString) {
            if (dateString === "" || dateString === undefined || dateString === null) {
                kony.print("Error: please send a valid dateString to getDateAndTimeInUTC API of CommonUtilities");
                return "";
            }
            if (typeof(dateString) === "object") {
                dateString = dateString.toISOString();
            }
            var formatUtilManager = applicationManager.getFormatUtilManager();
            var dateObj = formatUtilManager.getLocalizedDateFromDatabaseUTCTS(dateString);
            var formatedDateString = dateObj.format(formatUtilManager.getApplicationDateTimeFormat());
            return formatedDateString;
        };


        /**
         * _toggleCheckbox - Toggle The check box state on a image widget. Assuming the image widget passed is being used as checkbox.
         * @member of {CommonUtilities}
         * @param {object} imageWidget - The image widget of the check box which should be toggled. 
         * @returns {}
         * @throws {}
         */
        var _toggleCheckbox = function(imageWidget) {
            imageWidget.src = imageWidget.src === OLBConstants.IMAGES.CHECKED_IMAGE ? OLBConstants.IMAGES.UNCHECKED_IMAGE : OLBConstants.IMAGES.CHECKED_IMAGE;
        };
        var _toggleFontCheckbox = function(imageWidget) {
            imageWidget.text = imageWidget.text === OLBConstants.FONT_ICONS.CHECBOX_SELECTED ? OLBConstants.FONT_ICONS.CHECBOX_UNSELECTED : OLBConstants.FONT_ICONS.CHECBOX_SELECTED;
            imageWidget.skin = imageWidget.skin === OLBConstants.SKINS.CHECKBOX_SELECTED_SKIN ? OLBConstants.SKINS.CHECKBOX_UNSELECTED_SKIN : OLBConstants.SKINS.CHECKBOX_SELECTED_SKIN;
        };
        /**
         * _isChecked - Returns the state of Checkbox (Image Widget)
         * @member of {CommonUtilities}
         * @param {object} imageWidget - The image widget of the check box of which state is needed. 
         * @returns {boolean} - returns true if checkbox is checked and false if checkbox is not checked
         * @throws {}
         */

        var _isChecked = function(imageWidget) {
            return imageWidget.src === OLBConstants.IMAGES.CHECKED_IMAGE;
        };
        var _isFontIconChecked = function(imageWidget) {
            return imageWidget.text === OLBConstants.FONT_ICONS.CHECBOX_SELECTED;
        };
        /**
         * _setCheckboxState - Sets the state of Checkbox (Image Widget)
         * @member of {CommonUtilities}
         * @param {boolean} state - The state of checkbox which needs to be set.
         * @returns {void} - None
         * @throws {}
         */

        var _setCheckboxState = function(state, imageWidget) {
            if (state) {
                imageWidget.src = OLBConstants.IMAGES.CHECKED_IMAGE;
            } else {
                imageWidget.src = OLBConstants.IMAGES.UNCHECKED_IMAGE;
            }
        };
        /**
         * _setCheckboxState - Sets the state of Checkbox (label Widget)
         * @member of {CommonUtilities}
         * @param {boolean} state - The state of checkbox which needs to be set.
         * @returns {void} - None
         * @throws {}
         */

        var _setLblCheckboxState = function(state, labelWidget) {
            if (state) {
                labelWidget.text = OLBConstants.FONT_ICONS.CHECBOX_SELECTED;
                labelWidget.skin = OLBConstants.SKINS.CHECKBOX_SELECTED_SKIN;
            } else {
                labelWidget.text = OLBConstants.FONT_ICONS.CHECBOX_UNSELECTED;
                labelWidget.skin = OLBConstants.SKINS.CHECKBOX_UNSELECTED_SKIN;
            }
        };


        /**
         * Method to update App Level configuration key
         * @param {String} key to be updated
         * @param {String} value of the key
         * @returns {}
         * @throws {}
         */
        var _updateAppLevelConfiguration = function(key, value) {
            if (key) {
                return kony.onlineBanking.configurations.updateAppLevelConfigurationKey(key, value);
            } else {
                ErrHandler.onError("Invalid Key");
                return null;
            }
        };

        /**
         * Method to update User Level configuration key
         * @param {String} key to be updated
         * @param {String} value of the key
         * @returns {}
         * @throws {}
         */
        var _updateUserLevelConfiguration = function(key, value) {
            if (key) {
                return kony.onlineBanking.configurations.updateUserLevelConfigurationKey(key, value);
            } else {
                ErrHandler.onError("Invalid Key");
                return null;
            }
        };

        /**
         *Method to get Months
         *key:get Months with reange of key.
         *value:value of the key
         */

        var _returnMonths = function(monthId) {
            var months = {
                1: "January",
                2: "February",
                3: "March",
                4: "April",
                5: "May",
                6: "June",
                7: "July",
                8: "August",
                9: "September",
                10: "October",
                11: "November",
                12: "December"
            };
            if (monthId !== undefined) {
                var pastMonths = {};
                while (monthId !== 0) {
                    pastMonths[monthId] = months[monthId];
                    monthId--;
                }
                return pastMonths;
            } else {
                return months;
            }
        };

        /**
         *Method to determine if the app is logged in CSR mode
         *@params: None
         *@return:true if it is logged in CSR mode else returns false
         *@throw:{}
         */
        var _isCSRMode = function() {
            return kony.mvc.MDAApplication.getSharedInstance().appContext.isCSR_Assist_Mode;
        };

        var _isSSOEnabled = function() {
            return kony.mvc.MDAApplication.getSharedInstance().appContext._isSSOEnabled;
        };

        /**
         * _isRadioBtnSelected - Returns the state of Radio (Image Widget)
         * @member of {CommonUtilities}
         * @param {object} imageWidget - The image widget of the check box of which state is needed. 
         * @returns {boolean} - returns true if checkbox is checked and false if checkbox is not checked
         * @throws {}
         */

        var _isRadioBtnSelected = function(imageWidget) {
            return imageWidget.src === OLBConstants.IMAGES.RADIOBTN_ACTIVE_SMALL;
        };

        /**
         * disableButton : Method to disable button status
         * @member of {frmStopPaymentsController}
         * @param {object} button, widget button object 
         * @return {}
         * @throws {} 
         */
        var _disableButton = function(button) {
            button.setEnabled(false);
            button.skin = "sknBtnBlockedSSPFFFFFF15Px";
            button.hoverSkin = "sknBtnBlockedSSPFFFFFF15Px";
            button.focusSkin = "sknBtnBlockedSSPFFFFFF15Px";
        };

        /**
         * enableButton : Method to enable button status
         * @member of {frmStopPaymentsController}
         * @param {object} button, widget button object
         * @return {}
         * @throws {} 
         */
        var _enableButton = function(button) {
            button.setEnabled(true);
            button.skin = "sknBtnNormalSSPFFFFFF15Px";
            button.hoverSkin = "sknBtnNormalSSPFFFFFFHover15Px";
            button.focusSkin = "sknBtnNormalSSPFFFFFF15PxFocus";
        };

        /**
         * showServerDownScreen : Method to show the common Server down page
         * @member of {CommonUtilities}
         * @param {} - NONE
         * @return {VOID}
         * @throws {} 
         */
        var _showServerDownScreen = function() {
            var authModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                "moduleName": "AuthUIModule",
                "appName": "AuthenticationMA"
            });
            //Presenting the Login form without a viewmodel first as a work around for preShow of form being called after willUpdateUI.
            //authModule.presentationController.presentUserInterface('frmLogin', {});
            authModule.presentationController.navigateToServerDownScreen.call(authModule.presentationController);
        };
        /**
         * disableButtonActionForCSRMode : Method to disable Segment buttons and buttons in csr mode
         * @member of {CommonUtilities}
         * @param {} 
         * @return {}
         * @throws {} 
         */
        var _disableButtonActionForCSRMode = function() {
            kony.print("This action is not valid for CSR");
        };
        /**
         * disableButtonSkinForCSRMode : Method to set skin to buttons in csr mode
         * @member of {CommonUtilities}
         * @param {} 
         * @return {string} skin - skin to applied to buttons in csr mode
         * @throws {} 
         */
        var _disableButtonSkinForCSRMode = function() {
            var skin = "sknBtnBlockedSSP0273e315px";
            return skin;
        };
        /**
         * disableSegmentButtonSkinForCSRMode : Method to set skin to Segment buttons in csr mode
         * @member of {CommonUtilities}
         * @param {size} : size of the font in button
         * @return {string} skin - skin to be applied to buttons in csr mode
         * @throws {} 
         */
        var _disableSegmentButtonSkinForCSRMode = function(size) {
            if (size == 13)
                return "sknBtnSSP3343A813PxBg0CSR";
            if (size == 15)
                return "sknBtnSSP3343A815PxBg0CSR";
            if (size == 17)
                return "sknBtnSSP3343A817PxBg0CSR";
        };

        /**
         * _isValidAmount : Method to validat amount field
         * @member of {CommonUtilities}
         * @param {string} amount, amount string
         * @return {boolean} is valid amount value or not
         * @throws {} 
         */
        var _isValidAmount = function(amount) {
            return amount !== undefined && amount !== null && !isNaN(amount) && amount !== "";
        };

        var _isValidAllAmount = function(amount) {
            return amount !== undefined && amount !== null && amount !== "";
        };

        /**
         * _isEmptyString : Method to validate Empty String
         * @member of {CommonUtilities}
         * @param {string} str, string to validate
         * @return {boolean} is valid Empty string or not
         * @throws {} 
         */
        var _isEmptyString = function(str) {
            return str !== undefined && str !== null && str.toString().trim().length === 0;
        };

        /**
         * getMaskedAccountNumber : Method to mask Account Number
         * @member of {CommonUtilities}
         * @param {string} accountNumber,
         * @return {string} masked account Number
         * @throws {} 
         */
        var _getMaskedAccountNumber = function(accountNumber) {
            var stringAccNum = accountNumber;
            var isLast4Digits = function isLast4Digits(index) {
                return index > stringAccNum.length - 5;
            };
            return stringAccNum.split('').map(function(c, i) {
                return isLast4Digits(i) ? c : 'X';
            }).join('');
        };
        /**
         * Method to check if given string contains required character
         * @memberof {CommonUtilities}
         * @param {string}  -  string,value
         * @returns {boolean} - true if string contains the required character
         * @throws {}
         */
        var _substituteforIncludeMethod = function(string, value) {
            var returnValue = false;
            var position = string.indexOf(value);
            if (position >= 0) {
                returnValue = true;
            }
            return returnValue;
        };

        /**
         * Function to Find difference between current date and a date
         * @member of  FormatUtilManager
         * date format is yyyymmddhhmmss
         */
        var _getTimeDiferenceOfDate = function(date) {
            var yyyy = date.substring(0, 4);
            var mon = date.substring(4, 6);
            var dd = date.substring(6, 8);
            var hh = date.substring(8, 10);
            var mm = date.substring(10, 12);
            var ss = date.substring(12);
            var date1 = new Date(yyyy, parseInt(mon, 10) - 1, dd, hh, mm, ss);
            var date1_ms = date1.getTime();
            var dateTemp = new Date();
            var utcDate = dateTemp.getUTCDate();
            var utcMonth = dateTemp.getUTCMonth();
            var utcYear = dateTemp.getUTCFullYear();
            var utcHour = dateTemp.getUTCHours();
            var utcMins = dateTemp.getUTCMinutes();
            var utcSecs = dateTemp.getUTCSeconds();
            var date2 = new Date(utcYear, utcMonth, utcDate, utcHour, utcMins, utcSecs);
            var date2_ms = date2.getTime();
            var difference_ms = date2_ms - date1_ms;

            var one_year = 365 * 1000 * 60 * 60 * 24;
            var one_month = 30 * 1000 * 60 * 60 * 24;
            var one_day = 1000 * 60 * 60 * 24;
            var one_hour = 1000 * 60 * 60;
            var one_min = 1000 * 60;
            var one_sec = 1000;

            var timeDiff = "just now";

            var yearDiff = difference_ms / one_year;
            var monthDiff = difference_ms / one_month;
            var daysDiff = difference_ms / one_day;
            var hoursDiff = difference_ms / one_hour;
            var minutesDiff = difference_ms / one_min;
            var secondsDiff = difference_ms / one_sec;

            if (Math.floor(yearDiff) > 0) {

                if (Math.floor(yearDiff) == 1) {
                    timeDiff = "year";
                } else {
                    timeDiff = "years";
                }

                return Math.floor(yearDiff) + " " + timeDiff + " ago";
            } else if (Math.floor(monthDiff) > 0) {

                if (Math.floor(monthDiff) == 1) {
                    timeDiff = "month";
                } else {
                    timeDiff = "months";
                }

                return Math.floor(monthDiff) + " " + timeDiff + " ago";
            } else if (Math.floor(daysDiff) > 0) {

                if (Math.floor(daysDiff) == 1) {
                    timeDiff = "day";
                } else {
                    timeDiff = "days";
                }

                return Math.floor(daysDiff) + " " + timeDiff + " ago";
            } else if (Math.floor(hoursDiff) > 0) {

                if (Math.floor(hoursDiff) == 1) {
                    timeDiff = "hour";
                } else {
                    timeDiff = "hours";
                }

                return Math.floor(hoursDiff) + " " + timeDiff + " ago";
            } else if (Math.floor(minutesDiff) > 0) {

                if (Math.floor(minutesDiff) == 1) {
                    timeDiff = "minute";
                } else {
                    timeDiff = "minutes";
                }

                return Math.floor(minutesDiff) + " " + timeDiff + " ago";
            } else if (Math.floor(secondsDiff) > 0) {

                if (Math.floor(secondsDiff) == 1) {
                    timeDiff = "second";
                } else {
                    timeDiff = "seconds";
                }

                return Math.floor(secondsDiff) + " " + timeDiff + " " + " ago";
            }

            return timeDiff;
        };

        /**
         * getPrimaryContact: Returns the contact for which the isPrimary flag is true. Expects only one of the contacts to be primary. If there are more than one, returns the last.
         * @member of {CommonUtilities}
         * @param {Array} - Array of contacts.  
         * @return {}
         * @throws {}
         */
        var _getPrimaryContact = function(contacts) {
            var primaryContact = "";
            contacts.forEach(function(item) {
                if (item.isPrimary === "true") {
                    primaryContact = item.Value;
                }
            });
            return primaryContact;
        };
        /**
         *  getUserNamePolicies : processes the username policies from the service response
         * @member of {CommonUtilities}
         * @param {*} data - service response containing username and password policy rules
         * @return {}
         * @throws {} 
         */
        var _getUserNamePolicies = function(data) {
            var rules = [];
            if (data) {
                for (var i = 0; i < data.length; i++) {
                    var policyName = data[i].policyName;
                    if (_substituteforIncludeMethod(policyName, "Username Policy for End Customers")) {
                        rules.push(data[i].policyDescription);
                    }
                }
            }
            return rules;
        };
        /**
         * getPasswordPolicies : processes the password policies from the service response
         * @member of {CommonUtilities}
         * @param {*} data - service response containing username and password policy rules
         * @return {}
         * @throws {}
         */
        var _getPasswordPolicies = function(data) {
            var rules = [];
            if (data) {
                for (var i = 0; i < data.length; i++) {
                    var policyName = data[i].policyName;
                    if (_substituteforIncludeMethod(policyName, "Password Policy for End Customers")) {
                        rules.push(data[i].policyDescription);
                    }
                }
            }
            return rules;
        };
        /**
         * _deFormatAmount: Removes the formatting (commas) from the amount. 
         * @member of {CommonUtilities}
         * @param {String} - amountString with commas.  
         * @return {}
         * @throws {}
         */
        var _deFormatAmount = function(amountString) {
            var formatUtilManager = applicationManager.getFormatUtilManager();
            return formatUtilManager.deFormatAmount(amountString);
        };

        /**
         * validateAndFormatAmount: Validates the amount in the given amount field reference and then formats it if the amount is valid. 
         * @member of {CommonUtilities}
         * @param {Object} - Widget Reference.  
         * @return {}
         * @throws {}
         */
        var _validateAndFormatAmount = function(widgetId) {
            var amount = widgetId.text;
            if (!_isValidAmount(amount)) {
                return false;
            } else {
                widgetId.text = _formatCurrencyWithCommas(amount, true);
                return true;
            }
        };

        /**
         * _validateAmountFieldKeyPress: Doesn't allow the user to enter a 3rd decimal. 
         * @member of {CommonUtilities}
         * @param {Object} - Widget Reference.  
         * @return {}
         * @throws {}
         */
        var _validateAmountFieldKeyPress = function(widgetId) {
            var amount = widgetId.text;
            if (amount.indexOf('.') < 0)
                return;
            else {
                var arr = amount.split('.');
                if (arr[1].length <= 2)
                    return;
                widgetId.text = (arr[0] + "." + arr[1].slice(0, 2));
                return true;
            }
        };

        /**
         * removeDelimitersForAmount: Removes the formatting (commas) for the amount in the given widget. 
         * @member of {CommonUtilities}
         * @param {Object} - Widget Reference.  
         * @return {}
         * @throws {}
         */
        var _removeDelimitersForAmount = function(widgetId) {
            var amount = widgetId.text;
            var formatUtilManager = applicationManager.getFormatUtilManager();
            widgetId.text = formatUtilManager.deFormatAmount(amount);
        };

        /**
         * bindEventsForAmountField: Binds the Key Up, End Editing and Begin Editing events for an amount field.
         * @member of {CommonUtilities}
         * @param {Object} - Widget Reference.  
         * @return {}
         * @throws {}
         */
        var _bindEventsForAmountField = function(widgetId) {
            widgetId.onKeyUp = this.validateAmountFieldKeyPress.bind(this, widgetId);
            widgetId.onEndEditing = this.validateAndFormatAmount.bind(this, widgetId);
            widgetId.onBeginEditing = this.removeDelimitersForAmount.bind(this, widgetId);
        };

        var _setDateFormatToCal = function(widgetId) {
            var dateFormate = applicationManager.getFormatUtilManager().getDateFormat();
            widgetId.dateFormat = dateFormate;
            widgetId.dateEditable = false;
        }
        var _blockFutureDate = function(widgetId, numberOfdays, startDate) {
            _setDateFormatToCal(widgetId);
            var futureDate = new Date(Date.now() + (1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 24 /*day*/ * numberOfdays));
            var today = new Date();
            widgetId.enableRangeOfDates([today.getDate(), today.getMonth() + 1, today.getFullYear()], [futureDate.getDate(), futureDate.getMonth() + 1, futureDate.getFullYear()], "skn", true);
            widgetId.dateComponents = [today.getDate(), today.getMonth() + 1, today.getFullYear()]
        }
        var _enableCopy = function(widgetId) {
            widgetId.textCopyable = true;
        }
        /**
         * Method check data of birth
         * @param {string} date - front end /application date string 
         * @return {boolean} true/false - valida dob or not
         */
        var _isValidDOB = function(date) {
            var dateObj = applicationManager.getFormatUtilManager().getDateObjectFromCalendarString(date, applicationManager.getFormatUtilManager().getDateFormat().toUpperCase());
            return applicationManager.getValidationUtilManager().isDateNotGreaterThanCurrentDate(dateObj);

        }

        /**
         * Returns a function, that, as long as it continues to be invoked, will not
         * be triggered. The function will be called after it stops being called for
         * N milliseconds.
         * @param {function} func - invoked function name 
         * @param {integer} wait - time limit 
         * @param {boolean} immediate -- specifies immediate or not
         */
        var _debounce = function(func, wait, immediate) {
            var timeout;
            return function() {
                var context = this,
                    args = arguments;
                var later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        }
        var _isPrintEnabled = function() {
            return (applicationManager.getConfigurationManager().printingTransactionDetails === "true" &&
                isDesktopWeb());
        }
        var _getaccessibilityConfig = function() {
            var accessibilityConfig = {
                "a11yLabel": "",
                "a11yValue": "",
                "a11yHint": "",
                "a11yHidden": false
            };
            return accessibilityConfig;
        }
        var _setText = function(widgetID, text, accessibilityConfig) {
            frm = kony.application.getCurrentForm();
            if (frm.id === "frmDashboard") {
                if (widgetID === frm.CustomPopup.lblPopupMessage) {
                    widgetID.text = text
                    widgetID.accessibilityConfig = {
                        "a11yLabel": text,
                        "a11yARIA": {
                            "tabindex": -1,
                        }
                    }
                    return;
                }
            }
            if (frm.id === "frmLogin") {
                if (widgetID === frm.CustomChangeLanguagePopup.lblPopupMessage) {
                    widgetID.accessibilityConfig = {
                        "a11yARIA": {
                            "tabindex": -1,
                        }
                    }
                    return;
                }
                if (widgetID === frm.lblLanguage) {
                    widgetID.text = text;
                    widgetID.accessibilityConfig = {
                        "a11yLabel": "Language " + frm.lblLanguage.text,
                        "a11yARIA": {
                            "tabindex": -1,
                        }
                    }
                    return;
                }
            }
            switch (typeof text) {
                case 'string':
                    widgetID.text = text; // if text parameter is a string
                    widgetID.accessibilityConfig = {
                        "a11yLabel": text,
                        "a11yARIA": {
                            "aria-labelledby": widgetID.id === "lbxPhoneNumberType" ? "lblPhoneNumberType": " "
                        }
                    };
                    break;
                case 'object':
                    if (text !== null && typeof text.text !== 'undefined') { // if text parameter is an object and contains some text
                        widgetID.text = text.text;
                        widgetID.accessibilityConfig = {
                            "a11yLabel": text.text
                        };
                        break;
                    }
                default:
                    widgetID.text = ""; // if text parameter is undefined
                    widgetID.accessibilityConfig = {
                        "a11yLabel": ""
                    };
            }
            frm = kony.application.getCurrentForm();
            if (frm.id === "frmDashboard") {
                if (widgetID === frm.lblDowntimeWarning) {
                    frm.lblDowntimeWarning.accessibilityConfig = {
                        a11yLabel: kony.i18n.getLocalizedString("i18n.common.OoopsServerError"),
                        a11yARIA: {
                            role: "status",
                            tabindex: -1
                        }
                    }
                }
            }
        }
        var _centerPopupFlex=function(popupWidget) {
          popupWidget.info = popupWidget.frame;
        if (kony.os.deviceInfo().screenHeight > popupWidget.info.height) {
            popupWidget.top = "";
            popupWidget.centerY = "50dp";
            popupWidget.centerY = "50%";
        } else {
            popupWidget.top = "20px";
            popupWidget.centerY = "";
          }
        }
        /**
         * detects the desktop web
         * @returns {boolean} true if desktop web else false
         */
        var isDesktopWeb = function() {
            var userAgent = kony.os.deviceInfo().userAgent
            if ((/iphone/i.test(userAgent)) ||
                (/ipad/i.test(userAgent)) ||
                (/android/i.test(userAgent) && /mobile/i.test(userAgent)) ||
                (/android/i.test(userAgent))) {
                return false;
            }
            return true;
        }
        /*** 
              @description: function to get full name in the current locale
              @parameter: original firstname, middlename, lastname
              @returns: fullname in provided format in i18n
          ***/
        var _getFullNameInCurrentLocale = function(firstName, middleName, lastName) {
            var format = kony.i18n.getLocalizedString("i18n.Formats.FullNameFormat");
            format = (kony.sdk.isNullOrUndefined(firstName)) ? format.replace(/<FirstName>/i, "") : format.replace(/<FirstName>/i, firstName.trim() + " ");
            format = (kony.sdk.isNullOrUndefined(middleName)) ? format.replace(/<MiddleName>/i, "") : format.replace(/<MiddleName>/i, middleName.trim() + " ");
            format = (kony.sdk.isNullOrUndefined(lastName)) ? format.replace(/<LastName>/i, "") : format.replace(/<LastName>/i, lastName.trim() + " ");
            return format.trim();
        }
        /**
              converts formatted currency into float
          **/
        var _getFloatValueOfCurrency = function(amount) {
            if (amount === undefined || amount === null) {
                return;
            }
            amount = amount + "";
            amount = amount.replace(/,/g, "");
            amount = amount.replace(/\$/g, "");
            return parseFloat(amount);
        };

        /**
         * copies a JSON by value and returns it
         **/
        var _cloneJSON = function(jsonObj) {
            var output, value, key;
            output = Array.isArray(jsonObj) ? [] : {};
            for (key in jsonObj) {
                value = jsonObj[key];
                output[key] = (typeof value === "object") ? _cloneJSON(value) : value;
            }
            return output;
        };
        /**
              This method takes an object as input and checks whether 
              the object is an empty object or not
          **/
        var _isEmptyObject = function(jsonObj) {
            return (Object.entries(jsonObj).length === 0 && jsonObj.constructor === Object);
        }
        /*** 
              @description: function to get date from calendar in yyyy-mm-dd format
              @parameter: calender widget
          ***/
        var _getDateFromCalendarInBackendSupportedFormat = function(calendar) {
            var month = calendar.month;
            month = month <= 9 ? "0" + month : month;

            var day = calendar.day;
            day = day <= 9 ? "0" + day : day;

            var year = calendar.year;

            return year + "-" + month + "-" + day;
        };

        var _truncateStringWithGivenLength = function(str, maxLength) {
            str = str || "N/A";
            if (kony.sdk.isNullOrUndefined(maxLength)) {
                return str;
            }
            if (!kony.sdk.isNullOrUndefined(maxLength) && maxLength > str.length) {
                return str;
            }
            var result = str.substring(0, maxLength - 3);
            result = result + "...";
            return result;
        };

        var _setApprovalRules = function(approvalRules) {
            this.approvalRules = approvalRules;
        };
        var _getApprovalRules = function() {
            return this.approvalRules;
        };
        var _getApprovalRuleDescription = function(approvalRuleId) {
            for (var i = 0; i < this.approvalRules.length; i++) {
                if (this.approvalRules[i]["ruleId"] === approvalRuleId) {
                    return this.approvalRules[i]["ruleDescriprion"];
                }
            }
            return "";
        };
        /**
         * This function takes date string in yyyy-mm-dd format
         * adn returns in dd-mm-yyyy format
         */

        var _getFormatedDateString = function(dateString) {
            var p = dateString.split("-");
            return [p[2], p[1], p[0]].join("-");
        };

        /**
         * This method is used to get the key from the masterData to populate listbox
         **/
        var _getListBoxSelectedKeyFromMasterData = function(searchkey, masterData) {
            var selectedKey = null;
            masterData.forEach(function(record) {
                if (searchkey === record[0]) {
                    selectedKey = record[0];
                }
            });
            return selectedKey;
        }

        /**
         * Method to generate random ID
         * @return {String} unique ID
         */
        var _getID = function() {
            return Math.random().toString(36).substr(2, 9);
        }

        /**
         * Method to setup focus handlers for parent flex border on textbox focus
         * @param {kony.ui.TextBox2} textbox textbox reference to add handlers on
         * @param {kony.ui.FlexContainer} flex flex reference used as texbox border
         * @param scopeObj current form's scope object
         */
        var _setA11yFoucsHandlers = function(textbox, flex, scopeObj) {
            var oldOnBenginEditing = textbox.onBeginEditing;
            textbox.onBeginEditing = function() {
                if (oldOnBenginEditing)
                    oldOnBenginEditing();
                flex.skin = "sknFlxBorder003e751px";
            }
            var oldOnEndEditing = textbox.onEndEditing;
            textbox.onEndEditing = function() {
                if (oldOnEndEditing)
                    oldOnEndEditing();
                flex.skin = "sknFlxffffff2pxe3e3e3border";
            }
        }


        /**
         * _getMonthFormattedDate - Formats a given date string into a DD Mon YYYY date format.
         * @member of {CommonUtilities}
         * @param {String} dateString - The date string to be formatted.
         * @returns {String} Formatted date string.
         * @throws {}
         */
        var _getMonthFormattedDate = function(dateString) {
            var formatUtilManager = applicationManager.getFormatUtilManager();
            var dateObj = formatUtilManager.getDateObjectfromString(dateString, "YYYY-MM-DD");
            return formatUtilManager.getFormatedDateString(dateObj, "d M Y");
        }

        var _getMaskedAccName = function(accountId) {
            var maskedAccName = [];
            applicationManager.getConfigurationManager().userAccounts.forEach(function(obj) {
                if (accountId === obj.accountID) {
                    maskedAccName[0] = _getMaskedAccount(_truncateStringWithGivenLength(obj.accountName + "....", 20), obj.accountID);
                    maskedAccName[1] = _getMaskedAccount(obj.accountName, obj.accountID);
                    return maskedAccName;
                }
            });
            return maskedAccName;
        }
        var _getCurrencyCode = function(accountId) {
            var CurrencyCode;
            applicationManager.getConfigurationManager().userAccounts.forEach(function(obj) {
                if (accountId === obj.accountID) {
                    //  maskedAccName[0] = _getMaskedAccount(_truncateStringWithGivenLength(obj.accountName + "....", 20), obj.accountID);
                    // maskedAccName[1] = _getMaskedAccount(obj.accountName, obj.accountID);
                    CurrencyCode = obj.currencyCode;
                    return CurrencyCode;
                }
            });
            return CurrencyCode;
        }


        /**
           * _sortAndSearchJSON - searches and sorts JSONArrays
           * @member of {CommonUtilities}
           * @param {JSONArray} data - Array of jsons
           * @param {String} sortField - Key in json object of an element in data(JSONArray) on which sorting needs to be done.
             To avoid sorting pass empty string		 
           * @param {String} sortType - "ASC" or "DESC" based on sorting order you need.
           * @param {String} searchParams - Comma seperated params on which search operation is to be done.
           * @param {String} searchString - String to be searched
           * @returns {Integer | JSONArray} -1 if searched key value pairs don't exist | Sorted and searched JSONArray otherwise
           * @throws {}
           */
        var _sortAndSearchJSON = function(data, sortField, sortType, searchParams, searchString) {

            try {
                if (searchParams != null || searchParams !== "") {
                    var newdata = data.filter(function(a) {
                        var flag = false;
                        var searchConfig = searchParams.split(",");
                        for (var i = 0; i < searchConfig.length; i++) {
                            var searchField = searchConfig[i];
                            var regex = new RegExp(searchString, "i");
                            if (a.hasOwnProperty(searchField)) {
                                flag = flag || ((a[searchField].match(regex) || []).length == 1);
                            }
                        }
                        return flag;
                    });
                    if (newdata.length == 0) return -1;
                } else {
                    newdata = data;
                }
            } catch (err) {
                newdata = data;
            }
            try {
                newdata.sort(function(a, b) {
                    if (a[sortField].toLowerCase() > b[sortField].toLowerCase()) {
                        if (sortType === "ASC") return 1;
                        else if (sortType === "DESC") return -1;
                    } else if (a[sortField].toLowerCase() < b[sortField].toLowerCase()) {
                        if (sortType === "ASC") return -1;
                        else if (sortType === "DESC") return 1;
                    } else return 0;
                });
            } catch (err) {
                //do nothing
            }
            return newdata;
        };

        var _getMaskedAccName = function(accountId) {
            var maskedAccName = [];
            applicationManager.getConfigurationManager().userAccounts.forEach(function(obj) {
                if (accountId === obj.accountID) {
                    maskedAccName[0] = _getMaskedAccount(_truncateStringWithGivenLength(obj.accountName + "....", 20), obj.accountID);
                    maskedAccName[1] = _getMaskedAccount(obj.accountName, obj.accountID);
                    return maskedAccName;
                }
            });
            return maskedAccName;
        }

        var _setKeypadChar = function(scopeObj, char) {
            var locale = kony.i18n.getCurrentLocale();
            locale = locale.toLowerCase();
            locale = locale.replace("_", "-");
            if (locale == "de-de" || locale === "fr-fr" || locale == "es-es") {
                if (char === ',') {
                    if (scopeObj.isPeriodUsed === false) {
                        scopeObj.isPeriodUsed = true;
                    } else {
                        return;
                    }
                }
                scopeObj.keypadString = scopeObj.keypadString + char;
                var firstChar = scopeObj.keypadString[0];
                scopeObj.keypadString = scopeObj.keypadString.split("");
                for (var i = 1; i < scopeObj.keypadString.length; i++) {
                    if (scopeObj.keypadString[i] === ',') {
                        scopeObj.keypadString[i - 1] = scopeObj.keypadString[i + 1];
                        i++;
                    } else {
                        scopeObj.keypadString[i - 1] = scopeObj.keypadString[i];
                    }
                }
                scopeObj.keypadString = scopeObj.keypadString.join("");
                scopeObj.keypadString = scopeObj.keypadString.substr(0, scopeObj.keypadString.length - 1);
                if (firstChar !== '0') {
                    scopeObj.keypadString = firstChar + scopeObj.keypadString;
                }
            } else {
                if (char === '.') {
                    if (scopeObj.isPeriodUsed === false) {
                        scopeObj.isPeriodUsed = true;
                    } else {
                        return;
                    }
                }
                scopeObj.keypadString = scopeObj.keypadString + char;
                var firstChar = scopeObj.keypadString[0];
                scopeObj.keypadString = scopeObj.keypadString.split("");
                for (var i = 1; i < scopeObj.keypadString.length; i++) {
                    if (scopeObj.keypadString[i] === '.') {
                        scopeObj.keypadString[i - 1] = scopeObj.keypadString[i + 1];
                        i++;
                    } else {
                        scopeObj.keypadString[i - 1] = scopeObj.keypadString[i];
                    }
                }
                scopeObj.keypadString = scopeObj.keypadString.join("");
                scopeObj.keypadString = scopeObj.keypadString.substr(0, scopeObj.keypadString.length - 1);
                if (firstChar !== '0') {
                    scopeObj.keypadString = firstChar + scopeObj.keypadString;
                }
            }
        };

        var _clearKeypadChar = function(scopeObj) {
            var locale = kony.i18n.getCurrentLocale();
            locale = locale.toLowerCase();
            locale = locale.replace("_", "-");
            if (locale == "de-de" || locale === "fr-fr" || locale == "es-es") {
                if (scopeObj.keypadString === '0,00') return;
                scopeObj.keypadString = scopeObj.keypadString.split("");
                for (var i = scopeObj.keypadString.length - 2; i >= 0; i--) {
                    if (scopeObj.keypadString[i] === ',') {
                        scopeObj.keypadString[i + 1] = scopeObj.keypadString[i - 1];
                        i--;
                    } else {
                        scopeObj.keypadString[i + 1] = scopeObj.keypadString[i];
                    }
                }
                scopeObj.keypadString = scopeObj.keypadString.join("");
                scopeObj.keypadString = scopeObj.keypadString.substr(1);
                if (scopeObj.keypadString[0] === ',') {
                    scopeObj.keypadString = '0' + scopeObj.keypadString;
                }

            } else {
                if (scopeObj.keypadString === '0.00') return;
                scopeObj.keypadString = scopeObj.keypadString.split("");
                for (var i = scopeObj.keypadString.length - 2; i >= 0; i--) {
                    if (scopeObj.keypadString[i] === '.') {
                        scopeObj.keypadString[i + 1] = scopeObj.keypadString[i - 1];
                        i--;
                    } else {
                        scopeObj.keypadString[i + 1] = scopeObj.keypadString[i];
                    }
                }
                scopeObj.keypadString = scopeObj.keypadString.join("");
                scopeObj.keypadString = scopeObj.keypadString.substr(1);
                if (scopeObj.keypadString[0] === '.') {
                    scopeObj.keypadString = '0' + scopeObj.keypadString;
                }
            }
        };

        var _getCurrencyCode = function(accountId) {
            var CurrencyCode;
            applicationManager.getConfigurationManager().userAccounts.forEach(function(obj) {
                if (accountId === obj.accountID) {
                    //  maskedAccName[0] = _getMaskedAccount(_truncateStringWithGivenLength(obj.accountName + "....", 20), obj.accountID);
                    // maskedAccName[1] = _getMaskedAccount(obj.accountName, obj.accountID);
                    CurrencyCode = obj.currencyCode;
                    return CurrencyCode;
                }
            });
            return CurrencyCode;
        }

        var _getModifiedstatusForPending = function(status) {
            var updatedStatus;
            if (status === BBConstants.TRANSACTION_STATUS.PENDING) {
                updatedStatus = BBConstants.TRANSACTION_STATUS.PENDING_FOR_AUTH;
            } else {
                updatedStatus = status;
            }
            return updatedStatus;
        };

        var _updateAmountValue = function(scopeObj) {
            var locale = kony.i18n.getCurrentLocale();
            locale = locale.toLowerCase();
            locale = locale.replace("_", "-");
            if (locale == "de-de" || locale === "fr-fr" || locale == "es-es") {
                var keypadStringCommas = '';
                var beforeDecimal = scopeObj.keypadString.split(',')[0];
                var afterDecimal = scopeObj.keypadString.split(',')[1];
                if (beforeDecimal.length > 3) {
                    var withCommas = (beforeDecimal.length) / 3;
                    var withoutCommas = (beforeDecimal.length) % 3;
                    var temp = '';
                    if (withoutCommas != 0) {
                        temp = beforeDecimal.substr(0, withoutCommas) + '.';
                    }
                    for (var i = withoutCommas; i < beforeDecimal.length; i += 3) {
                        temp += beforeDecimal.substr(i, 3) + '.';
                    }
                    beforeDecimal = temp.substr(0, temp.length - 1);
                }
                keypadStringCommas = beforeDecimal + ',' + afterDecimal;
            } else {
                var keypadStringCommas = '';
                var beforeDecimal = scopeObj.keypadString.split('.')[0];
                var afterDecimal = scopeObj.keypadString.split('.')[1];
                if (beforeDecimal.length > 3) {
                    var withCommas = (beforeDecimal.length) / 3;
                    var withoutCommas = (beforeDecimal.length) % 3;
                    var temp = '';
                    if (withoutCommas != 0) {
                        temp = beforeDecimal.substr(0, withoutCommas) + ',';
                    }
                    for (var i = withoutCommas; i < beforeDecimal.length; i += 3) {
                        temp += beforeDecimal.substr(i, 3) + ',';
                    }
                    beforeDecimal = temp.substr(0, temp.length - 1);
                }
                keypadStringCommas = beforeDecimal + '.' + afterDecimal;
            }
            return keypadStringCommas;
        };

        /**
           * _getObjectFromPath - get object at given path
           * @member of {CommonUtilities}
           * @param {JSONObject / JSONArray} data -  json object or json array in which you need the object		 
           * @param {String} jpath - comma seperated keys in case of jsonobject incase of jsonarray specify
               key=value
           * @returns {Integer | JSONArray} -1 if jpath is invalid | data at the specified jpath
           * @throws {}
           */
        var _getObjectFromPath = function(data, jpath) {
            try {
                jpath = jpath.split(",");
                var objRef = jpath.reduce(function(o, k) {
                    if (Array.isArray(o)) {
                        var filter = k.split("=");
                        var key = filter[0],
                            val = filter[1];
                        for (var j = 0; j < o.length; j++) {
                            if (o[j][key] == val) {
                                return o[j];
                            }
                        }
                    } else return o[k]
                }, data);
                return objRef;
            } catch (ex) {
                return -1;
            }
        };

        var _setKeypadCharWOD = function(scopeObj, char) {
            var locale = kony.i18n.getCurrentLocale();
            locale = locale.toLowerCase();
            locale = locale.replace("_", "-");
            if (locale == "de-de" || locale === "fr-fr" || locale == "es-es") {
                if (char === ',') {
                    if (scopeObj.isPeriodUsed === false) {
                        scopeObj.isPeriodUsed = true;
                    } else {
                        return;
                    }
                }
                scopeObj.keypadString = scopeObj.keypadString + char;
                var firstChar = scopeObj.keypadString[0];
                scopeObj.keypadString = scopeObj.keypadString.split("");
                for (var i = 1; i < scopeObj.keypadString.length; i++) {
                    if (scopeObj.keypadString[i] === ',') {
                        scopeObj.keypadString[i - 1] = scopeObj.keypadString[i + 1];
                        i++;
                    } else {
                        scopeObj.keypadString[i - 1] = scopeObj.keypadString[i];
                    }
                }
                scopeObj.keypadString = scopeObj.keypadString.join("");
                scopeObj.keypadString = scopeObj.keypadString.substr(0, scopeObj.keypadString.length - 1);
                if (firstChar !== '0') {
                    scopeObj.keypadString = firstChar + scopeObj.keypadString;
                }

            } else {
                if (char === '.') {
                    if (scopeObj.isPeriodUsed === false) {
                        scopeObj.isPeriodUsed = true;
                    } else {
                        return;
                    }
                }
                scopeObj.keypadString = scopeObj.keypadString + char;
                var firstChar = scopeObj.keypadString[0];
                scopeObj.keypadString = scopeObj.keypadString.split("");
                for (var i = 1; i < scopeObj.keypadString.length; i++) {
                    if (scopeObj.keypadString[i] === '.') {
                        scopeObj.keypadString[i - 1] = scopeObj.keypadString[i + 1];
                        i++;
                    } else {
                        scopeObj.keypadString[i - 1] = scopeObj.keypadString[i];
                    }
                }
                scopeObj.keypadString = scopeObj.keypadString.join("");
                scopeObj.keypadString = scopeObj.keypadString.substr(0, scopeObj.keypadString.length - 1);
                if (firstChar !== '0') {
                    scopeObj.keypadString = firstChar + scopeObj.keypadString;
                }
            }
        };

        var _clearKeypadCharWOD = function(scopeObj) {
            var locale = kony.i18n.getCurrentLocale();
            locale = locale.toLowerCase();
            locale = locale.replace("_", "-");
            if (locale == "de-de" || locale === "fr-fr" || locale == "es-es") {
                if (scopeObj.keypadString === '0') return;
                var value = (scopeObj.keypadString / 10).toString();
                if (parseInt(value) > 0) {
                    var value1 = value.split('.')[0];
                    scopeObj.keypadString = value1;
                    var count = scopeObj.keypadString.split("");
                    if (count === 0) {
                        scopeObj.keypadString = '0';
                    }
                } else {
                    scopeObj.keypadString = '0';
                }
            } else {
                if (scopeObj.keypadString === '0') return;
                var value = (scopeObj.keypadString / 10).toString();
                if (parseInt(value) > 0) {
                    var value1 = value.split('.')[0];
                    scopeObj.keypadString = value1;
                    var count = scopeObj.keypadString.split("");
                    if (count === 0) {
                        scopeObj.keypadString = '0';
                    }
                } else {
                    scopeObj.keypadString = '0';
                }
            }

        };
        /**
         * Returns a boolean value, wheter _isMirrorLayoutEnabled enabled or not for the current selected locale.
         * @returns {boolean} true if _isMirrorLayoutEnabled enabled, else false
         */
        var _isMirrorLayoutEnabled = function() {
            let isMirrorLayout = false;
            let currentLocale = kony.i18n.getCurrentLocale();
            // harding this locale to ar_AR for now, as there is no directframework API to check whether _isMirrorLayout or not.
            if (currentLocale == "ar_AE") {
                isMirrorLayout = true;
            }
            return isMirrorLayout;
        }
        /**
           * _updateObjectFromPath - get object at given path
           * @member of {CommonUtilities}
           * @param {JSONObject / JSONArray} data -  json object or json array in which you need the object		 
           * @param {String} jpath - comma seperated keys in case of jsonobject incase of jsonarray specify
               key=value
           * @param {String} obj - obj which is to be updated at the path
           * @returns {Integer | JSONArray} -1 if jpath is invalid | data at the specified jpath
           * @throws {}
           */
        var _updateObjectFromPath = function(data, jpath, obj) {
            try {
                jpath = jpath.split(",");
                var objRef = jpath.reduce(function(o, k) {
                    if (Array.isArray(o)) {
                        var filter = k.split("=");
                        var key = filter[0],
                            val = filter[1];
                        for (var j = 0; j < o.length; j++) {
                            if (o[j][key] == val) {
                                return o[j];
                            }
                        }
                    } else return o[k]
                }, data);
                if (Array.isArray(objRef)) {
                    while (objRef.length) {
                        objRef.pop();
                    }
                    for (i = 0; i < obj.length; i++) {
                        objRef[i] = obj[i];
                    }
                } else {

                    for (var key in objRef) {
                        delete objRef[key];
                    }
                    for (var key in obj) {
                        objRef[key] = obj[key];
                    }
                }
                return data;
            } catch (ex) {
                return -1;
            }
        }

        var _updateAmountValueWOD = function(scopeObj) {
            var locale = kony.i18n.getCurrentLocale();
            locale = locale.toLowerCase();
            locale = locale.replace("_", "-");
            if (locale == "de-de" || locale === "fr-fr" || locale == "es-es") {
                var finalString = scopeObj.keypadString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                var beforeDecimal = finalString.split(',')[0];
                var finalValue = beforeDecimal + ",00";

            } else {
                var finalString = scopeObj.keypadString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                var beforeDecimal = finalString.split('.')[0];
                var finalValue = beforeDecimal + ".00";
            }
            return finalValue;

        };
        /**
	 * This method adds the popup widget to a list.
	 * All the popup widgets in the list are hidden when user clicks outside the popups.
	 * If the multiple popupObj widgets have same widget ids, then pass a string to identify individual popups.
	 * @param {Object} popUpObj - contains details of the popup
	 * @param {Object} popUpObj.widget - widget reference
	 * @param {function} popUpObj.hideFunc - widget reference
	 * @param {String} [popUpObj.id=popUpObj.widget.id] - unique identifer of the popup widget
	 * @returns null
	 */
	var _addToListner = function (popUpObj) {
		if (popUpObj === undefined || popUpObj === null || popUpObj.widget === undefined || popUpObj.hideFunc === undefined) {
			kony.print("invalid params sent to addToListner");
			return;
		}
		if (popUpObj.id === undefined || popUpObj.id === null) {
			popUpObj.id = popUpObj.widget.id;
		}
		for (let i = 0; i < touchEndList.length; i++) {
			if (touchEndList[i].id === popUpObj.id) {
				return;
			}
		}
		touchEndList.push({
			widget: popUpObj.widget,
			hideFunc: popUpObj.hideFunc,
			id: popUpObj.id,
            param: popUpObj.param
		});
	};
    /**
	 * This method is triggered on onBlur event of the popupParent.
	 * If the clicked element is inside the popupParent then it don't perform any action and returns.
	 * If the clicked element is outside the popupParent then it hides all the visible popups.
	 * @param {Object} popupParent - the parent widget which contains the widget which show and hides the dropdown and the dropdown it self.
	 * @returns null
	 */
	var _hideAllPopups = function (popupParent) {
		//clear the below line with Desktop Web SPA team.
		//_kwebfw_ is a private method and is not supposed to be accessed at form controller.
		if (popupParent._kwebfw_.view.contains(event.relatedTarget)) {
			kony.print("click source is inside the container");
			return;
		}
		touchEndList.forEach((popupObj) => {
			if (popupObj.widget.isVisible) {
                if (popupObj.param) {
                    if(Array.isArray(popupObj.param))
                        popupObj.hideFunc.apply(this,popupObj.param);
                    else
                        popupObj.hideFunc(popupObj.param);
                }
                else{
                popupObj.hideFunc();
                }
			}
		});
	};
    /**
	 * This method clears the popup list.
	 * This function must be called in the preShow event of the form.
	 * Call addToListner in the form controller only after calling clearList.
	 */
	var _clearList = function () {
		touchEndList = [];
	};

        var _isSCAEnabled = function() {
             let self = this;
            if(self.getSCAType()==1 || self.getSCAType()==2)
                return true;
             else
                return false;
        };
        var _SCAType = function() {
          //0 for not enabled, 1 for HID, 2 for UNIKEN
          // SCAType is a global variable
          var SCAFlowType = OLBConstants.BUILD_TYPE[SCAType];
          if(!kony.sdk.isNullOrUndefined(SCAFlowType)){
            return SCAFlowType;
          }else{
            return OLBConstants.BuildType['BASE'];
          }
        };

        var _SCAHIDOTPType = function() {
            let self = this;
            if (self.CLIENT_PROPERTIES && self.CLIENT_PROPERTIES.SCA_HID_OTP_TYPE) {
                return self.CLIENT_PROPERTIES.SCA_HID_OTP_TYPE;
            }
            return "TOTP";
        };
        var _SCAPinLength = function(){
            var HIDApproveSDKManager = require('HIDApproveSDKManager');
            var policy = HIDApproveSDKManager.getHIDApproveSDKManager().getSdkInstance().getPasswordPolicy();
            if(policy !== null)
            return JSON.parse(policy).maxLength;
            return 6;
        };

        var _setFooterButtonToolTips = function(viewobject) {
            if (viewobject["btnLocateUs"]) {
                viewobject["btnLocateUs"].toolTip = kony.i18n.getLocalizedString("i18n.footer.locateUs");
            }
            if (viewobject["btnContactUs"]) {
                viewobject["btnContactUs"].toolTip = kony.i18n.getLocalizedString("i18n.footer.contactUs");
            }
            if (viewobject["btnPrivacy"]) {
                viewobject["btnPrivacy"].toolTip = kony.i18n.getLocalizedString("i18n.footer.privacy");
            }
            if (viewobject["btnTermsAndConditions"]) {
                viewobject["btnTermsAndConditions"].toolTip = kony.i18n.getLocalizedString("i18n.common.TnC");
            }
            if (viewobject["btnFaqs"]) {
                viewobject["btnFaqs"].toolTip = kony.i18n.getLocalizedString("i18n.footer.faqs");
            }
        };
        /**
         * Method to get the ordinal numeral of a number
         * @param {Number} n number
         * @returns {String} ordinal numeral
         */
        var _getOrdinalNumeral = function (n) {
            if (isNaN(n)) return;
            const s = ['th', 'st', 'nd', 'rd'];
            const v = n % 100;
            return n + (s[(v - 20) % 10] || s[v] || s[0]);
        };
        /**
         * Method to download generated file
         * @param {object} param - contains info like url, fileName & fileType
         * @param requestParams - contains request params
         */
        var _downloadGeneratedFile = function ({ url, fileName, fileType }, requestParams) {
            try {
                let xhr = new kony.net.HttpRequest();
                xhr.open('POST', url, true);
                xhr.setRequestHeader("X-Kony-Authorization", KNYMobileFabric.currentClaimToken);
                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhr.responseType = "blob";
                xhr.onReadyStateChange = function () {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        const format = {
                            "pdf": "application/pdf;charset=utf-8,",
                            "xls": "application/vnd.ms-excel;charset=utf-8,",
                            "xlsx": "application/vnd.ms-excel;charset=utf-8,",
                            "csv": "text/csv;charset=utf-8,"
                        }[fileType];
                        let anchor = window.document.createElement('a');
                        anchor.href = window.URL.createObjectURL(new Blob([xhr.response], { type: format }));
                        anchor.download = `${fileName}.${fileType}`;
                        document.body.appendChild(anchor);
                        anchor.click();
                        document.body.removeChild(anchor);
                        window.URL.revokeObjectURL(anchor.href);
                    }
                };
                xhr.send(JSON.stringify(requestParams));
            } catch (err) {
                kony.print(err);
            }
        };
        /**
         * Method to download uploaded file
         * @param {object} url - contains api
         * @param {object} requestParams - contains request params
         */
        var _downloadAttachment = function (url, requestParams) {
            try {
                let xhr = new kony.net.HttpRequest();
                xhr.open('POST', url, true);
                xhr.setRequestHeader("X-Kony-Authorization", KNYMobileFabric.currentClaimToken);
                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhr.responseType = "blob";
                xhr.onReadyStateChange = function () {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        let anchor = window.document.createElement('a');
                        anchor.href = window.URL.createObjectURL(new Blob([xhr.response]));
                        anchor.download = xhr.getResponseHeader('Content-Disposition').split("filename=")[1].replaceAll('"', "");
                        document.body.appendChild(anchor);
                        anchor.click();
                        document.body.removeChild(anchor);
                        delete anchor;
                    }
                };
                xhr.send(JSON.stringify(requestParams));
            } catch (err) {
                kony.print(err);
            }
        };

        /**
         * Method to download uploaded file
         * @param {object} url - contains api
         * @param {object} requestParams - contains request params
         */
        var _downloadMultipleAttachments = function (url, requestParamsArr) {
            try {
                requestParamsArr.forEach(requestParams => {
                    let xhr = new kony.net.HttpRequest();
                    xhr.open('POST', url, true);
                    xhr.setRequestHeader("X-Kony-Authorization", KNYMobileFabric.currentClaimToken);
                    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    xhr.responseType = "blob";
                    xhr.onReadyStateChange = function () {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        let anchor = window.document.createElement('a');
                        anchor.href = window.URL.createObjectURL(new Blob([xhr.response]));
                        anchor.download = xhr.getResponseHeader('Content-Disposition').split("filename=")[1].replaceAll('"', "");
                        document.body.appendChild(anchor);
                        anchor.click();
                        document.body.removeChild(anchor);
                        delete anchor;
                    }
                };
                xhr.send(JSON.stringify(requestParams));
                });          
            } catch (err) {
                kony.print(err);
            }
        };
        /**
         * safe-attributes list referenced from DOMPurify
         **/
        var _whitelistedAttributes = [
            'accept','action','align','alt','autocapitalize','autocomplete','autopictureinpicture','autoplay','background','bgcolor','border',
            'capture','cellpadding','cellspacing','checked','cite','class','clear','color','cols','colspan','controls','controlslist','coords','crossorigin','datetime','decoding','default','dir','disabled','disablepictureinpicture','disableremoteplayback','download','draggable','enctype','enterkeyhint','face','for',
            'headers','height','hidden','high','href','hreflang','id','inputmode','integrity','ismap','kind','label','lang','list','loading','loop','low','max','maxlength','media','method',
            'min','minlength','multiple','muted','name','nonce','noshade','novalidate','nowrap',
            'open','optimum','pattern','placeholder', 'playsinline','popover','popovertarget','popovertargetaction','poster','preload','pubdate',
            'radiogroup','readonly','rel','required','rev', 'reversed','role','rows','rowspan', 'spellcheck','scope',
            'selected','shape','size','sizes','span','srclang','start','src',
            'srcset','step','style','summary','tabindex','title','translate','type','usemap','valign','value','width','wrap','xmlns','slot'
        ];
       /** 
        * function to santize html by allowing only whitelisted attributes
        * @param: htmlresponse
        * @returns: sanitize html response
        **/
        var  _sanitizeHTMLAttrForRichtext = function(htmlResponse){
            const dummyDiv = document.createElement("div");
            dummyDiv.id = "sanitizeDiv";
            document.body.appendChild(dummyDiv);
            dummyDiv.innerHTML = htmlResponse;
            const allowAttrList = _whitelistedAttributes || [];
            document.querySelector("#sanitizeDiv").querySelectorAll("*").forEach(function(element) {
                Object.values(element.attributes).forEach(function(attributeName){
                    if(!allowAttrList.includes(attributeName.name)){
                        element.removeAttribute(attributeName.name); //remove the atrributes not part of whiteListed attributes
                    }
                    
                });
            });
            const sanitizedString = dummyDiv.innerHTML;
            document.body.removeChild(dummyDiv);
            return sanitizedString;
        }
        return {
            getModifiedstatusForPending: _getModifiedstatusForPending,
            getMaskedAccName: _getMaskedAccName,
            getMaskedAccount: _getMaskedAccount,
            getCurrencyCode: _getCurrencyCode,
            getMaskedAccountNumber: _getMaskedAccountNumber,
            getAccountDisplayName: _getAccountDisplayName,
            getAccountDisplayNameNew: _getAccountDisplayNameNew,
            getAccountName: _getAccountName,
            getDisplayBalance: _getDisplayBalance,
            getLastFourDigit: _getLastFourDigit,
            getLastSixDigit: _getLastSixDigit,
            downloadFile: _downloadFile,
            ErrorHandler: ErrHandler,
            formatCurrencyWithCommas: _formatCurrencyWithCommas,
            getDisplayCurrencyFormat: _getDisplayCurrencyFormat,
            getConfiguration: _getConfiguration,
            Sorting: {
                getSortConfigObject: _getSortConfigObject,
                setSortingHandlers: _setSortingHandlers,
                updateSortFlex: _updateSortFlex
            },
            setText: _setText,
            centerPopupFlex: _centerPopupFlex,
            getaccessibilityConfig: _getaccessibilityConfig,
            getAccountDisplayNameWithBalance: _getAccountDisplayNameWithBalance,
            showProgressBar: _showProgressBar,
            hideProgressBar: _hideProgressBar,
            getFrontendDateString: _getFrontendDateString,
            getFrontendDateStringInUTC: _getFrontendDateStringInUTC,
            getBackendDateFormat: _getBackendDateFormat,
            getServerDate: _getServerDate,
            getServerDateObject: _getServerDateObject,
            getServerDateComponent: _getServerDateComponent,
            disableOldDaySelection: _disableOldDaySelection,
            changedataCase: _changedataCase,
            getDateAndTime: _getDateAndTime,
            getDateAndTimeInUTC: _getDateAndTimeInUTC,
            getDateAndTimeDST: _getDateAndTimeDST,
            toggleCheckBox: _toggleCheckbox,
            toggleFontCheckbox: _toggleFontCheckbox,
            isChecked: _isChecked,
            isFontIconChecked: _isFontIconChecked,
            sendDateToBackend: _sendDateToBackend,
            setCheckboxState: _setCheckboxState,
            setLblCheckboxState: _setLblCheckboxState,
            updateAppLevelConfiguration: _updateAppLevelConfiguration,
            updateUserLevelConfiguration: _updateUserLevelConfiguration,
            returnMonths: _returnMonths,
            isCSRMode: _isCSRMode,
            isSSOEnabled: _isSSOEnabled,
            isRadioBtnSelected: _isRadioBtnSelected,
            enableButton: _enableButton,
            mergeAccountNameNumber: _mergeAccountNameNumber,
            disableButton: _disableButton,
            showServerDownScreen: _showServerDownScreen,
            disableButtonActionForCSRMode: _disableButtonActionForCSRMode,
            disableButtonSkinForCSRMode: _disableButtonSkinForCSRMode,
            disableSegmentButtonSkinForCSRMode: _disableSegmentButtonSkinForCSRMode,
            isValidAmount: _isValidAmount,
            isValidAllAmount: _isValidAllAmount,
            isEmptyString: _isEmptyString,
            substituteforIncludeMethod: _substituteforIncludeMethod,
            getTimeDiferenceOfDate: _getTimeDiferenceOfDate,
            validateCurrency: _validateCurrency,
            getPrimaryContact: _getPrimaryContact,
            validateAmountFieldKeyPress: _validateAmountFieldKeyPress,
            removeDelimitersForAmount: _removeDelimitersForAmount,
            validateAndFormatAmount: _validateAndFormatAmount,
            bindEventsForAmountField: _bindEventsForAmountField,
            deFormatAmount: _deFormatAmount,
            blockFutureDate: _blockFutureDate,
            accountNumberMask: _getMaskedAccountNumber,
            enableCopy: _enableCopy,
            getFullName: _getFullName,
            getUserNamePolicies: _getUserNamePolicies,
            getPasswordPolicies: _getPasswordPolicies,
            isValidDOB: _isValidDOB,
            debounce: _debounce,
            isPrintEnabled: _isPrintEnabled,
            getFullNameInCurrentLocale: _getFullNameInCurrentLocale,
            getFloatValueOfCurrency: _getFloatValueOfCurrency,
            cloneJSON: _cloneJSON,
            isEmptyObject: _isEmptyObject,
            getDateFromCalendarInBackendSupportedFormat: _getDateFromCalendarInBackendSupportedFormat,
            truncateStringWithGivenLength: _truncateStringWithGivenLength,
            setApprovalRules: _setApprovalRules,
            getApprovalRules: _getApprovalRules,
            getApprovalRuleDescription: _getApprovalRuleDescription,
            validateSearchString: _validateSearchString,
            getFormatedDateString: _getFormatedDateString,
            getListBoxSelectedKeyFromMasterData: _getListBoxSelectedKeyFromMasterData,
            updateAmountValue: _updateAmountValue,
            clearKeypadChar: _clearKeypadChar,
            setKeypadChar: _setKeypadChar,
            updateAmountValueWOD: _updateAmountValueWOD,
            getID: _getID,
            setA11yFoucsHandlers: _setA11yFoucsHandlers,
            getMonthFormattedDate: _getMonthFormattedDate,
            clearKeypadCharWOD: _clearKeypadCharWOD,
            setKeypadCharWOD: _setKeypadCharWOD,
            sortAndSearchJSON: _sortAndSearchJSON,
            CLIENT_PROPERTIES: {},
            isSCAEnabled: _isSCAEnabled,
            getSCAType: _SCAType,
            getSCAHIDOTPType: _SCAHIDOTPType,
            getSCAPINLength: _SCAPinLength,
            getObjectFromPath: _getObjectFromPath,
            isMirrorLayoutEnabled: _isMirrorLayoutEnabled,
            updateObjectFromPath: _updateObjectFromPath,
            getServerDate: _getServerDate,
            setFooterButtonToolTips: _setFooterButtonToolTips,
            getOrdinalNumeral: _getOrdinalNumeral,
            downloadGeneratedFile: _downloadGeneratedFile,
            downloadAttachment: _downloadAttachment,
            touchEndList: touchEndList,
		    addToListner: _addToListner,
		    hideAllPopups: _hideAllPopups,
		    clearList: _clearList,
            downloadMultipleAttachments: _downloadMultipleAttachments,
            whitelistedAttributes: _whitelistedAttributes,
            sanitizeHTMLAttrForRichtext: _sanitizeHTMLAttrForRichtext
        };

    }

);
