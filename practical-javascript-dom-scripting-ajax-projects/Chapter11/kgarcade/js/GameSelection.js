function GameSelection() {


  // What game screnshot is currently showing.
  this.showingGame = 1;
  this.numGames = 3;


  /**
   * ======================================================================
   * Game initialization.
   * ======================================================================
   */
  this.init = function() {

    gameState.currentMode = null;
    document.getElementById("divGameSelection").style.display = "block";

  } // End init().


  /**
   * ======================================================================
   *  Frame processor.
   * ======================================================================
   */
  this.processFrame = function() {

    document.getElementById("ssCosmicSquirrel").style.display = "none";
    document.getElementById("ssDeathtrap").style.display = "none";
    document.getElementById("ssRefluxive").style.display = "none";
    switch (this.showingGame) {
      case 1:
        document.getElementById("ssCosmicSquirrel").style.display = "block";
        document.getElementById("mgsDesc").innerHTML =
          "In space, no one can hear a giant space squirrel buy it";
      break;
      case 2:
        document.getElementById("ssDeathtrap").style.display = "block";
        document.getElementById("mgsDesc").innerHTML =
          "Hop on the tiles to escape the chasm without getting cooked";
      break;
      case 3:
        document.getElementById("ssRefluxive").style.display = "block";
        document.getElementById("mgsDesc").innerHTML =
          "Who knows what they are, but they have to be kept moving";
      break;
    }

  } // End processFrame().


  /**
   * ======================================================================
   * Handle key up events.
   * ======================================================================
   */
  this.keyUpHandler = function(e) {

    switch (e) {
      case KEY_LEFT:
        this.showingGame--;
        if (this.showingGame < 1) {
          this.showingGame = this.numGames;
        }
      break;
      case KEY_RIGHT:
        this.showingGame++;
        if (this.showingGame > this.numGames) {
          this.showingGame = 1;
        }
      break;
      case KEY_SPACE:
        gameState.currentGame.destroy();
        gameState.currentGame = null;
        switch (this.showingGame) {
          case 1:
            startMiniGame("cosmicSquirrel");
          break;
          case 2:
            startMiniGame("deathtrap");
          break;
          case 3:
            startMiniGame("refluxive");
          break;
        }
      break;
    }

  } // End keyUpHandler().



  /**
   * ======================================================================
   * Destroy resources.
   * ======================================================================
   */
  this.destroy = function() {

    document.getElementById("divGameSelection").style.display = "none";

  } // End destroy().


} // End GameSelection class.


// GameSelection class "inherits" from MiniGame class (even though, strictly
// speaking, it isn't a mini-game).
GameSelection.prototype = new MiniGame;