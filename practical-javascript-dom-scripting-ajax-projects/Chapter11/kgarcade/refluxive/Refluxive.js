function Refluxive() {


  // Structure used to describe a bouncy.
  function BouncyDesc(inX, inY, inDir) {
    this.x = inX;
    this.y = inY;
    this.width = 18;
    this.height = 18;
    this.dir = inDir;
    this.onScreen = true;
  } // End BouncyDesc class.


  // Structure used to describe the paddle.
  function PaddleDesc() {
    this.x = 88;
    this.y = 188;
    this.width = 24;
    this.height = 10;
  } // End PaddleDesc class.


  // Variables specific to this game.
  this.paddle = new PaddleDesc();
  this.bouncies = new Array();


  /**
   * ======================================================================
   * Game initialization.
   * ======================================================================
   */
  this.init = function() {

    // Configure base game parameters.
    this.gameName = "refluxive";

    // Load all the images required for this game.
    loadGameImage("background");
    loadGameImage("bouncy1");
    loadGameImage("bouncy2");
    loadGameImage("bouncy3");
    loadGameImage("paddle");
    loadGameImage("gameOver");

    // Initial bouncy positions.
    this.bouncies.push(
      new BouncyDesc(jscript.math.genRandomNumber(1, 180), 10, "SE"));
    this.bouncies.push(
      new BouncyDesc(jscript.math.genRandomNumber(1, 180), 70, "SW"));
    this.bouncies.push(
      new BouncyDesc(jscript.math.genRandomNumber(1, 180), 140, "NE"));

  } // End init().


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

    // If the game is over, just show the appropriate message and we're done.
    if (!this.bouncies[0].onScreen && !this.bouncies[1].onScreen &&
      !this.bouncies[2].onScreen) {
      blit(this.gameImages["gameOver"], 10, 40);
      return;
    }

    // Blit paddle.
    blit(this.gameImages["paddle"], this.paddle.x, this.paddle.y);

    // Blit bouncies, if they are still on the screen.
    if (this.bouncies[0].onScreen) {
      blit(this.gameImages["bouncy1"], this.bouncies[0].x, this.bouncies[0].y);
    }
    if (this.bouncies[1].onScreen) {
      blit(this.gameImages["bouncy2"], this.bouncies[1].x, this.bouncies[1].y);
    }
    if (this.bouncies[2].onScreen) {
      blit(this.gameImages["bouncy3"], this.bouncies[2].x, this.bouncies[2].y);
    }

    // Deal with player movement.
    if (gameState.playerDirectionRight) {
      this.paddle.x = this.paddle.x + 4;
      // Stop at edge of screen
      if (this.paddle.x > 174) {
        this.paddle.x = 174;
      }
    }
    if (gameState.playerDirectionLeft) {
      this.paddle.x = this.paddle.x - 4;
      // Stop at edge of screen
      if (this.paddle.x < 1) {
        this.paddle.x = 1;
      }
    }

    // Deal with bouncy movement, each in turn.
    for (var i = 0; i < 3; i++) {
      // If bouncy is off the screen, don't process it.
      if (!this.bouncies[i].onScreen) {
        continue;
      }
      // First, move it based on its current direction.
      if (this.bouncies[i].dir == "NE") {
        this.bouncies[i].x = this.bouncies[i].x + 3;
        this.bouncies[i].y = this.bouncies[i].y - 3;
      }
      if (this.bouncies[i].dir == "NW") {
        this.bouncies[i].x = this.bouncies[i].x - 3;
        this.bouncies[i].y = this.bouncies[i].y - 3;
      }
      if (this.bouncies[i].dir == "SE") {
        this.bouncies[i].x = this.bouncies[i].x + 3;
        this.bouncies[i].y = this.bouncies[i].y + 3;
      }
      if (this.bouncies[i].dir == "SW") {
        this.bouncies[i].x = this.bouncies[i].x - 3;
        this.bouncies[i].y = this.bouncies[i].y + 3;
      }
      // Bounce off the frame edges (horizontal).
      if (this.bouncies[i].x < 1) {
        if (this.bouncies[i].dir == "NW") {
          this.bouncies[i].dir = "NE";
        } else if (this.bouncies[i].dir == "SW") {
          this.bouncies[i].dir = "SE";
        }
      }
      if (this.bouncies[i].x > 182) {
        if (this.bouncies[i].dir == "NE") {
          this.bouncies[i].dir = "NW";
        } else if (this.bouncies[i].dir == "SE") {
          this.bouncies[i].dir = "SW";
        }
      }
      // Bounce off the frame edges (vertical).
      if (this.bouncies[i].y < 1) {
        if (this.bouncies[i].dir == "NE") {
          this.bouncies[i].dir = "SE";
        } else if (this.bouncies[i].dir == "NW") {
          this.bouncies[i].dir = "SW";
        }
      }
      // See if it goes off the bottom of the screen, flag it if so.
      if (this.bouncies[i].y > 200) {
        this.bouncies[i].onScreen = false;
        subtractFromScore(50);
      }
      // Check for collision with paddle.
      if (detectCollision(this.bouncies[i], this.paddle)) {
        // Reverse bouncy direction.
        if (this.bouncies[i].dir == "SE" &&
          this.bouncies[i].x + 9 < this.paddle.x + 12) {
          this.bouncies[i].dir = "NW";
          addToScore(10);
        }
        if (this.bouncies[i].dir == "SE" &&
          this.bouncies[i].x + 9 > this.paddle.x + 12) {
          this.bouncies[i].dir = "NE";
          addToScore(10);
        }
        if (this.bouncies[i].dir == "SW" &&
          this.bouncies[i].x + 9 < this.paddle.x + 12) {
          this.bouncies[i].dir = "NW";
          addToScore(10);
        }
        if (this.bouncies[i].dir == "SW" &&
          this.bouncies[i].x + 9 > this.paddle.x + 12) {
          this.bouncies[i].dir = "NE";
          addToScore(10);
        }
      } // End collision detected.
    } // End for loop.

  } // End processFrame().


  /**
   * ======================================================================
   * Destroy resources.
   * ======================================================================
   */
  this.destroy = function() {

    destroyGameImage("background");
    destroyGameImage("bouncy1");
    destroyGameImage("bouncy2");
    destroyGameImage("bouncy3");
    destroyGameImage("paddle");
    destroyGameImage("gameOver");

  } // End destroy().


} // End Refluxive class.


// Refluxive class "inherits" from MiniGame class.
Refluxive.prototype = new MiniGame;
