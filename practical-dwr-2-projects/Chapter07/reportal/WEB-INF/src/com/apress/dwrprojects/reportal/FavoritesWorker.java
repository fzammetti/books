package com.apress.dwrprojects.reportal;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.dao.DataIntegrityViolationException;


/**
 * This class performs operations dealing with favorites.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class FavoritesWorker {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(FavoritesWorker.class);


  /**
   * SQL for getting the list of favorites for a user.
   */
  private static String SQL_GET_FAVORITES_LIST =
    "SELECT f.reportname, r.description, r.groups FROM favorites f, " +
    "reports r WHERE (f.username='${username}' OR r.groups LIKE " +
    "'%AllUsers%') AND f.reportname=r.reportname";


  /**
   * SQL for adding a favorite for a specified user.
   */
  private static String SQL_ADD_FAVORITE_FOR_USER =
    "INSERT INTO favorites (username, reportname) values(" +
    "'${username}', '${reportname}')";


  /**
   * SQL for deleting a favorite.
   */
  private static String SQL_DELETE_FAVORITE =
    "DELETE FROM favorites WHERE username='${username}' and " +
    "reportname='${reportname}'";


  /**
   * Instance of DatabaseWorker to use for all database access.
   */
  private DatabaseWorker databaseWorker;


  /**
   * Setter for databaseWorker so Spring can give it to us.
   */
  public void setDatabaseWorker(final DatabaseWorker inDatabaseWorker) {

    databaseWorker = inDatabaseWorker;

  } // End setDatabaseWorker().


  /**
   * This method returns a List of favorites for the specified user.
   *
   * @param  inUsername The username to get the list of favorites for.
   * @return            A List favorites in the form xxx~~yyy where xxx is the
   *                    report name and yyy is the description.
   * @throws Exception  If anything goes wrong.
   */
  @SuppressWarnings("unchecked")
  public List<String> getFavoritesForUser(final String inUsername)
    throws Exception {

    log.trace("getFavoritesForUser() - Entry");

    try {

      if (log.isDebugEnabled()) {
        log.debug("getFavoritesForUser() - inUsername = " + inUsername);
      }

      // Tokens to be replaced in SQL.  If no username was passed in, put in
      // a dummy string, which should yield no results, but since the query
      // also retrieves all user favorites, it will still get results, if there
      // are reports for all users.
      Map<String, String> tokens = new HashMap<String, String>();
      if (inUsername == null) {
        tokens.put("username", "_DUMMY_USERNAME_");
      } else {
        tokens.put("username", inUsername);
      }

      // Query database for list of favorites for all users always.
      List<Map> favorites =
        databaseWorker.executeQuery(SQL_GET_FAVORITES_LIST, tokens);

      // Iterate over returned records and add string in appropriate form for
      // each favorite to list.
      List<String> favoritesList = new ArrayList<String>();
      for (Map m : favorites) {
        favoritesList.add((String)m.get("REPORTNAME") + "~~" +
          (String)m.get("DESCRIPTION"));
      }

      if (log.isDebugEnabled()) {
        log.debug("getFavoritesForUser() - favoritesList = " + favoritesList);
      }
      log.trace("getFavoritesForUser() - Exit");
      return favoritesList;

    } catch (Exception e) {
      e.printStackTrace();
      throw e;
    }

  } // End getFavoritesForUser().


  /**
   * This method adds a favorite for a given user.
   *
   * @param  inUsername   The username to add the favorite for.
   * @return              The updated List of favorites.
   * @param  inReportName The name of the report to add as a favorite.
   * @throws Exception    If anything goes wrong.
   */
  public List<String> addReportToFavorites(final String inUsername,
    final String inReportName) throws Exception {

    log.trace("addReportToFavorites() - Entry");

    try {

      if (log.isDebugEnabled()) {
        log.debug("addReportToFavorites() - inUsername = " + inUsername);
        log.debug("addReportToFavorites() - inReportName = " + inReportName);
      }

      // Create map of replacement tokens for SQL statement from incoming
      // parameter.
      Map<String, String> tokens = new HashMap<String, String>();
      tokens.put("username", inUsername);
      tokens.put("reportname", inReportName);

      // Execute the insert query.
      databaseWorker.executeUpdate(SQL_ADD_FAVORITE_FOR_USER, tokens);

      // Now get an update list of favorites for the UI and return it.
      log.trace("addReportToFavorites() - Exit");
      return getFavoritesForUser(inUsername);

    } catch (DataIntegrityViolationException dive) {
      throw new Exception("Favorite could not be created.\n\n" +
        "(Does the favorite already exist for the specified report?)");
    } catch (Exception e) {
      e.printStackTrace();
      throw e;
    }

  } // End addReportToFavorites().


  /**
   * This method removes a favorite for a given user.
   *
   * @param  inUsername   The username to remove the favorite for.
   * @param  inReportName The name of the report to remove from favorites.
   * @return              A List favorites in the form xxx~~yyy where xxx is
   *                      the report name and yyy is the description.  Null is
   *                      returned if inUsername is null, meaning the user is
   *                      not yet logged in, and an empty list is returned if
   *                      there are no favorites for the user.
   * @throws Exception    If anything goes wrong.
   */
  public List<String> removeReportFromFavorites(final String inUsername,
    final String inReportName) throws Exception {

    log.trace("removeReportFromFavorites() - Entry");

    try {

      if (log.isDebugEnabled()) {
        log.debug("removeReportFromFavorites() - inUsername = " + inUsername);
        log.debug("removeReportFromFavorites() - inReportName = " +
          inReportName);
      }

      // Create map of replacement tokens for SQL statement.
      Map<String, String> tokens = new HashMap<String, String>();
      tokens.put("username", inUsername);
      tokens.put("reportname", inReportName);

      // Execute the delete query.
      databaseWorker.executeUpdate(SQL_DELETE_FAVORITE, tokens);

      // Now get an update list of favorites for the UI and return it.
      log.trace("removeReportFromFavorites() - Exit");
      return getFavoritesForUser(inUsername);

    } catch (Exception e) {
      e.printStackTrace();
      throw e;
    }

  } // End removeReportFromFavorites().


} // End class.
