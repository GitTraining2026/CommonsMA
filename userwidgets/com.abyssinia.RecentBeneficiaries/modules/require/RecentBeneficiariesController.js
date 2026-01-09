define(function() {
	return {
		constructor: function(baseConfig, layoutConfig, pspConfig) {
            navManager = applicationManager.getNavigationManager();
            billMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({ "moduleName": "BillPaymentUIModule", "appName": "BillPayMA" });
            recipientMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({ "moduleName": "RecipientUIModule", "appName": "TransfersMA" });
		},

		initGettersSetters: function() {},

        componentPreshow: function(){
            componentScope = this;
            componentScope.view.segRecent.removeAll();
            componentScope.fetchRecentBeneficiaries();
        },

        fetchRecentBeneficiaries: function(){
            transactionType = "";
            parentForm = applicationManager.getPresentationUtility().getController(kony.application.getCurrentForm().id, true);
            parentForm.showOrHideRecent("hide");
            if(applicationManager.getNavigationManager().getCurrentForm().appName === "TransfersMA"){ 
                if(navManager.getCustomInfo("apolloTransactionObject").transactionType === "Within BOA"){ 
                    componentScope.transactionType = "Within BOA";
                    recipientMod.presentationController.fetchRecentTransactions("intrabanktransfers", "");
                }else if(navManager.getCustomInfo("apolloTransactionObject").transactionType === "Other Bank"){ 
                    componentScope.transactionType = "Other Bank";
                    recipientMod.presentationController.fetchRecentTransactions("interbankfundtransfers", ""); 
                }
            }else if(applicationManager.getNavigationManager().getCurrentForm().appName === "BillPayMA"){ 
                if(navManager.getCustomInfo("apolloPaymentObject").paymentType === "Postpaid"){ 
                    componentScope.transactionType = "Postpaid";
                    recipientMod.presentationController.fetchRecentTransactions("ownaccounttransfers", "ETHTELP"); 
                }else if(navManager.getCustomInfo("apolloPaymentObject").paymentType === "Websprix"){ 
                    componentScope.transactionType = "Websprix";
                    recipientMod.presentationController.fetchRecentTransactions("ownaccounttransfers", "WEBSPRIX"); 
                }else if(navManager.getCustomInfo("apolloPaymentObject").paymentType === "Dstv"){ 
                    componentScope.transactionType = "Dstv";
                    recipientMod.presentationController.fetchRecentTransactions("ownaccounttransfers", "DSTV"); 
                }
            }
        },

        setRecentBeneficiaries: function(response){
            componentScope.view.segRecent.removeAll();
            if(!kony.sdk.isNullOrUndefined(response.records) && response.records.length > 0){
                var transactionList = response.records;
                transactionData  = [];
                transactionList.forEach(function(item) {
                    var transactionNote = (item.notes).split(" ");
                    var bankName = "", paymentMode = "", beneficiaryLogo = "", beneficiaryName = "", beneficiaryNumber = "";
                    if(item.frequencyTypeId === "Once" && item.status === "Executed"){
                        if(componentScope.transactionType === "Within BOA"){ 
                            beneficiaryLogo = "apolloboaroundlogo.png";
                            beneficiaryName = item.beneficiaryName;
                            beneficiaryNumber = item.toAccountNumber;
                        }else if(componentScope.transactionType === "Other Bank"){
                            var bankDetail = JSON.parse(item.notes);
                            bankName = bankDetail.institutionName;
                            beneficiaryLogo = "apollo" + bankName.replace(/\s+/g, "").toLowerCase() + ".png";
                            beneficiaryName = item.beneficiaryName;
                            beneficiaryNumber = item.toAccountNumber;
                            paymentMode = item.notes;
                        }else if(componentScope.transactionType === "Postpaid"){ 
                            beneficiaryLogo = "apolloethiotel.png";
                            beneficiaryName = "Ethiotel Postpaid";
                            beneficiaryNumber = transactionNote[1];
                            paymentMode = transactionNote[transactionNote.length - 2]+" "+transactionNote[transactionNote.length - 1];
                        }else if(componentScope.transactionType === "Websprix"){ 
                            beneficiaryLogo = "apollowebsprix.png";
                            beneficiaryName = "Websprix";
                            beneficiaryNumber = transactionNote[1];
                            paymentMode = transactionNote[transactionNote.length - 2]+" "+transactionNote[transactionNote.length - 1];
                        }else if(componentScope.transactionType === "Dstv"){ 
                            beneficiaryLogo = "apollodstv.png";
                            beneficiaryName = "Dstv";
                            beneficiaryNumber = transactionNote[2];
                            paymentMode = item.notes;
                        }
                        var exists = false;
                        transactionData.forEach(function(item) { if(item.lblAccount === beneficiaryNumber) { exists = true; }})
                        if(componentScope.transactionType === "Other Bank" && navManager.getCustomInfo("apolloTransactionObject").recipientBankDetail.institutionName !== bankName) { exists = true; }
                        if(!exists){
                            beneficiaryName = beneficiaryName.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
                            transactionData.push({"imgBeneficiaryLogo": beneficiaryLogo, "lblName": beneficiaryName, "lblAccount": beneficiaryNumber, 
                                                  "imgBookmark": (item.day1 && item.day1 === "YES")? "apollobookmarkred.png" : "apollobookmark.png", "imgArrow": "apollorightarrow.png", 
                                                  "lblMode": paymentMode, "lblTransactionID": item.transactionId, "lblBankName": bankName, "lblType": componentScope.transactionType});
                        }
                    }
                });
                if(transactionData.length > 0){ 
                    componentScope.view.lblRecent.text = kony.i18n.getLocalizedString("cs.apollo.RecentTransaction");
                    componentScope.view.segRecent.setData(transactionData);
                    parentForm.showOrHideRecent("show");
                }else{ parentForm.showOrHideRecent("hide"); }
            }
        },

        bookmarkORdeleteBeneficiary : function(affectedBeneficiary, action){
            recipientMod.presentationController.bookmarkORdeleteRecentTransaction(affectedBeneficiary.widgetInfo.data[affectedBeneficiary.rowIndex], action);
            if(action === "DEL"){ componentScope.view.segRecent.removeAt(affectedBeneficiary.rowIndex); }
            else if(action === "FAV"){
                var segData = affectedBeneficiary.widgetInfo.data;
                segData[affectedBeneficiary.rowIndex].imgBookmark = (segData[affectedBeneficiary.rowIndex].imgBookmark === "apollobookmark.png") ? "apollobookmarkred.png" : "apollobookmark.png";
                componentScope.view.segRecent.setDataAt(segData[affectedBeneficiary.rowIndex], affectedBeneficiary.rowIndex);
            }
            componentScope.view.forceLayout();
        },     

        transactFromRecent : function(selectedBeneficiary){
            selectedBeneficiary = selectedBeneficiary.widgetInfo.data[selectedBeneficiary.rowIndex];
            if(selectedBeneficiary.lblType === "Within BOA"){
                applicationManager.getPresentationUtility().showLoadingScreen();
                var apolloTransactionObject = navManager.getCustomInfo("apolloTransactionObject");
                apolloTransactionObject.recipientAccount = selectedBeneficiary.lblAccount;
                navManager.setCustomInfo("apolloTransactionObject", apolloTransactionObject);
                recipientMod.presentationController.customApolloEnquiry();
            }else if(selectedBeneficiary.lblType === "Other Bank"){
                var apolloTransactionObject = navManager.getCustomInfo("apolloTransactionObject");
                apolloTransactionObject.recipientAccount = selectedBeneficiary.lblAccount;
                navManager.setCustomInfo("apolloTransactionObject", apolloTransactionObject);
                if(apolloTransactionObject.transactionSubtype === "EthSwitch") {
                    applicationManager.getPresentationUtility().showLoadingScreen();
                    recipientMod.presentationController.customApolloEnquiry();
                }else { navManager.navigateTo({"appName" : "TransfersMA", "friendlyName" :"MoneyMovementUIModule/frmRTGSReceiverName"}); }
            }else if(selectedBeneficiary.lblType === "Postpaid" || selectedBeneficiary.lblType === "Websprix"){
                applicationManager.getPresentationUtility().showLoadingScreen(); 
                apolloPaymentObject.paymentMode = selectedBeneficiary.lblMode;
                apolloPaymentObject.billNumber = selectedBeneficiary.lblAccount;
                navManager.setCustomInfo("apolloPaymentObject", apolloPaymentObject);
                billMod.presentationController.customApolloEnquiry();
            }else if(selectedBeneficiary.lblType === "Dstv"){
                applicationManager.getPresentationUtility().showLoadingScreen();
                var dstvPaymentTypeInfo = selectedBeneficiary.lblMode.split(" ");
                apolloPaymentObject.billNumber = selectedBeneficiary.lblAccount;
                apolloPaymentObject.paymentSubtype = (dstvPaymentTypeInfo[1] === "1") ? "Existing Package" : (dstvPaymentTypeInfo[1] === "13") ? "Box Office" : "Change Package";
                if(apolloPaymentObject.paymentSubtype === "Change Package"){
                    var dstvPackageName = dstvPaymentTypeInfo[dstvPaymentTypeInfo.length -1].replaceAll("0", " ");
                    var dstvDisplayName = (dstvPackageName).split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
                    apolloPaymentObject.selectedPackageDetail = {"displayName": dstvDisplayName, "packageId": "14", "packageName": dstvPackageName};
                }
                apolloPaymentObject.packageMonths = "1";
                navManager.setCustomInfo("apolloPaymentObject", apolloPaymentObject);
                billMod.presentationController.customApolloEnquiry();
            }
        },

	};
});