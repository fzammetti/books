package com.apress.dwrprojects.reportal;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.dao.DataIntegrityViolationException;


/**
 * This class performs operations dealing with report maintenance.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class ReportWorker {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(ReportWorker.class);


  /**
   * SQL for getting the list of all reports.
   */
  private static String SQL_GET_REPORTS_LIST =
    "SELECT * FROM reports";


  /**
   * SQL for adding a report to the portal.
   */
  private static String SQL_ADD_REPORT_TO_PORTAL =
    "INSERT INTO reports (reportname, description, groups, reportxml, " +
    "datasourcename) VALUES(" +
    "'${reportname}', '${description}', '${groups}', '${reportxml}', " +
    "'${datasourcename}')";


  /**
   * SQL for deleting a report.  There are in fact two of them we need to
   * delete, one in the reports table, potential one or more in the
   * schedules table.
   */
  private static String SQL_DELETE_REPORT_1 =
    "DELETE FROM reports WHERE reportname='${reportname}'";
  private static String SQL_DELETE_REPORT_2 =
    "DELETE FROM schedules WHERE reportname='${reportname}'";


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
   * This method is called to get the list of reports on the system.
   *
   * @param  inRequest The request object being serviced.
   * @return           A List of ReportDescriptor objects, one for each report
   *                   on the portal.
   * @throws Exception If anything goes wrong.
   */
  @SuppressWarnings("unchecked")
  public List<ReportDescriptor> getReportsList(
    final HttpServletRequest inRequest) throws Exception {

    log.trace("getReportsList() - Entry");

    try {

      // Query database for list of reports.
      List<Map> reports = databaseWorker.executeQuery(SQL_GET_REPORTS_LIST,
        new HashMap());
      List<ReportDescriptor> reportList = new ArrayList<ReportDescriptor>();

      // Iterate over returned records.
      for (Map m : reports) {
        // First, make sure the user can see this report.
        boolean userCanSeeReport = false;
        String reportGroups = (String)m.get("GROUPS");
        if (reportGroups.indexOf("AllUsers") != -1) {
          userCanSeeReport = true;
        } else {
          List<String> groupsUserIsIn =
            (ArrayList)inRequest.getSession().getAttribute("groups");
          if (groupsUserIsIn != null) {
            for (String s : groupsUserIsIn) {
              if (reportGroups.indexOf(s) != -1) {
                userCanSeeReport = true;
              }
            }
          }
        }

        // Construct ReportDescriptor for each.
        if (userCanSeeReport) {
          ReportDescriptor report = new ReportDescriptor();
          report.setReportName((String)m.get("REPORTNAME"));
          report.setDescription((String)m.get("DESCRIPTION"));
          report.setGroups(reportGroups);
          report.setReportXML((String)m.get("REPORTXML"));
          // Add ReportDescriptor to list.
          reportList.add(report);
        }
      }

      // Log and return.
      if (log.isDebugEnabled()) {
        log.debug("getReportsList() - reportList = " + reportList);
      }
      log.trace("getReportsList() - Exit");
      return reportList;

    } catch (Exception e) {
      e.printStackTrace();
      throw e;
    }

  } // End getReportsList().


  /**
   * This method is called to add a report to the portal.
   *
   * @param  inReport  The ReportDescriptor object describing the new report.
   * @param  inRequest The request object being serviced.
   * @return           The updated List of reports.
   * @throws Exception If anything goes wrong.
   */
  public List<ReportDescriptor> addReportToPortal(
    final ReportDescriptor inReport, final HttpServletRequest inRequest)
    throws Exception {

    log.trace("addReportToPortal() - Entry");

    try {

      if (log.isDebugEnabled()) {
        log.debug("addReportToPortal() - inReport = " + inReport);
      }

      // Create map of replacement tokens for SQL statement from incoming
      // ReportDescriptor object.
      Map<String, String> tokens = new HashMap<String, String>();
      tokens.put("reportname", inReport.getReportName());
      tokens.put("description", inReport.getDescription());
      tokens.put("groups", inReport.getGroups());
      tokens.put("reportxml", inReport.getReportXML());
      tokens.put("datasourcename", inReport.getDataSourceName());

      // Execute the insert query.
      databaseWorker.executeUpdate(SQL_ADD_REPORT_TO_PORTAL, tokens);

      // Now get an update list of reports for the UI and return it.
      log.trace("addReportToPortal() - Exit");
      return getReportsList(inRequest);

    } catch (DataIntegrityViolationException dive) {
      throw new Exception("Report could not be created.\n\n" +
        "(Does the report already exist?)");
    } catch (Exception e) {
      e.printStackTrace();
      throw e;
    }

  } // End addReportToPortal().


  /**
   * This method is called to remove a report from the portal.
   *
   * @return            A List of ReportDescriptor objects, one for each report
   *                    on the portal.
   * @param  inUsername The name of the report to remove.
   * @param  inRequest  The request object being serviced.
   * @throws Exception  If anything goes wrong.
   */
  public List<ReportDescriptor> removeReportFromPortal(
    final String inReportName, final HttpServletRequest inRequest)
    throws Exception {

    log.trace("removeReportFromPortal() - Entry");

    try {

      if (log.isDebugEnabled()) {
        log.debug("removeReportFromPortal() - inReportName = " + inReportName);
      }

      // Create map of replacement tokens for SQL statement.
      Map<String, String> tokens = new HashMap<String, String>();
      tokens.put("reportname", inReportName);

      // Execute the delete query.  Remember, there's two of them!
      databaseWorker.executeUpdate(SQL_DELETE_REPORT_1, tokens);
      databaseWorker.executeUpdate(SQL_DELETE_REPORT_2, tokens);

      // Now get an update list of reports for the UI and return it.
      log.trace("removeReportFromPortal() - Exit");
      return getReportsList(inRequest);

    } catch (Exception e) {
      e.printStackTrace();
      throw e;
    }

  } // End removeReportFromPortal().


} // End class.
