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


// Create namespaces that will be used throughout this application.
Ext.namespace("CodeCabinetExt", "CodeCabinetExt.UIObjects",
  "CodeCabinetExt.UIEventHandlers", "CodeCabinetExt.Data");


/**
 * The CategoryRecord of the currently selected category, if any.
 */
CodeCabinetExt.currentCategory = null;


/**
 * The SnippetRecord of the currently selected snippet, if any.
 */
CodeCabinetExt.currentSnippet = null;


/**
 * This is a flag set to true when the SnippetsStore is being populated. It is
 * used by the SnippetsStore's add and remove events to determine if they
 * should fire or not (they never should when the store is being populated).
 */
CodeCabinetExt.populatingSnippetsStore = false;


/**
 * Called via Ext.onReady() to initialize the application.
 */
CodeCabinetExt.init = function() {

  // Show please wait message.
  Ext.MessageBox.show({
    title : "Please Wait",
    msg : "<span class='cssPleaseWait'>... Initializing ...</span>",
    buttons : false, closable : false, animEl : "divSource"
  });

  // Slight delay to give the dialog time to show, then continue initialization.
  (function() {
    // Initialize data access.
    var daoInitResult = CodeCabinetExt.Data.DAO.init();
    switch (daoInitResult) {
      // Data access initialization successful, build UI and start application.
      case "ok":
        Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
        CodeCabinetExt.buildUI();
        Ext.MessageBox.hide();
      break;
      // Gears wasn't available.
      case "no_gears":
        Ext.MessageBox.show({
          title : "Gears Not Available", buttons : Ext.MessageBox.OK,
          msg : "<br>" +
            "I'm sorry but Google Gears is not installed on your computer, " +
            "or is unavailable for some reason (like you disabled the " +
            "browser plugin for example)." +
            "<br><br>" +
            "If you do not have Gears installed, please visit " +
            "<a href=\"http://gears.google.com/\" target=\"new\">" +
            "the Gears home page</a> to install it." +
            "<br><br>" +
            "If you do have it installed, please try enabling the plugin in " +
            "whatever fashion is applicable in the browser you are using, " +
            "and reload this application."
        });
      break;
      // Any other unexpected failures.
      default:
        Ext.MessageBox.alert("DAO Initialization Failed",
          "Data access could not be initialized.  Reason: " + daoInitResult);
      break;
    }
  }).defer(500);

}; // End CodeCabinetExt.init();


/**
 * Called from CodeCabinetExt.init() to build the UI.  Note that the order in
 * which objects are constructed within this method is important.  For example,
 * the Viewport depends on the Toolbar having been constructed already, etc.
 */
CodeCabinetExt.buildUI = function() {

  // Create the main toolbar.
  new Ext.Toolbar(CodeCabinetExt.UIObjects.Toolbar());

  // Create the snippets Tree.
  new Ext.tree.TreePanel(CodeCabinetExt.UIObjects.Tree());

  // Create the details TabPanel.
  new Ext.TabPanel(CodeCabinetExt.UIObjects.Details());

  // Create the search FormPanel.
  new Ext.form.FormPanel(CodeCabinetExt.UIObjects.SearchForm());

  // Create the search results CardLayout.
  new Ext.Panel(CodeCabinetExt.UIObjects.SearchResults());

  // Create the Viewport.
  new Ext.Viewport(CodeCabinetExt.UIObjects.Viewport());

  // Load categories from data into categoriesStore and populate the Tree.
  var rootNode = Ext.getCmp("Tree").getRootNode();
  var categories = CodeCabinetExt.Data.DAO.retrieveCategories();
  for (var i = 0; i < categories.length; i++) {
    CodeCabinetExt.Data.CategoriesStore.add(categories[i]);
    var categoryName = categories[i].get("name");
    rootNode.appendChild(new Ext.tree.TreeNode(
      { id : categoryName, text : categoryName }
    ));
  }
  rootNode.expand();

}; // End CodeCabinetExt.buildUI().
