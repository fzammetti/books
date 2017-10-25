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
function AdminProjectAssistant() { };


/**
 * Model for the project List.
 */
AdminProjectAssistant.prototype.lstProjectsModel = { items : [ ] };


/**
 * Set up the scene.
 */
AdminProjectAssistant.prototype.setup = function() {

  // Enable full-screen mode for this scene.
  this.controller.enableFullScreenMode(true);

  // Set up Spinner for the scrim when calling the service layer.
  this.controller.setupWidget("adminProject_divSpinner",
    { spinnerSize : "large" }, { spinning : true }
  );

  // Set up List.
  this.controller.setupWidget("adminProject_lstProjects", {
    addItemLabel : "Add...", swipeToDelete : true, 
    itemTemplate : "adminProject/list-item"
  }, this.lstProjectsModel);
  this.controller.listen("adminProject_lstProjects", Mojo.Event.listTap, 
    this.selectProject.bind(this));
  this.controller.listen("adminProject_lstProjects", Mojo.Event.listAdd, 
    this.addProject.bind(this));
  this.controller.listen("adminProject_lstProjects", Mojo.Event.listDelete, 
    this.deleteProject.bind(this));

}; // End AdminProjectAssistant.prototype.setup().


/**
 * Called when the scene is activated.
 */
AdminProjectAssistant.prototype.activate = function() {

  // Retrieve projects, clearing the List first.
  this.lstProjectsModel.items = [ ];
  this.controller.modelChanged(this.lstProjectsModel);
  $("adminProject_divScrim").show();
  dao.retrieve("project", this.processResults.bind(this));
  
}; // End AdminProjectAssistant.prototype.activate().


/**
 * Callback executed when the list is populated.
 *
 * @param inResults An array of project objects.
 */
AdminProjectAssistant.prototype.processResults = function(inResults) {

  if (Object.isArray(inResults)) {
    // Update the model.
    timeTracker.projects = [ ];
    for (var i = 0; i < inResults.length; i++) {
      if (inResults[i].projectManager == timeTracker.user.name) {
        timeTracker.projects.push(inResults[i]);
      }
    }
    this.lstProjectsModel.items = timeTracker.projects;
    // Inform the controller of the model change so the list is refreshed.
    this.controller.modelChanged(this.lstProjectsModel);
  } else {
    Mojo.Controller.errorDialog(inResults.responseJSON.error);
  }
  
  // Hide scrim and we're done.
  $("adminProject_divScrim").hide();

}; // End AdminProjectAssistant.prototype.processResults().


/**
 * Select a project for editing.
 *
 * @param inEvent The incoming event object.
 */
AdminProjectAssistant.prototype.selectProject = function(inEvent) {
  
  Mojo.Controller.stageController.pushScene("projectDetails", inEvent.item);

}; // End AdminProjectAssistant.prototype.selectProject().


/**
 * Add a project.
 */
AdminProjectAssistant.prototype.addProject = function() {

  Mojo.Controller.stageController.pushScene("projectDetails");

}; // End AdminProjectAssistant.prototype.addProject().


/**
 * Delete a project.
 */
AdminProjectAssistant.prototype.deleteProject = function() {

  dao.deleteEntity("project", inEvent.item.name);

}; // End AdminProjectAssistant.prototype.deleteProject().
 