package com.apress.ajaxprojects.photoshare;


import com.apress.ajaxprojects.photoshare.actions.Action;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletException;
import org.apache.commons.beanutils.MethodUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * The main servlet that handles all our requests.
 */
public class ActionDispatcher extends HttpServlet {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(ActionDispatcher.class);


  /**
   * doGet.  Calls doPost() to do real work.
   *
   * @param  request          HTTPServletRequest.
   * @param  response         HTTPServletResponse.
   * @throws ServletException ServletException.
   * @throws IOException      IOExcpetion.
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
   * @throws IOException      IOExcpetion.
   */
  public void doPost(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {

    // Determine the requested path.
    String path     = request.getServletPath();
    String pathInfo = request.getPathInfo();
    if (pathInfo != null) {
      path += pathInfo;
    }
    if (path.charAt(0) == '/') {
      path = path.substring(1);
    }
    int dotPos = path.lastIndexOf(".");
    path = path.substring(0, dotPos);

    log.info("\n** START *******************************\n" + path + "\n" +
      "****************************************");
    log.info("Requested path = " + path);

    // Look up config information for path.  If not found, throw exception.
    HashMap config = ConfigInfo.getConfig(path);
    if (config == null) {
      log.error("Config not found for path " + path);
      throw new ServletException("Config not found for path " + path);
    }
    log.info("config = " + config);

    // Instantiate the appropriate Action class.
    String className  = (String)config.get("class");
    String methodName = (String)config.get("method");
    try {
      Class  clazz  = Class.forName(className);
      Action action = (Action)clazz.newInstance();
      action.setRequest(request);
      action.setResponse(response);
      action.setSession(request.getSession());
      action.setServletContext(getServletContext());
      String result =
        (String)MethodUtils.invokeExactMethod(action, methodName, null);
      // If the Action returns null, that indicates the response is fully
      // formed already, so we're effectively done here.  If it's not null
      // though, we have more work to do.
      if (result != null) {
        // See if it starts with a slash.  If it does, forward to it,
        // otherwise look up the destination in our config map.
        if (result.charAt(0) == '/') {
          log.info("Forwarding to " + result);
          request.getRequestDispatcher(result).forward(request, response);
        } else {
          // Look up the forward path in the config, using the returned result
          // as the lookup key.  This allows us to have arbitrar foward paths.
          String forwardTo = (String)config.get(result);
          log.info("Forwarding to " + forwardTo);
          request.getRequestDispatcher(forwardTo).forward(request, response);
        }
      }

    } catch (ClassNotFoundException cnfe) {
      log.error("Failed to instantiate Action class: " + cnfe);
      throw new ServletException("ClassNotFoundException");
    } catch (InstantiationException ie) {
      log.error("Failed to instantiate Action class: " + ie);
      throw new ServletException("InstantiationException");
    } catch (IllegalAccessException iae) {
      log.error("Failed to execute Action class: " + iae);
      throw new ServletException("IllegalAccessException");
    } catch (InvocationTargetException ite) {
      log.error("Failed to execute Action class: " + ite);
      throw new ServletException("InvocationTargetException");
    } catch (NoSuchMethodException nsme) {
      log.error("Method " + methodName + " not found on Action: " + nsme);
      throw new ServletException("NoSuchMethodException");
    }

    log.info("\n** END *******************************************\n\n\n\n\n");

  } // End doPost().


} // End class.
