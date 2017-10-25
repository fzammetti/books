package com.apress.ajaxprojects.rssreader.servlets;


import com.apress.ajaxprojects.rssreader.dtos.FeedDescriptor;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Properties;
import javawebparts.request.RequestHelpers;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletException;
import org.apache.commons.digester.Digester;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * Servlet to delete a feed.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class DeleteFeedServlet extends HttpServlet {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(DeleteFeedServlet.class);


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


    try {

      log.info("DeleteFeedServlet.doPost()");

      // We are going to use Commons Digester to parse the XML that was
      // POSTed to this servlet to add the feed.
      Digester digester = new Digester();
      digester.setValidating(false);
      // The XML has the form:
      // <feed>
      //   <feedTitle />
      // </feed>
      // We create a FeedDescriptor instance when <feed> is hit, then populate
      // it from the three child elements.
      digester.addObjectCreate("feed",
        "com.apress.ajaxprojects.rssreader.dtos.FeedDescriptor");
      digester.addBeanPropertySetter("feed/feedTitle", "feedTitle");
      String newFeedXML = RequestHelpers.getBodyContent(request);
      FeedDescriptor feedDescriptor = null;
      feedDescriptor = (FeedDescriptor)digester.parse(
        new ByteArrayInputStream(newFeedXML.getBytes()));

      // Show the FeedDescriptor we just filled in.
      log.info("Feed = " + feedDescriptor);

      if (feedDescriptor.getFeedTitle() == null ||
        feedDescriptor.getFeedTitle().equalsIgnoreCase("")) {
        // Message to the user saying feed NOT deleted.
        PrintWriter out = response.getWriter();
        out.print("alert(\"No feed selected to delete.\");");
      } else {

        // Now we go through our collection of feeds in application context
        // and remove the matching feed.
        ArrayList feeds = (ArrayList)getServletContext().getAttribute("feeds");
        int indexToDelete = -1;
        int i             = 0;
        for (Iterator it = feeds.iterator(); it.hasNext();) {
          FeedDescriptor fd = (FeedDescriptor)it.next();
          if (fd.getFeedTitle().equals(feedDescriptor.getFeedTitle())) {
            indexToDelete = i;
            break;
          }
          i++;
        }
        if (indexToDelete != -1) {
          feeds.remove(indexToDelete);
        }
        getServletContext().setAttribute("feeds", feeds);

        // Now take all the feeds in our collection, which now does not include
        // the deleted one, and put them into a Properties object.
        Properties properties = new Properties();
        for (Iterator it = feeds.iterator(); it.hasNext();) {
          FeedDescriptor feed = (FeedDescriptor)it.next();
          properties.setProperty(feed.getFeedTitle(), feed.getFeedURL());
        }

        // Lastly, delete any existing feed.properties file in WEB-INF and write
        // out a new version from the Properties object we just populated.
        // We have now in effect deleted the feed.
        new File(getServletContext().getRealPath("WEB-INF") +
          "/feeds.properties").delete();
        FileOutputStream fos =
          new FileOutputStream(getServletContext().getRealPath("WEB-INF") +
          "/feeds.properties");
        properties.store(fos, null);
        fos.close();

        // Delete confirm message to the user and reset display.
        PrintWriter out = response.getWriter();
        out.println("init();");
        out.println("alert(\"The feed '" + feedDescriptor.getFeedTitle() +
          "' has been deleted.  Your feed list should update shortly.\");");

      }

    } catch (Exception e) {
      // No real error handling, but we do want to be sure we see any
      // exception that occurs.
      System.err.println("DeleteFeedServlet.doPost(): Exception: " + e);
      e.printStackTrace();
      throw new ServletException(e.getMessage());
    }

  } // End doPost().


} // End class.
