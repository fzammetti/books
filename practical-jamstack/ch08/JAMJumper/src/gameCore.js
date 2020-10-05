import Phaser from "phaser";
import level_01 from "./level_01.json"


// The dimensions of various elements of the game.
const sizes = {
  tile : { width : 64, height : 64 },
  grid : { columns : 9, rows : 11 },
  astronaut : { width : 54, height : 44 },
  trackPixelsPerIteration : 2
};


// Phaser configuration object.
const config = {
  type : Phaser.AUTO,
  parent : "gameContainer",
  width : sizes.tile.width * sizes.grid.columns,
  height : sizes.tile.height * sizes.grid.rows,
  fps : { target : 60, forceSetTimeOut : true },
  physics : { default : "arcade" },
  scene : { preload : preload, create : create, update : update }
};


// The one and only instance of the Phaser Game object.
let game = null;


// Reference to the scene object.
let scene = null;


// All variables that constitute the "state" of the game (except those related to jumping).
const gameState = {
  currentLevelIndex : 0, currentLevel : level_01, gameRunning : false, score : 0, trackMoveCount : 0
};


// Images.
const images = { track : null, astronaut : null, endTile : null };


// Sounds.
const sounds = { running : null, jump : null, death : null };


// Tweens for the fire.
const fireTweens = [ ];


// Flags set when the left and right keys are down.
let keys = { left : null, right : null, up : null };


// All data related to the jump mechanic.
const jumpData = {
  isJumping : false, direction : null, phase : null, jumpTicks : null, tickCount : null,
  DIR_UP : 0, DIR_LEFT : -2, DIR_RIGHT : 2, PHASE_UP : 0.12, PHASE_DOWN : -0.12
};


// Particle emitters.
const emitters = { rupture : null };


// Cache reference to the score span to avoid repetitive lookups (minor performance improvement).
let scoreSpan = null;


// Flag set to true when a click of the Start Game button should reset to the first level.
let restartGame = false;


/**
 * Called from IndexPage to initialize the game.
 */
export function init() {

  console.log("gameCore.init()");

  // Cache reference to span where score is displayed.
  scoreSpan = document.getElementById("score");

  // Instantiate Phaser Game object.
  game = new Phaser.Game(config);

} /* End init(). */


/**
 * Preload game resources.
 */
function preload() {

  console.log("gameCore.preload()");

  scene = this;

  // Load images.
  this.load.image("track", "img/track.png");
  this.load.image("trackBlank", "img/track_blank.png");
  this.load.image("trackEnd", "img/track_end.png");
  this.load.image("ruptureParticle", "img/ruptureParticle.png");

  // Load sprite sheets.
  this.load.spritesheet("fire", "img/fire.png", { frameWidth : 64, frameHeight : 64, endFrame : 3 });
  this.load.spritesheet("astronaut", "img/astronaut.png", { frameWidth : 54, frameHeight : 44, endFrame : 1 });

  // Load sounds.
  this.load.audio("running", "snd/running.ogg");
  this.load.audio("jump", "snd/jump.ogg");
  this.load.audio("death", "snd/death.ogg");
  this.load.audio("beamup", "snd/beamup.ogg");

} /* End preload(). */


/**
 * Create the Phaser game.
 */
