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
 * Servlet that handles operations for Projects.
 * 
 * @author <a href="mailto:fzammetti@etherient.com">Frank W. Zammetti</a>
 *
 */
@SuppressWarnings("serial")
public class ProjectServlet extends HttpServlet {


  /**
   * Log instance to use throughout.
   */
  private static final Logger log = 
    Logger.getLogger(ProjectServlet.class.getName());

  
  /**
   * Create a project, or update an existing project.  The portion of URL 
   * following /project/ is the name of the project to update if doing an 
   * update, or is nothing if creating a project.  Returns an OkResponse object 
   * containing the name of the created or updated project.  Accepts the  
   * following parameters:
   * 
   * name ............ The name of the project.
   * startDate ....... The date the project starts on.
   * targetDate ...... The date the project is expected to be finished.
   * projectManager .. The name of the project manager of the project.
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

    String logPrefix = "Project doPost(): ";
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
      
      // Get the name of the project, if any.
      String requestURI = inRequest.getRequestURI();
      String nameString = requestURI.substring(requestURI.lastIndexOf("/") + 1);
      nameString = java.net.URLDecoder.decode(nameString, "UTF-8");
      log.info(logPrefix + "nameString = " + nameString);
      
      // If there's n name, then we're doing an update.
      Project project = null;
      if (nameString != null && !nameString.equalsIgnoreCase("") && 
        !nameString.equalsIgnoreCase("project")) {
        // Retrieve Project from storage.
        project = persistenceManager.getObjectById(Project.class, nameString);
        log.info(logPrefix + "project(1) = " + project);
        if (project == null) {
          // Send ErrorResponse back to caller.
          inResponse.getWriter().print(
            js.serialize(new ErrorResponse(
              logPrefix + "No Project with name " + nameString + " found")
            )
          );
        }
      }
      
      // Get incoming parameters.
      String name = (String)inRequest.getParameter("name");
      name = java.net.URLDecoder.decode(name, "UTF-8");
      String pStartDate = (String)inRequest.getParameter("startDate");
      String pTargetDate = (String)inRequest.getParameter("targetDate");
      String projectManager = (String)inRequest.getParameter("projectManager");
      projectManager = java.net.URLDecoder.decode(projectManager, "UTF-8");
      log.info(logPrefix + "name = " + name);
      log.info(logPrefix + "pStartDate = " + pStartDate);
      log.info(logPrefix + "pTargetDate = " + pTargetDate);
      log.info(logPrefix + "projectManager = " + projectManager);
      
      // Perform any necessary validations and conversions starting with Name.
      if (name == null || name.equalsIgnoreCase("")) {
        inResponse.getWriter().print(
          js.serialize(new ErrorResponse(
            logPrefix + "name must be specified"))
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
      // Project Manager.
      if (projectManager == null || projectManager.equalsIgnoreCase("")) {
        inResponse.getWriter().print(
          js.serialize(new ErrorResponse(
            logPrefix + "projectManager must be specified"))
        );
        return;
      }  
      
      // Create the Project if necessary, and populate it.
      if (project == null) {
        log.info(logPrefix + "New Project");
        project = new Project();
      }
      project.setName(name);
      project.setStartDate(startDate);
      project.setTargetDate(targetDate);
      project.setProjectManager(projectManager);
      log.info(logPrefix + "project(2) = " + project);  
      
      // Write out the Project.
      persistenceManager.makePersistent(project);
      
      // Send OkResponse back to caller with the projects' name.
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
   * Retrieve a project.  The portion of URL following /project/ is the name of 
   * the project to retrieve.  A JSON string is returned representing the 
   * project.
   * 
   * Can also return an ErrorResponse specifying error information if the
   * operation fails.
   * 
   * @param  inRequest   HttServletRequest object.
   * @param  inResponse  HttpServletResponse object.
   * @throws IOException If anything goes wrong.
   */
  @SuppressWarnings("unchecked")
  public void doGet(final HttpServletRequest inRequest,
    final HttpServletResponse inResponse) throws IOException {

    String logPrefix = "Project doGet(): ";
    log.info(logPrefix + "Entry");    
    
    // Prepare for response output.  
    JSONSerializer js = new JSONSerializer().exclude("*.class");
    inResponse.setContentType("application/json");    
    
    PersistenceManager persistenceManager = null;    
    
    try {
    
      // Get the name of the requested project.
      String requestURI = inRequest.getRequestURI();
      String nameString = requestURI.substring(requestURI.lastIndexOf("/") + 1);
      nameString = java.net.URLDecoder.decode(nameString, "UTF-8");
      log.info(logPrefix + "nameString = " + nameString);
      
      // If it's "all", then this is a request to retrieve all entities.
      // Otherwise, it is a name.
      
      // Get PersistenceManager instance to use.
      persistenceManager = Utils.getPersistenceManager();
      
      // Retrieve multiple entities from storage.
      if (nameString.equalsIgnoreCase("all")) {
        
        Query query = persistenceManager.newQuery(Project.class);
        Collection projects = (Collection)query.execute();
        log.info(logPrefix + "projects = " + projects);
        // Send entities back to caller.
        inResponse.getWriter().print(js.serialize(projects));
        
      // Retrieve a single Project from storage.      
      } else {
        
        try {
          Project project = 
            persistenceManager.getObjectById(Project.class, nameString);
          log.info(logPrefix + "project = " + project);
          // Send Project back to caller.
          inResponse.getWriter().print(js.serialize(project));
        } catch (JDOObjectNotFoundException jonfe) {
          jonfe.printStackTrace();
          inResponse.getWriter().print(
            js.serialize(new ErrorResponse(
              logPrefix + "No Project with name " + nameString + " found")
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
   * Delete a project.  The portion of URL following /project/ is the name of 
   * the project to delete.  Returns an OkResponse object containing the
   * name of the deleted project.
   * 
   * Can also return an ErrorResponse specifying error information if the
   * operation fails.
   * 
   * @param  inRequest   HttServletRequest object.
   * @param  inResponse  HttpServletResponse object.
   * @throws IOException If anything goes wrong.
   */
  public void doDelete(final HttpServletRequest inRequest,
  final HttpServletResponse inResponse) throws IOException {
    
    String logPrefix = "Project doDelete(): ";
    log.info(logPrefix + "Entry");       
    
    // Prepare for response output.  
    JSONSerializer js = new JSONSerializer().exclude("*.class");
    inResponse.setContentType("application/json");    
    
    PersistenceManager persistenceManager = null;
    
    try {
    
      // Get the name of the requested project.
      String requestURI = inRequest.getRequestURI();
      String nameString = requestURI.substring(requestURI.lastIndexOf("/") + 1);
      nameString = java.net.URLDecoder.decode(nameString, "UTF-8");
      log.info(logPrefix + "nameString = " + nameString);
      
      // Get PersistenceManager instance to use.
      persistenceManager = Utils.getPersistenceManager();

      try {
        // Retrieve Project from storage.
        Project project = 
          persistenceManager.getObjectById(Project.class, nameString);
        log.info(logPrefix + "project = " + project);
        // Now delete it.
        persistenceManager.deletePersistent(project);      
        // Send OkResponse back to caller with the project's name.
        inResponse.getWriter().print(js.serialize(new OkResponse(nameString)));
      } catch (JDOObjectNotFoundException jonfe) {
        jonfe.printStackTrace();
        inResponse.getWriter().print(
          js.serialize(new ErrorResponse(
            logPrefix + "No Project with name " + nameString + 
              " found for delete")
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


