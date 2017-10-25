<html>
  <head>
    <title></title>
  </head>
  <body>
    <img src="img/logo.gif" border="0">
    <br><br>
    <%
      if (request.getParameter("login_bad") != null) {
    %>
        <font color="#ff0000">Login invalid.  Please try again.</font>
    <%
      } else {
    %>
        Please log in to DWiki:
    <%
      }
    %>
    <br><br>
    <form name="j_security_check" method="post" action="j_security_check">
      <table border="0" cellpadding="2" cellspacing="2">
        <tr>
          <td width="1">Username:&nbsp;</td>
          <td><input type="text" name="j_username" value="" size="11"
            maxlength="10"></td>
        </tr>
        <tr>
          <td>Password:&nbsp;</td>
          <td><input type="password" name="j_password" value="" size="11"
            maxlength="10"><br>
        </tr>
        <tr>
          <td colspan="2" align="right">
            <input type="submit" value="Login">
          </td>
        </tr>
      </table>
    </form>
  </body>
</html>
