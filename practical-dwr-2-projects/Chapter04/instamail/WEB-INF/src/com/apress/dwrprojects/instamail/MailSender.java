package com.apress.dwrprojects.instamail;


import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import javax.mail.Session;
import javax.mail.Message;
import java.util.Date;
import java.text.SimpleDateFormat;
import javax.mail.internet.MimeMessage;
import java.io.FileOutputStream;
import java.io.ObjectOutputStream;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import java.util.Properties;
import javax.servlet.ServletContext;


/**
 * This class is responsible for sending e-mails.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class MailSender {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(MailSender.class);


  /**
   * This method sends a message.
   *
   * @param  inTo      The recipient of the message.
   * @param  inSubject The subject of the message.
   * @param  inText    The text of the message.
   * @return           A string indicating success or failure.
   */
  public String sendMessage(String inTo, String inSubject, String inText,
    ServletContext sc) {

    Transport          transport = null;
    FileOutputStream   fos = null;
    ObjectOutputStream oos = null;
    String             result = "";

    try {

      // Get the options, and also get the current date/time.  We do it once
      // here so just in case we cross a second boundary while processing,
      // we know the filename and the sent time will jive.
      OptionsDTO options = new OptionsManager().retrieveOptions(sc);
      Date       d       = new Date();
      log.info("options = " + options + "\n\n");
      // Construct Properties JavaMail needs.
      Properties props = new Properties();
      props.setProperty("mail.transport.protocol", "smtp");
      props.setProperty("mail.host",               options.getSmtpServer());
      if (options.getSmtpServerRequiresLogin().equalsIgnoreCase("true")) {
        props.setProperty("mail.user",     options.getSmtpUsername());
        props.setProperty("mail.password", options.getSmtpPassword());
      }
      log.info("props = " + props + "\n\n");
      // Create a JavaMail message.
      Session session = Session.getDefaultInstance(props, null);
      log.info("session = " + session + "\n\n");
      transport = session.getTransport();
      log.info("transport = " + transport + "\n\n");
      MimeMessage message = new MimeMessage(session);
      // Populate the data for the message.
      message.addRecipient(Message.RecipientType.TO, new InternetAddress(inTo));
      message.setFrom(new InternetAddress(options.getFromAddress()));
      message.setSubject(inSubject);
      message.setContent(inText, "text/plain");
      // Send it!
      transport.connect();
      transport.sendMessage(message,
        message.getRecipients(Message.RecipientType.TO));

      // We also need to save the message.  It will be saved in WEB-INF,
      // and the filename will be the current date and time, formatted nicely,
      // with "msg_" appended on the front.  That way we can easily list them
      // all later.  Note that all we are going to do is simply create a
      // MessageDTO, and serialize it.
      MessageDTO mDTO = new MessageDTO();
      mDTO.setFrom(options.getFromAddress());
      mDTO.setTo(inTo);
      mDTO.setSent(d.toString());
      mDTO.setReceived(null);
      mDTO.setSubject(inSubject);
      mDTO.setMsgText(inText);
      mDTO.setMsgType("sent");
      String filename = new SimpleDateFormat("MM_dd_yyyy_hh_mm_ss_a").format(d);
      filename = "msg_" + filename.toLowerCase();
      mDTO.setFilename(filename);
      fos = new FileOutputStream(sc.getRealPath("/WEB-INF") + "/" + filename);
      oos = new ObjectOutputStream(fos);
      oos.writeObject(mDTO);
      oos.flush();
      fos.flush();

      result = "Message has been sent";

    } catch (Exception e) {
      e.printStackTrace();
      log.error("Error sending message");
      result = "Error sending message: " + e;
    } finally {
      try {
        if (transport != null) {
          transport.close();
        }
        if (oos != null) {
          oos.close();
        }
        if (fos != null) {
          fos.close();
        }
      } catch (Exception e) {
        log.error("Exception closing transport, oos or fos: " + e);
      }
    }

    return result;

  } // End sendMessage().


} // End class.