/**
 * This function updated the player info display.
 */
function updatePlayerInfo(inName, inHealth, inGoldPieces, inHitPoints) {

  document.getElementById("divName").innerHTML = inName;
  document.getElementById("divHealth").innerHTML = "Health: " + inHealth;
  document.getElementById("divHitPoints").innerHTML =
    "Hit Points: " + inGoldPieces;
  document.getElementById("divGoldPieces").innerHTML =
    "Gold Pieces: " + inHitPoints;

} // End updatePlayerInfo().


/**
 * Switch the state the player is currently in, (A)ttacking or (T)alking.
 */
function toggleTalkAttack(inWhichState) {

  if (xhr.request == null) {

    sendAJAX(toggleTalkAttack, "toggleTalkAttack.command", "", null);

  } else {

    updateActivityScroll(xhr.json.mg);
    // Change the border state.
    if (gameState.talkAttackMode == Globals.PLAYER_TALK_MODE) {
      document.getElementById("imgBorder").src = Globals.imgATTACKING.src;
      gameState.talkAttackMode = Globals.PLAYER_ATTACK_MODE;
    } else {
      document.getElementById("imgBorder").src = Globals.imgTALKING.src
      gameState.talkAttackMode = Globals.PLAYER_TALK_MODE;
    }
    return true;

  }

} // End toggleTalkAttack().


/**
 * Enter a community (town, village or castle).
 */
function enterCommunity() {

  if (xhr.request == null) {

    sendAJAX(enterCommunity, "enterCommunity.command", "", null);

  } else {

    updateMap(null); // Note: xhr.request will be nulled by sendAJAX().
    return true;

  } // End xhr.request == null if.

} // End enterCommunity().


/**
 * Picks up an item the player is currently on.
 */
function pickUpItem() {

  if (xhr.request == null) {

    sendAJAX(pickUpItem, "pickUpItem.command", "", null);

  } else {

    if (xhr.json.iu == "true") {
      updatePlayerInfo(xhr.json.pn, xhr.json.ht, xhr.json.hp, xhr.json.gp);
    }
    // Always display the message.
    updateActivityScroll(xhr.json.mg);
    return true;

  } // End xhr.request == null if.

} // End pickUpItem().


/**
 * Save the current game on the server.
 */
function saveGame() {

  if (xhr.request == null) {

    // Serialize the gameState object.
    var serializedGameState = gameState.serialize();
    sendAJAX(saveGame, "saveGame.command", "", serializedGameState);

  } else {

    updateActivityScroll(xhr.json.mg);
    return true;

  } // End xhr.request == null if.

} // End saveGame().


/**
 * Updates the map from a mapDescriptor object.
 */
