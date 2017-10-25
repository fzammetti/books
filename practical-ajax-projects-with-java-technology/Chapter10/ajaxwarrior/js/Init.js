/**
 * Called to initialize the game.
 */
function init(inClientSideGameState) {

  // Initialize object instances.  Some of these can't be done until the page
  // is loaded or we won't get valid references to the DIVs, so let's just do
  // them all here anyway.  Somewhat cleaner IMO anyway.
  Globals = new GlobalsObject();
  Utils = new UtilsObject();
  xhr = new XHRObject();
  gameState = new GameStateObject();

  // Clear out the activityScroll array.
  var i;
  for (i = 0; i < 11; i++) {
    gameState.activityScroll[i] = "";
  }

  // If a new game is being started, then inClientSideGameState would have
  // been null.  If we're continuing a new game though, it would be the
  // serialized string representation of GameState.  In that case, ask the
  // instance to reconstitute itself.
  if (inClientSideGameState != null) {
    gameState.reconstitute(inClientSideGameState);
    updateActivityScroll("Welcome back!");
  } else {
    // Welcome message.
    updateActivityScroll("Welcome to the realm of Xandor!");
    // Set talk mode initially.
    gameState.talkAttackMode = Globals.PLAYER_TALK_MODE;
    // Set bare hands as initial current weapon.
    gameState.currentWeapon = Globals.WEAPON_NONE;
  }

  // Set the initial view.
  gameState.currentView = Globals.VIEW_MAP;

  // Center the main game div.
  Utils.layerCenterH(document.getElementById("divGame"));
  Utils.layerCenterV(document.getElementById("divGame"));

  // Create tiles in the map div.
  var x;
  var y;
  for (y = 0; y < Globals.VIEWPORT_HEIGHT; y++) {
    for (x = 0; x < Globals.VIEWPORT_WIDTH; x++) {
      var newImg = document.createElement("img");
      newImg.style.position = "absolute";
      newImg.style.left = (x * Globals.TILE_WIDTH) + "px";
      newImg.style.top = (y * Globals.TILE_HEIGHT) + "px";
      newImg.width = Globals.TILE_WIDTH;
      newImg.height = Globals.TILE_HEIGHT;
      newImg.id = "tile-" + y + "-" + x;
      var map = document.getElementById("divMap");
      map.appendChild(newImg);
      document.getElementById("tile-" + y + "-" + x).src =
        Globals.imgTILE_BLANK.src;
    }
  }

  // Hide the secondary views.  These had to be displayed initially or they
  // would "collapse" and not show content later, but initially we want them
  // hidden, so we have to do it now.
  document.getElementById("divHelp").style.display = "none";
  document.getElementById("divInventory").style.display = "none";
  document.getElementById("divSpellCasting").style.display = "none";
  document.getElementById("divWeaponSwitching").style.display = "none";
  document.getElementById("divStore").style.display = "none";

  // Make the initial AJAX call to render the map.
  updateMap(null);

  // Capture key events on this page.
  document.onkeyup = keyUp;
  if ((document.layers) ? true : false) {
    document.captureEvents(Event.KEYUP);
  }

} // End init().
