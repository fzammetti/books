/**
 * Called to show the secondary view with some specified markup.
 */
function showSecondaryView(inMarkup, inWhichView) {

  if (inMarkup != null) {
    inWhichView.innerHTML = inMarkup;
  }

  var dvMap = document.getElementById("divMap");
  dvMap.style.display = "none";
  inWhichView.style.display = "block";
  gameState.currentView = inWhichView;

} // End showSecondaryView().


/**
 * Called to show the map view again.
 */
function showMapView() {

  var dvMap = document.getElementById("divMap");
  gameState.currentView.style.display = "none";
  dvMap.style.display = "block";
  gameState.currentView = Globals.VIEW_MAP;

} // End showMapView().


/**
 * Show the help view.
 */
function showHelp() {

  if (xhr.request == null) {

    sendAJAX(showHelp, "help.htm", "", null);

  } else {

    showSecondaryView(xhr.request.responseText, Globals.VIEW_HELP);
    return true;

  } // End xhr.request == null if.

} // End showHelp().


/**
 * Show one of the game end screens (died or won).
 */
function showGameEnd(inWhichOutcome) {

  if (xhr.request == null) {

    if (inWhichOutcome == "won") {
      sendAJAX(showGameEnd, "won.htm", "", null);
    } else {
      sendAJAX(showGameEnd, "died.htm", "", null);
    }

  } else {

    showSecondaryView(xhr.request.responseText, Globals.VIEW_GAME_END);
    return true;

  } // End xhr.request == null if.

} // End showHelp().


/**
 * Display the player's current inventory.
 */
function displayInventory() {

  if (xhr.request == null) {

    sendAJAX(displayInventory, "displayInventory.command", "", null);

  } else {

    showSecondaryView(xhr.request.responseText, Globals.VIEW_INVENTORY);
    return true;

  } // End xhr.request == null if.

} // End displayInventory().
