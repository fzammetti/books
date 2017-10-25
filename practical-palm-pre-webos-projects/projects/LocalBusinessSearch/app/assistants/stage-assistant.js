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
 * The stage's assistant class.
 */
function StageAssistant() { };


/**
 * Set up the stage.
 */
StageAssistant.prototype.setup = function() {

  // Allow rotation of the stage.
  if (this.controller.setWindowOrientation) {
    this.controller.setWindowOrientation("free");
  }

  // Push the first scene.
  this.controller.pushScene("welcome"); 
  
}; // End StageAssistant.prototype.setup(). 


// Handle application menu commands.  Note: this can be done for a given scene
// as well, but in that case don't forget to do Mojo.Event.stopPropogation() so
// this stage-level version won't fire after the scene's handler.
StageAssistant.prototype.handleCommand = function(inEvent) {

  switch (inEvent.type) {

    // Enable Preferences option.
    case Mojo.Event.commandEnable:
      switch (inEvent.command) {
        case Mojo.Menu.prefsCmd:
          if (localBusinessSearch.depot) {
            inEvent.stopPropagation();
          }
        break;
      }
    break;
    
    case Mojo.Event.command:
      switch (inEvent.command) {
        case "about-TAP":
          this.controller.activeScene().showAlertDialog({
            onChoose : function(inValue) {},
            title : "Local Business Search v1.0",
            message : "From the book " +
              "'Practical webOS Projects With the Palm Pre' " +
              "(Apress, 2009, ISBN-13: 978-1-4302-2674-1). " +
              "Copyright 2009 Frank W. Zammetti. All rights reserved. " +
              "A product of Etherient: http://www.etherient.com",
            choices : [
              { label : "Ok", value : "" }
            ]
          });      
        break;
        case Mojo.Menu.prefsCmd:     
          // Show preferences scene.
          this.controller.pushScene("preferences");
        break;      
      }
    break;
    
  }
  
}; // StageAssistant.prototype.handleCommand().
