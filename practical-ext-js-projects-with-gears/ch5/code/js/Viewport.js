/*
    Code Cabinet Ext - From the book "Practical Ext JS Projects With Gears"
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
CodeCabinetExt.UIObjects.Viewport = function() { return ({
  layout : "border", items : [
    { region : "north", height : 28, items : [ Ext.getCmp("Toolbar") ] },
    { region : "west", layout : "fit", border : false, width : 300,
      split : true, title : "Categories", collapsible : true,
      items : [ Ext.getCmp("Tree") ] },
    { region : "center", layout : "border", items : [
      { region : "north", layout : "fit", border : false, height : 300,
        split : true, title : "Details", collapsible : true,
        items : [ Ext.getCmp("Details") ] },
      { region : "west", width : 300, split : true,
        title : "Search For Snippets", collapsible : true,
        items : [ Ext.getCmp("SearchForm") ]
      },
      { region : "center", layout : "fit",
        title : "Search Results", items : [ Ext.getCmp("SearchResults") ] }
    ]}
  ]
}); };
