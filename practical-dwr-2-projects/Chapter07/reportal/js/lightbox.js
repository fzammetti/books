/**
 * Call this function to show a popup using the lightbox effect.
 *
 * @param inPopupID      The DOM ID of the div element that is the popup.
 * @param inPopupVisible True to show the popup, false to hide it.
 */
function lightboxPopup(inPopupID, inPopupVisible) {

  // When true, popup is being shown...
  if (inPopupVisible) {

    // Get reference to popup to avoid multiple DOM lookups.
    var popupDiv = document.getElementById(inPopupID);

    // Show the blocker div.
    document.getElementById("divLightboxBlocker").style.display = "block";

    // Hide scrollbars.  Need to record scrollTop because Firefox insists
    // on resetting it to zero when you set overflow to "hidden", so we
    // immediately set it to what it was, so to the user, it looks like
    // no scrolling happened.
    var st = document.body.scrollTop;
    document.body.style.overflow = "hidden";
    document.body.scrollTop = st;

    // Center the popup.  First, some variables we'll need along the way.
    var lca = null;
    var lcb = null;
    var lcx = null;
    var lcy = null;
    var iebody = null;
    var dsoctop = null;

    // Popup needs to be shown before it can be properly centered.
    popupDiv.style.display = "block";

    // We will control the vertical...
    if (window.innerHeight) {
      lca = window.innerHeight;
    } else {
      lca = document.body.clientHeight;
    }
    lcb = popupDiv.offsetHeight;
    lcy = (Math.round(lca / 2)) - (Math.round(lcb / 2));
    iebody = (document.compatMode &&
      document.compatMode != "BackCompat") ?
      document.documentElement : document.body;
    dsoctop = document.all ? iebody.scrollTop : window.pageYOffset;
    popupDiv.style.top = ((lcy + dsoctop) - 50) + "px";

    // We will control the horizontal...
    if (window.innerWidth) {
      lca = window.innerWidth;
    } else {
      lca = document.body.clientWidth;
    }
    lcb = popupDiv.offsetWidth;
    lcx = (Math.round(lca / 2)) - (Math.round(lcb / 2));
    iebody = (document.compatMode &&
      document.compatMode != "BackCompat") ?
      document.documentElement : document.body;
    dsocleft = document.all ? iebody.scrollLeft : window.pageXOffset;
    popupDiv.style.left = lcx + dsocleft + "px";

    // Show and position shadows divs too.
    for (var i = 0; i < 6; i++) {
      document.getElementById(inPopupID + "_Shadow" + i).style.display =
        "block";
    }
    var xyAdjust = 12;
    for (var i = 5; i >= 0; i--) {
      document.getElementById(inPopupID + "_Shadow" + i).style.left =
        lcx + xyAdjust + dsocleft + "px";
      document.getElementById(inPopupID + "_Shadow" + i).style.top =
        (((lcy + dsoctop) - 50) + xyAdjust) + "px";
      xyAdjust -= 2;
    }

  // When false, lightbox is being hidden...
  } else {

    // Hide popup and blocker div and reset body scrolling.
    document.getElementById(inPopupID).style.display = "none";
    document.getElementById("divLightboxBlocker").style.display = "none";
    document.body.style.overflow = "";

    // Hide shadow divs.
    for (var i = 0; i < 6; i++) {
      document.getElementById(inPopupID + "_Shadow" + i).style.display = "none";
    }

  }

} // End lightboxPopup().
