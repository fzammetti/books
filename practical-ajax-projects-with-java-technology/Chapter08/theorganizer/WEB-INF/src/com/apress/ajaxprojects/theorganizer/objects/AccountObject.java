package com.apress.ajaxprojects.theorganizer.objects;


/**
 * This class represents a Account.
 */
public class AccountObject {


  /**
   * Username of account.
   */
  private String username;


  /**
   * Password of account.
   */
  private String password;


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
