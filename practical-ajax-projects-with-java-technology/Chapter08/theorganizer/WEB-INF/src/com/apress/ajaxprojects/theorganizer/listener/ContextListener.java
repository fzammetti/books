package com.apress.ajaxprojects.theorganizer.listener;


import com.apress.ajaxprojects.theorganizer.daos.TableDAO;
import com.apress.ajaxprojects.theorganizer.Globals;
import java.sql.Connection;
import java.sql.DriverManager;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * This ContextListener is responsible for one-time app initialization.
 */
public class ContextListener implements ServletContextListener {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog("com.apress.ajaxprojects");


  /**
   * Execute at app startup.
   *
   * @param inEvent ServletContextEvent.
   */
  public void contextInitialized(final ServletContextEvent inEvent) {

    if (log.isDebugEnabled()) {
      log.debug("contextInitialized()...");
    }

    try {

      // Calculate database URL and set in Globals.
      String dbURL = "jdbc:hsqldb:" +
        inEvent.getServletContext().getRealPath("/WEB-INF") +
        "/db/theorganizer";
      Globals.setDbURL(dbURL);

      // Open connection, which creates the database if it doesn't already
      // exist.  Data files stored in /WEB-INF/db.
      Class.forName(Globals.getDbDriver()).newInstance();
      Connection conn = DriverManager.getConnection(Globals.getDbURL(),
        Globals.getDbUsername(), Globals.getDbPassword());
      conn.close();

      // Create all the tables needed by the application, if they do not
      // already exist.
      TableDAO dao = new TableDAO();
      dao.createTable(Globals.TABLE_ACCOUNTS);
      dao.createTable(Globals.TABLE_CONTACTS);
      dao.createTable(Globals.TABLE_NOTES);
      dao.createTable(Globals.TABLE_TASKS);
      dao.createTable(Globals.TABLE_APPOINTMENTS);

      // Clean up.
      conn.close();

    } catch (Exception e) {
      e.printStackTrace();
    }

    log.info("The Organizer configured and ready for use!");

  } // End contextInitialized();


  /**
   * Execute at app shutdown.
   *
   * @param inEvent ServletContextEvent.
   */
  public void contextDestroyed(final ServletContextEvent inEvent) {

  } // End contextDestroyed().


} // Ebd class.
