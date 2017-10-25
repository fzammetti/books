package com.apress.ajaxprojects.ajaxchat.action;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.struts.action.Action;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import com.apress.ajaxprojects.ajaxchat.actionform.LobbyActionForm;
import com.apress.ajaxprojects.ajaxchat.dao.AjaxChatDAO;


/**
 * This is a Struts Action that shows the lobby screen.  Note that it is called
 * as a result of a user logging in, as well as continually via AJAX while the
 * user is in the lobby to update the room statistics (i.e, how many users are
 * chatting in each room).
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class LobbyAction extends Action {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(LobbyAction.class);


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

      // Get the list of rooms and add it to the ActionForm.
      AjaxChatDAO dao = AjaxChatDAO.getInstance();
      LobbyActionForm form = (LobbyActionForm)inForm;
      form.setRooms(dao.getRoomList());

      return mapping.findForward("showLobby");

    }

  } // End execute().


} // End class.
