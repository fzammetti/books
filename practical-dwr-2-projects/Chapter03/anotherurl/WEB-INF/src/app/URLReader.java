package app;


import java.io.IOException;
import javax.servlet.ServletException;
import org.directwebremoting.WebContextFactory;


/**
 * A class to read from a URL and return the contents.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class URLReader {


  /**
    * Read a URL and return its contents.
    *
    * @return                  The contents of the URL.
    * @throws ServletException If anything goes wrong.
    * @throws IOException      If anything goes wrong.
    */
  public String read() throws ServletException, IOException {

    return WebContextFactory.get().forwardToString("/another.jsp");

  } // End read().


} // End class.
