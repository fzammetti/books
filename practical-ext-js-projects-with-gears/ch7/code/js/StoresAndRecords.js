/*
    SQLWorkbench - From the book "Practical Ext JS Projects With Gears"
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


//
// Record descriptors and data stores.
//


/**
 * Database record descriptor.
 */
SQLWorkbench.Data.DatabaseRecord = Ext.data.Record.create([
  { name : "name", mapping : "name" },
  { name : "tables", mapping : "tables" }
]);


/**
 * Table record descriptor.
 */
SQLWorkbench.Data.TableRecord = Ext.data.Record.create([
  { name : "databaseName", mapping : "databaseName" },
  { name : "name", mapping : "name" },
  { name : "sql", mapping : "sql" },
  { name : "tableDetails" }
]);


/**
 * This is a DataStore for populating the list of databases.
 */
SQLWorkbench.Data.databasesStore = new Ext.data.Store({});


/**
 * This is a simple store for populating the Column Type ComboBox on the
 * Create Table Window.
 */
SQLWorkbench.Data.columnTypeStore = new Ext.data.Store({});
var columnTypeVals = [ "INTEGER", "DOUBLE", "FLOAT", "REAL", "CHAR", "TEXT",
  "VARCHAR", "BLOB", "NUMERIC", "DATETIME" ];
  for (var i = 0; i < columnTypeVals.length; i++) {
  SQLWorkbench.Data.columnTypeStore.add
    (new Ext.data.Record( { optVal : columnTypeVals[i] } )
  );
}
