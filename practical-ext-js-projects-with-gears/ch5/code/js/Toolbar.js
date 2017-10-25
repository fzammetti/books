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
 * JSON (config object) that describes the main Toolbar.
 */
CodeCabinetExt.UIObjects.Toolbar = function() { return ({
  id : "Toolbar", items : [
    {
      text : "Add Category",
      handler : function() {
        CodeCabinetExt.UIEventHandlers.AddCategory();
      }, icon : "img/icon_category_add.gif", cls : "x-btn-text-icon"
    },
    {
      text : "Delete Category", id : "DeleteCategory", disabled : true,
      handler : function() {
        CodeCabinetExt.UIEventHandlers.DeleteCategory();
      }, icon : "img/icon_category_delete.gif", cls : "x-btn-text-icon"
    },
    { xtype : "tbseparator" },
    {
      text : "Add Snippet", id : "AddSnippet", disabled : true,
      handler : function() {
        CodeCabinetExt.UIEventHandlers.AddSnippet();
      }, icon : "img/icon_snippet_add.gif", cls : "x-btn-text-icon"
    },
    {
      text : "Delete Snippet", id : "DeleteSnippet", disabled : true,
      handler : function() {
        CodeCabinetExt.UIEventHandlers.DeleteSnippet();
      }, icon : "img/icon_snippet_delete.gif", cls : "x-btn-text-icon"
    }
  ]
}); };


/**
 * Event handler called when the Add Category Toolbar button is clicked.
 */
CodeCabinetExt.UIEventHandlers.AddCategory = function() {

  Ext.Msg.prompt("Add Category", "Please enter a name for the new category:",
    function(inButtonClicked, inTextEntered) {
      if (inButtonClicked == "ok") {

        // First, check that there's no category with this name yet.
        if (CodeCabinetExt.Data.CategoriesStore.getById(inTextEntered)) {
          Ext.Msg.alert("Name not allowed",
            "A category with that name already exists.  " +
            "Please choose another."
          );
          return;
        }

        // Then, create a CategoryRecord and add it to the CategoriesStore.
        var categoryRecord = new CodeCabinetExt.Data.CategoryRecord(
          { name : inTextEntered }, inTextEntered
        );
        CodeCabinetExt.Data.CategoriesStore.add(categoryRecord);

        // Also add it to the Tree.
        var rootNode = Ext.getCmp("Tree").getRootNode();
        rootNode.appendChild(
          new Ext.tree.TreeNode( { id : inTextEntered, text : inTextEntered } )
        );
        rootNode.expand();

      }
    }
  );

}; // End CodeCabinetExt.UIEventHandlers.AddCategory().


/**
 * Event handler called when the Delete Category Toolbar button is clicked.
 */
CodeCabinetExt.UIEventHandlers.DeleteCategory = function() {

  Ext.MessageBox.confirm("Confirm Category Deletion",
    "Are you sure you want to delete the selected category? " +
    "Note that all snippets within the category will also be deleted!",
    function(inButtonClicked) {
      if (inButtonClicked == "yes") {

        // Delete the category from categoriesStore and the Tree.
        var rootNode = Ext.getCmp("Tree").getRootNode();
        var categoryTreeNode = Ext.getCmp("Tree").getNodeById(
          CodeCabinetExt.currentCategory.get("name"));
        rootNode.removeChild(categoryTreeNode);
        CodeCabinetExt.Data.CategoriesStore.remove(
          CodeCabinetExt.currentCategory);
        CodeCabinetExt.currentCategory = null;
        CodeCabinetExt.Data.SnippetsStore.removeAll();

        // Disable toolbar items that need to be disabled now.
        Ext.getCmp("DeleteCategory").setDisabled(true);
        Ext.getCmp("AddSnippet").setDisabled(true);
        Ext.getCmp("DeleteSnippet").setDisabled(true);

        // Reset details view as well.
        Ext.getCmp("Details").setActiveTab(0);
        Ext.getCmp("tabSnippets").getLayout().setActiveItem(0);
        Ext.getCmp("tabInfo").setDisabled(true);
        Ext.getCmp("tabCode").setDisabled(true);
        Ext.getCmp("tabNotes").setDisabled(true);
        Ext.getCmp("tabKeywords").setDisabled(true);

        // Clear search form and results too.
        Ext.getCmp("SearchForm").getForm().reset();
        CodeCabinetExt.Data.SearchResultsStore.removeAll();

      }
    }
  );

}; // End CodeCabinetExt.UIEventHandlers.DeleteCategory().


/**
 * Event handler called when the Add Snippet Toolbar button is clicked.
 */
CodeCabinetExt.UIEventHandlers.AddSnippet = function() {

  if (
    CodeCabinetExt.Data.SnippetsStore.findExact("name", "New Snippet") == -1) {
    CodeCabinetExt.Data.SnippetsStore.add(
      new CodeCabinetExt.Data.SnippetRecord({
        categoryname : CodeCabinetExt.currentCategory.get("name"),
        name : "New Snippet", author : "",
        description : "A new snippet", email : "", code : "", weblink : "",
        notes : "", keyword1 : "", keyword2 : "", keyword3 : "", keyword4 : "",
        keyword5 : ""
      }, new Date().getTime().toString())
    );
  }

}; // End CodeCabinetExt.UIEventHandlers.AddSnippet().


/**
 * Event handler called when the Delete Snippet Toolbar button is clicked.
 */
CodeCabinetExt.UIEventHandlers.DeleteSnippet = function() {

  Ext.MessageBox.confirm("Confirm Snippet Deletion",
    "Are you sure you want to delete the selected snippet?",
    function(inButtonClicked) {
      if (inButtonClicked == "yes") {

        // Delete the snippet from snippetsStore.
        CodeCabinetExt.Data.SnippetsStore.remove(CodeCabinetExt.currentSnippet);
        CodeCabinetExt.currentSnippet = null;

        // Disable toolbar items that need to be disabled now.
        Ext.getCmp("DeleteSnippet").setDisabled(true);

        // Reset details view as well.
        Ext.getCmp("Details").setActiveTab(0);
        Ext.getCmp("tabInfo").setDisabled(true);
        Ext.getCmp("tabCode").setDisabled(true);
        Ext.getCmp("tabNotes").setDisabled(true);
        Ext.getCmp("tabKeywords").setDisabled(true);

      }
    }
  );

}; // End CodeCabinetExt.UIEventHandlers.DeleteSnippet().
