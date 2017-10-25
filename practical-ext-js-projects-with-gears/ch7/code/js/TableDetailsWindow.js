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
 * Shows a Table Details Window for the specified table.
 */
SQLWorkbench.listTableDetails = function(inDatabaseName, inTableName) {

  // Only open the Window if it's not already opened.
  var tableWindow = Ext.getCmp("tableWindow_" + inTableName);
  if (tableWindow) {
    tableWindow.close();
  }

  // Create (or simply show) the Databases Window.
  tableWindow = new Ext.Window({
    title : inDatabaseName + " : " + inTableName, width : 700,
    height : 500, constrain : true, maximizable : true,
    animateTarget : "divSource", layout : "fit",
    id : "tableWindow_" + inTableName,
    items : [
      { xtype : "tabpanel", activeTab : 0, layoutOnTabChange : true,
        items : [
          /* Structure tab. */
          { title : "Structure", layout : "table",
            id : "structureTablePanel_" + inTableName,
            layoutConfig : { columns : 5 }, autoScroll : true,
            items : [
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
            ],
            bbar : [
              { text : "Drop", icon : "img/Drop.gif", cls : "x-btn-text-icon",
                handler : function() {
                  SQLWorkbench.doTableOp(inDatabaseName, inTableName, "drop");
                }
              },
              "-",
              { text : "Empty", icon : "img/Empty.gif", cls : "x-btn-text-icon",
                handler : function() {
                  SQLWorkbench.doTableOp(inDatabaseName, inTableName, "empty");
                }
              },
              "-",
              { text : "Rename",
                icon : "img/Rename.gif", cls : "x-btn-text-icon",
                handler : function() {
                  SQLWorkbench.renameCopyTable(
                    inDatabaseName, inTableName, "rename");
                }
              },
              "-",
              { text : "Copy", icon : "img/Copy.gif", cls : "x-btn-text-icon",
                handler : function() {
                  SQLWorkbench.renameCopyTable(
                    inDatabaseName, inTableName, "copy");
                }
              }
            ]
          },
          /* Browse tab. */
          { title : "Browse", layout : "fit", id : "browseTab_" + inTableName,
            items : [ { id : "browseTablePanel_" + inTableName, html : "" } ]
          }
        ]
      }
    ]
  });

  // Get a reference to the DatabaseRecord, then its tables, then the
  // TableRecord for this table, and finally its creation SQL statement.
  var databaseRecord = SQLWorkbench.Data.databasesStore.getById(inDatabaseName);
  var tables = databaseRecord.get("tables");
  var tableRecord = tables.get(inTableName);
  var sql = tableRecord.get("sql");

  // Parse the SQL to get details about it.
  var tableDetails = SQLWorkbench.parseCreateSQL(sql);
  tableRecord.set("tableDetails", tableDetails);

  // Add a row for each column in the table to the Panel where they go, each
  // row having some widgets.
  var structureTablePanel = Ext.getCmp("structureTablePanel_" + inTableName);
  for (var i = 0; i < tableDetails.fields.length; i++) {
    structureTablePanel.add({ html : tableDetails.fields[i].name,
      border : false, cellCls : "cssTableCell" });
    structureTablePanel.add({ html :
      Ext.util.Format.uppercase(tableDetails.fields[i].type),
      border : false, cellCls : "cssTableCell" });
    if (tableDetails.fields[i].primaryKey) {
      structureTablePanel.add(
        { xtype : "checkbox", checked : true, readOnly : true,
          ctCls : "cssTableCentered" }
      );
    } else {
      structureTablePanel.add({ html : "&nbsp;", border : false });
    }
    if (tableDetails.fields[i].notNull) {
      structureTablePanel.add(
        { xtype : "checkbox", checked : true, readOnly : true,
          ctCls : "cssTableCentered" }
      );
    } else {
      structureTablePanel.add({ html : "&nbsp;", border : false });
    }
    structureTablePanel.add({ html : tableDetails.fields[i].defaultValue,
      border : false, cellCls : "cssTableCell" });
  }

  // Show all records on the Browse tab.
  SQLWorkbench.showAllRecords(inDatabaseName, inTableName);

  // All ready, show the Window.
  tableWindow.show();

}; // End SQLWorkbench.listTableDetails().


