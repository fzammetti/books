package com.apress.ajaxprojects.ajaxchat.action;


import java.io.PrintWriter;
import java.util.Date;
import java.util.Iterator;
import java.util.Vector;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.struts.action.Action;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import com.apress.ajaxprojects.ajaxchat.dao.AjaxChatDAO;
import com.apress.ajaxprojects.ajaxchat.dto.UserDTO;


/**
 * This is a Struts Action that is called via AJAX request to retrieve the list
 * of users in the room the user is currently in.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class ListUsersInRoomAction extends Action {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(ListUsersInRoomAction.class);


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

      // Record this as the last AJAX request for the user.
      UserDTO user = (UserDTO)session.getAttribute("user");
      user.setLastAJAXRequest(new Date());
      session.setAttribute("user", user);

      // We'll need the name of the room to get a list for.
      String roomName = (String)request.getSession().getAttribute("roomName");
      if (log.isDebugEnabled()) {
        log.debug("Getting user list for roomName = " + roomName);
      }

      // Get user list and create XML from it.
      AjaxChatDAO dao = AjaxChatDAO.getInstance();
      Vector userList = dao.getUserList(roomName);
      if (log.isDebugEnabled()) {
        log.debug("userList = " + userList);
      }
      StringBuffer xmlOut = new StringBuffer(1024);
      xmlOut.append("<users>");
      for (Iterator it = userList.iterator(); it.hasNext();) {
        UserDTO user1 = (UserDTO)it.next();
        xmlOut.append("<user name=\"" +
          StringEscapeUtils.escapeXml(user1.getUsername()) + "\"/>");
      }
      xmlOut.append("</users>");

      // Write out XML to response.
      if (log.isDebugEnabled()) {
        log.debug(xmlOut);
      }
      response.setContentType("text/xml");
      PrintWriter out = response.getWriter();
      out.println(xmlOut.toString());
      out.flush();

      // Response fully formed, nowhere to forward to.
      return null;

    }

  } // End execute().


} // End class.
