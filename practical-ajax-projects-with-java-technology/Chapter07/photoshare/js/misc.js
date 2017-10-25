// This function is called when PhotoShare first loads to perform various
// initializiation tasks.
function init() {
  // Use Dojo to attach events to our control buttons and dropdown.
  var evNode = null;
  evNode = parent.fraControl.document.getElementById("btnAddCollection");
  dojo.event.connect(evNode, "onclick", "addCollection");
  evNode =
    parent.fraControl.document.getElementById("btnDeleteCollection");
  dojo.event.connect(evNode, "onclick", "deleteCollection");
  evNode = parent.fraControl.document.getElementById("btnAddPhoto");
  dojo.event.connect(evNode, "onclick", "addPhoto");
  evNode = parent.fraControl.document.getElementById("btnDeletePhoto");
  dojo.event.connect(evNode, "onclick", "deletePhoto");
  evNode = parent.fraControl.document.getElementById("btnPrintPhoto");
  dojo.event.connect(evNode, "onclick", "printPhoto");
  evNode = parent.fraControl.document.getElementById("btnDownloadPhoto");
  dojo.event.connect(evNode, "onclick", "downloadPhoto");
  evNode = parent.fraControl.document.getElementById("btnRotatePhoto");
  dojo.event.connect(evNode, "onclick", "rotatePhoto");
  evNode = parent.fraControl.document.getElementById("btnActualSize");
  dojo.event.connect(evNode, "onclick", "setActualSize");
  evNode = parent.fraControl.document.getElementById("btnDefaultSize");
  dojo.event.connect(evNode, "onclick", "setDefaultSize");
  // Reset all globals to their initial states.
  resetVars();
  // Set the pictures on the filmstrip to their correct positions.
  setPicLocations();
  // Ask the server to get the list of collections and update the dropdown.
  updateCollectionsList();
}

// This is called to reset all variables to their initial states.  This
// happens at startup of course, and also when a collection is selected.
function resetVars() {
  // Kill grow timer, if running.
  if (growTimer != null) {
    window.clearTimeout(growTimer);
    growTimer = null;
  }
  // Kill scroll timer, if running.
  if (scrollTimer != null) {
    window.clearTimeout(scrollTimer);
    scrollTimer = null;
  }
  // Hide growing image, if showing.
  var o = document.getElementById("imgGrowing");
  o.style.display = "none";
  o.style.top = "0px";
  o.style.left = "0px";
  // Point the photos on the filmstrip away from the image array in the
  // collection and "blank" them out.
  document.getElementById("pic0").arrayIndex = null;
  document.getElementById("pic0").src = img_film_placeholder.src;
  document.getElementById("pic1").arrayIndex = null;
  document.getElementById("pic1").src = img_film_placeholder.src;
  document.getElementById("pic2").arrayIndex = null;
  document.getElementById("pic2").src = img_film_placeholder.src;
  document.getElementById("pic3").arrayIndex = null;
  document.getElementById("pic3").src = img_film_placeholder.src;
  document.getElementById("pic4").arrayIndex = null;
  document.getElementById("pic4").src = img_film_placeholder.src;
  // Reset all other variables appropriately.
  currentCollection = null;
  currentPhoto = null;
  growIndex = null;
  growCoordinates = null;
  growWidthStep = null;
  growHeightStep = null;
  growWidth = null;
  growHeight = null;
  growWidthFinal = null;
  growWidthHeight = null;
  y_offset = 0;
  rotationAmount = 0;
}

// This function is called to update the list of collections in the dropdown.
function updateCollectionsList() {
  // Don't do it if server is processing.
  if (processing) { return false; }
  // Snap photo to landing pad, if growing.
  snapImageToLandingPad();
  // Show Please Wait floatover.
  showPleaseWait()
  // Make AJAX call.
  dojo.io.bind({
    url: "listCollections.action",
    error: function(type, errObj) { alert("AJAX error!"); },
    load: function(type, data, evt) {
      parent.fraControl.document.getElementById(
        "spnCollectionsList").innerHTML = data;
      hidePleaseWait();
    },
    mimetype: "text/html",
    transport: "XMLHTTPTransport"
  });
}

// Rests the landing pad to its default size.
function resetLandingPad() {
  o = document.getElementById("landingPad")
  o.style.width = "640px";
  o.style.height = "480px";
}

// Resets the landing pad shadow layers to the proper size when showing a
// photo at actual size.
function setShadowActualSize() {
  for (var i = 1; i < 10; i++) {
    o = document.getElementById("shadow" + i)
    o.style.width = currentPhoto.getWidth();
    o.style.height = currentPhoto.getHeight();
  }
}

// Resets the landing pad shadow layers to the proper size when showing a
// photo at default size.
function setShadowDefaultSize() {
  for (var i = 1; i < 10; i++) {
    o = document.getElementById("shadow" + i)
    o.style.width = 640;
    o.style.height = 480;
  }
}
