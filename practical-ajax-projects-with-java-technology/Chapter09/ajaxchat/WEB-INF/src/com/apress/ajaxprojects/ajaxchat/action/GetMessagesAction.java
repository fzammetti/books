package com.apress.ajaxprojects.ajaxchat.action;


import java.io.PrintWriter;
import java.text.SimpleDateFormat;
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
import com.apress.ajaxprojects.ajaxchat.dto.MessageDTO;
import com.apress.ajaxprojects.ajaxchat.dto.UserDTO;


/**
 * This is a Struts Action that is called via AJAX request to get all messages
 * posted to the room the user is currently in since the last such request
 * for the user.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class GetMessagesAction extends Action {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(GetMessagesAction.class);


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

      // Get the info we need.
      String roomName     = (String)session.getAttribute("roomName");
      Date   lastDateTime = (Date)session.getAttribute("lastDateTime");
      if (log.isDebugEnabled()) {
        log.debug("roomName = "     + roomName);
        log.debug("lastDateTime = " + lastDateTime);
      }

      // If lastDateTime is null, this is the first request, so we want to
      // record the current datetime.
      if (lastDateTime == null) {
        lastDateTime = new Date();
      }

      // Ask the DAO to get the messages posted subsequent to lastDateTime for
      // the applicable room.
      AjaxChatDAO dao      = AjaxChatDAO.getInstance();
      Vector      messages = dao.getMessages(roomName, lastDateTime);

      // Now iterate over the collection of messages we got and construct our
      // XML.
      StringBuffer xmlOut = new StringBuffer(4096);
      xmlOut.append("<messages>");
      for (Iterator it = messages.iterator(); it.hasNext();) {
        MessageDTO message = (MessageDTO)it.next();
        xmlOut.append("<message>");
        xmlOut.append("<postedBy>" +
          StringEscapeUtils.escapeXml(message.getPostedBy().getUsername()) +
          "</postedBy>");
        xmlOut.append("<postedDateTime>" +
          new SimpleDateFormat().format(message.getPostedDateTime()) +
          "</postedDateTime>");
        xmlOut.append("<msgText>" +
          StringEscapeUtils.escapeXml(message.getText()) + "</msgText>");
        xmlOut.append("</message>");
        lastDateTime = message.getPostedDateTime();
      }
      xmlOut.append("</messages>");

      // Lastly, we need to record the datetime of the last message retrieved
      // in session so that we know where we left off next time.
      session.setAttribute("lastDateTime", lastDateTime);

      // Write out XML.
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

