package com.apress.ajaxprojects.ajaxwarrior.gameobjects;


import java.io.Serializable;
import java.lang.reflect.Field;


/**
 * This class represents an item in the game.
 */
public class GameItem implements Serializable {


  /**
   * The type of the item.
   */
  private char type;


  /**
   * The horizontal location of this item.
   */
  private int xLocation;


  /**
   * The vertical location of this item.
   */
  private int yLocation;


  /**
   * This is the value of this item, either the number of scrolls if its a
   * spell scroll, the amount of health if a health pack, or the amount of gold
   * pieces if a treasure chest.
   */
  private int value;


  /**
   * This is what type of spell this is, if it is a spell scroll.
   */
  private char spellType;


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
   * Mutator for value.
   *
   * @param inValue New value for value.
   */
  public void setValue(final int inValue) {

    value = inValue;

  } // End setValue().


  /**
   * Accessor for value.
   *
   * @return Value of value.
   */
  public int getValue() {

    return value;

  } // End getValue().


  /**
   * Mutator for spellType.
   *
   * @param inSpellType New value for spellType.
   */
  public void setSpellType(final char inSpellType) {

    spellType = inSpellType;

  } // End setSpellType().


  /**
   * Accessor for spellType.
   *
   * @return Value of spellType.
   */
  public char getSpellType() {

    return spellType;

  } // End getSpellType().


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
