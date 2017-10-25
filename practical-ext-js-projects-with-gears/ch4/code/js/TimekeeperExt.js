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


/**
 * Create selection model for use in summary grids to show progress.  Note:
 * this code was derived from an example posted by EvilTed on the ExtJS
 * support forums in this thread (Thanks for sharing ET!):
 * http://extjs.net/forum/showthread.php?t=52955
 */
Ext.grid.ProgressBarSelectionModel = Ext.extend(Ext.grid.RowSelectionModel, {
  header : "", sortable : true, fixed : true, dataIndex : "",
  baseCls : "x-progress", width : 150, renderer : function(inValue) {
    var textToDisplay = [ "", "" ];
    if (inValue <= 50) {
      textToDisplay[1] = inValue + "%";
    } else {
      textToDisplay[0] = inValue + "%";
    }
    return String.format(
      "<div class=\"x-progress-wrap\"><div class=\"x-progress-inner\">" +
      "<div class=\"cssProgressBarFill\" style=\"width:{0}%;\">" +
      "<div class=\"x-progress-text\" " +
      "style=\"color:#ff6060;font-size:11pt;width:100%;margin-top:2px;\">" +
      "{1}</div></div>" +
      "<div class=\"x-progress-text\" " +
      "style=\"color:#ff6060;font-size:11pt;width:100%;margin-top:2px;\">" +
      "{2}</div></div></div>", inValue, textToDisplay[0], textToDisplay[1]
    );
  }
});


/**
 * A reference to the currently selected ProjectRecord.
 */
var currentProject = null;


/**
 * A reference to the currently selected ResourceRecord.
 */
var currentResource = null;


/**
 * A reference to the currently selected TaskRecord.
 */
var currentTask = null;


/**
 * Stores which summary view is currently showing as a numeric index value
 * matching the current card index value.
 */
var currentSummaryView = 0;


/**
 * Called to initialize the application.
 */
function init() {

  // Show please wait dialog.
  new Ext.Window({
    applyTo : "dialogPleaseWait", closable : false, modal : true,
    width : 200, height : 100, minimizable : false, resizable : false,
    draggable : false, shadowOffset : 8, id : "dialogPleaseWait"
  }).show(Ext.getDom("divSource"));
  // Timeout to give the dialog time to show.
  setTimeout("initMain()", 500);

} // End init().


/**
 * The main initialization tasks, kicked off by init().
 */
function initMain() {

  // Initialize DAO.  If false returned, Gears was not available.
  if (!dao.init()) {
    Ext.getCmp("dialogPleaseWait").destroy();
    var dialogNoGears = new Ext.Window({
      applyTo : "dialogNoGears", closable : false, modal : true,
      width : 400, height : 220, minimizable : false, resizable : false,
      draggable : false, shadowOffset : 8, closeAction : "hide",
      buttons : [{
        text : "Ok",
        handler : function() {
          dialogNoGears.hide();
        }
      }]
    });
    dialogNoGears.show(Ext.getDom("divSource"));
    return;
  }

  // Initial data loads.
  loadData();

  // Turn on validation errors beside the field globally and enable tooltips.
  Ext.QuickTips.init();
  Ext.form.Field.prototype.msgTarget = "side";

  // Build the main UI itself.
  buildUI();

  // All done, hide please wait, set flag to indicate initialization has
  // completed, and we're ready to go.
  Ext.getCmp("dialogPleaseWait").destroy();

} // End initMain().


/**
 * Build the user interface of the application.
 */
