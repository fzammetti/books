package com.apress.dwrprojects.inmemoria;


import java.util.HashMap;
import java.util.Random;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.directwebremoting.annotations.RemoteMethod;
import org.directwebremoting.annotations.RemoteProxy;
import org.directwebremoting.WebContext;
import org.directwebremoting.WebContextFactory;


/**
 * This class provides the core game logic.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>
 */
@RemoteProxy
public class GameCore {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(GameCore.class);


  /**
   * Called when the start new game button is clicked.
   *
   * @param  inRequest Request object being serviced.
   * @return           An array of tile values for the player.
   */
  @RemoteMethod
  public int[] startGame(final HttpServletRequest inRequest) {

    log.trace("startGame() - Entry");

    try {

      // Create random set of tile data for player and opponent alike.
      int[] userGrid = generateGrid();
      int[] opponentGrid = generateGrid();

      // Spawn a game execution thread, start it up, and stash it in session.
      // Also be sure to give it a WebContext so Comet will work from it,
      // as well as any other information it will need to run.
      WebContext webContext = WebContextFactory.get();
      Thread opponent = new Opponent();
      ((Opponent)opponent).setWebContext(webContext);
      ((Opponent)opponent).setTileValues(opponentGrid);
      opponent.setDaemon(true);
      opponent.start();
      HttpSession session = inRequest.getSession(true);
      session.setAttribute("opponent", opponent);

      // Also store in session the number of matches the player has found
      // during this game. Used to check for a win.
      session.setAttribute("matches", new Integer(0));

      log.trace("startGame() - Exit");
      return userGrid;

    } catch (Exception e) {
      e.printStackTrace();
      return null;
    }

  } // End startGame().


  /**
   * Generates a random grid populated with matching sets of tiles.
   *
   * @return An array representing a playfield.
   */
  private int[] generateGrid() {

    log.trace("generateGrid() - Entry");

    // The grid of tiles.
    int[] grid = new int[42];

    // Record which tiles have been randomly set already.
    HashMap<Integer, Object> tilesSetAlready = new HashMap<Integer, Object>();

    // There are 21 tile types to set, i.e., 21 pairs.
    for (int i = 1; i < 22; i++) {
      Random generator = new Random();
      // Pick one tile, and keep doing it until one that isn't set is found.
      int tile1 = generator.nextInt(42);
      while (tilesSetAlready.get(new Integer(tile1)) != null) {
        tile1 = generator.nextInt(42);
      }
      // Pick another tile, and keep doing it until one that isn't set is found.
      tilesSetAlready.put(new Integer(tile1), new Object());
      int tile2 = generator.nextInt(42);
      while (tilesSetAlready.get(new Integer(tile2)) != null) {
        tile2 = generator.nextInt(42);
      }
      tilesSetAlready.put(new Integer(tile2), new Object());
      // Set the tiles to the next tile type.
      grid[tile1] = i;
      grid[tile2] = i;
    }

    log.trace("generateGrid() - Exit");
    return grid;

  } // End generateGrid().


  /**
   * Called to see if the player one the game.
   *
   * @param  inSession The session associated with the user making the call.
   * @return           True if the player one, false if not.
   */
  @RemoteMethod
  public boolean checkForWin(HttpSession inSession) {

    // Bump up the player match count.
    int matches = ((Integer)inSession.getAttribute("matches")).intValue();
    matches++;
    inSession.setAttribute("matches", new Integer(matches));

    // See if the player won.
    if (matches > 20) {
      // Yes, player won, so stop opponent thread.
      ((Opponent)inSession.getAttribute("opponent")).setIsActive(false);
      return true;
    } else {
      // Nope, player didn't win.
      return false;
    }

  } // End checkForWin().


  /**
   * Returns the contents of howToPlay.jsp.
   *
   * @return The How To Play information.
   */
  @RemoteMethod
  public String howToPlay() throws Exception {

    return WebContextFactory.get().forwardToString("/howToPlay.txt");

  } // End howToPlay.


} // End class.
