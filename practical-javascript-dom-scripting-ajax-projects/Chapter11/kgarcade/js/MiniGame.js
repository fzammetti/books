function MiniGame() {


  // The name of a mini-game.  Must match the directory its resources are in.
  this.gameName = null;

  // The array of images a mini-game uses.
  this.gameImages = new Array();

  // True if a mini-game has full control over key events, false if the main
  // code sets the player direction variables.
  this.fullKeyControl = false;


  /**
   * ======================================================================
   * Game initialization.
   * ======================================================================
   */
  this.init = function() {
  } // End init().


  /**
   * ======================================================================
   *  Frame processor.
   * ======================================================================
   */
  this.processFrame = function() {
  } // End processFrame().


  /**
   * ======================================================================
   * Handle key down events.  For this game, there isn't anything to do,
   * the default behavoir covers it, but we still need to fulfill the
   * interface contract, so it has to be here.
   * ======================================================================
   */
  this.keyDownHandler = function(inKeyCode) {
  } // End keyDownHandler().


  /**
   * ======================================================================
   * Handle key up events.  For this game, there isn't anything to do,
   * the default behavoir covers it, but we still need to fulfill the
   * interface contract, so it has to be here.
   * ======================================================================
   */
  this.keyUpHandler = function(inKeyCode) {
  } // End keyUpHandler().


  /**
   * ======================================================================
   * Destroy resources.
   * ======================================================================
   */
  this.destroy = function() {
  } // End destroy().


} // End class.
