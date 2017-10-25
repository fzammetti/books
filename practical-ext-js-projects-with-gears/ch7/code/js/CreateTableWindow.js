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
 * Shows the Create Table Window.
 */
SQLWorkbench.createTable = function(inDatabaseName) {

  // Create the Window.
  var createTableWindow = new Ext.Window({
    animateTarget : "divSource", id : "createTableWindow", autoScroll : true,
    draggable : true, resizable : true, shadowOffset : 8, width : 700,
    height : 500, layout : "fit", constrain : true, title : "Create Table",
    maximizable : true,
    items : [
      { xtype : "form", labelWidth : 100, id : "createTableForm",
        bodyStyle : "padding:4px;overflow:scroll;",
        items : [
          { xtype : "textfield", width : 250, fieldLabel : "New table name",
            name : "createTableName" },
          { xtype : "panel", layout : "table", layoutConfig : { columns : 5 },
            id : "createTablePanel", border : false,
            items : [
              /* Column headers. */
              { html :
                "<div style='background-color:#dfe8f6;'>Name</div>",
                cellCls : "cssTableHeader" },
              { html :
                "<div style='background-color:#dfe8f6;'>Type</div>",
                cellCls : "cssTableHeader" },
              { html :
                "<div style='background-color:#dfe8f6;'>P. Key?</dv>",
                cellCls : "cssTableHeader cssTableCentered" },
              { html :
                "<div style='background-color:#dfe8f6;'>Not Null?</div>",
                cellCls : "cssTableHeader cssTableCentered" },
              { html :
                "<div style='background-color:#dfe8f6;'>Default</div>",
                cellCls : "cssTableHeader" }
            ]
          }
        ],
        /* Buttons. */
        bbar : [
          { text : "Ok", formBind : true,
            icon : "img/Ok.gif", cls : "x-btn-text-icon",
            handler : function() {
              SQLWorkbench.createTableExecute(inDatabaseName);
            }
          },
          "-",
          { text : "Cancel", icon : "img/Cancel.gif", cls : "x-btn-text-icon",
            handler : function() { Ext.getCmp("createTableWindow").close(); }
          }
        ]
      }
    ]
  });

  // Add 20 rows for creating columns.
  var createTablePanel = Ext.getCmp("createTablePanel");
  for (var i = 0; i < 20; i++) {
    createTablePanel.add({ xtype : "textfield", hideLabel : true,
      width : 150, ctCls:"cssTableCell",
      name : "createTable_columnName_" + i });
    createTablePanel.add({ xtype : "combo", width : 100, editable : false,
      triggerAction : "all", mode : "local", valueField : "optVal",
      displayField : "optVal", store : SQLWorkbench.Data.columnTypeStore,
      ctCls : "cssTableCell", name : "createTable_columnType_" + i });
    createTablePanel.add({ xtype : "checkbox", hideLabel : true,
      ctCls : "cssTableCell cssTableCentered",
      name : "createTable_primaryKey_" + i });
    createTablePanel.add({ xtype : "checkbox", hideLabel : true,
      ctCls : "cssTableCell cssTableCentered",
      name : "createTable_notNull_" + i });
    createTablePanel.add({ xtype : "textfield", hideLabel : true,
      width : 150, ctCls : "cssTableCell",
      name : "createTable_defaultValue_" + i });
  }

  // All ready, show the Window.
  createTableWindow.show();

}; // End SQLWorkbench.createTable().


/**
 * Create a table.
 */
SQLWorkbench.createTableExecute = function(inDatabaseName) {

  // Get the values from the form.
  var formVals =
    Ext.getCmp("createTableForm").getForm().getValues();

  // Make sure they entered something.
  if (Ext.isEmpty(formVals.createTableName)) { return; }

  // Starting creating the SQL table creation statement.
  var sql = "CREATE TABLE IF NOT EXISTS " +
    formVals.createTableName + " (";

  // Iterate over all possible form fields and get their values.
  var columnCount = 0;
  var primaryKeyCount = 0;
  var primaryKeyNotNullFound = false;
  for (var i = 0; i < 20; i++) {
    var columnName = formVals["createTable_columnName_" + i];
    var columnType = formVals["createTable_columnType_" + i];
    var primaryKey = formVals["createTable_primaryKey_" + i];
    var notNull = formVals["createTable_notNull_" + i];
    var defaultValue = formVals["createTable_defaultValue_" + i];
    if (!Ext.isEmpty(columnName) && !Ext.isEmpty(columnType)) {
      // Have to handle one type of error here.
      if (!Ext.isEmpty(primaryKey) && !Ext.isEmpty(notNull)) {
        primaryKeyNotNullFound = true;
        break;
      }
      // Add a comma if this isn't the first field.
      if (columnCount > 0) { sql += ", "; }
      columnCount++;
      // Now create the column specification.
      sql += "\"" + columnName + "\" " + columnType;
      if (!Ext.isEmpty(primaryKey)) {
        primaryKeyCount++;
        sql += " PRIMARY KEY";
      }
      if (!Ext.isEmpty(notNull)) {
        sql += " NOT NULL";
      }
      if (!Ext.isEmpty(defaultValue)) {
        sql += " DEFAULT '" + defaultValue + "'";
      }
    }
  }
  sql += ");";

  // Handle some error conditions.
  if (primaryKeyNotNullFound) {
    Ext.MessageBox.alert("Error",
      "Primary fields cannot be null.");
    return;
  }
  if (columnCount == 0) {
    Ext.MessageBox.alert("Error",
      "There were no columns to create.  Note that Column Name " +
      "and Column Type are both required for every column.");
    return;
  }
  if (primaryKeyCount > 1) {
    Ext.MessageBox.alert("Error",
      "Only a single column can be designated as Primary Key.");
    return;
  }

  // Confirm they want to do this and do it if so.
  Ext.MessageBox.confirm("Confirm SQL Execution",
    "Are you sure you want to execute the following " +
    "SQL statement?<br><br>" + sql,
    function(inButtonClicked) {
      if (inButtonClicked == "yes") {
        // Execute the statement to create the table.
        var db = google.gears.factory.create("beta.database");
        db.open(inDatabaseName);
        try {
          db.execute(sql);
          db.close();
          SQLWorkbench.listTables(inDatabaseName);
          Ext.getCmp("createTableWindow").close();
          Ext.MessageBox.hide();
        } catch (e) {
          db.close();
          Ext.MessageBox.alert("SQL Execution Error", e);
        }
      }
    }
  );

}; // End SQLWorkbench.createTableExecute().
