/**
 * This function begins talking to a character.
 */
function startTalking() {

  // Put the appropriate character image up.
  var charImage = document.getElementById("imgCharacter");

  switch (xhr.json.ct) {

    case Globals.CHARACTER_GUARD:
      charImage.src = Globals.imgCHARACTER_GUARD_TALKING.src;
    break;
    case Globals.CHARACTER_MONK:
      charImage.src = Globals.imgCHARACTER_MONK_TALKING.src;
    break;
    case Globals.CHARACTER_PEASANT:
      charImage.src = Globals.imgCHARACTER_PEASANT_TALKING.src;
    break;
    case Globals.CHARACTER_THIEF:
      charImage.src = Globals.imgCHARACTER_THIEF_TALKING.src;
    break;

  }

  showSecondaryView(null, Globals.VIEW_TALKING);
  updateActivityScroll(xhr.json.cr);
  showNodeReplies();

} // End startTalking().


/**
 * This function is called to show an updated talk node during a conversation.
 */
function showNodeReplies() {

  var htmlOut = "";
  htmlOut += "1: " + xhr.json.r1 + "<br>";
  htmlOut += "2: " + xhr.json.r2 + "<br>";
  htmlOut += "3: " + xhr.json.r3 + "<br>";
  htmlOut += "E: End conversaton";
  document.getElementById("divTalkingReplies").innerHTML = htmlOut;

} // End showNodeReplies().


/**
 * This function stops talking to a character.
 */
function stopTalking() {

  if (xhr.request == null) {

    sendAJAX(stopTalking, "endConversation.command", "", null);

  } else {

    document.getElementById("imgCharacter").src = Globals.imgTransparent.src;
    updateMap();
    showMapView();
    return true;

  } // End xhr.request == null if.

} // End startTalking().


/**
 * This function is called when the player choose a reply during a
 * conversation.
 */
function talkReply(inWhichReply) {

  if (xhr.request == null) {

    sendAJAX(talkReply, "talkReply.command", "?reply=" + inWhichReply, null);

  } else {

    if (xhr.json.mo == Globals.MODE_NORMAL) {
      updateMap();
      document.getElementById("imgCharacter").src =
        Globals.imgTransparent.src;
      showMapView();
    } else {
      showNodeReplies();
    }
    return true;

  } // End xhr.request == null if.

} // End talkReply().