/**
 * Retrieves all records for a given table and displays them on the Browse tab.
*/
SQLWorkbench.showAllRecords = function(inDatabaseName, inTableName) {

  // Get table details so we have the list of column names.
  var databaseRecord = SQLWorkbench.Data.databasesStore.getById(inDatabaseName);
  var tables = databaseRecord.get("tables");
  var tableRecord = tables.get(inTableName);
  var tableDetails = tableRecord.get("tableDetails");

  // Remove any previous table so refresh works.
  var browseTab = Ext.getCmp("browseTab_" + inTableName);
  browseTab.remove("browseTablePanel_" + inTableName);

  // Create a new Panel with a TableLayout and add the header row, one column
  // for each column in the table.
  var browseTablePanel = new Ext.Panel({
    id : "browseTablePanel_" + inTableName, layout : "table", autoScroll : true,
    layoutConfig : { columns : tableDetails.fields.length }
  });
  for (var i = 0; i < tableDetails.fields.length; i++) {
    browseTablePanel.add({
      html : "<div style=\"background-color:#dfe8f6;\">" +
      tableDetails.fields[i].name + "</div>", cellCls : "cssTableHeader"
    });
  }

  // Get all records from the table.
  var db = google.gears.factory.create("beta.database");
  db.open(inDatabaseName);
  var rs = db.execute("SELECT * FROM " + inTableName);

  // Iterate over the records and add a row for each in the table.  Make sure
  // to put a Radio on each row for selecting a record to operate on.
  while (rs.isValidRow()) {
    for (var i = 0; i < tableDetails.fields.length; i++) {
      browseTablePanel.add({
        html : rs.fieldByName(tableDetails.fields[i].name),
        border : false, cellCls : "cssTableCell"
      });
    }
    rs.next();
  }
  db.close();

  // Add the Panel to the Browse tab and we're done.
  browseTab.add(browseTablePanel);

}; // End SQLWorkbench.showAllRecords().


/**
 * Performs one of a number of operations on a table.
 */
SQLWorkbench.doTableOp =
  function(inDatabaseName, inTableName, inOperation, inValue) {

  // Construct SQL statement(s).
  var sql1 = null;
  var sql2 = null;
  switch (inOperation) {
    case "drop":
      sql1 = "DROP TABLE " + inTableName;
    break;
    case "empty":
      sql1 = "DELETE FROM " + inTableName;
    break;
    case "rename":
      sql1 = "ALTER TABLE " + inTableName + " RENAME TO " + inValue;
    break;
    case "copy":
      // Get the creation SQL for the table and replace the table name with the
      // name of the copy.
      var databaseRecord =
        SQLWorkbench.Data.databasesStore.getById(inDatabaseName);
      var tables = databaseRecord.get("tables");
      var tableRecord = tables.get(inTableName);
      var creationSQL = tableRecord.get("sql");
      sql1 = creationSQL.replace(inTableName, inValue);
      sql2 = "INSERT INTO " + inValue + " SELECT * FROM " + inTableName;
    break;
  }

  // Confirm they want to do this and do it if so.
  Ext.MessageBox.confirm("Confirm SQL Execution",
    "Are you sure you want to execute the following " +
    "SQL statement(s)?<br><br><br>" + sql1 + (sql2?"<br>"+sql2:""),
    function(inButtonClicked) {
      if (inButtonClicked == "yes") {
        // Open the database and try to execute the SQL.
        var db = google.gears.factory.create("beta.database");
        db.open(inDatabaseName);
        try {
          db.execute(sql1);
          if (sql2) {
            db.execute(sql2);
          }
          db.close();
          SQLWorkbench.listTables(inDatabaseName);
          Ext.MessageBox.hide();
          // One last thing: change the title of the Table Details Window
          // to account for the rename operation, or close the Window in the
          // case of drop.
          if (inOperation == "rename") {
            Ext.getCmp("tableWindow_" + inTableName).setTitle(
              inDatabaseName + " : " + inValue);
          } else if (inOperation = "drop") {
            Ext.getCmp("tableWindow_" + inTableName).close();
          }
          return true;
        } catch (e) {
          db.close();
          Ext.MessageBox.alert("SQL Execution Error", e);
          return false;
        }
      } else {
        return false;
      }
    }
  );

}; // End SQLWorkbench.doTableOp().


