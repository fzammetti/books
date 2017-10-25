package com.apress.ajaxprojects.ajaxwarrior.commands;


import com.apress.ajaxprojects.ajaxwarrior.framework.CommandResult;
import com.apress.ajaxprojects.ajaxwarrior.gameobjects.GameCharacter;
import com.apress.ajaxprojects.ajaxwarrior.gameobjects.GameConversation;
import com.apress.ajaxprojects.ajaxwarrior.gameobjects.GameTalkNode;
import com.apress.ajaxprojects.ajaxwarrior.gameobjects.GameTalkReply;
import com.apress.ajaxprojects.ajaxwarrior.Globals;
import com.apress.ajaxprojects.ajaxwarrior.Utils;
import java.util.ArrayList;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletContext;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * This command is executed when the player chooses a reply during a
 * conversation with a character.
 */
public class TalkReplyCommand extends Command {


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
  public TalkReplyCommand(final HttpServletRequest inRequest,
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

    log.debug("TalkReplyCommand.exec()...");

    // Get the reply the player choose.
    String reply = request.getParameter("reply");

    // Get the GameTalkReply object of the reply the player choose.
    GameCharacter    gc     = gameState.getTalkCharacter();
    GameConversation gConv  = gc.getTalkConversation();
    GameTalkNode     gtn    = gConv.getTalkNode(gameState.getTalkNode());
    GameTalkReply    gtr    = gtn.getReply(reply);

    // First, update the karma for the character based on this reply.
    int charKarma = gameState.getKarma();
    charKarma += gtr.getKarma();
    gameState.setKarma(charKarma);

    // This is what the character will say to the player.
    String charResponse = null;

    // This is the map chunk to be returned and the flag indicating if it
    // is updated or not.
    ArrayList chunk       = null;
    boolean   viewUpdated = false;

    // Now, see if the character is going to run away screaming
    // and yelling.
    if (gameState.getKarma() <= 0) {
      // Yep, karma at or below 0, run away, run away!!
      gameState.setCurrentMode(Globals.MODE_NORMAL);
      // Move character so we aren't sanding on them.
      mapHandler.charPickLocation(mapHandler.getCurrentMapString(), gc);
      gameState.setTalkNode(null);
      gameState.setTalkCharacter(null);
      charResponse = "Argh!  Get away now!";
      // Get the chunk of the map data corresponding to the player's new
      // viewport on the map.
      chunk = mapHandler.getChunk(gameState.getCurrentLocationX(),
        gameState.getCurrentLocationY());
      viewUpdated = true;
    } else if (gameState.getKarma() >= 15 && gc.isGreenKeymaster()) {
      // The character is the green keymaster and their karma is high enough, so
      // now they’ll give the player the key.
      gameState.setCurrentMode(Globals.MODE_NORMAL);
      charResponse = "I place my hope in thee, here is the Green key!";
      gameState.addToInventory(Globals.ITEM_KEY_GREEN, new Object());
      // Make them no longer a keymaster, so they don't give us the key again.
      gc.setGreenKeymaster(false);
      // Move character so we aren't standing on them.
      mapHandler.charPickLocation(mapHandler.getCurrentMapString(), gc);
      gameState.setTalkNode(null);
      gameState.setTalkCharacter(null);
      // Get the chunk of the map data corresponding to the player's new
      // viewport on the map.
      chunk = mapHandler.getChunk(gameState.getCurrentLocationX(),
        gameState.getCurrentLocationY());
      viewUpdated = true;
    } else if (gameState.getKarma() >= 15 && gc.isRedKeymaster()) {
      // The character is the red keymaster and their karma is high enough, so
      // now they will give the player the key.
      gameState.setCurrentMode(Globals.MODE_NORMAL);
      charResponse = "I place my hope in thee, here is the Red key!";
      gameState.addToInventory(Globals.ITEM_KEY_RED, new Object());
      // Make them no longer a keymaster, so they don't give us the key again.
      gc.setRedKeymaster(false);
      // Move character so we aren't standing on them.
      mapHandler.charPickLocation(mapHandler.getCurrentMapString(), gc);
      gameState.setTalkNode(null);
      gameState.setTalkCharacter(null);
      // Get the chunk of the map data corresponding to the player's new
      // viewport on the map.
      chunk = mapHandler.getChunk(gameState.getCurrentLocationX(),
        gameState.getCurrentLocationY());
      viewUpdated = true;
    } else {
      // Just another node in the conversation.  So, get the target node for
      // this reply and "jump" to it.
      String target = gtr.getTarget();
      gameState.setTalkNode(target);
      gtn = gConv.getTalkNode(target);
      charResponse = gtn.getResponse();
    }

    // Create our JSON string with the pertinent information and write it out
    // to the response.
    Utils.writeJSON(false, charResponse, chunk, viewUpdated, gameState, false,
      response, false, false, null);

    log.debug("TalkReplyCommand.exec() done");

    return null;

  } // End exec().


} // End class.
