import java.io.*;
import org.xml.sax.*;
import org.xml.sax.helpers.DefaultHandler;
import javax.xml.parsers.SAXParserFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.parsers.SAXParser;

public class ListElements extends DefaultHandler {

  public static void main(String argv[]) {
    if (argv.length != 1) {
      System.err.println("Usage: java xml_file");
      System.exit(1);
    }

    DefaultHandler handler = new ListElements();
    SAXParserFactory factory = SAXParserFactory.newInstance();
    try {
      SAXParser saxParser = factory.newSAXParser();
      saxParser.parse(new File(argv [0]), handler);
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  public void startElement(String inNamespaceURI, String inLName, 
    String inQName, Attributes attributes) throws SAXException {
    String elementName = inLName;
    if (elementName.equals("")) {
      elementName = inQName;
    }
    if (elementName.equalsIgnoreCase("Band")) {
      System.out.print("***** ");
    }
    System.out.print("<" + elementName + "> found");
    if (!elementName.equalsIgnoreCase("BestBandsInTheWorld")) {
      String name = attributes.getValue("name");
      System.out.print(", name=" + name);
    }
    System.out.println("");
  }
  
}