function DataManager() {


  // ********** The list of contacts the app contains.
  this.contacts = null;


  // ********** Initialization.
  this.init = function() {

    // Read in existing contacts from the applicable storage mechanism.
    this.contacts = new Array();
    this.restoreContacts();

  } // End init().


  // ********** Restore contacts from storage.
  this.restoreContacts = function() {

    // Retrieve stored contacts.
    var storedContacts = dojox.storage.get("js_contact_manager_contacts");

    // Only do work if there actually were any contacts stored.
    if (storedContacts) {
      // Tokenize the string that was stored.
      var splitContacts = storedContacts.split("~>!<~");
      // Each element in splitContacts is a contact.
      for (var i = 0; i < splitContacts.length; i++) {
        // Instantiate a new Contact instance and populate it.
        var contact = new Contact();
        contact.restoreFromJSON(splitContacts[i]);
        contact.arrayIndex = i;
        // Add it to the array of contacts.
        this.contacts.push(contact);
      }
    }

  } // End restoreContacts().


  // ********** Save a contact.
  this.saveContact = function(inContact, inIndex) {

    // Save new contact.
    if (inIndex == -1) {
      inContact.arrayIndex = this.contacts.length;
      this.contacts.push(inContact);
    } else {
      // Update existing contact.
      this.contacts[inIndex] = inContact;
    }
    this.persistContacts();

  } // End saveContact().


  // ********** Persist contacts to storage.
  this.persistContacts = function() {

    // First, construct a giant string from our contact list, where each
    // contact is separated by ~>!<~ (that delimiter isn't too likely to
    // naturally appear in our data I figure!)
    var contactsString = "";
    for (var i = 0; i < this.contacts.length; i++) {
      if (contactsString != "") {
        contactsString += "~>!<~";
      }
      contactsString += this.contacts[i];
    }

    try {
      dojox.storage.put("js_contact_manager_contacts", contactsString,
        this.saveHandler);
    } catch(e) {
      alert(e);
    }

  } // End persistContacts().


  // ********** Callback function for storage.
  this.saveHandler = function(status, keyName){
    if (status == dojox.storage.FAILED) {
      alert("A failure occurred saving contact to persistent storage");
    }

  } // End saveHandler().


  // ********** Retrieve a contact.
  this.getContact = function(inIndex) {

    return this.contacts[inIndex];

  } // End getContact().


  // ********** Delete a contact.
  this.deleteContact = function(inIndex) {

    // Delete from contacts array.
    this.contacts.splice(inIndex, 1);

    // Store the updated contact list.
    this.persistContacts();

    // Finally, renumber all the remaining contacts.
    for (var i = 0; i < this.contacts.length; i++) {
      this.contacts[i].arrayIndex = i;
    }

  } // End deleteContact().


  // ********** Return a list of contacts.
  this.listContacts = function(inCurrentTab) {

    if (inCurrentTab == "XX") {
      // ALL tab selected, return ALL contact.
      return this.contacts;
    } else {
      // Filter contacts based on current tab.
      var retArray = new Array();
      var start = inCurrentTab.substr(0, 1).toUpperCase();
      var end = inCurrentTab.substr(1, 1).toUpperCase();
      for (var i = 0; i < this.contacts.length; i++) {
        var firstLetter = this.contacts[i].lastName.substr(0, 1).toUpperCase();
        if (firstLetter >= start && firstLetter <= end) {
          retArray.push(this.contacts[i]);
        }
      }
      return retArray;
    }

  } // End listContacts().


  // ********** Function to clear ALL contacts.
  this.clearContacts = function() {

    dojox.storage.clear("");
    this.contacts = new Array();

  } // End clearContacts().


} // End DataManager class.
