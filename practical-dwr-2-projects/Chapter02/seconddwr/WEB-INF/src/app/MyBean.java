package app;


/**
 * A test bean used to demonstrate the bean converter.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class MyBean {


  /**
   * A test field.
   */
  private String myField;


  /**
   * Mutator for myField.
   *
   * @param inMyField New value for myField.
   */
  public void setMyField(final String inMyField) {

    myField = inMyField;

  } // End setMyField().


  /**
   * Accessor for myField.
   *
   * @return Value of myField.
   */
  public String getMyField() {

    return myField;

  } // End getMyField().


} // End class.