function create() {

  console.log("gameCore.create()");

  // Show score.
  scoreSpan.innerHTML = gameState.score;

  // Create astronaut.
  const ax = (sizes.grid.columns / 2) * sizes.tile.width;
  const ay = ((sizes.grid.rows-1) * sizes.tile.height) - (sizes.astronaut.height / 2) -
    ((sizes.tile.height - sizes.astronaut.height) / 2);
  // Create animation frames for running.
  this.anims.create({ key : "run", repeat : -1, frameRate : 5,
    frames : this.anims.generateFrameNumbers("astronaut", { start : 0, end : 1, first : 0 })
  });
  // Need a physics body for collision detection.  It's centered on the astronaut, so reducing its size to 1 pixel
  // means that the player has some leeway when near the edges of track.
  images.astronaut = this.physics.add.sprite(ax, ay, "astronaut");
  images.astronaut.body.setSize(1, 1);
  images.astronaut.setDepth(2);
  // Start the running animation, then immediately pause it until startGame() is called.
  images.astronaut.anims.play("run");
  images.astronaut.anims.pause();

  // Create fire layer.  Create one more row than there is room for to account for scrolling effect.
  this.anims.create({ key : "burn", repeat : -1, frameRate : 10,
    frames : this.anims.generateFrameNumbers("fire", { start : 0, end : 3, first : 0 })
  });
  for (let row = 0; row < (sizes.grid.rows + 1); row++) {
    for (let column = 0; column < sizes.grid.columns; column++) {
      // Fire.  Each tile is shifted one tile's height upward to account for scrolling effect.
      const tile = this.add.sprite(column * sizes.tile.width, (row - 1) * sizes.tile.height, "fire");
      tile.setOrigin(0, 0);
      // Start the running animation.
      tile.anims.play("burn");
      // The fire tiles will be continually moved via tween.
      const t = this.tweens.add({
        targets : tile, duration : 1000, repeat : -1,
        y: { from: (row - 1) * sizes.tile.height, to: row * sizes.tile.height },
      });
      t.pause();
      fireTweens.push(t);
    }
  }

  createTrack();

  // Prepare audio assets.
  sounds.running = this.sound.add("running");
  sounds.jump = this.sound.add("jump");
  sounds.death = this.sound.add("death");
  sounds.beamup = this.sound.add("beamup");

  // Hook up key event handlers.
  keys.up = this.input.keyboard.addKey("up");
  keys.left = this.input.keyboard.addKey("left");
  keys.right = this.input.keyboard.addKey("right");

  // Create the rupture particle emitter, initially hidden.
  const particles = this.add.particles("ruptureParticle");
  particles.setDepth(3);
  emitters.rupture = particles.createEmitter({
    radial : true, quantity : 1,
    speed : { min : -800, max : 800 },
    angle : { min : 0, max : 360 },
    scale : { start : 4, end : 0 },
    lifespan : 800, visible : false
  });
  emitters.rupture.pause();

} /* End create(). */


/**
 * Creates all the track tiles.
 */
function createTrack() {

  // Since this can be called at the start of the game or after a death, we need to delete any track data present.
  if (images.track && images.track.length > 0) {
    images.track.forEach(item => { item.destroy(); item = null; });
  }
  images.track = null;

  // Create track layer.
  images.track = [ ];
  // Top-most row starts WAY off-screen to the top.
  let y = -(sizes.tile.height * sizes.grid.rows * (gameState.currentLevel.totalScreens - 1));
  for (let row = 0; row < sizes.grid.rows * gameState.currentLevel.totalScreens; row++) {
    for (let column = 0; column < sizes.grid.columns; column++) {
      const tileType = gameState.currentLevel.data[row][column];
      let tile = null;
      // Regular track tile.
      if (tileType === 0) {
        tile = scene.physics.add.image(column * sizes.tile.width, y, "trackBlank");
        // Add collider so we can to collision detection.
        scene.physics.add.collider(images.astronaut, tile, () => gameOver(false));
      // End tile.
      } else if (tileType === 2) {
        tile = scene.add.image(column * sizes.tile.width, y, "trackEnd");
      // It may seem weird, but for the areas where there ISN'T a track, we need a blank tile.  This is needed for
      // collision detection so that we know when the astronaut is dead (when they hit a blank tile, we have to see
      // if they're jumping, and if not, then they're toast).
      } else {
        tile = scene.add.image(column * sizes.tile.width, y, "track");
      }
      // Position based on upper-left corner.
      tile.setOrigin(0, 0);
      tile.setDepth(1);
      // Need to hold references so we can move them later (in theory, could tween this, but we need a bit more
      // control, so we'll take the reigns on these).
      images.track.push(tile);
      // If this is the end tile, hold a special reference to it for later.
      if (tileType === 2) { images.endTile = tile; }
    }
    y += sizes.tile.height;
  }

} /* End createTrack(). */


/**
 * Main game loop.
 */
