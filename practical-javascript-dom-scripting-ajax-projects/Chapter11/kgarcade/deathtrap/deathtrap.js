function Deathtrap() {


  // Structure used to define the player (the squirrel).
  function PlayerDesc() {
    this.x = null;
    this.y = null;
    this.prevX = null;
    this.prevY = null;
    this.tileX = null;
    this.tileY = null;
    // State: A=Alive, D=Dead, W=Won
    this.state = null;
    this.reset = function() {
      this.x = 10;
      this.y = 152;
      this.prevX = 0;
      this.prevY = 0;
      this.tileX = 1;
      this.tileY = 8;
      this.state = "A";
    }
    this.reset();
  } // End PlayerDesc class.


  // Variables specific to this game.
  this.player = new PlayerDesc();
  this.deadCounter = null;
  this.vertMoveCount = null;
  this.correctPath = null;
  this.regenPath = true;


  // This is an array that defines the 10 possible correct paths through the
  // field.
  // 1 is an OK tile, 0 is a death tile
  this.deathMatrix = new Array(10);
  this.deathMatrix[0] = new Array(
    [ 1, 1, 1, 1, 1, 0, 0, 0, 0 ],
    [ 1, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 1, 1, 1, 1, 1, 1, 0, 0, 0 ],
    [ 1, 1, 0, 0, 0, 1, 0, 0, 0 ],
    [ 1, 1, 0, 0, 0, 1, 0, 0, 0 ],
    [ 1, 1, 0, 1, 1, 1, 0, 0, 0 ],
    [ 0, 0, 0, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 1, 0, 0, 0, 0, 0 ],
    [ 0, 1, 1, 1, 0, 0, 0, 0, 0 ]
  );
  this.deathMatrix[1] = [
    [ 0, 0, 0, 0, 1, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 1, 0, 0, 0, 0 ],
    [ 1, 1, 1, 1, 1, 1, 0, 0, 0 ],
    [ 1, 0, 0, 0, 1, 1, 0, 0, 0 ],
    [ 1, 0, 0, 0, 1, 0, 0, 0, 0 ],
    [ 1, 1, 1, 0, 1, 0, 0, 0, 0 ],
    [ 0, 0, 1, 0, 1, 1, 0, 0, 0 ],
    [ 0, 1, 1, 0, 0, 0, 0, 0, 0 ],
    [ 0, 1, 1, 0, 0, 0, 0, 0, 0 ]
  ];
  this.deathMatrix[2] = [
    [ 1, 1, 1, 0, 1, 0, 0, 0, 0 ],
    [ 1, 0, 1, 1, 1, 0, 0, 0, 0 ],
    [ 1, 1, 1, 1, 1, 1, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 1, 0, 0, 0 ],
    [ 1, 1, 1, 1, 0, 1, 0, 0, 0 ],
    [ 1, 0, 0, 1, 0, 1, 0, 0, 0 ],
    [ 1, 1, 0, 1, 1, 1, 0, 0, 0 ],
    [ 0, 1, 0, 0, 1, 0, 0, 0, 0 ],
    [ 0, 1, 1, 0, 1, 1, 1, 0, 0 ]
  ];
  this.deathMatrix[3] = [
    [ 1, 1, 1, 1, 1, 0, 0, 0, 0 ],
    [ 1, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 1, 1, 1, 1, 1, 1, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 1, 0, 0, 0 ],
    [ 0, 0, 1, 1, 1, 1, 0, 0, 0 ],
    [ 0, 0, 1, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 1, 1, 1, 1, 1, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 1, 0, 0 ],
    [ 0, 1, 1, 1, 1, 1, 1, 0, 0 ]
  ];
  this.deathMatrix[4] = [
    [ 0, 0, 0, 0, 1, 0, 0, 0, 0 ],
    [ 0, 0, 0, 1, 1, 0, 0, 0, 0 ],
    [ 0, 1, 1, 1, 0, 0, 0, 0, 0 ],
    [ 0, 1, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 1, 1, 1, 1, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 1, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 1, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 1, 0, 0, 0, 0 ],
    [ 0, 1, 1, 1, 1, 0, 0, 0, 0 ]
  ];
  this.deathMatrix[5] = [
    [ 0, 0, 0, 0, 1, 0, 0, 0, 0 ],
    [ 1, 1, 1, 0, 1, 0, 0, 0, 0 ],
    [ 1, 0, 1, 0, 1, 0, 0, 0, 0 ],
    [ 1, 0, 1, 0, 1, 0, 0, 0, 0 ],
    [ 1, 0, 1, 1, 1, 0, 0, 0, 0 ],
    [ 1, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 1, 1, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 1, 0, 1, 1, 1, 0, 0, 0 ],
    [ 0, 1, 1, 1, 1, 1, 1, 0, 0 ]
  ];
  this.deathMatrix[6] = [
    [ 0, 0, 1, 1, 1, 0, 0, 0, 0 ],
    [ 0, 0, 1, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 1, 1, 1, 0, 0, 0, 0 ],
    [ 1, 1, 0, 1, 1, 0, 0, 0, 0 ],
    [ 0, 1, 0, 1, 0, 0, 0, 0, 0 ],
    [ 1, 1, 0, 1, 1, 1, 1, 0, 0 ],
    [ 1, 1, 0, 0, 0, 0, 1, 0, 0 ],
    [ 0, 1, 0, 0, 0, 0, 1, 1, 0 ],
    [ 0, 1, 1, 1, 1, 1, 1, 1, 0 ]
  ];
  this.deathMatrix[7] = [
    [ 1, 1, 1, 1, 1, 0, 0, 0, 0 ],
    [ 1, 0, 0, 1, 1, 0, 0, 0, 0 ],
    [ 1, 1, 1, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 1, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 1, 1, 1, 0, 0, 0 ],
    [ 0, 1, 1, 0, 0, 1, 0, 0, 0 ],
    [ 0, 1, 1, 0, 0, 1, 0, 0, 0 ],
    [ 0, 1, 1, 0, 0, 1, 0, 0, 0 ],
    [ 0, 1, 1, 1, 1, 1, 0, 0, 0 ]
  ];
  this.deathMatrix[8] = [
    [ 1, 1, 1, 1, 1, 0, 0, 0, 0 ],
    [ 1, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 1, 0, 1, 1, 1, 0, 0, 0, 0 ],
    [ 1, 0, 1, 0, 1, 0, 0, 0, 0 ],
    [ 1, 0, 1, 0, 1, 1, 0, 0, 0 ],
    [ 1, 1, 1, 0, 1, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 1, 1, 1, 0, 0 ],
    [ 0, 0, 0, 0, 1, 0, 1, 0, 0 ],
    [ 0, 1, 1, 1, 1, 1, 1, 0, 0 ]
  ];
  this.deathMatrix[9] = [
    [ 0, 0, 0, 0, 1, 0, 0, 0, 0 ],
    [ 0, 0, 1, 1, 1, 0, 0, 0, 0 ],
    [ 0, 1, 1, 1, 1, 0, 0, 0, 0 ],
    [ 0, 1, 0, 1, 0, 0, 0, 0, 0 ],
    [ 1, 1, 0, 1, 0, 1, 0, 0, 0 ],
    [ 1, 0, 0, 1, 0, 1, 0, 0, 0 ],
    [ 1, 1, 0, 1, 0, 1, 0, 0, 0 ],
    [ 0, 1, 0, 1, 1, 1, 0, 0, 0 ],
    [ 0, 1, 1, 0, 0, 1, 1, 1, 0 ]
  ];


  // This is an array of what moves are valid from which tiles.
  this.moveMatrix = new Array(10);
  this.moveMatrix[0] = [ "RD", "RDL", "RDL", "RDL", "UDL",
    " ", " ", " ", " " ];
  this.moveMatrix[1] = [ "URD", "URDL", "URDL", "URDL", "UDL",
    " ", " ", " ", " " ];
  this.moveMatrix[2] = [ "URD", "URDL", "URDL", "URDL", "URDL",
    "DL", " ", " ", " " ];
  this.moveMatrix[3] = [ "URD", "URDL", "URDL", "URDL", "URDL",
    "UDL", " ", " ", " " ];
  this.moveMatrix[4] = [ "URD", "URDL", "URDL", "URDL", "URDL",
    "URDL", "DL", " ", " " ];
  this.moveMatrix[5] = [ "URD", "URDL", "URDL", "URDL", "URDL",
    "URDL", "UDL", " ", " " ];
  this.moveMatrix[6] = [ "UR", "URDL", "URDL", "URDL", "URDL",
    "URDL", "UDL", " ", " " ];
  this.moveMatrix[7] = [ " ", "URD", "URDL", "URDL", "URDL",
    "URDL", "URDL", "DL", " " ];
  this.moveMatrix[8] = [ " ", "UR", "URL", "URL", "URL",
    "URL", "URL", "UL", " " ];


  /**
   * ======================================================================
   * Game initialization.
   * ======================================================================
   */
  this.init = function() {

    // Configure base game parameters.
    this.gameName = "deathtrap";
    this.fullKeyControl = true;

    // Reset the game state.
    this.reset();

    // Load all the images required for this game.
    loadGameImage("background");
    loadGameImage("playerDieing");
    loadGameImage("playerJumping");
    loadGameImage("playerStanding");

} // End init().


  /**
   * ======================================================================
   * Reset the game.  Called at startup, after a death and after a win.
   * ======================================================================
   */
  this.reset = function() {

    this.player.reset();
    this.deadCounter = 0;
    this.vertMoveCount = 0;
    if (this.regenPath) {
      this.correctPath = jscript.math.genRandomNumber(0, 9)
    }
    this.regenPath = false;

  } // End reset().


  /**
   * ======================================================================
   *  Frame processor.
   * ======================================================================
   */
  this.processFrame = function() {

    // Clear all images.
    for (img in this.gameImages) {
      this.gameImages[img].style.display = "none";
    }

    // Blit background.
    blit(this.gameImages["background"], 0, 0);

    switch (this.player.state) {

      // Player won
      case "W":
        addToScore(1000);
        this.regenPath = true;
        this.reset();
      break;

      // Player is dieing
      case "D":
        blit(this.gameImages["playerDieing"], this.player.x, this.player.y);
        this.deadCounter++;
        if (this.deadCounter > 48) {
          this.reset();
        }
      break;

      // Player is alive
      case "A":
        // Blit player
        if (gameState.playerDirectionUp || gameState.playerDirectionDown ||
          gameState.playerDirectionLeft || gameState.playerDirectionRight) {
          blit(this.gameImages["playerJumping"], this.player.x, this.player.y);
        } else {
          blit(this.gameImages["playerStanding"], this.player.x, this.player.y);
        }
        // Handle player movement
        // Horizontal movemenet : x +- 25
        // Vertical movement:     x +- 10 && y +- 16
        // Up
        if (gameState.playerDirectionUp) {
          // If movement is done, finish up
          if (this.player.y <= (this.player.prevY - 16)) {
            this.vertMoveCount  = 0;
            this.player.x = this.player.prevX + 10;
            this.player.y = this.player.prevY - 16;
            gameState.playerDirectionUp = false;
            if (this.isDeathTile()) {
              this.player.state = "D";
            }
          } else { // Otherwise, move the player
            this.player.y = this.player.y - 3;
            this.vertMoveCount++;
            if (this.vertMoveCount > 1) {
              this.vertMoveCount = 0;
              this.player.x = this.player.x + 3;
            }
          }
        }
        // Right
        if (gameState.playerDirectionRight) {
          // If movemement is done, finish up
          if (this.player.x >= (this.player.prevX + 26)) {
            this.player.x = this.player.prevX + 26;
            gameState.playerDirectionRight = false;
            if (this.isDeathTile()) {
              this.player.state = "D";
            }
          } else { // Otherwise, move the player
            this.player.x = this.player.x + 3;
          }
        }
        // Left
        if (gameState.playerDirectionLeft) {
          // If movemement is done, finish up
          if (this.player.x <= (this.player.prevX - 26)) {
            this.player.x = this.player.prevX - 26;
            gameState.playerDirectionLeft = false;
            if (this.isDeathTile()) {
              this.player.state = "D";
            }
          } else { // Otherwise, move the player
            this.player.x = this.player.x - 3;
          }
        }
        // Down
        if (gameState.playerDirectionDown) {
          // If movemement is done, finish up
          if (this.player.y >= (this.player.prevY + 16)) {
            this.vertMoveCount  = 0;
            this.player.x = this.player.prevX - 10;
            this.player.y = this.player.prevY + 16;
            gameState.playerDirectionDown = false;
            if (this.isDeathTile()) {
              this.player.state = "D";
            }
          } else { // Otherwise, move the player
            this.player.y = this.player.y + 3;
            this.vertMoveCount++;
            if (this.vertMoveCount > 1) {
              this.vertMoveCount = 0;
              this.player.x = this.player.x - 3;
            }
          }
        }

      break;

    } // End of switch block.

  } // End processFrame().


  /**
   * ======================================================================
   * Handle key down events.
   * ======================================================================
   */
  this.keyDownHandler = function(inKeyCode) {

    // Although the right hand action button does nothing in this game,
    // it looks like things are broke if it doesn't press, so let's let
    // it be pressed, just to keep up appearances!
    if (inKeyCode == KEY_SPACE) {
      gameState.playerAction = true;
    }

  } // End keyDownHandler().


  /**
   * ======================================================================
   * Handle key up events.
   * ======================================================================
   */
  this.keyUpHandler = function(inKeyCode) {

    if (!gameState.playerDirectionUp && !gameState.playerDirectionDown &&
      !gameState.playerDirectionLeft && !gameState.playerDirectionRight &&
      this.player.state == "A") {

      var tileY = this.player.tileY;
      var tileX = this.player.tileX;

      // Handle up movement events
      switch (inKeyCode) {

        case KEY_SPACE:
          gameState.playerAction = false;
        break;

        case KEY_UP:
          if (this.moveMatrix[tileY][tileX].indexOf("U") != -1) {
            if (tileY == 0 && tileX == 4) {
              this.player.state = "W";
            } else {
              this.player.tileY--;
              this.player.prevX = this.player.x;
              this.player.prevY = this.player.y;
              gameState.playerDirectionUp = true;
              gameState.playerDirectionRight  = false;
              gameState.playerDirectionDown = false;
              gameState.playerDirectionLeft  = false;
            }
          }
        break;

        // Handle down movement events
        case KEY_DOWN:
          if (this.moveMatrix[tileY][tileX].indexOf("D") != -1) {
            this.player.tileY++;
            this.player.prevX = this.player.x;
            this.player.prevY = this.player.y;
            gameState.playerDirectionUp = false;
            gameState.playerDirectionRight  = false;
            gameState.playerDirectionDown = true;
            gameState.playerDirectionLeft  = false;
          }
        break;

        // Handle right movement events
        case KEY_RIGHT:
          if (this.moveMatrix[tileY][tileX].indexOf("R") != -1){
            this.player.tileX++;
            this.player.prevX = this.player.x;
            this.player.prevY = this.player.y;
            gameState.playerDirectionUp = false;
            gameState.playerDirectionRight  = true;
            gameState.playerDirectionDown = false;
            gameState.playerDirectionLeft  = false;
          }
        break;

        // Handle left movement events
        case KEY_LEFT:
          if (this.moveMatrix[tileY][tileX].indexOf("L") != -1) {
            this.player.tileX--;
            this.player.prevX = this.player.x;
            this.player.prevY = this.player.y;
            gameState.playerDirectionUp = false;
            gameState.playerDirectionRight  = false;
            gameState.playerDirectionDown = false;
            gameState.playerDirectionLeft  = true;
          }
        break;

      } // End switch block.

    } // End if block.

  } // End keyUpHandler().


  /**
   * ======================================================================
   * This function checks the current tile to see if it's a death tile
   * Returns true if it is a death tile, false otherwise
   * ======================================================================
   */
  this.isDeathTile = function() {

    if (
      this.deathMatrix[this.correctPath][this.player.tileY][this.player.tileX]
      == 0) {
      return true;
    } else {
      return false;
    }

  } // End isDeathTile().


  /**
   * ======================================================================
   * Destroy resources.
   * ======================================================================
   */
  this.destroy = function() {

    destroyGameImage("background");
    destroyGameImage("playerDieing");
    destroyGameImage("playerJumping");
    destroyGameImage("playerStanding");

  } // End destroy().


} // End Deathtrap class.


// Deathtrap class "inherits" from MiniGame class.
Deathtrap.prototype = new MiniGame;
