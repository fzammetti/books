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
function BookTimeAssistant() { };


/**
 * Models for the entry fields in this scene.
 */
BookTimeAssistant.prototype.models = { 
  lssProject : { label : "Project", choices : null, value : null },
  lssTask : { label : "Task", choices : null, value : null },
  inpTime : { value : null }
};


/**
 * Set up the scene.
 */
BookTimeAssistant.prototype.setup = function() {

  // Populate model values.
  this.models.lssProject.choices = [ ];
  this.models.lssTask.choices = [ ];
  this.models.inpTime.value = 0;

  // Enable full-screen mode for this scene.
  this.controller.enableFullScreenMode(true);

  // Set up Spinner for the scrim when calling the service layer.
  this.controller.setupWidget("bookTime_divSpinner",
    { spinnerSize : "large" }, { spinning : true }
  );

  // Project ListSelector.  Note that the widget attributes and model 
  // use the same object.
  this.controller.setupWidget("bookTime_lssProject",
    this.models.lssProject, this.models.lssProject
  ); 
  Mojo.Event.listen(this.controller.get("bookTime_lssProject"), 
    Mojo.Event.propertyChange, this.projectSelected.bind(this)
  );  

  // Task ListSelector.  Note that the widget attributes and model 
  // use the same object.
  this.controller.setupWidget("bookTime_lssTask",
    this.models.lssTask, this.models.lssTask
  ); 

  // Time IntegerPicker.
  this.controller.setupWidget("bookTime_inpTime",
    { label : " ", modelProperty : "value", min : 1, max : 100 }, 
    this.models.inpTime
  ); 

  // Save Button.
  this.controller.setupWidget("bookTime_btnSave", { },
    { buttonClass : "affirmative", label : "Save" }
  );  
  Mojo.Event.listen(this.controller.get("bookTime_btnSave"), 
    Mojo.Event.tap, this.btnSaveTap.bind(this)
  ); 

}; // End BookTimeAssistant.prototype.setup().


/**
 * Called when the scene is activated.
 */
BookTimeAssistant.prototype.activate = function() {

  // Retrieve projects, clearing the List first (clear the tasks List too).
  this.models.lssProject.choices = [ ];
  this.models.lssTask.choices = [ ];
  this.controller.modelChanged(this.models.lssProject);
  this.controller.modelChanged(this.models.lssTask);
  $("bookTime_divScrim").show();
  dao.retrieve("project", this.processProjectResults.bind(this));
  
}; // End BookTimeAssistant.prototype.activate().


/**
 * Callback executed when the projects ListSelector is populated.
 *
 * @param inResults An array of project objects.
 */
BookTimeAssistant.prototype.processProjectResults = function(inResults) {

  if (Object.isArray(inResults)) {
    // Update the model.
    timeTracker.projects = inResults;
    for (var i = 0; i < timeTracker.projects.length; i++) {
      this.models.lssProject.choices.push({
        label : timeTracker.projects[i].name,
        value : timeTracker.projects[i].name
      });
    }
    // Inform the controller of the model change so the list is refreshed.
    this.controller.modelChanged(this.models.lssProject);
  } else {
    Mojo.Controller.errorDialog(inResults.responseJSON.error);
  }
  
  $("bookTime_divScrim").hide();

}; // End BookTimeAssistant.prototype.processProjectResults().


/**
 * Handle when the user selected a project.
 */
BookTimeAssistant.prototype.projectSelected = function() {

  // Retrieve tasks, clearing the List first.
  this.models.lssTask.choices = [ ];
  this.controller.modelChanged(this.models.lssTask);  
  $("bookTime_divScrim").show();
  dao.retrieve("task", this.processTaskResults.bind(this));

}; // End BookTimeAssistant.prototype.projectSelected().


/**
 * Callback executed when the tasks ListSelector is populated.
 *
 * @param inResults An array of task objects.
 */
BookTimeAssistant.prototype.processTaskResults = function(inResults) {

  if (Object.isArray(inResults)) {
    // Update the model.
    timeTracker.tasks = inResults;
    for (var i = 0; i < timeTracker.tasks.length; i++) {
      if (timeTracker.tasks[i].project == this.models.lssProject.value &&
        timeTracker.tasks[i].assignedResource == timeTracker.user.name) {
        this.models.lssTask.choices.push({
          label : timeTracker.tasks[i].name,
          value : timeTracker.tasks[i].name
        });
      }
    }
    // Inform the controller of the model change so the list is refreshed.
    this.controller.modelChanged(this.models.lssTask);
  } else {
    Mojo.Controller.errorDialog(inResults.responseJSON.error);
  }
  
  $("bookTime_divScrim").hide();

}; // End BookTimeAssistant.prototype.processTaskResults().


/**
 * Handle taps on the Save Button.
 */
BookTimeAssistant.prototype.btnSaveTap = function() {

  // Validations.
  if (this.models.lssProject.value == null) {
    Mojo.Controller.errorDialog("A project must be selected");
    return;
  } 
  if (this.models.lssTask.value == null) {
    Mojo.Controller.errorDialog("A task must be selected");
    return;
  } 

  $("bookTime_divScrim").show();

  // Look up the Task object so we can get the startDate, targetDate and
  // allocatedHours from it.
  var task = null;
  for (var i = 0; i < timeTracker.tasks.length; i++) {
    if (timeTracker.tasks[i].name == this.models.lssTask.value &&
      timeTracker.tasks[i].project == this.models.lssProject.value) {
      task = timeTracker.tasks[i];
    }
  }

  // Do update on server.
  dao.update("task",
    { 
      project : task.project,
      name : task.name,
      startDate : timeTracker.formatDate(new Date(task.startDate)),
      targetDate : timeTracker.formatDate(new Date(task.targetDate)),
      allocatedHours : task.allocatedHours,
      bookedHours : this.models.inpTime.value,
      assignedResource : task.assignedResource
    }, 
    function(inTransport, inException) {
      $("bookTime_divScrim").hide();
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

}; // End BookTimeAssistant.prototype.btnSaveTap().
