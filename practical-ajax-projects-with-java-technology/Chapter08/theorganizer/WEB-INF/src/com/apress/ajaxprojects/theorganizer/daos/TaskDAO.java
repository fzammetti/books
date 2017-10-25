package com.apress.ajaxprojects.theorganizer.daos;


import com.apress.ajaxprojects.theorganizer.Globals;
import com.apress.ajaxprojects.theorganizer.objects.TaskObject;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;


/**
 * Data Access Object (DAO) for working with Tasks.
 */
public class TaskDAO {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog("com.apress.ajaxprojects");


  /**
   * The DriverManagerDataSource this instance of the DAO will use.
   */
  private DriverManagerDataSource dataSource;


  /**
   * Constructor.
   */
  public TaskDAO() {

    dataSource = new DriverManagerDataSource();
    dataSource.setDriverClassName(Globals.dbDriver);
    dataSource.setUrl(Globals.dbURL);
    dataSource.setUsername(Globals.dbUsername);
    dataSource.setPassword(Globals.dbPassword);

  } // End constructor.


  /**
   * Method to create a new task.
   *
   * @param inTask The TaskObject instance to create.
   */
  public void taskCreate(final TaskObject inTask) {

    log.debug("TaskDAO.taskCreate()...");

    log.info("TaskObject to create : " + inTask);
    JdbcTemplate jt = new JdbcTemplate(dataSource);
    jt.execute(
      "INSERT INTO tasks (" +
      "createddt, username, comments, subject, status, priority, due" +
      ") VALUES (" +
      "'" + inTask.getCreatedDT() + "', " +
      "'" + inTask.getUsername()  + "', " +
      "'" + inTask.getComments()  + "', " +
      "'" + inTask.getSubject()   + "', " +
      "'" + inTask.getStatus()    + "', " +
      "'" + inTask.getPriority()  + "', " +
      "'" + inTask.getDue()       + "'" +
      ")");

    log.debug("TaskDAO.taskCreate() Done");

  } // End taskCreate().


  /**
   * Method to retrieve a task created on a specified day at a specified time
   * for a specified user.
   *
   * @param  inUsername  The username to retrieve task for.
   * @param  inCreatedDT The date and time, expressed as a long (millis) of
   *                     the task to retrieve.
   * @return             The applicable TaskObject instances.
   */
  public TaskObject taskRetrieve(final String inUsername,
    final long inCreatedDT) {

    log.debug("TaskDAO.taskRetrieve()...");

    // Retrieve the task for the specified user.
    log.debug("username/createdDT to retrieve task for : " + inUsername +
      "/" + inCreatedDT);
    JdbcTemplate jt = new JdbcTemplate(dataSource);
    Map m = jt.queryForMap(
      "SELECT * FROM tasks WHERE username='" + inUsername + "' AND " +
      "createddt='" + inCreatedDT + "'"
    );
    log.info("Map Retrieved  : " + m);
    // Now build a TaskObjects from it to return.
    TaskObject task = new TaskObject();
    task.setCreatedDT(inCreatedDT);
    task.setUsername(inUsername);
    task.setComments((String)m.get("COMMENTS"));
    task.setSubject((String)m.get("SUBJECT"));
    task.setStatus((String)m.get("STATUS"));
    task.setPriority((String)m.get("PRIORITY"));
    task.setDue((String)m.get("DUE"));
    log.info("task : " + task);

    log.debug("TaskDAO.taskRetrieve() Done");
    return task;

  } // End taskRetrieve().


  /**
   * Method to update an existing task.
   *
   * @param inTask The TaskObject instance to update.
   */
  public void taskUpdate(final TaskObject inTask) {

    log.debug("TaskDAO.taskUpdate()...");

    log.info("TaskObject to update : " + inTask);
    JdbcTemplate jt = new JdbcTemplate(dataSource);
    jt.execute(
      "UPDATE tasks SET " +
      "comments='"        + inTask.getComments()  + "', " +
      "subject='"         + inTask.getSubject()   + "', " +
      "status='"          + inTask.getStatus()    + "', " +
      "priority='"        + inTask.getPriority()  + "', " +
      "due='"             + inTask.getDue()       + "' " +
      "WHERE username='"  + inTask.getUsername()  + "' AND " +
      "createddt='"       + inTask.getCreatedDT() + "'"
    );
    log.debug("TaskDAO.taskUpdate() Done");

  } // End taskUpdate().


  /**
   * Method to delete a task.
   *
   * @param inTask The TaskObject instance to delete.
   */
  public void taskDelete(final TaskObject inTask) {

    log.debug("TaskDAO.taskDelete()...");

    log.info("TaskObject to delete : " + inTask);
    JdbcTemplate jt = new JdbcTemplate(dataSource);
    jt.execute(
      "DELETE FROM tasks " +
      "WHERE username='"   + inTask.getUsername()  + "' AND " +
      "createddt='"        + inTask.getCreatedDT() + "'"
    );
    log.debug("TaskDAO.taskDelete() Done");

  } // End taskDelete().


  /**
   * Method to retrieve a List of tasks for the specified user.
   *
   * @param  inUsername  The username to retrieve tasks for.
   * @param  inJustToday If true, retrieve only those tasks due today.  If
   *                     false, retrieve all tasks.
   * @return             A list of TaskObject instances.
   */
  public List taskList(final String inUsername, final boolean inJustToday) {

    log.debug("TaskDAO.taskList()...");

    // Retrieve the list of tasks for the specified user.
    log.debug("username to retrieve tasks for : " + inUsername);
    JdbcTemplate jt = new JdbcTemplate(dataSource);
    List tasks = jt.queryForList(
      "SELECT createddt, subject, due FROM tasks WHERE username='" +
      inUsername + "'"
    );
    log.info("Retrieved List : " + tasks);
    // Get today's date in MM/DD/YYYY form as a String, just in case the
    // caller requested only appointments for today.
    String currentDate = new SimpleDateFormat("MM/dd/yyyy").format(new Date());
    // Now build a List of TaskObjects from it to return.
    List tasksOut = new ArrayList();
    for (Iterator it = tasks.iterator(); it.hasNext();) {
      Map m = (Map)it.next();
      // If we want all appointments (!inJustToday), or we want just today's
      // appointments AND this appointment is for today, then add it to
      // the collection.
      if (!inJustToday ||
        (inJustToday && currentDate.equalsIgnoreCase((String)m.get("DUE")))) {
        TaskObject task = new TaskObject();
        task.setCreatedDT(((Long)m.get("CREATEDDT")).longValue());
        task.setUsername(inUsername);
        task.setSubject((String)m.get("SUBJECT"));
        tasksOut.add(task);
      }
    }
    log.info("taskOut List : " + tasksOut);

    log.debug("TaskDAO.taskList() Done");
    return tasksOut;

  } // End taskList().


} // End class.
