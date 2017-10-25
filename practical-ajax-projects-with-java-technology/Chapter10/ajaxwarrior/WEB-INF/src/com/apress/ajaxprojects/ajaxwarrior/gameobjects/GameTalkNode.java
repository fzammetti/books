package com.apress.ajaxprojects.ajaxwarrior.gameobjects;


import java.io.Serializable;
import java.lang.reflect.Field;
import java.util.LinkedHashMap;


/**
 * This class is a single node in a conversation with a character.
 */
public class GameTalkNode implements Serializable {


  /**
   * The ID of this node.
   */
  private String id;


  /**
   * The character's response for this node.
   */
  private String response;


  /**
   * The collection of possible player replies.
   */
  private LinkedHashMap replies = new LinkedHashMap();


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
   * Mutator for response.
   *
   * @param inResponse New value for response.
   */
  public void setResponse(final String inResponse) {

    response = inResponse;

  } // End setResponse().


  /**
   * Accessor for response.
   *
   * @return Value of response.
   */
  public String getResponse() {

    return response;

  } // End getResponse().


  /**
   * Add a reply to the collection of replies.
   *
   * @param inReply New reply to add.
   */
  public void addReply(final GameTalkReply inReply) {

    replies.put(inReply.getId(), inReply);

  } // End addReply().


  /**
   * Returns a specified reply.
   *
   * @param  inID The ID of the node wanted.
   * @return      The specified reply.
   */
  public GameTalkReply getReply(final String inID) {

    return (GameTalkReply)replies.get(inID);

  } // End getReply().


  /**
   * Accessor for replies.
   *
   * @return Value of replies.
   */
  public LinkedHashMap getReplies() {

    return replies;

  } // End getReplies().


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
