package com.apress.dwrprojects.timekeeper;


import java.util.Date;


/**
 * A POJO describing a Project for use with Hibernate.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class Project {


  /**
   * Unique ID of the project.
   */
  private Long id;


  /**
   * The name of the project.
   */
  private String name;


  /**
   * The project manager of the project.  Maps to the ID of a User object.
   */
  private Long projectManager;


  /**
   * The number of hours allocated to this project.
   */
  private Integer allocatedHours = new Integer(0);


  /**
   * The number of actual hours booked to this project so far.
   */
  private Integer bookedHours = new Integer(0);


  /**
   * The date this project is being targeted to be complete.
   */
  private Date targetDate = new Date();


  /**
   * A comma-separated list of user IDs that are assigned to this project.
   */
  private String usersAssigned = "";


  /**
   * Constructor.
   */
  public Project() { }


  /**
   * Setter for id field.
   *
   * @param inID New value.
   */
  private void setId(final Long inID) {

    id = inID;

  } // End setId().


  /**
   * Getter for id field.
   *
   * @return Current value.
   */
  public Long getId() {

    return id;

  } // End getId().


  /**
   * Setter for name field.
   *
   * @param inName New value.
   */
  public void setName(final String inName) {

    name = inName;

  } // End setName().


  /**
   * Getter for name field.
   *
   * @return Current value.
   */
  public String getName() {

    return name;

  } // End getName().


  /**
   * Setter for projectManager field.
   *
   * @param inProjectManager New value.
   */
  public void setProjectManager(final Long inProjectManager) {

    projectManager = inProjectManager;

  } // End setProjectManager().


  /**
   * Getter for projectManager field.
   *
   * @return Current value.
   */
  public Long getProjectManager() {

    return projectManager;

  } // End getProjectManager().


  /**
   * Setter for allocatedHours field.
   *
   * @param inAllocatedHours New value.
   */
  public void setAllocatedHours(final Integer inAllocatedHours) {

    allocatedHours = inAllocatedHours;

  } // End setAllocatedHours().


  /**
   * Getter for allocatedHours field.
   *
   * @return Current value.
   */
  public Integer getAllocatedHours() {

    return allocatedHours;

  } // End getAllocatedHours().


  /**
   * Setter for bookedHours field.
   *
   * @param inBookedHours New value.
   */
  public void setBookedHours(final Integer inBookedHours) {

    bookedHours = inBookedHours;

  } // End setBookedHours().


  /**
   * Getter for bookedHours field.
   *
   * @return Current value.
   */
  public Integer getBookedHours() {

    return bookedHours;

  } // End getBookedHours().


  /**
   * Setter for targetDate field.
   *
   * @param inTargetDate New value.
   */
  public void setTargetDate(final Date inTargetDate) {

    targetDate = inTargetDate;

  } // End setTargetDate().


  /**
   * Getter for targetDate field.
   *
   * @return Current value.
   */
  public Date getTargetDate() {

    return targetDate;

  } // End getTargetDate().


  /**
   * Setter for usersAssigned field.
   *
   * @param inUsersAssigned New value.
   */
  public void setUsersAssigned(final String inUsersAssigned) {

    usersAssigned = inUsersAssigned;

  } // End setUsersAssigned().


  /**
   * Getter for usersAssigned field.
   *
   * @return Current value.
   */
  public String getUsersAssigned() {

    return usersAssigned;

  } // End getUsersAssigned().


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
