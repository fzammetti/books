<%@ page language="java" import="com.apress.ajaxprojects.ajaxwarrior.gameobjects.ClientSideGameState" %>

<html>

  <head>

    <title>AJAX Warrior</title>

    <link rel="StyleSheet" href="css/styles.css" type="text/css" media="screen">

    <script type="text/javascript" src="js/GlobalsObject.jsp"></script>
    <script type="text/javascript" src="js/XHRObject.js"></script>
    <script type="text/javascript" src="js/GameStateObject.js"></script>
    <script type="text/javascript" src="js/Vars.js"></script>
    <script type="text/javascript" src="js/UtilsObject.js"></script>
    <script type="text/javascript" src="js/ActivityScroll.js"></script>
    <script type="text/javascript" src="js/BattleFuncs.js"></script>
    <script type="text/javascript" src="js/StoreFuncs.js"></script>
    <script type="text/javascript" src="js/KeyHandler.js"></script>
    <script type="text/javascript" src="js/Conversation.js"></script>
    <script type="text/javascript" src="js/SendAJAX.js"></script>
    <script type="text/javascript" src="js/SwitchWeapon.js"></script>
    <script type="text/javascript" src="js/CastSpell.js"></script>
    <script type="text/javascript" src="js/ViewChangeFuncs.js"></script>
    <script type="text/javascript" src="js/GameFuncs.js"></script>
    <script type="text/javascript" src="js/Init.js"></script>

<script>
<%
  // If the "clientSideGameState" string is found in request, then we are here
  // as a result of the player continuing a saved game.  In that case, we
  // need to reconstitute the gameState object.  To do that, we create a
  // JavaScript variable that is null if this is a new game, or is the string
  // version of the gameState object.  This variable is passed to init(), which
  // will call reconstitute() on the gameState instance if continuing a game.
  ClientSideGameState clientSideGameState =
    (ClientSideGameState)request.getAttribute("clientSideGameState");
  if (clientSideGameState != null) {
    out.println("var clientSideGameState = \"" +
      clientSideGameState.getAsClientString() + "\";");
  } else {
    out.println("var clientSideGameState = null;");
  }
%>
</script>

  </head>

  <body onLoad="init(clientSideGameState);" class="cssPage">

    <!-- The div the game is contained in. -->
    <div id="divGame" class="cssGame">
      <!-- The border around the game area. -->
      <div id="divBorder" class="cssBorder"><img src="img/border_talking.gif"
        id="imgBorder" alt="border"></div>
      <!-- The game map area. -->
      <div id="divMap" class="cssMap"></div>
      <!-- The image of a character when talking to them.. -->
      <img id="imgCharacter" class="cssImgCharacter" src="img/transparent.gif"
        alt="character">
      <!-- The character interaction (player replies) view area. -->
      <div id="divTalkingReplies" class="cssTalkingReplies"></div>
      <!-- The inventory view div. -->
      <div id="divInventory" class="cssInventory"></div>
      <!-- The spell casting view div. -->
      <div id="divSpellCasting" class="cssSpellCasting"></div>
      <!-- The weapon switching view div. -->
      <div id="divWeaponSwitching" class="cssWeaponSwitching"></div>
      <!-- The store view div. -->
      <div id="divStore" class="cssStore"></div>
      <!-- The help view div. -->
      <div id="divHelp" class="cssHelp"></div>
      <!-- The game end view div. -->
      <div id="divGameEnd" class="cssGameEnd"></div>
      <!-- The warrior name section. -->
      <div id="divName" class="cssWarriorName">&nbsp;</div>
      <!-- The warrior health section. -->
      <div id="divHealth" class="cssWarriorHealth">&nbsp;</div>
      <!-- The warrior hit points section. -->
      <div id="divHitPoints" class="cssWarriorHitPoints">&nbsp;</div>
      <!-- The warrior gold section. -->
      <div id="divGoldPieces" class="cssWarriorGold">&nbsp;</div>
      <!-- The activity scroll section. -->
      <div id="divActivityScroll" class="cssActivityScroll"></div>
    </div>

  </body>

</html>