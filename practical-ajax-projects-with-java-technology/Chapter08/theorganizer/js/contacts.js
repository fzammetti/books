/**
 * Called to show the Contacts view.
 */
function showContacts() {

  if (tabsButtonsEnabled) {
    showPleaseWait();
    new Ajax.Updater("mainContent", "contactList.action", {
      method : "post",
      onSuccess : function(resp) {
        currentView = "contacts";
        setupSidebarButtons("newContact");
        hidePleaseWait();
      },
      onFailure : ajaxError
    });
  }

} // End showContacts().


/**
 * Called to show the view for creating a new contact.
 */
function doNewContact() {

  if (tabsButtonsEnabled) {
    showPleaseWait();
    new Ajax.Updater("mainContent", "contactCreateShow.action", {
      method : "post",
      onSuccess : function(resp) {
        setupSidebarButtons("newContact");
        hidePleaseWait();
      },
      onFailure : ajaxError
    });
  }

} // End doNewContact().


/**
 * Function called to create a new contact.
 */
function contactCreate(inForm) {

  if (tabsButtonsEnabled) {
    if (validateContact(inForm)) {
      showPleaseWait();
      new Ajax.Updater("mainContent", "contactCreate.action", {
        method : "post",
        postBody : Form.serialize(inForm),
        onSuccess : function(resp) {
          setupSidebarButtons("newContact");
          hidePleaseWait();
        },
        onFailure : ajaxError
      });
    }
  }

} // End contactCreate().


/**
 * Function called to retrieve an existing contact for editing.
 */
function contactRetrieve(inForm) {

  if (tabsButtonsEnabled) {
    showPleaseWait();
    new Ajax.Updater("mainContent", "contactRetrieve.action", {
      method : "post",
      postBody : Form.serialize(inForm),
      onSuccess : function(resp) {
        setupSidebarButtons("newContact");
        hidePleaseWait();
      },
      onFailure : ajaxError
    });
  }

} // End contactRetrieve().


/**
 * Function called to save an updated contact.
 */
function contactUpdate(inForm) {

  if (tabsButtonsEnabled) {
    if (validateContact(inForm)) {
      showPleaseWait();
      new Ajax.Updater("mainContent", "contactUpdate.action", {
        method : "post",
        postBody : Form.serialize(inForm),
        onSuccess : function(resp) {
          setupSidebarButtons("newContact");
        hidePleaseWait();
        },
        onFailure : ajaxError
      });
    }
  }

} // End contactUpdate().


/**
 * Function called to delete an existing contact.
 */
function contactDelete(inForm) {

  if (tabsButtonsEnabled) {
    showPleaseWait();
    new Ajax.Updater("mainContent", "contactDelete.action", {
      method : "post",
      postBody : Form.serialize(inForm),
      onSuccess : function(resp) {
        setupSidebarButtons("newContact");
        hidePleaseWait();
      },
      onFailure : ajaxError
    });
  }

} // End contactDelete().


/**
 * This function is called when a contact is being saved (created or updated) to
 * validate user input.
 */
function validateContact(inForm) {

  if (inForm.firstName.value == "") {
    alert("You must enter a first name");
    inForm.firstName.focus();
    return false;
  }
  if (inForm.lastName.value == "") {
    alert("You must enter a last name");
    inForm.lastName.focus();
    return false;
  }
  return true;

} // End validateContact().
