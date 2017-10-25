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
 * @param inProject The project object being edited.
 */
function ProjectDetailsAssistant(inProject) { 
  
  this.projectBeingEdited = inProject;
  
};


/**
 * The project object of the project being edited, or null if adding a new one.
 */
ProjectDetailsAssistant.prototype.projectBeingEdited = null;


/**
 * Models for the entry fields in this scene.
 */
ProjectDetailsAssistant.prototype.models = { 
  txtName : { value : null, disabled : false },
  dtpStartDate : { value : null },
  dtpTargetDate : { value : null },
  lssProjectManager : { 
    label : "Manager", choices : null, value : null 
  },
  lstTasksModel : { items : [ ] }  
};


/**
 * Set up the scene.
 */
ProjectDetailsAssistant.prototype.setup = function() {

  // Populate model values and do other setup depending on whether a project
  // is being edited or created.
  this.models.lssProjectManager.choices = [ ];
  if (this.projectBeingEdited) {
    $("projectDetails_divTasks").show();
    this.models.txtName.disabled = true;
    this.models.txtName.value = this.projectBeingEdited.name;
    this.models.dtpStartDate.value = 
      new Date(this.projectBeingEdited.startDate);
    this.models.dtpTargetDate.value = 
      new Date(this.projectBeingEdited.targetDate);
    this.models.lssProjectManager.value = 
      this.projectBeingEdited.projectManager;
  } else {
    $("projectDetails_divTasks").hide();
    this.models.txtName.disabled = false;
    this.models.txtName.value = null;
    this.models.dtpStartDate.value = new Date();
    this.models.dtpTargetDate.value = new Date();
    this.models.lssProjectManager.value = null;
  }

  // Enable full-screen mode for this scene.
  this.controller.enableFullScreenMode(true);

  // Set up Spinner for the scrim when calling the service layer.
  this.controller.setupWidget("projectDetails_divSpinner",
    { spinnerSize : "large" }, { spinning : true }
  );

  // Name TextField.
  this.controller.setupWidget("projectDetails_txtName", 
    { hintText : "Project Name", focusMode : Mojo.Widget.focusSelectMode }, 
    this.models.txtName
  );  

  // Start Date DatePicker.
  this.controller.setupWidget("projectDetails_dtpStartDate",
    { label : " ", modelProperty : "value" }, 
    this.models.dtpStartDate
  ); 

  // Target Date DatePicker.
  this.controller.setupWidget("projectDetails_dtpTargetDate",
    { label : " ", modelProperty : "value" }, 
    this.models.dtpTargetDate
  ); 

  // Project Manager ListSelector.  Note that the widget attributes and model 
  // use the same object.
  for (var i = 0; i < timeTracker.resources.length; i++) {
    if (timeTracker.resources[i].isProjectManager) {
      this.models.lssProjectManager.choices.push({
        label : timeTracker.resources[i].name,
        value : timeTracker.resources[i].name
      });
    }
  }
  this.controller.setupWidget("projectDetails_lssProjectManager",
    this.models.lssProjectManager, this.models.lssProjectManager
  ); 

  // Set up tasks List.
  this.controller.setupWidget("projectDetails_lstTasks", {
    addItemLabel : "Add...", swipeToDelete : true, 
    itemTemplate : "projectDetails/taskList-item"
  }, this.models.lstTasksModel);
  this.controller.listen("projectDetails_lstTasks", Mojo.Event.listTap, 
    this.selectTask.bind(this));
  this.controller.listen("projectDetails_lstTasks", Mojo.Event.listAdd, 
    this.addTask.bind(this));
  this.controller.listen("projectDetails_lstTasks", Mojo.Event.listDelete, 
    this.deleteTask.bind(this));

  // Save Button.
  this.controller.setupWidget("projectDetails_btnSave", { },
    { buttonClass : "affirmative", label : "Save" }
  );  
  Mojo.Event.listen(this.controller.get("projectDetails_btnSave"), 
    Mojo.Event.tap, this.btnSaveTap.bind(this)
  ); 

}; // End ProjectDetailsAssistant.prototype.setup().


