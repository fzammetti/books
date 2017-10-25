<%
  // If the user is already logged in, they'll have a session established and
  // their username will be stored there.  We'll need to pass the user ID in
  // to the init() method of the RePortal class, so go grab that information.
  String username = (String)session.getAttribute("username");
  // If there was no username in session, user isn't logged in yet, so just pass
  // an empty string.
  if (username == null) {
    username = "";
  }
%>

<html>
  <head>
    <title>RePortal</title>

      <!-- Import stylesheets. -->
      <link rel="StyleSheet" href="css/styles.css" type="text/css">
      <link rel="StyleSheet" href="css/lightbox.css" type="text/css">

      <!-- DWR imports. -->
      <script src="dwr/engine.js"></script>
      <script src="dwr/util.js"></script>
      <script src="dwr/interface/UserWorker.js"></script>
      <script src="dwr/interface/GroupWorker.js"></script>
      <script src="dwr/interface/ReportWorker.js"></script>
      <script src="dwr/interface/FavoritesWorker.js"></script>
      <script src="dwr/interface/ReportRunner.js"></script>
      <script src="dwr/interface/ReportSchedulingWorker.js"></script>

      <!-- Import JavaScripts. -->
      <script src="js/prototype.js" type="text/javascript"></script>
      <script src="js/scriptaculous.js?load=effects"
        type="text/javascript"></script>
      <script src="js/lightbox.js" type="text/javascript"></script>
      <script src="js/RePortalClass.js" type="text/javascript"></script>

  </head>

  <body class="cssBody" onLoad="RePortal.init('<%=username%>');">

    <table border="0" cellpadding="0" cellspacing="0" width="780"
      align="center"><tr><td>

      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td valign="top" ><img src="img/logo.gif"></td>
          <td valign="top" align="right">
            <span id="spanUsername">Not Logged In</span>
            &nbsp;|&nbsp;<a href="javascript:void(0);"
              onClick="if(RePortal.username!=null){alert('You are already logged in');}else{lightboxPopup('divLogin', true);}">Login</a>
          </td>
        </tr>
      </table>

      <!-- ***************************************************************** -->
      <!-- ***** Favorites                                             ***** -->
      <!-- ***************************************************************** -->
      <div class="cssSectionContainer" id="divMyFavorites">
        <div class="cssSection">
          <div class="cssSectionTop">
            <div>
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <span class="cssSectionTitle">
                      <img align="absmiddle" src="img/icoMyFavorites.gif" >
                        &nbsp;My Favorites
                    </span>
                  </td>
                  <td align="right" class="cssSectionButtons">
                    <img src="img/sectionCollapse.gif" class="cssSectionButton"
                      onClick="RePortal.collapseSection('divMyFavorites');">
                    <img src="img/sectionExpand.gif" class="cssSectionButton"
                      onClick="RePortal.expandSection('divMyFavorites');">
                    <img src="img/sectionClose.gif" class="cssSectionButton"
                      onClick="RePortal.removeSection('divMyFavorites');">
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <div class="cssSectionDivider"><hr color="#000000" width="99%"></div>
          <div class="cssSectionContent">
            You have the following reports in your favorites:
            <br>
            <ul id="favorites_favoritesList"></ul>
            Click a report to run it ad-hoc.
            <br><br>
            <a href="javascript:void(0);"
              onClick="RePortal.showHideAddSection('favorites_addReport');">Add favorite</a>
            <div id="favorites_addReport" style="display:none;">
              <table border="0" cellpadding="2" cellspacing="2" width="100%">
                <tr>
                  <td valign="top" width="1">
                    <select size="10" id="favorites_reportsList"
                      onChange="RePortal.favoritesDisplayReportInfo(this.value);"
                      class="cssSelect">
                    </select>
                  </td>
                  <td valign="top">
                    To add a report to your favorites, select it from the list
                    and click Add.  The description of the selected report will
                    be shown
                    below.
                    <br><br>
                    <b>Description</b>
                    <div id="favorites_reportDescription"></div>
                  </td>
                </tr>
                <tr>
                  <td align="right">
                    <img src="img/btnAdd0.gif" class="cssButton"
                      onClick="RePortal.addReportToFavorites();"
                      onMouseOver="this.src='img/btnAdd1.gif';"
                      onMouseOut="this.src='img/btnAdd0.gif';">
                  </td>
                  <td>&nbsp;</td>
                </tr>
              </table>
            </div>
          </div>
          <div class="cssSectionBottom"><div></div></div>
        </div>
      </div>

      <br>

      <!-- ***************************************************************** -->
      <!-- ***** Div shown when user isn't yet logged in               ***** -->
      <!-- ***************************************************************** -->
      <div id="divNotLoggedInMessage" class="cssNotLoggedInMessage">
        <br><br>
        If you were logged in right now, you'd be able to modify favorites,
        add and remove reports, users and groups, and schedule reports.  Come
        on, log in and join in on the fun!
      </div>

      <!-- ***************************************************************** -->
      <!-- ***** Report Scheduling                                     ***** -->
      <!-- ***************************************************************** -->
      <div class="cssSectionContainer" id="divReportScheduling"
        <%if(username.equals("")){%>style="display:none;"<%}%>>
        <div class="cssSection">
          <div class="cssSectionTop">
            <div>
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <span class="cssSectionTitle">
                      <img align="absmiddle" src="img/icoReportScheduling.gif">
                        &nbsp;Report Scheduling
                    </span>
                  </td>
                  <td align="right" class="cssSectionButtons">
                    <img src="img/sectionCollapse.gif" class="cssSectionButton"
                      onClick="RePortal.collapseSection('divReportScheduling');">
                    <img src="img/sectionExpand.gif" class="cssSectionButton"
                      onClick="RePortal.expandSection('divReportScheduling');">
                    <img src="img/sectionClose.gif" class="cssSectionButton"
                      onClick="RePortal.removeSection('divReportScheduling');">
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <div class="cssSectionDivider"><hr color="#000000" width="99%"></div>
          <div class="cssSectionContent">
            The following reports are schedule to run:
            <br><br>
            <table border="1" cellpadding="2" cellspacing="0"
              bordercolor="#000000" width="98%">
              <thead>
                <tr>
                  <th align="left" class="cssTableHeader">Report</th>
                  <th align="left" class="cssTableHeader">Days of week</th>
                  <th align="left" class="cssTableHeader">Run time (24-hour)</th>
                  <th align="left" class="cssTableHeader">Scheduled by</th>
                  <th align="left" class="cssTableHeader">Last Run</th>
                </tr>
              </thead>
              <tbody id="reportScheduling_reportList"></tbody>
            </table>
            <br>
            <a href="javascript:void(0);"
              onClick="RePortal.showHideAddSection('reportScheduling_scheduleReport');">Schedule Report</a>
            <div id="reportScheduling_scheduleReport" style="display:none;">
              <table border="0" cellpadding="2" cellspacing="2">
                <tr>
                  <td valign="top">
                    <select size="10" class="cssSelect"
                      id="reportScheduling_addReportsList">
                    </select>
                  </td>
                  <td valign="top">
                    To schedule a report, select it from the list, enter the
                    scheduling information below, and click Add.
                    <br><br>
                    <table border="0" cellpadding="0" cellspacing="6">
                      <tr>
                        <td><b>Days of week:</b>&nbsp;</td>
                        <td>
                          <input type="checkbox"
                            id="reportScheduling_addSunday">Sun
                          <input type="checkbox"
                            id="reportScheduling_addMonday">Mon
                          <input type="checkbox"
                            id="reportScheduling_addTuesday">Tue
                          <input type="checkbox"
                            id="reportScheduling_addWednesday">Wed
                          <input type="checkbox"
                            id="reportScheduling_addThursday">Thu
                          <input type="checkbox"
                            id="reportScheduling_addFriday">Fri
                          <input type="checkbox"
                            id="reportScheduling_addSaturday">Sat
                        </td>
                        <td>&nbsp;</td>
                      </tr>
                      <tr>
                        <td><b>Time:</b>&nbsp;</td>
                        <td>
                          <input type="text" size="3" maxlength="2"
                            id="reportScheduling_addHour">
                          :
                          <input type="text" size="3" maxlength="2"
                            id="reportScheduling_addMinute">
                          &nbsp;(Note: 24-hour time)
                        </td>
                        <td>&nbsp;</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="right">
                    <img src="img/btnAdd0.gif" class="cssButton"
                      onClick="RePortal.addReportToSchedule();"
                      onMouseOver="this.src='img/btnAdd1.gif';"
                      onMouseOut="this.src='img/btnAdd0.gif';">
                  </td>
                  <td>&nbsp;</td>
                </tr>
              </table>
            </div>
          </div>
          <div class="cssSectionBottom"><div></div></div>
        </div>
      </div>

      <br>

      <!-- ***************************************************************** -->
      <!-- ***** Report Maintenance                                    ***** -->
      <!-- ***************************************************************** -->
      <div class="cssSectionContainer" id="divReportMaintenance"
        <%if(username.equals("")){%>style="display:none;"<%}%>>
        <div class="cssSection">
          <div class="cssSectionTop">
            <div>
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <span class="cssSectionTitle">
                      <img align="absmiddle" src="img/icoReportMaintenance.gif">
                        &nbsp;Report Maintenance
                    </span>
                  </td>
                  <td align="right" class="cssSectionButtons">
                    <img src="img/sectionCollapse.gif" class="cssSectionButton"
                      onClick="RePortal.collapseSection('divReportMaintenance');">
                    <img src="img/sectionExpand.gif" class="cssSectionButton"
                      onClick="RePortal.expandSection('divReportMaintenance');">
                    <img src="img/sectionClose.gif" class="cssSectionButton"
                      onClick="RePortal.removeSection('divReportMaintenance');">
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <div class="cssSectionDivider"><hr color="#000000" width="99%"></div>
          <div class="cssSectionContent">
            The following reports are available:
            <br><br>
            <table border="1" cellpadding="2" cellspacing="0" width="98%"
              bordercolor="#000000">
              <thead>
                <tr>
                  <th align="left" class="cssTableHeader">Name</th>
                  <th align="left" class="cssTableHeader">Description</th>
                  <th align="left"
                    class="cssTableHeader">Groups who can access it</th>
                </tr>
              </thead>
              <tbody id="reportMaintenance_reportList"></tbody>
            </table>
            <br>
            <a href="javascript:void(0);"
              onClick="RePortal.showHideAddSection('reportMaint_addReport');">Add report</a>
            <br>
            <div id="reportMaint_addReport" style="display:none;">
              <table border="0" cellpadding="2" cellspacing="2">
                <tr>
                  <td valign="top">
                    <b>Report XML:</b>
                    <br>
                    <textarea cols="65" rows="35"
                      id="reportMaintenance_addReportXML"></textarea>
                  </td>
                  <td valign="top">
                    <br>
                    To add a report, paste its XML into the text area, select
                    the groups who can access it, give it an optional
                    description and click Add.  Note: if adding a report to a
                    group you aren't a member of, you will not see it appear
                    in the above list!
                    <br><br>
                    <b>Name:</b>
                    <br>
                    <input type="text" size="30" maxlength="50" value=""
                      id="reportMaintenance_addReportName">
                    <br><br>
                    <b>Description:</b>
                    <br>
                    <input type="text" size="30" maxlength="100" value=""
                      id="reportMaintenance_addDescription">
                    <br><br>
                    <b>Groups:</b>
                    <br>
                    <select size="10" multiple="true" class="cssSelect"
                      id="reportMaintenance_addGroups">
                    </select>
                    <br><br>
                    <b>Data Source</b>
                    <br>
                    <select size="10" class="cssSelect"
                      id="reportMaintenance_addDataSource">
                    </select>
                  </td>
                </tr>
                <tr>
                  <td align="right">
                    <img src="img/btnAdd0.gif" class="cssButton"
                      onClick="RePortal.addReportToPortal();"
                      onMouseOver="this.src='img/btnAdd1.gif';"
                      onMouseOut="this.src='img/btnAdd0.gif';">
                  </td>
                  <td>&nbsp;</td>
                </tr>
              </table>
            </div>
          </div>
          <div class="cssSectionBottom"><div></div></div>
        </div>
      </div>

      <br>

      <!-- ***************************************************************** -->
      <!-- ***** Group Administration                                  ***** -->
      <!-- ***************************************************************** -->
      <div class="cssSectionContainer" id="divGroupAdministration"
        <%if(username.equals("")){%>style="display:none;"<%}%>>
        <div class="cssSection">
          <div class="cssSectionTop">
            <div>
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <span class="cssSectionTitle">
                      <img align="absmiddle"
                        src="img/icoGroupAdministration.gif">
                        &nbsp;Group Administration
                    </span>
                  </td>
                  <td align="right" class="cssSectionButtons">
                    <img src="img/sectionCollapse.gif" class="cssSectionButton"
                      onClick="RePortal.collapseSection('divGroupAdministration');">
                    <img src="img/sectionExpand.gif" class="cssSectionButton"
                      onClick="RePortal.expandSection('divGroupAdministration');">
                    <img src="img/sectionClose.gif" class="cssSectionButton"
                      onClick="RePortal.removeSection('divGroupAdministration');">
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <div class="cssSectionDivider"><hr color="#000000" width="99%"></div>
          <div class="cssSectionContent">
            Groups allow you to determine who can run which reports.  The
            following groups are set up:
            <br><br>
            <table border="0" cellpadding="2" cellspacing="2" width="99%">
              <tr>
                <td valign="top" width="1">
                  <select size="10" id="groupAdministration_groupsList"
                    onChange="RePortal.displayGroupInfo(this.value);"
                    class="cssSelect">
                  </select>
                </td>
                <td valign="top">
                  To delete a group, select it from the list and click Delete.
                  The description of the selected group will be shown below.
                  <br><br>
                  <b>Description</b>
                  <div id="groupAdministration_groupDescription"></div>
                </td>
              </tr>
              <tr>
                <td align="right">
                  <img src="img/btnDelete0.gif" class="cssButton"
                    onClick="RePortal.removeGroupFromPortal();"
                    onMouseOver="this.src='img/btnDelete1.gif';"
                    onMouseOut="this.src='img/btnDelete0.gif';">
                </td>
                <td>&nbsp;</td>
              </tr>
            </table>
            <br>
            <a href="javascript:void(0);"
              onClick="RePortal.showHideAddSection('groupMaint_addGroup');">Add group</a>
            <br>
            <div id="groupMaint_addGroup" style="display:none;">
              <table border="0" cellpadding="2" cellspacing="2">
                <tr>
                  <td valign="top"><b>Name:</b>&nbsp;</td>
                  <td valign="top">
                    <input type="text" size="35" maxlength="20"
                      value="" id="groupAdministration_addGroupName">
                  </td>
                  <td valign="top">To add a group, enter a name, an optional
                    description and click Add.</td>
                </tr>
                <tr>
                  <td valign="top"><b>Description:</b>&nbsp;</td>
                  <td valign="top" colspan="2">
                    <input type="text" size="35"
                      maxlength="100" value=""
                      id="groupAdministration_addDescription">
                   </td>
                </tr>
                <tr>
                  <td colspan="2" align="right">
                    <img src="img/btnAdd0.gif" class="cssButton"
                      onClick="RePortal.addGroupToPortal();"
                      onMouseOver="this.src='img/btnAdd1.gif';"
                      onMouseOut="this.src='img/btnAdd0.gif';">
                  </td>
                  <td>&nbsp;</td>
                </tr>
              </table>
            </div>
          </div>
          <div class="cssSectionBottom"><div></div></div>
        </div>
      </div>

      <br>

      <!-- ***************************************************************** -->
      <!-- ***** User Administration                                   ***** -->
      <!-- ***************************************************************** -->
      <div class="cssSectionContainer" id="divUserAdministration"
        <%if(username.equals("")){%>style="display:none;"<%}%>>
        <div class="cssSection">
          <div class="cssSectionTop">
            <div>
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <span class="cssSectionTitle">
                      <img align="absmiddle"
                        src="img/icoUserAdministration.gif">
                        &nbsp;User Administration
                    </span>
                  </td>
                  <td align="right" class="cssSectionButtons">
                    <img src="img/sectionCollapse.gif" class="cssSectionButton"
                      onClick="RePortal.collapseSection('divUserAdministration');">
                    <img src="img/sectionExpand.gif" class="cssSectionButton"
                      onClick="RePortal.expandSection('divUserAdministration');">
                    <img src="img/sectionClose.gif" class="cssSectionButton"
                      onClick="RePortal.removeSection('divUserAdministration');">
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <div class="cssSectionDivider"><hr color="#000000" width="99%"></div>
          <div class="cssSectionContent">
            Users allow you to determine who can access RePortal.  The
            following users are set up:
            <br><br>
            <table border="0" cellpadding="2" cellspacing="2" width="100%">
              <tr>
                <td valign="top" width="1">
                  <select size="10" id="userAdministration_usersList"
                    onChange="RePortal.displayUserInfo(this.value);"
                    class="cssSelect"></select>
                </td>
                <td valign="top">
                  To delete a user, select them from the list and click Delete.
                  The description of the selected user will be shown below.
                  <br><br>
                  <b>Groups</b>
                  <div id="userAdministration_userGroups">&nbsp;</div>
                  <br>
                  <b>Note</b>
                  <div id="userAdministration_userNote">&nbsp;</div>
                </td>
                <td align="right">
                  <img src="img/btnDelete0.gif" class="cssButton"
                    onClick="RePortal.removeUserFromPortal();"
                    onMouseOver="this.src='img/btnDelete1.gif';"
                    onMouseOut="this.src='img/btnDelete0.gif';">
                </td>
                <td>&nbsp;</td>
              </tr>
            </table>
            <br>
            <a href="javascript:void(0);"
              onClick="RePortal.showHideAddSection('userAdministration_addUser');">Add user</a>
            <br>
            <div id="userAdministration_addUser" style="display:none;">
              <table border="0" cellpadding="2" cellspacing="2">
                <tr>
                  <td valign="top"><b>Username:</b>&nbsp;</td>
                  <td valign="top">
                    <input type="text" size="30" maxlength="20" value=""
                      id="userAdministration_addUsername">
                  </td>
                  <td valign="top">To add a user, enter a username, password and
                    optional note and click Add.</td>
                </tr>
                <tr>
                  <td valign="top"><b>Password:</b>&nbsp;</td>
                  <td valign="top" colspan="2">
                    <input type="text" size="30" maxlength="20" value=""
                      id="userAdministration_addPassword">
                  </td>
                </tr>
                <tr>
                  <td valign="top"><b>Note:</b>&nbsp;</td>
                  <td valign="top" colspan="2">
                    <input type="text" size="30" maxlength="500" value=""
                      id="userAdministration_addNote">
                  </td>
                </tr>
                <tr>
                  <td valign="top"><b>Groups:</b>&nbsp;</td>
                  <td>
                    <select size="10" id="userAdministration_addGroups"
                      multiple="true" class="cssSelect"></select>
                  </td>
                  <td>&nbsp;</td>
                </tr>
                <tr>
                  <td colspan="2" align="right">
                    <img src="img/btnAdd0.gif" class="cssButton"
                      onClick="RePortal.addUserToPortal();"
                      onMouseOver="this.src='img/btnAdd1.gif';"
                      onMouseOut="this.src='img/btnAdd0.gif';">
                  </td>
                  <td>&nbsp;</td>
                </tr>
              </table>
            </div>
          </div>
          <div class="cssSectionBottom"><div></div></div>
        </div>
      </div>

    </td></tr></table>

    <!-- Needed for lightbox popups. -->
    <div id="divLightboxBlocker" class="cssLightboxBlocker"></div>

    <!-- ******************************************************************* -->
    <!-- ***** Login                                                   ***** -->
    <!-- ******************************************************************* -->
    <div id="divLogin" class="cssLightboxPopup"
      style="width:200px;height:200px;display:none;">
      <center>
        <br>
        <b>Please log in below</b>
        <br><br>
        Username: <input type="text" size="21" maxlength="20" id="login_username">
        <br><br>
        Password: <input type="password" size="21" maxlength="20" id="login_password">
        <br><br>
        <input type="button" onClick="RePortal.logUserIn();" value="Login">
        &nbsp;&nbsp;&nbsp;&nbsp;
        <input type="button" value="Cancel"
          onclick="lightboxPopup('divLogin', false);">
      </center>
    </div>
    <div id="divLogin_Shadow0" class="cssLightboxShadow0"
      style="width:200px;height:200px;"></div>
    <div id="divLogin_Shadow1" class="cssLightboxShadow1"
      style="width:200px;height:200px;"></div>
    <div id="divLogin_Shadow2" class="cssLightboxShadow2"
      style="width:200px;height:200px;"></div>
    <div id="divLogin_Shadow3" class="cssLightboxShadow3"
      style="width:200px;height:200px;"></div>
    <div id="divLogin_Shadow4" class="cssLightboxShadow4"
      style="width:200px;height:200px;"></div>
    <div id="divLogin_Shadow5" class="cssLightboxShadow5"
      style="width:200px;height:200px;"></div>

    <!-- ******************************************************************* -->
    <!-- ***** Please Wait                                             ***** -->
    <!-- ******************************************************************* -->
    <div id="divPleaseWait" class="cssLightboxPopup"
      style="width:140px;height:50px;display:none;">
      <br>
      <div class="cssPleaseWait">Processing...</div>
    </div>
    <div id="divPleaseWait_Shadow0" class="cssLightboxShadow0"
      style="width:140px;height:50px;"></div>
    <div id="divPleaseWait_Shadow1" class="cssLightboxShadow1"
      style="width:140px;height:50px;"></div>
    <div id="divPleaseWait_Shadow2" class="cssLightboxShadow2"
      style="width:140px;height:50px;"></div>
    <div id="divPleaseWait_Shadow3" class="cssLightboxShadow3"
      style="width:140px;height:50px;"></div>
    <div id="divPleaseWait_Shadow4" class="cssLightboxShadow4"
      style="width:140px;height:50px;"></div>
    <div id="divPleaseWait_Shadow5" class="cssLightboxShadow5"
      style="width:140px;height:50px;"></div>

  </body>

</html>
