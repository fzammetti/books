package com.apress.ajaxprojects.theorganizer.actions;


import com.apress.ajaxprojects.theorganizer.daos.AppointmentDAO;
import com.apress.ajaxprojects.theorganizer.daos.TaskDAO;
import com.apress.ajaxprojects.theorganizer.objects.AccountObject;
import com.opensymphony.webwork.interceptor.SessionAware;
import com.opensymphony.xwork.Action;
import java.util.Date;
import java.util.List;
import java.util.Map;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * Action that services the Day At A Glance view.
 */
public class DayAtAGlanceAction implements Action, SessionAware {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog("com.apress.ajaxprojects");


  /**
   * The session map for this request.
   */
  private Map session;


  /**
   * The list of tasks due today.
   */
  private List tasks;


  /**
   * The list of appointmens for today.
   */
  private List appointments;


  /**
   * Mutator for session.
   *
   * @param inSession New value for session.
   */
  public void setSession(final Map inSession) {

    session = inSession;

  } // End setSession().


  /**
   * Accessor for tasks.
   *
   * @return Value of tasks.
   */
  public List getTasks() {

    return tasks;

  } // End getTasks().


  /**
   * Accessor for appointments.
   *
   * @return Value of appointments.
   */
  public List getAppointments() {

    return appointments;

  } // End getAppointments().


  /**
   * Execute.
   *
   * @return result.
   */
  public String execute() {

    log.info("\n\n----------------------------------------------------------");

    log.debug("DayAtAGlanceAction.execute()...");

    // Get username.
    AccountObject account  = (AccountObject)session.get("account");
    String        username = account.getUsername();

    // First, get the list of tasks due today.
    TaskDAO taskDAO = new TaskDAO();
    tasks = taskDAO.taskList(username, true);

    // Next, get the list of appointments for today.
    AppointmentDAO appointmentDAO = new AppointmentDAO();
    appointments = appointmentDAO.appointmentList(username, new Date(), "day");

    log.debug("DayAtAGlanceAction.execute() Done");

    return Action.SUCCESS;

  } // End execute().


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
