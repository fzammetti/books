package com.apress.ajaxprojects.ajaxwarrior.filter;


import com.apress.ajaxprojects.ajaxwarrior.Globals;
import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * This filter checks if the user is logged in and redirects to the start
 * page if they are not.  The check is done by looking for the value in
 * session stored under the key named by the GAME_PROPERLY_STARTED field below.
 * Note that this filter will only check paths handled by the FrontServlet.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class SessionCheckerFilter implements Filter {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog("com.apress.ajaxprojects");


  /**
   * Initialize.
   *
   * @param  inFilterConfig     The configuration information for this filter.
   * @throws ServletException   ServletException.
   */
  public void init(final FilterConfig inFilterConfig) throws ServletException {

  } // End init().


  /**
   * If no session exists for this request, and the requested path isnot
   * /login or /logout, redirect to the welcome page.
   *
   * @param  inRequest        The current request object.
   * @param  inResponse       The current response object.
   * @param  inFilterChain    The current filter chain.
   * @throws ServletException ServletException.
   * @throws IOException      IOException.
   */
  public void doFilter(final ServletRequest inRequest,
    final ServletResponse inResponse, final FilterChain inFilterChain)
    throws ServletException, IOException {

    log.debug("doFilter()...");
    String path = ((HttpServletRequest)inRequest).getServletPath();
    if (log.isDebugEnabled()) {
      log.debug("path = " + path);
    }
    if (path.indexOf("startGame") == -1) {
      HttpSession session = ((HttpServletRequest)inRequest).getSession(true);
      String gameProperlyStarted =
        (String)session.getAttribute(Globals.GAME_PROPERLY_STARTED);
      if (gameProperlyStarted == null) {
        // Game has *NOT* been properly started, so redirect to start page.
        log.info("Game NOT properly started, forwarding to start page...");
        inRequest.getRequestDispatcher("/index.jsp").forward(inRequest,
          inResponse);
      } else {
        // Game *HAS* been properly started, request can continue.
        log.debug("Game properly started, request continuing");
        inFilterChain.doFilter(inRequest, inResponse);
      }
    } else {
      // If the request path is the startGame path, we need to let that pass
      // regardless of the status of the flag.
      log.info("startGame requested, letting request continue...");
      inFilterChain.doFilter(inRequest, inResponse);
    }

  } // End doFilter().


  /**
   * Destroy.
   */
  public void destroy() {

  } // End destroy.


} // End SessionCheckerFilter class.
