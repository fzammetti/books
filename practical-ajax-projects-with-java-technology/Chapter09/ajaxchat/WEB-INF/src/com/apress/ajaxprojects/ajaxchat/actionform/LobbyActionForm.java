package com.apress.ajaxprojects.ajaxchat.actionform;


import java.lang.reflect.Field;
import java.util.Vector;
import org.apache.struts.action.ActionForm;


/**
 * ActionForm for the lobby screen.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class LobbyActionForm extends ActionForm {


  /**
   * The name of the room user clicks on.
   */
  private String name = "";


  /**
   * List of available rooms.
   */
  private Vector rooms = new Vector();


  /**
   * Accessor for name field.
   *
   * @return String Current value of name Field.
   */
  public String getName() {

    return name;

  } // End getName().


  /**
   * Mutator for name field.
   *
   * @param inName New value of name field.
   */
  public void setName(String inName) {

    name = inName;

  } // End setName().


  /**
   * Accessor for rooms field.
   *
   * @return Vector List of room.
   */
  public Vector getRooms() {

    return rooms;

  } // End getRooms().


  /**
   * Mutator for rooms field.
   *
   * @param inRooms New value of rooms field.
   */
  public void setRooms(Vector inRooms) {

    rooms = inRooms;

  } // End setRooms().


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
