package com.apress.ajaxprojects.ajaxchat;


import java.lang.reflect.Field;


/**
 * This class stores static application configuration information read in from
 * the app-config.xml file at startup.  It is then accessible to all classes
 * that need it.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class AjaxChatConfig {


  /**
   * The maximum number of messages to keep in the messages collection in
   * any given room.
   */
  private static int maxMessages;


  /**
   * The maximum number of time, in seconds, that can elapse between AJAX
   * requests from a given user before they are considered inactive and will be
   * forcibly removed.
   */
  private static int userInactivitySeconds;


  /**
   * Constructor.
   */
  public AjaxChatConfig() {

  } // End constructor.


  /**
   * Return the maxMessages field.
   *
   * @return Maximum number of messages to keep in the messages collection in
   *         any given room.
   */
  public static int getMaxMessages() {

    return maxMessages;

  } // End getMaxMessages().


  /**
   * Set the maxMessages field.
   *
   * @param inMaxMessages New value of the maxMessages field.
   */
  public void setMaxMessages(int inMaxMessages) {

    maxMessages = inMaxMessages;

  } // End setMaxMessages().


  /**
   * Return the userInactivitySeconds field.
   *
   * @return Max number of seconds that can elapse between AJAX requests
   *         before a user is considered inactive.
   */
  public static int getUserInactivitySeconds() {

    return userInactivitySeconds;

  } // End getUserInactivitySeconds().


  /**
   * Set the userInactivitySeconds field.
   *
   * @param inUserInactivitySeconds New value of the userInactivitySeconds
   *                                field.
   */
  public void setUserInactivitySeconds(int inUserInactivitySeconds) {

    userInactivitySeconds = inUserInactivitySeconds;

  } // End setUserInactivitySeconds().


  /**
   * Overriden toString method.
   *
   * @return A reflexively built string representation of this bean.
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
