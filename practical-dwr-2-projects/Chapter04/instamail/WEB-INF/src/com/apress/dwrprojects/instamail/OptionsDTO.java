package com.apress.dwrprojects.instamail;


import java.lang.reflect.Field;


/**
 * This is a bean that describes options, including the eMail account.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class OptionsDTO {


  /**
   * Flag: has the application been configured?
   */
  private boolean configured;


  /**
   * POP3 server address.
   */
  private String pop3Server;


  /**
   * Does the POP3 server require username/password?  "T" or "F".
   */
  private String pop3ServerRequiresLogin;


  /**
   * POP3 username.
   */
  private String pop3Username;


  /**
   * POP3 password.
   */
  private String pop3Password;


  /**
   * SMTP server address.
   */
  private String smtpServer;


  /**
   * * Does the SMTP server require username/password?  "T" or "F".
   */
  private String smtpServerRequiresLogin;


  /**
   * SMTP username.
   */
  private String smtpUsername;


  /**
   * SMTP password.
   */
  private String smtpPassword;


  /**
   * From address.
   */
  private String fromAddress;


  /**
   * Mutator for configured.
   *
   * @param inConfigured New value for configured.
   */
  public void setConfigured(boolean inConfigured) {

    configured = inConfigured;

  } // End setConfigured().


  /**
   * Accessor for configured.
   *
   * @return Value of configured.
   */
  public boolean isConfigured() {

    return configured;

  } // End isConfigured().



  /**
   * setPop3Server.
   *
   * @param inPop3Server inPop3Server.
   */
  public void setPop3Server(String inPop3Server) {

    pop3Server = inPop3Server;

  } // End setPop3Server().


  /**
   * getPop3Server.
   *
   * @return pop3Server.
   */
  public String getPop3Server() {

    return pop3Server;

  } // End getPop3Server().


  /**
   * setPop3Username.
   *
   * @param inPop3Username inPop3Username.
   */
  public void setPop3Username(String inPop3Username) {

    pop3Username = inPop3Username;

  } // End setPop3Username().


  /**
   * getPop3Username.
   *
   * @return pop3Username.
   */
  public String getPop3Username() {

    return pop3Username;

  } // End getPop3Username().


  /**
   * setPop3Password.
   *
   * @param inPop3Password inPop3Password.
   */
  public void setPop3Password(String inPop3Password) {

    pop3Password = inPop3Password;

  } // End setPop3Password().


  /**
   * getPop3Password.
   *
   * @return pop3Password.
   */
  public String getPop3Password() {

    return pop3Password;

  } // End getPop3Password().


  /**
   * setPop3ServerRequiresLogin.
   *
   * @param inPop3ServerRequiresLogin inPop3ServerRequiresLogin.
   */
  public void setPop3ServerRequiresLogin(String inPop3ServerRequiresLogin) {

    pop3ServerRequiresLogin = inPop3ServerRequiresLogin;

  } // End setPop3ServerRequiresLogin().


  /**
   * getPop3ServerRequiresLogin.
   *
   * @return pop3ServerRequiresLogin.
   */
  public String getPop3ServerRequiresLogin() {

    return pop3ServerRequiresLogin;

  } // End getPop3ServerRequiresLogin().


  /**
   * setSmtpServer.
   *
   * @param inSmtpServer inSmtpServer.
   */
  public void setSmtpServer(String inSmtpServer) {

    smtpServer = inSmtpServer;

  } // End setSmtpServer().


  /**
   * getSmtpServer.
   *
   * @return smtpServer.
   */
  public String getSmtpServer() {

    return smtpServer;

  } // End getSmtpServer().


  /**
   * setSmtpUsername.
   *
   * @param inSmtpUsername inSmtpUsername.
   */
  public void setSmtpUsername(String inSmtpUsername) {

    smtpUsername = inSmtpUsername;

  } // End setSmtpUsername().


  /**
   * getSmtpUsername.
   *
   * @return smtpUsername.
   */
  public String getSmtpUsername() {

    return smtpUsername;

  } // End getSmtpUsername().


  /**
   * setSmtpPassword.
   *
   * @param inSmtpPassword inSmtpPassword.
   */
  public void setSmtpPassword(String inSmtpPassword) {

    smtpPassword = inSmtpPassword;

  } // End setSmtpPassword().


  /**
   * getSmtpPassword.
   *
   * @return smtpPassword.
   */
  public String getSmtpPassword() {

    return smtpPassword;

  } // End getSmtpPassword().


  /**
   * setSmtpServerRequiresLogin.
   *
   * @param inSmtpServerRequiresLogin inSmtpServerRequiresLogin.
   */
  public void setSmtpServerRequiresLogin(String inSmtpServerRequiresLogin) {

    smtpServerRequiresLogin = inSmtpServerRequiresLogin;

  } // End setSmtpServerRequiresLogin().


  /**
   * getSmtpServerRequiresLogin.
   *
   * @return smtpServerRequiresLogin.
   */
  public String getSmtpServerRequiresLogin() {

    return smtpServerRequiresLogin;

  } // End getSmtpServerRequiresLogin().


  /**
   * setFromAddress.
   *
   * @param inFromAddress inFromAddress.
   */
  public void setFromAddress(String inFromAddress) {

    fromAddress = inFromAddress;

  } // End setFromAddress().


  /**
   * getFromAddress.
   *
   * @return fromAddress.
   */
  public String getFromAddress() {

    return fromAddress;

  } // End getFromAddress().


  /**
   * Overriden toString method.
   *
   * @return A reflexively-built string representation of this bean.
   */
  public String toString() {

    String str = null;
    StringBuffer sb = new StringBuffer(1000);
    sb.append("[" + super.toString() + "]={");
    boolean firstPropertyDisplayed = false;
    try {
      Field[] fields = this.getClass().getDeclaredFields();
      for (int i = 0; i < fields.length; i++) {
        if (firstPropertyDisplayed) {
          sb.append(", ");
        } else {
          firstPropertyDisplayed = true;
        }
        sb.append(fields[i].getName() + "=" + fields[i].get(this));
      }
      sb.append("}");
      str = sb.toString().trim();
    } catch (IllegalAccessException iae) {
      iae.printStackTrace();
    }
    return str;

  } // End toString().


} // End class.
