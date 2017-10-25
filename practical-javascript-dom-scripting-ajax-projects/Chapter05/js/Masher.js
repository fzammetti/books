/**
 * This class allows us to interact with JSON-based web services in the style
 * of Yahoo, that is, JSON wrapped in a function call.
 */
function Masher() {


  // Parameters for Yahoo! services.
  this.appID = "xxxxx";
  this.yahooURL = "http://api.local.yahoo.com/MapsService/V1/mapImage";

  // Parameters for Google services.
  this.googleURL = "http://www.google.com/base/feeds/snippets/-/hotels";


  /**
   * Removes an old script tag used to retrieve JSON.
   */
  this.removeOldScriptTag = function() {

    var scriptTag = $("jsonScriptTag");
      if(scriptTag) {
        scriptTag.parentNode.removeChild(scriptTag);
    }

  } // End removeOldScriptTag().


  /**
   * Perform an "AJAX" request using the dynamic script tag approach.
   *
   * @param inURL    The URL of the service.
   * @param inParams The parameters for the call.
   */
  this.doRequest = function(inURL, inParams) {

    // First, to avoid continually building up memory, remove any old script
    // tag out there.
    this.removeOldScriptTag();

    // Now build up a query string using the passed in parameters
    var queryString = "";
    for (param in inParams) {
      var paramVal = inParams[param];
      if (queryString == "") {
        queryString += "?";
      } else {
        queryString += "&";
      }
      queryString += param + "=" + paramVal;
    }

    // Now add a new script tag with the appropriate URL.
    var scriptTag = document.createElement("script");
    scriptTag.setAttribute("id", "jsonScriptTag");
    scriptTag.setAttribute("src", inURL + queryString);
    scriptTag.setAttribute("type", "text/javascript");
    var headTag = document.getElementsByTagName("head").item(0);
    headTag.appendChild(scriptTag);

  } // End doRequest().


} // End Masher.
