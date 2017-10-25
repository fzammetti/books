<html>
  <head>
    <title>In Memoria</title>

    <link rel="StyleSheet" href="css/styles.css" type="text/css">
    <script type="text/javascript" src="js/InMemoria.js"></script>

    <!-- DWR imports. -->
    <script src="dwr/engine.js"></script>
    <script src="dwr/util.js"></script>
    <script src="dwr/interface/GameCore.js"></script>
    <script src="dwr/interface/Opponent.js"></script>

    <!-- Button image preloads. -->
    <script>
      var btnStart0 = new Image(179, 50);
      var btnStart1 = new Image(179, 50);
      btnStart0.src = "img/btnStart0.gif";
      btnStart1.src = "img/btnStart1.gif";
      var btnHowToPlay0 = new Image(120, 50);
      var btnHowToPlay1 = new Image(120, 50);
      btnHowToPlay0.src = "img/btnHowToPlay0.gif";
      btnHowToPlay1.src = "img/btnHowToPlay1.gif";
    </script>

  </head>

  <body onLoad="inMemoria.init();" class="cssBody">

    <table cellpadding="0" cellspacing="0" align="center" height="100%"
      width="700" height="500"><tr><td align="center" valign="middle"
        class="cssContainer">

      <!-- Title. -->
      <div><img src="img/title.gif" vspace="10"></div>

      <!-- Play grids. -->
      <table border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" class="cssGridHeader">Player</td>
          <td>&nbsp;</td>
          <td align="center" class="cssGridHeader">Opponent</td>
        </tr>
        <tr><td class="cssGridDivider"></td></tr>
        <tr>
          <td width="320" align="center" valign="middle" id="divPlayer"></td>
          <td width="30">&nbsp;</td>
          <td width="320" align="center" valign="middle" id="divOpponent"></td>
        </tr>
      </table>

      <!-- Buttons. -->
      <img src="img/btnStart0.gif" hspace="80" vspace="10"
        onClick="inMemoria.startGame();"
        onMouseOver="this.style.cursor='pointer';this.src=btnStart1.src;"
        onMouseOut="this.style.cursor='';this.src=btnStart0.src;">
      <img src="img/btnHowToPlay0.gif" hspace="80" vspace="10"
        onClick="inMemoria.howToPlay();"
        onMouseOver="this.style.cursor='pointer';this.src=btnHowToPlay1.src;"
        onMouseOut="this.style.cursor='';this.src=btnHowToPlay0.src;">

    </td></tr></table>

  </body>

</html>
