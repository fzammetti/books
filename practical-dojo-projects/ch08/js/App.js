/**
 * The main application class.
 */
function App() {


  /**
   * AppID to use for Yahoo! Web Services.
   */
  this.appID = "XXX";


  /**
   * Constants used to specify a dialog to show.
   */
  this.DLG_INFO = "info";
  this.DLG_CONFIRM = "confirm";
  this.DLG_PLEASEWAIT = "pleaseWait";
  this.DLG_PRINT = "print";


  /**
   * Constants used when paging result set.
   */
  this.PAGERESULTS_FIRST = 5;
  this.PAGERESULTS_PREVIOUS = 6;
  this.PAGERESULTS_NEXT = 7;
  this.PAGERESULTS_LAST = 8;


  /**
   * Fields where the total number of search results and the index of the
   * first item showing in the grid from the overall search resultset are.
   */
  this.totalResultsAvailable = 0;
  this.firstResultPosition = 1;


  /**
   * Fields where the current search criteria are stored, needed for paging.
   */
  this.search_sortBy = null;
  this.search_minimumRating = null;
  this.search_queryKeyword = null;
  this.search_radius = null;
  this.search_street = null;
  this.search_city = null;
  this.search_state = null;
  this.search_zipCode = null;


  /**
   * Stores which of the three possible dialogs is currently showing, if any.
   */
  this.currentDialogShowing = null;


  /**
   * Reference to timer used to initialize Dojo storage system.
   */
  this.initTimer = null;


  /**
   * Flag to tell if we're in the first "phase" of storage initialization.
   */
  this.firstPhaseStorageInit = true;


  /**
   * An Dictionary of favorites.
   */
  this.favorites = null;


  /**
   * The currently selected item.  This is an Item object in the data store.
   */
  this.currentItem = null;


  /**
   * Flag: is the current item a favorite?
   */
  this.currentIsFavorite = false;


  /**
   * The data store for the search results grid.
   */
  this.searchResultsStore = null;


  /**
   * The model for the search results grid.
   */
  this.searchResultsStoreModel = null;


  /**
   * The layout for the search results grid.
   */
  this.searchResultsGridLayout = [{
    cells: [[
      { name : "Title", field : "title", width : "auto" },
      { name : "Distance", field : "distance", width : "auto" },
      { name : "Rating", field : "rating", width : "auto" }
    ]]
  }];


  /**
   * Initialization.  This gets called multiple times potentially during the
   * initialization process.
   */
  this.init = function() {

    if (dojo.exists("firstPhaseStorageInit", app)) {
      // Perform these tasks the first timer iteration only.
      app.showDialog(app.DLG_PLEASEWAIT, "... Initializing ...");
      // Make sure Gears is available, abort if not.
      if (!dojox.storage.manager.supportsProvider(
        "dojox.storage.GearsStorageProvider")) {
        app.hideDialog();
        app.showDialog(app.DLG_PLEASEWAIT,
          "Google Gears is not installed or is disabled, cannot continue.");
        return;
      }
      // Make sure we use Gears, then move on to second phase of initialization.
      dojox.storage.manager.setProvider(dojox.storage.GearsStorageProvider);
      app.firstPhaseStorageInit = false;
      app.initTimer = setTimeout("app.init()", 500);
    } else {
      // Do this as many times as necessary (phase 2 initialization).
      if (dojox.storage.manager.isInitialized()) {
        clearTimeout(app.initTimer);
        app.initTimer = null;
        app.readFavorites();
        app.showFavorites();
        app.setDefaultLocation();
        app.hideDialog();
        // Deal with an IE issue that caused Sort By and Minimum rating
        // fields to not be visible initially.
        dijit.byId("searchTabs").selectChild(dijit.byId("tabResults"));
        dijit.byId("searchTabs").selectChild(dijit.byId("tabSearch"));
      } else {
        app.initTimer  = setTimeout("app.init()", 500);
      }
    }

  } // End init().





  /**
   * Perform a search based on user-entered criteria and shows it.
   *
   * @param inUseCurrent When true, the stored current search values are used
   *                     rather then the user entered fields.  This is only
   *                     needed when paging results.
   */
  this.search = function(inUseCurrent) {

    // If not using current values (not paging), record the entered values
    // and do some other necessary setup tasks.
    if (!inUseCurrent) {
      app.search_sortBy = dijit.byId("sortBy").getValue();
      app.search_minimumRating = dijit.byId("minimumRating").getValue();
      app.search_queryKeyword = dijit.byId("queryKeyword").getValue();
      app.search_radius = dijit.byId("radius").getValue();
      app.search_street = dijit.byId("street").getValue();
      app.search_city = dijit.byId("city").getValue();
      app.search_state = dijit.byId("state").getValue();
      app.search_zipCode = dijit.byId("zipCode").getValue();
      app.totalResultsAvailable = 0;
      app.firstResultPosition = 1;
      dojo.byId("totalCount").innerHTML = "";
      app.enableVCRButtons(true);
    }

    // Input validation.
    if (app.search_queryKeyword == "") {
      app.showDialog(app.DLG_INFO, "You must enter a keyword to search for");
      return;
    }
    if (app.search_street == "" && app.search_city == "" &&
      app.search_state == "" && app.search_zipCode == "") {
      app.showDialog(app.DLG_INFO,
        "You must enter a location to search around " +
        "(just zip code at a minimum)");
      return;
    }
    if (app.search_street != "" &&
      (app.search_city == "" || app.search_state == "")) {
      app.showDialog(app.DLG_INFO,
        "When street is entered you must also enter city and state");
      return;
    }

    app.showDialog(app.DLG_PLEASEWAIT, "... Performing Search ...");

    // Set any defaults as applicable.
    if (app.search_sortBy == "") { app.search_sortBy = "distance"; }

    // Create object for parameters that will be passed to web service.
    var contentObj = {
      "appid" : app.appID, "output" : "json", "sort" :
      app.search_sortBy.toLowerCase(), start : app.firstResultPosition,
      results : 10
    };

    if (dojo.exists("search_queryKeyword", app)) {
      contentObj.query = dojo.string.trim(app.search_queryKeyword);
    }
    if (dojo.exists("search_minimumRating", app)) {
      contentObj.minimum_rating = app.search_minimumRating;
    }
    if (dojo.exists("search_radius", app)) {
      contentObj.radius = app.search_radius;
    }
    if (dojo.exists("search_street", app)) {
      contentObj.street = dojo.string.trim(app.search_street);
    }
    if (dojo.exists("search_city", app)) {
      contentObj.city = dojo.string.trim(app.search_city);
    }
    if (dojo.exists("search_state", app)) {
      contentObj.state = app.search_state;
    }
    if (dojo.exists("search_zipCode", app)) {
      contentObj.zip = app.search_zipCode;
    }

    // Call Yahoo! Local Search web service.
    dojo.io.script.get({
      callbackParamName : "callback", content : contentObj,
      url : "http://local.yahooapis.com/LocalSearchService/V3/localSearch"
    }).addCallback(function(response) {
      // Show search results, if there were any.
      if (!dojo.exists("ResultSet.Result", response)) {
        app.hideDialog();
        app.showDialog(app.DLG_INFO,
          "No businesses were found matching your search criteria");
        return;
      }
      // Create store from results.
      app.searchResultsStore = new dojo.data.ItemFileWriteStore({data:{
        label : "title", identifier : "id", items : [ ]
      }});
      for (var i = 0; i < response.ResultSet.Result.length; i++) {
        var ratingVal = response.ResultSet.Result[i].Rating.AverageRating;
        app.searchResultsStore.newItem({
          id : parseInt(response.ResultSet.Result[i].id),
          title : response.ResultSet.Result[i].Title,
          distance : response.ResultSet.Result[i].Distance,
          phone : response.ResultSet.Result[i].Phone,
          rating : (isNaN(ratingVal) ? 0 : ratingVal),
          address : response.ResultSet.Result[i].Address,
          city : response.ResultSet.Result[i].City,
          state : response.ResultSet.Result[i].State,
          latitude : response.ResultSet.Result[i].Latitude,
          longitude : response.ResultSet.Result[i].Longitude,
          businessUrl : response.ResultSet.Result[i].BusinessUrl
        });
      }
      // Show results in grid by connecting data store to is.
      dijit.byId("searchTabs").selectChild(dijit.byId("tabResults"));
      app.searchResultsStoreModel = new dojox.grid.data.DojoData(null, null, {
        store: app.searchResultsStore, query: {id:"*"}
      });
      dijit.byId("searchResultsGrid").setModel(app.searchResultsStoreModel);
      dijit.byId("searchResultsGrid").update();
      // Record and update total results and start position.
      app.totalResultsAvailable =
        parseInt(response.ResultSet.totalResultsAvailable);
      app.firstResultPosition =
        parseInt(response.ResultSet.firstResultPosition);
      dojo.byId("totalCount").innerHTML = app.firstResultPosition + " / " +
        app.totalResultsAvailable;
      // Hide searching dialog and we're done.
      app.hideDialog();
    });

  } // End search().


  /**
   * Enables (or disabled) all VCR buttons.
   *
   * @param inEnabled True to enable all buttons, false to disable all buttons.
   */
  this.enableVCRButtons = function(inEnabled) {

    if (inEnabled) {
      dijit.byId("vcrFirst").setDisabled(false);
      dijit.byId("vcrPrevious").setDisabled(false);
      dijit.byId("vcrNext").setDisabled(false);
      dijit.byId("vcrLast").setDisabled(false);
    } else {
      dijit.byId("vcrFirst").setDisabled(true);
      dijit.byId("vcrPrevious").setDisabled(true);
      dijit.byId("vcrNext").setDisabled(true);
      dijit.byId("vcrLast").setDisabled(true);
    }


  } // End enableVCRButtons().


  /**
   * Allows for paging though large result sets.
   *
   * @param inCommand One of the command constants from this class that
   *                  specifies the paging type.
   */
  this.pageResults = function(inCommand) {

    switch (inCommand) {
      case app.PAGERESULTS_FIRST:
        if (app.firstResultPosition > 1) {
          app.firstResultPosition = 1;
          app.search(true);
        }
      break;
      case app.PAGERESULTS_PREVIOUS:
        if (app.totalResultsAvailable > 10) {
          app.firstResultPosition = app.firstResultPosition - 10;
          if (app.firstResultPosition < 1) {
            app.firstResultPosition = 1;
          }
          app.search(true);
        }
      break;
      case app.PAGERESULTS_NEXT:
        if (app.totalResultsAvailable > 10) {
          app.firstResultPosition = app.firstResultPosition + 10;
          if (app.firstResultPosition >= app.totalResultsAvailable) {
            app.firstResultPosition = app.totalResultsAvailable - 10;
          }
          app.search(true);
        }
      break;
      case app.PAGERESULTS_LAST:
        if (app.totalResultsAvailable > 10 && app.firstResultPosition <
          (app.totalResultsAvailable - 10)) {
          app.firstResultPosition = app.totalResultsAvailable - 10;
          app.search(true);
        }
      break;
    }

  } // End pageResults().


  /**
   * Called when the New Search icon is clicked.
   */
  this.newSearch = function() {

    // Clear current data.
    app.currentItem = null;
    app.currentIsFavorite = false;
    app.totalResultsAvailable = 0;
    app.firstResultPosition = 1;
    app.search_sortBy = null;
    app.search_minimumRating = null;
    app.search_queryKeyword = null;
    app.search_radius = null;
    app.search_street = null;
    app.search_city = null;
    app.search_state = null;
    app.search_zipCode = null;

    // Clear search results grid by connecting an empty store to it.
    app.searchResultsStore = new dojo.data.ItemFileWriteStore({data:{
      label : "title", identifier : "id", items : [ ]
    }});
    dijit.byId("searchTabs").selectChild(dijit.byId("tabResults"));
    app.searchResultsStoreModel = new dojox.grid.data.DojoData(null, null, {
      store: app.searchResultsStore
    });
    dijit.byId("searchResultsGrid").setModel(app.searchResultsStoreModel);
    dijit.byId("searchResultsGrid").update();

    // Clear search criteria form.
    dijit.byId("searchTabs").selectChild(dijit.byId("tabSearch"));
    dojo.byId("searchForm").reset();

    // Clear details tabs and other UI reset work.
    app.clearDetailsTabs();
    app.enableVCRButtons(false);
    dojo.byId("totalCount").innerHTML = "";

    // Reset to stored default values for convenience, and reset a few others
    // to sensible defaults.
    app.setDefaultLocation();
    dijit.byId("minimumRating").setValue(0);
    dijit.byId("radius").setValue(10);

  } // End newSearch().


  /**
   * Clears the details and map tabs.
   */
  this.clearDetailsTabs = function() {

    dijit.byId("detailsTabs").selectChild(dijit.byId("tabDetails"));
    dojo.byId("details_title").innerHTML = "";
    dojo.byId("details_latitude").innerHTML = "";
    dojo.byId("details_longitude").innerHTML = "";
    dojo.byId("details_distance").innerHTML = "";
    dojo.byId("details_phone").innerHTML = "";
    dojo.byId("details_rating").innerHTML = "";
    dojo.byId("details_address").innerHTML = "";
    dojo.byId("details_city").innerHTML = "";
    dojo.byId("details_state").innerHTML = "";
    dojo.byId("details_businessUrl").innerHTML = "";
    dojo.byId("imgMap").src = "img/transPix.gif";
    dojo.style("imgMap", "display", "none");
    dijit.byId("sldZoom").setValue(6);

  } // End clearDetailsTabs().


  /**
   * Called when an item is clicked in the search results grid.
   *
   * @param inIndex Index of the item that was clicked.
   */
  this.itemClicked = function(inIndex) {

    // Get all items in current snippets collection, then get the clicked
    // item from it.  This has to be done because all we know at this point
    // is the row index from the grid, we can't iniquely identify the item
    // that was clicked, so we have to fetch all the items in order to use
    // that row index.
    dijit.byId("detailsTabs").selectChild(dijit.byId("tabDetails"));
    app.searchResultsStore.fetch(
      { onComplete : function(items, request) {
        // Get the Item from the data store, and create a simple object out of
        // it with all the attributes on it.
        app.currentIsFavorite = false;
        var attrs = app.searchResultsStore.getAttributes(items[inIndex]);
        var item = new Object();
        for (var i = 0; i < attrs.length; i++) {
          item[attrs[i]] = app.searchResultsStore.getValue(items[inIndex],
            attrs[i]);
        }
        app.currentItem = item;
        app.showItemDetails();
      }
    });

  } // End itemClicked().


  /**
   * Shows details for the current item.  Also shows a map for the item.
   */
  this.showItemDetails = function() {

    // Iterate over attributes in the item.
    for (var attr in app.currentItem) {
      // If the current attribute has a corresponding field on the screen,
      // go ahead and populate it.
      var fieldOnScreen = dojo.byId("details_" + attr);
      if (fieldOnScreen) {
        if (attr == "businessUrl") {
          fieldOnScreen.innerHTML = "<a href=\"" + app.currentItem[attr] +
            "\" target=\"new\">" + app.currentItem[attr] + "</a>";
        } else {
          fieldOnScreen.innerHTML = app.currentItem[attr];
        }
      }
    }

    // Show map.
    app.showMap();

  } // End showItemDetails().


  /**
   * Shows a map for a given longitude and latitude.
   *
   * @param inZoomLevel Zoom level for map.  If not passed in, default level
   *                    6 is used.
   */
  this.showMap = function(inZoomLevel) {

    // Make call to Yahoo! Map service.
    if (dojo.exists("currentItem", app)) {
      if (!inZoomLevel) {
        inZoomLevel = 6;
      }
      dijit.byId("sldZoom").setValue(inZoomLevel);
      dojo.io.script.get({
        callbackParamName : "callback",
        url : "http://local.yahooapis.com/MapsService/V1/mapImage",
        content : {
          "appid" : app.appID, "output" : "json",
          "longitude" : app.currentItem.longitude,
          "latitude" : app.currentItem.latitude,
          image_width : 480, image_height : 460, zoom : inZoomLevel
        }
      }).addCallback(function(response) {
        // Show map.
        dojo.style("imgMap", "display", "");
        dojo.byId("imgMap").src = response.ResultSet.Result;
      });
    }

  } // End showMap().


  /**
   * Save the currently entered location as the default for searches.
   */
  this.saveLocation = function() {

    // Save location values for one year.
    dojo.cookie("defaultLocation_street",
      dijit.byId("street").getValue(), { expires : 365 });
    dojo.cookie("defaultLocation_city",
      dijit.byId("city").getValue(), { expires : 365 });
    dojo.cookie("defaultLocation_state",
      dijit.byId("state").getValue(), { expires : 365 });
    dojo.cookie("defaultLocation_zipCode",
      dijit.byId("zipCode").getValue(), { expires : 365 });

    // Tell the user we're done.
    app.showDialog(app.DLG_INFO,
      "This location has been saved and will be used automatically " +
      "next time you start the application");

  } // End saveLocation().


  /**
   * Set default location values from cookies.
   */
  this.setDefaultLocation = function() {

    dijit.byId("street").setValue(dojo.cookie("defaultLocation_street"));
    dijit.byId("city").setValue(dojo.cookie("defaultLocation_city"));
    dijit.byId("state").setValue(dojo.cookie("defaultLocation_state"));
    dijit.byId("zipCode").setValue(dojo.cookie("defaultLocation_zipCode"));

  } // End setDefaultLocation().


  /**
   * Shows an informational message to the user.
   *
   * @param inWhich   The constant DLG_INFO to show the message
   *                  (informational) dialog, or DLG_CONFIRM to show the
   *                  confirmation dialog (user has a choice to make).
   * @param inMessage The message text to show (note: not used for the
   *                  print dialog).
   */
  this.showDialog = function(inWhich, inMessage) {

    var textField = dojo.byId(inWhich + "Text");
    if (textField) {
      textField.innerHTML = inMessage;
    }
    dijit.byId(inWhich + "Dialog").show();
    app.currentDialogShowing = inWhich;

  } // End showDialog().


  /**
   * Hides the currently showing dialog.
   *
   */
  this.hideDialog = function() {

    dijit.byId(app.currentDialogShowing + "Dialog").hide();
    app.currentDialogShowing = null;

  } // End hideDialog().


  /**
   * Called when the Yes or No button on the confirm dialog is clicked.
   *
   * @param inYesOrNo True if Yes was clicked, False if No was clicked.
   */
  this.confirmCallback = function(inYesOrNo) {

    app.hideDialog();
    var confirmText = dojo.byId("confirmText").innerHTML;
    if (inYesOrNo) {
      if (confirmText.indexOf(
          "Are you sure you want to delete the favorite") != -1) {
        app.deleteFavorite(true);
      } else {
        app.clearFavorites(true);
      }
    }

  } // End confirmCallback().


  /**
   * Prints the current map and information about the current item displayed.
   */
  this.printCurrentItem = function() {

    // Make sure we have a current item to print.
    if (!dojo.exists("currentItem", app)) {
      app.showDialog(app.DLG_INFO,
        "Please select an item (either a favorite or a search result) " +
        "to print it");
      return;
    }

    // Show print dialog, then reset the currentDialogShowing field, since it
    // won't be done via the usual call to hideDialog().
    app.showDialog(app.DLG_PRINT);
    app.currentDialogShowing = null;

    // Populate details of current item, including map.
    for (var attr in app.currentItem) {
      var field = dojo.byId("print_" + attr);
      if (field) {
        field.innerHTML = app.currentItem[attr];
      }
    }
    dojo.byId("print_map").src = dojo.byId("imgMap").src;

    // Pop info dialog.
    app.showDialog(app.DLG_INFO,
      "You can now print, and remember to close this maximized dialog " +
      "when you are done to return to the application");

  } // End printCurrentItem().


  /**
   * Read in favorites from database, if any.
   */
  this.readFavorites = function() {

    app.favorites = new dojox.collections.Dictionary();
    // Get all keys in Gears database and iterate over them, retrieving each
    // favorite and adding it to the collection.
    var favKeys = dojox.storage.getKeys("DojoLocalBusinessSearch");
    dojo.forEach(favKeys, function(inVal) {
      var favorite = dojox.storage.get(inVal, "DojoLocalBusinessSearch");
      app.favorites.add(favorite.id, favorite);
    });

  } // End readFavorites().


  /**
   * Shows the current list of favorites.
   */
  this.showFavorites = function() {

    var htmlOut = "<br>";
    var it = app.favorites.getIterator();
    while (!it.atEnd()) {
      var fav = it.get().value;
      htmlOut = htmlOut + "<div onClick=\"app.favoriteClicked('" + fav.id +
        "');\" style=\"width:100%;margin-bottom:10px;cursor:pointer;\" " +
        "onmouseover=\"dojo.style(this, 'backgroundColor', '#ffff00');\" " +
        "onmouseout=\"dojo.style(this, 'backgroundColor', '');\" " +
        "id=\"fav_" + fav.id + "\">" +
        "<img src=\"img/favorite.gif\" hspace=\"4\" align=\"absmiddle\">" +
        fav.title + "</div>";
    }
    dijit.byId("cpFavorites").setContent(htmlOut);

  } // End showFavorites().


  /**
   * Called when a favorite is clicked.
   *
   * @param inID The ID of the clicked item.
   */
  this.favoriteClicked = function(inID) {

    dijit.byId("detailsTabs").selectChild(dijit.byId("tabDetails"));
    app.currentItem = app.favorites.entry(inID).value;
    app.currentIsFavorite = true;
    app.showItemDetails();

  } // End favoriteClicked().


  /**
   * Saves the current item in Gears database as a favorite.
   */
  this.addToFavorites = function() {

    if (dojo.exists("currentItem", app)) {
      dojox.storage.put(app.currentItem.id,
        app.currentItem, function(status, keyName) {
          if (status == dojox.storage.FAILED) {
            app.showDialog(app.DLG_INFO,
              "A failure occurred saving favorite to persistent storage");
          } else if (status == dojox.storage.SUCCESS) {
            app.favorites.add(app.currentItem.id, app.currentItem);
            app.showFavorites();
            dojox.fx.highlight(
              { node : "fav_" + app.currentItem.id, color : "#ffff00" }
            ).play();
          }
        }, "DojoLocalBusinessSearch"
      );
    } else {
      app.showDialog(app.DLG_INFO,
        "You must perform a search and select an item before " +
        "you can add a favorite");
    }

  } // End addToFavorites().


  /**
   * Delete the current favorite from Gears database.
   *
   * @param inDoDeleteNow This will be true when this method is called from
   *                      confirmCallback, in which case the deletion should
   *                      now occur.
   */
  this.deleteFavorite = function(inDoDeleteNow) {

    if (dojo.exists("currentIsFavorite", app)) {
      if (inDoDeleteNow) {
        dojox.storage.remove(app.currentItem.id, "DojoLocalBusinessSearch");
        app.favorites.remove(app.currentItem.id);
        app.showFavorites();
        app.currentItem = null;
        app.currentIsFavorite = false;
        app.clearDetailsTabs();
      } else {
        app.showDialog(app.DLG_CONFIRM,
          "Are you sure you want to delete the favorite '" +
          app.currentItem.title + "'?");
      }
    } else {
      app.showDialog(app.DLG_INFO,
        "Please select a favorite first to delete it");
    }

  } // End deleteFavorite().


  /**
   * Deletes all favorites from Gears database.
   *
   * @param inDoDeleteNow This will be true when this method is called from
   *                      confirmCallback, in which case the deletion should
   *                      now occur.
   */
  this.clearFavorites = function(inDoDeleteNow) {

    if (app.favorites.count == 0) {
      app.showDialog(app.DLG_INFO, "You currently have no favorites saved");
    } else {
      if (inDoDeleteNow) {
        dojox.storage.clear("DojoLocalBusinessSearch");
        app.favorites.clear();
        app.showFavorites();
        app.currentItem = null;
        app.currentIsFavorite = false;
        app.clearDetailsTabs();
      } else {
        app.showDialog(app.DLG_CONFIRM,
          "Are you sure you want to delete all favorites?");
      }
    }

  } // End clearFavorites().


} // End App class.
