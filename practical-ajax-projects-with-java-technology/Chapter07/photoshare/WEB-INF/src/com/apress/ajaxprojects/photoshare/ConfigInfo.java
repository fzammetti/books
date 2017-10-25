package com.apress.ajaxprojects.photoshare;


import java.util.HashMap;


/**
 * This class stores the Action mappings.
 */
public class ConfigInfo {


  /**
   * Collection of Action mappings.
   */
  private static HashMap configInfo = new HashMap();


  /**
   * Adds an Action mapping to the collection.
   *
   * @param hm A HashMap containing the Action mapping details.
   */
  public static void addConfig(HashMap hm) {

    configInfo.put((String)hm.get("path"), hm);

  } // End addConfig().


  /**
   * Returns an Action mapping from the collection as specified.
   *
   * @param path The path to look up configuration information for.
   * @return     A HashMap containing the Action mapping details.
   */
  public static HashMap getConfig(String path) {

    return (HashMap)configInfo.get(path);

  } // End getConfig().


  /**
   * Returns the entire collection of Action mapping configurations.
   *
   * @return A HashMap containing all the Action mappings.
   */
  public static HashMap getConfigInfo() {

    return configInfo;

  } // End getConfigInfo().


} // End class.
