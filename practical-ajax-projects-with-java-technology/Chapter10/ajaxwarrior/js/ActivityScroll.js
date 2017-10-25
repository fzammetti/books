/**
 * This function is called to update the scroll area on the right.
 * It is passed a message, which is added to the array, and then the
 * array is displayed.  If the argument is null, the scroll is simply
 * updated, no shifting or adding of elements is performed.  Note that
 * the array is initially filled with 11 blanks.  So, when we update the
 * <div>, we only display elements that are non-blank.  Each time a
 * message is added, one blank element is removed (as the array shifts,
 * the element at position 0 is dropped, and the message is added to the
 * end).  So, after 11 messages have been appended, there will no longer
 * be any blank elements.
 */
function updateActivityScroll(inMessage) {

  if (inMessage != null) {
    // First thing we need to do is shift the array "up", that is, move
    // all elements towards the first element (and drop the first
    // element).
    gameState.activityScroll.shift();
    // Now, append the message to the end.
    gameState.activityScroll.push(inMessage);
  }

  // Now, construct a string from the array, ignoring null elements.
  var i;
  var s = "";
  for (i = 0; i < 11; i++) {
    if (gameState.activityScroll[i] == "") {
      s += "<br/>";
    } else {
      s += "> " + gameState.activityScroll[i] + "<br/>";
    }
  }

  // Finally, update the <div> with the string and scroll it to the bottom.
  var das = document.getElementById("divActivityScroll");
  das.innerHTML = s;
  das.scrollTop = 1000000;

} // End updateScroll().
