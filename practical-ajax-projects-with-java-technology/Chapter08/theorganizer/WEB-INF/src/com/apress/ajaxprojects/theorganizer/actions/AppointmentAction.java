package com.apress.ajaxprojects.theorganizer.actions;


import com.apress.ajaxprojects.theorganizer.daos.AppointmentDAO;
import com.apress.ajaxprojects.theorganizer.objects.AccountObject;
import com.apress.ajaxprojects.theorganizer.objects.AppointmentObject;
import com.opensymphony.webwork.interceptor.SessionAware;
import com.opensymphony.xwork.Action;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * Action providing CRUD services for working with Appointments.
 */
public class AppointmentAction implements Action, SessionAware {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog("com.apress.ajaxprojects");


  /**
   * The session map for this request.
   */
  private Map session;


  /**
   * The createdDT field value of the appointment to delete.
   */
  private long createdDT;


  /**
   * The AppointmentObject retrieved.
   */
  private AppointmentObject appointment;


  /**
   * Which view to show: "day", "week", "month" or "year".
   */
  private String view;


  /**
   * Month portion of the date used as the basis for the retrieval.
   */
  private String month;


  /**
   * Day portion of the date used as the basis for the retrieval.
   */
  private String day;


  /**
   * Year portion of the date used as the basis for the retrieval.
   */
  private String year;


  /**
   * The subject of the appointment.
   */
  private String subject;


  /**
   * The location of the appointment.
   */
  private String location;


  /**
   * Appointment date.
   */
  private String appointmentDate;


  /**
   * Starting time of the appointment.
   */
  private String startTime;


  /**
   * Ending time of the appointment.
   */
  private String endTime;


  /**
   * Comments.
   */
  private String comments;


  /**
   * List of appointments.
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
   * Accessor for appointment.
   *
   * @return Value of appointment.
   */
  public AppointmentObject getAppointment() {

    return appointment;

  } // End getAppointment().


  /**
   * Mutator for view.
   *
   * @param inView New value for view.
   */
  public void setView(final String inView) {

    view = inView;

  } // End setView().


  /**
   * Accessor for view.
   *
   * @return Value of view.
   */
  public String getView() {

    return view;

  } // End getView().


  /**
   * Mutator for month.
   *
   * @param inMonth New value for month.
   */
  public void setMonth(final String inMonth) {

    month = inMonth;

  } // End setMonth().


  /**
   * Accessor for month.
   *
   * @return Value of month.
   */
  public String getMonth() {

    return month;

  } // End getMonth().


  /**
   * Mutator for day.
   *
   * @param inDay New value for day.
   */
  public void setDay(final String inDay) {

    day = inDay;

  } // End setDay().


  /**
   * Accessor for day.
   *
   * @return Value of day.
   */
  public String getDay() {

    return day;

  } // End getDay().


  /**
   * Mutator for year.
   *
   * @param inYear New value for year.
   */
  public void setYear(final String inYear) {

    year = inYear;

  } // End setYear().


  /**
   * Accessor for year.
   *
   * @return Value of year.
   */
  public String getYear() {

    return year;

  } // End getYear().


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
   * Mutator for location.
   *
   * @param inLocation New value for location.
   */
  public void setLocation(final String inLocation) {

    location = inLocation;

  } // End setLocation().


  /**
   * Accessor for location.
   *
   * @return Value of location.
   */
  public String getLocation() {

    return location;

  } // End getLocation().


  /**
   * Mutator for appointmentDate.
   *
   * @param inAppointmentDate New value for appointmentDate.
   */
  public void setAppointmentDate(final String inAppointmentDate) {

    appointmentDate = inAppointmentDate;

  } // End setAppointmentDate().


  /**
   * Accessor for appointmentDate.
   *
   * @return Value of appointmentDate.
   */
  public String getAppointmentDate() {

    return appointmentDate;

  } // End getAppointmentDate().


  /**
   * Mutator for startTime.
   *
   * @param inStartTime New value for startTime.
   */
  public void setStartTime(final String inStartTime) {

    startTime = inStartTime;

  } // End setStartTime().


  /**
   * Accessor for startTime.
   *
   * @return Value of startTime.
   */
  public String getStartTime() {

    return startTime;

  } // End getStartTime().


  /**
   * Mutator for endTime.
   *
   * @param inEndTime New value for endTime.
   */
  public void setEndTime(final String inEndTime) {

    endTime = inEndTime;

  } // End setEndTime().


  /**
   * Accessor for endTime.
   *
   * @return Value of endTime.
   */
  public String getEndTime() {

    return endTime;

  } // End getEndTime().


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
   * Accessor for appointments.
   *
   * @return Value of appointments.
   */
  public List getAppointments() {

    return appointments;

  } // End getAppointments().


