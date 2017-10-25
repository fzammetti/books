// This is an implementation of Bresenham's line algorithm.  It is used to
// calculate all the points between a photo's starting position on the filmstrip
// to it's final resting place on the landing pad.
function calcLine(x1, y1, x2, y2) {
  var coordinates = new Array();
  var idx = 0;
  var deltax = Math.abs(x2 - x1);
  var deltay = Math.abs(y2 - y1);
  var x = x1;
  var y = y1;
  var xinc1 = 0;
  var xinc2 = 0;
  var yinc1 = 0;
  var yinc2 = 0;
  var den = 0;
  var num = 0;
  var numadd = 0;
  var numpixels = 0;
  var curpixel = 0;
  if (x2 >= x1) {
    xinc1 = 1;
    xinc2 = 1;
  } else {
    xinc1 = -1;
    xinc2 = -1
  }
  if (y2 >= y1) {
    yinc1 = 1;
    yinc2 = 1;
  } else {
    yinc1 = -1;
    yinc2 = -1;
  }
  if (deltax >= deltay) {
    xinc1 = 0;
    yinc2 = 0;
    den = deltax;
    num = deltax / 2;
    numadd = deltay;
    numpixels = deltax;
  } else {
    xinc2 = 0;
    yinc1 = 0;
    den = deltay;
    num = deltay / 2;
    numadd = deltax;
    numpixels = deltay;
  }
  var alt = false;
  for (var curpixel = 0; curpixel <= numpixels; curpixel++) {
    coordinates[idx] = new Array();
    coordinates[idx][0] = x;
    coordinates[idx][1] = y;
    // We only want every other pixel along the line, so that the growth doesn't
    // take too long.
    if (alt) {
      idx++;
      alt = false;
    } else {
      alt = true;
    }
    num += numadd;
    if (num >= den) {
      num -= den;
      x += xinc1;
      y += yinc1;
    }
    x += xinc2;
    y += yinc2;
  }
  return coordinates;
}

// This function is called via timer to "grow" an image and move it into place
// on the landing pad from the filmstrip.
function growImage() {
  var o = document.getElementById("imgGrowing");
  // If the growing image has not reached its final location yet...
  if (growIndex < growCoordinates.length) {
    // Set its location to the next coordinates in the path.
    o.style.left = growCoordinates[growIndex][0] + "px";
    o.style.top = growCoordinates[growIndex][1] + "px";
    // Expand it a little more.
    o.width = growWidth;
    o.height = growHeight;
    growWidth += growWidthStep;
    growHeight += growHeightStep;
    growIndex++;
    // Fire the timer again.
    growTimer = window.setTimeout(growImage, 0);
  } else {
    snapImageToLandingPad();
  }
}

// This immediately "snaps" a growing photo to the landing pad.  This is called
// any time a button is clicked, because the photo should be on the landing pad
// before we actually do anything with it.
function snapImageToLandingPad() {
  // Stop the timer, if applicable.  Would only be if the photo is actually
  // growing.
  if (growTimer != null) {
    window.clearTimeout(growTimer);
    growTimer = null;
  }
  // Set the position of the photo.
  var o = document.getElementById("imgGrowing");
  growTimer = null;
  o.style.left = landingPadLeft;
  o.style.top = landingPadTop;
  // Set its default size too.
  o.width = 640;
  o.height = 480;
  // Don't forget to update the landing pad and shadow too.
  o = document.getElementById("landingPad")
  o.style.width = "640px";
  o.style.height = "480px";
  setShadowDefaultSize();
}
