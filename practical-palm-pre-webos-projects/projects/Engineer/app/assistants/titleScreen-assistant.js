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
function TitleScreenAssistant() { };  


/**
 * The current top position of the scrolling instructions.
 */
TitleScreenAssistant.prototype.instructionsTop = 210;


/**
 * The interval for scrolling the instructions.
 */
TitleScreenAssistant.prototype.insInterval = null;


/**
 * Set up the scene.
 */
TitleScreenAssistant.prototype.setup = function() {

  // Listen for when the stage is activated.  This happens when the app is
  // brought back into focus after being minimized.
  Mojo.Event.listen(this.controller.stageController.document, 
    Mojo.Event.stageActivate, 
    function() {
      this.insInterval = setInterval(this.scrollInstructions.bind(this), 50);
    }.bind(this)
  );

  // Listen for when the stage is deactivated.  This happens when the app is
  // minimized (card-ified)
  Mojo.Event.listen(this.controller.stageController.document, 
    Mojo.Event.stageDeactivate, 
    function() {
      clearInterval(this.insInterval);
    }.bind(this)
  );

};  // End TitleScreenAssistant.prototype.setup().


/**
 * Activate the scene.
 */
TitleScreenAssistant.prototype.activate = function() {

  // Get the current high score and display it.
  var highScoreCookie = new Mojo.Model.Cookie("Engineer_highScore");
  var highScore = highScoreCookie.get();
  if (!highScore) {
    highScore = "None yet!";
  }   
  $("divHighScore").innerHTML = 
    "<center>High Score: " + highScore + "</center>";

  // Start scrolling the instructions.
  this.insInterval = setInterval(this.scrollInstructions.bind(this), 50);

  // Listen for taps on the instructions area.
  Mojo.Event.listen($("divHowToPlay"), Mojo.Event.tap, 
    function() {
      // When a tap is heard, swap out this scene for the game screen.  Note
      // the use of swapScene() here, which removes this scenes from the
      // stack, so the user can't come back to the title screen directly.
      Mojo.Controller.stageController.swapScene("gameScreen");
    }, true
  );
    
}; // End TitleScreenAssistant.prototype.activate().
    

/**
 * Called with each iteration of the instructionsInterval to scroll the
 * instructions up.
 */    
TitleScreenAssistant.prototype.scrollInstructions = function() {

  this.instructionsTop = this.instructionsTop - 1;
  if (this.instructionsTop < -560) {
    this.instructionsTop = 210;
  }
  $("instructions").style.top = this.instructionsTop + "px";
    
}; // End TitleScreenAssistant.prototype.scrollInstructions().
