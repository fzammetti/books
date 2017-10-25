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
// JSON that describes the modify task dialog.
//


var uioModifyTaskWindow = {
  title : "", closable : true, modal : true,
  width : 360, height : 290, minimizable : false, resizable : false,
  draggable : true, shadowOffset : 8, closeAction : "hide",
  id : "dialogModifyTask", listeners : {
    beforeshow : function() {
      this.setTitle("Modify task '" + currentTask.get("name") + "'");
      var detailsForm = Ext.getCmp("modifyTaskDetails").getForm();
      detailsForm.setValues({
        "modifyTaskDescription" : currentTask.get("description"),
        "modifyTaskAssignedResource" : currentTask.get("resource"),
        "modifyTaskStartDate" : currentTask.get("startdate"),
        "modifyTaskEndDate" : currentTask.get("enddate"),
        "modifyTaskAllocatedHours" : currentTask.get("allocatedhours"),
        "modifyTaskPercentComplete" : currentTask.get("percentcomplete")
      });
    }
  },
  buttons : [
    /* Cancel button. */
    {
      text : "Cancel", handler : function() {
        Ext.getCmp("dialogModifyTask").hide();
      }
    },
    /* Save Changes button. */
    { text : "Save Changes", disabled : false, id : "modifyTaskSaveChanges",
      handler : function() {
        // Save changes to task details.
        var valsDetails = Ext.getCmp("modifyTaskDetails").getForm().getValues();
        currentTask.beginEdit();
        currentTask.set("description", valsDetails.modifyTaskDescription);
        currentTask.set("resource", valsDetails.modifyTaskAssignedResource);
        currentTask.set("startdate", valsDetails.modifyTaskStartDate);
        currentTask.set("enddate", valsDetails.modifyTaskEndDate);
        currentTask.set("allocatedhours", valsDetails.modifyTaskAllocatedHours);
        currentTask.set("percentcomplete",
          valsDetails.modifyTaskPercentComplete);
        currentTask.endEdit();
        // Update the tasks tree so that any changes to resource allocation
        // show up now.  Also update the projects tree so changes are shown
        // there as well.
        populateTasksTree();
        populateProjectsTree();
        showProjectSummary();
        // Show updated details of task, if task summary was showing.
        if (currentSummaryView == 2) {
          showTaskSummary();
        }
        Ext.getCmp("dialogModifyTask").hide();
      }
    }
  ],
  items : [{
    xtype : "form", width : 360, height : 290,
    id : "modifyTaskDetails", bodyStyle : "padding:5px", monitorValid : true,
    frame : true, labelWidth : 120, items : [
      {
        xtype : "textarea", fieldLabel : "Description",
        name : "modifyTaskDescription", width : 200, height : 80,
        allowBlank : false
      },
      {
        xtype : "combo", fieldLabel : "Assigned Resource", editable : false,
        name : "modifyTaskAssignedResource", allowBlank : true,
        triggerAction : "all", mode : "local", store : resourcesStore,
        valueField : "name", displayField : "name"
      },
      {
        xtype : "datefield", fieldLabel : "Start Date",
        name : "modifyTaskStartDate", allowBlank : false
      },
      {
        xtype : "datefield", fieldLabel : "End Date",
        name : "modifyTaskEndDate", allowBlank : false
      },
      {
        xtype : "numberfield", fieldLabel : "Allocated Hours",
        name : "modifyTaskAllocatedHours", width : 75, allowBlank : false
      },
      {
        xtype : "numberfield", fieldLabel : "Percent Complete",
        name : "modifyTaskPercentComplete", width : 75, allowBlank : false,
        minValue : 0, maxValue : 100
      }
    ],
    listeners : {
      clientvalidation : function(inFomPanel, inValid) {
        if (inValid) {
          Ext.getCmp("modifyTaskSaveChanges").enable();
        } else{
          Ext.getCmp("modifyTaskSaveChanges").disable();
        }
      }
    }
  }]
};
