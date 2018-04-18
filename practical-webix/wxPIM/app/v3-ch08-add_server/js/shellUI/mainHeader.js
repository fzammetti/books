"use strict";


/**
 * Get the UI config object for the main header.
 */
wxPIM.getMainHeaderConfig = function() {

  // Configuraqtion for the mode switch checkbox.
  wxPIM.modeSwitchConfig = {
    view : "checkbox", label : "Desktop", labelWidth : 70, width : 110,
    value : (wxPIM.uiType === "mobile" ? 0 : 1), click : wxPIM.switchMode
  };

  // Mobile UI uses a sidemenu.
  if (wxPIM.uiType === "mobile") {

    return {
      view : "toolbar", id : "toolbar", height : 50,
      elements : [
        { view: "icon", icon: "bars",
          click : function() {
            if ($$("sidemenu").isVisible()) {
              $$("sidemenu").hide();
            } else {
              $$("sidemenu").show();
            }
          }
        },
        { id : "headerLabel", view: "label",
          label : "", defaultLabel : "wxPIM Day-at-a-glance"
        }
      ]
    };

  // Desktop UI uses a typical desktop taskbar/"start" menu.
  } else {

    return {
      view : "toolbar", id : "toolbar", height : 50,
      elements : [
        { view : "menu", width : 100, css : { "padding-top" : "4px" },
          data : [
            { value : "Modules", id : "Modules",
              submenu : wxPIM.registeredModules.sort()
            }
          ],
      		on : { onMenuItemClick : wxPIM.launchModule }
        },
        { view : "toolbar", id : "taskbar", borderless : true, elements : [ ] },
        { },
        wxPIM.modeSwitchConfig
      ]
    };

  } /* End uiType check. */

}; /* End getMainHeaderConfig(). */
