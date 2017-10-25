<html>
<head>
  <title>DWiki Login Successful</title>
  <script>
    function processLogin() {
      opener.document.getElementById("userInfo").innerHTML =
        "<%=request.getUserPrincipal().getName()%>";
    }
  </script>
</head>
<body onLoad="processLogin();">
  <img src="img/logo.gif" border="0">
  <br><br>
  You have been successfully logged in to DWiki.  You may now create and edit
  articles.  Please click
  <a href="javascript:void(0);" onClick="window.close();">HERE</a>
  to close this window and return to DWiki.
</body>
</html>
