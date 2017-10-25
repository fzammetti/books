package com.apress.dwrprojects.inmemoria;


import java.util.Random;
import javax.servlet.http.HttpSession;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.directwebremoting.annotations.RemoteMethod;
import org.directwebremoting.annotations.RemoteProxy;
import org.directwebremoting.ScriptBuffer;
import org.directwebremoting.ScriptSession;
import org.directwebremoting.WebContext;


/**
 * This class is a computerized opponent.  It plays the game against the user.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>
 */
@RemoteProxy(creator=OpponentCreator.class)
public class Opponent extends Thread {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(Opponent.class);


  /**
   * Flag: Is this opponent still active? (meaning the game hasn't ended yet).
   */
  private boolean isActive = true;


  /**
   * A DWR WebContext instance for the session representing the human player.
   */
  private WebContext webContext;


  /**
   * The grid of tiles generated when the game was started.
   */
  private int[] tileValues;


  /**
   * The grid of tile states.  0 means the tile is available, 1 means it's been
   * matched already.
   */
  private int[] tileStates = {
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  };


  /**
   * Records the first tile flipped by the opponent.
   */
  private int flippedTile1 = -1;


  /**
   * Records the second tile flipped by the opponent.
   */
  private int flippedTile2 = -1;


  /**
   * The number of matches the opponent has found thus far.
   */
  private int matches;


  /**
   * Constants defining the various states (the possible values of the
   * currentState field) this opponent thread can be in.
   */
  private static final int STATE_WAITING = 0;
  private static final int STATE_PICK_TILE_1 = 1;
  private static final int STATE_PICK_TILE_2 = 2;
  private static final int STATE_CHECK_FOR_MATCH = 3;


  /**
   * This stores what state the opponent is currently in.
   */
  private int currentState = STATE_PICK_TILE_1;


  /**
   * Mutator for webContext.
   *
   * @param inWebContext The WebContext to store.
   */
  public void setWebContext(final WebContext inWebContext) {

    webContext = inWebContext;

  } // And setWebContext().


  /**
   * Mutator for tileValues.
   *
   * @param inTileValues The tileValues to store.
   */
  public void setTileValues(final int[] inTileValues) {

    tileValues = inTileValues;

  } // And setTileValues().


  /**
   * Mutator for isActive.
   *
   * @param inIsActive New value for isActive.
   */
  public void setIsActive(final boolean inIsActive) {

    isActive = inIsActive;

  } // End setIsActive().


  /**
   * Main thread run method.
   */
  public void run() {

    while (isActive) {

      try {

        log.trace("run() - Next iteration");

        ScriptBuffer script = new ScriptBuffer();

        switch (currentState) {

          case STATE_PICK_TILE_1: {

            log.trace("run() - Picking tile #1");
            flippedTile1 = pickTile(false);
            currentState = STATE_WAITING;
            script.appendScript("inMemoria.opponentFlipTile(").appendData(
              "1").appendScript(", ").appendData(flippedTile1).appendScript(
              ", ").appendData(tileValues[flippedTile1]).appendScript(");");

          break; }

          case STATE_PICK_TILE_2: {

            log.trace("run() - Picking tile #2");
            flippedTile2 = pickTile(true);
            currentState = STATE_WAITING;
            script.appendScript("inMemoria.opponentFlipTile(").appendData(
              "2").appendScript(", ").appendData(flippedTile2).appendScript(
              ", ").appendData(tileValues[flippedTile2]).appendScript(");");

          break; }

          case STATE_CHECK_FOR_MATCH: {

            log.trace("run() - Checking for match");
            if (tileValues[flippedTile1] == tileValues[flippedTile2]) {
              // Match.
              log.debug("run() - Match found");
              tileStates[flippedTile1] = 1;
              tileStates[flippedTile2] = 1;
              script.appendScript("inMemoria.opponentMatch(").appendData(
                flippedTile1).appendScript(", ").appendData(
                flippedTile2).appendScript(");");
            } else {
              // No match.
              log.debug("run() - No match");
              script.appendScript("inMemoria.opponentNoMatch(").appendData(
                flippedTile1).appendScript(", ").appendData(
                flippedTile2).appendScript(");");
            }
            currentState = STATE_WAITING;

          break; }

        }

        // Call client-side functions.
        ScriptSession scriptSession = webContext.getScriptSession();
        scriptSession.addScript(script);

        sleep(250);

      } catch (Exception e) {
        // This shouldn't ever happen.
        e.printStackTrace();
      }

    } // End isActive loop.

  } // End run().


