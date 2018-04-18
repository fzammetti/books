"use strict";


// "Register" this module with wxPIM.
wxPIM.registeredModules.push("Tasks");


wxPIM.moduleClasses.Tasks = class {


  /**
   * Constructor.
   */
  constructor() {

    // Flag set to true when editing an existing item, false when adding a new one.
    this.isEditingExisting = false;

    // The ID of the item being edited in the current module, if any.
    this.editingID = null;

  } /* End constructor. */


  /**
   * Return the module's UI config object.
   */
  getUIConfig() {

    // Construct the toolbar for the summary view based on UI mode.
    const summaryToolbarConfig = [ ];
    const newButtonConfig = { view : "button", label : "New", width : "80",
      type : "iconButton", icon : "plus", click : this.newHandler.bind(this)
    };
    if (wxPIM.uiType === "mobile") {
      summaryToolbarConfig.push({});
      summaryToolbarConfig.push(newButtonConfig);
      summaryToolbarConfig.push({ width : 6 });
    } else {
      summaryToolbarConfig.push({ width : 6 });
      summaryToolbarConfig.push(newButtonConfig);
    }

    // Summary view config object.
    const summaryView = {
      id : "moduleTasks-itemsCell", width : (wxPIM.uiType === "mobile" ? 0 : 330),
      minWidth : 330,
      rows : [
        { view : "tree", id : "moduleTasks-items",
          on : { onItemClick : this.editExisting.bind(this) }
        },
        /* Task list toolbar. */
        { view : "toolbar", cols : summaryToolbarConfig } /* End toolbar. */
      ] /* End task list rows. */
    };

    // Construct the toolbar for the details view based on UI mode.
    const detailsToolbarConfig = [
      { width : 6 },
      { id : "moduleTasks-deleteButton", view : "button", disabled : true,
        label : "Delete", width : "90", type : "iconButton",
        icon : "remove", click : () => { wxPIM.deleteHandler("Tasks"); }
      },
      { },
      { view : "button", label : "Save", width : "80",
        type : "iconButton", icon : "floppy-o",
        id : "moduleTasks-saveButton", disabled : true,
        click : function() {
          wxPIM.saveHandler("Tasks", [ "moduleTasks-detailsForm" ]);
        }
      },
      { width : 6 }
    ];
    if (wxPIM.uiType === "mobile") {
      detailsToolbarConfig.splice(1, 0,
        { view : "button", label : "Back To Summary", width : "170",
          type : "iconButton", icon : "arrow-left",
          hidden : (wxPIM.uiType === "desktop"),
          click : () => {
            $$("moduleTasks-itemsCell").show();
          }
        },
        { }
      );
    }

    // Details view config object.
    const detailsView = {
      id : "moduleTasks-details", minWidth : 350,
      rows : [
        /* Task details form. */
        { view : "form", id : "moduleTasks-detailsForm", borderless : true,
          elementsConfig : { view : "text", labelWidth : 100, bottomPadding : 20,
            on : { onChange : () => {
              $$("moduleTasks-saveButton")[$$("moduleTasks-detailsForm").validate() ?
                "enable" : "disable"]();
            } }
          },
          elements : [
            { name : "subject", label : "Subject", required : true,
              invalidMessage : "Subject is required",
              attributes : { maxlength : 50 }
            },
            { view : "text", name : "category", label : "Category",
              suggest : [
                { id : 1, value : "Personal" },
                { id : 2, value : "Business" },
                { id : 3, value : "Other" }
              ],
              on : {
                onItemClick : function() {
                  $$(this.config.suggest).show(this.getInputNode());
                }
              }
            },
            { view : "radio", name : "status", label : "Status", value : 1,
              id : "moduleTasks-category",
              options : [
                { id : 1, value : "Ongoing" }, { id : 2, value : "Completed" }
              ]
            },
            { view : "segmented", name : "priority", label : "Priority", value : 1,
              options : [
                { id : 1, value : "Low" },
                { id : 2, value : "Medium" },
                { id : 3, value : "High" }
              ]
            },
            { view : "datepicker", name : "dueDate", label : "Due Date",
              id : "moduleTasks-dueDate", required : true,
              invalidMessage : "Due Date is required"
            },
            { name : "comments", label : "Comments",
              attributes : { maxlength : 250 }
            }
          ]
        }, /* End task details form. */
        { },
        /* Task details toolbar. */
        { view : "toolbar", cols : detailsToolbarConfig }
      ] /* End task details cell rows. */
    };

    // Construct the base object.
    const baseObj =  { winWidth : 800, winHeight : 600, winLabel : "Tasks", winIcon : "tasks",
      id : "moduleTasks-container"
    };

    // Add either cells or cols, depending on UI mode.
    if (wxPIM.uiType === "mobile") {
      baseObj.cells = [ summaryView, detailsView ];
    } else {
      baseObj.cols = [ summaryView, { view : "resizer", }, detailsView ];
    }

    // Object is complete now.
    return baseObj;

  } /* End getUIConfig(). */


  /**
   * Called whenever this module becomes active.
   */
  activate() {
  } /* End activate(). */


  /**
   * Called whenever this module becomes inactive.
   */
  deactivate() {
  } /* End deactivate(). */


  /**
   * Handle clicks on the New button.
   */
  newHandler() {

    // We're adding a new task, so set the editing flag and create an ID.
    wxPIM.modules.Tasks.isEditingExisting = false;
    wxPIM.modules.Tasks.editingID = new Date().getTime();

    // Now show the details form and clear it, then set any defaults.  Don't
    // forget to disable the delete button since we obviously can't delete
    // during an add.
    $$("moduleTasks-details").show();
    $$("moduleTasks-detailsForm").clear();
    $$("moduleTasks-category").setValue(1);
    $$("moduleTasks-deleteButton").disable();

    // Finally, enable the details view.
    $$("moduleTasks-details").enable();

  } /* End newHandler(). */


  /**
   * Handles clicks on the Save button.
   */
  editExisting(inID) {

    // Get the task from local storage and set it on the form.  If we can't
    // find it then that means the user clicked a category node.  In that case,
    // we're just going to toggle it's open/close state.
    const tasks = JSON.parse(localStorage.getItem("TasksDB"));
    const task = tasks[inID];
    if (!task) {
      if ($$("moduleTasks-items").isBranchOpen(inID)) {
        $$("moduleTasks-items").close(inID);
      } else {
        $$("moduleTasks-items").open(inID);
      }
      return;
    }

    // Set flag to indicate editing an existing task and show the details.
    wxPIM.modules.Tasks.isEditingExisting = true;
    wxPIM.modules.Tasks.editingID = inID;

    // Clear the details form.
    $$("moduleTasks-detailsForm").clear();

    // Show the form.  Note that this has to be done before the call to
    // setValues() below otherwise we get an error due to setting the value of
    // the richtext (my guess is it lazy-builds the DOM and it's not actually
    // there until the show() executes.
    $$("moduleTasks-details").show();

    // Special handling for dates.
    if (task.dueDate) {
      task.dueDate = new Date(task.dueDate);
    }

    // Populate the form.
    $$("moduleTasks-detailsForm").setValues(task);

    // Enable the delete button.
    $$("moduleTasks-deleteButton").enable();

    // Finally, enable the details view.
    $$("moduleTasks-details").enable();

   } /* End editExisting(). */


  /**
   * Refresh the tasks list from local storage.
   */
  refreshData() {

    // Get the collection of data items from local storage.  If none,
    // create it now.
    const dataItems = wxPIM.getModuleData("Tasks");

    // Right now, we've got an object that's just a flat list of tasks.  We need
    // to create hierarchical data from this so the tree can consume it.  So,
    // for each task, we pull out the category and add a member to an object for
    // it.  Then, the task gets added to the data array for that category.  We'll
    // wind up with an object that has properties, one for each category, and the
    // data array for each contains the tasks within that category.
    const tasksData = { };
    for (const taskID in dataItems) {
      if (dataItems.hasOwnProperty(taskID)) {
        const task = dataItems[taskID];
        if (!tasksData[task.category]) {
          tasksData[task.category] = {
            $css : { padding : "10px" }, value : task.category,
            open : true, data : [ ]
          };
        }
        tasksData[task.category].data.push(
          { $css : {
              padding : "10px", margin : "10px", "border-radius" : "10px",
              "background-color" : (task.status === 1 ? "#ffe0e0" : "#e0ffe0")
            },
            id : task.id, value : task.subject
          }
        );
      }
    }

    // Get the items as an array of objects.
    const itemsAsArray = wxPIM.objectAsArray(tasksData);

    // Sort the array by the value property (ascending) so they appear in
    // alphabetical order.
    wxPIM.sortArray(itemsAsArray, "value", "A");

    // Populate the tree.
    $$("moduleTasks-items").clearAll();
    $$("moduleTasks-items").parse(itemsAsArray);

    // Clear the form and disable the details view until it's needed.  This is done becasue
    // of the add/update/delete case when in desktop mode.
    $$("moduleTasks-detailsForm").clear();
    $$("moduleTasks-details").disable();

  } /* End refreshData(). */


  /**
   * Service requests from day-at-a-glance to present data for this module.
   */
  dayAtAGlance() {

    // Add a section to the day-at-a-glance body for this module if there isn't one already.
    if (!$$("dayAtAGlanceScreen_Tasks")) {
      $$("dayAtAGlanceBody").addView({
        view : "fieldset", label : "Tasks",
        body : { id : "dayAtAGlanceScreen_Tasks",  rows : [ ] }
      });
      $$("dayAtAGlanceBody").addView({ height : 20 });
    }

    // Populate the day-at-a-glance screen.
    const template = webix.template("#subject#");
    let dataItems = wxPIM.getModuleData("Tasks");
    dataItems = wxPIM.objectAsArray(dataItems);
    wxPIM.sortArray(dataItems, "value", "A");
    const currentDate = new Date().setHours(0, 0, 0, 0);
    const rows = [ ];
    for (let i = 0; i < dataItems.length; i++) {
      const item = dataItems[i];
      const itemDate = new Date(item.dueDate).setHours(0, 0, 0, 0);
      if (itemDate == currentDate) {
        if (item.status == 1) {
          item.status = "Ongoing";
        } else {
          item.status = "Completed";
        }
        item.dueDate = webix.i18n.timeFormatStr(new Date(item.dueDate));
        rows.push({ borderless : true, template : template(item), height : 30 });
      }
    }
    webix.ui(rows, $$("dayAtAGlanceScreen_Tasks"));

  } /* End dayAtAGlance(). */


}; /* End Tasks class. */
