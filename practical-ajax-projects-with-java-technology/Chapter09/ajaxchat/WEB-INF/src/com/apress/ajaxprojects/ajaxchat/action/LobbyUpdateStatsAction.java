package com.apress.ajaxprojects.ajaxchat.action;


import java.io.PrintWriter;
import java.util.Date;
import java.util.Iterator;
import java.util.LinkedHashMap;
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
import com.apress.ajaxprojects.ajaxchat.actionform.LobbyActionForm;
import com.apress.ajaxprojects.ajaxchat.dao.AjaxChatDAO;
import com.apress.ajaxprojects.ajaxchat.dto.UserDTO;


/**
 * This is a Struts Action that is called via AJAX event to update the stats
 * for each room (really just how many users are chatting in the room).  It
 * really does more than that though... it actually updates the list of rooms
 * entirely.  In effect, this does the same thing as LobbyAction does, except
 * that it handles an AJAX event where LobbyAction is used like a typical
 * Action is, including using an ActionForm, which is not used here.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class LobbyUpdateStatsAction extends Action {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(LobbyUpdateStatsAction.class);


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

      // Get the list of rooms.
      AjaxChatDAO     dao      = AjaxChatDAO.getInstance();
      LobbyActionForm form     = (LobbyActionForm)inForm;
      LinkedHashMap   roomList = dao.getRoomUserCounts();

      // Construct our output XML.
      StringBuffer xmlOut = new StringBuffer(1024);
      xmlOut.append("<rooms>");
      for (Iterator it = roomList.keySet().iterator(); it.hasNext();) {
        String  roomName  = (String)it.next();
        Integer userCount = (Integer)roomList.get(roomName);
        xmlOut.append("<room name=\"" +
          StringEscapeUtils.escapeXml(roomName) + "\" " +
          "users=\"" + userCount + "\"/>");
      }
      xmlOut.append("</rooms>");

      // Write out XML to response.
      if (log.isDebugEnabled()) {
       log.debug(xmlOut);
      }
      response.setContentType("text/xml");
      PrintWriter out = response.getWriter();
      out.println(xmlOut.toString());
      out.flush();

      return null;

    }

  } // End execute().


} // End class.
