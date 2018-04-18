"use strict";


// "Register" this module with wxPIM.
wxPIM.registeredModules.push("Appointments");


wxPIM.moduleClasses.Appointments = class {


  /**
   * Constructor.
   */
  constructor() {

    // Flag set to true when editing an existing item, false when adding a new one.
    this.isEditingExisting = false;

    // The ID of the item being edited in the current module, if any.
    this.editingID = null;

    // Store the appointments for the selected date, if any.
    this.currentData = { };

  } /* End constructor. */


  /**
   * Return the module's UI config object.
   */
  getUIConfig() {

    return {
      winWidth : 800, winHeight : 600, winLabel : "Appointments", winIcon : "calendar",
      id : "moduleAppointments-container",
      cells : [
        /* ---------- Appointment list cell. ---------- */
        { id : "moduleAppointments-itemsCell",
          rows : [
            { view : "calendar", id : "moduleAppointments-items", width : 0, height : 0,
              weekHeader : true, events : webix.Date.isHoliday,
              dayTemplate : this.dayTemplate,
              on : {
                onAfterDateSelect : this.selectDateHandler,
              }
            },
            /* Appointment list toolbar. */
            { view : "toolbar",
              cols : [
                { },
                { view : "button", label : "New", width : "80", type : "iconButton",
                  icon : "plus", click : this.newHandler.bind(this)
                },
                { width : 6 }
              ] /* End toolbar items. */
            } /* End toolbar. */
          ] /* End appointment list rows. */
        }, /* End appointment list cell. */
        /* ---------- Appointment details cell. ---------- */
        { id : "moduleAppointments-details",
          rows : [
            /* Appointment details form. */
            { view : "form", id : "moduleAppointments-detailsForm", borderless : true,
              elementsConfig : { view : "text", labelWidth : 100, bottomPadding : 20,
                on : { onChange : () => {
                  $$("moduleAppointments-saveButton")
                    [$$("moduleAppointments-detailsForm").validate()? "enable" : "disable"]();
                } }
              },
              elements : [
                { name : "subject", label : "Subject", required : true,
                  invalidMessage : "Subject is required", attributes : { maxlength : 100 }
                },
                { view : "text", name : "category", label : "Category",
                  suggest : [
                    { id : 1, value : "Personal" }, { id : 2, value : "Business" },
                    { id : 3, value : "Other" }
                  ],
                  on : {
                    onItemClick : () => {
                      $$(this.config.suggest).show(this.getInputNode());
                    }
                  }
                },
                { view : "datepicker", name : "when", label : "When", required : true,
                  invalidMessage : "When is required", timepicker : true
                },
                { name : "location", label : "Location", attributes : { maxlength : 200 } },
                { view : "slider", name : "attendees", label : "Attendees",
                  min : 1, max : 100, step : 1, title : "#value#",
                  id : "moduleAppointments-attendees"
                },
                { name : "notes", label : "Notes", attributes : { maxlength : 250 } }
              ]
            }, /* End appointment details form. */
            { },
            /* Appointment details toolbar. */
            { view : "toolbar",
              cols : [
                { width : 6 },
                { view : "button", label : "Back To Summary", width : "170",
                  type : "iconButton", icon : "arrow-left",
                  click : () => {
                    $$("moduleAppointments-itemsCell").show();
                  }
                },
                { },
                { id : "moduleAppointments-deleteButton", view : "button", label : "Delete",
                  width : "90", type : "iconButton",
                  icon : "remove", click : () => { wxPIM.deleteHandler("Appointments"); }
                },
                { },
                { view : "button", label : "Save", width : "80", type : "iconButton",
                  icon : "floppy-o", id : "moduleAppointments-saveButton", disabled : true,
                  click : function() {
                    wxPIM.saveHandler("Appointments", [ "moduleAppointments-detailsForm" ]);
                  }
                },
                { width : 6 }
              ]
            } /* End appointment details toolbar. */
          ] /* End appointment details cell rows. */
        } /* End appointment details cell. */
      ] /* End main layout cells. */
    };

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

    // Close the date details window.
    if ($$("moduleAppointments-dateWindow")) {
      $$("moduleAppointments-dateWindow").close();
    }

  } /* End deactivate(). */


  /**
   * Handle clicks on the New button.
   */
  newHandler() {

    // We're adding a new appointment, so set the editing flag and create an ID.
    wxPIM.modules.Appointments.isEditingExisting = false;
    wxPIM.modules.Appointments.editingID = "" + new Date().getTime();

    // Close the date details window.
    if ($$("moduleAppointments-dateWindow")) {
      $$("moduleAppointments-dateWindow").close();
    }

    // Now show the details form and clear it, then set any defaults.  Don't forget to
    // disable the delete button since we obviously can't delete during an add.
    $$("moduleAppointments-details").show();
    $$("moduleAppointments-detailsForm").clear();
    $$("moduleAppointments-attendees").setValue(1);
    $$("moduleAppointments-deleteButton").disable();

  } /* End newHandler(). */


  /**
   * Handles clicks on the Save button.
   */
  editExisting(inID) {

    // Close the date details window.
    if ($$("moduleAppointments-dateWindow")) {
      $$("moduleAppointments-dateWindow").close();
    }

    // Get the appointment from local storage and set it on the form.
    const appointments = JSON.parse(localStorage.getItem("AppointmentsDB"));
    const appointment = appointments[inID];

    // Set flag to indicate editing an existing appointment and show the details.
    wxPIM.modules.Appointments.isEditingExisting = true;
    wxPIM.modules.Appointments.editingID = inID;

    // Clear the details form.
    $$("moduleAppointments-detailsForm").clear();

    // Show the form.  Note that this has to be done before the call to setValues()
    // below otherwise we get an error due to setting the value of the richtext (my
    // guess is it lazy-builds the DOM and it's not actually there until the show()
    // executes).
    $$("moduleAppointments-details").show();

    // Special handling for dates.
    if (appointment.when) {
      appointment.when = new Date(appointment.when);
    }

    // Populate the form.
    $$("moduleAppointments-detailsForm").setValues(appointment);

    // Finally, enable the delete button.
    $$("moduleAppointments-deleteButton").enable();

   } /* End editExisting(). */


  /**
   * Refresh the appointments list from local storage.
   */
  refreshData() {

    // First, get the data for this module.  Then, create a new object from it where
    // the keys are normalized (without time component) dates and store the object on
    // the module class instance.
    const dataItems = wxPIM.getModuleData("Appointments");
    wxPIM.modules.Appointments.currentData = { };
    for (const key in dataItems) {
      if (dataItems.hasOwnProperty(key)) {
        const item = dataItems[key];
        wxPIM.modules.Appointments.currentData[new Date(item.when).setHours(0, 0, 0, 0)] =
          item;
      }
    }

    // Now, have the summary calendar refresh itself using the new data object.
    $$("moduleAppointments-items").refresh();

  } /* End refreshData(). */


  /**
   * Function used to render days on the summary calendar.
   *
   * @param  inDate The current date of the day being rendered.
   * @return        The HTML to render for the date.
   */
  dayTemplate(inDate) {

      /* Style for days with appointments. */
    const cssDayMarker = `
      background-color : #ff0000;
      border-radius : 50%;
      height : 8px;
      margin : 0 auto 8px;
      width : 8px;
      position : relative;
      top : -25px;
    `;

    // Get the date being rendered, normalized with no time component.
    const thisDate = new Date(inDate).setHours(0, 0, 0, 0);

    // See if we have any appointments for this date.
    const appointment = wxPIM.modules.Appointments.currentData[thisDate];

    // Start the template.
    let html = `<div class="day">${inDate.getDate()}</div>`;

    // Add the marker if there is even one appointment on this day.
    if (appointment) {
      html += `<div style="${cssDayMarker}"></div>`;
    }

    // And we're done!
    return html;

  }


  /**
   * Called when the user clicks on a date in the calendar.
   *
   * @param inDate The selected date.
   */
  selectDateHandler(inDate) {

    // Get the list of appointments from local storage.
    const appointments = wxPIM.getModuleData("Appointments");

    // Get the selected date, minus time component.
    const selectedDate = new Date(inDate).setHours(0, 0, 0, 0);

    // For each appointment, see if it's when date matches the selected date and
    // add it to an array if so.
    const listData = [ ];
    for (const key in appointments) {
      if (appointments.hasOwnProperty(key)) {
        const appointment = appointments[key];
        const appointmentDate = new Date(appointment.when).setHours(0, 0, 0, 0);
        if (appointmentDate == selectedDate) {
          listData.push(appointment);
        }
      }
    }

    // If the date window is currently open then close it (to avoid duplicates).
    if ($$("moduleAppointments-dateWindow")) {
      $$("moduleAppointments-dateWindow").close();
    }

    // Now create a window for this date.
    webix.ui({
      view : "window", id : "moduleAppointments-dateWindow", width : 300, height : 284,
      position : "center",
      head : {
        view : "toolbar",
        cols : [
          { view : "label", label : inDate.toLocaleDateString() },
          { view : "icon", icon : "times-circle",
            click : function() { $$("moduleAppointments-dateWindow").close(); }
          }
        ]
      },
      body : function() {
        // If there's no appointments for this day then say so.
        if (listData.length == 0) {
          return { rows : [
            { },
            { borderless : true,
              template : `<div style="text-align: center;">Nothing on this day</span>`
            },
            { }
          ] };
        // If there is, show them as a list.
        } else {
          return {
            view : "list", id : "appAppointments-itemsList", data : listData,
            template : "#subject#", click : wxPIM.modules.Appointments.editExisting,
          };
        }
      }()
    }).show();

  } /* End selectDateHandler(). */


  /**
   * Service requests from day-at-a-glance to present data for this module.
   */
  dayAtAGlance() {

    // Add a section to the day-at-a-glance body for this module if there isn't one already.
    if (!$$("dayAtAGlanceScreen_Appointments")) {
      $$("dayAtAGlanceBody").addView({
        view : "fieldset", label : "Appointments",
        body : { id : "dayAtAGlanceScreen_Appointments",  rows : [ ] }
      });
      $$("dayAtAGlanceBody").addView({ height : 20 });
    }

    // Populate the day-at-a-glance screen.
    const template = webix.template("#subject# - #when# #location#");
    let dataItems = wxPIM.getModuleData("Appointments");
    dataItems = wxPIM.objectAsArray(dataItems);
    wxPIM.sortArray(dataItems, "when", "A");
    const currentDate = new Date().setHours(0, 0, 0, 0);
    const rows = [ ];
    for (let i = 0; i < dataItems.length; i++) {
      const item = dataItems[i];
      const itemDate = new Date(item.when).setHours(0, 0, 0, 0);
      if (itemDate == currentDate) {
        if (item.location) {
          item.location = "(" + item.location + ")";
        } else {
          item.location = "";
        }
        item["when"] = webix.i18n.timeFormatStr(new Date(item.when));
        rows.push({ borderless : true, template : template(item), height : 30 });
      }
    }
    webix.ui(rows, $$("dayAtAGlanceScreen_Appointments"));

  } /* End dayAtAGlance(). */


}; /* End Appointments class. */
