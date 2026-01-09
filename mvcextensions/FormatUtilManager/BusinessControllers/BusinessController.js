/**
  *@module FormatUtilManager
  */
define(['OLBConstants','CommonUtilities'], function (OLBConstants,CommonUtilities) {
	/**
   * FormatUtilManager is a utility class which provides the APIs for formating (viz. date time calendar)
   *@alias module:FormatUtilManager
   *@class
   */
  function FormatUtilManager() {
    /**@member {string} BACKEND_DATE_TIME_FORMAT used for formating Backend Date Time*/
    this.BACKEND_DATE_TIME_FORMAT = "Y-m-d H:i:s";
    /**@member {string} BACKEND_DATE_FORMAT used for formating Backedn Date*/
    this.BACKEND_DATE_FORMAT = "Y-m-d";
    /**@member {string} APPLICATION_DATE_TIME_FORMAT used for formating Application Date Time*/
    this.APPLICATION_DATE_TIME_FORMAT = "m/d/Y, g:i A";
    /**@member {string} APPLICATION_DATE_FORMAT used for formating Application Date*/
    this.APPLICATION_DATE_FORMAT = "m/d/Y";
    /**@member {string} APPLICATION_TIME_FORMAT used for formating Application Time*/
    this.APPLICATION_TIME_FORMAT = "g:i A";
    
    this.DBP_DATE_FORMAT = "yyyy-MM-dd HH:mm:ss.SSS";
    
    
    /**
      * Helper function and property on Date class
      * @member of  FormatUtilManager and Date
      * @param {String} format - date in required format
      * @returns {String} - formated date string
      */
    Date.prototype.format = function (format) {
      var date = this;
      return format.replace(/(\\?)(.)/g, function (_, esc, chr) {
        return esc === "" && Date.replaceChars[chr] ? Date.replaceChars[chr].call(date) : chr
      })
    }
    /**@member {OBJECT}  contains all different types of calender notations*/
    Date.replaceChars = {
      shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      longMonths: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      longDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      longMonthsUpperCase: ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'],
      d: function () {
        return (this.getDate() < 10 ? "0" : "") + this.getDate();
      },
      D: function () {
        return Date.replaceChars.shortDays[this.getDay()];
      },
      j: function () {
        return this.getDate();
      },
      l: function () {
        return Date.replaceChars.longDays[this.getDay()];
      },
      N: function () {
        return this.getDay() === 0 ? 7 : this.getDay();
      },
      S: function () {
        return this.getDate() % 10 == 1 && this.getDate() != 11 ? "st" : this.getDate() % 10 == 2 && this.getDate() != 12 ? "nd" : this.getDate() % 10 == 3 && this.getDate() != 13 ? "rd" : "th";
      },
      w: function () {
        return this.getDay();
      },
      z: function () {
        var d = new Date(this.getFullYear(), 0, 1);
        return Math.ceil((this - d) / 864e5);
      },
      W: function () {
        var target = new Date(this.valueOf());
        var dayNr = (this.getDay() + 6) % 7;
        target.setDate(target.getDate() - dayNr + 3);
        var firstThursday = target.valueOf();
        target.setMonth(0, 1);
        if (target.getDay() !== 4) {
          target.setMonth(0, 1 + (4 - target.getDay() + 7) % 7);
        }
        return 1 + Math.ceil((firstThursday - target) / 6048e5);
      },
      F: function () {
        return Date.replaceChars.longMonths[this.getMonth()];
      },
      m: function () {
        return (this.getMonth() < 9 ? "0" : "") + (this.getMonth() + 1);
      },
      M: function () {
        return Date.replaceChars.shortMonths[this.getMonth()];
      },
      n: function () {
        return this.getMonth() + 1;
      },
      t: function () {
        var d = new Date();
        return new Date(d.getFullYear(), d.getMonth(), 0).getDate();
      },
      L: function () {
        var year = this.getFullYear();
        return year % 400 === 0 || year % 100 !== 0 && year % 4 === 0;
      },
      o: function () {
        var d = new Date(this.valueOf());
        d.setDate(d.getDate() - (this.getDay() + 6) % 7 + 3);
        return d.getFullYear();
      },
      Y: function () {
        return this.getFullYear();
      },
      y: function () {
        return ("" + this.getFullYear()).substr(2);
      },
      a: function () {
        return this.getHours() < 12 ? "am" : "pm";
      },
      A: function () {
        return this.getHours() < 12 ? "AM" : "PM";
      },
      B: function () {
        return Math.floor(((this.getUTCHours() + 1) % 24 + this.getUTCMinutes() / 60 + this.getUTCSeconds() / 3600) * 1e3 / 24);
      },
      g: function () {
        return this.getHours() % 12 || 12;
      },
      G: function () {
        return this.getHours();
      },
      h: function () {
        return ((this.getHours() % 12 || 12) < 10 ? "0" : "") + (this.getHours() % 12 || 12);
      },
      H: function () {
        return (this.getHours() < 10 ? "0" : "") + this.getHours();
      },
      i: function () {
        return (this.getMinutes() < 10 ? "0" : "") + this.getMinutes();
      },
      s: function () {
        return (this.getSeconds() < 10 ? "0" : "") + this.getSeconds();
      },
      u: function () {
        var m = this.getMilliseconds();
        return (m < 10 ? "00" : m < 100 ? "0" : "") + m;
      },
      e: function () {
        return "Not Yet Supported";
      },
      I: function () {
        var DST = null;
        for (var i = 0; i < 12; ++i) {
          var d = new Date(this.getFullYear(), i, 1);
          var offset = d.getTimezoneOffset();
          if (DST === null)
            DST = offset;
          else if (offset < DST) {
            DST = offset;
            break;
          } else if (offset > DST)
            break;
        }
        return this.getTimezoneOffset() == DST | 0;
      },
      O: function () {
        return (-this.getTimezoneOffset() < 0 ? "-" : "+") + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? "0" : "") + Math.abs(this.getTimezoneOffset() / 60) + "00";
      },
      P: function () {
        return (-this.getTimezoneOffset() < 0 ? "-" : "+") + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? "0" : "") + Math.abs(this.getTimezoneOffset() / 60) + ":00";
      },
      T: function () {
        return this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/, "$1");
      },
      Z: function () {
        return -this.getTimezoneOffset() * 60;
      },
      c: function () {
        return this.format("Y-m-d\\TH:i:sP");
      },
      r: function () {
        return this.toString();
      },
      U: function () {
        return this.getTime() / 1e3;
      },
      Q: function () {
        return Date.replaceChars.longMonthsUpperCase[this.getMonth()];
      }
    }
  };
  inheritsFrom(FormatUtilManager, kony.mvc.Business.Delegator);
  FormatUtilManager.prototype.initializeBusinessController = function () { };
  /**
    * Returns application date  and time format string
    * @returns {String} - application date time format
    */
  FormatUtilManager.prototype.getApplicationDateTimeFormat = function () {
    var configurationManager = applicationManager.getConfigurationManager();
    return (configurationManager.getDateFormat() == null) ? this.APPLICATION_DATE_TIME_FORMAT : configurationManager.getDateFormat() + ", " + this.APPLICATION_TIME_FORMAT;
  };
  /**
    * Returns backend date and time format string
    * @returns {String} - backend date time format
    */
  FormatUtilManager.prototype.getBackendDateTimeFormat = function () {
    return this.BACKEND_DATE_TIME_FORMAT;
  };
  /**
    * Returns application date format string
    * @returns {String} - application date format
    */
  FormatUtilManager.prototype.getApplicationDateFormat = function () {
    var configurationManager = applicationManager.getConfigurationManager();
    return (configurationManager.getDateFormat() == null) ? this.APPLICATION_DATE_FORMAT : configurationManager.getDateFormat();
  };
  /**
    * Returns backend date format string
    * @returns {String} - backend date format
    */
  FormatUtilManager.prototype.getBackendDateFormat = function () {
    return this.BACKEND_DATE_FORMAT;
  };
  /**
    * Returns application time format string
    * @returns {String} - application time format
    */
  FormatUtilManager.prototype.getApplicationTimeFormat = function () {
    return this.Application_TIME_FORMAT;
  };
  /**
    * Helper function and property on Date class
    * @param {Date} dateObj - a date object to format
    * @param {String} formatString - required formatString
    * @returns {String} - formated date string
    */
  FormatUtilManager.prototype.getFormatedDateString = function (dateObj, formatString) {
    var configurationManager = applicationManager.getConfigurationManager();
    if (configurationManager.getUTCDateFormattingFlag() === true) {
      if (dateObj) return dateObj.format(formatString);
      return "";
    }
    return dateObj;
  };
  /**
  * Helper function to get the date format required to set to kony cal widget.
  */
  FormatUtilManager.prototype.getDateFormat = function () {
    var configurationManager = applicationManager.getConfigurationManager();
    var dateFormat = (configurationManager.getDateFormat() === null) ? this.APPLICATION_DATE_FORMAT : configurationManager.getDateFormat();
    var result = "";
    function getValue(text) {
      if (text == "m") {
        return "MM";
      } else if (text == "d") {
        return "dd";
      } else if (text == "y") {
        return "yy";
      } else if (text == "Y") {
        return "yyyy";
      }
    };
    result = getValue(dateFormat[0]) + dateFormat[1] + getValue(dateFormat[2]) + dateFormat[3] + getValue(dateFormat[4]);
    return result;
  };
  FormatUtilManager.prototype.getFormattedCalendarDate = function (date) {
    var forUtility = applicationManager.getFormatUtilManager();
    if (!kony.sdk.isNullOrUndefined(date)) {
      var selDate = new Date(date);
      return forUtility.getFormatedDateString(selDate, forUtility.getApplicationDateFormat());
    }
    return date;
  };
  // date format function
  FormatUtilManager.prototype.getFormattedSelectedDate = function (selDate) {
    var date = selDate.getDate() < 10 ? "0" + selDate.getDate() : selDate.getDate();
    var month = (selDate.getMonth() + 1) < 10 ? "0" + (selDate.getMonth() + 1) : (selDate.getMonth() + 1);
    var year = selDate.getFullYear();
    return month + "/" + date + "/" + year;
  };


    /**
     * [Zypher] Kony-compatible utility to format any date type into MM/YY (Card Expiry Format)
     * For instance 2025-12-31 to 12/25
     */
    FormatUtilManager.prototype.formatCardDate = function(cardDate) {
        if (!cardDate) return "";
        var dateObj = new Date(cardDate);
        if (kony.sdk.isNullOrUndefined(dateObj)) return "";
        var mm = ("0" + (dateObj.getMonth() + 1)).slice(-2);
        var yy = dateObj.getFullYear().toString().slice(-2);
        return mm + "/" + yy;
    };

    /**
     * [Zypher] utility method to format any date type into MMYY (Card Expiry Format)
     * For instance 2025-01-12 into 0125
     */
    FormatUtilManager.prototype.cardExpireDateFormat = function(cardDate) {
        if (!cardDate) return "";
        var date = new Date(expireDate);
        var newDate= ("0" + (date.getMonth() + 1)).slice(-2) + date.getFullYear().toString().substring(2);
        return newDate;
    };

  FormatUtilManager.prototype.getDMYFormattedSelectedDate = function (selDate) {
    if (!kony.sdk.isNullOrUndefined(selDate)) {
        var date = selDate.getDate() < 10 ? "0" + selDate.getDate() : selDate.getDate();
        var month = (selDate.getMonth() + 1) < 10 ? "0" + (selDate.getMonth() + 1) : (selDate.getMonth() + 1);
        var year = selDate.getFullYear();    
        var dateFormat = applicationManager.getConfigurationManager().getDateFormatCP();
        if(dateFormat === "dmy")        
            return date + "/" + month + "/" + year;
        else
            return month + "/" + date + "/" + year;
    }
	return "";
  };

  // [Trixon] Custom Date formating for User Display
  FormatUtilManager.prototype.formatDateForDisplay = function(inputDate){
        const dateObj = new Date(inputDate);
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = dateObj.getFullYear();
        const hours = String(dateObj.getHours()).padStart(2, '0');
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
        const seconds = String(dateObj.getSeconds()).padStart(2, '0');
        return formattedDate = `${day}/${month}/${year}, T ${hours}:${minutes}:${seconds}`;
  };
  // [Trixon] End

  FormatUtilManager.prototype.getLocaleDateFormat = function () {
    var dummy = 'MM/DD/YYYY';
    var locale = kony.i18n.getCurrentLocale();
    locale = locale.toLowerCase();
    locale = locale.replace("_", "-");
    if (this.selectedDate === '') {

    // [Trixon] Configured single date format for all languages supported    
    //   if (locale == "en-us" || locale == "en") {
    //     dummy = 'MM/DD/YYYY';
    //   }
    //   else if (locale == "en-gb" || locale === "fr-fr" || locale == "es-es") {
        dummy = 'DD/MM/YYYY';
    //   }
    //   else if (locale == "de-de") {
    //     dummy = 'DD.MM.YYYY';
    //   }
    //   else if (locale == "sv-se") {
    //     dummy = 'YYYY-DD-MM';
    //   }
    // [Trixon] Ended
    }
    return dummy;
  };
  FormatUtilManager.prototype.getDateObjectFromCalendarString = function (dateString, format) {
    try {
      var configurationManager = applicationManager.getConfigurationManager();
      var finalDateTime = null;
      if (dateString) {
        var formattype = format.toUpperCase();
        var yyyyIndex = formattype.indexOf("YYYY");
        var mmIndex = formattype.indexOf("MM");
        var ddIndex = formattype.indexOf("DD");
        var hhIndex = formattype.indexOf("HH");
        var minIndex = formattype.indexOf("MM", mmIndex + 1);
        var ssIndex = formattype.indexOf("SS");
        if (yyyyIndex > -1 && mmIndex > -1 && ddIndex > -1) {
          var newdd = parseInt(dateString.substr(ddIndex, 2), 10);
          var newmm = parseInt(dateString.substr(mmIndex, 2), 10);
          var newyyyy = parseInt(dateString.substr(yyyyIndex, 4), 10);
          if (newdd && (0 < newdd && newdd <= 31) && (newmm && (0 < newmm && newmm <= 12)) && (newyyyy && 0 <= newyyyy)) {
            finalDateTime = new Date(newyyyy, newmm - 1, newdd);
            //finalDateTime = new Date(Date.UTC(newyyyy, newmm - 1, newdd, 0, 0, 0, 0));
          }
          var newTime = hhIndex > -1 ? dateString.substr(hhIndex, 2) : null;
          newTime = newTime ? parseInt(newTime, 10) : null;
          if (newTime && newTime < 24) {
            finalDateTime = finalDateTime ? finalDateTime.setHours(newTime, 0, 0) : null;
            finalDateTime = new Date(finalDateTime);
          }
          var newmin = minIndex > -1 ? dateString.substr(minIndex, 2) : null;
          newmin = newmin ? parseInt(newmin, 10) : null;
          if (newmin) {
            finalDateTime = finalDateTime ? finalDateTime.setMinutes(newmin) : null;
            finalDateTime = new Date(finalDateTime);
          }
          var newss = ssIndex > -1 ? dateString.substr(ssIndex, 4) : null;
          newss = newss ? parseInt(newss, 10) : null;
          if (newss) {
            finalDateTime = finalDateTime ? finalDateTime.setSeconds(newss) : null;
            finalDateTime = new Date(finalDateTime);
          }
        }
        var formatUtilManager = applicationManager.getFormatUtilManager();
        dateString = finalDateTime.toString();
        if (dateString.lastIndexOf(':') != -1) {
          dateString = dateString.substring(0, dateString.lastIndexOf(':') + 3);
        }
        //finalDateTime = formatUtilManager.convertDateToCurrentTimeZone(dateString);
        return finalDateTime;
      }
    } catch (err) {
      kony.print("Error in ISO date formatting -->" + err);
    }
  };
  /**
    * returns date object from given date string
    * @param {String} dateString - a date string
    * @param {String} format - format of date
    * @returns {Date} - date object
    */
  FormatUtilManager.prototype.getDateObjectfromString = function (dateString, format) {
    try {
      var configurationManager = applicationManager.getConfigurationManager();
      if (configurationManager.getUTCDateFormattingFlag() === true) {
        var finalDateTime = null;
        if (dateString) {
          dateString = dateString.replace(" ", "T"); //Fix for iphone
          var formatUTC = "YYYY-MM-DDThh:mm:ss.SSSZ";//ISO date time format
          var formattype = formatUTC.toUpperCase();
          var yyyyIndex = formattype.indexOf("YYYY");
          var mmIndex = formattype.indexOf("MM");
          var ddIndex = formattype.indexOf("DD");
          var hhIndex = formattype.indexOf("HH");
          var minIndex = formattype.indexOf("MM", mmIndex + 1);
          var ssIndex = formattype.indexOf("SS");
          if (yyyyIndex > -1 && mmIndex > -1 && ddIndex > -1) {
            var date = new Date(dateString);
            var newdd = date.getDate();//parseInt(dateString.substr(ddIndex, 2), 10);
            var newmm = date.getMonth();//parseInt(dateString.substr(mmIndex, 2), 10);
            var newyyyy = date.getFullYear();//parseInt(dateString.substr(yyyyIndex, 4), 10);
            if (newdd && (0 < newdd && newdd <= 31) && ((newmm + 1) && (0 < (newmm + 1) && (newmm + 1) <= 12)) && (newyyyy && 0 <= newyyyy)) {
              finalDateTime = new Date();
              finalDateTime.setYear(newyyyy);
              finalDateTime.setMonth(newmm, 1);
              finalDateTime.setDate(newdd);
              //finalDateTime = new Date(Date.UTC(newyyyy, newmm - 1, newdd, 0, 0, 0, 0));
            }
            var newTime = hhIndex > -1 ? dateString.substr(hhIndex, 2) : null;
            newTime = newTime ? parseInt(newTime, 10) : null;
            if (newTime && newTime < 24) {
              finalDateTime = finalDateTime ? finalDateTime.setHours(date.getHours(), 0, 0) : null;
              finalDateTime = new Date(finalDateTime);
            }
            var newmin = minIndex > -1 ? dateString.substr(minIndex, 2) : null;
            newmin = newmin ? parseInt(newmin, 10) : null;
            if (newmin) {
              finalDateTime = finalDateTime ? finalDateTime.setMinutes(date.getMinutes()) : null;
              finalDateTime = new Date(finalDateTime);
            }
            var newss = ssIndex > -1 ? dateString.substr(ssIndex, 4) : null;
            newss = newss ? parseInt(newss, 10) : null;
            if (newss) {
              finalDateTime = finalDateTime ? finalDateTime.setSeconds(date.getSeconds()) : null;
              finalDateTime = new Date(finalDateTime);
            }
          }
        }
        var formatUtilManager = applicationManager.getFormatUtilManager();
        dateString = finalDateTime.toString();
        if (dateString.lastIndexOf(':') != -1) {
          dateString = dateString.substring(0, dateString.lastIndexOf(':') + 3);
        }
        //finalDateTime = formatUtilManager.convertDateToCurrentTimeZone(dateString);
        return finalDateTime;
      } else {
        return dateString;//Date string is passed as is in case date received is not in utc format
      }
    } catch (err) {
      kony.print("Error in ISO date formatting -->" + err);
    }
  };
  /**
    * Formats given amount
    * @param {String} amount - amount string to format
    * @returns {String} - formated amount with seperator
    */
  FormatUtilManager.prototype.formatAmount = function (amount) {
    var scope = this;
    var num, flag = false;
    if (amount === null || amount === undefined || isNaN(amount)) {
      return;
    }
    amount = Number(amount).toFixed(2);
    var configurationManager = applicationManager.getConfigurationManager();
    var locale = configurationManager.getLocale().split("_").join("-");    
    var group = this.defaultValueForGroup(locale);
    var decimal = this.getDecimalSeparator(locale);
//     if (configurationManager.getDeploymentGeography() === "EUROPE"){
//       group = ".";
//       decimal = ",";
//     }
    if (amount.indexOf(".") != -1 || amount.indexOf(",") != -1) {
      if (amount.indexOf(".") != -1) {
        amount = amount.replace(".", decimal);
      }
      else if (amount.indexOf(",") != -1) {
        amount = amount.replace(",", decimal);
      }
      num = amount.split(decimal)[0];
      var dec = amount.split(decimal)[1];
      if (num.indexOf("-") != -1) {
        num = num.split("-")[1];
        flag = true;
      }
      if (num.length > 3) {
        for (var i = num.length - 1; i >= 0;) {
          if (i >= 3) {
            num = num.substring(0, i - 2) + group + num.substring(i - 2, num.length);
          }
          i = i - 3;
        }
      }
      if (flag === true) {
        return "-" + num + decimal + dec;
      }
      return num + decimal + dec;
    }
    else {
      return amount;
    }
  };
  /**
    * Extract the currency symbol
    * @param {String} currencySymbolCode - indicates the currency symbol code
    * @returns {String} - returns the currency symbol
    */
  FormatUtilManager.prototype.getCurrencySymbol = function (currencySymbolCode) {
    var configurationManager = applicationManager.getConfigurationManager();
    if (currencySymbolCode && !configurationManager.getBackEndCurencySymbolFlag()) {
      if (configurationManager.currencyCode[currencySymbolCode]) {
        return configurationManager.currencyCode[currencySymbolCode];
      }
      else {
        return currencySymbolCode;
      }
    } else {
      return configurationManager.getCurrencyCode();
    }
  }
  /**
    * Extract the currency symbol Code
    * @param {String} currencySymbol - indicates the currency symbol
    * @returns {String} - returns the currency symbol
    */
  FormatUtilManager.prototype.getCurrencySymbolCode = function (currencySymbol) {
    var configurationManager = applicationManager.getConfigurationManager();
    if (currencySymbol && !configurationManager.getBackEndCurencySymbolFlag()) {
      var data = configurationManager.currencyCode;
      for (key in data) {
        if (data[key] === currencySymbol)
          return key;
      }
    }
    else return currencySymbol;
  }
  /**
    * Formats and appends currency symbol to given amount
    * @param {String} amount - amount string to format
    * @param {String} currencySymbolCode - indicates the currency symbol code
    * @returns {String} - formated and currency symbol appended
    */
  FormatUtilManager.prototype.formatAmountandAppendCurrencySymbol = function (amount, currencySymbolCode) {
    if (kony.sdk.isNullOrUndefined(amount)) {
      amount = "0.00";
    }
    var formatedAmount = this.formatAmount(amount);
    var currencySymbol = this.getCurrencySymbol(currencySymbolCode);
    return formatedAmount[0] === '-' ? ('-' + currencySymbol + formatedAmount.split('-')[1]) : currencySymbol + formatedAmount;
  };
  /**
    * Appends the currency symbol to the amount
    * @member of  FormatUtilManager
    * @param {String} amount - amount string to format
    * @param {String} currencySymbolCode - indicates the currency symbol code
    * @returns {String} - amount with appended currency code
    */
  FormatUtilManager.prototype.appendCurrencySymbol = function (amount, currencySymbolCode) {
    var configurationManager = applicationManager.getConfigurationManager();
    var currencySymbol = this.getCurrencySymbol(currencySymbolCode);
    return amount[0] === '-' ? ('-' + currencySymbol + amount.split('-')[1]) : currencySymbol + amount;
  };
  /**
    * Returns date and time stamp
    * @returns {String} - timeStamp for current date and time
    */
  FormatUtilManager.prototype.getTimeStamp = function () {
    return new Date().format(this.APPLICATION_DATE_TIME_FORMAT);
  };
  /**
    * Returns list of uppercasemonths with give
    * @param {String} - year(optional -> if not given it will consider current year)
    * @returns {String} - list of months with appended years
    */
  FormatUtilManager.prototype.getYearAppendedPreviousMonths = function (year) {
    var date = new Date();
    var longMonthsUpperCase = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
    var m = 12;
    if (year == null || year == undefined || year == date.getFullYear()) m = date.getMonth();
    var y = year || date.getFullYear();
    if (y > date.getFullYear()) m = 0;
    for (i = 0; i < m; i++) {
      longMonthsUpperCase[i] = longMonthsUpperCase[i] + " " + y;
    }
    return longMonthsUpperCase.slice(0, m);
  };
  /**
    * Return weather given date is todays date or not
    * @param {Object} dateObj -  input date object.
    * @returns {boolean} - true if if the input date is today's date
    */
  FormatUtilManager.prototype.isTodayDate = function (dateObj) {
    var today = new Date();
    if (today.getDate() === dateObj.getDate() && today.getMonth() === dateObj.getMonth() && today.getFullYear() === dateObj.getFullYear()) {
      return true;
    }
    return false;
  };
  /**
    * Return date object with date set as noOfDays before the current date
    * @param {Number} noOfDays -  Number of days.
    * @returns {Object} -
    */
  FormatUtilManager.prototype.getPreviousDate = function (noOfDays) {
    var date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() - noOfDays);
  };
  /**
    * De-Formats given amount with or without given seperator
    * @param {String} amountStr - Already formated amount
    * @param {String} currencyArray - Array of currency symbols (This should only be added in case of deformating amount with currency symbol other than the default currency code).
    * @returns {String} - deformated amount
    */
  FormatUtilManager.prototype.deFormatAmount = function (amountStr, currencyArray) {
    var scope = this;
    amountStr = "" + amountStr;
    var configurationManager = applicationManager.getConfigurationManager();
    if (amountStr) {
      var  isAlreadyDeformatted  =  (/^(\-|)\d+(?:\.\d{1,2})?$/g).test(amountStr);
      if (!isAlreadyDeformatted) {
        if (currencyArray) {
          var element;
          if (amountStr.split("").some(function(r){
            element = r;
            return currencyArray.indexOf(r) >= 0
          })) {
              amountStr = amountStr.split(element).join("").trim();
          }
        }
        else {
          if (amountStr.indexOf(configurationManager.getCurrencyCode()) !== -1) {
            amountStr = amountStr.split(configurationManager.getCurrencyCode()).join("").trim();
          }
        }
        var locale = configurationManager.getLocale().split("_").join("-");       //var group = new Intl.NumberFormat(locale).format(1111).replace(/1/g, '');
        var group = this.defaultValueForGroup(locale);
        var decimal = this.getDecimalSeparator(locale);
//         if (configurationManager.getDeploymentGeography() === "EUROPE") {
//           group = ".";
//           decimal = ",";
//         }
        var reversedVal = amountStr.replace(new RegExp('\\' + group, 'g'), '');
        reversedVal = reversedVal.replace(new RegExp('\\' + decimal, 'g'), '.');
        return isNaN(reversedVal) ? "" : reversedVal;
      } else {
        return amountStr;
      }
    }
  };
  /**
    * De-Formats given amount with or without given seperator and without decimal precision
    * @param {String} amountStr - Already formated amount
    * @param {String} sep - if any is used other than default seperator (default  is ',')
    * @returns {String} - deformated amount
    */
   FormatUtilManager.prototype.deFormatAmountWithoutPrecision = function (amountStr, currencyArray) {
    var scope = this;
    amountStr = "" + amountStr;
    var configurationManager = applicationManager.getConfigurationManager();
    if (amountStr) {
      var  isAlreadyDeformatted  =  (/^(\-|)\d+?$/g).test(amountStr);
      if (!isAlreadyDeformatted) {
        if (currencyArray) {
          var element;
          if (amountStr.split("").some(function(r){
            element = r;
            return currencyArray.indexOf(r) >= 0
          })) {
              amountStr = amountStr.split(element).join("").trim();
          }
        }
        else {
          if (amountStr.indexOf(configurationManager.getCurrencyCode()) !== -1) {
            amountStr = amountStr.split(configurationManager.getCurrencyCode()).join("").trim();
          }
        }
        var locale = configurationManager.getLocale().split("_").join("-");
        // locale = locale.includes("_") ? locale.split("_").join("-") : locale;
        //var group = new Intl.NumberFormat(locale).format(1111).replace(/1/g, '');
        var group = this.defaultValueForGroup(locale);
        var decimal = this.getDecimalSeparator(locale);
//         if (configurationManager.getDeploymentGeography() === "EUROPE") {
//           group = ".";
//           decimal = ",";
//         }
        var reversedVal = amountStr.replace(new RegExp('\\' + group, 'g'), '');
        reversedVal = reversedVal.split(decimal)[0];
        return isNaN(reversedVal) ? "" : reversedVal;
      } else {
        return amountStr;
      }
    }
  };
  /**
     * Get Decimal Seperator based on locale
     * @returns {String} - decimal separator
     */
  FormatUtilManager.prototype.getDecimalSeparator = function (locale) {
    // [Trixon] Configured single (.) separator for floating numbers formating
    return ".";
    // if (locale == "en-US")
    //   return ".";
    // else if (locale == "en-ES")
    //   return ".";
    // else if (locale == "de-DE")
    //   return ",";
    // else if (locale == "en")
    //   return ".";
    // else if (locale == "en-GB")
    //   return ".";
    // else if (locale == "fr-FR")
    //   return ",";
    // else if (locale == "es-ES")
    //   return ",";
    // else
    //   return ".";
    // [Trixon] Ended  
  };
	/**
	 * Get group Seperator based on locale
	 * @returns {String} - group separator
	 */
  FormatUtilManager.prototype.defaultValueForGroup = function (locale) {
    // [Trixon] Configured single (,) separator for floating numbers group separator formating
    return ",";
    // if (locale == "en-US")
    //   return ",";
    // else if (locale == "en-ES")
    //   return ",";
    // else if (locale == "de-DE")
    //   return ".";
    // else if (locale == "en")
    //   return ",";
    // else if (locale == "en-GB")
    //   return ",";
    // else if (locale == "fr-FR")
    //   return " ";
    // else if (locale == "es-ES")
    //   return "."
    // else
    //   return ",";
    // [Trixon] Ended
  }
  /**
    * De-Formats and provides absolute value of given amount with or without given seperator
    * @param {String} amountStr - Already formated amount
    * @param {String} sep - if any is used other than default seperator (default  is ',')
    * @returns {String} - deformated and absolute value
    */
  FormatUtilManager.prototype.deFormatAbsoluteAmount = function (amountStr, sep) {
    var configurationManager = applicationManager.getConfigurationManager();
    if (sep == ".") sep = "\.";
    return amountStr.replace(configurationManager.getCurrencyCode(), "").replace((new RegExp(sep || ",", "g")), "").replace("-", "");
  };
  /**
    * Function to Find difference between current date and a date
    * @param {Date} date format is yyyymmddhhmmss
  */
  FormatUtilManager.prototype.getTimeDiferenceOfDate = function (date) {
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
      }
      else {
        timeDiff = "years";
      }
      return Math.floor(yearDiff) + " " + timeDiff + " ago";
    }
    else if (Math.floor(monthDiff) > 0) {
      if (Math.floor(monthDiff) == 1) {
        timeDiff = "month";
      }
      else {
        timeDiff = "months";
      }
      return Math.floor(monthDiff) + " " + timeDiff + " ago";
    }
    else if (Math.floor(daysDiff) > 0) {
      if (Math.floor(daysDiff) == 1) {
        timeDiff = "day";
      }
      else {
        timeDiff = "days";
      }
      return Math.floor(daysDiff) + " " + timeDiff + " ago";
    }
    else if (Math.floor(hoursDiff) > 0) {
      if (Math.floor(hoursDiff) == 1) {
        timeDiff = "hour";
      }
      else {
        timeDiff = "hours";
      }
      return Math.floor(hoursDiff) + " " + timeDiff + " ago";
    }
    else if (Math.floor(minutesDiff) > 0) {
      if (Math.floor(minutesDiff) == 1) {
        timeDiff = "minute";
      }
      else {
        timeDiff = "minutes";
      }
      return Math.floor(minutesDiff) + " " + timeDiff + " ago";
    }
    else if (Math.floor(secondsDiff) > 0) {
      if (Math.floor(secondsDiff) == 1) {
        timeDiff = "second";
      }
      else {
        timeDiff = "seconds";
      }
      return Math.floor(secondsDiff) + " " + timeDiff + " " + " ago";
    }
    return timeDiff;
  };
  FormatUtilManager.prototype.convertDateToCurrentTimeZone = function (dateString) {
    var finalDateString = dateString.split(".")[0].replace(/-/g, "/");
    //var configManager = applicationManager.getConfigurationManager();
    //var dtString = finalDateString+" "+configManager.getServerTimeZone();
    var currTimeZoneDate = new Date(finalDateString);
    return currTimeZoneDate;
  };
  /**
  * Formats and provides the IBAN
  * @param {String} IBAN - unformatted string
  * @returns {String} - Formatted IBAN
  */
  FormatUtilManager.prototype.formatIBAN = function (IBAN) {
    var strippedString = IBAN.replace(/\s/g, '');
    strippedString = strippedString.replace(/ /g, '').replace(/(.{4})/g, '$1 ').trim();
    return strippedString;
  };
	/**
  * Deformats and provides the IBAN
  * @param {String} IBAN - formatted string
  * @returns {String} - deformatted IBAN
  */
  FormatUtilManager.prototype.deFormatIBAN = function (IBAN) {
    return IBAN.split(' ').join('');
  };
	/**
  * Correctly sets the month and day before converting to Backend Date Format
  * @param {String} dob - date of birth in Locale Format
  * @returns {String} - date of birth in m/d/Y format
  */
  FormatUtilManager.prototype.getDateForFormatting = function (dob) {
    var locale = kony.i18n.getCurrentLocale();
    var mm, yyyy, dd;
    var dobArray = dob.split('/');

    // [Trixon] Configured single Date Formating type for all languages supported
    mm = dobArray[0]
    dd = dobArray[1];
    yyyy = dobArray[2];
    return dd + '/' + mm  + '/' + yyyy;
    // if (locale == "en_US" || locale == "en") {
    //   mm = dobArray[0]
    //   dd = dobArray[1];
    //   yyyy = dobArray[2];
    // } else if (locale == "en_GB" || locale === "fr_FR" || locale === "es_ES" || locale === "ar_AE") {
    //   mm = dobArray[1]
    //   dd = dobArray[0];
    //   yyyy = dobArray[2];
    // } else if (locale == "de_DE") {
    //   mm = dobArray[1]
    //   dd = dobArray[0];
    //   yyyy = dobArray[2];
    // } else if (locale == "sv_SE") {
    //   mm = dobArray[2]
    //   dd = dobArray[1];
    //   yyyy = dobArray[0];
    // }
    // else if (locale == "ar_AE") {
    //   mm = dobArray[1]
    //   dd = dobArray[0];
    //   yyyy = dobArray[2];
    //   if(kony.os.deviceInfo().name==="iphone"){
    //     mm = dobArray[0]
    //     dd = dobArray[1];
    //     yyyy = dobArray[2];
    //     return dd + '/' + mm + '/' + yyyy; 
    //   }
    // }
    // return mm + '/' + dd + '/' + yyyy;
    // [Trixon] Ended
  };
  /**
 * Converts the date into UTC Format
 * @param {String} date - date in string
 * @returns {String} - formatted Date
 */
  FormatUtilManager.prototype.convertToUTC = function (dateString) {
    var format = "mm-dd-yyyy";
    var formattype = format.toUpperCase();
    var yyyyIndex = formattype.indexOf("YYYY");
    var mmIndex = formattype.indexOf("MM");
    var ddIndex = formattype.indexOf("DD");
    var newdd = parseInt(dateString.substr(ddIndex, 2), 10);
    var newmm = parseInt(dateString.substr(mmIndex, 2), 10);
    var newyyyy = parseInt(dateString.substr(yyyyIndex, 4), 10);
    var dateToConvert = new Date(newyyyy, newmm - 1, newdd);
    var todayDate = new Date();
    dateToConvert.setHours(todayDate.getHours());
    dateToConvert.setMinutes(todayDate.getMinutes());
    dateToConvert.setSeconds(todayDate.getSeconds());
    dateToConvert.setMilliseconds(todayDate.getMilliseconds());
    var UTCDateString = dateToConvert.toISOString();
    return UTCDateString;
  };

