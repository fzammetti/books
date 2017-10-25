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
 * Servlet to save a feed.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class SaveFeedServlet extends HttpServlet {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(SaveFeedServlet.class);


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

      log.info("AddFeedServlet.doPost()");

      // We are going to use Commons Digester to parse the XML that was
      // POSTed to this servlet to add the feed.
      Digester digester = new Digester();
      digester.setValidating(false);
      // The XML has the form:
      // <feed>
      //   <feedTitle />
      //   <feedURL />
      // </feed>
      // We create a FeedDescriptor instance when <feed> is hit, then populate
      // it from the three child elements.
      digester.addObjectCreate("feed",
        "com.apress.ajaxprojects.rssreader.dtos.FeedDescriptor");
      digester.addBeanPropertySetter("feed/feedTitle", "feedTitle");
      digester.addBeanPropertySetter("feed/feedURL", "feedURL");
      String newFeedXML = RequestHelpers.getBodyContent(request);
      FeedDescriptor feedDescriptor = null;
      feedDescriptor = (FeedDescriptor)digester.parse(
        new ByteArrayInputStream(newFeedXML.getBytes()));

      // Show the FeedDescriptor we just filled in.
      log.info("Feed = " + feedDescriptor);

      // See if they entered both a title and URL.  If not, error.
      if (feedDescriptor.getFeedTitle() == null ||
        feedDescriptor.getFeedTitle().equalsIgnoreCase("") ||
        feedDescriptor.getFeedURL() == null ||
        feedDescriptor.getFeedURL().equalsIgnoreCase("")) {

        log.info("Title and/or URL missing, cannot add");
        // Message to the user saying feed NOT added.
        PrintWriter out = response.getWriter();
        out.print("alert(\"Feed was not saved because title and/or URL was" +
          " blank.\");");
        out.flush();
        out.close();

      // Title and URL present, can go ahead and add (or update).
      } else {

        log.info("Title and URL present, checking for existence...");

        // See if a feed with this name already exists.  If it does, update
        // the URL with what we just received.
        boolean isAdd = true;
        ArrayList feeds = (ArrayList)getServletContext().getAttribute("feeds");
        for (Iterator it1 = feeds.iterator(); it1.hasNext();) {
          FeedDescriptor feed = (FeedDescriptor)it1.next();
          if (feedDescriptor.getFeedTitle().equalsIgnoreCase(
            feed.getFeedTitle())) {
            log.info("Feed already exists, updating URL...");
            // Set isAdd to false so we know this is an update.
            isAdd = false;
            feed.setFeedURL(feedDescriptor.getFeedURL());
          }
        }

        // Go ahead and add the feed if its new (isAdd=true);
        if (isAdd) {
          log.info("Adding new feed...");
          feeds.add(feedDescriptor);
          getServletContext().setAttribute("feeds", feeds);
        }

        // Now take all the feeds in our collection, which now includes the
        // new one, and put them into a Properties object.
        Properties properties = new Properties();
        for (Iterator it = feeds.iterator(); it.hasNext();) {
          FeedDescriptor feed = (FeedDescriptor)it.next();
          properties.setProperty(feed.getFeedTitle(),
            (String)feed.getFeedURL());
        }

        // Lastly, delete any existing feed.properties file in WEB-INF and
        // write out a new version from the Properties object we just
        // populated.  We have now in effect added the new feed.
        new File(getServletContext().getRealPath("WEB-INF") +
          "/feeds.properties").delete();
        FileOutputStream fos =
          new FileOutputStream(getServletContext().getRealPath("WEB-INF") +
          "/feeds.properties");
        properties.store(fos, null);
        fos.close();

        // Add confirm message to the user and reset display.
        log.info("Outputting response success response");
        PrintWriter out = response.getWriter();
        out.println("init();");
        out.println("alert(\"The feed '" + feedDescriptor.getFeedTitle() +
          "' has been saved.  Your feed list should update shortly.\");");
        out.flush();
        out.close();

      }

    } catch (Exception e) {
      // No real error handling, but we do want to be sure we see any
      // exception that occurs.
      System.err.println("AddFeedServlet.doPost(): Exception: " + e);
      e.printStackTrace();
      throw new ServletException(e.getMessage());
    }

  } // End doPost().


} // End class.
