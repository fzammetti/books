function Timekeeper() {


  /**
   * An object that stores handles to the various dialogs.
   */
  this.dialogs = new Object();


  /**
   * The ID of the user logged in.
   */
  this.currentUser = null;


  /**
   * A list of User objects representing all users known to Timekeeper.
   */
  this.users = null;


  /**
   * A list of Project objects representing all projects known to Timekeeper.
   */
  this.projects = null;


  /**
   * A list of TimesheetItem objects for all the time the current user has
   * booked.
   */
  this.timesheetItems = null;


  /**
   * The number of milliseconds in one day.
   */
  this.oneDay = 1000 * 60 * 60 * 24;


  /**
   * Count of messageboxes present.
   */
  this.msgCt = null;


  /**
   * Reference to the functions menu.
   */
  this.functionsMenu = null;


  /**
   * Initialize the user interface.
   */
  this.initUI = function() {

    Ext.QuickTips.init();

    timekeeper.functionsMenu = new Ext.menu.Menu({
      id : "functionsMenu",
      items: [
        { id : "functionsAdministerUsers", text : "Administer Users",
          disabled : true, handler : timekeeper.menuClickHandler },
        {id : "functionsAdministerProjects", text : "Administer Projects",
          disabled : true, handler : timekeeper.menuClickHandler },
        new Ext.menu.Separator({}),
        { id : "functionsManageProjects", text : "Manage Projects",
          disabled : true, handler : timekeeper.menuClickHandler }
      ]
    });

    // Create menubar.
    var tb = new Ext.Toolbar("divMenubar", [
      {
        text : "Functions", menu : timekeeper.functionsMenu
      },
      {
        text : "Help",
        menu : {
          id : "mnuHelp",
          items : [
            { text : "Using Timekeeper", handler : timekeeper.menuClickHandler },
            new Ext.menu.Separator({}),
            { text : "About Timekeeper", handler : timekeeper.menuClickHandler }
          ]
        }
      }
    ]); // End menu creation.

    // Create Administer Users dialog.
    if (timekeeper.dialogs["dialogAdministerUsers"] == null) {
      timekeeper.dialogs["dialogAdministerUsers"] =
        new Ext.BasicDialog("dialogAdministerUsers", {
          modal : false,
          width : 700,
          height : 310,
          shadow : true,
          shadowOffset : 10,
          proxyDrag: true
        }
      );
    }

    // Create Administer Projects dialog.
    if (timekeeper.dialogs["dialogAdministerProjects"] == null) {
      timekeeper.dialogs["dialogAdministerProjects"] =
        new Ext.BasicDialog("dialogAdministerProjects", {
          modal : false,
          width : 400,
          height : 285,
          shadow : true,
          shadowOffset : 10,
          proxyDrag: true
        }
      );
    }

    // Create Manage Projects dialog.
    if (timekeeper.dialogs["dialogManageProjects"] == null) {
      timekeeper.dialogs["dialogManageProjects"] =
        new Ext.BasicDialog("dialogManageProjects", {
          modal : false,
          width : 500,
          height : 360,
          shadow : true,
          shadowOffset : 10,
          proxyDrag: true
        }
      );
    }

    // Create Using Timekeeper dialog.
    if (timekeeper.dialogs["dialogUsingTimekeeper"] == null) {
      timekeeper.dialogs["dialogUsingTimekeeper"] =
        new Ext.BasicDialog("dialogUsingTimekeeper", {
          modal : false,
          width : 600,
          height : 500,
          shadow : true,
          shadowOffset : 10,
          proxyDrag: true
        }
      );
    }

  } // End initUI().


  /**
   * Called to initialize the application.
   *
   * @param inUserID The ID of the user logged in.
   */
  this.init = function(inUserID) {

    // Kick off DWR reverse-ajax (COMET).
    dwr.engine.setActiveReverseAjax(true);

    // Get the list of project managers.
    UserDAO.listUsers(
      { async : false,
        callback : function(inResp) {
          timekeeper.users = inResp;
          // Record current user.
          timekeeper.currentUser = timekeeper.getUserByID(inUserID);
        }
      }
    );

    // Disable menu items as appropriate.
    if (timekeeper.currentUser.isAdministrator) {
      timekeeper.functionsMenu.items.get("functionsAdministerUsers").enable();
      timekeeper.functionsMenu.items.get(
        "functionsAdministerProjects").enable();
    }
    if (timekeeper.currentUser.isProjectManager) {
      timekeeper.functionsMenu.items.get("functionsManageProjects").enable();
    }

    // Now batch up a bunch of calls to make it more efficient.
    timekeeper.updateData();

    // Set the dates on the book time list.
    var today = new Date();
    for (var i = 0; i < 7; i++) {
      var d = new Date();
      d.setTime(today.getTime() - (timekeeper.oneDay * i));
      d = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
      dwr.util.setValue("divHome_bookTimeList_today_" + i, d + "&nbsp;&nbsp;",
        { escapeHtml : false }
      );
    }

  } // End init().


  /**
   * Called to handle menubar clicks.
   *
   * @param inItem The menu item that was clicked.
   */
  this.menuClickHandler = function(inItem) {

    switch (inItem.text) {

      case "Administer Users": {
        timekeeper.dialogs["dialogAdministerUsers"].show(
          dwr.util.byId("divSource"));
      break; }

      case "Administer Projects": {
        timekeeper.dialogs["dialogAdministerProjects"].show(
          dwr.util.byId("divSource"));
      break; }

      case "Manage Projects": {
        timekeeper.dialogs["dialogManageProjects"].show(
          dwr.util.byId("divSource"));
      break; }

      case "Using Timekeeper": {
        timekeeper.dialogs["dialogUsingTimekeeper"].show(
          dwr.util.byId("divSource"));
      break; }

      case "About Timekeeper": {
        Ext.MessageBox.alert("About Timekeeper",
          "DWR Timekeeper v1.0" +
          "<br><br>" +
          "By Frank W. Zammetti" +
          "<br><br>" +
          "Practical DWR 2 Projects" +
          "<br><br>" +
          "ISBN: 1-59059-941-1" +
          "<br><br>" +
          "Published In January 2008" +
          "<br><br>" +
          "<a href=\"http://apress.com/book/search?" +
          "searchterm=zammetti&act=search\">" +
          "Click here for details" +
          "</a><br>", function(){}
        );
      break; }

    } // End switch.

  } // End menuClickHandler().


  /**
   * This function is called to update all data, and the screen with it.
   */
  this.updateData = function() {

    // Batch up a bunch of calls to make it more efficient.
    dwr.engine.beginBatch();
    timekeeper.updateUserList();
    timekeeper.getTimesheetItems();
    timekeeper.updateProjectList();
    dwr.engine.endBatch();

  } // End updateData().


  /**
   * This method shows a pretty little slide-down message to the user.
   * This was taken from the Ext JS examplea and modified a bit.
   *
   * @param inText The messag text.
   */
  this.showMessage = function(inText) {

    if (!timekeeper.msgCt) {
      timekeeper.msgCt = Ext.DomHelper.insertFirst(document.body,
        {id : "msg-div"}, true);
    }
    timekeeper.msgCt.alignTo(document, "t-t");
    var m = Ext.DomHelper.append(timekeeper.msgCt,
      { html :
        "<div class=\"msg\"><div class=\"x-box-tl\">" +
        "<div class=\"x-box-tr\"><div class=\"x-box-tc\"></div></div></div>" +
        "<div class=\"x-box-ml\"><div class=\"x-box-mr\">" +
        "<div class=\"x-box-mc\"><center>" + inText +
        "</center></div></div></div>" +
        "<div class=\"x-box-bl\"><div class=\"x-box-br\">" +
        "<div class=\"x-box-bc\"></div></div></div></div>"
      }, true);
    m.slideIn("t").pause(2).slideOut("t", {remove : true});

  } // End showMessage().


  // **************************************************************************
  // USER METHODS.
  // **************************************************************************


  /**
   * Called to reconstruct the user list(s).
   */
  this.updateUserList = function() {

    // Call server to get user list.
    UserDAO.listUsers(
      {
        callback : function(inResp) {
          timekeeper.users = inResp;
          // Clear existing lists.
          dwr.util.removeAllRows("divAdminUsers_userList");
          // ----- ADMIN SCREEN -----
          // Iterate over returned User objects.
          var cellFuncs = [
            function(data) { return data.split("~~")[0]; },
            function(data) { return data.split("~~")[1]; },
            function(data) { return data.split("~~")[2]; },
            function(data) { return data.split("~~")[3]; },
            function(data) { return data.split("~~")[4]; },
            function(data) { return data.split("~~")[5]; }
          ];
          for (var i = 0; i < inResp.length; i++) {
            // Add a row for each.
            dwr.util.addRows("divAdminUsers_userList",
              [
                "<input type=\"button\" value=\"Delete\" " +
                  "onClick=\"timekeeper.deleteUser('" +
                  inResp[i].id + "', '" + inResp[i].username + "');\">~~" +
                "<input type=\"text\" " +
                  "value=\"" + inResp[i].username + "\" " +
                  "onBlur=\"timekeeper.updateUser('username', '" +
                  inResp[i].id + "', this.value);\"" +
                  ">~~" +
                "<input type=\"text\" " +
                  "value=\"" + inResp[i].password + "\" " +
                  "onBlur=\"timekeeper.updateUser('password', '" +
                  inResp[i].id + "', this.value);\"" +
                  ">~~" +
                "<center><input type=\"checkbox\" " +
                  (inResp[i].isAdministrator ? "checked" : "") + " " +
                  "onBlur=\"timekeeper.updateUser('isAdministrator', '" +
                  inResp[i].id + "', this.checked);\"" +
                  "></center>~~" +
                "<center><input type=\"checkbox\" " +
                  (inResp[i].isProjectManager ? "checked" : "") + " " +
                  "onBlur=\"timekeeper.updateUser('isProjectManager', '" +
                  inResp[i].id + "', this.checked);\"" +
                  "></center>"
              ],
              cellFuncs, { escapeHtml : false }
            );
          }
          // ----- ADMIN SCREEN -----
          dwr.util.addRows("divAdminUsers_userList",
            [
              "<hr size=\"1\" color\"#000000\">~~" +
              "<hr size=\"1\" color\"#000000\">~~" +
              "<hr size=\"1\" color\"#000000\">~~" +
              "<hr size=\"1\" color\"#000000\">~~" +
              "<hr size=\"1\" color\"#000000\">~~" +
              "<hr size=\"1\" color\"#000000\">"
            ],
            cellFuncs, { escapeHtml : false }
          );
          // Add user addition row.
          dwr.util.addRows("divAdminUsers_userList",
            [
              "<input type=\"button\" value=\"Add\" " +
                "onClick=\"timekeeper.addUser();\">" + "~~" +
              "<input type=\"text\" " +
                "id=\"divAdminUsers_add_username\">" + "~~" +
              "<input type=\"text\" " +
                "id=\"divAdminUsers_add_password\">" + "~~" +
              "<center><input type=\"checkbox\" " +
                "id=\"divAdminUsers_add_isAdministrator\"></center>~~" +
              "<center><input type=\"checkbox\" " +
                "id=\"divAdminUsers_add_isProjectManager\"></center>"
            ],
            cellFuncs, { escapeHtml : false }
          );
        } // End callback function.
      } // End DWR options object.
    );

  } // End updateUserList().


  /**
   * Called to add a new user.
   */
  this.addUser = function() {

    var username = dwr.util.getValue("divAdminUsers_add_username");
    var password = dwr.util.getValue("divAdminUsers_add_password");

    if (username == "") {
      alert("Please enter a username");
      return;
    }
    if (password == "") {
      alert("Please enter a password");
      return;
    }

    UserDAO.addUser(
      username, password,
      dwr.util.getValue("divAdminUsers_add_isAdministrator"),
      dwr.util.getValue("divAdminUsers_add_isProjectManager"),
      {
        callback : function(inResp) {
          timekeeper.showMessage("User has been added");
          timekeeper.updateData();
        }
      }
    );

  } // End addUser().


  /**
   * Called to update a user.
   *
   * @param inFieldToUpdate The field to update.  One of "username", "password",
   *                        "isAdministrator" or "isProjectManager".
   * @param inID            The ID of the user to update.
   * @param inNewValue      The new value of the field being updated.
   */
  this.updateUser = function(inFieldToUpdate, inID, inNewValue) {

    // Validations.
    if (inFieldToUpdate == "isProjectManager") {
      for (var i = 0; i < timekeeper.projects.length; i++) {
        if (inID == timekeeper.projects[i].projectManager) {
          timekeeper.updateData();
          alert("User is assigned as project manager to project \"" +
            timekeeper.projects[i].name + "\"\n\nPlease unassigned the " +
            "user first.");
          return;
        }
      }
    }

    UserDAO.updateUser(inFieldToUpdate, inID, inNewValue,
      {
        callback : function(inResp) {
          timekeeper.showMessage("User has been updated");
          timekeeper.updateData();
        }
      }
    );

  } // End updateUser().


  /**
   * Called to delete a user.
   *
   * @param inID       The ID of the user to delete.
   * @param inUsername The name of the user to delete.
   */
  this.deleteUser = function(inID, inUsername) {

    // Validations.
    if (inID == timekeeper.currentUser.id) {
      alert("You cannot delete yourself");
      return;
    }
    for (var i = 0; i < timekeeper.projects.length; i++) {
      if (inID == timekeeper.projects[i].projectManager) {
        alert("User is assigned as project manager to project \"" +
          timekeeper.projects[i].name + "\"\n\nPlease unassigned the " +
          "user first.");
        return;
      }
    }

    if (confirm(
      "Are you sure you want to delete the user " + inUsername + "?")) {
      UserDAO.deleteUser(inID,
        {
          callback : function(inResp) {
            timekeeper.showMessage("User has been deleted");
            timekeeper.updateData();
          }
        }
      );
    }

  } // End deleteUser().


  /**
   * Returns a User object by user ID.
   *
   * @param  inUserID The ID to search for.
   * @return          The corresponding User object, or null if not found.
   */
  this.getUserByID = function(inUserID) {

    for (var i = 0; i < timekeeper.users.length; i++) {
      if (timekeeper.users[i].id == inUserID) {
        return timekeeper.users[i];
      }
    }
    return null;

  } // End getUserByID().


  /**
   * Determines if a given user ID is assigned to a given project.
   *
   * @param  inProject The Project object to check.
   * @param  inUserID  The ID of the user to check.
   * @return           True if the user is assigned to the project, false
   *                   if not.
   */
  this.isUserAssignedToProject = function(inProject, inUserID) {

    var assignedUserIDs = inProject.usersAssigned.split(",");
    for (var i = 0; i < assignedUserIDs.length; i++) {
      if (assignedUserIDs[i] == inUserID) {
        return true;
      }
    }
    return false;

  } // End isUserAssignedToProject().


  // **************************************************************************
  // PROJECT METHODS.
  // **************************************************************************


  /**
   * Called to reconstruct the project list(s).
   */
  this.updateProjectList = function() {

    // Call server to get project list.
    ProjectDAO.listAllProjects(
      {
        callback : function(inResp) {

          // Remove all rows from tables to be updated.
          dwr.util.removeAllRows("divHome_projectOverviewList");
          dwr.util.removeAllRows("divHome_bookTimeList");
          dwr.util.removeAllRows("divAdminProjects_projectList");
          dwr.util.removeAllRows("divManageProjects_projectList");

          // Record list of projects returned.
          timekeeper.projects = inResp;

          // The dayTotals array will keep tabs on how many hours the current
          // used has booked for all projects for each day of the reporting
          // period.
          var dayTotals = new Array();
          for (var j = 0; j < 7; j++) {
            dayTotals.push(0);
          }

          // Iterate over returned Project objects.
          var altRow = false;
          for (var i = 0; i < inResp.length; i++) {
            var project = inResp[i];
            var targetDate = (project.targetDate.getMonth() + 1) + "/" +
              project.targetDate.getDate() + "/" +
              project.targetDate.getFullYear();
            var isUserAssignedToProject = timekeeper.isUserAssignedToProject(
              project, timekeeper.currentUser.id);

            // ----- HOME SCREEN PROJECT OVERVIEW -----
            var cellFuncs = [
              function(data) { return data.split("~~")[0]; },
              function(data) { return data.split("~~")[1]; },
              function(data) { return data.split("~~")[2]; },
              function(data) { return data.split("~~")[3]; },
              function(data) { return data.split("~~")[4]; },
              function(data) { return data.split("~~")[5]; }
            ];
            if (timekeeper.currentUser.isAdministrator ||
              timekeeper.currentUser.id == project.projectManager ||
              isUserAssignedToProject) {
              dwr.util.addRows("divHome_projectOverviewList",
                [
                  project.name + "&nbsp;&nbsp;~~" +
                  timekeeper.getUserByID(
                    project.projectManager).username + "~~" +
                  project.allocatedHours + "~~" +
                  project.bookedHours + "~~" +
                  targetDate + "~~" +
                    timekeeper.calculateProjectStatus(project.allocatedHours,
                    project.bookedHours, project.targetDate) + ""
                ],
                cellFuncs,
                { escapeHtml : false, altRow : altRow,
                  rowCreator : function(inOptions) {
                    var cn = null;
                    if (inOptions.altRow) {
                      cn = "cssTableAltRow";
                    } else {
                      cn = "cssTableRow";
                    }
                    var tr = document.createElement("tr");
                    tr.setAttribute("class", cn);
                    tr.setAttribute("valign", "middle");
                    return tr;
                  }
                }
              );
              altRow = !altRow;
            }

            // ----- HOME SCREEN BOOK TIME -----
            var cellFuncs = [
              function(data) { return data.split("~~")[0]; },
              function(data) { return data.split("~~")[1]; },
              function(data) { return data.split("~~")[2]; },
              function(data) { return data.split("~~")[3]; },
              function(data) { return data.split("~~")[4]; },
              function(data) { return data.split("~~")[5]; },
              function(data) { return data.split("~~")[6]; },
              function(data) { return data.split("~~")[7]; },
              function(data) { return data.split("~~")[8]; }
            ];
            if (timekeeper.currentUser.id == project.projectManager ||
              isUserAssignedToProject) {
              // Get the number of hours booked to this project for this period
              // and this user.  Also, calculate the total hours for this
              // project in this period.
              var hoursBooked = new Array();
              var projectHours = 0;
              for (var j = 0; j < 7; j++) {
                var d = new Date();
                d.setTime(d - (timekeeper.oneDay * j));
                d.setHours(0, 0, 0, 0);
                var timesheetItem = timekeeper.getBookedTimeForProjectByDate(
                  project.id, d)
                hoursBooked.push(timesheetItem);
                if (timesheetItem != null) {
                  projectHours += timesheetItem.hours;
                  dayTotals[j] += timesheetItem.hours;
                }
              }
              dwr.util.addRows("divHome_bookTimeList",
                [
                  project.name + "&nbsp;&nbsp;~~" +
                  "<input type=\"text\" size=\"3\" maxlength=\"2\" " +
                    "value=\"" + (hoursBooked[6] ? hoursBooked[6].hours : "0") +
                    "\" onBlur=\"timekeeper.saveTimesheetItem('" + project.id +
                    "', 6, this.value);\"\">~~" +
                  "<input type=\"text\" size=\"3\" maxlength=\"2\" " +
                    "value=\"" + (hoursBooked[5] ? hoursBooked[5].hours : "0") +
                    "\" onBlur=\"timekeeper.saveTimesheetItem('" + project.id +
                    "', 5, this.value);\"\">~~" +
                  "<input type=\"text\" size=\"3\" maxlength=\"2\" " +
                    "value=\"" + (hoursBooked[4] ? hoursBooked[4].hours : "0") +
                    "\" onBlur=\"timekeeper.saveTimesheetItem('" + project.id +
                    "', 4, this.value);\"\">~~" +
                  "<input type=\"text\" size=\"3\" maxlength=\"2\" " +
                    "value=\"" + (hoursBooked[3] ? hoursBooked[3].hours : "0") +
                    "\" onBlur=\"timekeeper.saveTimesheetItem('" + project.id +
                    "', 3, this.value);\"\">~~" +
                  "<input type=\"text\" size=\"3\" maxlength=\"2\" " +
                    "value=\"" + (hoursBooked[2] ? hoursBooked[2].hours : "0") +
                    "\" onBlur=\"timekeeper.saveTimesheetItem('" + project.id +
                    "', 2, this.value);\"\">~~" +
                  "<input type=\"text\" size=\"3\" maxlength=\"2\" " +
                    "value=\"" + (hoursBooked[1] ? hoursBooked[1].hours : "0") +
                    "\" onBlur=\"timekeeper.saveTimesheetItem('" + project.id +
                    "', 1, this.value);\"\">~~" +
                  "<input type=\"text\" size=\"3\" maxlength=\"2\" " +
                    "value=\"" + (hoursBooked[0] ? hoursBooked[0].hours : "0") +
                    "\" onBlur=\"timekeeper.saveTimesheetItem('" + project.id +
                    "', 0, this.value);\"\">~~" +
                  projectHours
                ],
                cellFuncs,
                { escapeHtml : false,
                  rowCreator : function(inOptions) {
                    var tr = document.createElement("tr");
                    tr.setAttribute("class", "cssTableRow");
                    tr.setAttribute("valign", "middle");
                    return tr;
                  }
                }
              );
            }

            // ----- PROJECT ADMIN SCREEN -----
            // Add a row for each.
            var cellFuncs = [
              function(data) { return data.split("~~")[0]; },
              function(data) { return data.split("~~")[1]; },
              function(data) { return data.split("~~")[2]; }
            ];
            dwr.util.addRows("divAdminProjects_projectList",
              [
                "<input type=\"button\" value=\"Delete\" " +
                  "onClick=\"timekeeper.deleteProject('" +
                  project.id + "', '" + project.name + "');\">" + "~~" +
                "<input type=\"text\" size=\"20\" " +
                  "value=\"" + project.name + "\" " +
                  "onBlur=\"timekeeper.updateProject('name', '" +
                  project.id + "', this.value);\">~~" +
                "<select id=\"divAdminProjects_edit_pm_" + project.id +
                  "\" onBlur=\"timekeeper.updateProject('projectManager', '" +
                  project.id + "', this.value);\"></select>"
              ],
              cellFuncs, { escapeHtml : false }
            );
            // Now add list of PM's.
            for (var j = 0; j < timekeeper.users.length; j++) {
              if (timekeeper.users[j].isProjectManager) {
                dwr.util.addOptions("divAdminProjects_edit_pm_" + project.id,
                  [ { value : timekeeper.users[j].id,
                      text : timekeeper.users[j].username } ],
                  "value", "text"
                );
              }
            }
            // Select the PM for this project.
            dwr.util.setValue("divAdminProjects_edit_pm_" + project.id,
              project.projectManager);

            // ----- MANAGE PROJECTS SCREEN -----
            // Add a row for each.
            if (project.projectManager == timekeeper.currentUser.id) {
              var cellFuncs = [
                function(data) { return data.split("~~")[0]; },
                function(data) { return data.split("~~")[1]; },
                function(data) { return data.split("~~")[2]; },
                function(data) { return data.split("~~")[3]; }
              ];
              dwr.util.addRows("divManageProjects_projectList",
                [
                  project.name + "~~" +
                  "<input type=\"text\" size=\"3\" maxlength=\"3\" " +
                    "value=\"" + project.allocatedHours + "\" " +
                    "onBlur=\"timekeeper.updateProject('allocatedHours', '" +
                    project.id + "', this.value);\">~~" +
                  "<input type=\"text\" size=\"11\" maxlength=\"10\" " +
                    "value=\"" + targetDate + "\" " +
                    "onBlur=\"timekeeper.updateProject('targetDate', '" +
                    project.id + "', this.value);\">~~" +
                  "<select id=\"divManageProjects_edit_ua_" + project.id +
                    "\" onBlur=\"timekeeper.updateProject('usersAssigned', '" +
                    project.id + "', " +
                    "dwr.util.getValue('divManageProjects_edit_ua_" +
                    project.id + "').toString());\" multiple " +
                    "size=\"4\"></select>"
                ],
                cellFuncs, { escapeHtml : false }
              );
              // Now add list of users.
              for (var j = 0; j < timekeeper.users.length; j++) {
                dwr.util.addOptions("divManageProjects_edit_ua_" + project.id,
                  [ { value : timekeeper.users[j].id,
                      text : timekeeper.users[j].username } ],
                  "value", "text"
                );
              }
              // Select the user(s) assigned to this project.
              var usersAssigned = project.usersAssigned;
              if (usersAssigned != "") {
                usersAssigned = usersAssigned.split(",");
                for (var j = 0; j < usersAssigned.length; j++) {
                  dwr.util.setValue("divManageProjects_edit_ua_" + project.id,
                    usersAssigned[j]);
                }
              }
            }

          } // End iteration over projects collection.

          // The following are single lines that need to be added to some
          // tables.

          // Add project addition row to project admin scren.
          var cellFuncs = [
            function(data) { return data.split("~~")[0]; },
            function(data) { return data.split("~~")[1]; },
            function(data) { return data.split("~~")[2]; }
          ];
          dwr.util.addRows("divAdminProjects_projectList",
            [
              "<hr size=\"1\" color\"#000000\">~~" +
              "<hr size=\"1\" color\"#000000\">~~" +
              "<hr size=\"1\" color\"#000000\">"
            ],
            cellFuncs, { escapeHtml : false }
          );
          dwr.util.addRows("divAdminProjects_projectList",
            [
              "<input type=\"button\" value=\"Add\" " +
                "onClick=\"timekeeper.addProject();\">" + "~~" +
              "<input type=\"text\" " +
                "id=\"divAdminProjects_add_name\">" + "~~" +
              "<select id=\"divAdminProjects_add_projectManager\"></select>"
            ],
            cellFuncs, { escapeHtml : false }
          );

          // Now add list of PM's to the project add row.
          for (var j = 0; j < timekeeper.users.length; j++) {
            if (timekeeper.users[j].isProjectManager) {
              dwr.util.addOptions("divAdminProjects_add_projectManager",
                [ { value : timekeeper.users[j].id,
                    text : timekeeper.users[j].username } ],
                "value", "text"
              );
            }
          }

          // Add day totals line to book time on home screen.
          var cellFuncs = [
            function(data) { return data.split("~~")[0]; },
            function(data) { return data.split("~~")[1]; },
            function(data) { return data.split("~~")[2]; },
            function(data) { return data.split("~~")[3]; },
            function(data) { return data.split("~~")[4]; },
            function(data) { return data.split("~~")[5]; },
            function(data) { return data.split("~~")[6]; },
            function(data) { return data.split("~~")[7]; },
            function(data) { return data.split("~~")[8]; }
          ];
          // Divider row first.
          dwr.util.addRows("divHome_bookTimeList",
            [
              "&nbsp;~~" +
              "<hr size=\"1\" color\"#000000\">~~" +
              "<hr size=\"1\" color\"#000000\">~~" +
              "<hr size=\"1\" color\"#000000\">~~" +
              "<hr size=\"1\" color\"#000000\">~~" +
              "<hr size=\"1\" color\"#000000\">~~" +
              "<hr size=\"1\" color\"#000000\">~~" +
              "<hr size=\"1\" color\"#000000\">~~" +
              "&nbsp;"
            ],
            cellFuncs, { escapeHtml : false }
          );
          // Now totals row.
          dwr.util.addRows("divHome_bookTimeList",
            [
              "&nbsp;~~" + dayTotals[6] + "~~" + dayTotals[5] + "~~" +
              dayTotals[4] + "~~" + dayTotals[3] + "~~" + dayTotals[2] + "~~" +
              dayTotals[1] + "~~" + dayTotals[0] + "~~" + "&nbsp;"
            ],
            cellFuncs,
            { escapeHtml : false,
              rowCreator : function(inOptions) {
                var tr = document.createElement("tr");
                tr.setAttribute("class", "cssTableRow");
                tr.setAttribute("valign", "middle");
                return tr;
              }
            }
          );

        } // End callback function.

      } // End DWR options object.

    );

  } // End updateProjectList().


  /**
   * Called to add a new project.
   */
  this.addProject = function() {

    var name = dwr.util.getValue("divAdminProjects_add_name");
    var projectManager =
      dwr.util.getValue("divAdminProjects_add_projectManager");

    if (name == "") {
      alert("Please enter a name");
      return;
    }
    if (projectManager == "") {
      alert("Please select a project manager");
      return;
    }

    ProjectDAO.addProject(name, projectManager,
      {
        callback : function(inResp) {
          timekeeper.showMessage("Project has been added");
          timekeeper.updateData();
        }
      }
    );

  } // End addProject().


  /**
   * Called to update a project.
   *
   * @param inFieldToUpdate The field to update.  One of "username", "password",
   *                        "isAdministrator" or "isProjectManager".
   * @param inID            The ID of the user to update.
   * @param inNewValue      The new value of the field being updated.
   */
  this.updateProject = function(inFieldToUpdate, inID, inNewValue) {

    ProjectDAO.updateProject(inFieldToUpdate, inID, inNewValue,
      {
        callback : function(inResp) {
          timekeeper.showMessage("Project has been updated");
          timekeeper.updateData();
        }
      }
    );

  } // End updateProject().


  /**
   * Called to delete a project.
   *
   * @param inID   The ID of the project to delete.
   * @param inName The name of the project to delete.
   */
  this.deleteProject = function(inID, inName) {

    if (confirm(
      "Are you sure you want to delete the project " + inName + "?")) {
      ProjectDAO.deleteProject(inID,
        {
          callback : function(inResp) {
            timekeeper.showMessage("Project has been deleted");
            timekeeper.updateData();
          }
        }
      );
    }

  } // End deleteProject().



  /**
   * This method calculates whether a given project is on time, in danger of
   * not hitting its target date, or already late.
   *
   * @param  inAllocatedHours The number of hours allocated to the project.
   * @param  inBookedHours    The number of hours booked to the project so far.
   * @param  inTargetDate     The date the project is expected to finish up.
   * @return                  A string of HTML to insert into the project
   *                          status table on the home page telling the
   *                          current status of the project.
   */
  this.calculateProjectStatus = function (inAllocatedHours,
    inBookedHours, inTargetDate) {

      var today = new Date();
      var daysUntilTarget =
        Math.ceil((inTargetDate.getTime() - today.getTime()) /
        (timekeeper.oneDay));
      var hoursUntilTarget = daysUntilTarget * 8;
      var allocatedHoursLeft = inAllocatedHours - inBookedHours;
      // If no allocated hours set yet, this doesn't apply.
      if (inAllocatedHours == 0) {
        return "<center>n/a</center>";
      }
      // There's less hours allocated than there are hours until the target
      // date, so project is on time (under budget actually).
      if (allocatedHoursLeft < hoursUntilTarget) {
        return "<center>" +
          "<img src=\"img/ok.gif\">" + "</center>";
      }
      // There's more hours allocated than there are hours until the target
      // date, so project is late.
      if (allocatedHoursLeft > hoursUntilTarget) {
        return "<center>" +
          "<img src=\"img/late.gif\">" + "</center>";
      }
      // The allocated hours match the number of hours remaining until the
      // target date exactly, so we'll consider this borderline because it
      // could wind up going either way in the end.
      if (allocatedHoursLeft == hoursUntilTarget) {
        return "<center>" +
          "<img src=\"img/borderline.gif\">" + "</center>";
      }

  } // End calculateProjectStatus().


  // **************************************************************************
  // TIMESHEET METHODS.
  // **************************************************************************


  /**
   * Get all the TimesheetItem objects for the current user.
   *
   */
  this.getTimesheetItems = function() {

    TimesheetDAO.getTimesheetItems(timekeeper.currentUser.id,
      { callback : function(inResp) {
          timekeeper.timesheetItems = inResp;
        }
      }
    );

  } // End getTimesheetItems().


  /**
   * Returns the hours booked for a given project on a given date for the
   * current user.
   *
   * @param  inProjectID The ID of the project.
   * @param  inDate      A Date object for the date to retrieve.
   * @return             The number of hours, or 0 if none found.
   */
  this.getBookedTimeForProjectByDate = function(inProjectID, inDate) {

    inDate.setHours(0, 0, 0, 0);
    if (timekeeper.timesheetItems) {
      for (var i = 0; i < timekeeper.timesheetItems.length; i++) {
        if (timekeeper.timesheetItems[i].projectID == inProjectID &&
          timekeeper.timesheetItems[i].reportDate.getTime() ==
          inDate.getTime()) {
          return timekeeper.timesheetItems[i];
        }
      }
    }
    return null;

  } // End getBookedTimeForProjectByDate().


  /**
   * Called to save a modified hours for a given project for the current user.
   *
   * @param inProjectID The ID of the project to save the time for.
   * @param inDayDiff   The number of days to go back from today's date.
   * @param inHours     The number of hours entered.
   */
  this.saveTimesheetItem = function(inProjectID, inDayDiff, inHours) {

    // Get a Date object based on today's date and the dayDiff value, and
    // "normalize" the time component.
    var d = new Date();
    d.setTime(d - (timekeeper.oneDay * inDayDiff));
    d.setHours(0, 0, 0, 0);

    // Get the existing TimesheetItem, if one exists.
    var item = timekeeper.getBookedTimeForProjectByDate(inProjectID, d);

    // If it was found, update it, otherwise add it.
    if (item) {
      TimesheetDAO.updateItem(item.id, inHours,
        { callback : function(inResp) {
            timekeeper.showMessage("Time has been booked");
            timekeeper.updateData();
          }
        }
      );
    } else {
      TimesheetDAO.addItem(timekeeper.currentUser.id, inProjectID, d, inHours,
        { callback : function(inResp) {
            timekeeper.showMessage("Time has been booked");
            timekeeper.updateData();
          }
        }
      );
    }

  } // End saveTimesheetItem().


} // End Timekeeper class.


// The one and only instance of Timekeeper.
timekeeper = new Timekeeper();
Ext.onReady(timekeeper.initUI, timekeeper, true);