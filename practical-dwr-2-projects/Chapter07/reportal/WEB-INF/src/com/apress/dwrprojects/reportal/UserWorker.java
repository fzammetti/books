package com.apress.dwrprojects.reportal;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.StringTokenizer;
import javax.servlet.http.HttpServletRequest;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.dao.DataIntegrityViolationException;


/**
 * This class performs operations dealing with users and their profiles.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class UserWorker {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(UserWorker.class);


  /**
   * SQL for logging a user in.
   */
  private static String SQL_LOG_USER_IN =
    "SELECT * FROM users WHERE username='${username}' " +
    "AND password='${password}'";


  /**
   * SQL for getting the list of all users.
   */
  private static String SQL_GET_USERS_LIST =
    "SELECT * FROM users";


  /**
   * SQL for adding a user to the portal.
   */
  private static String SQL_ADD_USER_TO_PORTAL =
    "INSERT INTO users (username, password, groups, note) VALUES(" +
    "'${username}', '${password}', '${groups}', '${note}')";


  /**
   * SQL for deleting a user.
   */
  private static String SQL_DELETE_USER =
    "DELETE FROM users WHERE username='${username}'";


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
   * This method is called to attempt to log a user in
   *
   * @param  inUsername The username to attempt to log in.
   * @param  inPassword The password to attempt to log in with.
   * @param  inRequest  The request object being serviced.
   * @return            True if login is successful, false if not.
   * @throws Exception  If anything goes wrong.
   */
  public boolean logUserIn(final String inUsername, final String inPassword,
    final HttpServletRequest inRequest) throws Exception {

    log.trace("logUserIn() - Entry");

    try {

      if (log.isDebugEnabled()) {
        log.debug("logUserIn() - inUsername = " + inUsername);
        log.debug("logUserIn() - inPassword = " + inPassword);
      }

      // Create map of replacement tokens for SQL statement from incoming
      // UserDescriptor object.
      Map<String, String> tokens = new HashMap<String, String>();
      tokens.put("username", inUsername);
      tokens.put("password", inPassword);

      // Query database for user.
      List users = databaseWorker.executeQuery(SQL_LOG_USER_IN, tokens);

      // If we got one and only one match, then user is logged in.
      if (users.size() == 1) {
        inRequest.getSession(true).setAttribute("username", inUsername);
        // Parse groups string into a List and put it in session.  This is
        // needed later to limit what reports the user sees, and this way it's
        // easier to do that check.
        Map m = (Map)users.get(0);
        String groupsString = (String)m.get("GROUPS");
        StringTokenizer st = new StringTokenizer(groupsString, ",");
        List<String> groups = new ArrayList<String>();
        while (st.hasMoreTokens()) {
          String nextGroup = st.nextToken();
          groups.add(nextGroup);
        }
        inRequest.getSession(true).setAttribute("groups", groups);
        log.debug("logUserIn() - User validated");
        log.trace("logUserIn() - Exit");
        return true;
      } else {
        log.debug("logUserIn() - User NOT validated");
        log.trace("logUserIn() - Exit");
        return false;
      }

    } catch (Exception e) {
      e.printStackTrace();
      throw e;
    }

  } // End logUserIn().


  /**
   * This method is called to get the list of users on the system.
   *
   * @return           A List of UserDescriptor objects, one for each user on
   *                   the portal.
   * @throws Exception If anything goes wrong.
   */
  @SuppressWarnings("unchecked")
  public List<UserDescriptor> getUsersList() throws Exception {

    log.trace("getUsersList() - Entry");

    try {

      // Query database for list of users.
      List<Map> users = databaseWorker.executeQuery(SQL_GET_USERS_LIST,
        new HashMap());
      List<UserDescriptor> userList = new ArrayList<UserDescriptor>();

      // Iterate over returned records.
      for (Map m : users) {
        // Construct UserDescriptor for each.
        UserDescriptor user = new UserDescriptor();
        user.setUsername((String)m.get("USERNAME"));
        user.setPassword((String)m.get("PASSWORD"));
        user.setGroups((String)m.get("GROUPS"));
        user.setNote((String)m.get("NOTE"));
        // Add UserDescriptor to list.
        userList.add(user);
      }

      // Log and return.
      if (log.isDebugEnabled()) {
        log.debug("getGroupsList() - userList = " + userList);
      }
      log.trace("getUsersList() - Exit");
      return userList;

    } catch (Exception e) {
      e.printStackTrace();
      throw e;
    }

  } // End getUsersList().


  /**
   * This method is called to add a user to the portal.
   *
   * @param  inUser    The UserDescriptor object describing the new user.
   * @return           The updated List of users.
   * @throws Exception If anything goes wrong.
   */
  public List<UserDescriptor> addUserToPortal(final UserDescriptor inUser)
    throws Exception {

    log.trace("addUserToPortal() - Entry");

    try {

      if (log.isDebugEnabled()) {
        log.debug("addUserToPortal() - inUser = " + inUser);
      }

      // Create map of replacement tokens for SQL statement from incoming
      // UserDescriptor object.
      Map<String, String> tokens = new HashMap<String, String>();
      tokens.put("username", inUser.getUsername());
      tokens.put("password", inUser.getPassword());
      tokens.put("groups", inUser.getGroups());
      tokens.put("note", inUser.getNote());

      // Execute the insert query.
      databaseWorker.executeUpdate(SQL_ADD_USER_TO_PORTAL, tokens);

      // Now get an update list of users for the UI and return it.
      log.trace("addUserToPortal() - Exit");
      return getUsersList();

    } catch (DataIntegrityViolationException dive) {
      throw new Exception("User could not be created.  " +
        "Does the user already exist?");
    } catch (Exception e) {
      e.printStackTrace();
      throw e;
    }

  } // End addUserToPortal().


  /**
   * This method is called to remove a user from the portal.
   *
   * @return            A List of UserDescriptor objects, one for each user on
   *                    the portal.
   * @param  inUsername The username of the user to remove.
   * @throws Exception  If anything goes wrong.
   */
  public List<UserDescriptor> removeUserFromPortal(final String inUsername)
    throws Exception {

    log.trace("removeUserFromPortal() - Entry");

    try {

      if (log.isDebugEnabled()) {
        log.debug("removeUserFromPortal() - inUsername = " + inUsername);
      }

      // Create map of replacement tokens for SQL statement.
      Map<String, String> tokens = new HashMap<String, String>();
      tokens.put("username", inUsername);

      // Execute the delete query.
      databaseWorker.executeUpdate(SQL_DELETE_USER, tokens);

      // Now get an update list of users for the UI and return it.
      log.trace("removeUserFromPortal() - Exit");
      return getUsersList();

    } catch (Exception e) {
      e.printStackTrace();
      throw e;
    }

  } // End removeUserFromPortal().


} // End class.
