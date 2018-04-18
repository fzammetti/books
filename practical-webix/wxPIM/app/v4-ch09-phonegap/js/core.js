"use strict";


class WXPIM {


  /**
   * Constructor.
   */
  constructor() {

    // The predefined Webix isNumber and isEmail validation functions count a blank field as invalid, but in some cases
    // we don't want that, we want blank to be considered valid, so we'll provide a new validation function here.
    webix.rules.isNumberOrBlank = function(inValue) {
      if (inValue == "") { return true; }
      return webix.rules.isNumber(inValue);
    };
    webix.rules.isEmailOrBlank = function(inValue) {
      if (inValue == "") { return true; }
      return webix.rules.isEmail(inValue);
    };

    // Module classes.
    this.moduleClasses = { };

    // Loaded modules.
    this.modules = { };

    // The currently active module, if any.
    this.activeModule = null;

    // Every module "registers" itself with wxPIM by adding itself here.
    this.registeredModules = [ ];

    // The current UI type ("mobile" or "desktop").
    if (webix.env.mobile) {
      this.uiType = "mobile";
    } else {
      this.uiType = "desktop";
    }

    // Custom window component so that by default windows will animated when opened and when hidden.
    webix.protoUI({
      name : "ani-window",
      $init : function() {
        this.$ready.push(function() {
          this.attachEvent("onShow", function() {
            let base = this.$view.className.split("animated")[0];
            this.$view.className = base + " animated bounceIn";
          });
          this.attachEvent("onHide", function() {
            this.$view.style.display = "block";
            this.$view.className = this.$view.className + " animated bounceOut";
          });
        });
      }
    }, webix.ui.window);

    // Build the UI when the DOM is ready.
    document.addEventListener("deviceready", this.start.bind(this), false);

  } /* End constructor. */


  /**
   * Builds the UI app shell.
   */
  start() {

    // Instantiate modules.
    for (let moduleName of wxPIM.registeredModules) {
      wxPIM.modules[moduleName] = new wxPIM.moduleClasses[moduleName]();
    }

    // The base layout of the page.
    webix.ui(this.getBaseLayoutConfig());

    // Augment main base with a ProgressBar so it can be masked during server calls.
    webix.extend($$("baseLayout"), webix.ProgressBar);

    // Sidemenu.
    webix.ui(this.getSideMenuConfig());

    // Retrieve serer address from Local Storage.  If not present, prompt for it.
    const serverAddress = localStorage.getItem("serverAddress");
    if (!serverAddress) {
      wxPIM.promptForServerAddress();
    } else {
      // Get all data from server.
      wxPIM.getAllData();
    }

  } /* End start(). */


  /**
   *
   */
  promptForServerAddress() {

    wxPIM.maskUI();
    const win = webix.ui({
      view : "ani-window", move : false, width : 260,
      position : "center", resize : false, id : "serverAddressWindow", toFront : true,
      fullscreen : false, head : "Information needed",
      body : { height : 140, rows : [
        { borderless : true, height : 30, template : "Please enter server address",
          css : { "text-align" : "center", "padding-top" : "10px", "padding-bottom" : "10px" }
        },
        { view : "text", id : "serverAddressText", css : { "padding-bottom" : "10px" } },
        { view : "button", label : "Ok",
          click : () => {
            localStorage.setItem("serverAddress", $$("serverAddressText").getValue());
            $$("serverAddressWindow").close();
            wxPIM.unmaskUI();
            wxPIM.getAllData();
          }
        }
      ] }
    });
    win.show();

  } /* End promptForServerAddress(). */


  /**
   * Get all data from the server.
   */
  getAllData() {

    // Mask screen while calling server.
    wxPIM.maskUI();

    // Common code to handle either an exception or a fail response.
    const failOrExceptionHandler = function(inObj) {
      navigator.vibrate(3000);
      // Clear saved server address so we ask for it again at next app start.
      localStorage.removeItem("serverAddress");
      webix.message({
        type : "error", text : "Server not available, wxPIM is in read-only mode"
      });
    };

    try {
      webix.ajax()
        .timeout(10000)
        .headers({ "Content-Type" : "application/json" })
        .post(`${localStorage.getItem("serverAddress")}/getAllData`,
          JSON.stringify(wxPIM.registeredModules)
        )
        .then(function(inResult) {
          // First, grab the server address.
          const serverAddress = localStorage.getItem("serverAddress");
          // Now, clear Local Storage so we start fresh.
          localStorage.clear();
          // Store all data in Local Storage.  Remember that we get an array back from the server,
          // but it's stored in Local Storage as an object for each module keyed by ID.
          const allModuleData = inResult.json();
          for (let moduleName of wxPIM.registeredModules) {
            const moduleDataArray = allModuleData[moduleName];
            const moduleDataObject = { };
            for (let i = 0; i < moduleDataArray.length; i++) {
              const nextItem = moduleDataArray[i];
              moduleDataObject[nextItem.id] = nextItem;
            }
             localStorage.setItem(`${moduleName}DB`, webix.stringify(moduleDataObject));
          }
          // Don't forget to store the server address!
          localStorage.setItem("serverAddress", serverAddress);
          // Unmask screen.
          wxPIM.unmaskUI();
          // Finally, show day-at-a-glance.
          wxPIM.dayAtAGlance();
        })
        .fail(failOrExceptionHandler);
    } catch (inException) {
      failOrExceptionHandler(inException);
    }

  } /* End getAllData(). */


