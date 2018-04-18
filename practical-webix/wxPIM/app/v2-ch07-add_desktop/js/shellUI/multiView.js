"use strict";


/**
 * Get the UI config object for the mobile multiview.
 */
wxPIM.getMultiviewConfig = function() {

  const cellsConfig = [ wxPIM.getDayAtAGlanceConfig() ];
  if (wxPIM.uiType === "mobile") {
    for (let moduleName of wxPIM.registeredModules) {
      cellsConfig.push(wxPIM.modules[moduleName].getUIConfig());
    }
  }

  return {
    view : "multiview", id : "moduleArea", cells : cellsConfig,
    animate : { type : "flip", subtype : "horizontal" }
  };

}; /* End getMultiviewConfig(). */