function updateMap(inMoveDir) {

  if (xhr.request == null) {

    var queryString = "";

    // Null means the player isn't moving.  Happens when the page is first
    // shown, and in various other limited situations.
    if (inMoveDir != null) {
      queryString = "?moveDirection=" + inMoveDir;
    }

    sendAJAX(updateMap, "updateMap.command", queryString, null);

  } else {

    // Update the activity scroll, if applicable.
    if (xhr.json.dm == "true") {
      updateActivityScroll(xhr.json.mg);
    }

    // Update the viewport, if applicable.
    if (xhr.json.vu == "true") {
      var i = 0;
      var x;
      var y;
      for (y = 0; y < Globals.VIEWPORT_HEIGHT; y++) {

        for (x = 0; x < Globals.VIEWPORT_WIDTH; x++) {

          var tile = document.getElementById("tile-" + y + "-" + x);

          switch (xhr.json.md.charAt(i)) {

            case Globals.TILE_BLANK:
              tile.src = Globals.imgTILE_BLANK.src;
            break;
            case Globals.TILE_BRIDGE:
              tile.src = Globals.imgTILE_BRIDGE.src;
            break;
            case Globals.TILE_FOREST_THIN:
              tile.src = Globals.imgTILE_FOREST_THIN.src;
            break;
            case Globals.TILE_FOREST_THICK:
              tile.src = Globals.imgTILE_FOREST_THICK.src;
            break;
            case Globals.TILE_GRASS:
              tile.src = Globals.imgTILE_GRASS.src;
            break;
            case Globals.TILE_MOUNTAINS_THIN:
              tile.src = Globals.imgTILE_MOUNTAINS_THIN.src;
            break;
            case Globals.TILE_MOUNTAINS_THICK:
              tile.src = Globals.imgTILE_MOUNTAINS_THICK.src;
            break;
            case Globals.TILE_TOWN_A:
              tile.src = Globals.imgTILE_TOWN_A.src;
            break;
            case Globals.TILE_TOWN_B:
              tile.src = Globals.imgTILE_TOWN_B.src;
            break;
            case Globals.TILE_WATER_DEEP:
              tile.src = Globals.imgTILE_WATER_DEEP.src;
            break;
            case Globals.TILE_WATER_SHALLOW:
              tile.src = Globals.imgTILE_WATER_SHALLOW.src;
            break;
            case Globals.TILE_BOULDER:
              tile.src = Globals.imgTILE_BOULDER.src;
            break;
            case Globals.TILE_CASTLE_LEFT:
              tile.src = Globals.imgTILE_CASTLE_LEFT.src;
            break;
            case Globals.TILE_CASTLE_MIDDLE:
              tile.src = Globals.imgTILE_CASTLE_MIDDLE.src;
            break;
            case Globals.TILE_CASTLE_RIGHT:
              tile.src = Globals.imgTILE_CASTLE_RIGHT.src;
            break;
            case Globals.TILE_SWAMP:
              tile.src = Globals.imgTILE_SWAMP.src;
            break;
            case Globals.TILE_VILLAGE:
              tile.src = Globals.imgTILE_VILLAGE.src;
            break;
            case Globals.TILE_COLUMN:
              tile.src = Globals.imgTILE_COLUMN.src;
            break;
            case Globals.TILE_FLOOR_BRICK:
              tile.src = Globals.imgTILE_FLOOR_BRICK.src;
            break;
            case Globals.TILE_FLOOR_BRICK_STORE:
              tile.src = Globals.imgTILE_FLOOR_BRICK_STORE.src;
            break;
            case Globals.TILE_FLOOR_WOOD:
              tile.src = Globals.imgTILE_FLOOR_WOOD.src;
            break;
            case Globals.TILE_FLOOR_WOOD_STORE:
              tile.src = Globals.imgTILE_FLOOR_WOOD_STORE.src;
            break;
            case Globals.TILE_FLOOR_MARBLE:
              tile.src = Globals.imgTILE_FLOOR_MARBLE.src;
            break;
            case Globals.TILE_FLOOR_DIRT:
              tile.src = Globals.imgTILE_FLOOR_DIRT.src;
            break;
            case Globals.TILE_WALL_BRICK:
              tile.src = Globals.imgTILE_WALL_BRICK.src;
            break;
            case Globals.TILE_WALL_HIDDEN_RED:
              tile.src = Globals.imgTILE_WALL_HIDDEN_RED.src;
            break;
            case Globals.TILE_WALL_HIDDEN_GREEN:
              tile.src = Globals.imgTILE_WALL_HIDDEN_GREEN.src;
            break;
            case Globals.TILE_WALL_HIDDEN_BLUE:
              tile.src = Globals.imgTILE_WALL_HIDDEN_BLUE.src;
            break;
            case Globals.TILE_WALL_HIDDEN_YELLOW:
              tile.src = Globals.imgTILE_WALL_HIDDEN_YELLOW.src;
            break;
            case Globals.TILE_WALL_HIDDEN_SILVER:
              tile.src = Globals.imgTILE_WALL_HIDDEN_SILVER.src;
            break;
            case Globals.TILE_STORE_1:
              tile.src = Globals.imgTILE_STORE_1.src;
            break;
            case Globals.TILE_STORE_2:
              tile.src = Globals.imgTILE_STORE_2.src;
            break;
            case Globals.TILE_STORE_3:
              tile.src = Globals.imgTILE_STORE_3.src;
            break;
            case Globals.TILE_STORE_BLANK:
              tile.src = Globals.imgTILE_STORE_BLANK.src;
            break;
            case Globals.ITEM_GOLD:
              tile.src = Globals.imgITEM_GOLD.src;
            break;
            case Globals.ITEM_HEALTH:
              tile.src = Globals.imgITEM_HEALTH.src;
            break;
            case Globals.ITEM_KEY_BLUE:
              tile.src = Globals.imgITEM_KEY_BLUE.src;
            break;
            case Globals.ITEM_KEY_SILVER:
              tile.src = Globals.imgITEM_KEY_SILVER.src;
            break;
            case Globals.ITEM_KEY_YELLOW:
              tile.src = Globals.imgITEM_KEY_YELLOW.src;
            break;
            case Globals.ITEM_KEY_GREEN:
              tile.src = Globals.imgITEM_KEY_GREEN.src;
            break;
            case Globals.ITEM_KEY_RED:
              tile.src = Globals.imgITEM_KEY_RED.src;
            break;
            case Globals.ITEM_SPELL_SCROLL:
              tile.src = Globals.imgITEM_SPELL_SCROLL.src;
            break;
            case Globals.ARTIFACT_ANKH:
              tile.src = Globals.imgARTIFACT_ANKH.src;
            break;
            case Globals.ARTIFACT_MEDALLION:
              tile.src = Globals.imgARTIFACT_MEDALLION.src;
            break;
            case Globals.ARTIFACT_SCROLL:
              tile.src = Globals.imgARTIFACT_SCROLL.src;
            break;
            case Globals.ARTIFACT_SKULL:
              tile.src = Globals.imgARTIFACT_SKULL.src;
            break;
            case Globals.ARTIFACT_STAFF:
              tile.src = Globals.imgARTIFACT_STAFF.src;
            break;
            case Globals.CHARACTER_DEMON:
              if (gameState.battleEnemyTurn) {
                tile.src = Globals.imgCHARACTER_DEMON_BATTLE.src;
              } else {
                tile.src = Globals.imgCHARACTER_DEMON.src;
              }
            break;
            case Globals.CHARACTER_GUARD:
              if (gameState.battleEnemyTurn) {
                tile.src = Globals.imgCHARACTER_GUARD_BATTLE.src;
              } else {
                tile.src = Globals.imgCHARACTER_GUARD.src;
              }
            break;
            case Globals.CHARACTER_MONK:
              if (gameState.battleEnemyTurn) {
                tile.src = Globals.imgCHARACTER_MONK_BATTLE.src;
              } else {
                tile.src = Globals.imgCHARACTER_MONK.src;
              }
            break;
            case Globals.CHARACTER_SERPENT:
              if (gameState.battleEnemyTurn) {
                tile.src = Globals.imgCHARACTER_SERPENT_BATTLE.src;
              } else {
                tile.src = Globals.imgCHARACTER_SERPENT.src;
              }
            break;
            case Globals.CHARACTER_SKELETON:
              if (gameState.battleEnemyTurn) {
                tile.src = Globals.imgCHARACTER_SKELETON_BATTLE.src;
              } else {
                tile.src = Globals.imgCHARACTER_SKELETON.src;
              }
            break;
            case Globals.CHARACTER_THIEF:
              if (gameState.battleEnemyTurn) {
                tile.src = Globals.imgCHARACTER_THIEF_BATTLE.src;
              } else {
                tile.src = Globals.imgCHARACTER_THIEF.src;
              }
            break;
            case Globals.CHARACTER_TROLL:
              if (gameState.battleEnemyTurn) {
                tile.src = Globals.imgCHARACTER_TROLL_BATTLE.src;
              } else {
                tile.src = Globals.imgCHARACTER_TROLL.src;
              }
            break;
            case Globals.CHARACTER_PEASANT:
              if (gameState.battleEnemyTurn) {
                tile.src = Globals.imgCHARACTER_PEASANT_BATTLE.src;
              } else {
                tile.src = Globals.imgCHARACTER_PEASANT.src;
              }
            break;
            default:
              tile.src = Globals.imgTILE_BLANK.src;
            break;

          } // End switch.

          i++;

        } // End for x.

      } // End for y.

      // Finally, always place the player in the center if not in battle.
      // If in battle, place it where specified.
      if (gameState.currentView == Globals.VIEW_BATTLE) {
        var tile = document.getElementById("tile-" +
          xhr.json.cy + "-" + xhr.json.cx);
          if (gameState.battleEnemyTurn) {
            tile.src = Globals.imgCHARACTER_PLAYER.src;
          } else {
            tile.src = Globals.imgCHARACTER_PLAYER_BATTLE.src;
          }
      } else {
        var tile = document.getElementById("tile-" +
          (Globals.VIEWPORT_HALF_HEIGHT) + "-" +
          (Globals.VIEWPORT_HALF_WIDTH));
        tile.src = Globals.imgCHARACTER_PLAYER.src;
      }

    } // End viewUpdated check.

    // Update the player info, if applicable.
    if (xhr.json.iu == "true") {
      updatePlayerInfo(xhr.json.pn, xhr.json.ht, xhr.json.hp, xhr.json.gp);
    }

    // If the last character move resulted in us entering a store, fire
    // off the Ajax request to get the markup.  Note the return false... we
    // will be starting a new Ajax request, so we don't want to null out the
    // applicable variables.  However, before we can start that request, we
    // have to null out the variables manually.
    if (xhr.json.es == "true") {
      xhr.clearXHRVars();
      showStore();
      return false;
    }

    // Default return.
    return true;

  } // End xhr.request == null if.

} // End updateMap().
