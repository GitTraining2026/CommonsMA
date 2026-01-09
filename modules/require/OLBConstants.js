/*eslint olblint/image-names:0*/
define([], function () {

    var OLB_CONSTANTS = {
        IDENTITYSERVICENAME: "DbxUserLogin",
        BUILD_TYPE: {
          "BASE" : 0,
          "HID" : 1,
          "UNIKEN":2
        },
        NO_OF_RECURRENCES: "NO_OF_RECURRENCES",
        FUNCTION_WAIT: 100,
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
        SEARCH: "Search",
        CURRENCY_NAME: 'Dollar',
        ANY_DATE: 'ANY_DATE',
        CHOOSE_TIME_RANGE: 'CHOOSE_TIME_RANGE',
        CUSTOM_DATE_RANGE: 'CUSTOM_DATE_RANGE',
        IBAN_MINIMUM_LENGTH: 22,
        IBAN_MAXIMUM_LENGTH: 34,
        CHECK_SERIES_SEPARATOR: "-",
        CHECK_REQUEST_TYPES: {
            SINGLE: 'Single',
            SERIES: 'Series'
        },
        UNCATEGORISED: "Uncategorised",
        DISPUTED_CHECKS: "DisputesChecks",
        MY_CHEQUES: "MyCheques",
        DISPUTED_TRANSACTIONS: "DisputedTransactions",
        NOTES_MAX_LENGTH: 120,
        NOTES_MAXIMUM_LENGTH: 35,
        Channel: 'Online',
        CHANNEL_DESKTOP: "Desktop Web",
        CHANNEL_MOBILE: "Mobile Web",
        CHANNEL_TABLET: "Tablet Web",
        MAX_CHECKS_COUNT: 50,
        OTPLength: 6,
        MASKED_CARD_NUMBER_LENGTH: 19,
        DELETE_PHONE: "phoneNumbers",
        DELETE_EMAIL: "EmailIds",
        LOAN: 'loan',
		DENIED: 'Denied',
        SERVERERROR: 'Server Error',
        IMAGES: {
            // BANNER_IMAGE: 'http://pmqa.konylabs.net/KonyWebBanking/banner_img.png',
            SORTING_NEXT: 'sorting_next.png',
            SORTING_PREVIOUS: 'sorting_previous.png',
            SORTING: 'sorting.png',
            CHECKED_IMAGE: "checked_box.png",
            UNCHECKED_IMAGE: "unchecked_box.png",
            ARRAOW_UP: "arrow_up.png",
            ARRAOW_DOWN: "arrow_down.png",
            ACTIVE_UP: "active_up_btn.png",
            DISABLE_UP: "disable_up_btn.png",
            ACTIVE_DOWN: "active_down_btn.png",
            DISABLE_DOWN: "disable_down_btn.png",
            EAZEE_FOOD_CARD: 'eazee_food_card.png',
            GOLDEN_CARD: 'golden_card.png',
            PETRO_CARD: 'petro_card.png',
            PLATINUM_CARD: 'platinum_card.png',
            PREMIUM_CLUB_CREDIT: 'premium_club_credit.png',
            SHOPPING_CARD: 'shopping_card.png',
            EAZEE_FOOD_CARDS: 'eazee_food_cards.png',
            GOLDEN_CARDS: 'golden_cards.png',
            PETRO_CARDS: 'petro_cards.png',
            PLATINUM_CARDS: 'platinum_cards.png',
            PREMIUM_CLUB_CREDITS: 'premium_club_credits.png',
            SHOPPING_CARDS: 'shopping_cards.png',
            RADIOBTN_ACTIVE_SMALL: 'radio_butn_active.png',
            ICON_RADIOBTN: 'icon_radiobtn.png',
            ICON_RADIOBTN_ACTIVE: 'icon_radiobtn_active.png',
            SUCCESS_IMAGE: 'bulk_billpay_success.png',
            SERVER_DOWN_IMAGE: 'error_yellow.png'
        },
        FONT_ICONS: {
            CHECBOX_SELECTED: "C",
            CHECBOX_UNSELECTED: "D",
            RADIOBUTTON_SELECTED: "M",
            RADIOBUTTON_UNSELECTED: "L"
        },
        SKINS: {
            CARDS_ACTIVE_STATUS_LANDING: 'sknLblActiveCard',
            CARDS_LOCKED_STATUS_LANDING: 'sknLblLockedCard',
            CARDS_REPORTED_LOST_STATUS_LANDING: 'sknLblLostCard',
            CARDS_REPLACE_REQUEST_SENT_STATUS_LANDING: 'sknLblLostCard',
            CARDS_CANCEL_REQUEST_SENT_STATUS_LANDING: 'sknLblLostCard',
            CARDS_CANCELLED_STATUS_LANDING: 'sknLblLostCard',
            CARDS_ACTIVE_STATUS_DETAILS: 'sknLblActiveCard',
            CARDS_LOCKED_STATUS_DETAILS: 'sknLblLockedCard',
            CARDS_REPORTED_LOST_STATUS_DETAILS: 'sknLblLostCard',
            CARDS_REPLACE_REQUEST_SENT_STATUS_DETAILS: 'sknLblLostCard',
            CARDS_CANCEL_REQUEST_SENT_STATUS_DETAILS: 'sknLblLostCard',
            CARDS_CANCELLED_STATUS_DETAILS: 'sknLblLostCard',
            CARDS_RADIOBTN_LABEL_UNSELECTED: 'sknd3d3d320pxolbfonticons',
            CARDS_RADIOBTN_LABEL_SELECTED: 'sknlblOLBFonts3343A820px',
            STOPPAYMENTS_UNSELECT_TAB: 'sknBtnAccountSummaryUnselected',
            STOPPAYMENTS_SELECT_TAB: 'sknBtnAccountSummarySelectedmod',
            STOPPAYMENTS_UNSELECT_HOVER: 'sknhoverbtnacc',
            LOGIN_RESEND_OTP_DISABLED: 'sknBtnBlockedBg0SSP0273e3Pr40',
            LOGIN_RESEND_OTP_ENABLED: 'sknBtnSSP0273E317PxBg0',
            COMMON_TEXTBOX_ERROR: 'skntxtSSP424242BorderFF0000Op100Radius2px',
            COMMON_TEXTBOX_NOERROR: 'sknTbxSSPffffff15PxBorder727272opa20',
            COMMON_TEXTBOX_HOVER: 'sknBGFFFFFBdrE3E3E3BdrRadius2PxHover',
            INTERACTIVE_LINK: 'sknlbl3343a8SSP15px',
            ALTERNATEACTIONS_NEW_SKIN: 'sknFontNewSigninOptions0273e3',
            CHECKBOX_UNSELECTED_SKIN: 'sknC0C0C020pxolbfonticons',
            CHECKBOX_SELECTED_SKIN: 'sknFontIconCheckBoxSelected'
        },

        CUSTOMER_TYPE: {
            BUSINESSUSER: 'Micro Business'
        },

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
            MORTGAGE_FACILITY: 'mortgageFacility',
            LINE_OF_CREDIT: 'Line of Credit'
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
            FEES: "Fees",
            INTERESTDEBIT: 'InterestDebit',
            INTERESTCREDIT: 'InterestCredit',
            LOAN: 'Loan',
            CHEQUEBOOKREQUEST: 'ChequeBookRequest',
            STOPCHECKPAYMENTREQUEST: 'StopCheckPaymentRequest',
            DISPUTEDTRANSACTIONSREQUEST: 'DisputedTransactionRequest',
            WIRE: 'Wire',
            DEPOSIT: 'Deposit',
            CARDLESS: 'Cardless',
            CHECKWITHDRAWAL: 'CheckWithdrawal',
            WITHDRAWL: 'Withdrawal',
            RECEIVEDP2P: 'ReceivedP2P',
            RECEIVEDREQUEST: 'ReceivedRequest',
            FEE: 'Fee',
            POS: 'POS',
            TAX: 'Tax',
            INTERNETTRANSACTION: 'InternetTransaction',
            CARDPAYMENT: 'CardPayment',
            CREDIT: 'Credit'
        },

        TRANSACTION_STATUS: {
            INPROGRESS: "In-Progress",
            SUCCESSFUL: "Successful",
            CLEARED: "Cleared",
            REQUESTEXPIRED: "Request Expired",
            FAILED: "Failed",
            PENDING: "Pending",
            STOPPED: "Stopped",
            CANCEL: "Cancelled",
            ACTIVE: "Active"
        },
        TRANSACTION_RECURRENCE: {
            ONCE: "Once",
            DAILY: "Daily",
            WEEKLY: "Weekly",
            BIWEEKLY: "BiWeekly",
            MONTHLY: "Monthly",
            YEARLY: "Yearly",
            HALFYEARLY: "Half Yearly",
            QUARTERLY: "Quarterly",
            EVERYTWOWEEKS: "Every Two Weeks"
        },
        ACTION: {
            ACCOUNT_ALERTS: 'Account Alerts',
            REFRESH_ACCOUNT: 'Refresh Account',
            DELETE_ACCOUNT: 'Delete Account',
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
            VIEW_BILL: 'View Bill',
            SHOW_DISPUTE_TRANSACTION_FORM: 'ShowDisputeTransactionForm',
            SHOW_STOPCHECKS_FORM: 'ShowStopChecksForm',
            STOPCHECKS_PAYMENT: 'Stop Cheque Payment',
            REQUEST_CHEQUE_BOOK: 'Request Cheque Book',
            REQUEST_CHEQUE_BOOK_FORM: 'showRequestChequeBookForm',
            VIEW_MYCHEQUES: 'My Cheques',
            VIEW_MYCHEQUES_FORM: 'showMyChequesForm',
            SET_AS_FAVOURITE: 'Set as Favourite',
            REMOVE_AS_FAVOURITE: 'Remove as Favourite',
            SAVINGS_POT: 'Savings Pot',
            SHOW_DISPUTE_LIST: 'Disputed Transactions'
        },
        TRANSFER_TYPES: {
            OWN_INTERNAL_ACCOUNTS: 'OWN_INTERNAL_ACCOUNTS',
            OTHER_INTERNAL_MEMBER: 'OTHER_INTERNAL_MEMBER',
            OTHER_EXTERNAL_ACCOUNT: 'OTHER_EXTERNAL_ACCOUNT',
            INTERNATIONAL_ACCOUNT: 'INTERNATIONAL_ACCOUNT',
            WIRE_TRANSFER: 'WIRE_TRANSFER',
            INTRA_BANK_TRANSFER: 'INTRA_BANK_FUND_TRANSFER_CREATE',
            INTER_BANK_TRANSFER: 'INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE',
            OWN_INTERNAL_TRANSFER: 'TRANSFER_BETWEEN_OWN_ACCOUNT_CREATE',
            INTERNATIONAL_TRANSFER: 'INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE',
            P2P_TRANSFER: 'P2P_CREATE',
            P2P_ACCOUNT: 'P2P_ACCOUNT'
        },
        BULK_WIRE_PERMISSIONS: {
            DOMESTIC_WIRE_TRANSFER: 'DOMESTIC_WIRE_TRANSFER',
            DOMESTIC_WIRE_TRANSFER_VIEW: 'DOMESTIC_WIRE_TRANSFER_VIEW',
            DOMESTIC_WIRE_TRANSFER_CREATE: 'DOMESTIC_WIRE_TRANSFER_CREATE',
            DOMESTIC_WIRE_TRANSFER_VIEW_RECEPIENT: 'DOMESTIC_WIRE_TRANSFER_VIEW_RECEPIENT',
            DOMESTIC_WIRE_TRANSFER_CREATE_RECEPIENT: 'DOMESTIC_WIRE_TRANSFER_CREATE_RECEPIENT',
            DOMESTIC_WIRE_TRANSFER_UPDATE_BULK_TEMPLATES: 'DOMESTIC_WIRE_TRANSFER_UPDATE_BULK_TEMPLATES',
            DOMESTIC_WIRE_TRANSFER_UPLOAD_BULK_FILES: 'DOMESTIC_WIRE_TRANSFER_UPLOAD_BULK_FILES',
            DOMESTIC_WIRE_TRANSFER_VIEW_BULK_FILES: 'DOMESTIC_WIRE_TRANSFER_VIEW_BULK_FILES',
            DOMESTIC_WIRE_TRANSFER_BULKWIRES: 'DOMESTIC_WIRE_TRANSFER_BULKWIRES',
            DOMESTIC_WIRE_TRANSFER_VIEW_BULK_TEMPLATES: 'DOMESTIC_WIRE_TRANSFER_VIEW_BULK_TEMPLATES',
            DOMESTIC_WIRE_TRANSFER_DELETE_BULK_TEMPLATES: 'DOMESTIC_WIRE_TRANSFER_DELETE_BULK_TEMPLATES',
            INTERNATIONAL_WIRE_TRANSFER: 'INTERNATIONAL_WIRE_TRANSFER',
            INTERNATIONAL_WIRE_TRANSFER_VIEW: 'INTERNATIONAL_WIRE_TRANSFER_VIEW',
            INTERNATIONAL_WIRE_TRANSFER_CREATE: 'INTERNATIONAL_WIRE_TRANSFER_CREATE',
            INTERNATIONAL_WIRE_TRANSFER_VIEW_RECEPIENT: 'INTERNATIONAL_WIRE_TRANSFER_VIEW_RECEPIENT',
            INTERNATIONAL_WIRE_TRANSFER_CREATE_RECEPIENT: 'INTERNATIONAL_WIRE_TRANSFER_CREATE_RECEPIENT',
            INTERNATIONAL_WIRE_TRANSFER_UPDATE_BULK_TEMPLATES: 'INTERNATIONAL_WIRE_TRANSFER_UPDATE_BULK_TEMPLATES',
            INTERNATIONAL_WIRE_TRANSFER_BULKWIRES: 'INTERNATIONAL_WIRE_TRANSFER_BULKWIRES',
            INTERNATIONAL_WIRE_TRANSFER_UPLOAD_BULK_FILES: 'INTERNATIONAL_WIRE_TRANSFER_UPLOAD_BULK_FILES',
            INTERNATIONAL_WIRE_TRANSFER_VIEW_BULK_TEMPLATES: 'INTERNATIONAL_WIRE_TRANSFER_VIEW_BULK_TEMPLATES',
            INTERNATIONAL_WIRE_TRANSFER_VIEW_BULK_FILES: 'INTERNATIONAL_WIRE_TRANSFER_VIEW_BULK_FILES',
            INTERNATIONAL_WIRE_TRANSFER_DELETE_BULK_TEMPLATES: 'INTERNATIONAL_WIRE_TRANSFER_DELETE_BULK_TEMPLATES'
        },
        USER_MANAGEMENT_TYPE: {
            HYBRID: 'Hybrid',
            MANUAL: 'Manual',
            EXISTING: 'Existing',
            SKIP: 'Skip',
            COPY: 'Copy',
            VIEW_EDIT: 'View/Edit',
            CREATE: 'CREATE',
            CUSTOM_ROLE: 'Custom_Role',
            USER_CREATION: 'User_Creation',
            CREATE_ROLE: 'Create role from user',
        },

        SAVINGS_POT_PERMISSIONS: {
            BUDGET_POT_VIEW: 'BUDGET_POT_VIEW',
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
        MFA_FLOW_TYPES: {
            FAST_TRANSFERS: "FAST_TRANSFERS",
            LoginMFA: "LoginMFA",
            DOMESTIC_WIRE_TRANSFER: "DOMESTIC_WIRE_TRANSFER",
            INTERNATIONAL_WIRE_TRANSFER: "INTERNATIONAL_WIRE_TRANSFER",
            SINGLE_BILL_PAY: "SINGLE_BILL_PAY",
            PAY_A_PERSON: "PAY_A_PERSON",
            TRANSFERS_EURO: "TRANSFERS_EURO",
            BULK_BILL_PAY: "BULK_BILL_PAY",
            ONE_TIME_WIRE_TRANSFERS: "ONE_TIME_WIRE_TRANSFERS",
            TRANSFERS_UPDATE: "TRANSFERS_UPDATE",
            TRANSFERS: "TRANSFERS",
            SECURE_ACCESS_CODE: "SECURE_ACCESS_CODE",
            SECURITY_QUESTIONS: "SECURITY_QUESTIONS",
            DISPLAY_ALL: "DISPLAY_ALL",
            DISPLAY_NO_VALUE: "DISPLAY_NO_VALUE",
            DISPLAY_PRIMARY: "DISPLAY_PRIMARY",
            SINGLE_BILL_PAYMENT: "SINGLE_BILL_PAYMENT",
            BULK_BILL_PAYMENT: "BULK_BILL_PAYMENT",
            UPDATE_BILL_PAYMENT: "UPDATE_BILL_PAYMENT",
            P2P_CREATE: "P2P_CREATE",
            P2P_EDIT: "P2P_EDIT",
            TRANSFER_BETWEEN_OWN_ACCOUNT_CREATE: "TRANSFER_BETWEEN_OWN_ACCOUNT_CREATE",
            INTRA_BANK_FUND_TRANSFER_CREATE: "INTRA_BANK_FUND_TRANSFER_CREATE",
            INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE: "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE",
            INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE: "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE",
            TRANSFER_BETWEEN_OWN_ACCOUNT_UPDATE: "TRANSFER_BETWEEN_OWN_ACCOUNT_UPDATE",
            INTRA_BANK_FUND_TRANSFER_UPDATE: "INTRA_BANK_FUND_TRANSFER_UPDATE",
            INTER_BANK_ACCOUNT_FUND_TRANSFER_UPDATE: "INTER_BANK_ACCOUNT_FUND_TRANSFER_UPDATE",
            INTERNATIONAL_ACCOUNT_FUND_TRANSFER_UPDATE: "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_UPDATE",
            CREATE_BULKWIRE_TRANSFER: "CREATE_BULKWIRE_TRANSFER",
            CREATE_BULKWIRE_TRANSFER_TEMPLATE: "CREATE_BULKWIRE_TRANSFER_TEMPLATE",
            REVOKE_PSD2_CONSENT: "PSD2_TPP_CONSENT_REVOKED"
        },
        TNC_FLOW_TYPES: {
            "Login_TnC": "Login_TnC",
            "Enroll_TnC": "Enroll_TnC",
            "Estatements_TnC": "Estatements_TnC",
            "Hamburger_TnC": "Hamburger_TnC",
            "Footer_TnC": "Footer_TnC",
            "Common_TnC": "Common_TnC",
            "BillPay_Activation_TnC": "BillPay_Activation_TnC",
            "BillPay_TnC": "BillPay_TnC",
            "P2P_Activation_TnC": "P2P_Activation_TnC",
            "P2P_TnC": "P2P_TnC",
            "StopPayment_TnC": "StopPayment_TnC",
            "WireTransfer_TnC": "WireTransfers_TnC",
            "International_WireTransfer_TnC": "International_WireTransfers_TnC",
            "OneTime_WireTransfer_TnC": "WireTransfers_TnC",
            "LockCard_TnC": "LockCard_TnC",
            "UnlockCard_TnC": "LockCard_TnC", // TODO: Update proper value after receving TnC from Consent MS
            "CancelCard_TnC": "CancelCard_TnC",
            "SEPA_TnC": "SEPA_TnC",
            "ExternalAcct_Verification_TnC": "ExternalAcct_Verification_TnC",
            "AccountAggregation_TnC": "AccountAggregation_TnC",
            "Mortgage_PartialRepayment_TnC": "Mortgage_PartialRepayment_TnC",
            "Mortgage_PartialRepayment_Simulation_TnC": "Mortgage_PartialRepayment_Simulation_TnC",
            "EarlyPayOffSimulation_TnC": "EarlyPayOffSimulation_TnC"
        },
        MONTHS_FULL: {
            January: "January",
            February: "February",
            March: "March",
            April: "April",
            May: "May",
            June: "June",
            July: "July",
            August: "August",
            September: "September",
            October: "October",
            November: "November",
            December: "December"
        },

        CONFIG: {
            ACCOUNTS_QUICK_ACTIONS: {
                "Savings": [
                    "Savings Pot",
                    "Transfer Money",
                    "Pay Money",
                    "Request Cheque Book",
                    "Stop Cheque Payment",
                    "My Cheques",
                    "View Statements",
                    "Account Alerts",
                    "Refresh Account",
                    "Remove Account"
                ],
                "Checking": [
                    "Savings Pot",
                    "Transfer Money",
                    "Pay Money",
                    "Send Money",
                    "Pay a Bill",
                    "Request Cheque Book",
                    "Stop Cheque Payment",
                    "My Cheques",
                    "View Statements",
                    "Account Alerts",
                    "Refresh Account",
                    "Remove Account"
                ],
                "CreditCard": [
                    "Pay a Bill",
                    "View Statements",
                    "Account Alerts"
                    //"Pay Due Amount" Not in scope
                ],
                "Loan": [
                    "Pay Due Amount",
                    "View Statements",
                    "Update Account Settings",
                    "Account Alerts",
                    "Payoff Loan"
                ],
                "Line of Credit": [
                    //"Pay Due Amount",
                    "View Statements",
                    "Update Account Settings",
                    "Account Alerts"
                ],
                "Mortgage": [
                    //"Pay Due Amount",
                    "View Statements",
                    "Update Account Settings",
                    "Account Alerts"
                ],
                "Deposit": [
                    "View Statements",
                    "Update Account Settings",
                    "Account Alerts"
                ],
                "Other": [

                ]
            },
            EXTERNAL_ACCOUNT_QUICK_ACTIONS: [
                "Remove Account",
                "Account Preferences",
                "Edit Account",
                "Refresh Account",
                "Delete Account"
            ],
            ACCOUNTS_RIGHTSIDE_ACTIONS: {
                "Savings": [
                    "Savings Pot",
                    "Scheduled Transactions",
                    "Make A Transfer",
                    "Request Cheque Book"
                ],
                "Checking": [
                    "Savings Pot",
                    "Scheduled Transactions",
                    "Make A Transfer",
                    "Pay a Bill",
                    //"Request Cheque Book" - to be part of secondary actions
                ],
                "CreditCard": [
                    "Scheduled Transactions",
                    "View Statements"
                    //"Pay Due Amount" Not in scope
                ],
                "Loan": [
                    "Pay Due Amount",
                    "View Statements",
                    "Update Account Settings"
                ],
                "Line of Credit": [
                    //"Pay Due Amount", Not in scope
                    "View Statements",
                    "Update Account Settings"
                ],
                "Mortgage": [
                    //"Pay Due Amount", Not in scope
                    "View Statements",
                    "Update Account Settings"
                ],
                "Deposit": [
                    "Savings Pot",
                    "View Statements",
                    "Update Account Settings"
                ],
                "Other": [
                    "Update Account Settings"
                ]
            },
            ACCOUNTS_SECONDARY_ACTIONS: {
                "Savings": [
                    "View Statements",
                    "Request Cheque Book",
                    "Stop Cheque Payment",
                    "My Cheques",
                    "Update Account Settings",
                    //"Order Checks", //Post R4
                    //"Manage Card" //Post R4
                ],
                "Checking": [
                    "Send Money",
                    "View Statements",
                    "Request Cheque Book",
                    "Stop Cheque Payment",
                    "My Cheques",
                    "Update Account Settings",
                    //"Order Checks", //Post R4
                    //"Manage Card" //Post R4
                ],
                "CreditCard": [
                    "Pay a Bill",
                    "Update Account Settings",
                    //"Manage Card", //Post R4
                    //"Report Lost/Stolen", //Post R4
                    //"Lock Card/Deactivate Card", //Post R4
                ],
                "Loan": [
                    "Payoff Loan",
                    "Update Account Settings"
                ],
                "Line of Credit": [
                    //"Payoff Loan", Not in Scope
                    "Update Account Settings"
                ],
                "Mortgage": [
                    "Update Account Settings"
                ],
                "Deposit": [
                    "Update Account Settings"
                ],
                "Other": [
                    "Update Account Settings"
                ]
            }
        },
        CATEGORIES:
        {
            "Home": "#FEDB64",
            "Transport": "#3645A7",
            "Financial ": "#6753EC",
            "Food": "#D6B9EA",
            "Utilities": "#E87C5E",
            "Health": "#04B6DF",
            "Education": "#E8A75E",
            "Other": "#B160DC",
            "Travel": "#8ED174"
        },
        CARD_TYPE: {
            'Debit': 'Debit',
            'Credit': 'Credit'
        },
        CARD_ACTION: {
            'Lock': 'Lock Card',
            'Unlock': 'Unlock Card',
            'Replace': 'Replace Card',
            'Report_Lost': 'Report Lost',
            'Cancel': 'Cancel Card',
            'Set_Limits': 'Set Limits',
            'Change_Pin': 'Change Pin',
            'Offline_Change_Pin': 'Offline Change Pin'
        },
        CARD_REQUEST_CODE: {
            'Replacement': 'REPLACEMENT',
            'NewPin': 'NEW_PIN',
            'AccountType_Card': 'CARD'
        },
        CARD_STATUS: {
            'Active': 'Active',
            'Locked': 'Locked',
            'ReportedLost': 'Reported Lost',
            'ReplaceRequestSent': 'Replace Request Sent',
            'CancelRequestSent': 'Cancel Request Sent',
            'Cancelled': 'Cancelled',
            'Inactive': 'Inactive',
            'Replaced': 'Replaced',
            'Issued': 'Issued'
        },
        CARD_PRODUCT: {
            'PlatinumCredit': 'My Platinum Credit Card',
            'GoldDebit': 'Gold Debit Card',
            'PremiumCredit': 'Premium Club Credit Card',
            'ShoppingCard': 'Shopping Card',
            'PetroCard': 'Petro Card',
            'FoodCard': 'Eazee Food Card'
        },
        MFA_OPTIONS: {
            'SECURE_ACCESS_CODE': 'Secure Access Code',
            'SECURITY_QUESTIONS': 'Security Questions'
        },
        CHANGE_PIN_OFFLINE_OPTION: {
            'EMAIL': 'E-mail ID',
            'PHONE': 'Phone No',
            'POSTAL_ADDRESS': 'Postal Address'
        },
        CARD_CHANGE_PIN_REASON: {
            'PIN_COMPROMISED': 'PIN Compromised',
            'FORGOT_PIN': 'Lost PIN',
            'OTHER': 'Other'
        },
        CARD_REPORTLOST_REASON: {
            'LOST': 'Lost',
            'STOLEN': 'Stolen'
        },
        WireTransferConstants: {
            RECIPIENT_INDIVIDUAL: 'Individual',
            RECIPIENT_BUSINESS: 'Business',
            ACCOUNT_DOMESTIC: 'Domestic',
            ACCOUNT_INTERNATIONAL: 'International',
            DOMESTIC_COUNTRY: 'USA',
            DEFAULT_COUNTRY: 1  // Can be replaced with null basis on backend services.
        },
        TERMS_AND_CONDITIONS_URL: 'URL',
        SWITCH_ACTION: {
            ON: "m",
            OFF: "n"
        },
        FILE_CATEGORY: {
            TEMPLATE: "BULKWIRE_TEMPLATE"
        },
        RECIPIENT_CATEGORY: {
            EXTRACTED_FROM_FILE: "EXTRACTEDFROMFILE",
            EXISTING_RECIPIENT: "EXISTINGRECIPIENT",
            MANUALLY_ADDED: "MANUALLYADDED"
        },
        BULKWIRE_CATEGORY_FILTER: {
            TEMPLATES: "Templates",
            FILES: "Files",
            ALL: "All"
        },
        BULK_WIRE_TRANSFER_TYPE: {
            DOMESTIC: "domestic",
            INTERNATIONAL: "international"
        },
        CLIENT_PROPERTIES: {},
        SAVINGS_POT_TRANSACTION_RECURRENCE: {
            BIWEEKLY: "Biweekly",
            MONTHLY: "Monthly",
        },
        SAVINGS_POT_TYPE: {
            GOAL: "goal",
            BUDGET: "budget"
        },
        SAVING_POT_STATUS: {
            ON_TRACK: "On Track",
            NOT_ON_TRACK: "Not On Track",
            COMPLETED: "Completed",
            PARTIALLY_FUNDED: "Partially Funded",
            YET_TO_FUND: "Yet To Fund"
        },
        GUARANTEE_LC_STATUS: {
            SUBMITTED_TO_BANK: "Submitted to Bank",
            PROCESSING_WITH_BANK: "Processing with Bank",
            RETURNED_BY_BANK: "Returned by Bank",
            APPROVED: "Approved",
            REJECTED_BY_BANK: "Rejected By Bank",
            CANCELLED: "Cancelled",
            DRAFT: "Draft"
        },
        GUARANTEE_LC_PRODUCT_TYPE: {
            GUARANTEE: "Guarantee",
            STANDBY_LC: "Standby LC"
        },
        GUARANTEES_RECEIVED_CONSTANTS: {
            SUBMITTED_TO_BANK: "Submitted to Bank",
            PROCESSING_WITH_BANK: "Processing with Bank",
            RETURNED_BY_BANK: "Returned by Bank",
            REJECTED: "Rejected",
            APPROVED: "Approved",
            CLAIM_HONOURED: "Claim Honoured",
            CLAIM_EXTENDED: "Claim Extended",
            CLAIM_REJECTED: "Claim Rejected",
            NEW: "New",
            ACCEPTED: "Accepted",
            DRAFT: "Draft",
            REJECTED_BY_BANK: "Rejected by Bank",
        },
        RELEASE_LIABILITY_STATUS: {
            SUCCESS: "success",
            FAILURE: "failure",
        },
        CLAIMS_RECEIVED_STATUS: {
            NEW: "New",
            SUBMITTED_TO_BANK: "Submitted to Bank",
            PROCESSING_BY_BANK: "Processing by Bank",
            RETURNED_BY_BANK: "Returned by Bank",
            REJECTED: "Rejected",
            CLAIM_EXTENDED: "Claim Extended",
            CLAIM_HONOURED: "Claim Honoured",
            CLAIM_HONOURED_APPLICANT_REJECTED: "Claim Honoured (Applicant Rejected)",
            CLAIM_HONOURED_PENDING_CONSENT: "Claim Honoured (Pending Consent)"
        },
        INWARD_COLLECTIONS_STATUS: {
            NEW: "New",
            SUBMITTED_TO_BANK: "Submitted to Bank",
            PROCESSING_BY_BANK: "Processing by Bank",
            RETURNED_BY_BANK: "Returned by Bank",
			SETTLED: "Settled",
            REJECTED: "Rejected",
            APPROVED: "Approved",
            PAY_DUE: "Pay Due",
            OVERDUE: "OverDue",
            CANCELLED: "Cancelled",
			CANCELED: "Canceled"
        },
        INWARD_COLLECTION_AMENDMENTS_STATUS: {
            NEW: "New",
            SUBMITTED_TO_BANK: "Submitted to Bank",
            PROCESSING_BY_BANK: "Processing by Bank",
            RETURNED_BY_BANK: "Returned by Bank",
            REJECTED: "Rejected",
            APPROVED: "Approved",
			ACCEPT: "Accept",
        },
        INWARD_COLLECTION_AMENDMENTS_MATURITY_DATE_CONST: {
            LIMIT_ONE: 0,
            LIMIT_TWO: 3,
            LIMIT_THREE: 5
        },
        INWARD_COLLECTIONS_TENORTYPE: {
            SIGHT: "Sight",
            USANCE: "Usance"
        },
        OUTWARD_COLLECTION_AMENDMENTS_STATUS: {
            SUBMITTED_TO_BANK: "Submitted to Bank",
            PROCESSING_BY_BANK: "Processing by Bank",
            RETURNED_BY_BANK: "Returned by Bank",
            REJECTED: "Rejected",
            APPROVED: "Approved",         
        },
        GUARANTEE_AND_STANDBYLC_BILLTYPE: {
            PERFORMANCE: "Performance",
            BID: "BID",
            ADVANCE: "Advance",
            SHIPPING: "Shipping",
        },
		BILLS_STATUS: {
			DRAFT: "Draft",
			SUBMITTED_TO_BANK: "Submitted to Bank",
			PROCESSING_BY_BANK: "Processing by Bank",
			RETURNED_BY_BANK: "Returned by Bank",
			APPROVED: "Approved",
			SETTLED: "Settled",
			REJECTED: "Rejected",
			NEED_FINANCE: "Need Finance",
			FINANCED: "Financed",
			CANCELLED: "Cancelled"
		},
		BILLS_SORTBY: {
			UPDATED_ON: "updatedOn",
			BILL_NUMBER: "billNumber",
			BILL_DATE: "billDate"
		},
        'TRADE_FINANCE_PRODUCT': {
            'IMPORT_LC': 'Import LC',
            'IMPORT_DRAWING': 'Import Drawing',
            'IMPORT_AMENDMENT': 'Import Amendment',
            'EXPORT_LC': 'Export LC',
            'EXPORT_DRAWING': 'Export Drawing',
            'EXPORT_AMENDMENT': 'Export Amendment',
            'ISSUED_GT_AND_SBLC': 'Issued GT & SBLC',
            'ISSUED_GT_AND_SBLC_AMENDMENT': 'Issued GT & SBLC Amendment',
            'CLAIM_RECEIVED': 'Claim Received',
            'RECEIVED_GT_AND_SBLC': 'Received GT & SBLC',
            'RECEIVED_GT_AND_SBLC_AMENDMENT': 'Received GT & SBLC Amendment',
            'CLAIM_INITIATED': 'Claim Initiated',
            'INWARD_COLLECTION': 'Inward Collection',
            'INWARD_COLLECTION_AMENDMENT': 'Inward Collection Amendment',
            'OUTWARD_COLLECTION': 'Outward Collection',
            'OUTWARD_COLLECTION_AMENDMENT': 'Outward Collection Amendment'
        },
        'TRADE_FINANCE_QUICK_LINK': {
            'EXPORT_DRAWINGS': 'Export Drawings',
            'OUTWARD_COLLECTIONS': 'Outward Collections',
            'CLAIMS_INITIATED': 'Claims Initiated',
            'IMPORT_DRAWINGS': 'Import Drawings',
            'INWARD_COLLECTIONS': 'Inward Collections',
            'CLAIMS_RECEIVED': 'Claims Received',
            'IMPORT_LETTER_OF_CREDIT': 'Import Letter of Credit',
            'EXPORT_LETTER_OF_CREDIT': 'Export Letter of Credit',
            'ISSUED_GUARANTEE_AND_SBLC': 'Issued Guarantee & SBLC',
            'RECEIVED_GUARANTEE_AND_SBLC': 'Received Guarantee & SBLC'
        },
        'TRADE_FINANCE_NEED_ATTENTION': {
            'RETURNED_BY_BANK': 'Returned by Bank',
            'EIGHTY_PERCENT_UTILIZED_LIMITS': '80% Utilized Limits',
            'PENDING_CONSENTS': 'Pending Consents',
            'PENDING_CLOSURES': 'Pending Closures',
            'PENDING_DRAFTS': 'Pending Drafts',
            'RECENTLY_REJECTED': 'Recently Rejected',
            'RECENTLY_COMPLETED': 'Recently Completed'
        },
        'LC_PAYMENT_TERM': {
            'SIGHT': 'Sight',
            'ACCEPTANCE': 'Acceptance',
            'DEFERRED': 'Deferred',
            'NEGOTIATION_SIGHT': 'Negotiation Sight',
            'NEGOTIATION_ACCEPTANCE': 'Negotiation Acceptance'
        },
        'EXPORT_LC_STATUS': {
            'NEW': 'New',
            'SUBMITTED_TO_BANK': 'Submitted to Bank',
            'PROCESSING_BY_BANK': 'Processing by Bank',
            'RETURNED_BY_BANK': 'Returned by Bank',
            'REJECTED': 'Rejected',
            'APPROVED': 'Approved',
            'PARTIALLY_SETTLED': 'Partially Settled',
            'CLOSED': 'Closed',
            'CANCELLED': 'Cancelled'
        },
        'EXPORT_AMENDMENT_STATUS': {
            'NEW': 'New',
            'SUBMITTED_TO_BANK': 'Submitted to Bank',
            'PROCESSING_BY_BANK': 'Processing by Bank',
            'REJECTED': 'Rejected',
            'APPROVED': 'Approved'
        },
        'EXPORT_DRAWING_STATUS': {
            'DRAFT': 'Draft',
            'SUBMITTED_TO_BANK': 'Submitted to Bank',
            'PROCESSING_BY_BANK': 'Processing by Bank',
            'RETURNED_BY_BANK': 'Returned by Bank',
            'REJECTED': 'Rejected',
            'APPROVED': 'Approved',
            'SETTLED': 'Settled'
        },
        'IMPORT_LC_STATUS': {
            'DRAFT': 'Draft',
            'SUBMITTED_TO_BANK': 'Submitted to Bank',
            'PROCESSING_BY_BANK': 'Processing by Bank',
            'RETURNED_BY_BANK': 'Returned by Bank',
            'REJECTED': 'Rejected',
            'APPROVED': 'Approved',
            'PARTIALLY_SETTLED': 'Partially Settled',
            'CLOSED': 'Closed',
            'CANCELLED': 'Cancelled'
        },
        'IMPORT_AMENDMENT_STATUS': {
            'SUBMITTED_TO_BANK': 'Submitted to Bank',
            'PROCESSING_BY_BANK': 'Processing by Bank',
            'REJECTED': 'Rejected',
            'APPROVED': 'Approved'
        },
        'IMPORT_DRAWINGS_STATUS': {
            'NEW': 'New',
            'SUBMITTED_TO_BANK': 'Submitted to Bank',
            'PROCESSING_BY_BANK': 'Processing by Bank',
            'REJECTED': 'Rejected',
            'SETTLED': 'Settled'
        },
        'OUTWARD_COLLECTION_STATUS': {
            'DRAFT': 'Draft',
            'SUBMITTED_TO_BANK': 'Submitted to Bank',
            'PROCESSING_BY_BANK': 'Processing by Bank',
            'RETURNED_BY_BANK': 'Returned by Bank',
            'REJECTED': 'Rejected',
            'APPROVED': 'Approved',
            'OVERDUE': 'Overdue',
            'SETTLED': 'Settled',
            'CANCELLED': 'Cancelled'
        },
        SBA_ENROLMENT_STATUS_CONFIG: {
          ENABLED: 'Enabled',
          REVOKED: 'Revoked',
          CANCELED: 'Canceled',
          INPROGRESS: 'Inprogress',
          COMPLETED: 'Completed',
          RETRY: 'Retry'
        },
        SBA_FEATURES: {
            SBA_XAI_DASHBOARD: 'SBA_XAI_DASHBOARD',
            SBA_SIMULATION: 'SBA_SIMULATION',
            SBA_SIMULATION_EDIT: 'SBA_SIMULATION_EDIT',
            SBA_INSIGHTS: 'SBA_INSIGHTS',
            SBA_BUSINESS_HEALTH_SCORE: 'SBA_BUSINESS_HEALTH_SCORE',
            SBA_AID: 'SBA_AID',
            SBA_PAYABLES_VIEW : 'SBA_PAYABLES_VIEW',
            SBA_RECEVIABLES_VIEW : 'SBA_RECEVIABLES_VIEW',
            CASHFLOW_PREDICTION_CHART_VIEW: 'CASHFLOW_PREDICTION_CHART_VIEW',
            SBA_BUSINESS_HEALTH_SCORE_VIEW: 'SBA_BUSINESS_HEALTH_SCORE_VIEW',
            SBA_INSIGHTS_VIEW: 'SBA_INSIGHTS_VIEW',
            SBA_SIMULATION_VIEW: 'SBA_SIMULATION_VIEW'
        },
        SBA_ENROL_STATUS: {
            SBA_PENDING_AUTH: 'ConnectionStatus_PendingAuth',
            SBA_ILP_STARTED: 'ILP_Started',
            SBA_ILP_COMPLETE: 'ILP_Complete',
            SBA_DEAUTHORIZED: 'ConnectionStatus_Deauthorized',
        },
        APPROVALS_CONST_CONFIG: {
            MAX_TRANSACTION_LIMIT: 'Per Transaction',
            DAILY_LIMIT: 'Daily',
            WEEKLY_LIMIT: 'Weekly',
            NON_MONETARY_LIMIT: 'Non Monetary'
        },
        ALERT_CATEGORY_RETAIL:[
            "ALERT_CAT_SECURITY",
            "ALERT_CAT_TRANSACTIONAL",
            "ALERT_CAT_ACCOUNTS"
        ],
    };
    return OLB_CONSTANTS;
});