  /**
   * execute() (to fulfill interface contract).
   *
   * @return null.
   */
  public String execute() {

    return null;

  } // End execute().


  /**
   * Create new appointment.
   *
   * @return result.
   */
  public String create() {

    log.info("\n\n----------------------------------------------------------");

    log.debug("AppointmentAction.create()...");

    // Display incoming request parameters.
    log.info("AppointmentAction : " + this.toString());

    // Call on the AppointmentDAO to save the AppointmentObject instance we are
    // about to create and populate.
    AppointmentObject appt = getAppointmentObject();
    AppointmentDAO    dao  = new AppointmentDAO();
    // Need to override the createdDT that was populated by
    // getAppointmentObject().
    appt.setCreatedDT(new Date().getTime());
    dao.appointmentCreate(appt);

    log.debug("AppointmentAction.create() Done");

    return Action.SUCCESS;

  } // End create().


  /**
   * Retrieve an appointment for editing.
   *
   * @return result.
   */
  public String retrieve() {

    log.info("\n\n----------------------------------------------------------");

    log.debug("AppointmentAction.retrieve()...");

    // Display incoming request parameters.
    log.info("AppointmentAction : " + this.toString());

    // Retrieve the appointment for the specified user created on the specified
    // date at the specified time.
    AccountObject  account  = (AccountObject)session.get("account");
    String         username = account.getUsername();
    AppointmentDAO dao      = new AppointmentDAO();
    appointment = dao.appointmentRetrieve(username, createdDT);
    log.debug("AppointmentAction : " + this.toString());

    log.debug("AppointmentAction.retrieve() Done");

    return Action.SUCCESS;

  } // End retrieve().


  /**
   * Updating existing appointment.
   *
   * @return result.
   */
  public String update() {

    log.info("\n\n----------------------------------------------------------");

    log.debug("AppointmentAction.update()...");

    // Display incoming request parameters.
    log.info("AppointmentAction : " + this.toString());

    // Call on the AppointmentDAO to save the AppointmentObject instance we are
    // about to create and populate.
    AppointmentObject appt = getAppointmentObject();
    AppointmentDAO    dao  = new AppointmentDAO();
    dao.appointmentUpdate(appt);

    log.debug("AppointmentAction.update() Done");

    return Action.SUCCESS;

  } // End update().


  /**
   * Delete appointment.
   *
   * @return result.
   */
  public String delete() {

    log.info("\n\n----------------------------------------------------------");

    log.debug("AppointmentAction.delete()...");

    // Display incoming request parameters.
    log.info("AppointmentAction : " + this.toString());

    // Call on the AppointmentDAO to delete the AppointmentObject instance we
    // are about tocreate and populate.
    AccountObject     account  = (AccountObject)session.get("account");
    String            username = account.getUsername();
    AppointmentDAO    dao      = new AppointmentDAO();
    AppointmentObject appt     = new AppointmentObject();
    appt.setCreatedDT(createdDT);
    appt.setUsername(username);
    dao.appointmentDelete(appt);

    log.debug("AppointmentAction.delete() Done");

    return Action.SUCCESS;

  } // End delete().


  /**
   * List appointments.
   *
   * @return                result.
   * @throws ParseException If the incoming date cannot be parsed.
   */
  public String list() throws ParseException {

    log.info("\n\n----------------------------------------------------------");

    log.debug("AppointmentAction.list()...");

    AccountObject    account  = (AccountObject)session.get("account");
    String           username = account.getUsername();
    AppointmentDAO   dao      = new AppointmentDAO();
    Date             d        = null;
    SimpleDateFormat sdf      = new SimpleDateFormat();
    sdf.applyPattern("MM/dd/yyyy");
    d = sdf.parse(month + "/" + day + "/" + year);
    appointments = dao.appointmentList(username, d, view);
    log.debug("AppointmentAction : " + this.toString());

    log.debug("AppointmentAction.list() Done");

    return Action.SUCCESS;

  } // End list().


  /**
   * This method is called form both save() and update() to get a populated
   * AppointmentObject instance.  This saves a lot of duplicate code in both
   * methods.
   *
   * @return The fully-populated AppointmentObject.
   */
  private AppointmentObject getAppointmentObject() {

    AccountObject     account  = (AccountObject)session.get("account");
    String            username = account.getUsername();
    AppointmentObject appt     = new AppointmentObject();
    appt.setUsername(username);
    appt.setCreatedDT(createdDT);
    appt.setSubject(subject);
    appt.setLocation(location);
    appt.setAppointmentDate(appointmentDate);
    appt.setStartTime(startTime);
    appt.setEndTime(endTime);
    appt.setComments(comments);
    return appt;

  } // End getAppointmentObject();


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
