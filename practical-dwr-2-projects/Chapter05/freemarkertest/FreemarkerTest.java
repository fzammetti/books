import freemarker.cache.ClassTemplateLoader;
import freemarker.template.Configuration;
import freemarker.template.DefaultObjectWrapper;
import freemarker.template.Template;
import java.io.StringWriter;
import java.io.Writer;
import java.util.ArrayList;
import java.util.HashMap;


/**
 * A simple class to demonstrate Freemarker by itself.
 */
public class FreemarkerTest {


  /**
   * The main method
   *
   * @param args Command line arguments.
   */
  public static void main(String[] args) {

    try {

      // Configure Freemarker.
      Configuration fmConfig = new Configuration();
      fmConfig.setObjectWrapper(new DefaultObjectWrapper());
      fmConfig.setTemplateLoader(new ClassTemplateLoader(
        new FreemarkerTest().getClass(), "/"));

      // Build our data map.
      HashMap data = new HashMap();
      data.put("name", "MY FAVORITE READER");
      ArrayList favoriteThings = new ArrayList();
      HashMap ft1 = new HashMap();
      ft1.put("name", "Soda");
      favoriteThings.add(ft1);
      HashMap ft2 = new HashMap();
      ft2.put("name", "Pizza");
      favoriteThings.add(ft2);
      HashMap ft3 = new HashMap();
      ft3.put("name", "Jericho");
      favoriteThings.add(ft3);
      data.put("favoriteThings", favoriteThings);

      // Have Freemarker execute the template and display the output.
      Template template = null;
      template = fmConfig.getTemplate("hello.ftl");
      Writer out = new StringWriter();
      template.process(data, out);
      out.flush();
      System.out.println(out.toString());

    } catch (Exception e) {
      e.printStackTrace();
    }

  } // End main().


} // End class.