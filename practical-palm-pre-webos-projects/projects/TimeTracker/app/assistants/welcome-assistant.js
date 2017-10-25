/*
    Time Tracker - From the book "Practical webOS Projects With the Palm Pre"
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
 * The models for the Buttons.  Needed so we can enable/disable the button 
 * as appropriate.
 */
WelcomeAssistant.prototype.buttonModels = {
  projectAdministration : {
    label : "Project Administration", disabled : true
  },
  resourceAdministration : {
    label : "Resource Administration", disabled : true
  },
  bookTime : { label : "Book Time", disabled : true },
  summaries : { label : "Summaries", disabled : true }    
}; 


/**
 * Set up the scene.
 */
WelcomeAssistant.prototype.setup = function() {

  // Switch OFF full-screen mode.
  this.controller.enableFullScreenMode(false);

  // Setup up model for and hook up event handler to the Project Administration 
  // Button.
  this.controller.setupWidget("welcome_btnProjectAdministration", { },
    this.buttonModels.projectAdministration
  );  
  Mojo.Event.listen(this.controller.get("welcome_btnProjectAdministration"), 
    Mojo.Event.tap, this.btnProjectAdministrationTap.bind(this)
  ); 

  // Setup up model for and hook up event handler to the Resource Administration 
  // Button.
  this.controller.setupWidget("welcome_btnResourceAdministration", { },
    this.buttonModels.resourceAdministration
  );  
  Mojo.Event.listen(this.controller.get("welcome_btnResourceAdministration"), 
    Mojo.Event.tap, this.btnResourceAdministrationTap.bind(this)
  ); 

  // Setup up model for and hook up event handler to the Book Time Button.
  this.controller.setupWidget("welcome_btnBookTime", { }, 
    this.buttonModels.bookTime
  );  
  Mojo.Event.listen(this.controller.get("welcome_btnBookTime"), 
    Mojo.Event.tap, this.btnBookTimeTap.bind(this)
  ); 

  // Setup up model for and hook up event handler to the Summaries Button.
  this.controller.setupWidget("welcome_btnSummaries", { }, 
    this.buttonModels.summaries
  );  
  Mojo.Event.listen(this.controller.get("welcome_btnSummaries"), 
    Mojo.Event.tap, this.btnSummariesTap.bind(this)
  ); 

}; // End WelcomeAssistant.prototype.setup().


/**
 * Called when the scene is activated.
 */
WelcomeAssistant.prototype.activate = function() {

  if (!timeTracker.user) {
    this.logInDialog = this.controller.showDialog({
      template : "logIn-dialog", assistant : new LogInAssistant(this),
      preventCancel : true
    });
  }

}; // End WelcomeAssistant.prototype.activate().


/**
 * Handle taps on the Project Administration Button.
 */
WelcomeAssistant.prototype.btnProjectAdministrationTap = function() {

  Mojo.Controller.stageController.pushScene("adminProject"); 

}; // End WelcomeAssistant.btnProjectAdministrationTap.btnAdministrationTap(). 


/**
 * Handle taps on the Resource Administration Button.
 */
WelcomeAssistant.prototype.btnResourceAdministrationTap = function() {

  Mojo.Controller.stageController.pushScene("adminResource");

}; // End WelcomeAssistant.btnResourceAdministrationTap.btnAdministrationTap().


/**
 * Handle taps on the Book Time Button.
 */
WelcomeAssistant.prototype.btnBookTimeTap = function() {

  Mojo.Controller.stageController.pushScene("bookTime");

}; // End WelcomeAssistant.prototype.btnBookTimeTap().


/**
 * Handle taps on the Summaries Button.
 */
WelcomeAssistant.prototype.btnSummariesTap = function() {

  Mojo.Controller.stageController.pushScene("summaries");

}; // End WelcomeAssistant.prototype.btnSummariesTap().
