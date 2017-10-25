/*
    Code Cabinet - From the book "Practical webOS Projects With the Palm Pre"
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
function SnippetListAssistant() { };


/**
 * Set up the scene.
 */
SnippetListAssistant.prototype.setup = function() {

  // Set up application menu.
  this.controller.setupWidget(Mojo.Menu.appMenu, codeCabinet.appMenuAttributes, 
    codeCabinet.appMenuModel); 

  // Set up Spinner.
  this.controller.setupWidget("snippetList_divSpinner",
    { spinnerSize : "large" }, { spinning : true }
  );

  // Start off with an empty list, it will be loaded in activate().
  codeCabinet.lstSnippetListModel.items = [ ];

  // Set up List.
  this.controller.setupWidget("snippetList_lstSnippetList", {
    addItemLabel : "Add...",
    itemTemplate : "snippetList/list-item"
  }, codeCabinet.lstSnippetListModel);
  this.controller.listen("snippetList_lstSnippetList", Mojo.Event.listTap, 
    this.selectSnippet);
  this.controller.listen("snippetList_lstSnippetList", Mojo.Event.listAdd, 
    this.addSnippet);

}; // End SnippetListAssistant.prototype.setup().


/**
 * Called when the scene is activated.
 */
SnippetListAssistant.prototype.activate = function() {
  
  // Display category name in title.
  $("main-hdr").innerHTML = codeCabinet.currentCategory.name + " Snippets";

  // Retrieve snippets list, showing Spinner first.
  $("snippetList_divSpinner").show();
  $("snippetList_lstSnippetList").hide();
  codeCabinet.lstSnippetListModel.items = [ ];
  dao.retrieveSnippets(codeCabinet.currentCategory.name,
    this.processResults.bind(this));  
  
}; // End SnippetListAssistant.prototype.activate().


/**
 * Callback executed when the list is populated from the database.
 *
 * @param inResults An array of objects represeting snippets.
 */
SnippetListAssistant.prototype.processResults = function(inResults) {

  // Update the model.
  for (var i = 0; i < inResults.length; i++) {
    codeCabinet.lstSnippetListModel.items.push(inResults[i]);
  }

  // Inform the controller of the model change so the list is refreshed.
  this.controller.modelChanged(codeCabinet.lstSnippetListModel);

  $("snippetList_divSpinner").hide();
  $("snippetList_lstSnippetList").show();

}; // End SnippetListAssistant.prototype.processResults().


/**
 * Called when a snippet is tapped.
 *
 * @param inEvent Incoming event object.
 */
SnippetListAssistant.prototype.selectSnippet = function(inEvent) {

  // Get the snippet descriptor.
  codeCabinet.currentSnippet = inEvent.item;
  
  // Push the scene.
  Mojo.Controller.stageController.pushScene("snippetDetails");
  
}; // End SnippetListAssistant.prototype.selectSnippet().


/**
 * Called when the Add item is tapped.
 *
 * @param inEvent Incoming event object.
 */
SnippetListAssistant.prototype.addSnippet = function() {

  // Make sure no snippet is current and push the snippet details scene.
  codeCabinet.currentSnippet = null;
  Mojo.Controller.stageController.pushScene("snippetDetails"); 
  
}; // End SnippetListAssistant.prototype.addSnippet().
