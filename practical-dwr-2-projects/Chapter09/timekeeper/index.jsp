<%@ page language="java" import="com.apress.dwrprojects.timekeeper.*" %>

<html>
  <head>
    <title>DWR Timekeeper</title>
    <link rel="stylesheet" type="text/css" href="css/styles.css">
    <script src="dwr/engine.js"></script>
    <script src="dwr/util.js"></script>
    <script src="dwr/interface/UserDAO.js"></script>
    <script>
      dwr.engine.setErrorHandler(errorHandler);
      function errorHandler(inMessage) {
        alert(inMessage);
      }
    </script>

<%
  /* ---------- If user isn't logged in, show login. ---------- */
  if (session == null || session.getAttribute("user") == null) {
%>
    <script>
      function doLogin() {
        UserDAO.logUserIn(
          dwr.util.getValue("username"),
          dwr.util.getValue("password"),
          { callback : function(inResp) {
              if (inResp == "Ok") {
                window.location = "index.jsp";
              } else {
                alert("Invalid credentials.  Please try again.");
              }
            }
          }
        );
      }
    </script>
  </head>
  <body>
    <table border="0" width="100%" cellspacing="0" cellpadding="0">
    	<tr>
    		<td rowspan="2" width="305">
    		<img src="img/logon_left.gif"></td>
    		<td height="295" valign="middle">
    		  Please log in to begin:
          <br><br>
          <table border="0" cellpadding="2" cellspacing="2">
            <tr>
              <td class="cssTableHeader">Username&nbsp;</td>
              <td><input type="text" name="username" value=""></td>
            </tr>
            <tr>
              <td class="cssTableHeader">Password&nbsp;</td>
              <td><input type="text" name="password" value=""></td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td align="right">
                <img src="img/login0.gif" onClick="doLogin();"
                  onMouseOver="this.style.cursor='pointer';this.src='img/login1.gif';"
                  onMouseOut="this.src='img/login0.gif';">
              </td>
            </tr>
          </table>
    		</td>
    	</tr>
    	<tr>
    		<td height="178" valign="bottom">
    		<img src="img/logon_bottom.gif"></td>
    	</tr>
    </table>

<%
  /* ---------- If user IS logged in, show the app. ---------- */
  } else {
    User user = (User)session.getAttribute("user");
%>

    <!-- Ext JS stuff. -->
    <script type="text/javascript"
      src="js/ext/adapter/yui/yui-utilities.js"></script>
    <script type="text/javascript"
      src="js/ext/adapter/yui/ext-yui-adapter.js"></script>
    <script type="text/javascript" src="js/ext/ext-all.js"></script>
    <link rel="stylesheet" type="text/css"
      href="js/ext/resources/css/ext-all.css">

    <!-- DWR proxies. -->
    <script src="dwr/interface/ProjectDAO.js"></script>
    <script src="dwr/interface/TimesheetDAO.js"></script>

    <!-- Main Timekeeper code. --->
    <script src="js/Timekeeper.js"></script>

  </head>

  <body class="cssBody" onLoad="timekeeper.init(<%=user.getId()%>);">

    <!-- Menubar. -->
    <div id="divMenubar"></div>

    <!-- Source element dialogs will appear from. -->
    <div id="divSource" class="cssSource"></div>

    <div class="cssOuter">

      <!-- Home. -->
      <br><br>
      <table border="0" cellpadding="0" cellspacing="0" align="center">
        <tr><td><div class="cssHeader">Project Overview</div></td></tr>
        <tr><td>
          <!-- Project Overview. -->
          <div class="cssHomeTableContainer">
            <table border="0" width="100%" class="cssTable">
              <thead>
                <tr style="height:24px;">
                  <td class="cssTableHeader">Name&nbsp;&nbsp;</td>
                  <td class="cssTableHeader">Project Manager&nbsp;&nbsp;</td>
                  <td class="cssTableHeader">Allocated Hours&nbsp;&nbsp;</td>
                  <td class="cssTableHeader">Booked Hours&nbsp;&nbsp;</td>
                  <td class="cssTableHeader">Target Date&nbsp;&nbsp;</td>
                  <td class="cssTableHeader">Status&nbsp;&nbsp;</td>
                </tr>
              </thead>
              <tbody id="divHome_projectOverviewList"></tbody>
            </table>
          </div>
        </td></tr>
        <tr><td>&nbsp;<br><br><br></td></tr>
        <tr><td><div class="cssHeader">Your Current Timesheet</div></td></tr>
        <tr><td>
          <!-- Timesheet. -->
          <div class="cssHomeTableContainer">
            <table border="0" width="100%" class="cssTable">
              <thead>
                <tr style="height:24px;">
                  <td class="cssTableHeader">Project&nbsp;&nbsp;</td>
                  <td class="cssTableHeader"
                    id="divHome_bookTimeList_today_6"></td>
                  <td class="cssTableHeader"
                    id="divHome_bookTimeList_today_5"></td>
                  <td class="cssTableHeader"
                    id="divHome_bookTimeList_today_4"></td>
                  <td class="cssTableHeader"
                    id="divHome_bookTimeList_today_3"></td>
                  <td class="cssTableHeader"
                    id="divHome_bookTimeList_today_2"></td>
                  <td class="cssTableHeader"
                    id="divHome_bookTimeList_today_1"></td>
                  <td class="cssTableHeader"
                    id="divHome_bookTimeList_today_0"></td>
                  <td class="cssTableHeader"
                    id="divHome_bookTimeList_today_0"
                    width="40">&nbsp;&nbsp;</td>
                </tr>
                <tr style="height:4px;">
                  <td colspan="9"><img src="img/spacer.gif"></td>
                </tr>
              </thead>
              <tbody id="divHome_bookTimeList"></tbody>
            </table>
          </div>
        </td></tr>
      </table>

      <!-- Administer Users. -->
      <div id="dialogAdministerUsers"
        style="visibility:hidden;position:absolute;top:0px;">
        <div class="x-dlg-hd">Administer Users</div>
        <div class="x-dlg-bd">
          <table border="0" width="100%">
            <thead>
              <tr style="height:24px;">
                <td>&nbsp;</td>
                <td class="cssTableHeader">&nbsp;Username&nbsp;</td>
                <td class="cssTableHeader">&nbsp;Password&nbsp;</td>
                <td class="cssTableHeader">&nbsp;Administrator&nbsp;</td>
                <td class="cssTableHeader">&nbsp;Project&nbsp;Manager&nbsp;</td>
              </tr>
            </thead>
            <tbody id="divAdminUsers_userList"></tbody>
          </table>
        </div>
      </div>

      <!-- Administer Projects. -->
      <div id="dialogAdministerProjects"
        style="visibility:hidden;position:absolute;top:0px;">
        <div class="x-dlg-hd">Administer Projects</div>
        <div class="x-dlg-bd">
          <table border="0" width="100%">
            <thead>
              <tr style="height:24px;">
                <td>&nbsp;</td>
                <td class="cssTableHeader">&nbsp;Name&nbsp;</td>
                <td class="cssTableHeader">&nbsp;Project Manager&nbsp;</td>
              </tr>
            </thead>
            <tbody id="divAdminProjects_projectList"></tbody>
          </table>
        </div>
      </div>

      <!-- Manage Projects. -->
      <div id="dialogManageProjects"
        style="visibility:hidden;position:absolute;top:0px;">
        <div class="x-dlg-hd">Manage Projects</div>
        <div class="x-dlg-bd">
          <table border="0" width="100%">
            <thead>
              <tr style="height:24px;">
                <td class="cssTableHeader">&nbsp;Name&nbsp;</td>
                <td class="cssTableHeader">&nbsp;Allocated Hours&nbsp;</td>
                <td class="cssTableHeader">&nbsp;Target Date&nbsp;</td>
                <td class="cssTableHeader">&nbsp;Users Assigned&nbsp;</td>
              </tr>
            </thead>
            <tbody id="divManageProjects_projectList"></tbody>
          </table>
        </div>
      </div>

      <!-- Using Timekeeper. -->
      <div id="dialogUsingTimekeeper"
        style="visibility:hidden;position:absolute;top:0px;">
        <div class="x-dlg-hd">Using Timekeeper</div>
        <div class="x-dlg-bd">
          Welcome to Timekeeper! Timekeeper is a DWR-based application that
          allows for tracking of time booked against projects by users assigned
          to work on those projects.
          <br><br>
          <div class="cssHeader">Administering Users</div><hr>
          The first logical thing you'll want to do is create users. To do so,
          simply click the Administer Users option on the Functions menu.
          A new dialog will appear that lists all existing users, and contains
          a line where you can create new users. To create a new user, enter a
          username and password, and optionally check off options for the
          user and click the Add button. The options are Administrator (if the
          user can administer users and projects) and Project manager (if the
          user can modify the parameters of existing projects). To edit
          existing users, simply change the values of the fields. The changes
          will be saved when focus leaves the current field.
          <br>
          <i>Note: This function is only available for Administrators</i>
          <br><br>
          <div class="cssHeader">Administering Projects</div><hr>
          To administer projects, click the Administer Projects option on the
          Functions menu. A dialog appears which looks very similar to the
          Administer Users dialog. To add a new project, enter it's name and
          select a project manager and click the Add button. To edit existing
          projects, simply change the values of the fields. The changes will
          be saved when focus leaves the current field.
          <br>
          <i>Note: This function is only available for Administrators</i>
          <br><br>
          <div class="cssHeader">Managing Projects</div><hr>
          Managing projects allows project managers to set the number of
          allocated hours, target date and users assigned for projects they are
          in charge of. To manage projects, click the Manage Projects option on
          the Functions menu. A dialog appears where you can change the
          parameters of all projects you manage. As with the administration
          dialogs, simply change teh values of the fields and the changes will
          be saved when focus leaves the current field.
          <i>Note: This function is only available for Project Managers</i>
          <br><br>
          <div class="cssHeader">Booking Time</div><hr>
          When you work on a project, you need to book time to it. You do this
          on the Home page (the portion that is always visible and not in a
          popup dialog) in the section labeled Your Current Timesheet. To do
          so, simply edit the value for the appropriate day and project. The
          new value will be saved when focus leaves the field. You will also
          see totals for each day along the bottom, and totals for each project
          along the right.
        </div>
      </div>

    </div>

<% } %>

  </body>
</html>

