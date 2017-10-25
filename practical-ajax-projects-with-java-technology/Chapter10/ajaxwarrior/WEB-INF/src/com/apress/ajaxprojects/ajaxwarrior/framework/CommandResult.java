package com.apress.ajaxprojects.ajaxwarrior.framework;


import java.lang.reflect.Field;


/**
 * This class is an object that can be returned by a Command.  It directs the
 * FrontServlet to do a forward (default) or redirect to another location.
 */
public class CommandResult {


  /**
   * The path to forward or redirect to.
   */
  private String path;


  /**
   * Flag: Do a redirect?
   */
  private boolean redirect;



  /**
   * Constructor.
   *
   * @param inPath The path for this result.
   */
  public CommandResult(final String inPath) {

    path = inPath;

  } // End constructor.


  /**
   * Mutator for path.
   *
   * @param inPath New value for path.
   */
  public void setPath(final String inPath) {

    path = inPath;

  } // End setPath().


  /**
   * Accessor for path.
   *
   * @return Value of path.
   */
  public String getPath() {

    return path;

  } // End getPath().


  /**
   * Mutator for redirect.
   *
   * @param inRedirect New value for redirect.
   */
  public void setRedirect(final boolean inRedirect) {

    redirect = inRedirect;

  } // End setRedirect().


  /**
   * Accessor for redirect.
   *
   * @return Value of redirect.
   */
  public boolean doRedirect() {

    return redirect;

  } // End getRedirect().


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
