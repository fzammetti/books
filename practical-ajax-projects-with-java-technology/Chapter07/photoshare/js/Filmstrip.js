// This is the mouseOver event handler for the filmstrip up/down buttons.
function buttonOver(whatButton) {
  // Don't do anything if a server process is happening, or no collection is
  // yet selected.
  if (processing || currentCollection == null) { return false; }
  // Depending on which button is being hovered over, set the hover state of
  // it, and start the appropriate timer.
  if (whatButton.id == "up_button") {
    scrollTimer = window.setTimeout(scrollUp, 0);
    whatButton.src = img_up_button_1.src;
  } else {
    scrollTimer = window.setTimeout(scrollDown, 0);
    whatButton.src = img_down_button_1.src;
  }
}

// This is the mouseOut event handler for the filmstrip up/down buttons.
function buttonOut(whatButton) {
  // Don't do anything if a server process is happening, or no collection is
  // yet selected.
  if (processing || currentCollection == null) { return false; }
  // Stop the timer.
  window.clearTimeout(scrollTimer);
  // Reset button state to the default non-hover image.
  if (whatButton.id == "up_button") {
    whatButton.src = img_up_button_0.src;
  } else {
    whatButton.src = img_down_button_0.src;
  }
}

// This is called via timer to scroll the filmstrip down.
function scrollDown() {
  // Images on the filmstrip are 80x80.
  y_offset++;
  if (y_offset > 80) {
    y_offset = 0;
    // Time to shift the array.
    currentCollection.rotateArrayDown();
    updatePics();
  }
  // Update images on the filmstrip to their starting positions
  setPicLocations();
  // Continue scrolling.
  scrollTimer = window.setTimeout(scrollDown, 0);
}

// This is called via timer to scroll the filmstrip up.
function scrollUp() {
  // Images on the filmstrip are 80x80.
  y_offset--;
  if (y_offset < 0) {
    y_offset = 80;
    // Time to shift the array.
    currentCollection.rotateArrayUp();
    updatePics();
  }
  // Update images on the filmstrip to their starting positions
  setPicLocations();
  // Continue scrolling.
  scrollTimer = window.setTimeout(scrollUp, 0);
}

// This sets the location of the placeholder tiles and thumbnails on the
// filmstrip.  This is called during scrolling.
function setPicLocations() {
  document.getElementById("filmTile0").style.top = 8 + y_offset;
  document.getElementById("filmTile1").style.top = 88 + y_offset;
  document.getElementById("filmTile2").style.top = 168 + y_offset;
  document.getElementById("filmTile3").style.top = 248 + y_offset;
  document.getElementById("filmTile4").style.top = 328 + y_offset;
  document.getElementById("pic0").style.top = 16 + y_offset;
  document.getElementById("pic1").style.top = 96 + y_offset;
  document.getElementById("pic2").style.top = 176 + y_offset;
  document.getElementById("pic3").style.top = 256 + y_offset;
  document.getElementById("pic4").style.top = 336 + y_offset;
}

// This function updates the images on the filmstrip according to the current
// state of the images array.  It is called during scrolling when the images
// need to flip positions.
function updatePics() {
  var j = 0;
  // cycle through all the placeholders on the filmstrip.  If there is a photo
  // on it, apply the appropriate image, otherwise just put a placeholder.
  for (var i = 4; i >= 0; i--) {
    var o = document.getElementById("pic" + i);
    var theImage = currentCollection.getPhoto(j);
    if (theImage) {
      o.src = theImage.getImage().src;
      o.arrayIndex = j;
    } else {
      o.src = img_film_placeholder.src;
    }
    j++;
  }
}

// This is called when an image on the filmstrip is clicked.
function imgClick(imgNumber) {
  if (processing) { return false; }
  // Get reference to the image to grow.  Must remove "px" from end.
  var o = document.getElementById("pic" + imgNumber);
  // We only want to grow filmstrip tiles that have photos on them, and we can
  // determine this by seeing if the arrayIndex attribute is null or not.
  if (o.arrayIndex == null) { return false; }
  // Reset landing pad and shadow to default sizes.
  resetLandingPad();
  setShadowDefaultSize();
  // Get its X and Y coordinates.
  var x1s = o.style.left;
  var x1 = parseInt(x1s.substring(0, x1s.length - 2));
  var y1s = o.style.top;
  var y1 = parseInt(y1s.substring(0, y1s.length - 2));
  // Calculate the straight line path to the expanded location.
  growCoordinates = calcLine(x1, y1, landingPadLeft, landingPadTop);
  // Reset index counter so we start at the beginning of the
  // growCoordinates array.
  growIndex = 0;
  // Calculate the width and height growth steps based on the real
  // size of the image, remembering to take into account its current
  // thumbnail size.
  var finalWidth = 640 - 64;
  var finalHeight = 480 - 64;
  growWidthStep = finalWidth / growCoordinates.length;
  growHeightStep = finalHeight / growCoordinates.length;
  growWidth = 64;
  growHeight = 64;
  // Set the growing image to the image to grow, set its initial
  // location and size and show it.
  var o1 = document.getElementById("imgGrowing");
  o1.src = o.src;
  o1.width = growWidth;
  o1.height = growHeight;
  o1.style.left = growCoordinates[0][0];
  o1.style.top = growCoordinates[0][1];
  o1.style.display = "block";
  // Start the growth timer.
  growTimer = window.setTimeout(growImage, 0);
  // Update some values and get a reference to the photo object.
  currentArrayIndex = o.arrayIndex;
  var imgInfo = currentCollection.getPhoto(currentArrayIndex);
  currentPhoto = imgInfo;
  rotationAmount = 0;
  // Populate image info.
  var iDoc = parent.fraInfo.document;
  iDoc.getElementById("addedBy").innerHTML = imgInfo.getAddedBy();
  iDoc.getElementById("addedOn").innerHTML = imgInfo.getAddedOn();
  iDoc.getElementById("type").innerHTML = imgInfo.getType();
  iDoc.getElementById("fileSize").innerHTML = imgInfo.getFileSize();
  iDoc.getElementById("dimensions").innerHTML = imgInfo.getDimensions();
  iDoc.getElementById("dpi").innerHTML = imgInfo.getDpi();
  iDoc.getElementById("colorDepth").innerHTML = imgInfo.getColorDepth();
  iDoc.getElementById("description").innerHTML = imgInfo.getDescription();
}
