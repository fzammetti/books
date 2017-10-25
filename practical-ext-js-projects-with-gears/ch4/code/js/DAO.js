/*
    OrganizerExt - From the book "Practical Ext JS Projects With Gears"
    Copyright (C) 2008 Frank W. Zammetti
    fzammetti@omnytex.com

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see http://www.gnu.org/licenses.
*/


/**
 * The DAO class provides a clean API for storing, retrieving, deleting and
 * updating projects, resources and tasks in the underlying Gears database
 * for the TimekeeperExt application.
 */
function DAO() {


  /**
   * The name of the Gears database the application will be using.
   */
  var databaseName = "TimekeeperExt";


  /**
   * SQL statements for the operations dealing with projects.
   */
  var sqlCreateProjectsTable = "CREATE TABLE IF NOT EXISTS projects (" +
    "name TEXT, description TEXT, projectmanager TEXT, " +
    "startdate TEXT, enddate TEXT, allocatedhours INT)"
  var sqlCreateProject =
    "INSERT INTO projects (name, description, projectmanager, " +
    "startdate, enddate, allocatedhours) VALUES (?, ?, ?, ?, ?, ?)";
  var sqlRetrieveProjects = "SELECT * FROM projects";
  var sqlUpdateProject = "UPDATE projects SET description=?, " +
    "projectmanager=?, startdate=?, enddate=?, allocatedhours=? " +
    "WHERE name=?";
  var sqlDeleteProject = "DELETE FROM projects WHERE name=?";


  /**
   * SQL statements for the operations dealing with tasks.
   */
  var sqlCreateTasksTable = "CREATE TABLE IF NOT EXISTS tasks (" +
    "name TEXT, description TEXT, startdate TEXT, enddate TEXT, " +
    "allocatedhours INT, resource TEXT, project TEXT, bookedtime INT, " +
    "percentcomplete INT)"
  var sqlCreateTask = "INSERT INTO tasks (name, description, startdate, " +
    "enddate, allocatedhours, resource, project, bookedtime, " +
    "percentcomplete) VALUES (?, ?, ?, ?, ?, '', '', 0, 0)";
  var sqlRetrieveTasks = "SELECT * FROM tasks";
  var sqlUpdateTask = "UPDATE tasks SET description=?, startdate=?, " +
    "enddate=?, allocatedhours=?, resource=?, project=?, " +
    "bookedtime=?, percentcomplete=? WHERE name=?";
  var sqlDeleteTask = "DELETE FROM tasks WHERE name=?";


  /**
   * SQL statements for the operations dealing with resources.
   */
  var sqlCreateResourcesTable = "CREATE TABLE IF NOT EXISTS resources (" +
    "name TEXT, description TEXT, isaprojectmanager TEXT)"
  var sqlCreateResource =
    "INSERT INTO resources (name, description, isaprojectmanager) " +
    "VALUES (?, ?, ?)";
  var sqlRetrieveResources = "SELECT * FROM resources";
  var sqlUpdateResource = "UPDATE resources SET description=?, " +
    "isaprojectmanager=? WHERE name=?";
  var sqlDeleteResource = "DELETE FROM resources WHERE name=?";


  /**
   * Initialize the DAO.
   */
  this.init = function() {

    if (!window.google || !google.gears) {
      return false;
    }

    // Create tables, if necessary.
    var db = google.gears.factory.create("beta.database");
    db.open(databaseName);
    db.execute(sqlCreateProjectsTable);
    db.execute(sqlCreateTasksTable);
    db.execute(sqlCreateResourcesTable);
    db.close();

    return true;

  } // End init().


  /**
   * Called to create a project record in the projects table in the database.
   *
   * @param inRecord A ProjectRecord instance.
   */
  this.createProject = function(inRecord) {

    // Write it out
    var db = google.gears.factory.create("beta.database");
    db.open(databaseName);
    db.execute(sqlCreateProject, [
      inRecord.get("name"), inRecord.get("description"),
      inRecord.get("projectmanager"), inRecord.get("startdate"),
      inRecord.get("enddate"), parseInt(inRecord.get("allocatedhours"))
    ]);
    db.close();

  } // End createProject().


  /**
   * Retrieves one or more projects.
   *
   * @return An array of ProjectRecord objects.  The array can be empty, but
   *         null will never be returned.
   */
  this.retrieveProjects = function() {

    // Open database and execute query.
    var db = google.gears.factory.create("beta.database");
    db.open(databaseName);
    var rs = db.execute(sqlRetrieveProjects);

    // Iterate over results, adding to results array.
    var results = [ ];
    while (rs.isValidRow()) {
      results.push(new ProjectRecord({
        name : rs.fieldByName("name"),
        description : rs.fieldByName("description"),
        projectmanager : rs.fieldByName("projectmanager"),
        startdate : rs.fieldByName("startdate"),
        enddate : rs.fieldByName("enddate"),
        allocatedhours : parseInt(rs.fieldByName("allocatedhours"))
      }, rs.fieldByName("name")));
      rs.next();
    }
    rs.close();
    db.close();

    // Return matches, or an empty array if none.
    return results;

  } // End retrieveProjects().


  /*
   * Updates an existing project.
   *
   * @param inRecord The ProjectRecord to be updated in the database.
   */
  this.updateProject = function(inRecord) {

    var db = google.gears.factory.create("beta.database");
    db.open(databaseName);
    db.execute(sqlUpdateProject, [
      inRecord.get("description"), inRecord.get("projectmanager"),
      inRecord.get("startdate"), inRecord.get("enddate"),
      inRecord.get("allocatedhours"), inRecord.get("name")
    ]);
    db.close();

  } // End updateProject().


  /**
   * Deletes a project.
   *
   * @param inProjectName The name of the project to delete.
   */
  this.deleteProject = function(inProjectName) {

    var db = google.gears.factory.create("beta.database");
    db.open(databaseName);
    db.execute(sqlDeleteProject, [ inProjectName]);
    db.close();

  } // End deleteProject().


  /**
   * Called to create a task record in the tasks table in the database.
   *
   * @param inRecord A TaskRecord instance.
   */
  this.createTask = function(inRecord) {

    // Write it out
    var db = google.gears.factory.create("beta.database");
    db.open(databaseName);
    db.execute(sqlCreateTask, [
      inRecord.get("name"), inRecord.get("description"),
      inRecord.get("startdate"), inRecord.get("enddate"),
      parseInt(inRecord.get("allocatedhours"))
    ]);
    db.close();

  } // End createTask().


  /**
   * Retrieves one or more tasks.
   *
   * @return An array of TaskRecord objects.  The array can be empty, but
   *         null will never be returned.
   */
  this.retrieveTasks = function() {

    // Open database and execute query.
    var db = google.gears.factory.create("beta.database");
    db.open(databaseName);
    var rs = db.execute(sqlRetrieveTasks);

    // Iterate over results, adding to results array.
    var results = [ ];
    while (rs.isValidRow()) {
      results.push(new TaskRecord({
        name : rs.fieldByName("name"),
        description : rs.fieldByName("description"),
        startdate : rs.fieldByName("startdate"),
        enddate : rs.fieldByName("enddate"),
        allocatedhours : parseInt(rs.fieldByName("allocatedhours")),
        project : rs.fieldByName("project"),
        resource : rs.fieldByName("resource"),
        bookedtime : parseInt(rs.fieldByName("bookedtime")),
        percentcomplete : parseInt(rs.fieldByName("percentcomplete"))
      }, rs.fieldByName("name")));
      rs.next();
    }
    rs.close();
    db.close();

    // Return matches, or an empty array if none.
    return results;

  } // End retrieveTasks().


  /*
   * Updates an existing task.
   *
   * @param inRecord The TaskRecord to be updated in the database.
   */
  this.updateTask = function(inRecord) {

    var db = google.gears.factory.create("beta.database");
    db.open(databaseName);
    db.execute(sqlUpdateTask, [
      inRecord.get("description"), inRecord.get("startdate"),
      inRecord.get("enddate"), inRecord.get("allocatedhours"),
      inRecord.get("resource"), inRecord.get("project"),
      inRecord.get("bookedtime"), inRecord.get("percentcomplete"),
      inRecord.get("name")
    ]);
    db.close();

  } // End updateTask().


  /**
   * Deletes a task.
   *
   * @param inTaskName The name of the task to delete.
   */
  this.deleteTask = function(inTaskName) {

    var db = google.gears.factory.create("beta.database");
    db.open(databaseName);
    db.execute(sqlDeleteTask, [ inTaskName]);
    db.close();

  } // End deleteTask().


  /**
   * Called to create a resource record in the resources table in the database.
   *
   * @param inRecord A ResourceRecord instance.
   */
  this.createResource = function(inRecord) {

    // Write it out
    var db = google.gears.factory.create("beta.database");
    db.open(databaseName);
    db.execute(sqlCreateResource, [
      inRecord.get("name"), inRecord.get("description"),
      inRecord.get("isaprojectmanager")
    ]);
    db.close();

  } // End createResource().


  /**
   * Retrieves one or more resources.
   *
   * @return An array of ResourceRecord objects.  The array can be empty, but
   *         null will never be returned.
   */
  this.retrieveResources = function() {

    // Open database and execute query.
    var db = google.gears.factory.create("beta.database");
    db.open(databaseName);
    var rs = db.execute(sqlRetrieveResources);

    // Iterate over results, adding to results array.
    var results = [ ];
    while (rs.isValidRow()) {
      results.push(new ResourceRecord({
        name : rs.fieldByName("name"),
        description : rs.fieldByName("description"),
        isaprojectmanager :rs.fieldByName("isaprojectmanager")
      }, rs.fieldByName("name")));
      rs.next();
    }
    rs.close();
    db.close();

    // Return matches, or an empty array if none.
    return results;

  } // End retrieveResources().


  /*
   * Updates an existing resource.
   *
   * @param inRecord The ResourceRecord to be updated in the database.
   */
  this.updateResource = function(inRecord) {

    var db = google.gears.factory.create("beta.database");
    db.open(databaseName);
    db.execute(sqlUpdateResource, [
      inRecord.get("description"), inRecord.get("isaprojectmanager"),
      inRecord.get("name")
    ]);
    db.close();

  } // End updateResource().


  /**
   * Deletes a resource.
   *
   * @param inResourceName The name of the resource to delete.
   */
  this.deleteResource = function(inResourceName) {

    var db = google.gears.factory.create("beta.database");
    db.open(databaseName);
    db.execute(sqlDeleteResource, [ inResourceName]);
    db.close();

  } // End deleteResource().


} // End DAO class.


var dao = new DAO();
