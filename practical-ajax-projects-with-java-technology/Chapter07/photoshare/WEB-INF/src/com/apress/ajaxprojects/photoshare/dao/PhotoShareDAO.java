package com.apress.ajaxprojects.photoshare.dao;


import com.apress.ajaxprojects.photoshare.dtos.CollectionDTO;
import com.apress.ajaxprojects.photoshare.dtos.PhotoDTO;
import com.apress.ajaxprojects.photoshare.listener.StartupConfigurator;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.InputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Locale;
import javax.servlet.ServletContext;
import org.apache.commons.beanutils.ConvertUtils;
import org.apache.commons.beanutils.locale.converters.DateLocaleConverter;
import org.apache.commons.digester.Digester;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.xml.sax.SAXException;


/**
 * DAO to handle all persisted I/O operations.
 */
public final class PhotoShareDAO {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(PhotoShareDAO.class);


  /**
   * This class is a singleton, so here's the one and only instance.
   */
  private static PhotoShareDAO instance;


  /**
   * Collection of CollectionDTO objects.
   */
  private HashMap collections = new HashMap();


  /**
   * Make sure instances of this class can't be created.
   */
  private PhotoShareDAO() {
  } // End constructor.


  /**
   * Complete the singleton pattern.  This method is the only way to get an
   * instance of this class.
   *
   * @return The one and only instance of this class.
   */
  public static PhotoShareDAO getInstance() {

    log.info("Entry...");
    if (instance == null) {
      log.info("Creating new singleton PhotoShareDAO instance...");
      instance = new PhotoShareDAO();
      log.info("Created, now initializing...");
      instance.init(null);
      log.info("Exit");
    }
    return instance;

  } // End getInstance().


  /**
   * Initialize.  Read in collections.xml file and create CollectionDTOs for
   * each and add it to the collection of collections.  Note that the first time
   * getInstance() is called, we pass in null for the isConfigFile parameter,
   * and hence the config file is not read.  Before this DAO can really be
   * used, init() must be called, handing it an InputStream to the config
   * file.  This is done from ContextListener.
   *
   * @param isConfigFile InputStream to the config file.
   */
  public synchronized void init(InputStream isConfigFile) {

    log.info("Entry...");
    if (isConfigFile == null) {
      log.info("isConfigFile was null, nothing to do.");
    } else {
      // Configure BeanUtils to handle our date.
      String pattern = "MM/dd/yyyy hh:mma";
      Locale locale = Locale.getDefault();
      DateLocaleConverter converter = new DateLocaleConverter(locale, pattern);
      converter.setLenient(true);
      ConvertUtils.register(converter, java.util.Date.class);
      // Read in collections config and create beans, hand off to DAO.
      Digester digester = new Digester();
      digester.setValidating(false);
      digester.push(this);
      digester.addObjectCreate("collections/collection",
        "com.apress.ajaxprojects.photoshare.dtos.CollectionDTO");
      digester.addSetProperties("collections/collection");
      digester.addObjectCreate("collections/collection/photo",
        "com.apress.ajaxprojects.photoshare.dtos.PhotoDTO");
      digester.addSetProperties("collections/collection/photo");
      digester.addCallMethod("collections/collection/photo",
        "setDescription", 0);
      digester.addSetNext("collections/collection/photo", "addPhoto");
      digester.addSetNext("collections/collection", "addCollectionDigester");
      try {
        digester.parse(isConfigFile);
        log.info("Collections = " + collections);
      } catch (IOException ioe) {
        ioe.printStackTrace();
        log.error("Unable to read collections.xml.  App *NOT* initialized!");
      } catch (SAXException se) {
        se.printStackTrace();
        log.error("Unable to parse collections.xml.  App *NOT* initialized!");
      }
    }
    log.info("Exit");

  } // End init().


  /**
   * Adds a collection to the collection of collections.  This version is
   * called by Digester during startup.
   *
   * @param inCollection The collection to add.
   */
  public void addCollectionDigester(CollectionDTO inCollection) {

    collections.put(inCollection.getName(), inCollection);

  } // End addCollection().


  /**
   * Adds a collection to the collection of collections.
   *
   * @param inServletContext This is the current ServletContext object.
   * @param inCollection     The collection to add.
   * @return                 The result of the add.  null if everything went
   *                         OK, or a string describing the problem if not.
   */
  public synchronized String addCollection(ServletContext inServletContext,
    CollectionDTO inCollection) {

    log.info("Entry...");
    String result = "Collection '" + inCollection.getName() + "' added.  " +
      "Collection list dropdown will now be updated.";
    if (collections.get(inCollection.getName()) == null) {
      HashMap originalCollections = collections;
      try {
        collections.put(inCollection.getName(), inCollection);
        writeCollectionsFile(inServletContext);
        log.info("Collections = " + collections);
      } catch (IOException ioe) {
        log.error("DID NOT add collection " + inCollection);
        result = "An error occurred.  Details can be found in the logs.";
        // Restore the collections to their original state.
        collections = originalCollections;
      }
    } else {
      result = "A collection with that name already exists.  Please " +
        "try another.";
    }
    log.info("Exit");
    return result;

  } // End addCollection().


