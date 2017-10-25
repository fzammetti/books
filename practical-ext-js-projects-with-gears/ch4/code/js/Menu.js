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
// JSON that describes the menubar and its subcomponents.
//


var uioMenubar = {
  id : "mainMenu", region : "north", height : 26,
  items : [
    /* Project menu. */
    {
      text : "Project", menu : {
        items : [
          {
            text : "New Project",
            handler : function() {
              var dialogNewProject = Ext.getCmp("dialogNewProject");
              if (!dialogNewProject) {
                dialogNewProject = new Ext.Window(uioNewProjectWindow);
              }
              dialogNewProject.show(Ext.getDom("divSource"));
            }
          },
          "-",
          {
            text : "Delete Project", disabled : true,
            id : "menuProjectDeleteProject",
            handler : function() {
              var dialogDeleteProject = Ext.getCmp("dialogDeleteProject");
              if (!dialogDeleteProject) {
                dialogDeleteProject = new Ext.Window(uioDeleteProjectWindow);
              }
              dialogDeleteProject.show(Ext.getDom("divSource"));
            }
          },
          "-",
          {
            text : "Modify Project", disabled : true,
            id : "menuProjectModifyProject",
            handler : function() {
              var dialogModifyProject = Ext.getCmp("dialogModifyProject");
              if (!dialogModifyProject) {
                dialogModifyProject = new Ext.Window(uioModifyProjectWindow);
              }
              dialogModifyProject.show(Ext.getDom("divSource"));
            }
          }
        ]
      },
      listeners : {
        "render" : function(b) {
          b.el.child(b.menuClassTarget).removeClass("x-btn-with-menu");
        }
      }
    },
    /* Task menu. */
    {
      text : "Task", menu : {
        items : [
          {
            text : "New Task",
            handler : function() {
              var dialogNewTask = Ext.getCmp("dialogNewTask");
              if (!dialogNewTask) {
                dialogNewTask = new Ext.Window(uioNewTaskWindow);
              }
              dialogNewTask.show(Ext.getDom("divSource"));
            }
          },
          "-",
          {
            text : "Delete Task", disabled : true, id : "menuTaskDeleteTask",
            handler : function() {
              var dialogDeleteTask = Ext.getCmp("dialogDeleteTask");
              if (!dialogDeleteTask) {
                dialogDeleteTask = new Ext.Window(uioDeleteTaskWindow);
              }
              dialogDeleteTask.show(Ext.getDom("divSource"));
            }
          },
          "-",
          {
            text : "Modify Task", disabled : true,
            id : "menuTaskModifyTask",
            handler : function() {
              var dialogModifyTask = Ext.getCmp("dialogModifyTask");
              if (!dialogModifyTask) {
                dialogModifyTask = new Ext.Window(uioModifyTaskWindow);
              }
              dialogModifyTask.show(Ext.getDom("divSource"));
            }
          }
        ]
      },
      listeners : {
        "render" : function(b) {
          b.el.child(b.menuClassTarget).removeClass("x-btn-with-menu");
        }
      }
    },
    /* Resource menu. */
    {
      text : "Resource", menu : {
        items : [
          {
            text : "New Resource",
            handler : function() {
              var dialogNewResource = Ext.getCmp("dialogNewResource");
              if (!dialogNewResource) {
                dialogNewResource = new Ext.Window(uioNewResourceWindow);
              }
              dialogNewResource.show(Ext.getDom("divSource"));
            }
          },
          "-",
          {
            text : "Delete Resource", disabled : true,
            id : "menuResourceDeleteResource",
            handler : function() {
              var dialogDeleteResource = Ext.getCmp("dialogDeleteResource");
              if (!dialogDeleteResource) {
                dialogDeleteResource = new Ext.Window(uioDeleteResourceWindow);
              }
              dialogDeleteResource.show(Ext.getDom("divSource"));
            }
          },
          "-",
          {
            text : "Modify Resource", disabled : true,
            id : "menuResourceModifyResource",
            handler : function() {
              var dialogModifyResource = Ext.getCmp("dialogModifyResource");
              if (!dialogModifyResource) {
                dialogModifyResource = new Ext.Window(uioModifyResourceWindow);
              }
              dialogModifyResource.show(Ext.getDom("divSource"));
            }
          }
        ]
      },
      listeners : {
        "render" : function(b) {
          b.el.child(b.menuClassTarget).removeClass("x-btn-with-menu");
        }
      }
    },
    {
      text : "Help", menu : {
        items : [
          { text : "About TimekeeperExt",
            handler : function() {
              var dialogAbout = Ext.getCmp("dialogAbout");
              if (!dialogAbout) {
                dialogAbout = new Ext.Window({
                  applyTo : "dialogAbout", id : "dialogAbout", closable : true,
                  modal : true, width : 400, height : 320, minimizable : false,
                  resizable : false, draggable : false, shadowOffset : 8,
                  closeAction : "hide",
                  buttons : [{
                    text : "Ok",
                    handler : function() {
                      Ext.getCmp("dialogAbout").hide();
                    }
                  }]
                });
              }
              dialogAbout.show(Ext.getDom("divSource"));
            }
          }
        ]
      },
      listeners : {
        "render" : function(b) {
          b.el.child(b.menuClassTarget).removeClass("x-btn-with-menu");
        }
      }
    }
  ]
};
