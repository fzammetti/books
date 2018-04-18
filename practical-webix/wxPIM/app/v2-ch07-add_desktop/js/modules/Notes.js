"use strict";


wxPIM.registeredModules.push("Notes");


wxPIM.moduleClasses.Notes = class {


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

    /* Style for the note list items. */
    const cssListItem = `
      color : #000000;
      height : 66px;
      border : 1px solid #000000;
      border-radius : 8px;
      margin : 8px 10px 12px 4px;
      overflow : hidden;
      padding : 6px 6px 20px 6px;
      box-shadow : 4px 4px #aaaaaa;
      cursor : hand;
    `;

    /* Style for the title text in the note list. */
    const cssListItemTitle = `
      font-weight : bold;
      padding-bottom : 6px;
    `;

    return {
      winWidth : 500, winHeight : 500, winLabel : "Notes", winIcon : "file-text",
      id : "moduleNotes-container",
      cells : [
        /* ---------- Note list cell. ---------- */
        { id : "moduleNotes-itemsCell",
          rows : [
            { view : "list", id : "moduleNotes-items",
              type : {
                templateStart :
                  `<div style="${cssListItem}background-color:#color#;"
                   onClick="wxPIM.modules.Notes.editExisting('#id#');">`,
                template :
                  `<div style="${cssListItemTitle}">#title#</div>#text#`,
                templateEnd : `</div>`
              }
            },
            /* Note list toolbar. */
            { view : "toolbar",
              cols : [
                { },
                { view : "button", label : "New", width : "80",
                  type : "iconButton", icon : "plus",
                  click : this.newHandler.bind(this)
                },
                { width : 6 }
              ] /* End toolbar items. */
            } /* End toolbar. */
          ] /* End note list rows. */
        }, /* End note list cell. */
        /* ---------- Note details cell. ---------- */
        { id : "moduleNotes-details",
          rows : [
            /* Note details form. */
            { view : "form", id : "moduleNotes-detailsForm", borderless : true,
              elements : [
                { view : "text", name : "title", label : "Title", required : true,
                  bottomPadding : 20, invalidMessage : "Title is required",
                  attributes : { maxlength : 50 },
                  on : {
                    onChange : function() {
                      if (this.getParentView().validate()) {
                        $$("moduleNotes-saveButton").enable();
                      } else {
                        $$("moduleNotes-saveButton").disable();
                      }
                    }
                  }
                },
                { id : "moduleNotes-detailsForm-text", view : "richtext",
                  name : "text", label : "Text", attributes : { maxlength : 1000 }
                },
                { view : "colorpicker", name : "color", label : "Color",
                  id : "moduleNotes-detailsForm-color"
                },
              ]
            }, /* End note details form. */
            /* Note details toolbar. */
            { view : "toolbar",
              cols : [
                { width : 6 },
                { view : "button", label : "Back To Summary", width : "170",
                  type : "iconButton", icon : "arrow-left",
                  click : () => {
                    $$("moduleNotes-itemsCell").show();
                  }
                },
                { },
                { id : "moduleNotes-deleteButton", view : "button",
                  label : "Delete", width : "90", type : "iconButton",
                  icon : "remove", click : () => { wxPIM.deleteHandler("Notes"); }
                },
                { },
                { view : "button", label : "Save", width : "80",
                  type : "iconButton", icon : "floppy-o",
                  id : "moduleNotes-saveButton", disabled : true,
                  click : function() {
                    wxPIM.saveHandler("Notes", [ "moduleNotes-detailsForm" ]);
                  }
                },
                { width : 6 }
              ]
            } /* End note details toolbar. */
          ] /* End note details cell rows. */
        } /* End note details cell. */
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
  } /* End deactivate(). */


  /**
   * Handle clicks on the New button.
   */
  newHandler() {

    // We're adding a new note, so set the editing flag and create an ID.
    wxPIM.modules.Notes.isEditingExisting = false;
    wxPIM.modules.Notes.editingID = new Date().getTime();

    // Now show the details form and clear it, then set any defaults.  Don't
    // forget to disable the delete button since we obviously can't delete
    // during an add.
    $$("moduleNotes-details").show();
    $$("moduleNotes-detailsForm").clear();
    $$("moduleNotes-detailsForm-text").setValue("");
    $$("moduleNotes-detailsForm-color").setValue("#ffd180");
    $$("moduleNotes-deleteButton").disable();

  } /* End newHandler(). */


  /**
   * Handles clicks on the Save button.
   */
  editExisting(inID) {

    // Get the note from local storage and set it on the form.
    const notes = JSON.parse(localStorage.getItem("NotesDB"));
    const note = notes[inID];

    // Set flag to indicate editing an existing note and show the details.
    wxPIM.modules.Notes.isEditingExisting = true;
    wxPIM.modules.Notes.editingID = inID;

    // Clear the details form.
    $$("moduleNotes-detailsForm").clear();

    // Show the form.  Note that this has to be done before the call to
    // setValues() below otherwise we get an error due to setting the value of
    // the richtext (my guess is it lazy-builds the DOM and it's not actually
    // there until the show() executes.
    $$("moduleNotes-details").show();

    // Populate the form.
    $$("moduleNotes-detailsForm").setValues(note);

    // Finally, enable the delete button.
    $$("moduleNotes-deleteButton").enable();

   } /* End editExisting(). */


  /**
   * Refresh the notes list from local storage.
   */
  refreshData() {

    // Get the collection of data items from local storage.  If none,
    // create it now.
    const dataItems = wxPIM.getModuleData("Notes");

    // Get the items as an array of objects.
    const itemsAsArray = wxPIM.objectAsArray(dataItems);

    // Sort the array by the ID property (descending) so newest items will
    // be on the top.
    wxPIM.sortArray(itemsAsArray, "id", "D");

    // Populate the list.
    $$("moduleNotes-items").clearAll();
    $$("moduleNotes-items").parse(itemsAsArray);

  } /* End refreshData(). */


  /**
   * Service requests from day-at-a-glance to present data for this module.
   */
  dayAtAGlance() {
  } /* End dayAtAGlance(). */


}; /* End Notes class. */
