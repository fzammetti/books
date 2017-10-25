/*
    Code Cabinet - From the book "Practical webOS Projects With the Palm Pre"
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
 * updating categories and snippets.
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
  var databaseName = "CodeCabinet";


  /**
   * SQL statements for the operations dealing with categories.
   */
  var sqlCreateCategoriesTable = "CREATE TABLE IF NOT EXISTS categories (" +
    "name TEXT); GO;"
  var sqlCreateCategory = "INSERT INTO categories (name) VALUES (?); GO;";
  var sqlRetrieveCategories = "SELECT c.name, " +
    "(select count(name) from snippets where categoryname=c.name) " +
    "as snippetCount FROM categories c ORDER BY c.name; GO;";
  var sqlDeleteCategory = "DELETE FROM categories WHERE name=?; GO;";


  /**
   * SQL statements for the operations dealing with snippets.
   */
  var sqlCreateSnippetsTable = "CREATE TABLE IF NOT EXISTS snippets (" +
    "id TEXT, categoryname TEXT, name TEXT, description TEXT, author TEXT, " +
    "email TEXT, weblink TEXT, code TEXT, notes TEXT, keyword1 TEXT, " +
    "keyword2 TEXT, keyword3 TEXT, keyword4 TEXT, keyword5 TEXT); GO;"
  var sqlCreateSnippet = "INSERT INTO snippets (id, categoryname, name, " +
  "description, author, email, weblink, code, notes, keyword1, keyword2, " +
  "keyword3, keyword4, keyword5) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, " +
  "?, ?, ?); GO;";
  var sqlRetrieveSnippetsInCategory =
    "SELECT * FROM snippets where categoryname=? ORDER BY ";
  var sqlRetrieveAllSnippets = "SELECT id, categoryname, " +
    "TRIM(name) AS name, TRIM(description) AS description, " +
    "TRIM(author) AS author, TRIM(email) AS email, " +
    "TRIM(weblink) AS weblink, TRIM(code) AS code, " +
    "TRIM(notes) AS notes, TRIM(keyword1) AS keyword1, " +
    "TRIM(keyword2) AS keyword2, TRIM(keyword3) AS keyword3, " +
    "TRIM(keyword4) AS keyword4, TRIM(keyword5) AS keyword5 " +
    "FROM snippets ORDER BY ";
  var sqlUpdateSnippet = "UPDATE snippets SET name=?, description=?, " +
    "author=?, email=?, weblink=?, code=?, notes=?, keyword1=?, keyword2=?, " +
    "keyword3=?, keyword4=?, keyword5=? WHERE id=?; GO;";
  var sqlDeleteSnippet = "DELETE FROM snippets WHERE id=?; GO;";
  var sqlDeleteSnippetsInCategory = "DELETE FROM snippets WHERE " +
    "categoryname=?; GO;";


  /**
   * Initialize the DAO.
   *
   * @return null if initialization was successful, an exception object if
             anything goes wrong.
   *
   */
  this.init = function() {

    this.db = openDatabase(databaseName, "", databaseName, 65536);
    this.db.transaction((function (inTransaction) {
      inTransaction.executeSql(sqlCreateCategoriesTable, [], function() { }, 
        dao.errorHandler); 
      inTransaction.executeSql(sqlCreateSnippetsTable, [], function() { }, 
        dao.errorHandler); 
    }));

  }; // End init().


  // ---------------------------- CATEGORY METHODS ----------------------------

  /**
   * Called to create a category record in the categories table in the database.
   *
   * @param inCategoryName The name of the category to create.
   */
  this.createCategory = function(inCategoryName) {

    this.db.transaction((function (inTransaction) { 
      inTransaction.executeSql(sqlCreateCategory, [ inCategoryName ], 
        function() { }, dao.errorHandler); 
    }));       

  }; // End createCategory().


  /**
   * Retrieves one or more categories.
   *
   * @param  inCallback     A callback function that will be called when the 
   *                        data is loaded.  This function will be pased an  
   *                        array of objects representing category records from
   .                        the categories table.  The array can be empty, but
   *                        null will never be returned.
   */
  this.retrieveCategories = function(inCallback) {

    this.db.transaction((function (inTransaction) { 
      inTransaction.executeSql(sqlRetrieveCategories, [ ],
        function(inTransaction, inResultSet) {
          var results = [ ];
          if (inResultSet.rows) {
            for (var i = 0; i < inResultSet.rows.length; i++) {
              results.push(inResultSet.rows.item(i));
            }
          }        
          inCallback(results);
        }, dao.errorHandler
      ); 
    }));  

  }; // End retrieveCategories().


  /**
   * Retrieves the number of 
   *
   * @param  inCallback     A callback function that will be called when the 
   *                        data is loaded.  This function will be pased an  
   *                        array of objects representing category records from
   .                        the categories table.  The array can be empty, but
   *                        null will never be returned.
   */
  this.retrieveCategories = function(inCallback) {

    this.db.transaction((function (inTransaction) { 
      inTransaction.executeSql(sqlRetrieveCategories, [ ],
        function(inTransaction, inResultSet) {
          var results = [ ];
          if (inResultSet.rows) {
            for (var i = 0; i < inResultSet.rows.length; i++) {
              results.push(inResultSet.rows.item(i));
            }
          }        
          inCallback(results);
        }, dao.errorHandler
      ); 
    }));  

  }; // End retrieveCategories().
  

  /**
   * Deletes a category.
   *
   * @param inCategoryName The name of the category to delete.
   */
  this.deleteCategory = function(inCategoryName) {

    this.db.transaction((function (inTransaction) { 
      inTransaction.executeSql(sqlDeleteSnippetsInCategory, [ inCategoryName ], 
        function() { }, dao.errorHandler);
      inTransaction.executeSql(sqlDeleteCategory, [ inCategoryName ], 
        function() { }, dao.errorHandler);     
    }));  

  }; // End deleteCategory().


  // ---------------------------- SNIPPET METHODS -----------------------------

  /**
   * Called to create a snippet record in the snippets table in the database.
   *
   * @param inSnippetDescriptor An object containing all the details about the 
   *                            snippet to create.
   */
  this.createSnippet = function(inSnippetDescriptor) {

    this.db.transaction((function (inTransaction) { 
      inTransaction.executeSql(sqlCreateSnippet, [ 
        inSnippetDescriptor.id, inSnippetDescriptor.categoryname,
        inSnippetDescriptor.name, inSnippetDescriptor.description,
        inSnippetDescriptor.author, inSnippetDescriptor.email, 
        inSnippetDescriptor.weblink, inSnippetDescriptor.code, 
        inSnippetDescriptor.notes, inSnippetDescriptor.keyword1,
        inSnippetDescriptor.keyword2, inSnippetDescriptor.keyword3,
        inSnippetDescriptor.keyword4, inSnippetDescriptor.keyword5
      ], function() { }, dao.errorHandler);     
    }));

  }; // End createSnippet().


  /**
   * Retrieves one or more snippets in a given category.
   *
   * @param  inCategoryName The name of the category to get snippets for.  If
   *                        this is null then all snippets in the database
   *                        across all categories will be returned (used when
   *                        doing a search).
   * @param  inCallback     A callback function that will be called when the 
   *                        data is loaded.  This function will be pased an  
   *                        array of objects representing snippet records from
   .                        the snippets table.  The array can be empty, but
   *                        null will never be returned.
   */
  this.retrieveSnippets = function(inCategoryName, inCallback) {

    // Determine which SQL statement to use based on whether we got a
    // category namein.
    var sql = sqlRetrieveAllSnippets;
    var params = [ ];
    if (inCategoryName) {
      sql = sqlRetrieveSnippetsInCategory;
      params = [ inCategoryName ];
    }

    // Add sort criteria based on set user preference.
    var storedSortOrder = codeCabinet.sortOrderCookie.get();
    var sortInfo = storedSortOrder.split("_");
    switch (sortInfo[0]) {
      case "newest":
        sql += "id DESC;";
      break;
      case "oldest":
        sql += "id ASC;";
      break;
      case "name":
        sql += "name " + sortInfo[1].toUpperCase() + ";";
      break;
      case "author":
        sql += "author " + sortInfo[1].toUpperCase() + ";";
      break;
    }
    sql += " GO;";

    this.db.transaction((function (inTransaction) { 
      inTransaction.executeSql(sql, params,
        function(inTransaction, inResultSet) {
          var results = [ ];
          if (inResultSet.rows) {
            for (var i = 0; i < inResultSet.rows.length; i++) {
              results.push(inResultSet.rows.item(i));
            }
          }                 
          inCallback(results);
        }, dao.errorHandler
      ); 
    }));  

  }; // End retrieveSnippets().


  /**
   * Called to update an existing snippet.
   *
   * @param inSnippetDescriptor An object containing all the details about the 
   *                            snippet to update.
   */
  this.updateSnippet = function(inSnippetDescriptor) {

    this.db.transaction((function (inTransaction) { 
      inTransaction.executeSql(sqlUpdateSnippet, [ 
        inSnippetDescriptor.name, inSnippetDescriptor.description,
        inSnippetDescriptor.author, inSnippetDescriptor.email, 
        inSnippetDescriptor.weblink, inSnippetDescriptor.code, 
        inSnippetDescriptor.notes, inSnippetDescriptor.keyword1,
        inSnippetDescriptor.keyword2, inSnippetDescriptor.keyword3,
        inSnippetDescriptor.keyword4, inSnippetDescriptor.keyword5,
        inSnippetDescriptor.id
      ], function() { }, dao.errorHandler);     
    }));

  }; // End updateSnippet().


  /**
   * Deletes a snippet.
   *
   * @param inID The ID of the snippet to delete.
   */
  this.deleteSnippet = function(inID) {

    this.db.transaction((function (inTransaction) { 
      inTransaction.executeSql(sqlDeleteSnippet, [ inID ], function() { }, 
        dao.errorHandler);
    })); 

  }; // End deleteCategory().


  /**
   * This method handles any errors thrown by SQL executions.  It just displays
   * an error dialog and that's that.  We assume any error occurring here are
   * non-recoverable (and none of these should ever happen anyway!).
   *
   * @param inTransaction Transaction object that exectued the SQL.
   * @param inError       SQLError object.
   */
  this.errorHandler = function(inTransaction, inError) {

    Mojo.Controller.errorDialog(
      "DAO ERROR - (" + inError.code + ") : " + inError.message
    );

  }; // End errorHandler().
  

}; // End DAO class.


// One instance to rule them all.
var dao = new DAO();
