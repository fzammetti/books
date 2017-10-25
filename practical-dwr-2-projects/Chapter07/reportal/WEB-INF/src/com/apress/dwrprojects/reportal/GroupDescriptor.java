package com.apress.dwrprojects.reportal;


/**
 * This is a simple VO class that describes a user group.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class GroupDescriptor {


  /**
   * The name of the group.
   */
  private String groupName;


  /**
   * A description of the group.
   */
  private String description;


  /**
   * Mutator for groupName.
   *
   * @param inGroupName New value for groupName.
   */
  public void setGroupName(final String inGroupName) {

    groupName = inGroupName;

  } // End setGroupName().


  /**
   * Accessor for groupName.
   *
   * @return Value of groupName.
   */
  public String getGroupName() {

    return groupName;

  } // End getGroupName().


  /**
   * Mutator for description.
   *
   * @param inDescription New value for description.
   */
  public void setDescription(final String inDescription) {

    description = inDescription;

  } // End setDescription().


  /**
   * Accessor for description.
   *
   * @return Value of description.
   */
  public String getDescription() {

    return description;

  } // End getDescription().


  /**
   * Overriden toString method.
   *
   * @return A reflexively-built string representation of this bean.
   */
  public String toString() {

    String str = null;
    StringBuffer sb = new StringBuffer(1000);
    sb.append("[").append(super.toString()).append("]={");
    boolean firstPropertyDisplayed = false;
    try {
      java.lang.reflect.Field[] fields = this.getClass().getDeclaredFields();
      for (int i = 0; i < fields.length; i++) {
        if (firstPropertyDisplayed) {
          sb.append(", ");
        } else {
          firstPropertyDisplayed = true;
        }
        sb.append(fields[i].getName()).append("=").append(fields[i].get(this));
      }
      sb.append("}");
      str = sb.toString().trim();
    } catch (IllegalAccessException iae) {
      iae.printStackTrace();
    }
    return str;

  } // End toString().


} // End class.
