package com.apress.ajaxprojects.ajaxchat.filter;


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
import org.apache.struts.action.ActionMessage;
import org.apache.struts.action.ActionMessages;
import org.apache.struts.Globals;


/**
 * This filter checks if the user is logged in and redirects to the welcome
 * page if they are not.  The check is done by looking for the value in
 * session stored under the key named by the LOGGED_IN_FLAG field below.
 * Note that this filter ignores certain paths where the check does not apply.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class SessionCheckerFilter implements Filter {


  /**
   * Logged in flag field key.
   */
  public static final String LOGGED_IN_FLAG = "isLoggedIn";


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(SessionCheckerFilter.class);


  /**
   * Initialize.
   *
   * @param  filterConfig     The configuration information for this filter.
   * @throws ServletException ServletException.
   */
  public void init(FilterConfig filterConfig) throws ServletException {

  } // End init().


  /**
   * If no session exists for this request, and the requested path isnot
   * /login or /logout, redirect to the welcome page.
   *
   * @param  request          The current request object.
   * @param  response         The current response object.
   * @param  filterChain      The current filter chain.
   * @throws ServletException ServletException.
   * @throws IOException      IOException.
   */
  public void doFilter(ServletRequest request, ServletResponse response,
    FilterChain filterChain) throws ServletException, IOException {

    if (log.isDebugEnabled()) {
      log.debug("doFilter()...");
    }

    String path =
      (((HttpServletRequest)request).getServletPath()).toLowerCase();
    if (log.isDebugEnabled()) {
      log.debug("path = " + path);
    }
    if (path.indexOf("index") == -1 && path.indexOf("login") == -1 &&
      path.indexOf("logout") == -1 && path.indexOf("css") == -1 &&
      path.indexOf("gif") == -1) {
      // The requested path is NOT one of the ones we ignore, so check if
      // the user is logged in or not.
      HttpSession session = ((HttpServletRequest)request).getSession();
      String isLoggedIn = (String)session.getAttribute(LOGGED_IN_FLAG);
      if (isLoggedIn == null) {
        // User *IS NOT* logged in, so redirect to welcome page.
        ActionMessages msgs = new ActionMessages();
        msgs.add(ActionMessages.GLOBAL_MESSAGE,
          new ActionMessage("messages.sessionTimedOut"));
        request.setAttribute(Globals.ERROR_KEY, msgs);
        if (log.isDebugEnabled()) {
          log.debug("Not logged in, forwarding to welcome...");
        }
        request.getRequestDispatcher("/index.jsp").forward(request, response);
        return;
      } else {
        // User *IS* logged in, so request can continue as usual.
        if (log.isDebugEnabled()) {
          log.debug("User logged in, request continuing");
        }
        filterChain.doFilter(request, response);
      }
    } else {
      // Requested path is one of the ones we need to ignore, so request can
      // continue as usual, we don't care yet if the user is logged in or not.
      if (log.isDebugEnabled()) {
        log.debug("Ignored path " + path);
      }
      filterChain.doFilter(request, response);
    }

  } // End doFilter().


  /**
   * Destroy.
   */
  public void destroy() {

  } // End destroy.


} // End SessionCheckerFilter class.
