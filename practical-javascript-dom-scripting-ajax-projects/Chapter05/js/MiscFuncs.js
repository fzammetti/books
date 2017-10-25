/**
 * Function to show extended hotel information.
 *
 * @paran inIndex Index into the array of hotels in appState.
 */
function showInfo(inIndex) {

  // Trivial rejection: are we already showing the requested hotel?
  if (inIndex == appState.currentlyDisplayedIndex) {
    return;
  }

  // Shrink the information for the currently showing hotel.
  if (appState.currentlyDisplayedIndex != -1) {
    new Effect.Shrink("hotelInfo" +
      appState.currentlyDisplayedIndex,{duration:1.0});
  }

  // Update application state and insert the new hotel information.
  appState.currentlyDisplayedIndex = inIndex;
  var hotel = appState.hotels[inIndex];
  var htmlOut = "<br>" + hotel.location + "<br><br>";
  htmlOut += hotel.description;
  $("hotelInfo" + inIndex).innerHTML = htmlOut;

  // And finally, have the new info "grow" into view.
  new Effect.Grow("hotelInfo" + inIndex,{duration:1.0});

} // End showInfo().
