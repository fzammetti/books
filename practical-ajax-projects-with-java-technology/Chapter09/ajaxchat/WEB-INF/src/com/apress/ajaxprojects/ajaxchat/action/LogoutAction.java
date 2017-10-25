package com.apress.ajaxprojects.ajaxchat.action;


import com.apress.ajaxprojects.ajaxchat.dao.AjaxChatDAO;
import com.apress.ajaxprojects.ajaxchat.dto.UserDTO;
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


/**
 * This is a Struts Action that is called when the user clicks the Logout
 * button in the Lobby.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class LogoutAction extends Action {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(LogoutAction.class);


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
    synchronized (session) {

      // Not much to do, just invalidate the session and log the user out as far
      // as our DAO goes.  We'll also make the call to remove the user from
      // all rooms, just to be 100% sure they don't linger (shouldn't be any
      // chance of that at this point, but just call me overly anal!)
      UserDTO     user = (UserDTO)request.getSession().getAttribute("user");
      AjaxChatDAO dao  = AjaxChatDAO.getInstance();
      dao.removeUserFromAllRooms(user);
      dao.logUserOut(user);
      request.getSession().invalidate();

      // Display a nice message for the user informing them they are logged out.
      ActionMessages msgs = new ActionMessages();
      msgs.add(ActionMessages.GLOBAL_MESSAGE,
        new ActionMessage("messages.loggedOut"));
      saveErrors(request, msgs);

      return mapping.findForward("gotoWelcome");

    }

  } // End execute().


} // End class.
