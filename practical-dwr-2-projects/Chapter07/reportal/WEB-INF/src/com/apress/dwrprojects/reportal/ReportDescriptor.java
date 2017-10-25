package com.apress.dwrprojects.reportal;


/**
 * This is a simple VO class that describes a report known to the system.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class ReportDescriptor {


  /**
   * The name of the report.
   */
  private String reportName;


  /**
   * A description of the report.
   */
  private String description;


  /**
   * The list of groups that can access the report.
   */
  private String groups;


  /**
   * The XML of the report.
   */
  private String reportXML;


  /**
   * The name of the data source to run the report against.
   */
  private String dataSourceName;


  /**
   * Mutator for reportName.
   *
   * @param inReportName New value for reportName.
   */
  public void setReportName(final String inReportName) {

    reportName = inReportName;

  } // End setReportName().


  /**
   * Accessor for reportName.
   *
   * @return Value of reportName.
   */
  public String getReportName() {

    return reportName;

  } // End getReportName().


  /**
   * Mutator for description.
   *
   * @param inDescription New value for description.
   */
  public void setDescription(final String inDescription) {

    description = inDescription;

  } // End setDescription().


  /**
   * Accessor for description.
   *
   * @return Value of description.
   */
  public String getDescription() {

    return description;

  } // End getDescription().


  /**
   * Mutator for groups.
   *
   * @param inGroups New value for groups.
   */
  public void setGroups(final String inGroups) {

    groups = inGroups;

  } // End setGroups().


  /**
   * Accessor for groups.
   *
   * @return Value of groups.
   */
  public String getGroups() {

    return groups;

  } // End getGroups().


  /**
   * Mutator for reportXML.
   *
   * @param inReportXML New value for reportXML.
   */
  public void setReportXML(final String inReportXML) {

    reportXML = inReportXML;

  } // End setReportXML().


  /**
   * Accessor for reportXML.
   *
   * @return Value of reportXML.
   */
  public String getReportXML() {

    return reportXML;

  } // End getReportXML().


  /**
   * Mutator for dataSourceName.
   *
   * @param inDataSourceName New value for dataSourceName.
   */
  public void setDataSourceName(final String inDataSourceName) {

    dataSourceName = inDataSourceName;

  } // End setDataSourceName().


  /**
   * Accessor for dataSourceName.
   *
   * @return Value of dataSourceName.
   */
  public String getDataSourceName() {

    return dataSourceName;

  } // End getDataSourceName().


  /**
   * Overriden toString method.
   *
   * @return A reflexively-built string representation of this bean.
   */
  public String toString() {

    String str = null;
    StringBuffer sb = new StringBuffer(1000);
    sb.append("[").append(super.toString()).append("]={");
    boolean firstPropertyDisplayed = false;
    try {
      java.lang.reflect.Field[] fields = this.getClass().getDeclaredFields();
      for (int i = 0; i < fields.length; i++) {
        if (firstPropertyDisplayed) {
          sb.append(", ");
        } else {
          firstPropertyDisplayed = true;
        }
        sb.append(fields[i].getName()).append("=").append(fields[i].get(this));
      }
      sb.append("}");
      str = sb.toString().trim();
    } catch (IllegalAccessException iae) {
      iae.printStackTrace();
    }
    return str;

  } // End toString().


} // End class.
