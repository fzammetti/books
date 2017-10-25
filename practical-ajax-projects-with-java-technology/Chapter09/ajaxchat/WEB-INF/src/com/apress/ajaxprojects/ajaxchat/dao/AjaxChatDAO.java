package com.apress.ajaxprojects.ajaxchat.dao;


import java.io.InputStream;
import java.io.IOException;
import java.util.Date;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Vector;
import org.apache.commons.digester.Digester;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import com.apress.ajaxprojects.ajaxchat.AjaxChatConfig;
import com.apress.ajaxprojects.ajaxchat.dto.MessageDTO;
import com.apress.ajaxprojects.ajaxchat.dto.RoomDTO;
import com.apress.ajaxprojects.ajaxchat.dto.UserDTO;
import org.xml.sax.SAXException;


/**
 * This Data Access Object (DAO) is really the heart and soul of the app.  All
 * the real work is done here in terms of recording messages, dealing with
 * users and rooms and most everything else.  It's probably a bit more
 * than what a DAO is supposed to generally be, but in this case I don't think
 * it's a big deal.  Besides, the idea is that if you want to make this a more
 * robust application, with real message persistence and such, then all you
 * should probably have to mess with is this class.  That's the intent anyway.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public final class AjaxChatDAO {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(AjaxChatDAO.class);


  /**
   * This class is a singleton, so here's the one and only instance.
   */
  private static AjaxChatDAO instance;


  /**
   * Collection of RoomDTO objects.
   */
  private LinkedHashMap rooms = new LinkedHashMap();


  /**
   * Collection of UserDTO objects of currently logged in users.
   */
  private Vector users = new Vector();


  /**
   * Make sure instances of this class can't be created.
   */
  private AjaxChatDAO() {
  } // End constructor.


  /**
   * Complete the singleton pattern.  This method is the only way to get an
   * instance of this class.
   *
   * @return The one and only instance of this class.
   */
  public static AjaxChatDAO getInstance() {

    if (log.isDebugEnabled()) {
      log.debug("getInstance()...");
    }
    if (instance == null) {
      instance = new AjaxChatDAO();
      instance.init(null);
    }
    return instance;

  } // End getInstance().


  /**
   * Initialize.  Read in room-list.xml file and create RoomDTOs for each
   * and add it to the collection of rooms.  Note that the first time
   * getInstance() is called, we pass in null for the isConfigFile parameter,
   * and hence the config file is not read.  Before this DAO can really be
   * used, init() must be called, handing it an InputStream to the config
   * file.  This is done from ContextListener.
   *
   * @param isConfigFile InputStream to the config file.
   */
  public synchronized void init(InputStream isConfigFile) {

    if (log.isDebugEnabled()) {
      log.debug("init()...");
    }
    if (isConfigFile != null) {
      // Read in rooms config and create beans, hand off to DAO.
      Digester digester = new Digester();
      digester.setValidating(false);
      digester.push(this);
      digester.addObjectCreate("rooms/room",
        "com.apress.ajaxprojects.ajaxchat.dto.RoomDTO");
      digester.addSetProperties("rooms/room");
      digester.addSetNext("rooms/room", "addRoom");
      try {
        digester.parse(isConfigFile);
        log.info("***** Rooms = " + rooms);
      } catch (IOException ioe) {
        ioe.printStackTrace();
      } catch (SAXException se) {
        se.printStackTrace();
      }
    }

  } // End init().


  /**
   * Adds a room to the collection of rooms.
   *
   * @param inRoom The room to add.
   */
  public synchronized void addRoom(RoomDTO inRoom) {

    if (log.isDebugEnabled()) {
      log.debug("addRoom()...");
    }
    if (log.isDebugEnabled()) {
      log.debug("Adding room " + inRoom);
    }
    rooms.put(inRoom.getName(), inRoom);

  } // End addRoom().


  /**
   * Removes a room from the collection of rooms.
   *
   * @param inRoomName The namr of the room to remove.
   */
  public synchronized void removeRoom(String inRoomName) {

    if (log.isDebugEnabled()) {
      log.debug("removeRoom()...");
    }
    RoomDTO room = (RoomDTO)rooms.get(inRoomName);
    if (room.getUserList().size() == 0) {
      rooms.remove(inRoomName);
      if (log.isDebugEnabled()) {
        log.debug("removeRoom() removed room " + inRoomName);
      }
    } else {
      if (log.isDebugEnabled()) {
        log.debug("removeRoom() Room not removed because " +
          "there are users in it");
      }
    }

  } // End removeRoom().


  /**
   * Add a message to the list of messages in the named room.
   *
   * @param inRoom    The name of the room to post the message to.
   * @param inMessage The message to post.
   */
  public synchronized void postMessage(String inRoom, MessageDTO inMessage) {

    if (log.isDebugEnabled()) {
      log.debug("postMessage(): inRoom = " + inRoom +
        " - inMessage = " + inMessage + "...");
    }
    RoomDTO room = (RoomDTO)rooms.get(inRoom);
    room.postMessage(inMessage);

  } // End postMessage().


  /**
   * Gets all messages in a named room newer than the specified datetime.
   *
   * @param  inRoom     The name of the room to get messages for.
   * @param  inDateTime The date/time to start retrieval from.  We'll actually
   *                    get any message subsequent to this datetime.
   * @return            List of messages for the named room.
   */
  public synchronized Vector getMessages(String inRoom, Date inDateTime) {

    if (log.isDebugEnabled()) {
      log.debug("getMessages(): inRoom = " + inRoom +
        " - inDateTime = " + inDateTime + "...");
    }
    RoomDTO room = (RoomDTO)rooms.get(inRoom);
    return room.getMessages(inDateTime);

  } // End getMessages().


  /**
   * Returns a list of all rooms.  Note that this returns the room name only,
   * it DOES NOT return a list of RoomDTOs.
   *
   * @return List of all rooms names.
   */
  public synchronized Vector getRoomList() {

    if (log.isDebugEnabled()) {
      log.debug("getRoomList()...");
    }
    Vector roomList = new Vector();
    for (Iterator it = rooms.keySet().iterator(); it.hasNext();) {
      roomList.add((String)it.next());
    }
    if (log.isDebugEnabled()) {
      log.debug("roomList = " + roomList);
    }
    return roomList;

  } // End getRoomList().


  /**
   * Returns a Map of rooms, keyed by room name, with the number of users
   * chatting in each as the value.
   *
   * @return List of all rooms and user counts.
   */
  public synchronized LinkedHashMap getRoomUserCounts() {

    if (log.isDebugEnabled()) {
      log.debug("getRoomUserCounts()...");
    }
    LinkedHashMap roomList = new LinkedHashMap();
    for (Iterator it = rooms.keySet().iterator(); it.hasNext();) {
      String roomName = (String)it.next();
      roomList.put(roomName,
        new Integer(((RoomDTO)rooms.get(roomName)).getUserList().size()));
    }
    if (log.isDebugEnabled()) {
      log.debug("roomList = " + roomList);
    }
    return roomList;

  } // End getRoomUserCounts().


  /**
   * Returns a list of all users currently chatting in a given room.  Note that
   * this returns the username only, it DOES NOT return a list of UserDTOs.
   *
   * @param  inRoom The name of the room to get the user list for.
   * @return        List of all usernames chatting in a named room.
   */
  public synchronized Vector getUserList(String inRoom) {

    if (log.isDebugEnabled()) {
      log.debug("getUserList(): inRoom = " + inRoom + "...");
    }
    Vector userList = null;
    RoomDTO room = (RoomDTO)rooms.get(inRoom);
    userList = room.getUserList();
    if (log.isDebugEnabled()) {
      log.debug("userList = " + userList);
    }
    return userList;

  } // End getUserList().


  /**
   * Adds a user to the specified room.
   *
   * @param inRoom The room to add to.
   * @param inUser The user to add.
   */
  public synchronized void addUserToRoom(String inRoom, UserDTO inUser) {

    if (log.isDebugEnabled()) {
      log.debug("addUserToRoom()...");
    }
    RoomDTO room = (RoomDTO)rooms.get(inRoom);
    room.addUser(inUser);

  } // End addUserToRoom().


  /**
   * Removes a user from the specified room.
   *
   * @param inRoom The room to add to.
   * @param inUser The user to remove.
   */
  public synchronized void removeUserFromRoom(String inRoom, UserDTO inUser) {

    if (log.isDebugEnabled()) {
      log.debug("removeUserFromRoom()...");
    }
    RoomDTO room = (RoomDTO)rooms.get(inRoom);
    room.removeUser(inUser);

  } // End removeUserFromRoom().


  /**
   * Removes a user from all rooms.  This is kind of a safety net when a
   * users' session is destroyed.
   *
   * @param inUser The user to remove.
   */
  public synchronized void removeUserFromAllRooms(UserDTO inUser) {

    if (log.isDebugEnabled()) {
      log.debug("removeUserFromAllRooms()...");
    }
    for (Iterator it = rooms.keySet().iterator(); it.hasNext();) {
      String  roomName = (String)it.next();
      RoomDTO room     = (RoomDTO)rooms.get(roomName);
      room.removeUser(inUser);
    }

  } // End removeUserFromAllRooms().


  /**
   * Adds a user to the list of logged on users.
   *
   * @param inUser The user to log in.
   */
  public synchronized void logUserIn(UserDTO inUser) {

    if (log.isDebugEnabled()) {
      log.debug("logUserIn()...");
    }
    users.add(inUser);
    if (log.isDebugEnabled()) {
      log.debug(inUser.getUsername() + " logged in");
    }

  } // End logUserIn().


  /**
   * Removes a user from the list of logged on users.
   *
   * @param inUser The user to log out.
   */
  public synchronized void logUserOut(UserDTO inUser) {

    if (log.isDebugEnabled()) {
      log.debug("logUserOut()...");
    }
    String  usernameToLogOut = inUser.getUsername();
    int     i                = 0;
    int     indexToRemove    = -1;
    for (Iterator it = users.iterator(); it.hasNext();) {
      UserDTO user = (UserDTO)it.next();
      if (usernameToLogOut.equalsIgnoreCase(user.getUsername())) {
        indexToRemove = i;
        break;
      }
      i++;
    }
    if (indexToRemove != -1) {
      users.remove(indexToRemove);
      if (log.isDebugEnabled()) {
        log.debug(usernameToLogOut + " logged out");
      }
    }

  } // End logUserIn().


  /**
   * Checks to see if a given username is in use in any room.
   *
   * @param  inUsername The name to check.
   * @return            True if the name is in use, false if not.
   */
  public synchronized boolean isUsernameInUse(String inUsername) {

    if (log.isDebugEnabled()) {
      log.debug("isUsernameInUse()...");
    }
    boolean retVal = false;
    for (Iterator it = users.iterator(); it.hasNext();) {
      UserDTO user = (UserDTO)it.next();
      if (inUsername.equalsIgnoreCase(user.getUsername())) {
        retVal = true;
      }
    }
    if (log.isDebugEnabled()) {
      log.debug("Returning " + retVal);
    }
    return retVal;

  } // End isUsernameInUse().


  /**
   * This method goes through the collection of users and determines which, if
   * any, are inactive.  Any that are inactive are removed.  This is called
   * from the UserClearerDaemon thread.
   */
  public synchronized void removeInactiveUsers() {

    if (log.isDebugEnabled()) {
      log.debug("removeInactiveUsers()...");
    }
    Vector usersToRemove = new Vector();
    for (Iterator it = users.iterator(); it.hasNext();) {
      UserDTO user            = (UserDTO)it.next();
      long    now             = new Date().getTime();
      long    lastAJAXRequest = user.getLastAJAXRequest().getTime();
      if ((now - lastAJAXRequest) >=
        (AjaxChatConfig.getUserInactivitySeconds() * 1000)) {
        if (log.isDebugEnabled()) {
          log.debug("User " + user.getUsername() + " will be removed");
        }
        usersToRemove.add(user);
      }
    }
    for (Iterator it = usersToRemove.iterator(); it.hasNext();) {
      UserDTO user = (UserDTO)it.next();
      removeUserFromAllRooms(user);
      logUserOut(user);
    }

  } // End removeInactiveUsers().


} // End class.