"use strict";


wxPIM.moduleClasses.Contacts = class {


  /**
   * Constructor.
   */
  constructor() {

    // List of U.S. states.
    this.usStates = [
      "", "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
      "Connecticut", "Delaware", "District of Columbia", "Florida", "Georgia",
      "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
      "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
      "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
      "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina",
      "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
      "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas",
      "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin",
      "Wyoming"
    ];

  } /* End constructor. */


  /**
   * Return the module's UI config object.
   */
  getUIConfig() {

    return {
      id : "moduleContacts-container",
      cells : [
        /* ---------- Contact list cell. ---------- */
        { id : "moduleContacts-itemsCell",
          rows : [
            { view : "unitlist", id : "moduleContacts-items",
              type : { height : 40 }, template : "#lastName#, #firstName#",
              uniteBy : (inObj) => {
                return inObj.lastName.substr(0, 1);
              },
              click : this.editExisting.bind(this)
            },
            /* Contact list toolbar. */
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
          ] /* End contact list rows. */
        }, /* End contact list cell. */
        /* ---------- Contact details cell. ---------- */
        { id : "moduleContacts-details",
          rows : [
            /* Contact details form. */
            { view : "accordion", id : "moduleContacts-accordion",
              rows : [
                { header : "Personal",
                  body : {
                    view : "form", id : "moduleContacts-personalDetailsForm",
                    scroll : true,
                    elementsConfig : {
                      view : "text", labelWidth : 100, bottomPadding : 20,
                      on : {
                        onChange : wxPIM.modules.Contacts.validateFormsOnChange.bind(this)
                      }
                    },
                    elements : [
                      { name : "firstName", label : "First Name", required : true,
                        invalidMessage : "First name is required",
                        attributes : { maxlength : 20 }
                      },
                      { name : "lastName", label : "Last Name", required : true,
                        invalidMessage : "Last name is required",
                        attributes : { maxlength : 20 }
                      },
                      { name : "homePhone", label : "Home Phone",
                        attributes : { maxlength : 12 }
                      },
                      { name : "cellPhone", label : "Cell Phone",
                        attributes : { maxlength : 12 }
                      },
                      { name : "personalEMail", label : "eMail",
                        validate : webix.rules.isEmailOrBlank,
                        invalidMessage : "Must be in the form xxx@yyy.zzz",
                        attributes : { maxlength : 75 }
                      },
                      { name : "personalAddress1", label : "Address 1",
                        attributes : { maxlength : 50 }
                      },
                      { name : "personalAddress2", label : "Address 2",
                        attributes : { maxlength : 30 }
                      },
                      { name : "personalAddress3", label : "Address 3",
                        attributes : { maxlength : 30 }
                      },
                      { name : "personalCity", label : "City",
                        attributes : { maxlength : 30 }
                      },
                      { view : "select", name : "personalState",
                        label : "State", value : "", options : this.usStates
                      },
                      { name : "personalZip", label : "Zip Code",
                        validate : webix.rules.isNumberOrBlank,
                        invalidMessage : "Must be numbers only",
                        attributes : { maxlength : 5 }
                      },
                      { name : "im", label : "IM",
                        attributes : { maxlength : 25 }
                      },
                      { view : "select", name : "imType", label : "IM Type",
                        value : "",
                        options : [
                          { id : "", value : "" },
                          { id : "aim", value : "AIM" },
                          { id : "allo", value : "Allo" },
                          { id : "facebook", value : "Facebook" },
                          { id : "imessage", value : "iMessage" },
                          { id : "kik", value : "Kik" },
                          { id : "snapchat", value : "Snapchat" },
                          { id : "skype", value : "Skype" },
                          { id : "whatsapp", value : "WhatsApp" },
                          { id : "yahoo", value : "Yahoo" }
                        ]
                      },
                      { view : "datepicker", name : "birthday",
                        label : "Birthday"
                      },
                      { name : "personalWebsite", label : "Website",
                        attributes : { maxlength : 100 }
                      },
                      { name : "personalComments", label : "Comments",
                        attributes : { maxlength : 250 }
                      }
                    ] /* End personalDetailsForm. */
                  } /* End personal accordionitem body. */
                }, /* End personal accordionitem. */
                { header : "Business", collapsed : true,
                  body : {
                    view : "form", id : "moduleContacts-businessDetailsForm",
                    scroll : true,
                    elementsConfig : {
                      view : "text", labelWidth : 100, bottomPadding : 20,
                      on : {
                        onChange : wxPIM.modules.Contacts.validateFormsOnChange.bind(this)
                      }
                    },
                    elements : [
                      { name : "officePhone", label : "Office Phone",
                        attributes : { maxlength : 12 }
                      },
                      { name : "businessEMail", label : "eMail",
                        validate : webix.rules.isEmailOrBlank,
                        invalidMessage : "Must be in the form xxx@yyy.zzz",
                        attributes : { maxlength : 75 }
                      },
                      { name : "businessAddress1", label : "Address 1",
                        attributes : { maxlength : 50 }
                      },
                      { name : "businessAddress2", label : "Address 2",
                        attributes : { maxlength : 30 }
                      },
                      { name : "businessAddress3", label : "Address 3",
                        attributes : { maxlength : 30 }
                      },
                      { name : "businessCity", label : "City",
                        attributes : { maxlength : 30 }
                      },
                      { view : "select", name : "businessState",
                        label : "State", value : "", options : this.usStates
                      },
                      { name : "businessZip", label : "Zip Code",
                        validate : webix.rules.isNumberOrBlank,
                        invalidMessage : "Must be numbers only",
                        attributes : { maxlength : 5 }
                      },
                      { name : "company", label : "Company",
                        attributes : { maxlength : 40 }
                      },
                      { name : "title", label : "Title",
                        attributes : { maxlength : 25 }
                      },
                      { name : "businessWebsite", label : "Website",
                        attributes : { maxlength : 100 }
                      },
                      { name : "businessComments", label : "Comments",
                        attributes : { maxlength : 250 }
                      }
                    ] /* End businessDetailsForm. */
                  } /* End business accordionitem body. */
                }, /* End business accordionitem. */
              ] /* End accordion rows. */
            }, /* End accordion. */
            /* Contact details toolbar. */
            { view : "toolbar",
              cols : [
                { width : 6 },
                { view : "button", label : "Back To Summary", width : "170",
                  type : "iconButton", icon : "arrow-left",
                  click : () => {
                    $$("moduleContacts-itemsCell").show();
                  }
                },
                { },
                { id : "moduleContacts-deleteButton", view : "button",
                  label : "Delete", width : "90", type : "iconButton",
                  icon : "remove",
                  click : () => { wxPIM.deleteHandler("Contacts"); }
                },
                { },
                { view : "button", label : "Save", width : "80",
                  type : "iconButton", icon : "floppy-o",
                  id : "moduleContacts-saveButton", disabled : true,
                  click : function() {
                    wxPIM.saveHandler("Contacts", [
                      "moduleContacts-personalDetailsForm",
                      "moduleContacts-businessDetailsForm"
                    ]);
                  }
                },
                { width : 6 }
              ]
            } /* End contact details toolbar. */
          ] /* End contact details cell rows. */
        } /* End contact details cell. */
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

    // We're adding a new contact, so set the editing flag and create an ID.
    wxPIM.isEditingExisting = false;
    wxPIM.editingID = new Date().getTime();

    // Now show the details form and clear it, then set any defaults.  Don't
    // forget to disable the delete button since we obviously can't delete
    // during an add.
    $$("moduleContacts-details").show();
    $$("moduleContacts-accordion").getChildViews()[0].expand();
    $$("moduleContacts-personalDetailsForm").clear();
    $$("moduleContacts-businessDetailsForm").clear();
    $$("moduleContacts-deleteButton").disable();

  } /* End newHandler(). */


  /**
   * Handles clicks on the Save button.
   */
  editExisting(inID) {

    // Get the contact from local storage and set it on the forms.
    const contacts = JSON.parse(localStorage.getItem("ContactsDB"));
    const contact = contacts[inID];

    // Set flag to indicate editing an existing contact and show the details.
    wxPIM.isEditingExisting = true;
    wxPIM.editingID = inID;

    // Clear the details forms.
    $$("moduleContacts-personalDetailsForm").clear();
    $$("moduleContacts-businessDetailsForm").clear();

    // Show the form.  Note that this has to be done before the call to
    //  setValues() below otherwise we get an error due to setting the value of
    // the richtext (my guess is it lazy-builds the DOM and it's not actually
    // there until the show() executes.
    $$("moduleContacts-details").show();
    $$("moduleContacts-accordion").getChildViews()[0].expand();

    // Special handling for dates.
    if (contact.birthday) {
      contact.birthday = new Date(contact.birthday);
    }

    // Populate the forms. Note that we can't just pass contact to setValues()
    // because Webix stores all the data whether it goes into a form field or
    // not, and doing that means that when we combine the two forms' data
    // later we'll be overwriting data and things won't work as expected, so we
    // have to only pass the data appropriate for each form out of the data
    // object.
    $$("moduleContacts-personalDetailsForm").setValues({
      firstName : contact.firstName,
      lastName : contact.lastName,
      homePhone : contact.homePhone,
      cellPhone : contact.cellPhone,
      personalEMail : contact.personalEMail,
      personalAddress1 : contact.personalAddress1,
      personalAddress2 : contact.personalAddress2,
      personalAddress3 : contact.personalAddress3,
      personalCity : contact.personalCity,
      personalState : contact.personalState,
      personalZip : contact.personalZip,
      im : contact.im,
      imType : contact.imType,
      birthday : contact.birthday,
      personalWebsite : contact.personalWebsite,
      personalComments : contact.personalComments
    });
    $$("moduleContacts-businessDetailsForm").setValues({
      officePhone : contact.officePhone,
      businessEMail : contact.businessEMail,
      businessAddress1 : contact.businessAddress1,
      businessAddress2 : contact.businessAddress2,
      businessAddress3 : contact.businessAddress3,
      businessCity : contact.businessCity,
      businessState : contact.businessState,
      businessZip : contact.businessZip,
      company : contact.company,
      title : contact.title,
      businessWebsite : contact.businessWebsite,
      businessComments : contact.businessComments
    });

    // Finally, enable the delete button.
    $$("moduleContacts-deleteButton").enable();

   } /* End editExisting(). */


  /**
   * Refresh the contacts list from local storage.
   */
  refreshData() {

    // Get the collection of data items from local storage.  If none,
    // create it now.
    const dataItems = wxPIM.getModuleData("Contacts");

    // Get the items as an array of objects.
    const itemsAsArray = wxPIM.objectAsArray(dataItems);

    // Sort the array by the laseName property (ascending) so they appear in
    // alphabetical order.
    wxPIM.sortArray(itemsAsArray, "lastName", "A");

    // Populate the list.
    $$("moduleContacts-items").clearAll();
    $$("moduleContacts-items").parse(itemsAsArray);

  } /* End refreshData(). */


  /**
   * Function called when any form field changes.
   */
  validateFormsOnChange() {

    const areBothFormsValid =
      $$("moduleContacts-personalDetailsForm").validate() &&
      $$("moduleContacts-businessDetailsForm").validate();
    $$("moduleContacts-saveButton")[areBothFormsValid ? "enable" : "disable"]();

  } /* End validateFormsOnChange(). */


}; /* End Contacts class. */
