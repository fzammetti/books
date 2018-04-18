"use strict";


/**
 * Get the UI config object for the day-at-a-glance screen.
 */
wxPIM.getDayAtAGlanceConfig = function() {

  return {
    id : "dayAtAGlance", view : "scrollview", borderless : true, body : {
      paddingX : 20, paddingY : 20, rows : [
        { view : "fieldset", label : "Appointments",
          body : { id : "dayAtAGlanceScreen_Appointments",  rows : [ ] }
        },
        { height : 20 },
        { view : "fieldset", label : "Tasks",
          body : { id : "dayAtAGlanceScreen_Tasks", rows : [ ] }
        }
      ]
    }
  };

}; /* End getDayAtAGlanceConfig(). */


/**
 * Populates the day-at-a-glance screen.
 */
wxPIM.dayAtAGlance = function() {

  // Let the currently active module, if any, de-activate.
  if (wxPIM.activeModule) {
    wxPIM.modules[wxPIM.activeModule].deactivate();
  }

  // Make sure there's no active module when we're on day-at-a-glance or we'll have problems.
  wxPIM.activeModule = null;

  // Worker function that renders either tasks or appointments for today.
  const worker = function(inWhich) {
    // Default assumption that we're doing appointments.
    let sortProperty = "when";
    let sortDirection = "A";
    let dateProperty = "when";
    let template = webix.template("#subject# - #when# #location#");
    // Override if doing tasks.
    if (inWhich == "Tasks") {
      sortProperty = "value";
      sortDirection = "A";
      dateProperty = "dueDate";
      template = webix.template("#subject#");
    }
    // Get items and sort them.
    let dataItems = wxPIM.getModuleData(inWhich);
    dataItems = wxPIM.objectAsArray(dataItems);
    wxPIM.sortArray(dataItems, sortProperty, sortDirection);
    // Create an array of only those items for today.  Note special handling to ignore time.
    const currentDate = new Date().setHours(0, 0, 0, 0);
    const rows = [ ];
    for (let i = 0; i < dataItems.length; i++) {
      const item = dataItems[i];
      const itemDate = new Date(item[dateProperty]).setHours(0, 0, 0, 0);
      if (itemDate == currentDate) {
        // Data fixups so things display properly.
        if (item.location) {
          item.location = "(" + item.location + ")";
        } else {
          item.location = "";
        }
        if (item.status == 1) {
          item.status = "Ongoing";
        } else {
          item.status = "Completed";
        }
        item[dateProperty] = webix.i18n.timeFormatStr(new Date(item[dateProperty]));
        // Add the row to the collection.
        rows.push({ borderless : true, template : template(item), height : 30 });
      }
    }
    // Replace the rows in the container on the day-at-a-glance page.
    webix.ui(rows, $$(`dayAtAGlanceScreen_${inWhich}`));
  };

  // Render both sections with the worker.
  worker("Tasks");
  worker("Appointments");

  // Set the day-at-a-glance header text
  $$("headerLabel").setValue($$("headerLabel").config.defaultLabel);

}; /* End dayAtAGlance(). */
