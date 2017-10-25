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
// JSON that describes the new project dialog.
//


var uioNewProjectWindow = {
  title : "New Project Wizard", closable : true, modal : true,
  width : 400, height : 340, minimizable : false, resizable : false,
  draggable : true, shadowOffset : 8, closeAction : "hide",
  id : "dialogNewProject",
  listeners : {
    beforeshow : function() {
      Ext.getCmp("0newProject").getForm().reset();
      Ext.getCmp("1newProject").getForm().reset();
      Ext.getCmp("2newProject").getForm().reset();
      Ext.getCmp("dialogNewProjectCard").getLayout().setActiveItem(0);
      Ext.getCmp("newProjectNext").disable();
      Ext.getCmp("newProjectBack").disable();
      Ext.getCmp("newProjectFinish").disable();
    }
  },
  buttons : [
    /* Cancel button. */
    {
      text : "Cancel", handler : function() {
        Ext.getCmp("dialogNewProject").hide();
      }
    },
    /* Back button. */
    { text : "< Back", disabled : true, id : "newProjectBack",
      handler : function() {
        // Move back one step, if there's one before where we are now.
        var dialogCardLayout =
          Ext.getCmp("dialogNewProjectCard").getLayout();
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
      text : "Next >", disabled : true, id : "newProjectNext",
      handler : function() {
        // Move forward one step, if there's on after where we are now.
        Ext.getCmp("newProjectBack").enable();
        var dialogCardLayout =
          Ext.getCmp("dialogNewProjectCard").getLayout();
        var currentStep =
          parseInt(dialogCardLayout.activeItem.getId().substr(0, 1));
        if (currentStep < 2) {
          dialogCardLayout.setActiveItem(currentStep + 1);
        }
      }
    },
    /* Finish button. */
    {
      text : "Finish", disabled : true, id : "newProjectFinish",
      handler : function() {
        // Get the values from the three forms.
        var vals0 = Ext.getCmp("0newProject").getForm().getValues();
        var vals1 = Ext.getCmp("1newProject").getForm().getValues();
        var vals2 = Ext.getCmp("2newProject").getForm().getValues();
        var doAdd = true;
        // Validation: Don't allow add if project name is already used.
        if (projectsStore.getById(vals0.newProjectName)) {
          alert("Project WAS NOT created " +
            "because a project already exists with that name");
            doAdd = false;
        }
        // Add record to store.
        if (doAdd) {
          var newID = vals0.newProjectName;
          var newRecord = new ProjectRecord({
            name : vals0.newProjectName,
            description : vals0.newProjectDescription,
            projectmanager : vals1.newProjectPM,
            startdate : vals2.newProjectStartDate,
            enddate : vals2.newProjectEndDate,
            allocatedhours : vals2.newProjectAllocatedHours
          }, newID);
          projectsStore.add(newRecord);
          // Add record to tree and expand it.
          var rootNode = Ext.getCmp("projectsTree").getRootNode();
          rootNode.appendChild(
            new Ext.tree.TreeNode({
              id : "project~@~" + newID, text : vals0.newProjectName
            })
          );
          rootNode.expand();
        }
        // All done, hide this dialog.
        Ext.getCmp("dialogNewProject").hide();
      }
    }
  ],
  items : [{
    layout : "card", activeItem : 0, id : "dialogNewProjectCard",
    items : [
      /* Step 1. */
      {
        xtype : "form", title : "Step 1/3", width : 400, height : 340,
        id : "0newProject", bodyStyle : "padding:5px", monitorValid : true,
        frame : true, labelWidth : 100, hideMode : "offsets",
        items : [
          { html : "<b>Welcome to the New Project wizard!<br><br>" +
              "This wizard will walk you through creating a new project " +
              "to track with TimekeeperExt.<br><br>" +
              "Please begin by entering a name for your project, as " +
              "well as a brief description of it.</b><br><br><br>" },
          {
            xtype : "textfield", fieldLabel : "Project Name",
            name : "newProjectName", width : 220, allowBlank : false
          },
          {
            xtype : "textarea", fieldLabel : "Description",
            name : "newProjectDescription", width : 220, height : 80,
            allowBlank : false
          }
        ],
        listeners : {
          clientvalidation : function(inFomPanel, inValid) {
            // Find out what step we're on right now.
            var dialogCardLayout =
              Ext.getCmp("dialogNewProjectCard").getLayout();
            var currentStep =
              parseInt(dialogCardLayout.activeItem.getId().substr(0, 1));
            // Only do something if it's the step this event is tied to.
            if (currentStep == 0) {
              // Enable next button if this form is valid.
              if (inValid) {
                Ext.getCmp("newProjectNext").enable();
              } else {
                Ext.getCmp("newProjectNext").disable();
              }
            }
          }
        }
      },
      /* Step 2. */
      {
        xtype : "form", title : "Step 2/3", width : 400, height : 340,
        bodyStyle : "padding:5px", id : "1newProject", monitorValid : true,
        frame : true, labelWidth : 100, hideMode : "offsets",
        items : [
          { html : "<b>Please select a resource that will serve as the " +
              "project manager for your project.<br><br>Note that if " +
              "there are no options here, you may need to create at least " +
              "one resource, and ensure at least one resource is "+
              "designated a project manager.</b><br><br><br>" },
          {
            xtype : "combo", fieldLabel : "Project Manager",
            name : "newProjectPM", allowBlank : false,
            editable : false, triggerAction : "all",
            mode : "local", store : projectManagersStore,
            valueField : "name", displayField : "name"
          }
        ],
        listeners : {
          clientvalidation : function(inFomPanel, inValid) {
            // Find out what step we're on right now.
            var dialogCardLayout =
              Ext.getCmp("dialogNewProjectCard").getLayout();
            var currentStep =
              parseInt(dialogCardLayout.activeItem.getId().substr(0, 1));
            // Only do something if it's the step this event is tied to.
            if (currentStep == 1) {
              // Enable next button if this form is valid.
              if (inValid) {
                Ext.getCmp("newProjectNext").enable();
              } else {
                Ext.getCmp("newProjectNext").disable();
              }
            }
          }
        }
      },
      /* Step 3. */
      {
        xtype : "form", title : "Step 3/3", width : 400, height : 340,
        bodyStyle : "padding:5px", id : "2newProject", monitorValid : true,
        frame : true, labelWidth : 100, hideMode : "offsets",
        items : [
          { html : "<b>Please enter the date on which the project began (or " +
              "will begin), and the date it is expected to conclude.  Then " +
              "enter the total number of hours allocated to this project." +
              "<br><br>When you are done, click Finish to create " +
              "the project.</b><br><br><br>" },
          {
            xtype : "datefield", fieldLabel : "Start Date",
            name : "newProjectStartDate", allowBlank : false
          },
          {
            xtype : "datefield", fieldLabel : "End Date",
            name : "newProjectEndDate", allowBlank : false
          },
          {
            xtype : "numberfield", fieldLabel : "Allocated Hours",
            name : "newProjectAllocatedHours", width : 75, allowBlank : false
          }
        ],
        listeners : {
          clientvalidation : function(inFomPanel, inValid) {
            // Find out what step we're on right now.
            var dialogCardLayout =
              Ext.getCmp("dialogNewProjectCard").getLayout();
            var currentStep =
              parseInt(dialogCardLayout.activeItem.getId().substr(0, 1));
            // Only do something if it's the step this event is tied to.
            if (currentStep == 2) {
              // Disable next, we're at the end.
              Ext.getCmp("newProjectNext").disable();
              // Enable finish button, if appropriate.
              if (inValid) {
                Ext.getCmp("newProjectFinish").enable();
              } else {
                Ext.getCmp("newProjectFinish").disable();
              }
            }
          }
        }
      }
    ]
  }]
};
