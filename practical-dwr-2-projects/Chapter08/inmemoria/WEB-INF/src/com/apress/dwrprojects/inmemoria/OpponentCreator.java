package com.apress.dwrprojects.inmemoria;


import javax.servlet.http.HttpSession;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.directwebremoting.create.AbstractCreator;
import org.directwebremoting.extend.Creator;
import org.directwebremoting.WebContext;
import org.directwebremoting.WebContextFactory;


/**
 * A custom DWR creator that retrieves the Opponent object from the caller's
 * session and returns it.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>
 */
public class OpponentCreator extends AbstractCreator implements Creator {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(OpponentCreator.class);


  /**
   * This method gets the Opponent object from the session associated with
   * the caller and returns it.
   *
   * @return The Opponent instance.
   */
  public Object getInstance() throws InstantiationException {

    log.trace("getInstance() - Entry");
    WebContext webContext = WebContextFactory.get();
    HttpSession session = webContext.getSession();
    Opponent opponent = (Opponent)session.getAttribute("opponent");
    log.trace("getInstance() - Exit");
    return opponent;

  } // End getInstance().


  /**
   * Return a Class for the type of object getInstance() returns.
   *
   * @return A Class instance.
   */
  public Class getType() {

    log.trace("getType() - Entry");
    Class clazz = null;
    try {
      clazz = Class.forName("com.apress.dwrprojects.inmemoria.Opponent");
    } catch (Exception e) {
      // Shouldn't ever happen.
      e.printStackTrace();
    }
    log.trace("getType() - Exit");
    return clazz;

  } // End getType().


} // End class.
