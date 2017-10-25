package com.apress.ajaxprojects.ajaxwarrior.listener;


import com.apress.ajaxprojects.ajaxwarrior.gameobjects.GameConversations;
import com.apress.ajaxprojects.ajaxwarrior.gameobjects.GameMaps;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * This ContextListener is responsible for one-time app initialization.  This
 * includes loading the maps and storing them in the GameMaps object statically.
 */
public class ContextListener implements ServletContextListener {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog("com.apress.ajaxprojects");


  /**
   * Execute at app startup.
   *
   * @param inEvent ServletContextEvent.
   */
  public void contextInitialized(final ServletContextEvent inEvent) {

    if (log.isDebugEnabled()) {
      log.debug("contextInitialized()...");
    }

    // Load all maps.
    GameMaps.loadMap("main");
    GameMaps.loadMap("town_a");
    GameMaps.loadMap("town_b");
    GameMaps.loadMap("village");
    GameMaps.loadMap("castle");

    // Load all conversations.
    GameConversations.loadConversation("guard_1");
    GameConversations.loadConversation("guard_2");
    GameConversations.loadConversation("guard_3");
    GameConversations.loadConversation("thief_1");
    GameConversations.loadConversation("thief_2");
    GameConversations.loadConversation("thief_3");
    GameConversations.loadConversation("peasant_1");
    GameConversations.loadConversation("peasant_2");
    GameConversations.loadConversation("peasant_red_keymaster");
    GameConversations.loadConversation("monk_1");
    GameConversations.loadConversation("monk_2");
    GameConversations.loadConversation("monk_green_keymaster");

    log.info("AJAXWarrior configured and ready to play!");

  } // End contextInitialized();


  /**
   * Execute at app shutdown.
   *
   * @param inEvent ServletContextEvent.
   */
  public void contextDestroyed(final ServletContextEvent inEvent) {

  } // End contextDestroyed().


} // Ebd class.
