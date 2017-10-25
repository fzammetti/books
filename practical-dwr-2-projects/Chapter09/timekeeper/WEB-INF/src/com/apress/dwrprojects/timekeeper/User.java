package com.apress.dwrprojects.timekeeper;


import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * A POJO describing a User for use with Hibernate.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class User {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(User.class);


  /**
   * Unique ID of the user.
   */
  private Long id;


  /**
   * The user's username.
   */
  private String username;


  /**
   * The user's password.
   */
  private String password;


  /**
   * Flag: Is the user an administrator?
   */
  private Boolean isAdministrator = new Boolean(false);


  /**
   * Flag: Is the user a project manager?
   */
  private Boolean isProjectManager = new Boolean(false);


  /**
   * Constructor.
   */
  public User() { }


  /**
   * Setter for id field.
   *
   * @param inID New value.
   */
  private void setId(final Long inID) {

    id = inID;

  } // End setId().


  /**
   * Getter for id field.
   *
   * @return Current value.
   */
  public Long getId() {

    return id;

  } // End getId().


  /**
   * Setter for username field.
   *
   * @param inUsername New value.
   */
  public void setUsername(final String inUsername) {

    username = inUsername;

  } // End setUserName().


  /**
   * Getter for username field.
   *
   * @return Current value.
   */
  public String getUsername() {

    return username;

  } // End getUsername().


  /**
   * Setter for password field.
   *
   * @param inPassword New value.
   */
  public void setPassword(final String inPassword) {

    password = inPassword;

  } // End setPassword().


  /**
   * Getter for password field.
   *
   * @return Current value.
   */
  public String getPassword() {

    return password;

  } // End getPassword().


  /**
   * Setter for isAdministrator field.
   *
   * @param inIsAdministrator New value.
   */
  public void setIsAdministrator(final Boolean inIsAdministrator) {

    isAdministrator = inIsAdministrator;

  } // End setIsAdministrator().


  /**
   * Getter for isAdministrator field.
   *
   * @return Current value.
   */
  public Boolean getIsAdministrator() {

    return isAdministrator;

  } // End getIsAdministrator().


  /**
   * Setter for isProjectManager field.
   *
   * @param inIsProjectManager New value.
   */
  public void setIsProjectManager(final Boolean inIsProjectManager) {

    isProjectManager = inIsProjectManager;

  } // End setIsProjectManager().


  /**
   * Getter for isProjectManager field.
   *
   * @return Current value.
   */
  public Boolean getIsProjectManager() {

    return isProjectManager;

  } // End getIsProjectManager().


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
