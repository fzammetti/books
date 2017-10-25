package com.apress.dwrprojects.dwiki;


/**
 * This class contains globals used throughout the application.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class Config {


  /**
   * JDBC driver to use to connect to database.
   */
  private static String databaseDriver;


  /**
   * JDBC connection string for database.
   */
  private static String databaseURI;


  /**
   * Username to use to connect to database.
   */
  private static String databaseUsername;


  /**
   * Password to use to connect to database.
   */
  private static String databasePassword;


  /**
   * Time in minutes an article can be locked for editing between saves.
   */
  private static String editLockTime;


  /**
   * Mutator for databaseDriver.
   *
   * @param inDatabaseDriver New value for databaseDriver.
   */
  public void setDatabaseDriver(final String inDatabaseDriver) {

    databaseDriver = inDatabaseDriver;

  } // End setDatabaseDriver().


  /**
   * Accessor for databaseDriver.
   *
   * @return Value of databaseDriver.
   */
  public static String getDatabaseDriver() {

    return databaseDriver;

  } // End getDatabaseDriver().


  /**
   * Mutator for databaseURI.
   *
   * @param inDatabaseURI New value for databaseURI.
   */
  public void setDatabaseURI(final String inDatabaseURI) {

    databaseURI = inDatabaseURI;

  } // End setDatabaseURI().


  /**
   * Accessor for databaseURI.
   *
   * @return Value of databaseURI.
   */
  public static String getDatabaseURI() {

    return databaseURI;

  } // End getDatabaseURI().


  /**
   * Mutator for databaseUsername.
   *
   * @param inDatabaseUsername New value for databaseUsername.
   */
  public void setDatabaseUsername(final String inDatabaseUsername) {

    databaseUsername = inDatabaseUsername;

  } // End setDatabaseUsername().


  /**
   * Accessor for databaseUsername.
   *
   * @return Value of databaseUsername.
   */
  public static String getDatabaseUsername() {

    return databaseUsername;

  } // End getDatabaseUsername().


  /**
   * Mutator for databasePassword.
   *
   * @param inDatabasePassword New value for databasePassword.
   */
  public void setDatabasePassword(final String inDatabasePassword) {

    databasePassword = inDatabasePassword;

  } // End setDatabasePassword().


  /**
   * Accessor for databasePassword.
   *
   * @return Value of databasePassword.
   */
  public static String getDatabasePassword() {

    return databasePassword;

  } // End getDatabasePassword().


  /**
   * Mutator for editLockTime.
   *
   * @param inEditLockTime New value for editLockTime.
   */
  public void setEditLockTime(final String inEditLockTime) {

    editLockTime = inEditLockTime;

  } // End setEditLockTime().


  /**
   * Accessor for editLockTime.
   *
   * @return Value of editLockTime.
   */
  public static String getEditLockTime() {

    return editLockTime;

  } // End getEditLockTime().


  /**
   * Overriden toString method.
   *
   * @return A reflexively-built string representation of this bean.
   */
  public String toString() {

    String str = null;
    StringBuffer sb = new StringBuffer(1000);
    sb.append("[").append(super.toString()).append("]={");
    boolean firstPropertyDisplayed = false;
    try {
      java.lang.reflect.Field[] fields = this.getClass().getDeclaredFields();
      for (int i = 0; i < fields.length; i++) {
        if (firstPropertyDisplayed) {
          sb.append(", ");
        } else {
          firstPropertyDisplayed = true;
        }
        sb.append(fields[i].getName()).append("=").append(fields[i].get(this));
      }
      sb.append("}");
      str = sb.toString().trim();
    } catch (IllegalAccessException iae) {
      iae.printStackTrace();
    }
    return str;


  } // End toString().

} // End class.
