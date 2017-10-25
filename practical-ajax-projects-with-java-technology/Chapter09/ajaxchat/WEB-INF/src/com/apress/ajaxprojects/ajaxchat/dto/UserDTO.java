package com.apress.ajaxprojects.ajaxchat.dto;


import java.lang.reflect.Field;
import java.util.Date;


/**
 * This class is a Data Transfer Object (DTO) that describes a User.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class UserDTO implements Comparable {


  /**
   * Username of the user.
   */
  private String username;


  /**
   * This stores the datetime of the last AJAX message received by this user,
   * specifically for the getMessages request.  When the user enters a room,
   * this is set.  When they leave the room, it is nulled.  The
   * UserClearerDaemonThread checks it and if it's not null, it sees if the
   * value is older than it's threshold for determining if a user is inactive.
   * If it is, the user is removed from all rooms.
   */
  private Date lastAJAXRequest;


  /**
   * Constructor.
   *
   * @param inUsername Username for this user.
   */
  public UserDTO(String inUsername) {

    username = inUsername;

  } // End constructor.


  /**
   * Accessor for username field.
   *
   * @return String Current value of username Field.
   */
  public String getUsername() {

    return username;

  } // End getUsername().


  /**
   * Mutator for username field.
   *
   * @param inUsername New value of username field.
   */
  public void setUsername(String inUsername) {

    username = inUsername;

  } // End setUsername().


  /**
   * Accessor for lastAJAXRequest field.
   *
   * @return Date Current value of lastAJAXRequest field.
   */
  public Date getLastAJAXRequest() {

    return lastAJAXRequest;

  } // End getLastAJAXRequest().


  /**
   * Mutator for lastAJAXRequest field.
   *
   * @param inLastAJAXRequest New value of lastAJAXRequest field.
   */
  public void setLastAJAXRequest(Date inLastAJAXRequest) {

    lastAJAXRequest = inLastAJAXRequest;

  } // End setLastAJAXRequest().


  /**
   * Used to sort the list of users in the room when a new user joins.
   *
   * @param  o UserDTO object to compare to.
   * @return   Typical return val of compareTo() method of Comparable interface.
   */
  public int compareTo(Object o) {

    return this.username.compareTo(((UserDTO)o).getUsername());

  } // End compareTo().


  /**
   * Overriden toString method.
   *
   * @return A reflexively-built string representation of this bean.
   */
  public String toString() {

    String str = null;
    StringBuffer sb = new StringBuffer(1000);
    sb.append("[" + super.toString() + "]={");
    boolean firstPropertyDisplayed = false;
    try {
      Field[] fields = this.getClass().getDeclaredFields();
      for (int i = 0; i < fields.length; i++) {
        if (firstPropertyDisplayed) {
          sb.append(", ");
        } else {
          firstPropertyDisplayed = true;
        }
        sb.append(fields[i].getName() + "=" + fields[i].get(this));
      }
      sb.append("}");
      str = sb.toString().trim();
    } catch (IllegalAccessException iae) {
      iae.printStackTrace();
    }
    return str;

  } // End toString().


} // End class.
