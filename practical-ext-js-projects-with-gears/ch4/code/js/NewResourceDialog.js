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
// JSON that describes the new resource dialog.
//


var uioNewResourceWindow = {
  title : "New Resource Wizard", closable : true, modal : true,
  width : 400, height : 340, minimizable : false, resizable : false,
  draggable : true, shadowOffset : 8, closeAction : "hide",
  id : "dialogNewResource",
  listeners : {
    beforeshow : function() {
      Ext.getCmp("0newResource").getForm().reset();
      Ext.getCmp("1newResource").getForm().reset();
      Ext.getCmp("dialogNewResourceCard").getLayout().setActiveItem(0);
      Ext.getCmp("newResourceNext").disable();
      Ext.getCmp("newResourceBack").disable();
      Ext.getCmp("newResourceFinish").disable();
    }
  },
  buttons : [
    /* Cancel button. */
    {
      text : "Cancel", handler : function() {
        Ext.getCmp("dialogNewResource").hide();
      }
    },
    /* Back button. */
    { text : "< Back", disabled : true, id : "newResourceBack",
      handler : function() {
        // Move back one step, if there's one before where we are now.
        var dialogCardLayout =
          Ext.getCmp("dialogNewResourceCard").getLayout();
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
      text : "Next >", disabled : true, id : "newResourceNext",
      handler : function() {
        // Move forward one step, if there's on after where we are now.
        Ext.getCmp("newResourceBack").enable();
        var dialogCardLayout =
          Ext.getCmp("dialogNewResourceCard").getLayout();
        var currentStep =
          parseInt(dialogCardLayout.activeItem.getId().substr(0, 1));
        if (currentStep < 1) {
          dialogCardLayout.setActiveItem(currentStep + 1);
        }
      }
    },
    /* Finish button. */
    {
      text : "Finish", disabled : true, id : "newResourceFinish",
      handler : function() {
        // Get the values from the three forms.
        var vals0 = Ext.getCmp("0newResource").getForm().getValues();
        var vals1 = Ext.getCmp("1newResource").getForm().getValues();
        var doAdd = true;
        // Validation: Don't allow add if resource name is already used.
        if (resourcesStore.getById(vals0.newResourceName)) {
          alert("Resource WAS NOT created " +
            "because a resource already exists with that name");
            doAdd = false;
        }
        // Add record to store.
        if (doAdd) {
          var newID = vals0.newResourceName;
          var newRecord = new ResourceRecord({
            name : vals0.newResourceName,
            description : vals0.newResourceDescription,
            isaprojectmanager : vals1.newResourceIsAPM ? "Yes" : "No"
          }, newID);
          resourcesStore.add(newRecord);
          // Add record to tree and expand it.
          var rootNode = Ext.getCmp("resourcesTree").getRootNode();
          rootNode.appendChild(
            new Ext.tree.TreeNode({
              id : newID, text : vals0.newResourceName
            })
          );
          rootNode.expand();
          // Refresh the projectManagersStore so this resource will be added, if
          // it was a PM.
          populateProjectManagers();
        }
        // All done, hide this dialog.
        Ext.getCmp("dialogNewResource").hide();
      }
    }
  ],
  items : [{
    layout : "card", activeItem : 0, id : "dialogNewResourceCard",
    items : [
      /* Step 1. */
      {
        xtype : "form", title : "Step 1/2", width : 400, height : 340,
        id : "0newResource", bodyStyle : "padding:5px", monitorValid : true,
        frame : true, labelWidth : 100, hideMode : "offsets",
        items : [
          { html : "<b>Welcome to the New Resource wizard!<br><br>" +
              "This wizard will walk you through creating a new resource " +
              "that can then be assigned to tasks.<br><br>" +
              "Please begin by entering a name for your resource, as " +
              "well as a brief description of it.</b><br><br><br>" },
          {
            xtype : "textfield", fieldLabel : "Resource Name",
            name : "newResourceName", width : 220, allowBlank : false
          },
          {
            xtype : "textarea", fieldLabel : "Description",
            name : "newResourceDescription", width : 220, height : 80,
            allowBlank : false
          }
        ],
        listeners : {
          clientvalidation : function(inFomPanel, inValid) {
            // Find out what step we're on right now.
            var dialogCardLayout =
              Ext.getCmp("dialogNewResourceCard").getLayout();
            var currentStep =
              parseInt(dialogCardLayout.activeItem.getId().substr(0, 1));
            // Only do something if it's the step this event is tied to.
            if (currentStep == 0) {
              // Enable next button if this form is valid.
              if (inValid) {
                Ext.getCmp("newResourceNext").enable();
              } else {
                Ext.getCmp("newResourceNext").disable();
              }
            }
          }
        }
      },
      /* Step 2. */
      {
        xtype : "form", title : "Step 2/2", width : 400, height : 340,
        bodyStyle : "padding:5px", id : "1newResource", monitorValid : true,
        frame : true, labelWidth : 100, hideMode : "offsets",
        items : [
          { html : "<b>Please determine if this resource is a project " +
              "manager (PM), which means they can be assigned as PM for " +
              "projects.<br><br>When you are done, click Finish to create " +
              "the resource.</b><br><br><br>" },
          {
            xtype : "checkbox", fieldLabel : "Designate PM",
            name : "newResourceIsAPM", allowBlank : false
          }
        ],
        listeners : {
          clientvalidation : function(inFomPanel, inValid) {
            // Find out what step we're on right now.
            var dialogCardLayout =
              Ext.getCmp("dialogNewResourceCard").getLayout();
            var currentStep =
              parseInt(dialogCardLayout.activeItem.getId().substr(0, 1));
            // Only do something if it's the step this event is tied to.
            if (currentStep == 1) {
              // Disable next, we're at the end.
              Ext.getCmp("newResourceNext").disable();
              // Enable finish button, if appropriate.
              if (inValid) {
                Ext.getCmp("newResourceFinish").enable();
              } else {
                Ext.getCmp("newResourceFinish").disable();
              }
            }
          }
        }
      }
    ]
  }]
};
