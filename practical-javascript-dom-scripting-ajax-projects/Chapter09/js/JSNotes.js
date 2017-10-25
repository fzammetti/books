/**
 * The JSNotes class is the main class constituting the application.
 */
function JSNotes() {


  /**
   * Flag: Is the logging div currently visible?
   */
  var loggingVisible = false;


  /**
   * Flag: Is an overlay or dialog currently visible?
   */
  var overlayOrDialogVisible = false;


  /**
   * Reference to the menubar object.
   */
  var oMenuBar = null;


  /**
   * Reference to the add notes dialog object.
   */
  var oAddNoteDialog = null;


  /**
   * Reference to the Export overlay object.
   */
  var oExportOverlay = null;


  /**
   * Reference to the About overlay object.
   */
  var oAboutOverlay = null;


  /**
   * Reference to the Using overlay object.
   */
  var oUsingOverlay = null;


  /**
   * Reference to the date calendar for adding a new note.
   */
  var oAddNoteCalendar = null;


  /**
   * Reference to the hour slider for adding a new note.
   */
  var oAddNoteHHSlider = null;


  /**
   * Reference to the minutes slider for adding a new note.
   */
  var oAddNoteMMSlider = null;


  /**
   * Reference to the treeview for listing categories/notes.
   */
  var oTreeview = null;


  /**
   * Reference to the treeview Personal Notes category node.
   */
  var oTreeviewPersonal = null;


  /**
   * Reference to the treeview Business Notes category node.
   */
  var oTreeviewBusiness = null;


  /**
   * The collection of Personal notes.
   */
  var personalNotes = new Array();


  /**
   * The collection of Business notes.
   */
  var businessNotes = new Array();


  /**
   * This is a reference to the Note object currently being viewed.
   */
  var currentNote = null;


  /**
   * Call on page load to initialize the application.
   */
  this.init = function() {

    // Start logging, show logging div if flag set to do so initially.
    new YAHOO.widget.LogReader(YAHOO.util.Dom.get("divLog"));
    YAHOO.log("init()");
    if (loggingVisible) {
      YAHOO.util.Dom.get("divLog").style.display = "block";
    }

    // Start by centering the main DIV.
    jscript.dom.layerCenterH(YAHOO.util.Dom.get("divMain"));
    jscript.dom.layerCenterV(YAHOO.util.Dom.get("divMain"));

    // Create menubar.
    oMenuBar = new YAHOO.widget.MenuBar("divMainMenu");
    oMenuBar.render();

    // Create About overlay.
    oAboutOverlay = new YAHOO.widget.Overlay("aboutOverlay",
      {
        context : [ "divContent", "tl", "tl" ],
        width : "500px", height : "456px", visible : false
      }
    );
    oAboutOverlay.setBody(YAHOO.util.Dom.get("divAbout"));
    oAboutOverlay.render(document.body);

    // Create Export overlay.
    oExportOverlay = new YAHOO.widget.Overlay("exportOverlay",
      {
        context : [ "divContent", "tl", "tl" ],
        width : "500px", height : "456px", visible : false
      }
    );
    oExportOverlay.setBody(YAHOO.util.Dom.get("divExport"));
    oExportOverlay.render(document.body);

    // Create Using overlay.
    oUsingOverlay = new YAHOO.widget.Overlay("usingOverlay",
      {
        context : [ "divContent", "tl", "tl" ],
        width : "500px", height : "456px", visible : false
      }
    );
    oUsingOverlay.setBody(YAHOO.util.Dom.get("divUsing"));
    oUsingOverlay.render(document.body);


    // Create Add Note dialog.
    oAddNoteDialog = new YAHOO.widget.Dialog("divAddNote",
      {
        close : false,
        width : "320px",
        height : "460px",
        visible : false,
        constraintoviewport : true,
        buttons : [
          {
            text : "Submit",
            handler : jsNotes.handleAddNoteSubmit,
            isDefault : true
          },
          { text : "Cancel", handler : jsNotes.hideAddNote }
        ]
      }
    );
    oAddNoteDialog.render(document.body);

    // Create Add Note calendar.
    oAddNoteCalendar = new YAHOO.widget.Calendar("cal1", "addNoteCalendar");
    oAddNoteCalendar.render();

    // Create Add Note hour slider.
    var bgHH = "divHHSliderBG";
    var thumbHH = "divHHSliderThumb";
    oAddNoteHHSlider = YAHOO.widget.Slider.getHorizSlider(
      bgHH, thumbHH, 0, 150, 13);
    oAddNoteHHSlider.subscribe("change",
      function() {
        YAHOO.util.Dom.get("divHHValue").innerHTML =
          Math.round(oAddNoteHHSlider.getValue() / 13) + 1;
      }
    );

    // Create Add Note minutes slider.
    var bgMM = "divMMSliderBG";
    var thumbMM = "divMMSliderThumb";
    oAddNoteMMSlider = YAHOO.widget.Slider.getHorizSlider(
      bgMM, thumbMM, 0, 178, 3);
    oAddNoteMMSlider.subscribe("change",
      function() {
        var minute = Math.round(oAddNoteMMSlider.getValue() / 3);
        var s = "";
        if (minute < 10) {
          s += "0";
        }
        s += minute;
        YAHOO.util.Dom.get("divMMValue").innerHTML = s;
      }
    );

    // Create treeview for category/note listing.
    oTreeview = new YAHOO.widget.TreeView("divTreeview");
    var oRoot = oTreeview.getRoot();
    oTreeviewPersonal = new YAHOO.widget.TextNode("Personal",
      oRoot, false);
    oTreeviewBusiness = new YAHOO.widget.TextNode("Business",
      oRoot, false);
    oTreeview.subscribe("labelClick",
      function(node) {
        var noteSubject = node.data.subject;
        // Only do something when a note is clicked, not a category (only a
        // note would have a subject attribute).
        if (noteSubject) {
          var noteCategory = node.parent.data;
          currentNote = jsNotes.getNote(noteCategory, noteSubject);
          var noteDate = currentNote.getNoteDate();
          YAHOO.util.Dom.get("currentNoteDate").innerHTML =
            noteDate.getMonth() + "/" +
            noteDate.getDate() + "/" +
            noteDate.getFullYear();
          YAHOO.util.Dom.get("currentNoteTime").innerHTML =
            currentNote.getNoteTime();
          YAHOO.util.Dom.get("currentNoteSubject").innerHTML =
            currentNote.getNoteSubject();
          YAHOO.util.Dom.get("currentNoteText").innerHTML =
            currentNote.getNoteText();
        }
      }
    );
    oTreeview.draw();

    YAHOO.log("init() done");

  } // End init().


  /**
   * Returns a Note object based on requested category and subject.
   *
   * @param inCategory The category the note belongs to.
   * @param inSubject  The subject of the note the retrieve.
   */
  this.getNote = function(inCategory, inSubject) {

    var note = null;

    // Determine which array to search based on current category.
    var arrayToSearch = null;
    if (inCategory == "Personal") {
      arrayToSearch = personalNotes;
    } else {
      arrayToSearch = businessNotes;
    }

    // Search the array and find the match, if any, and return it.
    for (var i = 0; i < arrayToSearch.length; i++) {
      var n = arrayToSearch[i];
      if (n.getNoteSubject() == inSubject) {
        note = n;
        note.setArrayIndex(i);
        break;
      }
    }

    // Now find the note in the treeview for the note.
    note.setTreeNode(oTreeview.getNodeByProperty("subject",
      note.getNoteSubject()));

    // Not found.
    return note;

  } // End getNote();


  /**
   * Show the dialog for adding a note.
   */
  this.showAddNote = function() {

    YAHOO.log("showAddNote()");

    if (overlayOrDialogVisible) { return; }
    oMenuBar.clearActiveItem();

    overlayOrDialogVisible = true;

    // Reset all form fields.
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    YAHOO.util.Dom.get("frmNewNote").reset();
    oAddNoteCalendar.clear();
    oAddNoteCalendar.select(now);
    oAddNoteCalendar.render();
    oAddNoteHHSlider.setValue((hours * 13) - 13, true, true);
    oAddNoteMMSlider.setValue(minutes * 3, true, true);
    YAHOO.util.Dom.get("divHHValue").innerHTML = hours;
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    YAHOO.util.Dom.get("divMMValue").innerHTML = minutes;
    YAHOO.util.Dom.get("newNotePM").checked = true;

    // Show the dialog amd center it.
    oAddNoteDialog.center();
    oAddNoteDialog.show();

    YAHOO.log("showAddNote() done");

  } // End showAddNote().


  /**
   * Hide the dialog for adding a note.
   */
  this.hideAddNote = function() {

    YAHOO.log("hideAddNote()");

    oAddNoteDialog.hide();
    overlayOrDialogVisible = false;

    YAHOO.log("hideAddNote() done");

  } // End hideAddNote().


  /**
   * Handle submit of the add new note form.
   */
  this.handleAddNoteSubmit = function() {

    YAHOO.log("handleAddNoteSubmit()");

    // Get entered values.
    var noteCategory = YAHOO.util.Dom.get("newNoteCategorySelect").value;
    var noteDate = oAddNoteCalendar.getSelectedDates()[0];
    var noteHour = YAHOO.util.Dom.get("divHHValue").innerHTML;
    var noteMinute = YAHOO.util.Dom.get("divMMValue").innerHTML;
    var noteMeridian = null;
    if (YAHOO.util.Dom.get("newNoteAM").checked) {
      noteMeridian = "am";
    } else {
      noteMeridian = "pm";
    }
    var noteSubject = YAHOO.util.Dom.get("newNoteSubject").value;
    var noteText = YAHOO.util.Dom.get("newNoteText").value;

    // Now some simple validations.
    if (noteSubject == "") {
      alert("Please enter a subject for this note");
      YAHOO.util.Dom.get("newNoteSubject").focus();
      return false;
    }
    if (noteText == "") {
      alert("Please enter some text for this note");
      YAHOO.util.Dom.get("newNoteText").focus();
      return false;
    }

    // Instantiate a Note object and populate it.
    var note = new Note();
    note.setNoteCategory(noteCategory);
    note.setNoteDate(noteDate);
    note.setNoteTime(noteHour + ":" + noteMinute + noteMeridian);
    note.setNoteSubject(noteSubject);
    note.setNoteText(noteText);

    // Add the note to the appropriate treeview category and storage array.
    if (noteCategory == "Personal") {
      personalNotes.push(note);
      new YAHOO.widget.TextNode({label:noteSubject,subject:noteSubject},
        oTreeviewPersonal, false);
    } else {
      businessNotes.push(note);
      new YAHOO.widget.TextNode({label:noteSubject,subject:noteSubject},
        oTreeviewBusiness, false);
    }

    // Redraw treeview so it'll show up.
    oTreeview.draw();

    // Hide dialog and we're done!
    jsNotes.hideAddNote();
    YAHOO.log("handleAddNoteSubmit() done");
    return true;

  } // End handleAddNoteSubmit().


  /**
   * Delete the note currently being viewed.
   */
  this.deleteNote = function() {

    YAHOO.log("deleteNote()");

    if (overlayOrDialogVisible) { return; }
    oMenuBar.clearActiveItem();

    if (currentNote &&
      confirm("Are you sure you want to delete the current note?")) {
      // Delete from storage array.
      if (currentNote.getNoteCategory() == "Personal") {
        personalNotes.splice(currentNote.getArrayIndex(), 1);
      } else {
        businessNotes.splice(currentNote.getArrayIndex(), 1);
      }
      // Delete from treeview and redraw.
      oTreeview.removeNode(currentNote.getTreeNode());
      oTreeview.draw();
      // Clear display fields.
      YAHOO.util.Dom.get("currentNoteDate").innerHTML = "";
      YAHOO.util.Dom.get("currentNoteTime").innerHTML = "";
      YAHOO.util.Dom.get("currentNoteSubject").innerHTML = "";
      YAHOO.util.Dom.get("currentNoteText").innerHTML = "";
      // Finally, no more current note.
      currentNote = null;
    }

    YAHOO.log("deleteNote() done");

  } // End deleteNote().


  /**
   * Show the overlay for exporting the current note.
   */
  this.showExportNote = function() {

    YAHOO.log("showExportNote()");

    if (overlayOrDialogVisible) { return; }
    oMenuBar.clearActiveItem();

    if (currentNote) {
      var s = "";
      var noteDate = currentNote.getNoteDate();
      s += "Category: " + currentNote.getNoteCategory() + "\n";
      s += "Date: " + noteDate.getMonth() + "/" +
        noteDate.getDate() + "/" +
        noteDate.getFullYear() + "\n";
      s += "Time: " + currentNote.getNoteTime() + "\n";
      s += "Subject: " + currentNote.getNoteSubject() + "\n";
      s += "Note: " + currentNote.getNoteText();
      YAHOO.util.Dom.get("taExport").value = s;
      YAHOO.util.Dom.get("taExport").select();
      overlayOrDialogVisible = true;
      oExportOverlay.show();
    }

    YAHOO.log("showExportNote() done");

  } // End showExportNote().


  /**
   * Hide the Export Note overlay.
   */
  this.hideExportNote = function() {

    YAHOO.log("hideExportNote()");
    oMenuBar.clearActiveItem();

    oExportOverlay.hide();
    overlayOrDialogVisible = false;

    YAHOO.log("hideExportNote() done");

  } // End hideExportNote().


  /**
   * Exit the application
   */
  this.exit = function() {

    YAHOO.log("exit()");
    if (overlayOrDialogVisible) { return; }

    if (confirm(
      "All notes will be lost!  Are you sure you want to exit?")) {
      window.close();
    }

  } // End exit().


  /**
   * Toggle the logging div on and off.
   */
  this.toggleLogging = function() {

    YAHOO.log("toggleLogging()");
    if (overlayOrDialogVisible) { return; }

    oMenuBar.clearActiveItem();
    if (loggingVisible) {
      YAHOO.util.Dom.get("divLog").style.display = "none";
      loggingVisible = false;
    } else {
      YAHOO.util.Dom.get("divLog").style.display = "block";
      loggingVisible = true;
    }

    YAHOO.log("toggleLogging() done");

  } // End toggleLogging().


  /**
   * Show the Using (help) overlay.
   */
  this.showUsing = function() {

    YAHOO.log("showUsing()");
    if (overlayOrDialogVisible) { return; }
    oMenuBar.clearActiveItem();

    overlayOrDialogVisible = true;
    oUsingOverlay.show();

    YAHOO.log("showUsing() done");

  } // End showUsing().


  /**
   * Hide the Using (help) overlay.
   */
  this.hideUsing = function() {

    YAHOO.log("showUsing()");
    oMenuBar.clearActiveItem();

    oUsingOverlay.hide();
    overlayOrDialogVisible = false;

    YAHOO.log("showUsing() done");

  } // End hideUsing().


  /**
   * Show the About overlay.
   */
  this.showAbout = function() {

    YAHOO.log("showAbout()");
    if (overlayOrDialogVisible) { return; }

    oMenuBar.clearActiveItem();
    overlayOrDialogVisible = true;
    oAboutOverlay.show();

    YAHOO.log("showAbout() done");

  } // End showAbout().


  /**
   * Hide the About overlay.
   */
  this.hideAbout = function() {

    YAHOO.log("hideAbout()");

    oAboutOverlay.hide();
    overlayOrDialogVisible = false;

    YAHOO.log("hideAbout() done");

  } // End hideAbout().


} // End JSNotes class.