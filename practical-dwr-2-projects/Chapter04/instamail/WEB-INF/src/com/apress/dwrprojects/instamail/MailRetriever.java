package com.apress.dwrprojects.instamail;


import java.util.Properties;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.io.File;
import java.io.FileInputStream;
import java.io.ObjectInputStream;
import java.io.FileFilter;
import javax.servlet.ServletContext;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import javax.mail.Store;
import javax.mail.Session;
import javax.mail.Folder;
import javax.mail.Message;


/**
 * This class is responsible for getting lists of messages and individual
 * messages.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class MailRetriever {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(MailRetriever.class);


  /**
   * This method retrieves the contents of the Inbox.
   *
   * @param  sc  ServletContext of the incoming request.
   * @return     A collection of MessageDTOs.
   */
  public Collection getInboxContents(ServletContext sc) {

    Collection<MessageDTO> messages = new ArrayList<MessageDTO>();
    Folder     folder   = null;
    Store      store    = null;

    try {

      // Get the fromAddress from Options.
      OptionsDTO options = new OptionsManager().retrieveOptions(sc);
      log.info("options = " + options);
      String fromAddress = options.getFromAddress();

      Properties props = new Properties();
      props.setProperty("mail.transport.protocol", "pop3");
      props.setProperty("mail.host", options.getPop3Server());
      if (options.getPop3ServerRequiresLogin().equalsIgnoreCase("true")) {
        props.setProperty("mail.user",     options.getPop3Username());
        props.setProperty("mail.password", options.getPop3Password());
      }
      log.info("props = " + props);

      Session session = Session.getDefaultInstance(new Properties());
      log.info("session = " + session);
      store = session.getStore("pop3");
      store.connect(options.getPop3Server(), options.getPop3Username(),
        options.getPop3Password());
      log.info("store = " + store);
      folder = store.getFolder("INBOX");
      folder.open(Folder.READ_ONLY);
      log.info("folder = " + folder);
      int count = folder.getMessageCount();
      for(int i = 1; i <= count; i++) {
        Message message = folder.getMessage(i);
        MessageDTO mDTO = new MessageDTO();
        // Get from address.  Note that it will have quotes around it, so
        // we'll need to remove them.
        String from = message.getFrom()[0].toString();
        from = from.replaceAll("\"", "");
        mDTO.setFrom(from);
        mDTO.setTo(fromAddress);
        mDTO.setReceived(message.getSentDate().toString());
        mDTO.setSubject(message.getSubject());
        mDTO.setSent(null);
        mDTO.setMsgID(new Integer(i).toString());
        mDTO.setMsgType("received");
        mDTO.setFilename(null);
        messages.add(mDTO);
      }

    } catch (Exception e) {
      e.printStackTrace();
      log.error("Could not retrieve Inbox contents: " + e);
    } finally {
      try {
        if (folder != null) {
          folder.close(false);
        }
        if (store != null) {
          store.close();
        }
      } catch (Exception e) {
        log.error("Error closing folder or store: " + e);
      }
    }

    return messages;

  } // End getInboxContents().


  /**
   * This method retrieves the contents of the Sent Messages folder.
   *
   * @param  sc  ServletContext of the incoming request.
   * @return     A collection of MessageDTOs.
   */
  public Collection getSentMessagesContents(ServletContext sc) {

    Collection<MessageDTO> messages = new ArrayList<MessageDTO>();

    try {

      // First, get a list of File objects for all the messages stored
      // in WEB-INF.
      String path = sc.getRealPath("WEB-INF");
      File   dir  = new File(path);
      FileFilter fileFilter = new FileFilter() {
        public boolean accept(File file) {
          if (file.isDirectory()) {
            return false;
          }
          if (!file.getName().startsWith("msg_")) {
            return false;
          }
          return true;
        }
      };
      File[] files = dir.listFiles(fileFilter);
      if (files == null) {
        log.info("Directory not found, or is empty");
      } else {
        // Now that we know there are messages and we have a list of them,
        // go through each and reconstitute the serialized MessageDTO
        // for each and add it to the collection.
        for (int i = 0; i < files.length; i++){
          log.info("Retrieving '" + files[i] + "'...");
          FileInputStream   fis = new FileInputStream(files[i]);
          ObjectInputStream oos = new ObjectInputStream(fis);
          MessageDTO message = (MessageDTO)oos.readObject();
          oos.close();
          fis.close();
          messages.add(message);
        }
      }

    } catch (Exception e) {
      e.printStackTrace();
      log.error("Error retrieving sent messages list: " + e);
    }

    return messages;

  } // End getSentMessagesContents().


  /**
   * This method retrieves a single message and all the pertinent details of it.
   *
   * @param  msgType  The type of message to retrieve, either "sent" or
   *                  "retrieved".
   * @param  filename The name of the file the message is stored on disk under
   *                  if retrieving a Sent Message, null otherwise.
   * @param  msgID    The ID of the message if retrieving a message in the
   *                  Inbox, null otherwise.
   * @param  sc       ServletContext of the incoming request.
   * @return          The message requested.
   */
  public MessageDTO retrieveMessage(String msgType, String filename,
    String msgID, ServletContext sc) {

    MessageDTO message = null;

    try {
      log.info("msgType = " + msgType);
      log.info("filename = " + filename);
      log.info("msgID = " + msgID);
      if (msgType.equalsIgnoreCase("sent")) {
        // Message from Sent Messages.
        String path = sc.getRealPath("WEB-INF");
        filename = path + File.separatorChar + filename;
        log.info("Retrieving '" + filename + "'...");
        File   dir  = new File(filename);
        FileInputStream   fis = new FileInputStream(filename);
        ObjectInputStream oos = new ObjectInputStream(fis);
        message = (MessageDTO)oos.readObject();
        oos.close();
        fis.close();
      }
      if (msgType.equalsIgnoreCase("received")) {
        // Message from Inbox.
        OptionsDTO options = new OptionsManager().retrieveOptions(sc);
        log.info("options = " + options);
        String fromAddress = options.getFromAddress();
        Properties props = new Properties();
        props.setProperty("mail.transport.protocol", "pop3");
        props.setProperty("mail.host", options.getPop3Server());
        if (options.getPop3ServerRequiresLogin().equalsIgnoreCase("true")) {
          props.setProperty("mail.user",     options.getPop3Username());
          props.setProperty("mail.password", options.getPop3Password());
        }
        log.info("props = " + props);
        Session session = Session.getDefaultInstance(new Properties());
        log.info("session = " + session);
        Store store = session.getStore("pop3");
        store.connect(options.getPop3Server(), options.getPop3Username(),
          options.getPop3Password());
        log.info("store = " + store);
        Folder folder = store.getFolder("INBOX");
        folder.open(Folder.READ_ONLY);
        log.info("folder = " + folder);
        int count = folder.getMessageCount();
        int i = Integer.parseInt(msgID);
        Message msg = folder.getMessage(i);
        message = new MessageDTO();
        // Get from address.  Note that it will have quotes around it, so
        // we'll need to remove them.
        String from = msg.getFrom()[0].toString();
        from = from.replaceAll("\"", "");
        message.setFrom(from);
        message.setTo(fromAddress);
        message.setReceived(msg.getSentDate().toString());
        message.setSubject(msg.getSubject());
        message.setSent(null);
        message.setMsgID(new Integer(i).toString());
        message.setMsgType("received");
        message.setFilename(null);
        message.setMsgText(msg.getContent().toString());
        folder.close(false);
        store.close();
      }
    } catch (Exception e) {
      e.printStackTrace();
      log.error("Error retrieving message: " + e);
    }

    return message;

  } // End retrieveMessage().


} // End class.