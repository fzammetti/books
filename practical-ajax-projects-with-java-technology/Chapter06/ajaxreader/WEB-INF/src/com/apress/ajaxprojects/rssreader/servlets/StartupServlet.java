package com.apress.ajaxprojects.rssreader.servlets;


import com.apress.ajaxprojects.rssreader.dtos.FeedDescriptor;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Properties;
import javax.servlet.http.HttpServlet;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * Servlet called at application statup to set things up.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class StartupServlet extends HttpServlet {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(StartupServlet.class);


  /**
   * init.
   *
   * @throws ServletException If anything goes wrong.
   */
  public void init() throws ServletException {

    try {
      log.info("AJAXReader StartupServlet Initializing...");
      ServletConfig  servletConfig  = getServletConfig();
      ServletContext servletContext = servletConfig.getServletContext();
      // Get a sream on the feeds.properties file and load it in.
      InputStream isFeedFile =
        servletContext.getResourceAsStream("WEB-INF/feeds.properties");
      Properties properties = new Properties();
      properties.load(isFeedFile);
      ArrayList feeds = new ArrayList();
      // Iterate over all the feeds, create a FeedDescriptor DTO for each and
      // store the collection in application scope.
      for (Iterator it = properties.keySet().iterator(); it.hasNext();) {
        String feedTitle = (String)it.next();
        String feedURL   = properties.getProperty(feedTitle);
        FeedDescriptor feedDescriptor = new FeedDescriptor();
        feedDescriptor.setFeedTitle(feedTitle);
        feedDescriptor.setFeedURL(feedURL);
        feeds.add(feedDescriptor);
      }
      servletContext.setAttribute("feeds", feeds);
      log.info("feeds = " + feeds);
      log.info("AJAXReader StartupServlet Done");
    } catch (Exception e) {
      e.printStackTrace();
    }

  } // End init().


} // End class.
