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
function LogInAssistant(inAssistant) {
 
  // When this class is constructed from the welcome scene it is passed a 
  // reference to the assistant for the gameScreen, which we'll need so store 
  // it now.
  this.assistant = inAssistant;
   
};


/**
 * The models for the widgets.
 */
LogInAssistant.prototype.models = {
  txtName : { value : null },
  pwdPassword : { value : null },
  btnLogIn : { 
    label : "Log In", buttonClass : "affirmative", disabled : false 
  }
}; 


/**
 * Set up the scene.
 */
LogInAssistant.prototype.setup = function() {

  // Name TextField.
  this.assistant.controller.setupWidget("login_txtName", 
    { hintText : "Name", focusMode : Mojo.Widget.focusSelectMode }, 
    this.models.txtName
  );  

  // Password PasswordField.
  this.assistant.controller.setupWidget("login_pwdPassword",
    { hintText : "Password" }, this.models.pwdPassword
  ); 

  // Setup up model for and hook up event handler to the Log In Button.
  this.assistant.controller.setupWidget("login_btnLogIn", 
   { type : Mojo.Widget.activityButton }, this.models.btnLogIn
  );  
  Mojo.Event.listen(this.assistant.controller.get("login_btnLogIn"), 
    Mojo.Event.tap, this.btnLogInTap.bind(this)
  ); 

}; // End LogInAssistant.prototype.setup().


/** 
 * Called when the Log In button is clicked.
 */    
LogInAssistant.prototype.btnLogInTap = function() {

  // Validations.
  if (this.models.txtName.value == null || this.models.txtName.value.blank()) {
    Mojo.Controller.getAppController().showBanner({
      messageText : "A name must be entered", soundClass : "alerts" 
    }, { }, "");                
    return;
  } 
  if (this.models.pwdPassword.value == null || 
    this.models.pwdPassword.value.blank()) {
    Mojo.Controller.getAppController().showBanner({
      messageText : "A password must be entered", soundClass : "alerts" 
    }, { }, "");   
  }

  // Handle special built-in "super-user" case.
  if (this.models.txtName.value.toLowerCase() == "admin" && 
    this.models.pwdPassword.value.toLowerCase() == "admin") {
    this.processResults({
      name : "admin", password : "admin", isProjectManager : true
    });
    return;
  }

  // Activate spinner on Button.
  this.models.btnLogIn.label = "Working, Please Wait...";
  this.models.btnLogIn.disabled = true;
  this.assistant.controller.modelChanged(this.models.btnLogIn);
  this.assistant.controller.get("login_btnLogIn").mojo.activate();

  // Try to authenticate.
  dao.retrieve("resource", this.processResults.bind(this), 
    this.models.txtName.value, this.models.pwdPassword.value);

}; // End LogInAssistant.prototype.btnLogInTap().


/**
 * Callback executed when the user attempts to log in.
 *
 * @param inResults A Resource object if authenticated or an ErrorResponse
 *                  if not.
 */
LogInAssistant.prototype.processResults = function(inResults) {

  // Reset Button.
  this.models.btnLogIn.label = "Log In";
  this.models.btnLogIn.disabled = false;
  this.assistant.controller.modelChanged(this.models.btnLogIn);
  this.assistant.controller.get("login_btnLogIn").mojo.deactivate();

  if (inResults && inResults.name) {

    // Authentication was successful, so enable all Buttons on Welcome, 
    // except Log In, which now gets disabled.
    timeTracker.user = inResults; 
    if (inResults.isProjectManager) {
      // Only PM's can do these things.
      this.assistant.buttonModels.projectAdministration.disabled = false;
      this.assistant.buttonModels.resourceAdministration.disabled = false;
    }
    if (inResults.name != "admin") {
      // Don't allow the special "super-user" to book time or view summaries
      // because it's strictly an admin-only account.
      this.assistant.buttonModels.bookTime.disabled = false;
      this.assistant.buttonModels.summaries.disabled = false;
    }
    this.assistant.controller.modelChanged(
      this.assistant.buttonModels.projectAdministration, this.assistant);
    this.assistant.controller.modelChanged(
      this.assistant.buttonModels.resourceAdministration, this.assistant);
    this.assistant.controller.modelChanged(
      this.assistant.buttonModels.bookTime, this.assistant);
    this.assistant.controller.modelChanged(
      this.assistant.buttonModels.summaries, this.assistant);
      
    // Switch to full-screen mode.
    this.assistant.controller.enableFullScreenMode(true);    
      
    // Close this dialog and the player is playing again.
    this.assistant.logInDialog.mojo.close();  
        
  } else {

    Mojo.Controller.getAppController().showBanner({
      messageText : "Authentication failed. Try again!", soundClass : "alerts" 
    }, { }, "");   
    
  }

}; // End LogInAssistant.prototype.processResults().