  /**
   * Randomly selects a tile.
   *
   * @param  inSecondTile When picking the second tile, this is true,
   *                      else false.
   * @return              The tile choosen.
   */
  private int pickTile(final boolean inSecondTile) {

    Random generator = new Random();
    if (inSecondTile) {
      // When it's the second tile, there's initially a 10% chance the opponent
      // will simply choose the right matching tile; otherwise fall through to
      // a random choice.  However, as the opponent finds more matches, the
      // percentage increases slightly to simulate a player with a memory
      // (albeit not a great memory!).
      int choosePercent = generator.nextInt(100);
      if (choosePercent < (10 + matches)) {
        log.debug("pickTile() - Choosing matching tile");
        for (int i = 0; i < 42; i++) {
          if (tileValues[i] == tileValues[flippedTile1] && i != flippedTile1) {
          if (log.isDebugEnabled()) {
            log.debug("pickTile() - Matching tile = " + i);
          }
            return i;
          }
        }
      }
    }
    int tile = generator.nextInt(42);
    // Keep picking until we pick one that isn't already matched and that
    // isn't currently flipped.
    while (tileStates[tile] == 1 || tile == flippedTile1 ||
      tile == flippedTile2) {
      tile = generator.nextInt(42);
    }
    if (log.isDebugEnabled()) {
      log.debug("pickTile() - tile = " + tile);
    }
    return tile;

  } // End pickTile().


  /**
   * Called by the client to confirm a tile the opponent picked is flipped.
   *
   * @param inTile    The tile number, 1 or 2, that was flipped.
   * @param inSession The session associated with the user making the call.
   */
  @RemoteMethod
  public void confirmFlip(final int inTile,
    final HttpSession inSession) {

    log.trace("confirmFlip() - Entry");
    if (log.isDebugEnabled()) {
      log.trace("confirmFlip() - inTile = " + inTile);
    }
    if (inTile == 1) {
      currentState = STATE_PICK_TILE_2;
    } else {
      currentState = STATE_CHECK_FOR_MATCH;
    }
    inSession.setAttribute("opponent", this);
    log.trace("confirmFlip() - Exit");

  } // End confirmFlip().


  /**
   * Called by the client to confirm the two tiles the opponent picked have
   * either been flipped back (no match) or have been exploded (match).
   *
   * @param inSession The session associated with the user making the call.
   */
  @RemoteMethod
  public void outcomeComplete(final HttpSession inSession) {

    log.trace("outcomeComplete() - Entry");
    if (tileValues[flippedTile1] == tileValues[flippedTile2]) {
      // Match.  Bump up match counter and check for a win.
      matches++;
      if (matches > 20) {
        log.debug("outcomeConfirmer() - Opponent won");
        // Opponent won.  Stop thread from running and alert the client.
        isActive = false;
        ScriptBuffer script = new ScriptBuffer();
        script.appendScript("inMemoria.opponentWon();");
        ScriptSession scriptSession = webContext.getScriptSession();
        scriptSession.addScript(script);
        currentState = STATE_WAITING;
        inSession.setAttribute("opponent", this);
        log.trace("outcomeComplete() - Exit (1)");
        return;
      }
    }
    // Reset for next tile pick.  Note this won't matter if the opponent won.
    flippedTile1 = -1;
    flippedTile2 = -1;
    currentState = STATE_PICK_TILE_1;
    inSession.setAttribute("opponent", this);
    log.trace("outcomeComplete() - Exit (2)");

  } // End outcomeComplete().


} // End class.
