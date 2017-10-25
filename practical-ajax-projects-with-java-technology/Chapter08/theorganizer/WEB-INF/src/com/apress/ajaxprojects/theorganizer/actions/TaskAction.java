package com.apress.ajaxprojects.theorganizer.actions;


import com.apress.ajaxprojects.theorganizer.daos.TaskDAO;
import com.apress.ajaxprojects.theorganizer.objects.AccountObject;
import com.apress.ajaxprojects.theorganizer.objects.TaskObject;
import com.opensymphony.webwork.interceptor.SessionAware;
import com.opensymphony.xwork.Action;
import java.util.Date;
import java.util.List;
import java.util.Map;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * Action providing CRUD services for working with Tasks.
 */
public class TaskAction implements Action, SessionAware {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog("com.apress.ajaxprojects");


  /**
   * The session map for this request.
   */
  private Map session;


  /**
   * The createdDT field value of the task to retrieve.
   */
  private long createdDT;


  /**
   * The TaskObject retrieved.
   */
  private TaskObject task;


  /**
   * The collection of tasks for the user retrieved from the database.
   */
  private List tasks;


  /**
   * The comments of the task.
   */
  private String comments;


  /**
   * The subject of the task.
   */
  private String subject;

  /**
   * The status code of the task.
   */
  private String status;


  /**
   * The priority code of the task.
   */
  private String priority;


  /**
   * The due date of the task.
   */
  private String due;


  /**
   * Mutator for session.
   *
   * @param inSession New value for session.
   */
  public void setSession(final Map inSession) {

    session = inSession;

  } // End setSession().


  /**
   * Mutator for createdDT.
   *
   * @param inCreatedDT New value for createdDT.
   */
  public void setCreatedDT(final long inCreatedDT) {

    createdDT = inCreatedDT;

  } // End setCreatedDT().


  /**
   * Accessor for createdDT.
   *
   * @return Value of createdDT.
   */
  public long getCreatedDT() {

    return createdDT;

  } // End getCreatedDT().


  /**
   * Accessor for task.
   *
   * @return Value of task.
   */
  public TaskObject getTask() {

    return task;

  } // End getTask().


  /**
   * Accessor for tasks.
   *
   * @return Value of tasks.
   */
  public List getTasks() {

    return tasks;

  } // End getTasks().


  /**
   * Mutator for comments.
   *
   * @param inComments New value for comments.
   */
  public void setComments(final String inComments) {

    comments = inComments;

  } // End setComments().


  /**
   * Accessor for comments.
   *
   * @return Value of comments.
   */
  public String getComments() {

    return comments;

  } // End getComments().


  /**
   * Mutator for due.
   *
   * @param inDue New value for due.
   */
  public void setDue(final String inDue) {

    due = inDue;

  } // End setDue().


  /**
   * Accessor for due.
   *
   * @return Value of due.
   */
  public String getDue() {

    return due;

  } // End getDue().


  /**
   * Mutator for status.
   *
   * @param inStatus New value for status.
   */
  public void setStatus(final String inStatus) {

    status = inStatus;

  } // End setStatus().


  /**
   * Accessor for status.
   *
   * @return Value of status.
   */
  public String getStatus() {

    return status;

  } // End getStatus().


  /**
   * Mutator for priority.
   *
   * @param inPriority New value for priority.
   */
  public void setPriority(final String inPriority) {

    priority = inPriority;

  } // End setPriority().


  /**
   * Accessor for priority.
   *
   * @return Value of priority.
   */
  public String getPriority() {

    return priority;

  } // End getPriority().


  /**
   * Mutator for subject.
   *
   * @param inSubject New value for subject.
   */
  public void setSubject(final String inSubject) {

    subject = inSubject;

  } // End setSubject().


  /**
   * Accessor for subject.
   *
   * @return Value of subject.
   */
  public String getSubject() {

    return subject;

  } // End getSubject().


  /**
   * execute() (to fulfill interface contract).
   *
   * @return null.
   */
  public String execute() {

    return null;

  } // End execute().


  /**
   * Create new task.
   *
   * @return result.
   */
  public String create() {

    log.info("\n\n----------------------------------------------------------");

    log.debug("TaskAction.create()...");

    // Display incoming request parameters.
    log.info("TaskAction : " + this.toString());

    // Call on the TaskDAO to save the TaskObject instance we are about to
    // create and populate.
    TaskDAO    dao = new TaskDAO();
    TaskObject tsk = getTaskObject();
    // Need to override the createdDT that was populated by getTaskObject().
    tsk.setCreatedDT(new Date().getTime());
    dao.taskCreate(tsk);

    log.debug("TaskAction.create() Done");

    return Action.SUCCESS;

  } // End create().


