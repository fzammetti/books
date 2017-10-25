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


// Create namespaces that will be used throughout this application.
Ext.namespace("SQLWorkbench", "SQLWorkbench.UIObjects",
  "SQLWorkbench.UIEventHandlers", "SQLWorkbench.Data");


/**
 * Cookie provider that sets expiration on cookies to one year.
 */
SQLWorkbench.cookieProvider = new Ext.state.CookieProvider({
  expires : new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 365))
});


/**
 * Initialize the application.
 */
SQLWorkbench.init = function() {

  // Build the main toolbar.
  new Ext.Toolbar({
    id : "toolbar", renderTo : "divToolbar", items : [
      {
        text : "List Databases",
        icon : "img/ListDatabases.gif", cls : "x-btn-text-icon",
        handler : function() {
          SQLWorkbench.listDatabases();
        }
      },
      "-",
      {
        text : "Query Tool",
        icon : "img/QueryTool.gif", cls : "x-btn-text-icon",
        handler : function() {
          SQLWorkbench.showQueryTool();
        }
      },
      "-",
      {
        text : "Help", icon : "img/Help.gif", cls : "x-btn-text-icon",
        handler : function() {
          SQLWorkbench.showHelp(0);
        }
      },
      "-",
      {
        text : "About", icon : "img/About.gif", cls : "x-btn-text-icon",
        handler : function() {
          SQLWorkbench.showAbout();
        }
      }
    ]
  });

  SQLWorkbench.listDatabases();

} // End SQLWorkbench.init().


/**
 * Show the About Window.
 */
SQLWorkbench.showAbout = function() {

  var aboutWindow = Ext.getCmp("dialogAbout");
  if (aboutWindow) {
    aboutWindow.show(Ext.getDom("divSource"));
  } else {
    new Ext.Window({
      applyTo : "dialogAbout", id : "dialogAbout", closable : true,
      width : 400, height : 320, minimizable : false,
      resizable : false, draggable : false, closeAction : "hide",
      buttons : [{
        text : "Ok",
        handler : function() {
          Ext.getCmp("dialogAbout").hide();
        }
      }]
    }).show(Ext.getDom("divSource"));
  }

} // End SQLWorkbench.showAbout();
