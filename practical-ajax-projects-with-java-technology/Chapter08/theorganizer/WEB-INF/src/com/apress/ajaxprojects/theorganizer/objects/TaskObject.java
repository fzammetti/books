package com.apress.ajaxprojects.theorganizer.objects;


/**
 * This class represents a Task.
 */
public class TaskObject {


  /**
   * The date and time this task was created as a long (millis).
   */
  private long createdDT;


  /**
   * The username this task is for.
   */
  private String username;


  /**
   * The comments of the task.
   */
  private String comments;


  /**
   * The subject of the task.
   */
  private String subject;

  /**
   * The status code of the task.
   */
  private String status;


  /**
   * The priority code of the task.
   */
  private String priority;


  /**
   * The due date of the task.
   */
  private String due;


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
   * Mutator for status.
   *
   * @param inStatus New value for status.
   */
  public void setStatus(final String inStatus) {

    status = inStatus;

  } // End setStatus().


  /**
   * Accessor for status.
   *
   * @return Value of status.
   */
  public String getStatus() {

    return status;

  } // End getStatus().


  /**
   * Mutator for priority.
   *
   * @param inPriority New value for priority.
   */
  public void setPriority(final String inPriority) {

    priority = inPriority;

  } // End setPriority().


  /**
   * Accessor for priority.
   *
   * @return Value of priority.
   */
  public String getPriority() {

    return priority;

  } // End getPriority().


  /**
   * Mutator for due.
   *
   * @param inDue New value for due.
   */
  public void setDue(final String inDue) {

    due = inDue;

  } // End setDue().


  /**
   * Accessor for due.
   *
   * @return Value of due.
   */
  public String getDue() {

    return due;

  } // End getDue().


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
