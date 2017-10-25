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
 * @param inTask The task object to show a summary for.
 */
function TaskSummaryAssistant(inTask) { 
  this.task = inTask;
};


/**
 * The task object a summary is being shown for.
 */
TaskSummaryAssistant.prototype.task = null;


/**
 * Model for the percent complete ProgressBar.
 */
TaskSummaryAssistant.prototype.percentCompleteModel = { progress : 0 };


/**
 * Set up the scene.
 */
TaskSummaryAssistant.prototype.setup = function() {

  // Enable full-screen mode for this scene.
  this.controller.enableFullScreenMode(true);

  this.controller.setupWidget("taskSummary_percentComplete",
    { modelProperty : "progress" }, 
    TaskSummaryAssistant.prototype.percentCompleteModel 
  ); 

}; // End TaskSummaryAssistant.prototype.setup().


/**
 * Called when the scene is activated.
 */
TaskSummaryAssistant.prototype.activate = function() {

  // Clone the object so % complete doesn't becoming permanent.
  var task = Object.clone(this.task);
      
  // Populate screen.
  $("taskSummary_name").innerHTML = task.name;
  $("taskSummary_parentProject").innerHTML = task.project;
  $("taskSummary_startDate").innerHTML = 
    timeTracker.formatDate(new Date(task.startDate));
  $("taskSummary_targetDate").innerHTML = 
    timeTracker.formatDate(new Date(task.targetDate));
  $("taskSummary_allocatedHours").innerHTML = task.allocatedHours;
  $("taskSummary_bookedHours").innerHTML = task.bookedHours;
  TaskSummaryAssistant.prototype.percentCompleteModel.progress = 
    Math.round(((parseInt(task.bookedHours) * 100) / 
      parseInt(task.allocatedHours))) * .01; 
  this.controller.modelChanged(
    TaskSummaryAssistant.prototype.percentCompleteModel );


}; // End TaskSummaryAssistant.prototype.activate().

