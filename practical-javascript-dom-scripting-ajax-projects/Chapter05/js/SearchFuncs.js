/**
 * Start execution of a search by ZIP code with Google Base.
 */
function search() {

  // Reset things that need to be reset.
  resetZoomButtons();
  appState.currentlyDisplayedIndex = -1;

  // Hide information for all hotels.
  for (var i = 0; i < appState.hotels.length; i++) {
    $("hotelInfo" + i).style.display = "none";
  }

  // If there are search results showing, hide them.
  if (appState.searchResultsShowing) {

    new Effect.BlindUp("searchResults",
      {
        afterFinish : function() {
          // Now do the actual search.
          searchPart2();
        }
      }
    );
    // If a map and hotel info is showing, hide it too.
    if (appState.mapShowing) {
      new Effect.Puff("map",
        {
          afterFinish : function() {
            $("map").style.display = "none";
            $("mapFiller").style.display = "block";
          }
        }
      );
    }

  } else {

    // No results currently showing, so just do the search.
    searchPart2();

  }

} // End search().


/**
 * Continue search after effect.
 */
function searchPart2() {

  // Show Please Wait.
  $("searchResults").style.display = "none";
  $("pleaseWait").style.display = "block";

  // Do search.
  var zipCode = $("zipCodeField").value;
  masher.doRequest(masher.googleURL,
    {
      "bq" : "%5blocation:@%22" + escape(zipCode) + "%22%2b50mi%5d",
      "alt" : "json-in-script",
      "callback" : "googleCallback"
    }
  );

} // End searchPart2().