  /**
   * Write the collections collection out to our XML file.
   *
   * @param  inServletContext ServletContext of calling request.
   * @throws IOException      If any problems are encountered.
   */
  public synchronized void writeCollectionsFile(ServletContext inServletContext)
    throws IOException {

    log.info("Entry...");

    BufferedWriter out = null;
    try {
      // Delete the existing Collectionx.sml file.
      String path = inServletContext.getRealPath("WEB-INF") + File.separator +
        StartupConfigurator.COLLECTIONS_FILE;
      log.info("path (to collections file) = " + path);
      new File(path).delete();
      // Cycle through the collection of collections and construct our XML
      // from each.
      StringBuffer sb = new StringBuffer(2048);
      sb.append("<collections>\n");
      for (Iterator it = collections.keySet().iterator(); it.hasNext();) {
        String key = (String)it.next();
        CollectionDTO dto = (CollectionDTO)collections.get(key);
        sb.append(dto.getAsXML());
      }
      sb.append("</collections>\n");
      log.info("Writing:\n" + sb.toString());
      out = new BufferedWriter(new FileWriter(path));
      out.write(sb.toString());
      out.close();
    } catch (IOException ioe) {
      ioe.printStackTrace();
      log.error("Error writing collections file: " + ioe);
    } finally {
      if (out != null) {
        try {
          out.close();
        } catch (IOException ioe1) {
          log.debug("Exception closing out: " + ioe1);
        }
      }
    }

    log.info("Exit");

  } // End writeCollectionsFile().


  /**
   * Deletes a collection from the collection of collections.
   *
   * @param inServletContext This is the current ServletContext object.
   * @param inName           The name of the collection to remove.
   * @return                 The result of the delete.  null if everything went
   *                         OK, or a string describing the problem if not.
   */
  public synchronized String deleteCollection(ServletContext inServletContext,
    String inName) {

    log.info("Entry...");
    String result = "Collection '" + inName + "' deleted.  " +
      "Collection list dropdown will now be updated.";
    HashMap originalCollections = collections;
    try {
      collections.remove(inName);
      writeCollectionsFile(inServletContext);
      log.info("Collections = " + collections);
    } catch (IOException ioe) {
      log.error("DID NOT delete collection " + inName);
      result = "An error occurred.  Details can be found in the logs.";
      // Restore the collections to their original state.
      collections = originalCollections;
    }
    log.info("Exit");
    return result;

  } // End deleteCollection().


  /**
   * Returns a list of all collections.
   *
   * @return List of all rooms names.
   */
  public synchronized HashMap getCollectionList() {

    return collections;

  } // End getCollectionList().


  /**
   * Returns a specified collection.
   *
   * @param  inName The name of the collection to get.
   * @return        A CollectionDTO.
   */
  public synchronized CollectionDTO getCollection(String inName) {

    return (CollectionDTO)collections.get(inName);

  } // End getCollection().


  /**
   * Adds a photo to the appropriate collection.
   *
   * @param inServletContext This is the current ServletContext object.
   * @param inPhoto          The PhotoDTO to add.
   */
  public synchronized void addPhoto(ServletContext inServletContext,
    PhotoDTO inPhoto) {

    // Add to the proper collection.
    log.info("Entry...");
    log.info("inPhoto = " + inPhoto);
    CollectionDTO dto =
      (CollectionDTO)collections.get(inPhoto.getCollection());
    CollectionDTO originalDTO = dto;
    dto.addPhoto(inPhoto);
    log.info("collection = " + dto);
    try {
      writeCollectionsFile(inServletContext);
      log.info("Collections = " + collections);
    } catch (IOException ioe) {
      log.error("DID NOT add photo " + inPhoto);
      // Restore the collection to its original state.
      dto = originalDTO;
    }
    log.info("Exit");

  } // End addPhoto().


  /**
   * Deletes a photo from a collection.
   *
   * @param inServletContext This is the current ServletContext object.
   * @param inFilename       The filename of the collection to remove.
   * @param inCollection     The collection the photo belongs to.
   * @return                 The result of the delete.  null if everything went
   *                         OK, or a string describing the problem if not.
   */
  public synchronized String deletePhoto(ServletContext inServletContext,
    String inFilename, String inCollection) {

    log.info("Entry...");
    String result = "Photo deleted.  Collection will now be reloaded.";
    HashMap originalCollections = collections;
    try {
      // Remove photo from the collection it belongs to.
      CollectionDTO dto = (CollectionDTO)collections.get(inCollection);
      dto.deletePhoto(inFilename);
      // Delete the photo image file.
      String path = inServletContext.getRealPath("photos") + File.separator +
        inFilename;
      log.info("path (to photo file) = " + path);
      new File(path).delete();
      // Rewrite the collections file so the photo is removed from it.
      writeCollectionsFile(inServletContext);
      log.info("Collections = " + collections);
    } catch (IOException ioe) {
      log.error("DID NOT delete photo " + inFilename + " in collection " +
        inCollection);
      result = "An error occurred.  Details can be found in the logs.";
      // Restore the collections to their original state.
      collections = originalCollections;
    }
    log.info("Exit");
    return result;

  } // End deletePhoto().


} // End class.
