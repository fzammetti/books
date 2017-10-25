package com.apress.dwrprojects.instamail;


import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.Properties;
import javax.servlet.ServletContext;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * This class deals with maintaining the Address Book.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class AddressBookManager {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(AddressBookManager.class);


  /**
   * Filename of the Address Book.
   */
  private static final String addrBookFilename = "addrbook.properties";


  /**
   * This method retrieves the contents of the Address Book.
   *
   * @param  sc ServletContext associates with the request.
   * @return    A collection of ContactDTOs.
   */
  public Collection retrieveContacts(ServletContext sc) {

    // Read in the Address Book.
    InputStream isFeedFile =
      sc.getResourceAsStream("/WEB-INF/" + addrBookFilename);
    Properties props       = new Properties();
    int        numContacts = 0;
    try {
      if (isFeedFile == null) {
        throw new IOException(addrBookFilename + " not found");
      }
      props.load(isFeedFile);
      isFeedFile.close();
      // Now we need to determine how many contacts there are.  To do this, we
      // divide the total number of properties read in by 3, since each
      // contact always has 3 items stored about them.
      if (props.size() != 0) {
        numContacts = props.size() / 3;
      }
    } catch (IOException e) {
      log.info("No " + addrBookFilename + " file, an empty address book will " +
        "be returned.");
    }

    // Now we cycle through the properties the number of times we calculated
    // there are contacts.  For each we construct a ContactDTO and add it to
    // the collection to be returned.
    log.info("numContacts = " + numContacts);
    Collection<ContactDTO> contacts = new ArrayList<ContactDTO>();
    for (int i = 1; i < numContacts + 1; i++) {
      ContactDTO contact = new ContactDTO();
      contact.setName(props.getProperty("name" + i));
      contact.setAddress(props.getProperty("address" + i));
      contact.setNote(props.getProperty("note" + i));
      contacts.add(contact);
    }

    return contacts;

  } // End retrieveContacts().


  /**
   * This method adds a contact to the Address Book.
   *
   * @param  inName    The name of the contact.
   * @param  inAddress The e-mail address for the contact.
   * @param  inNote    Any arbitrary note about the contact.
   * @param  sc        ServletContext associates with the request.
   * @return           A message saying the save was OK.
   */
  public String saveContact(String inName, String inAddress,
    String inNote, ServletContext sc) {

      // Log what we received.
      log.info("\nAdding contact:\n" +
        "inName = " + inName + "\n" +
        "inAddress = " + inAddress + "\n" +
        "inNote = " + inNote + "\n");

      String result = "";

      // In order to save a contact, we essentially need to write out the
      // entire Address Book, so the first step is to read it in.
      Collection contacts = retrieveContacts(sc);

      // Now we iterate over it, adding each to a Properties object.  Remember
      // that for each contact we are writing out three properties, the name,
      // the address and the note.  To name each uniquely, we append a number
      // onto it.
      Properties props = new Properties();
      int i = 1;
      for (Iterator it = contacts.iterator(); it.hasNext();) {
        ContactDTO contact = (ContactDTO)it.next();
        props.setProperty("name"    + i, contact.getName());
        props.setProperty("address" + i, contact.getAddress());
        props.setProperty("note"    + i, contact.getNote());
        i++;
      }

      // Now we add the new contact
      props.setProperty("name"    + i, inName);
      props.setProperty("address" + i, inAddress);
      props.setProperty("note"    + i, inNote);

      // Lastly, delete any existing addrBookFilename file in WEB-INF and
      // write out a new version from the Properties object we just populated.
      // Return a message saying the operation was complete, or if any problems
      // occur, a message saying what went wrong.
      FileOutputStream fos = null;
      try {
        new File(sc.getRealPath("WEB-INF") + "/" + addrBookFilename).delete();
        fos = new FileOutputStream(sc.getRealPath("WEB-INF") +
          "/" + addrBookFilename);
        props.store(fos, null);
        fos.flush();
        fos.close();
        result = "Contact has been added.\n\nPlease note that if the contact " +
          "does not show up immediately, you may have to click the " +
          "Address Book link once or twice.";
      } catch (IOException e) {
        log.error("Error saving contact:");
        e.printStackTrace();
        result = "Contact could not be added.  Please review logs for details.";
      } finally {
        try {
          if (fos != null) {
            fos.close();
          }
        } catch (IOException e) {
          log.error("Error closing fos: " + e);
        }
      }

      return result;

  } // End saveContact().


  /**
   * This method deletes a contact from the Address Book.
   *
   * @param  inName The name of the contact to delete.
   * @param  sc     ServletContext associates with the request.
   * @return        A message saying the delete was OK.
   */
  public String deleteContact(String inName, ServletContext sc) {

      log.info("\nDeleting contact:\n" + inName + "\n");

      String result = "";

      // To delete a contact, we need to read in the Address Book and
      // re-write it out MINUS the contact to be deleted.  So, first thing,
      // let's read it in.
      ArrayList contacts = (ArrayList)retrieveContacts(sc);

      // Now, let's go through and find the one to delete and do it.
      for (int i = 0; i < contacts.size(); i++) {
        ContactDTO contact = (ContactDTO)contacts.get(i);
        if (contact.getName().equalsIgnoreCase(inName)) {
          contacts.remove(i);
          break;
        }
      }

      // Lastly, we construct a Properties object containing what is left of
      // the Address Book, and write it out.
      Properties props = new Properties();
      int i = 1;
      for (Iterator it = contacts.iterator(); it.hasNext();) {
        ContactDTO contact = (ContactDTO)it.next();
        props.setProperty("name"    + i, contact.getName());
        props.setProperty("address" + i, contact.getAddress());
        props.setProperty("note"    + i, contact.getNote());
        i++;
      }
      FileOutputStream fos = null;
      try {
        new File(sc.getRealPath("WEB-INF") + "/" + addrBookFilename).delete();
        fos = new FileOutputStream(sc.getRealPath("WEB-INF") +
          "/" + addrBookFilename);
        props.store(fos, null);
        fos.flush();
        result = "Contact has been deleted.\n\nPlease note that if the " +
          "contact does not go away immediately, you may have to click the " +
          "Address Book link once or twice.";
      } catch (IOException e) {
        log.error("Error deleting contact:");
        e.printStackTrace();
        result = "Contact could not be deleted.  Please review logs for " +
          "details.";
      } finally {
        try {
          if (fos != null) {
            fos.close();
          }
        } catch (IOException e) {
          log.error("Error closing fos: " + e);
        }
      }

      return result;

  } // End deleteContact().


} // End class.
