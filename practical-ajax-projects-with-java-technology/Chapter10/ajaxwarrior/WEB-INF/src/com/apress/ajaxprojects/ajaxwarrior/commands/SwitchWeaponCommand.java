package com.apress.ajaxprojects.ajaxwarrior.commands;


import com.apress.ajaxprojects.ajaxwarrior.framework.CommandResult;
import com.apress.ajaxprojects.ajaxwarrior.Utils;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletContext;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * This command is called to actually switch weapons.
 */
public class SwitchWeaponCommand extends Command {


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
  public SwitchWeaponCommand(final HttpServletRequest inRequest,
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

    log.debug("SwitchWeaponCommand.exec()...");

    // Retreive which weapon the player is switching to.
    String paramWhichWeapon = request.getParameter("whichWeapon");
    char whichWeapon = paramWhichWeapon.charAt(0);
    // Set it as current.
    gameState.setCurrentWeapon(whichWeapon);

    // Report back to the user.
    String message = "You are now using your " +
      Utils.getDescFromCode(gameState.getCurrentWeapon(), gameState);

    // Create our JSON string with the pertinent information and write it out
    // to the response.
    Utils.writeJSON(false, message, null, false, gameState, false, response,
      false, false, null);

    log.debug("SwitchWeaponCommand.exec() done");

    return null;

  } // End exec().


} // End class.
