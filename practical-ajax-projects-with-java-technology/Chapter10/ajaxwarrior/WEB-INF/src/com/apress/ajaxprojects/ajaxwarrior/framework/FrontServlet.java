package com.apress.ajaxprojects.ajaxwarrior.framework;


import com.apress.ajaxprojects.ajaxwarrior.commands.BattleEnemyMoveCommand;
import com.apress.ajaxprojects.ajaxwarrior.commands.BattleMoveCommand;
import com.apress.ajaxprojects.ajaxwarrior.commands.CastSpellCommand;
import com.apress.ajaxprojects.ajaxwarrior.commands.Command;
import com.apress.ajaxprojects.ajaxwarrior.commands.DisplayInventoryCommand;
import com.apress.ajaxprojects.ajaxwarrior.commands.EndConversationCommand;
import com.apress.ajaxprojects.ajaxwarrior.commands.EnterCommunityCommand;
import com.apress.ajaxprojects.ajaxwarrior.commands.PickUpItemCommand;
import com.apress.ajaxprojects.ajaxwarrior.commands.PurchaseItemCommand;
import com.apress.ajaxprojects.ajaxwarrior.commands.SaveGameCommand;
import com.apress.ajaxprojects.ajaxwarrior.commands.ShowCastSpellCommand;
import com.apress.ajaxprojects.ajaxwarrior.commands.ShowSwitchWeaponCommand;
import com.apress.ajaxprojects.ajaxwarrior.commands.StartGameCommand;
import com.apress.ajaxprojects.ajaxwarrior.commands.SwitchWeaponCommand;
import com.apress.ajaxprojects.ajaxwarrior.commands.TalkReplyCommand;
import com.apress.ajaxprojects.ajaxwarrior.commands.ToggleTalkAttackCommand;
import com.apress.ajaxprojects.ajaxwarrior.commands.UpdateMapCommand;
import com.apress.ajaxprojects.ajaxwarrior.Utils;
import java.io.IOException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletException;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 *
 */
public class FrontServlet extends HttpServlet {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog("com.apress.ajaxprojects");


  /**
   * doGet.
   *
   * @param  inRequest        HTTPServletRequest.
   * @param  inResponse       HTTPServletResponse.
   * @throws ServletException ServletException.
   * @throws IOException      IOExcpetion.
   */
  public void doGet(final HttpServletRequest inRequest,
    final HttpServletResponse inResponse) throws ServletException, IOException {

    log.debug("FrontServlet.doGet()...");

    doPost(inRequest, inResponse);

    log.debug("FrontServlet.doGet() done");

  } // End doGet().


  /**
   * doPost.
   *
   * @param  inRequest        HTTPServletRequest.
   * @param  inResponse       HTTPServletResponse.
   * @throws ServletException ServletException.
   * @throws IOException      IOExcpetion.
   */
  public void doPost(final HttpServletRequest inRequest,
    final HttpServletResponse inResponse) throws ServletException, IOException {

    log.debug("FrontServlet.doPost()...");

    // Determine the command that was requested.
    String   requestURI = inRequest.getRequestURI();
    int      position   = requestURI.lastIndexOf('/');
    String   com        = requestURI.substring(position + 1);
    position            = com.lastIndexOf('.');
    com                 = com.substring(0, position);
    log.info("* Command = " + com);

    // Dispatch to the appropriate Command class to handle it.  Globally
    // handle any exceptions that occur.
    Command       command       = null;
    CommandResult commandResult = null;
    try {
      if (com.equalsIgnoreCase("startGame")) {
        command = new StartGameCommand(
          inRequest, inResponse, getServletContext());
      }
      if (com.equalsIgnoreCase("updateMap")) {
        command = new UpdateMapCommand(
          inRequest, inResponse, getServletContext());
      }
      if (com.equalsIgnoreCase("enterCommunity")) {
        command = new EnterCommunityCommand(
          inRequest, inResponse, getServletContext());
      }
      if (com.equalsIgnoreCase("displayInventory")) {
        command = new DisplayInventoryCommand(
          inRequest, inResponse, getServletContext());
      }
      if (com.equalsIgnoreCase("pickUpItem")) {
        command = new PickUpItemCommand(
          inRequest, inResponse, getServletContext());
      }
      if (com.equalsIgnoreCase("endConversation")) {
        command = new EndConversationCommand(
          inRequest, inResponse, getServletContext());
      }
      if (com.equalsIgnoreCase("talkReply")) {
        command = new TalkReplyCommand(
          inRequest, inResponse, getServletContext());
      }
      if (com.equalsIgnoreCase("battleMove")) {
        command = new BattleMoveCommand(
          inRequest, inResponse, getServletContext());
      }
      if (com.equalsIgnoreCase("battleEnemyMove")) {
        command = new BattleEnemyMoveCommand(
          inRequest, inResponse, getServletContext());
      }
      if (com.equalsIgnoreCase("castSpell")) {
        command = new CastSpellCommand(
          inRequest, inResponse, getServletContext());
      }
      if (com.equalsIgnoreCase("showCastSpell")) {
        command = new ShowCastSpellCommand(
          inRequest, inResponse, getServletContext());
      }
      if (com.equalsIgnoreCase("purchaseItem")) {
        command = new PurchaseItemCommand(
          inRequest, inResponse, getServletContext());
      }
      if (com.equalsIgnoreCase("toggleTalkAttack")) {
        command = new ToggleTalkAttackCommand(
          inRequest, inResponse, getServletContext());
      }
      if (com.equalsIgnoreCase("switchWeapon")) {
        command = new SwitchWeaponCommand(
          inRequest, inResponse, getServletContext());
      }
      if (com.equalsIgnoreCase("showSwitchWeapon")) {
        command = new ShowSwitchWeaponCommand(
          inRequest, inResponse, getServletContext());
      }
      if (com.equalsIgnoreCase("saveGame")) {
        command = new SaveGameCommand(
          inRequest, inResponse, getServletContext());
      }
      commandResult = command.exec();
      command.finish();
    } catch (Exception e) {
      e.printStackTrace();
      try {
        Utils.writeJSON(true, "An exception occured.  Please review logs for " +
          "full details.  Exception messgae is: " + e.getMessage(), null,
          false, null, false, inResponse, false, false, null);
      } catch (Exception e1) {
        e1.printStackTrace();
        log.error("EXCEPTION WRITING JSON EXCEPTION RESPONSE!  D'OH!");
      }
    }

    // Now forward as appropriate.
    if (commandResult != null) {
      String frPath = commandResult.getPath();
      if (commandResult.doRedirect()) {
        if (log.isDebugEnabled()) {
          log.debug("Redirecting to " + frPath);
        }
        ((HttpServletResponse)inResponse).sendRedirect(frPath);
      } else {
        if (log.isDebugEnabled()) {
          log.debug("Forwarding to " + frPath);
        }
        inRequest.getRequestDispatcher(frPath).forward(inRequest, inResponse);
      }
    } else {
      log.debug("commandResult returned was NULL, response fully formed");
    }

    log.debug("FrontServlet.doPost() done");

  } // End doPost().


} // End class.
