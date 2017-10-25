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
 * What help page is currently displayed, -1 if none.
 */
SQLWorkbench.currentHelpPage = -1;


/**
 * The contents of the help Windows.
 */
SQLWorkbench.helpPagesContent = [
  /* Page 0. */
  "<h1><i><u>Creating/modifying databases</u></i></h1>" +
  "<br>" +
  "The Databases window shows the list of databases you can work with.  You " +
  "can add a new database by clicking the Add Database button.  This will " +
  "prompt for the name of the database.  If the name you enter is a database " +
  "that already exists it will simply be added to the list.  If the database " +
  "does not exist then it will be created and added to the list.<br><br>" +
  "To remove a database, click it and then click the <b>Remove Database</b> " +
  "toolbar button.  The last database selected (since the last one to be " +
  "removed, if any) is the one that will be removed." +
  "<br><br>" +
  "Clicking a database opens the Tables window for that database, from which " +
  "you can work with tables.",
  /* Page 1. */
  "<h1><i><u>Working with tables</u></i></h1>" +
  "<br>" +
  "You can create a new table by clicking the Create New toolbar button.  " +
  "This will bring up the Create Table window where you can enter the name " +
  "of the table to create and describe its fields (maximum of 20).  Click " +
  "the Ok button to create the table, or Cancel to close the window." +
  "<br><br>" +
  "Click a table in the Tables window to open the Table Details window.  " +
  "Here you can view the structure of the table and perform various " +
  "operations, or browse the data in the table in read-only mode." +
  "<br><br>" +
  "* To drop (remove a table), click the Drop toolbar button.<" +
  "<br>" +
  "* To empty the table (delete all records but leave the table), click " +
  "the <b>Empty</b> toolbar button." +
  "<br>" +
  "* To rename the table, click the <b>Rename</b> toolbar button." +
  "<br>" +
  "* To copy a table (structure and data), click the <b>Copy</b> toolbar " +
  "button.",
  /* Page 2. */
  "<h1><i><u>Querying for data</u></i></h1>" +
  "<br>" +
  "Clicking the Query Tool toolbar button brings up the Query Tool " +
  "window.  This allows you to execute any arbitrary SQL query you wish for " +
  "any database.  To use it, select the database you wish to query against " +
  "from the dropdown list up top.  Then, enter the SQL query you wish to " +
  "execute and click the Execute SQL toolbar button.  If errors occur, the " +
  "message will be shown in the Last Error box.  If no errors occur, the " +
  "results of the query will be shown below the Last Error box.  It will " +
  "either show how many rows were affected for update-type queries, or a " +
  "scrollable grid-like display of the rows returned for retrieval queries."
];


/**
 * Opens a help page Window.
 */
SQLWorkbench.showHelp = function(inPageToDisplay) {

  // Build the Window for the requested help page.
  new Ext.Window({
    id : "dialogHelpPage" + inPageToDisplay, closable : false,
    width : 400, height : 320, minimizable : false, resizable : false,
    draggable : true, shadow : false, maximizable : false, layout : "fit",
    autoScroll : true,
    title : "Help page " + (inPageToDisplay + 1) + " of " +
      SQLWorkbench.helpPagesContent.length,
    items : [
      { html : SQLWorkbench.helpPagesContent[inPageToDisplay],
        bodyStyle : "padding:8px" }
    ],
    bbar : [
      { xtype : "button", text : "Previous Page",
        handler : function() {
          // Move to previous page, if there is one.
          if (SQLWorkbench.currentHelpPage > 0) {
            SQLWorkbench.showHelp(SQLWorkbench.currentHelpPage - 1);
          }
        }
      },
      "-",
      { xtype : "button", text : "Next Page",
        handler : function() {
          // Move to next page, if there is one.
          if (SQLWorkbench.currentHelpPage <
            (SQLWorkbench.helpPagesContent.length - 1)) {
            SQLWorkbench.showHelp(SQLWorkbench.currentHelpPage + 1);
          }
        }
      },
      "-",
      { xtype : "button", text : "Close Help",
        handler : function() {
          // Close the current help page.
          Ext.getCmp("dialogHelpPage" + SQLWorkbench.currentHelpPage).close();
          SQLWorkbench.currentHelpPage = -1;
        }
      }
    ]
  }).show();

  // Now puff out the current help page window, if there is one.
  if (SQLWorkbench.currentHelpPage != -1) {
    Ext.get("dialogHelpPage" + SQLWorkbench.currentHelpPage).puff({
      duration : 1, remove : true
    });
  }

  // Now fade in the new help page Window and record it as the current page.
  Ext.get("dialogHelpPage" + inPageToDisplay).fadeIn({
    duration : 1
  });
  SQLWorkbench.currentHelpPage = inPageToDisplay;

}; // End SQLWorkbench.showHelp();
