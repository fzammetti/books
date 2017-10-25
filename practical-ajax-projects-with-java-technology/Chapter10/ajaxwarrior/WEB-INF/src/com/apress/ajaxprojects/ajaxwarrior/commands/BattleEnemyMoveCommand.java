package com.apress.ajaxprojects.ajaxwarrior.commands;


import com.apress.ajaxprojects.ajaxwarrior.framework.CommandResult;
import com.apress.ajaxprojects.ajaxwarrior.gameobjects.GameCharacter;
import com.apress.ajaxprojects.ajaxwarrior.Globals;
import com.apress.ajaxprojects.ajaxwarrior.Utils;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Random;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletContext;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * This Command is called after a player move to allow the character to
 * make a move.
 */
public class BattleEnemyMoveCommand extends Command {


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
  public BattleEnemyMoveCommand(final HttpServletRequest inRequest,
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

    log.debug("BattleEnemyMoveCommand.exec()...");

    Random generator = new Random(new Date().getTime());

    // If time is frozen, get outta dodge quickly.
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
      Utils.writeJSON(false, null, null, false, gameState, false, response,
        false, false, null);
      return null;
    }

    // These are all variables that will be sent back to the client.  These are
    // the defaulr values, and they will be updated, if applicable,
    // throughout the code.
    String    message           = null;
    boolean   playerInfoUpdated = false;
    ArrayList mapData           = null;

    // Get the character the player is battling.
    GameCharacter gc = gameState.getBattleCharacter();

    // Get the player's current location.
    int currentLocationX  = gameState.getCurrentLocationX();
    int currentLocationY  = gameState.getCurrentLocationY();

    // Ok, now it's the character's turn.  First, if the character and the
    // player are right next to each other, do some damage.
    int     charX          = gc.getXLocation();
    int     charY          = gc.getYLocation();
    boolean attacked       = false;
    int     xDiff          = Math.abs(charX - currentLocationX);
    int     yDiff          = Math.abs(charY - currentLocationY);
    HashMap projectileInfo = null;
    boolean playerHit      = false;

    if (xDiff <= 1 & yDiff <= 1) {

      log.debug("Close-quarters enemy attack");
      attacked = true;
      playerHit = true;

    } else {

      // The character is not within striking range.  So, if the character has
      // a projectile weapon, decide whether to move or not.  If they do not
      // have a projectile weapon, always move (this will happen by virtue of
      // attacked being false in the next if block.
      attacked = false;
      if (gc.getWeapon() == Globals.WEAPON_SLINGSHOT ||
        gc.getWeapon() == Globals.WEAPON_CROSSBOW) {

        int whatToDo = generator.nextInt(100);
        if (whatToDo < 50) {

          // Make sure the character won't move by setting attacked to true,
          // and set up for projectile weapon firing.
          attacked = true;
          log.debug("Setting up for projectile weapon firing...");
          projectileInfo = new HashMap();
          projectileInfo.put("ph", "false");
          projectileInfo.put("p1", Integer.toString(charX));
          projectileInfo.put("p2", Integer.toString(charY));

          // Fire weapon.
          if (currentLocationX < charX) {
            log.debug("Firing projectile (left)");
            projectileInfo.put("pd", "left");
            if (charX > currentLocationX && charY == currentLocationY) {
              log.info("projectile hit (left)");
              playerHit = true;
              projectileInfo.put("ph", "true");
              projectileInfo.put("p3", Integer.toString(currentLocationX));
              projectileInfo.put("p4", Integer.toString(currentLocationY));
            } else {
              message = "Missed!";
              projectileInfo.put("p3", Integer.toString(0));
              projectileInfo.put("p4", Integer.toString(charY));
            }
          }

          if (currentLocationX > charX) {
            log.debug("Firing projectile (right)");
            projectileInfo.put("pd", "right");
            if (charX < currentLocationX && charY == currentLocationY) {
              log.info("Projectile hit (right)");
              playerHit = true;
              projectileInfo.put("ph", "true");
              projectileInfo.put("p3", Integer.toString(currentLocationX));
              projectileInfo.put("p4", Integer.toString(currentLocationY));
            } else {
              message = "Missed!";
              projectileInfo.put("p3",
                Integer.toString(Globals.VIEWPORT_WIDTH - 1));
              projectileInfo.put("p4", Integer.toString(charY));
            }
          }

          if (currentLocationY < charY) {
            log.debug("Firing projectile (up)");
            projectileInfo.put("pd", "up");
            if (charX == currentLocationX && charY > currentLocationY) {
              log.info("Projectile hit (up)");
              playerHit = true;
              projectileInfo.put("ph", "true");
              projectileInfo.put("p3", Integer.toString(currentLocationX));
              projectileInfo.put("p4", Integer.toString(currentLocationY));
            } else {
              message = "Missed!";
              projectileInfo.put("p3", Integer.toString(charX));
              projectileInfo.put("p4", Integer.toString(0));
            }
          }

          if (currentLocationY > charY) {
            log.debug("Firing projectile (down)");
            projectileInfo.put("pd", "down");
            if (charX == currentLocationX && charY < currentLocationY) {
              log.info("Projectile hit (down)");
              playerHit = true;
              projectileInfo.put("ph", "true");
              projectileInfo.put("p3", Integer.toString(currentLocationX));
              projectileInfo.put("p4", Integer.toString(currentLocationY));
            } else {
              message = "Missed!";
              projectileInfo.put("p3", Integer.toString(charX));
              projectileInfo.put("p4",
                Integer.toString(Globals.VIEWPORT_HEIGHT - 1));
            }
          }

        } // Firing weapon decision.

      } // End projectile weapon check.

    } // End if (xDiff <= 1 & yDiff <= 1).

