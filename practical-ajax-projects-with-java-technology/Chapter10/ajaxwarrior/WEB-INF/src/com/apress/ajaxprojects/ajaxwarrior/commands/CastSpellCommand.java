package com.apress.ajaxprojects.ajaxwarrior.commands;


import com.apress.ajaxprojects.ajaxwarrior.framework.CommandResult;
import com.apress.ajaxprojects.ajaxwarrior.gameobjects.GameCharacter;
import com.apress.ajaxprojects.ajaxwarrior.Globals;
import com.apress.ajaxprojects.ajaxwarrior.Utils;
import java.util.ArrayList;
import java.util.HashMap;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletContext;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * This command is called to actually cast a spell.
 */
public class CastSpellCommand extends Command {


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
  public CastSpellCommand(final HttpServletRequest inRequest,
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

    log.debug("CastSpellCommand.exec()...");

    String    message     = "";
    ArrayList mapData     = null;
    boolean   viewUpdated = false;


    // Retreive which spell is being cast and get it as a char.
    String paramWhichSpell = request.getParameter("whichSpell");
    char whichSpell = paramWhichSpell.charAt(0);

    boolean canCastSpell = true;

    // First, do any simple rejections based on mode.
    if (gameState.getCurrentMode() == Globals.MODE_NORMAL) {
      if (whichSpell == Globals.SPELL_FIRE_RAIN) {
        message = "You can only cast that spell in battle";
        canCastSpell = false;
      }
    }

    // Now cast the spell.
    if (canCastSpell) {
      switch (whichSpell) {
        case Globals.SPELL_HEAL_THY_SELF:
          message = "You cast Heal Thy Self.  Full health restored.";
          gameState.setHealth(100);
          gameState.removeFromInventory(whichSpell);
          break;
        case Globals.SPELL_FREEZE_TIME:
          message = "You cast Freeze Time.  Time frozen for " +
            Integer.toString(Globals.SPELL_FREEZE_TIME_SKIPS) + " moves.";
          gameState.setFreezeTime(true);
          gameState.removeFromInventory(whichSpell);
          break;
        case Globals.SPELL_FIRE_RAIN:
          gameState.removeFromInventory(whichSpell);
          GameCharacter gc = gameState.getBattleCharacter();
          // Fire Rain always does player hit points * 2 damage, up to a
          // maximum of 20 .
          int damage = gameState.getHitPoints() * 2;
          if (damage > 20) {
            damage = 20;
          }
          int gcHealth = gc.getHealth();
          gcHealth = gcHealth - damage;
          if (gcHealth <= 0) {
            HashMap vals = BattleMoveCommand.endBattle(gameState, mapHandler,
              gc, false);
            mapData = (ArrayList)vals.get("chunk");
            message = (String)vals.get("message");
            viewUpdated = true;
          } else {
            gc.setHealth(gcHealth);
            message = "You cast Fire Rain.  You did " + damage +
              " points damage (" + gcHealth + " remaining)";
          }
          break;
        default:
          log.error("** THIS SHOULD NEVER HAPPEN!");
          break;
      }
    }

    // Create our JSON string with the pertinent information and write it out
    // to the response.
    Utils.writeJSON(false, message, mapData, viewUpdated, gameState, true,
      response, false, false, null);

    log.debug("CastSpellCommand.exec() done");

    return null;

  } // End exec().


} // End class.
