package com.apress.ajaxprojects.theorganizer.objects;


/**
 * This class represents a Appointment.
 */
public class AppointmentObject {


  /**
   * The createdDT field value of the appointment.
   */
  private long createdDT;


  /**
   * The username this appointment is for.
   */
  private String username;


  /**
   * The subject of the appointment.
   */
  private String subject;


  /**
   * The location of the appointment.
   */
  private String location;


  /**
   * Appointment date.
   */
  private String appointmentDate;


  /**
   * Starting time of the appointment.
   */
  private String startTime;


  /**
   * Ending time of the appointment.
   */
  private String endTime;


  /**
   * Comments.
   */
  private String comments;


 /**
   * Mutator for createdDT.
   *
   * @param inCreatedDT New value for createdDT.
   */
  public void setCreatedDT(final long inCreatedDT) {

    createdDT = inCreatedDT;

  } // End setCreatedDT().


  /**
   * Accessor for createdDT.
   *
   * @return Value of createdDT.
   */
  public long getCreatedDT() {

    return createdDT;

  } // End getCreatedDT().


  /**
   * Mutator for username.
   *
   * @param inUsername New value for username.
   */
  public void setUsername(final String inUsername) {

    username = inUsername;

  } // End setUsername().


  /**
   * Accessor for username.
   *
   * @return Value of username.
   */
  public String getUsername() {

    return username;

  } // End getUsername().


   /**
   * Mutator for subject.
   *
   * @param inSubject New value for subject.
   */
  public void setSubject(final String inSubject) {

    subject = inSubject;

  } // End setSubject().


  /**
   * Accessor for subject.
   *
   * @return Value of subject.
   */
  public String getSubject() {

    return subject;

  } // End getSubject().


  /**
   * Mutator for location.
   *
   * @param inLocation New value for location.
   */
  public void setLocation(final String inLocation) {

    location = inLocation;

  } // End setLocation().


  /**
   * Accessor for location.
   *
   * @return Value of location.
   */
  public String getLocation() {

    return location;

  } // End getLocation().


  /**
   * Mutator for appointmentDate.
   *
   * @param inAppointmentDate New value for appointmentDate.
   */
  public void setAppointmentDate(final String inAppointmentDate) {

    appointmentDate = inAppointmentDate;

  } // End setAppointmentDate().


  /**
   * Accessor for appointmentDate.
   *
   * @return Value of appointmentDate.
   */
  public String getAppointmentDate() {

    return appointmentDate;

  } // End getAppointmentDate().


  /**
   * Mutator for startTime.
   *
   * @param inStartTime New value for startTime.
   */
  public void setStartTime(final String inStartTime) {

    startTime = inStartTime;

  } // End setStartTime().


  /**
   * Accessor for startTime.
   *
   * @return Value of startTime.
   */
  public String getStartTime() {

    return startTime;

  } // End getStartTime().


  /**
   * Mutator for endTime.
   *
   * @param inEndTime New value for endTime.
   */
  public void setEndTime(final String inEndTime) {

    endTime = inEndTime;

  } // End setEndTime().


  /**
   * Accessor for endTime.
   *
   * @return Value of endTime.
   */
  public String getEndTime() {

    return endTime;

  } // End getEndTime().


  /**
   * Mutator for comments.
   *
   * @param inComments New value for comments.
   */
  public void setComments(final String inComments) {

    comments = inComments;

  } // End setComments().


  /**
   * Accessor for comments.
   *
   * @return Value of comments.
   */
  public String getComments() {

    return comments;

  } // End getComments().


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
      java.lang.reflect.Field[] fields = this.getClass().getDeclaredFields();
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
