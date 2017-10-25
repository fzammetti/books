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
// JSON that describes the delete project dialog.
//


var uioDeleteProjectWindow = {
  title : "", closable : true, modal : true,
  width : 450, height : 200, minimizable : false, resizable : false,
  draggable : false, shadowOffset : 8, closeAction : "hide",
  id : "dialogDeleteProject", listeners : {
    beforeshow : function() {
      this.setTitle("Confirm deletion of project '" +
        currentProject.get("name") + "'");
    }
  },
  buttons : [
    /* No button. */
    {
      text : "No", handler : function() {
        Ext.getCmp("dialogDeleteProject").hide();
      }
    },
    /* Yes button. */
    { text : "Yes",
      handler : function() {
        var doDelete = true;
        var projectName = currentProject.get("name");
        // Validation: Don't allow delete if project has tasks assigned to it.
        tasksStore.each(function(inRecord) {
          if (inRecord.get("project") == projectName) {
            alert("Project WAS NOT deleted " +
              "because it has tasks allocated to it");
            doDelete = false;
          }
        });
        if (doDelete) {
          projectsStore.remove(currentProject);
          Ext.getCmp("projectsTree").getNodeById(
            "project~@~" + currentProject.get("name")).remove();
          currentProject = null;
          showProjectSummary();
          Ext.getCmp("menuProjectDeleteProject").disable();
          Ext.getCmp("menuProjectModifyProject").disable();
        }
        Ext.getCmp("dialogDeleteProject").hide();
      }
    }
  ],
  items : [{
    html :
      "<table width=\"100%\" height=\"100%\" border=\"0\" cellpadding=\"0\" " +
      "cellspacing=\"0\"><tr><td class=\"cssAbout\" align=\"center\" " +
      "valign=\"middle\">Are you sure you want to delete the " +
      "selected project?</td></tr></table>"
  }]
};