/**
* getDateObjectFromDateComponents : used to format the date and return as object
* @param {dateComponents} date
* @returns {String} - deformatted IBAN
*/
  FormatUtilManager.prototype.getDateObjectFromDateComponents = function (dateComponents) {
    var date = new Date(dateComponents[2], parseInt(dateComponents[1]) - 1, dateComponents[0]);
    return date;
  };
  
/**
* sortRecordsBasedOnDate : used to sort the provided array of objects based on propertyName mentioned and dateFormat is required if the date is in calendarString format
* @param {records} array
* @param {propertyName} string
* @param {dateFormat} string 
* @returns {array} - sorted array based on propertyName
*/
  FormatUtilManager.prototype.sortRecordsBasedOnDate = function (records, propertyName, dateFormat = null) {
    var scope = this;
    return records.sort(compare);
    function compare(a , b) {
      if (scope.isValidDateObject(a[propertyName])) { // if the date is already a date object
        return (b[propertyName] - a[propertyName]);
      }
      else if (!kony.sdk.isNullOrUndefined(dateFormat)) { // if the date is in calendar string format, i.e , MM/DD/YY, YYYY-MM-DD etc. In this case dateFormat is required 
        var first = scope.getDateObjectFromCalendarString(a[propertyName], dateFormat);
        var second = scope.getDateObjectFromCalendarString(b[propertyName], dateFormat);
        return second - first;
      }
      else if (!isNaN(parseFloat(a[propertyName])) && !isNaN(a[propertyName] - 0)) { //if the date is in timestamp format
        var first = new Date(parseInt(a[propertyName]));
        var second = new Date(parseInt(b[propertyName]));
        return second - first;
      }
      else if (typeof(a[propertyName]) === "string" && a[propertyName].startsWith("/Date(")) {// if the date is in UNIX timestamp format eg. "/Date(123456789)"
        var first = new Date(parseInt(a[propertyName].substr(6)));
        var second = new Date(parseInt(b[propertyName].substr(6)));
        return second - first;
      }
      else {
        kony.print("Invalid date format");
        return;
      } 
    }
  };

   /**
* getNumberOfDaysBetweenTwoDates : returns the date difference between 2 date objects
* @param {date1} - dateObject
* @param {date2} - dateObject
* @returns {integer} - No. of days between the two dates
*/
  FormatUtilManager.prototype.getNumberOfDaysBetweenTwoDates = function (date1, date2) {
    var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    var diff = Math.round(Math.abs((date1 - date2) / oneDay));
    return diff;
  };

  /**
  * isDebitTransaction : used to return if the transaction is a debit transaction
  * @param {String} amount
  * @returns {Boolean} - true or false
  */
 FormatUtilManager.prototype.isDebitTransaction = function (amount) {
  return amount < 0;
 };

 /**
  * isDebitTransaction : used to return if the transaction is a debit transaction
  * @param {String} amount
  * @returns {Boolean} - true or false
  */
 FormatUtilManager.prototype.isCreditTransaction = function (amount) {
  return amount > 0;
 };

  /**
* isValidDateObject : used to check whether the date is a valid date object or not
* @param {date} - dateObject 
* @returns {boolean} - true if date is a valid date object
*/

  FormatUtilManager.prototype.isValidDateObject = function (date) {
      return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
  };
  
  /**
  * getTwelveHourTimeString: convert 24hr time to 12hr time string
  * @param {String} time (hh:mm:ss)
  * @returns {String} time (hh:mm AM/PM) 
  */
  FormatUtilManager.prototype.getTwelveHourTimeString = function (timeString) {
    var hours, minutes, meridiem = "AM";
    if (timeString) {
      hours = parseInt(timeString.split(":")[0], 10);
      minutes = parseInt(timeString.split(":")[1], 10);
      if (hours > 12) {
        hours = hours - 12;
        meridiem = "PM";
      } else if(hours === 12){
        meridiem = "PM";
      } else if(hours === 0){
        hours = 12;
        meridiem = "AM";
      }
    }
	if(minutes < 10)
      minutes = "0"+ minutes;
    return hours+":"+ minutes+""+meridiem;
  };
  
  /**
  * getTwentyFourHourTimeString: convert 12hr time string to 24hr time string
  * @param {String} time (hh:mm AM/PM)
  * @returns {String} time (hh:mm:ss)
  */
  FormatUtilManager.prototype.getTwentyFourHourTimeString = function (timeString) {
    var hours, minutes, meridiem, finalString ="";
    if (timeString) {
      hours = parseInt(timeString.split(":")[0], 10);
      var minString = timeString.split(":")[1];
      minutes = minString.substr(0,2);
      meridiem = minString.substr(2,2);
      if (meridiem === "PM" && hours !== 12) {
        hours = hours + 12;
      } else if(meridiem === "AM" && hours === 12){
        hours = hours - 12;
      }
      if(hours < 10)
        hours = "0"+ hours;
      finalString = hours + ":" + minutes + ":00";
    }
    return finalString;
  };
  /**
     * returns ceil value before or after decimal point
     * @param {String} value - Number that needs to be rounded
     * @param {String} fixedPoints - position number to find a ceil
     * @returns {String} - rounded value
     */
  FormatUtilManager.prototype.ceilDecimalString = function(value, fixedPoints) {
    value = +value;
    fixedPoints = +fixedPoints;
    // If the value is not a number or the fixedPoints is not an integer...
    if (isNaN(value) || !(typeof fixedPoints === 'number' && fixedPoints % 1 === 0)) {
      return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math.ceil(+(value[0] + 'e' + (value[1] ? (+value[1] - fixedPoints) : -fixedPoints)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + fixedPoints) : fixedPoints));
  };

  /**
  * This formats given card number by adding a space after every 4 characters and returns the formated string
  * @param {string} cardNumber card number - masked or not
  * @returns {String}  Formated card number
  */
  FormatUtilManager.prototype.formatCardNumber = function (cardNumber) {
    cardNumber = cardNumber.replace(/(.{4})/g, '$& ');
    return cardNumber;
  };
    /*
    * Convert server timezone datetime to client time zone date object
    * @param {String} databaseTS - datetime string (2021-03-12 10:10:34)
    * @returns {Date object} - converted client timezone datetime
   */
  FormatUtilManager.prototype.getLocalizedDateFromDatabaseTS = function (databaseTS) {
    var datePojoObject = this.parseDateStringIntoDatePojo(databaseTS, this.DBP_DATE_FORMAT);
    var databaseDateInstance = new Date(datePojoObject.year, datePojoObject.month,
                                        datePojoObject.day, datePojoObject.hours, datePojoObject.minutes,
                                        datePojoObject.seconds);
    var clientTimeZone =  "UTC";
    if(OLBConstants.CLIENT_PROPERTIES && OLBConstants.CLIENT_PROPERTIES.CLIENT_APP_TIMEZONE){ // for OLB
      clientTimeZone =   OLBConstants.CLIENT_PROPERTIES.CLIENT_APP_TIMEZONE ;
    }else if(CommonUtilities.CLIENT_PROPERTIES && CommonUtilities.CLIENT_PROPERTIES.CLIENT_APP_TIMEZONE){ //for MB
      clientTimeZone =  CommonUtilities.CLIENT_PROPERTIES.CLIENT_APP_TIMEZONE;
    } 
    var localTimezoneOffsetInMinutes = clientTimeZone ? this.getOffsetForGivenTimeZone(clientTimeZone,new Date(datePojoObject.year, datePojoObject.month,
                                        datePojoObject.day)):new Date().getTimezoneOffset();
    const configManager = applicationManager.getConfigurationManager();
    var serverTimeZoneDetailsObj = configManager.configurations.getItem("SERVER_TIMEZONE_DETAILS");
    var serverTimezoneOffsetInMinutes = serverTimeZoneDetailsObj.ZoneOffsetInMinutes ?
                       serverTimeZoneDetailsObj.ZoneOffsetInMinutes : "0";
    var offsetDifferenceInMinutes = parseInt(localTimezoneOffsetInMinutes) - parseInt(serverTimezoneOffsetInMinutes) ; 
    var localTSDateObject = new Date();
    localTSDateObject.setTime((databaseDateInstance.getTime() + (offsetDifferenceInMinutes * 60 * 1000)));
    return localTSDateObject;
  };
   /**
    * Converts UTC datetime value to client timezone dateobject
    * @param {String} databaseTS - datetime string in UTC(2021-03-12T10:10:34Z)
    * @returns {Date object} - converted client timezone datetime
    */
  FormatUtilManager.prototype.getLocalizedDateFromDatabaseUTCTS = function (databaseTS) {
    var dateStr = databaseTS.replace("T"," ");
    var finalDateObj = dateStr.indexOf(".") >= 0 ? dateStr.split(".")[0] : dateStr.split("Z")[0];
    
    var datePojoObject = this.parseDateStringIntoDatePojo(finalDateObj, this.DBP_DATE_FORMAT);
    var databaseDateInstance = new Date(datePojoObject.year, datePojoObject.month,
                                        datePojoObject.day, datePojoObject.hours, datePojoObject.minutes,
                                        datePojoObject.seconds);
    var clientTimeZone =  "UTC";
    if (OLBConstants.CLIENT_PROPERTIES && OLBConstants.CLIENT_PROPERTIES.CLIENT_APP_TIMEZONE) { // for OLB
      clientTimeZone = OLBConstants.CLIENT_PROPERTIES.CLIENT_APP_TIMEZONE;
    } else if (CommonUtilities.CLIENT_PROPERTIES && CommonUtilities.CLIENT_PROPERTIES.CLIENT_APP_TIMEZONE) { //for MB
      clientTimeZone = CommonUtilities.CLIENT_PROPERTIES.CLIENT_APP_TIMEZONE;
    }                                       
    var localTimezoneOffsetInMinutes = clientTimeZone ? this.getOffsetForGivenTimeZone(clientTimeZone,new Date(datePojoObject.year, datePojoObject.month,
                                        datePojoObject.day)):
    new Date().getTimezoneOffset();
    var localTSDateObject = new Date();
    localTSDateObject.setTime((databaseDateInstance.getTime() + (localTimezoneOffsetInMinutes * 60 * 1000)));
    return localTSDateObject;
  };
  /*
   * This function will parse the given string to the given format.
   * This function is also compatible with IE and safari
   * For now only supports yyyy-MM-dd HH:mm:ss
   */
  FormatUtilManager.prototype.parseDateStringIntoDatePojo = function (dateString, format) {
    var self =this;
    if (format === this.DBP_DATE_FORMAT) {
      var datestr = dateString.split(" ")[0];
      var timestr = dateString.split(" ")[1];
      var datePojo = {
        year: 0,
        month: 0,
        day: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
      datePojo.year = datestr.split("-")[0];
      datePojo.month = parseInt(datestr.split("-")[1])-1;
      datePojo.day = datestr.split("-")[2];
      if(!kony.sdk.isNullOrUndefined(timestr)){
      datePojo.hours = timestr.split(":")[0];
      datePojo.minutes = timestr.split(":")[1];
      datePojo.seconds = timestr.split(":")[2].split(".")[0];
        }
      return datePojo;
    } else {
      //Format not supported
      throw Error("DateUtils: Format not supported");
    }
  };
  
  /*
  * get the offset value in minutes for a given timezone
  * @param: timeZone(Asia/Kolkata), dateObj
  * @return: offset vlaue in minutes
  */
  FormatUtilManager.prototype.getOffsetForGivenTimeZone = function(timeZoneStr,dateObj ){
    // [Trixon] Corrected locale configuration for language
    const utcDate = new Date(dateObj.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(dateObj.toLocaleString('en-US', { timeZone:timeZoneStr}));
    // const utcDate = new Date(dateObj.toLocaleString('en-US', { timeZone: 'UTC' }));
    // const tzDate = new Date(dateObj.toLocaleString('en-US', { timeZone:timeZoneStr}));
    // [Trixon] Ended
    var localTimeZoneOffset =  (tzDate.getTime()-utcDate.getTime() ) / 60000;
    return localTimeZoneOffset;
  };

  /**
   * function to format date in the format as defined in config based on locale
   * @param: dateInput (e.g., "2024-05-16")
   * @returns: formattedDate
   **/
  FormatUtilManager.prototype.getDateTimeBasedOnLocale = function(dateInput, isDateTime){
    //get the current locale
    let locale = kony.i18n.getCurrentLocale();
    locale = locale.replace("_","-");
    let dateValObj = new Date(dateInput);
    if (isNaN(dateValObj.getTime())) return null;
    let format = null;
    let localeDateConfig;
    let deviceInfo = kony.os.deviceInfo();
    if(deviceInfo.name === "thinclient"){
    localeDateConfig = OLBConstants.CLIENT_PROPERTIES.LOCALE_DATEFORMAT_MAPPING ? OLBConstants.CLIENT_PROPERTIES.LOCALE_DATEFORMAT_MAPPING : null;
    }
    else {
    localeDateConfig = CommonUtilities.CLIENT_PROPERTIES.LOCALE_DATEFORMAT_MAPPING ? CommonUtilities.CLIENT_PROPERTIES.LOCALE_DATEFORMAT_MAPPING : null;
    }
    if(null !== localeDateConfig && undefined !== localeDateConfig && localeDateConfig !== "") {
      localeDateConfig = JSON.parse(localeDateConfig);
      format = localeDateConfig[locale] ? localeDateConfig[locale][isDateTime ? "DATETIME" : "DATE"] : localeDateConfig["default"][isDateTime ? "DATETIME" : "DATE"];
    } else return null;
    let options = this.constructOptionsBasedOnFormat(format);
 
    let dateParts = new Intl.DateTimeFormat(locale, options).formatToParts(dateValObj);

    const map = {
      "yy": dateParts.find(part => part.type === 'year') ? dateParts.find(part => part.type === 'year').value : '',
      "yyyy": dateParts.find(part => part.type === 'year') ? dateParts.find(part => part.type === 'year').value : '',
      "MM": dateParts.find(part => part.type === 'month') ? dateParts.find(part => part.type === 'month').value : '',
      "MMM":  dateParts.find(part => part.type === 'month') ? dateParts.find(part => part.type === 'month').value : '',
      "MMMM":  dateParts.find(part => part.type === 'month') ? dateParts.find(part => part.type === 'month').value : '',
      "M":  dateParts.find(part => part.type === 'month') ? dateParts.find(part => part.type === 'month').value : '',
      "dd": dateParts.find(part => part.type === 'day') ? dateParts.find(part => part.type === 'day').value : '',
      "d": dateParts.find(part => part.type === 'day') ? dateParts.find(part => part.type === 'day').value : '',
      "HH": dateParts.find(part => part.type === 'hour') ? dateParts.find(part => part.type === 'hour').value : '',
      "hh": dateParts.find(part => part.type === 'hour') ? dateParts.find(part => part.type === 'hour').value : '',
      "H": dateParts.find(part => part.type === 'hour') ? dateParts.find(part => part.type === 'hour').value : '',
      "h": dateParts.find(part => part.type === 'hour') ? dateParts.find(part => part.type === 'hour').value : '',
      "mm": dateParts.find(part => part.type === 'minute') ? dateParts.find(part => part.type === 'minute').value : '',
      "ss": dateParts.find(part => part.type === 'second') ? dateParts.find(part => part.type === 'second').value : '',
      "AMPM": dateParts.find(part => part.type === 'dayPeriod') ? dateParts.find(part => part.type === 'dayPeriod').value : ''
    };

    if(format !== null) {
      if(format.includes("hh")) format = format + " AMPM";
      // Replace tokens in the format string
      let formattedDate = format.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|hh|H|h|mm|ss|AMPM/g, matched => map[matched]);
      return formattedDate;
    } else return null;
  };

  /**
   * function to construct options to pass to Intl.DateTimeFormat
   * @param: dateFormat
   * @returns: options
   **/
  FormatUtilManager.prototype.constructOptionsBasedOnFormat = function(dateFormat){
    const options = {};
 
    // Check for year format
    if (dateFormat.includes("yyyy")) options.year = "numeric";
    else if (dateFormat.includes("yy")) options.year = "2-digit";
 
    // Check for month format
    if (dateFormat.includes("MMMM")) options.month = "long";           // Full month name
    else if (dateFormat.includes("MMM")) options.month = "short";      // Short month name
    else if (dateFormat.includes("MM")) options.month = "2-digit";     // Numeric month, zero-padded
    else if (dateFormat.includes("M")) options.month = "numeric";      // Numeric month
 
    // Check for day format
    if (dateFormat.includes("dd")) options.day = "2-digit";            // Day, zero-padded
    else if (dateFormat.includes("d")) options.day = "numeric";        // Numeric day
 
    // Check for hour format (12-hour or 24-hour)
    if (dateFormat.includes("hh")) {
      options.hour = "2-digit";
      options.hour12 = true;                                       // 12-hour format
    } else if (dateFormat.includes("HH")) {
      options.hour = "2-digit";
      options.hour12 = false;                                      // 24-hour format
    } else if (dateFormat.includes("h")) {
      options.hour = "numeric";
      options.hour12 = true;
    } else if (dateFormat.includes("H")) {
      options.hour = "numeric";
      options.hour12 = false;
    }
 
    // Check for minute format
    if (dateFormat.includes("mm")) options.minute = "2-digit";
    else if (dateFormat.includes("m")) options.minute = "numeric";
 
    // Check for second format
    if (dateFormat.includes("ss")) options.second = "2-digit";
    else if (dateFormat.includes("s")) options.second = "numeric";
 
    return options;
  };

  /**
   *Based on the current locale, the corresponding date format will be returned.
    For this it refers to the client app property 'LOCALE_DATEFORMAT_MAPPING' and returns the corresponding date format
   *@returns: dateformat(e.g.,"dd/MM/yyyy")
   **/
  FormatUtilManager.prototype.getDateFormatConfigBasedonLocale = function(){
    //get the current locale
    let locale = kony.i18n.getCurrentLocale();
    locale = locale.replace("_","-");
    let format = null;
    let localeDateConfig;
	  let deviceInfo = kony.os.deviceInfo();
    if(deviceInfo.name === "thinclient"){
      localeDateConfig = OLBConstants.CLIENT_PROPERTIES.LOCALE_DATEFORMAT_MAPPING ? OLBConstants.CLIENT_PROPERTIES.LOCALE_DATEFORMAT_MAPPING : null;
    }
    else {
      localeDateConfig = CommonUtilities.CLIENT_PROPERTIES.LOCALE_DATEFORMAT_MAPPING ? CommonUtilities.CLIENT_PROPERTIES.LOCALE_DATEFORMAT_MAPPING : null;
    }	
    if(null !== localeDateConfig && undefined !== localeDateConfig && localeDateConfig !== "") {
      localeDateConfig = JSON.parse(localeDateConfig);
      format = localeDateConfig[locale] ? localeDateConfig[locale]["DATE"] : localeDateConfig["default"]["DATE"];
      return format;
    } else {
      return null;
    }
    
	};
  
  return FormatUtilManager;
});
