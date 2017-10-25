package com.apress.dwrprojects.reportal;


import java.util.Iterator;
import java.util.List;
import java.util.Map;
import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;


/**
 * This class exposes certain "low-level" database functions needed by the app.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class DatabaseWorker {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(DatabaseWorker.class);


  /**
   * The Spring JdbcTemplate object that will be used for the lifetime of
   * an instance of this class.
   */
  private JdbcTemplate jdbcTemplate;


  /**
   * Test queries to see if database tables exist.
   */
  private static final String SQL_TABLE_USERS_EXIST =
    "SELECT count(username) FROM users";
  private static final String SQL_TABLE_GROUPS_EXIST =
    "SELECT count(groupname) FROM groups";
  private static final String SQL_TABLE_REPORTS_EXIST =
    "SELECT count(reportname) FROM reports";
  private static final String SQL_TABLE_SCHEDULES_EXIST =
    "SELECT count(reportname) FROM schedules";
  private static final String SQL_TABLE_FAVORITES_EXIST =
    "SELECT count(reportname) FROM favorites";


  /**
   * Queries to drop tables when creating from scratch.
   */
  private static final String SQL_TABLE_USERS_DROP = "DROP TABLE users";
  private static final String SQL_TABLE_GROUPS_DROP = "DROP TABLE groups";
  private static final String SQL_TABLE_REPORTS_DROP = "DROP TABLE reports";
  private static final String SQL_TABLE_SCHEDULES_DROP = "DROP TABLE schedules";
  private static final String SQL_TABLE_FAVORITES_DROP = "DROP TABLE favorites";


  /**
   * SQL for creating USERS table.
   */
  private static final String SQL_TABLE_USERS_CREATE =
    "CREATE TABLE users (" +
    "username VARCHAR(20) NOT NULL, " +
    "password VARCHAR(20) NOT NULL, " +
    "groups VARCHAR(500) NOT NULL, " +
    "note VARCHAR(100), " +
    "PRIMARY KEY(username)" +
    ")";


  /**
   * SQL for creating GROUPS table.
   */
  private static final String SQL_TABLE_GROUPS_CREATE =
    "CREATE TABLE groups (" +
    "groupname VARCHAR(20) NOT NULL, " +
    "description VARCHAR(100), " +
    "PRIMARY KEY(groupname)" +
    ")";


  /**
   * SQL for creating REPORTS table.
   */
  private static final String SQL_TABLE_REPORTS_CREATE =
    "CREATE TABLE reports (" +
    "reportname VARCHAR(50) NOT NULL, " +
    "description VARCHAR(100), " +
    "groups VARCHAR(500) NOT NULL, " +
    "datasourcename VARCHAR(50) NOT NULL, " +
    "reportxml VARCHAR(32000) NOT NULL, " +
    "PRIMARY KEY(reportname)" +
    ")";


  /**
   * SQL for creating SCHEDULES table.
   */
  private static final String SQL_TABLE_SCHEDULES_CREATE =
    "CREATE TABLE schedules (" +
    "reportname VARCHAR(50) NOT NULL, " +
    "scheduledby VARCHAR(20) NOT NULL, " +
    "daysofweek VARCHAR(100) NOT NULL, " +
    "runtime TIME NOT NULL, " +
    "lastrun VARCHAR(50), " +
    "lastrunstatus VARCHAR(5), " +
    "lastrunoutput VARCHAR(32000)" +
    ")";


  /**
   * SQL for creating FAVORITES table.
   */
  private static final String SQL_TABLE_FAVORITES_CREATE =
    "CREATE TABLE favorites (" +
    "username VARCHAR(20) NOT NULL, " +
    "reportname VARCHAR(20) NOT NULL" +
    ")";


  /**
   * SQL for creating a default admin group.
   */
  private static final String SQL_CREATE_DEFAULT_ADMIN_GROUP =
    "INSERT INTO groups (groupname, description) values (" +
    "'admin', 'Default Admin Group')";


  /**
   * SQL for creating a default admin user.
   */
  private static final String SQL_CREATE_DEFAULT_ADMIN_USER =
    "INSERT INTO users (username, password, groups, note) values (" +
    "'admin', 'admin', 'admin', 'Default Admin User')";


  /**
   * The constructor for this class.  Creates a Spring JdbcTemplate object
   * connected to the database.
   */
  public DatabaseWorker() throws Exception {

    log.trace("DatabaseWorker() - Entry");

    // Need a Spring JdncTemplate object, which connects to data source.
    jdbcTemplate = getJdbcTemplate();

    log.trace("DatabaseWorker() - Entry");

  } // End constructor.


  /**
   * Get a Spring JdbcConnection object with a connection to the database.
   *
   * @return           The Spring JdbcTemplate object.
   * @throws Exception If anything goes wrong.
   */
  protected JdbcTemplate getJdbcTemplate() throws Exception {

    log.trace("getJdbcTemplate() - Entry");

    // Get data source to database.
    DriverManagerDataSource dataSource = new DriverManagerDataSource();
    dataSource.setDriverClassName(Config.getDatabaseDriver());
    dataSource.setUrl(Config.getDatabaseURI());
    dataSource.setUsername(Config.getDatabaseUsername());
    dataSource.setPassword(Config.getDatabasePassword());

    log.trace("getJdbcTemplate() - Exit");
    return new JdbcTemplate(dataSource);

  } //End getJdbcTemplate().


  /**
   * This is called the first time a request comes in to the application to
   * validate that the database has been constructed.  If it hasn't, then it
   * calls createTables() to construct it.
   *
   * @throws Exception If anything goes wrong.
   */
  protected void validateDatabase() throws Exception {

    log.trace("validateDatabase() - Entry");

    // First, perform a test query to each table.  If an exception is thrown,
    // this will mean the table doesn't exist, in which case we'll drop all
    // of them (just in case one exists but the others somehow don't) and
    // create them all.
    try {
      log.trace("validateDatabase() - Checking tables");
      jdbcTemplate.queryForList(SQL_TABLE_USERS_EXIST);
      jdbcTemplate.queryForList(SQL_TABLE_GROUPS_EXIST);
      jdbcTemplate.queryForList(SQL_TABLE_REPORTS_EXIST);
      jdbcTemplate.queryForList(SQL_TABLE_SCHEDULES_EXIST);
      jdbcTemplate.queryForList(SQL_TABLE_FAVORITES_EXIST);
    } catch (Exception e) {
      createTables();
    }

    log.trace("validateDatabase() - Exit");

  } // End validateDatabase().


  /**
   * This method will be called by validateDatabase() if it is determined that
   * any single database table is missing.  The job of this method is to drop
   * any tables that do exist, and recreate them all.
   *
   * @throws Exception If anything goes wrong.
   */
  protected void createTables() throws Exception {

    log.trace("createTables() - Entry");

    log.info("createTables() - Dropping tables");
    // For each table, we execute the SQL drop statement.  If an exception
    // occurs, we'll just eat it because it just means the table didn't
    // exist, which is fine.
    try {
      jdbcTemplate.execute(SQL_TABLE_USERS_DROP);
    } catch (Exception e) { }
    try {
      jdbcTemplate.execute(SQL_TABLE_GROUPS_DROP);
    } catch (Exception e) { }
    try {
      jdbcTemplate.execute(SQL_TABLE_REPORTS_DROP);
    } catch (Exception e) { }
    try {
      jdbcTemplate.execute(SQL_TABLE_SCHEDULES_DROP);
    } catch (Exception e) { }
    try {
      jdbcTemplate.execute(SQL_TABLE_FAVORITES_DROP);
    } catch (Exception e) { }

    // Now create each table.
    log.info("createTables() - Creating tables");
    jdbcTemplate.execute(SQL_TABLE_USERS_CREATE);
    jdbcTemplate.execute(SQL_TABLE_GROUPS_CREATE);
    jdbcTemplate.execute(SQL_TABLE_REPORTS_CREATE);
    jdbcTemplate.execute(SQL_TABLE_SCHEDULES_CREATE);
    jdbcTemplate.execute(SQL_TABLE_FAVORITES_CREATE);

    // Create a default admin user and group.
    jdbcTemplate.execute(SQL_CREATE_DEFAULT_ADMIN_GROUP);
    jdbcTemplate.execute(SQL_CREATE_DEFAULT_ADMIN_USER);

    log.trace("createTables() - Entry");

  } // End createTables().


  /**
   * This method replaces tokens in a string with specified values.  This is
   * used internally to replace tokens within a SQL statement.
   *
   * @param  inString  The string to replace tokens in.
   * @param  inVals    The Map containing the tokens and their values.
   * @return           The original inString with all tokens specified by the
   *                   keys in inVals with the corresponding values in the Map.
   * @throws Exception If anything goes wrong.
   */
  protected String replaceTokens(final String inString, final Map inVals) {

    log.trace("replaceTokens() - Entry");

    // Log incoming parameters.
    if (log.isDebugEnabled()) {
      log.debug("replaceTokens() - inString = " + inString);
      log.debug("replaceTokens() - inVals = " + inVals);
    }

    // Replace all tokens in the string with the value in the inVals Map.
    String retString = inString;
    for (Iterator it = inVals.keySet().iterator(); it.hasNext();) {
      String nextToken = (String)it.next();
      String nextValue =
        StringEscapeUtils.escapeSql((String)inVals.get(nextToken));
      retString = StringUtils.replace(retString, "${" + nextToken + "}",
        nextValue);
    }

    // Log the final string before returning it.
    if (log.isDebugEnabled()) {
      log.debug("replaceTokens() - retString = " + retString);
    }

    log.trace("replaceTokens() - Exit");
    return retString;

  } // End replaceTokens().


  /**
   * This method executes a query and returns a List.  The list may contain
   * zero, one, or many results.
   *
   * @param  inSQL     The SQL statement to execute.
   * @param  inVals    A Map containing token replacement values to insert into
   *                   the SQL query.
   * @return           A List of results, or an empty List if no records
   *                   returned.
   * @throws Exception If anything goes wrong.
   */
  protected List executeQuery(final String inSQL, final Map inVals)
    throws Exception {

    log.trace("executeQuery() - Entry");

    // Log incoming parameters.
    if (log.isDebugEnabled()) {
      log.debug("executeQuery() - inSQL = " + inSQL);
      log.debug("executeQuery() - inVals = " + inVals);
    }

    // Replace tokens in string.
    String sql = replaceTokens(inSQL, inVals);

    // Now execute and log results.
    List data = jdbcTemplate.queryForList(sql);
    if (log.isDebugEnabled()) {
      log.debug("executeQuery() - Returned List = " + data);
    }

    log.trace("executeQuery() - Exit");
    return data;

  } // End executeQuery().


  /**
   * This method executes a SQL statement that is any sort of update to the
   * database, be it an add, update or delete.
   *
   * @param  inSQL     The SQL statement to execute.
   * @param  inVals    A Map containing token replacement values to insert into
   *                   the SQL query.
   * @throws Exception If anything goes wrong.
   */
  protected void executeUpdate(final String inSQL, final Map inVals)
    throws Exception {

    log.trace("executeUpdate() - Entry");

    // Log incoming parameters.
    if (log.isDebugEnabled()) {
      log.debug("executeUpdate() - inSQL = " + inSQL);
      log.debug("executeUpdate() - inVals = " + inVals);
    }

    // Replace tokens in string.
    String sql = replaceTokens(inSQL, inVals);

    // Now execute and we're done.
    jdbcTemplate.update(sql);

    log.trace("executeUpdate() - Exit");

  } // End executeUpdate().


} // End class.
