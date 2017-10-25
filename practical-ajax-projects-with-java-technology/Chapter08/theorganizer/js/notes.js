/**
 * Called to show the Notes view.
 */
function showNotes() {

  if (tabsButtonsEnabled) {
    showPleaseWait();
    new Ajax.Updater("mainContent", "noteList.action", {
      method : "post",
      onSuccess : function(resp) {
        currentView = "notes";
        setupSidebarButtons("newNote");
        hidePleaseWait();
      },
      onFailure : ajaxError
    });
  }

} // End showNotes().


/**
 * Called to show the view for creating a new note.
 */
function doNewNote() {

  if (tabsButtonsEnabled) {
    showPleaseWait();
    new Ajax.Updater("mainContent", "noteCreateShow.action", {
      method : "post",
      onSuccess : function(resp) {
        setupSidebarButtons("newNote");
        hidePleaseWait();
      },
      onFailure : ajaxError
    });
  }

} // End doNewNote().


/**
 * Function called to create a new note.
 */
function noteCreate(inForm) {

  if (tabsButtonsEnabled) {
    if (validateNote(inForm)) {
      showPleaseWait();
      new Ajax.Updater("mainContent", "noteCreate.action", {
        method : "post",
        postBody : Form.serialize(inForm),
        onSuccess : function(resp) {
          setupSidebarButtons("newNote");
          hidePleaseWait();
        },
        onFailure : ajaxError
      });
    }
  }

} // End noteCreate().


/**
 * Function called to retrieve an existing note for editing.
 */
function noteRetrieve(inForm) {

  if (tabsButtonsEnabled) {
    showPleaseWait();
    new Ajax.Updater("mainContent", "noteRetrieve.action", {
      method : "post",
      postBody : Form.serialize(inForm),
      onSuccess : function(resp) {
        setupSidebarButtons("newNote");
        hidePleaseWait();
      },
      onFailure : ajaxError
    });
  }

} // End noteRetrieve().


/**
 * Function called to save an updated note.
 */
function noteUpdate(inForm) {

  if (tabsButtonsEnabled) {
    if (validateNote(inForm)) {
      showPleaseWait();
      new Ajax.Updater("mainContent", "noteUpdate.action", {
        method : "post",
        postBody : Form.serialize(inForm),
        onSuccess : function(resp) {
          setupSidebarButtons("newNote");
          hidePleaseWait();
        },
        onFailure : ajaxError
      });
    }
  }

} // End noteUpdate().


/**
 * Function called to delete an existing note.
 */
function noteDelete(inForm) {

  if (tabsButtonsEnabled) {
    showPleaseWait();
    new Ajax.Updater("mainContent", "noteDelete.action", {
      method : "post",
      postBody : Form.serialize(inForm),
      onSuccess : function(resp) {
        setupSidebarButtons("newNote");
        hidePleaseWait();
      },
      onFailure : ajaxError
    });
  }

} // End noteDelete().


/**
 * This function is called when a note is being saved (created or updated) to
 * validate user input.
 */
function validateNote(inForm) {

  if (inForm.subject.value == "") {
    alert("You must enter a subject");
    inForm.subject.focus();
    return false;
  }
  if (inForm.text.value == "") {
    alert("You must enter some text");
    inForm.text.focus();
    return false;
  }
  return true;

} // End validateNote().