"use strict";


/**
 * Get the UI config object for the base layout.
 */
wxPIM.getBaseLayoutConfig = function() {

  return {
    id : "baseLayout",
    rows : [
      /* ---------- wxPIM header. ---------- */
      wxPIM.getMainHeaderConfig(),
      wxPIM.getMultiviewConfig()
    ]
  };

}; /* End getBaseLayoutConfig(). */
