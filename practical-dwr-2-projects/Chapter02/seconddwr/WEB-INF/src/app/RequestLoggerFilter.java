package app;


import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;


/**
 * A simple filter to log any incoming requests.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class RequestLoggerFilter implements Filter {


  /**
   * Initialize this filter.
   *
   * @param  filterConfig     The configuration information for this filter.
   * @throws ServletException ServletException.
   */
  public void init(FilterConfig filterConfig) throws ServletException {
  } // End init().


  /**
   * Do filter's work.
   *
   * @param  request          The current request object.
   * @param  response         The current response object.
   * @param  filterChain      The current filter chain.
   * @throws ServletException ServletException.
   * @throws IOException      IOException.
   */
  public void doFilter(ServletRequest request, ServletResponse response,
    FilterChain filterChain) throws ServletException, IOException {

    System.out.println("Request came in");
    filterChain.doFilter(request, response);

  } // End doFilter().


  /**
   * Destroy.
   */
  public void destroy() {

  } // End destroy.


} // End class.
