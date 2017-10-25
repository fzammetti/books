package com.apress.dwrprojects.timekeeper;


import java.text.SimpleDateFormat;
import java.util.List;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.directwebremoting.annotations.RemoteMethod;
import org.directwebremoting.annotations.RemoteProxy;
import org.hibernate.Session;


/**
 * A DAO for working with Project objects.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
@RemoteProxy
public class ProjectDAO {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(ProjectDAO.class);


  /**
   * Called to create a new project.
   *
   * @param  inName           The name of the project.
   * @param  inProjectManager The ID of the user who is project manager
   *                          for the project.
   * @throws Exception        If anything goes wrong.
   */
  @RemoteMethod
  public void addProject(final String inName, final long inProjectManager)
    throws Exception {

    if (log.isTraceEnabled()) {
      log.trace("addProject() - Entry");
    }
    if (log.isDebugEnabled()) {
      log.debug("addProject() - inName = " + inName);
      log.debug("addProject() - inProjectManager = " + inProjectManager);
    }

    // Create and populate Project object.
    Project project = new Project();
    project.setName(inName);
    project.setProjectManager(new Long(inProjectManager));

    // Tell Hibernate to insert it.
    Session session = Utils.getHibernateSession();
    session.beginTransaction();
    session.save(project);
    session.getTransaction().commit();

    // Call method on clients to update screen.
    Utils.callUpdateData();

    if (log.isTraceEnabled()) {
      log.trace("addProject() - Exit");
    }

  } // End addProject().


  /**
   * Called to update an existing project.
   *
   * @param  inFieldToUpdate The field to update.  One of "name" or
   *                         "projectMabager".
   * @param  inID            The ID of the project to update.
   * @param  inNewValue      The new value of the field.
   * @throws Exception       If anything goes wrong.
   */
  @RemoteMethod
  public void updateProject(final String inFieldToUpdate, final long inID,
    final String inNewValue) throws Exception {

    if (log.isTraceEnabled()) {
      log.trace("updateProject() - Entry");
    }
    if (log.isDebugEnabled()) {
      log.debug("updateProject() - inFieldToUpdate = " + inFieldToUpdate);
      log.debug("updateProject() - inID = " + inID);
      log.debug("updateProject() - inNewValue = " + inNewValue);
    }

    // Go get the Project object from the database via Hibernate.
    Project project = getProjectByID(inID);

    // Make the appropriate updates.
    if (inFieldToUpdate.equals("name")) {
      project.setName(inNewValue);
    } else if (inFieldToUpdate.equals("projectManager")) {
      project.setProjectManager(Long.parseLong(inNewValue));
    } else if (inFieldToUpdate.equals("allocatedHours")) {
      project.setAllocatedHours(Integer.parseInt(inNewValue));
    } else if (inFieldToUpdate.equals("targetDate")) {
      project.setTargetDate(
        new SimpleDateFormat("MM/dd/yyyy").parse(inNewValue));
    } else if (inFieldToUpdate.equals("usersAssigned")) {
      project.setUsersAssigned(inNewValue);
    }

    // Have Hibernate write the changes back to the database.
    Session session = Utils.getHibernateSession();
    session.beginTransaction();
    session.update(project);
    session.getTransaction().commit();

    // Call method on clients to update screen.
    Utils.callUpdateData();

    if (log.isTraceEnabled()) {
      log.trace("updateProject() - Exit");
    }

  } // End updateProject().


  /**
   * Called to delete a existing project.
   *
   * @param  inID      The ID of the project to delete.
   * @throws Exception If anything goes wrong.
   */
  @RemoteMethod
  public void deleteProject(final long inID) throws Exception {

    if (log.isTraceEnabled()) {
      log.trace("deleteProject() - Entry");
    }
    if (log.isDebugEnabled()) {
      log.debug("deleteProject() - inID = " + inID);
    }

    // Do the actual deletion.
    Session session = Utils.getHibernateSession();
    session.beginTransaction();
    Project project = (Project)session.createQuery(
      "from Project as project where project.id = ?")
      .setLong(0, inID).uniqueResult();
    session.delete(project);
    session.getTransaction().commit();

    // Call method on clients to update screen.
    Utils.callUpdateData();

    if (log.isTraceEnabled()) {
      log.trace("deleteProject() - Exit");
    }

  } // End deleteProject().


  /**
   * A method to list all projects.
   *
   * @return           A List of all projects known to Timekeeper.
   * @throws Exception If anything goes wrong.
   */
  @RemoteMethod
  @SuppressWarnings("unchecked")
  public List listAllProjects() throws Exception {

    if (log.isTraceEnabled()) {
      log.trace("listAllProjects() - Entry");
    }

    // Get list of projects.
    Session session = Utils.getHibernateSession();
    session.beginTransaction();
    List<Project> projectsList = session.createQuery(
      "from Project as project order by project.name").list();
    session.getTransaction().commit();

    // Now for each, calculate the number of booked hours.
    for (Project p : projectsList) {
      p.setBookedHours(new TimesheetDAO().getBookedTimeForProject(p.getId()));
    }

    if (log.isDebugEnabled()) {
      log.debug("listAllProjects() - projectsList = " + projectsList);
    }
    if (log.isTraceEnabled()) {
      log.trace("listAllProjects() - Exit");
    }
    return projectsList;

  } // End listAllProjects().


  /**
   * A method to retrieve a project by ID.
   *
   * @param  inID      The ID to retrieve.
   * @return           A Project object, or null if not found.
   * @throws Exception If anything goes wrong.
   */
  @RemoteMethod
  public Project getProjectByID(final long inID) throws Exception {

    if (log.isTraceEnabled()) {
      log.trace("getProjectByID() - Entry");
    }
    if (log.isDebugEnabled()) {
      log.trace("getProjectByID() - inID = " + inID);
    }

    // Get the project.
    Session session = Utils.getHibernateSession();
    session.beginTransaction();
    Project project = (Project)session.createQuery(
      "from Project as project where project.id = ?")
      .setLong(0, inID).uniqueResult();
    session.getTransaction().commit();

    if (log.isDebugEnabled()) {
      log.debug("getProjectByID() - project = " + project);
    }
    if (log.isTraceEnabled()) {
      log.trace("getProjectByID() - Exit");
    }
    return project;

  } // End getProjectByID().


} // End class.
