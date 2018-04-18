"use strict";


/**
 * Get the UI config object for the mobile multiview.
 */
wxPIM.getMultiviewConfig = function() {

  return {
    view : "multiview", id : "moduleArea",
    animate : { type : "flip", subtype : "horizontal" },
    cells : [
      /* Day-at-a-glance screen. */
      wxPIM.getDayAtAGlanceConfig(),
      /* Modules. */
      wxPIM.modules.Appointments.getUIConfig(),
      wxPIM.modules.Contacts.getUIConfig(),
      wxPIM.modules.Notes.getUIConfig(),
      wxPIM.modules.Tasks.getUIConfig()
    ]
  };

}; /* End getMultiviewConfig(). */
