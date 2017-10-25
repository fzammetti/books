// This flag will be set to true when the server is called upon to do
// some processing.  This will be used to lock out some functions during
// that period.
var processing = false;

// The left and top coordinates of the upper-left corner of
// the landing pad area.
var landingPadLeft = 116;
var landingPadTop = 10;

// This is a reference to the currently active Collection object.
var currentCollection = null;

// This is a reference to the currently displayed photo.
var currentPhoto = null;

// The index into the image array of the current image.
var currentArrayIndex = null;

// This is the amount the current photo is rotated in degrees.
var rotationAmount = null;

// ***** Variables used to grow an image. *****
var growTimer = null; // Timer used to grow an image.
var growIndex = null; // Index into growCoordinates when growing an image.
var growCoordinates = null; // The array of coordinates that represent a
                        // straight line path from the starting location
                        // of a thumbnail to the fully expanded version.
var growWidthStep = null; // How much a thumbnail grows horizontally along
                      // the path to full.
var growHeightStep = null; // How much a thumbnail grows vertically along the
                       //path to full.
var growWidth = null; // The current width of the growing image.
var growHeight = null; // The current height of the growing image.
var growWidthFinal = null; // The target width of the growing image.
var growWidthHeight = null; // The target height of the growing image.

// ***** Variable used to scroll the filmstrip. *****
var scrollTimer = null; // Timer used for scrolling the filmstrip.
var y_offset = null; // How far the filmstrip is scrolled up or down.

// "The Pixel of Destiny" (Google for it, you'll love it!)
var img_film_placeholder = new Image();
img_film_placeholder.src = "img/film_placeholder.gif";

// Images for up button rollover.
var img_up_button_0 = new Image();
img_up_button_0.src = "img/up_button_0.gif";
var img_up_button_1 = new Image();
img_up_button_1.src = "img/up_button_1.gif";

// Images for down button rollover.
var img_down_button_0 = new Image();
img_down_button_0.src = "img/down_button_0.gif";
var img_down_button_1 = new Image();
img_down_button_1.src = "img/down_button_1.gif";
