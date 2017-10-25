package com.apress.ajaxprojects.ajaxchat.dto;


import java.lang.reflect.Field;
import java.util.Date;


/**
 * This class is a Data Transfer Object (DTO) that describes a Message.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class MessageDTO {


  /**
   * Text of the message.
   */
  private String text;


  /**
   * User who posted the message.
   */
  private UserDTO postedBy;


  /**
   * Date and time the message was posted.
   */
  private Date postedDateTime;


  /**
   * Accessor for text field.
   *
   * @return String Current value of text Field.
   */
  public String getText() {

    return text;

  } // End getText().


  /**
   * Mutator for text field.
   *
   * @param inText New value of text field.
   */
  public void setText(String inText) {

    text = inText;

  } // End setText().


  /**
   * Accessor for postedBy field.
   *
   * @return String Current value of postedBy Field.
   */
  public UserDTO getPostedBy() {

    return postedBy;

  } // End getPostedBy().


  /**
   * Mutator for postedBy field.
   *
   * @param inPostedBy New value of postedBy field.
   */
  public void setPostedBy(UserDTO inPostedBy) {

    postedBy = inPostedBy;

  } // End setPostedBy().


  /**
   * Accessor for postedDateTime field.
   *
   * @return String Current value of postedDateTime Field.
   */
  public Date getPostedDateTime() {

    return postedDateTime;

  } // End getPostedDateTime().


  /**
   * Mutator for postedDateTime field.
   *
   * @param inPostedDateTime New value of postedDateTime field.
   */
  public void setPostedDateTime(Date inPostedDateTime) {

    postedDateTime = inPostedDateTime;

  } // End setPostedDateTime().


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
