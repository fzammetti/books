"use strict";


/**
 * Get the UI config object for the sidemenu.
 */
wxPIM.getSideMenuConfig = function() {

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
          data : [
            { id : "Appointments", value : "Appointments", icon : "calendar" },
            { id : "Contacts", value : "Contacts", icon : "address-card" },
            { id : "Notes", value : "Notes", icon : "file-text" },
            { id : "Tasks", value : "Tasks", icon : "tasks" }
          ],
          click : wxPIM.launchModule
        },
        { height : 2, template : "<hr>" },
        { cols : [
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
          },
          { }
        ] }
      ]
    }
  };

}; /* End getSideMenuConfig(). */
