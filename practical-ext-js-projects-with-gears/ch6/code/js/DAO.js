/*
    Local Business Search - From the book "Practical Ext JS Projects With Gears"
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
LocalBusinessSearch.Data.DAO = new function() {


  /**
   * The name of the Gears database the application will be using.
   */
  var databaseName = "LocalBusinessSearch";


  /**
   * SQL statements for the operations dealing with favorites.
   */
  var sqlCreateFavoritesTable = "CREATE TABLE IF NOT EXISTS favorites (" +
    "id TEXT, title TEXT, distance TEXT, phone TEXT, rating TEXT, " +
    "address TEXT, city TEXT, state TEXT, latitude TEXT, longitude TEXT, " +
    "businessurl TEXT)"
  var sqlCreateFavorite = "INSERT INTO favorites (id, title, distance, " +
    "phone, rating, address, city, state, latitude, longitude, " +
    "businessurl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  var sqlRetrieveFavorites = "SELECT * FROM favorites";
  var sqlDeleteFavorite = "DELETE FROM favorites WHERE id=?";
  var sqlDeleteAllFavorites = "DELETE FROM favorites";


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
        db.execute(sqlCreateFavoritesTable);
        db.close();
      }
    } catch (e) {
      initReturn = e;
    }

    return initReturn;

  } // End init().


  /**
   * Called to create a favorite record in the favorites table in the database.
   *
   * @param inRecord A BusinessRecord instance.
   */
  this.createFavorite = function(inRecord) {

    // Write it out
    var db = google.gears.factory.create("beta.database");
    db.open(databaseName);
    db.execute(sqlCreateFavorite, [
      inRecord.id, inRecord.get("title"),
      inRecord.get("distance"), inRecord.get("phone"),
      inRecord.get("rating"), inRecord.get("address"), inRecord.get("city"),
      inRecord.get("state"), inRecord.get("latitude"),
      inRecord.get("longitude"), inRecord.get("businessurl")
    ]);
    db.close();

  } // End createFavorite().


  /**
   * Retrieves one or more favorites.
   *
   * @return An array of BusinessRecord objects.  The array can be empty, but
   *         null will never be returned.
   */
  this.retrieveFavorites = function() {

    // Open database and execute query.
    var db = google.gears.factory.create("beta.database");
    db.open(databaseName);
    var rs = db.execute(sqlRetrieveFavorites);

    // Iterate over results, adding to results array.
    var results = [ ];
    while (rs.isValidRow()) {
      results.push(new LocalBusinessSearch.Data.BusinessRecord({
        title : rs.fieldByName("title"),
        distance : rs.fieldByName("distance"),
        phone : rs.fieldByName("phone"),
        rating : rs.fieldByName("rating"),
        address : rs.fieldByName("address"),
        city : rs.fieldByName("city"),
        state : rs.fieldByName("state"),
        latitude : rs.fieldByName("latitude"),
        longitude : rs.fieldByName("longitude"),
        businessurl : rs.fieldByName("businessurl")
      }, rs.fieldByName("id")));
      rs.next();
    }
    rs.close();
    db.close();

    // Return matches, or an empty array if none.
    return results;

  } // End retrieveFavorites().


  /**
   * Deletes a favorite (or all favorites).
   *
   * @param inID The ID of the favorite to delete, or null to delete all
   *             favorites.
   */
  this.deleteFavorite = function(inID) {

    var db = google.gears.factory.create("beta.database");
    db.open(databaseName);
    if (inID) {
      db.execute(sqlDeleteFavorite, [ inID ] );
    } else {
      db.execute(sqlDeleteAllFavorites);
    }
    db.close();

  } // End deleteFavorite().


}; // End DAO class.