function buildUI() {

  // Create the menu structure.
  new Ext.Toolbar(uioMenubar);

  // Create the trees.
  new Ext.tree.TreePanel(uioProjectsTree);
  new Ext.tree.TreePanel(uioTasksTree);
  new Ext.tree.TreePanel(uioResourcesTree);

  // Create UI.
  var vp = new Ext.Viewport({
    layout : "border", items : [
      Ext.getCmp("mainMenu"),
      {
        region : "center", layout : "card", activeItem : 0, id : "mainCard",
        items : [
          { html :
            "<table width=\"100%\" height=\"100%\" border=\"0\" " +
            "cellpadding=\"0\" cellspacing=\"0\"><tr>" +
            "<td align=\"center\" valign=\"middle\">" +
            "<img src=\"img/welcome.gif\"></td></tr></table>" },
          new Ext.Panel(uioProjectSummary),
          new Ext.Panel(uioTaskSummary),
          new Ext.Panel(uioResourceSummary)
        ]
      },
      {
        region : "west", layout : "border", width : 250, split : true,
        items : [
          {
            region : "north", height : 84, bodyStyle : "padding:4px",
            items : [
              {
                xtype : "radiogroup", columns : 1,
                items : [
                  { boxLabel : "Project View", name : "viewMode",
                    inputValue : 1, checked : true,
                    listeners : {
                      "check" : function(inCheckbox, inChecked) {
                        if (inChecked) {
                          Ext.getCmp("vmCard").getLayout().setActiveItem(0);
                        }
                      }
                    }
                   },
                  { boxLabel : "Task View", name : "viewMode",
                    inputValue : 2, checked : false,
                    listeners : {
                      "check" : function(inCheckbox, inChecked) {
                        if (inChecked) {
                          Ext.getCmp("vmCard").getLayout().setActiveItem(1);
                        }
                      }
                    }
                   },
                  { boxLabel : "Resource View", name : "viewMode",
                    inputValue : 3, checked : false,
                    listeners : {
                      "check" : function(inCheckbox, inChecked) {
                        if (inChecked) {
                          Ext.getCmp("vmCard").getLayout().setActiveItem(2);
                        }
                      }
                    }
                   }
                ]
              }
            ]
          },
          {
            region : "center", layout : "card", activeItem : 0, id : "vmCard",
            items : [
              Ext.getCmp("projectsTree"), Ext.getCmp("tasksTree"),
              Ext.getCmp("resourcesTree")
            ]
          }
        ]
      }
    ]
  });

  // Populate all our view trees.
  populateProjectsTree();
  populateTasksTree();
  populateResourcesTree();

} // End buildUI().


/**
 * Loads the initial set of data from the database (i.e., existing projects,
 * tasks and resources).
 */
function loadData() {

  // Retrieve list of projects.
  var projects = dao.retrieveProjects();
  for (var i = 0; i < projects.length; i++) {
    projectsStore.add(projects[i]);
  }

  // Retrieve list of task.
  var tasks = dao.retrieveTasks();
  for (var i = 0; i < tasks.length; i++) {
    tasksStore.add(tasks[i]);
  }

  // Retrieve list of resources.
  var resources = dao.retrieveResources();
  for (var i = 0; i < resources.length; i++) {
    resourcesStore.add(resources[i]);
  }

  // Populate the other stores derived from the above stores.
  populateProjectManagers();
  populateAvailableTasks();

} // End loadData().


/**
 * Populates the projectManagersStore from the resourcesStore so we have a
 * separate store of project managers only.
 */
function populateProjectManagers() {

  // Populate the list of project managers.
  projectManagersStore.removeAll();
  resourcesStore.each(function(inRecord) {
    if (inRecord.get("isaprojectmanager") == "Yes") {
      projectManagersStore.add(inRecord.copy());
    }
  });

} // End populateProjectManagers().


/**
 * Populates the availableTasksStore from the tasksStore so we have a
 * separate store of tasks not assigned to projects.
 */
function populateAvailableTasks() {

  // Populate the list of project managers.
  availableTasksStore.removeAll();
  tasksStore.each(function(inRecord) {
    if (inRecord.get("project") == "") {
      availableTasksStore.add(inRecord.copy());
    }
  });

} // End populateAvailableTasks().


/**
 * Populates the projects view trees.
 */
function populateProjectsTree() {

  var newProjectNode = null;
  var newTaskNode = null;

  // Clear the tree.
  var pRootNode = Ext.getCmp("projectsTree").getRootNode();
  var delNode;
  if (pRootNode) {
    while (delNode = pRootNode.childNodes[0]) {
      pRootNode.removeChild(delNode);
    }
  }

  // Populate the projects tree and expand it all to start with.
  var assureUnique = 1;
  projectsStore.each(function(inProjectRecord) {
    newProjectNode = pRootNode.appendChild(new Ext.tree.TreeNode({
      id : "project~@~" + inProjectRecord.get("name"),
      text : inProjectRecord.get("name")
    }));
    // Now append any tasks allocated to this project to the new node.
    tasksStore.each(function(inTaskRecord) {
      if (inTaskRecord.get("project") == inProjectRecord.get("name")) {
        newTaskNode = newProjectNode.appendChild(new Ext.tree.TreeNode({
          id : "task~@~" + inTaskRecord.get("name"),
          text : inTaskRecord.get("name")
        }));
        // Now append any resourcess assigned to this task to the new node.
        resourcesStore.each(function(inResourceRecord) {
          if (inTaskRecord.get("resource") == inResourceRecord.get("name")) {
            var newID = "resource~@~" + assureUnique + "~@~" +
              inResourceRecord.get("name");
            newTaskNode.appendChild(new Ext.tree.TreeNode({
              id : newID, text : inResourceRecord.get("name")
            }));
            assureUnique = assureUnique + 1;
          }
        });
      }
    });
  });
  pRootNode.expand();

} // End populateProjectsTree().


