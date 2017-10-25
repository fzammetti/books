package com.apress.ajaxprojects.ajaxwarrior.commands;


import com.apress.ajaxprojects.ajaxwarrior.framework.CommandResult;
import com.apress.ajaxprojects.ajaxwarrior.gameobjects.ClientSideGameState;
import com.apress.ajaxprojects.ajaxwarrior.Utils;
import java.io.ByteArrayInputStream;
import java.io.FileOutputStream;
import java.io.ObjectOutputStream;
import javawebparts.request.RequestHelpers;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletContext;
import org.apache.commons.digester.Digester;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * This command is called to save the current game.
 */
public class SaveGameCommand extends Command {


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
  public SaveGameCommand(final HttpServletRequest inRequest,
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

    log.debug("SaveGameCommand.exec()...");

    // Get the serialize version of the client-side gameState object.
    String csGameStateSer = RequestHelpers.getBodyContent(request);

    // Use digester to parse the gameState object's XML representation.
    // The XML has the form:
    // <gameState>
    //   <activityScroll>
    //     <entry />
    //   </activityScroll>
    //   <talkAttackMode />
    //   <currentWeapon />
    // </gameState>
    Digester digester = new Digester();
    digester.setValidating(false);
    digester.addObjectCreate("gameState",
      "com.apress.ajaxprojects.ajaxwarrior.gameobjects.ClientSideGameState");
    digester.addBeanPropertySetter("gameState/activityScroll/entry",
      "activityScrollEntry");
    digester.addBeanPropertySetter("gameState/talkAttackMode",
      "talkAttackMode");
    digester.addBeanPropertySetter("gameState/currentWeapon", "currentWeapon");
    ClientSideGameState csGameState = (ClientSideGameState)digester.parse(
      new ByteArrayInputStream(csGameStateSer.getBytes()));
    log.info("Client-side gameState parsed, result = " + csGameState);

    // Now add the client-side game state object to gameState (the
    // server-side version).
    gameState.setClientSideGameState(csGameState);

    // Now serialize gameState to disk.  It is now a complete representation
    // of the game's state, both server-side and client-side.
    String fileName = gameState.getName().toLowerCase().replaceAll(" ", "_");
    FileOutputStream fos =
      new FileOutputStream(servletContext.getRealPath("/WEB-INF") +
        "/gameSaves/" + fileName + ".sav");
    ObjectOutputStream oos = new ObjectOutputStream(fos);
    oos.writeObject(gameState);
    oos.flush();
    fos.flush();
    oos.close();
    fos.close();

    // Create our JSON string with the pertinent information and write it out
    // to the response.
    Utils.writeJSON(false, "Game saved", null, false, gameState, false,
      response, false, false, null);

    log.debug("SaveGameCommand.exec() done");

    return null;

  } // End exec().


} // End class.
