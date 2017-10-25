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
 * @param inResource The resource object to show a summary for.
 */
function ResourceSummaryAssistant(inResource) { 
  this.resource = inResource;
};


/**
 * The resource object a summary is being shown for.
 */
ResourceSummaryAssistant.prototype.resource = null;


/**
 * Set up the scene.
 */
ResourceSummaryAssistant.prototype.setup = function() {

  // Enable full-screen mode for this scene.
  this.controller.enableFullScreenMode(true);

}; // End ResourceSummaryAssistant.prototype.setup().


/**
 * Called when the scene is activated.
 */
ResourceSummaryAssistant.prototype.activate = function() {

  // Resource details.
  $("resourceSummary_name").innerHTML = this.resource.name;
  $("resourceSummary_isProjectManager").innerHTML = 
    this.resource.isProjectManager;

  // Tasks.
  var tasks = [ ];
  totalHoursBooked = 0;
  for (var i = 0; i < timeTracker.tasks.length; i++) {
    if (timeTracker.tasks[i].assignedResource == this.resource.name) {
      // Clone the object so date formatting doesn't modify anything permanent.
      var task = Object.clone(timeTracker.tasks[i]);
      totalHoursBooked = totalHoursBooked + task.bookedHours;
      task.targetDate = timeTracker.formatDate(new Date(task.targetDate));
      task.startDate = timeTracker.formatDate(new Date(task.startDate));
      tasks.push(task);
    }
  }
  var content = Mojo.View.render({
    collection : tasks, template: "resourceSummary/tasksTemplate"
  }) 
  $("resourceSummary_tasks").innerHTML = content;

  // Total booked hours (must be done here since it's calculated above).
  $("resourceSummary_totalHoursBooked").innerHTML = totalHoursBooked;  

}; // End ProjectSummaryAssistant.prototype.activate().

