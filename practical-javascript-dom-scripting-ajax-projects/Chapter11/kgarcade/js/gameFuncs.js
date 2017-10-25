/**
 * ======================================================================
 * Load an image used by a mini-game.
 * ======================================================================
 */
function loadGameImage(inName) {

  // Create an img object and set the relevant properties on it.
  var img = document.createElement("img");
  img.src = gameState.currentGame.gameName + "/img/" + inName + ".gif";
  img.style.position = "absolute";
  img.style.display = "none";

  // Add it to the array of images for the current game to avoid DOM access
  // later, and append it to the game area.
  gameState.currentGame.gameImages[inName] = img;
  document.getElementById("divGameArea").appendChild(img);

} // End loadGameImage().


/**
 * ======================================================================
 * Destroy an image used by a mini-game.
 * ======================================================================
 */
function destroyGameImage(inName) {

  // Remove it from the DOM.
  var gameArea = document.getElementById("divGameArea");
  gameArea.removeChild(gameState.currentGame.gameImages[inName]);

  // Set element in array in null to complete the destruction.
  gameState.currentGame.gameImages[inName] = null;

} // End destroyGameImage().


/**
 * ======================================================================
 * This is a simple bounding boxes collision detection algorithm.  It
 * won't provide pixel-perfect collision detection, nor is it even the
 * best bounding boxes implementation around, but it'll get the job done.
 * ======================================================================
 */
function detectCollision(inObj1, inObj2) {

  var left1 = inObj1.x;
  var left2 = inObj2.x;
  var right1 = left1 + inObj1.width;
  var right2 = left2 + inObj2.width;
  var top1 = inObj1.y;
  var top2 = inObj2.y;
  var bottom1 = top1 + inObj1.height;
  var bottom2 = top2 + inObj2.height;

  if (bottom1 < top2) {
    return false;
  }
  if (top1 > bottom2) {
    return false;
  }
  if (right1 < left2) {
    return false;
  }
  if (left1 > right2) {
    return false;
  }

  return true;

} // End detectCollision().


/**
 * ======================================================================
 * Add to score and update status area.
 * ======================================================================
 */
function addToScore(inPoints) {

  gameState.score += inPoints;
  document.getElementById("divStatusArea").innerHTML = "Score: " +
    gameState.score;

} // End addToScore().


/**
 * ======================================================================
 * Subtract from score and update status area.
 * ======================================================================
 */
function subtractFromScore(inPoints) {

  gameState.score -= inPoints;
  if (gameState.score < 0) {
    gameState.score = 0;
  }
  document.getElementById("divStatusArea").innerHTML = "Score: " +
    gameState.score;

} // End subtractFromScore().
