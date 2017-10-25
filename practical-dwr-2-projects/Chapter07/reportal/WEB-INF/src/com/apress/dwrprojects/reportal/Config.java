package com.apress.dwrprojects.reportal;


import java.io.InputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import org.apache.commons.digester.Digester;
import org.xml.sax.SAXException;


/**
 * This is an object that holds application configuration information.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class Config {


  /**
   * Database driver class.
   */
  private static String databaseDriver;


  /**
   * Database connection string.
   */
  private static String databaseURI;


  /**
   * Database username.
   */
  private static String databaseUsername;


  /**
   * Database password.
   */
  private static String databasePassword;


  /**
   * The collection of DataSourceDescriptors configured.
   */
  private static Map<String, DataSourceDescriptor> dataSources =
    new HashMap<String, DataSourceDescriptor>();


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
   * Add a data source to the collection.
   *
   * @param inDataSource DataSourceDescriptor object to add.
   */
  public void addDataSource(final DataSourceDescriptor inDataSource) {

    dataSources.put(inDataSource.getName(), inDataSource);

  } // End setDatabasePassword().


  /**
   * Retrieves a named DataSourceDescriptor.
   *
   * @return The DataSourceDescriptor request, or null if not found.
   */
  public static DataSourceDescriptor getDataSource(final String inName) {

    return dataSources.get(inName);

  } // End getDataSource().


  /**
   * Retrieves the entire collection of configured data sources.
   *
   * @return A List of DataSourceDescriptor objects.
   */
  public static Map<String, DataSourceDescriptor> getDataSources() {

    return dataSources;

  } // End getDataSources().


  /**
   * This method is called from the ContextListener to read in the application
   * config file and populate the Config object with it.
   *
   * @param  inConfigFileStream An InputStream to the config file.
   * @throws IOException        If the config file can't be read.
   * @throws SAXException       If the config file can't be parsed.
   */
  public void init(final InputStream inConfigFileStream) throws IOException,
    SAXException {

    // Instantiate and configure Digester.
    Digester digester = new Digester();
    digester.setValidating(false);

    // Add rule to create Config object.
    digester.addObjectCreate("appConfig",
      "com.apress.dwrprojects.reportal.Config");

    // Add rules to set RePortal database parameters on Config object.
    digester.addBeanPropertySetter("appConfig/databaseDriver",
      "databaseDriver");
    digester.addBeanPropertySetter("appConfig/databaseURI", "databaseURI");
    digester.addBeanPropertySetter("appConfig/databaseUsername",
      "databaseUsername");
    digester.addBeanPropertySetter("appConfig/databasePassword",
      "databasePassword");

    // Add rule to create DataSourceDescriptor for data sources.
    digester.addObjectCreate("appConfig/dataSources/dataSource",
      "com.apress.dwrprojects.reportal.DataSourceDescriptor");

    // Add rules to set database parameters on DataSourceDescriptor object.
    digester.addBeanPropertySetter("appConfig/dataSources/dataSource/name",
      "name");
    digester.addBeanPropertySetter(
      "appConfig/dataSources/dataSource/description", "description");
    digester.addBeanPropertySetter(
      "appConfig/dataSources/dataSource/databaseDriver",
      "databaseDriver");
    digester.addBeanPropertySetter(
      "appConfig/dataSources/dataSource/databaseURI", "databaseURI");
    digester.addBeanPropertySetter(
      "appConfig/dataSources/dataSource/databaseUsername",
      "databaseUsername");
    digester.addBeanPropertySetter(
      "appConfig/dataSources/dataSource/databasePassword",
      "databasePassword");

    // Add rule to add DataSourceDescriptor to Config object.
    digester.addSetNext("appConfig/dataSources/dataSource",
      "addDataSource",
      "com.apress.dwrprojects.reportal.DataSourceDescriptor");

    // Ask Digester to do the work.
    digester.parse(inConfigFileStream);

  } // End init().


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
