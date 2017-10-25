package com.apress.ajaxprojects.photoshare.listener;


import com.apress.ajaxprojects.photoshare.ConfigInfo;
import com.apress.ajaxprojects.photoshare.dao.PhotoShareDAO;
import java.io.InputStream;
import java.util.HashMap;
import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * This ContextListener performs some simple initialization of the application.
 */
public class StartupConfigurator implements ServletContextListener {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(StartupConfigurator.class);


  /**
   * The collections XML file name.  Assumed to be in WEB-INF.
   */
  public static final String COLLECTIONS_FILE = "collections.xml";


  /**
   * Execute at app startup.
   *
   * @param event ServletContextEvent.
   */
  public void contextInitialized(ServletContextEvent event) {

    log.info("Entry");

    initConfigInfo();

    // Initialize DAO.
    PhotoShareDAO dao = PhotoShareDAO.getInstance();

    // Get a stream on the collections file and initialize the DAO.
    ServletContext servletContext = event.getServletContext();
    InputStream isConfigFile =
      servletContext.getResourceAsStream("/WEB-INF/" + COLLECTIONS_FILE);
    dao.init(isConfigFile);

    log.info("Exit");

  } // End contextInitialized();


  /**
   * This method configures all the Action mappings PhotoShare uses, and adds
   * them to the ConfigInfo static object.
   */
  private void initConfigInfo() {

    HashMap hm;

    // Action mapping for adding a collection, to initially show the dialog.
    hm = new HashMap();
    hm.put("path",   "showAddCollection");
    hm.put("class",
      "com.apress.ajaxprojects.photoshare.actions.AddCollection");
    hm.put("method", "showScreen");
    hm.put("ok",     "addCollection.jsp");
    ConfigInfo.addConfig(hm);

    // Action mapping for adding a collection, the actual add operation.
    hm = new HashMap();
    hm.put("path",   "addCollection");
    hm.put("class",
      "com.apress.ajaxprojects.photoshare.actions.AddCollection");
    hm.put("method", "addCollection");
    hm.put("ok",     "addCollection.jsp");
    ConfigInfo.addConfig(hm);

    // Action mapping for deleting a collection.
    hm = new HashMap();
    hm.put("path",   "deleteCollection");
    hm.put("class",
      "com.apress.ajaxprojects.photoshare.actions.DeleteCollection");
    hm.put("method", "execute");
    ConfigInfo.addConfig(hm);

    // Action mapping for retrieving a list of the available collections.
    hm = new HashMap();
    hm.put("path",   "listCollections");
    hm.put("class",
      "com.apress.ajaxprojects.photoshare.actions.ListCollections");
    hm.put("method", "execute");
    hm.put("ok",     "listCollections.jsp");
    ConfigInfo.addConfig(hm);

    // Action mapping for adding a photo, to initially show the dialog.
    hm = new HashMap();
    hm.put("path",   "showAddPhoto");
    hm.put("class",  "com.apress.ajaxprojects.photoshare.actions.AddPhoto");
    hm.put("method", "showScreen");
    hm.put("ok",     "addPhoto.jsp");
    ConfigInfo.addConfig(hm);

    // Action mapping for adding a photo, the actual add operation.
    hm = new HashMap();
    hm.put("path",   "addPhoto");
    hm.put("class",  "com.apress.ajaxprojects.photoshare.actions.AddPhoto");
    hm.put("method", "addPhoto");
    hm.put("ok",     "addPhoto.jsp");
    ConfigInfo.addConfig(hm);

    // Action mapping for deleting a photo.
    hm = new HashMap();
    hm.put("path",   "deletePhoto");
    hm.put("class",  "com.apress.ajaxprojects.photoshare.actions.DeletePhoto");
    hm.put("method", "execute");
    ConfigInfo.addConfig(hm);

    // Action mapping for loading a selected collection.
    hm = new HashMap();
    hm.put("path",   "loadCollection");
    hm.put("class",
      "com.apress.ajaxprojects.photoshare.actions.LoadCollection");
    hm.put("method", "execute");
    hm.put("ok",     "loadCollection.jsp");
    ConfigInfo.addConfig(hm);

    // Action mapping for printing a photo.
    hm = new HashMap();
    hm.put("path",   "printPhoto");
    hm.put("class",  "com.apress.ajaxprojects.photoshare.actions.Action");
    hm.put("method", "execute");
    hm.put("ok",     "printPhoto.jsp");
    ConfigInfo.addConfig(hm);

    // Action mapping for rotating a photo.
    hm = new HashMap();
    hm.put("path",   "rotatePhoto");
    hm.put("class",  "com.apress.ajaxprojects.photoshare.actions.RotatePhoto");
    hm.put("method", "execute");
    ConfigInfo.addConfig(hm);

    // Action mapping for downloading a photo.
    hm = new HashMap();
    hm.put("path",   "downloadPhoto");
    hm.put("class",
      "com.apress.ajaxprojects.photoshare.actions.DownloadPhoto");
    hm.put("method", "execute");
    ConfigInfo.addConfig(hm);

    log.info("configInfo = " + ConfigInfo.getConfigInfo());

  } // End initConfigInfo().


  /**
   * Execute at app shutdown.
   *
   * @param event ServletContextEvent.
   */
  public void contextDestroyed(ServletContextEvent event) {

  } // End contextDestroyed().


} // End class.
