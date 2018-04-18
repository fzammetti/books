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

    // Flag set to true when editing an existing item, false when adding a new one.
    this.isEditingExisting = false;

    // The ID of the item being edited in the current module, if any.
    this.editingID = null;

    // Module classes.
    this.moduleClasses = { };

    // Loaded modules.
    this.modules = { };

    // The currently active module, if any.
    this.activeModule = null;

    // Build the UI when the DOM is ready.
    webix.ready(this.start.bind(this));

  } /* End constructor. */


  /**
   * Builds the UI app shell.
   */
  start() {

    // Instantiate modules.
    this.modules.Appointments = new this.moduleClasses.Appointments();
    this.modules.Contacts = new this.moduleClasses.Contacts();
    this.modules.Notes = new this.moduleClasses.Notes();
    this.modules.Tasks = new this.moduleClasses.Tasks();

    // The base layout of the page.
    webix.ui(this.getBaseLayoutConfig());

    // Sidemenu.
    webix.ui(this.getSideMenuConfig());

    // Populate the day-at-a-glance screen.
    wxPIM.dayAtAGlance();

  } /* End start(). */


  /**
   * Launch a module.
   *
   * @param inModuleName The name of the module.
   */
  launchModule(inModuleName) {

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

    // Set flags to indicate not editing an existing item.
    wxPIM.editingID = null;
    wxPIM.isEditingExisting = false;

    // Switch the multiview to the module and show the module's summary view.
    $$(`module${inModuleName}-itemsCell`).show();
    $$(`module${inModuleName}-container`).show();

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

  }; /* End objectAsArray(). */


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

  }; /* End getModuleData(). */


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
    itemData.id = wxPIM.editingID;

    // webix.proto() adds an $init() function, but we don't need that, so let's delete it now.
    delete itemData.$init;

    // Get the collection of module data, apply this one, and then set it again.
    const moduleData = wxPIM.getModuleData(inModuleName);
    moduleData[itemData.id] = itemData;
    localStorage.setItem(`${inModuleName}DB`, webix.stringify(moduleData));

    // Refresh the module's summary list and return to that list.
    wxPIM.modules[inModuleName].refreshData();
    $$(`module${inModuleName}-itemsCell`).show();

    // Finally, show a completion message.
    webix.message({ type : "error", text : "Item saved" });

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
          // Get the data collection, remove the specified one, and then set it again.
          const dataItems = wxPIM.getModuleData(inModuleName);
          delete dataItems[wxPIM.editingID];
          localStorage.setItem(`${inModuleName}DB`, webix.stringify(dataItems));
          // Refresh the module's summary list and return to that list.
          wxPIM.modules[inModuleName].refreshData();
          $$(`module${inModuleName}-itemsCell`).show();
          // Finally, show a completion message.
          webix.message({ type : "error", text : "Item deleted" });
        }
      }
    }), "animated bounceIn");

  }; /* End deleteHandler(). */


} /* End WXPIM. */


// The one and only instance of WXPIM.
const wxPIM = new WXPIM();
