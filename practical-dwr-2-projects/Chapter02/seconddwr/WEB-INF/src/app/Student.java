package app;


/**
 * A simple bean to test bean setting.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class Student {


  /**
   * Student's name.
   */
  private String name = "";


  /**
   * Student's GPA.
   */
  private float gpa = 0.0f;


  /**
   * Mutator for name.
   *
   * @param inName New value for name.
   */
  public void setName(final String inName) {

    name = inName;

  } // End setName().


  /**
   * Accessor for name.
   *
   * @return Value of name.
   */
  public String getName() {

    return name;

  } // End getName().


  /**
   * Mutator for gpa.
   *
   * @param inGpa New value for gpa.
   */
  public void setGpa(final float inGpa) {

    gpa = inGpa;

  } // End setGpa().


  /**
   * Accessor for gpa.
   *
   * @return Value of gpa.
   */
  public float getGpa() {

    return gpa;

  } // End getGpa().


  /**
   * Overriden toString method.
   *
   * @return A reflexively built string representation of this bean.
   */
  public String toString() {

    String str = null;
    StringBuffer sb = new StringBuffer(1000);
    sb.append("[").append(super.toString()).append("]={");
    boolean firstPropertyDisplayed = false;
    try {
      java.lang.reflect.Field[] fields = this.getClass().getDeclaredFields();
      for (int i = 0; i < fields.length; i++) {
        if (firstPropertyDisplayed) {
          sb.append(", ");
        } else {
          firstPropertyDisplayed = true;
        }
        sb.append(fields[i].getName()).append("=").append(fields[i].get(this));
      }
      sb.append("}");
      str = sb.toString().trim();
    } catch (IllegalAccessException iae) {
      iae.printStackTrace();
    }
    return str;

  } // End toString().


} // End class.
