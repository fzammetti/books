package app;



import java.util.Date;
import java.util.Collection;
import org.directwebremoting.WebContext;
import org.directwebremoting.WebContextFactory;
import org.directwebremoting.proxy.dwr.Util;


/**
 * This class is called (its startPolling() method specicially) each time a
 * user hits the index.jsp page.  It the WebContext hasn't been stored, it is
 * grabbed and stored, and if the DateUpdater thread hasn't been started yet,
 * it is started.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class RemoteClass {


  /**
   * The current time.
   */
  private static Date d = new Date();


  /**
   * The DateUpdater thread.
   */
  private static Thread t;


  /**
   * The DWR WebContext.
   */
  private static WebContext wContext;


  /**
   * The background thread must be started for the time to be updated, and
   * this method does just that.  This is necessary because the WebContext
   * must be gotten, and this can only be done in the context of a request from
   * a client, so we couldn't have just had a static instance of the thread
   * started from a static initializer, or something like that.
   */
  public void startPolling() {

    if (wContext == null) {
      wContext = WebContextFactory.get();
    }
    if (t == null) {
      t = new DateUpdater();
      t.setPriority(Thread.MIN_PRIORITY);
      t.setDaemon(true);
      t.start();
    }

  } // End startPolling();


  /**
   * This inner class is the background thread that runs to update the time
   * and the DWR clients currently connected to the server.
   */
  class DateUpdater extends Thread {

    /**
     * The thread's run() method.  Updates the time and all the DWR clients
     * currently "connected" to the server.
     */
    public void run() {
      boolean run = true;
      while (run) {
        try {
          // Update time and "log" it.
          d = new Date();
          System.out.println(d);
          // Update all clients.
          String currentPage = wContext.getCurrentPage();
          Collection sessions = wContext.getScriptSessionsByPage(currentPage);
          Util utilAll = new Util(sessions);
          utilAll.setValue("divTest", d.toString(), true);
          // Next update in one second.
          sleep(1000);
        } catch (Exception e) {
          // If anything goes wrong, just end, but also set pointer to this
          // thread to null in parent so it can be restarted.
          run = false;
          t = null;
        }
      }
    } // End run().

  } // End inner class.


} // End class.
