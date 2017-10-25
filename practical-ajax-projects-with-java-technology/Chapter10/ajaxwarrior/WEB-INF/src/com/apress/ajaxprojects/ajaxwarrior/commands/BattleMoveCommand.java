package com.apress.ajaxprojects.ajaxwarrior.commands;


import com.apress.ajaxprojects.ajaxwarrior.framework.CommandResult;
import com.apress.ajaxprojects.ajaxwarrior.gameobjects.GameCharacter;
import com.apress.ajaxprojects.ajaxwarrior.gameobjects.GameState;
import com.apress.ajaxprojects.ajaxwarrior.Globals;
import com.apress.ajaxprojects.ajaxwarrior.MapHandler;
import com.apress.ajaxprojects.ajaxwarrior.Utils;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Random;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletContext;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * This Command is called any time the player moves during battle.
 */
public class BattleMoveCommand extends Command {


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
  public BattleMoveCommand(final HttpServletRequest inRequest,
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

    log.debug("BattleMoveCommand.exec()...");

    // These are all variables that will be sent back to the client.  These are
    // the defaulr values, and they will be updated, if applicable,
    // throughout the code.
    String    message           = null;
    boolean   playerInfoUpdated = false;
    ArrayList mapData           = null;

    // Get the character the player is battling and their location.
    GameCharacter gc          = gameState.getBattleCharacter();
    int           gcXLocation = gc.getXLocation();
    int           gcYLocation = gc.getYLocation();

    // Determine what direction we're moving the map.
    String moveDirection = request.getParameter("moveDirection");

    // Get the player's current location.
    int currentLocationX  = gameState.getCurrentLocationX();
    int currentLocationY  = gameState.getCurrentLocationY();
    int previousLocationX = currentLocationX;
    int previousLocationY = currentLocationY;

    // First, if the player fired a projectile, start populating the HashMap
    // that will contain the details the client needs.
    // values we'll need on the client.
    HashMap projectileInfo = null;
    if (moveDirection.startsWith("projectile_")) {
      log.debug("Setting up for projectile weapon firing...");
      projectileInfo = new HashMap();
      projectileInfo.put("ph", "false");
      projectileInfo.put("p1", Integer.toString(currentLocationX));
      projectileInfo.put("p2", Integer.toString(currentLocationY));
    }

    // Move the player appropriately.
    boolean projectileHitEnemy = false;
    if (moveDirection.equals("up")) {
      log.debug("Moving up (up)");
      currentLocationY--;
    } else if (moveDirection.equals("down")) {
      log.debug("Moving down (down)");
      currentLocationY++;
    } else if (moveDirection.equals("left")) {
      log.debug("Moving left (left)");
      currentLocationX--;
    } else if (moveDirection.equals("right")) {
      log.debug("Moving right (right)");
      currentLocationX++;
    } else if (moveDirection.equals("projectile_up")) {
      log.debug("Firing projectile (up)");
      projectileInfo.put("pd", "up");
      if (currentLocationX == gcXLocation && currentLocationY > gcYLocation) {
        log.info("Projectile hit (up)");
        projectileHitEnemy = true;
        projectileInfo.put("ph", "true");
        projectileInfo.put("p3", Integer.toString(gcXLocation));
        projectileInfo.put("p4", Integer.toString(gcYLocation));
      } else {
        message = "You missed!";
        projectileInfo.put("p3", Integer.toString(currentLocationX));
        projectileInfo.put("p4", Integer.toString(0));
      }
    } else if (moveDirection.equals("projectile_down")) {
      log.debug("Firing projectile (down)");
      projectileInfo.put("pd", "down");
      if (currentLocationX == gcXLocation && currentLocationY < gcYLocation) {
        log.info("Projectile hit (down)");
        projectileHitEnemy = true;
        projectileInfo.put("ph", "true");
        projectileInfo.put("p3", Integer.toString(gcXLocation));
        projectileInfo.put("p4", Integer.toString(gcYLocation));
      } else {
        message = "You missed!";
        projectileInfo.put("p3", Integer.toString(currentLocationX));
        projectileInfo.put("p4", Integer.toString(Globals.VIEWPORT_HEIGHT - 1));
      }
    } else if (moveDirection.equals("projectile_left")) {
      log.debug("Firing projectile (left)");
      projectileInfo.put("pd", "left");
      if (currentLocationX > gcXLocation && currentLocationY == gcYLocation) {
        log.info("projectile hit (left)");
        projectileHitEnemy = true;
        projectileInfo.put("ph", "true");
        projectileInfo.put("p3", Integer.toString(gcXLocation));
        projectileInfo.put("p4", Integer.toString(gcYLocation));
      } else {
        message = "You missed!";
        projectileInfo.put("p3", Integer.toString(0));
        projectileInfo.put("p4", Integer.toString(currentLocationY));
      }
    } else if (moveDirection.equals("projectile_right")) {
      log.debug("Firing projectile (right)");
      projectileInfo.put("pd", "right");
      if (currentLocationX < gcXLocation && currentLocationY == gcYLocation) {
        log.info("Projectile hit (right)");
        projectileHitEnemy = true;
        projectileInfo.put("ph", "true");
        projectileInfo.put("p3", Integer.toString(gcXLocation));
        projectileInfo.put("p4", Integer.toString(gcYLocation));
      } else {
        message = "You missed!";
        projectileInfo.put("p3", Integer.toString(Globals.VIEWPORT_WIDTH - 1));
        projectileInfo.put("p4", Integer.toString(currentLocationY));
      }
    }

    boolean battleEnds = false;

    // If a projectile hit the enemy, calculate damage and check for a win by
    // the player.
    if (projectileHitEnemy) {
      // Now, calculate the amount of damage the player will do and subtract
      // it from the character's health.  Be sure to report it back to
      // the player.
      double damage = calculateDamage(gameState, gameState.getHitPoints(),
        gameState.getCurrentWeapon());
      // Now subtract the damage from the character.
      gc.setHealth(gc.getHealth() - (int)damage);
      // See if the enemy was vanquished.
      if (gc.getHealth() <= 0) {
        playerInfoUpdated = true;
        // Check: if this was one of the keymasters, and we don't have their
        // key yet... STUPID USER! GAME OVER!
        LinkedHashMap inventory = gameState.getInventory();
        if ((gc.isRedKeymaster() &&
          inventory.get(Character.toString(Globals.ITEM_KEY_RED)) == null) ||
          (gc.isGreenKeymaster() &&
          inventory.get(Character.toString(Globals.ITEM_KEY_GREEN)) == null)) {
          log.debug("Keymaster killed!  D'oh!");
          message = "You killed a keymaster who's key you don't have! " +
            "You fool!  All is lost!";
          gameState.setPlayerDied(true);
        } else {
          log.debug("Enemy defeated");
          battleEnds = true;
        }
      } else {
        log.debug("Enemy still alive");
        // Nope, just hurt'em, little bugger didn't go down yet.
        message = "You did " + (int)damage + " points damage (" +
          gc.getHealth() + " remaining)";
      }
    }

    // Bounds checks.  If we move off the map, battle ends.
    boolean ranAway    = false;
    if (currentLocationX < 0 || currentLocationY < 0 ||
      currentLocationX >= Globals.VIEWPORT_WIDTH ||
      currentLocationY >= Globals.VIEWPORT_HEIGHT) {
      log.debug("Coward!  Player runs away!");
      battleEnds = true;
      ranAway = true;
      message = "You have run from battle!  You are not worthy!";
    }

    // See if the player and the character occupy the same space, IF battle
    // has not already ended by virtue of the player running away.
    if (currentLocationX == gcXLocation && currentLocationY == gcYLocation &&
      !ranAway) {
      log.debug("Close-quarters player attack");
      // First, cancel this move.
      currentLocationX = previousLocationX;
      currentLocationY = previousLocationY;
      // Now, calculate the amount of damage the player will do and subtract
      // it from the character's health.  Be sure to report it back to
      // the player.
      double damage = calculateDamage(gameState, gameState.getHitPoints(),
        gameState.getCurrentWeapon());
      // Now subtract the damage from the character.
      gc.setHealth(gc.getHealth() - (int)damage);
      // See if the enemy was vanquished.
      if (gc.getHealth() <= 0) {
        playerInfoUpdated = true;
        // Check: if this was one of the keymasters, and we don't have their
        // key yet... STUPID USER! GAME OVER!
        LinkedHashMap inventory = gameState.getInventory();
        if ((gc.isRedKeymaster() &&
          inventory.get(Character.toString(Globals.ITEM_KEY_RED)) == null) ||
          (gc.isGreenKeymaster() &&
          inventory.get(Character.toString(Globals.ITEM_KEY_GREEN)) == null)) {
          log.debug("Keymaster killed!  D'oh!");
          message = "You killed a keymaster who's key you don't have! " +
            "You fool!  All is lost!";
          gameState.setPlayerDied(true);
        } else {
          log.debug("Enemy defeated");
          battleEnds = true;
        }
      } else {
        log.debug("Enemy still alive");
        // Nope, just hurt'em, little bugger didn't go down yet.
        message = "You did " + (int)damage + " points damage (" +
          gc.getHealth() + " remaining)";
      }
    }

    // Store the updated location values.
    gameState.setCurrentLocationX(currentLocationX);
    gameState.setCurrentLocationY(currentLocationY);

    // See if the player defeated the enemy.
    if (battleEnds) {
      HashMap vals = endBattle(gameState, mapHandler, gc, ranAway);
      // Update the message to return as long as we didn't run away.
      if (!ranAway) {
        message = (String)vals.get("message");
      }
      mapData = (ArrayList)vals.get("chunk");
    } else {
      // Get the map data we will return, still showing battle mode.
      mapData = mapHandler.getBattleMap(gc);
    }

    // Create our JSON string with the pertinent information and write it out
    // to the response.
    Utils.writeJSON(false, message, mapData, true, gameState, playerInfoUpdated,
      response, false, false, projectileInfo);

    log.debug("BattleMoveCommand.exec() done");

    // Not forwarding anywhere, this is an AJAX request, the response is now
    // fully formed.
    return null;

  } // End exec().


