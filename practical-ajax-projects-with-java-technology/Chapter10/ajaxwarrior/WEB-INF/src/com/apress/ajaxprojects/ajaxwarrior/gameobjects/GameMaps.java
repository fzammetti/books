package com.apress.ajaxprojects.ajaxwarrior.gameobjects;


import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.Field;
import java.util.ArrayList;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * This class holds the loaded maps.
 */
public class GameMaps {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog("com.apress.ajaxprojects");


  /**
   * The main map data.
   */
  public static ArrayList mainMap;


  /**
   * The townA map data.
   */
  public static ArrayList townAMap;


  /**
   * The townB map data.
   */
  public static ArrayList townBMap;


  /**
   * The village map data.
   */
  public static ArrayList villageMap;


  /**
   * The castle map data.
   */
  public static ArrayList castleMap;


  /**
   * This method loads one of the map files that are found in the path.
   * The argument determines which map to load.
   *
   * @param inWhichMap The name of the map (literally the filename minus
   *                   the extension) to load.
   */
  public static void loadMap(final String inWhichMap) {

    log.info("Loading map file 'map_" + inWhichMap + ".dat'...");

    ClassLoader       loader     = null;
    InputStream       stream     = null;
    InputStreamReader isr        = null;
    BufferedReader    br         = null;
    ArrayList         mapToLoad  = null;
    String            mapVarName = null;

    // Determine which map we're loading and get a pointer to it, then make
    // sure it's clear to begin with.
    if (inWhichMap.equalsIgnoreCase("main")) {
      GameMaps.mainMap = new ArrayList();
      mapToLoad = GameMaps.mainMap;
      mapVarName = "mainMap";
    } else if (inWhichMap.equalsIgnoreCase("town_a")) {
      GameMaps.townAMap = new ArrayList();
      mapToLoad = GameMaps.townAMap;
      mapVarName = "townAMap";
    } else if (inWhichMap.equalsIgnoreCase("town_b")) {
      GameMaps.townBMap = new ArrayList();
      mapToLoad = GameMaps.townBMap;
      mapVarName = "townBMap";
    } else if (inWhichMap.equalsIgnoreCase("village")) {
      GameMaps.villageMap = new ArrayList();
      mapToLoad = GameMaps.villageMap;
      mapVarName = "villageMap";
    } else if (inWhichMap.equalsIgnoreCase("castle")) {
      GameMaps.castleMap = new ArrayList();
      mapToLoad = GameMaps.castleMap;
      mapVarName = "castleMap";
    }

    // Load the map and populate the appropriate ArrayList from it, one List
    // element per file line.
    try {
      loader = Thread.currentThread().getContextClassLoader();
      stream = loader.getResourceAsStream(
        "map_" + inWhichMap + ".dat");
      isr    = new InputStreamReader(stream);
      br     = new BufferedReader(isr);
      String line = null;
      mapToLoad.clear();
      int lineCount = 0;
      int charCount = 0;
      while ((line = br.readLine()) != null) {
        lineCount++;
        charCount += line.length();
        mapToLoad.add(line);
      }
      log.info("Map loaded (lines: " + lineCount + ", chars:" +
        charCount + ")");
      if (log.isDebugEnabled()) {
        log.debug("GameMaps." + mapVarName + "=\n" + mapToLoad);
      }
    } catch (Exception e) {
      e.printStackTrace();
    } finally {
      try {
        br.close();
        isr.close();
        stream.close();
      } catch (Exception e) {
        log.debug("Exception closing: " + e);
      }
    }

  } // End loadMap().


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
