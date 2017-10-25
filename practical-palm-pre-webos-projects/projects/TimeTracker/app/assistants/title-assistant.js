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
function TitleAssistant() { };


/**
 * Flag set when projects have been loaded from the remote service.
 */
TitleAssistant.prototype.projectsLoaded = false;


/**
 * Flag set when resources have been loaded from the remote service.
 */
TitleAssistant.prototype.resourcesLoaded = false;


/**
 * Set up the scene.
 */
TitleAssistant.prototype.setup = function() {

  // Enable full-screen mode for this scene.
  this.controller.enableFullScreenMode(true);

}; // End TitleAssistant.prototype.setup().


/**
 * Called when the scene is activated.  Retrieves the current list of projects
 * and resources from the remote service and warehouse database (note: tasks
 * are not done here because they can only be gotten to through a project, so
 * there's no need to load the up-front here, but there is for projects and
 * resourceS).
 */
TitleAssistant.prototype.activate = function() {

  dao.retrieve("project", this.processProjectResults.bind(this));
  dao.retrieve("resource", this.processResourceResults.bind(this));

}; // End TitleAssistant.prototype.activate().


/**
 * Callback executed when the list of projects is returned by the server.
 *
 * @param inResults An array of project objects.
 */
TitleAssistant.prototype.processProjectResults = function(inResults) {

  if (Object.isArray(inResults)) {
    timeTracker.projects = inResults;
  }
  this.projectsLoaded = true;
  if (this.projectsLoaded && this.resourcesLoaded) {
    Mojo.Controller.stageController.swapScene({
      transition : Mojo.Transition.crossFade, name : "welcome"
    });
  } else {
    $("divInitProgress").innerHTML = 
      $("divInitProgress").innerHTML = "... Initializing (1/2) ...";
  }

}; // End TitleAssistant.prototype.processProjectResults().



/**
 * Callback executed when the list of resources is returned by the server.
 *
 * @param inResults An array of resource objects.
 */
TitleAssistant.prototype.processResourceResults = function(inResults) {

  if (Object.isArray(inResults)) {
    timeTracker.resources = inResults;
  }
  this.resourcesLoaded = true;
  if (this.projectsLoaded && this.resourcesLoaded) {
    Mojo.Controller.stageController.swapScene("welcome");
  } else {
    $("divInitProgress").innerHTML = "... Initializing (1/2) ...";
  }

}; // End TitleAssistant.prototype.processResourceResults().
 