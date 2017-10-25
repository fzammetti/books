/**
 * Shows the please wait message in the main content area when an
 * AJAX request is firing.
 */
function showPleaseWait() {

  tabsButtonsEnabled = false;
  $("mainContent").style.display = "none";
  $("pleaseWait").style.display = "block";

} // End showPleaseWait().


/**
 * Hides the please wait message in the main content area when an
 * AJAX request is done and sows the main content.
 */
function hidePleaseWait() {

  tabsButtonsEnabled = true;
  $("mainContent").style.display = "block";
  $("pleaseWait").style.display = "none";

} // End hidePleaseWait().


/**
 * Called to show the Day At A Glance view.
 */
function showDayAtAGlance() {

  if (tabsButtonsEnabled) {
    showPleaseWait();
    new Ajax.Updater("mainContent", "dayAtAGlance.action", {
      method : "post",
      onSuccess : function(resp) {
        currentView = "dayAtAGlance";
        setupSidebarButtons("newNote", "newTask", "newContact",
          "newAppointment");
        hidePleaseWait();
      },
      onFailure : ajaxError
    });
  }

} // End showDayAtAGlance().


/**
 * This function is called onFailure of any AJAX request.
 */
function ajaxError() {

  alert("AJAX error!");

} // End ajaxError().


/**
 * Called to log the user off.
 */
function logoff() {

  if (tabsButtonsEnabled) {
    window.location=('logoff.action');
  }

} // End logoff().


/**
 * Locates and selects a particular value in a <select> dropdown.
 */
function locateDDValue(obj, inLddValue) {

  findMe = inLddValue.toUpperCase();
  obj.value = "";
  for (i = 0; (i < obj.options.length); i++) {
    if (obj.options[i].value.toUpperCase() == findMe) {
      obj.options[i].selected = true;
      break;
    }
  }

} // End locateDDValue().
