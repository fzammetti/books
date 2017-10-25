/*
    Local Business Search - From the book 
    "Practical webOS Projects With the Palm Pre"
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
function WelcomeAssistant() { };


/**
 * Reference to the method bound to this assistant for orientation change
 * event handling.
 */
WelcomeAssistant.prototype.orientationBind = null; 


/**
 * Set up the scene.
 */
WelcomeAssistant.prototype.setup = function() {

  // Set up application menu.
  this.controller.setupWidget(Mojo.Menu.appMenu, 
    localBusinessSearch.appMenuAttributes, localBusinessSearch.appMenuModel); 

  // Add event listeners to graphical "buttons".
  Mojo.Event.listen($("btnSearch"), Mojo.Event.tap,
    function() {
	  // Cross-fade to the scene.
	  Mojo.Controller.stageController.pushScene({
	    name : "search", transition : Mojo.Transition.crossFade
	  });
    }
  ); 
  Mojo.Event.listen($("btnFavorites"), Mojo.Event.tap, 
    function() {
	  // Cross-fade to the scene.
	  Mojo.Controller.stageController.pushScene({
	    name : "favorites", transition : Mojo.Transition.crossFade
	  });   
  	}
  ); 

}; // End WelcomeAssistant.prototype.setup().


/**
 * Called when the scene is activated.
 */
WelcomeAssistant.prototype.activate = function() {

  // Listen for orientation changes.
  this.orientationBind = this.handleOrientation.bind(this); 
  Mojo.Event.listen(document, "orientationchange",
    this.orientationBind
  );
  
}; // End WelcomeAssistant.prototype.activate().


/**
 * Called when the scene is deactivated.
 */
WelcomeAssistant.prototype.deactivate = function() {

  // Stop listening for orientation changes.
  Mojo.Event.stopListening(document, "orientationchange",
    this.orientationBind
  );

}; // End WelcomeAssistant.prototype.deactivate().


/**
 * Handle the orientation change event.
 *
 * @param inEvent Event object with details about the event.
 */
WelcomeAssistant.prototype.handleOrientation = function(inEvent) {

  // Only do something if the orientation has changed (ignoring position
  // values of zero or one).
  if (inEvent.position > 1 &&
    inEvent.position != localBusinessSearch.lastOrientation) {
    
    // Record this orientation.
    localBusinessSearch.lastOrientation = inEvent.position;

    // Get references to our two graphical "buttons".
    var btnSearch = $("btnSearch");
    var btnFavorites = $("btnFavorites");
    
    // Based on the new orientation, size the graphics appropriately so they
    // fit on the screen either way.
    switch (inEvent.position) {
      // Portrait.
      case 2: case 3:
        btnSearch.setAttribute("width", "128");
        btnSearch.setAttribute("height", "128");
        btnFavorites.setAttribute("width", "128");
        btnFavorites.setAttribute("height", "128");
      break;
      // Landscape.
      case 4: case 5:
        btnSearch.setAttribute("width", "64");
        btnSearch.setAttribute("height", "64");
        btnFavorites.setAttribute("width", "64");
        btnFavorites.setAttribute("height", "64");
      break;    
    }
    
  }

}; // End WelcomeAssistant.prototype.handleOrientation().

