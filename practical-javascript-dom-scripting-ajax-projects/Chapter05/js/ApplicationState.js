/**
 * This class stores information about the state of the application.
 */
function ApplicationState() {


  /**
   * This is an array of hotels returned from a search. */
  this.hotels = new Array();


  /**
   * This is the index into the hotels array of the hotel that is currently
   * being viewed, i.e., that has info showing and that has a map showing.
   */
  this.currentlyDisplayedIndex = -1;


  /**
   * This is a flag that indicates whether search results are currently
   * showing or not.
   */
  this.searchResultsShowing = false;


  /**
   * This is a flag that indicates whether a map is currently showing or not.
   */
  this.mapShowing = false;


} // End ApplicationState.
