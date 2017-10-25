package com.apress.ajaxprojects.ajaxchat.dto;


import java.lang.reflect.Field;
import java.util.Collections;
import java.util.Date;
import java.util.Iterator;
import java.util.Vector;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import com.apress.ajaxprojects.ajaxchat.AjaxChatConfig;


/**
 * This class is a Data Transfer Object (DTO) that describes a Room.  Note that
 * a few of the methods here do just a tad more than I would generally like in
 * a DTO, but the architecture made sense this way, so I went with it.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class RoomDTO {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(RoomDTO.class);


  /**
   * The name of the room.
   */
  private String name;


  /**
   * The list of users currently chatting in the room.
   */
  private Vector users = new Vector();


  /**
   * The list of messages in the room.
   */
  private Vector messages = new Vector();


  /**
   * Constructor.
   */
  public RoomDTO() {

  } // End constructor.


  /**
   * Constructor.
   *
   * @param inName The name of the room being instantiated.
   */
  public RoomDTO(String inName) {

    name = inName;

  } // End constructor.


  /**
   * Return the name of the room.
   *
   * @return String Current value of name Field.
   */
  public String getName() {

    return name;

  } // End getName().


  /**
   * Set the name of the room.
   *
   * @param inName The name of the room.
   */
  public void setName(String inName) {

    name = inName;

  } // End setName().


  /**
   * Return a list of all users chatting in the room.
   *
   * @return The list of users chatting in the room.
   */
  public Vector getUserList() {

    return users;

  } // End getUserList().


  /**
   * Adds a user to the list of users chatting in the room.  The user WILL NOT
   * be added if they are already in the collection, which should deal with
   * the user clicking the Refresh button on their browser.
   *
   * @param inUser The user to add to the list of users chatting in the room.
   */
  public void addUser(UserDTO inUser) {

    if (log.isDebugEnabled()) {
      log.debug("RoomDTO addUser()...");
    }
    boolean userAlreadyInRoom = false;
    for (Iterator it = users.iterator(); it.hasNext();) {
      UserDTO user = (UserDTO)it.next();
      if (user.getUsername().equalsIgnoreCase(inUser.getUsername())) {
        userAlreadyInRoom = true;
      }
    }
    if (!userAlreadyInRoom) {
      if (log.isDebugEnabled()) {
        log.info("Adding user to room: " + inUser);
      }
      users.add(inUser);
      Collections.sort(users);
    }

  } // End addUser().


  /**
   * Removes a user from the list of users chatting in the room.
   *
   * @param inUser The user to remove.
   */
  public void removeUser(UserDTO inUser) {

    if (log.isDebugEnabled()) {
      log.debug("RoomDTO removeUser()...");
    }
    // Scan through all users until we find the one with the username of the
    // user passed in and remove the user from the list.
    String usernameToRemove = inUser.getUsername();
    int    i                = 0;
    int    indexToRemove    = -1;
    for (Iterator it = users.iterator(); it.hasNext();) {
      UserDTO user = (UserDTO)it.next();
      if (user.getUsername().equalsIgnoreCase(usernameToRemove)) {
        if (log.isDebugEnabled()) {
          log.debug("Found " + usernameToRemove + ", removing");
        }
        indexToRemove = i;
      }
      i++;
    }
    if (indexToRemove != -1) {
      users.remove(indexToRemove);
    }

  } // End removeUser().


  /**
   * This method returns all messages after the given datetime.
   *
   * @param  inDateTime  The Datetime from which all subsequent messages
   *                     will be returned.
   * @return             List of messages.
   */
  public Vector getMessages(Date inDateTime) {

    if (log.isDebugEnabled()) {
      log.debug("RoomDTO getMessages()...");
    }
    // Scan through the list of messages for the room and find any that were
    // posted after the given datetime, add those to a list to return.
    Vector al = new Vector();
    for (Iterator it = messages.iterator(); it.hasNext();) {
      MessageDTO message = (MessageDTO)it.next();
      if (message.getPostedDateTime().after(inDateTime)) {
        if (log.isDebugEnabled()) {
          log.debug("Returning message: " + message);
        }
        al.add(message);
      }
    }
    return al;

  } // End getMessages().


  /**
   * Posts a message to the room.
   *
   * @param inMessage A MessageDTO instance containing all the necessary
   *                  details for the message being posted.
   */
  public void postMessage(MessageDTO inMessage) {

    if (messages.size() > AjaxChatConfig.getMaxMessages()) {
      messages.clear();
    }
    messages.add(inMessage);

  } // End addMessage().


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
