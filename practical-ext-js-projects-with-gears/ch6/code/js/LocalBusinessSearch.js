/*
    Local Business Search - From the book "Practical Ext JS Projects With Gears"
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


// Create namespaces that will be used throughout this application.
Ext.namespace("LocalBusinessSearch", "LocalBusinessSearch.UIObjects",
  "LocalBusinessSearch.UIEventHandlers", "LocalBusinessSearch.Data");


/**
 * AppID to use for Yahoo! Web Services.
 */
LocalBusinessSearch.appID = "xxxx";


/**
 * The URL of the Yahoo! web service.
 * http://local.yahooapis.com/LocalSearchService/V3/localSearch
 */
LocalBusinessSearch.searchWebServiceURL =
  "http://local.yahooapis.com/LocalSearchService/V3/localSearch";


/**
 * The URL of the Yahoo! map retrieval web service.
 */
LocalBusinessSearch.mapWebServiceURL =
  "http://local.yahooapis.com/MapsService/V1/mapImage";


/**
 * Reference to the currently selected BusinessRecord.
 */
LocalBusinessSearch.currentBusiness = null;


/**
 * Flag: is the current business a favorite?
 */
LocalBusinessSearch.currentIsFavorite = false;


/**
 * Current map zoom level.
 */
LocalBusinessSearch.zoomLevel = null;


/**
 * Field where the current search criteria are stored (needed for paging).
 */
LocalBusinessSearch.searchParams = null;


/**
 * Fields used to store MessageBox title and message for errors and other
 * conditions during a search.
 */
LocalBusinessSearch.resultsTitle = null;
LocalBusinessSearch.resultsMessage = null;


/**
 * Flag set to true when events should not be executed on the FavoriteStore.
 */
LocalBusinessSearch.skipFavoritesStoreEvents = false;


/**
 * Cookie provider that sets expiration on cookies to one year (for default
 * location saving, but covers widget state information as well).
 */
LocalBusinessSearch.cookieProvider = new Ext.state.CookieProvider({
  expires : new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 365))
});


/**
 * Called via Ext.onReady() to initialize the application.
 */
LocalBusinessSearch.init = function() {

  // Initialize data access.
  var daoInitResult = LocalBusinessSearch.Data.DAO.init();
  switch (daoInitResult) {
    // Data access initialization successful, build UI and start application.
    case "ok":
      // Add custom vtypes.
      Ext.form.VTypes["zipcode"] = /^\d{5}$/;
      Ext.form.VTypes["zipcodeMask"] = /[\d-]/;
      Ext.form.VTypes["zipcodeText"] = "Zip Code must be in the format of #####";
      // Initialize QuickTips for form validation messages.
      Ext.QuickTips.init();
      Ext.form.Field.prototype.msgTarget = "side";
      // Set cookie provider for state and default location saving.
      Ext.state.Manager.setProvider(LocalBusinessSearch.cookieProvider);
      // Build the user interface.
      LocalBusinessSearch.buildUI();
      // Set default search values stored in cookies, if any.
      LocalBusinessSearch.loadDefaults();
      // Size the favorites div for the current browser window size.
      Ext.getDom("divFavorites").style.height = (Ext.getBody().getHeight() -
        110 - 300 - 58) + "px";
    break;
    // Gears wasn't available.
    case "no_gears":
      Ext.MessageBox.show({
        title : "Gears Not Available", buttons : Ext.MessageBox.OK,
        msg : "<br>" +
          "I'm sorry but Google Gears is not installed on your computer, " +
          "or is unavailable for some reason (like you disabled the " +
          "browser plugin for example)." +
          "<br><br>" +
          "If you do not have Gears installed, please visit " +
          "<a href=\"http://gears.google.com/\" target=\"new\">" +
          "the Gears home page</a> to install it." +
          "<br><br>" +
          "If you do have it installed, please try enabling the plugin in " +
          "whatever fashion is applicable in the browser you are using, " +
          "and reload this application.", animEl : "divSource"
      });
    break;
    // Any other unexpected failures.
    default:
      Ext.MessageBox.alert("DAO Initialization Failed",
        "Data access could not be initialized.  Reason: " + daoInitResult);
    break;
  }

}; // End LocalBusinessSearch.init();


/**
 * Called from LocalBusinessSearch.init() to build the UI.  Note that the order
 * in which objects are constructed within this method is important.  For
 * example, the Viewport depends on the Toolbar having been constructed
 * already, etc.
 */
LocalBusinessSearch.buildUI = function() {

  // Create the Viewport.
  new Ext.Viewport(LocalBusinessSearch.UIObjects.Viewport());

  // Now that the action icons have been created in the header, go ahead and
  // attach ToolTips to them.
  LocalBusinessSearch.attachIconTooltips();

  // Now load and show the save favorites.
  LocalBusinessSearch.skipFavoritesStoreEvents = true;
  LocalBusinessSearch.Data.FavoritesStore.add(
  LocalBusinessSearch.Data.DAO.retrieveFavorites());
  LocalBusinessSearch.skipFavoritesStoreEvents = false;
  LocalBusinessSearch.showFavorites();

}; // End LocalBusinessSearch.buildUI().


/**
 * Called to load default search values stored in cookies into the form fields.
 */
LocalBusinessSearch.loadDefaults = function() {

  Ext.getCmp("searchStreet").setValue(
    LocalBusinessSearch.cookieProvider.get("defaultLocation_street"));
  Ext.getCmp("searchCity").setValue(
    LocalBusinessSearch.cookieProvider.get("defaultLocation_city"));
  Ext.getCmp("searchState").setValue(
    LocalBusinessSearch.cookieProvider.get("defaultLocation_state"));
  Ext.getCmp("searchZip").setValue(
    LocalBusinessSearch.cookieProvider.get("defaultLocation_zip"));

}; // End loadDefaults();
