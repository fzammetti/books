package com.apress.dwrprojects.timekeeper;


import java.util.List;
import javax.servlet.http.HttpSession;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.directwebremoting.annotations.RemoteMethod;
import org.directwebremoting.annotations.RemoteProxy;
import org.hibernate.Query;
import org.hibernate.Session;


/**
 * A DAO for working with User objects.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
@RemoteProxy
public class UserDAO {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(UserDAO.class);


  /**
   * A remote method called to attempt a user login.
   *
   * @param  inUsername The username of the user trying to log in.
   * @param  inPassword The password of the user trying to log in.
   * @param  inSession  The HttpSession associated with the requesting user.
   * @return            A string value, either "Ok" or "Bad".
   */
  @RemoteMethod
  public String logUserIn(final String inUsername, final String inPassword,
    final HttpSession inSession) throws Exception {

    // Try to list all users and see how many objecs we get.  If it's zero,
    // we need to create the default user now because it means the database
    // is brand new (or someone deleted the default user without creating
    // another user), which also means no one can log into the app at this
    // moment!
    List users = listUsers();
    if (users.size() == 0) {
      addUser("default", "default", true, true);
    }

    // Attempt to get the user from the database.
    User user = getUserByName(inUsername);

    // If user wasn't found, or if password doesn't match, no login.  Otherwise,
    // login is successful.
    if (user == null || !user.getPassword().equals(inPassword)) {
      return "Bad";
    } else {
      inSession.setAttribute("user", user);
      return "Ok";
    }

  } // End logUserIn().


  /**
   * Called to create a new user.
   *
   * @param  inUsername        Username.
   * @param  inPassword        Password.
   * @param  inIsAdministrator Is the user an administrator?
   * @param  isProjectManager  Is the user a project manager?
   * @throws Exception         If anything goes wrong.
   */
  @RemoteMethod
  public void addUser(final String inUsername, final String inPassword,
    final boolean inIsAdministrator, final boolean inIsProjectManager)
    throws Exception {

    if (log.isTraceEnabled()) {
      log.trace("addUser() - Entry");
    }
    if (log.isDebugEnabled()) {
      log.debug("addUser() - inUsername = " + inUsername);
      log.debug("addUser() - inPassword = " + inPassword);
      log.debug("addUser() - inIsAdministrator = " + inIsAdministrator);
      log.debug("addUser() - inIsProjectManager = " + inIsProjectManager);
    }

    // Create and populate User object.
    User user = new User();
    user.setUsername(inUsername);
    user.setPassword(inPassword);
    user.setIsAdministrator(inIsAdministrator);
    user.setIsProjectManager(inIsProjectManager);

    // Tell Hibernate to insert it.
    Session session = Utils.getHibernateSession();
    session.beginTransaction();
    session.save(user);
    session.getTransaction().commit();

    // Call method on clients to update screen.
    Utils.callUpdateData();

    if (log.isTraceEnabled()) {
      log.trace("addUser() - Exit");
    }

  } // End addUser().


  /**
   * Called to update an existing user.
   *
   * @param  inFieldToUpdate The field to update.  One of "username",
   *                         "password", "isAdministrator" or
   *                         "isProjectManager".
   * @param  inID            The ID of the user to update.
   * @param  inNewValue      The new value of the field.
   * @throws Exception       If anything goes wrong.
   */
  @RemoteMethod
  public void updateUser(final String inFieldToUpdate, final long inID,
    final String inNewValue) throws Exception {

    if (log.isTraceEnabled()) {
      log.trace("updateUser() - Entry");
    }
    if (log.isDebugEnabled()) {
      log.debug("updateUser() - inFieldToUpdate = " + inFieldToUpdate);
      log.debug("updateUser() - inID = " + inID);
      log.debug("updateUser() - inNewValue = " + inNewValue);
    }

    // Go get the User object from the database via Hibernate.
    User user = getUserByID(inID);

    // Make the appropriate updates.
    if (inFieldToUpdate.equals("username")) {
      user.setUsername(inNewValue);
    } else if (inFieldToUpdate.equals("password")) {
      user.setPassword(inNewValue);
    } else if (inFieldToUpdate.equals("isAdministrator")) {
      user.setIsAdministrator(Boolean.parseBoolean(inNewValue));
    } else if (inFieldToUpdate.equals("isProjectManager")) {
      user.setIsProjectManager(Boolean.parseBoolean(inNewValue));
    }

    // Have Hibernate write the changes back to the database.
    Session session = Utils.getHibernateSession();
    session.beginTransaction();
    session.update(user);
    session.getTransaction().commit();

    // Call method on clients to update screen.
    Utils.callUpdateData();

    if (log.isTraceEnabled()) {
      log.trace("updateUser() - Exit");
    }

  } // End updateUser().


  /**
   * Called to delete a existing user.
   *
   * @param  inID      The ID of the user to delete.
   * @throws Exception If anything goes wrong.
   */
  @RemoteMethod
  public void deleteUser(final long inID) throws Exception {

    if (log.isTraceEnabled()) {
      log.trace("deleteUser() - Entry");
    }
    if (log.isDebugEnabled()) {
      log.debug("deleteUser() - inID = " + inID);
    }

    // Do the actual deletion.
    Session session = Utils.getHibernateSession();
    session.beginTransaction();
    User user = (User)session.createQuery(
      "from User as user where user.id = ?")
      .setLong(0, inID).uniqueResult();
    session.delete(user);
    session.getTransaction().commit();

    // Call method on clients to update screen.
    Utils.callUpdateData();

    if (log.isTraceEnabled()) {
      log.trace("deleteUser() - Exit");
    }

  } // End deleteUser().


  /**
   * A method to list all users.
   *
   * @return           A List of all users known to Timekeeper.
   * @throws Exception If anything goes wrong.
   */
  @RemoteMethod
  public List listUsers() throws Exception {

    if (log.isTraceEnabled()) {
      log.trace("listUsers() - Entry");
    }

    // Get the list.
    Session session = Utils.getHibernateSession();
    session.beginTransaction();
    List usersList = session.createQuery(
      "from User as user order by user.username").list();
    session.getTransaction().commit();

    if (log.isDebugEnabled()) {
      log.debug("listUsers() - usersList = " + usersList);
    }
    if (log.isTraceEnabled()) {
      log.trace("listUsers() - Exit");
    }
    return usersList;

  } // End listUsers().


  /**
   * A method to retrieve a user by name.
   *
   * @param  inUsername The username to retrieve.
   * @return            A User object, or null if not found.
   * @throws Exception  If anything goes wrong.
   */
  @RemoteMethod
  public User getUserByName(final String inUsername) throws Exception {

    if (log.isTraceEnabled()) {
      log.trace("getUserByName() - Entry");
    }
    if (log.isDebugEnabled()) {
      log.trace("getUserByName() - inUsername = " + inUsername);
    }

    // Get the user.
    Session session = Utils.getHibernateSession();
    session.beginTransaction();
    User user = (User)session.createQuery(
      "from User as user where user.username = ?")
      .setString(0, inUsername).uniqueResult();
    session.getTransaction().commit();

    if (log.isDebugEnabled()) {
      log.debug("getUserByName() - user = " + user);
    }
    if (log.isTraceEnabled()) {
      log.trace("getUserByName() - Exit");
    }
    return user;

  } // End getUserByName().


  /**
   * A method to retrieve a user by ID.
   *
   * @param  inID      The ID to retrieve.
   * @return           A User object, or null if not found.
   * @throws Exception If anything goes wrong.
   */
  @RemoteMethod
  public User getUserByID(final Long inID) throws Exception {

    if (log.isTraceEnabled()) {
      log.trace("getUserByID() - Entry");
    }
    if (log.isDebugEnabled()) {
      log.trace("getUserByID() - inID = " + inID);
    }

    Session session = Utils.getHibernateSession();
    session.beginTransaction();
    User user = (User)session.createQuery(
      "from User as user where user.id = ?")
      .setLong(0, inID).uniqueResult();
    session.getTransaction().commit();

    if (log.isDebugEnabled()) {
      log.debug("getUserByID() - user = " + user);
    }
    if (log.isTraceEnabled()) {
      log.trace("getUserByID() - Exit");
    }
    return user;

  } // End getUserByID().


} // End class.
