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
// JSON that describes the modify project dialog.
//


var uioModifyProjectWindow = {
  title : "", closable : true, modal : true,
  width : 360, height : 300, minimizable : false, resizable : false,
  draggable : true, shadowOffset : 8, closeAction : "hide",
  id : "dialogModifyProject", listeners : {
    beforeshow : function() {
      this.setTitle("Modify project '" + currentProject.get("name") + "'");
      var detailsForm = Ext.getCmp("modifyProjectDetails").getForm();
      detailsForm.setValues({
        "modifyProjectDescription" : currentProject.get("description"),
        "modifyProjectStartDate" : currentProject.get("startdate"),
        "modifyProjectEndDate" : currentProject.get("enddate"),
        "modifyProjectPM" : currentProject.get("projectmanager"),
        "modifyProjectAllocatedHours" : currentProject.get("allocatedhours")
      });
      // Populate the temporary list of available tasks.
      tempAvailableTasksStore.removeAll();
      availableTasksStore.each(function(inRecord) {
        tempAvailableTasksStore.add(inRecord.copy());
      });
      // Populate the temporary list of tasks under this project.
      tempAllocatedTasksStore.removeAll();
      tasksStore.each(function(inRecord) {
        if (inRecord.get("project") == currentProject.get("name")) {
          tempAllocatedTasksStore.add(inRecord.copy());
        }
      });
    }
  },
  buttons : [
    /* Cancel button. */
    {
      text : "Cancel", handler : function() {
        Ext.getCmp("dialogModifyProject").hide();
      }
    },
    /* Save Changes button. */
    { text : "Save Changes", disabled : false, id : "modifyProjectSaveChanges",
      handler : function() {
        // Save changes to project details.
        var valsDetails =
          Ext.getCmp("modifyProjectDetails").getForm().getValues();
        currentProject.beginEdit();
        currentProject.set("description", valsDetails.modifyProjectDescription);
        currentProject.set("projectmanager", valsDetails.modifyProjectPM);
        currentProject.set("startdate", valsDetails.modifyProjectStartDate);
        currentProject.set("enddate", valsDetails.modifyProjectEndDate);
        currentProject.set("allocatedhours",
          valsDetails.modifyProjectAllocatedHours);
        currentProject.endEdit();
        // Modify any tasks that need to be in the tasksStore.
        tempAvailableTasksStore.each(function(inRecord) {
          var record = tasksStore.getById(inRecord.get("name"));
          record.set("project", "");
        });
        tempAllocatedTasksStore.each(function(inRecord) {
          var record = tasksStore.getById(inRecord.get("name"));
          record.set("project", currentProject.get("name"));
        });
        // Update the projects tree so that any changes to allocated tasks
        // show up now.
        populateProjectsTree();
        // Update the list of available tasks.
        populateAvailableTasks();
        // Show updated details of project, if project summary was showing.
        if (currentSummaryView == 1) {
          showProjectSummary();
        }
        Ext.getCmp("dialogModifyProject").hide();
      }
    }
  ],
  items : [{
    xtype : "tabpanel", activeTab : 0, width : 360, height : 300, items : [
      {
        title : "Details", xtype : "form",
        id : "modifyProjectDetails", bodyStyle : "padding:5px",
        monitorValid : true, frame : true, labelWidth : 100,
        items : [
          {
            xtype : "textarea", fieldLabel : "Description",
            name : "modifyProjectDescription", width : 220, height : 80,
            allowBlank : false
          },
          {
            xtype : "combo", fieldLabel : "Project Manager",
            name : "modifyProjectPM", allowBlank : false, editable : false,
            triggerAction : "all", mode : "local", store : projectManagersStore,
            valueField : "name", displayField : "name"
          },
          {
            xtype : "datefield", fieldLabel : "Start Date",
            name : "modifyProjectStartDate", allowBlank : false
          },
          {
            xtype : "datefield", fieldLabel : "End Date",
            name : "modifyProjectEndDate", allowBlank : false
          },
          {
            xtype : "numberfield", fieldLabel : "Allocated Hours",
            name : "modifyProjectAllocatedHours", width : 75, allowBlank : false
          }
        ],
        listeners : {
          clientvalidation : function(inFomPanel, inValid) {
            if (inValid) {
              Ext.getCmp("modifyProjectSaveChanges").enable();
            } else{
              Ext.getCmp("modifyProjectSaveChanges").disable();
            }
          }
        }
      },
      {
        title : "Tasks", xtype : "form", id : "modifyProjectTasks",
        bodyStyle : "padding:5px", frame : true, labelWidth : 100, items : [
          {
            html : "<b>To add a task to this project, select it below and " +
            "click Add.</b><br><br>"
          },
          {
            xtype : "combo", fieldLabel : "Available Tasks",
            name : "modifyProjectAvailableTasks", allowBlank : true,
            editable : false, triggerAction : "all", mode : "local",
            store : tempAvailableTasksStore, valueField : "name",
            displayField : "name", id : "modifyProjectAvailableTasks",
            listeners : {
              select : function(inComboBox, inRecord, inIndex) {
                Ext.getCmp("modifyProjectAddTaskButton").enable();
              }
            }
          },
          {
            xtype : "button", text : "Add", disabled : true,
            id : "modifyProjectAddTaskButton", handler : function() {
              var cb = Ext.getCmp("modifyProjectAvailableTasks");
              var taskName = cb.getValue();
              var taskRecord = tempAvailableTasksStore.getById(taskName);
              tempAllocatedTasksStore.add(taskRecord);
              tempAvailableTasksStore.remove(taskRecord);
              cb.clearValue();
              Ext.getCmp("modifyProjectAllocatedTasks").clearValue();
              this.disable();
            }
          },
          {
            html : "<br><br><b>To remove a task from this project, select it " +
            "below and click Remove.</b><br><br>"
          },
          {
            xtype : "combo", fieldLabel : "Allocated Tasks",
            name : "modifyProjectAllocatedTasks", allowBlank : true,
            editable : false, triggerAction : "all", mode : "local",
            store : tempAllocatedTasksStore, valueField : "name",
            displayField : "name", id : "modifyProjectAllocatedTasks",
            listeners : {
              select : function(inComboBox, inRecord, inIndex) {
                Ext.getCmp("modifyProjectRemoveTaskButton").enable();
              }
            }
          },
          {
            xtype : "button", text : "Remove", disabled : true,
            id : "modifyProjectRemoveTaskButton", handler : function() {
              var cb = Ext.getCmp("modifyProjectAllocatedTasks");
              var taskName = cb.getValue();
              var taskRecord = tempAllocatedTasksStore.getById(taskName);
              tempAvailableTasksStore.add(taskRecord);
              tempAllocatedTasksStore.remove(taskRecord);
              cb.clearValue();
              Ext.getCmp("modifyProjectAvailableTasks").clearValue();
              this.disable();
            }
          }
        ]
      }
    ]
  }]
};
