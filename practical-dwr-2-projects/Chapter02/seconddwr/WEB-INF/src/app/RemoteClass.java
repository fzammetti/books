package app;


/**
 * A simple bean to test extra data passing.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class RemoteClass {


  /**
   * Return inName with the string " is married to " appended.
   *
   * @param  inName A name.
   * @return        inName with the string " is married to " appended.
   */
  public String remoteMethod(final String inName) {

    return inName + " is married to ";

  } // End getName().


  /**
   * Function to output to the console and logs a bunch of server-side objects
   * that DWR gives you access to.
   */
  public void serverSideObjects() {

    org.directwebremoting.WebContext wc =
      org.directwebremoting.WebContextFactory.get();
    javax.servlet.http.HttpServletRequest request = wc.getHttpServletRequest();
    javax.servlet.http.HttpServletResponse response =
      wc.getHttpServletResponse();
    javax.servlet.ServletConfig config = wc.getServletConfig();
    javax.servlet.ServletContext context = wc.getServletContext();
    javax.servlet.http.HttpSession session = wc.getSession();
    System.out.println("wc = " + wc);
    System.out.println("request = " + request);
    System.out.println("response = " + response);
    System.out.println("config = " + config);
    System.out.println("context = " + context);
    System.out.println("session = " + session);

  } // End serverSideObjects().


} // End class.
