/**
 *@module ConfigurationManager
 */
 define(['CommonUtilities','OLBConstants'], function(CommonUtilities,OLBConstants) {
  /**
   * ConfigurationManager is a class which handles all functions related to storing data into devices.
   *@alias module:ConfigurationManager
   *@class
   */
  function ConfigurationManager() {
    scope_configManager=this;
    scope_configManager.loggedInUserPermissionsData = {
      'userDetails': {},
      'companyList': [],
      'accountLevelPermissions': [],
      'globalLevelPermissions': [],
      'transactionLimits': []
    };
    //spotlight config default values

    // [Zypher] Transaction Type code  to get transaction description

    this.BOA_TRANSACTION_TYPE = {
        "AC": "Account Transfer",
        "BC": "Clearing Transfer",
        "BD": "Direct Debit by Clearing",
        "BI": "Clearing Incoming",
        "DW": "Direct Drawing",
        "IC": "Incoming Payment by DRAFT",
        "IM": "Incoming Transfer by Mail",
        "IT": "Inward SWIFT-Telex Payment",
        "OC": "Outward cheque payment",
        "OD": "Outward Draft Paymant",
        "OT": "Outward Telex payment",
        "AC12": "Telebirr Transfer(With Charge)",
        "AC15": "Liquidation Account Transfer",
        "AC20": "Saving plus Transfer",
        "AC50": "Account Transfer",
        "AC51": "Account Transfer",
        "AC57": "Funds Transfer for SALCA",
        "ACAA": "Advertisement fee Account Transfer",
        "ACAC": "Cost Payment",
        "ACAD": "Adopted MT103 Trans",
        "ACAG": "Advance Account Transfer A/R",
        "ACAH": "Awach Payment",
        "ACAM": "Money Send/Receive",
        "ACAP": "Agent Payout",
        "ACAR": "AA Loan Adv Repay",
        "ACAT": "ATM Funds Transfer",
        "ACAW": "ATM Cash Withdrawal",
        "ACBB": "Account Transfer ERP BONUS",
        "ACBE": "ATM Enquiry Charge",
        "ACBI": "ETHSwitch Enquiry Charge",
        "ACBL": "Bill Payment",
        "ACBM": "Account Transfer Cash Back",
        "ACBO": "Pension Block Pay",
        "ACBP": "Broker Payment",
        "ACBR": "POS Transactions",
        "ACBS": "Broker Settlement",
        "ACBT": "BULK PAYMENT",
        "ACCA": "ATM Charge",
        "ACCB": "Account Transfer",
        "ACCC": "Settle Foreign Cheque Collection",
        "ACCD": "Issuance of CPO",
        "ACCG": "CashGo Transfer",
        "ACCH": "ATM Transaction Charges",
        "ACCL": "AZ Loan Preclosure",
        "ACCN": "Account Transfer to CanalPlus",
        "ACCO": "Account Transfer to COCA",
        "ACCP": "Acct Transfer CPO DD Payment",
        "ACCQ": "Account Transfer with Cheque.",
        "ACCR": "AA Credit Arrangement",
        "ACCS": "AA Account Closure",
        "ACCT": "Settle Foreign Cheque Returned.",
        "ACCW": "WegenSend Transfer",
        "ACDA": "Adopted MT202 Trans",
        "ACDB": "Account Transfer",
        "ACDC": "Issuance of Local Draft",
        "ACDD": "AZ Loan Drawdown",
        "ACDE": "Issuance of DD without Swift",
        "ACDF": "AA Deposit Funding",
        "ACDI": "AA Loan Disbursement",
        "ACDM": "ECX Account Transfer",
        "ACDO": "Mobile Deposit",
        "ACDP": "AA Deposit Payout",
        "ACDR": "Account Transfer Derash",
        "ACDS": "DSTV",
        "ACDT": "ITM Cash Deposit",
        "ACDW": "Down Payment",
        "ACEA": "Ethiopian Airlines Ticket",
        "ACEC": "ECX Transfer ACEC",
        "ACED": "Ethio Dash Transfer",
        "ACEO": "EthSwitch Transfer For Outgoing",
        "ACEP": "ETSWITH POS TRANSACTION",
        "ACER": "Account Transfer ERP",
        "ACES": "Account Transfer ERP Salary",
        "ACET": "EthSwitch Transfer For incomming",
        "ACEV": "Ecommerce VISA SALE",
        "ACEX": "Expected Receipt Payment",
        "ACEZ": "Ethiopian Airlines Ticket Refund",
        "ACFA": "Account Transfer",
        "ACFC": "ATM CLEARING fee",
        "ACFH": "Account Transfer to Federal Hc.",
        "ACFM": "ITM Currency Exchange",
        "ACFT": "ATM Funds Transfer Request",
        "ACFY": "Account Transfer Shipping FCY",
        "ACGC": "cash gift for fcy",
        "ACGH": "Charge Collection",
        "ACGL": "Post Closing Adjustment Entries",
        "ACGU": "Guzogo Airline Payment",
        "ACIB": "Internet Account transfer",
        "ACIC": "INACTIVE CHARGE",
        "ACID": "Inward Clearing",
        "ACIE": "CPO DD LDD Transfer to Income",
        "ACIG": "Inward Clearing EATS",
        "ACIM": "ITM Account to Acc Transfer no Chq",
        "ACIN": "IS Finance Profit Repay",
        "ACIS": "ITM Cash Deposit for Safaricom",
        "ACIW": "Inward Clearing",
        "ACLA": "Account to Wallet Transfer",
        "ACLM": "LMTS Transfer",
        "ACLP": "AA Litigation Repayment",
        "ACLT": "Internet LMTS Transfer",
        "ACLW": "Wallet to Account Transfer",
        "ACLY": "Account Transfer Shipping LCY",
        "ACMA": "Mobile Top Up",
        "ACMB": "Mobile Transfer",
        "ACMD": "AZ Multi Additional Deposit Opening",
        "ACME": "ATM Mini Statement",
        "ACMM": "Money Send/Receive For Mama Pay",
        "ACMO": "Mobile Account transfer",
        "ACMP": "MASTERCARD POS TRANSACTION",
        "ACMR": "Account Transfer MRV",
        "ACMS": "Ecommerce MasterCard Sale",
        "ACMT": "AirTime Topup",
        "ACMZ": "Master Card Refund Paid",
        "ACNB": "NBE Post restrict Transfer",
        "ACOC": "AZ Overdue Chgs Repayment",
        "ACOI": "AZ Overdue Intt Repayment",
        "ACOP": "AZ Overdue Prin Repayment",
        "ACPB": "Pension Back pay",
        "ACPC": "AZ Deposit Preclosure",
        "ACPD": "AA Loan Principal Decrease",
        "ACPE": "MC Purchase for future export",
        "ACPF": "Account Transfer within Portfolio",
        "ACPH": "Mobile Push Transfer",
        "ACPK": "Package apollo Transfer",
        "ACPL": "Account Transfer PL",
        "ACPM": "Pension Monthly Pay",
        "ACPO": "AA Loan Payoff",
        "ACPP": "AA Deposit Partial Payout",
        "ACPR": "Remote ATM POS Sale",
        "ACPT": "Pension One Time pay",
        "ACPW": "AZ Deposit Partial Withdrawal",
        "ACPX": "Account Transfer",
        "ACPY": "Mobile Payment",
        "ACQD": "ATM Cheque Deposit Request",
        "ACQF": "Remote ATM Cheque Deposit",
        "ACQP": "Account Transfer",
        "ACQR": "QR Payment",
        "ACRC": "Money Send/Receive",
        "ACRE": "Islamic Respite Payment.",
        "ACRF": "MC Refund from paid future export",
        "ACRM": "FMTS Transfer",
        "ACRP": "AA Repayment",
        "ACRW": "Reviewer Payment",
        "ACSA": "Safaricom Account Transfer",
        "ACSB": "Safaricom Trust Payment",
        "ACSC": "School Fees Payment",
        "ACSE": "Account Transfer SEPA Inward",
        "ACSF": "ITM Acc to Acc Transfer for Safaric",
        "ACSG": "Safaricom Account Transfer Gift",
        "ACSH": "School Fee",
        "ACSI": "Account Transfer",
        "ACSL": "Commodity Sale Proceeds",
        "ACSM": "MPESA B2C",
        "ACSN": "School Fee",
        "ACST": "Safaricom Account Transfer Recharge",
        "ACTA": "Acct Transfer Telebirr to Accounts",
        "ACTB": "Telebirr",
        "ACTC": "Account Transfer",
        "ACTD": "Remote ATM Cash Deposit",
        "ACTE": "Ethiotelecom Post-paid",
        "ACTF": "Remote ATM Tfr Request",
        "ACTG": "Telebirr Agent",
        "ACTH": "Thunes Integration",
        "ACTL": "Telebirr Transfer(With Charge)",
        "ACTM": "Mobile Top up Cash back",
        "ACTP": "Account Transfer for Temporary AC",
        "ACTR": "Account Transfer Trafic Penality",
        "ACTV": "Account Transfer Telebirr Voucher",
        "ACUB": "Mobile Transfer",
        "ACUD": "Account Transfer Shipping from USD",
        "ACUF": "Remote ATM Utility Payment",
        "ACUN": "UNION PAY POS TRANSACTION",
        "ACUP": "ATM Utility Payment",
        "ACUS": "Apollo USSD",
        "ACUT": "ATM Utility Pay thro Teller",
        "ACVE": "Vendor Payment",
        "ACVF": "VISA Purchase for future export",
        "ACVP": "VISA POS TRANSACTION",
        "ACVR": "VISA Refund from paid Ecommerce",
        "ACVS": "US Embassy",
        "ACVZ": "VISA Refund from paid future export",
        "ACWA": "Ac 2 AC WALLET TRANSFER",
        "ACWB": "Water Bill Payment",
        "ACWC": "WeBirr Payment",
        "ACWD": "ACCOUNT TRANSFER CASH DEPOSIT",
        "ACWE": "Mobile Transfer",
        "ACWF": "Remote ATM Cash Withdrawal",
        "ACWM": "ACCOUNT TRANSFER FOR MONEY LOAD",
        "ACWN": "ITM Cash Withdrawal no Chq",
        "ACWT": "WALLET TO ACCOUNT TRANSFER",
        "ACWU": "MT Account Transfer",
        "ACWW": "AWACH TRANSFER",
        "ACWX": "Websprix Account Transfer",
        "ACWZ": "Mobile Withdrawals",
        "ACZH": "ATM CARD REQ Charge Collection",
        "BCIB": "Clearing Transfer",
        "ITAS": "Inwards MT202",
        "ITAT": "Inward SWIFT-Telex Payment",
        "ITLC": "Incoming Telegraphic Transfer ETB -",
        "OC10": "Outward cheque payment",
        "OD10": "Outward Draft Paymant",
        "ODDC": "Issuance of Foreign Draft",
        "OT02": "Outward Telex payment",
        "OT03": "Outward Telex payment",
        "OT05": "RTGS Transfer",
        "OT06": "ATS MT202 Transaction",
        "OT07": "MT103 Unpaid",
        "OT08": "MT202 Unpaid",
        "OT12": "Outward Swift Payment - Cover",
        "OT20": "Outward Swift MT200",
        "OT22": "Outward Swift MT202",
        "OT40": "Outward MT400 Collection Payment",
        "OTI1": "Outward Vendor Payment.",
        "OTI2": "Outward Cost Payment.",
        "OTI3": "Outward Reviewer Payment",
        "OTI4": "Outward Broker Payment",
        "OTIB": "Outward Swift Payment MT103",
        "OTLC": "Outgoing TT ETB - LCY",
        "OTPX": "Outward Swift Payment MT103",
        "OTSW": "Outward SWIFT payment",
        "OTTC": "Outward Telex payment"
    };
    
    // [Zypher] end

    // [Trixon] Constant declaration for internal accounts, Transfers service charge rates and Bill limits
    this.BOA_TRANSFER_CHARGES = null;
    this.BOA_TRANSFER_COLLECTION_ACCOUNTS = null;
    this.BOA_BILL_COLLECTION_ACCOUNTS = null;
    this.BOA_BILLS_CONFIGURATIONS = null;
    this.SCHEDULEFREQUENCYLIST = [  {"lblNationality": "Last day of the month", "lblSuccess": "Last day of the month"},
                                    {"lblNationality": "Daily", "lblSuccess": "Daily"},
                                    {"lblNationality": "Weekly", "lblSuccess": "Weekly"},
                                    {"lblNationality": "Bi-Weekly", "lblSuccess": "Fortnightly"},
                                    {"lblNationality": "Monthly", "lblSuccess": "Monthly"},
                                    {"lblNationality": "Quarterly", "lblSuccess": "Quarterly"},
                                    {"lblNationality": "Semiannually", "lblSuccess": "Semiannual"},
                                    {"lblNationality": "Anually", "lblSuccess": "Yearly"} ]; 
                                                         
    this.SCHEDULEREMINDERLIST = [   {"lblNationality": "1 Hour before", "lblSuccess": "0"},
                                    {"lblNationality": "1 Day before", "lblSuccess": "1"},
                                    {"lblNationality": "2 Days before", "lblSuccess": "2"},
                                    {"lblNationality": "4 Days before", "lblSuccess": "3"},
                                    {"lblNationality": "1 Week before", "lblSuccess": "4"}];
    // [Trixon] Ended

    this.isFavoriteRequired=true;
    this.AcCloseReason=[];
    this.isSearchRequired=true;
    this.isFilterRequired=true; 
    this.favoriteCount=0;
    this.searchCount=0;
    this.filterCount=0;
    this.repaymentDay = [];
    this.earlyPayOffSimulateDays=0;
    this.accsCountCompactDashboard=0;
	this.searchCustomerCount=0;
    this.favouriteCustomerCount=0;
    this.dropdownCustomerCount=0;
    this.customersPerPage=0;
	this.transactionsPerPage=0;
	this.accountsPerPage=0;
    this.exploreProductsUrl="";
    this.resumeApplUrl="";
    this.tppAcknowledgmentScreenShown="";
    this.tppNavigationTimer="";
	this.isOptionalSCA="";
    //BB Configuration value (need to be changed while pushing to OLB)
    this.customerTypeId = "";
    this.sbaEnrolmentStatus = "";
    this.isSMEUser = "false";
    this.isMBBUser = "false";
    this.isRBUser = "false";
    this.isCombinedUser = "false";
    this.combinedDashboardView = -1;
    // this.GoogleservicesSupported=true;
    this.pinChangeLength = 4;
    this.transactionsPendingForMyApprovalCount = "";
    this.achTransactionsPendingForMyApprovalCount = "";
    this.achFilesPendingForMyApprovalCount = "";

    this.AwaitingCount = "";
    this.RejectedCount = "";
    this.ApprovedCount = "";
    this.isInternalFundTransfersCreateTransactionEnabled = "true";
    this.isTransferBetweenCustomersAccountsCreateTransactionEnabled = "true";
    this.isInterbankAccountToAccountFundTransferCreateTransactionEnabled = "true";
    this.isInternationAccountToAccountFundTransferCreateTransactionEnabled = "true";
    this.isDomesticWireTransfersCreateTransactionEnabled = "true";
    this.isInternationalWireTransfersCreateTransactionEnabled = "true";
    this.isBillPaymentCreateTransactionEnabled = "true";
    this.isP2PCreateTransactionEnabled = "true";
    this.isprofileImageAvailable = 'false';
    this.isACHPaymentCreateTransactionEnabled = "true";
    this.isACHCollectionCreateTransactionEnabled = "true";
    this.isInternalFundTransfersViewTransactionsEnabled = "true";
    this.isInternalFundTransfersApproveTransactionsEnabled = "true";
    this.isInternalFundTransfersSelfApprovalEnabled = "true";
    this.isInternalFundTransfersManagePayeesEnabled = "true";
    this.isIntraBankFundTransferViewTransactionsEnabled = "true";
    this.isTransferBetweenCustomersAccountsViewTransactionsEnabled = "true";
    this.isTransferBetweenCustomersAccountsApproveTransactionsEnabled = "true";
    this.isTransferBetweenCustomersAccountsSelfApprovalEnabled = "true";
    this.isTransferBetweenCustomersAccountsManagePayeesEnabled = "true";
    this.isInterbankAccountToAccountFundTransferViewTransactionsEnabled = "true";
    this.isInterbankAccountToAccountFundTransferApproveTransactionsEnabled = "true";
    this.isInterbankAccountToAccountFundTransferSelfApprovalEnabled = "true";
    this.isInterbankAccountToAccountFundTransferManagePayeesEnabled = "true";
    this.isInternationAccountToAccountFundTransferViewTransactionsEnabled = "true";
    this.isInternationAccountToAccountFundTransferApproveTransactionsEnabled = "true";
    this.isInternationAccountToAccountFundTransferSelfApprovalEnabled = "true";
    this.isInternationAccountToAccountFundTransferManagePayeesEnabled = "true";
    this.isDomesticWireTransfersViewTransactionsEnabled = "true";
    this.isDomesticWireTransfersApproveTransactionsEnabled = "true";
    this.isDomesticWireTransfersSelfApprovalEnabled = "true";
    this.isDomesticWireTransfersManagePayeesEnabled = "true";
    this.isInternationalWireTransfersViewTransactionsEnabled = "true";
    this.isInternationalWireTransfersApproveTransactionsEnabled = "true";
    this.isInternationalWireTransfersSelfApprovalEnabled = "true";
    this.isInternationalWireTransfersManagePayeesEnabled = "true";
    this.isBillPaymentViewTransactionsEnabled = "true";
    this.isBillPaymentApproveTransactionsEnabled = "true";
    this.isBillPaymentSelfApprovalEnabled = "true";
    this.isBillPaymentManagePayeesEnabled = "true";
    this.isP2PViewTransactionsEnabled = "true";
    this.isP2PApproveTransactionsEnabled = "true";
    this.isP2PSelfApprovalEnabled = "true";
    this.isP2PManagePayeesEnabled = "true";
    this.isACHPaymentViewTransactionsEnabled = "true";
    this.isACHPaymentApproveTransactionsEnabled = "true";
    this.isACHPaymentSelfApprovalEnabled = "true";
    this.isACHPaymentManagePayeesEnabled = "true";
    this.isACHCollectionViewTransactionsEnabled = "true";
    this.isACHCollectionApproveTransactionsEnabled = "true";
    this.isACHCollectionSelfApprovalEnabled = "true";
    this.isACHCollectionManagePayeesEnabled = "true";
    this.isUserManagementEnabled = "true";
    this.isCardManagementEnabled = "true";
    this.isCheckManagementEnabled = "true";
    this.isDisputeTransactionsEnabled = "true";
    this.isAccountSettingsEnabled = "true";
    this.isManageEstatementsEnabled = "true";
    this.isAlertManagementEnabled = "true";

    //Min Limits

    this.minInternalFundTransfersCreateTransactionLimit = "1";
    this.minTransferBetweenCustomersAccountsCreateTransactionLimit = "1";
    this.minInterbankAccountToAccountFundTransferCreateTransactionLimit = "1";
    this.minInternationAccountToAccountFundTransferCreateTransactionLimit = "1";
    this.minDomesticWireTransfersCreateTransactionLimit = "1";
    this.minInternationalWireTransfersCreateTransactionLimit = "1";
    this.minBillPaymentCreateTransactionLimit = "1";
    this.minP2PCreateTransactionLimit = "1";
    this.minACHPaymentCreateTransactionLimit = "1";
    this.minACHCollectionCreateTransactionLimit = "1";
    this.minInternalFundTransfersViewTransactionsLimit = "1";
    this.minInternalFundTransfersApproveTransactionsLimit = "1";
    this.minInternalFundTransfersSelfApprovalLimit = "1";
    this.minInternalFundTransfersManagePayeesLimit = "1";
    this.minIntraBankFundTransferViewTransactionsLimit = "1";
    this.minIntraBankFundTransferApproveTransactionsLimit = "1";
    this.minTransferBetweenCustomersAccountsViewTransactionsLimit = "1";
    this.minTransferBetweenCustomersAccountsApproveTransactionsLimit = "1";
    this.minTransferBetweenCustomersAccountsSelfApprovalLimit = "1";
    this.minTransferBetweenCustomersAccountsManagePayeesLimit = "1";
    this.minInterbankAccountToAccountFundTransferViewTransactionsLimit = "1";
    this.minInterbankAccountToAccountFundTransferApproveTransactionsLimit = "1";
    this.minInterbankAccountToAccountFundTransferSelfApprovalLimit = "1";
    this.minInterbankAccountToAccountFundTransferManagePayeesLimit = "1";
    this.minInternationAccountToAccountFundTransferViewTransactionsLimit = "1";
    this.minInternationAccountToAccountFundTransferApproveTransactionsLimit = "1";
    this.minInternationAccountToAccountFundTransferSelfApprovalLimit = "1";
    this.minInternationAccountToAccountFundTransferManagePayeesLimit = "1";
    this.minDomesticWireTransfersViewTransactionsLimit = "1";
    this.minDomesticWireTransfersApproveTransactionsLimit = "1";
    this.minDomesticWireTransfersSelfApprovalLimit = "1";
    this.minDomesticWireTransfersManagePayeesLimit = "1";
    this.minInternationalWireTransfersViewTransactionsLimit = "1";
    this.minInternationalWireTransfersApproveTransactionsLimit = "1";
    this.minInternationalWireTransfersSelfApprovalLimit = "1";
    this.minInternationalWireTransfersManagePayeesLimit = "1";
    this.minBillPaymentViewTransactionsLimit = "1";
    this.minBillPaymentApproveTransactionsLimit = "1";
    this.minBillPaymentSelfApprovalLimit = "1";
    this.minBillPaymentManagePayeesLimit = "1";
    this.minP2PViewTransactionsLimit = "1";
    this.minP2PApproveTransactionsLimit = "1";
    this.minP2PSelfApprovalLimit = "1";
    this.minP2PManagePayeesLimit = "1";
    this.minACHPaymentViewTransactionsLimit = "1";
    this.minACHPaymentApproveTransactionsLimit = "1";
    this.minACHPaymentSelfApprovalLimit = "1";
    this.minACHPaymentManagePayeesLimit = "1";
    this.minACHCollectionViewTransactionsLimit = "1";
    this.minACHCollectionApproveTransactionsLimit = "1";
    this.minACHCollectionSelfApprovalLimit = "1";
    this.minACHCollectionManagePayeesLimit = "1";
    this.minUserManagementLimit = "1";
    this.minCardManagementLimit = "1";
    this.minCheckManagementLimit = "1";
    this.minDisputeTransactionsLimit = "1";
    this.minAccountSettingsLimit = "1";
    this.minManageEstatementsLimit = "1";
    this.minAlertManagementLimit = "1";


    //Max Limits

    this.maxInternalFundTransfersCreateTransactionLimit = "100000";
    this.maxTransferBetweenCustomersAccountsCreateTransactionLimit = "100000";
    this.maxInterbankAccountToAccountFundTransferCreateTransactionLimit = "100000";
    this.maxInternationAccountToAccountFundTransferCreateTransactionLimit = "100000";
    this.maxDomesticWireTransfersCreateTransactionLimit = "100000";
    this.maxInternationalWireTransfersCreateTransactionLimit = "100000";
    this.maxBillPaymentCreateTransactionLimit = "100000";
    this.maxP2PCreateTransactionLimit = "100000";
    this.maxACHPaymentCreateTransactionLimit = "100000";
    this.maxACHCollectionCreateTransactionLimit = "100000";
    this.maxInternalFundTransfersViewTransactionsLimit = "100000";
    this.maxInternalFundTransfersApproveTransactionsLimit = "100000";
    this.maxInternalFundTransfersSelfApprovalLimit = "100000";
    this.maxInternalFundTransfersManagePayeesLimit = "100000";
    this.maxIntraBankFundTransferViewTransactionsLimit = "100000";
    this.maxIntraBankFundTransferApproveTransactionsLimit = "100000";
    this.maxTransferBetweenCustomersAccountsViewTransactionsLimit = "100000";
    this.maxTransferBetweenCustomersAccountsApproveTransactionsLimit = "100000";
    this.maxTransferBetweenCustomersAccountsSelfApprovalLimit = "100000";
    this.maxTransferBetweenCustomersAccountsManagePayeesLimit = "100000";
    this.maxInterbankAccountToAccountFundTransferViewTransactionsLimit = "100000";
    this.maxInterbankAccountToAccountFundTransferApproveTransactionsLimit = "100000";
    this.maxInterbankAccountToAccountFundTransferSelfApprovalLimit = "100000";
    this.maxInterbankAccountToAccountFundTransferManagePayeesLimit = "100000";
    this.maxInternationAccountToAccountFundTransferViewTransactionsLimit = "100000";
    this.maxInternationAccountToAccountFundTransferApproveTransactionsLimit = "100000";
    this.maxInternationAccountToAccountFundTransferSelfApprovalLimit = "100000";
    this.maxInternationAccountToAccountFundTransferManagePayeesLimit = "100000";
    this.maxDomesticWireTransfersViewTransactionsLimit = "100000";
    this.maxDomesticWireTransfersApproveTransactionsLimit = "100000";
    this.maxDomesticWireTransfersSelfApprovalLimit = "100000";
    this.maxDomesticWireTransfersManagePayeesLimit = "100000";
    this.maxInternationalWireTransfersViewTransactionsLimit = "100000";
    this.maxInternationalWireTransfersApproveTransactionsLimit = "100000";
    this.maxInternationalWireTransfersSelfApprovalLimit = "100000";
    this.maxInternationalWireTransfersManagePayeesLimit = "100000";
    this.maxBillPaymentViewTransactionsLimit = "100000";
    this.maxBillPaymentApproveTransactionsLimit = "100000";
    this.maxBillPaymentSelfApprovalLimit = "100000";
    this.maxBillPaymentManagePayeesLimit = "100000";
    this.maxP2PViewTransactionsLimit = "100000";
    this.maxP2PApproveTransactionsLimit = "100000";
    this.maxP2PSelfApprovalLimit = "100000";
    this.maxP2PManagePayeesLimit = "100000";
    this.maxACHPaymentViewTransactionsLimit = "100000";
    this.maxACHPaymentApproveTransactionsLimit = "100000";
    this.maxACHPaymentSelfApprovalLimit = "100000";
    this.maxACHPaymentManagePayeesLimit = "100000";
    this.maxACHCollectionViewTransactionsLimit = "100000";
    this.maxACHCollectionApproveTransactionsLimit = "100000";
    this.maxACHCollectionSelfApprovalLimit = "100000";
    this.maxACHCollectionManagePayeesLimit = "100000";
    this.maxUserManagementLimit = "100000";
    this.maxCardManagementLimit = "100000";
    this.maxCheckManagementLimit = "100000";
    this.maxDisputeTransactionsLimit = "100000";
    this.maxAccountSettingsLimit = "100000";
    this.maxManageEstatementsLimit = "100000";
    this.maxAlertManagementLimit = "100000";
    this.maxAttachmentsAllowed = "5";
    this.maxFileSizeAllowed = "2";

    this.serverTimeZone = 'UTC';
    this.timeZoneOffset =  "UTC+05:30" ;
    //START OLB Configurations
    this.isFastTransferEnabled = 'true';
    this.isAlertAccountIDLevel = 'true';
    this.isAppRefreshed = 'false';
    this.appLaunchedMode = '';
    this.billPayOneTimePayment = 'true';
    this.canViewPastEBills = 'true';
    this.addExternalAccount = 'true';
    this.verifyByCredentials = 'true';
    this.fundTransferHistory = 'true';
    this.enrolSecurityQuestionsAvailable = 'true';
    this.editUsername = 'true';
    this.editPassword = 'true';
    this.idleTimeOut = '5';
    this.loanPaymentEnabled = 'true';
    this.showLoanUpdateDisclaimer = 'true';
    this.loanPaymentAfterDueDateEnabled = 'true';
    this.modifyLoanPaymentAmount = 'true';
    this.editNickNameAccountSettings = 'true';
    this.limitLoanTransfersEnabled = 'true';
    this.payOffLoanPaymentEnabled = 'true';
    this.billPaySearch = 'true';
    this.canSearchTransfers = 'true';
    this.isInteractiveNotificationEnabled = 'true';
    this.editDisputeATransaction = 'true';
    this.printingTransactionDetails = 'true';
    this.enableDefaultAccounts = 'true';
    this.reOrderAccountPreferences = 'true';
    this.enableProfileSettings = 'true';
    this.enablePhoneSettings = 'true';
    this.enableEmailSettings = 'true';
    this.enableAddressSettings = 'true';
    this.enableUsernameAndPasswordSettings = 'true';
    this.enableSecurityQuestionsSettings = 'true';
    this.enableSecureAccessCodeSettings = 'true';
    this.enableAccountPreferences = 'true';
    this.enableAlertSettings = 'true';
    this.enableAlertsIcon = 'true';
    this.serviceFeeFlag = 'false';
    this.p2pServiceFee = '0.1';
    this.canSearchP2PPersons = 'true';
    this.payApersonOneTimePayment = 'true';
    this.backendDateFormat = 'yyyy-mm-dd';
    this.additionalAddressAllowed = 'true';
    this.additionalPhoneAllowed = 'true';
    this.getDashboardMessageCount = '3';
    this.isPFMWidgetEnabled = 'true';
    this.enableEstatements = 'true';
    this.eStatementsFormat = 'pdf,csv';
    this.pfmMaxYears = '5';
    this.wireTranferFees = '0';
    this.enableStopPayments = 'true';
    this.enalbeStopPaymentServiceFeesAndValidity = 'true';
    this.checkServiceFee = '30';
    this.checkServiceVality = '6';
    this.isAggregatedAccountsEnabled = 'true';
    this.isMFAEnabledForP2P = 'false';
    this.minimumAmountForMFAP2P = '100';
    this.isMFAEnabledForWireTransfer = 'false';
    this.minimumAmountForMFAWireTransfer = '100';
    this.isMFAEnabledForBillPay = 'false';
    this.minimumAmountForMFABillPay = '50';
    this.numberOfLocations = 5;
    this.onBoardingAppName = 'Origination';
    this.onBoardingAppDirectionURL = '';
	  this.embeddedOrigination = '';
    this.fastTransfersFlowEnabled = "true";
    this.isFeedbackEnabled = "true";
    this.showFeedBackPostLogout="true";
    this.majorVersions = ["4.2", "4.3", "4.4"];
    this.mapKey = '';
    this.transactionsCount =null;
    this.EngageEnabled = 'false';
    this.bulkWireFileTransactionsLimit = '0';
    this.isPostLoginAdsEnabled = 'false';
    this.isAccountDetailsServiceConfigured = "true";
    this.userAccounts = null;
    this.tncRefreshPeriod = "";
    this.lastModifiedTSforTNC = "";
    //END OLB Configurations
    //OLB START Entitlements
    this.isWatchlistEnabled = 'false';
    this.isBillPayEnabled = 'false';
    this.minBillPayLimit = '1';
    this.maxBillPayLimit = '100000';
    this.isPayAPersonEnabled = 'false';
    this.minP2PLimit = '1';
    this.maxP2PLimit = '100000';
    this.isRDCEnabled = 'false';
    this.minRDCLimit = '1';
    this.maxRDCLimit = '100000';
    this.isTransfersEnabled = 'false';
    this.minTransferLimit = '1';
    this.maxTransferLimit = '100000';
    this.isInternationalWireTransferEnabled = 'false';
    this.isDomesticWireTransferEnabled = 'false';
    this.minInternationalWireTransferLimit = '1';
    this.maxInternationalWireTransferLimit = '100000';
    this.minDomesticWireTransferLimit = '1';
    this.maxDomesticWireTransferLimit = '100000';
    this.isKonyBankAccountsTransfer = 'true';
    this.minKonyBankAccountsTransferLimit = '1';
    this.maxKonyBankAccountsTransferLimit = '100000';
    this.isOtherKonyAccountsTransfer = 'false';
    this.minOtherKonyAccountsTransferLimit = '1';
    this.maxOtherKonyAccountsTransferLimit = '100000';
    this.isOtherBankAccountsTransfer = 'true';
    this.minOtherBankAccountsTransferLimit = '1';
    this.maxOtherBankAccountsTransferLimit = '100000';
    this.isInternationalAccountsTransfer = 'true';
    this.minInternationalAccountsTransferLimit = '1';
    this.maxInternationalAccountsTransferLimit = '100000';
    this.isSecurityQuestionConfigured = 'false';
    this.payeeBillsLimit = '12';
    this.isBusinessOwner = 'false';
    this.defaultCountryISDCode = "+1";
    this.cardStatementYears= 1;
    this.KonyBankAccountsAutoDeniedTransferLimit = '100000';
    this.OtherKonyAccountsAutoDeniedTransferLimit = '100000';
    this.OtherBankAccountsAutoDeniedTransferLimit = '100000';
    this.InternationalAccountsAutoDeniedTransferLimit = '100000';
    this.P2PAutoDeniedTransferLimit = '100000';
    this.numberOfYearsToViewStatements=2;
    this.isSBAVisible = {
      "sba": false,
      "enrol": false,
      "cashFlow": false,
      "receivables": false,
      "payables": false
    };
	  this.accountTypes = {
      SAVINGS: 'Savings',
      CHECKING: 'Checking',
      CREDITCARD: 'CreditCard',
      LOAN: 'Loan',
      MORTGAGE: 'Mortgage',
      DEPOSIT: 'Deposit',
      OTHER: 'Other',
      EXTERNAL: 'External',
      CURRENT: 'CURRENT',
        INVESTMENT:'Investment',
      LINE_OF_CREDIT: 'Line of Credit',
      MORTGAGE_FACILITY : 'mortgageFacility'
    };
    this.transactionTypes = {
      INTERNAL : 'InternalTransfer',
      BILLPAY : 'BillPay',
      EXTERNAL : 'ExternalTransfer',
      DEPOSIT : 'Deposit',
      P2P : 'P2P',
      CARDLESS : 'Cardless',
      CHECKWITHDRAWAL : 'CheckWithdrawal',
      WITHDRAWAL : 'Withdrawal',
      INTEREST : 'Interest',
      REQUEST : 'Request',
      LOAN : 'Loan',
      RECEIVEDP2P : 'ReceivedP2P',
      RECEIVEDREQUEST : 'ReceivedRequest',
      FEES : 'Fees',
      INTERESTCREDIT : 'InterestCredit',
      INTERESTDEBIT : 'InterestDebit',
      WIRE : 'Wire',
      STOPCHECKPAYEMENTREQUEST : 'StopCheckPaymentRequest',
      INTERNETBANKING : 'InternetTransaction'
    };
    this.pfmTypes = {
      Home : "Home",
      Utilities : "Utilities",
      Financial : "Financial",
      Education : "Education",
      Transportation : "Transportation",
      Health : "Health",
      Travel : "Travel",
      Food : "Food",
      Uncategorised : "Uncategorised",
      Other : "Other",
    };
    this.corporateSwiftTags = {
      "referenceNumber": "20",
      "currencyAmount": "32B",
      "tolerancePercentage": "39A",
      "maximumCreditAmount": "39B",
      "currencyAdditionalPayableAmount": "39C",
      "paymentTerms": "40A",
      "availableWith": "41A",
      "issueDate": "31C",
      "expiryDate": "31D",
      "expiryPlace": "31D",
      "chargesAccount": "71D",
      "commissionAccount": "NA",
      "marginAccount": "NA",
      "messageToBank": "NA",
      "beneficiaryName": "59",
      "beneficiaryAddress": "59",
      "beneficiaryCity": "59",
      "beneficiaryState": "59",
      "beneficiaryZipCode": "59",
      "beneficiaryBankName": "57A",
      "beneficiaryBankAddress": "57A",
      "beneficiaryBankCity": "57A",
      "beneficiaryBankState": "57A",
      "beneficiaryBankZipCode": "57A",
      "placeOfTakingInCharge": "44A",
      "portOfLoading": "44E",
      "portOfDischarge": "44F",
      "placeOfFinalDelivery": "44B",
      "latestShipmentDate": "44C",
      "transhipment": "43T",
      "partialShipment": "43P",
      "incoTerms": "44D",
      "modeOfShipment": "NA",
      "descriptionOfGoods": "45A",
      "documentsRequired": "46A",
      "additionalCondition": "47A",
      "otherAdditionalCondition": "NA",
      "charges": "71D",
      "confirmationInstructions": "49",
      "transferable": "NA",
      "standByLC": "NA",
      "uploadedDocuments": "NA",
      "sequenceOfTotal": "27",
      "applicableRules": "40E",
      "applicant": "50",
      "draftsAt": "42C",
      "drawee": "42D",
      "loadonBoard": "44A",
      "detailsofcharges": "71B",
      "periodforPresentation": "48",
      "reimbursingBank": "53A",
      "instructionsToThePay": "78",
      "senderToReceiverInformation": "72"
    };

    this.guaranteeSwiftTags = {
      "productType": "22D",
      "GTAndSBLCType": "NA",
      "relatedTransactionReference": "20",
      "modeofTransaction": "NA",
      "instructingParty": "51",
      "applicantParty": "50",
      "currencyAndAmount": "32B",
      "demand": "48B",
      "transferable": "48D",
      "expectedIssueDate": "30",
      "expiryType": "23B",
      "expiryDate": "31E",
      "expiryConditions": "35G",
      "autoExtension": "NA",
      "extensionPeriod": "23F",
      "extensionCapPeriod": " 31S",
      "notificationPeriod": "26E",
      "extensionDetails": "78",
      "governingLaw": "44H",
      "applicableRules": "40C",
      "otherInstructions": "NA",
      "deliveryInstructions": "24G",
      "beneficiaryName": "59A",
      "beneficiaryAddress": "59D",
      "beneficiaryCity": "59D",
      "beneficiaryState": "59D",
      "beneficiaryCountry": "59D",
      "beneficiaryZipCode": "59D",
      "advisingBankName": "56A",
      "advisingBankAddress": "56D",
      "swiftCode": "56A",
      "iban": "NA",
      "bic": "NA",
      "countrySpecificCode": "NA",
      "advisingBankCity": "56D",
      "advisingBankState": "56D",
      "advisingBankCountry": "56D",
      "advisingBankZipCode": "56D",
      "settlementAccount": "NA",
      "limitInstructions": "NA",
      "messageToBank": "NA",
      "clauseAndConditionType": "77U",
      "clauseAndConditionTitle": "NA",
      "clauseAndConditionDescription": "77U",
      "newSequence": "15A",
      "purposeOfMessage": "22A",
      "newSequenceB": "15B",
      "undertakingNumber": "20",
      "dateOfIssue": "30",
      "formOfUndertaking": "22D",
      "applicableRulesC": "40C",
      "expiryType": "23B",
      "dateOfExpiry": "31E",
      "issuer": "52A",
      "beneficiary": "59",
      "advisingBank": "56A",
      "adviseThroughBank": "57A",
      "undertakingAmount": "32B",
      "availableWith": "41F",
      "documentAndPresentationInstructions": "45C",
      "undertakingTermsAndConditions": "77U",
      "governingLawPlaceOfJurisdiction": "44H",
      "automaticExtensionPeriod": "23F",
      "automaticExtensionNonExtensionNotification": "78",
      "automaticExtensionNotificationPeriod": "26E",
      "automaticExtensionFinalExpiryDate": "31S",
      "demandIndicator": "48B",
      "underlyingTransactionDetails": "45L",
      "deliveryOfOriginalUndertaking": "24E",
      "deliveryCollectionBy": "24G"
  };

  this.swiftTagsWithDbValues = [
    {
      "swiftTag": "15A",
      "tagName": kony.i18n.getLocalizedString("i18n.TradeFinance.NewSequenceWithColon"),
      "tagNameInDB": "newSequence"
    },
    {
      "swiftTag": "27",
      "tagName": kony.i18n.getLocalizedString("i18n.TradeFinance.SequenceofTotalWithColon"),
      "tagNameInDB": "sequenceOfTotal"
    },
    {
      "swiftTag": "22A",
      "tagName": kony.i18n.getLocalizedString("i18n.TradeFinance.PurposeofMessageWithColon"),
      "tagNameInDB": "purposeOfMessage"
    },
    {
      "swiftTag": "72Z",
      "tagName": kony.i18n.getLocalizedString("i18n.TradeFinance.senderInformationWithColon"),
      "tagNameInDB": "senderInformation"
    },
    {
      "swiftTag": "23X",
      "tagName": kony.i18n.getLocalizedString("i18n.TradeFinance.fileIdentificationWithColon"),
      "tagNameInDB": "fileIdentification"
    },
    {
      "swiftTag": "30",
      "tagName": kony.i18n.getLocalizedString("i18n.StopPayments.DateOfIssueWithColon"),
      "tagNameInDB": "dateOfIssue"
    },
    {
      "swiftTag": "22D",
      "tagName": kony.i18n.getLocalizedString("i18n.TradeFinance.FormofUndertakingWithColon"),
      "tagNameInDB": "formOfUndertaking"
    },
    {
      "swiftTag": "40C",
      "tagName": kony.i18n.getLocalizedString("i18n.TradeFinance.ApplicableRulesWithColon"),
      "tagNameInDB": "applicableRules"
    },
    {
      "swiftTag": "23B",
      "tagName": kony.i18n.getLocalizedString("i18n.TradeFinance.expiryTypeWithColon"),
      "tagNameInDB": "expiryType"
    },
    {
      "swiftTag": "31E",
      "tagName": kony.i18n.getLocalizedString("i18n.TradeFinance.DateofExpiryWithColon"),
      "tagNameInDB": "dateOfExpiry"
    },
    {
      "swiftTag": "35G",
      "tagName": kony.i18n.getLocalizedString("i18n.TradeFinance.expiryConditionWithColon"),
      "tagNameInDB": "expiryCondition"
    },
    {
      "swiftTag": "50",
      "tagName": kony.i18n.getLocalizedString("i18n.TradeFinance.ApplicantWithColon"),
      "tagNameInDB": "applicantParty"
    },
    {
      "swiftTag": "52A",
      "tagName": kony.i18n.getLocalizedString("i18n.TradeFinance.IssuerWithColon"),
      "tagNameInDB": "issuer"
    },
    {
      "swiftTag": "59A",
      "tagName": kony.i18n.getLocalizedString("i18n.TradeFinance.BeneficiaryWithColon"),
      "tagNameInDB": "beneficiaryName"
    },
    {
      "swiftTag": "56A",
      "tagName": kony.i18n.getLocalizedString("i18n.TradeFinance.AdvisingBankWithColon"),
      "tagNameInDB": "advisingBank"
    },
    {
      "swiftTag": "23",
      "tagName": kony.i18n.getLocalizedString("i18n.TradeFinance.advisingBankReferenceWithColon"),
      "tagNameInDB": "advisingBankRef"
    },
    {
      "swiftTag": "57A",
      "tagName": kony.i18n.getLocalizedString("i18n.TradeFinance.tradeAdviseThroughBankWithColon"),
      "tagNameInDB": "adviseThroughBank"
    }, {
      "swiftTag": "32B",
      "tagName": kony.i18n.getLocalizedString("i18n.TradeFinance.UndertakingAmountWithColon"),
      "tagNameInDB": "undertakingAmount"
    },
    {
      "swiftTag": "39D",
      "tagName": kony.i18n.getLocalizedString("i18n.TradeFinance.additionalAmountInfoWithColon"),
      "tagNameInDB": "additionalAmountInfo"
    },
    {
      "swiftTag": "41A",
      "tagName": kony.i18n.getLocalizedString("i18n.TradeFinance.AvailableWithColon"),
      "tagNameInDB": "availableWith"
    },
    {
      "swiftTag": "71D",
      "tagName": kony.i18n.getLocalizedString("i18n.TradeFinance.ChargesWithColon"),
      "tagNameInDB": "charges"
    },
    {
      "swiftTag": "45C",
      "tagName": kony.i18n.getLocalizedString("i18n.TradeFinance.DocumentandPresentationInstructionsWithColon"),
      "tagNameInDB": "docPresentation"
    },
    {
      "swiftTag": "77U",
      "tagName": kony.i18n.getLocalizedString("i18n.TradeFinance.UndertakingTermsandConditionsWithColon"),
      "tagNameInDB": "undertakingTermsAndConditions"
    },
    {
      "swiftTag": "49",
      "tagName": kony.i18n.getLocalizedString("i18n.TradeFinance.ConfirmationInstructionsWithColon"),
      "tagNameInDB": "confirmationInstructions"
    },
    {
      "swiftTag": "58A",
      "tagName": kony.i18n.getLocalizedString("i18n.TradeFinance.reqConfirmationPartyWithColon"),
      "tagNameInDB": "requestedConfirmationParty"
    },
    {
      "swiftTag": "44H",
      "tagName": kony.i18n.getLocalizedString("i18n.TradeFinance.GoverningLawandPlaceofJurisdictionWithColon"),
      "tagNameInDB": "governingLaw"
    },
    {
      "swiftTag": "23F",
      "tagName": kony.i18n.getLocalizedString("i18n.TradeFinance.AutomaticExtensionPeriodWithColon"),
      "tagNameInDB": "extensionPeriod"
    },
    {
      "swiftTag": "78",
      "tagName": kony.i18n.getLocalizedString("i18n.TradeFinance.AutomaticExtensionNonExtensionNotificationWithColon"),
      "tagNameInDB": "extensionNotification"
    },
    {
      "swiftTag": "26E",
      "tagName": kony.i18n.getLocalizedString("i18n.TradeFinance.AutomaticExtensionNotificationPeriodWithColon"),
      "tagNameInDB": "notificationPeriod"
    },
    {
      "swiftTag": "31S",
      "tagName": kony.i18n.getLocalizedString("i18n.TradeFinance.AutomaticExtensionFinalExpiryDateWithColon"),
      "tagNameInDB": "extendExpiryDate"
    },
    {
      "swiftTag": "48B",
      "tagName": kony.i18n.getLocalizedString("i18n.TradeFinance.DemandIndicatorWithColon"),
      "tagNameInDB": "demandIndicator"
    },
    {
      "swiftTag": "48D",
      "tagName": kony.i18n.getLocalizedString("i18n.TradeFinance.transferIndicatorWithColon"),
      "tagNameInDB": "transferIndicator"
    },
    {
      "swiftTag": "39E",
      "tagName": kony.i18n.getLocalizedString("i18n.TradeFinance.transferConditionsWithColon"),
      "tagNameInDB": "transferConditions"
    },
    {
      "swiftTag": "45L",
      "tagName": kony.i18n.getLocalizedString("i18n.TradeFinance.UnderlyingTransactionDetailsWithColon"),
      "tagNameInDB": "underlyingTransactionDetails"
    },
    {
      "swiftTag": "24E",
      "tagName": kony.i18n.getLocalizedString("i18n.TradeFinance.DeliveryofOriginalUndertakingWithColon"),
      "tagNameInDB": "deliveryUndertaking"
    },
    {
      "swiftTag": "24G",
      "tagName": kony.i18n.getLocalizedString("i18n.TradeFinance.DeliveryToCollectionByWithColon"),
      "tagNameInDB": "deliveryTo"
    },
    {
      "swiftTag": "31C",
      "tagName": kony.i18n.getLocalizedString("i18n.TradeFinance.reqDateOfIssueWithColon"),
      "tagNameInDB": "reqDate"
    },
    {
      "swiftTag": "22K",
      "tagName": kony.i18n.getLocalizedString("i18n.TradeFinance.typeOfUndertakingWithColon"),
      "tagNameInDB": "typeOfUndertaking"
    },
    {
      "swiftTag": "51",
      "tagName": kony.i18n.getLocalizedString("i18n.TradeFinance.obligorInstructingPartyWithColon"),
      "tagNameInDB": "obligor"
    },
    {
      "swiftTag": "59",
      "tagName": kony.i18n.getLocalizedString("i18n.TradeFinance.BeneficiaryWithColon"),
      "tagNameInDB": "beneficiary"
    },
    {
      "swiftTag": "45C",
      "tagName": kony.i18n.getLocalizedString("i18n.TradeFinance.DocumentandPresentationInstructionsWithColon"),
      "tagNameInDB": "presentationInstructions"
    },
    {
      "swiftTag": "77L",
      "tagName": kony.i18n.getLocalizedString("i18n.TradeFinance.reqDateOfIssueWithColon"),
      "tagNameInDB": "undertakingTermsAndConditions"
    },
    {
      "swiftTag": "22Y",
      "tagName": kony.i18n.getLocalizedString("i18n.TradeFinance.standardWordingRequiredWithColon"),
      "tagNameInDB": "wordingReq"
    },
    {
      "swiftTag": "40D",
      "tagName": kony.i18n.getLocalizedString("i18n.TradeFinance.standardWordingRequestedLanguageWithColon"),
      "tagNameInDB": "wordingReqLang"
    },
  ];

    //International Transfer
    this.internationalTransactionFee = '10';
    this.internationalTransactionFeeEnabled = 'true';
    this.BANNER_IMAGE = "";
    this.DESKTOP_BANNER_IMAGE = "";
    this.MOBILE_BANNER_IMAGE = "";
    this.LINK_TO_DBX = "";
    //END OLB Configurations

    // [Trixon] Configured App store links for Android and IOS
    // [Trixon] TODO: Add Huawei AppGallery link
    this.androidPhoneNativeAppLink =
      'https://play.google.com/store/apps/details?id=com.boa.apollo';
    this.iphoneNativeAppLink =
      'https://apps.apple.com/us/app/apollo-digital/id1601224628';
    this.androidTabletNativeAppLink =
      'https://play.google.com/store/apps/details?id=com.boa.apollo';
    this.ipadNativeAppLink =
      'https://apps.apple.com/us/app/apollo-digital/id1601224628';
    // [Trixon] Ended
    
    this.servicesListForUser = [];
    /**@member {boolean} AggregatedExternalAccountEnabled used for tracking the Aggregated External Account Enabled status*/
    this.AggregatedExternalAccountEnabled = false;
    /**@member {string} isStartupCompleted used for tracking the Startup status*/
    this.isStartupCompleted = '';
    this.DebugMode = false; // This parameter is for enabling Logging in release mode.
    var HashTable = require('HashTable');
    /**@member {object} configurations contains instance of HashTable*/
    this.configurations = new HashTable();
    /**@member {OBJECT}  contains all currency codes*/
    this.currencyCode = {
      ETB: 'ETB', // [Trixo] Added Ethiopian Birr currency
      USD: '$', // US Dollar
      EUR: '€', // Euro
      CRC: '₡', // Costa Rican Colón
      GBP: '£', // British Pound Sterling
      ILS: '₪', // Israeli New Sheqel
      INR: '₹', // Indian Rupee
      JPY: '¥', // Japanese Yen
      KRW: '₩', // South Korean Won
      NGN: '₦', // Nigerian Naira
      PHP: '₱', // Philippine Peso
      PLN: 'zł', // Polish Zloty
      PYG: '₲', // Paraguayan Guarani
      THB: '฿', // Thai Baht
      UAH: '₴', // Ukrainian Hryvnia
      VND: '₫', // Vietnamese Dong
      AUD: '$', // Australian Dollar
      CAD: '$', // Canadian Dollar
      CHF: 'Fr.', //Swiss Franc
      AED: 'د.إ', //UAE
      RUB: '₽', //Russian
	    HKD: 'HK$', //Hongkong Dollar
      BRL: 'R$', // (Brazilian Real)
      CNY: '¥', // (Chinese Yuan Renminbi)
      DKK: 'kr', // (Danish Krone)
      MXN: '$', // (Mexican Peso)
      NOK: 'kr', // (Norwegian Krone)
      NZD: '$', // (New Zealand Dollar)
      PHP: '₱', // (Philippine Peso)
      PLN: 'zł', // (Polish Zloty)
      PYG: '₲', // (Paraguayan Guarani)
      QAR: '﷼', // (Qatari Riyal)
      RUB: '₽', // (Russian)
      SAR: '﷼', // (Saudi Riyal)
      SEK: 'kr', // (Swedish Krona)
      SGD: '$', // (Singapore Dollar)
      THB: '฿', // (Thai Baht)
      TRY: '₺', // (Turkish Lira)
      USD: '$', // (US Dollar)
      VND: '₫', // (Vietnamese Dong)
      ZAR: 'R', // (South African Rand)
      AMD: '֏', //Armenian Dram
      ARS: '$', // Argentine Peso
      AZN: '₼', // Azerbaijani Manat
      BGN: 'лв', //Bulgarian Lev
      GEL: '₾', //Lari
      JOD: 'دينار', // Jordanian Dinar
     // KWD: 'د.ك', //Kuwait Dinars
	  KWD: 'KD', //Kuwait Dinars
      KZT: 'T', //Kazakhstan
      LKR: 'Rs',
      NPR: 'रू',//Nepali Rupee
      TND: 'د.ت', //Tunisian Dinar
      TWD: 'NT$', //Tai
      UZS: 'soʻm', //Uzbekistan Som
      ILS: '₪', //Shekel Israel
      KES: 'KSh',//Kenyan Shilling
      TZS: 'TSh',//Tanzanian Shilling
    };
    this.wireTransferCurrency = {
      '$' : 'USD', // US Dollar
      '€' : 'EUR', // Euro
      '£' : 'GBP', // British Pound Sterling
      '₹' : 'INR' 
    };

    // [Trixon] Configured Ethiopian local languages AND commented out unused foreign languages
    this.locale = {
      'US-English': 'en_US',
    //   'English' : 'en',
      'አማርኛ':'am_ET',
      'ትግርኛ':'ti_ET',
      'Afaan Oromoo':'om_ET',
      'Af Somali':'so_ET'
    //   'UK-English': 'en_GB',
    //   Spanish: 'es_ES',
    //   German: 'de_DE',
    //   French: 'fr_FR',
    //   'Arabic': 'ar_AE'
    };
    // [Trixon] Ended

    // [Trixon] Ended
    this.frontendDateFormat = {
      // [Trixon] Configured single date format
    //   en: 'd/m/Y',
      en_US: 'd/m/Y',
    //   en_GB: 'd/m/Y',
    //   es_ES: 'd/m/Y',
    //   de_DE: 'd.m.Y',
    //   fr_FR: 'd/m/Y',
    //   sv_SE: 'Y-m-d',
    //   ar_AE: 'd/m/Y',
      // [Trixon] Ended
    };
    this.termsAndConditions = {
      "Login" : 'Login_TnC',
      "Enroll" : 'Enroll_TnC',
      "EStatements":"Estatements_TnC",
      "Hamburger" : "Common_TnC",
      "Footer" : "Common_TnC",
      "BillPayment" : "BillPay_TnC",
      "QRPayment":"QRPayment_Activation_TnC",
      "NAO" : "Origination_TnC",
      "CardLock" : "LockCard_TnC",
      "CardCancel" : "CancelCard_TnC",
      "SEPA_TnC":"SEPA_TnC",
      "OnlineBankingAccess" : "OnlineBanking_Access_TnC",
      "AccountAggregation" : "AccountAggregation_TnC",
      "OpenNewAccount":"Origination_TnC",
      // [Trixon] Configured local language for TandC and commented out unused foreign language
      "am_ET":"am_ET",
      "ti_ET":"ti_ET",
      "om_ET":"om_ET",
      "so_ET":"so_ET",

    //   "de_DE":"de-DE",
    //   "en_GB":"en-GB",
      "en_US":"en-US",
    //   "es_ES":"es-ES",
    //   "fr_FR":"fr-FR",
    //   "it_IT":"it-IT",
    //   "sv_SE":"sv-SE",
    //   "ar_AE":"ar-AE"
    // [Trixon] Ended
    };
    this.accountsTypeMetaData = [
      {
        applicationValue: this.accountTypes.CHECKING,
        backendValue: kony.i18n.getLocalizedString(
          'kony.mb.Accounts.backend.Checking'
        ),
        displayValue: kony.i18n.getLocalizedString(
          'kony.mb.Accounts.display.Checking'
        ),
      },
      {
        applicationValue: this.accountTypes.SAVINGS,
        backendValue: kony.i18n.getLocalizedString(
          'kony.mb.Accounts.backend.Savings'
        ),
        displayValue: kony.i18n.getLocalizedString(
          'kony.mb.Accounts.display.Savings'
        ),
      },
      {
        applicationValue: this.accountTypes.CREDITCARD,
        backendValue: kony.i18n.getLocalizedString(
          'kony.mb.Accounts.backend.CreditCard'
        ),
        displayValue: kony.i18n.getLocalizedString(
          'kony.mb.Accounts.display.CreditCard'
        ),
      },
      {
        applicationValue: this.accountTypes.DEPOSIT,
        backendValue: kony.i18n.getLocalizedString(
          'kony.mb.Accounts.backend.Deposit'
        ),
        displayValue: kony.i18n.getLocalizedString(
          'kony.mb.Accounts.display.Deposit'
        ),
      },
      {
        applicationValue: this.accountTypes.MORTGAGE_FACILITY,
        backendValue: kony.i18n.getLocalizedString(
          'i18n.Accounts.backendMortgageFacility'
        ),
        displayValue: kony.i18n.getLocalizedString(
          'i18n.Accounts.backendMortgageFacility'
        ),
      },
      {
        applicationValue: this.accountTypes.MORTGAGE,
        backendValue: kony.i18n.getLocalizedString(
          'kony.mb.Accounts.backend.Mortgage'
        ),
        displayValue: kony.i18n.getLocalizedString(
          'kony.mb.Accounts.display.Mortgage'
        ),
      },
      {
        applicationValue: this.accountTypes.LOAN,
        backendValue: kony.i18n.getLocalizedString(
          'kony.mb.Accounts.backend.Loan'
        ),
        displayValue: kony.i18n.getLocalizedString(
          'kony.mb.Accounts.display.Loan'
        ),
      },
      {
        applicationValue: this.accountTypes.CURRENT,
        backendValue: kony.i18n.getLocalizedString(
          'kony.mb.Accounts.backend.Current'
        ),
        displayValue: kony.i18n.getLocalizedString(
          'kony.mb.Accounts.display.Current'
        ),
      },
      {
        applicationValue: this.accountTypes.LINE_OF_CREDIT,
        backendValue: kony.i18n.getLocalizedString(
          'kony.mb.Accounts.backend.LineOfCredit'
        ),
        displayValue: kony.i18n.getLocalizedString(
          'kony.mb.Accounts.display.LineOfCredit'
        ),
      },
      {
        applicationValue: this.accountTypes.EXTERNAL,
        backendValue: kony.i18n.getLocalizedString(
          'kony.mb.Accounts.backend.External'
        ),
        displayValue: kony.i18n.getLocalizedString(
          'kony.mb.Accounts.display.External'
        ),
      },
    ];
    /**Contains all microapp names as constants*/
    this.microappConstants = {
        ABOUTUS: 'AboutUsMA',
        ALERTSETTINGS: 'AlertSettingsMA',
        CONSENTMANAGEMENT: 'ConsentMgmtMA',
        BILLPAY: 'BillPayMA',
        DIGITALTRANSFER: 'TransfersMA',
        HOMEPAGE: 'HomepageMA',
        NOTIFICATIONS: 'NotificationsMA',
        SECUREMESSAGE: 'SecureMessageMA',
        PERSONALFINANCEMANAGEMENT: 'PfmMA',
        PORTFOLIO: 'PortfolioManagementMA' ,
        REGIONALTRANSFER: 'TransfersMA',
        UNIFIEDTRANSFER: 'TransfersMA',
        ACCOUNTSWEEP: 'AccountSweepsMA',
        WEALTHORDER: 'WealthOrderMA',
        WIRETRANSFER: 'WireTransferMA',
        COMMONS: 'CommonsMA',
        ACCAGGREGATION: 'AccAggregationMA',
        ARRANGEMENTS: 'ArrangementsMA',
        APPROVALMATRIX: 'ApprovalMatrixMA',
        USERMANAGEMENT: 'UserManagementMA',
        APPROVALREQUEST: 'ApprovalRequestMA',
        FOREIGNEXCHANGE: 'ForeignExchangeMA',
        BULKPAYMENTS: 'BulkPaymentsMA',
        FINANCEMANAGEMENT: 'FinanceManagementMA',
        CARDS: 'CardsMA',
        CAMPAIGN: 'CampaignMA',
        MANAGEARRANGEMENTS: 'ManageArrangementsMA',
        CBP: 'CBPMA',
        SELFSERVICEENROLMENT: 'SelfServiceEnrolmentMA',
        MANAGEPROFILE: 'ManageProfileMA',
        TRADEFINANCE: 'TradeFinanceMA',
        AUTHENTICATION: 'AuthenticationMA',
        SAVINGSPOT: 'SavingsPotMA',
		    ACH:'ACHMA',
        ACCOUNTSWEEP:'AccountSweepsMA',
        TRADESUPPLYFINANCE: 'TradeSupplyFinMA',
        SMARTBANKINGADVISORY: 'SBAdvisoryMA',
        TRADELENDING: 'TradeLendingMA'
    };
    
    /**@member {OBJECT}  Contains SBA constants*/
    this.SBAConstants = {
      SMARTBANKINGADVISORY: 'SmartBankingAdvisory',
      ENROL: 'Enrol',
      CASHFLOW: 'CashFlow',
      RECEIVABLE: 'AccountsReceivable',
      PAYABLE: 'AccountsPayable',
      SBA_PAYMENT_PROBABILITY_VIEW: 'SBA_PAYMENT_PROBABILITY_VIEW',
    };
    
    /**@member {OBJECT}  Contains all constants*/
    this.constants = {
      IDLE_TIMEOUT: 3,
      ALERT_IDLE_TIMEOUT:1,
      TRAVELPLANS_DESTINATION_LIMIT: 5,
      IDENTITYSERVICENAME: OLBConstants.IDENTITYSERVICENAME,
      WEEKLY: 'Weekly',
      DAILY: 'Daily',
      MONTHLY: 'Monthly',
      BIWEEKLY: 'Biweekely',
      SERVICE_NAME: 'RBSERVICES',
      LOADING_SCREEN_MESSAGE: 'Loading ...',
      CHECKING: 'Checking',
      SAVINGS: 'Savings',
      CREDITCARD: 'CreditCard',
      DEPOSIT: 'Deposit',
      MORTGAGE: 'Mortgage',
      LOAN: 'Loan',
      INVESTMENT: 'Investment',
      MORTGAGE_FACILITY : 'mortgageFacility',
      EXTERNAL_BANK_ACCOUNT: 'ExternalBankAccount',
      
        // [Trixon] Added Sidemenu item constants AND placed existing utilized menus here for code organization
            MENUACCOUNT: kony.i18n.getLocalizedString('cs.apollo.Account'),
            MENUSCHEDULEPAYMENTS: kony.i18n.getLocalizedString('cs.apollo.SchedulePayments'),
            MENURECEIVEPAYMENTS: kony.i18n.getLocalizedString('cs.apollo.ReceivePayments'),
            MENUCARDS: kony.i18n.getLocalizedString('cs.apollo.Cards'),
            MENUDEALSANDDISCOUNTS: kony.i18n.getLocalizedString('cs.apollo.DealsAndDiscounts'),
            MENUUSSD: kony.i18n.getLocalizedString('cs.apollo.USSD'),
            MENUREFERANDEARN: kony.i18n.getLocalizedString('cs.apollo.ReferAndEarn'),
            MENUMESSAGES: kony.i18n.getLocalizedString('cs.apollo.Messages'),
            MENUNOTIFICATIONS: kony.i18n.getLocalizedString('cs.apollo.Notifications'),
            MENULOCATE: kony.i18n.getLocalizedString('cs.apollo.LocateUs'),
            MENUSETTINGS: kony.i18n.getLocalizedString('cs.apollo.Settings'),
            MENUTERMSANDCONDITIONS: kony.i18n.getLocalizedString('cs.apollo.TermsandConditions'),
        // [Trixon] Ended 

      HEADERFAQ: kony.i18n.getLocalizedString('kony.mb.Support.HeaderFAQ'),
      HEADERPRIVACYPOLICY: kony.i18n.getLocalizedString('kony.mb.Support.HeaderPrivacyPolicy'),
      HEADERABOUTUS: kony.i18n.getLocalizedString('kony.mb.Support.HeaderAbout'),
      HEADERTERMSANDCONDITIONS: kony.i18n.getLocalizedString('kony.mb.Support.HeaderTC'),
      FAQ: kony.i18n.getLocalizedString('kony.mb.Support.FAQ'),
      PRIVACY: kony.i18n.getLocalizedString('kony.mb.Support.Privacy'),
      TERMS: kony.i18n.getLocalizedString('kony.mb.Support.Terms'),
      ABOUT: kony.i18n.getLocalizedString('kony.mb.Support.Aboutus'),

      Last7days: kony.i18n.getLocalizedString('kony.mb.AdvanceSearch.Last7days'),
      Last14days: kony.i18n.getLocalizedString('kony.mb.AdvanceSearch.last14days'),
      Last1Month: kony.i18n.getLocalizedString('kony.mb.AdvanceSearch.last1month'),
      Last2Months: kony.i18n.getLocalizedString('kony.mb.AdvanceSearch.last2months'),
      Last3Months: kony.i18n.getLocalizedString('kony.mb.AdvanceSearch.last3months'),
      Last6Months: kony.i18n.getLocalizedString('kony.mb.AdvanceSearch.last6months'),
      Last12Months: kony.i18n.getLocalizedString('kony.mb.AdvanceSearch.last12months'),
      Last30days: kony.i18n.getLocalizedString('kony.mb.AdvanceSearch.Last30days'),
      Last60days: kony.i18n.getLocalizedString('kony.mb.AdvanceSearch.Last60days'),

      CustomRange: kony.i18n.getLocalizedString('kony.mb.AdvanceSearch.CustomRange'),
      Withdrawals: kony.i18n.getLocalizedString('kony.mb.AdvanceSearch.Withdrawals'),
      Deposits: kony.i18n.getLocalizedString('kony.mb.AdvanceSearch.Deposits'),
      P2PDebits: kony.i18n.getLocalizedString('kony.mb.AdvanceSearch.P2PDebits'),
      BillPay: kony.i18n.getLocalizedString('kony.mb.AdvanceSearch.BillPay'),
      Transfers: kony.i18n.getLocalizedString('kony.mb.AdvanceSearch.Transfers'),
      Checks: kony.i18n.getLocalizedString('kony.mb.AdvanceSearch.Checks'),
      P2PCredits: kony.i18n.getLocalizedString('kony.mb.AdvanceSearch.P2PCredits'),
      Issued: kony.i18n.getLocalizedString('kony.mb.chequemgmt.issued'),
      Cleared: kony.i18n.getLocalizedString('kony.mb.chequemgmt.cleared'),
      Returned: kony.i18n.getLocalizedString('kony.mb.chequemgmt.returned'),
      Stopped: kony.i18n.getLocalizedString('kony.mb.chequemgmt.stopped'),
      ChequeStolen: kony.i18n.getLocalizedString('kony.mb.CM.chequeStolen'),
      FundsNotAvailable: kony.i18n.getLocalizedString('kony.mb.CM.fundsNotAvailable'),
      ChequeLost: kony.i18n.getLocalizedString('kony.mb.CM.chequeLost'),
      ChequeDestroyed: kony.i18n.getLocalizedString('kony.mb.CM.chequeDestroyed'),   

      MENUCHEQUEMANAGEMENT:kony.i18n.getLocalizedString('kony.mb.CM.chequeManagement'),
      MENUDASHBOARDOVERVIEW: kony.i18n.getLocalizedString('i18n.common.overview'),
      MENUACCOUNTS: kony.i18n.getLocalizedString('kony.mb.Hamburger.Accounts'),
      MENUTRANSFERS: kony.i18n.getLocalizedString('kony.mb.Hamburger.Transfers'),
      MENUACCOUNTSWEEP: kony.i18n.getLocalizedString('i18n.accountsweeps.accountSweep'),
      MENUQRPAYMENT: kony.i18n.getLocalizedString('i18n.qrpayments.QRPayments'),
      MENUUNIFIEDTRANSFERSFLOW: kony.i18n.getLocalizedString('kony.mb.Hamburger.unifiedTransfersFlow'),
      MENUMONEYMOVEMENTTRANSFERS: kony.i18n.getLocalizedString('kony.mb.Hamburger.MoneyMovementTransfers'),
      MENUTRANSFERSACTIVITY: kony.i18n.getLocalizedString('kony.mb.MM.transferActivity'),
      MENUMANAGERECIPIENTS: kony.i18n.getLocalizedString('kony.mb.MM.manageRecipients'),
      MENUMANAGETRANSACTIONS: kony.i18n.getLocalizedString('kony.mb.transfers.ManageTransactions'),
      MENUMANAGEBENEFICIARIES: kony.i18n.getLocalizedString('kony.mb.TransfersEurope.ManageBeneficiaries'),
      MENUDISPUTE: kony.i18n.getLocalizedString('kony.mb.disputedTransactions.DisputedTransactions'),
      MENUOPENACOUNT: kony.i18n.getLocalizedString('kony.mb.Hamburger.OpenAccount'),
      MENUACCOUNTSTATEMENTS:kony.i18n.getLocalizedString('kony.mb.Hamburger.AccountStatements'),
      MENUENGAGE: kony.i18n.getLocalizedString('kony.mb.Hamburger.Engage'),
      MENUSERVICEREQUESTS: kony.i18n.getLocalizedString('kony.mb.Hamburger.serviceRequests'),
      MENUCHATBOT: kony.i18n.getLocalizedString('kony.mb.Hamburger.chatbot'),
      MENUWEALTHWATCHLIST: kony.i18n.getLocalizedString('i18n.wealth.watchlistcard.header'),
      MENUCONTACT: kony.i18n.getLocalizedString('kony.mb.Hamburger.Contactus'),
      MENUMYWALLET: kony.i18n.getLocalizedString('kony.mb.Hamburger.Mywallet'),
      MENUBILLPAY: kony.i18n.getLocalizedString('kony.mb.Hamburger.BillPay'),
      MENUFEEDBACK: kony.i18n.getLocalizedString('kony.mb.Hamburger.FeedBack'),
      MENUEXPLOREPRODUCTSORRESUME: kony.i18n.getLocalizedString('i18n.hamburger.exploreProductsOrResumeApplication'),
      MENUCHECKDEPOSIT: kony.i18n.getLocalizedString('kony.mb.Hamburger.CheckDeposit'),
      MENUCARDLESS: kony.i18n.getLocalizedString('kony.mb.Hamburger.CardLessCash'),
      MENUCARDMANAGEMENT: kony.i18n.getLocalizedString('kony.mb.Hamburger.CardManagement'),
      MENUCONVERSATIONALBANKING: kony.i18n.getLocalizedString('kony.mb.Hamburger.ConversationalBanking'),
      MENUMANAGEOTHERBANKACCOUNTS: kony.i18n.getLocalizedString('kony.mb.ExternalAccounts.ManageOtherBankAccounts'),
      MENUPFMMYMONEY: kony.i18n.getLocalizedString('kony.mb.PFMMyMoney'),
      MENUSENDMONEY: kony.i18n.getLocalizedString('kony.mb.Transfer.SendMoney'),
      MENUACH: kony.i18n.getLocalizedString('kony.mb.Hamburger.ACH'),
      MENUAPPROVALREQUEST: kony.i18n.getLocalizedString('kony.mb.Hamburger.ApprovalRequest'),
      MENUUSERMANAGEMENT: kony.i18n.getLocalizedString('kony.mb.Hamburger.UserManagement'),
      MENUFOREIGNEXCHANGE: kony.i18n.getLocalizedString('kony.mb.Hamburger.exchangeRates'),
      MENUTRADEFINANCE: kony.i18n.getLocalizedString('i18n.TradeFinance.TradeFinanceHamburger'),
      MENUSECURITYNOTIFICATIONS: kony.i18n.getLocalizedString('kony.mb.Hamburger.SecurityNotifications'),
      MENUPASSCODE: kony.i18n.getLocalizedString('kony.mb.Hamburger.Passcode')!==null?kony.i18n.getLocalizedString('kony.mb.Hamburger.Passcode'):"Passcode",
      MENUBIOMETRICAPPROVAL: kony.i18n.getLocalizedString('kony.mb.Hamburger.BiometricApproval')!==null?kony.i18n.getLocalizedString('kony.mb.Hamburger.BiometricApproval'):"Biometric Approval"
    };

    this.reloadConstants();
    /**@member {Array} quickActionItems holds the list of action items required for transaction*/
    if (this.isFastTransfersFlowEnabled()){
      this.quickActionItems = [
        {
          id: 'ATM finder',
          title: 'Find an ATM',
          subtitle: '',
          icon: kony.forcetouch.QUICK_ACTION_ICON_TYPE_LOCATION,
          info: null,
        },
        {
          id: 'Pay a Bill',
          title: 'Pay a Bill',
          subtitle: '',
          icon: kony.forcetouch.QUICK_ACTION_ICON_TYPE_DATE,
          info: null,
        },
        {
          id: 'Money Movement',
          title: 'Transfer Money',
          subtitle: '',
          icon: kony.forcetouch.QUICK_ACTION_ICON_TYPE_SHUFFLE,
          info: null,
        },
        {
          id: 'New Check Deposit',
          title: 'Deposit Check',
          subtitle: '',
          icon: kony.forcetouch.QUICK_ACTION_ICON_TYPE_CAPTUREPHOTO,
          info: null,
        },
      ];
    }
    else {
      this.quickActionItems = [
        {
          id: 'ATM finder',
          title: 'Find an ATM',
          subtitle: '',
          icon: kony.forcetouch.QUICK_ACTION_ICON_TYPE_LOCATION,
          info: null,
        },
        {
          id: 'Pay a Bill',
          title: 'Pay a Bill',
          subtitle: '',
          icon: kony.forcetouch.QUICK_ACTION_ICON_TYPE_DATE,
          info: null,
        },
        {
          id: 'Transfer Money',
          title: 'Transfer Money',
          subtitle: '',
          icon: kony.forcetouch.QUICK_ACTION_ICON_TYPE_SHUFFLE,
          info: null,
        },
        {
          id: 'New Check Deposit',
          title: 'Deposit Check',
          subtitle: '',
          icon: kony.forcetouch.QUICK_ACTION_ICON_TYPE_CAPTUREPHOTO,
          info: null,
        },
      ];
    }
    /**@member {Array} accountTypesMetaData holds the list of different account types*/
    this.accountTypesMetaData = [
      {
        applicationValue: this.constants.CHECKING,
        backendValue: kony.i18n.getLocalizedString('i18n.Accounts.backendChecking'),
        displayValue: kony.i18n.getLocalizedString('i18n.Accounts.displayChecking'),
      },
      {
        applicationValue: this.constants.SAVINGS,
        backendValue: kony.i18n.getLocalizedString('i18n.Accounts.backendSavings'),
        displayValue: kony.i18n.getLocalizedString('i18n.Accounts.displaySavings'),
      },
      {
        applicationValue: this.constants.CREDITCARD,
        backendValue: kony.i18n.getLocalizedString('i18n.Accounts.backendCreditCard'),
        displayValue: kony.i18n.getLocalizedString('i18n.Accounts.displayCreditCard'),
      },
      {
        applicationValue: this.constants.DEPOSIT,
        backendValue: kony.i18n.getLocalizedString('i18n.Accounts.backendDeposit'),
        displayValue: kony.i18n.getLocalizedString('i18n.Accounts.displayDeposit'),
      },
      {
        applicationValue: this.constants.MORTGAGE,
        backendValue: kony.i18n.getLocalizedString('i18n.Accounts.backendMortgage'),
        displayValue: kony.i18n.getLocalizedString('i18n.Accounts.displayMortgage'),
      },
      {
        applicationValue: this.constants.MORTGAGE_FACILITY,
        backendValue: kony.i18n.getLocalizedString('i18n.Accounts.backendMortgageFacility'),
        displayValue: kony.i18n.getLocalizedString('i18n.accounts.displayMortgageFacilities'),
      },
      {
        applicationValue: this.constants.LOAN,
        backendValue: kony.i18n.getLocalizedString('i18n.Accounts.backendLoan'),
        displayValue: kony.i18n.getLocalizedString('i18n.Accounts.displayLoan'),
      },
    ];
    /**@member {Array} unreadMessageCount holds the count of unread message count */
    this.unreadMessageCount = 0;
    /**@member {Array} maritalStatus holds the list of different marital status*/
    this.maritalStatus = [
      ['Single', 'Single'],
      ['Married', 'Married'],
      ['Widowed', 'Widowed'],
      ['Divorced', 'Divorced'],
    ];
    /**@member {Array} numberOfDependents holds the list of different dependent numbers*/
    this.numberOfDependents = [
      ['0', '00'],
      ['1', '01'],
      ['2', '02'],
      ['3', '03'],
      ['4', '04'],
      ['5', '05'],
      ['6', '06'],
      ['7', '07'],
      ['8', '08'],
    ];
    /**@member {Array} gender holds the list of different genders*/
    this.gender = [['Male', 'Male'], ['Female', 'Female']];
    /**@member {Array} employmentInfoYears holds the list of different employement information years*/
    this.employmentInfoYears = [
      ['0 year', '1 year', '0'],
      ['1 year', '2 years', '1'],
      ['2 years', '3 years', '2'],
      ['3 years', '4 years', '3'],
      ['4 years', '5 years', '4'],
      ['5 years', '6 years', '5'],
      ['6 years', '7 years', '6'],
      ['7 years', '8 years', '7'],
      ['8 years', '9 years', '8'],
      ['9 years', '10 years', '9'],
      ['10 years', '11 years', '10'],
    ];
    /**@member {Array} annualIncome holds the list of different annual Incomes*/
    this.annualIncome = [
      ['0', '25000', '0'],
      ['25001', '50000', '1'],
      ['50001', '100000', '2'],
      ['100001', '200000', '3'],
      ['200001', '300000', '4'],
      ['300001', '500000', '5'],
      ['500001', '1200000', '6'],
      ['1200001', '9999999', '7'],
    ];
    /**@member {Array} assets holds the list of different assets*/
    this.assets = [
      ['0', '25000', '0'],
      ['25001', '50000', '1'],
      ['50001', '100000', '2'],
      ['100001', '200000', '3'],
      ['200001', '300000', '4'],
      ['300001', '500000', '5'],
      ['500001', '1200000', '6'],
      ['1200001', '9999999', '7'],
    ];
    /**@member {Array} monthlyExpenditure holds the list of different monthly expenditures*/
    this.monthlyExpenditure = [
      ['0', '25000', '0'],
      ['25001', '50000', '1'],
      ['50001', '100000', '2'],
      ['100001', '200000', '3'],
      ['200001', '300000', '4'],
      ['300001', '500000', '5'],
      ['500001', '1200000', '6'],
      ['1200001', '9999999', '7'],
    ];
    /**@member {Array} employmentTypeValues holds the list of different employment type values*/
    this.employmentTypeValues = [
      'Employed',
      'Unemployed',
      'Retired',
      'Student',
    ];
    this.DisputeReason = [
      applicationManager.getPresentationUtility().getStringFromi18n("i18n.StopPayments.disputeTransaction.dontRecognise"),
      applicationManager.getPresentationUtility().getStringFromi18n("i18n.StopPayments.disputeTransaction.GoodsAndService"),
      applicationManager.getPresentationUtility().getStringFromi18n("i18n.StopCheckPayments.BillingError"),
      applicationManager.getPresentationUtility().getStringFromi18n("i18n.StopPayments.disputeTransaction.duplicate"),
      applicationManager.getPresentationUtility().getStringFromi18n("i18n.StopPayments.disputeTransaction.recurringTransaction")
    ];
    /**@member {Array} hamburgerMenuItems holds the list of HamburgerMenu Items*/
    if(!this.isFastTransfersFlowEnabled()){
      this.hamburgerMenuItems = [
        {
          img: 'apollowallet.png',
          text: this.constants.MENUACCOUNT,
          info: null,
        },
        {
          img: 'apolloschedule.png',
          text: this.constants.MENUSCHEDULEPAYMENTS,
          info: null,
        },
        {
          img: 'apolloreceive.png',
          text: this.constants.MENURECEIVEPAYMENTS,
          info: null,
        },
        {
          img: 'apollocardwhite.png',
          text: this.constants.MENUCARDS,
          info: null,
        },
        {
          img: 'apollodeals.png',
          text: this.constants.MENUDEALSANDDISCOUNTS,
          info: null,
        },
        {
          img: 'apollonetwork.png',
          text: this.constants.MENUUSSD,
          info: null,
        },
        {
          img: 'apollocheckavatar.png',
          text: this.constants.MENUREFERANDEARN,
          info: null,
        },
        {
          img: 'apollomessages.png',
          text: this.constants.MENUMESSAGES,
          info: null,
        },
        // {
        //   img: 'apollobell.png',
        //   text: this.constants.MENUNOTIFICATIONS,
        //   info: null,
        // },
        {
          img: 'apollolocateus.png',
          text: this.constants.MENULOCATE,
          info: null,
        }, 
        {
          img: 'apollosettings.png',
          text: this.constants.MENUSETTINGS,
          info: null,
        },
        {
          img: 'apollowhiteverified.png',
          text: this.constants.MENUTERMSANDCONDITIONS,
          info: null,
        },
        // {
        //   img: 'accounts.png',
        //   text: this.constants.MENUDASHBOARDOVERVIEW,
        //   info: null,
        // },
        // {
        //   img: 'accounts.png',
        //   text: this.constants.MENUACCOUNTS,
        //   info: null,
        // },
        //  {
        //   img: 'transfer.png',
        //   text: this.constants.MENUTRANSFERS,
        //   info: null,
        // },
        // {
        //   img: 'accountsweep.png',
        //   text: this.constants.MENUACCOUNTSWEEP,
        //   info: null,
        // }, 
        // {
        //   img: 'transfer.png',
        //   text: this.constants.MENUUNIFIEDTRANSFERSFLOW,
        //   info: null,
        // },
        // {
        //   img: 'chequemgmt.png',
        //   text: this.constants.MENUCHEQUEMANAGEMENT,
        //   info: null,
        // },
        // {
        //   img: 'billpay.png',
        //   text: this.constants.MENUBILLPAY,
        //   info: null,
        // },
        // {
        //   img: 'checkdepositimg.png',
        //   text: this.constants.MENUCHECKDEPOSIT,
        //   info: null,
        // },
        // {
        //   img: 'cardlesscash.png',
        //   text: this.constants.MENUCARDLESS,
        //   info: null,
        // },
        // {
        //   img: 'cardmange.png',
        //   text: this.constants.MENUCARDMANAGEMENT,
        //   info: null,
        // },
        // {
        //   img: 'chatbot.png',
        //   text: this.constants.MENUCONVERSATIONALBANKING,
        //   info: null,
        // },
        // {
        //   img: 'disputetransaction.png',
        //   text: this.constants.MENUDISPUTE,
        //   info: null,
        // },
        // {
        //   img: 'mangeothrbank.png',
        //   text: this.constants.MENUMANAGEOTHERBANKACCOUNTS,
        //   info: null,
        // },
        // {
        //   img: 'mymoney.png',
        //   text: this.constants.MENUPFMMYMONEY,
        //   info: null,
        // },
        // {
        //   img: 'tradefinance.png',
        //   text: this.constants.MENUTRADEFINANCE,
        //   info: null,
        // },
        // {
        //   img: 'engagemenu.png',
        //   text: this.constants.MENUENGAGE,
        //   info: null,
        // },
        // {
        //   img: 'menuaccounts.png',
        //   text: this.constants.MENUACCOUNTSTATEMENTS,
        //   info: null,
        // },
        // {
        //   img: 'opennewacc.png',
        //   text: this.constants.MENUEXPLOREPRODUCTSORRESUME,
        //   info: null,
        // },
        // {
        //   img: 'message.png',
        //   text: this.constants.MENUMESSAGES,
        //   info: null,
        // },
        // {
        //   img: 'notification.png',
        //   text: this.constants.MENUNOTIFICATIONS,
        //   info: null,
        // },
		// {
        //   img: 'service_request_1x.png',
        //   text: this.constants.MENUSERVICEREQUESTS,
        //   info: null,
        // },
        // {
        //   img: 'settings.png',
        //   text: this.constants.MENUSETTINGS,
        //   info: null,
        // },
        // {
        //   img: 'locateus.png',
        //   text: this.constants.MENULOCATE,
        //   info: null,
        // }, 
        // {
        //   img: 'feedbackmenu.png',
        //   text: this.constants.MENUFEEDBACK,
        //   info: null,
        // },
        // {
        //   img: 'contactus.png',
        //   text: this.constants.MENUCONTACT,
        //   info: null,
        // },
      ];
      if (this.getDeploymentGeography() === "EUROPE") {
        var itemsToInsert = [
        //   {
        //     img: 'payapersonsmall.png',
        //     text: this.constants.MENUSENDMONEY,
        //     info: null,
        //   }, 
        //   {
        //     img: 'transferactivities.png',
        //     text: this.constants.MENUMANAGETRANSACTIONS,
        //     info: null,
        //   },
        //   {
        //     img: 'managetransferrecipients.png',
        //     text: this.constants.MENUMANAGEBENEFICIARIES,
        //     info: null,
        //   }
        ];
        this.hamburgerMenuItems.splice.apply(this.hamburgerMenuItems, [2,0].concat(itemsToInsert));
      }
    }
    else{
      this.hamburgerMenuItems = [
        
        // {
        //   img: 'accounts.png',
        //   text: this.constants.MENUDASHBOARDOVERVIEW,
        //   info: null,
        // },
        // {
        //   img: 'accounts.png',
        //   text: this.constants.MENUACCOUNTS,
        //   info: null,
        // },
        // {
        //   img: 'accountsweep.png',
        //   text: this.constants.MENUACCOUNTSWEEP,
        //   info: null,
        // },
        // {
        //   img: 'transfer.png',
        //   text: this.constants.MENUMONEYMOVEMENTTRANSFERS,
        //   info: null,
        // },
        // {
        //   img: 'chequemgmt.png',
        //   text: this.constants.MENUCHEQUEMANAGEMENT,
        //   info: null,
        // },
        // {
        //   img: 'transferactivities.png',
        //   text: this.constants.MENUTRANSFERSACTIVITY,
        //   info: null,
        // },

        // {
        //   img: 'transfer.png',
        //   text: this.constants.MENUUNIFIEDTRANSFERSFLOW,
        //   info: null,
        // },
        // {
        //   img: 'managetransferrecipients.png',
        //   text: this.constants.MENUMANAGERECIPIENTS,
        //   info: null,
        // },
        // {
        //   img: 'billpay.png',
        //   text: this.constants.MENUBILLPAY,
        //   info: null,
        // },
        // {
        //   img: 'checkdepositimg.png',
        //   text: this.constants.MENUCHECKDEPOSIT,
        //   info: null,
        // },
        // {
        //   img: 'cardlesscash.png',
        //   text: this.constants.MENUCARDLESS,
        //   info: null,
        // },
        // {
        //   img: 'cardmange.png',
        //   text: this.constants.MENUCARDMANAGEMENT,
        //   info: null,
        // },
        // {
        //   img: 'chatbot.png',
        //   text: this.constants.MENUCONVERSATIONALBANKING,
        //   info: null,
        // },
        // {
        //   img: 'disputetransaction.png',
        //   text: this.constants.MENUDISPUTE,
        //   info: null,
        // },
        // {
        //   img: 'mangeothrbank.png',
        //   text: this.constants.MENUMANAGEOTHERBANKACCOUNTS,
        //   info: null,
        // },
        // {
        //   img: 'mymoney.png',
        //   text: this.constants.MENUPFMMYMONEY,
        //   info: null,
        // },
        // {
        //   img: 'tradefinance.png',
        //   text: this.constants.MENUTRADEFINANCE,
        //   info: null,
        // },
        // {
        //   img: 'engagemenu.png',
        //   text: this.constants.MENUENGAGE,
        //   info: null,
        // },
        // {
        //   img: 'menuaccounts.png',
        //   text: this.constants.MENUACCOUNTSTATEMENTS,
        //   info: null,
        // },
        // {
        //   img: 'opennewacc.png',
        //   text: this.constants.MENUEXPLOREPRODUCTSORRESUME,
        //   info: null,
        // },
        {
          img: 'apollowallet.png',
          text: this.constants.MENUACCOUNT,
          info: null,
        },
        {
          img: 'apolloschedule.png',
          text: this.constants.MENUSCHEDULEPAYMENTS,
          info: null,
        },
        {
          img: 'apolloreceive.png',
          text: this.constants.MENURECEIVEPAYMENTS,
          info: null,
        },
        {
          img: 'apollocardwhite.png',
          text: this.constants.MENUCARDS,
          info: null,
        },
        {
          img: 'apollodeals.png',
          text: this.constants.MENUDEALSANDDISCOUNTS,
          info: null,
        },
        {
          img: 'apollonetwork.png',
          text: this.constants.MENUUSSD,
          info: null,
        },
        {
          img: 'apollocheckavatar.png',
          text: this.constants.MENUREFERANDEARN,
          info: null,
        },
        {
          img: 'apollomessages.png',
          text: this.constants.MENUMESSAGES,
          info: null,
        },
        // {
        //   img: 'apollobell.png',
        //   text: this.constants.MENUNOTIFICATIONS,
        //   info: null,
        // },
        {
          img: 'apollolocateus.png',
          text: this.constants.MENULOCATE,
          info: null,
        }, 
        {
          img: 'apollosettings.png',
          text: this.constants.MENUSETTINGS,
          info: null,
        },
        {
          img: 'apollowhiteverified.png',
          text: this.constants.MENUTERMSANDCONDITIONS,
          info: null,
        },
		// {
        //   img: 'service_request_1x.png',
        //   text: this.constants.MENUSERVICEREQUESTS,
        //   info: null,
        // },
        
        
        // {
        //   img: 'feedbackmenu.png',
        //   text: this.constants.MENUFEEDBACK,
        //   info: null,
        // },
        // {
        //   img: 'contactus.png',
        //   text: this.constants.MENUCONTACT,
        //   info: null
        // },
      ];
    }
    if((CommonUtilities.getSCAType() === 1 || CommonUtilities.getSCAType() === 2)){
      var itemsToInsert = [
        {
          img: 'menuicon_securitynotifications.png',
          text: this.constants.MENUSECURITYNOTIFICATIONS,
          info: null
        }
      ];
      if(CommonUtilities.getSCAType() === 2) {
        itemsToInsert.push(
          {
            img: 'menuicon_securitynotifications.png',
            text: this.constants.MENUPASSCODE,
            info: null
          },
          {
            img: 'face.png',
            text: this.constants.MENUBIOMETRICAPPROVAL,
            info: null
          }
        )
      }
       this.hamburgerMenuItems.splice.apply(this.hamburgerMenuItems, [10, 0].concat(itemsToInsert));
    }
    this.masterHamburgerData = this.hamburgerMenuItems;
    /**@member {Array} moreMenuItems holds the list of more MenuItems*/
    if(this.isFastTransfersFlowEnabled()){
      this.moreMenuItems = [
        // {
        //   img: 'accountsweep.png',
        //   text: this.constants.MENUACCOUNTSWEEP,
        //   info: null,
        // },
		// {
		// 	img: "billpay.png",
		// 	text: this.constants.MENUBILLPAY,
		// 	info: null,
		// },
        // {
        //   img: 'checkdepositimg.png',
        //   text: this.constants.MENUCHECKDEPOSIT,
        //   info: null,
        // },
        // {
        //   img: 'transferactivities.png',
        //   text: this.constants.MENUTRANSFERSACTIVITY,
        //   info: null,
        // },
        // {
        //   img: 'transfer.png',
        //   text: this.constants.MENUUNIFIEDTRANSFERSFLOW,
        //   info: null,
        // },
        // {
        //   img: 'chequemgmt.png',
        //   text: this.constants.MENUCHEQUEMANAGEMENT,
        //   info: null,
        // },
        // {
        //   img: 'managetransferrecipients.png',
        //   text: this.constants.MENUMANAGERECIPIENTS,
        //   info: null,
        // },
        // {
        //   img: 'cardlesscash.png',
        //   text: this.constants.MENUCARDLESS,
        //   info: null,
        // },
        // {
        //   img: 'cardmange.png',
        //   text: this.constants.MENUCARDMANAGEMENT,
        //   info: null,
        // },
        // {
        //   img: 'chatbot.png',
        //   text: this.constants.MENUCONVERSATIONALBANKING,
        //   info: null,
        // },
        // {
        //   img: 'disputetransaction.png',
        //   text: this.constants.MENUDISPUTE,
        //   info: null,
        // },
        // {
        //   img: 'mangeothrbank.png',
        //   text: this.constants.MENUMANAGEOTHERBANKACCOUNTS,
        //   info: null,
        // },
        // {
        //   img: 'mymoney.png',
        //   text: this.constants.MENUPFMMYMONEY,
        //   info: null,
        // },
        // {
        //   img: 'tradefinance.png',
        //   text: this.constants.MENUTRADEFINANCE,
        //   info: null,
        // },
        // {
        //   img: 'engagemenu.png',
        //   text: this.constants.MENUENGAGE,
        //   info: null,
        // },
        // {
        //   img: 'menuaccounts.png',
        //   text: this.constants.MENUACCOUNTSTATEMENTS,
        //   info: null,
        // },
        // {
        //   img: 'opennewacc.png',
        //   text: this.constants.MENUEXPLOREPRODUCTSORRESUME,
        //   info: null,
        // },
        // {
        //   img: 'message.png',
        //   text: this.constants.MENUMESSAGES,
        //   info: null,
        // },
        // {
        //   img: 'notification.png',
        //   text: this.constants.MENUNOTIFICATIONS,
        //   info: null,
        // },
		// {
        //   img: 'service_request_1x.png',
        //   text: this.constants.MENUSERVICEREQUESTS,
        //   info: null,
        // },
        // {
        //   img: 'settings.png',
        //   text: this.constants.MENUSETTINGS,
        //   info: null,
        // },
        // {
        //   img: 'locateus.png',
        //   text: this.constants.MENULOCATE,
        //   info: null,
        // },
        // {
        //   img: 'feedbackmenu.png',
        //   text: this.constants.MENUFEEDBACK,
        //   info: null,
        // },
        // {
        //   img: 'contactus.png',
        //   text: this.constants.MENUCONTACT,
        //   info: null,
        // },
      ];
    }
    else{
      this.moreMenuItems = [
        // {
        //   img: 'accountsweep.png',
        //   text: this.constants.MENUACCOUNTSWEEP,
        //   info: null,
        // },
		// {
		// 	img: "billpay.png",
		// 	text: this.constants.MENUBILLPAY,
		// 	info: null,
		// },
        // {
        //   img: 'checkdepositimg.png',
        //   text: this.constants.MENUCHECKDEPOSIT,
        //   info: null,
        // },
        // {
        //   img: 'chequemgmt.png',
        //   text: this.constants.MENUCHEQUEMANAGEMENT,
        //   info: null,
        // },
        // {
        //   img: 'cardlesscash.png',
        //   text: this.constants.MENUCARDLESS,
        //   info: null,
        // },
        // {
        //   img: 'cardmange.png',
        //   text: this.constants.MENUCARDMANAGEMENT,
        //   info: null,
        // },
        // {
        //   img: 'chatbot.png',
        //   text: this.constants.MENUCONVERSATIONALBANKING,
        //   info: null,
        // },
        // {
        //   img: 'disputetransaction.png',
        //   text: this.constants.MENUDISPUTE,
        //   info: null,
        // },
        // {
        //   img: 'mangeothrbank.png',
        //   text: this.constants.MENUMANAGEOTHERBANKACCOUNTS,
        //   info: null,
        // },
        // {
        //   img: 'mymoney.png',
        //   text: this.constants.MENUPFMMYMONEY,
        //   info: null,
        // },
        // {
        //   img: 'tradefinance.png',
        //   text: this.constants.MENUTRADEFINANCE,
        //   info: null,
        // },
        // {
        //   img: 'engagemenu.png',
        //   text: this.constants.MENUENGAGE,
        //   info: null,
        // },
        // {
        //   img: 'menuaccounts.png',
        //   text: this.constants.MENUACCOUNTSTATEMENTS,
        //   info: null,
        // },
        // {
        //   img: 'opennewacc.png',
        //   text: this.constants.MENUEXPLOREPRODUCTSORRESUME,
        //   info: null,
        // },
        // {
        //   img: 'message.png',
        //   text: this.constants.MENUMESSAGES,
        //   info: null,
        // },
        // {
        //   img: 'notification.png',
        //   text: this.constants.MENUNOTIFICATIONS,
        //   info: null,
        // },
		// {
        //   img: 'service_request_1x.png',
        //   text: this.constants.MENUSERVICEREQUESTS,
        //   info: null,
        // },
        // {
        //   img: 'settings.png',
        //   text: this.constants.MENUSETTINGS,
        //   info: null,
        // },
        // {
        //   img: 'locateus.png',
        //   text: this.constants.MENULOCATE,
        //   info: null,
        // }, 
        // {
        //   img: 'feedbackmenu.png',
        //   text: this.constants.MENUFEEDBACK,
        //   info: null,
        // },
        // {
        //   img: 'contactus.png',
        //   text: this.constants.MENUCONTACT,
        //   info: null,
        // },
      ];
      if (this.getDeploymentGeography() === "EUROPE") {
        var itemsToInsert = [
        //   {
        //     img: 'payapersonsmall.png',
        //     text: this.constants.MENUSENDMONEY,
        //     info: null,
        //   }, 
        //   {
        //     img: 'transferactivities.png',
        //     text: this.constants.MENUMANAGETRANSACTIONS,
        //     info: null,
        //   },
        //   {
        //     img: 'managetransferrecipients.png',
        //     text: this.constants.MENUMANAGEBENEFICIARIES,
        //     info: null,
        //   }
        ];
        this.moreMenuItems.splice.apply(this.moreMenuItems, [2, 0].concat(itemsToInsert));
      }
    }
    if((CommonUtilities.getSCAType() === 1 || CommonUtilities.getSCAType() === 2)){
      var itemsToInsert = [
        {
          img: 'menuicon_securitynotifications.png',
          text: this.constants.MENUSECURITYNOTIFICATIONS,
          info: null
        }
      ];
      if(CommonUtilities.getSCAType() === 2) {
        itemsToInsert.push(
          {
            img: 'menuicon_securitynotifications.png',
            text: this.constants.MENUPASSCODE,
            info: null
          },
          {
            img: 'face.png',
            text: this.constants.MENUBIOMETRICAPPROVAL,
            info: null
          },
        )
      }
       this.moreMenuItems.splice.apply(this.moreMenuItems, [10, 0].concat(itemsToInsert));
    }
    this.mastermoreMenuItems = this.moreMenuItems;
    /**@member {Array} iPhoneMenuItems holds the list of iPhone MenuItems*/
    if(!this.isFastTransfersFlowEnabled()){
      this.iPhoneMenuItems = [
        // {
        //   img: 'accounts.png',
        //   text: this.constants.MENUDASHBOARDOVERVIEW,
        //   info: null,
        // },
        // {
        //   img: 'accounts.png',
        //   text: this.constants.MENUACCOUNTS,
        //   info: null,
        // },
        // {
        //   img: 'transfer.png',
        //   text: this.constants.MENUTRANSFERS,
        //   info: null,
        // },
        // {
        //   img: 'qr_inactive.png',
        //   text: this.constants.MENUQRPAYMENT,
        //   info: null,
        // },
        // {
        //   img: 'tradefinance.png',
        //   text: this.constants.MENUTRADEFINANCE,
        //   info: null,
        // }
      ];
    }
    else{
      this.iPhoneMenuItems = [
        {
          img: 'apollowallet.png',
          text: this.constants.MENUACCOUNT,
          info: null,
        },
        {
          img: 'apolloschedule.png',
          text: this.constants.MENUSCHEDULEPAYMENTS,
          info: null,
        },
        {
          img: 'apolloreceive.png',
          text: this.constants.MENURECEIVEPAYMENTS,
          info: null,
        },
        {
          img: 'apollocardwhite.png',
          text: this.constants.MENUCARDS,
          info: null,
        },
        {
          img: 'apollodeals.png',
          text: this.constants.MENUDEALSANDDISCOUNTS,
          info: null,
        },
        {
          img: 'apollonetwork.png',
          text: this.constants.MENUUSSD,
          info: null,
        },
        {
          img: 'apollocheckavatar.png',
          text: this.constants.MENUREFERANDEARN,
          info: null,
        },
        {
          img: 'apollomessages.png',
          text: this.constants.MENUMESSAGES,
          info: null,
        },
        // {
        //   img: 'apollobell.png',
        //   text: this.constants.MENUNOTIFICATIONS,
        //   info: null,
        // },
        {
          img: 'apollolocateus.png',
          text: this.constants.MENULOCATE,
          info: null,
        }, 
        {
          img: 'apollosettings.png',
          text: this.constants.MENUSETTINGS,
          info: null,
        },
        {
          img: 'apollowhiteverified.png',
          text: this.constants.MENUTERMSANDCONDITIONS,
          info: null,
        },
        // {
        //   img: 'accounts.png',
        //   text: this.constants.MENUDASHBOARDOVERVIEW,
        //   info: null,
        // },
        // {
        //   img: 'accounts.png',
        //   text: this.constants.MENUACCOUNTS,
        //   info: null,
        // },
        // {
        //   img: 'transfer.png',
        //   text: this.constants.MENUMONEYMOVEMENTTRANSFERS,
        //   info: null,
        // },
        // {
        //   img: 'qr_inactive.png',
        //   text: this.constants.MENUQRPAYMENT,
        //   info: null,
        // },
        // {
        //   img: 'tradefinance.png',
        //   text: this.constants.MENUTRADEFINANCE,
        //   info: null,
        // }
      ];
    }
    /**@member {Array} moreMenuItemsIpad holds the list of more MenuItems for Ipad*/
    this.moreMenuItemsIpad = [
    //   {
    //     img: 'billpay.png',
    //     text: this.constants.MENUBILLPAY,
    //     info: null,
    //   },
    //   {
    //     img: 'cardlesscash.png',
    //     text: this.constants.MENUCARDLESS,
    //     info: null,
    //   },
    //   {
    //     img: 'cardmange.png',
    //     text: this.constants.MENUCARDMANAGEMENT,
    //     info: null,
    //   },
    //   {
    //     img: 'chatbot.png',
    //     text: this.constants.MENUCONVERSATIONALBANKING,
    //     info: null,
    //   },
      //     {
      //        "img": "mangeothrbank.png",
      //        "text": this.constants.MENUMANAGEOTHERBANKACCOUNTS,
      //        "info": null
      //     },
      //     {
      //       "img": "opennew.png",
      //       "text": this.constants.MENUOPENACOUNT,
      //       "info":null
      //     },
      //       {
      //    "img": "billpay.png",
      //        "text": this.constants.MENUPFMMYMONEY,
      //        "info":null
      //      },
    //   {
    //     img: 'service_request_1x.png',
    //     text: this.constants.MENUSERVICEREQUESTS,
    //     info: null,
    //   },
    //   {
    //     img: 'settings.png',
    //     text: this.constants.MENUSETTINGS,
    //     info: null,
    //   },
    //   {
    //     img: 'locateus.png',
    //     text: this.constants.MENULOCATE,
    //     info: null,
    //   },
    //   {
    //     img: 'feedbackmenu.png',
    //     text: this.constants.MENUFEEDBACK,
    //     info: null,
    //   },
    //   {
    //     img: 'contactus.png',
    //     text: this.constants.MENUCONTACT,
    //     info: null,
    //   },
    ];
    this.mastermoreMenuItemsIpad = JSON.parse(
      JSON.stringify(this.moreMenuItemsIpad)
    );
    /**@member {Array} iPhoneMenuItems holds the list of iPhone MenuItems*/
    if(!this.isFastTransfersFlowEnabled()){
      this.iPhoneMenuItems = [
        // {
        //   img: 'accounts.png',
        //   text: this.constants.MENUDASHBOARDOVERVIEW,
        //   info: null,
        // },
        // {
        //   img: 'accounts.png',
        //   text: this.constants.MENUACCOUNTS,
        //   info: null,
        // },
        // {
        //   img: 'transfer.png',
        //   text: this.constants.MENUTRANSFERS,
        //   info: null,
        // },
        // {
        //   img: 'qr_inactive.png',
        //   text: this.constants.MENUQRPAYMENT,
        //   info: null,
        // },
        // {
        //   img: 'billpay.png',
        //   text: this.constants.MENUBILLPAY,
        //   info: null,
        // },
        // {
        //   img: 'tradefinance.png',
        //   text: this.constants.MENUTRADEFINANCE,
        //   info: null,
        // }
      ];
    }
    else{
      this.iPhoneMenuItems = [
        {
          img: 'apollowallet.png',
          text: this.constants.MENUACCOUNT,
          info: null,
        },
        {
          img: 'apolloschedule.png',
          text: this.constants.MENUSCHEDULEPAYMENTS,
          info: null,
        },
        {
          img: 'apolloreceive.png',
          text: this.constants.MENURECEIVEPAYMENTS,
          info: null,
        },
        {
          img: 'apollocardwhite.png',
          text: this.constants.MENUCARDS,
          info: null,
        },
        {
          img: 'apollodeals.png',
          text: this.constants.MENUDEALSANDDISCOUNTS,
          info: null,
        },
        {
          img: 'apollonetwork.png',
          text: this.constants.MENUUSSD,
          info: null,
        },
        {
          img: 'apollocheckavatar.png',
          text: this.constants.MENUREFERANDEARN,
          info: null,
        },
        {
          img: 'apollomessages.png',
          text: this.constants.MENUMESSAGES,
          info: null,
        },
        // {
        //   img: 'apollobell.png',
        //   text: this.constants.MENUNOTIFICATIONS,
        //   info: null,
        // },
        {
          img: 'apollolocateus.png',
          text: this.constants.MENULOCATE,
          info: null,
        }, 
        {
          img: 'apollosettings.png',
          text: this.constants.MENUSETTINGS,
          info: null,
        },
        {
          img: 'apollowhiteverified.png',
          text: this.constants.MENUTERMSANDCONDITIONS,
          info: null,
        },
        // {
        //   img: 'accounts.png',
        //   text: this.constants.MENUDASHBOARDOVERVIEW,
        //   info: null,
        // },
        // {
        //   img: 'accounts.png',
        //   text: this.constants.MENUACCOUNTS,
        //   info: null,
        // },
        // {
        //   img: 'transfer.png',
        //   text: this.constants.MENUMONEYMOVEMENTTRANSFERS,
        //   info: null,
        // },
        // {
        //   img: 'qr_inactive.png',
        //   text: this.constants.MENUQRPAYMENT,
        //   info: null,
        // },
        // {
        //   img: 'billpay.png',
        //   text: this.constants.MENUBILLPAY,
        //   info: null,
        // },
        // {
        //   img: 'tradefinance.png',
        //   text: this.constants.MENUTRADEFINANCE,
        //   info: null,
        // }
      ];
    }
    /**@member {Array} iPadMenuItems holds the list of iPad MenuItems*/
    this.iPadMenuItems = [
    //   {
    //       img: 'accounts.png',
    //       text: this.constants.MENUDASHBOARDOVERVIEW,
    //       info: null,
    //   },
    //   {
    //     img: 'accounts.png',
    //     text: this.constants.MENUACCOUNTS,
    //     info: null,
    //   }, 
    //   {
    //     img: 'maketransfer.png',
    //     text: this.constants.MENUTRANSFERS,
    //     info: null,
    //   },
    //   {
    //     img: 'accountsweep.png',
    //     text: this.constants.MENUACCOUNTSWEEP,
    //     info: null,
    //   },
    //   {
    //     img: 'watchlist_n.png',
    //     text: this.constants.MENUWEALTHWATCHLIST,
    //     info: null,
    //   },
    //   {
    //     img: 'transfer.png',
    //     text: this.constants.MENUUNIFIEDTRANSFERSFLOW,
    //     info: null,
    //   },
    //   {
    //     img: 'billpay.png',
    //     text: this.constants.MENUBILLPAY,
    //     info: null,
    //   },
    //   {
    //     img: 'checkdepositimg.png',
    //     text: this.constants.Deposits,
    //     info: null,
    //   },
    //   {
    //       img: 'opennewacc.png',
    //       text: this.constants.MENUEXPLOREPRODUCTSORRESUME,
    //       info: null,
    //   },
    //   {
    //     img: 'message.png',
    //     text: this.constants.MENUMESSAGES,
    //     info: null,
    //   },
    ];
    /**@member {Array} denominationAmountValues holds the list of different denomination amount values*/
    this.denominationAmountValues = ['50', '100', '150', '300', '500', '1000'];
    /**@member {Boolean} value used in custom metrics*/
    this.CustomMetricsEnabled = true;
    /**@member {object} value Olb specific constants*/
    this.OLBConstants = {
      DEFAULT_OFFSET: 0,
      DEFAULT_T24_OFFSET: 1,
      PAGING_ROWS_LIMIT: 10,
      ACCOUNT_LIST_NAME_MAX_LENGTH: 32,
      WIRE_ACTIVITY_LIMIT: 12,
      ASCENDING_KEY: 'asc',
      DESCENDING_KEY: 'desc',
      NOTES_LENGTH: 50,
      CALENDAR_ALLOWED_FUTURE_YEARS: 3,
      ALL: 'All',
      PENDING: 'pending',
      SUCCESSFUL: 'successful',
      BOTH: 'Both',
      CURRENCY_NAME: 'Dollar',
      ANY_DATE: 'ANY_DATE',
      CHOOSE_TIME_RANGE: 'CHOOSE_TIME_RANGE',
      CUSTOM_DATE_RANGE: 'CUSTOM_DATE_RANGE',
      IBAN_MINIMUM_LENGTH: 22,
      IBAN_MAXIMUM_LENGTH: 34,
      CHECK_SERIES_SEPARATOR: '-',
      CHECK_REQUEST_TYPES: {
        SINGLE: 'Single',
        SERIES: 'Series',
      },
      DISPUTED_CHECKS: 'DisputesChecks',
      MY_CHEQUES:"MyCheques",  
      DISPUTED_TRANSACTIONS: 'DisputedTransactions',
      NOTES_MAX_LENGTH: 120,
      NOTES_MAXIMUM_LENGTH: 35,	   
      Channel: 'Online',
      MAX_CHECKS_COUNT: 50,
      OTPLength: 6,
      ACCOUNT_TYPE: {
        SAVING: 'Savings',
        CHECKING: 'Checking',
        CREDITCARD: 'CreditCard',
        LOAN: 'Loan',
        INVESTMENT: 'Investment',
        MORTGAGE: 'Mortgage',
        DEPOSIT: 'Deposit',
        OTHER: 'Other',
        EXTERNAL: 'External',
        CURRENT: 'Current',
        LINE_OF_CREDIT: 'Line of Credit',
        MORTGAGE_FACILITY: 'mortgageFacility'
      },
      TRANSACTION_TYPE: {
        CHECKS: 'Checks',
        DEPOSITS: 'Deposits',
        TRANSFERS: 'Transfers',
        WITHDRAWLS: 'Withdrawals',
        PAYMENTS: 'Payments',
        PURCHASES: 'Purchases',
        INTEREST: 'Interest',
        EXTERNALTRANSFER: 'ExternalTransfer',
        INTERNALTRANSFER: 'InternalTransfer',
        BILLPAY: 'BillPay',
        P2P: 'P2P',
        FEES: 'Fees',
        INTERESTDEBIT: 'InterestDebit',
        INTERESTCREDIT: 'InterestCredit',
        LOAN: 'Loan',
        STOPCHECKPAYMENTREQUEST: 'StopCheckPaymentRequest',
        DISPUTEDTRANSACTIONSREQUEST: 'DisputedTransactionRequest',
        WIRE: 'Wire',
        DEPOSIT: 'Deposit',
        CARDLESS: 'Cardless',
        CHECKWITHDRAWAL: 'CheckWithdrawal',
        WITHDRAWL: 'Withdrawal',
        RECEIVEDP2P: 'ReceivedP2P',
        RECEIVEDREQUEST: 'ReceivedRequest',
      },
      TRANSACTION_STATUS: {
        INPROGRESS: 'In-Progress',
        SUCCESSFUL: 'Successful',
        CLEARED: 'Cleared',
        REQUESTEXPIRED: 'Request Expired',
        FAILED: 'Failed',
        PENDING: 'Pending',
        STOPPED: 'Stopped',
      },
      TRANSACTION_RECURRENCE: {
        ONCE: 'Once',
        DAILY: 'Daily',
        WEEKLY: 'Weekly',
        BIWEEKLY: 'BiWeekly',
        MONTHLY: 'Monthly',
        YEARLY: 'Yearly',
        HALFYEARLY: 'Half Yearly',
        QUARTERLY: 'Quarterly',
        EVERYTWOWEEKS: 'Every Two Weeks',
      },
      ACTION: {
        SAVINGS_POT: 'Savings Pot',  
        ACCOUNT_ALERTS:'Account Alerts',
        REFRESH_ACCOUNT:'Refresh Account',
        DELETE_ACCOUNT:'Delete Account',
        ACCOUNT_PREFERENCES: 'Account Preferences',
        EDIT_ACCOUNT: 'Edit Account',
        TRANSFER_MONEY: 'Transfer Money',
        PAY_MONEY: 'Pay Money',
        VIEW_STATEMENTS: 'View Statements',
        UPDATE_ACCOUNT_SETTINGS: 'Update Account Settings',
        ORDER_CHECKS: 'Order Checks',
        REQUEST_OR_REPLACE_CARD: 'Request Card/Replace Card',
        GET_ASSISTANCE: 'Get Assistance',
        ECHECK_OR_ROUTING_DETAILS: 'eCheck/Routing Details',
        REWARDS_POINTS: 'Reward Points',
        PAY_A_PERSON_OR_SEND_MONEY: 'Send Money',
        PAY_DUE_AMOUNT: 'Pay Due Amount',
        PAY_A_BILL: 'Pay a Bill',
        MANAGE_CARD_OR_CARD_CONTROLS: 'Manage Card/Card Controls',
        REPORT_LOST_OR_STOLEN: 'Report Lost/Stolen',
        SETUP_NEW_PIN: 'Set up New PIN',
        LOCK_OR_DECACTICATE_CARD: 'Lock Card/Deactivate Card (Temporary)',
        TRAVEL_NOTIFICATION: 'Travel Notification',
        REMOVE_ACCOUNT: 'Remove Account',
        DOWNLOAD_STATEMENTS: 'Download Statements',
        ACCOUNT_SETTINGS: 'Account Settings',
        ACCOUNT_SERVICES: 'Account Services',
        PAYOFF_LOAN: 'Payoff Loan',
        EDIT_ACCOUNTS: 'Edit Accounts',
        SCHEDULED_TRANSACTIONS: 'Scheduled Transactions',
        MAKE_A_TRANSFER: 'Make A Transfer',
        MANAGE_CARDS : 'Manage Cards',
        VIEW_BILL: 'View Bill',
        SHOW_DISPUTE_TRANSACTION_FORM: 'ShowDisputeTransactionForm',
        SHOW_STOPCHECKS_FORM: 'ShowStopChecksForm',
        STOPCHECKS_PAYMENT: 'Stop Cheque Payment',
        SET_AS_FAVOURITE: 'Set as Favourite', 
        REMOVE_AS_FAVOURITE: 'Remove as Favourite',
        REQUEST_CHEQUE_BOOK: 'Request Cheque Book',
        REQUEST_CHEQUE_BOOK_FORM: 'showRequestChequeBookForm',
        VIEW_MYCHEQUES: 'My Cheques',
        VIEW_MYCHEQUES_FORM: 'showMyChequesForm',
        SHOW_DISPUTE_LIST: 'Disputed Transactions',
        VIEW_DOCUMENT : "View Documents",
        RAISE_A_REQUEST : "Raise a Request",
        CHANGE_REPAYMENT_DAY : "Change Repayment Day"
      },
      SAVINGS_POT_PERMISSIONS:{
        BUDGET_POT_VIEW : 'BUDGET_POT_VIEW',
        BUDGET_POT_EDIT: 'BUDGET_POT_EDIT',
        BUDGET_POT_CLOSE: 'BUDGET_POT_CLOSE',
        BUDGET_POT_ADHOC_FUND: 'BUDGET_POT_ADHOC_FUND',
        BUDGET_POT_CREATE: 'BUDGET_POT_CREATE',
        BUDGET_POT_WITHDRAW_FUND: 'BUDGET_POT_WITHDRAW_FUND',
        GOAL_POT_VIEW: 'GOAL_POT_VIEW',
        GOAL_POT_EDIT: 'GOAL_POT_EDIT',
        GOAL_POT_ADHOC_FUND: 'GOAL_POT_ADHOC_FUND',
        GOAL_POT_CREATE: 'GOAL_POT_CREATE',
        GOAL_POT_CLOSE: 'GOAL_POT_CLOSE',
        GOAL_POT_WITHDRAW_FUND: 'GOAL_POT_WITHDRAW_FUND'
      },
      TRANSFER_TYPES: {
        OWN_INTERNAL_ACCOUNTS: 'OWN_INTERNAL_ACCOUNTS',
        OTHER_INTERNAL_MEMBER: 'OTHER_INTERNAL_MEMBER',
        OTHER_EXTERNAL_ACCOUNT: 'OTHER_EXTERNAL_ACCOUNT',
        INTERNATIONAL_ACCOUNT: 'INTERNATIONAL_ACCOUNT',
        WIRE_TRANSFER: 'WIRE_TRANSFER',
      },
      MONTHS_FULL: {
        January: 'January',
        February: 'February',
        March: 'March',
        April: 'April',
        May: 'May',
        June: 'June',
        July: 'July',
        August: 'August',
        September: 'September',
        October: 'October',
        November: 'November',
        December: 'December',
      },
      CONFIG: {
        ACCOUNTS_QUICK_ACTIONS: {
          Savings: ['Transfer Money', 'Pay Money', 'Request Cheque Book', 'Stop Cheque Payment', 'My Cheques', 'Manage Cards', 'View Statements','Account Alerts','Refresh Account','Remove Account'],
          Checking: [
            'Transfer Money',
            'Pay Money',
            //'Send Money', Not in scope of 2021.10 release 
            'Pay a Bill',
            'Request Cheque Book', 
            'Stop Cheque Payment', 
            'My Cheques',
            'Manage Cards',
            'View Statements',
            'Account Alerts',
            'Refresh Account',
            'Remove Account'
          ],
          CreditCard: [
            'Pay a Bill',
            'View Statements',
            'Account Alerts'
            //"Pay Due Amount" Not in scope
          ],
          Loan: [
            'Pay Due Amount',
            'View Statements',
            'Update Account Settings',
            'Account Alerts',
            'Payoff Loan'
          ],
          'Line of Credit': [
            //"Pay Due Amount",
            'View Statements',
            'Update Account Settings',
            'Account Alerts'
          ],
          Mortgage: [
            //"Pay Due Amount",
            'View Statements',
            'Update Account Settings',
            'Account Alerts'
          ],
          mortgageFacility: [
            "View Documents",
            "Raise a Request",
            "Change Repayment Day"
          ],
          Deposit: ['View Statements', 'Update Account Settings', 'Account Alerts'],
        },
        EXTERNAL_ACCOUNT_QUICK_ACTIONS: [
          'Remove Account',
          //'Account Preferences',
          'Edit Account',
          //'Refresh Account', not in scope now, as the refresh happens at service side.
          'Delete Account'
        ],
        ACCOUNTS_RIGHTSIDE_ACTIONS: {
          Savings: ['Savings Pot', 'Make A Transfer', 'Request Cheque Book'],
          Checking: ['Savings Pot','Make A Transfer', 'Pay a Bill'],
          CreditCard: [
            'Scheduled Transactions',
            'View Statements',
            //"Pay Due Amount" Not in scope
          ],
          Loan: [
            'Pay Due Amount',
            'View Statements',
            'Update Account Settings',
          ],
          'Line of Credit': [
            //"Pay Due Amount", Not in scope
            'View Statements',
            'Update Account Settings',
          ],
          Mortgage: [
            //"Pay Due Amount", Not in scope
            'View Statements',
            'Update Account Settings',
          ],
          mortgageFacility: [
            "View Documents",
            "Raise a Request",
           "Change Repayment Day"
          ],
          Deposit: ['View Statements', 'Update Account Settings'],
        },
        ACCOUNTS_SECONDARY_ACTIONS: {
          Savings: [
            'View Statements',
            'Request Cheque Book',
            'Stop Cheque Payment',
            'My Cheques',
            'Update Account Settings',
            'Scheduled Transactions',
            'Disputed Transactions'
            //"Order Checks", //Post R4
            //"Manage Card" //Post R4
          ],
          Checking: [
            //'Send Money', Not in scope for 2021.10 release.
            'View Statements',
            'Request Cheque Book',
            'Stop Cheque Payment',
            'My Cheques',
            'Update Account Settings',
            'Scheduled Transactions',
            'Disputed Transactions'
            //"Order Checks", //Post R4
            //"Manage Card" //Post R4
          ],
          CreditCard: [
            'Pay a Bill',
            'Update Account Settings',
            'Disputed Transactions'
            //"Manage Card", //Post R4
            //"Report Lost/Stolen", //Post R4
            //"Lock Card/Deactivate Card", //Post R4
          ],
          Loan: ['Payoff Loan', 'Update Account Settings'],
          'Line of Credit': [
            //"Payoff Loan", Not in Scope
            'Update Account Settings',
          ],
          Mortgage: ['Update Account Settings'],
          mortgageFacility: [
            "View Documents",
            "Raise a Request",
            "Change Repayment Day"
          ],
          Deposit: ['Update Account Settings'],
        },
      },
      CARD_TYPE: {
        Debit: 'Debit',
        Credit: 'Credit',
      },
      CARD_ACTION: {
        Lock: 'Lock Card',
        Unlock: 'Unlock Card',
        Replace: 'Replace Card',
        Report_Lost: 'Report Lost',
        Cancel: 'Cancel Card',
        Change_Pin: 'Change Pin',
        Set_Limits: 'Set Limits'
      },
      CARD_STATUS: {
        Active: 'Active',
        Locked: 'Locked',
        ReportedLost: 'Reported Lost',
        ReplaceRequestSent: 'Replace Request Sent',
        CancelRequestSent: 'Cancel Request Sent',
        Cancelled: 'Cancelled',
      },
      CARD_PRODUCT: {
        PlatinumCredit: 'My Platinum Credit Card',
        GoldDebit: 'Gold Debit Card',
        PremiumCredit: 'Premium Club Credit Card',
        ShoppingCard: 'Shopping Card',
        PetroCard: 'Petro Card',
        FoodCard: 'Eazee Food Card',
      },
      MFA_OPTIONS: {
        SECURE_ACCESS_CODE: 'Secure Access Code',
        SECURITY_QUESTIONS: 'Security Questions',
      },
      CHANGE_PIN_OFFLINE_OPTION: {
        EMAIL: 'E-mail ID',
        PHONE: 'Phone No',
        POSTAL_ADDRESS: 'Postal Address',
      },
      CARD_CHANGE_PIN_REASON: {
        PIN_COMPROMISED: 'PIN Compromised',
        FORGOT_PIN: 'Lost PIN',
      },
      CARD_REPORTLOST_REASON: {
        LOST: 'Lost',
        STOLEN: 'Stolen',
      },
      WireTransferConstants: {
        RECIPIENT_INDIVIDUAL: 'Individual',
        RECIPIENT_BUSINESS: 'Business',
        ACCOUNT_DOMESTIC: 'Domestic',
        ACCOUNT_INTERNATIONAL: 'International',
        DOMESTIC_COUNTRY: 'USA',
        DOMESTIC_COUNTRY_NAME: 'United States of America',
        DOMESTIC_DEFAULT_COUNTRY: 'United States',
        CURRENCIES: [
          {
            symbol: '£',
            name: 'Pound',
          },
          {
            symbol: '€',
            name: 'Euro',
          },
          {
            symbol: '₹',
            name: 'Rupee',
          },
          {
            symbol: '$',
            name: 'Dollar',
          },
        ],
      },

      BULKWIRETRANSFERCONSTANT : {
        CURRENCIES: [
          {
            name: '£',
            symbol: '£',
          },
          {
            name: '€',
            symbol: '€',
          },
          {
            name: '₹',
            symbol: '₹',
          },
          {
            name: '$',
            symbol: '$',
          },
          {
            name: "د.إ",
            symbol: "د.إ",
          },
        ],
      },

    };
    this.SBA_ENROLMENT_STATUS_CONFIG = {
      ENABLED: 'Enabled',
      REVOKED: 'Revoked',
      CANCELED: 'Canceled',
      INPROGRESS: 'Inprogress',
      COMPLETED: 'Completed',
    },
    this.PFM_CATEGORIES_COLORS = {
      Home: '#FEDB64',
      Transport: '#3645A7',
      'Financial ': '#6753EC',
      Food: '#D6B9EA',
      Utilities: '#E87C5E',
      Health: '#04B6DF',
      Education: '#E8A75E',
      Other: '#B160DC',
      Travel: '#8ED174',
    };

    this.userPermissions = [];
    this.accountPermissions = {};
    this.userRole = null;
    this.features = [];
    this.hamConfig = [];
    this.europeConfiguration = {
      isPaymentMediumAvailable : true,
      isInternationalTransactionFeeEnabled : true
    };
    this.isDisputeConfigurationAdded = false;
    this.disputeDuration = null;

    this.disputeReasons = [];
    this.disputeConfigMap = {};
    this.disputeCDConfigMap = {};
    this.cutOffTimeBreachedOverride = false;
    this.cutOffProductOverride = false;
    this.awaitingFundsOverride = false;

    this.maxGoalAmount = 12000000;
    this.maxMonthlydebitAmount = 100000;
    this.maxMonths = 120;
    this.minBudgetAmount = 1;
    this.minGoalAmount = 1;
    this.minMonthlydebitAmount = 1;
    this.minMonths = 1;
    this.combinedStatementsAllowedPeriod = 6;
    this.dualBalanceConfig = '{"isAvailableBalanceToBeDisplayed":true}';
    this.CHQ_CONFIG={};
  }
  inheritsFrom(ConfigurationManager, kony.mvc.Business.Delegator);
  ConfigurationManager.prototype.initializeBusinessController = function() {};
  ConfigurationManager.prototype.resetConfigurationObject = function() {
    this.hamburgerMenuItems = JSON.parse(
      JSON.stringify(this.masterHamburgerData));
    this.moreMenuItems = JSON.parse(
      JSON.stringify(this.mastermoreMenuItems));
    this.moreMenuItemsIpad = this.mastermoreMenuItemsIpad;
    this.isKonyBankAccountsTransfer = 'false';
    this.isOtherKonyAccountsTransfer = 'false';
    this.isOtherBankAccountsTransfer = 'false';
    this.isInternationalAccountsTransfer = 'false';
    this.isDomesticWireTransferEnabled = 'false';
    this.isInternationalWireTransferEnabled = 'false';
    this.isBillPayEnabled = 'false';
    this.ispayAPersonEnabled = 'false';
    this.isRDCEnabled = 'false';
    this.isBusinessOwner = 'false';
    this.isDisputeConfigurationAdded = false;
    this.isWatchlistEnabled = 'false';
  };
  /**
   * Get Application properties form the device
   * @param {Function} - presentationSuccess will be called when call is successfull
   * @param {Function} - presentationError will be called when call is not successfull
   */
  ConfigurationManager.prototype.fetchApplicationProperties = function(
  presentationSuccess,
   presentationError
  ) {
    checkAppinit = false;
    var self = this;
    var applicationRepo = kony.mvc.MDAApplication.getSharedInstance()
    .getRepoManager()
    .getRepository('Application');
    var deviceInfo = applicationManager.getDeviceUtilManager().getDeviceInfo();
    var options = {
      OSType: deviceInfo.name,
      OSversion: deviceInfo.version,
      AppVersion: appConfig.appVersion,
    };
    applicationRepo.save(options, applicationRepoCompletionCallBack);
    function applicationRepoCompletionCallBack(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var res = srh.manageResponse(status, data, error);
      if (res['status']) {
        var config = applicationManager.getConfigurationManager();
        self.setConfigurationValue(
          'androidPhoneNativeAppLink',
          res['data'].playStoreLink
        );
        self.setConfigurationValue(
          'iphoneNativeAppLink',
          res['data'].appStoreLink
        );
        self.setConfigurationValue('BANNER_IMAGE', res['data'].bannerImageURL);
        self.setConfigurationValue('DESKTOP_BANNER_IMAGE', res['data'].desktopBannerImageURL);
        self.setConfigurationValue('MOBILE_BANNER_IMAGE', res['data'].mobileBannerImageURL);
        self.setConfigurationValue("LINK_TO_DBX",res['data'].viewMoreDBXLink);
        config.configurations.setItem('SecondTimeRating',res['data'].noOfDaysForAnotherAttemptForRating);
        config.configurations.setItem('FirstTransactionRating',res['data'].noOfDaysForRatingFromTransactions);
        config.configurations.setItem('FirstProfileRating',res['data'].noOfDaysForRatingFromProfile);
        config.configurations.setItem('NumberoftimesforRating',res['data'].maxtimesFeedbackperversion);
        config.configurations.setItem('MajorVersionforRating',res['data'].majorVersionsForFeedback);
        config.configurations.setItem('isPostLoginAdsEnabled',res['data'].showAdsPostLogin);
        config.configurations.setItem('BANNER_URL', res['data'].bannerURL);
        config.configurations.setItem('BANKNAME', res['data'].bankName);
        config.configurations.setItem('BUSINESSDAYS', res['data'].businessDays);
        config.configurations.setItem('OCRAPIKEY', res['data'].ocrApiKey);
        config.configurations.setItem('OCRSECRETKEY', res['data'].ocrSecretKey);
        config.configurations.setItem('isAccountCentricCore', res['data'].isAccountCentricCore);
		    config.configurations.setItem('isSingleEntity', res['data'].isSingleEntity);
        config.configurations.setItem('cardStatementYears', res['data'].cardStatementYears?res['data'].cardStatementYears:1);
        config.configurations.setItem(
          'FACIALLICENSESTRING',
          res['data'].facialLicenseString
        );
        config.configurations.setItem(
          'FACIALLICENSESERVERURL',
          res['data'].facialLicenseServerUrl
        );
        config.configurations.setItem(
          'ISUPDATEMANDATORY',
          res['data'].isUpdateMandatory
        );
        config.configurations.setItem('ISUPDATE', res['data'].isUpdate);
        config.configurations.setItem(
          'ISLANGUAGESELECTION',
          res['data'].isLanguageSelectionEnabled
        );
        config.configurations.setItem(
          'ISBACKENDCURRENCYSYMBOLENABLED',
          res['data'].isBackEndCurencySymbolEnabled
        );
        config.configurations.setItem(
          'ISCOUNTRYCODEENABLED',
          res['data'].isCountryCodeEnabled
        );
        config.configurations.setItem(
          'ISSORTCODEVISIBLE',
          res['data'].isSortCodeVisible
        );
        config.configurations.setItem(
          'ISUTCDATEFORMATTINGENABLED',
          res['data'].isUTCDateFormattingEnabled
        );
        config.configurations.setItem(
          'isAlertAccountIDLevel',
          res['data'].isAlertAccountIDLevel
        );
        config.configurations.setItem(
          'DEPLOYMENTGEOGRAPHY',
          res['data'].deploymentGeography
        );
        if (res['data'].isprofileImageAvailable !== undefined) {
          config.configurations.setItem(
            'isprofileImageAvailable',
            res['data'].isprofileImageAvailable
          );
        }
        config.configurations.setItem('BASECURRENCY', res['data'].currencyCode);
        config.configurations.setItem(
          'ISBUSINESSBANKINGENABLED',
          res['data'].isBusinessBankingEnabled
        );
        config.configurations.setItem("timeZoneOffset",res['data'].timeZoneOffset);
        if (res['data'].isFeedbackEnabled !== undefined) {
          config.configurations.setItem(
            'isFeedbackEnabled',
            res['data'].isFeedbackEnabled
          );
          config.configurations.setItem(
            'showFeedBackPostLogout',
            res['data'].isFeedbackEnabled
          );
        }
        if (res['data'].isAccountAggregationEnabled !== undefined) {
          self.isAggregatedAccountsEnabled =
            res['data'].isAccountAggregationEnabled;
          self.AggregatedExternalAccountEnabled =
            res['data'].isAccountAggregationEnabled === 'true' ? true : false;
        }
        if (res['data'].stopReasons !== undefined) {
          config.configurations.setItem(
            'stopReasons',
            config.getStopReasonsList(
              JSON.parse(res['data'].stopReasons)
            )
          );
        }
        if (res['data'].currenciesSupported !== undefined) {
          config.configurations.setItem(
            'currenciesSupported',
            config.getCurrenciesList(
              JSON.parse(res['data'].currenciesSupported)
            )
          );
        }
        if (res['data'].currencyCode !== undefined) {
          if (config.currencyCode[res['data'].currencyCode]) {
            config.configurations.setItem(
              'CURRENCYCODE',
              config.currencyCode[res['data'].currencyCode]
            );
          } else {
            config.configurations.setItem(
              'CURRENCYCODE',
              res['data'].currencyCode
            );
          }
        } else {
          config.configurations.setItem('CURRENCYCODE', 'USD');
        }
        if(res['data'].ServerTimeZoneID && res['data'].ServerTimeZoneOffsetInMinutes){
            var timezoneObject = {
                "ZoneID": res['data'].ServerTimeZoneID,
                "ZoneOffsetInMinutes": res['data'].ServerTimeZoneOffsetInMinutes,
                "ZoneOffsetInSeconds": res['data'].ServerTimeZoneOffsetInSeconds
            };
            config.configurations.setItem('SERVER_TIMEZONE_DETAILS', timezoneObject);
        } else{
             var timezoneObject = {
                "ZoneID":"UTC",
                "ZoneOffsetInMinutes": "0",
                "ZoneOffsetInSeconds": "0"
            };
            config.configurations.setItem('SERVER_TIMEZONE_DETAILS', timezoneObject);
        }
        if (res['data'].bwFileTransactionsLimit !== undefined) {
          self.bulkWireFileTransactionsLimit = res['data'].bwFileTransactionsLimit;
        }
        // TODO: Review/check once Engage Customer 360 config flag is ready.
        if (res['data'].isEngageEnabled !== undefined) {
          self.EngageEnabled = res['data'].isEngageEnabled;
        }
		    config.setLocaleAndDateFormat(res);
        if (res['data'].deploymentGeography == "EUROPE" && !(scope_configManager.isCombinedUser==="true")) {
          scope_configManager.isFastTransferEnabled= "false";
          scope_configManager.fastTransfersFlowEnabled = "false";
        }
        if (res['data'].ActiveLoginTnC !== undefined) {
          self.ActiveLoginTnC = res['data'].ActiveLoginTnC;
        }else{
          self.ActiveLoginTnC = false;
        }
        //applicationManager.getPresentationUtility().dismissLoadingScreen();
        presentationSuccess(res['data']);
      } else {
        // alert("An error occured in fetch application properties" + res["errmsg"]);
        presentationError(res['errmsg']);
      }
    }
  };

  ConfigurationManager.prototype.getOffset = function() { 
    var timeZoneOffset =  this.configurations.getItem('timeZoneOffset'); //UTC+05:30 or UTC-11:00      
    if(timeZoneOffset!==undefined){
      var time = [];          
      var timeSplit;
      var pos;
      if(timeZoneOffset.indexOf("-")>=0){
        timeSplit =  timeZoneOffset.split("-");
        pos = "-";
      }          
      if(timeZoneOffset.indexOf("+")>=0){
        timeSplit =  timeZoneOffset.split("+");
        pos = "+";
      }          
      var hourMinute = timeSplit[1];             
      hourMinute = hourMinute.split(":");          
      var hour = Number(pos + hourMinute[0]);          
      var minute = Number(pos + hourMinute[1]);          
      time.push(hour);          
      time.push(minute);          
      return time;       
    }  
  }; 


  ConfigurationManager.prototype.fetchLimitsForAnAction = function(action, presentationSuccess, presentationError) {
    function completionCallback (status, data, error)  {
      var srh = applicationManager.getServiceResponseHandler();
      var res = srh.manageResponse(status, data, error);
      if (res["status"] === true) {
        presentationSuccess(res["data"]);
      } else {
        presentationError(res["errmsg"]);
      }
    }

    var CustomerLimitsRepo = kony.mvc.MDAApplication.getSharedInstance()
    .getRepoManager()
    .getRepository('CustomerLimits');
    CustomerLimitsRepo.customVerb("getCustomerActionLimits", {action: action},  completionCallback)
  }

  /**
   * Set user level permissions in an array
   * @param {array} permissions permissions array from identity
   */

  ConfigurationManager.prototype.setUserPermissions = function (permissions) {
    this.userPermissions = permissions;
  }

  /**
   * Sets the account level permissions in a map 
   * @param {object} accountPermissions Account permission array from identity
   */
  ConfigurationManager.prototype.setAccountPermissions = function (accountPermissions) {
    this.accountPermissions = accountPermissions;
  }

  /**
   * Check if user can perform a specific permission
   * @param {string} permission  Permission to check for
   */
  ConfigurationManager.prototype.checkUserPermission = function (permission) {
    return this.userPermissions.indexOf(permission) > -1;
  }

  /**
  * Delegates check user permission
  * @param {string} permission  Permission to check for
  */
  ConfigurationManager.prototype.delegateCheckUserPermission = function(permission) {
    return applicationManager.getConfigurationManager().checkUserPermission(permission);
  }

  /**
  * Check if user contains atleast one permission
  * @param {string} permission  Permission to check for
  */
  ConfigurationManager.prototype.checkAtLeastOnePermission = function(permissions) {
    return permissions.some(this.delegateCheckUserPermission);
  }

  /**
   * Check if an account can be used for a specific action
   * @param {string} accountId Account id for which action needs to checked
   * @param {string} action Action to check for
   */
  ConfigurationManager.prototype.checkAccountAction = function (accountId, action) {
    if(!kony.sdk.isNullOrUndefined(this.accountPermissions[accountId]))
      return this.accountPermissions[accountId].actions.indexOf(action) > -1;
    else
      return false;
  }


  /**
   * Set User Role from identity
   * @param {string} role  Role of the user
   */
  ConfigurationManager.prototype.setUserRole = function (role) {
    return this.userRole = role;
  }

  /**
   * Get User Role 
   */
  ConfigurationManager.prototype.getUserRole = function () {
    return this.userRole
  }

  /**
   * Set User Features 
   * @param {string[]} features  Features Available to user
   */
  ConfigurationManager.prototype.setFeatures = function (features) {
    return this.features = features;
  }

  /**
   * Set User Role from identity
   */
  ConfigurationManager.prototype.getUserFeatures = function () {
    return this.features;
  }
  ConfigurationManager.prototype.setHamConfig = function (config) {
   return this.hamConfig = config;
  }
   ConfigurationManager.prototype.getHamConfig = function () {
   return this.hamConfig;
  }

  ConfigurationManager.prototype.getUserPermissions = function () {
    return  this.userPermissions;
  }

  /**
   * Check Retail User
   */
  ConfigurationManager.prototype.isRetailUser = function () {
    return (this.userRole == 'TYPE_ID_RETAIL') ? true : false;
  }

  /**
   * Check Availibility of User Feature
   */
  ConfigurationManager.prototype.checkUserFeature = function (feature) {
    return this.features.indexOf(feature) > -1;
  }
  /**
   * Get stopReasons from configurations
   * @returns {String} -  stop reasons list
   */
  ConfigurationManager.prototype.getStopReasons = function() {
    return this.configurations.getItem('stopReasons');
  };

  /**
   * Get banner URL from configurations
   * @returns {String} -  Banner URL
   */
  ConfigurationManager.prototype.getSupportedCurrencies = function() {
    return this.configurations.getItem('currenciesSupported');
  };
  /**
   * Get banner URL from configurations
   * @param {obejct} currencies currency
   * @returns {object}  currency list
   */
  ConfigurationManager.prototype.getCurrenciesList = function(currencies) {
    var currencyArr = [];
    for (var cur in currencies) {
      var currency = [];
      var symbol = applicationManager
      .getConfigurationManager()
      .getCurrency(currencies[cur]);
      currency.push(currencies[cur], currencies[cur] + ' ' + symbol);
      currencyArr.push(currency);
    }
    return currencyArr;
  };
  /**
   * Get currency method.
   *@returns {String} - returns the currency.
   */
  ConfigurationManager.prototype.getCurrency = function(currency) {
    return this.currencyCode[currency];
  };
  ConfigurationManager.prototype.getWireTransferCurrency = function(currency) {
    return this.wireTransferCurrency[currency];
  };
  /**
   * Get stop reason from configurations
   * @param {obejct} stopReason
   * @returns {object}  stopreasons list
   */
  ConfigurationManager.prototype.getStopReasonsList = function(stopReasons) {
    var reasonsArr = [];
    for (var arr in stopReasons) {
      var reasons = [];
      reasons.push(arr, stopReasons[arr]);
      reasonsArr.push(reasons);
    }
    return reasonsArr;
  };
  /**
   * Get banner URL from configurations
   * @returns {String} -  Banner URL
   */
  ConfigurationManager.prototype.getBannerURL = function() {
    return this.configurations.getItem('BANNER_URL');
  };
  /**
   * Get No of days required for Rating through Profile or Logout from configurations
   * @returns {String} -  Banner URL
   */
  ConfigurationManager.prototype.getRatingFromProfile = function() {
    return this.configurations.getItem('FirstProfileRating');
  };
  /**
   * Get No of days required for Rating through Transactions from configurations
   * @returns {String} -  Banner URL
   */
  ConfigurationManager.prototype.getRatingFromTransactions = function() {
    return this.configurations.getItem('FirstTransactionRating');
  };
  /**
   * Get No of days required for Rating Second time from configurations
   * @returns {String} -  Banner URL
   */
  ConfigurationManager.prototype.getRatingForSecondtime = function() {
    return this.configurations.getItem('SecondTimeRating');
  };
  /**
   * Get max no of times to submit rating from configurations
   * @returns {String} -  Banner URL
   */
  ConfigurationManager.prototype.getMaxtimeRating = function() {
    return this.configurations.getItem('NumberoftimesforRating');
  };
  /**
   * Get majjor version to submit rating from configurations
   * @returns {String} -  Banner URL
   */
  ConfigurationManager.prototype.getMajorVersionforRating = function() {
    return this.configurations.getItem('MajorVersionforRating');
  };
  /**
   * Get isPostLoginAdsEnabled value
   * @returns {String} - true or false
   */
  ConfigurationManager.prototype.getIsPostLoginAdsEnabled = function() {
    return this.configurations.getItem('isPostLoginAdsEnabled');
  };
  /**
   * Get Deployment Geography.
   * @returns {String} - deployment geography.
   */
  ConfigurationManager.prototype.getDeploymentGeography = function() {
    return this.configurations.getItem('DEPLOYMENTGEOGRAPHY');
  };
  /**
   * Get the Base Currency
   * @returns {String} - base currency
   */
  ConfigurationManager.prototype.getBaseCurrency = function() {
    return this.configurations.getItem('BASECURRENCY');
  };
  /**
   * Get the is Feedback Vlaue
   * @returns {String} - Feedback
   */
  ConfigurationManager.prototype.getisFeedbackEnabled = function() {
    return this.configurations.getItem('isFeedbackEnabled');
  };
  /**
   * Get the is Feedback Vlaue
   * @returns {String} - Feedback
   */
  ConfigurationManager.prototype.getshowFeedBackPostLogout = function() {
    return this.configurations.getItem('showFeedBackPostLogout');
  };
  ConfigurationManager.prototype.setshowFeedBackPostLogout = function(value) {
    this.configurations.setItem('showFeedBackPostLogout',value);
  };
  /**
   * Get constants of terma and conditions
   * @returns {Json} - Terms and conditions.
   */
  ConfigurationManager.prototype.getTermsAndConditions = function()
  {
    return this.termsAndConditions;
  };
  /**
   * Get bank name from configurations
   * @returns {String} - bank Name
   */
  ConfigurationManager.prototype.getBankName = function() {
    return this.configurations.getItem('BANKNAME');
  };
  /**
   * Get business days from configurations
   * @returns {String} - value associated with given key
   */
  ConfigurationManager.prototype.getBusinessDays = function() {
    return this.configurations.getItem('BUSINESSDAYS');
  };
  /**
   * Get ocr api key from configurations
   * @returns {String} - value associated with given key
   */
  ConfigurationManager.prototype.getOcrApiKey = function() {
    return this.configurations.getItem('OCRAPIKEY');
  };
  /**
   * Get ocr secret key from configurations
   * @returns {String} - value associated with given key
   */
  ConfigurationManager.prototype.getOcrSecretKey = function() {
    return this.configurations.getItem('OCRSECRETKEY');
  };
  /**
   * Get facial license string from configurations
   * @returns {String} - value associated with given key
   */
  ConfigurationManager.prototype.getFacialLicenseString = function() {
    return this.configurations.getItem('FACIALLICENSESTRING');
  };
  /**
   * Get facial license server url from configurations
   * @returns {String} - value associated with given key
   */
  ConfigurationManager.prototype.getFacialLicenseServerUrl = function() {
    return this.configurations.getItem('FACIALLICENSESERVERURL');
  };
  /**
   * Get is update mandatory from configurations
   * @returns {boolean} - value associated with given key
   */
  ConfigurationManager.prototype.isAppUpdateMandatory = function() {
    return this.configurations.getItem('ISUPDATEMANDATORY') == 'true'
      ? true
    : false;
  };
  /**
   * Get is update from configurations
   * @returns {boolean} - value associated with given key
   */
  ConfigurationManager.prototype.isAppUpdate = function() {
    return this.configurations.getItem('ISUPDATE') == 'true' ? true : false;
  };
  /**
   * Set locale and date format at app launch
   * @returns
   */
  ConfigurationManager.prototype.setStartupLocaleAndDateFormat = function(res) {
    var config = applicationManager.getConfigurationManager();
    var sm = applicationManager.getStorageManager();
    var langObjFromStorage = sm.getStoredItem('langObj');
    if (!kony.sdk.isNullOrUndefined(langObjFromStorage)) {
      config.configurations.setItem(
        'LOCALE',
        config.locale[langObjFromStorage.language]
      );
    } else {
      config.configurations.setItem('LOCALE', 'en_US');
    }
    if (config.getLocale() !== null) {
      config.configurations.setItem(
        'DATEFORMAT',
        config.frontendDateFormat[config.getLocale()]
      );
    } else {
      config.configurations.setItem('DATEFORMAT', null);
    }
  };
  /**
   * Set locale and date format
   * @returns
   */
  ConfigurationManager.prototype.setLocaleAndDateFormat = function(res) {
    var config = applicationManager.getConfigurationManager();
    if (!config.getLanguageSelectionFlag()) {
    // [Trixon] Started
    //   config.configurations.setItem('LOCALE', 'en_US');
    config.configurations.setItem('LOCALE', 'en_US');
    // [Trixon] Ended
    } else {
      var sm = applicationManager.getStorageManager();
      var langObjFromStorage = sm.getStoredItem('langObj');
      if (!kony.sdk.isNullOrUndefined(langObjFromStorage)) {
        config.configurations.setItem(
          'LOCALE',
          config.locale[langObjFromStorage.language]
        );
      } else if (
        !kony.sdk.isNullOrUndefined(res) &&
        res['data'].language !== undefined
      ) {
        config.configurations.setItem(
          'LOCALE',
          config.locale[res['data'].language]
        );
      } else {
        // [Trixon] Started
        //   config.configurations.setItem('LOCALE', 'en_US');
        config.configurations.setItem('LOCALE', 'en');
        // [Trixon] Ended
      }
    }
    if (config.getLocale() !== null) {
      config.configurations.setItem(
        'DATEFORMAT',
        config.frontendDateFormat[config.getLocale()]
      );
    } else {
      config.configurations.setItem('DATEFORMAT', null);
    }
  };
  /**
   * Get is update from configurations
   * @returns {boolean} - value associated with given key
   */
  ConfigurationManager.prototype.getLanguageSelectionFlag = function() {
    return this.configurations.getItem('ISLANGUAGESELECTION') !== null &&
      this.configurations.getItem('ISLANGUAGESELECTION') == 'true'
      ? true
    : false;
  };
  /**
   * Get availability of profile image enabled from configurations
   * @returns {boolean} - value associated with given key
   */
  ConfigurationManager.prototype.getProfileImageAvailabilityFlag = function() {
    return this.configurations.getItem('isprofileImageAvailable') == 'true'
      ? true
    : false;
  };
  /**
   * Get is backend currency symbol flag enabled in configurations
   * @returns {boolean} - value associated with given key
   */
  ConfigurationManager.prototype.getBackEndCurencySymbolFlag = function() {
    return this.configurations.getItem('ISBACKENDCURRENCYSYMBOLENABLED') ==
      'true'
      ? true
    : false;
  };
  /**
   * Get is country flag enabled from configurations
   * @returns {boolean} - value associated with given key
   */
  ConfigurationManager.prototype.getCountryCodeFlag = function() {
    return this.configurations.getItem('ISCOUNTRYCODEENABLED') == 'true'
      ? true
    : false;
  };
  /**
   * Get is sort code visibility enabled from configurations
   * @returns {boolean} - value associated with given key
   */
  ConfigurationManager.prototype.getSortCodeVisibilityFlag = function() {
    return this.configurations.getItem('ISSORTCODEVISIBLE') == 'true'
      ? true
    : false;
  };
  /**
   * Get is sort code visibility enabled from configurations
   * @returns {boolean} - value associated with given key
   */
  ConfigurationManager.prototype.getAccountIDLevelAlertsFlag = function() {
    return this.configurations.getItem('isAlertAccountIDLevel') == 'true'
      ? true
    : false;
  };
  /**
   * Get is sort code visibility enabled from configurations
   * @returns {boolean} - value associated with given key
   */
  ConfigurationManager.prototype.getUTCDateFormattingFlag = function() {
    return this.configurations.getItem('ISUTCDATEFORMATTINGENABLED') == 'true'
      ? true
    : false;
  };
  /**
   * Get currency code from configurations
   * @returns {String} - value associated with given key
   */
  ConfigurationManager.prototype.getCurrencyCode = function() {
    //added Default to handle undefined in few cases as per ARB-17123
    return (this.configurations.getItem('CURRENCYCODE')!==undefined && this.configurations.getItem('CURRENCYCODE'))
      ? this.configurations.getItem('CURRENCYCODE')
    : '$';
  };
  /**
   * Get currency method.
   *@returns {String} - returns the currency.
   */
  ConfigurationManager.prototype.getCurrency = function(currency) {
    return this.currencyCode[currency];
  };
  /**
   * Get locale from configurations
   * @returns {String} - value associated with given key
   */
  ConfigurationManager.prototype.getLocale = function() {
    return this.configurations.getItem('LOCALE');
  };
  /**
   * Get Date format from configurations
   * @returns {String} - value associated with given key
   */
  ConfigurationManager.prototype.getDateFormat = function() {
    if (kony.application.getCurrentForm().id === "frmViewRequests" && kony.i18n.getCurrentLocale() === "ar_AE"){
      this.configurations.items.DATEFORMAT = 'm/d/Y';
    }
    return this.configurations.getItem('DATEFORMAT');
  };
  /**
   * Get force Touch Items form configurations
   * @returns {List} - List of force touch items
   */
  ConfigurationManager.prototype.getForceTouchItems = function() {
    // needs implimentation
    return;
  };
  /**
   * Get frequencyTypes(constants) form configurations
   * @returns {Array} - List of constant
   */
  ConfigurationManager.prototype.getFrequencyTypes = function() {
    var typesList = [];
    typesList.push('WEEKLY', 'DAILY', 'MONTHLY', 'BIWEEKLY');
    return typesList;
  };
  /**
   * Get days display names for Id(constants) form configurations
   * @returns {JSONObj} - List of constant
   */
  ConfigurationManager.prototype.getDaysDisplayNames = function() {
    var daysList = {};
    daysList = {"SUNDAY":"Sunday",
                "MONDAY":"Monday",
                "TUESDAY":"Tuesday",
                "WEDNESDAY":"Wednesday",
                "THURSDAY":"Thursday",
                "FRIDAY":"Friday",
                "SATURDAY":"Saturday"};
    return daysList;
  };
  /**
   * Get value of given constant form configurations
   * @param {String} cosntant - name of constant
   * @returns {String} - value associated with given key
   */
  ConfigurationManager.prototype.getConstantValue = function(constant) {
    return this.constants[constant];
  };
  /**
   * Get value of marital status from configurations
   * @returns {Array}
   */
  ConfigurationManager.prototype.getMaritalStatus = function() {
    return this.maritalStatus;
  };
  /**
   * Get value of number of dependents from configurations
   * @returns {Array}
   */
  ConfigurationManager.prototype.getNumberOfDependents = function() {
    return this.numberOfDependents;
  };
  /**
   * Get value of employment type from configurations
   * @returns {Array}
   */
  ConfigurationManager.prototype.getEmployementType = function() {
    return this.employmentTypeValues;
  };
  ConfigurationManager.prototype.getDisputeReason = function() {
    return this.DisputeReason;
  };

  /**
   * Get value of gender from configurations
   * @returns {Array}
   */
  ConfigurationManager.prototype.getGender = function() {
    return this.gender;
  };
  /**
   * Get value of employment experience from configurations
   * @returns {Array}
   */
  ConfigurationManager.prototype.getEmploymentExperience = function() {
    return this.employmentInfoYears;
  };
  /**
   * Get value of annual income from configurations
   * @returns {Array}
   */
  ConfigurationManager.prototype.getAnnualIncome = function() {
    return this.annualIncome;
  };
  /**
   * Get value of monthly income from configurations
   * @returns {Array}
   */
  ConfigurationManager.prototype.getMonthlyIncome = function() {
    return this.monthlyExpenditure;
  };
  /**
   * Get value of financial assets from configurations
   * @returns {Array}
   */
  ConfigurationManager.prototype.getFinancialAssets = function() {
    return this.assets;
  };
  /**
   * Get Menu Items for Hamburger Menu configurations
   * @returns {Array}
   */
  ConfigurationManager.prototype.getHamburgerMenuItems = function() {
    if(this.AggregatedExternalAccountEnabled)
      return this.hamburgerMenuItems;
    else
    {
      for(i=0;i<this.hamburgerMenuItems.length;i++)
        if(this.hamburgerMenuItems[i].text==this.constants.MENUMANAGEOTHERBANKACCOUNTS)
          break;
      this.hamburgerMenuItems.splice(i,1);
      return this.hamburgerMenuItems;
    }
  };
  /**
   * Get Menu Items for Hamburger Menu configurations
   * @returns {Array}
   */
  ConfigurationManager.prototype.modifyHamburgerMenuItems = function() {
    this.hamburgerMenuItems.splice(6, 3);
  };
  /**
   * Get value IsAggregatedExternalAccountEnabled, customer level configurable
   * @returns true/false
   */
  ConfigurationManager.prototype.isAggregatedExternalAccountEnabled = function() {
    return this.AggregatedExternalAccountEnabled;
  };
  /**
   * Get value DebugMode, customer level configurable
   * @member of ConfigurationManager
   * @returns true/false
   */
  ConfigurationManager.prototype.isDebugMode = function() {
    return this.DebugMode;
  };
  /**
   * Get value EngageEnabled, customer level configurable
   * @returns true/false
   */
  ConfigurationManager.prototype.isEngageEnabled = function() {
    return this.EngageEnabled == 'true' ? true : false;
  };
  /* Get Menu Items for More Menu from configurations
   * @returns {Array}
   */
  ConfigurationManager.prototype.getMoreMenuItems = function() {
    return this.moreMenuItems;
  };
  /* Get Menu Items for More Menu from configurations for Ipad
   * @returns {Array}
   */
  ConfigurationManager.prototype.getMoreMenuItemsIpad = function() {
    return this.moreMenuItemsIpad;
  };
  /**
   * Get Menu Items for IOS app menu from configurations
   * @returns {Array}
   */
  ConfigurationManager.prototype.getIOSAppMenuItems = function() {
    return this.iPhoneMenuItems;
  };
  /**
   * Get Menu Items for IPad app menu from configurations
   * @returns {Array}
   */
  ConfigurationManager.prototype.getIPadAppMenuItems = function() {
    return this.iPadMenuItems;
  };
  /**
   * Get Menu Items for IOS app more Menu configurations
   * @returns {Array}
   */
  ConfigurationManager.prototype.getIOSAppMoreMenuItems = function() {
    if(this.AggregatedExternalAccountEnabled)
      return this.moreMenuItems;
    else
    {
      for(i=0;i<this.moreMenuItems.length;i++)
        if(this.moreMenuItems[i].text==this.constants.MENUMANAGEOTHERBANKACCOUNTS)
          break;
      this.moreMenuItems.splice(i,1);
      return this.moreMenuItems;
    }
  };
  /**
   * Getter for Denomination amount values from configurations
   * @returns {Array}
   */
  ConfigurationManager.prototype.getDenominationAmountValues = function() {
    return this.denominationAmountValues;
  };
  /**
   * Get value isCustomMetricsEnabled, customer level configurable
   * @returns {Boolean} true/false
   */
  ConfigurationManager.prototype.isCustomMetricsEnabled = function() {
    return this.CustomMetricsEnabled;
  };
  /**
   * Getter for server time zone from configurations
   * @member of ConfigurationManager
   * @returns {String}
   */
  ConfigurationManager.prototype.getServerTimeZone = function() {
    return this.serverTimeZone;
  };
  /**
   * Get Message unread count
   * @returns {number} number of unread messages
   */
  ConfigurationManager.prototype.getUnreadMessageCount = function() {
    return this.unreadMessageCount;
  };
  /**
   * Set Message unread count
   * @returns {number} number of unread messages
   */
  ConfigurationManager.prototype.setUnreadMessageCount = function(
  unreadMessageCount
  ) {
    this.unreadMessageCount = unreadMessageCount;
  };
  /**
   * Method to set Configutation value
   * @param {string} key - configuration key
   * @param {*} value - configuration value
   */
  ConfigurationManager.prototype.setConfigurationValue = function(key, value) {
    var scopeObj = this;
    if (value !== undefined && value !== null) {
      scopeObj[key] = value;
    }
  };
  /**
   * Method to get Configutation value
   * @param {string} key - configuration key
   * @returns {*} value - configuration value
   */
  ConfigurationManager.prototype.getConfigurationValue = function(key) {
    var scopeObj = this;
    return scopeObj[key];
  };
  /**
   * Method update entitlement values
   * @param {object}  entitlements  - entilements data response object
   */
  ConfigurationManager.prototype.setEntitlements = function(entitlements) {
    var servicesListForUser = entitlements;
    this.servicesListForUser = servicesListForUser;
    for (var i = 0; i < servicesListForUser.length; i++) {
      switch (servicesListForUser[i]) {
		case 'IMPORT_LC':
          this.setConfigurationValue('isTradeFinance', 'true');
          break;
		case 'EXPORT_LC':
          this.setConfigurationValue('isExportTradeFinance', 'true');
          break;
        case 'TRANSFER_BETWEEN_OWN_ACCOUNT':
          this.setConfigurationValue('isKonyBankAccountsTransfer', 'true');

          break;
        case 'INTRA_BANK_FUND_TRANSFER':
          this.setConfigurationValue('isOtherKonyAccountsTransfer', 'true');
          break;
        case 'INTER_BANK_ACCOUNT_FUND_TRANSFER':
          this.setConfigurationValue('isOtherBankAccountsTransfer', 'true');

          break;
        case 'INTERNATIONAL_ACCOUNT_FUND_TRANSFER':
          this.setConfigurationValue('isInternationalAccountsTransfer', 'true');

          break;
        case 'DOMESTIC_WIRE_TRANSFER':
          this.setConfigurationValue('isDomesticWireTransferEnabled', 'true');

          break;
        case 'INTERNATIONAL_WIRE_TRANSFER':
          this.setConfigurationValue(
            'isInternationalWireTransferEnabled',
            'true'
          );

          break;
        case 'BILL_PAY':
          this.setConfigurationValue('isBillPayEnabled', 'true');

          break;
        case 'WEALTH_WATCHLIST_INSTRUMENT_VIEW':
          this.setConfigurationValue('isWatchlistEnabled', 'true');

          break;
        case 'P2P':
          this.setConfigurationValue('ispayAPersonEnabled', 'true');

          break;
        case 'RDC':
          this.setConfigurationValue('isRDCEnabled', 'true');

          break;
        case 'USER_MANAGEMENT':
          this.setConfigurationValue('isBusinessOwner', 'true');
          break;

        default:
          break;
      }
    }
    if (
      entitlements.isSecurityQuestionConfigured !== undefined &&
      entitlements.isSecurityQuestionConfigured !== null
    ) {
      this.setConfigurationValue(
        'isSecurityQuestionConfigured',
        entitlements.isSecurityQuestionConfigured
      );
    }
  };
  /**
   * Method to set Data in Menu Based on Entitlement
   */
  ConfigurationManager.prototype.rearrangeHamburgerAccordingToEntitements = function() {
    var self = this;
    self.hamburgerMenuItems = self.hamburgerMenuItems.filter(
      function(data) {
        if((self.isBillPayEnabled === 'false' && data.text === self.constants.MENUBILLPAY) || (self.isRDCEnabled === 'false' && data.text === self.constants.MENUCHECKDEPOSIT) ||  (self.EngageEnabled === 'false' && data.text === self.constants.MENUENGAGE))
        {
          return false;
        }
        switch(data.text){
          case self.constants.MENUACH:
            return (self.checkUserFeature("ACH_COLLECTION") || self.checkUserFeature("ACH_PAYMENT") || self.checkUserFeature("ACH_FILES"));

          case self.constants.MENUAPPROVALREQUEST:
            var permissions = self.getApprovalsAndRequestsFeaturePermissionsList();
            return permissions.some(self.checkUserPermission.bind(self));
          case self.constants.MENUUSERMANAGEMENT:
            return self.checkUserFeature("USER_MANAGEMENT");

          case self.constants.MENUCARDMANAGEMENT:
            return self.checkUserFeature("CARD_MANAGEMENT");

          case self.constants.MENUCONVERSATIONALBANKING:
            	return self.checkUserFeature("CONVERSATIONAL_BANKING");

            //             case this.constants.MENUBILLPAY:
            //               return this.checkUserFeature("BILL_PAY");
          case self.constants.MENUDISPUTE:
            return self.checkUserFeature("DISPUTE_TRANSACTIONS")
            case self.constants.MENUMESSAGES:
            return self.checkUserFeature("MESSAGES");

          case self.constants.MENUFEEDBACK:
            return self.checkUserFeature("FEEDBACK");      

          case self.constants.MENUOPENACOUNT:
            return (self.isSMEUser !== "true");

          case self.constants.MENUMANAGERECIPIENTS:
            return ["INTER_BANK_ACCOUNT_FUND_TRANSFER_VIEW_RECEPIENT",
                    "INTRA_BANK_FUND_TRANSFER_VIEW_RECEPIENT",
                    "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_VIEW_RECEPIENT",
                    "P2P_VIEW_RECEPIENT"].some(self.checkUserPermission.bind(self));
            
         case self.constants.MENUMANAGEBENEFICIARIES:
            return ["INTER_BANK_ACCOUNT_FUND_TRANSFER_VIEW_RECEPIENT",
                    "INTRA_BANK_FUND_TRANSFER_VIEW_RECEPIENT",
                    "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_VIEW_RECEPIENT",
                    "P2P_VIEW_RECEPIENT"].some(self.checkUserPermission.bind(self));

          case self.constants.MENUCHEQUEMANAGEMENT:
            var chequeFeatures = ["CHEQUE_BOOK_REQUEST", "VIEW_CHEQUES", "STOP_PAYMENT_REQUEST"];
            return chequeFeatures.some(self.checkUserFeature.bind(self));

          case self.constants.MENUCARDLESS:
           return self.checkUserPermission("WITHDRAW_CASH_VIEW_SUMMARY");
		  
          case self.constants.MENUCHECKDEPOSIT:
            return self.checkUserPermission("RDC");
			
          case self.constants.MENUPFMMYMONEY:
            return  self.checkUserFeature("PERSONAL_FINANCE_MANAGEMENT");
          case self.constants.MENUTRANSFERS:
            if (self.getDeploymentGeography() === "EUROPE") {
              return self.checkUserPermission("TRANSFER_BETWEEN_OWN_ACCOUNT_CREATE");
            } 
          case self.constants.MENUFOREIGNEXCHANGE:
            return self.checkUserFeature("FX_RATES");
          case self.constants.MENUWEALTHWATCHLIST:
            return self.checkUserPermission("WEALTH_WATCHLIST_INSTRUMENT_VIEW");
        } 

        return true;
      }
    );
    self.moreMenuItems = self.moreMenuItems.filter(
      function(data) {
        if((self.isBillPayEnabled === 'false' && data.text === self.constants.MENUBILLPAY) || (self.isRDCEnabled === 'false' && data.text === self.constants.MENUCHECKDEPOSIT))
          return false;
        switch(data.text){
          case self.constants.MENUACH:
            return (self.checkUserFeature("ACH_COLLECTION") || self.checkUserFeature("ACH_PAYMENT") || self.checkUserFeature("ACH_FILES"));

          case self.constants.MENUAPPROVALREQUEST:
            var permissions = self.getApprovalsAndRequestsFeaturePermissionsList();
            return permissions.some(self.checkUserPermission.bind(self));

          case self.constants.MENUUSERMANAGEMENT:
            return self.checkUserFeature("USER_MANAGEMENT");

          case self.constants.MENUOPENACOUNT:
            return (self.isSMEUser !== "true");

          case self.constants.MENUCARDMANAGEMENT:
            return self.checkUserFeature("CARD_MANAGEMENT");

          case self.constants.MENUCONVERSATIONALBANKING:
            	return self.checkUserFeature("CONVERSATIONAL_BANKING");

            //             case this.constants.MENUBILLPAY:
            //               return this.checkUserFeature("BILL_PAY");
          case self.constants.MENUDISPUTE:
            return self.checkUserFeature("DISPUTE_TRANSACTIONS")    
            case self.constants.MENUMESSAGES:
            return self.checkUserFeature("MESSAGES");

          case self.constants.MENUFEEDBACK:
            return self.checkUserFeature("FEEDBACK");      

          case self.constants.MENUMANAGERECIPIENTS:
            return ["INTER_BANK_ACCOUNT_FUND_TRANSFER_VIEW_RECEPIENT",
                    "INTRA_BANK_FUND_TRANSFER_VIEW_RECEPIENT",
                    "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_VIEW_RECEPIENT",
                    "P2P_VIEW_RECEPIENT"].some(self.checkUserPermission.bind(self));
            
          case self.constants.MENUMANAGEBENEFICIARIES:
            return ["INTER_BANK_ACCOUNT_FUND_TRANSFER_VIEW_RECEPIENT",
                    "INTRA_BANK_FUND_TRANSFER_VIEW_RECEPIENT",
                    "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_VIEW_RECEPIENT",
                    "P2P_VIEW_RECEPIENT"].some(self.checkUserPermission.bind(self));

          case self.constants.MENUCHEQUEMANAGEMENT:
            var chequeFeatures = ["CHEQUE_BOOK_REQUEST", "VIEW_CHEQUES", "STOP_PAYMENT_REQUEST"];
            return chequeFeatures.some(self.checkUserFeature.bind(self));

          case self.constants.MENUCARDLESS:
           return self.checkUserPermission("WITHDRAW_CASH_VIEW_SUMMARY");
          
          case self.constants.MENUCHECKDEPOSIT:
            return self.checkUserPermission("RDC");
			
          case self.constants.MENUPFMMYMONEY:
            return self.checkUserFeature("PERSONAL_FINANCE_MANAGEMENT");

          case self.constants.MENUFOREIGNEXCHANGE:
            return self.checkUserFeature("FX_RATES");

          case self.constants.MENUWEALTHWATCHLIST:
            return self.checkUserPermission("WEALTH_WATCHLIST_INSTRUMENT_VIEW");
          case self.constants.MENUACCOUNTSTATEMENTS:
            return self.checkUserFeature("MANAGE_ACCOUNT_STATEMENTS");

        }

        return true;
      }
    );
    if (!self.checkUserFeature("WEALTH_INVESTMENT_DETAILS")){
      if (self.getDeploymentGeography() === "EUROPE") {
        if (!self.checkUserPermission("TRANSFER_BETWEEN_OWN_ACCOUNT_CREATE")) {
          this.iPhoneMenuItems.splice(1, 1, self.moreMenuItems.shift());
        }
      }
      else {
        var transferFeatures = [
          "INTER_BANK_ACCOUNT_FUND_TRANSFER",
          "INTRA_BANK_FUND_TRANSFER",
          "INTERNATIONAL_ACCOUNT_FUND_TRANSFER",
          "P2P",
          "TRANSFER_BETWEEN_OWN_ACCOUNT"
        ];
        if (!transferFeatures.some(this.checkUserFeature.bind(this))) {
          this.iPhoneMenuItems.splice(1, 1,
                                      self.moreMenuItems.shift()
                                     );
        }
      }
    }
    this.isWatchlistEnabled = self.checkUserPermission("WEALTH_WATCHLIST_INSTRUMENT_VIEW");
   if (this.isWatchlistEnabled !== true && (this.iPhoneMenuItems[1] && this.iPhoneMenuItems[1].text == this.constants.MENUWEALTHWATCHLIST) ){
      this.iPhoneMenuItems.splice(1, 1);
    } else if (this.isWatchlistEnabled === true) {
      this.iPhoneMenuItems.splice(3, 1);
	  if(this.iPhoneMenuItems[1].text!==this.constants.MENUWEALTHWATCHLIST)
	{
	   this.iPhoneMenuItems.splice(1, 0, {
          img: 'watchlist_n.png',
          text: this.constants.MENUWEALTHWATCHLIST,
          info: null,
          visibility: true
	   });
	}
	  
	  
    }
    if (this.isWatchlistEnabled !== true && this.isBillPayEnabled !== 'true') {
      this.iPhoneMenuItems.splice(2, 1, {
        img: 'apollosettings.png',
        text: this.constants.MENUSETTINGS,
        info: null,
      });
    }
    
    this.iPhoneMenuItems = this.isWatchlistEnabled ? this.iPhoneMenuItems : this.iPhoneMenuItems.filter(item => item.text !== kony.i18n.getLocalizedString('i18n.wealth.watchlistcard.header'));
    
    if (this.EngageEnabled != 'true') {
      for (var i2 = 0; i2 < this.moreMenuItems.length; i2++) {
        if (this.moreMenuItems[i2].text === this.constants.MENUENGAGE) {
          this.moreMenuItems.splice(i2, 1);
          break;
        }
      }
    }
	
	this.iPhoneMenuItems = this.iPhoneMenuItems.filter((obj, index) => {
	  return index === this.iPhoneMenuItems.findIndex(o => obj.text === o.text);
	});

  };
  /**
   * Method to get user services list.
   * @returns {Array} servicesListForUser - Users services list
   */
  ConfigurationManager.prototype.getServicesListForUser = function() {
    return this.servicesListForUser;
  };
  /**
   * Method to get transaction types
   * @returns {Array} response - transaction types
   */
  ConfigurationManager.prototype.getTransactionTypesMetaData = function() {
    /**@member {Array} gender holds the list of different transaction types*/
    var transactionTypesMetaData = [
      {
        applicationValue: this.transactionTypes.INTERNAL,
        backendValue: kony.i18n.getLocalizedString('i18n.Transactions.backendInternalTransfer'),
        displayValue: kony.i18n.getLocalizedString('i18n.Transactions.displayInternalTransfer'),
      },
      {
        applicationValue: this.transactionTypes.BILLPAY,
        backendValue: kony.i18n.getLocalizedString('i18n.Transactions.backendBillPay'),
        displayValue: kony.i18n.getLocalizedString('i18n.Transactions.displayBillPay'),
      },
      {
        applicationValue: this.transactionTypes.EXTERNAL,
        backendValue: kony.i18n.getLocalizedString('i18n.Transactions.backendExternalTransfer'),
        displayValue: kony.i18n.getLocalizedString('i18n.Transactions.displayExternalTransfer'),
      },
      {
        applicationValue: this.transactionTypes.DEPOSIT,
        backendValue: kony.i18n.getLocalizedString('i18n.Transactions.backendDeposit'),
        displayValue: kony.i18n.getLocalizedString('i18n.Transactions.displayDeposit'),
      },
      {
        applicationValue: this.transactionTypes.P2P,
        backendValue: kony.i18n.getLocalizedString('i18n.Transactions.backendP2P'),
        displayValue: kony.i18n.getLocalizedString('i18n.Transactions.displayP2P'),
      },
      {
        applicationValue: this.transactionTypes.CARDLESS,
        backendValue: kony.i18n.getLocalizedString('i18n.Transactions.backendCardless'),
        displayValue: kony.i18n.getLocalizedString('i18n.Transactions.displayCardless'),
      },
      {
        applicationValue: this.transactionTypes.CHECKWITHDRAWAL,
        backendValue: kony.i18n.getLocalizedString('i18n.Transactions.backendCheckWithdrawal'),
        displayValue: kony.i18n.getLocalizedString('i18n.Transactions.displayCheckWithdrawal'),
      },
      {
        applicationValue: this.transactionTypes.WITHDRAWAL,
        backendValue: kony.i18n.getLocalizedString('i18n.Transactions.backendWithdrawal'),
        displayValue: kony.i18n.getLocalizedString('i18n.Transactions.displayWithdrawal'),
      },
      {
        applicationValue: this.transactionTypes.INTEREST,
        backendValue: kony.i18n.getLocalizedString('i18n.Transactions.backendInterest'),
        displayValue: kony.i18n.getLocalizedString('i18n.Transactions.displayInterest'),
      },
      {
        applicationValue: this.transactionTypes.REQUEST,
        backendValue: kony.i18n.getLocalizedString('i18n.Transactions.backendRequest'),
        displayValue: kony.i18n.getLocalizedString('i18n.Transactions.displayRequest'),
      },
      {
        applicationValue: this.transactionTypes.LOAN,
        backendValue: kony.i18n.getLocalizedString('i18n.Transactions.backendLoan'),
        displayValue: kony.i18n.getLocalizedString('i18n.Transactions.displayLoan'),
      },
      {
        applicationValue: this.transactionTypes.RECEIVEDP2P,
        backendValue: kony.i18n.getLocalizedString('i18n.Transactions.backendReceivedP2P'),
        displayValue: kony.i18n.getLocalizedString('i18n.Transactions.displayReceivedP2P'),
      },
      {
        applicationValue: this.transactionTypes.RECEIVEDREQUEST,
        backendValue: kony.i18n.getLocalizedString('i18n.Transactions.backendReceivedRequest'),
        displayValue: kony.i18n.getLocalizedString('i18n.Transactions.displayReceivedRequest'),
      },
      {
        applicationValue: this.transactionTypes.FEES,
        backendValue: kony.i18n.getLocalizedString('i18n.Transactions.backendFees'),
        displayValue: kony.i18n.getLocalizedString('i18n.Transactions.displayFees'),
      },
      {
        applicationValue: this.transactionTypes.INTERESTCREDIT,
        backendValue: kony.i18n.getLocalizedString('i18n.Transactions.backendInterestCredit'),
        displayValue: kony.i18n.getLocalizedString('i18n.Transactions.displayInterestCredit'),
      },
      {
        applicationValue: this.transactionTypes.INTERESTDEBIT,
        backendValue: kony.i18n.getLocalizedString('i18n.Transactions.backendInterestDebit'),
        displayValue: kony.i18n.getLocalizedString('i18n.Transactions.displayInterestDebit'),
      },
      {
        applicationValue: this.transactionTypes.WIRE,
        backendValue: kony.i18n.getLocalizedString('i18n.Transactions.backendWire'),
        displayValue: kony.i18n.getLocalizedString('i18n.Transactions.displayWire'),
      },
      {
        applicationValue: this.transactionTypes.STOPCHECKPAYEMENTREQUEST,
        backendValue: kony.i18n.getLocalizedString('i18n.Transactions.backendStopCheckPaymentRequest'),
        displayValue: kony.i18n.getLocalizedString('i18n.Transactions.displayStopCheckPaymentRequest'),
      },
      {
        applicationValue: this.transactionTypes.INTERNETBANKING,
        backendValue: kony.i18n.getLocalizedString('i18n.Transactions.backendInternetTransaction'),
        displayValue: kony.i18n.getLocalizedString('i18n.Transactions.displayInternetTransaction'),
      }
    ];
    return transactionTypesMetaData;
  };
  ConfigurationManager.prototype.getPfmTypesMetaData = function() {
    // var pfmTypesMetaData = [
    //   {
    //     applicationValue: this.pfmTypes.Home,
    //     backendValue: "Home",
    //     displayValue: "Home",
    //   },
    //   {
    //     applicationValue: this.pfmTypes.Utilities,
    //     backendValue: "Utilities",
    //     displayValue: "Utilities",
    //   },
    //   {
    //     applicationValue: this.pfmTypes.Financial,
    //     backendValue: "Financial",
    //     displayValue: "Financial",
    //   },
    //   {
    //     applicationValue: this.pfmTypes.Education,
    //     backendValue: "Education",
    //     displayValue: "Education",
    //   },
    //   {
    //     applicationValue: this.pfmTypes.Transportation,
    //     backendValue: "Transportation",
    //     displayValue: "Transportation",
    //   },
    //   {
    //     applicationValue: this.pfmTypes.Health,
    //     backendValue: "Health",
    //     displayValue: "Health",
    //   },
    //   {
    //     applicationValue: this.pfmTypes.Travel,
    //     backendValue: "Travel",
    //     displayValue: "Travel",
    //   },
    //   {
    //     applicationValue: this.pfmTypes.Food,
    //     backendValue: "Food",
    //     displayValue: "Food",
    //   },
    //   {
    //     applicationValue: this.pfmTypes.Uncategorised,
    //     backendValue: "Uncategorised",
    //     displayValue: "Uncategorized",
    //   },
    //   {
    //     applicationValue: this.pfmTypes.Other,
    //     backendValue: "Other",
    //     displayValue: "Other",
    //   }
    // ];
    var pfmTypesMetaData = [];
    return pfmTypesMetaData;
  };
  /**
   * Method to get account types
   * @returns {Array} response - account types
   */
  ConfigurationManager.prototype.getAccountTypesMetaData = function() {
    /**@member {Array} gender holds the list of different account types*/
    var accountTypesMetaData = [
      {
        applicationValue: this.constants.CHECKING,
        backendValue: this.constants.CHECKING,
        displayValue: 'i18n.Accounts.displayChecking',
      },
      {
        applicationValue: this.constants.SAVINGS,
        backendValue: this.constants.SAVINGS,
        displayValue: 'i18n.Accounts.displaySavings',
      },
      {
        applicationValue: this.constants.CREDITCARD,
        backendValue: this.constants.CREDITCARD,
        displayValue: 'i18n.Accounts.displayCreditCard',
      },
      {
        applicationValue: this.constants.DEPOSIT,
        backendValue: this.constants.DEPOSIT,
        displayValue: 'i18n.Accounts.displayDeposit',
      },
      {
        applicationValue: this.constants.MORTGAGE,
        backendValue: this.constants.MORTGAGE,
        displayValue: 'i18n.Accounts.displayMortgage',
      },
      {
        applicationValue: this.constants.LOAN,
        backendValue: this.constants.LOAN,
        displayValue: 'i18n.Accounts.displayLoan',
      },
      {
        applicationValue: this.accountTypes.CURRENT,
        backendValue: this.accountTypes.CURRENT,
        displayValue: 'i18n.Accounts.displayCurrent',
      },
      {
        applicationValue: this.constants.INVESTMENT,
        backendValue: this.constants.INVESTMENT,
        displayValue: 'i18n.Accounts.displayInvestment',
      },
      {
        applicationValue: this.constants.MORTGAGE_FACILITY,
        backendValue: this.constants.MORTGAGE_FACILITY,
        displayValue: 'i18n.accounts.displayMortgageFacilities',
      },
            
      {
        applicationValue: this.accountTypes.LINE_OF_CREDIT,
        backendValue: this.accountTypes.LINE_OF_CREDIT,
        displayValue: 'i18n.Accounts.displayLineOfCredit',
      },
      {
        applicationValue: this.accountTypes.EXTERNAL,
        backendValue: this.accountTypes.EXTERNAL,
        displayValue: 'i18n.Accounts.displayExternal',
      }, 
      {
        applicationValue: this.accountTypes.OTHER,
        backendValue: this.accountTypes.OTHER,
        displayValue: 'i18n.cardsManagement.others',
      },
    ];
    return accountTypesMetaData;
  };
  ConfigurationManager.prototype.reloadConstants = function() {
    var constants = {
      IDLE_TIMEOUT: 5,
      ALERT_IDLE_TIMEOUT: 4,
      TRAVELPLANS_DESTINATION_LIMIT: 5,
      IDENTITYSERVICENAME: OLBConstants.IDENTITYSERVICENAME,
      WEEKLY: 'Weekly',
      DAILY: 'Daily',
      MONTHLY: 'Monthly',
      BIWEEKLY: 'Biweekely',
      SERVICE_NAME: 'RBSERVICES',
      LOADING_SCREEN_MESSAGE: 'Loading ...',
      CHECKING: 'Checking',
      SAVINGS: 'Savings',
      CREDITCARD: 'CreditCard',
      DEPOSIT: 'Deposit',
      MORTGAGE: 'Mortgage',
      LOAN: 'Loan',
      INVESTMENT: 'Investment',
      MORTGAGE_FACILITY: 'mortgageFacility',
      EXTERNAL_BANK_ACCOUNT: 'ExternalBankAccount',
      LANG_CHANGE_FROM_LOGIN: 'login',
      LANG_CHANGE_FROM_SETTINGS: 'settings',
      HEADERFAQ: kony.i18n.getLocalizedString('kony.mb.Support.HeaderFAQ'),
      HEADERPRIVACYPOLICY: kony.i18n.getLocalizedString(
        'kony.mb.Support.HeaderPrivacyPolicy'
      ),
      HEADERABOUTUS: kony.i18n.getLocalizedString(
        'kony.mb.Support.HeaderAbout'
      ),
      HEADERTERMSANDCONDITIONS: kony.i18n.getLocalizedString(
        'kony.mb.Support.HeaderTC'
      ),
      FAQ: kony.i18n.getLocalizedString('kony.mb.Support.FAQ'),
      PRIVACY: kony.i18n.getLocalizedString('kony.mb.Support.Privacy'),
      TERMS: kony.i18n.getLocalizedString('kony.mb.Support.Terms'),
      ABOUT: kony.i18n.getLocalizedString('kony.mb.Support.Aboutus'),
      Last7days: kony.i18n.getLocalizedString(
        'kony.mb.AdvanceSearch.Last7days'
      ),
      Last14days: kony.i18n.getLocalizedString(
        'kony.mb.AdvanceSearch.last14days'
      ),
      Last1Month: kony.i18n.getLocalizedString(
        'kony.mb.AdvanceSearch.last1month'
      ),
      Last2Months: kony.i18n.getLocalizedString(
        'kony.mb.AdvanceSearch.last2months'
      ),
      Last3Months: kony.i18n.getLocalizedString(
        'kony.mb.AdvanceSearch.last3months'
      ),
      Last6Months: kony.i18n.getLocalizedString(
        'kony.mb.AdvanceSearch.last6months'
      ),
      Last12Months: kony.i18n.getLocalizedString(
        'kony.mb.AdvanceSearch.last12months'
      ),
      Last30days: kony.i18n.getLocalizedString(
        'kony.mb.AdvanceSearch.Last30days'
      ),
      Last60days: kony.i18n.getLocalizedString(
        'kony.mb.AdvanceSearch.Last60days'
      ),
      CustomRange: kony.i18n.getLocalizedString(
        'kony.mb.AdvanceSearch.CustomRange'
      ),
      Withdrawals: kony.i18n.getLocalizedString(
        'kony.mb.AdvanceSearch.Withdrawals'
      ),
      Deposits: kony.i18n.getLocalizedString('kony.mb.AdvanceSearch.Deposits'),
      P2PDebits: kony.i18n.getLocalizedString(
        'kony.mb.AdvanceSearch.P2PDebits'
      ),
      BillPay: kony.i18n.getLocalizedString('kony.mb.AdvanceSearch.BillPay'),
      Transfers: kony.i18n.getLocalizedString(
        'kony.mb.AdvanceSearch.Transfers'
      ),
      Checks: kony.i18n.getLocalizedString('kony.mb.AdvanceSearch.Checks'),
      P2PCredits: kony.i18n.getLocalizedString(
        'kony.mb.AdvanceSearch.P2PCredits'
      ),
      Issued: kony.i18n.getLocalizedString('kony.mb.chequemgmt.issued'),
      Cleared: kony.i18n.getLocalizedString(
        'kony.mb.chequemgmt.cleared'
      ),
      Returned: kony.i18n.getLocalizedString('kony.mb.chequemgmt.returned'),
      Stopped: kony.i18n.getLocalizedString(
        'kony.mb.chequemgmt.stopped'
      ),
      ChequeStolen: kony.i18n.getLocalizedString('kony.mb.CM.chequeStolen'),
      FundsNotAvailable: kony.i18n.getLocalizedString(
        'kony.mb.CM.fundsNotAvailable'
      ),
      ChequeLost: kony.i18n.getLocalizedString('kony.mb.CM.chequeLost'),
      ChequeDestroyed: kony.i18n.getLocalizedString(
        'kony.mb.CM.chequeDestroyed'
      ),
      MENUDASHBOARDOVERVIEW: kony.i18n.getLocalizedString('i18n.common.overview'),
      MENUACCOUNTS: kony.i18n.getLocalizedString('kony.mb.Hamburger.Accounts'),
      MENUTRANSFERS: kony.i18n.getLocalizedString(
        'kony.mb.Hamburger.Transfers'
      ),
      MENUACCOUNTSWEEP: kony.i18n.getLocalizedString("i18n.accountsweeps.accountSweep"),
      MENUQRPAYMENT: kony.i18n.getLocalizedString('i18n.qrpayments.QRPayments'),
      MENUUNIFIEDTRANSFERSFLOW: kony.i18n.getLocalizedString(
        'kony.mb.Hamburger.unifiedTransfersFlow'
      ),
      MENUCHEQUEMANAGEMENT:kony.i18n.getLocalizedString('kony.mb.CM.chequeManagement'),
      MENUMONEYMOVEMENTTRANSFERS: kony.i18n.getLocalizedString(
        'kony.mb.Hamburger.MoneyMovementTransfers'
      ),
      MENUTRANSFERSACTIVITY: kony.i18n.getLocalizedString(
        'kony.mb.MM.transferActivity'
      ),
      MENUMANAGERECIPIENTS: kony.i18n.getLocalizedString(
        'kony.mb.MM.manageRecipients'
      ),
      MENUMANAGETRANSACTIONS: kony.i18n.getLocalizedString(
        'kony.mb.transfers.ManageTransactions'
      ),
      MENUMANAGEBENEFICIARIES: kony.i18n.getLocalizedString(
        'kony.mb.TransfersEurope.ManageBeneficiaries'
      ),
      MENUDISPUTE: kony.i18n.getLocalizedString(
        'kony.mb.disputedTransactions.DisputedTransactions'
      ),
      MENUOPENACOUNT: kony.i18n.getLocalizedString(
        'kony.mb.Hamburger.OpenAccount'
      ),

      // [Trixon] Added Sidemenu item constants AND placed existing utilized menus here for code organization
        MENUACCOUNT: kony.i18n.getLocalizedString('cs.apollo.Account'),
        MENUSCHEDULEPAYMENTS: kony.i18n.getLocalizedString('cs.apollo.SchedulePayments'),
        MENURECEIVEPAYMENTS: kony.i18n.getLocalizedString('cs.apollo.ReceivePayments'),
        MENUCARDS: kony.i18n.getLocalizedString('cs.apollo.Cards'),
        MENUDEALSANDDISCOUNTS: kony.i18n.getLocalizedString('cs.apollo.DealsAndDiscounts'),
        MENUUSSD: kony.i18n.getLocalizedString('cs.apollo.USSD'),
        MENUREFERANDEARN: kony.i18n.getLocalizedString('cs.apollo.ReferAndEarn'),
        MENUMESSAGES: kony.i18n.getLocalizedString('cs.apollo.Messages'),
        MENUNOTIFICATIONS: kony.i18n.getLocalizedString('cs.apollo.Notifications'),
        MENULOCATE: kony.i18n.getLocalizedString('cs.apollo.LocateUs'),
        MENUSETTINGS: kony.i18n.getLocalizedString('cs.apollo.Settings'),
        MENUTERMSANDCONDITIONS: kony.i18n.getLocalizedString('cs.apollo.TermsandConditions'),
      // [Trixon] Ended 

      MENUACCOUNTSTATEMENTS:kony.i18n.getLocalizedString('kony.mb.Hamburger.AccountStatements'),
      MENUENGAGE: kony.i18n.getLocalizedString('kony.mb.Hamburger.Engage'),
    //   MENUMESSAGES: kony.i18n.getLocalizedString('i18n.AlertsAndMessages.AlertsAndMessages'),
    //   MENUNOTIFICATIONS: kony.i18n.getLocalizedString('kony.mb.Hamburger.Notifications'),
	  MENUSERVICEREQUESTS: kony.i18n.getLocalizedString('kony.mb.Hamburger.serviceRequests'),
    //   MENUSETTINGS: kony.i18n.getLocalizedString('kony.mb.Hamburger.Settings'),
      MENUCHATBOT: kony.i18n.getLocalizedString('kony.mb.Hamburger.chatbot'),
    //   MENULOCATE: kony.i18n.getLocalizedString('kony.mb.Hamburger.Locateus'),
      MENUWEALTHWATCHLIST: kony.i18n.getLocalizedString('i18n.wealth.watchlistcard.header'),
      MENUCONTACT: kony.i18n.getLocalizedString('kony.mb.Hamburger.Contactus'),
      MENUMYWALLET: kony.i18n.getLocalizedString('kony.mb.Hamburger.Mywallet'),
      MENUBILLPAY: kony.i18n.getLocalizedString('kony.mb.Hamburger.BillPay'),
      MENUFEEDBACK: kony.i18n.getLocalizedString('kony.mb.Hamburger.FeedBack'),
      MENUEXPLOREPRODUCTSORRESUME: kony.i18n.getLocalizedString('i18n.hamburger.exploreProductsOrResumeApplication'),
      MENUCHECKDEPOSIT: kony.i18n.getLocalizedString(
        'kony.mb.Hamburger.CheckDeposit'
      ),
      MENUCARDLESS: kony.i18n.getLocalizedString(
        'kony.mb.Hamburger.CardLessCash'
      ),
      MENUCARDMANAGEMENT: kony.i18n.getLocalizedString(
        'kony.mb.Hamburger.CardManagement'
      ),
      MENUCONVERSATIONALBANKING: kony.i18n.getLocalizedString(
        'kony.mb.Hamburger.ConversationalBanking'
      ),
      MENUMANAGEOTHERBANKACCOUNTS: kony.i18n.getLocalizedString(
        'kony.mb.ExternalAccounts.ManageOtherBankAccounts'
      ),
      MENUPFMMYMONEY: kony.i18n.getLocalizedString('kony.mb.PFMMyMoney'),
      MENUSENDMONEY: kony.i18n.getLocalizedString('kony.mb.Transfer.SendMoney'),
      MENUACH: kony.i18n.getLocalizedString('kony.mb.Hamburger.ACH'),
      MENUAPPROVALREQUEST: kony.i18n.getLocalizedString(
        'i18n.konybb.Common.ApprovalsRequests'
      ),
      MENUUSERMANAGEMENT: kony.i18n.getLocalizedString(
        'kony.mb.Hamburger.UserManagement'
      ),
      MENUFOREIGNEXCHANGE: kony.i18n.getLocalizedString(
        'kony.mb.Hamburger.exchangeRates'
      ),
       MENUTRADEFINANCE: kony.i18n.getLocalizedString('i18n.TradeFinance.TradeFinanceHamburger'),
       MENUSECURITYNOTIFICATIONS: kony.i18n.getLocalizedString('kony.mb.Hamburger.SecurityNotifications'),
       MENUPASSCODE:  kony.i18n.getLocalizedString('kony.mb.Hamburger.Passcode')!==null?kony.i18n.getLocalizedString('kony.mb.Hamburger.Passcode'):"Passcode",
       MENUBIOMETRICAPPROVAL: kony.i18n.getLocalizedString('kony.mb.Hamburger.BiometricApproval')!==null?kony.i18n.getLocalizedString('kony.mb.Hamburger.BiometricApproval'):"Biometric Approval"
      
    };
    this.constants = constants;
    if(!this.isFastTransfersFlowEnabled()){
      var hamburgerMenuItems = [
        {
          img: 'apollowallet.png',
          text: this.constants.MENUACCOUNT,
          info: null,
        },
        {
          img: 'apolloschedule.png',
          text: this.constants.MENUSCHEDULEPAYMENTS,
          info: null,
        },
        {
          img: 'apolloreceive.png',
          text: this.constants.MENURECEIVEPAYMENTS,
          info: null,
        },
        {
          img: 'apollocardwhite.png',
          text: this.constants.MENUCARDS,
          info: null,
        },
        {
          img: 'apollodeals.png',
          text: this.constants.MENUDEALSANDDISCOUNTS,
          info: null,
        },
        {
          img: 'apollonetwork.png',
          text: this.constants.MENUUSSD,
          info: null,
        },
        {
          img: 'apollocheckavatar.png',
          text: this.constants.MENUREFERANDEARN,
          info: null,
        },
        {
          img: 'apollomessages.png',
          text: this.constants.MENUMESSAGES,
          info: null,
        },
        // {
        //   img: 'apollobell.png',
        //   text: this.constants.MENUNOTIFICATIONS,
        //   info: null,
        // },
        {
          img: 'apollolocateus.png',
          text: this.constants.MENULOCATE,
          info: null,
        }, 
        {
          img: 'apollosettings.png',
          text: this.constants.MENUSETTINGS,
          info: null,
        },
        {
          img: 'apollowhiteverified.png',
          text: this.constants.MENUTERMSANDCONDITIONS,
          info: null,
        },
        // {
        //   img: 'accounts.png',
        //   text: this.constants.MENUDASHBOARDOVERVIEW,
        //   info: null,
        // },
        // {
        //   img: 'accounts.png',
        //   text: this.constants.MENUACCOUNTS,
        //   info: null,
        // },
        // {
        //   img: 'transfer.png',
        //   text: this.constants.MENUTRANSFERS,
        //   info: null,
        // },
        // {
        //   img: 'accountsweep.png',
        //   text: this.constants.MENUACCOUNTSWEEP,
        //   info: null,
        // },
        // {
        //   img: 'transfer.png',
        //   text: this.constants.MENUUNIFIEDTRANSFERSFLOW,
        //   info: null,
        // },
        // {
        //   img: 'chequemgmt.png',
        //   text: this.constants.MENUCHEQUEMANAGEMENT,
        //   info: null,
        // },
        // {
        //   img: 'billpay.png',
        //   text: this.constants.MENUBILLPAY,
        //   info: null,
        // },
        // {
        //   img: 'checkdepositimg.png',
        //   text: this.constants.MENUCHECKDEPOSIT,
        //   info: null,
        // },
        // {
        //   img: 'cardlesscash.png',
        //   text: this.constants.MENUCARDLESS,
        //   info: null,
        // },
        // {
        //   img: 'cardmange.png',
        //   text: this.constants.MENUCARDMANAGEMENT,
        //   info: null,
        // },
        // {
        //   img: 'chatbot.png',
        //   text: this.constants.MENUCONVERSATIONALBANKING,
        //   info: null,
        // },
        // {
        //   img: 'disputetransaction.png',
        //   text: this.constants.MENUDISPUTE,
        //   info: null,
        // },
        // //@TODO add constants and assets
        // {
        //   img: 'accounts.png',
        //   text: this.constants.MENUACH,
        //   info: null,
        // },
        // {
        //   img: 'approvalrequesticon.png',
        //   text: this.constants.MENUAPPROVALREQUEST,
        //   info: null,
        // },
        // {
        //   img: 'exchangerate.png',
        //   text: this.constants.MENUFOREIGNEXCHANGE,
        //   info: null,
        // },
        // {
        //   img: 'manage_user.png',
        //   text: this.constants.MENUUSERMANAGEMENT,
        //   info: null,
        // },
        // {
        //   img: 'mangeothrbank.png',
        //   text: this.constants.MENUMANAGEOTHERBANKACCOUNTS,
        //   info: null,
        // },
        // {
        //   img: 'mymoney.png',
        //   text: this.constants.MENUPFMMYMONEY,
        //   info: null,
        // },
        // {
        //   img: 'tradefinance.png',
        //   text: this.constants.MENUTRADEFINANCE,
        //   info: null,
        // },
        // {
        //   img: 'engagemenu.png',
        //   text: this.constants.MENUENGAGE,
        //   info: null,
        // },
        // {
        //   img: 'menuaccounts.png',
        //   text: this.constants.MENUACCOUNTSTATEMENTS,
        //   info: null,
        // },
        // {
        //   img: 'opennewacc.png',
        //   text: this.constants.MENUEXPLOREPRODUCTSORRESUME,
        //   info: null,
        // },
        // {
        //   img: 'message.png',
        //   text: this.constants.MENUMESSAGES,
        //   info: null,
        // },
        // {
        //   img: 'notification.png',
        //   text: this.constants.MENUNOTIFICATIONS,
        //   info: null,
        // },
		// {
        //   img: 'service_request_1x.png',
        //   text: this.constants.MENUSERVICEREQUESTS,
        //   info: null,
        // },
        // {
        //   img: 'settings.png',
        //   text: this.constants.MENUSETTINGS,
        //   info: null,
        // },
        // {
        //   img: 'locateus.png',
        //   text: this.constants.MENULOCATE,
        //   info: null,
        // },
        // {
        //   img: 'feedbackmenu.png',
        //   text: this.constants.MENUFEEDBACK,
        //   info: null,
        // },
        // {
        //   img: 'contactus.png',
        //   text: this.constants.MENUCONTACT,
        //   info: null,
        // },
      ];
      if (this.getDeploymentGeography() === "EUROPE") {
        var itemsToInsert = [
        //   {
        //     img: 'payapersonsmall.png',
        //     text: this.constants.MENUSENDMONEY,
        //     info: null,
        //   }, 
        //   {
        //     img: 'transferactivities.png',
        //     text: this.constants.MENUMANAGETRANSACTIONS,
        //     info: null,
        //   },
        //   {
        //     img: 'managetransferrecipients.png',
        //     text: this.constants.MENUMANAGEBENEFICIARIES,
        //     info: null,
        //   }
        ];
        hamburgerMenuItems.splice.apply(hamburgerMenuItems, [2,0].concat(itemsToInsert));
      }
    }
    else{
      var hamburgerMenuItems = [
        {
          img: 'apollowallet.png',
          text: this.constants.MENUACCOUNT,
          info: null,
        },
        {
          img: 'apolloschedule.png',
          text: this.constants.MENUSCHEDULEPAYMENTS,
          info: null,
        },
        {
          img: 'apolloreceive.png',
          text: this.constants.MENURECEIVEPAYMENTS,
          info: null,
        },
        {
          img: 'apollocardwhite.png',
          text: this.constants.MENUCARDS,
          info: null,
        },
        {
          img: 'apollodeals.png',
          text: this.constants.MENUDEALSANDDISCOUNTS,
          info: null,
        },
        {
          img: 'apollonetwork.png',
          text: this.constants.MENUUSSD,
          info: null,
        },
        {
          img: 'apollocheckavatar.png',
          text: this.constants.MENUREFERANDEARN,
          info: null,
        },
        {
          img: 'apollomessages.png',
          text: this.constants.MENUMESSAGES,
          info: null,
        },
        // {
        //   img: 'apollobell.png',
        //   text: this.constants.MENUNOTIFICATIONS,
        //   info: null,
        // },
        {
          img: 'apollolocateus.png',
          text: this.constants.MENULOCATE,
          info: null,
        }, 
        {
          img: 'apollosettings.png',
          text: this.constants.MENUSETTINGS,
          info: null,
        },
        {
          img: 'apollowhiteverified.png',
          text: this.constants.MENUTERMSANDCONDITIONS,
          info: null,
        },
        // {
        //   img: 'accounts.png',
        //   text: this.constants.MENUDASHBOARDOVERVIEW,
        //   info: null,
        // },
        // {
        //   img: 'accounts.png',
        //   text: this.constants.MENUACCOUNTS,
        //   info: null,
        // },
        // {
        //   img: 'accountsweep.png',
        //   text: this.constants.MENUACCOUNTSWEEP,
        //   info: null,
        // },
        // {
        //   img: 'transfer.png',
        //   text: this.constants.MENUMONEYMOVEMENTTRANSFERS,
        //   info: null,
        // },
        // {
        //   img: 'chequemgmt.png',
        //   text: this.constants.MENUCHEQUEMANAGEMENT,
        //   info: null,
        // },
        // {
        //   img: 'transferactivities.png',
        //   text: this.constants.MENUTRANSFERSACTIVITY,
        //   info: null,
        // },
        // {
        //   img: 'transfer.png',
        //   text: this.constants.MENUUNIFIEDTRANSFERSFLOW,
        //   info: null,
        // },
        // {
        //   img: 'managetransferrecipients.png',
        //   text: this.constants.MENUMANAGERECIPIENTS,
        //   info: null,
        // },
        // {
        //   img: 'billpay.png',
        //   text: this.constants.MENUBILLPAY,
        //   info: null,
        // },
        // {
        //   img: 'checkdepositimg.png',
        //   text: this.constants.MENUCHECKDEPOSIT,
        //   info: null,
        // },
        // {
        //   img: 'cardlesscash.png',
        //   text: this.constants.MENUCARDLESS,
        //   info: null,
        // },
        // {
        //   img: 'accounts.png',
        //   text: this.constants.MENUACH,
        //   info: null,
        // },
        // {
        //   img: 'approvalrequesticon.png',
        //   text: this.constants.MENUAPPROVALREQUEST,
        //   info: null,
        // },
        // {
        //   img: 'exchangerate.png',
        //   text: this.constants.MENUFOREIGNEXCHANGE,
        //   info: null,
        // },
        // {
        //   img: 'manage_user.png',
        //   text: this.constants.MENUUSERMANAGEMENT,
        //   info: null,
        // },
        // {
        //   img: 'cardmange.png',
        //   text: this.constants.MENUCARDMANAGEMENT,
        //   info: null,
        // },
        // {
        //   img: 'chatbot.png',
        //   text: this.constants.MENUCONVERSATIONALBANKING,
        //   info: null,
        // },
        // {
        //   img: 'disputetransaction.png',
        //   text: this.constants.MENUDISPUTE,
        //   info: null,
        // },
        // {
        //   img: 'mangeothrbank.png',
        //   text: this.constants.MENUMANAGEOTHERBANKACCOUNTS,
        //   info: null,
        // },
        // {
        //   img: 'mymoney.png',
        //   text: this.constants.MENUPFMMYMONEY,
        //   info: null,
        // },
        //   {
        //   img: 'tradefinance.png',
        //   text: this.constants.MENUTRADEFINANCE,
        //   info: null,
        // },
        // {
        //   img: 'engagemenu.png',
        //   text: this.constants.MENUENGAGE,
        //   info: null,
        // },
        // {
        //   img: 'menuaccounts.png',
        //   text: this.constants.MENUACCOUNTSTATEMENTS,
        //   info: null,
        // },
        // {
        //   img: 'opennewacc.png',
        //   text: this.constants.MENUEXPLOREPRODUCTSORRESUME,
        //   info: null,
        // },
        // {
        //   img: 'message.png',
        //   text: this.constants.MENUMESSAGES,
        //   info: null,
        // },
        // {
        //   img: 'notification.png',
        //   text: this.constants.MENUNOTIFICATIONS,
        //   info: null,
        // },
		// {
        //   img: 'service_request_1x.png',
        //   text: this.constants.MENUSERVICEREQUESTS,
        //   info: null,
        // },
        // {
        //   img: 'settings.png',
        //   text: this.constants.MENUSETTINGS,
        //   info: null,
        // },
        // {
        //   img: 'locateus.png',
        //   text: this.constants.MENULOCATE,
        //   info: null,
        // }, 
        // {
        //   img: 'feedbackmenu.png',
        //   text: this.constants.MENUFEEDBACK,
        //   info: null,
        // },
        // {
        //   img: 'contactus.png',
        //   text: this.constants.MENUCONTACT,
        //   info: null,
        // },
      ];
    }
    if((CommonUtilities.getSCAType() === 1 || CommonUtilities.getSCAType() === 2)){
      var itemsToInsert = [
        {
          img: 'menuicon_securitynotifications.png',
          text: this.constants.MENUSECURITYNOTIFICATIONS,
          info: null
        }
      ];
      if(CommonUtilities.getSCAType() === 2) {
        itemsToInsert.push(
          {
            img: 'menuicon_securitynotifications.png',
            text: this.constants.MENUPASSCODE,
            info: null
          },
          {
            img: 'face.png',
            text: this.constants.MENUBIOMETRICAPPROVAL,
            info: null
          },
        )
      }
      hamburgerMenuItems.splice.apply(hamburgerMenuItems, [10, 0].concat(itemsToInsert));
    }
    this.hamburgerMenuItems = hamburgerMenuItems;
    /**@member {Array} hamburgerMenuItems holds the list of HamburgerMenu Items*/
    this.masterHamburgerData = JSON.parse(
      JSON.stringify(this.hamburgerMenuItems)
    );
    if(!this.isFastTransfersFlowEnabled()){
      var moreMenuItems = [
        // {
        //   img: 'checkdepositimg.png',
        //   text: this.constants.MENUCHECKDEPOSIT,
        //   info: null,
        // },
        // {
        //   img: 'accountsweep.png',
        //   text: this.constants.MENUACCOUNTSWEEP,
        //   info: null,
        // },
		// {
		// 	img: "billpay.png",
		// 	text: this.constants.MENUBILLPAY,
		// 	info: null,
		// },
        // {
        //   img: 'cardlesscash.png',
        //   text: this.constants.MENUCARDLESS,
        //   info: null,
        // },
        // {
        //   img: 'chequemgmt.png',
        //   text: this.constants.MENUCHEQUEMANAGEMENT,
        //   info: null,
        // },
        // {
        //   img: 'transfer.png',
        //   text: this.constants.MENUUNIFIEDTRANSFERSFLOW,
        //   info: null,
        // },
        // {
        //   img: 'cardmange.png',
        //   text: this.constants.MENUCARDMANAGEMENT,
        //   info: null,
        // },
        // {
        //   img: 'chatbot.png',
        //   text: this.constants.MENUCONVERSATIONALBANKING,
        //   info: null,
        // },
        // {
        //   img: 'disputetransaction.png',
        //   text: this.constants.MENUDISPUTE,
        //   info: null,
        // },
        // {
        //   img: 'mangeothrbank.png',
        //   text: this.constants.MENUMANAGEOTHERBANKACCOUNTS,
        //   info: null,
        // },
        // //@TODO add constants and assets
        // {
        //   img: 'accounts.png',
        //   text: this.constants.MENUACH,
        //   info: null,
        // },
        // {
        //   img: 'approvalrequesticon.png',
        //   text: this.constants.MENUAPPROVALREQUEST,
        //   info: null,
        // },
        // {
        //   img: 'exchangerate.png',
        //   text: this.constants.MENUFOREIGNEXCHANGE,
        //   info: null,
        // },
        // {
        //   img: 'manage_user.png',
        //   text: this.constants.MENUUSERMANAGEMENT,
        //   info: null,
        // },
        // {
        //   img: 'mymoney.png',
        //   text: this.constants.MENUPFMMYMONEY,
        //   info: null,
        // },
        //   {
        //   img: 'tradefinance.png',
        //   text: this.constants.MENUTRADEFINANCE,
        //   info: null,
        // },
        // {
        //   img: 'engagemenu.png',
        //   text: this.constants.MENUENGAGE,
        //   info: null,
        // },
        // {
        //   img: 'menuaccounts.png',
        //   text: this.constants.MENUACCOUNTSTATEMENTS,
        //   info: null,
        // },
        // {
        //   img: 'opennewacc.png',
        //   text: this.constants.MENUEXPLOREPRODUCTSORRESUME,
        //   info: null,
        // },
        // {
        //   img: 'message.png',
        //   text: this.constants.MENUMESSAGES,
        //   info: null,
        // },
        // {
        //   img: 'notification.png',
        //   text: this.constants.MENUNOTIFICATIONS,
        //   info: null,
        // },
		// {
        //   img: 'service_request_1x.png',
        //   text: this.constants.MENUSERVICEREQUESTS,
        //   info: null,
        // },
        // {
        //   img: 'settings.png',
        //   text: this.constants.MENUSETTINGS,
        //   info: null,
        // },
        // {
        //   img: 'locateus.png',
        //   text: this.constants.MENULOCATE,
        //   info: null,
        // },
        // {
        //   img: 'feedbackmenu.png',
        //   text: this.constants.MENUFEEDBACK,
        //   info: null,
        // },
        // {
        //   img: 'contactus.png',
        //   text: this.constants.MENUCONTACT,
        //   info: null,
        // },
      ];
      if (this.getDeploymentGeography() === "EUROPE") {
        var itemsToInsert = [
        //   {
        //     img: 'payapersonsmall.png',
        //     text: this.constants.MENUSENDMONEY,
        //     info: null,
        //   }, 
        //   {
        //     img: 'transferactivities.png',
        //     text: this.constants.MENUMANAGETRANSACTIONS,
        //     info: null,
        //   },
        //   {
        //     img: 'managetransferrecipients.png',
        //     text: this.constants.MENUMANAGEBENEFICIARIES,
        //     info: null,
        //   }
        ];
        moreMenuItems.splice.apply(moreMenuItems, [2, 0].concat(itemsToInsert));
      }
    }
    else{
      var moreMenuItems = [
        // {
        //   img: 'checkdepositimg.png',
        //   text: this.constants.MENUCHECKDEPOSIT,
        //   info: null,
        // },
        // {
        //   img: 'accountsweep.png',
        //   text: this.constants.MENUACCOUNTSWEEP,
        //   info: null,
        // },
		// {
		// 	img: "billpay.png",
		// 	text: this.constants.MENUBILLPAY,
		// 	info: null,
		// },
        // {
        //   img: 'transferactivities.png',
        //   text: this.constants.MENUTRANSFERSACTIVITY,
        //   info: null,
        // },
        // {
        //   img: 'chequemgmt.png',
        //   text: this.constants.MENUCHEQUEMANAGEMENT,
        //   info: null,
        // },
        // {
        //   img: 'transfer.png',
        //   text: this.constants.MENUUNIFIEDTRANSFERSFLOW,
        //   info: null,
        // },
        // {
        //   img: 'managetransferrecipients.png',
        //   text: this.constants.MENUMANAGERECIPIENTS,
        //   info: null,
        // },
        // {
        //   img: 'cardlesscash.png',
        //   text: this.constants.MENUCARDLESS,
        //   info: null,
        // },
        // {
        //   img: 'cardmange.png',
        //   text: this.constants.MENUCARDMANAGEMENT,
        //   info: null,
        // },{
        //   img: 'chatbot.png',
        //   text: this.constants.MENUCONVERSATIONALBANKING,
        //   info: null,
        // },
        // {
        //   img: 'disputetransaction.png',
        //   text: this.constants.MENUDISPUTE,
        //   info: null,
        // },
        // {
        //   img: 'mangeothrbank.png',
        //   text: this.constants.MENUMANAGEOTHERBANKACCOUNTS,
        //   info: null,
        // },
        // //@TODO add constants and assets
        // {
        //   img: 'accounts.png',
        //   text: this.constants.MENUACH,
        //   info: null,
        // },
        // {
        //   img: 'approvalrequesticon.png',
        //   text: this.constants.MENUAPPROVALREQUEST,
        //   info: null,
        // },
        // {
        //   img: 'exchangerate.png',
        //   text: this.constants.MENUFOREIGNEXCHANGE,
        //   info: null,
        // },
        // {
        //   img: 'manage_user.png',
        //   text: this.constants.MENUUSERMANAGEMENT,
        //   info: null,
        // },
        // {
        //   img: 'mymoney.png',
        //   text: this.constants.MENUPFMMYMONEY,
        //   info: null,
        // },
        //   {
        //   img: 'tradefinance.png',
        //   text: this.constants.MENUTRADEFINANCE,
        //   info: null,
        // },
        // {
        //   img: 'engagemenu.png',
        //   text: this.constants.MENUENGAGE,
        //   info: null,
        // },
        // {
        //   img: 'menuaccounts.png',
        //   text: this.constants.MENUACCOUNTSTATEMENTS,
        //   info: null,
        // },
        // {
        //   img: 'opennewacc.png',
        //   text: this.constants.MENUEXPLOREPRODUCTSORRESUME,
        //   info: null,
        // },
        // {
        //   img: 'message.png',
        //   text: this.constants.MENUMESSAGES,
        //   info: null,
        // },
        // {
        //   img: 'notification.png',
        //   text: this.constants.MENUNOTIFICATIONS,
        //   info: null,
        // },
		// {
        //   img: 'service_request_1x.png',
        //   text: this.constants.MENUSERVICEREQUESTS,
        //   info: null,
        // },
        // {
        //   img: 'settings.png',
        //   text: this.constants.MENUSETTINGS,
        //   info: null,
        // },
        // {
        //   img: 'locateus.png',
        //   text: this.constants.MENULOCATE,
        //   info: null,
        // }, 
        // {
        //   img: 'feedbackmenu.png',
        //   text: this.constants.MENUFEEDBACK,
        //   info: null,
        // },
        // {
        //   img: 'contactus.png',
        //   text: this.constants.MENUCONTACT,
        //   info: null,
        // },
      ];
    }
    if((CommonUtilities.getSCAType() === 1 || CommonUtilities.getSCAType() === 2)){
      var itemsToInsert = [
        {
          img: 'menuicon_securitynotifications.png',
          text: this.constants.MENUSECURITYNOTIFICATIONS,
          info: null
        }
      ];
      if(CommonUtilities.getSCAType() === 2) {
        itemsToInsert.push(
          {
            img: 'menuicon_securitynotifications.png',
            text: this.constants.MENUPASSCODE,
            info: null
          },
          {
            img: 'face.png',
            text: this.constants.MENUBIOMETRICAPPROVAL,
            info: null
          },
        )
      }
      moreMenuItems.splice.apply(moreMenuItems, [10, 0].concat(itemsToInsert));
    }
    this.moreMenuItems = moreMenuItems;
    /**@member {Array} moreMenuItems holds the list of more MenuItems*/
    this.mastermoreMenuItems = JSON.parse(JSON.stringify(this.moreMenuItems));
    /**@member {Array} iPhoneMenuItems holds the list of iPhone MenuItems*/
    if(!this.isFastTransfersFlowEnabled()){
      var iPhoneMenuItems = [
        // {
        //   img: 'accounts.png',
        //   text: this.constants.MENUDASHBOARDOVERVIEW,
        //   info: null,
        // },
        // {
        //   img: 'accounts.png',
        //   text: this.constants.MENUACCOUNTS,
        //   info: null,
        // },
        // {
        //   img: 'transfer.png',
        //   text: this.constants.MENUTRANSFERS,
        //   info: null,
        // },
        // {
        //   img: 'qr_inactive.png',
        //   text: this.constants.MENUQRPAYMENT,
        //   info: null,
        // },
        // {
        //   img: 'billpay.png',
        //   text: this.constants.MENUBILLPAY,
        //   info: null,
        // },
        // {
        //   img: 'tradefinance.png',
        //   text: this.constants.MENUTRADEFINANCE,
        //   info: null,
        // }
      ];
    }
    else{
      var iPhoneMenuItems = [
        {
          img: 'apollowallet.png',
          text: this.constants.MENUACCOUNT,
          info: null,
        },
        {
          img: 'apolloschedule.png',
          text: this.constants.MENUSCHEDULEPAYMENTS,
          info: null,
        },
        {
          img: 'apolloreceive.png',
          text: this.constants.MENURECEIVEPAYMENTS,
          info: null,
        },
        {
          img: 'apollocardwhite.png',
          text: this.constants.MENUCARDS,
          info: null,
        },
        {
          img: 'apollodeals.png',
          text: this.constants.MENUDEALSANDDISCOUNTS,
          info: null,
        },
        {
          img: 'apollonetwork.png',
          text: this.constants.MENUUSSD,
          info: null,
        },
        {
          img: 'apollocheckavatar.png',
          text: this.constants.MENUREFERANDEARN,
          info: null,
        },
        {
          img: 'apollomessages.png',
          text: this.constants.MENUMESSAGES,
          info: null,
        },
        // {
        //   img: 'apollobell.png',
        //   text: this.constants.MENUNOTIFICATIONS,
        //   info: null,
        // },
        {
          img: 'apollolocateus.png',
          text: this.constants.MENULOCATE,
          info: null,
        }, 
        {
          img: 'apollosettings.png',
          text: this.constants.MENUSETTINGS,
          info: null,
        },
        {
          img: 'apollowhiteverified.png',
          text: this.constants.MENUTERMSANDCONDITIONS,
          info: null,
        },
        // {
        //   img: 'accounts.png',
        //   text: this.constants.MENUDASHBOARDOVERVIEW,
        //   info: null,
        // },
        // {
        //   img: 'accounts.png',
        //   text: this.constants.MENUACCOUNTS,
        //   info: null,
        // },
        // {
        //   img: 'transfer.png',
        //   text: this.constants.MENUMONEYMOVEMENTTRANSFERS,
        //   info: null,
        // },
        // {
        //   img: 'qr_inactive.png',
        //   text: this.constants.MENUQRPAYMENT,
        //   info: null,
        // },
        // {
        //   img: 'billpay.png',
        //   text: this.constants.MENUBILLPAY,
        //   info: null,
        // },
        // {
        //   img: 'tradefinance.png',
        //   text: this.constants.MENUTRADEFINANCE,
        //   info: null,
        // }
      ];
    }
    this.iPhoneMenuItems = iPhoneMenuItems;
  };
  /**
   * Method to check if business banking is enabled.
   * @returns {boolean} true/false
   */
  ConfigurationManager.prototype.isBusinessBankingEnabled = function() {
    return true;
    //TODO AOLB-611
    //return this.configurations.getItem("ISBUSINESSBANKINGENABLED") === "true";
  };
  /**
   * Method to set application property.
   */
  ConfigurationManager.prototype.setAppProperties = function(value) {
    this.isAppPropertiesLoaded = value;
  };
  // Date format
  ConfigurationManager.prototype.getCalendarDateFormat = function() {
    var dummy;
    var locale = this.getLocale();
    locale = locale.toLowerCase();

    // [Trixon] Configured single date format for all languages supported

    // locale = locale.replace('_', '-');
    // if (locale == 'en-us' || locale == 'en' || locale == 'ar-ae') {
    //   dummy = 'MM/DD/YYYY';
    // } else if (locale == 'en-gb' || locale == 'fr-fr' || locale == 'es-es') {
      dummy = 'DD/MM/YYYY';
    // } else if (locale == 'de-de') {
    //   dummy = 'DD.MM.YYYY';
    // } else if (locale == 'sv-se') {
    //   dummy = 'YYYY-DD-MM';
    // }
    // [Trixon] Ended
    return dummy;
  };
  ConfigurationManager.prototype.setBrowserRefreshProperty = function(value) {
    this.isAppRefreshed = value;
  };
  /**
   * Method to get Onboarding Applicaiton ID.
   */
  ConfigurationManager.prototype.getOnboardingAppID = function(value) {
    return this.onBoardingAppName;
  };
  /**
   * Method to set isAppRefreshed flag to true if app is refreshed.
   */
  ConfigurationManager.prototype.setBrowserRefreshProperty = function(value) {
    this.isAppRefreshed = value;
  };
  ConfigurationManager.prototype.isFastTransfersFlowEnabled = function () {
    var scope = this;
    if(scope.getDeploymentGeography() && scope.getDeploymentGeography()=="EUROPE")
      return false;
    return this.fastTransfersFlowEnabled === "true";
  };

  ConfigurationManager.prototype.isEuroFlow = function () {
    var scope = this;
    if(scope.getDeploymentGeography() && scope.getDeploymentGeography()=="EUROPE")
      return true;
    return false;
  };

  ConfigurationManager.prototype.isFastTransfersFlowPresent = function () {
    var scope = this;
    return this.fastTransfersFlowEnabled === "true";
  };

  //Business banking config
  ConfigurationManager.prototype.isApproveTransactionEnabled = function() {
    return true;//(this.isSMEUser === "true" || this.isCombinedUser === "true" );
    /*(this.isInternalFundTransfersApproveTransactionsEnabled === "true" ||
              this.isFundsTransferApproveTransactionsEnabled() ||
              this.isDomesticWireTransfersApproveTransactionsEnabled === "true" ||
              this.isInternationalWireTransfersApproveTransactionsEnabled === "true" ||
              this.isBillPaymentApproveTransactionsEnabled === "true" ||
              this.isP2PApproveTransactionsEnabled === "true" );*/
  };

  ConfigurationManager.prototype.isApproveACHEnabled = function() {
    return true; //(this.isSMEUser === "true" || this.isCombinedUser === "true");//(this.isACHPaymentApproveTransactionsEnabled === "true" || this.isACHCollectionApproveTransactionsEnabled === "true" );
  };

  ConfigurationManager.prototype.isViewACHEnabled = function() {
    return true; //(this.isSMEUser === "true" || this.isCombinedUser === "true");//(this.isViewACHPaymentsEnabled() || this.isViewACHCollectionEnabled() );
  };

  ConfigurationManager.prototype.isACHEnabled = function() {
    return true; //(this.isSMEUser === "true" || this.isCombinedUser === "true");//(this.isViewACHEnabled() || this.isApproveACHEnabled() );
  };

  ConfigurationManager.prototype.isViewACHPaymentsEnabled = function() {
    return true; //(this.isSMEUser === "true" || this.isCombinedUser === "true");//(this.isACHPaymentViewTransactionsEnabled === "true");
  };

  ConfigurationManager.prototype.isViewACHCollectionEnabled = function() {
    return true; //(this.isSMEUser === "true" || this.isCombinedUser === "true");//(this.isACHCollectionViewTransactionsEnabled === "true");
  };

  ConfigurationManager.prototype.isRequestTransactionEnabled = function() {
    return true;//(this.isSMEUser === "true" || this.isCombinedUser === "true");
    /*(this.isInternalFundTransfersCreateTransactionEnabled === "true" ||
              this.isFundsTransferCreateTransactionEnabled() ||
              this.isDomesticWireTransfersCreateTransactionEnabled === "true" ||
              this.isInternationalWireTransfersCreateTransactionEnabled === "true" ||
              this.isBillPaymentCreateTransactionEnabled === "true" ||
              this.isP2PCreateTransactionEnabled === "true" );*/
  };

  ConfigurationManager.prototype.isRequestACHEnabled = function() {
    return true;//(this.isSMEUser === "true" || this.isCombinedUser === "true");
    /*(this.isACHPaymentCreateTransactionEnabled === "true" ||
              this.isACHCollectionCreateTransactionEnabled === "true" );*/
  };

  ConfigurationManager.prototype.isFundsTransferCreateTransactionEnabled = function() {
    return true;//(this.isSMEUser === "true" || this.isCombinedUser === "true");
    /*(this.isInternalFundTransfersCreateTransactionEnabled === "true" ||
            this.isTransferBetweenCustomersAccountsCreateTransactionEnabled === "true" ||
            this.isInterbankAccountToAccountFundTransferCreateTransactionEnabled === "true" ||
            this.isInternationAccountToAccountFundTransferCreateTransactionEnabled === "true" ||
            this.isWireTransfersCreateTransactionEnabled());*/
  };

  ConfigurationManager.prototype.isFundsTransferApproveTransactionsEnabled = function() {
    return true;//(this.isSMEUser === "true" || this.isCombinedUser === "true");
    /*(this.isInternalFundTransfersApproveTransactionsEnabled === "true" ||
            this.isTransferBetweenCustomersAccountsApproveTransactionsEnabled === "true" ||
            this.isInterbankAccountToAccountFundTransferApproveTransactionsEnabled === "true" ||
            this.isInternationAccountToAccountFundTransferApproveTransactionsEnabled === "true" ||
            this.isWireTransfersApproveTransactionsEnabled());*/
  };

  ConfigurationManager.prototype.isFundsTransferViewTransactionsEnabled = function() {
    return true;//(this.isSMEUser === "true" || this.isCombinedUser === "true");
    /*(this.isIntraBankFundTransferViewTransactionsEnabled === "true" ||
            this.isTransferBetweenCustomersAccountsViewTransactionsEnabled === "true" ||
            this.isInterbankAccountToAccountFundTransferViewTransactionsEnabled === "true" ||
            this.isInternationAccountToAccountFundTransferViewTransactionsEnabled === "true" ||
            this.isWireTransfersViewTransactionsEnabled());*/
  };

  ConfigurationManager.prototype.isFundsTransferManagePayeesEnabled = function() {
    return true;//(this.isSMEUser === "true" || this.isCombinedUser === "true");
    /*(this.isInternalFundTransfersManagePayeesEnabled === "true" ||
            this.isTransferBetweenCustomersAccountsManagePayeesEnabled === "true" ||
            this.isInterbankAccountToAccountFundTransferManagePayeesEnabled === "true" ||
            this.isInternationAccountToAccountFundTransferManagePayeesEnabled === "true" ||
            this.isWireTransfersManagePayeesEnabled());*/
  };

  ConfigurationManager.prototype.isFundsTransferSelfApprovalEnabled = function() {
    return true;//(this.isSMEUser === "true" || this.isCombinedUser === "true");
    /*(this.isInternalFundTransfersSelfApprovalEnabled === "true" ||
            this.isTransferBetweenCustomersAccountsSelfApprovalEnabled === "true" ||
            this.isInterbankAccountToAccountFundTransferSelfApprovalEnabled === "true" ||
            this.isInternationAccountToAccountFundTransferSelfApprovalEnabled === "true" ||
            this.isWireTransfersSelfApprovals());*/
  };

  ConfigurationManager.prototype.isWireTransfersCreateTransactionEnabled = function() {
    return true;//(this.isSMEUser === "true" || this.isCombinedUser === "true");//(this.isDomesticWireTransfersCreateTransactionEnabled === "true" ||
    //this.isInternationalWireTransfersCreateTransactionEnabled === "true");
  };

  ConfigurationManager.prototype.isWireTransfersApproveTransactionsEnabled = function() {
    return true;//(this.isSMEUser === "true" || this.isCombinedUser === "true");\n//(this.isDomesticWireTransfersApproveTransactionsEnabled === "true" ||
    //this.isInternationalWireTransfersApproveTransactionsEnabled === "true");
  };

  ConfigurationManager.prototype.isWireTransfersViewTransactionsEnabled = function() {
    return true;//(this.isSMEUser === "true" || this.isCombinedUser === "true");\n//(this.isDomesticWireTransfersViewTransactionsEnabled === "true" ||
    //this.isInternationalWireTransfersViewTransactionsEnabled === "true");
  };

  ConfigurationManager.prototype.isWireTransfersManagePayeesEnabled = function() {
    return true;//(this.isSMEUser === "true" || this.isCombinedUser === "true");\n//(this.isDomesticWireTransfersManagePayeesEnabled === "true" ||
    //this.isInternationalWireTransfersManagePayeesEnabled === "true");
  };

  ConfigurationManager.prototype.isWireTransfersSelfApprovals = function() {
    return true;//(this.isSMEUser === "true" || this.isCombinedUser === "true");\n//(this.isDomesticWireTransfersSelfApprovalEnabled === "true" ||
    //this.isInternationalWireTransfersSelfApprovalEnabled === "true");
  };

  /**
        This method retunrs the list of permissions required for ApprovalReq module
    **/
  ConfigurationManager.prototype.getApprovalReqModulePermissionsList = function(){
    var features = this.getApprovalsFeaturePermissionsList();
    return features.concat(this.getRequestsFeaturePermissionsList());
  };

  /**
        This method returns the list of permissions required for Approvals module
    **/
  ConfigurationManager.prototype.getApprovalsFeaturePermissionsList = function(){
    var features = this.getACHTransactionApprovalsFeaturePermissionsList();
    features = features.concat(this.getACHFileApprovalsFeaturePermissionsList());
    features = features.concat(this.getGeneralTransactionApprovalFeaturePermissionsList());
    return features.concat(this.getBulkPaymentsApprovalsFeaturePermissionsList());
  };

  /**
        This method returns the list of permissions required for Approvals  for ach transactions
    **/
  ConfigurationManager.prototype.getACHTransactionApprovalsFeaturePermissionsList = function(){
    return [
      'ACH_COLLECTION_APPROVE', 'ACH_COLLECTION_SELF_APPROVAL', 'ACH_PAYMENT_APPROVE','ACH_PAYMENT_SELF_APPROVAL'
    ];
  };

  /**
        This method returns the list of permissions required for Approvals  for ach files
    **/
  ConfigurationManager.prototype.getACHFileApprovalsFeaturePermissionsList = function(){
    return [
      'ACH_FILE_APPROVE', 'ACH_FILE_SELF_APPROVAL'
    ];
  };

  /**
        This method returns the list of permissions required for Approvals module for general transactions
    **/
  ConfigurationManager.prototype.getGeneralTransactionApprovalFeaturePermissionsList = function(){
    return [
      'BILL_PAY_APPROVE', 'BILL_PAY_SELF_APPROVAL',
      'DOMESTIC_WIRE_TRANSFER_APPROVE', 'DOMESTIC_WIRE_TRANSFER_SELF_APPROVAL',
      'INTER_BANK_ACCOUNT_FUND_TRANSFER_APPROVE', 'INTER_BANK_ACCOUNT_FUND_TRANSFER_SELF_APPROVAL',
      'INTERNATIONAL_ACCOUNT_FUND_TRANSFER_APPROVE','INTERNATIONAL_ACCOUNT_FUND_TRANSFER_SELF_APPROVAL',
      'INTERNATIONAL_WIRE_TRANSFER_APPROVE', 'INTERNATIONAL_WIRE_TRANSFER_SELF_APPROVAL',
      'INTRA_BANK_FUND_TRANSFER_APPROVE', 'INTRA_BANK_FUND_TRANSFER_SELF_APPROVAL',
      'P2P_APPROVE', 'P2P_SELF_APPROVAL',
      'TRANSFER_BETWEEN_OWN_ACCOUNT_APPROVE', 'TRANSFER_BETWEEN_OWN_ACCOUNT_SELF_APPROVAL'
    ];
  };

  /**
        This method returns the list of permissions required for Approvals  for Bulk Payments
    **/
  ConfigurationManager.prototype.getBulkPaymentsApprovalsFeaturePermissionsList = function(){
    return [
      'BULK_PAYMENT_REQUEST_APPROVE'
    ];
  };

  ConfigurationManager.prototype.getBulkPaymentRequestPaymentOrderAddPermissionList = function(){
    return [
      'BULK_PAYMENT_REQUEST_ADD_PO'
    ];
  };

  ConfigurationManager.prototype.getBulkPaymentRequestPaymentOrderEditPermissionList = function(){
    return [
      'BULK_PAYMENT_REQUEST_EDIT_PO'
    ];
  };

  ConfigurationManager.prototype.getBulkPaymentRequestPaymentOrderRemovePermissionList = function(){
    return [
      'BULK_PAYMENT_REQUEST_REMOVE_PO'
    ];
  };

  /**
        This method returns the list of permissions required for Requests module
    **/
  ConfigurationManager.prototype.getRequestsFeaturePermissionsList = function(){
    var reqFeatures = this.getCreateACHTransactionPermissionsList();
    reqFeatures = reqFeatures.concat(this.getUploadACHFilePermissionsList());
    reqFeatures = reqFeatures.concat(this.getCreateGeneralTransactionPermissionsList());
    return reqFeatures.concat(this.getBulkPaymentRequestPermissionsList());
  }

  /**
        This method returns the list of permissions required for approval and Requests module mobile
    **/
  ConfigurationManager.prototype.getApprovalsAndRequestsFeaturePermissionsList = function(){
    var approvalFeatureList = this.getApprovalsFeaturePermissionsList();
    var requestFeatureList = this.getRequestsFeaturePermissionsList();
    return approvalFeatureList.concat(requestFeatureList);
  }

  /**
        This method returns the list of permissions required to create ach transaction
    **/
  ConfigurationManager.prototype.getCreateACHTransactionPermissionsList = function(){
    return [
      'ACH_COLLECTION_CREATE',
      'ACH_PAYMENT_CREATE'
    ];
  };

  ConfigurationManager.prototype.getEditACHTemplatePermissionsList = function(){
    return [
      'ACH_COLLECTION_EDIT_TEMPLATE',
      'ACH_PAYMENT_EDIT_TEMPLATE'
    ];
  };

  ConfigurationManager.prototype.getDeleteACHTemplatePermissionsList = function(){
    return [
      'ACH_COLLECTION_DELETE_TEMPLATE',
      'ACH_PAYMENT_DELETE_TEMPLATE'
    ];
  };

  /**
        This method returns the list of permissions required to upload ach file
    **/
  ConfigurationManager.prototype.getUploadACHFilePermissionsList = function(){
    return [
      'ACH_FILE_UPLOAD'
    ];
  };

  /**
        This method returns the list of permissions required to create ach template
    **/
  ConfigurationManager.prototype.getCreateACHTemplatePermissionsList = function(){
    return [
      'ACH_COLLECTION_CREATE_TEMPLATE',
      'ACH_PAYMENT_CREATE_TEMPLATE'
    ];
  };

  /**
        This method returns the list of permissions required to create general transactions
    **/
  ConfigurationManager.prototype.getCreateGeneralTransactionPermissionsList = function(){
    return [
      'BILL_PAY_CREATE',
      'DOMESTIC_WIRE_TRANSFER_CREATE',
      'INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE',
      'INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE',
      'INTERNATIONAL_WIRE_TRANSFER_CREATE',
      'INTRA_BANK_FUND_TRANSFER_CREATE',
      'P2P_CREATE',
      'TRANSFER_BETWEEN_OWN_ACCOUNT_CREATE'
    ];
  };

  /**
        This method returns the list of permissions required to create Bulk payment request
    **/
  ConfigurationManager.prototype.getBulkPaymentRequestPermissionsList = function(){
    return [
      'BULK_PAYMENT_SINGLE_SUBMIT', 'BULK_PAYMENT_MULTIPLE_SUBMIT'
    ];
  };

  /**
        This method returns the list of permissions required to view ACH Transactions
    **/
  ConfigurationManager.prototype.getViewACHTransactionPermissionsList = function(){
    return [
      'ACH_COLLECTION_VIEW', 
      'ACH_PAYMENT_VIEW'
    ];
  };

  /**
        This method returns the list of permissions required to view ACH Files
    **/
  ConfigurationManager.prototype.getViewACHFilePermissionsList = function(){
    return [
      'ACH_FILE_VIEW'
    ];
  };

  /**
        This method returns the list of permissions required to view ACH Templates
    **/
  ConfigurationManager.prototype.getViewACHTemplatePermissionsList = function(){
    return [
      'ACH_COLLECTION_VIEW_TEMPLATE', 
      'ACH_PAYMENT_VIEW_TEMPLATE'
    ];
  };

  /**
        This method returns the list of permissions required to show ACH Templates Tab
    **/
  ConfigurationManager.prototype.getACHTemplateTabPermissionsList = function(){
    var features = this.getViewACHTemplatePermissionsList();
    return features.concat(this.getCreateACHTemplatePermissionsList());
  };

  /**
        This method returns the list of permissions required to view ACH Transactions Tab
    **/
  ConfigurationManager.prototype.getACHTransactionsTabPermissionsList = function(){
    var features = this.getViewACHTransactionPermissionsList();
    return features.concat(this.getCreateACHTransactionPermissionsList());
  };

  /**
        This method returns the list of permissions required to view ACH Files Tab
    **/
  ConfigurationManager.prototype.getACHFilesTabPermissionsList = function(){
    var features = this.getViewACHFilePermissionsList();
    return features.concat(this.getUploadACHFilePermissionsList());
  };

  /**
        This method returns the list of permissions required to view ACH Approvals Tab
    **/
  ConfigurationManager.prototype.getACHApprovalsTabPermissionsList = function(){
    var features = this.getACHTransactionApprovalsFeaturePermissionsList();
    return features.concat(this.getACHFileApprovalsFeaturePermissionsList());
  };

  /**
        This method returns the list of permissions required to view General Transactions
    **/
  ConfigurationManager.prototype.getViewGeneralTransactionPermissionsList = function(){
    return [
      'BILL_PAY_VIEW', 'BILL_PAY_VIEW_PAYMENTS',
      'DOMESTIC_WIRE_TRANSFER_VIEW',
      'INTERNATIONAL_ACCOUNT_FUND_TRANSFER_VIEW',
      'INTERNATIONAL_WIRE_TRANSFER_VIEW',
      'INTER_BANK_ACCOUNT_FUND_TRANSFER_VIEW',
      'INTRA_BANK_FUND_TRANSFER_VIEW',
      'P2P_VIEW',
      'TRANSFER_BETWEEN_OWN_ACCOUNT_VIEW'
    ];
  };

  /**
        This method returns the list of permissions required to view Portfolio List 
    **/
  ConfigurationManager.prototype.getPortfolioPermissionsList = function(){
    return [
      'WEALTH_PORTFOLIO_DETAILS_SUMMARY_VIEW', 'WEALTH_PORTFOLIO_DETAILS_ASSET_ALLOCATION_VIEW',
      'WEALTH_PORTFOLIO_DETAILS_CASH_BALANCE_VIEW',
      'WEALTH_PRODUCT_DETAILS_INSTRUMENT_VIEW',
      'WEALTH_PORTFOLIO_DETAILS_ACCOUNT_INFO_VIEW'
    ];
  };

  /**
  This method returns the list of permissions required to transfer cash 
  **/
  ConfigurationManager.prototype.getTransferCashPermission = function(){
    return [
      'WEALTH_CASH_MGMT_TRANSFER_CASH_CREATE'
    ];
  };

  /**
  This method returns the list of permissions required to convert currency 
  **/
  ConfigurationManager.prototype.getConvertCurrencyPermission = function(){
    return [
      'WEALTH_CASH_MGMT_CURRENCY_COVERSION_CREATE'
    ];
  };

  /**
  This method returns the list of permissions required to cash balance view 
  **/
  ConfigurationManager.prototype.getCashBalanceViewPermission = function(){
    return [
      'WEALTH_CASH_MGMT_CARD_BALANCE_VIEW'
    ];
  };

  /**
  This method returns the list of permissions required to holdings detail view 
  **/
  ConfigurationManager.prototype.getHoldingsdetailsPermissions= function(){
    return [
      'WEALTH_PORTFOLIO_DETAILS_HOLDINGS_VIEW'
    ];
  };

  /**
  This method returns the list of permissions required to open order view
  **/
  ConfigurationManager.prototype.getOpenOrderViewPermissions= function(){
    return [
      'WEALTH_ORDER_MGMT_OPEN_ORDER_VIEW'
    ];
  };

  /**
  This method returns the list of permissions required to history order view
  **/
  ConfigurationManager.prototype.getHistoryOrderViewPermissions= function(){
    return [
      'WEALTH_ORDER_MGMT_ORDER_HISTORY_VIEW'
    ];
  };

  /**
  This method returns the list of permissions required to transaction detail view
  **/
  ConfigurationManager.prototype.getTransactionDetailViewPermissions= function(){
    return [
      'WEALTH_PORTFOLIO_DETAILS_TRANSACTIONS_VIEW'
    ];
  };

  /**
  This method returns the list of permissions required to portfolio detail view
  **/
  ConfigurationManager.prototype.getPortfolioDetailViewPermissions= function(){
    return [
      'WEALTH_PORTFOLIO_DETAILS_SUMMARY_VIEW'
    ];
  };

  /**
  This method returns the list of permissions required to portfolio asset allocation view
  **/
  ConfigurationManager.prototype.getPortfolioAssetAllocationViewPermissions= function(){
    return [
      'WEALTH_PORTFOLIO_DETAILS_ASSET_ALLOCATION_VIEW'
    ];
  };

  /**
  This method returns the list of permissions required to portfolio cash balance view
  **/
  ConfigurationManager.prototype.getPortfolioCashBalanceViewPermissions= function(){
    return [
      'WEALTH_PORTFOLIO_DETAILS_CASH_BALANCE_VIEW'
    ];
  };

  /**
  This method returns the list of permissions required to portfolio product search view
  **/
  ConfigurationManager.prototype.getPortfolioProductSearchViewPermissions= function(){
    return [
      'WEALTH_PRODUCT_DETAILS_INSTRUMENT_VIEW'
    ];
  };

  /**
  This method returns the list of permissions required to portfolio account info view
  **/
  ConfigurationManager.prototype.getPortfolioAccountInfoViewPermissions= function(){
    return [
      'WEALTH_PORTFOLIO_DETAILS_ACCOUNT_INFO_VIEW'
    ];
  };

  /**
  This method returns the list of permissions required to account activitysummary view
  **/
  ConfigurationManager.prototype.getAccountSummaryViewPermissions= function(){
    return [
      'WEALTH_PORTFOLIO_DETAILS_ACCOUNT_SUMMARY_VIEW'
    ];
  };

  /**
  This method returns the list of permissions required to report permissions
  **/
  ConfigurationManager.prototype.getWealthReportPermissions= function(){
    return [
      'WEALTH_REPORT_MANAGEMENT_REPORT_CREATE',
      'WEALTH_REPORT_MANAGEMENT_REPORT_DOWNLOAD'
    ];
  };

  /**
        This method returns the list of permissions required to view recent activity
    **/
  ConfigurationManager.prototype.getRecentActivityPermissionsList = function(){
    return [
      'WEALTH_INVESTMENT_DETAILS_RECENT_ACTIVITY_VIEW'
    ];
  }; 
  /**
        This method returns the list of permissions required to view market index
    **/
  ConfigurationManager.prototype.getMarketIndexPermissionsList = function(){
    return [
      'WEALTH_MARKET_AND_NEWS_MARKET_VIEW'
    ];
  }; 
  /**
        This method returns the list of permissions required to view top news
    **/
  ConfigurationManager.prototype.getTopNewsPermissionsList = function(){
    return [
      'WEALTH_MARKET_AND_NEWS_TOP_NEWS_VIEW'
    ];
  };
   /**
        This method returns the list of permissions required to view detailed news
    **/
  ConfigurationManager.prototype.getNewsDetailsPermissionsList = function(){
    return [
      'WEALTH_MARKET_AND_NEWS_TOP_NEWS_DETAILS_VIEW'
    ];
  }; 
  /**
        This method returns the list of permissions required to view total assets
    **/
  ConfigurationManager.prototype.getTotalAssetsPermissionsList = function(){
    return [
      'WEALTH_INVESTMENT_DETAILS_TOTAL_ASSETS_VIEW'
    ];
  };  
  /**
        This method returns the list of permissions required to view investment summary
    **/
  ConfigurationManager.prototype.getInvestmentSummaryPermissionsList = function(){
    return [
      'WEALTH_INVESTMENT_DETAILS_INVESTMENT_SUMMARY_VIEW'
    ];
  };   

  /**
  This method returns the list of features required to order blotter
  **/
  ConfigurationManager.prototype.getOrderBlotterFeature= function(){
    return [
      'WEALTH_ORDER_MANAGEMENT'
    ];
  };


  /**
  This method returns the list of features required to transactions
  **/
  ConfigurationManager.prototype.getWealthPortfolioFeature= function(){
    return [
      'WEALTH_PORTFOLIO_DETAILS'
    ];
  };

  /**
  This method returns the list of features required to report management
  **/
  ConfigurationManager.prototype.getWealthReportFeature= function(){
    return [
      'WEALTH_REPORT_MANAGEMENT'
    ];
  };
  /**
           This method returns the list of permissions required to access Sell Order from Watchlist Instruments 
       **/
  ConfigurationManager.prototype.sellOrderPermissions = function() {
    return ['WEALTH_ORDER_MGMT_SELL_ORDER_CREATE'];
  };
  /**
           This method returns the list of permissions required to access Buy Order from Watchlist Instruments 
       **/
  ConfigurationManager.prototype.buyOrderPermissions = function() {
    return ['WEALTH_ORDER_MGMT_BUY_ORDER_CREATE'];
  };
  /**
           This method returns the list of permissions required to view Watchlist Instruments 
       **/
  ConfigurationManager.prototype.watchlistViewInstrumentPermissions = function() {
    return ['WEALTH_WATCHLIST_INSTRUMENT_VIEW'];
  };
  /**
           This method returns the list of permissions required to add to Watchlist an Instrument
       **/
  ConfigurationManager.prototype.addToWatchlistPermissions = function() {
    return ['WEALTH_WATCHLIST_INSTRUMENT_CREATE'];
  };
  /**
           This method returns the list of permissions required to edit an order
       **/
  ConfigurationManager.prototype.mgmtOrderEditPermissions = function() {
    return ['WEALTH_ORDER_MGMT_ORDER_EDIT'];
  };
  /**
           This method returns the list of permissions required to cancel an order
       **/
  ConfigurationManager.prototype.mgmtOrderCancelPermissions = function() {
    return ['WEALTH_ORDER_MGMT_ORDER_CANCEL'];
  };
  /**
           This method returns the list of permissions required to verify an order
       **/
  ConfigurationManager.prototype.mgmtOrderVerifyPermissions = function() {
    return ['WEALTH_ORDER_MGMT_ORDER_VERIFICATION_VIEW'];
  };
  /**
           This method returns the list of permissions required to view acknowledgement
       **/
  ConfigurationManager.prototype.mgmtOrderViewAckPermissions = function() {
    return ['WEALTH_ORDER_MGMT_ORDER_ACKNOWLEDGEMENT_VIEW'];
  };
   /**
           This method returns the list of permissions required to view order link
       **/
  ConfigurationManager.prototype.mgmtOrderViewOrderLinkPermissions = function() {
    return ['WEALTH_ORDER_MGMT_ORDER_LINK_VIEW'];
  }; 
  /**
  This method returns the list of permissions required to performance
  **/
  ConfigurationManager.prototype.getPortfolioPerformancePermissions= function(){
    return [
      'WEALTH_PORTFOLIO_DETAILS_PERFORMANCE_VIEW'
    ];
  };
  
  /**
  This method returns the list of permissions required to instrument details
  **/
  ConfigurationManager.prototype.getInstrumentDetailsPermissions= function(){
    return [
      'WEALTH_PRODUCT_DETAILS_INSTRUMENT_VIEW'
    ];
  };
  
   /**
  This method returns the list of permissions required to instrument current possition
  **/
  ConfigurationManager.prototype.getInstrumentCurrentPositionPermissions= function(){
    return [
      'WEALTH_PRODUCT_DETAILS_CURRENT_POSITION_VIEW'
    ];
  };
  
    /**
  This method returns the list of permissions required to instrument pricing data
  **/
  ConfigurationManager.prototype.getInstrumentPricingDataPermissions= function(){
    return [
      'WEALTH_PRODUCT_DETAILS_PRICING_DATA_VIEW'
    ];
  };
  
     /**
  This method returns the list of permissions required to instrument news
  **/
  ConfigurationManager.prototype.getInstrumentNewsPermissions= function(){
    return [
      'WEALTH_NEWS_AND_DOCUMENTS_STOCK_NEWS_VIEW'
    ];
  };
  
      /**
  This method returns the list of permissions required to instrument documents
  **/
  ConfigurationManager.prototype.getInstrumentDocumentsPermissions= function(){
    return [
      'WEALTH_NEWS_AND_DOCUMENTS_DOCUMENTS_VIEW'
    ];
  };
  
  /**
        This method returns the list of permissions required to view General Transactions
    **/
  ConfigurationManager.prototype.getViewTransactionPermissionsList = function(){
    var features = this.getViewGeneralTransactionPermissionsList();
    features = features.concat(this.getViewACHFilePermissionsList());
    return features.concat(this.getViewACHTransactionPermissionsList());
  };
  ConfigurationManager.prototype.setMapKey = function(key){
    if(!kony.sdk.isNullOrUndefined(key)){
      this.mapKey = key;
    }
  };
  ConfigurationManager.prototype.setOnBoardingAppDirectionURL = function(redirectionURL){
    this.onBoardingAppDirectionURL = redirectionURL;
  };
  ConfigurationManager.prototype.getOnBoardingAppDirectionURL = function(redirectionURL){
    return this.onBoardingAppDirectionURL;
  };
  ConfigurationManager.prototype.setEmbeddedOriginationType = function(type){
    this.embeddedOrigination = type;
  };
  ConfigurationManager.prototype.getEmbeddedOrigination = function(){
    return this.embeddedOrigination;
  };
  ConfigurationManager.prototype.setSSOConfig = function(response){
    this.ssoConfig = response;
  };
  ConfigurationManager.prototype.getSSOConfig = function(){
    return this.ssoConfig;
  };
  ConfigurationManager.prototype.fetchClientSideConfigurations = function(){
    var scope = this;
    var KNYMobileFabric = kony.sdk.getCurrentInstance();
    var config = KNYMobileFabric.getConfigurationService();
    config.getAllClientAppProperties(function(res) {
      kony.print("client key value pairs retrieved : " + JSON.stringify(res));
      // extract a key from client key value pairs
      if(res && res["DBP_ONBOARDING_URL"]){
        scope_configManager.setOnBoardingAppDirectionURL(res["DBP_ONBOARDING_URL"]);
      }
	    if(res && res["EMBED_ORIGINATION"]){
        scope_configManager.setEmbeddedOriginationType(res["EMBED_ORIGINATION"]);
      }
      if (res && res["CLIENT_MAP_KEY"]) {
        scope_configManager.mapKey=res["CLIENT_MAP_KEY"];
      }
      if (res && res["TRANSACTIONS_COUNT"]) {
        scope_configManager.transactionsCount = parseInt(res["TRANSACTIONS_COUNT"]);
      }
      if (res && res["EXPLORE_PRODUCTS_URL"]) {
        scope_configManager.setExploreProductsUrl(res["EXPLORE_PRODUCTS_URL"]);
      }
      if (res && res["RESUME_APPLICATION_URL"]) {
        scope_configManager.setResumeApplUrl(res["RESUME_APPLICATION_URL"]);
      }
      if (res && res["IS_TPP_ACKNOWLEDGMENTSCREEN_SHOWN"]) {
        scope_configManager.setTppAcknowledgmentScreenShown(res["IS_TPP_ACKNOWLEDGMENTSCREEN_SHOWN"]);
      }
      if (res && res["TPP_NAVIGATION_TIMER"]) {
        scope_configManager.setTppNavigationTimer(Number(res["TPP_NAVIGATION_TIMER"]));
      }
	  if (res && res["OPTIONAL_SCA"]) {
        scope_configManager.setOptionalSCA(res["OPTIONAL_SCA"]);
      }

      // [Trixon] Fetch and set custom configurations from server client app properties
      if (res && res["BOA_SERVICE_CHARGE_TRANSFER"]) {
        var fetchedRate = {};
        fetchedRate = res["BOA_SERVICE_CHARGE_TRANSFER"];
        fetchedRate = JSON.parse(fetchedRate);
        var parsedRate = {};
        for (const key in fetchedRate) {  parsedRate[key] = JSON.parse(fetchedRate[key]); }
        scope_configManager.BOA_TRANSFER_CHARGES = parsedRate;
      }
      if (res && res["BOA_BILLS_CONFIGURATIONS"]) {
        var fetchedData = {};
        fetchedData = res["BOA_BILLS_CONFIGURATIONS"];
        fetchedData = JSON.parse(fetchedData);
        var parsedData = {};
        for (const key in fetchedData) {  parsedData[key] = JSON.parse(fetchedData[key]); }
        scope_configManager.BOA_BILLS_CONFIGURATIONS = parsedData;
      }
      if (res && res["TRANSFER_CREDIT_ACCT"]) {
        scope_configManager.BOA_TRANSFER_COLLECTION_ACCOUNTS = JSON.parse(res["TRANSFER_CREDIT_ACCT"]);
      }
      if (res && res["BILLS_CREDIT_ACCT"]) {
        scope_configManager.BOA_BILL_COLLECTION_ACCOUNTS = JSON.parse(res["BILLS_CREDIT_ACCT"]);
      }
      if (res && res["BOA_QR_GENERATOR"]) {
        scope_configManager.BOA_QR_GENERATOR = res["TRANSFER_CREDIT_ACCT"];
      }
      // [Trixon] Ended

    },function(err) {
      kony.print(" Failed to retrieve client key value pairs : " + JSON.stringify(err));
    }
    )
  };

  /**
        This method returns the list of permissions required to upload Bulk payment file
    **/
  ConfigurationManager.prototype.getBulkPaymentFileUploadPermissionsList = function(){
    return [
      'BULK_PAYMENT_FILES_MULTI_UPLOAD_CSV',
      'BULK_PAYMENT_FILES_MULTI_UPLOAD_XML',
      'BULK_PAYMENT_FILES_SINGLE_UPLOAD_CSV',
      'BULK_PAYMENT_FILES_SINGLE_UPLOAD_XML'
    ];
  };

  /**
      This method returns the list of permissions required to view Bulk payment request
  **/
  ConfigurationManager.prototype.getBulkPaymentRequestViewPermissionsList = function(){
    return [
      'BULK_PAYMENT_REQUEST_VIEW'
    ];
  };

  /**
      This method returns the list of permissions required to view Bulk payment files
  **/
  ConfigurationManager.prototype.getBulkPaymentFilesViewPermissionsList = function(){
    return [
      'BULK_PAYMENT_FILES_VIEW'
    ];
  };

  /**
        This method returns the list of permissions required to view Bulk payment templates
    **/
  ConfigurationManager.prototype.getBulkPaymentTemplateViewPermissionsList = function(){
    return [
      'BULK_PAYMENT_TEMPLATE_VIEW'
    ];
  };

  /**
        This method returns the list of permissions required to create Bulk payment templates
    **/
  ConfigurationManager.prototype.getBulkPaymentTemplateCreatePermissionsList = function(){
    return [
      'BULK_PAYMENT_TEMPLATE_SINGLE_CREATE',
      'BULK_PAYMENT_TEMPLATE_MULTIPLE_CREATE'
    ];
  };

  /**
      This method returns the list of permissions required for Bulk Payments module
  **/
  ConfigurationManager.prototype.getBulkPaymentFeaturePermissionsList = function(){
    var features = this.getBulkPaymentFileUploadPermissionsList();
    features = features.concat(this.getBulkPaymentRequestViewPermissionsList());
    features = features.concat(this.getBulkPaymentFilesViewPermissionsList());
    features = features.concat(this.getBulkPaymentTemplateViewPermissionsList());
    return features.concat(this.getBulkPaymentTemplateCreatePermissionsList());
  }


  /**
   * Set dispute reasons in an array
   * @param {array} reasons dispute reasons array from identity
   */
  ConfigurationManager.prototype.setDisputeReasons = function(reasons) {
    scope_configManager.disputeReasons = [];
    reasons.forEach(function(reason) {
      scope_configManager.disputeReasons.push(reason["value"]);
    })
  };

  /**
   * Get dispute reasons
   */
  ConfigurationManager.prototype.getDisputeReasons = function(){
    return scope_configManager.disputeReasons;
  };

  /**
   * Set dispute configuration
   * @param {array} disputeConfig dispute config array from identity
   */
  ConfigurationManager.prototype.setDisputeConfigMap = function(disputeConfig){
    disputeConfig.forEach(function(item){
      scope_configManager.disputeConfigMap[item["description"]] = item["isDisputeAllowed"];
    }); 
  };
  /**
   * Get dispute configuration for a transactionType
   * @param {array} transactionType type of transaction
   * returns a true or false string based on the type of transaction
   */
  ConfigurationManager.prototype.getDisputeConfig = function(transactionType){
    return scope_configManager.disputeConfigMap[transactionType];
  };

  /**
   * Set dispute duration
   * @param {integer} duration dispute duration from identity
   */
  ConfigurationManager.prototype.setDisputeDuration = function(duration) {
    scope_configManager.disputeDuration = duration;
  };
  /**
   * Returns dispute duration
   */
  ConfigurationManager.prototype.getDisputeDuration = function() {
    return scope_configManager.disputeDuration;
  };

  ConfigurationManager.prototype.setDisputeCDConfigMap = function(disputeCDConfig){
    disputeCDConfig.forEach(function(item){
      scope_configManager.disputeCDConfigMap[item["description"]] =item["isDisputeAllowed"];
    }); 
  };

  /**
   * Get dispute CD configuration for a credit/debit transaction
   * @param{array}transactionType type of transaction (Credit or Debit)
   * returns a true or false string based on the type of transaction (Credit or Debit)
   */
  ConfigurationManager.prototype.getDisputeCDConfig = function(transactionType){
    return scope_configManager.disputeCDConfigMap[transactionType];
  };

  ConfigurationManager.prototype.getDisputeConfigurations = function () {
    if (scope_configManager.isDisputeConfigurationAdded === false) {
      var param = {
        "bundle_name": "DBP",
        "config_key": ""
      };
      scope_configManager.fetchDisputeConfigurations(param, scope_configManager.fetchDisputeConfigurationSuccessCallback.bind(this), scope_configManager.logOut.bind(this));
    }
  };

  ConfigurationManager.prototype.getDisputeConfigurationsCB = function (params, presentationSuccess, presentationError) {
    if (scope_configManager.isDisputeConfigurationAdded === false) {
      var param = {
        "bundle_name": "DBP",
        "config_key": ""
      };
      scope_configManager.fetchDisputeConfigurations(param, (res) => {
        this.fetchDisputeConfigurationSuccessCallback(res);
        presentationSuccess();
      }, scope_configManager.logOut.bind(this));
    }
  };

  ConfigurationManager.prototype.logOut = function () {
    var authModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
      'appName': "AuthenticationMA",
      'moduleName': "AuthUIModule"
    });
    var context = {
      action: "Logout"
    };
    authModule.presentationController.doLogout(context);
  };

   ConfigurationManager.prototype.fetchDisputeConfigurationSuccessCallback = function (res) {
    if(typeof res == 'object' && res.rawResponse) {
      res = JSON.parse(res.rawResponse);
      res = res['Configurations'];
    }
     var configurationArray = res;
     configurationArray.forEach(function (arrayItem) {
       if (arrayItem["key"]) {
         switch (arrayItem["key"]) {
           case "DISPUTE_DURATION":
             scope_configManager.setDisputeDuration(Number(arrayItem["value"]));
             break;
           case "DISPUTE_REASON_CONFIG":
             var disputeReasonsObject = JSON.parse(arrayItem["value"]);
             scope_configManager.setDisputeReasons(disputeReasonsObject.disputeTransactionErrors);
             break;
           case "DISPUTE_TRANSACTION_TYPE_CONFIG":
             var disputeScenariosObject = JSON.parse(arrayItem["value"]);
             scope_configManager.setDisputeConfigMap(disputeScenariosObject.disputeScenariosConfig);
             break;
           case "DISPUTE_TRANSACTION_CONFIG":
             var disputeScenariosObjectCD = JSON.parse(arrayItem["value"]);
             scope_configManager.setDisputeCDConfigMap(disputeScenariosObjectCD.disputeTransferConfig);
             break;
           case "MAX_GOAL_AMOUNT":
             scope_configManager.setMaxGoalAmount(Number(arrayItem["value"]));
             break;
           case "MAX_MONTHLYDEBIT_AMOUNT":
             scope_configManager.setMaxMonthlyDebitAmount(Number(arrayItem["value"]));
             break;
           case "MAX_MONTHS_ForGOAL":
             scope_configManager.setMaxMonths(Number(arrayItem["value"]));
             break;
           case "MIN_BUDGET_AMOUNT":
             scope_configManager.setMinBudgetAmount(Number(arrayItem["value"]));
             break;
           case "MIN_GOAL_AMOUNT":
             scope_configManager.setMinGoalAmount(Number(arrayItem["value"]));
             break;
           case "MIN_MONTHLYDEBIT_AMOUNT":
             scope_configManager.setMinMonthlyDebitAmount(Number(arrayItem["value"]));
             break;
           case "MIN_MONTHS_ForGOAL":
             scope_configManager.setMinMonths(Number(arrayItem["value"]));
             break;
           case "DUAL_BALANCE":
             scope_configManager.setDualBalanceConfig(arrayItem["value"]);
             break;
           case "COMBINED_STATEMENT_PERIOD_ALLOWED_MONTHS":
             scope_configManager.setCombinedStatementsAllowedPeriod(arrayItem["value"]);
             break;
           case "TRANSFER_FLOW_TYPE":
             scope_configManager.setTransferFlowType(arrayItem["value"]);
             break;
           case "VERIFY_PAYEE_CONFIG":
             scope_configManager.setVerifyPayeeConfig(arrayItem["value"]);
             break;
           case "VERIFY_PAYEE_CONFIG_BULK":
             scope_configManager.setVerifyPayeeBulkConfig(arrayItem["value"]);
             break;
           case "VERIFY_PAYEE_NAME_AUTO_UPD":
              scope_configManager.setVerifyPayeeNameAutoUpdate(arrayItem["value"]);
              break;
           case "MIN_LOAN_PAY_OTHER_AMOUNT":
             scope_configManager.setMinLoanPayOtherAmount(arrayItem["value"]);
             break;
           case "TRANSFERS_CBPR_FIELDS":
             scope_configManager.setTransfersCBPRFields(arrayItem["value"]);
             break;
           case "TRANSFERS_RI_CREDITOR_CODES":
             scope_configManager.setTransfersCreditorCodes(arrayItem["value"]);
             break;
           case "LOAN_REPAY_ORDER_INITIATION_TYPE":
             scope_configManager.setLoanRepayOrderInitiationType(arrayItem["value"]);
             break;
           case "SWIFT_TAG_ENABLE":
             scope_configManager.setSwiftTagFlag(arrayItem["value"]);
             break;
           case "GUARANTEE_BILL_TYPE":
             scope_configManager.setGuaranteeBillType(arrayItem["value"]);
             break;
           case "GUARANTEE_STATUS":
             scope_configManager.setGuaranteesAndStandbyLCStatus(arrayItem["value"]);
             break;
           case "RECEIVED_GUARANTEE_STATUS":
             scope_configManager.setReceivedGuaranteesAndStandbyLCStatus(arrayItem["value"]);
             break;
           case "IS_FAVORITE_REQUIRED":
             scope_configManager.setFavoriteRequired(arrayItem["value"]);
             break;
           case "FAVORITE_ACCOUNT_CONFIG_COUNT":
             scope_configManager.setFavoriteConfigCount(parseInt(arrayItem["value"]));
             break;
           case "INWARDCOLLECTIONS_TENOR_TYPE":
             scope_configManager.setCollectionsTenorType(arrayItem["value"]);
             break;
           case "INWARDCOLLECTIONS_STATUS":
             scope_configManager.inwardCollectionsStatus = arrayItem["value"] ? JSON.parse(arrayItem["value"]) : [];
             break;
           case "INWARDCOLLECTIONS_CHART_DATA":
             scope_configManager.setCollectionsChartData(arrayItem["value"]);
             break;
           case "OUTWARDCOLLECTIONS_CHART_DATA":
             scope_configManager.setOutwardCollectionChartData(arrayItem["value"]);
             break;
           case "IS_SEARCH_REQUIRED":
             scope_configManager.setSearchRequired(arrayItem["value"]);
             break;
           case "SEARCH_ACCOUNT_CONFIG_COUNT":
             scope_configManager.setSearchConfigCount(parseInt(arrayItem["value"]));
             break;
           case "IS_FILTER_REQUIRED":
             scope_configManager.setFilterRequired(arrayItem["value"]);
             break;
           case "FILTER_ACCOUNT_CONFIG_COUNT":
             scope_configManager.setFilterConfigCount(parseInt(arrayItem["value"]));
             break;
           case "ACCOUNT_CLOSE_REASONS":
              scope_configManager.setAccountClosureReasons(arrayItem["value"]);
              break;
           case "REPAYMENT_DAY_CONFIG":
             scope_configManager.setRepaymentDayConfig((arrayItem["value"]));
             break;
           case "SWIFT_GUARANTEES_TAG_ENABLE":
             scope_configManager.setGuaranteesSwiftTagFlag(arrayItem["value"]);
             break;
           case "EXPORT_LC_CHART_DATA":
             scope_configManager.exportLCChartData = arrayItem["value"] ? JSON.parse(arrayItem["value"]) : [];
             break;
           case "IMPORT_LC_CHART_DATA":
             scope_configManager.importLCChartData = arrayItem["value"] ? JSON.parse(arrayItem["value"]) : [];
             break;
           case "LETTER_OF_CREDIT_PAYMENT_TERMS":
             scope_configManager.lcPaymentTerms = arrayItem["value"] ? JSON.parse(arrayItem["value"]) : [];
             break;
           case "RECEIVABLES_BILLS_CHART_DATA":
             scope_configManager.receivableBillsChartData = arrayItem["value"] ? JSON.parse(arrayItem["value"]) : {};
			 break;
           case "ACCOUNTS_COUNT_COMPACT_DASHBOARD":
             scope_configManager.setAccsCountCompactDashboard(parseInt(arrayItem["value"]));
             break;
           case "SEARCH_CUSTOMERID_CONFIG_COUNT":
             scope_configManager.setSearchCustomerCount(parseInt(arrayItem["value"]));
             break;
		   case "FAVOURITE_CUSTOMERID_CONFIG_COUNT":
             scope_configManager.setFavouriteCustomerCount(parseInt(arrayItem["value"]));
             break;
           case "DROPDOWN_CUSTOMERID_CONFIG_COUNT":
             scope_configManager.setDropdownCustomerCount(parseInt(arrayItem["value"]));
             break;
		   case "ACCOUNTS_PER_PAGE":
             scope_configManager.setAccountsPerPage(parseInt(arrayItem["value"]));
             break;  
           case "CUSTOMERIDS_PER_PAGE":
             scope_configManager.setCustomersPerPage(parseInt(arrayItem["value"]));
             break;
		   case "TRANSACTIONS_PER_PAGE":
             scope_configManager.setTransactionsPerPage(parseInt(arrayItem["value"]));
             break;
           case "TNC_REFRESH_PERIOD":
             scope_configManager.tncRefreshPeriod = arrayItem["value"] ? arrayItem["value"] : "";
             scope_configManager.lastModifiedTSforTNC = arrayItem["tncTimeStamp"] ? arrayItem["tncTimeStamp"] : "";
             break;
           case "SBA_SIMULATION_CHANGE":
             scope_configManager.sbaSimulationChange = arrayItem["value"] ? JSON.parse(arrayItem["value"]) : [];
             break;
           case "SBA_TNC_DATA":
             scope_configManager.sbaTNCData = arrayItem["value"] ? JSON.parse(arrayItem["value"]) : [];
             break;
           case "SBA_LEARNMORE_DATA":
             scope_configManager.sbaLearnMore = arrayItem["value"] ? JSON.parse(arrayItem["value"]) : [];
             break;
           case "SBA_EVENTMINUTESAGO":
             scope_configManager.sbaEventMinutesAgo = arrayItem["value"] ? JSON.parse(arrayItem["value"]) : [];
             break;
           case "EARLY_PAYOFF_SIMULATE_DAYS":
             scope_configManager.setEarlyPayOffSimulateDays(parseInt(arrayItem["value"]));
             break;
           case "SCF_Document_category":
             scope_configManager.setdocumentcategory(arrayItem["value"]);
             break;
           case "SCF_INVOICE_APPROVAL":
              scope_configManager.setInvoiceApproval(arrayItem["value"]);
              break;
           case "SCF_INVOICE_UPLOAD_CONFIG":
              scope_configManager.setInvoiceConfig(arrayItem["value"]);
              break;
            case "SCF_COUNTERPARTY_ONBOARD_CONFIG":
              scope_configManager.setInvoiceConfigsetInvoiceConfig(arrayItem["value"]);
              break;
            case "INF_WLTH_PAGE_LIMIT_MULTI_CUSTOMER":
              scope_configManager.setWealthPaginationCount(arrayItem["value"]);
              break;
            case "INF_WLTH_BANK_DATE":
              scope_configManager.setWealthBankDate(arrayItem["value"]);
              break;
            case "INF_WLTH_NEWS_LIMIT":
              scope_configManager.setWealthNewsLimit(arrayItem["value"]);
              break;
            case "MANAGE_SETTELMENT_ACCOUNT":
              scope_configManager.setManageSettelementPermission(arrayItem["value"]);
              break;
            case "CHQ_CONFIG":
              scope_configManager.CHQ_CONFIG=arrayItem["value"];
              break;
            case "OUTWARDCOLLECTION_PHYSICALDOC_CONFIG":
                scope_configManager.setOutwardCollectionPhysicalDocData(arrayItem["value"]);
                break;

         }
       }
     });
     scope_configManager.isDisputeConfigurationAdded = true;
   };


  ConfigurationManager.prototype.fetchDisputeConfigurations = function(params, presentationSuccess, presentationError) {
    function completionCallback (status, data, error)  {
      var srh = applicationManager.getServiceResponseHandler();
      var res = srh.manageResponse(status, data, error);
      if (res["status"] === true) {
        presentationSuccess(res["data"]);
      } else {
        presentationError(res["errmsg"]);
      }
    }

    var ConfigurationsRepo = kony.mvc.MDAApplication.getSharedInstance()
    .getRepoManager()
    .getRepository('Configurations');
    ConfigurationsRepo.customVerb("getSystemConfigurations", params, completionCallback)
  };

  /**
   * getChequetype configurations
   */
   ConfigurationManager.prototype.getChequeType = function(categoryID) {
    var configobj =JSON.parse(scope_configManager.CHQ_CONFIG)
    var catObj= configobj[categoryID];
    var config ={}
    config.ChequeTypes=[]
    config.ChequeTypes.push(catObj);
    return config;
  };


  /**
   * Set max goal amount
   * @param {integer} amount amount
   */
  ConfigurationManager.prototype.setMaxGoalAmount = function(amount) {
    scope_configManager.maxGoalAmount = amount;
  };
  /**
   * Returns max goal amount
   */
  ConfigurationManager.prototype.getMaxGoalAmount = function() {
    return scope_configManager.maxGoalAmount;
  };

  /**
   * Set max monthly debit amount
   * @param {integer} amount amount
   */
  ConfigurationManager.prototype.setMaxMonthlyDebitAmount = function(amount) {
    scope_configManager.maxMonthlydebitAmount = amount;
  };

  /**
   * get max monthly debit amount
   */
  ConfigurationManager.prototype.getMaxMonthlyDebitAmount = function() {
    return scope_configManager.maxMonthlydebitAmount;
  };

  /**
   * Set max months amount
   * @param {integer} amount amount
   */
  ConfigurationManager.prototype.setMaxMonths = function(amount) {
    scope_configManager.maxMonths = amount;
  };

  /**
   * get max monthly amount
   */
  ConfigurationManager.prototype.getMaxMonths = function() {
    return scope_configManager.maxMonths;
  };

  /**
   * Set min budget amount
   * @param {integer} amount amount
   */
  ConfigurationManager.prototype.setMinBudgetAmount = function(amount) {
    scope_configManager.minBudgetAmount = amount;
  };

  /**
   * get min budget amount
   */
  ConfigurationManager.prototype.getMinBudgetAmount = function() {
    return scope_configManager.minBudgetAmount;
  };

  /**
   * Set min goal amount
   * @param {integer} amount amount
   */
  ConfigurationManager.prototype.setMinGoalAmount = function(amount) {
    scope_configManager.minGoalAmount = amount;
  };

  /**
   * get min goal amount
   */
  ConfigurationManager.prototype.getMinGoalAmount = function() {
    return scope_configManager.minGoalAmount;
  };


  /**
   * Set min monthly debit amount
   * @param {integer} amount amount
   */
  ConfigurationManager.prototype.setMinMonthlyDebitAmount = function(amount) {
    scope_configManager.minMonthlydebitAmount = amount;
  };

  /**
   * get min monthly debit amount
   */
  ConfigurationManager.prototype.getMinMonthlyDebitAmount = function() {
    return scope_configManager.minMonthlydebitAmount;
  };

  /**
   * Set min months amount
   * @param {integer} amount amount
   */
  ConfigurationManager.prototype.setMinMonths = function(amount) {
    scope_configManager.minMonths = amount;
  };

  /**
   * get min months amount
   */
  ConfigurationManager.prototype.getMinMonths = function() {
    return scope_configManager.minMonths;
  };

  /**
  *  setDual Balance Configuration from getSystemConfiguration Service
  *
  */
  ConfigurationManager.prototype.setDualBalanceConfig = function(data) {
    scope_configManager.dualBalanceConfig = data;
  };
  /**
   * get dual balance Configuration
   */
  ConfigurationManager.prototype.getDualBalanceConfig = function() {
    var config = scope_configManager.dualBalanceConfig;
    config = JSON.parse(config);
    return config;
  };

  /**
  *  set CombinedS tatements allowed period Configuration from getSystemConfiguration Service
  *
  */
  ConfigurationManager.prototype.setCombinedStatementsAllowedPeriod = function(data) {
    scope_configManager.combinedStatementsAllowedPeriod = data;
  };
  /**
   * get TransferFlowType Configuration
   */
  ConfigurationManager.prototype.setTransferFlowType = function(data) {
    scope_configManager.TransferFlowType = data;
  };
  /**
  * get VerifyPayee Configuration
  */
  ConfigurationManager.prototype.setVerifyPayeeConfig = function(data) {
    scope_configManager.verifyPayeeConfig = JSON.parse(data);
  };
  
  /**
  * get VerifyPayeeBulk Configuration
  */
    ConfigurationManager.prototype.setVerifyPayeeBulkConfig = function(data) {
      scope_configManager.verifyPayeeBulkConfig = JSON.parse(data);
    };

  /**
  * get VerifyPayeeNameAutoUpdate Configuration
  */
  ConfigurationManager.prototype.setVerifyPayeeNameAutoUpdate = function(data) {
    scope_configManager.verifyPayeeNameAutoUpdate = data;
  };

  /**
  * get Transfers CBPR Fields Configuration
  */
  ConfigurationManager.prototype.setTransfersCBPRFields = function(data) {
    scope_configManager.transfersCBPRFields = JSON.parse(data);
  };

  /**
  * get Transfers credito codes Configuration
  */
  ConfigurationManager.prototype.setTransfersCreditorCodes = function(data) {
    scope_configManager.transfersCreditorCodes = JSON.parse(data);
  };
  
  /**
   * This method assigns the value passed to data to minLoanPayOtherAmount global variable
   * @param {string} data value of Min Loan Pay Other Amount
   */
  ConfigurationManager.prototype.setMinLoanPayOtherAmount = function(data) {
    scope_configManager.minLoanPayOtherAmount = data;
  };
  /**
   * set loan Repay Order Initiation Type
   */
  ConfigurationManager.prototype.setLoanRepayOrderInitiationType = function (data) {
    scope_configManager.loanRepayOrderInitiationType = data;
  };
  /**
   * get loan Repay Order Initiation Type
   */
  ConfigurationManager.prototype.getLoanRepayOrderInitiationType = function (data) {
    return scope_configManager.loanRepayOrderInitiationType;
  };
  /**
   * get Document Category Configuration
   */
  ConfigurationManager.prototype.setdocumentcategory = function (data) {
    scope_configManager.SCF_Document_category = JSON.parse(data).allowedDocCategory
  };
   /**
* get Invoive Approval Configuration
  */
   ConfigurationManager.prototype.setInvoiceApproval = function (data) {
     scope_configManager.SCF_INVOICE_APPROVAL = JSON.parse(data)
   };
   /**
* get Invoice Configuration
*/
   ConfigurationManager.prototype.setInvoiceConfig = function (data) {
     scope_configManager.SCF_INVOICE_UPLOAD_CONFIG = JSON.parse(data)
   };
