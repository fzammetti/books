/**
 * This function is called when the player moves during battle.
 */
function battleMove(inDirection) {

  if (xhr.request == null) {

    sendAJAX(battleMove, "battleMove.command", "?moveDirection=" +
      inDirection, null);

  } else {

    if (xhr.json.ph) {

      // A projectile was fired.  So, we start a timer that will do the
      // "animation" of the projectile.
      updateActivityScroll("You fire your weapon...");
      gameState.projectileMessage = xhr.json.mg;
      gameState.projectilePreviousTile = null;
      gameState.projectilePreviousX = null;
      gameState.projectilePreviousY = null;
      gameState.projectileDirection = xhr.json.pd;
      gameState.projectileHit = xhr.json.ph;
      // Need to use parseInt, or we'll get string, and later when we modify
      // thse values, we'll get string concats instead of math.  Very bad!
      gameState.projectileX = parseInt(xhr.json.p1);
      gameState.projectileY = parseInt(xhr.json.p2);
      gameState.projectileEndX = parseInt(xhr.json.p3);
      gameState.projectileEndY = parseInt(xhr.json.p4);
      gameState.projectileTimer = window.setTimeout(showProjectile, 100);

    } else {

      // Because we are about to fire off another AJAX request, we need to null
      // out the relevant variables so that sendAJAX() will fire the request.
      // We also need to be sure to return false here so that when flow returns
      // to send AJAX (which, remember, called this function!) it doesn't
      // kill the request we fire from here.
      gameState.battleEnemyTurn = true;
      updateMap();
      xhr.clearXHRVars();
      sendAJAX(battleEnemyMove, "battleEnemyMove.command", "", null);

    }

    return false; // Do NOT null out AJAX-related variables.

  } // End xhr.request == null if.

} // End battleMove().


/**
 * This function is called after the player moves during battle so the enemy
 * can move next.  It is called when the AJAX request returns.
 */
function battleEnemyMove() {

  if (xhr.json.ph) {

    // A projectile was fired.  So, we start a timer that will do the
    // "animation" of the projectile.
    updateActivityScroll("Enemy fired weapon...");
    gameState.projectileMessage = xhr.json.mg;
    gameState.projectilePreviousTile = null;
    gameState.projectilePreviousX = null;
    gameState.projectilePreviousY = null;
    gameState.projectileDirection = xhr.json.pd;
    gameState.projectileHit = xhr.json.ph;
    // Need to use parseInt, or we'll get string, and later when we modify
    // thse values, we'll get string concats instead of math.  Very bad!
    gameState.projectileX = parseInt(xhr.json.p1);
    gameState.projectileY = parseInt(xhr.json.p2);
    gameState.projectileEndX = parseInt(xhr.json.p3);
    gameState.projectileEndY = parseInt(xhr.json.p4);
    gameState.projectileTimer = window.setTimeout(showProjectile, 100);

  } else {

    // Character just moved.
    gameState.battleEnemyTurn = false;
    updateMap();
    return true;

  }

} // End battleMove().


/**
 * This function is responsible for showing a projectile traveling.  It is
 * called by a timer.
 */
function showProjectile() {

  // Get reference to tile projectile is currently on.
  var tile = document.getElementById("tile-" + gameState.projectileY + "-" +
    gameState.projectileX);

  // If the arrow reached its destination, restore the final tile image and
  // we're done.
  if (gameState.projectileX == gameState.projectileEndX &&
    gameState.projectileY == gameState.projectileEndY) {
    tile.src = gameState.projectilePreviousTile;
    window.clearTimeout(gameState.projectileTimer);
    gameState.projectileTimer = null;
    updateActivityScroll(gameState.projectileMessage);
    if (gameState.battleEnemyTurn) {
      if (xhr.json.iu == "true") {
        updatePlayerInfo(xhr.json.pn, xhr.json.ht, xhr.json.hp, xhr.json.gp);
      }
      gameState.battleEnemyTurn = false;
      xhr.clearXHRVars();
    } else {
      xhr.clearXHRVars();
      sendAJAX(battleEnemyMove, "battleEnemyMove.command", "", null);
    }
    return;
  }

  // Ok... if there was a previous tile, it means we're past the first
  // iteration of this timer.  In that case we need to restore the original
  // tile image, and move the arrow.
  if (gameState.projectilePreviousTile != null) {
    // Restore previous tile.
    tile.src = gameState.projectilePreviousTile;
    // Move the projectile.
    if (gameState.projectileDirection == "up") {
      gameState.projectileY = gameState.projectileY - 1;
    }
    if (gameState.projectileDirection == "down") {
      gameState.projectileY = gameState.projectileY + 1;
    }
    if (gameState.projectileDirection == "left") {
      gameState.projectileX = gameState.projectileX - 1;
    }
    if (gameState.projectileDirection == "right") {
      gameState.projectileX = gameState.projectileX + 1;
    }
  }

  // Now we need to grab the tile where the arrow will now be, and then of
  // course put down the arrow image in the appropriate orientation.
  tile = document.getElementById("tile-" + gameState.projectileY + "-" +
    gameState.projectileX);
  gameState.projectilePreviousTile = tile.src;
  if (gameState.projectileDirection == "up") {
    tile.src = Globals.imgPROJECTILE_ARROW_UP.src;
  }
  if (gameState.projectileDirection == "down") {
    tile.src = Globals.imgPROJECTILE_ARROW_DOWN.src;
  }
  if (gameState.projectileDirection == "left") {
    tile.src = Globals.imgPROJECTILE_ARROW_LEFT.src;
  }
  if (gameState.projectileDirection == "right") {
    tile.src = Globals.imgPROJECTILE_ARROW_RIGHT.src;
  }

  // Fire the timer again, the arrow is still in flight.
  gameState.projectileTimer = window.setTimeout(showProjectile, 100);

} // End showProjectile().