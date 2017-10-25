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
// Record descriptors and the function that creates them, plus data store defs.
//


/**
 * Project record descriptor.
 */
var ProjectRecord = Ext.data.Record.create([
  { name : "na", mapping : "name" },
  { name : "description", mapping : "description" },
  { name : "projectmanager", mapping : "projectmanager" },
  { name : "startdate", mapping : "startdate" },
  { name : "enddate", mapping : "enddate" },
  { name : "allocatedhours", mapping : "allocatedhours" },
  { name : "status", mapping : "status" }
]);


/**
 * Task record descriptor.
 */
var TaskRecord = Ext.data.Record.create([
  { name : "name", mapping : "name" },
  { name : "description", mapping : "description" },
  { name : "startdate", mapping : "startdate" },
  { name : "enddate", mapping : "enddate" },
  { name : "allocatedhours", mapping : "allocatedhours" },
  { name : "project", mapping : "project" },
  { name : "resource", mapping : "resource" },
  { name : "bookedtime", mapping : "bookedtime" },
  { name : "percentcomplete", mapping : "percentcomplete" },
  { name : "status", mapping : "status" }
]);


/**
 * Resource record descriptor.
 */
var ResourceRecord = Ext.data.Record.create([
  { name : "name", mapping : "name" },
  { name : "description", mapping : "description" },
  { name : "isaprojectmanager", mapping : "isaprojectmanager" }
]);


/**
 * Projects data store.
 */
var projectsStore = new Ext.data.Store({
  listeners : {
    "add" : {
      fn : function(inStore, inRecords, inIndex) {
        if (Ext.getCmp("dialogPleaseWait")) { return; }
        dao.createProject(inRecords[0]);
      }
    },
    "remove" : {
      fn : function(inStore, inRecord, inIndex) {
        dao.deleteProject(inRecord.get("name"));
      }
    },
    "update" : {
      fn : function(inStore, inRecord, inOperation) {
        dao.updateProject(inRecord);
      }
    }
  }
});


/**
 * Tasks data store.
 */
var tasksStore = new Ext.data.Store({
  listeners : {
    "add" : {
      fn : function(inStore, inRecords, inIndex) {
        if (Ext.getCmp("dialogPleaseWait")) { return; }
        dao.createTask(inRecords[0]);
      }
    },
    "remove" : {
      fn : function(inStore, inRecord, inIndex) {
        dao.deleteTask(inRecord.get("name"));
      }
    },
    "update" : {
      fn : function(inStore, inRecord, inOperation) {
        dao.updateTask(inRecord);
      }
    }
  }
});


/**
 * Resources data store.
 */
var resourcesStore = new Ext.data.Store({
  listeners : {
    "add" : {
      fn : function(inStore, inRecords, inIndex) {
        if (Ext.getCmp("dialogPleaseWait")) { return; }
        dao.createResource(inRecords[0]);
      }
    },
    "remove" : {
      fn : function(inStore, inRecord, inIndex) {
        dao.deleteResource(inRecord.get("name"));
      }
    },
    "update" : {
      fn : function(inStore, inRecord, inOperation) {
        dao.updateResource(inRecord);
      }
    }
  }
});


/**
 * Project managers data store.
 */
var projectManagersStore = new Ext.data.Store({});


/**
 * Available tasks data store.
 */
var availableTasksStore = new Ext.data.Store({});


/**
 * This is a temporary store that will be a copy of the availableTasksStore
 * when the Modify Project dialog is shown.
 */
var tempAvailableTasksStore = new Ext.data.Store({});


/**
 * This is a temporary store used on the Modify Project dialog to show the
 * tasks the project is using.
 */
var tempAllocatedTasksStore = new Ext.data.Store({});


/**
 * This is a temporary store used on the Modify Resource dialog to show the
 * tasks assigned to the resource.
 */
var tempAssignedTasksStore = new Ext.data.Store({});


/**
 * This is a temporary store used in the Resource Summary view to show the
 * details for the selected resource.
 */
var tempResourceSummaryDetails = new Ext.data.Store({});


/**
 * This is a temporary store used in the Resource Summary view to show the
 * projects the selected resource is involved with.
 */
var tempResourceSummaryProjects = new Ext.data.Store({});


/**
 * This is a temporary store used in the Resource Summary view to show the
 * tasks the selected resource is assigned to.
 */
var tempResourceSummaryTasks = new Ext.data.Store({});


/**
 * This is a temporary store used in the Task Summary view to show the
 * details for the selected task.
 */
var tempTaskSummaryDetails = new Ext.data.Store({});


/**
 * This is a temporary store used in the Task Summary view to show the
 * details for the resource assigned to the task.
 */
var tempResourceSummaryResource = new Ext.data.Store({});


/**
 * This is a temporary store used in the Project Summary view to show the
 * details for the selected project.
 */
var tempProjectSummaryDetails = new Ext.data.Store({});


/**
 * This is a temporary store used in the Project Summary view to show the
 * tasks allocated to this project.
 */
var tempProjectSummaryTasks = new Ext.data.Store({});


/**
 * This is a temporary store used in the Project Summary view to show the
 * resources involved with this project.
 */
var tempProjectSummaryResources = new Ext.data.Store({});
