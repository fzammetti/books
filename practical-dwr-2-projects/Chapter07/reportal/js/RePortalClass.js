function RePortalClass() {


  /**
   * Username of user currently logged in, null if not logged in.
   */
  this.username = null;


  /**
   * Initialize the portal.
   *
   * @param If the user is already logged in, the username from session will be
   *        passed in.
   */
  this.init = function(inUsername) {

    // Configure exception handler for DWR.
    dwr.engine.setErrorHandler(RePortal.exceptionHandler);

    // Update username, if present.
    if (inUsername != "") {
      this.username = inUsername;
      dwr.util.setValue("spanUsername", RePortal.username);
      dwr.util.byId("divNotLoggedInMessage").style.display = "none";
      dwr.util.byId("divReportScheduling").style.display = "";
      dwr.util.byId("divReportMaintenance").style.display = "";
      dwr.util.byId("divGroupAdministration").style.display = "";
      dwr.util.byId("divUserAdministration").style.display = "";
    }

    // Populate report lists.
    ReportWorker.getReportsList(
      { callback : RePortal.updateReportListCallback }
    );

    // Populate group lists.
    GroupWorker.getGroupsList(
      { callback : RePortal.updateGroupsListCallback }
    );

    // Populate user lists.
    UserWorker.getUsersList( { callback : RePortal.updateUserListCallback } );

    // Populate the favorites for the current user, if any.
    FavoritesWorker.getFavoritesForUser(this.username,
      { callback : RePortal.updateFavoritesCallback }
    );

    // Populate scheduled report lists, but do so on a set 15-second interval.
    setInterval("ReportSchedulingWorker.getScheduledReportsList(" +
      "{ callback : RePortal.updateScheduledReportListCallback } );", 15000);
    // Oh yeah, and since we don't want to wait 15 seconds for the first
    // update, fire it manually now.
    ReportSchedulingWorker.getScheduledReportsList(
      { callback : RePortal.updateScheduledReportListCallback }
    );

    // Populate the list of data sources.
    ReportRunner.getDataSourceList(
      { callback : function(inList) {
          dwr.util.removeAllOptions("reportMaintenance_addDataSource");
          for (var i = 0; i < inList.length; i++) {
            dwr.util.addOptions("reportMaintenance_addDataSource",
              [ inList[i].name ]
            );
          }
        }
      }
    );

  } // End init().


  /**
   * This is called to handle any exception thrown on the server-side.
   *
   * @param inMessage The message returned by the server.
   */
  this.exceptionHandler = function(inMessage) {

    alert("An exception occurred.  Message from server was:\n\n" + inMessage);

  } // End exceptionHandler().


  // ========================================================================
  // ========================== SECTIONS FUNCTIONS ==========================
  // ========================================================================

  /**
   * Removes a section from the users' view.
   */
  this.removeSection = function(inSectionName) {

    // Update user profile on server and update UI
    if (confirm("Are you sure you want to close that section?")) {
      new Effect.Fade(document.getElementById(inSectionName));
    }

  } // End removeSection().


  /**
   * Expands a section.
   */
  this.expandSection = function(inSectionName) {

    // Update user profile on server and update UI
    document.getElementById(inSectionName).style.height = "";
    new Effect.BlindDown(document.getElementById(inSectionName));

  } // End expandSection().


  /**
   * Collapses a section.
   */
  this.collapseSection = function(inSectionName) {

    // Update user profile on server and update UI
    new Effect.BlindUp(document.getElementById(inSectionName), {
      afterFinish : function(inObj) {
       inObj.element.style.height = "40px";
       inObj.element.style.display = "block";
      },
      afterUpdate : function(inObj) {
        if (parseInt(inObj.element.style.height.replace("px", "")) < 40) {
          inObj.element.style.height = "40px";
        }
      }
    });

  } // End collapseSection().


  /**
   * Shows or hides an add section.
   */
  this.showHideAddSection = function(inDivID) {

    var section = document.getElementById(inDivID);
    if (section.style.display == "") {
      new Effect.Shrink(document.getElementById(inDivID));
    } else {
      new Effect.Grow(document.getElementById(inDivID));
    }

  } // End showHideAddSection().


  // ========================================================================
  // ========================== FAVORITES FUNCTIONS =========================
  // ========================================================================

  /**
   * Callback function executed when favorites list is returned by server (or
   * manually called when a favorite is added).
   *
   * @param inList The list of favorites as returned by the server, or null if
   *               none.  When the list is provided, the server is not called
   *               to get the list, inList is used instead.
   */
  this.updateFavoritesCallback = function(inList) {

    if (inList != null) {

      // Remove any existing favorites in the list.
      dwr.util.removeAllOptions("favorites_favoritesList");

      // This is the formatter function that will be used when adding the
      // favorites to the list.
      var formatter = function(inData) {
        var vals = inData.split("~~");
        return "<img src=\"img/icoDelete.gif\" align=\"absmiddle\" " +
          "style='cursor:pointer;'" +
          "onClick=\"RePortal.removeReportFromFavorites('" +
          vals[0] + "');\"" +
          ">&nbsp;<a href=\"javascript:void(0)\" " +
          "onClick=\"RePortal.runReport('" + vals[0] + "');\">" +
          vals[0] + "</a> - " + vals[1];
      };

      // Iterate over favorites returned.  Each is a report name.
      for (var i = 0; i < inList.length; i++) {
        // Add to list, using formatter function.
        dwr.util.addOptions("favorites_favoritesList",
          [ inList[i] ], formatter, { escapeHtml : false }
        );
      }

    }

  } // End updateFavoritesCallback().


  /**
   * Called to add a selected report to the current users' favorites.
   */
  this.addReportToFavorites = function() {

    // Only add favorite if user is logged in.
    if (this.username == null) {
      alert("Sorry, you must be logged on to add favorites");
      return;
    }

    // Get selected report, if any.
    var reportName = dwr.util.getValue("favorites_reportsList");

    // Some quick validations.
    if (reportName == "") {
      alert("Sorry, you must select a report first");
      return;
    }

    // Split value so we have just the report name.
    reportName = reportName.split("~~")[0];

    // Call the server to do the add.
    FavoritesWorker.addReportToFavorites(this.username, reportName,
      { callback : RePortal.updateFavoritesCallback }
    );

  } // End addReportToFavorites().


  /**
   * Called to remove a selected report from the current users' favorites.
   *
   * @param inReportName The name of the report to remove from favorites.
   */
  this.removeReportFromFavorites = function(inReportName) {

    // Verify removal.
    if (confirm("Are you sure you want to remove favorite for report '" +
      inReportName + "'?")) {
      // Call the server to do the remove.
      FavoritesWorker.removeReportFromFavorites(this.username, inReportName,
        { callback : RePortal.updateFavoritesCallback }
      );
    }

  } // End removeReportFromFavorites().


  /**
   * Called when a report is selected in the add favorites list.
   */
  this.favoritesDisplayReportInfo = function(inSelectValue) {

    // The value passed in is in the from "reportName~~description", so split it
    // and set the appropriate fields.
    var vals = inSelectValue.split("~~");

    document.getElementById("favorites_reportDescription").innerHTML = vals[1];
    new Effect.Highlight(
      document.getElementById("favorites_reportDescription"));

  } // End displayGroupInfo().


  // ========================================================================
  // ========================= SCHEDULING FUNCTIONS =========================
  // ========================================================================

  /**
   * Callback function executed when scheduled report list is returned by server
   *  (or manually called when a report is added).
   *
   * @param inList The list of scheduld reports as returned by the server, or
   *               null if none.  When the list is provided, the server is not
   *               called to get the list, inList is used instead.
   */
  this.updateScheduledReportListCallback = function(inList) {

    // Remove any existing reports in the list.
    dwr.util.removeAllRows("reportScheduling_reportList");

    // This is the collection of functions that will be called in sequence
    // for each row we add to the table.  The data passed in is a list
    // of data for each report, reportName, daysOfWeek, runTime, scheduleBy
    // and lastRun in that order, so we need to split this list (on the
    // double-tilde sequence, which is our delimiter) and return the
    // appropriate portion for each cell.
    var cellFuncs = [
      function(data) {
        var vals = data.split("~~");
        return "<img src=\"img/icoDelete.gif\" align=\"absmiddle\" " +
        "style='cursor:pointer;'" +
        "onClick=\"RePortal.removeReportFromSchedule('" +
        vals[0] + "', '" + vals[1] + "', '" + vals[2] + "');\"" +
        ">&nbsp;" + vals[0];
      },
      function(data) { return data.split("~~")[1]; },
      function(data) {
        // Add a leading zero if the hour is less than 10.
        var runTime = data.split("~~")[2];
        var hour = runTime.split(":")[0];
        var minute = runTime.split(":")[1];
        runTime = "";
        if (parseInt(hour) < 10) {
          runTime += "0";
        }
        runTime += hour;
        runTime += ":";
        if (parseInt(minute) < 10) {
          runTime += "0";
        }
        runTime += minute;
        return runTime;
      },
      function(data) { return data.split("~~")[3]; },
      function(data) { return data.split("~~")[4]; }
    ];

    // Iterate over ReportScheduleDescriptors returned.
    for (var i = 0; i < inList.length; i++) {
      // Add item to table for each.  Note: need escapeHtml set to false or
      // we'll just see the HTML in the cell.
      var lastRun = inList[i].lastRun;
      if (lastRun == null) {
        lastRun = "None";
      } else {
        lastRun = "<a href=\"javascript:void(0);\" " +
        "onClick=\"RePortal.viewScheduledRun('" +
        inList[i].reportName + "', '" + inList[i].daysOfWeek + "', '" +
        inList[i].runTime.getHours() + ":" + inList[i].runTime.getMinutes() +
        "');\">" + inList[i].lastRunStatus + " - " + lastRun + "</a>";
      }
      dwr.util.addRows("reportScheduling_reportList",
        [ inList[i].reportName + "~~" + inList[i].daysOfWeek + "~~" +
          inList[i].runTime.getHours() + ":" + inList[i].runTime.getMinutes() +
          "~~" + inList[i].scheduledBy +
          "~~" + lastRun ], cellFuncs, { escapeHtml : false }
      );
    }

  } // End updateScheduledReportListCallback().


  /**
   * Called to add a selected report to the scheduler.
   */
  this.addReportToSchedule = function() {

    // Get hours and minutes, and validate.
    var hours = null;
    var minutes = null;
    hours = parseInt(dwr.util.getValue("reportScheduling_addHour"));
    minutes = parseInt(dwr.util.getValue("reportScheduling_addMinute"));
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      alert("Sorry, the time you entered is not in a valid form");
      return;
    }

    // Construct a ReportScheduleDescriptor object from the input parameters.
    var daysOfWeek = "";
    if (dwr.util.getValue("reportScheduling_addSunday")) {
      if (daysOfWeek != "") { daysOfWeek += ","; } daysOfWeek += "Sun";
    }
    if (dwr.util.getValue("reportScheduling_addMonday")) {
      if (daysOfWeek != "") { daysOfWeek += ","; } daysOfWeek += "Mon";
    }
    if (dwr.util.getValue("reportScheduling_addTuesday")) {
      if (daysOfWeek != "") { daysOfWeek += ","; } daysOfWeek += "Tue";
    }
    if (dwr.util.getValue("reportScheduling_addWednesday")) {
      if (daysOfWeek != "") { daysOfWeek += ","; } daysOfWeek += "Wed";
    }
    if (dwr.util.getValue("reportScheduling_addThursday")) {
      if (daysOfWeek != "") { daysOfWeek += ","; } daysOfWeek += "Thu";
    }
    if (dwr.util.getValue("reportScheduling_addFriday")) {
      if (daysOfWeek != "") { daysOfWeek += ","; } daysOfWeek += "Fri";
    }
    if (dwr.util.getValue("reportScheduling_addSaturday")) {
      if (daysOfWeek != "") { daysOfWeek += ","; } daysOfWeek += "Sat";
    }
    var runTimeDateObject = new Date();
    runTimeDateObject.setHours(hours);
    runTimeDateObject.setMinutes(minutes);
    runTimeDateObject.setSeconds(0);
    var reportScheduleDescriptor = {
      reportName :
        dwr.util.getValue("reportScheduling_addReportsList").split("~~")[0],
      daysOfWeek : daysOfWeek, scheduledBy : this.username,
      runTime : runTimeDateObject
    };

    // Some quick validations.
    if (reportScheduleDescriptor.daysOfWeek == "") {
      alert("Sorry, you must select at least one day of the week");
      return;
    } else if (reportScheduleDescriptor.reportName == "") {
      alert("Sorry, you must select a report to schedule");
      return;
    } else if (reportScheduleDescriptor.runTime == ":am" ||
      reportScheduleDescriptor.runtime == ":pm") {
      alert("Sorry, you must enter a time to run the report");
      return;
    }

    // Call the server to do the add.
    ReportSchedulingWorker.addReportToSchedule(reportScheduleDescriptor,
      { callback : RePortal.updateScheduledReportListCallback }
    );

  } // End addReportToSchedule().


  /**
   * Called to remove a selected report from the scheduler.
   *
   * @param inReportName The name of the report to remove.
   * @param inDaysOfWeek The days of the week the report is scheduled to run.
   * @param inRunTime    The time of day the report is scheduled to run.
   */
  this.removeReportFromSchedule = function(inReportName, inDaysOfWeek,
    inRunTime) {

    if (confirm("Are you sure you want to remove report '" +
      inReportName + "' from the schedule?")) {
      // Call the server to do the remove.
      ReportSchedulingWorker.removeReportFromSchedule(inReportName,
        inDaysOfWeek, inRunTime,
        { callback : RePortal.updateScheduledReportListCallback }
      );
    }

  } // End removeReportFromSchedule().


  /**
   * Called to view the output of a scheduled report run.
   *
   * @param inReportName The name of the report to view.
   * @param inDaysOfWeek The days of the week the report is scheduled to run.
   * @param inRunTime    The time of day the report is scheduled to run.
   */
  this.viewScheduledRun = function(inReportName, inDaysOfWeek,
    inRunTime) {

    lightboxPopup("divPleaseWait", true);
    ReportSchedulingWorker.viewScheduledRun(inReportName, inDaysOfWeek,
      inRunTime,
      {
        callback : function(inResp) {
          lightboxPopup("divPleaseWait", false);
          var reportWindow = window.open(null, inReportName,
            "width=780,height=550,scrollbars,resizable,toolbar");
          reportWindow.document.open();
          reportWindow.document.write(inResp);
          reportWindow.document.close();
        }
      }
    );

  } // End viewScheduledRun().


  // ========================================================================
  // =========================== REPORT FUNCTIONS ===========================
  // ========================================================================

  /**
   * Callback function executed when report list is returned by server (or
   * manually called when a report is added).
   *
   * @param inList The list of reports as returned by the server, or null if
   *               none.  When the list is provided, the server is not called
   *               to get the list, inList is used instead.
   */
  this.updateReportListCallback = function(inList) {

    // Remove any existing reports in the list.
    dwr.util.removeAllOptions("favorites_reportsList");
    dwr.util.removeAllOptions("reportScheduling_addReportsList");
    dwr.util.removeAllRows("reportMaintenance_reportList");

    // This is the collection of functions that will be called in sequence
    // for each row we add to the table.  The data passed in is a list
    // of data for each report, reportName, description and groups in that
    // order, so we need to split this list (on the double-tilde sequence,
    // which is our delimiter) and return the appropriate portion for each cell.
    var cellFuncs = [
      function(data) {
        return "<img src=\"img/icoDelete.gif\" align=\"absmiddle\" " +
        "style='cursor:pointer;'" +
        "onClick=\"RePortal.removeReportFromPortal('" +
        data.split("~~")[0] + "');\"" +
        ">&nbsp;" + data.split("~~")[0];
      },
      function(data) { return data.split("~~")[1]; },
      function(data) { return data.split("~~")[2]; }
    ];

    // Iterate over ReportDescriptors returned.
    for (var i = 0; i < inList.length; i++) {
      // Add item to select for each.
      dwr.util.addOptions("favorites_reportsList",
        [ { value : inList[i].reportName + "~~" + inList[i].description,
            text : inList[i].reportName } ],
        "value", "text"
      );
      dwr.util.addOptions("reportScheduling_addReportsList",
        [ { value : inList[i].reportName + "~~" + inList[i].description,
            text : inList[i].reportName } ],
        "value", "text"
      );
      // Add item to table for each.  Note: need escapeHtml set to false or
      // we'll just see the HTML in the cell.
      dwr.util.addRows("reportMaintenance_reportList",
        [ inList[i].reportName + "~~" + inList[i].description + "~~" +
          inList[i].groups ], cellFuncs, { escapeHtml : false }
      );
    }

  } // End updateReportListCallback().


  /**
   * Adds a report to the portal.
   */
  this.addReportToPortal = function() {

    // Construct a ReportDescriptor object from the input parameters.  Note
    // toString() required for groups, otherwise you get a DWR reference
    // string, rather than the value array we want.
    var reportDescriptor = {
      reportName : dwr.util.getValue("reportMaintenance_addReportName"),
      description : dwr.util.getValue("reportMaintenance_addDescription"),
      groups : dwr.util.getValue("reportMaintenance_addGroups").toString(),
      dataSourceName :
        dwr.util.getValue("reportMaintenance_addDataSource").toString(),
      reportXML : dwr.util.getValue("reportMaintenance_addReportXML")
    };

    // Some quick validations.
    if (reportDescriptor.reportName == "") {
      alert("Sorry, you must supply a report name");
      return;
    } else if (reportDescriptor.groups == "") {
      alert("Sorry, you must select at least one group that can " +
        "access the report");
      return;
    } else if (reportDescriptor.reportXML == "") {
      alert("Sorry, you must supply the report XML");
      return;
    } else if (reportDescriptor.reportXML.length > 32000) {
      alert("Sorry, the report XML must be less than 32,000 characters long");
      return;
    } else if (reportDescriptor.dataSourceName == "") {
      alert("Sorry, you must select a data source");
      return;
    }

    // Call the server to do the add.
    ReportWorker.addReportToPortal(reportDescriptor,
      { callback : RePortal.updateReportListCallback }
    );

  } // End addReportToPortal().


  /**
   * Removes a report from the portal.
   *
   * @param inReportName The name of the user to remove.
   */
  this.removeReportFromPortal = function(inReportName) {

    if (confirm("Are you sure you want to remove report '" +
      inReportName + "'?")) {
      // Call the server to do the remove.
      ReportWorker.removeReportFromPortal(inReportName,
        { callback : function(inResp) {
            // Update all report lists, plus favorites and scheduled reports.
            RePortal.updateReportListCallback(inResp);
            FavoritesWorker.getFavoritesForUser(this.username,
              { callback : RePortal.updateFavoritesCallback }
            );
            ReportSchedulingWorker.getScheduledReportsList(
              { callback : RePortal.updateScheduledReportListCallback }
            );
          }
        }
      );
    }

  } // End removeReportFromPortal().


  /**
   * This is called to manually run a report.
   *
   * @param inReportName The name of the report to run.
   */
  this.runReport = function(inReportName) {

    lightboxPopup("divPleaseWait", true);
    ReportRunner.runReport(inReportName,
      {
        callback : function(inResp) {
          lightboxPopup("divPleaseWait", false);
          var reportWindow = window.open(null, inReportName,
            "width=780,height=550,scrollbars,resizable,toolbar");
          reportWindow.document.open();
          reportWindow.document.write(inResp);
          reportWindow.document.close();
        }
      }
    );

  } // End runReport().


  // ========================================================================
  // ============================ GROUP FUNCTIONS ===========================
  // ========================================================================

  /**
   * Adds a group to the portal.
   */
  this.addGroupToPortal = function() {

    // Construct a GroupDescriptor object from the input parameters.
    var groupDescriptor = {
      groupName : dwr.util.getValue("groupAdministration_addGroupName"),
      description : dwr.util.getValue("groupAdministration_addDescription")
    };

    // Some quick validations.
    if (groupDescriptor.groupName == "") {
      alert("Sorry, you must supply a group name");
      return;
    }

    // Call the server to do the add.
    GroupWorker.addGroupToPortal(groupDescriptor,
      { callback : RePortal.updateGroupsListCallback }
    );

  } // End addGroupToPortal().


  /**
   * Removes a group from the portal.
   */
  this.removeGroupFromPortal = function() {

    // Verify removal.
    var groupName = dwr.util.getText("groupAdministration_groupsList");
    if (groupName) {
      if (confirm("Are you sure you want to remove group '" +
        groupName + "'?")) {
        // Call the server to do the remove.
        dwr.util.setValue("groupAdministration_groupDescription", "");
        GroupWorker.removeGroupFromPortal(groupName,
          { callback : RePortal.updateGroupsListCallback }
        );
      }
    }

  } // End removeGroupFromPortal().


  /**
   * Called when a group is selected in the group admin list.
   */
  this.displayGroupInfo = function(inSelectValue) {

    // The value passed in is in the from "groupName,description", so split it
    // and set the appropriate fields.
    var vals = inSelectValue.split("~~");

    dwr.util.setValue("groupAdministration_groupDescription", vals[1]);
    new Effect.Highlight(dwr.util.byId("groupAdministration_groupDescription"));

  } // End displayGroupInfo().


  /**
   * Callback function executed when group list is returned by server (or
   * manually called when a group is added).
   *
   * @param inList The list of groups as returned by the server, or null if
   *               none.  When the list is provided, the server is not called
   *               to get the list, inList is used instead.
   */
  this.updateGroupsListCallback = function(inList) {

    // Remove any existing groups in the list.
    dwr.util.removeAllOptions("reportMaintenance_addGroups");
    dwr.util.removeAllOptions("groupAdministration_groupsList");
    dwr.util.removeAllOptions("userAdministration_addGroups");
    // Add the special "All Users" group to the group list for report maint.
    dwr.util.addOptions("reportMaintenance_addGroups",
      [ { value : "AllUsers", text : "All Users" } ], "value", "text"
    );
    // Iterate over GroupDescriptors returned.
    for (var i = 0; i < inList.length; i++) {
      // Add item to selects for each.
      dwr.util.addOptions("reportMaintenance_addGroups",
        [ { value : inList[i].groupName, text : inList[i].groupName } ],
        "value", "text"
      );
      dwr.util.addOptions("userAdministration_addGroups",
        [ { value : inList[i].groupName, text : inList[i].groupName } ],
        "value", "text"
      );
      // Note for group admin select, we need the value to contain both the
      // group name and its description so we can display it later.
      dwr.util.addOptions("groupAdministration_groupsList",
        [ { value : inList[i].groupName + "~~" + inList[i].description,
            text : inList[i].groupName } ],
        "value", "text"
      );
    }

  } // End updateGroupsListCallback().


  // ========================================================================
  // ============================ USER FUNCTIONS ============================
  // ========================================================================

  /**
   * Callback function executed when user list is returned by server (or
   * manually called when a user is added).
   *
   * @param inList The list of users as returned by the server, or null if
   *               none.  When the list is provided, the server is not called
   *               to get the list, inList is used instead.
   */
  this.updateUserListCallback = function(inList) {

    // Remove any existing users in the list.
    dwr.util.removeAllOptions("userAdministration_usersList");
    // Iterate over UserDescriptors returned.
    for (var i = 0; i < inList.length; i++) {
      // Add item to select for each.
      dwr.util.addOptions("userAdministration_usersList",
        [ { value : inList[i].groups + "~~" + inList[i].note,
            text : inList[i].username } ],
        "value", "text"
      );
    }

  } // End updateUserListCallback().


  /**
   * Adds a user to the portal.
   */
  this.addUserToPortal = function() {

    // Construct a UserDescriptor object from the input parameters.  Note
    // toString() required for groups, otherwise you get a DWR reference
    // string, rather than the value array we want.
    var userDescriptor = {
      username : dwr.util.getValue("userAdministration_addUsername"),
      password : dwr.util.getValue("userAdministration_addPassword"),
      groups : dwr.util.getValue("userAdministration_addGroups").toString(),
      note : dwr.util.getValue("userAdministration_addNote")
    };

    // Some quick validations.
    if (userDescriptor.username == "") {
      alert("Sorry, you must supply a username");
      return;
    } else if (userDescriptor.password == "") {
      alert("Sorry, you must supply a password");
      return;
    } else if (userDescriptor.groups == "") {
      alert("Sorry, you must select at least one group to put the user in");
      return;
    }

    // Call the server to do the add.
    UserWorker.addUserToPortal(userDescriptor,
      { callback : RePortal.updateUserListCallback }
    );

  } // End addUserToPortal().


  /**
   * Removes a user from the portal.
   */
  this.removeUserFromPortal = function() {

    // Verify removal.
    var username = dwr.util.getText("userAdministration_usersList");
    if (username) {
      if (username == RePortal.username) {
        alert("Sorry, you cannot remove yourself");
        return;
      }
      if (confirm("Are you sure you want to remove user '" +
        username + "'?")) {
        // Call the server to do the remove.
        dwr.util.setValue("userAdministration_userGroups", "");
        dwr.util.setValue("userAdministration_userNote", "");
        UserWorker.removeUserFromPortal(username,
          { callback : RePortal.updateUserListCallback }
        );
      }
    }

  } // End removeUserFromPortal().


  /**
   * Called when a user is selected in the user admin list.
   */
  this.displayUserInfo = function(inSelectValue) {

    // The value passed in is in the from "note,groups", so split it and
    // set the appropriate fields.
    var vals = inSelectValue.split("~~");

    dwr.util.setValue("userAdministration_userGroups", vals[0]);
    dwr.util.setValue("userAdministration_userNote", vals[1]);
    new Effect.Highlight(dwr.util.byId("userAdministration_userGroups"));
    new Effect.Highlight(dwr.util.byId("userAdministration_userNote"));

  } // End displayUserInfo().



  /**
   * Attempts to log a user in.
   */
  this.logUserIn = function() {

    UserWorker.logUserIn(dwr.util.getValue("login_username"),
      dwr.util.getValue("login_password"),
      function(inResp) {
        if (inResp) {
          // Hide lightbox popup and call init() to set everything up.
          lightboxPopup("divLogin", false);
          RePortal.init(dwr.util.getValue("login_username"));
        } else {
          alert("Sorry, information was invalid, could not log you in");
          lightboxPopup("divLogin", false);
        }
      }
    );

  } // End logUserIn().


} // End class.


// The one and only instance of RePortalClass.
var RePortal = new RePortalClass();
