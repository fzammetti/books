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


/**
 * JSON (config object) that describes the header Panel.
 */
LocalBusinessSearch.UIObjects.HeaderPanel = function() { return ({
  layout : "table", border : false, layoutConfig : { columns : 2 }, items : [
    { border : false, bodyStyle : "padding-left:100px",
      html :
        LocalBusinessSearch.generateActionImgTag("NewSearch") +
        LocalBusinessSearch.generateActionImgTag("PrintItem") +
        LocalBusinessSearch.generateActionImgTag("AddToFavorites") +
        LocalBusinessSearch.generateActionImgTag("DeleteFavorite") +
        LocalBusinessSearch.generateActionImgTag("ClearFavorites")
    },
    { border : false, bodyStyle : "text-align:right",
      html : "<img src=\"img/LocalBusinessSearch.gif\">" }
  ]
}); };


/**
 * Generates an <img> tag for one of the action items in the heaser.
 */
LocalBusinessSearch.generateActionImgTag = function(inIconID) {

  return String.format(
    "<img id=\"{0}\" src=\"img/{0}.gif\" hspace=\"20\" " +
    "onMouseOver=\"Ext.get('{0}').scale(120, 100, { duration : .25 });\" " +
    "onMouseOut=\"Ext.get('{0}').scale(64, 64, { duration : .25 });\" " +
    "onClick=\"LocalBusinessSearch.UIEventHandlers.{0}Click()\">",
    inIconID);

}; // End LocalBusinessSearch.generateActionImgTag().


/**
 * Called to attach ToolTips to each of the header icons.
 */
LocalBusinessSearch.attachIconTooltips = function() {

  new Ext.ToolTip({
    target:"NewSearch", showDelay : 0, hideDelay : 0,
    html : "Start a new search"
  });
  new Ext.ToolTip({
    target:"PrintItem", showDelay : 0, hideDelay : 0,
    html : "Print the details of the business now being viewed"
  });
  new Ext.ToolTip({
    target:"AddToFavorites", showDelay : 0, hideDelay : 0,
    html : "Add the business now being viewed to your favorites"
  });
  new Ext.ToolTip({
    target:"DeleteFavorite", showDelay : 0, hideDelay : 0,
    html : "Remove the currently selected favorite from your favorites"
  });
  new Ext.ToolTip({
    target:"ClearFavorites", showDelay : 0, hideDelay : 0,
    html : "Clear your list of favorites"
  });

}; // End attachIconTooltips().


/**
 * Event handler called when the New Search icon is clicked.
 */
LocalBusinessSearch.UIEventHandlers.NewSearchClick = function() {

  // Clear the form, load stored default values, clear search results and flip
  // back to search form.
  Ext.getCmp("SearchForm").getForm().reset();
  LocalBusinessSearch.loadDefaults();
  LocalBusinessSearch.Data.ResultsStore.removeAll();
  Ext.getCmp("tabResults").disable();
  Ext.getCmp("SearchTabs").setActiveTab("tabSearch");
  Ext.getCmp("DetailsPane").collapse();
  Ext.getCmp("MapPane").collapse();

}; // End LocalBusinessSearch.UIEventHandlers.NewSearchClick().


/**
 * Event handler called when the Print Item icon is clicked.
 */
LocalBusinessSearch.UIEventHandlers.PrintItemClick = function() {

  if (LocalBusinessSearch.currentBusiness) {

    // Insert data into print dialog fields.
    Ext.getDom("print_title").innerHTML =
      LocalBusinessSearch.currentBusiness.get("title");
    Ext.getDom("print_longitude").innerHTML =
      LocalBusinessSearch.currentBusiness.get("longitude");
    Ext.getDom("print_latitude").innerHTML =
      LocalBusinessSearch.currentBusiness.get("latitude");
    Ext.getDom("print_distance").innerHTML =
      LocalBusinessSearch.currentBusiness.get("distance");
    Ext.getDom("print_phone").innerHTML =
      LocalBusinessSearch.currentBusiness.get("phone");
    Ext.getDom("print_rating").innerHTML =
      LocalBusinessSearch.currentBusiness.get("rating");
    Ext.getDom("print_address").innerHTML =
      LocalBusinessSearch.currentBusiness.get("address");
    Ext.getDom("print_city").innerHTML =
      LocalBusinessSearch.currentBusiness.get("city");
    Ext.getDom("print_state").innerHTML =
      LocalBusinessSearch.currentBusiness.get("state");
    Ext.getDom("print_businessurl").innerHTML =
      LocalBusinessSearch.currentBusiness.get("businessurl");
    Ext.getDom("print_map").src = Ext.getDom("imgMap").src;

    // Show the print dialog and maximize it.
    var dialogPrint = new Ext.Window({
      applyTo : "dialogPrint", closable : true, modal : true,
      minimizable : false, constrain : true,
      resizable : false, draggable : false, shadow : false,
      autoScroll : true
    });
    dialogPrint.show();
    dialogPrint.maximize();

    // Give the "all set" to the user.
    Ext.MessageBox.show({
      title : "Ready To Print", buttons : Ext.MessageBox.OK,
      msg : "You can now print, and remember to close this maximized dialog " +
        "when you are done to return to the application",
      animEl : "divSource"
    });

  }

}; // End LocalBusinessSearch.UIEventHandlers.PrintItemClick().