  /**
   * Launch a module.
   *
   * @param inModuleName The name of the module.
   */
  launchModule(inModuleName) {

    // Don't trigger on initial click of the top-level menu item.
    if (inModuleName === "Modules") { return; }

    // Mobile mode.
    if (wxPIM.uiType === "mobile") {

      // Let the currently active module, if any, de-activate.
      if (wxPIM.activeModule) {
        wxPIM.modules[wxPIM.activeModule].deactivate();
      }

      // Record the new active module.
      wxPIM.activeModule = inModuleName;

      // Hide sidemenu.
      $$("sidemenu").hide();

      // Set header text to reflect which module we're using.
      $$("headerLabel").setValue(inModuleName);

      // Switch the multiview to the module and show the module's summary view.
      $$(`module${inModuleName}-itemsCell`).show();
      $$(`module${inModuleName}-container`).show();

    // Desktop mode.
    } else {

      let moduleWindow = $$(`moduleWindow-${inModuleName}`);

      // Module window already exists, just show it.
      if (moduleWindow) {

        moduleWindow.show();
        return;

      // Module window doesn't exist yet, built it.
      } else {

        // Get module's app config.
        const moduleUIConfig = wxPIM.modules[inModuleName].getUIConfig();

        // Figure out the window sizing.  We'll use the width and height the module defines, making sure
        // the viewport will allow it, otherwise we'll override and size it to fit the viewport.  Remember to account
        // for the toolbar too either way!
        let toolbarHeight = $$("toolbar").$height;
        let vpWidth = document.documentElement.clientWidth - 100;
        let vpHeight = document.documentElement.clientHeight - 100 - toolbarHeight;
        let winWidth = moduleUIConfig.winWidth;
        let winHeight = moduleUIConfig.winHeight;
        if (vpWidth < winWidth) {
          winWidth = vpWidth;
        }
        if (vpHeight < winHeight) {
          winHeight = vpHeight;
        }
        const centerX = ((vpWidth - winWidth) / 2) + 50;
        const centerY = ((vpHeight - winHeight) / 2) + (toolbarHeight * 2);

        // Create a window with the app's layout inside it.
        const win = webix.ui({
          view : "ani-window", move : true, width : winWidth, height : winHeight,
          left : centerX, top : centerY,
          resize : true, id : `moduleWindow-${inModuleName}`, toFront : true,
          fullscreen : false,
          head : {
            view : "toolbar",
            cols : [
              { view : "label", label: moduleUIConfig.winLabel },
              { view : "icon", icon : "window-minimize",
                click : function() {
                  // Hide the window and toggle it's taskbar button.
                  $$(`moduleWindow-${inModuleName}`).hide();
                  $$(`moduleTasbbarButton-${inModuleName}`).toggle();
                }
              },
              { view : "icon", icon : "window-maximize",
                click : function() {
                  // Reconfigure the module's window to be full-screen and resize it.
                  const win = $$(`moduleWindow-${inModuleName}`);
                  win.config.fullscreen = !win.config.fullscreen;
                  win.resize();
                  // Now change this icon's, err, ICON, as appropriate, and position the
                  // window based on it's new state.
                  if (win.config.fullscreen) {
                    this.config.icon = "window-restore";
                    win.setPosition(0, 0);
                  } else {
                    this.config.icon = "window-maximize";
                    win.setPosition(centerX, centerY);
                  }
                  // Refresh this icon to reflect the change.
                  this.refresh();
                  // Finally, blur off the icon so there's no "selection" artifact.
                  this.blur();
                }
              },
              { view : "icon", icon : "times-circle",
                click : function() {
                  // Close the window and remove taskbar button.
                  $$(`moduleWindow-${inModuleName}`).close();
                  $$("taskbar").removeView(`moduleTasbbarButton-${inModuleName}`);
                }
              }
            ]
          },
          body : moduleUIConfig
        });
        webix.extend(win, webix.ProgressBar);
        win.show();

        // Add a taskbar button for this module.
        const taskbar = $$("taskbar");
        const moduleButton = webix.ui({
          id : `moduleTasbbarButton-${inModuleName}`,
          view : "toggle", type : "iconButton", width : 140, height : 50,
          icon : moduleUIConfig.winIcon, label : moduleUIConfig.winLabel,
          click : function() {
            // Hide or show the module's window based on the CURRENT state of the button.
            const moduleName = this.config.label;
            if (this.getValue() === 1) {
              $$(`moduleWindow-${moduleName}`).hide();
            } else {
              $$(`moduleWindow-${moduleName}`).show();
            }
            // Blur off the button so there's no "selection" artifact.
            this.blur();
          }
        });
        moduleButton.toggle();
        taskbar.addView(moduleButton);

      } /* End moduleWindow exists check. */

    } /* End uiType check. */

    // Refresh data for the module to show their lists of items.
    wxPIM.modules[inModuleName].refreshData();

    // Finally, call the module's activate() handler.
    wxPIM.modules[inModuleName].activate();

  } /* End launchModule(). */


