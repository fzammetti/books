/**
 * This class contains all the actual game logic.
 */
function GameClass() {


  // The GraphicsSubsystem instance.
  var gss = new GraphicsSubsystem();

  // The LevelMaps instance.
  var levelMaps = new LevelMaps();

  // Difficulty level being played on (1-3, 3=easy, 2=medium, 1=hard).
  var difficulty = null;

  // The current level (0-3) game is on.
  var currentLevel = 0;

  // Blob location.
  var blobX = null;
  var blobY = null;

  // What direction will the blob move next iteration?
  this.blobNextMove = null;

  // Is the game currently running?
  this.gameRunning = false;

  // The current value of the move countdown.
  this.countdownValue = null;

  // The game Timer.
  this.gameTimer = null;


  /**
   * Initialize the game.
   */
  this.init = function() {

    // Create game timer and define it's onTick handler.
    game.gameTimer = new dojox.timing.Timer();
    game.gameTimer.setInterval(100);
    game.gameTimer.onTick = function() {
      dojo.byId("countdownDisplay").innerHTML = game.countdownValue / 100;
      game.countdownValue = game.countdownValue - 100;
      if (game.countdownValue == 0) {
        game.gameTimer.stop();
        game.moveBlob();
        if (game.gameRunning) {
          game.countdownValue = difficulty * 1000;
          game.gameTimer.start();
        }
      }
    };

    // Initialize graphics subsystem.
    gss.init();

    // Prepare the welcome dialog's two surfaces, one for each page.
    this.prepareWelcomeOne();
    this.prepareWelcomeTwo();

    // Show the first Welcome dialog.
    dijit.byId("WelcomeOneDialog").show();

  } // End init().


  /**
   * Populates the surface for the first welcome dialog page.
   */
  this.prepareWelcomeOne = function() {

    // Create the surface for page one.  Note different widths for IE vs. FF.
    var surface = dojox.gfx.createSurface(
      "divWelcomeOneSurface", (dojo.isIE?540:445), 400);

    // Title.
    gss.drawText(surface, (dojo.isIE?90:60), 30, 20, "red",
      "Welcome to The Idiot Blob");

    // First paragraph.
    gss.drawText(surface, 5, 80, 12, "black",
      "Your pet idiot blob, Qwamp, has wondered into the Cave of the");
    gss.drawText(surface, 5, 100, 12, "black",
      "Elements.  You're job is to guide him to safety through the four");
    gss.drawText(surface, 5, 120, 12, "black",
      "chambers of the cave: Fire, Water, Air and Earth.");

    // Second paragraph.
    gss.drawText(surface, 5, 160, 12, "black",
      "Idiot Blobs are known throughout the galaxy as great pets with");
    gss.drawText(surface, 5, 180, 12, "black",
      "one serious flaw: THEY ARE TOTAL IDIOTS!  They cannot");
    gss.drawText(surface, 5, 200, 12, "black",
      "think for themselves at all.  Therefore, you must tell Qwamp");
    gss.drawText(surface, 5, 220, 12, "black",
      "what to do each step of the way.  Being an idiot though, he will");
    gss.drawText(surface, 5, 240, 12, "black",
      "do what you tell him to do, and will keep doing it, until you tell");
    gss.drawText(surface, 5, 260, 12, "black",
      "him to do something else.");

    // Third paragraph.
    gss.drawText(surface, 5, 300, 12, "black",
      "This would be OK except that the only way through the cave is");
    gss.drawText(surface, 5, 320, 12, "black",
      "along a narrow, maze-like bridge that is easy to fall off, that");
    gss.drawText(surface, 5, 340, 12, "black",
      "has dead ends everywhere and which has alien skulls everywhere");
    gss.drawText(surface, 5, 360, 12, "black",
      "that if touched means instant death for Qwamp.");

  } // End prepareWelcomeOne().


  /**
   * Populates the surface for the first welcome dialog page.
   */
  this.prepareWelcomeTwo = function() {

    // Create the surface for page two.
    var surface = dojox.gfx.createSurface(
      "divWelcomeTwoSurface", (dojo.isIE?530:445), 300);

    // Bridge tile and description.
    surface.createImage({
      type : "image", width : 20, height : 20, src : "img/marble.gif",
      x : 40, y : 30
    });
    gss.drawText(surface, 70, 44, 12, "black",
      "This is (roughly!) the bridge.  STAY ON THIS!");

    // Dead end and description.
    gss.drawDeadEnd(surface, 40, 60);
    gss.drawText(surface, 70, 75, 12, "black",
      "This is a dead end.  It stops Qwamp in his tracks.");

    // Skull and description.
    gss.drawSkull(surface, 40, 90);
    gss.drawText(surface, 70, 105, 12, "black",
      "This is an alien skull.  DON'T TOUCH THESE!");

    // Doorway and description.
    gss.drawDoorway(surface, 40, 120);
    gss.drawText(surface, 70, 135, 12, "black",
      "This is a doorway.  Get to the one on the far end of");
    gss.drawText(surface, 70, 155, 12, "black",
      "each level to get to the next level.  Get through all");
    gss.drawText(surface, 70, 175, 12, "black",
      "four levels to get Qwamp back safely to you.");

    // Difficulty level information.
    gss.drawText(surface, 40, 220, 12, "black",
      "Select your difficulty level below and click Start Game.");
    gss.drawText(surface, 60, 240, 12, "black",
      "The harder the difficulty, the less time you'll have");
    gss.drawText(surface, 115, 260, 12, "black",
      "to determine Qwamp's next move");

  } // End prepareWelcomeTwo().


  /**
   * Start the game.
   */
  this.startGame = function() {

    // Set background image so we get a bridge.
    dojo.byId("divContainer").style.backgroundImage = "url(img/marble.gif)";

    // Set up initial conditions.  Reverse the values 1 and 3 on the slider
    // because it's essentially backwards right now.
    difficulty = dijit.byId("sldDifficulty").getValue();
    if (difficulty == 1) {
      difficulty = 3;
    } else if (difficulty == 3) {
      difficulty = 1;
    }
    currentLevel = 0;
    game.gameRunning = true;
    game.blobNextMove = null;
    game.countdownValue = difficulty * 1000;

    // Draw the level map and blob.
    var blobLocation = gss.drawLevel(levelMaps.levels[currentLevel]);
    blobX = parseInt(blobLocation.split(",")[0]);
    blobY = parseInt(blobLocation.split(",")[1]);
    gss.drawBlob(blobX, blobY);

    // Start the main game "loop".
    game.gameTimer.start();

  } // End startGame().


  /**
   * Sets what the blob's next move will be.
   *
   * @param inDirection The direction to move ("up", "down", "left" or
   *                    "right").
   */
  this.setNextMove = function(inDirection) {

    if (game.gameRunning) {
      game.blobNextMove = inDirection;
      dojo.byId("nextMoveDisplay").innerHTML = inDirection.toUpperCase();
    }

  } // End setNextMove().


  /**
   * Move the blob in reaction to a user action.
   *
   * @param inDirection The direction to move ("up", "down", "left" or "right").
   */
  this.moveBlob = function(inDirection) {

    // Skip if blob isn't moving this iteration.
    if (!game.blobNextMove) {
      return;
    }

    // Update blob location.
    var oldX = blobX;
    var oldY = blobY;
    switch (game.blobNextMove) {
      case "up": blobY = blobY - 1; break;
      case "down": blobY = blobY + 1; break;
      case "left": blobX = blobX - 1; break;
      case "right": blobX = blobX + 1; break;
    }

    // Check the tile the blob is now on.  If it's a dead end, revert the
    // location changes.
    var result = this.checkBlobPosition();
    if (result == "deadend" || result == "rock") {
      blobX = oldX;
      blobY = oldY;
    }

    // Draw the blob at it's (potentially) new location.
    gss.drawBlob(blobX, blobY);

    // Check for win or loss and react accordingly.
    if (result == "dead") {
      this.commonGameOverWork();
      gss.drawDead();
    } else if (result == "win") {
      this.commonGameOverWork();
      gss.drawWin();
    }

  } // End moveBlob().


  /**
   * Returns the type of tile at a specified location.
   *
   * @param  inX The X location of the requested tile.
   * @param  inY The Y location of the requested tile.
   * @return     The type of the tile, or null if no tile at that location.
   *             See map data's type attribute for valid return values.
   */
  this.getTileAtLocation = function(inX, inY) {

    // Cycle through tiles for this map and find the appropriate one and
    // return it's type, or null if not found.
    retVal = null;
    for (var i = 0; i < levelMaps.levels[currentLevel].length; i++) {
      if (levelMaps.levels[currentLevel][i].x == inX &&
        levelMaps.levels[currentLevel][i].y == inY) {
        retVal = levelMaps.levels[currentLevel][i].type;
        break;
      }
    }
    return retVal;

  } // End getTileAtLocation().


  /**
   * Checks the tile the blob is now located on and returns a status code
   * in some cases.
   *
   * @return "deadend" if the blob is at a dead end, "dead" if the
   *         blob fell off the bridge or ran into a skull, "win" if they
   *         won the game (hit end tile on 4th level), or "ok" if the
   *         move is onto a bridge tile.
   */
  this.checkBlobPosition = function() {

    var retVal = null;

    var tileType = this.getTileAtLocation(blobX, blobY);
    switch (tileType) {

      // Blob is still on a bridge tile or start tile, game continues.
      case "bridge": case "start":
        retVal = "ok";
      break;

      // Blob is on end tile, jump to next map or end win game.
      case "end":
        if (currentLevel == 3) {
          retVal = "win";
        } else {
          game.blobNextMove = null;
          dojo.byId("nextMoveDisplay").innerHTML = "";
          currentLevel = currentLevel + 1;
          var blobLocation = gss.drawLevel(levelMaps.levels[currentLevel]);
          blobX = parseInt(blobLocation.split(",")[0]);
          blobY = parseInt(blobLocation.split(",")[1]);
          gss.drawBlob(blobX, blobY);
          retVal = "ok";
        }
      break;

      // Blob ran into skull and is now dead.
      case "skull":
        retVal = "dead";
      break;

      // They hit a dead end or a rock, so revert the last move so it looks
      // like they didn't go anywhere, but the game continues.
      case "deadend": case "rock":
        retVal = "deadend";
      break;

      // Blob must be on a background tile, meaning they fell off
      // the bridge.
      default:
        retVal = "dead";
      break;

    } // End switch.

    return retVal;

  } // End checkBlobPosition().


  /**
   * Performs some common stuff that has to be done any time the game ends.
   */
  this.commonGameOverWork = function() {

    game.gameTimer.stop();
    game.gameRunning = false;
    gss.clearSurface();
    dojo.byId("divContainer").style.backgroundImage = "";
    dojo.byId("nextMoveDisplay").innerHTML = "";
    dojo.byId("countdownDisplay").innerHTML = "";

  } // End commonGameOverWork().


} // End GameClass.
