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
 * JSON (config object) that describes the snippets Tree.
 */
CodeCabinetExt.UIObjects.Tree = function() { return ({
  id : "Tree", root : new Ext.tree.TreeNode(
    { id : "root", text : "Code Snippets" }
  ),
  listeners : {
    click : function(inNode, inEvent) {
      CodeCabinetExt.UIEventHandlers.TreeClick(inNode, inEvent);
    }
  }
}); };


/**
 * Event handler called when a node in the Tree is clicked.
 *
 * @param inNode  The TreeNode that was clicked.
 * @param inEvent The event descriptor object.
 */
CodeCabinetExt.UIEventHandlers.TreeClick = function(inNode, inEvent) {

  // Get CategoryRecord for the selected category and set it as current.
  var categoryRecord = CodeCabinetExt.Data.CategoriesStore.getById(inNode.id);
  CodeCabinetExt.currentCategory = categoryRecord;

  // Enable the appropriate toolbar items.
  Ext.getCmp("DeleteCategory").setDisabled(false);
  Ext.getCmp("AddSnippet").setDisabled(false);

  // Account for having had a snippet open.
  Ext.getCmp("DeleteSnippet").setDisabled(false);
  Ext.getCmp("tabInfo").setDisabled(true);
  Ext.getCmp("tabCode").setDisabled(true);
  Ext.getCmp("tabNotes").setDisabled(true);
  Ext.getCmp("tabKeywords").setDisabled(true);
  CodeCabinetExt.currentSnippet = false;

  // Populate SnippetsStore with snippets in this category and show the Grid.
  CodeCabinetExt.populatingSnippetsStore = true;
  CodeCabinetExt.Data.SnippetsStore.removeAll();
  var snippets = CodeCabinetExt.Data.DAO.retrieveSnippets(inNode.id);
  for (var i = 0; i < snippets.length; i++) {
    CodeCabinetExt.Data.SnippetsStore.add(snippets[i], snippets[i].id);
  }
  CodeCabinetExt.populatingSnippetsStore = false;
  Ext.getCmp("Details").getLayout().setActiveItem(0);
  var ts = Ext.getCmp("tabSnippets");
  ts.getLayout().setActiveItem(1);
  ts.show();

}; // End CodeCabinetExt.UIEventHandlers.TreeClick().
