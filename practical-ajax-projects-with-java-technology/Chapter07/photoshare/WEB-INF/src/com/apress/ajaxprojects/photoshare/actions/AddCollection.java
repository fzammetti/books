package com.apress.ajaxprojects.photoshare.actions;


import com.apress.ajaxprojects.photoshare.dao.PhotoShareDAO;
import com.apress.ajaxprojects.photoshare.dtos.CollectionDTO;
import java.util.Date;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * This class adds a collection.
 */
public class AddCollection extends Action {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(AddCollection.class);


  /**
   * Called by ActionDispatched to show the Add Collection dialog.
   *
   * @return Result.
   */
  public String showScreen() {

    log.info("Entry...");

    setMessage("Add a collection: ");

    log.info("Exit");

    return "ok";

  } // End showScreen().


  /**
   * Called by ActionDispatched to add a collection.
   *
   * @return Result.
   */
  public String addCollection() {

    log.info("Entry...");

    // Display incoming parameters.
    String name    = (String)(getRequest().getParameter("name"));
    String creator = (String)(getRequest().getParameter("creator"));
    log.info("name = "    + name);
    log.info("creator = " + creator);

    // Create and populate CollectionDTO from input.
    CollectionDTO collection = new CollectionDTO();
    collection.setName(name);
    collection.setCreatedBy(creator);
    collection.setCreatedOn(new Date());

    // Call on DAO to add collection and write out the collections.xml file.
    PhotoShareDAO dao = PhotoShareDAO.getInstance();
    String result = dao.addCollection(getServletContext(), collection);
    setMessage(result);

    log.info("Exit");

    return "ok";

  } // End addCollection().


} // End class.
