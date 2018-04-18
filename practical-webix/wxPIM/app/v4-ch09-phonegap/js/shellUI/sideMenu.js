"use strict";


/**
 * Get the UI config object for the sidemenu.
 */
wxPIM.getSideMenuConfig = function() {

  const listItems = [ ];
  for (let moduleName of wxPIM.registeredModules) {
    listItems.push({ id : moduleName, value : moduleName,
      icon : wxPIM.modules[moduleName].getUIConfig().winIcon
    });
  }

  return {
    view : "sidemenu", id : "sidemenu", width : 200,
    position : "left", css : "cssSideMenu",
    state : (inState) => {
      const toolbarHeight = $$("toolbar").$height;
      inState.top = toolbarHeight;
      inState.height -= toolbarHeight;
    },
    body : {
      rows : [
        { view : "list", scroll : true,
          select : false, type : { height : 40 }, id : "sidemenu_list",
          template : `<span class="webix_icon fa-#icon#"></span> #value#`,
          data : listItems, click : wxPIM.launchModule
        },
        { height : 2, template : "<hr>" },
        { cols : [
          wxPIM.modeSwitchConfig,
          { },
          { view : "button", type : "icon", label : "", icon : "home",
            align : "right", width : 32,
            click : () => {
              // Populate day-at-a-glance screen data.
              wxPIM.dayAtAGlance();
              // Hide sidemenu and show day-at-a-glance screen.
              $$("sidemenu").hide();
              $$("dayAtAGlance").show();
            }
          }
        ] }
      ]
    }
  };

}; /* End getSideMenuConfig(). */
