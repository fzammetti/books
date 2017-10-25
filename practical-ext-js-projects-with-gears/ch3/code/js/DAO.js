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
 * The DAO class provides a clean API for storing, retrieving and deleting
 * notes, tasks, contacts and appointments in the underlying Gears database
 * for the OrganizerExt application.
 */
function DAO() {


  /**
   * Constants.
   */
  DAO.TASK_STATUS_ACTIVE = "active";
  DAO.TASK_STATUS_COMPLETE = "complete";


  /**
   * The name of the Gears database the application will be using.
   */
  var databaseName = "OrganizerExt";


  /**
   * SQL statements for the CRUD operations (minus update) for notes.
   */
  var sqlCreateNotesTable = "CREATE TABLE IF NOT EXISTS notes (" +
    "id INT, category TEXT, content TEXT" +
  ")"
  var sqlCreateNote =
    "INSERT INTO notes (id, category, content) " +
    "VALUES (?, ?, ?)";
  var sqlRetrieveNotes = "SELECT * FROM notes";
  var sqlDeleteNote = "DELETE FROM notes WHERE id=?";


  /**
   * SQL statements for the CRUD operations for tasks.
   */
  var sqlCreateTasksTable = "CREATE TABLE IF NOT EXISTS tasks (" +
    "id INT, category TEXT, status TEXT, " +
    "content TEXT" +
  ")"
  var sqlCreateTask =
    "INSERT INTO tasks (id, category, status, content) " +
    "VALUES (?, ?, ?, ?)";
  var sqlRetrieveTasks = "SELECT * FROM tasks";
  var sqlUpdateTask = "UPDATE tasks SET category=?, status=?, content=? " +
    "WHERE id=?";
  var sqlDeleteTask = "DELETE FROM tasks WHERE id=?";


  /**
   * SQL statements for the CRUD operations (minus update) for contacts.
   */
  var sqlCreateContactsTable = "CREATE TABLE IF NOT EXISTS contacts (" +
    "id INT, category TEXT, company TEXT, " +
    "firstname TEXT, lastname TEXT, phonenumber TEXT, cellnumber TEXT, " +
    "faxnumber TEXT, email TEXT, note TEXT" +
  ")"
  var sqlCreateContact =
    "INSERT INTO contacts (id, category, company, " +
    "firstname, lastname, phonenumber, cellnumber, faxnumber, email, note) " +
    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  var sqlRetrieveContacts = "SELECT * FROM contacts";
  var sqlDeleteContact = "DELETE FROM contacts WHERE id=?";


  /**
   * SQL statements for the CRUD operations (minus update) for appointments.
   */
  var sqlCreateAppointmentsTable = "CREATE TABLE IF NOT EXISTS appointments (" +
    "id INT, title TEXT, category TEXT, " +
    "whendt TEXT, location TEXT, note TEXT" +
  ")"
  var sqlCreateAppointment =
    "INSERT INTO appointments (id, title, category, " +
    "whendt, location, note) " +
    "VALUES (?, ?, ?, ?, ?, ?)";
  var sqlRetrieveAppointments = "SELECT * FROM appointments";
  var sqlDeleteAppointment = "DELETE FROM appointments WHERE id=?";


  /**
   * Initialize the DAO.
   */
  this.init = function() {

    var initReturn = true;
    if (!window.google || !google.gears) {
      initReturn = false;
    }

    // Create tables, if necessary.
    var db = google.gears.factory.create("beta.database");
    db.open(databaseName);
    db.execute(sqlCreateNotesTable);
    db.execute(sqlCreateTasksTable);
    db.execute(sqlCreateContactsTable);
    db.execute(sqlCreateAppointmentsTable);
    db.close();

    return initReturn;

  } // End init().


  /**
   * Creates a note.
   *
   * @param inNoteDesc The note descriptor.
   */
  this.createNote = function(inNoteDesc) {

    if (inNoteDesc && inNoteDesc.id && inNoteDesc.category &&
      inNoteDesc.content) {
      var db = google.gears.factory.create("beta.database");
      db.open(databaseName);
      db.execute(sqlCreateNote, [
        parseInt(inNoteDesc.id), inNoteDesc.category, inNoteDesc.content
      ]);
      db.close();
    }

  } // End createNote().


  /**
   * Retrieves one or more notes.
   *
   * @return An array of note descriptors.  The array can be empty, but null
   *         will never be returned.
   */
  this.retrieveNotes = function() {

    // Open database and execute query.
    var db = google.gears.factory.create("beta.database");
    db.open(databaseName);
    var rs = db.execute(sqlRetrieveNotes);

    // Iterate over results, adding to results array.
    var results = [ ];
    while (rs.isValidRow()) {
      results.push({
        id : rs.fieldByName("id"),
        category : rs.fieldByName("category"),
        content : rs.fieldByName("content")
      });
      rs.next();
    }
    rs.close();
    db.close();

    // Return matches, or an empty array if none.
    return results;

  } // End retrieveNotes().


  /**
   * Deletes a note.
   *
   * @param inNoteDesc The note descriptor used to match the note to delete.
   *                   Only the id attribute matters, others are ignored.
   */
  this.deleteNote = function(inNoteDesc) {

    if (inNoteDesc && inNoteDesc.id) {
      var db = google.gears.factory.create("beta.database");
      db.open(databaseName);
      db.execute(sqlDeleteNote, [ inNoteDesc.id ]);
      db.close();
    }

  } // End deleteNote().


  /**
   * Creates a task.
   *
   * @param inTaskDesc The task descriptor.
   */
  this.createTask = function(inTaskDesc) {

    if (inTaskDesc && inTaskDesc.id && inTaskDesc.status &&
      inTaskDesc.category && inTaskDesc.content) {
      var db = google.gears.factory.create("beta.database");
      db.open(databaseName);
      db.execute(sqlCreateTask, [
        parseInt(inTaskDesc.id), inTaskDesc.category, inTaskDesc.status,
        inTaskDesc.content
      ]);
      db.close();
    }

  } // End createTask().


  /**
   * Retrieves one or more tasks.
   *
   * @return An array of task descriptors.  The array can be empty, but null
   *         will never be returned.
   */
  this.retrieveTasks = function() {

    // Open database and execute query.
    var db = google.gears.factory.create("beta.database");
    db.open(databaseName);
    var rs = db.execute(sqlRetrieveTasks);

    // Iterate over results, adding to results array.
    var results = [ ];
    while (rs.isValidRow()) {
      results.push({
        id : rs.fieldByName("id"),
        category : rs.fieldByName("category"),
        status : rs.fieldByName("status"),
        content : rs.fieldByName("content")
      });
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
   * @param inTaskDesc The task descriptor of the task to update.
   */
  this.updateTask = function(inTaskDesc) {

    if (inTaskDesc && inTaskDesc.id && inTaskDesc.category &&
      inTaskDesc.status && inTaskDesc.content) {
      var db = google.gears.factory.create("beta.database");
      db.open(databaseName);
      db.execute(sqlUpdateTask, [
        inTaskDesc.category, inTaskDesc.status, inTaskDesc.content,
        inTaskDesc.id
      ]);
      db.close();
    }

  } // End updateTask().


  /**
   * Deletes a task.
   *
   * @param inTaskDesc The task descriptor used to match the task to delete.
   *                   Only the id attribute matters, others are ignored.
   */
  this.deleteTask = function(inTaskDesc) {

    if (inTaskDesc && inTaskDesc.id) {
      var db = google.gears.factory.create("beta.database");
      db.open(databaseName);
      db.execute(sqlDeleteTask, [ inTaskDesc.id ]);
      db.close();
    }

  } // End deleteTask().


  /**
   * Creates a contact.
   *
   * @param inContactDesc  The contact descriptor.
   */
  this.createContact = function(inContactDesc) {

    if (inContactDesc && inContactDesc.id && inContactDesc.category &&
      inContactDesc.firstname && inContactDesc.lastname) {
      var db = google.gears.factory.create("beta.database");
      db.open(databaseName);
      db.execute(sqlCreateContact, [
        parseInt(inContactDesc.id), inContactDesc.category,
        inContactDesc.company, inContactDesc.firstname, inContactDesc.lastname,
        inContactDesc.phonenumber, inContactDesc.cellnumber,
        inContactDesc.faxnumber, inContactDesc.email,inContactDesc.note
      ]);
      db.close();
    }

  } // End createContact().


  /**
   * Retrieves one or more contacts.
   *
   * @return An array of contact descriptors.  The array can be empty, but null
   *         will never be returned.
   */
  this.retrieveContacts = function() {

    // Open database and execute query.
    var db = google.gears.factory.create("beta.database");
    db.open(databaseName);
    var rs = db.execute(sqlRetrieveContacts);

    // Iterate over results, adding to results array.
    var results = [ ];
    while (rs.isValidRow()) {
      results.push({
        id : rs.fieldByName("id"),
        category : rs.fieldByName("category"),
        company : rs.fieldByName("company"),
        firstname : rs.fieldByName("firstname"),
        lastname : rs.fieldByName("lastname"),
        phonenumber : rs.fieldByName("phonenumber"),
        cellnumber : rs.fieldByName("cellnumber"),
        faxnumber : rs.fieldByName("faxnumber"),
        email : rs.fieldByName("email"),
        note : rs.fieldByName("note")
      });
      rs.next();
    }
    rs.close();
    db.close();

    // Return matches, or an empty array if none.
    return results;

  } // End retrieveContact().


  /**
   * Deletes a contact.
   *
   * @param inContactDesc The contact descriptor used to match the
   *                      contact to delete.  Only the id attribute
   *                      matters, others are ignored.
   */
  this.deleteContact = function(inContactDesc) {

    if (inContactDesc && inContactDesc.id) {
      var db = google.gears.factory.create("beta.database");
      db.open(databaseName);
      db.execute(sqlDeleteContact, [ inContactDesc.id ]);
      db.close();
    }

  } // End deleteContact().


  /**
   * Creates an appointment.
   *
   * @param inAppointmentDesc The appointment descriptor.
   */
  this.createAppointment = function(inAppointmentDesc) {

    if (inAppointmentDesc && inAppointmentDesc.id &&
      inAppointmentDesc.category && inAppointmentDesc.title &&
      inAppointmentDesc.whendt) {
      var db = google.gears.factory.create("beta.database");
      db.open(databaseName);
      db.execute(sqlCreateAppointment, [
        parseInt(inAppointmentDesc.id), inAppointmentDesc.title,
        inAppointmentDesc.category,
        inAppointmentDesc.whendt.format("Y-m-d H:i:sO"),
        inAppointmentDesc.location, inAppointmentDesc.note
      ]);
      db.close();
    }

  } // End createAppointment().


  /**
   * Retrieves one or more appointments.
   *
   * @return An array of appointment descriptors.  The array can be empty, but
   *         null will never be returned.
   */
  this.retrieveAppointments = function() {

    // Open database and execute query.
    var db = google.gears.factory.create("beta.database");
    db.open(databaseName);
    var rs = db.execute(sqlRetrieveAppointments);

    // Iterate over results, adding to results array.
    var results = [ ];
    while (rs.isValidRow()) {
      results.push({
        id : rs.fieldByName("id"),
        title : rs.fieldByName("title"),
        category : rs.fieldByName("category"),
        whendt : Date.parseDate(rs.fieldByName("whendt"), "Y-m-d H:i:sO"),
        location : rs.fieldByName("location"),
        note : rs.fieldByName("note")
      });
      rs.next();
    }
    rs.close();
    db.close();

    // Return matches, or an empty array if none.
    return results;

  } // End retrieveAppointment().


  /**
   * Deletes an appointment.
   *
   * @param inAppointmentDesc The appointment descriptor used to match
   *                          the appointment to delete.  Only the id
   *                          attribute matters, others are ignored.
   */
  this.deleteAppointment = function(inAppointmentDesc) {

    if (inAppointmentDesc && inAppointmentDesc.id) {
      var db = google.gears.factory.create("beta.database");
      db.open(databaseName);
      db.execute(sqlDeleteAppointment, [ inAppointmentDesc.id ]);
      db.close();
    }

  } // End deleteAppointment().


} // End DAO class.


var dao = new DAO();
