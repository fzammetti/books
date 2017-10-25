package app;


import java.util.ArrayList;
import java.util.List;


/**
 * A class to demonstrate the signature section of dwr.xml.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class SigTestClass {


  /**
   * Method to return a List of names after they have been converted to all
   * upper-case.
   *
   * @param  inList A List of names.
   * @return        The values from inList, converted to upper-case.
   */
  public List<String> convertNames(final List<String> inList) {

    List<String> outList = new ArrayList<String>();
    for (String name : inList) {
      outList.add(name.toUpperCase());
    }
    return outList;

  } // End convertNames().


} // End class.
