/*
    TimekeeperExt - From the book "Practical Ext JS Projects With Gears"
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
// JSON that describes the resourcess tree.
//


var uioResourcesTree = {
  layout : "fit", id : "resourcesTree", title : "Resource View",
  root : new Ext.tree.TreeNode( { id : "root", text : "Resources" } ),
  listeners : {
    click : function(inNode, inEvent) {
      // Ignore clicks on root node, otherwise, get the ResourceRecord
      // associated with the clicked project.
      if (inNode.id != "root") {
        // Note that this differs from the projects tree and tasks tree event
        // handler because here we know it'll be a resource that's clicked, it
        // can't be anything else, so there's less work involved here.
        currentResource = resourcesStore.getById(inNode.id);
        showResourceSummary();
        Ext.getCmp("menuResourceDeleteResource").enable();
        Ext.getCmp("menuResourceModifyResource").enable();
      }
    }
  }
};
