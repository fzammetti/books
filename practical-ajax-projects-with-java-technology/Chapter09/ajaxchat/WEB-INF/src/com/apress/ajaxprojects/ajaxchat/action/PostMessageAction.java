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
import org.apache.struts.action.DynaActionForm;
import com.apress.ajaxprojects.ajaxchat.dao.AjaxChatDAO;
import com.apress.ajaxprojects.ajaxchat.dto.MessageDTO;
import com.apress.ajaxprojects.ajaxchat.dto.UserDTO;


/**
 * This is a Struts Action that is called via AJAX request to post a message
 * to the room the user is currently in.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class PostMessageAction extends Action {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(PostMessageAction.class);


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

      // Get the users' name, message text and room they are in, and record
      // this as the last AJAX request for the user.
      UserDTO user = (UserDTO)session.getAttribute("user");
      user.setLastAJAXRequest(new Date());
      session.setAttribute("user", user);
      String username = user.getUsername();
      String roomName = (String)session.getAttribute("roomName");
      DynaActionForm form = (DynaActionForm)inForm;
      String msgText = (String)form.get("msgText");

      // Create a new MessageDTO and post it.
      MessageDTO message = new MessageDTO();
      message.setPostedBy(user);
      message.setPostedDateTime(new Date());
      message.setText(msgText);
      AjaxChatDAO dao = AjaxChatDAO.getInstance();
      dao.postMessage(roomName, message);

      // There isn't actually anything to return from this function.
      return null;

    }

  } // End execute().


} // End class.
