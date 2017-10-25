package com.apress.ajaxprojects.theorganizer.daos;


import com.apress.ajaxprojects.theorganizer.Globals;
import com.apress.ajaxprojects.theorganizer.objects.AppointmentObject;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;


/**
 * Data Access Object (DAO) for working with Appointments.
 */
public class AppointmentDAO {


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
  public AppointmentDAO() {

    dataSource = new DriverManagerDataSource();
    dataSource.setDriverClassName(Globals.dbDriver);
    dataSource.setUrl(Globals.dbURL);
    dataSource.setUsername(Globals.dbUsername);
    dataSource.setPassword(Globals.dbPassword);

  } // End constructor.


  /**
   * Method to create a new appointment.
   *
   * @param  inAppointment The AppointmentObject instance to create.
   */
  public void appointmentCreate(final AppointmentObject inAppointment) {

    log.debug("AppointmentDAO.appointmentCreate()...");

    log.info("AppointmentObject to create : " + inAppointment);
    JdbcTemplate jt = new JdbcTemplate(dataSource);
    jt.execute(
      "INSERT INTO appointments (" +
      "createddt, username, subject, location, appt_date, start_time, " +
      "end_time, comments" +
      ") VALUES (" +
      "'" + inAppointment.getCreatedDT()       + "', " +
      "'" + inAppointment.getUsername()        + "', " +
      "'" + inAppointment.getSubject()         + "', " +
      "'" + inAppointment.getLocation()        + "', " +
      "'" + inAppointment.getAppointmentDate() + "', " +
      "'" + inAppointment.getStartTime()       + "', " +
      "'" + inAppointment.getEndTime()         + "', " +
      "'" + inAppointment.getComments()        + "'" +
      ")");

    log.debug("AppointmentDAO.appointmentCreate() Done");

  } // End appointmentCreate().


  /**
   * Method to retrieve an appointment.
   *
   * @param  inUsername  The username of the appointment to retrieve.
   * @param  inCreatedDT The date and time, expressed as a long (millis) of
   *                     the appointment to retrieve.
   * @return             An AppointmentObject instance.
   */
  public AppointmentObject appointmentRetrieve(final String inUsername,
    final long inCreatedDT) {

    log.debug("AppointmentDAO.appointmentRetrieve()...");

    log.debug("username to retrieve : " + inUsername);
    JdbcTemplate jt = new JdbcTemplate(dataSource);
    List rows = jt.queryForList(
      "SELECT * FROM appointments WHERE username='" + inUsername + "' and " +
      "createddt='" + inCreatedDT + "'"
    );
    AppointmentObject appointment = null;
    if (rows != null && !rows.isEmpty()) {
      appointment = new AppointmentObject();
      Map m = (Map)rows.get(0);
      appointment.setCreatedDT(((Long)m.get("CREATEDDT")).longValue());
      appointment.setUsername((String)m.get("USERNAME"));
      appointment.setSubject((String)m.get("SUBJECT"));
      appointment.setLocation((String)m.get("LOCATION"));
      appointment.setAppointmentDate((String)m.get("APPT_DATE"));
      appointment.setStartTime((String)m.get("START_TIME"));
      appointment.setEndTime((String)m.get("END_TIME"));
      appointment.setComments((String)m.get("COMMENTS"));
    }
    log.info("Retrieved AppointmentObject : " + appointment);

    log.debug("AppointmentDAO.appointmentRetrieve() Done");
    return appointment;

  } // End appointmentSave().


  /**
   * Method to update an existing appointment.
   *
   * @param inAppointment The AppointmentObject instance to update.
   */
  public void appointmentUpdate(final AppointmentObject inAppointment) {

    log.debug("AppointmentDAO.appointmentUpdate()...");

    log.info("AppointmentObject to update : " + inAppointment);
    JdbcTemplate jt = new JdbcTemplate(dataSource);
    jt.execute(
      "UPDATE appointments SET " +
      "subject='"        + inAppointment.getSubject()         + "', "    +
      "location='"       + inAppointment.getLocation()        + "', "    +
      "appt_date='"      + inAppointment.getAppointmentDate() + "', "    +
      "start_time='"     + inAppointment.getStartTime()       + "', "    +
      "end_time='"       + inAppointment.getEndTime()         + "', "    +
      "comments='"       + inAppointment.getComments()        + "'"      +
      "WHERE username='" + inAppointment.getUsername()        + "' AND " +
      "createddt='"      + inAppointment.getCreatedDT()       + "'"
    );
    log.debug("AppointmentDAO.appointmentUpdate() Done");

  } // End appointmentUpdate().


