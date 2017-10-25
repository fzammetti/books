package com.apress.dwrprojects.reportal;


import java.util.ArrayList;
import java.util.List;
import java.util.HashMap;
import java.util.Map;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.dao.DataIntegrityViolationException;


/**
 * This class performs operations dealing with user groups.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class GroupWorker {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(GroupWorker.class);


  /**
   * SQL for getting the list of all groups.
   */
  private static String SQL_GET_GROUPS_LIST =
    "SELECT * FROM groups";


  /**
   * SQL for adding a group to the portal.
   */
  private static String SQL_ADD_GROUP_TO_PORTAL =
    "INSERT INTO groups (groupname, description) VALUES(" +
    "'${groupname}', '${description}')";


  /**
   * SQL for determining if a group has users in it.
   */
  private static String SQL_IS_GROUP_EMPTY =
    "SELECT groups FROM users WHERE groups LIKE '%${groupname}%'";


  /**
   * SQL for deleting a group.
   */
  private static String SQL_DELETE_GROUP =
    "DELETE FROM groups WHERE groupname='${groupname}'";


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
   * This method is called to get the list of group on the system.
   *
   * @return           A List of GroupDescriptor objects, one for each group
   *                   on the portal.
   * @throws Exception If anything goes wrong.
   */
  @SuppressWarnings("unchecked")
  public List<GroupDescriptor> getGroupsList() throws Exception {

    log.trace("getGroupsList() - Entry");

    try {

      // Query database for list of groups.
      List<Map> groups = databaseWorker.executeQuery(SQL_GET_GROUPS_LIST,
        new HashMap());
      List<GroupDescriptor> groupList = new ArrayList<GroupDescriptor>();

      // Iterate over returned records.
      for (Map m : groups) {
        // Construct GroupDescriptor for each.
        GroupDescriptor group = new GroupDescriptor();
        group.setGroupName((String)m.get("GROUPNAME"));
        group.setDescription((String)m.get("DESCRIPTION"));
        // Add GroupDescriptor to list.
        groupList.add(group);
      }

      // Log and return.
      if (log.isDebugEnabled()) {
        log.debug("getGroupsList() - groupList = " + groupList);
      }
      log.trace("getGroupsList() - Exit");
      return groupList;

    } catch (Exception e) {
      e.printStackTrace();
      throw e;
    }

  } // End getGroupsList().


  /**
   * This method is called to add a group to the portal.
   *
   * @param  inGroup   The GroupDescriptor object describing the new group.
   * @return           The updated List of groups.
   * @throws Exception If anything goes wrong.
   */
  public List<GroupDescriptor> addGroupToPortal(final GroupDescriptor inGroup)
    throws Exception {

    log.trace("addGroupToPortal() - Entry");

    try {

      if (log.isDebugEnabled()) {
        log.debug("addGroupToPortal() - inGroup = " + inGroup);
      }

      // Create map of replacement tokens for SQL statement from incoming
      // GroupDescriptor object.
      Map<String, String> tokens = new HashMap<String, String>();
      tokens.put("groupname", inGroup.getGroupName());
      tokens.put("description", inGroup.getDescription());

      // Execute the insert query.
      databaseWorker.executeUpdate(SQL_ADD_GROUP_TO_PORTAL, tokens);

      // Now get an update list of groups for the UI and return it.
      log.trace("addGroupToPortal() - Exit");
      return getGroupsList();

    } catch (DataIntegrityViolationException dive) {
      throw new Exception("Group could not be created.  " +
        "Does the group already exist?");
    } catch (Exception e) {
      e.printStackTrace();
      throw e;
    }

  } // End addGroupToPortal().


  /**
   * This method is called to remove a group from the portal.
   *
   * @return             A List of GroupDescriptor objects, one for each group
   *                     on the portal.
   * @param  inGroupName The groupName of the group to remove.
   * @throws Exception   If anything goes wrong.
   */
  @SuppressWarnings("unchecked")
  public List<GroupDescriptor> removeGroupFromPortal(final String inGroupName)
    throws Exception {

    log.trace("removeGroupFromPortal() - Entry");

    try {

      if (log.isDebugEnabled()) {
        log.debug("removeGroupFromPortal() - inGroupName = " + inGroupName);
      }

      // Create map of replacement tokens for SQL statement.
      Map<String, String> tokens = new HashMap<String, String>();
      tokens.put("groupname", inGroupName);

      // First, do query to see if group has users in it.  If it does, throw
      // an exception that says group can't be deleted.
      List<Map> groupRecords = databaseWorker.executeQuery(SQL_IS_GROUP_EMPTY,
        tokens);
      if (groupRecords.size() > 0) {
        throw new Exception("Group cannot be deleted because there are users " +
          "assigned to it.  Delete all users in the group first.");
      }

      // It's OK to delete group, so execute the delete query.
      databaseWorker.executeUpdate(SQL_DELETE_GROUP, tokens);

      // Now get an update list of groups for the UI and return it.
      log.trace("removeGroupFromPortal() - Exit");
      return getGroupsList();

    } catch (Exception e) {
      e.printStackTrace();
      throw e;
    }

  } // End removeUserFromPortal().


} // End class.
