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
// JSON that describes the delete resource dialog.
//


var uioDeleteResourceWindow = {
  title : "", closable : true, modal : true,
  width : 400, height : 200, minimizable : false, resizable : false,
  draggable : false, shadowOffset : 8, closeAction : "hide",
  id : "dialogDeleteResource", listeners : {
    beforeshow : function() {
      this.setTitle("Confirm deletion of resource '" +
        currentResource.get("name") + "'");
    }
  },
  buttons : [
    /* No button. */
    {
      text : "No", handler : function() {
        Ext.getCmp("dialogDeleteResource").hide();
      }
    },
    /* Yes button. */
    { text : "Yes",
      handler : function() {
        var doDelete = true;
        var pmName = currentResource.get("name");
        // Validation: Don't allow delete if resource is a PM of a project.
        if (currentResource.get("isaprojectmanager") == "Yes") {
          projectsStore.each(function(inRecord) {
            if (inRecord.get("projectmanager") == pmName) {
              alert("Resource WAS NOT deleted " +
                "because it is PM of a project");
              doDelete = false;
            }
          });
        }
        // Validation: Don't allow delete if resource is assigned to a task.
        if (doDelete) {
          tasksStore.each(function(inRecord) {
            if (inRecord.get("resource") == pmName) {
              alert("Resource WAS NOT deleted " +
                "because it is assigned to a task");
              doDelete = false;
            }
          });
        }
        // Do the deletion now, if validations passed.
        if (doDelete) {
          resourcesStore.remove(currentResource);
          Ext.getCmp("resourcesTree").getNodeById(
            currentResource.get("name")).remove();
          currentResource = null;
          showResourceSummary();
          populateProjectManagers();
          Ext.getCmp("menuResourceDeleteResource").disable();
          Ext.getCmp("menuResourceModifyResource").disable();
        }
        Ext.getCmp("dialogDeleteResource").hide();
      }
    }
  ],
  items : [{
    html :
      "<table width=\"100%\" height=\"100%\" border=\"0\" cellpadding=\"0\" " +
      "cellspacing=\"0\"><tr><td class=\"cssAbout\" align=\"center\" " +
      "valign=\"middle\">Are you sure you want to delete the " +
      "selected resource?</td></tr></table>"
  }]
};
