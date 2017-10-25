package com.apress.dwrprojects.instamail;


import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import javax.mail.Session;
import javax.mail.Flags;
import javax.mail.Message;
import java.util.StringTokenizer;
import java.io.File;
import javax.mail.Store;
import javax.mail.Folder;
import java.util.Properties;
import javax.servlet.ServletContext;


/**
 * This class is responsible for deleting e-mails.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class MailDeleter {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(MailDeleter.class);


  /**
   * This method deletes a message.
   *
   * @param  msgType   The type of message to delete, either "sent" or
   *                   "retrieved".
   * @param  filenames The names of the files the messages are stored on disk
   *                   under if deleting Sent Messages, null otherwise.  This
   *                   can be a comma-separated list of filenames, or just
   *                   a single value.
   * @param  msgIDs    The IDs of the messages if deleting messages in the
   *                   Inbox, null otherwise.  This can be a comma-separated
   *                   list of IDs, or just a single value.
   * @param  sc        ServletContext of the incoming request.
   * @return           A string indicating success or failure.
   */
  public String deleteMessages(String msgType, String filenames, String msgIDs,
    ServletContext sc) {

    log.info("\nAbout to delete message:\n" +
      "msgType = " + msgType + "\n" +
      "filenames = " + filenames + "\n" +
      "msgIDs = " + msgIDs + "\n");

    String result = "Message(s) deleted.";
    Store  store  = null;
    Folder folder = null;

    try {
      if (msgType.equalsIgnoreCase("sent")) {
        // Deleting from Sent Messages.
        StringTokenizer st = new StringTokenizer(filenames, ",");
        String errs = "";
        String path = sc.getRealPath("WEB-INF");
        while (st.hasMoreTokens()) {
          String fn = st.nextToken();
          fn = path + File.separatorChar + fn;
          boolean success = (new File(fn)).delete();
          if (!success) {
            if (!errs.equalsIgnoreCase("")) {
              errs += ", ";
            }
            errs += "Unable to delete '" + fn + "'";
          }
        }
        if (!errs.equalsIgnoreCase("")) {
          result = errs;
        }
      }
      if (msgType.equalsIgnoreCase("received")) {
        // Deleting from Inbox.
        OptionsDTO options = new OptionsManager().retrieveOptions(sc);
        log.info("options = " + options);
        StringTokenizer st = new StringTokenizer(msgIDs, ",");
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
        folder.open(Folder.READ_WRITE);
        log.info("folder = " + folder);
        while (st.hasMoreTokens()) {
          String msgID = st.nextToken();
          int i = Integer.parseInt(msgID);
          Message message = folder.getMessage(i);
          message.setFlag(Flags.Flag.DELETED, true);
        }
      }
    } catch (Exception e) {
      log.error("Exception deleting POP3 message(s): " + e);
      e.printStackTrace();
      result = "An error occurred deleting message(s).  Please refer to " +
        "the logs for details.";
    } finally {
      try {
        if (folder != null) {
          folder.close(true);
        }
        if (store != null) {
          store.close();
        }
      } catch (Exception e) {
        log.error("Error closing folder or store: " + e);
      }
    }

    return result;

  } // End deleteMessages().


} // End class.