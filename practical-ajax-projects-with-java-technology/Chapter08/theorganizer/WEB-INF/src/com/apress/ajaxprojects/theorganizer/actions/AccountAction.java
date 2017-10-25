package com.apress.ajaxprojects.theorganizer.actions;


import com.apress.ajaxprojects.theorganizer.daos.AccountDAO;
import com.apress.ajaxprojects.theorganizer.objects.AccountObject;
import com.opensymphony.webwork.interceptor.SessionAware;
import com.opensymphony.webwork.ServletActionContext;
import com.opensymphony.xwork.Action;
import com.opensymphony.xwork.ActionContext;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.dao.DataIntegrityViolationException;


/**
 * This Action is called to perform operations on an account, including
 * saving a new one, getting the user's account for editing, updating the
 * existing account and deleting the user's account.
 */
public class AccountAction implements Action, SessionAware {


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
   * Password verification parameter.
   */
  private String password_2 = "";


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
   * Mutator for password_2.
   *
   * @param inPassword_2 New value for password_2.
   */
  public void setPassword_2(final String inPassword_2) {

    password_2 = inPassword_2;

  } // End setPassword_2().


  /**
   * Accessor for password_2.
   *
   * @return Value of password_2.
   */
  public String getPassword_2() {

    return password_2;

  } // End getPassword_2().


  /**
   * execute() (to fulfill interface contract).
   *
   * @return null.
   */
  public String execute() {

    return null;

  } // End execute().


  /**
   * Create a new account.
   *
   * @return result.
   */
  public String create() {

    log.info("\n\n----------------------------------------------------------");

    log.debug("AccountAction.create()...");

    // Display incoming request parameters.
    log.info("AccountAction : " + this.toString());

    // Validation: does password match password_2?
    if (!password.equalsIgnoreCase(password_2)) {
      log.debug("Password not matched");
      message = "Password not matched";
      return Action.ERROR;
    }

    // Construct AccountObject instance.
    AccountObject account = new AccountObject();
    account.setUsername(username);
    account.setPassword(password);

    // Call AccountDAO to save account.
    AccountDAO dao = new AccountDAO();
    try {
      dao.accountCreate(account);
    } catch (DataIntegrityViolationException dive) {
      // Username already exists.
      log.debug("Username already exists");
      message = "That username already exists.  Please try another.";
      return Action.ERROR;
    }

    log.debug("AccountAction.create() Done");

    // Put the AccountObject in session.
    session.put("account", account);

    return Action.SUCCESS;

  } // End create().


  /**
   * Retrieve an account for editing.
   *
   * @return result.
   */
  public String retrieve() {

    log.info("\n\n----------------------------------------------------------");

    log.debug("AccountAction.retrieve()...");

    // Display incoming request parameters.
    log.info("AccountAction : " + this.toString());

    // Get account from session.
    AccountObject account = (AccountObject)session.get("account");

    // Populate fields for output display.
    password   = account.getPassword();
    password_2 = account.getPassword();

    log.debug("AccountAction.retrieve() Done");

    return Action.SUCCESS;

  } // End retrieve().


  /**
   * Update account.
   *
   * @return result.
   */
  public String update() {

    log.info("\n\n----------------------------------------------------------");

    log.debug("AccountAction.update()...");

    // Display incoming request parameters.
    log.info("AccountAction : " + this.toString());

    // Validation: does password match password_2?
    if (!password.equalsIgnoreCase(password_2)) {
      log.debug("Password not matched");
      message = "Password not matched";
      return Action.ERROR;
    }

    // Get the AccountObject from session.
    AccountObject account = (AccountObject)session.get("account");

    // Change password.
    account.setPassword(password);

    // Call AccountDAO to update account.
    AccountDAO dao = new AccountDAO();
    dao.accountUpdate(account);

    log.debug("AccountAction.update() Done");

    return Action.SUCCESS;

  } // End update().


  /**
   * Delete user's account.
   *
   * @return result.
   */
  public String delete() {

    log.info("\n\n----------------------------------------------------------");

    log.debug("AccountDelete.delete()...");

    // Get the AccountObject from session.
    AccountObject account = (AccountObject)session.get("account");

    // Call AccountDAO to delete account.
    AccountDAO dao = new AccountDAO();
    dao.accountDelete(account);

    // One last thing: log off the user so the session goes bye-bye.
    ActionContext      context = ActionContext.getContext();
    HttpServletRequest request =
      (HttpServletRequest)context.get(ServletActionContext.HTTP_REQUEST);
    HttpSession        sess    = request.getSession();
    sess.invalidate();

    log.debug("AccountAction.delete() Done");

    return Action.SUCCESS;

  } // End delete().


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
