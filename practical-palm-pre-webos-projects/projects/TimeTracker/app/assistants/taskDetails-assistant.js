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
 * @param inTask        The task object being edited. 
 * @param inProjectName The name of the project.
 */
function TaskDetailsAssistant(inTask, inProjectName) { 

  this.taskBeingEdited = inTask;
  this.projectName = inProjectName;

};


/**
 * The task object of the task being edited, or null if adding a new one.
 */
TaskDetailsAssistant.prototype.taskBeingEdited = null;


/**
 * The name of the project the task belongs to.
 */
TaskDetailsAssistant.prototype.projectName = null;


/**
 * Models for the entry fields in this scene.
 */
TaskDetailsAssistant.prototype.models = { 
  txtName : { value : null, disabled : false },
  dtpStartDate : { value : null },
  dtpTargetDate : { value : null },
  inpAllocatedHours : { value : null },
  lssAssignedResource : { 
    label : "Resource", choices : null, value : null 
  }
};


/**
 * Set up the scene.
 */
TaskDetailsAssistant.prototype.setup = function() {

  // Populate model values.
  this.models.lssAssignedResource.choices = [ ];
  if (this.taskBeingEdited) {
    this.models.txtName.disabled = true;
    this.models.txtName.value = this.taskBeingEdited.name;
    this.models.dtpStartDate.value = new Date(this.taskBeingEdited.startDate);
    this.models.dtpTargetDate.value = new Date(this.taskBeingEdited.targetDate);
    this.models.inpAllocatedHours.value = this.taskBeingEdited.allocatedHours;
    this.models.lssAssignedResource.value = 
      this.taskBeingEdited.assignedResource;
  } else {
    this.models.txtName.disabled = false;
    this.models.txtName.value = null;
    this.models.dtpStartDate.value = new Date();
    this.models.dtpTargetDate.value = new Date();
    this.models.inpAllocatedHours.value = 0;
    this.models.lssAssignedResource.value = null;    
  }

  // Enable full-screen mode for this scene.
  this.controller.enableFullScreenMode(true);

  // Set up Spinner for the scrim when calling the service layer.
  this.controller.setupWidget("taskDetails_divSpinner",
    { spinnerSize : "large" }, { spinning : true }
  );

  // Name TextField.
  this.controller.setupWidget("taskDetails_txtName", 
    { hintText : "Task Name", focusMode : Mojo.Widget.focusSelectMode }, 
    this.models.txtName
  );  

  // Start Date DatePicker.
  this.controller.setupWidget("taskDetails_dtpStartDate",
    { label : " ", modelProperty : "value" }, 
    this.models.dtpStartDate
  ); 

  // Target Date DatePicker.
  this.controller.setupWidget("taskDetails_dtpTargetDate",
    { label : " ", modelProperty : "value" }, 
    this.models.dtpTargetDate
  ); 

  // Allocated Hours.
  this.controller.setupWidget("taskDetails_inpAllocatedHours",
    { min : 1, max : 100, label : " ", modelProperty : "value" }, 
    this.models.inpAllocatedHours 
  ); 

  // Assigned Resource ListSelector.  Note that the widget attributes and model 
  // use the same object.
  for (var i = 0; i < timeTracker.resources.length; i++) {
    this.models.lssAssignedResource.choices.push({
      label : timeTracker.resources[i].name,
      value : timeTracker.resources[i].name
    });
  }
  this.controller.setupWidget("taskDetails_lssAssignedResource",
    this.models.lssAssignedResource, this.models.lssAssignedResource
  ); 

  // Save Button.
  this.controller.setupWidget("taskDetails_btnSave", { },
    { buttonClass : "affirmative", label : "Save" }
  );  
  Mojo.Event.listen(this.controller.get("taskDetails_btnSave"), 
    Mojo.Event.tap, this.btnSaveTap.bind(this)
  ); 

}; // End TaskDetailsAssistant.prototype.setup().


/**
 * Handle taps on the Save Button.
 */
TaskDetailsAssistant.prototype.btnSaveTap = function() {

  // Validations.
  if (this.models.txtName.value == null || this.models.txtName.value.blank()) {
    Mojo.Controller.errorDialog("A name must be entered");
    return;
  } 
  if (this.models.lssAssignedResource.value == null || 
    this.models.lssAssignedResource.value.blank()) {
    Mojo.Controller.errorDialog("This task must be assigned to a resource");
    return;
  }

  $("taskDetails_divScrim").show();

  var operation = "create";
  if (this.taskBeingEdited) {
    operation = "update";
  }
  dao[operation]("task",
    { 
      project : this.projectName,
      name : this.models.txtName.value,
      startDate : timeTracker.formatDate(this.models.dtpStartDate.value),
      targetDate : timeTracker.formatDate(this.models.dtpTargetDate.value),
      allocatedHours : this.models.inpAllocatedHours.value,
      assignedResource : this.models.lssAssignedResource.value
    }, 
    function(inTransport, inException) {
      $("taskDetails_divScrim").hide();
      if (inTransport && inTransport.responseJSON) {
        if (inTransport.responseJSON.name) {
          Mojo.Controller.stageController.popScene();
        } else if (inTransport.responseJSON.msg) {
          this.controller.showAlertDialog({
            onChoose : function(inValue) {
              Mojo.Controller.stageController.popScene();
            },
            title : "Task warehoused",
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

}; // End TaskDetailsAssistant.prototype.btnSaveTap().