/**
 * Populates the tasks view trees.
 */
function populateTasksTree() {

  var newTaskNode = null;

  // Clear the tree.
  var tRootNode = Ext.getCmp("tasksTree").getRootNode();
  var delNode;
  if (tRootNode) {
    while (delNode = tRootNode.childNodes[0]) {
      tRootNode.removeChild(delNode);
    }
  }

  // Populate the tasks tree and expand it all to start with.
  var assureUnique = 1;
  tasksStore.each(function(inTaskRecord) {
    newTaskNode = tRootNode.appendChild(new Ext.tree.TreeNode({
      id : "task~@~" + inTaskRecord.get("name"),
      text : inTaskRecord.get("name")
    }));
    // Now append any resourcess assigned to this task to the new node.
    resourcesStore.each(function(inResourceRecord) {
      if (inTaskRecord.get("resource") == inResourceRecord.get("name")) {
        var newID = "resource~@~" + assureUnique + "~@~" +
          inResourceRecord.get("name");
        newTaskNode.appendChild(new Ext.tree.TreeNode({
          id : newID, text : inResourceRecord.get("name")
        }));
        assureUnique = assureUnique + 1;
      }
    });
  });
  tRootNode.expand();

} // End populateTasksTree().


/**
 * Populates the resources view trees.
 */
function populateResourcesTree() {

  // Clear the tree.
  var rRootNode = Ext.getCmp("resourcesTree").getRootNode();
  var delNode;
  if (rRootNode) {
    while (delNode = rRootNode.childNodes[0]) {
      rRootNode.removeChild(delNode);
    }
  }

  // Populate the resources tree and expand it all to start with.
  resourcesStore.each(function(inResourceRecord) {
    rRootNode.appendChild(new Ext.tree.TreeNode({
      id : inResourceRecord.get("name"), text : inResourceRecord.get("name")
    }));
  });
  rRootNode.expand();

} // End populateResourcesTree().


/**
 * Displays the project summary main panel and populates it.
 */
function showProjectSummary() {

  // Make the appropriate card visible.
  if (currentProject) {
    Ext.getCmp("mainCard").getLayout().setActiveItem(1);
    currentSummaryView = 1;
  } else {
    // This covers the case where the project was just deleted.
    Ext.getCmp("mainCard").getLayout().setActiveItem(0);
    return;
  }

  // Populate store for tasks allocated to this project.  At the same time,
  // calculate how many hours have been booked to the project.
  var projectBookedTime = 0;
  tempProjectSummaryTasks.removeAll();
  // For each task in the store, see if the resource is assigned to it.
  tasksStore.each(function(inRecord) {
    if (inRecord.get("project") == currentProject.get("name")) {
      var newRecord = inRecord.copy();
      newRecord.set("status", calculateStatus(inRecord.get("bookedtime"),
        inRecord.get("allocatedhours"), inRecord.get("enddate")));
      tempProjectSummaryTasks.add(newRecord);
      projectBookedTime = projectBookedTime + inRecord.get("bookedtime");
    }
  });

  // Populate store for project details.
  tempProjectSummaryDetails.removeAll();
  var newRecord = currentProject.copy();
  newRecord.set("bookedtime", projectBookedTime);
  newRecord.set("status", calculateStatus(
    projectBookedTime, currentProject.get("allocatedhours"),
    currentProject.get("enddate")));
  tempProjectSummaryDetails.add(newRecord);

  // Populate store for resource involved with this project.
  tempProjectSummaryResources.removeAll();
  // For each task in the store temporary, get the resource assigned to it.
  tempProjectSummaryTasks.each(function(inRecord) {
    var resourceRecord = resourcesStore.getById(inRecord.get("resource"));
    if (resourceRecord &&
      Ext.isEmpty(tempProjectSummaryResources.getById(resourceRecord.id))) {
      tempProjectSummaryResources.add(resourceRecord.copy());
    }
  });

} // End showProjectSummary().


/**
 * Displays the task summary main panel and populates it.
 */
