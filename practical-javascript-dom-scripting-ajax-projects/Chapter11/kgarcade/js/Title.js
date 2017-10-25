function Title() {


  /**
   * ======================================================================
   * Game initialization.
   * ======================================================================
   */
  this.init = function() {

    document.getElementById("divTitle").style.display = "block";

  } // End init().


  /**
   * ======================================================================
   * Handle key up events.
   * ======================================================================
   */
  this.keyUpHandler = function(e) {

    gameState.currentGame.destroy();
    gameState.currentGame = null;
    gameState.currentGame = new GameSelection();
    gameState.currentGame.init();

  } // End keyUpHandler().


  /**
   * ======================================================================
   * Destroy resources.
   * ======================================================================
   */
  this.destroy = function() {

    document.getElementById("divTitle").style.display = "none";

  } // End destroy().


} // End Title class.


// Title class "inherits" from MiniGame class (even though, strictly speaking,
// it isn't a mini-game).
Title.prototype = new MiniGame;
