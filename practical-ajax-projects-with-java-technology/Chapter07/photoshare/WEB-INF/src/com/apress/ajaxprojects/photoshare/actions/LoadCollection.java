package com.apress.ajaxprojects.photoshare.actions;


import com.apress.ajaxprojects.photoshare.dao.PhotoShareDAO;
import com.apress.ajaxprojects.photoshare.dtos.CollectionDTO;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * This class is called when the user selects a collection.  It returns
 * XML that is converted on the client to a JavaScript array.
 */
public class LoadCollection extends Action {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(LoadCollection.class);


  /**
   * Called by ActionDispatched to load a collection.
   *
   * @return Result.
   */
  public String execute() {

    log.info("Entry...");

    // Display incoming parameters.
    String collection = (String)(getRequest().getParameter("collection"));
    log.info("collection = " + collection);

    // Get the CollectionDTO.
    PhotoShareDAO dao = PhotoShareDAO.getInstance();
    CollectionDTO dto = dao.getCollection(collection);

    // Put the DTO in request so we can use it to render XML in the JSP.
    getRequest().setAttribute("collection", dto);

    log.info("Exit...");

    return "ok";

  } // End execute().


} // End class.