  /**
   * Get task for editing.
   *
   * @return result.
   */
  public String retrieve() {

    log.info("\n\n----------------------------------------------------------");

    log.debug("TaskAction.retrieve()...");

    // Display incoming request parameters.
    log.info("TaskAction : " + this.toString());

    // Retrieve the task for the specified user created on the specified date
    // at the specified time.
    AccountObject account  = (AccountObject)session.get("account");
    String        username = account.getUsername();
    TaskDAO       dao      = new TaskDAO();
    task = dao.taskRetrieve(username, createdDT);
    log.debug("TaskAction : " + this.toString());

    log.debug("TaskAction.retrieve() Done");

    return Action.SUCCESS;

  } // End retrieve().



  /**
   * Update existing task.
   *
   * @return result.
   */
  public String update() {

    log.info("\n\n----------------------------------------------------------");

    log.debug("TaskAction.update()...");

    // Display incoming request parameters.
    log.info("TaskAction : " + this.toString());

    // Call on the TaskDAO to save the TaskObject instance we are about to
    // create and populate.
    TaskObject tsk = getTaskObject();
    TaskDAO    dao = new TaskDAO();
    dao.taskUpdate(tsk);

    log.debug("TaskAction.update() Done");

    return Action.SUCCESS;

  } // End update().


  /**
   * Delete existing task.
   *
   * @return result.
   */
  public String delete() {

    log.info("\n\n----------------------------------------------------------");

    log.debug("TaskAction.delete()...");

    // Display incoming request parameters.
    log.info("TaskAction : " + this.toString());

    // Call on the TaskDAO to delete the TaskObject instance we are about to
    // create and populate.
    AccountObject account  = (AccountObject)session.get("account");
    String        username = account.getUsername();
    TaskDAO       dao      = new TaskDAO();
    TaskObject    tsk      = new TaskObject();
    tsk.setCreatedDT(createdDT);
    tsk.setUsername(username);
    dao.taskDelete(tsk);

    log.debug("TaskAction.delete() Done");

    return Action.SUCCESS;

  } // End delete().


  /**
   * List tasks.
   *
   * @return result.
   */
  public String list() {

    log.info("\n\n----------------------------------------------------------");

    log.debug("TaskAction.list()...");

    AccountObject account  = (AccountObject)session.get("account");
    String        username = account.getUsername();
    TaskDAO       dao      = new TaskDAO();
    tasks = dao.taskList(username, false);
    log.debug("TaskAction : " + this.toString());

    log.debug("TaskAction.list() Done");

    return Action.SUCCESS;

  } // End list().


  /**
   * This method is called form both save() and update() to get a populated
   * TaskObject instance.  This saves a lot of duplicate code in both
   * methods.
   *
   * @return The fully-populated TaskObject.
   */
  private TaskObject getTaskObject() {

    AccountObject account  = (AccountObject)session.get("account");
    String        username = account.getUsername();
    TaskObject    tsk      = new TaskObject();
    tsk.setCreatedDT(createdDT);
    tsk.setUsername(username);
    tsk.setComments(comments);
    tsk.setSubject(subject);
    tsk.setPriority(priority);
    tsk.setStatus(status);
    tsk.setDue(due);
    return tsk;

  } // End getTaskObject();


  /**
   * Overriden toString method.
   *
   * @return A reflexively-built string representation of this bean.
   */
  public String toString() {

    String str = null;
    StringBuffer sb = new StringBuffer(1000);
    sb.append("[" + super.toString() + "]={");
    boolean firstPropertyDisplayed = false;
    try {
      java.lang.reflect.Field[] fields = this.getClass().getDeclaredFields();
      for (int i = 0; i < fields.length; i++) {
        if (firstPropertyDisplayed) {
          sb.append(", ");
        } else {
          firstPropertyDisplayed = true;
        }
        sb.append(fields[i].getName() + "=" + fields[i].get(this));
      }
      sb.append("}");
      str = sb.toString().trim();
    } catch (IllegalAccessException iae) {
      iae.printStackTrace();
    }
    return str;

  } // End toString().


} // End class.
