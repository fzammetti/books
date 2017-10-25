package com.apress.ajaxprojects.ajaxwarrior.commands;


import com.apress.ajaxprojects.ajaxwarrior.framework.CommandResult;
import com.apress.ajaxprojects.ajaxwarrior.gameobjects.GameCharacter;
import com.apress.ajaxprojects.ajaxwarrior.Globals;
import com.apress.ajaxprojects.ajaxwarrior.Utils;
import java.util.ArrayList;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletContext;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * This Command is called any time the player moves.
 */
public class UpdateMapCommand extends Command {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog("com.apress.ajaxprojects");


  /**
   * Constructor.  Let super() do all the work!
   *
   * @param inRequest        The request being services.
   * @param inResponse       The response being generated.
   * @param inServletContext The ServletContext the requests is executing in.
   */
  public UpdateMapCommand(final HttpServletRequest inRequest,
    final HttpServletResponse inResponse,
    final ServletContext inServletContext) {

    super(inRequest, inResponse, inServletContext);

  } // End constructor().


  /**
   * Main entry point.
   *
   * @return           The result of the execution.
   * @throws Exception If anything foes wrong.
   */
  public CommandResult exec() throws Exception {

    log.debug("UpdateMap.exec()...");

    // These are all variables that will be sent back to the client, UNLESS the
    // code follows the exit community branch.  These are the defaulr values,
    // and they will be updated, if applicable, throughout the code.
    String  message           = null;
    boolean playerInfoUpdated = false;

    // Determine what direction we're moving the map.  If this parameter is not
    // found, then this request is the initial one, so we won't move anything,
    // but we do have to set the flag to update the player info.
    String moveDirection = request.getParameter("moveDirection");
    if (moveDirection == null) {

      playerInfoUpdated = true;

    // Not the initial request...
    } else {

      // Get the current map location (upper left-hand corner of the viewport).
      int currentLocationX = gameState.getCurrentLocationX();
      int currentLocationY = gameState.getCurrentLocationY();
      if (log.isDebugEnabled()) {
        log.debug("Starting currentLocationX / currentLocationY = " +
          currentLocationX + " / " + currentLocationY);
      }

      // Some other values we'll need.
      int    previousLocationX = currentLocationX;
      int    previousLocationY = currentLocationY;
      char   mapMoveDir        = ' ';

      // Move the player appropriately.
      if (moveDirection.equals("up")) {
        log.debug("Moving up (north)");
        currentLocationY--;
        mapMoveDir = 's';
      } else if (moveDirection.equals("down")) {
        log.debug("Moving down (south)");
        currentLocationY++;
        mapMoveDir = 'n';
      } else if (moveDirection.equals("left")) {
        log.debug("Moving left (west)");
        currentLocationX--;
        mapMoveDir = 'w';
      } else if (moveDirection.equals("right")) {
        log.debug("Moving right (east)");
        currentLocationX++;
        mapMoveDir = 'e';
      }

      // Bounds checks.  Can't move off the map!
      if (currentLocationX < 0) {
        log.debug("X lower bound hit");
        currentLocationX = 0;
        mapMoveDir = ' ';
      }
      if (currentLocationY < 0) {
        log.debug("Y lower bound hit");
        currentLocationY = 0;
        mapMoveDir = ' ';
      }
      if (currentLocationX + Globals.VIEWPORT_WIDTH > Globals.MAP_WIDTH) {
        log.debug("X upper bound hit");
        currentLocationX = previousLocationX;
        mapMoveDir = ' ';
      }
      if (currentLocationY + Globals.VIEWPORT_HEIGHT > Globals.MAP_HEIGHT) {
        log.debug("Y upper bound hit");
        currentLocationY = previousLocationY;
        mapMoveDir = ' ';
      }

      // If we are in a community, see if we are now on one of our exit
      // tiles.  If so, exit the community, and don't go any further.
      if (gameState.getInCommunity()) {
        if (currentLocationX == Globals.COMMUNITY_STARTING_X &&
          (currentLocationY == Globals.COMMUNITY_STARTING_Y ||
          currentLocationY == Globals.COMMUNITY_STARTING_Y - 1 ||
          currentLocationY == Globals.COMMUNITY_STARTING_Y + 1)) {
          log.debug("Exiting community!");
          // No longer in community, so flip back to main map and restore
          // previous location on that map.
          gameState.setInCommunity(false);
          gameState.restoreMainLocation();
          mapHandler.switchMap("main");
          // Get the chunk of the main map after the location is restored.
          ArrayList chunk = mapHandler.getChunk(gameState.getCurrentLocationX(),
            gameState.getCurrentLocationY());
          Utils.writeJSON(false, "Exited community", chunk, true, gameState,
            false, response, true, false, null);
          log.debug("UpdateMap.exec() (exited community) done");
          return null;
        }
      }

      // Get the chunk of the map data corresponding to the player's new
      // viewport on the map.
      ArrayList chunk = mapHandler.getChunk(currentLocationX, currentLocationY);

      // Now see if the center tile, where our character will be drawn, is a
      // tile they cannot move on to (water for instance).  If it is, reset
      // the coordinates to the previous state.
      char centerTile =  mapHandler.getPlayerTile(chunk);
      if (mapHandler.isNoWalkTile(centerTile)) {
        log.debug("Is no walk tile, restoring previous");
        message = "Can't move there!";
        currentLocationX = previousLocationX;
        currentLocationY = previousLocationY;
      }

      // Now see if the tile the player will be drawn on is one of the hidden
      // doors.  If it is, see if they have the appropriate key.  If not,
      // do some damage.
      if (centerTile == Globals.TILE_WALL_HIDDEN_RED &&
        gameState.getInventory().get(
          Character.toString(Globals.ITEM_KEY_RED)) == null) {
        gameState.setHealth(gameState.getHealth() - 10);
        message = "You do not have the Red key!  Evil magic attacks you!";
        currentLocationX = previousLocationX;
        currentLocationY = previousLocationY;
        playerInfoUpdated = true;
        if (gameState.getHealth() <= 0) {
          gameState.setPlayerDied(true);
        }
      }
      if (centerTile == Globals.TILE_WALL_HIDDEN_BLUE &&
        gameState.getInventory().get(
          Character.toString(Globals.ITEM_KEY_BLUE)) == null) {
        gameState.setHealth(gameState.getHealth() - 10);
        message = "You do not have the Blue key!  Evil magic attacks you!";
        currentLocationX = previousLocationX;
        currentLocationY = previousLocationY;
        playerInfoUpdated = true;
        if (gameState.getHealth() <= 0) {
          gameState.setPlayerDied(true);
        }
      }
      if (centerTile == Globals.TILE_WALL_HIDDEN_GREEN &&
        gameState.getInventory().get(
          Character.toString(Globals.ITEM_KEY_GREEN)) == null) {
        gameState.setHealth(gameState.getHealth() - 10);
        message = "You do not have the Green key!  Evil magic attacks you!";
        currentLocationX = previousLocationX;
        currentLocationY = previousLocationY;
        playerInfoUpdated = true;
        if (gameState.getHealth() <= 0) {
          gameState.setPlayerDied(true);
        }
      }
      if (centerTile == Globals.TILE_WALL_HIDDEN_YELLOW &&
        gameState.getInventory().get(
          Character.toString(Globals.ITEM_KEY_YELLOW)) == null) {
        gameState.setHealth(gameState.getHealth() - 10);
        message = "You do not have the Yellow key!  Evil magic attacks you!";
        currentLocationX = previousLocationX;
        currentLocationY = previousLocationY;
        playerInfoUpdated = true;
        if (gameState.getHealth() <= 0) {
          gameState.setPlayerDied(true);
        }
      }
      if (centerTile == Globals.TILE_WALL_HIDDEN_SILVER &&
        gameState.getInventory().get(
          Character.toString(Globals.ITEM_KEY_SILVER)) == null) {
        gameState.setHealth(gameState.getHealth() - 10);
        message = "You do not have the Silver key!  Evil magic attacks you!";
        currentLocationX = previousLocationX;
        currentLocationY = previousLocationY;
        playerInfoUpdated = true;
        if (gameState.getHealth() <= 0) {
          gameState.setPlayerDied(true);
        }
      }

      // Re-get the chunk of the map data corresponding to the player's
      // viewport on the map because it could have reset by the above checks,
      // and if that's the case, we need the true chunk for the remainder of
      // the checks.  Also re-get the center tile, since that might not be
      // what it was before either.
      chunk      = mapHandler.getChunk(currentLocationX, currentLocationY);
      centerTile = mapHandler.getPlayerTile(chunk);

      // If the center tile is a swamp tile, reduce health by 1.
      if (centerTile == Globals.TILE_SWAMP) {
        message = "The swamp is killing you!";
        log.debug("Is swamp, reducing health");
        gameState.setHealth(gameState.getHealth() - 1);
        playerInfoUpdated = true;
        if (gameState.getHealth() <= 0) {
          gameState.setPlayerDied(true);
        }
      }

      // Store the updated location values (which may not be different than
      // they were before).
      gameState.setCurrentLocationX(currentLocationX);
      gameState.setCurrentLocationY(currentLocationY);
      if (log.isDebugEnabled()) {
        log.debug("New currentLocationX / currentLocationY = " +
          currentLocationX + " / " + currentLocationY);
      }

      // Update character positions, as long as this is not the initial call
      // and as long as the Freeze Time spell is not in effect.
      if (moveDirection != null && !gameState.isTimeFrozen()) {
        log.debug("Moving characters");
        mapHandler.moveCharacters(mapMoveDir,
          currentLocationX, currentLocationY);
      }

      // If we are under the Freeze Time spell, increment the counter and end
      // the spell when appropriate.
      if (gameState.isTimeFrozen()) {
        log.debug("Freeze Time spell in effect");
        int ftc = gameState.getFreezeTimeCounter();
        ftc--;
        if (ftc <= 0) {
          log.debug("Freeze Time spell ended");
          gameState.setFreezeTime(false);
        } else {
          gameState.setFreezeTimeCounter(ftc);
        }
      }

    } // End moveDirection check.

    // Get the chunk of the map for the viewport.  Has to be done here to
    // account for possible character movement.
    int currX = gameState.getCurrentLocationX();
    int currY = gameState.getCurrentLocationY();
    ArrayList chunk = mapHandler.getChunk(currX, currY);
    char centerTile = mapHandler.getPlayerTile(chunk);

    // See if the player is in contact with a character.  If it is, determine
    // whether combat or talking is beginning and return the appropriate
    // information.
    GameCharacter gc = mapHandler.touchingCharacter(currX, currY, chunk);
    if (gc != null) {
      // If belligerent combat begins.
      if (gc.isBelligerent() || gameState.getAttackMode()) {
        message = "Battle begins!";
        gameState.setCurrentMode(Globals.MODE_BATTLE);
        // Record the current location on the main map.  This will be used
        // when we exit battle, one way or another.  Then, place the player
        // on the bottom.
        gameState.setMapLocationX(currX);
        gameState.setMapLocationY(currY);
        gameState.setCurrentLocationX(Globals.VIEWPORT_HALF_WIDTH);
        gameState.setCurrentLocationY(Globals.VIEWPORT_HEIGHT - 2);
        // Store the character we're battling and set its initial position
        // on the battlefield,
        gc.setXLocation(Globals.VIEWPORT_HALF_WIDTH);
        gc.setYLocation(1);
        gameState.setBattleCharacter(gc);
        chunk = mapHandler.createBattleMap(currX, currY, gc);
      } else {
        // Not belligerent.  As long as its not a Demon, Troll or Serpent,
        // begin conversation.
        char gcType = gc.getType();
        if (gcType != Globals.CHARACTER_TROLL &&
          gcType != Globals.CHARACTER_DEMON &&
          gcType != Globals.CHARACTER_SERPENT) {
          gameState.setCurrentMode(Globals.MODE_TALKING);
          gameState.setTalkNode("3");
          gameState.setTalkCharacter(gc);
          gameState.setKarma(5);
        } else {
          message = "You don't speak the language of this creature.";
        }
      } // End belligerency check.
    }

    // See if they entered a store.  If we did, AND we did not enter battle,
    // then set the flag.
    boolean enteredStore = false;
    if (gameState.getCurrentMode() != Globals.MODE_BATTLE &&
      (centerTile == Globals.TILE_FLOOR_WOOD_STORE ||
      centerTile == Globals.TILE_FLOOR_BRICK_STORE)) {
      enteredStore = true;
    }

    // Create our JSON string with the pertinent information and write it out
    // to the response.
    Utils.writeJSON(false, message, chunk, true, gameState, playerInfoUpdated,
      response, false, enteredStore, null);

    log.debug("UpdateMap.exec() done");

    // Not forwarding anywhere, this is an AJAX request, the response is now
    // fully formed.
    return null;

  } // End exec().


} // End class.

