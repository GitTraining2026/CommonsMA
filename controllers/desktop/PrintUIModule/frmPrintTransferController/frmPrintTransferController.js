define(['CommonUtilities'], function(CommonUtilities) {
    return {
        /**
         * Method to patch update any section of form
         * @param {Object} uiData Data for updating form sections
         */
        updateFormUI: function(uiData) {
            if (uiData) {
                if (uiData.accountDisplayName) {
                    this.setDisplayName(uiData.accountDisplayName);
                }
                if (uiData.transactionRowData) {
                    this.setTransactionData(uiData.transactionRowData);
                }
                if (uiData.transactionSuccessData) {
                    this.setTransactionSuccessData(uiData.transactionSuccessData);
                }
                if (uiData.transactionList) {
                    this.setTransactions(uiData.transactionList);
                }
                if (uiData.printKeyValueGroupModel) {
                    this.ShowPrintKeyValueGroups(uiData.printKeyValueGroupModel);
                }
            }
        },
        /**
         *  Method to handle form preshow of frmPrintTransfer
         */
        preShowFunction: function() {
            this.view.btnBack.setVisibility(false);
            this.view.btnBackBottom.setVisibility(false);
            this.view.lblKonyBank.setVisibility(false);
        },
        postShow: function() {
            applicationManager.getNavigationManager().applyUpdates(this);
        },
        /**
         * Method to display account name
         * @param {String} accountDisplayName account display name
         */
        setDisplayName: function(accountDisplayName) {
            this.view.lblKonyBank.text = accountDisplayName;
        },
        /**
         * Method to create segment mapping
         * @param {JSON} transaction current transaction
         * @returns {JSON} transaction viewModel
         */
        createSegData: function(transaction) {
            var segRowtransaction = [];
            if (transaction.lblTypeValue === "CheckWithdrawal" || transaction.lblTypeValue === "Checks" || transaction.lblTypeValue === "CheckDeposit") {
                var isSecondCheckAvailable = transaction.lblBankName2 !== "0" ? true : false;
                segRowtransaction.push({
                    lblKey: transaction.lblTypeTitle,
                    lblValue: transaction.lblBankName1 + (isSecondCheckAvailable ? "," + transaction.lblBankName2 : "")
                });
                segRowtransaction.push({
                    lblKey: transaction.lblWithdrawalAmountTitle,
                    lblValue: transaction.lblWithdrawalAmountCheck1 + (isSecondCheckAvailable ? "," + transaction.lblWithdrawalAmountCheck2 : "")
                });
                segRowtransaction.push({
                    lblKey: transaction.CopylblToTitle0a2c47b22996e4f,
                    lblValue: transaction.lblWithdrawalAmountCash
                });
                segRowtransaction.push({
                    lblKey: transaction.lblTotalValue,
                    lblValue: transaction.lblWithdrawalAmount
                });
                segRowtransaction.push({
                    lblKey: transaction.lblToTitle,
                    lblValue: transaction.lblCheck1Ttitle + (isSecondCheckAvailable ? "," + transaction.lblCheck2Ttitle : "")
                });
            } else {
                segRowtransaction.push({
                    lblKey: kony.i18n.getLocalizedString("i18n.transfers.fromAccount"),
                    lblValue: transaction.fromAccountName
                });
                segRowtransaction.push({
                    lblKey: kony.i18n.getLocalizedString("i18n.accounts.ExternalAccountNumber"),
                    lblValue: transaction.lblExternalAccountNumber
                });
                segRowtransaction.push({
                    lblKey: transaction.lblFrequencyTitle,
                    lblValue: transaction.lblFrequencyValue
                });
                segRowtransaction.push({
                    lblKey: transaction.lblNoteTitle,
                    lblValue: transaction.lblNoteValue
                });
                segRowtransaction.push({
                    lblKey: transaction.lblRecurrenceTitle,
                    lblValue: transaction.lblRecurrenceValue
                });
                segRowtransaction.push({
                    lblKey: transaction.lblToTitle.text,
                    lblValue: transaction.lblToValue
                });
                if (transaction.lblWithdrawalAmountTitle.isVisible && transaction.lblWithdrawalAmountValue.isVisible) {
                    segRowtransaction.push({
                        lblKey: transaction.lblWithdrawalAmountTitle.text,
                        lblValue: transaction.lblWithdrawalAmountValue
                    });
                }
            }
            segRowtransaction.push({
                lblKey: kony.i18n.getLocalizedString("i18n.transfers.lblAmount") + "(" + applicationManager.getConfigurationManager().getCurrencyCode() + ")",
                lblValue: transaction.lblAmount
            });
            segRowtransaction.push({
                lblKey: kony.i18n.getLocalizedString("i18n.accounts.availableBalance"),
                lblValue: transaction.lblBalance
            });
            segRowtransaction.push({
                lblKey: transaction.lblTypeTitle,
                lblValue: transaction.lblTypeValue
            });
            segRowtransaction.push({
                lblKey: kony.i18n.getLocalizedString("i18n.transfers.lblDate"),
                lblValue: transaction.lblDate
            });
            segRowtransaction.push({
                lblKey: kony.i18n.getLocalizedString("i18n.StopPayments.Description"),
                lblValue: transaction.lblDescription
            });
            segRowtransaction.push({
                "lblDummy": " ",
                "template": "flxPrintTransferSpace"
            });
            return segRowtransaction;
        },
        /**
         * Method to set data in segment
         * @param {Collection} transactions List of transactions
         */
        setTransactionData: function(transactions) {
            var self = this;
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.lblTitle, kony.i18n.getLocalizedString("i18n.billPay.TransactionDetails"), accessibilityConfig);
            var segHeader = {
                "lblHeader": kony.i18n.getLocalizedString("i18n.billPay.TransactionDetails")
            };
            var segRowData = this.createSegData(transactions);
            var segDataModel = [
                [segHeader, segRowData]
            ];
            var dataMap = {
                "flxPrintTransfer": "flxPrintTransfer",
                "flxPrintTransferHeader": "flxPrintTransferHeader",
                "lblHeader": "lblHeader",
                "lblKey": "lblKey",
                "lblValue": "lblValue",
                "lblDummy": "lblDummy"
            };
            this.view.segTransfers.widgetDataMap = dataMap;
            this.view.segTransfers.setData(segDataModel);
            this.view.forceLayout();
            kony.os.print();
            var accountModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("AccountsModule");
            accountModule.presentationController.presentAccountDetails();
        },
        /**
         * Method to update transaction segment data
         * @param {JSON} data transaction object
         */
        setTransactionSuccessData: function(data) {
            var self = this;
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.lblTitle, data.module, accessibilityConfig);
            var segHeader = {
                "lblHeader": kony.i18n.getLocalizedString("i18n.billPay.TransactionDetails")
            };
            var segDataModel = [
                [segHeader, data.transactionDetails]
            ];
            var dataMap = {
                "flxPrintTransfer": "flxPrintTransfer",
                "flxPrintTransferHeader": "flxPrintTransferHeader",
                "lblHeader": "lblHeader",
                "lblKey": "key",
                "lblValue": "value",
                "lblDummy": "lblDummy"
            };
            data.transactionDetails.push({
                "lblDummy": " ",
                "template": "flxPrintTransferSpace"
            });
            this.view.segTransfers.widgetDataMap = dataMap;
            this.view.segTransfers.setData(segDataModel);
            this.view.forceLayout();
            kony.os.print();
            if (data.printCallback) {
                data.printCallback();
            } else if (data.module && data.module.trim() === "billpay") {
                var billPayModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("BillPayModule");
                billPayModule.presentationController.navigateToAcknowledgementForm();
            } else {
                applicationManager.getModulesPresentationController("TransferModule").presentTransferAcknowledge();
            }
        },
        /**
         * Method to create Segment Data For Bulk BillPay
         * @param {JSON} data billpay object
         * @returns {JSON} Bill pay data
         */
        createSegDataForBulkBillPay: function(data) {
            var keyMap = {
                lblAmount: kony.i18n.getLocalizedString("i18n.transfers.lblAmount") + "(" + applicationManager.getConfigurationManager().getCurrencyCode() + ")",
                lblDeliverBy: kony.i18n.getLocalizedString("i18n.billPay.DeliverBy"),
                lblEndingBalanceAccount: kony.i18n.getLocalizedString("i18n.transfer.EndingBalance"),
                lblPayee: kony.i18n.getLocalizedString("i18n.billPay.Payee"),
                lblPayeeAddress: kony.i18n.getLocalizedString("i18n.billpay.payeeAddress"),
                lblPaymentAccount: kony.i18n.getLocalizedString("i18n.billPay.PaymentAccount"),
                lblRefernceNumber: kony.i18n.getLocalizedString("i18n.transfers.RefrenceNumber"),
                lblSendOn: kony.i18n.getLocalizedString("i18n.transfers.send_on")
            };
            var segRowData = [];
            for (var key in keyMap) {
                var value = keyMap[key];
                segRowData.push({
                    lblKey: value,
                    lblValue: data[key]
                });
            }
            segRowData.push({
                "lblDummy": " ",
                "template": "flxPrintTransferSpace"
            });
            return segRowData;
        },
        /**
         * Method to set segment Transactions
         * @param {Object} dataList, transaction object
         */
        setTransactions: function(dataList) {
            var self = this;
            var segHeader = {
                "lblHeader": kony.i18n.getLocalizedString("i18n.billPay.TransactionDetails")
            };
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.lblTitle, dataList.module, accessibilityConfig);
            var dataMap = {
                "flxPrintTransfer": "flxPrintTransfer",
                "flxPrintTransferHeader": "flxPrintTransferHeader",
                "lblHeader": "lblHeader",
                "lblKey": "lblKey",
                "lblValue": "lblValue",
                "lblDummy": "lblDummy"
            };
            var segDataModel = [];
            this.view.segTransfers.widgetDataMap = dataMap;
            for (var i = 0; i < dataList.details.length; i++) {
                var rowData = dataList.details[i];
                segDataModel.push([segHeader, this.createSegDataForBulkBillPay(rowData)]);
            }
            this.view.segTransfers.setData(segDataModel);
            this.view.forceLayout();
            kony.os.print();
            dataList.printCallback();
        },
        ShowPrintKeyValueGroups: function(printModel) {
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.lblTitle, printModel.moduleHeader, accessibilityConfig);
            var dataMap = {
                "flxPrintTransfer": "flxPrintTransfer",
                "flxPrintTransferHeader": "flxPrintTransferHeader",
                "lblHeader": "lblHeader",
                "lblKey": "key",
                "lblValue": "value",
                "lblDummy": "lblDummy"
            };
            this.view.segTransfers.widgetDataMap = dataMap;
            var segDataModel = [];
            for (var index in printModel.tableList) {
                var rowData = printModel.tableList[index];
                var segHeader = {
                    "lblHeader": rowData.tableHeader
                };
                rowData.tableRows.push({
                    "lblDummy": " ",
                    "template": "flxPrintTransferSpace"
                });
                segDataModel.push([segHeader, rowData.tableRows]);
            }
            this.view.segTransfers.setData(segDataModel);
            this.view.forceLayout();
            kony.os.print();
            printModel.printCallback();
        },
    }
});