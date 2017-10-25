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
// JSON that describes the projects tree.
//


var uioProjectsTree = {
  layout : "fit", id : "projectsTree", title : "Project View",
  root : new Ext.tree.TreeNode( { id : "root", text : "Projects" } ),
  listeners : {
    click : function(inNode, inEvent) {
      // Show welcome screen when root clicked, otherwise, get the ProjectRecord
      // associated with the clicked project.
      if (inNode.id == "root") {
        // Show welcome view when root is clicked.
        Ext.getCmp("mainCard").getLayout().setActiveItem(0);
      } else {
        // The ID will be in the form xxx~@~yyy or xxx~@~yyy~@~zzz, where xxx
        // is the type, yyy is a unique identifier when the clicked node is a
        // resource, and zzz is the actual ID (or yyy is when the node is
        // a project or resource).
        var splitVals = inNode.id.split("~@~");
        // Set current project, task or resource as applicable.
        switch (splitVals[0]) {
          case "project":
            currentProject = projectsStore.getById(splitVals[1]);
            showProjectSummary();
          break;
          case "task":
            currentTask = tasksStore.getById(splitVals[1]);
            showTaskSummary();
          break;
          case "resource":
            currentResource = resourcesStore.getById(splitVals[2]);
            showResourceSummary();
          break;
        };
        // Enable the menu items for the type of item just clicked and update
        // the status bar.
        var typeInCaps = Ext.util.Format.capitalize(splitVals[0]);
        Ext.getCmp("menu" + typeInCaps + "Delete" + typeInCaps).enable();
        Ext.getCmp("menu" + typeInCaps + "Modify" + typeInCaps).enable();
      }
    }
  }
};
