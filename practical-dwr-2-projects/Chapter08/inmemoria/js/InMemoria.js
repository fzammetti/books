/**
 * Core client-side game code class for In Memoria.
 */
function InMemoria() {


  /**
   * Array of preloaded tile images.
   */
  this.tileImages = new Array();


  /**
   * Array of preloaded explosion images.
   */
  this.explosionImages = new Array();


  /**
   * Reference to interval for when no game is in progress.
   */
  this.noGameInProgressInterval = null;


  /**
   * Flag: Should player clicks be processed (true) or not (false)?
   */
  this.playerProcessClicks = false;


  /**
   * Array of values of each tile (0-41) for the player grid.
   */
  this.playerTileValues = new Array();


  /**
   * Records the first tile flipped by the player.
   */
  this.playerFlippedTile1 = null;


  /**
   * Records the second tile flipped by the player.
   */
  this.playerFlippedTile2 = null;


  /**
   * Reference to interval for player explosion.
   */
  this.playerExplosionInterval = null;


  /**
   * Current animation frame of explosion cycle for player.
   */
  this.playerExplosionFrame = null;


  /**
   * Current direction of player explosion frame cycling.
   * True is increasing, false is decreasing.
   */
  this.playerExplosionDir = null;


  /**
   * Records the first tile flipped by the opponent.
   */
  this.opponentFlippedTile1 = null;


  /**
   * Records the second tile flipped by the opponent.
   */
  this.opponentFlippedTile2 = null;


  /**
   * Reference to interval for opponent explosion.
   */
  this.opponentExplosionInterval = null;


  /**
   * Current animation frame of explosion cycle for opponent.
   */
  this.opponentExplosionFrame = null;


  /**
   * Current direction of opponent explosion frame cycling.
   * True is increasing, false is decreasing.
   */
  this.opponentExplosionDir = null;


  /**
   * Initialize the app on load.
   */
  this.init = function() {

    // Kick off DWR reverse-ajax (Comet).
    dwr.engine.setActiveReverseAjax(true);

    // Preload tile images.  0 is always unflipped.
    var img = new Image(48, 48);
    img.src = "img/tileUnflipped.gif";
    this.tileImages.push(img);
    for (var i = 1; i < 22; i++) {
      img = new Image(48, 48);
      img.src = "img/tile" + i + ".gif";
      this.tileImages.push(img);
    }

    // Preload explosion images.
    for (var i = 0; i < 5; i++) {
      img = new Image(48, 48);
      img.src = "img/explosion" + i + ".gif";
      this.explosionImages.push(img);
    }

    // Create player and opponent grids.
    var refPlayer = dwr.util.byId("divPlayer");
    var refOpponent = dwr.util.byId("divOpponent");
    var tileIndex = 1;
    for (var y = 0; y < 7; y++) {
      for (var x = 0; x < 6; x++) {
        // Player tile.
        img = document.createElement("img");
        img.setAttribute("id", "tilePlayer_" + tileIndex);
        img.setAttribute("src", "img/tileUnflipped.gif");
        img.setAttribute("hspace", "2");
        img.setAttribute("vspace", "1");
        img.setAttribute("style", "cursor:pointer");
        refPlayer.appendChild(img);
        // Opponent tile.
        img.onclick = inMemoria.tileClick;
        img = document.createElement("img");
        img.setAttribute("id", "tileOpponent_" + tileIndex);
        img.setAttribute("src", "img/tileUnflipped.gif");
        img.setAttribute("hspace", "2");
        img.setAttribute("vspace", "1");
        refOpponent.appendChild(img);
        tileIndex++;
      }
      refPlayer.appendChild(document.createElement("br"));
      refOpponent.appendChild(document.createElement("br"));
    }

    // Start interval for randomly cycling tiles waiting for game to start.
    inMemoria.randomlyCycleTiles();

  } // End init().


  /**
   * A little effect while waiting for a new game to start.
   */
  this.randomlyCycleTiles = function() {

    if (this.noGameInProgressInterval == null) {

      this.noGameInProgressInterval =
        setInterval("inMemoria.randomlyCycleTiles()", 500);

    } else {

      // Randomly choose a tile image for every tile and show it.
      for (var i = 1; i < 43; i++) {
        // Do player grid first, and then opponent grid.
        var tile = null;
        var newValue = null;
        // Only update the next tile 50% of the time.
        if (Math.round(0 + (1 - 0) * Math.random()) == 1) {
          // Choose one of the 21 tile types.
          tile = dwr.util.byId("tilePlayer_" + i);
          newValue = Math.round(1 + (21 - 1) * Math.random());
          tile.src = this.tileImages[newValue].src;
        }
        // Only update the next tile 50% of the time.
        if (Math.round(0 + (1 - 0) * Math.random()) == 1) {
          // Choose one of the 21 tile types.
          tile = dwr.util.byId("tileOpponent_" + i);
          newValue = Math.round(1 + (21 - 1) * Math.random());
          tile.src = this.tileImages[newValue].src;
        }
      }

    }

  } // End randomlyCycleTiles().


  /**
   * Start a new game.
   */
  this.startGame = function() {

    // Call server to get randomized grids, and kick off the game.
    GameCore.startGame( {
      callback : function(inResp) {

        // Stop the little effect seen while waiting for a game to start.
        clearInterval(inMemoria.noGameInProgressInterval);

        // Set tiles for player grid and reset states and images to unflipped.
        inMemoria.playerTileValues = new Array();
        inMemoria.playerTileValues.push(0);
        for (var i = 1; i < 43; i++) {
          inMemoria.playerTileValues.push(inResp[i - 1]);
          inMemoria.playerFlippedTile1 = null;
          inMemoria.playerFlippedTile2 = null;
          var tile = dwr.util.byId("tilePlayer_" + i);
          tile.src = inMemoria.tileImages[0].src;
          tile.style.visibility = "visible";
        }

        // Now do the same for the opponent grid.
        for (var i = 1; i < 43; i++) {
          var tile = dwr.util.byId("tileOpponent_" + i);
          tile.src = inMemoria.tileImages[0].src;
          tile.style.visibility = "visible";
        }

        // Begin processing player tile clicks.
        inMemoria.playerProcessClicks = true;

      }
    } );

  } // End startGame().


  /**
   * A tile was clicked.
   */
  this.tileClick = function() {

    // Abort if player clicks are blocked (during explosions and unflipping).
    if (!inMemoria.playerProcessClicks) { return; }

    // Get index of clicked tile.
    var tileIndex = this.id.split("_")[1];

    // No tile is currently flipped...
    if (inMemoria.playerFlippedTile1 == null) {

      // Set image based on tile value.
      this.src =
        inMemoria.tileImages[inMemoria.playerTileValues[tileIndex]].src;
      // Record currently flipped.
      inMemoria.playerFlippedTile1 = tileIndex;

    // OK, a tile is already flipped, so...
    } else {

      // Is the tile already flipped the one that was clicked?
      if (inMemoria.playerFlippedTile1 == tileIndex) {

        // Yes it was...unflip this, and any other flipped tile.
        inMemoria.unFlip(inMemoria.playerFlippedTile1,
          inMemoria.playerFlippedTile2, "Player");

      } else {

        // Nope, two tiles are now effectively flipped.  First, show this one
        // as flipped too and block any further player clicks for now.
        inMemoria.playerProcessClicks = false;
        inMemoria.playerFlippedTile2 = tileIndex;
        this.src =
          inMemoria.tileImages[inMemoria.playerTileValues[tileIndex]].src;

        // Now, check for a match.
        if (inMemoria.playerTileValues[inMemoria.playerFlippedTile1] ==
          inMemoria.playerTileValues[inMemoria.playerFlippedTile2]) {

          // Match, so do explosion.
          inMemoria.playerExplosionFrame = 0;
          inMemoria.playerExplosionDir = true;
          inMemoria.playerExplosionInterval =
            setInterval("inMemoria.cyclePlayerExplosion()", 100);

        } else {

          // No match, so pause for half a second and unflip them both.
          setTimeout("inMemoria.unFlip(inMemoria.playerFlippedTile1, " +
            "inMemoria.playerFlippedTile2, 'Player');", 500);

        }

      }

    }

  } // End tileClick().


  /**
   * Called to unflip two non-matching tiles for the player or opponent.
   *
   * @param inTile1            Index of the first tile to unflip.
   * @param inTile2            Index of the second tile to unflip.
   * @param inPlayerOrOpponent Specifies whether we're unflipping tiles for
   *                           the "Player" or the "Opponent".
   */
  this.unFlip = function(inTile1, inTile2, inPlayerOrOpponent) {

    if (inTile1 != null) {
      dwr.util.byId("tile" + inPlayerOrOpponent + "_" + inTile1).src =
        inMemoria.tileImages[0].src;
    }
    if (inTile2 != null) {
      dwr.util.byId("tile" + inPlayerOrOpponent + "_" + inTile2).src =
        inMemoria.tileImages[0].src;
    }
    if (inPlayerOrOpponent == "Player") {
      inMemoria.playerFlippedTile1 = null;
      inMemoria.playerFlippedTile2 = null;
      inMemoria.playerProcessClicks = true;
    }

  } // End unFlip().


  /**
   * Do explosion animation cycle when clearing tiles for the player.
   */
  this.cyclePlayerExplosion = function() {

    if (inMemoria.playerExplosionDir) {

      // Increment to next frame.
      inMemoria.playerExplosionFrame++;
      // Reverse direction when it's time.
      if (inMemoria.playerExplosionFrame == 4) {
        inMemoria.playerExplosionDir = false;
      }

    } else {

      // Decrement to next frame.
      inMemoria.playerExplosionFrame--;
      // When animation cycle is done, remove tiles and reset vars.
      if (inMemoria.playerExplosionFrame < 0) {
        clearInterval(inMemoria.playerExplosionInterval);
        dwr.util.byId("tilePlayer_" +
          inMemoria.playerFlippedTile1).style.visibility = "hidden";
        dwr.util.byId("tilePlayer_" +
          inMemoria.playerFlippedTile2).style.visibility = "hidden";
        inMemoria.playerFlippedTile1 = null;
        inMemoria.playerFlippedTile2 = null;
        inMemoria.playerProcessClicks = true;
        // Call server to check for win.
        inMemoria.checkForWin();
        return;
      }

    }

    // Show explosion frame on both flipped tiles.
    dwr.util.byId("tilePlayer_" +
      inMemoria.playerFlippedTile1).src =
      inMemoria.explosionImages[inMemoria.playerExplosionFrame].src;
    dwr.util.byId("tilePlayer_" +
      inMemoria.playerFlippedTile2).src =
      inMemoria.explosionImages[inMemoria.playerExplosionFrame].src;

  } // End cyclePlayerExplosion().


  /**
   * Do explosion animation cycle when clearing tiles for the opponent.
   */
  this.cycleOpponentExplosion = function() {

    if (inMemoria.opponentExplosionDir) {

      // Increment to next frame.
      inMemoria.opponentExplosionFrame++;
      // Reverse direction when it's time.
      if (inMemoria.opponentExplosionFrame == 4) {
        inMemoria.opponentExplosionDir = false;
      }

    } else {

      // Decrement to next frame.
      inMemoria.opponentExplosionFrame--;
      // When animation cycle is done, remove tiles and reset vars.
      if (inMemoria.opponentExplosionFrame < 0) {
        clearInterval(inMemoria.opponentExplosionInterval);
        dwr.util.byId("tileOpponent_" +
          inMemoria.opponentFlippedTile1).style.visibility = "hidden";
        dwr.util.byId("tileOpponent_" +
          inMemoria.opponentFlippedTile2).style.visibility = "hidden";
        // Call server to confirm completion.
        Opponent.outcomeComplete();
        return;
      }

    }

    // Show explosion frame on both flipped tiles.
    dwr.util.byId("tileOpponent_" + inMemoria.opponentFlippedTile1).src =
      inMemoria.explosionImages[inMemoria.opponentExplosionFrame].src;
    dwr.util.byId("tileOpponent_" + inMemoria.opponentFlippedTile2).src =
      inMemoria.explosionImages[inMemoria.opponentExplosionFrame].src;

  } // End cycleOpponentExplosion().


  /**
   * Called to see if the player one the game.
   */
  this.checkForWin = function() {

    GameCore.checkForWin( {
      callback : function(inResp) {
        if (inResp) {
          alert("Congratulations, you won!");
        }
      }
    } );

  } // End checkForWin().


  /**
   * Called from server when the opponent has picked a tile.
   *
   * @param inSelectionNumber Whether this is the first (1) tile or second (2).
   * @param inTileIndex       Index number of the tile in the tile array.
   * @param inImageIndex      Index into the images array for the tile.
   */
  this.opponentFlipTile = function(inSelectionNumber, inTileIndex,
    inImageIndex) {

    inTileIndex++;
    dwr.util.byId("tileOpponent_" + inTileIndex).src =
      this.tileImages[inImageIndex].src;
    Opponent.confirmFlip(inSelectionNumber);

  } // End opponentFlipTile().


  /**
   * Called from server when the opponent hasn't found a match.
   *
   * @param inTile1 The first tile the opponent currently has flipped.
   * @param inTile2 The second tile the opponent currently has flipped.
   */
  this.opponentNoMatch = function(inTile1, inTile2) {

    inTile1++;
    inTile2++;
    this.unFlip(inTile1, inTile2, "Opponent");
    Opponent.outcomeComplete();

  } // End opponentNoMatch().


  /**
   * Called from server when the opponent has found a match.
   *
   * @param inTile1 The first tile the opponent currently has flipped.
   * @param inTile2 The second tile the opponent currently has flipped.
   */
  this.opponentMatch = function(inTile1, inTile2) {

    inTile1++;
    inTile2++;
    inMemoria.opponentFlippedTile1 = inTile1;
    inMemoria.opponentFlippedTile2 = inTile2;
    inMemoria.opponentExplosionFrame = 0;
    inMemoria.opponentExplosionDir = true;
    inMemoria.opponentExplosionInterval =
      setInterval("inMemoria.cycleOpponentExplosion()", 100);

  } // End opponentMatch().


  /**
   * Called from server when the opponent has cleared the board.
   */
  this.opponentWon = function() {

    inMemoria.playerProcessClicks = false;
    alert("Sorry, your opponent has defeated you.  Try again, puny human!");

  } // End opponentWon().


  /**
   * Show the How To Play information.
   */
  this.howToPlay = function() {

    GameCore.howToPlay( {
      callback : function(inResp) {
        alert(inResp);
      }
    } );

  } // End howToPlay().


} // End InMemoria.


// The one and only instance of InMemoria.
inMemoria = new InMemoria();