  /**
   * Method to delete an appointment.
   *
   * @param inAppointment The AppointmentObject instance to delete.
   */
  public void appointmentDelete(final AppointmentObject inAppointment) {

    log.debug("AppointmentDAO.appointmentDelete()...");

    log.info("AppointmentObject to delete : " + inAppointment);
    JdbcTemplate jt = new JdbcTemplate(dataSource);
    jt.execute(
      "DELETE FROM appointments " +
      "WHERE username='"          + inAppointment.getUsername()  + "' AND " +
      "createddt='"               + inAppointment.getCreatedDT() + "'"
    );
    log.debug("AppointmentDAO.appointmentDelete() Done");

  } // End appointmentDelete().


  /**
   * Method to retrieve a List of appointments for the specified user and day.
   *
   * @param  inUsername The username to retrieve appointments for.
   * @param  inDate     The day to retrieve appointments for.
   * @param  inViewType What type of view this is: "DAY", "WEEK",
   *                    "MONTH", or "YEAR".
   * @return            A list of AppointmentObject instances.
   */
  public List appointmentList(final String inUsername, final Date inDate,
    final String inViewType) {

    log.debug("AppointmentDAO.appointmentList()...");

    // Retrieve the list of appointments for the specified user.
    log.debug("Servicing '" + inViewType + "' view...");
    log.debug("username to retrieve appointments for : " + inUsername);
    JdbcTemplate jt = new JdbcTemplate(dataSource);
    List appointments = jt.queryForList(
      "SELECT createddt, subject, location, start_time, end_time, appt_date " +
      "FROM appointments WHERE username='" + inUsername + "' order by " +
      "appt_date, start_time"
    );
    log.info("Retrieved List : " + appointments);

    // Extract the day, week of month, month and year from the requested date.
    GregorianCalendar gc = new GregorianCalendar();
    gc.setTimeInMillis(inDate.getTime());
    int day         = gc.get(Calendar.DATE);
    int month       = gc.get(Calendar.MONTH) + 1;
    int year        = gc.get(Calendar.YEAR);
    int weekOfMonth = gc.get(Calendar.WEEK_OF_MONTH);
    log.debug("day=" + day + ", month=" + month + ", year=" + year);

    // Now build a List of AppointmentObjects from it to return.
    List appointmentsOut = new ArrayList();
    for (Iterator it = appointments.iterator(); it.hasNext();) {
      Map m = (Map)it.next();
      // Extract the day, month and year from the appointment_date field of
      // the current appointment record.
      String appointmentDate = (String)m.get("APPT_DATE");
      int m_month = Integer.parseInt(appointmentDate.substring(0, 2));
      int m_day = Integer.parseInt(appointmentDate.substring(3, 5));
      int m_year = Integer.parseInt(appointmentDate.substring(6, 10));
      int m_weekOfMonth = (new GregorianCalendar(
        m_year, m_month - 1, m_day)).get(Calendar.WEEK_OF_MONTH);
      log.debug("m_day=" + m_day + ", m_month=" + m_month + ", m_year=" +
        m_year);
      boolean takeIt = false;
      // If servicing day view, make sure the day, month and year all match.
      if (inViewType.equalsIgnoreCase("day")) {
        if (day == m_day && month == m_month && year == m_year) {
          takeIt = true;
        }
      }
      // If servicing week view, make sure the month and year both match, and
      // that the day falls in the same week as the requested date.
      if (inViewType.equalsIgnoreCase("week")) {
        if (month == m_month && year == m_year &&
          weekOfMonth == m_weekOfMonth) {
          takeIt = true;
        }
      }
      // If servicing month view, make sure the month and year both match.
      if (inViewType.equalsIgnoreCase("month")) {
        if (month == m_month && year == m_year) {
          takeIt = true;
        }
      }
      // If servicing year view, make sure the year matches.
      if (inViewType.equalsIgnoreCase("year")) {
        if (year == m_year) {
          takeIt = true;
        }
      }
      // If takeIt is true, this is an appointment we need to return.
      if (takeIt) {
        AppointmentObject appointment = new AppointmentObject();
        appointment.setCreatedDT(((Long)m.get("CREATEDDT")).longValue());
        appointment.setUsername(inUsername);
        appointment.setAppointmentDate((String)m.get("APPT_DATE"));
        appointment.setSubject((String)m.get("SUBJECT"));
        appointment.setLocation((String)m.get("LOCATION"));
        appointment.setStartTime((String)m.get("START_TIME"));
        appointment.setEndTime((String)m.get("END_TIME"));
        appointmentsOut.add(appointment);
      }
    }
    log.info("appointmentOut List : " + appointmentsOut);

    log.debug("AppointmentDAO.appointmentList() Done");
    return appointmentsOut;

  } // End appointmentList().


} // End class.
