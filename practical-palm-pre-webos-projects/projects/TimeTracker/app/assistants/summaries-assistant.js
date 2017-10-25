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
function SummariesAssistant() { };


/**
 * Flags set when the data for each of the ListSelectors is retrieved.
 */
this.projectsRetrieved = false;
this.tasksRetrieved = false;
this.resourcesRetrieved = false;


/**
 * Models for the entry fields in this scene.
 */
SummariesAssistant.prototype.models = { 
  lss_projects : { label : "Project", choices : null, value : null },
  lss_tasks : { label : "Task", choices : null, value : null },
  lss_resources : { label : "Resource", choices : null, value : null }
};


/**
 * Set up the scene.
 */
SummariesAssistant.prototype.setup = function() {

  // Populate model values.
  this.models.lss_projects.choices = [ ];
  this.models.lss_tasks.choices = [ ];
  this.models.lss_resources.choices = [ ];

  // Reset flags.
  this.projectsRetrieved = false;
  this.tasksRetrieved = false;
  this.resourcesRetrieved = false;

  // Enable full-screen mode for this scene.
  this.controller.enableFullScreenMode(true);

  // Set up Spinner for the scrim when calling the service layer.
  this.controller.setupWidget("summaries_divSpinner",
    { spinnerSize : "large" }, { spinning : true }
  );

  // Project ListSelector.  Note that the widget attributes and model 
  // use the same object.
  this.controller.setupWidget("summaries_lssProject",
    this.models.lssProject, this.models.lss_projects
  ); 

  // Task ListSelector.  Note that the widget attributes and model 
  // use the same object.
  this.controller.setupWidget("summaries_lssTask",
    this.models.lssTask, this.models.lss_tasks
  ); 

  // Resource ListSelector.  Note that the widget attributes and model 
  // use the same object.
  this.controller.setupWidget("summaries_lssResource",
    this.models.lssResource, this.models.lss_resources
  ); 

  // Clear Button.
  this.controller.setupWidget("summaries_btnClear", { },
    { buttonClass : "negative buttonfloat", label : "Clear" }
  );  
  Mojo.Event.listen(this.controller.get("summaries_btnClear"), 
    Mojo.Event.tap, this.btnClearTap.bind(this)
  ); 

  // Show Summary Button.
  this.controller.setupWidget("summaries_btnShowSummary", { },
    { buttonClass : "affirmative buttonfloat", label : "Show Summary" }
  );  
  Mojo.Event.listen(this.controller.get("summaries_btnShowSummary"), 
    Mojo.Event.tap, this.btnShowSummaryTap.bind(this)
  ); 

}; // End SummariesAssistant.prototype.setup().


/**
 * Called when the scene is activated.
 */
SummariesAssistant.prototype.activate = function() {

  // Retrieve projects, tasks and resources, clearing the ListSelectors first .
  this.models.lss_projects.choices = [ ];
  this.models.lss_tasks.choices = [ ];
  this.models.lss_resources.choices = [ ];
  this.controller.modelChanged(this.models.lss_projects);
  this.controller.modelChanged(this.models.lss_tasks);
  this.controller.modelChanged(this.models.lss_resources);
  
  // Show scrim.
  $("summaries_divScrim").show();
  
  // Ask the DAO for data.
  dao.retrieve("project", function(inResults) {
    this.processResults(inResults, "projects").bind(this);
  }.bind(this));
  dao.retrieve("task", function(inResults) {
    this.processResults(inResults, "tasks").bind(this);
  }.bind(this));
  dao.retrieve("resource", function(inResults) {
    this.processResults(inResults, "resources").bind(this);
  }.bind(this));
  
}; // End SummariesAssistant.prototype.activate().


/**
 * Callback executed when the project, task and resource ListSelectors are 
 * populated.
 *
 * @param inResults An array of project objects.
 * @param inType    The type ("projects", "tasks" or "resources").
 */
SummariesAssistant.prototype.processResults = function(inResults, inType) {

  this[inType + "Retrieved"] = true;
  if (Object.isArray(inResults)) {
    // Update the model.
    timeTracker[inType] = inResults;
    for (var i = 0; i < timeTracker[inType].length; i++) {
      this.models["lss_" + inType].choices.push({
        label : timeTracker[inType][i].name,
        value : timeTracker[inType][i].name
      });
    }
    // Inform the controller of the model change so the ListSelector is 
    // refreshed.
    this.controller.modelChanged(this.models["lss_" + inType]);
  } else {
    Mojo.Controller.errorDialog(inResults.responseJSON.error);
  }

  // Hide scrim if all data retrieved.
  if (this.projectsRetrieved && this.tasksRetrieved & this.resourcesRetrieved) {
    $("summaries_divScrim").hide();
  }

}; // End SummariesAssistant.prototype.processResults().


/**
 * Handle taps on the Clear Button.
 */
SummariesAssistant.prototype.btnClearTap = function() {

  // Clear selections.
  this.models.lss_projects.value = null;
  this.models.lss_tasks.value = null;
  this.models.lss_resources.value = null;
  this.controller.modelChanged(this.models.lss_projects);
  this.controller.modelChanged(this.models.lss_tasks);
  this.controller.modelChanged(this.models.lss_resources);

}; // End SummariesAssistant.prototype.btnClearTap().



/**
 * Handle taps on the Show Summary Button.
 */
SummariesAssistant.prototype.btnShowSummaryTap = function() {

  // Project summary.
  if (this.models.lss_projects.value != null &&
    this.models.lss_tasks.value == null && 
    this.models.lss_resources.value == null) {
    for (var i = 0; i < timeTracker.projects.length; i++) {
      if (timeTracker.projects[i].name == this.models.lss_projects.value) {
        Mojo.Controller.stageController.pushScene("projectSummary",
          timeTracker.projects[i]);
        return;
      }
    }
    return;
  }

  // Task summary.
  if (this.models.lss_projects.value == null &&
    this.models.lss_tasks.value != null && 
    this.models.lss_resources.value == null) {
    for (var i = 0; i < timeTracker.tasks.length; i++) {
      if (timeTracker.tasks[i].name == this.models.lss_tasks.value) {
        Mojo.Controller.stageController.pushScene("taskSummary",
          timeTracker.tasks[i]);
        return;
      }
    }
  }

  // Resource summary.
  if (this.models.lss_projects.value == null &&
    this.models.lss_tasks.value == null && 
    this.models.lss_resources.value != null) {
    for (var i = 0; i < timeTracker.resources.length; i++) {
      if (timeTracker.resources[i].name == this.models.lss_resources.value) {
        Mojo.Controller.stageController.pushScene("resourceSummary",
          timeTracker.resources[i]);
        return;
      }
    }
    return;
  }

  // Clear selections.
  this.models.lss_projects.value = null;
  this.models.lss_tasks.value = null;
  this.models.lss_resources.value = null;
  this.controller.modelChanged(this.models.lss_projects);
  this.controller.modelChanged(this.models.lss_tasks);
  this.controller.modelChanged(this.models.lss_resources);

  // If we're here, more than one thing was selected.  That's bad, m'kay?!?
  Mojo.Controller.errorDialog("Please select a project by itself, or a task " +
    "by itself, or a resource by itself.");

}; // End SummariesAssistant.prototype.btnShowSummaryTap().
