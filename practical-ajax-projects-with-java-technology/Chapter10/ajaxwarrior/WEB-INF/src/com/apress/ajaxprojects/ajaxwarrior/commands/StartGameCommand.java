package com.apress.ajaxprojects.ajaxwarrior.commands;


import com.apress.ajaxprojects.ajaxwarrior.framework.CommandResult;
import com.apress.ajaxprojects.ajaxwarrior.gameobjects.GameState;
import com.apress.ajaxprojects.ajaxwarrior.Globals;
import com.apress.ajaxprojects.ajaxwarrior.MapHandler;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.ObjectInputStream;
import java.util.LinkedHashMap;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletContext;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * This command is executed to begin a new game.
 */
public class StartGameCommand extends Command {


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
  public StartGameCommand(final HttpServletRequest inRequest,
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

    log.debug("StartGame.exec()...");

    // Needed for output.
    CommandResult result = null;

    // Get the parameter that determines whether we are starting a new game or
    // continuing an existing game.
    String whatFunction = request.getParameter("whatFunction");
    log.info("whatFunction = " + whatFunction);

    // Get the name the user entered.
    String playerName = request.getParameter("playerName");
    log.info("playerName = " + playerName);

    // Starting a new game
    if (whatFunction.equalsIgnoreCase("newGame")) {
      // Set up the initial game state.
      log.info("Starting NEW game...");
      // See if the game already exists.  Only start a new game if it doesn't
      // already exist, return an error if it does.
      String fileName =
        playerName.toLowerCase().replaceAll(" ", "_");
      FileInputStream fis = null;
      try {
        fis = new FileInputStream(servletContext.getRealPath("/WEB-INF") +
          "/gameSaves/" + fileName + ".sav");
        request.setAttribute("Error", "A game with the name you " +
          "entered already exists.\\n\\nPlease select a new name and " +
          "try again.  Sorry!");
        result = new CommandResult("index.jsp");
      } catch (FileNotFoundException fnfe) {
        gameState  = new GameState();
        mapHandler = new MapHandler();
        gameState.setCurrentMode(Globals.MODE_NORMAL);
        gameState.setCurrentLocationX(Globals.PLAYER_START_X);
        gameState.setCurrentLocationY(Globals.PLAYER_START_Y);
        gameState.setName(playerName);
        gameState.setHealth(Globals.PLAYER_START_HEALTH);
        gameState.setHitPoints(Globals.PLAYER_START_HIT_POINTS);
        gameState.setGoldPieces(Globals.PLAYER_START_GOLD_PIECES);
        gameState.setInventory(new LinkedHashMap());
        gameState.setMapHandler(mapHandler);
        gameState.setCurrentWeapon(Globals.WEAPON_NONE);
        gameState.setWinsToHPIncrease(Globals.HIT_POINT_INCREASE_INCREMENT);
        log.debug("StartGame.exec() done (NEW game starting)");
        session.setAttribute(Globals.GAME_PROPERLY_STARTED, "true");
        result = new CommandResult("main.jsp");
      } finally {
        if (fis != null) {
          fis.close();
        }
      }

    } // End new game.

    // Continuing a game.
    if (whatFunction.equalsIgnoreCase("continueGame")) {
      // Reconstitute the saved GameState instance.
      log.info("Continuing EXISTING game...");
      String fileName =
        playerName.toLowerCase().replaceAll(" ", "_");
      FileInputStream   fis       = null;
      ObjectInputStream ois       = null;
      boolean           gameFound = true;
      try {
        fis = new FileInputStream(servletContext.getRealPath("/WEB-INF") +
          "/gameSaves/" + fileName + ".sav");
        ois = new ObjectInputStream(fis);
        gameState = (GameState)ois.readObject();
      } catch (FileNotFoundException fnfe) {
        gameFound = false;
      } finally {
        if (ois != null) {
          ois.close();
        }
        if (fis != null) {
          fis.close();
        }
      }
      // Either forward to main.jsp if the game is found, or index.jsp with an
      // error if not.
      if (gameFound) {
        // Now put the serialized version of the client-side gameState object
        // in request.  It will be reconstituted in the JSP.
        request.setAttribute("clientSideGameState",
          gameState.getClientSideGameState());
        log.debug("StartGame.exec() done (SAVED game starting)");
        session.setAttribute(Globals.GAME_PROPERLY_STARTED, "true");
        result = new CommandResult("main.jsp");
      } else {
        log.debug("Game was not found!");
        request.setAttribute("Error", "A game with the name you " +
          "entered could not be found.\\n\\nDid you enter it EXACTLY as you " +
          "did when you started the game?");
        result = new CommandResult("index.jsp");
      }
    } // End continuing a game.

    return result;

  } // End exec().


} // End class.
