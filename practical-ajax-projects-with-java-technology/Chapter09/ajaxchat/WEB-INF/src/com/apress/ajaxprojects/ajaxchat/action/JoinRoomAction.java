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
import com.apress.ajaxprojects.ajaxchat.dto.UserDTO;


/**
 * This is a Struts Action that is called when the user clicks on a room while
 * in the lobby.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class JoinRoomAction extends Action {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(JoinRoomAction.class);


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

      // Get the name of the room the user selected.
      LobbyActionForm form     = (LobbyActionForm)inForm;
      String          roomName = form.getName();

      // Record the room in the users' session.
      session.setAttribute("roomName", roomName);

      // Add the user to the room.
      UserDTO     user = (UserDTO)session.getAttribute("user");
      AjaxChatDAO dao  = AjaxChatDAO.getInstance();
      dao.addUserToRoom(roomName, user);

      return mapping.findForward("showRoom");

    }

  } // End execute().


} // End class.
