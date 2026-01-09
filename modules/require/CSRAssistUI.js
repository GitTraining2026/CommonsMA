define(['CommonUtilities'], function(CommonUtilities) {
    /**
     *Method to configure csr assist mode.
     *@member of {CSRAssistUI}
     *@params{scope,formname} : scope is scope of the current form , formname is name of the form
     *@return{}
     *@throws{}  
     */
    var _setCSRAssistConfigurations = function(scope, formname) {
        switch (formname) {
            case "frmConfirmAccount":
                scope.view.confirmDialogAccounts.confirmButtons.btnConfirm.onClick = CommonUtilities.disableButtonActionForCSRMode();
                scope.view.confirmDialogAccounts.confirmButtons.btnConfirm.skin = CommonUtilities.disableButtonSkinForCSRMode();
                scope.view.confirmDialogAccounts.confirmButtons.btnConfirm.focusSkin = CommonUtilities.disableButtonSkinForCSRMode();
                scope.view.confirmDialogAccounts.confirmButtons.btnConfirm.hoverSkin = CommonUtilities.disableButtonSkinForCSRMode();
                break;
            case "frmAddPayee":
                scope.view.btnConfirm.onClick = CommonUtilities.disableButtonActionForCSRMode();
                scope.view.btnConfirm.skin = CommonUtilities.disableButtonSkinForCSRMode();
                scope.view.btnConfirm.focusSkin = CommonUtilities.disableButtonSkinForCSRMode();
                break;
            case "frmPayAPerson":
                scope.view.confirmation.confirmButtons.btnConfirm.onClick = CommonUtilities.disableButtonActionForCSRMode();
                scope.view.confirmation.confirmButtons.btnConfirm.skin = CommonUtilities.disableButtonSkinForCSRMode();
                scope.view.confirmation.confirmButtons.btnConfirm.focusSkin = CommonUtilities.disableButtonSkinForCSRMode();
                break;
            case "frmNotificationsAndMessages":
                scope.view.NotficationsAndMessages.btnDelete.onClick = CommonUtilities.disableButtonActionForCSRMode();
                scope.view.NotficationsAndMessages.btnDelete.skin = CommonUtilities.disableSegmentButtonSkinForCSRMode(13);
                scope.view.NotficationsAndMessages.btnNewMessage.onClick = CommonUtilities.disableButtonActionForCSRMode();
                scope.view.NotficationsAndMessages.btnNewMessage.skin = CommonUtilities.disableSegmentButtonSkinForCSRMode(15);
                break;
        }
    };
    return {
        setCSRAssistConfigurations: _setCSRAssistConfigurations
    };
});