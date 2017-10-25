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
 * JSON (config object) that describes the main Viewport.
 */
LocalBusinessSearch.UIObjects.Viewport = function() { return ({
  layout : "border", items : [
    { region : "north", height : 110, items : [
      new Ext.Panel(LocalBusinessSearch.UIObjects.HeaderPanel())
    ] },
    { region : "west", width : 440, items : [
      new Ext.TabPanel(LocalBusinessSearch.UIObjects.SearchTabPanel()),
      new Ext.Panel(LocalBusinessSearch.UIObjects.FavoritesPanel())
    ] },
    { region : "center", layout : "fit", items : [
      new Ext.Panel(LocalBusinessSearch.UIObjects.DetailsPanel())
    ] }
  ],
  listeners : {
    resize : function(inViewport, inAdjWidth, inAdjHeight, inWidth, inHeight) {
      // Resize the favorites div.
      var df = Ext.getDom("divFavorites");
      // This gets called during initialization, BEFORE the div is added to the
      // DOM, so check for its existence before working with it to avoid errors.
      if (df) {
        df.style.height = (Ext.getBody().getHeight() - 110 - 300 - 58) + "px";
      }
    }
  }
}); };
