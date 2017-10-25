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
function AdminResourceAssistant() { };


/**
 * Model for the resource List.
 */
AdminResourceAssistant.prototype.lstResourcesModel = { items : [ ] };


/**
 * Set up the scene.
 */
AdminResourceAssistant.prototype.setup = function() {

  // Enable full-screen mode for this scene.
  this.controller.enableFullScreenMode(true);

  // Set up Spinner for the scrim when calling the service layer.
  this.controller.setupWidget("adminResource_divSpinner",
    { spinnerSize : "large" }, { spinning : true }
  );

  // Set up List.
  this.controller.setupWidget("adminResource_lstResources", {
    addItemLabel : "Add...", swipeToDelete : true, 
    itemTemplate : "adminResource/list-item"
  }, this.lstResourcesModel);
  this.controller.listen("adminResource_lstResources", Mojo.Event.listTap, 
    this.selectResource.bind(this));
  this.controller.listen("adminResource_lstResources", Mojo.Event.listAdd, 
    this.addResource.bind(this));
  this.controller.listen("adminResource_lstResources", Mojo.Event.listDelete, 
    this.deleteResource.bind(this));

}; // End AdminResourceAssistant.prototype.setup().


/**
 * Called when the scene is activated.
 */
AdminResourceAssistant.prototype.activate = function() {

  // Retrieve resources, clearing the List first.
  this.lstResourcesModel.items = [ ];
  this.controller.modelChanged(this.lstResourcesModel);
  $("adminResource_divScrim").show();
  dao.retrieve("resource", this.processResults.bind(this));
  
}; // End AdminResourceAssistant.prototype.activate().


/**
 * Callback executed when the list is populated.
 *
 * @param inResults An array of resource objects.
 */
AdminResourceAssistant.prototype.processResults = function(inResults) {

  if (Object.isArray(inResults)) {
    // Update the model.
    timeTracker.resources = inResults;
    this.lstResourcesModel.items = inResults;
    // Inform the controller of the model change so the list is refreshed.
    this.controller.modelChanged(this.lstResourcesModel);
  } else {
    Mojo.Controller.errorDialog(inResults.responseJSON.error);
  }
  
  // Hide scrim and we're done.
  $("adminResource_divScrim").hide();

}; // End AdminResourceAssistant.prototype.processResults().


/**
 * Select a resource for editing.
 *
 * @param inEvent The incoming event object.
 */
AdminResourceAssistant.prototype.selectResource = function(inEvent) {

  Mojo.Controller.stageController.pushScene("resourceDetails", inEvent.item);

}; // End AdminResourceAssistant.prototype.selectResource().


/**
 * Add a resource.
 */
AdminResourceAssistant.prototype.addResource = function() {

  Mojo.Controller.stageController.pushScene("resourceDetails");

}; // End AdminResourceAssistant.prototype.addResource().


/**
 * Delete a resource.
 */
AdminResourceAssistant.prototype.deleteResource = function() {

  dao.deleteEntity("resource", inEvent.item.name);

}; // End AdminResourceAssistant.prototype.deleteResource().
 