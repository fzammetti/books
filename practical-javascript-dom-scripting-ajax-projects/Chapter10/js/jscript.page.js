/**
 * jscript.page package
 *
 * This package contains utility functions that deal with a page as a whole.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. ZAmmetti</a>
 */
if (typeof jscript == 'undefined') {
  jscript = function() { }
}


jscript.page = function() { }


/**
 * This function invokes the browser's print function, if the browser version
 * is high enough.
 */
jscript.page.printPage = function() {

  if (parseInt(navigator.appVersion) >= 4) {
    window.print()
  }

} // End printPage().


/**
 * This function returns the value of a specified parameter that may have
 * been passed to this page, or it returns an array of all parameters passed
 * to the page, depending on the input parameter.
 *
 * @param  inParamName The name of the parameter to get values for, or null
 *                     to return all parameters.
 * @return             A string value, the value of the specified parameter,
 *                     or an associative array of all parameters if null
 *                     was passed in.
 */
jscript.page.getParameter = function(inParamName) {

  var retVal = null;
  var varvals = unescape(location.search.substring(1));
  if (varvals) {
    var search_array = varvals.split("&");
    var temp_array = new Array();
    var j = 0;
    var i = 0;
    for (i = 0; i < search_array.length; i++) {
      temp_array = search_array[i].split("=");
      var pName = temp_array[0];
      var pVal = temp_array[1];
      if (inParamName == null) {
        if (retVal == null) {
          retVal = new Array();
        }
        retVal[j] = pName;
        retVal[j + 1] = pVal;
        j = j + 2;
      } else {
        if (pName == inParamName) {
          retVal = pVal;
          break;
        }
      }
    }
  }
  return retVal;

} // End getParameters().


/**
 * Call this function to break out of frames.
 */
jscript.page.breakOutOfFrames = function() {

  if (self != top) {
    top.location = self.location;
  }

} // End breakOutOfFrames().
