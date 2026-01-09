define(["ViewConstants", "CommonUtilities"], function(ViewConstants, CommonUtilities) {
  /**
   * enableButton : Method to enable button status
   * @param {object} button widget button object
   */
  var _disableButton = function(button) {
    button.setEnabled(false);
    button.skin = "sknBtnBlockedSSP0273e315px";
    button.hoverSkin = "sknBtnBlockedSSP0273e315px";
    button.focusSkin = "sknBtnBlockedSSP0273e315px";
  };

  /**
   * enableButton : Method to enable button status
   * @param {object} button widget button object
   */
  var _enableButton = function(button) {
    button.setEnabled(true);
    button.skin = "sknBtnNormalSSPFFFFFF15Px";
    button.hoverSkin = "sknBtnNormalSSPFFFFFFHover15Px";
    button.focusSkin = "sknBtnNormalSSPFFFFFF15PxFocus";
  };
  /**
   * Method to disable button
   */
  var _disableButtonSkinForCSRMode = function() {
    var skin = "sknBtnBlockedSSP0273e315px";
    return skin;
  };
  /**
   * disableButtonActionForCSRMode : Method to disable Segment buttons and buttons in csr mode
   */
  var _disableButtonActionForCSRMode = function() {
    kony.print("This action is not valid for CSR");
  };
  /**
   * disableSegmentButtonSkinForCSRMode : Method to set skin to Segment buttons in csr mode
   * @param {size} : size of the font in button
   * @return {string} skin - skin to be applied to buttons in csr mode
   */
  var _disableSegmentButtonSkinForCSRMode = function(size) {
    var HEIGHT_13 = 13,
      HEIGHT_15 = 15,
      HEIGHT_17 = 17;
    if (size === HEIGHT_13) {
      return "sknBtnSSP3343A813PxBg0CSR";
    }
    if (size === HEIGHT_15) {
      return "sknBtnSSP3343A815PxBg0CSR";
    }
    if (size === HEIGHT_17) {
      return "sknBtnSSP3343A817PxBg0CSR";
    }
  };
  /**
   * _toggleCheckbox - Toggle The check box state on a image widget. Assuming the image widget passed is being used as checkbox.
   * @param {object} imageWidget - The image widget of the check box which should be toggled.
   */
  var _toggleCheckbox = function(imageWidget) {
    imageWidget.src =
      imageWidget.src === ViewConstants.IMAGES.CHECKED_IMAGE
        ? ViewConstants.IMAGES.UNCHECKED_IMAGE
        : ViewConstants.IMAGES.CHECKED_IMAGE;
  };
  var _toggleFontCheckbox = function (imageWidget) {
            imageWidget.text = imageWidget.text === ViewConstants.FONT_ICONS.CHECBOX_SELECTED ?  ViewConstants.FONT_ICONS.CHECBOX_UNSELECTED : ViewConstants.FONT_ICONS.CHECBOX_SELECTED; 
            imageWidget.skin = imageWidget.skin === ViewConstants.SKINS.CHECKBOX_SELECTED_SKIN ?  ViewConstants.SKINS.CHECKBOX_UNSELECTED_SKIN : ViewConstants.SKINS.CHECKBOX_SELECTED_SKIN; 
        };

  /**
   * _isChecked - Returns the state of Checkbox (Image Widget)
   * @member of {CommonUtilities}
   * @param {object} imageWidget - The image widget of the check box of which state is needed.
   * @returns {boolean} - returns true if checkbox is checked and false if checkbox is not checked
   */

  var _isChecked = function(imageWidget) {
    return imageWidget.src === ViewConstants.IMAGES.CHECKED_IMAGE;
  };
  var _isFontIconChecked = function (imageWidget) {
            return imageWidget.text === ViewConstants.FONT_ICONS.CHECBOX_SELECTED;
        };

  /**
   * _setCheckboxState - Sets the state of Checkbox (Image Widget)
   * @param {boolean} state - The state of checkbox which needs to be set.
   */

  var _setCheckboxState = function(state, imageWidget) {
    if (state) {
      imageWidget.src = ViewConstants.IMAGES.CHECKED_IMAGE;
    } else {
      imageWidget.src = ViewConstants.IMAGES.UNCHECKED_IMAGE;
    }
  };
  
   /**
         * _setCheckboxState - Sets the state of Checkbox (label Widget)
         * @member of {CommonUtilities}
         * @param {boolean} state - The state of checkbox which needs to be set.
         * @returns {void} - None
         * @throws {}
         */
    
        var _setLblCheckboxState = function (state, labelWidget) {
            if (state) {
                labelWidget.text = ViewConstants.FONT_ICONS.CHECBOX_SELECTED;
              	labelWidget.skin = ViewConstants.SKINS.CHECKBOX_SELECTED_SKIN;
            }
            else {
                labelWidget.text = ViewConstants.FONT_ICONS.CHECBOX_UNSELECTED;
              	labelWidget.skin = ViewConstants.SKINS.CHECKBOX_UNSELECTED_SKIN;
            }
        };

  /**
   * _isRadioBtnSelected - Returns the state of Radio (Image Widget)
   * @param {object} imageWidget - The image widget of the check box of which state is needed.
   * @returns {boolean} - returns true if checkbox is checked and false if checkbox is not checked
   */

  var _isRadioBtnSelected = function(imageWidget) {
    return (imageWidget.src === ViewConstants.IMAGES.RADIOBTN_ACTIVE_SMALL) || (imageWidget.src ===  ViewConstants.IMAGES.RADIO_BUTTON_ACTIVE) || (imageWidget.src ===  ViewConstants.IMAGES.RADIO_BTN_ACTIVE);
  };

  /**
   * Display loading indicator.
   * @param {object} view : view object of the form .
   */
  var _showProgressBar = function() {
        kony.application.showLoadingScreen("loadingskin","Data is still Loading");
  };

  /**
   * Hide loading indicator.
   * @param {object} view : view object of the form.
   */
  var _hideProgressBar = function() {
    kony.application.dismissLoadingScreen();
  };

  /**
   * Will generate list box data from array of object
   * @param {*[]} arrayOfObject An array of Object 
   * @param {string|function} objectPropertyForKey Property name of the object, or a mapping function to generate keys of listbox
   * @param {string|function} objectPropertyForValue Property name of the object or a mapping function to generate display values of listbox. 
   */

  var _getListBoxDataFromObjects = function (arrayOfObject, keyOrMapperForListBoxKey, keyOrMapperForListBoxValue) {
    function getValue (input, object) {
      if (typeof input === "string") {
        return object[input];
      }
      else if (typeof input === "function") {
        return input(object);
      }
    }
   return arrayOfObject.map(function (object) {
     return [getValue(keyOrMapperForListBoxKey, object), getValue(keyOrMapperForListBoxValue, object)];
   })
  }

  /**
   * Blocks the future date in calendar widget
   * @param {object} calendarWidget  The calendar whose future date is to be blocked.
   * @param {string} startDate Start date in mm/dd/yyyy format, dates greater than this will be blocked for selection.
   */
  var _blockFutureDate = function(calendarWidget, startDate) {
    var dateFormate = applicationManager.getConfigurationManager().frontendDateFormat;
    var DAYS_IN_TWO_MONTHS = 60;
    var finalDate;
    calendarWidget.dateFormat = dateFormate;
    if (startDate) {
      startDate = startDate.split("/");
      var mm = startDate[0];
      var dd = startDate[1];
      var yy = startDate[2];
      finalDate = new Date(yy, mm, dd);
      finalDate.setDate(finalDate.getDate() + DAYS_IN_TWO_MONTHS);
      var maxDate = finalDate.getDay();
      var maxMonth = finalDate.getMonth();
      var maxYear = finalDate.getFullYear();
      if (dateFormate === "dd/mm/yyyy") {
        calendarWidget.enableRangeOfDates(
          [dd, mm, yy],
          [maxDate, maxMonth, maxYear],
          "skn",
          true
        );
        calendarWidget.date = dd + "/" + mm + "/" + yy;
      } else {
        calendarWidget.enableRangeOfDates(
          [dd, mm, yy],
          [maxDate, maxMonth, maxYear],
          "skn",
          true
        );
        calendarWidget.date = mm + "/" + dd + "/" + yy;
      }
    }
  };

  /**
  * Method to update sorting icons in headers with given sortMap.
  * @param {object} sortMap - sorting map (name, imageFlx, clickContainer)  
  * @param {object} viewModel - target column and order(asc/desc).
  */
  var _updateSortFlex = function (sortMap, viewModel) {
    var configurationManager = applicationManager.getConfigurationManager();
      viewModel = viewModel || {};
      if (sortMap && sortMap.length && viewModel) {
          sortMap.forEach(function (item) {
              if (viewModel.sortBy === item.name) {
                  item.imageFlx.src = viewModel.order === configurationManager.OLBConstants.DESCENDING_KEY ? ViewConstants.IMAGES.SORTING_NEXT : ViewConstants.IMAGES.SORTING_PREVIOUS;
              } else {
                  item.imageFlx.src = ViewConstants.IMAGES.SORTING;
              }
          });
      }
  };

  /**
  * Method to attach sort Handlers
  * @param {object} sortMap - sorting map (name, imageFlx, clickContainer)
  * @param {function} clickHandler - on sort click handler
  * @param {object} scope - click handler scope.
  */
  var _setSortingHandlers = function (sortMap, clickHandler, scope) {
      var configurationManager = applicationManager.getConfigurationManager();
      var scopeObj = this;
      sortMap.forEach(function (_item) {
          _item.clickContainer.onClick = clickHandler.bind(scope || scopeObj, event, {
              'sortBy': _item.name,
              'offset' : configurationManager.OLBConstants.DEFAULT_OFFSET
          });
      });
  };

    var ALLOWED_DECIMAL_PLACES = 2;

    /**
     * This class wraps a Kony Text Box and convert it into Controlled Amount Text Field.
     * @param {object} konyTextBoxWidget Reference to a Kony Text Box Widget
     * @class
     */
    var _AmountFieldWrapper = function (konyTextBoxWidget) {
        this.widget = konyTextBoxWidget;
        this.button = null;
        this.onKeyUpListener = null;
        this.onEndEditingListener = null;
        this.onBeginEditingListener = null;
    }

    /**
     * Remove the delimeters from amount text.
     * @param {string} text Text from which delimeters to be removed
     * @returns {string} Text without delimeters
     */
    var _removeDelimeters = function (text) {
      var formatUtilManager = applicationManager.getFormatUtilManager();
        return formatUtilManager.deFormatAmount(text);
    }
    /**
     * Returns a listner which first call the inner event and then calls a interceptor.
     * @param {function} innerEvent 
     * @param {function} interceptor
     * @returns {function} Return a listener which wraps  
     */
    var _wrappedListener = function (innerEvent, interceptor) {
        return function (eventObject) {
            var value = innerEvent(eventObject);
            if (interceptor) {
                interceptor(eventObject);
            }
            return value;
        }
    }

    /**
     * A setter for optional button widget. 
     * @param {object} buttonWidget Reference to kony button widget 
     * @returns {_AmountFieldWrapper} Returns the self object for building 
     */
    _AmountFieldWrapper.prototype.buttonWidget = function (buttonWidget) {
        this.button = buttonWidget;
        return this;
    }

    /**
     * A setter for optional onKeyUp interceptor. 
     * @param {function} onKeyUpListener The interceptor for on keyup
     * @returns {_AmountFieldWrapper} Returns the self object for building 
     */
    _AmountFieldWrapper.prototype.onKeyUp = function (onKeyUpListener) {
        this.onKeyUpListener = onKeyUpListener;
        this.assignListeners();
        return this;
    }

     /**
     * A setter for optional onEndEditing interceptor. 
     * @param {function} onEndEditingListener The interceptor for onEndEditing
     * @returns {_AmountFieldWrapper} Returns the self object for building 
     */
    _AmountFieldWrapper.prototype.onEndEditing = function (onEndEditingListener) {
        this.onEndEditingListener = onEndEditingListener;
        this.assignListeners();
        return this;
    }

    /**
     * A setter for optional onBeginEditing interceptor. 
     * @param {function} onBeginEditingListener The interceptor for onBeginEditingListener
     * @returns {_AmountFieldWrapper} Returns the self object for building 
     */
    _AmountFieldWrapper.prototype.onBeginEditing = function (onBeginEditingListener) {
        this.onBeginEditingListener = onBeginEditingListener;
        this.assignListeners();
        return this;
    }

    
    /**
     * Checks if amount in Amount field is valid or not
     * @returns {boolean} Returns if amount inside wrapped text box is a valid amount or not
     */
    _AmountFieldWrapper.prototype.isValidAmount = function() {
            var amount = this.getAmount();
            return amount !== undefined && amount !== null && !isNaN(amount) && amount !== "";
    };

    /**
     * Returns the amount in number
     * @returns {Number} Returns amount of text box widget in number format
     */
    _AmountFieldWrapper.prototype.getAmountValue = function () {
        return Number(_removeDelimeters(this.widget.text));
    }
    
    /**
     * Returns the amount of the textbox
     * @returns {string} Returns amount of text box widget after removing delimeters
     */
    _AmountFieldWrapper.prototype.getAmount = function () {
        return  _removeDelimeters(this.widget.text);
    }
    

    _AmountFieldWrapper.prototype.assignListeners = function () {
        this.widget.onKeyUp = _wrappedListener(this._onKeyUp.bind(this), this.onKeyUpListener);
        this.widget.onEndEditing = _wrappedListener(this._onEndEditing.bind(this), this.onEndEditingListener)
        this.widget.onBeginEditing = _wrappedListener(this._onBeginEditing.bind(this), this.onBeginEditingListener);
    }


    /**
     * Internal onBeginEditing Event for Amount Field - Remove Delimiters 
     * @param {object} eventObject
     */
    _AmountFieldWrapper.prototype._onEndEditing = function (eventObject) {
        var amount = this.widget.text;
          if(!this.isValidAmount(amount)){
			  if(isNaN(amount)){
					this.widget.text = "";
					return true;
				}
            return false;
          }else{
            this.widget.text = CommonUtilities.formatCurrencyWithCommas(amount, true);          
            return true;
          }
    }

    
    /**
     * Internal onBeginEditing Event for Amount Field - Remove Delimiters 
     * @param {object} eventObject
     */
    _AmountFieldWrapper.prototype._onBeginEditing = function(eventObject){
      var amount = _removeDelimeters(this.widget.text);
        this.widget.text =  amount ? String(amount) : "";
    };

    /**
     * Toggles the button state - If a button is available
     */
    _AmountFieldWrapper.prototype.toggleButtonState = function () {
        if (this.button) {
            if (this.isValidAmount()) {
                _enableButton(this.button);
            }
            else {
                _disableButton(this.button);
            }
        }
    }

    /**
     * Internal onKeyUp Event for Amount Field - Removes Extra Decimal Places 
     * @param {object} eventObject
     */
    _AmountFieldWrapper.prototype._onKeyUp = function (eventObject) {
        this.toggleButtonState();
        var amount = this.widget.text;
        var delimeter = applicationManager.getFormatUtilManager().getDecimalSeparator();
        if(amount.indexOf(delimeter) < 0) {
          return;
        }
        else{
          var arr = amount.split(delimeter);
          if(arr[1].length <= ALLOWED_DECIMAL_PLACES) {
            return;
          }
          this.widget.text = (arr[0] + delimeter + arr[1].slice(0, ALLOWED_DECIMAL_PLACES));
          return true;
        }
    }
    /**
     * Wraps a Amount Field and Return the wrapper object
     */
     var _wrapAmountField =  function (widget) {
        return new _AmountFieldWrapper(widget);
    };

  /**
* Method to change skins to reflect error in textbox fields
*@param{string} widgetIds Widget Id/Array of Widget Ids of textbox(s) that are causing error for eg Param can be like [this.view.textbox1, this.view.textbox2] or this.view.textbox
*@param{string} errorFlex Widget Id of Error Flex that needs to be turn on to show error
*/
  var _showErrorForTextboxFields = function (widgetIds, errorFlex) {
    if (Array.isArray(widgetIds)) {
      widgetIds.forEach(function (item) {
        item.skin = ViewConstants.SKINS.BORDER;
      })
    }
    else {
      widgetIds.skin = ViewConstants.SKINS.BORDER;
    }
    if (errorFlex) {
      errorFlex.setVisibility(true);
    }
  };
  /**
  * Method to change skins to hide error in textbox fields on key up
  *@param{string} widgetIds Widget Id/Array of Widget Ids of textbox(s) for eg Param can be like [this.view.textbox1, this.view.textbox2] or this.view.textbox
  *@param{string} errorFlex Widget Id of Error Flex that needs to be turn off to hide error
  */
  var _hideErrorForTextboxFields = function (widgetIds, errorFlex) {
    if (Array.isArray(widgetIds)) {
      widgetIds.forEach(function (item) {
        item.skin = ViewConstants.SKINS.SKNTBXLAT0FFFFFF15PXBORDER727272OPA20;
      })
    }
    else {
      widgetIds.skin = ViewConstants.SKINS.SKNTBXLAT0FFFFFF15PXBORDER727272OPA20;
    }
    if (errorFlex) {
      errorFlex.setVisibility(false);
    }
  };

/**
  * Method to dismiss Popup when click outside. this is an alternative to PopupUtils
  * @param{kony.ui.FlexContainer} Container flex container instance.  
  */
  var _dismissPopup = function (flexWidget) {
      document.body.addEventListener("click", function (eventObject) {
        flexWidget.setVisibility(false);
      }, true)

  }
  /**
  * Method to hide popups for new header. This is an alternative to the hidepopups method
  * @param{kony.ui.FlexContainer} Container flex container instance.  
  */
  var _hidePopupsNew = function () {
    var currFormObj = kony.application.getCurrentForm();
    if(currFormObj.customheadernew.flxContextualMenu.isVisible === true){
      setTimeout(function(){
        currFormObj.customheadernew.flxContextualMenu.setVisibility(false);
        currFormObj.customheadernew.flxTransfersAndPay.accessibilityConfig = {
        a11yARIA: {
          "tabindex":0,
          "aria-expanded":false,
          "role": "button",
          "aria-labelledby": "lblTransferAndPay"
        },
      };
        currFormObj.customheadernew.flxTransfersAndPay.skin = ViewConstants.SKINS.BLANK_SKIN_TOPMENU;
        currFormObj.customheadernew.imgLblTransfers.text = "O";
      },"17ms")

    }
    if(currFormObj.customheadernew.flxUserActions.isVisible === true){
      setTimeout(function(){
      currFormObj.customheadernew.showUserActions();
        },"17ms")
    }
  }
  
  var _scrollToCenterY = function(formheight) {
    var screenheight = kony.os.deviceInfo().screenHeight;
    var y = Math.round(formheight/2 - screenheight/2);
    kony.application.getCurrentForm().setContentOffset({'x' : 0 ,'y' : y}, true);
  }
  
  var _scrollToTop = function() {
    kony.application.getCurrentForm().setContentOffset({'x' : 0 ,'y' : 0}, true);
  }

  var _setupFormOnTouchEnd = function(width) {
    var currFormObj = kony.application.getCurrentForm();    
    if (width == 640) {
      currFormObj.onTouchEnd = function () { }
    } else {
      if (width == 1024) {
        currFormObj.onTouchEnd = function () { }        
      } else {
        currFormObj.onTouchEnd = function () {
          _hidePopupsNew();
        }
      }
      var userAgent = kony.os.deviceInfo().userAgent;
      if (userAgent.indexOf("iPad") != -1) {
        currFormObj.onTouchEnd = function () { }
      } else if (userAgent.indexOf("Android") != -1 && userAgent.indexOf("Mobile") == -1) {
        currFormObj.onTouchEnd = function () { }
      }
    }
  }

  /**
   * enableTextbox : Method to enable textbox
   * @param {object} textbox widget textbox object
   */
  var _enableTextbox = function (textbox) {
    textbox.setEnabled(true);
    textbox.skin = "sknTbxSSPffffff15PxBorder727272opa20";
    textbox.hoverSkin = "sknSSP42424215PxBorder4A90E2";
    textbox.focusSkin = "sknSSP42424215PxBorder4A90E2";
  };

  /**
   * disableTextbox : Method to disable textbox
   * @param {object} textbox widget textbox object
   */
  var _disableTextbox = function (textbox) {
    textbox.setEnabled(false);
    textbox.skin = "sknTbxSSPreg42424215px";
    textbox.hoverSkin = "sknTbxSSPreg42424215px";
    textbox.focusSkin = "sknTbxSSPreg42424215px";
  };

  var _setHtmlToBrowserWidget = function(formObject, browserWidget, html) {

    function setHtmlToBrowser(element, content) {
      var iframe = element.querySelector("iframe");
      if (iframe) {
          var viewer = iframe.contentWindow.document.querySelector("#viewer");
          if (viewer) {
              viewer.innerHTML = content;
          }
          else {
              iframe.onload = function() {
                  var newViewer = iframe.contentWindow.document.querySelector("#viewer");
                  newViewer.innerHTML = content;
              };
          }
      }
    }

    if (!formObject || !browserWidget) {
      return; 
    }
    var browserWidgetElement = document.querySelector('div[kwp="'+formObject.view.id +'_' + browserWidget.id +'"]')
    if (!browserWidgetElement) {
      browserWidget.doLayout = function (formId,html, widget) {
        var browserWidgetElement2 = document.querySelector('div[kwp="'+formId+'_' + widget.id +'"]')
        setHtmlToBrowser(browserWidgetElement2, html)
        
      }.bind(null, formObject.view.id,html)
    }
    else {
      setHtmlToBrowser(browserWidgetElement, html)
    }
    
}

  var _getComponentWidget = function (formObject, array) {
    var widget = formObject;
    array.forEach(function (widgetName) {
      widget = widget[widgetName]
    })
    return widget;
  }

  var _updateWidgetsHeightInInfo = function(formObject, arrayOfWidgetNames) {
  var viewObject = formObject instanceof kony.mvc.MDAFormController ? formObject.view : formObject;
   arrayOfWidgetNames.forEach(function (widgetName) {
     var widget = null;
     if (widgetName.indexOf('.') > -1) {
      widget = _getComponentWidget(viewObject, widgetName.split("."))
     }
     else {
       widget = viewObject[widgetName];
     }
     if(widget) {
       if (!widget.info.frame) {
         widget.info.frame = {
           height: 0,
           width: 0,
           x: 0,
           y: 0
          }; // Initializing the frame to empty. Until the first doLayout is called the properties in frame will be undefined.
        }
       widget.doLayout = function (currentWidget){
         widget.info.frame = currentWidget.frame;
       }.bind(null, widget);
     }
   })
  }
  var _setRequestUrlConfig = function(browserWidget) {
    if (!browserWidget) {
      return;
    }
    browserWidget.requestURLConfig = {
        URL: "richtextViewer.html",
        requestMethod: constants.BROWSER_REQUEST_METHOD_GET,
    };
};

  var _ViewsVisibilityStore = function (widgets) {
    this.widgets = widgets;
    this.store = {};
    this._initializeStore();
    this._overrideSetVisiblity();
  }

  _ViewsVisibilityStore.prototype._initializeStore = function () {
    var scope = this;
    this.widgets.forEach(function (widget) {
      scope.store[widget.id] = widget.isVisible;
    })
  }

  _ViewsVisibilityStore.prototype._overrideSetVisiblity = function () {
    var scope = this;
    this.widgets.forEach(function (widget) {
      // Caching the platform setvisiblity
      var platformSetVisibility = widget.setVisibility;
      // Overriding the setVisiblity
      widget.setVisibility = function (isVisible) {
        scope.store[widget.id] = isVisible;
        platformSetVisibility.call(widget, arguments);
      }
    })
  }

  _ViewsVisibilityStore.prototype.onBreakpointChange = function () {
    var scope = this;
    this.widgets.forEach(function (widget) {
      widget.isVisible = !!scope.store[widget.id];
    })
  }


  var _getVisiblityStore = function (widgets) {
    return new _ViewsVisibilityStore(widgets)
  }


  return {
    disableButton: _disableButton,
    enableButton: _enableButton,
    disableButtonSkinForCSRMode: _disableButtonSkinForCSRMode,
    disableButtonActionForCSRMode: _disableButtonActionForCSRMode,
    disableSegmentButtonSkinForCSRMode: _disableSegmentButtonSkinForCSRMode,
    toggleCheckbox: _toggleCheckbox,
    toggleFontCheckbox: _toggleFontCheckbox,
    isCheckboxChecked: _isChecked,
    isFontIconChecked: _isFontIconChecked,
    setCheckboxState: _setCheckboxState,
    setLblCheckboxState: _setLblCheckboxState,
    isRadioBtnSelected: _isRadioBtnSelected,
    showProgressBar: _showProgressBar,
    hideProgressBar: _hideProgressBar,
    blockFutureDate: _blockFutureDate,
    getListBoxDataFromObjects: _getListBoxDataFromObjects,
    updateSortFlex: _updateSortFlex,
    setSortingHandlers: _setSortingHandlers,
    wrapAmountField: _wrapAmountField,
    showErrorForTextboxFields:_showErrorForTextboxFields,
    hideErrorForTextboxFields:_hideErrorForTextboxFields,
    dismissPopup: _dismissPopup,
    setupFormOnTouchEnd:_setupFormOnTouchEnd,
    hidePopupsNew:_hidePopupsNew,
    enableTextbox:_enableTextbox,
    disableTextbox:_disableTextbox,
    setHtmlToBrowserWidget: _setHtmlToBrowserWidget,
    updateWidgetsHeightInInfo: _updateWidgetsHeightInInfo,
    setRequestUrlConfig: _setRequestUrlConfig,
    disableTextbox:_disableTextbox,
    scrollToCenterY:_scrollToCenterY,
    scrollToTop:_scrollToTop,
    getVisiblityStore: _getVisiblityStore
  };
});
