/**
 * ======================================================================
 * Return the keycode of the key firing an event.
 * ======================================================================
 */
function getKeyCode(e) {

  var ev = (e) ? e : (window.event) ? window.event : null;
  if (ev) {
    return (ev.charCode) ? ev.charCode:
      ((ev.keyCode) ? ev.keyCode : ((ev.which) ? ev.which : null));
  }

} // End getKeyCode().


/**
 * ======================================================================
 * Handle key down events.
 * ======================================================================
 */
function keyDownHandler(e) {

  var keyCode = getKeyCode(e);

  if (!gameState.currentGame.fullKeyControl) {
    switch (keyCode) {
      case KEY_SPACE:
        gameState.playerAction = true;
      break;
      case KEY_UP:
        gameState.playerDirectionUp = true;
      break;
      case KEY_DOWN:
        gameState.playerDirectionDown = true;
      break;
      case KEY_LEFT:
        gameState.playerDirectionLeft = true;
      break;
      case KEY_RIGHT:
        gameState.playerDirectionRight = true;
      break;
    }
  }

  gameState.currentGame.keyDownHandler(keyCode);

} // End keyDownHandler().


/**
 * ======================================================================
 * Handle key up events.
 * ======================================================================
 */
function keyUpHandler(e) {

  var keyCode = getKeyCode(e);

  // Always handle exiting a mini-game, even if the mini-game has full control
  // over key events.
  if (keyCode == 13) {
    if (gameState.currentMode == "miniGame") {
      gameState.currentGame.destroy();
      gameState.currentGame = null;
      document.getElementById("divMiniGame").style.display = "none";
      gameState.currentGame = new GameSelection();
      gameState.currentGame.init();
    }
  }

  if (!gameState.currentGame.fullKeyControl) {
    switch (keyCode) {
      case KEY_SPACE:
        gameState.playerAction = false;
      break;
      case KEY_UP:
        gameState.playerDirectionUp = false;
      break;
      case KEY_DOWN:
        gameState.playerDirectionDown = false;
      break;
      case KEY_LEFT:
        gameState.playerDirectionLeft = false;
      break;
      case KEY_RIGHT:
        gameState.playerDirectionRight = false;
      break;
    }
  }

  gameState.currentGame.keyUpHandler(keyCode);

} // End keyUpHandler().
