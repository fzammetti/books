package com.apress.ajaxprojects.theorganizer.daos;


import com.apress.ajaxprojects.theorganizer.Globals;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.SQLException;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;


/**
 * Data Access Object (DAO) for working with database tables.
 */
public class TableDAO {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog("com.apress.ajaxprojects");


  /**
   * The DriverManagerDataSource this instance of the DAO will use.
   */
  private DriverManagerDataSource dataSource;


  /**
   * Constructor.
   */
  public TableDAO() {

    dataSource = new DriverManagerDataSource();
    dataSource.setDriverClassName(Globals.dbDriver);
    dataSource.setUrl(Globals.dbURL);
    dataSource.setUsername(Globals.dbUsername);
    dataSource.setPassword(Globals.dbPassword);

  } // End constructor.


  /**
   * This method is called to create a named table.  It checks to see if the
   * table already exists, and only creates it if it does not.
   *
   * @param  inTableName  The name of the table to create.  Must be one of the
   *                      recognized table named as defined as constants of
   *                      this class.
   * @throws SQLException If anything goes wrong with meta data retrieval.
   */
  public void createTable(final String inTableName) throws SQLException {

    log.debug("TableDAO.createTable()...");

    // Check to see if the table exists by looking for it in the database's
    // meta data.
    Connection       conn  = dataSource.getConnection();
    DatabaseMetaData dbmd  = conn.getMetaData();
    ResultSet        rs    = dbmd.getTables(null, null, "%", null);
    boolean          found = false;
    while (rs.next()) {
      String s = rs.getString(3);
      if (s.equalsIgnoreCase(inTableName)) {
        found = true;
      }
    }
    rs.close();
    // If we did not find the specified table, create it.
    if (!found) {
      log.info("Creating " + inTableName + " table...");
      JdbcTemplate jt = new JdbcTemplate(dataSource);
      if (inTableName.equalsIgnoreCase(Globals.TABLE_ACCOUNTS)) {
        jt.execute(
          "CREATE TABLE accounts ( " +
          "username VARCHAR(20), " +
          "password VARCHAR(20) " +
          ");");
        jt.execute("CREATE UNIQUE INDEX username_index ON accounts (username)");
      } else if (inTableName.equalsIgnoreCase(Globals.TABLE_NOTES)) {
        jt.execute(
          "CREATE TABLE notes ( " +
          "createddt BIGINT, " +
          "username VARCHAR(20), " +
          "subject VARCHAR(100), " +
          "text VARCHAR(5000) " +
          ");");
      } else if (inTableName.equalsIgnoreCase(Globals.TABLE_TASKS)) {
        jt.execute(
          "CREATE TABLE tasks ( " +
          "createddt BIGINT, " +
          "username VARCHAR(20), " +
          "comments VARCHAR(5000), " +
          "subject VARCHAR(100), " +
          "status VARCHAR(1), " +
          "priority VARCHAR(1), " +
          "due VARCHAR(10)" +
          ");");
      } else if (inTableName.equalsIgnoreCase(Globals.TABLE_CONTACTS)) {
        jt.execute(
          "CREATE TABLE contacts ( " +
          "createddt BIGINT, " +
          "username VARCHAR(20), " +
          "first_name VARCHAR(25), " +
          "middle_name VARCHAR(25), " +
          "last_name VARCHAR(25), " +
          "home_phone VARCHAR(15), " +
          "home_address_1 VARCHAR(100), " +
          "home_address_2 VARCHAR(100), " +
          "home_address_3 VARCHAR(100), " +
          "home_address_4 VARCHAR(100), " +
          "personal_email VARCHAR(100), " +
          "personal_im VARCHAR(50), " +
          "personal_fax VARCHAR(15), " +
          "personal_cell VARCHAR(15), " +
          "personal_pager VARCHAR(15), " +
          "spouse VARCHAR(50), " +
          "child_1 VARCHAR(50), " +
          "child_2 VARCHAR(50), " +
          "child_3 VARCHAR(50), " +
          "child_4 VARCHAR(50), " +
          "child_5 VARCHAR(50), " +
          "child_6 VARCHAR(50), " +
          "child_7 VARCHAR(50), " +
          "child_8 VARCHAR(50), " +
          "company VARCHAR(75), " +
          "title VARCHAR(75), " +
          "department VARCHAR(75), " +
          "work_phone VARCHAR(15), " +
          "work_address_1 VARCHAR(100), " +
          "work_address_2 VARCHAR(100), " +
          "work_address_3 VARCHAR(100), " +
          "work_address_4 VARCHAR(100), " +
          "work_email VARCHAR(100), " +
          "work_im VARCHAR(50), " +
          "work_fax VARCHAR(15), " +
          "work_cell VARCHAR(15), " +
          "work_pager VARCHAR(15), " +
          "assistant VARCHAR(50), " +
          "manager VARCHAR(50), " +
          "other_phone VARCHAR(15), " +
          "other_address_1 VARCHAR(100), " +
          "other_address_2 VARCHAR(100), " +
          "other_address_3 VARCHAR(100), " +
          "other_address_4 VARCHAR(100), " +
          "other_email VARCHAR(100), " +
          "other_im VARCHAR(50), " +
          "other_fax VARCHAR(15), " +
          "other_cell VARCHAR(15), " +
          "other_pager VARCHAR(15), " +
          "comments VARCHAR(5000)" +
          ");");
      } else if (inTableName.equalsIgnoreCase(Globals.TABLE_APPOINTMENTS)) {
        jt.execute(
          "CREATE TABLE appointments ( " +
          "createddt BIGINT, " +
          "username VARCHAR(20), " +
          "subject VARCHAR(100), " +
          "location VARCHAR(100), " +
          "appt_date VARCHAR(10), " +
          "start_time VARCHAR(18), " +
          "end_time VARCHAR(18), " +
          "comments VARCHAR(5000)" +
          ");");
      }
      log.info("Table " + inTableName + " created");
    } else {
      log.info("Table " + inTableName + " already exists, not creating");
    }
    log.debug("TableDAO.createTable() Done");

  } // End createTable().


} // End class.
