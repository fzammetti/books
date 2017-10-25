package com.apress.ajaxprojects.ajaxwarrior.commands;


import com.apress.ajaxprojects.ajaxwarrior.framework.CommandResult;
import com.apress.ajaxprojects.ajaxwarrior.gameobjects.GameItem;
import com.apress.ajaxprojects.ajaxwarrior.Globals;
import com.apress.ajaxprojects.ajaxwarrior.Utils;
import java.util.ArrayList;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletContext;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * This command is executed to pick up an item.
 */
public class PickUpItemCommand extends Command {


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
  public PickUpItemCommand(final HttpServletRequest inRequest,
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

    log.debug("PickUpItemCommand.exec()...");

    // The first variable is the response the user sees, and the second is
    // whether the player info has been updated.
    String  sResponse         = "No item to pick up";
    boolean playerInfoUpdated = false;

    // First, get the chunk representing the current viewpoer.
    int        currentLocationX = gameState.getCurrentLocationX();
    int        currentLocationY = gameState.getCurrentLocationY();
    ArrayList chunk             = mapHandler.getChunk(
      currentLocationX, currentLocationY);

    // Next, get the tile the player is standing on.
    char centerTile = mapHandler.getPlayerTile(chunk);
    // Next, see if its one of the item tiles.
    if (mapHandler.isItemTile(centerTile)) {
      // It is an item, so first, get the GameItem instance for it, then add it
      // to the inventory.  Also, flip flag to indicate in the JSON response
      // that the player info has potentially been updated.
      playerInfoUpdated          = true;
      GameItem item              = mapHandler.getItem(
        currentLocationX, currentLocationY);
      boolean  removeItemFromMap = true;
      int      value             = item.getValue();
      switch (centerTile) {
        case Globals.ITEM_GOLD:
          // Add it to what they have.  If it exceeds the maximum, send back
          // a suitable message, otherwise, tell them what they got.
          gameState.setGoldPieces(gameState.getGoldPieces() + value);
          if (gameState.getGoldPieces() > Globals.PLAYER_MAX_GOLD_PIECES) {
            gameState.setGoldPieces(Globals.PLAYER_MAX_GOLD_PIECES);
            sResponse = "You can't hold any more gold";
            removeItemFromMap = false;
          } else {
            sResponse = "Picked up " + value + " gold pieces";
          }
          break;
        case Globals.ITEM_HEALTH:
          // Add it to what they have.  If it exceeds the maximum, send back
          // a suitable message, otherwise, tell them what they got.
          gameState.setHealth(gameState.getHealth() + value);
          if (gameState.getHealth() > Globals.PLAYER_MAX_HEALTH) {
            gameState.setHealth(Globals.PLAYER_MAX_HEALTH);
            sResponse = "You are already at full health";
            removeItemFromMap = false;
          } else {
            sResponse = "Picked up " + value + " health";
          }
          break;
        case Globals.ITEM_SPELL_SCROLL:
          gameState.addToInventory(item.getSpellType(),
            new Integer(value));
          // Return an appropriate message to the user.
          switch (item.getSpellType()) {
            case Globals.SPELL_FIRE_RAIN:
              sResponse = "Picked up " + value + " Fire Rain spells";
              break;
            case Globals.SPELL_HEAL_THY_SELF:
              sResponse = "Picked up " + value + " Heal Thy Self spells";
              break;
            case Globals.SPELL_FREEZE_TIME:
              sResponse = "Picked up " + value + " Freeze Time spells";
              break;
            default:
              log.error("** THIS SHOULD NEVER HAPPEN!");
              break;
          }
          break;
        case Globals.ITEM_KEY_BLUE:
          gameState.addToInventory(Globals.ITEM_KEY_BLUE, new Object());
          sResponse = "You got the Blue key!";
          break;
        case Globals.ITEM_KEY_SILVER:
          gameState.addToInventory(Globals.ITEM_KEY_SILVER, new Object());
          sResponse = "You got the Silver key!";
          break;
        case Globals.ITEM_KEY_YELLOW:
          gameState.addToInventory(Globals.ITEM_KEY_YELLOW, new Object());
          sResponse = "You got the Yellow key!";
          break;
        case Globals.ARTIFACT_ANKH:
          gameState.addToInventory(Globals.ARTIFACT_ANKH, new Object());
          sResponse = "YOU GOT THE ANKH!";
          break;
        case Globals.ARTIFACT_STAFF:
          gameState.addToInventory(Globals.ARTIFACT_STAFF, new Object());
          sResponse = "YOU GOT THE STAFF OF TIUWAHHA!";
          break;
        case Globals.ARTIFACT_MEDALLION:
          gameState.addToInventory(Globals.ARTIFACT_MEDALLION, new Object());
          sResponse = "YOU GOT THE MEDALLION OF THE SUN!";
          break;
        case Globals.ARTIFACT_SCROLL:
          gameState.addToInventory(Globals.ARTIFACT_SCROLL, new Object());
          sResponse = "YOU GOT THE LIFE SCROLL!";
          break;
        case Globals.ARTIFACT_SKULL:
          gameState.addToInventory(Globals.ARTIFACT_SKULL, new Object());
          sResponse = "YOU GOT THE CRYSTAL SKULL!";
          break;
        default:
          log.error("** THIS SHOULD NEVER HAPPEN!");
          break;
      } // End switch.
      // Lastly, remove the item from the collection if we are supposed to.
      if (removeItemFromMap) {
        mapHandler.removeItem(gameState.getCurrentLocationX(),
          gameState.getCurrentLocationY());
      }
      // See if the player now has all five artifacts in their inventory, and
      // if so, signal the player won.
      gameState.checkGameWon();
    } // End if.

    // Create our JSON string with the pertinent information and write it out
    // to the response.
    Utils.writeJSON(false, sResponse, null, false, gameState, playerInfoUpdated,
      response, false, false, null);

    log.debug("PickUpItemCommand.exec() done");

    return null;

  } // End exec().


} // End class.
