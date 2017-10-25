package com.apress.ajaxprojects.photoshare.actions;


import com.apress.ajaxprojects.photoshare.dao.PhotoShareDAO;
import com.apress.ajaxprojects.photoshare.dtos.PhotoDTO;
import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileItemFactory;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.devlib.schmidt.imageinfo.ImageInfo;


/**
 * This class accepts an upload of a photo with accompanying information
 * and saves it to the currently active collection.
 */
public class AddPhoto extends Action {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(AddPhoto.class);


  /**
   * Called by ActionDispatched to show the Add Photo dialog.
   *
   * @return Result.
   */
  public String showScreen() {

    log.info("Entry...");

    setMessage("Add a photo: ");

    log.info("Exit");

    return "ok";

  } // End showScreen().


  /**
   * Called by ActionDispatched to add a photo.
   *
   * @return Result.
   */
  public String addPhoto() {

    log.info("Entry...");

    // Create a factory for disk-based file items
    FileItemFactory factory = new DiskFileItemFactory();
    // Create a new file upload handler
    ServletFileUpload upload = new ServletFileUpload(factory);

    // Parse the request... thank you FileUpload!
    List items = null;
    try {
      items = upload.parseRequest(getRequest());
    } catch (FileUploadException fue) {
      fue.printStackTrace();
      log.error("Error uploading file: " + fue);
      setMessage("An error occurred.  Details can be found in the logs.");
      return "ok";
    }

    // Iterate over the parsed items.  It's either a form field or the photo
    // itself, handle each accordingly: build up a PhotoDTO from the form
    // fields, or grab the file for later processing.
    PhotoDTO dto = new PhotoDTO();
    Iterator it  = items.iterator();
    FileItem theFile = null;
    while (it.hasNext()) {
      FileItem item = (FileItem)it.next();
      if (item.isFormField()) {
        String name  = item.getFieldName();
        String value = item.getString();
        if (name.equalsIgnoreCase("collection")) {
          dto.setCollection(value);
        }
        if (name.equalsIgnoreCase("adder")) {
          dto.setAddedBy(value);
        }
        if (name.equalsIgnoreCase("description")) {
          dto.setDescription(value);
        }
      } else {
        theFile = item;
      }
    }
    // We now have the file item that is the photo itself.  Continue populating
    // the DTO from it and then write it to disk.  Start with the current
    // date/time.
    dto.setAddedOn(new Date());
    // Determine the type.  Simply put, this is just the file extension.
    String extension = theFile.getName();
    int i = extension.lastIndexOf(".");
    extension = extension.substring(i + 1);
    dto.setType(extension);
    // File size.
    dto.setFileSize(new Long(theFile.getSize()).toString());
    // Construct a filename to write out.  Formed by taking the collection
    // name (with all spaces replaced with underscores) plus the
    // name of the person who added the photo (again with spaces replaced
    // with underscores) and the current date/time formatted apropriately.
    String filename = dto.getCollection().replaceAll(" ", "_") + "_" +
      dto.getAddedBy().replaceAll(" ", "_") + "_" +
      new SimpleDateFormat("MM_dd_yyyy_hh_mm_ssa").format(dto.getAddedOn()) +
      "." + extension;
    dto.setFilename(filename);
    // Get a reference to the file to save.
    String path = getServletContext().getRealPath("photos") + File.separator +
      filename;
    log.info("Path to uploaded photo = " + path);
    File uploadedFile = new File(path);
    try {
      // Write the file.
      theFile.write(uploadedFile);
      // Now we can get the last bits of information to populate the DTO that
      // we couldn't get until the file was written.
      ImageInfo ii = new ImageInfo();
      ii.setInput(getServletContext().getResourceAsStream(
        "/photos/" + filename));
      if (ii.check()) {
        ii.setDetermineImageNumber(true);
        dto.setDimensions(ii.getWidth() + "x" + ii.getHeight());
        dto.setColorDepth(new Integer(ii.getBitsPerPixel()).toString());
        dto.setDpi(new Integer(ii.getPhysicalHeightDpi()).toString());
      } else {
        log.error(">>>>>> Could not determine image characteristics.  Using " +
          "default values.");
      }
      log.info("PhotoDTO to be added to collection = " + dto);
      // Ask the DAO to add the photo to the collection and rewrite the
      // collections file to include this photo.
      PhotoShareDAO dao = PhotoShareDAO.getInstance();
      dao.addPhoto(getServletContext(), dto);
      setMessage("Photo has been added.  Collection will now be reloaded.");
    } catch (Exception e) {
      e.printStackTrace();
      log.error("Error saving file: " + e);
      setMessage("An error occurred.  Details can be found in the logs.");
      return "ok";
    }

    log.info("Exit");

    return "ok";

  } // End addPhoto().

} // End class.