/**
 * Called when the scene is activated.
 */
ProjectDetailsAssistant.prototype.activate = function() {

  // Retrieve tasks, clearing the List first, if a project is being edited.
  this.models.lstTasksModel.items = [ ];
  this.controller.modelChanged(this.models.lstTasksModel);
  if (this.projectBeingEdited) {
    $("projectDetails_divScrim").show();
    dao.retrieve("task", this.processResults.bind(this));
  }
  
}; // End ProjectDetailsAssistant.prototype.activate().


/**
 * Callback executed when the list is populated.
 *
 * @param inResults An array of resource objects.
 */
ProjectDetailsAssistant.prototype.processResults = function(inResults) {

  if (Object.isArray(inResults)) {
    // Update the model.
    timeTracker.tasks = inResults;
    for (var i = 0; i < inResults.length; i++) {
      if (inResults[i].project == this.projectBeingEdited.name) {
        this.models.lstTasksModel.items.push(inResults[i]);
      }
    }
    // Inform the controller of the model change so the list is refreshed.
    this.controller.modelChanged(this.models.lstTasksModel);
  } else {
    Mojo.Controller.errorDialog(inResults.responseJSON.error);
  }
  
  // Hide scrim and we're done.
  $("projectDetails_divScrim").hide();

}; // End ProjectDetailsAssistant.prototype.processResults().


/**
 * Select a task for editing.
 *
 * @param inEvent The incoming event object.
 */
ProjectDetailsAssistant.prototype.selectTask = function(inEvent) {

  Mojo.Controller.stageController.pushScene("taskDetails", inEvent.item,
    this.projectBeingEdited.name);

}; // End ProjectDetailsAssistant.prototype.selectTask().


/**
 * Add a task.
 *
 * @param inEvent The incoming event object.
 */
ProjectDetailsAssistant.prototype.addTask = function(inEvent) {

  Mojo.Controller.stageController.pushScene("taskDetails", null,
    this.projectBeingEdited.name);

}; // End ProjectDetailsAssistant.prototype.addTask().


/**
 * Delete a task.
 * 
 * @param inEvent The incoming event object.
 */
ProjectDetailsAssistant.prototype.deleteTask = function(inEvent) {

  dao.deleteEntity("task", inEvent.item.name);

}; // End ProjectDetailsAssistant.prototype.deleteTask().


/**
 * Handle taps on the Save Button.
 */
ProjectDetailsAssistant.prototype.btnSaveTap = function() {

  // Validations.
  if (this.models.txtName.value == null || this.models.txtName.value.blank()) {
    Mojo.Controller.errorDialog("A name must be entered");
    return;
  } 
  if (this.models.lssProjectManager.value == null) {
    Mojo.Controller.errorDialog("A project manager must be selected");
    return;
  } 

  $("projectDetails_divScrim").show();

  // Do an update if we have a project being edited, otherwise do a create.
  var operation = "create";
  if (this.projectBeingEdited) {
    operation = "update";
  }
  dao[operation]("project",
    { 
      name : this.models.txtName.value,
      startDate : timeTracker.formatDate(this.models.dtpStartDate.value),
      targetDate : timeTracker.formatDate(this.models.dtpTargetDate.value),
      projectManager : this.models.lssProjectManager.value
    }, 
    function(inTransport, inException) {
      $("projectDetails_divScrim").hide();
      if (inTransport && inTransport.responseJSON) {
        if (inTransport.responseJSON.name) {
          Mojo.Controller.stageController.popScene();
        } else if (inTransport.responseJSON.msg) {
          this.controller.showAlertDialog({
            onChoose : function(inValue) {
              Mojo.Controller.stageController.popScene();
            },
            title : "Project warehoused",
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

}; // End ProjectDetailsAssistant.prototype.btnSaveTap().
