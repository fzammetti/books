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


import flexjson.JSONSerializer;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Collection;
import java.util.Date;
import java.util.logging.Logger;
import javax.jdo.JDOObjectNotFoundException;
import javax.jdo.PersistenceManager;
import javax.jdo.Query;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


/**
 * Servlet that handles operations on Tasks.
 * 
 * @author <a href="mailto:fzammetti@etherient.com">Frank W. Zammetti</a>
 *
 */
@SuppressWarnings("serial")
public class TaskServlet extends HttpServlet {


  /**
   * Log instance to use throughout.
   */
  private static final Logger log = 
    Logger.getLogger(TaskServlet.class.getName());
    
  
  /**
   * Create a task, or update an existing task.  The portion of URL 
   * following /task/ is the name of the task to update if doing an update,
   * or is nothing if creating a task.  Returns an OkResponse object 
   * containing the name of the created or updated resource.  Accepts the  
   * following parameters:
   * 
   * project ........... The name of the project this task is attached to.
   * name .............. The name of the task.
   * startDate ......... The date the task starts on.
   * targetDate ........ The date the task is expected to be finished.
   * allocatedHours .... The number of hours allocated for this task.
   * bookedHours ....... The number of hours booked to this task.  This is only
   *                     used if doing an update.
   * assignedResource .. The name of the resource assigned to this task.
   *
   * Note that for an update, it is assumed that ALL of these parameters are
   * present, even those that are not changing, so the called needs to send the
   * existing values for attributes that aren't changing.
   * 
   * Can also return an ErrorResponse specifying error information if the
   * operation fails.
   *   
   * @param  inRequest   HttServletRequest object.
   * @param  inResponse  HttpServletResponse object.
   * @throws IOException If anything goes wrong.
   */
  public void doPost(final HttpServletRequest inRequest,
  final HttpServletResponse inResponse) throws IOException {

    String logPrefix = "Task doPost(): ";
    log.info(logPrefix + "Entry");
    
    // Because the Prototype JS library sends DELETE method requests as POSTs
    // with an added _method parameter, we have to check for that here and
    // call the doDelete() method explicitly in that case.
    String _method = (String)inRequest.getParameter("_method");
    if (_method != null && _method.equalsIgnoreCase("delete")) {
      log.info("Redirecting to doDelete()");
      doDelete(inRequest, inResponse);
    }    
    
    // Prepare for response output.
    JSONSerializer js = new JSONSerializer().exclude("*.class");
    inResponse.setContentType("application/json");  
    
    PersistenceManager persistenceManager = null;
    
    try {
      
      // Get PersistenceManager instance to use.
      persistenceManager = Utils.getPersistenceManager();
      
      // Get the name of the task, if any.
      String requestURI = inRequest.getRequestURI();
      String nameString = requestURI.substring(requestURI.lastIndexOf("/") + 1);
      nameString = java.net.URLDecoder.decode(nameString, "UTF-8");
      log.info(logPrefix + "nameString = " + nameString);
      
      // If there's a name, then we're doing an update.
      Task task = null;
      if (nameString != null && !nameString.equalsIgnoreCase("") && 
        !nameString.equalsIgnoreCase("task")) {
        // Retrieve Task from storage.
        task = persistenceManager.getObjectById(Task.class, nameString);
        log.info(logPrefix + "task(1) = " + task);
        if (task == null) {
          // Send ErrorResponse back to caller.
          inResponse.getWriter().print(
            js.serialize(new ErrorResponse(
              logPrefix + "No Task with name " + nameString + " found")
            )
          );
        }
      }
      
      // Get incoming parameters.
      String name = (String)inRequest.getParameter("name");
      name = java.net.URLDecoder.decode(name, "UTF-8");
      String project = (String)inRequest.getParameter("project");
      project = java.net.URLDecoder.decode(project, "UTF-8");
      String pStartDate = (String)inRequest.getParameter("startDate");      
      String pTargetDate = (String)inRequest.getParameter("targetDate");
      String pAllocatedHours = (String)inRequest.getParameter("allocatedHours");
      String pBookedHours = (String)inRequest.getParameter("bookedHours"); 
      String assignedResource = 
        (String)inRequest.getParameter("assignedResource");
      assignedResource = java.net.URLDecoder.decode(assignedResource, "UTF-8");
      log.info(logPrefix + "name = " + name);
      log.info(logPrefix + "project = " + project);
      log.info(logPrefix + "pStartDate = " + pStartDate);      
      log.info(logPrefix + "pTargetDate = " + pTargetDate);
      log.info(logPrefix + "pAllocatedHours = " + pAllocatedHours);
      log.info(logPrefix + "pBooked = " + pBookedHours);
      log.info(logPrefix + "assignedResource = " + assignedResource);
      
      // Perform any necessary validations and conversions starting with Name.
      if (name == null || name.equalsIgnoreCase("")) {
        inResponse.getWriter().print(
          js.serialize(new ErrorResponse(
            logPrefix + "name must be specified"))
        );
        return;
      }
      // Project.
      if (project == null || project.equalsIgnoreCase("")) {
        inResponse.getWriter().print(
          js.serialize(new ErrorResponse(
            logPrefix + "project must be specified"))
        );
        return;
      }
      // Start Date.  If none, put in a dummy string to avoid NPEs.
      Date startDate = null;
      if (pStartDate == null) {
        pStartDate = "none";
      }
      try {
        startDate = new SimpleDateFormat("MM/dd/yyyy").parse(pStartDate);
      } catch (ParseException pe) {
        pe.printStackTrace();
        inResponse.getWriter().print(
          js.serialize(new ErrorResponse(
            logPrefix + "startDate must be in the form MM/dd/yyyy")
          )
        );
        return;     
      }        
      // Target Date.  If none, put in a dummy string to avoid NPEs.
      Date targetDate = null;
      if (pTargetDate == null) {
        pTargetDate = "none";
      }
      try {
        targetDate = new SimpleDateFormat("MM/dd/yyyy").parse(pTargetDate);
      } catch (ParseException pe) {
        pe.printStackTrace();
        inResponse.getWriter().print(
          js.serialize(new ErrorResponse(
            logPrefix + "targetDate must be in the form MM/dd/yyyy")
          )
        );
        return;     
      }      
      // Allocated Hours.
      int allocatedHours = -1;
      try {
        allocatedHours = new Integer(pAllocatedHours).intValue();
      } catch (NumberFormatException nfe) {
        nfe.printStackTrace();
        inResponse.getWriter().print(
          js.serialize(new ErrorResponse(
            logPrefix + "allocatedHours must be a numeric value")
          )
        );
        return;     
      }        
      // Booked Hours.
      int bookedHours = 0;
      if (task != null) {
        try {
          bookedHours = new Integer(pBookedHours).intValue();
        } catch (NumberFormatException nfe) {
          nfe.printStackTrace();
          inResponse.getWriter().print(
            js.serialize(new ErrorResponse(
              logPrefix + "bookedHours must be a numeric value")
            )
          );
          return;     
        }
      }
      // Assigned Resource.
      if (assignedResource == null || assignedResource.equalsIgnoreCase("")) {
        inResponse.getWriter().print(
          js.serialize(new ErrorResponse(
            logPrefix + "assignedResource must be specified"))
        );
        return;
      }      
      
      // Create the Task if necessary, and populate it.
      if (task == null) {
        log.info(logPrefix + "New Task");
        task = new Task();
        task.setBookedHours(0);
      } else {
        task.setBookedHours(bookedHours + task.getBookedHours());
      }
      task.setName(name);
      task.setProject(project);
      task.setStartDate(startDate);
      task.setTargetDate(targetDate);
      task.setAllocatedHours(allocatedHours);
      task.setAssignedResource(assignedResource);
      log.info(logPrefix + "task(2) = " + task);  
      
      // Write out the Task.
      persistenceManager.makePersistent(task);
      
      // Send OkResponse back to caller with the tasks' nam.
      inResponse.getWriter().print(js.serialize(new OkResponse(name)));    

    // Handle any exceptions that aren't handled explicitly elsewhere.
    } catch (Exception e) {
      e.printStackTrace();
      inResponse.getWriter().print(
        js.serialize(new ErrorResponse(
          logPrefix + "Unexpected Exception: " + e)
        )
      );      
      return;
    } finally {
      // Close PersistenceManager.
      if (persistenceManager != null) {
        persistenceManager.close();
      }
    }        
      
    log.info(logPrefix + "Exit");    
    
  } // End doPost().  
  
  
  /**
   * Retrieve a task.  The Portion of URL following /task/ is the name of 
   * the task to retrieve.  A JSON string is returned representing the 
   * task.
   * 
   * @param  inRequest   HttServletRequest object.
   * @param  inResponse  HttpServletResponse object.
   * @throws IOException If anything goes wrong.
   */
  @SuppressWarnings("unchecked")
  public void doGet(final HttpServletRequest inRequest,
  final HttpServletResponse inResponse) throws IOException {

    String logPrefix = "Task doGet(): ";
    log.info(logPrefix + "Entry");    
    
    // Prepare for response output.  
    JSONSerializer js = new JSONSerializer().exclude("*.class");
    inResponse.setContentType("application/json");    
    
    PersistenceManager persistenceManager = null;    
    
    try {
    
      // Get the name of the requested task.
      String requestURI = inRequest.getRequestURI();
      String nameString = requestURI.substring(requestURI.lastIndexOf("/") + 1);
      nameString = java.net.URLDecoder.decode(nameString, "UTF-8");
      log.info(logPrefix + "nameString = " + nameString);
      
      // Get PersistenceManager instance to use.
      persistenceManager = Utils.getPersistenceManager();
      
      // Retrieve multiple entities from storage.
      if (nameString.equalsIgnoreCase("all")) {
        
        Query query = persistenceManager.newQuery(Task.class);
        Collection tasks = (Collection)query.execute();
        log.info(logPrefix + "tasks = " + tasks);
        // Send entities back to caller.
        inResponse.getWriter().print(js.serialize(tasks));
        
      // Retrieve a single Task from storage.      
      } else {
        
        try {
          Task task = persistenceManager.getObjectById(Task.class, nameString);
          log.info(logPrefix + "task = " + task);
          // Send Task back to caller.
          inResponse.getWriter().print(js.serialize(task));
        } catch (JDOObjectNotFoundException jonfe) {
          jonfe.printStackTrace();
          inResponse.getWriter().print(
            js.serialize(new ErrorResponse(
              logPrefix + "No Task with name " + nameString + " found")
            )
          );
        }
        
      }
      
    // Handle any exceptions that aren't handled explicitly elsewhere.
    } catch (Exception e) {
      e.printStackTrace();
      inResponse.getWriter().print(
        js.serialize(new ErrorResponse(
          logPrefix + "Unexpected Exception: " + e)
        )
      );      
      return;
    } finally {
      // Close PersistenceManager.
      if (persistenceManager != null) {
        persistenceManager.close();
      }
    }        
      
    log.info(logPrefix + "Exit");         
    
  } // End doGet().

  
  /**
   * Delete a task.  The Portion of URL following /task/ is the name of 
   * the task to delete.
   * 
   * @param  inRequest   HttServletRequest object.
   * @param  inResponse  HttpServletResponse object.
   * @throws IOException If anything goes wrong.
   */
  public void doDelete(final HttpServletRequest inRequest,
  final HttpServletResponse inResponse) throws IOException {
    
    String logPrefix = "Task doDelete(): ";
    log.info(logPrefix + "Entry");       
    
    // Prepare for response output.  
    JSONSerializer js = new JSONSerializer().exclude("*.class");
    inResponse.setContentType("application/json");    
    
    PersistenceManager persistenceManager = null;
    
    try {
    
      // Get the name of the requested task.
      String requestURI = inRequest.getRequestURI();
      String nameString = requestURI.substring(requestURI.lastIndexOf("/") + 1);
      nameString = java.net.URLDecoder.decode(nameString, "UTF-8");
      log.info(logPrefix + "nameString = " + nameString);
      
      // Get PersistenceManager instance to use.
      persistenceManager = Utils.getPersistenceManager();

      try {
        // Retrieve Task from storage.
        Task task = persistenceManager.getObjectById(Task.class, nameString);
        log.info(logPrefix + "task = " + task);
        // Now delete it.
        persistenceManager.deletePersistent(task);      
        // Send OkResponse back to caller with the task's name.
        inResponse.getWriter().print(js.serialize(new OkResponse(nameString)));
      } catch (JDOObjectNotFoundException jonfe) {
        jonfe.printStackTrace();
        inResponse.getWriter().print(
          js.serialize(new ErrorResponse(
            logPrefix + "No Task with name " + nameString + " found for delete")
          )
        );
      }              
      
    // Handle any exceptions that aren't handled explicitly elsewhere.
    } catch (Exception e) {
      e.printStackTrace();
      inResponse.getWriter().print(
        js.serialize(new ErrorResponse(
          logPrefix + "Unexpected Exception: " + e)
        )
      );      
      return;
    } finally {
      // Close PersistenceManager.
      if (persistenceManager != null) {
        persistenceManager.close();
      }
    }        
      
    log.info(logPrefix + "Exit");           
    
  } // End doDelete().

  
  // TODO: Implement PUT as an update.
  
   
} // End class.
