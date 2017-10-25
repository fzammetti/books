package com.apress.ajaxprojects.theorganizer.actions;


import com.opensymphony.webwork.ServletActionContext;
import com.opensymphony.xwork.Action;
import com.opensymphony.xwork.ActionContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * Action to handle user logoffs.
 */
public class LogoffAction implements Action {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog("com.apress.ajaxprojects");


  /**
   * Message to return to view.
   */
  private String message = "";


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
   * Execute.
   *
   * @return result.
   */
  public String execute() {

    log.info("\n\n----------------------------------------------------------");

    log.debug("LogoffAction.execute()...");

    message = "You have logged out";
    ActionContext      context = ActionContext.getContext();
    HttpServletRequest request =
      (HttpServletRequest)context.get(ServletActionContext.HTTP_REQUEST);
    HttpSession        session = request.getSession();
    session.invalidate();

    log.debug("LogoffAction.execute() Done");

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
