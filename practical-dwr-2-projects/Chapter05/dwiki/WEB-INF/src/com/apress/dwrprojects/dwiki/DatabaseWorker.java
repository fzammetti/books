package com.apress.dwrprojects.dwiki;


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
  private static final String SQL_TABLE_ARTICLES_EXIST =
    "SELECT * FROM ARTICLES";
  private static final String SQL_TABLE_ARTICLEHISTORY_EXIST =
    "SELECT * FROM ARTICLEHISTORY";
  private static final String SQL_TABLE_ARTICLECOMMENTS_EXIST =
    "SELECT * FROM ARTICLECOMMENTS";


  /**
   * Queries to drop tables when creating from scratch.
   */
  private static final String SQL_TABLE_ARTICLES_DROP = "DROP TABLE articles";
  private static final String SQL_TABLE_ARTICLEHISTORY_DROP =
    "DROP TABLE articlehistory";
  private static final String SQL_TABLE_ARTICLECOMMENTS_DROP =
    "DROP TABLE articlecomments";


  /**
   * SQL for creating ARTICLES table.
   */
  private static final String SQL_TABLE_ARTICLES_CREATE =
    "CREATE TABLE articles ( " +
    "title VARCHAR(500), " +
    "created TIMESTAMP, " +
    "creator VARCHAR(10), " +
    "text VARCHAR(32000), " +
    "lastedited TIMESTAMP, " +
    "lasteditedby VARCHAR(10), " +
    "lockedby VARCHAR(10), " +
    "locktime TIMESTAMP " +
    ")";


  /**
   * SQL for creating ARTICLEHISTORY table.
   */
  private static final String SQL_TABLE_ARTICLEHISTORY_CREATE =
    "CREATE TABLE articlehistory ( " +
    "articletitle VARCHAR(500), " +
    "previoustext VARCHAR(32000), " +
    "newtext VARCHAR(32000), " +
    "edited TIMESTAMP, " +
    "editedby VARCHAR(10) " +
    ")";


  /**
   * SQL for creating ARTICLECOMMENTS table.
   */
  private static final String SQL_TABLE_ARTICLECOMMENTS_CREATE =
    "CREATE TABLE articlecomments ( " +
    "articletitle VARCHAR(500), " +
    "text VARCHAR(32000), " +
    "posted TIMESTAMP, " +
    "poster VARCHAR(10) " +
    ")";


  /**
   * The constructor for this class.  Creates a Spring JdbcTemplate object
   * connected to the database.
   */
  public DatabaseWorker() throws Exception {

    log.trace("DatabaseWorker.DatabaseWorker() - Entry");

    // Need a Spring JdncTemplate object, which connects to data source.
    jdbcTemplate = getJdbcTemplate();

    log.trace("DatabaseWorker.DatabaseWorker() - Entry");

  } // End constructor.


  /**
   * Get a Spring JdbcConnection object with a connection to the database.
   *
   * @return           The Spring JdbcTemplate object.
   * @throws Exception If anything goes wrong.
   */
  protected JdbcTemplate getJdbcTemplate() throws Exception {

    log.trace("DatabaseWorker.getJdbcTemplate() - Entry");

    // Get data source to database.
    DriverManagerDataSource dataSource = new DriverManagerDataSource();
    dataSource.setDriverClassName(Config.getDatabaseDriver());
    dataSource.setUrl(Config.getDatabaseURI());
    dataSource.setUsername(Config.getDatabaseUsername());
    dataSource.setPassword(Config.getDatabasePassword());

    log.trace("DatabaseWorker.getJdbcTemplate() - Exit");
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

    log.trace("DatabaseWorker.validateDatabase() - Entry");

    // First, perform a test query to each table.  If an exception is thrown,
    // this will mean the table doesn't exist, in which case we'll drop all
    // of them (just in case one exists but the others somehow don't) and
    // create them all.
    try {
      log.trace("DatabaseWorker.validateDatabase() - Checking tables");
      jdbcTemplate.queryForList(SQL_TABLE_ARTICLES_EXIST);
      jdbcTemplate.queryForList(SQL_TABLE_ARTICLEHISTORY_EXIST);
      jdbcTemplate.queryForList(SQL_TABLE_ARTICLECOMMENTS_EXIST);
    } catch (Exception e) {
      createTables();
    }

    log.trace("DatabaseWorker.validateDatabase() - Exit");

  } // End validateDatabase().


  /**
   * This method will be called by validateDatabase() if it is determined that
   * any single database table is missing.  The job of this method is to drop
   * any tables that do exist, and recreate them all.
   *
   * @throws Exception If anything goes wrong.
   */
  protected void createTables() throws Exception {

    log.trace("DatabaseWorker.createTables() - Entry");

    log.info("DatabaseWorker.createTables() - Dropping tables");
    // For each table, we execute the SQL drop statement.  If an exception
    // occurs, we'll just eat it because it just means the table didn't
    // exist, which is fine.
    try {
      jdbcTemplate.execute(SQL_TABLE_ARTICLES_DROP);
    } catch (Exception e) { }
    try {
      jdbcTemplate.execute(SQL_TABLE_ARTICLEHISTORY_DROP);
    } catch (Exception e) { }
    try {
      jdbcTemplate.execute(SQL_TABLE_ARTICLECOMMENTS_DROP);
    } catch (Exception e) { }

    // Now create each table.
    log.info("DatabaseWorker.createTables() - Creating tables");
    jdbcTemplate.execute(SQL_TABLE_ARTICLES_CREATE);
    jdbcTemplate.execute(SQL_TABLE_ARTICLEHISTORY_CREATE);
    jdbcTemplate.execute(SQL_TABLE_ARTICLECOMMENTS_CREATE);

    log.trace("DatabaseWorker.createTables() - Entry");

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

    log.trace("DatabaseWorker.replaceTokens() - Entry");

    // Log incoming parameters.
    if (log.isDebugEnabled()) {
      log.debug("DatabaseWorker.replaceTokens() - inString = " + inString);
      log.debug("DatabaseWorker.replaceTokens() - inVals = " + inVals);
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
      log.debug("DatabaseWorker.replaceTokens() - retString = " + retString);
    }

    log.trace("DatabaseWorker.replaceTokens() - Exit");
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

    log.trace("DatabaseWorker.executeQuery() - Entry");

    // Log incoming parameters.
    if (log.isDebugEnabled()) {
      log.debug("DatabaseWorker.executeQuery() - inSQL = " + inSQL);
      log.debug("DatabaseWorker.executeQuery() - inVals = " + inVals);
    }

    // Replace tokens in string.
    String sql = replaceTokens(inSQL, inVals);

    // Now execute and log results.
    List data = jdbcTemplate.queryForList(sql);
    if (log.isDebugEnabled()) {
      log.debug("DatabaseWorker.executeQuery() - Returned List = " + data);
    }

    log.trace("DatabaseWorker.executeQuery() - Exit");
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

    log.trace("DatabaseWorker.executeUpdate() - Entry");

    // Log incoming parameters.
    if (log.isDebugEnabled()) {
      log.debug("DatabaseWorker.executeUpdate() - inSQL = " + inSQL);
      log.debug("DatabaseWorker.executeUpdate() - inVals = " + inVals);
    }

    // Replace tokens in string.
    String sql = replaceTokens(inSQL, inVals);

    // Now execute and we're done.
    jdbcTemplate.update(sql);

    log.trace("DatabaseWorker.executeUpdate() - Exit");

  } // End executeUpdate().


} // End class.