function showTaskSummary() {

  // Make the appropriate card visible.
  if (currentTask) {
    Ext.getCmp("mainCard").getLayout().setActiveItem(2);
    currentSummaryView = 2;
  } else {
    // This covers the case where the task was just deleted.
    Ext.getCmp("mainCard").getLayout().setActiveItem(0);
    return;
  }

  // Populate store for task details.
  tempTaskSummaryDetails.removeAll();
  var newRecord = currentTask.copy();
  newRecord.set("status", calculateStatus(currentTask.get("bookedtime"),
    currentTask.get("allocatedhours"), currentTask.get("enddate")));
  tempTaskSummaryDetails.add(newRecord);

  // Populate store for resource assigned to this task.
  tempResourceSummaryResource.removeAll();
  // For each task in the store, see if the resource is assigned to it.
  var assignedResource = resourcesStore.getById(currentTask.get("resource"));
  if (assignedResource) {
    tempResourceSummaryResource.add(assignedResource.copy());
  }

} // End showTaskSummary().


/**
 * Displays the resource summary main panel and populates it.
 */
function showResourceSummary() {

  // Make the appropriate card visible.
  if (currentResource) {
    Ext.getCmp("mainCard").getLayout().setActiveItem(3);
    currentSummaryView = 3;
  } else {
    // This covers the case where the resource was just deleted.
    Ext.getCmp("mainCard").getLayout().setActiveItem(0);
    return;
  }


  // Populate store for resource details.
  tempResourceSummaryDetails.removeAll();
  tempResourceSummaryDetails.add(currentResource.copy());

  // Populate store for projects resource is involved in.
  tempResourceSummaryProjects.removeAll();
  // For each task in the store, see if the resource is assigned to it.
  tasksStore.each(function(inRecord) {
    if (inRecord.get("resource") == currentResource.get("name")) {
      // Get the project record for the project associated with this task,
      // if there is one.
      var projectRecord = projectsStore.getById(inRecord.get("project"));
      // Add this project if it's not already in the temporary store.
      if (projectRecord &&
        Ext.isEmpty(tempResourceSummaryProjects.getById(projectRecord.id))) {
        // Add a copy of the project record.
        tempResourceSummaryProjects.add(projectRecord.copy());
      }
    }
  });

  // Populate store for tasks resource is assigned to.
  tempResourceSummaryTasks.removeAll();
  // For each task in the store, see if the resource is assigned to it.
  tasksStore.each(function(inRecord) {
    if (inRecord.get("resource") == currentResource.get("name")) {
      var newRecord = inRecord.copy();
      newRecord.set("status", calculateStatus(inRecord.get("bookedtime"),
        inRecord.get("allocatedhours"), inRecord.get("enddate")));
      tempResourceSummaryTasks.add(newRecord);
    }
  });

} // End showResoureSummary().


/**
 * This function is used to determine the status (the therefore what image
 * should be displayed in a summary status column) for a task or project.
 * The status can be OK, in danger (bookedtime within 10% of allocated hours)
 * or over hours, and in each of those cases it can be past due.  OK is
 * indicated by a green check, danger by a yellow warning sign and over hours
 * by a red X, and when past due it is one of those but flashing).
 *
 * @param  inBookedTime    The total amount of time booked to the task/project.
 * @param  inAllocatedTime The number of hours allocated to the task/project.
 * @param  inEndDate       The date the task/project was scheduled to be done.
 * @return                 HTML for an <img> tag with the appopriate status
 *                         image.
 */
function calculateStatus(inBookedTime, inAllocatedHours, inEndDate) {

  var status = 0;
  var statusImage = "<img src=\"img/statusOK.gif\">";
  // Determine if the task/project is in danger, or over allocated hours.
  if (inBookedTime < inAllocatedHours &&
    inBookedTime >= (inAllocatedHours * .9)) {
    status = 1;
  } else if (inBookedTime > inAllocatedHours) {
    status = 2;
  }
  // Determine if the task/project is past due.
  var endDate = Date.parseDate(inEndDate, "m/d/Y");
  if (new Date() > endDate) {
    // Past due.
    if (status == 0) {
      statusImage = "<img src=\"img/statusOKPastDue.gif\">";
    } else if (status == 1) {
      statusImage = "<img src=\"img/statusDangerPastDue.gif\">";
    } else if (status == 2) {
      statusImage = "<img src=\"img/statusOverPastDue.gif\">";
    }
  } else {
    // Not past due, but in danger or over hours.
    if (status == 1) {
      statusImage = "<img src=\"img/statusDanger.gif\">";
    } else if (status == 2) {
      statusImage = "<img src=\"img/statusOver.gif\">";
    }
  }
  return statusImage;

} // End calculateStatus().
