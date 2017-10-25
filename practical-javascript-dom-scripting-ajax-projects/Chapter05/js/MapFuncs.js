/**
 * Retrieve map for address of selected hotel with Yahoo Maps.
 *
 * @param inLocation The address of the hotel to get a map for.
 * @param inZoom     The zoom level, 1-12, of the map.
 */
function getMap(inLocation, inZoom) {

  // The default zoom level is 6.
  if (!inZoom) {
    inZoom = 6;
  }

  // Show the Please Wait message while we request the map.
  $("map").src = "img/retrieving_map.gif";
  $("map").style.display = "block";
  $("mapFiller").style.display = "none";

  // Ask the masher to make the request for us.
  masher.doRequest(masher.yahooURL,
    {
      "appid" : masher.appID,
      "location" : escape(inLocation),
      "image_type" : "gif",
      "output" : "json",
      "width" : "520",
      "height" : "400",
      "zoom" : inZoom,
      "callback" : "yahooCallback"
    }
  );

  // Set state and reset the zoom buttons, and highlight the current zoom
  // level.
  appState.mapShowing = true;
  resetZoomButtons();
  highlightZoomButton(inZoom);

} // End getMap().


/**
 * Zoom the map according to the zoom button clicked.
 *
 * @param inZoom The zoom level, 1-12, to zoom the map to.
 */
function zoomMap(inZoom) {

  // Obviously this only does something if a map is showing.
  if (appState.mapShowing) {
    var hotel = appState.hotels[appState.currentlyDisplayedIndex];
    getMap(hotel.location, inZoom);
  }

} // End zoomMap().


/**
 * Reset all the zoom buttons so none are highlighted.
 */
function resetZoomButtons() {

  for (var i = 1; i < 13; i++) {
    $("zoomButton" + i).style.fontSize = "10pt"
  }

} // End resetZoomButtons().


/**
 * Highlight the speciried zoom button.
 *
 * @param inZoom The zoom level, 1-12, of the button to highlight.
 */
function highlightZoomButton(inZoom) {

  $("zoomButton" + inZoom).style.fontSize = "16pt"

} // End highlightZoomButton().
