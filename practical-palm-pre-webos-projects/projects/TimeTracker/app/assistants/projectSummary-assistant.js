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
 * @param inProject The project object to show a summary for.
 */
function ProjectSummaryAssistant(inProject) { 
  this.project = inProject;
};


/**
 * The project object a summary is being shown for.
 */
ProjectSummaryAssistant.prototype.project = null;


/**
 * Set up the scene.
 */
ProjectSummaryAssistant.prototype.setup = function() {

  // Enable full-screen mode for this scene.
  this.controller.enableFullScreenMode(true);

}; // End ProjectSummaryAssistant.prototype.setup().


/**
 * Called when the scene is activated.
 */
ProjectSummaryAssistant.prototype.activate = function() {

  // Project details.
  $("projectSummary_name").innerHTML = this.project.name;
  $("projectSummary_projectManager").innerHTML = this.project.projectManager;
  $("projectSummary_startDate").innerHTML = 
    timeTracker.formatDate(new Date(this.project.startDate));
  $("projectSummary_targetDate").innerHTML = 
    timeTracker.formatDate(new Date(this.project.targetDate));

  // Tasks.
  var tasks = [ ];
  for (var i = 0; i < timeTracker.tasks.length; i++) {
    if (timeTracker.tasks[i].project == this.project.name) {
      // Clone the object so date formatting doesn't modify anything permanent.
      var task = Object.clone(timeTracker.tasks[i]);
      task.targetDate = timeTracker.formatDate(new Date(task.targetDate));
      task.startDate = timeTracker.formatDate(new Date(task.startDate));
      tasks.push(task);
    }
  }
  var content = Mojo.View.render({
    collection : tasks, template: "projectSummary/tasksTemplate"
  }) 
  $("projectSummary_tasks").innerHTML = content;
  

}; // End ProjectSummaryAssistant.prototype.activate().