/**
* get Counterprty Onboard Configuration
*/
ConfigurationManager.prototype.setInvoiceConfigsetInvoiceConfig = function (data) {
  scope_configManager.SCF_COUNTERPARTY_ONBOARD_CONFIG = JSON.parse(data)
};

  /**
  * set Wealth Pagination Count
  */
  ConfigurationManager.prototype.setWealthPaginationCount = function (data) {
	  if(null !== data && undefined !== data && data !== ""){
		  scope_configManager.wealthCustomersPerPage = JSON.parse(data)
	  }else{
		  scope_configManager.wealthCustomersPerPage = JSON.parse("10")
	  }
  };
  /**
  * set Wealth Bank Date
  */
  ConfigurationManager.prototype.setWealthBankDate = function (data) {
	  if(null !== data && undefined !== data && data !== ""){
		  scope_configManager.wealthBankDate = JSON.parse(data)
	  } else{
		  scope_configManager.wealthBankDate = JSON.parse('true');
	  }
  };

  /**
  * set Wealth Stock News limit
  */
  ConfigurationManager.prototype.setWealthNewsLimit = function (data) {
	  if(null !== data && undefined !== data && data !== ""){
		  scope_configManager.wealthNewsLimit = JSON.parse(data)
	  } else{
		  scope_configManager.wealthNewsLimit = JSON.parse('3');
	  }
  };
  /**
  * set manage settlement account permission
  */
  ConfigurationManager.prototype.setManageSettelementPermission = function (data) {
	  if(null !== data && undefined !== data && data !== ""){
		  scope_configManager.ManageSettelementPermission = JSON.parse(data)
	  } else{
		  scope_configManager.ManageSettelementPermission = JSON.parse('false');
	  }
  };
  /**
   * set favorite required Configuration from getSystemConfiguration Service
   */
  ConfigurationManager.prototype.setFavoriteRequired = function(flag) {
    if(flag.toLowerCase()=='no' || flag.toLowerCase()=='false'){
      scope_configManager.isFavoriteRequired = false;
    }
  };
  /**
   * set Configuration count to display favorite account from getSystemConfiguration Service
   */
  ConfigurationManager.prototype.setFavoriteConfigCount = function(data) {
      scope_configManager.favoriteCount = data;
  };
  /**
   * set searchBar required Configuration from getSystemConfiguration Service
   */
   ConfigurationManager.prototype.setSearchRequired = function(flag) {
    if(flag.toLowerCase()=='no' || flag.toLowerCase()=='false'){
      scope_configManager.isSearchRequired = false;
    }
  };
  /**
   * set Configuration count to display searchBar from getSystemConfiguration Service
   */
  ConfigurationManager.prototype.setSearchConfigCount = function(data) {
      scope_configManager.searchCount = data;
  };
  /**
   * set filter required Configuration from getSystemConfiguration Service
   */
  ConfigurationManager.prototype.setFilterRequired = function(flag) {
    if(flag.toLowerCase()=='no' || flag.toLowerCase()=='false'){
      scope_configManager.isFilterRequired = false;
    }
  };
  /**
   * set Configuration count to display filter and dropdown from getSystemConfiguration Service
   */
  ConfigurationManager.prototype.setFilterConfigCount = function(data) {
      scope_configManager.filterCount = data;
  };
  /**
   *  set configuration to show reasons to close account from getSystemConfiguration Service
   */
  ConfigurationManager.prototype.setAccountClosureReasons = function(data) {
    scope_configManager.AcCloseReason = typeof(data) ==='string'? JSON.parse(data): data;
};
   /**
   * set configuration to display change repayment day dropdown 
   */
  ConfigurationManager.prototype.setRepaymentDayConfig = function(data) {
        scope_configManager.repaymentDay = data.split(",");
    };
  /**
   * get SwiftTagFlag Configuration
   */
  ConfigurationManager.prototype.setSwiftTagFlag = function(data) {
    let swiftTagObj = JSON.parse(data);
    scope_configManager.swiftEnabled = swiftTagObj["Swift Enable"];
  };
  /**
   * get Guarantee Bill Type Configuration
   */
  ConfigurationManager.prototype.setGuaranteeBillType = function(data) {
    let billType = JSON.parse(data);
    scope_configManager.guaranteeBillType = billType;
  };
  /**
   * get Guarantees and Stanby LC Status Configuration
   */
  ConfigurationManager.prototype.setGuaranteesAndStandbyLCStatus = function(data) {
    let Status = JSON.parse(data);
    scope_configManager.guaranteesAndStandByLCStatus = Status;
  };
    /**
   * get Received Guarantees and Stanby LC Status Configuration
   */
  ConfigurationManager.prototype.setReceivedGuaranteesAndStandbyLCStatus = function(data) {
    let Status = JSON.parse(data);
    scope_configManager.receivedGuaranteesAndStandByLCStatus = Status;
  };
	/**
	* get Inward Collections Chart Data Configuration
	*/
   ConfigurationManager.prototype.setCollectionsChartData = function (data) {
	let chartData = JSON.parse(data);
	scope_configManager.collectionsChartData = chartData;
  };
   /**
	* get Outward Collections Chart Data Configuration
	*/
   ConfigurationManager.prototype.setOutwardCollectionChartData = function (data) {
	let chartData = JSON.parse(data);
	scope_configManager.OutwardCollectionsChartData = chartData;
  };

  /**
     * get Outward Collections Physical Document Configurations
     */
  ConfigurationManager.prototype.setOutwardCollectionPhysicalDocData = function(data) {
    let physicalDocData = JSON.parse(data);
    scope_configManager.OutwardCollectionsPhysicalDocData = physicalDocData;
  };

	/**
	* get Inward Collections Tenor Type Configuration
	*/
	ConfigurationManager.prototype.setCollectionsTenorType = function (data) {
	let tenorType = JSON.parse(data);
	scope_configManager.collectionsTenorType = tenorType;
	};

  /**
   * get Guarantees Swift Tag Flag Configuration
   */
  ConfigurationManager.prototype.setGuaranteesSwiftTagFlag = function(data) {
    let swiftTagObj = JSON.parse(data);
    scope_configManager.guaranteesSwiftEnabled = swiftTagObj["Swift Enable"];
  };
   
   /**
	* get Accounts Count Compact Dashboard Configuration
	*/
	ConfigurationManager.prototype.setAccsCountCompactDashboard = function (data) {
	scope_configManager.accsCountCompactDashboard = data;
	};
   
   /**
	* get Search Customer Count Configuration
	*/
	ConfigurationManager.prototype.setSearchCustomerCount = function (data) {
	scope_configManager.searchCustomerCount = data;
	};
   
   /**
	* get Favourite Customer Count Configuration
	*/
	ConfigurationManager.prototype.setFavouriteCustomerCount = function (data) {
	scope_configManager.favouriteCustomerCount = data;
	};
   
   /**
	* get Dropdown Customer Count Configuration
	*/
	ConfigurationManager.prototype.setDropdownCustomerCount = function (data) {
	scope_configManager.dropdownCustomerCount = data;
	};
   
   /**
	* get Customers Per Page Configuration
	*/
	ConfigurationManager.prototype.setCustomersPerPage = function (data) {
	scope_configManager.customersPerPage = data;
	};
	/**
	* get Transactions Per Page Configuration
	*/
	ConfigurationManager.prototype.setTransactionsPerPage = function (data) {
	scope_configManager.transactionsPerPage = data;
	};
     /**
	* get Accounts Per Page Configuration
	*/
	ConfigurationManager.prototype.setAccountsPerPage = function (data) {
	scope_configManager.accountsPerPage = data;
	};
     /**
	* get Explore Products URL
	*/
    ConfigurationManager.prototype.getExploreProductsUrl = function() {
        return scope_configManager.exploreProductsUrl;
    };
	ConfigurationManager.prototype.setExploreProductsUrl = function (data) {
	scope_configManager.exploreProductsUrl = data;
	};    
     /**
	* get Resume Application URL
	*/
    ConfigurationManager.prototype.getResumeApplUrl = function() {
        return scope_configManager.resumeApplUrl;
    };
	ConfigurationManager.prototype.setResumeApplUrl = function (data) {
	scope_configManager.resumeApplUrl = data;
	};
     /**
	* get Tpp Acknowledgment Screen to be shown or not
	*/
    ConfigurationManager.prototype.getTppAcknowledgmentScreenShown = function() {
        return scope_configManager.tppAcknowledgmentScreenShown;
    };
	ConfigurationManager.prototype.setTppAcknowledgmentScreenShown = function (data) {
	scope_configManager.tppAcknowledgmentScreenShown = data;
	};
     /**
	* get Tpp - time to navigate from retail banking app to other app
	*/
    ConfigurationManager.prototype.getTppNavigationTimer = function() {
        return scope_configManager.tppNavigationTimer;
    };
	ConfigurationManager.prototype.setTppNavigationTimer = function (data) {
	scope_configManager.tppNavigationTimer = data;
	};
	 /**
	* get SCA - optional SCA for payment consent
	*/
    ConfigurationManager.prototype.getOptionalSCA = function() {
        return scope_configManager.isOptionalSCA;
    };
	ConfigurationManager.prototype.setOptionalSCA = function (data) {
	scope_configManager.isOptionalSCA = data;
	};
  /**
   * get CombinedS tatements allowed period Configuration
   */

  ConfigurationManager.prototype.getCombinedStatementsAllowedPeriod = function() {
    var config = scope_configManager.combinedStatementsAllowedPeriod;
    config = JSON.parse(config);
    return config;
  };
  /**
	* get Simulate Statement generated for future date, up to 20 days
	*/
  ConfigurationManager.prototype.setEarlyPayOffSimulateDays = function (data) {
	scope_configManager.earlyPayOffSimulateDays = data;
  };
  ConfigurationManager.prototype.setLoggedInUserPermissionsData = function(loggedInUserPermissionsData) {
    scope_configManager.loggedInUserPermissionsData = loggedInUserPermissionsData;
  };
  ConfigurationManager.prototype.getLoggedInUserPermissionsData = function() {
    return scope_configManager.loggedInUserPermissionsData;
  };
  ConfigurationManager.prototype.checkCompanyLevelPermission = function(cif, feature, permission) {
    let jpath = "globalLevelPermissions,cif=" + cif + ",features,featureId=" + feature+",permissions,actionId="+permission;
    let data = JSON.parse(JSON.stringify(CommonUtilities.getObjectFromPath(this.loggedInUserPermissionsData, jpath)));
    if(data === -1){
      return false;
    }
    else if(data.hasOwnProperty("isEnabled")){
      return data.isEnabled.toString() === 'true';
    }
    else return true;
  };
  ConfigurationManager.prototype.isMicroAppPresent = function(appMAName) {
    var constantName = this.microappConstants;
    var appData = {
    [constantName.ABOUTUS] : "FeedbackUIModule",
    [constantName.ALERTSETTINGS]: "SettingsNewAlertsUIModule",
	[constantName.CONSENTMANAGEMENT]: "CDPConsentUIModule",
    [constantName.BILLPAY]: "BillPaymentUIModule",
    [constantName.DIGITALTRANSFER]: "P2PActivationDeactivationUIModule",
    [constantName.HOMEPAGE] : "AccountsUIModule",
    [constantName.NOTIFICATIONS] : "AlertsMsgsUIModule",
    [constantName.SECUREMESSAGE] : "AlertsMsgsUIModule",
    [constantName.PERSONALFINANCEMANAGEMENT] : "PersonalFinanceManagementUIModule",
    [constantName.PORTFOLIO]  : "WealthPortfolioUIModule",
    [constantName.REGIONALTRANSFER] : "TransferEurUIModule",
    [constantName.UNIFIEDTRANSFER] : "ManageActivitiesUIModule",
    [constantName.WEALTHORDER] : "WealthOrderUIModule",
    [constantName.WIRETRANSFER] : "WireTransferNewUIModule",
    [constantName.COMMONS] : "MFAModule",
	[constantName.ACCAGGREGATION] : "ExternalAccountsUIModule",
	[constantName.ARRANGEMENTS] : "AccountsUIModule",
	[constantName.APPROVALMATRIX] : "SettingsNewApprovalUIModule",
	[constantName.USERMANAGEMENT] : "BusinessBankingUIModule",
	[constantName.APPROVALREQUEST] : "ApprovalsReqUIModule",
	[constantName.FOREIGNEXCHANGE] : "ForeignExchangeUIModule",
	[constantName.BULKPAYMENTS] : "BulkPaymentsUIModule",
	[constantName.FINANCEMANAGEMENT] : "PersonalFinanceManagementUIModule",
	[constantName.CARDS] : "ManageCardsUIModule",
    [constantName.CAMPAIGN] : "CampaignUIModule",
	[constantName.MANAGEARRANGEMENTS] : "ManageArrangementsUIModule",
	[constantName.CBP] : "KonyDXChatbotModule",
    [constantName.SELFSERVICEENROLMENT] : "EnrollUIModule",
    [constantName.MANAGEPROFILE] : 'SettingsNewUIModule',
	[constantName.TRADEFINANCE] : 'ImportLCUIModule',
    [constantName.SAVINGSPOT] : 'SavingsPotUIModule',
    [constantName.AUTHENTICATION] : 'AuthUIModule',
	[constantName.ACH] : 'ACHUIModule',
  [constantName.ACCOUNTSWEEP] : 'AccountSweepsUIModule',
  [constantName.TRADESUPPLYFINANCE]: 'AnchorUIModule',
  [constantName.SMARTBANKINGADVISORY]: 'EnrolmentModule',
  [constantName.TRADELENDING]: 'LendingDashboardUIModule',
   };
   try{
	var presenter = applicationManager.getModulesPresentationController({
            'appName': appMAName,
            'moduleName': appData[appMAName]
    });
    return true;
   }catch(e){
    return false;
   }
  };

  ConfigurationManager.prototype.setDateFormatCP = function(response){
    this.dateFormatCP = response;
  };
  ConfigurationManager.prototype.getDateFormatCP = function(){
    return this.dateFormatCP;
  };
  ConfigurationManager.prototype.setEarlyPayOffMsg = function(response){
    this.earlyPayOffMsg = response;
  };
  ConfigurationManager.prototype.getEarlyPayOffMsg = function(){
    return this.earlyPayOffMsg;
  };
  ConfigurationManager.prototype.setEnableHeavyUserDasboard = function(response){
    this.enableheavyuserdashboard = response;
  };
  ConfigurationManager.prototype.getEnableHeavyUserDasboard = function(){
    return this.enableheavyuserdashboard;
  };
  ConfigurationManager.prototype.setTppNavigationTimer = function(response) {
        this.tppNavigationTimer = response;
    };
    ConfigurationManager.prototype.getTppNavigationTimer = function() {
        return this.tppNavigationTimer;
    };
  ConfigurationManager.prototype.getOptionalSCA = function() {
        return this.isOptionalSCA;
    };
	ConfigurationManager.prototype.setOptionalSCA = function (response) {
	this.isOptionalSCA = response;
	};
  ConfigurationManager.prototype.setEarlyPayOffTel1 = function(response){
    this.earlyPayOffTel1 = response;
  };
  ConfigurationManager.prototype.getEarlyPayOffTel1 = function(){
    return this.earlyPayOffTel1;
  };
  ConfigurationManager.prototype.setEarlyPayOffTel2 = function(response){
    this.earlyPayOffTel2 = response;
  };
  ConfigurationManager.prototype.getEarlyPayOffTel2 = function(){
    return this.earlyPayOffTel2;
  };
  ConfigurationManager.prototype.setEarlyPayOffEmail = function(response){
    this.earlyPayOffEmail = response;
  };
  ConfigurationManager.prototype.getEarlyPayOffEmail = function(){
    return this.earlyPayOffEmail;
  };
  ConfigurationManager.prototype.setEarlyPayOffAddress = function(response){
    this.earlyPayOffAddress = response;
  };
  ConfigurationManager.prototype.getEarlyPayOffAddress = function(){
    return this.earlyPayOffAddress;
  };
  return ConfigurationManager;
});
