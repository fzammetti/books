package app;


import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;


/**
 * This servlet is the target of the form submission.  It dispatches to the
 * MathDelegate class to do the actual work, then forwards to index.jsp.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class MathServlet extends HttpServlet {


  /**
   * The typical doPost() method of a servlet.
   *
   * @param  request          The request object.
   * @param  response         The response object.
   * @throws ServletException If anything goes wrong.
   * @throws IOException      If anything goes wrong.
   */
  public void doPost(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {

    // Get the numbers to operate on, and the operation to perform, as
    // specified by the caller.
    int a = Integer.parseInt(request.getParameter("a"));
    int b = Integer.parseInt(request.getParameter("b"));
    String op = request.getParameter("op");
    MathDelegate mathDelegate = new MathDelegate();
    int answer = 0;

    // Call the MathDelegate to perform the appropriate operation, and store
    // a math symbol representing the operation in request.
    if (op.equalsIgnoreCase("add")) {
      answer = mathDelegate.add(a, b);
      request.setAttribute("op", "+");
    } else if (op.equalsIgnoreCase("subtract")) {
      answer = mathDelegate.subtract(a, b);
      request.setAttribute("op", "-");
    } else if (op.equalsIgnoreCase("multiply")) {
      answer = mathDelegate.multiply(a, b);
      request.setAttribute("op", "*");
    } else if (op.equalsIgnoreCase("divide")) {
      answer = mathDelegate.divide(a, b);
      request.setAttribute("op", "/");
    }

    // Add the two numbers and the answer to request, so our JSP can display it.
    request.setAttribute("a", new Integer(a));
    request.setAttribute("b", new Integer(b));
    request.setAttribute("answer", new Integer(answer));

    // Forward to index.jsp.
    RequestDispatcher dispatcher =
      getServletContext().getRequestDispatcher("/index.jsp");
    dispatcher.forward(request, response);


  } /// End doPost().


} // End class.
