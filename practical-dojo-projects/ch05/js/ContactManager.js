function ContactManager() {


  // EventHandlers instance.
  this.eventHandlers = null;

  // DataManager instance.
  this.dataManager = null;

  // The tab currently selected.  XX is the All tab.
  this.currentTab = "XX";

  // Index of the selected contact being edited, or -1 if none (or new contact).
  this.currentContactIndex = -1;

  // Reference to timer used to initialize Dojo storage system.
  this.initTimer = -1;


  // ********** Initialization.
  this.init = function() {

    contactManager.eventHandlers = new EventHandlers();
    contactManager.eventHandlers.init();
    contactManager.dataManager = new DataManager();
    this.initTimer  = setTimeout("contactManager.initStorage()", 500);

  } // End init().


  // ********** The Dojo storage system has to be fully inialized before we
  //            can use it.  So, when the app starts up, this function is
  //            set up to be called every half second on a timer until the
  //            storage system is initialized.  When it is, it shows the
  //            application, and restores stored contacts.
  this.initStorage = function() {

    if (dojox.storage.manager.isInitialized()) {
      clearTimeout(this.initTimer);
      contactManager.dataManager.init();
      contactManager.displayContactList();
      dojo.byId("divInitializing").style.display = "none";
      dojo.byId("content").style.display = "block";
      this.initTimer = null;
    } else {
      this.initTimer  = setTimeout("contactManager.initStorage()", 500);
    }

  } // End initStorage().


  // ********** Displays the contact list in its current state for the
  //            current tab.
  this.displayContactList = function() {

    // Get a list of contacts for the current tab.
    var contacts = this.dataManager.listContacts(this.currentTab);

    // Generate the markup for the list.
    var html = "";
    var alt = false;
    for (var i = 0; i < contacts.length; i++) {
      html += "<div indexNum=\"" + contacts[i].arrayIndex + "\" ";
      html += "onMouseOver=\"contactManager.eventHandlers.clOver(this);\" ";
      html += "onMouseOut=\"contactManager.eventHandlers.clOut(this);\" ";
      html += "onClick=\"contactManager.doEditContact(" +
        "this.getAttribute('indexNum'));\" ";
      if (alt) {
        html += "class=\"cssContactListAlternate\" altRow=\"true\">";
        alt = false;
      } else {
        html += "class=\"cssContactListNormal\" altRow=\"false\">";
        alt = true;
      }
      html += contacts[i].lastName + ", " + contacts[i].firstName;
      html += "</div>";
    }

    // Display it.
    dojo.byId("contactList").innerHTML = html;

  } // End displayContactList().


  // ********** Edit an existing contact.
  this.doEditContact = function(inIndex) {

    // Record contact index, retrieve contact and populate screen.
    this.currentContactIndex = inIndex;
    var contact = this.dataManager.getContact(inIndex);
    contact.populateScreen();

  }


  // ********** Start a new contact.
  this.doNewContact = function() {

    if (this.initTimer == null) {

      if (confirm("Create New Contact\n\nYou will lose any unsaved changes.  " +
        "Are you sure?")) {
        document.forms[0].reset();
        this.currentContactIndex = -1;
      }

    }

  } // End doNewContact().


  // ********** Save contact.
  this.doSaveContact = function() {

    if (this.initTimer == null) {

      // Make sure required fields are filled in.
      if (dojo.byId("firstName").value == "" ||
        dojo.byId("lastName").value == "") {
        alert("First Name and Last Name are required fields");
        return false;
      }

      // Create a new contact and populate it from the entry fields.
      var contact = new Contact();
      contact.arrayIndex = this.currentContactIndex;
      contact.populateContact();

      // Save the contact.
      this.dataManager.saveContact(contact, this.currentContactIndex);

      // Redisplay the updated contact list.
      this.displayContactList();

      // Reset the entry fields and currentContactIndex.
      document.forms[0].reset();
      this.currentContactIndex = -1;

    }

  } // End doSaveContact().


  // ********** Delete a contact.
  this.doDeleteContact = function() {

    if (this.initTimer == null) {

      if (this.currentContactIndex != -1 &&
        confirm("Are you sure you want to delete this contact?")) {

        // Ask the data manager to do the deletion.
        this.dataManager.deleteContact(this.currentContactIndex);

        // Redisplay the updated contact list.
        this.displayContactList();

        // Reset the entry fields and currentContactIndex.
        document.forms[0].reset();
        this.currentContactIndex = -1;

      }

    }

  } // End doDeleteContact().


  // ********** Clears ALL contacts from persistent storage.
  this.doClearContacts = function() {

    if (this.initTimer == null) {

      if (confirm("This will PERMANENTLY delete ALL contacts from " +
        "persistent storage\n\nAre you sure??")) {
        if (confirm("Sorry to be a nudge, but are you REALLY, REALLY SURE " +
          "you want to lose ALL your contacts FOREVER??")) {
          this.dataManager.clearContacts();
          // Redisplay now empty contact list.
          this.displayContactList();
          // Reset form for good measure.
          document.forms[0].reset();
          this.currentContactIndex = -1;
          alert("Ok, it's done.  Don't come cryin' to me later.");
        }
      }

    }

  } // End doClearContacts().


  // ********** Exit application.
  this.doExit = function() {

    if (this.initTimer == null) {

      if (confirm("Exit Contact Manager\n\nAre you sure?")) {
        window.location = "goodbye.htm";
      }

    }

  } // End doExit().


} // End ContactManager class.
