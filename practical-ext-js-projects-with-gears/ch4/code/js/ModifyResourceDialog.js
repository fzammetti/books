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
// JSON that describes the modify resource dialog.
//


var uioModifyResourceWindow = {
  title : "", closable : true, modal : true,
  width : 360, height : 300, minimizable : false, resizable : false,
  draggable : true, shadowOffset : 8, closeAction : "hide",
  id : "dialogModifyResource", listeners : {
    beforeshow : function() {
      this.setTitle("Modify resource '" + currentResource.get("name") + "'");
      var detailsForm = Ext.getCmp("modifyResourceDetails").getForm();
      detailsForm.setValues({
        "modifyResourceDescription" : currentResource.get("description"),
        "modifyResourceIsAPM" :
          (currentResource.get("isaprojectmanager") == "Yes" ? true : false)
      });
      var modifyResourceHoursUsed = Ext.getCmp("modifyResourceHoursUsed");
      modifyResourceHoursUsed.setValue("");
      modifyResourceHoursUsed.disable();
      Ext.getCmp("modifyResourceBookButton").disable();
      // Populate the temporary list of tasks assigned to this resource.
      tempAssignedTasksStore.removeAll();
      tasksStore.each(function(inRecord) {
        if (inRecord.get("resource") == currentResource.get("name")) {
          tempAssignedTasksStore.add(inRecord.copy());
        }
      });
      Ext.getCmp("modifyResourceAssignedTasks").setValue("");
    }
  },
  buttons : [
    /* Cancel button. */
    {
      text : "Cancel", handler : function() {
        Ext.getCmp("dialogModifyResource").hide();
      }
    },
    /* Save Changes button. */
    { text : "Save Changes", disabled : false, id : "modifyResourceSaveChanges",
      handler : function() {
        var valsDetails =
          Ext.getCmp("modifyResourceDetails").getForm().getValues();
        var doSave = true;
        // Validation: Don't allow resource to be made not a PM if assigned
        // to a project.
        if (!valsDetails.modifyResourceIsAPM) {
          var resourceName = currentResource.get("name");
          projectsStore.each(function(inRecord) {
            if (inRecord.get("projectmanager") == resourceName) {
              alert("Resource WAS NOT modified " +
                "because PM designation cannot be changed while resource " +
                "is PM of a project");
              doSave = false;
            }
          });
        }
        if (doSave) {
          // Save changes to resource details.
          currentResource.beginEdit();
          currentResource.set("description",
            valsDetails.modifyResourceDescription);
          currentResource.set("isaprojectmanager",
            valsDetails.modifyResourceIsAPM ? "Yes" : "No");
          currentResource.endEdit();
          // Save changes to tasks that had hours booked against them.
          tempAssignedTasksStore.each(function(inRecord) {
            if (inRecord.dirty) {
              var taskRecord = tasksStore.getById(inRecord.id);
              taskRecord.set("bookedtime", inRecord.get("bookedtime"));
            }
          });
          // Show updated details of resource, if resource summary was showing.
          if (currentSummaryView == 3) {
            showResourceSummary();
          }
        }
        Ext.getCmp("dialogModifyResource").hide();
      }
    }
  ],
  items : [{
    xtype : "tabpanel", activeTab : 0, width : 360, height : 300, items : [
      {
        title : "Details", xtype : "form",
        id : "modifyResourceDetails", bodyStyle : "padding:5px",
        monitorValid : true, frame : true, labelWidth : 100,
        items : [
          {
            xtype : "textarea", fieldLabel : "Description",
            name : "modifyResourceDescription", width : 220, height : 80,
            allowBlank : false
          },
          {
            xtype : "checkbox", fieldLabel : "Designate PM",
            name : "modifyResourceIsAPM", allowBlank : false
          }
        ],
        listeners : {
          clientvalidation : function(inFomPanel, inValid) {
            if (inValid) {
              Ext.getCmp("modifyResourceSaveChanges").enable();
            } else{
              Ext.getCmp("modifyResourceSaveChanges").disable();
            }
          }
        }
      },
      {
        title : "Time Booking", xtype : "form",
        id : "modifyResourceTimeBooking", bodyStyle : "padding:5px",
        frame : true, labelWidth : 100, items : [
          {
            xtype : "combo", fieldLabel : "Assigned Tasks", editable : false,
            name : "modifyResourceAssignedTasks", allowBlank : true,
            id : "modifyResourceAssignedTasks",
            triggerAction : "all", mode : "local",
            store : tempAssignedTasksStore, valueField : "name",
            displayField : "name", listeners : {
              select : function(inComboBox, inRecord, inIndex) {
                Ext.getCmp("modifyResourceHoursUsed").enable();
              }
            }
          },
          {
            xtype : "numberfield", fieldLabel : "Hours Used", disabled : true,
            name : "modifyResourceHoursUsed", width : 75, allowBlank : true,
            id : "modifyResourceHoursUsed", enableKeyEvents : true,
            listeners : {
              keyup : function(inNumberField, inEventObject) {
                if (inNumberField.getValue() != "") {
                  Ext.getCmp("modifyResourceBookButton").enable();
                } else {
                  Ext.getCmp("modifyResourceBookButton").disable();
                }
              }
            }
          },
          {
            xtype : "button", text : "Book", id : "modifyResourceBookButton",
            disabled : true, handler : function() {
              var modifyResourceHoursUsed =
                Ext.getCmp("modifyResourceHoursUsed");
              var taskRecord = tempAssignedTasksStore.getById(
                Ext.getCmp("modifyResourceAssignedTasks").getValue());
              taskRecord.set("bookedtime", modifyResourceHoursUsed.getValue());
              modifyResourceHoursUsed.setValue("");
              modifyResourceHoursUsed.disable();
              Ext.getCmp("modifyResourceBookButton").disable();
            }
          }
        ]
      }
    ]
  }]
};
