/**
 * Called to initialize things.
 */
function init() {

  // Preload tabs.
  createRolloverImages("dayAtAGlance");
  createRolloverImages("notes");
  createRolloverImages("tasks");
  createRolloverImages("contacts");
  createRolloverImages("appointments");
  createRolloverImages("myAccount");
  createRolloverImages("logoff");

  // Preload sidebar buttons.
  createRolloverImages("newNote");
  createRolloverImages("newTask");
  createRolloverImages("newContact");
  createRolloverImages("newAppointment");
  createRolloverImages("dayView");
  createRolloverImages("weekView");
  createRolloverImages("monthView");
  createRolloverImages("yearView");

  // Preload buttons that appear in the main content area.
  createRolloverImages("save");
  createRolloverImages("delete");
  createRolloverImages("edit");
  createRolloverImages("ok");

  // Set the date selector in the sidebar to the current date.
  var d = new Date();
  var month = d.getMonth() + 1;
  var day = d.getDate();
  var year = d.getFullYear();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  month += '';
  day += '';
  year += '';
  locateDDValue($("dsMonth"), month);
  locateDDValue($("dsDay"), day);
  locateDDValue($("dsYear"), year);

  // Start on Day At A Glance screen.
  hidePleaseWait();
  alert("Welcome to The Organizer!");
  showDayAtAGlance();

} // End init().
