package app;


/**
 * A class used to demonstrate the bean converter.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class ClassA {


  /**
   * This method returns an instance of MyBean, which will be converted to a
   * JavaScript object by the bean converter.
   *
   * @return An instance of MyBean.
   */
  public MyBean methodA() {

    MyBean myBean = new MyBean();
    myBean.setMyField("A value has been set in myField");
    return myBean;

  } // End methodA().


} // End class.
