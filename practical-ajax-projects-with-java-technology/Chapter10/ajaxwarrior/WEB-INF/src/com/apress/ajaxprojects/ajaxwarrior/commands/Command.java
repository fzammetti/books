package com.apress.ajaxprojects.ajaxwarrior.commands;


import com.apress.ajaxprojects.ajaxwarrior.framework.CommandResult;
import com.apress.ajaxprojects.ajaxwarrior.gameobjects.GameState;
import com.apress.ajaxprojects.ajaxwarrior.MapHandler;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.servlet.ServletContext;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * This is a common base Command that all Commands extend from.
 */
public class Command {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog("com.apress.ajaxprojects");


  /**
   * Current request being services.
   */
  protected HttpServletRequest request;


  /**
   * Current response being generated.
   */
  protected HttpServletResponse response;


  /**
   * Current session associated with the client issuing the current request.
   */
  protected HttpSession session;


  /**
   * ServletContext the request is executing in.
   */
  protected ServletContext servletContext;

  /**
   * The gameState object.
   */
  protected GameState gameState;


  /**
   * The mapHandler object.
   */
  protected MapHandler mapHandler;


  /**
   * Constructor.
   *
   * @param inRequest        The request being services.
   * @param inResponse       The response being generated.
   * @param inServletContext The ServletContext the requests is executing in.
   */
  public Command(final HttpServletRequest inRequest,
    final HttpServletResponse inResponse,
    final ServletContext inServletContext) {

    request        = inRequest;
    response       = inResponse;
    session        = request.getSession(true);
    servletContext = inServletContext;
    gameState      = (GameState)session.getAttribute("gameState");
    // When the StartGameCommand is called before a game has started, gameState
    // will be null, so we have to check for that lest we throw an NPE.
    if (gameState != null) {
      mapHandler = gameState.getMapHandler();
    }

  } // End constructor().


  /**
   * Main entry point.
   *
   * @return           The result of the execution.
   * @throws Exception If anything foes wrong.
   */
  public CommandResult exec() throws Exception {

    return null;

  } // End exec().


  /**
   * Called when exec() completes to perform any tasks that must happen
   * at that point, like putting gameState and mapHandler back in session.
   */
  public void finish() {

    if (gameState != null) {
      gameState.setMapHandler(mapHandler);
      session.setAttribute("gameState", gameState);
    }
    log.debug("Command done");

  } // End finish().



} // End class.

