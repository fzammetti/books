package com.apress.dwrprojects.timekeeper;


import java.util.Date;


/**
 * A POJO describing an entry on the timesheet of a user for a given project
 * and day.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class TimesheetItem {


  /**
   * Unique ID of the item.
   */
  private Long id;


  /**
   * ID of the user.
   */
  private Long userID;


  /**
   * ID of the project.
   */
  private Long projectID;


  /**
   * The date this item is for.
   */
  private Date reportDate = new Date();


  /**
   * The number of hours for this project on this day.
   */
  private Integer hours = new Integer(0);


  /**
   * Constructor.
   */
  public TimesheetItem() { }


  /**
   * Mutator for id.
   *
   * @param inID New value for item.
   */
  public void setId(final Long inID) {

    id = inID;

  } // End setId().


  /**
   * Accessor for id.
   *
   * @return Value of id.
   */
  public Long getId() {

    return id;

  } // End getId().


  /**
   * Mutator for userID.
   *
   * @param inUserID New value for userID.
   */
  public void setUserID(final Long inUserID) {

    userID = inUserID;

  } // End setUserId().


  /**
   * Accessor for userID.
   *
   * @return Value of userID.
   */
  public Long getUserID() {

    return userID;

  } // End getUserID().


  /**
   * Mutator for projectID.
   *
   * @param inProjectID New value for projectID.
   */
  public void setProjectID(final Long inProjectID) {

    projectID = inProjectID;

  } // End setProjectID().


  /**
   * Accessor for projectID.
   *
   * @return Value of projectID.
   */
  public Long getProjectID() {

    return projectID;

  } // End getProjectID().


  /**
   * Mutator for reportDate.
   *
   * @param inReportDate New value for reportDate.
   */
  public void setReportDate(final Date inReportDate) {

    reportDate = inReportDate;

  } // End setReportDate().


  /**
   * Accessor for reportDate.
   *
   * @return Value of reportDate.
   */
  public Date getReportDate() {

    return reportDate;

  } // End getReportDate().


  /**
   * Mutator for hours.
   *
   * @param inHours New value for hours.
   */
  public void setHours(final Integer inHours) {

    hours = inHours;

  } // End setHours().


  /**
   * Accessor for hours.
   *
   * @return Value of hours.
   */
  public Integer getHours() {

    return hours;

  } // End getHours().


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
