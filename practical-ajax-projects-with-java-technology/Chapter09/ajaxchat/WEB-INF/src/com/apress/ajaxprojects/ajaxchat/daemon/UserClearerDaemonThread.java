package com.apress.ajaxprojects.ajaxchat.daemon;


import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import com.apress.ajaxprojects.ajaxchat.AjaxChatConfig;
import com.apress.ajaxprojects.ajaxchat.dao.AjaxChatDAO;


/**
 * This thread executes every X seconds and checks for inactive users.  If a
 * user is found to be inactive, they are removed from any room they are in,
 * as well as from the app itself.  Inactivity is determined by looking at the
 * lastAJAXRequest field of the user object.  If it is more than X seconds old,
 * the user is considered inactive.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>
 */
public class UserClearerDaemonThread extends Thread {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(UserClearerDaemonThread.class);


  /**
   * Main thread run method.
   */
  public void run() {

    while (true) {

      try {

        if (log.isDebugEnabled()) {
          log.debug("UserClearerDaemonThread executing next iteration...");
        }

        // The DAO actually does all the heavy lifting, so give it a call.
        AjaxChatDAO dao = AjaxChatDAO.getInstance();
        dao.removeInactiveUsers();

        // Sleep for X seconds as configured.
        sleep(AjaxChatConfig.getUserInactivitySeconds() * 1000);

      } catch (Exception e) {

        log.error("An exception occurred in UserClearerDaemonThread: " + e);
        e.printStackTrace();

      } // End try

    } // End while

  } // End run()


} // End Class
