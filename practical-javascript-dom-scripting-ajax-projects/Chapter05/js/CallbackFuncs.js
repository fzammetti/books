/**
 * This is the function that is called when a Google service returns.
 *
 * @param inJSON The JSON object returned by the service.
 */
function googleCallback(inJSON) {

  var htmlOut = "";
  appState.hotels = new Array();

  // Iterate over the list of hotels.
  for (var i = 0; i < inJSON.feed.openSearch$itemsPerPage.$t; i++) {

    // Construct markup for the list for each hotel, including its information.
    var entry = inJSON.feed.entry[i];
    var hotel = new Hotel();
    hotel.name = entry.title.$t;
    hotel.location = entry.g$location.$t;
    hotel.description = entry.content.$t;
    appState.hotels.push(hotel);
    htmlOut += "<span onClick=\"" +
      "getMap('" + entry.g$location.$t + "');" +
      "showInfo(" + i + ");\" " +
      "onMouseOver=\"this.style.backgroundColor='#ffff00';" +
      "this.style.cursor='pointer';\" " +
      "onMouseOut=\"this.style.backgroundColor='';" +
      "this.style.cursor='';\"" +
      ">";
    htmlOut += entry.title.$t;
    htmlOut += "</span>";
    htmlOut += "<div id=\"hotelInfo" + i + "\" style=\"display:none;\" ";
    htmlOut += "class=\"hotelInfo\">";
    htmlOut += "</div>";
    htmlOut += "<br><br>";

  }

  // Put the generated markup in the search results list div.
  $("searchResults").innerHTML = htmlOut;
  $("pleaseWait").style.display = "none";

  // Ask Script.aculo.us to show the search results.
  new Effect.BlindDown("searchResults");

  // Set flags so we know what state the application is in.
  appState.searchResultsShowing = true;
  appState.mapShowing = false;

} // End googleCallback().


/**
 * This is the function that is called when a Yahoo service returns.
 *
 * @param inJSON The JSON object returned by the service.
 */
function yahooCallback(inJSON) {

  if (inJSON.Error) {
    var msg = "An error occurred retrieving map: ";
    if (inJSON.Error.Message) {
      msg += inJSON.Error.Message;
    }
    appState.mapShowing = false;
    $("map").src = "img/pixel_of_destiny.gif";
    alert(msg);
  } else {
    $("map").src = inJSON.ResultSet.Result;
  }

} // End yahooCallback().
