package com.apress.dwrprojects.reportal;


/**
 * This is a simple VO class that describes a user.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class UserDescriptor {


  /**
   * Username of user.
   */
  private String username;


  /**
   * User's current password.
   */
  private String password;


  /**
   * List of groups the user is in.
   */
  private String groups;


  /**
   * A note about the user.
   */
  private String note;


  /**
   * Mutator for username.
   *
   * @param inUsername New value for username.
   */
  public void setUsername(final String inUsername) {

    username = inUsername;

  } // End setUsername().


  /**
   * Accessor for username.
   *
   * @return Value of username.
   */
  public String getUsername() {

    return username;

  } // End getUsername().


  /**
   * Mutator for password.
   *
   * @param inPassword New value for password.
   */
  public void setPassword(final String inPassword) {

    password = inPassword;

  } // End setPassword().


  /**
   * Accessor for password.
   *
   * @return Value of password.
   */
  public String getPassword() {

    return password;

  } // End getPassword().


  /**
   * Mutator for groups.
   *
   * @param inGroups New value for groups.
   */
  public void setGroups(final String inGroups) {

    groups = inGroups;

  } // End setGroups().


  /**
   * Accessor for groups.
   *
   * @return Value of groups.
   */
  public String getGroups() {

    return groups;

  } // End getGroups().


  /**
   * Mutator for note.
   *
   * @param inNote New value for note.
   */
  public void setNote(final String inNote) {

    note = inNote;

  } // End setNote().


  /**
   * Accessor for note.
   *
   * @return Value of note.
   */
  public String getNote() {

    return note;

  } // End getNote().


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
