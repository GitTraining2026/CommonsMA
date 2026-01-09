define(['PermissionHandler'], function (PermissionHandler) {
  var OR = PermissionHandler.OR;
  return {
    "frmWireTransfer": [
      {
        permission: OR("INTERNATIONAL_WIRE_TRANSFER_CREATE", "XYZ"),
        yes: "yes",
        no: "no"
      },
      {
        permission: "XYZ",
        yes: "yes",
        no: "no"
      }
    ],
    "frmFastTransfers": [
      {
        permission: "INTRA_BANK_FUND_TRANSFER_CREATE_RECEPIENT",
        yes: "showInternalAccFlx",
        no: "hideInternalAccFlx"
      },
      {
        permission: "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT",
        yes: "showExternalAccFlx",
        no: "hideExternalAccFlx"
      },
      {
        permission: "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT",
        yes: "showInternationalAccFlx",
        no: "hideInternationalAccFlx"
      },
      {
        permission: ["P2P_VIEW", "P2P_CREATE_RECEPIENT"],
        yes: "showP2PAccFlx",
        no: "hideP2PAccFlx"
      }
    ],
    "frmFastManagePayee": [
      {
        permission: "INTRA_BANK_FUND_TRANSFER_CREATE_RECEPIENT",
        yes: "showInternalAccFlx",
        no: "hideInternalAccFlx"
      },
      {
        permission: "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT",
        yes: "showExternalAccFlx",
        no: "hideExternalAccFlx"
      },
      {
        permission: "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT",
        yes: "showInternationalAccFlx",
        no: "hideInternationalAccFlx"
      },
      {
        permission: "P2P_VIEW",
        yes: "showP2PAccFlx",
        no: "hideP2PAccFlx"
      },
      {
        permission: ["P2P_VIEW", "P2P_CREATE_RECEPIENT"],
        yes: "showAddP2PFlx",
        no: "hideAddP2PFlx"
      },
      {
        permission: ["P2P_VIEW", "P2P_MANAGE_SETTINGS"],
        yes: "showP2PManageSettingFlx",
        no: "hideP2PManageSettingFlx"
      },
      {
        permission: ["P2P_VIEW", "P2P_DEACTIVATE"],
        yes: "showP2PDeactivateFlx",
        no: "hideP2PDeactivateFlx"
      }
    ],
	"frmPastPaymentsNew": [
      {
        permission: "INTRA_BANK_FUND_TRANSFER_CREATE_RECEPIENT",
        yes: "showInternalAccFlx",
        no: "hideInternalAccFlx"
      },
      {
        permission: "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT",
        yes: "showExternalAccFlx",
        no: "hideExternalAccFlx"
      },
      {
        permission: "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT",
        yes: "showInternationalAccFlx",
        no: "hideInternationalAccFlx"
      },
      {
        permission: ["P2P_VIEW", "P2P_CREATE_RECEPIENT"],
        yes: "showP2PAccFlx",
        no: "hideP2PAccFlx"
      }
    ],
    "frmScheduledPaymentsNew": [
      {
        permission: "INTRA_BANK_FUND_TRANSFER_CREATE_RECEPIENT",
        yes: "showInternalAccFlx",
        no: "hideInternalAccFlx"
      },
      {
        permission: "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT",
        yes: "showExternalAccFlx",
        no: "hideExternalAccFlx"
      },
      {
        permission: "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT",
        yes: "showInternationalAccFlx",
        no: "hideInternationalAccFlx"
      },
      {
        permission: ["P2P_VIEW", "P2P_CREATE_RECEPIENT"],
        yes: "showP2PAccFlx",
        no: "hideP2PAccFlx"
      }
    ],
    "frmDirectDebits": [
      {
        permission: "INTRA_BANK_FUND_TRANSFER_CREATE_RECEPIENT",
        yes: "showInternalAccFlx",
        no: "hideInternalAccFlx"
      },
      {
        permission: "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT",
        yes: "showExternalAccFlx",
        no: "hideExternalAccFlx"
      },
      {
        permission: "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT",
        yes: "showInternationalAccFlx",
        no: "hideInternationalAccFlx"
      },
      {
        permission: ["P2P_VIEW", "P2P_CREATE_RECEPIENT"],
        yes: "showP2PAccFlx",
        no: "hideP2PAccFlx"
      }
    ],
    "frmFastTransfersActivites": [
      {
        permission: "INTRA_BANK_FUND_TRANSFER_CREATE_RECEPIENT",
        yes: "showInternalAccFlx",
        no: "hideInternalAccFlx"
      },
      {
        permission: "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT",
        yes: "showExternalAccFlx",
        no: "hideExternalAccFlx"
      },
      {
        permission: "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT",
        yes: "showInternationalAccFlx",
        no: "hideInternationalAccFlx"
      },
      {
        permission: ["P2P_VIEW", "P2P_CREATE_RECEPIENT"],
        yes: "showP2PAccFlx",
        no: "hideP2PAccFlx"
      }
    ],
    "frmFastAddExternalAccount": [
      {
        permission: "INTRA_BANK_FUND_TRANSFER_CREATE_RECEPIENT",
        yes: "showInternalAccFlx",
        no: "hideInternalAccFlx"
      },
      {
        permission: "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT",
        yes: "showInternationalAccFlx",
        no: "hideInternationalAccFlx"
      },
      {
        permission: ["P2P_VIEW", "P2P_CREATE_RECEPIENT"],
        yes: "showP2PAccFlx",
        no: "hideP2PAccFlx"
      }
    ],
    "frmFastAddInternationalAccount": [
      {
        permission: "INTRA_BANK_FUND_TRANSFER_CREATE_RECEPIENT",
        yes: "showInternalAccFlx",
        no: "hideInternalAccFlx"
      },
      {
        permission: "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT",
        yes: "showExternalAccFlx",
        no: "hideExternalAccFlx"
      },
      {
        permission: ["P2P_VIEW", "P2P_CREATE_RECEPIENT"],
        yes: "showP2PAccFlx",
        no: "hideP2PAccFlx"
      }
    ],
    "frmFastAddDBXAccount": [
      {
        permission: "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT",
        yes: "showExternalAccFlx",
        no: "hideExternalAccFlx"
      },
      {
        permission: ["P2P_VIEW", "P2P_CREATE_RECEPIENT"],
        yes: "showP2PAccFlx",
        no: "hideP2PAccFlx"
      },
      {
        permission: "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT",
        yes: "showInternationalAccFlx",
        no: "hideInternationalAccFlx"
      },
    ],
    "frmFastAddRecipient": [
      {
        permission: "INTRA_BANK_FUND_TRANSFER_CREATE_RECEPIENT",
        yes: "showInternalAccFlx",
        no: "hideInternalAccFlx"
      },
      {
        permission: "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT",
        yes: "showExternalAccFlx",
        no: "hideExternalAccFlx"
      },
      {
        permission: "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT",
        yes: "showInternationalAccFlx",
        no: "hideInternationalAccFlx"
      },
      {
        permission: ["P2P_VIEW", "P2P_MANAGE_SETTINGS"],
        yes: "showP2PManageSettingFlx",
        no: "hideP2PManageSettingFlx"
      },
      {
        permission: ["P2P_VIEW", "P2P_DEACTIVATE"],
        yes: "showP2PDeactivateFlx",
        no: "hideP2PDeactivateFlx"
      }
    ],
    "frmFastRecipientGateWay": [
      {
        permission: "INTRA_BANK_FUND_TRANSFER_CREATE_RECEPIENT",
        yes: "showInternalAccFlx",
        no: "hideInternalAccFlx"
      },
      {
        permission: "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT",
        yes: "showExternalAccFlx",
        no: "hideExternalAccFlx"
      },
      {
        permission: "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT",
        yes: "showInternationalAccFlx",
        no: "hideInternationalAccFlx"
      }
    ],
    "frmWireTransferAddKonyAccountStep1": [
      {
        permission: "INTERNATIONAL_WIRE_TRANSFER_CREATE_RECEPIENT",
        yes: "showInternationalTab",
        no: "hideInternationalTab"
      },
    ],
    "frmWireTransferAddKonyAccountStep2": [
      {
        permission: "INTERNATIONAL_WIRE_TRANSFER_CREATE_RECEPIENT",
        yes: "showInternationalTab",
        no: "hideInternationalTab"
      },
    ],
    "frmWireTransferAddInternationalAccountStep1": [
      {
        permission: "DOMESTIC_WIRE_TRANSFER_CREATE_RECEPIENT",
        yes: "showDomesticTab",
        no: "hideDomesticTab"
      },
    ],
    "frmWireTransferAddInternationalAccountStep2": [
      {
        permission: "DOMESTIC_WIRE_TRANSFER_CREATE_RECEPIENT",
        yes: "showDomesticTab",
        no: "hideDomesticTab"
      },
    ],
    "frmWireTransfersManageRecipients": [
      {
        permission: OR("INTERNATIONAL_WIRE_TRANSFER_CREATE", "DOMESTIC_WIRE_TRANSFER_CREATE"),
        yes: "showMakeTransferTab",
        no: "hideMakeTransferTab"
      },
      {
        permission: OR("INTERNATIONAL_WIRE_TRANSFER_CREATE", "DOMESTIC_WIRE_TRANSFER_CREATE", "INTERNATIONAL_WIRE_TRANSFER_VIEW", "DOMESTIC_WIRE_TRANSFER_VIEW"),
        yes: "showRecentTab",
        no: "hideRecentTab"
      },
      {
        permission: OR("INTERNATIONAL_WIRE_TRANSFER_VIEW", "DOMESTIC_WIRE_TRANSFER_VIEW", "INTERNATIONAL_WIRE_TRANSFER_CREATE", "DOMESTIC_WIRE_TRANSFER_CREATE"),
        yes: "showManageTab",
        no: "hideManageTab"
      },
      {
        permission: OR("INTERNATIONAL_WIRE_TRANSFER_CREATE_RECEPIENT", "DOMESTIC_WIRE_TRANSFER_CREATE_RECEPIENT"),
        yes: "showAddRecipientButton",
        no: "hideAddRecipientButton"
      },
      {
        permission: OR("INTERNATIONAL_WIRE_TRANSFER_CREATE", "DOMESTIC_WIRE_TRANSFER_CREATE"),
        yes: "showOneTimeTransferButton",
        no: "hideOneTimeTransferButton"
      }
    ],
    "frmWireTransfersRecent": [
      {
        permission: OR("INTERNATIONAL_WIRE_TRANSFER_CREATE", "DOMESTIC_WIRE_TRANSFER_CREATE"),
        yes: "showMakeTransferTab",
        no: "hideMakeTransferTab"
      },
      {
        permission: OR("INTERNATIONAL_WIRE_TRANSFER_CREATE", "DOMESTIC_WIRE_TRANSFER_CREATE"),
        yes: "showMakeTransferButton",
        no: "hideMakeTransferButton"
      },
      {
        permission: OR("INTERNATIONAL_WIRE_TRANSFER_CREATE", "DOMESTIC_WIRE_TRANSFER_CREATE", "INTERNATIONAL_WIRE_TRANSFER_VIEW", "DOMESTIC_WIRE_TRANSFER_VIEW"),
        yes: "showRecentTab",
        no: "hideRecentTab"
      },
      {
        permission: OR("INTERNATIONAL_WIRE_TRANSFER_VIEW", "DOMESTIC_WIRE_TRANSFER_VIEW", "INTERNATIONAL_WIRE_TRANSFER_CREATE", "DOMESTIC_WIRE_TRANSFER_CREATE"),
        yes: "showManageTab",
        no: "hideManageTab"
      }
    ],
    "frmWireTransfersWindow": [
      {
        permission: OR("INTERNATIONAL_WIRE_TRANSFER_CREATE", "DOMESTIC_WIRE_TRANSFER_CREATE"),
        yes: "showMakeTransferTab",
        no: "hideMakeTransferTab"
      },
      {
        permission: OR("INTERNATIONAL_WIRE_TRANSFER_CREATE", "DOMESTIC_WIRE_TRANSFER_CREATE", "INTERNATIONAL_WIRE_TRANSFER_VIEW", "DOMESTIC_WIRE_TRANSFER_VIEW"),
        yes: "showRecentTab",
        no: "hideRecentTab"
      },
      {
        permission: OR("INTERNATIONAL_WIRE_TRANSFER_VIEW", "DOMESTIC_WIRE_TRANSFER_VIEW", "INTERNATIONAL_WIRE_TRANSFER_CREATE", "DOMESTIC_WIRE_TRANSFER_CREATE"),
        yes: "showManageTab",
        no: "hideManageTab"
      },
      {
        permission: OR("INTERNATIONAL_WIRE_TRANSFER_CREATE_RECEPIENT", "DOMESTIC_WIRE_TRANSFER_CREATE_RECEPIENT"),
        yes: "showAddRecipientButton",
        no: "hideAddRecipientButton"
      },
      {
        permission: OR("INTERNATIONAL_WIRE_TRANSFER_CREATE", "DOMESTIC_WIRE_TRANSFER_CREATE"),
        yes: "showOneTimeTransferButton",
        no: "hideOneTimeTransferButton"
      }
    ],
    "frmAccountsLanding": [
      {
        permission: "STOP_PAYMENT_REQUEST_CREATE",
        yes: "addStopCheckAction",
        no: "removeStopCheckAction"
      },
      {
        permission: "VIEW_CHEQUES_VIEW",
        yes: "addCheckBookRequestAction",
        no: "removeViewChequeAction"
      },
      {
        permission: "CHEQUE_BOOK_REQUEST_CREATE",
        yes: "viewMyChequesAction",
        no: "removeChequeRequestAction"
      }
    ],
    "frmCardManagement": [
      {
        permission: "NOTIFICATION_DELETE",
        yes: "doNotRemoveActions",
        no: "removeActionDelete"
      },
      {
        permission: "CARD_MANAGEMENT_LOCK_CARD",
        yes: "doNotRemoveActions",
        no: "removeActionLockCard"
      },
      {
        permission: "CARD_MANAGEMENT_REPLACE_CARD",
        yes: "doNotRemoveActions",
        no: "removeActionReplaceCard"
      },
      {
        permission: "CARD_MANAGEMENT_REPORT_CARD_STOLEN",
        yes: "doNotRemoveActions",
        no: "removeActionReportLost"
      },
      {
        permission: "CARD_MANAGEMENT_CHANGE_PIN",
        yes: "doNotRemoveActions",
        no: "removeActionChangePin"
      },
      {
        permission: "CARD_MANAGEMENT_CANCEL_CARD",
        yes: "doNotRemoveActions",
        no: "removeActionCancelCard"
      },
      {
        permission: "CARD_MANAGEMENT_UNLOCK_CARD",
        yes: "doNotRemoveActions",
        no: "removeActionUnlockCard"
      },
      {
        key: "updateTravelNotifications",
        permission: "NOTIFICATION_UPDATE",
        yes: "doNotRemoveActions",
        no: "removeActionUpdate"
      },
      {
        permission: "NOTIFICATION_VIEW",
        yes: "doNotRemoveActions",
        no: "hideManageTravelPlans"
      },
      {
        key: "applyForNewCards",
        permission: "CARD_MANAGEMENT_CREATE_CARD_REQUEST",
        yes: "checkForNAOPermission",
        no: "removeActionApplyForNewCards"
      }
    ],
    "frmBillPayScheduled": [
      {
        permission: "BILL_PAY_CREATE",
        yes: "showAllCreatePayeeOptions",
        no: "hideAllCreatePayeeOptions"
      },
      {
        permission: "BILL_PAY_CREATE_PAYEES",
        yes: "showAddPayeeOption",
        no: "hideAddPayeeOption"
      },
      {
        permission: "BILL_PAY_VIEW_PAYEES",
        yes: "showManagePayeeOption",
        no: "hideManagePayeeOption"
      },
      {
        permission: OR("BILL_PAY_CREATE", "BILL_PAY_VIEW_PAYEES"),
        yes: "showHistoryOption",
        no: "hideHistoryOption"

      }
    ],
    "frmTransfersGateway": [
      {
        permission: "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT",
        yes: "showAddInterBankRecipientOption",
        no: "hideAddInterBankRecipientOption"
      },
      {
        permission: "INTRA_BANK_FUND_TRANSFER_CREATE_RECEPIENT",
        yes: "showAddIntraBankRecipientOption",
        no: "hideAddIntraBankRecipientOption"
      },
      {
        permission: "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT",
        yes: "showAddInternationalBankRecipientOption",
        no: "hideAddInternationalBankRecipientOption"
      }
    ],
    "frmBillPayHistory": [
      {
        permission: "BILL_PAY_CREATE",
        yes: "showAllCreatePayeeOptions",
        no: "hideAllCreatePayeeOptions"
      },
      {
        permission: "BILL_PAY_CREATE_PAYEES",
        yes: "showAddPayeeOption",
        no: "hideAddPayeeOption"
      },
      {
        permission: "BILL_PAY_VIEW_PAYEES",
        yes: "showManagePayeeOption",
        no: "hideManagePayeeOption"
      },
      {
        permission: OR("BILL_PAY_CREATE", "BILL_PAY_VIEW_PAYEES"),
        yes: "showHistoryOption",
        no: "hideHistoryOption"

      }
    ],
    "frmBillPaymentDue": [
      {
        permission: "BILL_PAY_CREATE",
        yes: "showAllCreatePayeeOptions",
        no: "hideAllCreatePayeeOptions"
      },
      {
        permission: "BILL_PAY_CREATE_PAYEES",
        yes: "showAddPayeeOption",
        no: "hideAddPayeeOption"
      },
      {
        permission: "BILL_PAY_VIEW_PAYEES",
        yes: "showManagePayeeOption",
        no: "hideManagePayeeOption"
      },
      {
        permission: OR("BILL_PAY_CREATE", "BILL_PAY_VIEW_PAYEES"),
        yes: "showHistoryOption",
        no: "hideHistoryOption"

      }
    ],
    "frmBulkPayees": [
      {
        permission: "BILL_PAY_CREATE",
        yes: "showAllCreatePayeeOptions",
        no: "hideAllCreatePayeeOptions"
      },
      {
        permission: "BILL_PAY_CREATE_PAYEES",
        yes: "showAddPayeeOption",
        no: "hideAddPayeeOption"
      },
      {
        permission: "BILL_PAY_VIEW_PAYEES",
        yes: "showManagePayeeOption",
        no: "hideManagePayeeOption"
      },
      {
        permission: OR("BILL_PAY_CREATE", "BILL_PAY_VIEW_PAYEES"),
        yes: "showHistoryOption",
        no: "hideHistoryOption"

      }
    ],
    "frmManagePayees": [
      {
        permission: "BILL_PAY_CREATE",
        yes: "showAllCreatePayeeOptions",
        no: "hideAllCreatePayeeOptions"
      },
      {
        permission: "BILL_PAY_CREATE_PAYEES",
        yes: "showAddPayeeOption",
        no: "hideAddPayeeOption"
      },
      {
        permission: OR("BILL_PAY_CREATE", "BILL_PAY_VIEW_PAYEES"),
        yes: "showHistoryOption",
        no: "hideHistoryOption"
      }
    ],
    "frmAddPayee1": [
      {
        permission: OR("BILL_PAY_CREATE", "BILL_PAY_VIEW_PAYEES"),
        yes: "showHistoryOption",
        no: "hideHistoryOption"

      }
    ],
    "frmAddPayeeInformation": [
      {
        permission: OR("BILL_PAY_CREATE", "BILL_PAY_VIEW_PAYEES"),
        yes: "showHistoryOption",
        no: "hideHistoryOption"

      }
    ],
    "frmPayeeAcknowledgement": [
      {
        permission: "BILL_PAY_CREATE",
        yes: "showBillPaymentOption",
        no: "hideBillPaymentOption"
      }
    ],
    "frmMakeOneTimePayee": [
      {
        permission: OR("BILL_PAY_CREATE", "BILL_PAY_VIEW_PAYEES"),
        yes: "showHistoryOption",
        no: "hideHistoryOption"

      }
    ],
    "frmBillPayActivationNotEligible": [
      {
        permission: "OPEN_NEW_ACCOUNT",
        yes: "showOpenNewAccountOption",
        no: "hideOpenNewAccountOption"

      }
    ],
    "frmMakeOneTimePayment": [
      {
        permission: "BILL_PAY_CREATE_PAYEES",
        yes: "showAddPayeeOption",
        no: "hideAddPayeeOption"
      },
      {
        permission: "BILL_PAY_CREATE",
        yes: "showMakePaymentOption",
        no: "hideMakePaymentOption"
      }
    ],
    "frmOneTimePaymentAcknowledgement": [
      {
        permission: OR("BILL_PAY_CREATE", "BILL_PAY_VIEW_PAYEES"),
        yes: "showHistoryOption",
        no: "hideHistoryOption"
      },
      {
        permission: OR("BILL_PAY_CREATE_PAYEES"),
        yes: "showSavePayeeOption",
        no: "hideSavePayeeOption"
      }
    ],
    "frmPayABill": [
      {
        permission: "BILL_PAY_CREATE_PAYEES",
        yes: "showAddPayeeOption",
        no: "hideAddPayeeOption"
      }
    ],
    "frmPaymentActivity": [
      {
        permission: "BILL_PAY_CREATE_PAYEES",
        yes: "showAddPayeeOption",
        no: "hideAddPayeeOption"
      },
      {
        permission: "BILL_PAY_CREATE",
        yes: "showOneTimePaymentOption",
        no: "hideOneTimePaymentOption"
      },
    ],
    "frmStopPayments": [
      {
        key: "addNewStopCheckRequest",
        permission: "STOP_PAYMENT_REQUEST_CREATE",
        yes: "checkForAddStopCheckRequestPermission",
        no: "removeNewStopCheckRequestButton"
      },
      {
        key: "addStopCheckRequestPermission",
        permission: "STOP_PAYMENT_REQUEST_CREATE",
        yes: "dontRemoveActions",
        no: "removeNewStopCheckRequestButton"
      },
      {
        permission: "DISPUTE_TRANSACTIONS_VIEW",
        yes: "dontRemoveActions",
        no: "removeViewDisputedTransactionsButton"
      },
      {
        permission: "STOP_PAYMENT_REQUEST_VIEW",
        yes: "dontRemoveActions",
        no: "removeViewStopCheckRequestsButton"
      }
    ],
    "frmBillPayActivationAcknowledgement": [
      {
        permission: "BILL_PAY_CREATE_PAYEES",
        yes: "showAddPayeeOption",
        no: "hideAddPayeeOption"
      },
      {
        permission: "BILL_PAY_CREATE",
        yes: "showOneTimePaymentOption",
        no: "hideOneTimePaymentOption"
      },
    ],
    "frmManageBeneficiaries":[
       {
        permission: OR("INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT",
                       "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT",
                       "INTRA_BANK_FUND_TRANSFER_CREATE_RECEPIENT"),
                       
        yes: "showAddBeneficiaryFlx",
        no: "hideAddBeneficiaryFlx"
      },
      {
        permission: "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_DELETE_RECEPIENT",
        yes: "showInternational",
        no: "hideInternational"
      },
      {
        permission: "INTER_BANK_ACCOUNT_FUND_TRANSFER_DELETE_RECEPIENT",
        yes: "showInter",
        no: "hideInter"
      },
      {
        permission: "INTRA_BANK_FUND_TRANSFER_DELETE_RECEPIENT" ,
        yes: "showIntra",
        no: "hideIntra"
      }
    ],
    "frmAddBeneficiaryEuro":[
      {
        permission: "INTRA_BANK_FUND_TRANSFER_CREATE_RECEPIENT",
        yes: "enableSamebankoption",
        no: "disableSamebankoption"
      },
      {
        permission: "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT",
        yes: "enableOtherbankoption",
        no: "disableOtherbankoption"
      },
      {
        permission:  "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT",
        yes: "InternationalPermssion",
        no: "NoInternationalPermssion"
      }
    ],
    "frmPastPaymentsEur":[
      {
        permission: OR("INTER_BANK_ACCOUNT_FUND_TRANSFER_VIEW_RECEPIENT",
                       "INTRA_BANK_FUND_TRANSFER_VIEW_RECEPIENT",
                       "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_VIEW_RECEPIENT"
                      ),
        yes: "showManageBeneficiaryFlx",
        no: "hideManageBeneficiaryFlx"
      },
      {
        permission: OR("INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE",
                       "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE",
                       "INTRA_BANK_FUND_TRANSFER_CREATE"),
        yes: "showNewPayment",
        no: "hideNewPayment"
      }
    ],
    "frmScheduledPaymentsEur":[
      {
        permission: OR("INTER_BANK_ACCOUNT_FUND_TRANSFER_VIEW_RECEPIENT",
                       "INTRA_BANK_FUND_TRANSFER_VIEW_RECEPIENT",
                       "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_VIEW_RECEPIENT"
                      ),
        yes: "showManageBeneficiaryFlx",
        no: "hideManageBeneficiaryFlx"
      },
      {
        permission: OR("INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE",
                       "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE",
                       "INTRA_BANK_FUND_TRANSFER_CREATE"),
        yes: "showNewPayment",
        no: "hideNewPayment"
      }
    ],
    "frmMakePayment": [ 
      {
        permission: OR("INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE",
        "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE",
        "INTRA_BANK_FUND_TRANSFER_CREATE"),
        yes: "showNewPayment",
        no: "hideNewPayment"
      },
      {
        permission: OR("TRANSFER_BETWEEN_OWN_ACCOUNT_VIEW",
        "INTRA_BANK_FUND_TRANSFER_VIEW",
        "INTER_BANK_ACCOUNT_FUND_TRANSFER_VIEW",
        "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_VIEW"),
        yes: "showPaymentActivities",
        no: "hidePaymentActivities"
      },
      {
        permission: OR("INTER_BANK_ACCOUNT_FUND_TRANSFER_VIEW_RECEPIENT",
        "INTRA_BANK_FUND_TRANSFER_VIEW_RECEPIENT",
        "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_VIEW_RECEPIENT"
        ),
        yes: "showManageBeneficiaries",
        no: "hideManageBeneficiaries"
      }
    ],
    "frmBulkBeneficiariesLanding":[
      {
        permission: OR("INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT",
                       "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT",
                       "INTRA_BANK_FUND_TRANSFER_CREATE_RECEPIENT"),

        yes: "showAddBeneficiaryFlx",
        no: "hideAddBeneficiaryFlx"
      },
    ],
    "frmBulkBeneficiariesSelected":[
      {
        permission: OR("INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT",
                       "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT",
                       "INTRA_BANK_FUND_TRANSFER_CREATE_RECEPIENT"),

        yes: "showAddBeneficiaryFlx",
        no: "hideAddBeneficiaryFlx"
      },
    ],
    "frmUTFSameBankTransfer":[
      {
        permission: OR("INTRA_BANK_FUND_TRANSFER_CREATE", "TRANSFER_BETWEEN_OWN_ACCOUNT_CREATE"),
        yes: "showSameBankTransferOption",
        no: "hideSameBankTransferOption"
      },
      {
        permission: "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE",
        yes: "showDomesticTransferOption",
        no: "hideDomesticTransferOption"
      },
      {
        permission:  "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE",
        yes: "showInternationalTransferOption",
        no: "hideInternationalTransferOption"
      },
      {
        permission: "P2P_CREATE",
        yes: "showP2PTransferOption",
        no: "hideP2PTransferOption"
      }
    ],
    "frmUTFDomesticTransfer":[
      {
        permission: OR("INTRA_BANK_FUND_TRANSFER_CREATE", "TRANSFER_BETWEEN_OWN_ACCOUNT_CREATE"),
        yes: "showSameBankTransferOption",
        no: "hideSameBankTransferOption"
      },
      {
        permission: "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE",
        yes: "showDomesticTransferOption",
        no: "hideDomesticTransferOption"
      },
      {
        permission:  "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE",
        yes: "showInternationalTransferOption",
        no: "hideInternationalTransferOption"
      },
      {
        permission: "P2P_CREATE",
        yes: "showP2PTransferOption",
        no: "hideP2PTransferOption"
      }
    ],
    "frmUTFInternationalTransfer":[
      {
        permission: OR("INTRA_BANK_FUND_TRANSFER_CREATE", "TRANSFER_BETWEEN_OWN_ACCOUNT_CREATE"),
        yes: "showSameBankTransferOption",
        no: "hideSameBankTransferOption"
      },
      {
        permission: "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE",
        yes: "showDomesticTransferOption",
        no: "hideDomesticTransferOption"
      },
      {
        permission:  "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE",
        yes: "showInternationalTransferOption",
        no: "hideInternationalTransferOption"
      },
      {
        permission: "P2P_CREATE",
        yes: "showP2PTransferOption",
        no: "hideP2PTransferOption"
      }
    ],
    "frmUTFP2PTransfer":[
      {
        permission: OR("INTRA_BANK_FUND_TRANSFER_CREATE", "TRANSFER_BETWEEN_OWN_ACCOUNT_CREATE"),
        yes: "showSameBankTransferOption",
        no: "hideSameBankTransferOption"
      },
      {
        permission: "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE",
        yes: "showDomesticTransferOption",
        no: "hideDomesticTransferOption"
      },
      {
        permission:  "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE",
        yes: "showInternationalTransferOption",
        no: "hideInternationalTransferOption"
      },
      {
        permission: "P2P_CREATE",
        yes: "showP2PTransferOption",
        no: "hideP2PTransferOption"
      }
    ],
    "frmPayaPersonAddBeneficiary":[
      {
        permission: "INTRA_BANK_FUND_TRANSFER_CREATE_RECEPIENT", 
        yes: "showSameBankCreateOption",
        no: "hideSameBankCreateOption"
      },
      {
        permission: "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT",
        yes: "showDomesticCreateOption",
        no: "hideDomesticCreateOption"
      },
      {
        permission:  "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE",
        yes: "showInternationalCreateOption",
        no: "hideInternationalCreateOption"
      },
      {
        permission: "P2P_CREATE",
        yes: "showP2PCreateOption",
        no: "hideP2PCreateOption"
      }
    ]
  };
});



