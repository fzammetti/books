package com.apress.ajaxprojects.ajaxchat.action;


import java.util.Date;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.struts.action.Action;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.action.ActionMessage;
import org.apache.struts.action.ActionMessages;
import com.apress.ajaxprojects.ajaxchat.dao.AjaxChatDAO;
import com.apress.ajaxprojects.ajaxchat.dto.UserDTO;
import com.apress.ajaxprojects.ajaxchat.filter.SessionCheckerFilter;


/**
 * This is a Struts Action that is called when the user clicks the Login button
 * on the welcome screen.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class LoginAction extends Action {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(LoginAction.class);


  /**
   * Execute.
   *
   * @param  mapping   ActionMapping.
   * @param  inForm    ActionForm.
   * @param  request   HttpServletRequest.
   * @param  response  HttpServletResponse.
   * @return           ActionForward.
   * @throws Exception If anything goes wrong.
   */
  public ActionForward execute(ActionMapping mapping, ActionForm inForm,
    HttpServletRequest request, HttpServletResponse response) throws Exception {

    if (log.isDebugEnabled()) {
      log.debug("execute()...");
    }

    HttpSession session = request.getSession();
    if (log.isDebugEnabled()) {
      log.debug("session = " + session);
    }
    synchronized (session) {

      // Get the username the user entered.
      String username = (String)request.getParameter("username");
      if (log.isDebugEnabled()) {
        log.debug("username = " + username);
      }

      ActionForward af = null;
      if (session != null &&
        session.getAttribute(SessionCheckerFilter.LOGGED_IN_FLAG) != null) {
        // User is already logged in, they probably hit refresh while in the
        // lobby, so go there now.
        if (log.isDebugEnabled()) {
          log.debug("User already logged in");
        }
        // There is still a minor potential problem... if by chance the user
        // was logged in and the app was restarted and sessions were persisted,
        // the user object in session can be null.  So, we'll check for that,
        // and recreate the user if applicable.
        if (session.getAttribute("user") == null) {
          if (log.isDebugEnabled()) {
            log.debug("User object null in session, so re-creating");
          }
          UserDTO user = new UserDTO(username);
          user.setLastAJAXRequest(new Date());
          session.setAttribute("user", user);
        }
        af = mapping.findForward("gotoLobby");
      } else {
        if (username == null || username.equalsIgnoreCase("")) {
          // Username was not entered, so they can't come in.
          if (log.isDebugEnabled()) {
            log.debug("Username not entered");
          }
          ActionMessages msgs = new ActionMessages();
          msgs.add(ActionMessages.GLOBAL_MESSAGE,
            new ActionMessage("messages.usernameBlank"));
          saveErrors(request, msgs);
          af = mapping.findForward("fail");
        } else {
          if (AjaxChatDAO.getInstance().isUsernameInUse(username)) {
            // The username is already in use, so they can't have it.
            if (log.isDebugEnabled()) {
              log.debug("Username already in use");
            }
            ActionMessages msgs = new ActionMessages();
            msgs.add(ActionMessages.GLOBAL_MESSAGE,
              new ActionMessage("messages.usernameInUse"));
            saveErrors(request, msgs);
            af = mapping.findForward("fail");
          } else {
            // Everything is OK, so create a new UserDTO and put it in session.
            if (log.isDebugEnabled()) {
              log.debug("Username being logged in");
            }
            UserDTO user = new UserDTO(username);
            user.setLastAJAXRequest(new Date());
            session.setAttribute("user", user);
            session.setAttribute(SessionCheckerFilter.LOGGED_IN_FLAG, "yes");
            // Lastly, add this user to the list of logged on users.
            AjaxChatDAO.getInstance().logUserIn(user);
            af = mapping.findForward("gotoLobby");
          }
        }
      }

      if (log.isDebugEnabled()) {
        log.debug("LoginAction complete, forwarding to " + af);
      }
      return af;

    }

  } // End execute().


} // End class.
