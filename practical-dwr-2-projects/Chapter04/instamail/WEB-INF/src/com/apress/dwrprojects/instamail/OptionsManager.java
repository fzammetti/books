package com.apress.dwrprojects.instamail;


import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.IOException;
import java.util.Properties;
import javax.servlet.ServletContext;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * This class deals with maintaining options, including the e-mail account.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class OptionsManager {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(OptionsManager.class);


  /**
   * File name of the options file.
   */
  private static final String optionsFilename = "options.properties";


  /**
   * This method retrieves the options and returns them.  If no
   * optionsFilename file is found, a 'blank' DTO is returned.
   *
   * @param  sc ServletContext associates with the request.
   * @return    An OptionsDTO containing all the stored options.
   */
  public OptionsDTO retrieveOptions(ServletContext sc) {

    // Instantiate an OptionsDTO, and by default assume it will be configured.
    // This means the application has already been configured for use.  This
    // affects what the user can do when the app is accessed initially.
    OptionsDTO options = new OptionsDTO();
    options.setConfigured(true);

    // Read in the options.
    InputStream isFeedFile =
      sc.getResourceAsStream("/WEB-INF/" + optionsFilename);
    Properties props = new Properties();
    try {
      if (isFeedFile == null) {
        throw new IOException(optionsFilename + " not found");
      }
      props.load(isFeedFile);
      isFeedFile.close();
    } catch (IOException e) {
      log.info("No " + optionsFilename + " file, a blank DTO will " +
        "be returned.");
      // Make sure the OptionsDTO is set as unconfigured so that when the
      // index.jsp page is loaded, all the user will be allowed to do is go to
      // the Options views.
      options.setConfigured(false);
      props.setProperty("pop3Server", "");
      props.setProperty("pop3ServerRequiresLogin", "false");
      props.setProperty("pop3Username", "");
      props.setProperty("pop3Password", "");
      props.setProperty("smtpServer", "");
      props.setProperty("smtpServerRequiresLogin", "false");
      props.setProperty("smtpUsername", "");
      props.setProperty("smtpPassword", "");
      props.setProperty("fromAddress", "");
    }

    // Populate OptionsDTO from options Properties.
    options.setPop3Server(props.getProperty("pop3Server"));
    options.setPop3ServerRequiresLogin(
      props.getProperty("pop3ServerRequiresLogin"));
    options.setPop3Username(props.getProperty("pop3Username"));
    options.setPop3Password(props.getProperty("pop3Password"));
    options.setSmtpServer(props.getProperty("smtpServer"));
    options.setSmtpServerRequiresLogin(
      props.getProperty("smtpServerRequiresLogin"));
    options.setSmtpUsername(props.getProperty("smtpUsername"));
    options.setSmtpPassword(props.getProperty("smtpPassword"));
    options.setFromAddress(props.getProperty("fromAddress"));

    return options;

  } // End retrieveOptions().


  /**
   * This method saves the options.
   *
   * @param  pop3Server              The POP3 server address.
   * @param  pop3ServerRequiresLogin Does the POP3 server require login?
   * @param  pop3Username            The POP3 username.
   * @param  pop3Password            The POP3 password.
   * @param  smtpServer              The SMTP server address.
   * @param  smtpServerRequiresLogin Does the SMTP server require login?
   * @param  smtpUsername            The SMTP username.
   * @param  smtpPassword            The SMTP password.
   * @param  fromAddress             From address for outgoing messages.
   * @param  sc                      ServletContext associated with the request.
   * @return                         A message saying the save was OK.
   */
  public String saveOptions(String pop3Server, String pop3ServerRequiresLogin,
    String pop3Username, String pop3Password, String smtpServer,
    String smtpServerRequiresLogin, String smtpUsername,
    String smtpPassword, String fromAddress, ServletContext sc) {

      // Log what we received.
      log.info("\nSaving options:\n" +
      "pop3Server = " + pop3Server + "\n" +
        "pop3ServerRequiresLogin = " + pop3ServerRequiresLogin + "\n" +
        "pop3Username = " + pop3Username + "\n" +
        "pop3Password = " + pop3Password + "\n" +
        "smtpServer = " + smtpServer + "\n" +
        "smtpServerRequiresLogin = " + smtpServerRequiresLogin + "\n" +
        "smtpUsername = " + smtpUsername + "\n" +
        "smtpPassword = " + smtpPassword + "\n" +
        "fromAddress = " + fromAddress + "\n");

      String result = "";

      // Populate Properties structure.
      Properties props = new Properties();
      props.setProperty("pop3Server", pop3Server);
      props.setProperty("pop3ServerRequiresLogin",
        pop3ServerRequiresLogin);
      props.setProperty("pop3Username", pop3Username);
      props.setProperty("pop3Password", pop3Password);
      props.setProperty("smtpServer", smtpServer);
      props.setProperty("smtpServerRequiresLogin",
        smtpServerRequiresLogin);
      props.setProperty("smtpUsername", smtpUsername);
      props.setProperty("smtpPassword", smtpPassword);
      props.setProperty("fromAddress",  fromAddress);

      // Lastly, delete any existing optionsFilename file in WEB-INF and
      // write out a new version from the Properties object we just populated.
      // Return a message saying the operation was complete, or if any problems
      // occur, a message saying what went wrong.
      FileOutputStream fos = null;
      try {
        new File(sc.getRealPath("WEB-INF") + "/" + optionsFilename).delete();
        fos = new FileOutputStream(sc.getRealPath("WEB-INF") +
          "/" + optionsFilename);
        props.store(fos, null);
        fos.flush();
        result = "Options have been saved.";
      } catch (IOException e) {
        log.error("Error saving contact:");
        e.printStackTrace();
        result = "Options could not be saved.  " +
          "Please review logs for details.";
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

  } // End saveOptions().


} // End class.
