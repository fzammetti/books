/**
 * This function enables
 */
function setupSidebarButtons() {

  $("newNote").style.display = "none";
  $("newTask").style.display = "none";
  $("newContact").style.display = "none";
  $("newAppointment").style.display = "none";
  $("dayView").style.display = "none";
  $("weekView").style.display = "none";
  $("monthView").style.display = "none";
  $("yearView").style.display = "none";
  $("dateSelector").style.display = "none";
  var args = setupSidebarButtons.arguments;
  for (i = 0; i < args.length; i++) {
    $(args[i]).style.display = "block";
  }
  if (currentView == "notes" || currentView == "dayAtAGlance") {
    $("newNote").onclick = doNewNote;
  }
  if (currentView == "tasks" || currentView == "dayAtAGlance") {
    $("newTask").onclick = doNewTask;
  }
  if (currentView == "contacts" || currentView == "dayAtAGlance") {
    $("newContact").onclick = doNewContact;
  }
  if (currentView == "appointments" || currentView == "dayAtAGlance") {
    $("newAppointment").onclick = doNewAppointment;
    $("dayView").onclick = showAppointments;
    $("weekView").onclick = doWeekView;
    $("monthView").onclick = doMonthView;
    $("yearView").onclick = doYearView;
  }

} // End setupSidebarButtons().


/**
 * Creates a rollover, i.e., preloads the needed images into the array.
 */
function createRolloverImages(inName) {

  var img = new Image();
  img.src = "img/" + inName + "0.gif";
  rolloverImages[inName + "0"] = img;
  img = new Image();
  img.src = "img/" + inName + "1.gif";
  rolloverImages[inName + "1"] = img;

} // End createRollover().


/**
 * Handle rollovers.
 */
function rollover(inObj, inID) {

  if (tabsButtonsEnabled) {
    // Because of a bug in Webwork, the id attribute of buttons in the forms
    // in the various content views is not rendered.  Therefore, just passing
    // in a reference to the object, as works for the tabs and buttons in
    // the sidebar, is not sufficient since we need the id.  So, we can also
    // pass in the id here.  If it isn't passed in, we get it from inObj,
    // otherwise we use what we are passed.
    if (inID == null) {
      inID = inObj.id;
    }
    inObj.src = rolloverImages[inID + "1"].src;
  }

} // End rollover().


/**
 * Handle rollouts.
 */
function rollout(inObj, inID) {

  // Because of a bug in Webwork, the id attribute of buttons in the forms
  // in the various content views is not rendered.  Therefore, just passing
  // in a reference to the object, as works for the tabs and buttons in
  // the sidebar, is not sufficient since we need the id.  So, we can also
  // pass in the id here.  If it isn't passed in, we get it from inObj,
  // otherwise we use what we are passed.
  if (inID == null) {
    inID = inObj.id;
  }
  inObj.src = rolloverImages[inID + "0"].src;

} // End rollout().