/**
 * Event handler called when the Add To Favorites icon is clicked.
 */
LocalBusinessSearch.UIEventHandlers.AddToFavoritesClick = function() {

  // Make sure a business is selected and that it isn't a favorite.
  if (LocalBusinessSearch.currentBusiness &&
    !LocalBusinessSearch.currentIsFavorite) {

    // Add favorite to FavoritesStore, triggering database save.
    LocalBusinessSearch.Data.FavoritesStore.add(
      LocalBusinessSearch.currentBusiness);

    // Since this business is still current, mark it as being a favorite.
    LocalBusinessSearch.currentIsFavorite = true;

    // Update the list of favorites.
    LocalBusinessSearch.showFavorites();

    // Now highlight the newly added favorite.
    Ext.get("fav_" + LocalBusinessSearch.currentBusiness.id).highlight(
      "#ffff00", { attr : "background-color", endColor : "ffffff",
      duration : 1}
    );

    // Also clear the selection in the results grid so its now a favorite.
    var tr = Ext.getCmp("tabResults");
    var sm = tr.getSelectionModel();
    if (sm.getCount() != 0) {
      sm.clearSelections();
    }

  }

}; // End LocalBusinessSearch.UIEventHandlers.AddToFavoritesClick().


/**
 * Event handler called when the Delete Favorite icon is clicked.
 */
LocalBusinessSearch.UIEventHandlers.DeleteFavoriteClick = function() {

  if (LocalBusinessSearch.currentIsFavorite) {

    // Confirm deletion.
    Ext.MessageBox.confirm("Confirm Favorite Deletion",
      "Are you sure you want to delete the favorite '" +
      LocalBusinessSearch.currentBusiness.get("title") + "'?",
      function(inButtonClicked) {
        if (inButtonClicked == "yes") {
          // Ok, remove it from the Store and clear some other stuff out too.
          LocalBusinessSearch.Data.FavoritesStore.remove(
            LocalBusinessSearch.currentBusiness);
          LocalBusinessSearch.currentBusiness = null;
          LocalBusinessSearch.currentIsFavorite = false;
          LocalBusinessSearch.showFavorites();
          LocalBusinessSearch.populateDetails();
          Ext.getCmp("DetailsPane").collapse();
          Ext.getCmp("MapPane").collapse();
          LocalBusinessSearch.getMap();
        }
      }
    );

  }

}; // End LocalBusinessSearch.UIEventHandlers.DeleteFavoriteClick().


/**
 * Event handler called when the Clear Favorites icon is clicked.
 */
LocalBusinessSearch.UIEventHandlers.ClearFavoritesClick = function() {

  Ext.MessageBox.confirm("Confirm All Favorites Deletion",
    "Are you sure you want to delete all your favorites?",
    function(inButtonClicked) {
      if (inButtonClicked == "yes") {
        LocalBusinessSearch.Data.FavoritesStore.removeAll();
        if (LocalBusinessSearch.currentIsFavorite) {
          LocalBusinessSearch.currentBusiness = null;
          LocalBusinessSearch.currentIsFavorite = false;
          Ext.getCmp("DetailsPane").collapse();
          Ext.getCmp("MapPane").collapse();
          LocalBusinessSearch.populateDetails();
          LocalBusinessSearch.getMap();
        }
        LocalBusinessSearch.showFavorites();
      }
    }
  );

}; // End LocalBusinessSearch.UIEventHandlers.ClearFavoritesClick().
