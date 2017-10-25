package com.apress.ajaxprojects.photoshare.actions;


import com.apress.ajaxprojects.photoshare.dao.PhotoShareDAO;
import java.io.IOException;
import java.io.PrintWriter;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * This class deletes a specified collection.
 */
public class DeleteCollection extends Action {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(DeleteCollection.class);


  /**
   * This is called to delete a collection.
   *
   * @return Result.
   */
  public String execute() {

    log.info("Entry...");

    // Display incoming parameters.
    String name = (String)(getRequest().getParameter("name"));
    log.info("name = " + name);

    // Call on DAO to delete collection and write out the collections.xml file.
    PhotoShareDAO dao = PhotoShareDAO.getInstance();
    String result = dao.deleteCollection(getServletContext(), name);
    try {
      getResponse().setContentType("text/plain");
      PrintWriter out = getResponse().getWriter();
      out.println(result);
      out.flush();
    } catch (IOException ioe) {
      ioe.printStackTrace();
      log.error("Unable to write response.  See log for details.");
    }

    log.info("Exit");

    return null;

  } // End execute().


} // End class.