  /**
   * This is called to calculate damage that the player or a character does.
   *
   * @param  inGameState  The GameState instance.
   * @param  inHitPoints  The hit points of the player or character.
   * @param  inWeapon     The code of the weapon the player or character is
   *                      currently using.
   * @return              The amount of damage done.
   */
  public static double calculateDamage(final GameState inGameState,
    final int inHitPoints, final char inWeapon) {

    // The first step is to take the damage basis value of DAMAGE_BASIS and
    // multiply by the appropriate value for the weapon they are using,
    // or a value if they are fighting bare-handed.
    double damage = Globals.DAMAGE_BASIS;

    switch (inWeapon) {
      case Globals.WEAPON_DAGGER:
        damage = damage * Globals.WEAPON_DAGGER_DAMAGE;
        break;
      case Globals.WEAPON_STAFF:
        damage = damage * Globals.WEAPON_STAFF_DAMAGE;
        break;
      case Globals.WEAPON_MACE:
        damage = damage * Globals.WEAPON_MACE_DAMAGE;
        break;
      case Globals.WEAPON_SLINGSHOT:
        damage = damage * Globals.WEAPON_SLINGSHOT_DAMAGE;
        break;
      case Globals.WEAPON_CROSSBOW:
        damage = damage * Globals.WEAPON_CROSSBOW_DAMAGE;
        break;
      default:
        damage = damage * Globals.WEAPON_NONE_DAMAGE;
        break;
    }

    // Now we multiple damage by the hit points of the
    // player or character divided by HIT_POINT_DIVIDER.
    damage = damage * (inHitPoints / Globals.HIT_POINT_DIVIDER);

    // We always do at minimum one point of damage and a maximum
    // as defined in Globals.
    if (damage < 1) {
      damage = 1;
    }

    // And always a maximum amount as defined in Globals.
    if (damage > Globals.COMBAT_MAX_DAMAGE) {
      damage = Globals.COMBAT_MAX_DAMAGE;
    }

    return damage;

  } // End calculateDamage().


