package com.apress.dwrprojects.instamail;


import java.lang.reflect.Field;


/**
 * This is a bean that describes a contact from the address book.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class ContactDTO {


  /**
   * Name.
   */
  private String name;


  /**
   * Address.
   */
  private String address;


  /**
   * Note.
   */
  private String note;


  /**
   * setName.
   *
   * @param inName inName.
   */
  public void setName(String inName) {

    name = inName;

  } // End setName().


  /**
   * getName.
   *
   * @return name.
   */
  public String getName() {

    return name;

  } // End getName().


  /**
   * setAddress.
   *
   * @param inAddress inAddress.
   */
  public void setAddress(String inAddress) {

    address = inAddress;

  } // End setAddress().


  /**
   * getAddress.
   *
   * @return address.
   */
  public String getAddress() {

    return address;

  } // End getAddress().


  /**
   * setNote.
   *
   * @param inNote inNote.
   */
  public void setNote(String inNote) {

    note = inNote;

  } // End setNote().


  /**
   * getNote.
   *
   * @return note.
   */
  public String getNote() {

    return note;

  } // End getNote().


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
