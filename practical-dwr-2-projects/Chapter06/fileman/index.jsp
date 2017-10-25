<%
  /*
    Copyright (c) 2007 by Frank W. Zammetti.  This file is part of the DWR
    File Manager (Fileman) project from the book Practical DWR 2 Projects
    by Frank W. Zammetti, published by Apress, Inc. in 2008.

    Fileman is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    Fileman is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see
    http://www.gnu.org/licenses/old-licenses/gpl-2.0.html.
  */
%>

<%@ page import="java.io.File" %>

<%
  // Get the system-specific path separator, we'll need it later.
  String pathSeparator = File.separator;
  if (pathSeparator.equals("\\")) {
    pathSeparator = "\\\\";
  }
%>

<html>
  <head>
    <title>DWR File Manager</title>

    <!-- Import all Javascript needed. -->
    <script src="dwr/interface/FileSystemFunctions.js"></script>
    <script src="dwr/engine.js"></script>
    <script src="dwr/util.js"></script>
    <script src="js/Fileman.js"></script>
    <script src="js/dhtmlXCommon.js"></script>
    <script src="js/dhtmlXGrid.js"></script>
    <script src="js/dhtmlXGridCell.js"></script>
    <script src="js/dhtmlXTree.js"></script>
    <script src="js/dhtmlXProtobar.js"></script>
    <script src="js/dhtmlXToolbar.js"></script>
    <script src="js/dhtmlXMenuBar.js"></script>
    <script src="js/dhtmlXMenuBar_cp.js"></script>

    <!-- Import all stylesheets needed. -->
    <link rel="stylesheet" type="text/css" href="css/dhtmlXGrid.css">
    <link rel="stylesheet" type="text/css" href="css/dhtmlXTree.css">
    <link rel="stylesheet" type="text/css" href="css/dhtmlXToolbar.css">
    <link rel="stylesheet" type="text/css" href="css/dhtmlXMenu.css">
    <link rel="stylesheet" type="text/css" href="css/styles.css">

  </head>

  <body class="cssBody" onLoad="fileman.init('<%=pathSeparator%>');"
    onResize="fileman.onResize();">

    <!-- File editor. -->
    <div id="divFileEditor" class="cssFullScreenDiv" style="display:none;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%"
        height="100%">
        <tr><td align="center" valign="middle">
          <textarea id="taFileEditor" rows="20" cols="100"></textarea>
          <br>
          <input type="button" value="Save File" onClick="fileman.saveFile();">
          &nbsp;&nbsp;&nbsp;&nbsp;
          <input type="button" value="Cancel"
            onClick="dwr.util.byId('divFileEditor').style.display='none';">
        </td></tr>
      </table>
    </div>

    <!-- Upload file. -->
    <div id="divFileUpload" class="cssFullScreenDiv" style="display:none;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%"
        height="100%">
        <tr><td align="center" valign="middle">
          <h1>Upload a file</h1>
          <br>
          <form action="uploadFile.jsp" method="post"
            enctype="multipart/form-data" target="_new">
            <input type="hidden" name="uploadDirectory">
            File to upload: <input type="file" name="theFile">
            <br><br>
            <input type="submit" value="Upload file">
            &nbsp;&nbsp;&nbsp;&nbsp;
            <input type="button" value="Cancel"
              onClick="dwr.util.byId('divFileUpload').style.display='none';">
          </form>
        </td></tr>
      </table>
    </div>

    <table width="100%" height="100%" border="0" cellpadding="0"
      cellspacing="0">

      <!-- Menu and toolbar. -->
      <tr>
        <td colspan="3" height="60" align="left" valign="top">
          <div class="cssMenu" id="divMenu"></div>
          <div class="cssToolbar" id="divToolbar"></div>
        </td>
      </tr>

      <!-- Directory tree and file grid. -->
      <tr>
        <td width="25%">
          <div class="cssDirectories" id="divDirectories"></div>
        </td>
        <td width="2" class="cssDivider">&nbsp;</td>
        <td width="75%">
          <div class="cssFiles" id="divFiles"></div>
        </td>
      </tr>

    </table>

  </body>

</html>
