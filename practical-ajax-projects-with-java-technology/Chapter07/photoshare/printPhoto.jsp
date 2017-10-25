<html>
  <head>
    <title>PhotoShare - Print Photo</title>
    <!-- Link in stylesheet. -->
    <link rel="stylesheet" href="css/styles.css" type="text/css">
  </head>
  <body onLoad="window.print();" class="cssMainNoPadding">
    <table width="100%" height="100%" cellpadding="0" cellspacing="0" 
      border="0">
      <tr>
        <td align="center" valign="middle">
          <img src="photos/<%=request.getParameter("filename")%>">
        </td>
      </tr>
    </table>
  </body>
</html>
