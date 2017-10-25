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
// JSON that describes the new task dialog.
//


var uioNewTaskWindow = {
  title : "New Task Wizard", closable : true, modal : true,
  width : 400, height : 340, minimizable : false, resizable : false,
  draggable : true, shadowOffset : 8, closeAction : "hide",
  id : "dialogNewTask",
  listeners : {
    beforeshow : function() {
      Ext.getCmp("0newTask").getForm().reset();
      Ext.getCmp("1newTask").getForm().reset();
      Ext.getCmp("dialogNewTaskCard").getLayout().setActiveItem(0);
      Ext.getCmp("newTaskNext").disable();
      Ext.getCmp("newTaskBack").disable();
      Ext.getCmp("newTaskFinish").disable();
    }
  },
  buttons : [
    /* Cancel button. */
    {
      text : "Cancel", handler : function() {
        Ext.getCmp("dialogNewTask").hide();
      }
    },
    /* Back button. */
    { text : "< Back", disabled : true, id : "newTaskBack",
      handler : function() {
        // Move back one step, if there's one before where we are now.
        var dialogCardLayout =
          Ext.getCmp("dialogNewTaskCard").getLayout();
        var currentStep =
          parseInt(dialogCardLayout.activeItem.getId().substr(0, 1));
        if (currentStep > 0) {
          dialogCardLayout.setActiveItem(currentStep - 1);
        }
        // Disable button if we just moved to the first step (which means
        // we were just on the second step, where currentStep == 1).
        if (currentStep == 1) {
          this.disable();
        }
      }
    },
    /* Next button. */
    {
      text : "Next >", disabled : true, id : "newTaskNext",
      handler : function() {
        // Move forward one step, if there's on after where we are now.
        Ext.getCmp("newTaskBack").enable();
        var dialogCardLayout =
          Ext.getCmp("dialogNewTaskCard").getLayout();
        var currentStep =
          parseInt(dialogCardLayout.activeItem.getId().substr(0, 1));
        if (currentStep < 1) {
          dialogCardLayout.setActiveItem(currentStep + 1);
        }
      }
    },
    /* Finish button. */
    {
      text : "Finish", disabled : true, id : "newTaskFinish",
      handler : function() {
        // Get the values from the three forms.
        var vals0 = Ext.getCmp("0newTask").getForm().getValues();
        var vals1 = Ext.getCmp("1newTask").getForm().getValues();
        var doAdd = true;
        // Validation: Don't allow add if task name is already used.
        if (tasksStore.getById(vals0.newTaskName)) {
          alert("Task WAS NOT created " +
            "because a task already exists with that name");
            doAdd = false;
        }
        // Add record to store.
        if (doAdd) {
          var newID = vals0.newTaskName;
          var newRecord = new TaskRecord({
            name : vals0.newTaskName,
            description : vals0.newTaskDescription,
            startdate : vals1.newTaskStartDate,
            enddate : vals1.newTaskEndDate,
            allocatedhours : vals1.newTaskAllocatedHours,
            project : "", resource : "", bookedtime : 0, percentcomplete : 0
          }, newID);
          tasksStore.add(newRecord);
          // Add record to tree and expand it.
          var rootNode = Ext.getCmp("tasksTree").getRootNode();
          rootNode.appendChild(
            new Ext.tree.TreeNode({
              id : "task~@~" + newID, text : vals0.newTaskName
            })
          );
          rootNode.expand();
          // Refresh the availableTasksStore so this task will be added.
          populateAvailableTasks();
        }
        // All done, hide this dialog.
        Ext.getCmp("dialogNewTask").hide();
      }
    }
  ],
  items : [{
    layout : "card", activeItem : 0, id : "dialogNewTaskCard",
    items : [
      /* Step 1. */
      {
        xtype : "form", title : "Step 1/2", width : 400, height : 340,
        id : "0newTask", bodyStyle : "padding:5px", monitorValid : true,
        frame : true, labelWidth : 100, hideMode : "offsets",
        items : [
          { html : "<b>Welcome to the New Task wizard!<br><br>" +
              "This wizard will walk you through creating a new task " +
              "that can then be added to a project.<br><br>" +
              "Please begin by entering a name for your task, as " +
              "well as a brief description of it.</b><br><br><br>" },
          {
            xtype : "textfield", fieldLabel : "Task Name",
            name : "newTaskName", width : 220, allowBlank : false
          },
          {
            xtype : "textarea", fieldLabel : "Description",
            name : "newTaskDescription", width : 220, height : 80,
            allowBlank : false
          }
        ],
        listeners : {
          clientvalidation : function(inFomPanel, inValid) {
            // Find out what step we're on right now.
            var dialogCardLayout =
              Ext.getCmp("dialogNewTaskCard").getLayout();
            var currentStep =
              parseInt(dialogCardLayout.activeItem.getId().substr(0, 1));
            // Only do something if it's the step this event is tied to.
            if (currentStep == 0) {
              // Enable next button if this form is valid.
              if (inValid) {
                Ext.getCmp("newTaskNext").enable();
              } else {
                Ext.getCmp("newTaskNext").disable();
              }
            }
          }
        }
      },
      /* Step 2. */
      {
        xtype : "form", title : "Step 2/2", width : 400, height : 340,
        bodyStyle : "padding:5px", id : "1newTask", monitorValid : true,
        frame : true, labelWidth : 100, hideMode : "offsets",
        items : [
          { html : "<b>Please enter the date on which the task began (or " +
              "will begin), and the date it is expected to conclude.  Then " +
              "enter the total number of hours allocated to this task." +
              "<br><br>When you are done, click Finish to create " +
              "the task.</b><br><br><br>" },
          {
            xtype : "datefield", fieldLabel : "Start Date",
            name : "newTaskStartDate", allowBlank : false
          },
          {
            xtype : "datefield", fieldLabel : "End Date",
            name : "newTaskEndDate", allowBlank : false
          },
          {
            xtype : "numberfield", fieldLabel : "Allocated Hours",
            name : "newTaskAllocatedHours", width : 75, allowBlank : false
          }
        ],
        listeners : {
          clientvalidation : function(inFomPanel, inValid) {
            // Find out what step we're on right now.
            var dialogCardLayout =
              Ext.getCmp("dialogNewTaskCard").getLayout();
            var currentStep =
              parseInt(dialogCardLayout.activeItem.getId().substr(0, 1));
            // Only do something if it's the step this event is tied to.
            if (currentStep == 1) {
              // Disable next, we're at the end.
              Ext.getCmp("newTaskNext").disable();
              // Enable finish button, if appropriate.
              if (inValid) {
                Ext.getCmp("newTaskFinish").enable();
              } else {
                Ext.getCmp("newTaskFinish").disable();
              }
            }
          }
        }
      }
    ]
  }]
};
