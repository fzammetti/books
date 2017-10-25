<%@ page language="java" %>

<html>

  <head>

    <title>AJAXWarrior</title>

    <script type="text/javascript">


      // Image preloads.
      img_button_the_story_0 = new Image();
      img_button_the_story_0.src = "img/button_the_story_0.gif";
      img_button_the_story_1 = new Image();
      img_button_the_story_1.src = "img/button_the_story_1.gif";
      img_button_how_to_play_0 = new Image();
      img_button_how_to_play_0.src = "img/button_how_to_play_0.gif";
      img_button_how_to_play_1 = new Image();
      img_button_how_to_play_1.src = "img/button_how_to_play_1.gif";
      img_button_important_notes_0 = new Image();
      img_button_important_notes_0.src = "img/button_important_notes_0.gif";
      img_button_important_notes_1 = new Image();
      img_button_important_notes_1.src = "img/button_important_notes_1.gif";
      img_button_new_game_0 = new Image();
      img_button_new_game_0.src = "img/button_new_game_0.gif";
      img_button_new_game_1 = new Image();
      img_button_new_game_1.src = "img/button_new_game_1.gif";
      img_button_continue_game_0 = new Image();
      img_button_continue_game_0.src = "img/button_continue_game_0.gif";
      img_button_continue_game_1 = new Image();
      img_button_continue_game_1.src = "img/button_continue_game_1.gif";

      // Variables used for scrolling.
      var vs_scroll_speed     = 20;    // # of pixels moved per second
      var vs_interval_id      = 0;     // ID of interval timer
      var vs_milliseconds     = 0;     // Milliseconds that interval fires as
      var vs_contents_top     = 0;     // Current top location of content layer
      var vs_contents_height  = 0;     // Height of contents layer
      var vs_container_height = 0;     // Height the container layer
      var vs_pause            = false; // Used for pausing on MouseOver events
      var vs_contain          = null;
      var vs_content          = null;


      /**
       * Initialize the page.  Center the scrolling area and start the scroller.
       */
      function init() {

        vs_contain = document.getElementById("vs_container");
        vs_content = document.getElementById("vs_contents");
        layerCenterH(vs_contain);
        layerCenterH(document.getElementById("controls"));
        <% if (request.getAttribute("Error") != null) { %>
        alert("<%=request.getAttribute("Error")%>");
        <% } %>
        switchContents("theStory");

      } // End init().


      /**
       * Switches what is seen in the scroller.
       */
      function switchContents(inWhichText) {

        stopScroller();
        vs_content.innerHTML = document.getElementById(inWhichText).innerHTML;
        resetScroller();
        startScroller();

      } // End switchScrollText();


      /**
       * Center a given layer on the screen horizontally.
       */
      function layerCenterH(layerCenterObj) {

        var lca;
        var lcb;
        var lcx;
        var iebody;
        var dsocleft;
        if (window.innerWidth) {
          lca = window.innerWidth;
        } else {
          lca = document.body.clientWidth;
        }
        lcb = layerCenterObj.offsetWidth;
        lcx = (Math.round(lca / 2)) - (Math.round(lcb / 2));
        iebody = (document.compatMode &&
          document.compatMode != "BackCompat") ?
          document.documentElement : document.body;
        dsocleft = document.all ? iebody.scrollLeft : window.pageXOffset;
        layerCenterObj.style.left = lcx + dsocleft + "px";

      } // End layerCenterH().


      /**
       * Validate if the name entered by the user is valid.
       */
      function checkName(inPlayerName) {

        // Make sure they entered something.
        if (inPlayerName == "") {
          alert("I'm sorry but you must enter a name to continue");
          return false;
        }
        // Only the following characters are allowed in a player's name.
        var allowed =
          " 0123456789-_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (i = 0; i < inPlayerName.length; i++) {
          if (allowed.indexOf(inPlayerName.charAt(i)) == -1) {
            alert("I'm sorry but a name may only contain the characters" +
              "\n\na-z, A-Z, 0-9, - (dash), _ (underscore) and space");
            return false;
          }
        }
        document.getElementById("mainContent").style.display = "none";
        document.getElementById("pleaseWait").style.display = "block";
        return true;

      } // End checkName().


      /**
       * Called to reset the scroller at the start, or when contents switched.
       */
      function resetScroller() {

        // Determine milliseconds
        vs_milliseconds = 1000 / vs_scroll_speed;
        // Get height of container
        vs_container_height = vs_contain.style.height.substr(0,
          vs_contain.style.height.length - 2);
        // Get height of contents
        vs_contents_height = vs_content.scrollHeight;
        // Start off bottom
        vs_contents_top = (1 * vs_container_height) + 20;
        vs_content.style.top = vs_contents_top;
        // Make contents visibile
        vs_content.style.visibility = "visible";

      } // End resetScroller().


      /**
       * Called to start the scroller
       */
      function startScroller() {

        // Start timer
        vs_interval_id = setInterval('doScroller()', vs_milliseconds);

      } // End startScroller().


      /**
       * Called to stop the scroller.
       */
      function stopScroller() {

        // Simply clear the interval to stop it.  We also hide the contents.
        clearInterval(vs_interval_id);
        vs_content.style.visibility = "hidden";

      } // End stopScroller().


      /**
       * Called by the interval timer to actually do the scroller
       */
      function doScroller() {

        // Only do this if we're not paused
        if (!vs_pause) {
          // Move up one pixel
          vs_contents_top--;
          // If we've scrolled off the top, reset to off the bottom
          if (vs_contents_top < -vs_contents_height) {
            vs_contents_top = (1 * vs_container_height) + 20;
          }
          // Reposition contents layer
          vs_content.style.top = vs_contents_top;
        }

      } // End doScroller().


    </script>

  </head>

  <body onLoad="init();" style="font-size:10pt;font-weight:bold;">

    <div id="pleaseWait" style="display:none;font-size:18pt;font-weight:bold;">
      Please wait, starting game...
    </div>

    <div id="mainContent" style="display:block;">

      <center>
        <img src="img/title.gif" alt="title">
      </center>

      <span id="vs_container" onMouseOver="vs_pause=true;"
        onMouseOut="vs_pause=false;"
        style="position:absolute;left:10px;top:230px;width:600px;height:230px;background-color:#f0f0f0;overflow:hidden">
        <span id="vs_contents"
          style="position:absolute;left:0;top:0;font-size:12pt;visibility:hidden;">
        </span>
      </span>

      <div id="controls" style="position:absolute;top:464px;font-size:9pt;font-weight:bold;">
        <center>
          <b>Hover over scroller to pause it</b>
          <br><br>
          <input type="image" src="img/button_the_story_0.gif"
            onMouseOver="this.src=img_button_the_story_1.src;"
            onMouseOut="this.src=img_button_the_story_0.src;"
            onClick="switchContents('theStory');">
          &nbsp;&nbsp;
          <input type="image" src="img/button_how_to_play_0.gif"
            onMouseOver="this.src=img_button_how_to_play_1.src;"
            onMouseOut="this.src=img_button_how_to_play_0.src;"
            onClick="switchContents('howToPlayTheGame');">
          &nbsp;&nbsp;
          <input type="image" src="img/button_important_notes_0.gif"
            onMouseOver="this.src=img_button_important_notes_1.src;"
            onMouseOut="this.src=img_button_important_notes_0.src;"
            onClick="switchContents('notes');">
          <br><br><br>
          <table align="center" border="0" cellpadding="0" cellspacing="0"
            style="font-size:10pt;font-weight:bold;">
            <tr>
              <td align="center">
                <form name="startGame" method="post" action="startGame.command"
                  onSubmit="return checkName(playerName.value);">
                  <input type="hidden" name="whatFunction">
                  Your name:
                  <input type="text" name="playerName"
                    style="font-size:10pt;font-weight:bold;">
                  <br><br>
                  <input type="image" name="newGame" value="yes"
                    src="img/button_new_game_0.gif"
                    onClick="form.whatFunction.value='newGame';"
                    onMouseOver="this.src=img_button_new_game_1.src;"
                    onMouseOut="this.src=img_button_new_game_0.src;">
                  &nbsp;&nbsp;
                  <input type="image" name="continueGame" value="yes"
                    src="img/button_continue_game_0.gif"
                    onClick="form.whatFunction.value='continueGame';"
                    onMouseOver="this.src=img_button_continue_game_1.src;"
                    onMouseOut="this.src=img_button_continue_game_0.src;">
                </form>
              </td>
            </tr>
          </table>
        </center>
      </div>

      <jsp:include page="theStory.htm" flush="true" />

      <jsp:include page="howToPlay.htm" flush="true" />

      <jsp:include page="notes.htm" flush="true" />

    </div>

  </body>

</html>