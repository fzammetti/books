package com.apress.ajaxprojects.photoshare.actions;


import com.apress.ajaxprojects.photoshare.dao.PhotoShareDAO;
import java.io.IOException;
import java.io.PrintWriter;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * This class deletes a specified photo.
 */
public class DeletePhoto extends Action {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(DeletePhoto.class);


  /**
   * Called by ActionDispatched to delete a photo.
   *
   * @return Result.
   */
  public String execute() {

    log.info("Entry...");

    // Display incoming parameters.
    String filename   = (String)(getRequest().getParameter("filename"));
    String collection = (String)(getRequest().getParameter("collection"));
    log.info("filename = " + filename);
    log.info("collection = " + collection);

    // Call on DAO to delete photo.
    PhotoShareDAO dao = PhotoShareDAO.getInstance();
    String result = dao.deletePhoto(getServletContext(), filename, collection);
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