  // **************************************** Module helper methods ****************************************


  /**
   * Sort an array of objects by a specified property in descending order.
   *
   * @param inArray     The array to sort.
   * @param inProperty  The property of the objects in the array to sort on.
   * @param inDirection "A"scending or "D"escending.
   */
  sortArray(inArray, inProperty, inDirection) {

    inArray.sort(function compare(inA, inB) {

      // Normalize strings so we do a case-insensitive sort.
      inA = (inA[inProperty] + "").toLowerCase();
      inB = (inB[inProperty] + "").toLowerCase();

      if (inA > inB) {
        if (inDirection === "D") {
          return -1;
        } else {
          return 1;
        }
      } else if (inA < inB) {
        if (inDirection === "D") {
          return 1;
        } else {
          return -1;
        }
      } else {
        return 0;
      }

    });

  } /* End sort Array(). */


  /**
   * Takes in an object and returns an array where each element is a property of the object.
   * Note that order IS NOT guaranteed!
   *
   * @param  inObject The object to create an array from.
   * @return          (Array) The resulting array.
   */
  objectAsArray(inObject) {

    const array = [ ];

    for (const key in inObject) {
      if (inObject.hasOwnProperty(key)) {
        array.push(inObject[key]);
      }
    }

    return array;

  } /* End objectAsArray(). */


  /**
   * Get the data for a specified module from local storage.
   *
   * @param  inModuleName The name of the module.
   * @return           The data as an object.
   */
  getModuleData(inModuleName) {

    let items = localStorage.getItem(`${inModuleName}DB`);

    if (!items) {
      // Create the module's data collection in local storage.
      items = { };
      localStorage.setItem(`${inModuleName}DB`, webix.stringify(items));
    } else {
      items = JSON.parse(items);
    }

    return items;

  } /* End getModuleData(). */


  /**
   * Mask the UI during a server call.
   *
   * @param inModuleName The name of the module triggering the call.
   */
  maskUI(inModuleName) {

    $$("baseLayout").disable();
    $$("baseLayout").showProgress({ type : "icon" });
    if (wxPIM.uiType === "desktop") {
      for (let moduleName of wxPIM.registeredModules) {
        let moduleWindow = $$(`moduleWindow-${moduleName}`);
        if (moduleWindow) {
          moduleWindow.disable();
          if (moduleName === inModuleName) {
            moduleWindow.showProgress({ type : "icon" });
          }
        }
      }
    }

  } /* End maskUI(). */


  /**
   * Mask the UI during a server call.
   */
  unmaskUI() {

    $$("baseLayout").enable();
    $$("baseLayout").hideProgress();
    if (wxPIM.uiType === "desktop") {
      for (let moduleName of wxPIM.registeredModules) {
        let moduleWindow = $$(`moduleWindow-${moduleName}`);
        if (moduleWindow) {
          moduleWindow.enable();
          moduleWindow.hideProgress();
        }
      }
    }

  } /* End unmaskUI(). */


