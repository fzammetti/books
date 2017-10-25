/**
 * The main class that is the core code of the application.
 */
function CodeCabinet() {


  /**
   * Declare a custom store for categories so we can implement save.
   */
  dojo.declare("CustomCategoriesItemFileWriteStore",
    dojo.data.ItemFileWriteStore, {
      _saveCustom: function(saveCompleteCallback, saveFailedCallback) {

        // Abort if Google Gears isn't installed.
        if (!window.google || !google.gears) {
          saveCompleteCallback();
          return;
        }

        // Gears is available, persist categories.  Do this by iterating over
        // the array of items in this store and inserting each into the
        // Gears database.  Note that this always starts with deleting all
        // categories, so if this store is empty, we're good to go then.
        // While this isn't efficient, it does make it easy: no worries about
        // what got added, modified or deleted, it's just all written fresh.
        var db = google.gears.factory.create("beta.database");
        db.open("DojoCodeCabinet");
        db.execute("DELETE FROM categories");
        var items = this._getItemsArray();
        if (items.length > 0) {
          for (var i = 0; i < items.length; i++) {
            db.execute("INSERT INTO categories VALUES (?, ?, ?)", [
              items[i].id, items[i].name, items[i].type
            ]);
          }
        }

        saveCompleteCallback();

      }
    }
  );


  /**
   * Declare a custom store for snippets so we can implement save.
   */
  dojo.declare("CustomSnippetsItemFileWriteStore",
    dojo.data.ItemFileWriteStore, {
      _saveCustom: function(saveCompleteCallback, saveFailedCallback) {

        // Abort if Google Gears isn't installed.
        if (!window.google || !google.gears) {
          saveCompleteCallback();
          return;
        }

        // Gears is available, persist snippets.  Do this by iterating over
        // the array of items in this store and inserting each into the
        // Gears database.  Note that this always starts with deleting all
        // snippets in the current category, so if this store is empty, we're
        // good to go then.  While this isn't efficient, it does make it easy:
        // no worries about what got added, modified or deleted, it's just all
        // written fresh.
        var db = google.gears.factory.create("beta.database");
        db.open("DojoCodeCabinet");
        db.execute("DELETE FROM snippets WHERE category=" +
          codeCabinet.categoriesStore.getValue(
            codeCabinet.currentCategory, "id")
        );
        var items = this._getItemsArray();
        if (items.length > 0) {
          for (var i = 0; i < items.length; i++) {
            db.execute("INSERT INTO snippets VALUES " +
              "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
              items[i].id, items[i].category, items[i].name,
              items[i].description, items[i].author, items[i].eMail,
              items[i].webLink, items[i].code, items[i].notes,
              items[i].keywords
            ]);
          }
        }

        saveCompleteCallback();

      }

    }
  );


  /**
   * The store for the category tree.
   */
  this.categoriesStore = new CustomCategoriesItemFileWriteStore({data:{
    label : "name", identifier : "id", items : [
    ]
  }});


  /**
   * The stores for the snippets grid.  Each category will be it's own
   * store within this collection.
   */
  this.snippetsStores = new Array();


  /**
   * The model for the snippets grid.  This will wrap one of the stores in the
   * snippetsStores collection.
   */
  this.snippetsStoreModel = null;


  /**
   * The layout for the snippets and search grids.
   */
  this.gridLayout = [{
    cells: [[
      { name : "Snippet Name", field : "name", width : "auto" },
      { name : "Description", field : "description", width : "auto" }
    ]]
  }];


  /**
   * The store for the search grid.
   */
  this.searchStore = new dojo.data.ItemFileWriteStore({data:{
    label : "name", identifier : "id", items : [ ]
  }});


  /**
   * The model for the search grid.
   */
  this.searchStoreModel = null;


  /**
   * The item of the currently selected category.
   */
  this.currentCategory = null;


  /**
   * The currently selected catalog's snippets store.
   */
  this.currentSnippetsStore = null;


  /**
   * The item of the currently selected code snippet.
   */
  this.currentSnippet = null;


  /**
   * Initialize the application.
   */
  this.init = function() {

    // There doesn't appear to be a way to disable tabs, so we have to fake
    // it.  To do so, we connect to the selectChild event and do some work
    // when it fires.
    dojo.connect(dijit.byId("tabs"), "selectChild", null, function(inTab) {
      // If there is no category selected, or if there is a category selected
      // but no snippet selected...
      if (codeCabinet.currentCategory == null ||
        codeCabinet.currentSnippet == null) {
        // And if the tab selected was NOT the snippets tab...
        if (inTab.id != "tabSnippets") {
          // Then we select the snippets tab.  The user will see that when
          // they click one of the other tabs, nothing happens, effectively
          // disabling them.
          dijit.byId("tabs").selectChild(dijit.byId("tabSnippets"));
        }
      }
    });

    // See if Google Gears is installed.
    if (!window.google || !google.gears) {

      // It's not, so show the installation dialog.
      dijit.byId("NoGearsDialog").show();

    } else {

      // Read categories in and populate the store, creating the table if it
      // doesn't yet exist.
      var db = google.gears.factory.create("beta.database");
      db.open("DojoCodeCabinet");

      // Uncomment the following two lines to clear out the database.  Good
      // for when you're messing around with things and, well, mess up!
      //db.execute("DROP TABLE categories");
      //db.execute("DROP TABLE snippets");

      db.execute("CREATE TABLE IF NOT EXISTS categories (" +
        "id INT, " +
        "name TEXT, " +
        "type TEXT" +
      ")");
      var rs = db.execute("SELECT id,name,type FROM categories ORDER BY name");
      while (rs.isValidRow()) {
        // Add an item to the tree's store.
        codeCabinet.categoriesStore.newItem({
          id : rs.field(0),
          name : rs.field(1),
          type : rs.field(2)
        });
        // Also add a store for the snippets in this category.
        codeCabinet.snippetsStores[rs.field(0)] =
          new CustomSnippetsItemFileWriteStore({data:{
            label : "name", identifier : "id", items : [ ]
          }}
        );
        rs.next();
      }

      // Read snippets in and populate the appropriate store, creating the
      // table if it doesn't yet exist.
      var db = google.gears.factory.create("beta.database");
      db.open("DojoCodeCabinet");
      db.execute("CREATE TABLE IF NOT EXISTS snippets (" +
        "id INT, " +
        "category INT, " +
        "name TEXT, " +
        "description TEXT, " +
        "author TEXT, " +
        "eMail TEXT, " +
        "webLink TEXT, " +
        "code TEXT, " +
        "notes TEXT, " +
        "keywords TEXT" +
      ")");
      var rs = db.execute("SELECT id,category,name,description,author," +
        "eMail,webLink,code,notes,keywords FROM snippets");
      while (rs.isValidRow()) {
        // Add item to the snippets store for the category associated with the
        // next snippet in the result set.
        codeCabinet.snippetsStores[rs.field(1)].newItem({
          id : rs.field(0),
          category : rs.field(1),
          name : rs.field(2),
          description : rs.field(3),
          author : rs.field(4),
          eMail : rs.field(5),
          webLink : rs.field(6),
          code : rs.field(7),
          notes : rs.field(8),
          keywords : rs.field(9)
        });
        rs.next();
      }

    } // End if.

    dijit.byId("snippetsGrid").domNode.style.display = "none";
    dijit.byId("searchGrid").domNode.style.display = "none";

    codeCabinet.searchClearClicked();

  } // End init().


  /**
   * Called when the toolbar Add Category button is clicked.
   */
  this.addCategoryClicked = function() {

    // Show the Add Category dialog.
    dijit.byId("AddCategoryName").setValue("");
    dijit.byId("AddCategoryDialog").show();

  } // End addCategoryClicked().


  /**
   * Called when the Add button on the Add Category dialog is clicked.
   */
  this.addCategory = function() {

    // Hide dialog and get entered value, if any.
    dijit.byId("AddCategoryDialog").hide();
    var categoryName = dijit.byId("AddCategoryName").getValue();

    // If we got a category name...
    if (categoryName != null) {
      categoryName = dojo.string.trim(categoryName);
      if (categoryName != "") {
        // And if it's not a duplicate...
        if (codeCabinet.snippetsStores[categoryName]) {
          dijit.byId("DuplicateCategoryDialog").show();
          return;
        }
        // Add it to the store for the categories tree.
        var categoryID = new Date().getTime();
        codeCabinet.categoriesStore.newItem({
          id : categoryID,
          name : categoryName,
          type : "category"
        });
        // Also add a new store for it's snippets.
        codeCabinet.snippetsStores[categoryID] =
          new CustomSnippetsItemFileWriteStore({data:{
            label : "name", identifier : "id", items : [ ]
          }}
        );
        // Finally, persist to the underlying persistent store.
        codeCabinet.categoriesStore.save();
      }
    }

  } // End addCategory().


  /**
   * Called when the toolbar Delete Category button is clicked.
   */
  this.deleteCategoryClicked = function() {

    // Show the delete confirmation dialog.
    dojo.byId("confirmDeleteType").innerHTML = "catalog";
    dijit.byId("ConfirmDeleteDialog").show();

  } // End deleteCategoryClicked().


  /**
   * Called to delete the currently selected catalog.
   */
  this.deleteCategory = function() {

    // Clear any search results that might be present, and the search form.
    codeCabinet.searchClearClicked();

    // Remove the snippets store and clear snippet-related fields.
    delete codeCabinet.snippetsStores[
      codeCabinet.categoriesStore.getValue(
        codeCabinet.currentCategory, "id")];
    codeCabinet.currentSnippetsSore = null;
    codeCabinet.currentSnippet = null;

    // Delete all snippets for this category from the Gears database.  Note that
    // this could have (and some mightly argue should have been) done by
    // iterating over all the items in the snippets store for this category,
    // deleting each from the store, then calling save() on the store.  But,
    // since we're going to delete the store from the collection of snippet
    // stores anyway, this saves a lot of time.
    var db = google.gears.factory.create("beta.database");
    db.open("DojoCodeCabinet");
    db.execute("DELETE FROM snippets WHERE category=" +
      codeCabinet.categoriesStore.getValue(
        codeCabinet.currentCategory, "id")
    );

    // Update UI with regard to snippets.
    codeCabinet.refreshSnippetsGrid();
    dojo.byId("noSnippetsInCategory").style.display = "none";
    dojo.byId("noCategorySelected").style.display = "";
    dijit.byId("snippetsGrid").domNode.style.display = "none";
    dijit.byId("toolbarAddSnippet").setDisabled(true);
    dijit.byId("toolbarDeleteSnippet").setDisabled(true);
    dijit.byId("btnSearch").setDisabled(true);
    dijit.byId("btnClear").setDisabled(true);
    dijit.byId("searchKeywords").setDisabled(true);
    dijit.byId("searchCode").setDisabled(true);
    dijit.byId("searchName").setDisabled(true);
    dijit.byId("searchDescription").setDisabled(true);
    dijit.byId("searchAuthor").setDisabled(true);
    dijit.byId("searchNotes").setDisabled(true);

    // Remove the Category item from the store.  This automatically updates
    // the tree.  Also do other category-related UI setup.
    codeCabinet.categoriesStore.deleteItem(codeCabinet.currentCategory);
    codeCabinet.currentCategory = null;
    dijit.byId("toolbarDeleteCategory").setDisabled(true);

    // Finally, persist to the underlying persistent store.
    codeCabinet.categoriesStore.save();

  } // End deleteCategory().


  /**
   * Called when the toolbar Add Snippet button is clicked.
   */
  this.addSnippetClicked = function() {

    // Add the item to the store.
    codeCabinet.currentSnippetsStore.newItem({
      id : new Date().getTime(),
      category : codeCabinet.categoriesStore.getValue(
        codeCabinet.currentCategory, "id"),
      name : "NewSnippet",
      description : "A new snippet",
      author : "",
      eMail : "",
      webLink : "",
      code : "",
      notes : "",
      keywords : ""
    });

    // Update the grid.
    codeCabinet.refreshSnippetsGrid();

    // Finally, persist to the underlying persistent store.
    codeCabinet.currentSnippetsStore.save();

  } // End addSnippetClicked().


  /**
   * Called when the toolbar Delete Snippet button is clicked.
   */
  this.deleteSnippetClicked = function() {

    // Show the delete confirmation dialog.
    dojo.byId("confirmDeleteType").innerHTML = "snippet";
    dijit.byId("ConfirmDeleteDialog").show();

  } // End deleteSnippetClicked().


  /**
   * Called to delete the currently selected snippet.
   */
  this.deleteSnippet = function() {

    // Remove the item from the store.  Note that unlike the tree, this doesn't
    // automatically update the grid, so we'll handle that ourselves next.
    codeCabinet.currentSnippetsStore.deleteItem(codeCabinet.currentSnippet);

    // Set up snippet-related functionality.
    codeCabinet.currentSnippet = null;
    dijit.byId("toolbarDeleteSnippet").setDisabled(true);

    // Update the grid.
    codeCabinet.refreshSnippetsGrid();

    // Finally, persist to the underlying persistent store.
    codeCabinet.currentSnippetsStore.save();

  } // End deleteSnippet().


  /**
   * Called when either of the Yes or No buttons on the delete confirmation
   * dialog is clicked.
   *
   * @param inProceed True if Yes was clicked, false if No was clicked.
   */
  this.confirmDelete = function(inProceed) {

    // Hide the dialog.
    dijit.byId("ConfirmDeleteDialog").hide();

    // See if the deletion was confirmed.
    if (inProceed) {
      // Call deleteCategory() if confirmation was for a category deletion.
      if (dojo.string.trim(dojo.byId("confirmDeleteType").innerHTML) ==
        "catalog") {
        codeCabinet.deleteCategory();
      } else {
        // The only other possibility is a snippet deletion.
        codeCabinet.deleteSnippet();
      }
    }

  } // End confirmDelete().


  /**
   * Called when a category in the tree is clicked.
   *
   * @param inItem The item from the data store that was clicked.
   */
  this.categoryClicked = function(inItem) {

    // Ignore clicks on the top-level element.
    if (!inItem) {
      return;
    }

    // Clear any search results that might be present, and the search form.
    codeCabinet.searchClearClicked();

    // Set up category-related functionality.
    codeCabinet.currentCategory = inItem;
    codeCabinet.currentSnippetsStore =
      codeCabinet.snippetsStores[
        codeCabinet.categoriesStore.getValue(inItem, "id")];
    dijit.byId("toolbarDeleteCategory").setDisabled(false);

    // Set up snippet-related functionality.
    codeCabinet.currentSnippet = null;
    dijit.byId("toolbarAddSnippet").setDisabled(false);
    dijit.byId("toolbarDeleteSnippet").setDisabled(true);
    dijit.byId("btnSearch").setDisabled(false);
    dijit.byId("btnClear").setDisabled(false);
    dijit.byId("searchKeywords").setDisabled(false);
    dijit.byId("searchCode").setDisabled(false);
    dijit.byId("searchName").setDisabled(false);
    dijit.byId("searchDescription").setDisabled(false);
    dijit.byId("searchAuthor").setDisabled(false);
    dijit.byId("searchNotes").setDisabled(false);

    // Clear forms on all entry tabs.
    dojo.byId("infoForm").reset();
    dojo.byId("codeForm").reset();
    dojo.byId("notesForm").reset();
    dojo.byId("keywordsForm").reset();

    // Update the grid.
    codeCabinet.refreshSnippetsGrid();

  } // End categoryClicked().


  /**
   * Called when a snippet in the snippets grid is clicked.
   *
   * @param inRowIndex The index of the row that was clicked.
   */
  this.snippetClicked = function(inRowIndex) {

    // Get all items in current snippets collection, then get the clicked
    // item from it.  This has to be done because all we know at this point
    // is the row index from the grid, we can't uniquely identify the item
    // that was clicked, so we have to fetch all the items in order to use
    // that row index.
    codeCabinet.currentSnippetsStore.fetch(
      { onComplete : function(items, request) {
        // Record the clicked snippet as current and show it's details.
        codeCabinet.currentSnippet = items[inRowIndex];
        codeCabinet.showSnippet();
      }
    });

  } // End snippetClicked().


  /**
   * This function is called to show the current snippet's details.
   */
  this.showSnippet = function() {

    // Set up UI, start by clearing everything.
    dojo.byId("infoForm").reset();
    dojo.byId("codeForm").reset();
    dojo.byId("notesForm").reset();
    dojo.byId("keywordsForm").reset();
    dijit.byId("toolbarDeleteSnippet").setDisabled(false);

    // Populate Info edit fields.
    dijit.byId("infoName").setValue(
      codeCabinet.currentSnippetsStore.getValue(
        codeCabinet.currentSnippet, "name"));
    dijit.byId("infoDescription").setValue(
      codeCabinet.currentSnippetsStore.getValue(
        codeCabinet.currentSnippet, "description"));
    dijit.byId("infoAuthor").setValue(
      codeCabinet.currentSnippetsStore.getValue(
        codeCabinet.currentSnippet, "author"));
    dijit.byId("infoEMail").setValue(
      codeCabinet.currentSnippetsStore.getValue(
        codeCabinet.currentSnippet, "eMail"));
    dijit.byId("infoWebLink").setValue(
      codeCabinet.currentSnippetsStore.getValue(
        codeCabinet.currentSnippet, "webLink"));

    // Populate code and notes textareas.
    // Have to add a space to the following two because if the value
    // of either if "", an error occurs, it seems there has to be
    // *something* being inserted, even if it's just a single space.
    dijit.byId("codeArea").setValue(
      codeCabinet.currentSnippetsStore.getValue(
        codeCabinet.currentSnippet, "code") + " ");
    dijit.byId("notesArea").setValue(
      codeCabinet.currentSnippetsStore.getValue(
        codeCabinet.currentSnippet, "notes") + " ");

    // Populate keywords.
    var kw = new String(codeCabinet.currentSnippetsStore.getValue(
      codeCabinet.currentSnippet, "keywords")).split(",");
    for (var i = 0; i < kw.length; i++) {
      dijit.byId("keyword" + i).setValue(kw[i]);
    }

    // Enable all save buttons.
    dijit.byId("btnInfoSave").setDisabled(false);
    dijit.byId("btnCodeSave").setDisabled(false);
    dijit.byId("btnNotesSave").setDisabled(false);
    dijit.byId("btnKeywordsSave").setDisabled(false);

    // Activate Info tab.
    dijit.byId("tabs").selectChild(dijit.byId("tabInfo"));

  } // End showSnippet().


  /**
   * Called when any of the Save buttons are clicked.
   */
  this.saveSnippet = function() {

    // Construct a CSV of entered keywords, if any.
    var keywords = "";
    for (var i = 0; i < 10; i++) {
      var kw = dijit.byId("keyword" + i).getValue();
      if (kw != null) {
        kw = dojo.string.trim(kw);
        if (kw != "") {
          if (keywords != "") {
            keywords = keywords + ",";
          }
          keywords = keywords + dojo.string.trim(kw);
        }
      }
    }

    // Update the snippets grid to reflect any changes.  To do this, because
    // there seems to be a bug in the grid, we have to delete the item from
    // the store and then add it as a new item.
    codeCabinet.currentSnippetsStore.deleteItem(codeCabinet.currentSnippet);
    codeCabinet.currentSnippetsStore.newItem({
      id : new Date().getTime(),
      category : codeCabinet.categoriesStore.getValue(
        codeCabinet.currentCategory, "id"),
      name : dojo.string.trim((dijit.byId("infoName").getValue() || "")),
      description :
        dojo.string.trim(dijit.byId("infoDescription").getValue() || ""),
      author : dojo.string.trim(dijit.byId("infoAuthor").getValue() || ""),
      eMail : dojo.string.trim(dijit.byId("infoEMail").getValue() || ""),
      webLink : dojo.string.trim(dijit.byId("infoWebLink").getValue() || ""),
      code : dojo.string.trim(dijit.byId("codeArea").getValue() || ""),
      notes : dojo.string.trim(dijit.byId("notesArea").getValue() || ""),
      keywords : keywords
    });

    // Update the grid.
    codeCabinet.refreshSnippetsGrid();

    // Finally, persist to the underlying persistent store.
    codeCabinet.currentSnippetsStore.save();

  } // End saveSnippet().


  /**
   * This function is called from multiple places to update the snippets grid
   * for the current category whenever a change to a snippet takes place, or
   * when the category is clicked.
   */
  this.refreshSnippetsGrid = function() {

    // Switch to the Snippets tab so updates to the grid show up.
    dijit.byId("tabs").selectChild(dijit.byId("tabSnippets"));

    // Retrieve all the items from the store for the current category.
    codeCabinet.currentSnippetsStore.fetch({
      onComplete : function(items, request) {
        // If there's items, we can display them (this avoids an error with
        // the grid... without this check, an empty store causes an error).
        if (items.length > 0) {
          dijit.byId("snippetsGrid").domNode.style.display = "";
          dojo.byId("noSnippetsInCategory").style.display = "none";
          dojo.byId("noCategorySelected").style.display = "none";
          // Wrap the current store in a model and set it on the grid, update
          // occurs automatically after that.
          codeCabinet.snippetsStoreModel = new dojox.grid.data.DojoData(
            null, codeCabinet.currentSnippetsStore);
          dijit.byId("snippetsGrid").setModel(codeCabinet.snippetsStoreModel);
          dijit.byId("snippetsGrid").update();
        } else {
          dijit.byId("snippetsGrid").domNode.style.display = "none";
          dojo.byId("noCategorySelected").style.display = "none";
          dojo.byId("noSnippetsInCategory").style.display = "";
        }
      }
    });

  } // End refreshSnippetsGrid().


  /**
   * Called when the Search button is clicked.
   */
  this.searchClicked = function() {

    // Get all search parameters.  Trim them, make them lower-case, and make
    // sure we never have nulls here.
    var searchKeywords = dijit.byId("searchKeywords").getValue();
    if (searchKeywords == null) { searchKeywords = ""; }
    searchKeywords = dojo.string.trim(searchKeywords);
    searchKeywords = searchKeywords.toLowerCase();
    var searchCode = dijit.byId("searchCode").getValue();
    if (searchCode == null) { searchCode = ""; }
    searchCode = dojo.string.trim(searchCode);
    searchCode = searchCode.toLowerCase();
    var searchName = dijit.byId("searchName").getValue();
    if (searchName == null) { searchName = ""; }
    searchName = dojo.string.trim(searchName);
    searchName = searchName.toLowerCase();
    var searchAuthor = dijit.byId("searchAuthor").getValue();
    if (searchAuthor == null) { searchAuthor = ""; }
    searchAuthor = dojo.string.trim(searchAuthor);
    searchAuthor = searchAuthor.toLowerCase();
    var searchDescription = dijit.byId("searchDescription").getValue();
    if (searchDescription == null) { searchDescription = ""; }
    searchDescription = dojo.string.trim(searchDescription);
    searchDescription = searchDescription.toLowerCase();
    var searchNotes = dijit.byId("searchNotes").getValue();
    if (searchNotes == null) { searchNotes = ""; }
    searchNotes = dojo.string.trim(searchNotes);
    searchNotes = searchNotes.toLowerCase();

    // Ensure acceptable criteria are entered.
    if (searchKeywords == "" && searchCode == "" & searchName == "" &&
      searchAuthor == "" && searchDescription == "" && searchNotes == "") {
      dijit.byId("BadSearchCriteriaDialog").show();
      return;
    }

    // "Clear" the searchStore.
    codeCabinet.searchStore = new dojo.data.ItemFileWriteStore({data:{
      label : "name", identifier : "id", items : [ ]
    }});

    // Fetch all the snippets from the store.
    codeCabinet.currentSnippetsStore.fetch(
      { onComplete : function(items, request) {

        // Cycle through them and find the matches.
        var matchesFound = false;
        for (var i = 0; i < items.length; i++) {

          // Get the data from the next snippet, trim it nice and make it
          // lower-case so searches are case-insensitive.
          var itemKeywords = codeCabinet.currentSnippetsStore.getValue(
            items[i], "keywords");
          if (itemKeywords == null) { itemKeywords = ""; }
          itemKeywords = dojo.string.trim(itemKeywords);
          itemKeywords = itemKeywords.toLowerCase();
          var itemCode = codeCabinet.currentSnippetsStore.getValue(
            items[i], "code");
          if (itemCode == null) { itemCode = ""; }
          itemCode = dojo.string.trim(itemCode);
          itemCode = itemCode.toLowerCase();
          var itemName = codeCabinet.currentSnippetsStore.getValue(
            items[i], "name");
          if (itemName == null) { itemName = ""; }
          itemName = dojo.string.trim(itemName);
          itemName = itemName.toLowerCase();
          var itemAuthor = codeCabinet.currentSnippetsStore.getValue(
            items[i], "author");
          if (itemAuthor == null) { itemAuthor = ""; }
          itemAuthor = dojo.string.trim(itemAuthor);
          itemAuthor = itemAuthor.toLowerCase();
          var itemDescription = codeCabinet.currentSnippetsStore.getValue(
            items[i], "description");
          if (itemDescription == null) { itemDescription = ""; }
          itemDescription = dojo.string.trim(itemDescription);
          itemDescription = itemDescription.toLowerCase();
          var itemNotes = codeCabinet.currentSnippetsStore.getValue(
            items[i], "notes");
          if (itemNotes == null) { itemNotes = ""; }
          itemNotes = dojo.string.trim(itemNotes);
          itemNotes = itemNotes.toLowerCase();

          // This variable will have a T or F added to it for each search
          // criteria that was entered.  If we get to the end and there's any
          // F's in it, then this snippet didn't match one of the entered
          // criteria and is therefore not a match.
          var matched = "";

          // Search includes name.
          if (searchName != "") {
            if (itemName.indexOf(searchName) != -1) {
              matched += "T";
            } else {
              matched += "F";
            }
          }

          // Search includes code.
          if (searchCode != "") {
            if (itemCode.indexOf(searchCode) != -1) {
              matched += "T";
            } else {
              matched += "F";
            }
          }

          // Search includes author.
          if (searchAuthor != "") {
            if (itemAuthor.indexOf(searchAuthor) != -1) {
              matched += "T";
            } else {
              matched += "F";
            }
          }

          // Search includes description.
          if (searchDescription != "") {
            if (itemDescription.indexOf(searchDescription) != -1) {
              matched += "T";
            } else {
              matched += "F";
            }
          }

          // Search includes notes.
          if (searchNotes != "") {
            if (itemNotes.indexOf(searchNotes) != -1) {
              matched += "T";
            } else {
              matched += "F";
            }
          }

          // Search includes keyword(s).
          if (searchKeywords != "") {
            var a = searchKeywords.split(",");
            var foundAny = false;
            for (var j = 0; j < a.length; j++) {
              var nextKeyword = dojo.string.trim(a[j]);
              if (nextKeyword != "") {
                if (itemKeywords.indexOf(nextKeyword) != -1) {
                  foundAny = true;
                }
              }
            }
            if (foundAny) {
              matched += "T";
            } else {
              matched += "F";
            }
          }

          // If current snippet matches the search criteria, add it to the
          // search store.
          if (matched.indexOf("F") == -1) {
            matchesFound = true;
            codeCabinet.searchStore.newItem({
              id : codeCabinet.currentSnippetsStore.getValue(items[i], "id"),
              category :
                codeCabinet.currentSnippetsStore.getValue(
                  items[i], "category"),
              name :
                codeCabinet.currentSnippetsStore.getValue(items[i], "name"),
              description :
                codeCabinet.currentSnippetsStore.getValue(
                  items[i], "description")
            });
          }

        } // End iteration over snippets.

        // Update the search results grid, if we found some matches, otherwise
        // show the no matches found message.
        if (matchesFound) {
          dojo.byId("searchResultsMessage").style.display = "none";
          dojo.byId("searchNoResults").style.display = "none";
          codeCabinet.searchStoreModel = new dojox.grid.data.DojoData(
            null, codeCabinet.searchStore);
          var searchGrid = dijit.byId("searchGrid");
          searchGrid.domNode.style.display = "";
          searchGrid.setModel(codeCabinet.searchStoreModel);
          searchGrid.update();
        } else {
          dojo.byId("searchResultsMessage").style.display = "none";
          dojo.byId("searchNoResults").style.display = "";
          dijit.byId("searchGrid").domNode.style.display = "none";
        }

      } // End onComplete().

    });

  } // End searchClicked().


  /**
   * Called when a snippet in the search results grid is clicked.
   *
   * @param inRowIndex The index of the row that was clicked.
   */
  this.searchResultClicked = function(inRowIndex) {

    codeCabinet.searchStore.fetch(
      { onComplete : function(items, request) {
        // Get the item from the store corresponding to the clicked row.
        var searchItem = items[inRowIndex];
        // Now find the item in the currentSnippetsStore.
        var snippetID = codeCabinet.searchStore.getValue(searchItem, "id");
        codeCabinet.currentSnippetsStore.fetchItemByIdentity({
          identity : snippetID, onItem : function(item) {
            // Set it as the current snippet.
            codeCabinet.currentSnippet = item;
          }
        });
        // Show all the snippet details.
        codeCabinet.showSnippet();
      }
    });

  } // End searchResultClicked().


  /**
   * Called when the Clear search button is clicked.
   */
  this.searchClearClicked = function() {

    dojo.byId("searchForm").reset();
    dijit.byId("searchGrid").domNode.style.display = "none";
    dojo.byId("searchNoResults").style.display = "none";
    dojo.byId("searchResultsMessage").style.display = "";

  } // End searchClearClicked().


} // End class.


// The one and only instance of the main application class.
var codeCabinet = new CodeCabinet();
