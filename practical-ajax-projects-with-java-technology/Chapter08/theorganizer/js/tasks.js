/**
 * Called to show the Tasks view.
 */
function showTasks() {

  if (tabsButtonsEnabled) {
    showPleaseWait();
    new Ajax.Updater("mainContent", "taskList.action", {
      method : "post",
      onSuccess : function(resp) {
        currentView = "tasks";
        setupSidebarButtons("newTask");
        hidePleaseWait();
      },
      onFailure : ajaxError
    });
  }

} // End showTasks().


/**
 * Called to show the view for creating a new task.
 */
function doNewTask() {

  if (tabsButtonsEnabled) {
    showPleaseWait();
    new Ajax.Updater("mainContent", "taskCreateShow.action", {
      method : "post",
      onSuccess : function(resp) {
        setupSidebarButtons("newTask");
        hidePleaseWait();
      },
      onFailure : ajaxError
    });
  }

} // End doNewTask().


/**
 * Function called to create a new task.
 */
function taskCreate(inForm) {

  if (tabsButtonsEnabled) {
    if (validateTask(inForm)) {
      showPleaseWait();
      // Populate the hidden field for due from the constituent parts.
      inForm.due.value = inForm.dueMonth.value + "/" +
        inForm.dueDay.value + "/" + inForm.dueYear.value;
      new Ajax.Updater("mainContent", "taskCreate.action", {
        method : "post",
        postBody : Form.serialize(inForm),
        onSuccess : function(resp) {
          setupSidebarButtons("newTask");
          hidePleaseWait();
        },
        onFailure : ajaxError
      });
    }
  }

} // End taskCreate().


/**
 * Function called to retrieve an existing task for editing.
 */
function taskRetrieve(inForm) {

  if (tabsButtonsEnabled) {
    showPleaseWait();
    new Ajax.Request("taskRetrieve.action", {
      method : "post",
      postBody : Form.serialize(inForm),
      onSuccess : function(resp) {
        $("mainContent").innerHTML = resp.responseText;
        locateDDValue($("taskRetrieve_dueMonth"),
          $("taskRetrieve_due").value.substring(0, 2));
        locateDDValue($("taskRetrieve_dueDay"),
          $("taskRetrieve_due").value.substring(3, 5));
        locateDDValue($("taskRetrieve_dueYear"),
          $("taskRetrieve_due").value.substring(6, 10));
        setupSidebarButtons("newTask");
        hidePleaseWait();
      },
      onFailure : ajaxError
    });
  }

} // End taskRetrieve().


/**
 * Function called to save an updated task.
 */
function taskUpdate(inForm) {

  if (tabsButtonsEnabled) {
    if (validateTask(inForm)) {
      showPleaseWait();
      // Populate the hidden field for due from the constituent parts.
      inForm.due.value = inForm.dueMonth.value + "/" +
        inForm.dueDay.value + "/" + inForm.dueYear.value;
      new Ajax.Updater("mainContent", "taskUpdate.action", {
        method : "post",
        postBody : Form.serialize(inForm),
        onSuccess : function(resp) {
          setupSidebarButtons("newTask");
          hidePleaseWait();
        },
        onFailure : ajaxError
      });
    }
  }

} // End taskUpdate().


/**
 * Function called to delete an existing task.
 */
function taskDelete(inForm) {

  if (tabsButtonsEnabled) {
    showPleaseWait();
    new Ajax.Updater("mainContent", "taskDelete.action", {
      method : "post",
      postBody : Form.serialize(inForm),
      onSuccess : function(resp) {
        setupSidebarButtons("newTask");
        hidePleaseWait();
      },
      onFailure : ajaxError
    });
  }

} // End taskDelete().


/**
 * This function is called when a task is being saved (created or updated) to
 * validate user input.
 */
function validateTask(inForm) {

  if (inForm.subject.value == "") {
    alert("You must enter a subject");
    inForm.subject.focus();
    return false;
  }
  return true;

} // End validateTask().
