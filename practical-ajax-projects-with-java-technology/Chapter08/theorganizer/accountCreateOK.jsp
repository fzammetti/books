<%@ taglib prefix="ww" uri="webwork" %>

<html>

  <head>
    <title>The Organizer</title>
    <link rel="stylesheet" href="css/styles.css" type="text/css">
    <script type="text/javascript" src="js/buttonsAndTabs.js"></script>
    <script>
      var tabsButtonsEnabled = true;
      var rolloverImages = new Array();
    </script>
  </head>

  <body class="cssMain" onLoad="createRolloverImages('ok');">
    <center>
      <br>
      <img src="img/title.gif">
      <br><br><br><br><br><br><br><br><br><br>
      Your account has been created.  You may now use The Organizer.
      <br><br><br><br>
      <input type="image" src="img/ok0.gif" id="ok"
        onmouseover="rollover(this);" onmouseout="rollout(this);"
        onclick="window.location='accountCreatedOK.action';return false;">
    </center>
  </body>

</html>
