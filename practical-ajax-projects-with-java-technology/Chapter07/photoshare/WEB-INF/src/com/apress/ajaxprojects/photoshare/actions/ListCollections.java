package com.apress.ajaxprojects.photoshare.actions;


import com.apress.ajaxprojects.photoshare.dao.PhotoShareDAO;
import java.util.HashMap;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * This class returns a list of all existing collections.
 */
public class ListCollections extends Action {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(ListCollections.class);


  /**
   * Called by ActionDispatched to list all collections.
   *
   * @return Result.
   */
  public String execute() {

    log.info("Entry...");

    // Ask the DAO for a list of collections, and add it to request.
    PhotoShareDAO dao = PhotoShareDAO.getInstance();
    HashMap collections = dao.getCollectionList();
    log.info("collections = " + collections);
    getRequest().setAttribute("collections", collections);

    log.info("Exit...");

    return "ok";

  } // End execute().


} // End class.
