// The following are constants for various keys that we check for throughout
// the following code.
KEY_RETURN = 13;
KEY_UP = 38;
KEY_DOWN = 40;
KEY_LEFT = 37;
KEY_RIGHT = 39;
KEY_SHIFT = 16;
KEY_CONTROL = 17;
KEY_ALT = 18;
KEY_ESC = 27;
KEY_INSERT = 45;
KEY_HOME = 36;
KEY_END = 35;
KEY_PAGEUP = 33;
KEY_PAGEDOWN = 34;
KEY_SCROLLLOCK = 145;
KEY_PAUSE = 19;
KEY_DELETE = 46;
KEY_PRINTSCREEN = 118;
KEY_NUMLOCK = 144;
KEY_CAPSLOCK = 20;
KEY_LEFT_WINDOWS = 91;
KEY_RIGHT_WINDOWS = 92;
KEY_CONTEXT = 93;
// The keycode that was pressed.
keyCodePressed = null;
// Attach a keyDown event handler to the document.  Note the slight difference
// between IE (which only needs the part outside the if block, and other
// browsers which also need the captureEvents portion).
document.onkeydown = keyDown;
if ((document.layers) ? true : false) {
  document.captureEvents(Event.KEYDOWN);
}
// The number of the suggestion that was highlighted before the latest
// arrow key was pressed.
previousSuggestion = 0;
// The suggestion that is currently hightlighted.
currentSuggestion = 0;
// The number of suggestions currently displayed.
numSuggestions = 0;

// This is a custom AjaxTags request handler.  It constructs a query string
// and also deals with hiding and showing the suggestions div as appropriate.
function CustomQueryString(form, target, param, resHandler,
  resHandlerParam, method, mungedRef, timerObj) {
  // Get a reference to our input textbox.  The param names the
  // element that is the user entry textbox, but it does it directly, i.e.,
  // not as a DOM ID, so we need to eval() it to get a reference to it.
  textbox = eval(param);
  // Get a reference to our suggestions div.
  suggestionsDiv = document.getElementById("suggestions");
  // If the value in the textbox is blank, just hide the suggestions div.
  if (textbox.value == "") {
    previousSuggestion = 0;
    currentSuggestion = 0;
    keyCodePressed = null;
    document.getElementById("suggestions").style.visibility = "hidden";
    return;
  }
  // There must be some actual text...
  // If return is pressed, populate the textbox, hide the suggestions div
  // and we're done.
  if (keyCodePressed == KEY_RETURN) {
    if (suggestionsDiv.style.visibility == "hidden") {
      alert(textbox.value);
      return;
    } else {
      if (currentSuggestion > 0) {
        textbox.value = document.getElementById("suggestion" +
          currentSuggestion).innerHTML;
        suggestionsDiv.style.visibility = "hidden";
        return false;
      }
    }
  }
  // If the up (KEY_UP=38) or down (KEY_DOWN=40) arrows are pressed...
  if (keyCodePressed == KEY_UP || keyCodePressed == KEY_DOWN) {
    // Reset the previous selection, if any, to the unhighlighted state.
    if (previousSuggestion > 0) {
      document.getElementById("suggestion" +
        previousSuggestion).style.backgroundColor = "#f0f0f0";
    }
    // Up arrow...
    if (keyCodePressed == KEY_UP) {
      currentSuggestion--;
      if (currentSuggestion < 1) {
        currentSuggestion = 1;
      }
    }
    // Down arrow...
    if (keyCodePressed == KEY_DOWN) {
      currentSuggestion++;
      if (currentSuggestion > numSuggestions) {
        currentSuggestion = numSuggestions;
      }
    }
    // Record this as the previousSuggestion so we can reset it next time.
    previousSuggestion = currentSuggestion;
    // Highlight the new suggestion.
    document.getElementById("suggestion" +
      currentSuggestion).style.backgroundColor = "#ff0000";
    return false;;
  }
    // If we're here, it means none of our special keys (return, up and down
    // arrows) were pressed, so here we are going to fire an AJAX request.
    // Before we do that though, we need to reject a few other keys that would
    // cause an unnecessary AJAX call, and there's just no need for that!
    if (keyCodePressed != KEY_SHIFT && keyCodePressed != KEY_CONTROL &&
      keyCodePressed != KEY_ALT && keyCodePressed != KEY_ESC &&
      keyCodePressed != KEY_INSERT && keyCodePressed != KEY_HOME &&
      keyCodePressed != KEY_END && keyCodePressed != KEY_PAGEUP &&
      keyCodePressed != KEY_PAGEDOWN && keyCodePressed != KEY_SCROLLLOCK &&
      keyCodePressed != KEY_PAUSE && keyCodePressed != KEY_DELETE &&
      keyCodePressed != KEY_PRINTSCREEN && keyCodePressed != KEY_NUMLOCK &&
      keyCodePressed != KEY_CAPSLOCK && keyCodePressed != KEY_LEFT_WINDOWS &&
      keyCodePressed != KEY_LEFT && keyCodePressed != KEY_RIGHT &&
      keyCodePressed != KEY_RIGHT_WINDOWS && keyCodePressed != KEY_CONTEXT) {
      queryString = "?enteredText=" + escape(textbox.value);
      ajaxRequestSender(form, target, queryString, null, resHandler,
        resHandlerParam, method, true, mungedRef, timerObj);
    }
}

// This is the keyDown handler for the document.  It records the keycode that
// was pressed, which will be used in the AjaxTags request handler
// onKeyDown events to deal with highlighting suggestions.
function keyDown(e) {
  ev = (e) ? e : (window.event) ? window.event : null;
  if (ev) {
    keyCodePressed = (ev.charCode) ? ev.charCode:
      ((ev.keyCode) ? ev.keyCode : ((ev.which) ? ev.which : null));
  }
}
