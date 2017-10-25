package com.apress.ajaxprojects.theorganizer.actions;


import com.opensymphony.xwork.Action;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * An Action that provides a simple forward to a resource.
 */
public class ForwardAction implements Action {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog("com.apress.ajaxprojects");


  /**
   * Execute.
   *
   * @return result.
   */
  public String execute() {

    log.info("\n\n----------------------------------------------------------");
    log.debug("ForwardAction.");

    return Action.SUCCESS;

  } // End execute().


} // End class.
