/*
    OrganizerExt - From the book "Practical Ext JS Projects With Gears"
    Copyright (C) 2008 Frank W. Zammetti
    fzammetti@omnytex.com

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see http://www.gnu.org/licenses.
*/


/**
 * The main class for the application.
 */
function OrganizerExt() {


  /**
   * The currently active category.
   */
  this.currentCategory = "appointments";


  /**
   * The data stores for the four categories.
   */
  this.notesStore = null;
  this.tasksStore = null;
  this.contactsStore = null;
  this.appointmentsStore = null;


  /**
   * The record descriptors for the four categories.
   */
  this.NoteRecord = null;
  this.TaskRecord = null;
  this.ContactRecord = null;
  this.AppointmentRecord = null;


  /**
   * The list of categories valid for a given note, task,
   * appointment or contact.
   */
  this.categoryList = [
    "Competition", "Family", "Favorites", "Gifts", "Goals/Objectives",
    "Holiday", "Home", "Hot Contacts", "Ideas", "International",  "Key Custom",
    "Medical", "Meeting", "Miscellaneous", "Other",  "Personal", "Phone Calls",
    "Status", "Strategies", "Suppliers", "Time And Expenses", "VIP", "Waiting",
    "Work"
  ];


  /**
   * Called to initialize the application.
   */
  this.init = function() {

    // Show please wait dialog.
    new Ext.Window({
      applyTo : "dialogPleaseWait", closable : false, modal : true,
      width : 200, height : 100, minimizable : false, resizable : false,
      draggable : false, shadowOffset : 8, id : "dialogPleaseWait"
    }).show(Ext.getDom("divSource"));
    // Timeout to give the dialog time to show.
    setTimeout("organizerExt.initMain()", 500);

  } // End init().


  /**
   * The main initialization tasks, kicked off by init().
   */
  this.initMain = function() {

    // Test to see if Gears is available, abort if not.
    if (!testForGears()) { return; }

    // Create the data stores for each of the four categories.
    createDataStores();

    // Create record descriptors for each of the four categories.
    createRecordDescriptors();

    // Populate the stores for each of the four categories.
    populateStores();

    // Create the New Note dialog.
    createNewNoteDialog();

    // Create the New Task dialog.
    createNewTaskDialog();

    // Create the New Contact dialog.
    createNewContactDialog();

    // Create the New Appointment dialog.
    createNewAppointmentDialog();

    // Turn on validation errors beside the field globally and enable tooltips.
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = "side";


    // Build the main UI itself.
    buildUI();

    // All done, hide please wait, set flag to indicate initialization has
    // completed, and we're ready to go.
    Ext.getCmp("dialogPleaseWait").destroy();

  } // End initMain().


  /**
   * Tests to see if Gears is available for our use.
   *
   * @return True is Gears is available, false if not.
   */
  var testForGears = function() {

    // Test for Gears, show dialog and abort initialization if not available.
    if (!dao.init()) {
      Ext.getCmp("dialogPleaseWait").destroy();
      var dialogNoGears = new Ext.Window({
        applyTo : "dialogNoGears", closable : false, modal : true,
        width : 400, height : 220, minimizable : false, resizable : false,
        draggable : false, shadowOffset : 8, closeAction : "hide",
        buttons : [{
          text : "Ok",
          handler : function() {
            dialogNoGears.hide();
          }
        }]
      });
      dialogNoGears.show(Ext.getDom("divSource"));
      return false;
    } else {
      return true;
    }

  } // End testForGears().


  /**
   * Create the data stores for each of the four categories.
   */
  var createDataStores = function() {

    // Create data store for notes.
    organizerExt.notesStore = new Ext.data.Store({
      listeners : {
        "add" : {
          fn : function(inStore, inRecords, inIndex) {
            // Ignore event when initializing application.
            if (Ext.getCmp("dialogPleaseWait")) { return; }
            dao.createNote({
              id : new Date().getTime(),
              category : inRecords[0].get("category"),
              content : inRecords[0].get("content")
            });
          }
        },
        "remove" : {
          fn : function(inStore, inRecord, inIndex) {
            dao.deleteNote( { id : inRecord.get("id") } );
          }
        }
      }
    });

    // Create data store for tasks.
    organizerExt.tasksStore = new Ext.data.Store({
      listeners : {
        "add" : {
          fn : function(inStore, inRecords, inIndex) {
            // Ignore event when initializing application.
            if (Ext.getCmp("dialogPleaseWait")) { return; }
            dao.createTask({
              id : new Date().getTime(),
              status : inRecords[0].get("status"),
              category : inRecords[0].get("category"),
              content : inRecords[0].get("content")
            });
          }
        },
        "update" : {
          fn : function(inStore, inRecord, inOperation) {
            dao.updateTask({
              id : inRecord.get("id"), category : inRecord.get("category"),
              status : inRecord.get("status"), content : inRecord.get("content")
            });
            organizerExt.showTaskDetails(inRecord);
          }
        },
        "remove" : {
          fn : function(inStore, inRecord, inIndex) {
            dao.deleteTask( { id : inRecord.get("id") } );
          }
        }
      }
    });

    // Create data store for contacts.
    organizerExt.contactsStore = new Ext.data.Store({
      listeners : {
        "add" : {
          fn : function(inStore, inRecords, inIndex) {
            // Ignore event when initializing application.
            if (Ext.getCmp("dialogPleaseWait")) { return; }
            dao.createContact({
              id : new Date().getTime(),
              category : inRecords[0].get("category"),
              company : inRecords[0].get("company"),
              firstname : inRecords[0].get("firstname"),
              lastname : inRecords[0].get("lastname"),
              phonenumber : inRecords[0].get("phonenumber"),
              cellnumber : inRecords[0].get("cellnumber"),
              faxnumber : inRecords[0].get("faxnumber"),
              email : inRecords[0].get("email"),
              note : inRecords[0].get("note")
            });
          }
        },
        "remove" : {
          fn : function(inStore, inRecord, inIndex) {
            dao.deleteContact( { id : inRecord.get("id") } );
          }
        }
      }
    });

    // Create data store for appointments.
    organizerExt.appointmentsStore = new Ext.data.Store({
      listeners : {
        "add" : {
          fn : function(inStore, inRecords, inIndex) {
            // Ignore event when initializing application.
            if (Ext.getCmp("dialogPleaseWait")) { return; }
            dao.createAppointment({
              id : new Date().getTime(),
              title : inRecords[0].get("title"),
              category : inRecords[0].get("category"),
              whendt : inRecords[0].get("whendt"),
              location : inRecords[0].get("location"),
              note : inRecords[0].get("note")
            });
          }
        },
        "remove" : {
          fn : function(inStore, inRecord, inIndex) {
            dao.deleteAppointment( { id : inRecord.get("id") } );
          }
        }
      }
    });

  } // End createDataStores().


  /**
   * Create the Record type that describes each of the four types of items.
   */
  var createRecordDescriptors = function() {

    // Create record descriptor for note.
    organizerExt.NoteRecord = Ext.data.Record.create([
      { name : "id", mapping : "id" },
      { name : "category", mapping : "category" },
      { name : "content", mapping : "content" },
      { name : "type", mapping : "type" }
    ]);

    // Create record descriptor for task.
    organizerExt.TaskRecord = Ext.data.Record.create([
      { name : "id", mapping : "id" },
      { name : "category", mapping : "category" },
      { name : "content", mapping : "content" },
      { name : "status", mapping : "status" },
      { name : "type", mapping : "type" }
    ]);

    // Create record descriptor for contact.
    organizerExt.ContactRecord = Ext.data.Record.create([
      { name : "id", mapping : "id" },
      { name : "category", mapping : "category" },
      { name : "company", mapping : "company" },
      { name : "firstname", mapping : "firstname" },
      { name : "lastname", mapping : "lastname" },
      { name : "phonenumber", mapping : "phonenumber" },
      { name : "cellnumber", mapping : "cellnumber" },
      { name : "faxnumber", mapping : "faxnumber" },
      { name : "email", mapping : "email" },
      { name : "note", mapping : "note" },
      { name : "type", mapping : "type" }
    ]);

    // Create record descriptor for appointment.
    organizerExt.AppointmentRecord = Ext.data.Record.create([
      { name : "id", mapping : "id" },
      { name : "title", mapping : "title" },
      { name : "category", mapping : "category" },
      { name : "whendt", mapping : "whendt" },
      { name : "location", mapping : "location" },
      { name : "note", mapping : "note" },
      { name : "type", mapping : "type" }
    ]);

  } // End createRecordDescriptors().


  /**
   * Called during initialization to read the data for each of the four
   * categories from the database and populate the stores.
   */
  var populateStores = function() {

    // Populate notes.
    var retrievedNotes = dao.retrieveNotes();
    for (var i = 0; i < retrievedNotes.length; i++) {
      organizerExt.notesStore.add(
        new organizerExt.NoteRecord({
          id : retrievedNotes[i].id,
          category : retrievedNotes[i].category, type : "Note",
          content : retrievedNotes[i].content
        })
      );
    }

    // Populate tasks.
    var retrievedTasks = dao.retrieveTasks();
    for (var i = 0; i < retrievedTasks.length; i++) {
      organizerExt.tasksStore.add(
        new organizerExt.TaskRecord({
          id : retrievedTasks[i].id,
          category : retrievedTasks[i].category, type : "Task",
          content : retrievedTasks[i].content,
          status : retrievedTasks[i].status
        })
      );
    }

    // Populate contacts.
    var retrievedContacts = dao.retrieveContacts();
    for (var i = 0; i < retrievedContacts.length; i++) {
      organizerExt.contactsStore.add(
        new organizerExt.ContactRecord({
          id : retrievedContacts[i].id,
          category : retrievedContacts[i].category, type : "Contact",
          company : retrievedContacts[i].company,
          firstname : retrievedContacts[i].firstname,
          lastname : retrievedContacts[i].lastname,
          phonenumber : retrievedContacts[i].phonenumber,
          cellnumber : retrievedContacts[i].cellnumber,
          faxnumber : retrievedContacts[i].faxnumber,
          email : retrievedContacts[i].email,
          note : retrievedContacts[i].note
        })
      );
    }

    // Populate appointments.
    var retrievedAppointments = dao.retrieveAppointments();
    for (var i = 0; i < retrievedAppointments.length; i++) {
      organizerExt.appointmentsStore.add(
        new organizerExt.AppointmentRecord({
          id : retrievedAppointments[i].id,
          category : retrievedAppointments[i].category, type : "Appointment",
          title : retrievedAppointments[i].title,
          whendt : retrievedAppointments[i].whendt,
          location : retrievedAppointments[i].location,
          note : retrievedAppointments[i].note
        })
      );
    }

  } // End populateStores().


  /**
   * Creates the dialog window for adding a new note.
   */
  var createNewNoteDialog = function() {

    // Create the FormPanel to hold the dialogs' form.
    var createNoteFormPane = new Ext.FormPanel({
      id : "createNoteFormPane", monitorValid : true,
      frame : true, labelWidth : 70, width : 400, autoheight : true,
      /* Entry fields. */
      items : [
        {
          xtype : "combo", fieldLabel : "Category", name : "category",
          width : 280, allowBlank : false, editable : false,
          triggerAction : "all",
          mode : "local", store : organizerExt.categoryList
        },
        {
          xtype : "textarea",  fieldLabel : "Content",
          name : "content", width : 280, height : 230,
          allowBlank : false
        }
      ]
    });

    // Add buttons to the FormPanel.
    createNoteFormPane.addButton( { text : "Create", formBind : true},
      function() {
        var vals = Ext.getCmp("createNoteFormPane").getForm().getValues();
        var newNoteRecord = new organizerExt.NoteRecord({
          category : vals.category, content : vals.content, type : "Note",
          id : 0
        });
        organizerExt.notesStore.add(newNoteRecord);
        Ext.getCmp("dialogCreateNote").hide();
      }
    );
    createNoteFormPane.addButton("Cancel", function() {
      Ext.getCmp("dialogCreateNote").hide();
    });

    // Create the dialog window itself.
    new Ext.Window({
      title : "Create Note", closable : true, modal : true,
      width : 400, height : 340, minimizable : false, resizable : false,
      draggable : true, shadowOffset : 8, items : [ createNoteFormPane ],
      closeAction : "hide", id : "dialogCreateNote"
    });

  } // End createNewNoteDialog().


  /**
   * Creates the dialog window for adding a new task.
   */
  var createNewTaskDialog = function() {

    // Create the FormPanel to hold the dialogs' form.
    var createTaskFormPane = new Ext.FormPanel({
      id : "createTaskFormPane",
      frame : true, labelWidth : 70, width : 400, autoheight : true,
      monitorValid : true,
      /* Entry fields. */
      items : [
        {
          xtype : "combo", fieldLabel : "Category", name : "category",
          width : 280, allowBlank : false, editable : false,
          triggerAction : "all",
          mode : "local", store : organizerExt.categoryList
        },
        {
          xtype : "textarea",  fieldLabel : "Content",
          name : "content", width : 280, height : 230, allowBlank : false
        }
      ]
    });

    // Add buttons to the FormPanel.
    createTaskFormPane.addButton( { text : "Create", formBind : true},
      function() {
        var vals = Ext.getCmp("createTaskFormPane").getForm().getValues();
        var newTaskRecord = new organizerExt.TaskRecord({
          category : vals.category, content : vals.content, type : "Task",
          status : DAO.TASK_STATUS_ACTIVE, id : 0
        });
        organizerExt.tasksStore.add(newTaskRecord);
        Ext.getCmp("dialogCreateTask").hide();
      }
    );
    createTaskFormPane.addButton("Cancel", function() {
      Ext.getCmp("dialogCreateTask").hide();
    });

    // Create the dialog window itself.
    new Ext.Window({
      title : "Create Task", closable : true, modal : true,
      width : 400, height : 340, minimizable : false, resizable : false,
      draggable : true, shadowOffset : 8, items : [ createTaskFormPane ],
      closeAction : "hide", id : "dialogCreateTask"
    });

  } // End createNewTaskDialog().


  /**
   * Creates the dialog window for adding a new contact.
   */
  var createNewContactDialog = function() {

    // Create the FormPanel to hold the dialogs' form.
    var createContactFormPane = new Ext.FormPanel({
      id : "createContactFormPane",
      frame : true, labelWidth : 100, width : 400, autoheight : true,
      monitorValid : true,
      /* Entry fields. */
      items : [
        {
          xtype : "combo", fieldLabel : "Category", name : "category",
          width : 250, allowBlank : false, editable : false,
          triggerAction : "all",
          mode : "local", store : organizerExt.categoryList
        },
        {
          xtype : "textfield", fieldLabel : "Company",
          name : "company", width : 250
        },
        {
          xtype : "textfield", fieldLabel : "First Name",
          name : "firstname", width : 250, allowBlank : false
        },
        {
          xtype : "textfield", fieldLabel : "Last Name",
          name : "lastname", width : 250, allowBlank : false
        },
        {
          xtype : "textfield", fieldLabel : "Phone Number",
          name : "phonenumber", width : 250
        },
        {
          xtype : "textfield", fieldLabel : "Cell Number",
          name : "cellnumber", width : 250
        },
        {
          xtype : "textfield", fieldLabel : "FAX Number",
          name : "faxnumber", width : 250
        },
        {
          xtype : "textfield", fieldLabel : "eMail Address",
          name : "email", width : 250, vtype : "email"
        },
        {
          xtype : "textarea",  fieldLabel : "Note",
          name : "note", width : 250, height : 50
        }
      ]
    });

    // Add buttons to the FormPanel.
    createContactFormPane.addButton( { text : "Create", formBind : true},
      function() {
        var vals = Ext.getCmp("createContactFormPane").getForm().getValues();
        var newContactRecord = new organizerExt.ContactRecord({
          category : vals.category, company : vals.company,
          firstname : vals.firstname, lastname : vals.lastname,
          phonenumber : vals.phonenumber, cellnumber : vals.cellnumber,
          faxnumber : vals.faxnumber, email : vals.email, note : vals.note,
          type : "Contact", id : 0
        });
        organizerExt.contactsStore.add(newContactRecord);
        Ext.getCmp("dialogCreateContact").hide();
      }
    );
    createContactFormPane.addButton("Cancel", function() {
      Ext.getCmp("dialogCreateContact").hide();
    });

    // Create the dialog window itself.
    new Ext.Window({
      title : "Create Contact", closable : true, modal : true,
      width : 400, height : 340, minimizable : false, resizable : false,
      draggable : true, shadowOffset : 8, items : [ createContactFormPane ],
      closeAction : "hide", id : "dialogCreateContact"
    });

  } // End createNewContactDialog().


  /**
   * Creates the dialog window for adding a new appointment.
   */
  var createNewAppointmentDialog = function() {

    // Create the FormPanel to hold the dialogs' form.
    var createAppointmentFormPane = new Ext.FormPanel({
      id : "createAppointmentFormPane",
      frame : true, labelWidth : 100, width : 400, autoheight : true,
      monitorValid : true,
      /* Entry fields. */
      items : [
        {
          xtype : "textfield", fieldLabel : "Title",
          name : "title", width : 250, allowBlank : false
        },
        {
          xtype : "combo", fieldLabel : "Category", name : "category",
          width : 250, allowBlank : false, editable : false,
          triggerAction : "all",
          mode : "local", store : organizerExt.categoryList
        },
        {
          xtype : "datefield", fieldLabel : "When",
          name : "whendt", width : 250, allowBlank : false
        },
        {
          xtype : "textfield", fieldLabel : "Location",
          name : "location", width : 250
        },
        {
          xtype : "textarea",  fieldLabel : "Note",
          name : "note", width : 250, height : 152
        }
      ]
    });

    // Add buttons to the FormPanel.
    createAppointmentFormPane.addButton( { text : "Create", formBind : true},
      function() {
        var vals = Ext.getCmp("createAppointmentFormPane").getForm().getValues();
        vals.whendt = Date.parseDate(vals.whendt, "m/d/Y");
        var newAppointmentRecord = new organizerExt.AppointmentRecord({
          title : vals.title, category : vals.category, whendt : vals.whendt,
          location : vals.location, note : vals.note, type : "Appointment",
          id : 0
        });
        organizerExt.appointmentsStore.add(newAppointmentRecord);
        Ext.getCmp("dialogCreateAppointment").hide();
      }
    );
    createAppointmentFormPane.addButton("Cancel", function() {
      Ext.getCmp("dialogCreateAppointment").hide();
    });

    // Create the dialog window itself.
    new Ext.Window({
      title : "Create Appointment", closable : true, modal : true,
      width : 400, height : 340, minimizable : false, resizable : false,
      draggable : true, shadowOffset : 8, items : [ createAppointmentFormPane ],
      closeAction : "hide", id : "dialogCreateAppointment"
    });

  } // End createNewAppointmentDialog().


  /**
   * Build the user interface of the application.
   */
  var buildUI = function() {

    // Create UI.
    var vp = new Ext.Viewport({
      layout : "border",
      items  : [{
        // Categories accordion on left side of screen.
        region : "west", id : "categoriesArea", title : "Categories",
        split : true, width : 260, minSize : 10, maxSize : 260,
        collapsible : true, layout : "accordion",
        // Applied to each contained panel.
        defaults: { bodyStyle : "overflow:auto;padding:10px;" },
        layoutConfig : { animate : true },
        items : [
          {
            // Appointments category.
            listeners : {
              /* Change category when pane is expanded. */
              "expand" : {
                fn : function() { organizerExt.changeCategory("appointments"); }
              }
            },
            id : "appointmentsArea", title : "Appointments",
            items : [
              { xtype : "label", text : "Filter:" },
              { xtype : "label", html : "<br><br>" },
              {
                xtype : "radiogroup", columns : 1,
                items : [
                  { boxLabel : "Show All", name : "appointmentsFilterType",
                    inputValue : 1, checked : true,
                    listeners : {
                      "check" : function(inCheckbox, inChecked) {
                        if (inChecked) {
                          organizerExt.appointmentsStore.filterBy(
                            function(inRecord, inIndex) {
                              return true;
                            }
                          );
                        }
                      }
                    }
                   },
                  { boxLabel : "Show Date:",
                    name : "appointmentsFilterType", inputValue : 2,
                    listeners : {
                      "check" : function(inCheckbox, inChecked) {
                        var afcDatePicker =
                          Ext.getCmp("appointmentsDatePicker");
                        if (inChecked) {
                          afcDatePicker.enable();
                        } else {
                          afcDatePicker.disable();
                          afcDatePicker.setValue(new Date());
                        }
                      }
                    }
                  }
                ]
              },
              {
                xtype : "datepicker", id : "appointmentsDatePicker",
                disabled : true,
                listeners : {
                  "select" : function(inPicker, inDate) {
                    organizerExt.appointmentsStore.filterBy(
                      function(inRecord, inIndex) {
                        var whendt = inRecord.get("whendt");
                        if (whendt.getMonth() == inDate.getMonth() &&
                          whendt.getDate() == inDate.getDate() &&
                          whendt.getFullYear() == inDate.getFullYear()) {
                          return true;
                        } else {
                          return false;
                        }
                      }
                    );
                  }
                }
              }
            ],
            border : false, cls : "cssDefault"
          },
          {
            // Notes category.
            listeners : {
              /* Change category when pane is expanded. */
              "expand" : {
                fn : function() { organizerExt.changeCategory("notes"); }
              }
            },
            id : "notesArea", title : "Notes", border : false,
            cls : "cssDefault",
            /* Filter fields. */
            items : [
              { xtype : "label", text : "Filter:" },
              { xtype : "label", html : "<br><br>" },
              {
                xtype : "radiogroup", columns : 1,
                items : [
                  { boxLabel : "Show All", name : "notesFilterType",
                    inputValue : 1, checked : true,
                    listeners : {
                      "check" : function(inCheckbox, inChecked) {
                        if (inChecked) {
                          organizerExt.notesStore.filterBy(
                            function(inRecord, inIndex) {
                              return true;
                            }
                          );
                        }
                      }
                    }
                   },
                  { boxLabel : "Show Category:",
                    name : "notesFilterType", inputValue : 2,
                    listeners : {
                      "check" : function(inCheckbox, inChecked) {
                        var nfcCombo = Ext.getCmp("notesFilterCategory");
                        if (inChecked) {
                          nfcCombo.enable();
                        } else {
                          nfcCombo.disable();
                          nfcCombo.reset();
                        }
                      }
                    }
                  }
                ]
              },
              {
                xtype : "combo", id : "notesFilterCategory", editable : false,
                mode : "local", store : organizerExt.categoryList,
                disabled : true, triggerAction : "all",
                width : 150, listWidth : 168,
                listeners : {
                  "select" : function(inComboBox, inRecord, inIndex) {
                    organizerExt.notesStore.filterBy(
                      function(inRecord, inIndex) {
                        if (inRecord.get("category") ==
                          Ext.getCmp("notesFilterCategory").getValue()) {
                          return true;
                        } else {
                          return false;
                        }
                      }
                    );
                  }
                }
              }
            ]
          },
          {
            // Tasks category.
            listeners : {
              /* Change category when pane is expanded. */
              "expand" : {
                fn : function() { organizerExt.changeCategory("tasks"); }
              }
            },
            id : "tasksArea", title : "Tasks",
            border : false, cls : "cssDefault",
            /* Filter fields. */
            items : [
              { xtype : "label", text : "Filter:" },
              { xtype : "label", html : "<br><br>" },
              {
                xtype : "radiogroup", columns : 1,
                items : [
                  { boxLabel : "Show All", name : "tasksFilterType",
                    inputValue : 1, checked : true,
                    listeners : {
                      "check" : function(inCheckbox, inChecked) {
                        if (inChecked) {
                          organizerExt.tasksStore.filterBy(
                            function(inRecord, inIndex) {
                              return true;
                            }
                          );
                        }
                      }
                    }
                  },
                  { boxLabel : "Show Active", name : "tasksFilterType",
                    inputValue : 2,
                    listeners : {
                      "check" : function(inCheckbox, inChecked) {
                        if (inChecked) {
                          organizerExt.tasksStore.filterBy(
                            function(inRecord, inIndex) {
                              if (inRecord.get("status") ==
                                DAO.TASK_STATUS_ACTIVE) {
                                return true;
                              } else {
                                return false;
                              }
                            }
                          );
                        }
                      }
                    }
                  },
                  { boxLabel : "Show Complete",
                    name : "tasksFilterType", inputValue : 3,
                    listeners : {
                      "check" : function(inCheckbox, inChecked) {
                        if (inChecked) {
                          organizerExt.tasksStore.filterBy(
                            function(inRecord, inIndex) {
                              if (inRecord.get("status") ==
                                DAO.TASK_STATUS_COMPLETE) {
                                return true;
                              } else {
                                return false;
                              }
                            }
                          );
                        }
                      }
                    }
                  },
                  { boxLabel : "Show Category:",
                    name : "tasksFilterType", inputValue : 4,
                    listeners : {
                      "check" : function(inCheckbox, inChecked) {
                        var tfcCombo = Ext.getCmp("tasksFilterCategory");
                        if (inChecked) {
                          tfcCombo.enable();
                        } else {
                          tfcCombo.disable();
                          tfcCombo.reset();
                        }
                      }
                    }
                  }
                ]
              },
              {
                xtype : "combo", id : "tasksFilterCategory", editable : false,
                mode : "local", store : organizerExt.categoryList,
                disabled : true, triggerAction : "all",
                width : 150, listWidth : 168,
                listeners : {
                  "select" : function(inComboBox, inRecord, inIndex) {
                    organizerExt.tasksStore.filterBy(
                      function(inRecord, inIndex) {
                        if (inRecord.get("category") ==
                          Ext.getCmp("tasksFilterCategory").getValue()) {
                          return true;
                        } else {
                          return false;
                        }
                      }
                    );
                  }
                }
              }
            ]
          },
          {
            // Contacts category.
            listeners : {
              /* Change category when pane is expanded. */
              "expand" : {
                fn : function() { organizerExt.changeCategory("contacts"); }
              }
            },
            id : "contactsArea", title : "Contacts",
            border : false, cls : "cssDefault",
            /* Filter fields. */
            items : [
              { xtype : "label", text : "Filter:" },
              { xtype : "label", html : "<br><br>" },
              {
                xtype : "radiogroup", columns : 1,
                items : [
                  { boxLabel : "Show All", name : "contactsFilterType",
                    inputValue : 1, checked : true,
                    listeners : {
                      "check" : function(inCheckbox, inChecked) {
                        if (inChecked) {
                          organizerExt.contactsStore.filterBy(
                            function(inRecord, inIndex) {
                              return true;
                            }
                          );
                        }
                      }
                    }
                  },
                  { boxLabel : "Show last nams starting with A-C",
                     name : "contactsFilterType", inputValue : 2,
                    listeners : {
                      "check" : function(inCheckbox, inChecked) {
                        if (inChecked) {
                          organizerExt.contactsStore.filterBy(
                            function(inRecord, inIndex) {
                              var firstLetter = inRecord.get(
                                "lastname").charAt(0).toUpperCase();
                              if (firstLetter >= 'A' && firstLetter <= 'C') {
                                return true;
                              } else {
                                return false;
                              }
                            }
                          );
                        }
                      }
                    }
                  },
                  { boxLabel : "Show last nams starting with D-F",
                    name : "contactsFilterType", inputValue : 3,
                    listeners : {
                      "check" : function(inCheckbox, inChecked) {
                        if (inChecked) {
                          organizerExt.contactsStore.filterBy(
                            function(inRecord, inIndex) {
                              var firstLetter = inRecord.get(
                                "lastname").charAt(0).toUpperCase();
                              if (firstLetter >= 'D' && firstLetter <= 'F') {
                                return true;
                              } else {
                                return false;
                              }
                            }
                          );
                        }
                      }
                    }
                  },
                  { boxLabel : "Show last nams starting with G-I",
                    name : "contactsFilterType", inputValue : 4,
                    listeners : {
                      "check" : function(inCheckbox, inChecked) {
                        if (inChecked) {
                          organizerExt.contactsStore.filterBy(
                            function(inRecord, inIndex) {
                              var firstLetter = inRecord.get(
                                "lastname").charAt(0).toUpperCase();
                              if (firstLetter >= 'G' && firstLetter <= 'I') {
                                return true;
                              } else {
                                return false;
                              }
                            }
                          );
                        }
                      }
                    }
                  },
                  { boxLabel : "Show last nams starting with J-L",
                    name : "contactsFilterType", inputValue : 5,
                    listeners : {
                      "check" : function(inCheckbox, inChecked) {
                        if (inChecked) {
                          organizerExt.contactsStore.filterBy(
                            function(inRecord, inIndex) {
                              var firstLetter = inRecord.get(
                                "lastname").charAt(0).toUpperCase();
                              if (firstLetter >= 'J' && firstLetter <= 'L') {
                                return true;
                              } else {
                                return false;
                              }
                            }
                          );
                        }
                      }
                    }
                  },
                  { boxLabel : "Show last nams starting with M-O",
                    name : "contactsFilterType", inputValue : 6,
                    listeners : {
                      "check" : function(inCheckbox, inChecked) {
                        if (inChecked) {
                          organizerExt.contactsStore.filterBy(
                            function(inRecord, inIndex) {
                              var firstLetter = inRecord.get(
                                "lastname").charAt(0).toUpperCase();
                              if (firstLetter >= 'M' && firstLetter <= 'O') {
                                return true;
                              } else {
                                return false;
                              }
                            }
                          );
                        }
                      }
                    }
                  },
                  { boxLabel : "Show last nams starting with P-R",
                    name : "contactsFilterType", inputValue : 7,
                    listeners : {
                      "check" : function(inCheckbox, inChecked) {
                        if (inChecked) {
                          organizerExt.contactsStore.filterBy(
                            function(inRecord, inIndex) {
                              var firstLetter = inRecord.get(
                                "lastname").charAt(0).toUpperCase();
                              if (firstLetter >= 'P' && firstLetter <= 'R') {
                                return true;
                              } else {
                                return false;
                              }
                            }
                          );
                        }
                      }
                    }
                  },
                  { boxLabel : "Show last nams starting with S-U",
                    name : "contactsFilterType", inputValue : 8,
                    listeners : {
                      "check" : function(inCheckbox, inChecked) {
                        if (inChecked) {
                          organizerExt.contactsStore.filterBy(
                            function(inRecord, inIndex) {
                              var firstLetter = inRecord.get(
                                "lastname").charAt(0).toUpperCase();
                              if (firstLetter >= 'S' && firstLetter <= 'U') {
                                return true;
                              } else {
                                return false;
                              }
                            }
                          );
                        }
                      }
                    }
                  },
                  { boxLabel : "Show last nams starting with V-Z",
                    name : "contactsFilterType", inputValue : 9,
                    listeners : {
                      "check" : function(inCheckbox, inChecked) {
                        if (inChecked) {
                          organizerExt.contactsStore.filterBy(
                            function(inRecord, inIndex) {
                              var firstLetter = inRecord.get(
                                "lastname").charAt(0).toUpperCase();
                              if (firstLetter >= 'V' && firstLetter <= 'Z') {
                                return true;
                              } else {
                                return false;
                              }
                            }
                          );
                        }
                      }
                    }
                  },
                  { boxLabel : "Show Category:", name : "contactsFilterType",
                    inputValue : 10,
                    listeners : {
                      "check" : function(inCheckbox, inChecked) {
                        var cfcCombo = Ext.getCmp("contactsFilterCategory");
                        if (inChecked) {
                          cfcCombo.enable();
                        } else {
                          cfcCombo.disable();
                          cfcCombo.reset();
                        }
                      }
                    }
                  }
                ]
              },
              {
                xtype : "combo", id : "contactsFilterCategory",
                editable : false, mode : "local", disabled : true,
                store : organizerExt.categoryList, triggerAction : "all",
                width : 150, listWidth : 168,
                listeners : {
                  "select" : function(inComboBox, inRecord, inIndex) {
                    organizerExt.contactsStore.filterBy(
                      function(inRecord, inIndex) {
                        if (inRecord.get("category") ==
                          Ext.getCmp("contactsFilterCategory").getValue()) {
                          return true;
                        } else {
                          return false;
                        }
                      }
                    );
                  }
                }
              }
            ]
          }
        ]},
        {
          // Main area of the screen where item lists and details are.
          id : "mainArea", region : "center", layout : "border",
          items : [
            {
              // Item lists.
              xtype : "panel", region : "north", split : true,
              collapsible : true, id : "listingCard", layout : "card",
              activeItem : 0, title : "Appointments",
              height : 175, autoScroll : true,
              items : [
                {
                  // Appointments icon view.
                  xtype : "dataview", id : "dvAppointmentsIconView",
                  store : organizerExt.appointmentsStore,
                  tpl : new Ext.XTemplate(
                    "<tpl for=\".\">",
                      "<div class=\"thumb-wrap\">",
                      "<div class=\"thumb\">" +
                      "<img src=\"img/iconView{type}.gif\"></div>",
                      "<span class=\"x-editable\">{title}</span></div>",
                    "</tpl>",
                    "<div class=\"x-clear\"></div>"
                  ),
                  singleSelect : true, overClass : "x-view-over",
                  itemSelector : "div.thumb-wrap",
                  listeners: {
                    selectionchange : {
                      fn : function(inDataView, inNodes) {
                        // Get the record that was selected.
                        var selectedRecord = inDataView.getSelectedRecords()[0];
                        organizerExt.showAppointmentDetails(selectedRecord);
                      }
                    }
                  }
                },
                {
                  // Notes icon view.
                  xtype : "dataview", id : "dvNotesIconView",
                  store : organizerExt.notesStore,
                  tpl : new Ext.XTemplate(
                    "<tpl for=\".\">",
                    "<div class=\"thumb-wrap\">",
                    "<div class=\"thumb\">" +
                    "<img src=\"img/iconView{type}.gif\"></div>",
                    "<span class=\"x-editable\">{content}</span></div>",
                    "</tpl>",
                    "<div class=\"x-clear\"></div>"
                  ),
                  prepareData : function(inData, inIndex, inRecord) {
                    return {
                      type : "Note",
                      content : Ext.util.Format.ellipsis(inData.content, 15)
                    };
                  },
                  singleSelect : true, overClass : "x-view-over",
                  itemSelector : "div.thumb-wrap",
                  listeners: {
                    selectionchange : {
                      fn : function(inDataView, inNodes) {
                        // Get the record that was selected.
                        var selectedRecord = inDataView.getSelectedRecords()[0];
                        organizerExt.showNoteDetails(selectedRecord);
                      }
                    }
                  }
                },
                {
                  // Tasks icon view.
                  xtype : "dataview", id : "dvTasksIconView",
                  store : organizerExt.tasksStore,
                  tpl : new Ext.XTemplate(
                    "<tpl for=\".\">",
                      "<div class=\"thumb-wrap\">",
                      "<div class=\"thumb\">" +
                      "<img src=\"img/iconView{type}.gif\"></div>",
                      "<span class=\"x-editable\">{content}</span></div>",
                    "</tpl>",
                    "<div class=\"x-clear\"></div>"
                  ),
                  prepareData : function(inData, inIndex, inRecord) {
                    return {
                      type : "Task",
                      content : Ext.util.Format.ellipsis(inData.content, 15)
                    };
                  },
                  singleSelect : true, overClass : "x-view-over",
                  itemSelector : "div.thumb-wrap",
                  listeners: {
                    selectionchange : {
                      fn : function(inDataView, inNodes) {
                        var selectedRecord = inDataView.getSelectedRecords()[0];
                        organizerExt.showTaskDetails(selectedRecord);
                      }
                    }
                  }
                },
                {
                  // Contacts icon view.
                  xtype : "dataview", id : "dvContactsIconView",
                  store : organizerExt.contactsStore,
                  tpl : new Ext.XTemplate(
                    "<tpl for=\".\">",
                      "<div class=\"thumb-wrap\">",
                      "<div class=\"thumb\">" +
                      "<img src=\"img/iconView{type}.gif\"></div>",
                      "<span class=\"x-editable\">" +
                      "{lastname}, {firstname}</span></div>",
                    "</tpl>",
                    "<div class=\"x-clear\"></div>"
                  ),
                  singleSelect : true, overClass : "x-view-over",
                  itemSelector : "div.thumb-wrap",
                  listeners: {
                    selectionchange : {
                      fn : function(inDataView, inNodes) {
                        var selectedRecord = inDataView.getSelectedRecords()[0];
                        organizerExt.showContactDetails(selectedRecord);
                      }
                    }
                  }
                },
                {
                  // Appointments list view.
                  xtype : "grid", id : "gdAppointmentsListView",
                  autoExpandColumn : "colTitle", minColumnWidth : 10,
                  autoExpandMin : 10, autoExpandMax : 5000,
                  store : organizerExt.appointmentsStore,
                  columns : [
                    {
                      header : "Category", width : 50,
                      sortable : true, dataIndex : "category"
                    },
                    {
                      header : "Title", id : "colTitle",
                      sortable : true, dataIndex : "title"
                    },
                    {
                      header : "When", width : 90,
                      sortable : true, dataIndex : "whendt"
                    }
                  ],
                  viewConfig : { forceFit : true }, stripeRows : true,
                  sm : new Ext.grid.RowSelectionModel({ singleSelect : true }),
                  listeners: {
                    rowclick : {
                      fn : function(inGrid, inRowIndex, inEventObject) {
                        organizerExt.showAppointmentDetails(
                          inGrid.getSelectionModel().getSelected()
                        );
                      }
                    }
                  }
                },
                {
                  // Notes list view.
                  xtype : "grid", id : "gdNotesListView",
                  autoExpandColumn : "colContent", minColumnWidth : 10,
                  autoExpandMin : 10, autoExpandMax : 5000,
                  store : organizerExt.notesStore,
                  columns : [
                    {
                      header : "Category", width : 26,
                      sortable : true, dataIndex : "category"
                    },
                    {
                      header : "Content", id : "colContent",
                      sortable : true, dataIndex : "content"
                    }
                  ],
                  viewConfig : { forceFit : true }, stripeRows : true,
                  sm : new Ext.grid.RowSelectionModel({ singleSelect : true }),
                  listeners: {
                    rowclick : {
                      fn : function(inGrid, inRowIndex, inEventObject) {
                        organizerExt.showNoteDetails(
                          inGrid.getSelectionModel().getSelected()
                        );
                      }
                    }
                  }
                },
                {
                  // Tasks list view.
                  xtype : "grid", id : "gdTasksListView",
                  autoExpandColumn : "colContent", minColumnWidth : 10,
                  autoExpandMin : 10, autoExpandMax : 5000,
                  store : organizerExt.tasksStore,
                  columns : [
                    {
                      header : "Category", width : 26,
                      sortable : true, dataIndex : "category"
                    },
                    {
                      header : "Content", id : "colContent",
                      sortable : true, dataIndex : "content"
                    }
                  ],
                  viewConfig : { forceFit : true }, stripeRows : true,
                  sm : new Ext.grid.RowSelectionModel({ singleSelect : true }),
                  listeners: {
                    rowclick : {
                      fn : function(inGrid, inRowIndex, inEventObject) {
                        organizerExt.showTaskDetails(
                          inGrid.getSelectionModel().getSelected()
                        );
                      }
                    }
                  }
                },
                {
                  // Contacts list view.
                  xtype : "grid", id : "gdContactsListView",
                  autoExpandColumn : "colNote", minColumnWidth : 10,
                  autoExpandMin : 10, autoExpandMax : 5000,
                  store : organizerExt.contactsStore,
                  columns : [
                    {
                      header : "Category", width : 52,
                      sortable : true, dataIndex : "category"
                    },
                    {
                      header : "First Name", width : 40,
                      sortable : true, dataIndex : "firstname"
                    },
                    {
                      header : "Last Name", width : 50,
                      sortable : true, dataIndex : "lastname"
                    },
                    {
                      header : "Note", id : "colNote",
                      sortable : true, dataIndex : "note"
                    }
                  ],
                  viewConfig : { forceFit : true }, stripeRows : true,
                  sm : new Ext.grid.RowSelectionModel({ singleSelect : true }),
                  listeners: {
                    rowclick : {
                      fn : function(inGrid, inRowIndex, inEventObject) {
                        organizerExt.showContactDetails(
                          inGrid.getSelectionModel().getSelected()
                        );
                      }
                    }
                  }
                }
              ]
            },
            {
              // Item details.
              xtype : "panel", region : "center", id : "detailsCard",
              layout : "card", activeItem : 0, autoScroll : true,
              title : "Appointment Details",
              items : [
                {
                  // Appointment details.
                  autoScroll : true, xtype : "panel",
                  html : Ext.getDom("divAppointmentDetails").innerHTML
                },
                {
                  // Note details.
                  autoScroll : true, xtype : "panel",
                  html : Ext.getDom("divNoteDetails").innerHTML
                },
                {
                  // Task details.
                  autoScroll : true, xtype : "panel",
                  html : Ext.getDom("divTaskDetails").innerHTML
                },
                {
                  // Contact details.
                  autoScroll : true, xtype : "panel",
                  html : Ext.getDom("divContactDetails").innerHTML
                }
              ]
            }
          ]
        },
        {
          // Toolbar.
          id : "toolbarArea", autoHeight : true, border : false,
          region : "north",
          items : [{
            xtype : "toolbar", items : [
              {
                text : "New Note",
                handler : function() {
                  Ext.getCmp("createNoteFormPane").getForm().reset();
                  Ext.getCmp("dialogCreateNote").show(Ext.getDom("divSource"));
                }, icon : "img/toolbarNote.gif", cls : "x-btn-text-icon"
              },
              { xtype : "tbspacer" }, { xtype : "tbspacer" },
              {
                text : "New Task",
                handler : function() {
                  Ext.getCmp("createTaskFormPane").getForm().reset();
                  Ext.getCmp("dialogCreateTask").show(Ext.getDom("divSource"));
                }, icon : "img/toolbarTask.gif", cls : "x-btn-text-icon"
              },
              { xtype : "tbspacer" }, { xtype : "tbspacer" },
              {
                text : "New Contact",
                handler : function() {
                  Ext.getCmp("createContactFormPane").getForm().reset();
                  Ext.getCmp("dialogCreateContact").show(Ext.getDom(
                    "divSource"));
                }, icon : "img/toolbarContact.gif", cls : "x-btn-text-icon"
              },
              { xtype : "tbspacer" }, { xtype : "tbspacer" },
              {
                text : "New Appointment",
                handler : function() {
                  Ext.getCmp("createAppointmentFormPane").getForm().reset();
                  Ext.getCmp("dialogCreateAppointment").show(
                    Ext.getDom("divSource"));
                }, icon : "img/toolbarAppointment.gif", cls : "x-btn-text-icon"
              },
              { xtype : "tbspacer" },
              { xtype : "tbseparator" },
              { xtype : "tbspacer" },
              {
                text : "About OrganizerExt",
                handler : function() {
                  var dialogAbout = new Ext.Window({
                    applyTo : "dialogAbout", closable : true, modal : true,
                    width : 400, height : 320, minimizable : false,
                    resizable : false, draggable : false, shadowOffset : 8,
                    closeAction : "hide", buttons : [{
                      text : "Ok",
                      handler : function() {
                        dialogAbout.hide();
                      }
                    }]
                  });
                  dialogAbout.show(Ext.getDom("divSource"));
                }, icon : "img/toolbarAbout.gif", cls : "x-btn-text-icon"
              },
              { xtype : "tbspacer" },
              { xtype : "tbseparator" },
              { xtype : "tbspacer" },
              {
                text : "Icon View", id : "tbViewMode",
                handler : function() {
                  // Toggle the text of the button.
                  this.setText(this.getText().toggle("Icon View", "List View"));
                  // Now Toggle the image as well.
                  var iconImage = "url(img/toolbarIconView.gif)";
                  if (this.getText() == "List View") {
                    iconImage = "url(img/toolbarListView.gif)";
                  }
                  this.getEl().child("button:first").dom.style.backgroundImage =
                    iconImage;
                  organizerExt.changeViewMode(this.getText());
                }, icon : "img/toolbarIconView.gif", cls : "x-btn-text-icon"
              }
            ]
          }]
        }
      ]
    });

    // Delete button for appointment details.
    new Ext.Button({
      text : "Delete Appointment", renderTo: "tdAppointmentDetailsDeleteButton",
      handler : function() {
        // Determine view mode so we know which dataview to examine.
        var viewMode = "IconView";
        if (Ext.getCmp("tbViewMode").getText() == "List View") {
          viewMode = "ListView";
        }
        // Get selected record from dataview and remove it from store.
        organizerExt.appointmentsStore.remove(
          Ext.getCmp("dvAppointments" + viewMode).getSelectedRecords()[0]
        );
      }, disabled : true, id : "btnAppointmentDeleteButton"
    });

    // Delete button for note details.
    new Ext.Button({
      text : "Delete Note", renderTo: "tdNoteDetailsDeleteButton",
      handler : function() {
        // Determine view mode so we know which dataview to examine.
        var viewMode = "IconView";
        if (Ext.getCmp("tbViewMode").getText() == "List View") {
          viewMode = "ListView";
        }
        // Get selected record from dataview and remove it from store.
        organizerExt.notesStore.remove(
          Ext.getCmp("dvNotes" + viewMode).getSelectedRecords()[0]
        );
      }, disabled : true, id : "btnNoteDeleteButton"
    });

    // Delete and Complete buttons for task details.
    new Ext.Button({
      text : "Delete Task", renderTo: "tdTaskDetailsDeleteButton",
      handler : function() {
        // Determine view mode so we know which dataview to examine.
        var viewMode = "IconView";
        if (Ext.getCmp("tbViewMode").getText() == "List View") {
          viewMode = "ListView";
        }
        // Get selected record from dataview and remove it from store.
        organizerExt.tasksStore.remove(
          Ext.getCmp("dvTasks" + viewMode).getSelectedRecords()[0]
        );
      }, disabled : true, id : "btnTaskDeleteButton"
    });
    new Ext.Button({
      text : "Complete Task", renderTo: "tdTaskDetailsCompleteButton",
      handler : function() {
        // Determine view mode so we know which dataview to examine.
        var viewMode = "IconView";
        if (Ext.getCmp("tbViewMode").getText() == "List View") {
          viewMode = "ListView";
        }
        // Get selected record from dataview and remove it from store.
        var record = Ext.getCmp("dvTasks" + viewMode).getSelectedRecords()[0];
        record.set("status", DAO.TASK_STATUS_COMPLETE);
      }, disabled : true, id : "btnTaskCompleteButton"
    });

    // Delete button for contact details.
    new Ext.Button({
      text : "Delete Contact", renderTo: "tdContactDetailsDeleteButton",
      handler : function() {
        // Determine view mode so we know which dataview to examine.
        var viewMode = "IconView";
        if (Ext.getCmp("tbViewMode").getText() == "List View") {
          viewMode = "ListView";
        }
        // Get selected record from dataview and remove it from store.
        organizerExt.contactsStore.remove(
          Ext.getCmp("dvContacts" + viewMode).getSelectedRecords()[0]
        );
      }, disabled : true, id : "btnContactDeleteButton"
    });

    // This isn't strictly-speaking necessary, but overcomes an apparent bug
    // in the latest version(s) of Firefox where the Accordion and item list
    // panel headers wouldn't show up.
    vp.doLayout();

  } // End buildUI().


  /**
   * Called when one of the accordion panes is selected.
   *
   * @param inCategory The name of the category switched to ("notes", "tasks",
   *                   "contacts" or "appointments").
   */
  this.changeCategory = function(inCategory) {

    // Store the current category for use by changeViewMode().
    organizerExt.currentCategory = inCategory;

    // Set values based on the category.
    var newActiveItem = null;
    var listingTitle = null;
    var detailsTitle = null;
    switch (inCategory) {
      case "appointments":
        newActiveItem = 0;
        listingTitle = "Appointments";
        detailsTitle = "Appointment Details";
      break;
      case "notes":
        newActiveItem = 1;
        listingTitle = "Notes";
        detailsTitle = "Note Details";
      break;
      case "tasks":
        newActiveItem = 2;
        listingTitle = "Tasks";
        detailsTitle = "Task Details";
      break;
      case "contacts":
        newActiveItem = 3;
        listingTitle = "Contacts";
        detailsTitle = "Contact Details";
      break;
    }

    // Select the appropriate card in the list cardlayout, the details
    // cardlayout, and update the titles appropriately.
    var listingCard = Ext.getCmp("listingCard");
    listingCard.setTitle(listingTitle);
    listingCard.getLayout().setActiveItem(newActiveItem);
    var detailsCard = Ext.getCmp("detailsCard");
    detailsCard.setTitle(detailsTitle);
    detailsCard.getLayout().setActiveItem(newActiveItem);
    organizerExt.changeViewMode(Ext.getCmp("tbViewMode").getText());

  } // End changeCategory().


  /**
   * Called to toggle the view mode.  Also called as part of changeCategory.
   *
   * @param inMode The mode to show, either "Icon View" or "List View".
   */
  this.changeViewMode = function(inMode) {

    // Figure out the base index into the array of cards in the list card
    // layout based on the current category.
    var baseCardIndex = null;
    switch (organizerExt.currentCategory) {
      case "appointments":
        baseCardIndex = 0;
      break;
      case "notes":
        baseCardIndex = 1;
      break;
      case "tasks":
        baseCardIndex = 2;
      break;
      case "contacts":
        baseCardIndex = 3;
      break;
    }

    // Now, if we're switching to list view that means we're in icon view now,
    // so the index to switch to is baseCardIndex+4.  If we're switching to
    // icon view, the the value of baseCardIndex is what we want anyway.
    var newActiveItem = null;
    if (inMode == "List View") {
      newActiveItem = baseCardIndex + 4;
    } else {
      newActiveItem = baseCardIndex;
    }

    // Set the proper card active.
    var listingCard = Ext.getCmp("listingCard");
    listingCard.getLayout().setActiveItem(newActiveItem);

  } // End changeViewMode().


  /**
   * Called when an icon or grid row is clicked to select an appointment
   * to view.
   *
   * @param inRecord The record that was selected from the store.
   */
  this.showAppointmentDetails = function(inRecord) {

    // If there was one (there would't be if the user
    // clicks the dataview off an item) then enable
    // the button(s).
    if (inRecord) {
      Ext.getCmp("btnAppointmentDeleteButton").enable();
    } else {
      // No record is available, so make sure button(s) are
      // disabled and create data fields in the object
      // that will be used to populate the display fields.
      Ext.getCmp("btnAppointmentDeleteButton").disable();
      inRecord = new organizerExt.AppointmentRecord({
        category : "", title : "", whendt : "", location : "", note : ""
      });
    }
    // Populate display fields.
    Ext.getDom("appointment_category").innerHTML =
      inRecord.get("category");
    Ext.getDom("appointment_location").innerHTML =
      inRecord.get("location");
    Ext.getDom("appointment_note").innerHTML =
      inRecord.get("note");
    Ext.getDom("appointment_title").innerHTML =
      inRecord.get("title");
    var wdt = inRecord.get("whendt");
    Ext.getDom("appointment_whendt").innerHTML =
      Ext.isDate(wdt) ? inRecord.get("whendt").format("m/d/Y") : "";

  } // End showAppointmentDetails().


  /**
   * Called when an icon or grid row is clicked to select a note to view.
   *
   * @param inRecord The record that was selected from the store.
   */
  this.showNoteDetails = function(inRecord) {

    // If there was one (there would't be if the user
    // clicks the dataview off an item) then enable
    // the button(s).
    if (inRecord) {
      Ext.getCmp("btnNoteDeleteButton").enable();
    } else {
      // No record is available, so make sure button(s) are
      // disabled and create data fields in the object
      // that will be used to populate the display fields.
      Ext.getCmp("btnNoteDeleteButton").disable();
      inRecord = new organizerExt.NoteRecord({
        category : "", content : ""
      });
    }
    // Populate display fields.
    Ext.getDom("note_category").innerHTML =
      inRecord.get("category");
    Ext.getDom("note_content").innerHTML =
      inRecord.get("content");

  } // End showNoteDetails().


  /**
   * Called when an icon or grid row is clicked to select a task to view.
   *
   * @param inRecord The record that was selected from the store.
   */
  this.showTaskDetails = function(inRecord) {

    // If there was one (there would't be if the user
    // clicks the dataview off an item) then enable
    // the button(s).
    if (inRecord) {
      Ext.getCmp("btnTaskDeleteButton").enable();
      Ext.getCmp("btnTaskCompleteButton").enable();
    } else {
      // No record is available, so make sure button(s) are
      // disabled and create data fields in the object
      // that will be used to populate the display fields.
      Ext.getCmp("btnTaskDeleteButton").disable();
      Ext.getCmp("btnTaskCompleteButton").disable();
      inRecord = new organizerExt.TaskRecord({
        category : "", content : "", status : ""
      });
    }
    // Populate display fields.
    Ext.getDom("task_category").innerHTML =
      inRecord.get("category");
    Ext.getDom("task_content").innerHTML =
      inRecord.get("content");
    Ext.getDom("task_status").innerHTML =
      Ext.util.Format.uppercase(inRecord.get("status"));

  } // End showTaskDetails().


  /**
   * Called when an icon or grid row is clicked to select a contact to view.
   *
   * @param inRecord The record that was selected from the store.
   */
  this.showContactDetails = function(inRecord) {

    // If there was one (there would't be if the user
    // clicks the dataview off an item) then enable
    // the button(s).
    if (inRecord) {
      Ext.getCmp("btnContactDeleteButton").enable();
    } else {
      // No record is available, so make sure button(s) are
      // disabled and create data fields in the object
      // that will be used to populate the display fields.
      Ext.getCmp("btnContactDeleteButton").disable();
      inRecord = new organizerExt.NoteRecord({
        category : "", company : "", firstname : "", lastname : "",
        phonenumber : "", cellnumber : "", faxnumber : "", email : "",
        note : ""
      });
    }
    // Populate display fields.
    Ext.getDom("contact_category").innerHTML =
      inRecord.get("category");
    Ext.getDom("contact_company").innerHTML =
      inRecord.get("company");
    Ext.getDom("contact_firstname").innerHTML =
      inRecord.get("firstname");
    Ext.getDom("contact_lastname").innerHTML =
      inRecord.get("lastname");
    Ext.getDom("contact_phonenumber").innerHTML =
      inRecord.get("phonenumber");
    Ext.getDom("contact_cellnumber").innerHTML =
      inRecord.get("cellnumber");
    Ext.getDom("contact_faxnumber").innerHTML =
      inRecord.get("faxnumber");
    Ext.getDom("contact_email").innerHTML =
      inRecord.get("email");
    Ext.getDom("contact_note").innerHTML =
      inRecord.get("note");

  } // End showContactDetails().


} // End OganizerExt class.


var organizerExt = new OrganizerExt();
