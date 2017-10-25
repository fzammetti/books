package com.apress.ajaxprojects.ajaxwarrior.gameobjects;


import java.io.Serializable;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Iterator;
import org.apache.commons.lang.StringEscapeUtils;


/**
 * This class stores all information pertaining to the current state of the
 * game from the server-side GameState object.
 */
public class ClientSideGameState implements Serializable {


  /**
   * The activity scroll history.
   */
  private ArrayList activityScroll = new ArrayList();


  /**
   * The activity scroll history.
   */
  private String activityScrollEntry;


  /**
   * The talkAttackMode value.
   */
  private String talkAttackMode;


  /**
   * The currentWeapon value.
   */
  private String currentWeapon;


  /**
   * Add an entry to the activity scroll.
   *
   * @param inEntry The entry to add.
   */
  public void setActivityScrollEntry(final String inEntry) {

    activityScroll.add(inEntry);

  } // End setActivityScrollEntry().


  /**
   * Accessor for activityScroll.
   *
   * @return Value of activityScroll.
   */
  public ArrayList getActivityScroll() {

    return activityScroll;

  } // End getActivityScroll().


  /**
   * Mutator for talkAttackMode.
   *
   * @param inTalkAttackMode New value for talkAttackMode.
   */
  public void setTalkAttackMode(final String inTalkAttackMode) {

    talkAttackMode = inTalkAttackMode;

  } // End setTalkAttackMode().


  /**
   * Accessor for talkAttackMode.
   *
   * @return Value of talkAttackMode.
   */
  public String getTalkAttackMode() {

    return talkAttackMode;

  } // End getTalkAttackMode().


  /**
   * Mutator for currentWeapon.
   *
   * @param inCurrentWeapon New value for currentWeapon.
   */
  public void setCurrentWeapon(final String inCurrentWeapon) {

    currentWeapon = inCurrentWeapon;

  } // End setCurrentWeapon().


  /**
   * Accessor for currentWeapon.
   *
   * @return Value of currentWeapon.
   */
  public String getCurrentWeapon() {

    return currentWeapon;

  } // End getCurrentWeapon().


  /**
   * This method returns a version of this object as a string suitable for
   * insertion into a JavaScript variable.  This is used when continuing a
   * game to reconstitute the client-side gameState.
   *
   * @return This object as a string, suitable for insertion into JavaScript.
   */
  public String getAsClientString() {

    // Construct a delimited string where ~~~ is the delimiter sequence.
    StringBuffer sb = new StringBuffer(1024);
    sb.append(StringEscapeUtils.escapeJavaScript(talkAttackMode) + "~~~");
    sb.append(StringEscapeUtils.escapeJavaScript(currentWeapon) + "~~~");
    for (Iterator it = activityScroll.iterator(); it.hasNext();) {
      sb.append(StringEscapeUtils.escapeJavaScript((String)it.next()) + "~~~");
    }
    return sb.toString();

  } // End getAsClientString


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
