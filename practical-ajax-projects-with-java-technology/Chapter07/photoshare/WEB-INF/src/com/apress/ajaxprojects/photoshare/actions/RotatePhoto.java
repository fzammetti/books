package com.apress.ajaxprojects.photoshare.actions;


import imagehelper.ImageHelper;
import java.awt.Color;
import java.awt.Image;
import java.awt.Toolkit;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileFilter;
import java.io.PrintWriter;
import java.util.Date;
import javax.imageio.ImageIO;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * This class rotates a specified photo 90 degrees clockwise.  After this
 * executes, the RetrievePhoto Action will be executed to return the
 * rotated photo.
 */
public class RotatePhoto extends Action {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(RotatePhoto.class);


  /**
   * Called by ActionDispatched to rotate a photo.
   *
   * @return Result.
   */
  public String execute() {

    log.info("Entry...");

    try {

      // Display incoming parameters.
      String filename = (String)(getRequest().getParameter("filename"));
      String degrees = (String)(getRequest().getParameter("degrees"));
      log.info("filename = " + filename);
      log.info("degrees = " + degrees);

      // Path to image.
      String path = getServletContext().getRealPath("photos") + File.separator;
      log.info("path (to photo file) = " + path + filename);

      // Load the image.
      Image image = Toolkit.getDefaultToolkit().getImage(path + filename);
      ImageHelper ih = new ImageHelper();
      BufferedImage bImage = ih.toBufferedImage(image);
      // 0 indicates the image is being rotated from 280 degrees to 360
      // degrees, i.e., back to its normal rotation, but passing 0 will
      // cause an exception, so we only want to rotate when the degrees
      // is NOT 0.  In all other cases, we are basically just writing the
      // file out normally as a JPG (whether it was to start or not).
      if (!degrees.equalsIgnoreCase("0")) {
        bImage = ih.rotate(bImage, Double.parseDouble(degrees), Color.WHITE);
      }

      // Delete any existing temp file(s), if any, and write out photo to
      // temp file.
      deleteTempFiles();
      String tempFilename = "tempPhoto_" +
        (new Date().toString()).replace(' ', '_').replace(':', '_') + ".jpg";
      File f = new File(path + tempFilename);
      ImageIO.write(bImage, "jpg", f);

      // Write our response.  It's just the name of the temp file.
      getResponse().setContentType("text/plain");
      PrintWriter out = getResponse().getWriter();
      out.println(tempFilename);
      out.flush();

    } catch (Exception e) {
      e.printStackTrace();
      log.error("Exception while rotating photo.  See log for details.");
    }

    log.info("Exit...");

    return null;

  } // End execute()/


  /**
   * This method deletes all temp photo files.
   */
  private void deleteTempFiles() {

    // First, get a list of File objects for all the temp files, if any,
    // stored in /photos.
    String path = getServletContext().getRealPath("photos");
    File   dir  = new File(path);
    FileFilter fileFilter = new FileFilter() {
      public boolean accept(File file) {
        if (file.isDirectory()) {
          return false;
        }
        if (!file.getName().startsWith("tempPhoto_")) {
          return false;
        }
        return true;
      }
    };
    File[] files = dir.listFiles(fileFilter);
    if (files != null) {
      // Now that we know there are temp files and we have a list of them,
      // delete each
      for (int i = 0; i < files.length; i++) {
        log.info("Deleting temp file '" + files[i] + "'...");
        files[i].delete();
      }
    }

  } // End deleteTempFiles().


} // End class.
