/**
 * Called to show the My Account view.
 */
function showMyAccount() {

  if (tabsButtonsEnabled) {
    showPleaseWait();
    new Ajax.Updater("mainContent", "accountRetrieve.action", {
      method : "post",
      onSuccess : function(resp) {
        currentView = "myAccount";
        setupSidebarButtons();
        hidePleaseWait();
      },
      onFailure : ajaxError
    });
  }

} // End showMyAccount().


/**
 * Function called to save an updated account.
 */
function accountUpdate(inForm) {

  if (tabsButtonsEnabled) {
    showPleaseWait();
    new Ajax.Updater("mainContent", "accountUpdateSave.action", {
      method : "post",
      postBody : Form.serialize(inForm),
      onSuccess : function(resp) {
        setupSidebarButtons();
        hidePleaseWait();
      },
      onFailure : ajaxError
    });
  }

} // End accountUpdate().


/**
 * Function called to delete an existing account.
 */
function accountDelete(inForm) {

  if (tabsButtonsEnabled) {
    showPleaseWait();
    new Ajax.Updater("mainContent", "accountDelete.action", {
      method : "post",
      postBody : Form.serialize(inForm),
      onSuccess : function(resp) {
        setupSidebarButtons();
        hidePleaseWait();
      },
      onFailure : ajaxError
    });
  }

} // End accountDelete().