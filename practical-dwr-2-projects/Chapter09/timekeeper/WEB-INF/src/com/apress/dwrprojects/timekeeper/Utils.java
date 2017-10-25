package com.apress.dwrprojects.timekeeper;


import org.directwebremoting.ScriptBuffer;
import org.directwebremoting.ScriptSession;
import org.directwebremoting.WebContext;
import org.directwebremoting.WebContextFactory;
import org.hibernate.cfg.Configuration;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import java.util.Collection;
import java.util.Iterator;


/**
 * A utility class including functions to getting a Hibernate SessionFactory
 * instance and to call a method on the client.
 */
public class Utils {


  /**
   * SessionFactory instance handle.
   */
  private static SessionFactory sessionFactory;


  /**
   * Returns (and first creates if necessary) a Hibernate SessionFactory.
   *
   * @return SessionFactory instance.
   */
  static {

    // Create the SessionFactory from hibernate.cfg.xml
    sessionFactory = new Configuration().configure().buildSessionFactory();

  } // End static initializer block.


  /**
   * Gets a Hibernate Session from the SessionFactory.
   *
   * @return a Hibernate Session objection from the SessionFactory.
   */
  public static Session getHibernateSession() {

    return sessionFactory.getCurrentSession();

  } // End getHibernateSession().


  /**
   * This sends a COMET-based command to all connected clients to update the
   * data on their screens.
   */
  public static void callUpdateData() {

    WebContext wctx = WebContextFactory.get();
    String currentPage = wctx.getCurrentPage();
    ScriptBuffer script = new ScriptBuffer();
    script.appendScript("timekeeper.updateData();");
    Collection pages = wctx.getScriptSessionsByPage(currentPage);
    for (Iterator it = pages.iterator(); it.hasNext();) {
      ScriptSession session = (ScriptSession)it.next();
      session.addScript(script);
    }

  } // End callUpdateData().


} // End class.
