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
import java.util.Collection;
import java.util.logging.Logger;
import javax.jdo.JDOObjectNotFoundException;
import javax.jdo.PersistenceManager;
import javax.jdo.Query;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


/**
 * Servlet that handles operations on Resources.
 * 
 * @author <a href="mailto:fzammetti@etherient.com">Frank W. Zammetti</a>
 *
 */
@SuppressWarnings("serial")
public class ResourceServlet extends HttpServlet {


  /**
   * Log instance to use throughout.
   */
  private static final Logger log = 
    Logger.getLogger(ResourceServlet.class.getName());
    
  
  /**
   * Create a resource, or update an existing resource.  The portion of URL 
   * following /resource/ is the name of the resource to update if doing an 
   * update, or is nothing if creating a resource.  Returns an OkResponse object 
   * containing the name of the created or updated resource.  Accepts the  
   * following parameters:
   * 
   * name ................ Name of the resource.
   * isProjectManager .... "true" if the user is a project manager, "false"
   *                       if not. 
   * password ............ The password of the resource.
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

    String logPrefix = "Resource doPost(): ";
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
      
      // Get the name of the resource, if any.
      String requestURI = inRequest.getRequestURI();
      String nameString = requestURI.substring(requestURI.lastIndexOf("/") + 1);
      nameString = java.net.URLDecoder.decode(nameString, "UTF-8");
      log.info(logPrefix + "nameString = " + nameString);
      
      // If there's a name, then we're doing an update.
      Resource resource = null;
      if (nameString != null && !nameString.equalsIgnoreCase("") && 
        !nameString.equalsIgnoreCase("resource")) {
        // Retrieve Resource from storage.
        resource = persistenceManager.getObjectById(Resource.class, nameString);
        log.info(logPrefix + "resource(1) = " + resource);
        if (resource == null) {
          // Send ErrorResponse back to caller.
          inResponse.getWriter().print(
            js.serialize(new ErrorResponse(
              logPrefix + "No Resource with name " + nameString + " found")
            )
          );
        }
      }
      
      // Get incoming parameters.
      String name = (String)inRequest.getParameter("name");
      name = java.net.URLDecoder.decode(name, "UTF-8");
      String isProjectManager = 
        (String)inRequest.getParameter("isProjectManager");
      String password = (String)inRequest.getParameter("password");
      password = java.net.URLDecoder.decode(password, "UTF-8");
      log.info(logPrefix + "name = " + name);
      log.info(logPrefix + "isProjectManager = " + isProjectManager);
      log.info(logPrefix + "password = " + password);
      
      // Perform any necessary validations and conversions starting with Name.
      if (name == null || name.equalsIgnoreCase("")) {
        inResponse.getWriter().print(
          js.serialize(new ErrorResponse(
            logPrefix + "name must be specified"))
        );
        return;
      }
      // Is Project Manager.
      if (isProjectManager == null || 
        !isProjectManager.equalsIgnoreCase("true") &&
        !isProjectManager.equalsIgnoreCase("false")) {
        inResponse.getWriter().print(
            js.serialize(new ErrorResponse(
              logPrefix + "isProjectManager must be 'true' or 'false'"))
          );
          return;        
      }
      // Password.
      if (password == null || password.equalsIgnoreCase("")) {
        inResponse.getWriter().print(
          js.serialize(new ErrorResponse(
            logPrefix + "password must be specified"))
        );
        return;
      }      
      
      // Create the Resource if necessary, and populate it.
      if (resource == null) {
        log.info(logPrefix + "New Resource");
        resource = new Resource();
      }
      resource.setName(name);
      resource.setIsProjectManager(Boolean.parseBoolean(isProjectManager));
      resource.setPassword(password);      
      log.info(logPrefix + "resource(2) = " + resource);  
      
      // Write out the Resource.
      persistenceManager.makePersistent(resource);
      
      // Send OkResponse back to caller with the resources' name.
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
   * Retrieve a resource.  The Portion of URL following /resource/ is the name 
   * of the resource to retrieve.  A JSON string is returned representing the 
   * resource.  This can also be used to authenticate a resource.  If a 
   * password parameter is passed in then the resource will only be returned if 
   * it is valid (otherwise, an ErrorResponse is returned).
   * 
   * @param  inRequest   HttServletRequest object.
   * @param  inResponse  HttpServletResponse object.
   * @throws IOException If anything goes wrong.
   */
  @SuppressWarnings("unchecked")
  public void doGet(final HttpServletRequest inRequest,
  final HttpServletResponse inResponse) throws IOException {

    String logPrefix = "Resource doGet(): ";
    log.info(logPrefix + "Entry");    
    
    // Prepare for response output.  
    JSONSerializer js = new JSONSerializer().exclude("*.class");
    inResponse.setContentType("application/json");    
    
    PersistenceManager persistenceManager = null;    
    
    try {
    
      // Get the name of the requested resource.
      String requestURI = inRequest.getRequestURI();
      String nameString = requestURI.substring(requestURI.lastIndexOf("/") + 1);
      nameString = java.net.URLDecoder.decode(nameString, "UTF-8");
      log.info(logPrefix + "nameString = " + nameString);
      
      // Get PersistenceManager instance to use.
      persistenceManager = Utils.getPersistenceManager();
      
      // Retrieve multiple entities from storage.
      if (nameString.equalsIgnoreCase("all")) {
        
        Query query = persistenceManager.newQuery(Resource.class);
        Collection resources = (Collection)query.execute();
        log.info(logPrefix + "resources = " + resources);
        // Send entities back to caller.
        inResponse.getWriter().print(js.serialize(resources));
        
      // Retrieve a single Resource from storage.      
      } else {
        
        try {
          Resource resource = 
            persistenceManager.getObjectById(Resource.class, nameString);
          log.info(logPrefix + "resource = " + resource);
          // If this is an authentication request, check the password and
          // return an ErrorResponse if not correct.
          String password = (String)inRequest.getParameter("password");
          if (password != null && !password.equalsIgnoreCase("") &&
            !password.equalsIgnoreCase(resource.getPassword())) {
            inResponse.getWriter().print(
              js.serialize(new ErrorResponse(
                logPrefix + "Invalid password")
              )
            );
            return;
          }
          // Send Resource back to caller.
          inResponse.getWriter().print(js.serialize(resource));
        } catch (JDOObjectNotFoundException jonfe) {
          jonfe.printStackTrace();
          inResponse.getWriter().print(
            js.serialize(new ErrorResponse(
              logPrefix + "No Resource with name " + nameString + " found")
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
   * Delete a resource.  The Portion of URL following /resource/ is the name of 
   * the resource to delete.
   * 
   * @param  inRequest   HttServletRequest object.
   * @param  inResponse  HttpServletResponse object.
   * @throws IOException If anything goes wrong.
   */
  public void doDelete(final HttpServletRequest inRequest,
  final HttpServletResponse inResponse) throws IOException {

    String logPrefix = "Resource doDelete(): ";
    log.info(logPrefix + "Entry");       
    
    // Prepare for response output.  
    JSONSerializer js = new JSONSerializer().exclude("*.class");
    inResponse.setContentType("application/json");    
    
    PersistenceManager persistenceManager = null;
    
    try {
    
      // Get the name of the requested resource.
      String requestURI = inRequest.getRequestURI();
      String nameString = requestURI.substring(requestURI.lastIndexOf("/") + 1);
      nameString = java.net.URLDecoder.decode(nameString, "UTF-8");
      log.info(logPrefix + "nameString = " + nameString);

      // Get PersistenceManager instance to use.
      persistenceManager = Utils.getPersistenceManager();

      try {
        // Retrieve Resource from storage.
        Resource resource = 
          persistenceManager.getObjectById(Resource.class, nameString);
        log.info(logPrefix + "resource = " + resource);
        // Now delete it.
        persistenceManager.deletePersistent(resource);      
        // Send OkResponse back to caller with the resource's name.
        inResponse.getWriter().print(js.serialize(new OkResponse(nameString)));
      } catch (JDOObjectNotFoundException jonfe) {
        jonfe.printStackTrace();
        inResponse.getWriter().print(
          js.serialize(new ErrorResponse(
            logPrefix + "No Resource with name " + nameString + 
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
