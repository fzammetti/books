/*
    SQL Workbench - From the book "Practical Ext JS Projects With Gears"
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
 * Shows the Tables Window for the specified database.
 */
SQLWorkbench.listTables = function(inDatabaseName) {

  // Close the Window if its already open so that refreshes occur properly.
  var tablesWindow = Ext.getCmp("tablesWindow~" + inDatabaseName);
  if (tablesWindow) {
    tablesWindow.close();
  }

  // Find all tables for the selected database.
  var db = google.gears.factory.create("beta.database");
  db.open(inDatabaseName);

  // Get list of tables for database.
  var rs = db.execute (
    "SELECT name, sql FROM sqlite_master where type='table';"
  );

  // Now get the Store that is stored on the DatabaseRecord that contains the
  // list of TableRecords for this database and clear it, or if none is present
  // create a new Store.
  var databaseRecord = SQLWorkbench.Data.databasesStore.getById(inDatabaseName);
  var foundTables = databaseRecord.get("tables");
  if (!foundTables) {
    foundTables = new Ext.util.MixedCollection();
  }
  foundTables.clear();

  // Now iterate over the list of tables and add it to the Store.
  while (rs.isValidRow()) {
    foundTables.add(rs.field(0), new SQLWorkbench.Data.TableRecord({
      databaseName : inDatabaseName, name : rs.field(0), sql : rs.field(1)
    }));
    rs.next();
  }
  rs.close();
  db.close();

  // Add tables to the DatabaseRecord.
  databaseRecord.set("tables", foundTables);

  // Create a Store from the MixedCollection of tables for our Grid.
  var dbTablesStore = new Ext.data.Store({});
  dbTablesStore.suspendEvents();
  foundTables.each(function(inItem, inIndex, inLength) {
    dbTablesStore.add(inItem, inItem.id)
  });
  dbTablesStore.resumeEvents();

  // Create (or simply show) the Tables Window for this database.
  new Ext.Window({
    title : inDatabaseName + " : Table List", width : 300, height : 200,
    constrain : true, animateTarget : "divSource", maximizable : false,
    layout : "fit", id : "tablesWindow~" + inDatabaseName,
    bbar : [
      { text : "Create New",
        icon : "img/CreateNew.gif", cls : "x-btn-text-icon",
        handler : function() {
          SQLWorkbench.createTable(inDatabaseName);
        }
      }
    ],
    items : [
      { xtype : "grid", border : false, stripeRows : true,
        store : dbTablesStore, hideHeaders : true,
        autoExpandColumn : "colName",
        sm : new Ext.grid.RowSelectionModel( { singleSelect : true } ),
        columns : [
          { header : "Name", sortable : true, dataIndex : "name",
            id : "colName" }
        ],
        listeners: {
          rowclick : {
            fn : function(inGrid, inRowIndex, inEventObject) {
              SQLWorkbench.listTableDetails(inDatabaseName,
                inGrid.getSelectionModel().getSelected().get("name"));
                // Clear selection.
                inGrid.getSelectionModel().clearSelections();
            }
          }
        }
      }
    ]
  }).show();

}; // End SQLWorkbench.listTables().