  /**
   * Handles clicks of the save button for modules.
   *
   * @param inModuleName The name of the module.
   * @param inFormIDs    An array of form IDs.
   */
  saveHandler(inModuleName, inFormIDs) {

    // Merge all forms together.  Usually there's just one, but some modules may have more than one.
    const itemData = { };
    for (let i = 0; i < inFormIDs.length; i++) {
      const formData = $$(inFormIDs[i]).getValues();
      webix.proto(itemData, formData);
    }
    itemData.id = wxPIM.modules[inModuleName].editingID;

    // webix.proto() adds an $init() function, but we don't need that, so let's delete it now.
    delete itemData.$init;

    // Mask screen while calling server.
    wxPIM.maskUI(inModuleName);

    // Define then handler for AJAX call.
    const thenHandler = function(inResult) {
      // Get the collection of module data, apply this one, and then set it again.
      const moduleData = wxPIM.getModuleData(inModuleName);
      moduleData[itemData.id] = itemData;
      localStorage.setItem(`${inModuleName}DB`, webix.stringify(moduleData));
      // Refresh the module's summary list and return to that list.
      wxPIM.modules[inModuleName].refreshData();
      $$(`module${inModuleName}-itemsCell`).show();
      // Give the day-at-a-glance screen a chance to update (needed for desktop mode).
      wxPIM.dayAtAGlance();
      // Unmask screen.
      wxPIM.unmaskUI();
      // Finally, show a completion message.
      webix.message({ type : "error", text : "Item saved" });
    };

    // Define fail handler for AJAX call.
    const failHandler = function(inXHR) {
      // Unmask screen.
      wxPIM.unmaskUI();
      // Show message.
      webix.message({
        type : "error", text : "Server not available, data changes not currently possible"
      });
    };

    // Shared parameters for the AJAX call.
    const callURL =
      `${localStorage.getItem("serverAddress")}/data/${inModuleName.toLowerCase()}`;
    const callTimeout = 10000;
    const callHeaders = { "Content-Type" : "application/json" };
    const callBody = JSON.stringify(itemData);

    // Determine correct HTTP method for call.  If a new item is being created then it's POST,
    // and for editing existing items it's PUT.
    if (wxPIM.modules[inModuleName].isEditingExisting) {
      webix.ajax()
        .timeout(callTimeout)
        .headers(callHeaders)
        .put(`${callURL}/${itemData.id}`, callBody)
        .then(thenHandler)
        .fail(failHandler);
    } else {
      webix.ajax()
        .timeout(callTimeout)
        .headers(callHeaders)
        .post(callURL, callBody)
        .then(thenHandler)
        .fail(failHandler);
    }

  } /* End saveHandler(). */


  /**
   * Handles clicks of the delete button for modules.
   *
   * @param inModuleName The name of the module.
   */
  deleteHandler(inModuleName) {

    webix.html.addCss(webix.confirm({
      title : `Please Confirm`, ok : "Yes", cancel : "No", type : "confirm-warning",
      text : `Are you sure you want to delete this item?`, width : 300,
      callback : function(inResult) {
        // Delete confirmed.
        if (inResult) {
          // Mask screen while calling server.
          wxPIM.maskUI();
          webix.ajax()
            .timeout(10000)
            .del(
              `${localStorage.getItem("serverAddress")}/data/${inModuleName.toLowerCase()}/${wxPIM.modules[inModuleName].editingID}`
            )
            .then(function(inResult) {
              // Get the data collection, remove the specified one, and then set it again.
              const dataItems = wxPIM.getModuleData(inModuleName);
              delete dataItems[wxPIM.modules[inModuleName].editingID];
              localStorage.setItem(`${inModuleName}DB`, webix.stringify(dataItems));
              // Refresh the module's summary list and return to that list.
              wxPIM.modules[inModuleName].refreshData();
              $$(`module${inModuleName}-itemsCell`).show();
              // Give the day-at-a-glance screen a chance to update (needed for desktop mode).
              wxPIM.dayAtAGlance();
              // Unmask screen.
              wxPIM.unmaskUI();
              // Finally, show a completion message.
              webix.message({ type : "error", text : "Item deleted" });
            })
            .fail(function(inXHR) {
              // Unmask screen.
              wxPIM.unmaskUI();
              // Show message.
              webix.message({
                type : "error", text : "Server not available, data changes not currently possible"
              });
            });
        }
      }
    }), "animated bounceIn");

  } /* End deleteHandler(). */


  /**
   * Switch between desktop and mobile mode.
   */
  switchMode() {

      // Hide the sidemenu (whether it's showing or even valid in the current mode or not).
      $$("sidemenu").hide();

      // Destroy any existing module windows.
      for (let moduleName of wxPIM.registeredModules) {
        let moduleWindow = $$(`moduleWindow-${moduleName}`);
        if (moduleWindow) { moduleWindow.close(); }
      }

      // Make sure there's no active module.
      wxPIM.activeModule = null;

      // Destroy existing base layout.
      $$("baseLayout").destructor();

      // Switch UI type.
      switch (this.getValue()) {
        case 0 : wxPIM.uiType = "mobile"; break;
        case 1 : wxPIM.uiType = "desktop"; break;
      }

      // Rebuild the UI (also effectively resets all modules).
      wxPIM.start();

  }; /* End switchMode(). */


} /* End WXPIM. */


// The one and only instance of WXPIM.
const wxPIM = new WXPIM();
