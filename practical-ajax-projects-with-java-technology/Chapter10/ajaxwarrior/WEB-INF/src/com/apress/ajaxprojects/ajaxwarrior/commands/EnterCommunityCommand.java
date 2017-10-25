package com.apress.ajaxprojects.ajaxwarrior.commands;


import com.apress.ajaxprojects.ajaxwarrior.framework.CommandResult;
import com.apress.ajaxprojects.ajaxwarrior.Globals;
import com.apress.ajaxprojects.ajaxwarrior.Utils;
import java.util.ArrayList;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletContext;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * This Command is called when the player enters a community (town, village
 * or castle).
 */
public class EnterCommunityCommand extends Command {


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
  public EnterCommunityCommand(final HttpServletRequest inRequest,
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

    log.debug("EnterCommunity.exec()...");

    // These are variables that are used to construct the JSON response.
    String  message     = null;
    boolean viewUpdated = false;

    // Get the current map location (upper left-hand corner of the viewport).
    int currentLocationX = gameState.getCurrentLocationX();
    int currentLocationY = gameState.getCurrentLocationY();

    // Record the current location on the main map.  This will be used when we
    // exit the community.
    gameState.setMainLocationX(currentLocationX);
    gameState.setMainLocationY(currentLocationY);

    // Get the chunk of the map data corresponding the the player's current
    // viewport on the map.
    ArrayList chunk = mapHandler.getChunk(currentLocationX, currentLocationY);

    // Now see if the center tile, where our character is standing, is a
    // community tile.  If it is, load the appropriate map.  If not, just return
    // a message.
    char centerTile = mapHandler.getPlayerTile(chunk);
    if (centerTile == Globals.TILE_TOWN_A) {
      message = "You have entered the town of Rallador";
      viewUpdated = true;
      gameState.setInCommunity(true);
      currentLocationX = Globals.COMMUNITY_STARTING_X;
      currentLocationY = Globals.COMMUNITY_STARTING_Y;
      gameState.setCurrentLocationX(currentLocationX);
      gameState.setCurrentLocationY(currentLocationY);
      mapHandler.switchMap("town_a");
      chunk = mapHandler.getChunk(currentLocationX, currentLocationY);
    } else if (centerTile == Globals.TILE_TOWN_B) {
      message = "You have entered the town of Triyut";
      viewUpdated = true;
      gameState.setInCommunity(true);
      currentLocationX = Globals.COMMUNITY_STARTING_X;
      currentLocationY = Globals.COMMUNITY_STARTING_Y;
      gameState.setCurrentLocationX(currentLocationX);
      gameState.setCurrentLocationY(currentLocationY);
      mapHandler.switchMap("town_b");
      chunk = mapHandler.getChunk(currentLocationX, currentLocationY);
    } else if (centerTile == Globals.TILE_VILLAGE) {
      message = "You have entered the unnamed village";
      viewUpdated = true;
      gameState.setInCommunity(true);
      currentLocationX = Globals.COMMUNITY_STARTING_X;
      currentLocationY = Globals.COMMUNITY_STARTING_Y;
      gameState.setCurrentLocationX(currentLocationX);
      gameState.setCurrentLocationY(currentLocationY);
      mapHandler.switchMap("village");
      chunk = mapHandler.getChunk(currentLocationX, currentLocationY);
    } else if (centerTile == Globals.TILE_CASTLE_MIDDLE) {
      message = "You have entered Castle Faldon";
      viewUpdated = true;
      gameState.setInCommunity(true);
      currentLocationX = Globals.COMMUNITY_STARTING_X;
      currentLocationY = Globals.COMMUNITY_STARTING_Y;
      gameState.setCurrentLocationX(currentLocationX);
      gameState.setCurrentLocationY(currentLocationY);
      mapHandler.switchMap("castle");
      chunk = mapHandler.getChunk(currentLocationX, currentLocationY);
    } else {
      chunk = null;
      message = "Nothing to enter";
    }

    // Create our JSON string with the pertinent information and write it out
    // to the response.
    Utils.writeJSON(false, message, chunk, viewUpdated, gameState, false,
      response, false, false, null);

    log.debug("EnterCommunity.exec() done");

    // Not forwarding anywhere, this is an AJAX request, the response is now
    // fully formed.
    return null;

  } // End exec().


} // End class.

