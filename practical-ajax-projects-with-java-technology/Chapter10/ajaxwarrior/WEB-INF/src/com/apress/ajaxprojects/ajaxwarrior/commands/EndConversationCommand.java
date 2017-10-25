package com.apress.ajaxprojects.ajaxwarrior.commands;


import com.apress.ajaxprojects.ajaxwarrior.framework.CommandResult;
import com.apress.ajaxprojects.ajaxwarrior.gameobjects.GameCharacter;
import com.apress.ajaxprojects.ajaxwarrior.Globals;
import com.apress.ajaxprojects.ajaxwarrior.Utils;
import java.util.ArrayList;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletContext;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * This command is executed when the player wants to abruptly end a
 * conversation with a character.
 */
public class EndConversationCommand extends Command {


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
  public EndConversationCommand(final HttpServletRequest inRequest,
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

    log.debug("EndConversationCommand.exec()...");

    // Put us back in normal mode.  Be sure the character moves off the
    // player.
    gameState.setCurrentMode(Globals.MODE_NORMAL);
    GameCharacter gc = gameState.getTalkCharacter();
    mapHandler.charPickLocation(mapHandler.getCurrentMapString(), gc);
    gameState.setTalkNode(null);
    gameState.setTalkCharacter(null);

    // Get the chunk of the map data corresponding to the player's new
    // viewport on the map.
    ArrayList chunk = mapHandler.getChunk(gameState.getCurrentLocationX(),
      gameState.getCurrentLocationY());

    // Create our JSON string with the pertinent information and write it out
    // to the response.
    Utils.writeJSON(false, "You abruptly end the conversation.  Shame on thee!",
      chunk, true, gameState, false, response, false, false, null);

    log.debug("EndConversationCommand.exec() done");

    return null;

  } // End exec().


} // End class.
