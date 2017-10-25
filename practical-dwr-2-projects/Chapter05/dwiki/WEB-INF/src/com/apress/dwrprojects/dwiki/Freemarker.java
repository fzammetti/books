package com.apress.dwrprojects.dwiki;


import freemarker.template.Configuration;
import freemarker.template.DefaultObjectWrapper;
import freemarker.template.Template;
import java.io.StringWriter;
import java.io.Writer;
import java.util.Map;
import javax.servlet.ServletContext;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * This is a class for running Freemarker templates and returning the output
 * from the execution.  It is used throughout the application to generate
 * various things that should be templated.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class Freemarker {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog(Freemarker.class);


  /**
   * The Freemarker Configuration object that will be used each execution.
   */
  private static Configuration fmConfig;


  /**
   * This method is called once, from the context listener, to initialize
   * Freemarker, setting up the Configuration object, etc.  If it happens to
   * be called more than once, no harm, but it isn't necessary.
   *
   * @param inServletContext The ServletContext of the context listener.
   */
  public void init(ServletContext inServletContext) {

    if (fmConfig == null) {
      fmConfig = new Configuration();
      fmConfig.setObjectWrapper(new DefaultObjectWrapper());
      fmConfig.setServletContextForTemplateLoading(inServletContext,
        "templates");
    }

  } // End init().


  /**
    * The run() is called to execute a Freemarker template.
    *
    * @param  inTemplate The name of the template file to use.
    * @param  inData     The FreemarkerData object populated from the incoming
    *                    data from the client.
    * @return            The results of executing the template.
    * @throws Exception  If anything goes wrong.
    */
  public String run(String inTemplate, Map inData) throws Exception {

    log.trace("Freemarker.run() - Entry");

    if (log.isDebugEnabled()) {
      log.debug(("Freemarker.run() - inTemplate = " + inTemplate));
      log.debug(("Freemarker.run() - inData = " + inData));
    }

    // Read in the Freemarker template specified.
    Template template = null;
    try {
      template = fmConfig.getTemplate(inTemplate);
    } catch (Exception e) {
      log.error("Freemarker.run() - Could not load Freemarker template " +
        inTemplate + "... is it in the classpath in the " +
        "expected location?  Is the template value passed in " +
        "fully-qualified? (Error: " + e);
      return "error";
    }

    // Generate the output.
    Writer out = new StringWriter();
    template.process(inData, out);
    out.flush();
    if (log.isDebugEnabled()) {
      log.debug("Freemarker.run() - Generated output = " + out);
    }

    // Return output.
    log.trace("Freemarker.run() - Exit");
    return out.toString();

  } // End run().


} // End class.
