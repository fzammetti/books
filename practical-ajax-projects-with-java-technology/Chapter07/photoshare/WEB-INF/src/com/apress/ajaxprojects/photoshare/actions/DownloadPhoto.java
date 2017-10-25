package com.apress.ajaxprojects.photoshare.actions;


import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * This class rotates a specified photo 90 degrees clockwise.  After this
 * executes, the RetrievePhoto Action will be executed to return the
 * rotated photo.
 */
public class DownloadPhoto extends Action {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(RotatePhoto.class);


  /**
   * Called by ActionDispatched to download a photo.
   *
   * @return Result.
   */
  public String execute() {

    log.info("Entry...");

    // Display incoming parameters.
    String filename = (String)(getRequest().getParameter("filename"));
    log.info("filename = " + filename);

    // Just set the Content-Disposition to attachment, with a filename
    // matching that of the photo the user wants to download, and then
    // forward to the photo file itself.  Done!
    getResponse().setHeader("Content-Disposition", "attachment;" +
      "filename=\"" + filename + "\"");


    log.info("Exit...");

    return "/photos/" + filename;

  } // End execute().


} // End class.
