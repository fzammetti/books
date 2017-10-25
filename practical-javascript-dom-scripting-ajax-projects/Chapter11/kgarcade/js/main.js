/**
 * ======================================================================
 * Initialize the game.
 * ======================================================================
 */
function init() {

  gameState = new GameState();

  // Get references to all existing images.  This is mainly for the console
  // images so that we don't have to go against the DOM to manipulate them.
  var imgs = document.getElementsByTagName("img");
  for (var i = 0; i < imgs.length; i++){
    consoleImages[imgs[i].id] = imgs[i];
  }

  // Center the three main layers.
  jscript.dom.layerCenterH(document.getElementById("divTitle"));
  jscript.dom.layerCenterV(document.getElementById("divTitle"));
  jscript.dom.layerCenterH(document.getElementById("divGameSelection"));
  jscript.dom.layerCenterV(document.getElementById("divGameSelection"));
  jscript.dom.layerCenterH(document.getElementById("divMiniGame"));
  jscript.dom.layerCenterV(document.getElementById("divMiniGame"));

  // Now hide what we don't need.
  document.getElementById("divGameSelection").style.display = "none";
  document.getElementById("divMiniGame").style.display = "none";

  // Hook event handlers.
  document.onkeydown = keyDownHandler;
  if ((document.layers) ? true : false) {
    document.captureEvents(Event.KEYDOWN);
  }
  document.onkeyup = keyUpHandler;
  if ((document.layers) ? true : false) {
    document.captureEvents(Event.KEYUP);
  }

  // Initialize current mini-game (which is in fact the title screen).
  gameState.currentGame.init();

  // Start the game's "heartbeat".
  gameState.gameTimer = setTimeout("mainGameLoop()", 42);

} // End init().


/**
 * ======================================================================
 * Start a mini-game.
 * ======================================================================
 */
function startMiniGame(inName) {

  // Reset generic game-related variables.
  gameState.playerDirectionUp = false;
  gameState.playerDirectionDown = false;
  gameState.playerDirectionRight = false;
  gameState.playerDirectionLeft = false;
  gameState.playerAction = false;
  gameState.score = 0;
  document.getElementById("divStatusArea").innerHTML = "Score: " +
    gameState.score;

  // Instantiate mini-game.
  if (inName == "cosmicSquirrel") {
    gameState.currentGame = new CosmicSquirrel();
    gameState.currentGame.init();
  } else if (inName == "deathtrap") {
    gameState.currentGame = new Deathtrap();
    gameState.currentGame.init();
  } else if (inName == "refluxive") {
    gameState.currentGame = new Refluxive();
    gameState.currentGame.init();
  }

  // Show the game and hide the game selection screen.  Set the mode to indicate
  // mini-game in progress, and draw the console.
  gameState.currentMode = "miniGame";
  drawConsole();
  document.getElementById("divGameSelection").style.display = "none";
  document.getElementById("divMiniGame").style.display = "block";

} // End startMiniGame().


/**
 * ======================================================================
 * Main game loop, called 24 times a second.
 * ======================================================================
 */
function mainGameLoop() {

  clearTimeout(gameState.gameTimer);
  gameState.gameTimer = null;
  frameZIndexCounter = 0;
  if (gameState.currentMode == "miniGame") {
    updateLights();
    updateHands();
  }
  gameState.currentGame.processFrame();
  gameState.gameTimer = setTimeout("mainGameLoop()", 42);

} // End mainGameLoop().


/**
 * ======================================================================
 * Blit an element to the screen.
 * ======================================================================
 */
function blit(inImage, inX, inY) {

  inImage.style.left = inX + "px";
  inImage.style.top = inY + "px";
  inImage.style.zIndex = frameZIndexCounter;
  inImage.style.display = "block";
  frameZIndexCounter++;

} // End blit().
