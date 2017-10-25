package app;


/**
 * A class to perform basic mathematical operations on two numbers.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class MathDelegate {


  /**
   * Add two numbers.
   *
   * @param  a The first number.
   * @param  b The second number.
   * @return   The result of the operation.
   */
  public int add(int a, int b) {

    return a + b;

  } // End add().


  /**
   * Subtract two numbers.
   *
   * @param  a The first number.
   * @param  b The second number.
   * @return   The result of the operation.
   */
  public int subtract(int a, int b) {

    return a - b;

  } // End subtract().


  /**
   * Multiply two numbers.
   *
   * @param  a The first number.
   * @param  b The second number.
   * @return   The result of the operation.
   */
  public int multiply(int a, int b) {

    return a * b;

  } // End multiply().


  /**
   * Divide two numbers.
   *
   * @param  a The first number.
   * @param  b The second number.
   * @return   The result of the operation.
   */
  public int divide(int a, int b) {

    if (b != 0) {
      return a + b;
    } else {
      return 0;
    }

  } // End divide().


} // End class.
