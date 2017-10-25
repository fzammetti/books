package com.apress.ajaxprojects.ajaxwarrior.gameobjects;


import java.io.Serializable;
import java.lang.reflect.Field;


/**
 * This class represents a character in the game.
 */
public class GameCharacter implements Serializable {


  /**
   * The ID of this character.
   */
  private String id;


  /**
   * The type of the character.
   */
  private char type;


  /**
   * The horizontal location of this character.
   */
  private int xLocation;


  /**
   * The vertical location of this character.
   */
  private int yLocation;


  /**
   * True if this character is belligerent towards the player, false if not.
   */
  private boolean belligerent;


  /**
   * The health of this character.
   */
  private int health;


  /**
   * How many hit points this character has.
   */
  private int hitPoints;


  /**
   * What weapon this character is holding.
   */
  private char weapon;


  /**
   * True if this character can tell where the green key is, false if not.
   */
  private boolean greenKeymaster;


  /**
   * True if this character can tell where the red key is, false if not.
   */
  private boolean redKeymaster;


  /**
   * This a counter for how many tiles the character has moved in a given
   * direction so far.
   */
  private int moveCount;


  /**
   * This is the direction the character is currently moving in ('n', 's',
   * 'e', 'w').
   */
  private char moveDir;


  /**
   * This flag is set to true when the character doesn't move.
   */
  private boolean immobile;


  /**
   * This is the GameConversation this character will use.
   */
  private GameConversation talkConversation;


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
   * Mutator for talkConversation.
   *
   * @param inTalkConversation New value for talkConversation.
   */
  public void setTalkConversation(final GameConversation inTalkConversation) {

    talkConversation = inTalkConversation;

  } // End setTalkConversation().


  /**
   * Accessor for talkConversation.
   *
   * @return Value of talkConversation.
   */
  public GameConversation getTalkConversation() {

    return talkConversation;

  } // End getTalkConversation().


  /**
   * Mutator for xLocation field.
   *
   * @param inXLocation New value.
   */
  public void setXLocation(final int inXLocation) {

    xLocation = inXLocation;

  } // End setXLocation().


  /**
   * Accessor for xLocation field.
   *
   * @return Current value.
   */
  public int getXLocation() {

    return xLocation;

  } // End getXLocation().


  /**
   * Mutator for yLocation field.
   *
   * @param inYLocation New value.
   */
  public void setYLocation(final int inYLocation) {

    yLocation = inYLocation;

  } // End setYLocation().


  /**
   * Accessor for yLocation field.
   *
   * @return Current value.
   */
  public int getYLocation() {

    return yLocation;

  } // End getYLocation().


  /**
   * Mutator for belligerent field.
   *
   * @param inBelligerent New value.
   */
  public void setBelligerent(final boolean inBelligerent) {

    belligerent = inBelligerent;

  } // End setBelligerent().


  /**
   * Accessor for belligerent field.
   *
   * @return Current value.
   */
  public boolean isBelligerent() {

    return belligerent;

  } // End isBelligerent().


  /**
   * Mutator for health field.
   *
   * @param inHealth New value.
   */
  public void setHealth(final int inHealth) {

    health = inHealth;

  } // End sethealth().


  /**
   * Accessor for health field.
   *
   * @return Current value.
   */
  public int getHealth() {

    return health;

  } // End getHealth().


  /**
   * Mutator for hitPoints field.
   *
   * @param inHitPoints New value.
   */
  public void setHitPoints(final int inHitPoints) {

    hitPoints = inHitPoints;

  } // End setHitPoints().


  /**
   * Accessor for hitPoints field.
   *
   * @return Current value.
   */
  public int getHitPoints() {

    return hitPoints;

  } // End getHitPoints().


  /**
   * Mutator for weapon field.
   *
   * @param inWeapon New value.
   */
  public void setWeapon(final char inWeapon) {

    weapon = inWeapon;

  } // End setWeapon().


  /**
   * Accessor for weapon field.
   *
   * @return Current value.
   */
  public char getWeapon() {

    return weapon;

  } // End getWeapon().


  /**
   * Mutator for type field.
   *
   * @param inType New value.
   */
  public void setType(final char inType) {

    type = inType;

  } // End setType().


  /**
   * Accessor for type field.
   *
   * @return Current value.
   */
  public char getType() {

    return type;

  } // End getType().


  /**
   * Mutator for moveCount.
   *
   * @param inMoveCount New value for moveCount.
   */
  public void setMoveCount(final int inMoveCount) {

    moveCount = inMoveCount;

  } // End setMoveCount().


  /**
   * Accessor for moveCount.
   *
   * @return Value of moveCount.
   */
  public int getMoveCount() {

    return moveCount;

  } // End getMoveCount().


  /**
   * Mutator for moveDir.
   *
   * @param inMoveDir New value for moveDir.
   */
  public void setMoveDir(final char inMoveDir) {

    moveDir = inMoveDir;

  } // End setMoveDir().


  /**
   * Accessor for moveDir.
   *
   * @return Value of moveDir.
   */
  public char getMoveDir() {

    return moveDir;

  } // End getMoveDir().


  /**
   * Mutator for greenKeymaster.
   *
   * @param inGreenKeymaster New value for greenKeymaster.
   */
  public void setGreenKeymaster(final boolean inGreenKeymaster) {

    greenKeymaster = inGreenKeymaster;

  } // End setGreenKeymaster().


  /**
   * Accessor for greenKeymaster.
   *
   * @return Value of greenKeymaster.
   */
  public boolean isGreenKeymaster() {

    return greenKeymaster;

  } // End isGreenKeymaster().


  /**
   * Mutator for redKeymaster.
   *
   * @param inRedKeymaster New value for redKeymaster.
   */
  public void setRedKeymaster(final boolean inRedKeymaster) {

    redKeymaster = inRedKeymaster;

  } // End setRedKeymaster().


  /**
   * Accessor for redKeymaster.
   *
   * @return Value of redKeymaster.
   */
  public boolean isRedKeymaster() {

    return redKeymaster;

  } // End isRedKeymaster().


  /**
   * Mutator for immobile.
   *
   * @param inImmobile New value for immobile.
   */
  public void setImmobile(final boolean inImmobile) {

    immobile = inImmobile;

  } // End setImmobile().


  /**
   * Accessor for immobile.
   *
   * @return Value of immobile.
   */
  public boolean isImmobile() {

    return immobile;

  } // End isImmobile().


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
