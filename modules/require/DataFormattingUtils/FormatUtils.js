define(['./FormatJSON', './DayJS'], function (FormatJSON, dayjs) {
  function FormatUtils() {
    var formatJSON = new FormatJSON();
    this.formatJSONValue = formatJSON.fetchFormatJSON();
    this.locale = kony.i18n.getCurrentLocale();
    if (this.locale !== undefined) {
      this.locale = this.locale.replace("_", "-");
    }
  }
  /**
  * @api : updateFormatJSON
  * updates the default format JSON with the JSON provided by user
  * @return : NA
  */
  FormatUtils.prototype.updateFormatJSON = function (formatJSON) {
    for (key in formatJSON) {
      this.formatJSONValue[key] = formatJSON[key];
    }
  };
  /**
  * @api : formatData
  * formats the raw data based on the format type
  * @return : NA
  */
  FormatUtils.prototype.formatData = function (formatType, data, dependentData) {
    var formattedData = "";
    try {
      this.formatJSON = this.formatJSONValue;
      if (formatType !== undefined && formatType !== null && formatType !== "") {
        if (data !== null) {
          if (this.formatJSON[formatType].BusinessRuleType === "FORMAT_DATE") {
            this.formatJSON = this.formatJSON[formatType].BusinessRule;
            formattedData = dayjs(data, this.formatJSON.inputFormat).format(this.formatJSON.displayFormat);
          } 
          else if (this.formatJSON[formatType].BusinessRuleType === "FORMAT_AMOUNT") {
            this.formatJSON = this.formatJSON[formatType].BusinessRule;
            this.formatJSON.style = "currency";
            if (dependentData !== null && dependentData !== "" && dependentData !== undefined) {
              this.formatJSON.currency = dependentData;
            }
            let locale = this.locale;
            if(this.locale === "ar-AE") {
              locale = 'en-US';
            }
            formattedData = new Intl.NumberFormat(locale, this.formatJSON).format(data);
          } 
          else if (this.formatJSON[formatType].BusinessRuleType === "FORMAT_CURRENCY") {
            this.formatJSON = this.formatJSON[formatType].BusinessRule;
            this.formatJSON.style = "currency";
            this.formatJSON.currency = data;
            this.formatJSON.minimumFractionDigits = 0;
            this.formatJSON.maximumFractionDigits = 0;
            formattedData = new Intl.NumberFormat("ja-JP", this.formatJSON).format(0);
            formattedData = formattedData.replace("0", "").trim();
          } 
          else if (this.formatJSON[formatType].BusinessRuleType === "FORMAT_ACCOUNT") {
            formattedData = data;
            var index;
            var maskingCharacter = this.formatJSON[formatType].BusinessRule.maskingCharacter;
            var numberOfCharacters = this.formatJSON[formatType].BusinessRule.numberOfCharacters;
            var maskingFromFront = this.formatJSON[formatType].BusinessRule.maskingFromFront;
            if (maskingFromFront === "yes") {
              for (index = 0; index < numberOfCharacters; index++) {
                formattedData = formattedData.replace(data[index], maskingCharacter);
              }
            } else if (maskingFromFront === "no") {
              for (index = numberOfCharacters; index > 0; index--) {
                formattedData = formattedData.replace(formattedData[index], maskingCharacter);
              }
            }
          } 
          else if (this.formatJSON[formatType].BusinessRuleType === "FORMAT_ACCOUNT_NAME") {
            var formatRule = this.formatJSON[formatType].BusinessRule;
            formattedData = data.substring(0, formatRule.maxLength) + formatRule.separator;
            if (dependentData !== null && dependentData !== "" && dependentData !== undefined) {
              formattedData = formattedData + dependentData.slice(formatRule.data2SliceLength)
            }
          } 
          else if (this.formatJSON[formatType].BusinessRuleType === "FORMAT_DATE_OBJECT") {
            this.formatJSON = this.formatJSON[formatType].BusinessRule;
            formattedData = dayjs(data).format(this.formatJSON.displayFormat);
          } 
          else if (this.formatJSON[formatType].BusinessRuleType === "FORMAT_PERCENT") {
            this.formatJSON = this.formatJSON[formatType].BusinessRule;
            this.formatJSON.style = "percent";
            let locale = this.locale;
            if(this.locale === "ar-AE") {
              locale = 'en-US';
            }
            formattedData = new Intl.NumberFormat(locale, this.formatJSON).format(data);
          } 
          else if (this.formatJSON[formatType].BusinessRuleType === "FORMAT_LONG_TEXT") {
            this.formatJSON = this.formatJSON[formatType].BusinessRule;
            formattedData = data.substring(0, this.formatJSON.maxLength) + this.formatJSON.separator + data.slice(this.formatJSON.stringSliceLength);
          } 
          else if (this.formatJSON[formatType].BusinessRuleType === "FORMAT_LOWERCASE_TEXT") {
            formattedData = data.toLowerCase();
          } 
          else if (this.formatJSON[formatType].BusinessRuleType === "FORMAT_UPPERCASE_TEXT") {
            formattedData = data.toUpperCase();
          } 
          else if (this.formatJSON[formatType].BusinessRuleType === "FORMAT_AMOUNT_WITHOUT_CURRENCY") {
            this.formatJSON = this.formatJSON[formatType].BusinessRule;
            this.formatJSON.style = "decimal";
            let locale = this.locale;
            if(this.locale === "ar-AE") {
              locale = 'en-US';
            }
            formattedData = new Intl.NumberFormat(locale, this.formatJSON).format(data);
          } 
          else if(this.formatJSON[formatType].BusinessRuleType === "FORMAT_TIMESTAMP") {
            this.formatJSON = this.formatJSON[formatType].BusinessRule;
            formattedData = dayjs(data,this.formatJSON.inputFormat).format(this.formatJSON.displayFormat);
          }
          return formattedData;
        }
        else {
          formattedData = data;
        }
      }
      else {
        formattedData = data;
      }
      return formattedData;
    }
    catch (e) {
      if(kony.os.deviceInfo().name === "thinclient")
        return data;
    }
  };
  return FormatUtils;
});