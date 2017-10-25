package com.apress.dwrprojects.timekeeper;


import java.util.Date;
import java.util.List;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.directwebremoting.annotations.RemoteMethod;
import org.directwebremoting.annotations.RemoteProxy;
import org.hibernate.Query;
import org.hibernate.Session;


/**
 * A DAO for working with timesheets.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
@RemoteProxy
public class TimesheetDAO {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(TimesheetDAO.class);


  /**
   * Returns all TimesheetItem objects for a given user for the current period.
   *
   * @param  inUserID  The ID of the user to get data form.
   * @throws Exception If anything goes wrong.
   */
  @RemoteMethod
  public List getTimesheetItems(final Long inUserID) throws Exception {

    if (log.isTraceEnabled()) {
      log.trace("getTimesheetItems() - Entry");
    }
    if (log.isDebugEnabled()) {
      log.debug("getTimesheetItems() - inUserID = " + inUserID);
    }

    // Get the list of TimesheetItems.
    Session session = Utils.getHibernateSession();
    session.beginTransaction();
    List itemList = session.createQuery(
      "from TimesheetItem as item where item.userID = ?")
      .setLong(0, inUserID).list();

    if (log.isDebugEnabled()) {
      log.debug("getTimesheetItems() - itemList = " + itemList);
    }
    if (log.isTraceEnabled()) {
      log.trace("getTimesheetItems() - Exit");
    }
    return itemList;

  } // End getTimesheetItems().


  /**
   * Called to create a new timesheet item.
   *
   * @param  inUserID     ID of the user booking time.
   * @param  inProjectID  ID of the project to book time to.
   * @param  inReportDate The date time is being booked for.
   * @param  inHours      Hours being booked.
   * @throws Exception    If anything goes wrong.
   */
  @RemoteMethod
  public void addItem(final Long inUserID, final Long inProjectID,
    final Date inReportDate, final Integer inHours) throws Exception {

    if (log.isTraceEnabled()) {
      log.trace("addItem() - Entry");
    }
    if (log.isDebugEnabled()) {
      log.debug("addItem() - inUserID = " + inUserID);
      log.debug("addItem() - inProjectID = " + inProjectID);
      log.debug("addItem() - inReportDate = " + inReportDate);
      log.debug("addItem() - inHours = " + inHours);
    }

    // Create and populate TimesheetItem object.
    TimesheetItem item = new TimesheetItem();
    item.setUserID(inUserID);
    item.setProjectID(inProjectID);
    item.setReportDate(inReportDate);
    item.setHours(inHours);

    // Tell Hibernate to insert it.
    Session session = Utils.getHibernateSession();
    session.beginTransaction();
    session.save(item);
    session.getTransaction().commit();

    // Call method on clients to update screen.
    Utils.callUpdateData();

    if (log.isTraceEnabled()) {
      log.trace("addItem() - Exit");
    }

  } // End addItem().


  /**
   * Called to update an existing timesheet item.
   *
   * @param  inID      The ID of the item being updated.
   * @param  inHours   Hours being booked.
   * @throws Exception If anything goes wrong.
   */
  @RemoteMethod
  public void updateItem(final Long inID, final Integer inHours)
    throws Exception {

    if (log.isTraceEnabled()) {
      log.trace("updateItem() - Entry");
    }
    if (log.isDebugEnabled()) {
      log.debug("updateItem() - inID = " + inID);
      log.debug("updateItem() - inHours = " + inHours);
    }

    // Go get the TimesheetItem object from the database via Hibernate.
    TimesheetItem item = getItemByID(inID);

    item.setHours(inHours);

    // Have Hibernate write the changes back to the database.
    Session session = Utils.getHibernateSession();
    session.beginTransaction();
    session.update(item);
    session.getTransaction().commit();

    // Call method on clients to update screen.
    Utils.callUpdateData();

    if (log.isTraceEnabled()) {
      log.trace("updateItem() - Exit");
    }

  } // End updateItem().


  /**
   * A method to retrieve a timesheet item by ID.
   *
   * @param  inID      The ID to retrieve.
   * @return           A TimesheetItem object, or null if not found.
   * @throws Exception If anything goes wrong.
   */
  @RemoteMethod
  public TimesheetItem getItemByID(final Long inID) throws Exception {

    if (log.isTraceEnabled()) {
      log.trace("getItemByID() - Entry");
    }
    if (log.isDebugEnabled()) {
      log.trace("getItemByID() - inID = " + inID);
    }

    // Get the item.
    Session session = Utils.getHibernateSession();
    session.beginTransaction();
    TimesheetItem item = (TimesheetItem)session.createQuery(
      "from TimesheetItem as item where item.id = ?")
      .setLong(0, inID).uniqueResult();
    session.getTransaction().commit();

    if (log.isDebugEnabled()) {
      log.debug("getItemByID() - item = " + item);
    }
    if (log.isTraceEnabled()) {
      log.trace("getItemByID() - Exit");
    }
    return item;

  } // End getItemByID().


  /**
   * Returns the total number of booked hours for a given project.
   *
   * @param  inProjectID The ID of the project to get booked hours for.
   * @return             The number of hours booked for the given project.
   * @throws Exception   If anything goes wrong.
   */
  @RemoteMethod
  @SuppressWarnings("unchecked")
  public int getBookedTimeForProject(final Long inProjectID) throws Exception {

    if (log.isTraceEnabled()) {
      log.trace("getBookedTimeForProject() - Entry");
    }
    if (log.isDebugEnabled()) {
      log.debug("getBookedTimeForProject() - inProjectID = " + inProjectID);
    }

    // Get the list of TimesheetItems.
    Session session = Utils.getHibernateSession();
    session.beginTransaction();
    List<TimesheetItem> itemList = session.createQuery(
      "from TimesheetItem as item where item.projectID = ?")
      .setLong(0, inProjectID).list();
    // Calculate booked time.
    int bookedTime = 0;
    for (TimesheetItem ti : itemList) {
      bookedTime += ti.getHours().intValue();
    }

    if (log.isDebugEnabled()) {
      log.debug("getBookedTimeForProject() - bookedTime = " + bookedTime);
    }
    if (log.isTraceEnabled()) {
      log.trace("getBookedTimeForProject() - Exit");
    }
    return bookedTime;

  } // End getBookedTimeForProject().


} // End class.
