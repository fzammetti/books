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
 * Shows the Query Tool Window.
 */
SQLWorkbench.showQueryTool = function() {

  // Close the Window if its already open just show it to bring it to the front.
  if (Ext.getCmp("queryToolWindow")) {
    queryToolWindow.show();
    return;
  }

  // Create the Query Tool Window.
  new Ext.Window({
    title : "Query Tool", width : 700, height : 600, constrain : true,
    animateTarget : "divSource", id : "queryToolWindow", maximizable : true,
    layout : "anchor", bodyStyle:"padding:8px;background-color:#ffffff",
    minWidth : 400, minHeight : 500,
    tbar : [
      { xtype : "panel", baseCls: "x-window-header",
        html : "Select database for query:&nbsp;" },
      { xtype : "combo", width : 100, editable : false, id : "qtDatabase",
        triggerAction : "all", mode : "local", valueField : "name",
        displayField : "name", store : SQLWorkbench.Data.databasesStore }
    ],
    bbar : [
      { text : "Execute SQL",
        icon : "img/ExecuteSQL.gif", cls : "x-btn-text-icon",
        handler : function() {
          SQLWorkbench.executeArbitrarySQL();
        }
      }
    ],
    items : [
      { html : "<b>Enter SQL to execute:</b>", anchor : "100% 4%",
        border : false },
      { xtype : "textarea", anchor : "100% 20%", id : "qtSQL" },
      { anchor : "100% 2%", border : false },
      { html : "<b>Last error:</b>", anchor : "100% 4%", border : false },
      { anchor : "100% 10%", id : "qtError" },
      { anchor : "100% 2%", border : false },
      { anchor : "100% 58%", border : false, id : "qtResult" }
    ]
  }).show();

}; // End SQLWorkbench.showQueryTool().


/**
 * Executes an arbitrary SQL statement entered in the Query Tool Window and
 * displays the results in that same Window.
 */
SQLWorkbench.executeArbitrarySQL = function() {

  // Get input values and validate.
  var databaseName = Ext.getCmp("qtDatabase").getValue().trim();
  var sql = Ext.getCmp("qtSQL").getValue().trim();
  if (Ext.isEmpty(databaseName)) {
    Ext.MessageBox.alert("Error", "Please select a database");
    return;
  }
  if (Ext.isEmpty(sql)) {
    Ext.MessageBox.alert("Error", "Please enter a SQL query");
    return;
  }

  // Confirm they want to do this and do it if so.
  Ext.MessageBox.confirm("Confirm SQL Execution",
    "Are you sure you want to execute the following " +
    "SQL statement?<br><br><br>" + sql + "<br><br><br>...in database : " +
    databaseName,
    function(inButtonClicked) {
      if (inButtonClicked == "yes") {
        // Remove the error box and results section, they'll be added anew here.
        var queryToolWindow = Ext.getCmp("queryToolWindow");
        queryToolWindow.remove("qtError");
        queryToolWindow.remove("qtResult");
        // Open the database and try to execute the SQL.
        var errMsg = "";
        var db = google.gears.factory.create("beta.database");
        db.open(databaseName);
        var resultTablePanel = null;
        try {
          var rs = db.execute(sql);
          var headersDone = false;
          while (rs.isValidRow()) {
            if (!headersDone) {
              // Construct the Panel using TableLayout for displaying results.
              resultTablePanel = new Ext.Panel({
                layout : "table", autoScroll : true, anchor : "100% 58%",
                layoutConfig : { columns : rs.fieldCount() }, border : false,
                id : "qtResult"
              });
              // Now add the header row.
              for (var i = 0; i < rs.fieldCount(); i++) {
                resultTablePanel.add({
                  html : "<div style=\"background-color:#dfe8f6;\">" +
                  rs.fieldName(i) + "</div>", cellCls : "cssTableHeader"
                });
                headersDone = true;
              }
            }
            // Add the current. row of data.
            for (var i = 0; i < rs.fieldCount(); i++) {
              resultTablePanel.add({
                html : rs.field(i), border : false, cellCls : "cssTableCell"
              });
            }
            rs.next();
          }
          if (!headersDone) {
            // The only way headersDone is false here is if there were no
            // results returned by the query.  This pretty much must mean the
            // type of query wasn't a select, therefore we just want to display
            // the number of rows affected.
            resultTablePanel = new Ext.Panel({
              layout : "table", anchor : "100% 58%", border : false,
              layoutConfig : { columns : 1 }, id : "qtResult"
            });
            resultTablePanel.add({
              html : "Rows affected: " + db.rowsAffected,
              border : false, cellCls : "cssTableCell"
            });
          }
          rs.close();
          db.close();
          Ext.MessageBox.hide();
        } catch (e) {
          db.close();
          errMsg = e;
        }
        // Recreate error box and results section and add them to the Window.
        queryToolWindow.insert(4,
          { html : errMsg, anchor : "100% 10%", id : "qtError" }
        );
        queryToolWindow.add(resultTablePanel);
        queryToolWindow.doLayout();
      }
    }
  );

}; // End SQLWorkbench.executeArbitrarySQL().
