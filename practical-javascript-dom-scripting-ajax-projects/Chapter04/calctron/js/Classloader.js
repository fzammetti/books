function Classloader() {


  /**
   * Load a named class.
   *
   * @param inClassName The name of the class to load.  We assume it's a
   *                    calculator mode class, so it's always in the modes
   *                    subdirectory.
   */
  this.load = function(inClassName) {

    // Dynamically create a new script tag, point it at the mode source file,
    // and append it to the document's head section, thereby loading and
    // parsing it automatically.
    var scriptTag = document.createElement("script");
    scriptTag.src = "modes/" + inClassName + ".js";
    var headTag = document.getElementsByTagName("head").item(0);
    headTag.appendChild(scriptTag);

  } // End load().


  /**
   * This function verifies that a given class matches another.  In other
   * words, it ensures that all the functions of inBaseClass are found in
   * inClass, which means they have the same public interface.  It also
   * checks that the id field is present, which is required by code outside
   * a mode class (note that all other non-function fields are ignored, since
   * they do not contribute to the public interface).
   *
   * @param  inClass     The class to verify.
   * @param  inBaseClass The class to verify against.
   * @return             True if inClass is "valid", false if not.
   */
  this.verify = function(inClass, inBaseClass) {

    var isValid = true;
    for (i in inBaseClass) {
      if (i != "resultsCurrent" && i != "resultsPrevious" &&
        i != "resultsCurrentNegated" && i != "resultsPreviousNegated" &&
        !inClass[i]) {
        isValid = false;
      }
    }
    return isValid;

  } // End verify().


} // End Classloader class.
