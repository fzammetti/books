package com.apress.ajaxprojects.theorganizer;


/**
 * This class contains constants used throughout the application.
 */
public final class Globals {


  /**
   * The string to use to connect to the database.
   */
  public static String dbURL;


  /**
   * Constant for the Accounts database table.
   */
  public static final String TABLE_ACCOUNTS = "accounts";


  /**
   * Constant for the Contacts database table.
   */
  public static final String TABLE_CONTACTS = "contacts";


  /**
   * Constant for the Notes database table.
   */
  public static final String TABLE_NOTES = "notes";


  /**
   * Constant for the Tasks database table.
   */
  public static final String TABLE_TASKS = "tasks";


  /**
   * Constant for the Appointments database table.
   */
  public static final String TABLE_APPOINTMENTS = "appointments";


  /**
   * Username to use to connect to the database.
   */
  public static final String dbUsername = "sa";


  /**
   * Password ot use to connect to the database.
   */
  public static final String dbPassword = "";


  /**
   * The JDBC drivr to use to connect to the database.
   */
  public static final String dbDriver = "org.hsqldb.jdbcDriver";


  /**
   * Utility class, no instances allowed.
   */
  private Globals() {
  } // End constructor.


  /**
   * Mutator for dbURL.
   *
   * @param inDbURL New value for dbURL.
   */
  public static void setDbURL(final String inDbURL) {

    dbURL = inDbURL;

  } // End setDbURL().


  /**
   * Accessor for dbURL.
   *
   * @return Value of dbURL.
   */
  public static String getDbURL() {

    return dbURL;

  } // End getDbURL().


  /**
   * Accessor for dbUsername.
   *
   * @return Value of dbUsername.
   */
  public static String getDbUsername() {

    return dbUsername;

  } // End getDbUsername().


  /**
   * Accessor for dbPassword.
   *
   * @return Value of dbPassword.
   */
  public static String getDbPassword() {

    return dbPassword;

  } // End getDbPassword().


  /**
   * Accessor for dbDriver.
   *
   * @return Value of dbDriver.
   */
  public static String getDbDriver() {

    return dbDriver;

  } // End getDbDriver().


} // End class.
