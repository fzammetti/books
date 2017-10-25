/**
 * This function is called to send an AJAX request.  It accepts a reference to
 * the function that will serve as the callback, the URL to submit to,
 * a query string (beginning with the question mark) and the contents for the
 * POST body (or null if none)..  It then makes the request, using itself as the
 * callback.  It will do a GET if inPostData is null, POST if it isn't.  Once
 * the request returns, it calls the callback it was passed, then nulls the
 * xhr.request and xhr.callback variables so another AJAX request may now occur
 * IF the callback tells it to by returning true.  Most of the time, this will
 * be the case, but in a few instances, it will not.
 */
function sendAJAX(inCallback, inURL, inQueryString, inPostData) {

  // We only start a new AJAX request if there is none already processing.  It
  // may seem redundant that we are checking if xhr.request is null here as
  // well as any function that calls it, but it isn't... this function will be
  // its own callback, and when the response returns, it will call the
  // original function, which is in effect a callback too.  So both functions
  // need to be able to determine when there is a currently processing AJAX
  // request.
  if (xhr.request == null) {

    // Instantiate new XMLHttpRequest object.
    if (window.XMLHttpRequest) {
      xhr.request = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
      xhr.request = new ActiveXObject("Microsoft.XMLHTTP");
    }

    // Make AJAX call.
    xhr.callback = inCallback;
    xhr.request.onreadystatechange = sendAJAX;

    // Append the current date/time in milliseconds as a dummy query string
    // parameter to insure the browser (IE, I'm looking at you!) doesn't
    // serve a cached version of the response.
    if (inQueryString == "") {
      inQueryString = "?";
    } else {
      inQueryString += "&";
    }
    inQueryString += "insureUnique=" + new Date().getTime();
    // POST if inPostData is not null, GET otherwise.
    if (inPostData == null) {
      xhr.request.open("get", inURL + inQueryString, true);
    } else {
      xhr.request.open("post", inURL + inQueryString, true);
    }
    xhr.request.send(inPostData);

  } else {

    if (xhr.request.readyState == 4 && xhr.request.status == 200) {

      // First, see if the player has died, or has won, and show tne
      // appropriate secondary view if they have.  Remember that what gets
      // returned here will *usually* be a JSON message, but not always
      // (showing inventory, help, etc.).  So, we check the first character of
      // the response.  If it's an opening brace, then we assume this is a
      // JSON response, and only then do we check these situations.
      if (xhr.request.responseText.charAt(0) == '{') {

        eval("xhr.json = (" + xhr.request.responseText + ")");

        // If an exception occured, pop an alert and we're done.
        if (xhr.json.ex) {

          alert(xhr.json.mg);
          xhr.clearXHRVars();
          return;

        // If the player dies, the first thing we need to do is
        // "abort" the current AJAX request, which really just means we won't
        // be calling the callback.  so, we reset the three variables a we
        // would after calling the callback, and then immediately call the
        // function that will make an AJAX request for the appropriate page,
        // and then return from this function early.
        } else if (xhr.json.di == "true") {

          // Make sure we see 0 health, otherwise it'll be wrong to see 1 when
          // the player is dead, which is what would happen if we didn't
          // update the player info once last time.
          updatePlayerInfo(xhr.json.pn, xhr.json.ht, xhr.json.hp,
            xhr.json.gp);
          updateActivityScroll(xhr.json.mg);
          xhr.clearXHRVars();
          showGameEnd("died");
          return;

        // Game won!  Same basic concept as winning above.
        } else if (xhr.json.wn == "true") {

          xhr.clearXHRVars();
          showGameEnd("won");
          return;

        // Start talking to character.
        } else if (xhr.json.ct) {

          startTalking();
          xhr.clearXHRVars();
          return;

        // Switch to battle mode.
        } else if (xhr.json.mo == Globals.MODE_BATTLE &&
          gameState.currentView != Globals.VIEW_BATTLE) {

          gameState.battleEnemyTurn = false;
          gameState.currentView = Globals.VIEW_BATTLE;
          updateMap();
          xhr.clearXHRVars();
          return;

        // See if we're coming out of battle and switch to map view if so.
        // Then update the map and we're done.
        } else if (xhr.json.mo == Globals.MODE_NORMAL &&
          gameState.currentView == Globals.VIEW_BATTLE) {

          gameState.currentView = Globals.VIEW_MAP;
          updateMap();
          xhr.clearXHRVars();
          return;

        }

      } // End JSON response check.

      // Now call the callback function we recorded when initiating the
      // request.
      var clearVars = xhr.callback();

      // Finally, clear our variables associated with AJAX requests, if the
      // callback instructed us to (it wouldn't if it made another AJAX call).
      if (clearVars) {
        xhr.clearXHRVars();
      }

    } // End result status check.

  } // End XMLHttpRequest null check.

} // End sendAJAX().
