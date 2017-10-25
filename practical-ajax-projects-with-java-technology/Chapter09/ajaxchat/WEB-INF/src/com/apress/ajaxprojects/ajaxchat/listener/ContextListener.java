package com.apress.ajaxprojects.ajaxchat.listener;


import java.io.InputStream;
import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import com.apress.ajaxprojects.ajaxchat.daemon.UserClearerDaemonThread;
import com.apress.ajaxprojects.ajaxchat.dao.AjaxChatDAO;


/**
 * This ContextListener performs some simple initialization of the application.
 * Namely, it gets a stream on our rooms configuration file and passes it
 * along to the DAO's init() method so it can be read in.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class ContextListener implements ServletContextListener {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(ContextListener.class);


  /**
   * Name of the config file, including context-relarive path.
   */
  private static final String CONFIG_FILE = "/WEB-INF/rooms-config.xml";


  /**
   * Execute at app startup.
   *
   * @param event ServletContextEvent.
   */
  public void contextInitialized(ServletContextEvent event) {

    if (log.isDebugEnabled()) {
      log.debug("contextInitialized()...");
    }

    // Initialize DAO.
    AjaxChatDAO dao = AjaxChatDAO.getInstance();

    // Get a stream on the config file and initialize the DAO so we'll have
    // some rooms to chat in.
    ServletContext servletContext = event.getServletContext();
    InputStream isConfigFile = servletContext.getResourceAsStream(CONFIG_FILE);
    dao.init(isConfigFile);

    // Lastly, start a background daemon thread that will periodically clear
    // out inactive users from rooms.  This was originally done via
    // SessionListener, but because of some problems seem in some container
    // implementations (Resin, I'm looking at you!), this had to be done
    // instead.
    Thread userClearerDaemonThread = new UserClearerDaemonThread();
    userClearerDaemonThread.setPriority(Thread.MIN_PRIORITY);
    userClearerDaemonThread.setDaemon(true);
    userClearerDaemonThread.start();

    log.info("AjaxChat configured and ready for use");

  } // End contextInitialized();


  /**
   * Execute at app shutdown.
   *
   * @param event ServletContextEvent.
   */
  public void contextDestroyed(ServletContextEvent event) {

  } // End contextDestroyed().


} // Ebd class.
