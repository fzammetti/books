package com.apress.ajaxprojects.ajaxwarrior.gameobjects;


import java.io.Serializable;
import java.lang.reflect.Field;


/**
 * This class is one possible reply for a given GameTalkNode.
 */
public class GameTalkReply implements Serializable {


  /**
   * The ID of this reply.  Always "1", "2" or "3".
   */
  private String id;


  /**
   * The change in karma this reply will elicit.
   */
  private int karma;


  /**
   * The node this reply will jump to.
   */
  private String target;


  /**
   * The text of this reply.
   */
  private String replyText;


  /**
   * Mutator for id.
   *
   * @param inId New value for id.
   */
  public void setId(final String inId) {

    id = inId;

  } // End setId().


  /**
   * Accessor for id.
   *
   * @return Value of id.
   */
  public String getId() {

    return id;

  } // End getId().


  /**
   * Mutator for karma.
   *
   * @param inKarma New value for karma.
   */
  public void setKarma(final int inKarma) {

    karma = inKarma;

  } // End setKarma().


  /**
   * Accessor for karma.
   *
   * @return Value of karma.
   */
  public int getKarma() {

    return karma;

  } // End getKarma().


  /**
   * Mutator for target.
   *
   * @param inTarget New value for target.
   */
  public void setTarget(final String inTarget) {

    target = inTarget;

  } // End setTarget().


  /**
   * Accessor for target.
   *
   * @return Value of target.
   */
  public String getTarget() {

    return target;

  } // End getTarget().


  /**
   * Mutator for replyText.
   *
   * @param inReplyText New value for replyText.
   */
  public void setReplyText(final String inReplyText) {

    replyText = inReplyText;

  } // End setReplyText().


  /**
   * Accessor for replyText.
   *
   * @return Value of replyText.
   */
  public String getReplyText() {

    return replyText;

  } // End getReplyText().


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
