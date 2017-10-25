/*
    Time Tracker - From the book "Practical webOS Projects With the Palm Pre"
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


/**
 * The DAO class provides a clean API for storing, retrieving, deleting and
 * updating data entities.
 */
function DAO() {


  /**
   * Reference to the opened database.  Note that opening the database more
   * than once during the same program execution seems to be a 
   * Very Bad Thing(tm) when the app is run on a real device, hence the reason 
   * it will be done once in init() and a reference held to it in this field (it
   * works if you continually open it on the emulator though).
   */
  this.db = null;


  /**
   * The name of the SQLite database the application will be using.
   */
  this.databaseName = "TimeTracker";


  /**
   * SQL statements for the operations dealing with warehousing of projects.
   */
  this.sqlCreateTable_projects = "CREATE TABLE IF NOT EXISTS projects (" +
    "name TEXT, startDate TEXT, targetDate TEXT, projectManager TEXT); GO;";
  this.sqlCreate_project = "INSERT INTO projects (name, startDate, " +
    "targetDate, projectManager) VALUES (?, ?, ?, ?); GO;";
  this.sqlRetrieve_project = "SELECT * FROM projects WHERE name=?; GO;";    
  this.sqlRetrieve_projects = "SELECT * FROM projects; GO;";
  this.sqlUpdate_project = "UPDATE projects SET name=?, startDate=?, " +
    "targetDate=?, projectManager=? WHERE name=?; GO;";
  this.sqlDelete_project = "DELETE FROM projects WHERE name=?; GO;";


  /**
   * SQL statements for the operations dealing with warehousing of tasks.
   */ 
  this.sqlCreateTable_tasks = "CREATE TABLE IF NOT EXISTS tasks (" +
    "project TEXT, name TEXT, startDate TEXT, targetDate TEXT, " +
    "allocatedHours TEXT, bookedHours TEXT, assignedResource TEXT); GO;";
  this.sqlCreate_task = "INSERT INTO tasks (project, name, " +
    "startDate, targetDate, allocatedHours, bookedHours, assignedResource) " +
    "VALUES (?, ?, ?, ?, ?, ?, ?); GO;";
  this.sqlRetrieve_task = "SELECT * FROM tasks WHERE name=?; GO;";
  this.sqlRetrieve_tasks = "SELECT * FROM tasks; GO;";
  this.sqlUpdate_task = "UPDATE tasks SET project=?, name=?, startDate=?, " +
    "targetDate=?, allocatedHours=?, bookedHours=?, assignedResource " +
    "WHERE name=?; GO;";
  this.sqlDelete_task = "DELETE FROM tasks WHERE name=?; GO;";
  this.sqlDeleteForProject_task = "DELETE FROM tasks WHERE project=?; GO;";


  /**
   * SQL statements for the operations dealing with warehousing of resources.
   */
  this.sqlCreateTable_resources = "CREATE TABLE IF NOT EXISTS resources (" +
    "name TEXT, isProjectManager TEXT, password TEXT); GO;";
  this.sqlCreate_resource = "INSERT INTO resources (name, " +
    "isProjectManager, password) VALUES (?, ?, ?); GO;";
  this.sqlUpdate_resource = "UPDATE resources SET name=?, " +
    "isProjectManager=?, password=? WHERE name=?; GO;";
  this.sqlRetrieve_resource = "SELECT * FROM resources WHERE name=?; GO;";    
  this.sqlRetrieve_resources = "SELECT * FROM resources; GO;";
  this.sqlDelete_resource = "DELETE FROM resources WHERE name=?; GO;";
    

  /**
   * Initialize the DAO.
   *
   * @return null if initialization was successful, an exception object if
             anything goes wrong.
   *
   */
  this.init = function() {

    dao.db = openDatabase(dao.databaseName, "", dao.databaseName, 65536);
    dao.db.transaction((function (inTransaction) {

      /*
      // Uncomment this block to recreate the local database.
      inTransaction.executeSql("drop table projects", [], function() { }, 
      function() {
      Mojo.Log.error("#### COULD NOT DROP PROJECTS TABLE");
      }
      );
      inTransaction.executeSql("drop table tasks", [], function() { }, 
      function() {
      Mojo.Log.error("#### COULD NOT DROP TASKS TABLE");
      }
      );
      inTransaction.executeSql("drop table resources", [], function() { }, 
      function() {
      Mojo.Log.error("#### COULD NOT DROP RESOURCES TABLE");
      }
      );
      */
      inTransaction.executeSql(dao.sqlCreateTable_projects, [], 
        function() {
          Mojo.Log.error("#### PROJECTS TABLE CREATED (OR LEFT ALONE)"); 
        }, 
        function() {
          Mojo.Log.error("#### COULD NOT CREATE PROJECTS TABLE");
        }
      ); 
      inTransaction.executeSql(dao.sqlCreateTable_tasks, [],
        function() {
          Mojo.Log.error("#### TASKS TABLE CREATED (OR LEFT ALONE)"); 
        }, 
        function() {
          Mojo.Log.error("#### COULD NOT CREATE TASKS TABLE");
        }
      ); 
      inTransaction.executeSql(dao.sqlCreateTable_resources, [],
        function() {
          Mojo.Log.error("#### RESOURCES TABLE CREATED (OR LEFT ALONE)"); 
        },        
        function() {
          Mojo.Log.error("#### COULD NOT CREATE RESOURCES TABLE");
        }
      );         
    }));

  }; // End init().

  
  /**
   * Called to save an entity.  The save will go to the remote service, but if
   * that fails then it will be saved in the local warehouse database.
   *
   * @param inType            The type of entity being created: "project", 
   *                          "task" or "resource".
   * @param inEntity          The entity object.
   * @param inCallback        The function to call back.  This will be called on
   *                          success or failure.
   * @param inSaveToWarehouse Pass true to save to the warehouse database.  This
   *                          should only be done for a failure or exception
   *                          when calling the remote service.
   */
  this.create = function(inType, inEntity, inCallback, inSaveToWarehouse) {

    if (inSaveToWarehouse) {

      // Construct the proper array of paramters for the SQL statement.
      var sqlParams = [ ];
      if (inType == "project") {
        sqlParams.push(inEntity.name);
        sqlParams.push(inEntity.startDate);
        sqlParams.push(inEntity.targetDate);
        sqlParams.push(inEntity.projectManager);
      }
      if (inType == "task") {
        sqlParams.push(inEntity.project);
        sqlParams.push(inEntity.name);
        sqlParams.push(inEntity.startDate);
        sqlParams.push(inEntity.targetDate);
        sqlParams.push(inEntity.allocatedHours);
        sqlParams.push(inEntity.assignedResource);
      }
      if (inType == "resource") {
        sqlParams.push(inEntity.name);
        sqlParams.push(inEntity.isProjectManager);
        sqlParams.push(inEntity.password);
      }      

      // This code only executes if the server-side interaction fails.
      dao.db.transaction((function (inTransaction) { 
        inTransaction.executeSql(dao["sqlCreate_" + inType], sqlParams, 
          function() {
            // Database save successful, return an object with a message to
            // be displayed.
            inCallback({ 
              responseJSON : {
                msg : "The " + inType + " was saved to the local warehouse " +
                  "because the remote operation failed.  " +
                  "Synchronization will be attempted in the background."
              }
            });
          }, 
          function(inTransaction, inError) {
            Mojo.Log.error("DAO ERROR - create:(" + inError.code + ") : " + 
              inError.message);
            // Database save failed, return an object with a message to
            // be displayed.
            inCallback({ 
              responseJSON : { 
                error : "An error occurred while saving the " + inType + " " + 
                  "to the local warehouse after a failure occurred during " +
                  "the remote operation.  This is typically an " +
                  "unrecoverable error, although you can try the operation " +
                  "again if you wish, you might get lucky!"
              }
            });
          }
        ); 
      }));

    } else {

      new Ajax.Request(timeTracker.apiURL + inType + "/", {
        /* Configuration options. */
        method : "post", evalJSON : "force",
        /* Parameters for the call. */    
        parameters : inEntity,
        /* Success handler. */    
        onSuccess : inCallback,
        /* Failure handler. */
        onFailure : function(inTransport) {
          dao.create(inType, inEntity, inCallback, true);
        }
      }); // End AJAX request. 
  
    }     

  }; // End create().


  /**
   * Retrieves one or more entities.  Entities will be retrieved from the
   * remote service, if available, as well as the warehouse.
   *
   * @param inType      The type of entity being retrieved: "project", 
   *                    "task" or "resource".
   * @param inCallback  A callback function that will be called when the 
   *                    data is loaded.  This function will be passed an  
   *                    array of entity objects.  The array can be empty, but
   *                    null will never be returned.  If any failures
   *                    occur, an object is passed to inCallback that contains 
   *                    an error element with the failure message.  
   * @param inName      Pass a name to retrieve a specific entity, or null to
   *                    retrieve them all.
   * @param inPassword  Only needed when authenticating a user, which is just a
   *                    retrieval with the addition of the password parameter.
   *                    
   */
  this.retrieve = function(inType, inCallback, inName, inPassword) {

    // If no name is passed, then append "all" onto the URL, otherwise append
    // the name passed in.
    if (inName == null) { inName = "all"; }

    // Call parameters.  Add password if authenticating a user.
    var params = { };
    if (inPassword) {
      params.password = inPassword;
    }

    new Ajax.Request(timeTracker.apiURL + inType + "/" + inName, {
      /* Configuration options. */
      method : "get", evalJSON : "force",
      /* Parameters for the call. */    
      parameters : params,
      /* Success handler. */    
      onSuccess : function(inTransport) {
        // If this was an authentication request, return a special response
        // now and finish up. 
        if (params.password) {
          if (inTransport.responseJSON.error) {
            inCallback();
            return;
          } else {
            inCallback(inTransport.responseJSON);
          }
        }
        // Create results array from server results.
        var results = [ ];
        for (var i = 0; i < inTransport.responseJSON.length; i++) {
          results.push(inTransport.responseJSON[i]);
        }
        // Now retrieve any warehoused items.
        dao.db.transaction((function (inTransaction) {
          var plurality = "";
          var sqlParams = [ ];
          if (inName == "all") {
            // Retrieving all, so the correct SQL statement is sqlRetrieve_XXXs. 
            plurality = "s"; 
          } else {
            // Only retrieving one, so we need the name.
            sqlParams.push(inName);
          }
          inTransaction.executeSql(dao["sqlRetrieve_" + inType + plurality], 
            sqlParams,
            function(inTransaction, inResultSet) {
              if (inResultSet.rows) {
                for (var i = 0; i < inResultSet.rows.length; i++) {
                  results.push(inResultSet.rows.item(i));
                }
              }        
              inCallback(results);
            }, 
            function(inTransaction, inError) {
              Mojo.Log.error("DAO ERROR - retrieve:(" + inError.code + ") : " + 
                inError.message);
              // DB problem, return an error object.
              inCallback({ responseJSON : {
                error : "Error retrieving data from warehouse: " +
                  inError.code + " - " + inError.message
              }});
            }
          ); 
        }));  
      },
      /* Failure handler. */
      onFailure : function(inTransport) {
        if (inTransport.responseJSON) {
          inCallback(inTransprt);
        } else {
          inCallback({ responseJSON : {
            error : "Unknown AJAX failure: " + inTransport.status + " (" +
              inTransport.request.url + ")"
          }});
        }
      }
    }); // End AJAX request.

  }; // End retrieveProjects().


  /**
   * Called to update an entity.  The save will go to the remote service, but if
   * that fails then it will be saved in the local warehouse database.
   *
   * @param inType            The type of entity being created: "project", 
   *                          "task" or "resource".
   * @param inEntity          The entity object.
   * @param inCallback        The function to call back.  This will be called on
   *                          success or failure.
   * @param inSaveToWarehouse Pass true to save to the warehouse database.  This
   *                          should only be done for a failure or exception
   *                          when calling the remote service.
   */
  this.update = function(inType, inEntity, inCallback, inSaveToWarehouse) {

    if (inSaveToWarehouse) {

      // Construct the proper array of paramters for the SQL statement.
      var sqlParams = [ ];
      if (inType == "project") {
        sqlParams.push(inEntity.name);
        sqlParams.push(inEntity.startDate);
        sqlParams.push(inEntity.targetDate);
        sqlParams.push(inEntity.projectManager);
      }
      if (inType == "task") {
        sqlParams.push(inEntity.project);
        sqlParams.push(inEntity.name);
        sqlParams.push(inEntity.startDate);
        sqlParams.push(inEntity.targetDate);
        sqlParams.push(inEntity.allocatedHours);
        sqlParams.push(inEntity.bookedHours);
        sqlParams.push(inEntity.assignedResource);
      }
      if (inType == "resource") {
        sqlParams.push(inEntity.name);
        sqlParams.push(inEntity.isProjectManager);
        sqlParams.push(inEntity.password);
      }      

      // This code only executes if the server-side interaction fails.
      dao.db.transaction((function (inTransaction) { 
        inTransaction.executeSql(dao["sqlUpdate_" + inType], sqlParams, 
          function() {
            // Database save successful, return an object with a message to
            // be displayed.
            inCallback({ 
              responseJSON : {
                msg : "The " + inType + " was saved to the local warehouse " +
                  "because the remote operation failed.  " +
                  "Synchronization will be attempted in the background."
              }
            });
          }, 
          function(inTransaction, inError) {
            Mojo.Log.error("DAO ERROR - update:(" + inError.code + ") : " + 
              inError.message);
            // Database save failed, return an object with a message to
            // be displayed.
            inCallback({ 
              responseJSON : { 
                error : "An error occurred while saving the " + inType + " " + 
                  "to the local warehouse after a failure occurred during " +
                  "the remote operation.  This is typically an " +
                  "unrecoverable error, although you can try the operation " +
                  "again if you wish, you might get lucky!"
              }
            });
          }
        ); 
      }));

    } else {

      new Ajax.Request(timeTracker.apiURL + inType + "/" + inEntity.name, {
        /* Configuration options. */
        method : "post", evalJSON : "force",
        /* Parameters for the call. */    
        parameters : inEntity,
        /* Success handler. */    
        onSuccess : inCallback,
        /* Failure handler. */
        onFailure : function(inTransport) {
          dao.update(inType, inEntity, inCallback, true);
        }
      }); // End AJAX request. 
  
    }     

  }; // End update().
  
  
  /**
   * Called to delete an entity.  The delete will be done on both the remote
   * server and the local database.
   *
   * @param inType            The type of entity being created: "project", 
   *                          "task" or "resource".
   * @param inName            The name of the entity to delete.
   */
  this.deleteEntity = function(inType, inName) {

    // Delete from local database.
    dao.db.transaction((function (inTransaction) { 
      inTransaction.executeSql(dao["sqlDelete_" + inType], [ inName ], 
        function() { }, 
        function(inTransaction, inError) { 
          Mojo.Controller.errorDialog("Delete from the local database failed");
        }
      ); 
    }));

    // Delete from remote server database.
    new Ajax.Request(timeTracker.apiURL + inType + "/" + inName, {
      /* Configuration options. */
      method : "delete", evalJSON : "force",
      /* Parameters for the call. */    
      parameters : { },
      /* Success handler. */    
      onSuccess : function () { },
      /* Failure handler. */
      onFailure : function(inTransport) {
        Mojo.Controller.errorDialog("Delete from the remote database failed");
      }
    }); 

  }; // End deleteEntity().
    

}; // End DAO class.


// One instance to rule them all.
var dao = new DAO();