    // If the character hit the player, either via close-quarters combat or
    // via projectile, calculate damage and see if they died.
    if (playerHit) {
      // Now, calculate the amount of damage the character will do and subtract
      // it from the player's's health.  Be sure to report it back to
      // the player.
      double damage = BattleMoveCommand.calculateDamage(gameState,
        gc.getHitPoints(), gc.getWeapon());
      // Now subtract the damage from the player.
      gameState.setHealth(gameState.getHealth() - (int)damage);
      playerInfoUpdated = true;
      // See if the player was killed.
      if (gameState.getHealth() <= 0) {
        log.debug("Player died");
        gameState.setHealth(0);
        gameState.setPlayerDied(true);
        message = "You died!";
      } else {
        log.debug("Player still alive");
        // Nope, just hurt.
        message = "You took " + (int)damage + " points damage";
      }
    }

    // If the character did NOT just attack, which means they aren't right next
    // to the player, move them closer.
    if (!attacked) {
      // If the character is one tile away from the player diagonally, don't
      // move the character.  This allows the player a chance to get away
      // from the attacker a little bit.  It avoids an undesirable situation
      // where if the player moves in a different direction with an enemy
      // pursuing, the enemy immediately jumps onto them because both X
      // and Y would get updated at the same time.  We don't want an enemy
      // to be able to attack the player diagonally.
      if (xDiff == 1 && yDiff == 1) {
        // Nothing to do here.
      } else {
        if (charX < currentLocationX) {
          charX++;
        }
        if (charX > currentLocationX) {
          charX--;
        }
        if (charY < currentLocationY) {
          charY++;
        }
        if (charY > currentLocationY) {
          charY--;
        }
        gc.setXLocation(charX);
        gc.setYLocation(charY);
      }
    }

    // Create our JSON string with the pertinent information and write it out
    // to the response.
    Utils.writeJSON(false, message, mapHandler.getBattleMap(gc), true,
      gameState, playerInfoUpdated, response, false, false, projectileInfo);

    log.debug("BattleEnemyMoveCommand.exec() done");

    // Not forwarding anywhere, this is an AJAX request, the response is now
    // fully formed.
    return null;

  } // End exec().


} // End class.

