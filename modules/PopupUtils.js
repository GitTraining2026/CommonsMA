var Popupflag = 0;
var accflag = 0;
var accdetflag=0;
var accactflag = 0;
var accntflag = 0;
var flag = 0;
var Disputeflag = 0;
var showSuggestion = false;
var showMoreActionsFlag = 0;
var fromSeg = true;
var toSeg = true;
var previous_index;
var previous_index_all;
var previous_index_schedule;
var previous_index_history;
var previous_index_manage;
var isAdvanceFilterOpen = false;
var isCalendarDropDownOpen = false;
var isAccountTypeOpen = false;
function hidePopups() {
    var currFormObj = kony.application.getCurrentForm();
    var currForm = currFormObj.id;
    if (currForm === "frmAccountsDetails") {
      if(currFormObj.accountTypes.isVisible === true && flag === 1){
          flag = 0;
          //currFormObj.accountTypes.isVisible = false;
        }
      else if(currFormObj.accountTypes.isVisible === true && flag === 0){
        if(currFormObj.accountTypes.segAccountTypes.contentOffsetMeasured.y==0){
          setTimeout(function() {
            currFormObj.accountTypes.isVisible = false;
            if (currFormObj.imgAccountTypes.src === "arrow_up.png" || currFormObj.imgAccountTypes.src === "chevron_up.png") {
              currFormObj.imgAccountTypes.src = "arrow_down.png";
            }
          }, "17ms")
        }
      }
      
      
      if(currFormObj.flxAccountTypesSection.isVisible === true && flag === 1){
        flag = 0;
        //currFormObj.accountTypes.isVisible = false;
      }
      else if(currFormObj.flxAccountTypesSection.isVisible === true && flag === 0){
          setTimeout(function() {
            currFormObj.flxAccountTypesSection.isVisible = false;
            if (currFormObj.imgAccountTypes.src === "arrow_up.png" || currFormObj.imgAccountTypes.src === "chevron_up.png") {
              currFormObj.imgAccountTypes.src = "arrow_down.png";
            }
          }, "17ms")
      }

      
      if(event.target.id !==  "frmAccountsDetails_imgSecondaryActions" && event.target.id !==  "frmAccountsDetails_flxSecondaryActions") {
        setTimeout(function() {
          //currFormObj.moreActions.isVisible = false;
		  currFormObj.quicklinksHid.isVisible = false;
          flag = 0;
          //showMoreActionsFlag = 0;
        }, "17ms")
      }
      currFormObj.accountActionsMobile.isVisible = false;
      if (currFormObj.imgSecondaryActions.src === "arrow_up.png" || currFormObj.imgSecondaryActions.src === "chevron_up.png"){
        currFormObj.imgSecondaryActions.src = "arrow_down.png";
        //showMoreActionsFlag = 1;
      } 
        // currFormObj.accountInfo.isVisible = false;
      currFormObj.AllForms.setVisibility(false);
      accdetflag=0;
    }else if(currForm === "frmFastTransfers" || currForm === "frmMakePayment"){
		if((currFormObj.flxFromSegment.isVisible === true && fromSeg === true) || (currFormObj.flxToSegment.isVisible === true && toSeg === true)){
            fromSeg = false;
            toSeg = false;
        } else if((currFormObj.flxFromSegment.isVisible === true && fromSeg === false) || (currFormObj.flxToSegment.isVisible === true && toSeg === false)){
            currFormObj.flxFromSegment.setVisibility(false);
            fromSeg = true;
            currFormObj.flxToSegment.setVisibility(false);
            toSeg = true;
        }
		else if((currFormObj.flxFromSegment.isVisible === false && fromSeg === false) || (currFormObj.flxToSegment.isVisible === false && toSeg === false)){
			fromSeg = true;
            toSeg = true;
		}        
	}else if (currForm === "frmScheduledTransactions") {
      if(currFormObj.imgAccountTypes.src === "arrow_up.png" || currFormObj.imgAccountTypes.src === "chevron_up.png")
         currFormObj.imgAccountTypes.src = "arrow_down.png";
      currFormObj.accountInfo.isVisible = false;
      if(currFormObj.accountTypes.isVisible === true && Popupflag === 1){
          Popupflag = 0;
          //currFormObj.accountTypes.isVisible = false;
        }
      else if(currFormObj.accountTypes.isVisible === true && Popupflag === 0)
      currFormObj.accountTypes.isVisible = false;
      accdetflag=0;
        }
    else if (currForm === "frmAccountsLanding" || currForm === "frmBBAccountsLanding") {
      
      if(currFormObj.FavouriteAccountTypes.isVisible == "true"){
        setTimeout(function(){
          currFormObj.accountListMenu.top = 280;
          currFormObj.accountListMenu.isVisible = false;
          currFormObj.FavouriteAccountTypes.isVisible = false;
          currFormObj.accountList.lblImgDropdown.text = "O";
        },"17ms")
      }
      accflag=0;
    }else if (currForm === "frmDashboard") {
      currFormObj.customheader.topmenu.flxCombinedAccessMenu.isVisible = false;
      currFormObj.customheader.topmenu.lblDropbox.text = "O";
      currFormObj.accountListMenu.top = 280;
      currFormObj.accountListMenu.isVisible = false;
      currFormObj.accountsFilter.isVisible = false;
      currFormObj.lblDropDown.text = "O";
      currFormObj.imgAccountsDropdownMobile.text = "O";
      currFormObj.imgAccountsDropDown.text = "O";
      currFormObj.flxAccountList.isVisible = false;
      currFormObj.imgYearsDropDownMobile.text = "O";
      currFormObj.imgYearsDropDown.text = 'c';
      currFormObj.flxDurationList.isVisible = false;
      currFormObj.lblDropDown.text = "O";
      currFormObj.accountsFilter.setVisibility(false);
      currFormObj.flxAccountList.setVisibility(false);
      if(kony.sdk.isNullOrUndefined(event.target)){
          return;
      }
      if (!(event.target.parentElement.innerHTML.includes("frmDashboard_advancedFilters") || event.target.parentElement.innerHTML === "frmDashboard_btnAdvancedFiltersDropdown")) {
        currFormObj.flxAdvancedFilters.setVisibility(false);
        currFormObj.btnAdvancedFiltersDropdown.skin = "sknBtnOLBFontIconsBorder";
        currFormObj.btnAdvancedFiltersDropdown.text = 't';
      }
      if (!(event.target.parentElement.innerHTML.includes("frmDashboard_accountsFilter") || event.target.parentElement.innerHTML === "frmDashboard_lblDropDown")) {
        currFormObj.accountsFilter.setVisibility(false);
        currFormObj.lblDropDown.text = "O";
      }
      if (!(event.target.parentElement.innerHTML.includes("frmDashboard_accountListMenu"))) {
        currFormObj.accountListMenu.setVisibility(false);
      }
      if (!(event.target.parentElement.innerHTML.includes("frmDashboard_customheader_topmenu_flxContextualMenu") || event.target.parentElement.innerHTML === "frmDashboard_customheader_topmenu_flxTransfersAndPay" || event.target.parentElement.innerHTML === "frmDashboard_customheader_topmenu_imgLblTransfers")) {
        currFormObj.customheader.topmenu.flxContextualMenu.setVisibility(false);
        currFormObj.customheader.topmenu.flxTransfersAndPay.skin = "flxHoverSkinPointer";
        currFormObj.customheader.topmenu.imgLblTransfers.text = "O";
      }
      if (!(event.target.parentElement.innerHTML.includes("frmDashboard_customheader_flxUserActions"))) {
        currFormObj.customheader.flxUserActions.setVisibility(false);
      }
      if (!(event.target.parentElement.innerHTML.includes("frmDashboard_calendarWidget") || event.target.parentElement.innerHTML === "frmDashboard_imgYearsDropDown")) currFormObj.flxCalendar.setVisibility(false);
      if (currFormObj.flxAdvancedFilters.isVisible == true && isAdvanceFilterOpen == false) {
        currFormObj.flxAdvancedFilters.setVisibility(false);
        currFormObj.btnAdvancedFiltersDropdown.text = 't';
        currFormObj.btnAdvancedFiltersDropdown.skin = "sknBtnOLBFontIconsBorder";
      } else if (currFormObj.flxAdvancedFilters.isVisible == false && isAdvanceFilterOpen == true) {
        isAdvanceFilterOpen = false;
      }
      if(currFormObj.flxCalendar.isVisible == true && isCalendarDropDownOpen == false){
         currFormObj.flxCalendar.setVisibility(false);
      }
      else if (currFormObj.flxCalendar.isVisible == false && isCalendarDropDownOpen == true){
        isCalendarDropDownOpen = false;
      }      
      
    }else if(currForm === "frmPayAPerson"){
      currFormObj.secondaryActions.isVisible = false;
      currFormObj.imgDropdown.src = "arrow_down.png";
      currFormObj.AllFormsConfirm.isVisible = false;
      currFormObj.AllForms.isVisible = false;   
    } else if (currForm === "frmLogin") {
      if (currFormObj.lblCheckBox.text === "P"){
        currFormObj.lblCheckBox.text = "O";
        currFormObj.lblCheckBox.origin = true;
        currFormObj.flxDropdown.accessibilityConfig = {
            a11yARIA: {
              "aria-expanded": false,
              role: "button",
              "aria-labelledby":currFormObj.lblLanguage.id
            },
        };
      } else {
        currFormObj.lblCheckBox.origin = false;
      }
      if(currFormObj.flxLanguagePicker.isVisible){
        setTimeout(function(){
          currFormObj.flxLanguagePicker.isVisible = false;
        },"17ms")
      }
      currFormObj.AllForms.setVisibility(false);
      if( showSuggestion ) {
        showSuggestion = false;
      }
    }
    else if(currForm === "frmAddExternalAccount") {
      currFormObj.externalAccount.AllForms.setVisibility(false);  
      currFormObj.AllForms.setVisibility(false);     
    }
    else if(currForm === "frmAddInternalAccount") {
      currFormObj.internalAccount.AllForms.setVisibility(false);
      currFormObj.AllForms.setVisibility(false);     
    }
    else if(currForm === "frmUserManagement"){
      var FetchedDate = currFormObj.CustomDate.getText();
      if(FetchedDate !== null)
      currFormObj.CustomDate.setText(FetchedDate);
      else
      console.log("Invalid date");  
	  
	  var formController = applicationManager.getPresentationUtility().getController('frmUserManagement', true);
      var index = formController.currentDescriptionRow;
      if(formController.descriptionVisibilityFlag === true) {
        currFormObj.TabBodyOtherFeaturePermission.segTemplates.data[index].flxShowDescription = {
          isVisible: false
        };
        currFormObj.TabBodyOtherFeaturePermission.segTemplates.data[index].lblDescription = {
          isVisible: false
        };
        currFormObj.TabBodyOtherFeaturePermission.segTemplates.setDataAt(currFormObj.TabBodyOtherFeaturePermission.segTemplates.data[index],index);

        formController.descriptionVisibilityFlag = false;				
      }	
    }
    else if(currForm === "frmBBUsersDashboard") {
      currFormObj.InfoIconPopup.isVisible = false;     
    }
    else if(currForm === "frmBillPay") {
      currFormObj.AllForms.isVisible = false;     
    }
     else if(currForm == "frmNotificationsAndMessages"){
      currFormObj.customheader.flxUserActions.isVisible=false;
      currFormObj.AllForms.isVisible = false;
    }
    else if(currForm == "frmPayDueAmount"){
      currFormObj.customheadernew.flxUserActions.isVisible=false;
      currFormObj.LoanPayOff.AllForms.isVisible = false;
    }
    else if(currForm == "frmEnrollNow") {
      currFormObj.AllForms.setVisibility(false);
    }
    else if(currForm == "frmProfileManagement") {
      currFormObj.settings.AllForms1.isVisible = false;
      currFormObj.settings.AllForms.isVisible = false;
      currFormObj.InfoIconPopups.isVisible = false;
    }
    else if(currForm == "frmWireTransfer") {
      currFormObj.AllFormsActivateWireTransfer.isVisible = false;
      currFormObj.AllFormsConfirmDetails.isVisible = false;
    }
    else if(currForm == "frmCustomerFeedback") {
      currFormObj.Feedback.AllForms.isVisible = false;
    }
   else if(currForm == "frmBulkPaymentsDashboard") {
     if (currFormObj.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxDropdown.isVisible) {
       setTimeout(function() {
       currFormObj.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxDropdown.segViewTypes.setVisibility(false);
       currFormObj.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.imgDropdown.centerX = "50%";
       currFormObj.TabPaneNew.TabSearchBarNew.MobileCustomDropdown.flxIphoneDropdown.flxImage.imgDropdown.src = "blue_downarrow.png";
       }, "17ms")
     } 
   }
    else if(currForm == "frmAddPayee"){
      if(kony.application.getCurrentBreakpoint() == 1366 || kony.application.getCurrentBreakpoint() == 1380){
        currFormObj.flxPayeeList.isVisible = false;
        currFormObj.oneTimePay.flxPayeeList.setVisibility(false);
      }
    }
    else if(currForm == "frmMultiFactorAuthentication"){
      currFormObj.InfoPopUpIcon.isVisible = false;
    }  
  else if(currForm === "frmServiceRequests"){
      currFormObj.viewRequests.hideOpenSegments();
    }
        //function to adjust visibility of contextual menu as per requirement.
    if (currForm !== "frmLogout" && currForm !== "frmLoginHID" && currForm !== "frmLogin" && currForm !== "frmEnrollNow" && currForm !== "frmLoginLanguage" && currForm!=="frmFastTransfers" && currForm!=="frmMakePayment" && currForm !== "frmServiceRequests" && currForm !== "frmPayDueAmount" && currForm !== "frmRepaymentDayRequest") {
      if (currFormObj.customheader.topmenu.flxContextualMenu.isVisible === true) {
         setTimeout(function(){
        currFormObj.customheader.topmenu.flxContextualMenu.isVisible = false;
        currFormObj.customheader.topmenu.imgLblTransfers.text = "O";
        currFormObj.customheader.topmenu.flxTransfersAndPay.skin = "flxHoverSkinPointer";
        currFormObj.customheader.topmenu.flxTransfersAndPay.hoverSkin = "flxHoverSkinPointer000000op10";
        if ((currForm === "frmAccountsDetails") || (currForm === "frmAccountsLanding") || (currForm === "frmBBAccountsLanding")|| (currForm === "frmDashboard") ||(currForm==="frmCardManagement")||(currForm==="frmPersonalFinanceManagement")||(currForm==="frmContactUsPrivacyTandC")||(currForm==="frmOnlineHelp")) {
          currFormObj.customheader.topmenu.flxTransfersAndPay.skin = "flxHoverSkinPointer";
        } else {
          currFormObj.customheader.topmenu.flxTransfersAndPay.skin = "sknFlxFFFFFbrdr3343a8Pointer";
        }
             },"17ms")
      }
                    
      if(currFormObj.customheader.headermenu.imgDropdown.src === "profile_dropdown_uparrow.png")
      setTimeout(function() {
        currFormObj.customheader.headermenu.imgDropdown.src = "profile_dropdown_arrow.png";
        currFormObj.customheader.flxUserActions.isVisible = false; }, "17ms")
    }
  
  }