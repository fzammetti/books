package com.apress.ajaxprojects.ajaxwarrior.commands;


import com.apress.ajaxprojects.ajaxwarrior.framework.CommandResult;
import com.apress.ajaxprojects.ajaxwarrior.Globals;
import com.apress.ajaxprojects.ajaxwarrior.Utils;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletContext;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * This Command is called when the player purchase an item in a store.
 */
public class PurchaseItemCommand extends Command {


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
  public PurchaseItemCommand(final HttpServletRequest inRequest,
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

    log.debug("PurchaseItemCommand.exec()...");

    // Get what item they want to purchase and how much gold they have now.
    String whichItem  = request.getParameter("whichItem");
    int    goldPieces = gameState.getGoldPieces();
    int    cost       = 0;
    char   itemCode   = whichItem.charAt(0);
    String message    = null;

    // Determine the item's cost and item code.
    switch (itemCode) {
      case Globals.STORE_ITEM_DAGGER:
        cost = Globals.STORE_ITEM_DAGGER_PRICE;
        break;
      case Globals.STORE_ITEM_STAFF:
        cost = Globals.STORE_ITEM_STAFF_PRICE;
        break;
      case Globals.STORE_ITEM_MACE:
        cost = Globals.STORE_ITEM_MACE_PRICE;
        break;
      case Globals.STORE_ITEM_SLINGSHOT:
        cost = Globals.STORE_ITEM_SLINGSHOT_PRICE;
        break;
      case Globals.STORE_ITEM_CROSSBOW:
        cost = Globals.STORE_ITEM_CROSSBOW_PRICE;
        break;
      case Globals.STORE_ITEM_HEALTH_10:
        cost = Globals.STORE_ITEM_HEALTH_10_PRICE;
        break;
      case Globals.STORE_ITEM_HEALTH_15:
        cost = Globals.STORE_ITEM_HEALTH_15_PRICE;
        break;
      case Globals.STORE_ITEM_HEALTH_25:
        cost = Globals.STORE_ITEM_HEALTH_25_PRICE;
        break;
      case Globals.STORE_ITEM_HEALTH_50:
        cost = Globals.STORE_ITEM_HEALTH_50_PRICE;
        break;
      default:
        log.error("** THIS SHOULD NEVER HAPPEN!");
        break;
    }

    // If the player can afford the item, let them buy it.  If not, tell them.
    if (goldPieces >= cost) {
      goldPieces = goldPieces - cost;
      gameState.setGoldPieces(cost);
      if (itemCode == Globals.STORE_ITEM_DAGGER) {
        gameState.addToInventory(Globals.STORE_ITEM_DAGGER, new Object());
        message = "You have purchased a Dagger";
      }
      if (itemCode == Globals.STORE_ITEM_STAFF) {
        gameState.addToInventory(Globals.STORE_ITEM_STAFF, new Object());
        message = "You have purchased a Staff";
      }
      if (itemCode == Globals.STORE_ITEM_MACE) {
        gameState.addToInventory(Globals.STORE_ITEM_MACE, new Object());
        message = "You have purchased a MAce";
      }
      if (itemCode == Globals.STORE_ITEM_SLINGSHOT) {
        gameState.addToInventory(Globals.STORE_ITEM_SLINGSHOT, new Object());
        message = "You have purchased a Slingshot";
      }
      if (itemCode == Globals.STORE_ITEM_CROSSBOW) {
        gameState.addToInventory(Globals.STORE_ITEM_CROSSBOW, new Object());
        message = "You have purchased a Crossbow";
      }
      if (itemCode == Globals.STORE_ITEM_HEALTH_10) {
        gameState.setHealth(gameState.getHealth() + 10);
      }
      if (itemCode == Globals.STORE_ITEM_HEALTH_15) {
        gameState.setHealth(gameState.getHealth() + 15);
      }
      if (itemCode == Globals.STORE_ITEM_HEALTH_25) {
        gameState.setHealth(gameState.getHealth() + 25);
      }
      if (itemCode == Globals.STORE_ITEM_HEALTH_50) {
        gameState.setHealth(gameState.getHealth() + 50);
      }
    } else {
      message = "You do not have enough to purchase that item";
    }

    // Create our JSON string with the pertinent information and write it out
    // to the response.
    Utils.writeJSON(false, message, null, false, gameState, true, response,
      false, false, null);

    log.debug("PurchaseItemCommand.exec() done");

    // Not forwarding anywhere, this is an AJAX request, the response is now
    // fully formed.
    return null;

  } // End exec().


} // End class.

