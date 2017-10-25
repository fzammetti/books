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
 * JSON (config object) that describes the favorites Panel.
 */
LocalBusinessSearch.UIObjects.FavoritesPanel = function() { return ({
  border : false, bodyStyle : "padding-top:8px;", items : [
    { border : false,
      html : "<center><img src=\"img/SavedFavorites.gif\"></center><br>" },
    { border: false, bodyStyle : "overflow:scroll",
      html : "<div id=\"divFavorites\"></div>" }
  ]
}); };


/**
 * Called to display the saved favorites.
 */
LocalBusinessSearch.showFavorites = function() {

  // Clear any current favorites to begin with.
  Ext.getDom("divFavorites").innerHTML = "";

  // Iterate over favorites so we can process each.
  LocalBusinessSearch.Data.FavoritesStore.each(function(inRecord) {
    // Construct the HTML to display the favorite and when done, insert
    // it into the DOM.
    Ext.DomHelper.append("divFavorites",
      { tag : "div", id : "fav_" + inRecord.id,
        style : "width:100%;margin-bottom:10px;cursor:pointer;",
        onclick : "LocalBusinessSearch.favoriteClicked(\"" +
          inRecord.id + "\");",
        onmouseover : "this.style.backgroundColor = \"#ffff00\";",
        onmouseout : "this.style.backgroundColor = \"\";",
        children : [
          { tag : "img", src : "img/favorite.gif", hspace : "4",
            align : "absmiddle" },
          { tag : "span", html : inRecord.get("title") }
        ]
      }
    );
  });

}; // End LocalBusinessSearch.showFavorites().


/**
 * Called when a favorite is clicked.
 *
 * @param inID The ID of the clicked item.
 */
LocalBusinessSearch.favoriteClicked = function(inID) {

  // Retrieve the BusinessRecord for the selected favorite and display
  // all details and the map.
  LocalBusinessSearch.currentBusiness =
    LocalBusinessSearch.Data.FavoritesStore.getById(inID);
  LocalBusinessSearch.currentIsFavorite = true;
  LocalBusinessSearch.populateDetails();
  Ext.getCmp("DetailsPane").expand();
  LocalBusinessSearch.getMap();

  // Also clear any selections that may be currently in the results grid.
  var tr = Ext.getCmp("tabResults");
  var sm = tr.getSelectionModel();
  if (sm.getCount() != 0) {
    sm.clearSelections();
  }

}; // End LocalBusinessSearch.favoriteClicked().
