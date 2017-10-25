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
import com.apress.ajaxprojects.ajaxchat.dao.AjaxChatDAO;
import com.apress.ajaxprojects.ajaxchat.dto.UserDTO;


/**
 * This is a Struts Action that is called when the user clicks the Leave Room
 * button while chatting in a room.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class LeaveRoomAction extends Action {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(LeaveRoomAction.class);


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

      // Remove the user from the room they were in.
      UserDTO     user     = (UserDTO)session.getAttribute("user");
      String      roomName = (String)session.getAttribute("roomName");
      AjaxChatDAO dao      = AjaxChatDAO.getInstance();
      dao.removeUserFromRoom(roomName, user);

      // Return to the lobby.
      return mapping.findForward("gotoLobby");

    }

  } // End execute().


} // End class.
