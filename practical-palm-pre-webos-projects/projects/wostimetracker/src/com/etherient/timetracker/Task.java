/*
    Timer Tracker - From the book "Practical webOS Projects With the Palm Pre"
    Copyright (C) 2009 Frank W. Zammetti
    fzammetti@etherient.com

    Licensed under the terms of the MIT license as follows:

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to 
    deal in the Software without restriction, including without limitation the 
    rights to use, copy, modify, merge, publish, distribute, sublicense, and/or 
    sell copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
    
    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
    FROM,OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS 
    IN THE SOFTWARE.
*/


package com.etherient.timetracker;


import java.util.Date;
import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;


/**
 * This class represents a task entity.
 * 
 * @author <a href="mailto:fzammetti@etherient.com">Frank W. Zammetti</a>
 *
 */
@PersistenceCapable(identityType = IdentityType.APPLICATION)
public class Task {

	
  /**
   * The name of the project this task is attached to.
   */
  @Persistent
  private String project;
  
  
  /**
   * The name of the task.
   */
  @Persistent
  @PrimaryKey
  private String name;

  
  /**
   * The date the task starts on.
   */
  @Persistent
  private Date startDate;
  
  
  /**
   * The date the task is expected to be finished.
   */
  @Persistent  
  private Date targetDate;


  /**
   * The number of hours allocated for this task.
   */
  @Persistent
  private int allocatedHours;


  /**
   * The number of hours booked against this task.
   */
  @Persistent
  private int bookedHours;

 
  /**
   * The name of the resource assigned to this task.
   */
  @Persistent
  private String assignedResource;

  
  /**
   * Set value of project field.
   * 
   * @param inProject New value of the field.
   */
  public void setProject(final String inProject) {
    
    this.project = inProject;
    
  } // End setProject().

  
  /**
   * Get value of project field.
   * 
   * @return Value of the field.
   */
  public String getProject() {
    
    return this.project;
    
  } // End getProject().
  
  
  /**
   * Set value of name field.
   * 
   * @param inName New value of the field.
   */
  public void setName(final String inName) {
	  
    this.name = inName;
    
  } // End setName().

  
  /**
   * Get value of name field.
   * 
   * @return Value of the field.
   */
  public String getName() {
	  
    return this.name;
    
  } // End getName().
  
  
  /**
   * Set value of startDate field.
   * 
   * @param inStartDate New value of the field.
   */
  public void setStartDate(final Date inStartDate) {
    
    this.startDate = inStartDate;
    
  } // End setStartDate().

  
  /**
   * Get value of StartDate field.
   * 
   * @return Value of the field.
   */
  public Date getStartDate() {
    
    return this.startDate;
    
  } // End getStartDate(). 
  
  
  /**
   * Set value of targetDate field.
   * 
   * @param inTargetDate New value of the field.
   */
  public void setTargetDate(final Date inTargetDate) {
	  
    this.targetDate = inTargetDate;
    
  } // End setTargetDate().

  
  /**
   * Get value of targetDate field.
   * 
   * @return Value of the field.
   */
  public Date getTargetDate() {
	  
    return this.targetDate;
    
  } // End getTargetDate().  
  
  
  /**
   * Set value of allocatedHours field.
   * 
   * @param inAllocatedHours New value of the field.
   */
  public void setAllocatedHours(final int inAllocatedHours) {
	  
    this.allocatedHours = inAllocatedHours;
    
  } // End setAllocatedHours().

  
  /**
   * Get value of allocatedHours field.
   * 
   * @return Value of the field.
   */
  public int getAllocatedHours() {
	  
    return this.allocatedHours;
    
  } // End getAllocatedHours().   

  
  /**
   * Set value of bookedHours field.
   * 
   * @param inBookedHours New value of the field.
   */
  public void setBookedHours(final int inBookedHours) {
	  
    this.bookedHours = inBookedHours;
    
  } // End setBookedHours().

  
  /**
   * Get value of bookedHours field.
   * 
   * @return Value of the field.
   */
  public int getBookedHours() {
	  
    return this.bookedHours;
    
  } // End getBookedHours().    
  
  
  /**
   * Set value of assignedResource field.
   * 
   * @param inAssignedResource New value of the field.
   */
  public void setAssignedResource(final String inAssignedResource) {
	  
    this.assignedResource = inAssignedResource;
    
  } // End setAssignedResource().

  
  /**
   * Get value of assignedResource field.
   * 
   * @return Value of the field.
   */
  public String getAssignedResource() {
	  
    return this.assignedResource;
    
  } // End getAssignedResource(). 
  
  
  /**
   * Overridden toString method.
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
