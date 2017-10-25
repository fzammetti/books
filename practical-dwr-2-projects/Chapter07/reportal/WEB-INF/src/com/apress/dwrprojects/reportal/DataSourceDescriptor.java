package com.apress.dwrprojects.reportal;


/**
 * This is a class that represents a data source configured to be used by
 * RePortal reports.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class DataSourceDescriptor {


  /**
   * Name of data source.
   */
  private String name;


  /**
   * Description of data source.
   */
  private String description;


  /**
   * Database driver class.
   */
  private String databaseDriver;


  /**
   * Database connection string.
   */
  private String databaseURI;


  /**
   * Database username.
   */
  private String databaseUsername;


  /**
   * Database password.
   */
  private String databasePassword;


  /**
   * Mutator for name.
   *
   * @param inName New value for name.
   */
  public void setName(final String inName) {

    name = inName;

  } // End setName().


  /**
   * Accessor for name.
   *
   * @return Value of name.
   */
  public String getName() {

    return name;

  } // End getName().


  /**
   * Mutator for description.
   *
   * @param inDescription New value for description.
   */
  public void setDescription(final String inDescription) {

    description = inDescription;

  } // End setDescription().


  /**
   * Accessor for description.
   *
   * @return Value of description.
   */
  public String getDescription() {

    return description;

  } // End getDescription().


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
  public String getDatabaseDriver() {

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
  public String getDatabaseURI() {

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
  public String getDatabaseUsername() {

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
  public String getDatabasePassword() {

    return databasePassword;

  } // End getDatabasePassword().


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