/**
 * Allows the user to rename a table, or to copy a table (which are
 * fundamentally almost identical, hence one method for both).
 */
SQLWorkbench.renameCopyTable =
  function(inDatabaseName, inTableName, inOperation) {

  var windowTitle = "Rename Table";
  var promptText = "Please enter the new name for the table";
  if (inOperation == "copy") {
    windowTitle = "Copy Table";
    promptText = "Please enter the name for the new copy";
  }

  // Prompt for the new name.
  Ext.MessageBox.prompt(windowTitle, promptText,
    function(inBtnID, inVal) {
      if (inBtnID == "cancel") { return; }
      if (inVal != null) { inVal = inVal.trim(); }
      if (!Ext.isEmpty(inVal)) {
        // Confirm execution and do it it they do confirm.
        SQLWorkbench.doTableOp(inDatabaseName, inTableName, inOperation, inVal);
      }
    }, null, false, inTableName
  );

}; // End SQLWorkbench.renameCopyTable().


/**
 * Parse table creation SQL and returns and object with the parsed details.
 *
 * @param  inSQL The table creation SQL to parse.
 * @return       A table descriptor object with details about the table.
 */
SQLWorkbench.parseCreateSQL = function(inSQL) {

  // Some utility functions we'll need.
  var trimQuotes = function(inString) {
    return inString.replace(/^['"`]+|['"`]+$/g, '');
  };
  var replaceString = function(inSource, inReplace, inReplaceWith) {
    var start = inSource.toLowerCase().indexOf(inReplace.toLowerCase());
    while (start != -1) {
      inSource = inSource.substring(0, start - 1) +
        inReplaceWith + inSource.substring(start + inReplace.length);
      start = inSource.toLowerCase().indexOf(inReplace.toLowerCase());
    }
    return inSource;
  };

  // Table details that will be returned.
  var tableDetails = {
    sql : inSQL,
    error : null,
    temporary : false,
    ifNotExists : false,
    tableName : null,
    databaseName : null,
    fields : [ ]
  };

  // Trim incoming SQL.
  inSQL = inSQL.trim();

  // Make sure there's only single spaces throughout.
  var stringBefore = inSQL;
  var stringAfter = inSQL.replace(/\s\s/g, ' ');
  while (stringBefore != stringAfter) {
    stringBefore = stringAfter;
    stringAfter = stringAfter.replace(/\s\s/g, ' ');
  }
  inSQL = stringAfter;

  // Get the prefix (the part before the field list).
  var prefix = (inSQL.substring(0, inSQL.indexOf("("))).trim();

  // Make sure the create keyword is there and is first, then cut it off.
  if (prefix.toLowerCase().indexOf("create") != 0) {
    tableDetails.error = "create keyword not found";
    return tableDetails;
  }
  prefix = prefix.substring(7);

  // See if temp or temporary is present, then cut it off if so.
  if (prefix.toLowerCase().indexOf("temp ") == 0) {
    tableDetails.temporary = true;
    prefix = prefix.substring(5);
  } else if (prefix.toLowerCase().indexOf("temporary") == 0) {
    tableDetails.temporary = true;
    prefix = prefix.substring(10);
  }

  // Make sure the table keyword is there next, then cut it off.
  if (prefix.toLowerCase().indexOf("table") != 0) {
    tableDetails.error = "table keyword not found";
    return tableDetails;
  }
  prefix = prefix.substring(6);

  // See if the if not exists clause is present, then cut it off if so.
  if (prefix.toLowerCase().indexOf("if not exists") == 0) {
    tableDetails.ifNotExists = true;
    prefix = prefix.substring(14);
  }

  // Get the table name, dealing with databaseName.tableName form.
  if (prefix.indexOf(".") == -1) {
    tableDetails.databaseName = null;
    tableDetails.tableName = trimQuotes(prefix);
  } else {
    tableDetails.databaseName = trimQuotes(prefix.split(".")[0]);
    tableDetails.tableName = trimQuotes(prefix.split(".")[1]);
  }

  // Get the field list.
  var fields = inSQL.substring(inSQL.indexOf("(") + 1, inSQL.length - 1);

  // See if there's a list of primary keys at the end and get it if so.
  // In that case, trim the fields list to remove the primary key list.
  var primaryKeyListLocation = fields.toLowerCase().indexOf("primary key(");
  var primaryKeyList = null;
  if (primaryKeyListLocation != -1) {
    primaryKeyList = fields.substring(primaryKeyListLocation).trim();
    fields = fields.substring(0, primaryKeyListLocation).trim();
    // Trim trailing comma that would now be on the end.
    fields = fields.substring(0, fields.length - 1);
  }

  // Tokenize the list of fields and handle each, creating a descriptor for
  // it and adding it to the list of fields in the table descriptor.
  var fieldTokens = fields.split(",");
  for (var i = 0; i < fieldTokens.length; i++) {

    // Field descriptor.
    var fieldDescriptor = {
      name : null, type : null, primaryKey : false, notNull : false,
      defaultValue : null
    };

    // Get field and trim it.
    var field = fieldTokens[i].trim();
    var testField = field.toLowerCase();

    // Determine type.  When determined, strip it.
    if (testField.indexOf("integer") != -1) {
      fieldDescriptor.type = "integer";
    }
    if (testField.indexOf("double") != -1) {
      fieldDescriptor.type = "double";
    }
    if (testField.indexOf("float") != -1) {
      fieldDescriptor.type = "float";
    }
    if (testField.indexOf("real") != -1) {
      fieldDescriptor.type = "real";
    }
    if (testField.indexOf("char") != -1) {
      fieldDescriptor.type = "char";
    }
    if (testField.indexOf("varchar") != -1) {
      fieldDescriptor.type = "varchar";
    }
    if (testField.indexOf("text") != -1) {
      fieldDescriptor.type = "text";
    }
    if (testField.indexOf("blob") != -1) {
      fieldDescriptor.type = "blob";
    }
    if (testField.indexOf("numeric") != -1) {
      fieldDescriptor.type = "numeric";
    }
    if (testField.indexOf("datetime") != -1) {
      fieldDescriptor.type = "datetime";
    }
    field = replaceString(field, fieldDescriptor.type, "").trim();

    // Check for not null, and strip it if found.
    if (field.toLowerCase().indexOf("not null") != -1) {
      fieldDescriptor.notNull = true;
      field = replaceString(field, "not null", "").trim();
    }

    // Check for primary key, and strip it if found.
    if (field.toLowerCase().indexOf("primary key") != -1) {
      fieldDescriptor.primaryKey = true;
      field = replaceString(field, "primary key", "").trim();
    }

    // Check for default value and grab it if found.
    var defaultValueKeywordStart = field.toLowerCase().indexOf("default");
    if (defaultValueKeywordStart != -1) {
      var defaultValueStart = field.indexOf("'", defaultValueKeywordStart);
      var defaultValueEnd = field.indexOf("'", defaultValueStart + 1);
      fieldDescriptor.defaultValue =
        field.substring(defaultValueStart + 1, defaultValueEnd);
      field = field.substring(0, defaultValueKeywordStart).trim();
    }

    // All that remains is the field name.
    fieldDescriptor.name = trimQuotes(field);

    // Add fieldDescriptor to tableDetails.
    tableDetails.fields.push(fieldDescriptor);

  } // End iteration over fields.

  // Finally, if we previously got a list of primary keys at the end, parse
  // that now and set the primaryKey flag on the appropriate fields.
  if (primaryKeyList) {
    primaryKeyList = primaryKeyList.trim();
    primaryKeyList = primaryKeyList.substring(primaryKeyList.indexOf("(") + 1,
      primaryKeyList.indexOf(")"));
    var pkFields = primaryKeyList.split(",");
    for (var i = 0; i < pkFields.length; i++) {
      var pkFieldName = trimQuotes(pkFields[i]).trim();
      for (var j = 0; j < tableDetails.fields.length; j++) {
        if (pkFieldName.toLowerCase() ==
          tableDetails.fields[j].name.toLowerCase()) {
          tableDetails.fields[j].primaryKey = true;
          break;
        }
      }
    }
  }

  // All done, return completed details.
  return tableDetails;

}; // End SQLWorkbench.parseCreateSQL().
