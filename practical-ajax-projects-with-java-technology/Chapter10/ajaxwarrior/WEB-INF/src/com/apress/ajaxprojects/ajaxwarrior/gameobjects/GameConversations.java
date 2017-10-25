package com.apress.ajaxprojects.ajaxwarrior.gameobjects;


import java.io.InputStream;
import java.io.IOException;
import java.lang.reflect.Field;
import java.util.HashMap;
import org.apache.commons.digester.Digester;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.xml.sax.SAXException;


/**
 * This class is a simple static holder class for the collection of
 * conversations read in at app startup.
 */
public class GameConversations {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog("com.apress.ajaxprojects");


  /**
   * The collection of GameConversation objects.
   */
  private static HashMap conversations = new HashMap();


  /**
   * Add a conversation to the collection of conversations.
   *
   * @param inGameConversation GameConversation instance to add.
   */
  public void addConversation(final GameConversation inGameConversation) {

    conversations.put(inGameConversation.getId(), inGameConversation);

  } // End addConversation().


  /**
   * Get a specified GameConversation object.
   *
   * @param  inID The ID to retrieve.
   * @return      The specified GameConversation instance.
   */
  public static GameConversation getConversation(final String inID) {

    return (GameConversation)conversations.get(inID);

  } // End getConversation().


  /**
   * Method called to load a specified conversations via Digester.
   *
   * @param inWhichConversation The name of the conversation to load.
   */
  public static void loadConversation(final String inWhichConversation) {

    log.info("Loading conversation file 'conversation_" +
      inWhichConversation + ".xml'...");

    Digester          digester           = null;
    InputStream       stream             = null;
    ClassLoader       loader             = null;
    GameConversations gameConversations  = new GameConversations();

    digester = new Digester();
    digester.setValidating(false);
    digester.push(gameConversations);
    // Create GameConversation object.
    digester.addObjectCreate("conversation",
        "com.apress.ajaxprojects.ajaxwarrior.gameobjects.GameConversation");
    // Set properties of GameConversation object.
    digester.addSetProperties("conversation");
    // Create GameTalkNode object.
    digester.addObjectCreate("conversation/node",
        "com.apress.ajaxprojects.ajaxwarrior.gameobjects.GameTalkNode");
    // Set properties of GameTalkNode object.
    digester.addSetProperties("conversation/node");
    // Create GameTalkReply object.
    digester.addObjectCreate("conversation/node/reply",
        "com.apress.ajaxprojects.ajaxwarrior.gameobjects.GameTalkReply");
    // Set properties of GameTalkReply object.
    digester.addSetProperties("conversation/node/reply");
    // Set replyText of GameTalkReply object.
    digester.addBeanPropertySetter("conversation/node/reply", "replyText");
    // Add GameTalkReply object to GameTalkNode object.
    digester.addSetNext("conversation/node/reply", "addReply");
    // Add GameTalkNode object to GameConversation object.
    digester.addSetNext("conversation/node", "addTalkNode");
    // Add GameConversation object to conversations collection.
    digester.addSetNext("conversation", "addConversation");
    try {
      loader = Thread.currentThread().getContextClassLoader();
      stream = loader.getResourceAsStream("conversation_" +
        inWhichConversation + ".xml");
      digester.parse(stream);
      log.info("Conversation loaded (" +
        GameConversations.getConversation(inWhichConversation).getNodeCount() +
        " nodes parsed)");
      if (log.isDebugEnabled()) {
        log.debug(GameConversations.getConversation(inWhichConversation));
      }
    } catch (IOException ioe) {
      ioe.printStackTrace();
    } catch (SAXException se) {
      se.printStackTrace();
    } finally {
      try {
        stream.close();
      } catch (Exception e) {
        if (log.isDebugEnabled()) {
          log.debug("Exception closing: " + e);
        }
      }
    }

  } // End loadConversation().


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
