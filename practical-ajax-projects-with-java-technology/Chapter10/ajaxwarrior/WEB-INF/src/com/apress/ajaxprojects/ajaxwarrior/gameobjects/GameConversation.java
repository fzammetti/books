package com.apress.ajaxprojects.ajaxwarrior.gameobjects;


import java.io.Serializable;
import java.lang.reflect.Field;
import java.util.HashMap;


/**
 * This class contains all the details for a conversation with a given
 * character the player can talk to.
 */
public class GameConversation implements Serializable {


  /**
   * The ID this conversation is known by.  Matches the filename.
   */
  private String id;


  /**
   * The collection of GameTalkNode objects in this conversation.
   */
  private HashMap talkNodes = new HashMap();


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
   * Add a node to the talkNodes collection.
   *
   * @param inTalkNode Node to add.
   */
  public void addTalkNode(final GameTalkNode inTalkNode) {

    talkNodes.put(inTalkNode.getId(), inTalkNode);

  } // End addTalkNode().


  /**
   * Get a node with the specified ID.
   *
   * @param  inID The ID to retrieve.
   * @return      The specified node.
   */
  public GameTalkNode getTalkNode(final String inID) {

    return (GameTalkNode)talkNodes.get(inID);

  } // End getTalkNode().


  /**
   * Return the number of nodes in this conversation.
   *
   * @return The number of nodes in this conversation.
   */
  public int getNodeCount() {

    return talkNodes.size();

  } // End getNodeCount().


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
