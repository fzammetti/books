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
 * The name of the database that was last selected (last selected before the
 * last remove operation at least).
 */
SQLWorkbench.lastSelectedDatabase = null;


/**
 * Shows the Databases Window.
 */
SQLWorkbench.listDatabases = function() {

  // Close the Window if its already open so that refreshes occur properly.
  var databasesWindow = Ext.getCmp("databasesWindow");
  if (databasesWindow) {
    databasesWindow.close();
  }

  // Read in databases from cookies and add to databasesStore.
  SQLWorkbench.Data.databasesStore.removeAll();
  var i = 0;
  var nextCookie =
    SQLWorkbench.cookieProvider.get("SQLWorkbench_db_" + i);
  while (!Ext.isEmpty(nextCookie)) {
    SQLWorkbench.Data.databasesStore.add(
      new SQLWorkbench.Data.DatabaseRecord(
        { name : nextCookie, tables : null }, nextCookie
      )
    );
    i = i + 1;
    nextCookie =
      SQLWorkbench.cookieProvider.get("SQLWorkbench_db_" + i);
  }

  // Create (or simply show) the Databases Window.
  new Ext.Window({
    title : "Databases", width : 300, height : 200, constrain : true,
    animateTarget : "divSource", id : "databasesWindow", maximizable : false,
    layout : "fit", x : 5, y : 40,
    bbar : [
      { text : "Add Database",
        icon : "img/AddDatabase.gif", cls : "x-btn-text-icon",
        handler : function() {
          SQLWorkbench.addDatabase();
        }
      },
      "-",
      { text : "Remove Database",
        icon : "img/RemoveDatabase.gif", cls : "x-btn-text-icon",
        handler : function() {
          SQLWorkbench.removeDatabase();
        }
      }
    ],
    items : [
      { xtype : "grid", border : false, stripeRows : true,
        store : SQLWorkbench.Data.databasesStore, hideHeaders : true,
        autoExpandColumn : "colName",
        sm : new Ext.grid.RowSelectionModel( { singleSelect : true } ),
        columns : [
          { header : "Name", sortable : true, dataIndex : "name",
            id : "colName" }
        ],
        listeners: {
          rowclick : {
            fn : function(inGrid, inRowIndex, inEventObject) {
              var databaseName =
                inGrid.getSelectionModel().getSelected().get("name");
              SQLWorkbench.lastSelectedDatabase = databaseName;
              SQLWorkbench.listTables(databaseName);
              // Clear selection.
              inGrid.getSelectionModel().clearSelections();
            }
          }
        }
      }
    ]
  }).show();

}; // End SQLWorkbench.listDatabases().


/**
 * Adds a database to the list of available databases, eitehr an existing one
 * or creates a new one.
 */
SQLWorkbench.addDatabase = function() {

  Ext.MessageBox.prompt("Add Database",
    "Please enter the name of the database you wish to add.<br><br>Note that " +
    "if the database does not currently exist it will be created.<br>",
    function(inBtnID, inVal) {
      if (inBtnID == "cancel") { return; }
      if (inVal != null) { inVal = inVal.trim(); }
      if (!Ext.isEmpty(inVal)) {
        // Let Gears create it.
        var db = google.gears.factory.create("beta.database");
        db.open(inVal);
        db.close();
        // Add the database to the databaseStore.
        SQLWorkbench.Data.databasesStore.add(
          new SQLWorkbench.Data.DatabaseRecord({
            name : inVal
          }, inVal)
        );
        // Update the cookies storing the list of databases.
        SQLWorkbench.updateDatabaseCookies();
        // Refresh the Databases Window and hide the MessageBox and we're done.
        SQLWorkbench.listDatabases();
        Ext.MessageBox.hide();
      }
    }
  );

}; // End SQLWorkbench.addDatabase().


/**
 * Removes the database that was last selected from the list (since the last
 * database was removed at least).
 */
SQLWorkbench.removeDatabase = function() {

  if (Ext.isEmpty(SQLWorkbench.lastSelectedDatabase)) { return; }
  Ext.MessageBox.confirm("Confirm Database Removal",
    "This will remove the " + SQLWorkbench.lastSelectedDatabase + " database " +
    "from the list of available database AND WILL ALSO physically remove the " +
    "database from the SQLite directory structure.  ALL DATA IN THE DATABASE " +
    "WILL BE LOST!  Are you absolutely sure about this?",
    function(inButtonClicked) {
      if (inButtonClicked == "yes") {
        // Open the database and then remove it.
        var db = google.gears.factory.create("beta.database");
        db.open(SQLWorkbench.lastSelectedDatabase);
        db.remove();
        // Close the tables Window for this database, as well as all table
        // detail Windows that might be open.
        var tablesWindow =
          Ext.getCmp("tablesWindow~" + SQLWorkbench.lastSelectedDatabase);
        if (tablesWindow) { tablesWindow.close(); }
        var databaseRecord = SQLWorkbench.Data.databasesStore.getById(
          SQLWorkbench.lastSelectedDatabase);
        var tables = databaseRecord.get("tables");
        tables.each(function(nextRecord) {
          var tableDetailsWindow = Ext.getCmp("tableWindow_" +
            nextRecord.get("name")).close();
          if (tableDetailsWindow) { tablesDetailWindow.close(); }
        });
        // Now delete the DatabaseRecord from the databasesStore.
        SQLWorkbench.Data.databasesStore.remove(
          SQLWorkbench.Data.databasesStore.getById(
            SQLWorkbench.lastSelectedDatabase));
        // Update cookies to effectively remove the database from them.
        SQLWorkbench.updateDatabaseCookies();
        // Clear the field storing this as the last selected database for
        // purposes of removing databases.
        SQLWorkbench.lastSelectedDatabase = null;
        // Refresh the Databases Window and hide the MessageBox and we're done.
        SQLWorkbench.listDatabases();
        Ext.MessageBox.hide();
      }
    }
  );

} // End SQLWorkbench.removeDatabase().


/**
 * Writes out cookies, one for each database currently available in the
 * databasesStore.
 */
SQLWorkbench.updateDatabaseCookies = function() {

  // Iterate over cookies and delete them all.
  var i = 0;
  var nextCookie =
    SQLWorkbench.cookieProvider.get("SQLWorkbench_db_" + i);
  while (!Ext.isEmpty(nextCookie)) {
    SQLWorkbench.cookieProvider.set("SQLWorkbench_db_" + i, null);
    i = i + 1;
    nextCookie =
      SQLWorkbench.cookieProvider.get("SQLWorkbench_db_" + i);
  }
  // Now iterate over DatabaseRecords in this store and write a cookie
  // for each.
  i = 0;
  SQLWorkbench.Data.databasesStore.each(function(nextRecord) {
    SQLWorkbench.cookieProvider.set("SQLWorkbench_db_" + i,
      nextRecord.get("name"));
    i = i + 1;
  });

} // End SQLWorkbench.updateDatabaseCookies().
