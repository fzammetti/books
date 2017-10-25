package com.apress.dwrprojects.dwiki;


import java.io.InputStream;
import java.util.Properties;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * This context listener initializes DWiki on startup.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class DWikiContextListener implements ServletContextListener {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(DWikiContextListener.class);


  /**
   * The container calls this when the context is initialzed.
   *
   * @param inServletContextEvent ServletContextEvent instance reference.
   */
  public void contextInitialized (
    final ServletContextEvent inServletContextEvent) {

    log.trace("DWikiContextListener.contextInitialized() - Entry");

    try {

      // Load properties.
      InputStream is = this.getClass().getClassLoader().getResourceAsStream(
        "dwiki.properties");
      Properties props = new Properties();
      props.load(is);
      if (log.isDebugEnabled()) {
        log.debug("DWikiContextListener.contextInitialized() - props = " +
          props);
      }

      // Populate the Config object.
      Config config = new Config();
      config.setDatabaseDriver((String)props.get("databaseDriver"));
      config.setDatabaseURI((String)props.get("databaseURI"));
      config.setDatabaseUsername((String)props.get("databaseUsername"));
      config.setDatabasePassword((String)props.get("databasePassword"));
      config.setEditLockTime((String)props.get("editLockTime"));
      if (log.isDebugEnabled()) {
        log.debug("DWikiContextListener.contextInitialized() - Config = " +
          config);
      }

      // First, make sure the database is valid, meaning all the required tables
      // are present.  If they aren't, they will be created.
      new DatabaseWorker().validateDatabase();

      // Now initialize Freemarker.
      new Freemarker().init(inServletContextEvent.getServletContext());

    } catch (Exception e) {
      log.error("DWikiContextListener.contextInitialized() - " +
        "Exception occurred during DWiki initialization.  " +
        "Application WILL NOT be available.  Error was: " + e);
    }

    log.trace("DWikiContextListener.contextInitialized() - Exit");

  } // End contextInitialized().


  /**
   * Doesn't do anything, but needs to be here to complete interface
   * implementation.
   *
   * @param inServletContextEvent ServletContextEvent instance reference.
   */
  public void contextDestroyed (
    final ServletContextEvent inServletContextEvent) {
  } // End contextDestroyed().


} // End class.
