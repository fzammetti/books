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
 * JSON (config object) that describes the search results section.
 */
CodeCabinetExt.UIObjects.SearchResults = function() { return ({
  id : "SearchResults", layout : "card", activeItem : 0,
  deferredRender : false, items : [
    { border : false, bodyStyle : "text-align:center;padding-top:50px;",
      html : "Search results will appear here<br>" +
      "(select a category to do a search)" },
    { border : false, bodyStyle : "text-align:center;padding-top:50px;",
      html : "No snippets were found matching your search criteria" },
    { border : false, store : CodeCabinetExt.Data.SearchResultsStore,
      xtype : "grid", autoExpandColumn : "colDescription",
      stripeRows : true,
      sm : new Ext.grid.RowSelectionModel( { singleSelect : true } ),
      columns : [
        { header : "Snippet Name", sortable : true, width : 200,
          dataIndex : "name" },
        { header : "Description", sortable : true,
          id : "colDescription", dataIndex : "description" }
      ],
      listeners: {
        rowclick : {
          fn : function(inGrid, inRowIndex, inEventObject) {
            CodeCabinetExt.UIEventHandlers.RowClick(
              inGrid.getSelectionModel().getSelected(), true
            );
          }
        }
      }
    }
  ]
}); };
