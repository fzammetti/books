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
function CategoryListAssistant() { };   


/**
 * Model for the category list.
 */
CategoryListAssistant.prototype.lstCategoryListModel = { items : [ ] };


/**
 * Set up the scene.
 */
CategoryListAssistant.prototype.setup = function() {

  // Set up application menu.
  this.controller.setupWidget(Mojo.Menu.appMenu, codeCabinet.appMenuAttributes, 
    codeCabinet.appMenuModel); 

  // Set up Spinner.
  this.controller.setupWidget("categoryList_divSpinner",
    { spinnerSize : "large" }, { spinning : true }
  );

  // Set up List.
  this.controller.setupWidget("categoryList_lstCategoryList", {
    addItemLabel : "Add...",
    swipeToDelete : true,
    itemTemplate : "categoryList/list-item"
  }, this.lstCategoryListModel);
  this.controller.listen("categoryList_lstCategoryList", Mojo.Event.listTap, 
    this.selectCategory);
  this.controller.listen("categoryList_lstCategoryList", Mojo.Event.listAdd, 
    this.addCategory);
  this.controller.listen("categoryList_lstCategoryList", Mojo.Event.listDelete, 
    this.deleteCategory.bind(this));

}; // End CategoryListAssistant.prototype.setup().


/**
 * Called when the scene is activated.
 */
CategoryListAssistant.prototype.activate = function() {

  // Retrieve categories, showing Spinner first.
  $("categoryList_divSpinner").show();
  $("categoryList_lstCategoryList").hide();
  this.lstCategoryListModel.items = [ ];
  dao.retrieveCategories(this.processResults.bind(this));
  
}; // End CategoryListAssistant.prototype.activate().


/**
 * Callback executed when the list is populated from the database.
 *
 * @param inResults An array of objects represeting categories.
 */
CategoryListAssistant.prototype.processResults = function(inResults) {

  // Update the model.
  for (var i = 0; i < inResults.length; i++) {
    this.lstCategoryListModel.items.push(inResults[i]);
  }
  
  // Inform the controller of the model change so the list is refreshed.
  this.controller.modelChanged(this.lstCategoryListModel);

  $("categoryList_divSpinner").hide();
  $("categoryList_lstCategoryList").show();

}; // End CategoryListAssistant.prototype.processResults().


/**
 * Called when a category is tapped.
 *
 * @param inEvent Incoming event object.
 */
CategoryListAssistant.prototype.selectCategory = function(inEvent) {

  // Record the current category and push the snippet list scene.
  codeCabinet.currentCategory = inEvent.item;
  Mojo.Controller.stageController.pushScene("snippetList");
  
}; // End CategoryListAssistant.prototype.selectCategory().


/**
 * Called when the Add item is tapped.
 *
 * @param inEvent Incoming event object.
 */
CategoryListAssistant.prototype.addCategory = function() {

  Mojo.Controller.stageController.pushScene("categoryAdd"); 
  
}; // End CategoryListAssistant.prototype.addCategory().


/**
 * Called when an item is swiped to delete it.
 *
 * @param inEvent Incoming event object.
 */
CategoryListAssistant.prototype.deleteCategory = function(inEvent) {

  // Ask DAO to delete the database record(s).
  dao.deleteCategory(inEvent.item.name);
  
  // Update the model (unfortunately, the UI gets updated automatically, but
  // the model is not).
  this.lstCategoryListModel.items.splice(inEvent.index, 1);
  
}; // End CategoryListAssistant.prototype.deleteCategory().
