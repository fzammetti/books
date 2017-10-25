/*
    Engineer - From the book "Practical webOS Projects With the Palm Pre"
    Copyright (C) 2009 Frank W. Zammetti
    fzammetti@etherient.com

    Licensed under the terms of the MIT license as follows:

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to 
    deal in the Software without restriction, including without limitation the 
    rights to use, copy, modify, merge, publish, distribute, sublicense, and/or 
    sell copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
    
    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
    FROM,OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS 
    IN THE SOFTWARE.
*/


/**
 * The scene's assistant class.
 */
function GameOverAssistant(inAssistant) {
 
  // When this class is constructed from the gameScreen it is passed a reference
  // to the assistant for the gameScreen, which we'll need so store it now.
  this.assistant = inAssistant;
   
};


/**
 * Set up the scene.
 */
GameOverAssistant.prototype.setup = function() {

  // Set up the New Game Button.
  this.assistant.controller.setupWidget("btnNewGame", { },
    { label : "Start A New Game", buttonClass : "palm-button affirmative" }
  );  
  Mojo.Event.listen(this.assistant.controller.get("btnNewGame"), 
    Mojo.Event.tap, this.newGame.bind(this)
  ); 

  // Set up the Exit Button.
  this.assistant.controller.setupWidget("btnExit", { },
    { label : "Exit Application", buttonClass : "palm-button negative" }
  );  
  Mojo.Event.listen(this.assistant.controller.get("btnExit"), 
    Mojo.Event.tap, this.exit.bind(this)
  ); 
    
}; // End GameOverAssistant.prototype.setup().


/**
 * Activate the scene.
 */
GameOverAssistant.prototype.activate = function() {

  // Show the final score and determine if it's the new high score.  If so,
  // show the normally hidden div on the scene and record the new high score.
  $("spanFinalScore").innerHTML = this.assistant.score;
  if (this.assistant.score > 0) {
    var highScoreCookie = new Mojo.Model.Cookie("Engineer_highScore");
    var highScore = highScoreCookie.get();
    if (!highScore || this.assistant.score > highScore) {
      highScoreCookie.put(this.assistant.score);
      $("divNewHighScore").show();
    }
  }    
  
}; // End GameOverAssistant.prototype.activate().
    
    
/** 
 * Called when the New Game button is clicked.
 */    
GameOverAssistant.prototype.newGame = function() {

  // Call the startGame() method on the gameScreen's assistant to reset
  // everything.
  this.assistant.startGame();
  
  // Close this dialog and the player is playing again.
  this.assistant.gameOverDialog.mojo.close();

}; // End GameOverAssistant.prototype.newGame().


/**
 * Called when the Exit Button is clicked.
 */
GameOverAssistant.prototype.exit = function() {

  // Remember, this is still a webapp, so we can close it just like any other
  // webapp!
  window.close();

}; // End GameOverAssistant.prototype.exit().    
