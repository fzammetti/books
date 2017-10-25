package com.apress.ajaxprojects.rssreader.servlets;


import com.apress.ajaxprojects.rssreader.dtos.FeedDescriptor;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Iterator;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletException;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * Servlet to list feeds.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class ListFeedsServlet extends HttpServlet {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(ListFeedsServlet.class);


  /**
   * doGet.  Calls doPost() to do real work.
   *
   * @param  request          HTTPServletRequest.
   * @param  response         HTTPServletResponse.
   * @throws ServletException ServletException.
   * @throws IOException      IOException.
   */
  public void doGet(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {

    doPost(request, response);

  } // End doGet().


  /**
   * doPost.
   *
   * @param  request          HTTPServletRequest.
   * @param  response         HTTPServletResponse.
   * @throws ServletException ServletException.
   * @throws IOException      IOException.
   */
  public void doPost(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {

    log.info("ListFeedsServlet.doPost()");
    response.setContentType("text/html");
    PrintWriter out = response.getWriter();
    ArrayList feeds = (ArrayList)getServletContext().getAttribute("feeds");
    // Iterate over the collection of feeds and for each write out some
    // markup that will allow it to be clicked to display its headlines.
    // We want to highlight it when hovered over too.
    for (Iterator it = feeds.iterator(); it.hasNext();) {
      FeedDescriptor feedDescriptor = (FeedDescriptor)it.next();
      out.println("<div class=\"cssFeed\" onClick=\"" +
        "showFeedHeadlines('feed','" + feedDescriptor.getFeedTitle() + "'," +
        "'" + feedDescriptor.getFeedURL() + "');\"" +
        " onMouseOver=\"this.className='cssFeedHover';\"" +
        " onMouseOut=\"this.className='cssFeed';\"" +
        ">" + feedDescriptor.getFeedTitle() + "</div>");
    }

  } // End doPost().


} // End class.
