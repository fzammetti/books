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
 *
 * @param inResource The resource object being edited. 
 */
function ResourceDetailsAssistant(inResource) { 

  this.resourceBeingEdited = inResource;

};


/**
 * The resource object of the resource being edited, or null if adding a new one.
 */
ResourceDetailsAssistant.prototype.resourceBeingEdited = null;


/**
 * Models for the entry fields in this scene.
 */
ResourceDetailsAssistant.prototype.models = { 
  txtName : { value : null, disabled : false },
  pwdPassword : { value : null },
  chkProjectManager : { value : null }
};


/**
 * Set up the scene.
 */
ResourceDetailsAssistant.prototype.setup = function() {

  // Populate model values.
  if (this.resourceBeingEdited) {
    this.models.txtName.disabled = true;
    this.models.txtName.value = this.resourceBeingEdited.name;
    this.models.pwdPassword.value = this.resourceBeingEdited.password;
    this.models.chkProjectManager.value = 
      this.resourceBeingEdited.isProjectManager;
  } else {
    this.models.txtName.disabled = false;
    this.models.txtName.value = null;
    this.models.pwdPassword.value = null;
    this.models.chkProjectManager.value = false;
  }

  // Enable full-screen mode for this scene.
  this.controller.enableFullScreenMode(true);

  // Set up Spinner for the scrim when calling the service layer.
  this.controller.setupWidget("resourceDetails_divSpinner",
    { spinnerSize : "large" }, { spinning : true }
  );

  // Name TextField.
  this.controller.setupWidget("resourceDetails_txtName", 
    { hintText : "Resource Name", focusMode : Mojo.Widget.focusSelectMode }, 
    this.models.txtName
  );  

  // Password PasswordField.
  this.controller.setupWidget("resourceDetails_pwdPassword",
    { hintText : "Password" }, this.models.pwdPassword
  ); 

  // Project Manager CheckBox.
  this.controller.setupWidget("resourceDetails_chkProjectManager",
    { }, this.models.chkProjectManager
  ); 

  // Save Button.
  this.controller.setupWidget("resourceDetails_btnSave", { },
    { buttonClass : "affirmative", label : "Save" }
  );  
  Mojo.Event.listen(this.controller.get("resourceDetails_btnSave"), 
    Mojo.Event.tap, this.btnSaveTap.bind(this)
  ); 

}; // End ResourceDetailsAssistant.prototype.setup().


/**
 * Handle taps on the Save Button.
 */
ResourceDetailsAssistant.prototype.btnSaveTap = function() {

  // Validations.
  if (this.models.txtName.value == null || this.models.txtName.value.blank()) {
    Mojo.Controller.errorDialog("A name must be entered");
    return;
  } 
  if (this.models.pwdPassword.value == null || 
    this.models.pwdPassword.value.blank()) {
    Mojo.Controller.errorDialog("A password must be entered");
    return;
  }

  $("resourceDetails_divScrim").show();

  var operation = "create";
  if (this.resourceBeingEdited) {
    operation = "update";
  }
  dao[operation]("resource",
    { 
      name : this.models.txtName.value,
      password : this.models.pwdPassword.value,
      isProjectManager : this.models.chkProjectManager.value
    }, 
    function(inTransport, inException) {
      $("resourceDetails_divScrim").hide();
      if (inTransport && inTransport.responseJSON) {
        if (inTransport.responseJSON.name) {
          Mojo.Controller.stageController.popScene();
        } else if (inTransport.responseJSON.msg) {
          this.controller.showAlertDialog({
            onChoose : function(inValue) {
              Mojo.Controller.stageController.popScene();
            },
            title : "Resource warehoused",
            message : inTransport.responseJSON.msg,
            choices : [
              { label : "Ok", value : "Ok", type : "affirmative"}  
            ]
          });          
        } else if (inTransport.responseJSON.error) {
          Mojo.Controller.errorDialog(inTransport.responseJSON.error);
        }
      }      
    }.bind(this)
  );

}; // End ResourceDetailsAssistant.prototype.btnSaveTap().