function update() {

  // We're outta here if the game isn't running.
  if (!gameState.gameRunning) { return; }

  // Move the track tiles down.
  images.track.forEach(t => t.y += sizes.trackPixelsPerIteration);

  // For every row that scrolls buy, score some points.
  gameState.trackMoveCount++;
  if (gameState.trackMoveCount === 32) {
    gameState.trackMoveCount = 0;
    gameState.score += 10;
    scoreSpan.innerHTML = gameState.score;
  }

  // If the end tile reaches the bottom of the screen then the astronaut is at the end and the game must stop running.
  if (images.endTile.y === sizes.tile.height * (sizes.grid.rows - 2)) {
    sounds.beamup.play();
    gameState.score += 100;
    scoreSpan.innerHTML = gameState.score;
    gameOver(true);
    return;
  }

  // Handle jumping.
  if (jumpData.isJumping) {

    // Jump is in progress, scale and move.
    images.astronaut.scale += jumpData.phase;
    images.astronaut.x += jumpData.direction;
    jumpData.jumpTicks++;
    // If enough frames have past, either change phase or end jump.
    if (jumpData.jumpTicks === jumpData.tickCount) {
      switch (jumpData.phase) {
        case jumpData.PHASE_UP:
          jumpData.jumpTicks = 0;
          jumpData.phase = jumpData.PHASE_DOWN;
        break;
        case jumpData.PHASE_DOWN:
          sounds.running.play({ loop : true, rate : 0.75 });
          jumpData.isJumping = false;
        break;
      }
    }

  // Check for key input to trigger jumping.
  } else {

    // Set values depending on which key is down, if any.
    if (keys.up.isDown) {
      sounds.running.stop();
      sounds.jump.play();
      jumpData.isJumping = true;
      jumpData.jumpTicks = 0;
      jumpData.tickCount = 24;
      jumpData.phase = jumpData.PHASE_UP;
      jumpData.direction = jumpData.DIR_UP;
    } else if (keys.left.isDown) {
      sounds.running.stop();
      sounds.jump.play();
      jumpData.isJumping = true;
      jumpData.jumpTicks = 0;
      jumpData.tickCount = 16;
      jumpData.phase = jumpData.PHASE_UP;
      jumpData.direction = jumpData.DIR_LEFT;
    } else if (keys.right.isDown) {
      sounds.running.stop();
      sounds.jump.play();
      jumpData.isJumping = true;
      jumpData.jumpTicks = 0;
      jumpData.tickCount = 16;
      jumpData.phase = jumpData.PHASE_UP;
      jumpData.direction = jumpData.DIR_RIGHT;
    }

  } /* End isJumping check. */

} /* End update(). */


/**
 * Called when the astronaut collides with a fire tile or reaches the end tile.
 */
function gameOver(inWon) {

  if (inWon) {
    scene.tweens.add({
      targets : images.astronaut, duration : 2000, alpha: { from: 1, to: 0 },
      onComplete : function() {
        gameState.currentLevelIndex++;
        if (gameState.currentLevelIndex < global.levelData.length) {
          // There's more levels to play, start the next one.
          gameState.currentLevel = global.levelData[1].node;
          startLevel();
        } else {
          gameState.score += 500;
          scoreSpan.innerHTML = gameState.score;
          // No more, next click of Start Game will reset to the beginning.
          restartGame = true;
        }
      }
    });
  } else {
    // Player is always safe if jumping.
    if (jumpData.isJumping) {
      return;
    }
    restartGame = true;
    sounds.death.play();
    images.astronaut.alpha = 0;
    emitters.rupture.setPosition(images.astronaut.x, images.astronaut.y);
    emitters.rupture.setVisible(true);
    emitters.rupture.resume();
  }

  // Need to shut down the game, including collision detection and astronaut animation.
  sounds.running.stop();
  gameState.gameRunning = false;
  scene.physics.pause();
  fireTweens.forEach(t => t.stop());
  images.astronaut.anims.pause();

} /* End gameOver(). */


/**
 * Starts the game.  Called when the Start Game button is clicked.
 */
export const startLevel = function() {

  // Reset game state.
  gameState.gameRunning = true;
  gameState.score = 0;
  gameState.trackMoveCount = 0;

  // Make sure player isn't jumping.
  jumpData.isJumping = false;

  // Reset score to 0.
  scoreSpan.innerHTML = gameState.score;

  // Reset astronaut alpha and scale and resart run animation.
  images.astronaut.alpha = 1;
  images.astronaut.scale = 1;
  images.astronaut.anims.resume();

  // If the restartGame flag is set, start with the first level.
  if (restartGame) {
    restartGame = false;
    gameState.currentLevelIndex = 0;
    gameState.currentLevel = level_01;
  }

  // Create the track graphics.
  createTrack();

  // Hide and pause the spatial rupture emitter.
  emitters.rupture.pause();
  emitters.rupture.setVisible(false);

  // Start moving fire again.
  fireTweens.forEach(t => t.restart() );

  // Play the run sound.
  sounds.running.play({ loop : true, rate : 0.75 });

  // Start physics back up for collision detection.
  scene.physics.resume();

}; /* End startLevel(). */
