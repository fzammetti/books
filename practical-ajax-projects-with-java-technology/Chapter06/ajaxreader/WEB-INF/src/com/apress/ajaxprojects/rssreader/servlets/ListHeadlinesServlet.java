package com.apress.ajaxprojects.rssreader.servlets;


import com.apress.ajaxprojects.rssreader.dtos.FeedDescriptor;
import com.sun.syndication.feed.synd.SyndEntryImpl;
import com.sun.syndication.feed.synd.SyndFeed;
import com.sun.syndication.io.SyndFeedInput;
import com.sun.syndication.io.XmlReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.URL;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import javawebparts.request.RequestHelpers;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletException;
import org.apache.commons.digester.Digester;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * Servlet to list headlines for a given feed.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class ListHeadlinesServlet extends HttpServlet {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(ListHeadlinesServlet.class);


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

      log.info("ListHeadlinesServlet.doPost()");

      // We are going to use Commons Digester to parse the XML that was
      // POSTed to this servlet to get headlines for the specified feed.
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
      String         newFeedXML     = RequestHelpers.getBodyContent(request);
      FeedDescriptor feedDescriptor = null;
      feedDescriptor = (FeedDescriptor)digester.parse(
        new ByteArrayInputStream(newFeedXML.getBytes()));

      // Show the FeedDescriptor we just filled in.
      log.info("Feed = " + feedDescriptor);

      // Now we go through our collection of feeds in application context
      // and find the one we need so we can get the URL.
      String    feedURL = null;
      ArrayList feeds   = (ArrayList)getServletContext().getAttribute("feeds");
      for (Iterator it = feeds.iterator(); it.hasNext();) {
        FeedDescriptor fd = (FeedDescriptor)it.next();
        if (fd.getFeedTitle().equals(feedDescriptor.getFeedTitle())) {
          feedURL = fd.getFeedURL();
          break;
        }
      }

      // Set up proxy, if configured.
      String proxyHost = getServletContext().getInitParameter("proxyHost");
      String proxyPort = getServletContext().getInitParameter("proxyPort");
      if (proxyHost != null && !proxyHost.equalsIgnoreCase("") &&
        proxyPort != null && !proxyPort.equalsIgnoreCase("")) {
          System.getProperties().put("proxySet", "true");
          System.getProperties().put("proxyHost", proxyHost);
          System.getProperties().put("proxyPort", proxyPort);
      }

      // Use ROME to get the clicked feed.
      URL           feedUrl = new URL(feedURL);
      SyndFeedInput input   = new SyndFeedInput();
      SyndFeed      feed    = input.build(new XmlReader(feedUrl));

      // Now iterate over the headlines and construct our HTML.
      List headlines = feed.getEntries();
      StringBuffer sb = new StringBuffer(4096);
      sb.append("<html><head><title></title></head><body\n<ul>\n");
      for (Iterator it = headlines.iterator(); it.hasNext();) {
        SyndEntryImpl entry = (SyndEntryImpl)it.next();
        sb.append("<li><a href=\"" + entry.getUri() + "\" " +
          "onClick=\"window.parent.lastClickedLink='" +
          entry.getUri() + "';\"" +
          ">" + entry.getTitle() + "</a><br>" +
          entry.getDescription().getValue() +
          "<br><br></li>\n");
      }
      sb.append("</ul></body></html>");

      // Write the HTML to the output.
      response.setContentType("text/html");
      PrintWriter out = response.getWriter();
      out.println(sb.toString());

    } catch (Exception e) {
      // If any exceptions occur, we'll generically return content that
      // says the feed could not be retrieved.  Before that though, we'll do
      // our typical "minimal" exception handling.  At the end, note that
      // unlike the other servlets, the exception IS NOT rethrown.  We want
      // this servlet to be like Las Vegas: whatever happens here, stays here!
      System.err.println("ListHeadlinesServlet.doPost(): Exception: " + e);
      e.printStackTrace();
      response.setContentType("text/html");
      PrintWriter out = response.getWriter();
      out.println("<html><head><title>Error</title></head><body>" +
        "<font color=\"#ff0000\"Unable to retrieve and parse feed.  Sorry!  " +
        "Please try again.</font><br><br>Some things to check:<br><br>" +
        "* Is the feed's URL correct?<br>" +
        "* Are proxyHost and proxyPort set appropriately?");
    }


  } // End doPost().


} // End class.
