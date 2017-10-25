package com.apress.dwrprojects.reportal;


import java.sql.Time;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.StringTokenizer;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.quartz.impl.StdSchedulerFactory;
import org.quartz.JobDataMap;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.SchedulerFactory;
import org.quartz.Trigger;
import org.quartz.TriggerUtils;


/**
 * This class performs operations dealing with report scheduling.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class ReportSchedulingWorker {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(ReportSchedulingWorker.class);


  /**
   * Quartz Scheduler instance used to run scheduled reports.
   */
  private static Scheduler sched;


  /**
   * SQL for getting the list of all scheduled reports.
   */
  private static String SQL_GET_SCHEDULED_REPORTS_LIST =
    "SELECT * FROM schedules";


  /**
   * SQL for adding a report to the schedule.
   */
  private static String SQL_ADD_REPORT_TO_SCHEDULE =
    "INSERT INTO schedules (reportname, scheduledby, daysofweek, runtime) " +
    "VALUES('${reportname}', '${scheduledby}', '${daysofweek}', " +
    "'${runtime}')";


  /**
   * SQL for deleting a report from the schedule.
   */
  private static String SQL_DELETE_REPORT_FROM_SCHEDULE =
    "DELETE FROM schedules WHERE reportname='${reportname}' AND " +
    "daysofweek='${daysofweek}' AND runtime='${runtime}'";


  /**
   * SQL to get the generated report output of a scheduled report run.
   */
  private static String SQL_GET_SCHEDULED_RUN =
    "SELECT lastrunoutput FROM schedules WHERE reportname='${reportname}' " +
    "AND daysofweek='${daysofweek}' AND runtime='${runtime}'";


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
   * This method returns a List of ReportScheduleDescriptor objects that is the
   * list of reports currently scheduled on the system.
   *
   * @return            A List of ReportScheduleDescriptor objects, one for
   *                    each report that is currently scheduled.
   * @throws Exception  If anything goes wrong.
   */
  @SuppressWarnings("unchecked")
  public List<ReportScheduleDescriptor> getScheduledReportsList()
    throws Exception  {

    log.trace("getScheduledReportsList() - Entry");

    try {

      // Query database for list of scheduled reports.
      List<Map> reports = databaseWorker.executeQuery(
        SQL_GET_SCHEDULED_REPORTS_LIST, new HashMap());
      List<ReportScheduleDescriptor> reportList =
        new ArrayList<ReportScheduleDescriptor>();

      // Iterate over returned records.
      for (Map m : reports) {
        // Construct ReportScheduleDescriptor for each.
        ReportScheduleDescriptor report = new ReportScheduleDescriptor();
        report.setReportName((String)m.get("REPORTNAME"));
        report.setScheduledBy((String)m.get("SCHEDULEDBY"));
        report.setDaysOfWeek((String)m.get("DAYSOFWEEK"));
        report.setRunTime((Time)m.get("RUNTIME"));
        report.setLastRun((String)m.get("LASTRUN"));
        report.setLastRunStatus((String)m.get("LASTRUNSTATUS"));
        // Add ReportScheduleDescriptor to list.
        reportList.add(report);
      }

      // Log and return.
      if (log.isDebugEnabled()) {
        log.debug("getScheduledReportsList() - reportList = " + reportList);
      }
      log.trace("getScheduledReportsList() - Exit");
      return reportList;

    } catch (Exception e) {
      e.printStackTrace();
      throw e;
    }

  } // End getScheduledReportsList().


  /**
   * This method adds a report to the schedule.
   *
   * @param  inReportScheduleDescriptor A ReportScheduleDescriptor object for
   *                                    the report to add to the schedule.
   * @return                            A List of ReportScheduleDescriptor
   *                                    objects, one for each report that is
   *                                    currently scheduled.
   * @throws Exception                  If anything goes wrong.
   */
  @SuppressWarnings("unchecked")
  public List<ReportScheduleDescriptor> addReportToSchedule(
    final ReportScheduleDescriptor inReportScheduleDescriptor)
    throws Exception {

    log.trace("addReportToSchedule() - Entry");

    try {

      if (log.isDebugEnabled()) {
        log.debug("addReportToSchedule() - inReportScheduleDescriptor = " +
          inReportScheduleDescriptor);
      }

      // Create map of replacement tokens for SQL statement from incoming
      // ReportScheduleDescriptor object.
      Map tokens = new HashMap();
      tokens.put("reportname", inReportScheduleDescriptor.getReportName());
      tokens.put("scheduledby", inReportScheduleDescriptor.getScheduledBy());
      tokens.put("daysofweek", inReportScheduleDescriptor.getDaysOfWeek());
      tokens.put("runtime", inReportScheduleDescriptor.getRunTime().toString());

      // Execute the insert query.
      databaseWorker.executeUpdate(SQL_ADD_REPORT_TO_SCHEDULE, tokens);

      // Add the job to Quartz so it'll actually run.
      addQuartzJob(inReportScheduleDescriptor);

      // Now get an update list of scheduled reports for the UI and return it.
      log.trace("addReportToSchedule() - Exit");
      return getScheduledReportsList();

    } catch (Exception e) {
      e.printStackTrace();
      throw e;
    }

  } // End addReportToSchedule().


  /**
   * This method removes a report from the schedule.
   *
   * @param  inReportName The name of the report to remove from the schedule.
   * @param  inDaysOfWeek The days of the week the report is scheduled to run.
   * @param  inRunTime    The time the report is scheduled to run.
   * @return              A List of ReportScheduleDescriptor objects, one for
   *                      each report that is currently scheduled.
   * @throws Exception    If anything goes wrong.
   */
  public List<ReportScheduleDescriptor> removeReportFromSchedule(
    final String inReportName, final String inDaysOfWeek,
    final String inRunTime) throws Exception {

    log.trace("removeReportFromSchedule() - Entry");

    try {

      if (log.isDebugEnabled()) {
        log.debug("removeReportFromSchedule() - inReportName = " +
          inReportName);
        log.debug("removeReportFromSchedule() - inDaysOfWeek = " +
          inDaysOfWeek);
        log.debug("removeReportFromSchedule() - inRunTime = " +
          inRunTime);
      }

      // Create map of replacement tokens for SQL statement.
      Map<String, String> tokens = new HashMap<String, String>();
      tokens.put("reportname", inReportName);
      tokens.put("daysofweek", inDaysOfWeek);
      tokens.put("runtime", inRunTime);

      // Execute the delete query.
      databaseWorker.executeUpdate(SQL_DELETE_REPORT_FROM_SCHEDULE, tokens);

      // Now delete the report from Quartz.  To do this, we need to delete
      // all the instances of it, one for each day it was scheduled to run.
      // The name needs to be calculated to do this.
      StringTokenizer st = new StringTokenizer(inRunTime, ":");
      String hour = st.nextToken();
      String minute = st.nextToken();
      st = new StringTokenizer(inDaysOfWeek, ",");
      while (st.hasMoreTokens()) {
        String day = st.nextToken();
        String reportName = inReportName + hour + minute + day;
        if (log.isDebugEnabled()) {
          log.debug("removeReportFromSchedule() - Delete from Quartz: " +
            sched.deleteJob(reportName, null));
        }
      }

      // Now get an update list of scheduled reports for the UI and return it.
      log.trace("removeReportFromSchedule() - Exit");
      return getScheduledReportsList();

    } catch (Exception e) {
      e.printStackTrace();
      throw e;
    }

  } // End removeReportFromSchedule().


  /**
   * Called on application startup to get Quartz ready to run scheduled reports.
   *
   * @throws Exception If anything goes wrong.
   */
  public void startScheduler() throws Exception {

    log.trace("startScheduler() - Entry");

    // Start the scheduler.
    SchedulerFactory schedFact = new StdSchedulerFactory();
    sched = schedFact.getScheduler();
    sched.start();

    // Get details of scheduled reports from database.
    List<ReportScheduleDescriptor> scheduledReports = getScheduledReportsList();

    // For each scheduled report, set it up in the scheduler.
    for (ReportScheduleDescriptor rsd : scheduledReports) {
      addQuartzJob(rsd);
    }

    log.trace("startScheduler() - Exit");

  } // End startScheduler().


  /**
   * Called to add a report to the Quartz scheduler.
   *
   * @param  inRSD     The ReportScheduleDescriptor for the report to add.
   * @throws Exception If anything goes wrong.
   */
  private void addQuartzJob(final ReportScheduleDescriptor inRSD)
    throws Exception {

    log.trace("addQuartzJob() - Entry");

    if (log.isDebugEnabled()) {
      log.debug("addQuartzJob() - inRSD = " + inRSD);
    }

    // Need a Calendar descendant set to the run time of the report for the
    // work to come later.
    GregorianCalendar gc = new GregorianCalendar();
    gc.setTime(inRSD.getRunTime());

    // Create a job for the report for each day its scheduled to run.
    StringTokenizer st = new StringTokenizer(inRSD.getDaysOfWeek(), ",");
    while (st.hasMoreTokens()) {

      // Calculate name of report for Quartz purposes.
      String nextDay = st.nextToken();
      String reportName = inRSD.getReportName() + gc.get(Calendar.HOUR_OF_DAY) +
        gc.get(Calendar.MINUTE) + nextDay;
      if (log.isDebugEnabled()) {
        log.debug("addQuartzJob() - reportName = " + reportName);
      }

      // Create JobDetail for this entry.
      JobDetail jobDetail =
        new JobDetail(reportName, null, ReportRunner.class);
      JobDataMap dataMap = jobDetail.getJobDataMap();
      dataMap.put("reportName", inRSD.getReportName());
      dataMap.put("runTime", inRSD.getRunTime().toString());
      dataMap.put("daysOfWeek", inRSD.getDaysOfWeek());

      // Convert day of week to day code.
      int day = 0;
      if (nextDay.equalsIgnoreCase("SUN")) { day = 1; }
      if (nextDay.equalsIgnoreCase("MON")) { day = 2; }
      if (nextDay.equalsIgnoreCase("TUE")) { day = 3; }
      if (nextDay.equalsIgnoreCase("WED")) { day = 4; }
      if (nextDay.equalsIgnoreCase("THU")) { day = 5; }
      if (nextDay.equalsIgnoreCase("FRI")) { day = 6; }
      if (nextDay.equalsIgnoreCase("SAT")) { day = 7; }

      if (log.isDebugEnabled()) {
        log.debug("addQuartzJob() - day = " + day);
        log.debug("addQuartzJob() - hour = " + gc.get(Calendar.HOUR_OF_DAY));
        log.debug("addQuartzJob() - minute = " + gc.get(Calendar.MINUTE));
      }

      // Set up a trigger for the report.
      Trigger trigger = TriggerUtils.makeWeeklyTrigger(day,
        gc.get(Calendar.HOUR_OF_DAY), gc.get(Calendar.MINUTE));
      trigger.setStartTime(new Date());
      trigger.setName(reportName + "_Trigger");

      // Add job to scheduler.
      sched.scheduleJob(jobDetail, trigger);
    }

    log.trace("addQuartzJob() - Exit");

  } // End addQuartzJob().


  /**
   * Called to view the output of a scheduled report run.
   *
   * @param  inReportName The name of the report to view.
   * @param  inDaysOfWeek The days of the week the report is scheduled to run.
   * @param  inRunTime    The time the report is scheduled to run.
   * @return              A string of HTML that is the report output.
   * @throws Exception    If anything goes wrong.
   */
  @SuppressWarnings("unchecked")
  public String viewScheduledRun(
    final String inReportName, final String inDaysOfWeek,
    final String inRunTime) throws Exception {

    log.trace("viewScheduledRun() - Entry");

    try {

      if (log.isDebugEnabled()) {
        log.debug("viewScheduledRun() - inReportName = " +
          inReportName);
        log.debug("viewScheduledRun() - inDaysOfWeek = " +
          inDaysOfWeek);
        log.debug("viewScheduledRun() - inRunTime = " +
          inRunTime);
      }

      // Create map of replacement tokens for SQL statement.
      Map<String, String> tokens = new HashMap<String, String>();
      tokens.put("reportname", inReportName);
      tokens.put("daysofweek", inDaysOfWeek);
      tokens.put("runtime", inRunTime);

      // Execute the delete query.
      List<Map> records = databaseWorker.executeQuery(
        SQL_GET_SCHEDULED_RUN, tokens);

      log.trace("viewScheduledRun() - Exit");
      return (String)((Map)records.get(0)).get("LASTRUNOUTPUT");

    } catch (Exception e) {
      e.printStackTrace();
      throw e;
    }

  } // End viewScheduledRun().


} // End class.
