import java.io.PrintWriter;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class GraffitiServlet extends HttpServlet {

  public static String msg;

  public void init() throws ServletException {
    GraffitiServlet.msg = "Bart was here!";
  }

  public void doGet(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {

    response.setContentType("text/html");
    PrintWriter out = response.getWriter();

    out.println("<html>\n<head>\n<title>SimpleServlet</title>\n</head>\n" +
       "<body bgcolor=\"#ffeaea\">\n");
    out.println("<h1>" + msg + "</h1>\n");
    out.println("</body>\n</html>");

    out.close();

  }

}