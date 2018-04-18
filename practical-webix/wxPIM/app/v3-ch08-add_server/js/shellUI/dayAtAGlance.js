"use strict";


/**
 * Get the UI config object for the day-at-a-glance screen.
 */
wxPIM.getDayAtAGlanceConfig = function() {

  return {
    id : "dayAtAGlance", view : "scrollview", borderless : true, body : {
      id : "dayAtAGlanceBody", paddingX : 20, paddingY : 20, rows : [ ]
    }
  };

}; /* End getDayAtAGlanceConfig(). */


/**
 * Populates the day-at-a-glance screen.
 */
wxPIM.dayAtAGlance = function() {

  // Do some cleanup required when in mobile mode that isn't needed in desktop mode.
  if (wxPIM.uiType === "mobile") {

    // Let the currently active module, if any, de-activate.
    if (wxPIM.activeModule) {
      wxPIM.modules[wxPIM.activeModule].deactivate();
    }

    // Make sure there's no active module when we're on day-at-a-glance or we'll have problems.
    wxPIM.activeModule = null;

    // Set the day-at-a-glance header text
    $$("headerLabel").setValue($$("headerLabel").config.defaultLabel);

  }

  // Give each module a chance to participate.
  for (let moduleName of wxPIM.registeredModules) {
    wxPIM.modules[moduleName].dayAtAGlance();
  }

}; /* End dayAtAGlance(). */
