package com.apress.dwrprojects.reportal;


import java.io.InputStream;
import java.io.IOException;
import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.xml.sax.SAXException;


/**
 * This context listener initializes RePortal on startup.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class ContextListener implements ServletContextListener {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(ContextListener.class);


  /**
   * Path and name of the config file.
   */
  private static String CONFIG_FILE = "/WEB-INF/appConfig.xml";


  /**
   * The container calls this when the context is initialzed.
   *
   * @param inServletContextEvent ServletContextEvent instance reference.
   */
  public void contextInitialized (
    final ServletContextEvent inServletContextEvent) {

    log.trace("contextInitialized() - Entry");

    try {

      // Get a stream to the application config file.
      ServletContext servletContext = inServletContextEvent.getServletContext();
      InputStream isConfigFile =
        servletContext.getResourceAsStream(CONFIG_FILE);

      // Ask the Config object to read in the config file.
      try {
        Config config = new Config();
        config.init(isConfigFile);
        log.info("contextInitialized() - Config = " + config);
      } catch (IOException ioe) {
        ioe.printStackTrace();
        log.error("contextInitialized() - Unable to read app config file.  " +
        "App *NOT* initialized!");
      } catch (SAXException se) {
        se.printStackTrace();
        log.error("contextInitialized() - Unable to parse app config file.  " +
          "App *NOT* initialized!");
      }

      // Make sure the database is valid, meaning all the required tables
      // are present.  If they aren't, they will be created.
      DatabaseWorker databaseWorker = new DatabaseWorker();
      databaseWorker.validateDatabase();

      // Start up the scheduler.
      ReportSchedulingWorker rsw = new ReportSchedulingWorker();
      rsw.setDatabaseWorker(databaseWorker);
      rsw.startScheduler();

    } catch (Exception e) {
      log.error("contextInitialized() - " +
        "Exception occurred during RePortal initialization.  " +
        "Application WILL NOT be available.  Exception was: " + e);
    }

    log.trace("contextInitialized() - Exit");

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
