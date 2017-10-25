package com.apress.ajaxprojects.theorganizer.actions;


import com.apress.ajaxprojects.theorganizer.daos.AccountDAO;
import com.apress.ajaxprojects.theorganizer.objects.AccountObject;
import com.opensymphony.webwork.interceptor.SessionAware;
import com.opensymphony.xwork.Action;
import java.util.Map;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * Action to handle user logons.
 */
public class LogonAction implements Action, SessionAware {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog("com.apress.ajaxprojects");


  /**
   * The session map for this request.
   */
  private Map session;


  /**
   * Message to return to view.
   */
  private String message = "";


  /**
   * Username parameter.
   */
  private String username = "";


  /**
   * Password parameter.
   */
  private String password = "";


  /**
   * Mutator for session.
   *
   * @param inSession New value for session.
   */
  public void setSession(final Map inSession) {

    session = inSession;

  } // End setSession().


  /**
   * Mutator for message.
   *
   * @param inMessage New value for message.
   */
  public void setMessage(final String inMessage) {

    message = inMessage;

  } // End setMessage().


  /**
   * Accessor for message.
   *
   * @return Value of message.
   */
  public String getMessage() {

    return message;

  } // End getMessage().


  /**
   * Mutator for username.
   *
   * @param inUsername New value for username.
   */
  public void setUsername(final String inUsername) {

    username = inUsername;

  } // End setUsername().


  /**
   * Accessor for username.
   *
   * @return Value of username.
   */
  public String getUsername() {

    return username;

  } // End getUsername().


  /**
   * Mutator for password.
   *
   * @param inPassword New value for password.
   */
  public void setPassword(final String inPassword) {

    password = inPassword;

  } // End setPassword().


  /**
   * Accessor for password.
   *
   * @return Value of password.
   */
  public String getPassword() {

    return password;

  } // End getPassword().


  /**
   * Execute.
   *
   * @return result.
   */
  public String execute() {

    log.info("\n\n----------------------------------------------------------");

    log.debug("LogonAction.execute()...");

    // Display incoming request parameters.
    log.info("LogonAction : " + this.toString());

    // Get the user.
    AccountDAO    dao     = new AccountDAO();
    AccountObject account = dao.accountRetrieve(username);

    // See if they exist, and if their password is correct.
    if (account == null) {
      log.info("User not found");
      message = "User not found";
      return Action.ERROR;
    } else {
      if (!password.equalsIgnoreCase(account.getPassword())) {
        log.info("Password incorrect");
        message = "Password incorrect";
        return Action.ERROR;
      }
    }

    // User is valid, put AccountObject in session.
    log.info("User logged on");
    session.put("account", account);

    log.debug("LogonAction.execute() Done");

    return Action.SUCCESS;

  } // End execute().


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
      java.lang.reflect.Field[] fields = this.getClass().getDeclaredFields();
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
