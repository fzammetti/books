function CosmicSquirrel() {


  // Structure used to define an obstacle.
  function ObstacleDesc(inID, inX, inY, inDir, inSpeed, inWidth, inHeight) {
    this.id = inID;
    this.x = inX;
    this.y = inY;
    this.width = inWidth;
    this.height = inHeight;
    this.dir = inDir;
    this.speed = inSpeed;
  } // End ObstacleDesc class.


  // Structure used to define the player (the squirrel).
  function PlayerDesc() {
    this.x = null;
    this.y = null;
    this.width = 18;
    this.height = 18;
    this.reset = function() {
      this.x = 91;
      this.y = 180;
    }
    this.reset();
  } // End PlayerDesc class.


  // Structure used to define the acorn.
  function AcornDesc() {
    this.x = null;
    this.y = null;
    this.width = 18;
    this.height = 18;
    this.reset = function() {
      this.x = jscript.math.genRandomNumber(1, 180)
      this.y = 2;
    }
    this.reset();
  } // End AcornDesc class.


  // Variables specific to this game.
  this.player = new PlayerDesc();
  this.acorn = new AcornDesc();
  this.obstacles = new Array();


  /**
   * ======================================================================
   * Game initialization.
   * ======================================================================
   */
  this.init = function() {

    // Configure base game parameters.
    this.gameName = "cosmicSquirrel";

    // Load all the images required for this game.
    loadGameImage("background");
    loadGameImage("acorn");
    loadGameImage("squirrelUp");
    loadGameImage("squirrelDown");
    loadGameImage("squirrelLeft");
    loadGameImage("squirrelRight");
    loadGameImage("squirrelStill");
    loadGameImage("alien1");
    loadGameImage("alien2");
    loadGameImage("ship1");
    loadGameImage("ship2");
    loadGameImage("asteroid1");
    loadGameImage("asteroid2");
    loadGameImage("comet1");
    loadGameImage("comet2");

    // Create obstacle descriptors and add to array.
    this.obstacles.push(new ObstacleDesc("alien1", 170, 30, "R", 5, 24, 24));
    this.obstacles.push(new ObstacleDesc("alien2", 80, 30, "R", 5, 24, 24));
    this.obstacles.push(new ObstacleDesc("ship1", 110, 60, "L", 2, 32, 24));
    this.obstacles.push(new ObstacleDesc("ship2", 10, 60, "L", 2, 32, 24));
    this.obstacles.push(new ObstacleDesc("asteroid1", 80, 90, "R", 4, 32, 32));
    this.obstacles.push(new ObstacleDesc("asteroid2", 140, 90, "R", 4, 32, 32));
    this.obstacles.push(new ObstacleDesc("comet1", 240, 130, "L", 3, 64, 14));
    this.obstacles.push(new ObstacleDesc("comet2", 70, 130, "L", 3, 64, 14));

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

    // Blit acorn.
    blit(this.gameImages["acorn"], this.acorn.x, this.acorn.y);

    // Blit obstacles.
    for (i = 0; i < this.obstacles.length; i++) {
      var obstacle = this.obstacles[i];
      blit(this.gameImages[obstacle.id], obstacle.x, obstacle.y);
    }

    // Blit squirrel.
    if (gameState.playerDirectionUp) {
      blit(this.gameImages["squirrelUp"], this.player.x, this.player.y);
    } else if (gameState.playerDirectionDown) {
      blit(this.gameImages["squirrelDown"], this.player.x, this.player.y);
    } else if (gameState.playerDirectionLeft) {
      blit(this.gameImages["squirrelLeft"], this.player.x, this.player.y);
    } else if (gameState.playerDirectionRight) {
      blit(this.gameImages["squirrelRight"], this.player.x, this.player.y);
    } else {
      blit(this.gameImages["squirrelStill"], this.player.x, this.player.y);
    }

    // Move obstacles.
    for (i = 0; i < this.obstacles.length; i++) {
      var obstacle = this.obstacles[i];
      if (obstacle.dir == "L") {
        obstacle.x = obstacle.x - obstacle.speed;
      }
      if (obstacle.dir == "R") {
        obstacle.x = obstacle.x + obstacle.speed;
      }
      // Bounds checks (comets handled differently because of their size).
      if (obstacle.id.indexOf("comet") != -1) {
        if (obstacle.x < -40) {
          obstacle.x = 240;
        }
      } else {
        if (obstacle.x < -70) {
          obstacle.x = 240;
        }
      }
      if (obstacle.x > 240) {
        obstacle.x = -40;
      }
    }

    // Handle player movements.  Update their coordinates based on the current
    // direction of movemement, then do bounds checking as appropriate.
    if (gameState.playerDirectionUp) {
      this.player.y = this.player.y - 2;
      if (this.player.y < 2) {
        this.player.y = 2;
      }
    }
    if (gameState.playerDirectionDown) {
      this.player.y = this.player.y + 2;
      if (this.player.y > 180) {
        this.player.y = 180;
      }
    }
    if (gameState.playerDirectionRight) {
      this.player.x = this.player.x + 2;
      if (this.player.x > 180) {
        this.player.x = 180;
      }
    }
    if (gameState.playerDirectionLeft) {
      this.player.x = this.player.x - 2;
      if (this.player.x < 2) {
        this.player.x = 2;
      }
    }

    // Detect collisions with acorn, reset and score if one occurs.
    if (detectCollision(this.player, this.acorn)) {
      this.player.reset();
      this.acorn.reset();
      addToScore(50);
    }

    // Detect collisions with any obstacles, reset if one occurs.
    for (i = 0; i < this.obstacles.length; i++) {
      if (detectCollision(this.player, this.obstacles[i])) {
        this.player.reset();
        this.acorn.reset();
        subtractFromScore(25);
      }
    }

  } // End processFrame().


  /**
   * ======================================================================
   * Destroy resources.
   * ======================================================================
   */
  this.destroy = function() {

    destroyGameImage("background");
    destroyGameImage("acorn");
    destroyGameImage("squirrelUp");
    destroyGameImage("squirrelDown");
    destroyGameImage("squirrelLeft");
    destroyGameImage("squirrelRight");
    destroyGameImage("squirrelStill");
    destroyGameImage("alien1");
    destroyGameImage("alien2");
    destroyGameImage("ship1");
    destroyGameImage("ship2");
    destroyGameImage("asteroid1");
    destroyGameImage("asteroid2");
    destroyGameImage("comet1");
    destroyGameImage("comet2");

  } // End destroy().


} // End CosmicSquirrel class.


// CosmicSquirrel class "inherits" from MiniGame class.
CosmicSquirrel.prototype = new MiniGame;
