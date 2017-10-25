/*
    Code Cabinet Ext - From the book "Practical Ext JS Projects With Gears"
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
 * updating categories and snippets.
 */
CodeCabinetExt.Data.DAO = new function() {


  /**
   * The name of the Gears database the application will be using.
   */
  var databaseName = "CodeCabinetExt";


  /**
   * SQL statements for the operations dealing with categories.
   */
  var sqlCreateCategoriesTable = "CREATE TABLE IF NOT EXISTS categories (" +
    "name TEXT)"
  var sqlCreateCategory = "INSERT INTO categories (name) VALUES (?)";
  var sqlRetrieveCategories = "SELECT * FROM categories";
  var sqlDeleteCategory = "DELETE FROM categories WHERE name=?";


  /**
   * SQL statements for the operations dealing with snippets.
   */
  var sqlCreateSnippetsTable = "CREATE TABLE IF NOT EXISTS snippets (" +
    "id TEXT, categoryname TEXT, name TEXT, description TEXT, author TEXT, " +
    "email TEXT, weblink TEXT, code TEXT, notes TEXT, keyword1 TEXT, " +
    "keyword2 TEXT, keyword3 TEXT, keyword4 TEXT, keyword5 TEXT)"
  var sqlCreateSnippet = "INSERT INTO snippets (id, categoryname, name, " +
  "description, author, email, weblink, code, notes, keyword1, keyword2, " +
  "keyword3, keyword4, keyword5) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, " +
  "?, ?, ?)";
  var sqlRetrieveSnippetsInCategory =
    "SELECT * FROM snippets where categoryname=?";
  var sqlRetrieveAllSnippets = "SELECT * FROM snippets";
  var sqlUpdateSnippet = "UPDATE snippets SET name=?, description=?, " +
    "author=?, email=?, weblink=?, code=?, notes=?, keyword1=?, keyword2=?, " +
    "keyword3=?, keyword4=?, keyword5=? WHERE id=?";
  var sqlDeleteSnippet = "DELETE FROM snippets WHERE id=?";
  var sqlDeleteSnippetsInCategory = "DELETE FROM snippets WHERE categoryname=?";


  /**
   * Initialize the DAO.
   *
   * @return "ok" if initialization was successful, "no_gears" if Gears isn't
   *         available, or a freeform error string in any other case.
   *
   */
  this.init = function() {

    var initReturn = "ok";
    try {
      // Test for Gears.
      if (!window.google || !google.gears) {
        initReturn = "no_gears";
      } else {
        // Create tables, if necessary.
        var db = google.gears.factory.create("beta.database");
        db.open(databaseName);
        db.execute(sqlCreateCategoriesTable);
        db.execute(sqlCreateSnippetsTable);
        db.close();
      }
    } catch (e) {
      initReturn = e;
    }

    return initReturn;

  } // End init().


  /**
   * Called to create a category record in the categories table in the database.
   *
   * @param inRecord A CategoryRecord instance.
   */
  this.createCategory = function(inRecord) {

    // Write it out
    var db = google.gears.factory.create("beta.database");
    db.open(databaseName);
    db.execute(sqlCreateCategory, [ inRecord.get("name") ] );
    db.close();

  } // End createCategory().


  /**
   * Retrieves one or more category.
   *
   * @return An array of CategoryRecord objects.  The array can be empty, but
   *         null will never be returned.
   */
  this.retrieveCategories = function() {

    // Open database and execute query.
    var db = google.gears.factory.create("beta.database");
    db.open(databaseName);
    var rs = db.execute(sqlRetrieveCategories);

    // Iterate over results, adding to results array.
    var results = [ ];
    while (rs.isValidRow()) {
      results.push(new CodeCabinetExt.Data.CategoryRecord({
        name : rs.fieldByName("name")
      }, rs.fieldByName("name")));
      rs.next();
    }
    rs.close();
    db.close();

    // Return matches, or an empty array if none.
    return results;

  } // End retrieveCategories().


  /**
   * Deletes a category.
   *
   * @param inCategoryName The name of the category to delete.
   */
  this.deleteCategory = function(inCategoryName) {

    var db = google.gears.factory.create("beta.database");
    db.open(databaseName);
    db.execute(sqlDeleteCategory, [ inCategoryName ] );
    db.execute(sqlDeleteSnippetsInCategory, [ inCategoryName ] );
    db.close();

  } // End deleteCategory().


  /**
   * Called to create a snippet record in the snippets table in the database.
   *
   * @param inRecord A SnippetRecord instance.
   */
  this.createSnippet = function(inRecord) {

    // Write it out
    var db = google.gears.factory.create("beta.database");
    db.open(databaseName);
    db.execute(sqlCreateSnippet, [
      inRecord.id, inRecord.get("categoryname"),
      inRecord.get("name"), inRecord.get("description"),
      inRecord.get("author"), inRecord.get("email"), inRecord.get("weblink"),
      inRecord.get("code"), inRecord.get("notes"), inRecord.get("keyword1"),
      inRecord.get("keyword2"), inRecord.get("keyword3"),
      inRecord.get("keyword4"), inRecord.get("keyword5")
    ]);
    db.close();

  } // End createSnippet().


  /**
   * Retrieves one or more snippets in a given category.
   *
   * @param  inCategoryName The name of the category to get snippets for.  If
   *                        this is null then all snippets in the database
   *                        across all categories will be returned.
   * @return                An array of SnippetRecord objects.  The array can
   *                        be empty, but null will never be returned.
   */
  this.retrieveSnippets = function(inCategoryName) {

    // Open database and execute query.
    var db = google.gears.factory.create("beta.database");
    db.open(databaseName);
    var rs = null;

    // Determine which type of query we're doing.
    if (inCategoryName) {
      rs = db.execute(sqlRetrieveSnippetsInCategory, [ inCategoryName ] );
    } else {
      rs = db.execute(sqlRetrieveAllSnippets);
    }

    // Iterate over results, adding to results array.
    var results = [ ];
    while (rs.isValidRow()) {
      results.push(new CodeCabinetExt.Data.SnippetRecord({
        name : rs.fieldByName("name"), author : rs.fieldByName("author"),
        categoryname : rs.fieldByName("categoryname"),
        description : rs.fieldByName("description"),
        email : rs.fieldByName("email"), code : rs.fieldByName("code"),
        weblink : rs.fieldByName("weblink"), notes : rs.fieldByName("notes"),
        keyword1 : rs.fieldByName("keyword1"),
        keyword2 : rs.fieldByName("keyword2"),
        keyword3 : rs.fieldByName("keyword3"),
        keyword4 : rs.fieldByName("keyword4"),
        keyword5 : rs.fieldByName("keyword5")
      }, rs.fieldByName("id")));
      rs.next();
    }
    rs.close();
    db.close();

    // Return matches, or an empty array if none.
    return results;

  } // End retrieveSnippets().


  /**
   * Called to update an existing snippet.
   *
   * @param inRecord A SnippetRecord instance.
   */
  this.updateSnippet = function(inRecord) {

    // Write it out
    var db = google.gears.factory.create("beta.database");
    db.open(databaseName);
    db.execute(sqlUpdateSnippet, [
      inRecord.get("name"), inRecord.get("description"), inRecord.get("author"),
      inRecord.get("email"), inRecord.get("weblink"), inRecord.get("code"),
      inRecord.get("notes"), inRecord.get("keyword1"),
      inRecord.get("keyword2"), inRecord.get("keyword3"),
      inRecord.get("keyword4"), inRecord.get("keyword5"),
      inRecord.id
    ]);
    db.close();

  } // End updateSnippet().


  /**
   * Deletes a snippet.
   *
   * @param inID The ID of the snippet to delete.
   */
  this.deleteSnippet = function(inID) {

    var db = google.gears.factory.create("beta.database");
    db.open(databaseName);
    db.execute(sqlDeleteSnippet, [ inID ] );
    db.close();

  } // End deleteCategory().


}; // End DAO class.
