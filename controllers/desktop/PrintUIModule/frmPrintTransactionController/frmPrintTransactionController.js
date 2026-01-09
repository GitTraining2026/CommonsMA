define(['CommonUtilities', 'OLBConstants'], function(CommonUtilities, OLBConstants) {
    return {
        preShow: function() {},
        postShow: function() {
            applicationManager.getNavigationManager().applyUpdates(this);
        },
        /**
         * Method to start binding
         * @param {JsonObject} viewModel, model to display data
         */
        updateFormUI: function(viewModel) {
            if (viewModel.printData) this.updatePrintData(viewModel.printData)
        },
        updatePrintData: function(viewModel) {
            this.setDataForTransaction(viewModel.transactions);
            this.setAccountDetailsInformation(viewModel.accountDetailsModel, viewModel.accountDisplayName);
            this.view.forceLayout();
            kony.os.print();
            this.loadAccountsDetails();
        },
        /**
         * Method to set Account Details Information
         * @param {JsonObject} accountDetailsModel, account model
         */
        setAccountDetailsInformation: function(accountDetailsModel, accountDisplayName) {
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            var accountNumberMask = function(accountNumber) {
                var stringAccNum = '' + accountNumber;
                var isLast4Digits = function(index) {
                    return index > (stringAccNum.length - 5);
                };
                return stringAccNum.split('').map(function(c, i) {
                    return isLast4Digits(i) ? c : 'X';
                }).join('');
            };
            accountDetailsModel = JSON.parse(JSON.stringify(accountDetailsModel));
            CommonUtilities.setText(this.view.lblMyCheckingAccount, accountDisplayName, accessibilityConfig);
            CommonUtilities.setText(this.view.lblKonyBank, accountDisplayName, accessibilityConfig);
            this.view.lblTransactionsFrom.setVisibility(false);
            this.view.btnBack.setVisibility(false);
            this.view.btnBackBottom.setVisibility(false);
            var accountHolder = "";
            try {
                if (accountDetailsModel.accountHolder) {
                    var accountHolderJSON = JSON.parse(accountDetailsModel.accountHolder);
                    if (accountHolderJSON.hasOwnProperty("fullname")) {
                        accountHolder = accountHolderJSON.fullname;
                    }
                }
            } catch (e) {
                if (accountDetailsModel.accountHolder) {
                    accountHolder = accountDetailsModel.accountHolder;
                }
            }
            CommonUtilities.setText(this.view.keyValueAccHolderName.lblValue, accountHolder, accessibilityConfig);
            CommonUtilities.setText(this.view.keyValueAccNumber.lblValue, accountNumberMask(accountDetailsModel.accountID), accessibilityConfig);
            CommonUtilities.setText(this.view.keyValueBank.lblValue, kony.mvc.MDAApplication.getSharedInstance().appContext.bankName || "", accessibilityConfig);
            this.view.keyValueBranch.lblValue.text = "";
            if (accountDetailsModel.accountType === applicationManager.getTypeManager().getAccountTypeBackendValue(OLBConstants.ACCOUNT_TYPE.SAVING)) {
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                CommonUtilities.setText(this.view.keyValueAvailableBalance.lblValue, CommonUtilities.formatCurrencyWithCommas(accountDetailsModel.availableBalance, false, accountDetailsModel.currencyCode), accessibilityConfig);
                CommonUtilities.setText(this.view.keyValueAvailableBalance.lblKey, kony.i18n.getLocalizedString('i18n.accounts.availableBalance'), accessibilityConfig);
                CommonUtilities.setText(this.view.keyValueCurrentBalance.lblValue, CommonUtilities.formatCurrencyWithCommas(accountDetailsModel.currentBalance, false, accountDetailsModel.currencyCode), accessibilityConfig);
                CommonUtilities.setText(this.view.keyValueCurrentBalance.lblKey, kony.i18n.getLocalizedString('i18n.accounts.currentBalance'), accessibilityConfig);
                CommonUtilities.setText(this.view.keyValuePendingDeposits.lblValue, CommonUtilities.formatCurrencyWithCommas(accountDetailsModel.pendingDeposit, false, accountDetailsModel.currencyCode), accessibilityConfig);
                CommonUtilities.setText(this.view.keyValuePendingDeposits.lblKey, kony.i18n.getLocalizedString('i18n.accountDetail.pendingDeposit'), accessibilityConfig);
                CommonUtilities.setText(this.view.keyValuePendingWithdrawal.lblValue, CommonUtilities.formatCurrencyWithCommas(accountDetailsModel.pendingWithdrawal, false, accountDetailsModel.currencyCode), accessibilityConfig);
                CommonUtilities.setText(this.view.keyValuePendingWithdrawal.lblKey, kony.i18n.getLocalizedString('i18n.accountDetail.pendingWithdrawals'), accessibilityConfig);
            }
            if (accountDetailsModel.accountType === applicationManager.getTypeManager().getAccountTypeBackendValue(OLBConstants.ACCOUNT_TYPE.CREDITCARD)) {
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                CommonUtilities.setText(this.view.keyValueAvailableBalance.lblValue, CommonUtilities.formatCurrencyWithCommas(accountDetailsModel.availableCredit, false, accountDetailsModel.currencyCode), accessibilityConfig);
                CommonUtilities.setText(this.view.keyValueAvailableBalance.lblKey, kony.i18n.getLocalizedString('i18n.accountDetail.availableCredit'), accessibilityConfig);
                CommonUtilities.setText(this.view.keyValueCurrentBalance.lblValue, CommonUtilities.formatCurrencyWithCommas(accountDetailsModel.currentBalance, false, accountDetailsModel.currencyCode), accessibilityConfig);
                CommonUtilities.setText(this.view.keyValueCurrentBalance.lblKey, kony.i18n.getLocalizedString('i18n.accounts.currentBalance'), accessibilityConfig);
                CommonUtilities.setText(this.view.keyValuePendingDeposits.lblValue, CommonUtilities.formatCurrencyWithCommas(accountDetailsModel.currentAmountDue, false, accountDetailsModel.currencyCode), accessibilityConfig);
                CommonUtilities.setText(this.view.keyValuePendingDeposits.lblKey, kony.i18n.getLocalizedString('i18n.accountDetail.currentDueAmount'), accessibilityConfig);
                CommonUtilities.setText(this.view.keyValuePendingWithdrawal.lblValue, CommonUtilities.formatCurrencyWithCommas(accountDetailsModel.creditLimit, false, accountDetailsModel.currencyCode), accessibilityConfig);
                CommonUtilities.setText(this.view.keyValuePendingWithdrawal.lblKey, kony.i18n.getLocalizedString('i18n.accountDetail.creditLimit'), accessibilityConfig);
            }
            if (accountDetailsModel.accountType === applicationManager.getTypeManager().getAccountTypeBackendValue(OLBConstants.ACCOUNT_TYPE.LOAN)) {
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                CommonUtilities.setText(this.view.keyValueAvailableBalance.lblValue, CommonUtilities.formatCurrencyWithCommas(accountDetailsModel.outstandingBalance, false, accountDetailsModel.currencyCode), accessibilityConfig);
                CommonUtilities.setText(this.view.keyValueAvailableBalance.lblKey, kony.i18n.getLocalizedString("i18n.accounts.outstandingBalance"), accessibilityConfig);
                CommonUtilities.setText(this.view.keyValueCurrentBalance.lblValue, CommonUtilities.formatCurrencyWithCommas(accountDetailsModel.principalBalance, false, accountDetailsModel.currencyCode), accessibilityConfig);
                CommonUtilities.setText(this.view.keyValueCurrentBalance.lblKey, kony.i18n.getLocalizedString('i18n.accountDetail.principalBalance'), accessibilityConfig);
                CommonUtilities.setText(this.view.keyValuePendingDeposits.lblValue, CommonUtilities.formatCurrencyWithCommas(accountDetailsModel.principalValue, false, accountDetailsModel.currencyCode), accessibilityConfig);
                CommonUtilities.setText(this.view.keyValuePendingDeposits.lblKey, kony.i18n.getLocalizedString('i18n.accountDetail.principalAmount'), accessibilityConfig);
                CommonUtilities.setText(this.view.keyValuePendingWithdrawal.lblValue, CommonUtilities.formatCurrencyWithCommas(accountDetailsModel.currentAmountDue, false, accountDetailsModel.currencyCode), accessibilityConfig);
                CommonUtilities.setText(this.view.keyValuePendingWithdrawal.lblKey, kony.i18n.getLocalizedString('i18n.accountDetail.currentDueAmount'), accessibilityConfig);
            }
            if (accountDetailsModel.accountType === applicationManager.getTypeManager().getAccountTypeBackendValue(OLBConstants.ACCOUNT_TYPE.DEPOSIT)) {
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                CommonUtilities.setText(this.view.keyValueAvailableBalance.lblValue, CommonUtilities.formatCurrencyWithCommas(accountDetailsModel.availableBalance, false, accountDetailsModel.currencyCode), accessibilityConfig);
                CommonUtilities.setText(this.view.keyValueAvailableBalance.lblKey, kony.i18n.getLocalizedString('i18n.accounts.availableBalance'), accessibilityConfig);
                CommonUtilities.setText(this.view.keyValueCurrentBalance.lblValue, CommonUtilities.formatCurrencyWithCommas(accountDetailsModel.currentBalance, false, accountDetailsModel.currencyCode), accessibilityConfig);
                CommonUtilities.setText(this.view.keyValueCurrentBalance.lblKey, kony.i18n.getLocalizedString('i18n.accounts.currentBalance'), accessibilityConfig);
                CommonUtilities.setText(this.view.keyValuePendingDeposits.lblValue, CommonUtilities.formatCurrencyWithCommas(accountDetailsModel.interestEarned, false, accountDetailsModel.currencyCode), accessibilityConfig);
                CommonUtilities.setText(this.view.keyValuePendingDeposits.lblKey, kony.i18n.getLocalizedString('i18n.accountDetail.interestEarned'), accessibilityConfig);
                CommonUtilities.setText(this.view.keyValuePendingWithdrawal.lblValue, CommonUtilities.formatCurrencyWithCommas(accountDetailsModel.maturityDate, false, accountDetailsModel.currencyCode), accessibilityConfig);
                CommonUtilities.setText(this.view.keyValuePendingWithdrawal.lblKey, kony.i18n.getLocalizedString('i18n.accountDetail.maturityDate'), accessibilityConfig);
            }
            if (accountDetailsModel.accountType === applicationManager.getTypeManager().getAccountTypeBackendValue(OLBConstants.ACCOUNT_TYPE.CHECKING) || accountDetailsModel.accountType === applicationManager.getTypeManager().getAccountTypeBackendValue(OLBConstants.ACCOUNT_TYPE.CURRENT)) {
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                CommonUtilities.setText(this.view.keyValueAvailableBalance.lblValue, CommonUtilities.formatCurrencyWithCommas(accountDetailsModel.availableBalance, false, accountDetailsModel.currencyCode), accessibilityConfig);
                CommonUtilities.setText(this.view.keyValueAvailableBalance.lblKey, kony.i18n.getLocalizedString('i18n.accounts.availableBalance'), accessibilityConfig);
                CommonUtilities.setText(this.view.keyValueCurrentBalance.lblValue, CommonUtilities.formatCurrencyWithCommas(accountDetailsModel.currentBalance, false, accountDetailsModel.currencyCode), accessibilityConfig);
                CommonUtilities.setText(this.view.keyValueCurrentBalance.lblKey, kony.i18n.getLocalizedString('i18n.accounts.currentBalance'), accessibilityConfig);
                CommonUtilities.setText(this.view.keyValuePendingDeposits.lblValue, CommonUtilities.formatCurrencyWithCommas(accountDetailsModel.pendingDeposit, false, accountDetailsModel.currencyCode), accessibilityConfig);
                CommonUtilities.setText(this.view.keyValuePendingDeposits.lblKey, kony.i18n.getLocalizedString('i18n.accountDetail.pendingDeposit'), accessibilityConfig);
                CommonUtilities.setText(this.view.keyValuePendingWithdrawal.lblValue, CommonUtilities.formatCurrencyWithCommas(accountDetailsModel.pendingWithdrawal, false, accountDetailsModel.currencyCode), accessibilityConfig);
                CommonUtilities.setText(this.view.keyValuePendingWithdrawal.lblKey, kony.i18n.getLocalizedString('i18n.accountDetail.pendingWithdrawals'), accessibilityConfig);
            }
            if (accountDetailsModel.accountType === applicationManager.getTypeManager().getAccountTypeBackendValue(OLBConstants.ACCOUNT_TYPE.LINE_OF_CREDIT)) {
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                CommonUtilities.setText(this.view.accountSummary.lblAvailableBalanceTitle, kony.i18n.getLocalizedString('i18n.accounts.availableBalance'), accessibilityConfig);
                CommonUtilities.setText(this.view.accountSummary.lblAvailableBalanceValue, CommonUtilities.formatCurrencyWithCommas(accountDetailsModel.availableBalance, false, accountDetailsModel.currencyCode), accessibilityConfig);
                CommonUtilities.setText(this.view.keyValueAvailableBalance.lblValue, CommonUtilities.formatCurrencyWithCommas(accountDetailsModel.availableBalance, false, accountDetailsModel.currencyCode), accessibilityConfig);
                CommonUtilities.setText(this.view.keyValueAvailableBalance.lblKey, kony.i18n.getLocalizedString('i18n.accounts.availableBalance'), accessibilityConfig);
                CommonUtilities.setText(this.view.keyValueCurrentBalance.lblValue, CommonUtilities.formatCurrencyWithCommas(accountDetailsModel.currentBalance, false, accountDetailsModel.currencyCode), accessibilityConfig);
                CommonUtilities.setText(this.view.keyValueCurrentBalance.lblKey, kony.i18n.getLocalizedString('i18n.accounts.currentBalance'), accessibilityConfig);
                CommonUtilities.setText(this.view.keyValuePendingDeposits.lblValue, CommonUtilities.formatCurrencyWithCommas(accountDetailsModel.interestRate, false, accountDetailsModel.currencyCode), accessibilityConfig);
                CommonUtilities.setText(this.view.keyValuePendingDeposits.lblKey, kony.i18n.getLocalizedString('i18n.accountDetail.interestRate'), accessibilityConfig);
                CommonUtilities.setText(this.view.keyValuePendingWithdrawal.lblValue, CommonUtilities.formatCurrencyWithCommas(accountDetailsModel.regularPaymentAmount, false, accountDetailsModel.currencyCode), accessibilityConfig);
                CommonUtilities.setText(this.view.keyValuePendingWithdrawal.lblKey, "Regular Payment Amount", accessibilityConfig);
            }
            this.view.forceLayout();
        },
        /**
         * setDataForTransaction : Method set data in transaction segment
         * @member of {frmPrintTransactionController}
         * @param {JsonObject} transactions, transactions object
         * @return {}
         * @throws {}
         */
        setDataForTransaction: function(transactions) {
            var firstTable = transactions[0];
            var secondTable = transactions[1];
            if (firstTable) {
                var header = firstTable[0].lblTransactionHeader.text;
                if (header === "Posted" || header === "Pending") {
                    this.view.lblDate.text = kony.i18n.getLocalizedString("i18n.konybb.Common.Date");
                    this.view.lblDescription.text = kony.i18n.getLocalizedString("kony.pfm.desc");
                    this.view.lblType.text = kony.i18n.getLocalizedString("i18n.common.Type");
                    this.view.lblAmount.text = kony.i18n.getLocalizedString("i18n.konybb.Common.Amount");
                    this.view.lblBalance.text = kony.i18n.getLocalizedString("i18n.AccountsDetails.Balance");
                } else {
                    this.view.lblDate.text = kony.i18n.getLocalizedString("i18n.konybb.Common.Date");
                    this.view.lblDescription.text = kony.i18n.getLocalizedString("i18n.konybb.Common.Amount");
                    this.view.lblType.text = kony.i18n.getLocalizedString("i18n.accounts.principal");
                    this.view.lblAmount.text = kony.i18n.getLocalizedString("i18n.AccountsDetails.INTEREST");
                    this.view.lblBalance.text = kony.i18n.getLocalizedString("i18n.accounts.outstandingBalance");
                }
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                CommonUtilities.setText(this.view.lblPendingTransactions, firstTable[0].lblTransactionHeader.text, accessibilityConfig);
                this.view.segPendingTransaction.setData(firstTable[1].map(this.createTransactionSegmentsModel));
                this.view.flxPendingTransactions.setVisibility(true);
            } else {
                this.view.flxPendingTransactions.setVisibility(false);
            }
            if (secondTable) {
                var header = secondTable[0].lblTransactionHeader.text;
                if (header === "Posted" || header === "Pending") {
                    this.view.lblDate1.text = kony.i18n.getLocalizedString("kony.pfm.desc");
                    this.view.lblDescription1.text = kony.i18n.getLocalizedString("i18n.konybb.Common.Date");
                    this.view.lblType1.text = kony.i18n.getLocalizedString("i18n.common.Type");
                    this.view.lblAmount1.text = kony.i18n.getLocalizedString("i18n.konybb.Common.Amount");
                    this.view.lblBalance1.text = kony.i18n.getLocalizedString("i18n.AccountsDetails.Balance");
                } else {
                    this.view.lblDate1.text = kony.i18n.getLocalizedString("i18n.konybb.Common.Date");
                    this.view.lblDescription1.text = kony.i18n.getLocalizedString("i18n.konybb.Common.Amount");
                    this.view.lblType1.text = kony.i18n.getLocalizedString("i18n.accounts.principal");
                    this.view.lblAmount1.text = kony.i18n.getLocalizedString("i18n.AccountsDetails.INTEREST");
                    this.view.lblBalance1.text = kony.i18n.getLocalizedString("i18n.accounts.outstandingBalance");
                }
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                CommonUtilities.setText(this.view.CopylblPendingTransactions0a979ad50321149, secondTable[0].lblTransactionHeader.text, accessibilityConfig);
                this.view.segPostedTransactions.setData(secondTable[1].map(this.createTransactionSegmentsModel));
                this.view.flxPostedTransactions.setVisibility(true);
            } else {
                this.view.flxPostedTransactions.setVisibility(false);
            }
        },
        /**
         * createTransactionSegmentsModel : Method to create Transaction SegmentsModel
         * @member of {frmPrintTransactionController}
         * @param {JsonObject} transaction object to map
         * @return {JsonObject} transaction object with segment mapping
         * @throws {}
         */
        createTransactionSegmentsModel: function(transaction) {
            return {
                lblDate: transaction.lblDate,
                lblDescription: transaction.lblDescription,
                lblType: transaction.lblType,
                lblCategory: transaction.lblCategory,
                lblAmount: transaction.lblAmount,
                lblBalance: transaction.lblBalance,
                lblSeparator: transaction.lblSeparator
            };
        },
        /**
         * loadAccountsDetails : Method to accounts details
         * @member of {frmPrintTransactionController}
         * @param {}
         * @return {}
         * @throws {}
         */
        loadAccountsDetails: function() {
            var accountModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("AccountsModule");
            accountModule.presentationController.presentAccountDetails();
        }
    }
});