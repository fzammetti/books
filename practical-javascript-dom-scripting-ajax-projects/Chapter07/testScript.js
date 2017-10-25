function testJSDigester() {

  // Create a string of test XML to have JSDigester parse.
  var sampleXML = "";
  sampleXML += "<movies numMovies=\"2\">\n";
  sampleXML += "  <movie>\n";
  sampleXML += "    <title>Star Wars</title>\n";
  sampleXML += "    <actor gender=\"male\">Harrison Ford</actor>\n";
  sampleXML += "    <actor gender=\"female\">Carrie Fisher</actor>\n";
  sampleXML += "  </movie>\n";
  sampleXML += "  <movie>\n";
  sampleXML += "    <title>Real Genius</title>\n";
  sampleXML += "    <actor gender=\"male\">Val Kilmer</actor>\n";
  sampleXML += "  </movie>\n";
  sampleXML += "</movies>";

  // Create a logger for JSDigester to use, and set it's level to TRACE, and tell
  // it where to log to.
  var log = new jscript.debug.DivLogger();
  log.setLevel(log.LEVEL_TRACE);
  log.setTargetDiv(document.getElementById("divLog"));

  // Instantiate a JSDigester instance and set up the rules, and logger.
  var jsDigester = new JSDigester();
  jsDigester.setLogger(log);
  jsDigester.addObjectCreate("movies", "Movies");
  jsDigester.addSetProperties("movies");
  jsDigester.addObjectCreate("movies/movie", "Movie");
  jsDigester.addBeanPropertySetter("movies/movie/title", "setTitle");
  jsDigester.addObjectCreate("movies/movie/actor", "Actor");
  jsDigester.addSetProperties("movies/movie/actor");
  jsDigester.addBeanPropertySetter("movies/movie/actor", "setName");
  jsDigester.addSetNext("movies/movie/actor", "addActor");
  jsDigester.addSetNext("movies/movie", "addMovie");

  // Parse the XML, resulting in an instance of the Movies class.
  var myMovies = jsDigester.parse(sampleXML);

  // Construct result string.
  var outStr = "JSDigester processed the specified XML." +
    "\n\nIt created an object graph consisting of a Movies object, " +
    "with a numMovies property, and containing a collection of " +
    "Movie objects." +
    "\n\nEach Movie object has a title property, and " +
    "contains a collection of Actor objects.\n\n" +
    "Each Actor object has two fields, name and gender.\n\n" +
    "Here's the final Movies object JSDigester returned: \n\n" +
    myMovies;

  // Display results.
  alert(outStr);

}