  /**
   * This is called to end battle.  It is called from multiple locations.
   *
   * @param  inGameState  The GameState instance.
   * @param  inMapHandler The MapHandler instance.
   * @param  inGC         The GameCharacter battle was with.
   * @param  inRanAway    True if the player ran away, false otherwise.
   * @return              A HashMap containing a message and a map chunk.
   */
  public static HashMap endBattle(final GameState inGameState,
    final MapHandler inMapHandler, final GameCharacter inGC,
    final boolean inRanAway) {

    HashMap retVals = new HashMap();
    String  message = null;

    // Restore location on actual map.
    inGameState.restoreMapLocation();
    // Switch to previous game map.
    inMapHandler.switchMap("previous");
    // Set mode back to normal.
    inGameState.setCurrentMode(Globals.MODE_NORMAL);
    // Null character doing battle with.
    inGameState.setBattleCharacter(null);

    // Determine how much gold was won and add it to the player, so long as
    // the player didn't run away.
    if (!inRanAway) {
      Random generator = new Random(new Date().getTime());
      // 5_thru_35
      int goldPieces = generator.nextInt(31) + 5;
      inGameState.setGoldPieces(inGameState.getGoldPieces() + goldPieces);
      message = "You vanquished your enemy!  Got " + goldPieces +
        " gold pieces.";
      // Now see if the player has earned a hit point increase.  If so, do it
      // and reset the win counter.  If not, just increase the win counter.
      int numBattleWins = inGameState.getNumBattleWins();
      int winsToHPIncrease = inGameState.getWinsToHPIncrease();
      numBattleWins++;
      if (numBattleWins >= winsToHPIncrease) {
        winsToHPIncrease += Globals.HIT_POINT_INCREASE_INCREMENT;
        inGameState.setHitPoints(inGameState.getHitPoints() + 1);
        inGameState.setWinsToHPIncrease(winsToHPIncrease);
        numBattleWins = 0;
        message += "  Hit points increased!  " + winsToHPIncrease +
          " victories to next increase.";
      }
      inGameState.setNumBattleWins(numBattleWins);
    }

    // Remove the character from the collection.
    inMapHandler.removeCharacter(inGC.getId());

    // Now create a new character and place them.
    GameCharacter newChar = inMapHandler.createCharacter(1);
    inMapHandler.charPickLocation(null, newChar);

    // Get the map chunk to display in viewport.
    ArrayList chunk = inMapHandler.getChunk(inGameState.getCurrentLocationX(),
      inGameState.getCurrentLocationY());

    // Set return values and return them.
    retVals.put("message", message);
    retVals.put("chunk",   chunk);
    return retVals;

  } // End endBattle().


} // End class.

