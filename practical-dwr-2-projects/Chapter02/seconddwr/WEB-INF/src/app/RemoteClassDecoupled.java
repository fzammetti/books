package app;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpSession;


/**
 * A simple bean to test decoupled servlet object passing.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class RemoteClassDecoupled {


  /**
   * Function to output to the console and logs a bunch of server-side objects
   * that DWR gives you access to.  This is not coupled to DWR, as opposed to
   * the version in RemoteClass.
   */
  public void serverSideObjects(final String inParam,
    final HttpServletRequest request, final HttpServletResponse response,
    final ServletConfig config, final ServletContext context,
    final HttpSession session) {

    System.out.println("inParam = " + inParam);
    System.out.println("request = " + request);
    System.out.println("response = " + response);
    System.out.println("config = " + config);
    System.out.println("context = " + context);
    System.out.println("session = " + session);

  } // End serverSideObjects().


} // End class.
